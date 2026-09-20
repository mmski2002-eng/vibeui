"use client"

import { useEffect, useState, type CSSProperties, type PointerEvent } from "react"

export type Hero030Manager = {
  name: string
  command: string
}

export type Hero030Props = {
  eyebrow?: string
  title?: string
  /** Слово в *звёздочках* — моноширинным в рамке акцентом. */
  lede?: string
  managers?: readonly Hero030Manager[]
  copyLabel?: string
  copiedLabel?: string
  /** Строки терминала: строка с префиксом «$ » печатается как команда и «устанавливается» с прогресс-баром, строка с «✓» — зелёная. */
  terminal?: readonly string[]
  /** Сценарий терминала повторяется по кругу. */
  loop?: boolean
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Строка фактов под кнопками: «4 КБ · TypeScript · MIT». */
  facts?: readonly string[]
  /** aria вкладок и терминала. */
  managersLabel?: string
  terminalLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

type TerminalLine = { kind: "cmd" | "out" | "ok"; text: string } | { kind: "bar"; value: number }

// Первый экран open-source библиотеки: гигантский заголовок, слова которого
// въезжают через маски, одно слово — моноширинным в рамке акцентом; команда
// установки с вкладками npm / pnpm / yarn / bun и копированием; справа
// тёмный терминал, который сам печатает команду, «устанавливает» пакет с
// прогресс-баром, выводит результат и через паузу начинает заново. Курсор
// мигает, терминал наклоняется за курсором, главная кнопка — магнитная.
// Подложка — сетка-точки и два размытых пятна цвета акцента.
const FONTS = "https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-030"]){
--vibeui-hero-030-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-030-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-030-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-030-on-accent:oklch(from var(--vibeui-hero-030-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-030-muted:color-mix(in oklab,var(--vibeui-hero-030-fg) 60%,var(--vibeui-hero-030-bg));
--vibeui-hero-030-line:color-mix(in oklab,var(--vibeui-hero-030-fg) 12%,transparent);
--vibeui-hero-030-panel:color-mix(in oklab,var(--vibeui-hero-030-fg) 4%,var(--vibeui-hero-030-bg));
--vibeui-hero-030-term:#0f1117;
--vibeui-hero-030-term-fg:#d7dbe3;
--vibeui-hero-030-green:#7ee787;
--vibeui-hero-030-ease:cubic-bezier(.2,.8,.2,1);
--vibeui-hero-030-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-030-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-030"]{color-scheme:dark}
:where([data-vibeui-block="hero-030"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-030"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-030"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-030-bg);color:var(--vibeui-hero-030-fg);font-family:var(--vibeui-hero-030-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="hero-030"] *{box-sizing:border-box}
[data-vibeui-block="hero-030"] [data-part="grid-bg"]{position:absolute;inset:0;background-image:radial-gradient(color-mix(in oklab,var(--vibeui-hero-030-fg) 22%,transparent) 1px,transparent 1.3px);background-size:22px 22px;mask-image:radial-gradient(ellipse 80% 70% at 50% 30%,#000 30%,transparent);pointer-events:none;opacity:.55}
[data-vibeui-block="hero-030"] [data-part="blob"]{position:absolute;width:38rem;height:38rem;border-radius:50%;background:var(--vibeui-hero-030-accent);filter:blur(90px);opacity:.28;pointer-events:none;top:-14rem;right:-10rem;animation:vibeui-hero-030-float 18s ease-in-out infinite alternate;will-change:transform}
[data-vibeui-block="hero-030"] [data-part="blob"][data-second="true"]{background:oklch(from var(--vibeui-hero-030-accent) l c calc(h + 70));top:auto;right:auto;left:-16rem;bottom:-18rem;opacity:.18;animation-duration:24s;animation-delay:-8s}
[data-vibeui-block="hero-030"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4rem 1.25rem 4rem}
[data-vibeui-block="hero-030"] [data-part="eyebrow"]{margin:0 0 1.4rem;display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-hero-030-mono);font-size:.75rem;padding:.3rem .6rem;border-radius:6px;border:1px solid var(--vibeui-hero-030-line);background:var(--vibeui-hero-030-panel);color:var(--vibeui-hero-030-muted)}
[data-vibeui-block="hero-030"] [data-part="eyebrow"] i{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-hero-030-accent);box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-hero-030-accent) 50%,transparent);animation:vibeui-hero-030-ping 2.4s ease-out infinite}
[data-vibeui-block="hero-030"] [data-part="title"]{margin:0;max-width:64rem;font-weight:800;font-size:clamp(2.8rem,8cqi,6.5rem);line-height:.98;letter-spacing:-.045em;text-wrap:balance}
[data-vibeui-block="hero-030"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.05em .2em .2em .06em;margin:-.05em -.2em -.2em -.06em}
[data-vibeui-block="hero-030"] [data-part="w"] > span{display:inline-block;transform:translateY(110%);animation:vibeui-hero-030-rise .9s var(--vibeui-hero-030-ease) forwards;animation-delay:calc(.15s + var(--vibeui-hero-030-i,0) * .07s)}
[data-vibeui-block="hero-030"] [data-part="w"] em{display:inline-block;font-style:normal;font-family:var(--vibeui-hero-030-mono);font-weight:500;font-size:.82em;line-height:1.08;padding:0 .18em .02em;border:.045em solid var(--vibeui-hero-030-accent);border-radius:.16em;color:var(--vibeui-hero-030-accent);transform:rotate(-1.5deg);box-shadow:.12em .12em 0 color-mix(in oklab,var(--vibeui-hero-030-accent) 22%,transparent)}
[data-vibeui-block="hero-030"] [data-reveal]{opacity:0;transform:translateY(18px);animation:vibeui-hero-030-up .9s var(--vibeui-hero-030-ease) forwards;animation-delay:calc(.45s + var(--vibeui-hero-030-i,0) * .1s)}
[data-vibeui-block="hero-030"] [data-part="row"]{display:grid;gap:2.5rem;margin-top:2.4rem;align-items:start}
[data-vibeui-block="hero-030"] [data-part="lede"]{margin:0;max-width:34rem;color:var(--vibeui-hero-030-muted);font-size:1.12rem}
[data-vibeui-block="hero-030"] [data-part="install"]{margin-top:1.6rem;border:1px solid var(--vibeui-hero-030-line);border-radius:10px;background:var(--vibeui-hero-030-panel);overflow:hidden;max-width:34rem;transition:box-shadow .4s,border-color .3s}
[data-vibeui-block="hero-030"] [data-part="install"]:hover{border-color:color-mix(in oklab,var(--vibeui-hero-030-accent) 40%,var(--vibeui-hero-030-line));box-shadow:0 16px 40px -24px color-mix(in oklab,var(--vibeui-hero-030-accent) 60%,transparent)}
[data-vibeui-block="hero-030"] [data-part="tabs"]{display:flex;border-bottom:1px solid var(--vibeui-hero-030-line)}
[data-vibeui-block="hero-030"] [data-part="tabs"] button{flex:none;border:0;background:none;color:var(--vibeui-hero-030-muted);font:inherit;font-family:var(--vibeui-hero-030-mono);font-size:.75rem;padding:.55rem .9rem;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s,border-color .2s,transform .2s}
[data-vibeui-block="hero-030"] [data-part="tabs"] button:hover{color:var(--vibeui-hero-030-fg);transform:translateY(-1px)}
[data-vibeui-block="hero-030"] [data-part="tabs"] button[aria-selected="true"]{color:var(--vibeui-hero-030-fg);border-color:var(--vibeui-hero-030-accent)}
[data-vibeui-block="hero-030"] [data-part="cmd"]{display:flex;align-items:center;gap:.8rem;padding:.85rem 1rem;font-family:var(--vibeui-hero-030-mono);font-size:.95rem}
[data-vibeui-block="hero-030"] [data-part="cmd"] code{flex:1;overflow:auto;white-space:nowrap}
[data-vibeui-block="hero-030"] [data-part="cmd"] code::before{content:"$ ";color:var(--vibeui-hero-030-accent)}
[data-vibeui-block="hero-030"] [data-part="copy"]{flex:none;border:1px solid var(--vibeui-hero-030-line);border-radius:6px;background:var(--vibeui-hero-030-bg);color:inherit;font:inherit;font-size:.78rem;padding:.4rem .65rem;cursor:pointer;transition:border-color .2s,background .3s,color .2s,transform .25s var(--vibeui-hero-030-ease)}
[data-vibeui-block="hero-030"] [data-part="copy"]:hover{transform:translateY(-1px);border-color:var(--vibeui-hero-030-accent)}
[data-vibeui-block="hero-030"] [data-part="copy"][data-done="true"]{background:var(--vibeui-hero-030-accent);color:var(--vibeui-hero-030-on-accent);border-color:transparent}
[data-vibeui-block="hero-030"] [data-part="actions"]{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.4rem}
[data-vibeui-block="hero-030"] [data-part="primary"],[data-vibeui-block="hero-030"] [data-part="secondary"]{display:inline-flex;align-items:center;padding:.85rem 1.4rem;border-radius:10px;font-weight:600;text-decoration:none;font-size:.98rem;transform:translate(calc(var(--vibeui-hero-030-mx,0) * 1px),calc(var(--vibeui-hero-030-my,0) * 1px));transition:transform .35s var(--vibeui-hero-030-ease),background .25s,box-shadow .35s,border-color .25s}
[data-vibeui-block="hero-030"] [data-part="primary"]{background:var(--vibeui-hero-030-accent);color:var(--vibeui-hero-030-on-accent);box-shadow:0 12px 30px -14px color-mix(in oklab,var(--vibeui-hero-030-accent) 70%,transparent)}
[data-vibeui-block="hero-030"] [data-part="primary"]:hover{box-shadow:0 20px 40px -14px color-mix(in oklab,var(--vibeui-hero-030-accent) 85%,transparent)}
[data-vibeui-block="hero-030"] [data-part="secondary"]{color:inherit;border:1px solid var(--vibeui-hero-030-line)}
[data-vibeui-block="hero-030"] [data-part="secondary"]:hover{background:var(--vibeui-hero-030-panel);border-color:color-mix(in oklab,var(--vibeui-hero-030-fg) 30%,transparent);transform:translateY(-2px)}
[data-vibeui-block="hero-030"] [data-part="facts"]{display:flex;gap:1rem;flex-wrap:wrap;margin:1.4rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-hero-030-mono);font-size:.75rem;color:var(--vibeui-hero-030-muted)}
[data-vibeui-block="hero-030"] [data-part="facts"] li::before{content:"✓ ";color:var(--vibeui-hero-030-green)}
[data-vibeui-block="hero-030"] [data-part="scene"]{perspective:1400px}
[data-vibeui-block="hero-030"] [data-part="term"]{border-radius:12px;background:var(--vibeui-hero-030-term);color:var(--vibeui-hero-030-term-fg);font-family:var(--vibeui-hero-030-mono);font-size:.86rem;line-height:1.65;box-shadow:0 40px 80px -30px color-mix(in oklab,var(--vibeui-hero-030-accent) 50%,rgb(0 0 0 / .5)),0 0 0 1px rgb(255 255 255 / .07);overflow:hidden;transform:rotateX(calc(var(--vibeui-hero-030-rx,0) * 1deg)) rotateY(calc(var(--vibeui-hero-030-ry,0) * 1deg));transition:transform .6s var(--vibeui-hero-030-ease);transform-style:preserve-3d}
[data-vibeui-block="hero-030"] [data-part="bar"]{display:flex;align-items:center;gap:.4rem;padding:.7rem .9rem;border-bottom:1px solid rgb(255 255 255 / .08)}
[data-vibeui-block="hero-030"] [data-part="bar"] i{width:.65rem;height:.65rem;border-radius:50%;background:rgb(255 255 255 / .18)}
[data-vibeui-block="hero-030"] [data-part="bar"] i:nth-child(1){background:#ff5f57}
[data-vibeui-block="hero-030"] [data-part="bar"] i:nth-child(2){background:#febc2e}
[data-vibeui-block="hero-030"] [data-part="bar"] i:nth-child(3){background:#28c840}
[data-vibeui-block="hero-030"] [data-part="bar"] span{margin-left:auto;font-size:.68rem;color:rgb(255 255 255 / .4)}
[data-vibeui-block="hero-030"] [data-part="out"]{margin:0;padding:1rem 1.1rem 1.2rem;min-height:15rem;white-space:pre-wrap;word-break:break-word;transition:opacity .4s}
[data-vibeui-block="hero-030"] [data-part="out"][data-fade="true"]{opacity:0}
[data-vibeui-block="hero-030"] [data-part="out"] > span{display:block;animation:vibeui-hero-030-line .3s ease-out}
[data-vibeui-block="hero-030"] [data-part="out"] b{font-weight:500;color:var(--vibeui-hero-030-green)}
[data-vibeui-block="hero-030"] [data-part="out"] [data-kind="ok"]{color:var(--vibeui-hero-030-green)}
[data-vibeui-block="hero-030"] [data-part="out"] [data-kind="out"]{color:color-mix(in oklab,var(--vibeui-hero-030-term-fg) 70%,transparent)}
[data-vibeui-block="hero-030"] [data-part="prog"]{display:flex;align-items:center;gap:.7rem;padding:.2rem 0 .1rem;color:color-mix(in oklab,var(--vibeui-hero-030-term-fg) 70%,transparent);font-size:.78rem;animation:none}
[data-vibeui-block="hero-030"] [data-part="track"]{flex:0 1 12rem;height:.5rem;border-radius:999px;background:rgb(255 255 255 / .1);overflow:hidden}
[data-vibeui-block="hero-030"] [data-part="track"] i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--vibeui-hero-030-accent),var(--vibeui-hero-030-green));transform-origin:left;transition:transform .12s linear}
[data-vibeui-block="hero-030"] [data-part="cursor"]{display:inline-block;width:.55em;height:1.1em;margin-left:.05em;vertical-align:text-bottom;background:var(--vibeui-hero-030-term-fg);animation:vibeui-hero-030-cursor 1s steps(1) infinite}
[data-vibeui-block="hero-030"] button:focus-visible,[data-vibeui-block="hero-030"] a:focus-visible{outline:2px solid var(--vibeui-hero-030-accent);outline-offset:2px}
@keyframes vibeui-hero-030-cursor{50%{opacity:0}}
@keyframes vibeui-hero-030-rise{to{transform:none}}
@keyframes vibeui-hero-030-up{to{opacity:1;transform:none}}
@keyframes vibeui-hero-030-line{from{opacity:0;transform:translateX(-4px)}}
@keyframes vibeui-hero-030-float{to{transform:translate(-6rem,5rem) scale(1.12)}}
@keyframes vibeui-hero-030-ping{70%,100%{box-shadow:0 0 0 .6rem transparent}}
@container (min-width: 60rem){[data-vibeui-block="hero-030"] [data-part="shell"]{padding:5rem 2rem 5.5rem}[data-vibeui-block="hero-030"] [data-part="row"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4rem;margin-top:3rem}}
@media (hover: none){[data-vibeui-block="hero-030"] [data-part="term"]{transform:none}}
[data-vibeui-block="hero-030"] [data-part="w"]:not(:last-child)::after{content:"\\00a0"}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-030"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-030"] [data-part="w"] > span{transform:none}[data-vibeui-block="hero-030"] [data-reveal]{opacity:1;transform:none}[data-vibeui-block="hero-030"] [data-part="blob"]{opacity:.12}}`

const DEFAULT_MANAGERS: Hero030Manager[] = [
  { name: "npm", command: "npm i tabl" },
  { name: "pnpm", command: "pnpm add tabl" },
  { name: "yarn", command: "yarn add tabl" },
  { name: "bun", command: "bun add tabl" },
]

const DEFAULT_TERMINAL = [
  "$ npm i tabl",
  "added 1 package in 412ms",
  "$ npx tabl init",
  "✓ tabl.config.ts создан",
  "✓ типы колонок выведены из данных: 6 columns",
  "✓ виртуализация: включена (rows > 200)",
  "готово — 4.1 kB gzip, 0 зависимостей",
]

/** Первый экран open-source библиотеки: гигантский заголовок, установка с копированием и живой терминал по кругу. */
export function Hero030({
  eyebrow = "v2.4 · headless-таблица для React",
  title = "Таблица, которая *весит меньше*, чем ваш favicon",
  lede = "Сортировка, группировка, виртуализация и типы — без единого стиля. tabl отдаёт данные и поведение, разметку рисуете вы.",
  managers = DEFAULT_MANAGERS,
  copyLabel = "скопировать",
  copiedLabel = "скопировано",
  terminal = DEFAULT_TERMINAL,
  loop = true,
  primaryLabel = "Документация",
  primaryHref = "#docs",
  secondaryLabel = "Открыть песочницу",
  secondaryHref = "#playground",
  facts = ["4 КБ gzip", "TypeScript", "0 зависимостей", "MIT"],
  managersLabel = "Менеджер пакетов",
  terminalLabel = "Терминал",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero030Props) {
  const [manager, setManager] = useState(0)
  const [copied, setCopied] = useState(false)
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [typing, setTyping] = useState("")
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let alive = true
    let timer = 0
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        timer = window.setTimeout(() => (alive ? resolve() : reject(new Error("stopped"))), ms)
      })
    const run = async () => {
      do {
        setLines([])
        setTyping("")
        setFading(false)
        for (const raw of terminal) {
          if (raw.startsWith("$ ")) {
            const text = raw.slice(2)
            for (let i = 1; i <= text.length; i += 1) {
              setTyping(text.slice(0, i))
              await wait(26 + ((i * 7) % 34))
            }
            await wait(320)
            setTyping("")
            setLines((prev) => [...prev, { kind: "cmd", text }, { kind: "bar", value: 0 }])
            for (let value = 4; value <= 100; value += 4) {
              await wait(value > 80 ? 46 : 26)
              setLines((prev) => [...prev.slice(0, -1), { kind: "bar", value }])
            }
            await wait(140)
          } else {
            setLines((prev) => [...prev, { kind: raw.startsWith("✓") ? "ok" : "out", text: raw }])
            await wait(170)
          }
        }
        if (!loop) return
        await wait(3400)
        setFading(true)
        await wait(450)
      } while (alive)
    }
    timer = window.setTimeout(() => {
      run().catch(() => {
        /* остановлено при размонтировании */
      })
    }, 700)
    return () => {
      alive = false
      window.clearTimeout(timer)
    }
  }, [terminal, loop])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(managers[manager].command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* буфер недоступен — подпись не меняем */
    }
  }

  const magnet = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--vibeui-hero-030-mx", ((event.clientX - rect.left - rect.width / 2) * 0.22).toFixed(1))
    event.currentTarget.style.setProperty("--vibeui-hero-030-my", ((event.clientY - rect.top - rect.height / 2) * 0.22).toFixed(1))
  }
  const release = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--vibeui-hero-030-mx", "0")
    event.currentTarget.style.setProperty("--vibeui-hero-030-my", "0")
  }
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty("--vibeui-hero-030-rx", (-y * 7).toFixed(2))
    event.currentTarget.style.setProperty("--vibeui-hero-030-ry", (x * 9).toFixed(2))
  }
  const untilt = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--vibeui-hero-030-rx", "0")
    event.currentTarget.style.setProperty("--vibeui-hero-030-ry", "0")
  }

  const palette = {
    ...(accent ? { "--vibeui-hero-030-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-030-fg": ink } : null),
    ...(background ? { "--vibeui-hero-030-bg": background } : null),
    ...style,
  } as CSSProperties

  const words = title.split(/(\*[^*]+\*)/).flatMap((part) => (part.startsWith("*") ? [part] : part.split(" ").filter(Boolean)))
  const reveal = (index: number) => ({ ["--vibeui-hero-030-i" as string]: index }) as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-030" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-030" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="grid-bg" aria-hidden="true" />
        <div data-part="blob" aria-hidden="true" />
        <div data-part="blob" data-second="true" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? (
            <p data-part="eyebrow" data-reveal="" style={reveal(-4)}>
              <i aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          <h1 data-part="title">
            {words.map((word, index) => (
              <span key={index} data-part="w" style={reveal(index)}>
                <span>{word.startsWith("*") ? <em>{word.slice(1, -1)}</em> : word}</span>
                {index < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>
          <div data-part="row">
            <div>
              {lede ? (
                <p data-part="lede" data-reveal="" style={reveal(0)}>
                  {lede}
                </p>
              ) : null}
              <div data-part="install" data-reveal="" style={reveal(1)}>
                <div data-part="tabs" role="tablist" aria-label={managersLabel}>
                  {managers.map((item, index) => (
                    <button key={item.name} type="button" role="tab" aria-selected={index === manager} onClick={() => setManager(index)}>
                      {item.name}
                    </button>
                  ))}
                </div>
                <div data-part="cmd">
                  <code>{managers[manager].command}</code>
                  <button type="button" data-part="copy" data-done={copied} onClick={copy}>
                    {copied ? copiedLabel : copyLabel}
                  </button>
                </div>
              </div>
              <div data-part="actions" data-reveal="" style={reveal(2)}>
                {primaryLabel ? (
                  <a data-part="primary" href={primaryHref} onPointerMove={magnet} onPointerLeave={release}>
                    {primaryLabel}
                  </a>
                ) : null}
                {secondaryLabel ? (
                  <a data-part="secondary" href={secondaryHref}>
                    {secondaryLabel}
                  </a>
                ) : null}
              </div>
              {facts.length > 0 ? (
                <ul data-part="facts" data-reveal="" style={reveal(3)}>
                  {facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div data-part="scene" data-reveal="" style={reveal(2)}>
              <div data-part="term" aria-label={terminalLabel} onPointerMove={tilt} onPointerLeave={untilt}>
                <div data-part="bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>zsh — 80×24</span>
                </div>
                <pre data-part="out" data-fade={fading}>
                  {lines.map((line, index) =>
                    line.kind === "bar" ? (
                      <span key={index} data-part="prog" aria-hidden="true">
                        <span data-part="track">
                          <i style={{ transform: `scaleX(${line.value / 100})` }} />
                        </span>
                        {line.value}%
                      </span>
                    ) : (
                      <span key={index} data-kind={line.kind}>
                        {line.kind === "cmd" ? (
                          <>
                            <b>$</b> {line.text}
                          </>
                        ) : (
                          line.text
                        )}
                      </span>
                    ),
                  )}
                  <span data-kind="cmd">
                    <b>$</b> {typing}
                    <i data-part="cursor" aria-hidden="true" />
                  </span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
