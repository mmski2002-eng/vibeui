import type { ComponentProps, CSSProperties } from "react"

export type Card113Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  number?: string
  object?: string
  date?: string
  text?: string
  remark?: string
  name?: string
  actLabel?: string
  starsLabel?: string
  remarkLabel?: string
  signLabel?: string
  remarkStampLabel?: string
  stampLabel?: string
  stars?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-029, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-113"]){
--vibeui-card-113-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-113-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-113-hand:"Caveat",cursive;
--vibeui-card-113-line:color-mix(in oklab,var(--vibeui-card-113-fg) 16%,transparent);
--vibeui-card-113-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-113-muted:color-mix(in oklab,var(--vibeui-card-113-fg) 62%,var(--vibeui-card-113-bg));
--vibeui-card-113-paper:color-mix(in oklab,var(--vibeui-card-113-bg) 90%,var(--vibeui-card-113-fg));
--vibeui-card-113-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-113"]{color-scheme:dark}
[data-vibeui-block="card-113"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-113"] *{box-sizing:border-box}
@keyframes vibeui-card-113-stamp{from{transform:rotate(-8deg) scale(1.7);opacity:0}to{transform:rotate(-8deg) scale(1);opacity:.95}}
[data-vibeui-block="card-113"]{position:relative;display:flex;flex-direction:column;gap:1rem;padding:1.4rem;border:1px solid var(--vibeui-card-113-fg);background:var(--vibeui-card-113-paper);box-shadow:0 20px 40px -32px rgb(0 0 0 / .5);overflow:hidden}
[data-vibeui-block="card-113"]::before{content:"";position:absolute;inset:.4rem;border:1px solid var(--vibeui-card-113-line);pointer-events:none}
[data-vibeui-block="card-113"] [data-part="act-head"]{display:grid;gap:.15rem;padding-bottom:.8rem;border-bottom:1px solid var(--vibeui-card-113-line);font-family:var(--vibeui-card-113-mono);font-size:.7rem;letter-spacing:.04em;color:var(--vibeui-card-113-muted)}
[data-vibeui-block="card-113"] [data-part="act-head"] b{font-size:.8rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-card-113-fg)}
[data-vibeui-block="card-113"] [data-part="quote"]{margin:0;font-size:1rem;line-height:1.55}
[data-vibeui-block="card-113"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="card-113"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="card-113"] [data-part="stars"]{display:inline-flex;gap:.15rem;font-family:var(--vibeui-card-113-mono);font-size:.85rem;letter-spacing:.1em;color:var(--vibeui-card-113-accent)}
[data-vibeui-block="card-113"] [data-part="stars"] [data-off="true"]{color:var(--vibeui-card-113-line)}
[data-vibeui-block="card-113"] [data-part="remark"]{margin:0;padding:.6rem .8rem;border-left:2px solid var(--vibeui-card-113-accent);background:color-mix(in oklab,var(--vibeui-card-113-fg) 5%,transparent);font-size:.82rem;color:var(--vibeui-card-113-muted)}
[data-vibeui-block="card-113"] [data-part="remark"] b{font-family:var(--vibeui-card-113-mono);font-size:.66rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-card-113-fg)}
[data-vibeui-block="card-113"] [data-part="sign"]{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:1rem;margin-top:auto;padding-top:.6rem;min-height:3.4rem}
[data-vibeui-block="card-113"] [data-part="sign"] div{display:grid;gap:.1rem;max-width:calc(100% - 10rem);border-bottom:1px solid var(--vibeui-card-113-fg);padding-bottom:.1rem}
[data-vibeui-block="card-113"] [data-part="sign"] i{font-family:var(--vibeui-card-113-hand);font-style:normal;font-weight:600;font-size:1.7rem;line-height:1;color:color-mix(in oklab,var(--vibeui-card-113-fg) 85%,#1d4ed8)}
[data-vibeui-block="card-113"] [data-part="sign"] small{font-family:var(--vibeui-card-113-mono);font-size:.6rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-card-113-muted)}
[data-vibeui-block="card-113"] [data-part="stamp"]{position:absolute;right:1.3rem;bottom:1.1rem;max-width:9.5rem;padding:.45rem .7rem;text-align:center;line-height:1.35;border:2px solid var(--vibeui-card-113-fg);color:var(--vibeui-card-113-fg);background:color-mix(in oklab,var(--vibeui-card-113-accent) 55%,transparent);font-family:var(--vibeui-card-113-mono);font-size:.62rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;transform:rotate(-8deg);opacity:.95;pointer-events:none;animation:vibeui-card-113-stamp .6s cubic-bezier(.2,1.4,.4,1) both}
[data-vibeui-block="card-113"] [data-part="stamp"]::after{content:"";position:absolute;inset:3px;border:1px solid currentColor;opacity:.5}
[data-vibeui-block="card-113"] [data-part="stamp"][data-kind="remark"]{background:transparent;border-style:dashed}
@supports (animation-timeline: view()){
[data-vibeui-block="card-113"] [data-part="stamp"]{animation:vibeui-card-113-stamp linear both;animation-timeline:view();animation-range:entry 20% entry 70%}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-113"] [data-part="stamp"]{transform:rotate(-8deg);opacity:.95}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-113"] *{animation:none!important;transition:none!important}}
`

/** Отзыв в театральном стиле: номер, звёзды, цитата, имя и роль. */
export function Card113({
  number = "0298",
  object = "Двушка на Ленинском, 62 м²",
  date = "14.08.2026",
  text = "Сдали на два дня раньше срока. Каждый вечер фото в чате, я ни разу не ездила проверять. Плитку в санузле переложили бы, если бы я попросила — не пришлось.",
  remark = "царапина на подоконнике — заменили за два дня, до подписания акта",
  name = "Анна Р.",
  actLabel = "Акт приёмки № {n}",
  starsLabel = "{n} из 5",
  remarkLabel = "Замечание: ",
  signLabel = "Подпись заказчика",
  remarkStampLabel = "Замечание устранено",
  stampLabel = "Принято без замечаний",
  stars = 5,
  accent,
  className,
  style,
  ...props
}: Card113Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-113-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-113" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-113"
        className={className}
        style={palette}
      >
        <div data-part="act-head">
          <b>{actLabel.replace("{n}", number)}</b>
          <span>{object}</span>
          <span>{date}</span>
        </div>
        <blockquote data-part="quote">{text}</blockquote>
        <span data-part="stars" role="img" aria-label={starsLabel.replace("{n}", String(stars))}>
          {[0, 1, 2, 3, 4].map((index) => (
            <span key={index} data-off={index >= stars} aria-hidden="true">
              ★
            </span>
          ))}
        </span>
        {remark ? (
          <p data-part="remark">
            <b>{remarkLabel}</b>
            {remark}
          </p>
        ) : null}
        <div data-part="sign">
          <div>
            <i>{name}</i>
            <small>{signLabel}</small>
          </div>
        </div>
        <span data-part="stamp" data-kind={remark ? "remark" : "ok"} aria-hidden="true">
          {remark ? remarkStampLabel : stampLabel}
        </span>
      </li>
    </>
  )
}
