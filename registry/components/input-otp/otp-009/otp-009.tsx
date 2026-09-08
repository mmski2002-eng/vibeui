"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Otp009Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  title?: string
  hint?: string
  /** Сколько знаков в группе. */
  groupSize?: number
  /** Сколько групп. */
  groups?: number
  /** Разделитель между группами: рисуется, а не набирается. */
  separator?: string
  /** Подпись счётчика. {filled} и {total} подставляются. */
  counterTemplate?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: код приглашения, а не цифры из СМС. Здесь буквы и цифры,
// поэтому решается своя задача: похожие знаки. Ноль и «О», единица и «I»
// в моноширинном наборе различаются плохо, а диктуют такой код по телефону.
// Компонент их не принимает вовсе и молча приводит близкие к разрешённым,
// поэтому «O» превращается в «0» на глазах, а не отвергается ошибкой.
// Регистр повышается сам: код печатают как придётся, а сверяют в верхнем.
const STYLES = `
:where([data-vibeui-block="otp-009"]){
--vibeui-otp-009-bg:light-dark(oklch(0.99 0 265),oklch(0.23 0 265));
--vibeui-otp-009-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-otp-009-muted:color-mix(in oklab,var(--vibeui-otp-009-fg) 62%,transparent);
--vibeui-otp-009-border:light-dark(oklch(0 0 0 / 16%),oklch(1 0 0 / 18%));
--vibeui-otp-009-cell:light-dark(oklch(1 0 0),oklch(1 0 0 / 6%));
--vibeui-otp-009-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-otp-009-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-otp-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="otp-009"]{color-scheme:dark}
[data-vibeui-block="otp-009"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы поле
   схлопывается в ниточку внутри flex-контейнера. */
min-width:min(100%,17rem);
max-width:22rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-otp-009-bg);
border:1px solid var(--vibeui-otp-009-border);border-radius:0.875rem;
font-family:var(--vibeui-otp-009-font);color:var(--vibeui-otp-009-fg);
}
[data-vibeui-block="otp-009"] *{box-sizing:border-box}
[data-vibeui-block="otp-009"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="otp-009"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-otp-009-muted);
}
[data-vibeui-block="otp-009"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;margin:0.125rem 0;
}
[data-vibeui-block="otp-009"] [data-part="group"]{display:flex;gap:0.25rem;flex:1;min-width:0}
/* Разделитель нарисован, а не набирается: в буфере его нет, и человек не
   должен думать, ставить ли дефис. */
[data-vibeui-block="otp-009"] [data-part="dash"]{
flex:none;width:0.625rem;height:1px;background:var(--vibeui-otp-009-muted);
}
[data-vibeui-block="otp-009"] input{
flex:1;min-width:0;width:100%;height:2.75rem;padding:0;
border:1px solid var(--vibeui-otp-009-border);border-radius:0.625rem;
background:var(--vibeui-otp-009-cell);color:inherit;
font-family:var(--vibeui-otp-009-mono);font-size:1.0625rem;text-align:center;
text-transform:uppercase;
}
[data-vibeui-block="otp-009"] input:focus-visible{
outline:2px solid var(--vibeui-otp-009-accent);outline-offset:1px;
border-color:var(--vibeui-otp-009-accent);
}
[data-vibeui-block="otp-009"] [data-part="counter"]{
margin:0;font-size:0.75rem;color:var(--vibeui-otp-009-muted);font-variant-numeric:tabular-nums;
}
@container (max-width: 18rem){
[data-vibeui-block="otp-009"] input{height:2.375rem;font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="otp-009"] *{animation:none!important;transition:none!important}}
`

// Алфавит без похожих знаков: «I» и «L» неотличимы от единицы, «O» — от
// ноля, «U» от «V» на слух. Цифры при этом остаются: их диктуют увереннее.
const ALLOWED = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

// Выброшенные знаки не отвергаются, а приводятся к тому, что человек имел в
// виду: напечатал «O» — получил ноль, и это видно сразу.
const FIXES: Record<string, string> = {
  I: "1",
  L: "1",
  O: "0",
  U: "V",
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

/** Оставляет только разрешённые знаки, приводя похожие. */
function clean(raw: string): string {
  return raw
    .toUpperCase()
    .split("")
    .map((character) => FIXES[character] ?? character)
    .filter((character) => ALLOWED.includes(character))
    .join("")
}

/**
 * Буквенно-цифровой код: похожие знаки приводятся сами, регистр повышается.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Otp009({
  title = "Код приглашения",
  hint = "Из письма или от того, кто вас пригласил. Регистр не важен.",
  groupSize = 4,
  groups = 2,
  separator = "—",
  counterTemplate = "{filled} из {total}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Otp009Props) {
  const total = groupSize * groups
  const [chars, setChars] = useState<string[]>(() =>
    Array.from({ length: total }, () => ""),
  )
  const cells = useRef<(HTMLInputElement | null)[]>([])

  const put = (index: number, raw: string) => {
    const typed = clean(raw)
    const next = [...chars]

    if (typed === "") {
      next[index] = ""
      setChars(next)
      return
    }

    typed.split("").forEach((character, offset) => {
      if (index + offset < total) {
        next[index + offset] = character
      }
    })

    setChars(next)
    cells.current[Math.min(index + typed.length, total - 1)]?.focus()
  }

  const back = (index: number, key: string) => {
    if (key === "Backspace" && chars[index] === "" && index > 0) {
      cells.current[index - 1]?.focus()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-otp-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-otp-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const filled = chars.filter((character) => character !== "").length

  return (
    <>
      <style href="vibeui-otp-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-otp"
        data-vibeui-block="otp-009"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>
        <p data-part="hint">{hint}</p>

        <div data-part="row">
          {Array.from({ length: groups }, (_, group) => (
            <div key={group} style={{ display: "contents" }}>
              {group > 0 ? (
                <span
                  data-part="dash"
                  role="separator"
                  aria-label={separator}
                />
              ) : null}
              <div data-part="group">
                {Array.from({ length: groupSize }, (_, offset) => {
                  const index = group * groupSize + offset

                  return (
                    <input
                      key={index}
                      ref={(node) => {
                        cells.current[index] = node
                      }}
                      type="text"
                      inputMode="text"
                      autoCapitalize="characters"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      spellCheck={false}
                      maxLength={total}
                      value={chars[index]}
                      aria-label={`Знак ${index + 1} из ${total}`}
                      onChange={(event) => put(index, event.target.value)}
                      onKeyDown={(event) => back(index, event.key)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p data-part="counter" aria-live="polite">
          {counterTemplate
            .replace("{filled}", String(filled))
            .replace("{total}", String(total))}
        </p>
      </div>
    </>
  )
}
