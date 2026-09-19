"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Pricing032Plan = {
  name: string
  tagline: string
  /** Абонентская плата в месяц. */
  base: number
  /** Сколько сотрудников входит в плату. */
  included: number
  /** Цена за каждого сотрудника сверх включённых. */
  perEmployee: number
  /** Бесплатных операций в месяц; 0 — без лимита. */
  freeOperations: number
  features: readonly string[]
  actionLabel?: string
  actionHref?: string
}

export type Pricing032Props = {
  eyebrow?: string
  title?: string
  lede?: string
  plans?: readonly Pricing032Plan[]
  defaultPlan?: number
  minEmployees?: number
  maxEmployees?: number
  defaultEmployees?: number
  currency?: string
  seatsLabel?: string
  /** Единица после числа сотрудников; пусто — русское склонение. */
  seatsUnit?: string
  perMonthLabel?: string
  includedLabel?: string
  /** Шаблон чипа, {n} — число операций. */
  freeLabel?: string
  unlimitedLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тарифы одной карточкой: сверху сегментный переключатель «старт / рост /
// масштаб» с ползущей подложкой, под ним ползунок числа сотрудников; цена
// = абонентская плата + сотрудники сверх включённых, докручивается через
// requestAnimationFrame. Справа список возможностей выбранного тарифа и
// чип «бесплатно до N операций». Одна карточка вместо трёх, чтобы
// сравнивать глазами не колонки, а свою ситуацию.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-032"]){
--vibeui-pricing-032-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-032-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-032-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-032-on-accent:oklch(from var(--vibeui-pricing-032-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-032-mint:color-mix(in oklab,var(--vibeui-pricing-032-accent) 45%,#99f6e4);
--vibeui-pricing-032-muted:color-mix(in oklab,var(--vibeui-pricing-032-fg) 62%,var(--vibeui-pricing-032-bg));
--vibeui-pricing-032-line:color-mix(in oklab,var(--vibeui-pricing-032-fg) 11%,transparent);
--vibeui-pricing-032-glass:color-mix(in oklab,var(--vibeui-pricing-032-fg) 5%,transparent);
--vibeui-pricing-032-aurora:linear-gradient(120deg,var(--vibeui-pricing-032-accent),var(--vibeui-pricing-032-mint));
--vibeui-pricing-032-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-032-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-032-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-032"]{color-scheme:dark}
:where([data-vibeui-block="pricing-032"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-032"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-032"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-pricing-032-bg);color:var(--vibeui-pricing-032-fg);font-family:var(--vibeui-pricing-032-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-032"] *{box-sizing:border-box}
[data-vibeui-block="pricing-032"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="pricing-032"] [data-part="head"]{max-width:40rem;margin:0 auto 2.5rem;text-align:center}
[data-vibeui-block="pricing-032"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-pricing-032-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-pricing-032-accent)}
[data-vibeui-block="pricing-032"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-032-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="pricing-032"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-pricing-032-muted)}
[data-vibeui-block="pricing-032"] [data-part="card"]{position:relative;isolation:isolate;display:grid;gap:2rem;max-width:64rem;margin:0 auto;padding:1.6rem;border-radius:1.8rem;background:linear-gradient(color-mix(in oklab,var(--vibeui-pricing-032-bg) 70%,transparent),color-mix(in oklab,var(--vibeui-pricing-032-bg) 70%,transparent)) padding-box,linear-gradient(140deg,color-mix(in oklab,var(--vibeui-pricing-032-accent) 60%,transparent),var(--vibeui-pricing-032-line) 40%,var(--vibeui-pricing-032-line) 70%,color-mix(in oklab,var(--vibeui-pricing-032-mint) 50%,transparent)) border-box;border:1px solid transparent;backdrop-filter:blur(20px);box-shadow:0 40px 80px -40px rgb(0 0 0 / .7)}
[data-vibeui-block="pricing-032"] [data-part="card"]::before{content:"";position:absolute;z-index:-1;inset:-30% auto auto -10%;width:50%;height:60%;background:radial-gradient(closest-side,var(--vibeui-pricing-032-accent),transparent);opacity:.2;filter:blur(60px);pointer-events:none}
[data-vibeui-block="pricing-032"] [data-part="switch"]{position:relative;display:grid;grid-template-columns:repeat(var(--vibeui-pricing-032-n),1fr);padding:.3rem;border-radius:1rem;background:var(--vibeui-pricing-032-glass);border:1px solid var(--vibeui-pricing-032-line)}
[data-vibeui-block="pricing-032"] [data-part="switch"]::before{content:"";position:absolute;top:.3rem;bottom:.3rem;left:.3rem;width:calc((100% - .6rem) / var(--vibeui-pricing-032-n));border-radius:.75rem;background:var(--vibeui-pricing-032-accent);transform:translateX(calc(var(--vibeui-pricing-032-i) * 100%));transition:transform .4s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="pricing-032"] [data-part="switch"] button{position:relative;padding:.7rem .4rem;border:0;border-radius:.75rem;background:transparent;color:var(--vibeui-pricing-032-muted);font:inherit;font-weight:600;font-size:.9rem;cursor:pointer;transition:color .3s}
[data-vibeui-block="pricing-032"] [data-part="switch"] button[aria-pressed="true"]{color:var(--vibeui-pricing-032-on-accent)}
[data-vibeui-block="pricing-032"] [data-part="switch"] button:focus-visible{outline:2px solid var(--vibeui-pricing-032-accent);outline-offset:2px}
[data-vibeui-block="pricing-032"] [data-part="tagline"]{margin:1rem 0 0;font-size:.9rem;color:var(--vibeui-pricing-032-muted);min-height:2.7em}
[data-vibeui-block="pricing-032"] [data-part="seats"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin:1.4rem 0 0;font-size:.9rem;color:var(--vibeui-pricing-032-muted)}
[data-vibeui-block="pricing-032"] [data-part="seats"] output{font-family:var(--vibeui-pricing-032-mono);font-weight:600;font-size:1.3rem;color:var(--vibeui-pricing-032-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-032"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.5rem;margin:.8rem 0 0;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-pricing-032-accent) var(--vibeui-pricing-032-fill),var(--vibeui-pricing-032-line) var(--vibeui-pricing-032-fill));outline:none;cursor:pointer}
[data-vibeui-block="pricing-032"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-032-bg);border:3px solid var(--vibeui-pricing-032-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-pricing-032-accent) 20%,transparent);cursor:grab}
[data-vibeui-block="pricing-032"] [data-part="range"]::-moz-range-thumb{width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-pricing-032-bg);border:3px solid var(--vibeui-pricing-032-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-pricing-032-accent) 20%,transparent);cursor:grab}
[data-vibeui-block="pricing-032"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-pricing-032-accent) 40%,transparent)}
[data-vibeui-block="pricing-032"] [data-part="price"]{margin:1.8rem 0 0;display:flex;flex-wrap:wrap;align-items:baseline;gap:.3rem .6rem}
[data-vibeui-block="pricing-032"] [data-part="price"] strong{font-family:var(--vibeui-pricing-032-mono);font-weight:600;font-size:clamp(2.4rem,6cqi,3.6rem);line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-032"] [data-part="price"] span{font-size:.9rem;color:var(--vibeui-pricing-032-muted)}
[data-vibeui-block="pricing-032"] [data-part="breakdown"]{margin:.6rem 0 0;font-family:var(--vibeui-pricing-032-mono);font-size:.74rem;color:var(--vibeui-pricing-032-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-032"] [data-part="details"]{display:grid;gap:1.2rem;align-content:start}
[data-vibeui-block="pricing-032"] [data-part="free"]{display:inline-flex;align-items:center;gap:.5rem;justify-self:start;padding:.45rem .9rem;border-radius:999px;font-family:var(--vibeui-pricing-032-mono);font-size:.78rem;background:color-mix(in oklab,var(--vibeui-pricing-032-accent) 16%,transparent);color:var(--vibeui-pricing-032-accent)}
[data-vibeui-block="pricing-032"] [data-part="free"]::before{content:"";width:.45rem;height:.45rem;border-radius:50%;background:currentColor}
[data-vibeui-block="pricing-032"] [data-part="features"]{margin:0;padding:0;list-style:none;display:grid;gap:.55rem;font-size:.92rem}
[data-vibeui-block="pricing-032"] [data-part="features"] li{display:flex;gap:.6rem;align-items:baseline;animation:vibeui-pricing-032-in .4s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-pricing-032-i) * 60ms)}
[data-vibeui-block="pricing-032"] [data-part="features"] li::before{content:"✓";font-family:var(--vibeui-pricing-032-mono);color:var(--vibeui-pricing-032-accent);font-size:.8rem}
[data-vibeui-block="pricing-032"] [data-part="action"]{display:inline-flex;justify-content:center;align-items:center;justify-self:start;padding:.85rem 1.4rem;border-radius:999px;font-weight:600;text-decoration:none;background:var(--vibeui-pricing-032-accent);color:var(--vibeui-pricing-032-on-accent);transition:transform .18s,box-shadow .25s}
[data-vibeui-block="pricing-032"] [data-part="action"]:hover{transform:translateY(-1px);box-shadow:0 12px 30px -10px var(--vibeui-pricing-032-accent)}
[data-vibeui-block="pricing-032"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-pricing-032-fg);outline-offset:2px}
@keyframes vibeui-pricing-032-in{from{opacity:0;transform:translateX(-6px)}}
@container (min-width: 56rem){[data-vibeui-block="pricing-032"] [data-part="card"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:3rem;padding:2.4rem}[data-vibeui-block="pricing-032"] [data-part="details"]{padding-left:3rem;border-left:1px solid var(--vibeui-pricing-032-line)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-032"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PLANS: Pricing032Plan[] = [
  { name: "Старт", tagline: "Для ИП и компаний, которые только открылись: счёт, карта и налоги — бесплатно.", base: 0, included: 1, perEmployee: 0, freeOperations: 20, features: ["Счёт и бизнес-карта за 10 минут", "Бесплатно до 20 операций в месяц", "Переводы по СБП без комиссии", "Налоги УСН считаются сами"], actionLabel: "Открыть бесплатно", actionHref: "#open" },
  { name: "Рост", tagline: "Для команды до 20 человек: карты сотрудникам, 1С, маркетплейсы и живая поддержка.", base: 490, included: 3, perEmployee: 150, freeOperations: 200, features: ["Всё из «Старта»", "Бесплатно до 200 операций в месяц", "Карты сотрудникам с лимитами", "Выписки в 1С каждые 15 минут", "Выплаты маркетплейсов день в день"], actionLabel: "Выбрать «Рост»", actionHref: "#open" },
  { name: "Масштаб", tagline: "Для оборота от 10 млн ₽: безлимит операций, валютные счета и персональный менеджер.", base: 1990, included: 10, perEmployee: 90, freeOperations: 0, features: ["Всё из «Роста»", "Операции без лимита", "Счета в юанях, долларах и евро", "Зарплатный проект без комиссии", "Персональный менеджер в Telegram"], actionLabel: "Обсудить условия", actionHref: "#contact" },
]

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function plural(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10
  const mod100 = value % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

/** Тарифы с переключателем планов и ползунком сотрудников. */
export function Pricing032({
  eyebrow = "Тарифы",
  title = "Платите за размер бизнеса, а не за банк",
  lede = "Выберите тариф и подвиньте ползунок под число сотрудников — цена пересчитается. Первые операции в каждом месяце бесплатные.",
  plans = DEFAULT_PLANS,
  defaultPlan = 1,
  minEmployees = 1,
  maxEmployees = 50,
  defaultEmployees = 6,
  currency = "₽",
  seatsLabel = "Сотрудников с картами",
  seatsUnit,
  perMonthLabel = "в месяц",
  includedLabel = "включено",
  freeLabel = "бесплатно до {n} операций / мес",
  unlimitedLabel = "операции без лимита",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing032Props) {
  const [planIndex, setPlanIndex] = useState(Math.min(defaultPlan, Math.max(0, plans.length - 1)))
  const [employees, setEmployees] = useState(defaultEmployees)
  const plan = plans[planIndex]
  const extra = plan ? Math.max(0, employees - plan.included) : 0
  const total = plan ? plan.base + extra * plan.perEmployee : 0
  const [shown, setShown] = useState(total)
  const shownRef = useRef(total)

  useEffect(() => {
    const from = shownRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 500)
      const k = 1 - Math.pow(1 - t, 3)
      shownRef.current = from + (total - from) * k
      setShown(shownRef.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [total])

  const fill = `${((employees - minEmployees) / Math.max(1, maxEmployees - minEmployees)) * 100}%`

  const palette = {
    ...(accent ? { "--vibeui-pricing-032-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-032-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-032-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-032" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-032" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          {plan ? (
            <div data-part="card">
              <div data-part="controls">
                <div data-part="switch" role="group" aria-label="Тариф" style={{ ["--vibeui-pricing-032-n" as string]: plans.length, ["--vibeui-pricing-032-i" as string]: planIndex }}>
                  {plans.map((item, index) => (
                    <button key={item.name} type="button" aria-pressed={index === planIndex} onClick={() => setPlanIndex(index)}>
                      {item.name}
                    </button>
                  ))}
                </div>
                <p data-part="tagline">{plan.tagline}</p>
                <label data-part="seats">
                  <span>{seatsLabel}</span>
                  <output>
                    {employees} {seatsUnit ?? plural(employees, "человек", "человека", "человек")}
                  </output>
                </label>
                <input data-part="range" type="range" min={minEmployees} max={maxEmployees} value={employees} onChange={(event) => setEmployees(Number(event.target.value))} aria-label={seatsLabel} style={{ ["--vibeui-pricing-032-fill" as string]: fill }} />
                <p data-part="price" aria-live="polite">
                  <strong>{formatMoney(shown, currency)}</strong>
                  <span>{perMonthLabel}</span>
                </p>
                <p data-part="breakdown">
                  {plan.perEmployee === 0 || extra === 0 ? `${formatMoney(plan.base, currency)} · ${plan.included} ${includedLabel}` : `${formatMoney(plan.base, currency)} + ${extra} × ${formatMoney(plan.perEmployee, currency)}`}
                </p>
              </div>
              <div data-part="details" key={planIndex}>
                <span data-part="free">{plan.freeOperations > 0 ? freeLabel.replace("{n}", String(plan.freeOperations)) : unlimitedLabel}</span>
                <ul data-part="features">
                  {plan.features.map((feature, index) => (
                    <li key={feature} style={{ ["--vibeui-pricing-032-i" as string]: index }}>
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.actionLabel ? (
                  <a data-part="action" href={plan.actionHref ?? "#"}>
                    {plan.actionLabel}
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
