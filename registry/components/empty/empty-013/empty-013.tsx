"use client"

import { useState, type CSSProperties } from "react"

export type Empty013Step = {
  id: string
  title: string
  hint: string
}

export type Empty013Props = {
  title?: string
  steps?: Empty013Step[]
  actionLabel?: string
  onAction?: () => void
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: первый запуск как чек-лист, а не линейный сценарий.
// Шаги можно отмечать в любом порядке — не всякий онбординг идёт строго
// по номерам, — прогресс-бар показывает готовность, а кнопка одна и не
// ждёт, пока отметят все пункты: начать можно и раньше.
const STYLES = `
:where([data-vibeui-block="empty-013"]){
--vibeui-empty-013-bg:oklch(1 0 0);
--vibeui-empty-013-fg:oklch(0.21 0.014 265);
--vibeui-empty-013-muted:oklch(0.55 0.014 265);
--vibeui-empty-013-border:oklch(0.91 0.006 265);
--vibeui-empty-013-accent:oklch(0.55 0.17 265);
--vibeui-empty-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="empty-013"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.375rem;
background:var(--vibeui-empty-013-bg);
border:1px solid var(--vibeui-empty-013-border);border-radius:1rem;
font-family:var(--vibeui-empty-013-font);color:var(--vibeui-empty-013-fg);
}
[data-vibeui-block="empty-013"] [data-part="head"]{display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="empty-013"] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:700;line-height:1.25}
[data-vibeui-block="empty-013"] [data-part="progress-row"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="empty-013"] [data-part="progress-count"]{
flex:none;font-size:0.75rem;font-weight:650;color:var(--vibeui-empty-013-muted);
}
[data-vibeui-block="empty-013"] [data-part="progress-track"]{
flex:1;height:0.375rem;border-radius:9999px;background:oklch(0.94 0.004 265);overflow:hidden;
}
[data-vibeui-block="empty-013"] [data-part="progress-fill"]{
height:100%;border-radius:inherit;background:var(--vibeui-empty-013-accent);
transition:width .2s ease;
}
[data-vibeui-block="empty-013"] [data-part="steps"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="empty-013"] [data-part="step"]{
appearance:none;width:100%;cursor:pointer;text-align:left;
display:flex;align-items:flex-start;gap:0.625rem;
padding:0.625rem 0.75rem;border-radius:0.75rem;
border:1px solid var(--vibeui-empty-013-border);background:transparent;color:inherit;font:inherit;
}
[data-vibeui-block="empty-013"] [data-part="step"][aria-pressed="true"]{
border-color:color-mix(in oklab,var(--vibeui-empty-013-accent) 45%,var(--vibeui-empty-013-border));
background:color-mix(in oklab,var(--vibeui-empty-013-accent) 6%,transparent);
}
[data-vibeui-block="empty-013"] [data-part="step"]:focus-visible{
outline:2px solid var(--vibeui-empty-013-accent);outline-offset:2px;
}
[data-vibeui-block="empty-013"] [data-part="check"]{
flex:none;width:1.375rem;height:1.375rem;border-radius:9999px;margin-top:0.0625rem;
border:1.5px solid var(--vibeui-empty-013-border);
display:flex;align-items:center;justify-content:center;color:oklch(0.99 0.01 265);
}
[data-vibeui-block="empty-013"] [data-part="step"][aria-pressed="true"] [data-part="check"]{
border-color:transparent;background:var(--vibeui-empty-013-accent);
}
[data-vibeui-block="empty-013"] [data-part="check"] svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="empty-013"] [data-part="step-body"]{display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="empty-013"] [data-part="step-name"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="empty-013"] [data-part="step"][aria-pressed="true"] [data-part="step-name"]{
text-decoration:line-through;color:var(--vibeui-empty-013-muted);
}
[data-vibeui-block="empty-013"] [data-part="step-hint"]{font-size:0.75rem;line-height:1.4;color:var(--vibeui-empty-013-muted)}
[data-vibeui-block="empty-013"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;width:100%;
height:2.625rem;border-radius:0.75rem;
background:var(--vibeui-empty-013-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="empty-013"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-empty-013-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Empty013Step[] = [
  {
    id: "profile",
    title: "Заполните профиль",
    hint: "Имя и аватар видны команде",
  },
  {
    id: "invite",
    title: "Пригласите команду",
    hint: "Можно позвать позже, из настроек",
  },
  {
    id: "first-project",
    title: "Создайте первый проект",
    hint: "Пустой шаблон уже готов",
  },
]

/**
 * Первый запуск как чек-лист: шаги отмечаются в любом порядке,
 * прогресс-бар считает готовность, действие одно.
 * Один файл, ноль внешних зависимостей.
 */
export function Empty013({
  title = "С чего начать",
  steps = DEFAULT_STEPS,
  actionLabel = "Перейти к проекту",
  onAction,
  accent,
  className,
  style,
}: Empty013Props) {
  const [done, setDone] = useState<Record<string, boolean>>({})
  const doneCount = steps.filter((step) => done[step.id]).length
  const palette = {
    ...(accent ? { "--vibeui-empty-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-013" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="empty-013" className={className} style={palette}>
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <div data-part="progress-row">
            <span data-part="progress-count">
              {doneCount}/{steps.length}
            </span>
            <span
              data-part="progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-valuenow={doneCount}
            >
              <span
                data-part="progress-fill"
                style={{ width: `${(doneCount / steps.length) * 100}%` }}
              />
            </span>
          </div>
        </div>
        <ul data-part="steps">
          {steps.map((step) => {
            const checked = Boolean(done[step.id])
            return (
              <li key={step.id}>
                <button
                  type="button"
                  data-part="step"
                  aria-pressed={checked}
                  onClick={() =>
                    setDone((value) => ({ ...value, [step.id]: !checked }))
                  }
                >
                  <span data-part="check" aria-hidden="true">
                    {checked ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="5 13 10 18 19 7" />
                      </svg>
                    ) : null}
                  </span>
                  <span data-part="step-body">
                    <span data-part="step-name">{step.title}</span>
                    <span data-part="step-hint">{step.hint}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <button type="button" data-part="action" onClick={onAction}>
          {actionLabel}
        </button>
      </div>
    </>
  )
}
