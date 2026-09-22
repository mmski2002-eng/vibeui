"use client"

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Select001 } from "@/registry/components/select/select-001/select-001"

export type Subscribe007Option = {
  id: string
  label: string
  /** Во сколько напишем: «08:25». */
  time: string
  note?: string
}

export type Subscribe007Props = {
  eyebrow?: string
  title?: string
  lede?: string
  stamp?: string
  formTitle?: string
  formText?: string
  optionLabel?: string
  contactLabel?: string
  /** Строка под полем; {time} и {note} подставляются из выбранного варианта. */
  whenLine?: string
  submitLabel?: string
  doneLine?: string
  againLabel?: string
  options?: readonly Subscribe007Option[]
  /** Фактура пакета: картинка крафт-бумаги. Пусто — цвет. */
  texture?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// «Хлебный будильник»: не рассылка, а одно сообщение за пять минут до того,
// как выбранная выпечка ляжет на полку. Форма лежит на крафт-пакете с
// пунктирной линией отрыва, зерном бумаги и штампом в углу; рядом нарисован
// будильник — его стрелки показывают время выбранной позиции, а когда поле
// в фокусе, будильник звонит: трясётся, колокольчики дрожат, вокруг
// расходятся кольца. Выбор позиции сразу меняет строку «напишем в 08:25 —
// 36 часов, как положено». После отправки — прорисованная галочка,
// подтверждение и «добавить ещё». Секция появляется каскадом в кадре.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="subscribe-007"]){
--vibeui-subscribe-007-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-subscribe-007-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-007-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-subscribe-007-on-accent:oklch(from var(--vibeui-subscribe-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-subscribe-007-muted:color-mix(in oklab,var(--vibeui-subscribe-007-fg) 60%,var(--vibeui-subscribe-007-bg));
--vibeui-subscribe-007-panel:color-mix(in oklab,var(--vibeui-subscribe-007-fg) 5%,var(--vibeui-subscribe-007-bg));
--vibeui-subscribe-007-kraft:#c9a97e;
--vibeui-subscribe-007-kraft-ink:#3b2a1c;
--vibeui-subscribe-007-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-subscribe-007-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-subscribe-007-hand:"Caveat",cursive;
--vibeui-subscribe-007-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="subscribe-007"]{color-scheme:dark}
:where([data-vibeui-block="subscribe-007"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="subscribe-007"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="subscribe-007"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-subscribe-007-panel);color:var(--vibeui-subscribe-007-fg);font-family:var(--vibeui-subscribe-007-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="subscribe-007"] *{box-sizing:border-box}
[data-vibeui-block="subscribe-007"] [data-part="when"]{margin:0}
[data-vibeui-block="subscribe-007"] [data-part="glow"]{position:absolute;left:-8rem;bottom:-8rem;width:44rem;height:30rem;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-subscribe-007-accent) 14%,transparent),transparent 70%);filter:blur(40px);pointer-events:none}
[data-vibeui-block="subscribe-007"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="subscribe-007"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-subscribe-007-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="subscribe-007"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-subscribe-007-accent);border-radius:2px}
[data-vibeui-block="subscribe-007"] [data-part="title"]{margin:0;font-family:var(--vibeui-subscribe-007-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="subscribe-007"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="subscribe-007"] [data-part="word"] i{display:inline-block;font-style:normal;transform:translateY(112%)}
[data-vibeui-block="subscribe-007"][data-shown="true"] [data-part="word"] i{animation:vibeui-subscribe-007-rise .9s var(--vibeui-subscribe-007-ease) both;animation-delay:calc(var(--vibeui-subscribe-007-n) * .09s)}
[data-vibeui-block="subscribe-007"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-subscribe-007-muted);max-width:34rem;margin:1rem 0 0;opacity:0;translate:0 1rem}
[data-vibeui-block="subscribe-007"][data-shown="true"] [data-part="lede"]{animation:vibeui-subscribe-007-in .8s var(--vibeui-subscribe-007-ease) .3s both}
[data-vibeui-block="subscribe-007"] [data-part="bag"]{position:relative;margin-top:2.5rem;padding:2rem 1.5rem 2.4rem;border-radius:1.2rem 1.2rem 1.6rem 1.6rem;background:var(--vibeui-subscribe-007-kraft) var(--vibeui-subscribe-007-texture) center/cover;box-shadow:0 40px 70px -40px rgb(0 0 0 / .7),0 1px 0 rgb(255 255 255 / .25) inset;color:var(--vibeui-subscribe-007-kraft-ink);overflow:hidden;opacity:0;translate:0 2rem;rotate:-1.5deg}
[data-vibeui-block="subscribe-007"][data-shown="true"] [data-part="bag"]{animation:vibeui-subscribe-007-bag 1s var(--vibeui-subscribe-007-ease) .35s both}
[data-vibeui-block="subscribe-007"] [data-part="bag"]::before{content:"";position:absolute;left:0;right:0;top:0;height:2.2rem;background:linear-gradient(180deg,rgb(0 0 0 / .12),transparent);border-bottom:1px dashed color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 35%,transparent)}
[data-vibeui-block="subscribe-007"] [data-part="bag"]::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 6rem,rgb(255 255 255 / .06) 6rem 6.2rem);pointer-events:none}
[data-vibeui-block="subscribe-007"] [data-part="grain"]{position:absolute;inset:0;pointer-events:none;opacity:.14;mix-blend-mode:multiply;background-image:${GRAIN}}
[data-vibeui-block="subscribe-007"] [data-part="inner"]{position:relative;display:grid;gap:1.5rem;padding-top:1rem;z-index:1}
[data-vibeui-block="subscribe-007"] [data-part="intro"]{display:grid;gap:1.2rem}
[data-vibeui-block="subscribe-007"] [data-part="inner"] h3{margin:0;font-family:var(--vibeui-subscribe-007-display);font-size:1.7rem;font-weight:600;letter-spacing:-.02em;line-height:1.1}
[data-vibeui-block="subscribe-007"] [data-part="inner"] p{margin:.4rem 0 0;color:color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 80%,var(--vibeui-subscribe-007-kraft));max-width:30rem}
[data-vibeui-block="subscribe-007"] [data-part="clock"]{position:relative;width:9rem;height:9rem;margin:.4rem 0 0 .6rem}
[data-vibeui-block="subscribe-007"] [data-part="clock"] svg{position:relative;width:100%;height:100%;overflow:visible;transform-origin:50% 60%}
[data-vibeui-block="subscribe-007"] [data-part="clock"][data-ring="true"] svg{animation:vibeui-subscribe-007-ring .5s ease-in-out infinite}
[data-vibeui-block="subscribe-007"] [data-part="clock"] [data-part="bell"]{transform-box:fill-box;transform-origin:50% 100%}
[data-vibeui-block="subscribe-007"] [data-part="clock"][data-ring="true"] [data-part="bell"]{animation:vibeui-subscribe-007-bell .25s ease-in-out infinite alternate}
[data-vibeui-block="subscribe-007"] [data-part="clock"] [data-part="hand"]{transform-origin:50px 56px;transition:transform .8s cubic-bezier(.3,1.4,.4,1)}
[data-vibeui-block="subscribe-007"] [data-part="clock"] [data-part="wave"]{position:absolute;left:50%;top:56%;width:9rem;height:9rem;margin:-4.5rem 0 0 -4.5rem;border-radius:50%;border:2px solid var(--vibeui-subscribe-007-accent);opacity:0;pointer-events:none}
[data-vibeui-block="subscribe-007"] [data-part="clock"][data-ring="true"] [data-part="wave"]{animation:vibeui-subscribe-007-wave 1.4s ease-out infinite}
[data-vibeui-block="subscribe-007"] [data-part="clock"][data-ring="true"] [data-part="wave"]:nth-child(3){animation-delay:.7s}
[data-vibeui-block="subscribe-007"] form{display:grid;gap:.8rem}
[data-vibeui-block="subscribe-007"] [data-part="when"]{font-family:var(--vibeui-subscribe-007-hand);font-size:1.4rem;color:var(--vibeui-subscribe-007-kraft-ink);margin:0}
[data-vibeui-block="subscribe-007"] [data-part="when"] b{display:inline-block;font-weight:600;animation:vibeui-subscribe-007-tick .5s cubic-bezier(.2,1.4,.4,1)}
[data-vibeui-block="subscribe-007"] [data-part="stamp"]{position:absolute;right:1.2rem;top:1rem;z-index:1;padding:.5rem .8rem;border:2px solid color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 50%,transparent);border-radius:.6rem;font-family:var(--vibeui-subscribe-007-display);font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 70%,transparent);transform:rotate(6deg)}
[data-vibeui-block="subscribe-007"] [data-part="again"]{display:inline-flex;align-items:center;justify-self:start;border:0;border-radius:999px;padding:.95rem 1.5rem;font:inherit;font-weight:600;font-size:.95rem;cursor:pointer;color:var(--vibeui-subscribe-007-on-accent);background:var(--vibeui-subscribe-007-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-subscribe-007-accent) 70%,transparent);transition:transform .3s var(--vibeui-subscribe-007-ease),filter .18s,box-shadow .3s}
[data-vibeui-block="subscribe-007"] [data-part="again"]{color:var(--vibeui-subscribe-007-kraft-ink);background:rgb(255 255 255 / .8);box-shadow:0 2px 4px rgb(0 0 0 / .08)}
[data-vibeui-block="subscribe-007"] [data-part="again"]:hover{transform:translateY(-2px);filter:brightness(1.04);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 16px 30px -12px color-mix(in oklab,var(--vibeui-subscribe-007-accent) 80%,transparent)}
[data-vibeui-block="subscribe-007"] [data-part="again"]:active{transform:translateY(1px) scale(.97)}
[data-vibeui-block="subscribe-007"] [data-part="ok"]{display:grid;gap:.6rem;justify-items:start;animation:vibeui-subscribe-007-in .6s var(--vibeui-subscribe-007-ease) both}
[data-vibeui-block="subscribe-007"] [data-part="ok"] svg{width:3.6rem;height:3.6rem;stroke:var(--vibeui-subscribe-007-accent);fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="subscribe-007"] [data-part="ok"] svg circle{stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-subscribe-007-draw .7s cubic-bezier(.4,0,.2,1) forwards}
[data-vibeui-block="subscribe-007"] [data-part="ok"] svg path{stroke-dasharray:1;stroke-dashoffset:1;animation:vibeui-subscribe-007-draw .5s cubic-bezier(.4,0,.2,1) .5s forwards}
[data-vibeui-block="subscribe-007"] [data-part="ok"] p{font-family:var(--vibeui-subscribe-007-hand);font-size:1.6rem;color:var(--vibeui-subscribe-007-kraft-ink);margin:0}
@keyframes vibeui-subscribe-007-rise{0%{transform:translateY(112%) scaleY(.8)}70%{transform:translateY(-2%)}100%{transform:none}}
@keyframes vibeui-subscribe-007-in{from{opacity:0;translate:0 1rem}to{opacity:1;translate:0 0}}
@keyframes vibeui-subscribe-007-bag{from{opacity:0;translate:0 2.5rem;rotate:-1.5deg}to{opacity:1;translate:0 0;rotate:0deg}}
@keyframes vibeui-subscribe-007-ring{0%,100%{transform:rotate(0)}25%{transform:rotate(-6deg) translateY(-2px)}75%{transform:rotate(6deg) translateY(-2px)}}
@keyframes vibeui-subscribe-007-bell{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
@keyframes vibeui-subscribe-007-wave{from{transform:scale(.7);opacity:.7}to{transform:scale(1.6);opacity:0}}
@keyframes vibeui-subscribe-007-tick{from{transform:translateY(.4em);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-subscribe-007-draw{to{stroke-dashoffset:0}}
@container (min-width: 56rem){[data-vibeui-block="subscribe-007"] [data-part="inner"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:3rem;align-items:center}[data-vibeui-block="subscribe-007"] [data-part="bag"]{padding:2.6rem 3rem 3rem}[data-vibeui-block="subscribe-007"] [data-part="intro"]{grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:1.5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="subscribe-007"] *{animation:none!important;transition:none!important}[data-vibeui-block="subscribe-007"] [data-part="word"] i{transform:none}[data-vibeui-block="subscribe-007"] [data-part="lede"],[data-vibeui-block="subscribe-007"] [data-part="bag"]{opacity:1;translate:none;rotate:none}[data-vibeui-block="subscribe-007"] [data-part="ok"] svg *{stroke-dashoffset:0}[data-vibeui-block="subscribe-007"] [data-part="clock"][data-ring="true"] [data-part="wave"]{opacity:.5}}`

const DEFAULT_OPTIONS: Subscribe007Option[] = [
  { id: "tartine", label: "Тартин", time: "08:25", note: "36 часов, как положено" },
  { id: "croissant", label: "Круассан", time: "06:55", note: "первая партия, 40 шт." },
  { id: "cinnamon", label: "Булочка с корицей", time: "10:55", note: "с глазурью, пока тёплые" },
  { id: "focaccia", label: "Фокачча", time: "12:55", note: "к обеду, режем на месте" },
  { id: "rye", label: "Ржаной", time: "14:55", note: "тёмная корка, тмин" },
  { id: "baguette", label: "Багет", time: "16:55", note: "к ужину, последний хлеб дня" },
]

/** Хлебный будильник: напоминание к выходу выбранной выпечки. */
export function Subscribe007({
  eyebrow = "Напоминание",
  title = "Напишем, когда выйдет ваш хлеб",
  lede = "Не рассылка — одно сообщение за пять минут до того, как ваша любимая выпечка ляжет на полку.",
  stamp = "Корка · с 2019",
  formTitle = "Хлебный будильник",
  formText = "Выберите, что любите, — мы посчитаем, во сколько это будет в печи, и напишем в мессенджер. Отписаться — одним словом «хватит».",
  optionLabel = "Что любите",
  contactLabel = "Телефон или почта",
  whenLine = "напишем в {time} — {note}",
  submitLabel = "Поставить будильник",
  doneLine = "записали: {label}, {time}",
  againLabel = "Добавить ещё",
  options = DEFAULT_OPTIONS,
  texture = "",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Subscribe007Props) {
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [id, setId] = useState(options[0]?.id ?? "")
  const [sent, setSent] = useState(false)
  const [ringing, setRinging] = useState(false)
  const chosen = options.find((option) => option.id === id) ?? options[0]
  const fill = (line: string) => line.replace("{time}", chosen?.time ?? "").replace("{note}", chosen?.note ?? "").replace("{label}", chosen?.label.toLowerCase() ?? "")

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setRinging(false)
    setSent(true)
  }

  // Стрелки будильника показывают время выбранной позиции.
  const [hours = 8, mins = 0] = (chosen?.time ?? "08:00").split(":").map(Number)
  const hourAngle = (hours % 12) * 30 + mins * 0.5
  const minuteAngle = mins * 6

  const palette = {
    ...(texture ? { "--vibeui-subscribe-007-texture": `url("${texture}")` } : { "--vibeui-subscribe-007-texture": "none" }),
    ...(accent ? { "--vibeui-subscribe-007-accent": accent } : null),
    ...(ink ? { "--vibeui-subscribe-007-fg": ink } : null),
    ...(background ? { "--vibeui-subscribe-007-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-subscribe-007" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="subscribe-007" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {title.split(" ").map((word, index, all) => (
              <span key={`${word}-${index}`}>
                <span data-part="word" style={{ ["--vibeui-subscribe-007-n" as string]: index }}>
                  <i>{word}</i>
                </span>
                {index < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="bag">
            <div data-part="grain" aria-hidden="true" />
            {stamp ? (
              <span data-part="stamp" aria-hidden="true">
                {stamp}
              </span>
            ) : null}
            <div data-part="inner">
              <div data-part="intro">
                <div>
                  <h3>{formTitle}</h3>
                  {formText ? <p>{formText}</p> : null}
                </div>
                <div data-part="clock" data-ring={ringing} aria-hidden="true">
                  <i data-part="wave" />
                  <i data-part="wave" />
                  <svg viewBox="0 0 100 100">
                    <g data-part="bell" fill="var(--vibeui-subscribe-007-accent)" stroke="var(--vibeui-subscribe-007-kraft-ink)" strokeWidth="3">
                      <circle cx="27" cy="24" r="10" />
                      <circle cx="73" cy="24" r="10" />
                      <path d="M50 8 v6" strokeLinecap="round" />
                    </g>
                    <path d="M28 92 l10 -10 M72 92 l-10 -10" stroke="var(--vibeui-subscribe-007-kraft-ink)" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="50" cy="56" r="34" fill="#fff8ee" stroke="var(--vibeui-subscribe-007-kraft-ink)" strokeWidth="4" />
                    <circle cx="50" cy="56" r="28" fill="none" stroke="color-mix(in oklab,var(--vibeui-subscribe-007-kraft-ink) 20%,transparent)" strokeWidth="1" strokeDasharray="2 12.66" strokeLinecap="round" />
                    <line data-part="hand" x1="50" y1="56" x2="50" y2="38" stroke="var(--vibeui-subscribe-007-kraft-ink)" strokeWidth="4" strokeLinecap="round" style={{ transform: `rotate(${hourAngle}deg)` }} />
                    <line data-part="hand" x1="50" y1="56" x2="50" y2="32" stroke="var(--vibeui-subscribe-007-accent)" strokeWidth="3" strokeLinecap="round" style={{ transform: `rotate(${minuteAngle}deg)` }} />
                    <circle cx="50" cy="56" r="3.5" fill="var(--vibeui-subscribe-007-kraft-ink)" />
                  </svg>
                </div>
              </div>
              {sent ? (
                <div data-part="ok" aria-live="polite">
                  <svg viewBox="0 0 60 60" aria-hidden="true">
                    <circle pathLength="1" cx="30" cy="30" r="26" />
                    <path pathLength="1" d="M18 31 L27 40 L43 22" />
                  </svg>
                  <p>{fill(doneLine)}</p>
                  <button type="button" data-part="again" onClick={() => setSent(false)}>
                    {againLabel}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} onFocus={() => setRinging(true)} onBlur={() => setRinging(false)}>
                  <Select001
                    label={optionLabel}
                    placeholder=""
                    options={options.map((option) => ({ value: option.id, label: option.label }))}
                    value={id}
                    onChange={(event) => setId(event.target.value)}
                    accent={accent}
                  />
                  <Input001 type="text" name="contact" required label={contactLabel} accent={accent} />
                  <p data-part="when" aria-live="polite">
                    {chosen
                      ? fill(whenLine)
                          .split(chosen.time)
                          .flatMap((part, index, all) => (index < all.length - 1 ? [part, <b key={`${chosen.time}-${index}`}>{chosen.time}</b>] : [part]))
                      : fill(whenLine)}
                  </p>
                  <Button001 type="submit" size="lg" accent={accent}>
                    {submitLabel}
                  </Button001>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
