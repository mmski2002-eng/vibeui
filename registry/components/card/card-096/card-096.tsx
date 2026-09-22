import type { ComponentProps, CSSProperties } from "react"

export type Card096Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  day?: number
  title?: string
  time?: string
  text?: string
  photo?: string
  by?: string
  dayLabel?: string
  months?: readonly string[]
  plannedLabel?: string
  future?: boolean
  today?: number | null
  dayStart?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function formatDay(dayStart: number, day: number, months: readonly string[]) {
  const date = new Date(dayStart + (day - 1) * 86400000)
  return `${date.getDate()} ${months[date.getMonth()]}`
}

// Часть блока renovation-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-096"]){
--vibeui-card-096-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-096-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-096-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-096-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-096-line:color-mix(in oklab,var(--vibeui-card-096-fg) 16%,transparent);
--vibeui-card-096-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-096-muted:color-mix(in oklab,var(--vibeui-card-096-fg) 62%,var(--vibeui-card-096-bg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-096"]{color-scheme:dark}
[data-vibeui-block="card-096"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-096"] *{box-sizing:border-box}
[data-vibeui-block="card-096"]{position:relative;display:grid;gap:.5rem;padding:0 0 1.6rem}
[data-vibeui-block="card-096"]::before{content:"";position:absolute;left:-1.4rem;top:.35rem;width:.7rem;height:.7rem;margin-left:-.35rem;background:var(--vibeui-card-096-accent);border:2px solid var(--vibeui-card-096-bg);box-shadow:0 0 0 1px var(--vibeui-card-096-fg)}
[data-vibeui-block="card-096"][data-future="true"]{opacity:.55}
[data-vibeui-block="card-096"][data-future="true"]::before{background:transparent}
[data-vibeui-block="card-096"] [data-part="when"]{display:flex;flex-wrap:wrap;gap:.3rem .8rem;margin:0;font-family:var(--vibeui-card-096-mono);font-size:.7rem;letter-spacing:.04em;color:var(--vibeui-card-096-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="card-096"] [data-part="when"] b{font-weight:600;color:var(--vibeui-card-096-fg)}
[data-vibeui-block="card-096"] h3{margin:0;font-family:var(--vibeui-card-096-display);font-weight:700;font-size:1.05rem;letter-spacing:-.01em}
[data-vibeui-block="card-096"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-096-muted)}
[data-vibeui-block="card-096"] img{display:block;width:100%;max-width:26rem;aspect-ratio:3/2;object-fit:cover;border:1px solid var(--vibeui-card-096-line);margin-top:.3rem}
[data-vibeui-block="card-096"] [data-part="by"]{font-family:var(--vibeui-card-096-mono);font-size:.68rem;color:var(--vibeui-card-096-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-096"] *{animation:none!important;transition:none!important}}
`

/** Запись ленты стройки: день с датой и временем, заголовок, текст, фото и автор; будущие — по data-future. */
export function Card096({
  day = 1,
  title,
  time,
  text,
  photo,
  by,
  dayLabel = "день {n}",
  months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
  plannedLabel = "запланировано",
  future,
  today,
  dayStart = 0,
  accent,
  className,
  style,
  ...props
}: Card096Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-096-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-096" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-096" data-future={future}
        className={className}
        style={palette}
      >
        <p data-part="when">
          <b>{dayLabel.replace("{n}", String(day))}</b>
          <span>{today === null ? "" : formatDay(dayStart, day, months)}</span>
          {time ? <span>{time}</span> : null}
          {future ? <span>{plannedLabel}</span> : null}
        </p>
        <h3>{title}</h3>
        <p>{text}</p>
        {photo && !future ? <img src={photo} alt={title} loading="lazy" /> : null}
        {by ? <span data-part="by">— {by}</span> : null}
      </li>
    </>
  )
}
