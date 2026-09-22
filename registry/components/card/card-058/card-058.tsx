import type { ComponentProps, CSSProperties } from "react"

export type Card058Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  photo?: string
  role?: string
  skills?: readonly string[]
  years?: string
  cars?: string
  yearsLabel?: string
  carsLabel?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

// Часть блока people-014, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-058"]){
--vibeui-card-058-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-058-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-058-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-058-glass:color-mix(in oklab,var(--vibeui-card-058-fg) 5%,transparent);
--vibeui-card-058-line:color-mix(in oklab,var(--vibeui-card-058-fg) 12%,transparent);
--vibeui-card-058-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-058-on-accent:oklch(from var(--vibeui-card-058-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-058"]{color-scheme:dark}
[data-vibeui-block="card-058"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-058"] *{box-sizing:border-box}
[data-vibeui-block="card-058"]{position:relative;overflow:hidden;aspect-ratio:3/4;border-radius:1.4rem;border:1px solid var(--vibeui-card-058-line);background:var(--vibeui-card-058-glass);transform:rotateX(var(--vibeui-card-058-rx,0deg)) rotateY(var(--vibeui-card-058-ry,0deg));transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s;--vibeui-card-058-gx:50%;--vibeui-card-058-gy:30%}
[data-vibeui-block="card-058"]:hover{transition:transform .08s linear;box-shadow:0 40px 80px -40px rgb(0 0 0 / .7)}
[data-vibeui-block="card-058"] [data-part="photo"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-058"]:hover [data-part="photo"]{transform:scale(1.05)}
[data-vibeui-block="card-058"] [data-part="initials"]{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--vibeui-card-058-display);font-weight:900;font-size:clamp(4rem,10cqi,7rem);letter-spacing:-.05em;color:color-mix(in oklab,var(--vibeui-card-058-fg) 12%,transparent)}
[data-vibeui-block="card-058"] [data-part="glare"]{position:absolute;inset:0;background:radial-gradient(28rem circle at var(--vibeui-card-058-gx) var(--vibeui-card-058-gy),rgb(255 255 255 / .22),transparent 55%);opacity:0;transition:opacity .4s;pointer-events:none;mix-blend-mode:overlay}
[data-vibeui-block="card-058"]:hover [data-part="glare"]{opacity:1}
[data-vibeui-block="card-058"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(to top,rgb(0 0 0 / .85) 0%,rgb(0 0 0 / .35) 45%,transparent 75%);pointer-events:none}
[data-vibeui-block="card-058"] [data-part="badge"]{position:absolute;top:1rem;left:1rem;padding:.35rem .7rem;border-radius:999px;background:var(--vibeui-card-058-accent);color:var(--vibeui-card-058-on-accent);font-family:var(--vibeui-card-058-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="card-058"] [data-part="info"]{position:absolute;left:0;right:0;bottom:0;padding:1.3rem;color:#fff;display:grid;gap:.5rem}
[data-vibeui-block="card-058"] [data-part="name"]{margin:0;font-family:var(--vibeui-card-058-display);font-weight:700;font-size:1.3rem;letter-spacing:-.02em;line-height:1.1}
[data-vibeui-block="card-058"] [data-part="role"]{margin:0;font-size:.9rem;color:rgb(255 255 255 / .75)}
[data-vibeui-block="card-058"] [data-part="stats"]{display:flex;gap:1.4rem;margin:.3rem 0 0;padding:.7rem 0 0;border-top:1px solid rgb(255 255 255 / .18)}
[data-vibeui-block="card-058"] [data-part="stats"] div{display:grid}
[data-vibeui-block="card-058"] [data-part="stats"] b{font-family:var(--vibeui-card-058-display);font-weight:900;font-size:1.3rem;line-height:1;letter-spacing:-.03em;color:var(--vibeui-card-058-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="card-058"] [data-part="stats"] small{font-family:var(--vibeui-card-058-mono);font-size:.65rem;letter-spacing:.06em;text-transform:uppercase;color:rgb(255 255 255 / .6)}
[data-vibeui-block="card-058"] [data-part="skills"]{display:flex;flex-wrap:wrap;gap:.35rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="card-058"] [data-part="skills"] li{padding:.25rem .55rem;border-radius:999px;border:1px solid rgb(255 255 255 / .3);font-size:.72rem;color:rgb(255 255 255 / .85);backdrop-filter:blur(6px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-058"] *{animation:none!important;transition:none!important}}
`

/** Карточка мастера с фото, именем, специализацией и наклоном за курсором: наклон передаётся блоком. */
export function Card058({
  name = "Даша Орлова",
  photo = "/demo/realty/object-01.webp",
  role = "Салон, кожа, химчистка",
  skills = [],
  years = "11 лет",
  cars = "2 400",
  yearsLabel = "стаж",
  carsLabel = "машин",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card058Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-058-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-058" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-058"
        className={className}
        style={palette}
      >
        {photo ? <img data-part="photo" src={photo} alt={name} loading="lazy" /> : <span data-part="initials" aria-hidden="true">{initials(name)}</span>}
        <i data-part="shade" aria-hidden="true" />
        <i data-part="glare" aria-hidden="true" />
        <span data-part="badge">№ {String(index + 1).padStart(2, "0")}</span>
        <div data-part="info">
          <h3 data-part="name">{name}</h3>
          <p data-part="role">{role}</p>
          {skills && skills.length > 0 ? (
            <ul data-part="skills">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          ) : null}
          {years || cars ? (
            <div data-part="stats">
              {years ? (
                <div>
                  <b>{years}</b>
                  <small>{yearsLabel}</small>
                </div>
              ) : null}
              {cars ? (
                <div>
                  <b>{cars}</b>
                  <small>{carsLabel}</small>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </li>
    </>
  )
}
