import type { CSSProperties } from "react"

type Pres003Fact = {
  label: string
  value: string
}

export type Pres003Props = {
  eyebrow?: string
  title?: string
  summary?: string
  facts?: Pres003Fact[]
  contactName?: string
  contactEmail?: string
  ctaLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Контакты для прессы и факты о компании: слева краткая справка и контакт
// пресс-службы с кнопкой письма, справа сетка ключевых фактов (основана,
// команда, пользователи). Формат нижней части пресс-страницы, где журналист
// берёт цифры и связывается напрямую.
const STYLES = `
:where([data-vibeui-block="pres-003"]){
--vibeui-pres-003-bg:transparent;
--vibeui-pres-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-pres-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-pres-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-pres-003-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-pres-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-pres-003-on-accent:oklch(from var(--vibeui-pres-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-pres-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pres-003"]{color-scheme:dark}
[data-vibeui-block="pres-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-pres-003-bg);color:var(--vibeui-pres-003-ink);
font-family:var(--vibeui-pres-003-font);
}
[data-vibeui-block="pres-003"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:2rem;align-items:start}
[data-vibeui-block="pres-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-pres-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="pres-003"] [data-part="title"]{margin:0 0 0.75rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="pres-003"] [data-part="summary"]{margin:0 0 1.5rem;color:var(--vibeui-pres-003-muted);font-size:1.0625rem;line-height:1.6}
[data-vibeui-block="pres-003"] [data-part="contact"]{padding:1.25rem;border:1px solid var(--vibeui-pres-003-border);border-radius:1rem;background:var(--vibeui-pres-003-card)}
[data-vibeui-block="pres-003"] [data-part="contact-label"]{margin:0 0 0.25rem;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-pres-003-muted)}
[data-vibeui-block="pres-003"] [data-part="contact-name"]{margin:0;font-size:1rem;font-weight:640}
[data-vibeui-block="pres-003"] [data-part="contact-email"]{color:var(--vibeui-pres-003-accent);font-size:0.9375rem;text-decoration:none}
[data-vibeui-block="pres-003"] [data-part="contact-email"]:hover{text-decoration:underline;text-underline-offset:2px}
[data-vibeui-block="pres-003"] [data-part="cta"]{
display:inline-flex;align-items:center;height:2.75rem;padding:0 1.25rem;margin-top:1rem;border-radius:0.75rem;
background:var(--vibeui-pres-003-accent);color:oklch(from var(--vibeui-pres-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease}
[data-vibeui-block="pres-003"] [data-part="cta"]:hover{opacity:.9}
[data-vibeui-block="pres-003"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-pres-003-accent);outline-offset:3px}
[data-vibeui-block="pres-003"] [data-part="facts"]{list-style:none;margin:0;padding:0;display:grid;gap:1rem;grid-template-columns:1fr 1fr}
[data-vibeui-block="pres-003"] [data-part="fact"]{padding:1.25rem;border:1px solid var(--vibeui-pres-003-border);border-radius:1rem;background:var(--vibeui-pres-003-card)}
[data-vibeui-block="pres-003"] [data-part="fact-value"]{font-size:1.75rem;font-weight:750;line-height:1.05;color:var(--vibeui-pres-003-accent)}
[data-vibeui-block="pres-003"] [data-part="fact-label"]{margin:0.375rem 0 0;font-size:0.8125rem;color:var(--vibeui-pres-003-muted)}
@container (min-width: 48rem){
[data-vibeui-block="pres-003"] [data-part="shell"]{padding:4rem 2rem;grid-template-columns:1fr 1fr;gap:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pres-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FACTS: Pres003Fact[] = [
  { label: "Основана", value: "2025" },
  { label: "В команде", value: "12" },
  { label: "Пользователей", value: "40 тыс." },
  { label: "Компонентов", value: "1800+" },
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

/** Контакты для прессы и факты о компании двумя колонками. */
export function Pres003({
  eyebrow = "Для прессы",
  title = "Связаться и взять цифры",
  summary = "Пишем о продукте открыто. Возьмите факты для материала или напишите пресс-службе — отвечаем в течение дня.",
  facts = DEFAULT_FACTS,
  contactName = "Пресс-служба VibeUI",
  contactEmail = "press@vibeui.example",
  ctaLabel = "Написать письмо",
  background = "",
  accent,
  className,
  style,
}: Pres003Props) {
  const palette = {
    ...(accent ? { "--vibeui-pres-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pres-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pres-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pres-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            <p data-part="summary">{summary}</p>
            <div data-part="contact">
              <p data-part="contact-label">Пресс-служба</p>
              <p data-part="contact-name">{contactName}</p>
              <a href={`mailto:${contactEmail}`} data-part="contact-email">
                {contactEmail}
              </a>
            </div>
            <a href={`mailto:${contactEmail}`} data-part="cta">
              {ctaLabel}
            </a>
          </div>
          <ul data-part="facts">
            {facts.map((fact) => (
              <li key={fact.label} data-part="fact">
                <div data-part="fact-value">{fact.value}</div>
                <p data-part="fact-label">{fact.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
