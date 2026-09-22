import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Pricing012Props = {
  eyebrow?: string
  title?: string
  lede?: string
  days?: number
  daysLabel?: string
  steps?: { title: string; description: string }[]
  price?: string
  period?: string
  action?: { label: string; href: string }
  terms?: string
  accent?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

// Идея блока: гарантия возврата, изложенная как процедура, а не как штамп.
// Печать слева нарисована двумя коническими градиентами и обрезана маской —
// ни картинки, ни шрифтовой иконки. Справа три шага возврата с точными
// сроками: обещание «вернём деньги» стоит ровно столько, сколько понятно
// про сроки и способ. Условия выведены отдельным абзацем, а не сноской
// шестым кеглем: спрятанные условия читаются как подвох.
const STYLES = `
:where([data-vibeui-block="pricing-012"]){
--vibeui-pricing-012-bg:transparent;
--vibeui-pricing-012-fg:light-dark(oklch(0.19 0.014 55),oklch(0.95 0.006 55));
--vibeui-pricing-012-muted:light-dark(oklch(0.5 0.016 55),oklch(0.71 0.014 55));
--vibeui-pricing-012-card:light-dark(oklch(1 0 0),oklch(0.22 0.016 55));
--vibeui-pricing-012-line:light-dark(oklch(0.87 0.012 55),oklch(0.34 0.016 55));
--vibeui-pricing-012-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-pricing-012-accent-fg:oklch(from var(--vibeui-pricing-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-012-sealring:light-dark(oklch(1 0 0 / 55%),oklch(0 0 0 / 32%));
--vibeui-pricing-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-pricing-012-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-012"]{color-scheme:dark}
[data-vibeui-block="pricing-012"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-012-bg);color:var(--vibeui-pricing-012-fg);
font-family:var(--vibeui-pricing-012-sans);
}
[data-vibeui-block="pricing-012"] *{box-sizing:border-box}
[data-vibeui-block="pricing-012"] [data-part="shell"]{max-width:60rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="pricing-012"] [data-part="card"]{
display:grid;grid-template-columns:1fr;gap:1.75rem;padding:1.75rem;border-radius:1.25rem;
border:1px solid var(--vibeui-pricing-012-line);background:var(--vibeui-pricing-012-card);
}
[data-vibeui-block="pricing-012"] [data-part="seal"]{
position:relative;width:9rem;height:9rem;border-radius:9999px;display:flex;flex-direction:column;
align-items:center;justify-content:center;text-align:center;
background:conic-gradient(from 0deg,var(--vibeui-pricing-012-accent),color-mix(in oklab,var(--vibeui-pricing-012-accent) 55%,white),var(--vibeui-pricing-012-accent));
color:var(--vibeui-pricing-012-accent-fg);
}
[data-vibeui-block="pricing-012"] [data-part="seal"]::before{
content:"";position:absolute;inset:0.4375rem;border-radius:9999px;border:1px dashed var(--vibeui-pricing-012-sealring);
}
[data-vibeui-block="pricing-012"] [data-part="sealnum"]{position:relative;font-size:2.75rem;line-height:1;font-weight:700;letter-spacing:-0.05em;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-012"] [data-part="seallabel"]{position:relative;margin-top:0.25rem;font-size:0.75rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase}
[data-vibeui-block="pricing-012"] ol{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:1rem}
[data-vibeui-block="pricing-012"] li{display:flex;gap:0.75rem}
[data-vibeui-block="pricing-012"] [data-part="num"]{
flex:0 0 auto;width:1.625rem;height:1.625rem;border-radius:9999px;display:flex;align-items:center;justify-content:center;
background:color-mix(in oklab,var(--vibeui-pricing-012-accent) 14%,transparent);color:var(--vibeui-pricing-012-accent);
font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pricing-012"] h3{margin:0.125rem 0 0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="pricing-012"] li p{margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-pricing-012-muted)}
[data-vibeui-block="pricing-012"] [data-part="foot"]{
display:flex;flex-direction:column;gap:0.875rem;margin-top:1.75rem;padding-top:1.25rem;
border-top:1px solid var(--vibeui-pricing-012-line);
}
[data-vibeui-block="pricing-012"] [data-part="price"]{margin:0;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-012"] [data-part="period"]{font-size:0.8125rem;font-weight:500;color:var(--vibeui-pricing-012-muted)}
[data-vibeui-block="pricing-012"] [data-part="terms"]{margin:1.25rem 0 0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-pricing-012-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-012"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-012"] [data-part="card"]{padding:2.25rem}
[data-vibeui-block="pricing-012"] [data-part="foot"]{flex-direction:row;align-items:center;justify-content:space-between}
}
@container (min-width: 54rem){
[data-vibeui-block="pricing-012"] [data-part="card"]{grid-template-columns:auto minmax(0,1fr);gap:2.5rem;align-items:start;padding:2.75rem}
[data-vibeui-block="pricing-012"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = [
  {
    title: "Напишите одно письмо",
    description:
      "Достаточно строки «прошу вернуть оплату» с адреса, на который оформлена подписка. Причину указывать не нужно.",
  },
  {
    title: "Получите подтверждение за день",
    description:
      "Отвечаем в течение одного рабочего дня и сообщаем сумму к возврату.",
  },
  {
    title: "Деньги вернутся за 5–10 дней",
    description:
      "Возврат идёт тем же способом, которым была оплата. Срок зависит от банка, а не от нас.",
  },
]

/** Блок гарантии возврата: печать слева, три шага процедуры и точные сроки справа. */
export function Pricing012({
  eyebrow = "Гарантия",
  title = "Не подошло — вернём деньги без разговоров",
  lede = "Гарантия работает как процедура, а не как обещание: ниже написано, что и в какие сроки происходит после вашего письма.",
  days = 30,
  daysLabel = "дней на возврат",
  steps = DEFAULT_STEPS,
  price = "1 490 ₽",
  period = "в месяц",
  action = { label: "Оформить подписку", href: "#" },
  terms = "Гарантия действует на первую оплату каждого тарифа. Возврат по годовой подписке считается пропорционально неиспользованным месяцам.",
  accent,
  background = "",
  className,
  style,
}: Pricing012Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-012"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <div data-part="seal" aria-hidden="true">
              <span data-part="sealnum">{days}</span>
              <span data-part="seallabel">{daysLabel}</span>
            </div>

            <div>
              <Heading001
                data-part="heading"
                eyebrow={eyebrow}
                title={title}
                lede={lede}
                size="sm"
                accent={accent}
              />

              <ol>
                {steps.slice(0, 4).map((step, index) => (
                  <li key={step.title}>
                    <span data-part="num" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div data-part="foot">
                <p data-part="price">
                  {price} <span data-part="period">{period}</span>
                </p>
                <Button016 label={action.label} href={action.href} external={false} size="lg" tone="accent" accent={accent} />
              </div>

              {terms ? <p data-part="terms">{terms}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
