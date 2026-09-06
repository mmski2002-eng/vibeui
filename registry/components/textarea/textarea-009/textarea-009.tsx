"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Textarea009Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  /** Невидимая подпись поля: у промпт-бокса нет места под строку над рамкой. */
  label?: string
  placeholder?: string
  /** Подсказка слева внизу рамки. */
  hint?: string
  /** Мягкий предел: счётчик краснеет, отправка блокируется, ввод — нет. */
  limit?: number
  /** Высота в строках, после которой поле начинает прокручиваться. */
  maxRows?: number
  /** Подпись кнопки отправки — она же её aria-label. */
  sendLabel?: string
  /** Строка под рамкой после отправки; {chars} — длина отправленного текста. */
  sentText?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
  accent?: string
  onSend?: (value: string) => void
}

// Идея компонента: поле ввода запроса к модели — одна рамка, в которой живут
// и текст, и отправка. Кнопка стоит внутри рамки, а не рядом с ней: в чате
// это единственный элемент управления, и выносить его наружу означает
// разорвать поле на две цели.
//
// Enter отправляет, Shift+Enter переносит строку — договор, который человек
// уже знает по мессенджерам, поэтому он написан подсказкой прямо в рамке, а
// не спрятан в справку. Отправка не срабатывает во время набора иероглифов
// (isComposing): там Enter подтверждает выбор в IME, а не заканчивает мысль.
//
// Высоту держит невидимая копия текста в той же ячейке grid: поле растёт до
// maxRows и дальше прокручивается, без замеров scrollHeight и без рывка на
// каждый символ.
const STYLES = `
:where([data-vibeui-block="textarea-009"]){
--vibeui-textarea-009-bg:transparent;
--vibeui-textarea-009-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-textarea-009-muted:color-mix(in oklab,var(--vibeui-textarea-009-fg) 62%,transparent);
--vibeui-textarea-009-field:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-textarea-009-border:light-dark(oklch(0.88 0 265),oklch(0.37 0 265));
--vibeui-textarea-009-accent:light-dark(oklch(0.54 0.19 39.8),oklch(0.74 0.15 39.8));
--vibeui-textarea-009-on-accent:oklch(from var(--vibeui-textarea-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-textarea-009-danger:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.16 25));
--vibeui-textarea-009-radius:1.125rem;
--vibeui-textarea-009-line:1.55;
--vibeui-textarea-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="textarea-009"]{color-scheme:dark}
[data-vibeui-block="textarea-009"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:34rem;box-sizing:border-box;
background:var(--vibeui-textarea-009-bg);color:var(--vibeui-textarea-009-fg);
font-family:var(--vibeui-textarea-009-font);
}
[data-vibeui-block="textarea-009"] *{box-sizing:border-box}
[data-vibeui-block="textarea-009"] [data-part="box"]{
display:flex;flex-direction:column;
background:var(--vibeui-textarea-009-field);
border:1px solid var(--vibeui-textarea-009-border);
border-radius:var(--vibeui-textarea-009-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-009"] [data-part="box"]:focus-within{
border-color:var(--vibeui-textarea-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-009-accent) 20%,transparent);
}
[data-vibeui-block="textarea-009"][data-over="true"] [data-part="box"]{border-color:var(--vibeui-textarea-009-danger)}
/* Поле и его невидимая копия лежат в одной ячейке: высоту задаёт копия. */
[data-vibeui-block="textarea-009"] [data-part="grow"]{display:grid}
[data-vibeui-block="textarea-009"] [data-part="grow"]::after{
content:attr(data-value) " ";
visibility:hidden;white-space:pre-wrap;word-break:break-word;
}
[data-vibeui-block="textarea-009"] [data-part="grow"] > textarea,
[data-vibeui-block="textarea-009"] [data-part="grow"]::after{
grid-area:1 / 1 / 2 / 2;
padding:0.8125rem 1rem 0.375rem;
font:inherit;font-size:0.9375rem;line-height:var(--vibeui-textarea-009-line);
}
[data-vibeui-block="textarea-009"] textarea{
margin:0;border:0;outline:none;resize:none;overflow:auto;
min-width:0;background:transparent;color:inherit;
min-height:calc(1 * var(--vibeui-textarea-009-line) * 0.9375rem + 1.1875rem);
max-height:calc(var(--vibeui-textarea-009-max-rows,8) * var(--vibeui-textarea-009-line) * 0.9375rem + 1.1875rem);
}
[data-vibeui-block="textarea-009"] textarea::placeholder{color:color-mix(in oklab,var(--vibeui-textarea-009-muted) 72%,transparent)}
[data-vibeui-block="textarea-009"] [data-part="bar"]{
display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;
padding:0.25rem 0.5rem 0.5rem 1rem;
}
[data-vibeui-block="textarea-009"] [data-part="hint"]{
flex:1 1 8rem;min-width:0;
font-size:0.75rem;line-height:1.35;color:var(--vibeui-textarea-009-muted);
}
[data-vibeui-block="textarea-009"] [data-part="hint"] kbd{
font:inherit;font-size:0.6875rem;
padding:0 0.25rem;border-radius:0.25rem;
border:1px solid var(--vibeui-textarea-009-border);border-bottom-width:2px;
}
[data-vibeui-block="textarea-009"] [data-part="count"]{
margin-left:auto;font-size:0.75rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-textarea-009-muted);
}
[data-vibeui-block="textarea-009"][data-over="true"] [data-part="count"]{color:var(--vibeui-textarea-009-danger);font-weight:650}
/* Кнопка квадратная и без подписи: перевод внутрь не попадает, поэтому
   фиксированный размер здесь не грозит обрезанным текстом. */
[data-vibeui-block="textarea-009"] [data-part="send"]{
flex:none;appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:999px;
background:var(--vibeui-textarea-009-accent);color:var(--vibeui-textarea-009-on-accent);
transition:opacity .16s ease;
}
[data-vibeui-block="textarea-009"] [data-part="send"] svg{width:1rem;height:1rem;display:block}
[data-vibeui-block="textarea-009"] [data-part="send"]:focus-visible{outline:2px solid var(--vibeui-textarea-009-accent);outline-offset:2px}
[data-vibeui-block="textarea-009"] [data-part="send"]:disabled{cursor:not-allowed;opacity:.4}
[data-vibeui-block="textarea-009"] [data-part="status"]{
margin:0;padding:0 0.25rem;min-height:1.0625rem;
font-size:0.75rem;color:var(--vibeui-textarea-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-009"] *{animation:none!important;transition:none!important}}
`

