"use client"

import { useState, type CSSProperties } from "react"

type Video002Clip = {
  title: string
  duration: string
}

export type Video002Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  eyebrow?: string
  title?: string
  clips?: Video002Clip[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Видео-плейлист: слева большой кадр выбранного ролика с play, справа список
// роликов с длительностью. Выбор ролика меняет постер и подпись (клиентское
// состояние, без реального видео). Активный пункт списка выделен акцентом.
// Формат «плейлист уроков» на странице обучения.
const STYLES = `
:where([data-vibeui-block="video-002"]){
--vibeui-video-002-bg:transparent;
--vibeui-video-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-video-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-video-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-video-002-item:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-video-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-video-002-on-accent:oklch(from var(--vibeui-video-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-video-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="video-002"]{color-scheme:dark}
[data-vibeui-block="video-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-video-002-bg);color:var(--vibeui-video-002-ink);
font-family:var(--vibeui-video-002-font);
}
[data-vibeui-block="video-002"] [data-part="shell"]{max-width:64rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="video-002"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-video-002-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="video-002"] [data-part="title"]{margin:0 0 1.75rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="video-002"] [data-part="layout"]{display:grid;gap:1.25rem;grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="video-002"] [data-part="stage"]{
position:relative;display:flex;align-items:flex-end;aspect-ratio:16 / 9;border-radius:1.125rem;overflow:hidden;padding:1rem;color:oklch(0.98 0 0);background:linear-gradient(140deg,light-dark(oklch(0.2 0 0),oklch(0.92 0 0)),oklch(0.3 0.1 25))
}
[data-vibeui-block="video-002"] [data-part="stage"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="video-002"] [data-part="play"]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:4rem;height:4rem;border-radius:999px;display:grid;place-items:center;background:oklch(1 0 0 / 92%)}
[data-vibeui-block="video-002"] [data-part="play"]::before{content:"";margin-left:0.25rem;border-style:solid;border-width:0.6875rem 0 0.6875rem 1.125rem;border-color:transparent transparent transparent oklch(0.2 0 0)}
[data-vibeui-block="video-002"] [data-part="stage-title"]{position:relative;font-size:1rem;font-weight:640}
[data-vibeui-block="video-002"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="video-002"] [data-part="clip"]{
display:grid;grid-template-columns:auto 1fr auto;gap:0.75rem;align-items:center;width:100%;
padding:0.75rem;border:1px solid var(--vibeui-video-002-border);border-radius:0.875rem;
background:var(--vibeui-video-002-item);color:inherit;font:inherit;text-align:left;cursor:pointer;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="video-002"] [data-part="clip"]:hover{border-color:var(--vibeui-video-002-accent)}
[data-vibeui-block="video-002"] [data-part="clip"]:focus-visible{outline:2px solid var(--vibeui-video-002-accent);outline-offset:2px}
[data-vibeui-block="video-002"] [data-part="clip"][aria-current="true"]{border-color:var(--vibeui-video-002-accent);box-shadow:0 0 0 1px var(--vibeui-video-002-accent)}
[data-vibeui-block="video-002"] [data-part="num"]{width:1.75rem;height:1.75rem;flex:none;border-radius:0.5rem;display:grid;place-items:center;font-size:0.8125rem;font-weight:700;background:color-mix(in oklab,var(--vibeui-video-002-accent) 14%,transparent);color:var(--vibeui-video-002-accent)}
[data-vibeui-block="video-002"] [data-part="clip-title"]{font-size:0.9375rem;font-weight:600;line-height:1.3;min-width:0}
[data-vibeui-block="video-002"] [data-part="clip-dur"]{font-size:0.8125rem;color:var(--vibeui-video-002-muted);font-variant-numeric:tabular-nums}
@container (min-width: 48rem){
[data-vibeui-block="video-002"] [data-part="shell"]{padding:4rem 2rem}
[data-vibeui-block="video-002"] [data-part="layout"]{grid-template-columns:1.4fr 1fr;align-items:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="video-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CLIPS: Video002Clip[] = [
  { title: "Знакомство с каталогом", duration: "2:14" },
  { title: "Copy for AI: как это работает", duration: "3:40" },
  { title: "Своя палитра компонента", duration: "4:05" },
  { title: "Сборка лендинга за вечер", duration: "6:22" },
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

/** Видео-плейлист: кадр выбранного ролика и список с переключением. */
export function Video002({
  eyebrow = "Уроки",
  image = "",
  title = "Плейлист для старта",
  clips = DEFAULT_CLIPS,
  background = "",
  accent,
  className,
  style,
}: Video002Props) {
  const [active, setActive] = useState(0)
  const current = clips[active] ?? clips[0]

  const palette = {
    ...(accent ? { "--vibeui-video-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-video-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-video-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="video-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="layout">
            <div data-part="stage" data-empty={image ? undefined : "true"}>
              {image ? (
                <img src={image} alt="" loading="lazy" decoding="async" />
              ) : null}
              <span data-part="play" aria-hidden="true" />
              <span data-part="stage-title">{current?.title}</span>
            </div>
            <ul data-part="list">
              {clips.map((clip, index) => (
                <li key={clip.title}>
                  <button
                    type="button"
                    data-part="clip"
                    aria-current={index === active ? "true" : undefined}
                    onClick={() => setActive(index)}
                  >
                    <span data-part="num">{index + 1}</span>
                    <span data-part="clip-title">{clip.title}</span>
                    <span data-part="clip-dur">{clip.duration}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
