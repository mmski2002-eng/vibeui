import type { CSSProperties } from "react"

type About002Item = {
  year: string
  heading: string
  text: string
}

export type About002Props = {
  /** Фото из истории компании. Без него секция остаётся текстовой. */
  image?: string
  eyebrow?: string
  title?: string
  items?: About002Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// История компании вертикальной осью: годы, оранжевые точки, вехи. Ось и
// точки нарисованы псевдоэлементами — разметка остаётся чистым списком <ol>,
// а хронология читается и без стилей. На широком контейнере год уходит в
// левую колонку, ось встаёт между годом и текстом.
const STYLES = `
:where([data-vibeui-block="about-002"]){
--vibeui-about-002-bg:transparent;
--vibeui-about-002-ink:light-dark(oklch(0.17 0 0),oklch(0.97 0 0));
--vibeui-about-002-muted:light-dark(oklch(0.45 0 0),oklch(0.72 0 0));
--vibeui-about-002-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-about-002-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-about-002-halo:color-mix(in oklab,var(--vibeui-about-002-accent) 15%,transparent);
--vibeui-about-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-002"]{color-scheme:dark}
[data-vibeui-block="about-002"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-about-002-bg);color:var(--vibeui-about-002-ink);
font-family:var(--vibeui-about-002-font);
}
[data-vibeui-block="about-002"] [data-part="figure"]{
position:relative;overflow:hidden;aspect-ratio:16 / 9;
margin-top:1.5rem;border-radius:0.875rem;
}
[data-vibeui-block="about-002"] [data-part="figure"] img{
display:block;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="about-002"] [data-part="shell"]{
max-width:56rem;margin:0 auto;padding:3.5rem 1.25rem;
}
[data-vibeui-block="about-002"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-about-002-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="about-002"] [data-part="title"]{
margin:0 0 2.5rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="about-002"] [data-part="timeline"]{
list-style:none;margin:0;padding:0;
}
[data-vibeui-block="about-002"] [data-part="milestone"]{
position:relative;padding:0 0 2.25rem 2rem;
}
/* Ось: от точки текущей вехи до точки следующей. */
[data-vibeui-block="about-002"] [data-part="milestone"]::before{
content:"";position:absolute;left:calc(0.4375rem - 1px);top:1.375rem;bottom:-0.125rem;
width:2px;background:var(--vibeui-about-002-border);
}
[data-vibeui-block="about-002"] [data-part="milestone"]:last-child{padding-bottom:0}
[data-vibeui-block="about-002"] [data-part="milestone"]:last-child::before{display:none}
[data-vibeui-block="about-002"] [data-part="milestone"]::after{
content:"";position:absolute;left:0;top:0.25rem;
width:0.875rem;height:0.875rem;border-radius:999px;
background:var(--vibeui-about-002-accent);
box-shadow:0 0 0 4px var(--vibeui-about-002-halo);
}
[data-vibeui-block="about-002"] [data-part="year"]{
display:block;margin:0 0 0.375rem;
color:var(--vibeui-about-002-accent);
font-size:0.875rem;font-weight:750;letter-spacing:0.06em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="about-002"] [data-part="heading"]{
margin:0 0 0.375rem;font-size:1.125rem;line-height:1.3;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="about-002"] [data-part="text"]{
margin:0;max-width:52ch;color:var(--vibeui-about-002-muted);
font-size:0.9375rem;line-height:1.6;
}
@container (min-width: 44rem){
[data-vibeui-block="about-002"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="about-002"] [data-part="milestone"]{
display:grid;grid-template-columns:6.5rem 1fr;column-gap:2.5rem;
padding-left:0;padding-bottom:2.75rem;
}
[data-vibeui-block="about-002"] [data-part="milestone"]::before{
left:calc(7.75rem - 1px);top:1.5rem;
}
[data-vibeui-block="about-002"] [data-part="milestone"]::after{
left:7.3125rem;top:0.375rem;
}
[data-vibeui-block="about-002"] [data-part="year"]{
margin:0;text-align:right;font-size:1rem;padding-top:0.125rem;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: About002Item[] = [
  {
    year: "2022",
    heading: "Двадцать секций для себя",
    text: "Собрали первый каталог для внутренних проектов студии — чтобы не верстать одну и ту же секцию в пятый раз.",
  },
  {
    year: "2023",
    heading: "Открытый registry",
    text: "Выложили блоки в shadcn-совместимый registry: установка одной командой в любой проект на React.",
  },
  {
    year: "2024",
    heading: "Copy for AI",
    text: "К каждому блоку добавили инструкцию для ИИ-агента — установка перестала требовать разработчика.",
  },
  {
    year: "2025",
    heading: "Полторы тысячи блоков",
    text: "Каталог вырос до полутора тысяч секций, а сборка сайта сжалась с месяца до одного вечера.",
  },
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

/** История компании вертикальным таймлайном с годами и оранжевыми точками. */
export function About002({
  eyebrow = "История",
  image = "",
  title = "Как мы к этому пришли",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: About002Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-about-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-about-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="about-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ol data-part="timeline">
            {items.map((item) => (
              <li key={item.year + item.heading} data-part="milestone">
                <span data-part="year">{item.year}</span>
                <div data-part="entry">
                  <h3 data-part="heading">{item.heading}</h3>
                  <p data-part="text">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>

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
