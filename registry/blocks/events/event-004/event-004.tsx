import type { CSSProperties } from "react"

export type Event004Event = {
  /** «ср», «пт», «сб–вс». */
  day: string
  /** «каждую неделю», «3 октября». */
  when: string
  time?: string
  title: string
  text?: string
  /** «650 ₽ / 6 устриц», «вход свободный». */
  price?: string
  actionLabel?: string
  actionHref?: string
  image?: string
}

export type Event004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  events?: readonly Event004Event[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// События: лента строк, в каждой день недели крупным серифом слева, время
// и периодичность капителью, название, текст, цена и ссылка. По наведению
// строка подсвечивается и выезжает фото справа. Серверный, без состояния.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-004"]){
--vibeui-event-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-event-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-004-muted:light-dark(color-mix(in oklab,var(--vibeui-event-004-fg) 60%,var(--vibeui-event-004-bg)),color-mix(in oklab,var(--vibeui-event-004-fg) 58%,var(--vibeui-event-004-bg)));
--vibeui-event-004-line:color-mix(in oklab,var(--vibeui-event-004-fg) 16%,var(--vibeui-event-004-bg));
--vibeui-event-004-hover:light-dark(#efe7dc,#1d1917);
--vibeui-event-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-004-glow:0 0 24px color-mix(in oklab,var(--vibeui-event-004-accent) 70%,transparent),0 0 70px color-mix(in oklab,var(--vibeui-event-004-accent) 35%,transparent);
--vibeui-event-004-accent-ink:light-dark(var(--vibeui-event-004-accent),color-mix(in oklab,var(--vibeui-event-004-accent) 55%,var(--vibeui-event-004-fg)));
--vibeui-event-004-display:"Playfair Display",Georgia,"Times New Roman",serif;
--vibeui-event-004-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-004"]{color-scheme:dark}
:where([data-vibeui-block="event-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-004"]{box-sizing:border-box;display:block;background:var(--vibeui-event-004-bg);color:var(--vibeui-event-004-fg);font-family:var(--vibeui-event-004-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="event-004"] *{box-sizing:border-box}
[data-vibeui-block="event-004"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="event-004"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.72rem;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-event-004-accent-ink);font-weight:600}
[data-vibeui-block="event-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-004-display);font-weight:400;font-size:clamp(2.25rem,5cqi,3.5rem);line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="event-004"] [data-part="lede"]{margin:.75rem 0 0;max-width:32rem;color:var(--vibeui-event-004-muted)}
[data-vibeui-block="event-004"] [data-part="list"]{margin:2.5rem 0 0;padding:0;list-style:none;border-top:1px solid var(--vibeui-event-004-line)}
[data-vibeui-block="event-004"] [data-part="event"]{position:relative;display:grid;grid-template-columns:4.5rem minmax(0,1fr);gap:.5rem 1.25rem;padding:1.5rem 0;border-bottom:1px solid var(--vibeui-event-004-line)}
[data-vibeui-block="event-004"] [data-part="event"]::before{content:"";position:absolute;inset:0 -1rem;border-radius:.9rem;background:var(--vibeui-event-004-hover);opacity:0;transform:scale(.985);transition:opacity .45s ease,transform .6s cubic-bezier(.2,.8,.2,1);pointer-events:none}
[data-vibeui-block="event-004"] [data-part="event"]:hover::before{opacity:1;transform:none}
[data-vibeui-block="event-004"] [data-part="event"] > *{position:relative}
[data-vibeui-block="event-004"] [data-part="day"]{font-family:var(--vibeui-event-004-display);font-size:2.4rem;line-height:.9;color:var(--vibeui-event-004-accent-ink);text-transform:lowercase;text-shadow:0 0 22px rgb(125 42 58 / .45)}
[data-vibeui-block="event-004"] [data-part="when"]{display:block;margin-top:.35rem;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-event-004-muted)}
[data-vibeui-block="event-004"] [data-part="body"]{display:grid;gap:.35rem}
[data-vibeui-block="event-004"] [data-part="name"]{margin:0;font-family:var(--vibeui-event-004-display);font-size:1.5rem;font-weight:500;line-height:1.15}
[data-vibeui-block="event-004"] [data-part="time"]{font-size:.8rem;color:var(--vibeui-event-004-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="event-004"] [data-part="text"]{margin:0;color:var(--vibeui-event-004-muted);max-width:36rem}
[data-vibeui-block="event-004"] [data-part="foot"]{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 1.5rem;margin-top:.5rem}
[data-vibeui-block="event-004"] [data-part="price"]{font-family:var(--vibeui-event-004-display);font-size:1.1rem}
[data-vibeui-block="event-004"] [data-part="action"]{color:inherit;text-decoration:none;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600;border-bottom:1px solid var(--vibeui-event-004-accent);padding-bottom:.15rem}
[data-vibeui-block="event-004"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-event-004-accent);outline-offset:3px}
[data-vibeui-block="event-004"] [data-part="photo"]{display:none;width:11rem;aspect-ratio:3/2;object-fit:cover;border-radius:.6rem;align-self:center;opacity:0;transform:translateX(10px) scale(.96);transition:opacity .5s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="event-004"] [data-part="event"]:hover [data-part="photo"]{opacity:1;transform:none}
@container (min-width: 56rem){
[data-vibeui-block="event-004"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="event-004"] [data-part="event"]{grid-template-columns:8.5rem minmax(0,1fr) 11rem;gap:1rem 2rem;padding:1.75rem 0}
[data-vibeui-block="event-004"] [data-part="event"]::before{inset:0 -1.25rem}
[data-vibeui-block="event-004"] [data-part="day"]{font-size:2.6rem;white-space:nowrap}
[data-vibeui-block="event-004"] [data-part="photo"]{display:block}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-004"] *{transition:none!important}}`

const DEFAULT_EVENTS: Event004Event[] = [
  { day: "ср", when: "каждую неделю", time: "18:00–23:00", title: "Устричные среды", text: "Хасанские и дальневосточные устрицы по цене закупки, к ним — бокал мюскаде.", price: "650 ₽ / 6 шт.", actionLabel: "Занять стол", actionHref: "#book" },
  { day: "пт", when: "каждую неделю", time: "21:00", title: "Джаз у бара", text: "Трио Ильи Гордеева: стандарты и немного Северного модерна. Вход свободный, стол лучше держать заранее.", price: "вход свободный", actionLabel: "Забронировать", actionHref: "#book" },
  { day: "сб–вс", when: "выходные", time: "11:00–16:00", title: "Бранч", text: "Сырники на ржаной муке, яйца с сигом, пирог дня и кофе без ограничений.", price: "1 900 ₽", actionLabel: "Смотреть меню бранча", actionHref: "#menu" },
  { day: "3 окт", when: "один вечер", time: "19:30", title: "Ужин с виноделом", text: "Шесть подач под вина «Усадьбы Дивноморское», за столом — сам винодел.", price: "7 500 ₽", actionLabel: "Осталось 6 мест", actionHref: "#book" },
]

/** События ресторана: лента с днём недели серифом, временем, ценой и фото по наведению. */
export function Event004({
  eyebrow = "События",
  title = "Что бывает по вечерам",
  lede = "Устрицы, джаз и ужины с виноделами. Столы на события держим по брони.",
  events = DEFAULT_EVENTS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Event004Props) {
  const palette = {
    ...(accent ? { "--vibeui-event-004-accent": accent } : null),
    ...(ink ? { "--vibeui-event-004-fg": ink } : null),
    ...(background ? { "--vibeui-event-004-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <ul data-part="list">
            {events.map((event) => (
              <li key={event.title} data-part="event">
                <div>
                  <span data-part="day">{event.day}</span>
                  <span data-part="when">{event.when}</span>
                </div>
                <div data-part="body">
                  <h3 data-part="name">{event.title}</h3>
                  {event.time ? <span data-part="time">{event.time}</span> : null}
                  {event.text ? <p data-part="text">{event.text}</p> : null}
                  <div data-part="foot">
                    {event.price ? <span data-part="price">{event.price}</span> : null}
                    {event.actionLabel ? (
                      <a data-part="action" href={event.actionHref ?? "#"}>
                        {event.actionLabel} →
                      </a>
                    ) : null}
                  </div>
                </div>
                {event.image ? <img data-part="photo" src={event.image} alt="" loading="lazy" /> : <span />}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
