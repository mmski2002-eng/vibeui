"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Phoneinput008Country = {
  flag: string
  code: string
  name: string
  mask: string
}

export type Phoneinput008Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  countries?: Phoneinput008Country[]
  /** Подпись списка кодов для озвучки: компонент несёт русскую. */
  codeLabel?: string
  /** Шаблон строки над полем: {code} и {mask}. */
  hint?: string
  /** Подписи состояний проверки: {count} — число цифр, {word} — их слово. */
  statusText?: Record<string, string>
  /** Слово «цифра» в трёх формах: 1 цифра, 2 цифры, 5 цифр. */
  digitWords?: { one: string; few: string; many: string }
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: подсказка маски и проверка формата — два разных сообщения,
// а не одно. Строка над полем всегда называет ожидаемый вид номера для
// выбранной страны и не меняется от ввода. Строка под полем живая: она
// сравнивает число набранных цифр с ожидаемым и говорит, чего не хватает или
// что лишнее, поэтому ошибку видно раньше отправки формы, а не после неё.
// Номер набирается голыми цифрами — маска не подставляется в поле, чтобы не
// путать это с автоформатированием: тут именно проверка, а не подстановка.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="phoneinput-008"]){
--vibeui-phoneinput-008-surface:transparent;
--vibeui-phoneinput-008-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-phoneinput-008-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-phoneinput-008-muted:color-mix(in oklab,var(--vibeui-phoneinput-008-fg) 68%,transparent);
--vibeui-phoneinput-008-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-phoneinput-008-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-phoneinput-008-warn:light-dark(oklch(0.62 0.14 75),oklch(0.82 0.14 75));
--vibeui-phoneinput-008-bad:light-dark(oklch(0.58 0.2 25),oklch(0.75 0.16 25));
--vibeui-phoneinput-008-ok:light-dark(oklch(0.56 0.15 155),oklch(0.75 0.14 155));
--vibeui-phoneinput-008-radius:0.625rem;
--vibeui-phoneinput-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="phoneinput-008"]{color-scheme:dark}
[data-vibeui-block="phoneinput-008"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-008-surface);
border:1px solid var(--vibeui-phoneinput-008-surface-border);
font-family:var(--vibeui-phoneinput-008-font);color:var(--vibeui-phoneinput-008-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="phoneinput-008"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="phoneinput-008"] [data-part="hint"]{
margin:0;font-size:0.78125rem;line-height:1.4;color:var(--vibeui-phoneinput-008-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="phoneinput-008"] [data-part="group"]{
display:flex;align-items:stretch;
border:1px solid var(--vibeui-phoneinput-008-field-border);
border-radius:var(--vibeui-phoneinput-008-radius);
background:var(--vibeui-phoneinput-008-surface);overflow:hidden;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-008"] [data-part="group"]:has(:focus-visible){
border-color:var(--vibeui-phoneinput-008-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-008-accent) 22%,transparent);
}
/* Состояние проверки красит рамку группы: цвет виден раньше, чем текст. */
[data-vibeui-block="phoneinput-008"][data-state="incomplete"] [data-part="group"]{border-color:var(--vibeui-phoneinput-008-warn)}
[data-vibeui-block="phoneinput-008"][data-state="valid"] [data-part="group"]{border-color:var(--vibeui-phoneinput-008-ok)}
[data-vibeui-block="phoneinput-008"][data-state="excess"] [data-part="group"]{border-color:var(--vibeui-phoneinput-008-bad)}
[data-vibeui-block="phoneinput-008"] [data-part="code"]{position:relative;display:flex;flex:none}
[data-vibeui-block="phoneinput-008"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;height:2.5rem;padding:0 1.5rem 0 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.2;
color:var(--vibeui-phoneinput-008-fg);background:transparent;
border:0;border-right:1px solid var(--vibeui-phoneinput-008-field-border);
cursor:pointer;outline:none;
}
[data-vibeui-block="phoneinput-008"] [data-part="arrow"]{
position:absolute;right:0.5rem;top:50%;pointer-events:none;
width:0.3125rem;height:0.3125rem;
border-right:1.5px solid var(--vibeui-phoneinput-008-muted);
border-bottom:1.5px solid var(--vibeui-phoneinput-008-muted);
translate:0 -0.1875rem;rotate:45deg;
}
[data-vibeui-block="phoneinput-008"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;min-width:0;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-008-fg);background:transparent;
border:0;outline:none;
}
[data-vibeui-block="phoneinput-008"] input::placeholder{color:var(--vibeui-phoneinput-008-muted)}
[data-vibeui-block="phoneinput-008"] [data-part="status"]{
display:flex;align-items:center;gap:0.375rem;
margin:0;font-size:0.78125rem;line-height:1.4;color:var(--vibeui-phoneinput-008-muted);
}
[data-vibeui-block="phoneinput-008"][data-state="incomplete"] [data-part="status"]{color:var(--vibeui-phoneinput-008-warn)}
[data-vibeui-block="phoneinput-008"][data-state="valid"] [data-part="status"]{color:var(--vibeui-phoneinput-008-ok)}
[data-vibeui-block="phoneinput-008"][data-state="excess"] [data-part="status"]{color:var(--vibeui-phoneinput-008-bad)}
[data-vibeui-block="phoneinput-008"] [data-part="mark"]{flex:none;font-weight:750}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COUNTRIES: Phoneinput008Country[] = [
  { flag: "🇷🇺", code: "+7", name: "Россия", mask: "### ###-##-##" },
  { flag: "🇺🇸", code: "+1", name: "США", mask: "(###) ###-####" },
  { flag: "🇩🇪", code: "+49", name: "Германия", mask: "#### #######" },
  { flag: "🇬🇧", code: "+44", name: "Великобритания", mask: "#### ######" },
]

