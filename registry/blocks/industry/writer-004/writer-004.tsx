"use client"

import { useEffect, useState, type CSSProperties } from "react"
import { Card097 } from "@/registry/components/card/card-097/card-097"

export type Writer004Note = {
  text: string
  name: string
  /** Город или откуда: «Казань», «из письма». */
  from?: string
}

export type Writer004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Заголовок фрагмента на «странице». */
  pageTitle?: string
  /** Абзацы на странице, вокруг которой — заметки. */
  page?: readonly string[]
  /** Номер страницы в колонтитуле. */
  pageNumber?: string
  notes?: readonly Writer004Note[]
  /** Сколько заметок видно одновременно (2–4). */
  visible?: number
  /** Секунд между сменами заметок. */
  interval?: number
  /** aria полей. */
  leftLabel?: string
  rightLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Отзывы читателей как заметки на полях: в центре — «страница» книги с
// фрагментом и колонтитулом, по обе стороны на полях — рукописные заметки
// (Caveat), каждая чуть повёрнута и подписана именем. Заметки сменяются
// по кругу: раз в несколько секунд одна из них гаснет, и на её место
// вписывается следующая из очереди — как будто книгу читают по очереди.
// На узком экране заметки встают колонкой под страницей.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Caveat:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="writer-004"]){
--vibeui-writer-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-writer-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-writer-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-writer-004-muted:color-mix(in oklab,var(--vibeui-writer-004-fg) 60%,var(--vibeui-writer-004-bg));
--vibeui-writer-004-line:color-mix(in oklab,var(--vibeui-writer-004-fg) 14%,transparent);
--vibeui-writer-004-paper:color-mix(in oklab,var(--vibeui-writer-004-bg) 94%,var(--vibeui-writer-004-fg));
--vibeui-writer-004-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-writer-004-font:"PT Serif",Georgia,"Times New Roman",serif;
--vibeui-writer-004-hand:"Caveat","Segoe Print","Bradley Hand",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="writer-004"]{color-scheme:dark}
:where([data-vibeui-block="writer-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="writer-004"][data-tone="dark"]){color-scheme:dark}
:where([data-vibeui-block="writer-004"][data-mode="day"]){color-scheme:light}
:where([data-vibeui-block="writer-004"][data-mode="night"]){color-scheme:dark}
[data-vibeui-block="writer-004"]{box-sizing:border-box;padding:4rem 0;background:var(--vibeui-writer-004-bg);color:var(--vibeui-writer-004-fg);font-family:var(--vibeui-writer-004-font);font-size:1.05rem;line-height:1.7;transition:background-color .6s,color .6s}
@supports (animation-timeline:view()){[data-vibeui-block="writer-004"] [data-part="shell"]{animation:vibeui-writer-004-reveal linear both;animation-timeline:view();animation-range:entry 0% entry 35%}}
@keyframes vibeui-writer-004-reveal{from{opacity:0;transform:translateY(1.5rem)}}
[data-vibeui-block="writer-004"] *{box-sizing:border-box}
[data-vibeui-block="writer-004"] [data-part="shell"]{max-width:74rem;margin:0 auto;padding:0 1.25rem}
@container (min-width:48rem){[data-vibeui-block="writer-004"] [data-part="shell"]{padding-block:2rem}}
@container (min-width:72rem){[data-vibeui-block="writer-004"] [data-part="shell"]{padding-block:3rem}}
[data-vibeui-block="writer-004"] [data-part="head"]{max-width:36rem;margin:0 auto 3rem;text-align:center}
[data-vibeui-block="writer-004"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.72rem;font-style:italic;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-writer-004-accent)}
[data-vibeui-block="writer-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-writer-004-display);font-weight:400;font-size:clamp(2rem,4.5cqi,3.25rem);line-height:1.05;letter-spacing:-.02em}
[data-vibeui-block="writer-004"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-writer-004-muted)}
[data-vibeui-block="writer-004"] [data-part="spread"]{display:grid;gap:2rem;align-items:center}
[data-vibeui-block="writer-004"] [data-part="page"]{order:-1;position:relative;width:100%;max-width:38rem;margin:0 auto;padding:clamp(2rem,5cqi,3.5rem) clamp(1.4rem,4cqi,3rem) 3rem;background:var(--vibeui-writer-004-paper);border:1px solid var(--vibeui-writer-004-line);box-shadow:0 30px 60px -40px rgb(0 0 0 / .6);transition:background-color .6s}
[data-vibeui-block="writer-004"] [data-part="page"]::before{content:"";position:absolute;inset:.6rem;border:1px solid var(--vibeui-writer-004-line);pointer-events:none}
[data-vibeui-block="writer-004"] [data-part="page"] h3{margin:0 0 1.2rem;font-family:var(--vibeui-writer-004-display);font-weight:400;font-size:1.9rem;line-height:1.1;text-align:center}
[data-vibeui-block="writer-004"] [data-part="page"] p{margin:0 0 1em;font-size:1rem;text-wrap:pretty}
[data-vibeui-block="writer-004"] [data-part="page"] p:first-of-type::first-letter{float:left;font-family:var(--vibeui-writer-004-display);font-size:3.6em;line-height:.8;padding:.08em .14em 0 0;color:var(--vibeui-writer-004-accent)}
[data-vibeui-block="writer-004"] [data-part="folio"]{position:absolute;left:0;right:0;bottom:1.1rem;text-align:center;font-family:var(--vibeui-writer-004-display);font-size:.9rem;color:var(--vibeui-writer-004-muted)}
[data-vibeui-block="writer-004"] [data-part="margin"]{display:grid;gap:1.5rem;margin:0;padding:0;list-style:none}
@keyframes vibeui-writer-004-in{from{opacity:0;transform:rotate(var(--vibeui-writer-004-r,0deg)) translateY(.6rem)}}
@container (min-width: 60rem){[data-vibeui-block="writer-004"] [data-part="spread"]{grid-template-columns:minmax(0,1fr) minmax(0,38rem) minmax(0,1fr);gap:2.5rem}[data-vibeui-block="writer-004"] [data-part="page"]{order:0}[data-vibeui-block="writer-004"] [data-part="margin"]{align-content:space-around;height:100%;gap:2.5rem}[data-vibeui-block="writer-004"] [data-part="margin"][data-side="left"]{text-align:right}[data-vibeui-block="writer-004"] [data-part="margin"][data-side="left"] [data-vibeui-block="card-097"]{padding:.4rem 1.4rem .4rem .6rem}[data-vibeui-block="writer-004"] [data-part="margin"][data-side="left"] [data-vibeui-block="card-097"]::before{left:auto;right:.2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="writer-004"] *{animation:none!important;transition:none!important}}`

const DEFAULT_NOTES: Writer004Note[] = [
  { text: "Читала в метро и проехала свою станцию. Дважды.", name: "Марина", from: "Казань" },
  { text: "Про балконы — это же про моего отца. Как вы узнали?", name: "Игорь", from: "из письма" },
  { text: "Купила бумажную после электронной. Чтобы подчёркивать.", name: "Аня", from: "Екатеринбург" },
  { text: "Единственная книга, которую я читал вслух коту.", name: "Тимур", from: "Тбилиси" },
  { text: "Первый раз слышу, как звучит тишина в тексте.", name: "Лена", from: "Петербург" },
  { text: "Подарила маме. Теперь она пишет мне письма от руки.", name: "Ольга", from: "Самара" },
  { text: "Читаю по одному эссе в воскресенье, растягиваю.", name: "Дмитрий", from: "Минск" },
]


/** Отзывы как заметки на полях страницы, сменяются по кругу. */
export function Writer004({
  eyebrow = "Читатели",
  title = "Заметки на полях",
  lede = "Что пишут на полях, в письмах и в метро. Заметки сменяются — как читатели.",
  pageTitle = "Балконы",
  page = [
    "Балкон — единственная комната, в которой хозяева не притворяются. Там велосипед, там банки, там сушится то, что не покажут гостям, и там же — стул, на котором кто-то думает по вечерам.",
    "Если бы я писала путеводители, я бы писала их по балконам. Не по фасадам — фасады врут за деньги, — а по тому, что вынесено наружу, потому что внутри не поместилось.",
  ],
  pageNumber = "— 41 —",
  notes = DEFAULT_NOTES,
  visible = 4,
  interval = 4,
  leftLabel = "Заметки читателей",
  rightLabel = "Ещё заметки читателей",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Writer004Props) {
  const [mode, setMode] = useState<"day" | "night" | null>(null)
  const count = Math.max(1, Math.min(visible, notes.length, 4))
  const [slots, setSlots] = useState<readonly number[]>(() => Array.from({ length: count }, (_, i) => i))
  const [leaving, setLeaving] = useState(-1)

  useEffect(() => {
    const onTheme = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: string }>).detail
      if (detail?.mode === "day" || detail?.mode === "night") setMode(detail.mode)
    }
    window.addEventListener("vibeui-writer:theme", onTheme)
    return () => window.removeEventListener("vibeui-writer:theme", onTheme)
  }, [])

  useEffect(() => {
    if (notes.length <= count) return
    let slot = 0
    let next = count
    let swap = 0
    const timer = window.setInterval(() => {
      const target = slot
      setLeaving(target)
      swap = window.setTimeout(() => {
        const incoming = next
        setSlots((value) => value.map((item, i) => (i === target ? incoming : item)))
        setLeaving(-1)
        next = (next + 1) % notes.length
      }, 420)
      slot = (slot + 1) % count
    }, Math.max(1.5, interval) * 1000)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(swap)
    }
  }, [notes.length, count, interval])

  const palette = {
    ...(accent ? { "--vibeui-writer-004-accent": accent } : null),
    ...(ink ? { "--vibeui-writer-004-fg": ink } : null),
    ...(background ? { "--vibeui-writer-004-bg": background } : null),
    ...style,
  } as CSSProperties

  const renderNote = (slotIndex: number) => {
    const note = notes[slots[slotIndex] ?? 0]
    if (!note) return null
    return (
      <Card097 key={`${slotIndex}-${slots[slotIndex]}`} data-part="note" text={note.text} name={note.name} from={note.from} slotIndex={slotIndex} data-leaving={leaving === slotIndex} accent={accent} />
    )
  }

  const left = slots.map((_, i) => i).filter((i) => i % 2 === 0)
  const right = slots.map((_, i) => i).filter((i) => i % 2 === 1)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-writer-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="writer-004" data-tone={tone === "auto" ? undefined : tone} data-mode={mode ?? undefined} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="spread">
            <ul data-part="margin" data-side="left" aria-label={leftLabel}>
              {left.map(renderNote)}
            </ul>
            <article data-part="page">
              <h3>{pageTitle}</h3>
              {page.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {pageNumber ? <span data-part="folio">{pageNumber}</span> : null}
            </article>
            <ul data-part="margin" data-side="right" aria-label={rightLabel}>
              {right.map(renderNote)}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
