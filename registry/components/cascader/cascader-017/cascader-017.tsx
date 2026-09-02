"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Cascader017Speciality = {
  name: string
  doctors: number
  nearest?: string
}

export type Cascader017Branch = {
  name: string
  specialities: Cascader017Speciality[]
}

export type Cascader017Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onSelect"
> & {
  label?: string
  branches?: Cascader017Branch[]
  defaultBranch?: string
  defaultSpeciality?: string
  /** Подпись строки фишек для скринридера. */
  branchesLabel?: string
  /** Подсказка в поле поиска. */
  searchPlaceholder?: string
  /** Подпись поля поиска, {branch} — текущее направление. */
  searchLabel?: string
  /** Подпись списка специальностей, {branch} — текущее направление. */
  listLabel?: string
  /** Строка вместо списка, когда поиск ничего не нашёл. */
  emptyText?: string
  /** Подпись специальности без свободных врачей. */
  noDoctorsText?: string
  /** Три формы слова «врач» для числа врачей. */
  doctorsForms?: [string, string, string]
  /** Часть строки о ближайшем приёме, {date} — время из справочника. */
  nearestText?: string
  /** Итог, {path} — направление и специальность. */
  footText?: string
  /** Итог, пока специальность не выбрана. */
  footEmptyText?: string
  onSelect?: (branch: string, speciality: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: специальностей в клинике под сотню, и человек редко
// знает нужную точно — он знает «взрослым» и «что-то с сердцем». Поэтому
// верхний уровень стоит фишками (их всегда три-четыре), а нижний остаётся
// списком с фильтром по названию. У каждой специальности видно число врачей
// и ближайший приём: специальность без свободных врачей выбрать нельзя.
const STYLES = `
:where([data-vibeui-block="cascader-017"]){
--vibeui-cascader-017-bg:transparent;
--vibeui-cascader-017-fg:light-dark(oklch(0.22 0.014 190),oklch(0.94 0.006 190));
--vibeui-cascader-017-muted:light-dark(oklch(0.55 0.014 190),oklch(0.71 0.012 190));
--vibeui-cascader-017-faint:light-dark(oklch(0.75 0.01 190),oklch(0.54 0.012 190));
--vibeui-cascader-017-border:light-dark(oklch(0.9 0.008 190),oklch(0.35 0.012 190));
--vibeui-cascader-017-field:light-dark(oklch(0.985 0.004 190),oklch(0.27 0.012 190));
--vibeui-cascader-017-soft:light-dark(oklch(0.965 0.008 190),oklch(0.29 0.012 190));
--vibeui-cascader-017-onaccent:light-dark(oklch(1 0 0),oklch(0.2 0.02 190));
--vibeui-cascader-017-accent:light-dark(oklch(0.47 0.1 190),oklch(0.75 0.11 190));
--vibeui-cascader-017-accentsoft:light-dark(oklch(0.93 0.045 190),oklch(0.32 0.05 190));
--vibeui-cascader-017-radius:0.625rem;
--vibeui-cascader-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-017"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-017-bg);
border:1px solid var(--vibeui-cascader-017-border);
border-radius:calc(var(--vibeui-cascader-017-radius) + 0.25rem);
color:var(--vibeui-cascader-017-fg);
font-family:var(--vibeui-cascader-017-font);
}
[data-vibeui-block="cascader-017"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-017"] [data-part="branches"]{
display:flex;flex-wrap:wrap;gap:0.3rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="cascader-017"] [data-part="branch"]{
appearance:none;cursor:pointer;font:inherit;
padding:0.3rem 0.7rem;border-radius:999px;
border:1px solid var(--vibeui-cascader-017-border);
background:transparent;color:var(--vibeui-cascader-017-muted);
font-size:0.78rem;font-weight:600;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="cascader-017"] [data-part="branch"][aria-pressed="true"]{
background:var(--vibeui-cascader-017-accent);border-color:transparent;
color:var(--vibeui-cascader-017-onaccent);
}
[data-vibeui-block="cascader-017"] [data-part="branch"]:focus-visible,
[data-vibeui-block="cascader-017"] [data-part="row"]:focus-visible{
outline:2px solid var(--vibeui-cascader-017-accent);outline-offset:2px;
}
[data-vibeui-block="cascader-017"] input{
box-sizing:border-box;width:100%;height:2.35rem;padding:0 0.6rem;
border:1px solid var(--vibeui-cascader-017-border);
border-radius:var(--vibeui-cascader-017-radius);
background:var(--vibeui-cascader-017-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="cascader-017"] input::placeholder{color:var(--vibeui-cascader-017-muted)}
[data-vibeui-block="cascader-017"] input:focus-visible{
outline:2px solid var(--vibeui-cascader-017-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="cascader-017"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:12.5rem;overflow:auto;
border:1px solid var(--vibeui-cascader-017-border);
border-radius:var(--vibeui-cascader-017-radius);
}
[data-vibeui-block="cascader-017"] [data-part="row"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;flex-direction:column;gap:0.1rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-block="cascader-017"] [data-part="row"]:hover:not(:disabled){background:var(--vibeui-cascader-017-soft)}
[data-vibeui-block="cascader-017"] [data-part="row"][aria-pressed="true"]{
background:var(--vibeui-cascader-017-accentsoft);
}
[data-vibeui-block="cascader-017"] [data-part="row"]:disabled{cursor:not-allowed;color:var(--vibeui-cascader-017-faint)}
[data-vibeui-block="cascader-017"] [data-part="name"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="cascader-017"] [data-part="meta"]{font-size:0.7rem;color:var(--vibeui-cascader-017-muted)}
[data-vibeui-block="cascader-017"] [data-part="row"]:disabled [data-part="meta"]{color:inherit}
[data-vibeui-block="cascader-017"] [data-part="empty"]{
margin:0;padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-cascader-017-muted);
}
[data-vibeui-block="cascader-017"] [data-part="foot"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-cascader-017-muted);
}
[data-vibeui-block="cascader-017"] [data-part="foot"] b{color:var(--vibeui-cascader-017-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cascader-017"] *{animation:none!important;transition:none!important}}
`

const CLINIC: Cascader017Branch[] = [
  {
    name: "Взрослым",
    specialities: [
      { name: "Терапевт", doctors: 9, nearest: "сегодня, 18:20" },
      { name: "Кардиолог", doctors: 4, nearest: "завтра, 10:00" },
      { name: "Невролог", doctors: 3, nearest: "17 апреля" },
      { name: "Эндокринолог", doctors: 0 },
    ],
  },
  {
    name: "Детям",
    specialities: [
      { name: "Педиатр", doctors: 7, nearest: "сегодня, 16:40" },
      { name: "Детский лор", doctors: 2, nearest: "завтра, 09:30" },
      { name: "Детский хирург", doctors: 0 },
    ],
  },
  {
    name: "Стоматология",
    specialities: [
      { name: "Терапевт-стоматолог", doctors: 5, nearest: "завтра, 12:15" },
      { name: "Ортодонт", doctors: 2, nearest: "20 апреля" },
    ],
  },
]

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) return forms[2]
  if (ones === 1) return forms[0]
  if (ones > 1 && ones < 5) return forms[1]

  return forms[2]
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
 * Выбор специальности врача: направление фишками, специальность списком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader017({
  label = "Специальность врача",
  branches = CLINIC,
  defaultBranch = "Взрослым",
  defaultSpeciality = "Кардиолог",
  branchesLabel = "Направления",
  searchPlaceholder = "Найти специальность",
  searchLabel = "Поиск специальности в направлении «{branch}»",
  listLabel = "Специальности: {branch}",
  emptyText = "В этом направлении ничего не нашлось",
  noDoctorsText = "приём не ведётся",
  doctorsForms = ["врач", "врача", "врачей"],
  nearestText = "ближайший приём {date}",
  footText = "Запись: {path}",
  footEmptyText = "Специальность не выбрана",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Cascader017Props) {
  const id = useId()
  const [branch, setBranch] = useState(defaultBranch)
  const [speciality, setSpeciality] = useState(defaultSpeciality)
  const [query, setQuery] = useState("")

  const current = branches.find((entry) => entry.name === branch)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return (current?.specialities ?? []).filter((entry) =>
      entry.name.toLowerCase().includes(needle),
    )
  }, [query, current])

  const picked = current?.specialities.find(
    (entry) => entry.name === speciality,
  )

  const [footBefore, footAfter] = footText.split("{path}")

  const palette = {
    ...(accent ? { "--vibeui-cascader-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cascader-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-017" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="cascader-017"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{label}</h3>
        <ul data-part="branches" aria-label={branchesLabel}>
          {branches.map((entry) => (
            <li key={entry.name}>
              <button
                type="button"
                data-part="branch"
                aria-pressed={entry.name === branch}
                onClick={() => {
                  setBranch(entry.name)
                  setSpeciality("")
                  setQuery("")
                }}
              >
                {entry.name}
              </button>
            </li>
          ))}
        </ul>
        <input
          id={`${id}-search`}
          type="search"
          autoComplete="off"
          placeholder={searchPlaceholder}
          aria-label={searchLabel.replace("{branch}", branch)}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul data-part="list" aria-label={listLabel.replace("{branch}", branch)}>
          {matches.length === 0 ? (
            <li>
              <p data-part="empty">{emptyText}</p>
            </li>
          ) : (
            matches.map((entry) => (
              <li key={entry.name}>
                <button
                  type="button"
                  data-part="row"
                  disabled={entry.doctors === 0}
                  aria-pressed={entry.name === speciality}
                  onClick={() => {
                    setSpeciality(entry.name)
                    onSelect?.(branch, entry.name)
                  }}
                >
                  <span data-part="name">{entry.name}</span>
                  <span data-part="meta">
                    {entry.doctors === 0
                      ? noDoctorsText
                      : `${entry.doctors} ${pluralize(entry.doctors, doctorsForms)} · ${nearestText.replace("{date}", entry.nearest ?? "")}`}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <p data-part="foot" aria-live="polite">
          {picked ? (
            <>
              {footBefore}
              <b>
                {branch} · {picked.name}
              </b>
              {footAfter}
            </>
          ) : (
            footEmptyText
          )}
        </p>
      </section>
    </>
  )
}
