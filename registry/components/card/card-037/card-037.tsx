import type { ComponentProps, CSSProperties } from "react"

export type Card037Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  text?: string
  occasion?: string
  date?: string
  place?: string
  postLabel?: string
  linesLabel?: string
  toLabel?: string
  addressee?: string
  whereLabel?: string
  address?: string
  fromLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-028, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-037"]){
--vibeui-card-037-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-037-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-037-card:color-mix(in oklab,var(--vibeui-card-037-fg) 3%,var(--vibeui-card-037-bg));
--vibeui-card-037-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-card-037-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-037-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-037-hand:"Caveat","Segoe Script",cursive;
--vibeui-card-037-line:color-mix(in oklab,var(--vibeui-card-037-fg) 16%,transparent);
--vibeui-card-037-muted:color-mix(in oklab,var(--vibeui-card-037-fg) 62%,var(--vibeui-card-037-bg));
--vibeui-card-037-on-accent:oklch(from var(--vibeui-card-037-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-037"]{color-scheme:dark}
[data-vibeui-block="card-037"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-037"] *{box-sizing:border-box}
[data-vibeui-block="card-037"]{flex:0 0 min(88%,34rem);scroll-snap-align:start;display:grid;min-height:15rem;background:var(--vibeui-card-037-card);border:1px solid var(--vibeui-card-037-line);box-shadow:0 24px 40px -28px rgb(0 0 0 / .5);transform:rotate(var(--vibeui-card-037-r));transition:transform .45s cubic-bezier(.2,.7,.2,1),box-shadow .4s}
[data-vibeui-block="card-037"]:hover{transform:rotate(0) translateY(-6px);box-shadow:0 34px 50px -30px rgb(0 0 0 / .55)}
[data-vibeui-block="card-037"]:nth-child(even){--vibeui-card-037-r:1.4deg}
[data-vibeui-block="card-037"]:nth-child(odd){--vibeui-card-037-r:-1.2deg}
[data-vibeui-block="card-037"] [data-part="message"]{position:relative;padding:1.3rem 1.2rem 1.4rem;border-bottom:1px solid var(--vibeui-card-037-line);font-family:var(--vibeui-card-037-hand);font-size:1.35rem;line-height:1.2}
[data-vibeui-block="card-037"] [data-part="message"] p{margin:0}
[data-vibeui-block="card-037"] [data-part="occasion"]{display:block;margin:0 0 .6rem;font-family:var(--vibeui-card-037-font);font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-card-037-muted)}
[data-vibeui-block="card-037"] [data-part="side"]{position:relative;padding:1.1rem 1.1rem 1.3rem;display:grid;align-content:space-between;gap:1rem}
[data-vibeui-block="card-037"] [data-part="stamp"]{justify-self:end;width:3.4rem;height:4.1rem;padding:.3rem;background:var(--vibeui-card-037-bg);outline:.3rem dotted var(--vibeui-card-037-bg);outline-offset:-.15rem;box-shadow:0 0 0 1px var(--vibeui-card-037-line)}
[data-vibeui-block="card-037"] [data-part="stamp"] div{width:100%;height:100%;display:grid;place-items:center;background:var(--vibeui-card-037-accent);color:var(--vibeui-card-037-on-accent)}
[data-vibeui-block="card-037"] [data-part="stamp"] svg{width:70%;height:70%}
[data-vibeui-block="card-037"] [data-part="mark"]{position:absolute;right:3.6rem;top:1rem;width:4.2rem;height:4.2rem;border-radius:50%;border:1.5px solid color-mix(in oklab,var(--vibeui-card-037-fg) 55%,transparent);display:grid;place-items:center;text-align:center;font-size:.58rem;line-height:1.1;letter-spacing:.06em;text-transform:uppercase;color:color-mix(in oklab,var(--vibeui-card-037-fg) 70%,transparent);transform:rotate(-12deg);pointer-events:none}
[data-vibeui-block="card-037"] [data-part="mark"] b{display:block;font-family:var(--vibeui-card-037-display);font-size:.95rem;font-weight:600;letter-spacing:0;text-transform:none}
[data-vibeui-block="card-037"] [data-part="lines"]{display:grid;gap:.55rem;margin:0;padding:0;list-style:none;font-size:.8rem;color:var(--vibeui-card-037-muted)}
[data-vibeui-block="card-037"] [data-part="lines"] li{padding-bottom:.25rem;border-bottom:1px solid color-mix(in oklab,var(--vibeui-card-037-fg) 30%,transparent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="card-037"] [data-part="lines"] li b{font-family:var(--vibeui-card-037-hand);font-weight:500;font-size:1.1rem;color:var(--vibeui-card-037-fg)}
[data-vibeui-block="card-037"] [data-part="signature"]{margin:0;font-family:var(--vibeui-card-037-hand);font-size:1.25rem;line-height:1;color:var(--vibeui-card-037-accent);text-align:right}
@container (min-width: 34rem){
[data-vibeui-block="card-037"] [data-part="message"]{border-bottom:0;border-right:1px solid var(--vibeui-card-037-line)}
}
@container (min-width: 60rem){
[data-vibeui-block="card-037"] [data-part="message"]{padding:1.6rem 1.5rem;font-size:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-037"] *{animation:none!important;transition:none!important}}
`

/** Карточка-открытка: рукописный текст с поводом, марка и штемпель, подпись отправителя. */
export function Card037({
  name = "Ольга",
  text = "Подписка раз в две недели уже полгода. Ни разу не повторились, и всегда пишут, как ухаживать. Лучшее, что я себе покупаю.",
  occasion = "маме, 60 лет",
  date = "12 июня",
  place = "Петроградская",
  postLabel = "почта",
  linesLabel = "Адресат",
  toLabel = "кому:",
  addressee = "Мастерская «Стебель»",
  whereLabel = "куда:",
  address = "Пестеля, 4, Санкт-Петербург",
  fromLabel = "откуда:",
  accent,
  className,
  style,
  ...props
}: Card037Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-037-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-037" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-037"
        className={className}
        style={palette}
      >
        <blockquote data-part="message">
          {occasion ? <span data-part="occasion">{occasion}</span> : null}
          <p>{text}</p>
        </blockquote>
        <div data-part="side">
          <div data-part="stamp" aria-hidden="true">
            <div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V12M12 12c-4 0-6-3-6-6 4 0 6 2 6 6ZM12 12c4 0 6-3 6-6-4 0-6 2-6 6ZM12 12c0-4 2-7 0-10-2 3 0 6 0 10Z" />
              </svg>
            </div>
          </div>
          {date ? (
            <span data-part="mark" aria-hidden="true">
              <span>
                <b>{date}</b>
                {postLabel}
              </span>
            </span>
          ) : null}
          <ul data-part="lines" aria-label={linesLabel}>
            <li>
              {toLabel} <b>{addressee}</b>
            </li>
            <li>{whereLabel} {address}</li>
            <li>{fromLabel} {place ?? "—"}</li>
          </ul>
          <p data-part="signature">— {name}</p>
        </div>
      </li>
    </>
  )
}
