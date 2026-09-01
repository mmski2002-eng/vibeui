"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Cascader010Person = {
  label: string
  role: string
}

export type Cascader010Team = {
  label: string
  children: Cascader010Person[]
}

export type Cascader010Unit = {
  label: string
  children: Cascader010Team[]
}

export type Cascader010Props = {
  heading?: string
  units?: Cascader010Unit[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: оргструктура тремя лентами вместо колонок. Отдел, команда
// и человек лежат в отдельных горизонтальных рядах с подписями уровней —
// такой каскад читается слева направо и не требует высоты под три списка.
// Ряд ниже перерисовывается при смене ряда выше, а выбранный человек уезжает
// в карточку внизу: одна пилюля не вмещает роль и почту.
const STYLES = `
:where([data-vibeui-block="cascader-010"]){
--vibeui-cascader-010-bg:oklch(1 0 0);
--vibeui-cascader-010-fg:oklch(0.23 0.014 300);
--vibeui-cascader-010-muted:oklch(0.55 0.012 300);
--vibeui-cascader-010-border:oklch(0.9 0.006 300);
--vibeui-cascader-010-accent:oklch(0.54 0.18 320);
--vibeui-cascader-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="cascader-010"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:25rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-cascader-010-bg);color:var(--vibeui-cascader-010-fg);
border:1px solid var(--vibeui-cascader-010-border);border-radius:1rem;
font-family:var(--vibeui-cascader-010-font);
box-shadow:0 18px 40px -32px oklch(0.2 0.03 300 / 55%);
}
[data-vibeui-block="cascader-010"] *{box-sizing:border-box}
[data-vibeui-block="cascader-010"] [data-part="heading"]{
margin:0;font-size:0.8125rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="cascader-010"] [data-part="rail"]{
display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="cascader-010"] [data-part="rail-name"]{
font-size:0.625rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-cascader-010-muted);
}
[data-vibeui-block="cascader-010"] [data-part="chips"]{
display:flex;gap:0.3125rem;margin:0;padding:0 0 0.125rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin;
}
[data-vibeui-block="cascader-010"] [data-part="chip"]{
flex:0 0 auto;padding:0.3125rem 0.625rem;border-radius:999px;cursor:pointer;
border:1px solid var(--vibeui-cascader-010-border);
background:transparent;color:var(--vibeui-cascader-010-muted);
font:inherit;font-size:0.75rem;white-space:nowrap;
transition:border-color .14s ease,background-color .14s ease,color .14s ease;
}
[data-vibeui-block="cascader-010"] [data-part="chip"]:hover{
color:var(--vibeui-cascader-010-fg);border-color:var(--vibeui-cascader-010-accent);
}
[data-vibeui-block="cascader-010"] [data-part="chip"]:focus-visible{
outline:2px solid var(--vibeui-cascader-010-accent);outline-offset:2px;
}
[data-vibeui-block="cascader-010"] [data-part="chip"][aria-pressed="true"]{
color:oklch(1 0 0);font-weight:600;
background:var(--vibeui-cascader-010-accent);
border-color:var(--vibeui-cascader-010-accent);
}
[data-vibeui-block="cascader-010"] [data-part="card"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.625rem;border-radius:0.875rem;
border:1px solid var(--vibeui-cascader-010-border);
background:color-mix(in oklab,var(--vibeui-cascader-010-accent) 7%,transparent);
}
[data-vibeui-block="cascader-010"] [data-part="initials"]{
flex:0 0 auto;display:grid;place-items:center;width:2.25rem;height:2.25rem;
border-radius:50%;background:var(--vibeui-cascader-010-accent);color:oklch(1 0 0);
font-size:0.75rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="cascader-010"] [data-part="who"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="cascader-010"] [data-part="who-name"]{
display:block;font-size:0.8125rem;font-weight:650;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-010"] [data-part="who-path"]{
display:block;font-size:0.6875rem;line-height:1.35;
color:var(--vibeui-cascader-010-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="cascader-010"] [data-part="placeholder"]{
margin:0;padding:0.875rem 0.625rem;border-radius:0.875rem;text-align:center;
border:1px dashed var(--vibeui-cascader-010-border);
font-size:0.75rem;color:var(--vibeui-cascader-010-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cascader-010"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_UNITS: Cascader010Unit[] = [
  {
    label: "Разработка",
    children: [
      {
        label: "Платформа",
        children: [
          { label: "Ирина Кольцова", role: "Тимлид" },
          { label: "Марк Дёмин", role: "Бэкенд-инженер" },
        ],
      },
      {
        label: "Интерфейсы",
        children: [
          { label: "Аня Петрова", role: "Фронтенд-инженер" },
          { label: "Лев Гринёв", role: "Дизайн-инженер" },
        ],
      },
    ],
  },
  {
    label: "Продукт",
    children: [
      {
        label: "Аналитика",
        children: [
          { label: "Софья Ким", role: "Продуктовый аналитик" },
          { label: "Тимур Асланов", role: "Дата-инженер" },
        ],
      },
      {
        label: "Исследования",
        children: [{ label: "Даша Рогова", role: "UX-исследователь" }],
      },
    ],
  },
  {
    label: "Поддержка",
    children: [
      {
        label: "Первая линия",
        children: [
          { label: "Олег Сомов", role: "Специалист поддержки" },
          { label: "Рита Ляшко", role: "Специалист поддержки" },
        ],
      },
    ],
  },
]

function initialsOf(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Оргструктура каскадом из трёх лент: отдел, команда, человек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Cascader010({
  heading = "Кому назначить задачу",
  units = DEFAULT_UNITS,
  accent,
  className,
  style,
}: Cascader010Props) {
  const [unit, setUnit] = useState(0)
  const [team, setTeam] = useState(0)
  const [person, setPerson] = useState<number | null>(0)

  const teams = units[unit]?.children ?? []
  const people = teams[team]?.children ?? []
  const chosen = person === null ? null : people[person]

  const palette = {
    ...(accent ? { "--vibeui-cascader-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cascader-010" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="cascader-010"
        className={className}
        style={palette}
      >
        <p data-part="heading">{heading}</p>
        <div data-part="rail">
          <span data-part="rail-name">Отдел</span>
          <ul data-part="chips">
            {units.map((item, index) => (
              <li key={item.label}>
                <button
                  data-part="chip"
                  type="button"
                  aria-pressed={index === unit}
                  onClick={() => {
                    setUnit(index)
                    setTeam(0)
                    setPerson(null)
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div data-part="rail">
          <span data-part="rail-name">Команда</span>
          <ul data-part="chips">
            {teams.map((item, index) => (
              <li key={item.label}>
                <button
                  data-part="chip"
                  type="button"
                  aria-pressed={index === team}
                  onClick={() => {
                    setTeam(index)
                    setPerson(null)
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div data-part="rail">
          <span data-part="rail-name">Человек</span>
          <ul data-part="chips">
            {people.map((item, index) => (
              <li key={item.label}>
                <button
                  data-part="chip"
                  type="button"
                  aria-pressed={index === person}
                  onClick={() => setPerson(index)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {chosen ? (
          <div data-part="card" aria-live="polite">
            <span data-part="initials" aria-hidden="true">
              {initialsOf(chosen.label)}
            </span>
            <span data-part="who">
              <strong data-part="who-name">{chosen.label}</strong>
              <span data-part="who-path">
                {chosen.role} · {units[unit].label} / {teams[team].label}
              </span>
            </span>
          </div>
        ) : (
          <p data-part="placeholder" aria-live="polite">
            Выберите человека в третьей ленте
          </p>
        )}
      </div>
    </>
  )
}
