"use client"

import {
  useEffect,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react"

export type Card173Props = Omit<ComponentProps<"section">, "children"> & {
  title?: string
  /** Язык подписи даты — BCP 47, например "ru" или "en". */
  locale?: string
  /** IANA-пояс, например "Europe/Moscow". Пусто — пояс посетителя. */
  timeZone?: string
  showSeconds?: boolean
  particles?: boolean
  accent?: string
  /** Фон за стеклом. Пусто — переливающийся градиент из акцента. */
  background?: string
}

// Идея: цифровые часы на карточке из матового стекла поверх медленно
// переливающегося градиента и всплывающих искр. Дата пишется через
// Intl.DateTimeFormat, поэтому язык и пояс — пропсы, а не строки в коде.
// На сервере время неизвестно: первая отрисовка показывает прочерки и
// заполняется после гидрации, иначе часы сервера и браузера расходились бы.
const STYLES = `
:where([data-vibeui-block="card-173"]){
--vibeui-card-173-accent:oklch(0.6803 0.2144 39.8);
--vibeui-card-173-scene:linear-gradient(-45deg,oklch(from var(--vibeui-card-173-accent) calc(l + 0.1) c calc(h + 22)),var(--vibeui-card-173-accent),oklch(from var(--vibeui-card-173-accent) calc(l - 0.18) c calc(h + 4)),oklch(0.2 0.03 45));
--vibeui-card-173-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-card-173-digits:ui-monospace,"SF Mono","Cascadia Mono","Roboto Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="card-173"]{
position:relative;display:grid;place-items:center;width:100%;min-width:min(100%,16rem);box-sizing:border-box;
min-height:22rem;padding:2.5rem 1rem;overflow:hidden;border-radius:1.25rem;isolation:isolate;
background:var(--vibeui-card-173-scene);background-size:400% 400%;
animation:vibeui-card-173-scene 15s ease infinite;
color:oklch(1 0 0);font-family:var(--vibeui-card-173-font);
}
@keyframes vibeui-card-173-scene{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
[data-vibeui-block="card-173"] *{box-sizing:border-box}
[data-vibeui-block="card-173"] [data-part="sparks"]{position:absolute;inset:0;z-index:-1;pointer-events:none}
[data-vibeui-block="card-173"] [data-part="sparks"] i{
position:absolute;bottom:-1rem;width:4px;height:4px;border-radius:50%;background:oklch(1 0 0 / 0.55);
animation:vibeui-card-173-rise linear infinite;
}
@keyframes vibeui-card-173-rise{
0%{transform:translateY(0);opacity:0}
10%,90%{opacity:1}
100%{transform:translateY(-26rem);opacity:0}
}
[data-vibeui-block="card-173"] [data-part="glass"]{
display:flex;flex-direction:column;align-items:center;gap:.9rem;padding:2.2rem 2.6rem;
border:1px solid oklch(1 0 0 / 0.22);border-radius:1.8rem;background:oklch(1 0 0 / 0.1);
backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
box-shadow:0 25px 45px oklch(0 0 0 / 0.12),inset 0 1px 0 oklch(1 0 0 / 0.3);
transition:transform .3s ease,box-shadow .3s ease;
}
[data-vibeui-block="card-173"] [data-part="glass"]:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 35px 60px oklch(0 0 0 / 0.2),inset 0 1px 0 oklch(1 0 0 / 0.4)}
[data-vibeui-block="card-173"] time{
font-family:var(--vibeui-card-173-digits);font-variant-numeric:tabular-nums;
font-size:clamp(2.4rem,11cqi,4.5rem);font-weight:800;letter-spacing:.06em;line-height:1;
text-shadow:0 0 30px oklch(1 0 0 / 0.5);animation:vibeui-card-173-pulse 2s ease-in-out infinite;
}
@keyframes vibeui-card-173-pulse{50%{text-shadow:0 0 50px oklch(1 0 0 / 0.8),0 0 20px oklch(1 0 0 / 0.4)}}
[data-vibeui-block="card-173"] [data-part="date"]{margin:0;font-size:clamp(.85rem,2.6cqi,1.15rem);letter-spacing:.08em;color:oklch(1 0 0 / 0.9);text-shadow:0 2px 10px oklch(0 0 0 / 0.3)}
[data-vibeui-block="card-173"] [data-part="date"]::first-letter{text-transform:uppercase}
[data-vibeui-block="card-173"] [data-part="title"]{margin:1.25rem 0 0;text-align:center;font-size:1.05rem;font-weight:600;color:oklch(1 0 0 / 0.85)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-173"],[data-vibeui-block="card-173"] *{animation:none!important;transition:none!important}[data-vibeui-block="card-173"] [data-part="sparks"]{display:none}}
`

// Позиции искр заданы заранее, а не Math.random(): иначе разметка сервера и
// клиента не совпала бы при гидрации.
const SPARKS = Array.from({ length: 28 }, (_, index) => ({
  left: (index * 37) % 100,
  delay: (index * 0.73) % 6,
  duration: 4 + ((index * 1.3) % 3),
}))

/**
 * Цифровые часы на стеклянной карточке поверх переливающегося градиента:
 * время, дата на выбранном языке, всплывающие искры.
 */
export function Card173({
  title = "Время в студии",
  locale = "ru",
  timeZone,
  showSeconds = true,
  particles = true,
  accent,
  background = "",
  className,
  style,
  ...props
}: Card173Props) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const zone = timeZone || undefined
  const time = now
    ? new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: showSeconds ? "2-digit" : undefined,
        hourCycle: "h23",
        timeZone: zone,
      }).format(now)
    : showSeconds
      ? "--:--:--"
      : "--:--"
  const date = now
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: zone,
      }).format(now)
    : " "

  const palette = {
    ...(accent ? { "--vibeui-card-173-accent": accent } : null),
    ...(background ? { "--vibeui-card-173-scene": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-173" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="card-173"
        data-slot="card"
        aria-label={title}
        className={className}
        style={palette}
      >
        {particles ? (
          <span data-part="sparks" aria-hidden="true">
            {SPARKS.map((spark, index) => (
              <i
                key={index}
                style={{
                  left: `${spark.left}%`,
                  animationDelay: `${spark.delay}s`,
                  animationDuration: `${spark.duration}s`,
                }}
              />
            ))}
          </span>
        ) : null}
        <div>
          <div data-part="glass">
            <time dateTime={now?.toISOString()} suppressHydrationWarning>
              {time}
            </time>
            <p data-part="date">{date}</p>
          </div>
          {title ? <p data-part="title">{title}</p> : null}
        </div>
      </section>
    </>
  )
}
