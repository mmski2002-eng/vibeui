import type { CSSProperties } from "react"

export type Codeblock010Props = {
  heading?: string
  command?: string
  file?: string
  shortcut?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: код внутри абзаца, а не блоком. Главная задача — чтобы
// подложка чипа не рвалась при переносе строки: за это отвечает
// box-decoration-break:clone, иначе у перенесённого куска пропадает скругление.
const STYLES = `
:where([data-vibeui-block="codeblock-010"]){
--vibeui-codeblock-010-bg:oklch(0.99 0.003 265);
--vibeui-codeblock-010-fg:oklch(0.27 0.016 265);
--vibeui-codeblock-010-muted:oklch(0.5 0.014 265);
--vibeui-codeblock-010-border:oklch(0.9 0.006 265);
--vibeui-codeblock-010-chip-bg:oklch(0.94 0.012 265);
--vibeui-codeblock-010-chip-fg:oklch(0.32 0.09 300);
--vibeui-codeblock-010-path-fg:oklch(0.36 0.09 240);
--vibeui-codeblock-010-key-bg:oklch(1 0 0);
--vibeui-codeblock-010-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-010"]{
display:block;width:100%;max-width:30rem;box-sizing:border-box;
padding:1.125rem 1.25rem 1.25rem;
border:1px solid var(--vibeui-codeblock-010-border);border-radius:0.875rem;
background:var(--vibeui-codeblock-010-bg);color:var(--vibeui-codeblock-010-fg);
font-family:var(--vibeui-codeblock-010-font);font-size:0.875rem;line-height:1.65;
}
[data-vibeui-block="codeblock-010"] h3{
margin:0 0 0.5rem;font-size:1rem;line-height:1.3;letter-spacing:-0.01em;
}
[data-vibeui-block="codeblock-010"] p{margin:0 0 0.625rem}
[data-vibeui-block="codeblock-010"] p:last-child{margin-bottom:0;color:var(--vibeui-codeblock-010-muted)}
/* clone сохраняет фон и скругление у обеих половин перенесённого чипа. */
[data-vibeui-block="codeblock-010"] code{
font-family:var(--vibeui-codeblock-010-mono);
font-size:0.8125em;line-height:inherit;
padding:0.125em 0.375em;border-radius:0.3125em;
background:var(--vibeui-codeblock-010-chip-bg);color:var(--vibeui-codeblock-010-chip-fg);
overflow-wrap:break-word;
-webkit-box-decoration-break:clone;box-decoration-break:clone;
}
[data-vibeui-block="codeblock-010"] code[data-kind="path"]{color:var(--vibeui-codeblock-010-path-fg)}
[data-vibeui-block="codeblock-010"] kbd{
font-family:var(--vibeui-codeblock-010-font);font-size:0.75em;font-weight:650;
padding:0.1875em 0.4375em;border-radius:0.3125em;
border:1px solid var(--vibeui-codeblock-010-border);
border-bottom-width:2px;
background:var(--vibeui-codeblock-010-key-bg);color:var(--vibeui-codeblock-010-fg);
white-space:nowrap;
}
`

/** Инлайновый код в абзаце: чипы команды, пути и клавиши. */
export function Codeblock010({
  heading = "Как поставить компонент",
  command = "npx shadcn@latest add codeblock-010",
  file = "components/vibeui/codeblock-010.tsx",
  shortcut = "Ctrl + `",
  className,
  style,
}: Codeblock010Props) {
  return (
    <>
      <style href="vibeui-codeblock-010" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="codeblock-010"
        className={className}
        style={style}
      >
        <h3>{heading}</h3>
        <p>
          Выполните <code>{command}</code> — файл ляжет в{" "}
          <code data-kind="path">{file}</code> и сразу заработает.
        </p>
        <p>
          Терминал открывается по <kbd>{shortcut}</kbd>; если команда не
          найдена, проверьте <code data-kind="path">package.json</code>.
        </p>
      </div>
    </>
  )
}
