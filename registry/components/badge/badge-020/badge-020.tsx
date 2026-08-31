import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge020Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  days?: number
  warnAt?: number
}

// Идея компонента: срок, у которого меняется не только тон, но и формулировка.
// «Ещё 21 день», «истекает через 3 дня», «истекает сегодня» и «просрочено на
// 2 дня» — четыре разные фразы, поэтому состояние понятно и в чёрно-белом
// списке, и вслух в скринридере. Число склоняется по русским правилам:
// «1 день», «3 дня», «11 дней».
const STYLES = `
:where([data-vibeui-block="badge-020"]){
--vibeui-badge-020-hue:265;
--vibeui-badge-020-chroma:0.02;
--vibeui-badge-020-bg:oklch(0.97 calc(var(--vibeui-badge-020-chroma) * 0.4) var(--vibeui-badge-020-hue));
--vibeui-badge-020-fg:oklch(0.36 var(--vibeui-badge-020-chroma) var(--vibeui-badge-020-hue));
--vibeui-badge-020-border:oklch(0.89 calc(var(--vibeui-badge-020-chroma) * 0.6) var(--vibeui-badge-020-hue));
--vibeui-badge-020-mark:oklch(0.55 calc(var(--vibeui-badge-020-chroma) * 1.4) var(--vibeui-badge-020-hue));
--vibeui-badge-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-020"]{
display:inline-flex;align-items:center;gap:0.375rem;
box-sizing:border-box;height:1.75rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-badge-020-border);border-radius:9999px;
background:var(--vibeui-badge-020-bg);color:var(--vibeui-badge-020-fg);
font-family:var(--vibeui-badge-020-font);font-size:0.75rem;font-weight:600;line-height:1;
font-variant-numeric:tabular-nums;vertical-align:middle;
}
[data-vibeui-block="badge-020"][data-state="soon"]{--vibeui-badge-020-hue:75;--vibeui-badge-020-chroma:0.09}
[data-vibeui-block="badge-020"][data-state="today"]{--vibeui-badge-020-hue:50;--vibeui-badge-020-chroma:0.14}
[data-vibeui-block="badge-020"][data-state="expired"]{--vibeui-badge-020-hue:25;--vibeui-badge-020-chroma:0.16}
[data-vibeui-block="badge-020"] [data-part="icon"]{
width:0.875rem;height:0.875rem;flex:none;color:var(--vibeui-badge-020-mark);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-020"] *{animation:none!important;transition:none!important}}
`

/** Русское склонение: 1 день, 3 дня, 11 дней. */
function plural(count: number) {
  const rest100 = count % 100
  const rest10 = count % 10

  if (rest100 >= 11 && rest100 <= 14) {
    return "дней"
  }

  if (rest10 === 1) {
    return "день"
  }

  if (rest10 >= 2 && rest10 <= 4) {
    return "дня"
  }

  return "дней"
}

/**
 * Плашка срока: тон и формулировка меняются по порогу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge020({
  days = 3,
  warnAt = 7,
  className,
  style,
  ...props
}: Badge020Props) {
  const left = Math.round(days)
  const overdue = Math.abs(left)

  const state =
    left < 0
      ? "expired"
      : left === 0
        ? "today"
        : left <= warnAt
          ? "soon"
          : "calm"

  const text =
    state === "expired"
      ? `Просрочено на ${overdue} ${plural(overdue)}`
      : state === "today"
        ? "Истекает сегодня"
        : state === "soon"
          ? `Истекает через ${left} ${plural(left)}`
          : `Ещё ${left} ${plural(left)}`

  return (
    <>
      <style href="vibeui-badge-020" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-020"
        data-state={state}
        className={className}
        style={style as CSSProperties}
      >
        <svg
          data-part="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 7v5.2l3.2 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        {text}
      </span>
    </>
  )
}
