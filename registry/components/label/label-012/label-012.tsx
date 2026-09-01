import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Label012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  optionalText?: string
  placeholder?: string
  accent?: string
}

// Идея компонента: пометка «необязательно» не всегда заслуживает отдельного
// бейджа с подложкой — иногда это просто более тихая часть той же фразы.
// Здесь она встроена прямым текстом в <label> и приглушена только цветом и
// начертанием, без рамок и фона: подпись читается одной строкой, а не
// подписью плюс наклеенным ярлыком.
const STYLES = `
:where([data-vibeui-block="label-012"]){
--vibeui-label-012-surface:oklch(1 0 0);
--vibeui-label-012-surface-border:oklch(0.91 0.006 265);
--vibeui-label-012-fg:oklch(0.24 0.016 265);
--vibeui-label-012-muted:oklch(0.6 0.012 265);
--vibeui-label-012-field-border:oklch(0.85 0.01 265);
--vibeui-label-012-accent:oklch(0.55 0.2 262);
--vibeui-label-012-radius:0.625rem;
--vibeui-label-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="label-012"]{
box-sizing:border-box;width:100%;max-width:24rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-label-012-surface);
border:1px solid var(--vibeui-label-012-surface-border);
font-family:var(--vibeui-label-012-font);color:var(--vibeui-label-012-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="label-012"] label{
display:block;font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="label-012"] [data-part="hint"]{
font-weight:400;color:var(--vibeui-label-012-muted);
}
[data-vibeui-block="label-012"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
font:inherit;font-size:0.9375rem;
color:var(--vibeui-label-012-fg);background:var(--vibeui-label-012-surface);
border:1px solid var(--vibeui-label-012-field-border);
border-radius:var(--vibeui-label-012-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="label-012"] input::placeholder{color:var(--vibeui-label-012-muted)}
[data-vibeui-block="label-012"] input:focus-visible{
outline:none;border-color:var(--vibeui-label-012-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-label-012-accent) 22%,transparent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="label-012"] *{animation:none!important;transition:none!important}}
`

/**
 * Подпись с пометкой «необязательно» как приглушённой частью той же фразы,
 * без бейджа и подложки. Один файл, ноль зависимостей.
 */
export function Label012({
  label = "Название компании",
  optionalText = "необязательно",
  placeholder = "ООО «Ромашка»",
  accent,
  className,
  style,
  ...props
}: Label012Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-label-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-label-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="label-012"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          {label} <span data-part="hint">({optionalText})</span>
        </label>
        <input
          id={id}
          type="text"
          name="company"
          placeholder={placeholder}
        />
      </div>
    </>
  )
}
