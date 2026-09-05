import type { ComponentProps, CSSProperties } from "react"

export type AiAnim005Tool = {
  label: string
}

export type AiAnim005Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  badge?: string
  /** Ровно четыре вызова — под них рассчитан общий цикл анимации. */
  tools?: AiAnim005Tool[]
  accent?: string
  paused?: boolean
  /** false — цикл проигрывается один раз и останавливается на готовом виде. */
  repeat?: boolean
}

const DEFAULT_TOOLS: AiAnim005Tool[] = [
  { label: "Поиск в базе знаний" },
  { label: "Чтение файла" },
  { label: "Выполнение кода" },
  { label: "Запись результата" },
]

const TOOL_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
  </svg>
)

const CHECK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

// Идея: список вызовов инструментов агента, где каждая строка по очереди
// переключается из ожидания (вращающийся спиннер) в готовый результат
// (галочка) — все строки делят общий цикл анимации с собственной фазой
// активности (стагер через animation-delay), как кубы в ai-anim-001: пока
// не пришла очередь строки, она приглушена, в момент очереди крутится
// спиннер, а затем строка держит галочку до конца цикла.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="ai-anim-005"]){
--vibeui-ai-anim-005-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-ai-anim-005-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-ai-anim-005-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-ai-anim-005-muted:color-mix(in oklab,var(--vibeui-ai-anim-005-fg) 58%,transparent);
--vibeui-ai-anim-005-border:light-dark(oklch(0.92 0 0),oklch(0.28 0 0));
--vibeui-ai-anim-005-accent:light-dark(oklch(0.56 0.16 235),oklch(0.74 0.14 235));
--vibeui-ai-anim-005-accent-fg:oklch(from var(--vibeui-ai-anim-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-ai-anim-005-done:light-dark(oklch(0.62 0.17 150),oklch(0.75 0.15 150));
--vibeui-ai-anim-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-anim-005"]{color-scheme:dark}
[data-vibeui-block="ai-anim-005"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-ai-anim-005-fg);font-family:var(--vibeui-ai-anim-005-font);
}
[data-vibeui-block="ai-anim-005"] *{box-sizing:border-box}
[data-vibeui-block="ai-anim-005"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-ai-anim-005-border);
background:var(--vibeui-ai-anim-005-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="ai-anim-005"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-ai-anim-005-border);
}
[data-vibeui-block="ai-anim-005"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="ai-anim-005"] [data-part="badge"]{
display:inline-flex;align-items:center;height:1.125rem;padding:0 0.4375rem;
border-radius:9999px;font-size:0.5625rem;font-weight:650;
color:var(--vibeui-ai-anim-005-accent);
background:color-mix(in oklab,var(--vibeui-ai-anim-005-accent) 14%,transparent);
}
[data-vibeui-block="ai-anim-005"] [data-part="list"]{
display:flex;flex-direction:column;margin:0;padding:0.5rem;list-style:none;
}
[data-vibeui-block="ai-anim-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;padding:0.5rem 0.5rem;border-radius:0.625rem;
animation:vibeui-ai-anim-005-row 6.4s ease-in-out infinite;
}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="0"]{animation-delay:0s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="1"]{animation-delay:1.6s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="2"]{animation-delay:3.2s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="3"]{animation-delay:4.8s}
[data-vibeui-block="ai-anim-005"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.625rem;height:1.625rem;border-radius:0.5rem;
background:var(--vibeui-ai-anim-005-frame);color:var(--vibeui-ai-anim-005-muted);
}
[data-vibeui-block="ai-anim-005"] [data-part="icon"] svg{width:0.8125rem;height:0.8125rem}
[data-vibeui-block="ai-anim-005"] [data-part="label"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;font-weight:550;
}
[data-vibeui-block="ai-anim-005"] [data-part="result"]{position:relative;flex:none;width:1rem;height:1rem}
[data-vibeui-block="ai-anim-005"] [data-part="spinner"]{
position:absolute;inset:0;border-radius:9999px;
border:2px solid color-mix(in oklab,var(--vibeui-ai-anim-005-accent) 25%,transparent);
border-top-color:var(--vibeui-ai-anim-005-accent);
animation:vibeui-ai-anim-005-spin 0.8s linear infinite,vibeui-ai-anim-005-spinner 6.4s steps(1,end) infinite;
}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="0"] [data-part="spinner"]{animation-delay:0s,0s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="1"] [data-part="spinner"]{animation-delay:0s,1.6s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="2"] [data-part="spinner"]{animation-delay:0s,3.2s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="3"] [data-part="spinner"]{animation-delay:0s,4.8s}
[data-vibeui-block="ai-anim-005"] [data-part="checkmark"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
border-radius:9999px;background:color-mix(in oklab,var(--vibeui-ai-anim-005-done) 18%,transparent);
color:var(--vibeui-ai-anim-005-done);opacity:0;
animation:vibeui-ai-anim-005-check 6.4s steps(1,end) infinite;
}
[data-vibeui-block="ai-anim-005"] [data-part="checkmark"] svg{width:0.625rem;height:0.625rem}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="0"] [data-part="checkmark"]{animation-delay:0s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="1"] [data-part="checkmark"]{animation-delay:1.6s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="2"] [data-part="checkmark"]{animation-delay:3.2s}
[data-vibeui-block="ai-anim-005"] [data-part="row"][data-index="3"] [data-part="checkmark"]{animation-delay:4.8s}
[data-vibeui-block="ai-anim-005"][data-repeat="false"] [data-part="row"],
[data-vibeui-block="ai-anim-005"][data-repeat="false"] [data-part="spinner"],
[data-vibeui-block="ai-anim-005"][data-repeat="false"] [data-part="checkmark"]{animation-iteration-count:1}
[data-vibeui-block="ai-anim-005"][data-repeat="false"] [data-part="spinner"]{animation-iteration-count:infinite,1}
[data-vibeui-block="ai-anim-005"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-ai-anim-005-row{
0%,24%{background:transparent}
2%,22%{background:color-mix(in oklab,var(--vibeui-ai-anim-005-accent) 6%,transparent)}
25%,100%{background:transparent}
}
@keyframes vibeui-ai-anim-005-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-ai-anim-005-spinner{
0%,1%{opacity:0}
2%,22%{opacity:1}
25%,100%{opacity:0}
}
@keyframes vibeui-ai-anim-005-check{
0%,24%{opacity:0;transform:scale(0.6)}
26%{opacity:1;transform:scale(1)}
100%{opacity:1;transform:scale(1)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="ai-anim-005"] [data-part="row"]{animation:none}
[data-vibeui-block="ai-anim-005"] [data-part="spinner"]{animation:none;opacity:0}
[data-vibeui-block="ai-anim-005"] [data-part="checkmark"]{animation:none;opacity:1;transform:none}
}
`

/**
 * Список вызовов инструментов агента: каждая строка по очереди переходит
 * из ожидания (спиннер) в готовый результат (галочка) в такт общему циклу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function AiAnim005({
  title = "Действия агента",
  badge = "4 шага",
  tools = DEFAULT_TOOLS,
  accent,
  paused = false,
  repeat = true,
  className,
  style,
  ...props
}: AiAnim005Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-anim-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  const items = tools.slice(0, 4)

  return (
    <>
      <style href="vibeui-ai-anim-005" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="ai-anim-005"
        data-slot="ai-tools"
        data-paused={paused ? "true" : undefined}
        data-repeat={repeat ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            {badge ? <span data-part="badge">{badge}</span> : null}
          </div>
          <ol data-part="list">
            {items.map((tool, index) => (
              <li data-part="row" data-index={index} key={tool.label}>
                <span data-part="icon" aria-hidden="true">
                  {TOOL_ICON}
                </span>
                <span data-part="label">{tool.label}</span>
                <span data-part="result" aria-hidden="true">
                  <span data-part="spinner" />
                  <span data-part="checkmark">{CHECK}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
