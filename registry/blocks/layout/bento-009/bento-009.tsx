import type { CSSProperties } from "react"
import { Card076 } from "@/registry/components/card/card-076/card-076"

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
@keyframes vibeui-bento-009-run{0%{transform:translateX(0);opacity:0}10%{opacity:1}60%{transform:translateX(calc(100cqw - .8rem));opacity:1}70%{opacity:0}100%{transform:translateX(calc(100cqw - .8rem));opacity:0}}
@keyframes vibeui-bento-009-amount{0%{opacity:0;transform:translate(-50%,6px)}15%{opacity:1;transform:translate(-50%,0)}60%{opacity:1}75%,100%{opacity:0}}
@keyframes vibeui-bento-009-tick{0%,60%{transform:scale(0)}70%{transform:scale(1.2)}78%,92%{transform:scale(1)}100%{transform:scale(0)}}
@keyframes vibeui-bento-009-receive{0%,60%{box-shadow:0 0 0 0 transparent}70%{box-shadow:0 0 0 .5rem color-mix(in oklab,var(--vibeui-bento-009-accent) 35%,transparent)}100%{box-shadow:0 0 0 1rem transparent}}
@keyframes vibeui-bento-009-grow{0%{transform:scaleY(.15)}45%,80%{transform:scaleY(1)}100%{transform:scaleY(.15)}}
@keyframes vibeui-bento-009-fx{0%,20%{opacity:0;transform:translateY(8px)}5%,15%{opacity:1;transform:translateY(0)}25%,100%{opacity:0;transform:translateY(-8px)}}
@keyframes vibeui-bento-009-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-bento-009-write{0%{transform:scaleX(0)}40%,85%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes vibeui-bento-009-dots{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(-3px);opacity:1}}
@container (min-width: 44rem){[data-vibeui-block="bento-009"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){
[data-vibeui-block="bento-009"] [data-part="tile"]{grid-column:span 2}[data-vibeui-block="bento-009"] [data-part="grid"]{grid-template-columns:repeat(6,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-009"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ITEMS: Bento009Item[] = [
  { kind: "transfer", title: "Переводы по СБП за секунды", text: "Контрагенту, сотруднику или самому себе — по номеру телефона или реквизитам. Комиссии нет, деньги приходят до того, как вы закроете приложение.", meta: "0 ₽ комиссии", large: true },
  { kind: "tax", title: "Налоги считаем сами", text: "УСН и взносы копятся с каждого поступления. Напомним за неделю и заплатим в один тап.", meta: "УСН 6 %" },
  { kind: "fx", title: "Счета в четырёх валютах", text: "Рубли, юани, доллары, евро. Конвертация по курсу биржи плюс 0,3 %.", meta: "+ 0,3 %" },
  { kind: "export", title: "Выписки в 1С и Excel", text: "Синхронизация каждые 15 минут, документы подтягиваются к платежам.", meta: "1С" },
  { kind: "cards", title: "Карты сотрудникам", text: "Виртуальная за минуту, пластик за день. Лимиты и категории — в приложении.", meta: "до 50 карт" },
  { kind: "support", title: "Поддержка отвечает людьми", text: "Средний ответ — 40 секунд, ночью тоже. Без «ваш звонок очень важен».", meta: "24/7" },
]


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
              <Card076 key={item.title} data-part="tile" title={item.title} large={item.large} meta={item.meta} kind={item.kind} labels={item.labels} text={item.text} accent={accent} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
