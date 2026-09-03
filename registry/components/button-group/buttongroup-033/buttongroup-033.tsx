import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup033Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  options?: string[]
  question?: string
  error?: string
  errorId?: string
  name?: string
  /** Пусто — заливки нет, группа ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: обязательный выбор, который сам показывает ошибку.
// Ни один radio не отмечен заранее — иначе форма отправит значение, которое
// пользователь не выбирал. Пока выбора нет, корень попадает под селектор
// :not(:has(input:checked)): рамка сегментов краснеет, а строка ошибки
// раскрывается. Как только вариант выбран, всё возвращается в норму, и для
// этого не нужен ни один обработчик. Ошибка связана с полем через
// aria-describedby и продублирована значком: цвет один её не сообщает.
const STYLES = `
:where([data-vibeui-block="buttongroup-033"]){
--vibeui-buttongroup-033-surface:transparent;
--vibeui-buttongroup-033-fg:light-dark(oklch(0.25 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-033-muted:color-mix(in oklab,var(--vibeui-buttongroup-033-fg) 68%,transparent);
--vibeui-buttongroup-033-border:light-dark(oklch(0.89 0.008 265),oklch(0.39 0.012 265));
--vibeui-buttongroup-033-on:light-dark(oklch(0.96 0.03 265),oklch(0.33 0.06 265));
--vibeui-buttongroup-033-accent:light-dark(oklch(0.52 0.16 265),oklch(0.78 0.13 265));
--vibeui-buttongroup-033-danger:light-dark(oklch(0.55 0.19 27),oklch(0.75 0.16 27));
--vibeui-buttongroup-033-danger-soft:light-dark(oklch(0.97 0.02 27),oklch(0.31 0.06 27));
--vibeui-buttongroup-033-radius:0.625rem;
--vibeui-buttongroup-033-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-033"]{color-scheme:dark}
[data-vibeui-block="buttongroup-033"]{
box-sizing:border-box;display:block;width:100%;max-width:24rem;
margin:0;padding:0;border:0;
background:var(--vibeui-buttongroup-033-surface);
font-family:var(--vibeui-buttongroup-033-font);
}
[data-vibeui-block="buttongroup-033"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-033"] legend{
padding:0;margin:0 0 0.5rem;float:left;width:100%;clear:both;
color:var(--vibeui-buttongroup-033-fg);
font-size:0.8125rem;font-weight:650;line-height:1.35;
}
[data-vibeui-block="buttongroup-033"] [data-part="required"]{
color:var(--vibeui-buttongroup-033-danger);margin-inline-start:0.125rem;
}
[data-vibeui-block="buttongroup-033"] [data-part="track"]{display:flex;clear:both;isolation:isolate}
[data-vibeui-block="buttongroup-033"] [data-part="segment"]{
position:relative;z-index:0;flex:1 1 0;min-width:0;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;padding:0 0.625rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-033-border);
background:var(--vibeui-buttongroup-033-surface);
color:var(--vibeui-buttongroup-033-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-033"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-033-radius);
border-end-start-radius:var(--vibeui-buttongroup-033-radius);
}
[data-vibeui-block="buttongroup-033"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-033-radius);
border-end-end-radius:var(--vibeui-buttongroup-033-radius);
}
[data-vibeui-block="buttongroup-033"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-033"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-033-on);
border-color:var(--vibeui-buttongroup-033-accent);
color:var(--vibeui-buttongroup-033-accent);
}
[data-vibeui-block="buttongroup-033"] [data-part="segment"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-033-accent);outline-offset:1px;
}
/* Пока не выбрано ничего — группа в состоянии ошибки. Без JS. */
[data-vibeui-block="buttongroup-033"]:not(:has(input:checked)) [data-part="segment"]{
border-color:var(--vibeui-buttongroup-033-danger);
background:var(--vibeui-buttongroup-033-danger-soft);
}
[data-vibeui-block="buttongroup-033"] [data-part="error"]{
display:none;align-items:flex-start;gap:0.375rem;
margin:0.4375rem 0 0;
color:var(--vibeui-buttongroup-033-danger);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-033"]:not(:has(input:checked)) [data-part="error"]{display:flex}
[data-vibeui-block="buttongroup-033"] [data-part="error"] svg{
width:0.9375rem;height:0.9375rem;flex:none;margin-top:0.0625rem;
stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-033"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Наличными", "Картой", "По счёту"]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Обязательный выбор, показывающий ошибку одним CSS, пока ничего не выбрано.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup033({
  options = DEFAULT_OPTIONS,
  question = "Способ оплаты",
  error = "Выберите способ оплаты — без него заказ не оформить",
  errorId = "buttongroup-033-error",
  name = "buttongroup-033",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup033Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-033-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-033-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-033" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-033"
        className={className}
        style={palette}
        aria-describedby={errorId}
      >
        <legend>
          {question}
          <span data-part="required" aria-hidden="true">
            *
          </span>
        </legend>
        <div data-part="track">
          {options.map((option) => (
            <label key={option} data-part="segment">
              <input type="radio" name={name} value={option} required />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <p data-part="error" id={errorId}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v10M12 18h.01" />
          </svg>
          <span>{error}</span>
        </p>
      </fieldset>
    </>
  )
}
