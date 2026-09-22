"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"
import { Button013 } from "@/registry/components/button/button-013/button-013"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Pricing024Feature = {
  label: string
  free: boolean | string
  premium: boolean | string
}

export type Pricing024Props = {
  eyebrow?: string
  title?: string
  lede?: string
  freeName?: string
  freePrice?: string
  premiumName?: string
  premiumMonthly?: string
  premiumYearly?: string
  monthlyLabel?: string
  yearlyLabel?: string
  yearlyNote?: string
  trial?: string
  features?: readonly Pricing024Feature[]
  freeAction?: string
  premiumAction?: string
  premiumHref?: string
  /** aria переключателя периода и заголовок колонки функций. */
  periodLabel?: string
  featureLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Тарифы приложения: две карточки — «Бесплатно» и «Премиум» с
// переключателем месяц/год (ползунок-таблетка едет, цена морфится
// посимвольно: сменившиеся знаки перекатываются с задержкой по индексу),
// плашкой «7 дней бесплатно» и общей таблицей функций под ними. Карточка
// премиума медленно «дышит» и светится цветной тенью, по обеим карточкам
// ходит spotlight под курсором (--x/--y). Заголовок, карточки и строки
// таблицы проявляются каскадом при попадании в окно.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="pricing-024"]){
--vibeui-pricing-024-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-pricing-024-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-024-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-pricing-024-on-accent:oklch(from var(--vibeui-pricing-024-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-024-muted:color-mix(in oklab,var(--vibeui-pricing-024-fg) 60%,var(--vibeui-pricing-024-bg));
--vibeui-pricing-024-line:color-mix(in oklab,var(--vibeui-pricing-024-fg) 12%,transparent);
--vibeui-pricing-024-panel:color-mix(in oklab,var(--vibeui-pricing-024-fg) 5%,var(--vibeui-pricing-024-bg));
--vibeui-pricing-024-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-pricing-024-bg) 85%,var(--vibeui-pricing-024-fg)));
--vibeui-pricing-024-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-pricing-024-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-024"]{color-scheme:dark}
:where([data-vibeui-block="pricing-024"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="pricing-024"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="pricing-024"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-pricing-024-panel);color:var(--vibeui-pricing-024-fg);font-family:var(--vibeui-pricing-024-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="pricing-024"] *{box-sizing:border-box}
[data-vibeui-block="pricing-024"] [data-part="action"]{margin-top:.6rem}
[data-vibeui-block="pricing-024"] [data-part="mesh"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="pricing-024"] [data-part="mesh"] i{position:absolute;border-radius:50%;filter:blur(50px);opacity:.45;animation:vibeui-pricing-024-float 22s ease-in-out infinite alternate}
[data-vibeui-block="pricing-024"] [data-part="mesh"] i:nth-child(1){left:50%;top:-10%;width:40%;aspect-ratio:1;transform:translateX(-50%);background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-pricing-024-accent) 30%,transparent),transparent 65%)}
[data-vibeui-block="pricing-024"] [data-part="mesh"] i:nth-child(2){right:-10%;bottom:0;width:35%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-pricing-024-accent) 18%,#ff9ad5),transparent 65%);animation-delay:-11s}
[data-vibeui-block="pricing-024"] [data-part="shell"]{position:relative;max-width:60rem;margin:0 auto;padding:0 1.25rem;text-align:center}
[data-vibeui-block="pricing-024"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-pricing-024-accent)}
[data-vibeui-block="pricing-024"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.2rem,5.6cqi,4rem);line-height:1.02;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="pricing-024"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em .12em 0;margin:-.06em 0 -.12em}
[data-vibeui-block="pricing-024"] [data-part="w"] span{display:inline-block;transition:transform 1s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--vibeui-pricing-024-i) * .06s)}
[data-vibeui-block="pricing-024"][data-motion="true"] [data-reveal]:not([data-in="true"]) [data-part="w"] span{transform:translateY(112%)}
[data-vibeui-block="pricing-024"] [data-part="lede"]{margin:1rem auto 0;max-width:30rem;color:var(--vibeui-pricing-024-muted)}
[data-vibeui-block="pricing-024"] [data-part="cards"]{display:grid;gap:1rem;margin-top:2rem;text-align:left}
[data-vibeui-block="pricing-024"] [data-part="card"]{position:relative;display:grid;gap:.6rem;padding:1.7rem;border-radius:1.5rem;background:var(--vibeui-pricing-024-card);box-shadow:0 0 0 1px var(--vibeui-pricing-024-line);transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s}
[data-vibeui-block="pricing-024"] [data-part="card"]::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(18rem circle at var(--vibeui-pricing-024-x,50%) var(--vibeui-pricing-024-y,50%),color-mix(in oklab,var(--vibeui-pricing-024-accent) 16%,transparent),transparent 60%);opacity:0;transition:opacity .4s;pointer-events:none}
[data-vibeui-block="pricing-024"] [data-part="card"]:hover::before{opacity:1}
[data-vibeui-block="pricing-024"] [data-part="card"]:hover{transform:translateY(-.3rem);box-shadow:0 0 0 1px var(--vibeui-pricing-024-line),0 30px 60px -40px color-mix(in oklab,var(--vibeui-pricing-024-accent) 60%,transparent)}
[data-vibeui-block="pricing-024"][data-motion="true"] [data-part="card"]:not([data-in="true"]){opacity:0}
[data-vibeui-block="pricing-024"] [data-part="card"][data-in="true"]{animation:vibeui-pricing-024-rise .9s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--vibeui-pricing-024-i) * .12s)}
[data-vibeui-block="pricing-024"] [data-part="card"][data-premium="true"]{background:var(--vibeui-pricing-024-fg);color:var(--vibeui-pricing-024-bg);box-shadow:0 0 0 1px transparent,0 40px 80px -30px color-mix(in oklab,var(--vibeui-pricing-024-accent) 70%,transparent);animation:vibeui-pricing-024-breath 5.5s ease-in-out infinite}
[data-vibeui-block="pricing-024"] [data-part="card"][data-premium="true"][data-in="true"]{animation:vibeui-pricing-024-rise .9s cubic-bezier(.2,.8,.2,1) .12s backwards,vibeui-pricing-024-breath 5.5s ease-in-out 1.1s infinite}
[data-vibeui-block="pricing-024"] [data-part="card"][data-premium="true"]::before{background:radial-gradient(18rem circle at var(--vibeui-pricing-024-x,50%) var(--vibeui-pricing-024-y,50%),color-mix(in oklab,var(--vibeui-pricing-024-accent) 35%,transparent),transparent 60%)}
[data-vibeui-block="pricing-024"] [data-part="card"] h3{margin:0;font-size:1.1rem;font-weight:700}
[data-vibeui-block="pricing-024"] [data-part="price"]{display:flex;align-items:baseline;gap:.4rem}
[data-vibeui-block="pricing-024"] [data-part="price"] b{display:inline-flex;font-family:var(--vibeui-pricing-024-mono);font-size:2.8rem;font-weight:500;letter-spacing:-.04em;line-height:1}
[data-vibeui-block="pricing-024"] [data-part="price"] b span{display:inline-block;overflow:hidden;padding-bottom:.08em;margin-bottom:-.08em}
[data-vibeui-block="pricing-024"] [data-part="price"] b span i{display:inline-block;font-style:normal;min-width:.28em;animation:vibeui-pricing-024-roll .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-pricing-024-i) * .05s)}
[data-vibeui-block="pricing-024"] [data-part="price"] span[data-part="unit"]{font-size:.85rem;opacity:.7;transition:opacity .3s}
[data-vibeui-block="pricing-024"] [data-part="trial"]{position:absolute;right:1.2rem;top:-.8rem;padding:.3rem .7rem;border-radius:999px;background:var(--vibeui-pricing-024-accent);color:var(--vibeui-pricing-024-on-accent);font-size:.72rem;font-weight:700;box-shadow:0 10px 20px -10px var(--vibeui-pricing-024-accent)}
[data-vibeui-block="pricing-024"] [data-part="table"]{margin-top:1.5rem;border-radius:1.2rem;overflow:hidden;box-shadow:0 0 0 1px var(--vibeui-pricing-024-line);background:var(--vibeui-pricing-024-card);text-align:left}
[data-vibeui-block="pricing-024"] [data-part="row"]{display:grid;grid-template-columns:1fr 5rem 5rem;align-items:center;gap:.5rem;padding:.8rem 1.2rem;border-top:1px solid var(--vibeui-pricing-024-line);font-size:.92rem;transition:background .3s}
[data-vibeui-block="pricing-024"] [data-part="row"]:not(:first-child):hover{background:color-mix(in oklab,var(--vibeui-pricing-024-accent) 6%,transparent)}
[data-vibeui-block="pricing-024"][data-motion="true"] [data-part="row"]:not([data-in="true"]){opacity:0}
[data-vibeui-block="pricing-024"] [data-part="row"][data-in="true"]{animation:vibeui-pricing-024-rise .7s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:calc(var(--vibeui-pricing-024-i) * .07s)}
[data-vibeui-block="pricing-024"] [data-part="row"]:first-child{border-top:0;font-family:var(--vibeui-pricing-024-mono);font-size:.68rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-pricing-024-muted)}
[data-vibeui-block="pricing-024"] [data-part="row"] span:not(:first-child){text-align:center}
[data-vibeui-block="pricing-024"] [data-part="yes"]{display:inline-grid;place-items:center;width:1.5rem;height:1.5rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-pricing-024-accent) 15%,transparent);color:var(--vibeui-pricing-024-accent);font-size:.8rem;font-weight:700}
[data-vibeui-block="pricing-024"] [data-part="no"]{color:var(--vibeui-pricing-024-line);font-size:1.1rem}
[data-vibeui-block="pricing-024"] button:focus-visible,[data-vibeui-block="pricing-024"] a:focus-visible{outline:2px solid var(--vibeui-pricing-024-accent);outline-offset:2px}
@keyframes vibeui-pricing-024-roll{from{transform:translateY(70%);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-pricing-024-rise{from{opacity:0;transform:translateY(1.6rem)}}
@keyframes vibeui-pricing-024-breath{0%,100%{transform:scale(1)}50%{transform:scale(1.018)}}
@keyframes vibeui-pricing-024-float{from{transform:translate(-50%,0)}to{transform:translate(-40%,12%)}}
@container (min-width: 44rem){[data-vibeui-block="pricing-024"] [data-part="cards"]{grid-template-columns:1fr 1fr}}
[data-vibeui-block="pricing-024"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-024"] *{animation:none!important;transition:none!important}[data-vibeui-block="pricing-024"] [data-part="card"],[data-vibeui-block="pricing-024"] [data-part="row"],[data-vibeui-block="pricing-024"] [data-part="w"] span{opacity:1!important;transform:none!important}}`

function Words({ text }: { text: string }) {
  return text.split(/\s+/).map((word, index) => (
    <span data-part="w" key={index} style={{ ["--vibeui-pricing-024-i" as string]: index }}>
      <span>{word}</span>
    </span>
  ))
}

function Price({ value }: { value: string }) {
  return (
    <b>
      {Array.from(value).map((char, index) => (
        <span key={index}>
          <i key={`${index}-${char}`} style={{ ["--vibeui-pricing-024-i" as string]: index }}>
            {char === " " ? " " : char}
          </i>
        </span>
      ))}
    </b>
  )
}

/** Тарифы приложения: бесплатно и премиум с переключателем и таблицей. */
export function Pricing024({
  eyebrow = "Тарифы",
  title = "Бесплатно хватает. Премиум — если хочется больше",
  lede = "Дыхание и будильник бесплатны навсегда. Премиум — анализ сна по фазам, серии и семейный доступ.",
  freeName = "Бесплатно",
  freePrice = "0 ₽",
  premiumName = "Премиум",
  premiumMonthly = "299 ₽",
  premiumYearly = "1 990 ₽",
  monthlyLabel = "в месяц",
  yearlyLabel = "в год",
  yearlyNote = "−45 %",
  trial = "7 дней бесплатно",
  features = [
    { label: "Дыхательные практики", free: true, premium: true },
    { label: "Умный будильник", free: true, premium: true },
    { label: "Сон по фазам", free: false, premium: true },
    { label: "Серии и напоминания", free: "7 дней", premium: "без лимита" },
    { label: "Семейный доступ", free: false, premium: "до 5" },
    { label: "Экспорт данных", free: false, premium: true },
  ],
  freeAction = "Скачать",
  premiumAction = "Попробовать 7 дней",
  premiumHref = "#",
  periodLabel = "Период оплаты",
  featureLabel = "функция",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Pricing024Props) {
  const root = useRef<HTMLElement>(null)
  const [yearly, setYearly] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    element.dataset.motion = "true"
    const targets = Array.from(element.querySelectorAll<HTMLElement>("[data-reveal]"))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).dataset.in = "true"
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  const spotlight = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-pricing-024-x", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`)
    event.currentTarget.style.setProperty("--vibeui-pricing-024-y", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`)
  }

  const palette = {
    ...(accent ? { "--vibeui-pricing-024-accent": accent } : null),
    ...(ink ? { "--vibeui-pricing-024-fg": ink } : null),
    ...(background ? { "--vibeui-pricing-024-bg": background } : null),
    ...style,
  } as CSSProperties
  const cell = (value: boolean | string) => (value === true ? <span data-part="yes">✓</span> : value === false ? <span data-part="no">—</span> : <span>{value}</span>)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-pricing-024" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="pricing-024" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="mesh" aria-hidden="true">
          <i />
          <i />
        </div>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title" data-reveal="">
            <Words text={title} />
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="switch" data-yearly={yearly} role="group" aria-label={periodLabel}>
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
          <div data-part="cards">
            <div data-part="card" data-reveal="" style={{ ["--vibeui-pricing-024-i" as string]: 0 }} onPointerMove={spotlight}>
              <h3>{freeName}</h3>
              <div data-part="price">
                <Price value={freePrice} />
              </div>
              <Button016
                data-part="action"
                size="lg"
                label={freeAction}
                href="#"
                external={false}
                tone="accent"
                accent={accent}
              />
            </div>
            <div data-part="card" data-premium="true" data-reveal="" style={{ ["--vibeui-pricing-024-i" as string]: 1 }} onPointerMove={spotlight}>
              {trial ? <span data-part="trial">{trial}</span> : null}
              <h3>{premiumName}</h3>
              <div data-part="price">
                <Price value={yearly ? premiumYearly : premiumMonthly} />
                <span data-part="unit">{yearly ? yearlyLabel : monthlyLabel}</span>
              </div>
              <Button016
                data-part="action"
                size="lg"
                label={premiumAction}
                href={premiumHref}
                external={false}
                tone="accent"
                accent={accent}
              />
            </div>
          </div>
          <div data-part="table">
            <div data-part="row" data-reveal="" style={{ ["--vibeui-pricing-024-i" as string]: 0 }}>
              <span>{featureLabel}</span>
              <span>{freeName}</span>
              <span>{premiumName}</span>
            </div>
            {features.map((feature, index) => (
              <div key={feature.label} data-part="row" data-reveal="" style={{ ["--vibeui-pricing-024-i" as string]: index + 1 }}>
                <span>{feature.label}</span>
                {cell(feature.free)}
                {cell(feature.premium)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
