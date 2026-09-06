import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame007Line = {
  text: string
  /** command — строка с приглашением, output — строка вывода без него. */
  type?: "command" | "output"
}

export type Frame007Props = Omit<ComponentProps<"figure">, "title"> & {
  title?: string
  prompt?: string
  lines?: Frame007Line[]
  /** Подпись вывода для скринридера: компонент несёт русскую. */
  outputLabel?: string
  accent?: string
  children?: ReactNode
}

// Идея компонента: кадр терминала для демонстрации CLI-команд и их вывода.
// Приглашение печатается только у команд — вывод идёт без него, иначе
// журнал сессии превращается в стену одинаковых значков. Курсор моргает
// CSS-анимацией, а не текстом: так его можно спрятать по prefers-reduced-motion,
// не трогая разметку.
const STYLES = `
:where([data-vibeui-block="frame-007"]){
--vibeui-frame-007-bg:oklch(0.2 0 260);
--vibeui-frame-007-bar:oklch(0.26 0 260);
--vibeui-frame-007-fg:oklch(0.92 0 260);
--vibeui-frame-007-muted:color-mix(in oklab,var(--vibeui-frame-007-fg) 68%,transparent);
--vibeui-frame-007-accent:oklch(0.78 0.16 150);
--vibeui-frame-007-border:oklch(0.32 0 260);
--vibeui-frame-007-radius:0.875rem;
--vibeui-frame-007-font:ui-monospace,"Cascadia Code","Consolas","SFMono-Regular",Menlo,monospace;
container-type:inline-size;
}
[data-vibeui-block="frame-007"]{
display:block;margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-frame-007-font);color:var(--vibeui-frame-007-fg);
}
[data-vibeui-block="frame-007"] *{box-sizing:border-box}
[data-vibeui-block="frame-007"] [data-part="shell"]{
overflow:hidden;background:var(--vibeui-frame-007-bg);
border:1px solid var(--vibeui-frame-007-border);
border-radius:var(--vibeui-frame-007-radius);
}
[data-vibeui-block="frame-007"] [data-part="bar"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.75rem;
background:var(--vibeui-frame-007-bar);
border-bottom:1px solid var(--vibeui-frame-007-border);
}
[data-vibeui-block="frame-007"] [data-part="dots"]{display:flex;gap:0.375rem;flex:none}
[data-vibeui-block="frame-007"] [data-part="dot"]{
width:0.625rem;height:0.625rem;border-radius:9999px;
background:var(--vibeui-frame-007-border);
}
[data-vibeui-block="frame-007"] [data-part="dot"][data-tone="red"]{background:oklch(0.63 0.19 25)}
[data-vibeui-block="frame-007"] [data-part="dot"][data-tone="yellow"]{background:oklch(0.82 0.15 95)}
[data-vibeui-block="frame-007"] [data-part="dot"][data-tone="green"]{background:oklch(0.72 0.17 150)}
[data-vibeui-block="frame-007"] [data-part="title"]{
flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
text-align:center;font-size:0.75rem;color:var(--vibeui-frame-007-muted);
}
[data-vibeui-block="frame-007"] [data-part="body"]{padding:0.875rem 1rem 1.125rem;font-size:0.8125rem;line-height:1.7}
[data-vibeui-block="frame-007"] [data-part="output"]{margin:0;white-space:pre-wrap;word-break:break-word}
[data-vibeui-block="frame-007"] [data-part="line"]{display:flex;gap:0.5rem}
[data-vibeui-block="frame-007"] [data-part="line"][data-type="output"]{color:var(--vibeui-frame-007-muted)}
[data-vibeui-block="frame-007"] [data-part="prompt"]{flex:none;color:var(--vibeui-frame-007-accent);font-weight:600}
/* Курсор моргает анимацией, а не текстом — так его можно погасить по prefers-reduced-motion. */
[data-vibeui-block="frame-007"] [data-part="cursor"]{
display:inline-block;width:0.5rem;height:1rem;margin-left:0.125rem;
vertical-align:-0.15rem;background:var(--vibeui-frame-007-fg);
animation:vibeui-frame-007-blink 1.1s steps(1) infinite;
}
@keyframes vibeui-frame-007-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@container (max-width: 22rem){
[data-vibeui-block="frame-007"] [data-part="body"]{padding:0.75rem 0.75rem 1rem;font-size:0.75rem}
[data-vibeui-block="frame-007"] [data-part="title"]{font-size:0.6875rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="frame-007"] *{transition:none!important}
[data-vibeui-block="frame-007"] [data-part="cursor"]{animation:none!important;opacity:1}
}
`

const DEFAULT_LINES: Frame007Line[] = [
  { text: "npx shadcn@latest add frame-007", type: "command" },
  {
    text: "Компонент установлен в components/vibeui/frame-007.tsx",
    type: "output",
  },
  { text: "Готово: зависимостей нет, палитра своя.", type: "output" },
]

/**
 * Кадр терминала: строка заголовка с точками и моноширинный вывод команд.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame007({
  title = "zsh — vibeui",
  prompt = "❯",
  lines = DEFAULT_LINES,
  outputLabel = "Вывод терминала",
  accent,
  children,
  className,
  style,
  ...props
}: Frame007Props) {
  const palette = {
    ...(accent ? { "--vibeui-frame-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-007" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="bar">
            <span data-part="dots" aria-hidden="true">
              <span data-part="dot" data-tone="red" />
              <span data-part="dot" data-tone="yellow" />
              <span data-part="dot" data-tone="green" />
            </span>
            <span data-part="title">{title}</span>
          </div>
          <div data-part="body">
            {children ?? (
              <pre data-part="output" aria-label={outputLabel}>
                {lines.map((line, index) => (
                  <div
                    data-part="line"
                    data-type={line.type ?? "command"}
                    key={index}
                  >
                    {(line.type ?? "command") === "command" ? (
                      <span data-part="prompt" aria-hidden="true">
                        {prompt}
                      </span>
                    ) : null}
                    <span>{line.text}</span>
                  </div>
                ))}
                <span data-part="cursor" aria-hidden="true" />
              </pre>
            )}
          </div>
        </div>
      </figure>
    </>
  )
}
