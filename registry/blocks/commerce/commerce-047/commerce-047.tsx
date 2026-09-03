import type { CSSProperties } from "react"

export type Commerce047Edit = {
  id: string
  title: string
  note: string
  count: string
  hue?: number
  wide?: boolean
}

export type Commerce047Reason = {
  id: string
  title: string
  text: string
}

export type Commerce047Props = {
  season?: string
  title?: string
  lead?: string
  cta?: string
  secondary?: string
  until?: string
  editsTitle?: string
  edits?: Commerce047Edit[]
  reasons?: Commerce047Reason[]
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: главная магазина, построенная вокруг сезона. Сезон — это срок,
// поэтому дата его окончания стоит рядом с заголовком: без неё «весенняя
// подборка» висит на витрине круглый год. Подборки различаются размером
// плитки по флагу в данных, а не ручной раскладкой, чтобы редактор менял
// главный экран данными.
const STYLES = `
:where([data-vibeui-block="commerce-047"]){
--vibeui-commerce-047-bg:transparent;
--vibeui-commerce-047-card:light-dark(oklch(1 0 0),oklch(0.25 0.012 70));
--vibeui-commerce-047-fg:light-dark(oklch(0.22 0.02 60),oklch(0.93 0.008 70));
--vibeui-commerce-047-muted:light-dark(oklch(0.54 0.02 60),oklch(0.72 0.014 70));
--vibeui-commerce-047-border:light-dark(oklch(0.9 0.01 70),oklch(0.36 0.014 70));
--vibeui-commerce-047-soft:light-dark(oklch(0.97 0.012 80),oklch(0.29 0.016 70));
--vibeui-commerce-047-accent:light-dark(oklch(0.52 0.14 35),oklch(0.74 0.14 40));
--vibeui-commerce-047-onaccent:light-dark(oklch(0.99 0 0),oklch(0.18 0.03 40));
--vibeui-commerce-047-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-047"]{color-scheme:dark}
[data-vibeui-block="commerce-047"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-047-bg);
color:var(--vibeui-commerce-047-fg);font-family:var(--vibeui-commerce-047-sans);
}
[data-vibeui-block="commerce-047"] *{box-sizing:border-box}
[data-vibeui-block="commerce-047"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:1.5rem 1rem 2rem}
[data-vibeui-block="commerce-047"] [data-part="hero"]{
border:1px solid var(--vibeui-commerce-047-border);border-radius:1.25rem;
background:linear-gradient(135deg,var(--vibeui-commerce-047-soft),var(--vibeui-commerce-047-card) 62%);
padding:1.5rem 1.25rem;margin-bottom:1.25rem;
}
[data-vibeui-block="commerce-047"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.375rem;height:1.625rem;padding:0 0.625rem;
border-radius:9999px;background:var(--vibeui-commerce-047-accent);color:var(--vibeui-commerce-047-onaccent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="commerce-047"] h2{margin:0.75rem 0 0.5rem;font-size:clamp(1.5rem,5cqi,2.5rem);line-height:1.08;letter-spacing:-0.025em;max-width:22ch}
[data-vibeui-block="commerce-047"] [data-part="lead"]{margin:0;max-width:46ch;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-commerce-047-muted)}
[data-vibeui-block="commerce-047"] [data-part="row"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;margin-top:1.125rem}
[data-vibeui-block="commerce-047"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.75rem;padding:0 1.375rem;border-radius:0.875rem;
background:var(--vibeui-commerce-047-accent);color:var(--vibeui-commerce-047-onaccent);font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-047"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.75rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-047-border);background:var(--vibeui-commerce-047-card);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-047"] [data-part="until"]{margin:0.875rem 0 0;font-size:0.8125rem;color:var(--vibeui-commerce-047-muted)}
[data-vibeui-block="commerce-047"] h3{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-commerce-047-muted);
}
[data-vibeui-block="commerce-047"] [data-part="edits"]{list-style:none;margin:0 0 1.25rem;padding:0;display:grid;gap:0.75rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-047"] [data-part="edit"]{
position:relative;border:1px solid var(--vibeui-commerce-047-border);border-radius:1rem;overflow:hidden;
background:var(--vibeui-commerce-047-card);display:flex;flex-direction:column;min-height:11rem;
}
[data-vibeui-block="commerce-047"] [data-part="edit"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-047-accent);outline-offset:2px}
[data-vibeui-block="commerce-047"] [data-part="cover"]{
flex:1;min-height:6rem;
background:linear-gradient(150deg,oklch(0.93 0.06 var(--vibeui-commerce-047-hue,35)),oklch(0.82 0.11 var(--vibeui-commerce-047-hue,35)));
}
[data-vibeui-block="commerce-047"] [data-part="body"]{padding:0.75rem 0.875rem 0.875rem}
[data-vibeui-block="commerce-047"] [data-part="name"]{margin:0;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="commerce-047"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-047"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-047"] [data-part="note"]{margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-047-muted)}
[data-vibeui-block="commerce-047"] [data-part="count"]{
margin:0.5rem 0 0;font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;color:var(--vibeui-commerce-047-accent);
}
[data-vibeui-block="commerce-047"] [data-part="reasons"]{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-047"] [data-part="reason"]{
border:1px solid var(--vibeui-commerce-047-border);border-radius:0.875rem;padding:0.75rem 0.875rem;
background:var(--vibeui-commerce-047-card);
}
[data-vibeui-block="commerce-047"] [data-part="reason"] strong{display:block;font-size:0.875rem;font-weight:700}
[data-vibeui-block="commerce-047"] [data-part="reason"] span{display:block;margin-top:0.1875rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-commerce-047-muted)}
@container (min-width: 34rem){
[data-vibeui-block="commerce-047"] [data-part="edits"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="commerce-047"] [data-part="reasons"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 56rem){
[data-vibeui-block="commerce-047"] [data-part="shell"]{padding:2.5rem 2rem 3rem}
[data-vibeui-block="commerce-047"] [data-part="hero"]{padding:2.5rem 2.25rem}
[data-vibeui-block="commerce-047"] [data-part="edits"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="commerce-047"] [data-part="edit"][data-wide]{grid-column:span 2}
[data-vibeui-block="commerce-047"] [data-part="reasons"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-047"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EDITS: Commerce047Edit[] = [
  {
    id: "1",
    title: "Тёплый свет",
    note: "Торшеры и настольные лампы с тёплой температурой — для коротких вечеров.",
    count: "42 товара",
    hue: 65,
    wide: true,
  },
  {
    id: "2",
    title: "Пледы и текстиль",
    note: "Шерсть, лён и хлопок плотностью от 400 г/м².",
    count: "28 товаров",
    hue: 20,
  },
  {
    id: "3",
    title: "Керамика ручной работы",
    note: "Небольшие тиражи мастерских, каждая вещь в единственном исполнении.",
    count: "16 товаров",
    hue: 150,
  },
  {
    id: "4",
    title: "Уценка прошлого сезона",
    note: "Витринные образцы и остатки коллекций со скидкой до 40%.",
    count: "63 товара",
    hue: 262,
  },
]

const DEFAULT_REASONS: Commerce047Reason[] = [
  {
    id: "1",
    title: "Доставка за день",
    text: "По городу — курьером на следующий день после заказа.",
  },
  {
    id: "2",
    title: "Возврат 30 дней",
    text: "Без объяснения причины, если вещь не была в использовании.",
  },
  {
    id: "3",
    title: "Примерка дома",
    text: "Текстиль и посуду можно осмотреть до оплаты курьеру.",
  },
  {
    id: "4",
    title: "Склад в городе",
    text: "Наличие на карточке товара обновляется каждые 15 минут.",
  },
]

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
 * Главная магазина с сезонными подборками: сезон объявлен сроком, а размер
 * плитки задаётся данными. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce047({
  season = "Осенний сезон",
  title = "Собрали то, что делает вечер длиннее",
  lead = "Четыре подборки о свете, тепле и посуде. Внутри каждой — товары, которые есть на складе прямо сейчас, без предзаказов.",
  cta = "Смотреть весь сезон",
  secondary = "Что нового за неделю",
  until = "Подборки собраны 3 сентября и действуют до 30 ноября.",
  editsTitle = "Подборки сезона",
  edits = DEFAULT_EDITS,
  reasons = DEFAULT_REASONS,
  accent,
  background = "",
  className,
  style,
}: Commerce047Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-047-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-047-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-047" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-047"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="hero">
            <span data-part="badge">{season}</span>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <div data-part="row">
              <button type="button" data-part="go">
                {cta}
              </button>
              <button type="button" data-part="alt">
                {secondary}
              </button>
            </div>
            <p data-part="until">{until}</p>
          </div>

          <h3>{editsTitle}</h3>
          <ul data-part="edits">
            {edits.map((edit) => (
              <li
                key={edit.id}
                data-part="edit"
                data-wide={edit.wide ? "true" : undefined}
                style={
                  {
                    "--vibeui-commerce-047-hue": edit.hue ?? 35,
                  } as CSSProperties
                }
              >
                <span data-part="cover" aria-hidden="true" />
                <div data-part="body">
                  <p data-part="name">
                    <a href="#edit">{edit.title}</a>
                  </p>
                  <p data-part="note">{edit.note}</p>
                  <p data-part="count">{edit.count}</p>
                </div>
              </li>
            ))}
          </ul>

          <ul data-part="reasons">
            {reasons.map((reason) => (
              <li key={reason.id} data-part="reason">
                <strong>{reason.title}</strong>
                <span>{reason.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