const START = "Собери лендинг для студии озеленения: герой, услуги, отзывы."

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
 * Поле запроса к модели с отправкой внутри рамки: растёт под текст, Enter
 * отправляет, Shift+Enter переносит строку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea009({
  label = "Запрос к ассистенту",
  placeholder = "Опишите, что нужно сделать",
  hint = "Enter — отправить, Shift+Enter — перенос",
  limit = 2000,
  maxRows = 8,
  sendLabel = "Отправить",
  sentText = "Отправлено, символов: {chars}",
  defaultValue = START,
  background = "",
  accent,
  className,
  style,
  onSend,
  ...props
}: Textarea009Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [sent, setSent] = useState<number | null>(null)

  const trimmed = value.trim()
  const over = value.length > limit
  const canSend = trimmed.length > 0 && !over

  const send = () => {
    if (!canSend) {
      return
    }

    setSent(trimmed.length)
    setValue("")
    onSend?.(trimmed)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // nativeEvent.isComposing: в IME Enter подтверждает выбор иероглифа, и
    // отправка на нём оборвала бы набор на середине слова.
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      send()
    }
  }

  const palette = {
    "--vibeui-textarea-009-max-rows": maxRows,
    ...(accent ? { "--vibeui-textarea-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-textarea-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="textarea"
        data-vibeui-block="textarea-009"
        data-over={over}
        className={className}
        style={palette}
      >
        <div data-part="box">
          <div data-part="grow" data-value={value}>
            <textarea
              id={id}
              rows={1}
              value={value}
              placeholder={placeholder}
              aria-label={label}
              aria-describedby={`${id}-hint ${id}-count`}
              aria-invalid={over}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
          <div data-part="bar">
            <span data-part="hint" id={`${id}-hint`}>
              {hint}
            </span>
            <span data-part="count" id={`${id}-count`}>
              {value.length} / {limit}
            </span>
            <button
              type="button"
              data-part="send"
              aria-label={sendLabel}
              title={sendLabel}
              disabled={!canSend}
              onClick={send}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 13V3m0 0L3.5 7.5M8 3l4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <p data-part="status" role="status">
          {sent === null ? "" : sentText.replace("{chars}", String(sent))}
        </p>
      </div>
    </>
  )
}
