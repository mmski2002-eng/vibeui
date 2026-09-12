"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input007Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: string
  scheme?: string
  placeholder?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, поле лежит прямо на фоне страницы. */
  background?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: адрес сайта почти никто не набирает со схемой, а сервер
// без неё ссылку не примет. Поле дописывает схему само по уходу из фокуса и
// сразу показывает разобранный результат — домен отдельно, путь отдельно,
// чтобы было видно, что именно уедет на сервер. Схема не подставляется в
// значение заранее: пока в поле пусто, дописывать нечего.
const STYLES = `
:where([data-vibeui-block="input-007"]){
--vibeui-input-007-surface:transparent;
--vibeui-input-007-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-input-007-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-007-muted:color-mix(in oklab,var(--vibeui-input-007-fg) 68%,transparent);
--vibeui-input-007-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-input-007-border:light-dark(oklch(0.88 0 265),oklch(0.42 0 265));
--vibeui-input-007-accent:light-dark(oklch(0.28 0 0),oklch(0.91 0 0));
--vibeui-input-007-bad:light-dark(oklch(0.55 0.2 25),oklch(0.74 0.17 25));
--vibeui-input-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-input-007-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-007"]{color-scheme:dark}
[data-vibeui-block="input-007"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;
font-family:var(--vibeui-input-007-font);color:var(--vibeui-input-007-fg);
}
/* Подложка появляется только вместе с пропом background: без него поле
   лежит прямо на фоне страницы. */
[data-vibeui-block="input-007"][data-surface="on"]{
padding:0.875rem;
background:var(--vibeui-input-007-surface);
border:1px solid var(--vibeui-input-007-shell);border-radius:0.875rem;
}
[data-vibeui-block="input-007"] *{box-sizing:border-box}
[data-vibeui-block="input-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-007"] [data-part="frame"]{
display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-007-field);
border:1px solid var(--vibeui-input-007-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-007"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-007-accent) 18%,transparent);
}
[data-vibeui-block="input-007"] [data-part="globe"]{flex:none;color:var(--vibeui-input-007-muted)}
[data-vibeui-block="input-007"] [data-part="globe"] svg{width:1rem;height:1rem;display:block}
[data-vibeui-block="input-007"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-007"] input:focus{outline:none}
/* Разбор адреса — не подсказка, а зеркало: показываем ровно ту строку,
   которая уйдёт в форму, разложенную на части. */
[data-vibeui-block="input-007"] [data-part="parsed"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.125rem;
min-height:1.125rem;
font-family:var(--vibeui-input-007-mono);font-size:0.75rem;line-height:1.5;
word-break:break-all;
}
[data-vibeui-block="input-007"] [data-part="scheme"]{color:var(--vibeui-input-007-accent);font-weight:600}
[data-vibeui-block="input-007"] [data-part="host"]{color:var(--vibeui-input-007-fg);font-weight:600}
[data-vibeui-block="input-007"] [data-part="rest"]{color:var(--vibeui-input-007-muted)}
[data-vibeui-block="input-007"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-007-muted);
}
[data-vibeui-block="input-007"] [data-part="note"][data-tone="bad"]{color:var(--vibeui-input-007-bad)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-007"] *{animation:none!important;transition:none!important}}
`

const TEXT = {
  bad: "В домене нет точки — проверьте адрес.",
  calm: "Схему {scheme}:// допишем сами, набирать её не нужно.",
}

function withScheme(value: string, scheme: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `${scheme}://${trimmed}`
}

// Разбор без URL(): конструктор бросает исключение на половине состояний
// набора, а поле обязано показывать что-то осмысленное на каждом символе.
function split(value: string) {
  const match = value.match(/^([a-z][a-z0-9+.-]*:\/\/)([^/?#]*)(.*)$/i)
  if (!match) return null
  return { scheme: match[1], host: match[2], rest: match[3] }
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
 * Поле адреса сайта: схема дописывается по уходу из фокуса, разбор виден рядом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input007({
  label = "Ссылка на сайт",
  defaultValue = "vibeui.ru/components",
  scheme = "https",
  placeholder = "example.com/page",
  text,
  background = "",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input007Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const copy = { ...TEXT, ...text }

  const palette = {
    ...(accent ? { "--vibeui-input-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const full = withScheme(value, scheme)
  const parts = split(full)
  const bad = Boolean(value.trim()) && (!parts || !parts.host.includes("."))

  return (
    <>
      <style href="vibeui-input-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-007"
        data-surface={background ? "on" : undefined}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <span data-part="globe" aria-hidden="true">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M2 8h12M8 2c1.8 2 1.8 10 0 12M8 2C6.2 4 6.2 12 8 14" />
            </svg>
          </span>
          <input
            id={id}
            type="url"
            inputMode="url"
            spellCheck={false}
            autoCapitalize="none"
            placeholder={placeholder}
            value={value}
            aria-invalid={bad}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(withScheme(event.target.value, scheme))
            }}
            onBlur={() => {
              const next = withScheme(value, scheme)
              setValue(next)
              onChange?.(next)
            }}
          />
        </div>
        <p data-part="parsed" aria-live="polite">
          {parts ? (
            <>
              <span data-part="scheme">{parts.scheme}</span>
              <span data-part="host">{parts.host}</span>
              <span data-part="rest">{parts.rest}</span>
            </>
          ) : (
            <span data-part="rest">{scheme}://…</span>
          )}
        </p>
        <p data-part="note" id={`${id}-note`} data-tone={bad ? "bad" : "calm"}>
          {bad ? copy.bad : copy.calm.replace("{scheme}", scheme)}
        </p>
      </div>
    </>
  )
}
