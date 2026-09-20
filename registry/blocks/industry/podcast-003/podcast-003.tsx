import type { CSSProperties, ReactNode } from "react"

type Podcast003Episode = {
  number: string
  title: string
  duration: string
}

export type Podcast003Props = {
  eyebrow?: string
  title?: string
  summary?: string
  episodes?: Podcast003Episode[]
  subscribeLabel?: string
  platforms?: string[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Промо подкаста с подпиской: слева описание шоу и ссылки на площадки, справа
// компактная сетка последних выпусков карточками с номером и длительностью.
// Формат вводной секции подкаста, зовущей подписаться и показывающей, о чём
// последние эпизоды.
const STYLES = `
:where([data-vibeui-block="podcast-003"]){
--vibeui-podcast-003-bg:transparent;
--vibeui-podcast-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-podcast-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-podcast-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-podcast-003-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-podcast-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-podcast-003-on-accent:oklch(from var(--vibeui-podcast-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-podcast-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-podcast-003-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="podcast-003"]{color-scheme:dark}
[data-vibeui-block="podcast-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-podcast-003-bg);color:var(--vibeui-podcast-003-ink);
font-family:var(--vibeui-podcast-003-font);
}
[data-vibeui-block="podcast-003"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:2rem;align-items:start}
[data-vibeui-block="podcast-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-podcast-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="podcast-003"] [data-part="title"]{margin:0 0 0.75rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="podcast-003"] [data-part="summary"]{margin:0 0 1.5rem;color:var(--vibeui-podcast-003-muted);font-size:1.0625rem;line-height:1.6}
[data-vibeui-block="podcast-003"] [data-part="platforms"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="podcast-003"] [data-part="platform"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="podcast-003"] [data-part="platform"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.5rem 1rem;border-radius:999px;font-size:0.875rem;font-weight:640;text-decoration:none;
transition:opacity var(--vibeui-podcast-003-dur-2) ease,border-color var(--vibeui-podcast-003-dur-2) ease}
[data-vibeui-block="podcast-003"] [data-part="platform"]:first-child{background:var(--vibeui-podcast-003-accent);color:oklch(from var(--vibeui-podcast-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="podcast-003"] [data-part="platform"]:not(:first-child){border:1px solid var(--vibeui-podcast-003-border);color:inherit}
[data-vibeui-block="podcast-003"] [data-part="platform"]:first-child:hover{opacity:.9}
[data-vibeui-block="podcast-003"] [data-part="platform"]:not(:first-child):hover{border-color:var(--vibeui-podcast-003-accent)}
[data-vibeui-block="podcast-003"] [data-part="platform"]:focus-visible{outline:2px solid var(--vibeui-podcast-003-accent);outline-offset:2px}
[data-vibeui-block="podcast-003"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem}
[data-vibeui-block="podcast-003"] [data-part="ep"]{
display:grid;grid-template-columns:auto 1fr auto;gap:0.75rem;align-items:center;
padding:0.875rem 1rem;border:1px solid var(--vibeui-podcast-003-border);border-radius:0.875rem;
background:var(--vibeui-podcast-003-card);color:inherit;text-decoration:none;transition:border-color var(--vibeui-podcast-003-dur-2) ease}
[data-vibeui-block="podcast-003"] [data-part="ep"]:hover{border-color:var(--vibeui-podcast-003-accent)}
[data-vibeui-block="podcast-003"] [data-part="ep"]:focus-visible{outline:2px solid var(--vibeui-podcast-003-accent);outline-offset:2px}
[data-vibeui-block="podcast-003"] [data-part="ep-num"]{font-size:0.75rem;font-weight:700;color:var(--vibeui-podcast-003-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="podcast-003"] [data-part="ep-title"]{font-size:0.9375rem;font-weight:600;line-height:1.3;min-width:0}
[data-vibeui-block="podcast-003"] [data-part="ep-dur"]{font-size:0.8125rem;color:var(--vibeui-podcast-003-muted);white-space:nowrap}
@container (min-width: 48rem){
[data-vibeui-block="podcast-003"] [data-part="shell"]{padding:4rem 2rem;grid-template-columns:1fr 1.1fr;gap:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-003"] *{animation:none!important;transition:none!important}}
`

// Значок площадки подбирается по названию: список приходит строками, а
// одинаковые текстовые ссылки читаются как обычное меню, а не как кнопки
// «слушать здесь». У Apple и Spotify свои знаки; точный логотип Яндекс
// Музыки и Звука — товарный знак, поэтому там буквенная монограмма.
const PLATFORM_ICONS: Record<string, ReactNode> = {
  apple: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 14.5a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 1 1-.3-1.5c4.8-1.1 8.9-.6 12.2 1.4.4.2.5.7.3 1zm1.2-2.8a1 1 0 0 1-1.3.3c-3.4-2.1-8.6-2.7-12.6-1.5a1 1 0 1 1-.6-1.9c4.6-1.4 10.3-.7 14.2 1.7.4.3.6.9.3 1.4zm.1-2.9C13.5 8.4 7 8.2 3.1 9.4a1.2 1.2 0 0 1-.7-2.3C6.9 5.7 14.1 6 18.7 8.7a1.2 1.2 0 0 1-1.2 2.1z"
      />
    </svg>
  ),
  яндекс: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        Я
      </text>
    </svg>
  ),
  звук: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        З
      </text>
    </svg>
  ),
  вк: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        VK
      </text>
    </svg>
  ),
}

function platformIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  const known = Object.keys(PLATFORM_ICONS).find((platform) =>
    key.includes(platform),
  )

  return known ? PLATFORM_ICONS[known] : null
}

const DEFAULT_EPISODES: Podcast003Episode[] = [
  { number: "12", title: "Как ИИ меняет фронтенд", duration: "48 мин" },
  { number: "11", title: "Дизайн-системы без боли", duration: "52 мин" },
  { number: "10", title: "Переносимые компоненты", duration: "41 мин" },
]

const DEFAULT_PLATFORMS = ["Слушать", "Spotify", "Apple Podcasts"]

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

/** Промо подкаста с подпиской и сеткой последних выпусков. */
export function Podcast003({
  eyebrow = "Подкаст",
  title = "«Вайб» — о том, как строят интерфейсы",
  summary = "Каждую неделю зовём практиков и разбираем, как собирать продукты быстрее: инструменты, процессы и живые истории.",
  episodes = DEFAULT_EPISODES,
  subscribeLabel = "Подписаться",
  platforms = DEFAULT_PLATFORMS,
  background = "",
  accent,
  className,
  style,
}: Podcast003Props) {
  const palette = {
    ...(accent ? { "--vibeui-podcast-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-podcast-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-podcast-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="podcast-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            <p data-part="summary">{summary}</p>
            <div data-part="platforms" aria-label={subscribeLabel}>
              {platforms.map((platform) => (
                <a key={platform} href="#" data-part="platform">
                  {platformIcon(platform)}
                  {platform}
                </a>
              ))}
            </div>
          </div>
          <ul data-part="list">
            {episodes.map((episode) => (
              <li key={episode.number}>
                <a href="#" data-part="ep">
                  <span data-part="ep-num">#{episode.number}</span>
                  <span data-part="ep-title">{episode.title}</span>
                  <span data-part="ep-dur">{episode.duration}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
