import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  optionalText?: string
  placeholder?: string
  accent?: string
}

// Идея компонента: если обязательных полей в форме большинство, звёздочки
// превращаются в шум — дешевле пометить меньшинство. Пометка стоит на
// правом краю строки подписи: глаз проходит форму по левому краю и по
// правому отдельно, поэтому «необязательно» видно, не мешая читать имена.
const STYLES = `
:where([data-vibeui-block="label-003"]){
--vibeui-label-003-surface:oklch(1 0 0);
--vibeui-label-003-surface-border:oklch(0.91 0.006 265);
--vibeui-label-003-fg:oklch(0.24 0.016 265);
--vibeui-label-003-muted:oklch(0.54 0.014 265);
--vibeui-label-003-tag-bg:oklch(0.96 0.004 265);
--vibeui-label-003-field-border:oklch(0.85 0.01 265);
--vibeui-label-003-accent:oklch(0.55 0.2 262);
--vibeui-label-003-radius:0.625rem;
--vibeui-label-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="label-003"]{
box-sizing:border-box;width:100%;max-width:26rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-003-surface);
border:1px solid var(--vibeui-label-003-surface-border);
font-family:var(--vibeui-label-003-font);color:var(--vibeui-label-003-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
/* Подпись и пометка разведены по краям строки: baseline держит их на
   одной линии, даже когда у пометки другой кегль. */
[data-vibeui-block="label-003"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;
gap:0.75rem;
}
[data-vibeui-block="label-003"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="label-003"] [data-part="tag"]{
flex:none;padding:0.0625rem 0.4375rem;border-radius:999px;
font-size:0.6875rem;font-weight:500;line-height:1.5;letter-spacing:0.01em;
color:var(--vibeui-label-003-muted);background:var(--vibeui-label-003-tag-bg);
}
[data-vibeui-block="label-003"] textarea{
box-sizing:border-box;width:100%;min-height:5rem;resize:vertical;
padding:0.5rem 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.45;
color:var(--vibeui-label-003-fg);background:var(--vibeui-label-003-surface);
border:1px solid var(--vibeui-label-003-field-border);
border-radius:var(--vibeui-label-003-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-003"] textarea::placeholder{color:var(--vibeui-label-003-muted)}
[data-vibeui-block="label-003"] textarea:focus-visible{
outline:none;border-color:var(--vibeui-label-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-003-accent) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Подпись с пометкой «необязательно» на правом краю строки: помечено
 * меньшинство, а не большинство. Один файл, ноль зависимостей.
 */
export function Label003({
  label = "Комментарий к заказу",
  optionalText = "необязательно",
  placeholder = "Например: позвонить за час до доставки",
  accent,
  className,
  style,
  ...props
}: Label003Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-label-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="label-003"
        className={className}
        style={palette}
      >
        <div data-part="row">
          <label htmlFor={id}>{label}</label>
          <span data-part="tag">{optionalText}</span>
        </div>
        <textarea id={id} name="comment" rows={3} placeholder={placeholder} />
      </div>
    </>
  )
}
