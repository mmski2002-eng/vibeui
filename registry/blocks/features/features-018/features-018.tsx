import type { CSSProperties } from "react"

export type Features018Item = {
  icon: "comment" | "history" | "link" | "code"
  title: string
  description: string
}

export type Features018Props = {
  eyebrow?: string
  title?: string
  lede?: string
  linkLabel?: string
  linkHref?: string
  items?: Features018Item[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: светлая секция возможностей, где шапка и список стоят рядом, а
// не друг под другом. Слева — заголовок и ссылка на полный список, справа —
// четыре пункта строками на волосяных линиях, у каждого крупная контурная
// иконка. Строки вместо карточек: четыре пункта в сетке карточек читаются как
// прайс, а списком — как перечисление.
//
// Иконки нарисованы inline-путями и берут цвет из currentColor: ни библиотеки
// иконок, ни шрифта — блок остаётся одним файлом без зависимостей.
//
// Палитра задана явными значениями, без переключения веток темы: светлота здесь и есть
// содержание блока, на тёмной странице секция остаётся бумажным листом.
// Поэтому же на корне объявлен color-scheme:light — иначе браузер отрисовал бы
// фокусные кольца и выделение текста по тёмной ветке поверх светлого фона.
const STYLES = `
:where([data-vibeui-block="features-018"]){
--vibeui-features-018-bg:oklch(0.986 0.006 95);
--vibeui-features-018-fg:oklch(0.22 0.015 90);
--vibeui-features-018-muted:oklch(0.5 0.014 90);
--vibeui-features-018-line:oklch(0.9 0.01 90);
--vibeui-features-018-accent:oklch(0.52 0.12 165);
--vibeui-features-018-soft:color-mix(in oklab,var(--vibeui-features-018-accent) 12%,transparent);
--vibeui-features-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="features-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;color-scheme:light;
background:var(--vibeui-features-018-bg);color:var(--vibeui-features-018-fg);
font-family:var(--vibeui-features-018-font);
}
[data-vibeui-block="features-018"] *{box-sizing:border-box}
[data-vibeui-block="features-018"] [data-part="frame"]{
max-width:72rem;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:minmax(0,1fr);gap:2.5rem;
}
[data-vibeui-block="features-018"] [data-part="eyebrow"]{
margin:0 0 0.875rem;font-size:0.8125rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-018-accent);
}
[data-vibeui-block="features-018"] h2{
margin:0;font-size:clamp(1.75rem,4.6cqi,2.875rem);line-height:1.08;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
color:var(--vibeui-features-018-fg);
}
[data-vibeui-block="features-018"] [data-part="lede"]{
margin:1rem 0 0;max-width:30rem;font-size:clamp(1rem,1.4cqi,1.125rem);line-height:1.55;
color:var(--vibeui-features-018-muted);text-wrap:pretty;
}
[data-vibeui-block="features-018"] [data-part="link"]{
display:inline-flex;align-items:center;gap:0.4375rem;margin-top:1.5rem;
font-size:1rem;font-weight:650;color:var(--vibeui-features-018-accent);text-decoration:none;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-features-018-accent) 40%,transparent);
padding-bottom:0.125rem;
}
[data-vibeui-block="features-018"] [data-part="link"]:hover{border-bottom-color:var(--vibeui-features-018-accent)}
[data-vibeui-block="features-018"] [data-part="link"]:focus-visible{
outline:3px solid color-mix(in oklab,var(--vibeui-features-018-accent) 50%,transparent);outline-offset:3px;border-radius:0.25rem;
}
[data-vibeui-block="features-018"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid}
[data-vibeui-block="features-018"] [data-part="item"]{
display:grid;grid-template-columns:auto minmax(0,1fr);gap:1rem;
padding:1.5rem 0;border-top:1px solid var(--vibeui-features-018-line);
}
[data-vibeui-block="features-018"] [data-part="item"]:first-child{border-top:0;padding-top:0}
[data-vibeui-block="features-018"] [data-part="item"]:last-child{padding-bottom:0}
[data-vibeui-block="features-018"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;width:3rem;height:3rem;
border-radius:0.875rem;background:var(--vibeui-features-018-soft);color:var(--vibeui-features-018-accent);
}
[data-vibeui-block="features-018"] h3{
margin:0.25rem 0 0;font-size:1.1875rem;font-weight:700;letter-spacing:-0.015em;
color:var(--vibeui-features-018-fg);
}
[data-vibeui-block="features-018"] [data-part="item"] p{
margin:0.4375rem 0 0;font-size:1rem;line-height:1.55;color:var(--vibeui-features-018-muted);text-wrap:pretty;
}
@container (min-width: 48rem){
[data-vibeui-block="features-018"] [data-part="frame"]{
grid-template-columns:minmax(0,20rem) minmax(0,1fr);gap:4rem;padding:5rem 2rem;
}
[data-vibeui-block="features-018"] [data-part="item"]{gap:1.25rem;padding:1.75rem 0}
}
@container (min-width: 68rem){
[data-vibeui-block="features-018"] [data-part="frame"]{grid-template-columns:minmax(0,24rem) minmax(0,1fr);gap:5rem;padding:6rem 3rem}
[data-vibeui-block="features-018"] [data-part="icon"]{width:3.5rem;height:3.5rem;border-radius:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-018"] *{animation:none!important;transition:none!important}}
`

// Иконки набраны руками: один путь на штуку, обводка currentColor. Библиотека
// иконок утащила бы за собой зависимость и сломала обещание «один файл».
const PATHS: Record<Features018Item["icon"], string> = {
  comment: "M20 12a7 7 0 0 1-7 7H8.5L4 22v-5.1A7 7 0 0 1 8 5h5a7 7 0 0 1 7 7Z",
  history: "M4.5 12a7.5 7.5 0 1 0 2.7-5.8M4.5 3.5v3.5H8M12 8v4.4l3 1.8",
  link: "M10.2 13.8a3.8 3.8 0 0 0 5.4 0l2.6-2.6a3.8 3.8 0 0 0-5.4-5.4L11.6 7M13.8 10.2a3.8 3.8 0 0 0-5.4 0l-2.6 2.6a3.8 3.8 0 0 0 5.4 5.4L12.4 17",
  code: "m9 8.5-4.5 3.5L9 15.5M15 8.5l4.5 3.5L15 15.5M13.2 4.5 10.8 19.5",
}

const DEFAULT_ITEMS: Features018Item[] = [
  {
    icon: "comment",
    title: "Замечания прямо на макете",
    description:
      "Комментарий живёт на элементе, а не в переписке: открыл файл — сразу видно, что переделать и кто просил.",
  },
  {
    icon: "history",
    title: "История каждой правки",
    description:
      "Версия сохраняется при каждом изменении, поэтому вернуться к вчерашнему варианту — два клика, а не восстановление из бэкапа.",
  },
  {
    icon: "link",
    title: "Доступ по одной ссылке",
    description:
      "Заказчик смотрит и комментирует без регистрации, а править по-прежнему могут только участники команды.",
  },
  {
    icon: "code",
    title: "Размеры и цвета для разработчика",
    description:
      "Отступы, кегли и токены читаются прямо из макета — их не приходится переспрашивать в чате.",
  },
]

/** Светлая секция возможностей: шапка слева, четыре пункта с иконками справа. */
export function Features018({
  eyebrow = "Возможности",
  title = "Четыре вещи, ради которых команды переезжают",
  lede = "Остальное — детали. Эти четыре закрывают путь от первого наброска до передачи в разработку.",
  linkLabel = "Полный список возможностей",
  linkHref = "#",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
}: Features018Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-018" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-018"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {linkLabel ? (
              <a data-part="link" href={linkHref}>
                {linkLabel} →
              </a>
            ) : null}
          </div>

          <ul data-part="list">
            {items.slice(0, 4).map((item) => (
              <li key={item.title} data-part="item">
                <span data-part="icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                    <path
                      d={PATHS[item.icon]}
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div data-part="text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
