"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type House002Option = { label: string; note?: string; /** ₽ за м² или фиксированная сумма — см. поле `per`. */ rate: number; weeks?: number }

export type House002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  areaLabel?: string
  minArea?: number
  maxArea?: number
  defaultArea?: number
  packageLabel?: string
  packages?: readonly House002Option[]
  foundationLabel?: string
  foundations?: readonly House002Option[]
  roofLabel?: string
  roofs?: readonly House002Option[]
  totalLabel?: string
  perMeterLabel?: string
  termLabel?: string
  weekShort?: string
  currency?: string
  /** Локаль форматирования сумм: "ru-RU" или "en-US". */
  locale?: string
  areaUnit?: string
  submitLabel?: string
  sentLabel?: string
  note?: string
  /** Имя CustomEvent, которое ловит форма заявки. */
  eventName?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Калькулятор стоимости дома: площадь ползунком, комплектация, фундамент
// и кровля. Слева силуэт дома растёт вместе с площадью и подсвечивает окна
// по комплектации, справа итог докручивается до новой суммы, ниже —
// полосы состава цены. «Отправить расчёт» шлёт CustomEvent с итогом, его
// подхватывает форма заявки на той же странице.
const FONTS = "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const S = '[data-vibeui-block="house-002"]'
const STYLES = `
:where(${S}){
--vibeui-house-002-bg:light-dark(#ebe7e0,#121315);
--vibeui-house-002-fg:light-dark(#16181a,#f2efe9);
--vibeui-house-002-panel:light-dark(#ffffff,#1a1c1f);
--vibeui-house-002-accent:#e8a35c;
--vibeui-house-002-on-accent:oklch(from var(--vibeui-house-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-house-002-muted:color-mix(in oklab,var(--vibeui-house-002-fg) 58%,transparent);
--vibeui-house-002-line:color-mix(in oklab,var(--vibeui-house-002-fg) 12%,transparent);
--vibeui-house-002-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-house-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) ${S}{color-scheme:dark}
:where(${S}[data-tone="light"]){color-scheme:light}
:where(${S}[data-tone="dark"]){color-scheme:dark}
${S}{position:relative;overflow:hidden;padding:clamp(4rem,9cqi,7.5rem) 0;background:var(--vibeui-house-002-bg);color:var(--vibeui-house-002-fg);font-family:var(--vibeui-house-002-font)}
${S}::before{content:"";position:absolute;top:-20rem;right:-12rem;width:44rem;height:44rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-house-002-accent) 22%,transparent),transparent 65%);filter:blur(20px);pointer-events:none}
${S} *{box-sizing:border-box}
${S} [data-part="shell"]{position:relative;max-width:90rem;margin:0 auto;padding:0 clamp(1rem,3cqi,2.5rem)}
${S} [data-part="eyebrow"]{display:flex;align-items:center;gap:.7rem;margin:0 0 1rem;font-family:var(--vibeui-house-002-mono);font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-house-002-muted)}
${S} [data-part="eyebrow"]::before{content:"";width:1.6rem;height:1px;background:var(--vibeui-house-002-accent)}
${S} [data-part="title"]{margin:0;max-width:18ch;font-weight:300;font-size:clamp(2.2rem,5.6cqi,4.6rem);line-height:1;letter-spacing:-.04em}
${S} [data-part="lede"]{max-width:38rem;margin:1.1rem 0 0;color:var(--vibeui-house-002-muted)}
${S} [data-part="grid"]{display:grid;gap:1rem;margin-top:2.5rem}
${S} [data-part~="panel"]{padding:clamp(1.1rem,2.4cqi,2rem);border:1px solid var(--vibeui-house-002-line);border-radius:1.6rem;background:var(--vibeui-house-002-panel)}
${S} [data-part="field"]{margin:0;padding:0;border:0;min-width:0}
${S} [data-part="field"]+[data-part="field"]{margin-top:1.6rem}
${S} [data-part="label"]{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.8rem;font-size:.8rem;color:var(--vibeui-house-002-muted)}
${S} [data-part="label"] output{font-family:var(--vibeui-house-002-mono);font-size:1.5rem;color:var(--vibeui-house-002-fg)}
${S} [data-part="range"]{--vibeui-house-002-p:50%;width:100%;height:2rem;margin:0;background:transparent;-webkit-appearance:none;appearance:none;cursor:pointer}
${S} [data-part="range"]::-webkit-slider-runnable-track{height:.3rem;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-house-002-accent) var(--vibeui-house-002-p),var(--vibeui-house-002-line) var(--vibeui-house-002-p))}
${S} [data-part="range"]::-moz-range-track{height:.3rem;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-house-002-accent) var(--vibeui-house-002-p),var(--vibeui-house-002-line) var(--vibeui-house-002-p))}
${S} [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.6rem;height:1.6rem;margin-top:-.65rem;border:5px solid var(--vibeui-house-002-panel);border-radius:50%;background:var(--vibeui-house-002-fg);box-shadow:0 0 0 1px var(--vibeui-house-002-line),0 6px 18px -4px rgb(0 0 0 / .5);transition:transform .25s}
${S} [data-part="range"]::-moz-range-thumb{width:1.1rem;height:1.1rem;border:5px solid var(--vibeui-house-002-panel);border-radius:50%;background:var(--vibeui-house-002-fg)}
${S} [data-part="range"]:active::-webkit-slider-thumb{transform:scale(1.15)}
${S} [data-part="ticks"]{display:flex;justify-content:space-between;font-family:var(--vibeui-house-002-mono);font-size:.62rem;color:var(--vibeui-house-002-muted)}
${S} [data-part="options"]{display:grid;gap:.45rem}
${S} [data-part="option"]{display:flex;align-items:center;justify-content:space-between;gap:.8rem;width:100%;padding:.8rem 1rem;border:1px solid var(--vibeui-house-002-line);border-radius:1rem;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;transition:border-color .3s,background-color .3s}
${S} [data-part="option"]:hover{border-color:color-mix(in oklab,var(--vibeui-house-002-fg) 28%,transparent)}
${S} [data-part="option"][aria-pressed="true"]{border-color:var(--vibeui-house-002-accent);background:color-mix(in oklab,var(--vibeui-house-002-accent) 10%,transparent)}
${S} [data-part="option"] b{display:block;font-size:.9rem;font-weight:600}
${S} [data-part="option"] small{display:block;font-size:.72rem;color:var(--vibeui-house-002-muted)}
${S} [data-part="option"] i{flex:none;width:1.1rem;height:1.1rem;border:1px solid var(--vibeui-house-002-line);border-radius:50%;transition:border-width .3s,border-color .3s}
${S} [data-part="option"][aria-pressed="true"] i{border:5px solid var(--vibeui-house-002-accent)}
${S} [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.4rem}
${S} [data-part="chip"]{padding:.55rem .95rem;border:1px solid var(--vibeui-house-002-line);border-radius:999px;background:transparent;color:var(--vibeui-house-002-muted);font:inherit;font-size:.8rem;cursor:pointer;transition:all .3s}
${S} [data-part="chip"][aria-pressed="true"]{background:var(--vibeui-house-002-fg);border-color:transparent;color:var(--vibeui-house-002-bg)}
${S} [data-part~="result"]{position:relative;display:flex;flex-direction:column;overflow:hidden}
${S} [data-part="house"]{display:block;width:100%;height:auto;max-height:13rem;margin:0 auto 1rem;color:var(--vibeui-house-002-fg)}
${S} [data-part="house"] [data-part="body"]{transition:transform .8s cubic-bezier(.2,.8,.2,1);transform-origin:50% 100%;transform-box:fill-box}
${S} [data-part="house"] rect[data-window]{fill:var(--vibeui-house-002-line);transition:fill .6s,filter .6s}
${S} [data-part="house"] rect[data-window][data-lit="true"]{fill:var(--vibeui-house-002-accent);filter:drop-shadow(0 0 6px var(--vibeui-house-002-accent))}
${S} [data-part="total-label"]{font-size:.8rem;color:var(--vibeui-house-002-muted)}
${S} [data-part="total"]{margin:.25rem 0 0;font-family:var(--vibeui-house-002-mono);font-size:clamp(2rem,4.6cqi,3.4rem);font-weight:500;letter-spacing:-.04em;font-variant-numeric:tabular-nums;line-height:1}
${S} [data-part="facts"]{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:1.2rem 0 0}
${S} [data-part="facts"] div{padding:.75rem .9rem;border:1px solid var(--vibeui-house-002-line);border-radius:1rem}
${S} [data-part="facts"] dt{font-size:.7rem;color:var(--vibeui-house-002-muted)}
${S} [data-part="facts"] dd{margin:.15rem 0 0;font-family:var(--vibeui-house-002-mono);font-size:1rem;font-variant-numeric:tabular-nums}
${S} [data-part="bars"]{display:grid;gap:.6rem;margin:1.3rem 0 0;padding:0;list-style:none}
${S} [data-part="bars"] li{display:grid;grid-template-columns:1fr auto;gap:.3rem .8rem;font-size:.75rem;color:var(--vibeui-house-002-muted)}
${S} [data-part="bars"] li span:last-of-type{font-family:var(--vibeui-house-002-mono);color:var(--vibeui-house-002-fg)}
${S} [data-part="bars"] li i{grid-column:1/-1;display:block;height:.25rem;border-radius:999px;background:var(--vibeui-house-002-line);overflow:hidden}
${S} [data-part="bars"] li i b{display:block;height:100%;border-radius:inherit;background:var(--vibeui-house-002-accent);transition:width .8s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="submit"]{display:flex;align-items:center;justify-content:space-between;width:100%;height:3.2rem;margin-top:1.5rem;padding:0 .45rem 0 1.3rem;border:0;border-radius:999px;background:var(--vibeui-house-002-accent);color:var(--vibeui-house-002-on-accent);font:inherit;font-weight:600;cursor:pointer;transition:filter .3s}
${S} [data-part="submit"] i{display:grid;place-items:center;width:2.3rem;height:2.3rem;border-radius:50%;background:var(--vibeui-house-002-on-accent);color:var(--vibeui-house-002-accent);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="submit"]:hover i{transform:rotate(45deg)}
${S} [data-part="submit"] svg{width:1rem;height:1rem}
${S} [data-part="note"]{margin:.8rem 0 0;font-size:.72rem;color:var(--vibeui-house-002-muted)}
${S} button:focus-visible,${S} input:focus-visible{outline:2px solid var(--vibeui-house-002-accent);outline-offset:2px}
@container (min-width: 60rem){${S} [data-part="grid"]{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:1.25rem}}
@media (prefers-reduced-motion:reduce){${S} *{transition:none!important}}
${S} [data-part="submit"]{position:relative;isolation:isolate;overflow:hidden;transition:color .55s cubic-bezier(.2,.8,.2,1),transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .5s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="submit"]::before{content:"";position:absolute;z-index:-1;right:.45rem;top:50%;width:2rem;height:2rem;border-radius:50%;background:var(--vibeui-house-002-fg);transform:translateY(-50%) scale(0);transition:transform .75s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="submit"]:hover::before{transform:translateY(-50%) scale(28)}
${S} [data-part="submit"]:hover{color:var(--vibeui-house-002-bg);box-shadow:0 14px 34px -14px color-mix(in oklab,var(--vibeui-house-002-fg) 70%,transparent)}
${S} [data-part="submit"]:active{transform:scale(.965);transition-duration:.12s}
${S} [data-part="submit"] i{overflow:hidden}
${S} [data-part="submit"]:hover i{transform:none}
${S} [data-part="submit"]:hover i svg{animation:vibeui-house-002-fly .65s cubic-bezier(.6,0,.2,1)}
${S} [data-part="chip"]{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="chip"]:active{transform:scale(.95);transition-duration:.1s}
${S} [data-part="chip"][aria-pressed="true"]{animation:vibeui-house-002-pop .45s cubic-bezier(.3,1.6,.5,1)}
${S} [data-part="option"]{transition:background-color .35s,color .35s,border-color .35s,transform .3s cubic-bezier(.2,.8,.2,1)}
${S} [data-part="option"]:active{transform:scale(.95);transition-duration:.1s}
${S} [data-part="option"][aria-pressed="true"]{animation:vibeui-house-002-pop .45s cubic-bezier(.3,1.6,.5,1)}
@keyframes vibeui-house-002-fly{0%{transform:none}45%{transform:translate(140%,-140%)}46%{transform:translate(-140%,140%)}100%{transform:none}}
@keyframes vibeui-house-002-pop{0%{transform:scale(.94)}60%{transform:scale(1.04)}100%{transform:none}}
@media (prefers-reduced-motion:reduce){${S} *,${S} *::before{animation:none!important;transition:none!important}}`

