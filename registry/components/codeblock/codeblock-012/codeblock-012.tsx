import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Codeblock012Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  command?: string
  output?: string[]
  exitCode?: number
  duration?: string
}

// Идея компонента: команда и её вывод — это две разные вещи, и они разведены
// подложкой. Команду можно выделить и вставить в терминал, не зацепив ответ;
// код возврата вынесен в подвал и красится по успеху, а не по угадыванию.
const STYLES = `
:where([data-vibeui-block="codeblock-012"]){
--vibeui-codeblock-012-bg:oklch(0.18 0.012 265);
--vibeui-codeblock-012-out-bg:oklch(0.23 0.014 265);
--vibeui-codeblock-012-fg:oklch(0.94 0.006 265);
--vibeui-codeblock-012-muted:oklch(0.7 0.014 265);
--vibeui-codeblock-012-border:oklch(1 0 0 / 12%);
--vibeui-codeblock-012-prompt:oklch(0.78 0.13 200);
--vibeui-codeblock-012-ok:oklch(0.84 0.15 152);
--vibeui-codeblock-012-ok-bg:oklch(0.5 0.13 152 / 24%);
--vibeui-codeblock-012-bad:oklch(0.76 0.18 25);
--vibeui-codeblock-012-bad-bg:oklch(0.5 0.16 25 / 24%);
--vibeui-codeblock-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-012"]{
display:flex;flex-direction:column;
width:100%;max-width:32rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-codeblock-012-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-012-bg);color:var(--vibeui-codeblock-012-fg);
font-family:var(--vibeui-codeblock-012-font);
}
[data-vibeui-block="codeblock-012"] pre{margin:0;overflow-x:auto}
[data-vibeui-block="codeblock-012"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-012-mono);
font-size:0.8125rem;line-height:1.6;white-space:pre;
}
[data-vibeui-block="codeblock-012"] [data-part="command"]{padding:0.75rem 0.875rem}
[data-vibeui-block="codeblock-012"] [data-part="command"] code{padding-inline-start:1.125rem;position:relative}
[data-vibeui-block="codeblock-012"] [data-part="command"] code::before{
content:"$";position:absolute;left:0;
color:var(--vibeui-codeblock-012-prompt);font-weight:700;
user-select:none;-webkit-user-select:none;
}
/* Другая подложка — граница между тем, что вводят, и тем, что отвечают. */
[data-vibeui-block="codeblock-012"] [data-part="output"]{
padding:0.6875rem 0.875rem;
background:var(--vibeui-codeblock-012-out-bg);
border-top:1px solid var(--vibeui-codeblock-012-border);
color:var(--vibeui-codeblock-012-muted);
}
[data-vibeui-block="codeblock-012"] [data-part="foot"]{
display:flex;align-items:center;gap:0.5rem;
margin:0;padding:0.5rem 0.875rem;
background:var(--vibeui-codeblock-012-out-bg);
border-top:1px solid var(--vibeui-codeblock-012-border);
font-size:0.6875rem;color:var(--vibeui-codeblock-012-muted);
}
[data-vibeui-block="codeblock-012"] [data-part="code"]{
padding:0.125rem 0.4375rem;border-radius:999px;font-weight:700;
background:var(--vibeui-codeblock-012-bad-bg);color:var(--vibeui-codeblock-012-bad);
}
[data-vibeui-block="codeblock-012"] [data-part="code"][data-ok="true"]{
background:var(--vibeui-codeblock-012-ok-bg);color:var(--vibeui-codeblock-012-ok);
}
`

const OUTPUT = [
  "✔ registry собран: 14 items",
  "✔ public/r обновлён",
  "Готово за 1.9 s",
]

/** Команда и её вывод: разные подложки, код возврата в подвале. */
export function Codeblock012({
  command = "npm run registry:build",
  output = OUTPUT,
  exitCode = 0,
  duration = "1.9 s",
  className,
  style,
  ...props
}: Codeblock012Props) {
  const ok = exitCode === 0

  return (
    <>
      <style href="vibeui-codeblock-012" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="codeblock-012"
        className={className}
        style={style as CSSProperties}
        aria-label="Команда и её вывод"
      >
        <pre data-part="command">
          <code>{command}</code>
        </pre>
        <pre data-part="output">
          <code>{output.join("\n")}</code>
        </pre>
        <p data-part="foot">
          <span data-part="code" data-ok={ok || undefined}>
            exit {exitCode}
          </span>
          <span>{ok ? "успешно" : "с ошибкой"}</span>
          <span>· {duration}</span>
        </p>
      </section>
    </>
  )
}
