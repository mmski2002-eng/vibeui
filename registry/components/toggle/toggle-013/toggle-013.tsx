"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Toggle013Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  fieldLabel?: string
  defaultValue?: string
  defaultPressed?: boolean
  /** Подписи кнопки: ключи show и hide. Компонент несёт русские. */
  buttonText?: Record<string, string>
  /** Имена действия для скринридера: ключи show и hide. */
  actionText?: Record<string, string>
  /** Строка исхода: ключи visible и hidden. */
  statusText?: Record<string, string>
  onChange?: (visible: boolean) => void
  accent?: string
  /** Пусто — подложки у поля нет, оно лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: кнопка «показать пароль» стоит внутри поля, рядом с
// текстом, а не отдельно от него — aria-controls указывает на input, а
// живая строка снаружи объявляет исход для тех, кто не видит текст на экране.
const STYLES = `
:where([data-vibeui-block="toggle-013"]){
--vibeui-toggle-013-bg:transparent;
--vibeui-toggle-013-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-toggle-013-muted:color-mix(in oklab,var(--vibeui-toggle-013-fg) 68%,transparent);
--vibeui-toggle-013-border:light-dark(oklch(0.82 0 265),oklch(0.42 0 265));
--vibeui-toggle-013-accent:light-dark(oklch(0.56 0.16 255),oklch(0.74 0.15 255));
--vibeui-toggle-013-hover:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-toggle-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toggle-013"]{color-scheme:dark}
[data-vibeui-block="toggle-013"]{
box-sizing:border-box;display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:19rem;
font-family:var(--vibeui-toggle-013-font);color:var(--vibeui-toggle-013-fg);
}
[data-vibeui-block="toggle-013"] *{box-sizing:border-box}
[data-vibeui-block="toggle-013"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="toggle-013"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;
border:1px solid var(--vibeui-toggle-013-border);border-radius:0.625rem;
background:var(--vibeui-toggle-013-bg);padding:0 0.375rem 0 0.75rem;
}
[data-vibeui-block="toggle-013"] [data-part="row"]:focus-within{
border-color:var(--vibeui-toggle-013-accent);
box-shadow:0 0 0 3px color-mix(in oklch, var(--vibeui-toggle-013-accent) 22%, transparent);
}
[data-vibeui-block="toggle-013"] input{
appearance:none;border:none;outline:none;background:transparent;color:inherit;
flex:1;min-width:0;height:2.5rem;font:inherit;font-size:0.875rem;
letter-spacing:0.02em;
}
[data-vibeui-block="toggle-013"] button{
appearance:none;cursor:pointer;font:inherit;flex:none;
display:inline-flex;align-items:center;gap:0.375rem;
height:2rem;padding:0 0.625rem;border:none;border-radius:0.5rem;
background:transparent;color:var(--vibeui-toggle-013-muted);
font-size:0.75rem;font-weight:600;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="toggle-013"] button:hover{background:var(--vibeui-toggle-013-hover)}
[data-vibeui-block="toggle-013"] button:focus-visible{
outline:2px solid var(--vibeui-toggle-013-accent);outline-offset:2px;
}
[data-vibeui-block="toggle-013"] button[aria-pressed="true"]{color:var(--vibeui-toggle-013-accent)}
[data-vibeui-block="toggle-013"] svg{width:1rem;height:1rem}
[data-vibeui-block="toggle-013"] svg path,
[data-vibeui-block="toggle-013"] svg circle{
fill:none;stroke:currentColor;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round;
}
[data-vibeui-block="toggle-013"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-toggle-013-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toggle-013"] *{animation:none!important;transition:none!important}}
`

const BUTTON_TEXT: Record<string, string> = {
  show: "Показать",
  hide: "Скрыть",
}

const ACTION_TEXT: Record<string, string> = {
  show: "Показать пароль",
  hide: "Скрыть пароль",
}

const STATUS_TEXT: Record<string, string> = {
  visible: "Пароль виден",
  hidden: "Пароль скрыт",
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

/**
 * Поле пароля с кнопкой видимости внутри поля: aria-controls связывает
 * кнопку с input, живая строка объявляет исход. Один файл, ноль зависимостей.
 */
export function Toggle013({
  fieldLabel = "Пароль",
  defaultValue = "SuperSecret123",
  defaultPressed = false,
  buttonText = BUTTON_TEXT,
  actionText = ACTION_TEXT,
  statusText = STATUS_TEXT,
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Toggle013Props) {
  const [visible, setVisible] = useState(defaultPressed)
  const id = useId()
  const actionKey = visible ? "hide" : "show"
  const statusKey = visible ? "visible" : "hidden"

  const palette = {
    ...(accent ? { "--vibeui-toggle-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-toggle-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toggle-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toggle"
        data-vibeui-block="toggle-013"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{fieldLabel}</label>
        <div data-part="row">
          <input
            id={id}
            type={visible ? "text" : "password"}
            defaultValue={defaultValue}
            autoComplete="current-password"
          />
          <button
            type="button"
            aria-pressed={visible}
            aria-controls={id}
            aria-label={actionText[actionKey] ?? ACTION_TEXT[actionKey]}
            onClick={() => {
              setVisible(!visible)
              onChange?.(!visible)
            }}
          >
            {visible ? (
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 6l12 8M4 14 16 6M2 10s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 10s2.7-5 8-5 8 5 8 5-2.7 5-8 5-8-5-8-5Z" />
                <circle cx="10" cy="10" r="2.2" />
              </svg>
            )}
            {buttonText[actionKey] ?? BUTTON_TEXT[actionKey]}
          </button>
        </div>
        <p data-part="hint" role="status">
          {statusText[statusKey] ?? STATUS_TEXT[statusKey]}
        </p>
      </div>
    </>
  )
}
