import type { CSSProperties } from "react"

export type Commerce073Seen = {
  id: string
  title: string
  spec: string
  price: string
  at: string
  gone?: string
  hue?: number
}

export type Commerce073Group = {
  id: string
  when: string
  items: Commerce073Seen[]
}

export type Commerce073Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  title?: string
  lead?: string
  groups?: Commerce073Group[]
  clearLabel?: string
  removeLabel?: string
  emptyText?: string
  privacy?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: недавно просмотренное, разложенное по дням. Плоская лента
// из тридцати карточек не помогает вернуться: нужное ищут по времени —
// «то, что смотрел вчера вечером». У каждой строки есть своё удаление, а
// у списка — кнопка очистки: история просмотров это личные данные, и
// стереть её должно быть так же легко, как накопить.
const STYLES = `
:where([data-vibeui-block="commerce-073"]){
--vibeui-commerce-073-bg:transparent;
--vibeui-commerce-073-surface:light-dark(oklch(1 0 0),oklch(0.22 0 240));
--vibeui-commerce-073-fg:light-dark(oklch(0.21 0 240),oklch(0.94 0 240));
--vibeui-commerce-073-muted:light-dark(oklch(0.53 0 240),oklch(0.73 0 240));
--vibeui-commerce-073-border:light-dark(oklch(0.9 0 240),oklch(0.38 0 240));
--vibeui-commerce-073-soft:light-dark(oklch(0.972 0 240),oklch(0.27 0 240));
--vibeui-commerce-073-accent:light-dark(oklch(0.55 0.13 39.8),oklch(0.76 0.13 39.8));
--vibeui-commerce-073-gone:light-dark(oklch(0.55 0.15 39.8),oklch(0.78 0.14 39.8));
--vibeui-commerce-073-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-073"]{color-scheme:dark}
[data-vibeui-block="commerce-073"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-073-bg);
color:var(--vibeui-commerce-073-fg);font-family:var(--vibeui-commerce-073-sans);
}
[data-vibeui-block="commerce-073"] *{box-sizing:border-box}
[data-vibeui-block="commerce-073"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:1.25rem 1rem 1.75rem}
[data-vibeui-block="commerce-073"] [data-part="top"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:baseline;justify-content:space-between;margin-bottom:1rem}
[data-vibeui-block="commerce-073"] h2{margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="commerce-073"] [data-part="lead"]{margin:0.25rem 0 0;max-width:52ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-073-muted)}
[data-vibeui-block="commerce-073"] [data-part="clear"]{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-073-border);background:var(--vibeui-commerce-073-surface);
color:inherit;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="commerce-073"] [data-part="clear"]:focus-visible,
[data-vibeui-block="commerce-073"] [data-part="drop"]:focus-visible{outline:2px solid var(--vibeui-commerce-073-accent);outline-offset:2px}
[data-vibeui-block="commerce-073"] [data-part="group"]{margin-bottom:1.25rem}
[data-vibeui-block="commerce-073"] h3{
margin:0 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-commerce-073-muted);
}
[data-vibeui-block="commerce-073"] ul{list-style:none;margin:0;padding:0;border:1px solid var(--vibeui-commerce-073-border);border-radius:0.875rem;overflow:hidden}
[data-vibeui-block="commerce-073"] [data-part="row"]{
position:relative;display:flex;gap:0.75rem;align-items:center;padding:0.625rem 0.75rem;
border-bottom:1px solid var(--vibeui-commerce-073-border);
}
[data-vibeui-block="commerce-073"] [data-part="row"]:last-child{border-bottom:0}
[data-vibeui-block="commerce-073"] [data-part="row"]:has(a:focus-visible){outline:2px solid var(--vibeui-commerce-073-accent);outline-offset:-2px}
[data-vibeui-block="commerce-073"] [data-part="thumb"]{
position:relative;flex:none;width:2.75rem;height:2.75rem;border-radius:0.5rem;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="commerce-073"] [data-part="thumb"][data-empty="true"]{background:linear-gradient(150deg,oklch(0.94 0.05 var(--vibeui-commerce-073-hue,240)),oklch(0.85 0.09 var(--vibeui-commerce-073-hue,240)));}
[data-vibeui-block="commerce-073"] [data-part="thumb"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="commerce-073"] [data-part="texts"]{flex:1;min-width:0}
[data-vibeui-block="commerce-073"] [data-part="name"]{margin:0;font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="commerce-073"] [data-part="name"] a{color:inherit;text-decoration:none;outline:none}
[data-vibeui-block="commerce-073"] [data-part="name"] a::after{content:"";position:absolute;inset:0}
[data-vibeui-block="commerce-073"] [data-part="spec"]{margin:0.0625rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-073-muted)}
[data-vibeui-block="commerce-073"] [data-part="gone"]{margin:0.1875rem 0 0;font-size:0.6875rem;font-weight:650;color:var(--vibeui-commerce-073-gone)}
[data-vibeui-block="commerce-073"] [data-part="right"]{flex:none;text-align:right}
[data-vibeui-block="commerce-073"] [data-part="price"]{margin:0;font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-073"] [data-part="at"]{margin:0.0625rem 0 0;font-size:0.6875rem;color:var(--vibeui-commerce-073-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-073"] [data-part="drop"]{
position:relative;z-index:1;flex:none;appearance:none;border:0;background:transparent;cursor:pointer;
width:1.875rem;height:1.875rem;border-radius:0.5rem;color:var(--vibeui-commerce-073-muted);
font:inherit;font-size:1rem;line-height:1;
}
[data-vibeui-block="commerce-073"] [data-part="drop"]:hover{background:var(--vibeui-commerce-073-soft);color:var(--vibeui-commerce-073-fg)}
[data-vibeui-block="commerce-073"] [data-part="sr"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="commerce-073"] [data-part="empty"]{margin:0;padding:1.5rem;text-align:center;font-size:0.8125rem;color:var(--vibeui-commerce-073-muted);border:1px dashed var(--vibeui-commerce-073-border);border-radius:0.875rem}
[data-vibeui-block="commerce-073"] [data-part="privacy"]{margin:0.75rem 0 0;max-width:56ch;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-073-muted)}
@container (min-width: 40rem){
[data-vibeui-block="commerce-073"] [data-part="shell"]{padding:2rem 2rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-073"] *{animation:none!important;transition:none!important}}
`

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

