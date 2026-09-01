import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Rating009Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  votes?: number[]
  accent?: string
}

// Идея компонента: средняя оценка показана не звёздами, а меткой на шкале от
// одного до пяти — деление считает средневзвешенное по голосам само, поэтому
// цифра и её место на шкале не могут разойтись. Под шкалой — не проценты, а
// живые числа голосов за каждую отметку: 4,5 из тысячи голосов и 4,5 из
// десяти — разная надёжность, и это видно только по счётчику, а не по доле.
const STYLES = `
:where([data-vibeui-block="rating-009"]){
--vibeui-rating-009-surface:oklch(1 0 0);
--vibeui-rating-009-shell:oklch(0.9 0.006 265);
--vibeui-rating-009-fg:oklch(0.23 0.014 265);
--vibeui-rating-009-muted:oklch(0.55 0.014 265);
--vibeui-rating-009-track:oklch(0.94 0.005 265);
--vibeui-rating-009-accent:oklch(0.58 0.19 262);
--vibeui-rating-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: сводку показывают поверх любого фона. */
[data-vibeui-block="rating-009"]{
display:flex;flex-direction:column;gap:0.875rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-rating-009-surface);
border:1px solid var(--vibeui-rating-009-shell);border-radius:0.875rem;
font-family:var(--vibeui-rating-009-font);color:var(--vibeui-rating-009-fg);
}
[data-vibeui-block="rating-009"] [data-part="gauge"]{display:flex;flex-direction:column;gap:0.375rem}
[data-vibeui-block="rating-009"] [data-part="rail"]{
position:relative;height:0.375rem;border-radius:9999px;
background:var(--vibeui-rating-009-track);
}
[data-vibeui-block="rating-009"] [data-part="marker"]{
position:absolute;top:50%;translate:-50% -50%;
display:inline-flex;align-items:center;justify-content:center;
min-width:1.875rem;height:1.375rem;padding:0 0.375rem;border-radius:9999px;
background:var(--vibeui-rating-009-accent);color:oklch(1 0 0);
font-size:0.6875rem;font-weight:750;font-variant-numeric:tabular-nums;
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 22%);
}
[data-vibeui-block="rating-009"] [data-part="ticks"]{
display:flex;justify-content:space-between;
font-size:0.6875rem;color:var(--vibeui-rating-009-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="rating-009"] [data-part="summary"]{margin:0;font-size:0.75rem;color:var(--vibeui-rating-009-muted)}
[data-vibeui-block="rating-009"] [data-part="bars"]{
list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.3125rem;
}
[data-vibeui-block="rating-009"] [data-part="row"]{
display:grid;grid-template-columns:1.375rem 1fr 3.5rem;align-items:center;gap:0.5rem;
font-size:0.6875rem;color:var(--vibeui-rating-009-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="rating-009"] [data-part="bar"]{
height:0.4375rem;border-radius:9999px;background:var(--vibeui-rating-009-track);overflow:hidden;
}
[data-vibeui-block="rating-009"] [data-part="bar"] span{display:block;height:100%;background:var(--vibeui-rating-009-accent)}
[data-vibeui-block="rating-009"] [data-part="tally"]{text-align:right;white-space:nowrap}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VOTES = [612, 205, 71, 24, 18]

/** Склонение «голос» под число: 1 голос, 2 голоса, 5 голосов. */
function voteWord(count: number) {
  const teen = count % 100
  const tail = count % 10
  if (teen > 10 && teen < 20) return "голосов"
  if (tail === 1) return "голос"
  if (tail > 1 && tail < 5) return "голоса"
  return "голосов"
}

/**
 * Распределение голосов по звёздам: средняя показана меткой на шкале
 * от одного до пяти, под ней — счётчик голосов на каждую отметку.
 * Один файл, ноль зависимостей, только чтение.
 */
export function Rating009({
  votes = DEFAULT_VOTES,
  accent,
  className,
  style,
  ...props
}: Rating009Props) {
  const total = votes.reduce((sum, count) => sum + count, 0) || 1
  const weighted = votes.reduce(
    (sum, count, index) => sum + count * (5 - index),
    0,
  )
  const value = Math.round((weighted / total) * 10) / 10
  const pct = Math.min(100, Math.max(0, ((value - 1) / 4) * 100))
  const valueLabel = value.toString().replace(".", ",")

  const palette = {
    ...(accent ? { "--vibeui-rating-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="rating-009"
        className={className}
        style={palette}
      >
        <div
          data-part="gauge"
          role="img"
          aria-label={`Средняя оценка ${valueLabel} из 5 на основе ${total} ${voteWord(total)}`}
        >
          <div data-part="rail" aria-hidden="true">
            <span data-part="marker" style={{ left: `${pct}%` }}>
              {valueLabel}
            </span>
          </div>
          <div data-part="ticks" aria-hidden="true">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>
        <p data-part="summary">
          {total.toLocaleString("ru-RU")} {voteWord(total)} всего
        </p>
        <ul data-part="bars">
          {votes.map((count, index) => {
            const stars = 5 - index
            const share = Math.round((count / total) * 100)
            return (
              <li key={stars} data-part="row">
                <span>{stars}★</span>
                <span data-part="bar">
                  <span style={{ width: `${share}%` }} />
                </span>
                <span data-part="tally">
                  {count.toLocaleString("ru-RU")} · {share}%
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
