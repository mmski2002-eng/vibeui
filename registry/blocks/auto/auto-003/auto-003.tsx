"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Auto003Step = {
  title: string
  text: string
  /** Сколько длится шаг: «40 минут», «1–2 дня». */
  duration?: string
  /** Что получает клиент на этом шаге. */
  result?: string
}

export type Auto003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  steps?: readonly Auto003Step[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Процесс детейлинга: слева липкая колонка с заголовком и большим номером
// текущего шага, справа четыре шага на вертикальной рельсе. Рельса
// заполняется акцентом по мере прокрутки (scaleY по --progress, считается
// от положения списка относительно центра окна), шаг, до которого дошла
// заливка, «включается»: номер горит, карточка выходит из тени. Всё
// на transform/opacity, rAF-троттлинг.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="auto-003"]){
--vibeui-auto-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-auto-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-auto-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-auto-003-on-accent:oklch(from var(--vibeui-auto-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-auto-003-muted:color-mix(in oklab,var(--vibeui-auto-003-fg) 60%,var(--vibeui-auto-003-bg));
--vibeui-auto-003-line:color-mix(in oklab,var(--vibeui-auto-003-fg) 12%,transparent);
--vibeui-auto-003-glass:color-mix(in oklab,var(--vibeui-auto-003-fg) 5%,transparent);
--vibeui-auto-003-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-auto-003-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-auto-003-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-auto-003-progress:0;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="auto-003"]{color-scheme:dark}
:where([data-vibeui-block="auto-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="auto-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="auto-003"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-auto-003-bg);color:var(--vibeui-auto-003-fg);font-family:var(--vibeui-auto-003-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="auto-003"] *{box-sizing:border-box}
[data-vibeui-block="auto-003"] [data-part="shell"]{max-width:84rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:start}
[data-vibeui-block="auto-003"] [data-part="aside"]{display:grid;gap:1rem}
[data-vibeui-block="auto-003"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0;font-family:var(--vibeui-auto-003-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-auto-003-accent)}
[data-vibeui-block="auto-003"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-auto-003-accent)}
[data-vibeui-block="auto-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-auto-003-display);font-weight:900;font-size:clamp(1.8rem,4.4cqi,3.2rem);line-height:1.02;letter-spacing:-.03em;text-transform:uppercase}
[data-vibeui-block="auto-003"] [data-part="lede"]{margin:0;max-width:26rem;color:var(--vibeui-auto-003-muted)}
[data-vibeui-block="auto-003"] [data-part="counter"]{display:none;align-items:baseline;gap:.4rem;margin-top:1rem;font-family:var(--vibeui-auto-003-display);font-weight:900;font-size:clamp(4rem,9cqi,7rem);line-height:.9;letter-spacing:-.05em;font-variant-numeric:tabular-nums;color:var(--vibeui-auto-003-accent)}
[data-vibeui-block="auto-003"] [data-part="counter"] small{font-size:1.4rem;letter-spacing:-.02em;color:var(--vibeui-auto-003-muted)}
[data-vibeui-block="auto-003"] [data-part="rail"]{position:relative;display:grid;gap:1.2rem;margin:0;padding:0 0 0 3.2rem;list-style:none}
[data-vibeui-block="auto-003"] [data-part="rail"]::before,[data-vibeui-block="auto-003"] [data-part="rail"]::after{content:"";position:absolute;left:1.15rem;top:1.4rem;bottom:1.4rem;width:2px;border-radius:2px}
[data-vibeui-block="auto-003"] [data-part="rail"]::before{background:var(--vibeui-auto-003-line)}
[data-vibeui-block="auto-003"] [data-part="rail"]::after{background:var(--vibeui-auto-003-accent);transform-origin:top;transform:scaleY(var(--vibeui-auto-003-progress));box-shadow:0 0 14px var(--vibeui-auto-003-accent)}
[data-vibeui-block="auto-003"] [data-part="step"]{position:relative;display:grid;gap:.5rem;padding:1.3rem 1.4rem;border-radius:1.2rem;border:1px solid var(--vibeui-auto-003-line);background:var(--vibeui-auto-003-glass);opacity:.45;transform:translateX(.6rem);transition:opacity .5s,transform .6s cubic-bezier(.2,.8,.2,1),border-color .4s}
[data-vibeui-block="auto-003"] [data-part="step"][data-on="true"]{opacity:1;transform:none;border-color:color-mix(in oklab,var(--vibeui-auto-003-accent) 40%,var(--vibeui-auto-003-line))}
[data-vibeui-block="auto-003"] [data-part="num"]{position:absolute;left:-3.2rem;top:1rem;width:2.3rem;height:2.3rem;border-radius:50%;display:grid;place-items:center;border:2px solid var(--vibeui-auto-003-line);background:var(--vibeui-auto-003-bg);font-family:var(--vibeui-auto-003-mono);font-size:.78rem;font-weight:500;color:var(--vibeui-auto-003-muted);transition:background .4s,color .4s,border-color .4s,box-shadow .4s}
[data-vibeui-block="auto-003"] [data-part="step"][data-on="true"] [data-part="num"]{background:var(--vibeui-auto-003-accent);border-color:var(--vibeui-auto-003-accent);color:var(--vibeui-auto-003-on-accent);box-shadow:0 0 0 6px color-mix(in oklab,var(--vibeui-auto-003-accent) 20%,transparent)}
[data-vibeui-block="auto-003"] [data-part="step"] h3{margin:0;font-family:var(--vibeui-auto-003-display);font-weight:700;font-size:1.15rem;letter-spacing:-.01em}
[data-vibeui-block="auto-003"] [data-part="step"] p{margin:0;color:var(--vibeui-auto-003-muted)}
[data-vibeui-block="auto-003"] [data-part="facts"]{display:flex;flex-wrap:wrap;gap:.4rem .6rem;margin:.3rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-auto-003-mono);font-size:.72rem;color:var(--vibeui-auto-003-muted)}
[data-vibeui-block="auto-003"] [data-part="facts"] li{padding:.3rem .6rem;border-radius:999px;border:1px solid var(--vibeui-auto-003-line)}
[data-vibeui-block="auto-003"] [data-part="facts"] li[data-kind="result"]{color:var(--vibeui-auto-003-fg);border-color:color-mix(in oklab,var(--vibeui-auto-003-accent) 50%,transparent)}
@container (min-width: 56rem){[data-vibeui-block="auto-003"] [data-part="shell"]{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:4rem}[data-vibeui-block="auto-003"] [data-part="aside"]{position:sticky;top:6rem}[data-vibeui-block="auto-003"] [data-part="counter"]{display:flex}[data-vibeui-block="auto-003"] [data-part="rail"]{gap:1.6rem;padding-left:4rem}[data-vibeui-block="auto-003"] [data-part="rail"]::before,[data-vibeui-block="auto-003"] [data-part="rail"]::after{left:1.35rem}[data-vibeui-block="auto-003"] [data-part="num"]{left:-4rem;width:2.7rem;height:2.7rem;font-size:.85rem}[data-vibeui-block="auto-003"] [data-part="step"]{padding:1.6rem 1.8rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auto-003"] *{animation:none!important;transition:none!important}}`

const DEFAULT_STEPS: Auto003Step[] = [
  { title: "Осмотр под лампой", text: "Заезжаете в бокс, мастер смотрит кузов под софитами, меряет толщину лака, показывает проблемные места и фиксирует цену.", duration: "20 минут", result: "смета в мессенджер" },
  { title: "Мойка и подготовка", text: "Двухфазная мойка, глина, обезжиривание. Снимаем всё, что мешает: значки, брызговики, при необходимости колёса.", duration: "1,5 часа", result: "чистая база" },
  { title: "Работы в боксе", text: "Полировка, керамика, плёнка или химчистка — по смете. Машина стоит в закрытом боксе при +22°, без пыли и чужих рук.", duration: "от 4 часов до 3 дней", result: "фото каждого этапа" },
  { title: "Выдача и памятка", text: "Показываем результат под той же лампой, что и на осмотре. Выдаём памятку по уходу и напоминаем о первой мойке через две недели.", duration: "20 минут", result: "гарантия в договоре" },
]

/** Процесс детейлинга: таймлайн четырёх шагов с прогрессом по прокрутке. */
export function Auto003({
  eyebrow = "Как проходит",
  title = "Четыре шага от заезда до ключей",
  lede = "Ничего не «уточняем на месте»: цена и сроки известны после осмотра, дальше — только работа и фото каждого этапа.",
  steps = DEFAULT_STEPS,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Auto003Props) {
  const rootRef = useRef<HTMLElement>(null)
  const railRef = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    const rail = railRef.current
    if (!root || !rail) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = rail.getBoundingClientRect()
      const anchor = window.innerHeight * 0.55
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / Math.max(1, rect.height)))
      root.style.setProperty("--vibeui-auto-003-progress", progress.toFixed(3))
      const items = Array.from(rail.children) as HTMLElement[]
      let reached = 0
      items.forEach((item, index) => {
        if (item.getBoundingClientRect().top < anchor) reached = index
      })
      setActive(reached)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const palette = {
    ...(accent ? { "--vibeui-auto-003-accent": accent } : null),
    ...(ink ? { "--vibeui-auto-003-fg": ink } : null),
    ...(background ? { "--vibeui-auto-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-auto-003" precedence="medium">
        {STYLES}
      </style>
      <section ref={rootRef} data-vibeui-block="auto-003" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="aside">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <p data-part="counter" aria-hidden="true">
              {String(active + 1).padStart(2, "0")}
              <small>/ {String(steps.length).padStart(2, "0")}</small>
            </p>
          </div>
          <ol ref={railRef} data-part="rail">
            {steps.map((step, index) => (
              <li key={step.title} data-part="step" data-on={index <= active}>
                <span data-part="num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {step.duration || step.result ? (
                  <ul data-part="facts">
                    {step.duration ? <li>{step.duration}</li> : null}
                    {step.result ? <li data-kind="result">{step.result}</li> : null}
                  </ul>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
