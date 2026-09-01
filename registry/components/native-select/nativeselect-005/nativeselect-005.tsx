import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Nativeselect005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  options?: string[]
  secondLabel?: string
  secondOptions?: string[]
  accent?: string
}

// Идея компонента: в строке фильтров select не должен выглядеть полем
// формы. Рамка снята и появляется только на наведении и фокусе, ширина
// поля равна тексту выбранного пункта, подпись стоит слева в той же
// строке. Список при этом остаётся системным: на телефоне открывается
// привычное колесо, а не самодельное меню, которое едет при масштабе.
const STYLES = `
:where([data-vibeui-block="nativeselect-005"]){
--vibeui-nativeselect-005-surface:oklch(0.98 0.002 265);
--vibeui-nativeselect-005-surface-border:oklch(0.91 0.006 265);
--vibeui-nativeselect-005-fg:oklch(0.24 0.016 265);
--vibeui-nativeselect-005-muted:oklch(0.54 0.014 265);
--vibeui-nativeselect-005-hover:oklch(1 0 0);
--vibeui-nativeselect-005-accent:oklch(0.55 0.2 262);
--vibeui-nativeselect-005-radius:0.5rem;
--vibeui-nativeselect-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="nativeselect-005"]{
box-sizing:border-box;width:100%;max-width:32rem;
display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem 1rem;
padding:0.5rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-nativeselect-005-surface);
border:1px solid var(--vibeui-nativeselect-005-surface-border);
font-family:var(--vibeui-nativeselect-005-font);color:var(--vibeui-nativeselect-005-fg);
}
[data-vibeui-block="nativeselect-005"] [data-part="pair"]{
display:inline-flex;align-items:center;gap:0.25rem;min-width:0;
}
[data-vibeui-block="nativeselect-005"] label{
font-size:0.8125rem;line-height:1.3;color:var(--vibeui-nativeselect-005-muted);
cursor:pointer;white-space:nowrap;
}
[data-vibeui-block="nativeselect-005"] [data-part="field"]{
position:relative;display:inline-flex;min-width:0;
}
/* Ширина поля равна тексту: width:auto у select берётся по самому
   длинному пункту, поэтому «тихий» фильтр не растягивает строку. */
[data-vibeui-block="nativeselect-005"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;width:auto;max-width:100%;height:1.75rem;
padding:0 1.375rem 0 0.375rem;
font:inherit;font-size:0.8125rem;font-weight:500;line-height:1.2;
color:var(--vibeui-nativeselect-005-fg);
background:transparent;border:1px solid transparent;
border-radius:var(--vibeui-nativeselect-005-radius);
cursor:pointer;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="nativeselect-005"] select:hover{
background:var(--vibeui-nativeselect-005-hover);
border-color:var(--vibeui-nativeselect-005-surface-border);
}
[data-vibeui-block="nativeselect-005"] select:focus-visible{
outline:2px solid var(--vibeui-nativeselect-005-accent);outline-offset:1px;
background:var(--vibeui-nativeselect-005-hover);
}
[data-vibeui-block="nativeselect-005"] option{color:var(--vibeui-nativeselect-005-fg)}
[data-vibeui-block="nativeselect-005"] [data-part="arrow"]{
position:absolute;right:0.5rem;top:50%;pointer-events:none;
width:0.3125rem;height:0.3125rem;
border-right:1.5px solid var(--vibeui-nativeselect-005-muted);
border-bottom:1.5px solid var(--vibeui-nativeselect-005-muted);
translate:0 -0.1875rem;rotate:45deg;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="nativeselect-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Компактные нативные select'ы в строке фильтров: без рамки, шириной по
 * тексту, с подписями слева. Один файл, ноль зависимостей.
 */
export function Nativeselect005({
  label = "Сортировка",
  options = ["по дате", "по имени", "по размеру"],
  secondLabel = "Показывать",
  secondOptions = ["все", "только мои", "в архиве"],
  accent,
  className,
  style,
  ...props
}: Nativeselect005Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-nativeselect-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-nativeselect-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="nativeselect-005"
        className={className}
        style={palette}
      >
        <span data-part="pair">
          <label htmlFor={`${id}-sort`}>{label}</label>
          <span data-part="field">
            <select id={`${id}-sort`} name="sort">
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span data-part="arrow" aria-hidden="true" />
          </span>
        </span>
        <span data-part="pair">
          <label htmlFor={`${id}-scope`}>{secondLabel}</label>
          <span data-part="field">
            <select id={`${id}-scope`} name="scope">
              {secondOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span data-part="arrow" aria-hidden="true" />
          </span>
        </span>
      </div>
    </>
  )
}
