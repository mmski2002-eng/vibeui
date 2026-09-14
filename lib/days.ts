/**
 * Ряды по дням для графиков.
 *
 * База отдаёт только дни, в которых что-то было; график обязан показать и
 * пустые, иначе две точки за месяц растягиваются на всю ширину и врут о
 * плотности событий.
 */

export type DayRow = { day: string; value: number }

function isoDay(date: Date) {
  return date.toISOString().slice(0, 10)
}

/** Последние `days` дней до `now` включительно, каждый — строкой YYYY-MM-DD. */
export function lastDays(days: number, now = new Date()) {
  const result: string[] = []
  const cursor = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )

  cursor.setUTCDate(cursor.getUTCDate() - days + 1)

  for (let step = 0; step < days; step += 1) {
    result.push(isoDay(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return result
}

/** Дни текущего календарного месяца до сегодняшнего. */
export function monthDays(now = new Date()) {
  const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const result: string[] = []
  const today = isoDay(now)

  for (const cursor = first; isoDay(cursor) <= today; ) {
    result.push(isoDay(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  return result
}

/** Ряд из базы, разложенный по списку дней: недостающие — нули. */
export function fillDays(days: string[], rows: DayRow[]) {
  const map = new Map(rows.map((row) => [row.day, Number(row.value)]))

  return days.map((day) => ({ day, value: map.get(day) ?? 0 }))
}
