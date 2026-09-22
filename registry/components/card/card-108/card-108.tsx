"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card108Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  videoHref?: string
  video?: string
  quote?: string
  image?: string
  href?: string
  role?: string
  cohort?: string
  videoLabel?: string
  onVideo?: () => void
  copy?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока testimonials-018, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-108"]){
--vibeui-card-108-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-108-card:light-dark(#f8fafc,#242424);
--vibeui-card-108-display:"Unbounded","Manrope",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-108-line:light-dark(#e5e7eb,#2e2e2e);
--vibeui-card-108-marker:light-dark(#d9f99d,rgb(163 230 53 / .3));
--vibeui-card-108-muted:light-dark(#6b7280,#a3a3a3);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-108"]{color-scheme:dark}
[data-vibeui-block="card-108"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-108"] *{box-sizing:border-box}
[data-vibeui-block="card-108"]{display:flex;flex-direction:column;gap:1rem;width:min(22rem,78vw);padding:1.5rem;border-radius:1.25rem;background:var(--vibeui-card-108-card);border:1px solid var(--vibeui-card-108-line);transition:border-color .3s,transform .3s}
[data-vibeui-block="card-108"]:hover{border-color:color-mix(in oklab,var(--vibeui-card-108-accent) 40%,var(--vibeui-card-108-line));transform:translateY(-3px)}
[data-vibeui-block="card-108"] [data-part="video"]{position:relative;display:block;width:100%;aspect-ratio:16/10;overflow:hidden;border:0;padding:0;border-radius:.9rem;background:light-dark(#e5e7eb,#1f2430);cursor:pointer;font:inherit;color:inherit}
[data-vibeui-block="card-108"] [data-part="video"] img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 1.2s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-108"] [data-part="video"]:hover img{transform:scale(1.04)}
[data-vibeui-block="card-108"] [data-part="video"]:focus-visible{outline:2px solid var(--vibeui-card-108-accent);outline-offset:3px}
[data-vibeui-block="card-108"] [data-part="play"]{position:absolute;left:1rem;bottom:1rem;display:inline-flex;align-items:center;gap:.5rem;padding:.5rem .9rem .5rem .5rem;border-radius:999px;background:#fff;color:#111827;font-size:.8rem;font-weight:600}
[data-vibeui-block="card-108"] [data-part="play"]::before{content:"";width:1.5rem;height:1.5rem;border-radius:50%;background:var(--vibeui-card-108-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 6.5v11l9-5.5z' fill='%23fff'/%3E%3C/svg%3E") center/1rem no-repeat}
[data-vibeui-block="card-108"] [data-part="quote"]{margin:0;font-size:.98rem;line-height:1.5}
[data-vibeui-block="card-108"] [data-part="quote"]::before{content:"“";display:block;font-family:var(--vibeui-card-108-display);font-size:2.5rem;line-height:.6;color:var(--vibeui-card-108-accent);margin-bottom:.4rem}
[data-vibeui-block="card-108"] [data-part="who"]{display:flex;align-items:center;gap:.75rem;margin-top:auto;padding-top:1rem;border-top:1px solid var(--vibeui-card-108-line)}
[data-vibeui-block="card-108"] [data-part="avatar"]{width:2.5rem;height:2.5rem;border-radius:50%;object-fit:cover;flex:none;background:light-dark(#e5e7eb,#1f2430)}
[data-vibeui-block="card-108"] [data-part="name"]{display:block;font-weight:600;color:inherit;text-decoration:none}
[data-vibeui-block="card-108"] a[data-part="name"]{border-bottom:1px solid var(--vibeui-card-108-accent)}
[data-vibeui-block="card-108"] [data-part="role"]{display:block;font-size:.8rem;color:var(--vibeui-card-108-muted)}
[data-vibeui-block="card-108"] [data-part="cohort"]{margin-left:auto;flex:none;padding:.25rem .55rem;border-radius:.4rem;background:var(--vibeui-card-108-marker);color:#1a2e05;font-size:.68rem;font-weight:700}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-108"] *{animation:none!important;transition:none!important}}
`

/** Карточка бегущей строки: кнопка видео с обложкой, цитата, аватар, имя со ссылкой и роль. */
export function Card108({
  name = "Марина Соколова",
  videoHref = "Карточка отзыва с видео",
  video = "/demo/realty/object-02.webp",
  quote = "Самое ценное — ревью. Куратор разобрал мою домашку на 20 минут видео и показал, где я теряю пользователя. На работе так никто не делает.",
  image = "/demo/realty/object-01.webp",
  href = "#",
  role = "UI-дизайнер, Авито",
  cohort = "Карточка отзыва с видео",
  videoLabel = "Видео-отзыв",
  onVideo,
  copy = 0,
  accent,
  className,
  style,
  ...props
}: Card108Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-108-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-108" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-108"
        className={className}
        style={palette}
      >
        {videoHref ? (
          <button type="button" data-part="video" onClick={onVideo} aria-label={`${videoLabel}: ${name}`} tabIndex={copy === 1 ? -1 : undefined}>
            {video ? <img src={video} alt="" loading="lazy" /> : null}
            <span data-part="play">{videoLabel}</span>
          </button>
        ) : null}
        <blockquote data-part="quote">{quote}</blockquote>
        <div data-part="who">
          {image ? <img data-part="avatar" src={image} alt="" loading="lazy" /> : <span data-part="avatar" />}
          <span>
            {href ? (
              <a data-part="name" href={href} tabIndex={copy === 1 ? -1 : undefined}>
                {name}
              </a>
            ) : (
              <span data-part="name">{name}</span>
            )}
            <span data-part="role">{role}</span>
          </span>
          {cohort ? <span data-part="cohort">{cohort}</span> : null}
        </div>
      </li>
    </>
  )
}
