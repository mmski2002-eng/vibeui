import type { ComponentProps, CSSProperties } from "react"

export type Alert017Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  /** Дата и окно работ: «14 марта, 02:00–04:00 МСК». */
  window?: string
  /** Что именно будет недоступно, по пунктам. */
  affected?: string[]
  detailsLabel?: string
  detailsHref?: string
  accent?: string
  /** Пусто — подложки нет, предупреждение лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: предупреждение о плановых работах. Здесь важно не «что-то
// сломается», а когда и что именно: время вынесено отдельной строкой в рамке,
// а список затронутого — пунктами. Тон нейтральный: плановые работы это не
// авария, и красный цвет вызвал бы лишние звонки в поддержку.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-017"]){
--vibeui-alert-017-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.006 265));
--vibeui-alert-017-muted:color-mix(in oklab,var(--vibeui-alert-017-fg) 68%,transparent);
--vibeui-alert-017-bg:transparent;
--vibeui-alert-017-panel:light-dark(oklch(0.97 0.004 265),oklch(0.28 0.01 265));
--vibeui-alert-017-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-alert-017-accent:light-dark(oklch(0.55 0.09 250),oklch(0.78 0.08 250));
--vibeui-alert-017-radius:0.875rem;
--vibeui-alert-017-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-alert-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-017"]{color-scheme:dark}
[data-vibeui-block="alert-017"]{
display:flex;gap:0.875rem;
width:100%;box-sizing:border-box;
padding:1rem 1.0625rem;
border:1px solid var(--vibeui-alert-017-border);
border-radius:var(--vibeui-alert-017-radius);
background:var(--vibeui-alert-017-bg);color:var(--vibeui-alert-017-fg);
font-family:var(--vibeui-alert-017-font);
}
/* Значок-календарь нарисован рамкой и двумя штрихами: иконка не нужна. */
[data-vibeui-block="alert-017"] [data-part="mark"]{
position:relative;flex:none;width:2rem;height:2rem;margin-top:0.125rem;
border:1.5px solid var(--vibeui-alert-017-accent);border-radius:0.5rem;
}
[data-vibeui-block="alert-017"] [data-part="mark"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:1.5px;
background:var(--vibeui-alert-017-accent);
}
[data-vibeui-block="alert-017"] [data-part="mark"]::after{
content:"";position:absolute;left:0.4375rem;top:-0.25rem;
width:1.5px;height:0.5rem;border-radius:1px;
background:var(--vibeui-alert-017-accent);
box-shadow:0.625rem 0 0 var(--vibeui-alert-017-accent);
}
[data-vibeui-block="alert-017"] [data-part="text"]{display:flex;flex-direction:column;gap:0.375rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-017"] [data-part="title"]{font-size:0.9375rem;font-weight:600;line-height:1.35}
/* Время в отдельной плашке моноширинными: его переписывают в календарь. */
[data-vibeui-block="alert-017"] [data-part="window"]{
align-self:flex-start;padding:0.25rem 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-alert-017-panel);
border:1px solid var(--vibeui-alert-017-border);
font-family:var(--vibeui-alert-017-mono);font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="alert-017"] [data-part="description"]{font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-017-muted);max-width:60ch}
[data-vibeui-block="alert-017"] ul{margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="alert-017"] li{
padding:0.125rem 0.4375rem;border-radius:0.3125rem;
background:var(--vibeui-alert-017-panel);
font-size:0.75rem;color:var(--vibeui-alert-017-muted);
}
[data-vibeui-block="alert-017"] [data-part="link"]{
align-self:flex-start;margin-top:0.125rem;
color:var(--vibeui-alert-017-accent);font-size:0.8125rem;font-weight:600;text-decoration:none;
border-bottom:1px solid transparent;transition:border-color .16s ease;
}
[data-vibeui-block="alert-017"] [data-part="link"]:hover{border-bottom-color:currentColor}
[data-vibeui-block="alert-017"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-alert-017-accent);outline-offset:3px}
@container (max-width: 22rem){
[data-vibeui-block="alert-017"] [data-part="mark"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_AFFECTED = ["Публикация", "Загрузка медиа", "Экспорт"]

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
 * Предупреждение о плановых работах: окно времени и список затронутого.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert017({
  title = "Плановые работы на выходных",
  description = "Обновляем хранилище. Опубликованные сайты продолжат работать — недоступной будет только панель управления.",
  window: maintenanceWindow = "14 марта, 02:00–04:00 МСК",
  affected = DEFAULT_AFFECTED,
  detailsLabel = "Что именно меняем",
  detailsHref = "#",
  accent,
  background = "",
  className,
  style,
  ...props
}: Alert017Props) {
  const palette = {
    ...(accent ? { "--vibeui-alert-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alert-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-017"
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <div data-part="text">
          <span data-part="title">{title}</span>
          {maintenanceWindow ? (
            <span data-part="window">{maintenanceWindow}</span>
          ) : null}
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
          {affected.length ? (
            <ul>
              {affected.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {detailsLabel ? (
            <a data-part="link" href={detailsHref}>
              {detailsLabel}
            </a>
          ) : null}
        </div>
      </div>
    </>
  )
}
