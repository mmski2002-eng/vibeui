import type { CSSProperties } from "react"

type About005Item = {
  title: string
  text: string
}

export type About005Props = {
  eyebrow?: string
  title?: string
  items?: About005Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Манифест нумерованным списком: крупные оранжевые 01/02/03, рядом принцип и
// пояснение. Номера считаются из индекса массива прямо в JSX — без CSS-счётчиков,
// чтобы серверный рендер был детерминированным, а список оставался честным <ol>.
// Разделители-линии превращают перечень в документ, который хочется дочитать.
const STYLES = `
:where([data-vibeui-block="about-005"]){
--vibeui-about-005-bg:transparent;
--vibeui-about-005-ink:light-dark(oklch(0.17 0 0),oklch(0.97 0 0));
--vibeui-about-005-muted:light-dark(oklch(0.45 0 0),oklch(0.72 0 0));
--vibeui-about-005-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-about-005-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-about-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-005"]{color-scheme:dark}
[data-vibeui-block="about-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-about-005-bg);color:var(--vibeui-about-005-ink);
font-family:var(--vibeui-about-005-font);
}
[data-vibeui-block="about-005"] [data-part="shell"]{
max-width:60rem;margin:0 auto;padding:3.5rem 1.25rem;
}
[data-vibeui-block="about-005"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-about-005-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="about-005"] [data-part="title"]{
margin:0 0 1.5rem;max-width:22ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="about-005"] [data-part="list"]{
list-style:none;margin:0;padding:0;
}
[data-vibeui-block="about-005"] [data-part="principle"]{
display:grid;grid-template-columns:3.25rem 1fr;column-gap:1rem;
padding:1.5rem 0;border-top:1px solid var(--vibeui-about-005-border);
}
[data-vibeui-block="about-005"] [data-part="index"]{
color:var(--vibeui-about-005-accent);
font-size:1.25rem;line-height:1.2;font-weight:750;letter-spacing:0.02em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="about-005"] [data-part="principle-title"]{
margin:0 0 0.375rem;font-size:1.125rem;line-height:1.3;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="about-005"] [data-part="principle-text"]{
margin:0;max-width:56ch;color:var(--vibeui-about-005-muted);
font-size:0.9375rem;line-height:1.6;
}
@container (min-width: 44rem){
[data-vibeui-block="about-005"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="about-005"] [data-part="principle"]{
grid-template-columns:7rem 1fr;column-gap:2rem;padding:2rem 0;
}
[data-vibeui-block="about-005"] [data-part="index"]{font-size:2rem;line-height:1.1}
[data-vibeui-block="about-005"] [data-part="principle-title"]{font-size:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: About005Item[] = [
  {
    title: "Сначала блок, потом абстракция",
    text: "Мы не строим фреймворк. Дублирование дешевле преждевременного обобщения, а простой файл дешевле умного пакета.",
  },
  {
    title: "Код читают не только люди",
    text: "Каждое неочевидное решение в блоке объяснено. Модель, как и новый разработчик, должна понимать, почему сделано именно так.",
  },
  {
    title: "Ничего лишнего в бандле",
    text: "Секция не тянет за собой библиотеку: взяли три блока — получили три файла и ноль новых зависимостей.",
  },
  {
    title: "Совместимость дороже новизны",
    text: "Работаем со стандартным shadcn CLI и обычными файлами проекта — без собственных установщиков и рантаймов.",
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

/** Принципы компании нумерованным манифестом: оранжевые 01/02/03 и пояснения. */
export function About005({
  eyebrow = "Манифест",
  title = "Принципы, по которым мы работаем",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: About005Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-about-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-about-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="about-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ol data-part="list">
            {items.map((item, index) => (
              <li key={item.title} data-part="principle">
                <span data-part="index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div data-part="body">
                  <h3 data-part="principle-title">{item.title}</h3>
                  <p data-part="principle-text">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
