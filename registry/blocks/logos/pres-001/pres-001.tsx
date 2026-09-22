import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Pres001Item = {
  outlet: string
  quote: string
  date: string
}

export type Pres001Props = {
  eyebrow?: string
  title?: string
  mentions?: Pres001Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Упоминания в прессе: карточки с названием издания, цитатой из публикации и
// датой. Название издания — wordmark-текстом (без реальных логотипов СМИ),
// цитата в кавычках-псевдоэлементах. Формат «о нас пишут» на странице для
// прессы; карточка — ссылка на публикацию.
const STYLES = `[data-vibeui-block="pres-001"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="pres-001"]){
--vibeui-pres-001-bg:transparent;
--vibeui-pres-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-pres-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-pres-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-pres-001-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-pres-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-pres-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-pres-001-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pres-001"]{color-scheme:dark}
[data-vibeui-block="pres-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-pres-001-bg);color:var(--vibeui-pres-001-ink);
font-family:var(--vibeui-pres-001-font);
}
[data-vibeui-block="pres-001"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="pres-001"] [data-part="grid"]{display:grid;gap:1rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="pres-001"] [data-part="card"]{
min-inline-size:0;display:flex;flex-direction:column;gap:1rem;
padding:1.5rem;border:1px solid var(--vibeui-pres-001-border);border-radius:1.125rem;
background:var(--vibeui-pres-001-card);color:inherit;text-decoration:none;
transition:transform var(--vibeui-pres-001-dur-2) ease,border-color var(--vibeui-pres-001-dur-2) ease}
[data-vibeui-block="pres-001"] [data-part="card"]:hover{transform:translateY(-3px);border-color:var(--vibeui-pres-001-accent)}
[data-vibeui-block="pres-001"] [data-part="card"]:focus-visible{outline:2px solid var(--vibeui-pres-001-accent);outline-offset:2px}
[data-vibeui-block="pres-001"] [data-part="outlet"]{font-size:1.0625rem;font-weight:750;letter-spacing:-0.01em}
[data-vibeui-block="pres-001"] [data-part="quote"]{margin:0;flex:1;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-pres-001-muted)}
[data-vibeui-block="pres-001"] [data-part="quote"]::before{content:"«"}
[data-vibeui-block="pres-001"] [data-part="quote"]::after{content:"»"}
[data-vibeui-block="pres-001"] [data-part="date"]{font-size:0.8125rem;color:var(--vibeui-pres-001-accent);font-weight:600}
@container (min-width: 44rem){
[data-vibeui-block="pres-001"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="pres-001"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pres-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MENTIONS: Pres001Item[] = [
  {
    outlet: "ТехВестник",
    quote: "VibeUI переворачивает подход к сборке интерфейсов вместе с ИИ.",
    date: "Сентябрь 2026",
  },
  {
    outlet: "Код и Кофе",
    quote:
      "Наконец-то библиотека, где компоненты приходят готовыми файлами, а не зависимостями.",
    date: "Август 2026",
  },
  {
    outlet: "Диджитал Обзор",
    quote:
      "Инструмент, который экономит командам недели работы над лендингами.",
    date: "Июль 2026",
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

/** Упоминания в прессе: карточки с изданием, цитатой и датой публикации. */
export function Pres001({
  eyebrow = "О нас пишут",
  title = "В прессе",
  mentions = DEFAULT_MENTIONS,
  background = "",
  accent,
  className,
  style,
}: Pres001Props) {
  const palette = {
    ...(accent ? { "--vibeui-pres-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pres-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pres-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pres-001"
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
          <div data-part="grid">
            {mentions.map((mention) => (
              <a key={mention.outlet} href="#" data-part="card">
                <span data-part="outlet">{mention.outlet}</span>
                <blockquote data-part="quote">{mention.quote}</blockquote>
                <span data-part="date">{mention.date}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
