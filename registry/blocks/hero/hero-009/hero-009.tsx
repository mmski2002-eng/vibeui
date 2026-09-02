import type { CSSProperties } from "react"

export type Hero009Stat = {
  value: string
  unit?: string
  label: string
}

export type Hero009Props = {
  eyebrow?: string
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  stats?: Hero009Stat[]
  footnote?: string
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: hero, который спорит цифрами. Текст слева узкой колонкой, справа
// три счётчика на всю высоту секции — они, а не заголовок, задают ритм.
// Числа набраны tabular-nums, чтобы разряды стояли столбиком, а единица
// измерения вынесена в отдельный span меньшего кегля: «12 400 ₽» не должно
// читаться как одно длинное число. Счётчики разделены линиями, а не карточками.
const STYLES = `
:where([data-vibeui-block="hero-009"]){
--vibeui-hero-009-bg:transparent;
--vibeui-hero-009-fg:light-dark(oklch(0.2 0.014 85),oklch(0.95 0.006 85));
--vibeui-hero-009-muted:light-dark(oklch(0.5 0.014 85),oklch(0.73 0.012 85));
--vibeui-hero-009-line:light-dark(oklch(0.88 0.01 85),oklch(0.37 0.011 85));
--vibeui-hero-009-accent:light-dark(oklch(0.46 0.11 45),oklch(0.72 0.13 45));
--vibeui-hero-009-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.19 0.03 45));
--vibeui-hero-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="hero-009"]{
box-sizing:border-box;background:var(--vibeui-hero-009-bg);color:var(--vibeui-hero-009-fg);
font-family:var(--vibeui-hero-009-sans);
}
[data-vibeui-block="hero-009"] *{box-sizing:border-box}
[data-vibeui-block="hero-009"] [data-part="shell"]{
max-width:72rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:center;
}
[data-vibeui-block="hero-009"] [data-part="eyebrow"]{
margin:0 0 0.875rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-hero-009-accent);
}
[data-vibeui-block="hero-009"] h1{
margin:0;font-size:clamp(1.75rem,5cqi,2.875rem);line-height:1.1;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-009"] [data-part="lede"]{
margin:1rem 0 0;max-width:32rem;font-size:clamp(0.9375rem,1.4cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-hero-009-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-009"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:1.75rem;height:2.75rem;padding:0 1.5rem;
border-radius:0.5rem;background:var(--vibeui-hero-009-accent);color:var(--vibeui-hero-009-accent-fg);
font-size:0.9375rem;font-weight:600;text-decoration:none;transition:background-color .16s ease;
}
[data-vibeui-block="hero-009"] a:hover{background:color-mix(in oklab,var(--vibeui-hero-009-accent) 86%,black)}
[data-vibeui-block="hero-009"] a:focus-visible{outline:2px solid var(--vibeui-hero-009-accent);outline-offset:3px}
[data-vibeui-block="hero-009"] [data-part="stats"]{
margin:0;padding:0;display:grid;grid-template-columns:1fr;border-top:1px solid var(--vibeui-hero-009-line);
}
[data-vibeui-block="hero-009"] [data-part="stat"]{padding:1.25rem 0;border-bottom:1px solid var(--vibeui-hero-009-line)}
[data-vibeui-block="hero-009"] [data-part="stats"] dt{
margin:0;order:2;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-hero-009-muted);max-width:22ch;
}
[data-vibeui-block="hero-009"] [data-part="stats"] dd{
margin:0 0 0.375rem;order:1;display:flex;align-items:baseline;gap:0.25rem;
font-size:clamp(2.25rem,6.5cqi,3.5rem);line-height:1;font-weight:700;letter-spacing:-0.04em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="hero-009"] [data-part="stat"]{display:flex;flex-direction:column}
[data-vibeui-block="hero-009"] [data-part="unit"]{font-size:0.4em;font-weight:650;letter-spacing:0;color:var(--vibeui-hero-009-accent)}
[data-vibeui-block="hero-009"] [data-part="footnote"]{
margin:0.875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-hero-009-muted);
}
@container (min-width: 34rem){
[data-vibeui-block="hero-009"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-009"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem}
[data-vibeui-block="hero-009"] [data-part="stat"]:last-of-type{border-bottom:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS: Hero009Stat[] = [
  { value: "6", unit: "мин", label: "От выбора секции до готовой страницы" },
  { value: "1 080", label: "Готовых секций в каталоге" },
  { value: "97", unit: "%", label: "Установок без ручных правок вёрстки" },
]

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

/** Hero со счётчиками: узкая колонка текста и три крупные цифры на линиях. */
export function Hero009({
  eyebrow = "Цифры за год",
  title = "Меньше вёрстки — больше запусков",
  lede = "Мы считаем не количество компонентов, а время от идеи до опубликованной страницы. Вот что получилось.",
  primary = { label: "Посмотреть каталог", href: "#" },
  stats = DEFAULT_STATS,
  footnote = "Данные за период с января по декабрь, по проектам с включённой телеметрией.",
  accent,
  background = "",
  className,
  style,
}: Hero009Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-009"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <a href={primary.href}>{primary.label}</a>
          </div>

          <div>
            <dl data-part="stats">
              {stats.slice(0, 4).map((stat) => (
                <div key={stat.label} data-part="stat">
                  <dd>
                    {stat.value}
                    {stat.unit ? (
                      <span data-part="unit">{stat.unit}</span>
                    ) : null}
                  </dd>
                  <dt>{stat.label}</dt>
                </div>
              ))}
            </dl>
            {footnote ? <p data-part="footnote">{footnote}</p> : null}
          </div>
        </div>
      </section>
    </>
  )
}
