"use client"

import { useEffect, useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input014Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  taken?: string[]
  onChange?: (handle: string) => void
  /** Подсказка в пустом поле. */
  placeholder?: string
  /**
   * Подсказка под полем по состоянию: idle, checking, taken, free.
   * В taken и free подставляется {handle}.
   */
  noteText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: если имя занято, мало сказать «занято» — надо дать
// свободное. Поле нормализует ввод на лету (нижний регистр, пробелы в дефис,
// лишние символы отбрасываются), через паузу спрашивает занятость и при отказе
// предлагает три свободных варианта кнопками. Приставка @ живёт вне поля,
// чтобы её нельзя было стереть или продублировать.
const STYLES = `
:where([data-vibeui-block="input-014"]){
--vibeui-input-014-surface:transparent;
--vibeui-input-014-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-input-014-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-input-014-muted:color-mix(in oklab,var(--vibeui-input-014-fg) 68%,transparent);
--vibeui-input-014-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.011 265));
--vibeui-input-014-border:light-dark(oklch(0.88 0.008 265),oklch(0.41 0.013 265));
--vibeui-input-014-accent:light-dark(oklch(0.55 0.17 250),oklch(0.74 0.15 250));
--vibeui-input-014-bad:light-dark(oklch(0.55 0.2 25),oklch(0.73 0.16 25));
--vibeui-input-014-ok:light-dark(oklch(0.48 0.13 155),oklch(0.76 0.13 155));
--vibeui-input-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-014"]{color-scheme:dark}
[data-vibeui-block="input-014"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-014-surface);
border:1px solid var(--vibeui-input-014-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-014-font);color:var(--vibeui-input-014-fg);
}
[data-vibeui-block="input-014"] *{box-sizing:border-box}
[data-vibeui-block="input-014"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-014"] [data-part="body"]{display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="input-014"] [data-part="frame"]{
display:flex;align-items:center;gap:0.25rem;
height:2.5rem;padding:0 0.75rem;
background:var(--vibeui-input-014-field);
border:1px solid var(--vibeui-input-014-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-014"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-014-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-014-accent) 18%,transparent);
}
[data-vibeui-block="input-014"] [data-state="taken"] [data-part="frame"]{border-color:var(--vibeui-input-014-bad)}
[data-vibeui-block="input-014"] [data-state="free"] [data-part="frame"]{border-color:var(--vibeui-input-014-ok)}
[data-vibeui-block="input-014"] [data-part="at"]{
flex:none;color:var(--vibeui-input-014-muted);font-size:0.875rem;user-select:none;
}
[data-vibeui-block="input-014"] input{
flex:1;min-width:0;height:100%;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="input-014"] input:focus{outline:none}
/* Индикатор — три состояния одного места: точки, крест, галочка. */
[data-vibeui-block="input-014"] [data-part="sign"]{
flex:none;width:1.125rem;height:1.125rem;display:grid;place-items:center;
color:var(--vibeui-input-014-muted);
}
[data-vibeui-block="input-014"] [data-part="sign"] svg{width:1rem;height:1rem;display:block}
[data-vibeui-block="input-014"] [data-state="taken"] [data-part="sign"]{color:var(--vibeui-input-014-bad)}
[data-vibeui-block="input-014"] [data-state="free"] [data-part="sign"]{color:var(--vibeui-input-014-ok)}
[data-vibeui-block="input-014"] [data-part="spin"]{
width:0.875rem;height:0.875rem;border-radius:999px;
border:2px solid color-mix(in oklab,var(--vibeui-input-014-muted) 35%,transparent);
border-top-color:var(--vibeui-input-014-accent);
animation:vibeui-input-014-turn .7s linear infinite;
}
@keyframes vibeui-input-014-turn{to{transform:rotate(360deg)}}
[data-vibeui-block="input-014"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-014-muted);
}
[data-vibeui-block="input-014"] [data-state="taken"] [data-part="note"]{color:var(--vibeui-input-014-bad)}
[data-vibeui-block="input-014"] [data-state="free"] [data-part="note"]{color:var(--vibeui-input-014-ok)}
[data-vibeui-block="input-014"] [data-part="ideas"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
[data-vibeui-block="input-014"] [data-part="idea"]{
appearance:none;cursor:pointer;
padding:0.3125rem 0.625rem;border-radius:999px;
border:1px solid var(--vibeui-input-014-border);
background:var(--vibeui-input-014-surface);color:inherit;
font:inherit;font-size:0.75rem;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="input-014"] [data-part="idea"]:hover{
border-color:var(--vibeui-input-014-accent);
background:color-mix(in oklab,var(--vibeui-input-014-accent) 10%,transparent);
}
[data-vibeui-block="input-014"] [data-part="idea"]:focus-visible{
outline:2px solid var(--vibeui-input-014-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-014"] *{animation:none!important;transition:none!important}}
`

const TAKEN = ["anna", "orlova", "design", "anna_orlova"]

const NOTE: Record<string, string> = {
  idle: "Латиница, цифры, точка и подчёркивание. От трёх символов.",
  checking: "Проверяем, свободно ли имя…",
  taken: "Имя @{handle} занято. Возьмите одно из свободных:",
  free: "Имя @{handle} свободно.",
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

// Нормализация на вводе, а не на отправке: иначе человек видит одно, а
// сохраняется другое.
function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_.]/g, "")
    .slice(0, 20)
}

