"use client"

import { useState, type CSSProperties } from "react"

export type Vet004Size = {
  key: string
  label: string
  note: string
  price: number
}

export type Vet004Extra = {
  key: string
  label: string
  price: number
}

export type Vet004Mark = {
  /** До какой длины включительно действует подпись. */
  upTo: number
  label: string
}

export type Vet004Props = {
  eyebrow?: string
  title?: string
  lede?: string
  minLength?: number
  maxLength?: number
  defaultLength?: number
  sizes?: readonly Vet004Size[]
  defaultSize?: string
  extras?: readonly Vet004Extra[]
  marks?: readonly Vet004Mark[]
  /** Фото «до» (пушистая) и «после» (стриженая) в одном ракурсе, PNG без фона. Заданы оба — вместо CSS-собаки. */
  beforeImage?: string
  afterImage?: string
  imageAlt?: string
  currency?: string
  actionLabel?: string
  actionHref?: string
  /** Единица длины, подписи ползунка и итога. */
  mmUnit?: string
  stageLabel?: string
  lengthLabel?: string
  sizeLabel?: string
  extrasLabel?: string
  summaryLine?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Груминг с ползунком: длина стрижки 3–40 мм двигает бегунок, а фото
// собаки «до» (пушистая) проявляется поверх «после» (стриженая) ровно
// на долю ползунка и чуть увеличивается — шерсть будто растёт и опадает;
// кучка на полу растёт, когда стрижёте короче. Без фото — CSS-питомец с
// кольцами шерсти из repeating-conic-gradient. Размер S/M/L и допуслуги
// чипами — цена и время считаются на лету, число в цене не прыгает
// благодаря tabular-nums.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="vet-004"]){
--vibeui-vet-004-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-vet-004-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-vet-004-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-vet-004-on-accent:oklch(from var(--vibeui-vet-004-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-vet-004-muted:color-mix(in oklab,var(--vibeui-vet-004-fg) 62%,var(--vibeui-vet-004-bg));
--vibeui-vet-004-line:color-mix(in oklab,var(--vibeui-vet-004-fg) 12%,transparent);
--vibeui-vet-004-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-vet-004-bg) 88%,#fff));
--vibeui-vet-004-fur:#d9b58a;
--vibeui-vet-004-fur-dark:#b98a58;
--vibeui-vet-004-eye:#2b241f;
--vibeui-vet-004-pink:#f2a49b;
--vibeui-vet-004-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-vet-004-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="vet-004"]{color-scheme:dark}
:where([data-vibeui-block="vet-004"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="vet-004"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="vet-004"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-vet-004-bg);color:var(--vibeui-vet-004-fg);font-family:var(--vibeui-vet-004-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="vet-004"] *{box-sizing:border-box}
[data-vibeui-block="vet-004"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2rem;align-items:center}
[data-vibeui-block="vet-004"] [data-part="eyebrow"]{margin:0 0 .7rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-vet-004-accent)}
[data-vibeui-block="vet-004"] [data-part="title"]{margin:0;font-family:var(--vibeui-vet-004-display);font-weight:900;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1;letter-spacing:-.03em}
[data-vibeui-block="vet-004"] [data-part="lede"]{margin:.9rem 0 0;max-width:30rem;color:var(--vibeui-vet-004-muted)}
[data-vibeui-block="vet-004"] [data-part="stage"]{position:relative;width:min(100%,24rem);aspect-ratio:1;margin:0 auto;container-type:inline-size;border-radius:2rem;background:color-mix(in oklab,var(--vibeui-vet-004-fg) 4%,transparent);border:1px solid var(--vibeui-vet-004-line);overflow:hidden}
[data-vibeui-block="vet-004"] [data-part="floor"]{position:absolute;left:0;right:0;bottom:0;height:22cqi;background:color-mix(in oklab,var(--vibeui-vet-004-accent) 12%,transparent);border-top:1px solid var(--vibeui-vet-004-line)}
[data-vibeui-block="vet-004"] [data-part="pile"]{position:absolute;left:50%;bottom:16cqi;width:52cqi;height:14cqi;margin-left:-26cqi;border-radius:50% 50% 40% 40% / 100% 100% 30% 30%;background:repeating-conic-gradient(from 0deg,var(--vibeui-vet-004-fur-dark) 0 6deg,var(--vibeui-vet-004-fur) 6deg 12deg);opacity:.85;transform-origin:50% 100%;transform:scale(var(--vibeui-vet-004-pile));transition:transform .4s cubic-bezier(.34,1.4,.64,1)}
[data-vibeui-block="vet-004"] [data-part="fur"]{position:absolute;left:50%;top:44cqi;width:calc(44cqi + var(--vibeui-vet-004-len) * 2);height:calc(44cqi + var(--vibeui-vet-004-len) * 2);transform:translate(-50%,-50%);border-radius:50%;background:repeating-conic-gradient(from 0deg,var(--vibeui-vet-004-fur-dark) 0 4deg,transparent 4deg 9deg);transition:width .3s cubic-bezier(.2,.8,.2,1),height .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="vet-004"] [data-part="fur"][data-layer="2"]{width:calc(44cqi + var(--vibeui-vet-004-len) * 1.5);height:calc(44cqi + var(--vibeui-vet-004-len) * 1.5);background:repeating-conic-gradient(from 5deg,var(--vibeui-vet-004-fur) 0 5deg,transparent 5deg 9deg)}
[data-vibeui-block="vet-004"] [data-part="head"]{position:absolute;left:50%;top:44cqi;width:44cqi;height:44cqi;transform:translate(-50%,-50%);border-radius:50%;background:var(--vibeui-vet-004-fur);box-shadow:inset -6cqi -4cqi 10cqi -8cqi rgb(0 0 0 / .2)}
[data-vibeui-block="vet-004"] [data-part="ear"]{position:absolute;top:24cqi;width:12cqi;height:calc(20cqi + var(--vibeui-vet-004-len) * .6);border-radius:50% 50% 50% 50% / 30% 30% 60% 60%;background:var(--vibeui-vet-004-fur-dark);transition:height .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="vet-004"] [data-part="ear"][data-side="l"]{left:24cqi;transform:rotate(12deg)}
[data-vibeui-block="vet-004"] [data-part="ear"][data-side="r"]{right:24cqi;transform:rotate(-12deg)}
[data-vibeui-block="vet-004"] [data-part="eye"]{position:absolute;top:38cqi;width:5cqi;height:6cqi;border-radius:50%;background:var(--vibeui-vet-004-eye)}
[data-vibeui-block="vet-004"] [data-part="eye"]::after{content:"";position:absolute;left:20%;top:12%;width:35%;height:35%;border-radius:50%;background:#fff}
[data-vibeui-block="vet-004"] [data-part="eye"][data-side="l"]{left:40cqi}
[data-vibeui-block="vet-004"] [data-part="eye"][data-side="r"]{right:40cqi}
[data-vibeui-block="vet-004"] [data-part="nose"]{position:absolute;left:50%;top:48cqi;width:7cqi;height:5.5cqi;margin-left:-3.5cqi;border-radius:50% 50% 55% 55% / 45% 45% 60% 60%;background:var(--vibeui-vet-004-eye)}
[data-vibeui-block="vet-004"] [data-part="tongue"]{position:absolute;left:50%;top:54cqi;width:6cqi;height:7cqi;margin-left:-3cqi;border-radius:40% 40% 50% 50% / 30% 30% 50% 50%;background:var(--vibeui-vet-004-pink);transform-origin:50% 0;animation:vibeui-vet-004-pant 1.1s ease-in-out infinite}
[data-vibeui-block="vet-004"] [data-part="scissors"]{position:absolute;right:8cqi;top:8cqi;width:14cqi;height:14cqi;color:var(--vibeui-vet-004-accent);animation:vibeui-vet-004-snip 1.6s ease-in-out infinite;transform-origin:20% 80%}
[data-vibeui-block="vet-004"] [data-part="badge"]{position:absolute;left:1rem;top:1rem;padding:.3rem .7rem;border-radius:.5rem;background:var(--vibeui-vet-004-card);border:1px solid var(--vibeui-vet-004-line);font-family:var(--vibeui-vet-004-display);font-weight:800;font-size:.8rem;transform:rotate(-3deg)}
[data-vibeui-block="vet-004"] [data-part="panel"]{display:grid;gap:1.3rem;padding:1.5rem;border-radius:1.6rem;background:var(--vibeui-vet-004-card);border:1px solid var(--vibeui-vet-004-line)}
[data-vibeui-block="vet-004"] [data-part="row"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;font-size:.9rem;font-weight:600}
[data-vibeui-block="vet-004"] [data-part="row"] output{font-family:var(--vibeui-vet-004-display);font-weight:900;font-size:1.5rem;letter-spacing:-.02em;font-variant-numeric:tabular-nums;text-align:right}
[data-vibeui-block="vet-004"] [data-part="row"] output small{display:block;font-family:var(--vibeui-vet-004-font);font-weight:500;font-size:.8rem;color:var(--vibeui-vet-004-muted)}
[data-vibeui-block="vet-004"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.6rem;margin:0;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-vet-004-accent) var(--vibeui-vet-004-fill),var(--vibeui-vet-004-line) var(--vibeui-vet-004-fill));outline:none;cursor:pointer}
[data-vibeui-block="vet-004"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.6rem;height:1.6rem;border-radius:50%;background:var(--vibeui-vet-004-card);border:3px solid var(--vibeui-vet-004-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-vet-004-accent) 18%,transparent);cursor:grab}
[data-vibeui-block="vet-004"] [data-part="range"]::-moz-range-thumb{width:1.6rem;height:1.6rem;border-radius:50%;background:var(--vibeui-vet-004-card);border:3px solid var(--vibeui-vet-004-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-vet-004-accent) 18%,transparent);cursor:grab}
[data-vibeui-block="vet-004"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-vet-004-accent) 40%,transparent)}
[data-vibeui-block="vet-004"] [data-part="label"]{margin:0;font-size:.85rem;font-weight:600}
[data-vibeui-block="vet-004"] [data-part="sizes"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5rem;margin:.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="vet-004"] [data-part="sizes"] button{width:100%;display:grid;gap:.1rem;padding:.7rem .6rem;border:1px solid var(--vibeui-vet-004-line);border-radius:1rem;background:transparent;color:var(--vibeui-vet-004-fg);font:inherit;text-align:left;cursor:pointer;transition:background .2s,color .2s,border-color .2s,transform .2s cubic-bezier(.34,1.56,.64,1)}
[data-vibeui-block="vet-004"] [data-part="sizes"] button b{font-family:var(--vibeui-vet-004-display);font-weight:900;font-size:1.1rem}
[data-vibeui-block="vet-004"] [data-part="sizes"] button small{font-size:.72rem;color:var(--vibeui-vet-004-muted)}
[data-vibeui-block="vet-004"] [data-part="sizes"] button[aria-pressed="true"]{background:var(--vibeui-vet-004-fg);color:var(--vibeui-vet-004-bg);border-color:transparent;transform:scale(1.03)}
[data-vibeui-block="vet-004"] [data-part="sizes"] button[aria-pressed="true"] small{color:color-mix(in oklab,var(--vibeui-vet-004-bg) 70%,var(--vibeui-vet-004-fg))}
[data-vibeui-block="vet-004"] [data-part="extras"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0 0;padding:0;list-style:none}
[data-vibeui-block="vet-004"] [data-part="extras"] button{display:inline-flex;align-items:center;gap:.4rem;padding:.45rem .85rem;border:1px solid var(--vibeui-vet-004-line);border-radius:999px;background:transparent;color:var(--vibeui-vet-004-fg);font:inherit;font-size:.85rem;font-weight:500;cursor:pointer;transition:background .2s,color .2s,border-color .2s}
[data-vibeui-block="vet-004"] [data-part="extras"] button small{color:var(--vibeui-vet-004-muted);font-size:.78rem}
[data-vibeui-block="vet-004"] [data-part="extras"] button[aria-pressed="true"]{background:var(--vibeui-vet-004-accent);color:var(--vibeui-vet-004-on-accent);border-color:transparent}
[data-vibeui-block="vet-004"] [data-part="extras"] button[aria-pressed="true"] small{color:inherit;opacity:.8}
[data-vibeui-block="vet-004"] button:focus-visible{outline:2px solid var(--vibeui-vet-004-accent);outline-offset:2px}
[data-vibeui-block="vet-004"] [data-part="total"]{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.8rem;padding-top:1.2rem;border-top:1px dashed var(--vibeui-vet-004-line)}
[data-vibeui-block="vet-004"] [data-part="total"] b{font-family:var(--vibeui-vet-004-display);font-weight:900;font-size:2rem;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="vet-004"] [data-part="total"] b small{display:block;font-family:var(--vibeui-vet-004-font);font-weight:500;font-size:.8rem;color:var(--vibeui-vet-004-muted);letter-spacing:0;margin-top:.3rem}
[data-vibeui-block="vet-004"] [data-part="action"]{display:inline-flex;align-items:center;padding:.8rem 1.3rem;border-radius:999px;background:var(--vibeui-vet-004-accent);color:var(--vibeui-vet-004-on-accent);text-decoration:none;font-family:var(--vibeui-vet-004-display);font-weight:800;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s}
[data-vibeui-block="vet-004"] [data-part="action"]:hover{transform:translateY(-2px);box-shadow:0 12px 26px -12px var(--vibeui-vet-004-accent)}
[data-vibeui-block="vet-004"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-vet-004-fg);outline-offset:2px}
@keyframes vibeui-vet-004-pant{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.8)}}
@keyframes vibeui-vet-004-snip{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}
@container (min-width: 60rem){[data-vibeui-block="vet-004"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:3rem}}
[data-vibeui-block="vet-004"] [data-part="dog"]{position:absolute;left:10%;right:10%;top:4%;bottom:20cqi;z-index:2;filter:drop-shadow(0 16px 16px rgb(0 0 0 / .22))}
[data-vibeui-block="vet-004"] [data-vibeui-block="vet-004"] [data-part="dog"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:50% 100%;transform-origin:50% 100%;transition:opacity .35s ease-out,transform .5s cubic-bezier(.34,1.4,.64,1)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="vet-004"] *{animation:none!important;transition:none!important}}`

const DEFAULT_SIZES: Vet004Size[] = [
  { key: "s", label: "S", note: "до 5 кг", price: 2200 },
  { key: "m", label: "M", note: "5–15 кг", price: 3200 },
  { key: "l", label: "L", note: "от 15 кг", price: 4500 },
]

const DEFAULT_EXTRAS: Vet004Extra[] = [
  { key: "wash", label: "Мытьё и сушка", price: 900 },
  { key: "nails", label: "Когти", price: 350 },
  { key: "ears", label: "Уши", price: 400 },
  { key: "teeth", label: "Зубы щёткой", price: 500 },
  { key: "mats", label: "Колтуны", price: 800 },
]

const DEFAULT_MARKS: Vet004Mark[] = [
  { upTo: 5, label: "под машинку — лето и колтуны" },
  { upTo: 12, label: "коротко и аккуратно" },
  { upTo: 25, label: "модельная, как в журнале" },
  { upTo: 99, label: "только помыть и подровнять" },
]

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

/** Груминг: ползунок длины стрижки с CSS-питомцем и калькулятором. */
export function Vet004({
  eyebrow = "Груминг",
  title = "Покрутите — и увидите, что получится",
  lede = "Длина стрижки, размер собаки и допуслуги — цена считается сразу. Грумер посмотрит на шерсть и скажет, если план стоит поменять.",
  minLength = 3,
  maxLength = 40,
  defaultLength = 12,
  sizes = DEFAULT_SIZES,
  defaultSize = "m",
  extras = DEFAULT_EXTRAS,
  marks = DEFAULT_MARKS,
  beforeImage = "/demo/vet/dog-fluffy.png",
  afterImage = "/demo/vet/dog-trimmed.png",
  imageAlt = "Шпиц до и после стрижки",
  currency = "₽",
  actionLabel = "Записать на стрижку",
  actionHref = "#contacts",
  mmUnit = "мм",
  stageLabel = "Собака со стрижкой {n} мм",
  lengthLabel = "Длина шерсти после стрижки",
  sizeLabel = "Размер",
  extrasLabel = "Добавить",
  summaryLine = "≈ {minutes} минут · {size}, {length} мм",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Vet004Props) {
  const [length, setLength] = useState(defaultLength)
  const [sizeKey, setSizeKey] = useState(defaultSize)
  const [chosen, setChosen] = useState<readonly string[]>([])

  const size = sizes.find((item) => item.key === sizeKey) ?? sizes[0]
  const mark = marks.find((item) => length <= item.upTo) ?? marks[marks.length - 1]
  const extrasTotal = extras.filter((item) => chosen.includes(item.key)).reduce((sum, item) => sum + item.price, 0)
  const total = (size?.price ?? 0) + extrasTotal
  const minutes = 45 + Math.round(length / 2) + chosen.length * 10
  const ratio = (length - minLength) / Math.max(1, maxLength - minLength)
  const photos = Boolean(beforeImage && afterImage)

  const toggleExtra = (key: string) => {
    setChosen((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]))
  }

  const palette = {
    ...(accent ? { "--vibeui-vet-004-accent": accent } : null),
    ...(ink ? { "--vibeui-vet-004-fg": ink } : null),
    ...(background ? { "--vibeui-vet-004-bg": background } : null),
    ...style,
  } as CSSProperties

  const stageStyle = { ["--vibeui-vet-004-len" as string]: `${(1 + ratio * 9).toFixed(2)}cqi`, ["--vibeui-vet-004-pile" as string]: (0.15 + (1 - ratio) * 0.85).toFixed(2) } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-vet-004" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="vet-004" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="stage" style={stageStyle} role="img" aria-label={photos ? `${imageAlt}: ${length} ${mmUnit}` : stageLabel.replace("{n}", String(length))}>
              <span data-part="badge">{mark?.label}</span>
              <svg data-part="scissors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
              </svg>
              <i data-part="floor" />
              {photos ? (
                <div data-part="dog">
                  <img data-part="after" src={afterImage} alt="" />
                  <img data-part="before" src={beforeImage} alt="" style={{ opacity: ratio, transform: `scale(${(0.92 + ratio * 0.08).toFixed(3)})` }} />
                </div>
              ) : (
                <>
                  <i data-part="pile" />
                  <i data-part="fur" data-layer="1" />
                  <i data-part="fur" data-layer="2" />
                  <i data-part="ear" data-side="l" />
                  <i data-part="ear" data-side="r" />
                  <i data-part="head" />
                  <i data-part="eye" data-side="l" />
                  <i data-part="eye" data-side="r" />
                  <i data-part="tongue" />
                  <i data-part="nose" />
                </>
              )}
            </div>
          </div>
          <div data-part="panel">
            <div>
              <label data-part="row" htmlFor="vibeui-vet-004-range">
                <span>{lengthLabel}</span>
                <output htmlFor="vibeui-vet-004-range">
                  {length} {mmUnit}
                  <small>{mark?.label}</small>
                </output>
              </label>
              <input data-part="range" id="vibeui-vet-004-range" type="range" min={minLength} max={maxLength} value={length} onChange={(event) => setLength(Number(event.target.value))} style={{ ["--vibeui-vet-004-fill" as string]: `${ratio * 100}%` }} />
            </div>
            <div>
              <p data-part="label">{sizeLabel}</p>
              <ul data-part="sizes">
                {sizes.map((item) => (
                  <li key={item.key}>
                    <button type="button" aria-pressed={item.key === size?.key} onClick={() => setSizeKey(item.key)}>
                      <b>{item.label}</b>
                      <small>{item.note}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {extras.length > 0 ? (
              <div>
                <p data-part="label">{extrasLabel}</p>
                <ul data-part="extras">
                  {extras.map((item) => (
                    <li key={item.key}>
                      <button type="button" aria-pressed={chosen.includes(item.key)} onClick={() => toggleExtra(item.key)}>
                        {item.label}
                        <small>+{formatMoney(item.price, currency)}</small>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div data-part="total" aria-live="polite">
              <b>
                {formatMoney(total, currency)}
                <small>{summaryLine.replace("{minutes}", String(minutes)).replace("{size}", size?.label ?? "").replace("{length}", String(length))}</small>
              </b>
              {actionLabel ? (
                <a data-part="action" href={actionHref}>
                  {actionLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
