"use client"

import { useId, useState } from "react"
import type { ChangeEvent, ComponentProps, CSSProperties } from "react"

export type Textarea010File = {
  name: string
  /** Размер в байтах: подпись собирается из него и units. */
  size: number
}

export type Textarea010Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  /** Невидимая подпись поля: над рамкой строки нет. */
  label?: string
  placeholder?: string
  /** Вложения, с которыми поле открывается. */
  files?: Textarea010File[]
  /** Потолок вложений: на нём кнопка «Прикрепить» гаснет. */
  maxFiles?: number
  /** Подпись кнопки выбора файлов. */
  attachLabel?: string
  /** Подпись кнопки отправки. */
  sendLabel?: string
  /** aria-label крестика; {name} — имя файла. */
  removeLabel?: string
  /** Кратные 1024 единицы размера, от байтов к большим. */
  units?: string[]
  /** Строка под рамкой после отправки; {count} — число вложений. */
  sentText?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
  accent?: string
  onSend?: (value: string, files: Textarea010File[]) => void
}

// Идея компонента: поле сообщения, у которого вложения живут внутри той же
// рамки, а не отдельной зоной загрузки под ней. Файл здесь — часть реплики,
// поэтому он показан фишкой с именем, размером и крестиком, а не строкой
// очереди с прогрессом: отправка ещё не началась, показывать нечего.
//
// Кнопка «Прикрепить» — настоящий input type="file" внутри подписи: так
// работают и клавиатура, и телефон, а обходной клик по скрытому полю через
// ref не нужен вовсе. Длинное имя урезается многоточием, но целиком остаётся
// в title и в aria-label крестика: по обрезку файл не опознать.
const STYLES = `
:where([data-vibeui-block="textarea-010"]){
--vibeui-textarea-010-bg:transparent;
--vibeui-textarea-010-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-textarea-010-muted:color-mix(in oklab,var(--vibeui-textarea-010-fg) 62%,transparent);
--vibeui-textarea-010-field:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-textarea-010-chip:light-dark(oklch(0.965 0.004 265),oklch(0.31 0.012 265));
--vibeui-textarea-010-border:light-dark(oklch(0.88 0.008 265),oklch(0.37 0.014 265));
--vibeui-textarea-010-accent:light-dark(oklch(0.54 0.19 265),oklch(0.74 0.15 265));
--vibeui-textarea-010-on-accent:oklch(from var(--vibeui-textarea-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-textarea-010-radius:1.125rem;
--vibeui-textarea-010-line:1.55;
--vibeui-textarea-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="textarea-010"]{color-scheme:dark}
[data-vibeui-block="textarea-010"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:34rem;box-sizing:border-box;
background:var(--vibeui-textarea-010-bg);color:var(--vibeui-textarea-010-fg);
font-family:var(--vibeui-textarea-010-font);
}
[data-vibeui-block="textarea-010"] *{box-sizing:border-box}
[data-vibeui-block="textarea-010"] [data-part="box"]{
display:flex;flex-direction:column;
background:var(--vibeui-textarea-010-field);
border:1px solid var(--vibeui-textarea-010-border);
border-radius:var(--vibeui-textarea-010-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="textarea-010"] [data-part="box"]:focus-within{
border-color:var(--vibeui-textarea-010-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-textarea-010-accent) 20%,transparent);
}
[data-vibeui-block="textarea-010"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
list-style:none;margin:0;padding:0.75rem 0.875rem 0;
}
[data-vibeui-block="textarea-010"] [data-part="chip"]{
display:flex;align-items:center;gap:0.375rem;
max-width:100%;min-width:0;
padding:0.25rem 0.25rem 0.25rem 0.5rem;
border:1px solid var(--vibeui-textarea-010-border);border-radius:0.5rem;
background:var(--vibeui-textarea-010-chip);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="textarea-010"] [data-part="chip"] svg{flex:none;width:0.875rem;height:0.875rem;color:var(--vibeui-textarea-010-muted)}
[data-vibeui-block="textarea-010"] [data-part="name"]{
min-width:0;max-width:9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="textarea-010"] [data-part="size"]{flex:none;color:var(--vibeui-textarea-010-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="textarea-010"] [data-part="remove"]{
flex:none;appearance:none;border:0;cursor:pointer;background:none;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:0.375rem;
}
[data-vibeui-block="textarea-010"] [data-part="remove"]:hover{background:color-mix(in oklab,var(--vibeui-textarea-010-fg) 10%,transparent)}
[data-vibeui-block="textarea-010"] [data-part="remove"]:focus-visible{outline:2px solid var(--vibeui-textarea-010-accent);outline-offset:1px}
[data-vibeui-block="textarea-010"] [data-part="grow"]{display:grid}
[data-vibeui-block="textarea-010"] [data-part="grow"]::after{
content:attr(data-value) " ";
visibility:hidden;white-space:pre-wrap;word-break:break-word;
}
[data-vibeui-block="textarea-010"] [data-part="grow"] > textarea,
[data-vibeui-block="textarea-010"] [data-part="grow"]::after{
grid-area:1 / 1 / 2 / 2;
padding:0.75rem 1rem 0.375rem;
font:inherit;font-size:0.9375rem;line-height:var(--vibeui-textarea-010-line);
}
[data-vibeui-block="textarea-010"] textarea{
margin:0;border:0;outline:none;resize:none;overflow:auto;
min-width:0;background:transparent;color:inherit;
min-height:calc(2 * var(--vibeui-textarea-010-line) * 0.9375rem + 1.125rem);
max-height:calc(8 * var(--vibeui-textarea-010-line) * 0.9375rem + 1.125rem);
}
[data-vibeui-block="textarea-010"] textarea::placeholder{color:color-mix(in oklab,var(--vibeui-textarea-010-muted) 72%,transparent)}
[data-vibeui-block="textarea-010"] [data-part="bar"]{
display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;
padding:0.25rem 0.5rem 0.5rem;
}
/* Подпись настраивается и переводится: высота набирается содержимым. */
[data-vibeui-block="textarea-010"] [data-part="attach"]{
display:inline-flex;align-items:center;gap:0.375rem;cursor:pointer;
position:relative;min-height:2rem;padding:0.25rem 0.625rem;
border-radius:0.5rem;font-size:0.8125rem;color:var(--vibeui-textarea-010-muted);
}
[data-vibeui-block="textarea-010"] [data-part="attach"] svg{width:0.9375rem;height:0.9375rem}
[data-vibeui-block="textarea-010"] [data-part="attach"]:hover{background:color-mix(in oklab,var(--vibeui-textarea-010-fg) 8%,transparent)}
[data-vibeui-block="textarea-010"] [data-part="attach"]:focus-within{outline:2px solid var(--vibeui-textarea-010-accent);outline-offset:1px}
/* Настоящий input, а не ref-клик по скрытому полю: клавиатура и телефон
   получают штатный выбор файла. Видимости нет, фокусируемость есть. */
[data-vibeui-block="textarea-010"] [data-part="attach"] input{
position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;
}
[data-vibeui-block="textarea-010"] [data-part="attach"]:has(input:disabled){cursor:not-allowed;opacity:.45}
[data-vibeui-block="textarea-010"] [data-part="count"]{
margin-left:auto;font-size:0.75rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-textarea-010-muted);
}
[data-vibeui-block="textarea-010"] [data-part="send"]{
flex:none;appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2rem;padding:0.25rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-textarea-010-accent);color:var(--vibeui-textarea-010-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:opacity .16s ease;
}
[data-vibeui-block="textarea-010"] [data-part="send"]:focus-visible{outline:2px solid var(--vibeui-textarea-010-accent);outline-offset:2px}
[data-vibeui-block="textarea-010"] [data-part="send"]:disabled{cursor:not-allowed;opacity:.4}
[data-vibeui-block="textarea-010"] [data-part="status"]{
margin:0;padding:0 0.25rem;min-height:1.0625rem;
font-size:0.75rem;color:var(--vibeui-textarea-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="textarea-010"] *{animation:none!important;transition:none!important}}
`

