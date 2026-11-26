import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { installCreditBilling } from './billing.mjs'
import { costUnits, creditsFromUnits, openCreditLedger, tariff } from './credits.mjs'

const time = Date.parse('2026-11-26T05:42:00Z')
const flash = tariff('deepseek-flash', time)

function round(turn) {
  return { id: String(turn), sessionId: 'session-1', turn, course: 'module-one-qa' }
}

test('price the real usage buckets and apply the published Beijing pricing windows', () => {
  assert.equal(creditsFromUnits(costUnits(flash, { inputTokens: 1881, outputTokens: 1154 })), 650)
  assert.equal(costUnits(flash, { inputTokens: 100, cacheReadTokens: 50, cacheWriteTokens: 10, outputTokens: 1 }), 11500)
  assert.deepEqual(tariff('deepseek-v4-pro', Date.parse('2026-11-26T06:00:00Z')), [900, 30, 2700])
  assert.deepEqual(tariff('deepseek-flash', Date.parse('2027-01-01T02:00:00Z')), [100, 2, 400])
  assert.deepEqual(tariff('deepseek-flash', Date.parse('2026-11-28T02:00:00Z')), [100, 2, 400])
})

test('persist the grant and apply one round-level debit through concurrent holds and retries', t => {
  const home = mkdtempSync(join(tmpdir(), 'hrd-credit-ledger-'))
  t.after(() => rmSync(home, { recursive: true, force: true }))
  const path = join(home, 'credits.sqlite')
  const ledger = openCreditLedger(path, 10)
  const other = openCreditLedger(path, 90)
  try {
    assert.equal(ledger.reserve(round(1), 8, time), true)
    assert.equal(other.reserve(round(2), 3, time), false)
    assert.equal(other.reserve(round(2), 2, time), true)

    const attempt = { id: 'first', model: 'deepseek-flash', time, rates: flash, units: 400, billable: true }
    ledger.recordAttempt('1', attempt, time)
    ledger.recordAttempt('1', attempt, time)
    assert.equal(ledger.reserve(round(1), 7, time), true)
    ledger.recordAttempt('1', { ...attempt, id: 'failed', units: 6000, billable: false }, time)
    assert.equal(ledger.reserve(round(1), 7, time), true)
    ledger.recordAttempt('1', { ...attempt, id: 'second' }, time)

    assert.deepEqual(ledger.settle('1', true, time), { charged: 1, shortfall: 0 })
    assert.equal(ledger.settle('1', true, time), null)
    assert.deepEqual(other.settle('2', false, time), { charged: 0, shortfall: 0 })
  } finally {
    other.close()
    ledger.close()
  }
  const reopened = openCreditLedger(path, 500)
  t.after(() => reopened.close())
  const history = reopened.page(null, time)
  assert.equal(history.balance, 9)
  assert.deepEqual(history.entries.map(entry => [entry.kind, entry.points]), [['usage', -1], ['grant', 10]])
  assert.equal(history.entries[0].sessionId, 'session-1')
  assert.equal(reopened.page(null, time, 'session-1').sessionSpent, 1)
  assert.equal(reopened.page(null, time, 'other-session').sessionSpent, 0)
})

test('expired holds release the balance and cannot settle later', t => {
  const ledger = openCreditLedger(':memory:', 10)
  t.after(() => ledger.close())
  assert.equal(ledger.reserve(round(1), 10, time), true)
  assert.equal(ledger.page(null, time).balance, 0)
  const later = time + 10 * 60 * 1000
  assert.equal(ledger.page(null, later).balance, 10)
  assert.equal(ledger.settle('1', true, later), null)
})

test('request hook reserves before dispatch and the turn hook settles only completed work', async t => {
  const home = mkdtempSync(join(tmpdir(), 'hrd-credit-hooks-'))
  const before = process.env.DSH_HOME
  process.env.DSH_HOME = home
  t.after(() => {
    if (before === undefined) delete process.env.DSH_HOME
    else process.env.DSH_HOME = before
    rmSync(home, { recursive: true, force: true })
  })
  const cleanups = []
  let route
  let onEvent
  const ctx = {
    effect: fn => cleanups.push(fn()),
    on: (_event, fn) => { onEvent = fn },
    logger: { warn: assert.fail, error: assert.fail },
    tokenMeter: { measure: () => ({ totalTokens: 0 }) },
    webServer: { register: registration => { route = registration; return () => {} } },
  }
  const bill = installCreditBilling(ctx, { initialCredits: 500 })
  try {
    const request = new Request('http://localhost/api/hrd/credits')
    const get = async () => (await route.resource(request, { principal: { kind: 'owner' } })).json()
    assert.equal((await route.resource(request)).status, 403)
    const state = { session: { id: 'session-1' }, turn: 1, course: 'module-one-qa' }
    const options = { provider: 'deepseek-official', model: 'deepseek-flash', maxTokens: 100 }
    let dispatched = false
    async function* provider() {
      dispatched = true
      assert.ok((await get()).balance < 500)
      yield { type: 'usage', usage: { inputTokens: 100, outputTokens: 20 } }
      yield { type: 'finish', reason: { kind: 'stop' } }
    }
    const blocked = await Array.fromAsync(bill({ ...options, maxTokens: 8192 }, state, provider))
    assert.equal(blocked[0].reason.failure.code, 'HRD_CREDITS')
    assert.equal(dispatched, false)

    await Array.fromAsync(bill(options, state, provider))
    assert.equal((await get()).entries.length, 1)
    onEvent(state.session, { type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } })
    const settled = await get()
    assert.equal(settled.entries[0].kind, 'usage')
    assert.ok([18, 36].includes(-settled.entries[0].points))
    assert.equal(settled.balance, 500 + settled.entries[0].points)

    await Array.fromAsync(bill(options, { ...state, turn: 2 }, provider))
    onEvent(state.session, { type: 'turn/end', data: { turn: 2, reason: { kind: 'failed' } } })
    assert.deepEqual(await get(), settled)
  } finally {
    for (const cleanup of cleanups.reverse()) cleanup()
  }
})
