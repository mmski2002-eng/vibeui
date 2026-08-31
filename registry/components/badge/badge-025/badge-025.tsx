import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge025Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  label?: string
  value?: string
}

// Идея компонента: плашка «ключ: значение» для служебных данных — хеша
// коммита, номера сборки, идентификатора заказа. Ключ помечен user-select:none,
// значение — user-select:all, поэтому одним щелчком выделяется ровно то, что
// собираются скопировать, и в буфер не уезжает слово «commit» вместе с хешем.
const STYLES = `
:where([data-vibeui-block="badge-025"]){
--vibeui-badge-025-key-bg:oklch(0.38 0.016 265);
--vibeui-badge-025-key-fg:oklch(0.96 0.004 265);
--vibeui-badge-025-value-bg:oklch(0.97 0.004 265);
--vibeui-badge-025-value-fg:oklch(0.28 0.016 265);
--vibeui-badge-025-border:oklch(0.38 0.016 265);
--vibeui-badge-025-font:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
[data-vibeui-block="badge-025"]{
display:inline-flex;align-items:stretch;box-sizing:border-box;
height:1.5rem;max-width:100%;
border:1px solid var(--vibeui-badge-025-border);border-radius:0.3125rem;
font-family:var(--vibeui-badge-025-font);font-size:0.6875rem;line-height:1;
vertical-align:middle;overflow:hidden;
}
[data-vibeui-block="badge-025"] [data-part="key"]{
display:inline-flex;align-items:center;flex:none;padding:0 0.5rem;
background:var(--vibeui-badge-025-key-bg);color:var(--vibeui-badge-025-key-fg);
font-weight:600;letter-spacing:0.04em;
/* Подпись не выделяется: в буфер должно уходить только значение. */
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="badge-025"] [data-part="value"]{
display:inline-flex;align-items:center;min-width:0;padding:0 0.5rem;
background:var(--vibeui-badge-025-value-bg);color:var(--vibeui-badge-025-value-fg);
font-weight:600;
/* Один щелчок выделяет значение целиком — хеш не приходится вести мышью. */
user-select:all;-webkit-user-select:all;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-025"] *{animation:none!important;transition:none!important}}
`

/**
 * Плашка «ключ: значение»: выделяется и копируется только значение.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge025({
  label = "commit",
  value = "a1f9c02",
  className,
  style,
  ...props
}: Badge025Props) {
  return (
    <>
      <style href="vibeui-badge-025" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-025"
        className={className}
        style={style as CSSProperties}
        aria-label={`${label}: ${value}`}
      >
        <span data-part="key" aria-hidden="true">
          {label}
        </span>
        <span data-part="value" aria-hidden="true" title={value}>
          {value}
        </span>
      </span>
    </>
  )
}
