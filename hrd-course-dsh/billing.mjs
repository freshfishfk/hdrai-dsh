import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { costUnits, creditsFromUnits, openCreditLedger, tariff } from './credits.mjs'

export function installCreditBilling(ctx, { initialCredits }) {
  const home = process.env.DSH_HOME
  if (!home) throw new Error('HRD-AI billing requires DSH_HOME')
  if (!Number.isSafeInteger(initialCredits) || initialCredits < 0) {
    throw new Error('initialCredits must be a non-negative integer')
  }

  const ledger = openCreditLedger(join(home, 'hrd-credits.sqlite'), initialCredits)
  const pending = new Set()
  const heartbeat = setInterval(() => {
    try {
      ledger.keepAlive(pending, Date.now())
    } catch (error) {
      ctx.logger.error('HRD-AI credit hold renewal failed: %o', error)
    }
  }, 60_000).unref()
  ctx.effect(() => () => {
    clearInterval(heartbeat)
    ledger.close()
  }, 'HRD-AI credit ledger')

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/api/hrd/credits',
    auth: 'required',
    async resource(request, peer) {
      const headers = { 'Cache-Control': 'no-store' }
      if (peer?.principal.kind !== 'owner') return new Response(null, { status: 403, headers })
      const params = new URL(request.url).searchParams
      const raw = params.get('before')
      const sessionId = params.get('session')
      const before = raw === null ? null : Number(raw)
      if ((before !== null && (!Number.isSafeInteger(before) || before <= 0)) || sessionId?.length > 256) {
        return new Response(null, { status: 400, headers })
      }
      return Response.json(ledger.page(before, Date.now(), sessionId), { headers })
    },
  }), 'HRD-AI credit history')

  ctx.on('session/event', (session, event) => {
    if (event.type !== 'turn/end') return
    const { turn, reason } = event.data
    const id = roundId(session.id, turn)
    if (!pending.has(id)) return
    try {
      const result = ledger.settle(id, ['completed', 'max-tokens'].includes(reason.kind), Date.now())
      pending.delete(id)
      if (!result) return
      if (result.shortfall > 0) {
        ctx.logger.warn('HRD-AI credit estimate exceeded available balance by %d points', result.shortfall)
      }
    } catch (error) {
      pending.delete(id)
      ctx.logger.error('HRD-AI credit settlement failed: %o', error)
    }
  })

  return async function* billedCourseStream(options, state, stream) {
    const { session, turn, course } = state
    const time = Date.now()
    const rates = options.provider === 'deepseek-official' ? tariff(options.model, time) : undefined
    if (!rates || !Number.isSafeInteger(options.maxTokens) || options.maxTokens <= 0) {
      yield decline('当前模型暂不支持积分计费，请重新开启课程会话。')
      return
    }
    const prompt = Math.ceil(ctx.tokenMeter.measure(session).totalTokens * 1.25) + 256
    const reserve = creditsFromUnits(costUnits(rates, { inputTokens: prompt, outputTokens: options.maxTokens }))
    const id = roundId(session.id, turn)
    options.signal?.throwIfAborted()
    if (!ledger.reserve({ id, sessionId: session.id, turn, course }, reserve, time)) {
      yield decline('可用积分不足，无法预扣本轮额度。请在「我的 → 积分」查看余额。')
      return
    }
    pending.add(id)
    const attemptId = randomUUID()
    let usage
    let billable = false
    let stored = false
    try {
      for await (const chunk of stream()) {
        if (chunk.type === 'usage') usage = chunk.usage
        if (chunk.type === 'finish') {
          billable = ['stop', 'max-tokens', 'tool-calls'].includes(chunk.reason.kind)
          storeAttempt()
        }
        yield chunk
      }
    } finally {
      storeAttempt()
    }

    function storeAttempt() {
      if (stored) return
      ledger.recordAttempt(id, {
        id: attemptId, model: options.model, time, rates, usage,
        units: usage ? costUnits(rates, usage) : 0,
        billable: billable && !options.signal?.aborted,
      }, Date.now())
      stored = true
    }
  }
}

function roundId(sessionId, turn) {
  return JSON.stringify([sessionId, turn])
}

function decline(message) {
  return { type: 'finish', reason: { kind: 'error', failure: { code: 'HRD_CREDITS', message } } }
}
