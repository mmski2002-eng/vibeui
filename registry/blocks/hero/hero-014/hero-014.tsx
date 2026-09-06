import type { CSSProperties } from "react"

export type Hero014Props = {
  kind?: string
  title?: string
  lede?: string
  date?: string
  dateTime?: string
  place?: string
  countdown?: { value: string; label: string }[]
  /** Подпись списка отсчёта для скринридера: без неё это набор голых чисел. */
  countdownLabel?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  seats?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: hero мероприятия. Дата вынесена в <time datetime>, поэтому её
// понимает не только человек, но и парсер; счётчик — четыре плитки, набранные
// tabular-nums, чтобы цифры не прыгали при смене значения. Числа приходят
// пропсом и на сервере не тикают: живой отсчёт — это отдельный клиентский
// слой, а секция обязана быть статичной и попадать в кэш страницы.
const STYLES = `
:where([data-vibeui-block="hero-014"]){
--vibeui-hero-014-bg:oklch(0.18 0.04 285);
--vibeui-hero-014-fg:oklch(0.97 0 285);
--vibeui-hero-014-muted:oklch(0.74 0 285);
--vibeui-hero-014-tile:oklch(0.24 0.045 285);
--vibeui-hero-014-line:oklch(1 0 0 / 14%);
--vibeui-hero-014-accent:oklch(0.8 0.17 95);
--vibeui-hero-014-accent-fg:oklch(0.2 0.05 95);
--vibeui-hero-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="hero-014"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;position:relative;overflow:hidden;
background:
radial-gradient(60% 50% at 85% 5%,color-mix(in oklab,var(--vibeui-hero-014-accent) 22%,transparent),transparent 70%),
var(--vibeui-hero-014-bg);
color:var(--vibeui-hero-014-fg);font-family:var(--vibeui-hero-014-sans);
}
[data-vibeui-block="hero-014"] *{box-sizing:border-box}
[data-vibeui-block="hero-014"] [data-part="shell"]{max-width:64rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="hero-014"] [data-part="kind"]{
display:inline-block;margin:0 0 1.125rem;padding:0.25rem 0.625rem;border-radius:0.375rem;
background:var(--vibeui-hero-014-accent);color:var(--vibeui-hero-014-accent-fg);
font-size:0.6875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="hero-014"] h1{
margin:0;max-width:20ch;font-size:clamp(1.875rem,6cqi,3.5rem);line-height:1.04;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-014"] [data-part="lede"]{
margin:1rem 0 0;max-width:34rem;font-size:clamp(0.9375rem,1.4cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-hero-014-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-014"] [data-part="when"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1rem;margin:1.5rem 0 0;
font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="hero-014"] [data-part="when"] span{display:inline-flex;align-items:center;gap:0.4375rem;color:var(--vibeui-hero-014-muted)}
[data-vibeui-block="hero-014"] [data-part="when"] time{color:var(--vibeui-hero-014-accent)}
[data-vibeui-block="hero-014"] [data-part="countdown"]{
list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.5rem;margin:2rem 0 0;padding:0;
}
[data-vibeui-block="hero-014"] [data-part="countdown"] li{
border:1px solid var(--vibeui-hero-014-line);border-radius:0.75rem;background:var(--vibeui-hero-014-tile);
padding:0.875rem 0.5rem;text-align:center;
}
[data-vibeui-block="hero-014"] [data-part="num"]{
display:block;font-size:clamp(1.5rem,4.5cqi,2.5rem);line-height:1;font-weight:700;letter-spacing:-0.03em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="hero-014"] [data-part="unit"]{
display:block;margin-top:0.375rem;font-size:0.6875rem;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-hero-014-muted);
}
[data-vibeui-block="hero-014"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.625rem;margin:2rem 0 0}
[data-vibeui-block="hero-014"] a{
display:inline-flex;align-items:center;justify-content:center;height:2.875rem;padding:0 1.5rem;border-radius:0.625rem;
font-size:0.9375rem;font-weight:650;text-decoration:none;transition:opacity .16s ease,border-color .16s ease;
}
[data-vibeui-block="hero-014"] [data-part="primary"]{background:var(--vibeui-hero-014-accent);color:var(--vibeui-hero-014-accent-fg);border:1px solid transparent}
[data-vibeui-block="hero-014"] [data-part="secondary"]{border:1px solid var(--vibeui-hero-014-line);color:var(--vibeui-hero-014-fg)}
[data-vibeui-block="hero-014"] a:hover{opacity:.88}
[data-vibeui-block="hero-014"] a:focus-visible{outline:2px solid var(--vibeui-hero-014-accent);outline-offset:3px}
[data-vibeui-block="hero-014"] [data-part="seats"]{margin:1rem 0 0;font-size:0.8125rem;color:var(--vibeui-hero-014-muted)}
@container (min-width: 34rem){
[data-vibeui-block="hero-014"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="hero-014"] [data-part="countdown"]{max-width:32rem}
}
@container (min-width: 56rem){
[data-vibeui-block="hero-014"] [data-part="shell"]{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:3.5rem;align-items:center;padding:6rem 2.5rem}
[data-vibeui-block="hero-014"] [data-part="countdown"]{margin-top:0;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COUNTDOWN = [
  { value: "12", label: "дней" },
  { value: "06", label: "часов" },
  { value: "41", label: "минута" },
  { value: "09", label: "секунд" },
]

/** Hero мероприятия: дата в <time>, место и четыре плитки обратного отсчёта. */
export function Hero014({
  kind = "Онлайн-конференция",
  title = "Вайбкодинг-день: собираем продукт за восемь часов",
  lede = "Шесть докладов о том, как команды отдают вёрстку агентам и что из этого выходит в продакшене.",
  date = "26 сентября, 11:00 МСК",
  dateTime = "2026-09-26T11:00:00+03:00",
  place = "Онлайн, запись остаётся",
  countdown = DEFAULT_COUNTDOWN,
  countdownLabel = "До начала осталось",
  primary = { label: "Забрать место", href: "#" },
  secondary = { label: "Программа дня", href: "#" },
  seats = "Осталось 128 мест из 500",
  accent,
  className,
  style,
}: Hero014Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            {kind ? <p data-part="kind">{kind}</p> : null}
            <h1>{title}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <p data-part="when">
              <time dateTime={dateTime}>{date}</time>
              <span>{place}</span>
            </p>
            <div data-part="actions">
              <a data-part="primary" href={primary.href}>
                {primary.label}
              </a>
              <a data-part="secondary" href={secondary.href}>
                {secondary.label}
              </a>
            </div>
            {seats ? <p data-part="seats">{seats}</p> : null}
          </div>

          <ul data-part="countdown" aria-label={countdownLabel}>
            {countdown.slice(0, 4).map((cell) => (
              <li key={cell.label}>
                <span data-part="num">{cell.value}</span>
                <span data-part="unit">{cell.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
