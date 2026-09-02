import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Banner001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  message?: string
  /** Короткая метка слева: «Новое», «Бета», дата. */
  tag?: string
  actionLabel?: string
  actionHref?: string
  /** Кнопка закрытия. Без обработчика полосу закрывать нечем. */
  onDismiss?: () => void
  /** Подпись кнопки закрытия для скринридера. */
  dismissLabel?: string
  /** Имя области, когда метка пустая: полосу должно быть слышно. */
  regionLabel?: string
  children?: ReactNode
  accent?: string
  /** Подложка полосы. Пусто — остаётся собственная тёмная. */
  background?: string
}

// Идея компонента: объявление на всю ширину, которое не притворяется
// уведомлением об ошибке. Полоса тёмная и спокойная, действие — обычная
// ссылка, а на узкой ширине она уходит на вторую строку, а не сжимает текст.
//
// Тёмная полоса — это дизайн, а не тема. Но на тёмной странице подложка 0.24
// сливается с фоном, поэтому в тёмной ветке light-dark() она светлее: цвет
// следует окружению, идея остаётся прежней.
const STYLES = `
:where([data-vibeui-block="banner-001"]){
--vibeui-banner-001-fg:light-dark(oklch(0.96 0.003 265),oklch(0.95 0.004 265));
--vibeui-banner-001-muted:light-dark(oklch(0.78 0.01 265),oklch(0.74 0.012 265));
--vibeui-banner-001-bg:light-dark(oklch(0.24 0.016 265),oklch(0.31 0.014 265));
--vibeui-banner-001-accent:light-dark(oklch(0.72 0.15 200),oklch(0.78 0.13 200));
--vibeui-banner-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="banner-001"]{
/* flex-wrap живёт здесь, а не в @container: контейнерный запрос применяется
   к потомкам контейнера, но не к нему самому. На широкой раскладке перенос
   ни на что не влияет — всё умещается в строку. */
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem;
width:100%;box-sizing:border-box;
padding:0.625rem 0.875rem;
background:
radial-gradient(120% 180% at 0% 50%,color-mix(in oklab,var(--vibeui-banner-001-accent) 22%,transparent),transparent 55%),
var(--vibeui-banner-001-bg);
color:var(--vibeui-banner-001-fg);
font-family:var(--vibeui-banner-001-font);font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="banner-001"] [data-part="tag"]{
flex:none;padding:0.1875rem 0.4375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-banner-001-accent) 25%,transparent);
color:var(--vibeui-banner-001-accent);
font-size:0.6875rem;font-weight:600;letter-spacing:0.02em;
}
[data-vibeui-block="banner-001"] [data-part="message"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="banner-001"] [data-part="action"]{
flex:none;color:var(--vibeui-banner-001-accent);font-weight:600;
text-decoration:none;border-bottom:1px solid transparent;
transition:border-color .16s ease;
}
[data-vibeui-block="banner-001"] [data-part="action"]:hover{border-bottom-color:currentColor}
[data-vibeui-block="banner-001"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-banner-001-accent);outline-offset:3px}
[data-vibeui-block="banner-001"] [data-part="close"]{
appearance:none;border:0;background:transparent;cursor:pointer;flex:none;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
color:var(--vibeui-banner-001-muted);font:inherit;font-size:1rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="banner-001"] [data-part="close"]:hover{background:oklch(1 0 0 / 10%);color:var(--vibeui-banner-001-fg)}
[data-vibeui-block="banner-001"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-banner-001-accent);outline-offset:2px}
/* Узкая полоса: действие переносится под текст, а не сжимает его в столбик. */
@container (max-width: 30rem){
[data-vibeui-block="banner-001"] [data-part="message"]{flex:1 1 100%;order:2}
[data-vibeui-block="banner-001"] [data-part="action"]{order:3}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Полоса-объявление во всю ширину: метка, текст, действие, закрытие.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner001({
  message = "Каталог пополнился компонентами форм — поля, списки и переключатели.",
  tag = "Новое",
  actionLabel = "Посмотреть",
  actionHref = "#",
  onDismiss,
  dismissLabel = "Скрыть объявление",
  regionLabel = "Объявление",
  children,
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner001Props) {
  const palette = {
    ...(accent ? { "--vibeui-banner-001-accent": accent } : null),
    ...(background ? { "--vibeui-banner-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="banner-001"
        role="region"
        aria-label={tag || regionLabel}
        className={className}
        style={palette}
      >
        {tag ? <span data-part="tag">{tag}</span> : null}
        <span data-part="message">{children ?? message}</span>
        {actionLabel ? (
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        ) : null}
        {onDismiss ? (
          <button
            data-part="close"
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
          >
            ×
          </button>
        ) : null}
      </div>
    </>
  )
}
