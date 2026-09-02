import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  toggleText?: string
  answer?: string
  placeholder?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: попап хорош, когда пояснение короткое, но длинный ответ
// в плавающем блоке обрезается или перекрывает соседние поля. Здесь
// раскрытие нативное — <details>/<summary>: ответ разворачивается прямо в
// потоке формы, сдвигая всё, что ниже, а не наслаивается сверху. JS не
// нужен: open/closed и aria-expanded браузер ведёт сам.
const STYLES = `
:where([data-vibeui-block="label-010"]){
--vibeui-label-010-surface:transparent;
--vibeui-label-010-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.33 0.012 265));
--vibeui-label-010-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-label-010-muted:light-dark(oklch(0.54 0.014 265),oklch(0.7 0.012 265));
--vibeui-label-010-field-border:light-dark(oklch(0.85 0.01 265),oklch(0.4 0.014 265));
--vibeui-label-010-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-label-010-answer-bg:light-dark(oklch(0.97 0.004 265),oklch(0.28 0.011 265));
/* Наведение уводит акцент в сторону подложки темы: к чёрному в светлой,
   к белому в тёмной — иначе в темноте ссылка гаснет вместо подсветки. */
--vibeui-label-010-hover-mix:light-dark(black,white);
--vibeui-label-010-radius:0.625rem;
--vibeui-label-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="label-010"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-010-surface);
border:1px solid var(--vibeui-label-010-surface-border);
font-family:var(--vibeui-label-010-font);color:var(--vibeui-label-010-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="label-010"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="label-010"] details{
margin:0;
}
/* Свой маркер вместо системного треугольника: список без list-style у
   <summary> убирает его в Firefox, псевдоэлемент — в Chrome и Safari. */
[data-vibeui-block="label-010"] summary{
list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.25rem;
width:fit-content;font-size:0.8125rem;font-weight:500;
color:var(--vibeui-label-010-accent);
transition:color .16s ease;
}
[data-vibeui-block="label-010"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="label-010"] summary:hover{
color:color-mix(in oklab,var(--vibeui-label-010-accent) 75%,var(--vibeui-label-010-hover-mix));
}
[data-vibeui-block="label-010"] summary:focus-visible{
outline:2px solid var(--vibeui-label-010-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="label-010"] [data-part="chevron"]{
display:inline-block;transition:transform .16s ease;
}
[data-vibeui-block="label-010"] details[open] [data-part="chevron"]{
transform:rotate(90deg);
}
[data-vibeui-block="label-010"] [data-part="answer"]{
margin:0.375rem 0 0;padding:0.5625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-label-010-answer-bg);
font-size:0.8125rem;line-height:1.45;color:var(--vibeui-label-010-muted);
}
[data-vibeui-block="label-010"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-010-fg);background:var(--vibeui-label-010-surface);
border:1px solid var(--vibeui-label-010-field-border);
border-radius:var(--vibeui-label-010-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-010"] input::placeholder{color:var(--vibeui-label-010-muted)}
[data-vibeui-block="label-010"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-010-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-010-accent) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-010"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Подпись с разворачивающимся пояснением на нативном <details>/<summary>:
 * ответ раздвигает форму, а не всплывает поверх неё. Один файл, ноль
 * зависимостей, без клиентского JS.
 */
export function Label010({
  label = "Экспортный код валюты",
  toggleText = "Зачем это нужно",
  answer = "Трёхбуквенный код по ISO 4217 (например, RUB или USD) — по нему платёжный шлюз определяет валюту счёта и не путает суммы при конвертации.",
  placeholder = "RUB",
  background = "",
  accent,
  className,
  style,
  ...props
}: Label010Props) {
  const id = useId()
  const answerId = `${id}-answer`
  const palette = {
    ...(accent ? { "--vibeui-label-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="label-010"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <details>
          <summary>
            {toggleText}
            <span data-part="chevron" aria-hidden="true">
              &#8250;
            </span>
          </summary>
          <p data-part="answer" id={answerId}>
            {answer}
          </p>
        </details>
        <input
          id={id}
          type="text"
          name="currency-code"
          maxLength={3}
          placeholder={placeholder}
          aria-describedby={answerId}
        />
      </div>
    </>
  )
}
