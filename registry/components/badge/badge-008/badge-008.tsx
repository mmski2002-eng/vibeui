import type { ComponentProps, CSSProperties } from "react"

export type Badge008Props = Omit<ComponentProps<"span">, "children"> & {
  version?: string
  channel?: "stable" | "beta" | "alpha"
  /** Пусто — плашка держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: номер версии рядом с названием. Цифры — моноширинным
// шрифтом, иначе «v1.11.0» и «v1.9.0» выглядят разной длины и прыгают при
// обновлении. Канал приписан словом: у беты и альфы разная цена ошибки, и
// одним цветом их путают.
const STYLES = `
:where([data-vibeui-block="badge-008"]){
--vibeui-badge-008-surface:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));
--vibeui-badge-008-bg:light-dark(oklch(0.96 0.004 265),oklch(0.27 0.009 265));
--vibeui-badge-008-fg:light-dark(oklch(0.36 0.014 265),oklch(0.9 0.008 265));
--vibeui-badge-008-border:light-dark(oklch(0.89 0.006 265),oklch(0.39 0.011 265));
--vibeui-badge-008-channel:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-badge-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-badge-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-008"]{color-scheme:dark}
[data-vibeui-block="badge-008"]{
display:inline-flex;align-items:stretch;
height:1.5rem;overflow:hidden;
border:1px solid var(--vibeui-badge-008-border);border-radius:0.375rem;
background:var(--vibeui-badge-008-bg);color:var(--vibeui-badge-008-fg);
font-size:0.6875rem;line-height:1;vertical-align:middle;
}
[data-vibeui-block="badge-008"][data-channel="beta"]{--vibeui-badge-008-channel:light-dark(oklch(0.6 0.16 265),oklch(0.75 0.15 265))}
[data-vibeui-block="badge-008"][data-channel="alpha"]{--vibeui-badge-008-channel:light-dark(oklch(0.6 0.18 25),oklch(0.75 0.17 25))}
/* Версия моноширинным: пропорциональные цифры дёргают плашку при обновлении. */
[data-vibeui-block="badge-008"] [data-part="version"]{
display:inline-flex;align-items:center;padding:0 0.4375rem;
font-family:var(--vibeui-badge-008-mono);font-weight:600;letter-spacing:-0.01em;
}
[data-vibeui-block="badge-008"] [data-part="channel"]{
display:inline-flex;align-items:center;padding:0 0.4375rem;
border-left:1px solid var(--vibeui-badge-008-border);
background:color-mix(in oklab,var(--vibeui-badge-008-channel) 14%,var(--vibeui-badge-008-surface));
color:var(--vibeui-badge-008-channel);
font-family:var(--vibeui-badge-008-font);font-weight:700;
letter-spacing:0.04em;text-transform:uppercase;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-008"] *{animation:none!important;transition:none!important}}
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
 * Номер версии с каналом: моноширинные цифры и подпись словом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge008({
  version = "v2.4.0",
  channel = "beta",
  background = "",
  className,
  style,
  ...props
}: Badge008Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-badge-008-bg": background,
          "--vibeui-badge-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-008" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-008"
        data-channel={channel}
        className={className}
        style={palette}
      >
        <span data-part="version">{version}</span>
        {channel === "stable" ? null : (
          <span data-part="channel">{channel}</span>
        )}
      </span>
    </>
  )
}
