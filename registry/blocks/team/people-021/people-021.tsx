"use client"

import { useRef, useSyncExternalStore, type CSSProperties, type MouseEvent, type PointerEvent } from "react"

export type People021Author = {
  name: string
  role: string
  /** Инициалы на аватаре. Пусто — первые буквы имени. */
  initials?: string
  /** Оттенок аватара 0–360. */
  hue?: number
  products: number
  /** Доход на начало месяца плюс скорость — рублей в секунду от начала месяца. */
  baseIncome: number
  perSecond: number
  href?: string
}

export type People021Props = {
  eyebrow?: string
  title?: string
  lede?: string
  authors?: readonly People021Author[]
  incomeLabel?: string
  joinLabel?: string
  joinHref?: string
  currency?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Авторы маркетплейса лентой с drag-scroll: карточки тянутся мышью или
// пальцем (pointer capture, при сдвиге клики по ссылкам гасятся), у
// каждого автора доход текущего месяца тикает раз в секунду — считается
// от реального времени через useSyncExternalStore с серверным снимком
// null, поэтому SSR и гидрация совпадают, а цифра оживает уже на клиенте.
// Аватары — инициалы на цветных кругах, без фото. Справа кнопка «стать
// автором».
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="people-021"]){
--vibeui-people-021-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-021-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-021-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-021-on-accent:oklch(from var(--vibeui-people-021-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-021-muted:color-mix(in oklab,var(--vibeui-people-021-fg) 58%,var(--vibeui-people-021-bg));
--vibeui-people-021-line:color-mix(in oklab,var(--vibeui-people-021-fg) 12%,transparent);
--vibeui-people-021-soft:color-mix(in oklab,var(--vibeui-people-021-fg) 4%,transparent);
--vibeui-people-021-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-021-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-021-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-021"]{color-scheme:dark}
:where([data-vibeui-block="people-021"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-021"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-021"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-people-021-bg);color:var(--vibeui-people-021-fg);font-family:var(--vibeui-people-021-font);font-size:1rem;line-height:1.5;overflow:hidden}
[data-vibeui-block="people-021"] *{box-sizing:border-box}
[data-vibeui-block="people-021"] [data-part="shell"]{max-width:86rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-021"] [data-part="head"]{display:grid;gap:1.2rem;align-items:end}
[data-vibeui-block="people-021"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-people-021-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-people-021-muted)}
[data-vibeui-block="people-021"] [data-part="title"]{margin:0;max-width:22ch;font-family:var(--vibeui-people-021-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:.98;letter-spacing:-.04em}
[data-vibeui-block="people-021"] [data-part="lede"]{margin:.8rem 0 0;max-width:34rem;color:var(--vibeui-people-021-muted)}
[data-vibeui-block="people-021"] [data-part="join"]{display:inline-flex;align-items:center;gap:.5rem;height:3rem;padding:0 1.35rem;border-radius:999px;background:var(--vibeui-people-021-accent);color:var(--vibeui-people-021-on-accent);font-weight:600;text-decoration:none;white-space:nowrap;width:max-content;transition:transform .18s,box-shadow .2s}
[data-vibeui-block="people-021"] [data-part="join"]:hover{transform:translateY(-1px);box-shadow:0 12px 30px -12px var(--vibeui-people-021-accent)}
[data-vibeui-block="people-021"] [data-part="lane"]{display:flex;gap:1rem;margin:2.5rem 0 0;padding:.5rem max(1.25rem,calc((100% - 86rem) / 2 + 1.25rem)) 1rem;overflow-x:auto;scrollbar-width:none;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:pan-y}
[data-vibeui-block="people-021"] [data-part="lane"]::-webkit-scrollbar{display:none}
[data-vibeui-block="people-021"] [data-part="lane"][data-dragging="true"]{cursor:grabbing}
[data-vibeui-block="people-021"] [data-part="lane"][data-dragging="true"] [data-part="card"]{transform:scale(.985)}
[data-vibeui-block="people-021"] [data-part="card"]{flex:0 0 17rem;display:grid;gap:1rem;padding:1.3rem;border-radius:1.3rem;border:1px solid var(--vibeui-people-021-line);background:var(--vibeui-people-021-bg);text-decoration:none;color:inherit;transition:transform .3s cubic-bezier(.2,.7,.2,1),border-color .2s,box-shadow .3s}
[data-vibeui-block="people-021"] [data-part="card"]:hover{border-color:var(--vibeui-people-021-fg);box-shadow:0 24px 50px -30px rgb(0 0 0 / .4)}
[data-vibeui-block="people-021"] [data-part="top"]{display:flex;align-items:center;gap:.9rem}
[data-vibeui-block="people-021"] [data-part="avatar"]{flex-shrink:0;width:3.4rem;height:3.4rem;border-radius:50%;display:grid;place-items:center;font-family:var(--vibeui-people-021-display);font-weight:700;font-size:1.05rem;letter-spacing:-.02em;color:#fff;background:radial-gradient(circle at 30% 25%,oklch(.82 .14 var(--vibeui-people-021-h)),oklch(.55 .18 var(--vibeui-people-021-h)))}
[data-vibeui-block="people-021"] [data-part="card"] h3{margin:0;font-family:var(--vibeui-people-021-display);font-weight:700;font-size:1.1rem;letter-spacing:-.02em;line-height:1.15}
[data-vibeui-block="people-021"] [data-part="role"]{margin:.15rem 0 0;font-size:.84rem;color:var(--vibeui-people-021-muted)}
[data-vibeui-block="people-021"] [data-part="income"]{display:grid;gap:.25rem;padding:.9rem 1rem;border-radius:.9rem;background:var(--vibeui-people-021-soft)}
[data-vibeui-block="people-021"] [data-part="income"] span{display:flex;align-items:center;gap:.4rem;font-family:var(--vibeui-people-021-mono);font-size:.64rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-people-021-muted)}
[data-vibeui-block="people-021"] [data-part="live"]{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-people-021-accent);animation:vibeui-people-021-pulse 1.4s ease-in-out infinite}
[data-vibeui-block="people-021"] [data-part="income"] output{font-family:var(--vibeui-people-021-mono);font-weight:500;font-size:1.35rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1}
[data-vibeui-block="people-021"] [data-part="income"] output[data-empty="true"]{color:var(--vibeui-people-021-muted)}
[data-vibeui-block="people-021"] [data-part="meta"]{display:flex;justify-content:space-between;gap:.6rem;font-family:var(--vibeui-people-021-mono);font-size:.7rem;color:var(--vibeui-people-021-muted)}
[data-vibeui-block="people-021"] [data-part="meta"] b{font-weight:500;color:var(--vibeui-people-021-fg)}
[data-vibeui-block="people-021"] [data-part="drag"]{margin:.4rem 0 0;padding:0 max(1.25rem,calc((100% - 86rem) / 2 + 1.25rem));font-family:var(--vibeui-people-021-mono);font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-people-021-muted)}
[data-vibeui-block="people-021"] a:focus-visible{outline:2px solid var(--vibeui-people-021-accent);outline-offset:2px}
@keyframes vibeui-people-021-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
@container (min-width: 56rem){[data-vibeui-block="people-021"] [data-part="head"]{grid-template-columns:minmax(0,1fr) auto}[data-vibeui-block="people-021"] [data-part="card"]{flex-basis:19rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-021"] *{animation:none!important;transition:none!important}}`

const DEFAULT_AUTHORS: People021Author[] = [
  { name: "Лена Заварзина", role: "UI-киты и дашборды для Figma", hue: 255, products: 14, baseIncome: 96400, perSecond: 0.11 },
  { name: "Тимур Гареев", role: "Шрифты: гротески и рукописные", hue: 30, products: 6, baseIncome: 142000, perSecond: 0.07 },
  { name: "студия Сетка", role: "Иконки и иллюстрации", initials: "СТ", hue: 150, products: 22, baseIncome: 210800, perSecond: 0.18 },
  { name: "Аня Мельник", role: "Notion для продуктовых команд", hue: 320, products: 9, baseIncome: 58900, perSecond: 0.05 },
  { name: "Игорь Плотников", role: "Notion: личная продуктивность", hue: 200, products: 11, baseIncome: 73200, perSecond: 0.09 },
  { name: "Марат Юсупов", role: "3D-иконки и мокапы", hue: 85, products: 5, baseIncome: 31500, perSecond: 0.04 },
]

let nowSeconds = 0
function subscribe(callback: () => void) {
  const tick = () => {
    nowSeconds = Math.floor(Date.now() / 1000)
    callback()
  }
  tick()
  const id = window.setInterval(tick, 1000)
  return () => window.clearInterval(id)
}
const getSnapshot = () => nowSeconds
const getServerSnapshot = () => null

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/** Лента авторов с drag-scroll и тикающим доходом месяца. */
export function People021({
  eyebrow = "авторы",
  title = "1 240 авторов зарабатывают на Слое прямо сейчас",
  lede = "Доход считается в реальном времени: каждая покупка — 80 % автору, выплата по пятницам. Потяните ленту.",
  authors = DEFAULT_AUTHORS,
  incomeLabel = "доход в этом месяце",
  joinLabel = "Стать автором",
  joinHref = "#for-authors",
  currency = "₽",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People021Props) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const laneRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })

  const elapsed = (() => {
    if (!now) return null
    const date = new Date(now * 1000)
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime() / 1000
    return now - monthStart
  })()

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const lane = laneRef.current
    if (!lane || event.pointerType === "touch") return
    drag.current = { active: true, startX: event.clientX, startLeft: lane.scrollLeft, moved: false }
    lane.setPointerCapture(event.pointerId)
    lane.dataset.dragging = "true"
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const lane = laneRef.current
    if (!lane || !drag.current.active) return
    const dx = event.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    lane.scrollLeft = drag.current.startLeft - dx
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const lane = laneRef.current
    if (!lane || !drag.current.active) return
    drag.current.active = false
    lane.releasePointerCapture(event.pointerId)
    lane.dataset.dragging = "false"
  }
  // После перетаскивания клик по карточке не должен переходить по ссылке.
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      event.preventDefault()
      drag.current.moved = false
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-people-021-accent": accent } : null),
    ...(ink ? { "--vibeui-people-021-fg": ink } : null),
    ...(background ? { "--vibeui-people-021-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-021" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-021" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
              {lede ? <p data-part="lede">{lede}</p> : null}
            </div>
            {joinLabel ? (
              <a data-part="join" href={joinHref}>
                {joinLabel}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
        <div ref={laneRef} data-part="lane" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClickCapture={onClickCapture}>
          {authors.map((author) => {
            const income = elapsed === null ? null : author.baseIncome + elapsed * author.perSecond
            return (
              <a key={author.name} data-part="card" href={author.href ?? "#"} draggable={false}>
                <div data-part="top">
                  <span data-part="avatar" aria-hidden="true" style={{ ["--vibeui-people-021-h" as string]: author.hue ?? 250 }}>
                    {author.initials ?? initialsOf(author.name)}
                  </span>
                  <div>
                    <h3>{author.name}</h3>
                    <p data-part="role">{author.role}</p>
                  </div>
                </div>
                <div data-part="income">
                  <span>
                    <i data-part="live" aria-hidden="true" />
                    {incomeLabel}
                  </span>
                  <output data-empty={income === null} aria-live="off">
                    {income === null ? "— — —" : formatMoney(income, currency)}
                  </output>
                </div>
                <div data-part="meta">
                  <span>
                    <b>{author.products}</b> товаров
                  </span>
                  <span>
                    <b>{formatMoney(author.perSecond * 3600, "").trim()}</b> {currency}/час
                  </span>
                </div>
              </a>
            )
          })}
        </div>
        <p data-part="drag" aria-hidden="true">
          ← потяните ленту →
        </p>
      </section>
    </>
  )
}
