import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  updatedAt?: string
  retryLabel?: string
  onRetry?: () => void
}

// Идея компонента: офлайн-состояние, которое не выглядит поломкой приложения.
// Пульсирующая точка показывает, что попытки продолжаются сами, строка с
// временем последнего обновления говорит, насколько устарели данные на
// экране, а кнопка нужна тем, кто не хочет ждать очередной попытки.
const STYLES = `
:where([data-vibeui-block="empty-009"]){
--vibeui-empty-009-bg:oklch(0.99 0.002 265);
--vibeui-empty-009-fg:oklch(0.21 0.014 265);
--vibeui-empty-009-muted:oklch(0.55 0.014 265);
--vibeui-empty-009-border:oklch(0.91 0.006 265);
--vibeui-empty-009-wait:oklch(0.62 0.15 65);
--vibeui-empty-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="empty-009"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-009-bg);
border:1px solid var(--vibeui-empty-009-border);border-radius:1rem;
font-family:var(--vibeui-empty-009-font);color:var(--vibeui-empty-009-fg);
}
/* Облако с перечёркиванием: связь не «сломана», а отсутствует. */
[data-vibeui-block="empty-009"] [data-part="mark"]{
position:relative;width:3rem;height:2.25rem;color:var(--vibeui-empty-009-muted);
}
[data-vibeui-block="empty-009"] [data-part="mark"]::before{
content:"";position:absolute;left:0.25rem;bottom:0.5rem;width:2.5rem;height:1.125rem;
border:2px solid currentColor;border-radius:9999px 9999px 0.5rem 0.5rem;opacity:.6;
}
[data-vibeui-block="empty-009"] [data-part="mark"]::after{
content:"";position:absolute;left:0.125rem;top:0.1875rem;width:2.75rem;height:2px;
background:var(--vibeui-empty-009-wait);transform:rotate(38deg);transform-origin:left center;
border-radius:9999px;
}
[data-vibeui-block="empty-009"] [data-part="title"]{margin:0.125rem 0 0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-009"] [data-part="text"]{
margin:0;max-width:32ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-009-muted);
}
/* Точка пульсирует, пока идут повторы: ожидание должно быть видно. */
[data-vibeui-block="empty-009"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.4375rem;margin:0.25rem 0 0;
padding:0.3125rem 0.6875rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-empty-009-wait) 14%,transparent);
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="empty-009"] [data-part="pulse"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-empty-009-wait);
animation:vibeui-empty-009-pulse 1.6s ease-in-out infinite;
}
@keyframes vibeui-empty-009-pulse{
0%,100%{opacity:1;transform:scale(1)}
50%{opacity:.35;transform:scale(0.72)}
}
[data-vibeui-block="empty-009"] [data-part="action"]{
appearance:none;cursor:pointer;margin-top:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
border:1px solid var(--vibeui-empty-009-border);
background:oklch(1 0 0);color:var(--vibeui-empty-009-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-009"] [data-part="action"]:hover{background:oklch(0.97 0.003 265)}
[data-vibeui-block="empty-009"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-009-wait);outline-offset:2px}
[data-vibeui-block="empty-009"] [data-part="stamp"]{
margin:0.375rem 0 0;font-size:0.6875rem;color:var(--vibeui-empty-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Офлайн-состояние: видимое ожидание, возраст данных и повтор вручную.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty009({
  title = "Нет соединения",
  text = "Список откроется сам, как только связь вернётся. Ничего из введённого не потеряно.",
  updatedAt = "Данные на экране от 14:08",
  retryLabel = "Попробовать сейчас",
  onRetry,
  className,
  style,
  ...props
}: Empty009Props) {
  return (
    <>
      <style href="vibeui-empty-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-009"
        role="status"
        aria-live="polite"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="status">
          <span data-part="pulse" aria-hidden="true" />
          Пробуем переподключиться
        </p>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onRetry}>
          {retryLabel}
        </button>
        <p data-part="stamp">{updatedAt}</p>
      </div>
    </>
  )
}
