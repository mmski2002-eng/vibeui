import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  retryLabel?: string
  code?: string
  detail?: string
  onRetry?: () => void
}

// Идея компонента: ошибка загрузки, а не пустой раздел. Разница
// принципиальная: данные есть, их не удалось получить, поэтому главное
// действие — повторить, а не «создать первое». Технические подробности
// спрятаны в details: разработчику они нужны, остальным мешают.
const STYLES = `
:where([data-vibeui-block="empty-007"]){
--vibeui-empty-007-bg:oklch(1 0 0);
--vibeui-empty-007-fg:oklch(0.21 0.014 265);
--vibeui-empty-007-muted:oklch(0.55 0.014 265);
--vibeui-empty-007-border:oklch(0.91 0.006 265);
--vibeui-empty-007-danger:oklch(0.55 0.2 25);
--vibeui-empty-007-danger-soft:oklch(0.95 0.03 25);
--vibeui-empty-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-empty-007-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="empty-007"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-007-bg);
border:1px solid var(--vibeui-empty-007-border);border-radius:1rem;
font-family:var(--vibeui-empty-007-font);color:var(--vibeui-empty-007-fg);
}
/* Треугольник с восклицанием: тревога читается формой, а не только цветом. */
[data-vibeui-block="empty-007"] [data-part="mark"]{
position:relative;width:2.75rem;height:2.75rem;border-radius:0.875rem;
background:var(--vibeui-empty-007-danger-soft);color:var(--vibeui-empty-007-danger);
}
[data-vibeui-block="empty-007"] [data-part="mark"]::before{
content:"";position:absolute;left:50%;top:0.75rem;width:2px;height:0.8125rem;
margin-left:-1px;border-radius:9999px;background:currentColor;
}
[data-vibeui-block="empty-007"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;bottom:0.6875rem;width:2px;height:2px;
margin-left:-1px;border-radius:9999px;background:currentColor;
}
[data-vibeui-block="empty-007"] [data-part="title"]{margin:0.125rem 0 0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-007"] [data-part="text"]{
margin:0;max-width:34ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-007-muted);
}
[data-vibeui-block="empty-007"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-007-fg);color:oklch(0.99 0.004 265);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-007"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-007-danger);outline-offset:2px}
/* Подробности по требованию: details не требует состояния и клиентского кода. */
[data-vibeui-block="empty-007"] details{width:100%;margin-top:0.5rem;font-size:0.75rem}
[data-vibeui-block="empty-007"] summary{
cursor:pointer;list-style:none;
color:var(--vibeui-empty-007-muted);font-weight:650;
}
[data-vibeui-block="empty-007"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="empty-007"] summary:focus-visible{outline:2px solid var(--vibeui-empty-007-danger);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="empty-007"] [data-part="detail"]{
margin:0.5rem 0 0;padding:0.5rem 0.625rem;
background:oklch(0.97 0.003 265);border-radius:0.5rem;
font-family:var(--vibeui-empty-007-mono);font-size:0.6875rem;line-height:1.45;
color:var(--vibeui-empty-007-muted);text-align:left;overflow-wrap:anywhere;white-space:pre-line;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Ошибка загрузки с повтором: подробности спрятаны в details.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty007({
  title = "Не удалось загрузить список",
  text = "Данные не потерялись — сервер не ответил вовремя. Обычно помогает повтор через несколько секунд.",
  retryLabel = "Повторить",
  code = "504 Gateway Timeout",
  detail = "GET /api/projects?page=1 — превышено время ожидания 15 000 мс. Запрос 8f2c-41ab.",
  onRetry,
  className,
  style,
  ...props
}: Empty007Props) {
  return (
    <>
      <style href="vibeui-empty-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-007"
        role="alert"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onRetry}>
          {retryLabel}
        </button>
        <details>
          <summary>Подробности ошибки</summary>
          <p data-part="detail">
            {code}
            {"\n"}
            {detail}
          </p>
        </details>
      </div>
    </>
  )
}
