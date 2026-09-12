import type { CSSProperties } from "react"

export type About006Props = {
  /** Фотографии мозаики по порядку плиток. Без них остаются цветные поля. */
  images?: string[]
  eyebrow?: string
  title?: string
  caption?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Фото-мозаика без фотографий: сетка «офисных» плиток на тёплых CSS-градиентах
// разной глубины плюс карточка с подписью о культуре. Плитки — честные
// заглушки: разный процент оранжевого в градиенте даёт сетке ритм живой
// фотоленты, но не тянет ни одной картинки и не бьёт по загрузке.
const TILES: { tone: 1 | 2 | 3 | 4 | 5; wide?: boolean }[] = [
  { tone: 3 },
  { tone: 1 },
  { tone: 4 },
  { tone: 2 },
  { tone: 5, wide: true },
  { tone: 2 },
  { tone: 1 },
]

const STYLES = `
:where([data-vibeui-block="about-006"]){
--vibeui-about-006-bg:transparent;
--vibeui-about-006-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-about-006-ink:light-dark(oklch(0.17 0 0),oklch(0.97 0 0));
--vibeui-about-006-muted:light-dark(oklch(0.45 0 0),oklch(0.72 0 0));
--vibeui-about-006-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-about-006-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-about-006-tile:light-dark(oklch(0.97 0.008 60),oklch(0.24 0.008 50));
--vibeui-about-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-006"]{color-scheme:dark}
[data-vibeui-block="about-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-about-006-bg);color:var(--vibeui-about-006-ink);
font-family:var(--vibeui-about-006-font);
}
[data-vibeui-block="about-006"] [data-part="shell"]{
max-width:72rem;margin:0 auto;padding:3.5rem 1.25rem;
}
[data-vibeui-block="about-006"] [data-part="mosaic"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem;
}
[data-vibeui-block="about-006"] [data-part="tile"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="about-006"] [data-part="note"]{
grid-column:span 2;min-inline-size:0;
display:flex;flex-direction:column;justify-content:center;gap:0.625rem;
padding:1.75rem;border:1px solid var(--vibeui-about-006-border);border-radius:1rem;
background:color-mix(in oklab,var(--vibeui-about-006-accent) 8%,var(--vibeui-about-006-card));
}
[data-vibeui-block="about-006"] [data-part="eyebrow"]{
margin:0;color:var(--vibeui-about-006-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="about-006"] [data-part="title"]{
margin:0;font-size:clamp(1.375rem,3.5cqi,1.875rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="about-006"] [data-part="caption"]{
margin:0;color:var(--vibeui-about-006-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="about-006"] [data-part="tile"]{
position:relative;overflow:hidden;border-radius:1rem;aspect-ratio:1;
}
/* Мягкий блик — плитка читается как снимок при свете окна, а не как плашка. */
[data-vibeui-block="about-006"] [data-part="tile"]::before{
content:"";position:absolute;inset:0;
background:radial-gradient(120% 90% at 28% 20%,oklch(1 0 0 / 22%),transparent 55%);
}
[data-vibeui-block="about-006"] [data-part="tile"][data-wide]{aspect-ratio:2/1;grid-column:span 2}
[data-vibeui-block="about-006"] [data-part="tile"]:not([data-empty="true"])::before{display:none}
[data-vibeui-block="about-006"] [data-part="tile"][data-tone="1"]{
background:linear-gradient(135deg,color-mix(in oklab,var(--vibeui-about-006-accent) 8%,var(--vibeui-about-006-tile)),color-mix(in oklab,var(--vibeui-about-006-accent) 16%,var(--vibeui-about-006-tile)));
}
[data-vibeui-block="about-006"] [data-part="tile"][data-tone="2"]{
background:linear-gradient(135deg,color-mix(in oklab,var(--vibeui-about-006-accent) 14%,var(--vibeui-about-006-tile)),color-mix(in oklab,var(--vibeui-about-006-accent) 26%,var(--vibeui-about-006-tile)));
}
[data-vibeui-block="about-006"] [data-part="tile"][data-tone="3"]{
background:linear-gradient(135deg,color-mix(in oklab,var(--vibeui-about-006-accent) 22%,var(--vibeui-about-006-tile)),color-mix(in oklab,var(--vibeui-about-006-accent) 38%,var(--vibeui-about-006-tile)));
}
[data-vibeui-block="about-006"] [data-part="tile"][data-tone="4"]{
background:linear-gradient(135deg,color-mix(in oklab,var(--vibeui-about-006-accent) 32%,var(--vibeui-about-006-tile)),color-mix(in oklab,var(--vibeui-about-006-accent) 52%,var(--vibeui-about-006-tile)));
}
[data-vibeui-block="about-006"] [data-part="tile"][data-tone="5"]{
background:linear-gradient(135deg,color-mix(in oklab,var(--vibeui-about-006-accent) 46%,var(--vibeui-about-006-tile)),color-mix(in oklab,var(--vibeui-about-006-accent) 72%,var(--vibeui-about-006-tile)));
}
@container (min-width: 48rem){
[data-vibeui-block="about-006"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="about-006"] [data-part="mosaic"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem}
[data-vibeui-block="about-006"] [data-part="note"]{grid-column:span 2;grid-row:span 2;padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-006"] *{animation:none!important;transition:none!important}}
`

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

/** Мозаика тёплых плиток-заглушек с карточкой-подписью о культуре команды. */
export function About006({
  eyebrow = "Команда",
  images = [],
  title = "Культура сильнее офиса",
  caption = "Мы распределённая команда: дизайнеры, инженеры и технические писатели в четырёх часовых поясах. Вместо общих стен — общий стандарт качества блоков.",
  background = "",
  accent,
  className,
  style,
}: About006Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-about-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-about-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="about-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="mosaic">
            <div data-part="note">
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="title">{title}</h2>
              <p data-part="caption">{caption}</p>
            </div>
            {TILES.map((tile, index) => (
              <div
                key={index}
                data-part="tile"
                data-empty={images[index] ? undefined : "true"}
                data-tone={tile.tone}
                data-wide={tile.wide ? "" : undefined}
                aria-hidden="true"
              >
                {images[index] ? (
                  <img
                    src={images[index]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
