import type { CSSProperties } from "react"

export type Podcast002Props = {
  eyebrow?: string
  showTitle?: string
  episodeTitle?: string
  summary?: string
  durationLabel?: string
  dateLabel?: string
  platforms?: string[]
  playLabel?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Карточка одного выпуска: обложка-градиент с монограммой подкаста слева,
// справа название, описание, мини-плеер (кнопка play + прогресс-дорожка) и
// ссылки на площадки. Дорожка прогресса — статичная заливка. Формат страницы
// отдельного эпизода с приглашением послушать.
const STYLES = `
:where([data-vibeui-block="podcast-002"]){
--vibeui-podcast-002-bg:transparent;
--vibeui-podcast-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-podcast-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-podcast-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-podcast-002-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-podcast-002-track:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-podcast-002-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-podcast-002-on-accent:oklch(0.15 0.02 39.8);
--vibeui-podcast-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="podcast-002"]{color-scheme:dark}
[data-vibeui-block="podcast-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-podcast-002-bg);color:var(--vibeui-podcast-002-ink);
font-family:var(--vibeui-podcast-002-font);
}
[data-vibeui-block="podcast-002"] [data-part="shell"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="podcast-002"] [data-part="card"]{
display:grid;gap:1.5rem;align-items:start;
padding:1.5rem;border:1px solid var(--vibeui-podcast-002-border);border-radius:1.25rem;background:var(--vibeui-podcast-002-card);
}
[data-vibeui-block="podcast-002"] [data-part="cover"]{
aspect-ratio:1;border-radius:1rem;display:grid;place-items:center;
background:linear-gradient(145deg,oklch(0.56 0.17 39.8),oklch(0.34 0.11 25));
color:oklch(0.98 0 0);font-size:2.5rem;font-weight:800;letter-spacing:-0.02em;
}
[data-vibeui-block="podcast-002"] [data-part="eyebrow"]{margin:0 0 0.375rem;color:var(--vibeui-podcast-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase}
[data-vibeui-block="podcast-002"] [data-part="ep-title"]{margin:0 0 0.5rem;font-size:clamp(1.375rem,4cqi,1.75rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700}
[data-vibeui-block="podcast-002"] [data-part="meta"]{margin:0 0 0.75rem;display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.8125rem;color:var(--vibeui-podcast-002-muted)}
[data-vibeui-block="podcast-002"] [data-part="summary"]{margin:0 0 1.25rem;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-podcast-002-muted)}
[data-vibeui-block="podcast-002"] [data-part="player"]{display:flex;align-items:center;gap:0.875rem;margin-bottom:1.25rem}
[data-vibeui-block="podcast-002"] [data-part="play"]{width:3rem;height:3rem;flex:none;border-radius:999px;display:grid;place-items:center;background:var(--vibeui-podcast-002-accent);border:0;cursor:pointer}
[data-vibeui-block="podcast-002"] [data-part="play"]::before{content:"";margin-left:0.1875rem;border-style:solid;border-width:0.5rem 0 0.5rem 0.8125rem;border-color:transparent transparent transparent var(--vibeui-podcast-002-on-accent)}
[data-vibeui-block="podcast-002"] [data-part="play"]:focus-visible{outline:2px solid var(--vibeui-podcast-002-accent);outline-offset:2px}
[data-vibeui-block="podcast-002"] [data-part="track"]{flex:1;height:0.375rem;border-radius:999px;background:var(--vibeui-podcast-002-track);overflow:hidden}
[data-vibeui-block="podcast-002"] [data-part="fill"]{width:35%;height:100%;border-radius:999px;background:var(--vibeui-podcast-002-accent)}
[data-vibeui-block="podcast-002"] [data-part="platforms"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="podcast-002"] [data-part="platform"]{
padding:0.375rem 0.875rem;border-radius:999px;font-size:0.8125rem;font-weight:600;text-decoration:none;
border:1px solid var(--vibeui-podcast-002-border);color:inherit;transition:border-color .16s ease}
[data-vibeui-block="podcast-002"] [data-part="platform"]:hover{border-color:var(--vibeui-podcast-002-accent)}
[data-vibeui-block="podcast-002"] [data-part="platform"]:focus-visible{outline:2px solid var(--vibeui-podcast-002-accent);outline-offset:2px}
@container (min-width: 40rem){
[data-vibeui-block="podcast-002"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="podcast-002"] [data-part="card"]{grid-template-columns:11rem 1fr;gap:2rem;padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLATFORMS = ["Apple Podcasts", "Spotify", "Яндекс Музыка"]

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

/** Карточка выпуска подкаста: обложка, мини-плеер и ссылки на площадки. */
export function Podcast002({
  eyebrow = "Выпуск 12",
  showTitle = "Вайб",
  episodeTitle = "Как ИИ меняет фронтенд",
  summary = "Говорим с Анной Ковалёвой о том, как агенты собирают интерфейсы, где заканчивается автоматизация и что остаётся дизайнеру.",
  durationLabel = "48 мин",
  dateLabel = "6 сентября 2026",
  platforms = DEFAULT_PLATFORMS,
  playLabel = "Слушать выпуск",
  background = "",
  accent,
  className,
  style,
}: Podcast002Props) {
  const palette = {
    ...(accent ? { "--vibeui-podcast-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-podcast-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-podcast-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="podcast-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="card">
            <div data-part="cover" aria-hidden="true">
              {showTitle.charAt(0)}
            </div>
            <div>
              <p data-part="eyebrow">{eyebrow}</p>
              <h2 data-part="ep-title">{episodeTitle}</h2>
              <p data-part="meta">
                <span>{dateLabel}</span>
                <span>{durationLabel}</span>
              </p>
              <p data-part="summary">{summary}</p>
              <div data-part="player">
                <button type="button" data-part="play" aria-label={playLabel} />
                <span
                  data-part="track"
                  role="progressbar"
                  aria-valuenow={35}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Прогресс выпуска"
                >
                  <span data-part="fill" />
                </span>
              </div>
              <div data-part="platforms">
                {platforms.map((platform) => (
                  <a key={platform} href="#" data-part="platform">
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
