import type { CSSProperties } from "react"

export type Codeblock026Props = {
  path?: string
  reason?: string
  editInstead?: string
  code?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: листинг, который нельзя править руками. Замок в шапке,
// косая штриховка поверх кода и подпись «правьте вот это вместо файла» —
// три сигнала подряд, потому что один читатель всегда пропускает.
const STYLES = `
:where([data-vibeui-block="codeblock-026"]){
--vibeui-codeblock-026-bg:oklch(0.985 0.003 265);
--vibeui-codeblock-026-code:oklch(0.96 0.005 265);
--vibeui-codeblock-026-fg:oklch(0.3 0.014 265);
--vibeui-codeblock-026-muted:oklch(0.53 0.012 265);
--vibeui-codeblock-026-border:oklch(0.89 0.008 265);
--vibeui-codeblock-026-lock:oklch(0.48 0.09 265);
--vibeui-codeblock-026-lock-bg:oklch(0.93 0.03 265);
--vibeui-codeblock-026-hatch:oklch(0.5 0.02 265 / 7%);
--vibeui-codeblock-026-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-026"]{
display:flex;flex-direction:column;
width:100%;max-width:32rem;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-026-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-026-bg);color:var(--vibeui-codeblock-026-fg);
font-family:var(--vibeui-codeblock-026-font);
}
[data-vibeui-block="codeblock-026"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;
padding:0.5rem 0.75rem;
border-bottom:1px solid var(--vibeui-codeblock-026-border);
font-family:var(--vibeui-codeblock-026-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-026-muted);
}
[data-vibeui-block="codeblock-026"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.3125rem;flex:none;
padding:0.1875rem 0.5rem;border-radius:999px;
background:var(--vibeui-codeblock-026-lock-bg);
color:var(--vibeui-codeblock-026-lock);
font-family:var(--vibeui-codeblock-026-font);
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="codeblock-026"] svg{width:0.75rem;height:0.75rem;flex:none}
[data-vibeui-block="codeblock-026"] [data-part="path"]{margin-inline-start:auto}
/* Штриховка лежит отдельным слоем поверх кода: приглушать сам текст нельзя —
   он должен читаться, просто редактировать его бессмысленно. */
[data-vibeui-block="codeblock-026"] [data-part="body"]{
position:relative;background:var(--vibeui-codeblock-026-code);
}
[data-vibeui-block="codeblock-026"] [data-part="body"]::after{
content:"";position:absolute;inset:0;pointer-events:none;
background:repeating-linear-gradient(
135deg,
transparent 0 0.5rem,
var(--vibeui-codeblock-026-hatch) 0.5rem 0.625rem
);
}
[data-vibeui-block="codeblock-026"] pre{margin:0;padding:0.75rem 0.875rem;overflow-x:auto}
[data-vibeui-block="codeblock-026"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-026-mono);
font-size:0.8125rem;line-height:1.65;white-space:pre;
}
[data-vibeui-block="codeblock-026"] [data-part="note"]{
margin:0;padding:0.625rem 0.75rem;
border-top:1px solid var(--vibeui-codeblock-026-border);
font-size:0.75rem;line-height:1.5;color:var(--vibeui-codeblock-026-muted);
}
[data-vibeui-block="codeblock-026"] [data-part="note"] b{
display:block;margin-bottom:0.125rem;
color:var(--vibeui-codeblock-026-fg);font-weight:650;
}
[data-vibeui-block="codeblock-026"] [data-part="note"] code{
display:inline;min-width:0;
padding:0.0625rem 0.3125rem;border-radius:0.3125rem;
background:var(--vibeui-codeblock-026-code);
border:1px solid var(--vibeui-codeblock-026-border);
font-size:0.75rem;
}
`

const CODE = `// сгенерировано, не править
export const ITEMS = [
  "codeblock-001",
  "codeblock-002",
  "codeblock-003",
]`

/** Листинг сгенерированного файла с пометкой «только для чтения». */
export function Codeblock026({
  path = "registry/index.ts",
  reason = "Файл собирает команда npm run indexes",
  editInstead = "registry/components/*/registry.json",
  code = CODE,
  className,
  style,
}: Codeblock026Props) {
  return (
    <>
      <style href="vibeui-codeblock-026" precedence="medium">
        {STYLES}
      </style>
      <figure
        data-vibeui-block="codeblock-026"
        className={className}
        style={style}
      >
        <figcaption data-part="head">
          <span data-part="badge">
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <rect
                x="2.5"
                y="5"
                width="7"
                height="5.5"
                rx="1.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M4.25 5V3.75a1.75 1.75 0 0 1 3.5 0V5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            только для чтения
          </span>
          <span data-part="path">{path}</span>
        </figcaption>
        <div data-part="body">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
        <p data-part="note" role="note">
          <b>{reason}</b>
          Правки внесите в <code>{editInstead}</code> и пересоберите: ручные
          изменения здесь пропадут при следующей сборке.
        </p>
      </figure>
    </>
  )
}
