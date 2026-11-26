import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const priceTable = new Map([
  ['deepseek-flash', [100, 2, 400]],
  ['deepseek-v4-flash', [100, 2, 400]],
  ['deepseek-v4-pro', [450, 15, 1350]],
])
// Use the published holiday periods, with the provider's weekday hours in UTC+8.
const holidays = [
  ['2026-01-01', '2026-01-03'], ['2026-02-15', '2026-02-23'],
  ['2026-04-04', '2026-04-06'], ['2026-05-01', '2026-05-05'],
  ['2026-06-19', '2026-06-21'], ['2026-09-25', '2026-09-27'],
  ['2026-10-01', '2026-10-07'], ['2027-01-01', '2027-01-03'],
  ['2027-02-05', '2027-02-13'], ['2027-04-03', '2027-04-05'],
  ['2027-05-01', '2027-05-05'], ['2027-06-09', '2027-06-09'],
  ['2027-09-15', '2027-09-15'], ['2027-10-01', '2027-10-07'],
]

export function tariff(model, now) {
  const rates = priceTable.get(model)
  if (!rates) return undefined
  const local = new Date(now + 8 * 60 * 60 * 1000)
  const date = local.toISOString().slice(0, 10)
  const day = local.getUTCDay()
  const hour = local.getUTCHours()
  const peak = day >= 1 && day <= 5 && ((hour >= 9 && hour < 12) || (hour >= 14 && hour < 18))
    && !holidays.some(([start, end]) => date >= start && date <= end)
  return peak ? rates.map(rate => rate * 2) : rates
}

// Rates are in fen per million tokens. At 10× and 10,000 credits per yuan,
// the integer result of this function is expressed in thousandths of a credit.
export function costUnits([input, cache, output], usage) {
  return (usage.inputTokens + (usage.cacheWriteTokens ?? 0)) * input
    + (usage.cacheReadTokens ?? 0) * cache + usage.outputTokens * output
}

export const creditsFromUnits = units => Math.ceil(units / 1000)
const leaseMs = 10 * 60 * 1000
const pageSize = 30

