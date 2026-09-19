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
// крупно. Фон — фото с затемнением и плывущие пятна. Без JS: заголовок
// въезжает пословно через маски, карточки поднимаются каскадом, а звёзды
// зажигаются одна за другой — всё на scroll-driven `animation-timeline: view()`
// с фолбэком «видно всегда» там, где его нет. Наведение — лёгкий 3D-наклон.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"

// Каскад для scroll-driven таймлайнов: задержки там не работают, поэтому
// сдвигаем диапазон каждому n-му слову, карточке и звезде.
const STAGGER = [
  ...Array.from({ length: 14 }, (_, i) => `[data-vibeui-block="testimonials-025"] [data-part="w"]:nth-child(${i + 1}) span{animation-range:entry ${i * 3}% entry ${70 + i * 3}%}`),
  ...Array.from({ length: 8 }, (_, i) => `[data-vibeui-block="testimonials-025"] [data-part="card"]:nth-child(${i + 1}){animation-range:entry ${i * 7}% entry ${60 + i * 7}%}`),
  ...Array.from({ length: 5 }, (_, i) => `[data-vibeui-block="testimonials-025"] [data-part="card"] [data-part="stars"] i:nth-child(${i + 1}){animation-range:entry ${40 + i * 8}% entry ${70 + i * 8}%}`),
].join("\n")

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
[data-vibeui-block="testimonials-025"]{box-sizing:border-box;position:relative;overflow:clip;padding:5rem 0;background:var(--vibeui-testimonials-025-bg);color:var(--vibeui-testimonials-025-fg);font-family:var(--vibeui-testimonials-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="testimonials-025"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-025"] [data-part="mesh"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="testimonials-025"] [data-part="mesh"] i{position:absolute;border-radius:50%;filter:blur(50px);opacity:.4;animation:vibeui-testimonials-025-float 20s ease-in-out infinite alternate}
[data-vibeui-block="testimonials-025"] [data-part="mesh"] i:nth-child(1){left:-10%;top:-10%;width:40%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-testimonials-025-accent) 30%,transparent),transparent 65%)}
[data-vibeui-block="testimonials-025"] [data-part="mesh"] i:nth-child(2){right:-8%;bottom:-20%;width:38%;aspect-ratio:1;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-testimonials-025-accent) 18%,#ff9ad5),transparent 65%);animation-delay:-9s}
[data-vibeui-block="testimonials-025"] [data-part="photo"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.18}
[data-vibeui-block="testimonials-025"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(180deg,var(--vibeui-testimonials-025-bg),transparent 40%,var(--vibeui-testimonials-025-bg))}
[data-vibeui-block="testimonials-025"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="testimonials-025"] [data-part="head"]{display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;flex-wrap:wrap}
[data-vibeui-block="testimonials-025"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.8rem;font-weight:600;color:var(--vibeui-testimonials-025-accent)}
[data-vibeui-block="testimonials-025"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.2rem,5.6cqi,4rem);line-height:1.02;letter-spacing:-.035em}
[data-vibeui-block="testimonials-025"] [data-part="w"]{display:inline-block;overflow:clip;vertical-align:bottom;padding:.06em .04em .12em 0;margin:-.06em 0 -.12em}
[data-vibeui-block="testimonials-025"] [data-part="w"] span{display:inline-block}
[data-vibeui-block="testimonials-025"] [data-part="lede"]{margin:1rem 0 0;max-width:30rem;color:var(--vibeui-testimonials-025-muted)}
[data-vibeui-block="testimonials-025"] [data-part="rating"]{display:grid;justify-items:end;text-align:right}
[data-vibeui-block="testimonials-025"] [data-part="rating"] b{font-family:var(--vibeui-testimonials-025-mono);font-size:4.2rem;font-weight:500;line-height:1;letter-spacing:-.05em;background:linear-gradient(120deg,var(--vibeui-testimonials-025-fg),var(--vibeui-testimonials-025-accent));-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="testimonials-025"] [data-part="rating"] small{color:var(--vibeui-testimonials-025-muted);font-size:.85rem}
[data-vibeui-block="testimonials-025"] [data-part="stars"]{display:inline-flex;gap:.1rem;color:var(--vibeui-testimonials-025-star)}
[data-vibeui-block="testimonials-025"] [data-part="stars"] i{display:inline-block}
[data-vibeui-block="testimonials-025"] [data-part="stars"] i[data-off="true"]{color:var(--vibeui-testimonials-025-line)}
[data-vibeui-block="testimonials-025"] [data-part="track"]{display:flex;gap:1rem;margin:2.5rem -1.25rem 0;padding:.5rem 1.25rem 1.5rem;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding:0 1.25rem;scrollbar-width:none;perspective:1200px}
[data-vibeui-block="testimonials-025"] [data-part="track"]::-webkit-scrollbar{display:none}
[data-vibeui-block="testimonials-025"] [data-part="card"]{position:relative;flex:0 0 min(22rem,85%);scroll-snap-align:start;display:grid;gap:.8rem;padding:1.6rem;border-radius:1.5rem;background:var(--vibeui-testimonials-025-card);box-shadow:0 20px 40px -30px rgb(0 0 0 / .5),0 0 0 1px var(--vibeui-testimonials-025-line);transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s}
[data-vibeui-block="testimonials-025"] [data-part="card"]:hover{transform:translateY(-.4rem) rotateX(3deg) rotateY(-3deg);box-shadow:0 40px 60px -30px color-mix(in oklab,var(--vibeui-testimonials-025-accent) 55%,transparent),0 0 0 1px color-mix(in oklab,var(--vibeui-testimonials-025-accent) 40%,transparent)}
[data-vibeui-block="testimonials-025"] [data-part="card"]::before{content:"\\201C";position:absolute;right:1.2rem;top:.4rem;font-size:5rem;line-height:1;font-weight:800;color:var(--vibeui-testimonials-025-accent);opacity:.14;pointer-events:none}
[data-vibeui-block="testimonials-025"] [data-part="card"] h3{margin:0;font-size:1.1rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="testimonials-025"] [data-part="card"] p{margin:0;color:var(--vibeui-testimonials-025-muted);font-size:.95rem}
[data-vibeui-block="testimonials-025"] [data-part="who"]{display:flex;align-items:center;gap:.6rem;margin-top:auto;font-size:.82rem}
[data-vibeui-block="testimonials-025"] [data-part="who"] b{font-weight:600}
[data-vibeui-block="testimonials-025"] [data-part="who"] span{color:var(--vibeui-testimonials-025-muted)}
[data-vibeui-block="testimonials-025"] [data-part="store"]{margin-left:auto;font-family:var(--vibeui-testimonials-025-mono);font-size:.65rem;padding:.2rem .5rem;border-radius:4px;background:var(--vibeui-testimonials-025-fg);color:var(--vibeui-testimonials-025-bg)}
@keyframes vibeui-testimonials-025-float{from{transform:translate(0,0)}to{transform:translate(8%,10%)}}
@keyframes vibeui-testimonials-025-rise{from{transform:translateY(112%)}to{transform:none}}
@keyframes vibeui-testimonials-025-up{from{opacity:0;translate:0 2.5rem}to{opacity:1;translate:0 0}}
@keyframes vibeui-testimonials-025-star{from{transform:scale(0) rotate(-40deg);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-testimonials-025-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
@supports (animation-timeline: view()){
[data-vibeui-block="testimonials-025"] [data-part="title"]{view-timeline:--vibeui-testimonials-025-title block}
[data-vibeui-block="testimonials-025"] [data-part="track"]{view-timeline:--vibeui-testimonials-025-track block}
[data-vibeui-block="testimonials-025"] [data-part="w"] span{animation:vibeui-testimonials-025-rise cubic-bezier(.2,.8,.2,1) both;animation-timeline:--vibeui-testimonials-025-title;animation-range:entry 0% entry 70%}
[data-vibeui-block="testimonials-025"] [data-part="rating"]{animation:vibeui-testimonials-025-pop cubic-bezier(.2,.8,.2,1) both;animation-timeline:view();animation-range:entry 0% entry 90%}
[data-vibeui-block="testimonials-025"] [data-part="card"]{animation:vibeui-testimonials-025-up cubic-bezier(.2,.8,.2,1) both;animation-timeline:--vibeui-testimonials-025-track;animation-range:entry 0% entry 60%}
[data-vibeui-block="testimonials-025"] [data-part="card"] [data-part="stars"] i{animation:vibeui-testimonials-025-star cubic-bezier(.2,1.4,.4,1) both;animation-timeline:--vibeui-testimonials-025-track;animation-range:entry 40% entry 70%}
${STAGGER}
}
[data-vibeui-block="testimonials-025"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-025"] *{animation:none!important;transition:none!important}}`

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
        <i key={i} data-off={i > n} aria-hidden="true" style={{ ["--vibeui-testimonials-025-i" as string]: i - 1 }}>
          ★
        </i>
      ))}
    </span>
  )
}

function Words({ text }: { text: string }) {
  return text.split(/\s+/).map((word, index) => (
    <span data-part="w" key={index} style={{ ["--vibeui-testimonials-025-i" as string]: index }}>
      <span>{word}</span>
    </span>
  ))
}

/** Отзывы из магазинов лентой со scroll-snap, каскадом и зажигающимися звёздами. */
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
        <div data-part="mesh" aria-hidden="true">
          <i />
          <i />
        </div>
        {image ? <img data-part="photo" src={image} alt="" /> : null}
        {image ? <div data-part="shade" aria-hidden="true" /> : null}
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">
                <Words text={title} />
              </h2>
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
            {reviews.map((review, index) => (
              <article key={review.title} data-part="card" style={{ ["--vibeui-testimonials-025-i" as string]: index }}>
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
