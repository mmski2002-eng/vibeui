"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Phoneinput009Country = {
  flag: string
  code: string
  name: string
  mask: string
}

export type Phoneinput009Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  countries?: Phoneinput009Country[]
  /**
   * Показать список стран развёрнутым в потоке: витрина, скриншот, отладка.
   * В этом режиме список не всплывает над полем и не закрывается по Escape.
   */
  open?: boolean
  /** Подпись кнопки выбора страны для озвучки: компонент несёт русскую. */
  countryLabel?: string
  searchPlaceholder?: string
  emptyText?: string
  /** Шаблон строки под полем: {country}, {digits} и {code}. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: стран больше двух сотен, и нативный <select> на таком
// списке бесполезен — до Уругвая в нём доезжают колесом. Поэтому выбор
// страны — свой listbox с полем поиска: строка фильтрует по названию и по
// коду, стрелки ходят по находкам, Enter выбирает. Выбранная страна задаёт
// маску номера, поэтому поле переформатируется вместе с кодом.
const STYLES = `
:where([data-vibeui-block="phoneinput-009"]){
--vibeui-phoneinput-009-bg:transparent;
--vibeui-phoneinput-009-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-phoneinput-009-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-phoneinput-009-muted:color-mix(in oklab,var(--vibeui-phoneinput-009-fg) 68%,transparent);
--vibeui-phoneinput-009-border:light-dark(oklch(0.87 0 265),oklch(0.38 0 265));
--vibeui-phoneinput-009-hover:light-dark(oklch(0.55 0 265 / 9%),oklch(0.92 0 265 / 12%));
--vibeui-phoneinput-009-accent:light-dark(oklch(0.52 0.18 262),oklch(0.76 0.14 262));
--vibeui-phoneinput-009-on-accent:oklch(from var(--vibeui-phoneinput-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-phoneinput-009-shadow:light-dark(oklch(0.2 0 265 / 34%),oklch(0 0 0 / 68%));
--vibeui-phoneinput-009-radius:0.625rem;
--vibeui-phoneinput-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="phoneinput-009"]{color-scheme:dark}
[data-vibeui-block="phoneinput-009"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-phoneinput-009-bg);color:var(--vibeui-phoneinput-009-fg);
font-family:var(--vibeui-phoneinput-009-font);
}
[data-vibeui-block="phoneinput-009"] *{box-sizing:border-box}
[data-vibeui-block="phoneinput-009"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
color:var(--vibeui-phoneinput-009-fg);
}
[data-vibeui-block="phoneinput-009"] [data-part="field"]{position:relative}
[data-vibeui-block="phoneinput-009"] [data-part="group"]{
display:flex;align-items:stretch;
border:1px solid var(--vibeui-phoneinput-009-border);
border-radius:var(--vibeui-phoneinput-009-radius);
background:var(--vibeui-phoneinput-009-surface);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-009"] [data-part="group"]:has(:focus-visible){
border-color:var(--vibeui-phoneinput-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-009-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-009"] [data-part="trigger"]{
display:inline-flex;align-items:center;gap:0.375rem;flex:none;
min-height:2.5rem;padding:0 0.625rem;
appearance:none;cursor:pointer;border:0;
border-right:1px solid var(--vibeui-phoneinput-009-border);
border-radius:var(--vibeui-phoneinput-009-radius) 0 0 var(--vibeui-phoneinput-009-radius);
background:none;color:inherit;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="phoneinput-009"] [data-part="trigger"]:hover{background:var(--vibeui-phoneinput-009-hover)}
[data-vibeui-block="phoneinput-009"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-phoneinput-009-accent);outline-offset:-2px}
[data-vibeui-block="phoneinput-009"] [data-part="flag"]{font-size:1.0625rem;line-height:1}
[data-vibeui-block="phoneinput-009"] [data-part="dial"]{font-variant-numeric:tabular-nums}
[data-vibeui-block="phoneinput-009"] [data-part="caret"]{
width:0.3125rem;height:0.3125rem;flex:none;
border-right:1.5px solid var(--vibeui-phoneinput-009-muted);
border-bottom:1.5px solid var(--vibeui-phoneinput-009-muted);
translate:0 -0.09375rem;rotate:45deg;
}
/* Табличные цифры: в маске с разделителями пропорциональные заставляют
   номер дёргаться на каждом символе. */
