"use client"

import { useId, useState, type CSSProperties, type FormEvent } from "react"

export type Subscribe011Frequency = {
  label: string
  /** Доставок в месяц — для расчёта. */
  perMonth: number
  /** Скидка к цене букета, %. */
  discount?: number
}

export type Subscribe011Size = {
  label: string
  price: number
  /** Сколько стеблей: «9–11». */
  stems: string
}

export type Subscribe011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  frequencies?: readonly Subscribe011Frequency[]
  sizes?: readonly Subscribe011Size[]
  defaultFrequency?: number
  defaultSize?: number
  currency?: string
  perks?: readonly string[]
  placeholder?: string
  actionLabel?: string
  doneTitle?: string
  doneText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Цветы по подписке: слева выбор частоты (радио-чипы) и размера букета,
// справа «квитанция» с расчётом — цена за доставку со скидкой, сумма в
// месяц, ближайшая дата. Числа меняются без прыжков (tabular-nums).
// Внизу квитанции одно поле телефона и кнопка; после отправки квитанция
// сменяется благодарностью с прорисованной галочкой. Форма — заглушка.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Golos+Text:wght@400;500;600&family=Caveat:wght@500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="subscribe-011"]){
--vibeui-subscribe-011-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-subscribe-011-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-011-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-011-on-accent:oklch(from var(--vibeui-subscribe-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-011-muted:color-mix(in oklab,var(--vibeui-subscribe-011-fg) 62%,var(--vibeui-subscribe-011-bg));
--vibeui-subscribe-011-line:color-mix(in oklab,var(--vibeui-subscribe-011-fg) 16%,transparent);
--vibeui-subscribe-011-paper:color-mix(in oklab,var(--vibeui-subscribe-011-fg) 5%,var(--vibeui-subscribe-011-bg));
--vibeui-subscribe-011-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-subscribe-011-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-subscribe-011-hand:"Caveat","Segoe Script",cursive;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-011"]{color-scheme:dark}
:where([data-vibeui-block="subscribe-011"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="subscribe-011"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="subscribe-011"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-subscribe-011-bg);color:var(--vibeui-subscribe-011-fg);font-family:var(--vibeui-subscribe-011-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="subscribe-011"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-011"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:start}
[data-vibeui-block="subscribe-011"] [data-part="eyebrow"]{margin:0 0 .8rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="title"]{margin:0;font-family:var(--vibeui-subscribe-011-display);font-weight:500;font-size:clamp(2.2rem,5.4cqi,4.2rem);line-height:1;letter-spacing:-.02em}
[data-vibeui-block="subscribe-011"] [data-part="lede"]{margin:.8rem 0 0;max-width:32rem;color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="group"]{margin:1.8rem 0 0;padding:0;border:0}
[data-vibeui-block="subscribe-011"] [data-part="group"] legend{padding:0;margin:0 0 .7rem;font-size:.74rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.5rem}
[data-vibeui-block="subscribe-011"] [data-part="chip"]{position:relative;display:inline-flex;align-items:baseline;gap:.4rem;padding:.6rem 1rem;border-radius:999px;border:1px solid var(--vibeui-subscribe-011-line);cursor:pointer;transition:border-color .25s,background .25s,color .25s}
[data-vibeui-block="subscribe-011"] [data-part="chip"] input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
[data-vibeui-block="subscribe-011"] [data-part="chip"] small{font-size:.75rem;color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="chip"]:hover{border-color:var(--vibeui-subscribe-011-fg)}
[data-vibeui-block="subscribe-011"] [data-part="chip"][data-on="true"]{background:var(--vibeui-subscribe-011-fg);border-color:var(--vibeui-subscribe-011-fg);color:var(--vibeui-subscribe-011-bg)}
[data-vibeui-block="subscribe-011"] [data-part="chip"][data-on="true"] small{color:inherit;opacity:.7}
[data-vibeui-block="subscribe-011"] [data-part="chip"]:has(input:focus-visible){outline:2px solid var(--vibeui-subscribe-011-accent);outline-offset:3px}
[data-vibeui-block="subscribe-011"] [data-part="perks"]{display:grid;gap:.5rem;margin:2rem 0 0;padding:0;list-style:none;font-size:.9rem;color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="perks"] li{display:flex;gap:.6rem;align-items:baseline}
[data-vibeui-block="subscribe-011"] [data-part="perks"] li::before{content:"";flex:0 0 .45rem;height:.45rem;border-radius:50%;background:var(--vibeui-subscribe-011-accent);transform:translateY(-.1rem)}
[data-vibeui-block="subscribe-011"] [data-part="receipt"]{position:relative;padding:1.8rem 1.5rem;background:var(--vibeui-subscribe-011-paper);border:1px solid var(--vibeui-subscribe-011-line);border-radius:.4rem}
[data-vibeui-block="subscribe-011"] [data-part="receipt"]::before{content:"";position:absolute;left:0;right:0;top:-.55rem;height:1.1rem;background:radial-gradient(circle at 50% 50%,var(--vibeui-subscribe-011-bg) .42rem,transparent .5rem) 0 0/1.5rem 1.1rem repeat-x;pointer-events:none}
[data-vibeui-block="subscribe-011"] [data-part="receipt"] h3{margin:0 0 1.2rem;font-family:var(--vibeui-subscribe-011-hand);font-size:1.6rem;line-height:1;color:var(--vibeui-subscribe-011-accent);transform:rotate(-2deg);transform-origin:left}
[data-vibeui-block="subscribe-011"] [data-part="rows"]{margin:0;display:grid;gap:.6rem;font-size:.92rem}
[data-vibeui-block="subscribe-011"] [data-part="rows"] div{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;padding-bottom:.6rem;border-bottom:1px dashed color-mix(in oklab,var(--vibeui-subscribe-011-fg) 30%,transparent)}
[data-vibeui-block="subscribe-011"] [data-part="rows"] dt{color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="rows"] dd{margin:0;font-variant-numeric:tabular-nums;font-weight:500;text-align:right}
[data-vibeui-block="subscribe-011"] [data-part="rows"] dd s{color:var(--vibeui-subscribe-011-muted);font-weight:400;margin-right:.4rem}
[data-vibeui-block="subscribe-011"] [data-part="total"]{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;margin:1rem 0 0}
[data-vibeui-block="subscribe-011"] [data-part="total"] span{font-size:.9rem;color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="total"] b{font-family:var(--vibeui-subscribe-011-display);font-weight:600;font-size:2.4rem;line-height:1;letter-spacing:-.03em;font-variant-numeric:tabular-nums}
[data-vibeui-block="subscribe-011"] [data-part="form"]{display:grid;gap:.6rem;margin:1.4rem 0 0}
[data-vibeui-block="subscribe-011"] [data-part="form"] input{width:100%;height:3.1rem;padding:0 1.1rem;border-radius:999px;border:1px solid var(--vibeui-subscribe-011-line);background:var(--vibeui-subscribe-011-bg);color:var(--vibeui-subscribe-011-fg);font:inherit;outline:none;transition:border-color .2s,box-shadow .2s}
[data-vibeui-block="subscribe-011"] [data-part="form"] input::placeholder{color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="form"] input:focus-visible{border-color:var(--vibeui-subscribe-011-fg);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-subscribe-011-accent) 25%,transparent)}
[data-vibeui-block="subscribe-011"] [data-part="form"] button{height:3.1rem;padding:0 1.4rem;border-radius:999px;border:0;background:var(--vibeui-subscribe-011-accent);color:var(--vibeui-subscribe-011-on-accent);font:inherit;font-weight:500;cursor:pointer;white-space:nowrap;transition:transform .2s,box-shadow .25s}
[data-vibeui-block="subscribe-011"] [data-part="form"] button:hover{transform:translateY(-1px);box-shadow:0 12px 30px -12px var(--vibeui-subscribe-011-accent)}
[data-vibeui-block="subscribe-011"] [data-part="form"] button:focus-visible{outline:2px solid var(--vibeui-subscribe-011-fg);outline-offset:3px}
[data-vibeui-block="subscribe-011"] [data-part="fine"]{margin:.8rem 0 0;font-size:.78rem;color:var(--vibeui-subscribe-011-muted)}
[data-vibeui-block="subscribe-011"] [data-part="done"]{display:grid;justify-items:start;gap:.8rem}
[data-vibeui-block="subscribe-011"] [data-part="done"] svg{width:4rem;height:4rem;color:var(--vibeui-subscribe-011-accent)}
[data-vibeui-block="subscribe-011"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-subscribe-011-draw .8s ease-out forwards}
[data-vibeui-block="subscribe-011"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-subscribe-011-draw .5s ease-out .5s forwards}
[data-vibeui-block="subscribe-011"] [data-part="done"] h4{margin:0;font-family:var(--vibeui-subscribe-011-display);font-size:1.8rem;font-weight:600;line-height:1.1}
[data-vibeui-block="subscribe-011"] [data-part="done"] p{margin:0;color:var(--vibeui-subscribe-011-muted)}
@keyframes vibeui-subscribe-011-draw{to{stroke-dashoffset:0}}
@container (min-width: 36rem){[data-vibeui-block="subscribe-011"] [data-part="form"]{grid-template-columns:1fr auto}}
@container (min-width: 60rem){[data-vibeui-block="subscribe-011"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:4rem}[data-vibeui-block="subscribe-011"] [data-part="receipt"]{padding:2.2rem 2rem;transform:rotate(1.2deg)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-011"] *{animation:none!important;transition:none!important}[data-vibeui-block="subscribe-011"] [data-part="done"] circle,[data-vibeui-block="subscribe-011"] [data-part="done"] path{stroke-dashoffset:0}}`

const DEFAULT_FREQUENCIES: Subscribe011Frequency[] = [
  { label: "Каждую неделю", perMonth: 4, discount: 20 },
  { label: "Раз в две недели", perMonth: 2, discount: 12 },
  { label: "Раз в месяц", perMonth: 1, discount: 5 },
]

const DEFAULT_SIZES: Subscribe011Size[] = [
  { label: "Маленький", price: 1900, stems: "5–7 стеблей" },
  { label: "Средний", price: 2900, stems: "9–12 стеблей" },
  { label: "Большой", price: 4400, stems: "15–19 стеблей" },
]

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

/** Цветы по подписке: частота и размер чипами, квитанция с расчётом. */
export function Subscribe011({
  eyebrow = "Подписка",
  title = "Цветы по подписке — сезонные, без повторов",
  lede = "Флорист сам решает, что цветёт лучше всего на этой неделе. Вы решаете, как часто это должно случаться.",
  frequencies = DEFAULT_FREQUENCIES,
  sizes = DEFAULT_SIZES,
  defaultFrequency = 1,
  defaultSize = 1,
  currency = "₽",
  perks = ["Первая доставка — в подарок", "Пауза на отпуск в один клик", "Открытка с уходом в каждом букете", "Отмена в любой момент, без объяснений"],
  placeholder = "Телефон",
  actionLabel = "Подписаться",
  doneTitle = "Записали",
  doneText = "Перезвоним сегодня, уточним адрес и день. Первый букет — за наш счёт.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Subscribe011Props) {
  const [frequency, setFrequency] = useState(Math.min(defaultFrequency, Math.max(0, frequencies.length - 1)))
  const [size, setSize] = useState(Math.min(defaultSize, Math.max(0, sizes.length - 1)))
  const [done, setDone] = useState(false)
  const id = useId()

  const currentFrequency = frequencies[frequency]
  const currentSize = sizes[size]
  const discount = currentFrequency?.discount ?? 0
  const perDelivery = currentSize ? Math.round((currentSize.price * (100 - discount)) / 100 / 10) * 10 : 0
  const perMonth = perDelivery * (currentFrequency?.perMonth ?? 0)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-subscribe-011-accent": accent } : null),
    ...(ink ? { "--vibeui-subscribe-011-fg": ink } : null),
    ...(background ? { "--vibeui-subscribe-011-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-subscribe-011" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="subscribe-011" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <fieldset data-part="group">
              <legend>Как часто</legend>
              <div data-part="chips">
                {frequencies.map((item, index) => (
                  <label key={item.label} data-part="chip" data-on={index === frequency}>
                    <input type="radio" name={`${id}-frequency`} checked={index === frequency} onChange={() => setFrequency(index)} />
                    {item.label}
                    {item.discount ? <small>−{item.discount}%</small> : null}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset data-part="group">
              <legend>Какой букет</legend>
              <div data-part="chips">
                {sizes.map((item, index) => (
                  <label key={item.label} data-part="chip" data-on={index === size}>
                    <input type="radio" name={`${id}-size`} checked={index === size} onChange={() => setSize(index)} />
                    {item.label}
                    <small>{item.stems}</small>
                  </label>
                ))}
              </div>
            </fieldset>
            {perks.length > 0 ? (
              <ul data-part="perks">
                {perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="receipt" aria-live="polite">
            {done ? (
              <div data-part="done">
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="32" cy="32" r="25" />
                  <path d="M21 33l8 8 14-16" />
                </svg>
                <h4>{doneTitle}</h4>
                <p>{doneText}</p>
              </div>
            ) : (
              <>
                <h3>ваша подписка</h3>
                <dl data-part="rows">
                  <div>
                    <dt>Букет</dt>
                    <dd>{currentSize ? `${currentSize.label.toLowerCase()}, ${currentSize.stems}` : "—"}</dd>
                  </div>
                  <div>
                    <dt>Частота</dt>
                    <dd>{currentFrequency ? currentFrequency.label.toLowerCase() : "—"}</dd>
                  </div>
                  <div>
                    <dt>За доставку</dt>
                    <dd>
                      {discount > 0 && currentSize ? <s>{formatMoney(currentSize.price, currency)}</s> : null}
                      {formatMoney(perDelivery, currency)}
                    </dd>
                  </div>
                  <div>
                    <dt>Доставок в месяц</dt>
                    <dd>{currentFrequency?.perMonth ?? 0}</dd>
                  </div>
                </dl>
                <div data-part="total">
                  <span>в месяц</span>
                  <b>{formatMoney(perMonth, currency)}</b>
                </div>
                <form data-part="form" onSubmit={submit}>
                  <input type="tel" name="phone" required placeholder={placeholder} aria-label={placeholder} autoComplete="tel" />
                  <button type="submit">{actionLabel}</button>
                </form>
                <p data-part="fine">Списание в день доставки. Первая — бесплатно, без карты.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
