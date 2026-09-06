import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Phoneinput007Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  placeholder?: string
  extensionLabel?: string
  extensionPlaceholder?: string
  /** Строка под парой полей. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: добавочный — отдельное значение, а не хвост номера.
// Он живёт в своём поле с autoComplete="tel-extension", поэтому браузер
// не подставляет его в основной номер и не путает автозаполнение.
// Ширина добавочного фиксирована и мала: она сама говорит, что там
// три-четыре цифры, а не второй телефон.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="phoneinput-007"]){
--vibeui-phoneinput-007-surface:transparent;
--vibeui-phoneinput-007-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-phoneinput-007-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-phoneinput-007-muted:color-mix(in oklab,var(--vibeui-phoneinput-007-fg) 68%,transparent);
--vibeui-phoneinput-007-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-phoneinput-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-phoneinput-007-radius:0.625rem;
--vibeui-phoneinput-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="phoneinput-007"]{color-scheme:dark}
[data-vibeui-block="phoneinput-007"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-007-surface);
border:1px solid var(--vibeui-phoneinput-007-surface-border);
font-family:var(--vibeui-phoneinput-007-font);color:var(--vibeui-phoneinput-007-fg);
}
/* Раскладка лежит на оболочке, а не на корне: правило внутри @container
   действует только на потомков контейнера. */
[data-vibeui-block="phoneinput-007"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="phoneinput-007"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.375rem;min-width:0;
}
[data-vibeui-block="phoneinput-007"] [data-part="cell"][data-role="extension"]{flex:none}
[data-vibeui-block="phoneinput-007"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="phoneinput-007"] [data-part="cell"][data-role="extension"] label{
font-weight:500;color:var(--vibeui-phoneinput-007-muted);
}
[data-vibeui-block="phoneinput-007"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-007-fg);
background:var(--vibeui-phoneinput-007-surface);
border:1px solid var(--vibeui-phoneinput-007-field-border);
border-radius:var(--vibeui-phoneinput-007-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-007"] input::placeholder{color:var(--vibeui-phoneinput-007-muted)}
[data-vibeui-block="phoneinput-007"] input:focus-visible{
outline:none;border-color:var(--vibeui-phoneinput-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-007-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-007"] [data-part="hint"]{
margin:0.5rem 0 0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-phoneinput-007-muted);
}
@container (min-width: 20rem){
[data-vibeui-block="phoneinput-007"] [data-part="shell"]{
flex-direction:row;align-items:flex-end;gap:0.5rem;
}
[data-vibeui-block="phoneinput-007"] [data-part="cell"][data-role="extension"]{width:6rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-007"] *{animation:none!important;transition:none!important}}
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
 * Телефон с отдельным полем добавочного: два значения, два поля, разные
 * подсказки автозаполнения. Один файл, ноль зависимостей.
 */
export function Phoneinput007({
  label = "Рабочий телефон",
  placeholder = "+7 495 123-45-67",
  extensionLabel = "Добавочный",
  extensionPlaceholder = "1234",
  hint = "Добавочный необязателен: без него позвоним на общий номер.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Phoneinput007Props) {
  const id = useId()
  const extensionId = `${id}-extension`
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-phoneinput-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="phone-input"
        data-vibeui-block="phoneinput-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="cell" data-role="number">
            <label htmlFor={id}>{label}</label>
            <input
              id={id}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={placeholder}
              aria-describedby={hintId}
            />
          </div>
          <div data-part="cell" data-role="extension">
            <label htmlFor={extensionId}>{extensionLabel}</label>
            <input
              id={extensionId}
              name="extension"
              type="text"
              inputMode="numeric"
              autoComplete="tel-extension"
              placeholder={extensionPlaceholder}
            />
          </div>
        </div>
        <p data-part="hint" id={hintId}>
          {hint}
        </p>
      </div>
    </>
  )
}
