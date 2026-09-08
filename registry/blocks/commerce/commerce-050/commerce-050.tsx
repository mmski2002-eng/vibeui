import type { CSSProperties } from "react"

export type Commerce050Card = {
  id: string
  title: string
  spec: string
  price: string
  hue?: number
  /** Фото товара. Без него на том же месте остаётся цветное поле. */
  image?: string
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
  /** Счётчик: ключи shown («Показано») и of («из»). */
  counterText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
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
--vibeui-commerce-050-bg:transparent;
--vibeui-commerce-050-fg:light-dark(oklch(0.21 0 265),oklch(0.93 0 265));
--vibeui-commerce-050-muted:light-dark(oklch(0.55 0 265),oklch(0.72 0 265));
--vibeui-commerce-050-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-commerce-050-soft:light-dark(oklch(0.965 0 265),oklch(0.28 0 265));
--vibeui-commerce-050-shine:light-dark(oklch(0.92 0 265),oklch(0.36 0 265));
--vibeui-commerce-050-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.75 0.15 39.8));
--vibeui-commerce-050-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-050"]{color-scheme:dark}
[data-vibeui-block="commerce-050"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
overflow:hidden;
}
/* Подложка — только когда фото нет: блок обязан быть полноценным
   без единого внешнего файла. */
[data-vibeui-block="commerce-050"] [data-part="cover"][data-empty="true"]{background:linear-gradient(155deg,oklch(0.94 0.05 var(--vibeui-commerce-050-hue,285)),oklch(0.85 0.09 var(--vibeui-commerce-050-hue,285)));}
[data-vibeui-block="commerce-050"] [data-part="cover"] img{
display:block;width:100%;height:100%;object-fit:cover;
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
background:linear-gradient(100deg,var(--vibeui-commerce-050-soft) 30%,var(--vibeui-commerce-050-shine) 50%,var(--vibeui-commerce-050-soft) 70%);
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

const DEFAULT_COUNTER: Record<string, string> = {
  shown: "Показано",
  of: "из",
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

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
  counterText = DEFAULT_COUNTER,
  accent,
  background = "",
  className,
  style,
}: Commerce050Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-050-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-050-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
              {counterText.shown ?? DEFAULT_COUNTER.shown}{" "}
              <strong>{shown}</strong> {counterText.of ?? DEFAULT_COUNTER.of}{" "}
              <strong>{total}</strong>
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
                <span
                  data-part="cover"
                  data-empty={card.image ? undefined : "true"}
                  aria-hidden={card.image ? undefined : true}
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
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
