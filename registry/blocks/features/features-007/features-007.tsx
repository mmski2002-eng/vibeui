import type { CSSProperties } from "react"

export type Features007Step = {
  title: string
  description: string
  detail: string
}

export type Features007Props = {
  eyebrow?: string
  title?: string
  steps?: Features007Step[]
  action?: { label: string; href: string }
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: «как это работает» на соединительной линии. Кружки с номерами
// стоят на общей направляющей: линия нарисована фоном контейнера и обрезана
// маской по краям, поэтому она не торчит за первый и последний шаг. На узкой
// ширине направляющая становится вертикальной — тот же приём, другая ось.
// Шаги — <ol>, а не набор карточек: порядок важен, и он должен читаться
// голосом скринридера, а не только глазами.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Тёмная ветка — не
// инверсия светлой: направляющая и рамка детали там светлее фона, акцент
// светлеет, а текст на нём становится тёмным.
const STYLES = `
:where([data-vibeui-block="features-007"]){
--vibeui-features-007-bg:transparent;
--vibeui-features-007-fg:light-dark(oklch(0.2 0 285),oklch(0.95 0 285));
--vibeui-features-007-muted:light-dark(oklch(0.51 0 285),oklch(0.72 0 285));
--vibeui-features-007-card:light-dark(oklch(1 0 0),oklch(0.25 0 285));
--vibeui-features-007-line:light-dark(oklch(0.88 0 285),oklch(0.36 0 285));
--vibeui-features-007-accent:light-dark(oklch(0.52 0.18 39.8),oklch(0.72 0.16 39.8));
--vibeui-features-007-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-features-007-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="features-007"]{color-scheme:dark}
[data-vibeui-block="features-007"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-features-007-bg);color:var(--vibeui-features-007-fg);
font-family:var(--vibeui-features-007-sans);
}
[data-vibeui-block="features-007"] *{box-sizing:border-box}
[data-vibeui-block="features-007"] [data-part="shell"]{max-width:66rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-007"] [data-part="eyebrow"]{
margin:0 0 0.75rem;text-align:center;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-007-accent);
}
[data-vibeui-block="features-007"] h2{
margin:0 auto;max-width:22ch;text-align:center;
font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-007"] ol{
list-style:none;margin:2.75rem 0 0;padding:0;display:grid;grid-template-columns:1fr;gap:1.75rem;position:relative;
}
[data-vibeui-block="features-007"] [data-part="step"]{position:relative;padding-left:3.25rem}
[data-vibeui-block="features-007"] [data-part="step"]::before{
content:"";position:absolute;left:1.1875rem;top:2.5rem;bottom:-1.75rem;width:1px;
background:var(--vibeui-features-007-line);
}
[data-vibeui-block="features-007"] [data-part="step"]:last-child::before{display:none}
[data-vibeui-block="features-007"] [data-part="num"]{
position:absolute;left:0;top:0;width:2.375rem;height:2.375rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:var(--vibeui-features-007-accent);color:var(--vibeui-features-007-accent-fg);
font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="features-007"] h3{margin:0.375rem 0 0;font-size:1.0625rem;font-weight:650;letter-spacing:-0.01em}
[data-vibeui-block="features-007"] [data-part="desc"]{
margin:0.5rem 0 0;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-features-007-muted);text-wrap:pretty;
}
[data-vibeui-block="features-007"] [data-part="detail"]{
display:block;margin-top:0.875rem;padding:0.625rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-features-007-line);background:var(--vibeui-features-007-card);
font-size:0.8125rem;color:var(--vibeui-features-007-muted);
}
[data-vibeui-block="features-007"] [data-part="action"]{
display:flex;justify-content:center;margin-top:2.5rem;
}
[data-vibeui-block="features-007"] a{
display:inline-flex;align-items:center;justify-content:center;height:2.75rem;padding:0 1.5rem;border-radius:0.625rem;
background:var(--vibeui-features-007-accent);color:var(--vibeui-features-007-accent-fg);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color .16s ease;
}
[data-vibeui-block="features-007"] a:hover{background:light-dark(color-mix(in oklab,var(--vibeui-features-007-accent) 86%,black),color-mix(in oklab,var(--vibeui-features-007-accent) 86%,white))}
[data-vibeui-block="features-007"] a:focus-visible{outline:2px solid var(--vibeui-features-007-accent);outline-offset:3px}
@container (min-width: 34rem){
[data-vibeui-block="features-007"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="features-007"] ol{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem;margin-top:3.5rem}
[data-vibeui-block="features-007"] [data-part="step"]{padding-left:0;padding-top:3.25rem}
[data-vibeui-block="features-007"] [data-part="step"]::before{left:2.375rem;right:-2rem;top:1.1875rem;bottom:auto;width:auto;height:1px}
[data-vibeui-block="features-007"] h3{margin-top:0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Features007Step[] = [
  {
    title: "Выберите секцию",
    description:
      "Каталог показывает живое превью на двух подложках и трёх ширинах — решение принимается глазами.",
    detail: "Фильтр по категории, тегу и светлой или тёмной подложке",
  },
  {
    title: "Скопируйте инструкцию",
    description:
      "Copy for AI собирает промпт из metadata: идентификатор, команда установки и границы допустимых правок.",
    detail: "npx shadcn@latest add https://vibeui.dev/r/features-007.json",
  },
  {
    title: "Отдайте агенту",
    description:
      "Агент ставит файл, подставляет ваши тексты и не трогает вёрстку. Проверять остаётся только контент.",
    detail: "Секция появляется в components/vibeui и работает сразу",
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

/** Блок «как это работает» в три шага: номера на соединительной линии. */
export function Features007({
  eyebrow = "Как это работает",
  title = "От каталога до страницы — три шага",
  steps = DEFAULT_STEPS,
  action = { label: "Попробовать на своём проекте", href: "#" },
  background = "",
  accent,
  className,
  style,
}: Features007Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-features-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>

          <ol>
            {steps.slice(0, 3).map((step, index) => (
              <li key={step.title} data-part="step">
                <span data-part="num" aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{step.title}</h3>
                <p data-part="desc">{step.description}</p>
                <span data-part="detail">{step.detail}</span>
              </li>
            ))}
          </ol>

          {action ? (
            <div data-part="action">
              <a href={action.href}>{action.label}</a>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
