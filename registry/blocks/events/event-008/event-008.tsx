import type { CSSProperties } from "react"

export type Event008Step = {
  time: string
  title: string
  text?: string
  place?: string
  /** Иконка: glass | rings | dinner | music | sparkles | cake | bus | camera. */
  icon?: string
}

export type Event008Props = {
  eyebrow?: string
  title?: string
  lede?: string
  steps?: readonly Event008Step[]
  /** Индекс подсвеченного шага: «сейчас». -1 — без подсветки. */
  current?: number
  /** Подпись в правой колонке: «что взять». */
  asideTitle?: string
  asideItems?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Программа дня вертикальной лентой: слева время serif'ом, по центру линия
// с кружком-иконкой, справа название, место и пара слов. Подсвеченный шаг
// («сейчас») получает терракотовый кружок и заливку. Справа — карточка
// «что взять с собой». Серверный, без состояния.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="event-008"]){
--vibeui-event-008-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-event-008-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-008-muted:light-dark(#7a6a70,#a3a3a3);
--vibeui-event-008-line:light-dark(#e2d8ca,#2e2e2e);
--vibeui-event-008-card:light-dark(#fffaf3,#242424);
--vibeui-event-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-event-008-plum:var(--vibeui-event-008-fg);
--vibeui-event-008-sage:#8a9a7b;
--vibeui-event-008-on-accent:oklch(from var(--vibeui-event-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-event-008-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-event-008-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="event-008"]{color-scheme:dark}
:where([data-vibeui-block="event-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="event-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="event-008"]{box-sizing:border-box;display:block;background:var(--vibeui-event-008-bg);color:var(--vibeui-event-008-fg);font-family:var(--vibeui-event-008-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="event-008"] *{box-sizing:border-box}
[data-vibeui-block="event-008"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="event-008"] [data-part="eyebrow"]{margin:0 0 .6rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-event-008-accent)}
[data-vibeui-block="event-008"] [data-part="title"]{margin:0;font-family:var(--vibeui-event-008-display);font-size:clamp(2rem,5cqi,3.6rem);font-weight:500;font-style:italic;line-height:1.05;color:var(--vibeui-event-008-plum);text-wrap:balance}
[data-vibeui-block="event-008"] [data-part="lede"]{max-width:36rem;margin:.8rem 0 0;color:var(--vibeui-event-008-muted)}
[data-vibeui-block="event-008"] [data-part="grid"]{display:grid;gap:2.5rem;margin-top:2.5rem}
[data-vibeui-block="event-008"] [data-part="steps"]{position:relative;margin:0;padding:0;list-style:none}
[data-vibeui-block="event-008"] [data-part="steps"]::before{content:"";position:absolute;top:1.2rem;bottom:1.2rem;left:5.15rem;width:1px;background:linear-gradient(180deg,var(--vibeui-event-008-accent),var(--vibeui-event-008-line) 30%,var(--vibeui-event-008-line) 70%,var(--vibeui-event-008-accent))}
[data-vibeui-block="event-008"] [data-part="step"]{position:relative;display:grid;grid-template-columns:3.6rem 3rem minmax(0,1fr);align-items:start;gap:.5rem 0;padding:1rem 0}
[data-vibeui-block="event-008"] [data-part="time"]{padding-top:.35rem;font-family:var(--vibeui-event-008-display);font-size:1.45rem;font-weight:500;line-height:1;color:var(--vibeui-event-008-plum);font-variant-numeric:tabular-nums}
[data-vibeui-block="event-008"] [data-part="dot"]{display:grid;place-items:center;width:2.4rem;height:2.4rem;margin-left:.3rem;border:1px solid var(--vibeui-event-008-line);border-radius:50%;background:var(--vibeui-event-008-card);color:var(--vibeui-event-008-plum);transition:transform .3s cubic-bezier(.2,.9,.3,1.4),background .3s,color .3s}
[data-vibeui-block="event-008"] [data-part="dot"] svg{width:1.1rem;height:1.1rem;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="event-008"] [data-part="step"]:hover [data-part="dot"]{transform:scale(1.1);border-color:var(--vibeui-event-008-accent);color:var(--vibeui-event-008-accent)}
[data-vibeui-block="event-008"] [data-part="step"][data-current="true"] [data-part="dot"]{background:var(--vibeui-event-008-accent);border-color:var(--vibeui-event-008-accent);color:var(--vibeui-event-008-on-accent);box-shadow:0 0 0 .4rem color-mix(in oklab,var(--vibeui-event-008-accent) 18%,transparent)}
[data-vibeui-block="event-008"] [data-part="body"]{padding:.15rem 0 0 .6rem}
[data-vibeui-block="event-008"] [data-part="step"][data-current="true"] [data-part="body"]{border-radius:.9rem;background:color-mix(in oklab,var(--vibeui-event-008-accent) 8%,transparent);padding:.75rem .9rem;margin-left:.2rem}
[data-vibeui-block="event-008"] [data-part="name"]{margin:0;font-family:var(--vibeui-event-008-display);font-size:1.5rem;font-weight:500;line-height:1.15}
[data-vibeui-block="event-008"] [data-part="place"]{display:inline-flex;align-items:center;gap:.35rem;margin-top:.2rem;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-event-008-sage)}
[data-vibeui-block="event-008"] [data-part="text"]{margin:.35rem 0 0;font-size:.95rem;color:var(--vibeui-event-008-muted)}
[data-vibeui-block="event-008"] [data-part="aside"]{align-self:start;padding:1.5rem;border:1px solid var(--vibeui-event-008-line);border-radius:1.2rem 1.2rem 3rem 1.2rem;background:var(--vibeui-event-008-card)}
[data-vibeui-block="event-008"] [data-part="aside"] h3{margin:0 0 .8rem;font-family:var(--vibeui-event-008-display);font-size:1.4rem;font-weight:500;font-style:italic;color:var(--vibeui-event-008-plum)}
[data-vibeui-block="event-008"] [data-part="aside"] ul{margin:0;padding:0;list-style:none;display:grid;gap:.5rem}
[data-vibeui-block="event-008"] [data-part="aside"] li{display:flex;gap:.6rem;font-size:.95rem}
[data-vibeui-block="event-008"] [data-part="aside"] li::before{content:"";flex:none;width:.45rem;height:.45rem;margin-top:.55rem;border-radius:50%;background:var(--vibeui-event-008-accent)}
@container (min-width:56rem){
[data-vibeui-block="event-008"] [data-part="shell"]{padding:5rem 2.5rem}
[data-vibeui-block="event-008"] [data-part="grid"]{grid-template-columns:minmax(0,1.5fr) minmax(16rem,.7fr);gap:4rem}
[data-vibeui-block="event-008"] [data-part="aside"]{position:sticky;top:5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="event-008"] *{animation:none!important;transition:none!important}}`

const ICONS: Record<string, string> = {
  glass: "M8 3h8l-1 7a3 3 0 0 1-6 0zM12 13v7M8 20h8",
  rings: "M9 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM15 19a5 5 0 1 1 0-10 5 5 0 0 1 0 10z",
  dinner: "M4 4v7a2 2 0 0 0 2 2v7M6 4v5M8 4v5M8 4v7a2 2 0 0 1-2 2M17 4c-2 1-3 4-3 7h3v9",
  music: "M9 18a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM20 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM9 18V6l11-2v12",
  sparkles: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM5 18l.7 1.8L7.5 20.5l-1.8.7L5 23l-.7-1.8-1.8-.7 1.8-.7z",
  cake: "M4 20h16M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 15c1.5 1.5 3 1.5 4.5 0s3 1.5 4.5 0 3 1.5 4.5 0M12 8V6M12 6a1.5 1.5 0 1 0-.01 0",
  bus: "M5 4h14a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM4 10h16M7 18v2M17 18v2M8 14h.01M16 14h.01",
  camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
}

/** Программа свадебного дня вертикальной лентой с временем, иконками и подсветкой текущего шага; сбоку «что взять». */
export function Event008({
  eyebrow = "Программа дня",
  title = "Как пройдёт 5 сентября",
  lede = "Один день, одно место, никаких переездов. Приезжайте к трём — и оставайтесь до огней.",
  steps = [
    { time: "15:00", title: "Сбор гостей", place: "терраса", text: "Лимонад, домашний квас и первые объятия. Успеете найти свою карточку с местом.", icon: "glass" },
    { time: "16:00", title: "Церемония", place: "павильон в саду", text: "Двадцать минут в тени лип. Телефоны можно не убирать — но лучше смотреть глазами.", icon: "rings" },
    { time: "17:00", title: "Ужин", place: "длинный стол на террасе", text: "Семейные блюда на общих тарелках, тосты по желанию, никакого тамады.", icon: "dinner" },
    { time: "20:00", title: "Танцы", place: "лужайка", text: "Первый танец — наш, дальше — по вашим заявкам из анкеты.", icon: "music" },
    { time: "23:00", title: "Огни", place: "у пруда", text: "Бенгальские огни на прощание. Трансфер до города — в 23:30.", icon: "sparkles" },
  ],
  current = -1,
  asideTitle = "Что взять с собой",
  asideItems = ["Тёплую кофту — вечером у пруда прохладно", "Удобную обувь: лужайка и гравий", "Хорошее настроение и ту самую песню"],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Event008Props) {
  const palette = {
    ...(accent ? { "--vibeui-event-008-accent": accent } : null),
    ...(ink ? { "--vibeui-event-008-fg": ink } : null),
    ...(background ? { "--vibeui-event-008-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-event-008" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="event-008" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <ol data-part="steps">
              {steps.map((step, index) => (
                <li key={step.time + step.title} data-part="step" data-current={index === current ? "true" : undefined} aria-current={index === current ? "step" : undefined}>
                  <span data-part="time">{step.time}</span>
                  <span data-part="dot" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d={ICONS[step.icon ?? ""] ?? ICONS.sparkles} />
                    </svg>
                  </span>
                  <div data-part="body">
                    <h3 data-part="name">{step.title}</h3>
                    {step.place ? <span data-part="place">{step.place}</span> : null}
                    {step.text ? <p data-part="text">{step.text}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
            {asideItems.length > 0 ? (
              <aside data-part="aside">
                <h3>{asideTitle}</h3>
                <ul>
                  {asideItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
