"use client"

import { useEffect, useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input020Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  prefix?: string
  defaultValue?: string
  taken?: string[]
  onChange?: (slug: string) => void
  accent?: string
}

// Идея компонента: проверка занятости имени с приставкой @ уже есть
// (input-014). Здесь другой вопрос — адрес рабочего пространства целиком:
// приставка не иконка, а часть будущей ссылки, поэтому под полем всегда
// виден собранный URL целиком, а бейдж «занято / свободно» стоит рядом
// с подписью одним словом, а не тремя значками внутри рамки.
const STYLES = `
:where([data-vibeui-block="input-020"]){
--vibeui-input-020-surface:oklch(1 0 0);
--vibeui-input-020-shell:oklch(0.91 0.006 265);
--vibeui-input-020-fg:oklch(0.23 0.014 265);
--vibeui-input-020-muted:oklch(0.56 0.014 265);
--vibeui-input-020-field:oklch(0.985 0.002 265);
--vibeui-input-020-border:oklch(0.88 0.008 265);
--vibeui-input-020-chip:oklch(0.95 0.005 265);
--vibeui-input-020-accent:oklch(0.55 0.17 265);
--vibeui-input-020-bad:oklch(0.55 0.2 25);
--vibeui-input-020-ok:oklch(0.48 0.13 155);
--vibeui-input-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
 * Поле адреса рабочего пространства: проверка занятости с бейджем и живым
 * превью итоговой ссылки. Один файл, ноль зависимостей, собственная палитра.
 */
export function Input020({
  label = "Адрес рабочего пространства",
  prefix = "vibeui.ru/team/",
  defaultValue = "acme-studio",
  taken = TAKEN,
  onChange,
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-input-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-020"
        data-state={state}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="badge">{BADGE[state]}</span>
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
            placeholder="acme-studio"
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
          — {NOTE[state]}
        </p>
      </div>
    </>
  )
}
