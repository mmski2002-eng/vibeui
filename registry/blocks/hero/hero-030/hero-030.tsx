"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Hero030Manager = {
  name: string
  command: string
}

export type Hero030Props = {
  eyebrow?: string
  title?: string
  /** Слово в *звёздочках* красится акцентом. */
  lede?: string
  managers?: readonly Hero030Manager[]
  copyLabel?: string
  copiedLabel?: string
  /** Строки терминала, печатаются по одной; строка с префиксом «$ » — команда. */
  terminal?: readonly string[]
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Строка фактов под кнопками: «4 КБ · TypeScript · MIT». */
  facts?: readonly string[]
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран open-source библиотеки: заголовок с акцентным словом, команда
// установки с вкладками npm / pnpm / yarn / bun и кнопкой «скопировать»
// (Clipboard API, подпись меняется на «скопировано» на две секунды), справа
// тёмный терминал, который печатает вывод сам — символ за символом, команды
// с «$», курсор мигает. Клетчатая подложка — сетка 24px на CSS.
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
--vibeui-hero-030-font:"Onest",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-030-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-030"]{color-scheme:dark}
:where([data-vibeui-block="hero-030"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-030"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-030"]{box-sizing:border-box;position:relative;overflow:hidden;background:var(--vibeui-hero-030-bg);color:var(--vibeui-hero-030-fg);font-family:var(--vibeui-hero-030-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="hero-030"] *{box-sizing:border-box}
[data-vibeui-block="hero-030"] [data-part="grid-bg"]{position:absolute;inset:0;background-image:linear-gradient(var(--vibeui-hero-030-line) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-hero-030-line) 1px,transparent 1px);background-size:24px 24px;mask-image:radial-gradient(ellipse 70% 60% at 50% 40%,#000,transparent);pointer-events:none;opacity:.6}
[data-vibeui-block="hero-030"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:4.5rem 1.25rem 4rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="hero-030"] [data-part="eyebrow"]{margin:0 0 1rem;display:inline-flex;align-items:center;gap:.5rem;font-family:var(--vibeui-hero-030-mono);font-size:.75rem;padding:.3rem .6rem;border-radius:6px;border:1px solid var(--vibeui-hero-030-line);background:var(--vibeui-hero-030-panel);color:var(--vibeui-hero-030-muted)}
[data-vibeui-block="hero-030"] [data-part="eyebrow"] i{width:.45rem;height:.45rem;border-radius:50%;background:var(--vibeui-hero-030-accent)}
[data-vibeui-block="hero-030"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2.4rem,6cqi,4.4rem);line-height:1.02;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="hero-030"] [data-part="title"] em{font-style:normal;color:var(--vibeui-hero-030-accent)}
[data-vibeui-block="hero-030"] [data-part="lede"]{margin:1.2rem 0 0;max-width:32rem;color:var(--vibeui-hero-030-muted);font-size:1.08rem}
[data-vibeui-block="hero-030"] [data-part="install"]{margin-top:1.8rem;border:1px solid var(--vibeui-hero-030-line);border-radius:8px;background:var(--vibeui-hero-030-panel);overflow:hidden;max-width:34rem}
[data-vibeui-block="hero-030"] [data-part="tabs"]{display:flex;border-bottom:1px solid var(--vibeui-hero-030-line)}
[data-vibeui-block="hero-030"] [data-part="tabs"] button{flex:none;border:0;background:none;color:var(--vibeui-hero-030-muted);font:inherit;font-family:var(--vibeui-hero-030-mono);font-size:.75rem;padding:.55rem .9rem;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .2s,border-color .2s}
[data-vibeui-block="hero-030"] [data-part="tabs"] button[aria-selected="true"]{color:var(--vibeui-hero-030-fg);border-color:var(--vibeui-hero-030-accent)}
[data-vibeui-block="hero-030"] [data-part="cmd"]{display:flex;align-items:center;gap:.8rem;padding:.8rem 1rem;font-family:var(--vibeui-hero-030-mono);font-size:.92rem}
[data-vibeui-block="hero-030"] [data-part="cmd"] code{flex:1;overflow:auto;white-space:nowrap}
[data-vibeui-block="hero-030"] [data-part="cmd"] code::before{content:"$ ";color:var(--vibeui-hero-030-muted)}
[data-vibeui-block="hero-030"] [data-part="copy"]{flex:none;border:1px solid var(--vibeui-hero-030-line);border-radius:6px;background:var(--vibeui-hero-030-bg);color:inherit;font:inherit;font-size:.78rem;padding:.35rem .6rem;cursor:pointer;transition:border-color .2s,background .2s,color .2s}
[data-vibeui-block="hero-030"] [data-part="copy"][data-done="true"]{background:var(--vibeui-hero-030-accent);color:var(--vibeui-hero-030-on-accent);border-color:transparent}
[data-vibeui-block="hero-030"] [data-part="actions"]{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.4rem}
[data-vibeui-block="hero-030"] [data-part="primary"],[data-vibeui-block="hero-030"] [data-part="secondary"]{display:inline-flex;align-items:center;padding:.75rem 1.2rem;border-radius:8px;font-weight:600;text-decoration:none;font-size:.95rem;transition:filter .2s,background .2s}
[data-vibeui-block="hero-030"] [data-part="primary"]{background:var(--vibeui-hero-030-accent);color:var(--vibeui-hero-030-on-accent)}
[data-vibeui-block="hero-030"] [data-part="primary"]:hover{filter:brightness(1.08)}
[data-vibeui-block="hero-030"] [data-part="secondary"]{color:inherit;border:1px solid var(--vibeui-hero-030-line)}
[data-vibeui-block="hero-030"] [data-part="secondary"]:hover{background:var(--vibeui-hero-030-panel)}
[data-vibeui-block="hero-030"] [data-part="facts"]{display:flex;gap:1rem;flex-wrap:wrap;margin:1.4rem 0 0;padding:0;list-style:none;font-family:var(--vibeui-hero-030-mono);font-size:.75rem;color:var(--vibeui-hero-030-muted)}
[data-vibeui-block="hero-030"] [data-part="facts"] li::before{content:"✓ ";color:var(--vibeui-hero-030-green)}
[data-vibeui-block="hero-030"] [data-part="term"]{border-radius:10px;background:var(--vibeui-hero-030-term);color:var(--vibeui-hero-030-term-fg);font-family:var(--vibeui-hero-030-mono);font-size:.85rem;line-height:1.6;box-shadow:0 30px 60px -30px rgb(0 0 0 / .6),0 0 0 1px rgb(255 255 255 / .06);overflow:hidden}
[data-vibeui-block="hero-030"] [data-part="bar"]{display:flex;align-items:center;gap:.4rem;padding:.7rem .9rem;border-bottom:1px solid rgb(255 255 255 / .08)}
[data-vibeui-block="hero-030"] [data-part="bar"] i{width:.65rem;height:.65rem;border-radius:50%;background:rgb(255 255 255 / .18)}
[data-vibeui-block="hero-030"] [data-part="bar"] span{margin-left:auto;font-size:.68rem;color:rgb(255 255 255 / .4)}
[data-vibeui-block="hero-030"] [data-part="out"]{margin:0;padding:1rem 1.1rem 1.2rem;min-height:14rem;white-space:pre-wrap;word-break:break-word}
[data-vibeui-block="hero-030"] [data-part="out"] b{font-weight:500;color:var(--vibeui-hero-030-green)}
[data-vibeui-block="hero-030"] [data-part="out"] i{display:inline-block;width:.55em;height:1.1em;vertical-align:text-bottom;background:var(--vibeui-hero-030-term-fg);animation:vibeui-hero-030-cursor 1s steps(1) infinite}
[data-vibeui-block="hero-030"] button:focus-visible,[data-vibeui-block="hero-030"] a:focus-visible{outline:2px solid var(--vibeui-hero-030-accent);outline-offset:2px}
@keyframes vibeui-hero-030-cursor{50%{opacity:0}}
@container (min-width: 60rem){[data-vibeui-block="hero-030"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:4rem;padding:6rem 2rem 5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-030"] *{animation:none!important;transition:none!important}}`

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

/** Первый экран open-source библиотеки: установка с копированием и живой терминал. */
export function Hero030({
  eyebrow = "v2.4 · headless-таблица для React",
  title = "Таблица, которая *весит меньше*, чем ваш favicon",
  lede = "Сортировка, группировка, виртуализация и типы — без единого стиля. tabl отдаёт данные и поведение, разметку рисуете вы.",
  managers = DEFAULT_MANAGERS,
  copyLabel = "скопировать",
  copiedLabel = "скопировано",
  terminal = DEFAULT_TERMINAL,
  primaryLabel = "Документация",
  primaryHref = "#docs",
  secondaryLabel = "Открыть песочницу",
  secondaryHref = "#playground",
  facts = ["4 КБ gzip", "TypeScript", "0 зависимостей", "MIT"],
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero030Props) {
  const [manager, setManager] = useState(0)
  const [copied, setCopied] = useState(false)
  const [typed, setTyped] = useState("")

  useEffect(() => {
    const full = terminal.join("\n")
    let i = 0
    let timer = 0
    const step = () => {
      i += 1
      setTyped(full.slice(0, i))
      if (i < full.length) {
        const char = full[i - 1]
        timer = window.setTimeout(step, char === "\n" ? 260 : 18 + Math.random() * 30)
      }
    }
    timer = window.setTimeout(step, 600)
    return () => window.clearTimeout(timer)
  }, [terminal])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(managers[manager].command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* буфер недоступен — подпись не меняем */
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-hero-030-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-030-fg": ink } : null),
    ...(background ? { "--vibeui-hero-030-bg": background } : null),
    ...style,
  } as CSSProperties

  const titleParts = title.split(/(\*[^*]+\*)/)

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-030" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-030" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="grid-bg" aria-hidden="true" />
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
            <div data-part="install">
              <div data-part="tabs" role="tablist" aria-label="Менеджер пакетов">
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
            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="term" aria-label="Терминал">
            <div data-part="bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>zsh — 80×24</span>
            </div>
            <pre data-part="out">
              {typed.split("\n").map((line, index, all) => (
                <span key={index}>
                  {line.startsWith("$ ") ? (
                    <>
                      <b>$</b>
                      {line.slice(1)}
                    </>
                  ) : (
                    line
                  )}
                  {index < all.length - 1 ? "\n" : null}
                </span>
              ))}
              <i aria-hidden="true" />
            </pre>
          </div>
        </div>
      </section>
    </>
  )
}
