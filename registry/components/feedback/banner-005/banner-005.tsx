import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Banner005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Израсходовано и включено в тариф: полоса считается из этих двух чисел. */
  used?: number
  limit?: number
  unit?: string
  planLabel?: string
  actionLabel?: string
}

// Идея компонента: полоса тарифного лимита, которая показывает цифру, а не
// пугает словами. Заполнение считается из двух чисел, и цвет переключается
// сам: до 90 процентов — спокойный, дальше — предупреждающий.
const STYLES = `
:where([data-vibeui-block="banner-005"]){
--vibeui-banner-005-bg:oklch(1 0 0);
--vibeui-banner-005-fg:oklch(0.24 0.014 265);
--vibeui-banner-005-muted:oklch(0.54 0.014 265);
--vibeui-banner-005-border:oklch(0.9 0.006 265);
--vibeui-banner-005-track:oklch(0.93 0.006 265);
--vibeui-banner-005-tone:oklch(0.6 0.15 250);
--vibeui-banner-005-ratio:0;
--vibeui-banner-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="banner-005"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-banner-005-font);color:var(--vibeui-banner-005-fg);
}
[data-vibeui-block="banner-005"][data-state="tight"]{--vibeui-banner-005-tone:oklch(0.62 0.18 45)}
[data-vibeui-block="banner-005"][data-state="over"]{--vibeui-banner-005-tone:oklch(0.58 0.2 25)}
[data-vibeui-block="banner-005"] [data-part="shell"]{
display:grid;grid-template-columns:1fr auto;gap:0.5rem 1rem;align-items:center;
box-sizing:border-box;padding:0.9375rem 1.125rem;
border:1px solid var(--vibeui-banner-005-border);border-radius:1rem;
background:var(--vibeui-banner-005-bg);
}
[data-vibeui-block="banner-005"] [data-part="head"]{display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap;min-width:0}
[data-vibeui-block="banner-005"] [data-part="plan"]{
flex:none;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-banner-005-tone) 16%,transparent);
color:var(--vibeui-banner-005-tone);
font-size:0.6875rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
}
[data-vibeui-block="banner-005"] [data-part="counter"]{font-size:0.875rem;font-weight:640;font-variant-numeric:tabular-nums}
[data-vibeui-block="banner-005"] [data-part="counter"] span{color:var(--vibeui-banner-005-muted);font-weight:500}
/* Полоса считается из двух чисел: разметка не знает про проценты. */
[data-vibeui-block="banner-005"] [data-part="track"]{
grid-column:1 / -1;position:relative;overflow:hidden;
height:0.375rem;border-radius:9999px;background:var(--vibeui-banner-005-track);
}
[data-vibeui-block="banner-005"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:inherit;
width:calc(var(--vibeui-banner-005-ratio) * 1%);
background:var(--vibeui-banner-005-tone);
transition:width .3s ease,background-color .3s ease;
}
[data-vibeui-block="banner-005"] [data-part="note"]{
grid-column:1 / -1;margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-banner-005-muted);
}
[data-vibeui-block="banner-005"] [data-part="action"]{
appearance:none;cursor:pointer;border:0;
height:2.125rem;padding:0 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-banner-005-tone);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.8125rem;font-weight:650;white-space:nowrap;
transition:filter .16s ease;
}
[data-vibeui-block="banner-005"] [data-part="action"]:hover{filter:brightness(1.08)}
[data-vibeui-block="banner-005"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-banner-005-tone);outline-offset:2px}
@container (max-width: 26rem){
[data-vibeui-block="banner-005"] [data-part="shell"]{grid-template-columns:1fr}
[data-vibeui-block="banner-005"] [data-part="action"]{width:100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Полоса тарифного лимита: заполнение из двух чисел и кнопка апгрейда.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner005({
  used = 9200,
  limit = 10000,
  unit = "запросов",
  planLabel = "Тариф «Старт»",
  actionLabel = "Повысить тариф",
  className,
  style,
  ...props
}: Banner005Props) {
  const safeLimit = limit > 0 ? limit : 1
  const ratio = Math.min(100, Math.round((used / safeLimit) * 100))
  const state = used >= safeLimit ? "over" : ratio >= 90 ? "tight" : "calm"
  const palette = {
    "--vibeui-banner-005-ratio": ratio,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="banner-005"
        data-state={state}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <span data-part="plan">{planLabel}</span>
            <span data-part="counter">
              {used.toLocaleString("ru-RU")}{" "}
              <span>
                из {limit.toLocaleString("ru-RU")} {unit}
              </span>
            </span>
          </div>
          <button data-part="action" type="button">
            {actionLabel}
          </button>
          <div
            data-part="track"
            role="progressbar"
            aria-valuenow={ratio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Израсходовано ${ratio} процентов лимита`}
          >
            <span data-part="fill" />
          </div>
          <p data-part="note">
            {state === "over"
              ? "Лимит исчерпан: новые запросы отклоняются до начала следующего периода."
              : "Лимит обновится первого числа. До этого момента остаток не переносится."}
          </p>
        </div>
      </div>
    </>
  )
}
