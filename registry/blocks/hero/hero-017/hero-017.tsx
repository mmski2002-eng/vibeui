import type { CSSProperties } from "react"

export type Hero017Props = {
  eyebrow?: string
  prefix?: string
  words?: string[]
  suffix?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: заголовок с одним заменяемым словом вместо статичной фразы —
// приём «мы делаем X», где X проходит по списку. Все варианты слова лежат
// в одной grid-ячейке (grid-area: 1/1): контейнер сам меряется по самому
// широкому слову, поэтому ширина не дёргается при смене — ch-эвристика или
// измерение в JS не нужны. Каждое слово получает свой отрицательный
// animation-delay, кратный длительности цикла: это сдвигает фазы так, что
// в любой момент видно ровно одно слово, а бесконечный повтор не требует
// класса состояния и клиентского JS.
//
// Ротатор декоративен и помечен aria-hidden: список слов для скринридера
// продублирован статичной visually-hidden строкой через запятую — иначе
// озвучились бы все варианты подряд, потому что opacity не убирает текст
// из доступного дерева.
const STYLES = `
:where([data-vibeui-block="hero-017"]){
--vibeui-hero-017-bg:transparent;
--vibeui-hero-017-fg:light-dark(oklch(0.2 0.014 155),oklch(0.95 0.006 155));
--vibeui-hero-017-muted:light-dark(oklch(0.51 0.014 155),oklch(0.73 0.012 155));
--vibeui-hero-017-line:light-dark(oklch(0.89 0.008 155),oklch(0.37 0.011 155));
--vibeui-hero-017-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.76 0.14 39.8));
--vibeui-hero-017-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-hero-017-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-017-step:2.2s;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-017"]{color-scheme:dark}
[data-vibeui-block="hero-017"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-017-bg);color:var(--vibeui-hero-017-fg);
font-family:var(--vibeui-hero-017-sans);
}
[data-vibeui-block="hero-017"] *{box-sizing:border-box}
[data-vibeui-block="hero-017"] [data-part="shell"]{
max-width:56rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center;
}
[data-vibeui-block="hero-017"] [data-part="eyebrow"]{
margin:0 0 1.25rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-hero-017-accent);
}
[data-vibeui-block="hero-017"] h1{
margin:0;font-size:clamp(2rem,6.2cqi,3.625rem);line-height:1.1;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-017"] [data-part="rotator"]{
display:inline-grid;justify-items:start;vertical-align:bottom;overflow:hidden;
padding:0 0.05em;color:var(--vibeui-hero-017-accent);
}
[data-vibeui-block="hero-017"] [data-part="word"]{
grid-area:1 / 1;white-space:nowrap;opacity:0;transform:translateY(0.4em);
animation-name:vibeui-hero-017-cycle;animation-timing-function:ease-in-out;animation-iteration-count:infinite;
}
@keyframes vibeui-hero-017-cycle{
0%,2%{opacity:0;transform:translateY(0.4em)}
8%,26%{opacity:1;transform:translateY(0)}
32%,100%{opacity:0;transform:translateY(-0.4em)}
}
[data-vibeui-block="hero-017"] [data-part="srwords"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="hero-017"] [data-part="lede"]{
margin:1.25rem auto 0;max-width:36rem;font-size:clamp(0.9375rem,1.6cqi,1.125rem);line-height:1.6;
color:var(--vibeui-hero-017-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-017"] [data-part="actions"]{
display:flex;flex-direction:column;align-items:stretch;gap:0.625rem;margin:2rem auto 0;max-width:22rem;
}
[data-vibeui-block="hero-017"] a{
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
height:2.875rem;padding:0 1.5rem;border-radius:0.625rem;
font-size:0.9375rem;font-weight:600;text-decoration:none;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="hero-017"] [data-part="primary"]{background:var(--vibeui-hero-017-accent);color:var(--vibeui-hero-017-accent-fg);border:1px solid transparent}
[data-vibeui-block="hero-017"] [data-part="primary"]:hover{background:color-mix(in oklab,var(--vibeui-hero-017-accent) 86%,black)}
[data-vibeui-block="hero-017"] [data-part="secondary"]{border:1px solid var(--vibeui-hero-017-line);color:var(--vibeui-hero-017-fg);background:transparent}
[data-vibeui-block="hero-017"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-017-fg)}
[data-vibeui-block="hero-017"] a:focus-visible{outline:2px solid var(--vibeui-hero-017-accent);outline-offset:3px}
@container (min-width: 34rem){
[data-vibeui-block="hero-017"] [data-part="actions"]{flex-direction:row;justify-content:center;max-width:none}
[data-vibeui-block="hero-017"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-017"] [data-part="shell"]{padding:7rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="hero-017"] *{animation:none!important;transition:none!important}
[data-vibeui-block="hero-017"] [data-part="word"]{opacity:0;transform:none}
[data-vibeui-block="hero-017"] [data-part="word"]:first-child{opacity:1}
}
`

const DEFAULT_WORDS = ["лендинги", "каталоги", "дашборды", "витрины"]

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
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

/** Hero с заголовком, в котором одно слово циклически меняется без JS. */
export function Hero017({
  eyebrow = "Каждую неделю новые секции",
  prefix = "Собираем",
  words = DEFAULT_WORDS,
  suffix = "без вёрстки с нуля",
  lede = "Выбираете секцию в каталоге, отдаёте инструкцию своему ИИ-агенту — получаете страницу, а не заготовку под переделку.",
  primary = { label: "Смотреть каталог", href: "#" },
  secondary = { label: "Как это работает", href: "#" },
  accent,
  background = "",
  className,
  style,
}: Hero017Props) {
  const list = words.slice(0, 6)
  const palette = {
    ...(accent ? { "--vibeui-hero-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-017"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h1>
            {prefix ? `${prefix} ` : null}
            <span data-part="rotator" aria-hidden="true">
              {list.map((word, index) => (
                <span
                  key={word}
                  data-part="word"
                  style={
                    {
                      animationDuration: `${list.length * 2.2}s`,
                      animationDelay: `${-(index * 2.2)}s`,
                    } as CSSProperties
                  }
                >
                  {word}
                </span>
              ))}
            </span>
            <span data-part="srwords">{list.join(", ")}</span>
            {suffix ? ` ${suffix}` : null}
          </h1>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="actions">
            <a data-part="primary" href={primary.href}>
              {primary.label}
            </a>
            <a data-part="secondary" href={secondary.href}>
              {secondary.label}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
