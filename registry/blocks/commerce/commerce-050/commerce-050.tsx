import type { CSSProperties } from "react"

export type Commerce050Card = {
  id: string
  title: string
  spec: string
  price: string
  hue?: number
}

export type Commerce050Props = {
  title?: string
  shown?: number
  total?: number
  cards?: Commerce050Card[]
  skeletons?: number
  loading?: string
  cta?: string
  footerHint?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: каталог с бесконечной прокруткой, у которого есть выход.
// Ниже сетки стоит ряд скелетонов и кнопка «показать ещё»: подгрузка по
// прокрутке лишает клавиатуру и скринридер способа добраться до подвала,
// поэтому кнопка остаётся обязательной, а счётчик «показано N из M»
// объявляется в aria-live — иначе прирост списка не слышен.
const STYLES = `
:where([data-vibeui-block="commerce-050"]){
--vibeui-commerce-050-bg:oklch(1 0 0);
--vibeui-commerce-050-fg:oklch(0.21 0.012 265);
--vibeui-commerce-050-muted:oklch(0.55 0.014 265);
--vibeui-commerce-050-border:oklch(0.91 0.006 265);
--vibeui-commerce-050-soft:oklch(0.965 0.004 265);
--vibeui-commerce-050-accent:oklch(0.52 0.16 285);
--vibeui-commerce-050-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-050"]{
box-sizing:border-box;background:var(--vibeui-commerce-050-bg);
color:var(--vibeui-commerce-050-fg);font-family:var(--vibeui-commerce-050-sans);
}
[data-vibeui-block="commerce-050"] *{box-sizing:border-box}
[data-vibeui-block="commerce-050"] [data-part="shell"]{max-width:70rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-050"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:1rem}
[data-vibeui-block="commerce-050"] h2{margin:0;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-050"] [data-part="counter"]{margin:0;font-size:0.8125rem;color:var(--vibeui-commerce-050-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-050"] [data-part="counter"] strong{color:var(--vibeui-commerce-050-fg);font-weight:700}
[data-vibeui-block="commerce-050"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="commerce-050"] [data-part="card"]{position:relative;border:1px solid var(--vibeui-commerce-050-border);border-radius:0.875rem;overflow:hidden;background:var(--vibeui-commerce-050-bg)}
[data-vibeui-block="commerce-050"] [data-part="card"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-050-accent);outline-offset:2px}
[data-vibeui-block="commerce-050"] [data-part="cover"]{
display:block;aspect-ratio:4/3;
background:linear-gradient(155deg,oklch(0.94 0.05 var(--vibeui-commerce-050-hue,285)),oklch(0.85 0.09 var(--vibeui-commerce-050-hue,285)));
}
[data-vibeui-block="commerce-050"] [data-part="body"]{padding:0.5rem 0.625rem 0.75rem}
[data-vibeui-block="commerce-050"] [data-part="name"]{margin:0;font-size:0.8125rem;font-weight:650;line-height:1.35}
[data-vibeui-block="commerce-050"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-050"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-050"] [data-part="spec"]{margin:0.125rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-050-muted)}
[data-vibeui-block="commerce-050"] [data-part="price"]{margin:0.3125rem 0 0;font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-050"] [data-part="ghost"]{border:1px solid var(--vibeui-commerce-050-border);border-radius:0.875rem;overflow:hidden}
[data-vibeui-block="commerce-050"] [data-part="ghostcover"]{display:block;aspect-ratio:4/3}
[data-vibeui-block="commerce-050"] [data-part="ghostline"]{display:block;height:0.625rem;border-radius:9999px;margin:0.5rem 0.625rem}
[data-vibeui-block="commerce-050"] [data-part="ghostline"][data-short]{width:55%}
[data-vibeui-block="commerce-050"] [data-part="ghostcover"],
[data-vibeui-block="commerce-050"] [data-part="ghostline"]{
background:linear-gradient(100deg,var(--vibeui-commerce-050-soft) 30%,oklch(0.92 0.006 265) 50%,var(--vibeui-commerce-050-soft) 70%);
background-size:220% 100%;
animation:vibeui-commerce-050-sweep 1.4s linear infinite;
}
@keyframes vibeui-commerce-050-sweep{from{background-position:120% 0}to{background-position:-120% 0}}
[data-vibeui-block="commerce-050"] [data-part="foot"]{margin-top:1.25rem;text-align:center}
[data-vibeui-block="commerce-050"] [data-part="loading"]{margin:0 0 0.75rem;font-size:0.8125rem;color:var(--vibeui-commerce-050-muted)}
[data-vibeui-block="commerce-050"] [data-part="more"]{
appearance:none;cursor:pointer;height:2.75rem;padding:0 1.75rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-050-border);background:var(--vibeui-commerce-050-bg);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-050"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-commerce-050-accent);outline-offset:2px}
[data-vibeui-block="commerce-050"] [data-part="hint"]{
margin:0.875rem auto 0;max-width:44ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-050-muted);
}
@container (min-width: 34rem){
[data-vibeui-block="commerce-050"] ul{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 52rem){
[data-vibeui-block="commerce-050"] [data-part="shell"]{padding:2rem 2rem 3rem}
[data-vibeui-block="commerce-050"] ul{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-050"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CARDS: Commerce050Card[] = [
  {
    id: "1",
    title: "Стеллаж «Причал»",
    spec: "Дуб, 5 полок",
    price: "34 900 ₽",
    hue: 65,
  },
  {
    id: "2",
    title: "Кресло «Хмарь»",
    spec: "Букле, подлокотники",
    price: "38 900 ₽",
    hue: 285,
  },
  {
    id: "3",
    title: "Торшер «Сумерки»",
    spec: "Тёплый свет 2700 K",
    price: "16 200 ₽",
    hue: 150,
  },
  {
    id: "4",
    title: "Стол «Отмель»",
    spec: "Ясень, 140×80 см",
    price: "52 400 ₽",
    hue: 20,
  },
  {
    id: "5",
    title: "Комод «Затон»",
    spec: "4 ящика, доводчики",
    price: "41 700 ₽",
    hue: 200,
  },
  {
    id: "6",
    title: "Ковёр «Туман»",
    spec: "Шерсть, 200×300 см",
    price: "27 600 ₽",
    hue: 330,
  },
  {
    id: "7",
    title: "Тумба «Осока»",
    spec: "Берёза, ниша под книги",
    price: "18 300 ₽",
    hue: 110,
  },
  {
    id: "8",
    title: "Пуф «Кочка»",
    spec: "Съёмный чехол",
    price: "9 900 ₽",
    hue: 45,
  },
]

/**
 * Каталог с бесконечной прокруткой: ряд скелетонов, счётчик в aria-live и
 * кнопка-выход. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce050({
  title = "Мебель для гостиной",
  shown = 8,
  total = 128,
  cards = DEFAULT_CARDS,
  skeletons = 4,
  loading = "Подгружаем следующие товары…",
  cta = "Показать ещё 24 товара",
  footerHint = "Кнопка нужна не для красоты: без неё до подвала сайта нельзя добраться ни с клавиатуры, ни прокруткой — список догружается бесконечно.",
  accent,
  className,
  style,
}: Commerce050Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-050-accent": accent } : null),
    ...style,
  } as CSSProperties
  const ghosts = Array.from({ length: Math.max(0, skeletons) }, (_, i) => i)

  return (
    <>
      <style href="vibeui-commerce-050" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-050"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>{title}</h2>
            <p data-part="counter" aria-live="polite">
              Показано <strong>{shown}</strong> из <strong>{total}</strong>
            </p>
          </div>

          <ul>
            {cards.map((card) => (
              <li
                key={card.id}
                data-part="card"
                style={
                  {
                    "--vibeui-commerce-050-hue": card.hue ?? 285,
                  } as CSSProperties
                }
              >
                <span data-part="cover" aria-hidden="true" />
                <div data-part="body">
                  <p data-part="name">
                    <a href="#product">{card.title}</a>
                  </p>
                  <p data-part="spec">{card.spec}</p>
                  <p data-part="price">{card.price}</p>
                </div>
              </li>
            ))}
            {ghosts.map((ghost) => (
              <li key={`ghost-${ghost}`} data-part="ghost" aria-hidden="true">
                <span data-part="ghostcover" />
                <span data-part="ghostline" />
                <span data-part="ghostline" data-short="true" />
              </li>
            ))}
          </ul>

          <div data-part="foot">
            <p data-part="loading" role="status">
              {loading}
            </p>
            <button type="button" data-part="more">
              {cta}
            </button>
            <p data-part="hint">{footerHint}</p>
          </div>
        </div>
      </section>
    </>
  )
}
