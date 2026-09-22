import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Case003Item = {
  client: string
  metric: string
  before: string
  after: string
  delta: string
}

export type Case003Props = {
  eyebrow?: string
  title?: string
  items?: Case003Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Кейсы «до и после»: пара значений с явной стрелкой между ними и подписью
// роста. Формат «было → стало» убедительнее любой одиночной цифры — он
// показывает базу сравнения, без которой «+133%» ничего не значит. «Было»
// намеренно приглушено, «стало» — акцентом: взгляд идёт по стрелке.
const STYLES = `[data-vibeui-block="case-003"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="case-003"]){
--vibeui-case-003-bg:transparent;
--vibeui-case-003-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-case-003-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-case-003-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-case-003-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-case-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-case-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="case-003"]{color-scheme:dark}
[data-vibeui-block="case-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-case-003-bg);color:var(--vibeui-case-003-ink);
font-family:var(--vibeui-case-003-font);
}
[data-vibeui-block="case-003"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="case-003"] [data-part="grid"]{
display:grid;gap:1rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="case-003"] [data-part="card"]{
min-inline-size:0;
display:flex;flex-direction:column;gap:1rem;
padding:1.5rem;border:1px solid var(--vibeui-case-003-border);border-radius:1.125rem;
background:var(--vibeui-case-003-card);
}
[data-vibeui-block="case-003"] [data-part="head"]{display:grid;gap:0.25rem}
[data-vibeui-block="case-003"] [data-part="client"]{
color:var(--vibeui-case-003-muted);font-size:0.75rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="case-003"] [data-part="metric"]{font-size:1.0625rem;font-weight:650;line-height:1.3}
[data-vibeui-block="case-003"] [data-part="pair"]{
display:flex;align-items:baseline;gap:0.75rem;flex-wrap:wrap;
margin-top:auto;padding-top:1rem;border-top:1px dashed var(--vibeui-case-003-border);
}
[data-vibeui-block="case-003"] [data-part="before"]{
color:var(--vibeui-case-003-muted);text-decoration:line-through;
text-decoration-color:color-mix(in oklab,var(--vibeui-case-003-muted) 60%,transparent);
font-size:1.125rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="case-003"] [data-part="arrow"]{
color:var(--vibeui-case-003-accent);flex:none;align-self:center;display:inline-flex;
}
[data-vibeui-block="case-003"] [data-part="after"]{
color:var(--vibeui-case-003-accent);
font-size:clamp(1.5rem,4cqi,1.875rem);line-height:1;letter-spacing:-0.02em;font-weight:750;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="case-003"] [data-part="delta"]{
display:inline-flex;align-items:center;gap:0.3125rem;align-self:flex-start;
padding:0.25rem 0.625rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-case-003-accent) 12%,var(--vibeui-case-003-card));
color:var(--vibeui-case-003-accent);
font-size:0.75rem;font-weight:700;
}
@container (min-width: 44rem){
[data-vibeui-block="case-003"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="case-003"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="case-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Case003Item[] = [
  {
    client: "Кедр Маркет",
    metric: "Запуск посадочной страницы",
    before: "2 недели",
    after: "1 вечер",
    delta: "в 14 раз быстрее",
  },
  {
    client: "Финпилот",
    metric: "Заявки с лендинга тарифов",
    before: "90 в месяц",
    after: "210 в месяц",
    delta: "+133% заявок",
  },
  {
    client: "Курс.Лаб",
    metric: "Стоимость одной страницы",
    before: "45 000 ₽",
    after: "8 000 ₽",
    delta: "−82% расходов",
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

/** Кейсы «до и после»: пара значений «было → стало» со стрелкой и подписью роста. */
export function Case003({
  eyebrow = "До и после",
  title = "Что меняется после перехода на VibeUI",
  items = DEFAULT_ITEMS,
  background = "",
  accent,
  className,
  style,
}: Case003Props) {
  const palette = {
    ...(accent ? { "--vibeui-case-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-case-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-case-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="case-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <Heading001
            data-part="heading"
            eyebrow={eyebrow}
            title={title}
            accent={accent}
          />
          <ul data-part="grid">
            {items.map((item) => (
              <li key={item.client + item.metric} data-part="card">
                <p data-part="head">
                  <span data-part="client">{item.client}</span>
                  <span data-part="metric">{item.metric}</span>
                </p>
                <p data-part="pair">
                  <span data-part="before">{item.before}</span>
                  <span data-part="arrow" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </span>
                  <span data-part="after">{item.after}</span>
                </p>
                <p data-part="delta">
                  <svg
                    aria-hidden="true"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M9 7h8v8" />
                  </svg>
                  {item.delta}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
