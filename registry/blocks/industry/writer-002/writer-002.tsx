"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Writer002Text = {
  title: string
  year: string
  /** Минут на чтение. */
  minutes: number
  /** Тема — по ней работает фильтр. */
  topic: string
  /** Первая строка — показывается в превью у курсора. */
  firstLine: string
  /** Фрагмент, который раскрывается по «читать дальше». */
  excerpt: readonly string[]
  href?: string
}

export type Writer002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  texts?: readonly Writer002Text[]
  /** Подпись фильтра «все». */
  allLabel?: string
  moreLabel?: string
  lessLabel?: string
  /** Ссылка «читать целиком» внутри раскрытого фрагмента. */
  fullLabel?: string
  /** aria фильтров, формы слов «текст» и «минута», пустое состояние. */
  filtersLabel?: string
  textUnits?: readonly [string, string, string]
  minuteUnits?: readonly [string, string, string]
  emptyText?: string
  firstLineLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Архив текстов: список с крупными заголовками антиквой. При наведении
// справа выезжают год и время чтения, а за курсором ходит карточка-превью
// с первой строкой текста (позиция пишется в transform напрямую через ref,
// без ререндеров). Фильтр по темам — строка курсивных ссылок. «Читать
// дальше» раскрывает фрагмент прямо в списке: grid-template-rows 0fr → 1fr,
// первый абзац с буквицей. Открыт только один текст за раз.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"

