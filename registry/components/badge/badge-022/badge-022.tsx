import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge022Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  unread?: number
  total?: number
  max?: number
}

// Идея компонента: счётчик из двух половин. Слева непрочитанные с порогом
// «9+», справа общее число без порога, между ними перегородка. Одно число
// заставляет гадать — «двенадцать чего?»: пара «новые из всех» отвечает сразу
// и занимает столько же места. Когда новых нет, левая половина гаснет, но не
// исчезает — иначе плашка меняет ширину и дёргает соседей.
const STYLES = `
:where([data-vibeui-block="badge-022"]){
--vibeui-badge-022-bg:oklch(0.97 0.004 265);
--vibeui-badge-022-border:oklch(0.89 0.006 265);
--vibeui-badge-022-accent:oklch(0.53 0.19 25);
--vibeui-badge-022-muted:oklch(0.54 0.014 265);
--vibeui-badge-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-022"]{
display:inline-flex;align-items:stretch;box-sizing:border-box;
height:1.5rem;
border:1px solid var(--vibeui-badge-022-border);border-radius:9999px;
background:var(--vibeui-badge-022-bg);
font-family:var(--vibeui-badge-022-font);font-size:0.75rem;line-height:1;
/* Табличные цифры: половины не должны переставать совпадать по ширине. */
font-variant-numeric:tabular-nums;vertical-align:middle;overflow:hidden;
}
[data-vibeui-block="badge-022"] [data-part="unread"],
[data-vibeui-block="badge-022"] [data-part="total"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.375rem;padding:0 0.5rem;
}
[data-vibeui-block="badge-022"] [data-part="unread"]{
color:var(--vibeui-badge-022-accent);font-weight:700;
background:color-mix(in oklab,var(--vibeui-badge-022-accent) 10%,oklch(1 0 0));
}
[data-vibeui-block="badge-022"] [data-part="total"]{
color:var(--vibeui-badge-022-muted);font-weight:500;
border-left:1px solid var(--vibeui-badge-022-border);
}
/* Ноль новых: половина остаётся на месте, но перестаёт звать. */
[data-vibeui-block="badge-022"][data-empty="true"] [data-part="unread"]{
color:var(--vibeui-badge-022-muted);font-weight:500;background:transparent;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-022"] *{animation:none!important;transition:none!important}}
`

/**
 * Счётчик из двух половин: новые с порогом «9+» и общее число.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge022({
  unread = 12,
  total = 48,
  max = 9,
  className,
  style,
  ...props
}: Badge022Props) {
  const fresh = Math.max(0, Math.round(unread))
  const all = Math.max(fresh, Math.round(total))
  const shown = fresh > max ? `${max}+` : String(fresh)

  return (
    <>
      <style href="vibeui-badge-022" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-022"
        data-empty={fresh === 0}
        className={className}
        style={style as CSSProperties}
        aria-label={`${fresh} новых из ${all}`}
      >
        <span data-part="unread" aria-hidden="true">
          {shown}
        </span>
        <span data-part="total" aria-hidden="true">
          {all}
        </span>
      </span>
    </>
  )
}
