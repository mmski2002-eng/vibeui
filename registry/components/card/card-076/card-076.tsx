import type { ComponentProps, CSSProperties } from "react"

export type Card076Kind = "transfer" | "tax" | "fx" | "export" | "cards" | "support"

export type Card076Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  title?: string
  large?: boolean
  meta?: string
  kind?: Card076Kind
  labels?: readonly string[]
  text?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Figure({ kind, labels = [] }: { kind: Card076Kind; labels?: readonly string[] }) {
  switch (kind) {
    case "transfer":
      return (
        <div data-part="transfer" aria-hidden="true">
          <span data-part="node">{labels[0] ?? "Ваш счёт"}</span>
          <span data-part="wire" data-amount={labels[2] ?? "48 900 ₽"} />
          <span data-part="node">
            {labels[1] ?? "ООО «Прим»"}
            <i data-part="tick">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </i>
          </span>
        </div>
      )
    case "tax":
      return (
        <div data-part="tax" aria-hidden="true">
          {[0.35, 0.5, 0.42, 0.65, 0.58, 0.8, 1].map((height, index) => (
            <i key={index} style={{ height: `${height * 100}%`, ["--vibeui-card-076-i" as string]: index }} />
          ))}
        </div>
      )
    case "fx":
      return (
        <div data-part="fx" aria-hidden="true">
          {["₽", "¥", "$", "€"].map((symbol, index) => (
            <b key={symbol} style={{ ["--vibeui-card-076-i" as string]: index }}>
              {symbol}
            </b>
          ))}
        </div>
      )
    case "export":
      return (
        <div data-part="export" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <i key={index} style={{ ["--vibeui-card-076-i" as string]: index }} />
          ))}
          <b>.xml</b>
        </div>
      )
    case "cards":
      return (
        <div data-part="cards" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <i key={index} style={{ ["--vibeui-card-076-i" as string]: index }} />
          ))}
        </div>
      )
    default:
      return (
        <div data-part="support" aria-hidden="true">
          <span>{labels[0] ?? "Не проходит платёж в Китай"}</span>
          <em>
            {[0, 1, 2].map((index) => (
              <i key={index} style={{ ["--vibeui-card-076-i" as string]: index }} />
            ))}
          </em>
        </div>
      )
  }
}

