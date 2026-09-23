"use client"

import { useState, type CSSProperties } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Vet002Spot = {
  key: string
  /** Часть тела: «Уши», «Зубы». */
  label: string
  /** Координаты хотспота в процентах от схемы (3:2). */
  x: number
  y: number
  service: string
  price: string
  duration?: string
  text: string
}

export type Vet002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  spots?: readonly Vet002Spot[]
  /** Фото животного в профиль (PNG без фона). Пусто — рисованный силуэт. */
  image?: string
  imageAlt?: string
  defaultSpot?: string
  actionLabel?: string
  actionHref?: string
  legendLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Карта питомца: фото собаки в профиль (PNG без фона; без фото —
// SVG-силуэт из простых фигур), поверх — кнопки-хотспоты в процентах от
// схемы, каждая пульсирует кольцом. Клик по точке — справа карточка услуги
// с ценой, временем и текстом; карточка перерисовывается с подскоком через
// key. Хотспоты — настоящие кнопки с aria-pressed, ходят с клавиатуры.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="vet-002"]){
--vibeui-vet-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-vet-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-vet-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-vet-002-on-accent:oklch(from var(--vibeui-vet-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-vet-002-muted:color-mix(in oklab,var(--vibeui-vet-002-fg) 62%,var(--vibeui-vet-002-bg));
--vibeui-vet-002-line:color-mix(in oklab,var(--vibeui-vet-002-fg) 12%,transparent);
--vibeui-vet-002-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-vet-002-bg) 88%,#fff));
--vibeui-vet-002-fur:color-mix(in oklab,var(--vibeui-vet-002-accent) 28%,var(--vibeui-vet-002-bg));
--vibeui-vet-002-fur-dark:color-mix(in oklab,var(--vibeui-vet-002-accent) 55%,var(--vibeui-vet-002-fg));
--vibeui-vet-002-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-vet-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="vet-002"]{color-scheme:dark}
:where([data-vibeui-block="vet-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="vet-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="vet-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-vet-002-bg);color:var(--vibeui-vet-002-fg);font-family:var(--vibeui-vet-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="vet-002"] *{box-sizing:border-box}
[data-vibeui-block="vet-002"] [data-part="action"]{margin:1.3rem 0 0}
[data-vibeui-block="vet-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="vet-002"] [data-part="head"]{max-width:40rem}
[data-vibeui-block="vet-002"] [data-part="eyebrow"]{margin:0 0 .7rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-vet-002-accent)}
[data-vibeui-block="vet-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-vet-002-display);font-weight:900;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1;letter-spacing:-.03em}
[data-vibeui-block="vet-002"] [data-part="lede"]{margin:.9rem 0 0;color:var(--vibeui-vet-002-muted)}
[data-vibeui-block="vet-002"] [data-part="board"]{display:grid;gap:1.5rem;margin:2.2rem 0 0;align-items:start}
[data-vibeui-block="vet-002"] [data-part="scheme"]{position:relative;width:100%;aspect-ratio:600/420;border-radius:1.6rem;background:color-mix(in oklab,var(--vibeui-vet-002-fg) 4%,transparent);border:1px solid var(--vibeui-vet-002-line);overflow:visible}
[data-vibeui-block="vet-002"] [data-part="scheme"] svg{position:absolute;inset:0;width:100%;height:100%;display:block}
[data-vibeui-block="vet-002"] [data-part="photo"]{position:absolute;inset:4%;width:92%;height:92%;object-fit:contain;filter:drop-shadow(0 18px 20px rgb(0 0 0 / .22))}
[data-vibeui-block="vet-002"] [data-part="spot"]{position:absolute;z-index:2;width:2.2rem;height:2.2rem;margin:-1.1rem 0 0 -1.1rem;padding:0;border:2px solid var(--vibeui-vet-002-accent);border-radius:50%;background:var(--vibeui-vet-002-card);color:var(--vibeui-vet-002-accent);font-family:var(--vibeui-vet-002-display);font-weight:900;font-size:.85rem;cursor:pointer;transition:transform .25s cubic-bezier(.34,1.56,.64,1),background .2s,color .2s}
[data-vibeui-block="vet-002"] [data-part="spot"]::before{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid var(--vibeui-vet-002-accent);opacity:0;animation:vibeui-vet-002-pulse 2.4s ease-out infinite;animation-delay:calc(var(--vibeui-vet-002-i) * .3s)}
[data-vibeui-block="vet-002"] [data-part="spot"]:hover{transform:scale(1.15)}
[data-vibeui-block="vet-002"] [data-part="spot"][aria-pressed="true"]{background:var(--vibeui-vet-002-accent);color:var(--vibeui-vet-002-on-accent);transform:scale(1.2)}
[data-vibeui-block="vet-002"] [data-part="spot"][aria-pressed="true"]::before{animation:none;opacity:0}
[data-vibeui-block="vet-002"] [data-part="spot"]:focus-visible{outline:2px solid var(--vibeui-vet-002-fg);outline-offset:3px}
[data-vibeui-block="vet-002"] [data-part="spot"] span{position:absolute;left:50%;top:calc(100% + .35rem);transform:translateX(-50%);padding:.15rem .5rem;border-radius:.4rem;background:var(--vibeui-vet-002-fg);color:var(--vibeui-vet-002-bg);font-family:var(--vibeui-vet-002-font);font-weight:600;font-size:.68rem;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s}
[data-vibeui-block="vet-002"] [data-part="spot"]:hover span,[data-vibeui-block="vet-002"] [data-part="spot"]:focus-visible span{opacity:1}
[data-vibeui-block="vet-002"] [data-part="card"]{position:relative;padding:1.6rem;border-radius:1.6rem;background:var(--vibeui-vet-002-card);border:1px solid var(--vibeui-vet-002-line);box-shadow:0 30px 50px -36px rgb(0 0 0 / .4);animation:vibeui-vet-002-pop .4s cubic-bezier(.34,1.4,.64,1) both}
[data-vibeui-block="vet-002"] [data-part="card"] [data-part="tag"]{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .7rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-vet-002-accent) 14%,transparent);color:var(--vibeui-vet-002-accent);font-weight:600;font-size:.78rem}
[data-vibeui-block="vet-002"] [data-part="card"] [data-part="tag"] b{display:grid;place-items:center;width:1.2rem;height:1.2rem;border-radius:50%;background:var(--vibeui-vet-002-accent);color:var(--vibeui-vet-002-on-accent);font-family:var(--vibeui-vet-002-display);font-size:.7rem}
[data-vibeui-block="vet-002"] [data-part="card"] h3{margin:.9rem 0 0;font-family:var(--vibeui-vet-002-display);font-weight:900;font-size:1.5rem;line-height:1.1;letter-spacing:-.02em}
[data-vibeui-block="vet-002"] [data-part="card"] p{margin:.7rem 0 0;color:var(--vibeui-vet-002-muted)}
[data-vibeui-block="vet-002"] [data-part="meta"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.4rem 1.2rem;margin:1.2rem 0 0}
[data-vibeui-block="vet-002"] [data-part="price"]{font-family:var(--vibeui-vet-002-display);font-weight:900;font-size:2rem;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="vet-002"] [data-part="meta"] small{font-size:.85rem;color:var(--vibeui-vet-002-muted)}
[data-vibeui-block="vet-002"] [data-part="legend"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:1rem 0 0;padding:0;list-style:none}
[data-vibeui-block="vet-002"] [data-part="legend"] button{padding:.35rem .7rem;border:1px solid var(--vibeui-vet-002-line);border-radius:999px;background:transparent;color:var(--vibeui-vet-002-muted);font:inherit;font-size:.8rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="vet-002"] [data-part="legend"] button[aria-pressed="true"]{background:var(--vibeui-vet-002-fg);color:var(--vibeui-vet-002-bg);border-color:transparent}
[data-vibeui-block="vet-002"] [data-part="legend"] button:focus-visible{outline:2px solid var(--vibeui-vet-002-accent);outline-offset:2px}
@keyframes vibeui-vet-002-pulse{0%{transform:scale(1);opacity:.8}100%{transform:scale(2.1);opacity:0}}
@keyframes vibeui-vet-002-pop{from{opacity:0;transform:translateY(10px) scale(.96)}}
@container (min-width: 56rem){[data-vibeui-block="vet-002"] [data-part="board"]{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:2.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="vet-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_SPOTS: Vet002Spot[] = [
  { key: "ears", label: "Уши", x: 31, y: 22, service: "Чистка ушей и осмотр отоскопом", price: "900 ₽", duration: "15 минут", text: "Трясёт головой, чешет, пахнет — смотрим канал, берём мазок, чистим. Капли подберём под то, что найдём, а не «на всякий случай»." },
  { key: "eyes", label: "Глаза", x: 24, y: 17, service: "Приём офтальмолога", price: "1 800 ₽", duration: "30 минут", text: "Слезятся, покраснели, третье веко — осмотр со щелевой лампой, тест Ширмера и флюоресцеин. Без «покапайте чем-нибудь»." },
  { key: "teeth", label: "Зубы", x: 17, y: 32, service: "Чистка зубов ультразвуком", price: "от 6 900 ₽", duration: "≈ 1 час", text: "Под седацией, с полировкой и снимками. Запах изо рта — это не «порода такая», это камень. Уходит за один приём." },
  { key: "coat", label: "Шерсть и кожа", x: 52, y: 36, service: "Приём дерматолога", price: "1 600 ₽", duration: "30 минут", text: "Чешется, лысеет, перхоть — соскоб и лампа Вуда на месте. Если аллергия, поможем найти, на что именно." },
  { key: "belly", label: "Живот", x: 48, y: 60, service: "УЗИ брюшной полости", price: "2 300 ₽", duration: "25 минут", text: "Не ест, рвёт, странно сидит — смотрим сразу, без записи на завтра. Заключение и снимки пришлём в мессенджер." },
  { key: "paws", label: "Лапы и когти", x: 31, y: 86, service: "Стрижка когтей + осмотр подушечек", price: "400 ₽", duration: "10 минут", text: "Пока ждёте приём — бесплатно. Хромает — тогда к ортопеду, снимок в тот же день." },
  { key: "tail", label: "Хвост", x: 86, y: 16, service: "Приём хирурга", price: "1 500 ₽", duration: "20 минут", text: "Прищемили дверью, не поднимает, «висит» — осмотр, снимок, если надо. Хвост в порядке — всё в порядке." },
]

/** Интерактивная схема тела с хотспотами услуг. */
export function Vet002({
  eyebrow = "Карта питомца",
  title = "Ткните туда, где болит",
  lede = "Точка на схеме — услуга и цена. Не нашли своё — пишите администратору, разберёмся, к кому вести.",
  spots = DEFAULT_SPOTS,
  image = "/demo/vet/dog-profile.png",
  imageAlt = "Бигль в профиль",
  defaultSpot = "teeth",
  actionLabel = "Записаться",
  actionHref = "#contacts",
  legendLabel = "Части тела",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Vet002Props) {
  const [active, setActive] = useState(defaultSpot)
  const activeIndex = Math.max(0, spots.findIndex((spot) => spot.key === active))
  const spot = spots[activeIndex] ?? spots[0]

  const palette = {
    ...(accent ? { "--vibeui-vet-002-accent": accent } : null),
    ...(ink ? { "--vibeui-vet-002-fg": ink } : null),
    ...(background ? { "--vibeui-vet-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-vet-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="vet-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="board">
            <div>
              <div data-part="scheme">
                {image ? (
                  <img data-part="photo" src={image} alt={imageAlt} />
                ) : (
                  <svg viewBox="0 0 600 420" aria-hidden="true">
                    <ellipse cx="310" cy="402" rx="230" ry="12" fill="currentColor" opacity=".07" />
                    <path d="M150 210 C 105 190, 96 140, 128 108" fill="none" stroke="var(--vibeui-vet-002-fur)" strokeWidth="26" strokeLinecap="round" />
                    <rect x="182" y="272" width="42" height="122" rx="20" fill="var(--vibeui-vet-002-fur-dark)" />
                    <rect x="404" y="272" width="42" height="122" rx="20" fill="var(--vibeui-vet-002-fur-dark)" />
                    <ellipse cx="300" cy="235" rx="162" ry="92" fill="var(--vibeui-vet-002-fur)" />
                    <rect x="238" y="286" width="40" height="110" rx="19" fill="var(--vibeui-vet-002-fur)" />
                    <rect x="352" y="286" width="40" height="110" rx="19" fill="var(--vibeui-vet-002-fur)" />
                    <circle cx="430" cy="192" r="72" fill="var(--vibeui-vet-002-fur)" />
                    <path d="M398 172 q46 34 96 6" fill="none" stroke="var(--vibeui-vet-002-accent)" strokeWidth="12" strokeLinecap="round" />
                    <circle cx="448" cy="190" r="8" fill="var(--vibeui-vet-002-accent)" />
                    <circle cx="478" cy="125" r="62" fill="var(--vibeui-vet-002-fur)" />
                    <ellipse cx="528" cy="150" rx="42" ry="28" fill="color-mix(in oklab,var(--vibeui-vet-002-fur) 70%,#fff)" />
                    <ellipse cx="440" cy="92" rx="22" ry="44" transform="rotate(-24 440 92)" fill="var(--vibeui-vet-002-fur-dark)" />
                    <circle cx="562" cy="140" r="11" fill="var(--vibeui-vet-002-fg)" />
                    <circle cx="492" cy="112" r="6.5" fill="var(--vibeui-vet-002-fg)" />
                    <circle cx="494" cy="110" r="2" fill="#fff" />
                    <path d="M540 168 q10 8 22 0" fill="none" stroke="var(--vibeui-vet-002-fg)" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}
                {spots.map((item, index) => (
                  <button key={item.key} data-part="spot" type="button" aria-pressed={item.key === spot.key} aria-label={`${item.label}: ${item.service}`} onClick={() => setActive(item.key)} style={{ left: `${item.x}%`, top: `${item.y}%`, ["--vibeui-vet-002-i" as string]: index }}>
                    {index + 1}
                    <span aria-hidden="true">{item.label}</span>
                  </button>
                ))}
              </div>
              <ul data-part="legend" aria-label={legendLabel}>
                {spots.map((item) => (
                  <li key={item.key}>
                    <button type="button" aria-pressed={item.key === spot.key} onClick={() => setActive(item.key)}>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <article data-part="card" key={spot.key} aria-live="polite">
              <span data-part="tag">
                <b>{activeIndex + 1}</b>
                {spot.label}
              </span>
              <h3>{spot.service}</h3>
              <p>{spot.text}</p>
              <div data-part="meta">
                <span data-part="price">{spot.price}</span>
                {spot.duration ? <small>{spot.duration}</small> : null}
              </div>
              {actionLabel ? (
                <Button016
                  data-part="action"
                  label={actionLabel}
                  href={actionHref}
                  external={false}
                  size="lg"
                  tone="accent"
                  accent={accent}
                />
              ) : null}
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
