import type { CSSProperties } from "react"

export type Testimonials025Review = {
  title: string
  text: string
  name: string
  /** Магазин: «App Store» или «Google Play». */
  store?: string
  stars?: number
  date?: string
}

export type Testimonials025Props = {
  eyebrow?: string
  title?: string
  lede?: string
  rating?: string
  ratingNote?: string
  reviews?: readonly Testimonials025Review[]
  /** Фото-подложка с затемнением. Пусто — без фото. */
  image?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы из магазинов приложений: карточки с заголовком, звёздами, текстом,
// именем и бейджем магазина в горизонтальной ленте со scroll-snap — листаются
// пальцем и колесом, край следующей карточки виден. Сверху общий рейтинг
// крупно. Фон — фото с затемнением. Без JS.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-025"]){
--vibeui-testimonials-025-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-025-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-025-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-025-muted:color-mix(in oklab,var(--vibeui-testimonials-025-fg) 60%,var(--vibeui-testimonials-025-bg));
--vibeui-testimonials-025-line:color-mix(in oklab,var(--vibeui-testimonials-025-fg) 12%,transparent);
--vibeui-testimonials-025-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-testimonials-025-bg) 85%,var(--vibeui-testimonials-025-fg)));
--vibeui-testimonials-025-star:#f5b301;
--vibeui-testimonials-025-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-025-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-025"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-025"]{box-sizing:border-box;position:relative;overflow:hidden;padding:5rem 0;background:var(--vibeui-testimonials-025-bg);color:var(--vibeui-testimonials-025-fg);font-family:var(--vibeui-testimonials-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-025"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-025"] [data-part="photo"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.18}
[data-vibeui-block="testimonials-025"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(180deg,var(--vibeui-testimonials-025-bg),transparent 40%,var(--vibeui-testimonials-025-bg))}
[data-vibeui-block="testimonials-025"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-025"] [data-part="head"]{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;flex-wrap:wrap}
[data-vibeui-block="testimonials-025"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-testimonials-025-accent)}
[data-vibeui-block="testimonials-025"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,5cqi,3.4rem);line-height:1.05;letter-spacing:-.03em}
[data-vibeui-block="testimonials-025"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-testimonials-025-muted)}
[data-vibeui-block="testimonials-025"] [data-part="rating"]{display:grid;justify-items:end;text-align:right}
[data-vibeui-block="testimonials-025"] [data-part="rating"] b{font-family:var(--vibeui-testimonials-025-mono);font-size:3.4rem;font-weight:500;line-height:1;letter-spacing:-.04em}
[data-vibeui-block="testimonials-025"] [data-part="rating"] small{color:var(--vibeui-testimonials-025-muted);font-size:.85rem}
[data-vibeui-block="testimonials-025"] [data-part="stars"]{display:inline-flex;gap:.1rem;color:var(--vibeui-testimonials-025-star)}
[data-vibeui-block="testimonials-025"] [data-part="stars"] i[data-off="true"]{color:var(--vibeui-testimonials-025-line)}
[data-vibeui-block="testimonials-025"] [data-part="track"]{display:flex;gap:1rem;margin:2.5rem -1.25rem 0;padding:.5rem 1.25rem 1rem;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding:0 1.25rem;scrollbar-width:none}
[data-vibeui-block="testimonials-025"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="testimonials-025"] [data-part="card"]{flex:0 0 min(22rem,85%);scroll-snap-align:start;display:grid;gap:.8rem;padding:1.5rem;border-radius:1.4rem;background:var(--vibeui-testimonials-025-card);box-shadow:0 20px 40px -30px rgb(0 0 0 / .5),0 0 0 1px var(--vibeui-testimonials-025-line);transition:transform .3s}
[data-vibeui-block="testimonials-025"] [data-part="card"]:hover{transform:translateY(-.25rem)}
[data-vibeui-block="testimonials-025"] [data-part="card"] h3{margin:0;font-size:1.1rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="testimonials-025"] [data-part="card"] p{margin:0;color:var(--vibeui-testimonials-025-muted);font-size:.95rem}
[data-vibeui-block="testimonials-025"] [data-part="who"]{display:flex;align-items:center;gap:.6rem;margin-top:auto;font-size:.82rem}
[data-vibeui-block="testimonials-025"] [data-part="who"] b{font-weight:600}
[data-vibeui-block="testimonials-025"] [data-part="who"] span{color:var(--vibeui-testimonials-025-muted)}
[data-vibeui-block="testimonials-025"] [data-part="store"]{margin-left:auto;font-family:var(--vibeui-testimonials-025-mono);font-size:.65rem;padding:.2rem .5rem;border-radius:4px;background:var(--vibeui-testimonials-025-fg);color:var(--vibeui-testimonials-025-bg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-025"] *{transition:none!important}}`

const DEFAULT_REVIEWS: Testimonials025Review[] = [
  { title: "Первый раз уснула без телефона", text: "Дыхание 4-7-8 работает лучше, чем всё, что я пробовала. Круг на экране — гениально просто.", name: "Лена К.", store: "App Store", stars: 5, date: "сен 2026" },
  { title: "Будильник не бесит", text: "Будит в лёгкой фазе — встаю без ощущения, что меня вытащили из колодца. Серьёзно.", name: "Артём", store: "Google Play", stars: 5, date: "авг 2026" },
  { title: "Серия дней мотивирует", text: "Не хочу терять 18 дней подряд — и ложусь вовремя. Дурацкая психология, но работает.", name: "Мария Л.", store: "App Store", stars: 5, date: "авг 2026" },
  { title: "Хотелось бы виджет", text: "Всё нравится, но не хватает виджета с серией на главном экране. Ставлю четыре авансом.", name: "Дмитрий", store: "Google Play", stars: 4, date: "июл 2026" },
  { title: "Тихо и без рекламы", text: "Никаких «премиум за 3 990 в год» на каждом экране. Бесплатной версии хватает.", name: "Оля", store: "App Store", stars: 5, date: "июл 2026" },
]

function Stars({ n }: { n: number }) {
  return (
    <span data-part="stars" aria-label={`${n} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} data-off={i > n} aria-hidden="true">
          ★
        </i>
      ))}
    </span>
  )
}

/** Отзывы из магазинов лентой со scroll-snap и общим рейтингом. */
export function Testimonials025({
  eyebrow = "Отзывы",
  title = "Что пишут в магазинах",
  lede = "Без отбора: последние отзывы из App Store и Google Play как есть.",
  rating = "4,9",
  ratingNote = "12 412 оценок",
  reviews = DEFAULT_REVIEWS,
  image = "",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials025Props) {
  const palette = {
    ...(accent ? { "--vibeui-testimonials-025-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-025-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-025-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-025" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-025" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        {image ? <img data-part="photo" src={image} alt="" /> : null}
        {image ? <div data-part="shade" aria-hidden="true" /> : null}
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            {rating ? (
              <div data-part="rating">
                <b>{rating}</b>
                <Stars n={5} />
                {ratingNote ? <small>{ratingNote}</small> : null}
              </div>
            ) : null}
          </div>
          <div data-part="track">
            {reviews.map((review) => (
              <article key={review.title} data-part="card">
                <Stars n={review.stars ?? 5} />
                <h3>{review.title}</h3>
                <p>{review.text}</p>
                <div data-part="who">
                  <b>{review.name}</b>
                  {review.date ? <span>· {review.date}</span> : null}
                  {review.store ? <span data-part="store">{review.store}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
