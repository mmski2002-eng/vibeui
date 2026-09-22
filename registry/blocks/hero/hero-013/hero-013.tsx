import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Hero013Props = {
  title?: string
  lede?: string
  submitLabel?: string
  /** Подпись поля для скринридера: она скрыта, но остаётся в дереве доступности. */
  searchLabel?: string
  popularTitle?: string
  popular?: string[]
  counter?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  accent?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: hero каталога, где вход в продукт — строка поиска, а не кнопка.
// Форма отправляется методом GET на страницу выдачи: без JS она работает как
// обычный поиск, а с JS её легко перехватить. Под полем — популярные запросы
// ссылками с готовым query-параметром: это и подсказки, и внутренняя
// перелинковка. Счётчик рядом с полем отвечает на вопрос «а есть ли что искать».
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, она лежит прямо на фоне страницы и темнеет вместе
// с ней.
const STYLES = `
:where([data-vibeui-block="hero-013"]){
--vibeui-hero-013-bg:transparent;
--vibeui-hero-013-fg:light-dark(oklch(0.2 0 220),oklch(0.94 0 220));
--vibeui-hero-013-muted:light-dark(oklch(0.5 0 220),oklch(0.7 0 220));
--vibeui-hero-013-card:light-dark(oklch(1 0 0),oklch(0.26 0 220));
--vibeui-hero-013-line:light-dark(oklch(0.88 0 220),oklch(0.37 0 220));
--vibeui-hero-013-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-013-accent-fg:oklch(from var(--vibeui-hero-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-013-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-013"]{color-scheme:dark}
:where([data-vibeui-block="hero-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-013"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:linear-gradient(180deg,var(--vibeui-hero-013-bg),color-mix(in oklab,var(--vibeui-hero-013-bg) 45%,transparent));
color:var(--vibeui-hero-013-fg);font-family:var(--vibeui-hero-013-sans);
}
[data-vibeui-block="hero-013"] *{box-sizing:border-box}
[data-vibeui-block="hero-013"] [data-part="shell"]{max-width:46rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="hero-013"] form{margin:1.75rem auto 0;max-width:34rem;width:100%}
[data-vibeui-block="hero-013"] [data-part="search"]{display:flex;align-items:stretch;gap:0.5rem}
[data-vibeui-block="hero-013"] [data-part="search"]>[data-vibeui-block="input-001"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="hero-013"] [data-part="search"]>[data-vibeui-block="button-001"]{flex:0 0 auto;align-self:center}
[data-vibeui-block="hero-013"] [data-part="counter"]{margin:0.75rem 0 0;font-size:0.75rem;color:var(--vibeui-hero-013-muted)}
[data-vibeui-block="hero-013"] [data-part="popular"]{margin:1.75rem 0 0}
[data-vibeui-block="hero-013"] [data-part="populartitle"]{
margin:0 0 0.75rem;font-size:0.6875rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-hero-013-muted);
}
[data-vibeui-block="hero-013"] [data-part="tags"]{list-style:none;display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;margin:0;padding:0}
[data-vibeui-block="hero-013"] [data-part="tags"] a{
display:inline-flex;align-items:center;height:2rem;padding:0 0.875rem;border-radius:9999px;
border:1px solid var(--vibeui-hero-013-line);background:var(--vibeui-hero-013-card);
font-size:0.8125rem;color:var(--vibeui-hero-013-fg);text-decoration:none;
transition:border-color var(--vibeui-hero-013-dur-2) ease,color var(--vibeui-hero-013-dur-2) ease;
}
[data-vibeui-block="hero-013"] [data-part="tags"] a:hover{border-color:var(--vibeui-hero-013-accent);color:var(--vibeui-hero-013-accent)}
[data-vibeui-block="hero-013"] [data-part="tags"] a:focus-visible{outline:2px solid var(--vibeui-hero-013-accent);outline-offset:2px}
@container (min-width: 34rem){
[data-vibeui-block="hero-013"] [data-part="shell"]{padding:5.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POPULAR = [
  "hero",
  "тарифы",
  "тёмная тема",
  "форма входа",
  "дашборд",
  "отзывы",
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

/** Hero с поиском по каталогу: форма GET, подсказки-ссылки и счётчик секций. */
export function Hero013({
  title = "Найдите секцию по названию, а не листайте каталог",
  lede = "Тысяча с лишним готовых блоков. Введите задачу словами — «тёмный hero с формой» — и берите подходящий.",
  submitLabel = "Найти",
  searchLabel = "Поиск по каталогу",
  popularTitle = "Ищут чаще всего",
  popular = DEFAULT_POPULAR,
  counter = "1 080 секций · обновлено сегодня",
  background = "",
  accent,
  tone = "auto",
  className,
  style,
}: Hero013Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-013"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            title={title}
            lede={lede}
            level="h1"
            size="lg"
            align="center"
            accent={accent}
          />

          <form role="search" method="get" action="#">
            <div data-part="search">
              <Input001 type="search" name="q" label={searchLabel} accent={accent} />
              <Button001 type="submit" size="lg" accent={accent}>
                {submitLabel}
              </Button001>
            </div>
          </form>

          {counter ? <p data-part="counter">{counter}</p> : null}

          {popular.length > 0 ? (
            <nav data-part="popular" aria-label={popularTitle}>
              <p data-part="populartitle">{popularTitle}</p>
              <ul data-part="tags">
                {popular.slice(0, 6).map((tag) => (
                  <li key={tag}>
                    <a href={`#q=${encodeURIComponent(tag)}`}>{tag}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </section>
    </>
  )
}
