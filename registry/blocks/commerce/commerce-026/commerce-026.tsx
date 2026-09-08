import type { CSSProperties } from "react"

export type Commerce026Pick = {
  id: string
  title: string
  price: string
  note?: string
  hue?: number
  /** Фото товара. Без него на том же месте остаётся цветное поле. */
  image?: string
}

export type Commerce026Props = {
  title?: string
  lead?: string
  cta?: string
  secondary?: string
  picksTitle?: string
  picks?: Commerce026Pick[]
  hint?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: пустая корзина, которая продолжает разговор. Пустой экран без
// следующего шага заканчивает визит, поэтому под объяснением стоит подборка
// из недавно просмотренного — оттуда возвращаются чаще, чем из «хитов
// продаж». Картинка нарисована CSS-фигурой, а не файлом: блок обязан
// оставаться одним файлом и не тянуть ассеты в чужой проект.
const STYLES = `
:where([data-vibeui-block="commerce-026"]){
--vibeui-commerce-026-bg:transparent;
--vibeui-commerce-026-radius:0;
--vibeui-commerce-026-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-commerce-026-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-commerce-026-border:light-dark(oklch(0.91 0 265),oklch(0.35 0 265));
--vibeui-commerce-026-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-commerce-026-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-commerce-026-on-accent:oklch(0.15 0.02 39.8);
--vibeui-commerce-026-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-026"]{color-scheme:dark}
[data-vibeui-block="commerce-026"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-commerce-026-bg);
border-radius:var(--vibeui-commerce-026-radius);
font-family:var(--vibeui-commerce-026-sans);color:var(--vibeui-commerce-026-fg);
}
[data-vibeui-block="commerce-026"] *{box-sizing:border-box}
[data-vibeui-block="commerce-026"] [data-part="shell"]{padding:1.5rem 1rem;max-width:56rem;margin:0 auto}
[data-vibeui-block="commerce-026"] [data-part="hero"]{text-align:center;margin-bottom:1.5rem}
/* Картинка нарисована CSS: блок остаётся одним файлом и не тянет ассеты. */
[data-vibeui-block="commerce-026"] [data-part="bag"]{
position:relative;width:4.5rem;height:4rem;margin:0 auto 0.875rem;
border-radius:0.375rem 0.375rem 0.875rem 0.875rem;
background:var(--vibeui-commerce-026-soft);
box-shadow:inset 0 0 0 2px var(--vibeui-commerce-026-border);
}
[data-vibeui-block="commerce-026"] [data-part="bag"]::before{
content:"";position:absolute;left:50%;top:-1.125rem;transform:translateX(-50%);
width:2.25rem;height:2.25rem;border-radius:9999px;
border:2px solid var(--vibeui-commerce-026-border);
clip-path:inset(0 0 50% 0);
}
[data-vibeui-block="commerce-026"] [data-part="bag"]::after{
content:"";position:absolute;inset:auto 0 0.75rem 0;margin:0 auto;
width:1.25rem;height:2px;border-radius:9999px;background:var(--vibeui-commerce-026-border);
}
[data-vibeui-block="commerce-026"] h2{margin:0 0 0.375rem;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-026"] [data-part="lead"]{
margin:0 auto 1rem;max-width:30rem;font-size:0.875rem;line-height:1.55;color:var(--vibeui-commerce-026-muted);
}
[data-vibeui-block="commerce-026"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center}
[data-vibeui-block="commerce-026"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.5rem;padding:0 1.25rem;border-radius:0.75rem;
background:var(--vibeui-commerce-026-accent);color:var(--vibeui-commerce-026-on-accent);font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-026"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.5rem;padding:0 1.25rem;border-radius:0.75rem;
border:1px solid var(--vibeui-commerce-026-border);background:var(--vibeui-commerce-026-bg);
color:inherit;font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="commerce-026"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-026"] [data-part="alt"]:focus-visible{outline:2px solid var(--vibeui-commerce-026-accent);outline-offset:2px}
[data-vibeui-block="commerce-026"] h3{
margin:0 0 0.625rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-commerce-026-muted);
}
[data-vibeui-block="commerce-026"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem;grid-template-columns:repeat(2,minmax(0,1fr))}
@container (min-width: 40rem){
[data-vibeui-block="commerce-026"] ul{grid-template-columns:repeat(4,minmax(0,1fr))}
}
[data-vibeui-block="commerce-026"] [data-part="pick"]{
position:relative;border:1px solid var(--vibeui-commerce-026-border);border-radius:0.875rem;overflow:hidden;
display:flex;flex-direction:column;
}
[data-vibeui-block="commerce-026"] [data-part="pick"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-026-accent);outline-offset:2px}
[data-vibeui-block="commerce-026"] [data-part="cover"]{
aspect-ratio:1;
overflow:hidden;
}
/* Подложка — только когда фото нет: блок обязан быть полноценным
   без единого внешнего файла. */
[data-vibeui-block="commerce-026"] [data-part="cover"][data-empty="true"]{background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-026-hue,262)),oklch(0.86 0.09 var(--vibeui-commerce-026-hue,262)));}
[data-vibeui-block="commerce-026"] [data-part="cover"] img{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="commerce-026"] [data-part="body"]{padding:0.5rem 0.625rem 0.625rem}
[data-vibeui-block="commerce-026"] [data-part="name"]{margin:0;font-size:0.75rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-026"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-026"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-026"] [data-part="note"]{margin:0.125rem 0 0;font-size:0.625rem;color:var(--vibeui-commerce-026-muted)}
[data-vibeui-block="commerce-026"] [data-part="cost"]{margin:0.25rem 0 0;font-size:0.8125rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-026"] [data-part="hint"]{
margin:1rem 0 0;padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-commerce-026-soft);font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-026-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-026"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PICKS: Commerce026Pick[] = [
  {
    id: "1",
    title: "Кресло «Хмарь»",
    price: "38 900 ₽",
    note: "смотрели вчера",
    hue: 75,
  },
  {
    id: "2",
    title: "Торшер «Сумерки»",
    price: "16 200 ₽",
    note: "смотрели вчера",
    hue: 150,
  },
  {
    id: "3",
    title: "Плед «Пасмурно»",
    price: "7 400 ₽",
    note: "к креслу",
    hue: 262,
  },
  {
    id: "4",
    title: "Ковёр «Туман»",
    price: "27 600 ₽",
    note: "подешевел",
    hue: 20,
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
 * Пустая корзина с подборкой из недавно просмотренного: экран не заканчивает визит.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce026({
  title = "В корзине пусто",
  lead = "Товары, которые вы добавите, останутся здесь на 30 дней — даже если закроете вкладку.",
  cta = "Перейти в каталог",
  secondary = "Открыть избранное",
  picksTitle = "Вы недавно смотрели",
  picks = DEFAULT_PICKS,
  hint = "Промокод VESNA10 действует до конца недели: скидка 10% на первый заказ от 5 000 ₽.",
  accent,
  background = "",
  className,
  style,
}: Commerce026Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-026-bg": background,
          "--vibeui-commerce-026-radius": "1rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-026" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-026"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="hero">
            <span data-part="bag" aria-hidden="true" />
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <div data-part="actions">
              <button type="button" data-part="go">
                {cta}
              </button>
              <button type="button" data-part="alt">
                {secondary}
              </button>
            </div>
          </div>

          <h3>{picksTitle}</h3>
          <ul>
            {picks.map((pick) => (
              <li
                key={pick.id}
                data-part="pick"
                style={
                  {
                    "--vibeui-commerce-026-hue": pick.hue ?? 262,
                  } as CSSProperties
                }
              >
                <span
                  data-part="cover"
                  data-empty={pick.image ? undefined : "true"}
                  aria-hidden={pick.image ? undefined : true}
                >
                  {pick.image ? (
                    <img
                      src={pick.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </span>
                <div data-part="body">
                  <p data-part="name">
                    <a href="#product">{pick.title}</a>
                  </p>
                  {pick.note ? <p data-part="note">{pick.note}</p> : null}
                  <p data-part="cost">{pick.price}</p>
                </div>
              </li>
            ))}
          </ul>

          <p data-part="hint">{hint}</p>
        </div>
      </section>
    </>
  )
}
