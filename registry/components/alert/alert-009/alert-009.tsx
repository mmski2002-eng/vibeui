import type { ComponentProps, CSSProperties } from "react"

export type Alert009Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  /** Крупная строка отсчёта: «3 дня», «до 14 марта». Считает вызывающий код. */
  remaining?: string
  /** Доля прошедшего срока, 0–100: полоса убывает от неё к нулю. */
  elapsed?: number
  actionLabel?: string
  actionHref?: string
  accent?: string
  /** Пусто — подложки нет, алерт лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: срок, который заканчивается. Слева крупная строка остатка,
// справа действие, снизу убывающая полоса — три способа сказать одно и то же,
// потому что «осталось 3 дня» пропускают, а сжимающуюся полосу замечают.
// Отсчёт считает вызывающий код: компонент не запускает таймеров.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-009"]){
--vibeui-alert-009-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-alert-009-muted:color-mix(in oklab,var(--vibeui-alert-009-fg) 68%,transparent);
--vibeui-alert-009-bg:transparent;
--vibeui-alert-009-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-alert-009-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-alert-009-accent:light-dark(oklch(0.68 0.15 70),oklch(0.81 0.14 75));
--vibeui-alert-009-accent-fg:light-dark(oklch(0.2 0.02 70),oklch(0.18 0.03 70));
--vibeui-alert-009-radius:0.875rem;
--vibeui-alert-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-009"]{color-scheme:dark}
[data-vibeui-block="alert-009"]{
/* flex-wrap живёт здесь, а не в @container: контейнерный запрос применяется
   к потомкам контейнера, но не к нему самому. На широкой раскладке перенос
   ни на что не влияет — всё умещается в строку. */
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem 1rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
padding:0.9375rem 1.0625rem;
border:1px solid var(--vibeui-alert-009-border);
border-left:3px solid var(--vibeui-alert-009-accent);
border-radius:var(--vibeui-alert-009-radius);
background:var(--vibeui-alert-009-bg);color:var(--vibeui-alert-009-fg);
font-family:var(--vibeui-alert-009-font);
}
/* Остаток крупно и моноширинными: число меняется, ширина строки — нет. */
[data-vibeui-block="alert-009"] [data-part="remaining"]{
flex:none;font-size:1.25rem;font-weight:680;line-height:1.1;
letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
color:var(--vibeui-alert-009-accent);
}
[data-vibeui-block="alert-009"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-009"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.35}
[data-vibeui-block="alert-009"] [data-part="description"]{font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-009-muted)}
[data-vibeui-block="alert-009"] [data-part="track"]{
margin-top:0.4375rem;height:0.1875rem;border-radius:9999px;
background:var(--vibeui-alert-009-track);overflow:hidden;
}
/* Полоса показывает остаток, а не пройденное: она сжимается к нулю. */
[data-vibeui-block="alert-009"] [data-part="bar"]{
display:block;height:100%;border-radius:inherit;
background:var(--vibeui-alert-009-accent);
width:calc((100 - var(--vibeui-alert-009-elapsed,0)) * 1%);
transition:width .3s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="alert-009"] [data-part="action"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
min-height:2rem;padding:0.25rem 0.875rem;
border-radius:0.5rem;text-decoration:none;
background:var(--vibeui-alert-009-accent);color:var(--vibeui-alert-009-accent-fg);
font-size:0.8125rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="alert-009"] [data-part="action"]:hover{filter:brightness(0.95)}
[data-vibeui-block="alert-009"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-alert-009-accent);outline-offset:2px}
@container (max-width: 30rem){
[data-vibeui-block="alert-009"] [data-part="text"]{flex:1 1 100%;order:3}
[data-vibeui-block="alert-009"] [data-part="action"]{margin-left:auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-009"] *{animation:none!important;transition:none!important}}
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
 * Алерт истекающего срока: остаток крупно, действие рядом, полоса убывает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert009({
  title = "Пробный период заканчивается",
  description = "После 14 марта проект останется опубликованным, но редактирование выключится.",
  remaining = "3 дня",
  elapsed = 78,
  actionLabel = "Продлить",
  actionHref = "#",
  accent,
  background = "",
  className,
  style,
  ...props
}: Alert009Props) {
  const clamped = Math.min(100, Math.max(0, elapsed))
  const palette = {
    "--vibeui-alert-009-elapsed": clamped,
    ...(accent ? { "--vibeui-alert-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alert-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-009"
        role="status"
        className={className}
        style={palette}
      >
        {remaining ? <span data-part="remaining">{remaining}</span> : null}
        <span data-part="text">
          <span data-part="title">{title}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
          <span data-part="track" aria-hidden="true">
            <span data-part="bar" />
          </span>
        </span>
        {actionLabel ? (
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        ) : null}
      </div>
    </>
  )
}
