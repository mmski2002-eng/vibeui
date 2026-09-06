import type { CSSProperties } from "react"

export type Features004Row = {
  tag: string
  title: string
  description: string
  points: string[]
}

export type Features004Props = {
  eyebrow?: string
  title?: string
  rows?: Features004Row[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: чередование текст/картинка. Ряды идут змейкой: у чётных
// изображение уезжает в первую колонку через order, а не через отдельную
// вёрстку — разметка у всех рядов одинаковая, и добавить четвёртый ряд можно
// одним элементом массива. Иллюстрации нарисованы градиентами и полосами:
// у каждого ряда свой оттенок, посчитанный сдвигом hue от акцента, поэтому
// картинки различимы, но остаются одной семьёй.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Иллюстрация красится
// прямо в правиле figure, а не через переменную: оттенок ряда приходит
// инлайном, а подстановка var() внутри переменной считается один раз на корне.
const STYLES = `
:where([data-vibeui-block="features-004"]){
--vibeui-features-004-bg:transparent;
--vibeui-features-004-fg:light-dark(oklch(0.2 0 260),oklch(0.95 0 260));
--vibeui-features-004-muted:light-dark(oklch(0.51 0 260),oklch(0.72 0 260));
--vibeui-features-004-line:light-dark(oklch(0.9 0 260),oklch(0.36 0 260));
--vibeui-features-004-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.76 0.14 39.8));
--vibeui-features-004-hue:265;
--vibeui-features-004-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-004"]{color-scheme:dark}
[data-vibeui-block="features-004"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-004-bg);color:var(--vibeui-features-004-fg);
font-family:var(--vibeui-features-004-sans);
}
[data-vibeui-block="features-004"] *{box-sizing:border-box}
[data-vibeui-block="features-004"] [data-part="shell"]{max-width:70rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-004"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-004-accent);
}
[data-vibeui-block="features-004"] h2{
margin:0;max-width:24ch;font-size:clamp(1.5rem,4.2cqi,2.5rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-004"] [data-part="rows"]{display:grid;gap:3rem;margin-top:2.5rem}
[data-vibeui-block="features-004"] [data-part="row"]{display:grid;grid-template-columns:1fr;gap:1.5rem;align-items:center}
[data-vibeui-block="features-004"] [data-part="tag"]{
display:inline-block;margin:0 0 0.75rem;padding:0.1875rem 0.5rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-features-004-accent) 12%,transparent);
color:var(--vibeui-features-004-accent);font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="features-004"] h3{margin:0;font-size:clamp(1.125rem,2.4cqi,1.625rem);line-height:1.2;letter-spacing:-0.02em;font-weight:700}
[data-vibeui-block="features-004"] [data-part="desc"]{
margin:0.75rem 0 0;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-features-004-muted);text-wrap:pretty;
}
[data-vibeui-block="features-004"] ul{list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="features-004"] li{
display:flex;align-items:flex-start;gap:0.5rem;font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="features-004"] [data-part="dash"]{
flex:0 0 auto;margin-top:0.625rem;width:0.75rem;height:1px;background:var(--vibeui-features-004-accent);
}
[data-vibeui-block="features-004"] figure{
margin:0;aspect-ratio:4 / 3;border-radius:1rem;border:1px solid var(--vibeui-features-004-line);
overflow:hidden;position:relative;
background:
linear-gradient(135deg,light-dark(oklch(0.93 0.06 var(--vibeui-features-004-hue)),oklch(0.33 0.06 var(--vibeui-features-004-hue))),light-dark(oklch(0.98 0.01 var(--vibeui-features-004-hue)),oklch(0.25 0.02 var(--vibeui-features-004-hue))));
}
[data-vibeui-block="features-004"] [data-part="bars"]{position:absolute;inset:auto 12% 14% 12%;display:flex;align-items:flex-end;gap:6%;height:46%}
[data-vibeui-block="features-004"] [data-part="bars"] span{
flex:1 1 0;border-radius:0.375rem 0.375rem 0 0;
background:light-dark(oklch(0.62 0.14 var(--vibeui-features-004-hue)),oklch(0.74 0.14 var(--vibeui-features-004-hue)));opacity:.75;
}
[data-vibeui-block="features-004"] [data-part="bars"] span:nth-child(1){height:45%}
[data-vibeui-block="features-004"] [data-part="bars"] span:nth-child(2){height:78%}
[data-vibeui-block="features-004"] [data-part="bars"] span:nth-child(3){height:60%}
[data-vibeui-block="features-004"] [data-part="bars"] span:nth-child(4){height:100%;opacity:1}
[data-vibeui-block="features-004"] [data-part="chip"]{
position:absolute;left:12%;top:14%;padding:0.375rem 0.625rem;border-radius:0.5rem;
background:light-dark(oklch(1 0 0 / 80%),oklch(0.22 0 260 / 80%));border:1px solid var(--vibeui-features-004-line);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-features-004-fg);
}
@container (min-width: 34rem){
[data-vibeui-block="features-004"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="features-004"] [data-part="row"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:3.5rem}
[data-vibeui-block="features-004"] [data-part="rows"]{gap:4.5rem;margin-top:3.5rem}
[data-vibeui-block="features-004"] [data-part="row"]:nth-child(even) figure{order:-1}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Features004Row[] = [
  {
    tag: "Каталог",
    title: "Смотрите секцию, а не её описание",
    description:
      "Превью рендерит тот же файл, который вы получите. Никаких отдельных демо-копий, которые расходятся с поставкой.",
    points: [
      "Живой рендер вместо скриншота",
      "Тёмная и светлая подложка",
      "Мобильная, планшетная и десктопная ширина",
    ],
  },
  {
    tag: "Установка",
    title: "Агент ставит секцию сам",
    description:
      "Copy for AI отдаёт идентификатор, команду и список того, что нельзя переписывать. Дальше работает ваш агент.",
    points: [
      "Совместимо с shadcn-реестром",
      "Зависимости объявлены в metadata",
      "Файл приезжает байт в байт",
    ],
  },
  {
    tag: "Правки",
    title: "Меняются тексты, а не вёрстка",
    description:
      "Контент и бренд-цвета вынесены в пропсы, поэтому редизайн не превращается в переверстку секции.",
    points: [
      "Свои тексты через пропсы",
      "Акцент одной переменной",
      "Анимации и spacing остаются авторскими",
    ],
  },
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

/** Чередование текст/картинка: ряды идут змейкой, иллюстрации нарисованы CSS. */
export function Features004({
  eyebrow = "Как это устроено",
  title = "Три ряда, которые объясняют продукт без демо-звонка",
  rows = DEFAULT_ROWS,
  background = "",
  accent,
  className,
  style,
}: Features004Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <div data-part="rows">
            {rows.slice(0, 4).map((row, index) => (
              <article
                key={row.title}
                data-part="row"
                style={
                  {
                    "--vibeui-features-004-hue": String(265 + index * 42),
                  } as CSSProperties
                }
              >
                <div>
                  <p data-part="tag">{row.tag}</p>
                  <h3>{row.title}</h3>
                  <p data-part="desc">{row.description}</p>
                  <ul>
                    {row.points.slice(0, 4).map((point) => (
                      <li key={point}>
                        <span data-part="dash" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <figure aria-hidden="true">
                  <span data-part="chip">{row.tag}</span>
                  <span data-part="bars">
                    <span />
                    <span />
                    <span />
                    <span />
                  </span>
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
