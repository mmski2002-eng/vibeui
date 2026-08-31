import type { CSSProperties } from "react"

export type Pricing010Props = {
  eyebrow?: string
  title?: string
  lede?: string
  trialDays?: number
  price?: string
  period?: string
  timeline?: { day: string; title: string; description: string }[]
  action?: { label: string; href: string }
  reassurance?: string[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: продаётся не тариф, а спокойствие первых двух недель. Вместо
// списка возможностей — лента событий пробного периода: что произойдёт
// сегодня, за три дня до конца и в день списания. Главный страх пробного
// периода — «забуду отменить и спишут», и секция отвечает на него прямо в
// ленте, а не в мелком шрифте внизу. Лента — <ol>: порядок дней важен и
// должен читаться голосом, а не только цветными точками.
const STYLES = `
:where([data-vibeui-block="pricing-010"]){
--vibeui-pricing-010-bg:oklch(0.98 0.006 145);
--vibeui-pricing-010-fg:oklch(0.19 0.016 145);
--vibeui-pricing-010-muted:oklch(0.5 0.016 145);
--vibeui-pricing-010-card:oklch(1 0 0);
--vibeui-pricing-010-line:oklch(0.88 0.01 145);
--vibeui-pricing-010-accent:oklch(0.5 0.13 150);
--vibeui-pricing-010-accent-fg:oklch(0.99 0 0);
--vibeui-pricing-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="pricing-010"]{
box-sizing:border-box;background:var(--vibeui-pricing-010-bg);color:var(--vibeui-pricing-010-fg);
font-family:var(--vibeui-pricing-010-sans);
}
[data-vibeui-block="pricing-010"] *{box-sizing:border-box}
[data-vibeui-block="pricing-010"] [data-part="shell"]{
max-width:62rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:1fr;gap:2rem;
}
[data-vibeui-block="pricing-010"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-010-accent);
}
[data-vibeui-block="pricing-010"] h2{
margin:0;max-width:20ch;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-010"] [data-part="lede"]{margin:0.875rem 0 0;max-width:32rem;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-pricing-010-muted);text-wrap:pretty}
[data-vibeui-block="pricing-010"] [data-part="days"]{
display:inline-flex;align-items:baseline;gap:0.5rem;margin:1.5rem 0 0;padding:0.75rem 1.125rem;border-radius:0.875rem;
background:var(--vibeui-pricing-010-accent);color:var(--vibeui-pricing-010-accent-fg);
}
[data-vibeui-block="pricing-010"] [data-part="daysnum"]{font-size:2rem;font-weight:700;letter-spacing:-0.04em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-010"] [data-part="dayslabel"]{font-size:0.875rem;font-weight:600}
[data-vibeui-block="pricing-010"] [data-part="after"]{margin:1rem 0 0;font-size:0.875rem;color:var(--vibeui-pricing-010-muted)}
[data-vibeui-block="pricing-010"] [data-part="after"] b{color:var(--vibeui-pricing-010-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-010"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:1.5rem;height:2.875rem;padding:0 1.5rem;
border-radius:0.75rem;background:var(--vibeui-pricing-010-accent);color:var(--vibeui-pricing-010-accent-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color .16s ease;
}
[data-vibeui-block="pricing-010"] a:hover{background:color-mix(in oklab,var(--vibeui-pricing-010-accent) 86%,black)}
[data-vibeui-block="pricing-010"] a:focus-visible{outline:2px solid var(--vibeui-pricing-010-accent);outline-offset:3px}
[data-vibeui-block="pricing-010"] [data-part="reassure"]{list-style:none;margin:1.25rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="pricing-010"] [data-part="reassure"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-pricing-010-muted)}
[data-vibeui-block="pricing-010"] [data-part="tick"]{flex:0 0 auto;margin-top:0.1875rem;color:var(--vibeui-pricing-010-accent)}
[data-vibeui-block="pricing-010"] [data-part="timeline"]{
list-style:none;margin:0;padding:1.5rem;border-radius:1.125rem;
border:1px solid var(--vibeui-pricing-010-line);background:var(--vibeui-pricing-010-card);
}
[data-vibeui-block="pricing-010"] [data-part="event"]{position:relative;padding:0 0 1.5rem 2rem}
[data-vibeui-block="pricing-010"] [data-part="event"]:last-child{padding-bottom:0}
[data-vibeui-block="pricing-010"] [data-part="event"]::before{
content:"";position:absolute;left:0.3125rem;top:1.125rem;bottom:0;width:1px;background:var(--vibeui-pricing-010-line);
}
[data-vibeui-block="pricing-010"] [data-part="event"]:last-child::before{display:none}
[data-vibeui-block="pricing-010"] [data-part="pin"]{
position:absolute;left:0;top:0.375rem;width:0.6875rem;height:0.6875rem;border-radius:9999px;
border:2px solid var(--vibeui-pricing-010-accent);background:var(--vibeui-pricing-010-card);
}
[data-vibeui-block="pricing-010"] [data-part="day"]{
display:block;font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-pricing-010-accent);
}
[data-vibeui-block="pricing-010"] h3{margin:0.25rem 0 0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="pricing-010"] [data-part="event"] p{margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-pricing-010-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-010"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-010"] [data-part="timeline"]{padding:1.875rem}
}
@container (min-width: 56rem){
[data-vibeui-block="pricing-010"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,24rem);gap:3.5rem;align-items:start;padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TIMELINE = [
  {
    day: "Сегодня",
    title: "Открывается весь каталог",
    description:
      "Карту привязывать не нужно. Ставьте секции в рабочий проект сразу.",
  },
  {
    day: "День 11",
    title: "Письмо-напоминание",
    description:
      "За три дня до конца пробного периода приходит письмо с датой и суммой.",
  },
  {
    day: "День 14",
    title: "Решение за вами",
    description:
      "Не подтвердили — доступ просто закрывается. Автоматического списания нет.",
  },
]

const DEFAULT_REASSURANCE = [
  "Карта на старте не нужна",
  "Списания без подтверждения не будет",
  "Установленные секции остаются вашими",
]

/** Тариф с пробным периодом: лента событий вместо мелкого шрифта об отмене. */
export function Pricing010({
  eyebrow = "Пробный период",
  title = "Четырнадцать дней, о которых нечего беспокоиться",
  lede = "Пробный период устроен так, чтобы вы про него не вспоминали в тревоге: без карты на старте и без автосписания в конце.",
  trialDays = 14,
  price = "1 490 ₽",
  period = "в месяц",
  timeline = DEFAULT_TIMELINE,
  action = { label: "Начать пробный период", href: "#" },
  reassurance = DEFAULT_REASSURANCE,
  accent,
  className,
  style,
}: Pricing010Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-010" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}

            <p data-part="days">
              <span data-part="daysnum">{trialDays}</span>
              <span data-part="dayslabel">дней бесплатно</span>
            </p>

            <p data-part="after">
              Дальше — <b>{price}</b> {period}, если решите остаться.
            </p>

            <a href={action.href}>{action.label}</a>

            <ul data-part="reassure">
              {reassurance.slice(0, 4).map((item) => (
                <li key={item}>
                  <span data-part="tick" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="12" height="12">
                      <path
                        d="M3.5 8.5 6.5 11.5 12.5 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <ol data-part="timeline">
            {timeline.slice(0, 4).map((event) => (
              <li key={event.day} data-part="event">
                <span data-part="pin" aria-hidden="true" />
                <span data-part="day">{event.day}</span>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
