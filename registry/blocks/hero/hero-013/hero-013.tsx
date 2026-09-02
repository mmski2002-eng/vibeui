import type { CSSProperties } from "react"

export type Hero013Props = {
  title?: string
  lede?: string
  placeholder?: string
  submitLabel?: string
  /** Подпись поля для скринридера: она скрыта, но остаётся в дереве доступности. */
  searchLabel?: string
  popularTitle?: string
  popular?: string[]
  counter?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  accent?: string
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
--vibeui-hero-013-fg:light-dark(oklch(0.2 0.02 220),oklch(0.94 0.008 220));
--vibeui-hero-013-muted:light-dark(oklch(0.5 0.018 220),oklch(0.7 0.015 220));
--vibeui-hero-013-card:light-dark(oklch(1 0 0),oklch(0.26 0.014 220));
--vibeui-hero-013-line:light-dark(oklch(0.88 0.012 220),oklch(0.37 0.015 220));
--vibeui-hero-013-accent:light-dark(oklch(0.52 0.14 220),oklch(0.74 0.13 220));
--vibeui-hero-013-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.18 0.03 220));
--vibeui-hero-013-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="hero-013"]{
box-sizing:border-box;
background:linear-gradient(180deg,var(--vibeui-hero-013-bg),color-mix(in oklab,var(--vibeui-hero-013-bg) 45%,transparent));
color:var(--vibeui-hero-013-fg);font-family:var(--vibeui-hero-013-sans);
}
[data-vibeui-block="hero-013"] *{box-sizing:border-box}
[data-vibeui-block="hero-013"] [data-part="shell"]{max-width:46rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="hero-013"] h1{
margin:0;font-size:clamp(1.75rem,5.6cqi,3rem);line-height:1.08;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-013"] [data-part="lede"]{
margin:0.875rem auto 0;max-width:32rem;font-size:clamp(0.9375rem,1.4cqi,1.0625rem);line-height:1.55;
color:var(--vibeui-hero-013-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-013"] form{margin:1.75rem auto 0;max-width:34rem;width:100%}
[data-vibeui-block="hero-013"] [data-part="search"]{
display:flex;align-items:center;gap:0.5rem;padding:0.4375rem 0.4375rem 0.4375rem 0.875rem;
border-radius:9999px;border:1px solid var(--vibeui-hero-013-line);background:var(--vibeui-hero-013-card);
box-shadow:0 1px 2px oklch(0 0 0 / 5%);transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="hero-013"] [data-part="search"]:focus-within{
border-color:var(--vibeui-hero-013-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-hero-013-accent) 20%,transparent);
}
[data-vibeui-block="hero-013"] [data-part="glass"]{flex:0 0 auto;color:var(--vibeui-hero-013-muted)}
[data-vibeui-block="hero-013"] input{
flex:1 1 auto;min-width:0;height:2.5rem;border:0;background:none;font:inherit;font-size:0.9375rem;color:inherit;
}
[data-vibeui-block="hero-013"] input:focus{outline:none}
[data-vibeui-block="hero-013"] button{
appearance:none;cursor:pointer;flex:0 0 auto;height:2.5rem;padding:0 1.125rem;border:0;border-radius:9999px;
background:var(--vibeui-hero-013-accent);color:var(--vibeui-hero-013-accent-fg);
font:inherit;font-size:0.875rem;font-weight:650;transition:background-color .16s ease;
}
[data-vibeui-block="hero-013"] button:hover{background:color-mix(in oklab,var(--vibeui-hero-013-accent) 86%,black)}
[data-vibeui-block="hero-013"] button:focus-visible{outline:2px solid var(--vibeui-hero-013-accent);outline-offset:3px}
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
transition:border-color .16s ease,color .16s ease;
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
  placeholder = "Например: тарифы с переключателем",
  submitLabel = "Найти",
  searchLabel = "Поиск по каталогу",
  popularTitle = "Ищут чаще всего",
  popular = DEFAULT_POPULAR,
  counter = "1 080 секций · обновлено сегодня",
  background = "",
  accent,
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
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h1>{title}</h1>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <form role="search" method="get" action="#">
            <div data-part="search">
              <svg
                data-part="glass"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="4.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M10.5 10.5 14 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <label htmlFor="vibeui-hero-013-q" hidden>
                {searchLabel}
              </label>
              <input
                id="vibeui-hero-013-q"
                type="search"
                name="q"
                placeholder={placeholder}
              />
              <button type="submit">{submitLabel}</button>
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
