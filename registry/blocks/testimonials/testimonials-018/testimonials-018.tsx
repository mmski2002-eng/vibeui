"use client"

import { useRef, useState, type CSSProperties } from "react"
import { Card108 } from "@/registry/components/card/card-108/card-108"

export type Testimonials018Item = {
  quote: string
  name: string
  role: string
  image?: string
  /** Ссылка на профиль: подпись становится ссылкой. */
  href?: string
  /** Видео-отзыв: превью и ссылка на файл (mp4/webm) или страницу плеера. */
  video?: string
  videoHref?: string
  /** Поток: «поток 12, весна 2026». */
  cohort?: string
}

export type Testimonials018Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Testimonials018Item[]
  /** Общая оценка и подпись. */
  score?: string
  scoreLabel?: string
  videoLabel?: string
  closeLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы бесконечной лентой: два ряда карточек едут навстречу друг другу,
// пауза по наведению, края растворяются маской. Карточка с видео открывает
// <dialog> с плеером (файл — <video>, страница — iframe), Escape и клик по
// фону закрывают. Слева сверху общая оценка со звёздами.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="testimonials-018"]){
--vibeui-testimonials-018-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-testimonials-018-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-018-muted:light-dark(#6b7280,#a3a3a3);
--vibeui-testimonials-018-card:light-dark(#f8fafc,#242424);
--vibeui-testimonials-018-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-testimonials-018-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-testimonials-018-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-testimonials-018-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-testimonials-018-font:"Inter",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="testimonials-018"]{color-scheme:dark}
:where([data-vibeui-block="testimonials-018"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="testimonials-018"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="testimonials-018"]{box-sizing:border-box;display:block;overflow:hidden;background:var(--vibeui-testimonials-018-bg);color:var(--vibeui-testimonials-018-fg);font-family:var(--vibeui-testimonials-018-font);font-size:.9375rem;line-height:1.5}
[data-vibeui-block="testimonials-018"] *{box-sizing:border-box}
[data-vibeui-block="testimonials-018"] [data-part="card"]{width:min(22rem,78vw)}
[data-vibeui-block="testimonials-018"] [data-part="shell"]{max-width:76rem;margin:0 auto;padding:4rem 1.25rem 0}
[data-vibeui-block="testimonials-018"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:1.5rem 3rem;margin-bottom:2.5rem}
[data-vibeui-block="testimonials-018"] [data-part="eyebrow"]{margin:0 0 .75rem;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-testimonials-018-accent);font-weight:700}
[data-vibeui-block="testimonials-018"] [data-part="title"]{margin:0;font-family:var(--vibeui-testimonials-018-display);font-weight:700;font-size:clamp(1.8rem,3.6cqi,2.75rem);line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="testimonials-018"] [data-part="lede"]{margin:.75rem 0 0;max-width:34rem;color:var(--vibeui-testimonials-018-muted)}
[data-vibeui-block="testimonials-018"] [data-part="score"]{display:flex;align-items:center;gap:.9rem;margin:0}
[data-vibeui-block="testimonials-018"] [data-part="score"] b{font-family:var(--vibeui-testimonials-018-display);font-size:2.5rem;font-weight:700;line-height:1;letter-spacing:-.02em}
[data-vibeui-block="testimonials-018"] [data-part="stars"]{display:block;color:var(--vibeui-testimonials-018-accent);letter-spacing:.1em;font-size:.9rem}
[data-vibeui-block="testimonials-018"] [data-part="score"] small{display:block;font-size:.78rem;color:var(--vibeui-testimonials-018-muted)}
[data-vibeui-block="testimonials-018"] [data-part="rows"]{display:grid;gap:1.25rem;padding-bottom:4rem;mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
[data-vibeui-block="testimonials-018"] [data-part="row"]{overflow:hidden}
[data-vibeui-block="testimonials-018"] [data-part="track"]{display:flex;gap:1.25rem;width:max-content;animation:vibeui-testimonials-018-run var(--vibeui-testimonials-018-t,60s) linear infinite}
[data-vibeui-block="testimonials-018"] [data-part="row"][data-reverse="true"] [data-part="track"]{animation-direction:reverse}
[data-vibeui-block="testimonials-018"] [data-part="row"]:hover [data-part="track"],[data-vibeui-block="testimonials-018"] [data-part="row"]:focus-within [data-part="track"]{animation-play-state:paused}
@keyframes vibeui-testimonials-018-run{to{transform:translateX(-50%)}}
[data-vibeui-block="testimonials-018"] [data-part="track"] ul{display:flex;gap:1.25rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="testimonials-018"] a:focus-visible{outline:2px solid var(--vibeui-testimonials-018-accent);outline-offset:3px}
[data-vibeui-block="testimonials-018"] [data-part="dialog"]{width:min(56rem,calc(100vw - 2rem));max-width:none;padding:0;border:0;border-radius:1.25rem;background:#0b0d12;color:#fff;overflow:hidden;box-shadow:0 40px 80px -30px rgb(0 0 0 / .6)}
[data-vibeui-block="testimonials-018"] [data-part="dialog"]::backdrop{background:rgb(11 13 18 / .75);backdrop-filter:blur(8px)}
[data-vibeui-block="testimonials-018"] [data-part="dialog"][open]{animation:vibeui-testimonials-018-pop .35s cubic-bezier(.2,.8,.2,1)}
@keyframes vibeui-testimonials-018-pop{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:none}}
[data-vibeui-block="testimonials-018"] [data-part="player"]{display:block;width:100%;aspect-ratio:16/9;border:0;background:#000}
[data-vibeui-block="testimonials-018"] [data-part="dialog-bar"]{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem 1.25rem;font-size:.85rem}
[data-vibeui-block="testimonials-018"] [data-part="close"]{border:0;border-radius:999px;padding:.45rem .9rem;background:rgb(255 255 255 / .12);color:#fff;font:inherit;font-size:.8rem;font-weight:600;cursor:pointer}
[data-vibeui-block="testimonials-018"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-testimonials-018-marker);outline-offset:2px}
@container (min-width: 64rem){[data-vibeui-block="testimonials-018"] [data-part="shell"]{padding:5.5rem 2rem 0}[data-vibeui-block="testimonials-018"] [data-part="rows"]{padding-bottom:5.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="testimonials-018"] [data-part="track"]{animation:none;width:auto;flex-wrap:wrap}[data-vibeui-block="testimonials-018"] [data-part="track"] ul[aria-hidden]{display:none}[data-vibeui-block="testimonials-018"] [data-part="rows"]{mask-image:none;-webkit-mask-image:none}[data-vibeui-block="testimonials-018"] *{transition:none!important}}`

const DEFAULT_ITEMS: Testimonials018Item[] = [
  { quote: "Самое ценное — ревью. Куратор разобрал мою домашку на 20 минут видео и показал, где я теряю пользователя. На работе так никто не делает.", name: "Марина Соколова", role: "UI-дизайнер, Авито", cohort: "поток 11", videoHref: "#" },
  { quote: "Пришёл продактом, чтобы перестать ждать дизайнеров. Через месяц собрал прототип фичи сам и получил «да» на тест за один созвон.", name: "Игорь Левин", role: "Продакт-менеджер, Ozon", cohort: "поток 12" },
  { quote: "Лайвы по средам — это отдельный курс. Ксения на живом файле показывает, как думает, а не только что нажать.", name: "Алина Фёдорова", role: "Дизайнер, фриланс", cohort: "поток 12" },
  { quote: "Защита перед арт-директором — страшно и полезно. Через неделю повторила тот же рассказ на собеседовании и получила оффер.", name: "Дарья Ким", role: "Продуктовый дизайнер, Яндекс", cohort: "поток 10" },
  { quote: "Автолейаут наконец перестал быть магией. Сдал дизайн-систему на работе через месяц после курса.", name: "Сергей Панов", role: "Дизайнер, Тинькофф", cohort: "поток 11" },
  { quote: "Чат потока живёт до сих пор: там обсуждаем вакансии и смотрим работы друг друга.", name: "Оля Ракова", role: "UX-дизайнер, СберМаркет", cohort: "поток 9" },
]

const FILE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i

/** Отзывы двумя встречными бегущими рядами с паузой по наведению и видео в лайтбоксе. */
export function Testimonials018({
  eyebrow = "Отзывы",
  title = "Что говорят после защиты",
  lede = "Отзывы из чата выпускников и с открытых площадок — с именами, должностями и ссылками на профили.",
  items = DEFAULT_ITEMS,
  score = "4,9",
  scoreLabel = "по 412 отзывам выпускников",
  videoLabel = "Видео-отзыв",
  closeLabel = "Закрыть",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Testimonials018Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState<Testimonials018Item | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-testimonials-018-accent": accent } : null),
    ...(ink ? { "--vibeui-testimonials-018-fg": ink } : null),
    ...(background ? { "--vibeui-testimonials-018-bg": background } : null),
    ...style,
  } as CSSProperties
  const half = Math.ceil(items.length / 2)
  const rows = items.length > 3 ? [items.slice(0, half), items.slice(half)] : [items, items]

  const open = (item: Testimonials018Item) => {
    setCurrent(item)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-testimonials-018" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="testimonials-018" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            {score ? (
              <p data-part="score">
                <b>{score}</b>
                <span>
                  <span data-part="stars" aria-hidden="true">
                    ★★★★★
                  </span>
                  {scoreLabel ? <small>{scoreLabel}</small> : null}
                </span>
              </p>
            ) : null}
          </div>
        </div>
        <div data-part="rows">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} data-part="row" data-reverse={rowIndex % 2 === 1} style={{ ["--vibeui-testimonials-018-t" as string]: `${Math.max(30, row.length * 14)}s` }}>
              <div data-part="track">
                {[0, 1].map((copy) => (
                  <ul key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
                    {row.map((item) => {
                      const onVideo = () => open(item)
                      return (
                      <Card108 key={item.name} data-part="card" name={item.name} videoHref={item.videoHref} video={item.video} quote={item.quote} image={item.image} href={item.href} role={item.role} cohort={item.cohort} videoLabel={videoLabel} onVideo={onVideo} copy={copy} accent={accent} />
                      )
                    })}
                  </ul>
                ))}
              </div>
            </div>
          ))}
        </div>
        <dialog ref={dialog} data-part="dialog" onClose={() => setCurrent(null)} onClick={(event) => event.target === dialog.current && close()} aria-label={current ? `${videoLabel}: ${current.name}` : videoLabel}>
          {current?.videoHref ? (
            FILE.test(current.videoHref) ? (
              <video data-part="player" src={current.videoHref} poster={current.video} controls autoPlay playsInline />
            ) : (
              <iframe data-part="player" src={current.videoHref} title={`${videoLabel}: ${current.name}`} allow="autoplay; fullscreen; picture-in-picture" />
            )
          ) : null}
          <div data-part="dialog-bar">
            <span>
              {current?.name}
              {current?.role ? ` · ${current.role}` : ""}
            </span>
            <button type="button" data-part="close" onClick={close}>
              {closeLabel}
            </button>
          </div>
        </dialog>
      </section>
    </>
  )
}
