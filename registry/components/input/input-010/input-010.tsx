"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Input010Unit = {
  code: string
  title: string
  /** Сколько базовых единиц в одной этой. */
  factor: number
}

export type Input010Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  units?: Input010Unit[]
  defaultValue?: number
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Локаль для разделителей разрядов в примечании. */
  locale?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  onChange?: (value: number, unit: string) => void
  accent?: string
}

// Идея компонента: единица выбирается из выпадающего списка внутри той же
// рамки, что и число, и подпись каждой единицы — слово целиком, а не сокращение
// в две буквы. Число при смене единицы не пересчитывается: пользователь ввёл
// «5» и имел в виду «5», а под полем показывается, сколько это в базовых
// единицах. Список — своя кнопка со списком, чтобы поместились пояснения,
// которые нативный select показать не умеет.
const STYLES = `
:where([data-vibeui-block="input-010"]){
--vibeui-input-010-surface:transparent;
/* Список висит над страницей, поэтому его подложка непрозрачна всегда
   и не зависит от surface. */
--vibeui-input-010-panel:light-dark(oklch(1 0 0),oklch(0.28 0.012 265));
--vibeui-input-010-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-input-010-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-010-muted:color-mix(in oklab,var(--vibeui-input-010-fg) 68%,transparent);
--vibeui-input-010-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-input-010-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-input-010-accent:light-dark(oklch(0.53 0.15 165),oklch(0.76 0.13 165));
--vibeui-input-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-010"]{color-scheme:dark}
[data-vibeui-block="input-010"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:21rem;box-sizing:border-box;
font-family:var(--vibeui-input-010-font);color:var(--vibeui-input-010-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-010"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-010-surface);
border:1px solid var(--vibeui-input-010-shell);border-radius:0.875rem;
}
[data-vibeui-block="input-010"] *{box-sizing:border-box}
[data-vibeui-block="input-010"] label{font-size:0.8125rem;font-weight:600}
/* Позиционируем список от рамки, а не от корня: рамка и есть якорь. */
[data-vibeui-block="input-010"] [data-part="frame"]{
position:relative;display:flex;align-items:stretch;
height:2.75rem;
background:var(--vibeui-input-010-field);
border:1px solid var(--vibeui-input-010-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-010"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-010-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-010-accent) 18%,transparent);
}
[data-vibeui-block="input-010"] input{
flex:1;min-width:0;height:100%;padding:0 0.75rem;
border:0;background:none;color:inherit;border-radius:0.75rem 0 0 0.75rem;
font:inherit;font-size:1rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-010"] input:focus{outline:none}
[data-vibeui-block="input-010"] input::-webkit-outer-spin-button,
[data-vibeui-block="input-010"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="input-010"] [data-part="unit"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;gap:0.375rem;
padding:0 0.75rem;border:0;border-left:1px solid var(--vibeui-input-010-border);
border-radius:0 0.75rem 0.75rem 0;
background:color-mix(in oklab,var(--vibeui-input-010-fg) 4%,transparent);
color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
transition:background-color .16s ease;
}
[data-vibeui-block="input-010"] [data-part="unit"]:hover{
background:color-mix(in oklab,var(--vibeui-input-010-fg) 8%,transparent);
}
[data-vibeui-block="input-010"] [data-part="unit"]:focus-visible{
outline:2px solid var(--vibeui-input-010-accent);outline-offset:-2px;
}
[data-vibeui-block="input-010"] [data-part="unit"] svg{
width:0.75rem;height:0.75rem;display:block;color:var(--vibeui-input-010-muted);
transition:transform .16s ease;
}
[data-vibeui-block="input-010"] [data-part="unit"][aria-expanded="true"] svg{transform:rotate(180deg)}
[data-vibeui-block="input-010"] [data-part="list"]{
position:absolute;z-index:2;top:calc(100% + 0.375rem);right:0;min-width:11rem;
margin:0;padding:0.25rem;display:flex;flex-direction:column;
background:var(--vibeui-input-010-panel);
border:1px solid var(--vibeui-input-010-border);border-radius:0.75rem;
box-shadow:0 12px 28px -12px color-mix(in oklab,var(--vibeui-input-010-fg) 40%,transparent);
}
[data-vibeui-block="input-010"] [data-part="option"]{
display:flex;align-items:baseline;gap:0.5rem;width:100%;
padding:0.4375rem 0.5rem;border:0;border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;
cursor:pointer;text-align:left;
}
[data-vibeui-block="input-010"] [data-part="option"]:hover,
[data-vibeui-block="input-010"] [data-part="option"]:focus-visible{
outline:none;background:color-mix(in oklab,var(--vibeui-input-010-accent) 12%,transparent);
}
[data-vibeui-block="input-010"] [data-part="option"][aria-selected="true"]{font-weight:650}
[data-vibeui-block="input-010"] [data-part="option"] em{
font-style:normal;color:var(--vibeui-input-010-muted);font-size:0.75rem;
}
[data-vibeui-block="input-010"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-010-muted);
}
[data-vibeui-block="input-010"] [data-part="note"] b{
color:var(--vibeui-input-010-fg);font-weight:650;font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-010"] *{animation:none!important;transition:none!important}}
`

const UNITS: Input010Unit[] = [
  { code: "мин", title: "минуты", factor: 60 },
  { code: "ч", title: "часы", factor: 3600 },
  { code: "сут", title: "сутки", factor: 86400 },
]

const TEXT = {
  unitLabel: "Единица измерения: {unit}",
  listLabel: "Единицы",
  note: "Это {seconds} секунд — столько ссылка останется рабочей.",
}

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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

/**
 * Число с выпадающим выбором единицы измерения в одной рамке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input010({
  label = "Время жизни ссылки",
  units = UNITS,
  defaultValue = 30,
  text,
  locale = "ru-RU",
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input010Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [unit, setUnit] = useState(units[0]?.code ?? "")
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement | null>(null)

  const copy = { ...TEXT, ...text }

  const palette = {
    ...(accent ? { "--vibeui-input-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const current = units.find((entry) => entry.code === unit) ?? units[0]
  const seconds = Math.round(value * (current?.factor ?? 1))
  const [beforeNote, afterNote] = copy.note.split("{seconds}")

  const choose = (code: string) => {
    setUnit(code)
    setOpen(false)
    trigger.current?.focus()
    onChange?.(value, code)
  }

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      setOpen(false)
      trigger.current?.focus()
    }
  }

  return (
    <>
      <style href="vibeui-input-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-010"
        data-surface={background ? "on" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div
          data-part="frame"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setOpen(false)
          }}
        >
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={1}
            value={value}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setValue(next)
              onChange?.(next, unit)
            }}
          />
          <button
            ref={trigger}
            type="button"
            data-part="unit"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={copy.unitLabel.replace("{unit}", current?.title ?? "")}
            onClick={() => setOpen((was) => !was)}
          >
            {current?.code}
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path
                d="m3 4.5 3 3 3-3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {open ? (
            <div
              data-part="list"
              role="listbox"
              aria-label={copy.listLabel}
              onKeyDown={onListKeyDown}
            >
              {units.map((entry) => (
                <button
                  key={entry.code}
                  type="button"
                  data-part="option"
                  role="option"
                  aria-selected={entry.code === unit}
                  onClick={() => choose(entry.code)}
                >
                  {entry.code} <em>{entry.title}</em>
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <p data-part="note" id={`${id}-note`} aria-live="polite">
          {beforeNote}
          <b>{seconds.toLocaleString(locale)}</b>
          {afterNote}
        </p>
      </div>
    </>
  )
}
