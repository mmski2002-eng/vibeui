"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup018Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  name?: string
  legend?: string
  defaultFrom?: string
  defaultTo?: string
  /** Подпись первой даты: компонент несёт русскую. */
  fromLabel?: string
  /** Подпись второй даты. */
  toLabel?: string
  /** Текст, пока обе даты не заданы. */
  emptyText?: string
  /** Итог; {count} — число ночей, {unit} — их форма из nightsText. */
  totalTemplate?: string
  /** Формы слова «ночь»: one, few, many. */
  nightsText?: Record<string, string>
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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

const NIGHTS_TEXT: Record<string, string> = {
  one: "ночь",
  few: "ночи",
  many: "ночей",
}

function pluralKey(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "one"
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "few"
  return "many"
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

// Идея компонента: «от» и «до» — одна величина из двух дат, поэтому обёртка —
// fieldset с legend, а не два независимых поля. Второе поле не пускает даты
// раньше первого через нативный min — это дешевле и надёжнее самодельной
// проверки. На узкой ширине (собственной, через @container, а не окна) даты
// складываются в столбик с несобранными рамками; на широкой — рамки
// схлопываются в одну сцепку с тире между половинами.
const STYLES = `
:where([data-vibeui-block="inputgroup-018"]){
--vibeui-inputgroup-018-surface:transparent;
--vibeui-inputgroup-018-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-inputgroup-018-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-018-muted:color-mix(in oklab,var(--vibeui-inputgroup-018-fg) 68%,transparent);
--vibeui-inputgroup-018-field:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.012 265));
--vibeui-inputgroup-018-border:light-dark(oklch(0.86 0.008 265),oklch(0.4 0.014 265));
--vibeui-inputgroup-018-accent:light-dark(oklch(0.5 0.13 165),oklch(0.74 0.13 165));
--vibeui-inputgroup-018-radius:0.75rem;
--vibeui-inputgroup-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-018"]{color-scheme:dark}
[data-vibeui-block="inputgroup-018"]{
display:block;margin:0;padding:0.875rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:26rem;box-sizing:border-box;
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
[data-vibeui-block="inputgroup-018"] [data-part="cell"]{flex:1;height:2.75rem}
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
  fromLabel = "с",
  toLabel = "по",
  emptyText = "Укажите обе даты",
  totalTemplate = "Итого: {count} {unit}",
  nightsText = NIGHTS_TEXT,
  hint = "Вторая дата не может быть раньше первой — ограничение задано атрибутом min у поля.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup018Props) {
  const id = useId()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)

  const nights = nightsBetween(from, to)
  const [totalBefore, totalAfter = ""] = totalTemplate.split("{count}")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-018-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-018" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-018"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="group">
          <div data-part="cell">
            <span id={`${id}-from-label`}>{fromLabel}</span>
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
            <span id={`${id}-to-label`}>{toLabel}</span>
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
            emptyText
          ) : (
            <>
              {totalBefore}
              <b>{nights}</b>
              {totalAfter.replace(
                "{unit}",
                nightsText[pluralKey(nights)] ?? NIGHTS_TEXT[pluralKey(nights)],
              )}
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
