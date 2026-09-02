import type { CSSProperties } from "react"

export type Dashboard058Candidate = {
  id: string
  label: string
  source: string
  seen: string
  master?: boolean
}

export type Dashboard058FieldRow = {
  field: string
  values: string[]
  conflict: boolean
}

export type Dashboard058Group = {
  key: string
  score: number
  reason: string
  candidates: Dashboard058Candidate[]
  rows: Dashboard058FieldRow[]
}

export type Dashboard058Props = {
  title?: string
  pending?: number
  groups?: Dashboard058Group[]
  mergeLabel?: string
  keepLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Строка об оставшихся группах: {count}. */
  pendingText?: string
  /** Подпись схожести: {score}. */
  scoreText?: string
  /** Заголовок колонки полей. */
  fieldLabel?: string
  /** Пометка строки с расхождением. */
  conflictLabel?: string
  /** Пояснение рядом с кнопками. */
  noteText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: дубликаты объединяют не «по кнопке», а по полям — и главная
// ошибка тут потерять данные, которых нет у выбранного мастера. Поэтому группа
// разложена таблицей «поле × кандидат»: строки с расхождением помечены
// отдельно, а совпадающие сведены в одну спокойную строку. Мастер выбирается
// радиокнопкой в шапке колонки, и через :has() вся колонка мастера
// подсвечивается — иначе на пятой строке уже не помнишь, какой вариант победит.
// Причина склейки подписана словами: доверие к автоматике держится на ней.
const STYLES = `
:where([data-vibeui-block="dashboard-058"]){
--vibeui-dashboard-058-bg:transparent;
/* Карточка группы: подложка блока прозрачна, и рисовать её ею нечем. */
--vibeui-dashboard-058-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 190));
--vibeui-dashboard-058-fg:light-dark(oklch(0.21 0.014 190),oklch(0.94 0.005 190));
--vibeui-dashboard-058-muted:light-dark(oklch(0.55 0.014 190),oklch(0.72 0.012 190));
--vibeui-dashboard-058-border:light-dark(oklch(0.91 0.006 190),oklch(0.36 0.012 190));
--vibeui-dashboard-058-accent:light-dark(oklch(0.5 0.12 190),oklch(0.76 0.11 190));
--vibeui-dashboard-058-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 190));
--vibeui-dashboard-058-soft:light-dark(oklch(0.965 0.02 190),oklch(0.31 0.04 190));
--vibeui-dashboard-058-conflict:light-dark(oklch(0.68 0.15 72),oklch(0.79 0.14 72));
--vibeui-dashboard-058-conflict-soft:light-dark(oklch(0.975 0.02 72),oklch(0.3 0.045 72));
--vibeui-dashboard-058-conflict-ink:light-dark(oklch(0.48 0.11 72),oklch(0.84 0.12 72));
--vibeui-dashboard-058-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-058"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-058-bg);
color:var(--vibeui-dashboard-058-fg);
font-family:var(--vibeui-dashboard-058-sans);
border:1px solid var(--vibeui-dashboard-058-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-058"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-058"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-058"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.75rem}
[data-vibeui-block="dashboard-058"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-058"] [data-part="pending"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-058-muted)}
[data-vibeui-block="dashboard-058"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-058-card);
border:1px solid var(--vibeui-dashboard-058-border);
}
[data-vibeui-block="dashboard-058"] [data-part="why"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.625rem}
[data-vibeui-block="dashboard-058"] [data-part="score"]{
font-size:0.6875rem;font-weight:750;padding:0.1875rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-dashboard-058-soft);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-058"] [data-part="reason"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-058-muted)}
[data-vibeui-block="dashboard-058"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="dashboard-058"] table{border-collapse:collapse;width:100%;min-width:34rem;font-size:0.8125rem}
[data-vibeui-block="dashboard-058"] th{text-align:left;padding:0.5rem 0.625rem;vertical-align:top;border-bottom:1px solid var(--vibeui-dashboard-058-border)}
[data-vibeui-block="dashboard-058"] td{padding:0.5rem 0.625rem;border-bottom:1px solid var(--vibeui-dashboard-058-border);vertical-align:top}
[data-vibeui-block="dashboard-058"] tbody tr:last-child :is(td,th){border-bottom:0}
[data-vibeui-block="dashboard-058"] th[scope="row"]{
font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;
color:var(--vibeui-dashboard-058-muted);white-space:nowrap;width:1%;
}
[data-vibeui-block="dashboard-058"] [data-part="pick"]{display:flex;gap:0.4375rem;align-items:flex-start;cursor:pointer}
[data-vibeui-block="dashboard-058"] input[type="radio"]{margin:0.1875rem 0 0;accent-color:var(--vibeui-dashboard-058-accent);width:0.9375rem;height:0.9375rem}
[data-vibeui-block="dashboard-058"] [data-part="pick"] b{display:block;font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-058"] [data-part="pick"] span{display:block;font-size:0.6875rem;color:var(--vibeui-dashboard-058-muted)}
/* Колонка мастера подсвечивается целиком — выбор виден на любой строке. */
[data-vibeui-block="dashboard-058"] th:has(input[type="radio"]:checked){
background:var(--vibeui-dashboard-058-soft);
box-shadow:inset 0 0.1875rem 0 var(--vibeui-dashboard-058-accent);
}
[data-vibeui-block="dashboard-058"] tr[data-conflict="true"]{background:var(--vibeui-dashboard-058-conflict-soft)}
[data-vibeui-block="dashboard-058"] tr[data-conflict="true"] th[scope="row"]{color:var(--vibeui-dashboard-058-fg)}
[data-vibeui-block="dashboard-058"] [data-part="flag"]{
display:block;font-size:0.5625rem;font-weight:750;text-transform:none;
color:var(--vibeui-dashboard-058-conflict-ink);
}
[data-vibeui-block="dashboard-058"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="dashboard-058"] [data-part="merge"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-058-accent);color:var(--vibeui-dashboard-058-on-accent);
}
[data-vibeui-block="dashboard-058"] [data-part="keep"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 0.9375rem;border-radius:0.625rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-058-border);
}
[data-vibeui-block="dashboard-058"] [data-part="note"]{
margin:0;margin-left:auto;font-size:0.6875rem;color:var(--vibeui-dashboard-058-muted);
}
[data-vibeui-block="dashboard-058"] :is(a,button,input,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-058-accent);outline-offset:2px;
}
`

const DEFAULT_GROUPS: Dashboard058Group[] = [
  {
    key: "severles",
    score: 96,
    reason:
      "Совпали ИНН и домен почты, названия отличаются организационной формой.",
    candidates: [
      {
        id: "c-1042",
        label: "ООО «Северный лес»",
        source: "создан вручную",
        seen: "изменён 12 минут назад",
        master: true,
      },
      {
        id: "c-3318",
        label: "Северный лес, ООО",
        source: "импорт CSV, март",
        seen: "изменён 4 месяца назад",
      },
      {
        id: "c-3907",
        label: "СЕВЕРНЫЙ ЛЕС",
        source: "форма на сайте",
        seen: "изменён 9 дней назад",
      },
    ],
    rows: [
      {
        field: "ИНН",
        values: ["7728311021", "7728311021", "7728311021"],
        conflict: false,
      },
      {
        field: "Почта",
        values: ["info@severles.ru", "info@severles.ru", "sales@severles.ru"],
        conflict: true,
      },
      {
        field: "Телефон",
        values: ["+7 912 445-19-02", "—", "+7 495 118-40-77"],
        conflict: true,
      },
      {
        field: "Менеджер",
        values: ["Ирина К.", "Ирина К.", "не назначен"],
        conflict: true,
      },
      {
        field: "Город",
        values: ["Тюмень", "Тюмень", "Тюмень"],
        conflict: false,
      },
    ],
  },
]

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Экран дедупликации: группа похожих записей разложена таблицей «поле ×
 * кандидат», мастер выбирается радиокнопкой и подсвечивает свою колонку,
 * расхождения помечены строкой. Один файл, ноль зависимостей, без JS.
 */
export function Dashboard058({
  title = "Дубликаты клиентов",
  pending = 23,
  groups = DEFAULT_GROUPS,
  mergeLabel = "Объединить в выбранную",
  keepLabel = "Это разные компании",
  accent,
  background = "",
  pendingText = "осталось разобрать групп: {count}. Разобранные группы больше не предлагаются, даже если совпадение повторится",
  scoreText = "схожесть {score} %",
  fieldLabel = "Поле",
  conflictLabel = "расхождение",
  noteText = "Непустые значения из остальных записей переедут в мастер, связанные заявки и письма — тоже.",
  className,
  style,
}: Dashboard058Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-058-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-058-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-058" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-058"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="pending">
              {pendingText.replace("{count}", String(pending))}
            </p>
          </div>

          {groups.map((group) => (
            <article key={group.key} data-part="group">
              <div data-part="why">
                <span data-part="score">
                  {scoreText.replace("{score}", String(group.score))}
                </span>
                <p data-part="reason">{group.reason}</p>
              </div>

              <div data-part="scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span data-part="reason">{fieldLabel}</span>
                      </th>
                      {group.candidates.map((candidate) => (
                        <th key={candidate.id} scope="col">
                          <label data-part="pick">
                            <input
                              type="radio"
                              name={`dashboard-058-${group.key}`}
                              defaultChecked={candidate.master}
                            />
                            <span>
                              <b>{candidate.label}</b>
                              <span>{candidate.source}</span>
                              <span>{candidate.seen}</span>
                            </span>
                          </label>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row) => (
                      <tr key={row.field} data-conflict={row.conflict}>
                        <th scope="row">
                          {row.field}
                          {row.conflict ? (
                            <span data-part="flag">{conflictLabel}</span>
                          ) : null}
                        </th>
                        {row.values.map((value, index) => (
                          <td key={`${row.field}-${index}`}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div data-part="actions">
                <button type="button" data-part="merge">
                  {mergeLabel}
                </button>
                <button type="button" data-part="keep">
                  {keepLabel}
                </button>
                <p data-part="note">{noteText}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
