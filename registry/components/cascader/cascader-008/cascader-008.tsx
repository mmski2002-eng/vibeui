import type { CSSProperties, ReactNode } from "react"

export type Cascader008Node = {
  label: string
  open?: boolean
  children?: Cascader008Node[]
}

export type Cascader008Props = {
  name?: string
  heading?: string
  tree?: Cascader008Node[]
  /** Путь листа, отмеченного сразу: подписи через «/». */
  defaultValue?: string
  /** Пояснение под деревом. */
  hintText?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: каскад, который переживёт выключенный JS. Ветки — нативные
// <details>, лист — radio с общим именем, поэтому дерево можно положить в
// обычную форму и отправить POST'ом. Выбранная ветка подсвечивается по всей
// глубине через :has(input:checked): без этого при свёрнутых уровнях
// непонятно, где именно стоит отметка.
const STYLES = `
:where([data-vibeui-block="cascader-008"]){
--vibeui-cascader-008-bg:transparent;
--vibeui-cascader-008-fg:light-dark(oklch(0.23 0.014 160),oklch(0.94 0.006 160));
--vibeui-cascader-008-muted:color-mix(in oklab,var(--vibeui-cascader-008-fg) 68%,transparent);
--vibeui-cascader-008-border:light-dark(oklch(0.9 0.006 160),oklch(0.38 0.011 160));
--vibeui-cascader-008-accent:light-dark(oklch(0.5 0.13 165),oklch(0.76 0.13 165));
--vibeui-cascader-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cascader-008"]{color-scheme:dark}
[data-vibeui-block="cascader-008"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-008-bg);color:var(--vibeui-cascader-008-fg);
border:1px solid var(--vibeui-cascader-008-border);border-radius:1rem;
font-family:var(--vibeui-cascader-008-font);
box-shadow:0 18px 40px -32px oklch(0.2 0.03 160 / 55%);
}
[data-vibeui-block="cascader-008"] *{box-sizing:border-box}
[data-vibeui-block="cascader-008"] [data-part="legend"]{
padding:0;margin:0 0 0.125rem;font-size:0.8125rem;font-weight:650;
letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-008"] [data-part="set"]{
border:0;margin:0;padding:0;min-width:0;
}
[data-vibeui-block="cascader-008"] [data-part="node"]{
border-radius:0.5rem;
}
[data-vibeui-block="cascader-008"] summary{
display:flex;align-items:center;gap:0.5rem;
padding:0.3125rem 0.4375rem;border-radius:0.5rem;cursor:pointer;
font-size:0.8125rem;list-style:none;
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="cascader-008"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="cascader-008"] summary:hover{
background:color-mix(in oklab,var(--vibeui-cascader-008-accent) 9%,transparent);
}
[data-vibeui-block="cascader-008"] summary:focus-visible{
outline:2px solid var(--vibeui-cascader-008-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-008"] [data-part="tw"]{
flex:0 0 auto;width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-cascader-008-muted);
border-top:1.5px solid var(--vibeui-cascader-008-muted);
transform:rotate(45deg);
transition:transform .16s ease;
}
[data-vibeui-block="cascader-008"] [data-part="node"][open] > summary [data-part="tw"]{
transform:rotate(135deg);
}
/* Отметка может лежать в свёрнутой ветке — подсвечиваем весь путь до неё. */
[data-vibeui-block="cascader-008"] [data-part="node"]:has(input:checked) > summary{
color:var(--vibeui-cascader-008-accent);font-weight:650;
}
[data-vibeui-block="cascader-008"] [data-part="branch"]{
display:flex;flex-direction:column;gap:0.0625rem;
margin:0.125rem 0 0.25rem 0.6875rem;padding:0 0 0 0.6875rem;
border-left:1px solid var(--vibeui-cascader-008-border);
}
[data-vibeui-block="cascader-008"] [data-part="leaf"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.3125rem 0.4375rem;border-radius:0.5rem;cursor:pointer;
font-size:0.8125rem;
transition:background-color .14s ease;
}
[data-vibeui-block="cascader-008"] [data-part="leaf"]:hover{
background:color-mix(in oklab,var(--vibeui-cascader-008-accent) 9%,transparent);
}
[data-vibeui-block="cascader-008"] [data-part="leaf"]:has(input:focus-visible){
outline:2px solid var(--vibeui-cascader-008-accent);outline-offset:-2px;
}
[data-vibeui-block="cascader-008"] [data-part="leaf"]:has(input:checked){
color:var(--vibeui-cascader-008-accent);font-weight:600;
background:color-mix(in oklab,var(--vibeui-cascader-008-accent) 12%,transparent);
}
[data-vibeui-block="cascader-008"] input[type="radio"]{
flex:0 0 auto;width:0.875rem;height:0.875rem;margin:0;
accent-color:var(--vibeui-cascader-008-accent);
}
[data-vibeui-block="cascader-008"] [data-part="hint"]{
margin:0;padding-top:0.5rem;border-top:1px solid var(--vibeui-cascader-008-border);
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-cascader-008-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-008"] *{animation:none!important;transition:none!important}
}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

const DEFAULT_TREE: Cascader008Node[] = [
  {
    label: "Документы",
    open: true,
    children: [
      {
        label: "Договоры",
        open: true,
        children: [
          { label: "Рамочные" },
          { label: "Дополнительные соглашения" },
        ],
      },
      {
        label: "Бухгалтерия",
        children: [{ label: "Счета" }, { label: "Акты" }],
      },
    ],
  },
  {
    label: "Материалы",
    children: [
      {
        label: "Презентации",
        children: [{ label: "Для клиентов" }, { label: "Внутренние" }],
      },
      { label: "Медиа", children: [{ label: "Логотипы" }, { label: "Фото" }] },
    ],
  },
]

/**
 * Дерево на <details> и radio: каскадный выбор без единой строки клиентского JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader008({
  name = "vibeui-cascader-008",
  heading = "Куда положить файл",
  tree = DEFAULT_TREE,
  defaultValue = "Документы/Договоры/Рамочные",
  hintText = "Уровни — нативные details, лист — radio с общим именем: дерево отправляется обычной формой даже без JavaScript.",
  background = "",
  accent,
  className,
  style,
}: Cascader008Props) {
  const renderNodes = (nodes: Cascader008Node[], trail: string[]): ReactNode =>
    nodes.map((node) => {
      const path = [...trail, node.label]

      if (!node.children?.length) {
        return (
          <label key={path.join("/")} data-part="leaf">
            <input
              type="radio"
              name={name}
              value={path.join("/")}
              defaultChecked={path.join("/") === defaultValue}
            />
            {node.label}
          </label>
        )
      }

      return (
        <details key={path.join("/")} data-part="node" open={node.open}>
          <summary>
            <i data-part="tw" aria-hidden="true" />
            {node.label}
          </summary>
          <div data-part="branch">{renderNodes(node.children, path)}</div>
        </details>
      )
    })

  const palette = {
    ...(accent ? { "--vibeui-cascader-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-008" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="cascader"
        data-vibeui-block="cascader-008"
        className={className}
        style={palette}
      >
        <fieldset data-part="set">
          <p data-part="legend">{heading}</p>
          {renderNodes(tree, [])}
        </fieldset>
        <p data-part="hint">{hintText}</p>
      </div>
    </>
  )
}
