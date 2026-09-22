import type { CSSProperties } from "react"
import { Card048 } from "@/registry/components/card/card-048/card-048"

export type Testimonials035Quote = {
  quote: string
  who: string
  role?: string
}

export type Testimonials035Props = {
  eyebrow?: string
  title?: string
  /** Крупные цитаты-выноски, до трёх. */
  featured?: readonly Testimonials035Quote[]
  /** Короткие отзывы для бегущей строки. */
  items?: readonly Testimonials035Quote[]
  /** Секунд на полный проход ленты. */
  speed?: number
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Пресса и отзывы гаджета: сверху три цитаты-выноски крупным display-
// шрифтом с моно-подписью издания, ниже две бегущие строки карточек —
// верхняя влево, нижняя вправо, вся лента наклонена на пару градусов и
// выходит за края секции. Лента зациклена дублированием списка
// (дубль aria-hidden), при наведении останавливается. Только CSS.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-035"]){
--vibeui-testimonials-035-bg:light-dark(#ffffff,#0a0a0a);
--vibeui-testimonials-035-fg:light-dark(#111111,#f2ede4);
--vibeui-testimonials-035-accent:light-dark(#111111,#f2ede4);
--vibeui-testimonials-035-muted:color-mix(in oklab,var(--vibeui-testimonials-035-fg) 60%,var(--vibeui-testimonials-035-bg));
--vibeui-testimonials-035-line:color-mix(in oklab,var(--vibeui-testimonials-035-fg) 12%,transparent);
--vibeui-testimonials-035-card:color-mix(in oklab,var(--vibeui-testimonials-035-fg) 6%,var(--vibeui-testimonials-035-bg));
--vibeui-testimonials-035-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-035-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-035-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-035"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-035"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-035"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-035"]{box-sizing:border-box;padding:5rem 0 6rem;overflow:hidden;background:var(--vibeui-testimonials-035-bg);color:var(--vibeui-testimonials-035-fg);font-family:var(--vibeui-testimonials-035-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-035"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-035"] [data-part="card"]{width:20rem}
[data-vibeui-block="testimonials-035"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-035"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-testimonials-035-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-testimonials-035-accent)}
[data-vibeui-block="testimonials-035"] [data-part="title"]{margin:0 0 2.5rem;max-width:40rem;font-family:var(--vibeui-testimonials-035-display);font-weight:900;font-size:clamp(2rem,5.4cqi,4rem);line-height:1;letter-spacing:-.03em;text-wrap:balance}
[data-vibeui-block="testimonials-035"] [data-part="featured"]{display:grid;gap:1.5rem;margin:0 0 3.5rem;padding:0;list-style:none}
[data-vibeui-block="testimonials-035"] [data-part="pull"]{display:grid;gap:1rem;padding:0 0 0 1.2rem;border-left:2px solid var(--vibeui-testimonials-035-accent)}
[data-vibeui-block="testimonials-035"] [data-part="pull"] blockquote{margin:0;font-family:var(--vibeui-testimonials-035-display);font-weight:500;font-size:clamp(1.05rem,1.6cqi,1.35rem);line-height:1.3;letter-spacing:-.01em;text-wrap:balance}
[data-vibeui-block="testimonials-035"] [data-part="pull"] figcaption{font-family:var(--vibeui-testimonials-035-mono);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-testimonials-035-muted)}
[data-vibeui-block="testimonials-035"] [data-part="pull"] figcaption b{font-weight:500;color:var(--vibeui-testimonials-035-fg)}
[data-vibeui-block="testimonials-035"] [data-part="band"]{display:grid;gap:1rem;margin:0 -3rem;transform:rotate(-2deg)}
[data-vibeui-block="testimonials-035"] [data-part="row"]{display:flex;gap:1rem;width:max-content;animation:vibeui-testimonials-035-run var(--vibeui-testimonials-035-t) linear infinite}
[data-vibeui-block="testimonials-035"] [data-part="row"][data-dir="right"]{animation-direction:reverse}
[data-vibeui-block="testimonials-035"] [data-part="band"]:hover [data-part="row"]{animation-play-state:paused}
@keyframes vibeui-testimonials-035-run{to{transform:translateX(-50%)}}
@container (min-width: 56rem){[data-vibeui-block="testimonials-035"] [data-part="featured"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-035"] *{animation:none!important;transition:none!important}[data-vibeui-block="testimonials-035"] [data-part="band"]{transform:none;margin:0}[data-vibeui-block="testimonials-035"] [data-part="row"]{flex-wrap:wrap;width:auto}}`

const DEFAULT_FEATURED: Testimonials035Quote[] = [
  { quote: "Первый будильник, который хочется поставить на тумбочку, а не спрятать под подушку.", who: "Кинжал", role: "обзор, февраль 2026" },
  { quote: "Свет действительно похож на рассвет, а не на включённый холодильник. Через неделю я перестал слышать звонок — просыпался раньше.", who: "Rozetked", role: "тест 30 дней" },
  { quote: "Датчик CO₂ в лампе звучит как маркетинг, пока он не показывает 1 400 ppm в закрытой спальне.", who: "Хабр", role: "разбор железа" },
]

const DEFAULT_ITEMS: Testimonials035Quote[] = [
  { quote: "Сын шести лет встаёт сам. Сам. Без криков.", who: "Марина", role: "Казань · партия 1" },
  { quote: "Динамик громче, чем ожидал: птицы слышно из кухни.", who: "Артём", role: "Москва" },
  { quote: "Просил у первой версии холодный белый. Дали.", who: "Илья", role: "Екатеринбург · партия 1" },
  { quote: "Хлопок в ладоши гасит свет. Кошка научилась за день.", who: "Ольга", role: "Санкт-Петербург" },
  { quote: "Красиво даже выключенная. Стоит на столе как объект.", who: "Denis", role: "Новосибирск" },
  { quote: "Работает без облака. Роутер упал — будильник сработал.", who: "Сергей", role: "Тула" },
  { quote: "Влажность 28 % показала зимой. Купила увлажнитель — спать стало легче.", who: "Анна", role: "Пермь" },
  { quote: "Закат за 15 минут усыпляет лучше любого подкаста.", who: "Кирилл", role: "Калининград" },
]

/** Пресса и отзывы: три выноски и наклонная бегущая строка. */
export function Testimonials035({
  eyebrow = "Пресса и первые владельцы",
  title = "Что говорят те, кто уже проснулся",
  featured = DEFAULT_FEATURED,
  items = DEFAULT_ITEMS,
  speed = 46,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials035Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-035-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-035-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-035-bg": background } : null),
    "--vibeui-testimonials-035-t": `${speed}s`,
    ...style,
  } as CSSProperties

  const half = Math.ceil(items.length / 2)
  const rest = items.slice(half)
  const rows = [items.slice(0, half), rest.length > 0 ? rest : items.slice(0, half)]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-035" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-035" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {featured.length > 0 ? (
            <ul data-part="featured">
              {featured.map((item) => (
                <li key={item.who}>
                  <figure data-part="pull">
                    <blockquote>{item.quote}</blockquote>
                    <figcaption>
                      <b>{item.who}</b>
                      {item.role ? ` · ${item.role}` : null}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {items.length > 0 ? (
          <div data-part="band">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} data-part="row" data-dir={rowIndex % 2 ? "right" : "left"}>
                {[0, 1].map((copy) =>
                  row.map((item, index) => (
                    <Card048 key={`${copy}-${index}`} data-part="card" quote={item.quote} who={item.who} role={item.role} index={index} aria-hidden={copy === 1 ? "true" : undefined} accent={accent} />
                  )),
                )}
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </>
  )
}
