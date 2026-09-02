import type { CSSProperties } from "react"

export type Cta002Props = {
  eyebrow?: string
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  proof?: string[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Центрированный призыв на две равные кнопки. Так делают, когда у продукта
// два честных входа: «купить» и «сначала посмотреть». Чтобы пара не выглядела
// нерешительностью, вторая кнопка — контурная, а под ними идёт строка коротких
// подтверждений вместо ещё одного абзаца.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, карточка темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="cta-002"]){
--vibeui-cta-002-bg:transparent;
--vibeui-cta-002-card:light-dark(oklch(1 0 0),oklch(0.24 0.014 265));
--vibeui-cta-002-ink:light-dark(oklch(0.21 0.016 250),oklch(0.95 0.005 250));
--vibeui-cta-002-muted:light-dark(oklch(0.5 0.016 250),oklch(0.72 0.012 250));
--vibeui-cta-002-border:light-dark(oklch(0.9 0.008 250),oklch(0.35 0.014 250));
--vibeui-cta-002-accent:light-dark(oklch(0.52 0.19 265),oklch(0.72 0.16 265));
--vibeui-cta-002-accent-fg:light-dark(oklch(0.99 0 0),oklch(0.17 0.03 265));
--vibeui-cta-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="cta-002"]{
display:block;background:var(--vibeui-cta-002-bg);color:var(--vibeui-cta-002-ink);
font-family:var(--vibeui-cta-002-font);
}
[data-vibeui-block="cta-002"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;text-align:center;
}
[data-vibeui-block="cta-002"] [data-part="card"]{
padding:2.25rem 1.5rem;border:1px solid var(--vibeui-cta-002-border);border-radius:1.5rem;
background:var(--vibeui-cta-002-card);
background-image:radial-gradient(60% 90% at 50% -10%,color-mix(in oklab,var(--vibeui-cta-002-accent) 12%,transparent),transparent 70%);
}
[data-vibeui-block="cta-002"] [data-part="eyebrow"]{
display:inline-block;margin:0 0 0.875rem;padding:0.25rem 0.6875rem;border-radius:999px;
background:color-mix(in oklab,var(--vibeui-cta-002-accent) 12%,transparent);
color:var(--vibeui-cta-002-accent);
font-size:0.75rem;font-weight:640;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="cta-002"] [data-part="title"]{
margin:0 auto;max-width:18ch;
font-size:clamp(1.75rem,6cqi,3rem);line-height:1.06;letter-spacing:-0.03em;font-weight:720;
}
[data-vibeui-block="cta-002"] [data-part="text"]{
margin:0.875rem auto 0;max-width:52ch;
color:var(--vibeui-cta-002-muted);font-size:clamp(0.9375rem,1.6cqi,1.0625rem);line-height:1.55;
}
[data-vibeui-block="cta-002"] [data-part="actions"]{
display:flex;flex-direction:column;gap:0.625rem;margin-top:1.75rem;
}
[data-vibeui-block="cta-002"] [data-part="primary"],
[data-vibeui-block="cta-002"] [data-part="secondary"]{
display:inline-flex;align-items:center;justify-content:center;
height:3rem;padding:0 1.5rem;border-radius:0.875rem;
text-decoration:none;font-size:1rem;font-weight:640;
transition:background-color .18s ease,border-color .18s ease,transform .18s ease;
}
[data-vibeui-block="cta-002"] [data-part="primary"]{
background:var(--vibeui-cta-002-accent);color:var(--vibeui-cta-002-accent-fg);
box-shadow:0 14px 30px -18px color-mix(in oklab,var(--vibeui-cta-002-accent) 92%,black);
}
[data-vibeui-block="cta-002"] [data-part="primary"]:hover{background:color-mix(in oklab,var(--vibeui-cta-002-accent) 88%,black);transform:translateY(-1px)}
[data-vibeui-block="cta-002"] [data-part="secondary"]{
border:1px solid var(--vibeui-cta-002-border);color:var(--vibeui-cta-002-ink);background:transparent;
}
[data-vibeui-block="cta-002"] [data-part="secondary"]:hover{border-color:var(--vibeui-cta-002-accent);color:var(--vibeui-cta-002-accent)}
[data-vibeui-block="cta-002"] [data-part="proof"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem 1.25rem;
margin:1.5rem 0 0;padding:0;list-style:none;
color:var(--vibeui-cta-002-muted);font-size:0.8125rem;
}
[data-vibeui-block="cta-002"] [data-part="proof"] li{display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="cta-002"] [data-part="proof"] li::before{
content:"";width:0.375rem;height:0.375rem;border-radius:999px;flex:none;
background:var(--vibeui-cta-002-accent);
}
[data-vibeui-block="cta-002"] a:focus-visible{outline:2px solid var(--vibeui-cta-002-accent);outline-offset:3px}
@container (min-width: 40rem){
[data-vibeui-block="cta-002"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="cta-002"] [data-part="card"]{padding:3.5rem 3rem}
[data-vibeui-block="cta-002"] [data-part="actions"]{flex-direction:row;justify-content:center;gap:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PROOF = [
  "Первый макет за вечер",
  "Отмена в один клик",
  "Поддержка отвечает за час",
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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

/** Центрированный призыв с двумя равными кнопками и строкой подтверждений. */
export function Cta002({
  eyebrow = "Готовы начать",
  title = "Соберите первую страницу до конца недели",
  description = "Возьмите готовые секции, соберите из них страницу и отдайте её команде — без брифов на три недели и без вёрстки с нуля.",
  primaryLabel = "Начать бесплатно",
  primaryHref = "#start",
  secondaryLabel = "Посмотреть примеры",
  secondaryHref = "#examples",
  proof = DEFAULT_PROOF,
  background = "",
  accent,
  className,
  style,
}: Cta002Props) {
  const palette = {
    ...(accent ? { "--vibeui-cta-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-cta-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            <p data-part="text">{description}</p>
            <div data-part="actions">
              <a data-part="primary" href={primaryHref}>
                {primaryLabel}
              </a>
              <a data-part="secondary" href={secondaryHref}>
                {secondaryLabel}
              </a>
            </div>
            <ul data-part="proof">
              {proof.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