[data-vibeui-block="phoneinput-009"] [data-part="number"]{
width:100%;min-width:0;min-height:2.5rem;padding:0 0.75rem;
appearance:none;border:0;background:none;outline:none;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-009-fg);
}
[data-vibeui-block="phoneinput-009"] [data-part="number"]::placeholder{color:var(--vibeui-phoneinput-009-muted)}
[data-vibeui-block="phoneinput-009"] [data-part="panel"]{
position:absolute;inset-inline:0;top:calc(100% + 0.25rem);z-index:2;
display:flex;flex-direction:column;gap:0.375rem;padding:0.375rem;
border:1px solid var(--vibeui-phoneinput-009-border);
border-radius:var(--vibeui-phoneinput-009-radius);
background:var(--vibeui-phoneinput-009-surface);
box-shadow:0 18px 40px -20px var(--vibeui-phoneinput-009-shadow);
}
[data-vibeui-block="phoneinput-009"] [data-part="search"]{
width:100%;min-width:0;min-height:2.125rem;padding:0 0.625rem;
appearance:none;border:1px solid var(--vibeui-phoneinput-009-border);
border-radius:0.5rem;background:none;outline:none;
font:inherit;font-size:0.8125rem;color:var(--vibeui-phoneinput-009-fg);
}
[data-vibeui-block="phoneinput-009"] [data-part="search"]::placeholder{color:var(--vibeui-phoneinput-009-muted)}
[data-vibeui-block="phoneinput-009"] [data-part="search"]:focus-visible{
border-color:var(--vibeui-phoneinput-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-009-accent) 20%,transparent);
}
[data-vibeui-block="phoneinput-009"] [data-part="list"]{
margin:0;padding:0;list-style:none;max-height:11rem;overflow-y:auto;
display:flex;flex-direction:column;gap:0.0625rem;
}
[data-vibeui-block="phoneinput-009"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;
min-height:2rem;padding:0.25rem 0.5rem;border-radius:0.4375rem;
cursor:pointer;font-size:0.8125rem;line-height:1.3;
color:var(--vibeui-phoneinput-009-fg);
}
[data-vibeui-block="phoneinput-009"] [data-part="option"][data-active="true"]{background:var(--vibeui-phoneinput-009-hover)}
[data-vibeui-block="phoneinput-009"] [data-part="option"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-phoneinput-009-accent) 16%,transparent);
font-weight:650;
}
[data-vibeui-block="phoneinput-009"] [data-part="option-name"]{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="phoneinput-009"] [data-part="option-dial"]{
flex:none;font-variant-numeric:tabular-nums;color:var(--vibeui-phoneinput-009-muted);
}
[data-vibeui-block="phoneinput-009"] [data-part="empty"]{
margin:0;padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-phoneinput-009-muted);
}
[data-vibeui-block="phoneinput-009"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-phoneinput-009-muted);
}
/* Развёрнутый режим витрины: список стоит в потоке под полем, а не всплывает
   над страницей, поэтому его видно на карточке каталога. */
