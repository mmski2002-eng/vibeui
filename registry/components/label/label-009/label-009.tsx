import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  badge?: string
  hint?: string
  placeholder?: string
  accent?: string
}

// Идея компонента: у звёздочки есть свои сторонники, но она требует
// расшифровки. Здесь вместо символа стоит читаемый текстовый бейдж внутри
// самого <label> — его слышно вместе с именем поля без skip-текста и
// aria-hidden. Пояснение при этом лежит под полем, а не над ним: так
// бейдж «обязательно» остаётся первым, что видит и слышит человек.
const STYLES = `
:where([data-vibeui-block="label-009"]){
--vibeui-label-009-surface:oklch(1 0 0);
--vibeui-label-009-surface-border:oklch(0.91 0.006 265);
--vibeui-label-009-fg:oklch(0.24 0.016 265);
--vibeui-label-009-muted:oklch(0.54 0.014 265);
--vibeui-label-009-field-border:oklch(0.85 0.01 265);
--vibeui-label-009-accent:oklch(0.55 0.2 262);
--vibeui-label-009-required:oklch(0.55 0.2 25);
--vibeui-label-009-required-soft:oklch(0.96 0.03 25);
--vibeui-label-009-radius:0.625rem;
--vibeui-label-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="label-009"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-009-surface);
border:1px solid var(--vibeui-label-009-surface-border);
font-family:var(--vibeui-label-009-font);color:var(--vibeui-label-009-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="label-009"] label{
display:inline-flex;align-items:center;flex-wrap:wrap;gap:0.375rem;
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="label-009"] [data-part="badge"]{
flex:none;padding:0.0625rem 0.4375rem;border-radius:999px;
font-size:0.6875rem;font-weight:600;line-height:1.5;letter-spacing:0.01em;
color:var(--vibeui-label-009-required);
background:var(--vibeui-label-009-required-soft);
}
[data-vibeui-block="label-009"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-009-fg);background:var(--vibeui-label-009-surface);
border:1px solid var(--vibeui-label-009-field-border);
border-radius:var(--vibeui-label-009-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-009"] input::placeholder{color:var(--vibeui-label-009-muted)}
[data-vibeui-block="label-009"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-009-accent) 22%,transparent);
}
[data-vibeui-block="label-009"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-label-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Подпись обязательного поля с читаемым текстовым бейджем вместо звёздочки:
 * бейдж лежит внутри <label> и звучит вместе с именем поля. Пояснение —
 * под полем. Один файл, ноль зависимостей.
 */
export function Label009({
  label = "Телефон для связи",
  badge = "Обязательно",
  hint = "Позвоним, если у курьера не получится дозвониться на резервный номер.",
  placeholder = "+7 900 000-00-00",
  accent,
  className,
  style,
  ...props
}: Label009Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const palette = {
    ...(accent ? { "--vibeui-label-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="label-009"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          {label}
          <span data-part="badge">{badge}</span>
        </label>
        <input
          id={id}
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          placeholder={placeholder}
          aria-describedby={hintId}
        />
        <p data-part="hint" id={hintId}>
          {hint}
        </p>
      </div>
    </>
  )
}
