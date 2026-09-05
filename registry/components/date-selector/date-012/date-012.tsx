"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Date012Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  /**
   * Показать календарь раскрытым в потоке страницы: витрина, скриншот,
   * отладка. В этом режиме popover не используется, поэтому Esc и клик мимо
   * не закрывают панель.
   */
  open?: boolean
  label?: string
  /** Стартовая дата в формате ГГГГ-ММ-ДД. */
  defaultValue?: string
  name?: string
  locale?: string
  hint?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  openLabel?: string
  previousLabel?: string
  nextLabel?: string
  todayLabel?: string
  accent?: string
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: связка «поле ввода + календарь», а не календарь сам по
// себе. Значение живёт в текстовом поле формы и набирается с клавиатуры;
// сетка месяца — второй способ ввести то же самое, и она пристёгнута к полю:
// открывается кнопкой в поле, подхватывает набранное и закрывается, вернув
// дату обратно в поле. Нативный input[type=date] сюда не годится: его
// календарь рисует браузер, и ни подсветить в нём сегодняшний день, ни
// поставить кнопку «Сегодня» нельзя.
//
// Панель живёт в нативном popover: верхний слой, закрытие по Esc и по клику
// мимо достаются от браузера. Позиция берётся из CSS anchor positioning там,
// где он есть, а где нет — панель остаётся карточкой по центру экрана.
const STYLES = `
:where([data-vibeui-block="date-012"]){
--vibeui-date-012-surface:transparent;
--vibeui-date-012-field:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-date-012-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-date-012-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-date-012-muted:color-mix(in oklab,var(--vibeui-date-012-fg) 68%,transparent);
--vibeui-date-012-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-date-012-panel:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-date-012-hover:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.014 265));
--vibeui-date-012-shadow:light-dark(oklch(0.2 0.02 265 / 55%),oklch(0 0 0 / 70%));
--vibeui-date-012-accent:light-dark(oklch(0.55 0.18 262),oklch(0.76 0.15 262));
/* Текст на заливке выводится из светлоты акцента: пользовательский цвет
   приходит один на обе ветки темы, и фиксированный белый однажды окажется
   белым на жёлтом. */
--vibeui-date-012-on-accent:oklch(from var(--vibeui-date-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-date-012-soft:color-mix(in oklab,var(--vibeui-date-012-accent) 14%,transparent);
--vibeui-date-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="date-012"]{color-scheme:dark}
[data-vibeui-block="date-012"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-date-012-surface);
border:1px solid var(--vibeui-date-012-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-012-font);color:var(--vibeui-date-012-fg);
}
[data-vibeui-block="date-012"] *{box-sizing:border-box}
[data-vibeui-block="date-012"] [data-part="label"]{font-size:0.8125rem;font-weight:650;color:var(--vibeui-date-012-fg)}
[data-vibeui-block="date-012"] [data-part="row"]{display:flex;gap:0.5rem;align-items:stretch}
[data-vibeui-block="date-012"] input{
flex:1 1 auto;min-inline-size:0;
min-height:2.75rem;padding:0 0.75rem;
background:var(--vibeui-date-012-field);color:var(--vibeui-date-012-fg);
border:1px solid var(--vibeui-date-012-border);border-radius:0.625rem;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-012"] input:focus-visible{
outline:2px solid var(--vibeui-date-012-accent);outline-offset:1px;border-color:var(--vibeui-date-012-accent);
}
[data-vibeui-block="date-012"] [data-part="trigger"]{
appearance:none;cursor:pointer;flex:none;
width:2.75rem;height:2.75rem;padding:0;
border:1px solid var(--vibeui-date-012-border);border-radius:0.625rem;
background:var(--vibeui-date-012-surface);color:var(--vibeui-date-012-accent);
display:grid;place-items:center;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="date-012"] [data-part="trigger"]:hover{background:var(--vibeui-date-012-soft);border-color:var(--vibeui-date-012-accent)}
[data-vibeui-block="date-012"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-date-012-accent);outline-offset:2px}
[data-vibeui-block="date-012"] [data-part="trigger"] svg{width:1.25rem;height:1.25rem;display:block}
[data-vibeui-block="date-012"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-date-012-muted);
}
[data-vibeui-block="date-012"] [data-part="panel"]{
width:17.5rem;max-width:100%;padding:0.75rem;
border:1px solid var(--vibeui-date-012-border);border-radius:0.875rem;
background:var(--vibeui-date-012-panel);color:var(--vibeui-date-012-fg);
font-family:var(--vibeui-date-012-font);
box-shadow:0 18px 40px -22px var(--vibeui-date-012-shadow);
}
[data-vibeui-block="date-012"] [data-part="panel"]:not(:popover-open){display:none}
[data-vibeui-block="date-012"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-bottom:0.375rem;
}
[data-vibeui-block="date-012"] [data-part="month"]{font-size:0.875rem;font-weight:650;color:var(--vibeui-date-012-fg)}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="date-012"] [data-part="month"]::first-letter{text-transform:uppercase}
[data-vibeui-block="date-012"] [data-part="nav"]{display:flex;gap:0.25rem;flex:none}
[data-vibeui-block="date-012"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;padding:0;
border:1px solid var(--vibeui-date-012-border);border-radius:0.5rem;
background:transparent;color:var(--vibeui-date-012-fg);
}
[data-vibeui-block="date-012"] [data-part="nav"] button:hover{background:var(--vibeui-date-012-hover)}
[data-vibeui-block="date-012"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-date-012-accent);outline-offset:2px}
[data-vibeui-block="date-012"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="date-012"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
[data-vibeui-block="date-012"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="date-012"] th{
padding:0.25rem 0;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-date-012-muted);text-transform:capitalize;
}
[data-vibeui-block="date-012"] td{padding:0.0625rem;text-align:center}
[data-vibeui-block="date-012"] [data-part="day"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:var(--vibeui-date-012-fg);
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-012"] [data-part="day"]:hover{background:var(--vibeui-date-012-hover)}
[data-vibeui-block="date-012"] [data-part="day"]:focus-visible{outline:2px solid var(--vibeui-date-012-accent);outline-offset:-2px}
/* Дни соседних месяцев приглушены, но кликабельны: попасть на 1 число
   следующего месяца из последней строки — обычное дело. */
[data-vibeui-block="date-012"] [data-part="day"][data-outside="true"]{color:var(--vibeui-date-012-muted);opacity:.6}
[data-vibeui-block="date-012"] [data-part="day"][data-today="true"]{box-shadow:inset 0 0 0 1px var(--vibeui-date-012-accent);font-weight:650}
[data-vibeui-block="date-012"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-date-012-accent);color:var(--vibeui-date-012-on-accent);font-weight:650;opacity:1;
}
[data-vibeui-block="date-012"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.375rem;font-size:0.8125rem;color:var(--vibeui-date-012-muted);
}
[data-vibeui-block="date-012"] [data-part="today"]{
appearance:none;cursor:pointer;flex:none;
min-height:1.75rem;padding:0.125rem 0.5rem;
border:1px solid var(--vibeui-date-012-border);border-radius:0.5rem;
background:transparent;color:var(--vibeui-date-012-accent);
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="date-012"] [data-part="today"]:hover{background:var(--vibeui-date-012-soft);border-color:var(--vibeui-date-012-accent)}
[data-vibeui-block="date-012"] [data-part="today"]:focus-visible{outline:2px solid var(--vibeui-date-012-accent);outline-offset:2px}
@supports (anchor-name:--vibeui-date-012-a){
[data-vibeui-block="date-012"] [data-part="panel"]{
position:fixed;margin:0.375rem 0 0;
position-area:bottom span-left;
position-try-fallbacks:flip-block,flip-inline;
}
}
/* Раскрытый режим: панель стоит в потоке под полем, а не в верхнем слое. */
[data-vibeui-block="date-012"] [data-part="panel"][data-open="true"]{
display:block;position:static;opacity:1;transform:none;
width:100%;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-012"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000
const ISO = /^\d{4}-\d{2}-\d{2}$/

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

// Неделя с понедельника: getDay() отдаёт воскресенье нулём, и без сдвига
// сетка съезжает на день.
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(first.getTime() - mondayIndex(first) * DAY)

  // Шесть строк всегда: месяц переменной высоты дёргает раскладку под собой.
  return Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )
}

// Стрелки водят фокус по сетке. Без них до нужного дня приходится жать Tab
// столько раз, сколько до него дней: сорок две кнопки подряд в табуляции.
function moveFocus(event: KeyboardEvent<HTMLElement>, columns: number) {
  const steps: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -columns,
    ArrowDown: columns,
  }
  const step = steps[event.key]

  if (step === undefined) {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[data-part="day"]',
    ),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from < 0 || !buttons[from + step]) {
    return
  }

  event.preventDefault()
  buttons[from + step].focus()
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
 * Дата и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за опечатки в значении: Intl бросает RangeError и на Invalid Date,
 * и на нераспознанной локали, а это белый экран вместо всего сайта.
 */
function safeDate(value: string, fallback: string) {
  return ISO.test(value) &&
    !Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? value
    : fallback
}

function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/**
 * Поле даты с собственной месячной сеткой под ним.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date012({
  open = false,
  label = "Дата встречи",
  defaultValue: defaultValueProp = "2026-09-16",
  name = "meeting-date",
  locale: localeProp = "ru-RU",
  hint = "Дату можно набрать в поле или выбрать в календаре.",
  openLabel = "Открыть календарь",
  previousLabel = "Предыдущий месяц",
  nextLabel = "Следующий месяц",
  todayLabel = "Сегодня",
  accent,
  background = "",
  className,
  style,
  ...props
}: Date012Props) {
  const defaultValue = safeDate(defaultValueProp, "2026-09-16")
  const locale = safeLocale(localeProp, "ru-RU")
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  const panelId = `vibeui-date-012-${uid}`
  const anchorName = `--vibeui-date-012-${uid.slice(-8)}`
  const panel = useRef<HTMLDivElement>(null)

  const [selected, setSelected] = useState(defaultValue)
  const [draft, setDraft] = useState(defaultValue)
  const [expanded, setExpanded] = useState(open)
  const [cursor, setCursor] = useState(() => {
    const [year, month] = defaultValue.split("-").map(Number)
    return { year, month: month - 1 }
  })

  const days = useMemo(
    () => buildGrid(cursor.year, cursor.month),
    [cursor.month, cursor.year],
  )

  const titles = useMemo(() => {
    const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" })
    const month = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    })

    return {
      weekdays: days.slice(0, 7).map((date) => weekday.format(date)),
      month: month.format(new Date(cursor.year, cursor.month, 1)),
      full: new Intl.DateTimeFormat(locale, { dateStyle: "long" }),
    }
  }, [cursor.month, cursor.year, days, locale])

  const palette = {
    ...(accent ? { "--vibeui-date-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-date-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const today = iso(new Date())
  // Ровно одна кнопка сетки участвует в табуляции: выбранный день, а если он
  // в другом месяце — первое число показанного.
  const stop = days.some((date) => iso(date) === selected)
    ? selected
    : iso(new Date(cursor.year, cursor.month, 1))

  const shift = (delta: number) => {
    const next = new Date(cursor.year, cursor.month + delta, 1)
    setCursor({ year: next.getFullYear(), month: next.getMonth() })
  }

  // Выбор возвращает дату в поле и закрывает панель: календарь здесь —
  // второй способ заполнить поле, а не отдельный экран.
  const pick = (date: Date) => {
    const value = iso(date)
    setSelected(value)
    setDraft(value)
    setCursor({ year: date.getFullYear(), month: date.getMonth() })

    if (panel.current?.matches(":popover-open")) {
      panel.current.hidePopover()
    }
  }

  // Набранное с клавиатуры подхватывается сеткой, но только когда строка
  // дописана до конца: иначе месяц прыгает на каждой цифре.
  const type = (value: string) => {
    setDraft(value)

    if (
      !ISO.test(value) ||
      Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ) {
      return
    }

    const [year, month] = value.split("-").map(Number)
    setSelected(value)
    setCursor({ year, month: month - 1 })
  }

  return (
    <>
      <style href="vibeui-date-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="date-selector"
        data-vibeui-block="date-012"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={`${panelId}-input`}>
          {label}
        </label>

        <div data-part="row">
          <input
            id={`${panelId}-input`}
            name={name}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            placeholder="ГГГГ-ММ-ДД"
            value={draft}
            aria-describedby={hint ? `${panelId}-hint` : undefined}
            onChange={(event) => type(event.target.value)}
          />
          <button
            type="button"
            data-part="trigger"
            popoverTarget={panelId}
            aria-label={openLabel}
            aria-haspopup="dialog"
            aria-expanded={expanded}
            aria-controls={panelId}
            style={{ anchorName } as CSSProperties}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M3 10h18M8 3v4M16 3v4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {hint ? (
          <p id={`${panelId}-hint`} data-part="hint">
            {hint}
          </p>
        ) : null}

        <div
          ref={panel}
          id={panelId}
          data-part="panel"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="dialog"
          aria-label={label}
          style={{ positionAnchor: anchorName } as CSSProperties}
          onToggle={(event) =>
            setExpanded(event.currentTarget.matches(":popover-open"))
          }
        >
          <div data-part="head">
            <span data-part="month">{titles.month}</span>
            <span data-part="nav">
              <button
                type="button"
                aria-label={previousLabel}
                onClick={() => shift(-1)}
              >
                <span data-part="arrow" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={nextLabel}
                onClick={() => shift(1)}
              >
                <span data-part="arrow" data-dir="next" aria-hidden="true" />
              </button>
            </span>
          </div>

          <table>
            <thead>
              <tr>
                {titles.weekdays.map((day) => (
                  <th key={day} scope="col" abbr={day}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody onKeyDown={(event) => moveFocus(event, 7)}>
              {Array.from({ length: 6 }, (_, row) => (
                <tr key={row}>
                  {days.slice(row * 7, row * 7 + 7).map((date) => {
                    const value = iso(date)

                    return (
                      <td key={value}>
                        <button
                          type="button"
                          data-part="day"
                          tabIndex={value === stop ? 0 : -1}
                          aria-pressed={value === selected}
                          aria-label={
                            value === today
                              ? `${titles.full.format(date)}, ${todayLabel}`
                              : titles.full.format(date)
                          }
                          data-outside={date.getMonth() !== cursor.month}
                          data-today={value === today}
                          onClick={() => pick(date)}
                        >
                          {date.getDate()}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div data-part="foot">
            <span>{titles.full.format(new Date(`${selected}T00:00:00`))}</span>
            <button
              type="button"
              data-part="today"
              onClick={() => pick(new Date())}
            >
              {todayLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
