"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Tags008Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  title?: string
  placeholder?: string
  /** Адреса, набранные заранее. */
  defaultValue?: string[]
  /** Подпись годных адресов. {count} подставляется. */
  okTemplate?: string
  /** Подпись адресов с ошибкой. {count} подставляется. */
  badTemplate?: string
  /** Подпись у адреса с ошибкой: показывается как всплывающая подсказка. */
  badHint?: string
  removeTemplate?: string
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: поле приглашений, где ошибку в адресе видно сразу, а не
// после отправки. Список вставляют целиком — из письма, из таблицы, — и в нём
// почти всегда есть лишняя запятая, пробел или обрезанный домен. Негодный
// адрес не отбрасывается: он остаётся чипом, помеченным красным, и его можно
// поправить — щелчок возвращает адрес в поле, откуда он и пришёл. Счётчик
// считает отдельно годные и ошибочные: «7 адресов» ничего не говорит, если
// два из них никуда не уйдут.
const STYLES = `
:where([data-vibeui-block="tags-008"]){
--vibeui-tags-008-bg:light-dark(oklch(0.99 0 265),oklch(0.23 0 265));
--vibeui-tags-008-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-tags-008-muted:color-mix(in oklab,var(--vibeui-tags-008-fg) 62%,transparent);
--vibeui-tags-008-border:light-dark(oklch(0 0 0 / 14%),oklch(1 0 0 / 16%));
--vibeui-tags-008-field:light-dark(oklch(1 0 0),oklch(1 0 0 / 5%));
--vibeui-tags-008-chip:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 9%));
--vibeui-tags-008-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-tags-008-ok:light-dark(oklch(0.45 0.13 152),oklch(0.82 0.13 152));
--vibeui-tags-008-bad:light-dark(oklch(0.53 0.19 25),oklch(0.79 0.15 25));
--vibeui-tags-008-bad-bg:light-dark(oklch(0.95 0.05 25),oklch(0.32 0.07 25));
--vibeui-tags-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tags-008"]{color-scheme:dark}
[data-vibeui-block="tags-008"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:24rem;box-sizing:border-box;
font-family:var(--vibeui-tags-008-font);color:var(--vibeui-tags-008-fg);
}
[data-vibeui-block="tags-008"] *{box-sizing:border-box}
[data-vibeui-block="tags-008"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="tags-008"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.3125rem;
padding:0.4375rem 0.5rem;
border:1px solid var(--vibeui-tags-008-border);border-radius:0.625rem;
background:var(--vibeui-tags-008-field);
}
[data-vibeui-block="tags-008"] [data-part="field"]:focus-within{
border-color:var(--vibeui-tags-008-accent);
outline:2px solid color-mix(in oklab,var(--vibeui-tags-008-accent) 40%,transparent);
outline-offset:1px;
}
[data-vibeui-block="tags-008"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.125rem 0.25rem 0.125rem 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-tags-008-chip);
font-size:0.8125rem;max-width:100%;
}
[data-vibeui-block="tags-008"] [data-part="mail"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Негодный адрес не исчезает, а помечается: исчезнувшая строка выглядит как
   потеря данных, а не как проверка. */
[data-vibeui-block="tags-008"] [data-part="chip"][data-bad="true"]{
background:var(--vibeui-tags-008-bad-bg);
color:var(--vibeui-tags-008-bad);
box-shadow:inset 0 0 0 1px var(--vibeui-tags-008-bad);
}
[data-vibeui-block="tags-008"] [data-part="fix"],
[data-vibeui-block="tags-008"] [data-part="drop"]{
appearance:none;border:0;cursor:pointer;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:0.3125rem;font:inherit;
}
[data-vibeui-block="tags-008"] [data-part="fix"]{width:auto;padding:0 0.25rem;font-size:0.75rem;font-weight:650}
[data-vibeui-block="tags-008"] [data-part="fix"]:hover,
[data-vibeui-block="tags-008"] [data-part="drop"]:hover{background:color-mix(in oklab,currentColor 16%,transparent)}
[data-vibeui-block="tags-008"] [data-part="fix"]:focus-visible,
[data-vibeui-block="tags-008"] [data-part="drop"]:focus-visible{
outline:2px solid var(--vibeui-tags-008-accent);outline-offset:1px;
}
[data-vibeui-block="tags-008"] input{
flex:1;min-width:7rem;border:0;padding:0.1875rem 0.125rem;
background:transparent;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="tags-008"] input:focus{outline:none}
[data-vibeui-block="tags-008"] [data-part="counter"]{
margin:0;font-size:0.75rem;color:var(--vibeui-tags-008-muted);
}
[data-vibeui-block="tags-008"] [data-part="ok-count"]{color:var(--vibeui-tags-008-ok);font-weight:650}
[data-vibeui-block="tags-008"] [data-part="bad-count"]{color:var(--vibeui-tags-008-bad);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-008"] *{animation:none!important;transition:none!important}}
`

