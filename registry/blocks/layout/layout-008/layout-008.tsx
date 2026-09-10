import type { CSSProperties, ReactNode } from "react"

export type Layout008Props = {
  /** Своя длинная колонка вместо демонстрационной. */
  children?: ReactNode
  title?: string
  price?: string
  lede?: string
  actionLabel?: string
  actionHref?: string
  noteLabel?: string
  /** Сторона закреплённой колонки. */
  side?: "left" | "right"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Закреплённое описание и длинная колонка: слева заголовок, цена и
// действие держатся sticky в пределах раздела, справа детали, фотографии
// и условия идут обычным потоком. Если краткой колонке не хватает высоты
// окна, закрепление отключается само (естественное поведение sticky).
// В узкой колонке — последовательный поток: описание, детали, действие
// доступно без постоянной нижней плашки. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="layout-008"]){
--vibeui-layout-008-bg:#ffffff;
--vibeui-layout-008-ink:#000000;
--vibeui-layout-008-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-008-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-008-panel:#f2f2f2;
--vibeui-layout-008-accent:#ff5900;
--vibeui-layout-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-008"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-008-bg);color:var(--vibeui-layout-008-ink);
font-family:var(--vibeui-layout-008-font);
}
[data-vibeui-block="layout-008"] *{box-sizing:border-box}
[data-vibeui-block="layout-008"] [data-part="shell"]{
max-width:80rem;margin:0 auto;padding:2.5rem 1rem 4rem;
display:flex;flex-direction:column;gap:2rem;
}
[data-vibeui-block="layout-008"] [data-part="summary"]{
display:flex;flex-direction:column;gap:1rem;align-self:stretch;
}
[data-vibeui-block="layout-008"] [data-part="summary"] h1{
margin:0;font-size:clamp(1.75rem,4.2cqi,2.75rem);line-height:1.08;
letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-008"] [data-part="price"]{
margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="layout-008"] [data-part="lede"]{
margin:0;font-size:1.0625rem;line-height:1.6;color:var(--vibeui-layout-008-muted);
}
[data-vibeui-block="layout-008"] [data-part="action"]{
align-self:flex-start;display:inline-flex;align-items:center;
min-height:2.75rem;padding:0.375rem 1.375rem;
background:var(--vibeui-layout-008-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="layout-008"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="layout-008"] [data-part="note"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-layout-008-muted);
}
[data-vibeui-block="layout-008"] [data-part="detail"]{
min-width:0;display:flex;flex-direction:column;gap:1.75rem;
}
[data-vibeui-block="layout-008"] [data-part="detail"] h2{
margin:0 0 0.5rem;font-size:1.375rem;letter-spacing:-0.015em;font-weight:650;
}
[data-vibeui-block="layout-008"] [data-part="detail"] p{
margin:0;max-width:56ch;font-size:1rem;line-height:1.65;
color:color-mix(in oklab,#000000 80%,#ffffff);
}
[data-vibeui-block="layout-008"] [data-part="photo"]{
aspect-ratio:3/2;
background:linear-gradient(150deg,#2c3238 0%,#585f66 52%,#8d867a 100%);
}
[data-vibeui-block="layout-008"] [data-part="photo"][data-look="paper"]{
background:linear-gradient(150deg,#eceae6 0%,#d4d0c8 100%);
}
[data-vibeui-block="layout-008"] [data-part="list"]{
margin:0;padding:0;list-style:none;
display:flex;flex-direction:column;
}
[data-vibeui-block="layout-008"] [data-part="list"] li{
display:flex;justify-content:space-between;gap:1rem;
padding:0.6875rem 0;border-bottom:1px solid var(--vibeui-layout-008-line);
font-size:0.9375rem;
}
[data-vibeui-block="layout-008"] [data-part="list"] li:last-child{border-bottom:0}
[data-vibeui-block="layout-008"] [data-part="list"] span{color:var(--vibeui-layout-008-muted)}
[data-vibeui-block="layout-008"] [data-part="list"] strong{font-weight:580;text-align:right}
[data-vibeui-block="layout-008"] a:focus-visible{
outline:2px solid var(--vibeui-layout-008-accent);outline-offset:2px;
}
@container (min-width: 54rem){
[data-vibeui-block="layout-008"] [data-part="shell"]{
flex-direction:row;align-items:flex-start;gap:3.5rem;padding:3rem 2rem 5rem;
}
[data-vibeui-block="layout-008"] [data-part="summary"]{
flex:0 0 21rem;position:sticky;top:1.5rem;align-self:flex-start;
}
[data-vibeui-block="layout-008"][data-side="right"] [data-part="summary"]{order:2}
[data-vibeui-block="layout-008"] [data-part="detail"]{flex:1 1 auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-008"] *{animation:none!important;transition:none!important}}
`

function DemoDetail() {
  return (
    <>
      <div data-part="photo" role="img" aria-label="Номер с видом на горы" />
      <section>
        <h2>Что внутри</h2>
        <p>
          Длинная колонка листается обычным потоком: фотографии, описание,
          условия. Краткая колонка с ценой остаётся на виду, пока читатель
          изучает детали, — и честно останавливается в конце раздела.
        </p>
      </section>
      <ul data-part="list">
        <li>
          <span>Площадь</span>
          <strong>34 м²</strong>
        </li>
        <li>
          <span>Завтрак</span>
          <strong>Включён</strong>
        </li>
        <li>
          <span>Отмена</span>
          <strong>Бесплатно за 48 часов</strong>
        </li>
        <li>
          <span>Заезд</span>
          <strong>С 14:00</strong>
        </li>
      </ul>
      <div data-part="photo" data-look="paper" role="img" aria-label="Интерьер номера" />
      <section>
        <h2>Условия</h2>
        <p>
          Секции добавляются по смыслу — правила, вопросы, карта. Каркас не
          ограничивает состав, он отвечает только за поведение колонок.
        </p>
      </section>
    </>
  )
}

/** Каркас «описание + детали»: краткая колонка sticky, длинная — обычным потоком. */
export function Layout008({
  children,
  title = "Номер «Панорама»",
  price = "12 800 ₽ / ночь",
  lede = "Угловой номер с видом на хребет: панорамные окна, тихий этаж, рабочее место у окна.",
  actionLabel = "Забронировать даты",
  actionHref = "#book",
  noteLabel = "Оплата при заселении · без предоплаты",
  side = "left",
  accent,
  className,
  style,
}: Layout008Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-008" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="layout-008"
        data-side={side === "right" ? "right" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <aside data-part="summary" aria-label="Кратко о предложении">
            <h1>{title}</h1>
            <p data-part="price">{price}</p>
            <p data-part="lede">{lede}</p>
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
            <p data-part="note">{noteLabel}</p>
          </aside>
          <div data-part="detail">{children ?? <DemoDetail />}</div>
        </div>
      </div>
    </>
  )
}
