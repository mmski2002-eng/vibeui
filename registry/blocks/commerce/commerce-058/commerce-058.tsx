import type { CSSProperties } from "react"

export type Commerce058Lesson = {
  id: string
  title: string
  length: string
  free?: boolean
}

export type Commerce058Module = {
  id: string
  title: string
  summary: string
  lessons: Commerce058Lesson[]
}

export type Commerce058Props = {
  kicker?: string
  title?: string
  lead?: string
  author?: string
  authorRole?: string
  level?: string
  total?: string
  price?: string
  oldPrice?: string
  cta?: string
  freeLabel?: string
  syllabusTitle?: string
  modules?: Commerce058Module[]
  openFirst?: boolean
  guarantee?: string
  accessLabel?: string
  /** Число уроков в модуле: {count} подставляется числом. */
  lessonsCountTemplate?: string
  /** Старая цена: {price} подставляется зачёркнутой суммой. */
  oldPriceTemplate?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница курса, где программа — главный аргумент, а не текст
// внизу. Модули лежат в нативных details: целиком программа занимает экран,
// а свёрнутая читается за десять секунд. У каждого урока стоит хронометраж,
// потому что «12 уроков» ничего не говорит о времени, и помечены бесплатные —
// именно с них начинают знакомство с курсом.
const STYLES = `
:where([data-vibeui-block="commerce-058"]){
--vibeui-commerce-058-bg:transparent;
--vibeui-commerce-058-fg:light-dark(oklch(0.2 0.014 260),oklch(0.94 0.006 260));
--vibeui-commerce-058-muted:light-dark(oklch(0.53 0.016 260),oklch(0.73 0.013 260));
--vibeui-commerce-058-border:light-dark(oklch(0.9 0.008 260),oklch(0.38 0.014 260));
--vibeui-commerce-058-soft:light-dark(oklch(0.973 0.006 260),oklch(0.27 0.012 260));
--vibeui-commerce-058-accent:light-dark(oklch(0.5 0.16 265),oklch(0.74 0.14 265));
--vibeui-commerce-058-onaccent:light-dark(oklch(0.99 0 0),oklch(0.19 0.04 265));
--vibeui-commerce-058-free:light-dark(oklch(0.47 0.12 150),oklch(0.72 0.13 152));
--vibeui-commerce-058-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-058"]{color-scheme:dark}
[data-vibeui-block="commerce-058"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-058-bg);
color:var(--vibeui-commerce-058-fg);font-family:var(--vibeui-commerce-058-sans);
}
[data-vibeui-block="commerce-058"] *{box-sizing:border-box}
[data-vibeui-block="commerce-058"] [data-part="shell"]{max-width:62rem;margin:0 auto;padding:1.25rem 1rem 2rem;display:grid;gap:1.25rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-058"] [data-part="kicker"]{margin:0;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-commerce-058-accent)}
[data-vibeui-block="commerce-058"] h2{margin:0.375rem 0 0.5rem;font-size:clamp(1.375rem,4.5cqi,2.125rem);line-height:1.1;letter-spacing:-0.025em}
[data-vibeui-block="commerce-058"] [data-part="lead"]{margin:0 0 1rem;max-width:52ch;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-commerce-058-muted)}
[data-vibeui-block="commerce-058"] [data-part="chips"]{list-style:none;display:flex;flex-wrap:wrap;gap:0.375rem;margin:0 0 1.5rem;padding:0}
[data-vibeui-block="commerce-058"] [data-part="chip"]{
display:inline-flex;align-items:center;height:1.75rem;padding:0 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-058-border);background:var(--vibeui-commerce-058-soft);
font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="commerce-058"] h3{margin:0 0 0.75rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-058-muted)}
[data-vibeui-block="commerce-058"] [data-part="modules"]{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="commerce-058"] details{border:1px solid var(--vibeui-commerce-058-border);border-radius:0.875rem;background:var(--vibeui-commerce-058-bg)}
[data-vibeui-block="commerce-058"] details[open]{background:var(--vibeui-commerce-058-soft)}
[data-vibeui-block="commerce-058"] summary{
cursor:pointer;list-style:none;padding:0.75rem 0.875rem;border-radius:0.875rem;
display:flex;gap:0.75rem;align-items:baseline;
}
[data-vibeui-block="commerce-058"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="commerce-058"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-058-accent);outline-offset:2px}
[data-vibeui-block="commerce-058"] [data-part="num"]{
flex:none;width:1.5rem;height:1.5rem;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;
background:var(--vibeui-commerce-058-accent);color:var(--vibeui-commerce-058-onaccent);font-size:0.6875rem;font-weight:750;
font-variant-numeric:tabular-nums;align-self:center;
}
[data-vibeui-block="commerce-058"] [data-part="mtitle"]{flex:1;min-width:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="commerce-058"] [data-part="msummary"]{display:block;margin-top:0.125rem;font-size:0.75rem;font-weight:400;line-height:1.45;color:var(--vibeui-commerce-058-muted)}
[data-vibeui-block="commerce-058"] [data-part="mcount"]{flex:none;font-size:0.75rem;color:var(--vibeui-commerce-058-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-058"] ol{list-style:none;margin:0;padding:0 0.875rem 0.75rem;display:grid;gap:0.25rem}
[data-vibeui-block="commerce-058"] [data-part="lesson"]{
display:flex;gap:0.625rem;align-items:baseline;padding:0.375rem 0;font-size:0.8125rem;
border-top:1px solid var(--vibeui-commerce-058-border);
}
[data-vibeui-block="commerce-058"] [data-part="ltitle"]{flex:1;min-width:0}
[data-vibeui-block="commerce-058"] [data-part="llength"]{flex:none;font-variant-numeric:tabular-nums;color:var(--vibeui-commerce-058-muted)}
[data-vibeui-block="commerce-058"] [data-part="free"]{
flex:none;display:inline-flex;align-items:center;height:1.25rem;padding:0 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-commerce-058-free);color:var(--vibeui-commerce-058-onaccent);font-size:0.625rem;font-weight:700;
letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="commerce-058"] [data-part="panel"]{
border:1px solid var(--vibeui-commerce-058-border);border-radius:1rem;padding:1.125rem;align-self:start;
background:var(--vibeui-commerce-058-soft);
}
[data-vibeui-block="commerce-058"] [data-part="price"]{margin:0;font-size:1.875rem;font-weight:750;font-variant-numeric:tabular-nums;line-height:1}
[data-vibeui-block="commerce-058"] [data-part="old"]{margin:0.375rem 0 0;font-size:0.875rem;color:var(--vibeui-commerce-058-muted)}
[data-vibeui-block="commerce-058"] [data-part="old"] s{text-decoration-thickness:1px}
[data-vibeui-block="commerce-058"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.875rem;margin-top:0.875rem;border-radius:0.875rem;
background:var(--vibeui-commerce-058-accent);color:var(--vibeui-commerce-058-onaccent);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-058"] [data-part="go"]:focus-visible{outline:2px solid var(--vibeui-commerce-058-accent);outline-offset:2px}
[data-vibeui-block="commerce-058"] [data-part="author"]{display:flex;gap:0.75rem;align-items:center;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--vibeui-commerce-058-border)}
[data-vibeui-block="commerce-058"] [data-part="avatar"]{
flex:none;width:2.5rem;height:2.5rem;border-radius:9999px;
background:linear-gradient(140deg,oklch(0.9 0.06 265),oklch(0.76 0.12 285));
}
[data-vibeui-block="commerce-058"] [data-part="aname"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-058"] [data-part="arole"]{margin:0.0625rem 0 0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-commerce-058-muted)}
[data-vibeui-block="commerce-058"] [data-part="guarantee"]{margin:0.875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-058-muted)}
@container (min-width: 48rem){
[data-vibeui-block="commerce-058"] [data-part="shell"]{padding:2rem 2rem 3rem;grid-template-columns:minmax(0,1fr) 18rem;gap:1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-058"] *{animation:none!important;transition:none!important}}
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

const DEFAULT_MODULES: Commerce058Module[] = [
  {
    id: "1",
    title: "Основа: что делает ткань тканью",
    summary: "Разбираем переплетения и плотность на образцах из набора.",
    lessons: [
      {
        id: "1",
        title: "Как читать состав на этикетке",
        length: "12 мин",
        free: true,
      },
      { id: "2", title: "Полотняное, саржевое, сатиновое", length: "24 мин" },
      { id: "3", title: "Плотность: цифры и что они значат", length: "18 мин" },
    ],
  },
  {
    id: "2",
    title: "Раскрой без брака",
    summary: "От разметки до припусков: где теряется ткань и почему.",
    lessons: [
      { id: "1", title: "Долевая нить и как её найти", length: "16 мин" },
      { id: "2", title: "Раскладка лекал на отрезе", length: "31 мин" },
      { id: "3", title: "Припуски под разные швы", length: "22 мин" },
      { id: "4", title: "Разбор ошибок: три чужих раскроя", length: "27 мин" },
    ],
  },
  {
    id: "3",
    title: "Швы, которые держат",
    summary: "Настройка машины под материал и пять базовых швов.",
    lessons: [
      {
        id: "1",
        title: "Натяжение нити на глаз и на образце",
        length: "19 мин",
      },
      { id: "2", title: "Французский и запошивочный шов", length: "34 мин" },
      { id: "3", title: "Обработка среза без оверлока", length: "21 мин" },
    ],
  },
  {
    id: "4",
    title: "Первое изделие целиком",
    summary: "Собираем фартук от выкройки до отпаривания за два вечера.",
    lessons: [
      { id: "1", title: "Выкройка под свои мерки", length: "26 мин" },
      { id: "2", title: "Сборка и примерка", length: "42 мин" },
      { id: "3", title: "Финиш: отпаривание и уход", length: "14 мин" },
    ],
  },
]

/**
 * Страница курса с программой в details: у каждого урока стоит хронометраж,
 * бесплатные помечены. Один файл, ноль зависимостей, палитра своя.
 */
export function Commerce058({
  kicker = "Онлайн-курс",
  title = "Шитьё с нуля: от отреза до готовой вещи",
  lead = "Четыре модуля, тринадцать уроков и один фартук, который вы сошьёте сами. Записи открыты навсегда, домашние работы проверяет автор.",
  author = "Мария Гущина",
  authorRole = "Конструктор одежды, 14 лет в ателье",
  level = "Для начинающих",
  total = "13 уроков · 5 ч 26 мин",
  price = "12 400 ₽",
  oldPrice = "18 900 ₽",
  cta = "Записаться на курс",
  freeLabel = "Бесплатно",
  syllabusTitle = "Программа курса",
  modules = DEFAULT_MODULES,
  openFirst = true,
  guarantee = "Первые семь дней возвращаем деньги без вопросов — даже если вы прошли половину курса.",
  accessLabel = "Доступ навсегда",
  lessonsCountTemplate = "{count} уроков",
  oldPriceTemplate = "вместо {price}",
  accent,
  background = "",
  className,
  style,
}: Commerce058Props) {
  const [beforeOldPrice, afterOldPrice] = oldPriceTemplate.split("{price}")

  const palette = {
    ...(accent ? { "--vibeui-commerce-058-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-058-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-058" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-058"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <p data-part="kicker">{kicker}</p>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
            <ul data-part="chips">
              <li data-part="chip">{level}</li>
              <li data-part="chip">{total}</li>
              <li data-part="chip">{accessLabel}</li>
            </ul>

            <h3>{syllabusTitle}</h3>
            <ul data-part="modules">
              {modules.map((module, index) => (
                <li key={module.id}>
                  <details open={openFirst && index === 0}>
                    <summary>
                      <span data-part="num">{index + 1}</span>
                      <span data-part="mtitle">
                        {module.title}
                        <span data-part="msummary">{module.summary}</span>
                      </span>
                      <span data-part="mcount">
                        {lessonsCountTemplate.replace(
                          "{count}",
                          String(module.lessons.length),
                        )}
                      </span>
                    </summary>
                    <ol>
                      {module.lessons.map((lesson) => (
                        <li key={lesson.id} data-part="lesson">
                          <span data-part="ltitle">{lesson.title}</span>
                          {lesson.free ? (
                            <span data-part="free">{freeLabel}</span>
                          ) : null}
                          <span data-part="llength">{lesson.length}</span>
                        </li>
                      ))}
                    </ol>
                  </details>
                </li>
              ))}
            </ul>
          </div>

          <aside data-part="panel">
            <p data-part="price">{price}</p>
            <p data-part="old">
              {beforeOldPrice}
              <s>{oldPrice}</s>
              {afterOldPrice}
            </p>
            <button type="button" data-part="go">
              {cta}
            </button>
            <div data-part="author">
              <span data-part="avatar" aria-hidden="true" />
              <div>
                <p data-part="aname">{author}</p>
                <p data-part="arole">{authorRole}</p>
              </div>
            </div>
            <p data-part="guarantee">{guarantee}</p>
          </aside>
        </div>
      </section>
    </>
  )
}