// Часть блока bento-009, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-076"]){
--vibeui-card-076-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-076-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-076-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-076-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-076-glass:color-mix(in oklab,var(--vibeui-card-076-fg) 5%,transparent);
--vibeui-card-076-line:color-mix(in oklab,var(--vibeui-card-076-fg) 11%,transparent);
--vibeui-card-076-mint:color-mix(in oklab,var(--vibeui-card-076-accent) 45%,#99f6e4);
--vibeui-card-076-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
--vibeui-card-076-muted:color-mix(in oklab,var(--vibeui-card-076-fg) 62%,var(--vibeui-card-076-bg));
--vibeui-card-076-on-accent:oklch(from var(--vibeui-card-076-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-076-fg:light-dark(#1a1a1a,#f2f2f2);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-076"]{color-scheme:dark}
[data-vibeui-block="card-076"]{box-sizing:border-box;min-width:min(100%,12rem);list-style:none}
[data-vibeui-block="card-076"] *{box-sizing:border-box}
@keyframes vibeui-card-076-write{0%{transform:scaleX(0)}40%,85%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-card-076-tick{0%,60%{transform:scale(0)}70%{transform:scale(1.2)}78%,92%{transform:scale(1)}100%{transform:scale(0)}}
@keyframes vibeui-card-076-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-card-076-run{0%{transform:translateX(0);opacity:0}10%{opacity:1}60%{transform:translateX(calc(100cqw - .8rem));opacity:1}70%{opacity:0}100%{transform:translateX(calc(100cqw - .8rem));opacity:0}}
@keyframes vibeui-card-076-receive{0%,60%{box-shadow:0 0 0 0 transparent}70%{box-shadow:0 0 0 .5rem color-mix(in oklab,var(--vibeui-card-076-accent) 35%,transparent)}100%{box-shadow:0 0 0 1rem transparent}}
@keyframes vibeui-card-076-grow{0%{transform:scaleY(.15)}45%,80%{transform:scaleY(1)}100%{transform:scaleY(.15)}}
@keyframes vibeui-card-076-fx{0%,20%{opacity:0;transform:translateY(8px)}5%,15%{opacity:1;transform:translateY(0)}25%,100%{opacity:0;transform:translateY(-8px)}}
@keyframes vibeui-card-076-dots{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-3px);opacity:1}}
@keyframes vibeui-card-076-amount{0%{opacity:0;transform:translate(-50%,6px)}15%{opacity:1;transform:translate(-50%,0)}60%{opacity:1}75%,100%{opacity:0}}
[data-vibeui-block="card-076"]{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-rows:1fr auto;gap:1.2rem;min-height:15rem;padding:1.4rem;border-radius:1.5rem;background:var(--vibeui-card-076-glass);border:1px solid var(--vibeui-card-076-line);transition:border-color .3s,transform .3s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="card-076"]::before{content:"";position:absolute;z-index:-1;inset:-40% -20% auto;height:80%;background:radial-gradient(closest-side,var(--vibeui-card-076-accent),transparent);opacity:0;filter:blur(50px);transition:opacity .5s;pointer-events:none}
[data-vibeui-block="card-076"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-076-accent) 45%,transparent);transform:translateY(-3px)}
[data-vibeui-block="card-076"]:hover::before{opacity:.28}
[data-vibeui-block="card-076"] [data-part="meta"]{position:absolute;top:1.1rem;right:1.1rem;padding:.2rem .6rem;border-radius:999px;font-family:var(--vibeui-card-076-mono);font-size:.7rem;background:color-mix(in oklab,var(--vibeui-card-076-accent) 16%,transparent);color:var(--vibeui-card-076-accent)}
[data-vibeui-block="card-076"] h3{margin:0 0 .3rem;font-family:var(--vibeui-card-076-display);font-weight:700;font-size:1.2rem;letter-spacing:-.02em}
[data-vibeui-block="card-076"] p{margin:0;font-size:.92rem;color:var(--vibeui-card-076-muted)}
[data-vibeui-block="card-076"] [data-part="figure"]{display:grid;place-items:center;min-height:6rem;font-family:var(--vibeui-card-076-mono)}
[data-vibeui-block="card-076"] [data-part="transfer"]{position:relative;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.8rem;width:100%;max-width:26rem}
[data-vibeui-block="card-076"] [data-part="node"]{display:grid;place-items:center;width:3.2rem;height:3.2rem;border-radius:50%;background:var(--vibeui-card-076-bg);border:1px solid var(--vibeui-card-076-line);font-size:.68rem;font-weight:600;text-align:center;line-height:1.1}
[data-vibeui-block="card-076"] [data-part="node"]:last-child{animation:vibeui-card-076-receive 4s ease-out infinite}
[data-vibeui-block="card-076"] [data-part="wire"]{position:relative;height:2px;background:var(--vibeui-card-076-line);border-radius:2px;container-type:inline-size}
[data-vibeui-block="card-076"] [data-part="wire"]::before{content:"";position:absolute;top:50%;left:0;width:.8rem;height:.8rem;margin-top:-.4rem;border-radius:50%;background:var(--vibeui-card-076-accent);box-shadow:0 0 16px var(--vibeui-card-076-accent);animation:vibeui-card-076-run 4s cubic-bezier(.4,0,.2,1) infinite}
[data-vibeui-block="card-076"] [data-part="wire"]::after{content:attr(data-amount);position:absolute;left:50%;bottom:.9rem;transform:translateX(-50%);font-size:.78rem;font-weight:600;color:var(--vibeui-card-076-accent);white-space:nowrap;animation:vibeui-card-076-amount 4s ease-out infinite}
[data-vibeui-block="card-076"] [data-part="tick"]{position:absolute;right:-.3rem;top:-.3rem;width:1.3rem;height:1.3rem;border-radius:50%;background:var(--vibeui-card-076-accent);color:var(--vibeui-card-076-on-accent);display:grid;place-items:center;transform:scale(0);animation:vibeui-card-076-tick 4s ease-out infinite}
[data-vibeui-block="card-076"] [data-part="tick"] svg{width:.7rem;height:.7rem}
[data-vibeui-block="card-076"] [data-part="tax"]{display:flex;align-items:flex-end;gap:.35rem;height:4.5rem}
[data-vibeui-block="card-076"] [data-part="tax"] i{display:block;width:.9rem;border-radius:.3rem .3rem 0 0;background:color-mix(in oklab,var(--vibeui-card-076-accent) 35%,var(--vibeui-card-076-line));transform-origin:bottom;animation:vibeui-card-076-grow 3.6s cubic-bezier(.2,.7,.2,1) infinite;animation-delay:calc(var(--vibeui-card-076-i) * .18s)}
[data-vibeui-block="card-076"] [data-part="tax"] i:last-child{background:var(--vibeui-card-076-accent)}
[data-vibeui-block="card-076"] [data-part="fx"]{position:relative;display:grid;place-items:center;width:5rem;height:5rem;border-radius:50%;border:1px dashed color-mix(in oklab,var(--vibeui-card-076-accent) 50%,transparent);font-size:2rem;font-weight:600}
[data-vibeui-block="card-076"] [data-part="fx"] b{position:absolute;opacity:0;animation:vibeui-card-076-fx 6s ease-in-out infinite;animation-delay:calc(var(--vibeui-card-076-i) * 1.5s)}
[data-vibeui-block="card-076"] [data-part="fx"]::after{content:"";position:absolute;inset:-.5rem;border-radius:50%;border:1px solid var(--vibeui-card-076-line);border-top-color:var(--vibeui-card-076-accent);animation:vibeui-card-076-spin 4s linear infinite}
[data-vibeui-block="card-076"] [data-part="export"]{display:grid;gap:.5rem;width:100%;max-width:12rem;padding:.9rem;border-radius:.8rem;background:var(--vibeui-card-076-bg);border:1px solid var(--vibeui-card-076-line)}
[data-vibeui-block="card-076"] [data-part="export"] i{display:block;height:.45rem;border-radius:999px;background:var(--vibeui-card-076-line);transform-origin:left;animation:vibeui-card-076-write 3.2s ease-out infinite;animation-delay:calc(var(--vibeui-card-076-i) * .4s)}
[data-vibeui-block="card-076"] [data-part="export"] i:nth-child(2){width:70%}
[data-vibeui-block="card-076"] [data-part="export"] i:nth-child(4){width:55%}
[data-vibeui-block="card-076"] [data-part="export"] b{justify-self:end;padding:.15rem .5rem;border-radius:.4rem;font-size:.68rem;background:var(--vibeui-card-076-accent);color:var(--vibeui-card-076-on-accent)}
[data-vibeui-block="card-076"] [data-part="cards"]{position:relative;width:7.5rem;height:5rem}
[data-vibeui-block="card-076"] [data-part="cards"] i{position:absolute;inset:0;border-radius:.6rem;border:1px solid rgb(255 255 255 / .18);background:linear-gradient(135deg,#1b2350,#0b1030);box-shadow:0 10px 24px -12px rgb(0 0 0 / .8);transform-origin:bottom left;transform:rotate(calc(var(--vibeui-card-076-i) * -6deg)) translateY(calc(var(--vibeui-card-076-i) * -.2rem));transition:transform .5s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="card-076"] [data-part="cards"] i::after{content:"";position:absolute;left:.6rem;top:.6rem;width:1rem;height:.7rem;border-radius:.15rem;background:linear-gradient(135deg,#f5e6a8,#c9a54b)}
[data-vibeui-block="card-076"] [data-part="cards"] i:last-child{background:linear-gradient(135deg,var(--vibeui-card-076-accent),var(--vibeui-card-076-mint))}
[data-vibeui-block="card-076"]:hover [data-part="cards"] i{transform:rotate(calc(var(--vibeui-card-076-i) * -14deg)) translate(calc(var(--vibeui-card-076-i) * .6rem),calc(var(--vibeui-card-076-i) * -.5rem))}
[data-vibeui-block="card-076"] [data-part="support"]{display:grid;gap:.5rem;width:100%;max-width:13rem}
[data-vibeui-block="card-076"] [data-part="support"] span{justify-self:end;padding:.45rem .8rem;border-radius:1rem 1rem .2rem 1rem;background:var(--vibeui-card-076-accent);color:var(--vibeui-card-076-on-accent);font-family:var(--vibeui-card-076-font);font-size:.8rem}
[data-vibeui-block="card-076"] [data-part="support"] em{display:inline-flex;gap:.25rem;padding:.55rem .7rem;border-radius:1rem 1rem 1rem .2rem;background:var(--vibeui-card-076-bg);border:1px solid var(--vibeui-card-076-line)}
[data-vibeui-block="card-076"] [data-part="support"] em i{width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-card-076-muted);animation:vibeui-card-076-dots 1.2s ease-in-out infinite;animation-delay:calc(var(--vibeui-card-076-i) * .2s)}
@container (min-width: 44rem){
[data-vibeui-block="card-076"][data-large="true"]{grid-column:span 2}
}
@container (min-width: 64rem){
[data-vibeui-block="card-076"][data-large="true"]{grid-column:span 4;grid-row:span 2}
[data-vibeui-block="card-076"][data-large="true"] [data-part="figure"]{min-height:12rem}
[data-vibeui-block="card-076"][data-large="true"] h3{font-size:1.5rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-076"] [data-part="tick"]{transform:scale(1)}
[data-vibeui-block="card-076"] [data-part="fx"] b:first-child{opacity:1}
[data-vibeui-block="card-076"] [data-part="wire"]::before{transform:translateX(calc(100cqw - .8rem))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-076"] *{animation:none!important;transition:none!important}}
`

/** Плитка bento-сетки: подпись meta, иллюстрация по виду (столбики, валюты, карточки, список) и текст. Крупная вариация по data-large. */
export function Card076({
  title = "Переводы по СБП за секунды",
  large,
  meta,
  kind = "transfer",
  labels = [],
  text = "Контрагенту, сотруднику или самому себе — по номеру телефона или реквизитам. Комиссии нет, деньги приходят до того, как вы закроете приложение.",
  accent,
  className,
  style,
  ...props
}: Card076Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-076-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-076" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-076" data-large={large ? "true" : undefined}
        className={className}
        style={palette}
      >
        {meta ? <span data-part="meta">{meta}</span> : null}
        <div data-part="figure">
          <Figure kind={kind} labels={labels} />
        </div>
        <div>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      </li>
    </>
  )
}
