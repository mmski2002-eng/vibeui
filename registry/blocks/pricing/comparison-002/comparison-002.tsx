import type { CSSProperties } from "react"

type Comparison002Plan = {
  name: string
  tagline: string
  points: string[]
  highlight?: boolean
}

export type Comparison002Props = {
  eyebrow?: string
  title?: string
  plans?: Comparison002Plan[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сравнение тремя колонками-подходами: свой способ выделен брендовой рамкой
// и стоит по центру, соседи приглушены. Каждая колонка — название подхода,
// строчка сути и список пунктов. Формат «три пути, один правильный» без
// таблицы галочек — когда сравниваются целые подходы, а не поля.
const STYLES = `
:where([data-vibeui-block="comparison-002"]){
--vibeui-comparison-002-bg:transparent;
--vibeui-comparison-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-comparison-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-comparison-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-comparison-002-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-comparison-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-comparison-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-002"]{color-scheme:dark}
[data-vibeui-block="comparison-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-comparison-002-bg);color:var(--vibeui-comparison-002-ink);
font-family:var(--vibeui-comparison-002-font);
}
[data-vibeui-block="comparison-002"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="comparison-002"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-comparison-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-align:center}
[data-vibeui-block="comparison-002"] [data-part="title"]{margin:0 0 2.25rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;text-align:center}
[data-vibeui-block="comparison-002"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="comparison-002"] [data-part="plan"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.75rem;
padding:1.5rem;border:1px solid var(--vibeui-comparison-002-border);border-radius:1.125rem;
background:var(--vibeui-comparison-002-card);
}
[data-vibeui-block="comparison-002"] [data-part="plan"][data-highlight="true"]{
border-color:var(--vibeui-comparison-002-accent);
box-shadow:0 0 0 1px var(--vibeui-comparison-002-accent);
}
[data-vibeui-block="comparison-002"] [data-part="plan"]:not([data-highlight="true"]){opacity:.82}
[data-vibeui-block="comparison-002"] [data-part="name"]{margin:0;font-size:1.125rem;font-weight:700}
[data-vibeui-block="comparison-002"] [data-part="tagline"]{margin:0;color:var(--vibeui-comparison-002-muted);font-size:0.875rem;line-height:1.45}
[data-vibeui-block="comparison-002"] [data-part="points"]{list-style:none;margin:0.5rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="comparison-002"] [data-part="point"]{position:relative;padding-left:1.25rem;font-size:0.9375rem;line-height:1.5}
[data-vibeui-block="comparison-002"] [data-part="point"]::before{content:"";position:absolute;left:0.1875rem;top:0.5rem;width:0.5rem;height:0.5rem;border-radius:999px;background:var(--vibeui-comparison-002-accent);color:oklch(from var(--vibeui-comparison-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@container (min-width: 48rem){
[data-vibeui-block="comparison-002"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="comparison-002"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Comparison002Plan[] = [
  {
    name: "Написать с нуля",
    tagline: "Агент лепит похожий компонент по описанию",
    points: [
      "Часы на промпты и правки",
      "Разъезжающийся дизайн",
      "Нет доступности",
    ],
  },
  {
    name: "VibeUI",
    tagline: "Агент ставит тот же файл из реестра",
    points: [
      "Ноль зависимостей",
      "Инструкция в комплекте",
      "Доступность на месте",
    ],
    highlight: true,
  },
  {
    name: "Обычная библиотека",
    tagline: "Тянет за собой пакет и свою тему",
    points: [
      "Десятки мегабайт зависимостей",
      "Привязка к чужой теме",
      "Ломается при обновлении",
    ],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Сравнение тремя колонками-подходами: свой способ выделен и по центру. */
export function Comparison002({
  eyebrow = "Сравнение подходов",
  title = "Три пути собрать интерфейс",
  plans = DEFAULT_PLANS,
  background = "",
  accent,
  className,
  style,
}: Comparison002Props) {
  const palette = {
    ...(accent ? { "--vibeui-comparison-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-comparison-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-comparison-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="comparison-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {plans.map((plan) => (
              <div
                key={plan.name}
                data-part="plan"
                data-highlight={plan.highlight ? "true" : undefined}
              >
                <h3 data-part="name">{plan.name}</h3>
                <p data-part="tagline">{plan.tagline}</p>
                <ul data-part="points">
                  {plan.points.map((point) => (
                    <li key={point} data-part="point">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
