import type { ComponentProps, CSSProperties } from "react"

export type Switch002Props = Omit<ComponentProps<"input">, "type" | "size"> & {
  title?: string
  description?: string
  /** Текст в углу, когда опция включена. */
  badge?: string
  /** Пусто — подложки нет, плитка держится рамкой на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: не строка настройки, а плитка-выбор. Заголовок, абзац
// объяснения и переключатель в углу; вся карточка — цель нажатия, а
// включённое состояние меняет рамку и фон, поэтому среди нескольких плиток
// выбранные видно с расстояния, а не по положению маленького бегунка.
const STYLES = `
:where([data-vibeui-block="switch-002"]){
--vibeui-switch-002-bg:transparent;
--vibeui-switch-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-switch-002-muted:color-mix(in oklab,var(--vibeui-switch-002-fg) 68%,transparent);
--vibeui-switch-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-switch-002-track:light-dark(oklch(0.88 0.008 265),oklch(0.43 0.014 265));
--vibeui-switch-002-thumb:light-dark(oklch(1 0 0),oklch(0.93 0.004 265));
--vibeui-switch-002-accent:light-dark(oklch(0.56 0.16 155),oklch(0.76 0.15 155));
--vibeui-switch-002-tint:light-dark(oklch(0.56 0.16 155 / 8%),oklch(0.76 0.15 155 / 14%));
--vibeui-switch-002-badge-ink:light-dark(oklch(1 0 0),oklch(0.2 0.03 155));
--vibeui-switch-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="switch-002"]{color-scheme:dark}
[data-vibeui-block="switch-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-switch-002-bg);
border:1.5px solid var(--vibeui-switch-002-border);border-radius:1rem;
font-family:var(--vibeui-switch-002-font);color:var(--vibeui-switch-002-fg);
cursor:pointer;transition:border-color .18s ease,background-color .18s ease;
}
/* Включённая плитка окрашивается целиком: положение бегунка в списке
   из четырёх карточек читается хуже, чем цвет фона. */
[data-vibeui-block="switch-002"]:has(input:checked){
border-color:var(--vibeui-switch-002-accent);
background:var(--vibeui-switch-002-tint);
}
[data-vibeui-block="switch-002"]:has(input:focus-visible){
outline:2px solid var(--vibeui-switch-002-accent);outline-offset:2px;
}
[data-vibeui-block="switch-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="switch-002"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="switch-002"] [data-part="description"]{
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-switch-002-muted);
}
[data-vibeui-block="switch-002"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-002"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-002-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-002"] input:checked{background:var(--vibeui-switch-002-accent)}
[data-vibeui-block="switch-002"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-002-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-002"] input:checked + [data-part="thumb"]{transform:translateX(1.25rem)}
/* Бейдж появляется только у включённой плитки — через :has(), без JS. */
[data-vibeui-block="switch-002"] [data-part="badge"]{
display:none;align-self:flex-start;
padding:0.125rem 0.5rem;border-radius:9999px;
background:var(--vibeui-switch-002-accent);color:var(--vibeui-switch-002-badge-ink);
font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;
}
[data-vibeui-block="switch-002"]:has(input:checked) [data-part="badge"]{display:inline-block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-002"] *{animation:none!important;transition:none!important}}
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
 * Плитка-переключатель: заголовок, объяснение и цвет всей карточки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch002({
  title = "Умные напоминания",
  description = "Присылаем задачу за час до дедлайна и молчим по выходным.",
  badge = "Включено",
  background = "",
  accent,
  defaultChecked = true,
  className,
  style,
  ...props
}: Switch002Props) {
  const palette = {
    ...(accent ? { "--vibeui-switch-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-switch-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-002" precedence="medium">
        {STYLES}
      </style>
      <label
        data-slot="switch"
        data-vibeui-block="switch-002"
        className={className}
        style={palette}
      >
        <span data-part="head">
          <span data-part="title">{title}</span>
          <span data-part="track">
            <input
              {...props}
              type="checkbox"
              role="switch"
              defaultChecked={defaultChecked}
            />
            <span data-part="thumb" aria-hidden="true" />
          </span>
        </span>
        <span data-part="description">{description}</span>
        {badge ? <span data-part="badge">{badge}</span> : null}
      </label>
    </>
  )
}
