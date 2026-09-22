import type { ComponentProps, CSSProperties } from "react"

export type Card056Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  color?: string
  image?: string
  styles?: readonly string[]
  experience?: string
  slot?: string
  works?: readonly string[]
  href?: string
  bookLabel?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока people-009, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-056"]){
--vibeui-card-056-card:#110e1a;
--vibeui-card-056-cyan:#22f3ff;
--vibeui-card-056-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-056-line:rgb(255 255 255 / .12);
--vibeui-card-056-mono:"JetBrains Mono",ui-monospace,monospace;
--vibeui-card-056-muted:#a39bb5;
--vibeui-card-056-ok:#c8ff3a;
--vibeui-card-056-on-accent:#15121c;
}
[data-vibeui-block="card-056"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-056"] *{box-sizing:border-box}
@keyframes vibeui-card-056-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
[data-vibeui-block="card-056"]{perspective:1400px;animation:vibeui-card-056-in .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-card-056-n) * 90ms)}
[data-vibeui-block="card-056"] [data-part="card"]{position:relative;display:grid;aspect-ratio:4/5.4;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-056"]:hover [data-part="card"],[data-vibeui-block="card-056"]:focus-within [data-part="card"]{transform:rotateY(180deg)}
[data-vibeui-block="card-056"] [data-part="face"],[data-vibeui-block="card-056"] [data-part="back"]{grid-area:1/1;display:flex;flex-direction:column;padding:.75rem;border-radius:1rem;background:var(--vibeui-card-056-card);border:1px solid color-mix(in oklab,var(--vibeui-card-056-neon) 55%,transparent);box-shadow:0 0 0 1px rgb(0 0 0 / .4),0 0 18px color-mix(in oklab,var(--vibeui-card-056-neon) 35%,transparent),inset 0 0 20px color-mix(in oklab,var(--vibeui-card-056-neon) 8%,transparent);backface-visibility:hidden;-webkit-backface-visibility:hidden}
[data-vibeui-block="card-056"] [data-part="back"]{transform:rotateY(180deg);justify-content:space-between;padding:1rem}
[data-vibeui-block="card-056"] [data-part="portrait"]{width:100%;aspect-ratio:1;border-radius:.6rem;object-fit:cover;display:block;background:#1a1526;filter:contrast(1.05)}
[data-vibeui-block="card-056"] [data-part="name"]{margin:.9rem 0 0;font-family:var(--vibeui-card-056-display);font-size:1.2rem;font-weight:600;line-height:1.15;color:var(--vibeui-card-056-neon);text-shadow:0 0 12px color-mix(in oklab,var(--vibeui-card-056-neon) 60%,transparent)}
[data-vibeui-block="card-056"] [data-part="styles"]{display:flex;flex-wrap:wrap;gap:.35rem;margin:.6rem 0 0;padding:0;list-style:none}
[data-vibeui-block="card-056"] [data-part="styles"] li{padding:.2rem .55rem;border-radius:.35rem;border:1px solid var(--vibeui-card-056-line);font-size:.75rem;color:var(--vibeui-card-056-muted)}
[data-vibeui-block="card-056"] [data-part="exp"]{margin:auto 0 0;padding-top:.75rem;display:flex;justify-content:space-between;gap:.5rem;font-family:var(--vibeui-card-056-mono);font-size:.75rem;color:var(--vibeui-card-056-muted)}
[data-vibeui-block="card-056"] [data-part="slot"]{color:var(--vibeui-card-056-ok);text-shadow:0 0 8px color-mix(in oklab,var(--vibeui-card-056-ok) 60%,transparent)}
[data-vibeui-block="card-056"] [data-part="works"]{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="card-056"] [data-part="works"] img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:.4rem;display:block}
[data-vibeui-block="card-056"] [data-part="back-name"]{margin:.75rem 0 0;font-family:var(--vibeui-card-056-display);font-size:1rem;font-weight:600}
[data-vibeui-block="card-056"] [data-part="back-text"]{margin:.25rem 0 0;font-size:.85rem;color:var(--vibeui-card-056-muted)}
[data-vibeui-block="card-056"] [data-part="book"]{display:inline-flex;align-items:center;justify-content:center;height:2.8rem;margin-top:auto;border-radius:.6rem;background:var(--vibeui-card-056-neon);color:var(--vibeui-card-056-on-accent);font-weight:700;box-shadow:0 0 18px color-mix(in oklab,var(--vibeui-card-056-neon) 55%,transparent);transition:transform .2s}
[data-vibeui-block="card-056"] [data-part="book"]:hover{transform:translateY(-2px)}
[data-vibeui-block="card-056"] [data-part="book"]:focus-visible{outline:2px solid var(--vibeui-card-056-cyan);outline-offset:3px}
[data-vibeui-block="card-056"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="card-056"]{position:relative}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-056"] *{animation:none!important;transition:none!important}}
`

/** Полароид мастера с неоновой обводкой цвета из данных: фото, имя, стиль и ссылка на запись. */
export function Card056({
  name = "Лина",
  color = "Мастер-полароид с неоном",
  image = "/demo/realty/object-01.webp",
  styles = [],
  experience = "Мастер-полароид с неоном",
  slot = "Мастер-полароид с неоном",
  works = [],
  href = "#",
  bookLabel = "Записаться",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card056Props) {
  const palette = {
    ["--vibeui-card-056-neon" as string]: color ?? "#ff2bd6", ["--vibeui-card-056-n" as string]: index,
    ...(accent ? { "--vibeui-card-056-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-056" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-056"
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="face">
            {image ? <img data-part="portrait" src={image} alt={name} loading="lazy" /> : <span data-part="portrait" />}
            <h3 data-part="name">{name}</h3>
            <ul data-part="styles">
              {styles.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p data-part="exp">
              {experience ? <span>{experience}</span> : null}
              {slot ? <span data-part="slot">{slot}</span> : null}
            </p>
          </div>
          <div data-part="back" aria-hidden="true">
            <div>
              {works && works.length > 0 ? (
                <ul data-part="works">
                  {works.map((work) => (
                    <li key={work}>
                      <img src={work} alt="" loading="lazy" />
                    </li>
                  ))}
                </ul>
              ) : null}
              <p data-part="back-name">{name}</p>
              <p data-part="back-text">{styles.join(" · ")}</p>
            </div>
            {bookLabel ? (
              <a data-part="book" href={href ?? "#"} tabIndex={-1}>
                {bookLabel}
              </a>
            ) : null}
          </div>
        </div>
        {bookLabel ? (
          <a data-part="sr" href={href ?? "#"}>
            {bookLabel}: {name}
          </a>
        ) : null}
      </li>
    </>
  )
}
