import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

export type Video001Props = {
  eyebrow?: string
  title?: string
  summary?: string
  posterTitle?: string
  /** Кадр постера. Пусто — остаётся тёплый градиент-заглушка. */
  poster?: string
  /** Описание кадра. Пусто — постер считается оформлением. */
  posterAlt?: string
  durationLabel?: string
  ctaLabel?: string
  ctaHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Видео-секция с постером: крупный кадр 16:9 с кнопкой play по центру,
// подписью и длительностью в углу. Кадр берётся из пропа poster, а без него
// остаётся тёплый градиент — блок обязан работать без единого ассета.
// Кнопка play — круг с треугольником из бордюров. Это заглушка плеера: реальное видео
// подключает приложение по клику. Слева текст, справа кадр на широком экране.
const STYLES = `[data-vibeui-block="video-001"] [data-part="heading"]{margin-bottom:0.75rem}

:where([data-vibeui-block="video-001"]){
--vibeui-video-001-bg:transparent;
--vibeui-video-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-video-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-video-001-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-video-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-video-001-on-accent:oklch(from var(--vibeui-video-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
/* Фирменный красный YouTube: кнопка «Смотреть на YouTube» узнаётся по нему. */
--vibeui-video-001-youtube:#ff0000;
--vibeui-video-001-youtube-hover:#cc0000;
--vibeui-video-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-video-001-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="video-001"]{color-scheme:dark}
[data-vibeui-block="video-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-video-001-bg);color:var(--vibeui-video-001-ink);
font-family:var(--vibeui-video-001-font);
}
[data-vibeui-block="video-001"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:2rem;align-items:center}
[data-vibeui-block="video-001"] [data-part="summary"]{margin:0 0 1.5rem;color:var(--vibeui-video-001-muted);font-size:1.0625rem;line-height:1.6}
[data-vibeui-block="video-001"] [data-part="cta"]{
display:inline-flex;align-items:center;gap:0.625rem;height:2.75rem;padding:0 1.375rem;border-radius:999px;
background:var(--vibeui-video-001-youtube);color:oklch(1 0 0);
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:background-color var(--vibeui-video-001-dur-2) ease;
}
[data-vibeui-block="video-001"] [data-part="cta"]:hover{background:var(--vibeui-video-001-youtube-hover)}
[data-vibeui-block="video-001"] [data-part="cta"]:focus-visible{outline:2px solid var(--vibeui-video-001-youtube);outline-offset:3px}
/* Значок YouTube на кнопке: белый скруглённый прямоугольник с треугольником
   в цвет кнопки — узнаваемая марка прямо в подписи. */
[data-vibeui-block="video-001"] [data-part="cta"] svg{width:1.375rem;height:auto;flex:none}
[data-vibeui-block="video-001"] [data-part="player"]{
position:relative;display:flex;align-items:flex-end;aspect-ratio:16 / 9;border-radius:1.125rem;overflow:hidden;
padding:1rem;text-decoration:none;color:oklch(0.98 0 0);
background:linear-gradient(140deg,light-dark(oklch(0.2 0 0),oklch(0.92 0 0)),oklch(0.3 0.1 25));
transition:transform var(--vibeui-video-001-dur-2) ease;
}
[data-vibeui-block="video-001"] [data-part="player"]:hover{transform:translateY(-2px)}
/* Кадр и затемнение под подписями: без затемнения белый текст теряется на
   светлой фотографии, а с ним постер читается при любом кадре. */
[data-vibeui-block="video-001"] [data-part="poster"]{
position:absolute;inset:0;z-index:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="video-001"] [data-part="scrim"]{
position:absolute;inset:0;z-index:1;
background:linear-gradient(to top,oklch(0.14 0 0 / 78%) 0,oklch(0.14 0 0 / 22%) 45%,oklch(0.14 0 0 / 34%) 100%);
}
[data-vibeui-block="video-001"] [data-part="player"]:focus-visible{outline:2px solid var(--vibeui-video-001-accent);outline-offset:3px}
/* Кнопка play: круг с треугольником из бордюров по центру кадра. */
[data-vibeui-block="video-001"] [data-part="play"]{
position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;
width:4rem;height:4rem;border-radius:999px;display:grid;place-items:center;
background:oklch(1 0 0 / 92%);
}
[data-vibeui-block="video-001"] [data-part="play"]::before{
content:"";margin-left:0.25rem;
border-style:solid;border-width:0.6875rem 0 0.6875rem 1.125rem;
border-color:transparent transparent transparent oklch(0.2 0 0);
}
[data-vibeui-block="video-001"] [data-part="poster-title"]{position:relative;z-index:2;font-size:1rem;font-weight:640}
[data-vibeui-block="video-001"] [data-part="duration"]{position:absolute;z-index:2;right:1rem;top:1rem;padding:0.1875rem 0.5rem;border-radius:0.375rem;background:oklch(0.15 0 0 / 55%);font-size:0.75rem;font-weight:600}
@container (min-width: 48rem){
[data-vibeui-block="video-001"] [data-part="shell"]{padding:4rem 2rem;grid-template-columns:1fr 1.15fr;gap:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="video-001"] *{animation:none!important;transition:none!important}}
`

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

/** Видео-секция с постером-заглушкой: кадр 16:9, кнопка play, текст сбоку. */
export function Video001({
  eyebrow = "Как это работает",
  title = "Посмотрите за две минуты",
  summary = "Короткий ролик о том, как выбрать блок в каталоге, отдать его агенту и получить готовую секцию в своём проекте.",
  posterTitle = "Обзор каталога VibeUI",
  poster = "",
  posterAlt = "",
  durationLabel = "2:14",
  ctaLabel = "Смотреть на YouTube",
  ctaHref = "#",
  background = "",
  accent,
  className,
  style,
}: Video001Props) {
  const palette = {
    ...(accent ? { "--vibeui-video-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-video-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-video-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="video-001"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              accent={accent}
            />
            <p data-part="summary">{summary}</p>
            <a href={ctaHref} data-part="cta">
              <svg viewBox="0 0 28 20" aria-hidden="true">
                <path
                  d="M27.4 3.12A3.52 3.52 0 0 0 24.94.64C22.77.06 14 .06 14 .06S5.23.06 3.06.64A3.52 3.52 0 0 0 .6 3.12 36.67 36.67 0 0 0 0 10a36.67 36.67 0 0 0 .6 6.88 3.52 3.52 0 0 0 2.46 2.48C5.23 19.94 14 19.94 14 19.94s8.77 0 10.94-.58a3.52 3.52 0 0 0 2.46-2.48A36.67 36.67 0 0 0 28 10a36.67 36.67 0 0 0-.6-6.88Z"
                  fill="#fff"
                />
                <path d="M11.2 14.29 18.5 10l-7.3-4.29Z" fill="#ff0000" />
              </svg>
              {ctaLabel}
            </a>
          </div>
          <a
            href={ctaHref}
            data-part="player"
            aria-label={`Смотреть: ${posterTitle}`}
          >
            {poster ? (
              <>
                <img
                  src={poster}
                  alt={posterAlt}
                  data-part="poster"
                  loading="lazy"
                  decoding="async"
                />
                <span data-part="scrim" aria-hidden="true" />
              </>
            ) : null}
            <span data-part="play" aria-hidden="true" />
            <span data-part="duration">{durationLabel}</span>
            <span data-part="poster-title">{posterTitle}</span>
          </a>
        </div>
      </section>
    </>
  )
}
