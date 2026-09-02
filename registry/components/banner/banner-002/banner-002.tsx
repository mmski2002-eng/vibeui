import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Banner002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  message?: string
  /** Номер новой версии: без него «обновитесь» звучит как реклама. */
  version?: string
  actionLabel?: string
  onReload?: () => void
  accent?: string
  /** Подложка полосы. Пусто — остаётся собственная. */
  background?: string
}

// Идея компонента: полоса «вышла новая версия» с одним честным действием —
// перезагрузить страницу. Точка слева мигает медленно и не требует внимания:
// обновление можно отложить, ничего не сломается.
//
// Тема берётся из color-scheme окружения через light-dark(): тёмная ветка не
// инверсия светлой, у подложки, границы и акцента свои пары светлот.
const STYLES = `
:where([data-vibeui-block="banner-002"]){
--vibeui-banner-002-bg:light-dark(oklch(0.97 0.02 220),oklch(0.27 0.03 245));
--vibeui-banner-002-fg:light-dark(oklch(0.27 0.05 240),oklch(0.93 0.015 240));
--vibeui-banner-002-muted:light-dark(oklch(0.48 0.05 240),oklch(0.73 0.025 240));
--vibeui-banner-002-border:light-dark(oklch(0.86 0.05 230),oklch(0.41 0.04 240));
--vibeui-banner-002-accent:light-dark(oklch(0.52 0.16 245),oklch(0.72 0.15 245));
--vibeui-banner-002-chip:light-dark(oklch(1 0 0 / 65%),oklch(1 0 0 / 10%));
--vibeui-banner-002-on-accent:light-dark(oklch(0.99 0.01 245),oklch(0.2 0.03 245));
--vibeui-banner-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-banner-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="banner-002"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-banner-002-font);color:var(--vibeui-banner-002-fg);
}
[data-vibeui-block="banner-002"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
box-sizing:border-box;padding:0.6875rem 1rem;
border:1px solid var(--vibeui-banner-002-border);border-radius:0.875rem;
background:var(--vibeui-banner-002-bg);
}
[data-vibeui-block="banner-002"] [data-part="pulse"]{
position:relative;flex:none;width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-banner-002-accent);
}
/* Медленный пульс: обновление можно отложить, тревожить не нужно. */
[data-vibeui-block="banner-002"] [data-part="pulse"]::after{
content:"";position:absolute;inset:-0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-banner-002-accent);
animation:vibeui-banner-002-pulse 2.4s ease-out infinite;
}
@keyframes vibeui-banner-002-pulse{
0%{opacity:.7;transform:scale(.6)}
100%{opacity:0;transform:scale(1.5)}
}
[data-vibeui-block="banner-002"] [data-part="text"]{
flex:1 1 14rem;min-width:0;margin:0;font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="banner-002"] [data-part="version"]{
font-family:var(--vibeui-banner-002-mono);font-size:0.75rem;font-weight:600;
padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-banner-002-chip);color:var(--vibeui-banner-002-muted);
}
[data-vibeui-block="banner-002"] [data-part="action"]{
appearance:none;cursor:pointer;border:0;flex:none;
height:1.9375rem;padding:0 0.8125rem;border-radius:0.5rem;
background:var(--vibeui-banner-002-accent);color:var(--vibeui-banner-002-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="banner-002"] [data-part="action"]:hover{filter:brightness(1.08)}
[data-vibeui-block="banner-002"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-banner-002-accent);outline-offset:2px}
@container (max-width: 30rem){
[data-vibeui-block="banner-002"] [data-part="shell"]{align-items:flex-start}
[data-vibeui-block="banner-002"] [data-part="action"]{width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-002"] *{animation:none!important;transition:none!important}}
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
 * Полоса обновления: сообщение о новой версии и кнопка перезагрузки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner002({
  message = "Вышла новая версия приложения. Перезагрузите страницу, чтобы получить исправления.",
  version = "2.8.0",
  actionLabel = "Перезагрузить",
  onReload,
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner002Props) {
  const palette = {
    ...(accent ? { "--vibeui-banner-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-banner-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="banner-002"
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <span data-part="pulse" aria-hidden="true" />
          <p data-part="text">
            {message}{" "}
            {version ? <span data-part="version">v{version}</span> : null}
          </p>
          <button data-part="action" type="button" onClick={onReload}>
            {actionLabel}
          </button>
        </div>
      </div>
    </>
  )
}
