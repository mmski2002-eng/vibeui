import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

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
  /** Подпись рядом с числом дней. */
  daysLabel?: string
  /** Строка под счётчиком. {price} выделяется жирным, {period} — обычный текст. */
  afterText?: string
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

// Идея блока: продаётся не тариф, а спокойствие первых двух недель. Вместо
// списка возможностей — лента событий пробного периода: что произойдёт
// сегодня, за три дня до конца и в день списания. Главный страх пробного
// периода — «забуду отменить и спишут», и секция отвечает на него прямо в
// ленте, а не в мелком шрифте внизу. Лента — <ol>: порядок дней важен и
// должен читаться голосом, а не только цветными точками.
const STYLES = `
:where([data-vibeui-block="pricing-010"]){
--vibeui-pricing-010-bg:transparent;
--vibeui-pricing-010-fg:light-dark(oklch(0.19 0.016 145),oklch(0.95 0.006 145));
--vibeui-pricing-010-muted:light-dark(oklch(0.5 0.016 145),oklch(0.71 0.014 145));
--vibeui-pricing-010-card:light-dark(oklch(1 0 0),oklch(0.22 0.016 145));
--vibeui-pricing-010-line:light-dark(oklch(0.88 0.01 145),oklch(0.34 0.016 145));
--vibeui-pricing-010-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-pricing-010-accent-fg:oklch(from var(--vibeui-pricing-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pricing-010-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-pricing-010-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-010"]{color-scheme:dark}
[data-vibeui-block="pricing-010"] [data-part="cta-button"]{margin-top:1.5rem;}
[data-vibeui-block="pricing-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-010-bg);color:var(--vibeui-pricing-010-fg);
font-family:var(--vibeui-pricing-010-sans);
}
[data-vibeui-block="pricing-010"] *{box-sizing:border-box}
[data-vibeui-block="pricing-010"] [data-part="reassure"]{margin:1.25rem 0 0;display:grid}
[data-vibeui-block="pricing-010"] [data-part="shell"]{
max-width:62rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:1fr;gap:2rem;
}
[data-vibeui-block="pricing-010"] [data-part="days"]{
display:inline-flex;align-items:baseline;gap:0.5rem;margin:1.5rem 0 0;padding:0.75rem 1.125rem;border-radius:0.875rem;
background:var(--vibeui-pricing-010-accent);color:oklch(from var(--vibeui-pricing-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="pricing-010"] [data-part="daysnum"]{font-size:2rem;font-weight:700;letter-spacing:-0.04em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="pricing-010"] [data-part="dayslabel"]{font-size:0.875rem;font-weight:600}
[data-vibeui-block="pricing-010"] [data-part="after"]{margin:1rem 0 0;font-size:0.875rem;color:var(--vibeui-pricing-010-muted)}
[data-vibeui-block="pricing-010"] [data-part="after"] b{color:var(--vibeui-pricing-010-fg);font-variant-numeric:tabular-nums}
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
  daysLabel = "дней бесплатно",
  afterText = "Дальше — {price} {period}, если решите остаться.",
  accent,
  background = "",
  className,
  style,
}: Pricing010Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  // Цена внутри строки остаётся в <b>, поэтому шаблон режется по {price},
  // а не подставляется целиком.
  const [beforePrice, afterPrice = ""] = afterText.split("{price}")

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
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              lede={lede}
              accent={accent}
            />

            <p data-part="days">
              <span data-part="daysnum">{trialDays}</span>
              <span data-part="dayslabel">{daysLabel}</span>
            </p>

            <p data-part="after">
              {beforePrice}
              <b>{price}</b>
              {afterPrice.replace("{period}", period)}
            </p>

            <Button016 data-part="cta-button" label={action.label} href={action.href} external={false} size="lg" tone="accent" accent={accent} />

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
