import type { ComponentProps, CSSProperties } from "react"

export type Button030Props = Omit<ComponentProps<"button">, "children"> & {
  label?: string
  /** Сколько непрочитанного. Ноль прячет бейдж целиком. */
  count?: number
  /** С какого числа показывать «99+». */
  cap?: number
  /** Шаблон имени для скринридера: {label} и {count} подставляются. */
  unreadText?: string
  /** Пусто — подложки нет, кнопка лежит прямо на фоне страницы. */
  background?: string
  badge?: string
}

// Идея компонента: счётчик поверх угла кнопки. Число попадает и в бейдж, и в
// aria-label, поэтому «12 непрочитанных» слышно, а не только видно. Бейдж
// обведён кольцом цвета подложки — иначе цифра на границе значка теряется, —
// а большие числа схлопываются в «99+», чтобы кнопка не растягивалась.
const STYLES = `
:where([data-vibeui-block="button-030"]){
--vibeui-button-030-bg:transparent;
--vibeui-button-030-ring:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-button-030-fg:light-dark(oklch(0.32 0 265),oklch(0.9 0 265));
--vibeui-button-030-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-button-030-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-030-badge:light-dark(oklch(0.55 0.19 25),oklch(0.68 0.17 25));
--vibeui-button-030-badge-fg:light-dark(oklch(0.99 0.01 25),oklch(0.19 0.03 25));
--vibeui-button-030-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-030"]{color-scheme:dark}
[data-vibeui-block="button-030"]{
appearance:none;cursor:pointer;position:relative;
display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;padding:0;box-sizing:border-box;
border:1px solid var(--vibeui-button-030-border);border-radius:0.75rem;
background:var(--vibeui-button-030-bg);color:var(--vibeui-button-030-fg);
font-family:var(--vibeui-button-030-font);
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="button-030"]:hover{color:var(--vibeui-button-030-accent);border-color:var(--vibeui-button-030-accent)}
[data-vibeui-block="button-030"]:focus-visible{outline:2px solid var(--vibeui-button-030-accent);outline-offset:2px}
[data-vibeui-block="button-030"] [data-part="bell"]{
position:relative;width:0.875rem;height:0.8125rem;box-sizing:border-box;
border:1.5px solid currentColor;border-bottom:0;border-radius:0.5rem 0.5rem 0.0625rem 0.0625rem;
}
[data-vibeui-block="button-030"] [data-part="bell"]::before{
content:"";position:absolute;left:-0.1875rem;bottom:-1.5px;width:1.1875rem;height:1.5px;
border-radius:1px;background:currentColor;
}
[data-vibeui-block="button-030"] [data-part="bell"]::after{
content:"";position:absolute;left:50%;bottom:-0.3125rem;width:0.3125rem;height:0.1875rem;
margin-left:-0.15625rem;border-radius:0 0 0.15625rem 0.15625rem;background:currentColor;
}
/* Кольцо цвета страницы: цифра не липнет к краю значка. */
[data-vibeui-block="button-030"] [data-part="badge"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
display:inline-flex;align-items:center;justify-content:center;
min-width:1.125rem;height:1.125rem;padding:0 0.25rem;box-sizing:border-box;
border-radius:9999px;
background:var(--vibeui-button-030-badge);color:var(--vibeui-button-030-badge-fg);
box-shadow:0 0 0 2px var(--vibeui-button-030-ring);
font-size:0.6875rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="button-030"] [data-part="halo"]{
position:absolute;top:-0.3125rem;right:-0.3125rem;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-button-030-badge);
animation:vibeui-button-030-halo 2.4s ease-out infinite;
}
@keyframes vibeui-button-030-halo{
0%{opacity:.45;transform:scale(1)}
70%,100%{opacity:0;transform:scale(1.9)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="button-030"] *{animation:none!important;transition:none!important}
[data-vibeui-block="button-030"] [data-part="halo"]{display:none}
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

/**
 * Иконочная кнопка со счётчиком непрочитанного в углу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button030({
  label = "Уведомления",
  count = 12,
  cap = 99,
  unreadText = "{label}: {count} непрочитанных",
  background = "",
  badge,
  type = "button",
  className,
  style,
  ...props
}: Button030Props) {
  const shown = count > cap ? `${cap}+` : String(count)

  const palette = {
    ...(badge ? { "--vibeui-button-030-badge": badge } : null),
    ...(background
      ? {
          "--vibeui-button-030-bg": background,
          "--vibeui-button-030-ring": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-030" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        type={type}
        data-slot="button"
        data-vibeui-block="button-030"
        className={className}
        style={palette}
        aria-label={
          count > 0
            ? unreadText
                .replace("{label}", label)
                .replace("{count}", String(count))
            : label
        }
      >
        <span data-part="bell" aria-hidden="true" />
        {count > 0 ? (
          <>
            <span data-part="halo" aria-hidden="true" />
            <span data-part="badge" aria-hidden="true">
              {shown}
            </span>
          </>
        ) : null}
      </button>
    </>
  )
}
