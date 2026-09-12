import type { CSSProperties } from "react"

type About004Stat = {
  value: string
  label: string
}

export type About004Props = {
  /** Фото команды или офиса. Без него секция остаётся текстовой. */
  image?: string
  eyebrow?: string
  title?: string
  paragraphs?: string[]
  stats?: About004Stat[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Рассказ о компании с доказательствами: текст слева, столбик крупных метрик
// справа. Цифры оранжевые и табличные — колонка читается как сводка, а не как
// декор. Метрики свёрстаны списком определений <dl>: пара «значение — что это»
// остаётся парой и для скринридера.
const STYLES = `
:where([data-vibeui-block="about-004"]){
--vibeui-about-004-bg:transparent;
--vibeui-about-004-ink:light-dark(oklch(0.17 0 0),oklch(0.97 0 0));
--vibeui-about-004-muted:light-dark(oklch(0.45 0 0),oklch(0.72 0 0));
--vibeui-about-004-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-about-004-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-about-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-004"]{color-scheme:dark}
[data-vibeui-block="about-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-about-004-bg);color:var(--vibeui-about-004-ink);
font-family:var(--vibeui-about-004-font);
}
[data-vibeui-block="about-004"] [data-part="figure"]{
position:relative;overflow:hidden;aspect-ratio:16 / 9;
margin-top:1.5rem;border-radius:0.875rem;
}
[data-vibeui-block="about-004"] [data-part="figure"] img{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="about-004"] [data-part="shell"]{
max-width:72rem;margin:0 auto;padding:3.5rem 1.25rem;
}
[data-vibeui-block="about-004"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-about-004-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="about-004"] [data-part="title"]{
margin:0 0 1.25rem;max-width:20ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="about-004"] [data-part="paragraph"]{
margin:0 0 1rem;max-width:56ch;color:var(--vibeui-about-004-muted);
font-size:0.9375rem;line-height:1.65;
}
[data-vibeui-block="about-004"] [data-part="paragraph"]:last-child{margin-bottom:0}
[data-vibeui-block="about-004"] [data-part="stats"]{
margin:2.25rem 0 0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5rem 1.25rem;
}
[data-vibeui-block="about-004"] [data-part="stat"]{
/* column-reverse: в разметке dt (подпись) идёт раньше dd (значения), как
   требует dl, а визуально цифра должна стоять над подписью. */
display:flex;flex-direction:column-reverse;gap:0.25rem;
padding-top:1rem;border-top:2px solid var(--vibeui-about-004-border);
}
[data-vibeui-block="about-004"] [data-part="stat-value"]{
margin:0;color:var(--vibeui-about-004-accent);
font-size:clamp(1.875rem,4cqi,2.625rem);line-height:1.05;font-weight:750;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="about-004"] [data-part="stat-label"]{
color:var(--vibeui-about-004-muted);font-size:0.875rem;line-height:1.45;
}
@container (min-width: 52rem){
[data-vibeui-block="about-004"] [data-part="shell"]{
display:grid;grid-template-columns:minmax(0,1fr) minmax(0,20rem);gap:4rem;
padding:5rem 2rem;align-items:start;
}
[data-vibeui-block="about-004"] [data-part="stats"]{
margin:0;grid-template-columns:1fr;gap:1.75rem;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PARAGRAPHS = [
  "VibeUI начинался как внутренний набор секций небольшой студии. Мы устали чинить каскад чужих библиотек и решили, что блок обязан жить в одном файле и не зависеть ни от чего, кроме React.",
  "Сегодня этим каталогом собирают сайты команды без разработчиков: человек выбирает дизайн, ИИ-агент устанавливает блок, страница работает с первого прогона.",
]

const DEFAULT_STATS: About004Stat[] = [
  { value: "1 500+", label: "блоков в каталоге" },
  { value: "0", label: "зависимостей у каждого блока" },
  { value: "1 вечер", label: "от идеи до работающей страницы" },
  { value: "40+", label: "категорий секций" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Рассказ о компании: текст слева, столбик крупных оранжевых метрик справа. */
export function About004({
  eyebrow = "О нас",
  image = "",
  title = "Компоненты, которые не нужно поддерживать",
  paragraphs = DEFAULT_PARAGRAPHS,
  stats = DEFAULT_STATS,
  background = "",
  accent,
  className,
  style,
}: About004Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-about-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-about-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="about-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="story">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            {paragraphs.map((paragraph, index) => (
              <p key={index} data-part="paragraph">
                {paragraph}
              </p>
            ))}
          </div>
          <dl data-part="stats">
            {stats.map((stat) => (
              <div key={stat.label} data-part="stat">
                <dt data-part="stat-label">{stat.label}</dt>
                <dd data-part="stat-value">{stat.value}</dd>
              </div>
            ))}
          </dl>

          {image ? (
            <figure data-part="figure">
              <img src={image} alt="" loading="lazy" decoding="async" />
            </figure>
          ) : null}
        </div>
      </section>
    </>
  )
}
