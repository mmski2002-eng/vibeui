"use client"

import { useState, type CSSProperties } from "react"

export type Pricing023Tier = {
  name: string
  /** Цена в месяц и в год. */
  monthly: string
  yearly: string
  text?: string
  perks: readonly string[]
  action?: string
  href?: string
  featured?: boolean
}

export type Pricing023Props = {
  eyebrow?: string
  title?: string
  lede?: string
  monthlyLabel?: string
  yearlyLabel?: string
  yearlyNote?: string
  perLabel?: string
  tiers?: readonly Pricing023Tier[]
  /** Фон секции: фото студии, затемняется. Пусто — без фото. */
  image?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Поддержать подкаст»: три уровня на фоне фото студии с затемнением,
// переключатель месяц/год с пометкой выгоды, у цен — цифры-табло, которые
// меняются с мягким сдвигом. Выделенный уровень чуть приподнят и обведён
// акцентом; кнопки — как «купить билет».
const FONTS =
  "https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-023"]){
--vibeui-pricing-023-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-023-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-023-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-023-on-accent:oklch(from var(--vibeui-pricing-023-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-023-muted:color-mix(in oklab,var(--vibeui-pricing-023-fg) 60%,var(--vibeui-pricing-023-bg));
--vibeui-pricing-023-card:color-mix(in oklab,var(--vibeui-pricing-023-bg) 78%,transparent);
--vibeui-pricing-023-line:color-mix(in oklab,var(--vibeui-pricing-023-fg) 14%,transparent);
--vibeui-pricing-023-display:"Sofia Sans Extra Condensed",Impact,"Arial Narrow",sans-serif;
--vibeui-pricing-023-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-023-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-023"]{color-scheme:dark}
:where([data-vibeui-block="pricing-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-023"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-pricing-023-bg);color:var(--vibeui-pricing-023-fg);font-family:var(--vibeui-pricing-023-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-023"] *{box-sizing:border-box}
[data-vibeui-block="pricing-023"] [data-part="photo"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35;filter:saturate(.6)}
[data-vibeui-block="pricing-023"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(180deg,var(--vibeui-pricing-023-bg),transparent 40%,transparent 60%,var(--vibeui-pricing-023-bg))}
[data-vibeui-block="pricing-023"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="pricing-023"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-pricing-023-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-pricing-023-accent)}
[data-vibeui-block="pricing-023"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-023-display);font-weight:800;font-size:clamp(2.6rem,7cqi,5.5rem);line-height:.92;text-transform:uppercase}
[data-vibeui-block="pricing-023"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-pricing-023-muted)}
[data-vibeui-block="pricing-023"] [data-part="switch"]{display:inline-flex;align-items:center;gap:.25rem;margin-top:2rem;padding:.3rem;border-radius:999px;background:var(--vibeui-pricing-023-card);box-shadow:0 0 0 1px var(--vibeui-pricing-023-line);backdrop-filter:blur(10px)}
[data-vibeui-block="pricing-023"] [data-part="switch"] button{border:0;border-radius:999px;padding:.55rem 1rem;font:inherit;font-weight:500;font-size:.9rem;background:none;color:inherit;cursor:pointer;transition:background .2s,color .2s}
[data-vibeui-block="pricing-023"] [data-part="switch"] button[aria-pressed="true"]{background:var(--vibeui-pricing-023-accent);color:var(--vibeui-pricing-023-on-accent)}
[data-vibeui-block="pricing-023"] [data-part="switch"] small{font-family:var(--vibeui-pricing-023-mono);font-size:.68rem;color:var(--vibeui-pricing-023-accent);padding:0 .6rem 0 .2rem}
[data-vibeui-block="pricing-023"] [data-part="grid"]{display:grid;gap:1rem;margin-top:2rem;align-items:end}
[data-vibeui-block="pricing-023"] [data-part="tier"]{display:flex;flex-direction:column;gap:1rem;padding:1.6rem;border-radius:1.4rem;background:var(--vibeui-pricing-023-card);backdrop-filter:blur(14px);box-shadow:0 0 0 1px var(--vibeui-pricing-023-line),0 30px 60px -40px rgb(0 0 0 / .8);transition:transform .3s}
[data-vibeui-block="pricing-023"] [data-part="tier"][data-featured="true"]{box-shadow:0 0 0 2px var(--vibeui-pricing-023-accent),0 40px 80px -40px rgb(0 0 0 / .9)}
[data-vibeui-block="pricing-023"] [data-part="tier"]:hover{transform:translateY(-.3rem)}
[data-vibeui-block="pricing-023"] [data-part="tier"] h3{margin:0;font-family:var(--vibeui-pricing-023-display);font-weight:700;font-size:1.8rem;line-height:1;text-transform:uppercase}
[data-vibeui-block="pricing-023"] [data-part="tier"] p{margin:0;color:var(--vibeui-pricing-023-muted);font-size:.92rem}
[data-vibeui-block="pricing-023"] [data-part="price"]{display:flex;align-items:baseline;gap:.4rem;overflow:hidden}
[data-vibeui-block="pricing-023"] [data-part="price"] b{font-family:var(--vibeui-pricing-023-display);font-weight:800;font-size:3rem;line-height:1;letter-spacing:-.01em;font-variant-numeric:tabular-nums;animation:vibeui-pricing-023-flip .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="pricing-023"] [data-part="price"] span{font-family:var(--vibeui-pricing-023-mono);font-size:.75rem;color:var(--vibeui-pricing-023-muted)}
[data-vibeui-block="pricing-023"] [data-part="perks"]{margin:0;padding:0;list-style:none;display:grid;gap:.45rem;font-size:.9rem}
[data-vibeui-block="pricing-023"] [data-part="perks"] li{display:flex;gap:.55rem;align-items:flex-start}
[data-vibeui-block="pricing-023"] [data-part="perks"] li::before{content:"";flex:none;width:.55rem;height:.55rem;margin-top:.45rem;border-radius:50%;background:var(--vibeui-pricing-023-accent)}
[data-vibeui-block="pricing-023"] [data-part="action"]{margin-top:auto;display:inline-flex;justify-content:center;align-items:center;border-radius:999px;padding:.9rem 1.4rem;font-weight:600;text-decoration:none;color:inherit;box-shadow:0 0 0 1px var(--vibeui-pricing-023-line) inset;transition:background .2s,color .2s,transform .18s}
[data-vibeui-block="pricing-023"] [data-part="tier"][data-featured="true"] [data-part="action"],[data-vibeui-block="pricing-023"] [data-part="action"]:hover{background:var(--vibeui-pricing-023-accent);color:var(--vibeui-pricing-023-on-accent);box-shadow:none}
[data-vibeui-block="pricing-023"] [data-part="action"]:active{transform:scale(.98)}
[data-vibeui-block="pricing-023"] button:focus-visible,[data-vibeui-block="pricing-023"] a:focus-visible{outline:2px solid var(--vibeui-pricing-023-accent);outline-offset:3px}
@keyframes vibeui-pricing-023-flip{from{transform:translateY(60%);opacity:0}to{transform:none;opacity:1}}
@container (min-width: 56rem){[data-vibeui-block="pricing-023"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}[data-vibeui-block="pricing-023"] [data-part="tier"][data-featured="true"]{transform:translateY(-1rem)}[data-vibeui-block="pricing-023"] [data-part="tier"][data-featured="true"]:hover{transform:translateY(-1.3rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-023"] *{animation:none!important;transition:none!important}}`

const DEFAULT_TIERS: Pricing023Tier[] = [
  { name: "Слушатель", monthly: "0 ₽", yearly: "0 ₽", text: "Всё, что выходит в эфир.", perks: ["новый эпизод каждый четверг", "письмо после выпуска", "чат слушателей"], action: "Так и оставить", href: "#" },
  { name: "Друг студии", monthly: "290 ₽", yearly: "2 900 ₽", text: "Больше разговора, чем влезло в эфир.", perks: ["эпизоды на день раньше", "полные версии без монтажа", "голосование за гостей", "ваше имя в титрах раз в сезон"], action: "Стать другом", href: "#", featured: true },
  { name: "Соведущий", monthly: "1 200 ₽", yearly: "12 000 ₽", text: "Для тех, кто хочет в студию.", perks: ["всё из «Друга студии»", "созвон с ведущей раз в квартал", "приглашение на живую запись", "плёнка с автографом гостя"], action: "Зайти в студию", href: "#" },
]

/** Уровни поддержки с переключателем месяц/год на фоне студии. */
export function Pricing023({
  eyebrow = "Поддержать",
  title = "Эфир держится на слушателях",
  lede = "Ни рекламы, ни спонсоров: каждый эпизод оплачивают те, кто его ждёт. Выберите, насколько вы с нами.",
  monthlyLabel = "в месяц",
  yearlyLabel = "в год",
  yearlyNote = "−2 месяца",
  perLabel = "/ мес",
  tiers = DEFAULT_TIERS,
  image = "",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing023Props) {
  const [yearly, setYearly] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-pricing-023-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-023-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-023-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-023" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="pricing-023" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {image ? <img data-part="photo" src={image} alt="" /> : null}
        <div data-part="shade" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="switch" role="group" aria-label="Период оплаты">
            <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>
              {monthlyLabel}
            </button>
            <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>
              {yearlyLabel}
            </button>
            {yearlyNote ? <small>{yearlyNote}</small> : null}
          </div>
          <div data-part="grid">
            {tiers.map((tier) => (
              <article key={tier.name} data-part="tier" data-featured={tier.featured ?? false}>
                <h3>{tier.name}</h3>
                {tier.text ? <p>{tier.text}</p> : null}
                <div data-part="price">
                  <b key={yearly ? "y" : "m"}>{yearly ? tier.yearly : tier.monthly}</b>
                  <span>{yearly ? `/ ${yearlyLabel.replace(/^в /, "")}` : perLabel}</span>
                </div>
                <ul data-part="perks">
                  {tier.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                {tier.action ? (
                  <a data-part="action" href={tier.href ?? "#"}>
                    {tier.action}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
