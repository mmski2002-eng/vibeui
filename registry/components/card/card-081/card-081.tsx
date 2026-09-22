import type { ComponentProps, CSSProperties } from "react"

export type Card081Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  name?: string
  image?: string
  imageAlt?: string
  meta?: string
  openLabel?: string
  stampLines?: readonly [string, string]
  fromLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока charity-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-081"]){
--vibeui-card-081-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-081-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-081-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-081-hand:"Caveat","Segoe Script",cursive;
--vibeui-card-081-line:color-mix(in oklab,var(--vibeui-card-081-fg) 16%,transparent);
--vibeui-card-081-muted:color-mix(in oklab,var(--vibeui-card-081-fg) 62%,var(--vibeui-card-081-bg));
--vibeui-card-081-on-accent:oklch(from var(--vibeui-card-081-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-081-paper:color-mix(in oklab,var(--vibeui-card-081-fg) 3%,var(--vibeui-card-081-bg));
--vibeui-card-081-soft:color-mix(in oklab,var(--vibeui-card-081-fg) 6%,var(--vibeui-card-081-bg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-081"]{color-scheme:dark}
[data-vibeui-block="card-081"]{box-sizing:border-box}
[data-vibeui-block="card-081"] *{box-sizing:border-box}
[data-vibeui-block="card-081"]{position:absolute;inset:0;display:block;width:100%;padding:0;border:0;background:var(--vibeui-card-081-paper);color:inherit;font:inherit;text-align:left;cursor:pointer;border:1px solid var(--vibeui-card-081-line);box-shadow:0 24px 48px -28px rgb(0 0 0 / .5);perspective:900px;transition:opacity .4s ease .35s,transform .4s ease .35s}
[data-vibeui-block="card-081"]:focus-visible{outline:2px solid var(--vibeui-card-081-accent);outline-offset:3px}
[data-vibeui-block="card-081"] [data-part="pocket"]{position:absolute;inset:0;background:linear-gradient(to bottom right,transparent 49.6%,var(--vibeui-card-081-line) 49.6%,var(--vibeui-card-081-line) 50.4%,transparent 50.4%) top left/50% 60% no-repeat,linear-gradient(to bottom left,transparent 49.6%,var(--vibeui-card-081-line) 49.6%,var(--vibeui-card-081-line) 50.4%,transparent 50.4%) top right/50% 60% no-repeat;opacity:.7;pointer-events:none}
[data-vibeui-block="card-081"] [data-part="flap"]{position:absolute;left:0;right:0;top:0;height:45%;background:color-mix(in oklab,var(--vibeui-card-081-fg) 5%,var(--vibeui-card-081-paper));clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:top;transition:transform .55s cubic-bezier(.4,0,.2,1);z-index:2}
[data-vibeui-block="card-081"] [data-part="flap"]::after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom right,transparent 49.5%,var(--vibeui-card-081-line) 49.5%,var(--vibeui-card-081-line) 50.5%,transparent 50.5%) left/50% 100% no-repeat,linear-gradient(to bottom left,transparent 49.5%,var(--vibeui-card-081-line) 49.5%,var(--vibeui-card-081-line) 50.5%,transparent 50.5%) right/50% 100% no-repeat}
[data-vibeui-block="card-081"]:hover [data-part="flap"]{transform:rotateX(-22deg)}
[data-vibeui-block="card-081"] [data-part="seal"]{position:absolute;left:50%;top:42%;z-index:3;width:2.6rem;height:2.6rem;margin:-1.3rem 0 0 -1.3rem;border-radius:50%;background:var(--vibeui-card-081-accent);color:var(--vibeui-card-081-on-accent);display:grid;place-items:center;box-shadow:0 6px 14px -6px var(--vibeui-card-081-accent);transition:transform .3s}
[data-vibeui-block="card-081"] [data-part="seal"] svg{width:1.2rem;height:1.2rem}
[data-vibeui-block="card-081"]:hover [data-part="seal"]{transform:scale(1.08)}
[data-vibeui-block="card-081"] [data-part="stamp"]{position:absolute;top:1rem;right:1rem;z-index:3;width:4.6rem;aspect-ratio:4/5;padding:.3rem;background:var(--vibeui-card-081-bg);-webkit-mask:radial-gradient(circle .22rem,transparent 96%,#000 100%) -.22rem -.22rem/.6rem .6rem;mask:radial-gradient(circle .22rem,transparent 96%,#000 100%) -.22rem -.22rem/.6rem .6rem;transform:rotate(3deg)}
[data-vibeui-block="card-081"] [data-part="stamp"] i{display:block;width:100%;height:100%;overflow:hidden;background:linear-gradient(135deg,var(--vibeui-card-081-soft),color-mix(in oklab,var(--vibeui-card-081-accent) 30%,var(--vibeui-card-081-bg)))}
[data-vibeui-block="card-081"] [data-part="stamp"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="card-081"] [data-part="post"]{position:absolute;top:1.3rem;right:5.6rem;z-index:3;width:3.2rem;height:3.2rem;border-radius:50%;border:2px solid color-mix(in oklab,var(--vibeui-card-081-accent) 60%,transparent);color:color-mix(in oklab,var(--vibeui-card-081-accent) 70%,transparent);display:grid;place-items:center;font-family:var(--vibeui-card-081-hand);font-size:.8rem;line-height:1;text-align:center;transform:rotate(-12deg);mix-blend-mode:multiply}
[data-vibeui-block="card-081"] [data-part="to"]{position:absolute;left:1.5rem;right:1.5rem;bottom:3.6rem;z-index:3;margin:0;font-family:var(--vibeui-card-081-hand);font-size:1.55rem;line-height:1.15;color:var(--vibeui-card-081-fg)}
[data-vibeui-block="card-081"] [data-part="to"] small{display:block;font-size:1.1rem;color:var(--vibeui-card-081-muted)}
[data-vibeui-block="card-081"] [data-part="to"] b{display:block;font-weight:700;font-size:1.8rem}
[data-vibeui-block="card-081"] [data-part="open"]{position:absolute;left:1.5rem;bottom:1.3rem;z-index:3;font-size:.8rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-card-081-accent)}
[data-vibeui-block="card-081"] [data-part="open"]::after{content:"→";margin-left:.4rem;display:inline-block;transition:transform .2s}
[data-vibeui-block="card-081"]:hover [data-part="open"]::after{transform:translateX(4px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-081"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-конверт: карман, клапан, печать, штамп с фото, адрес получателя и подпись «открыть». */
export function Card081({
  name = "Нина Петровна",
  image = "/demo/realty/object-01.webp",
  imageAlt = "/demo/realty/object-02.webp",
  meta = "84 года · Ржев",
  openLabel = "Открыть письмо",
  stampLines = ["почта", "России"],
  fromLabel = "от кого:",
  accent,
  className,
  style,
  ...props
}: Card081Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-081-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-081" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="card"
        data-vibeui-block="card-081" type="button" aria-label={`${openLabel}: ${name}`}
        className={className}
        style={palette}
      >
        <i data-part="pocket" aria-hidden="true" />
        <i data-part="flap" aria-hidden="true" />
        <span data-part="seal" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.4 5 7 5c2 0 3.4 1.1 5 2.8C13.6 6.1 15 5 17 5c3.6 0 5.8 3.6 4.5 6.8C19.5 16.4 12 21 12 21Z" />
          </svg>
        </span>
        <span data-part="post" aria-hidden="true">
          {stampLines[0]}
          <br />
          {stampLines[1]}
        </span>
        <span data-part="stamp" aria-hidden="true">
          <i>{image ? <img src={image} alt={imageAlt ?? ""} /> : null}</i>
        </span>
        <span data-part="to">
          <small>{fromLabel}</small>
          <b>{name}</b>
          {meta}
        </span>
        <span data-part="open">{openLabel}</span>
      </button>
    </>
  )
}
