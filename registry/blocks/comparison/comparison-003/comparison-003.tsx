import type { CSSProperties } from "react"

type Comparison003Pair = {
  label: string
  before: string
  after: string
}

export type Comparison003Props = {
  eyebrow?: string
  title?: string
  beforeLabel?: string
  afterLabel?: string
  pairs?: Comparison003Pair[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сравнение «до и после»: строки метрик с двумя значениями и стрелкой между
// ними. Колонка «после» — брендовым акцентом, «до» приглушена. Формат
// результата миграции или улучшения: показывает не набор галочек, а
// изменение чисел от было к стало.
const STYLES = `
:where([data-vibeui-block="comparison-003"]){
--vibeui-comparison-003-bg:transparent;
--vibeui-comparison-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-comparison-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-comparison-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-comparison-003-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-comparison-003-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-comparison-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="comparison-003"]{color-scheme:dark}
[data-vibeui-block="comparison-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-comparison-003-bg);color:var(--vibeui-comparison-003-ink);
font-family:var(--vibeui-comparison-003-font);
}
[data-vibeui-block="comparison-003"] [data-part="shell"]{max-width:48rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="comparison-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-comparison-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;text-align:center}
[data-vibeui-block="comparison-003"] [data-part="title"]{margin:0 0 2.25rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;text-align:center}
[data-vibeui-block="comparison-003"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="comparison-003"] [data-part="row"]{
padding:1.125rem;border:1px solid var(--vibeui-comparison-003-border);border-radius:1rem;
background:var(--vibeui-comparison-003-card);
}
[data-vibeui-block="comparison-003"] [data-part="label"]{margin:0 0 0.625rem;font-size:0.8125rem;font-weight:600;color:var(--vibeui-comparison-003-muted);letter-spacing:0.02em;text-transform:uppercase}
[data-vibeui-block="comparison-003"] [data-part="pair"]{display:grid;grid-template-columns:1fr auto 1fr;gap:0.75rem;align-items:center}
[data-vibeui-block="comparison-003"] [data-part="before"]{font-size:1.0625rem;font-weight:600;color:var(--vibeui-comparison-003-muted);text-decoration:line-through;text-decoration-color:color-mix(in oklab,var(--vibeui-comparison-003-muted) 50%,transparent)}
[data-vibeui-block="comparison-003"] [data-part="arrow"]{color:var(--vibeui-comparison-003-accent);font-size:1.125rem;line-height:1}
[data-vibeui-block="comparison-003"] [data-part="after"]{font-size:1.25rem;font-weight:750;color:var(--vibeui-comparison-003-accent);text-align:right}
@container (min-width: 40rem){[data-vibeui-block="comparison-003"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="comparison-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PAIRS: Comparison003Pair[] = [
  { label: "Время на сборку страницы", before: "1 неделя", after: "1 вечер" },
  { label: "Зависимости на компонент", before: "12+", after: "0" },
  { label: "Правок после установки", before: "Десятки", after: "Ноль" },
  { label: "Размер бандла блока", before: "40 МБ", after: "1 файл" },
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

/** Сравнение «до и после»: строки метрик с было → стало и стрелкой. */
export function Comparison003({
  eyebrow = "До и после",
  title = "Что меняется с VibeUI",
  beforeLabel = "Было",
  afterLabel = "Стало",
  pairs = DEFAULT_PAIRS,
  background = "",
  accent,
  className,
  style,
}: Comparison003Props) {
  const palette = {
    ...(accent ? { "--vibeui-comparison-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-comparison-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-comparison-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="comparison-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ul data-part="list">
            {pairs.map((pair) => (
              <li key={pair.label} data-part="row">
                <p data-part="label">{pair.label}</p>
                <div data-part="pair">
                  <span data-part="before" aria-label={`${beforeLabel}: ${pair.before}`}>
                    {pair.before}
                  </span>
                  <span data-part="arrow" aria-hidden="true">
                    →
                  </span>
                  <span data-part="after" aria-label={`${afterLabel}: ${pair.after}`}>
                    {pair.after}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