const STYLES = `
:where([data-vibeui-block="writer-002"]){
--vibeui-writer-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-writer-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-writer-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-writer-002-muted:color-mix(in oklab,var(--vibeui-writer-002-fg) 60%,var(--vibeui-writer-002-bg));
--vibeui-writer-002-line:color-mix(in oklab,var(--vibeui-writer-002-fg) 14%,transparent);
--vibeui-writer-002-paper:color-mix(in oklab,var(--vibeui-writer-002-bg) 94%,var(--vibeui-writer-002-fg));
--vibeui-writer-002-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-writer-002-font:"PT Serif",Georgia,"Times New Roman",serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="writer-002"]{color-scheme:dark}
:where([data-vibeui-block="writer-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="writer-002"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="writer-002"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="writer-002"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="writer-002"]{box-sizing:border-box;padding:4rem 0;background:var(--vibeui-writer-002-bg);color:var(--vibeui-writer-002-fg);font-family:var(--vibeui-writer-002-font);font-size:1.125rem;line-height:1.7;transition:background-color .6s,color .6s}
@supports (animation-timeline:view()){[data-vibeui-block="writer-002"] [data-part="shell"]{animation:vibeui-writer-002-reveal linear both;animation-timeline:view();animation-range:entry 0% entry 35%}}
@keyframes vibeui-writer-002-reveal{from{opacity:0;transform:translateY(1.5rem)}}
[data-vibeui-block="writer-002"] *{box-sizing:border-box}
[data-vibeui-block="writer-002"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem}
@container (min-width:48rem){[data-vibeui-block="writer-002"] [data-part="shell"]{padding-block:2rem}}
@container (min-width:72rem){[data-vibeui-block="writer-002"] [data-part="shell"]{padding-block:3rem}}
[data-vibeui-block="writer-002"] [data-part="head"]{display:grid;gap:1.2rem;margin-bottom:3rem}
[data-vibeui-block="writer-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-writer-002-accent)}
[data-vibeui-block="writer-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-writer-002-display);font-weight:400;font-size:clamp(2.4rem,6cqi,4.4rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="writer-002"] [data-part="lede"]{margin:1rem 0 0;max-width:34rem;color:var(--vibeui-writer-002-muted)}
[data-vibeui-block="writer-002"] [data-part="filters"]{display:flex;flex-wrap:wrap;gap:.2rem 1.2rem;margin:0;padding:0;list-style:none;font-style:italic;font-size:1rem}
[data-vibeui-block="writer-002"] [data-part="filters"] button{position:relative;padding:.2rem 0;border:0;background:transparent;color:var(--vibeui-writer-002-muted);font:inherit;cursor:pointer;transition:color .25s}
[data-vibeui-block="writer-002"] [data-part="filters"] button::after{content:"";position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--vibeui-writer-002-accent);transform:scaleX(0);transform-origin:left;transition:transform .3s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="writer-002"] [data-part="filters"] button:hover{color:var(--vibeui-writer-002-fg)}
[data-vibeui-block="writer-002"] [data-part="filters"] button[aria-pressed="true"]{color:var(--vibeui-writer-002-fg)}
[data-vibeui-block="writer-002"] [data-part="filters"] button[aria-pressed="true"]::after{transform:scaleX(1)}
[data-vibeui-block="writer-002"] [data-part="filters"] button:focus-visible{outline:2px solid var(--vibeui-writer-002-accent);outline-offset:3px}
[data-vibeui-block="writer-002"] [data-part="count"]{font-size:.85rem;font-style:italic;color:var(--vibeui-writer-002-muted)}
[data-vibeui-block="writer-002"] [data-part="archive"]{position:relative}
[data-vibeui-block="writer-002"] [data-part="list"]{margin:0;padding:0;list-style:none;border-top:1px solid var(--vibeui-writer-002-line)}
[data-vibeui-block="writer-002"] [data-part="heading"]{margin:0;font:inherit}
[data-vibeui-block="writer-002"] [data-part="item"]{border-bottom:1px solid var(--vibeui-writer-002-line);animation:vibeui-writer-002-in .5s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="writer-002"] [data-part="row"]{display:grid;grid-template-columns:minmax(0,1fr);gap:.4rem 1.5rem;align-items:baseline;width:100%;padding:1.3rem 0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}
[data-vibeui-block="writer-002"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-writer-002-accent);outline-offset:4px}
[data-vibeui-block="writer-002"] [data-part="name"]{display:block;margin:0;font-family:var(--vibeui-writer-002-display);font-weight:400;font-size:clamp(1.7rem,3.6cqi,2.8rem);line-height:1.1;letter-spacing:-.01em;transition:color .3s,transform .5s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="writer-002"] [data-part="item"]:hover [data-part="name"],[data-vibeui-block="writer-002"] [data-part="item"][data-open="true"] [data-part="name"]{color:var(--vibeui-writer-002-accent);transform:translateX(.6rem)}
[data-vibeui-block="writer-002"] [data-part="meta"]{display:flex;gap:1.2rem;font-size:.85rem;font-style:italic;color:var(--vibeui-writer-002-muted);white-space:nowrap;font-variant-numeric:tabular-nums}
[data-vibeui-block="writer-002"] [data-part="meta"] span+span::before{content:"·";margin-right:1.2rem;color:var(--vibeui-writer-002-accent)}
[data-vibeui-block="writer-002"] [data-part="topic"]{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-writer-002-muted)}
[data-vibeui-block="writer-002"] [data-part="more"]{font-style:italic;font-size:.95rem;color:var(--vibeui-writer-002-accent);white-space:nowrap}
[data-vibeui-block="writer-002"] [data-part="fold"]{display:grid;grid-template-rows:0fr;transition:grid-template-rows .7s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="writer-002"] [data-part="item"][data-open="true"] [data-part="fold"]{grid-template-rows:1fr}
[data-vibeui-block="writer-002"] [data-part="fold"]>div{overflow:hidden}
[data-vibeui-block="writer-002"] [data-part="excerpt"]{max-width:65ch;padding:.4rem 0 2rem;opacity:0;transform:translateY(.6rem);transition:opacity .6s ease .15s,transform .6s cubic-bezier(.2,.8,.2,1) .15s}
[data-vibeui-block="writer-002"] [data-part="item"][data-open="true"] [data-part="excerpt"]{opacity:1;transform:none}
[data-vibeui-block="writer-002"] [data-part="excerpt"] p{margin:0 0 1em}
[data-vibeui-block="writer-002"] [data-part="excerpt"] p:first-child::first-letter{float:left;font-family:var(--vibeui-writer-002-display);font-size:3.6em;line-height:.8;padding:.08em .14em 0 0;color:var(--vibeui-writer-002-accent)}
[data-vibeui-block="writer-002"] [data-part="excerpt"] a{color:var(--vibeui-writer-002-fg);font-style:italic;text-decoration:none;border-bottom:1px solid var(--vibeui-writer-002-accent);transition:color .25s}
[data-vibeui-block="writer-002"] [data-part="excerpt"] a:hover{color:var(--vibeui-writer-002-accent)}
[data-vibeui-block="writer-002"] [data-part="excerpt"] a:focus-visible{outline:2px solid var(--vibeui-writer-002-accent);outline-offset:3px}
[data-vibeui-block="writer-002"] [data-part="preview"]{position:absolute;top:0;left:0;z-index:2;display:none;width:18rem;padding:1rem 1.1rem;border-radius:.3rem;background:var(--vibeui-writer-002-paper);border:1px solid var(--vibeui-writer-002-line);box-shadow:0 24px 50px -24px rgb(0 0 0 / .5);font-family:var(--vibeui-writer-002-display);font-size:1.15rem;line-height:1.3;pointer-events:none;opacity:0;transform:translate(var(--vibeui-writer-002-x,0),var(--vibeui-writer-002-y,0)) rotate(-1.5deg);transition:opacity .3s}
[data-vibeui-block="writer-002"] [data-part="preview"] small{display:block;margin-bottom:.4rem;font-family:var(--vibeui-writer-002-font);font-size:.68rem;font-style:italic;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-writer-002-accent)}
[data-vibeui-block="writer-002"] [data-part="archive"][data-hover="true"] [data-part="preview"]{opacity:1}
[data-vibeui-block="writer-002"] [data-part="empty"]{padding:2rem 0;font-style:italic;color:var(--vibeui-writer-002-muted)}
@keyframes vibeui-writer-002-in{from{opacity:0;transform:translateY(.6rem)}}
@container (min-width: 40rem){[data-vibeui-block="writer-002"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto;align-items:end}[data-vibeui-block="writer-002"] [data-part="row"]{grid-template-columns:minmax(0,1fr) auto}[data-vibeui-block="writer-002"] [data-part="meta"]>span:not([data-part="more"]){opacity:0;transform:translateX(1rem);transition:opacity .4s,transform .5s cubic-bezier(.2,.8,.2,1)}[data-vibeui-block="writer-002"] [data-part="item"]:hover [data-part="meta"]>span,[data-vibeui-block="writer-002"] [data-part="item"][data-open="true"] [data-part="meta"]>span,[data-vibeui-block="writer-002"] [data-part="row"]:focus-visible [data-part="meta"]>span{opacity:1;transform:none}[data-vibeui-block="writer-002"] [data-part="topic"]{grid-column:1/-1}}
@container (min-width: 56rem){[data-vibeui-block="writer-002"] [data-part="preview"]{display:block}[data-vibeui-block="writer-002"] [data-part="row"]{grid-template-columns:auto minmax(0,1fr) auto;align-items:baseline}[data-vibeui-block="writer-002"] [data-part="topic"]{grid-column:auto;width:6.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="writer-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_TEXTS: Writer002Text[] = [
  { title: "Город, который спит на боку", year: "2024", minutes: 12, topic: "Города", firstLine: "Тбилиси ложится спать не по часам, а по склону: сначала гаснут верхние улицы.", excerpt: ["Тбилиси ложится спать не по часам, а по склону: сначала гаснут верхние улицы, потом те, что цепляются за них балконами, и только к трём — набережная, где ещё долго кто-то смеётся у воды.", "Я прожила там одну зиму и научилась различать этажи по звуку. Верхние скрипят. Средние поют по утрам, потому что там живут те, кто рано встаёт. Нижние молчат и пахнут хлебом."] },
  { title: "Тетрадь моей бабушки в клетку", year: "2023", minutes: 9, topic: "Память", firstLine: "В тетради нет ни одной даты, но есть цены на масло за одиннадцать лет.", excerpt: ["В тетради нет ни одной даты, но есть цены на масло за одиннадцать лет. По ним я и восстанавливаю время: вот здесь мы переехали, вот здесь родилась я, вот здесь масло подорожало вдвое и почерк стал мельче.", "Она не вела дневник. Она вела хозяйство. Но если читать эти столбики подряд, получается самая честная автобиография, какую я знаю."] },
  { title: "Как звучит дом, когда все ушли", year: "2025", minutes: 7, topic: "Дом", firstLine: "Холодильник, оказывается, вздыхает. Я не знала этого тридцать четыре года.", excerpt: ["Холодильник, оказывается, вздыхает. Я не знала этого тридцать четыре года, потому что дома всегда кто-то был, и его вздох терялся в разговорах.", "Пустой дом звучит как ожидание: дверь, которая ещё не хлопнула, чайник, который ещё не поставили. Он не молчит. Он держит паузу."] },
  { title: "Слова, которые я не могу перевести", year: "2022", minutes: 14, topic: "Язык", firstLine: "Португальское saudade все переводят «тоской», и все врут — примерно на треть.", excerpt: ["Португальское saudade все переводят «тоской», и все врут — примерно на треть. В нём есть нежность, которой в тоске нет, и нет тяжести, которая в тоске есть.", "Я собираю такие слова в отдельный файл. Их четырнадцать. По одному на каждый переезд, будто язык выдаёт мне по слову за каждый чемодан."] },
  { title: "Балконы", year: "2021", minutes: 6, topic: "Дом", firstLine: "Балкон — единственная комната, в которой хозяева не притворяются.", excerpt: ["Балкон — единственная комната, в которой хозяева не притворяются. Там велосипед, там банки, там сушится то, что не покажут гостям, и там же — стул, на котором кто-то думает по вечерам.", "Если бы я писала путеводители, я бы писала их по балконам."] },
  { title: "Письмо к вокзалу", year: "2025", minutes: 11, topic: "Города", firstLine: "Дорогой Ладожский, ты был первым, кто увидел меня уезжающей.", excerpt: ["Дорогой Ладожский, ты был первым, кто увидел меня уезжающей. Ты не удивился. У тебя такая работа.", "С тех пор я узнаю города по вокзалам: те, что встречают гулко, те, что встречают тесно, и те, где перрон сразу переходит в улицу, будто город не хочет, чтобы ты задерживалась на пороге."] },
  { title: "Про запах ксерокса", year: "2020", minutes: 5, topic: "Память", firstLine: "Есть запахи, которые исчезли вместе с профессией.", excerpt: ["Есть запахи, которые исчезли вместе с профессией. Ксерокс в подвале библиотеки пах горячей бумагой и озоном, и я ходила туда за этим запахом чаще, чем за копиями.", "Теперь я знаю: память хранит не события, а условия, при которых мы их переживали. Свет, температуру, запах порошка."] },
]

function plural(value: number, one: string, few: string, many: string) {
  const mod10 = value % 10
  const mod100 = value % 100
  if (mod10 === 1 && mod100 !== 11) return `${value} ${one}`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${value} ${few}`
  return `${value} ${many}`
}

