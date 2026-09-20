"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Writer001Format = {
  /** Короткое имя формата: «Бумага», «Электронная», «Аудио». */
  name: string
  price: number
  /** Подпись под ценой: «с автографом, доставка 3 дня». */
  note: string
  actionLabel: string
  actionHref?: string
}

export type Writer001Props = {
  eyebrow?: string
  title?: string
  subtitle?: string
  author?: string
  /** Обложка. Пусто — типографская обложка из title и author. */
  cover?: string
  /** Первая страница, которая видна, когда обложка открывается. */
  firstPage?: readonly string[]
  lede?: string
  /** Факты о книге: издательство, страницы, год. */
  facts?: readonly string[]
  formats?: readonly Writer001Format[]
  /** Сколько страниц уже прочитали читатели — стартовое число счётчика. */
  pagesRead?: number
  /** Подпись к счётчику. */
  pagesLabel?: string
  currency?: string
  /** aria книги, подсказка, aria форматов, «страниц». */
  openLabel?: string
  hint?: string
  formatsLabel?: string
  pagesUnit?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Книга: 3D-обложка на perspective с корешком и мягкой тенью; при наведении
// (или фокусе) обложка поворачивается на 150° вокруг корешка и открывает
// первую страницу с буквицей. Справа — описание, факты и переключатель
// «бумага / электронная / аудио»: он меняет цену, подпись и кнопку. Внизу
// полоса «прочитано читателями: N страниц» тикает раз в пару секунд, как
// счётчик страниц в живой библиотеке.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="writer-001"]){
--vibeui-writer-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-writer-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-writer-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-writer-001-on-accent:oklch(from var(--vibeui-writer-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-writer-001-muted:color-mix(in oklab,var(--vibeui-writer-001-fg) 60%,var(--vibeui-writer-001-bg));
--vibeui-writer-001-line:color-mix(in oklab,var(--vibeui-writer-001-fg) 14%,transparent);
--vibeui-writer-001-paper:color-mix(in oklab,var(--vibeui-writer-001-bg) 92%,var(--vibeui-writer-001-fg));
--vibeui-writer-001-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-writer-001-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="writer-001"]{color-scheme:dark}
:where([data-vibeui-block="writer-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="writer-001"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="writer-001"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="writer-001"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="writer-001"]{box-sizing:border-box;overflow-x:clip;padding:clamp(4rem,8cqi,7rem) 0;background:var(--vibeui-writer-001-bg);color:var(--vibeui-writer-001-fg);font-family:var(--vibeui-writer-001-font);font-size:1.125rem;line-height:1.7;transition:background-color .6s,color .6s}
[data-vibeui-block="writer-001"] *{box-sizing:border-box}
[data-vibeui-block="writer-001"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:3rem}
[data-vibeui-block="writer-001"] [data-part="stage"]{display:grid;place-items:center;padding:2rem 0;perspective:1400px}
[data-vibeui-block="writer-001"] [data-part="book"]{position:relative;width:min(100%,17rem);aspect-ratio:2/3;transform-style:preserve-3d;transform:rotateY(-24deg) rotateX(4deg);transition:transform .9s cubic-bezier(.2,.8,.2,1);cursor:pointer;outline:none}
[data-vibeui-block="writer-001"] [data-part="book"]:hover,[data-vibeui-block="writer-001"] [data-part="book"]:focus-visible,[data-vibeui-block="writer-001"] [data-part="book"][data-open="true"]{transform:rotateY(-8deg) rotateX(2deg) translateX(12%)}
[data-vibeui-block="writer-001"] [data-part="book"]:focus-visible{outline:2px solid var(--vibeui-writer-001-accent);outline-offset:1.5rem}
[data-vibeui-block="writer-001"] [data-part="shadow"]{position:absolute;inset:auto 5% -12% 5%;height:14%;border-radius:50%;background:rgb(0 0 0 / .45);filter:blur(22px);transform:translateZ(-80px)}
[data-vibeui-block="writer-001"] [data-part="page"]{position:absolute;inset:0;border-radius:2px 8px 8px 2px;background:var(--vibeui-writer-001-paper);border:1px solid var(--vibeui-writer-001-line);box-shadow:inset 6px 0 12px -8px rgb(0 0 0 / .35),2px 2px 0 var(--vibeui-writer-001-paper),3px 3px 0 var(--vibeui-writer-001-line),4px 4px 0 var(--vibeui-writer-001-paper),5px 5px 0 var(--vibeui-writer-001-line),6px 6px 0 var(--vibeui-writer-001-paper),7px 7px 0 var(--vibeui-writer-001-line),8px 8px 0 var(--vibeui-writer-001-paper),9px 9px 0 var(--vibeui-writer-001-line);padding:2rem 1.4rem 1.6rem 1.9rem;overflow:hidden;font-size:.72rem;line-height:1.55;color:var(--vibeui-writer-001-fg);transform:translateZ(-2px)}
[data-vibeui-block="writer-001"] [data-part="page"] p{margin:0 0 .6em}
[data-vibeui-block="writer-001"] [data-part="page"] p:first-child::first-letter{float:left;font-family:var(--vibeui-writer-001-display);font-size:3.2em;line-height:.8;padding:.06em .12em 0 0;color:var(--vibeui-writer-001-accent)}
[data-vibeui-block="writer-001"] [data-part="page"] small{position:absolute;bottom:.7rem;left:0;right:0;text-align:center;font-size:.6rem;color:var(--vibeui-writer-001-muted)}
[data-vibeui-block="writer-001"] [data-part="cover"]{position:absolute;inset:0;border-radius:2px 8px 8px 2px;background:var(--vibeui-writer-001-accent);color:var(--vibeui-writer-001-on-accent);transform-origin:left center;transform:rotateY(0deg);transform-style:preserve-3d;transition:transform 1.1s cubic-bezier(.3,.8,.2,1);box-shadow:0 30px 60px -20px rgb(0 0 0 / .6)}
[data-vibeui-block="writer-001"] [data-part="book"]:hover [data-part="cover"],[data-vibeui-block="writer-001"] [data-part="book"]:focus-visible [data-part="cover"],[data-vibeui-block="writer-001"] [data-part="book"][data-open="true"] [data-part="cover"]{transform:rotateY(-118deg)}
[data-vibeui-block="writer-001"] [data-part="front"]{position:absolute;inset:0;backface-visibility:hidden;border-radius:inherit;overflow:hidden}
[data-vibeui-block="writer-001"] [data-part="inside"]{position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);border-radius:8px 2px 2px 8px;background:var(--vibeui-writer-001-paper);box-shadow:inset -6px 0 12px -8px rgb(0 0 0 / .35)}
[data-vibeui-block="writer-001"] [data-part="front"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="writer-001"] [data-part="front"]::before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,rgb(0 0 0 / .28) 0,transparent 8%,transparent 92%,rgb(255 255 255 / .12));pointer-events:none;z-index:2}
[data-vibeui-block="writer-001"] [data-part="jacket"]{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:1.8rem 1.4rem 1.4rem 1.7rem;z-index:1}
[data-vibeui-block="writer-001"] [data-part="jacket"] b{display:block;font-family:var(--vibeui-writer-001-display);font-weight:500;font-size:1.7rem;line-height:1.05;letter-spacing:-.01em}
[data-vibeui-block="writer-001"] [data-part="jacket"] i{display:block;margin-top:.5rem;font-size:.78rem;opacity:.85}
[data-vibeui-block="writer-001"] [data-part="jacket"] em{display:block;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;font-style:normal}
[data-vibeui-block="writer-001"] [data-part="cover"][data-photo="true"] [data-part="jacket"]{color:#fff;text-shadow:0 1px 12px rgb(0 0 0 / .5)}
[data-vibeui-block="writer-001"] [data-part="spine"]{position:absolute;top:0;bottom:0;left:0;width:1.4rem;background:linear-gradient(90deg,rgb(0 0 0 / .35),rgb(0 0 0 / .05) 40%,rgb(255 255 255 / .12));z-index:3;pointer-events:none}
[data-vibeui-block="writer-001"] [data-part="hint"]{margin:2.2rem 0 0;font-size:.78rem;font-style:italic;color:var(--vibeui-writer-001-muted);text-align:center}
[data-vibeui-block="writer-001"] [data-part="eyebrow"]{margin:0 0 1rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-writer-001-accent)}
[data-vibeui-block="writer-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-writer-001-display);font-weight:400;font-size:clamp(2.4rem,6cqi,4.4rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="writer-001"] [data-part="subtitle"]{margin:.6rem 0 0;font-family:var(--vibeui-writer-001-display);font-style:italic;font-size:clamp(1.3rem,2.4cqi,1.7rem);line-height:1.25;color:var(--vibeui-writer-001-muted)}
[data-vibeui-block="writer-001"] [data-part="lede"]{margin:1.5rem 0 0;max-width:36rem}
[data-vibeui-block="writer-001"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:.4rem 1.4rem;margin:1.4rem 0 0;padding:0;list-style:none;font-size:.82rem;font-style:italic;color:var(--vibeui-writer-001-muted)}
[data-vibeui-block="writer-001"] [data-part="facts"] li+li::before{content:"·";margin-right:1.4rem;color:var(--vibeui-writer-001-accent)}
[data-vibeui-block="writer-001"] [data-part="formats"]{display:inline-flex;flex-wrap:wrap;gap:.3rem;margin:2rem 0 0;padding:.3rem;border:1px solid var(--vibeui-writer-001-line);border-radius:999px}
[data-vibeui-block="writer-001"] [data-part="formats"] button{padding:.5rem 1rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-writer-001-muted);font:inherit;font-size:.9rem;font-style:italic;cursor:pointer;transition:background-color .3s,color .3s}
[data-vibeui-block="writer-001"] [data-part="formats"] button[aria-pressed="true"]{background:var(--vibeui-writer-001-fg);color:var(--vibeui-writer-001-bg)}
[data-vibeui-block="writer-001"] [data-part="formats"] button:focus-visible{outline:2px solid var(--vibeui-writer-001-accent);outline-offset:2px}
[data-vibeui-block="writer-001"] [data-part="offer"]{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 2rem;margin:1.6rem 0 0}
[data-vibeui-block="writer-001"] [data-part="price"]{display:grid;gap:.1rem}
[data-vibeui-block="writer-001"] [data-part="price"] b{font-family:var(--vibeui-writer-001-display);font-weight:500;font-size:2.6rem;line-height:1;font-variant-numeric:tabular-nums;letter-spacing:-.02em;animation:vibeui-writer-001-swap .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="writer-001"] [data-part="price"] small{font-size:.82rem;font-style:italic;color:var(--vibeui-writer-001-muted)}
[data-vibeui-block="writer-001"] [data-part="action"]{display:inline-flex;align-items:center;justify-content:center;padding:.85rem 1.6rem;border-radius:999px;background:var(--vibeui-writer-001-accent);color:var(--vibeui-writer-001-on-accent);text-decoration:none;font-style:italic;font-size:1.02rem;white-space:nowrap;transition:transform .25s cubic-bezier(.2,.7,.2,1),box-shadow .25s}
[data-vibeui-block="writer-001"] [data-part="action"]:hover{transform:translateY(-2px);box-shadow:0 14px 30px -14px var(--vibeui-writer-001-accent)}
[data-vibeui-block="writer-001"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-writer-001-fg);outline-offset:3px}
[data-vibeui-block="writer-001"] [data-part="counter"]{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.5rem 1.5rem;padding:1.2rem 0 0;border-top:1px solid var(--vibeui-writer-001-line);font-size:.85rem;font-style:italic;color:var(--vibeui-writer-001-muted)}
[data-vibeui-block="writer-001"] [data-part="counter"] output{font-family:var(--vibeui-writer-001-display);font-style:normal;font-weight:500;font-size:1.9rem;line-height:1;color:var(--vibeui-writer-001-fg);font-variant-numeric:tabular-nums;letter-spacing:.02em}
[data-vibeui-block="writer-001"] [data-part="counter"] output[data-tick="true"]{animation:vibeui-writer-001-tick .5s ease-out}
[data-vibeui-block="writer-001"] [data-part="counter"] output span{color:var(--vibeui-writer-001-accent)}
@keyframes vibeui-writer-001-swap{from{opacity:0;transform:translateY(.3em)}}
@keyframes vibeui-writer-001-tick{from{color:var(--vibeui-writer-001-accent)}}
@container (min-width: 56rem){[data-vibeui-block="writer-001"] [data-part="shell"]{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:4rem;align-items:center}[data-vibeui-block="writer-001"] [data-part="stage"]{padding:2rem 1rem}[data-vibeui-block="writer-001"] [data-part="book"]{width:min(100%,19rem)}[data-vibeui-block="writer-001"] [data-part="book"]:hover [data-part="cover"],[data-vibeui-block="writer-001"] [data-part="book"]:focus-visible [data-part="cover"],[data-vibeui-block="writer-001"] [data-part="book"][data-open="true"] [data-part="cover"]{transform:rotateY(-150deg)}[data-vibeui-block="writer-001"] [data-part="counter"]{grid-column:1/-1}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="writer-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_FORMATS: Writer001Format[] = [
  { name: "Бумага", price: 890, note: "с автографом, доставка по России 3–5 дней", actionLabel: "Заказать с автографом", actionHref: "#order" },
  { name: "Электронная", price: 390, note: "epub и pdf, письмо со ссылкой через минуту", actionLabel: "Купить и читать", actionHref: "#order" },
  { name: "Аудио", price: 590, note: "читает автор, 6 часов 40 минут", actionLabel: "Слушать первую главу", actionHref: "#listen" },
]

