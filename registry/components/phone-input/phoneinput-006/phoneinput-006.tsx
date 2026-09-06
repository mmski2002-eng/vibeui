import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Phoneinput006Props = Omit<
  ComponentProps<"input">,
  "children" | "type" | "size" | "defaultValue"
> & {
  label?: string
  error?: string
  defaultValue?: string
  example?: string
  /** Подпись строки с набранным номером. */
  typedLabel?: string
  /** Подпись строки с ожидаемым номером. */
  expectedLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сообщение об ошибке показывает разницу, а не диагноз.
// Рядом стоят два образца — что набрано и что ожидается, — поэтому
// пропущенную цифру видно глазами. Введённое значение при этом остаётся
// в поле: очищать его при ошибке — самый быстрый способ заставить
// человека уйти с формы.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="phoneinput-006"]){
--vibeui-phoneinput-006-surface:transparent;
--vibeui-phoneinput-006-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-phoneinput-006-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-phoneinput-006-muted:color-mix(in oklab,var(--vibeui-phoneinput-006-fg) 68%,transparent);
--vibeui-phoneinput-006-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-phoneinput-006-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-phoneinput-006-error:light-dark(oklch(0.55 0.2 25),oklch(0.75 0.16 25));
--vibeui-phoneinput-006-error-soft:light-dark(oklch(0.96 0.03 25),oklch(0.3 0.05 25));
--vibeui-phoneinput-006-radius:0.625rem;
--vibeui-phoneinput-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-phoneinput-006-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="phoneinput-006"]{color-scheme:dark}
[data-vibeui-block="phoneinput-006"]{
box-sizing:border-box;width:100%;max-width:23rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-006-surface);
border:1px solid var(--vibeui-phoneinput-006-surface-border);
font-family:var(--vibeui-phoneinput-006-font);color:var(--vibeui-phoneinput-006-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="phoneinput-006"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
transition:color .16s ease;
}
[data-vibeui-block="phoneinput-006"]:has(input[aria-invalid="true"]) label{
color:var(--vibeui-phoneinput-006-error);
}
[data-vibeui-block="phoneinput-006"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-006-fg);
background:var(--vibeui-phoneinput-006-surface);
border:1px solid var(--vibeui-phoneinput-006-field-border);
border-radius:var(--vibeui-phoneinput-006-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-006"] input[aria-invalid="true"]{
border-color:var(--vibeui-phoneinput-006-error);
}
[data-vibeui-block="phoneinput-006"] input:focus-visible{
outline:none;border-color:var(--vibeui-phoneinput-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-006-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-006"] input[aria-invalid="true"]:focus-visible{
border-color:var(--vibeui-phoneinput-006-error);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-006-error) 22%,transparent);
}
[data-vibeui-block="phoneinput-006"] [data-part="error"]{
margin:0;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-phoneinput-006-error-soft);
font-size:0.8125rem;line-height:1.45;color:var(--vibeui-phoneinput-006-error);
display:flex;flex-direction:column;gap:0.375rem;
}
/* Две строки образцов выровнены в сетку: подписи «набрано» и «нужно»
   стоят одна под другой, поэтому цифры сравниваются взглядом сверху вниз. */
[data-vibeui-block="phoneinput-006"] [data-part="compare"]{
display:grid;grid-template-columns:auto 1fr;gap:0.125rem 0.5rem;
align-items:baseline;
}
[data-vibeui-block="phoneinput-006"] [data-part="key"]{
font-size:0.75rem;color:var(--vibeui-phoneinput-006-muted);
}
[data-vibeui-block="phoneinput-006"] samp{
font-family:var(--vibeui-phoneinput-006-mono);font-size:0.8125rem;
color:var(--vibeui-phoneinput-006-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-006"] *{animation:none!important;transition:none!important}}
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
 * Телефон в состоянии ошибки: рядом показаны набранное и ожидаемое, а
 * введённое значение не стирается. Один файл, ноль зависимостей.
 */
export function Phoneinput006({
  label = "Телефон",
  error = "Номер не похож на настоящий: после кода +7 должно быть десять цифр, а набрано семь.",
  defaultValue = "+7 999 12-34",
  example = "+7 999 123-45-67",
  typedLabel = "набрано",
  expectedLabel = "нужно",
  background = "",
  accent,
  className,
  style,
  ...props
}: Phoneinput006Props) {
  const id = useId()
  const errorId = `${id}-error`
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-phoneinput-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-006" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="phone-input"
        data-vibeui-block="phoneinput-006"
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
          defaultValue={defaultValue}
          aria-invalid="true"
          aria-describedby={errorId}
        />
        <div data-part="error" id={errorId}>
          <span>{error}</span>
          <span data-part="compare">
            <span data-part="key">{typedLabel}</span>
            <samp>{defaultValue}</samp>
            <span data-part="key">{expectedLabel}</span>
            <samp>{example}</samp>
          </span>
        </div>
      </div>
    </>
  )
}
