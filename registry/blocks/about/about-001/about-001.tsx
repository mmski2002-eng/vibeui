import type { CSSProperties } from "react"

type About001Segment = {
  text: string
  highlight?: boolean
}

export type About001Props = {
  eyebrow?: string
  segments?: About001Segment[]
  footnote?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Миссия одним крупным заявлением, а не колонкой текста. Опорные слова
// подсвечены оранжевым маркером — взгляд собирает смысл даже при беглом
// чтении. Выделение живёт в данных (массив сегментов), а не в разметке:
// так текст можно менять, не трогая JSX.
const STYLES = `
:where([data-vibeui-block="about-001"]){
--vibeui-about-001-bg:transparent;
--vibeui-about-001-ink:light-dark(oklch(0.17 0 0),oklch(0.97 0 0));
--vibeui-about-001-muted:light-dark(oklch(0.45 0 0),oklch(0.72 0 0));
--vibeui-about-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-about-001-mark:color-mix(in oklab,var(--vibeui-about-001-accent) 12%,transparent);
--vibeui-about-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="about-001"]{color-scheme:dark}
[data-vibeui-block="about-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-about-001-bg);color:var(--vibeui-about-001-ink);
font-family:var(--vibeui-about-001-font);
}
[data-vibeui-block="about-001"] [data-part="shell"]{
max-width:70rem;margin:0 auto;padding:3.5rem 1.25rem;
}
[data-vibeui-block="about-001"] [data-part="eyebrow"]{
margin:0 0 1.25rem;color:var(--vibeui-about-001-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="about-001"] [data-part="statement"]{
margin:0;
font-size:clamp(1.5rem,5.5cqi,3.25rem);line-height:1.2;letter-spacing:-0.02em;font-weight:650;
text-wrap:balance;
}
[data-vibeui-block="about-001"] [data-part="mark"]{
color:var(--vibeui-about-001-accent);
background:var(--vibeui-about-001-mark);
border-radius:0.25em;padding:0 0.12em;
-webkit-box-decoration-break:clone;box-decoration-break:clone;
}
[data-vibeui-block="about-001"] [data-part="footnote"]{
margin:2rem 0 0;display:flex;align-items:center;gap:0.75rem;
max-width:56ch;color:var(--vibeui-about-001-muted);
font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="about-001"] [data-part="footnote"]::before{
content:"";flex:none;width:2rem;height:2px;border-radius:999px;
background:var(--vibeui-about-001-accent);color:oklch(from var(--vibeui-about-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@container (min-width: 48rem){
[data-vibeui-block="about-001"] [data-part="shell"]{padding:5.5rem 2rem}
[data-vibeui-block="about-001"] [data-part="footnote"]{margin-top:2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="about-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SEGMENTS: About001Segment[] = [
  { text: "Мы строим библиотеку, в которой " },
  { text: "дизайн", highlight: true },
  { text: " перестаёт быть узким местом: каждый блок понятен " },
  { text: "ИИ-агенту", highlight: true },
  { text: " с первого раза и превращается в " },
  { text: "работающий сайт", highlight: true },
  { text: " за один вечер." },
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

/** Миссия крупным манифестом с оранжевыми маркерами на опорных словах. */
export function About001({
  eyebrow = "О компании",
  segments = DEFAULT_SEGMENTS,
  footnote = "VibeUI — команда дизайнеров и инженеров, которая пишет компоненты для людей и моделей одновременно.",
  background = "",
  accent,
  className,
  style,
}: About001Props) {
  const palette = {
    ...(accent ? { "--vibeui-about-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-about-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-about-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="about-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <p data-part="statement">
            {segments.map((segment, index) =>
              segment.highlight ? (
                <mark data-part="mark" key={index}>
                  {segment.text}
                </mark>
              ) : (
                <span key={index}>{segment.text}</span>
              ),
            )}
          </p>
          {footnote ? <p data-part="footnote">{footnote}</p> : null}
        </div>
      </section>
    </>
  )
}
