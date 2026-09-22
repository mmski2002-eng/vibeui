import type { ComponentProps, CSSProperties } from "react"

export type Card102Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  featured?: boolean
  who?: string
  seatsIncluded?: number
  factor?: number
  rules?: readonly string[]
  featuredLabel?: string
  currency?: string
  seatsLine?: string
  extraLabel?: string
  factorLine?: string
  price?: number
  seats?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function formatMoney(value: number, currency: string) {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${currency}`
}

// Часть блока market-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-102"]){
--vibeui-card-102-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-102-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-102-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-102-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-102-line:color-mix(in oklab,var(--vibeui-card-102-fg) 12%,transparent);
--vibeui-card-102-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-card-102-muted:color-mix(in oklab,var(--vibeui-card-102-fg) 58%,var(--vibeui-card-102-bg));
--vibeui-card-102-on-accent:oklch(from var(--vibeui-card-102-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-102-paper:color-mix(in oklab,var(--vibeui-card-102-bg) 92%,var(--vibeui-card-102-fg));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-102"]{color-scheme:dark}
[data-vibeui-block="card-102"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-102"] *{box-sizing:border-box}
@keyframes vibeui-card-102-pop{0%{transform:scale(.94);opacity:.4}100%{transform:scale(1);opacity:1}}
[data-vibeui-block="card-102"]{position:relative;display:grid;grid-template-rows:auto 1fr;border-radius:1.2rem;background:var(--vibeui-card-102-paper);border:1px solid var(--vibeui-card-102-line);isolation:isolate}
[data-vibeui-block="card-102"][data-featured="true"]{border-color:var(--vibeui-card-102-accent);box-shadow:0 30px 60px -40px var(--vibeui-card-102-accent)}
[data-vibeui-block="card-102"] [data-part="stub"]{position:relative;padding:1.4rem 1.4rem 1.6rem;border-bottom:2px dashed var(--vibeui-card-102-line)}
[data-vibeui-block="card-102"] [data-part="stub"]::before,[data-vibeui-block="card-102"] [data-part="stub"]::after{content:"";position:absolute;bottom:-.65rem;width:1.3rem;height:1.3rem;border-radius:50%;background:var(--vibeui-card-102-bg);border:1px solid var(--vibeui-card-102-line);z-index:1}
[data-vibeui-block="card-102"] [data-part="stub"]::before{left:-.7rem;clip-path:inset(0 0 0 50%)}
[data-vibeui-block="card-102"] [data-part="stub"]::after{right:-.7rem;clip-path:inset(0 50% 0 0)}
[data-vibeui-block="card-102"][data-featured="true"] [data-part="stub"]::before,[data-vibeui-block="card-102"][data-featured="true"] [data-part="stub"]::after{border-color:var(--vibeui-card-102-accent)}
[data-vibeui-block="card-102"] h3{margin:0;font-family:var(--vibeui-card-102-display);font-weight:700;font-size:1.25rem;letter-spacing:-.02em}
[data-vibeui-block="card-102"] [data-part="who"]{margin:.3rem 0 0;font-size:.86rem;color:var(--vibeui-card-102-muted)}
[data-vibeui-block="card-102"] [data-part="amount"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:.3rem .5rem;margin:1.2rem 0 0;font-family:var(--vibeui-card-102-display);font-weight:800;font-size:2.4rem;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="card-102"] [data-part="amount"] small{font-family:var(--vibeui-card-102-mono);font-weight:400;font-size:.68rem;letter-spacing:.02em;color:var(--vibeui-card-102-muted)}
[data-vibeui-block="card-102"] [data-part="amount"] output{animation:vibeui-card-102-pop .35s cubic-bezier(.2,1.2,.4,1)}
[data-vibeui-block="card-102"] [data-part="sticker"]{position:absolute;top:-.8rem;right:1rem;padding:.3rem .7rem;border-radius:.4rem;background:var(--vibeui-card-102-accent);color:var(--vibeui-card-102-on-accent);font-family:var(--vibeui-card-102-mono);font-size:.66rem;letter-spacing:.04em;text-transform:uppercase;transform:rotate(3deg);box-shadow:0 6px 16px -8px rgb(0 0 0 / .5)}
[data-vibeui-block="card-102"] [data-part="rules"]{margin:0;padding:1.3rem 1.4rem 1.5rem;list-style:none;display:grid;gap:.55rem;align-content:start;font-size:.9rem}
[data-vibeui-block="card-102"] [data-part="rules"] li{display:flex;gap:.6rem;align-items:baseline}
[data-vibeui-block="card-102"] [data-part="rules"] li::before{content:attr(data-sign);flex-shrink:0;width:1.2rem;height:1.2rem;border-radius:999px;display:inline-grid;place-items:center;font-family:var(--vibeui-card-102-mono);font-size:.7rem;line-height:1;transform:translateY(.15rem)}
[data-vibeui-block="card-102"] [data-part="rules"] li[data-sign="+"]::before{background:color-mix(in oklab,var(--vibeui-card-102-accent) 15%,transparent);color:var(--vibeui-card-102-accent)}
[data-vibeui-block="card-102"] [data-part="rules"] li[data-sign="−"]{color:var(--vibeui-card-102-muted)}
[data-vibeui-block="card-102"] [data-part="rules"] li[data-sign="−"]::before{background:var(--vibeui-card-102-line)}
[data-vibeui-block="card-102"] [data-part="rules"] li[data-sign="−"] span{text-decoration:line-through;text-decoration-color:color-mix(in oklab,var(--vibeui-card-102-fg) 30%,transparent)}
@container (min-width: 56rem){
[data-vibeui-block="card-102"][data-featured="true"]{transform:translateY(-.6rem)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-102"] *{animation:none!important;transition:none!important}}
`

/** Карточка-билет лицензии с перфорацией: корешок с ценой и стикером, название, правила со знаками + и −, кнопка. */
export function Card102({
  name = "Личная",
  featured,
  who = "Один человек, свои проекты и портфолио.",
  seatsIncluded,
  factor = 1,
  rules = ["+ Личные и учебные проекты", "+ Портфолио и соцсети", "+ Обновления навсегда", "− Клиентские проекты", "− Передача файлов третьим лицам"],
  featuredLabel = "берут чаще",
  currency = "₽",
  seatsLine = "{n} мест · ×{factor}",
  extraLabel = " + доплата",
  factorLine = "×{factor} от базовой",
  price,
  seats,
  accent,
  className,
  style,
  ...props
}: Card102Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-102-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-102" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-102" data-featured={featured ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="stub">
          {featured ? <span data-part="sticker">{featuredLabel}</span> : null}
          <h3>{name}</h3>
          <p data-part="who">{who}</p>
          <div data-part="amount">
            <output key={price}>{formatMoney(price, currency)}</output>
            <small>{seatsIncluded ? `${seatsLine.replace("{n}", String(seats)).replace("{factor}", String(factor))}${seats > seatsIncluded ? extraLabel : ""}` : factorLine.replace("{factor}", String(factor))}</small>
          </div>
        </div>
        <ul data-part="rules">
          {rules.map((rule) => {
            const sign = rule.trim().startsWith("−") || rule.trim().startsWith("-") ? "−" : "+"
            return (
              <li key={rule} data-sign={sign}>
                <span>{rule.replace(/^[+−-]\s*/, "")}</span>
              </li>
            )
          })}
        </ul>
      </li>
    </>
  )
}