const DEFAULT_GROUPS: Commerce073Group[] = [
  {
    id: "today",
    when: "Сегодня",
    items: [
      {
        id: "1",
        title: "Кресло «Хмарь» с подлокотниками",
        spec: "Букле, песочный",
        price: "38 900 ₽",
        at: "14:12",
        hue: 75,
      },
      {
        id: "2",
        title: "Торшер «Сумерки»",
        spec: "Тёплый свет 2700 K",
        price: "16 200 ₽",
        at: "14:05",
        hue: 150,
      },
    ],
  },
  {
    id: "yesterday",
    when: "Вчера",
    items: [
      {
        id: "3",
        title: "Стол «Отмель», 140×80",
        spec: "Ясень, масло-воск",
        price: "52 400 ₽",
        at: "21:48",
        hue: 45,
      },
      {
        id: "4",
        title: "Ковёр «Туман», 200×300",
        spec: "Шерсть, ручная стрижка",
        price: "27 600 ₽",
        at: "21:31",
        gone: "Закончился — подпишитесь на возврат в продажу",
        hue: 300,
      },
    ],
  },
  {
    id: "week",
    when: "На прошлой неделе",
    items: [
      {
        id: "5",
        title: "Комод «Затон», 4 ящика",
        spec: "Берёза, доводчики",
        price: "41 700 ₽",
        at: "4 марта",
        hue: 200,
      },
    ],
  },
]

/**
 * Недавно просмотренное, сгруппированное по дням: у каждой строки время
 * и своё удаление. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce073({
  title = "Вы недавно смотрели",
  image = "",
  lead = "История хранится 30 дней и видна только вам. Убрать можно всю сразу или по одной позиции.",
  groups = DEFAULT_GROUPS,
  clearLabel = "Очистить историю",
  removeLabel = "Убрать из истории",
  emptyText = "Здесь появятся товары, которые вы открывали.",
  privacy = "История просмотров не передаётся продавцам и не влияет на цену. Она нужна двум вещам: этому списку и подборке «вам может подойти».",
  accent,
  background = "",
  className,
  style,
}: Commerce073Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-073-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-073-bg": background,
          // Кнопка очистки не должна просвечивать: ей нужна непрозрачная
          // подложка, и это тот же цвет.
          "--vibeui-commerce-073-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-073" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-073"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <div>
              <h2>{title}</h2>
              <p data-part="lead">{lead}</p>
            </div>
            <button type="button" data-part="clear">
              {clearLabel}
            </button>
          </div>

          {groups.length === 0 ? (
            <p data-part="empty">{emptyText}</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} data-part="group">
                <h3>{group.when}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li
                      key={item.id}
                      data-part="row"
                      style={
                        {
                          "--vibeui-commerce-073-hue": item.hue ?? 240,
                        } as CSSProperties
                      }
                    >
                      <span
                        data-part="thumb"
                        data-empty={image ? undefined : "true"}
                        aria-hidden="true"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </span>
                      <div data-part="texts">
                        <p data-part="name">
                          <a href="#product">{item.title}</a>
                        </p>
                        <p data-part="spec">{item.spec}</p>
                        {item.gone ? <p data-part="gone">{item.gone}</p> : null}
                      </div>
                      <div data-part="right">
                        <p data-part="price">{item.price}</p>
                        <p data-part="at">{item.at}</p>
                      </div>
                      <button type="button" data-part="drop">
                        <span aria-hidden="true">×</span>
                        <span data-part="sr">
                          {removeLabel} — {item.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}

          <p data-part="privacy">{privacy}</p>
        </div>
      </section>
    </>
  )
}
