import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Stepper009Step = {
  title: string
  description?: string
  /** Команда или сниппет: раскрывается только у текущего шага. */
  code?: string
}

export type Stepper009Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: Stepper009Step[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  /** Подпись над блоком кода внутри активного шага. */
  codeCaption?: string
  label?: string
  accent?: string
}

// Идея компонента: инструкция по установке, где код показан только у того
// шага, который выполняется сейчас. Остальные шаги свёрнуты до заголовка,
// поэтому длинная команда не отвлекает от места, на котором человек стоит.
// Блок кода получает tabindex, иначе длинную строку нельзя пролистать
// с клавиатуры: горизонтальная прокрутка без фокуса недоступна.
const STYLES = `
:where([data-vibeui-block="stepper-009"]){
--vibeui-stepper-009-bg:oklch(1 0 0);
--vibeui-stepper-009-fg:oklch(0.24 0.016 265);
--vibeui-stepper-009-muted:oklch(0.56 0.014 265);
--vibeui-stepper-009-border:oklch(0.92 0.006 265);
--vibeui-stepper-009-line:oklch(0.9 0.006 265);
--vibeui-stepper-009-accent:oklch(0.55 0.2 262);
--vibeui-stepper-009-accent-fg:oklch(1 0 0);
--vibeui-stepper-009-code-bg:oklch(0.22 0.02 265);
--vibeui-stepper-009-code-fg:oklch(0.93 0.01 265);
--vibeui-stepper-009-dot:1.625rem;
--vibeui-stepper-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-stepper-009-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="stepper-009"]{
width:100%;max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-009-font);color:var(--vibeui-stepper-009-fg);
}
[data-vibeui-block="stepper-009"] [data-part="shell"]{
background:var(--vibeui-stepper-009-bg);
border:1px solid var(--vibeui-stepper-009-border);
border-radius:1rem;padding:1rem 1.125rem 1.125rem;
}
[data-vibeui-block="stepper-009"] ol{margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-009"] li{
position:relative;padding:0 0 1rem calc(var(--vibeui-stepper-009-dot) + 0.75rem);
}
[data-vibeui-block="stepper-009"] li:last-child{padding-bottom:0}
[data-vibeui-block="stepper-009"] li:not(:last-child)::before{
content:"";position:absolute;left:calc(var(--vibeui-stepper-009-dot) / 2 - 1px);
top:var(--vibeui-stepper-009-dot);bottom:0.25rem;width:2px;
background:var(--vibeui-stepper-009-line);
}
[data-vibeui-block="stepper-009"] li[data-state="done"]::before{background:var(--vibeui-stepper-009-accent)}
[data-vibeui-block="stepper-009"] [data-part="mark"]{
position:absolute;left:0;top:0;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-009-dot);height:var(--vibeui-stepper-009-dot);
border-radius:9999px;border:2px solid var(--vibeui-stepper-009-line);
background:var(--vibeui-stepper-009-bg);color:var(--vibeui-stepper-009-muted);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-009"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-009-accent);border-color:var(--vibeui-stepper-009-accent);
color:var(--vibeui-stepper-009-accent-fg);
}
[data-vibeui-block="stepper-009"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-009-accent);color:var(--vibeui-stepper-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-009-accent) 18%,transparent);
}
[data-vibeui-block="stepper-009"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.375rem 0.5rem;
min-height:var(--vibeui-stepper-009-dot);
}
[data-vibeui-block="stepper-009"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="stepper-009"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-009-muted);
}
[data-vibeui-block="stepper-009"] [data-part="state"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-stepper-009-muted);
}
[data-vibeui-block="stepper-009"] li[data-state="done"] [data-part="state"]{color:var(--vibeui-stepper-009-accent)}
[data-vibeui-block="stepper-009"] [data-part="description"]{
margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-stepper-009-muted);
}
[data-vibeui-block="stepper-009"] [data-part="code-caption"]{
margin:0.625rem 0 0.25rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-stepper-009-muted);
}
[data-vibeui-block="stepper-009"] pre{
margin:0;padding:0.625rem 0.75rem;border-radius:0.625rem;overflow-x:auto;
background:var(--vibeui-stepper-009-code-bg);color:var(--vibeui-stepper-009-code-fg);
font-family:var(--vibeui-stepper-009-mono);font-size:0.75rem;line-height:1.6;
}
[data-vibeui-block="stepper-009"] pre:focus-visible{
outline:2px solid var(--vibeui-stepper-009-accent);outline-offset:2px;
}
[data-vibeui-block="stepper-009"] code{font:inherit}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Stepper009Step[] = [
  {
    title: "Поставить пакет",
    description: "Ставится в проект целиком, отдельная сборка не нужна.",
    code: "npm i @vibeui/blocks",
  },
  {
    title: "Добавить компонент",
    description: "Команда положит файл в components/vibeui и допишет импорт.",
    code: "npx shadcn@latest add https://vibeui.dev/r/stepper-009.json",
  },
  {
    title: "Проверить сборку",
    description: "Компонент серверный: клиентского JS в бандле не появится.",
    code: "npm run build",
  },
]

const STATES = {
  done: "Готово",
  current: "Сейчас",
  todo: "Впереди",
} as const

/**
 * Шаги установки: команда показана внутри того шага, который идёт сейчас.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper009({
  steps = DEFAULT_STEPS,
  current = 1,
  codeCaption = "Выполните в терминале",
  label = "Установка компонента",
  accent,
  className,
  style,
  ...props
}: Stepper009Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-009" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="stepper-009"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <ol>
            {steps.map((step, index) => {
              const state =
                index < current
                  ? "done"
                  : index === current
                    ? "current"
                    : "todo"

              return (
                <li
                  key={step.title}
                  data-state={state}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="mark" aria-hidden="true">
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <span data-part="head">
                    <span data-part="title">{step.title}</span>
                    <span data-part="state">{STATES[state]}</span>
                  </span>
                  {state === "current" ? (
                    <>
                      {step.description ? (
                        <p data-part="description">{step.description}</p>
                      ) : null}
                      {step.code ? (
                        <>
                          <p data-part="code-caption">{codeCaption}</p>
                          <pre tabIndex={0}>
                            <code>{step.code}</code>
                          </pre>
                        </>
                      ) : null}
                    </>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
