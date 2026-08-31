"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Togglegroup006Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onChange"
> & {
  label?: string
  emptyNote?: string
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: множественный выбор каналов широкими карточками-тумблерами.
// Пояснение под названием привязано через aria-describedby, а не вложено в имя
// кнопки: иначе скринридер читает «Push-уведомления приходят на телефон даже
// при закрытом приложении, нажато» — одной фразой без пауз.
const STYLES = `
:where([data-vibeui-block="togglegroup-006"]){
--vibeui-togglegroup-006-bg:oklch(1 0 0);
--vibeui-togglegroup-006-fg:oklch(0.22 0.014 265);
--vibeui-togglegroup-006-muted:oklch(0.55 0.014 265);
--vibeui-togglegroup-006-border:oklch(0.9 0.006 265);
--vibeui-togglegroup-006-surface:oklch(0.97 0.004 265);
--vibeui-togglegroup-006-accent:oklch(0.55 0.17 275);
--vibeui-togglegroup-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="togglegroup-006"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:25rem;padding:0.875rem;
border:1px solid var(--vibeui-togglegroup-006-border);border-radius:0.875rem;
background:var(--vibeui-togglegroup-006-bg);color:var(--vibeui-togglegroup-006-fg);
font-family:var(--vibeui-togglegroup-006-font);
}
[data-vibeui-block="togglegroup-006"] *{box-sizing:border-box}
[data-vibeui-block="togglegroup-006"] h3{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="togglegroup-006"] [data-part="group"]{
display:grid;grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr));gap:0.5rem;
}
[data-vibeui-block="togglegroup-006"] button{
appearance:none;cursor:pointer;font:inherit;text-align:left;
display:flex;align-items:flex-start;gap:0.5rem;
padding:0.625rem;
border:1px solid var(--vibeui-togglegroup-006-border);border-radius:0.75rem;
background:var(--vibeui-togglegroup-006-bg);color:var(--vibeui-togglegroup-006-fg);
transition:border-color .15s ease,background-color .15s ease,box-shadow .15s ease;
}
[data-vibeui-block="togglegroup-006"] button:hover{background:var(--vibeui-togglegroup-006-surface)}
[data-vibeui-block="togglegroup-006"] button:focus-visible{
outline:2px solid var(--vibeui-togglegroup-006-accent);outline-offset:2px;
}
/* Выбор рисуется вложенной обводкой, а не толстой рамкой: толщина границы
   меняла бы внутренний размер карточки, и сетка дёргалась бы на каждый клик. */
[data-vibeui-block="togglegroup-006"] button[aria-pressed="true"]{
border-color:var(--vibeui-togglegroup-006-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-togglegroup-006-accent);
background:color-mix(in oklab,var(--vibeui-togglegroup-006-accent) 7%,white);
}
[data-vibeui-block="togglegroup-006"] [data-part="mark"]{
flex:none;width:1.125rem;height:1.125rem;margin-top:0.0625rem;border-radius:0.375rem;
border:1.5px solid var(--vibeui-togglegroup-006-border);
display:inline-flex;align-items:center;justify-content:center;
color:transparent;
}
[data-vibeui-block="togglegroup-006"] button[aria-pressed="true"] [data-part="mark"]{
background:var(--vibeui-togglegroup-006-accent);
border-color:var(--vibeui-togglegroup-006-accent);
color:oklch(0.99 0 0);
}
[data-vibeui-block="togglegroup-006"] [data-part="mark"] svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="togglegroup-006"] [data-part="name"]{
display:block;font-size:0.8125rem;font-weight:650;line-height:1.25;
}
[data-vibeui-block="togglegroup-006"] [data-part="about"]{
display:block;margin-top:0.1875rem;font-size:0.6875rem;line-height:1.35;
color:var(--vibeui-togglegroup-006-muted);
}
[data-vibeui-block="togglegroup-006"] [data-part="summary"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-togglegroup-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="togglegroup-006"] *{animation:none!important;transition:none!important}}
`

const CHANNELS = [
  {
    id: "push",
    name: "Push",
    about: "Приходят на телефон даже при закрытом приложении",
  },
  { id: "email", name: "Почта", about: "Письмо с разбором событий раз в день" },
  {
    id: "sms",
    name: "SMS",
    about: "Только для срочного: списание и вход в аккаунт",
  },
  { id: "telegram", name: "Telegram", about: "Сообщения от бота в личные" },
]

/**
 * Множественный выбор каналов уведомлений карточками-тумблерами: пояснение
 * привязано через aria-describedby. Один файл, ноль зависимостей.
 */
export function Togglegroup006({
  label = "Куда присылать уведомления",
  emptyNote = "Ни один канал не выбран — уведомления не придут.",
  defaultValue = ["push", "email"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Togglegroup006Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const prefix = useId()

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const toggle = (id: string) => {
    const next = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id]

    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-togglegroup-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="togglegroup-006"
        className={className}
        style={palette}
      >
        <h3>{label}</h3>
        <div data-part="group" role="group" aria-label={label}>
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              type="button"
              aria-pressed={value.includes(channel.id)}
              aria-label={channel.name}
              aria-describedby={`${prefix}-${channel.id}`}
              onClick={() => toggle(channel.id)}
            >
              <span data-part="mark" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.2 4.7 8.4 9.5 3.6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <span data-part="name">{channel.name}</span>
                <span data-part="about" id={`${prefix}-${channel.id}`}>
                  {channel.about}
                </span>
              </span>
            </button>
          ))}
        </div>
        <p data-part="summary" role="status">
          {value.length === 0
            ? emptyNote
            : `Каналов выбрано: ${value.length} из ${CHANNELS.length}.`}
        </p>
      </section>
    </>
  )
}
