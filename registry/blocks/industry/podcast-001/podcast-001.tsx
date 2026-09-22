import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

type Podcast001Episode = {
  number: string
  title: string
  guest: string
  duration: string
}

export type Podcast001Props = {
  eyebrow?: string
  title?: string
  episodes?: Podcast001Episode[]
  playLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Список эпизодов подкаста: строки с кнопкой play, номером, названием, гостем
// и длительностью. Кнопка play — круг с треугольником из бордюров. Формат
// ленты выпусков на странице подкаста; строка кликается целиком, воспроизведение
// подключает приложение.
const STYLES = `[data-vibeui-block="podcast-001"] [data-part="heading"]{margin-bottom:2rem}

:where([data-vibeui-block="podcast-001"]){
--vibeui-podcast-001-bg:transparent;
--vibeui-podcast-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-podcast-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-podcast-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-podcast-001-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-podcast-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-podcast-001-on-accent:oklch(from var(--vibeui-podcast-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-podcast-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-podcast-001-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="podcast-001"]{color-scheme:dark}
[data-vibeui-block="podcast-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-podcast-001-bg);color:var(--vibeui-podcast-001-ink);
font-family:var(--vibeui-podcast-001-font);
}
[data-vibeui-block="podcast-001"] [data-part="shell"]{max-width:48rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="podcast-001"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="podcast-001"] [data-part="row"]{
display:grid;grid-template-columns:auto auto 1fr auto;gap:1rem;align-items:center;
padding:1rem;border:1px solid var(--vibeui-podcast-001-border);border-radius:1rem;
background:var(--vibeui-podcast-001-card);color:inherit;text-decoration:none;
transition:border-color var(--vibeui-podcast-001-dur-2) ease,transform var(--vibeui-podcast-001-dur-2) ease;
}
[data-vibeui-block="podcast-001"] [data-part="row"]:hover{border-color:var(--vibeui-podcast-001-accent);transform:translateY(-2px)}
[data-vibeui-block="podcast-001"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-podcast-001-accent);outline-offset:2px}
[data-vibeui-block="podcast-001"] [data-part="play"]{
width:2.75rem;height:2.75rem;flex:none;border-radius:999px;display:grid;place-items:center;
background:var(--vibeui-podcast-001-accent);color:oklch(from var(--vibeui-podcast-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="podcast-001"] [data-part="play"]::before{content:"";margin-left:0.1875rem;border-style:solid;border-width:0.4375rem 0 0.4375rem 0.75rem;border-color:transparent transparent transparent var(--vibeui-podcast-001-on-accent)}
[data-vibeui-block="podcast-001"] [data-part="num"]{font-size:0.8125rem;font-weight:700;color:var(--vibeui-podcast-001-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="podcast-001"] [data-part="info"]{min-width:0}
[data-vibeui-block="podcast-001"] [data-part="ep-title"]{margin:0;font-size:0.9375rem;font-weight:640;line-height:1.3}
[data-vibeui-block="podcast-001"] [data-part="guest"]{margin:0.125rem 0 0;font-size:0.8125rem;color:var(--vibeui-podcast-001-muted)}
[data-vibeui-block="podcast-001"] [data-part="dur"]{font-size:0.8125rem;color:var(--vibeui-podcast-001-muted);font-variant-numeric:tabular-nums;white-space:nowrap}
@container (min-width: 40rem){[data-vibeui-block="podcast-001"] [data-part="shell"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EPISODES: Podcast001Episode[] = [
  {
    number: "12",
    title: "Как ИИ меняет фронтенд",
    guest: "Анна Ковалёва",
    duration: "48 мин",
  },
  {
    number: "11",
    title: "Дизайн-системы без боли",
    guest: "Игорь Демидов",
    duration: "52 мин",
  },
  {
    number: "10",
    title: "Переносимые компоненты",
    guest: "Пётр Ляхов",
    duration: "41 мин",
  },
  {
    number: "09",
    title: "Вайбкодинг на практике",
    guest: "Мария Соболева",
    duration: "57 мин",
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

/** Список эпизодов подкаста: строки с кнопкой play, гостем и длительностью. */
export function Podcast001({
  eyebrow = "Подкаст",
  title = "Свежие выпуски",
  episodes = DEFAULT_EPISODES,
  playLabel = "Слушать",
  background = "",
  accent,
  className,
  style,
}: Podcast001Props) {
  const palette = {
    ...(accent ? { "--vibeui-podcast-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-podcast-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-podcast-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="podcast-001"
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
          <ul data-part="list">
            {episodes.map((episode) => (
              <li key={episode.number}>
                <a
                  href="#"
                  data-part="row"
                  aria-label={`${playLabel}: ${episode.title}`}
                >
                  <span data-part="play" aria-hidden="true" />
                  <span data-part="num">#{episode.number}</span>
                  <span data-part="info">
                    <span data-part="ep-title">{episode.title}</span>
                    <span data-part="guest">{episode.guest}</span>
                  </span>
                  <span data-part="dur">{episode.duration}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
