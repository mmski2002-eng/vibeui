import type { ComponentProps, CSSProperties } from "react"

export type Switch016Props = Omit<ComponentProps<"input">, "type" | "size"> & {
  label?: string
  /** Пояснение под подписью: чем включённое состояние отличается от выключенного. */
  description?: string
  accent?: string
  /** Пусто — подложки нет, строка ложится на фон страницы. */
  background?: string
}

// Идея компонента: переключатель, у которого кноб ведёт себя как физический
// предмет. Он не переезжает равномерно, а стартует с перелётом и на ходу
// растягивается вдоль движения — так глаз считывает направление даже боковым
// зрением, а щелчок ощущается ответом, а не сменой картинки.
//
// Растяжение сделано без JS: кноб прижат к дорожке одновременно слева и
// справа, и у left/right разные задержки перехода. Передний край трогается
// первым, задний догоняет — кноб честно вытягивается в обе стороны, а не
// имитирует это ключевыми кадрами, которые работали бы лишь в одну сторону.
const STYLES = `
:where([data-vibeui-block="switch-016"]){
--vibeui-switch-016-bg:transparent;
--vibeui-switch-016-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-switch-016-muted:color-mix(in oklab,var(--vibeui-switch-016-fg) 62%,transparent);
--vibeui-switch-016-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-switch-016-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-switch-016-track:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-switch-016-thumb:light-dark(oklch(1 0 0),oklch(0.96 0 265));
--vibeui-switch-016-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-switch-016-on-accent:oklch(0.15 0.02 39.8);
--vibeui-switch-016-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-switch-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-016"]{color-scheme:dark}
[data-vibeui-block="switch-016"]{
display:flex;align-items:center;gap:1rem;
width:100%;max-width:22rem;box-sizing:border-box;
padding:0.625rem 0.75rem;border-radius:0.875rem;cursor:pointer;
background:var(--vibeui-switch-016-bg);color:var(--vibeui-switch-016-fg);
font-family:var(--vibeui-switch-016-font);
transition:background-color .16s ease;
}
[data-vibeui-block="switch-016"] *{box-sizing:border-box}
[data-vibeui-block="switch-016"]:hover:not(:has(input:disabled)){background:var(--vibeui-switch-016-card)}
[data-vibeui-block="switch-016"]:has(input:disabled){cursor:not-allowed;opacity:.55}
[data-vibeui-block="switch-016"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-016"] [data-part="title"]{font-size:0.875rem;line-height:1.35}
[data-vibeui-block="switch-016"] [data-part="description"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-switch-016-muted)}
[data-vibeui-block="switch-016"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-016"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:3rem;height:1.625rem;border-radius:9999px;cursor:inherit;
border:1px solid var(--vibeui-switch-016-border);
background:var(--vibeui-switch-016-track);
transition:background-color .3s ease,border-color .3s ease;
}
[data-vibeui-block="switch-016"] input:checked{
background:var(--vibeui-switch-016-accent);border-color:var(--vibeui-switch-016-accent);
}
[data-vibeui-block="switch-016"] input:focus-visible{outline:2px solid var(--vibeui-switch-016-accent);outline-offset:2px}
/* Кноб держится за оба края дорожки. Выключенное состояние: передний край
   слева трогается сразу, задний догоняет через 70 мс — кноб вытягивается
   влево. Во включённом состоянии задержки меняются местами. */
[data-vibeui-block="switch-016"] [data-part="thumb"]{
position:absolute;top:0.1875rem;left:0.1875rem;right:1.5625rem;
height:1.25rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-016-thumb);
box-shadow:0 1px 2px oklch(0.2 0 265 / 25%);
transition:left .38s cubic-bezier(.22,1.2,.36,1) 0s,right .38s cubic-bezier(.22,1.2,.36,1) 70ms,background-color .3s ease;
transition:left .38s var(--vibeui-switch-016-ease) 0s,right .38s var(--vibeui-switch-016-ease) 70ms,background-color .3s ease;
}
[data-vibeui-block="switch-016"] input:checked + [data-part="thumb"]{
left:1.5625rem;right:0.1875rem;
background:var(--vibeui-switch-016-on-accent);
transition:left .38s cubic-bezier(.22,1.2,.36,1) 70ms,right .38s cubic-bezier(.22,1.2,.36,1) 0s,background-color .3s ease;
transition:left .38s var(--vibeui-switch-016-ease) 70ms,right .38s var(--vibeui-switch-016-ease) 0s,background-color .3s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-016"],[data-vibeui-block="switch-016"] *{animation:none!important;transition:none!important}}
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
 * Переключатель с пружинным кнобом: перелёт и растяжение по ходу движения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch016({
  label = "Мгновенная синхронизация",
  description = "Изменения уезжают в облако сразу, без кнопки «Сохранить».",
  accent,
  background = "",
  className,
  style,
  ...props
}: Switch016Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-016" precedence="medium">
        {STYLES}
      </style>
      <label
        data-slot="switch"
        data-vibeui-block="switch-016"
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
