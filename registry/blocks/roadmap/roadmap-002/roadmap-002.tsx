import type { CSSProperties } from "react"

type Roadmap002Quarter = {
  label: string
  state: string
  items: string[]
}

export type Roadmap002Props = {
  eyebrow?: string
  title?: string
  quarters?: Roadmap002Quarter[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Роадмап таймлайном по кварталам: горизонтальная ось с вехами, у каждой
// подпись квартала, состояние и список задач. Прошедшие кварталы приглушены,
// текущий выделен брендовой точкой. Формат «когда что выйдет» вдоль времени,
// а не по статусам-колонкам.
const STYLES = `
:where([data-vibeui-block="roadmap-002"]){
--vibeui-roadmap-002-bg:transparent;
--vibeui-roadmap-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-roadmap-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-roadmap-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-roadmap-002-card:light-dark(oklch(1 0 0),oklch(0.2 0 0));
--vibeui-roadmap-002-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-roadmap-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="roadmap-002"]{color-scheme:dark}
[data-vibeui-block="roadmap-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-roadmap-002-bg);color:var(--vibeui-roadmap-002-ink);
font-family:var(--vibeui-roadmap-002-font);
}
[data-vibeui-block="roadmap-002"] [data-part="shell"]{max-width:72rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="roadmap-002"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-roadmap-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="roadmap-002"] [data-part="title"]{margin:0 0 2.25rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="roadmap-002"] [data-part="track"]{list-style:none;margin:0;padding:0;display:grid;gap:1rem}
[data-vibeui-block="roadmap-002"] [data-part="q"]{
position:relative;padding:0 0 0 1.75rem;
border-left:2px solid var(--vibeui-roadmap-002-border);
}
[data-vibeui-block="roadmap-002"] [data-part="q"]:last-child{border-left-color:transparent}
[data-vibeui-block="roadmap-002"] [data-part="q"]::before{
content:"";position:absolute;left:-0.4375rem;top:0.125rem;width:0.75rem;height:0.75rem;border-radius:999px;
background:var(--vibeui-roadmap-002-border);box-shadow:0 0 0 4px var(--vibeui-roadmap-002-bg);
}
[data-vibeui-block="roadmap-002"] [data-part="q"][data-current="true"]::before{background:var(--vibeui-roadmap-002-accent)}
[data-vibeui-block="roadmap-002"] [data-part="q"][data-done="true"]{opacity:.65}
[data-vibeui-block="roadmap-002"] [data-part="qhead"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.625rem;margin-bottom:0.5rem}
[data-vibeui-block="roadmap-002"] [data-part="qlabel"]{font-size:1.0625rem;font-weight:700}
[data-vibeui-block="roadmap-002"] [data-part="qstate"]{
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
padding:0.125rem 0.5rem;border-radius:0.375rem;
color:var(--vibeui-roadmap-002-accent);background:color-mix(in oklab,var(--vibeui-roadmap-002-accent) 12%,transparent);
}
[data-vibeui-block="roadmap-002"] [data-part="qitems"]{list-style:none;margin:0 0 1.25rem;padding:0;display:grid;gap:0.375rem}
[data-vibeui-block="roadmap-002"] [data-part="qitem"]{position:relative;padding-left:1rem;font-size:0.9375rem;line-height:1.5;color:var(--vibeui-roadmap-002-muted)}
[data-vibeui-block="roadmap-002"] [data-part="qitem"]::before{content:"";position:absolute;left:0;top:0.5625rem;width:0.375rem;height:0.375rem;border-radius:999px;background:var(--vibeui-roadmap-002-accent)}
@container (min-width: 56rem){
[data-vibeui-block="roadmap-002"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="roadmap-002"] [data-part="track"]{grid-template-columns:repeat(4,minmax(0,1fr));gap:0}
[data-vibeui-block="roadmap-002"] [data-part="q"]{padding:1.75rem 1rem 0 0;border-left:0;border-top:2px solid var(--vibeui-roadmap-002-border)}
[data-vibeui-block="roadmap-002"] [data-part="q"]:last-child{border-top-color:var(--vibeui-roadmap-002-border)}
[data-vibeui-block="roadmap-002"] [data-part="q"]::before{left:0;top:-0.4375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="roadmap-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_QUARTERS: Roadmap002Quarter[] = [
  { label: "Q2 2026", state: "Готово", items: ["Живое превью", "Copy for AI"] },
  { label: "Q3 2026", state: "Сейчас", items: ["Новые блоки", "Фирменная палитра"] },
  { label: "Q4 2026", state: "Далее", items: ["Раздел анимаций", "Экспорт токенов"] },
  { label: "Q1 2027", state: "Идея", items: ["Плагин для Figma", "Командные пресеты"] },
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

/** Роадмап таймлайном по кварталам: вехи вдоль оси, текущий квартал выделен. */
export function Roadmap002({
  eyebrow = "Планы развития",
  title = "Дорожная карта по кварталам",
  quarters = DEFAULT_QUARTERS,
  background = "",
  accent,
  className,
  style,
}: Roadmap002Props) {
  const current = quarters.findIndex((quarter) => quarter.state === "Сейчас")
  const palette = {
    ...(accent ? { "--vibeui-roadmap-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-roadmap-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-roadmap-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="roadmap-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <ol data-part="track">
            {quarters.map((quarter, index) => (
              <li
                key={quarter.label}
                data-part="q"
                data-current={index === current ? "true" : undefined}
                data-done={current >= 0 && index < current ? "true" : undefined}
              >
                <div data-part="qhead">
                  <span data-part="qlabel">{quarter.label}</span>
                  <span data-part="qstate">{quarter.state}</span>
                </div>
                <ul data-part="qitems">
                  {quarter.items.map((item) => (
                    <li key={item} data-part="qitem">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
