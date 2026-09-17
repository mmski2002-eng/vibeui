"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Hero025Props = {
  /** Имена через « & »: «Василиса & Артём». Амперсанд подкрашивается. */
  names?: string
  eyebrow?: string
  /** Дата и время начала в ISO: «2027-09-05T15:00:00+03:00». Считает обратный отсчёт и попадает в .ics. */
  date?: string
  /** Дата словами для людей: «5 сентября 2027, суббота». */
  dateLabel?: string
  place?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  /** Подпись кнопки «Добавить в календарь». Пусто — кнопки нет. */
  calendarLabel?: string
  /** Заголовок события и адрес для .ics. */
  calendarTitle?: string
  calendarLocation?: string
  image?: string
  imageAlt?: string
  /** Надпись на арке фото: «save the date». */
  stamp?: string
  /** Подписи плиток отсчёта: дни, часы, минуты, секунды. */
  countdownLabels?: readonly [string, string, string, string]
  /** Конверт-заставка с печатью: клик открывает письмо. */
  envelope?: boolean
  /** Подсказка на печати: «нажмите». */
  sealHint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран приглашения: кремовый лист, имена курсивным serif'ом, дата
// и место, обратный отсчёт в четырёх плитках, кнопки «Подтвердить» и
// «В календарь» (.ics собирается на клиенте). Справа фото пары в арке с
// печатью «save the date». Поверх — конверт с восковой печатью: клик
// открывает клапан, письмо выезжает, конверт растворяется. Reduced motion
// показывает письмо сразу.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="hero-025"]){
--vibeui-hero-025-bg:light-dark(#f6f1e8,#17131a);
--vibeui-hero-025-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-hero-025-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-hero-025-line:light-dark(#e2d8ca,#372b31);
--vibeui-hero-025-card:light-dark(#fffaf3,#211a25);
--vibeui-hero-025-accent:#b8552f;
--vibeui-hero-025-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-hero-025-sand:light-dark(#d9c5a5,#5a4a3a);
--vibeui-hero-025-envelope:light-dark(#efe6d8,#241c28);
--vibeui-hero-025-on-accent:#fff7ef;
--vibeui-hero-025-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-hero-025-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-025"]{color-scheme:dark}
:where([data-vibeui-block="hero-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-025"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-hero-025-bg);color:var(--vibeui-hero-025-fg);font-family:var(--vibeui-hero-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-025"] *{box-sizing:border-box}
[data-vibeui-block="hero-025"]::after{content:"";position:absolute;inset:0;background-image:${GRAIN};opacity:.35;mix-blend-mode:multiply;pointer-events:none}
[data-vibeui-block="hero-025"] [data-part="frame"]{position:relative;z-index:1;display:grid;gap:2.5rem;max-width:80rem;margin:0 auto;padding:6rem 1.25rem 3rem}
[data-vibeui-block="hero-025"] [data-part="eyebrow"]{margin:0 0 1.2rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="names"]{margin:0;font-family:var(--vibeui-hero-025-display);font-weight:400;font-style:italic;font-size:clamp(2.8rem,9cqi,6.5rem);line-height:.98;letter-spacing:-.01em;text-wrap:balance}
[data-vibeui-block="hero-025"] [data-part="names"] em{display:inline-block;margin:0 .08em;font-style:italic;color:var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="date"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin:1.6rem 0 0;font-family:var(--vibeui-hero-025-display);font-size:clamp(1.15rem,2.4cqi,1.5rem);font-weight:500;color:var(--vibeui-hero-025-plum)}
[data-vibeui-block="hero-025"] [data-part="date"] i{width:2.5rem;height:1px;background:var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="lede"]{max-width:34rem;margin:1rem 0 0;color:var(--vibeui-hero-025-muted);font-size:1.02rem}
[data-vibeui-block="hero-025"] [data-part="countdown"]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.6rem;max-width:26rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="hero-025"] [data-part="countdown"] li{display:grid;justify-items:center;gap:.15rem;padding:.8rem .25rem;border:1px solid var(--vibeui-hero-025-line);border-radius:1rem 1rem 3rem 3rem / 1rem 1rem 1.6rem 1.6rem;background:var(--vibeui-hero-025-card)}
[data-vibeui-block="hero-025"] [data-part="countdown"] b{font-family:var(--vibeui-hero-025-display);font-size:clamp(1.6rem,3.4cqi,2.3rem);font-weight:500;line-height:1;font-variant-numeric:tabular-nums;color:var(--vibeui-hero-025-plum)}
[data-vibeui-block="hero-025"] [data-part="countdown"] span{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-025-muted)}
[data-vibeui-block="hero-025"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem}
[data-vibeui-block="hero-025"] [data-part="primary"],[data-vibeui-block="hero-025"] [data-part="calendar"]{display:inline-flex;align-items:center;gap:.5rem;height:3rem;padding:0 1.4rem;border-radius:999px;font:inherit;font-weight:600;font-size:.92rem;text-decoration:none;cursor:pointer;transition:transform .2s,background .25s,border-color .25s}
[data-vibeui-block="hero-025"] [data-part="primary"]{background:var(--vibeui-hero-025-accent);color:var(--vibeui-hero-025-on-accent);border:1px solid var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="primary"]:hover{transform:translateY(-2px);background:color-mix(in oklab,var(--vibeui-hero-025-accent) 88%,#000)}
[data-vibeui-block="hero-025"] [data-part="calendar"]{background:transparent;color:var(--vibeui-hero-025-fg);border:1px solid var(--vibeui-hero-025-line)}
[data-vibeui-block="hero-025"] [data-part="calendar"]:hover{border-color:var(--vibeui-hero-025-fg);transform:translateY(-2px)}
[data-vibeui-block="hero-025"] [data-part="calendar"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="hero-025"] [data-part="primary"]:focus-visible,[data-vibeui-block="hero-025"] [data-part="calendar"]:focus-visible,[data-vibeui-block="hero-025"] [data-part="seal"]:focus-visible{outline:2px solid var(--vibeui-hero-025-accent);outline-offset:3px}
[data-vibeui-block="hero-025"] [data-part="photo"]{position:relative;justify-self:center;width:min(100%,24rem);margin:0}
[data-vibeui-block="hero-025"] [data-part="arch"]{display:block;aspect-ratio:4/5;border-radius:50% 50% 1.2rem 1.2rem / 38% 38% 1.2rem 1.2rem;overflow:hidden;background:var(--vibeui-hero-025-sand);box-shadow:0 30px 60px -30px rgb(43 26 36 / .45)}
[data-vibeui-block="hero-025"] [data-part="arch"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(.98)}
[data-vibeui-block="hero-025"] [data-part="stamp"]{position:absolute;right:-1rem;bottom:1.6rem;display:grid;place-items:center;width:6.4rem;height:6.4rem;border-radius:50%;background:var(--vibeui-hero-025-card);color:var(--vibeui-hero-025-plum);font-family:var(--vibeui-hero-025-display);font-style:italic;font-size:1rem;line-height:1.05;text-align:center;box-shadow:0 10px 30px -12px rgb(43 26 36 / .5);transform:rotate(-12deg);animation:vibeui-hero-025-float 6s ease-in-out infinite}
[data-vibeui-block="hero-025"] [data-part="stamp"]::before{content:"";position:absolute;inset:.35rem;border:1px dashed var(--vibeui-hero-025-accent);border-radius:50%}
@keyframes vibeui-hero-025-float{0%,100%{transform:rotate(-12deg) translateY(0)}50%{transform:rotate(-9deg) translateY(-.4rem)}}
[data-vibeui-block="hero-025"] [data-part="letter"]{animation:vibeui-hero-025-rise .9s cubic-bezier(.2,.9,.3,1) both}
[data-vibeui-block="hero-025"][data-sealed="true"] [data-part="letter"]{animation:none;opacity:0}
@keyframes vibeui-hero-025-rise{from{opacity:0;transform:translateY(1.5rem)}}
[data-vibeui-block="hero-025"] [data-part="envelope"]{position:absolute;inset:0;z-index:2;display:grid;place-items:center;padding:1.25rem;background:var(--vibeui-hero-025-bg);perspective:1400px;transition:opacity .6s .5s,visibility 0s 1.1s}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-025"] [data-part="paper"]{position:relative;width:min(100%,32rem);aspect-ratio:3/2;border-radius:.6rem;background:var(--vibeui-hero-025-envelope);box-shadow:0 30px 60px -30px rgb(43 26 36 / .5);transform-style:preserve-3d;transition:transform .8s cubic-bezier(.2,.9,.3,1) .35s}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="paper"]{transform:translateY(3rem) scale(.96)}
[data-vibeui-block="hero-025"] [data-part="sheet"]{position:absolute;left:8%;right:8%;bottom:8%;height:80%;border-radius:.5rem;background:var(--vibeui-hero-025-card);box-shadow:0 -10px 30px -20px rgb(43 26 36 / .5);display:grid;place-items:center;font-family:var(--vibeui-hero-025-display);font-style:italic;font-size:clamp(1.3rem,3cqi,2rem);color:var(--vibeui-hero-025-plum);transition:transform .8s cubic-bezier(.2,.9,.3,1) .25s}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="sheet"]{transform:translateY(-55%)}
[data-vibeui-block="hero-025"] [data-part="pocket"]{position:absolute;inset:0;border-radius:.6rem;background:var(--vibeui-hero-025-envelope);clip-path:polygon(0 0,50% 48%,100% 0,100% 100%,0 100%)}
[data-vibeui-block="hero-025"] [data-part="flap"]{position:absolute;left:0;right:0;top:0;height:52%;background:color-mix(in oklab,var(--vibeui-hero-025-envelope) 92%,#000);clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:top;transition:transform .7s cubic-bezier(.4,0,.2,1);z-index:2}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="flap"]{transform:rotateX(180deg);z-index:0}
[data-vibeui-block="hero-025"] [data-part="seal"]{position:absolute;left:50%;top:48%;z-index:3;display:grid;place-items:center;width:5rem;height:5rem;margin:-2.5rem 0 0 -2.5rem;border:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in oklab,var(--vibeui-hero-025-accent) 70%,#fff) 0,var(--vibeui-hero-025-accent) 35%,color-mix(in oklab,var(--vibeui-hero-025-accent) 70%,#000) 100%);color:var(--vibeui-hero-025-on-accent);font-family:var(--vibeui-hero-025-display);font-style:italic;font-size:1.4rem;cursor:pointer;box-shadow:0 8px 20px -8px rgb(43 26 36 / .6),inset 0 0 0 .35rem rgb(255 255 255 / .12);transition:transform .3s cubic-bezier(.2,.9,.3,1.4),opacity .3s}
[data-vibeui-block="hero-025"] [data-part="seal"]:hover{transform:scale(1.06)}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="seal"]{opacity:0;transform:scale(.6);pointer-events:none}
[data-vibeui-block="hero-025"] [data-part="hint"]{position:absolute;left:0;right:0;bottom:-2.4rem;text-align:center;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-025-muted);animation:vibeui-hero-025-blink 2.4s ease-in-out infinite}
@keyframes vibeui-hero-025-blink{0%,100%{opacity:.5}50%{opacity:1}}
@container (min-width:56rem){
[data-vibeui-block="hero-025"] [data-part="frame"]{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:center;padding:7rem 2.5rem 4rem;min-height:40rem}
[data-vibeui-block="hero-025"] [data-part="photo"]{justify-self:end;width:min(100%,28rem)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-025"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-025"] [data-part="envelope"]{display:none}[data-vibeui-block="hero-025"][data-sealed="true"] [data-part="letter"]{opacity:1}}`

const ZERO = ["00", "00", "00", "00"] as const

function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0")
}

function split(target: number, now: number): readonly [string, string, string, string] {
  const total = Math.max(0, Math.floor((target - now) / 1000))
  return [
    String(Math.floor(total / 86400)).padStart(2, "0"),
    pad(Math.floor((total % 86400) / 3600)),
    pad(Math.floor((total % 3600) / 60)),
    pad(total % 60),
  ]
}

function icsDate(value: Date): string {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

/** Первый экран свадебного приглашения: конверт с печатью, имена, дата, обратный отсчёт, «в календарь» и фото в арке. */
export function Hero025({
  names = "Василиса & Артём",
  eyebrow = "Приглашаем на свадьбу",
  date = "2027-09-05T15:00:00+03:00",
  dateLabel = "5 сентября 2027, суббота",
  place = "усадьба Марфино",
  lede = "Мы женимся и хотим отметить это с вами — камерно, под открытым небом, с длинным ужином и танцами до огней.",
  primaryLabel = "Подтвердить участие",
  primaryHref = "#rsvp",
  calendarLabel = "В календарь",
  calendarTitle = "Свадьба Василисы и Артёма",
  calendarLocation = "Усадьба Марфино, Московская область",
  image,
  imageAlt = "",
  stamp = "save the date",
  countdownLabels = ["дней", "часов", "минут", "секунд"],
  envelope = true,
  sealHint = "Нажмите на печать",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Hero025Props) {
  const [open, setOpen] = useState(!envelope)
  const [ticks, setTicks] = useState<readonly [string, string, string, string]>(ZERO)
  const palette = {
    ...(accent ? { "--vibeui-hero-025-accent": accent } : null),
    ...(background ? { "--vibeui-hero-025-bg": background } : null),
    ...style,
  } as CSSProperties
  const [first, second] = names.split(/\s*&\s*/)
  const target = Date.parse(date)

  // Отсчёт тикает только на клиенте: на сервере время неизвестно, и
  // первый кадр показывает нули, чтобы разметка совпала.
  useEffect(() => {
    if (Number.isNaN(target)) return
    const tick = () => setTicks(split(target, Date.now()))
    const timer = window.setInterval(tick, 1000)
    const frame = window.requestAnimationFrame(tick)
    return () => {
      window.clearInterval(timer)
      window.cancelAnimationFrame(frame)
    }
  }, [target])

  function downloadCalendar() {
    if (Number.isNaN(target)) return
    const start = new Date(target)
    const end = new Date(target + 9 * 3600 * 1000)
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//VibeUI//Wedding//RU",
      "BEGIN:VEVENT",
      `UID:${target}@vibeui`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:${calendarTitle}`,
      `LOCATION:${calendarLocation}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "wedding.ics"
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-025" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-025" data-tone={tone === "auto" ? undefined : tone} data-sealed={open ? undefined : "true"} className={className} style={palette}>
        <div data-part="frame">
          <div data-part="letter">
            <p data-part="eyebrow">{eyebrow}</p>
            <h1 data-part="names">
              {first}
              <em>&amp;</em>
              {second}
            </h1>
            <p data-part="date">
              <span>{dateLabel}</span>
              <i aria-hidden="true" />
              <span>{place}</span>
            </p>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {Number.isNaN(target) ? null : (
              <ol data-part="countdown" aria-label={`${countdownLabels.join(", ")}`}>
                {ticks.map((value, index) => (
                  <li key={countdownLabels[index]}>
                    <b>{value}</b>
                    <span>{countdownLabels[index]}</span>
                  </li>
                ))}
              </ol>
            )}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {calendarLabel && !Number.isNaN(target) ? (
                <button type="button" data-part="calendar" onClick={downloadCalendar}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 10h16M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
                  </svg>
                  {calendarLabel}
                </button>
              ) : null}
            </div>
          </div>
          <figure data-part="photo">
            <span data-part="arch">{image ? <img src={image} alt={imageAlt} loading="eager" /> : null}</span>
            {stamp ? <figcaption data-part="stamp">{stamp}</figcaption> : null}
          </figure>
        </div>
        {envelope ? (
          <div data-part="envelope" data-open={open ? "true" : undefined} aria-hidden={open}>
            <div data-part="paper">
              <div data-part="sheet">{names}</div>
              <div data-part="pocket" />
              <div data-part="flap" />
              <button type="button" data-part="seal" aria-label={sealHint} onClick={() => setOpen(true)}>
                {first.charAt(0)}
                {second?.charAt(0)}
              </button>
              <span data-part="hint" aria-hidden="true">
                {sealHint}
              </span>
            </div>
          </div>
        ) : null}
      </section>
    </>
  )
}
