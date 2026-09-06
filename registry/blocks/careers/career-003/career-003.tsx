import type { CSSProperties } from "react"

export type Career003Props = {
  eyebrow?: string
  role?: string
  location?: string
  employment?: string
  team?: string
  summary?: string
  responsibilities?: string[]
  requirements?: string[]
  ctaLabel?: string
  ctaHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Карточка одной вакансии: шапка с названием роли и метаданными, резюме и
// два списка — обязанности и требования, кнопка отклика внизу. Формат
// страницы отдельной вакансии, куда ведёт список ролей. Липкая кнопка
// отклика прижата к низу карточки на широком экране.
const STYLES = `
:where([data-vibeui-block="career-003"]){
--vibeui-career-003-bg:transparent;
--vibeui-career-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-career-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-career-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-career-003-chip:light-dark(oklch(0.97 0 0),oklch(0.24 0 0));
--vibeui-career-003-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-career-003-on-accent:oklch(0.15 0.02 39.8);
--vibeui-career-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="career-003"]{color-scheme:dark}
[data-vibeui-block="career-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-career-003-bg);color:var(--vibeui-career-003-ink);
font-family:var(--vibeui-career-003-font);
}
[data-vibeui-block="career-003"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="career-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-career-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="career-003"] [data-part="role"]{margin:0 0 1rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="career-003"] [data-part="tags"]{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem}
[data-vibeui-block="career-003"] [data-part="tag"]{
padding:0.25rem 0.75rem;border-radius:999px;font-size:0.8125rem;font-weight:600;
background:var(--vibeui-career-003-chip);color:var(--vibeui-career-003-muted);
}
[data-vibeui-block="career-003"] [data-part="summary"]{margin:0 0 2rem;font-size:1.0625rem;line-height:1.6}
[data-vibeui-block="career-003"] [data-part="block"]{margin-bottom:1.75rem}
[data-vibeui-block="career-003"] [data-part="head"]{margin:0 0 0.75rem;font-size:1.0625rem;font-weight:700}
[data-vibeui-block="career-003"] [data-part="items"]{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="career-003"] [data-part="item"]{position:relative;padding-left:1.375rem;font-size:0.9375rem;line-height:1.5}
[data-vibeui-block="career-003"] [data-part="item"]::before{
content:"";position:absolute;left:0.25rem;top:0.5rem;width:0.5rem;height:0.5rem;border-radius:999px;
background:var(--vibeui-career-003-accent);
}
[data-vibeui-block="career-003"] [data-part="cta"]{
display:inline-flex;align-items:center;gap:0.5rem;margin-top:0.5rem;
padding:0 1.5rem;height:2.875rem;border-radius:999px;
background:var(--vibeui-career-003-accent);color:var(--vibeui-career-003-on-accent);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease;
}
[data-vibeui-block="career-003"] [data-part="cta"]:hover{opacity:.9}
[data-vibeui-block="career-003"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-career-003-accent);outline-offset:3px}
@container (min-width: 40rem){[data-vibeui-block="career-003"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="career-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RESPONSIBILITIES = [
  "Разрабатывать переносимые UI-компоненты без внешних зависимостей",
  "Держать единый source of truth между превью и реестром",
  "Писать понятную документацию для ИИ-агентов и людей",
]

const DEFAULT_REQUIREMENTS = [
  "Уверенный React и TypeScript в strict-режиме",
  "Внимание к доступности и семантике разметки",
  "Умение объяснять решения в коде, а не только писать его",
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

/** Карточка одной вакансии: метаданные, резюме, обязанности и требования. */
export function Career003({
  eyebrow = "Вакансия",
  role = "Фронтенд-разработчик",
  location = "Удалённо",
  employment = "Полная занятость",
  team = "Инженерия",
  summary = "Ищем разработчика в команду библиотеки компонентов. Вы будете отвечать за переносимые блоки, которые работают в любом чужом проекте без правок.",
  responsibilities = DEFAULT_RESPONSIBILITIES,
  requirements = DEFAULT_REQUIREMENTS,
  ctaLabel = "Откликнуться",
  ctaHref = "#",
  background = "",
  accent,
  className,
  style,
}: Career003Props) {
  const palette = {
    ...(accent ? { "--vibeui-career-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-career-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-career-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="career-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="role">{role}</h2>
          <div data-part="tags">
            <span data-part="tag">{team}</span>
            <span data-part="tag">{location}</span>
            <span data-part="tag">{employment}</span>
          </div>
          <p data-part="summary">{summary}</p>
          <div data-part="block">
            <h3 data-part="head">Что делать</h3>
            <ul data-part="items">
              {responsibilities.map((item) => (
                <li key={item} data-part="item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div data-part="block">
            <h3 data-part="head">Что важно</h3>
            <ul data-part="items">
              {requirements.map((item) => (
                <li key={item} data-part="item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <a href={ctaHref} data-part="cta">
            {ctaLabel}
          </a>
        </div>
      </section>
    </>
  )
}
