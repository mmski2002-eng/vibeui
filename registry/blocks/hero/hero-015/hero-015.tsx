import type { CSSProperties } from "react"

import { Button077 } from "@/registry/components/button/button-077/button-077"

export type Hero015Props = {
  studio?: string
  title?: string
  /** Курсивная часть заголовка — единственное цветное пятно в блоке. */
  titleAccent?: string
  lede?: string
  link?: { label: string; href: string }
  index?: { label: string; value: string }[]
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  accent?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: минимум средств. Ни кнопок, ни карточек, ни градиентов —
// крупный serif-заголовок на бумажном фоне, одна подчёркнутая ссылка и
// выходные данные мелким кеглем внизу. Единственный акцент — подчёркивание,
// которое растёт из нуля на hover через background-size, а не через border:
// так линия остаётся на месте и не сдвигает текст.
//
// Тема приходит из color-scheme окружения через light-dark(): бумажная база
// светлая, а в тёмном контексте её место занимает тёплая тёмная пара, где
// линии светлее фона.
const STYLES = `
:where([data-vibeui-block="hero-015"]){
--vibeui-hero-015-bg:transparent;
--vibeui-hero-015-fg:light-dark(oklch(0.18 0.012 70),oklch(0.94 0.006 80));
--vibeui-hero-015-muted:light-dark(oklch(0.48 0.014 70),oklch(0.71 0.012 80));
--vibeui-hero-015-line:light-dark(oklch(0.85 0.012 70),oklch(0.36 0.014 80));
--vibeui-hero-015-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-015-serif:ui-serif,Georgia,"Iowan Old Style","Times New Roman",serif;
--vibeui-hero-015-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-015-dur-2:180ms;
--vibeui-hero-015-dur-3:240ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-015"]{color-scheme:dark}
:where([data-vibeui-block="hero-015"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-015"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-015"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-015-bg);color:var(--vibeui-hero-015-fg);
font-family:var(--vibeui-hero-015-sans);
}
[data-vibeui-block="hero-015"] *{box-sizing:border-box}
[data-vibeui-block="hero-015"] [data-part="cta-link"]{margin:2rem 0 0;}
[data-vibeui-block="hero-015"] [data-part="shell"]{max-width:58rem;width:100%;margin:0 auto;padding:4rem 1.25rem}
[data-vibeui-block="hero-015"] [data-part="studio"]{
margin:0 0 3rem;padding-bottom:1rem;border-bottom:1px solid var(--vibeui-hero-015-line);
font-size:0.75rem;font-weight:650;letter-spacing:0.18em;text-transform:uppercase;color:var(--vibeui-hero-015-muted);
}
[data-vibeui-block="hero-015"] h1{
margin:0;font-family:var(--vibeui-hero-015-serif);font-weight:400;
font-size:clamp(2.25rem,8.5cqi,5rem);line-height:1.02;letter-spacing:-0.035em;text-wrap:balance;
}
[data-vibeui-block="hero-015"] h1 em{font-style:italic;color:var(--vibeui-hero-015-accent)}
[data-vibeui-block="hero-015"] [data-part="lede"]{
margin:2rem 0 0;max-width:32rem;font-size:clamp(0.9375rem,1.5cqi,1.125rem);line-height:1.65;
color:var(--vibeui-hero-015-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-015"] dl{
display:grid;grid-template-columns:1fr;gap:0.75rem 2rem;margin:4rem 0 0;padding-top:1.25rem;
border-top:1px solid var(--vibeui-hero-015-line);font-size:0.8125rem;
}
[data-vibeui-block="hero-015"] [data-part="row"]{display:flex;justify-content:space-between;gap:1rem}
[data-vibeui-block="hero-015"] dt{margin:0;color:var(--vibeui-hero-015-muted)}
[data-vibeui-block="hero-015"] dd{margin:0;font-weight:600}
@container (min-width: 34rem){
[data-vibeui-block="hero-015"] [data-part="shell"]{padding:6rem 2rem}
[data-vibeui-block="hero-015"] dl{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="hero-015"] [data-part="row"]{flex-direction:column;gap:0.25rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-015"] [data-part="shell"]{padding:8rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_INDEX = [
  { label: "Основано", value: "2021" },
  { label: "Проектов", value: "48" },
  { label: "Города", value: "Москва, Тбилиси" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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

/** Минималистичный текстовый hero: крупный serif, одна ссылка и выходные данные. */
export function Hero015({
  studio = "Студия «Верста»",
  title = "Мы делаем интерфейсы, которые",
  titleAccent = "не нужно объяснять",
  lede = "Никаких скриншотов и градиентов на первом экране. Только то, чем занимаемся, и адрес, по которому нас можно застать.",
  link = { label: "Смотреть работы", href: "#" },
  index = DEFAULT_INDEX,
  background = "",
  accent,
  tone = "auto",
  className,
  style,
}: Hero015Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-015"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {studio ? <p data-part="studio">{studio}</p> : null}
          <h1>
            {title} {titleAccent ? <em>{titleAccent}</em> : null}
          </h1>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <Button077 data-part="cta-link" label={link.label} href={link.href} accent={accent} />

          {index.length > 0 ? (
            <dl>
              {index.slice(0, 3).map((entry) => (
                <div key={entry.label} data-part="row">
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>
    </>
  )
}
