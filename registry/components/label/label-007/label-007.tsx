import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  error?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: сообщение об ошибке стоит между подписью и полем — так
// его видно до того, как палец на телефоне закроет низ поля клавиатурой.
// Вся раскраска висит на одном атрибуте aria-invalid у поля: включил
// атрибут — покраснела рамка, подпись и текст, отдельного класса нет.
const STYLES = `
:where([data-vibeui-block="label-007"]){
--vibeui-label-007-surface:oklch(1 0 0);
--vibeui-label-007-surface-border:oklch(0.91 0.006 265);
--vibeui-label-007-fg:oklch(0.24 0.016 265);
--vibeui-label-007-muted:oklch(0.54 0.014 265);
--vibeui-label-007-field-border:oklch(0.85 0.01 265);
--vibeui-label-007-accent:oklch(0.55 0.2 262);
--vibeui-label-007-error:oklch(0.55 0.2 25);
--vibeui-label-007-error-soft:oklch(0.96 0.03 25);
--vibeui-label-007-radius:0.625rem;
--vibeui-label-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
 * Подпись с сообщением об ошибке под ней: состояние задаётся одним
 * aria-invalid, текст связан с полем через aria-describedby. Один файл,
 * ноль зависимостей.
 */
export function Label007({
  label = "Почта для счетов",
  error = "Такой почты не существует: проверьте, что после @ стоит домен.",
  defaultValue = "buhgalter@company",
  accent,
  className,
  style,
  ...props
}: Label007Props) {
  const id = useId()
  const errorId = `${id}-error`
  const palette = {
    ...(accent ? { "--vibeui-label-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
