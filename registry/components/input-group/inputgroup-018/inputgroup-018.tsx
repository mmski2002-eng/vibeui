"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup018Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  name?: string
  legend?: string
  defaultFrom?: string
  defaultTo?: string
  hint?: string
  accent?: string
}

function nightsBetween(from: string, to: string) {
  const start = new Date(from)
  const end = new Date(to)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null
  }
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000)
  return days >= 0 ? days : null
}

function pluralNights(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "ночь"
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "ночи"
  return "ночей"
}

// Идея компонента: «от» и «до» — одна величина из двух дат, поэтому обёртка —
// fieldset с legend, а не два независимых поля. Второе поле не пускает даты
// раньше первого через нативный min — это дешевле и надёжнее самодельной
// проверки. На узкой ширине (собственной, через @container, а не окна) даты
// складываются в столбик с несобранными рамками; на широкой — рамки
// схлопываются в одну сцепку с тире между половинами.
const STYLES = `
:where([data-vibeui-block="inputgroup-018"]){
--vibeui-inputgroup-018-surface:oklch(1 0 0);
--vibeui-inputgroup-018-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-018-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-018-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-018-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-018-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-018-accent:oklch(0.5 0.13 165);
--vibeui-inputgroup-018-radius:0.75rem;
--vibeui-inputgroup-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="inputgroup-018"]{
display:block;margin:0;padding:0.875rem;
width:100%;max-width:26rem;box-sizing:border-box;
background:var(--vibeui-inputgroup-018-surface);
border:1px solid var(--vibeui-inputgroup-018-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-018-font);color:var(--vibeui-inputgroup-018-fg);
}
[data-vibeui-block="inputgroup-018"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-018"] legend{
float:left;width:100%;padding:0;margin:0 0 0.5rem;
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="inputgroup-018"] legend + *{clear:both}
[data-vibeui-block="inputgroup-018"] [data-part="group"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="inputgroup-018"] [data-part="group"] > *{
position:relative;
border:1px solid var(--vibeui-inputgroup-018-border);
border-radius:var(--vibeui-inputgroup-018-radius);
background:var(--vibeui-inputgroup-018-field);
}
[data-vibeui-block="inputgroup-018"] [data-part="cell"]{
display:flex;align-items:center;gap:0.5rem;height:2.75rem;padding:0 0.75rem;
}
[data-vibeui-block="inputgroup-018"] [data-part="cell"]:focus-within{
z-index:1;outline:2px solid var(--vibeui-inputgroup-018-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-018-accent);
}
[data-vibeui-block="inputgroup-018"] [data-part="cell"] span{
flex:none;font-size:0.75rem;color:var(--vibeui-inputgroup-018-muted);
}
[data-vibeui-block="inputgroup-018"] [data-part="cell"] input{
flex:1;min-width:0;border:0;background:none;color:inherit;font:inherit;
font-size:0.9375rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="inputgroup-018"] [data-part="cell"] input:focus{outline:none}
[data-vibeui-block="inputgroup-018"] [data-part="dash"]{
align-self:center;display:grid;place-items:center;
width:1.75rem;height:1.25rem;
color:var(--vibeui-inputgroup-018-muted);font-size:0.875rem;
transform:rotate(90deg);
}
[data-vibeui-block="inputgroup-018"] [data-part="status"]{
margin:0.5rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-018-muted);
}
[data-vibeui-block="inputgroup-018"] [data-part="status"] b{
font-weight:650;color:var(--vibeui-inputgroup-018-accent);
}
[data-vibeui-block="inputgroup-018"] [data-part="hint"]{
margin:0.25rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-018-muted);
}
/* Есть место — рамки клеточек схлопываются в одну сцепку строкой. */
@container (min-width: 24rem){
[data-vibeui-block="inputgroup-018"] [data-part="group"]{flex-direction:row;align-items:stretch;gap:0}
[data-vibeui-block="inputgroup-018"] [data-part="group"] > *{border-radius:0;margin-left:-1px}
[data-vibeui-block="inputgroup-018"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-018-radius) 0 0 var(--vibeui-inputgroup-018-radius);
}
[data-vibeui-block="inputgroup-018"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-018-radius) var(--vibeui-inputgroup-018-radius) 0;
}
[data-vibeui-block="inputgroup-018"] [data-part="cell"]{flex:1;height:2.875rem}
[data-vibeui-block="inputgroup-018"] [data-part="dash"]{
width:1.75rem;height:auto;align-self:stretch;transform:none;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-018"] *{animation:none!important;transition:none!important}}
`

/**
 * Диапазон дат в одной сцепке: «с» и «по» с тире между ними, вторая дата не
 * бывает раньше первой. Столбик на узкой ширине, строка на широкой —
 * раскладка считается от контейнера, не от окна.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup018({
  name = "stay",
  legend = "Период проживания",
  defaultFrom = "2026-09-10",
  defaultTo = "2026-09-14",
  hint = "Вторая дата не может быть раньше первой — ограничение задано атрибутом min у поля.",
  accent,
  className,
  style,
  ...props
}: Inputgroup018Props) {
  const id = useId()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)

  const nights = nightsBetween(from, to)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-018" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="inputgroup-018"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="group">
          <div data-part="cell">
            <span id={`${id}-from-label`}>с</span>
            <input
              id={id}
              name={`${name}-from`}
              type="date"
              value={from}
              aria-labelledby={`${id}-from-label`}
              aria-describedby={`${id}-status ${id}-hint`}
              onChange={(event) => {
                const next = event.target.value
                setFrom(next)
                if (to && next > to) {
                  setTo(next)
                }
              }}
            />
          </div>
          <div data-part="dash" aria-hidden="true">
            →
          </div>
          <div data-part="cell">
            <span id={`${id}-to-label`}>по</span>
            <input
              name={`${name}-to`}
              type="date"
              min={from || undefined}
              value={to}
              aria-labelledby={`${id}-to-label`}
              aria-describedby={`${id}-status ${id}-hint`}
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
        </div>
        <p data-part="status" id={`${id}-status`} aria-live="polite">
          {nights === null ? (
            "Укажите обе даты"
          ) : (
            <>
              Итого: <b>{nights}</b> {pluralNights(nights)}
            </>
          )}
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </fieldset>
    </>
  )
}
