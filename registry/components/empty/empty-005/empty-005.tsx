import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty005Step = {
  title: string
  hint: string
}

export type Empty005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  steps?: Empty005Step[]
  actionLabel?: string
  onAction?: () => void
  accent?: string
}

// Идея компонента: первый запуск, где пусто не потому, что данных нет, а
// потому, что работа ещё не начата. Поэтому здесь не картинка с подписью, а
// три шага с нумерацией: первый выделен как текущий, остальные приглушены —
// видно, сколько всего работы. Кнопка ровно одна и запускает первый шаг.
const STYLES = `
:where([data-vibeui-block="empty-005"]){
--vibeui-empty-005-bg:oklch(1 0 0);
--vibeui-empty-005-fg:oklch(0.21 0.014 265);
--vibeui-empty-005-muted:oklch(0.55 0.014 265);
--vibeui-empty-005-border:oklch(0.91 0.006 265);
--vibeui-empty-005-accent:oklch(0.55 0.17 265);
--vibeui-empty-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="empty-005"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.375rem;
background:var(--vibeui-empty-005-bg);
border:1px solid var(--vibeui-empty-005-border);border-radius:1rem;
font-family:var(--vibeui-empty-005-font);color:var(--vibeui-empty-005-fg);
}
[data-vibeui-block="empty-005"] [data-part="head"]{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="empty-005"] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:700;line-height:1.25}
[data-vibeui-block="empty-005"] [data-part="progress"]{
margin:0;font-size:0.75rem;font-weight:650;color:var(--vibeui-empty-005-muted);
}
[data-vibeui-block="empty-005"] [data-part="steps"]{list-style:none;margin:0;padding:0}
/* Линия между номерами показывает, что шаги идут подряд, а не вразнобой. */
[data-vibeui-block="empty-005"] [data-part="step"]{
position:relative;display:flex;gap:0.75rem;padding-bottom:0.875rem;
}
[data-vibeui-block="empty-005"] [data-part="step"]:last-child{padding-bottom:0}
[data-vibeui-block="empty-005"] [data-part="step"]:not(:last-child)::before{
content:"";position:absolute;left:0.8125rem;top:1.875rem;bottom:0.25rem;
width:1.5px;background:var(--vibeui-empty-005-border);
}
[data-vibeui-block="empty-005"] [data-part="number"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:1.625rem;height:1.625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-empty-005-border);
background:var(--vibeui-empty-005-bg);
font-size:0.75rem;font-weight:700;color:var(--vibeui-empty-005-muted);
}
[data-vibeui-block="empty-005"] [data-part="step"][data-current="true"] [data-part="number"]{
border-color:transparent;background:var(--vibeui-empty-005-accent);color:oklch(0.99 0.01 265);
}
[data-vibeui-block="empty-005"] [data-part="body"]{display:flex;flex-direction:column;gap:0.125rem;padding-top:0.125rem}
[data-vibeui-block="empty-005"] [data-part="name"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="empty-005"] [data-part="hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-empty-005-muted)}
[data-vibeui-block="empty-005"] [data-part="step"]:not([data-current="true"]) [data-part="name"]{color:var(--vibeui-empty-005-muted)}
[data-vibeui-block="empty-005"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;width:100%;
height:2.625rem;border-radius:0.75rem;
background:var(--vibeui-empty-005-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="empty-005"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-005-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Empty005Step[] = [
  {
    title: "Подключите репозиторий",
    hint: "GitHub или GitLab — доступ можно отозвать в любой момент",
  },
  {
    title: "Проверьте команду сборки",
    hint: "Определится сама, менять её обычно не нужно",
  },
  {
    title: "Опубликуйте первый раз",
    hint: "Адрес выдаётся сразу, свой домен подключается позже",
  },
]

/**
 * Первый запуск в три шага: текущий выделен, действие одно.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty005({
  title = "Начнём с трёх шагов",
  steps = DEFAULT_STEPS,
  actionLabel = "Подключить репозиторий",
  onAction,
  accent,
  className,
  style,
  ...props
}: Empty005Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-005"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <p data-part="progress">Готово 0 из {steps.length}</p>
        </div>
        <ol data-part="steps">
          {steps.map((step, index) => (
            <li key={step.title} data-part="step" data-current={index === 0}>
              <span data-part="number" aria-hidden="true">
                {index + 1}
              </span>
              <span data-part="body">
                <span data-part="name">{step.title}</span>
                <span data-part="hint">{step.hint}</span>
              </span>
            </li>
          ))}
        </ol>
        <button type="button" data-part="action" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </>
  )
}
