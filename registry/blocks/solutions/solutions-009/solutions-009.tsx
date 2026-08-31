import type { CSSProperties } from "react"

export type Solutions009Subscription = {
  customer: string
  plan: string
  amount: string
  period: string
  renewsIn: number
  seats?: number
  autoRenew?: boolean
}

export type Solutions009Props = {
  title?: string
  hint?: string
  mrr?: string
  mrrDelta?: string
  window?: number
  items?: Solutions009Subscription[]
  soonLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подписки и их продления. Срок написан обратным отсчётом
// («через 3 дня»), а не датой: дата требует держать в голове сегодняшнее число.
// Полоса рисует остаток от окна внимания, поэтому ближайшие продления сами
// собираются в верх списка глазами. Отключённое автопродление — это не
// «настройка», а предупреждение: строка помечается рамкой и словом, потому что
// такие подписки молча заканчиваются.
const STYLES = `
:where([data-vibeui-block="solutions-009"]){
--vibeui-solutions-009-bg:oklch(1 0 0);
--vibeui-solutions-009-panel:oklch(0.98 0.004 240);
--vibeui-solutions-009-fg:oklch(0.22 0.014 265);
--vibeui-solutions-009-muted:oklch(0.55 0.014 265);
--vibeui-solutions-009-border:oklch(0.9 0.006 265);
--vibeui-solutions-009-accent:oklch(0.55 0.16 165);
--vibeui-solutions-009-warn:oklch(0.65 0.17 45);
--vibeui-solutions-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-009"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-009-bg);
border:1px solid var(--vibeui-solutions-009-border);border-radius:1rem;
font-family:var(--vibeui-solutions-009-sans);color:var(--vibeui-solutions-009-fg);
}
[data-vibeui-block="solutions-009"] *{box-sizing:border-box}
[data-vibeui-block="solutions-009"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="solutions-009"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-009"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-009-muted)}
[data-vibeui-block="solutions-009"] [data-part="mrr"]{
margin:0;text-align:right;font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;line-height:1.1;
}
[data-vibeui-block="solutions-009"] [data-part="delta"]{
display:block;font-size:0.6875rem;font-weight:600;color:var(--vibeui-solutions-009-accent);
}
[data-vibeui-block="solutions-009"] ul{list-style:none;margin:0.875rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="solutions-009"] li{
display:grid;gap:0.5rem;padding:0.6875rem 0.75rem;border-radius:0.875rem;
background:var(--vibeui-solutions-009-panel);
border:1px solid var(--vibeui-solutions-009-border);
}
@container (min-width: 40rem){
[data-vibeui-block="solutions-009"] li{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) 10rem;align-items:center}
}
/* Отключённое автопродление — предупреждение, а не настройка: рамка и слово. */
[data-vibeui-block="solutions-009"] [data-manual="true"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-009-warn) 55%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-009-warn) 7%,var(--vibeui-solutions-009-bg));
}
[data-vibeui-block="solutions-009"] [data-part="customer"]{display:block;font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="solutions-009"] [data-part="plan"]{
display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-solutions-009-muted);
}
[data-vibeui-block="solutions-009"] [data-part="price"]{
font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-009"] [data-part="period"]{
display:block;font-size:0.75rem;font-weight:400;color:var(--vibeui-solutions-009-muted);
}
/* Обратный отсчёт вместо даты: «через 3 дня» не требует считать в уме. */
[data-vibeui-block="solutions-009"] [data-part="renew"]{
display:block;font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-009"] [data-soon="true"] [data-part="renew"]{color:var(--vibeui-solutions-009-warn)}
[data-vibeui-block="solutions-009"] [data-part="track"]{
margin-top:0.3125rem;height:0.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-009-fg) 10%,transparent);
}
[data-vibeui-block="solutions-009"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;background:var(--vibeui-solutions-009-accent);
}
[data-vibeui-block="solutions-009"] [data-soon="true"] [data-part="fill"]{background:var(--vibeui-solutions-009-warn)}
[data-vibeui-block="solutions-009"] [data-part="manual"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-009-warn);
}
[data-vibeui-block="solutions-009"] [data-part="foot"]{
margin:0.875rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Solutions009Subscription[] = [
  {
    customer: "Кофейня «Мера»",
    plan: "Команда · 12 мест",
    amount: "14 400 ₽",
    period: "в месяц",
    renewsIn: 2,
    seats: 12,
    autoRenew: false,
  },
  {
    customer: "Логистика «Верста»",
    plan: "Бизнес · 40 мест",
    amount: "62 000 ₽",
    period: "в месяц",
    renewsIn: 6,
    seats: 40,
    autoRenew: true,
  },
  {
    customer: "Ателье «Нить»",
    plan: "Старт · 3 места",
    amount: "2 900 ₽",
    period: "в месяц",
    renewsIn: 14,
    seats: 3,
    autoRenew: true,
  },
  {
    customer: "Клиника «Исток»",
    plan: "Бизнес · год",
    amount: "540 000 ₽",
    period: "в год",
    renewsIn: 24,
    seats: 90,
    autoRenew: true,
  },
]

function days(count: number) {
  const last = count % 10
  const teen = count % 100

  if (teen >= 11 && teen <= 14) return "дней"
  if (last === 1) return "день"
  if (last >= 2 && last <= 4) return "дня"
  return "дней"
}

/**
 * Подписки и продления: срок — обратный отсчёт, полоса рисует остаток окна.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions009({
  title = "Подписки",
  hint = "Продления ближайшего месяца",
  mrr = "619 300 ₽",
  mrrDelta = "+8,2% к февралю",
  window = 30,
  items = DEFAULT_ITEMS,
  soonLabel = "автопродление выключено — подписка закончится сама",
  accent,
  className,
  style,
}: Solutions009Props) {
  const manual = items.filter((item) => item.autoRenew === false).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-009"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <p data-part="mrr">
            {mrr}
            <span data-part="delta">{mrrDelta}</span>
          </p>
        </header>

        <ul>
          {items.map((item) => {
            const left = Math.max(0, Math.min(window, item.renewsIn))
            const share = Math.round(((window - left) / window) * 100)
            const soon = left <= 7

            return (
              <li
                key={item.customer}
                data-soon={soon ? "true" : "false"}
                data-manual={item.autoRenew === false ? "true" : "false"}
              >
                <div>
                  <span data-part="customer">{item.customer}</span>
                  <span data-part="plan">
                    {item.plan}
                    {item.seats ? ` · ${item.seats} мест` : ""}
                  </span>
                </div>

                <p data-part="price">
                  {item.amount}
                  <span data-part="period">{item.period}</span>
                </p>

                <div>
                  <span data-part="renew">
                    через {item.renewsIn} {days(item.renewsIn)}
                  </span>
                  <div
                    data-part="track"
                    role="progressbar"
                    aria-valuenow={share}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`До продления ${item.customer}`}
                  >
                    <span data-part="fill" style={{ width: `${share}%` }} />
                  </div>
                  {item.autoRenew === false ? (
                    <span data-part="manual">{soonLabel}</span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>

        <p data-part="foot">
          Всего {items.length} подписок, без автопродления — {manual}.
        </p>
      </section>
    </>
  )
}
