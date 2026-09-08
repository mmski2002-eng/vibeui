import type { CSSProperties } from "react"

export type Features008Tab = {
  id: string
  label: string
  title: string
  description: string
  points: string[]
  metric: { value: string; label: string }
}

export type Features008Props = {
  eyebrow?: string
  title?: string
  tabs?: Features008Tab[]
  /** Название группы вкладок для скринридера: компонент несёт русское. */
  tablistLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: вкладки без единой строки JavaScript. Переключение держится на
// группе радиокнопок: они лежат перед списком вкладок, а активная панель
// выбирается селектором :checked ~ по позиции. Радиокнопки — не декорация:
// от них достаются стрелки клавиатуры, фокус и роль radiogroup, которые в
// самодельных вкладках на div'ах обычно теряются. Сами инпуты уводятся с
// экрана, но остаются в потоке фокуса, а кольцо рисуется на подписи.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Тёмная ветка — не
// инверсия светлой: панель и полоса вкладок там светлее фона, рамки светлее
// панели, а подпись активной вкладки на светлом акценте становится тёмной.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="features-008"]){
--vibeui-features-008-bg:transparent;
--vibeui-features-008-fg:light-dark(oklch(0.2 0 240),oklch(0.95 0 240));
--vibeui-features-008-muted:light-dark(oklch(0.51 0 240),oklch(0.72 0 240));
--vibeui-features-008-card:light-dark(oklch(1 0 0),oklch(0.24 0 240));
--vibeui-features-008-line:light-dark(oklch(0.89 0 240),oklch(0.35 0 240));
--vibeui-features-008-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.74 0.14 39.8));
--vibeui-features-008-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-features-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-008"]{color-scheme:dark}
[data-vibeui-block="features-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-008-bg);color:var(--vibeui-features-008-fg);
font-family:var(--vibeui-features-008-sans);
}
[data-vibeui-block="features-008"] *{box-sizing:border-box}
[data-vibeui-block="features-008"] [data-part="shell"]{max-width:64rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-008"] [data-part="tabs"]{display:contents}
[data-vibeui-block="features-008"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-008-accent);
}
[data-vibeui-block="features-008"] h2{
margin:0 0 1.75rem;max-width:24ch;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-008"] input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
[data-vibeui-block="features-008"] [data-part="tablist"]{
display:flex;flex-wrap:wrap;gap:0.375rem;padding:0.3125rem;border-radius:0.875rem;
border:1px solid var(--vibeui-features-008-line);background:var(--vibeui-features-008-card);
}
[data-vibeui-block="features-008"] [data-part="tab"]{
flex:1 1 8rem;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;
height:2.375rem;padding:0 0.875rem;border-radius:0.625rem;
font-size:0.875rem;font-weight:600;color:var(--vibeui-features-008-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="features-008"] [data-part="tab"]:hover{color:var(--vibeui-features-008-fg)}
[data-vibeui-block="features-008"] [data-part="panels"]{
margin-top:1rem;border:1px solid var(--vibeui-features-008-line);border-radius:1rem;
background:var(--vibeui-features-008-card);padding:1.5rem;
}
[data-vibeui-block="features-008"] [data-part="panel"]{display:none}
[data-vibeui-block="features-008"] [data-part="panel"] h3{margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="features-008"] [data-part="panel"] p{
margin:0.625rem 0 0;max-width:38rem;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-features-008-muted);text-wrap:pretty;
}
[data-vibeui-block="features-008"] ul{list-style:none;margin:1.25rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="features-008"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5}
[data-vibeui-block="features-008"] [data-part="tick"]{flex:0 0 auto;margin-top:0.25rem;color:var(--vibeui-features-008-accent)}
[data-vibeui-block="features-008"] [data-part="metric"]{
margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-features-008-line);
}
[data-vibeui-block="features-008"] [data-part="value"]{
display:block;font-size:2rem;line-height:1;font-weight:700;letter-spacing:-0.03em;
color:var(--vibeui-features-008-accent);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="features-008"] [data-part="metriclabel"]{display:block;margin-top:0.375rem;font-size:0.8125rem;color:var(--vibeui-features-008-muted)}
[data-vibeui-block="features-008"] [data-part="t1"]:checked ~ [data-part="tablist"] [data-part="tab"]:nth-child(1),
[data-vibeui-block="features-008"] [data-part="t2"]:checked ~ [data-part="tablist"] [data-part="tab"]:nth-child(2),
[data-vibeui-block="features-008"] [data-part="t3"]:checked ~ [data-part="tablist"] [data-part="tab"]:nth-child(3),
[data-vibeui-block="features-008"] [data-part="t4"]:checked ~ [data-part="tablist"] [data-part="tab"]:nth-child(4){
background:var(--vibeui-features-008-accent);color:var(--vibeui-features-008-accent-fg);
}
[data-vibeui-block="features-008"] [data-part="t1"]:focus-visible ~ [data-part="tablist"] [data-part="tab"]:nth-child(1),
[data-vibeui-block="features-008"] [data-part="t2"]:focus-visible ~ [data-part="tablist"] [data-part="tab"]:nth-child(2),
[data-vibeui-block="features-008"] [data-part="t3"]:focus-visible ~ [data-part="tablist"] [data-part="tab"]:nth-child(3),
[data-vibeui-block="features-008"] [data-part="t4"]:focus-visible ~ [data-part="tablist"] [data-part="tab"]:nth-child(4){
outline:2px solid var(--vibeui-features-008-accent);outline-offset:2px;
}
[data-vibeui-block="features-008"] [data-part="t1"]:checked ~ [data-part="panels"] [data-part="panel"]:nth-child(1),
[data-vibeui-block="features-008"] [data-part="t2"]:checked ~ [data-part="panels"] [data-part="panel"]:nth-child(2),
[data-vibeui-block="features-008"] [data-part="t3"]:checked ~ [data-part="panels"] [data-part="panel"]:nth-child(3),
[data-vibeui-block="features-008"] [data-part="t4"]:checked ~ [data-part="panels"] [data-part="panel"]:nth-child(4){
display:block;
}
@container (min-width: 34rem){
[data-vibeui-block="features-008"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="features-008"] [data-part="panels"]{padding:2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="features-008"] [data-part="panelgrid"]{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:2.5rem;align-items:center}
[data-vibeui-block="features-008"] [data-part="metric"]{margin-top:0;padding-top:0;border-top:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TABS: Features008Tab[] = [
  {
    id: "catalog",
    label: "Каталог",
    title: "Секции, которые видно до установки",
    description:
      "Превью рендерит настоящий файл секции, а не картинку: если в каталоге видно анимацию, она приедет вместе с кодом.",
    points: [
      "Светлая и тёмная подложка одним переключателем",
      "Три ширины: телефон, планшет, десктоп",
      "Фильтр по категории, группе и тегам",
    ],
    metric: { value: "1 080", label: "секций в каталоге" },
  },
  {
    id: "install",
    label: "Установка",
    title: "Одна команда вместо копипаста",
    description:
      "Реестр совместим с shadcn: агент получает JSON с файлами и целевыми путями и кладёт секцию туда, где вы её ждёте.",
    points: [
      "Файл приезжает байт в байт",
      "Зависимости объявлены в metadata",
      "Целевой путь настраивается в components.json",
    ],
    metric: { value: "6 мин", label: "от выбора до страницы" },
  },
  {
    id: "agent",
    label: "Агент",
    title: "Инструкция вместо угадывания",
    description:
      "Copy for AI собирает промпт из metadata: что сохранить, что можно менять и чего делать нельзя ни при каких условиях.",
    points: [
      "Список «не ломать» с объяснением причин",
      "Список «можно менять» с именами пропсов",
      "Запрет на generic-пересоздание секции",
    ],
    metric: { value: "97 %", label: "установок без правок вёрстки" },
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

/** Вкладки по возможностям без JavaScript: переключение на радиокнопках и :checked. */
export function Features008({
  eyebrow = "Возможности",
  title = "Три стороны продукта, между которыми можно переключаться",
  tabs = DEFAULT_TABS,
  tablistLabel = "Возможности",
  background = "",
  accent,
  className,
  style,
}: Features008Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const visible = tabs.slice(0, 4)

  return (
    <>
      <style href="vibeui-features-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-008"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <form data-part="tabs">
            {visible.map((tab, index) => (
              <input
                key={tab.id}
                data-part={`t${index + 1}`}
                id={`vibeui-features-008-${tab.id}`}
                type="radio"
                name="vibeui-features-008"
                defaultChecked={index === 0}
              />
            ))}

            <div data-part="tablist" role="group" aria-label={tablistLabel}>
              {visible.map((tab) => (
                <label
                  key={tab.id}
                  data-part="tab"
                  htmlFor={`vibeui-features-008-${tab.id}`}
                >
                  {tab.label}
                </label>
              ))}
            </div>

            <div data-part="panels">
              {visible.map((tab) => (
                <article key={tab.id} data-part="panel">
                  <div data-part="panelgrid">
                    <div>
                      <h3>{tab.title}</h3>
                      <p>{tab.description}</p>
                      <ul>
                        {tab.points.slice(0, 4).map((point) => (
                          <li key={point}>
                            <span data-part="tick" aria-hidden="true">
                              <svg viewBox="0 0 16 16" width="12" height="12">
                                <path
                                  d="M3.5 8.5 6.5 11.5 12.5 4.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p data-part="metric">
                      <span data-part="value">{tab.metric.value}</span>
                      <span data-part="metriclabel">{tab.metric.label}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
