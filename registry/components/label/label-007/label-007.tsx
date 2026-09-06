import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Label007Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  error?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сообщение об ошибке стоит между подписью и полем — так
// его видно до того, как палец на телефоне закроет низ поля клавиатурой.
// Вся раскраска висит на одном атрибуте aria-invalid у поля: включил
// атрибут — покраснела рамка, подпись и текст, отдельного класса нет.
const STYLES = `
:where([data-vibeui-block="label-007"]){
--vibeui-label-007-surface:transparent;
--vibeui-label-007-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-label-007-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-label-007-muted:color-mix(in oklab,var(--vibeui-label-007-fg) 68%,transparent);
--vibeui-label-007-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-label-007-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.16 39.8));
--vibeui-label-007-error:light-dark(oklch(0.55 0.2 25),oklch(0.78 0.14 25));
--vibeui-label-007-error-soft:light-dark(oklch(0.96 0.03 25),oklch(0.3 0.05 25));
--vibeui-label-007-radius:0.625rem;
--vibeui-label-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="label-007"]{color-scheme:dark}
[data-vibeui-block="label-007"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-007-surface);
border:1px solid var(--vibeui-label-007-surface-border);
font-family:var(--vibeui-label-007-font);color:var(--vibeui-label-007-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="label-007"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
transition:color .16s ease;
}
/* Одна точка правды — aria-invalid на поле. :has() красит подпись и
   сообщение от того же атрибута, поэтому состояния не разъезжаются. */
[data-vibeui-block="label-007"]:has(input[aria-invalid="true"]) label{
color:var(--vibeui-label-007-error);
}
[data-vibeui-block="label-007"] [data-part="error"]{
display:flex;align-items:flex-start;gap:0.375rem;margin:0;
padding:0.375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-label-007-error-soft);
font-size:0.8125rem;line-height:1.4;color:var(--vibeui-label-007-error);
}
/* Значок нарисован рамкой, а не картинкой: цвет ошибки — единственный
   признак состояния только для зрячих, значок добавляет второй. */
[data-vibeui-block="label-007"] [data-part="sign"]{
flex:none;margin-top:0.0625rem;
width:0.875rem;height:0.875rem;border-radius:50%;
border:1px solid currentColor;
display:inline-flex;align-items:center;justify-content:center;
font-size:0.625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="label-007"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-007-fg);background:var(--vibeui-label-007-surface);
border:1px solid var(--vibeui-label-007-field-border);
border-radius:var(--vibeui-label-007-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-007"] input[aria-invalid="true"]{
border-color:var(--vibeui-label-007-error);
}
[data-vibeui-block="label-007"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-007-accent) 22%,transparent);
}
[data-vibeui-block="label-007"] input[aria-invalid="true"]:focus-visible{
border-color:var(--vibeui-label-007-error);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-007-error) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-007"] *{animation:none!important;transition:none!important}}
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
 * Подпись с сообщением об ошибке под ней: состояние задаётся одним
 * aria-invalid, текст связан с полем через aria-describedby. Один файл,
 * ноль зависимостей.
 */
export function Label007({
  label = "Почта для счетов",
  error = "Такой почты не существует: проверьте, что после @ стоит домен.",
  defaultValue = "buhgalter@company",
  background = "",
  accent,
  className,
  style,
  ...props
}: Label007Props) {
  const id = useId()
  const errorId = `${id}-error`
  const palette = {
    ...(accent ? { "--vibeui-label-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-label-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="label"
        data-vibeui-block="label-007"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <p data-part="error" id={errorId}>
          <span data-part="sign" aria-hidden="true">
            !
          </span>
          {error}
        </p>
        <input
          id={id}
          type="email"
          name="billing-email"
          defaultValue={defaultValue}
          aria-invalid="true"
          aria-describedby={errorId}
        />
      </div>
    </>
  )
}
