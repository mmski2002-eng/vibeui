"use client"

import { useEffect, useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input020Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  prefix?: string
  defaultValue?: string
  taken?: string[]
  onChange?: (slug: string) => void
  /** Подсказка в пустом поле. */
  placeholder?: string
  /** Бейдж состояния: ключи idle, checking, taken, free. */
  badgeText?: Record<string, string>
  /** Строка под полем: ключи idle, checking, taken, free. */
  noteText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: проверка занятости имени с приставкой @ уже есть
// (input-014). Здесь другой вопрос — адрес рабочего пространства целиком:
// приставка не иконка, а часть будущей ссылки, поэтому под полем всегда
// виден собранный URL целиком, а бейдж «занято / свободно» стоит рядом
// с подписью одним словом, а не тремя значками внутри рамки.
const STYLES = `
:where([data-vibeui-block="input-020"]){
--vibeui-input-020-surface:transparent;
--vibeui-input-020-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-input-020-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-input-020-muted:color-mix(in oklab,var(--vibeui-input-020-fg) 68%,transparent);
--vibeui-input-020-field:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
--vibeui-input-020-border:light-dark(oklch(0.88 0 265),oklch(0.41 0 265));
--vibeui-input-020-chip:light-dark(oklch(0.95 0 265),oklch(0.33 0 265));
--vibeui-input-020-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-input-020-bad:light-dark(oklch(0.55 0.2 25),oklch(0.73 0.16 25));
--vibeui-input-020-ok:light-dark(oklch(0.48 0.13 155),oklch(0.76 0.13 155));
--vibeui-input-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-020"]{color-scheme:dark}
[data-vibeui-block="input-020"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-020-surface);
border:1px solid var(--vibeui-input-020-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-020-font);color:var(--vibeui-input-020-fg);
}
[data-vibeui-block="input-020"] *{box-sizing:border-box}
[data-vibeui-block="input-020"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="input-020"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-020"] [data-part="badge"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:999px;
font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;
background:var(--vibeui-input-020-chip);color:var(--vibeui-input-020-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="input-020"][data-state="taken"] [data-part="badge"]{color:var(--vibeui-input-020-bad);background:color-mix(in oklab,var(--vibeui-input-020-bad) 14%,transparent)}
[data-vibeui-block="input-020"][data-state="free"] [data-part="badge"]{color:var(--vibeui-input-020-ok);background:color-mix(in oklab,var(--vibeui-input-020-ok) 14%,transparent)}
[data-vibeui-block="input-020"] [data-part="frame"]{
display:flex;align-items:center;
height:2.5rem;
background:var(--vibeui-input-020-field);
border:1px solid var(--vibeui-input-020-border);border-radius:0.75rem;
overflow:hidden;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-020"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-020-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-020-accent) 18%,transparent);
}
[data-vibeui-block="input-020"][data-state="taken"] [data-part="frame"]{border-color:var(--vibeui-input-020-bad)}
[data-vibeui-block="input-020"][data-state="free"] [data-part="frame"]{border-color:var(--vibeui-input-020-ok)}
[data-vibeui-block="input-020"] [data-part="prefix"]{
flex:none;height:100%;display:flex;align-items:center;
padding-left:0.75rem;
color:var(--vibeui-input-020-muted);font-size:0.8125rem;
user-select:none;white-space:nowrap;
}
[data-vibeui-block="input-020"] input{
flex:1;min-width:0;height:100%;padding:0 0.75rem;
border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-020"] input:focus{outline:none}
[data-vibeui-block="input-020"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-020-muted);
}
[data-vibeui-block="input-020"] [data-part="note"] b{
color:var(--vibeui-input-020-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-020"] *{animation:none!important;transition:none!important}}
`

const TAKEN = ["studio", "design", "acme", "vibe"]

// Нормализация на вводе, а не на отправке: адрес слага должен совпадать
// с тем, что человек видит в превью ссылки.
function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .slice(0, 24)
}

const NOTE: Record<string, string> = {
  idle: "Минимум три символа: латиница, цифры, дефис.",
  checking: "Проверяем, свободен ли адрес…",
  taken: "Адрес занят — выберите другой.",
  free: "Адрес свободен, можно сохранять.",
}

const BADGE: Record<string, string> = {
  idle: "—",
  checking: "Проверяем",
  taken: "Занято",
  free: "Свободно",
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
 * Поле адреса рабочего пространства: проверка занятости с бейджем и живым
 * превью итоговой ссылки. Один файл, ноль зависимостей, собственная палитра.
 */
export function Input020({
  label = "Адрес рабочего пространства",
  prefix = "vibeui.ru/team/",
  defaultValue = "acme-studio",
  taken = TAKEN,
  onChange,
  placeholder = "acme-studio",
  badgeText = BADGE,
  noteText = NOTE,
  background = "",
  accent,
  className,
  style,
  ...props
}: Input020Props) {
  const id = useId()
  const [slug, setSlug] = useState(normalize(defaultValue))
  const [answer, setAnswer] = useState<{ slug: string; free: boolean } | null>(
    null,
  )

  // Ответ хранится вместе со слагом, к которому относится: пока ответ пришёл
  // не про то значение, что в поле, показывается «проверяем» — расхождение
  // невозможно по построению.
  const state =
    slug.length < 3
      ? "idle"
      : answer?.slug !== slug
        ? "checking"
        : answer.free
          ? "free"
          : "taken"

  useEffect(() => {
    if (slug.length < 3 || answer?.slug === slug) return

    const timer = window.setTimeout(() => {
      setAnswer({ slug, free: !taken.includes(slug) })
    }, 550)

    return () => window.clearTimeout(timer)
  }, [slug, answer, taken])

  const palette = {
    ...(accent ? { "--vibeui-input-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-020-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-020"
        data-state={state}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="badge">{badgeText[state] ?? BADGE[state]}</span>
        </div>
        <span data-part="frame">
          <span data-part="prefix" aria-hidden="true">
            {prefix}
          </span>
          <input
            id={id}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            placeholder={placeholder}
            value={slug}
            aria-invalid={state === "taken"}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = normalize(event.target.value)
              setSlug(next)
              onChange?.(next)
            }}
          />
        </span>
        <p data-part="note" id={`${id}-note`} role="status" aria-live="polite">
          <b>
            {prefix}
            {slug || "…"}
          </b>{" "}
          — {noteText[state] ?? NOTE[state]}
        </p>
      </div>
    </>
  )
}
