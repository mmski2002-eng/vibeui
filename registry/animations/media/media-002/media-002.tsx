import type { ComponentProps, CSSProperties } from "react"

export type Media002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: качество, длительность и т. п. */
  badge?: string
  elapsed?: string
  duration?: string
  /** На паузе — виден большой play по центру; играет — виден только бар. */
  playing?: boolean
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Идея: рамка видео с панелью управления. Кадр — тёмная заглушка вместо
// видео с едва заметной пиктограммой; на паузе поверх неё дышит большая
// кнопка play (расширяющееся кольцо + мягкое свечение), играет — кнопка
// прячется и остаётся только нижняя панель. Полоса прогресса плавно
// растёт и сжимается бесконечным циклом — демонстрационная перемотка без
// единого JS-таймера.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой. Сам кадр видео всегда тёмный
// (эстетика видеоплеера), это не зависит от темы страницы.
const STYLES = `
:where([data-vibeui-block="media-002"]){
--vibeui-media-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-media-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-media-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-media-002-muted:color-mix(in oklab,var(--vibeui-media-002-fg) 62%,transparent);
--vibeui-media-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-media-002-video:oklch(0.16 0.01 265);
--vibeui-media-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-media-002-accent-fg:oklch(from var(--vibeui-media-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-media-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="media-002"]{color-scheme:dark}
[data-vibeui-block="media-002"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-media-002-fg);font-family:var(--vibeui-media-002-font);
}
[data-vibeui-block="media-002"] *{box-sizing:border-box}
[data-vibeui-block="media-002"] [data-part="stage"]{perspective:1400px}
/* Внешняя рамка с паддингом: радужное свечение живёт под карточкой. */
[data-vibeui-block="media-002"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-media-002-border);
background:color-mix(in oklab,var(--vibeui-media-002-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="media-002"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-media-002-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="media-002"][data-flat="true"] [data-part="glow"]{display:none}
/* Карточка непрозрачна и лежит поверх свечения — наружу выходит только размытый ореол. */
[data-vibeui-block="media-002"] [data-part="card"]{
position:relative;z-index:1;overflow:hidden;
border-radius:1rem;border:1px solid var(--vibeui-media-002-border);
background:var(--vibeui-media-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="media-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-media-002-border);
}
[data-vibeui-block="media-002"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="media-002"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-media-002-accent);
background:color-mix(in oklab,var(--vibeui-media-002-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-media-002-accent) 22%,transparent);
}
[data-vibeui-block="media-002"] [data-part="video"]{
position:relative;aspect-ratio:16/9;
background:
radial-gradient(circle at 50% 38%,color-mix(in oklab,var(--vibeui-media-002-accent) 16%,transparent),transparent 60%),
var(--vibeui-media-002-video);
color:oklch(0.98 0 0);
}
[data-vibeui-block="media-002"] [data-part="placeholder"]{
position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
opacity:0.28;
}
[data-vibeui-block="media-002"] [data-part="placeholder"] svg{width:2.5rem;height:2.5rem}
[data-vibeui-block="media-002"] [data-part="playbtn"]{
position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
display:flex;align-items:center;justify-content:center;
width:3.25rem;height:3.25rem;border-radius:9999px;
background:color-mix(in oklab,white 22%,transparent);
backdrop-filter:blur(6px);
box-shadow:0 8px 20px -6px oklch(0 0 0 / 0.45);
animation:vibeui-media-002-pulse 2.6s ease-in-out infinite;
}
[data-vibeui-block="media-002"] [data-part="playbtn"] svg{width:1.25rem;height:1.25rem;margin-left:2px}
[data-vibeui-block="media-002"] [data-part="ring"]{
position:absolute;inset:-6px;border-radius:9999px;
border:1.5px solid color-mix(in oklab,white 55%,transparent);
animation:vibeui-media-002-ping 2.6s ease-out infinite;
}
[data-vibeui-block="media-002"] [data-part="controls"]{
position:absolute;left:0;right:0;bottom:0;z-index:1;
display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.625rem;
background:linear-gradient(to top,oklch(0 0 0 / 0.55),transparent);
}
[data-vibeui-block="media-002"] [data-part="minibtn"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.25rem;height:1.25rem;
}
[data-vibeui-block="media-002"] [data-part="minibtn"] svg{width:0.75rem;height:0.75rem}
[data-vibeui-block="media-002"] [data-part="track"]{
position:relative;flex:1;height:0.25rem;border-radius:9999px;
background:color-mix(in oklab,white 30%,transparent);overflow:hidden;
}
[data-vibeui-block="media-002"] [data-part="fill"]{
position:absolute;left:0;top:0;bottom:0;border-radius:9999px;
background:var(--vibeui-media-002-accent);
animation:vibeui-media-002-fill 4s ease-in-out infinite alternate;
}
[data-vibeui-block="media-002"] [data-part="time"]{
flex:none;font-size:0.5625rem;font-weight:600;font-variant-numeric:tabular-nums;
color:color-mix(in oklab,white 88%,transparent);white-space:nowrap;
}
@keyframes vibeui-media-002-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-media-002-pulse{0%,100%{box-shadow:0 8px 20px -6px oklch(0 0 0 / 0.45)}50%{box-shadow:0 8px 26px -4px color-mix(in oklab,var(--vibeui-media-002-accent) 65%,transparent)}}
@keyframes vibeui-media-002-ping{0%{transform:scale(1);opacity:.55}80%,100%{transform:scale(1.4);opacity:0}}
@keyframes vibeui-media-002-fill{0%{width:8%}100%{width:94%}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="media-002"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="media-002"] [data-part="playbtn"]{animation:none}
[data-vibeui-block="media-002"] [data-part="ring"]{animation:none;opacity:0}
[data-vibeui-block="media-002"] [data-part="fill"]{animation:none;width:38%}
}
`

const PLAY_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
)

const PAUSE_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
)

const FILM_ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="M7 5v14M17 5v14M2.5 9.5h4.5M2.5 14.5h4.5M17 9.5h4.5M17 14.5h4.5" />
  </svg>
)

/**
 * Рамка видео с панелью управления. Один файл, ноль зависимостей,
 * собственная палитра. Пауза/воспроизведение — пропом, анимации на чистом
 * CSS.
 */
export function Media002({
  title = "Демо-ролик",
  badge = "4K",
  elapsed = "0:42",
  duration = "2:15",
  playing = false,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Media002Props) {
  const palette = {
    ...(accent ? { "--vibeui-media-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-media-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="media-002"
        data-slot="video-player"
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                {badge ? <span data-part="badge">{badge}</span> : null}
              </div>
              <div data-part="video">
                <div data-part="placeholder" aria-hidden="true">
                  {FILM_ICON}
                </div>
                {!playing ? (
                  <span data-part="playbtn" aria-hidden="true">
                    <span data-part="ring" />
                    {PLAY_ICON}
                  </span>
                ) : null}
                <div data-part="controls">
                  <span data-part="minibtn" aria-hidden="true">
                    {playing ? PAUSE_ICON : PLAY_ICON}
                  </span>
                  <span data-part="track" aria-hidden="true">
                    <span data-part="fill" />
                  </span>
                  <span data-part="time">
                    {elapsed} / {duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
