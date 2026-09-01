import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty014Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  actionLabel?: string
  onAction?: () => void
  savedCount?: number
  savedLabel?: string
  onSavedClick?: () => void
  accent?: string
}

// Идея компонента: пустая корзина в вебе часто читается как отказ, а не
// приглашение. Здесь ровно одно действие — вернуться в каталог, а товары,
// отложенные в избранное, не теряются молча: если они есть, под кнопкой
// появляется отдельная строка с переходом к ним.
const STYLES = `
:where([data-vibeui-block="empty-014"]){
--vibeui-empty-014-bg:oklch(1 0 0);
--vibeui-empty-014-fg:oklch(0.21 0.014 265);
--vibeui-empty-014-muted:oklch(0.55 0.014 265);
--vibeui-empty-014-border:oklch(0.91 0.006 265);
--vibeui-empty-014-accent:oklch(0.55 0.17 265);
--vibeui-empty-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="empty-014"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-014-bg);
border:1px solid var(--vibeui-empty-014-border);border-radius:1rem;
font-family:var(--vibeui-empty-014-font);color:var(--vibeui-empty-014-fg);
}
[data-vibeui-block="empty-014"] [data-part="mark"]{
width:2.5rem;height:2.5rem;color:var(--vibeui-empty-014-muted);
}
[data-vibeui-block="empty-014"] [data-part="title"]{margin:0.125rem 0 0;font-size:1.0625rem;font-weight:700;line-height:1.3}
[data-vibeui-block="empty-014"] [data-part="text"]{
margin:0;max-width:30ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-014-muted);
}
[data-vibeui-block="empty-014"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;width:100%;margin-top:0.375rem;
height:2.625rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-014-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="empty-014"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-empty-014-accent);outline-offset:2px;
}
[data-vibeui-block="empty-014"] [data-part="saved"]{
display:flex;align-items:center;justify-content:center;gap:0.375rem;flex-wrap:wrap;
margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-empty-014-muted);
}
[data-vibeui-block="empty-014"] [data-part="saved-link"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
color:var(--vibeui-empty-014-accent);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="empty-014"] [data-part="saved-link"]:focus-visible{
outline:2px solid var(--vibeui-empty-014-accent);outline-offset:2px;border-radius:0.25rem;
}
@container (max-width: 18rem){
[data-vibeui-block="empty-014"] [data-part="saved"]{flex-direction:column;gap:0.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-014"] *{animation:none!important;transition:none!important}}
`

/**
 * Пустая корзина с единственным действием — вернуться в каталог.
 * Если есть отложенные в избранное товары, под кнопкой появляется
 * отдельная ссылка на них. Один файл, ноль внешних зависимостей.
 */
export function Empty014({
  title = "Корзина пуста",
  text = "Добавленные товары появятся здесь. Загляните в каталог — там уже есть на что посмотреть.",
  actionLabel = "Перейти в каталог",
  onAction,
  savedCount = 0,
  savedLabel = "Смотреть",
  onSavedClick,
  accent,
  className,
  style,
  ...props
}: Empty014Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-014"
        role="status"
        className={className}
        style={palette}
      >
        <svg
          data-part="mark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M2.5 3h2.1l1 3M5.6 6h15.4l-1.9 7.4a1.7 1.7 0 0 1-1.65 1.3H8.9a1.7 1.7 0 0 1-1.64-1.28L5.6 6Z" />
          <circle cx="9.3" cy="20" r="1.3" />
          <circle cx="17.3" cy="20" r="1.3" />
        </svg>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onAction}>
          {actionLabel}
        </button>
        {savedCount > 0 ? (
          <p data-part="saved">
            Сохранено в избранном: {savedCount}
            <button type="button" data-part="saved-link" onClick={onSavedClick}>
              {savedLabel}
            </button>
          </p>
        ) : null}
      </div>
    </>
  )
}
