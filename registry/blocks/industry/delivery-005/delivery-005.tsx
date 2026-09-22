"use client"

import { useSyncExternalStore, type CSSProperties } from "react"
import { Card085 } from "@/registry/components/card/card-085/card-085"

export type Delivery005Review = {
  name: string
  /** Район или «заказывает 3-й раз». */
  meta?: string
  text: string
  /** Блюдо-тег в углу стикера. */
  dish?: string
  /** Стартовые реакции: эмодзи → число. */
  reactions?: Readonly<Record<string, number>>
}

export type Delivery005Props = {
  eyebrow?: string
  title?: string
  lede?: string
  reviews?: readonly Delivery005Review[]
  /** Эмодзи-реакции, доступные на каждом стикере. */
  emojis?: readonly string[]
  /** Сколько заказов в среднем за сутки: счётчик растёт от текущего времени. */
  ordersPerDay?: number
  ordersLabel?: string
  /** aria реакций. */
  reactionsLabel?: string
  reactionLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы «стикерами»: цветные карточки с наклоном и полоской скотча,
// в каждой имя, район, текст и тег блюда; снизу эмодзи-реакции — клик
// добавляет единицу и подбрасывает эмодзи. Над сеткой счётчик «заказов
// сегодня», который растёт от текущего времени суток (доля прошедших
// минут × дневная норма, с волной пиков на обед и ужин) и пересчитывается
// каждые 10 секунд через useSyncExternalStore; на сервере — прочерк.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Onest:wght@400;500;600;700&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="delivery-005"]){
--vibeui-delivery-005-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-delivery-005-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-005-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-delivery-005-on-accent:oklch(from var(--vibeui-delivery-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-005-on-fg:oklch(from var(--vibeui-delivery-005-fg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-delivery-005-muted:color-mix(in oklab,var(--vibeui-delivery-005-fg) 62%,var(--vibeui-delivery-005-bg));
--vibeui-delivery-005-line:color-mix(in oklab,var(--vibeui-delivery-005-fg) 14%,transparent);
--vibeui-delivery-005-paper:var(--vibeui-delivery-005-fg);
--vibeui-delivery-005-lemon:color-mix(in oklab,var(--vibeui-delivery-005-fg) 70%,#ffd400);
--vibeui-delivery-005-mint:color-mix(in oklab,var(--vibeui-delivery-005-fg) 72%,#38d39f);
--vibeui-delivery-005-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-005-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-delivery-005-hand:"Caveat",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="delivery-005"]{color-scheme:dark}
:where([data-vibeui-block="delivery-005"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="delivery-005"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="delivery-005"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-delivery-005-bg);color:var(--vibeui-delivery-005-fg);font-family:var(--vibeui-delivery-005-font);font-size:1rem;line-height:1.5;overflow:hidden}
[data-vibeui-block="delivery-005"] *{box-sizing:border-box}
[data-vibeui-block="delivery-005"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="delivery-005"] [data-part="head"]{display:grid;gap:1.5rem;align-items:end}
[data-vibeui-block="delivery-005"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-delivery-005-accent)}
[data-vibeui-block="delivery-005"] [data-part="title"]{margin:0;font-family:var(--vibeui-delivery-005-display);font-weight:900;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="delivery-005"] [data-part="lede"]{margin:.8rem 0 0;max-width:30rem;color:var(--vibeui-delivery-005-muted)}
[data-vibeui-block="delivery-005"] [data-part="counter"]{display:grid;gap:.2rem;padding:1.2rem 1.5rem;border-radius:1.4rem;border:1px solid var(--vibeui-delivery-005-line);background:color-mix(in oklab,var(--vibeui-delivery-005-fg) 6%,var(--vibeui-delivery-005-bg))}
[data-vibeui-block="delivery-005"] [data-part="counter"] span{font-size:.76rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-delivery-005-muted);display:flex;align-items:center;gap:.5rem}
[data-vibeui-block="delivery-005"] [data-part="counter"] span::before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:var(--vibeui-delivery-005-accent);box-shadow:0 0 0 0 var(--vibeui-delivery-005-accent);animation:vibeui-delivery-005-pulse 1.6s ease-out infinite}
[data-vibeui-block="delivery-005"] [data-part="counter"] b{font-family:var(--vibeui-delivery-005-display);font-weight:900;font-size:clamp(2.2rem,6cqi,3.4rem);line-height:1;letter-spacing:-.03em;color:var(--vibeui-delivery-005-accent);font-variant-numeric:tabular-nums;min-width:5ch}
[data-vibeui-block="delivery-005"] [data-part="grid"]{display:grid;gap:1.6rem 1.2rem;margin:3rem 0 0;padding:.5rem 0 0;list-style:none}
@keyframes vibeui-delivery-005-pulse{to{box-shadow:0 0 0 .5rem transparent}}
@keyframes vibeui-delivery-005-pop{40%{transform:translateY(-.5rem) scale(1.5) rotate(-12deg)}}
@container (min-width: 40rem){[data-vibeui-block="delivery-005"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 52rem){[data-vibeui-block="delivery-005"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}}
@container (min-width: 64rem){[data-vibeui-block="delivery-005"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="delivery-005"] *{animation:none!important;transition:none!important}}`

const DEFAULT_REVIEWS: Delivery005Review[] = [
  { name: "Катя", meta: "Бауманская · 14-й заказ", text: "Смэш приехал за 19 минут и был реально хрустящим. Соус «Горячо» — отдельная любовь, берите двойной.", dish: "смэш", reactions: { "🔥": 48, "😋": 31, "❤️": 22 } },
  { name: "Илья", meta: "Сокол", text: "Заказал том-ям в час ночи, курьер написал «поднимаюсь», а не позвонил. Ценю. Суп обжигает, как обещали.", dish: "том-ям", reactions: { "🔥": 27, "😋": 12, "❤️": 9 } },
  { name: "Марина", meta: "Ленинский · с ребёнком", text: "Конструктор боула — спасение: сыну без соуса, мне с острым майо, одна коробка, два счастья.", dish: "боул", reactions: { "❤️": 41, "😋": 18, "🔥": 7 } },
  { name: "Дима", meta: "Люблино", text: "Далеко, 50 минут — но привезли за 42 и ещё горячее. Крылья съели в подъезде, не дотерпели.", dish: "крылья", reactions: { "😋": 35, "🔥": 20, "❤️": 11 } },
  { name: "Аня и Саша", meta: "Тверская · пятница", text: "Трекер — лучшее, что случалось с ожиданием еды. Смотрели на скутер на карте, как на сериал.", dish: "пад-тай", reactions: { "❤️": 29, "🔥": 15, "😋": 14 } },
  { name: "Гоша", meta: "Кунцево · 3-й заказ", text: "Чизкейк с жжёным верхом — единственная причина, по которой я не ем десерты в других местах.", dish: "чизкейк", reactions: { "😋": 52, "❤️": 24, "🔥": 6 } },
]

const COLORS = ["paper", "lemon", "accent", "mint", "paper", "lemon"] as const

function subscribe(callback: () => void) {
  const timer = window.setInterval(callback, 10000)
  return () => window.clearInterval(timer)
}

function useOrdersToday(perDay: number): number | null {
  const tick = useSyncExternalStore(subscribe, () => Math.floor(Date.now() / 10000), () => null)
  if (tick === null) return null
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60
  // Волна пиков: обед ~13:30 и ужин ~20:00 добавляют к линейной доле дня.
  const lunch = Math.exp(-(((minutes - 810) / 90) ** 2))
  const dinner = Math.exp(-(((minutes - 1200) / 110) ** 2))
  const share = minutes / 1440 + (lunch * 0.08 + dinner * 0.11) * Math.min(1, minutes / 600)
  return Math.round(perDay * Math.min(1, share))
}

function formatNumber(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}


/** Отзывы-стикеры с эмодзи-реакциями и живым счётчиком заказов. */
export function Delivery005({
  eyebrow = "Отзывы",
  title = "Что пишут, пока жуют",
  lede = "Реакции настоящие — под каждым отзывом можно ткнуть в свою. Счётчик заказов растёт с самого утра.",
  reviews = DEFAULT_REVIEWS,
  emojis = ["🔥", "😋", "❤️"],
  ordersPerDay = 1840,
  ordersLabel = "заказов сегодня",
  reactionsLabel = "Реакции",
  reactionLabel = "Реакция {emoji}: {n}",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Delivery005Props) {
  const orders = useOrdersToday(ordersPerDay)

  const palette = {
    ...(accent ? { "--vibeui-delivery-005-accent": accent } : null),
    ...(ink ? { "--vibeui-delivery-005-fg": ink } : null),
    ...(background ? { "--vibeui-delivery-005-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-delivery-005" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="delivery-005" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <p data-part="counter">
              <span>{ordersLabel}</span>
              <b aria-live="off">{orders === null ? "—" : formatNumber(orders)}</b>
            </p>
          </div>
          <ul data-part="grid">
            {reviews.map((review, index) => (
              <Card085 key={review.name} data-part="sticker" {...review} reactionsLabel={reactionsLabel} emojis={emojis} reactionLabel={reactionLabel} index={index} data-color={COLORS[index % COLORS.length]} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
