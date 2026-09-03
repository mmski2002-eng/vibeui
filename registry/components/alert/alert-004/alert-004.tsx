import type { ComponentProps, CSSProperties } from "react"

export type Alert004Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Опасное решение: подтверждение краснеет, отмена становится главной. */
  destructive?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  accent?: string
  /** Пусто — подложки нет, алерт лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: алерт, который требует решения прямо здесь. Кнопки стоят
// под текстом, а не в строке заголовка: решение принимают после того, как
// дочитали. В опасном режиме подтверждение краснеет, но остаётся вторым по
// весу — уводить палец на «Удалить» по умолчанию нельзя.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-004"]){
--vibeui-alert-004-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.006 265));
--vibeui-alert-004-muted:color-mix(in oklab,var(--vibeui-alert-004-fg) 68%,transparent);
--vibeui-alert-004-bg:transparent;
--vibeui-alert-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-alert-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-alert-004-accent-fg:light-dark(oklch(1 0 0),oklch(0.18 0.01 265));
--vibeui-alert-004-danger:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.17 25));
--vibeui-alert-004-radius:0.75rem;
--vibeui-alert-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-004"]{color-scheme:dark}
[data-vibeui-block="alert-004"]{
display:flex;align-items:flex-start;gap:0.875rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-alert-004-border);
border-radius:var(--vibeui-alert-004-radius);
background:var(--vibeui-alert-004-bg);color:var(--vibeui-alert-004-fg);
font-family:var(--vibeui-alert-004-font);
}
[data-vibeui-block="alert-004"][data-destructive="true"]{
border-color:color-mix(in oklab,var(--vibeui-alert-004-danger) 35%,var(--vibeui-alert-004-border));
background:color-mix(in oklab,var(--vibeui-alert-004-danger) 4%,var(--vibeui-alert-004-bg));
}
[data-vibeui-block="alert-004"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-alert-004-accent) 14%,transparent);
color:var(--vibeui-alert-004-accent);
font-size:0.8125rem;font-weight:800;line-height:1;
}
[data-vibeui-block="alert-004"][data-destructive="true"] [data-part="icon"]{
background:color-mix(in oklab,var(--vibeui-alert-004-danger) 14%,transparent);
color:var(--vibeui-alert-004-danger);
}
[data-vibeui-block="alert-004"] [data-part="text"]{display:flex;flex-direction:column;gap:0.25rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-004"] [data-part="title"]{font-size:0.9375rem;font-weight:600;line-height:1.35}
[data-vibeui-block="alert-004"] [data-part="description"]{font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-004-muted);max-width:60ch}
/* Кнопки под текстом: решение принимают, дочитав, а не в строке заголовка. */
[data-vibeui-block="alert-004"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.625rem}
[data-vibeui-block="alert-004"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;height:2rem;padding:0 0.875rem;
border-radius:0.5rem;border:1px solid transparent;
font-size:0.8125rem;font-weight:600;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="alert-004"] [data-part="confirm"]{
background:var(--vibeui-alert-004-accent);color:var(--vibeui-alert-004-accent-fg);
}
[data-vibeui-block="alert-004"][data-destructive="true"] [data-part="confirm"]{background:var(--vibeui-alert-004-danger)}
[data-vibeui-block="alert-004"] [data-part="confirm"]:hover{filter:brightness(0.94)}
[data-vibeui-block="alert-004"] [data-part="cancel"]{
background:transparent;color:var(--vibeui-alert-004-fg);
border-color:var(--vibeui-alert-004-border);
}
[data-vibeui-block="alert-004"] [data-part="cancel"]:hover{background:color-mix(in oklab,var(--vibeui-alert-004-border) 40%,transparent)}
[data-vibeui-block="alert-004"] button:focus-visible{outline:2px solid var(--vibeui-alert-004-accent);outline-offset:2px}
@container (max-width: 24rem){
[data-vibeui-block="alert-004"] [data-part="actions"] button{flex:1 1 100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-004"] *{animation:none!important;transition:none!important}}
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
 * Алерт с решением: текст и две кнопки под ним.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert004({
  title = "Опубликовать изменения?",
  description = "На сайте появятся 4 изменённые страницы. Прошлая версия останется в истории публикаций — к ней можно вернуться.",
  confirmLabel = "Опубликовать",
  cancelLabel = "Не сейчас",
  destructive = false,
  onConfirm,
  onCancel,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alert004Props) {
  const palette = {
    ...(accent ? { "--vibeui-alert-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alert-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-004"
        data-destructive={destructive || undefined}
        role={destructive ? "alertdialog" : "region"}
        aria-label={title}
        className={className}
        style={palette}
      >
        <span data-part="icon" aria-hidden="true">
          {destructive ? "!" : "?"}
        </span>
        <span data-part="text">
          <span data-part="title">{title}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
          <span data-part="actions">
            <button data-part="confirm" type="button" onClick={onConfirm}>
              {confirmLabel}
            </button>
            <button data-part="cancel" type="button" onClick={onCancel}>
              {cancelLabel}
            </button>
          </span>
        </span>
      </div>
    </>
  )
}
