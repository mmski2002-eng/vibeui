import type { CSSProperties } from "react"

export type Dashboard054Hit = {
  kind: string
  title: string
  match: string
  meta: string
}

export type Dashboard054Kind = {
  label: string
  count: number
}

export type Dashboard054Props = {
  query?: string
  placeholder?: string
  found?: string
  kinds?: Dashboard054Kind[]
  activeKind?: string
  hits?: Dashboard054Hit[]
  moreLabel?: string
  tipLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись блока поиска для скринридера. */
  searchLabel?: string
  /** Подпись кнопки очистки запроса. */
  clearLabel?: string
  /** Примеры операторов в подсказке. */
  operators?: string[]
  /** Фраза после списка операторов. */
  tipNote?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: общий поиск, где результаты разных типов лежат в одном списке,
// но каждый несёт свой ярлык типа. Отдельные вкладки на тип прячут находку в
// закрытой вкладке; ярлык рядом со строкой оставляет всё на виду и не мешает
// сузить отбор чипами. Совпадение подсвечено тегом <mark> — это семантика, а
// не только цвет: скринридер объявит выделение. Счётчик найденного объявлен
// aria-live, потому что он меняется от ввода, а подсказка по операторам стоит
// внизу, где её ищут после неудачного запроса.
const STYLES = `
:where([data-vibeui-block="dashboard-054"]){
--vibeui-dashboard-054-bg:transparent;
/* Список и поле ввода: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-054-card:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-dashboard-054-inset:light-dark(oklch(0.97 0 265),oklch(0.22 0 265));
--vibeui-dashboard-054-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-054-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-dashboard-054-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-054-accent:light-dark(oklch(0.52 0.18 268),oklch(0.75 0.14 268));
--vibeui-dashboard-054-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.04 268));
--vibeui-dashboard-054-soft:light-dark(oklch(0.96 0 268),oklch(0.32 0.05 268));
--vibeui-dashboard-054-mark:light-dark(oklch(0.92 0.12 95),oklch(0.66 0.13 95));
--vibeui-dashboard-054-on-mark:light-dark(oklch(0.22 0 265),oklch(0.18 0.03 95));
--vibeui-dashboard-054-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dashboard-054-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-054"]{color-scheme:dark}
[data-vibeui-block="dashboard-054"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-054-bg);
color:var(--vibeui-dashboard-054-fg);
font-family:var(--vibeui-dashboard-054-sans);
border:1px solid var(--vibeui-dashboard-054-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-054"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-054"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.75rem;max-width:52rem;margin:0 auto;width:100%;
}
[data-vibeui-block="dashboard-054"] [data-part="field"]{position:relative}
[data-vibeui-block="dashboard-054"] [data-part="field"] input{
width:100%;font:inherit;font-size:0.9375rem;color:inherit;
padding:0.6875rem 2.5rem 0.6875rem 2.5rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-054-card);
border:1px solid var(--vibeui-dashboard-054-border);
}
[data-vibeui-block="dashboard-054"] [data-part="field"] input:focus-visible{
outline:2px solid var(--vibeui-dashboard-054-accent);outline-offset:1px;
}
[data-vibeui-block="dashboard-054"] [data-part="glass"]{
position:absolute;left:0.9375rem;top:50%;transform:translateY(-50%);
width:0.8125rem;height:0.8125rem;border:1.5px solid var(--vibeui-dashboard-054-muted);border-radius:50%;
}
[data-vibeui-block="dashboard-054"] [data-part="glass"]::after{
content:"";position:absolute;right:-0.3125rem;bottom:-0.3125rem;width:0.4375rem;height:1.5px;
background:var(--vibeui-dashboard-054-muted);transform:rotate(45deg);
}
[data-vibeui-block="dashboard-054"] [data-part="clear"]{
position:absolute;right:0.5rem;top:50%;transform:translateY(-50%);
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
width:1.5rem;height:1.5rem;border-radius:50%;display:grid;place-items:center;
border:1px solid var(--vibeui-dashboard-054-border);
background:var(--vibeui-dashboard-054-inset);color:var(--vibeui-dashboard-054-muted);
}
[data-vibeui-block="dashboard-054"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.625rem;
}
[data-vibeui-block="dashboard-054"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="dashboard-054"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.3125rem;text-decoration:none;
padding:0.25rem 0.625rem;border-radius:9999px;
font-size:0.75rem;font-weight:650;color:var(--vibeui-dashboard-054-muted);
border:1px solid var(--vibeui-dashboard-054-border);background:var(--vibeui-dashboard-054-card);
}
[data-vibeui-block="dashboard-054"] [data-part="chip"][aria-current]{
color:var(--vibeui-dashboard-054-on-accent);background:var(--vibeui-dashboard-054-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-054"] [data-part="chip"] b{
font-weight:750;font-variant-numeric:tabular-nums;opacity:0.75;
}
[data-vibeui-block="dashboard-054"] [data-part="found"]{
margin:0 0 0 auto;font-size:0.75rem;color:var(--vibeui-dashboard-054-muted);
}
[data-vibeui-block="dashboard-054"] [data-part="hits"]{
margin:0;padding:0;list-style:none;
background:var(--vibeui-dashboard-054-card);
border:1px solid var(--vibeui-dashboard-054-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-054"] [data-part="hit"]{
position:relative;display:grid;grid-template-columns:auto 1fr;gap:0.1875rem 0.625rem;
padding:0.625rem 0.875rem;border-top:1px solid var(--vibeui-dashboard-054-border);
}
[data-vibeui-block="dashboard-054"] [data-part="hit"]:first-child{border-top:0}
[data-vibeui-block="dashboard-054"] [data-part="hit"]:has(a:hover){background:var(--vibeui-dashboard-054-inset)}
[data-vibeui-block="dashboard-054"] [data-part="hit"]:has(a:focus-visible){
outline:2px solid var(--vibeui-dashboard-054-accent);outline-offset:-2px;
}
[data-vibeui-block="dashboard-054"] [data-part="kind"]{
grid-row:1/4;align-self:start;margin-top:0.125rem;
min-width:4.75rem;text-align:center;
font-size:0.5625rem;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;
padding:0.1875rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-dashboard-054-soft);color:var(--vibeui-dashboard-054-accent);
}
[data-vibeui-block="dashboard-054"] [data-part="hit"] a{
font-size:0.875rem;font-weight:700;color:inherit;text-decoration:none;
}
/* Ссылка растянута на строку: у списка результатов одна цель на запись. */
[data-vibeui-block="dashboard-054"] [data-part="hit"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="dashboard-054"] [data-part="match"]{
grid-column:2;font-size:0.75rem;line-height:1.5;color:var(--vibeui-dashboard-054-muted);
}
[data-vibeui-block="dashboard-054"] mark{
padding:0 0.125rem;border-radius:0.1875rem;
background:var(--vibeui-dashboard-054-mark);color:var(--vibeui-dashboard-054-on-mark);
}
[data-vibeui-block="dashboard-054"] [data-part="meta"]{
grid-column:2;font-size:0.625rem;color:var(--vibeui-dashboard-054-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-054"] [data-part="more"]{
display:block;text-align:center;padding:0.625rem;
border-top:1px solid var(--vibeui-dashboard-054-border);
font-size:0.75rem;font-weight:700;color:var(--vibeui-dashboard-054-accent);text-decoration:none;
}
[data-vibeui-block="dashboard-054"] [data-part="more"]:hover{background:var(--vibeui-dashboard-054-inset)}
[data-vibeui-block="dashboard-054"] [data-part="tip"]{
margin:0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-dashboard-054-muted);
}
[data-vibeui-block="dashboard-054"] [data-part="tip"] code{
font-family:var(--vibeui-dashboard-054-mono);font-size:0.625rem;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
background:var(--vibeui-dashboard-054-soft);color:var(--vibeui-dashboard-054-accent);
}
[data-vibeui-block="dashboard-054"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-054-accent);outline-offset:2px;
}
@container (min-width: 42rem){
[data-vibeui-block="dashboard-054"] [data-part="hit"]{
grid-template-columns:5.5rem 1fr auto;padding:0.6875rem 1rem;
}
[data-vibeui-block="dashboard-054"] [data-part="meta"]{
grid-column:3;grid-row:1/4;align-self:center;text-align:right;white-space:nowrap;
}
}
`

const DEFAULT_KINDS: Dashboard054Kind[] = [
  { label: "Всё", count: 38 },
  { label: "Клиенты", count: 6 },
  { label: "Документы", count: 14 },
  { label: "Заявки", count: 11 },
  { label: "Люди", count: 3 },
  { label: "Страницы", count: 4 },
]

const DEFAULT_HITS: Dashboard054Hit[] = [
  {
    kind: "Клиент",
    title: "ООО «Северный лес»",
    match:
      "ИНН 7728311021 · менеджер Мария Соловьёва · договор поставки пиломатериалов",
    meta: "изменён 12 минут назад",
  },
  {
    kind: "Документ",
    title: "Договор ДГ-114 от 12.04.2023",
    match:
      "Рамочный договор поставки с «Северным лесом», действует до 31.03.2026",
    meta: "PDF · 1,8 МБ",
  },
  {
    kind: "Заявка",
    title: "ЗА-4821 · Не приходит акт за февраль",
    match: "Клиент «Северный лес» просит повторно выслать акт на почту",
    meta: "просрочена на 40 минут",
  },
  {
    kind: "Документ",
    title: "Счёт № 2270 на 340 000 ₽",
    match: "Закупка фанеры и бруса для «Северного леса», оплачен 16 марта",
    meta: "оплачен",
  },
  {
    kind: "Человек",
    title: "Мария Соловьёва",
    match:
      "Менеджер по работе с клиентами, ведёт «Северный лес» и ещё 14 счетов",
    meta: "в сети",
  },
]

function highlight(text: string, needle: string) {
  if (!needle) {
    return text
  }

  const parts = text.split(new RegExp(`(${needle})`, "iu"))

  return parts.map((part, index) =>
    part.toLowerCase() === needle.toLowerCase() ? (
      <mark key={index}>{part}</mark>
    ) : (
      part
    ),
  )
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
 * Страница общего поиска: поле запроса, чипы типов со счётчиками и список
 * результатов с ярлыком типа и подсвеченным совпадением. Один файл, ноль
 * зависимостей, клиентского JS нет.
 */
export function Dashboard054({
  query = "северный лес",
  placeholder = "Клиенты, документы, заявки, люди",
  found = "Найдено 38 результатов за 0,12 с",
  kinds = DEFAULT_KINDS,
  activeKind = "Всё",
  hits = DEFAULT_HITS,
  moreLabel = "Показать все 38 результатов",
  tipLabel = "Уточните запрос операторами",
  accent,
  background = "",
  searchLabel = "Поиск по приложению",
  clearLabel = "Очистить запрос",
  operators = ["тип:договор", "клиент:«лес»", "после:01.03.2026"],
  tipNote = "Операторы можно сочетать, порядок не важен.",
  className,
  style,
}: Dashboard054Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-054-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-054-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const needle = query.split(" ").slice(-1)[0] ?? ""

  return (
    <>
      <style href="vibeui-dashboard-054" precedence="medium">
        {STYLES}
      </style>
      <search
        data-vibeui-block="dashboard-054"
        className={className}
        style={palette}
        aria-label={searchLabel}
      >
        <div data-part="shell">
          <div data-part="field">
            <span data-part="glass" aria-hidden="true" />
            <label htmlFor="dashboard-054-query" hidden>
              {placeholder}
            </label>
            <input
              id="dashboard-054-query"
              type="search"
              defaultValue={query}
              placeholder={placeholder}
            />
            <button type="button" data-part="clear" aria-label={clearLabel}>
              ×
            </button>
          </div>

          <div data-part="bar">
            <ul data-part="chips">
              {kinds.map((kind) => (
                <li key={kind.label}>
                  <a
                    href="#dashboard-054"
                    data-part="chip"
                    aria-current={
                      kind.label === activeKind ? "page" : undefined
                    }
                  >
                    {kind.label}
                    <b>{kind.count}</b>
                  </a>
                </li>
              ))}
            </ul>
            <p data-part="found" aria-live="polite">
              {found}
            </p>
          </div>

          <ul data-part="hits">
            {hits.map((hit) => (
              <li key={hit.title} data-part="hit">
                <span data-part="kind">{hit.kind}</span>
                <a href="#dashboard-054">{highlight(hit.title, needle)}</a>
                <span data-part="match">{highlight(hit.match, needle)}</span>
                <span data-part="meta">{hit.meta}</span>
              </li>
            ))}
            <li>
              <a href="#dashboard-054" data-part="more">
                {moreLabel}
              </a>
            </li>
          </ul>

          <p data-part="tip">
            {tipLabel}
            {": "}
            {operators.map((operator, index) => (
              <span key={operator}>
                {index > 0 ? ", " : null}
                <code>{operator}</code>
              </span>
            ))}
            {". "}
            {tipNote}
          </p>
        </div>
      </search>
    </>
  )
}
