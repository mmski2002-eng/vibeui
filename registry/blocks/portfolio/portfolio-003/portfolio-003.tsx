import type { CSSProperties } from "react"

type Portfolio003Case = {
  client: string
  title: string
  result: string
}

export type Portfolio003Props = {
  eyebrow?: string
  title?: string
  cases?: Portfolio003Case[]
  linkLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Портфолио кейс-плитками: крупные карточки с клиентом, задачей и метрикой
// результата, ссылка «читать кейс» проявляется на наведении. Формат витрины
// с упором на результат, а не на картинку: плитки в две колонки, обложка —
// тёплая полоса-акцент сверху.
const STYLES = `
:where([data-vibeui-block="portfolio-003"]){
--vibeui-portfolio-003-bg:transparent;
--vibeui-portfolio-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-portfolio-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-portfolio-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-portfolio-003-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-portfolio-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-portfolio-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-portfolio-003-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="portfolio-003"]{color-scheme:dark}
[data-vibeui-block="portfolio-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-portfolio-003-bg);color:var(--vibeui-portfolio-003-ink);
font-family:var(--vibeui-portfolio-003-font);
}
[data-vibeui-block="portfolio-003"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="portfolio-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-portfolio-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="portfolio-003"] [data-part="title"]{margin:0 0 2rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="portfolio-003"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="portfolio-003"] [data-part="case"]{
min-inline-size:0;display:flex;flex-direction:column;gap:0.75rem;overflow:hidden;text-decoration:none;color:inherit;
border:1px solid var(--vibeui-portfolio-003-border);border-radius:1.125rem;background:var(--vibeui-portfolio-003-card);
transition:transform var(--vibeui-portfolio-003-dur-2) ease,border-color var(--vibeui-portfolio-003-dur-2) ease;
}
[data-vibeui-block="portfolio-003"] [data-part="case"]:hover{transform:translateY(-3px);border-color:var(--vibeui-portfolio-003-accent)}
[data-vibeui-block="portfolio-003"] [data-part="case"]:focus-visible{outline:2px solid var(--vibeui-portfolio-003-accent);outline-offset:2px}
[data-vibeui-block="portfolio-003"] [data-part="bar"]{height:0.375rem;background:linear-gradient(90deg,light-dark(oklch(0.2 0 0),oklch(0.92 0 0)),oklch(0.5 0.15 25))}
[data-vibeui-block="portfolio-003"] [data-part="body"]{display:flex;flex-direction:column;gap:0.625rem;padding:0 1.5rem 1.5rem}
[data-vibeui-block="portfolio-003"] [data-part="client"]{font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-portfolio-003-muted)}
[data-vibeui-block="portfolio-003"] [data-part="case-title"]{margin:0;font-size:1.1875rem;font-weight:700;line-height:1.25}
[data-vibeui-block="portfolio-003"] [data-part="result"]{font-size:1.5rem;font-weight:750;color:var(--vibeui-portfolio-003-accent);line-height:1.1}
[data-vibeui-block="portfolio-003"] [data-part="link"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:0.25rem;
font-size:0.875rem;font-weight:650;color:var(--vibeui-portfolio-003-accent);
opacity:0;transform:translateX(-4px);transition:opacity var(--vibeui-portfolio-003-dur-2) ease,transform var(--vibeui-portfolio-003-dur-2) ease;
}
[data-vibeui-block="portfolio-003"] [data-part="case"]:hover [data-part="link"],
[data-vibeui-block="portfolio-003"] [data-part="case"]:focus-visible [data-part="link"]{opacity:1;transform:translateX(0)}
@container (min-width: 40rem){
[data-vibeui-block="portfolio-003"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="portfolio-003"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="portfolio-003"] *{animation:none!important;transition:none!important}
[data-vibeui-block="portfolio-003"] [data-part="link"]{opacity:1;transform:none}}
`

const DEFAULT_CASES: Portfolio003Case[] = [
  {
    client: "Финпилот",
    title: "Собрали лендинг тарифов за один спринт",
    result: "−60% времени",
  },
  {
    client: "Кедр Маркет",
    title: "Переехали на собственный сайт без фронтендера",
    result: "×3 конверсия",
  },
  {
    client: "Полдень",
    title: "Промо запуска лампы под кампанию",
    result: "12 тыс. предзаказов",
  },
  {
    client: "Курс.Лаб",
    title: "Методисты сами запускают посадочные",
    result: "8 страниц в неделю",
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

/** Портфолио кейс-плитками с метрикой результата и ссылкой по наведению. */
export function Portfolio003({
  eyebrow = "Кейсы",
  title = "Работы с измеримым результатом",
  cases = DEFAULT_CASES,
  linkLabel = "Читать кейс",
  background = "",
  accent,
  className,
  style,
}: Portfolio003Props) {
  const palette = {
    ...(accent ? { "--vibeui-portfolio-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-portfolio-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-portfolio-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="portfolio-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {cases.map((item) => (
              <a key={item.title} href="#" data-part="case">
                <span data-part="bar" aria-hidden="true" />
                <span data-part="body">
                  <span data-part="client">{item.client}</span>
                  <span data-part="result">{item.result}</span>
                  <span data-part="case-title">{item.title}</span>
                  <span data-part="link">
                    {linkLabel}
                    <span aria-hidden="true">→</span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
