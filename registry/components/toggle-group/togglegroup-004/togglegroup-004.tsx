"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Togglegroup004Props = Omit<
  ComponentProps<"section">,
  "children" | "onChange"
> & {
  label?: string
  hint?: string
  defaultValue?: string[]
  /** Короткие подписи кружков по идентификатору дня. */
  dayShortText?: Record<string, string>
  /** Полные имена дней для aria-label. */
  dayLongText?: Record<string, string>
  /** Подпись кнопки-пресета «только будни». */
  presetText?: string
  /** Итог с подстановками {count}, {word} и {days}. */
  summaryText?: string
  /** Итог, когда не выбрано ни одного дня. */
  emptyText?: string
  /** Формы слова «день» для 1, 2–4 и 5+ — счётная строка остаётся живой. */
  dayWordText?: { one: string; few: string; many: string }
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: фильтр по дням недели множественным выбором. Кружок — это
// toggle: нажат или нет, седьмого состояния не бывает. Рядом стоит обычная
// кнопка «Будни» — она не toggle, а действие над выбором, и выглядит иначе,
// чтобы разница между состоянием и действием читалась глазами.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-004"]){
--vibeui-togglegroup-004-bg:transparent;
--vibeui-togglegroup-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-togglegroup-004-muted:color-mix(in oklab,var(--vibeui-togglegroup-004-fg) 68%,transparent);
--vibeui-togglegroup-004-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-togglegroup-004-surface:light-dark(oklch(0.97 0 265),oklch(0.26 0 265));
--vibeui-togglegroup-004-raised:light-dark(oklch(1 0 0),oklch(0.29 0 265));
--vibeui-togglegroup-004-accent:light-dark(oklch(0.52 0.16 145),oklch(0.72 0.15 145));
--vibeui-togglegroup-004-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.02 145));
--vibeui-togglegroup-004-weekend:light-dark(oklch(0.6 0.16 25),oklch(0.72 0.15 25));
--vibeui-togglegroup-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="togglegroup-004"]{color-scheme:dark}
[data-vibeui-block="togglegroup-004"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-004-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-004-bg);color:var(--vibeui-togglegroup-004-fg);
font-family:var(--vibeui-togglegroup-004-font);
}
[data-vibeui-block="togglegroup-004"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-004"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="togglegroup-004"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-004"] [data-part="preset"]{
appearance:none;cursor:pointer;font:inherit;border:0;background:none;padding:0;
color:var(--vibeui-togglegroup-004-accent);
font-size:0.75rem;font-weight:600;text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="togglegroup-004"] [data-part="preset"]:focus-visible{
outline:2px solid var(--vibeui-togglegroup-004-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="togglegroup-004"] [data-part="group"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
[data-vibeui-block="togglegroup-004"] [data-part="day"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2.375rem;height:2.375rem;padding:0;
border:1px solid var(--vibeui-togglegroup-004-border);border-radius:50%;
background:var(--vibeui-togglegroup-004-raised);color:var(--vibeui-togglegroup-004-muted);
font-size:0.8125rem;font-weight:650;line-height:1;
transition:background-color .15s ease,color .15s ease,border-color .15s ease;
}
[data-vibeui-block="togglegroup-004"] [data-part="day"]:hover{background:var(--vibeui-togglegroup-004-surface)}
[data-vibeui-block="togglegroup-004"] [data-part="day"]:focus-visible{
outline:2px solid var(--vibeui-togglegroup-004-accent);outline-offset:2px;
}
[data-vibeui-block="togglegroup-004"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-togglegroup-004-accent);
border-color:var(--vibeui-togglegroup-004-accent);
color:var(--vibeui-togglegroup-004-accent-fg);
}
/* Выходные красятся своим цветом только в нажатом виде: в спокойном
   состоянии семь разноцветных кружков читались бы как семь разных сущностей. */
[data-vibeui-block="togglegroup-004"] [data-part="day"][data-weekend="true"][aria-pressed="true"]{
background:var(--vibeui-togglegroup-004-weekend);
border-color:var(--vibeui-togglegroup-004-weekend);
}
[data-vibeui-block="togglegroup-004"] [data-part="summary"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-togglegroup-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-004"] *{animation:none!important;transition:none!important}}
`

const DAYS = [
  { id: "mon", weekend: false },
  { id: "tue", weekend: false },
  { id: "wed", weekend: false },
  { id: "thu", weekend: false },
  { id: "fri", weekend: false },
  { id: "sat", weekend: true },
  { id: "sun", weekend: true },
]

const DAY_SHORT_TEXT: Record<string, string> = {
  mon: "Пн",
  tue: "Вт",
  wed: "Ср",
  thu: "Чт",
  fri: "Пт",
  sat: "Сб",
  sun: "Вс",
}

const DAY_LONG_TEXT: Record<string, string> = {
  mon: "Понедельник",
  tue: "Вторник",
  wed: "Среда",
  thu: "Четверг",
  fri: "Пятница",
  sat: "Суббота",
  sun: "Воскресенье",
}

const DAY_WORD_TEXT = { one: "день", few: "дня", many: "дней" }

/** Форма счётного слова: правило русское, сами слова приходят пропом. */
function pluralForm(count: number): "one" | "few" | "many" {
  const tail = count % 100

  if (tail > 10 && tail < 20) {
    return "many"
  }

  const last = count % 10

  if (last === 1) {
    return "one"
  }

  if (last > 1 && last < 5) {
    return "few"
  }

  return "many"
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Стрелки водят фокус внутри группы: до дальней кнопки не нужно дожимать
 * Tab через все предыдущие, а Home и End бросают на края.
 */
function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const step =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0

  if (step === 0 && event.key !== "Home" && event.key !== "End") {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from === -1) {
    return
  }

  const last = buttons.length - 1
  const next =
    event.key === "Home" ? 0 : event.key === "End" ? last : from + step

  event.preventDefault()
  buttons[next < 0 ? last : next > last ? 0 : next].focus()
}

/**
 * Фильтр по дням недели: множественный выбор кружками-тумблерами и живая
 * строка итога. Один файл, ноль зависимостей, собственная палитра.
 */
export function Togglegroup004({
  label = "Дни доставки",
  hint = "Курьер приезжает только в отмеченные дни.",
  defaultValue = ["mon", "wed", "fri"],
  dayShortText = DAY_SHORT_TEXT,
  dayLongText = DAY_LONG_TEXT,
  presetText = "Только будни",
  summaryText = "{count} {word}: {days}.",
  emptyText = "Ни один день не выбран — доставки не будет.",
  dayWordText = DAY_WORD_TEXT,
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup004Props) {
  const hintId = useId()
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  const chosen = DAYS.filter((day) => value.includes(day.id))

  return (
    <>
      <style href="vibeui-togglegroup-004" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="toggle-group"
        data-vibeui-block="togglegroup-004"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3>{label}</h3>
          <button
            type="button"
            data-part="preset"
            onClick={() => apply(["mon", "tue", "wed", "thu", "fri"])}
          >
            {presetText}
          </button>
        </div>
        <div
          data-part="group"
          role="group"
          aria-label={label}
          aria-describedby={hintId}
          onKeyDown={moveFocus}
        >
          {DAYS.map((day) => (
            <button
              key={day.id}
              type="button"
              data-part="day"
              data-weekend={day.weekend}
              aria-pressed={value.includes(day.id)}
              aria-label={dayLongText[day.id] ?? DAY_LONG_TEXT[day.id]}
              onClick={() =>
                apply(
                  value.includes(day.id)
                    ? value.filter((item) => item !== day.id)
                    : [...value, day.id],
                )
              }
            >
              {dayShortText[day.id] ?? DAY_SHORT_TEXT[day.id]}
            </button>
          ))}
        </div>
        <p data-part="summary" role="status">
          {chosen.length === 0
            ? emptyText
            : summaryText
                .replace("{count}", String(chosen.length))
                .replace("{word}", dayWordText[pluralForm(chosen.length)])
                .replace(
                  "{days}",
                  chosen
                    .map(
                      (day) => dayShortText[day.id] ?? DAY_SHORT_TEXT[day.id],
                    )
                    .join(", "),
                )}
        </p>
        <p data-part="summary" id={hintId}>
          {hint}
        </p>
      </section>
    </>
  )
}
