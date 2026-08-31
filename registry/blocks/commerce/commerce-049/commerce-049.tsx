import type { CSSProperties } from "react"

export type Commerce049Crumb = {
  id: string
  label: string
}

export type Commerce049Item = {
  id: string
  title: string
  material: string
  price: string
  hue?: number
}

export type Commerce049Props = {
  crumbs?: Commerce049Crumb[]
  collection?: string
  title?: string
  lead?: string
  curator?: string
  curatorRole?: string
  released?: string
  count?: string
  cta?: string
  storyTitle?: string
  story?: string
  items?: Commerce049Item[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница коллекции, где баннер несёт не картинку, а контекст —
// кто собрал, когда и сколько вещей внутри. Текст лежит поверх подложки
// с затемнением, поэтому читается и на фото, и на градиенте. Раскладка
// баннера и сетки считается контейнерными запросами от ширины блока.
const STYLES = `
:where([data-vibeui-block="commerce-049"]){
--vibeui-commerce-049-bg:oklch(1 0 0);
--vibeui-commerce-049-fg:oklch(0.2 0.012 250);
--vibeui-commerce-049-muted:oklch(0.53 0.014 250);
--vibeui-commerce-049-border:oklch(0.91 0.006 250);
--vibeui-commerce-049-soft:oklch(0.975 0.004 250);
--vibeui-commerce-049-accent:oklch(0.48 0.12 195);
--vibeui-commerce-049-onbanner:oklch(0.99 0 0);
--vibeui-commerce-049-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="commerce-049"]{
box-sizing:border-box;background:var(--vibeui-commerce-049-bg);
color:var(--vibeui-commerce-049-fg);font-family:var(--vibeui-commerce-049-sans);
}
[data-vibeui-block="commerce-049"] *{box-sizing:border-box}
[data-vibeui-block="commerce-049"] [data-part="shell"]{max-width:70rem;margin:0 auto;padding:1.25rem 1rem 2rem}
[data-vibeui-block="commerce-049"] nav ol{list-style:none;display:flex;flex-wrap:wrap;gap:0.375rem;margin:0 0 0.875rem;padding:0;font-size:0.75rem;color:var(--vibeui-commerce-049-muted)}
[data-vibeui-block="commerce-049"] nav li+li::before{content:"/";margin-right:0.375rem;color:var(--vibeui-commerce-049-border)}
[data-vibeui-block="commerce-049"] nav a{color:inherit;text-decoration:none}
[data-vibeui-block="commerce-049"] nav a:hover{text-decoration:underline}
[data-vibeui-block="commerce-049"] [data-part="banner"]{
position:relative;border-radius:1.25rem;overflow:hidden;padding:1.75rem 1.25rem;
min-height:15rem;display:flex;flex-direction:column;justify-content:flex-end;
color:var(--vibeui-commerce-049-onbanner);
background:
linear-gradient(180deg,oklch(0.2 0.05 200 / 10%),oklch(0.16 0.05 200 / 78%)),
linear-gradient(115deg,oklch(0.62 0.13 195),oklch(0.45 0.11 265) 55%,oklch(0.55 0.14 25));
}
[data-vibeui-block="commerce-049"] [data-part="chip"]{
align-self:flex-start;display:inline-flex;height:1.625rem;align-items:center;padding:0 0.75rem;border-radius:9999px;
background:oklch(1 0 0 / 18%);border:1px solid oklch(1 0 0 / 32%);
font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
}
[data-vibeui-block="commerce-049"] h2{margin:0.75rem 0 0.5rem;max-width:20ch;font-size:clamp(1.5rem,5.5cqi,2.75rem);line-height:1.05;letter-spacing:-0.025em}
[data-vibeui-block="commerce-049"] [data-part="lead"]{margin:0;max-width:48ch;font-size:0.9375rem;line-height:1.55;color:oklch(1 0 0 / 84%)}
[data-vibeui-block="commerce-049"] [data-part="facts"]{
display:flex;flex-wrap:wrap;gap:0.5rem 1.25rem;margin:1rem 0 0;padding:0;list-style:none;
font-size:0.8125rem;color:oklch(1 0 0 / 82%);
}
[data-vibeui-block="commerce-049"] [data-part="facts"] strong{font-weight:700;color:var(--vibeui-commerce-049-onbanner)}
[data-vibeui-block="commerce-049"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;align-self:flex-start;margin-top:1.125rem;
height:2.625rem;padding:0 1.375rem;border-radius:0.875rem;
background:var(--vibeui-commerce-049-onbanner);color:oklch(0.2 0.05 220);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-049"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-049-onbanner);outline-offset:3px}
[data-vibeui-block="commerce-049"] [data-part="under"]{display:grid;gap:1.25rem;margin-top:1.5rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-049"] [data-part="story"]{
border:1px solid var(--vibeui-commerce-049-border);border-radius:1rem;padding:1rem 1.125rem;background:var(--vibeui-commerce-049-soft);
}
[data-vibeui-block="commerce-049"] h3{margin:0 0 0.5rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="commerce-049"] [data-part="story"] p{margin:0;font-size:0.875rem;line-height:1.6;color:var(--vibeui-commerce-049-muted)}
[data-vibeui-block="commerce-049"] ul[data-part="items"]{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="commerce-049"] [data-part="item"]{position:relative;border:1px solid var(--vibeui-commerce-049-border);border-radius:0.875rem;overflow:hidden}
[data-vibeui-block="commerce-049"] [data-part="item"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-049-accent);outline-offset:2px}
[data-vibeui-block="commerce-049"] [data-part="cover"]{
display:block;aspect-ratio:4/5;
background:linear-gradient(160deg,oklch(0.94 0.05 var(--vibeui-commerce-049-hue,195)),oklch(0.84 0.1 var(--vibeui-commerce-049-hue,195)));
}
[data-vibeui-block="commerce-049"] [data-part="body"]{padding:0.5rem 0.625rem 0.75rem}
[data-vibeui-block="commerce-049"] [data-part="name"]{margin:0;font-size:0.8125rem;font-weight:650;line-height:1.35}
[data-vibeui-block="commerce-049"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-049"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-049"] [data-part="material"]{margin:0.125rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-049-muted)}
[data-vibeui-block="commerce-049"] [data-part="price"]{margin:0.3125rem 0 0;font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums}
@container (min-width: 38rem){
[data-vibeui-block="commerce-049"] [data-part="banner"]{min-height:20rem;padding:2.25rem 2rem}
[data-vibeui-block="commerce-049"] ul[data-part="items"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@container (min-width: 58rem){
[data-vibeui-block="commerce-049"] [data-part="shell"]{padding:2rem 2rem 3rem}
[data-vibeui-block="commerce-049"] [data-part="under"]{grid-template-columns:18rem minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-049"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CRUMBS: Commerce049Crumb[] = [
  { id: "1", label: "Каталог" },
  { id: "2", label: "Коллекции" },
  { id: "3", label: "Северный лён" },
]

const DEFAULT_ITEMS: Commerce049Item[] = [
  {
    id: "1",
    title: "Скатерть «Заводь»",
    material: "Лён 240 г/м²",
    price: "6 900 ₽",
    hue: 195,
  },
  {
    id: "2",
    title: "Салфетки, 4 шт.",
    material: "Лён с мережкой",
    price: "2 400 ₽",
    hue: 150,
  },
  {
    id: "3",
    title: "Полотенце «Плёс»",
    material: "Вафельное плетение",
    price: "1 800 ₽",
    hue: 265,
  },
  {
    id: "4",
    title: "Фартук «Пристань»",
    material: "Лён с кожаным шнуром",
    price: "4 300 ₽",
    hue: 25,
  },
]

/**
 * Страница коллекции с баннером: над обложкой стоит контекст — кто собрал,
 * когда и сколько вещей. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce049({
  crumbs = DEFAULT_CRUMBS,
  collection = "Коллекция",
  title = "Северный лён",
  lead = "Двенадцать вещей для стола и кухни из льна одной прядильни. Ткань не отбеливали, поэтому оттенок партии слегка плавает — это видно на фотографиях.",
  curator = "Мастерская «Плёс»",
  curatorRole = "Куратор",
  released = "Март 2024",
  count = "12 вещей",
  cta = "Смотреть все вещи",
  storyTitle = "О коллекции",
  story = "Лён закупают в Вологодской области и ткут на станках 1970-х годов: они дают неровную фактуру, которую современное оборудование не повторяет. Каждую вещь стирают до продажи, поэтому после первой домашней стирки она почти не садится.",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
}: Commerce049Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-049-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-049" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-049"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <nav aria-label="Навигация по каталогу">
            <ol>
              {crumbs.map((crumb, index) => (
                <li key={crumb.id}>
                  {index === crumbs.length - 1 ? (
                    <span aria-current="page">{crumb.label}</span>
                  ) : (
                    <a href="#catalog">{crumb.label}</a>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div data-part="banner">
            <span data-part="chip">{collection}</span>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <ul data-part="facts">
              <li>
                {curatorRole}: <strong>{curator}</strong>
              </li>
              <li>
                Выпуск: <strong>{released}</strong>
              </li>
              <li>
                В коллекции: <strong>{count}</strong>
              </li>
            </ul>
            <button type="button" data-part="go">
              {cta}
            </button>
          </div>

          <div data-part="under">
            <div data-part="story">
              <h3>{storyTitle}</h3>
              <p>{story}</p>
            </div>
            <ul data-part="items">
              {items.map((item) => (
                <li
                  key={item.id}
                  data-part="item"
                  style={
                    {
                      "--vibeui-commerce-049-hue": item.hue ?? 195,
                    } as CSSProperties
                  }
                >
                  <span data-part="cover" aria-hidden="true" />
                  <div data-part="body">
                    <p data-part="name">
                      <a href="#product">{item.title}</a>
                    </p>
                    <p data-part="material">{item.material}</p>
                    <p data-part="price">{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