[data-vibeui-block="phoneinput-009"] [data-part="panel"][data-open="true"]{
position:static;box-shadow:none;margin-block-start:0.375rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COUNTRIES: Phoneinput009Country[] = [
  { flag: "🇷🇺", code: "+7", name: "Россия", mask: "### ###-##-##" },
  { flag: "🇧🇾", code: "+375", name: "Беларусь", mask: "## ###-##-##" },
  { flag: "🇰🇿", code: "+7", name: "Казахстан", mask: "### ###-##-##" },
  { flag: "🇦🇲", code: "+374", name: "Армения", mask: "## ######" },
  { flag: "🇩🇪", code: "+49", name: "Германия", mask: "#### #######" },
  { flag: "🇫🇷", code: "+33", name: "Франция", mask: "# ## ## ## ##" },
  { flag: "🇹🇷", code: "+90", name: "Турция", mask: "### ### ## ##" },
  { flag: "🇷🇸", code: "+381", name: "Сербия", mask: "## #######" },
]

/** Раскладывает голые цифры по шаблону, где # — место под цифру. */
function applyMask(digits: string, mask: string) {
  let result = ""
  let index = 0

  for (const symbol of mask) {
    if (index >= digits.length) {
      break
    }

    if (symbol === "#") {
      result += digits[index]
      index += 1
    } else {
      result += symbol
    }
  }

  return result
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона.
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
 * Телефон с выбором страны через список с поиском: строка фильтрует по
 * названию и коду, страна задаёт маску номера. Один файл, ноль зависимостей.
 */
export function Phoneinput009({
  label = "Телефон",
  countries = DEFAULT_COUNTRIES,
  open = false,
  countryLabel = "Страна",
  searchPlaceholder = "Поиск страны",
  emptyText = "Страна не найдена",
  hint = "{country} {code}: {digits} цифр в номере.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Phoneinput009Props) {
  const uid = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const activeOption = useRef<HTMLLIElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [chosen, setChosen] = useState(countries[0]?.name ?? "")
  const [digits, setDigits] = useState("")

  const country = countries.find((entry) => entry.name === chosen) ?? countries[0]
  const limit = (country?.mask.match(/#/g) ?? []).length
  const needle = query.trim().toLowerCase()
  const found = needle
    ? countries.filter(
        (entry) =>
          entry.name.toLowerCase().includes(needle) ||
          entry.code.includes(needle.replace(/^\+?/, "+")),
      )
    : countries
  const visible = open || expanded

  useEffect(() => {
    activeOption.current?.scrollIntoView({ block: "nearest" })
  }, [active])

  function close(returnFocus: boolean) {
    setExpanded(false)
    setQuery("")

    if (returnFocus) {
      trigger.current?.focus()
    }
  }

  function pick(name: string) {
    setChosen(name)
    setDigits("")
    close(true)
  }

  function onSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()

      if (found.length === 0) {
        return
      }

      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((previous) => (previous + step + found.length) % found.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      const entry = found[active]

      if (entry) {
        pick(entry.name)
      }
    } else if (event.key === "Escape") {
      event.preventDefault()
      close(true)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-phoneinput-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-phoneinput-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const hintText = hint
    .replace("{country}", country?.name ?? "")
    .replace("{code}", country?.code ?? "")
    .replace("{digits}", String(limit))

  return (
    <>
      <style href="vibeui-phoneinput-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="phone-input"
        data-vibeui-block="phoneinput-009"
        className={className}
        style={palette}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            close(false)
          }
        }}
      >
        <label htmlFor={`${uid}-number`}>{label}</label>
        <div data-part="field">
          <div data-part="group">
            <button
              type="button"
              data-part="trigger"
              ref={trigger}
              aria-label={`${countryLabel}: ${country?.name ?? ""}`}
              aria-haspopup="listbox"
              aria-expanded={visible}
              aria-controls={visible ? `${uid}-list` : undefined}
              onClick={() => {
                setActive(
                  Math.max(
                    0,
                    countries.findIndex((entry) => entry.name === chosen),
                  ),
                )
                setQuery("")
                setExpanded((previous) => !previous)
              }}
            >
              <span data-part="flag" aria-hidden="true">
                {country?.flag}
              </span>
              <span data-part="dial">{country?.code}</span>
              <span data-part="caret" aria-hidden="true" />
            </button>
            <input
              id={`${uid}-number`}
              data-part="number"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={country?.mask.replaceAll("#", "0")}
              aria-describedby={`${uid}-hint`}
              value={applyMask(digits, country?.mask ?? "")}
              onChange={(event) =>
                setDigits(
                  event.target.value.replace(/\D/g, "").slice(0, limit || 15),
                )
              }
            />
          </div>
          {visible ? (
            <div data-part="panel" data-open={open || undefined}>
              <input
                data-part="search"
                type="search"
                autoComplete="off"
                aria-label={searchPlaceholder}
                aria-controls={`${uid}-list`}
                aria-activedescendant={
                  found[active] ? `${uid}-option-${active}` : undefined
                }
                placeholder={searchPlaceholder}
                value={query}
                autoFocus={!open}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActive(0)
                }}
                onKeyDown={onSearchKeyDown}
              />
              {found.length > 0 ? (
                <ul
                  data-part="list"
                  id={`${uid}-list`}
                  role="listbox"
                  aria-label={countryLabel}
                >
                  {found.map((entry, index) => (
                    <li
                      key={entry.name}
                      id={`${uid}-option-${index}`}
                      data-part="option"
                      data-active={index === active || undefined}
                      role="option"
                      aria-selected={entry.name === chosen}
                      ref={index === active ? activeOption : undefined}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => pick(entry.name)}
                    >
                      <span data-part="flag" aria-hidden="true">
                        {entry.flag}
                      </span>
                      <span data-part="option-name">{entry.name}</span>
                      <span data-part="option-dial">{entry.code}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p data-part="empty" id={`${uid}-list`} role="status">
                  {emptyText}
                </p>
              )}
            </div>
          ) : null}
        </div>
        <p data-part="hint" id={`${uid}-hint`}>
          {hintText}
        </p>
      </div>
    </>
  )
}
