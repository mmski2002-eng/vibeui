import type { CSSProperties } from "react"

export type Bento009Kind = "transfer" | "tax" | "fx" | "export" | "cards" | "support"

export type Bento009Item = {
  /** Вид микроанимации в плитке. */
  kind: Bento009Kind
  title: string
  text: string
  /** Подпись в углу: «0 ₽», «за 3 сек». */
  meta?: string
  /** Большая плитка: 4 колонки и 2 ряда на широком. */
  large?: boolean
  /** Подписи внутри фигуры: transfer — [откуда, куда, сумма], support — [сообщение]. */
  labels?: readonly string[]
}

export type Bento009Props = {
  eyebrow?: string
  title?: string
  lede?: string
  items?: readonly Bento009Item[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Возможности банка bento-сеткой: шесть стеклянных плиток разного размера,
// в каждой своя CSS-микроанимация по kind — перевод бежит точкой по линии
// между двумя счетами и ставит галочку, налог растёт столбиками, валюты
// сменяются, выписка «пишется» строками, карты сотрудников веером,
// поддержка печатает точками. Наведение подсвечивает плитку сиянием
// сверху. Никакого JS: серверный компонент.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="bento-009"]){
--vibeui-bento-009-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-009-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-009-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-009-on-accent:oklch(from var(--vibeui-bento-009-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bento-009-mint:color-mix(in oklab,var(--vibeui-bento-009-accent) 45%,#99f6e4);
--vibeui-bento-009-muted:color-mix(in oklab,var(--vibeui-bento-009-fg) 62%,var(--vibeui-bento-009-bg));
--vibeui-bento-009-line:color-mix(in oklab,var(--vibeui-bento-009-fg) 11%,transparent);
--vibeui-bento-009-glass:color-mix(in oklab,var(--vibeui-bento-009-fg) 5%,transparent);
--vibeui-bento-009-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-009-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-009-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-009"]{color-scheme:dark}
:where([data-vibeui-block="bento-009"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-009"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-009"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-bento-009-bg);color:var(--vibeui-bento-009-fg);font-family:var(--vibeui-bento-009-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-009"] *{box-sizing:border-box}
[data-vibeui-block="bento-009"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-009"] [data-part="head"]{max-width:42rem;margin:0 0 2.5rem}
[data-vibeui-block="bento-009"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-009-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-bento-009-accent)}
[data-vibeui-block="bento-009"] [data-part="title"]{margin:0;font-family:var(--vibeui-bento-009-display);font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="bento-009"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-bento-009-muted)}
[data-vibeui-block="bento-009"] [data-part="grid"]{display:grid;gap:1rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="bento-009"] [data-part="tile"]{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-rows:1fr auto;gap:1.2rem;min-height:15rem;padding:1.4rem;border-radius:1.5rem;background:var(--vibeui-bento-009-glass);border:1px solid var(--vibeui-bento-009-line);transition:border-color .3s,transform .3s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="bento-009"] [data-part="tile"]::before{content:"";position:absolute;z-index:-1;inset:-40% -20% auto;height:80%;background:radial-gradient(closest-side,var(--vibeui-bento-009-accent),transparent);opacity:0;filter:blur(50px);transition:opacity .5s;pointer-events:none}
[data-vibeui-block="bento-009"] [data-part="tile"]:hover{border-color:color-mix(in oklab,var(--vibeui-bento-009-accent) 45%,transparent);transform:translateY(-3px)}
[data-vibeui-block="bento-009"] [data-part="tile"]:hover::before{opacity:.28}
[data-vibeui-block="bento-009"] [data-part="meta"]{position:absolute;top:1.1rem;right:1.1rem;padding:.2rem .6rem;border-radius:999px;font-family:var(--vibeui-bento-009-mono);font-size:.7rem;background:color-mix(in oklab,var(--vibeui-bento-009-accent) 16%,transparent);color:var(--vibeui-bento-009-accent)}
[data-vibeui-block="bento-009"] [data-part="tile"] h3{margin:0 0 .3rem;font-family:var(--vibeui-bento-009-display);font-weight:700;font-size:1.2rem;letter-spacing:-.02em}
[data-vibeui-block="bento-009"] [data-part="tile"] p{margin:0;font-size:.92rem;color:var(--vibeui-bento-009-muted)}
[data-vibeui-block="bento-009"] [data-part="figure"]{display:grid;place-items:center;min-height:6rem;font-family:var(--vibeui-bento-009-mono)}
[data-vibeui-block="bento-009"] [data-part="transfer"]{position:relative;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.8rem;width:100%;max-width:26rem}
[data-vibeui-block="bento-009"] [data-part="node"]{display:grid;place-items:center;width:3.2rem;height:3.2rem;border-radius:50%;background:var(--vibeui-bento-009-bg);border:1px solid var(--vibeui-bento-009-line);font-size:.68rem;font-weight:600;text-align:center;line-height:1.1}
[data-vibeui-block="bento-009"] [data-part="node"]:last-child{animation:vibeui-bento-009-receive 4s ease-out infinite}
[data-vibeui-block="bento-009"] [data-part="wire"]{position:relative;height:2px;background:var(--vibeui-bento-009-line);border-radius:2px;container-type:inline-size}
[data-vibeui-block="bento-009"] [data-part="wire"]::before{content:"";position:absolute;top:50%;left:0;width:.8rem;height:.8rem;margin-top:-.4rem;border-radius:50%;background:var(--vibeui-bento-009-accent);box-shadow:0 0 16px var(--vibeui-bento-009-accent);animation:vibeui-bento-009-run 4s cubic-bezier(.4,0,.2,1) infinite}
[data-vibeui-block="bento-009"] [data-part="wire"]::after{content:attr(data-amount);position:absolute;left:50%;bottom:.9rem;transform:translateX(-50%);font-size:.78rem;font-weight:600;color:var(--vibeui-bento-009-accent);white-space:nowrap;animation:vibeui-bento-009-amount 4s ease-out infinite}
[data-vibeui-block="bento-009"] [data-part="tick"]{position:absolute;right:-.3rem;top:-.3rem;width:1.3rem;height:1.3rem;border-radius:50%;background:var(--vibeui-bento-009-accent);color:var(--vibeui-bento-009-on-accent);display:grid;place-items:center;transform:scale(0);animation:vibeui-bento-009-tick 4s ease-out infinite}
[data-vibeui-block="bento-009"] [data-part="tick"] svg{width:.7rem;height:.7rem}
[data-vibeui-block="bento-009"] [data-part="tax"]{display:flex;align-items:flex-end;gap:.35rem;height:4.5rem}
[data-vibeui-block="bento-009"] [data-part="tax"] i{display:block;width:.9rem;border-radius:.3rem .3rem 0 0;background:color-mix(in oklab,var(--vibeui-bento-009-accent) 35%,var(--vibeui-bento-009-line));transform-origin:bottom;animation:vibeui-bento-009-grow 3.6s cubic-bezier(.2,.7,.2,1) infinite;animation-delay:calc(var(--vibeui-bento-009-i) * .18s)}
[data-vibeui-block="bento-009"] [data-part="tax"] i:last-child{background:var(--vibeui-bento-009-accent)}
[data-vibeui-block="bento-009"] [data-part="fx"]{position:relative;display:grid;place-items:center;width:5rem;height:5rem;border-radius:50%;border:1px dashed color-mix(in oklab,var(--vibeui-bento-009-accent) 50%,transparent);font-size:2rem;font-weight:600}
[data-vibeui-block="bento-009"] [data-part="fx"] b{position:absolute;opacity:0;animation:vibeui-bento-009-fx 6s ease-in-out infinite;animation-delay:calc(var(--vibeui-bento-009-i) * 1.5s)}
[data-vibeui-block="bento-009"] [data-part="fx"]::after{content:"";position:absolute;inset:-.5rem;border-radius:50%;border:1px solid var(--vibeui-bento-009-line);border-top-color:var(--vibeui-bento-009-accent);animation:vibeui-bento-009-spin 4s linear infinite}
[data-vibeui-block="bento-009"] [data-part="export"]{display:grid;gap:.5rem;width:100%;max-width:12rem;padding:.9rem;border-radius:.8rem;background:var(--vibeui-bento-009-bg);border:1px solid var(--vibeui-bento-009-line)}
[data-vibeui-block="bento-009"] [data-part="export"] i{display:block;height:.45rem;border-radius:999px;background:var(--vibeui-bento-009-line);transform-origin:left;animation:vibeui-bento-009-write 3.2s ease-out infinite;animation-delay:calc(var(--vibeui-bento-009-i) * .4s)}
[data-vibeui-block="bento-009"] [data-part="export"] i:nth-child(2){width:70%}
[data-vibeui-block="bento-009"] [data-part="export"] i:nth-child(4){width:55%}
[data-vibeui-block="bento-009"] [data-part="export"] b{justify-self:end;padding:.15rem .5rem;border-radius:.4rem;font-size:.68rem;background:var(--vibeui-bento-009-accent);color:var(--vibeui-bento-009-on-accent)}
[data-vibeui-block="bento-009"] [data-part="cards"]{position:relative;width:7.5rem;height:5rem}
[data-vibeui-block="bento-009"] [data-part="cards"] i{position:absolute;inset:0;border-radius:.6rem;border:1px solid rgb(255 255 255 / .18);background:linear-gradient(135deg,#1b2350,#0b1030);box-shadow:0 10px 24px -12px rgb(0 0 0 / .8);transform-origin:bottom left;transform:rotate(calc(var(--vibeui-bento-009-i) * -6deg)) translateY(calc(var(--vibeui-bento-009-i) * -.2rem));transition:transform .5s cubic-bezier(.2,.7,.2,1)}
[data-vibeui-block="bento-009"] [data-part="cards"] i::after{content:"";position:absolute;left:.6rem;top:.6rem;width:1rem;height:.7rem;border-radius:.15rem;background:linear-gradient(135deg,#f5e6a8,#c9a54b)}
[data-vibeui-block="bento-009"] [data-part="cards"] i:last-child{background:linear-gradient(135deg,var(--vibeui-bento-009-accent),var(--vibeui-bento-009-mint))}
[data-vibeui-block="bento-009"] [data-part="tile"]:hover [data-part="cards"] i{transform:rotate(calc(var(--vibeui-bento-009-i) * -14deg)) translate(calc(var(--vibeui-bento-009-i) * .6rem),calc(var(--vibeui-bento-009-i) * -.5rem))}
[data-vibeui-block="bento-009"] [data-part="support"]{display:grid;gap:.5rem;width:100%;max-width:13rem}
[data-vibeui-block="bento-009"] [data-part="support"] span{justify-self:end;padding:.45rem .8rem;border-radius:1rem 1rem .2rem 1rem;background:var(--vibeui-bento-009-accent);color:var(--vibeui-bento-009-on-accent);font-family:var(--vibeui-bento-009-font);font-size:.8rem}
[data-vibeui-block="bento-009"] [data-part="support"] em{display:inline-flex;gap:.25rem;padding:.55rem .7rem;border-radius:1rem 1rem 1rem .2rem;background:var(--vibeui-bento-009-bg);border:1px solid var(--vibeui-bento-009-line)}
[data-vibeui-block="bento-009"] [data-part="support"] em i{width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-bento-009-muted);animation:vibeui-bento-009-dots 1.2s ease-in-out infinite;animation-delay:calc(var(--vibeui-bento-009-i) * .2s)}
@keyframes vibeui-bento-009-run{0%{transform:translateX(0);opacity:0}10%{opacity:1}60%{transform:translateX(calc(100cqw - .8rem));opacity:1}70%{opacity:0}100%{transform:translateX(calc(100cqw - .8rem));opacity:0}}
@keyframes vibeui-bento-009-amount{0%{opacity:0;transform:translate(-50%,6px)}15%{opacity:1;transform:translate(-50%,0)}60%{opacity:1}75%,100%{opacity:0}}
@keyframes vibeui-bento-009-tick{0%,60%{transform:scale(0)}70%{transform:scale(1.2)}78%,92%{transform:scale(1)}100%{transform:scale(0)}}
@keyframes vibeui-bento-009-receive{0%,60%{box-shadow:0 0 0 0 transparent}70%{box-shadow:0 0 0 .5rem color-mix(in oklab,var(--vibeui-bento-009-accent) 35%,transparent)}100%{box-shadow:0 0 0 1rem transparent}}
@keyframes vibeui-bento-009-grow{0%{transform:scaleY(.15)}45%,80%{transform:scaleY(1)}100%{transform:scaleY(.15)}}
@keyframes vibeui-bento-009-fx{0%,20%{opacity:0;transform:translateY(8px)}5%,15%{opacity:1;transform:translateY(0)}25%,100%{opacity:0;transform:translateY(-8px)}}
@keyframes vibeui-bento-009-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-bento-009-write{0%{transform:scaleX(0)}40%,85%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-bento-009-dots{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-3px);opacity:1}}
@container (min-width: 44rem){[data-vibeui-block="bento-009"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}[data-vibeui-block="bento-009"] [data-part="tile"][data-large="true"]{grid-column:span 2}}
@container (min-width: 64rem){[data-vibeui-block="bento-009"] [data-part="grid"]{grid-template-columns:repeat(6,minmax(0,1fr))}[data-vibeui-block="bento-009"] [data-part="tile"]{grid-column:span 2}[data-vibeui-block="bento-009"] [data-part="tile"][data-large="true"]{grid-column:span 4;grid-row:span 2}[data-vibeui-block="bento-009"] [data-part="tile"][data-large="true"] [data-part="figure"]{min-height:12rem}[data-vibeui-block="bento-009"] [data-part="tile"][data-large="true"] h3{font-size:1.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-009"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-009"] [data-part="tick"]{transform:scale(1)}[data-vibeui-block="bento-009"] [data-part="fx"] b:first-child{opacity:1}[data-vibeui-block="bento-009"] [data-part="wire"]::before{transform:translateX(calc(100cqw - .8rem))}}`

const DEFAULT_ITEMS: Bento009Item[] = [
  { kind: "transfer", title: "Переводы по СБП за секунды", text: "Контрагенту, сотруднику или самому себе — по номеру телефона или реквизитам. Комиссии нет, деньги приходят до того, как вы закроете приложение.", meta: "0 ₽ комиссии", large: true },
  { kind: "tax", title: "Налоги считаем сами", text: "УСН и взносы копятся с каждого поступления. Напомним за неделю и заплатим в один тап.", meta: "УСН 6 %" },
  { kind: "fx", title: "Счета в четырёх валютах", text: "Рубли, юани, доллары, евро. Конвертация по курсу биржи плюс 0,3 %.", meta: "+ 0,3 %" },
  { kind: "export", title: "Выписки в 1С и Excel", text: "Синхронизация каждые 15 минут, документы подтягиваются к платежам.", meta: "1С" },
  { kind: "cards", title: "Карты сотрудникам", text: "Виртуальная за минуту, пластик за день. Лимиты и категории — в приложении.", meta: "до 50 карт" },
  { kind: "support", title: "Поддержка отвечает людьми", text: "Средний ответ — 40 секунд, ночью тоже. Без «ваш звонок очень важен».", meta: "24/7" },
]

function Figure({ kind, labels = [] }: { kind: Bento009Kind; labels?: readonly string[] }) {
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
            <i key={index} style={{ height: `${height * 100}%`, ["--vibeui-bento-009-i" as string]: index }} />
          ))}
        </div>
      )
    case "fx":
      return (
        <div data-part="fx" aria-hidden="true">
          {["₽", "¥", "$", "€"].map((symbol, index) => (
            <b key={symbol} style={{ ["--vibeui-bento-009-i" as string]: index }}>
              {symbol}
            </b>
          ))}
        </div>
      )
    case "export":
      return (
        <div data-part="export" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <i key={index} style={{ ["--vibeui-bento-009-i" as string]: index }} />
          ))}
          <b>.xml</b>
        </div>
      )
    case "cards":
      return (
        <div data-part="cards" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <i key={index} style={{ ["--vibeui-bento-009-i" as string]: index }} />
          ))}
        </div>
      )
    default:
      return (
        <div data-part="support" aria-hidden="true">
          <span>{labels[0] ?? "Не проходит платёж в Китай"}</span>
          <em>
            {[0, 1, 2].map((index) => (
              <i key={index} style={{ ["--vibeui-bento-009-i" as string]: index }} />
            ))}
          </em>
        </div>
      )
  }
}

/** Возможности bento-сеткой с микроанимацией в каждой плитке. */
export function Bento009({
  eyebrow = "Возможности",
  title = "Всё, что делает бухгалтер по вторникам, — за секунды",
  lede = "Переводы, налоги, валюта, выписки и карты сотрудникам — в одном приложении, без визитов в отделение и «менеджера, который перезвонит».",
  items = DEFAULT_ITEMS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento009Props) {
  const palette = {
    ...(accent ? { "--vibeui-bento-009-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-009-fg": ink } : null),
    ...(background ? { "--vibeui-bento-009-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-009" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bento-009" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <ul data-part="grid">
            {items.map((item) => (
              <li key={item.title} data-part="tile" data-large={item.large ? "true" : undefined}>
                {item.meta ? <span data-part="meta">{item.meta}</span> : null}
                <div data-part="figure">
                  <Figure kind={item.kind} labels={item.labels} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
