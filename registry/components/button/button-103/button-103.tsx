import type { ComponentProps, CSSProperties } from "react"

export type Button103Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  src?: string
  shape?: "wide" | "tall" | "square"
  caption?: string
  alt?: string
  from?: string
  date?: string
  back?: string
  addressee?: string
  flipped?: ReadonlySet<number>
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока portfolio-009, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-103"]){
--vibeui-button-103-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-103-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-button-103-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-button-103-ink:#123a4b;
--vibeui-button-103-line:light-dark(#e3d7bf,#2e2e2e);
--vibeui-button-103-muted:light-dark(#5b6f78,#a3a3a3);
--vibeui-button-103-paper:#fffaf0;
--vibeui-button-103-script:"Lobster","Brush Script MT",cursive;
--vibeui-button-103-sea:#2aa7a0;
--vibeui-button-103-sun:#f2c14e;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-103"]{color-scheme:dark}
[data-vibeui-block="button-103"]{box-sizing:border-box}
[data-vibeui-block="button-103"] *{box-sizing:border-box}
[data-vibeui-block="button-103"]{position:relative;display:block;width:100%;margin:0 0 1.25rem;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer;break-inside:avoid;perspective:1400px}
[data-vibeui-block="button-103"]:focus-visible{outline:none}
[data-vibeui-block="button-103"]:focus-visible [data-part="inner"]{outline:3px solid var(--vibeui-button-103-sea);outline-offset:4px}
[data-vibeui-block="button-103"] [data-part="inner"]{position:relative;display:block;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.2,.9,.3,1);border-radius:.3rem}
[data-vibeui-block="button-103"][data-flipped="true"] [data-part="inner"]{transform:rotateY(180deg)}
[data-vibeui-block="button-103"]:hover [data-part="inner"]{box-shadow:0 26px 40px -26px rgb(18 58 75 / .6)}
[data-vibeui-block="button-103"] [data-part="front"],[data-vibeui-block="button-103"] [data-part="back"]{backface-visibility:hidden;border-radius:.3rem;background:var(--vibeui-button-103-paper);color:var(--vibeui-button-103-ink);box-shadow:0 18px 30px -24px rgb(18 58 75 / .6)}
[data-vibeui-block="button-103"] [data-part="front"]{position:relative;display:block;padding:.7rem .7rem 2.4rem}
[data-vibeui-block="button-103"] [data-part="front"]::before{content:"";position:absolute;top:-.55rem;left:50%;width:5rem;height:1.3rem;margin-left:-2.5rem;background:rgb(255 255 255 / .55);box-shadow:0 1px 2px rgb(0 0 0 / .12);transform:rotate(-2deg)}
[data-vibeui-block="button-103"]:nth-child(3n) [data-part="front"]::before{transform:rotate(3deg)}
[data-vibeui-block="button-103"] [data-part="pic"]{display:block;overflow:hidden;background:var(--vibeui-button-103-line);aspect-ratio:3/2}
[data-vibeui-block="button-103"][data-shape="tall"] [data-part="pic"]{aspect-ratio:4/5}
[data-vibeui-block="button-103"][data-shape="square"] [data-part="pic"]{aspect-ratio:1}
[data-vibeui-block="button-103"] [data-part="pic"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(1.05)}
[data-vibeui-block="button-103"] [data-part="cap"]{position:absolute;left:.7rem;right:.7rem;bottom:.55rem;font-family:var(--vibeui-button-103-script);font-size:1.15rem;line-height:1.2;color:var(--vibeui-button-103-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="button-103"] [data-part="back"]{position:absolute;inset:0;display:grid;grid-template-columns:1.2fr 1fr;transform:rotateY(180deg);overflow:hidden}
[data-vibeui-block="button-103"] [data-part="back"]::before{content:"";position:absolute;top:1rem;bottom:1rem;left:55%;width:1px;background:var(--vibeui-button-103-line)}
[data-vibeui-block="button-103"] [data-part="text"]{padding:1.1rem 1rem 1rem 1.1rem;font-family:var(--vibeui-button-103-script);font-size:1.05rem;line-height:1.35;overflow:hidden}
[data-vibeui-block="button-103"] [data-part="text"] small{display:block;margin-bottom:.4rem;font-family:var(--vibeui-button-103-font);font-size:.6rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-button-103-muted)}
[data-vibeui-block="button-103"] [data-part="addr"]{position:relative;display:grid;align-content:end;gap:.4rem;padding:1rem 1rem 1rem 1.4rem}
[data-vibeui-block="button-103"] [data-part="addr"] i{display:block;height:1px;background:var(--vibeui-button-103-line)}
[data-vibeui-block="button-103"] [data-part="addr"] span{font-family:var(--vibeui-button-103-script);font-size:1rem;color:var(--vibeui-button-103-ink)}
[data-vibeui-block="button-103"] [data-part="postmark"]{position:absolute;top:.7rem;right:.7rem;width:4.2rem;height:4.2rem;transform:rotate(-12deg);opacity:.85}
[data-vibeui-block="button-103"] [data-part="postmark"] svg{display:block;width:100%;height:100%;overflow:visible}
[data-vibeui-block="button-103"] [data-part="postmark"] circle{fill:none;stroke:var(--vibeui-button-103-accent);stroke-width:2}
[data-vibeui-block="button-103"] [data-part="postmark"] text{font-family:var(--vibeui-button-103-display);font-weight:600;fill:var(--vibeui-button-103-accent);text-anchor:middle;letter-spacing:1px}
[data-vibeui-block="button-103"] [data-part="stamp"]{position:absolute;top:.6rem;right:5.2rem;width:2.4rem;height:2.9rem;border:.25rem solid var(--vibeui-button-103-paper);background:var(--vibeui-button-103-sea);outline:2px dashed var(--vibeui-button-103-paper);outline-offset:-.45rem;box-shadow:0 0 0 1px var(--vibeui-button-103-line)}
[data-vibeui-block="button-103"]:nth-child(even) [data-part="stamp"]{background:var(--vibeui-button-103-sun)}
@container (max-width:40rem){
[data-vibeui-block="button-103"] [data-part="back"]{grid-template-columns:1fr}
[data-vibeui-block="button-103"] [data-part="back"]::before,[data-vibeui-block="button-103"] [data-part="addr"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-103"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-карточка с переворотом: лицевая сторона с фото и оборот с текстом; перевёрнута по data-flipped. */
export function Button103({
  src = "/demo/realty/district-01.webp",
  shape = "wide",
  caption = "Переворачивающаяся карточка",
  alt = "Переворачивающаяся карточка",
  from = "Cayo Largo",
  date = "10.2025",
  back = "Соня едет на раме и командует. Я кручу. Всё как всегда.",
  addressee = "Дорогим гостям",
  flipped = new Set(),
  index = 0,
  accent,
  className,
  style,
  ...props
}: Button103Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-103-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-103" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-103" type="button" data-shape={shape ?? "wide"}
        className={className}
        style={palette}
      >
        <span data-part="inner">
          <span data-part="front">
            <span data-part="pic">{src ? <img src={src} alt={alt ?? ""} loading="lazy" /> : null}</span>
            {caption ? <span data-part="cap">{caption}</span> : null}
          </span>
          <span data-part="back" aria-hidden={!flipped.has(index)}>
            <span data-part="text">
              {from || date ? <small>{[from, date].filter(Boolean).join(", ")}</small> : null}
              {back}
            </span>
            <span data-part="addr">
              <span data-part="stamp" aria-hidden="true" />
              <span data-part="postmark" aria-hidden="true">
                <svg viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="27" />
                  <circle cx="30" cy="30" r="21" strokeWidth="1" />
                  <text x="30" y="27" fontSize="7">
                    {from ?? ""}
                  </text>
                  <text x="30" y="37" fontSize="6.5">
                    {date ?? ""}
                  </text>
                </svg>
              </span>
              <i />
              <i />
              <i />
              <span>{addressee}</span>
            </span>
          </span>
        </span>
      </button>
    </>
  )
}
