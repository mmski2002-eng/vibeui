import type { CSSProperties, ReactNode } from "react"

type Layout003Variant = {
  label: string
  available?: boolean
}

export type Layout003Props = {
  /** Секции под основным разделом: характеристики, отзывы. */
  children?: ReactNode
  title?: string
  price?: string
  oldPrice?: string
  lede?: string
  /** Состояние предложения. */
  state?: "available" | "out"
  variantsLabel?: string
  variants?: Layout003Variant[]
  actionLabel?: string
  outLabel?: string
  noteLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Галерея товара и закреплённое предложение: крупные кадры слева идут
// естественным потоком, панель с названием, ценой, вариантами и действием
// закреплена sticky только в пределах основного раздела. Характеристики и
// отзывы — ниже обычным потоком. Состояния «нет в наличии» и «вариант
// недоступен» демонстрируются без настоящей оплаты. Без клиентского JS.
const STYLES = `
:where([data-vibeui-block="layout-003"]){
--vibeui-layout-003-bg:#ffffff;
--vibeui-layout-003-ink:#000000;
--vibeui-layout-003-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-003-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-003-panel:#f2f2f2;
--vibeui-layout-003-accent:#ff5900;
--vibeui-layout-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-003"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-003-bg);color:var(--vibeui-layout-003-ink);
font-family:var(--vibeui-layout-003-font);
}
[data-vibeui-block="layout-003"] *{box-sizing:border-box}
[data-vibeui-block="layout-003"] [data-part="shell"]{
max-width:80rem;margin:0 auto;padding:2rem 1rem 3rem;
display:flex;flex-direction:column;gap:2.5rem;
}
[data-vibeui-block="layout-003"] [data-part="top"]{
display:flex;flex-direction:column;gap:1.5rem;align-items:stretch;
}
[data-vibeui-block="layout-003"] [data-part="gallery"]{
flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-003"] [data-part="frame"]{
aspect-ratio:4/3;
background:linear-gradient(150deg,#1a1a1a 0%,#000000 78%);
position:relative;overflow:hidden;
}
[data-vibeui-block="layout-003"] [data-part="frame"]::after{
content:"";position:absolute;inset:0;
background:radial-gradient(26rem 16rem at 70% 20%,color-mix(in oklab,var(--vibeui-layout-003-accent) 30%,transparent),transparent 62%);
}
[data-vibeui-block="layout-003"] [data-part="frame"][data-look="paper"]{
background:linear-gradient(150deg,#f2f2f2 0%,color-mix(in oklab,#f2f2f2 82%,#000000) 100%);
}
[data-vibeui-block="layout-003"] [data-part="frame"][data-look="paper"]::after{content:none}
[data-vibeui-block="layout-003"] [data-part="offer"]{
flex:none;display:flex;flex-direction:column;gap:1rem;
border:1px solid var(--vibeui-layout-003-line);padding:1.5rem;
}
[data-vibeui-block="layout-003"] [data-part="title"]{
margin:0;font-size:clamp(1.375rem,3cqi,1.875rem);line-height:1.15;
letter-spacing:-0.02em;font-weight:660;
}
[data-vibeui-block="layout-003"] [data-part="lede"]{
margin:0;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-layout-003-muted);
}
[data-vibeui-block="layout-003"] [data-part="priceline"]{
display:flex;align-items:baseline;gap:0.75rem;
}
[data-vibeui-block="layout-003"] [data-part="price"]{
font-size:1.625rem;font-weight:700;letter-spacing:-0.02em;
}
[data-vibeui-block="layout-003"] [data-part="old"]{
font-size:1rem;color:var(--vibeui-layout-003-muted);text-decoration:line-through;
}
[data-vibeui-block="layout-003"] fieldset{
margin:0;padding:0;border:0;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="layout-003"] legend{
padding:0;margin-bottom:0.25rem;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="layout-003"] [data-part="variants"]{
display:flex;flex-wrap:wrap;gap:0.5rem;
}
[data-vibeui-block="layout-003"] [data-part="variant"]{
position:relative;display:inline-flex;
}
[data-vibeui-block="layout-003"] [data-part="variant"] input{
position:absolute;inset:0;opacity:0;margin:0;cursor:pointer;
}
[data-vibeui-block="layout-003"] [data-part="variant"] span{
display:inline-flex;align-items:center;min-height:2.375rem;padding:0.25rem 0.9375rem;
border:1px solid var(--vibeui-layout-003-line);
font-size:0.9375rem;font-weight:540;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="layout-003"] [data-part="variant"] input:checked+span{
border-color:var(--vibeui-layout-003-accent);
background:color-mix(in oklab,var(--vibeui-layout-003-accent) 12%,#ffffff);
}
[data-vibeui-block="layout-003"] [data-part="variant"] input:focus-visible+span{
outline:2px solid var(--vibeui-layout-003-accent);outline-offset:2px;
}
[data-vibeui-block="layout-003"] [data-part="variant"] input:disabled+span{
color:var(--vibeui-layout-003-muted);border-style:dashed;cursor:not-allowed;
text-decoration:line-through;
}
[data-vibeui-block="layout-003"] [data-part="buy"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.875rem;padding:0.375rem 1.5rem;
background:var(--vibeui-layout-003-accent);color:#000000;
font:inherit;font-size:1rem;font-weight:650;
transition:filter .16s ease;
}
[data-vibeui-block="layout-003"] [data-part="buy"]:hover{filter:brightness(1.06)}
[data-vibeui-block="layout-003"] [data-part="buy"]:focus-visible{
outline:2px solid var(--vibeui-layout-003-accent);outline-offset:2px;
}
[data-vibeui-block="layout-003"][data-state="out"] [data-part="buy"]{
background:var(--vibeui-layout-003-panel);color:var(--vibeui-layout-003-muted);
cursor:not-allowed;
}
[data-vibeui-block="layout-003"] [data-part="note"]{
margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-layout-003-muted);
}
[data-vibeui-block="layout-003"] [data-part="below"]{
display:flex;flex-direction:column;gap:2rem;
border-top:1px solid var(--vibeui-layout-003-line);padding-top:2rem;
}
[data-vibeui-block="layout-003"] [data-part="below"] h2{
margin:0 0 0.75rem;font-size:1.375rem;letter-spacing:-0.015em;font-weight:650;
}
[data-vibeui-block="layout-003"] [data-part="specs"]{
margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:0.75rem 2rem;
}
[data-vibeui-block="layout-003"] [data-part="specs"] div{
display:flex;justify-content:space-between;gap:1rem;
padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-003-line);
font-size:0.9375rem;
}
[data-vibeui-block="layout-003"] [data-part="specs"] dt{color:var(--vibeui-layout-003-muted)}
[data-vibeui-block="layout-003"] [data-part="specs"] dd{margin:0;font-weight:560;text-align:right}
[data-vibeui-block="layout-003"] [data-part="review"]{
border:1px solid var(--vibeui-layout-003-line);padding:1.25rem;
display:flex;flex-direction:column;gap:0.5rem;max-width:44rem;
}
[data-vibeui-block="layout-003"] [data-part="review"] strong{font-size:0.9375rem;font-weight:640}
[data-vibeui-block="layout-003"] [data-part="review"] p{
margin:0;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-layout-003-muted);
}
@container (min-width: 56rem){
[data-vibeui-block="layout-003"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="layout-003"] [data-part="top"]{flex-direction:row;align-items:flex-start}
[data-vibeui-block="layout-003"] [data-part="offer"]{width:22rem;position:sticky;top:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VARIANTS: Layout003Variant[] = [
  { label: "Дуб", available: true },
  { label: "Ясень", available: true },
  { label: "Орех", available: false },
]

/** Каркас товара: галерея потоком и sticky-панель предложения в пределах раздела. */
export function Layout003({
  children,
  title = "Кресло «Сектор»",
  price = "42 900 ₽",
  oldPrice = "49 900 ₽",
  lede = "Массив дуба, тёмная пропитка, съёмная подушка. Собирается без инструментов за десять минут.",
  state = "available",
  variantsLabel = "Материал",
  variants = DEFAULT_VARIANTS,
  actionLabel = "Добавить в корзину",
  outLabel = "Нет в наличии",
  noteLabel = "Доставка 3–5 дней · возврат 30 дней",
  accent,
  className,
  style,
}: Layout003Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-003-accent": accent } : null),
    ...style,
  } as CSSProperties
  const out = state === "out"

  return (
    <>
      <style href="vibeui-layout-003" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="layout-003"
        data-state={out ? "out" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="top">
            <div data-part="gallery">
              <div data-part="frame" role="img" aria-label="Основное фото товара" />
              <div data-part="frame" data-look="paper" role="img" aria-label="Товар в интерьере" />
            </div>
            <aside data-part="offer" aria-label="Предложение">
              <h1 data-part="title">{title}</h1>
              <p data-part="lede">{lede}</p>
              <p data-part="priceline">
                <span data-part="price">{price}</span>
                {oldPrice ? <s data-part="old">{oldPrice}</s> : null}
              </p>
              <fieldset>
                <legend>{variantsLabel}</legend>
                <div data-part="variants">
                  {variants.map((variant, index) => (
                    <label data-part="variant" key={variant.label}>
                      <input
                        type="radio"
                        name="vibeui-layout-003-variant"
                        defaultChecked={index === 0}
                        disabled={variant.available === false}
                      />
                      <span>{variant.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <button data-part="buy" type="button" disabled={out}>
                {out ? outLabel : actionLabel}
              </button>
              <p data-part="note">{noteLabel}</p>
            </aside>
          </div>
          <div data-part="below">
            {children ?? (
              <>
                <section>
                  <h2>Характеристики</h2>
                  <dl data-part="specs">
                    <div>
                      <dt>Материал</dt>
                      <dd>Массив дуба</dd>
                    </div>
                    <div>
                      <dt>Размеры</dt>
                      <dd>78 × 64 × 82 см</dd>
                    </div>
                    <div>
                      <dt>Вес</dt>
                      <dd>12,4 кг</dd>
                    </div>
                    <div>
                      <dt>Гарантия</dt>
                      <dd>5 лет</dd>
                    </div>
                  </dl>
                </section>
                <section>
                  <h2>Отзывы</h2>
                  <div data-part="review">
                    <strong>Марина, Екатеринбург</strong>
                    <p>
                      Кресло собрала одна за вечер. Дерево пахнет мастерской,
                      подушка держит форму. Через месяц — как новое.
                    </p>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
