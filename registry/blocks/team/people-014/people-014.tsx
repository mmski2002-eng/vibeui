"use client"

import { type CSSProperties, type PointerEvent } from "react"
import { Card058 } from "@/registry/components/card/card-058/card-058"

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
  /** Подписи под цифрами карточки. */
  yearsLabel?: string
  carsLabel?: string
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
@container (min-width: 40rem){[data-vibeui-block="people-014"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 56rem){[data-vibeui-block="people-014"] [data-part="head"]{grid-template-columns:minmax(0,1fr) minmax(0,26rem);gap:2rem}}
@container (min-width: 64rem){[data-vibeui-block="people-014"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.6rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-014"] *{animation:none!important;transition:none!important}}`

const DEFAULT_MEMBERS: People014Member[] = [
  { name: "Артём Гущин", role: "Основатель, полировка и керамика", photo: "/demo/auto/master-01.webp", years: "11 лет", cars: "2 400", skills: ["Керамика", "Голограммы", "Porsche"] },
  { name: "Марат Сафин", role: "Оклейка плёнкой PPF", photo: "/demo/auto/master-02.webp", years: "8 лет", cars: "1 100", skills: ["XPEL", "Фронт без стыков", "Фары"] },
  { name: "Даша Орлова", role: "Салон, кожа, химчистка", photo: "/demo/auto/master-03.webp", years: "6 лет", cars: "1 800", skills: ["Кожа", "Алькантара", "Детские кресла"] },
]

/** Мастера: карточки с фото, наклоном за курсором и бликом. */
export function People014({
  eyebrow = "Мастера",
  title = "Кто трогает вашу машину",
  lede = "Трое мастеров, каждый со своей темой. Без стажёров на чужих кузовах: сложное делает тот, кто на этом собаку съел.",
  members = DEFAULT_MEMBERS,
  yearsLabel = "стаж",
  carsLabel = "машин",
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
              <Card058 key={member.name} data-part="card" name={member.name} photo={member.photo} role={member.role} skills={member.skills} years={member.years} cars={member.cars} yearsLabel={yearsLabel} carsLabel={carsLabel} index={index} onPointerMove={tilt} onPointerLeave={reset} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
