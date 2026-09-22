"use client"

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from "react"

import { Button003 } from "@/registry/components/button/button-003/button-003"
import { Input001 } from "@/registry/components/input/input-001/input-001"

export type Cta026Props = {
  eyebrow?: string
  title?: string
  lede?: string
  placeholder?: string
  actionLabel?: string
  /** Подпись под полем: «без карты», «14 дней». */
  fine?: readonly string[]
  /** Что показать после отправки. */
  doneTitle?: string
  doneText?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Финальный призыв: стеклянная карточка на аврора-пятнах, которые медленно
// плавают и чуть тянутся за курсором. Одно поле почты и магнитная кнопка,
// три подписи-«без карты». После отправки карточка меняет содержимое на
// «письмо ушло»: кружок с галочкой прорисовывается, а из центра разлетаются
// искры-конфетти (чистый CSS, каждой искре свой угол и дальность через
// переменные). Карточка ловит spotlight под курсором, заголовок въезжает
// словами через маску при попадании в экран. Форма ничего не отправляет
// наружу — заглушка, в проекте подключается свой обработчик.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="cta-026"]){
--vibeui-cta-026-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-cta-026-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-026-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-cta-026-on-accent:oklch(from var(--vibeui-cta-026-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-026-muted:color-mix(in oklab,var(--vibeui-cta-026-fg) 60%,var(--vibeui-cta-026-bg));
--vibeui-cta-026-line:color-mix(in oklab,var(--vibeui-cta-026-fg) 14%,transparent);
--vibeui-cta-026-glass:color-mix(in oklab,var(--vibeui-cta-026-bg) 55%,transparent);
--vibeui-cta-026-violet:color-mix(in oklab,var(--vibeui-cta-026-accent) 40%,#a855f7);
--vibeui-cta-026-rose:color-mix(in oklab,var(--vibeui-cta-026-accent) 30%,#f472b6);
--vibeui-cta-026-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-cta-026-px:0;
--vibeui-cta-026-py:0;
--vibeui-cta-026-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-026-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-cta-026-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-026"]{color-scheme:dark}
:where([data-vibeui-block="cta-026"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="cta-026"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="cta-026"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-cta-026-bg);color:var(--vibeui-cta-026-fg);font-family:var(--vibeui-cta-026-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="cta-026"] *{box-sizing:border-box}
[data-vibeui-block="cta-026"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="cta-026"] [data-part="frame"]{position:relative;overflow:hidden;border-radius:2rem;padding:1.25rem;isolation:isolate;opacity:0;transform:translateY(30px) scale(.98);transition:opacity .9s var(--vibeui-cta-026-ease),transform .9s var(--vibeui-cta-026-ease)}
[data-vibeui-block="cta-026"][data-in="true"] [data-part="frame"]{opacity:1;transform:none}
[data-vibeui-block="cta-026"] [data-part="sky"]{position:absolute;inset:0;z-index:-1;transform:translate3d(calc(var(--vibeui-cta-026-px) * 3%),calc(var(--vibeui-cta-026-py) * 3%),0);transition:transform 1s var(--vibeui-cta-026-ease)}
[data-vibeui-block="cta-026"] [data-part="blob"]{position:absolute;border-radius:50%;filter:blur(70px);opacity:.55;animation:vibeui-cta-026-float 14s ease-in-out infinite alternate}
[data-vibeui-block="cta-026"] [data-part="blob"]:nth-child(1){width:60%;aspect-ratio:1;left:-15%;top:-30%;background:var(--vibeui-cta-026-accent)}
[data-vibeui-block="cta-026"] [data-part="blob"]:nth-child(2){width:55%;aspect-ratio:1;right:-15%;top:-10%;background:var(--vibeui-cta-026-violet);animation-delay:-5s}
[data-vibeui-block="cta-026"] [data-part="blob"]:nth-child(3){width:50%;aspect-ratio:1;left:30%;bottom:-40%;background:var(--vibeui-cta-026-rose);animation-delay:-9s}
[data-vibeui-block="cta-026"] [data-part="card"]{--vibeui-cta-026-x:50%;--vibeui-cta-026-y:20%;position:relative;overflow:hidden;max-width:42rem;margin:0 auto;padding:clamp(2rem,5cqi,3.5rem) clamp(1.25rem,4cqi,3rem);border-radius:1.5rem;background:var(--vibeui-cta-026-glass);border:1px solid color-mix(in oklab,var(--vibeui-cta-026-fg) 18%,transparent);backdrop-filter:blur(24px);box-shadow:0 1px 0 rgb(255 255 255 / .18) inset,0 40px 80px -40px rgb(0 0 0 / .6);text-align:center;transition:transform .5s var(--vibeui-cta-026-ease)}
[data-vibeui-block="cta-026"] [data-part="card"]::before{content:"";position:absolute;inset:0;background:radial-gradient(26rem circle at var(--vibeui-cta-026-x) var(--vibeui-cta-026-y),color-mix(in oklab,var(--vibeui-cta-026-accent) 16%,transparent),transparent 60%);opacity:0;transition:opacity .5s;pointer-events:none}
[data-vibeui-block="cta-026"] [data-part="card"]:hover::before{opacity:1}
[data-vibeui-block="cta-026"] [data-part="card"]::after{content:"";position:absolute;inset:-60% -30%;background:linear-gradient(115deg,transparent 42%,rgb(255 255 255 / .12) 48%,rgb(255 255 255 / .04) 52%,transparent 58%);transform:translateX(-70%);animation:vibeui-cta-026-sheen 10s var(--vibeui-cta-026-ease) 2s infinite;pointer-events:none}
[data-vibeui-block="cta-026"] [data-part="card"]>*{position:relative;z-index:1}
[data-vibeui-block="cta-026"] [data-part="card"][data-done="true"]{transform:scale(1.02)}
[data-vibeui-block="cta-026"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-cta-026-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-cta-026-accent)}
[data-vibeui-block="cta-026"] [data-part="title"]{margin:0;font-family:var(--vibeui-cta-026-display);font-weight:800;font-size:clamp(2.2rem,5.4cqi,3.8rem);line-height:1;letter-spacing:-.04em;text-wrap:balance}
[data-vibeui-block="cta-026"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em 0;margin:0 -.04em}
[data-vibeui-block="cta-026"] [data-part="w"] span{display:inline-block;transform:translateY(112%);transition:transform .8s var(--vibeui-cta-026-ease);transition-delay:calc(.2s + var(--vibeui-cta-026-i) * .06s)}
[data-vibeui-block="cta-026"][data-in="true"] [data-part="w"] span{transform:none}
[data-vibeui-block="cta-026"] [data-part="lede"]{margin:1rem auto 0;max-width:28rem;color:var(--vibeui-cta-026-muted)}
[data-vibeui-block="cta-026"] [data-part="form"]{display:grid;gap:.6rem;margin:1.8rem 0 0}
[data-vibeui-block="cta-026"] [data-part="fine"]{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem 1.2rem;margin:1rem 0 0;padding:0;list-style:none;font-size:.8rem;color:var(--vibeui-cta-026-muted)}
[data-vibeui-block="cta-026"] [data-part="fine"] li::before{content:"✓ ";color:var(--vibeui-cta-026-accent)}
[data-vibeui-block="cta-026"] [data-part="done"]{display:grid;justify-items:center;gap:.8rem;padding:1rem 0;animation:vibeui-cta-026-up .6s var(--vibeui-cta-026-ease) both}
[data-vibeui-block="cta-026"] [data-part="mark"]{position:relative;width:4.5rem;height:4.5rem}
[data-vibeui-block="cta-026"] [data-part="mark"] svg{width:4.5rem;height:4.5rem;color:var(--vibeui-cta-026-accent);filter:drop-shadow(0 0 14px color-mix(in oklab,var(--vibeui-cta-026-accent) 60%,transparent))}
[data-vibeui-block="cta-026"] [data-part="done"] circle{stroke-dasharray:160;stroke-dashoffset:160;animation:vibeui-cta-026-draw .8s ease-out forwards}
[data-vibeui-block="cta-026"] [data-part="done"] path{stroke-dasharray:40;stroke-dashoffset:40;animation:vibeui-cta-026-draw .5s ease-out .5s forwards}
[data-vibeui-block="cta-026"] [data-part="spark"]{position:absolute;left:50%;top:50%;width:.45rem;height:.45rem;margin:-.22rem 0 0 -.22rem;border-radius:2px;background:var(--vibeui-cta-026-accent);opacity:0;animation:vibeui-cta-026-spark 1.1s cubic-bezier(.1,.8,.3,1) .45s forwards}
[data-vibeui-block="cta-026"] [data-part="spark"]:nth-child(3n){background:var(--vibeui-cta-026-violet);border-radius:50%}
[data-vibeui-block="cta-026"] [data-part="spark"]:nth-child(3n+1){background:var(--vibeui-cta-026-rose)}
[data-vibeui-block="cta-026"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-cta-026-display);font-size:1.5rem;font-weight:700;animation:vibeui-cta-026-up .6s var(--vibeui-cta-026-ease) .6s both}
[data-vibeui-block="cta-026"] [data-part="done"] p{margin:0;color:var(--vibeui-cta-026-muted);animation:vibeui-cta-026-up .6s var(--vibeui-cta-026-ease) .75s both}
@keyframes vibeui-cta-026-float{from{transform:translate(0,0) scale(1)}to{transform:translate(8%,12%) scale(1.15)}}
@keyframes vibeui-cta-026-draw{to{stroke-dashoffset:0}}
@keyframes vibeui-cta-026-spark{0%{opacity:1;transform:translate(0,0) rotate(0) scale(1)}70%{opacity:1}100%{opacity:0;transform:translate(calc(cos(var(--vibeui-cta-026-a)) * var(--vibeui-cta-026-d)),calc(sin(var(--vibeui-cta-026-a)) * var(--vibeui-cta-026-d) + 1.2rem)) rotate(540deg) scale(.4)}}
@keyframes vibeui-cta-026-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes vibeui-cta-026-sheen{0%{transform:translateX(-70%)}30%,100%{transform:translateX(70%)}}
@container (min-width: 36rem){[data-vibeui-block="cta-026"] [data-part="form"]{grid-template-columns:1fr auto}}
@container (min-width: 56rem){[data-vibeui-block="cta-026"] [data-part="frame"]{padding:4rem 2rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-026"] *{animation:none!important;transition:none!important}[data-vibeui-block="cta-026"] [data-part="done"] circle,[data-vibeui-block="cta-026"] [data-part="done"] path{stroke-dashoffset:0}[data-vibeui-block="cta-026"] [data-part="spark"]{display:none}[data-vibeui-block="cta-026"] [data-part="frame"],[data-vibeui-block="cta-026"] [data-part="w"] span,[data-vibeui-block="cta-026"] [data-part="done"],[data-vibeui-block="cta-026"] [data-part="done"] h3,[data-vibeui-block="cta-026"] [data-part="done"] p{opacity:1;transform:none}}`

// Искры при отправке: угол и дальность заданы заранее, чтобы разлёт был
// одинаковым на сервере и клиенте и не зависел от Math.random.
const SPARKS = Array.from({ length: 18 }, (_, index) => ({ angle: index * 20 + (index % 3) * 7, distance: 3.2 + (index % 4) * 0.8 }))

/** Стеклянный призыв с полем почты на плавающей авроре. */
export function Cta026({
  eyebrow = "Начать",
  title = "Следующий созвон уже можно не конспектировать",
  lede = "Оставьте почту — пришлём ссылку на рабочее пространство. Первые пять встреч бесплатно, карта не нужна.",
  placeholder = "Рабочая почта",
  actionLabel = "Начать бесплатно",
  fine = ["Без карты", "5 встреч бесплатно", "Отключить в один клик"],
  doneTitle = "Письмо ушло",
  doneText = "Ссылка на пространство придёт через минуту. Проверьте «Спам», если что.",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Cta026Props) {
  const [done, setDone] = useState(false)
  const [seen, setSeen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const onFrameMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    const frame = event.currentTarget
    const rect = frame.getBoundingClientRect()
    frame.style.setProperty("--vibeui-cta-026-px", (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3))
    frame.style.setProperty("--vibeui-cta-026-py", (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3))
  }
  const onFrameLeave = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--vibeui-cta-026-px", "0")
    event.currentTarget.style.setProperty("--vibeui-cta-026-py", "0")
  }
  const onCardMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty("--vibeui-cta-026-x", `${event.clientX - rect.left}px`)
    card.style.setProperty("--vibeui-cta-026-y", `${event.clientY - rect.top}px`)
  }
  const words = title.split(" ").filter(Boolean)

  const palette = {
    ...(accent ? { "--vibeui-cta-026-accent": accent } : null),
    ...(ink ? { "--vibeui-cta-026-fg": ink } : null),
    ...(background ? { "--vibeui-cta-026-bg": background } : null),
    ...style,
  } as CSSProperties

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDone(true)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-cta-026" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="cta-026" data-tone={tone === "auto" ? undefined : tone} data-in={seen ? "true" : undefined} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="frame" onPointerMove={onFrameMove} onPointerLeave={onFrameLeave}>
            <div data-part="sky" aria-hidden="true">
              <i data-part="blob" />
              <i data-part="blob" />
              <i data-part="blob" />
            </div>
            <div data-part="card" data-done={done ? "true" : undefined} aria-live="polite" onPointerMove={onCardMove}>
              {done ? (
                <div data-part="done">
                  <div data-part="mark">
                    {SPARKS.map((spark, index) => (
                      <i key={index} data-part="spark" aria-hidden="true" style={{ ["--vibeui-cta-026-a" as string]: `${spark.angle}deg`, ["--vibeui-cta-026-d" as string]: `${spark.distance}rem` }} />
                    ))}
                    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="32" cy="32" r="25" />
                      <path d="M21 33l8 8 14-16" />
                    </svg>
                  </div>
                  <h3>{doneTitle}</h3>
                  <p>{doneText}</p>
                </div>
              ) : (
                <>
                  {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
                  <h2 data-part="title">
                    {words
                      .map((word, index) => (
                        <span key={index} data-part="w">
                          <span style={{ ["--vibeui-cta-026-i" as string]: index }}>{word}</span>
                        </span>
                      ))
                      .flatMap((node, index) => (index ? [" ", node] : [node]))}
                  </h2>
                  {lede ? <p data-part="lede">{lede}</p> : null}
                  <form data-part="form" onSubmit={submit}>
                    <Input001 type="email" name="email" required label={placeholder} autoComplete="email" accent={accent} />
                    <Button003 type="submit" accent={accent}>
                      {actionLabel}
                    </Button003>
                  </form>
                  {fine.length > 0 ? (
                    <ul data-part="fine">
                      {fine.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
