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
  /** Названия каналов по идентификатору. */
  channelNameText?: Record<string, string>
  /** Пояснения под названиями каналов. */
  channelAboutText?: Record<string, string>
  /** Итог с подстановками {selected} и {total}. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный выбор каналов широкими карточками-тумблерами.
// Пояснение под названием привязано через aria-describedby, а не вложено в имя
// кнопки: иначе скринридер читает «Push-уведомления приходят на телефон даже
// при закрытом приложении, нажато» — одной фразой без пауз.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель темнеет, а границы становятся светлее фона.
const STYLES = `
:where([data-vibeui-block="togglegroup-006"]){
--vibeui-togglegroup-006-bg:transparent;
--vibeui-togglegroup-006-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-togglegroup-006-muted:light-dark(oklch(0.55 0.014 265),oklch(0.68 0.012 265));
--vibeui-togglegroup-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-togglegroup-006-surface:light-dark(oklch(0.97 0.004 265),oklch(0.26 0.01 265));
--vibeui-togglegroup-006-raised:light-dark(oklch(1 0 0),oklch(0.29 0.01 265));
--vibeui-togglegroup-006-accent:light-dark(oklch(0.55 0.17 275),oklch(0.74 0.15 275));
--vibeui-togglegroup-006-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.02 275));
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
background:var(--vibeui-togglegroup-006-raised);color:var(--vibeui-togglegroup-006-fg);
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
background:color-mix(in oklab,var(--vibeui-togglegroup-006-accent) 7%,var(--vibeui-togglegroup-006-raised));
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
color:var(--vibeui-togglegroup-006-accent-fg);
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

const CHANNELS = ["push", "email", "sms", "telegram"]

const CHANNEL_NAME_TEXT: Record<string, string> = {
  push: "Push",
  email: "Почта",
  sms: "SMS",
  telegram: "Telegram",
}

const CHANNEL_ABOUT_TEXT: Record<string, string> = {
  push: "Приходят на телефон даже при закрытом приложении",
  email: "Письмо с разбором событий раз в день",
  sms: "Только для срочного: списание и вход в аккаунт",
  telegram: "Сообщения от бота в личные",
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
 * Множественный выбор каналов уведомлений карточками-тумблерами: пояснение
 * привязано через aria-describedby. Один файл, ноль зависимостей.
 */
export function Togglegroup006({
  label = "Куда присылать уведомления",
  emptyNote = "Ни один канал не выбран — уведомления не придут.",
  defaultValue = ["push", "email"],
  channelNameText = CHANNEL_NAME_TEXT,
  channelAboutText = CHANNEL_ABOUT_TEXT,
  countText = "Каналов выбрано: {selected} из {total}.",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Togglegroup006Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const prefix = useId()

  const palette = {
    ...(accent ? { "--vibeui-togglegroup-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-togglegroup-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
              key={channel}
              type="button"
              aria-pressed={value.includes(channel)}
              aria-label={
                channelNameText[channel] ?? CHANNEL_NAME_TEXT[channel]
              }
              aria-describedby={`${prefix}-${channel}`}
              onClick={() => toggle(channel)}
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
                <span data-part="name">
                  {channelNameText[channel] ?? CHANNEL_NAME_TEXT[channel]}
                </span>
                <span data-part="about" id={`${prefix}-${channel}`}>
                  {channelAboutText[channel] ?? CHANNEL_ABOUT_TEXT[channel]}
                </span>
              </span>
            </button>
          ))}
        </div>
        <p data-part="summary" role="status">
          {value.length === 0
            ? emptyNote
            : countText
                .replace("{selected}", String(value.length))
                .replace("{total}", String(CHANNELS.length))}
        </p>
      </section>
    </>
  )
}
