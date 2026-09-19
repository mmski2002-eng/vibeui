"use client"

import { type CSSProperties, type PointerEvent } from "react"

export type People014Member = {
  name: string
  role: string
  photo?: string
  /** Стаж: «9 лет». */
  years?: string
  /** Сколько машин прошло через руки. */
  cars?: string
  /** Чем славится: до трёх тегов. */
  skills?: readonly string[]
}

export type People014Props = {
  eyebrow?: string
  title?: string
  lede?: string
  members?: readonly People014Member[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Мастера детейлинга: карточки-«пропуска» с фото во весь рост, по наведению
// карточка наклоняется за курсором (perspective + rotateX/rotateY через
// --rx/--ry, пишем прямо в стиль), поверх фото бежит блик по --gx/--gy.
// Снизу стеклянная плашка: имя, роль, стаж и число машин крупными цифрами,
// теги-специализации. На узком — одна колонка, наклон не мешает скроллу.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="people-014"]){
--vibeui-people-014-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-people-014-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-014-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-people-014-on-accent:oklch(from var(--vibeui-people-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-people-014-muted:color-mix(in oklab,var(--vibeui-people-014-fg) 60%,var(--vibeui-people-014-bg));
--vibeui-people-014-line:color-mix(in oklab,var(--vibeui-people-014-fg) 12%,transparent);
--vibeui-people-014-glass:color-mix(in oklab,var(--vibeui-people-014-fg) 5%,transparent);
--vibeui-people-014-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-014-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-people-014-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-014"]{color-scheme:dark}
:where([data-vibeui-block="people-014"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="people-014"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="people-014"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-people-014-bg);color:var(--vibeui-people-014-fg);font-family:var(--vibeui-people-014-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="people-014"] *{box-sizing:border-box}
[data-vibeui-block="people-014"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="people-014"] [data-part="head"]{display:grid;gap:1rem;align-items:end;margin-bottom:2.2rem}
[data-vibeui-block="people-014"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 .8rem;font-family:var(--vibeui-people-014-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-people-014-accent)}
[data-vibeui-block="people-014"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-people-014-accent)}
[data-vibeui-block="people-014"] [data-part="title"]{margin:0;font-family:var(--vibeui-people-014-display);font-weight:900;font-size:clamp(1.8rem,4.4cqi,3.2rem);line-height:1.02;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="people-014"] [data-part="lede"]{margin:0;max-width:30rem;color:var(--vibeui-people-014-muted)}
[data-vibeui-block="people-014"] [data-part="grid"]{display:grid;gap:1.2rem;margin:0;padding:0;list-style:none;perspective:1400px}
[data-vibeui-block="people-014"] [data-part="card"]{position:relative;overflow:hidden;aspect-ratio:3/4;border-radius:1.4rem;border:1px solid var(--vibeui-people-014-line);background:var(--vibeui-people-014-glass);transform:rotateX(var(--vibeui-people-014-rx,0deg)) rotateY(var(--vibeui-people-014-ry,0deg));transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s;--vibeui-people-014-gx:50%;--vibeui-people-014-gy:30%}
[data-vibeui-block="people-014"] [data-part="card"]:hover{transition:transform .08s linear;box-shadow:0 40px 80px -40px rgb(0 0 0 / .7)}
[data-vibeui-block="people-014"] [data-part="photo"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="people-014"] [data-part="card"]:hover [data-part="photo"]{transform:scale(1.05)}
[data-vibeui-block="people-014"] [data-part="initials"]{position:absolute;inset:0;display:grid;place-items:center;font-family:var(--vibeui-people-014-display);font-weight:900;font-size:clamp(4rem,10cqi,7rem);letter-spacing:-.05em;color:color-mix(in oklab,var(--vibeui-people-014-fg) 12%,transparent)}
[data-vibeui-block="people-014"] [data-part="glare"]{position:absolute;inset:0;background:radial-gradient(28rem circle at var(--vibeui-people-014-gx) var(--vibeui-people-014-gy),rgb(255 255 255 / .22),transparent 55%);opacity:0;transition:opacity .4s;pointer-events:none;mix-blend-mode:overlay}
[data-vibeui-block="people-014"] [data-part="card"]:hover [data-part="glare"]{opacity:1}
[data-vibeui-block="people-014"] [data-part="shade"]{position:absolute;inset:0;background:linear-gradient(to top,rgb(0 0 0 / .85) 0%,rgb(0 0 0 / .35) 45%,transparent 75%);pointer-events:none}
[data-vibeui-block="people-014"] [data-part="badge"]{position:absolute;top:1rem;left:1rem;padding:.35rem .7rem;border-radius:999px;background:var(--vibeui-people-014-accent);color:var(--vibeui-people-014-on-accent);font-family:var(--vibeui-people-014-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase}
[data-vibeui-block="people-014"] [data-part="info"]{position:absolute;left:0;right:0;bottom:0;padding:1.3rem;color:#fff;display:grid;gap:.5rem}
[data-vibeui-block="people-014"] [data-part="name"]{margin:0;font-family:var(--vibeui-people-014-display);font-weight:700;font-size:1.3rem;letter-spacing:-.02em;line-height:1.1}
[data-vibeui-block="people-014"] [data-part="role"]{margin:0;font-size:.9rem;color:rgb(255 255 255 / .75)}
[data-vibeui-block="people-014"] [data-part="stats"]{display:flex;gap:1.4rem;margin:.3rem 0 0;padding:.7rem 0 0;border-top:1px solid rgb(255 255 255 / .18)}
[data-vibeui-block="people-014"] [data-part="stats"] div{display:grid}
[data-vibeui-block="people-014"] [data-part="stats"] b{font-family:var(--vibeui-people-014-display);font-weight:900;font-size:1.3rem;line-height:1;letter-spacing:-.03em;color:var(--vibeui-people-014-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="people-014"] [data-part="stats"] small{font-family:var(--vibeui-people-014-mono);font-size:.65rem;letter-spacing:.06em;text-transform:uppercase;color:rgb(255 255 255 / .6)}
[data-vibeui-block="people-014"] [data-part="skills"]{display:flex;flex-wrap:wrap;gap:.35rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="people-014"] [data-part="skills"] li{padding:.25rem .55rem;border-radius:999px;border:1px solid rgb(255 255 255 / .3);font-size:.72rem;color:rgb(255 255 255 / .85);backdrop-filter:blur(6px)}
@container (min-width: 40rem){[data-vibeui-block="people-014"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 56rem){[data-vibeui-block="people-014"] [data-part="head"]{grid-template-columns:minmax(0,1fr) minmax(0,26rem);gap:2rem}}
@container (min-width: 64rem){[data-vibeui-block="people-014"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.6rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-014"] *{animation:none!important;transition:none!important}[data-vibeui-block="people-014"] [data-part="card"]{transform:none}}`

const DEFAULT_MEMBERS: People014Member[] = [
  { name: "Артём Гущин", role: "Основатель, полировка и керамика", photo: "/demo/auto/master-01.webp", years: "11 лет", cars: "2 400", skills: ["Керамика", "Голограммы", "Porsche"] },
  { name: "Марат Сафин", role: "Оклейка плёнкой PPF", photo: "/demo/auto/master-02.webp", years: "8 лет", cars: "1 100", skills: ["XPEL", "Фронт без стыков", "Фары"] },
  { name: "Даша Орлова", role: "Салон, кожа, химчистка", photo: "/demo/auto/master-03.webp", years: "6 лет", cars: "1 800", skills: ["Кожа", "Алькантара", "Детские кресла"] },
]

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Мастера: карточки с фото, наклоном за курсором и бликом. */
export function People014({
  eyebrow = "Мастера",
  title = "Кто трогает вашу машину",
  lede = "Трое мастеров, каждый со своей темой. Без стажёров на чужих кузовах: сложное делает тот, кто на этом собаку съел.",
  members = DEFAULT_MEMBERS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: People014Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-014-accent": accent } : null),
    ...(ink ? { "--vibeui-people-014-fg": ink } : null),
    ...(background ? { "--vibeui-people-014-bg": background } : null),
    ...style,
  } as CSSProperties

  // Наклон и блик пишем в стиль карточки напрямую: перерисовка на каждое
  // движение курсора не нужна, а на тач-устройствах наклон не включаем.
  const tilt = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const card = event.currentTarget.style
    card.setProperty("--vibeui-people-014-ry", `${((px - 0.5) * 14).toFixed(2)}deg`)
    card.setProperty("--vibeui-people-014-rx", `${((0.5 - py) * 14).toFixed(2)}deg`)
    card.setProperty("--vibeui-people-014-gx", `${(px * 100).toFixed(1)}%`)
    card.setProperty("--vibeui-people-014-gy", `${(py * 100).toFixed(1)}%`)
  }
  const reset = (event: PointerEvent<HTMLLIElement>) => {
    const card = event.currentTarget.style
    card.removeProperty("--vibeui-people-014-ry")
    card.removeProperty("--vibeui-people-014-rx")
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-people-014" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="people-014" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {members.map((member, index) => (
              <li key={member.name} data-part="card" onPointerMove={tilt} onPointerLeave={reset}>
                {member.photo ? <img data-part="photo" src={member.photo} alt={member.name} loading="lazy" /> : <span data-part="initials" aria-hidden="true">{initials(member.name)}</span>}
                <i data-part="shade" aria-hidden="true" />
                <i data-part="glare" aria-hidden="true" />
                <span data-part="badge">№ {String(index + 1).padStart(2, "0")}</span>
                <div data-part="info">
                  <h3 data-part="name">{member.name}</h3>
                  <p data-part="role">{member.role}</p>
                  {member.skills && member.skills.length > 0 ? (
                    <ul data-part="skills">
                      {member.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  ) : null}
                  {member.years || member.cars ? (
                    <div data-part="stats">
                      {member.years ? (
                        <div>
                          <b>{member.years}</b>
                          <small>стаж</small>
                        </div>
                      ) : null}
                      {member.cars ? (
                        <div>
                          <b>{member.cars}</b>
                          <small>машин</small>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
