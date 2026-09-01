import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Stepper011State = "done" | "error" | "current" | "todo"

export type Stepper011Step = {
  title: string
  state: Stepper011State
  /** Что пошло не так — печатается только у ошибочного шага. */
  issue?: string
  /** Конкретное действие для исправления, а не общее «попробуйте снова». */
  fix?: string
  href?: string
  actionLabel?: string
}

export type Stepper011Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> & {
  steps?: Stepper011Step[]
  label?: string
  accent?: string
}

// Идея компонента: ошибка на шаге — не тупик, а точка с понятным следующим
// действием. Под лентой шагов отдельной карточкой выводится то, что пошло не
// так, и то, что конкретно исправить, — а не только значок "!" на кружке.
const STYLES = `
:where([data-vibeui-block="stepper-011"]){
--vibeui-stepper-011-bg:oklch(1 0 0);
--vibeui-stepper-011-fg:oklch(0.24 0.016 265);
--vibeui-stepper-011-muted:oklch(0.56 0.014 265);
--vibeui-stepper-011-border:oklch(0.92 0.006 265);
--vibeui-stepper-011-line:oklch(0.9 0.006 265);
--vibeui-stepper-011-accent:oklch(0.55 0.2 262);
--vibeui-stepper-011-done:oklch(0.55 0.14 155);
--vibeui-stepper-011-error:oklch(0.55 0.19 27);
--vibeui-stepper-011-on:oklch(1 0 0);
--vibeui-stepper-011-alert-bg:oklch(0.97 0.03 27);
--vibeui-stepper-011-size:2rem;
--vibeui-stepper-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="stepper-011"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-stepper-011-font);color:var(--vibeui-stepper-011-fg);
}
[data-vibeui-block="stepper-011"] [data-part="shell"]{
background:var(--vibeui-stepper-011-bg);
border:1px solid var(--vibeui-stepper-011-border);
border-radius:1rem;padding:1.125rem 1rem 1rem;
}
[data-vibeui-block="stepper-011"] ol{
display:flex;margin:0;padding:0;list-style:none;gap:0;
}
[data-vibeui-block="stepper-011"] li{
position:relative;flex:1 1 0;min-width:0;
display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.375rem;
--vibeui-stepper-011-tone:var(--vibeui-stepper-011-line);
}
[data-vibeui-block="stepper-011"] li[data-state="done"]{--vibeui-stepper-011-tone:var(--vibeui-stepper-011-done)}
[data-vibeui-block="stepper-011"] li[data-state="error"]{--vibeui-stepper-011-tone:var(--vibeui-stepper-011-error)}
[data-vibeui-block="stepper-011"] li[data-state="current"]{--vibeui-stepper-011-tone:var(--vibeui-stepper-011-accent)}
[data-vibeui-block="stepper-011"] li:not(:first-child)::before{
content:"";position:absolute;top:calc(var(--vibeui-stepper-011-size) / 2 - 1px);
right:50%;left:-50%;height:2px;background:var(--vibeui-stepper-011-tone);
}
[data-vibeui-block="stepper-011"] [data-part="mark"]{
position:relative;z-index:1;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-011-size);height:var(--vibeui-stepper-011-size);
border-radius:9999px;border:2px solid var(--vibeui-stepper-011-tone);
background:var(--vibeui-stepper-011-bg);color:var(--vibeui-stepper-011-tone);
font-size:0.8125rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-011"] li[data-state="done"] [data-part="mark"],
[data-vibeui-block="stepper-011"] li[data-state="error"] [data-part="mark"]{
background:var(--vibeui-stepper-011-tone);color:var(--vibeui-stepper-011-on);
}
[data-vibeui-block="stepper-011"] li[data-state="current"] [data-part="mark"]{
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-011-accent) 18%,transparent);
}
[data-vibeui-block="stepper-011"] [data-part="title"]{
font-size:0.8125rem;font-weight:600;line-height:1.25;
}
[data-vibeui-block="stepper-011"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-011-muted);
}
[data-vibeui-block="stepper-011"] [data-part="state"]{
font-size:0.6875rem;font-weight:650;line-height:1.2;color:var(--vibeui-stepper-011-tone);
}
[data-vibeui-block="stepper-011"] li[data-state="todo"] [data-part="state"]{color:var(--vibeui-stepper-011-muted)}
[data-vibeui-block="stepper-011"] [data-part="alerts"]{margin-top:1rem;display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="stepper-011"] [data-part="alert"]{
border:1px solid color-mix(in oklab,var(--vibeui-stepper-011-error) 35%,transparent);
background:var(--vibeui-stepper-011-alert-bg);
border-radius:0.75rem;padding:0.75rem 0.875rem;
}
[data-vibeui-block="stepper-011"] [data-part="alert-title"]{
display:flex;align-items:center;gap:0.5rem;
margin:0 0 0.25rem;font-size:0.8125rem;font-weight:650;color:var(--vibeui-stepper-011-error);
}
[data-vibeui-block="stepper-011"] [data-part="alert-icon"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-stepper-011-error);color:var(--vibeui-stepper-011-on);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-011"] [data-part="alert-text"]{
margin:0 0 0.25rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-stepper-011-fg);
}
[data-vibeui-block="stepper-011"] [data-part="alert-text"]:last-of-type{margin-bottom:0}
[data-vibeui-block="stepper-011"] [data-part="alert-action"]{
display:inline-flex;margin-top:0.5rem;
color:var(--vibeui-stepper-011-error);font-size:0.8125rem;font-weight:650;
text-decoration:underline;text-underline-offset:0.15em;
}
[data-vibeui-block="stepper-011"] [data-part="alert-action"]:focus-visible{
outline:2px solid var(--vibeui-stepper-011-error);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-011"] *{animation:none!important;transition:none!important}}
`

