"use client"

import { useRef, useState, type CSSProperties, type PointerEvent } from "react"

export type Hero034Zone = {
  /** Часть машины, на которую наводят. */
  id: "hood" | "lights" | "wheels" | "body" | "glass"
  label: string
  service: string
  price: string
  note?: string
}

export type Hero034Props = {
  eyebrow?: string
  /** Строки заголовка: каждая въезжает отдельно. */
  title?: readonly string[]
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Подсказка, пока ни одна зона не выбрана. */
  hint?: string
  zones?: readonly Hero034Zone[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро детейлинга: слева строки заголовка въезжают из масок, магнитная
// кнопка «Рассчитать» тянется к курсору; справа силуэт купе из svg-контура
// «прорисовывается» через stroke-dashoffset — кузов, стёкла, диски по
// очереди. Зоны машины (капот, фары, диски, кузов, салон) живые: по
// наведению или тапу зона заливается акцентом, а под машиной крупно
// выводится услуга и цена. Те же зоны продублированы чипами — для
// клавиатуры и телефона. Зерно сверху — svg feTurbulence.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-034"]){
--vibeui-hero-034-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-034-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-034-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-034-on-accent:oklch(from var(--vibeui-hero-034-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-034-muted:color-mix(in oklab,var(--vibeui-hero-034-fg) 60%,var(--vibeui-hero-034-bg));
--vibeui-hero-034-line:color-mix(in oklab,var(--vibeui-hero-034-fg) 14%,transparent);
--vibeui-hero-034-glass:color-mix(in oklab,var(--vibeui-hero-034-fg) 5%,transparent);
--vibeui-hero-034-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-034-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-034-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-034"]{color-scheme:dark}
:where([data-vibeui-block="hero-034"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-034"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-034"]{box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate;padding:4rem 0 3.5rem;background:var(--vibeui-hero-034-bg);color:var(--vibeui-hero-034-fg);font-family:var(--vibeui-hero-034-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-034"] *{box-sizing:border-box}
[data-vibeui-block="hero-034"] [data-part="grid-bg"]{position:absolute;inset:0;z-index:-2;background-image:linear-gradient(var(--vibeui-hero-034-line) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-hero-034-line) 1px,transparent 1px);background-size:4rem 4rem;mask-image:radial-gradient(ellipse 70% 60% at 70% 50%,#000 20%,transparent 80%);opacity:.5}
[data-vibeui-block="hero-034"] [data-part="glow"]{position:absolute;z-index:-2;right:-10%;top:10%;width:50%;aspect-ratio:1;border-radius:50%;background:var(--vibeui-hero-034-accent);filter:blur(120px);opacity:.14;pointer-events:none}
[data-vibeui-block="hero-034"] [data-part="grain"]{position:absolute;inset:0;z-index:-1;opacity:.07;pointer-events:none;mix-blend-mode:overlay}
[data-vibeui-block="hero-034"] [data-part="shell"]{position:relative;max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-034"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1.4rem;font-family:var(--vibeui-hero-034-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-hero-034-accent)}
[data-vibeui-block="hero-034"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-hero-034-accent)}
[data-vibeui-block="hero-034"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-034-display);font-weight:900;font-size:clamp(2.2rem,6.2cqi,5.2rem);line-height:.98;letter-spacing:-.035em;text-transform:uppercase}
[data-vibeui-block="hero-034"] [data-part="line"]{display:block;overflow:hidden;padding-bottom:.06em;margin-bottom:-.06em}
[data-vibeui-block="hero-034"] [data-part="line"] span{display:block;transform:translateY(110%);animation:vibeui-hero-034-rise .9s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--vibeui-hero-034-i) * .12s + .1s)}
[data-vibeui-block="hero-034"] [data-part="line"]:last-child span{color:var(--vibeui-hero-034-accent)}
[data-vibeui-block="hero-034"] [data-part="lede"]{margin:1.4rem 0 0;max-width:30rem;font-size:1.05rem;color:var(--vibeui-hero-034-muted);opacity:0;animation:vibeui-hero-034-fade .8s ease-out .6s forwards}
[data-vibeui-block="hero-034"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.8rem;margin:2rem 0 0;opacity:0;animation:vibeui-hero-034-fade .8s ease-out .8s forwards}
[data-vibeui-block="hero-034"] [data-part="magnet"]{display:inline-block;padding:.6rem;margin:-.6rem;border-radius:1rem}
[data-vibeui-block="hero-034"] [data-part="primary"]{display:inline-flex;align-items:center;gap:.6rem;padding:1rem 1.6rem;border-radius:.7rem;background:var(--vibeui-hero-034-accent);color:var(--vibeui-hero-034-on-accent);font-weight:700;font-size:1rem;text-decoration:none;white-space:nowrap;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .3s;will-change:transform}
[data-vibeui-block="hero-034"] [data-part="primary"]:hover{box-shadow:0 18px 40px -14px var(--vibeui-hero-034-accent)}
[data-vibeui-block="hero-034"] [data-part="primary"] svg{width:1.1rem;height:1.1rem;transition:transform .3s}
[data-vibeui-block="hero-034"] [data-part="primary"]:hover svg{transform:translateX(3px)}
[data-vibeui-block="hero-034"] [data-part="secondary"]{display:inline-flex;align-items:center;padding:1rem 1.4rem;border-radius:.7rem;border:1px solid var(--vibeui-hero-034-line);color:var(--vibeui-hero-034-fg);font-weight:600;text-decoration:none;white-space:nowrap;transition:border-color .2s,background .2s}
[data-vibeui-block="hero-034"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-034-fg);background:var(--vibeui-hero-034-glass)}
[data-vibeui-block="hero-034"] a:focus-visible,[data-vibeui-block="hero-034"] button:focus-visible{outline:2px solid var(--vibeui-hero-034-accent);outline-offset:3px}
[data-vibeui-block="hero-034"] [data-part="stage"]{display:grid;gap:1rem}
[data-vibeui-block="hero-034"] [data-part="car"]{width:100%;height:auto;display:block;overflow:visible;color:var(--vibeui-hero-034-fg)}
[data-vibeui-block="hero-034"] [data-part="stroke"]{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-hero-034-draw 1.6s cubic-bezier(.4,0,.2,1) forwards;animation-delay:var(--vibeui-hero-034-d,0s)}
[data-vibeui-block="hero-034"] [data-part="stroke"][data-kind="thin"]{stroke-width:1.2;opacity:.6}
[data-vibeui-block="hero-034"] [data-part="stroke"][data-kind="ground"]{stroke:var(--vibeui-hero-034-accent);stroke-width:1.5;opacity:.5}
[data-vibeui-block="hero-034"] [data-part="zone"]{fill:var(--vibeui-hero-034-accent);fill-opacity:0;stroke:var(--vibeui-hero-034-accent);stroke-width:1.5;stroke-opacity:0;cursor:pointer;transition:fill-opacity .25s,stroke-opacity .25s;outline:none}
[data-vibeui-block="hero-034"] [data-part="zone"][data-active="true"]{fill-opacity:.28;stroke-opacity:1;filter:drop-shadow(0 0 10px var(--vibeui-hero-034-accent))}
[data-vibeui-block="hero-034"] [data-part="readout"]{display:grid;grid-template-columns:1fr auto;align-items:end;gap:.5rem 1.5rem;min-height:5.5rem;padding:1rem 1.25rem;border-radius:1rem;border:1px solid var(--vibeui-hero-034-line);background:var(--vibeui-hero-034-glass);backdrop-filter:blur(10px)}
[data-vibeui-block="hero-034"] [data-part="readout"] small{grid-column:1/-1;font-family:var(--vibeui-hero-034-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-hero-034-accent)}
[data-vibeui-block="hero-034"] [data-part="service"]{margin:0;font-family:var(--vibeui-hero-034-display);font-weight:700;font-size:clamp(1rem,2.2cqi,1.3rem);line-height:1.15;letter-spacing:-.01em}
[data-vibeui-block="hero-034"] [data-part="price"]{margin:0;font-family:var(--vibeui-hero-034-display);font-weight:900;font-size:clamp(1.4rem,3.4cqi,2.1rem);line-height:1;letter-spacing:-.03em;white-space:nowrap;font-variant-numeric:tabular-nums;color:var(--vibeui-hero-034-accent)}
[data-vibeui-block="hero-034"] [data-part="note"],[data-vibeui-block="hero-034"] [data-part="hint"]{grid-column:1/-1;margin:0;font-size:.85rem;color:var(--vibeui-hero-034-muted)}
[data-vibeui-block="hero-034"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="hero-034"] [data-part="chip"]{padding:.45rem .85rem;border-radius:999px;border:1px solid var(--vibeui-hero-034-line);background:transparent;color:var(--vibeui-hero-034-muted);font:inherit;font-size:.82rem;font-weight:500;cursor:pointer;transition:color .2s,border-color .2s,background .2s}
[data-vibeui-block="hero-034"] [data-part="chip"]:hover,[data-vibeui-block="hero-034"] [data-part="chip"][aria-pressed="true"]{color:var(--vibeui-hero-034-fg);border-color:var(--vibeui-hero-034-accent);background:color-mix(in oklab,var(--vibeui-hero-034-accent) 14%,transparent)}
@keyframes vibeui-hero-034-rise{to{transform:translateY(0)}}
@keyframes vibeui-hero-034-fade{to{opacity:1}}
@keyframes vibeui-hero-034-draw{to{stroke-dashoffset:0}}
@container (min-width: 60rem){[data-vibeui-block="hero-034"] [data-part="shell"]{grid-template-columns:minmax(0,10fr) minmax(0,11fr);gap:3rem;min-height:min(80svh,46rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-034"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-034"] [data-part="line"] span{transform:none}[data-vibeui-block="hero-034"] [data-part="lede"],[data-vibeui-block="hero-034"] [data-part="actions"]{opacity:1}[data-vibeui-block="hero-034"] [data-part="stroke"]{stroke-dashoffset:0}}`

const DEFAULT_ZONES: Hero034Zone[] = [
  { id: "body", label: "Кузов", service: "Керамика 9H, три слоя", price: "от 32 000 ₽", note: "Два дня в боксе. Гидрофоб держится 2–3 года, мойка раз в две недели." },
  { id: "hood", label: "Капот", service: "Антигравийная плёнка на фронт", price: "от 45 000 ₽", note: "Капот, бампер, зеркала, стойки. Плёнка XPEL, гарантия 10 лет." },
  { id: "lights", label: "Фары", service: "Полировка и бронирование фар", price: "от 7 000 ₽", note: "Убираем желтизну и паутинку, сверху — плёнка 200 мкм." },
  { id: "wheels", label: "Диски", service: "Чистка и керамика на диски", price: "от 5 000 ₽", note: "Снимаем, чистим тыльную сторону, кроем керамикой. Тормозная пыль отходит водой." },
  { id: "glass", label: "Салон", service: "Химчистка салона и кожи", price: "от 9 000 ₽", note: "Сиденья, потолок, ковры, пластик. Кожа — чистка и кондиционер." },
]

function ZoneShape({ id, ...rest }: { id: Hero034Zone["id"]; "data-part": string; "data-active": string; tabIndex: number; role: string; "aria-label": string; "aria-pressed": boolean; onPointerEnter: () => void; onPointerLeave: () => void; onClick: () => void; onFocus: () => void; onBlur: () => void }) {
  switch (id) {
    case "hood":
      return <path d={"M116 156 L254 146 L262 152 L262 188 L118 188 Z"} {...rest} />
    case "lights":
      return <path d="M64 154 L120 148 L122 190 L62 192 Z" {...rest} />
    case "wheels":
      return (
        <g {...rest}>
          <circle cx="200" cy="216" r="50" />
          <circle cx="614" cy="216" r="50" />
        </g>
      )
    case "body":
      return <path d="M262 152 L640 144 L698 160 L720 200 L662 210 L560 210 L520 190 L300 190 L262 210 L262 200 Z" {...rest} />
    default:
      return <path d="M260 148 L338 102 C360 94 392 92 424 92 L512 92 C562 94 604 120 646 142 Z" {...rest} />
  }
}

/** Хиро детейлинга: силуэт купе прорисовывается, зоны подсвечивают услугу и цену. */
export function Hero034({
  eyebrow = "Детейлинг-студия · Санкт-Петербург",
  title = ["Машина", "как из", "салона"],
  lede = "Керамика, антигравийная плёнка, полировка и химчистка в закрытом боксе с тёплым светом. Показываем результат до/после и говорим цену сразу.",
  primaryLabel = "Рассчитать стоимость",
  primaryHref = "#services",
  secondaryLabel = "Смотреть до / после",
  secondaryHref = "#results",
  hint = "Наведите на капот, фары, диски, кузов или салон — покажем услугу и цену",
  zones = DEFAULT_ZONES,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero034Props) {
  const [active, setActive] = useState<Hero034Zone["id"] | null>(null)
  const [pinned, setPinned] = useState<Hero034Zone["id"] | null>(null)
  const magnetRef = useRef<HTMLAnchorElement>(null)
  const current = zones.find((zone) => zone.id === (active ?? pinned)) ?? null

  const palette = {
    ...(accent ? { "--vibeui-hero-034-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-034-fg": ink } : null),
    ...(background ? { "--vibeui-hero-034-bg": background } : null),
    ...style,
  } as CSSProperties

  // Магнит: кнопка тянется к курсору внутри ореола, transform ставим напрямую,
  // чтобы не перерисовывать дерево на каждое движение мыши.
  const magnetMove = (event: PointerEvent<HTMLSpanElement>) => {
    const button = magnetRef.current
    if (!button || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    button.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`
  }
  const magnetLeave = () => {
    const button = magnetRef.current
    if (button) button.style.transform = ""
  }

  const zoneProps = (id: Hero034Zone["id"], label: string) => ({
    "data-part": "zone",
    "data-active": String((active ?? pinned) === id),
    tabIndex: -1,
    role: "button",
    "aria-label": label,
    "aria-pressed": pinned === id,
    onPointerEnter: () => setActive(id),
    onPointerLeave: () => setActive(null),
    onClick: () => setPinned((value) => (value === id ? null : id)),
    onFocus: () => setActive(id),
    onBlur: () => setActive(null),
  })

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-034" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-034" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <i data-part="grid-bg" aria-hidden="true" />
        <i data-part="glow" aria-hidden="true" />
        <svg data-part="grain" aria-hidden="true">
          <filter id="vibeui-hero-034-noise">
            <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#vibeui-hero-034-noise)" />
        </svg>
        <div data-part="shell">
          <div data-part="copy">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1 data-part="title">
              {title.map((line, index) => (
                <span key={line} data-part="line" style={{ ["--vibeui-hero-034-i" as string]: index }}>
                  <span>{line}</span>
                </span>
              ))}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <span data-part="magnet" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>
                  <a ref={magnetRef} data-part="primary" href={primaryHref}>
                    {primaryLabel}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </span>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
          </div>
          <div data-part="stage">
            <svg data-part="car" viewBox="0 0 800 300" aria-label="Силуэт автомобиля: зоны с услугами" role="img">
              <path data-part="stroke" pathLength={1} d="M58 206 C58 180 72 166 112 158 L252 146 C296 108 346 90 424 86 L522 84 C592 86 642 118 692 144 L734 154 C754 160 762 180 760 202 L752 216 L662 216 A48 48 0 0 0 566 216 L248 216 A48 48 0 0 0 152 216 L68 216 Z" />
              <path data-part="stroke" pathLength={1} d="M262 150 L338 104 C360 96 392 94 424 94 L512 94 C562 96 604 122 644 144 Z" style={{ ["--vibeui-hero-034-d" as string]: ".5s" }} />
              <path data-part="stroke" data-kind="thin" pathLength={1} d="M424 94 L426 150 M420 152 L414 212 M338 118 L322 126 L324 136 L340 134 Z M60 190 L112 186 M700 150 L742 160" style={{ ["--vibeui-hero-034-d" as string]: ".8s" }} />
              <path data-part="stroke" data-kind="thin" pathLength={1} d="M70 166 L112 158 L114 176 L74 182 Z M700 150 L736 158 L738 176 L704 172 Z" style={{ ["--vibeui-hero-034-d" as string]: "1s" }} />
              <g style={{ ["--vibeui-hero-034-d" as string]: "1.1s" }}>
                <circle data-part="stroke" pathLength={1} cx="200" cy="216" r="44" />
                <circle data-part="stroke" data-kind="thin" pathLength={1} cx="200" cy="216" r="26" />
                <path data-part="stroke" data-kind="thin" pathLength={1} d="M200 190 L200 242 M174 216 L226 216 M182 198 L218 234 M218 198 L182 234" />
              </g>
              <g style={{ ["--vibeui-hero-034-d" as string]: "1.3s" }}>
                <circle data-part="stroke" pathLength={1} cx="614" cy="216" r="44" />
                <circle data-part="stroke" data-kind="thin" pathLength={1} cx="614" cy="216" r="26" />
                <path data-part="stroke" data-kind="thin" pathLength={1} d="M614 190 L614 242 M588 216 L640 216 M596 198 L632 234 M632 198 L596 234" />
              </g>
              <path data-part="stroke" data-kind="ground" pathLength={1} d="M40 276 L760 276" style={{ ["--vibeui-hero-034-d" as string]: "1.6s" }} />
              {zones.map((zone) => (
                <ZoneShape key={zone.id} id={zone.id} {...zoneProps(zone.id, `${zone.label}: ${zone.service}, ${zone.price}`)} />
              ))}
            </svg>
            <div data-part="readout" aria-live="polite">
              {current ? (
                <>
                  <small>{current.label}</small>
                  <p data-part="service">{current.service}</p>
                  <p data-part="price">{current.price}</p>
                  {current.note ? <p data-part="note">{current.note}</p> : null}
                </>
              ) : (
                <>
                  <small>Услуги по зонам</small>
                  <p data-part="hint">
                    {hint}
                  </p>
                </>
              )}
            </div>
            <ul data-part="chips" aria-label="Зоны машины">
              {zones.map((zone) => (
                <li key={zone.id}>
                  <button data-part="chip" type="button" aria-pressed={pinned === zone.id} onPointerEnter={() => setActive(zone.id)} onPointerLeave={() => setActive(null)} onFocus={() => setActive(zone.id)} onBlur={() => setActive(null)} onClick={() => setPinned((value) => (value === zone.id ? null : zone.id))}>
                    {zone.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
