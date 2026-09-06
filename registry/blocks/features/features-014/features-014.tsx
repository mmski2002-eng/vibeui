import type { CSSProperties } from "react"

export type Features014Props = {
  quote?: string
  authorName?: string
  authorRole?: string
  company?: string
  metric?: { value: string; label: string; note: string }
  supporting?: { value: string; label: string }[]
  action?: { label: string; href: string }
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: цитата, подпёртая цифрой. Крупная реплика клиента слева и
// один измеримый результат справа — вместе они работают лучше, чем каждый
// по отдельности: цитата даёт доверие, метрика даёт основание. Разметка —
// <figure> с <blockquote> и <figcaption>: подпись формально связана с
// цитатой, а не просто лежит под ней. Кавычка нарисована псевдоэлементом
// и вынесена в поле, поэтому первая строка не съезжает вправо.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Тёмная ветка — не
// инверсия светлой: панель там светлее фона, рамка светлее панели, а тёплый
// акцент поднимается по светлоте, чтобы крупное число осталось читаемым.
const STYLES = `
:where([data-vibeui-block="features-014"]){
--vibeui-features-014-bg:transparent;
--vibeui-features-014-fg:light-dark(oklch(0.19 0.014 60),oklch(0.95 0.008 60));
--vibeui-features-014-muted:light-dark(oklch(0.49 0.016 60),oklch(0.73 0.014 60));
--vibeui-features-014-line:light-dark(oklch(0.87 0.014 60),oklch(0.36 0.014 60));
--vibeui-features-014-panel:light-dark(oklch(1 0 0),oklch(0.24 0.014 60));
--vibeui-features-014-accent:light-dark(oklch(0.55 0.14 39.8),oklch(0.78 0.12 39.8));
--vibeui-features-014-serif:ui-serif,Georgia,"Iowan Old Style","Times New Roman",serif;
--vibeui-features-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-014"]{color-scheme:dark}
[data-vibeui-block="features-014"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-014-bg);color:var(--vibeui-features-014-fg);
font-family:var(--vibeui-features-014-sans);
}
[data-vibeui-block="features-014"] *{box-sizing:border-box}
[data-vibeui-block="features-014"] [data-part="shell"]{
max-width:68rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:1fr;gap:2.5rem;align-items:center;
}
[data-vibeui-block="features-014"] figure{margin:0;position:relative}
[data-vibeui-block="features-014"] blockquote{
margin:0;font-family:var(--vibeui-features-014-serif);font-weight:400;
font-size:clamp(1.375rem,4cqi,2.25rem);line-height:1.22;letter-spacing:-0.02em;text-wrap:pretty;
}
[data-vibeui-block="features-014"] blockquote::before{
content:"«";position:absolute;left:-0.6em;top:-0.1em;font-size:clamp(2.5rem,7cqi,4rem);line-height:1;
color:var(--vibeui-features-014-accent);opacity:.35;
}
[data-vibeui-block="features-014"] figcaption{
display:flex;align-items:center;gap:0.75rem;margin-top:1.75rem;padding-top:1.25rem;
border-top:1px solid var(--vibeui-features-014-line);
}
[data-vibeui-block="features-014"] [data-part="face"]{
flex:0 0 auto;width:2.75rem;height:2.75rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:color-mix(in oklab,var(--vibeui-features-014-accent) 16%,transparent);
color:var(--vibeui-features-014-accent);font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="features-014"] [data-part="name"]{display:block;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="features-014"] [data-part="role"]{display:block;margin-top:0.125rem;font-size:0.8125rem;color:var(--vibeui-features-014-muted)}
[data-vibeui-block="features-014"] [data-part="panel"]{
padding:1.75rem;border-radius:1.25rem;border:1px solid var(--vibeui-features-014-line);
background:var(--vibeui-features-014-panel);
}
[data-vibeui-block="features-014"] [data-part="value"]{
display:block;font-size:clamp(2.75rem,9cqi,4.25rem);line-height:0.95;font-weight:700;letter-spacing:-0.05em;
color:var(--vibeui-features-014-accent);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="features-014"] [data-part="label"]{display:block;margin-top:0.75rem;font-size:1rem;font-weight:650}
[data-vibeui-block="features-014"] [data-part="note"]{margin:0.375rem 0 0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-features-014-muted)}
[data-vibeui-block="features-014"] dl{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:1.5rem 0 0;padding-top:1.25rem;
border-top:1px solid var(--vibeui-features-014-line);
}
[data-vibeui-block="features-014"] dd{margin:0;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="features-014"] dt{margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-features-014-muted)}
[data-vibeui-block="features-014"] [data-part="pair"]{display:flex;flex-direction:column-reverse}
[data-vibeui-block="features-014"] a{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:1.5rem;
font-size:0.875rem;font-weight:650;color:var(--vibeui-features-014-accent);text-decoration:none;
transition:gap .16s ease;
}
[data-vibeui-block="features-014"] a:hover{gap:0.625rem}
[data-vibeui-block="features-014"] a:focus-visible{outline:2px solid var(--vibeui-features-014-accent);outline-offset:3px}
@container (min-width: 34rem){
[data-vibeui-block="features-014"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 60rem){
[data-vibeui-block="features-014"] [data-part="shell"]{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:4rem;padding:6rem 2.5rem}
[data-vibeui-block="features-014"] [data-part="panel"]{padding:2.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_METRIC = {
  value: "−73 %",
  label: "времени на сборку посадочных",
  note: "Замер по шести кампаниям за квартал: от брифа до опубликованной страницы.",
}

const DEFAULT_SUPPORTING = [
  { value: "14", label: "страниц за квартал" },
  { value: "1", label: "разработчик в команде" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

/** Блок с большой цитатой и метрикой: реплика клиента слева, измеримый результат справа. */
export function Features014({
  quote = "Мы перестали ставить лендинги в очередь к разработке. Маркетолог собирает страницу сам, а разработчик подключается только там, где нужна логика.",
  authorName = "Анна Кравцова",
  authorRole = "Руководитель маркетинга",
  company = "Литера",
  metric = DEFAULT_METRIC,
  supporting = DEFAULT_SUPPORTING,
  action = { label: "Читать историю целиком", href: "#" },
  background = "",
  accent,
  className,
  style,
}: Features014Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <figure>
            <blockquote>{quote}</blockquote>
            <figcaption>
              <span data-part="face" aria-hidden="true">
                {authorName.slice(0, 1)}
              </span>
              <span>
                <span data-part="name">{authorName}</span>
                <span data-part="role">
                  {authorRole}, {company}
                </span>
              </span>
            </figcaption>
          </figure>

          <div data-part="panel">
            <p>
              <span data-part="value">{metric.value}</span>
              <span data-part="label">{metric.label}</span>
            </p>
            <p data-part="note">{metric.note}</p>

            <dl>
              {supporting.slice(0, 2).map((entry) => (
                <div key={entry.label} data-part="pair">
                  <dt>{entry.label}</dt>
                  <dd>{entry.value}</dd>
                </div>
              ))}
            </dl>

            {action ? <a href={action.href}>{action.label} →</a> : null}
          </div>
        </div>
      </section>
    </>
  )
}
