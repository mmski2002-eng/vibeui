import type { CSSProperties, ReactNode } from "react"

export type Cascader003Node = {
  label: string
  children?: Cascader003Node[]
}

export type Cascader003Props = {
  id?: string
  heading?: string
  tree?: Cascader003Node[]
  accent?: string
  className?: string
  style?: CSSProperties
}

/**
 * Слотов под якоря ровно столько, сколько веток помещается в разумное меню.
 * Имя якоря нельзя собрать на лету в статическом CSS, поэтому правила
 * генерируются заранее, а ветка получает номер слота при рендере.
 */
const ANCHOR_SLOTS = 24

const ANCHORS = Array.from(
  { length: ANCHOR_SLOTS },
  (_, slot) => `
[data-vibeui-block="cascader-003"] [data-part="branch"][data-anchor="s${slot}"]{anchor-name:--vibeui-cascader-003-s${slot}}
[data-vibeui-block="cascader-003"] [data-part="flyout"][data-anchor="s${slot}"]{position-anchor:--vibeui-cascader-003-s${slot}}`,
).join("")

// Идея компонента: каскад как вложенное меню — ветка раскрывается вправо
// отдельной панелью, а не перерисовывает список на месте. Держится на HTML
// popover: подменю живёт в верхнем слое, Esc и клик мимо закрывают его без
// единой строки JS. Кнопка-раскрыватель третьего уровня лежит внутри панели
// второго, поэтому браузер считает панели вложенными и не гасит родителя.
const STYLES = `
:where([data-vibeui-block="cascader-003"]){
--vibeui-cascader-003-bg:oklch(1 0 0);
--vibeui-cascader-003-fg:oklch(0.23 0.015 285);
--vibeui-cascader-003-muted:oklch(0.55 0.014 285);
--vibeui-cascader-003-border:oklch(0.9 0.006 285);
--vibeui-cascader-003-accent:oklch(0.56 0.17 300);
--vibeui-cascader-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-cascader-003-bg);color:var(--vibeui-cascader-003-fg);
border:1px solid var(--vibeui-cascader-003-border);border-radius:0.875rem;
font-family:var(--vibeui-cascader-003-font);
box-shadow:0 18px 40px -32px oklch(0.2 0.03 285 / 60%);
}
[data-vibeui-block="cascader-003"] *{box-sizing:border-box}
[data-vibeui-block="cascader-003"] [data-part="heading"]{
margin:0 0 0.125rem;padding:0 0.375rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-cascader-003-muted);
}
[data-vibeui-block="cascader-003"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.0625rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="cascader-003"] [data-part="branch"],
[data-vibeui-block="cascader-003"] [data-part="leaf"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
padding:0.4375rem 0.5rem;border:0;border-radius:0.5rem;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;
text-align:left;cursor:pointer;
transition:background-color .14s ease;
}
[data-vibeui-block="cascader-003"] [data-part="branch"] span,
[data-vibeui-block="cascader-003"] [data-part="leaf"] span{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-003"] [data-part="branch"]:hover,
[data-vibeui-block="cascader-003"] [data-part="leaf"]:hover{
background:color-mix(in oklab,var(--vibeui-cascader-003-accent) 10%,transparent);
}
[data-vibeui-block="cascader-003"] [data-part="branch"]:focus-visible,
[data-vibeui-block="cascader-003"] [data-part="leaf"]:focus-visible{
outline:2px solid var(--vibeui-cascader-003-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-003"] [data-part="chevron"]{
flex:0 0 auto;width:0.3125rem;height:0.3125rem;
border-right:1.5px solid var(--vibeui-cascader-003-muted);
border-top:1.5px solid var(--vibeui-cascader-003-muted);
transform:rotate(45deg);
}
[data-vibeui-block="cascader-003"] [data-part="dot"]{
flex:0 0 auto;width:0.3125rem;height:0.3125rem;border-radius:50%;
background:color-mix(in oklab,var(--vibeui-cascader-003-accent) 55%,transparent);
}
/* Панель второго и третьего уровня. Без якорей она открывается по центру
   экрана: это некрасиво, но кликабельно, а скрипта по-прежнему нет. */
[data-vibeui-block="cascader-003"] [data-part="flyout"]{
position:fixed;inset:auto;top:50%;left:50%;translate:-50% -50%;
margin:0;padding:0.3125rem;min-width:11rem;max-width:14rem;list-style:none;
border:1px solid var(--vibeui-cascader-003-border);border-radius:0.75rem;
background:var(--vibeui-cascader-003-bg);color:var(--vibeui-cascader-003-fg);
box-shadow:0 20px 44px -22px oklch(0.2 0.03 285 / 50%);
opacity:0;
transition:opacity .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="cascader-003"] [data-part="flyout"]:popover-open{opacity:1}
@starting-style{
[data-vibeui-block="cascader-003"] [data-part="flyout"]:popover-open{opacity:0}
}
@supports (anchor-name: --a){
[data-vibeui-block="cascader-003"] [data-part="flyout"]{
top:auto;left:auto;translate:none;
position-area:right span-block-end;margin-left:0.25rem;
position-try-fallbacks:flip-inline,flip-block;
}
}
${ANCHORS}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-003"] *{animation:none!important;transition:none!important}
[data-vibeui-block="cascader-003"] [data-part="flyout"]{transition:none!important}
}
`