function formatNumber(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** Книга: 3D-обложка, которая открывается, форматы и тикающий счётчик страниц. */
export function Writer001({
  eyebrow = "Книга",
  title = "Комнаты, в которых мы не жили",
  subtitle = "Двадцать два эссе о домах, городах и о том, что мы уносим с собой",
  author = "Вера Холодова",
  cover,
  firstPage = [
    "Первый дом, который я помню, не был нашим. Мы снимали его у женщины с фамилией, похожей на название реки, и она приходила по четвергам смотреть, живы ли фикусы.",
    "Комнаты были огромные, как в кино, и говорили эхом. Я думала, это дом отвечает.",
  ],
  lede = "О квартирах, которые снимали, о домах, куда не переехали, о городах, где прожили одно лето. Эссе, написанные за шесть лет в четырёх странах и одной кухне.",
  facts = ["Издательство «Поля»", "288 страниц", "2026", "Тираж 3 000"],
  formats = DEFAULT_FORMATS,
  pagesRead = 1284391,
  pagesLabel = "прочитано читателями",
  currency = "₽",
  openLabel = "Открыть первую страницу книги «{title}»",
  hint = "Наведите или нажмите — откроется на седьмой странице",
  formatsLabel = "Формат книги",
  pagesUnit = "страниц",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Writer001Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const [pages, setPages] = useState(pagesRead)
  const [tick, setTick] = useState(false)
  const format = formats[Math.min(active, formats.length - 1)]

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  useEffect(() => {
    let timer = 0
    const beat = () => {
      setPages((value) => value + 1 + Math.floor(Math.random() * 6))
      setTick(true)
      window.setTimeout(() => setTick(false), 500)
      timer = window.setTimeout(beat, 1800 + Math.random() * 2600)
    }
    timer = window.setTimeout(beat, 1500)
    return () => window.clearTimeout(timer)
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-writer-001-accent": accent } : null),
    ...(ink ? { "--vibeui-writer-001-fg": ink } : null),
    ...(background ? { "--vibeui-writer-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-writer-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="writer-001" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="stage">
            <div>
              <div data-part="book" data-open={open} tabIndex={0} role="button" aria-pressed={open} aria-label={openLabel.replace("{title}", title)} onClick={() => setOpen((value) => !value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpen((value) => !value) } }}>
                <i data-part="shadow" aria-hidden="true" />
                <div data-part="page" aria-hidden="true">
                  {firstPage.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  <small>— 7 —</small>
                </div>
                <div data-part="cover" data-photo={cover ? "true" : undefined}>
                  <div data-part="front">
                    {cover ? <img src={cover} alt="" /> : null}
                    <div data-part="jacket">
                      <em>{author}</em>
                      <div>
                        <b>{title}</b>
                        <i>{subtitle}</i>
                      </div>
                    </div>
                    <i data-part="spine" aria-hidden="true" />
                  </div>
                  <i data-part="inside" aria-hidden="true" />
                </div>
              </div>
              <p data-part="hint">{hint}</p>
            </div>
          </div>
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {subtitle ? <p data-part="subtitle">{subtitle}</p> : null}
            {lede ? <p data-part="lede">{lede}</p> : null}
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
            {formats.length > 0 ? (
              <div data-part="formats" role="group" aria-label={formatsLabel}>
                {formats.map((item, i) => (
                  <button key={item.name} type="button" aria-pressed={i === active} onClick={() => setActive(i)}>
                    {item.name}
                  </button>
                ))}
              </div>
            ) : null}
            {format ? (
              <div data-part="offer">
                <div data-part="price">
                  <b key={format.name}>
                    {formatNumber(format.price)} {currency}
                  </b>
                  <small>{format.note}</small>
                </div>
                <a data-part="action" href={format.actionHref ?? "#"}>
                  {format.actionLabel}
                </a>
              </div>
            ) : null}
          </div>
          <div data-part="counter" aria-live="off">
            <span>{pagesLabel}</span>
            <output data-tick={tick}>
              {formatNumber(pages)} <span>{pagesUnit}</span>
            </output>
          </div>
        </div>
      </section>
    </>
  )
}
