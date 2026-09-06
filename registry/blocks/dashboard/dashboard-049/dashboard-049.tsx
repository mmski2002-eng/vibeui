import type { CSSProperties } from "react"

export type Dashboard049Entry = {
  time: string
  who: string
  role: string
  verb: "Создал" | "Изменил" | "Удалил" | "Вошёл" | "Выгрузил"
  target: string
  from: string
  detail: string
}

export type Dashboard049Props = {
  title?: string
  period?: string
  periods?: string[]
  actor?: string
  actors?: string[]
  entries?: Dashboard049Entry[]
  exportLabel?: string
  keepHint?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись фильтра периода. */
  periodLabel?: string
  /** Подпись фильтра пользователя. */
  actorLabel?: string
  /** Подписи глаголов: ключ — значение verb. */
  verbText?: Record<string, string>
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: журнал действий, где тип действия — не иконка, а слово-глагол в
// плашке: «Удалил» ищут глазами и читают вслух, а пиктограмму корзины ещё надо
// расшифровать. Подробности события (что именно изменилось) раскрываются на
// месте через <details>: в аудите они нужны в одном случае из двадцати, но
// открывать ради них отдельную страницу дорого. Источник — адрес и устройство —
// стоит в каждой строке, потому что в разборе инцидента он важнее самого
// действия. Срок хранения журнала подписан внизу: он определяет, что здесь
// вообще можно найти.
const STYLES = `
:where([data-vibeui-block="dashboard-049"]){
--vibeui-dashboard-049-bg:transparent;
/* Журнал и врезка подробностей: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-049-card:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-dashboard-049-inset:light-dark(oklch(0.97 0 265),oklch(0.22 0 265));
--vibeui-dashboard-049-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-049-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-dashboard-049-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-049-accent:light-dark(oklch(0.5 0.12 265),oklch(0.76 0.11 265));
--vibeui-dashboard-049-soft:light-dark(oklch(0.96 0 265),oklch(0.32 0.04 265));
--vibeui-dashboard-049-del:light-dark(oklch(0.58 0.19 25),oklch(0.73 0.17 25));
--vibeui-dashboard-049-add:light-dark(oklch(0.55 0.13 155),oklch(0.74 0.13 155));
--vibeui-dashboard-049-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-049-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-049"]{color-scheme:dark}
[data-vibeui-block="dashboard-049"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-049-bg);
color:var(--vibeui-dashboard-049-fg);
font-family:var(--vibeui-dashboard-049-sans);
border:1px solid var(--vibeui-dashboard-049-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-049"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-049"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-049"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.75rem}
[data-vibeui-block="dashboard-049"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-049"] [data-part="filters"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin-left:auto;
}
[data-vibeui-block="dashboard-049"] label{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-049-muted);
}
[data-vibeui-block="dashboard-049"] select{
font:inherit;font-size:0.75rem;color:inherit;
padding:0.3125rem 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-049-border);background:var(--vibeui-dashboard-049-card);
}
[data-vibeui-block="dashboard-049"] [data-part="export"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-049-border);
background:var(--vibeui-dashboard-049-card);color:var(--vibeui-dashboard-049-accent);
}
[data-vibeui-block="dashboard-049"] [data-part="log"]{
background:var(--vibeui-dashboard-049-card);
border:1px solid var(--vibeui-dashboard-049-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-049"] details{border-top:1px solid var(--vibeui-dashboard-049-border)}
[data-vibeui-block="dashboard-049"] details:first-of-type{border-top:0}
[data-vibeui-block="dashboard-049"] summary{
display:grid;grid-template-columns:auto 1fr;gap:0.1875rem 0.75rem;align-items:center;
cursor:pointer;list-style:none;padding:0.625rem 0.875rem;
}
[data-vibeui-block="dashboard-049"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-049"] summary:hover{background:var(--vibeui-dashboard-049-inset)}
[data-vibeui-block="dashboard-049"] [data-part="face"]{
grid-row:1/3;width:1.75rem;height:1.75rem;border-radius:50%;flex:none;
display:grid;place-items:center;font-size:0.625rem;font-weight:800;
background:var(--vibeui-dashboard-049-soft);color:var(--vibeui-dashboard-049-accent);
}
[data-vibeui-block="dashboard-049"] [data-part="line"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.4375rem;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-049"] [data-part="who"]{font-weight:750}
[data-vibeui-block="dashboard-049"] [data-part="verb"]{
font-size:0.625rem;font-weight:800;letter-spacing:0.03em;text-transform:uppercase;
padding:0.0625rem 0.375rem;border-radius:0.3125rem;
color:var(--vibeui-dashboard-049-accent);
background:var(--vibeui-dashboard-049-soft);
}
[data-vibeui-block="dashboard-049"] details[data-verb="Удалил"] [data-part="verb"]{
color:var(--vibeui-dashboard-049-del);
background:color-mix(in oklab,var(--vibeui-dashboard-049-del) 14%,var(--vibeui-dashboard-049-card));
}
[data-vibeui-block="dashboard-049"] details[data-verb="Создал"] [data-part="verb"]{
color:var(--vibeui-dashboard-049-add);
background:color-mix(in oklab,var(--vibeui-dashboard-049-add) 14%,var(--vibeui-dashboard-049-card));
}
[data-vibeui-block="dashboard-049"] [data-part="target"]{
font-family:var(--vibeui-dashboard-049-mono);font-size:0.75rem;overflow-wrap:anywhere;
}
[data-vibeui-block="dashboard-049"] [data-part="meta"]{
grid-column:2;font-size:0.625rem;color:var(--vibeui-dashboard-049-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-049"] [data-part="detail"]{
margin:0 0.875rem 0.75rem 3.375rem;padding:0.5rem 0.6875rem;border-radius:0.5rem;
font-family:var(--vibeui-dashboard-049-mono);font-size:0.6875rem;line-height:1.55;
white-space:pre-wrap;overflow-wrap:anywhere;
background:var(--vibeui-dashboard-049-inset);
border:1px solid var(--vibeui-dashboard-049-border);
}
[data-vibeui-block="dashboard-049"] [data-part="keep"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-049-muted);
}
[data-vibeui-block="dashboard-049"] :is(a,button,summary,select):focus-visible{
outline:2px solid var(--vibeui-dashboard-049-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-049"] summary{grid-template-columns:auto 1fr auto;column-gap:1rem}
[data-vibeui-block="dashboard-049"] [data-part="meta"]{
grid-column:3;grid-row:1/3;align-self:center;text-align:right;white-space:nowrap;
}
}
`

const DEFAULT_ENTRIES: Dashboard049Entry[] = [
  {
    time: "17.03, 12:44:31",
    who: "Анна Реброва",
    role: "Администратор",
    verb: "Удалил",
    target: "user:pavel@kontur.ru",
    from: "94.19.44.7 · Chrome, Windows",
    detail:
      "Пользователь исключён из рабочего пространства.\nРоль на момент удаления: Бухгалтер.\nДоступ к 3 проектам отозван.",
  },
  {
    time: "17.03, 12:12:08",
    who: "Игорь Панов",
    role: "Оператор",
    verb: "Изменил",
    target: "invoice:2270",
    from: "94.19.44.19 · Firefox, macOS",
    detail:
      'Поле «Срок оплаты»\n  было:  20.03.2026\n  стало: 27.03.2026\nПоле «Комментарий»\n  было:  ""\n  стало: "Перенос по просьбе клиента"',
  },
  {
    time: "17.03, 11:03:55",
    who: "Мария Соловьёва",
    role: "Администратор",
    verb: "Выгрузил",
    target: "report:clients-2026-q1.csv",
    from: "188.32.8.201 · Chrome, Windows",
    detail:
      "Выгрузка 1 284 строк с персональными данными клиентов.\nФайл доступен по ссылке 24 часа, скачан 1 раз.",
  },
  {
    time: "17.03, 09:01:12",
    who: "Пётр Хромов",
    role: "Оператор",
    verb: "Вошёл",
    target: "session:new",
    from: "10.0.4.61 · Safari, iOS",
    detail:
      "Вход по одноразовому коду из письма.\nУстройство ранее не встречалось: добавлено в список известных.",
  },
]

const VERB_LABEL: Record<string, string> = {
  Создал: "Создал",
  Изменил: "Изменил",
  Удалил: "Удалил",
  Вошёл: "Вошёл",
  Выгрузил: "Выгрузил",
}

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
 * Экран аудита: фильтры по периоду и пользователю, лента действий с
 * глаголом-плашкой, источником и подробностями, раскрытыми на месте.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard049({
  title = "Журнал действий",
  period = "За 7 дней",
  periods = ["За сутки", "За 7 дней", "За месяц", "За квартал"],
  actor = "Все пользователи",
  actors = [
    "Все пользователи",
    "Анна Реброва",
    "Игорь Панов",
    "Мария Соловьёва",
    "Пётр Хромов",
  ],
  entries = DEFAULT_ENTRIES,
  exportLabel = "Выгрузить журнал",
  keepHint = "Записи журнала хранятся 180 дней, затем удаляются без возможности восстановления.",
  accent,
  background = "",
  periodLabel = "Период",
  actorLabel = "Кто",
  verbText = VERB_LABEL,
  className,
  style,
}: Dashboard049Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-049-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-049-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-049" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-049"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <div data-part="filters">
              <label>
                {periodLabel}
                <select defaultValue={period}>
                  {periods.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                {actorLabel}
                <select defaultValue={actor}>
                  {actors.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <button type="button" data-part="export">
                {exportLabel}
              </button>
            </div>
          </div>

          <div data-part="log">
            {entries.map((entry) => (
              <details key={entry.time} data-verb={entry.verb}>
                <summary>
                  <span data-part="face" aria-hidden="true">
                    {entry.who
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word.charAt(0))
                      .join("")}
                  </span>
                  <span data-part="line">
                    <span data-part="who">{entry.who}</span>
                    <span data-part="verb">
                      {verbText[entry.verb] ?? entry.verb}
                    </span>
                    <span data-part="target">{entry.target}</span>
                  </span>
                  <span data-part="meta">
                    {entry.time} · {entry.role} · {entry.from}
                  </span>
                </summary>
                <pre data-part="detail">{entry.detail}</pre>
              </details>
            ))}
          </div>

          <p data-part="keep">{keepHint}</p>
        </div>
      </section>
    </>
  )
}
