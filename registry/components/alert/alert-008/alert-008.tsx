import type { ComponentProps, CSSProperties } from "react"

export type Alert008Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  /** Что происходит прямо сейчас: шаг, файл, этап. */
  step?: string
  /** 0–100. `null` — процесс идёт, но длительность неизвестна. */
  value?: number | null
  cancelLabel?: string
  onCancel?: () => void
  accent?: string
  /** Пусто — подложки нет, алерт лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: алерт о выполняющейся операции. Полоса встроена в нижнюю
// кромку блока, а не стоит отдельной строкой: сообщение остаётся плотным, а
// прогресс виден краем глаза. Неизвестная длительность честно показывается
// бегущим отрезком — выдуманный процент здесь хуже, чем его отсутствие.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-008"]){
--vibeui-alert-008-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-alert-008-muted:color-mix(in oklab,var(--vibeui-alert-008-fg) 68%,transparent);
--vibeui-alert-008-bg:transparent;
--vibeui-alert-008-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-alert-008-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-alert-008-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-alert-008-radius:0.75rem;
--vibeui-alert-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-008"]{color-scheme:dark}
[data-vibeui-block="alert-008"]{
position:relative;display:flex;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;overflow:hidden;
padding:0.875rem 1rem 1.0625rem;
border:1px solid var(--vibeui-alert-008-border);
border-radius:var(--vibeui-alert-008-radius);
background:var(--vibeui-alert-008-bg);color:var(--vibeui-alert-008-fg);
font-family:var(--vibeui-alert-008-font);
}
/* Спиннер на CSS: иконочная библиотека ради одного кольца не нужна. */
[data-vibeui-block="alert-008"] [data-part="spinner"]{
flex:none;width:1.125rem;height:1.125rem;margin-top:0.125rem;
border-radius:9999px;
border:2px solid color-mix(in oklab,var(--vibeui-alert-008-accent) 25%,transparent);
border-top-color:var(--vibeui-alert-008-accent);
animation:vibeui-alert-008-spin .9s linear infinite;
}
@keyframes vibeui-alert-008-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="alert-008"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-008"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="alert-008"] [data-part="step"]{
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-008-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="alert-008"] [data-part="value"]{
flex:none;align-self:center;font-size:0.8125rem;font-weight:600;
font-variant-numeric:tabular-nums;color:var(--vibeui-alert-008-accent);
}
[data-vibeui-block="alert-008"] [data-part="cancel"]{
appearance:none;border:0;background:none;cursor:pointer;flex:none;align-self:center;
color:var(--vibeui-alert-008-muted);font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="alert-008"] [data-part="cancel"]:hover{color:var(--vibeui-alert-008-fg)}
[data-vibeui-block="alert-008"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-alert-008-accent);outline-offset:2px;border-radius:0.25rem}
/* Полоса — нижняя кромка блока, а не отдельная строка. */
[data-vibeui-block="alert-008"] [data-part="track"]{
position:absolute;left:0;right:0;bottom:0;height:0.1875rem;
background:var(--vibeui-alert-008-track);
}
[data-vibeui-block="alert-008"] [data-part="bar"]{
height:100%;background:var(--vibeui-alert-008-accent);
width:calc(var(--vibeui-alert-008-value,0) * 1%);
transition:width .3s cubic-bezier(.32,.72,0,1);color:oklch(from var(--vibeui-alert-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="alert-008"][data-indeterminate="true"] [data-part="bar"]{
width:30%;transition:none;
animation:vibeui-alert-008-slide 1.4s ease-in-out infinite;
}
@keyframes vibeui-alert-008-slide{0%{transform:translateX(-110%)}100%{transform:translateX(360%)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="alert-008"] *{animation:none!important;transition:none!important}
[data-vibeui-block="alert-008"][data-indeterminate="true"] [data-part="bar"]{width:100%;opacity:.4}
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
 * Алерт выполняющейся операции: шаг, процент и полоса в кромке блока.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert008({
  title = "Публикуем проект",
  step = "Собираем страницы — 12 из 18",
  value = 64,
  cancelLabel = "Отменить",
  onCancel,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alert008Props) {
  const indeterminate = value === null || value === undefined
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value))
  const palette = {
    "--vibeui-alert-008-value": clamped,
    ...(accent ? { "--vibeui-alert-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alert-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-008"
        data-indeterminate={indeterminate || undefined}
        role="status"
        aria-busy="true"
        className={className}
        style={palette}
      >
        <span data-part="spinner" aria-hidden="true" />
        <span data-part="text">
          <span data-part="title">{title}</span>
          {step ? <span data-part="step">{step}</span> : null}
        </span>
        {indeterminate ? null : (
          <span data-part="value">{Math.round(clamped)}%</span>
        )}
        {onCancel && cancelLabel ? (
          <button data-part="cancel" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
        ) : null}
        <span
          data-part="track"
          role="progressbar"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        >
          <span data-part="bar" />
        </span>
      </div>
    </>
  )
}
