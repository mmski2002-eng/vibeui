"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Input016Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  length?: number
  onChange?: (value: string) => void
  /** Значок оценки; {bits} подставляется числом. */
  bitsText?: string
  /** Кнопка показа пароля: ключи show, hide, showLabel, hideLabel. */
  toggleText?: Record<string, string>
  /** Надпись на кнопке генерации. */
  generateText?: string
  /** Надпись на кнопке копирования. */
  copyText?: string
  /** Надпись на кнопке копирования сразу после копирования. */
  copiedText?: string
  /** Вердикт под полем: ключи idle, weak, fair, strong. */
  verdictText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: оценивать чужой набранный пароль в каталоге уже есть кому
// (input-003, input-011). Этот пароль сам придумывает: одна кнопка собирает
// случайную строку из всех классов символов через crypto.getRandomValues,
// вторая копирует её в буфер. Вместо цветной полоски — оценка в битах
// энтропии словами: число говорит больше, чем закрашенный отрезок.
const STYLES = `
:where([data-vibeui-block="input-016"]){
--vibeui-input-016-bg:transparent;
--vibeui-input-016-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-input-016-muted:color-mix(in oklab,var(--vibeui-input-016-fg) 68%,transparent);
--vibeui-input-016-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-input-016-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-input-016-chip:light-dark(oklch(0.95 0 265),oklch(0.32 0 265));
--vibeui-input-016-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-input-016-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-input-016-weak:light-dark(oklch(0.58 0.19 25),oklch(0.74 0.16 25));
--vibeui-input-016-fair:light-dark(oklch(0.72 0.16 75),oklch(0.82 0.15 75));
--vibeui-input-016-strong:light-dark(oklch(0.295 0 0),oklch(0.91 0 0));
--vibeui-input-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="input-016"]{color-scheme:dark}
[data-vibeui-block="input-016"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-016-bg);
border:1px solid var(--vibeui-input-016-border);border-radius:0.875rem;
font-family:var(--vibeui-input-016-font);color:var(--vibeui-input-016-fg);
}
[data-vibeui-block="input-016"] *{box-sizing:border-box}
[data-vibeui-block="input-016"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="input-016"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-016"] [data-part="badge"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:999px;
font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;
font-variant-numeric:tabular-nums;
background:var(--vibeui-input-016-chip);color:var(--vibeui-input-016-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="input-016"][data-level="weak"] [data-part="badge"]{color:var(--vibeui-input-016-weak);background:color-mix(in oklab,var(--vibeui-input-016-weak) 14%,transparent)}
[data-vibeui-block="input-016"][data-level="fair"] [data-part="badge"]{color:var(--vibeui-input-016-fair);background:color-mix(in oklab,var(--vibeui-input-016-fair) 16%,transparent)}
[data-vibeui-block="input-016"][data-level="strong"] [data-part="badge"]{color:var(--vibeui-input-016-strong);background:color-mix(in oklab,var(--vibeui-input-016-strong) 14%,transparent)}
[data-vibeui-block="input-016"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="input-016"] input{
width:100%;height:2.5rem;padding:0 5.75rem 0 0.75rem;
border:1px solid var(--vibeui-input-016-border);border-radius:0.625rem;
background:var(--vibeui-input-016-field);color:inherit;
font:inherit;font-size:0.875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-016"] input:focus-visible{
outline:2px solid var(--vibeui-input-016-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="input-016"] [data-part="field"] > button{
position:absolute;right:0.375rem;top:50%;transform:translateY(-50%);
appearance:none;border:0;cursor:pointer;background:transparent;
padding:0 0.375rem;height:1.875rem;border-radius:0.4375rem;
color:var(--vibeui-input-016-muted);font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="input-016"] [data-part="field"] > button:hover{color:var(--vibeui-input-016-fg)}
[data-vibeui-block="input-016"] [data-part="field"] > button:focus-visible{outline:2px solid var(--vibeui-input-016-accent);outline-offset:1px}
[data-vibeui-block="input-016"] [data-part="row"]{display:flex;gap:0.5rem}
[data-vibeui-block="input-016"] [data-part="row"] button{
flex:1;appearance:none;cursor:pointer;height:2.125rem;
border:1px solid var(--vibeui-input-016-border);border-radius:0.5625rem;
background:var(--vibeui-input-016-field);color:var(--vibeui-input-016-fg);
font:inherit;font-size:0.8125rem;font-weight:600;
transition:border-color .16s ease,background-color .16s ease,opacity .16s ease;
}
[data-vibeui-block="input-016"] [data-part="row"] button:hover:not(:disabled){border-color:var(--vibeui-input-016-accent)}
[data-vibeui-block="input-016"] [data-part="row"] button:focus-visible{outline:2px solid var(--vibeui-input-016-accent);outline-offset:1px}
[data-vibeui-block="input-016"] [data-part="row"] button:disabled{cursor:not-allowed;opacity:0.5}
[data-vibeui-block="input-016"] [data-part="row"] [data-part="generate"]{
background:var(--vibeui-input-016-accent);border-color:var(--vibeui-input-016-accent);color:oklch(from var(--vibeui-input-016-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="input-016"] [data-part="note"]{margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-016-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-016"] *{animation:none!important;transition:none!important}}
`

