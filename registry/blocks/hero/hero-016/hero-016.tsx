import type { CSSProperties } from "react"

export type Hero016Path = {
  title: string
  description: string
  action: string
  href: string
  points: string[]
}

export type Hero016Props = {
  eyebrow?: string
  title?: string
  lede?: string
  paths?: [Hero016Path, Hero016Path]
  footnote?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  accent?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: развилка вместо одной кнопки. Аудитории две, и вместо
// компромиссного заголовка секция сразу спрашивает «вы кто» — две равные
// карточки-пути, каждая со своим списком и своей ссылкой. Карточка кликабельна
// целиком за счёт растянутой псевдоссылки, но в дереве доступности остаётся
// одна ссылка на путь, а не три. Ни один путь не выделен цветом: выбор
// равный, иначе развилка превращается в тариф с «рекомендованным».
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, а карточки в тёмном контексте светлее фона, и
// граница у них светлее заливки.
const STYLES = `
:where([data-vibeui-block="hero-016"]){
--vibeui-hero-016-bg:transparent;
--vibeui-hero-016-fg:light-dark(oklch(0.2 0 260),oklch(0.94 0 260));
--vibeui-hero-016-muted:light-dark(oklch(0.51 0 260),oklch(0.71 0 260));
--vibeui-hero-016-card:light-dark(oklch(1 0 0),oklch(0.25 0 260));
--vibeui-hero-016-line:light-dark(oklch(0.89 0 260),oklch(0.36 0 260));
--vibeui-hero-016-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-016"]{color-scheme:dark}
:where([data-vibeui-block="hero-016"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-016"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-016"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-016-bg);color:var(--vibeui-hero-016-fg);
font-family:var(--vibeui-hero-016-sans);
}
[data-vibeui-block="hero-016"] *{box-sizing:border-box}
[data-vibeui-block="hero-016"] [data-part="shell"]{max-width:62rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="hero-016"] [data-part="eyebrow"]{
margin:0 0 0.875rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-hero-016-accent);
}
[data-vibeui-block="hero-016"] h1{
margin:0;font-size:clamp(1.75rem,5.4cqi,3rem);line-height:1.08;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-016"] [data-part="lede"]{
margin:1rem auto 0;max-width:34rem;font-size:clamp(0.9375rem,1.4cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-hero-016-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-016"] [data-part="paths"]{display:grid;grid-template-columns:1fr;gap:1rem;margin:2.25rem 0 0;text-align:left}
[data-vibeui-block="hero-016"] [data-part="path"]{
position:relative;display:flex;flex-direction:column;
padding:1.5rem;border:1px solid var(--vibeui-hero-016-line);border-radius:1rem;background:var(--vibeui-hero-016-card);
transition:border-color .16s ease,transform .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="hero-016"] [data-part="path"]:hover{
border-color:var(--vibeui-hero-016-accent);transform:translateY(-2px);
box-shadow:0 6px 24px color-mix(in oklab,var(--vibeui-hero-016-accent) 14%,transparent);
}
[data-vibeui-block="hero-016"] [data-part="path"]:focus-within{
border-color:var(--vibeui-hero-016-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-hero-016-accent) 22%,transparent);
}
[data-vibeui-block="hero-016"] [data-part="glyph"]{
width:2.25rem;height:2.25rem;border-radius:0.625rem;display:flex;align-items:center;justify-content:center;
background:color-mix(in oklab,var(--vibeui-hero-016-accent) 14%,transparent);color:var(--vibeui-hero-016-accent);
}
[data-vibeui-block="hero-016"] h2{margin:0.875rem 0 0;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="hero-016"] [data-part="desc"]{margin:0.5rem 0 0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-hero-016-muted)}
[data-vibeui-block="hero-016"] ul{list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="hero-016"] li{display:flex;align-items:flex-start;gap:0.5rem;font-size:0.8125rem;line-height:1.5}
[data-vibeui-block="hero-016"] [data-part="tick"]{flex:0 0 auto;margin-top:0.25rem;color:var(--vibeui-hero-016-accent)}
[data-vibeui-block="hero-016"] [data-part="go"]{
margin-top:1.25rem;display:inline-flex;align-items:center;gap:0.375rem;align-self:flex-start;
font-size:0.875rem;font-weight:650;color:var(--vibeui-hero-016-accent);text-decoration:none;
}
[data-vibeui-block="hero-016"] [data-part="go"]::after{content:"";position:absolute;inset:0;border-radius:1rem}
[data-vibeui-block="hero-016"] [data-part="go"]:focus-visible{outline:none}
[data-vibeui-block="hero-016"] [data-part="footnote"]{margin:1.5rem 0 0;font-size:0.8125rem;color:var(--vibeui-hero-016-muted)}
@container (min-width: 40rem){
[data-vibeui-block="hero-016"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="hero-016"] [data-part="paths"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="hero-016"] [data-part="path"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PATHS: [Hero016Path, Hero016Path] = [
  {
    title: "Я собираю сам",
    description:
      "Открываете каталог, копируете инструкцию и ставите секции своим агентом.",
    action: "Открыть каталог",
    href: "#",
    points: [
      "1 080 готовых секций",
      "Установка одной командой",
      "Бесплатно на любом проекте",
    ],
  },
  {
    title: "Мне нужна команда",
    description:
      "Берём дизайн, тексты и сборку страницы на себя — вы принимаете результат.",
    action: "Обсудить задачу",
    href: "#",
    points: [
      "Страница за две недели",
      "Свой дизайнер и разработчик",
      "Фиксированная смета",
    ],
  },
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

/** Hero с развилкой: два равных пути-карточки, каждый со своим списком и ссылкой. */
export function Hero016({
  eyebrow = "Два способа начать",
  title = "Соберёте сами или доверите нам?",
  lede = "Один и тот же каталог, разная степень участия. Выберите путь — дальше сценарии не пересекаются.",
  paths = DEFAULT_PATHS,
  footnote = "Передумать можно в любой момент: секции остаются вашими в обоих случаях.",
  background = "",
  accent,
  tone = "auto",
  className,
  style,
}: Hero016Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-016"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <div data-part="paths">
            {paths.map((path, index) => (
              <article key={path.title} data-part="path">
                <span data-part="glyph" aria-hidden="true">
                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                    {index === 0 ? (
                      <path
                        d="M7.5 5 3 10l4.5 5M12.5 5 17 10l-4.5 5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <path
                        d="M10 4.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.5 16c0-2.5 2.9-4 6.5-4s6.5 1.5 6.5 4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                </span>
                <h2>{path.title}</h2>
                <p data-part="desc">{path.description}</p>
                <ul>
                  {path.points.slice(0, 4).map((point) => (
                    <li key={point}>
                      <span data-part="tick" aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="11" height="11">
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
                <a data-part="go" href={path.href}>
                  {path.action} →
                </a>
              </article>
            ))}
          </div>

          {footnote ? <p data-part="footnote">{footnote}</p> : null}
        </div>
      </section>
    </>
  )
}
