import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alert011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  /** Техническая подробность: код ошибки, ответ сервера, stack trace. */
  details?: string
  /** Идентификатор обращения в поддержку. */
  reference?: string
  copyLabel?: string
  onCopy?: () => void
}

// Идея компонента: ошибка, с которой пойдут в поддержку. Человеческое
// объяснение сверху, техническая подробность — под ним в свёрнутом блоке:
// разработчику она нужна целиком, пользователю не нужна вовсе. Свёрнуто на
// нативном details, поэтому раскрытие не требует состояния и работает
// до гидратации.
const STYLES = `
:where([data-vibeui-block="alert-011"]){
--vibeui-alert-011-fg:oklch(0.24 0.016 265);
--vibeui-alert-011-muted:oklch(0.5 0.014 265);
--vibeui-alert-011-bg:oklch(1 0 0);
--vibeui-alert-011-code-bg:oklch(0.22 0.014 265);
--vibeui-alert-011-code-fg:oklch(0.93 0.006 265);
--vibeui-alert-011-border:oklch(0.9 0.006 265);
--vibeui-alert-011-danger:oklch(0.56 0.19 25);
--vibeui-alert-011-radius:0.75rem;
--vibeui-alert-011-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-alert-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alert-011"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;
padding:0.9375rem 1.0625rem;
border:1px solid var(--vibeui-alert-011-border);
border-radius:var(--vibeui-alert-011-radius);
background:var(--vibeui-alert-011-bg);color:var(--vibeui-alert-011-fg);
font-family:var(--vibeui-alert-011-font);
}
[data-vibeui-block="alert-011"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.375rem;height:1.375rem;margin-top:0.0625rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-alert-011-danger) 14%,transparent);
color:var(--vibeui-alert-011-danger);
font-size:0.75rem;font-weight:800;line-height:1;
}
[data-vibeui-block="alert-011"] [data-part="text"]{display:flex;flex-direction:column;gap:0.25rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-011"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="alert-011"] [data-part="description"]{font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-011-muted);max-width:60ch}
[data-vibeui-block="alert-011"] [data-part="reference"]{
font-size:0.75rem;color:var(--vibeui-alert-011-muted);
font-family:var(--vibeui-alert-011-mono);
}
[data-vibeui-block="alert-011"] summary{
display:inline-flex;align-items:center;gap:0.375rem;
margin-top:0.25rem;cursor:pointer;list-style:none;width:fit-content;
font-size:0.8125rem;font-weight:600;color:var(--vibeui-alert-011-danger);
}
[data-vibeui-block="alert-011"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="alert-011"] summary:focus-visible{outline:2px solid var(--vibeui-alert-011-danger);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="alert-011"] [data-part="chevron"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
transition:transform .18s ease;
}
[data-vibeui-block="alert-011"] details[open] [data-part="chevron"]{transform:rotate(225deg) translate(-0.0625rem,-0.0625rem)}
/* Подробность — тёмный моноширинный блок: её копируют целиком, а не читают. */
[data-vibeui-block="alert-011"] pre{
margin:0.5rem 0 0;padding:0.6875rem 0.8125rem;
border-radius:0.5rem;overflow-x:auto;
background:var(--vibeui-alert-011-code-bg);color:var(--vibeui-alert-011-code-fg);
font-family:var(--vibeui-alert-011-mono);font-size:0.75rem;line-height:1.5;
}
[data-vibeui-block="alert-011"] [data-part="copy"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
margin-top:0.4375rem;color:var(--vibeui-alert-011-muted);
font:inherit;font-size:0.75rem;text-decoration:underline;
}
[data-vibeui-block="alert-011"] [data-part="copy"]:hover{color:var(--vibeui-alert-011-fg)}
[data-vibeui-block="alert-011"] [data-part="copy"]:focus-visible{outline:2px solid var(--vibeui-alert-011-danger);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-011"] *{animation:none!important;transition:none!important}}
`

/**
 * Ошибка с технической подробностью в свёрнутом блоке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert011({
  title = "Не удалось опубликовать проект",
  description = "Сборка остановилась на странице «Услуги». Прошлая версия сайта продолжает работать — посетители ничего не заметили.",
  details = "Error: build failed at page /services\n  at renderPage (build.js:184:11)\n  at async publish (deploy.js:52:5)\ncode: E_BUILD_FAILED\nrequest: 8f2c-41ab-9d70",
  reference = "Обращение 8f2c-41ab",
  copyLabel = "Скопировать подробности",
  onCopy,
  className,
  style,
  ...props
}: Alert011Props) {
  return (
    <>
      <style href="vibeui-alert-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alert-011"
        role="alert"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="icon" aria-hidden="true">
          !
        </span>
        <div data-part="text">
          <span data-part="title">{title}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
          {reference ? <span data-part="reference">{reference}</span> : null}
          {details ? (
            <details>
              <summary>
                Подробности
                <span data-part="chevron" aria-hidden="true" />
              </summary>
              <pre>{details}</pre>
              {onCopy ? (
                <button data-part="copy" type="button" onClick={onCopy}>
                  {copyLabel}
                </button>
              ) : null}
            </details>
          ) : null}
        </div>
      </div>
    </>
  )
}
