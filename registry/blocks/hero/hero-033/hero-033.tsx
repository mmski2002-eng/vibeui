"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"

export type Hero033Line = {
  /** Кто говорит в расшифровке. */
  who: string
  text: string
}

export type Hero033Props = {
  eyebrow?: string
  /** Слово в *звёздочках* — аврора-градиентом. */
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Строка доверия: «4 200 команд уже перестали писать протоколы». */
  trust?: string
  transcriptTitle?: string
  transcript?: readonly Hero033Line[]
  summaryTitle?: string
  /** Ответ ассистента: строки печатаются по токенам; строка с «# » — заголовок секции. */
  summary?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран AI-продукта, который сам себя демонстрирует: слева
// расшифровка созвона с репликами, справа окно ассистента, где сводка
// печатается по словам с мигающим курсором (setTimeout по токену, пауза
// на заголовках секций) и по кругу начинает заново. Заголовок с
// аврора-градиентом на слове в звёздочках, стеклянные панели, пятна
// свечения на фоне.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-033"]){
--vibeui-hero-033-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-033-on-accent:oklch(from var(--vibeui-hero-033-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-033-muted:color-mix(in oklab,var(--vibeui-hero-033-fg) 60%,var(--vibeui-hero-033-bg));
--vibeui-hero-033-line:color-mix(in oklab,var(--vibeui-hero-033-fg) 14%,transparent);
--vibeui-hero-033-glass:color-mix(in oklab,var(--vibeui-hero-033-fg) 6%,transparent);
--vibeui-hero-033-a2:#8b5cf6;
--vibeui-hero-033-a3:#f472b6;
--vibeui-hero-033-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-033-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-033-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-033"]{color-scheme:dark}
:where([data-vibeui-block="hero-033"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-033"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-033"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-033-bg);color:var(--vibeui-hero-033-fg);font-family:var(--vibeui-hero-033-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-033"] *{box-sizing:border-box}
[data-vibeui-block="hero-033"] [data-part="aurora"]{position:absolute;inset:-20% -10% auto;height:70%;background:radial-gradient(40% 50% at 20% 40%,color-mix(in oklab,var(--vibeui-hero-033-accent) 35%,transparent),transparent 70%),radial-gradient(35% 45% at 60% 20%,color-mix(in oklab,var(--vibeui-hero-033-a2) 35%,transparent),transparent 70%),radial-gradient(30% 40% at 85% 50%,color-mix(in oklab,var(--vibeui-hero-033-a3) 28%,transparent),transparent 70%);filter:blur(40px);pointer-events:none;animation:vibeui-hero-033-drift 18s ease-in-out infinite alternate}
[data-vibeui-block="hero-033"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:5rem 1.25rem 4rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="hero-033"] [data-part="eyebrow"]{margin:0 0 1rem;display:inline-flex;align-items:center;gap:.5rem;padding:.35rem .8rem;border-radius:999px;border:1px solid var(--vibeui-hero-033-line);background:var(--vibeui-hero-033-glass);font-family:var(--vibeui-hero-033-mono);font-size:.72rem;letter-spacing:.06em;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="eyebrow"] i{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-hero-033-accent);box-shadow:0 0 12px var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-033-display);font-weight:800;font-size:clamp(2.4rem,6cqi,4.6rem);line-height:1.02;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="hero-033"] [data-part="title"] em{font-style:normal;background:linear-gradient(90deg,var(--vibeui-hero-033-accent),var(--vibeui-hero-033-a2),var(--vibeui-hero-033-a3));-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="hero-033"] [data-part="lede"]{margin:1.2rem 0 0;max-width:32rem;font-size:1.1rem;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="actions"]{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.8rem}
[data-vibeui-block="hero-033"] [data-part="primary"],[data-vibeui-block="hero-033"] [data-part="secondary"]{display:inline-flex;align-items:center;padding:.85rem 1.3rem;border-radius:.8rem;font-weight:600;text-decoration:none;font-size:.95rem;transition:transform .18s,filter .2s,background .2s}
[data-vibeui-block="hero-033"] [data-part="primary"]{background:var(--vibeui-hero-033-accent);color:var(--vibeui-hero-033-on-accent);box-shadow:0 0 30px -6px var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="primary"]:hover{transform:translateY(-1px);filter:brightness(1.06)}
[data-vibeui-block="hero-033"] [data-part="secondary"]{color:inherit;border:1px solid var(--vibeui-hero-033-line);background:var(--vibeui-hero-033-glass)}
[data-vibeui-block="hero-033"] [data-part="secondary"]:hover{background:var(--vibeui-hero-033-line)}
[data-vibeui-block="hero-033"] [data-part="trust"]{margin:1.4rem 0 0;font-size:.85rem;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="demo"]{display:grid;gap:.8rem;border-radius:1.2rem;padding:.8rem;background:var(--vibeui-hero-033-glass);border:1px solid var(--vibeui-hero-033-line);backdrop-filter:blur(14px);box-shadow:0 40px 80px -40px rgb(0 0 0 / .7),0 1px 0 rgb(255 255 255 / .12) inset}
[data-vibeui-block="hero-033"] [data-part="pane"]{border-radius:.8rem;background:color-mix(in oklab,var(--vibeui-hero-033-bg) 70%,transparent);border:1px solid var(--vibeui-hero-033-line);padding:.9rem 1rem;min-height:11rem;font-size:.85rem}
[data-vibeui-block="hero-033"] [data-part="ph"]{display:flex;align-items:center;gap:.5rem;margin:0 0 .7rem;font-family:var(--vibeui-hero-033-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="ph"] i{width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="ph"][data-ai="true"] i{box-shadow:0 0 10px var(--vibeui-hero-033-accent);animation:vibeui-hero-033-pulse 1.4s ease-in-out infinite}
[data-vibeui-block="hero-033"] [data-part="lines"]{margin:0;padding:0;list-style:none;display:grid;gap:.45rem;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="lines"] b{font-weight:600;color:var(--vibeui-hero-033-fg)}
[data-vibeui-block="hero-033"] [data-part="out"]{margin:0;white-space:pre-wrap;word-break:break-word;line-height:1.55}
[data-vibeui-block="hero-033"] [data-part="out"] b{display:block;margin-top:.5rem;font-family:var(--vibeui-hero-033-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="out"] b:first-child{margin-top:0}
[data-vibeui-block="hero-033"] [data-part="out"] i{display:inline-block;width:.5em;height:1em;vertical-align:text-bottom;background:var(--vibeui-hero-033-accent);animation:vibeui-hero-033-cursor 1s steps(1) infinite}
[data-vibeui-block="hero-033"] a:focus-visible{outline:2px solid var(--vibeui-hero-033-accent);outline-offset:3px}
@keyframes vibeui-hero-033-drift{from{transform:translateX(-3%) rotate(-2deg)}to{transform:translateX(3%) rotate(2deg)}}
@keyframes vibeui-hero-033-pulse{50%{opacity:.4}}
@keyframes vibeui-hero-033-cursor{50%{opacity:0}}
@container (min-width: 60rem){[data-vibeui-block="hero-033"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;padding:6rem 2rem 5rem}[data-vibeui-block="hero-033"] [data-part="demo"]{grid-template-columns:1fr 1fr}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-033"] *{animation:none!important;transition:none!important}}`

const DEFAULT_TRANSCRIPT: Hero033Line[] = [
  { who: "Лена", text: "Давайте релиз перенесём на четверг, тесты не успевают." },
  { who: "Марк", text: "Ок, но тогда я беру на себя миграцию базы до среды." },
  { who: "Оля", text: "Мне нужно от дизайна финальные иконки к вторнику, иначе всё сдвинется." },
  { who: "Лена", text: "Риск: у платёжного провайдера окно обслуживания в среду ночью." },
]

const DEFAULT_SUMMARY = ["# Решения", "Релиз перенесён на четверг.", "# Задачи", "Марк — миграция базы до среды.", "Дизайн — иконки Оле до вторника.", "# Риски", "Окно обслуживания провайдера в среду ночью."]

/** Первый экран AI-продукта: ассистент печатает сводку по расшифровке. */
export function Hero033({
  eyebrow = "AI для встреч · без протоколов",
  title = "Созвон закончился — *решения уже в трекере*",
  lede = "Сводка слушает встречу, выделяет решения, задачи и риски и раскладывает их по Jira, Notion и Telegram. Пока вы наливаете кофе.",
  primaryLabel = "Начать бесплатно",
  primaryHref = "#start",
  secondaryLabel = "Попробовать в песочнице",
  secondaryHref = "#sandbox",
  trust = "4 200 команд уже перестали писать протоколы",
  transcriptTitle = "расшифровка · 42:10",
  transcript = DEFAULT_TRANSCRIPT,
  summaryTitle = "сводка",
  summary = DEFAULT_SUMMARY,
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero033Props) {
  const [count, setCount] = useState(0)
  const tokens = summary.flatMap((line) => (line.startsWith("# ") ? [line] : line.split(" ").map((word, index, all) => (index < all.length - 1 ? `${word} ` : `${word}\n`))))

  useEffect(() => {
    let i = 0
    let timer = 0
    const step = () => {
      i += 1
      setCount(i)
      if (i >= tokens.length) {
        timer = window.setTimeout(() => {
          i = 0
          setCount(0)
          timer = window.setTimeout(step, 700)
        }, 5000)
        return
      }
      timer = window.setTimeout(step, tokens[i - 1].startsWith("# ") ? 420 : 70 + Math.random() * 90)
    }
    timer = window.setTimeout(step, 900)
    return () => window.clearTimeout(timer)
  }, [tokens])

  const titleParts = title.split(/(\*[^*]+\*)/)
  const palette = {
    ...(accent ? { "--vibeui-hero-033-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-033-fg": ink } : null),
    ...(background ? { "--vibeui-hero-033-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-033" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-033" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="aurora" aria-hidden="true" />
        <div data-part="shell">
          <div>
            {eyebrow ? (
              <p data-part="eyebrow">
                <i aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}
            <h1 data-part="title">{titleParts.map((part, index) => (part.startsWith("*") ? <em key={index}>{part.slice(1, -1)}</em> : <span key={index}>{part}</span>))}</h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
            {trust ? <p data-part="trust">{trust}</p> : null}
          </div>
          <div data-part="demo" aria-label="Демо: расшифровка и сводка">
            <div data-part="pane">
              <p data-part="ph">
                <i aria-hidden="true" />
                {transcriptTitle}
              </p>
              <ul data-part="lines">
                {transcript.map((line, index) => (
                  <li key={index}>
                    <b>{line.who}:</b> {line.text}
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="pane">
              <p data-part="ph" data-ai="true">
                <i aria-hidden="true" />
                {summaryTitle}
              </p>
              <pre data-part="out" aria-live="polite">
                {tokens.slice(0, count).map((token, index) => (token.startsWith("# ") ? <b key={index}>{token.slice(2)}</b> : <span key={index}>{token}</span>))}
                <i aria-hidden="true" />
              </pre>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
