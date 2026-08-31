import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Codeblock004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  command?: string
  prompt?: string
  cwd?: string
  branch?: string
}

// Идея компонента: одна строка терминала, а не блок кода. Приглашение и
// каретка нарисованы псевдоэлементами, поэтому выделяется и копируется
// только сама команда — приглашение в буфер не уезжает.
const STYLES = `
:where([data-vibeui-block="codeblock-004"]){
--vibeui-codeblock-004-bg:oklch(0.16 0.012 160);
--vibeui-codeblock-004-fg:oklch(0.93 0.02 160);
--vibeui-codeblock-004-muted:oklch(0.64 0.03 160);
--vibeui-codeblock-004-prompt:oklch(0.82 0.16 148);
--vibeui-codeblock-004-branch:oklch(0.82 0.12 85);
--vibeui-codeblock-004-border:oklch(0.82 0.16 148 / 26%);
--vibeui-codeblock-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="codeblock-004"]{
display:block;width:100%;max-width:30rem;box-sizing:border-box;
padding:0.75rem 0.9375rem;
border:1px solid var(--vibeui-codeblock-004-border);border-radius:0.625rem;
background:var(--vibeui-codeblock-004-bg);color:var(--vibeui-codeblock-004-fg);
font-family:var(--vibeui-codeblock-004-mono);font-size:0.8125rem;line-height:1.6;
}
[data-vibeui-block="codeblock-004"] [data-part="where"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem;
margin-bottom:0.25rem;font-size:0.75rem;color:var(--vibeui-codeblock-004-muted);
}
[data-vibeui-block="codeblock-004"] [data-part="branch"]{color:var(--vibeui-codeblock-004-branch)}
[data-vibeui-block="codeblock-004"] [data-part="branch"]::before{content:"⎇ ";opacity:.7}
[data-vibeui-block="codeblock-004"] [data-part="line"]{
display:flex;align-items:baseline;gap:0.5rem;margin:0;
}
/* Приглашение — псевдоэлемент: копируется только команда. */
[data-vibeui-block="codeblock-004"] [data-part="line"]::before{
content:attr(data-prompt);flex:none;
color:var(--vibeui-codeblock-004-prompt);font-weight:700;
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-004"] code{
font:inherit;white-space:pre-wrap;overflow-wrap:anywhere;
}
[data-vibeui-block="codeblock-004"] [data-part="caret"]{
display:inline-block;width:0.5rem;height:1em;
margin-inline-start:0.25rem;vertical-align:-0.15em;
background:var(--vibeui-codeblock-004-prompt);
animation:vibeui-codeblock-004-blink 1.1s steps(1,end) infinite;
}
@keyframes vibeui-codeblock-004-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-004"] *{animation:none!important;transition:none!important}}
`

/** Строка терминала с приглашением и мигающей кареткой. */
export function Codeblock004({
  command = "npx shadcn@latest add codeblock-004",
  prompt = "$",
  cwd = "~/projects/vibeui",
  branch = "main",
  className,
  style,
  ...props
}: Codeblock004Props) {
  return (
    <>
      <style href="vibeui-codeblock-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="codeblock-004"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="where">
          <span>{cwd}</span>
          {branch ? <span data-part="branch">{branch}</span> : null}
        </div>
        <p data-part="line" data-prompt={prompt}>
          <code>{command}</code>
          <span data-part="caret" aria-hidden="true" />
        </p>
      </div>
    </>
  )
}
