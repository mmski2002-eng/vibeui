import type { CSSProperties } from "react"

export type Hero007Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  poster?: string
  eyebrow?: string
  title?: string
  lede?: string
  watchLabel?: string
  watchHref?: string
  duration?: string
  chapters?: { time: string; title: string }[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: hero, построенный вокруг видео. Постер — не <img>, а нарисованная
// сцена из конического градиента и шума: плеер выглядит настоящим, но блок
// остаётся одним файлом без ассетов. Кнопка воспроизведения — обычная ссылка
// на страницу с роликом: hero не тащит плеер и не грузит iframe до клика,
// поэтому не ломает LCP. Под постером — список глав, он же оглавление ролика.
const STYLES = `
:where([data-vibeui-block="hero-007"]){
--vibeui-hero-007-bg:transparent;
--vibeui-hero-007-fg:light-dark(oklch(0.19 0 300),oklch(0.97 0 300));
--vibeui-hero-007-muted:light-dark(oklch(0.5 0 300),oklch(0.7 0 300));
--vibeui-hero-007-line:light-dark(oklch(0.19 0 300 / 15%),oklch(1 0 0 / 16%));
--vibeui-hero-007-accent:light-dark(oklch(0.52 0.2 39.8),oklch(0.7 0.19 39.8));
--vibeui-hero-007-accent-fg:oklch(0.15 0.02 39.8);
/* Постер всегда тёмный — это кадр, а не подложка; текст на нём светлый в обеих темах. */
--vibeui-hero-007-on-poster:oklch(0.97 0 300);
--vibeui-hero-007-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-007"]{color-scheme:dark}
[data-vibeui-block="hero-007"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-007-bg);color:var(--vibeui-hero-007-fg);
font-family:var(--vibeui-hero-007-sans);
}
[data-vibeui-block="hero-007"] *{box-sizing:border-box}
[data-vibeui-block="hero-007"] [data-part="shell"]{max-width:66rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="hero-007"] [data-part="eyebrow"]{
margin:0 0 0.875rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-hero-007-accent);
}
[data-vibeui-block="hero-007"] h1{
margin:0;max-width:24ch;font-size:clamp(1.875rem,5.6cqi,3.25rem);line-height:1.08;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-007"] [data-part="lede"]{
margin:1rem 0 0;max-width:36rem;font-size:clamp(0.9375rem,1.5cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-hero-007-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-007"] [data-part="player"]{
position:relative;display:block;margin:2.25rem 0 0;aspect-ratio:16 / 9;border-radius:1rem;overflow:hidden;
border:1px solid var(--vibeui-hero-007-line);text-decoration:none;color:var(--vibeui-hero-007-on-poster);
transition:transform .2s ease,border-color .2s ease;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="hero-007"] [data-part="player"][data-empty="true"]{background:
radial-gradient(60% 80% at 22% 18%,color-mix(in oklab,var(--vibeui-hero-007-accent) 55%,transparent),transparent 70%),
conic-gradient(from 210deg at 70% 80%,oklch(0.35 0.13 39.8),oklch(0.28 0.1 25),oklch(0.22 0.06 45),oklch(0.35 0.13 39.8));}
[data-vibeui-block="hero-007"] [data-part="player"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="hero-007"] [data-part="player"]:hover{transform:translateY(-2px);border-color:var(--vibeui-hero-007-accent)}
[data-vibeui-block="hero-007"] [data-part="player"]:focus-visible{outline:2px solid var(--vibeui-hero-007-accent);outline-offset:4px}
[data-vibeui-block="hero-007"] [data-part="scrim"]{
position:absolute;inset:0;background:linear-gradient(to top,oklch(0 0 0 / 55%),transparent 55%);
}
[data-vibeui-block="hero-007"] [data-part="play"]{
position:absolute;inset:0;margin:auto;width:4.5rem;height:4.5rem;border-radius:9999px;
display:flex;align-items:center;justify-content:center;
background:var(--vibeui-hero-007-accent);color:var(--vibeui-hero-007-accent-fg);
box-shadow:0 0 0 0.75rem color-mix(in oklab,var(--vibeui-hero-007-accent) 22%,transparent);
transition:box-shadow .2s ease;
}
[data-vibeui-block="hero-007"] [data-part="player"]:hover [data-part="play"]{box-shadow:0 0 0 1.125rem color-mix(in oklab,var(--vibeui-hero-007-accent) 22%,transparent)}
[data-vibeui-block="hero-007"] [data-part="caption"]{
position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.875rem 1.125rem;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="hero-007"] [data-part="duration"]{
padding:0.1875rem 0.5rem;border-radius:0.375rem;background:oklch(0 0 0 / 55%);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="hero-007"] [data-part="chapters"]{
list-style:none;display:grid;grid-template-columns:1fr;gap:0;margin:1.5rem 0 0;padding:0;
border-top:1px solid var(--vibeui-hero-007-line);
}
[data-vibeui-block="hero-007"] [data-part="chapters"] li{
display:flex;align-items:baseline;gap:0.75rem;padding:0.75rem 0;
border-bottom:1px solid var(--vibeui-hero-007-line);font-size:0.875rem;
}
[data-vibeui-block="hero-007"] [data-part="time"]{
flex:0 0 auto;font-size:0.75rem;font-weight:650;color:var(--vibeui-hero-007-accent);font-variant-numeric:tabular-nums;
}
@container (min-width: 40rem){
[data-vibeui-block="hero-007"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="hero-007"] [data-part="chapters"]{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHAPTERS = [
  { time: "00:00", title: "Что такое AI-native секции" },
  { time: "01:12", title: "Выбираем дизайн в каталоге" },
  { time: "03:40", title: "Copy for AI и установка" },
  { time: "05:58", title: "Правим тексты и цвета" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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

/** Hero с видео-заглушкой: нарисованный постер, кнопка play и список глав. */
export function Hero007({
  eyebrow = "Обзор за шесть минут",
  poster = "",
  title = "Посмотрите, как собирается страница",
  lede = "Ролик без слайдов: экран, каталог и агент, который ставит секцию в реальный проект.",
  watchLabel = "Смотреть обзор продукта",
  watchHref = "#",
  duration = "6:24",
  chapters = DEFAULT_CHAPTERS,
  accent,
  background = "",
  className,
  style,
}: Hero007Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h1>{title}</h1>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <a
            data-part="player"
            data-empty={poster ? undefined : "true"}
            href={watchHref}
            aria-label={watchLabel}
          >
            {poster ? (
              <img src={poster} alt="" loading="lazy" decoding="async" />
            ) : null}
            <span data-part="scrim" aria-hidden="true" />
            <span data-part="play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                <path d="M9 6.5 18 12l-9 5.5z" fill="currentColor" />
              </svg>
            </span>
            <span data-part="caption">
              <span>{watchLabel}</span>
              <span data-part="duration">{duration}</span>
            </span>
          </a>

          {chapters.length > 0 ? (
            <ul data-part="chapters">
              {chapters.slice(0, 6).map((chapter) => (
                <li key={chapter.time}>
                  <span data-part="time">{chapter.time}</span>
                  <span>{chapter.title}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
