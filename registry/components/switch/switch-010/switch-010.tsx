import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch010Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "size"
> & {
  label?: string
  /** Пояснение под подписью: без него строка становится однострочной. */
  description?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: та же строка настройки, что и в базовом переключателе,
// но перед подписью стоит квадратная метка раздела — маленький значок-сигнал,
// который в списке из нескольких настроек помогает узнавать строку взглядом,
// а не чтением текста целиком.
const STYLES = `
:where([data-vibeui-block="switch-010"]){
--vibeui-switch-010-bg:transparent;
--vibeui-switch-010-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-switch-010-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-switch-010-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-switch-010-track:light-dark(oklch(0.88 0.008 265),oklch(0.43 0.014 265));
--vibeui-switch-010-thumb:light-dark(oklch(1 0 0),oklch(0.93 0.004 265));
--vibeui-switch-010-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-switch-010-tint:light-dark(oklch(0.55 0.2 262 / 12%),oklch(0.72 0.17 262 / 20%));
--vibeui-switch-010-hover:light-dark(oklch(0.55 0.02 265 / 7%),oklch(0.88 0.02 265 / 10%));
--vibeui-switch-010-radius:0.625rem;
--vibeui-switch-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-010"]{
box-sizing:border-box;display:flex;align-items:center;gap:0.875rem;
width:100%;max-width:23rem;box-sizing:border-box;
padding:0.625rem 0.75rem;border-radius:var(--vibeui-switch-010-radius);
background:var(--vibeui-switch-010-bg);
border:1px solid var(--vibeui-switch-010-border);
font-family:var(--vibeui-switch-010-font);color:var(--vibeui-switch-010-fg);
cursor:pointer;transition:background-color .16s ease;
}
[data-vibeui-block="switch-010"]:hover:not(:has(input:disabled)){background:var(--vibeui-switch-010-hover)}
[data-vibeui-block="switch-010"]:has(input:disabled){cursor:not-allowed;opacity:.55}
/* Метка раздела: квадрат с приглушённой заливкой и сигналом-точкой внутри,
   узнаётся по цвету и форме быстрее, чем по чтению подписи. */
[data-vibeui-block="switch-010"] [data-part="mark"]{
flex:none;display:grid;place-items:center;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
background:var(--vibeui-switch-010-tint);
}
[data-vibeui-block="switch-010"] [data-part="mark"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-switch-010-accent);
box-shadow:0 0 0 0.1875rem color-mix(in oklab,var(--vibeui-switch-010-accent) 25%,transparent);
}
[data-vibeui-block="switch-010"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-010"] [data-part="title"]{font-size:0.9375rem;line-height:1.35}
[data-vibeui-block="switch-010"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-switch-010-muted)}
[data-vibeui-block="switch-010"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-010"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-010-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-010"] input:checked{background:var(--vibeui-switch-010-accent)}
[data-vibeui-block="switch-010"] input:focus-visible{outline:2px solid var(--vibeui-switch-010-accent);outline-offset:2px}
[data-vibeui-block="switch-010"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-010-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 25%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-010"] input:checked + [data-part="thumb"]{transform:translateX(1.25rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-010"] *{animation:none!important;transition:none!important}}
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
 * Строка настройки с меткой раздела: значок слева, тумблер у края.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch010({
  label = "Push-уведомления",
  description = "Короткие сообщения о важных событиях на телефон.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch010Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-010" precedence="medium">
        {STYLES}
      </style>
      <label
        data-vibeui-block="switch-010"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <span data-part="text">
          <span data-part="title">{label}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        <span data-part="track">
          <input {...props} type="checkbox" role="switch" />
          <span data-part="thumb" aria-hidden="true" />
        </span>
      </label>
    </>
  )
}