const LOWER = "abcdefghijkmnpqrstuvwxyz"
const UPPER = "ABCDEFGHJKMNPQRSTUVWXYZ"
const DIGITS = "23456789"
const SYMBOLS = "!@#$%^&*-_=+?"
const POOLS = [LOWER, UPPER, DIGITS, SYMBOLS]

function randomIndex(max: number) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bucket = new Uint32Array(1)
    crypto.getRandomValues(bucket)
    return bucket[0] % max
  }
  return Math.floor(Math.random() * max)
}

// Один символ из каждого класса гарантирует разнообразие, остальные — вперемешку
// из общего набора, а перетасовка Фишера — Йетса не даёт гарантированным
// символам всегда оседать в начале строки.
function generate(length: number) {
  const all = POOLS.join("")
  const chars = POOLS.map((pool) => pool[randomIndex(pool.length)])

  while (chars.length < length) {
    chars.push(all[randomIndex(all.length)])
  }

  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(index + 1)
    ;[chars[index], chars[swap]] = [chars[swap], chars[index]]
  }

  return chars.slice(0, length).join("")
}

function poolSizeOf(value: string) {
  let size = 0
  if (/[a-z]/.test(value)) size += 26
  if (/[A-Z]/.test(value)) size += 26
  if (/\d/.test(value)) size += 10
  if (/[^a-zA-Z0-9]/.test(value)) size += 20
  return size
}

// Энтропия в битах — length * log2(размер использованного алфавита). Число
// честнее полоски: «74 бита» говорит, во сколько раз дольше перебирать,
// а закрашенный сегмент — нет.
function entropyBits(value: string) {
  const pool = poolSizeOf(value)
  if (!value || pool === 0) return 0
  return Math.round(value.length * Math.log2(pool))
}

function levelOf(bits: number) {
  if (bits === 0) return "idle"
  if (bits < 40) return "weak"
  if (bits < 70) return "fair"
  return "strong"
}

const VERDICT: Record<string, string> = {
  idle: "Сгенерируйте пароль или введите свой",
  weak: "Слабый — добавьте длины или символов",
  fair: "Средний — ещё немного длины не помешает",
  strong: "Надёжный пароль",
}

const TOGGLE: Record<string, string> = {
  show: "Показать",
  hide: "Скрыть",
  showLabel: "Показать пароль",
  hideLabel: "Скрыть пароль",
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
 * Пароль с генерацией случайной строки, копированием и оценкой в битах энтропии.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Input016({
  label = "Пароль",
  placeholder = "Сгенерируйте или введите свой",
  length = 14,
  onChange,
  bitsText = "~{bits} бит",
  toggleText = TOGGLE,
  generateText = "Сгенерировать",
  copyText = "Копировать",
  copiedText = "Скопировано",
  verdictText = VERDICT,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Input016Props) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const [value, setValue] = useState("")
  const [shown, setShown] = useState(false)
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const palette = {
    ...(accent ? { "--vibeui-input-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-input-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const bits = entropyBits(value)
  const level = levelOf(bits)

  const update = (next: string) => {
    setValue(next)
    setCopied(false)
    onChange?.(next)
  }

  const handleGenerate = () => {
    update(generate(Math.min(Math.max(length, 8), 64)))
    setShown(true)
  }

  const handleCopy = async () => {
    if (!value || typeof navigator === "undefined" || !navigator.clipboard) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1600)
    } catch {
      // Буфер обмена может быть недоступен (небезопасный контекст, запрет
      // разрешения) — тихо остаёмся в состоянии «не скопировано».
    }
  }

  return (
    <>
      <style href="vibeui-input-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input"
        data-vibeui-block="input-016"
        data-level={level}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={fieldId}>{label}</label>
          <span data-part="badge">
            {bits ? bitsText.replace("{bits}", String(bits)) : "—"}
          </span>
        </div>
        <span data-part="field">
          <input
            id={fieldId}
            type={shown ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            autoComplete="new-password"
            aria-describedby={`${fieldId}-note`}
            onChange={(event) => update(event.target.value)}
          />
          <button
            type="button"
            aria-pressed={shown}
            aria-label={
              shown
                ? (toggleText.hideLabel ?? TOGGLE.hideLabel)
                : (toggleText.showLabel ?? TOGGLE.showLabel)
            }
            onClick={() => setShown(!shown)}
          >
            {shown
              ? (toggleText.hide ?? TOGGLE.hide)
              : (toggleText.show ?? TOGGLE.show)}
          </button>
        </span>
        <span data-part="row">
          <button type="button" data-part="generate" onClick={handleGenerate}>
            {generateText}
          </button>
          <button
            type="button"
            data-part="copy"
            disabled={!value}
            onClick={handleCopy}
          >
            {copied ? copiedText : copyText}
          </button>
        </span>
        <p
          data-part="note"
          id={`${fieldId}-note`}
          role="status"
          aria-live="polite"
        >
          {verdictText[level] ?? VERDICT[level]}
        </p>
      </div>
    </>
  )
}
