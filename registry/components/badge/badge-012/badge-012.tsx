import type { ComponentProps, CSSProperties } from "react"

export type Badge012Props = Omit<ComponentProps<"span">, "children"> & {
  label?: string
  /** Сколько осталось: без оценки ожидание выглядит зависанием. */
  hint?: string
  accent?: string
  /** Пусто — плашка держит собственный нейтральный фон. */
  background?: string
}

// Идея компонента: плашка процесса. Кольцо крутится, но текст обязателен:
// один спиннер не отвечает, что именно происходит и стоит ли ждать. При
// prefers-reduced-motion вращение сменяется ровной точкой — состояние
// остаётся видимым, движение уходит.
const STYLES = `
:where([data-vibeui-block="badge-012"]){
--vibeui-badge-012-bg:light-dark(oklch(0.96 0 265),oklch(0.27 0 265));
--vibeui-badge-012-fg:light-dark(oklch(0.32 0 265),oklch(0.93 0 265));
--vibeui-badge-012-muted:color-mix(in oklab,var(--vibeui-badge-012-fg) 68%,transparent);
--vibeui-badge-012-track:light-dark(oklch(0.86 0 265),oklch(0.41 0 265));
--vibeui-badge-012-accent:light-dark(oklch(0.58 0.16 39.8),oklch(0.75 0.15 39.8));
--vibeui-badge-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="badge-012"]{color-scheme:dark}
[data-vibeui-block="badge-012"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:1.625rem;padding:0 0.6875rem 0 0.5625rem;
border-radius:9999px;
background:var(--vibeui-badge-012-bg);color:var(--vibeui-badge-012-fg);
font-family:var(--vibeui-badge-012-font);font-size:0.75rem;font-weight:600;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-012"] [data-part="spinner"]{
flex:none;width:0.6875rem;height:0.6875rem;box-sizing:border-box;
border:2px solid var(--vibeui-badge-012-track);
border-top-color:var(--vibeui-badge-012-accent);
border-radius:9999px;
animation:vibeui-badge-012-spin .7s linear infinite;
}
@keyframes vibeui-badge-012-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="badge-012"] [data-part="hint"]{font-weight:500;color:var(--vibeui-badge-012-muted)}
/* Без движения состояние остаётся видимым: кольцо превращается в точку. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="badge-012"] *{animation:none!important;transition:none!important}
[data-vibeui-block="badge-012"] [data-part="spinner"]{
border-color:var(--vibeui-badge-012-accent);background:var(--vibeui-badge-012-accent);
}
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
 * Плашка процесса: кольцо и обязательный текст, что происходит.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge012({
  label = "Отправляем",
  hint = "осталось ~20 с",
  accent,
  background = "",
  className,
  style,
  ...props
}: Badge012Props) {
  const palette = {
    ...(accent ? { "--vibeui-badge-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-badge-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-badge-012" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="badge"
        data-vibeui-block="badge-012"
        className={className}
        style={palette}
        role="status"
        aria-live="polite"
      >
        <span data-part="spinner" aria-hidden="true" />
        {label}
        {hint ? <span data-part="hint">{hint}</span> : null}
      </span>
    </>
  )
}
