import type { ComponentProps, CSSProperties } from "react"

export type Progress001Props = Omit<ComponentProps<"div">, "children"> & {
  /** Значение 0–100. `null` — процесс идёт, но длительность неизвестна. */
  value?: number | null
  label?: string
  /** Правая подпись: по умолчанию проценты. */
  hint?: string
  size?: "sm" | "md"
  /** Подпись состояния «длительность неизвестна». */
  runningText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у полосы два честных состояния. Известен прогресс — она
// показывает долю и число; неизвестен — по дорожке ходит отрезок, и никакой
// выдуманный процент не рисуется.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="progress-001"]){
--vibeui-progress-001-fg:light-dark(oklch(0.28 0.016 265),oklch(0.94 0.006 265));
--vibeui-progress-001-muted:color-mix(in oklab,var(--vibeui-progress-001-fg) 68%,transparent);
--vibeui-progress-001-track:light-dark(oklch(0.92 0.006 265),oklch(0.31 0.012 265));
--vibeui-progress-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.7 0.17 262));
--vibeui-progress-001-bg:transparent;
--vibeui-progress-001-pad:0;
--vibeui-progress-001-radius:0;
--vibeui-progress-001-height:0.5rem;
--vibeui-progress-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="progress-001"]{color-scheme:dark}
[data-vibeui-block="progress-001"]{
display:flex;flex-direction:column;gap:0.5rem;width:100%;
box-sizing:border-box;padding:var(--vibeui-progress-001-pad);
background:var(--vibeui-progress-001-bg);
border-radius:var(--vibeui-progress-001-radius);
font-family:var(--vibeui-progress-001-font);color:var(--vibeui-progress-001-fg);
}
[data-vibeui-block="progress-001"][data-size="sm"]{--vibeui-progress-001-height:0.25rem}
[data-vibeui-block="progress-001"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
font-size:0.9375rem;
}
[data-vibeui-block="progress-001"] [data-part="hint"]{
color:var(--vibeui-progress-001-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-001"] [data-part="track"]{
position:relative;overflow:hidden;
height:var(--vibeui-progress-001-height);
border-radius:9999px;background:var(--vibeui-progress-001-track);
}
[data-vibeui-block="progress-001"] [data-part="bar"]{
height:100%;border-radius:inherit;
background:var(--vibeui-progress-001-accent);
width:calc(var(--vibeui-progress-001-value,0) * 1%);
transition:width .3s cubic-bezier(.32,.72,0,1);
}
/* Неизвестная длительность: отрезок ходит по дорожке, процент не выдумываем. */
[data-vibeui-block="progress-001"][data-indeterminate="true"] [data-part="bar"]{
width:35%;transition:none;
animation:vibeui-progress-001-slide 1.4s ease-in-out infinite;
}
@keyframes vibeui-progress-001-slide{
0%{transform:translateX(-110%)}
100%{transform:translateX(320%)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="progress-001"][data-indeterminate="true"] [data-part="bar"]{width:100%;opacity:.5}
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
 * Индикатор выполнения с честным состоянием неизвестной длительности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress001({
  value = 64,
  label = "Сборка проекта",
  hint,
  size = "md",
  runningText = "идёт",
  background = "",
  accent,
  className,
  style,
  ...props
}: Progress001Props) {
  const indeterminate = value === null || value === undefined
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value))
  // Подложка появляется вместе с полями: без неё компонент лежит прямо на
  // странице, и лишние отступы ему только мешают.
  const palette = {
    "--vibeui-progress-001-value": clamped,
    ...(accent ? { "--vibeui-progress-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-progress-001-bg": background,
          "--vibeui-progress-001-pad": "0.9375rem 1.0625rem",
          "--vibeui-progress-001-radius": "0.75rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const note = hint ?? (indeterminate ? runningText : `${Math.round(clamped)}%`)

  return (
    <>
      <style href="vibeui-progress-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="progress"
        data-vibeui-block="progress-001"
        data-size={size}
        data-indeterminate={indeterminate || undefined}
        className={className}
        style={palette}
      >
        {label || note ? (
          <div data-part="head">
            <span data-part="label">{label}</span>
            {note ? <span data-part="hint">{note}</span> : null}
          </div>
        ) : null}
        <div
          data-part="track"
          role="progressbar"
          aria-label={label || undefined}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        >
          <div data-part="bar" />
        </div>
      </div>
    </>
  )
}
