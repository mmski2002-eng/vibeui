import type { ComponentProps, CSSProperties } from "react"

export type Card114Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  quote?: string
  note?: string
  lang?: string
  months?: number
  before?: string
  after?: string
  levelUnits?: readonly [string, string, string]
  monthUnits?: readonly [string, string, string]
  scaleLabel?: string
  levels?: readonly string[]
  from?: number
  to?: number
  gained?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const DEFAULT_LEVELS = ["A1", "A2", "B1", "B2", "C1"]

function pluralLevels(count: number, units: readonly [string, string, string]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return units[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return units[1]
  return units[2]
}

function pluralMonths(count: number, units: readonly [string, string, string]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return units[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return units[1]
  return units[2]
}

// Часть блока testimonials-031, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-114"]){
--vibeui-card-114-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-114-display:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-114-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-114-hand:"Marck Script",cursive;
--vibeui-card-114-line:color-mix(in oklab,var(--vibeui-card-114-fg) 12%,transparent);
--vibeui-card-114-muted:color-mix(in oklab,var(--vibeui-card-114-fg) 62%,var(--vibeui-card-114-bg));
--vibeui-card-114-on-accent:oklch(from var(--vibeui-card-114-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-114-paper:color-mix(in oklab,var(--vibeui-card-114-bg) 92%,#fff);
--vibeui-card-114-rule:color-mix(in oklab,var(--vibeui-card-114-fg) 8%,transparent);
--vibeui-card-114-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-114"]{color-scheme:dark}
[data-vibeui-block="card-114"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-114"] *{box-sizing:border-box}
@keyframes vibeui-card-114-pop{from{transform:translate(-50%,-50%) scale(0)}to{transform:translate(-50%,-50%) scale(1)}}
@keyframes vibeui-card-114-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
[data-vibeui-block="card-114"]{position:relative;display:grid;gap:1rem;align-content:start;padding:1.6rem 1.4rem 1.4rem 2.8rem;border-radius:.4rem 1.2rem 1.2rem .4rem;background:var(--vibeui-card-114-paper);background-image:linear-gradient(90deg,transparent 1.9rem,color-mix(in oklab,var(--vibeui-card-114-accent) 45%,transparent) 1.9rem,color-mix(in oklab,var(--vibeui-card-114-accent) 45%,transparent) calc(1.9rem + 1px),transparent calc(1.9rem + 1px)),repeating-linear-gradient(180deg,transparent 0 calc(1.6rem - 1px),var(--vibeui-card-114-rule) calc(1.6rem - 1px) 1.6rem);border:1px solid var(--vibeui-card-114-line);transform:rotate(calc(var(--vibeui-testimonials-031-tilt) * 1deg));transition:transform .4s cubic-bezier(.2,.8,.2,1),box-shadow .4s}
[data-vibeui-block="card-114"]:hover{transform:rotate(0) translateY(-4px);box-shadow:0 30px 50px -30px color-mix(in oklab,var(--vibeui-card-114-fg) 55%,transparent)}
[data-vibeui-block="card-114"] [data-part="sticker"]{position:absolute;right:-.5rem;top:-.8rem;padding:.35rem .7rem;border-radius:.3rem;background:var(--vibeui-card-114-accent);color:var(--vibeui-card-114-on-accent);font-family:var(--vibeui-card-114-hand);font-size:1.1rem;line-height:1.1;transform:rotate(4deg)}
[data-vibeui-block="card-114"] [data-part="quote"]{margin:0;font-size:1.02rem;line-height:1.6rem}
[data-vibeui-block="card-114"] [data-part="quote"]::before{content:"«";color:var(--vibeui-card-114-accent);font-family:var(--vibeui-card-114-display);font-weight:800;font-size:1.4em;line-height:0;margin-right:.1em}
[data-vibeui-block="card-114"] [data-part="note"]{margin:0;font-family:var(--vibeui-card-114-hand);font-size:1.15rem;color:var(--vibeui-card-114-accent);transform:rotate(-1.5deg);transform-origin:left}
[data-vibeui-block="card-114"] [data-part="who"]{margin:0;font-size:.85rem;color:var(--vibeui-card-114-muted)}
[data-vibeui-block="card-114"] [data-part="who"] b{font-family:var(--vibeui-card-114-display);font-weight:700;color:var(--vibeui-card-114-fg)}
[data-vibeui-block="card-114"] [data-part="scale"]{position:relative;margin:.4rem 0 0;padding:.2rem 0 1.3rem}
[data-vibeui-block="card-114"] [data-part="track"]{position:relative;height:.35rem;border-radius:999px;background:var(--vibeui-card-114-line)}
[data-vibeui-block="card-114"] [data-part="fill"]{position:absolute;top:0;bottom:0;left:calc(var(--vibeui-card-114-from) * 1%);width:calc((var(--vibeui-card-114-to) - var(--vibeui-card-114-from)) * 1%);border-radius:999px;background:var(--vibeui-card-114-accent);transform-origin:left}
[data-vibeui-block="card-114"] [data-part="pin"]{position:absolute;top:50%;width:.95rem;height:.95rem;border-radius:50%;transform:translate(-50%,-50%);background:var(--vibeui-card-114-paper);border:2px solid var(--vibeui-card-114-muted)}
[data-vibeui-block="card-114"] [data-part="pin"][data-kind="after"]{background:var(--vibeui-card-114-accent);border-color:var(--vibeui-card-114-accent);box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-card-114-accent) 22%,transparent)}
[data-vibeui-block="card-114"] [data-part="ticks"]{display:flex;justify-content:space-between;margin:.5rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-card-114-display);font-size:.68rem;font-weight:700;color:var(--vibeui-card-114-muted)}
[data-vibeui-block="card-114"] [data-part="ticks"] li[data-from]{color:var(--vibeui-card-114-fg)}
[data-vibeui-block="card-114"] [data-part="ticks"] li[data-to]{color:var(--vibeui-card-114-accent)}
@supports (animation-timeline: view()){
[data-vibeui-block="card-114"] [data-part="fill"]{animation:vibeui-card-114-grow linear both;animation-timeline:view();animation-range:entry 30% entry 90%}
[data-vibeui-block="card-114"] [data-part="pin"][data-kind="after"]{animation:vibeui-card-114-pop linear both;animation-timeline:view();animation-range:entry 70% entry 100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-114"] *{animation:none!important;transition:none!important}}
`

/** Карточка ученика: стикер прироста, цитата, заметка, кто и сколько месяцев, шкала уровней «до → после». */
export function Card114({
  name = "Марина",
  quote = "Пришла с «лондон из зе кэпитал», через полгода вела созвон с заказчиком из Дублина и даже поняла его шутку про погоду.",
  note,
  lang = "английский",
  months = 6,
  before = "A2",
  after = "B2",
  levelUnits = ["уровень", "уровня", "уровней"],
  monthUnits = ["месяц", "месяца", "месяцев"],
  scaleLabel = "Уровень: было {before}, стало {after}",
  levels = DEFAULT_LEVELS,
  from = 20,
  to = 60,
  gained = 2,
  accent,
  className,
  style,
  ...props
}: Card114Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-114-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-114" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-114"
        className={className}
        style={palette}
      >
        {gained > 0 ? (
          <span data-part="sticker">
            +{gained} {pluralLevels(gained, levelUnits)}
          </span>
        ) : null}
        <blockquote data-part="quote">{quote}</blockquote>
        {note ? <p data-part="note">{note}</p> : null}
        <p data-part="who">
          <b>{name}</b> · {lang} · {months} {pluralMonths(months, monthUnits)}
        </p>
        <div data-part="scale" aria-label={scaleLabel.replace("{before}", before).replace("{after}", after)}>
          <div data-part="track" style={{ ["--vibeui-card-114-from" as string]: from, ["--vibeui-card-114-to" as string]: to }}>
            <i data-part="fill" />
            <i data-part="pin" data-kind="before" style={{ left: `${from}%` }} />
            <i data-part="pin" data-kind="after" style={{ left: `${to}%` }} />
          </div>
          <ul data-part="ticks" aria-hidden="true">
            {levels.map((level) => (
              <li key={level} data-from={level === before ? "" : undefined} data-to={level === after ? "" : undefined}>
                {level}
              </li>
            ))}
          </ul>
        </div>
      </li>
    </>
  )
}
