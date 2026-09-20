import type { CSSProperties, ReactNode } from "react"

export type Podcast002Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
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
--vibeui-podcast-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-podcast-002-on-accent:oklch(from var(--vibeui-podcast-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-podcast-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-podcast-002-dur-2:180ms;
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
position:relative;aspect-ratio:1;border-radius:1rem;display:grid;place-items:center;
color:oklch(0.98 0 0);font-size:2.5rem;font-weight:800;letter-spacing:-0.02em;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="podcast-002"] [data-part="cover"][data-empty="true"]{background:linear-gradient(145deg,light-dark(oklch(0.2 0 0),oklch(0.92 0 0)),oklch(0.34 0.11 25));}
[data-vibeui-block="podcast-002"] [data-part="cover"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="podcast-002"] [data-part="eyebrow"]{margin:0 0 0.375rem;color:var(--vibeui-podcast-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase}
[data-vibeui-block="podcast-002"] [data-part="ep-title"]{margin:0 0 0.5rem;font-size:clamp(1.375rem,4cqi,1.75rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700}
[data-vibeui-block="podcast-002"] [data-part="meta"]{margin:0 0 0.75rem;display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.8125rem;color:var(--vibeui-podcast-002-muted)}
[data-vibeui-block="podcast-002"] [data-part="summary"]{margin:0 0 1.25rem;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-podcast-002-muted)}
[data-vibeui-block="podcast-002"] [data-part="player"]{display:flex;align-items:center;gap:0.875rem;margin-bottom:1.25rem}
[data-vibeui-block="podcast-002"] [data-part="play"]{width:3rem;height:3rem;flex:none;border-radius:999px;display:grid;place-items:center;background:var(--vibeui-podcast-002-accent);border:0;cursor:pointer;color:oklch(from var(--vibeui-podcast-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="podcast-002"] [data-part="play"]::before{content:"";margin-left:0.1875rem;border-style:solid;border-width:0.5rem 0 0.5rem 0.8125rem;border-color:transparent transparent transparent var(--vibeui-podcast-002-on-accent)}
[data-vibeui-block="podcast-002"] [data-part="play"]:focus-visible{outline:2px solid var(--vibeui-podcast-002-accent);outline-offset:2px}
[data-vibeui-block="podcast-002"] [data-part="track"]{flex:1;height:0.375rem;border-radius:999px;background:var(--vibeui-podcast-002-track);overflow:hidden}
[data-vibeui-block="podcast-002"] [data-part="fill"]{width:35%;height:100%;border-radius:999px;background:var(--vibeui-podcast-002-accent);color:oklch(from var(--vibeui-podcast-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="podcast-002"] [data-part="platforms"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="podcast-002"] [data-part="platform"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="podcast-002"] [data-part="platform"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.375rem 0.875rem;border-radius:999px;font-size:0.8125rem;font-weight:600;text-decoration:none;
border:1px solid var(--vibeui-podcast-002-border);color:inherit;transition:border-color var(--vibeui-podcast-002-dur-2) ease}
[data-vibeui-block="podcast-002"] [data-part="platform"]:hover{border-color:var(--vibeui-podcast-002-accent)}
[data-vibeui-block="podcast-002"] [data-part="platform"]:focus-visible{outline:2px solid var(--vibeui-podcast-002-accent);outline-offset:2px}
@container (min-width: 40rem){
[data-vibeui-block="podcast-002"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="podcast-002"] [data-part="card"]{grid-template-columns:11rem 1fr;gap:2rem;padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="podcast-002"] *{animation:none!important;transition:none!important}}
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
  image = "",
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
            <div
              data-part="cover"
              data-empty={image ? undefined : "true"}
              aria-hidden="true"
            >
              {image ? (
                <img src={image} alt="" loading="lazy" decoding="async" />
              ) : null}
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
                    {platformIcon(platform)}
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
