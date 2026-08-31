import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button047Props = ComponentPropsWithoutRef<"a"> & {
  href?: string
  /** Показывать домен назначения рядом с подписью. */
  showHost?: boolean
  accent?: string
}

// Идея компонента: ссылка, которая честно предупреждает об уходе с сайта.
// Домен вынимается из href прямо в разметку, значок «стрелка из рамки»
// нарисован гранями псевдоэлементов, а для скринридера к подписи добавлена
// скрытая строка «откроется в новой вкладке» — target сам по себе её не даёт.
const STYLES = `
:where([data-vibeui-block="button-047"]){
--vibeui-button-047-surface:oklch(1 0 0);
--vibeui-button-047-border:oklch(0.9 0.006 265);
--vibeui-button-047-fg:oklch(0.26 0.02 265);
--vibeui-button-047-muted:oklch(0.55 0.014 265);
--vibeui-button-047-accent:oklch(0.5 0.16 245);
--vibeui-button-047-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-047-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="button-047"]{
position:relative;
display:inline-flex;align-items:center;gap:0.625rem;box-sizing:border-box;
height:2.625rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-button-047-border);
background:var(--vibeui-button-047-surface);color:var(--vibeui-button-047-fg);
font-family:var(--vibeui-button-047-font);font-size:0.875rem;font-weight:600;line-height:1;
text-decoration:none;
transition:border-color .16s ease,color .16s ease;
}
[data-vibeui-block="button-047"]:hover{border-color:var(--vibeui-button-047-accent);color:var(--vibeui-button-047-accent)}
[data-vibeui-block="button-047"]:focus-visible{outline:2px solid var(--vibeui-button-047-accent);outline-offset:2px}
[data-vibeui-block="button-047"] [data-part="host"]{
font-family:var(--vibeui-button-047-mono);font-size:0.75rem;font-weight:500;
color:var(--vibeui-button-047-muted);
padding:0.1875rem 0.375rem;border-radius:0.3125rem;
background:color-mix(in oklab,var(--vibeui-button-047-accent) 8%,transparent);
}
/* Стрелка, выходящая из рамки: рамка — грани без правого верхнего угла. */
[data-vibeui-block="button-047"] [data-part="out"]{position:relative;flex:none;width:0.875rem;height:0.875rem}
[data-vibeui-block="button-047"] [data-part="out"]::before{
content:"";position:absolute;left:0;bottom:0;width:0.6875rem;height:0.6875rem;
box-sizing:border-box;border:1.5px solid currentColor;border-radius:0.1875rem;
border-top-color:transparent;border-right-color:transparent;
}
[data-vibeui-block="button-047"] [data-part="out"]::after{
content:"";position:absolute;right:0;top:0;width:0.5625rem;height:0.5625rem;
box-sizing:border-box;border:1.5px solid currentColor;border-left:0;border-bottom:0;
background:linear-gradient(45deg,transparent 46%,currentColor 46% 54%,transparent 54%);
}
[data-vibeui-block="button-047"] [data-part="out"]{transition:transform .18s cubic-bezier(0.16,1,0.3,1)}
[data-vibeui-block="button-047"]:hover [data-part="out"]{transform:translate(2px,-2px)}
[data-vibeui-block="button-047"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-047"] *{animation:none!important;transition:none!important}}
`

function hostOf(href: string) {
  try {
    return new URL(href).host.replace(/^www\./, "")
  } catch {
    return href.replace(/^https?:\/\//, "").split("/")[0]
  }
}

/**
 * Ссылка на внешний ресурс со значком выхода и доменом назначения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button047({
  href = "https://ui.shadcn.com/docs",
  showHost = true,
  accent,
  className,
  style,
  children = "Документация shadcn",
  ...props
}: Button047Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-047-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-047" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        data-vibeui-block="button-047"
        className={className}
        style={palette}
      >
        <span data-part="label">{children}</span>
        {showHost ? <span data-part="host">{hostOf(href)}</span> : null}
        <span data-part="out" aria-hidden="true" />
        <span data-part="sr">(откроется в новой вкладке)</span>
      </a>
    </>
  )
}
