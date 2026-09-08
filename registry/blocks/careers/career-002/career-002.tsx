import type { CSSProperties } from "react"

type Career002Perk = {
  title: string
  note: string
}

export type Career002Props = {
  eyebrow?: string
  title?: string
  summary?: string
  perks?: Career002Perk[]
  ctaLabel?: string
  ctaHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Секция «почему у нас»: краткий рассказ о команде слева, сетка перков
// справа и кнопка к вакансиям. Перки — карточки с CSS-глифом-галочкой,
// без иконочного шрифта. Формат вводного блока страницы карьеры перед
// самим списком вакансий.
const STYLES = `
:where([data-vibeui-block="career-002"]){
--vibeui-career-002-bg:transparent;
--vibeui-career-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-career-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-career-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-career-002-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-career-002-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-career-002-on-accent:oklch(0.15 0.02 39.8);
--vibeui-career-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="career-002"]{color-scheme:dark}
[data-vibeui-block="career-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-career-002-bg);color:var(--vibeui-career-002-ink);
font-family:var(--vibeui-career-002-font);
}
[data-vibeui-block="career-002"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:2rem}
[data-vibeui-block="career-002"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-career-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="career-002"] [data-part="title"]{margin:0 0 1rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="career-002"] [data-part="summary"]{margin:0 0 1.5rem;color:var(--vibeui-career-002-muted);font-size:1.0625rem;line-height:1.6}
[data-vibeui-block="career-002"] [data-part="cta"]{
display:inline-flex;align-items:center;gap:0.5rem;
padding:0 1.25rem;height:2.75rem;border-radius:999px;
background:var(--vibeui-career-002-accent);color:var(--vibeui-career-002-on-accent);
font-size:0.9375rem;font-weight:650;text-decoration:none;
transition:opacity .16s ease;
}
[data-vibeui-block="career-002"] [data-part="cta"]:hover{opacity:.9}
[data-vibeui-block="career-002"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-career-002-accent);outline-offset:3px}
[data-vibeui-block="career-002"] [data-part="perks"]{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="career-002"] [data-part="perk"]{
display:grid;grid-template-columns:auto 1fr;gap:0.75rem;align-items:start;
padding:1rem;border:1px solid var(--vibeui-career-002-border);border-radius:0.875rem;
background:var(--vibeui-career-002-card);
}
[data-vibeui-block="career-002"] [data-part="check"]{
width:1.375rem;height:1.375rem;border-radius:999px;flex:none;position:relative;
background:color-mix(in oklab,var(--vibeui-career-002-accent) 15%,transparent);
}
[data-vibeui-block="career-002"] [data-part="check"]::before{
content:"";position:absolute;left:0.4375rem;top:0.3125rem;width:0.3125rem;height:0.5625rem;
border:solid var(--vibeui-career-002-accent);border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="career-002"] [data-part="perk-title"]{margin:0;font-size:0.9375rem;font-weight:640}
[data-vibeui-block="career-002"] [data-part="perk-note"]{margin:0.1875rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-career-002-muted)}
@container (min-width: 52rem){
[data-vibeui-block="career-002"] [data-part="shell"]{padding:4.5rem 2rem;grid-template-columns:1fr 1fr;align-items:start;gap:3rem}
[data-vibeui-block="career-002"] [data-part="perks"]{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="career-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PERKS: Career002Perk[] = [
  {
    title: "Полная удалёнка",
    note: "Работайте из любого города и часового пояса",
  },
  { title: "Гибкий график", note: "Сами планируете день вокруг задач" },
  {
    title: "Бюджет на обучение",
    note: "Курсы, конференции и книги за счёт компании",
  },
  { title: "Доля в продукте", note: "Опционы для всех в команде" },
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

/** Вводная секция карьеры: рассказ о команде и сетка перков с CTA. */
export function Career002({
  eyebrow = "Работа у нас",
  title = "Маленькая команда, большие задачи",
  summary = "Мы строим библиотеку компонентов для вайбкодинга. Работаем удалённо, ценим самостоятельность и короткий путь от идеи до релиза.",
  perks = DEFAULT_PERKS,
  ctaLabel = "Смотреть вакансии",
  ctaHref = "#",
  background = "",
  accent,
  className,
  style,
}: Career002Props) {
  const palette = {
    ...(accent ? { "--vibeui-career-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-career-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-career-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="career-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            <p data-part="summary">{summary}</p>
            <a href={ctaHref} data-part="cta">
              {ctaLabel}
            </a>
          </div>
          <ul data-part="perks">
            {perks.map((perk) => (
              <li key={perk.title} data-part="perk">
                <span data-part="check" aria-hidden="true" />
                <div>
                  <p data-part="perk-title">{perk.title}</p>
                  <p data-part="perk-note">{perk.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
