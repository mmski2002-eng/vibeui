import type { ComponentProps, CSSProperties } from "react"

export type Button041Props = ComponentProps<"button"> & {
  accent?: string
  /** Второй цвет градиента: рамка собирается из пары. */
  accentEnd?: string
  /** Бумага внутри рамки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: градиент живёт в рамке, а не в заливке. Он собран из двух
// фонов — padding-box для бумажной середины и border-box для градиентной
// границы, — поэтому граница остаётся настоящим border. Главное здесь фокус:
// градиент на границе съедает системную обводку, и focus-visible рисуется
// отдельным box-shadow-кольцом плюс outline с отступом.
const STYLES = `
:where([data-vibeui-block="button-041"]){
--vibeui-button-041-paper:light-dark(oklch(1 0 0),oklch(0.23 0 285));
--vibeui-button-041-accent:light-dark(oklch(0.6 0.2 25),oklch(0.7 0.19 25));
--vibeui-button-041-accent-end:light-dark(oklch(0.55 0.2 300),oklch(0.7 0.18 300));
--vibeui-button-041-ink:light-dark(oklch(0.26 0 285),oklch(0.93 0 285));
--vibeui-button-041-radius:0.75rem;
--vibeui-button-041-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-041"]{color-scheme:dark}
[data-vibeui-block="button-041"]{
appearance:none;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 1.125rem;
border:2px solid transparent;border-radius:var(--vibeui-button-041-radius);
/* Два фона: середина по padding-box, градиент по border-box. */
background:
linear-gradient(var(--vibeui-button-041-paper),var(--vibeui-button-041-paper)) padding-box,
linear-gradient(110deg,var(--vibeui-button-041-accent),var(--vibeui-button-041-accent-end)) border-box;
color:var(--vibeui-button-041-ink);
font-family:var(--vibeui-button-041-font);font-size:0.875rem;font-weight:650;line-height:1;
transition:box-shadow .18s ease,color .16s ease;
}
[data-vibeui-block="button-041"]:hover:not(:disabled){
box-shadow:0 10px 24px -16px color-mix(in oklab,var(--vibeui-button-041-accent-end) 90%,transparent);
color:var(--vibeui-button-041-accent-end);
}
/* Кольцо фокуса дублируется box-shadow: outline поверх градиентной границы
   в некоторых движках читается хуже, а кольцо всегда лежит по её форме. */
[data-vibeui-block="button-041"]:focus-visible{
outline:2px solid var(--vibeui-button-041-accent-end);outline-offset:3px;
box-shadow:0 0 0 1px var(--vibeui-button-041-paper);
}
[data-vibeui-block="button-041"]:disabled{cursor:not-allowed;opacity:.5}
[data-vibeui-block="button-041"] [data-part="spark"]{
flex:none;width:0.75rem;height:0.75rem;
background:linear-gradient(110deg,var(--vibeui-button-041-accent),var(--vibeui-button-041-accent-end));
clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-041"]{transition:none!important}}
`

/**
 * Ветка темы для заданной бумаги. Без неё светлая середина досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Кнопка с градиентной рамкой и не сломанным фокусом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button041({
  accent,
  accentEnd,
  background = "",
  type = "button",
  className,
  style,
  children = "Собрать страницу",
  ...props
}: Button041Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-041-accent": accent } : null),
    ...(accentEnd ? { "--vibeui-button-041-accent-end": accentEnd } : null),
    ...(background
      ? {
          "--vibeui-button-041-paper": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-041" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-041"
        className={className}
        style={palette}
      >
        <span data-part="spark" aria-hidden="true" />
        {children}
      </button>
    </>
  )
}
