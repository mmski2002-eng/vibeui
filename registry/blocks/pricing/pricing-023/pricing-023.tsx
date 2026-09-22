"use client"

import { Fragment, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Button013 } from "@/registry/components/button/button-013/button-013"

import { Button016 } from "@/registry/components/button/button-016/button-016"

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
  /** Ярлык на выделенном уровне: «выбирают». Пусто — без ярлыка. */
  featuredLabel?: string
  tiers?: readonly Pricing023Tier[]
  /** Фон секции: фото студии, затемняется. Пусто — без фото. */
  image?: string
  /** aria переключателя периода. */
  periodLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Поддержать подкаст»: три уровня на фоне фото студии с затемнением,
// переключатель месяц/год с пометкой выгоды, у цен — цифры-табло, которые
// меняются с мягким сдвигом. Выделенный уровень («выбирают») приподнят,
// обведён акцентом и «дышит» — медленно пульсирует масштабом и свечением.
// Под курсором по карточкам ходит spotlight (`--x/--y`), кнопка «купить
// билет» магнитная. Заголовок въезжает словами через маски, карточки
// проявляются каскадом по IntersectionObserver.
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
--vibeui-pricing-023-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-023"]{color-scheme:dark}
:where([data-vibeui-block="pricing-023"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-023"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-023"]{box-sizing:border-box;position:relative;overflow:hidden;padding:6rem 0;background:var(--vibeui-pricing-023-bg);color:var(--vibeui-pricing-023-fg);font-family:var(--vibeui-pricing-023-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-023"] *{box-sizing:border-box}
[data-vibeui-block="pricing-023"] [data-part="action"]{margin-top:auto}
[data-vibeui-block="pricing-023"] [data-part="photo"]{position:absolute;inset:-6% 0;width:100%;height:112%;object-fit:cover;opacity:.35;filter:saturate(.6);animation:vibeui-pricing-023-zoom 1.6s var(--vibeui-pricing-023-ease) both paused}
[data-vibeui-block="pricing-023"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(180deg,var(--vibeui-pricing-023-bg),transparent 40%,transparent 60%,var(--vibeui-pricing-023-bg)),radial-gradient(60% 50% at 50% 60%,color-mix(in oklab,var(--vibeui-pricing-023-accent) 10%,transparent),transparent 70%)}
[data-vibeui-block="pricing-023"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="pricing-023"] [data-part="eyebrow"]{margin:0 0 .9rem;font-family:var(--vibeui-pricing-023-mono);font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-pricing-023-accent);animation:vibeui-pricing-023-up .7s var(--vibeui-pricing-023-ease) both paused}
[data-vibeui-block="pricing-023"] [data-part="title"]{margin:0;font-family:var(--vibeui-pricing-023-display);font-weight:800;font-size:clamp(3.6rem,10.5cqi,8.25rem);line-height:.88;letter-spacing:-.015em;text-transform:uppercase;text-wrap:balance}
[data-vibeui-block="pricing-023"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:top;padding:.04em .08em .12em 0;margin:-.04em 0 -.12em 0}
[data-vibeui-block="pricing-023"] [data-part="w"] i{display:inline-block;font-style:normal;animation:vibeui-pricing-023-word .9s var(--vibeui-pricing-023-ease) both paused;animation-delay:calc(var(--vibeui-pricing-023-i) * 80ms)}
[data-vibeui-block="pricing-023"] [data-part="lede"]{margin:1.2rem 0 0;max-width:34rem;color:var(--vibeui-pricing-023-muted);animation:vibeui-pricing-023-up .8s var(--vibeui-pricing-023-ease) .3s both paused}
[data-vibeui-block="pricing-023"] [data-part="grid"]{display:grid;gap:1rem;margin-top:2.5rem;align-items:end}
[data-vibeui-block="pricing-023"] [data-part="tier"]{position:relative;display:flex;flex-direction:column;gap:1rem;padding:1.6rem;border-radius:1.4rem;background:var(--vibeui-pricing-023-card);backdrop-filter:blur(14px);box-shadow:0 0 0 1px var(--vibeui-pricing-023-line),0 30px 60px -40px rgb(0 0 0 / .8);overflow:hidden;transition:transform .4s var(--vibeui-pricing-023-ease),box-shadow .4s;animation:vibeui-pricing-023-up .9s var(--vibeui-pricing-023-ease) both paused;animation-delay:calc(.45s + var(--vibeui-pricing-023-i) * 130ms)}
[data-vibeui-block="pricing-023"] [data-part="tier"]::before{content:"";position:absolute;inset:0;background:radial-gradient(22rem circle at var(--vibeui-pricing-023-x,50%) var(--vibeui-pricing-023-y,0%),color-mix(in oklab,var(--vibeui-pricing-023-accent) 16%,transparent),transparent 55%);opacity:0;transition:opacity .4s;pointer-events:none}
[data-vibeui-block="pricing-023"] [data-part="tier"]:hover::before{opacity:1}
[data-vibeui-block="pricing-023"] [data-part="tier"] > *{position:relative}
[data-vibeui-block="pricing-023"] [data-part="tier"][data-featured="true"]{box-shadow:0 0 0 2px var(--vibeui-pricing-023-accent),0 40px 80px -40px rgb(0 0 0 / .9),0 0 60px -20px color-mix(in oklab,var(--vibeui-pricing-023-accent) 50%,transparent)}
[data-vibeui-block="pricing-023"] [data-part="tier"]:hover{transform:translateY(-.4rem)}
[data-vibeui-block="pricing-023"] [data-part="badge"]{position:absolute;right:1.2rem;top:1.2rem;font-family:var(--vibeui-pricing-023-mono);font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-pricing-023-on-accent);background:var(--vibeui-pricing-023-accent);padding:.3rem .6rem;border-radius:999px}
[data-vibeui-block="pricing-023"] [data-part="tier"] h3{margin:0;font-family:var(--vibeui-pricing-023-display);font-weight:700;font-size:1.9rem;line-height:1;text-transform:uppercase}
[data-vibeui-block="pricing-023"] [data-part="tier"] p{margin:0;color:var(--vibeui-pricing-023-muted);font-size:.92rem}
[data-vibeui-block="pricing-023"] [data-part="price"]{display:flex;align-items:baseline;gap:.4rem;overflow:hidden}
[data-vibeui-block="pricing-023"] [data-part="price"] b{font-family:var(--vibeui-pricing-023-display);font-weight:800;font-size:3.4rem;line-height:1;letter-spacing:-.01em;font-variant-numeric:tabular-nums;animation:vibeui-pricing-023-flip .4s var(--vibeui-pricing-023-ease)}
[data-vibeui-block="pricing-023"] [data-part="price"] span{font-family:var(--vibeui-pricing-023-mono);font-size:.75rem;color:var(--vibeui-pricing-023-muted)}
[data-vibeui-block="pricing-023"] [data-part="perks"]{margin:0;padding:0;list-style:none;display:grid;gap:.45rem;font-size:.9rem}
[data-vibeui-block="pricing-023"] [data-part="perks"] li{display:flex;gap:.55rem;align-items:flex-start}
[data-vibeui-block="pricing-023"] [data-part="perks"] li::before{content:"";flex:none;width:.55rem;height:.55rem;margin-top:.45rem;border-radius:50%;background:var(--vibeui-pricing-023-accent);box-shadow:0 0 8px color-mix(in oklab,var(--vibeui-pricing-023-accent) 60%,transparent)}
[data-vibeui-block="pricing-023"] button:focus-visible,[data-vibeui-block="pricing-023"] a:focus-visible{outline:2px solid var(--vibeui-pricing-023-accent);outline-offset:3px}
@keyframes vibeui-pricing-023-flip{from{transform:translateY(60%);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-pricing-023-word{from{translate:0 110%;rotate:3deg}}
@keyframes vibeui-pricing-023-up{from{opacity:0;translate:0 1.6rem}}
@keyframes vibeui-pricing-023-zoom{from{scale:1.08;opacity:0}}
@keyframes vibeui-pricing-023-breathe{50%{scale:1.025}}
@keyframes vibeui-pricing-023-glow{50%{opacity:1}}
[data-vibeui-block="pricing-023"] [data-part="tier"][data-featured="true"]::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 70px -20px color-mix(in oklab,var(--vibeui-pricing-023-accent) 70%,transparent);opacity:.25;pointer-events:none}
[data-vibeui-block="pricing-023"][data-in="true"] [data-part="tier"][data-featured="true"]::after{animation:vibeui-pricing-023-glow 3.6s ease-in-out 1.6s infinite}
@container (min-width: 56rem){[data-vibeui-block="pricing-023"] [data-part="grid"]{grid-template-columns:repeat(3,1fr)}[data-vibeui-block="pricing-023"] [data-part="tier"][data-featured="true"]{transform:translateY(-1rem)}[data-vibeui-block="pricing-023"] [data-part="tier"][data-featured="true"]:hover{transform:translateY(-1.4rem)}}
[data-vibeui-block="pricing-023"][data-in="true"] [data-part="tier"][data-featured="true"]{animation:vibeui-pricing-023-up .9s var(--vibeui-pricing-023-ease) calc(.45s + var(--vibeui-pricing-023-i) * 130ms) both,vibeui-pricing-023-breathe 3.6s ease-in-out 1.6s infinite}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-023"] *,[data-vibeui-block="pricing-023"] *::before,[data-vibeui-block="pricing-023"] *::after{animation:none!important;transition:none!important}}
/* возвращено после разборки списков селекторов */
[data-vibeui-block="pricing-023"][data-in="true"] [data-part="photo"],[data-vibeui-block="pricing-023"][data-in="true"] [data-part="eyebrow"],[data-vibeui-block="pricing-023"][data-in="true"] [data-part="w"] i,[data-vibeui-block="pricing-023"][data-in="true"] [data-part="lede"],[data-vibeui-block="pricing-023"][data-in="true"] [data-part="switch"],[data-vibeui-block="pricing-023"][data-in="true"] [data-part="tier"]{animation-play-state:running}
`

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
  featuredLabel = "выбирают",
  tiers = DEFAULT_TIERS,
  image = "",
  periodLabel = "Период оплаты",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing023Props) {
  const [yearly, setYearly] = useState(false)
  const [shown, setShown] = useState(false)
  const root = useRef<HTMLElement>(null)
  const words = title.split(/\s+/).filter(Boolean)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const spot = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-pricing-023-x", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`)
    event.currentTarget.style.setProperty("--vibeui-pricing-023-y", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`)
  }
  const magnet = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "touch") return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)) * 6
    const dy = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)) * 5
    event.currentTarget.style.setProperty("--vibeui-pricing-023-mx", `${dx.toFixed(1)}px`)
    event.currentTarget.style.setProperty("--vibeui-pricing-023-my", `${dy.toFixed(1)}px`)
  }
  const unmagnet = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--vibeui-pricing-023-mx", "0px")
    event.currentTarget.style.setProperty("--vibeui-pricing-023-my", "0px")
  }
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
      <section ref={root} data-vibeui-block="pricing-023" data-tone={tone === "auto" ? undefined : tone} data-in={shown} className={className} style={palette}>
        {image ? <img data-part="photo" src={image} alt="" /> : null}
        <div data-part="shade" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {words.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <span data-part="w" style={{ ["--vibeui-pricing-023-i" as string]: i }}>
                  <i>{word}</i>
                </span>
                {i < words.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="switch" role="group" aria-label={periodLabel}>
            {/* Переключатель — button-013; блок держит только флаг. */}
            <Button013
              data-part="toggle"
              options={[monthlyLabel, yearlyLabel]}
              defaultValue={yearly ? yearlyLabel : monthlyLabel}
              label=""
              onChange={(value) => setYearly(value === yearlyLabel)}
              accent={accent}
            />
            {yearlyNote ? <small>{yearlyNote}</small> : null}
          </div>
          <div data-part="grid">
            {tiers.map((tier, index) => (
              <article key={tier.name} data-part="tier" data-featured={tier.featured ?? false} style={{ ["--vibeui-pricing-023-i" as string]: index }} onPointerMove={spot}>
                {tier.featured && featuredLabel ? <span data-part="badge">{featuredLabel}</span> : null}
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
                  <Button016
                    data-part="action"
                    size="lg"
                    onPointerMove={magnet}
                    onPointerLeave={unmagnet}
                    label={tier.action}
                    href={tier.href ?? "#"}
                    external={false}
                    tone="accent"
                    accent={accent}
                  />
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