/** Архив текстов: крупный список, превью у курсора, фильтр и раскрытие в списке. */
export function Writer002({
  eyebrow = "Тексты",
  title = "Архив",
  lede = "Эссе за семь лет. Короткие — на одну остановку, длинные — на дорогу домой. Наведите: покажу первую строку.",
  texts = DEFAULT_TEXTS,
  allLabel = "Все",
  moreLabel = "читать дальше",
  lessLabel = "свернуть",
  fullLabel = "Читать целиком →",
  filtersLabel = "Темы",
  textUnits = ["текст", "текста", "текстов"],
  minuteUnits = ["минута", "минуты", "минут"],
  emptyText = "Пока ничего — но я пишу.",
  firstLineLabel = "первая строка",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Writer002Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const [topic, setTopic] = useState("")
  const [open, setOpen] = useState(-1)
  const [hover, setHover] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const topics = useMemo(() => Array.from(new Set(texts.map((text) => text.topic))), [texts])
  const visible = useMemo(() => texts.map((text, index) => ({ text, index })).filter(({ text }) => !topic || text.topic === topic), [texts, topic])

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  const track = (event: PointerEvent<HTMLDivElement>) => {
    const list = listRef.current
    const preview = previewRef.current
    if (!list || !preview) return
    const box = list.getBoundingClientRect()
    // Превью справа-снизу от курсора; у правого края переворачивается влево.
    const x = event.clientX - box.left
    const y = event.clientY - box.top
    const flip = x + 18 + 288 > box.width
    preview.style.setProperty("--vibeui-writer-002-x", `${Math.round(flip ? x - 18 - 288 : x + 18)}px`)
    preview.style.setProperty("--vibeui-writer-002-y", `${Math.round(y + 22)}px`)
  }

  const hovered = hover >= 0 ? texts[hover] : undefined

  const palette = {
    ...(accent ? { "--vibeui-writer-002-accent": accent } : null),
    ...(ink ? { "--vibeui-writer-002-fg": ink } : null),
    ...(background ? { "--vibeui-writer-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-writer-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="writer-002" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            <div>
              <ul data-part="filters" aria-label={filtersLabel}>
                <li>
                  <button type="button" aria-pressed={topic === ""} onClick={() => { setTopic(""); setOpen(-1) }}>
                    {allLabel}
                  </button>
                </li>
                {topics.map((item) => (
                  <li key={item}>
                    <button type="button" aria-pressed={topic === item} onClick={() => { setTopic(item); setOpen(-1) }}>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
              <p data-part="count">{plural(visible.length, ...textUnits)}</p>
            </div>
          </div>
          <div data-part="archive" ref={listRef} data-hover={hover >= 0 && open !== hover} onPointerMove={track} onPointerLeave={() => setHover(-1)}>
            <ul data-part="list">
            {visible.length === 0 ? <li data-part="empty">{emptyText}</li> : null}
            {visible.map(({ text, index }, order) => {
              const isOpen = open === index
              return (
                <li key={text.title} data-part="item" data-open={isOpen} style={{ animationDelay: `${order * 60}ms` }} onPointerEnter={() => setHover(index)}>
                  <h3 data-part="heading">
                    <button data-part="row" type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : index)}>
                      <span data-part="topic">{text.topic}</span>
                      <span data-part="name">{text.title}</span>
                      <span data-part="meta">
                        <span>{text.year}</span>
                        <span>{plural(text.minutes, ...minuteUnits)}</span>
                        <span data-part="more">{isOpen ? lessLabel : moreLabel}</span>
                      </span>
                    </button>
                  </h3>
                  <div data-part="fold">
                    <div>
                      <div data-part="excerpt">
                        {text.excerpt.map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                        {text.href || fullLabel ? <a href={text.href ?? "#"}>{fullLabel}</a> : null}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
            </ul>
            <div data-part="preview" ref={previewRef} aria-hidden="true">
              {hovered ? (
                <>
                  <small>{firstLineLabel}</small>
                  {hovered.firstLine}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