const DEFAULT_PACKAGES: House002Option[] = [
  { label: "Домокомплект", note: "брус, стропила, сборка на фундаменте", rate: 38000, weeks: 10 },
  { label: "Тёплый контур", note: "+ кровля, окна, двери, утепление", rate: 52000, weeks: 16 },
  { label: "Под ключ", note: "+ инженерия, отделка, сантехника", rate: 71000, weeks: 26 },
]
const DEFAULT_FOUNDATIONS: House002Option[] = [
  { label: "Свайно-винтовой", rate: 2600 },
  { label: "Ленточный", rate: 5200 },
  { label: "Плита УШП", rate: 7400 },
]
const DEFAULT_ROOFS: House002Option[] = [
  { label: "Гибкая черепица", rate: 3100 },
  { label: "Металлочерепица", rate: 2400 },
  { label: "Фальц", rate: 4600 },
]

function useTween(target: number) {
  const [value, setValue] = useState(target)
  const current = useRef(target)
  useEffect(() => {
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 700
    const from = current.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1
      current.current = from + (target - from) * (1 - Math.pow(1 - t, 3))
      setValue(current.current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return value
}

/** Калькулятор стоимости дома из бруса с силуэтом, который растёт с площадью. */
export function House002({
  eyebrow = "Стоимость",
  title = "Посчитайте дом за минуту",
  lede = "Цена фиксируется в договоре и не растёт по ходу стройки. Калькулятор считает по нашим ценам этого сезона.",
  areaLabel = "Площадь дома",
  minArea = 60,
  maxArea = 320,
  defaultArea = 160,
  packageLabel = "Комплектация",
  packages = DEFAULT_PACKAGES,
  foundationLabel = "Фундамент",
  foundations = DEFAULT_FOUNDATIONS,
  roofLabel = "Кровля",
  roofs = DEFAULT_ROOFS,
  totalLabel = "Ориентировочная стоимость",
  perMeterLabel = "За м²",
  termLabel = "Срок",
  weekShort = "нед",
  currency = "₽",
  locale = "ru-RU",
  areaUnit = "м²",
  submitLabel = "Отправить расчёт",
  sentLabel = "Расчёт в форме заявки ↓",
  note = "Точная смета — после выезда на участок, бесплатно.",
  eventName = "vibeui-house:estimate",
  tone = "dark",
  accent,
  ink,
  background,
  className,
  style,
}: House002Props) {
  const [area, setArea] = useState(defaultArea)
  const [pack, setPack] = useState(Math.min(2, packages.length - 1))
  const [foundation, setFoundation] = useState(0)
  const [roof, setRoof] = useState(0)
  const [sent, setSent] = useState(false)
  const money = (value: number) => Math.round(value).toLocaleString(locale)
  const price = (value: number) => (locale.startsWith("en") ? `${currency}${money(value)}` : `${money(value)} ${currency}`)

  const parts = [
    { label: packages[pack]?.label ?? "", value: area * (packages[pack]?.rate ?? 0) },
    { label: foundations[foundation]?.label ?? "", value: area * (foundations[foundation]?.rate ?? 0) },
    { label: roofs[roof]?.label ?? "", value: area * (roofs[roof]?.rate ?? 0) },
  ]
  const total = parts.reduce((sum, part) => sum + part.value, 0)
  const weeks = Math.round((packages[pack]?.weeks ?? 16) * (0.75 + (area / maxArea) * 0.4))
  const shown = useTween(total)
  const percent = ((area - minArea) / (maxArea - minArea)) * 100
  const scale = 0.62 + (percent / 100) * 0.38
  const lit = pack + 1

  const send = () => {
    window.dispatchEvent(new CustomEvent(eventName, { detail: { area, package: packages[pack]?.label, total, text: `${area} ${areaUnit} · ${packages[pack]?.label} · ${price(total)}` } }))
    setSent(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-house-002-accent": accent } : null),
    ...(ink ? { "--vibeui-house-002-fg": ink } : null),
    ...(background ? { "--vibeui-house-002-bg": background } : null),
    ...style,
  } as CSSProperties

  const windows = [
    [44, 112], [74, 112], [126, 112], [156, 112],
    [58, 80], [142, 80], [100, 60],
  ]

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-house-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="house-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">{title}</h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div data-part="panel">
              <div data-part="field">
                <label data-part="label" htmlFor="vibeui-house-002-area">
                  {areaLabel}
                  <output htmlFor="vibeui-house-002-area">
                    {area} {areaUnit}
                  </output>
                </label>
                <input id="vibeui-house-002-area" data-part="range" type="range" min={minArea} max={maxArea} step={2} value={area} onChange={(event) => { setArea(Number(event.target.value)); setSent(false) }} style={{ ["--vibeui-house-002-p" as string]: `${percent}%` }} />
                <div data-part="ticks" aria-hidden="true">
                  <span>{minArea}</span>
                  <span>{Math.round((minArea + maxArea) / 2)}</span>
                  <span>{maxArea}</span>
                </div>
              </div>
              <fieldset data-part="field">
                <legend data-part="label">{packageLabel}</legend>
                <div data-part="options">
                  {packages.map((option, optionIndex) => (
                    <button key={option.label} data-part="option" type="button" aria-pressed={optionIndex === pack} onClick={() => { setPack(optionIndex); setSent(false) }}>
                      <span>
                        <b>{option.label}</b>
                        {option.note ? <small>{option.note}</small> : null}
                      </span>
                      <i aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset data-part="field">
                <legend data-part="label">{foundationLabel}</legend>
                <div data-part="chips">
                  {foundations.map((option, optionIndex) => (
                    <button key={option.label} data-part="chip" type="button" aria-pressed={optionIndex === foundation} onClick={() => { setFoundation(optionIndex); setSent(false) }}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset data-part="field">
                <legend data-part="label">{roofLabel}</legend>
                <div data-part="chips">
                  {roofs.map((option, optionIndex) => (
                    <button key={option.label} data-part="chip" type="button" aria-pressed={optionIndex === roof} onClick={() => { setRoof(optionIndex); setSent(false) }}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div data-part="panel result" aria-live="polite">
              <svg data-part="house" viewBox="0 0 200 150" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true">
                <path d="M0 146h200" opacity=".35" />
                <g data-part="body" style={{ transform: `scale(${scale})` }}>
                  <path d="M20 146V92L100 34l80 58v54Z" />
                  <path d="M10 99 100 30l90 69" strokeWidth="2" />
                  {[104, 118, 132].map((y) => (
                    <path key={y} d={`M20 ${y}h160`} opacity=".18" />
                  ))}
                  <path d="M88 146v-26h24v26" />
                  {windows.map(([x, y], windowIndex) => (
                    <rect key={windowIndex} data-window="" data-lit={windowIndex < lit * 2 + (lit === 3 ? 1 : 0)} x={x - 7} y={y - 9} width="14" height="18" rx="1" stroke="none" />
                  ))}
                </g>
              </svg>
              <span data-part="total-label">{totalLabel}</span>
              <p data-part="total">
                {price(shown)}
              </p>
              <dl data-part="facts">
                <div>
                  <dt>{perMeterLabel}</dt>
                  <dd>
                    {price(total / area)}
                  </dd>
                </div>
                <div>
                  <dt>{termLabel}</dt>
                  <dd>
                    {weeks} {weekShort}
                  </dd>
                </div>
              </dl>
              <ul data-part="bars">
                {parts.map((part) => (
                  <li key={part.label}>
                    <span>{part.label}</span>
                    <span>{money(part.value)}</span>
                    <i>
                      <b style={{ width: `${total ? (part.value / total) * 100 : 0}%` }} />
                    </i>
                  </li>
                ))}
              </ul>
              <button data-part="submit" type="button" onClick={send}>
                {sent ? sentLabel : submitLabel}
                <i aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M5 11 11 5M6 5h5v5" />
                  </svg>
                </i>
              </button>
              {note ? <p data-part="note">{note}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
