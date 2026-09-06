import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Input002Props = Omit<ComponentProps<"input">, "size" | "prefix"> & {
  /** Неизменяемая часть слева: протокол, домен, символ валюты. */
  prefix?: ReactNode
  /** Неизменяемая часть справа: домен почты, единица измерения, расширение. */
  suffix?: ReactNode
  label?: string
  /** Пусто — подложки нет, группа лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: приставка и окончание живут внутри той же рамки, что и
// поле, а фокус подсвечивает группу целиком. Пользователь видит будущее
// значение полностью и не набирает то, что и так известно.
const STYLES = `
:where([data-vibeui-block="input-002"]){
--vibeui-input-002-surface:transparent;
--vibeui-input-002-surface-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-input-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-input-002-muted:color-mix(in oklab,var(--vibeui-input-002-fg) 68%,transparent);
--vibeui-input-002-bg:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-input-002-fixed:light-dark(oklch(0.97 0 265),oklch(0.32 0 265));
--vibeui-input-002-border:light-dark(oklch(0.87 0 265),oklch(0.42 0 265));
--vibeui-input-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-input-002-radius:0.625rem;
--vibeui-input-002-height:2.75rem;
--vibeui-input-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-002"]{color-scheme:dark}
[data-vibeui-block="input-002"]{
box-sizing:border-box;
display:flex;flex-direction:column;gap:0.375rem;
font-family:var(--vibeui-input-002-font);color:var(--vibeui-input-002-fg);
}
/* Подложка появляется только вместе с пропом background: без него группа
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-002"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-002-surface);
border:1px solid var(--vibeui-input-002-surface-border);border-radius:0.875rem;
}
[data-vibeui-block="input-002"] [data-part="label"]{
font-size:0.8125rem;font-weight:500;
}
[data-vibeui-block="input-002"] [data-part="group"]{
display:flex;align-items:stretch;overflow:hidden;
height:var(--vibeui-input-002-height);
border:1px solid var(--vibeui-input-002-border);
border-radius:var(--vibeui-input-002-radius);
background:var(--vibeui-input-002-bg);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-002"] [data-part="group"]:focus-within{
border-color:var(--vibeui-input-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-002-accent) 22%,transparent);
}
[data-vibeui-block="input-002"] [data-part="fixed"]{
display:flex;align-items:center;flex:none;
padding:0 0.75rem;
background:var(--vibeui-input-002-fixed);
color:var(--vibeui-input-002-muted);
font-size:0.875rem;white-space:nowrap;user-select:none;
}
[data-vibeui-block="input-002"] [data-part="fixed"][data-side="start"]{border-right:1px solid var(--vibeui-input-002-border)}
[data-vibeui-block="input-002"] [data-part="fixed"][data-side="end"]{border-left:1px solid var(--vibeui-input-002-border)}
[data-vibeui-block="input-002"] input{
flex:1 1 auto;min-width:0;margin:0;border:0;outline:none;
padding:0 0.75rem;background:transparent;color:inherit;
font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="input-002"] input::placeholder{color:color-mix(in oklab,var(--vibeui-input-002-muted) 70%,transparent)}
[data-vibeui-block="input-002"] input:disabled{cursor:not-allowed}
[data-vibeui-block="input-002"]:has(input:disabled) [data-part="group"]{opacity:.55}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Поле с неизменяемой приставкой и окончанием в одной рамке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input002({
  prefix = "vibeui.ru/",
  suffix,
  label = "Адрес страницы",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Input002Props) {
  const palette = {
    ...(accent ? { "--vibeui-input-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-002" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="input"
        data-vibeui-block="input-002"
        data-surface={background ? "on" : undefined}
        className={className}
        style={palette}
      >
        {label ? (
          <label data-part="label" htmlFor={id}>
            {label}
          </label>
        ) : null}
        <div data-part="group">
          {prefix ? (
            <span data-part="fixed" data-side="start">
              {prefix}
            </span>
          ) : null}
          <input {...props} id={id} />
          {suffix ? (
            <span data-part="fixed" data-side="end">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>
    </>
  )
}
