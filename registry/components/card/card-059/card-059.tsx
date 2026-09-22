import type { ComponentProps, CSSProperties } from "react"

export type Card059Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  photo?: string
  role?: string
  years?: number
  objects?: number
  text?: string
  now?: string
  yearsLine?: string
  objectsLine?: string
  nowLabel?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

// Часть блока people-017, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-059"]){
--vibeui-card-059-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-059-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-059-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-059-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-059-line:color-mix(in oklab,var(--vibeui-card-059-fg) 16%,transparent);
--vibeui-card-059-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-059-muted:color-mix(in oklab,var(--vibeui-card-059-fg) 62%,var(--vibeui-card-059-bg));
--vibeui-card-059-on-accent:oklch(from var(--vibeui-card-059-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-059"]{color-scheme:dark}
[data-vibeui-block="card-059"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-059"] *{box-sizing:border-box}
[data-vibeui-block="card-059"]{position:relative;display:grid;grid-template-columns:5rem minmax(0,1fr);gap:.4rem 1rem;padding:1.2rem;border:1px solid var(--vibeui-card-059-line);background:color-mix(in oklab,var(--vibeui-card-059-bg) 75%,transparent);transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s,box-shadow .25s}
[data-vibeui-block="card-059"]:hover{transform:translateY(-3px);border-color:color-mix(in oklab,var(--vibeui-card-059-fg) 45%,transparent);box-shadow:0 24px 40px -30px rgb(0 0 0 / .5)}
[data-vibeui-block="card-059"] [data-part="corner"]{position:absolute;width:.9rem;height:.9rem;border:0 solid var(--vibeui-card-059-fg);pointer-events:none;transition:transform .3s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-059"] [data-part="corner"]:nth-of-type(1){left:-1px;top:-1px;border-left-width:2px;border-top-width:2px}
[data-vibeui-block="card-059"] [data-part="corner"]:nth-of-type(2){right:-1px;top:-1px;border-right-width:2px;border-top-width:2px}
[data-vibeui-block="card-059"] [data-part="corner"]:nth-of-type(3){left:-1px;bottom:-1px;border-left-width:2px;border-bottom-width:2px}
[data-vibeui-block="card-059"] [data-part="corner"]:nth-of-type(4){right:-1px;bottom:-1px;border-right-width:2px;border-bottom-width:2px}
[data-vibeui-block="card-059"]:hover [data-part="corner"]:nth-of-type(1){transform:translate(-4px,-4px)}
[data-vibeui-block="card-059"]:hover [data-part="corner"]:nth-of-type(2){transform:translate(4px,-4px)}
[data-vibeui-block="card-059"]:hover [data-part="corner"]:nth-of-type(3){transform:translate(-4px,4px)}
[data-vibeui-block="card-059"]:hover [data-part="corner"]:nth-of-type(4){transform:translate(4px,4px)}
[data-vibeui-block="card-059"] [data-part="index"]{position:absolute;top:.6rem;right:.8rem;font-family:var(--vibeui-card-059-mono);font-size:.66rem;letter-spacing:.06em;color:var(--vibeui-card-059-muted)}
[data-vibeui-block="card-059"] [data-part="mark"]{grid-row:1 / span 3;width:5rem;aspect-ratio:1;display:grid;place-items:center;border:1px solid var(--vibeui-card-059-fg);background:color-mix(in oklab,var(--vibeui-card-059-fg) 5%,transparent);font-family:var(--vibeui-card-059-display);font-weight:800;font-size:1.6rem;letter-spacing:-.04em;overflow:hidden;transition:background .25s,color .25s}
[data-vibeui-block="card-059"] [data-part="mark"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="card-059"]:hover [data-part="mark"]{background:var(--vibeui-card-059-accent);color:var(--vibeui-card-059-on-accent)}
[data-vibeui-block="card-059"] [data-part="name"]{margin:0;padding-right:2rem;font-family:var(--vibeui-card-059-display);font-weight:700;font-size:1.15rem;letter-spacing:-.02em;line-height:1.15}
[data-vibeui-block="card-059"] [data-part="role"]{margin:0;font-size:.88rem;color:var(--vibeui-card-059-muted)}
[data-vibeui-block="card-059"] [data-part="nums"]{display:flex;flex-wrap:wrap;gap:.3rem .9rem;margin:0;padding:0;list-style:none;font-family:var(--vibeui-card-059-mono);font-size:.72rem;color:var(--vibeui-card-059-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="card-059"] [data-part="nums"] b{font-weight:600;color:var(--vibeui-card-059-fg)}
[data-vibeui-block="card-059"] [data-part="text"]{grid-column:1 / -1;margin:.4rem 0 0;padding-top:.7rem;border-top:1px dashed var(--vibeui-card-059-line);font-size:.88rem;color:var(--vibeui-card-059-muted)}
[data-vibeui-block="card-059"] [data-part="now"]{grid-column:1 / -1;justify-self:start;display:inline-flex;align-items:center;gap:.4rem;margin-top:.3rem;padding:.25rem .55rem;background:var(--vibeui-card-059-accent);color:var(--vibeui-card-059-on-accent);font-family:var(--vibeui-card-059-mono);font-size:.64rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
[data-vibeui-block="card-059"] [data-part="now"]::before{content:"";width:.4rem;height:.4rem;border-radius:50%;background:currentColor}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-059"] *{animation:none!important;transition:none!important}}
`

/** Карточка бригады в духе штатного расписания: номер, имя, должность, разряд и стаж таблицей. */
export function Card059({
  name = "Ринат Валеев",
  photo = "/demo/realty/object-01.webp",
  role = "Плотник, монтаж",
  years,
  objects,
  text = "Карточка штатного расписания",
  now = "Карточка штатного расписания",
  yearsLine = "стаж {n} лет",
  objectsLine = "сдано {n}",
  nowLabel = "сейчас",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card059Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-059-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-059" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-059"
        className={className}
        style={palette}
      >
        <i data-part="corner" aria-hidden="true" />
        <i data-part="corner" aria-hidden="true" />
        <i data-part="corner" aria-hidden="true" />
        <i data-part="corner" aria-hidden="true" />
        <span data-part="index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div data-part="mark" aria-hidden={photo ? undefined : true}>
          {photo ? <img src={photo} alt={name} loading="lazy" /> : initials(name)}
        </div>
        <h3 data-part="name">{name}</h3>
        <p data-part="role">{role}</p>
        {years || objects ? (
          <ul data-part="nums">
            {years ? (
              <li>
                {yearsLine.split("{n}")[0]}
                <b>{years}</b>
                {yearsLine.split("{n}")[1]}
              </li>
            ) : null}
            {objects ? (
              <li>
                {objectsLine.split("{n}")[0]}
                <b>{objects}</b>
                {objectsLine.split("{n}")[1]}
              </li>
            ) : null}
          </ul>
        ) : null}
        {text ? <p data-part="text">{text}</p> : null}
        {now ? (
          <span data-part="now">
            {nowLabel} {now}
          </span>
        ) : null}
      </li>
    </>
  )
}
