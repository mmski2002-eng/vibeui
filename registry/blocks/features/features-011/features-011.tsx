import type { CSSProperties } from "react"

export type Features011Props = {
  eyebrow?: string
  headline?: string
  main?: {
    title: string
    description: string
    metric: string
    metricLabel: string
    action: { label: string; href: string }
  }
  minor?: { title: string; description: string }[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  accentForeground?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: одно преимущество главнее остальных, и секция это признаёт.
// Верх занимает полоса, залитая акцентом, — в ней живёт единственное
// утверждение с числом и кнопкой. Остальные преимущества уходят вниз в
// четыре узкие колонки нейтральным текстом: они поддерживают главное, а не
// конкурируют с ним. Кнопка на залитой полосе инвертирована в цвет фона
// секции — на плотном фоне это единственный способ удержать контраст.
//
// Тема берётся из color-scheme окружения через light-dark(): секция темнеет
// вместе с контекстом и не выкладывает под себя плашку. Кнопка на полосе
// инвертирована в accent-fg, а не в фон секции: фон по умолчанию прозрачный,
// и на залитой полосе кнопка иначе исчезла бы. Полоса остаётся плотной в обеих
// темах — светлеет она ровно настолько, чтобы не проваливаться в тёмный фон.
const STYLES = `
:where([data-vibeui-block="features-011"]){
--vibeui-features-011-bg:transparent;
--vibeui-features-011-fg:light-dark(oklch(0.2 0.014 20),oklch(0.95 0.006 20));
--vibeui-features-011-muted:light-dark(oklch(0.51 0.014 20),oklch(0.72 0.014 20));
--vibeui-features-011-line:light-dark(oklch(0.89 0.008 20),oklch(0.35 0.012 20));
--vibeui-features-011-accent:light-dark(oklch(0.5 0.17 22),oklch(0.56 0.18 22));
--vibeui-features-011-accent-fg:oklch(0.99 0.004 20);
--vibeui-features-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="features-011"]{
box-sizing:border-box;background:var(--vibeui-features-011-bg);color:var(--vibeui-features-011-fg);
font-family:var(--vibeui-features-011-sans);
}
[data-vibeui-block="features-011"] *{box-sizing:border-box}
[data-vibeui-block="features-011"] [data-part="shell"]{max-width:70rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="features-011"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-features-011-accent);
}
[data-vibeui-block="features-011"] [data-part="headline"]{
margin:0 0 2rem;max-width:26ch;font-size:clamp(1.5rem,4.2cqi,2.375rem);line-height:1.12;
letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="features-011"] [data-part="main"]{
display:grid;grid-template-columns:1fr;gap:1.75rem;padding:2rem 1.5rem;border-radius:1.25rem;
background:var(--vibeui-features-011-accent);color:var(--vibeui-features-011-accent-fg);
}
[data-vibeui-block="features-011"] h3{margin:0;font-size:clamp(1.375rem,3.4cqi,2rem);line-height:1.14;letter-spacing:-0.02em;font-weight:700;text-wrap:balance}
[data-vibeui-block="features-011"] [data-part="maindesc"]{
margin:0.875rem 0 0;max-width:38rem;font-size:0.9375rem;line-height:1.6;opacity:.88;text-wrap:pretty;
}
[data-vibeui-block="features-011"] a{
display:inline-flex;align-items:center;justify-content:center;margin-top:1.5rem;height:2.75rem;padding:0 1.5rem;
border-radius:0.625rem;background:var(--vibeui-features-011-accent-fg);color:var(--vibeui-features-011-accent);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease;
}
[data-vibeui-block="features-011"] a:hover{opacity:.9}
[data-vibeui-block="features-011"] a:focus-visible{outline:2px solid var(--vibeui-features-011-accent-fg);outline-offset:3px}
[data-vibeui-block="features-011"] [data-part="metricbox"]{
display:flex;flex-direction:column;justify-content:center;padding-top:1.5rem;
border-top:1px solid color-mix(in oklab,var(--vibeui-features-011-accent-fg) 30%,transparent);
}
[data-vibeui-block="features-011"] [data-part="metric"]{
font-size:clamp(2.75rem,8cqi,4.5rem);line-height:0.95;font-weight:700;letter-spacing:-0.05em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="features-011"] [data-part="metriclabel"]{margin-top:0.5rem;font-size:0.8125rem;opacity:.85;max-width:20ch}
[data-vibeui-block="features-011"] [data-part="minor"]{
list-style:none;margin:2rem 0 0;padding:0;display:grid;grid-template-columns:1fr;gap:1.5rem;
}
[data-vibeui-block="features-011"] [data-part="minor"] li{padding-top:1rem;border-top:1px solid var(--vibeui-features-011-line)}
[data-vibeui-block="features-011"] h4{margin:0;font-size:0.9375rem;font-weight:650;letter-spacing:-0.005em}
[data-vibeui-block="features-011"] [data-part="minor"] p{margin:0.375rem 0 0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-features-011-muted)}
@container (min-width: 34rem){
[data-vibeui-block="features-011"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="features-011"] [data-part="minor"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.75rem 2rem}
[data-vibeui-block="features-011"] [data-part="main"]{padding:2.5rem}
}
@container (min-width: 60rem){
[data-vibeui-block="features-011"] [data-part="main"]{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:3rem;padding:3rem}
[data-vibeui-block="features-011"] [data-part="metricbox"]{padding-top:0;border-top:0;border-left:1px solid color-mix(in oklab,var(--vibeui-features-011-accent-fg) 30%,transparent);padding-left:2.5rem}
[data-vibeui-block="features-011"] [data-part="minor"]{grid-template-columns:repeat(4,minmax(0,1fr));margin-top:2.5rem}
[data-vibeui-block="features-011"] [data-part="shell"]{padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="features-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MAIN = {
  title: "Секция выглядит так же, как в каталоге — всегда",
  description:
    "Превью рендерит тот же файл, который приезжает к вам. Это не маркетинговое обещание, а устройство реестра: отдельной демо-копии просто не существует.",
  metric: "1:1",
  metricLabel: "совпадение превью и поставки",
  action: { label: "Проверить на любой секции", href: "#" },
}

const DEFAULT_MINOR = [
  {
    title: "Ноль зависимостей",
    description:
      "Ни иконочных пакетов, ни motion-библиотек: только React и CSS внутри файла.",
  },
  {
    title: "Своя палитра",
    description:
      "Цвета живут в переменных секции и не читают токены вашей темы.",
  },
  {
    title: "Раскладка от блока",
    description:
      "Container queries считают ширину секции, поэтому в сайдбаре вёрстка честная.",
  },
  {
    title: "Инструкция для агента",
    description:
      "К каждой секции приложен список того, что нельзя ломать, и того, что можно менять.",
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

/** Преимущества с акцентом на главном: залитая полоса сверху, четыре второстепенных снизу. */
export function Features011({
  eyebrow = "Почему это работает",
  headline = "Одно преимущество важнее остальных четырёх вместе взятых",
  main = DEFAULT_MAIN,
  minor = DEFAULT_MINOR,
  background = "",
  accent,
  accentForeground,
  className,
  style,
}: Features011Props) {
  const palette = {
    ...(accent ? { "--vibeui-features-011-accent": accent } : null),
    ...(accentForeground
      ? { "--vibeui-features-011-accent-fg": accentForeground }
      : null),
    ...(background
      ? {
          "--vibeui-features-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-features-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="features-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="headline">{headline}</h2>

          <article data-part="main">
            <div>
              <h3>{main.title}</h3>
              <p data-part="maindesc">{main.description}</p>
              <a href={main.action.href}>{main.action.label}</a>
            </div>
            <p data-part="metricbox">
              <span data-part="metric">{main.metric}</span>
              <span data-part="metriclabel">{main.metricLabel}</span>
            </p>
          </article>

          <ul data-part="minor">
            {minor.slice(0, 4).map((item) => (
              <li key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
