import type { CSSProperties } from "react"

export type Dialog005Tone = "success" | "danger"

export type Dialog005Props = {
  id?: string
  trigger?: string
  tone?: Dialog005Tone
  title?: string
  description?: string
  /** Строка-итог под текстом: адрес, номер, время выполнения. */
  detail?: string
  primaryLabel?: string
  primaryHref?: string
  closeLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно результата операции. У него один смысловой центр —
// крупный знак сверху, потому что первое, что нужно понять, это «получилось
// или нет». Кнопка ведёт к результату (открыть сайт, посмотреть журнал), а
// закрытие остаётся тихим: окно результата не требует решения.
const STYLES = `
:where([data-vibeui-block="dialog-005"]){
--vibeui-dialog-005-fg:oklch(0.22 0.016 265);
--vibeui-dialog-005-muted:oklch(0.5 0.014 265);
--vibeui-dialog-005-bg:oklch(1 0 0);
--vibeui-dialog-005-border:oklch(0.89 0.006 265);
--vibeui-dialog-005-tone:oklch(0.58 0.15 152);
--vibeui-dialog-005-radius:1rem;
--vibeui-dialog-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dialog-005"]{display:inline-flex;font-family:var(--vibeui-dialog-005-font)}
[data-vibeui-block="dialog-005"][data-tone="danger"]{--vibeui-dialog-005-tone:oklch(0.56 0.19 25)}
[data-vibeui-block="dialog-005"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-005-border);border-radius:0.5rem;
background:var(--vibeui-dialog-005-bg);color:var(--vibeui-dialog-005-fg);
}
[data-vibeui-block="dialog-005"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-005-border) 30%,transparent)}
[data-vibeui-block="dialog-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-005-tone);outline-offset:2px}
[data-vibeui-dialog-005-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(24rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.5rem;
text-align:center;
border:1px solid var(--vibeui-dialog-005-border,oklch(0.89 0.006 265));
border-radius:var(--vibeui-dialog-005-radius,1rem);
background:var(--vibeui-dialog-005-bg,oklch(1 0 0));
color:var(--vibeui-dialog-005-fg,oklch(0.22 0.016 265));
font-family:var(--vibeui-dialog-005-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.96);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-005-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-005-window]:popover-open{opacity:0;transform:scale(0.96)}}
[data-vibeui-dialog-005-window]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
/* Знак результата: круг с галочкой или восклицательным знаком на CSS. */
[data-vibeui-dialog-005-window] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:3rem;height:3rem;margin:0 auto 0.875rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-dialog-005-tone,oklch(0.58 0.15 152)) 14%,transparent);
color:var(--vibeui-dialog-005-tone,oklch(0.58 0.15 152));
font-size:1.375rem;font-weight:800;line-height:1;
}
[data-vibeui-dialog-005-window] [data-part="title"]{margin:0 0 0.375rem;font-size:1.0625rem;font-weight:650;line-height:1.35}
[data-vibeui-dialog-005-window] [data-part="description"]{margin:0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-dialog-005-muted,oklch(0.5 0.014 265))}
[data-vibeui-dialog-005-window] [data-part="detail"]{
display:inline-block;margin-top:0.875rem;padding:0.375rem 0.625rem;
border-radius:0.5rem;background:color-mix(in oklab,var(--vibeui-dialog-005-border,oklch(0.89 0.006 265)) 35%,transparent);
font-size:0.8125rem;
}
[data-vibeui-dialog-005-window] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem;margin-top:1.25rem}
[data-vibeui-dialog-005-window] [data-part="primary"]{
display:inline-flex;align-items:center;justify-content:center;height:2.375rem;
border-radius:0.5rem;text-decoration:none;
background:var(--vibeui-dialog-005-tone,oklch(0.58 0.15 152));color:oklch(1 0 0);
font-size:0.875rem;font-weight:600;
}
[data-vibeui-dialog-005-window] [data-part="primary"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-005-window] [data-part="close"]{
appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-dialog-005-muted,oklch(0.5 0.014 265));font:inherit;font-size:0.875rem;
}
[data-vibeui-dialog-005-window] [data-part="close"]:hover{color:var(--vibeui-dialog-005-fg,oklch(0.22 0.016 265))}
[data-vibeui-dialog-005-window] a:focus-visible,
[data-vibeui-dialog-005-window] button:focus-visible{outline:2px solid var(--vibeui-dialog-005-tone,oklch(0.58 0.15 152));outline-offset:2px;border-radius:0.375rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-005"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-005-window]{transition:none!important;opacity:1;transform:none}
}
`

/**
 * Окно результата операции: крупный знак, итог и путь дальше.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog005({
  id = "vibeui-dialog-005",
  trigger = "Показать результат",
  tone = "success",
  title = "Проект опубликован",
  description = "Сборка заняла 42 секунды. Изменения уже видны посетителям.",
  detail = "studio-polet.ru",
  primaryLabel = "Открыть сайт",
  primaryHref = "#",
  closeLabel = "Закрыть",
  className,
  style,
}: Dialog005Props) {
  return (
    <>
      <style href="vibeui-dialog-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="dialog-005"
        data-tone={tone}
        className={className}
        style={style}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-005-window=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          style={style}
        >
          <span data-part="mark" aria-hidden="true">
            {tone === "success" ? "✓" : "!"}
          </span>
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          {description ? <p data-part="description">{description}</p> : null}
          {detail ? <span data-part="detail">{detail}</span> : null}
          <div data-part="actions">
            {primaryLabel ? (
              <a data-part="primary" href={primaryHref}>
                {primaryLabel}
              </a>
            ) : null}
            <button data-part="close" type="button" popoverTarget={id}>
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
