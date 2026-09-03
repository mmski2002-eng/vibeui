import type { CSSProperties } from "react"

export type Commerce048Unit = {
  id: string
  value: string
  label: string
}

export type Commerce048Tier = {
  id: string
  from: string
  off: string
  note: string
}

export type Commerce048Props = {
  kicker?: string
  title?: string
  lead?: string
  deadline?: string
  deadlineIso?: string
  units?: Commerce048Unit[]
  tiers?: Commerce048Tier[]
  cta?: string
  soldLabel?: string
  soldPercent?: number
  fine?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: лендинг распродажи, где таймер — не украшение, а обещание.
// Цифры приходят пропами и продублированы датой в теге time: сервер отдаёт
// честный слепок, а тикать его заставляет вызывающий код. Пороги скидки
// перечислены рядом с таймером, потому что срок без выгоды никого не двигает.
// Тёмная подложка блока своя, а не заимствованная у темы проекта.
const STYLES = `
:where([data-vibeui-block="commerce-048"]){
--vibeui-commerce-048-bg:oklch(0.18 0.03 285);
--vibeui-commerce-048-panel:oklch(0.24 0.035 285);
--vibeui-commerce-048-fg:oklch(0.97 0.008 285);
--vibeui-commerce-048-muted:oklch(0.72 0.02 285);
--vibeui-commerce-048-border:oklch(0.34 0.03 285);
--vibeui-commerce-048-accent:oklch(0.72 0.19 45);
--vibeui-commerce-048-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-048"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-048-bg);
color:var(--vibeui-commerce-048-fg);font-family:var(--vibeui-commerce-048-sans);
}
[data-vibeui-block="commerce-048"] *{box-sizing:border-box}
[data-vibeui-block="commerce-048"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:2rem 1rem 2.25rem;text-align:center}
[data-vibeui-block="commerce-048"] [data-part="kicker"]{
display:inline-flex;align-items:center;gap:0.5rem;height:1.75rem;padding:0 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-048-border);font-size:0.6875rem;font-weight:700;
letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-commerce-048-accent);
}
[data-vibeui-block="commerce-048"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-commerce-048-accent);
animation:vibeui-commerce-048-beat 1.6s ease-in-out infinite;
}
@keyframes vibeui-commerce-048-beat{0%,100%{opacity:1}50%{opacity:0.25}}
[data-vibeui-block="commerce-048"] h2{margin:1rem auto 0.625rem;max-width:18ch;font-size:clamp(1.75rem,7cqi,3.5rem);line-height:1.02;letter-spacing:-0.03em}
[data-vibeui-block="commerce-048"] [data-part="lead"]{margin:0 auto;max-width:46ch;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-commerce-048-muted)}
[data-vibeui-block="commerce-048"] [data-part="clock"]{
list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;margin:1.5rem 0 0.625rem;padding:0;
}
[data-vibeui-block="commerce-048"] [data-part="unit"]{
min-width:4.25rem;padding:0.625rem 0.5rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-048-border);background:var(--vibeui-commerce-048-panel);
}
[data-vibeui-block="commerce-048"] [data-part="value"]{
display:block;font-size:clamp(1.5rem,5cqi,2.25rem);font-weight:750;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-048"] [data-part="unitname"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-048-muted);
}
[data-vibeui-block="commerce-048"] [data-part="deadline"]{margin:0 0 1.5rem;font-size:0.8125rem;color:var(--vibeui-commerce-048-muted)}
[data-vibeui-block="commerce-048"] [data-part="tiers"]{list-style:none;margin:0 0 1.5rem;padding:0;display:grid;gap:0.625rem;grid-template-columns:1fr;text-align:left}
[data-vibeui-block="commerce-048"] [data-part="tier"]{
border:1px solid var(--vibeui-commerce-048-border);border-radius:0.875rem;padding:0.875rem 1rem;
background:var(--vibeui-commerce-048-panel);
}
[data-vibeui-block="commerce-048"] [data-part="off"]{display:block;font-size:1.375rem;font-weight:750;color:var(--vibeui-commerce-048-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-048"] [data-part="from"]{display:block;margin-top:0.125rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-048"] [data-part="tiernote"]{display:block;margin-top:0.25rem;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-048-muted)}
[data-vibeui-block="commerce-048"] [data-part="stock"]{max-width:26rem;margin:0 auto 1.25rem;text-align:left}
[data-vibeui-block="commerce-048"] [data-part="stocktop"]{display:flex;justify-content:space-between;gap:0.75rem;font-size:0.75rem;color:var(--vibeui-commerce-048-muted);margin-bottom:0.375rem}
[data-vibeui-block="commerce-048"] [data-part="track"]{height:0.5rem;border-radius:9999px;background:var(--vibeui-commerce-048-border);overflow:hidden}
[data-vibeui-block="commerce-048"] [data-part="fill"]{display:block;height:100%;border-radius:9999px;background:var(--vibeui-commerce-048-accent);width:var(--vibeui-commerce-048-sold,0%)}
[data-vibeui-block="commerce-048"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:3rem;padding:0 2rem;border-radius:9999px;
background:var(--vibeui-commerce-048-accent);color:oklch(0.18 0.03 285);font:inherit;font-size:1rem;font-weight:700;
transition:filter .16s ease;
}
[data-vibeui-block="commerce-048"] [data-part="go"]:hover{filter:brightness(1.08)}
[data-vibeui-block="commerce-048"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-048-fg);outline-offset:3px}
[data-vibeui-block="commerce-048"] [data-part="fine"]{margin:0.875rem auto 0;max-width:44ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-048-muted)}
@container (min-width: 40rem){
[data-vibeui-block="commerce-048"] [data-part="shell"]{padding:3.5rem 2rem 3.75rem}
[data-vibeui-block="commerce-048"] [data-part="tiers"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="commerce-048"] [data-part="unit"]{min-width:5.5rem;padding:0.875rem 0.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-048"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_UNITS: Commerce048Unit[] = [
  { id: "d", value: "02", label: "дня" },
  { id: "h", value: "11", label: "часа" },
  { id: "m", value: "48", label: "минут" },
  { id: "s", value: "30", label: "секунд" },
]

const DEFAULT_TIERS: Commerce048Tier[] = [
  {
    id: "1",
    off: "−10%",
    from: "от 5 000 ₽",
    note: "Скидка применяется в корзине, промокод не нужен.",
  },
  {
    id: "2",
    off: "−20%",
    from: "от 12 000 ₽",
    note: "Работает вместе с бесплатной доставкой по городу.",
  },
  {
    id: "3",
    off: "−30%",
    from: "от 25 000 ₽",
    note: "Не суммируется с уценкой витринных образцов.",
  },
]

/**
 * Лендинг распродажи с таймером: цифры приходят пропами и подтверждены
 * датой в теге time. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce048({
  kicker = "Распродажа сезона",
  title = "Три дня, дальше цены возвращаются",
  lead = "Скидка растёт вместе с суммой заказа и считается автоматически. Ниже показано, сколько товаров уже разобрали.",
  deadline = "Акция заканчивается 30 ноября в 23:59 по московскому времени.",
  deadlineIso = "2024-11-30T23:59:00+03:00",
  units = DEFAULT_UNITS,
  tiers = DEFAULT_TIERS,
  cta = "Открыть распродажу",
  soldLabel = "Разобрали 68% товаров акции",
  soldPercent = 68,
  fine = "Скидка не распространяется на подарочные сертификаты и товары под заказ. Итоговая цена видна в корзине до оплаты.",
  accent,
  className,
  style,
}: Commerce048Props) {
  const clamped = Math.max(0, Math.min(100, soldPercent))
  const palette = {
    "--vibeui-commerce-048-sold": `${clamped}%`,
    ...(accent ? { "--vibeui-commerce-048-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-048" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-048"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <span data-part="kicker">
            <span data-part="dot" aria-hidden="true" />
            {kicker}
          </span>
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ul data-part="clock">
            {units.map((unit) => (
              <li key={unit.id} data-part="unit">
                <span data-part="value">{unit.value}</span>
                <span data-part="unitname">{unit.label}</span>
              </li>
            ))}
          </ul>
          <p data-part="deadline">
            <time dateTime={deadlineIso}>{deadline}</time>
          </p>

          <ul data-part="tiers">
            {tiers.map((tier) => (
              <li key={tier.id} data-part="tier">
                <span data-part="off">{tier.off}</span>
                <span data-part="from">{tier.from}</span>
                <span data-part="tiernote">{tier.note}</span>
              </li>
            ))}
          </ul>

          <div data-part="stock">
            <div data-part="stocktop">
              <span>{soldLabel}</span>
              <span>{clamped}%</span>
            </div>
            <div
              data-part="track"
              role="progressbar"
              aria-valuenow={clamped}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={soldLabel}
            >
              <span data-part="fill" />
            </div>
          </div>

          <button type="button" data-part="go">
            {cta}
          </button>
          <p data-part="fine">{fine}</p>
        </div>
      </section>
    </>
  )
}
