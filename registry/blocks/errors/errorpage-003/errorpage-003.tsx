import type { CSSProperties } from "react"

export type Errorpage003Props = {
  eyebrow?: string
  title?: string
  description?: string
  finishLabel?: string
  finishTime?: string
  /** Процент готовности 0–100. */
  progress?: number
  progressLabel?: string
  notifyLabel?: string
  notifyPlaceholder?: string
  notifyButton?: string
  notifyAction?: string
  /** Пусто — подложки нет, страница лежит прямо на фоне сайта. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Страница технических работ: время окончания, живая полоса прогресса и
// подписка на уведомление. Три вещи, которые снимают тревогу: когда
// закончится, как идёт и «можно закрыть вкладку — мы напишем». Полоса с
// бегущими полосками показывает, что процесс идёт, а не завис; проценты
// приходят пропом, потому что честнее сервера их никто не знает.
const STYLES = `
:where([data-vibeui-block="errorpage-003"]){
--vibeui-errorpage-003-bg:transparent;
--vibeui-errorpage-003-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-errorpage-003-muted:light-dark(oklch(0.48 0 0),oklch(0.7 0 0));
--vibeui-errorpage-003-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-errorpage-003-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-errorpage-003-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-errorpage-003-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-errorpage-003-accent-ink:oklch(from var(--vibeui-errorpage-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-errorpage-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="errorpage-003"]{color-scheme:dark}
[data-vibeui-block="errorpage-003"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-errorpage-003-bg);color:var(--vibeui-errorpage-003-ink);
font-family:var(--vibeui-errorpage-003-font);
}
[data-vibeui-block="errorpage-003"] [data-part="frame"]{
max-width:40rem;margin:0 auto;padding:4rem 1.25rem;
display:flex;flex-direction:column;align-items:center;text-align:center;
}
[data-vibeui-block="errorpage-003"] [data-part="eyebrow"]{
margin:0;
display:inline-flex;align-items:center;gap:0.5rem;
padding:0.3125rem 0.875rem;border-radius:999px;
border:1px solid color-mix(in oklab,var(--vibeui-errorpage-003-accent) 40%,var(--vibeui-errorpage-003-border));
background:color-mix(in oklab,var(--vibeui-errorpage-003-accent) 10%,var(--vibeui-errorpage-003-card));
color:var(--vibeui-errorpage-003-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="errorpage-003"] [data-part="eyebrow"]::before{
content:"";width:0.5rem;height:0.5rem;border-radius:999px;
background:var(--vibeui-errorpage-003-accent);
animation:vibeui-errorpage-003-pulse 1.6s ease-in-out infinite;color:oklch(from var(--vibeui-errorpage-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@keyframes vibeui-errorpage-003-pulse{50%{opacity:0.35}}
[data-vibeui-block="errorpage-003"] [data-part="title"]{
margin:1.25rem 0 0;
font-size:clamp(1.625rem,6cqi,2.5rem);line-height:1.1;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="errorpage-003"] [data-part="description"]{
margin:0.875rem 0 0;max-width:44ch;
color:var(--vibeui-errorpage-003-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="errorpage-003"] [data-part="finish"]{
margin:1.75rem 0 0;display:grid;gap:0.25rem;
}
[data-vibeui-block="errorpage-003"] [data-part="finish-label"]{
margin:0;color:var(--vibeui-errorpage-003-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="errorpage-003"] [data-part="finish-time"]{
margin:0;font-size:clamp(1.25rem,4cqi,1.625rem);font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="errorpage-003"] [data-part="progress"]{
margin-top:1.5rem;width:100%;max-width:26rem;
display:grid;gap:0.5rem;
}
[data-vibeui-block="errorpage-003"] [data-part="track"]{
height:0.75rem;border-radius:999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-errorpage-003-accent) 12%,var(--vibeui-errorpage-003-card));
border:1px solid color-mix(in oklab,var(--vibeui-errorpage-003-accent) 25%,var(--vibeui-errorpage-003-border));
}
[data-vibeui-block="errorpage-003"] [data-part="fill"]{
height:100%;border-radius:inherit;
background:repeating-linear-gradient(
135deg,
var(--vibeui-errorpage-003-accent-fill) 0 0.625rem,
color-mix(in oklab,var(--vibeui-errorpage-003-accent-ink) 18%,var(--vibeui-errorpage-003-accent-fill)) 0.625rem 1.25rem
);
background-size:200% 100%;
animation:vibeui-errorpage-003-stripes 1.2s linear infinite;
transition:width .4s ease;
}
@keyframes vibeui-errorpage-003-stripes{to{background-position:1.7678rem 0}}
[data-vibeui-block="errorpage-003"] [data-part="percent"]{
color:var(--vibeui-errorpage-003-muted);font-size:0.8125rem;font-weight:600;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="errorpage-003"] [data-part="notify-label"]{
margin:2.25rem 0 0;color:var(--vibeui-errorpage-003-muted);font-size:0.9375rem;
}
[data-vibeui-block="errorpage-003"] [data-part="notify"]{
margin-top:0.75rem;width:100%;max-width:26rem;
display:flex;gap:0.5rem;
padding:0.375rem;border:1px solid var(--vibeui-errorpage-003-border);border-radius:0.875rem;
background:var(--vibeui-errorpage-003-card);
}
[data-vibeui-block="errorpage-003"] [data-part="notify"]:focus-within{
border-color:color-mix(in oklab,var(--vibeui-errorpage-003-accent) 55%,var(--vibeui-errorpage-003-border));
}
[data-vibeui-block="errorpage-003"] [data-part="input"]{
flex:1 1 auto;min-width:0;
border:0;background:none;padding:0.5rem 0.625rem;
color:inherit;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="errorpage-003"] [data-part="input"]::placeholder{color:var(--vibeui-errorpage-003-muted)}
[data-vibeui-block="errorpage-003"] [data-part="input"]:focus{outline:none}
[data-vibeui-block="errorpage-003"] [data-part="submit"]{
flex:none;cursor:pointer;
border:0;border-radius:0.625rem;padding:0.5rem 1.125rem;
background:var(--vibeui-errorpage-003-accent-fill);color:var(--vibeui-errorpage-003-accent-ink);
font:inherit;font-size:0.875rem;font-weight:650;
transition:filter .15s ease;
}
[data-vibeui-block="errorpage-003"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="errorpage-003"] :is(button,input):focus-visible{
outline:2px solid var(--vibeui-errorpage-003-accent);outline-offset:2px;border-radius:0.625rem;
}
@container (min-width: 48rem){
[data-vibeui-block="errorpage-003"] [data-part="frame"]{padding:6rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="errorpage-003"] *{animation:none!important;transition:none!important}}
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

/** Технические работы: время окончания, прогресс и подписка на уведомление. */
export function Errorpage003({
  eyebrow = "Технические работы",
  title = "Обновляем каталог",
  description = "Выкатываем новую версию VibeUI. Сайт вернётся сам — вкладку можно не держать открытой.",
  finishLabel = "Планируем закончить",
  finishTime = "сегодня к 14:00 МСК",
  progress = 68,
  progressLabel = "Готово",
  notifyLabel = "Или оставьте почту — напишем, когда всё заработает.",
  notifyPlaceholder = "you@company.ru",
  notifyButton = "Напомнить",
  notifyAction = "/notify",
  background = "",
  accent,
  className,
  style,
}: Errorpage003Props) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)))
  const palette = {
    ...(accent ? { "--vibeui-errorpage-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-errorpage-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-errorpage-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="errorpage-003"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <dl data-part="finish">
            <dt data-part="finish-label">{finishLabel}</dt>
            <dd data-part="finish-time">{finishTime}</dd>
          </dl>
          <div data-part="progress">
            <div
              data-part="track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={clamped}
              aria-label={progressLabel}
            >
              {/* Ширина — динамическое значение, классом её не выразить. */}
              <div data-part="fill" style={{ width: `${clamped}%` }} />
            </div>
            <span data-part="percent">
              {progressLabel}: {clamped}%
            </span>
          </div>
          <p data-part="notify-label">{notifyLabel}</p>
          <form data-part="notify" action={notifyAction}>
            <input
              data-part="input"
              type="email"
              name="email"
              placeholder={notifyPlaceholder}
              aria-label={notifyButton}
            />
            <button data-part="submit" type="submit">
              {notifyButton}
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