const START = "Посмотри макет и текст брифа — что поправить в первом экране?"

const FILES: Textarea010File[] = [
  { name: "hero-macket.fig", size: 2_411_724 },
  { name: "brief-2025.pdf", size: 184_320 },
  { name: "палитра.png", size: 43_008 },
]

const UNITS = ["Б", "КБ", "МБ", "ГБ"]

/**
 * Подпись размера в кратных 1024 единицах. Файл на 900 байт как «0,9 КБ»
 * читается хуже, чем «900 Б», поэтому единица выбирается по величине.
 */
function formatSize(size: number, units: string[]): string {
  const step = Math.min(
    units.length - 1,
    size > 0 ? Math.floor(Math.log(size) / Math.log(1024)) : 0,
  )
  const value = size / 1024 ** step

  return `${step === 0 ? value : Number(value.toFixed(1))} ${units[step]}`
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
 * Поле сообщения с вложениями: файлы стоят фишками внутри той же рамки, у
 * каждой имя, размер и крестик.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Textarea010({
  label = "Сообщение с вложениями",
  placeholder = "Напишите сообщение или прикрепите файл",
  files = FILES,
  maxFiles = 5,
  attachLabel = "Прикрепить",
  sendLabel = "Отправить",
  removeLabel = "Убрать {name}",
  units = UNITS,
  sentText = "Отправлено, вложений: {count}",
  defaultValue = START,
  background = "",
  accent,
  className,
  style,
  onSend,
  ...props
}: Textarea010Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [attached, setAttached] = useState<Textarea010File[]>(files)
  const [sent, setSent] = useState<number | null>(null)

  const full = attached.length >= maxFiles
  const canSend = value.trim().length > 0 || attached.length > 0

  const onPick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = [...(event.target.files ?? [])].map((file) => ({
      name: file.name,
      size: file.size,
    }))

    setAttached((current) =>
      [...current, ...picked].slice(0, Math.max(maxFiles, current.length)),
    )
    event.target.value = ""
  }

  const send = () => {
    if (!canSend) {
      return
    }

    setSent(attached.length)
    setValue("")
    setAttached([])
    onSend?.(value.trim(), attached)
  }

  const palette = {
    ...(accent ? { "--vibeui-textarea-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-textarea-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-textarea-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="textarea"
        data-vibeui-block="textarea-010"
        className={className}
        style={palette}
      >
        <div data-part="box">
          {attached.length > 0 ? (
            <ul data-part="chips" aria-label={attachLabel}>
              {attached.map((file, index) => (
                <li key={`${file.name}-${index}`} data-part="chip">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M9 2.5H4.5v11h7V5m-2.5-2.5L11.5 5m-3-2.5V5h3"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span data-part="name" title={file.name}>
                    {file.name}
                  </span>
                  <span data-part="size">{formatSize(file.size, units)}</span>
                  <button
                    type="button"
                    data-part="remove"
                    aria-label={removeLabel.replace("{name}", file.name)}
                    onClick={() =>
                      setAttached((current) =>
                        current.filter((_, at) => at !== index),
                      )
                    }
                  >
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="m4.5 4.5 7 7m0-7-7 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <div data-part="grow" data-value={value}>
            <textarea
              id={id}
              rows={2}
              value={value}
              placeholder={placeholder}
              aria-label={label}
              aria-describedby={`${id}-count`}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
          <div data-part="bar">
            <label data-part="attach">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M11.5 7.5 7 12a2.5 2.5 0 0 1-3.5-3.5l5-5a1.75 1.75 0 1 1 2.5 2.5l-5 5a1 1 0 0 1-1.5-1.5L9 5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {attachLabel}
              <input
                type="file"
                multiple
                disabled={full}
                onChange={onPick}
                aria-label={attachLabel}
              />
            </label>
            <span data-part="count" id={`${id}-count`}>
              {attached.length} / {maxFiles}
            </span>
            <button
              type="button"
              data-part="send"
              disabled={!canSend}
              onClick={send}
            >
              {sendLabel}
            </button>
          </div>
        </div>
        <p data-part="status" role="status">
          {sent === null ? "" : sentText.replace("{count}", String(sent))}
        </p>
      </div>
    </>
  )
}
