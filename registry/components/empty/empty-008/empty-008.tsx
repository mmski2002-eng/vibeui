import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  owner?: string
  reason?: string
  actionLabel?: string
  onAction?: () => void
  accent?: string
}

// Идея компонента: закрытый раздел, а не пустой. Раздражает не отказ, а
// тупик: непонятно, почему нельзя и у кого просить. Поэтому здесь названа
// причина, назван владелец доступа, и одно действие — попросить у него.
// Пустым состоянием это притворяться не должно: данные есть, их не отдают.
const STYLES = `
:where([data-vibeui-block="empty-008"]){
--vibeui-empty-008-bg:oklch(1 0 0);
--vibeui-empty-008-fg:oklch(0.21 0.014 265);
--vibeui-empty-008-muted:oklch(0.55 0.014 265);
--vibeui-empty-008-border:oklch(0.91 0.006 265);
--vibeui-empty-008-accent:oklch(0.55 0.17 265);
--vibeui-empty-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="empty-008"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-008-bg);
border:1px solid var(--vibeui-empty-008-border);border-radius:1rem;
font-family:var(--vibeui-empty-008-font);color:var(--vibeui-empty-008-fg);
}
/* Замок: дужка бордюром, корпус блоком — иконочный шрифт не нужен. */
[data-vibeui-block="empty-008"] [data-part="mark"]{
position:relative;width:2.5rem;height:2.5rem;color:var(--vibeui-empty-008-muted);
}
[data-vibeui-block="empty-008"] [data-part="mark"]::before{
content:"";position:absolute;left:50%;top:0.1875rem;width:1.125rem;height:0.875rem;
margin-left:-0.5625rem;box-sizing:border-box;
border:2px solid currentColor;border-bottom:0;border-radius:0.5625rem 0.5625rem 0 0;
}
[data-vibeui-block="empty-008"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;top:1rem;width:1.75rem;height:1.3125rem;
margin-left:-0.875rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-empty-008-accent) 16%,transparent);
border:1.5px solid color-mix(in oklab,var(--vibeui-empty-008-accent) 45%,transparent);
}
[data-vibeui-block="empty-008"] [data-part="title"]{margin:0.125rem 0 0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-008"] [data-part="text"]{
margin:0;max-width:34ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-008-muted);
}
/* Причина отдельной строкой: без неё отказ выглядит сбоем. */
[data-vibeui-block="empty-008"] [data-part="reason"]{
margin:0.25rem 0 0;padding:0.375rem 0.75rem;border-radius:9999px;
background:oklch(0.97 0.003 265);
font-size:0.75rem;font-weight:600;color:var(--vibeui-empty-008-fg);
}
[data-vibeui-block="empty-008"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-008-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-008"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-008-accent);outline-offset:2px}
[data-vibeui-block="empty-008"] [data-part="owner"]{
margin:0.375rem 0 0;font-size:0.6875rem;color:var(--vibeui-empty-008-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Нет доступа: причина, владелец доступа и одно действие — запросить.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty008({
  title = "Раздел закрыт для вашей роли",
  text = "Аналитика видна владельцу пространства и редакторам. Запрос уходит письмом, ответ придёт в уведомления.",
  owner = "Доступ выдаёт Мария Гурова, владелец пространства",
  reason = "Ваша роль: наблюдатель",
  actionLabel = "Запросить доступ",
  onAction,
  accent,
  className,
  style,
  ...props
}: Empty008Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-008"
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="reason">{reason}</p>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onAction}>
          {actionLabel}
        </button>
        <p data-part="owner">{owner}</p>
      </div>
    </>
  )
}
