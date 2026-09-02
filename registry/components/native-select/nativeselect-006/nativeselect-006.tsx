import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Nativeselect006Props = Omit<
  ComponentPropsWithoutRef<"select">,
  "children" | "size" | "defaultValue"
> & {
  label?: string
  error?: string
  options?: string[]
  /** Текст пустого пункта: он показан в закрытом поле, но недоступен в списке. */
  placeholder?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у select ошибка почти всегда одна — «не выбрано», и
// всплывающая подсказка браузера её показывает ровно один раз, а потом
// исчезает. Здесь сообщение живёт в разметке постоянно: полоса слева
// у текста ошибки держит взгляд у поля, стрелка и рамка перекрашиваются
// от того же aria-invalid, что и сообщение.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// блока по умолчанию нет, а поле, границы и цвет ошибки получают свои
// пары светлот.
const STYLES = `
:where([data-vibeui-block="nativeselect-006"]){
--vibeui-nativeselect-006-bg:transparent;
--vibeui-nativeselect-006-line:light-dark(oklch(0.91 0.006 265),oklch(0.33 0.012 265));
--vibeui-nativeselect-006-field:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-nativeselect-006-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.004 265));
--vibeui-nativeselect-006-muted:light-dark(oklch(0.58 0.014 265),oklch(0.66 0.012 265));
--vibeui-nativeselect-006-field-border:light-dark(oklch(0.85 0.01 265),oklch(0.42 0.014 265));
--vibeui-nativeselect-006-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-nativeselect-006-error:light-dark(oklch(0.55 0.2 25),oklch(0.74 0.16 25));
--vibeui-nativeselect-006-radius:0.625rem;
--vibeui-nativeselect-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="nativeselect-006"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-nativeselect-006-bg);
border:1px solid var(--vibeui-nativeselect-006-line);
font-family:var(--vibeui-nativeselect-006-font);color:var(--vibeui-nativeselect-006-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="nativeselect-006"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="nativeselect-006"] [data-part="field"]{position:relative;display:flex}
[data-vibeui-block="nativeselect-006"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:100%;height:2.5rem;
padding:0 2.25rem 0 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.2;
color:var(--vibeui-nativeselect-006-muted);
background:var(--vibeui-nativeselect-006-field);
border:1px solid var(--vibeui-nativeselect-006-field-border);
border-radius:var(--vibeui-nativeselect-006-radius);
cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="nativeselect-006"] select:not(:invalid){color:var(--vibeui-nativeselect-006-fg)}
[data-vibeui-block="nativeselect-006"] select[aria-invalid="true"]{
border-color:var(--vibeui-nativeselect-006-error);
}
[data-vibeui-block="nativeselect-006"] select:focus-visible{
outline:none;border-color:var(--vibeui-nativeselect-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-006-accent) 22%,transparent);
}
[data-vibeui-block="nativeselect-006"] select[aria-invalid="true"]:focus-visible{
border-color:var(--vibeui-nativeselect-006-error);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-nativeselect-006-error) 22%,transparent);
}
[data-vibeui-block="nativeselect-006"] option{color:var(--vibeui-nativeselect-006-fg)}
[data-vibeui-block="nativeselect-006"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;pointer-events:none;
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-nativeselect-006-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-006-muted);
translate:0 -0.1875rem;rotate:45deg;
}
/* Одна точка правды — aria-invalid на поле: подпись, стрелка и сообщение
   красятся от него, поэтому состояния не расходятся. */
[data-vibeui-block="nativeselect-006"]:has(select[aria-invalid="true"]) label{
color:var(--vibeui-nativeselect-006-error);
}
[data-vibeui-block="nativeselect-006"]:has(select[aria-invalid="true"]) [data-part="arrow"]{
border-color:var(--vibeui-nativeselect-006-error);
}
[data-vibeui-block="nativeselect-006"] [data-part="error"]{
margin:0;padding-left:0.5rem;
border-left:2px solid var(--vibeui-nativeselect-006-error);
font-size:0.8125rem;line-height:1.4;color:var(--vibeui-nativeselect-006-error);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-006"] *{animation:none!important;transition:none!important}}
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
 * Нативный select с постоянным сообщением об ошибке вместо всплывающей
 * подсказки браузера. Один файл, ноль зависимостей.
 */
export function Nativeselect006({
  label = "Способ оплаты",
  error = "Выберите способ оплаты — без него заказ не оформить.",
  options = ["Картой онлайн", "Наличными курьеру", "Счёт для юрлица"],
  placeholder = "Не выбрано",
  background = "",
  accent,
  className,
  style,
  ...props
}: Nativeselect006Props) {
  const id = useId()
  const errorId = `${id}-error`
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-nativeselect-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-006" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="nativeselect-006"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <select
            {...props}
            id={id}
            name="payment"
            required
            defaultValue=""
            aria-invalid="true"
            aria-describedby={errorId}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </div>
        <p data-part="error" id={errorId}>
          {error}
        </p>
      </div>
    </>
  )
}
