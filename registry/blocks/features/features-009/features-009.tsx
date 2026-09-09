import type { CSSProperties } from "react"

export type Features009Stat = {
  value: string
  unit?: string
  label: string
  note?: string
}

export type Features009Props = {
  eyebrow?: string
  title?: string
  lede?: string
  stats?: Features009Stat[]
  source?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: цифры как главный аргумент. Каждый показатель — ячейка с
// огромным числом, единицей измерения и подписью, а под ней сноска с
// уточнением: цифра без контекста не убеждает, а раздражает. Числа набраны
// tabular-nums и выровнены по базовой линии с единицей измерения, поэтому
// «12,4 млн» читается как одно значение, а не как два разных элемента.
// Ячейки разделены линиями сетки, а не рамками карточек.
const STYLES = `
:where([data-vibeui-block="features-009"]){
--vibeui-features-009-bg:light-dark(oklch(0.985 0 250),oklch(0.17 0 250));
--vibeui-features-009-fg:light-dark(oklch(0.2 0 250),oklch(0.98 0 250));
--vibeui-features-009-muted:light-dark(oklch(0.48 0 250),oklch(0.7 0 250));
--vibeui-features-009-dim:light-dark(oklch(0.62 0 250),oklch(0.55 0 250));
--vibeui-features-009-line:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-features-009-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.8 0.16 39.8));
--vibeui-features-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-009"]{color-scheme:dark}
[data-vibeui-block="features-009"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-009-bg);color:var(--vibeui-features-009-fg);
font-family:var(--vibeui-features-009-sans);
}
[data-vibeui-block="features-009"] *{box-sizing:border-box}
[data-vibeui-block="features-009"] [data-part="shell"]{max-width:70rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-009"] [data-part="head"]{max-width:36rem;margin-bottom:2.5rem}
[data-vibeui-block="features-009"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-009-accent);
}
[data-vibeui-block="features-009"] h2{
margin:0;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-009"] [data-part="lede"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.3cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-features-009-muted);text-wrap:pretty;
}
[data-vibeui-block="features-009"] dl{
margin:0;display:grid;grid-template-columns:1fr;gap:1px;
background:var(--vibeui-features-009-line);border-top:1px solid var(--vibeui-features-009-line);
border-bottom:1px solid var(--vibeui-features-009-line);
}
[data-vibeui-block="features-009"] [data-part="cell"]{
display:flex;flex-direction:column;background:var(--vibeui-features-009-bg);padding:1.5rem 0;
}
[data-vibeui-block="features-009"] dd{
order:1;margin:0;display:flex;align-items:baseline;gap:0.25rem;
font-size:clamp(2.5rem,7cqi,4rem);line-height:0.95;font-weight:700;letter-spacing:-0.045em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="features-009"] [data-part="unit"]{font-size:0.32em;font-weight:650;letter-spacing:0;color:var(--vibeui-features-009-accent)}
[data-vibeui-block="features-009"] dt{order:2;margin:0.875rem 0 0;font-size:0.9375rem;font-weight:600;max-width:22ch}
[data-vibeui-block="features-009"] [data-part="note"]{
display:block;margin-top:0.375rem;font-size:0.75rem;font-weight:400;line-height:1.5;
color:var(--vibeui-features-009-dim);max-width:26ch;
}
[data-vibeui-block="features-009"] [data-part="source"]{margin:1.25rem 0 0;font-size:0.75rem;color:var(--vibeui-features-009-dim)}
@container (min-width: 34rem){
[data-vibeui-block="features-009"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="features-009"] dl{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:1px}
[data-vibeui-block="features-009"] [data-part="cell"]{padding:1.75rem 1.75rem 1.75rem 0}
}
@container (min-width: 60rem){
[data-vibeui-block="features-009"] dl{grid-template-columns:repeat(4,minmax(0,1fr))}
[data-vibeui-block="features-009"] [data-part="shell"]{padding:6rem 2.5rem}
[data-vibeui-block="features-009"] [data-part="head"]{margin-bottom:3.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS: Features009Stat[] = [
  {
    value: "1 080",
    label: "секций в каталоге",
    note: "Пополняется каждую неделю, старые версии не удаляются",
  },
  {
    value: "6",
    unit: "мин",
    label: "медиана до готовой страницы",
    note: "От открытия каталога до задеплоенного результата",
  },
  {
    value: "97",
    unit: "%",
    label: "установок без правок вёрстки",
    note: "Агент менял только тексты и акцентный цвет",
  },
  {
    value: "0",
    label: "зависимостей в секции",
    note: "Только React и CSS, ни одной внешней библиотеки",
  },
]

/** Блок цифр и достижений: четыре крупных показателя на линиях сетки со сносками. */
export function Features009({
  eyebrow = "Итоги года",
  title = "Мы считаем не компоненты, а сэкономленные вечера",
  lede = "Каждая цифра — из телеметрии проектов, которые согласились её присылать. Ниже указано, что именно измерялось.",
  stats = DEFAULT_STATS,
  source = "Данные за январь — декабрь, 3 400 проектов с включённой телеметрией.",
  accent,
  className,
  style,
}: Features009Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>

          <dl>
            {stats.slice(0, 4).map((stat) => (
              <div key={stat.label} data-part="cell">
                <dd>
                  {stat.value}
                  {stat.unit ? <span data-part="unit">{stat.unit}</span> : null}
                </dd>
                <dt>
                  {stat.label}
                  {stat.note ? <span data-part="note">{stat.note}</span> : null}
                </dt>
              </div>
            ))}
          </dl>

          {source ? <p data-part="source">{source}</p> : null}
        </div>
      </section>
    </>
  )
}
