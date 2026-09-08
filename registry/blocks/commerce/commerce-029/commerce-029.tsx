import type { CSSProperties } from "react"

export type Commerce029Hit = {
  id: string
  title: string
  spec: string
  price: string
  stock: string
  hue?: number
  /** Фото товара. Без него на том же месте остаётся цветное поле. */
  image?: string
}

export type Commerce029Refine = {
  group: string
  values: string[]
}

export type Commerce029Props = {
  query?: string
  found?: number
  corrected?: string
  original?: string
  refineTitle?: string
  refines?: Commerce029Refine[]
  related?: string[]
  hits?: Commerce029Hit[]
  more?: string
  /** Заголовок блока похожих запросов. */
  relatedTitle?: string
  /** Подпись экрана для скринридера: {query} подставляет запрос. */
  resultsLabel?: string
  /** Скрытая подпись поля поиска и подсказка внутри него. */
  searchLabel?: string
  searchPlaceholder?: string
  /** Подпись кнопки очистки поля. */
  clearLabel?: string
  /** Подпись кнопки отправки формы. */
  submitText?: string
  /** Плашка исправления: {corrected} и {original} подставляют запросы. */
  fixText?: string
  fixLinkText?: string
  /** Строка счётчика: {count} подставляет число, {query} — запрос. */
  countText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран результатов поиска, где уточнения стоят выше выдачи.
// Пользователь, набравший два слова, не готов идти в сайдбар фильтров —
// поэтому самые частые уточнения вынесены строками чипов прямо под запросом.
// Исправление опечатки объявлено словами и оставляет ссылку на исходный
// запрос: молчаливая подмена запроса выглядит как чужая выдача.
const STYLES = `
:where([data-vibeui-block="commerce-029"]){
--vibeui-commerce-029-bg:transparent;
--vibeui-commerce-029-radius:0;
--vibeui-commerce-029-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-029-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-029-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-commerce-029-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-029-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-commerce-029-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-029-warn:light-dark(oklch(0.98 0.03 85),oklch(0.33 0.05 85));
--vibeui-commerce-029-hl:light-dark(oklch(0.93 0.11 39.8),oklch(0.52 0.11 39.8));
--vibeui-commerce-029-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-029"]{color-scheme:dark}
[data-vibeui-block="commerce-029"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-029-bg);
border-radius:var(--vibeui-commerce-029-radius);
color:var(--vibeui-commerce-029-fg);font-family:var(--vibeui-commerce-029-sans);
}
[data-vibeui-block="commerce-029"] *{box-sizing:border-box}
[data-vibeui-block="commerce-029"] [data-part="shell"]{max-width:60rem;margin:0 auto;padding:1.25rem 1rem}
[data-vibeui-block="commerce-029"] [data-part="search"]{display:flex;gap:0.5rem}
[data-vibeui-block="commerce-029"] [data-part="field"]{position:relative;flex:1 1 auto}
[data-vibeui-block="commerce-029"] input[type="search"]{
width:100%;height:2.75rem;padding:0 2.5rem 0 0.875rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-029-border);background:var(--vibeui-commerce-029-bg);
color:inherit;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="commerce-029"] input[type="search"]:focus-visible{outline:2px solid var(--vibeui-commerce-029-accent);outline-offset:1px}
[data-vibeui-block="commerce-029"] [data-part="clear"]{
position:absolute;right:0.375rem;top:50%;transform:translateY(-50%);
appearance:none;border:0;cursor:pointer;width:1.75rem;height:1.75rem;border-radius:9999px;
background:var(--vibeui-commerce-029-soft);color:var(--vibeui-commerce-029-muted);font:inherit;line-height:1;
}
[data-vibeui-block="commerce-029"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;border-radius:0.875rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.75rem;padding:0.25rem 1.125rem;
background:var(--vibeui-commerce-029-accent);color:var(--vibeui-commerce-029-on-accent);font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-029"] [data-part="clear"]:focus-visible,
[data-vibeui-block="commerce-029"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-commerce-029-accent);outline-offset:2px}
/* Исправление опечатки объявлено словами: молчаливая подмена запроса читается как чужая выдача. */
[data-vibeui-block="commerce-029"] [data-part="fix"]{
margin:0.75rem 0 0;padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-commerce-029-warn);font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="commerce-029"] [data-part="fix"] a{color:inherit;font-weight:650}
[data-vibeui-block="commerce-029"] [data-part="count"]{
margin:0.875rem 0 0;font-size:0.8125rem;color:var(--vibeui-commerce-029-muted);
}
[data-vibeui-block="commerce-029"] [data-part="count"] b{color:var(--vibeui-commerce-029-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-029"] h3{
margin:1rem 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.07em;
text-transform:uppercase;color:var(--vibeui-commerce-029-muted);
}
[data-vibeui-block="commerce-029"] [data-part="refine"]{display:grid;gap:0.5rem}
[data-vibeui-block="commerce-029"] [data-part="row"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem}
[data-vibeui-block="commerce-029"] [data-part="group"]{
font-size:0.75rem;font-weight:650;color:var(--vibeui-commerce-029-muted);min-width:6rem;
}
[data-vibeui-block="commerce-029"] [data-part="chip"]{
appearance:none;cursor:pointer;padding:0.3125rem 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-029-border);background:var(--vibeui-commerce-029-bg);
color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="commerce-029"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-commerce-029-accent);outline-offset:2px}
[data-vibeui-block="commerce-029"] [data-part="related"]{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="commerce-029"] [data-part="related"] a{
display:inline-block;padding:0.3125rem 0.75rem;border-radius:9999px;
background:var(--vibeui-commerce-029-soft);font-size:0.8125rem;color:inherit;text-decoration:none;
}
[data-vibeui-block="commerce-029"] [data-part="related"] a:focus-visible{outline:2px solid var(--vibeui-commerce-029-accent);outline-offset:2px}
[data-vibeui-block="commerce-029"] [data-part="hits"]{
list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:0.5rem;
}
[data-vibeui-block="commerce-029"] [data-part="hit"]{
position:relative;display:grid;grid-template-columns:3.5rem minmax(0,1fr);gap:0.75rem;align-items:center;
padding:0.625rem;border:1px solid var(--vibeui-commerce-029-border);border-radius:1rem;
}
@container (min-width: 34rem){
[data-vibeui-block="commerce-029"] [data-part="hit"]{grid-template-columns:4.5rem minmax(0,1fr) auto;padding:0.75rem}
}
[data-vibeui-block="commerce-029"] [data-part="hit"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-029-accent);outline-offset:2px}
[data-vibeui-block="commerce-029"] [data-part="thumb"]{
aspect-ratio:1;border-radius:0.75rem;
overflow:hidden;
}
/* Подложка — только когда фото нет: блок обязан быть полноценным
   без единого внешнего файла. */
[data-vibeui-block="commerce-029"] [data-part="thumb"][data-empty="true"]{background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-029-hue,262)),oklch(0.85 0.09 var(--vibeui-commerce-029-hue,262)));}
[data-vibeui-block="commerce-029"] [data-part="thumb"] img{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="commerce-029"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.35}
[data-vibeui-block="commerce-029"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-029"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-029"] mark{background:var(--vibeui-commerce-029-hl);color:inherit;border-radius:0.1875rem;padding:0 0.0625rem}
[data-vibeui-block="commerce-029"] [data-part="spec"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-029-muted)}
[data-vibeui-block="commerce-029"] [data-part="side"]{grid-column:2;text-align:left}
@container (min-width: 34rem){
[data-vibeui-block="commerce-029"] [data-part="side"]{grid-column:auto;text-align:right}
}
[data-vibeui-block="commerce-029"] [data-part="cost"]{margin:0;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-029"] [data-part="stock"]{margin:0.125rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-029-muted)}
[data-vibeui-block="commerce-029"] [data-part="more"]{
display:block;width:100%;margin-top:0.75rem;appearance:none;cursor:pointer;height:2.5rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-029-border);background:var(--vibeui-commerce-029-bg);
color:inherit;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-029"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-commerce-029-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-029"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_REFINES: Commerce029Refine[] = [
  { group: "Тип", values: ["Настольная", "Настенная", "Торшер", "Подвес"] },
  { group: "Цена", values: ["до 5 000 ₽", "5–15 тыс.", "дороже 15 тыс."] },
  { group: "Свет", values: ["Тёплый", "Нейтральный", "С диммером"] },
]

const DEFAULT_RELATED = [
  "лампа на прищепке",
  "лампа для чтения",
  "лампа с диммером",
  "настольная лампа детская",
]

const DEFAULT_HITS: Commerce029Hit[] = [
  {
    id: "1",
    title: "Настольная лампа «Полдень»",
    spec: "Тёплый свет, диммер, дуб",
    price: "6 900 ₽",
    stock: "на складе, 12 шт.",
    hue: 75,
  },
  {
    id: "2",
    title: "Лампа «Отмель» на прищепке",
    spec: "Крепление до 4 см, гибкая ножка",
    price: "3 200 ₽",
    stock: "на складе, 4 шт.",
    hue: 200,
  },
  {
    id: "3",
    title: "Лампа «Сумерки» с абажуром",
    spec: "Тканый абажур, кнопка на шнуре",
    price: "8 400 ₽",
    stock: "под заказ, 5 дней",
    hue: 150,
  },
  {
    id: "4",
    title: "Лампа «Туман» для чтения",
    spec: "Нейтральный свет, поворотная",
    price: "5 600 ₽",
    stock: "на складе, 30 шт.",
    hue: 262,
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Экран поиска по каталогу: исправление запроса, уточнения чипами и выдача строками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce029({
  query = "настольная лампа",
  found = 214,
  corrected = "настольная лампа",
  original = "настолная лампа",
  refineTitle = "Уточните запрос",
  refines = DEFAULT_REFINES,
  related = DEFAULT_RELATED,
  hits = DEFAULT_HITS,
  more = "Показать ещё 20 товаров",
  relatedTitle = "Ищут вместе с этим",
  resultsLabel = "Результаты поиска: {query}",
  searchLabel = "Поиск по каталогу",
  searchPlaceholder = "Что ищем?",
  clearLabel = "Очистить поле",
  submitText = "Найти",
  fixText = "Показываем результаты по запросу «{corrected}».",
  fixLinkText = "Искать по «{original}» без исправления",
  countText = "Нашли {count} товаров по запросу «{query}»",
  accent,
  background = "",
  className,
  style,
}: Commerce029Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-029-bg": background,
          "--vibeui-commerce-029-radius": "1.25rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  // Число в счётчике выделено жирным, поэтому шаблон разрезается по {count}.
  const [countHead, countTail] = countText
    .replace("{query}", corrected)
    .split("{count}")

  return (
    <>
      <style href="vibeui-commerce-029" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-029"
        className={className}
        style={palette}
        aria-label={resultsLabel.replace("{query}", query)}
      >
        <div data-part="shell">
          <form data-part="search" role="search" action="#results">
            <div data-part="field">
              <label htmlFor="commerce-029-q" hidden>
                {searchLabel}
              </label>
              <input
                id="commerce-029-q"
                type="search"
                name="q"
                defaultValue={query}
                placeholder={searchPlaceholder}
              />
              <button type="button" data-part="clear" aria-label={clearLabel}>
                ×
              </button>
            </div>
            <button type="submit" data-part="submit">
              {submitText}
            </button>
          </form>

          {corrected !== original ? (
            <p data-part="fix">
              {fixText.replace("{corrected}", corrected)}{" "}
              <a href="#exact">{fixLinkText.replace("{original}", original)}</a>
            </p>
          ) : null}

          <p data-part="count" aria-live="polite">
            {countHead}
            <b>{found}</b>
            {countTail ?? ""}
          </p>

          <h3>{refineTitle}</h3>
          <div data-part="refine">
            {refines.map((refine) => (
              <div data-part="row" key={refine.group}>
                <span data-part="group">{refine.group}</span>
                {refine.values.map((value) => (
                  <button
                    type="button"
                    data-part="chip"
                    key={value}
                    aria-label={`${refine.group}: ${value}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <h3>{relatedTitle}</h3>
          <ul data-part="related">
            {related.map((item) => (
              <li key={item}>
                <a href="#related">{item}</a>
              </li>
            ))}
          </ul>

          <ul data-part="hits" id="results">
            {hits.map((hit) => (
              <li
                key={hit.id}
                data-part="hit"
                style={
                  {
                    "--vibeui-commerce-029-hue": hit.hue ?? 262,
                  } as CSSProperties
                }
              >
                <span
                  data-part="thumb"
                  data-empty={hit.image ? undefined : "true"}
                  aria-hidden={hit.image ? undefined : true}
                >
                  {hit.image ? (
                    <img
                      src={hit.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
                <div>
                  <p data-part="name">
                    <a href="#product">{hit.title}</a>
                  </p>
                  <p data-part="spec">{hit.spec}</p>
                </div>
                <div data-part="side">
                  <p data-part="cost">{hit.price}</p>
                  <p data-part="stock">{hit.stock}</p>
                </div>
              </li>
            ))}
          </ul>

          <button type="button" data-part="more">
            {more}
          </button>
        </div>
      </section>
    </>
  )
}
