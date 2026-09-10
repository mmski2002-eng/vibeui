import type { CSSProperties, ReactNode } from "react"

type Layout002Filter = {
  title: string
  options: string[]
}

type Layout002Card = {
  title: string
  note: string
  price: string
}

export type Layout002Props = {
  /** Своя выдача вместо демонстрационных карточек. */
  children?: ReactNode
  heading?: string
  /** Состояние выдачи: результаты, загрузка или пусто. */
  state?: "results" | "loading" | "empty"
  filters?: Layout002Filter[]
  cards?: Layout002Card[]
  resultsLabel?: string
  sortLabel?: string
  sortOptions?: string[]
  emptyTitle?: string
  emptyText?: string
  moreLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Каркас каталога с фильтрами: слева фильтры группами-раскрытиями, справа
// панель с количеством и сортировкой, сетка карточек и «Показать ещё»
// вместо бесконечной ленты — футер страницы остаётся достижимым. Пустая
// выдача и загрузка — обязательные состояния, а не сюрприз. Состояние
// фильтров и настоящий поиск подключает принимающий проект.
const STYLES = `
:where([data-vibeui-block="layout-002"]){
--vibeui-layout-002-bg:#ffffff;
--vibeui-layout-002-ink:#000000;
--vibeui-layout-002-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-002-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-002-panel:#f2f2f2;
--vibeui-layout-002-accent:#ff5900;
--vibeui-layout-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-002"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-002-bg);color:var(--vibeui-layout-002-ink);
font-family:var(--vibeui-layout-002-font);
}
[data-vibeui-block="layout-002"] *{box-sizing:border-box}
[data-vibeui-block="layout-002"] [data-part="shell"]{
max-width:84rem;margin:0 auto;padding:2rem 1rem 3rem;
display:flex;flex-direction:column;gap:1.5rem;
}
[data-vibeui-block="layout-002"] [data-part="heading"]{
margin:0;font-size:clamp(1.625rem,4cqi,2.5rem);line-height:1.08;
letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-002"] [data-part="body"]{
display:flex;flex-direction:column;gap:1.5rem;align-items:stretch;
}
[data-vibeui-block="layout-002"] [data-part="filters"]{
flex:none;display:flex;flex-direction:column;
border:1px solid var(--vibeui-layout-002-line);
}
[data-vibeui-block="layout-002"] [data-part="filters"] h2{
margin:0;padding:0.875rem 1rem;font-size:0.9375rem;font-weight:640;
border-bottom:1px solid var(--vibeui-layout-002-line);
}
[data-vibeui-block="layout-002"] [data-part="group"]{border-bottom:1px solid var(--vibeui-layout-002-line)}
[data-vibeui-block="layout-002"] [data-part="group"]:last-of-type{border-bottom:0}
[data-vibeui-block="layout-002"] [data-part="group"] summary{
list-style:none;cursor:pointer;user-select:none;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.8125rem 1rem;font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="layout-002"] [data-part="group"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="layout-002"] [data-part="group"] summary::after{
content:"";width:0.4375rem;height:0.4375rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="layout-002"] [data-part="group"][open] summary::after{transform:rotate(225deg)}
[data-vibeui-block="layout-002"] [data-part="option"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 1rem;font-size:0.9375rem;color:var(--vibeui-layout-002-ink);
}
[data-vibeui-block="layout-002"] [data-part="option"] input{
appearance:none;width:1.0625rem;height:1.0625rem;margin:0;flex:none;
border:1.5px solid color-mix(in oklab,#000000 34%,#ffffff);
background:var(--vibeui-layout-002-bg);cursor:pointer;
display:grid;place-items:center;
}
[data-vibeui-block="layout-002"] [data-part="option"] input:checked{
background:var(--vibeui-layout-002-accent);border-color:var(--vibeui-layout-002-accent);
}
[data-vibeui-block="layout-002"] [data-part="option"] input:checked::after{
content:"";width:0.5625rem;height:0.3125rem;margin-top:-0.125rem;
border-left:2px solid #000000;border-bottom:2px solid #000000;
transform:rotate(-45deg);
}
[data-vibeui-block="layout-002"] [data-part="option"] input:focus-visible{
outline:2px solid var(--vibeui-layout-002-accent);outline-offset:2px;
}
[data-vibeui-block="layout-002"] [data-part="group"] > div{padding-bottom:0.625rem}
[data-vibeui-block="layout-002"] [data-part="results"]{
flex:1 1 auto;min-width:0;display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-002"] [data-part="toolbar"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem;
padding-bottom:0.75rem;border-bottom:1px solid var(--vibeui-layout-002-line);
}
[data-vibeui-block="layout-002"] [data-part="count"]{
font-size:0.9375rem;color:var(--vibeui-layout-002-muted);
}
[data-vibeui-block="layout-002"] [data-part="sort"]{
margin-left:auto;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.875rem;color:var(--vibeui-layout-002-muted);
}
[data-vibeui-block="layout-002"] [data-part="sort"] select{
font:inherit;font-size:0.875rem;color:var(--vibeui-layout-002-ink);
background:var(--vibeui-layout-002-bg);
border:1px solid var(--vibeui-layout-002-line);
padding:0.375rem 0.5rem;min-height:2.25rem;
}
[data-vibeui-block="layout-002"] [data-part="sort"] select:focus-visible{
outline:2px solid var(--vibeui-layout-002-accent);outline-offset:2px;
}
[data-vibeui-block="layout-002"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(auto-fill,minmax(13rem,1fr));gap:1rem;
}
[data-vibeui-block="layout-002"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.375rem;
color:inherit;text-decoration:none;
}
[data-vibeui-block="layout-002"] [data-part="photo"]{
aspect-ratio:4/3;background:linear-gradient(160deg,var(--vibeui-layout-002-panel) 0%,color-mix(in oklab,var(--vibeui-layout-002-panel) 76%,#000000) 100%);
margin-bottom:0.375rem;
}
[data-vibeui-block="layout-002"] [data-part="card"]:hover [data-part="title"]{color:var(--vibeui-layout-002-accent)}
[data-vibeui-block="layout-002"] [data-part="title"]{
font-size:0.9375rem;font-weight:580;letter-spacing:-0.01em;
transition:color .16s ease;
}
[data-vibeui-block="layout-002"] [data-part="note"]{
font-size:0.8125rem;color:var(--vibeui-layout-002-muted);
}
[data-vibeui-block="layout-002"] [data-part="price"]{
font-size:0.9375rem;font-weight:660;
}
[data-vibeui-block="layout-002"] [data-part="skeleton"] [data-part="photo"],
[data-vibeui-block="layout-002"] [data-part="skeleton"] i{
background:var(--vibeui-layout-002-panel);
animation:vibeui-layout-002-pulse 1.4s ease-in-out infinite;
}
[data-vibeui-block="layout-002"] [data-part="skeleton"] i{
display:block;height:0.875rem;margin-top:0.375rem;
}
[data-vibeui-block="layout-002"] [data-part="skeleton"] i:last-child{width:44%}
@keyframes vibeui-layout-002-pulse{0%,100%{opacity:1}50%{opacity:0.55}}
[data-vibeui-block="layout-002"] [data-part="empty"]{
display:flex;flex-direction:column;align-items:flex-start;gap:0.625rem;
padding:3rem 1.5rem;border:1px dashed var(--vibeui-layout-002-line);
}
[data-vibeui-block="layout-002"] [data-part="empty"] strong{
font-size:1.125rem;font-weight:650;
}
[data-vibeui-block="layout-002"] [data-part="empty"] p{
margin:0;max-width:40ch;font-size:0.9375rem;line-height:1.55;
color:var(--vibeui-layout-002-muted);
}
[data-vibeui-block="layout-002"] [data-part="more"]{
align-self:center;display:inline-flex;align-items:center;
min-height:2.625rem;padding:0.375rem 1.5rem;margin-top:0.5rem;
border:1px solid var(--vibeui-layout-002-ink);
color:var(--vibeui-layout-002-ink);text-decoration:none;
font-size:0.9375rem;font-weight:580;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="layout-002"] [data-part="more"]:hover{
background:var(--vibeui-layout-002-ink);color:var(--vibeui-layout-002-bg);
}
[data-vibeui-block="layout-002"] a:focus-visible,
[data-vibeui-block="layout-002"] summary:focus-visible{
outline:2px solid var(--vibeui-layout-002-accent);outline-offset:2px;
}
@container (min-width: 54rem){
[data-vibeui-block="layout-002"] [data-part="shell"]{padding:2.5rem 2rem 4rem}
[data-vibeui-block="layout-002"] [data-part="body"]{flex-direction:row}
[data-vibeui-block="layout-002"] [data-part="filters"]{width:16rem;align-self:flex-start;position:sticky;top:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILTERS: Layout002Filter[] = [
  { title: "Категория", options: ["Кресла", "Столы", "Свет", "Хранение"] },
  { title: "Материал", options: ["Дуб", "Ясень", "Металл", "Текстиль"] },
  { title: "Цена", options: ["До 10 000 ₽", "10–50 тыс. ₽", "От 50 тыс. ₽"] },
]

const DEFAULT_CARDS: Layout002Card[] = [
  { title: "Кресло «Сектор»", note: "Дуб, тёмная пропитка", price: "42 900 ₽" },
  { title: "Стол «Плоскость»", note: "Ясень, 140 см", price: "58 000 ₽" },
  { title: "Светильник «Луч»", note: "Металл, латунь", price: "12 400 ₽" },
  { title: "Стеллаж «Каркас»", note: "Металл, 5 полок", price: "27 300 ₽" },
  { title: "Кресло «Дуга»", note: "Текстиль, графит", price: "36 500 ₽" },
  { title: "Стол «Грань»", note: "Дуб, раскладной", price: "74 900 ₽" },
]

/** Каркас каталога: фильтры, панель сортировки, сетка карточек и «Показать ещё». */
export function Layout002({
  children,
  heading = "Каталог мебели",
  state = "results",
  filters = DEFAULT_FILTERS,
  cards = DEFAULT_CARDS,
  resultsLabel = "126 товаров",
  sortLabel = "Сортировка",
  sortOptions = ["Сначала популярные", "Сначала дешевле", "Сначала дороже", "Новинки"],
  emptyTitle = "Ничего не нашлось",
  emptyText = "Попробуйте убрать часть фильтров или изменить запрос — каталог большой, нужное наверняка рядом.",
  moreLabel = "Показать ещё",
  accent,
  className,
  style,
}: Layout002Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-002" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="layout-002" className={className} style={palette}>
        <div data-part="shell">
          <h1 data-part="heading">{heading}</h1>
          <div data-part="body">
            <aside data-part="filters" aria-label="Фильтры">
              <h2>Фильтры</h2>
              {filters.map((group, index) => (
                <details data-part="group" key={group.title} open={index === 0}>
                  <summary>{group.title}</summary>
                  <div>
                    {group.options.map((option, optionIndex) => (
                      <label data-part="option" key={option}>
                        <input
                          type="checkbox"
                          defaultChecked={index === 0 && optionIndex === 0}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </details>
              ))}
            </aside>
            <section data-part="results" aria-label={heading}>
              <div data-part="toolbar">
                <span data-part="count" role="status">
                  {state === "loading" ? "Загружаем…" : state === "empty" ? "0 товаров" : resultsLabel}
                </span>
                <label data-part="sort">
                  {sortLabel}
                  <select defaultValue={sortOptions[0]}>
                    {sortOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
              {children ??
                (state === "empty" ? (
                  <div data-part="empty">
                    <strong>{emptyTitle}</strong>
                    <p>{emptyText}</p>
                  </div>
                ) : state === "loading" ? (
                  <div data-part="grid" aria-hidden="true">
                    {Array.from({ length: 6 }, (_, index) => (
                      <div data-part="skeleton" key={index}>
                        <div data-part="photo" />
                        <i />
                        <i />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div data-part="grid">
                      {cards.map((card) => (
                        <a data-part="card" href="#item" key={card.title}>
                          <span data-part="photo" aria-hidden="true" />
                          <span data-part="title">{card.title}</span>
                          <span data-part="note">{card.note}</span>
                          <span data-part="price">{card.price}</span>
                        </a>
                      ))}
                    </div>
                    <a data-part="more" href="#more">
                      {moreLabel}
                    </a>
                  </>
                ))}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
