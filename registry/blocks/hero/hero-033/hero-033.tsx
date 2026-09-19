"use client"

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react"

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
// на заголовках секций) и по кругу начинает заново. Пока печатается
// строка сводки, в расшифровке подсвечивается реплика, из которой она
// выросла (совпадение по основам слов). Заголовок гигантский, слова
// въезжают через маску, слово в звёздочках — аврора-градиентом. Аврора
// на фоне чуть плывёт за курсором (параллакс), стеклянная панель ловит
// блик и spotlight под указателем, главная кнопка магнитится к курсору.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@500;600;700;800&family=Golos+Text:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

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
--vibeui-hero-033-px:0;
--vibeui-hero-033-py:0;
--vibeui-hero-033-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-hero-033-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-033-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-033-mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-033"]{color-scheme:dark}
:where([data-vibeui-block="hero-033"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-033"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-033"]{box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate;background:var(--vibeui-hero-033-bg);color:var(--vibeui-hero-033-fg);font-family:var(--vibeui-hero-033-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-033"] *{box-sizing:border-box}
[data-vibeui-block="hero-033"] [data-part="noise"]{position:absolute;inset:0;z-index:1;background-image:${NOISE};background-size:200px;opacity:.06;mix-blend-mode:soft-light;pointer-events:none}
[data-vibeui-block="hero-033"] [data-part="aurora"]{position:absolute;inset:-25% -15% auto;height:80%;pointer-events:none;filter:blur(48px);transform:translate3d(calc(var(--vibeui-hero-033-px) * 2.5%),calc(var(--vibeui-hero-033-py) * 2.5%),0);transition:transform .9s var(--vibeui-hero-033-ease)}
[data-vibeui-block="hero-033"] [data-part="blob"]{position:absolute;border-radius:50%;animation:vibeui-hero-033-drift 18s ease-in-out infinite alternate}
[data-vibeui-block="hero-033"] [data-part="blob"]:nth-child(1){left:8%;top:10%;width:42%;aspect-ratio:1.3;background:color-mix(in oklab,var(--vibeui-hero-033-accent) 42%,transparent)}
[data-vibeui-block="hero-033"] [data-part="blob"]:nth-child(2){left:45%;top:0;width:36%;aspect-ratio:1;background:color-mix(in oklab,var(--vibeui-hero-033-a2) 40%,transparent);animation-delay:-6s;animation-direction:alternate-reverse}
[data-vibeui-block="hero-033"] [data-part="blob"]:nth-child(3){left:70%;top:25%;width:32%;aspect-ratio:1.2;background:color-mix(in oklab,var(--vibeui-hero-033-a3) 32%,transparent);animation-delay:-11s}
[data-vibeui-block="hero-033"] [data-part="shell"]{position:relative;z-index:2;max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem 4rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="hero-033"] [data-part="eyebrow"]{margin:0 0 1.2rem;display:inline-flex;align-items:center;gap:.5rem;padding:.35rem .8rem;border-radius:999px;border:1px solid var(--vibeui-hero-033-line);background:var(--vibeui-hero-033-glass);font-family:var(--vibeui-hero-033-mono);font-size:.72rem;letter-spacing:.06em;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .7s var(--vibeui-hero-033-ease) both}
[data-vibeui-block="hero-033"] [data-part="eyebrow"] i{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-hero-033-accent);box-shadow:0 0 12px var(--vibeui-hero-033-accent);animation:vibeui-hero-033-pulse 1.6s ease-in-out infinite}
[data-vibeui-block="hero-033"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-033-display);font-weight:800;font-size:clamp(2.8rem,7.4cqi,6.2rem);line-height:.96;letter-spacing:-.045em;text-wrap:balance}
[data-vibeui-block="hero-033"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em 0;margin:0 -.04em}
[data-vibeui-block="hero-033"] [data-part="w"] span{display:inline-block;transform:translateY(112%);animation:vibeui-hero-033-mask .9s var(--vibeui-hero-033-ease) forwards;animation-delay:calc(.12s + var(--vibeui-hero-033-i) * .07s)}
[data-vibeui-block="hero-033"] [data-part="w"] span[data-em]{background:linear-gradient(100deg,var(--vibeui-hero-033-accent),var(--vibeui-hero-033-a2) 50%,var(--vibeui-hero-033-a3));background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:vibeui-hero-033-mask .9s var(--vibeui-hero-033-ease) forwards,vibeui-hero-033-hue 6s linear infinite;animation-delay:calc(.12s + var(--vibeui-hero-033-i) * .07s),0s}
[data-vibeui-block="hero-033"] [data-part="lede"]{margin:1.4rem 0 0;max-width:32rem;font-size:1.12rem;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .55s both}
[data-vibeui-block="hero-033"] [data-part="actions"]{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.8rem;animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .7s both}
[data-vibeui-block="hero-033"] [data-part="primary"],[data-vibeui-block="hero-033"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.4rem;border-radius:.9rem;font-weight:600;text-decoration:none;font-size:.95rem;transition:transform .4s var(--vibeui-hero-033-ease),filter .3s,background .3s,box-shadow .4s;will-change:transform}
[data-vibeui-block="hero-033"] [data-part="primary"]{position:relative;background:var(--vibeui-hero-033-accent);color:var(--vibeui-hero-033-on-accent);box-shadow:0 0 30px -6px var(--vibeui-hero-033-accent),0 10px 30px -14px var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="primary"]:hover{filter:brightness(1.08);box-shadow:0 0 44px -6px var(--vibeui-hero-033-accent),0 16px 34px -14px var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="primary"] svg{width:1em;height:1em;transition:transform .4s var(--vibeui-hero-033-ease)}
[data-vibeui-block="hero-033"] [data-part="primary"]:hover svg{transform:translateX(3px)}
[data-vibeui-block="hero-033"] [data-part="secondary"]{color:inherit;border:1px solid var(--vibeui-hero-033-line);background:var(--vibeui-hero-033-glass)}
[data-vibeui-block="hero-033"] [data-part="secondary"]:hover{background:var(--vibeui-hero-033-line);transform:translateY(-2px)}
[data-vibeui-block="hero-033"] [data-part="trust"]{margin:1.4rem 0 0;font-size:.85rem;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .85s both}
[data-vibeui-block="hero-033"] [data-part="demo"]{--vibeui-hero-033-x:50%;--vibeui-hero-033-y:30%;position:relative;overflow:hidden;display:grid;gap:.8rem;border-radius:1.4rem;padding:.8rem;background:var(--vibeui-hero-033-glass);border:1px solid color-mix(in oklab,var(--vibeui-hero-033-fg) 18%,transparent);backdrop-filter:blur(18px);box-shadow:0 50px 100px -40px rgb(0 0 0 / .75),0 30px 80px -50px var(--vibeui-hero-033-accent),0 1px 0 rgb(255 255 255 / .16) inset;animation:vibeui-hero-033-rise 1.1s var(--vibeui-hero-033-ease) .35s both;transition:transform .8s var(--vibeui-hero-033-ease)}
[data-vibeui-block="hero-033"] [data-part="demo"]::before{content:"";position:absolute;inset:0;background:radial-gradient(28rem circle at var(--vibeui-hero-033-x) var(--vibeui-hero-033-y),color-mix(in oklab,var(--vibeui-hero-033-accent) 22%,transparent),transparent 55%);opacity:0;transition:opacity .5s;pointer-events:none}
[data-vibeui-block="hero-033"] [data-part="demo"][data-hover="true"]::before{opacity:1}
[data-vibeui-block="hero-033"] [data-part="demo"]::after{content:"";position:absolute;inset:-60% -30%;background:linear-gradient(115deg,transparent 40%,rgb(255 255 255 / .16) 48%,rgb(255 255 255 / .05) 52%,transparent 60%);transform:translateX(-70%) rotate(0.001deg);animation:vibeui-hero-033-sheen 9s var(--vibeui-hero-033-ease) 1.6s infinite;pointer-events:none}
[data-vibeui-block="hero-033"] [data-part="pane"]{position:relative;border-radius:.9rem;background:color-mix(in oklab,var(--vibeui-hero-033-bg) 72%,transparent);border:1px solid var(--vibeui-hero-033-line);padding:.9rem 1rem;min-height:11rem;font-size:.85rem}
[data-vibeui-block="hero-033"] [data-part="ph"]{display:flex;align-items:center;gap:.5rem;margin:0 0 .7rem;font-family:var(--vibeui-hero-033-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="ph"] i{width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="ph"][data-ai="true"] i{box-shadow:0 0 10px var(--vibeui-hero-033-accent);animation:vibeui-hero-033-pulse 1.4s ease-in-out infinite}
[data-vibeui-block="hero-033"] [data-part="lines"]{margin:0;padding:0;list-style:none;display:grid;gap:.3rem;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="lines"] li{position:relative;padding:.3rem .55rem .3rem .75rem;margin:0 -.55rem 0 -.75rem;border-radius:.5rem;border-left:2px solid transparent;transition:background .5s var(--vibeui-hero-033-ease),color .5s,border-color .5s,transform .5s var(--vibeui-hero-033-ease)}
[data-vibeui-block="hero-033"] [data-part="lines"] li b{font-weight:600;color:var(--vibeui-hero-033-fg)}
[data-vibeui-block="hero-033"] [data-part="lines"] li[data-active="true"]{background:color-mix(in oklab,var(--vibeui-hero-033-accent) 14%,transparent);color:var(--vibeui-hero-033-fg);border-left-color:var(--vibeui-hero-033-accent);transform:translateX(3px)}
[data-vibeui-block="hero-033"] [data-part="lines"] li[data-active="true"] b{color:var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="out"]{margin:0;white-space:pre-wrap;word-break:break-word;line-height:1.55}
[data-vibeui-block="hero-033"] [data-part="out"] b{display:block;margin-top:.55rem;font-family:var(--vibeui-hero-033-mono);font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-hero-033-accent);animation:vibeui-hero-033-up .5s var(--vibeui-hero-033-ease) both}
[data-vibeui-block="hero-033"] [data-part="out"] b:first-child{margin-top:0}
[data-vibeui-block="hero-033"] [data-part="out"] i{display:inline-block;width:.5em;height:1em;vertical-align:text-bottom;background:var(--vibeui-hero-033-accent);box-shadow:0 0 10px var(--vibeui-hero-033-accent);animation:vibeui-hero-033-cursor 1s steps(1) infinite}
[data-vibeui-block="hero-033"] a:focus-visible{outline:2px solid var(--vibeui-hero-033-accent);outline-offset:3px}
@keyframes vibeui-hero-033-drift{from{transform:translate(-6%,-4%) scale(1)}to{transform:translate(6%,6%) scale(1.15)}}
@keyframes vibeui-hero-033-pulse{50%{opacity:.4}}
@keyframes vibeui-hero-033-cursor{50%{opacity:0}}
@keyframes vibeui-hero-033-mask{to{transform:translateY(0)}}
@keyframes vibeui-hero-033-hue{to{background-position:200% 0}}
@keyframes vibeui-hero-033-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes vibeui-hero-033-rise{from{opacity:0;transform:translateY(40px) scale(.97)}to{opacity:1}}
@keyframes vibeui-hero-033-sheen{0%{transform:translateX(-70%) rotate(0.001deg)}35%,100%{transform:translateX(70%) rotate(0.001deg)}}
@container (min-width: 60rem){[data-vibeui-block="hero-033"] [data-part="shell"]{grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);gap:4rem;padding:6rem 2rem 5.5rem}[data-vibeui-block="hero-033"] [data-part="demo"]{grid-template-columns:1fr 1fr;transform:perspective(1400px) rotateY(calc(var(--vibeui-hero-033-px) * -3deg)) rotateX(calc(var(--vibeui-hero-033-py) * 3deg))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-033"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-033"] [data-part="w"] span{transform:none}[data-vibeui-block="hero-033"] [data-part="demo"]{transform:none}}`

const DEFAULT_TRANSCRIPT: Hero033Line[] = [
  { who: "Лена", text: "Давайте релиз перенесём на четверг, тесты не успевают." },
  { who: "Марк", text: "Ок, но тогда я беру на себя миграцию базы до среды." },
  { who: "Оля", text: "Мне нужно от дизайна финальные иконки к вторнику, иначе всё сдвинется." },
  { who: "Лена", text: "Риск: у платёжного провайдера окно обслуживания в среду ночью." },
]

const DEFAULT_SUMMARY = ["# Решения", "Релиз перенесён на четверг.", "# Задачи", "Марк — миграция базы до среды.", "Дизайн — иконки Оле до вторника.", "# Риски", "Окно обслуживания провайдера в среду ночью."]

// Основы слов для сопоставления строки сводки с репликой: первые четыре
// буквы слов длиннее трёх — «перенесём/перенесён», «среды/среду» сходятся.
function stems(text: string) {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-zа-яё0-9]+/i)
      .filter((word) => word.length > 3)
      .map((word) => word.slice(0, 4)),
  )
}

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
  const rootRef = useRef<HTMLElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)
  const primaryRef = useRef<HTMLAnchorElement>(null)
  const tokens = useMemo(() => summary.flatMap((line) => (line.startsWith("# ") ? [line] : line.split(" ").map((word, index, all) => (index < all.length - 1 ? `${word} ` : `${word}\n`)))), [summary])

  // Для каждого токена — индекс реплики, которую подсветить: строка сводки
  // ищет реплику с наибольшим числом общих основ, заголовок берёт реплику
  // следующей за ним строки.
  const owners = useMemo(() => {
    const lineStems = transcript.map((line) => stems(`${line.who} ${line.text}`))
    const byLine = summary.map((line) => {
      if (line.startsWith("# ")) return -1
      const own = stems(line)
      let best = -1
      let bestScore = 0
      lineStems.forEach((set, index) => {
        let score = 0
        own.forEach((stem) => {
          if (set.has(stem)) score += 1
        })
        if (score > bestScore) {
          bestScore = score
          best = index
        }
      })
      return best
    })
    for (let i = summary.length - 1, next = -1; i >= 0; i -= 1) {
      if (byLine[i] === -1) byLine[i] = next
      else next = byLine[i]
    }
    return summary.flatMap((line, index) => Array.from({ length: line.startsWith("# ") ? 1 : line.split(" ").length }, () => byLine[index]))
  }, [summary, transcript])

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

  const onRootMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return
    const root = rootRef.current
    if (!root) return
    const rect = root.getBoundingClientRect()
    root.style.setProperty("--vibeui-hero-033-px", (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3))
    root.style.setProperty("--vibeui-hero-033-py", (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3))
  }
  const onRootLeave = () => {
    const root = rootRef.current
    if (!root) return
    root.style.setProperty("--vibeui-hero-033-px", "0")
    root.style.setProperty("--vibeui-hero-033-py", "0")
  }
  const onDemoMove = (event: PointerEvent<HTMLDivElement>) => {
    const demo = demoRef.current
    if (!demo) return
    const rect = demo.getBoundingClientRect()
    demo.style.setProperty("--vibeui-hero-033-x", `${event.clientX - rect.left}px`)
    demo.style.setProperty("--vibeui-hero-033-y", `${event.clientY - rect.top}px`)
    demo.dataset.hover = "true"
  }
  const onDemoLeave = () => {
    if (demoRef.current) demoRef.current.dataset.hover = "false"
  }
  const onPrimaryMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return
    const button = primaryRef.current
    if (!button) return
    const rect = button.getBoundingClientRect()
    const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    button.style.transform = `translate(${(dx * 7).toFixed(1)}px,${(dy * 6).toFixed(1)}px)`
  }
  const onPrimaryLeave = () => {
    if (primaryRef.current) primaryRef.current.style.transform = ""
  }

  const activeLine = count > 0 ? owners[Math.min(count, owners.length) - 1] : -1
  const words = title.split(/(\*[^*]+\*)/).flatMap((part) => {
    const em = part.startsWith("*")
    return (em ? part.slice(1, -1) : part)
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, em }))
  })
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
      <section ref={rootRef} data-vibeui-block="hero-033" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} onPointerMove={onRootMove} onPointerLeave={onRootLeave}>
        <div data-part="aurora" aria-hidden="true">
          <i data-part="blob" />
          <i data-part="blob" />
          <i data-part="blob" />
        </div>
        <div data-part="noise" aria-hidden="true" />
        <div data-part="shell">
          <div>
            {eyebrow ? (
              <p data-part="eyebrow">
                <i aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}
            <h1 data-part="title">
              {words
                .map((item, index) => (
                  <span key={index} data-part="w">
                    <span data-em={item.em ? "" : undefined} style={{ ["--vibeui-hero-033-i" as string]: index }}>
                      {item.word}
                    </span>
                  </span>
                ))
                .flatMap((node, index) => (index ? [" ", node] : [node]))}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <a ref={primaryRef} data-part="primary" href={primaryHref} onPointerMove={onPrimaryMove} onPointerLeave={onPrimaryLeave}>
                  {primaryLabel}
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
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
          <div ref={demoRef} data-part="demo" aria-label="Демо: расшифровка и сводка" onPointerMove={onDemoMove} onPointerLeave={onDemoLeave}>
            <div data-part="pane">
              <p data-part="ph">
                <i aria-hidden="true" />
                {transcriptTitle}
              </p>
              <ul data-part="lines">
                {transcript.map((line, index) => (
                  <li key={index} data-active={index === activeLine ? "true" : undefined}>
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
