import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  columns?: number
  label?: string
}

// Идея компонента: заглушка строки таблицы с бегущим бликом, а не с
// пульсацией. Блик — один накладной элемент с градиентом, который едет
// поверх всей строки через transform, а не пересчитывает раскладку: ячейки
// снизу неподвижны. В отличие от карточки-заглушки на пульсации, здесь
// важна именно горизонтальная строка — метрика ряда таблицы, а не карточки.
const STYLES = `
:where([data-vibeui-block="spinner-010"]){
--vibeui-spinner-010-surface:oklch(1 0 0);
--vibeui-spinner-010-border:oklch(0.91 0.006 265);
--vibeui-spinner-010-base:oklch(0.92 0.005 265);
--vibeui-spinner-010-shine:oklch(1 0 0 / 70%);
--vibeui-spinner-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: серые плашки на тёмном фоне каталога теряются. */
[data-vibeui-block="spinner-010"]{
position:relative;overflow:hidden;
display:flex;align-items:center;gap:0.75rem;
width:100%;box-sizing:border-box;padding:0.75rem 0.875rem;
background:var(--vibeui-spinner-010-surface);
border:1px solid var(--vibeui-spinner-010-border);border-radius:0.625rem;
font-family:var(--vibeui-spinner-010-font);
}
[data-vibeui-block="spinner-010"] [data-part="avatar"]{
flex:none;width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-spinner-010-base);
}
[data-vibeui-block="spinner-010"] [data-part="cells"]{
display:flex;align-items:center;gap:0.75rem;flex:1 1 auto;min-width:0;
}
[data-vibeui-block="spinner-010"] [data-part="cell"]{
height:0.75rem;border-radius:0.25rem;background:var(--vibeui-spinner-010-base);
flex:1 1 0;min-width:0;
}
[data-vibeui-block="spinner-010"] [data-part="cell"]:first-child{flex-grow:2}
[data-vibeui-block="spinner-010"] [data-part="cell"]:last-child{flex-grow:0.6}
/* Блик едет через transform поверх всей строки, а не через width или left. */
[data-vibeui-block="spinner-010"] [data-part="shine"]{
position:absolute;inset:0;pointer-events:none;
background:linear-gradient(
100deg,
transparent 30%,
var(--vibeui-spinner-010-shine) 50%,
transparent 70%
);
transform:translateX(-100%);
animation:vibeui-spinner-010-sweep 1.6s ease-in-out infinite;
}
@keyframes vibeui-spinner-010-sweep{to{transform:translateX(100%)}}
/* Без движения блик замирает по центру статичным пятном света. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-010"] [data-part="shine"]{
animation:none!important;transform:translateX(0);opacity:.6;
}
}
`

/**
 * Строка-заглушка таблицы с бегущим бликом поверх неподвижных ячеек.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner010({
  columns = 4,
  label = "Загружаем строку таблицы",
  className,
  style,
  ...props
}: Spinner010Props) {
  const count = Math.min(6, Math.max(2, Math.round(columns)))

  return (
    <>
      <style href="vibeui-spinner-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-010"
        role="status"
        aria-live="polite"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="avatar" aria-hidden="true" />
        <span data-part="cells" aria-hidden="true">
          {Array.from({ length: count }, (_, index) => (
            <span key={index} data-part="cell" />
          ))}
        </span>
        <span data-part="shine" aria-hidden="true" />
      </div>
    </>
  )
}
