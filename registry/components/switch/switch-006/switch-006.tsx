"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Switch006Props = Omit<
  ComponentPropsWithoutRef<"label">,
  "children" | "onChange"
> & {
  label?: string
  description?: string
  /** Сколько миллисекунд «сохраняем» — столько же ждёт настоящий запрос. */
  delay?: number
  accent?: string
}

// Идея компонента: настройка, которая уезжает на сервер. Тумблер двигается
// сразу, а строка под ним честно проходит три состояния — «сохраняем»,
// «сохранено», молчание. Оптимистичное переключение без индикатора врёт:
// человек уходит со страницы, не дождавшись записи.
const STYLES = `
:where([data-vibeui-block="switch-006"]){
--vibeui-switch-006-bg:oklch(1 0 0);
--vibeui-switch-006-fg:oklch(0.22 0.014 265);
--vibeui-switch-006-muted:oklch(0.55 0.014 265);
--vibeui-switch-006-border:oklch(0.91 0.006 265);
--vibeui-switch-006-track:oklch(0.88 0.008 265);
--vibeui-switch-006-thumb:oklch(1 0 0);
--vibeui-switch-006-accent:oklch(0.55 0.19 262);
--vibeui-switch-006-ok:oklch(0.55 0.15 155);
--vibeui-switch-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="switch-006"]{
display:flex;align-items:center;gap:1rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-switch-006-bg);
border:1px solid var(--vibeui-switch-006-border);border-radius:0.875rem;
font-family:var(--vibeui-switch-006-font);color:var(--vibeui-switch-006-fg);
cursor:pointer;
}
[data-vibeui-block="switch-006"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="switch-006"] [data-part="label"]{font-size:0.9375rem;font-weight:600;line-height:1.3}
[data-vibeui-block="switch-006"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;
min-height:1.125rem;font-size:0.75rem;line-height:1.4;color:var(--vibeui-switch-006-muted);
}
/* Высота строки статуса зафиксирована: иначе карточка прыгает на каждом
   переключении, а прыжок читается как ошибка. */
[data-vibeui-block="switch-006"] [data-part="spinner"]{
flex:none;width:0.75rem;height:0.75rem;border-radius:9999px;
border:1.5px solid color-mix(in oklab,var(--vibeui-switch-006-accent) 30%,transparent);
border-top-color:var(--vibeui-switch-006-accent);
animation:vibeui-switch-006-spin .7s linear infinite;
}
@keyframes vibeui-switch-006-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="switch-006"] [data-part="tick"]{
flex:none;width:0.375rem;height:0.6875rem;
border-right:1.5px solid var(--vibeui-switch-006-ok);
border-bottom:1.5px solid var(--vibeui-switch-006-ok);
transform:rotate(45deg);
}
[data-vibeui-block="switch-006"][data-state="saved"] [data-part="status"]{color:var(--vibeui-switch-006-ok)}
[data-vibeui-block="switch-006"] [data-part="track"]{position:relative;display:flex;flex:none}
[data-vibeui-block="switch-006"] input{
appearance:none;-webkit-appearance:none;margin:0;
width:2.75rem;height:1.5rem;border-radius:9999px;
background:var(--vibeui-switch-006-track);cursor:inherit;
transition:background-color .18s ease;
}
[data-vibeui-block="switch-006"] input:checked{background:var(--vibeui-switch-006-accent)}
[data-vibeui-block="switch-006"] input:focus-visible{outline:2px solid var(--vibeui-switch-006-accent);outline-offset:2px}
[data-vibeui-block="switch-006"] [data-part="thumb"]{
position:absolute;left:0.1875rem;top:0.1875rem;
width:1.125rem;height:1.125rem;border-radius:9999px;pointer-events:none;
background:var(--vibeui-switch-006-thumb);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 28%);
transition:transform .18s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="switch-006"] input:checked + [data-part="thumb"]{transform:translateX(1.25rem)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="switch-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Переключатель с отложенным сохранением: «сохраняем» → «сохранено».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Switch006({
  label = "Синхронизация с календарём",
  description = "Задачи с датой попадают в рабочий календарь.",
  delay = 900,
  accent,
  className,
  style,
  ...props
}: Switch006Props) {
  const id = useId()
  const [checked, setChecked] = useState(false)
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Таймеры снимаются при размонтировании: иначе setState зовут у
  // компонента, которого уже нет на странице.
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-switch-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-switch-006" precedence="medium">
        {STYLES}
      </style>
      <label
        {...props}
        data-vibeui-block="switch-006"
        data-state={state}
        className={className}
        style={palette}
        htmlFor={id}
      >
        <span data-part="text">
          <span data-part="label">{label}</span>
          <span data-part="status" role="status">
            {state === "saving" ? (
              <>
                <span data-part="spinner" aria-hidden="true" />
                Сохраняем настройку…
              </>
            ) : null}
            {state === "saved" ? (
              <>
                <span data-part="tick" aria-hidden="true" />
                Сохранено
              </>
            ) : null}
            {state === "idle" ? description : null}
          </span>
        </span>
        <span data-part="track">
          <input
            id={id}
            type="checkbox"
            role="switch"
            checked={checked}
            onChange={(event) => {
              timers.current.forEach(clearTimeout)
              timers.current = []
              setChecked(event.target.checked)
              setState("saving")
              timers.current.push(
                setTimeout(() => setState("saved"), delay),
                setTimeout(() => setState("idle"), delay + 1600),
              )
            }}
          />
          <span data-part="thumb" aria-hidden="true" />
        </span>
      </label>
    </>
  )
}
