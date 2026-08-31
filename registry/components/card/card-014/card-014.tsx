import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card014Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  label?: string
  value?: string
  /** Изменение в процентах. Знак решает направление стрелки и цвет. */
  delta?: number
  /** Изменение в абсолютных единицах: «+164 000 ₽». Строка, готовая к показу. */
  deltaValue?: string
  /** С чем сравниваем: «против прошлой недели». */
  baseline?: string
  /** true для метрик, где рост — плохая новость: отток, ошибки, время ответа. */
  invert?: boolean
  accent?: string
}

// Идея компонента: показатель, у которого главное — не число, а дельта.
// Дельта дана трижды: знаком, процентом и абсолютной величиной, потому что
// «+12 %» без базы ничего не значит. Цвет считается от invert: рост оттока
// и рост выручки — разные новости, а не разный знак.
const STYLES = `
:where([data-vibeui-block="card-014"]){
--vibeui-card-014-bg:oklch(1 0 0);
--vibeui-card-014-fg:oklch(0.21 0.015 265);
--vibeui-card-014-muted:oklch(0.55 0.013 265);
--vibeui-card-014-border:oklch(0.91 0.006 265);
--vibeui-card-014-good:oklch(0.55 0.14 152);
--vibeui-card-014-bad:oklch(0.56 0.19 27);
--vibeui-card-014-flat:oklch(0.55 0.012 265);
--vibeui-card-014-tone:var(--vibeui-card-014-flat);
--vibeui-card-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-014"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:17rem;box-sizing:border-box;padding:1rem 1.0625rem 1.0625rem;
background:var(--vibeui-card-014-bg);color:var(--vibeui-card-014-fg);
border:1px solid var(--vibeui-card-014-border);border-radius:0.875rem;
font-family:var(--vibeui-card-014-font);
}
[data-vibeui-block="card-014"][data-tone="good"]{--vibeui-card-014-tone:var(--vibeui-card-014-good)}
[data-vibeui-block="card-014"][data-tone="bad"]{--vibeui-card-014-tone:var(--vibeui-card-014-bad)}
[data-vibeui-block="card-014"] [data-part="label"]{
margin:0;font-size:0.75rem;font-weight:600;letter-spacing:0.02em;
color:var(--vibeui-card-014-muted);
}
[data-vibeui-block="card-014"] [data-part="row"]{
display:flex;align-items:baseline;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="card-014"] [data-part="value"]{
font-size:1.75rem;font-weight:680;line-height:1.05;letter-spacing:-0.025em;
font-variant-numeric:tabular-nums;
}
/* Дельта несёт знак и стрелку, а не только цвет: в печати цвет исчезает,
   а при дальтонизме зелёный и красный сливаются. */
[data-vibeui-block="card-014"] [data-part="delta"]{
position:relative;display:inline-flex;align-items:center;gap:0.25rem;
height:1.375rem;padding:0 0.4375rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-card-014-tone) 12%,oklch(1 0 0));
color:color-mix(in oklab,var(--vibeui-card-014-tone) 82%,oklch(0.2 0.02 265));
font-size:0.75rem;font-weight:680;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-014"] [data-part="arrow"]{width:0.625rem;height:0.625rem;flex:none}
[data-vibeui-block="card-014"][data-direction="down"] [data-part="arrow"]{transform:rotate(180deg)}
[data-vibeui-block="card-014"][data-direction="flat"] [data-part="arrow"]{display:none}
[data-vibeui-block="card-014"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
margin:0.1875rem 0 0;padding-top:0.5rem;
border-top:1px solid var(--vibeui-card-014-border);
font-size:0.75rem;color:var(--vibeui-card-014-muted);
}
[data-vibeui-block="card-014"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="card-014"] [data-part="abs"]{
color:var(--vibeui-card-014-fg);font-weight:640;font-variant-numeric:tabular-nums;
}
`

/**
 * Плитка показателя с дельтой: знак, процент и абсолютное изменение
 * рядом с базой сравнения. Один файл, ноль зависимостей.
 */
export function Card014({
  label = "Выручка за неделю",
  value = "1 284 000 ₽",
  delta = 12.4,
  deltaValue = "+164 000 ₽",
  baseline = "против прошлой недели",
  invert = false,
  accent,
  className,
  style,
  ...props
}: Card014Props) {
  const direction = delta > 0 ? "up" : delta < 0 ? "down" : "flat"
  const tone =
    direction === "flat"
      ? "flat"
      : (direction === "up") !== invert
        ? "good"
        : "bad"
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : ""
  const printed = `${sign}${Math.abs(delta).toLocaleString("ru-RU")} %`

  const palette = {
    ...(accent ? { "--vibeui-card-014-good": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-014" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-014"
        data-tone={tone}
        data-direction={direction}
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <p data-part="row">
          <span data-part="value">{value}</span>
          <span data-part="delta">
            <span data-part="sr">
              {direction === "down"
                ? "снижение на "
                : direction === "up"
                  ? "рост на "
                  : "без изменений, "}
            </span>
            <svg
              data-part="arrow"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 8.5V1.5M5 1.5 1.8 4.7M5 1.5l3.2 3.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {printed}
          </span>
        </p>
        <p data-part="foot">
          <span>{baseline}</span>
          {deltaValue ? <span data-part="abs">{deltaValue}</span> : null}
        </p>
      </article>
    </>
  )
}
