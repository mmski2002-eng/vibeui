import type { ComponentProps, CSSProperties } from "react"

export type Switch004Props = Omit<ComponentProps<"input">, "type" | "size"> & {
  label?: string
  /** Подписи состояний под названием: видима всегда ровно одна. */
  onText?: string
  offText?: string
  /** Пусто — подложки нет, строка держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: состояние видно и без цвета. В бегунке едет значок —
// галочка при включении, косой крест при выключении, — а под названием
// стоит слово «включён» или «выключен». Значки нарисованы рамкой и
// псевдоэлементами, поэтому иконочный пакет не нужен.
const STYLES = `
:where([data-vibeui-block="switch-004"]){
--vibeui-switch-004-bg:transparent;
--vibeui-switch-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-switch-004-muted:color-mix(in oklab,var(--vibeui-switch-004-fg) 68%,transparent);
--vibeui-switch-004-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-switch-004-track:light-dark(oklch(0.72 0 265),oklch(0.46 0 265));
--vibeui-switch-004-thumb:light-dark(oklch(1 0 0),oklch(0.94 0 265));
--vibeui-switch-004-accent:light-dark(oklch(0.55 0.16 155),oklch(0.68 0.15 155));
--vibeui-switch-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-004"]{color-scheme:dark}
[data-vibeui-block="switch-004"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-switch-004-bg);
border:1px solid var(--vibeui-switch-004-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-004-font);color:var(--vibeui-switch-004-fg);
font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="switch-004"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="switch-004"] [data-part="state"]{font-size:0.75rem;color:var(--vibeui-switch-004-muted)}
/* Видима ровно одна подпись состояния: :has() смотрит на сам input,
   поэтому текст и бегунок не могут разойтись. */
[data-vibeui-block="switch-004"] [data-part="on-text"]{display:none}
[data-vibeui-block="switch-004"]:has(input:checked) [data-part="on-text"]{display:inline}
[data-vibeui-block="switch-004"]:has(input:checked) [data-part="off-text"]{display:none}
[data-vibeui-block="switch-004"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-004"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:3.5rem;height:1.875rem;border-radius:9999px;
background:var(--vibeui-switch-004-track);cursor:inherit;
transition:background-color .2s ease;
}
[data-vibeui-block="switch-004"] input:checked{background:var(--vibeui-switch-004-accent)}
[data-vibeui-block="switch-004"] input:focus-visible{outline:2px solid var(--vibeui-switch-004-accent);outline-offset:2px}
[data-vibeui-block="switch-004"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
display:grid;place-items:center;
width:1.5rem;height:1.5rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-004-thumb);
box-shadow:0 1px 3px oklch(0.2 0 265 / 30%);
transition:transform .2s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-004"] input:checked + [data-part="thumb"]{transform:translateX(1.625rem)}
/* Крест: две линии одного псевдоэлемента, повёрнутые в разные стороны. */
[data-vibeui-block="switch-004"] [data-part="off-mark"]{
position:relative;width:0.625rem;height:0.625rem;color:var(--vibeui-switch-004-muted);
}
[data-vibeui-block="switch-004"] [data-part="off-mark"]::before,
[data-vibeui-block="switch-004"] [data-part="off-mark"]::after{
content:"";position:absolute;left:50%;top:0;
width:1.5px;height:100%;margin-left:-0.75px;background:currentColor;border-radius:1px;
}
[data-vibeui-block="switch-004"] [data-part="off-mark"]::before{transform:rotate(45deg)}
[data-vibeui-block="switch-004"] [data-part="off-mark"]::after{transform:rotate(-45deg)}
/* Галочка: угол квадрата, повёрнутый на 45°. */
[data-vibeui-block="switch-004"] [data-part="on-mark"]{
display:none;width:0.4375rem;height:0.6875rem;margin-top:-0.125rem;
border-right:2px solid var(--vibeui-switch-004-accent);
border-bottom:2px solid var(--vibeui-switch-004-accent);
transform:rotate(45deg);
}
[data-vibeui-block="switch-004"] input:checked + [data-part="thumb"] [data-part="on-mark"]{display:block}
[data-vibeui-block="switch-004"] input:checked + [data-part="thumb"] [data-part="off-mark"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-004"] *{animation:none!important;transition:none!important}}
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
 * Переключатель со значками состояний в бегунке: галочка и крест на CSS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch004({
  label = "Приём заказов",
  onText = "включён",
  offText = "выключен",
  background = "",
  accent,
  defaultChecked = true,
  className,
  style,
  ...props
}: Switch004Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-004" precedence="medium">
        {STYLES}
      </style>
      <label
        data-slot="switch"
        data-vibeui-block="switch-004"
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="label">{label}</span>
          <span data-part="state">
            <span data-part="on-text">{onText}</span>
            <span data-part="off-text">{offText}</span>
          </span>
        </span>
        <span data-part="track">
          <input
            {...props}
            type="checkbox"
            role="switch"
            defaultChecked={defaultChecked}
          />
          <span data-part="thumb" aria-hidden="true">
            <span data-part="on-mark" />
            <span data-part="off-mark" />
          </span>
        </span>
      </label>
    </>
  )
}
