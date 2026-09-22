import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type People006Stat = {
  value: string
  label: string
}

export type People006Props = {
  eyebrow?: string
  title?: string
  description?: string
  stats?: People006Stat[]
  /** Имена для сетки аватаров-инициалов. */
  faces?: string[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Команда цифрами: счётчики (человек, городов, лет опыта) плюс маленькая
// сетка аватаров-инициалов. Числа отвечают на вопрос «кто за этим стоит»
// быстрее любых портретов, а сетка инициалов показывает масштаб, не
// раскрывая лиц. Счётчики свёрстаны как <dl>: значение и подпись — это
// пара «термин — определение», а не два абзаца.
const STYLES = `[data-vibeui-block="people-006"] [data-part="heading"]{margin-bottom:1.75rem}

:where([data-vibeui-block="people-006"]){
--vibeui-people-006-bg:transparent;
--vibeui-people-006-card:light-dark(oklch(1 0 0),oklch(0.235 0 0));
--vibeui-people-006-ink:light-dark(oklch(0.2 0 0),oklch(0.96 0 0));
--vibeui-people-006-muted:light-dark(oklch(0.51 0 0),oklch(0.72 0 0));
--vibeui-people-006-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-people-006-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-people-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="people-006"]{color-scheme:dark}
[data-vibeui-block="people-006"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-people-006-bg);color:var(--vibeui-people-006-ink);
font-family:var(--vibeui-people-006-font);
}
[data-vibeui-block="people-006"] [data-part="shell"]{max-width:70rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="people-006"] [data-part="layout"]{display:grid;gap:2.5rem;align-items:start}
[data-vibeui-block="people-006"] [data-part="faces"]{
display:flex;flex-wrap:wrap;gap:0.5rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="people-006"] [data-part="face"]{
width:2.75rem;height:2.75rem;border-radius:999px;display:grid;place-items:center;
border:1px solid color-mix(in oklab,var(--vibeui-people-006-accent) 25%,var(--vibeui-people-006-border));
background:color-mix(in oklab,var(--vibeui-people-006-accent) 10%,var(--vibeui-people-006-card));
color:var(--vibeui-people-006-accent);
font-size:0.8125rem;font-weight:750;letter-spacing:0.02em;
}
[data-vibeui-block="people-006"] [data-part="face-name"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="people-006"] [data-part="stats"]{margin:0;display:grid}
[data-vibeui-block="people-006"] [data-part="stat"]{
display:flex;flex-direction:column-reverse;gap:0.25rem;
padding:1.25rem 0;border-top:1px solid var(--vibeui-people-006-border);
}
[data-vibeui-block="people-006"] [data-part="stat"]:last-child{border-bottom:1px solid var(--vibeui-people-006-border)}
[data-vibeui-block="people-006"] [data-part="stat"] dt{
color:var(--vibeui-people-006-muted);font-size:0.875rem;line-height:1.4;
}
[data-vibeui-block="people-006"] [data-part="stat"] dd{
margin:0;color:var(--vibeui-people-006-accent);
font-size:clamp(2rem,6cqi,2.75rem);font-weight:750;line-height:1;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;
}
@container (min-width: 48rem){
[data-vibeui-block="people-006"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="people-006"] [data-part="layout"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:3.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="people-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STATS: People006Stat[] = [
  { value: "12", label: "человек в команде" },
  { value: "9", label: "городов и четыре часовых пояса" },
  { value: "9 лет", label: "среднего стажа во фронтенде" },
]

const DEFAULT_FACES = [
  "Алексей Громов",
  "Вера Лапина",
  "Марат Гареев",
  "Ксения Орлова",
  "Никита Белов",
  "Полина Царёва",
  "Тимур Ахметов",
  "Инна Штерн",
  "Олег Раков",
  "Дарья Мельник",
  "Гнат Вильде",
  "Софья Ким",
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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
}

/** Команда цифрами: счётчики и маленькая сетка аватаров-инициалов. */
export function People006({
  eyebrow = "Команда",
  title = "Небольшая команда с длинной волей",
  description = "VibeUI собирает распределённая команда: дизайнеры, инженеры и писатели в девяти городах. Ниже — цифры вместо парадных портретов.",
  stats = DEFAULT_STATS,
  faces = DEFAULT_FACES,
  background = "",
  accent,
  className,
  style,
}: People006Props) {
  const palette = {
    ...(accent ? { "--vibeui-people-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-people-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-people-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="people-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="layout">
            <div data-part="intro">
              <Heading001
                data-part="heading"
                eyebrow={eyebrow}
                title={title}
                lede={description}
                ledeWidth={46}
                accent={accent}
              />
              <ul data-part="faces">
                {faces.map((name) => (
                  <li key={name} data-part="face" title={name}>
                    <span aria-hidden="true">{initials(name)}</span>
                    <span data-part="face-name">{name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <dl data-part="stats">
              {stats.map((stat) => (
                <div key={stat.label} data-part="stat">
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