const WORDS: Record<Stepper011State, string> = {
  done: "Готово",
  error: "Ошибка",
  current: "Сейчас",
  todo: "Впереди",
}

const DEFAULT_STEPS: Stepper011Step[] = [
  { title: "Аккаунт", state: "done" },
  {
    title: "Реквизиты",
    state: "error",
    issue: "Не сходится ИНН с названием организации.",
    fix: "Проверьте ИНН в выписке из налоговой и введите его без пробелов.",
    href: "#requisites",
    actionLabel: "Исправить реквизиты",
  },
  { title: "Оплата", state: "current" },
  { title: "Запуск", state: "todo" },
]

/**
 * Шаги с ошибкой на одном из этапов и подсказкой, как её исправить.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper011({
  steps = DEFAULT_STEPS,
  label = "Настройка магазина",
  accent,
  className,
  style,
  ...props
}: Stepper011Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  const errors = steps.filter((step) => step.state === "error")

  return (
    <>
      <style href="vibeui-stepper-011" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="stepper-011"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <ol>
            {steps.map((step) => (
              <li
                key={step.title}
                data-state={step.state}
                aria-current={step.state === "current" ? "step" : undefined}
              >
                <span data-part="mark" aria-hidden="true">
                  {step.state === "done"
                    ? "✓"
                    : step.state === "error"
                      ? "!"
                      : "•"}
                </span>
                <span data-part="title">{step.title}</span>
                <span data-part="state">{WORDS[step.state]}</span>
              </li>
            ))}
          </ol>
          {errors.length > 0 ? (
            <div data-part="alerts">
              {errors.map((step) => (
                <div data-part="alert" key={step.title}>
                  <p data-part="alert-title">
                    <span data-part="alert-icon" aria-hidden="true">
                      !
                    </span>
                    Ошибка на шаге «{step.title}»
                  </p>
                  {step.issue ? (
                    <p data-part="alert-text">{step.issue}</p>
                  ) : null}
                  {step.fix ? <p data-part="alert-text">{step.fix}</p> : null}
                  {step.href ? (
                    <a data-part="alert-action" href={step.href}>
                      {step.actionLabel ?? "Исправить"}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </nav>
    </>
  )
}
