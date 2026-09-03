import type { ComponentProps, CSSProperties } from "react"

export type Scrollarea005Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  items?: string[]
  /** Сколько строк видно без прокрутки: из них и считается высота области. */
  rows?: number
  /** Подпись вместимости. {visible} и {total} подставляются числами. */
  capacityText?: string
  /** Подсказка справа в подвале. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: высота области задана не пикселями, а числом видимых
// строк — высота строки и число строк перемножаются в одной переменной.
// Поэтому обрезка всегда приходится на границу строки, а не на её середину,
// и подпись «видно 6 из 18» не врёт. Номера рисует CSS-счётчик: в разметке
// их нет, и при смене порядка список не надо перенумеровывать руками.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="scrollarea-005"]){
--vibeui-scrollarea-005-bg:transparent;
--vibeui-scrollarea-005-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-scrollarea-005-muted:color-mix(in oklab,var(--vibeui-scrollarea-005-fg) 68%,transparent);
--vibeui-scrollarea-005-border:light-dark(oklch(0.9 0.006 265),oklch(0.33 0.012 265));
--vibeui-scrollarea-005-rule:light-dark(oklch(0.955 0.004 265),oklch(0.28 0.01 265));
--vibeui-scrollarea-005-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-scrollarea-005-row:2.25rem;
--vibeui-scrollarea-005-rows:6;
--vibeui-scrollarea-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollarea-005"]{color-scheme:dark}
[data-vibeui-block="scrollarea-005"]{
display:flex;flex-direction:column;
width:100%;max-width:21rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-scrollarea-005-bg);
border:1px solid var(--vibeui-scrollarea-005-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollarea-005-font);color:var(--vibeui-scrollarea-005-fg);
}
[data-vibeui-block="scrollarea-005"] [data-part="head"],
[data-vibeui-block="scrollarea-005"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5625rem 0.875rem;font-size:0.75rem;
}
[data-vibeui-block="scrollarea-005"] [data-part="head"]{
border-bottom:1px solid var(--vibeui-scrollarea-005-border);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="scrollarea-005"] [data-part="foot"]{
border-top:1px solid var(--vibeui-scrollarea-005-border);
color:var(--vibeui-scrollarea-005-muted);font-variant-numeric:tabular-nums;
}
/* Высота = строка × число строк: обрезка всегда на границе строки. */
[data-vibeui-block="scrollarea-005"] [data-part="area"]{
height:calc(var(--vibeui-scrollarea-005-row) * var(--vibeui-scrollarea-005-rows));
overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;
}
[data-vibeui-block="scrollarea-005"] [data-part="area"]:focus-visible{
outline:2px solid var(--vibeui-scrollarea-005-accent);outline-offset:-2px;
}
[data-vibeui-block="scrollarea-005"] ol{
margin:0;padding:0;list-style:none;counter-reset:vibeui-scrollarea-005-row;
}
[data-vibeui-block="scrollarea-005"] li{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;height:var(--vibeui-scrollarea-005-row);
padding:0 0.875rem;font-size:0.8125rem;
counter-increment:vibeui-scrollarea-005-row;
}
[data-vibeui-block="scrollarea-005"] li + li{border-top:1px solid var(--vibeui-scrollarea-005-rule)}
/* Номера рисует счётчик: в разметке их нет и перенумеровывать нечего. */
[data-vibeui-block="scrollarea-005"] li::before{
content:counter(vibeui-scrollarea-005-row);
flex:none;min-width:1.25rem;
color:var(--vibeui-scrollarea-005-muted);
font-size:0.6875rem;font-variant-numeric:tabular-nums;text-align:right;
}
[data-vibeui-block="scrollarea-005"] li span{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollarea-005"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_ITEMS = [
  "Сборка 4821 · успешно",
  "Сборка 4820 · успешно",
  "Сборка 4819 · упала на тестах",
  "Сборка 4818 · успешно",
  "Сборка 4817 · отменена",
  "Сборка 4816 · успешно",
  "Сборка 4815 · успешно",
  "Сборка 4814 · упала на линтере",
  "Сборка 4813 · успешно",
  "Сборка 4812 · успешно",
  "Сборка 4811 · успешно",
  "Сборка 4810 · отменена",
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/**
 * Область фиксированной высоты в строках, с нумерацией от CSS-счётчика.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea005({
  title = "История сборок",
  items = DEFAULT_ITEMS,
  rows = 6,
  capacityText = "видно {visible} из {total}",
  hint = "прокрутите список",
  background = "",
  className,
  style,
  ...props
}: Scrollarea005Props) {
  const visible = Math.min(items.length, Math.max(1, rows))
  const palette = {
    "--vibeui-scrollarea-005-rows": visible,
    ...(background
      ? {
          "--vibeui-scrollarea-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scroll-area"
        data-vibeui-block="scrollarea-005"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{title}</span>
          <span>{items.length}</span>
        </div>
        <div data-part="area" tabIndex={0} role="region" aria-label={title}>
          <ol>
            {items.map((item) => (
              <li key={item}>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div data-part="foot">
          <span>
            {capacityText
              .replace("{visible}", String(visible))
              .replace("{total}", String(items.length))}
          </span>
          <span>{hint}</span>
        </div>
      </div>
    </>
  )
}