const DEFAULT_STATUS_TEXT: Record<string, string> = {
  empty: "Начните вводить номер",
  incomplete: "Не хватает {count} {word}",
  valid: "Формат верный: {count} {word}",
  excess: "Лишних {count} {word}",
}

const DEFAULT_DIGIT_WORDS = { one: "цифра", few: "цифры", many: "цифр" }

/** Склонение слова под число: 1 цифра, 2 цифры, 5 цифр. */
function digitWord(
  count: number,
  words: { one: string; few: string; many: string },
) {
  const teen = count % 100
  const tail = count % 10
  if (teen > 10 && teen < 20) return words.many
  if (tail === 1) return words.one
  if (tail > 1 && tail < 5) return words.few
  return words.many
}

function expectedDigits(mask: string) {
  return (mask.match(/#/g) ?? []).length
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Телефон с проверкой формата по мере ввода: рамка и строка статуса меняют
 * цвет по числу набранных цифр, а строка над полем всегда называет
 * ожидаемую маску для выбранной страны. Один файл, ноль зависимостей.
 */
export function Phoneinput008({
  label = "Телефон",
  countries = DEFAULT_COUNTRIES,
  codeLabel = "Код страны",
  hint = "Ожидаемый формат: {code} {mask}",
  statusText = DEFAULT_STATUS_TEXT,
  digitWords = DEFAULT_DIGIT_WORDS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Phoneinput008Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const statusId = `${id}-status`
  const [countryName, setCountryName] = useState(countries[0]?.name ?? "")
  const [digits, setDigits] = useState("")

  const country =
    countries.find((entry) => entry.name === countryName) ?? countries[0]
  const expected = expectedDigits(country?.mask ?? "")
  const typed = digits.length

  const state =
    typed === 0
      ? "empty"
      : typed < expected
        ? "incomplete"
        : typed === expected
          ? "valid"
          : "excess"

  const count =
    state === "incomplete"
      ? expected - typed
      : state === "excess"
        ? typed - expected
        : typed
  const status = (statusText[state] ?? DEFAULT_STATUS_TEXT[state] ?? "")
    .replace("{count}", String(count))
    .replace("{word}", digitWord(count, digitWords))

  const statusMark =
    state === "valid"
      ? "✓"
      : state === "excess"
        ? "!"
        : state === "incomplete"
          ? "…"
          : null

  const palette = {
    ...(accent ? { "--vibeui-phoneinput-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-phoneinput-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const hintText = hint
    .replace("{code}", country?.code ?? "")
    .replace("{mask}", country?.mask.replaceAll("#", "0") ?? "")

  return (
    <>
      <style href="vibeui-phoneinput-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="phone-input"
        data-vibeui-block="phoneinput-008"
        data-state={state}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <p data-part="hint" id={hintId}>
          {hintText}
        </p>
        <div data-part="group">
          <span data-part="code">
            <select
              name="country"
              aria-label={codeLabel}
              value={countryName}
              onChange={(event) => {
                setCountryName(event.target.value)
                setDigits("")
              }}
            >
              {countries.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.flag} {entry.code}
                </option>
              ))}
            </select>
            <span data-part="arrow" aria-hidden="true" />
          </span>
          <input
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={country?.mask.replaceAll("#", "0")}
            value={digits}
            aria-describedby={`${hintId} ${statusId}`}
            onChange={(event) =>
              setDigits(event.target.value.replace(/\D/g, "").slice(0, 15))
            }
          />
        </div>
        <p data-part="status" id={statusId} role="status" aria-live="polite">
          {statusMark ? (
            <span data-part="mark" aria-hidden="true">
              {statusMark}
            </span>
          ) : null}
          {status}
        </p>
      </div>
    </>
  )
}