export function openCreditLedger(path, initialCredits) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 })
  const db = new DatabaseSync(path)
  try {
    db.exec(`
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS credit_round (
        id TEXT PRIMARY KEY, session_id TEXT NOT NULL, turn INTEGER NOT NULL,
        course TEXT NOT NULL, lease_until INTEGER NOT NULL, held INTEGER NOT NULL,
        status TEXT NOT NULL
      ) STRICT;
      CREATE INDEX IF NOT EXISTS credit_round_session ON credit_round(session_id);
      CREATE TABLE IF NOT EXISTS credit_attempt (
        id TEXT PRIMARY KEY, round_id TEXT NOT NULL REFERENCES credit_round(id),
        model TEXT NOT NULL, started_at INTEGER NOT NULL, rates TEXT NOT NULL,
        usage TEXT, units INTEGER NOT NULL, billable INTEGER NOT NULL
      ) STRICT;
      CREATE INDEX IF NOT EXISTS credit_attempt_round ON credit_attempt(round_id);
      CREATE TABLE IF NOT EXISTS credit_entry (
        id INTEGER PRIMARY KEY, event TEXT NOT NULL UNIQUE, kind TEXT NOT NULL,
        delta INTEGER NOT NULL, time INTEGER NOT NULL,
        round_id TEXT REFERENCES credit_round(id)
      ) STRICT;
      CREATE INDEX IF NOT EXISTS credit_entry_round ON credit_entry(round_id);
    `)
    db.prepare(`
      INSERT INTO credit_entry(event, kind, delta, time)
      VALUES ('opening-grant', 'grant', ?, ?) ON CONFLICT(event) DO NOTHING
    `).run(initialCredits, Date.now())
  } catch (error) {
    db.close()
    throw error
  }

  function transact(fn) {
    db.exec('BEGIN IMMEDIATE')
    try {
      const value = fn()
      db.exec('COMMIT')
      return value
    } catch (error) {
      db.exec('ROLLBACK')
      throw error
    }
  }

  const balances = db.prepare(`
    SELECT (SELECT COALESCE(SUM(delta), 0) FROM credit_entry) AS total,
      (SELECT COALESCE(SUM(held), 0) FROM credit_round WHERE status = 'open') AS held
  `)
  const roundById = db.prepare('SELECT status, held FROM credit_round WHERE id = ?')
  const billedUnits = db.prepare('SELECT COALESCE(SUM(units), 0) AS units FROM credit_attempt WHERE round_id = ? AND billable = 1')
  const expire = db.prepare("UPDATE credit_round SET status = 'interrupted', held = 0 WHERE status = 'open' AND lease_until <= ?")
  const changeHold = db.prepare("UPDATE credit_round SET held = ?, lease_until = ? WHERE id = ? AND status = 'open'")
  const closeRound = db.prepare("UPDATE credit_round SET status = ?, held = 0 WHERE id = ? AND status = 'open'")
  const extend = db.prepare("UPDATE credit_round SET lease_until = ? WHERE id = ? AND status = 'open'")

  function available() {
    const { total, held } = balances.get()
    return total - held
  }

  return {
    reserve(round, amount, now) {
      return transact(() => {
        expire.run(now)
        const existing = roundById.get(round.id)
        if ((existing && existing.status !== 'open') || available() < amount) return false
        if (existing) {
          changeHold.run(existing.held + amount, now + leaseMs, round.id)
        } else {
          db.prepare(`
            INSERT INTO credit_round(id, session_id, turn, course, lease_until, held, status)
            VALUES (?, ?, ?, ?, ?, ?, 'open')
          `).run(round.id, round.sessionId, round.turn, round.course, now + leaseMs, amount)
        }
        return true
      })
    },
    recordAttempt(roundId, attempt, now) {
      transact(() => {
        const result = db.prepare(`
          INSERT INTO credit_attempt(id, round_id, model, started_at, rates, usage, units, billable)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING
        `).run(attempt.id, roundId, attempt.model, attempt.time, JSON.stringify(attempt.rates),
          attempt.usage ? JSON.stringify(attempt.usage) : null, attempt.units, attempt.billable ? 1 : 0)
        if (result.changes === 0) return
        const round = roundById.get(roundId)
        if (round.status !== 'open') return
        const wanted = creditsFromUnits(billedUnits.get(roundId).units)
        // Resize the hold to the billable work so subsequent steps can reserve separately.
        changeHold.run(Math.min(wanted, round.held + available()), now + leaseMs, roundId)
      })
    },
    settle(roundId, completed, now) {
      return transact(() => {
        const round = roundById.get(roundId)
        if (round?.status !== 'open') return null
        const target = completed ? creditsFromUnits(billedUnits.get(roundId).units) : 0
        const charged = Math.min(target, round.held + available())
        closeRound.run(completed ? 'completed' : 'released', roundId)
        if (charged > 0) {
          db.prepare(`
            INSERT INTO credit_entry(event, kind, delta, time, round_id)
            VALUES (?, 'usage', ?, ?, ?)
          `).run(roundId, -charged, now, roundId)
        }
        return { charged, shortfall: target - charged }
      })
    },
    keepAlive(ids, now) {
      if (ids.size === 0) return
      transact(() => {
        for (const id of ids) extend.run(now + leaseMs, id)
      })
    },
    page(before, now, sessionId = null) {
      return transact(() => {
        expire.run(now)
        const entries = db.prepare(`
          SELECT e.id, e.kind, e.delta AS points, e.time, r.course, r.session_id AS sessionId, r.turn
          FROM credit_entry e LEFT JOIN credit_round r ON r.id = e.round_id
          WHERE (? IS NULL OR e.id < ?) ORDER BY e.id DESC LIMIT ?
        `).all(before, before, pageSize + 1)
        const hasMore = entries.length > pageSize
        if (hasMore) entries.pop()
        const sessionSpent = sessionId === null ? null : db.prepare(`
          SELECT COALESCE(SUM(-e.delta), 0) AS spent FROM credit_round r
          JOIN credit_entry e ON e.round_id = r.id WHERE r.session_id = ? AND e.kind = 'usage'
        `).get(sessionId).spent
        return { balance: available(), entries, nextCursor: hasMore ? entries.at(-1).id : null, sessionSpent }
      })
    },
    close() { db.close() },
  }
}
