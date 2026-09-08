import type { CSSProperties } from "react"

type Video003Item = {
  title: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  duration: string
  views: string
}

export type Video003Props = {
  eyebrow?: string
  title?: string
  videos?: Video003Item[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Сетка роликов карточками: тёплый постер-градиент с кнопкой play и меткой
// длительности, под ним название и число просмотров. Три колонки на широком
// экране. Формат витрины видео-канала или подборки записей; постер —
// градиент, реальные кадры подставит приложение.
const STYLES = `
:where([data-vibeui-block="video-003"]){
--vibeui-video-003-bg:transparent;
--vibeui-video-003-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-video-003-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-video-003-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-video-003-card:light-dark(oklch(0.99 0 0),oklch(0.2 0 0));
--vibeui-video-003-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-video-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="video-003"]{color-scheme:dark}
[data-vibeui-block="video-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-video-003-bg);color:var(--vibeui-video-003-ink);
font-family:var(--vibeui-video-003-font);
}
[data-vibeui-block="video-003"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="video-003"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-video-003-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="video-003"] [data-part="title"]{margin:0 0 2rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="video-003"] [data-part="grid"]{display:grid;gap:1.25rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="video-003"] [data-part="card"]{min-inline-size:0;display:flex;flex-direction:column;gap:0.625rem;text-decoration:none;color:inherit}
[data-vibeui-block="video-003"] [data-part="poster"]{
position:relative;display:block;aspect-ratio:16 / 9;border-radius:0.875rem;overflow:hidden;
transition:transform .18s ease;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="video-003"] [data-part="poster"][data-empty="true"]{background:linear-gradient(140deg,oklch(0.52 0.16 39.8),oklch(0.32 0.11 28));}
[data-vibeui-block="video-003"] [data-part="poster"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="video-003"] [data-part="card"]:hover [data-part="poster"]{transform:translateY(-3px)}
[data-vibeui-block="video-003"] [data-part="card"]:focus-visible [data-part="poster"]{outline:2px solid var(--vibeui-video-003-accent);outline-offset:2px}
[data-vibeui-block="video-003"] [data-part="card"]:nth-child(3n+2) [data-part="poster"]{background:linear-gradient(140deg,oklch(0.56 0.15 55),oklch(0.34 0.1 42))}
[data-vibeui-block="video-003"] [data-part="card"]:nth-child(3n+3) [data-part="poster"]{background:linear-gradient(140deg,oklch(0.48 0.15 25),oklch(0.3 0.1 18))}
[data-vibeui-block="video-003"] [data-part="play"]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:3rem;height:3rem;border-radius:999px;display:grid;place-items:center;background:oklch(1 0 0 / 92%)}
[data-vibeui-block="video-003"] [data-part="play"]::before{content:"";margin-left:0.1875rem;border-style:solid;border-width:0.5rem 0 0.5rem 0.875rem;border-color:transparent transparent transparent oklch(0.2 0.05 39.8)}
[data-vibeui-block="video-003"] [data-part="dur"]{position:absolute;right:0.5rem;bottom:0.5rem;padding:0.125rem 0.4375rem;border-radius:0.375rem;background:oklch(0.15 0.02 39.8 / 65%);color:oklch(0.98 0 0);font-size:0.75rem;font-weight:600}
[data-vibeui-block="video-003"] [data-part="v-title"]{margin:0;font-size:0.9375rem;font-weight:640;line-height:1.35}
[data-vibeui-block="video-003"] [data-part="views"]{font-size:0.8125rem;color:var(--vibeui-video-003-muted)}
@container (min-width: 44rem){
[data-vibeui-block="video-003"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="video-003"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="video-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VIDEOS: Video003Item[] = [
  {
    title: "Обзор каталога за две минуты",
    duration: "2:14",
    views: "12 тыс. просмотров",
  },
  {
    title: "Copy for AI на реальном проекте",
    duration: "5:31",
    views: "8,4 тыс. просмотров",
  },
  {
    title: "Как собрать лендинг за вечер",
    duration: "9:12",
    views: "21 тыс. просмотров",
  },
  {
    title: "Своя палитра без токенов темы",
    duration: "4:05",
    views: "5,2 тыс. просмотров",
  },
  {
    title: "Блоки против готовых конструкторов",
    duration: "7:48",
    views: "14 тыс. просмотров",
  },
  {
    title: "Разбор структуры реестра",
    duration: "11:03",
    views: "3,9 тыс. просмотров",
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

/** Сетка роликов карточками с постером-градиентом, play и просмотрами. */
export function Video003({
  eyebrow = "Видео",
  title = "Записи и разборы",
  videos = DEFAULT_VIDEOS,
  background = "",
  accent,
  className,
  style,
}: Video003Props) {
  const palette = {
    ...(accent ? { "--vibeui-video-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-video-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-video-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="video-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="grid">
            {videos.map((video) => (
              <a key={video.title} href="#" data-part="card">
                <span
                  data-part="poster"
                  data-empty={video.image ? undefined : "true"}
                >
                  {video.image ? (
                    <img
                      src={video.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  <span data-part="play" aria-hidden="true" />
                  <span data-part="dur">{video.duration}</span>
                </span>
                <span data-part="v-title">{video.title}</span>
                <span data-part="views">{video.views}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