function ideasFor(handle: string, taken: string[]) {
  return [`${handle}_ru`, `${handle}2026`, `real_${handle}`].filter(
    (idea) => !taken.includes(idea),
  )
}

/**
 * Имя пользователя с проверкой занятости и готовыми свободными вариантами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input014({
  label = "Имя пользователя",
  taken = TAKEN,
  onChange,
  placeholder = "anna_orlova",
  noteText = NOTE,
  background = "",
  accent,
  className,
  style,
  ...props
}: Input014Props) {
  const id = useId()
  const [handle, setHandle] = useState("anna")
  const [answer, setAnswer] = useState<{
    handle: string
    free: boolean
  } | null>(null)

  // Состояние выводится из ответа, а не хранится отдельно: пока ответ пришёл
  // не про то имя, что в поле, показывается «проверяем» — расхождение
  // невозможно по построению.
  const state =
    handle.length < 3
      ? "idle"
      : answer?.handle !== handle
        ? "checking"
        : answer.free
          ? "free"
          : "taken"

  // Пауза перед запросом: иначе занятость спрашивают на каждый символ,
  // и ответ приходит про имя, которого в поле уже нет.
  useEffect(() => {
    if (handle.length < 3 || answer?.handle === handle) return

    const timer = window.setTimeout(() => {
      setAnswer({ handle, free: !taken.includes(handle) })
    }, 600)

    return () => window.clearTimeout(timer)
  }, [handle, answer, taken])

  const palette = {
    ...(accent ? { "--vibeui-input-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-014-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const apply = (next: string) => {
    setHandle(next)
    onChange?.(next)
  }

  const ideas = state === "taken" ? ideasFor(handle, taken) : []

  return (
    <>
      <style href="vibeui-input-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-014"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="body" data-state={state}>
          <div data-part="frame">
            <span data-part="at" aria-hidden="true">
              @
            </span>
            <input
              id={id}
              type="text"
              autoComplete="username"
              spellCheck={false}
              autoCapitalize="none"
              placeholder={placeholder}
              value={handle}
              aria-invalid={state === "taken"}
              aria-describedby={`${id}-note`}
              onChange={(event) => apply(normalize(event.target.value))}
            />
            <span data-part="sign" aria-hidden="true">
              {state === "checking" ? (
                <span data-part="spin" />
              ) : state === "free" ? (
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M3.5 8.5 6.5 11.5 12.5 5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : state === "taken" ? (
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" strokeLinecap="round" />
                </svg>
              ) : null}
            </span>
          </div>
          <p data-part="note" id={`${id}-note`} aria-live="polite">
            {(noteText[state] ?? NOTE[state]).replace("{handle}", handle)}
          </p>
          {ideas.length > 0 ? (
            <div data-part="ideas">
              {ideas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  data-part="idea"
                  onClick={() => apply(idea)}
                >
                  @{idea}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
