"use client"

import { useState, type CSSProperties } from "react"

export type Market003License = {
  name: string
  /** Множитель к базовой цене товара. */
  factor: number
  /** Для командной лицензии: сколько мест входит в множитель. */
  seatsIncluded?: number
  /** Доплата за каждое место сверх включённых, в долях базовой цены. */
  perExtraSeat?: number
  who: string
  /** Пункты: «+» — можно, «−» — нельзя. */
  rules: readonly string[]
  featured?: boolean
}

export type Market003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  licenses?: readonly Market003License[]
  /** Примеры базовой цены для пересчёта. */
  samplePrices?: readonly number[]
  minSeats?: number
  maxSeats?: number
  defaultSeats?: number
  currency?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Сравнение лицензий как три «билета» с перфорацией по линии отрыва
// (radial-gradient маской) и корешком, где крупно стоит цена. Сверху
// чипы базовой цены товара и степпер мест для командной лицензии — цены
// в билетах пересчитываются с tabular-nums. Правила — списком «+ / −»,
// коммерческий билет отмечен наклонным стикером «берут чаще».
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="market-003"]){
--vibeui-market-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-market-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-market-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-market-003-on-accent:oklch(from var(--vibeui-market-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-market-003-muted:color-mix(in oklab,var(--vibeui-market-003-fg) 58%,var(--vibeui-market-003-bg));
--vibeui-market-003-line:color-mix(in oklab,var(--vibeui-market-003-fg) 12%,transparent);
--vibeui-market-003-soft:color-mix(in oklab,var(--vibeui-market-003-fg) 4%,transparent);
--vibeui-market-003-paper:color-mix(in oklab,var(--vibeui-market-003-bg) 92%,var(--vibeui-market-003-fg));
--vibeui-market-003-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-market-003-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-market-003-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="market-003"]{color-scheme:dark}
:where([data-vibeui-block="market-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="market-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="market-003"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-market-003-bg);color:var(--vibeui-market-003-fg);font-family:var(--vibeui-market-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="market-003"] *{box-sizing:border-box}
[data-vibeui-block="market-003"] [data-part="shell"]{max-width:86rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="market-003"] [data-part="head"]{display:grid;gap:1.5rem;align-items:end}
[data-vibeui-block="market-003"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-market-003-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-market-003-muted)}
[data-vibeui-block="market-003"] [data-part="title"]{margin:0;max-width:22ch;font-family:var(--vibeui-market-003-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:.98;letter-spacing:-.04em}
[data-vibeui-block="market-003"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-market-003-muted)}
[data-vibeui-block="market-003"] [data-part="controls"]{display:grid;gap:.9rem;padding:1rem 1.1rem;border-radius:1.1rem;border:1px solid var(--vibeui-market-003-line);background:var(--vibeui-market-003-soft)}
[data-vibeui-block="market-003"] [data-part="control"]{display:grid;gap:.45rem}
[data-vibeui-block="market-003"] [data-part="control"] > span{font-family:var(--vibeui-market-003-mono);font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-market-003-muted)}
[data-vibeui-block="market-003"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.35rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="market-003"] [data-part="chips"] button{height:2.1rem;padding:0 .8rem;border-radius:999px;border:1px solid var(--vibeui-market-003-line);background:var(--vibeui-market-003-bg);color:var(--vibeui-market-003-fg);font-family:var(--vibeui-market-003-mono);font-size:.78rem;font-variant-numeric:tabular-nums;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="market-003"] [data-part="chips"] button[aria-pressed="true"]{background:var(--vibeui-market-003-fg);color:var(--vibeui-market-003-bg);border-color:var(--vibeui-market-003-fg)}
[data-vibeui-block="market-003"] [data-part="stepper"]{display:inline-flex;align-items:center;gap:.2rem;height:2.1rem;padding:.15rem;border-radius:999px;border:1px solid var(--vibeui-market-003-line);background:var(--vibeui-market-003-bg);width:max-content}
[data-vibeui-block="market-003"] [data-part="stepper"] button{width:1.7rem;height:1.7rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-market-003-fg);font:inherit;font-size:1rem;line-height:1;cursor:pointer;transition:background .2s}
[data-vibeui-block="market-003"] [data-part="stepper"] button:hover{background:var(--vibeui-market-003-soft)}
[data-vibeui-block="market-003"] [data-part="stepper"] button:disabled{opacity:.3;cursor:default}
[data-vibeui-block="market-003"] [data-part="stepper"] output{min-width:4.2rem;text-align:center;font-family:var(--vibeui-market-003-mono);font-size:.8rem;font-variant-numeric:tabular-nums}
[data-vibeui-block="market-003"] [data-part="grid"]{display:grid;gap:1.2rem;margin:2.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="market-003"] [data-part="ticket"]{position:relative;display:grid;grid-template-rows:auto 1fr;border-radius:1.2rem;background:var(--vibeui-market-003-paper);border:1px solid var(--vibeui-market-003-line);isolation:isolate}
[data-vibeui-block="market-003"] [data-part="ticket"][data-featured="true"]{border-color:var(--vibeui-market-003-accent);box-shadow:0 30px 60px -40px var(--vibeui-market-003-accent)}
[data-vibeui-block="market-003"] [data-part="stub"]{position:relative;padding:1.4rem 1.4rem 1.6rem;border-bottom:2px dashed var(--vibeui-market-003-line)}
[data-vibeui-block="market-003"] [data-part="stub"]::before,[data-vibeui-block="market-003"] [data-part="stub"]::after{content:"";position:absolute;bottom:-.65rem;width:1.3rem;height:1.3rem;border-radius:50%;background:var(--vibeui-market-003-bg);border:1px solid var(--vibeui-market-003-line);z-index:1}
[data-vibeui-block="market-003"] [data-part="stub"]::before{left:-.7rem;clip-path:inset(0 0 0 50%)}
[data-vibeui-block="market-003"] [data-part="stub"]::after{right:-.7rem;clip-path:inset(0 50% 0 0)}
[data-vibeui-block="market-003"] [data-part="ticket"][data-featured="true"] [data-part="stub"]::before,[data-vibeui-block="market-003"] [data-part="ticket"][data-featured="true"] [data-part="stub"]::after{border-color:var(--vibeui-market-003-accent)}
[data-vibeui-block="market-003"] [data-part="ticket"] h3{margin:0;font-family:var(--vibeui-market-003-display);font-weight:700;font-size:1.25rem;letter-spacing:-.02em}
[data-vibeui-block="market-003"] [data-part="who"]{margin:.3rem 0 0;font-size:.86rem;color:var(--vibeui-market-003-muted)}
[data-vibeui-block="market-003"] [data-part="amount"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.3rem .5rem;margin:1.2rem 0 0;font-family:var(--vibeui-market-003-display);font-weight:800;font-size:2.4rem;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="market-003"] [data-part="amount"] small{font-family:var(--vibeui-market-003-mono);font-weight:400;font-size:.68rem;letter-spacing:.02em;color:var(--vibeui-market-003-muted)}
[data-vibeui-block="market-003"] [data-part="amount"] output{animation:vibeui-market-003-pop .35s cubic-bezier(.2,1.2,.4,1)}
[data-vibeui-block="market-003"] [data-part="sticker"]{position:absolute;top:-.8rem;right:1rem;padding:.3rem .7rem;border-radius:.4rem;background:var(--vibeui-market-003-accent);color:var(--vibeui-market-003-on-accent);font-family:var(--vibeui-market-003-mono);font-size:.66rem;letter-spacing:.04em;text-transform:uppercase;transform:rotate(3deg);box-shadow:0 6px 16px -8px rgb(0 0 0 / .5)}
[data-vibeui-block="market-003"] [data-part="rules"]{margin:0;padding:1.3rem 1.4rem 1.5rem;list-style:none;display:grid;gap:.55rem;align-content:start;font-size:.9rem}
[data-vibeui-block="market-003"] [data-part="rules"] li{display:flex;gap:.6rem;align-items:baseline}
[data-vibeui-block="market-003"] [data-part="rules"] li::before{content:attr(data-sign);flex-shrink:0;width:1.2rem;height:1.2rem;border-radius:999px;display:inline-grid;place-items:center;font-family:var(--vibeui-market-003-mono);font-size:.7rem;line-height:1;transform:translateY(.15rem)}
[data-vibeui-block="market-003"] [data-part="rules"] li[data-sign="+"]::before{background:color-mix(in oklab,var(--vibeui-market-003-accent) 15%,transparent);color:var(--vibeui-market-003-accent)}
[data-vibeui-block="market-003"] [data-part="rules"] li[data-sign="−"]{color:var(--vibeui-market-003-muted)}
[data-vibeui-block="market-003"] [data-part="rules"] li[data-sign="−"]::before{background:var(--vibeui-market-003-line)}
[data-vibeui-block="market-003"] [data-part="rules"] li[data-sign="−"] span{text-decoration:line-through;text-decoration-color:color-mix(in oklab,var(--vibeui-market-003-fg) 30%,transparent)}
[data-vibeui-block="market-003"] button:focus-visible{outline:2px solid var(--vibeui-market-003-accent);outline-offset:2px}
@keyframes vibeui-market-003-pop{0%{transform:scale(.94);opacity:.4}100%{transform:scale(1);opacity:1}}
@container (min-width: 40rem){[data-vibeui-block="market-003"] [data-part="controls"]{grid-template-columns:auto auto;justify-content:start;gap:2rem}}
@container (min-width: 56rem){[data-vibeui-block="market-003"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}[data-vibeui-block="market-003"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}[data-vibeui-block="market-003"] [data-part="ticket"][data-featured="true"]{transform:translateY(-.6rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="market-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_LICENSES: Market003License[] = [
  { name: "Личная", factor: 1, who: "Один человек, свои проекты и портфолио.", rules: ["+ Личные и учебные проекты", "+ Портфолио и соцсети", "+ Обновления навсегда", "− Клиентские проекты", "− Передача файлов третьим лицам"] },
  { name: "Коммерческая", factor: 2.5, who: "Один дизайнер, любые клиенты, без ограничения проектов.", rules: ["+ Всё из личной", "+ Клиентские проекты без лимита", "+ Продукты с продажами", "+ Приоритетная поддержка автора", "− Общий доступ для команды"], featured: true },
  { name: "Команда", factor: 5, seatsIncluded: 10, perExtraSeat: 0.4, who: "До 10 человек включено, дальше — доплата за место.", rules: ["+ Всё из коммерческой", "+ Общая библиотека в Figma", "+ Счёт и договор на компанию", "+ Менеджер и SLA на ответ", "+ Места добавляются в любой момент"] },
]

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

/** Три лицензии-«билета» с перфорацией, ценой от базовой и степпером мест. */
export function Market003({
  eyebrow = "лицензии",
  title = "Одна цена товара — три способа им пользоваться",
  lede = "Цена лицензии считается от базовой цены товара. Выберите пример — билеты пересчитаются.",
  licenses = DEFAULT_LICENSES,
  samplePrices = [990, 2490, 3900],
  minSeats = 5,
  maxSeats = 50,
  defaultSeats = 10,
  currency = "₽",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Market003Props) {
  const [base, setBase] = useState(samplePrices[1] ?? samplePrices[0] ?? 0)
  const [seats, setSeats] = useState(defaultSeats)

  const priceFor = (license: Market003License) => {
    const included = license.seatsIncluded ?? 0
    const extra = license.perExtraSeat && seats > included ? (seats - included) * license.perExtraSeat * base : 0
    return base * license.factor + extra
  }

  const palette = {
    ...(accent ? { "--vibeui-market-003-accent": accent } : null),
    ...(ink ? { "--vibeui-market-003-fg": ink } : null),
    ...(background ? { "--vibeui-market-003-bg": background } : null),
    ...style,
  } as CSSProperties

  const hasSeats = licenses.some((license) => license.seatsIncluded)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-market-003" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="market-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <div data-part="controls">
              <div data-part="control">
                <span>Базовая цена товара</span>
                <ul data-part="chips">
                  {samplePrices.map((price) => (
                    <li key={price}>
                      <button type="button" aria-pressed={base === price} onClick={() => setBase(price)}>
                        {formatMoney(price, currency)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {hasSeats ? (
                <div data-part="control">
                  <span>Человек в команде</span>
                  <div data-part="stepper">
                    <button type="button" aria-label="Меньше мест" disabled={seats <= minSeats} onClick={() => setSeats((value) => Math.max(minSeats, value - 5))}>
                      −
                    </button>
                    <output aria-live="polite">{seats} чел.</output>
                    <button type="button" aria-label="Больше мест" disabled={seats >= maxSeats} onClick={() => setSeats((value) => Math.min(maxSeats, value + 5))}>
                      +
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <ul data-part="grid">
            {licenses.map((license) => {
              const price = priceFor(license)
              return (
                <li key={license.name} data-part="ticket" data-featured={license.featured ? "true" : undefined}>
                  <div data-part="stub">
                    {license.featured ? <span data-part="sticker">берут чаще</span> : null}
                    <h3>{license.name}</h3>
                    <p data-part="who">{license.who}</p>
                    <div data-part="amount">
                      <output key={price}>{formatMoney(price, currency)}</output>
                      <small>{license.seatsIncluded ? `${seats} мест · ×${license.factor}${seats > license.seatsIncluded ? " + доплата" : ""}` : `×${license.factor} от базовой`}</small>
                    </div>
                  </div>
                  <ul data-part="rules">
                    {license.rules.map((rule) => {
                      const sign = rule.trim().startsWith("−") || rule.trim().startsWith("-") ? "−" : "+"
                      return (
                        <li key={rule} data-sign={sign}>
                          <span>{rule.replace(/^[+−-]\s*/, "")}</span>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
