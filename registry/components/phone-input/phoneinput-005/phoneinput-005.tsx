import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Phoneinput005Props = Omit<
  ComponentPropsWithoutRef<"input">,
  "children" | "type" | "size"
> & {
  label?: string
  example?: string
  /** Подпись перед образцом. */
  exampleLabel?: string
  note?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: вместо жёсткой маски — показанный образец. Поле
// принимает что угодно, а под ним стоит пример в моноширинном начертании,
// помеченный <samp>: это образец, а не введённое значение. Так номер из
// буфера с любыми скобками и дефисами вставляется без борьбы с полем,
// а человек всё равно видит, какой вид мы ждём.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="phoneinput-005"]){
--vibeui-phoneinput-005-surface:transparent;
--vibeui-phoneinput-005-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.33 0.012 265));
--vibeui-phoneinput-005-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-phoneinput-005-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-phoneinput-005-sample-bg:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.01 265));
--vibeui-phoneinput-005-field-border:light-dark(oklch(0.85 0.01 265),oklch(0.4 0.014 265));
--vibeui-phoneinput-005-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-phoneinput-005-radius:0.625rem;
--vibeui-phoneinput-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-phoneinput-005-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="phoneinput-005"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-005-surface);
border:1px solid var(--vibeui-phoneinput-005-surface-border);
font-family:var(--vibeui-phoneinput-005-font);color:var(--vibeui-phoneinput-005-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="phoneinput-005"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="phoneinput-005"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-005-fg);
background:var(--vibeui-phoneinput-005-surface);
border:1px solid var(--vibeui-phoneinput-005-field-border);
border-radius:var(--vibeui-phoneinput-005-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-005"] input::placeholder{color:var(--vibeui-phoneinput-005-muted)}
[data-vibeui-block="phoneinput-005"] input:focus-visible{
outline:none;border-color:var(--vibeui-phoneinput-005-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-005-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-005"] [data-part="format"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;margin:0;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-phoneinput-005-muted);
}
/* Образец набран моноширинным и лежит в подложке: так его не спутать с
   уже введённым значением и не прочитать как подпись. */
[data-vibeui-block="phoneinput-005"] samp{
padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-phoneinput-005-sample-bg);
font-family:var(--vibeui-phoneinput-005-mono);font-size:0.8125rem;
color:var(--vibeui-phoneinput-005-fg);white-space:nowrap;
}
[data-vibeui-block="phoneinput-005"] [data-part="note"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-phoneinput-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-005"] *{animation:none!important;transition:none!important}}
`

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
 * Телефон с показанным образцом формата вместо жёсткой маски: поле
 * принимает любой вид записи. Один файл, ноль зависимостей.
 */
export function Phoneinput005({
  label = "Телефон для связи",
  example = "+7 999 123-45-67",
  exampleLabel = "Например:",
  note = "Скобки, дефисы и пробелы можно оставить — приведём к одному виду при отправке.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Phoneinput005Props) {
  const id = useId()
  const formatId = `${id}-format`
  const noteId = `${id}-note`
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-phoneinput-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="phoneinput-005"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          {...props}
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={example}
          aria-describedby={`${formatId} ${noteId}`}
        />
        <p data-part="format" id={formatId}>
          {exampleLabel} <samp>{example}</samp>
        </p>
        <p data-part="note" id={noteId}>
          {note}
        </p>
      </div>
    </>
  )
}