// Проверка нарочно нестрогая: полный разбор адреса по стандарту отвергает
// живые ящики, а здесь задача — поймать очевидное, не мешая остальному.
const MAIL = /^[^\s@,;]+@[^\s@,;.]+\.[^\s@,;]{2,}$/

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
 * Поле приглашений: негодный адрес помечен и правится, а не исчезает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags008({
  title = "Кого пригласить",
  placeholder = "Адрес и Enter — или вставьте список",
  defaultValue = ["anna@studio.ru", "petr@example", "mark@studio.ru"],
  okTemplate = "Готовы к отправке: {count}",
  badTemplate = "с ошибкой: {count}",
  badHint = "Похоже на опечатку: нажмите, чтобы поправить",
  removeTemplate = "Убрать {mail}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Tags008Props) {
  const [mails, setMails] = useState<string[]>(defaultValue)
  const [draft, setDraft] = useState("")

  const add = (raw: string) => {
    // Список из письма приходит через запятые, точки с запятой и переводы
    // строк вперемешку — разбираем все три сразу.
    const parts = raw
      .split(/[\s,;]+/)
      .map((part) => part.trim())
      .filter(Boolean)

    if (parts.length === 0) {
      return
    }

    setMails((current) => [
      ...current,
      ...parts.filter((part) => !current.includes(part)),
    ])
    setDraft("")
  }

  const keys = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === ";") {
      event.preventDefault()
      add(draft)
      return
    }

    if (event.key === "Backspace" && draft === "" && mails.length > 0) {
      setMails((current) => current.slice(0, -1))
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-tags-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const ok = mails.filter((mail) => MAIL.test(mail)).length
  const bad = mails.length - ok

  return (
    <>
      <style href="vibeui-tags-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tags-input"
        data-vibeui-block="tags-008"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>

        <div data-part="field">
          {mails.map((mail) => {
            const wrong = !MAIL.test(mail)

            return (
              <span
                key={mail}
                data-part="chip"
                data-bad={wrong || undefined}
                title={wrong ? badHint : undefined}
              >
                {wrong ? (
                  // Щелчок возвращает адрес в поле: правка одной буквы не
                  // должна стоить набора всей строки заново.
                  <button
                    type="button"
                    data-part="fix"
                    aria-label={`${badHint}: ${mail}`}
                    onClick={() => {
                      setMails((current) =>
                        current.filter((item) => item !== mail),
                      )
                      setDraft(mail)
                    }}
                  >
                    {mail}
                  </button>
                ) : (
                  <span data-part="mail">{mail}</span>
                )}
                <button
                  type="button"
                  data-part="drop"
                  aria-label={removeTemplate.replace("{mail}", mail)}
                  onClick={() =>
                    setMails((current) =>
                      current.filter((item) => item !== mail),
                    )
                  }
                >
                  ×
                </button>
              </span>
            )
          })}

          <input
            type="text"
            inputMode="email"
            autoComplete="off"
            spellCheck={false}
            value={draft}
            placeholder={placeholder}
            aria-label={title}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={keys}
            onBlur={() => add(draft)}
            onPaste={(event) => {
              event.preventDefault()
              add(event.clipboardData.getData("text"))
            }}
          />
        </div>

        {/* Годные и ошибочные считаются отдельно: общее число ничего не
            говорит, если часть адресов никуда не уйдёт. */}
        <p data-part="counter" aria-live="polite">
          <span data-part="ok-count">
            {okTemplate.replace("{count}", String(ok))}
          </span>
          {bad > 0 ? (
            <>
              {" · "}
              <span data-part="bad-count">
                {badTemplate.replace("{count}", String(bad))}
              </span>
            </>
          ) : null}
        </p>
      </div>
    </>
  )
}
