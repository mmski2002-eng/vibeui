"use client"

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react"

export type Hero027Props = {
  /** «Валерия & Дмитрий» — амперсанд делит на две строки. */
  names?: string
  /** Рукописная строка под именами. */
  script?: string
  eyebrow?: string
  /** ISO-дата и время: отсчёт, .ics, штамп. */
  date?: string
  dateLabel?: string
  place?: string
  lede?: string
  note?: string
  primaryLabel?: string
  primaryHref?: string
  calendarLabel?: string
  calendarTitle?: string
  calendarLocation?: string
  /** Фон на весь экран — дом в лесу ночью. */
  image?: string
  imageAlt?: string
  /** Фото пары в «окне» справа. */
  photo?: string
  photoAlt?: string
  photoCaption?: string
  countdownCaption?: string
  countdownLabels?: readonly [string, string, string, string]
  /** Заставка со свечой; во вложенном кадре отключается сама. */
  candle?: boolean
  candleLabel?: string
  candleHint?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран зимней свадьбы. Заставка — тёмный экран и одна свеча:
// клик по фитилю зажигает огонёк, тёплый свет расползается по экрану и
// проявляет страницу за ним. Сам экран — дом в снежном лесу на весь кадр,
// поверх имена антиквой, рукописная строка, отсчёт в стеклянных плитках с
// инеем, «Ответить» и «В календарь»; справа фото пары в оконной раме с
// инеем по углам и свечой на подоконнике.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Marck+Script&family=Manrope:wght@400;500;600;700&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-027"]){
--vibeui-hero-027-night:#0f0f0f;
--vibeui-hero-027-indigo:#131c2e;
--vibeui-hero-027-ink:#f2f2f2;
--vibeui-hero-027-muted:color-mix(in oklab,var(--vibeui-hero-027-ink) 72%,transparent);
--vibeui-hero-027-silver:#9fb0c8;
--vibeui-hero-027-line:color-mix(in oklab,var(--vibeui-hero-027-ink) 35%,transparent);
--vibeui-hero-027-accent:#f2f2f2;
--vibeui-hero-027-fire:#ff9a3c;
--vibeui-hero-027-on-accent:oklch(from var(--vibeui-hero-027-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-027-display:"Cormorant Garamond",Georgia,serif;
--vibeui-hero-027-script:"Marck Script","Segoe Script",cursive;
--vibeui-hero-027-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="hero-027"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-hero-027-night);color:var(--vibeui-hero-027-ink);color-scheme:dark;font-family:var(--vibeui-hero-027-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-027"] *{box-sizing:border-box}
[data-vibeui-block="hero-027"] a{color:inherit;text-decoration:none}
[data-vibeui-block="hero-027"] a:focus-visible,[data-vibeui-block="hero-027"] button:focus-visible{outline:2px solid var(--vibeui-hero-027-accent);outline-offset:3px;border-radius:.5rem}
[data-vibeui-block="hero-027"] [data-part="bg"]{position:absolute;inset:0;overflow:hidden;background:radial-gradient(60% 50% at 50% 60%,#1a2742 0,var(--vibeui-hero-027-night) 100%)}
[data-vibeui-block="hero-027"] [data-part="bg"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:saturate(.9)}
[data-vibeui-block="hero-027"] [data-part="bg"]::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(11 18 32 / .72) 0%,rgb(11 18 32 / .3) 35%,rgb(11 18 32 / .35) 70%,rgb(11 18 32 / .92) 100%)}
[data-vibeui-block="hero-027"] [data-part="frame"]{position:relative;display:grid;gap:2.5rem;max-width:80rem;margin:0 auto;padding:7.5rem 1.25rem 3.5rem;min-height:100svh}
[data-vibeui-block="hero-027"][data-intro="true"] [data-part="letter"],[data-vibeui-block="hero-027"][data-intro="true"] [data-part="side"]{opacity:0;transform:translateY(1.2rem);transition:opacity 1.4s ease 2.4s,transform 1.6s cubic-bezier(.2,.9,.3,1) 2.4s}
[data-vibeui-block="hero-027"]:not([data-sealed="true"]) [data-part="letter"],[data-vibeui-block="hero-027"]:not([data-sealed="true"]) [data-part="side"]{opacity:1;transform:none}
[data-vibeui-block="hero-027"] [data-part="eyebrow"]{margin:0 0 1rem;font-family:var(--vibeui-hero-027-display);font-size:.9rem;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--vibeui-hero-027-silver)}
[data-vibeui-block="hero-027"] [data-part="names"]{position:relative;margin:0;font-family:var(--vibeui-hero-027-display);font-size:clamp(3rem,10cqi,6.4rem);font-weight:500;line-height:.95;letter-spacing:-.01em;text-shadow:0 2px 40px rgb(11 18 32 / .6)}
[data-vibeui-block="hero-027"] [data-part="names"] em{display:block;margin:.05em 0;font-style:italic;font-weight:400;font-size:.45em;color:var(--vibeui-hero-027-accent);text-shadow:0 0 22px rgb(242 182 79 / .5)}
[data-vibeui-block="hero-027"] [data-part="script"]{display:block;margin-top:.6rem;font-family:var(--vibeui-hero-027-script);font-size:clamp(1.5rem,3.6cqi,2.3rem);font-weight:400;line-height:1;letter-spacing:0;color:var(--vibeui-hero-027-silver)}
[data-vibeui-block="hero-027"] [data-part="date"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin:1.8rem 0 0;font-family:var(--vibeui-hero-027-display);font-size:1.25rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;font-variant-numeric:lining-nums}
[data-vibeui-block="hero-027"] [data-part="date"] i{width:2.2rem;height:1px;background:var(--vibeui-hero-027-accent);box-shadow:0 0 8px var(--vibeui-hero-027-accent)}
[data-vibeui-block="hero-027"] [data-part="lede"]{max-width:34rem;margin:1rem 0 0;font-size:1.05rem;color:var(--vibeui-hero-027-muted)}
[data-vibeui-block="hero-027"] [data-part="countcap"]{margin:2rem 0 .6rem;font-size:.7rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-hero-027-silver)}
[data-vibeui-block="hero-027"] [data-part="countdown"]{display:flex;flex-wrap:wrap;gap:.6rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="hero-027"] [data-part="countdown"] li{position:relative;display:grid;gap:.1rem;justify-items:center;min-width:4.4rem;padding:.7rem .4rem .6rem;border:1px solid var(--vibeui-hero-027-line);border-radius:.6rem;background:rgb(19 28 46 / .45);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);overflow:hidden}
[data-vibeui-block="hero-027"] [data-part="countdown"] li::before{content:"";position:absolute;inset:0;background:radial-gradient(60% 40% at 0 0,rgb(242 238 230 / .22),transparent 70%),radial-gradient(50% 35% at 100% 100%,rgb(242 238 230 / .14),transparent 70%);pointer-events:none}
[data-vibeui-block="hero-027"] [data-part="countdown"] b{font-family:var(--vibeui-hero-027-display);font-size:1.9rem;font-weight:500;line-height:1;font-variant-numeric:lining-nums tabular-nums}
[data-vibeui-block="hero-027"] [data-part="countdown"] span{font-size:.62rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-hero-027-silver)}
[data-vibeui-block="hero-027"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem}
[data-vibeui-block="hero-027"] [data-part="primary"],[data-vibeui-block="hero-027"] [data-part="calendar"]{display:inline-flex;align-items:center;gap:.5rem;height:3.1rem;padding:0 1.5rem;border-radius:999px;font-family:var(--vibeui-hero-027-display);font-size:1.08rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:transform .2s,box-shadow .25s,border-color .25s}
[data-vibeui-block="hero-027"] [data-part="primary"]{border:0;background:var(--vibeui-hero-027-accent);color:var(--vibeui-hero-027-on-accent);box-shadow:0 0 30px -4px var(--vibeui-hero-027-accent)}
[data-vibeui-block="hero-027"] [data-part="primary"]:hover{transform:translateY(-1px);box-shadow:0 0 40px -2px var(--vibeui-hero-027-accent)}
[data-vibeui-block="hero-027"] [data-part="calendar"]{border:1px solid var(--vibeui-hero-027-line);background:rgb(19 28 46 / .35);color:var(--vibeui-hero-027-ink);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
[data-vibeui-block="hero-027"] [data-part="calendar"]:hover{border-color:var(--vibeui-hero-027-silver);transform:translateY(-1px)}
[data-vibeui-block="hero-027"] [data-part="calendar"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="hero-027"] [data-part="note"]{margin:1.4rem 0 0;font-family:var(--vibeui-hero-027-script);font-size:1.35rem;color:var(--vibeui-hero-027-accent);opacity:.9}
[data-vibeui-block="hero-027"] [data-part="side"]{position:relative;justify-self:center;width:min(100%,20rem)}
[data-vibeui-block="hero-027"] [data-part="window"]{position:relative;margin:0;padding:.55rem;border:1px solid var(--vibeui-hero-027-line);border-radius:10rem 10rem .8rem .8rem;background:rgb(19 28 46 / .5);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 30px 60px -30px rgb(0 0 0 / .8),inset 0 0 0 1px rgb(242 238 230 / .06)}
[data-vibeui-block="hero-027"] [data-part="window"] span{position:relative;display:block;aspect-ratio:4/5;overflow:hidden;border-radius:9.5rem 9.5rem .4rem .4rem;background:var(--vibeui-hero-027-indigo)}
[data-vibeui-block="hero-027"] [data-part="window"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="hero-027"] [data-part="window"] span::after{content:"";position:absolute;inset:0;background:radial-gradient(40% 30% at 0 100%,rgb(242 238 230 / .5),transparent 70%),radial-gradient(35% 28% at 100% 100%,rgb(242 238 230 / .42),transparent 70%),radial-gradient(30% 22% at 50% 0,rgb(242 238 230 / .25),transparent 70%);mix-blend-mode:screen;pointer-events:none}
[data-vibeui-block="hero-027"] [data-part="window"] figcaption{padding:.7rem .3rem .3rem;text-align:center;font-family:var(--vibeui-hero-027-script);font-size:1.25rem;color:var(--vibeui-hero-027-silver)}
@keyframes vibeui-hero-027-flicker{0%,100%{transform:scaleX(1) scaleY(1)}30%{transform:scaleX(.9) scaleY(1.08) translateX(.03rem)}60%{transform:scaleX(1.05) scaleY(.94) translateX(-.03rem)}}
[data-vibeui-block="hero-027"] [data-part="gate"]{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:1.25rem;overflow:hidden;background:radial-gradient(70% 60% at 50% 55%,#0e1727 0,#05090f 100%);transition:opacity 1.4s ease 1.9s,visibility 0s 3.4s}
[data-vibeui-block="hero-027"] [data-part="gate"][data-lit="true"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-027"] [data-part="gate"]::before{content:"";position:absolute;left:50%;top:50%;width:90rem;height:90rem;margin:-45rem 0 0 -45rem;border-radius:50%;background:radial-gradient(circle,rgb(255 154 60 / .28) 0,rgb(242 182 79 / .12) 22%,transparent 60%);transform:scale(.02);opacity:0;transition:transform 2.6s cubic-bezier(.2,.7,.2,1),opacity 1.2s}
[data-vibeui-block="hero-027"] [data-part="gate"][data-lit="true"]::before{transform:scale(1);opacity:1}
[data-vibeui-block="hero-027"] [data-part="candle"]{position:relative;z-index:1;display:grid;justify-items:center;gap:1.6rem;border:0;background:transparent;color:var(--vibeui-hero-027-ink);cursor:pointer;padding:2rem}
[data-vibeui-block="hero-027"] [data-part="stick"]{position:relative;width:3.2rem;height:9rem;border-radius:.4rem .4rem .3rem .3rem;background:linear-gradient(90deg,#d9d0bd,#fff7e6 38%,#efe6d3 60%,#c9bfaa);box-shadow:inset 0 -2rem 2rem -2rem rgb(0 0 0 / .35)}
[data-vibeui-block="hero-027"] [data-part="stick"]::before{content:"";position:absolute;left:50%;top:-.15rem;width:3.2rem;height:.7rem;margin-left:-1.6rem;border-radius:50%;background:radial-gradient(50% 50% at 50% 50%,#fff4dc,#e7dcc6)}
[data-vibeui-block="hero-027"] [data-part="wax"]{position:absolute;left:0;right:0;top:.1rem;height:3rem;pointer-events:none}
[data-vibeui-block="hero-027"] [data-part="wax"]::before,[data-vibeui-block="hero-027"] [data-part="wax"]::after{content:"";position:absolute;top:0;width:.55rem;height:1.6rem;border-radius:.3rem .3rem .4rem .4rem;background:linear-gradient(180deg,#fff7e6,#efe6d3);box-shadow:inset -1px 0 1px rgb(0 0 0 / .08)}
[data-vibeui-block="hero-027"] [data-part="wax"]::before{left:.35rem;height:2.4rem}
[data-vibeui-block="hero-027"] [data-part="wax"]::after{right:.5rem;height:1.2rem}
[data-vibeui-block="hero-027"] [data-part="plate"]{position:absolute;left:50%;bottom:-.7rem;width:6rem;height:1.4rem;margin-left:-3rem;border-radius:50%;background:radial-gradient(50% 50% at 50% 50%,#3a4356,#1a2130 70%,transparent 72%);box-shadow:0 .2rem .6rem rgb(0 0 0 / .5)}
[data-vibeui-block="hero-027"] [data-part="wick"]{position:absolute;left:50%;top:-.9rem;width:.16rem;height:.9rem;margin-left:-.08rem;border-radius:.1rem;background:#2a2118}
[data-vibeui-block="hero-027"] [data-part="flame"]{position:absolute;left:50%;top:-2.6rem;width:1.3rem;height:2.1rem;margin-left:-.65rem;border-radius:50% 50% 45% 45%;background:radial-gradient(50% 60% at 50% 70%,#fff6d6,var(--vibeui-hero-027-fire) 55%,transparent 80%);box-shadow:0 0 20px 6px rgb(255 154 60 / .5),0 0 60px 20px rgb(242 182 79 / .25);transform-origin:50% 100%;transform:scale(0);opacity:0;transition:transform .5s cubic-bezier(.3,1.6,.4,1),opacity .3s}
[data-vibeui-block="hero-027"] [data-part="gate"][data-lit="true"] [data-part="flame"]{opacity:1;transform:scale(1);animation:vibeui-hero-027-flicker 1.4s ease-in-out .5s infinite}
[data-vibeui-block="hero-027"] [data-part="glow"]{position:absolute;left:50%;top:-1.5rem;width:12rem;height:12rem;margin:-6rem 0 0 -6rem;border-radius:50%;background:radial-gradient(circle,rgb(255 154 60 / .35),transparent 65%);opacity:0;transition:opacity 1s .3s;pointer-events:none}
[data-vibeui-block="hero-027"] [data-part="gate"][data-lit="true"] [data-part="glow"]{opacity:1}
[data-vibeui-block="hero-027"] [data-part="candle"] b{font-family:var(--vibeui-hero-027-display);font-size:1.5rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;transition:opacity .4s}
[data-vibeui-block="hero-027"] [data-part="candle"] small{margin-top:-1rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-hero-027-silver);transition:opacity .4s}
[data-vibeui-block="hero-027"] [data-part="gate"][data-lit="true"] [data-part="candle"] b,[data-vibeui-block="hero-027"] [data-part="gate"][data-lit="true"] [data-part="candle"] small{opacity:0}
[data-vibeui-block="hero-027"] [data-part="candle"]:hover [data-part="wick"]{background:#4a3a2a}
@container (min-width:40rem){
[data-vibeui-block="hero-027"] [data-part="countdown"] li{min-width:5.4rem;padding:.8rem .6rem .7rem}
[data-vibeui-block="hero-027"] [data-part="countdown"] b{font-size:2.2rem}
}
@container (min-width:56rem){
[data-vibeui-block="hero-027"] [data-part="frame"]{grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);align-items:center;padding:9rem 2.5rem 4.5rem;min-height:44rem}
[data-vibeui-block="hero-027"] [data-part="side"]{justify-self:end;width:min(100%,21rem)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-027"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-027"] [data-part="gate"]{display:none}[data-vibeui-block="hero-027"][data-sealed="true"] [data-part="letter"],[data-vibeui-block="hero-027"][data-sealed="true"] [data-part="side"]{opacity:1;transform:none}}`

const ZERO = ["00", "00", "00", "00"] as const

function subscribeNoop() {
  return () => {}
}

// Во вложенном кадре (витрина, превью) свечу не показываем: кликнуть по
// ней там нельзя, а страницу за ней — не увидеть.
function readEmbedded(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0")
}

function split(target: number, now: number): readonly [string, string, string, string] {
  const total = Math.max(0, Math.floor((target - now) / 1000))
  return [String(Math.floor(total / 86400)).padStart(2, "0"), pad(Math.floor((total % 86400) / 3600)), pad(Math.floor((total % 3600) / 60)), pad(total % 60)]
}

function icsDate(value: Date): string {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

/** Первый экран зимней свадьбы: свеча-заставка, дом в снежном лесу, имена антиквой, отсчёт в стеклянных плитках, «в календарь», фото в оконной раме. */
export function Hero027({
  names = "Валерия & Дмитрий",
  script = "когда стемнеет",
  eyebrow = "Зимняя свадьба",
  date = "2027-12-18T16:00:00+03:00",
  dateLabel = "18 декабря 2027",
  place = "Лесная усадьба · 40 км от Москвы",
  lede = "Церемония на закате у камина, глинтвейн на террасе, танцы до полуночи и фейерверк в лесу. Снег обещали.",
  note = "приезжайте затемно — так красивее",
  primaryLabel = "Ответить",
  primaryHref = "#rsvp",
  calendarLabel = "В календарь",
  calendarTitle = "Свадьба Валерии и Дмитрия",
  calendarLocation = "Лесная усадьба, Московская область",
  image,
  imageAlt = "",
  photo,
  photoAlt = "",
  photoCaption = "первый снег, ноябрь",
  countdownCaption = "До свадьбы",
  countdownLabels = ["дней", "часов", "минут", "секунд"],
  candle = true,
  candleLabel = "Зажгите свечу",
  candleHint = "нажмите на фитиль",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero027Props) {
  const embedded = useSyncExternalStore(subscribeNoop, readEmbedded, () => false)
  const intro = candle && !embedded
  const [lit, setLit] = useState(!candle)
  const opened = lit || !intro
  const [ticks, setTicks] = useState<readonly [string, string, string, string]>(ZERO)
  const palette = {
    ...(accent ? { "--vibeui-hero-027-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-027-ink": ink } : null),
    ...(background ? { "--vibeui-hero-027-night": background } : null),
    ...style,
  } as CSSProperties
  const [first, second] = names.split(/\s*&\s*/)
  const target = Date.parse(date)

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
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//VibeUI//Wedding//RU", "BEGIN:VEVENT", `UID:${target}@vibeui`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`, `SUMMARY:${calendarTitle}`, `LOCATION:${calendarLocation}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n")
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
      <style href="vibeui-hero-027" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-027" data-tone={tone === "auto" ? undefined : tone} data-sealed={opened ? undefined : "true"} data-intro={intro ? "true" : undefined} className={className} style={palette}>
        <div data-part="bg" aria-hidden="true">
          {image ? <img src={image} alt={imageAlt} loading="eager" /> : null}
        </div>
        <div data-part="frame">
          <div data-part="letter">
            <p data-part="eyebrow">{eyebrow}</p>
            <h1 data-part="names">
              {first}
              <em>&amp;</em>
              {second}
              {script ? <span data-part="script">{script}</span> : null}
            </h1>
            <p data-part="date">
              <span>{dateLabel}</span>
              <i aria-hidden="true" />
              <span>{place}</span>
            </p>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {Number.isNaN(target) ? null : (
              <>
                <p data-part="countcap">{countdownCaption}</p>
                <ol data-part="countdown" aria-label={countdownLabels.join(", ")}>
                  {ticks.map((value, index) => (
                    <li key={countdownLabels[index]}>
                      <b>{value}</b>
                      <span>{countdownLabels[index]}</span>
                    </li>
                  ))}
                </ol>
              </>
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
            {note ? <p data-part="note">{note}</p> : null}
          </div>
          <div data-part="side">
            <figure data-part="window">
              <span>{photo ? <img src={photo} alt={photoAlt} loading="eager" /> : null}</span>
              {photoCaption ? <figcaption>{photoCaption}</figcaption> : null}
            </figure>
          </div>
        </div>
        {intro ? (
          <div data-part="gate" data-lit={lit ? "true" : undefined} aria-hidden={lit}>
            <button type="button" data-part="candle" onClick={() => setLit(true)} aria-label={candleLabel}>
              <span data-part="stick" aria-hidden="true">
                <i data-part="plate" />
                <i data-part="glow" />
                <i data-part="wax" />
                <i data-part="wick" />
                <i data-part="flame" />
              </span>
              <b>{candleLabel}</b>
              <small>{candleHint}</small>
            </button>
          </div>
        ) : null}
      </section>
    </>
  )
}
