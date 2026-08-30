import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Alert005Tone = "info" | "success" | "warning" | "danger"

export type Alert005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  tone?: Alert005Tone
  title?: string
  description?: string
  /** Строка под текстом: ссылка «Больше не показывать», подпись автора. */
  footnote?: ReactNode
  /** Без обработчика крестик не рисуется: кнопка, которая ничего не делает, обманывает. */
  onDismiss?: () => void
}

// Идея компонента: закрываемое сообщение. Крестик появляется только вместе с
// обработчиком, а под текстом остаётся место для строки вроде «больше не
// показывать» — потому что закрыть один раз и закрыть навсегда это разные
// решения, и второе нельзя прятать в тот же крестик.
const STYLES = `
:where([data-vibeui-block="alert-005"]){
--vibeui-alert-005-fg:oklch(0.24 0.016 265);
--vibeui-alert-005-muted:oklch(0.5 0.014 265);
--vibeui-alert-005-bg:oklch(1 0 0);
--vibeui-alert-005-border:oklch(0.9 0.006 265);
--vibeui-alert-005-tone:oklch(0.58 0.18 262);
--vibeui-alert-005-radius:0.75rem;
--vibeui-alert-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alert-005"]{
position:relative;display:flex;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;
padding:0.875rem 2.5rem 0.875rem 1rem;
border:1px solid var(--vibeui-alert-005-border);
border-radius:var(--vibeui-alert-005-radius);
background:var(--vibeui-alert-005-bg);color:var(--vibeui-alert-005-fg);
font-family:var(--vibeui-alert-005-font);
}
[data-vibeui-block="alert-005"][data-tone="success"]{--vibeui-alert-005-tone:oklch(0.58 0.15 152)}
[data-vibeui-block="alert-005"][data-tone="warning"]{--vibeui-alert-005-tone:oklch(0.68 0.15 70)}
[data-vibeui-block="alert-005"][data-tone="danger"]{--vibeui-alert-005-tone:oklch(0.56 0.19 25)}
[data-vibeui-block="alert-005"] [data-part="rail"]{
flex:none;width:0.25rem;align-self:stretch;border-radius:9999px;
background:var(--vibeui-alert-005-tone);
}
[data-vibeui-block="alert-005"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-005"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="alert-005"] [data-part="description"]{font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-005-muted);max-width:62ch}
[data-vibeui-block="alert-005"] [data-part="footnote"]{
margin-top:0.375rem;font-size:0.75rem;color:var(--vibeui-alert-005-muted);
}
[data-vibeui-block="alert-005"] [data-part="footnote"] a,
[data-vibeui-block="alert-005"] [data-part="footnote"] button{
color:var(--vibeui-alert-005-tone);font:inherit;
background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;
}
/* Крестик прижат к правому верхнему углу, а не стоит в потоке: иначе он
   тянет на себя первую строку текста. */
[data-vibeui-block="alert-005"] [data-part="close"]{
position:absolute;top:0.625rem;right:0.625rem;
appearance:none;border:0;background:transparent;cursor:pointer;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
color:var(--vibeui-alert-005-muted);font:inherit;font-size:1rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="alert-005"] [data-part="close"]:hover{
background:color-mix(in oklab,var(--vibeui-alert-005-border) 45%,transparent);
color:var(--vibeui-alert-005-fg);
}
[data-vibeui-block="alert-005"] [data-part="close"]:focus-visible,
[data-vibeui-block="alert-005"] [data-part="footnote"] a:focus-visible,
[data-vibeui-block="alert-005"] [data-part="footnote"] button:focus-visible{
outline:2px solid var(--vibeui-alert-005-tone);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Закрываемое сообщение: крестик и строка «больше не показывать».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert005({
  tone = "info",
  title = "Черновик сохраняется автоматически",
  description = "Изменения записываются каждые несколько секунд. Опубликовать их нужно отдельно — кнопкой в шапке проекта.",
  footnote = "Больше не показывать",
  onDismiss,
  className,
  style,
  ...props
}: Alert005Props) {
  return (
    <>
      <style href="vibeui-alert-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-005"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="rail" aria-hidden="true" />
        <span data-part="text">
          {title ? <span data-part="title">{title}</span> : null}
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
          {footnote ? <span data-part="footnote">{footnote}</span> : null}
        </span>
        {onDismiss ? (
          <button
            data-part="close"
            type="button"
            onClick={onDismiss}
            aria-label="Закрыть сообщение"
          >
            ×
          </button>
        ) : null}
      </div>
    </>
  )
}
