import type { CSSProperties } from "react"

export type Commerce040Perk = {
  id: string
  title: string
  note: string
  bonus?: boolean
}

export type Commerce040Props = {
  title?: string
  release?: string
  countdown?: string
  progress?: number
  price?: string
  oldPrice?: string
  charge?: string
  perks?: Commerce040Perk[]
  guarantee?: string
  cta?: string
  reserved?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: предзаказ, у которого дата выхода стоит крупнее цены. Человек
// платит за то, чего ещё нет, поэтому сначала отвечаем «когда», потом
// «сколько». Полоса до релиза — статичная, её ширина приходит числом:
// живой отсчёт требует клиентского времени и врёт на закешированной странице.
// Условие списания и правило отмены названы словами рядом с кнопкой.
const STYLES = `
:where([data-vibeui-block="commerce-040"]){
--vibeui-commerce-040-bg:oklch(0.99 0.004 265);
--vibeui-commerce-040-fg:oklch(0.21 0.014 265);
--vibeui-commerce-040-muted:oklch(0.55 0.014 265);
--vibeui-commerce-040-border:oklch(0.91 0.006 265);
--vibeui-commerce-040-soft:oklch(1 0 0);
--vibeui-commerce-040-accent:oklch(0.5 0.17 300);
--vibeui-commerce-040-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-040"]{
box-sizing:border-box;background:var(--vibeui-commerce-040-bg);
color:var(--vibeui-commerce-040-fg);font-family:var(--vibeui-commerce-040-sans);
}
[data-vibeui-block="commerce-040"] *{box-sizing:border-box}
[data-vibeui-block="commerce-040"] [data-part="shell"]{max-width:56rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-040"] [data-part="grid"]{display:grid;gap:1rem}
@container (min-width: 46rem){
[data-vibeui-block="commerce-040"] [data-part="grid"]{grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr);align-items:start}
}
[data-vibeui-block="commerce-040"] [data-part="hero"]{
padding:1.25rem;border-radius:1.25rem;color:oklch(1 0 0);
background:
radial-gradient(120% 120% at 80% 0%,oklch(0.55 0.19 300 / 75%),transparent 60%),
linear-gradient(150deg,oklch(0.28 0.08 300),oklch(0.2 0.04 280));
}
[data-vibeui-block="commerce-040"] [data-part="tag"]{
display:inline-block;padding:0.25rem 0.625rem;border-radius:9999px;
background:oklch(1 0 0 / 18%);font-size:0.625rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
}
[data-vibeui-block="commerce-040"] h2{margin:0.625rem 0 0.75rem;font-size:1.375rem;font-weight:750;letter-spacing:-0.025em;line-height:1.15}
/* Дата выхода крупнее цены: за товар, которого ещё нет, платят по сроку. */
[data-vibeui-block="commerce-040"] [data-part="release"]{
margin:0;font-size:clamp(1.75rem,6cqi,2.75rem);font-weight:800;letter-spacing:-0.035em;line-height:1;
}
[data-vibeui-block="commerce-040"] [data-part="count"]{margin:0.375rem 0 0;font-size:0.8125rem;color:oklch(1 0 0 / 78%)}
[data-vibeui-block="commerce-040"] [data-part="track"]{
margin-top:0.875rem;height:0.375rem;border-radius:9999px;background:oklch(1 0 0 / 20%);overflow:hidden;
}
[data-vibeui-block="commerce-040"] [data-part="track"] i{
display:block;height:100%;border-radius:9999px;background:oklch(1 0 0);
width:var(--vibeui-commerce-040-fill,40%);
}
[data-vibeui-block="commerce-040"] [data-part="scale"]{
margin:0.375rem 0 0;display:flex;justify-content:space-between;font-size:0.625rem;color:oklch(1 0 0 / 65%);
}
[data-vibeui-block="commerce-040"] [data-part="card"]{
padding:1rem;border-radius:1.25rem;border:1px solid var(--vibeui-commerce-040-border);
background:var(--vibeui-commerce-040-soft);
}
[data-vibeui-block="commerce-040"] [data-part="cost"]{
margin:0;display:flex;align-items:baseline;gap:0.5rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="commerce-040"] [data-part="cost"] b{font-size:1.5rem;font-weight:750;letter-spacing:-0.025em}
[data-vibeui-block="commerce-040"] [data-part="cost"] s{font-size:0.875rem;color:var(--vibeui-commerce-040-muted)}
[data-vibeui-block="commerce-040"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-040"] [data-part="charge"]{
margin:0.5rem 0 0;padding:0.5rem 0.625rem;border-radius:0.75rem;background:oklch(0.97 0.02 300);
font-size:0.75rem;line-height:1.5;
}
[data-vibeui-block="commerce-040"] h3{
margin:1rem 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;
text-transform:uppercase;color:var(--vibeui-commerce-040-muted);
}
[data-vibeui-block="commerce-040"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="commerce-040"] li{
position:relative;padding-left:1.375rem;font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="commerce-040"] li::before{
content:"✓";position:absolute;left:0;top:0.0625rem;
width:0.9375rem;height:0.9375rem;border-radius:9999px;display:grid;place-items:center;
background:var(--vibeui-commerce-040-accent);color:oklch(1 0 0);font-size:0.5625rem;font-weight:800;
}
[data-vibeui-block="commerce-040"] li[data-bonus="yes"]{font-weight:650}
[data-vibeui-block="commerce-040"] li[data-bonus="yes"]::before{content:"★";background:oklch(0.62 0.16 60)}
[data-vibeui-block="commerce-040"] li span{display:block;font-weight:400;font-size:0.75rem;color:var(--vibeui-commerce-040-muted)}
[data-vibeui-block="commerce-040"] [data-part="cta"]{
margin-top:0.875rem;width:100%;appearance:none;border:0;cursor:pointer;height:3rem;border-radius:0.875rem;
background:var(--vibeui-commerce-040-accent);color:oklch(1 0 0);font:inherit;font-size:1rem;font-weight:700;
}
[data-vibeui-block="commerce-040"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-commerce-040-accent);outline-offset:2px}
[data-vibeui-block="commerce-040"] [data-part="guarantee"]{margin:0.625rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-040-muted)}
[data-vibeui-block="commerce-040"] [data-part="reserved"]{
margin:0.5rem 0 0;font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-040-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-040"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PERKS: Commerce040Perk[] = [
  {
    id: "p1",
    title: "Отправим в день выхода",
    note: "Предзаказы уезжают со склада раньше обычных заказов.",
  },
  {
    id: "p2",
    title: "Цена зафиксирована",
    note: "Если к релизу товар подорожает, доплачивать не придётся.",
  },
  {
    id: "p3",
    title: "Чехол из фетра в подарок",
    note: "Только для предзаказов, в розницу не продаётся.",
    bonus: true,
  },
  {
    id: "p4",
    title: "Продлённая гарантия — 3 года",
    note: "Вместо стандартных двух лет.",
    bonus: true,
  },
]

/**
 * Предзаказ с датой выхода: срок набран крупнее цены, условие списания рядом с кнопкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce040({
  title = "Лампа «Полдень» второго поколения",
  release = "18 апреля",
  countdown = "до выхода 44 дня · предзаказ открыт до 15 апреля",
  progress = 62,
  price = "9 900 ₽",
  oldPrice = "12 400 ₽",
  charge = "Деньги спишем за день до отправки, 17 апреля. Пока товар не вышел, карта не трогается.",
  perks = DEFAULT_PERKS,
  guarantee = "Отменить предзаказ можно в любой момент до отправки — одной кнопкой в заказе, без звонка и объяснений.",
  cta = "Оформить предзаказ",
  reserved = "Забронировано 1 840 штук из 2 500",
  accent,
  className,
  style,
}: Commerce040Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-040-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-040" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-040"
        className={className}
        style={palette}
        aria-label={`Предзаказ: ${title}`}
      >
        <div data-part="shell">
          <div data-part="grid">
            <div
              data-part="hero"
              style={
                {
                  "--vibeui-commerce-040-fill": `${progress}%`,
                } as CSSProperties
              }
            >
              <span data-part="tag">Предзаказ</span>
              <h2>{title}</h2>
              <p data-part="release">{release}</p>
              <p data-part="count">{countdown}</p>
              <div data-part="track" aria-hidden="true">
                <i />
              </div>
              <p data-part="scale">
                <span>анонс</span>
                <span>выход</span>
              </p>
            </div>

            <div data-part="card">
              <p data-part="cost">
                <b>{price}</b>
                <s>
                  <span data-part="sr">Цена после выхода </span>
                  {oldPrice}
                </s>
              </p>
              <p data-part="charge">{charge}</p>

              <h3>Что входит в предзаказ</h3>
              <ul>
                {perks.map((perk) => (
                  <li key={perk.id} data-bonus={perk.bonus ? "yes" : "no"}>
                    {perk.title}
                    <span>{perk.note}</span>
                  </li>
                ))}
              </ul>

              <button type="button" data-part="cta">
                {cta}
              </button>
              <p data-part="guarantee">{guarantee}</p>
              <p data-part="reserved">{reserved}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
