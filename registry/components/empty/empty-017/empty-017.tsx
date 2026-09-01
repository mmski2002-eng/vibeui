import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  actionLabel?: string
  onAction?: () => void
  checkedAt?: string
  accent?: string
}

// Идея компонента: пустой почтовый ящик — это хорошая новость, а не повод
// молчать. Знак конверта с галочкой и время последней проверки подтверждают,
// что всё честно прочитано, а не потерялось при загрузке. Действие одно —
// написать новое письмо, второго входа в этот экран не нужно.
const STYLES = `
:where([data-vibeui-block="empty-017"]){
--vibeui-empty-017-bg:oklch(1 0 0);
--vibeui-empty-017-fg:oklch(0.21 0.014 265);
--vibeui-empty-017-muted:oklch(0.55 0.014 265);
--vibeui-empty-017-border:oklch(0.91 0.006 265);
--vibeui-empty-017-accent:oklch(0.55 0.17 265);
--vibeui-empty-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="empty-017"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-017-bg);
border:1px solid var(--vibeui-empty-017-border);border-radius:1rem;
font-family:var(--vibeui-empty-017-font);color:var(--vibeui-empty-017-fg);
}
[data-vibeui-block="empty-017"] [data-part="mark"]{
width:2.5rem;height:2.5rem;color:var(--vibeui-empty-017-accent);
}
[data-vibeui-block="empty-017"] [data-part="title"]{margin:0.125rem 0 0;font-size:1.0625rem;font-weight:700;line-height:1.3}
[data-vibeui-block="empty-017"] [data-part="text"]{
margin:0;max-width:30ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-017-muted);
}
[data-vibeui-block="empty-017"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;width:100%;margin-top:0.375rem;
height:2.625rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-017-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="empty-017"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-empty-017-accent);outline-offset:2px;
}
[data-vibeui-block="empty-017"] [data-part="checked"]{
margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-empty-017-muted);
}
@container (max-width: 18rem){
[data-vibeui-block="empty-017"] [data-part="title"]{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-017"] *{animation:none!important;transition:none!important}}
`

/**
 * Пустой почтовый ящик: всё прочитано, действие одно — написать письмо.
 * Один файл, ноль внешних зависимостей.
 */
export function Empty017({
  title = "Все письма прочитаны",
  text = "Новых сообщений нет. Как только кто-то напишет, письмо появится здесь.",
  actionLabel = "Написать",
  onAction,
  checkedAt = "Проверено только что",
  accent,
  className,
  style,
  ...props
}: Empty017Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-017"
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
          <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11Z" />
          <path d="m3.5 6.5 8.5 6 8.5-6" />
          <path d="m9 15.5 2 2 4-4.5" />
        </svg>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onAction}>
          {actionLabel}
        </button>
        <p data-part="checked">{checkedAt}</p>
      </div>
    </>
  )
}
