import type { ComponentProps, CSSProperties } from "react"

export type Switch001Props = Omit<ComponentProps<"input">, "type" | "size"> & {
  label?: string
  /** Пояснение под подписью: чем включённое состояние отличается от выключенного. */
  description?: string
  /** Сторона, с которой стоит тумблер. По умолчанию справа, как в настройках. */
  align?: "start" | "end"
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переключатель настройки, а не поле формы. Строка занимает
// всю ширину, подпись слева, тумблер прижат к краю — так он читается рядом с
// соседними настройками. Внутри нативный checkbox: состояние, клавиатура и
// форма достаются даром.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="switch-001"]){
--vibeui-switch-001-bg:transparent;
--vibeui-switch-001-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-switch-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-switch-001-muted:color-mix(in oklab,var(--vibeui-switch-001-fg) 68%,transparent);
--vibeui-switch-001-track:light-dark(oklch(0.88 0 265),oklch(0.43 0 265));
--vibeui-switch-001-thumb:light-dark(oklch(1 0 0),oklch(0.93 0 265));
--vibeui-switch-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-switch-001-hover:light-dark(oklch(0.55 0 265 / 7%),oklch(0.88 0 265 / 10%));
--vibeui-switch-001-radius:0.625rem;
--vibeui-switch-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-001"]{color-scheme:dark}
/* Подложки нет: строка держится рамкой и лежит на фоне страницы. */
[data-vibeui-block="switch-001"]{
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-switch-001-bg);
border:1px solid var(--vibeui-switch-001-border);border-radius:0.875rem;
display:flex;align-items:center;gap:1rem;width:100%;box-sizing:border-box;
padding:0.625rem 0.75rem;margin:-0.625rem -0.75rem;
border-radius:var(--vibeui-switch-001-radius);cursor:pointer;
font-family:var(--vibeui-switch-001-font);color:var(--vibeui-switch-001-fg);
transition:background-color .16s ease;
}
[data-vibeui-block="switch-001"][data-align="start"]{flex-direction:row-reverse;justify-content:flex-end}
[data-vibeui-block="switch-001"]:hover:not(:has(input:disabled)){background:var(--vibeui-switch-001-hover)}
[data-vibeui-block="switch-001"]:has(input:disabled){cursor:not-allowed;opacity:.55}
[data-vibeui-block="switch-001"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-001"] [data-part="title"]{font-size:0.875rem;line-height:1.35}
[data-vibeui-block="switch-001"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-switch-001-muted)}
[data-vibeui-block="switch-001"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-001"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-001-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-001"] input:checked{background:var(--vibeui-switch-001-accent)}
[data-vibeui-block="switch-001"] input:focus-visible{outline:2px solid var(--vibeui-switch-001-accent);outline-offset:2px}
[data-vibeui-block="switch-001"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-001-thumb);
box-shadow:0 1px 2px oklch(0.2 0 265 / 25%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-001"] input:checked + [data-part="thumb"]{transform:translateX(1.25rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-001"] *{animation:none!important;transition:none!important}}
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
 * Переключатель настройки: строка целиком, тумблер у края.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch001({
  label = "Двухфакторная защита",
  description = "Запрашивать код из приложения при входе с нового устройства.",
  align = "end",
  background = "",
  accent,
  className,
  style,
  ...props
}: Switch001Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-001" precedence="medium">
        {STYLES}
      </style>
      <label
        data-slot="switch"
        data-vibeui-block="switch-001"
        data-align={align}
        className={className}
        style={palette}
      >
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
