import type { CSSProperties } from "react"

export type Codeblock003Props = {
  packageName?: string
  group?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: четыре менеджера пакетов в одном блоке без единой строки
// JS. Вкладки — это радиокнопки, а панель выбирается через :has() по
// отмеченному значению, поэтому переключение работает и до гидратации.
const STYLES = `
:where([data-vibeui-block="codeblock-003"]){
--vibeui-codeblock-003-bg:oklch(0.2 0.02 210);
--vibeui-codeblock-003-head:oklch(0.24 0.024 210);
--vibeui-codeblock-003-fg:oklch(0.94 0.006 210);
--vibeui-codeblock-003-muted:oklch(0.68 0.016 210);
--vibeui-codeblock-003-border:oklch(1 0 0 / 13%);
--vibeui-codeblock-003-active:oklch(0.98 0.01 210);
--vibeui-codeblock-003-accent:oklch(0.78 0.13 195);
--vibeui-codeblock-003-flag:oklch(0.8 0.12 195);
--vibeui-codeblock-003-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="codeblock-003"]{
display:block;width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-codeblock-003-font);
}
[data-vibeui-block="codeblock-003"] [data-part="shell"]{
overflow:hidden;border:1px solid var(--vibeui-codeblock-003-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-003-bg);color:var(--vibeui-codeblock-003-fg);
}
[data-vibeui-block="codeblock-003"] [data-part="tabs"]{
display:flex;gap:0.125rem;padding:0.3125rem 0.375rem;
background:var(--vibeui-codeblock-003-head);
border-bottom:1px solid var(--vibeui-codeblock-003-border);
}
[data-vibeui-block="codeblock-003"] label{
flex:1 1 0;cursor:pointer;text-align:center;
padding:0.375rem 0.5rem;border-radius:0.4375rem;
font-size:0.75rem;font-weight:650;color:var(--vibeui-codeblock-003-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-003"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
border:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="codeblock-003"] label:hover{color:var(--vibeui-codeblock-003-fg)}
[data-vibeui-block="codeblock-003"] label:has(input:checked){
background:oklch(1 0 0 / 12%);color:var(--vibeui-codeblock-003-active);
}
[data-vibeui-block="codeblock-003"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-codeblock-003-accent);outline-offset:2px;
}
[data-vibeui-block="codeblock-003"] pre{
display:none;margin:0;padding:0.875rem;overflow-x:auto;
font-family:var(--vibeui-codeblock-003-mono);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="codeblock-003"] code{font:inherit;white-space:pre}
[data-vibeui-block="codeblock-003"] [data-token="flag"]{color:var(--vibeui-codeblock-003-flag)}
[data-vibeui-block="codeblock-003"] [data-token="entity"]{color:var(--vibeui-codeblock-003-accent)}
/* Панель выбирается отмеченной радиокнопкой — без состояния в JS. */
[data-vibeui-block="codeblock-003"] [data-part="shell"]:has(input[value="npm"]:checked) pre[data-manager="npm"],
[data-vibeui-block="codeblock-003"] [data-part="shell"]:has(input[value="pnpm"]:checked) pre[data-manager="pnpm"],
[data-vibeui-block="codeblock-003"] [data-part="shell"]:has(input[value="yarn"]:checked) pre[data-manager="yarn"],
[data-vibeui-block="codeblock-003"] [data-part="shell"]:has(input[value="bun"]:checked) pre[data-manager="bun"]{display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-003"] *{animation:none!important;transition:none!important}}
`

const MANAGERS = [
  { id: "npm", binary: "npm", verb: "install", flag: "--save-exact" },
  { id: "pnpm", binary: "pnpm", verb: "add", flag: "--save-exact" },
  { id: "yarn", binary: "yarn", verb: "add", flag: "--exact" },
  { id: "bun", binary: "bun", verb: "add", flag: "--exact" },
] as const

/** Команда установки в четырёх менеджерах пакетов, переключение без JS. */
export function Codeblock003({
  packageName = "@vibeui/button",
  group = "vibeui-codeblock-003",
  className,
  style,
}: Codeblock003Props) {
  return (
    <>
      <style href="vibeui-codeblock-003" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="codeblock-003"
        className={className}
        style={style}
      >
        <div data-part="shell">
          <div data-part="tabs" role="group" aria-label="Менеджер пакетов">
            {MANAGERS.map((manager, index) => (
              <label key={manager.id}>
                <input
                  type="radio"
                  name={group}
                  value={manager.id}
                  defaultChecked={index === 0}
                />
                {manager.binary}
              </label>
            ))}
          </div>
          {MANAGERS.map((manager) => (
            <pre key={manager.id} data-manager={manager.id}>
              <code>
                <span data-token="entity">{manager.binary}</span>
                {` ${manager.verb} ${packageName} `}
                <span data-token="flag">{manager.flag}</span>
              </code>
            </pre>
          ))}
        </div>
      </div>
    </>
  )
}