const DEFAULT_TREE: Cascader003Node[] = [
  {
    label: "Аналитика",
    children: [
      {
        label: "Отчёты",
        children: [
          { label: "Ежедневный" },
          { label: "Когорты" },
          { label: "Воронка" },
        ],
      },
      {
        label: "Экспорт",
        children: [{ label: "CSV" }, { label: "Google Sheets" }],
      },
    ],
  },
  {
    label: "Команда",
    children: [
      {
        label: "Доступы",
        children: [{ label: "Роли" }, { label: "Приглашения" }],
      },
      { label: "Активность", children: [{ label: "Журнал входов" }] },
    ],
  },
  {
    label: "Биллинг",
    children: [
      {
        label: "Тариф",
        children: [{ label: "Смена плана" }, { label: "Лимиты" }],
      },
      { label: "Документы", children: [{ label: "Счета" }, { label: "Акты" }] },
    ],
  },
]

/**
 * Каскадное меню с раскрытием вправо на HTML popover: без клиентского JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader003({
  id = "vibeui-cascader-003",
  heading = "Настройки рабочего пространства",
  tree = DEFAULT_TREE,
  accent,
  className,
  style,
}: Cascader003Props) {
  let cursor = 0

  const renderNodes = (nodes: Cascader003Node[], prefix: string): ReactNode =>
    nodes.map((node, index) => {
      const key = `${prefix}-${index}`

      if (!node.children?.length) {
        return (
          <li key={key}>
            <button data-part="leaf" type="button">
              <i data-part="dot" aria-hidden="true" />
              <span>{node.label}</span>
            </button>
          </li>
        )
      }

      const slot = `s${cursor++ % ANCHOR_SLOTS}`

      return (
        <li key={key}>
          <button
            data-part="branch"
            data-anchor={slot}
            type="button"
            popoverTarget={key}
            aria-label={`${node.label}: открыть вложенный список`}
          >
            <span>{node.label}</span>
            <i data-part="chevron" aria-hidden="true" />
          </button>
          <ul
            id={key}
            data-part="flyout"
            data-anchor={slot}
            popover="auto"
            aria-label={node.label}
          >
            {renderNodes(node.children, key)}
          </ul>
        </li>
      )
    })

  const palette = {
    ...(accent ? { "--vibeui-cascader-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-003" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="cascader-003"
        className={className}
        style={palette}
        aria-label={heading}
        id={id}
      >
        <p data-part="heading">{heading}</p>
        <ul data-part="list">{renderNodes(tree, id)}</ul>
      </nav>
    </>
  )
}
