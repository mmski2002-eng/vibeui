import type { ComponentProps, CSSProperties } from "react"

export type Alert006Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  badge?: string
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  dismissLabel?: string
  onDismiss?: () => void
  accent?: string
  /** Пусто — подложки нет, алерт лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: рассказ о новой возможности, а не сообщение о проблеме.
// Поэтому слева не значок статуса, а маленькая сцена из плиток — намёк на
// интерфейс, о котором речь. Тон спокойный: продуктовая новость, поставленная
// в цвета ошибки, читается как авария.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-006"]){
--vibeui-alert-006-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.006 265));
--vibeui-alert-006-muted:color-mix(in oklab,var(--vibeui-alert-006-fg) 68%,transparent);
--vibeui-alert-006-bg:transparent;
--vibeui-alert-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-alert-006-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-alert-006-accent-fg:light-dark(oklch(1 0 0),oklch(0.18 0.01 265));
--vibeui-alert-006-art:light-dark(oklch(0.98 0.003 265),oklch(0.27 0.01 265));
--vibeui-alert-006-radius:1rem;
--vibeui-alert-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-006"]{color-scheme:dark}
[data-vibeui-block="alert-006"]{
/* flex-wrap живёт здесь, а не в @container: контейнерный запрос применяется
   к потомкам контейнера, но не к нему самому. На широкой раскладке перенос
   ни на что не влияет — всё умещается в строку. */
display:flex;flex-wrap:wrap;align-items:center;gap:1rem;
width:100%;box-sizing:border-box;overflow:hidden;
padding:1rem;
border:1px solid var(--vibeui-alert-006-border);
border-radius:var(--vibeui-alert-006-radius);
background:
radial-gradient(120% 140% at 0% 0%,color-mix(in oklab,var(--vibeui-alert-006-accent) 9%,transparent),transparent 60%),
var(--vibeui-alert-006-bg);
color:var(--vibeui-alert-006-fg);font-family:var(--vibeui-alert-006-font);
}
/* Сцена из плиток: намёк на интерфейс вместо значка статуса. */
[data-vibeui-block="alert-006"] [data-part="art"]{
position:relative;flex:none;width:4.5rem;height:3.25rem;
border-radius:0.625rem;overflow:hidden;
border:1px solid var(--vibeui-alert-006-border);
background:var(--vibeui-alert-006-art);
}
[data-vibeui-block="alert-006"] [data-part="art"] span{position:absolute;border-radius:0.1875rem;background:color-mix(in oklab,var(--vibeui-alert-006-accent) 22%,transparent)}
[data-vibeui-block="alert-006"] [data-part="art"] span:nth-child(1){left:0.4375rem;top:0.4375rem;width:1.25rem;height:0.375rem}
[data-vibeui-block="alert-006"] [data-part="art"] span:nth-child(2){left:0.4375rem;top:1.125rem;right:0.4375rem;height:0.375rem;opacity:.55}
[data-vibeui-block="alert-006"] [data-part="art"] span:nth-child(3){left:0.4375rem;bottom:0.4375rem;width:1.75rem;height:0.75rem;background:var(--vibeui-alert-006-accent)}
[data-vibeui-block="alert-006"] [data-part="text"]{display:flex;flex-direction:column;gap:0.25rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-006"] [data-part="badge"]{
align-self:flex-start;padding:0.125rem 0.4375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-alert-006-accent) 14%,transparent);
color:var(--vibeui-alert-006-accent);
font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;
}
[data-vibeui-block="alert-006"] [data-part="title"]{font-size:0.9375rem;font-weight:600;line-height:1.35}
[data-vibeui-block="alert-006"] [data-part="description"]{font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-006-muted);max-width:56ch}
[data-vibeui-block="alert-006"] [data-part="actions"]{display:flex;align-items:center;gap:0.75rem;flex:none}
[data-vibeui-block="alert-006"] [data-part="action"]{
display:inline-flex;align-items:center;height:2rem;padding:0 0.875rem;
border-radius:0.5rem;text-decoration:none;
background:var(--vibeui-alert-006-accent);color:var(--vibeui-alert-006-accent-fg);
font-size:0.8125rem;font-weight:600;
transition:filter .16s ease;
}
[data-vibeui-block="alert-006"] [data-part="action"]:hover{filter:brightness(0.94)}
[data-vibeui-block="alert-006"] [data-part="dismiss"]{
appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-alert-006-muted);font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="alert-006"] [data-part="dismiss"]:hover{color:var(--vibeui-alert-006-fg)}
[data-vibeui-block="alert-006"] a:focus-visible,
[data-vibeui-block="alert-006"] button:focus-visible{outline:2px solid var(--vibeui-alert-006-accent);outline-offset:2px}
@container (max-width: 32rem){
/* Текст занимает остаток первой строки, действия уходят на вторую целиком. */
[data-vibeui-block="alert-006"] [data-part="text"]{flex:1 1 60%}
[data-vibeui-block="alert-006"] [data-part="actions"]{width:100%;padding-left:5.5rem}
}
@container (max-width: 22rem){
[data-vibeui-block="alert-006"] [data-part="art"]{display:none}
[data-vibeui-block="alert-006"] [data-part="actions"]{padding-left:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-006"] *{animation:none!important;transition:none!important}}
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
 * Алерт о новой возможности: сцена из плиток вместо значка статуса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert006({
  badge = "Новое",
  title = "Панель кода прямо в каталоге",
  description = "Команда установки и исходник открываются на карточке — переходить на страницу компонента больше не нужно.",
  actionLabel = "Посмотреть",
  actionHref = "#",
  dismissLabel = "Скрыть",
  onDismiss,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alert006Props) {
  const palette = {
    ...(accent ? { "--vibeui-alert-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alert-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-006"
        role="region"
        aria-label={title}
        className={className}
        style={palette}
      >
        <span data-part="art" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span data-part="text">
          {badge ? <span data-part="badge">{badge}</span> : null}
          <span data-part="title">{title}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
        </span>
        <span data-part="actions">
          {actionLabel ? (
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
          ) : null}
          {onDismiss && dismissLabel ? (
            <button data-part="dismiss" type="button" onClick={onDismiss}>
              {dismissLabel}
            </button>
          ) : null}
        </span>
      </div>
    </>
  )
}
