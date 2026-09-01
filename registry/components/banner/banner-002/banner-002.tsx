import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Banner002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  message?: string
  /** Номер новой версии: без него «обновитесь» звучит как реклама. */
  version?: string
  actionLabel?: string
  onReload?: () => void
}

// Идея компонента: полоса «вышла новая версия» с одним честным действием —
// перезагрузить страницу. Точка слева мигает медленно и не требует внимания:
// обновление можно отложить, ничего не сломается.
const STYLES = `
:where([data-vibeui-block="banner-002"]){
--vibeui-banner-002-bg:oklch(0.97 0.02 220);
--vibeui-banner-002-fg:oklch(0.27 0.05 240);
--vibeui-banner-002-muted:oklch(0.48 0.05 240);
--vibeui-banner-002-border:oklch(0.86 0.05 230);
--vibeui-banner-002-accent:oklch(0.52 0.16 245);
--vibeui-banner-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-banner-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="banner-002"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-banner-002-font);color:var(--vibeui-banner-002-fg);
}
[data-vibeui-block="banner-002"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
box-sizing:border-box;padding:0.6875rem 1rem;
border:1px solid var(--vibeui-banner-002-border);border-radius:0.875rem;
background:var(--vibeui-banner-002-bg);
}
[data-vibeui-block="banner-002"] [data-part="pulse"]{
position:relative;flex:none;width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-banner-002-accent);
}
/* Медленный пульс: обновление можно отложить, тревожить не нужно. */
[data-vibeui-block="banner-002"] [data-part="pulse"]::after{
content:"";position:absolute;inset:-0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-banner-002-accent);
animation:vibeui-banner-002-pulse 2.4s ease-out infinite;
}
@keyframes vibeui-banner-002-pulse{
0%{opacity:.7;transform:scale(.6)}
100%{opacity:0;transform:scale(1.5)}
}
[data-vibeui-block="banner-002"] [data-part="text"]{
flex:1 1 14rem;min-width:0;margin:0;font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="banner-002"] [data-part="version"]{
font-family:var(--vibeui-banner-002-mono);font-size:0.75rem;font-weight:600;
padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:oklch(1 0 0 / 65%);color:var(--vibeui-banner-002-muted);
}
[data-vibeui-block="banner-002"] [data-part="action"]{
appearance:none;cursor:pointer;border:0;flex:none;
height:1.9375rem;padding:0 0.8125rem;border-radius:0.5rem;
background:var(--vibeui-banner-002-accent);color:oklch(0.99 0.01 245);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="banner-002"] [data-part="action"]:hover{filter:brightness(1.08)}
[data-vibeui-block="banner-002"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-banner-002-accent);outline-offset:2px}
@container (max-width: 30rem){
[data-vibeui-block="banner-002"] [data-part="shell"]{align-items:flex-start}
[data-vibeui-block="banner-002"] [data-part="action"]{width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Полоса обновления: сообщение о новой версии и кнопка перезагрузки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner002({
  message = "Вышла новая версия приложения. Перезагрузите страницу, чтобы получить исправления.",
  version = "2.8.0",
  actionLabel = "Перезагрузить",
  onReload,
  className,
  style,
  ...props
}: Banner002Props) {
  return (
    <>
      <style href="vibeui-banner-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="banner-002"
        role="status"
        aria-live="polite"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="shell">
          <span data-part="pulse" aria-hidden="true" />
          <p data-part="text">
            {message}{" "}
            {version ? <span data-part="version">v{version}</span> : null}
          </p>
          <button data-part="action" type="button" onClick={onReload}>
            {actionLabel}
          </button>
        </div>
      </div>
    </>
  )
}
