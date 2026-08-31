import type { CSSProperties } from "react"

export type Commerce072Pick = {
  id: string
  title: string
  spec: string
  price: string
  because: string
  hue?: number
}

export type Commerce072Props = {
  title?: string
  lead?: string
  picks?: Commerce072Pick[]
  becauseLabel?: string
  cta?: string
  hide?: string
  howLabel?: string
  howText?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: персональные рекомендации, у которых есть причина. Строка
// «потому что…» стоит в каждой карточке: подборка без объяснения выглядит
// случайной и её пролистывают. Кнопка «не интересно» здесь обязательна —
// это единственный способ поправить выдачу, и без неё рекомендации
// воспринимаются как реклама. Ниже — раскрываемое объяснение механики.
const STYLES = `
:where([data-vibeui-block="commerce-072"]){
--vibeui-commerce-072-bg:oklch(1 0 0);
--vibeui-commerce-072-fg:oklch(0.2 0.014 320);
--vibeui-commerce-072-muted:oklch(0.53 0.016 320);
--vibeui-commerce-072-border:oklch(0.9 0.008 320);
--vibeui-commerce-072-soft:oklch(0.973 0.008 320);
--vibeui-commerce-072-accent:oklch(0.5 0.16 330);
--vibeui-commerce-072-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-072"]{
box-sizing:border-box;background:var(--vibeui-commerce-072-bg);
color:var(--vibeui-commerce-072-fg);font-family:var(--vibeui-commerce-072-sans);
}
[data-vibeui-block="commerce-072"] *{box-sizing:border-box}
[data-vibeui-block="commerce-072"] [data-part="shell"]{max-width:66rem;margin:0 auto;padding:1.25rem 1rem 1.75rem}
[data-vibeui-block="commerce-072"] h2{margin:0 0 0.25rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-072"] [data-part="lead"]{margin:0 0 1rem;max-width:54ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-072-muted)}
[data-vibeui-block="commerce-072"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-072"] [data-part="pick"]{
position:relative;border:1px solid var(--vibeui-commerce-072-border);border-radius:1rem;overflow:hidden;
display:flex;flex-direction:column;
}
[data-vibeui-block="commerce-072"] [data-part="pick"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-072-accent);outline-offset:2px}
[data-vibeui-block="commerce-072"] [data-part="cover"]{
display:block;aspect-ratio:5/4;
background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-072-hue,330)),oklch(0.84 0.1 var(--vibeui-commerce-072-hue,330)));
}
[data-vibeui-block="commerce-072"] [data-part="body"]{padding:0.625rem 0.75rem 0.75rem;display:flex;flex-direction:column;gap:0.375rem;flex:1}
[data-vibeui-block="commerce-072"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-072"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-072"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-072"] [data-part="spec"]{margin:0;font-size:0.6875rem;color:var(--vibeui-commerce-072-muted)}
[data-vibeui-block="commerce-072"] [data-part="because"]{
margin:0;padding:0.375rem 0.5rem;border-radius:0.5rem;background:var(--vibeui-commerce-072-soft);
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-commerce-072-muted);
}
[data-vibeui-block="commerce-072"] [data-part="because"] strong{color:var(--vibeui-commerce-072-accent);font-weight:700}
[data-vibeui-block="commerce-072"] [data-part="bottom"]{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="commerce-072"] [data-part="price"]{margin:0;font-size:0.9375rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-072"] [data-part="buy"]{
position:relative;z-index:1;appearance:none;border:0;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:0.5rem;
background:var(--vibeui-commerce-072-accent);color:oklch(0.99 0 0);font:inherit;font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="commerce-072"] [data-part="hide"]{
position:absolute;z-index:1;top:0.5rem;right:0.5rem;appearance:none;cursor:pointer;
height:1.75rem;padding:0 0.625rem;border-radius:9999px;
border:1px solid oklch(1 0 0 / 45%);background:oklch(1 0 0 / 82%);
color:var(--vibeui-commerce-072-fg);font:inherit;font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="commerce-072"] [data-part="buy"]:focus-visible,
[data-vibeui-block="commerce-072"] [data-part="hide"]:focus-visible,
[data-vibeui-block="commerce-072"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-072-accent);outline-offset:2px}
[data-vibeui-block="commerce-072"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-072"] details{margin-top:1rem;font-size:0.75rem;color:var(--vibeui-commerce-072-muted)}
[data-vibeui-block="commerce-072"] summary{cursor:pointer;font-weight:650;border-radius:0.25rem}
[data-vibeui-block="commerce-072"] details p{margin:0.375rem 0 0;max-width:60ch;line-height:1.55}
@container (min-width: 32rem){
[data-vibeui-block="commerce-072"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 50rem){
[data-vibeui-block="commerce-072"] [data-part="shell"]{padding:2rem 2rem 2.5rem}
[data-vibeui-block="commerce-072"] ul{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-072"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PICKS: Commerce072Pick[] = [
  {
    id: "1",
    title: "Кружка «Затон», 350 мл",
    spec: "Керамика ручной работы",
    price: "2 400 ₽",
    because: "вы купили кофемолку «Жёрнов»",
    hue: 25,
  },
  {
    id: "2",
    title: "Плед «Пасмурно»",
    spec: "Шерсть, 140×200 см",
    price: "6 900 ₽",
    because: "вы смотрели кресло «Хмарь» три раза",
    hue: 265,
  },
  {
    id: "3",
    title: "Подставка под чайник",
    spec: "Дуб, масло-воск",
    price: "1 800 ₽",
    because: "часто берут вместе с чайником «Гейзер»",
    hue: 65,
  },
  {
    id: "4",
    title: "Салфетки льняные, 4 шт.",
    spec: "Лён с мережкой",
    price: "2 400 ₽",
    because: "вы покупали скатерть из этой коллекции",
    hue: 150,
  },
]

/**
 * Персональные рекомендации с объяснением причины и кнопкой «не интересно»
 * в каждой карточке. Один файл, ноль зависимостей, палитра своя.
 */
export function Commerce072({
  title = "Вам может подойти",
  lead = "Подборка собрана из ваших заказов и просмотров за последние два месяца. Она меняется, когда вы отмечаете лишнее.",
  picks = DEFAULT_PICKS,
  becauseLabel = "Потому что",
  cta = "В корзину",
  hide = "Не интересно",
  howLabel = "Как собирается эта подборка",
  howText = "Мы смотрим на заказы, просмотры и то, что покупают вместе с уже купленным. Отметки «не интересно» убирают товар и похожие на него на 90 дней. Ничего не подмешиваем за деньги: рекламные позиции в этот блок не попадают.",
  accent,
  className,
  style,
}: Commerce072Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-072-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-072" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-072"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <ul>
            {picks.map((pick) => (
              <li
                key={pick.id}
                data-part="pick"
                style={
                  {
                    "--vibeui-commerce-072-hue": pick.hue ?? 330,
                  } as CSSProperties
                }
              >
                <span data-part="cover" aria-hidden="true" />
                <button type="button" data-part="hide">
                  {hide}
                  <span data-part="sr"> — {pick.title}</span>
                </button>
                <div data-part="body">
                  <p data-part="name">
                    <a href="#product">{pick.title}</a>
                  </p>
                  <p data-part="spec">{pick.spec}</p>
                  <p data-part="because">
                    <strong>{becauseLabel}</strong> {pick.because}
                  </p>
                  <div data-part="bottom">
                    <p data-part="price">{pick.price}</p>
                    <button type="button" data-part="buy">
                      {cta}
                      <span data-part="sr"> — {pick.title}</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <details>
            <summary>{howLabel}</summary>
            <p>{howText}</p>
          </details>
        </div>
      </section>
    </>
  )
}
