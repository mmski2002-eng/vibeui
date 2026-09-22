"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Button085 } from "@/registry/components/button/button-085/button-085"

export type Renovation001Type = {
  id: string
  name: string
  /** Цена работ за м². */
  rate: number
  /** Срок: базовые недели + недели на каждые 10 м². */
  baseWeeks: number
  weeksPer10: number
  note?: string
}

export type Renovation001Option = {
  id: string
  name: string
  /** Надбавка за м² или фиксированная сумма. */
  perM2?: number
  fixed?: number
  /** Сколько недель добавляет к сроку. */
  weeks?: number
}

export type Renovation001Props = {
  eyebrow?: string
  title?: string
  lede?: string
  minArea?: number
  maxArea?: number
  defaultArea?: number
  types?: readonly Renovation001Type[]
  defaultType?: string
  options?: readonly Renovation001Option[]
  defaultOptions?: readonly string[]
  currency?: string
  saveLabel?: string
  savedLabel?: string
  /** Имя CustomEvent, который уходит в window при сохранении сметы. */
  eventName?: string
  fine?: string
  /** Формы слова «неделя» и подписи калькулятора. */
  weekUnits?: readonly [string, string, string]
  areaUnit?: string
  areaLabel?: string
  typeLabel?: string
  fromLabel?: string
  optionsLabel?: string
  chosenLine?: string
  nothingChosen?: string
  sheetLabel?: string
  draftLabel?: string
  sheetAreaLabel?: string
  totalLabel?: string
  perLabel?: string
  termLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Калькулятор сметы ремонта: ползунок площади с делениями-рулеткой, три
// типа ремонта сегментами, опции чипами. Справа лист сметы: цена и срок в
// неделях докручиваются до нового значения через requestAnimationFrame,
// недели рисуются клетками, номер сметы считается из выбранного. Кнопка
// «Сохранить смету» шлёт в window CustomEvent с деталями — форма заявки
// на той же странице может подхватить его и прикрепить смету.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="renovation-001"]){
--vibeui-renovation-001-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-renovation-001-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-renovation-001-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-renovation-001-on-accent:oklch(from var(--vibeui-renovation-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-renovation-001-muted:color-mix(in oklab,var(--vibeui-renovation-001-fg) 62%,var(--vibeui-renovation-001-bg));
--vibeui-renovation-001-line:color-mix(in oklab,var(--vibeui-renovation-001-fg) 16%,transparent);
--vibeui-renovation-001-grid:color-mix(in oklab,var(--vibeui-renovation-001-fg) 7%,transparent);
--vibeui-renovation-001-paper:color-mix(in oklab,var(--vibeui-renovation-001-bg) 92%,var(--vibeui-renovation-001-fg));
--vibeui-renovation-001-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-renovation-001-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-renovation-001-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="renovation-001"]{color-scheme:dark}
:where([data-vibeui-block="renovation-001"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="renovation-001"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="renovation-001"]{box-sizing:border-box;padding:5rem 0;background-color:var(--vibeui-renovation-001-bg);background-image:linear-gradient(var(--vibeui-renovation-001-grid) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-renovation-001-grid) 1px,transparent 1px);background-size:5rem 5rem;color:var(--vibeui-renovation-001-fg);font-family:var(--vibeui-renovation-001-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="renovation-001"] *{box-sizing:border-box}
[data-vibeui-block="renovation-001"] [data-part="type"]{width:100%}
[data-vibeui-block="renovation-001"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="renovation-001"] [data-part="head"]{max-width:44rem;margin-bottom:2.5rem}
[data-vibeui-block="renovation-001"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1rem;font-family:var(--vibeui-renovation-001-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-renovation-001-muted)}
[data-vibeui-block="renovation-001"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-renovation-001-accent)}
[data-vibeui-block="renovation-001"] [data-part="title"]{margin:0;font-family:var(--vibeui-renovation-001-display);font-weight:800;font-size:clamp(2rem,5cqi,3.6rem);line-height:1;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="renovation-001"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-renovation-001-muted)}
[data-vibeui-block="renovation-001"] [data-part="grid"]{display:grid;gap:1.5rem;align-items:start}
[data-vibeui-block="renovation-001"] [data-part="controls"]{display:grid;gap:1.6rem}
[data-vibeui-block="renovation-001"] [data-part="field"]{display:grid;gap:.8rem;padding:1.4rem;border:1px solid var(--vibeui-renovation-001-line);background:color-mix(in oklab,var(--vibeui-renovation-001-bg) 70%,transparent)}
[data-vibeui-block="renovation-001"] [data-part="label"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin:0;font-family:var(--vibeui-renovation-001-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-renovation-001-muted)}
[data-vibeui-block="renovation-001"] [data-part="label"] output{font-family:var(--vibeui-renovation-001-display);font-weight:800;font-size:2rem;letter-spacing:-.03em;text-transform:none;color:var(--vibeui-renovation-001-fg);font-variant-numeric:tabular-nums;line-height:1}
[data-vibeui-block="renovation-001"] [data-part="label"] output small{font-family:var(--vibeui-renovation-001-mono);font-weight:500;font-size:.8rem;color:var(--vibeui-renovation-001-muted);margin-left:.3rem;letter-spacing:0}
[data-vibeui-block="renovation-001"] [data-part="ruler"]{position:relative;padding-bottom:1.1rem}
[data-vibeui-block="renovation-001"] [data-part="ruler"]::after{content:"";position:absolute;left:.7rem;right:.7rem;bottom:0;height:.8rem;background:repeating-linear-gradient(90deg,color-mix(in oklab,var(--vibeui-renovation-001-fg) 40%,transparent) 0 1px,transparent 1px 10%),repeating-linear-gradient(90deg,var(--vibeui-renovation-001-line) 0 1px,transparent 1px 2%);background-size:100% 100%,100% 45%;background-repeat:no-repeat;background-position:0 0,0 100%}
[data-vibeui-block="renovation-001"] [data-part="range"]{-webkit-appearance:none;appearance:none;width:100%;height:.4rem;margin:.5rem 0;border-radius:2px;background:linear-gradient(90deg,var(--vibeui-renovation-001-accent) var(--vibeui-renovation-001-fill),var(--vibeui-renovation-001-line) var(--vibeui-renovation-001-fill));outline:none;cursor:pointer}
[data-vibeui-block="renovation-001"] [data-part="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:1.4rem;height:1.4rem;border-radius:.2rem;background:var(--vibeui-renovation-001-fg);border:3px solid var(--vibeui-renovation-001-accent);cursor:grab;transition:transform .15s}
[data-vibeui-block="renovation-001"] [data-part="range"]::-webkit-slider-thumb:hover{transform:scale(1.1)}
[data-vibeui-block="renovation-001"] [data-part="range"]::-moz-range-thumb{width:1.4rem;height:1.4rem;border-radius:.2rem;background:var(--vibeui-renovation-001-fg);border:3px solid var(--vibeui-renovation-001-accent);cursor:grab}
[data-vibeui-block="renovation-001"] [data-part="range"]:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-renovation-001-accent) 50%,transparent)}
[data-vibeui-block="renovation-001"] [data-part="types"]{display:grid;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="renovation-001"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="renovation-001"] [data-part="chip"]{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem .9rem;border:1px solid var(--vibeui-renovation-001-line);border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.88rem;font-weight:500;cursor:pointer;transition:border-color .2s,background .2s,color .2s}
[data-vibeui-block="renovation-001"] [data-part="chip"]::before{content:"+";font-family:var(--vibeui-renovation-001-mono);font-weight:600;color:var(--vibeui-renovation-001-muted);transition:transform .25s}
[data-vibeui-block="renovation-001"] [data-part="chip"]:hover{border-color:color-mix(in oklab,var(--vibeui-renovation-001-fg) 40%,transparent)}
[data-vibeui-block="renovation-001"] [data-part="chip"][aria-pressed="true"]{border-color:var(--vibeui-renovation-001-fg);background:var(--vibeui-renovation-001-fg);color:var(--vibeui-renovation-001-bg)}
[data-vibeui-block="renovation-001"] [data-part="chip"][aria-pressed="true"]::before{color:var(--vibeui-renovation-001-accent);transform:rotate(45deg)}
[data-vibeui-block="renovation-001"] button:focus-visible{outline:2px solid var(--vibeui-renovation-001-accent);outline-offset:2px}
[data-vibeui-block="renovation-001"] [data-part="sheet"]{position:relative;display:grid;gap:1.1rem;padding:1.6rem;border:1px solid var(--vibeui-renovation-001-fg);background:var(--vibeui-renovation-001-paper);box-shadow:0 30px 60px -40px rgb(0 0 0 / .5)}
[data-vibeui-block="renovation-001"] [data-part="sheet"]::before{content:"";position:absolute;inset:.4rem;border:1px solid var(--vibeui-renovation-001-line);pointer-events:none}
[data-vibeui-block="renovation-001"] [data-part="sheet-head"]{display:flex;justify-content:space-between;gap:1rem;font-family:var(--vibeui-renovation-001-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-renovation-001-muted)}
[data-vibeui-block="renovation-001"] [data-part="rows"]{display:grid;margin:0;border-top:1px solid var(--vibeui-renovation-001-line)}
[data-vibeui-block="renovation-001"] [data-part="rows"] div{display:flex;justify-content:space-between;gap:1rem;padding:.55rem 0;border-bottom:1px solid var(--vibeui-renovation-001-line);font-size:.9rem}
[data-vibeui-block="renovation-001"] [data-part="rows"] dt{color:var(--vibeui-renovation-001-muted)}
[data-vibeui-block="renovation-001"] [data-part="rows"] dd{margin:0;font-family:var(--vibeui-renovation-001-mono);font-weight:500;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="renovation-001"] [data-part="total"]{display:grid;gap:.2rem}
[data-vibeui-block="renovation-001"] [data-part="total"] small{font-family:var(--vibeui-renovation-001-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-renovation-001-muted)}
[data-vibeui-block="renovation-001"] [data-part="price"]{margin:0;font-family:var(--vibeui-renovation-001-mono);font-weight:600;font-size:clamp(2rem,5cqi,2.8rem);letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="renovation-001"] [data-part="per"]{margin:0;font-family:var(--vibeui-renovation-001-mono);font-size:.78rem;color:var(--vibeui-renovation-001-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="renovation-001"] [data-part="weeks"]{display:grid;gap:.5rem}
[data-vibeui-block="renovation-001"] [data-part="weeks"] p{margin:0;display:flex;justify-content:space-between;align-items:baseline;font-family:var(--vibeui-renovation-001-mono);font-size:.78rem;color:var(--vibeui-renovation-001-muted)}
[data-vibeui-block="renovation-001"] [data-part="weeks"] p b{font-size:1.3rem;font-weight:600;color:var(--vibeui-renovation-001-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="renovation-001"] [data-part="cells"]{display:grid;grid-template-columns:repeat(var(--vibeui-renovation-001-max),1fr);gap:3px;height:.9rem}
[data-vibeui-block="renovation-001"] [data-part="cells"] i{display:block;border:1px solid var(--vibeui-renovation-001-line);background:transparent;transition:background .3s,border-color .3s}
[data-vibeui-block="renovation-001"] [data-part="cells"] i[data-on="true"]{background:var(--vibeui-renovation-001-accent);border-color:var(--vibeui-renovation-001-accent)}
[data-vibeui-block="renovation-001"] [data-part="save"]{display:inline-flex;justify-content:center;align-items:center;gap:.5rem;padding:.95rem 1.2rem;border:0;border-radius:.4rem;background:var(--vibeui-renovation-001-accent);color:var(--vibeui-renovation-001-on-accent);font:inherit;font-weight:600;cursor:pointer;box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-renovation-001-fg) 20%,transparent) inset;transition:transform .18s,box-shadow .2s,background .2s}
[data-vibeui-block="renovation-001"] [data-part="save"]:hover{transform:translateY(-1px);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-renovation-001-fg) 20%,transparent) inset,0 12px 30px -12px var(--vibeui-renovation-001-accent)}
[data-vibeui-block="renovation-001"] [data-part="save"][data-saved="true"]{background:var(--vibeui-renovation-001-fg);color:var(--vibeui-renovation-001-bg)}
[data-vibeui-block="renovation-001"] [data-part="save"] svg{width:1rem;height:1rem}
[data-vibeui-block="renovation-001"] [data-part="fine"]{margin:0;font-size:.78rem;color:var(--vibeui-renovation-001-muted)}
@container (min-width: 36rem){[data-vibeui-block="renovation-001"] [data-part="types"]{grid-template-columns:repeat(3,minmax(0,1fr))}}
@container (min-width: 60rem){[data-vibeui-block="renovation-001"] [data-part="grid"]{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:2rem}[data-vibeui-block="renovation-001"] [data-part="sheet"]{position:sticky;top:5.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="renovation-001"] *{animation:none!important;transition:none!important}}`

const DEFAULT_TYPES: Renovation001Type[] = [
  { id: "cosmetic", name: "Косметический", rate: 8900, baseWeeks: 2, weeksPer10: 0.5, note: "обои, покраска, полы" },
  { id: "major", name: "Капитальный", rate: 17900, baseWeeks: 5, weeksPer10: 0.8, note: "до бетона, все коммуникации" },
  { id: "design", name: "Дизайнерский", rate: 29500, baseWeeks: 7, weeksPer10: 1.1, note: "по проекту, авторский надзор" },
]

const DEFAULT_OPTIONS: Renovation001Option[] = [
  { id: "electric", name: "Электрика с нуля", perM2: 1800, weeks: 1 },
  { id: "screed", name: "Стяжка пола", perM2: 1300, weeks: 1 },
  { id: "warm", name: "Тёплый пол", perM2: 2100, weeks: 0.5 },
  { id: "replan", name: "Перепланировка", fixed: 65000, weeks: 2 },
  { id: "project", name: "Дизайн-проект", perM2: 2400, weeks: 1 },
  { id: "trash", name: "Вывоз мусора", fixed: 19000 },
]

function formatMoney(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function weeksWord(value: number, units: readonly [string, string, string]) {
  const mod10 = value % 10
  const mod100 = value % 100
  if (mod10 === 1 && mod100 !== 11) return units[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return units[1]
  return units[2]
}

// Число докручивается до цели за 600 мс; первый рендер сразу равен цели,
// чтобы сервер и клиент совпали.
function useCountUp(target: number) {
  const [shown, setShown] = useState(target)
  const shownRef = useRef(target)
  useEffect(() => {
    const from = shownRef.current
    if (from === target) return
    let frame = 0
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 600)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = from + (target - from) * eased
      shownRef.current = value
      setShown(value)
      if (t < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return shown
}

/** Калькулятор сметы: площадь × тип ремонта × опции → цена и срок. */
export function Renovation001({
  eyebrow = "Смета за минуту",
  title = "Посчитайте ремонт, не звоня никому",
  lede = "Двигайте площадь, выберите тип и опции. Цифра в смете — та же, что попадёт в договор: мы не пересчитываем после замера.",
  minArea = 20,
  maxArea = 200,
  defaultArea = 54,
  types = DEFAULT_TYPES,
  defaultType = "major",
  options = DEFAULT_OPTIONS,
  defaultOptions = ["electric", "screed"],
  currency = "₽",
  saveLabel = "Сохранить смету",
  savedLabel = "Смета сохранена",
  eventName = "vibeui-renovation:estimate",
  fine = "Работы без материалов. Точная смета — после бесплатного замера, но она не будет выше этой.",
  weekUnits = ["неделя", "недели", "недель"],
  areaUnit = "м²",
  areaLabel = "Площадь квартиры",
  typeLabel = "Тип ремонта",
  fromLabel = "от",
  optionsLabel = "Опции",
  chosenLine = "выбрано {n}",
  nothingChosen = "ничего не выбрано",
  sheetLabel = "Смета № {n}",
  draftLabel = "предварительная",
  sheetAreaLabel = "Площадь",
  totalLabel = "Итого работы",
  perLabel = "за",
  termLabel = "Срок под ключ",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Renovation001Props) {
  const [area, setArea] = useState(defaultArea)
  const [typeId, setTypeId] = useState(defaultType)
  const [picked, setPicked] = useState<readonly string[]>(defaultOptions)
  const [saved, setSaved] = useState(false)

  const type = types.find((item) => item.id === typeId) ?? types[0]
  const chosen = options.filter((option) => picked.includes(option.id))
  const extras = chosen.reduce((sum, option) => sum + (option.perM2 ?? 0) * area + (option.fixed ?? 0), 0)
  const price = type.rate * area + extras
  const weeks = Math.max(1, Math.round(type.baseWeeks + (area / 10) * type.weeksPer10 + chosen.reduce((sum, option) => sum + (option.weeks ?? 0), 0)))
  const maxWeeks = Math.max(12, Math.ceil(weeks / 4) * 4)
  const shownPrice = useCountUp(price)
  const shownWeeks = useCountUp(weeks)
  const typeIndex = Math.max(0, types.indexOf(type))
  const number = `${String(1000 + area * 7 + typeIndex * 131 + chosen.length * 17).padStart(4, "0")}-${String(area).padStart(3, "0")}`
  const fill = `${((area - minArea) / Math.max(1, maxArea - minArea)) * 100}%`

  useEffect(() => {
    if (!saved) return
    const timer = window.setTimeout(() => setSaved(false), 2600)
    return () => window.clearTimeout(timer)
  }, [saved])

  const toggle = (id: string) => setPicked((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]))

  const save = () => {
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { number, area, type: type.name, options: chosen.map((option) => option.name), price, weeks, currency },
      }),
    )
    setSaved(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-renovation-001-accent": accent } : null),
    ...(ink ? { "--vibeui-renovation-001-fg": ink } : null),
    ...(background ? { "--vibeui-renovation-001-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-renovation-001" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="renovation-001" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <div data-part="controls">
              <div data-part="field">
                <label data-part="label" htmlFor="vibeui-renovation-001-area">
                  <span>{areaLabel}</span>
                  <output htmlFor="vibeui-renovation-001-area">
                    {area}
                    <small>{areaUnit}</small>
                  </output>
                </label>
                <div data-part="ruler">
                  <input
                    data-part="range"
                    id="vibeui-renovation-001-area"
                    type="range"
                    min={minArea}
                    max={maxArea}
                    value={area}
                    onChange={(event) => setArea(Number(event.target.value))}
                    style={{ ["--vibeui-renovation-001-fill" as string]: fill }}
                  />
                </div>
              </div>
              <div data-part="field">
                <p data-part="label" id="vibeui-renovation-001-type">
                  <span>{typeLabel}</span>
                </p>
                <ul data-part="types" role="radiogroup" aria-labelledby="vibeui-renovation-001-type">
                  {types.map((item) => (
                    <li key={item.id}>
                      <Button085 data-part="type" name={item.name} rate={item.rate} note={item.note} fromLabel={fromLabel} currency={currency} areaUnit={areaUnit} aria-checked={item.id === type.id} onClick={() => setTypeId(item.id)} accent={accent} />
                    </li>
                  ))}
                </ul>
              </div>
              <div data-part="field">
                <p data-part="label" id="vibeui-renovation-001-options">
                  <span>{optionsLabel}</span>
                  <span>{chosen.length ? chosenLine.replace("{n}", String(chosen.length)) : nothingChosen}</span>
                </p>
                <ul data-part="chips" aria-labelledby="vibeui-renovation-001-options">
                  {options.map((option) => (
                    <li key={option.id}>
                      <button data-part="chip" type="button" aria-pressed={picked.includes(option.id)} onClick={() => toggle(option.id)}>
                        {option.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div data-part="sheet" aria-live="polite">
              <div data-part="sheet-head">
                <span>{sheetLabel.replace("{n}", String(number))}</span>
                <span>{draftLabel}</span>
              </div>
              <dl data-part="rows">
                <div>
                  <dt>{sheetAreaLabel}</dt>
                  <dd>{area} {areaUnit}</dd>
                </div>
                <div>
                  <dt>{type.name}</dt>
                  <dd>
                    {formatMoney(type.rate)} {currency}/{areaUnit}
                  </dd>
                </div>
                {chosen.map((option) => (
                  <div key={option.id}>
                    <dt>{option.name}</dt>
                    <dd>
                      {option.perM2 ? `${formatMoney(option.perM2 * area)}` : formatMoney(option.fixed ?? 0)} {currency}
                    </dd>
                  </div>
                ))}
              </dl>
              <div data-part="total">
                <small>{totalLabel}</small>
                <p data-part="price">
                  {formatMoney(shownPrice)} {currency}
                </p>
                <p data-part="per">
                  {formatMoney(price / area)} {currency} {perLabel} {areaUnit}
                </p>
              </div>
              <div data-part="weeks" style={{ ["--vibeui-renovation-001-max" as string]: maxWeeks }}>
                <p>
                  <span>{termLabel}</span>
                  <span>
                    <b>{Math.round(shownWeeks)}</b> {weeksWord(weeks, weekUnits)}
                  </span>
                </p>
                <div data-part="cells" aria-hidden="true">
                  {Array.from({ length: maxWeeks }, (_, index) => (
                    <i key={index} data-on={index < weeks} />
                  ))}
                </div>
              </div>
              <button data-part="save" type="button" data-saved={saved} onClick={save}>
                {saved ? (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8.5l3.5 3.5L13 5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 3h8l2 2v8H3zM5 3v4h5V3M5 13V9h6v4" />
                  </svg>
                )}
                {saved ? savedLabel : saveLabel}
              </button>
              {fine ? <p data-part="fine">{fine}</p> : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
