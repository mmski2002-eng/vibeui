import type { ComponentProps, CSSProperties } from "react"

export type Media001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  /** Пилюля справа от заголовка: формат файла и т. п. */
  badge?: string
  trackTitle?: string
  trackArtist?: string
  /** Текущая позиция воспроизведения (декоративная). */
  elapsed?: string
  duration?: string
  /** Доля прослушанного, 0–100: столько полосок волны красятся акцентом. */
  progress?: number
  /** Состояние кнопки: играет / на паузе. Меняет иконку и пульсацию. */
  playing?: boolean
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

// Идея: аудиоплеер с живой волной. Каждая полоска колышется по высоте
// собственным бесконечным CSS-циклом со сдвигом фазы (animation-delay по
// индексу) — волна выглядит непрерывно бегущей без единого JS-таймера.
// Прослушанная часть (по проп progress) выделена акцентным цветом, а не
// только числом — состояние читается визуально на самой волне.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="media-001"]){
--vibeui-media-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-media-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-media-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-media-001-muted:color-mix(in oklab,var(--vibeui-media-001-fg) 62%,transparent);
--vibeui-media-001-bar:color-mix(in oklab,var(--vibeui-media-001-fg) 22%,transparent);
--vibeui-media-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-media-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-media-001-accent-fg:oklch(from var(--vibeui-media-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-media-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="media-001"]{color-scheme:dark}
[data-vibeui-block="media-001"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-media-001-fg);font-family:var(--vibeui-media-001-font);
}
[data-vibeui-block="media-001"] *{box-sizing:border-box}
[data-vibeui-block="media-001"] [data-part="stage"]{perspective:1400px}
/* Внешняя рамка с паддингом: радужное свечение живёт под карточкой. */
[data-vibeui-block="media-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-media-001-border);
background:color-mix(in oklab,var(--vibeui-media-001-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="media-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#6366f1,#8b5cf6);
filter:blur(7px);opacity:0.6;transform-origin:center bottom;
animation:vibeui-media-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="media-001"][data-flat="true"] [data-part="glow"]{display:none}
/* Карточка непрозрачна и лежит поверх свечения — наружу выходит только размытый ореол. */
[data-vibeui-block="media-001"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-media-001-border);
background:var(--vibeui-media-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="media-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-media-001-border);
}
[data-vibeui-block="media-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="media-001"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1rem;min-width:1rem;padding:0 0.3125rem;border-radius:9999px;
font-size:0.5625rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-media-001-accent);
background:color-mix(in oklab,var(--vibeui-media-001-accent) 14%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-media-001-accent) 22%,transparent);
}
[data-vibeui-block="media-001"] [data-part="body"]{padding:0.875rem 0.875rem 1rem}
[data-vibeui-block="media-001"] [data-part="player"]{
display:flex;align-items:center;gap:0.75rem;
}
[data-vibeui-block="media-001"] [data-part="playbtn"]{
position:relative;display:flex;align-items:center;justify-content:center;
flex:none;width:2.75rem;height:2.75rem;border-radius:9999px;
background:var(--vibeui-media-001-accent);color:oklch(from var(--vibeui-media-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
box-shadow:0 4px 12px -4px color-mix(in oklab,var(--vibeui-media-001-accent) 55%,transparent);
}
[data-vibeui-block="media-001"] [data-part="playbtn"] svg{width:1rem;height:1rem}
[data-vibeui-block="media-001"] [data-part="ring"]{
position:absolute;inset:-3px;border-radius:9999px;
border:1.5px solid var(--vibeui-media-001-accent);
animation:vibeui-media-001-ping 2.2s ease-out infinite;
}
[data-vibeui-block="media-001"] [data-part="meta"]{min-width:0;flex:1}
[data-vibeui-block="media-001"] [data-part="track"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.8125rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="media-001"] [data-part="artist"]{
display:block;margin-top:0.125rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;line-height:1.3;color:var(--vibeui-media-001-muted);
}
[data-vibeui-block="media-001"] [data-part="bars"]{
display:flex;align-items:center;gap:0.1875rem;height:2.5rem;margin-top:0.875rem;
}
[data-vibeui-block="media-001"] [data-part="bar"]{
flex:1;min-width:0.125rem;height:100%;border-radius:9999px;
background:var(--vibeui-media-001-bar);
animation-name:vibeui-media-001-wave;animation-iteration-count:infinite;
animation-timing-function:ease-in-out;
}
[data-vibeui-block="media-001"] [data-part="bar"][data-played="true"]{
background:var(--vibeui-media-001-accent);color:oklch(from var(--vibeui-media-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="media-001"] [data-part="time"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.5rem;font-size:0.625rem;font-weight:550;font-variant-numeric:tabular-nums;
color:var(--vibeui-media-001-muted);
}
@keyframes vibeui-media-001-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-media-001-ping{0%{transform:scale(1);opacity:.5}80%,100%{transform:scale(1.35);opacity:0}}
@keyframes vibeui-media-001-wave{0%,100%{transform:scaleY(var(--vibeui-media-001-base,0.4))}50%{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="media-001"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="media-001"] [data-part="ring"]{animation:none;opacity:0}
[data-vibeui-block="media-001"] [data-part="bar"]{animation:none;transform:scaleY(var(--vibeui-media-001-base,0.4))}
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

// Высоты полосок волны — фиксированный узор, не случайный (стабильно на SSR).
const BAR_HEIGHTS = [
  0.34, 0.6, 0.46, 0.78, 0.52, 0.9, 0.4, 0.66, 0.3, 0.74, 0.5, 0.86, 0.42, 0.58,
  0.94, 0.36, 0.68, 0.5, 0.82, 0.44, 0.62, 0.88, 0.32, 0.56, 0.76, 0.46, 0.7,
  0.38,
]

/**
 * Аудиоплеер с живой волной. Один файл, ноль зависимостей, собственная
 * палитра. Прослушанная доля волны и иконка кнопки задаются пропами,
 * анимации — на чистом CSS.
 */
export function Media001({
  title = "Сейчас играет",
  badge = "MP3",
  trackTitle = "Утренний эфир",
  trackArtist = "Подкаст «Вайб»",
  elapsed = "1:12",
  duration = "3:24",
  progress = 38,
  playing = true,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Media001Props) {
  const palette = {
    ...(accent ? { "--vibeui-media-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const clamped = Math.min(100, Math.max(0, progress))
  const playedCount = Math.round((clamped / 100) * BAR_HEIGHTS.length)

  return (
    <>
      <style href="vibeui-media-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="media-001"
        data-slot="audio-waveform"
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
              <div data-part="body">
                <div data-part="player">
                  <span data-part="playbtn" aria-hidden="true">
                    {playing ? <span data-part="ring" /> : null}
                    {playing ? PAUSE_ICON : PLAY_ICON}
                  </span>
                  <div data-part="meta">
                    <span data-part="track">{trackTitle}</span>
                    <span data-part="artist">{trackArtist}</span>
                  </div>
                </div>
                <div data-part="bars" aria-hidden="true">
                  {BAR_HEIGHTS.map((height, index) => (
                    <span
                      key={index}
                      data-part="bar"
                      data-played={index < playedCount ? "true" : undefined}
                      style={
                        {
                          "--vibeui-media-001-base": height,
                          animationDelay: `${(index % 8) * 0.09}s`,
                          animationDuration: `${1.1 + (index % 3) * 0.2}s`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
                <div data-part="time">
                  <span>{elapsed}</span>
                  <span>{duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
