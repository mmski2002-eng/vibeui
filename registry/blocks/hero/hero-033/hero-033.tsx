"use client"

import { useEffect, useState, type CSSProperties } from "react"

export type Hero033Person = {
  name: string
  /** Цвет аватара. */
  color: string
}

export type Hero033Line = {
  /** Индекс говорящего в people. */
  who: number
  text: string
}

export type Hero033Props = {
  eyebrow?: string
  /** Слово в *звёздочках* — акцентным градиентом. */
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Строка доверия: «4 200 команд уже перестали писать протоколы». */
  trust?: string
  /** Окно созвона: название, метка записи, участники и субтитры по очереди. */
  callTitle?: string
  recLabel?: string
  people?: readonly Hero033Person[]
  captions?: readonly Hero033Line[]
  /** Плашка после созвона: «Созвон завершён · 42:10», «сводка готова за 38 с». */
  endedLabel?: string
  readyLabel?: string
  /** Задача в трекере. */
  taskKey?: string
  taskTitle?: string
  taskMeta?: string
  taskStatus?: string
  /** Сообщение в мессенджере. */
  chatTitle?: string
  chatText?: string
  /** Страница решений в базе знаний. */
  docTitle?: string
  docItems?: readonly string[]
  /** aria сцены. */
  demoLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран AI-продукта для созвонов, который иллюстрирует свой же
// заголовок. Справа сцена по кругу: идёт созвон на троих — у говорящего
// пульсирует кольцо, снизу бегут субтитры, в углу «Сводка записывает».
// Созвон завершается — окно сжимается в плашку «Созвон завершён · сводка
// готова за 38 с», и одна за другой выезжают готовые результаты в настоящих
// мини-интерфейсах: задача в трекере с исполнителем и сроком, сообщение со
// сводкой в мессенджере, страница решений в базе знаний. Пауза — и заново.
// Слева заголовок в три строки, слово в звёздочках — градиентом.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@500;600;700&family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-033"]){
--vibeui-hero-033-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-033-on-accent:oklch(from var(--vibeui-hero-033-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-033-muted:color-mix(in oklab,var(--vibeui-hero-033-fg) 60%,var(--vibeui-hero-033-bg));
--vibeui-hero-033-line:color-mix(in oklab,var(--vibeui-hero-033-fg) 10%,transparent);
--vibeui-hero-033-panel:color-mix(in oklab,var(--vibeui-hero-033-fg) 5%,var(--vibeui-hero-033-bg));
--vibeui-hero-033-a2:#8b7cf6;
--vibeui-hero-033-rec:#ff5c7a;
--vibeui-hero-033-ease:cubic-bezier(.22,1,.36,1);
--vibeui-hero-033-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-033-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-033-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container:vibeui-hero-033/inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-033"]{color-scheme:dark}
:where([data-vibeui-block="hero-033"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-033"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-033"]{box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate;background:var(--vibeui-hero-033-bg);color:var(--vibeui-hero-033-fg);font-family:var(--vibeui-hero-033-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-033"] *{box-sizing:border-box}
[data-vibeui-block="hero-033"] [data-part="glow"]{position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(60% 55% at 78% 30%,color-mix(in oklab,var(--vibeui-hero-033-a2) 22%,transparent),transparent 70%),radial-gradient(45% 50% at 12% 10%,color-mix(in oklab,var(--vibeui-hero-033-accent) 14%,transparent),transparent 70%),linear-gradient(to bottom,transparent 70%,var(--vibeui-hero-033-bg))}
[data-vibeui-block="hero-033"] [data-part="grid"]{position:absolute;inset:0;z-index:-1;pointer-events:none;background-image:linear-gradient(var(--vibeui-hero-033-line) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-hero-033-line) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(70% 60% at 50% 30%,#000,transparent);opacity:.5}
[data-vibeui-block="hero-033"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:7rem 1.25rem 4rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="hero-033"] [data-part="eyebrow"]{margin:0 0 1.4rem;display:inline-flex;align-items:center;gap:.55rem;padding:.3rem .75rem .3rem .35rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-hero-033-fg) 6%,transparent);box-shadow:inset 0 0 0 1px var(--vibeui-hero-033-line);font-size:.8rem;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .7s var(--vibeui-hero-033-ease) both}
[data-vibeui-block="hero-033"] [data-part="eyebrow-dot"]{position:relative;width:1.3rem;height:1.3rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-hero-033-accent) 16%,transparent)}
[data-vibeui-block="hero-033"] [data-part="eyebrow-dot"]::after{content:"";position:absolute;inset:.4rem;border-radius:50%;background:var(--vibeui-hero-033-accent);box-shadow:0 0 10px var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-033-display);font-weight:700;font-size:clamp(2.4rem,4.3cqi,3.9rem);line-height:1.04;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="hero-033"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em 0;margin:0 -.04em}
[data-vibeui-block="hero-033"] [data-part="w"] > span{display:inline-block;translate:0 112%;animation:vibeui-hero-033-mask .9s var(--vibeui-hero-033-ease) forwards;animation-delay:calc(.1s + var(--vibeui-hero-033-i) * .06s)}
[data-vibeui-block="hero-033"] [data-part="w"] > span[data-em]{background:linear-gradient(100deg,var(--vibeui-hero-033-accent),var(--vibeui-hero-033-a2));-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="hero-033"] [data-part="lede"]{margin:1.5rem 0 0;max-width:31rem;font-size:1.1rem;line-height:1.6;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .5s both}
[data-vibeui-block="hero-033"] [data-part="actions"]{display:flex;align-items:center;gap:.7rem 1.4rem;flex-wrap:wrap;margin-top:2rem;animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .65s both}
[data-vibeui-block="hero-033"] [data-part="primary"]{display:inline-flex;align-items:center;gap:.6rem;height:3.2rem;padding:0 1.5rem;border-radius:999px;background:var(--vibeui-hero-033-accent);color:var(--vibeui-hero-033-on-accent);font-weight:600;text-decoration:none;box-shadow:0 14px 34px -14px var(--vibeui-hero-033-accent),inset 0 1px 0 rgb(255 255 255 / .35);transition:translate .3s var(--vibeui-hero-033-ease),box-shadow .3s}
[data-vibeui-block="hero-033"] [data-part="primary"]:hover{translate:0 -2px;box-shadow:0 20px 40px -14px var(--vibeui-hero-033-accent),inset 0 1px 0 rgb(255 255 255 / .35)}
[data-vibeui-block="hero-033"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;color:var(--vibeui-hero-033-fg);font-weight:500;text-decoration:none;padding:.3rem 0;border-bottom:1px solid var(--vibeui-hero-033-line);transition:border-color .3s}
[data-vibeui-block="hero-033"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] :is([data-part="primary"],[data-part="secondary"]):focus-visible{outline:2px solid var(--vibeui-hero-033-accent);outline-offset:4px}
[data-vibeui-block="hero-033"] [data-part="trust"]{display:flex;align-items:center;gap:.7rem;margin:2rem 0 0;font-size:.85rem;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .8s both}
[data-vibeui-block="hero-033"] [data-part="faces"]{display:flex}
[data-vibeui-block="hero-033"] [data-part="faces"] i{width:1.6rem;height:1.6rem;margin-left:-.45rem;border-radius:50%;border:2px solid var(--vibeui-hero-033-bg);background:var(--vibeui-hero-033-c)}
[data-vibeui-block="hero-033"] [data-part="faces"] i:first-child{margin-left:0}
[data-vibeui-block="hero-033"] [data-part="stage"]{position:relative;height:28rem;animation:vibeui-hero-033-rise 1s var(--vibeui-hero-033-ease) .3s both}
[data-vibeui-block="hero-033"] [data-part="call"]{position:absolute;inset:0 0 auto;height:22rem;display:grid;grid-template-rows:auto 1fr auto;border-radius:1.4rem;background:var(--vibeui-hero-033-panel);box-shadow:inset 0 0 0 1px var(--vibeui-hero-033-line),0 40px 80px -40px rgb(0 0 0 / .8);overflow:hidden;transform-origin:50% 0;transition:height .8s var(--vibeui-hero-033-ease),opacity .6s,translate .8s var(--vibeui-hero-033-ease)}
[data-vibeui-block="hero-033"][data-phase="results"] [data-part="call"]{height:3.2rem}
[data-vibeui-block="hero-033"] [data-part="bar"]{display:flex;align-items:center;gap:.6rem;height:3.2rem;padding:0 1rem;border-bottom:1px solid var(--vibeui-hero-033-line);font-size:.82rem}
[data-vibeui-block="hero-033"] [data-part="dots"]{display:flex;gap:.3rem}
[data-vibeui-block="hero-033"] [data-part="dots"] i{width:.55rem;height:.55rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-hero-033-fg) 18%,transparent)}
[data-vibeui-block="hero-033"] [data-part="call-title"]{font-weight:600}
[data-vibeui-block="hero-033"] [data-part="rec"]{display:inline-flex;align-items:center;gap:.4rem;margin-left:auto;padding:.2rem .6rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-hero-033-rec) 14%,transparent);color:color-mix(in oklab,var(--vibeui-hero-033-rec) 70%,var(--vibeui-hero-033-fg));font-size:.72rem;font-weight:500;white-space:nowrap}
[data-vibeui-block="hero-033"] [data-part="rec"] i{width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-hero-033-rec);animation:vibeui-hero-033-blink 1.2s steps(1) infinite}
[data-vibeui-block="hero-033"][data-phase="results"] [data-part="rec"]{background:color-mix(in oklab,var(--vibeui-hero-033-accent) 14%,transparent);color:var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"][data-phase="results"] [data-part="rec"] i{background:var(--vibeui-hero-033-accent);animation:none}
[data-vibeui-block="hero-033"] [data-part="time"]{font-family:var(--vibeui-hero-033-mono);font-size:.74rem;color:var(--vibeui-hero-033-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-033"] [data-part="people"]{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem;padding:.8rem;transition:opacity .4s}
[data-vibeui-block="hero-033"][data-phase="results"] [data-part="people"],[data-vibeui-block="hero-033"][data-phase="results"] [data-part="caption"]{opacity:0}
[data-vibeui-block="hero-033"] [data-part="tile"]{position:relative;display:grid;place-items:center;border-radius:1rem;background:radial-gradient(120% 90% at 50% 0%,color-mix(in oklab,var(--vibeui-hero-033-c) 22%,transparent),transparent 70%),color-mix(in oklab,var(--vibeui-hero-033-fg) 4%,transparent);box-shadow:inset 0 0 0 1px var(--vibeui-hero-033-line);transition:box-shadow .4s}
[data-vibeui-block="hero-033"] [data-part="tile"][data-talking="true"]{box-shadow:inset 0 0 0 1.5px var(--vibeui-hero-033-accent),0 0 30px -10px var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="avatar"]{position:relative;display:grid;place-items:center;width:3.4rem;height:3.4rem;border-radius:50%;background:linear-gradient(145deg,var(--vibeui-hero-033-c),color-mix(in oklab,var(--vibeui-hero-033-c) 50%,#000));color:#fff;font-family:var(--vibeui-hero-033-display);font-weight:700;font-size:1.2rem}
[data-vibeui-block="hero-033"] [data-part="tile"][data-talking="true"] [data-part="avatar"]::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid var(--vibeui-hero-033-accent);animation:vibeui-hero-033-talk 1.2s ease-out infinite}
[data-vibeui-block="hero-033"] [data-part="name"]{position:absolute;left:.6rem;bottom:.5rem;display:flex;align-items:center;gap:.35rem;font-size:.72rem;font-weight:500;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="wave"]{display:inline-flex;align-items:center;gap:1.5px;height:.7rem}
[data-vibeui-block="hero-033"] [data-part="wave"] i{width:2px;height:100%;border-radius:2px;background:var(--vibeui-hero-033-accent);transform:scaleY(.25);transform-origin:center}
[data-vibeui-block="hero-033"] [data-part="tile"][data-talking="true"] [data-part="wave"] i{animation:vibeui-hero-033-eq .8s ease-in-out infinite}
[data-vibeui-block="hero-033"] [data-part="wave"] i:nth-child(2){animation-delay:-.3s}
[data-vibeui-block="hero-033"] [data-part="wave"] i:nth-child(3){animation-delay:-.55s}
[data-vibeui-block="hero-033"] [data-part="caption"]{min-height:3.4rem;margin:0;padding:.7rem 1rem .9rem;font-size:.86rem;line-height:1.45;color:var(--vibeui-hero-033-fg);transition:opacity .4s}
[data-vibeui-block="hero-033"] [data-part="caption"] b{color:var(--vibeui-hero-033-accent);font-weight:600}
[data-vibeui-block="hero-033"] [data-part="caption"] span{animation:vibeui-hero-033-type .5s ease-out both}
[data-vibeui-block="hero-033"] [data-part="results"]{position:absolute;inset:4rem 0 0;display:grid;align-content:start;gap:.7rem}
[data-vibeui-block="hero-033"] [data-part="card"]{display:flex;align-items:flex-start;gap:.8rem;padding:.9rem 1rem;border-radius:1.1rem;background:var(--vibeui-hero-033-panel);box-shadow:inset 0 0 0 1px var(--vibeui-hero-033-line),0 24px 50px -30px rgb(0 0 0 / .8);opacity:0;translate:0 18px;scale:.97;transition:opacity .5s,translate .7s var(--vibeui-hero-033-ease),scale .7s var(--vibeui-hero-033-ease);transition-delay:0s}
[data-vibeui-block="hero-033"][data-phase="results"] [data-part="card"]{opacity:1;translate:0 0;scale:1;transition-delay:calc(.35s + var(--vibeui-hero-033-i) * .45s)}
[data-vibeui-block="hero-033"] [data-part="app"]{display:grid;place-items:center;flex:none;width:2.2rem;height:2.2rem;border-radius:.65rem;color:#fff;font-family:var(--vibeui-hero-033-display);font-weight:700;font-size:.85rem}
[data-vibeui-block="hero-033"] [data-part="app"][data-app="task"]{background:linear-gradient(145deg,#2f7bff,#1c4fd6)}
[data-vibeui-block="hero-033"] [data-part="app"][data-app="chat"]{background:linear-gradient(145deg,#37b7ff,#1f8fe0)}
[data-vibeui-block="hero-033"] [data-part="app"][data-app="doc"]{background:#f2f2f2;color:#111}
[data-vibeui-block="hero-033"] [data-part="body"]{flex:1;min-width:0;display:grid;gap:.25rem}
[data-vibeui-block="hero-033"] [data-part="card-head"]{display:flex;align-items:center;gap:.5rem;font-size:.72rem;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="card-head"] code{font-family:var(--vibeui-hero-033-mono);font-size:.7rem;color:var(--vibeui-hero-033-fg)}
[data-vibeui-block="hero-033"] [data-part="status"]{margin-left:auto;padding:.05rem .45rem;border-radius:.35rem;background:color-mix(in oklab,var(--vibeui-hero-033-accent) 14%,transparent);color:var(--vibeui-hero-033-accent);font-size:.66rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
[data-vibeui-block="hero-033"] [data-part="card-title"]{margin:0;font-weight:600;font-size:.92rem}
[data-vibeui-block="hero-033"] [data-part="card-text"]{margin:0;font-size:.82rem;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="bubble"]{margin:0;padding:.55rem .75rem;border-radius:.2rem .9rem .9rem .9rem;background:color-mix(in oklab,var(--vibeui-hero-033-fg) 7%,transparent);font-size:.82rem;line-height:1.45}
[data-vibeui-block="hero-033"] [data-part="checks"]{display:grid;gap:.2rem;margin:0;padding:0;list-style:none;font-size:.82rem;color:var(--vibeui-hero-033-muted)}
[data-vibeui-block="hero-033"] [data-part="checks"] li{display:flex;align-items:center;gap:.45rem}
[data-vibeui-block="hero-033"] [data-part="checks"] li::before{content:"";flex:none;width:.8rem;height:.8rem;border-radius:.25rem;background:var(--vibeui-hero-033-accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2.5 6.2l2.2 2.2L9.5 3.6' fill='none' stroke='%23000' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") center/80% no-repeat}
@keyframes vibeui-hero-033-mask{to{translate:0 0}}
@keyframes vibeui-hero-033-up{from{opacity:0;translate:0 14px}}
@keyframes vibeui-hero-033-rise{from{opacity:0;translate:0 30px}}
@keyframes vibeui-hero-033-blink{50%{opacity:.2}}
@keyframes vibeui-hero-033-talk{from{scale:1;opacity:.9}to{scale:1.35;opacity:0}}
@keyframes vibeui-hero-033-eq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
@keyframes vibeui-hero-033-type{from{opacity:0;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 0 0 0)}}
@container vibeui-hero-033 (min-width: 60rem){[data-vibeui-block="hero-033"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,31rem);gap:4rem;min-height:min(100svh,52rem);padding:7.5rem 1.25rem 4rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-033"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-033"] [data-part="w"] > span{translate:0 0}[data-vibeui-block="hero-033"] [data-part="call"]{height:3.2rem}[data-vibeui-block="hero-033"] :is([data-part="people"],[data-part="caption"]){opacity:0}[data-vibeui-block="hero-033"] [data-part="card"]{opacity:1;translate:0 0;scale:1}}`

const DEFAULT_PEOPLE: Hero033Person[] = [
  { name: "Лена", color: "#8b7cf6" },
  { name: "Марк", color: "#22c3a6" },
  { name: "Оля", color: "#f59e5b" },
]

const DEFAULT_CAPTIONS: Hero033Line[] = [
  { who: 0, text: "Давайте релиз перенесём на четверг, тесты не успевают." },
  { who: 1, text: "Ок, тогда я беру миграцию базы до среды." },
  { who: 2, text: "Мне нужны финальные иконки к вторнику." },
  { who: 0, text: "И риск: у провайдера окно обслуживания в среду ночью." },
]

const CAPTION_MS = 2200
const HOLD_MS = 6500

/** Первый экран AI-продукта: созвон заканчивается, а результаты сами разлетаются по сервисам. */
export function Hero033({
  eyebrow = "AI для встреч · без протоколов",
  title = "Созвон закончился — *решения уже в трекере*",
  lede = "Сводка слушает встречу, выделяет решения, задачи и риски и раскладывает их по Jira, Notion и Telegram. Пока вы наливаете кофе.",
  primaryLabel = "Начать бесплатно",
  primaryHref = "#start",
  secondaryLabel = "Попробовать в песочнице",
  secondaryHref = "#sandbox",
  trust = "4 200 команд уже перестали писать протоколы",
  callTitle = "Планёрка релиза",
  recLabel = "Сводка записывает",
  people = DEFAULT_PEOPLE,
  captions = DEFAULT_CAPTIONS,
  endedLabel = "Созвон завершён · 42:10",
  readyLabel = "сводка готова за 38 с",
  taskKey = "REL-248",
  taskTitle = "Миграция базы",
  taskMeta = "Марк · до среды",
  taskStatus = "в работе",
  chatTitle = "#релиз · Сводка",
  chatText = "Релиз переносим на четверг. Задачи: миграция базы — Марк, иконки — дизайн. Риск: окно провайдера в среду.",
  docTitle = "Решения · планёрка релиза",
  docItems = ["Релиз — в четверг", "Деплой утром, после окна провайдера"],
  demoLabel = "Демо: созвон и его результаты",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero033Props) {
  const [phase, setPhase] = useState<"call" | "results">("call")
  const [line, setLine] = useState(0)

  // Сцена по кругу: субтитры по очереди, потом результаты, пауза — и заново.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let timer = 0
    let index = 0
    const next = () => {
      if (index < captions.length - 1) {
        index += 1
        setLine(index)
        timer = window.setTimeout(next, CAPTION_MS)
        return
      }
      setPhase("results")
      timer = window.setTimeout(() => {
        index = 0
        setLine(0)
        setPhase("call")
        timer = window.setTimeout(next, CAPTION_MS)
      }, HOLD_MS)
    }
    timer = window.setTimeout(next, CAPTION_MS)
    return () => window.clearTimeout(timer)
  }, [captions.length])

  const words = title.split(/(\*[^*]+\*)/).flatMap((part) => {
    const em = part.startsWith("*")
    return (em ? part.slice(1, -1) : part)
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, em }))
  })
  const caption = captions[line]
  const talking = phase === "call" ? caption?.who : -1

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
      <section data-vibeui-block="hero-033" data-tone={tone === "auto" ? undefined : tone} data-phase={phase} className={className} style={palette}>
        <i data-part="glow" aria-hidden="true" />
        <i data-part="grid" aria-hidden="true" />
        <div data-part="shell">
          <div>
            {eyebrow ? (
              <p data-part="eyebrow">
                <span data-part="eyebrow-dot" aria-hidden="true" />
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
            {trust ? (
              <p data-part="trust">
                <span data-part="faces" aria-hidden="true">
                  {people.map((person) => (
                    <i key={person.name} style={{ ["--vibeui-hero-033-c" as string]: person.color } as CSSProperties} />
                  ))}
                </span>
                {trust}
              </p>
            ) : null}
          </div>
          <div data-part="stage" role="img" aria-label={demoLabel}>
            <div data-part="call">
              <div data-part="bar">
                <span data-part="dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span data-part="call-title">{phase === "results" ? endedLabel : callTitle}</span>
                <span data-part="rec">
                  <i aria-hidden="true" />
                  {phase === "results" ? readyLabel : recLabel}
                </span>
              </div>
              <div data-part="people">
                {people.map((person, index) => (
                  <div key={person.name} data-part="tile" data-talking={talking === index} style={{ ["--vibeui-hero-033-c" as string]: person.color } as CSSProperties}>
                    <span data-part="avatar">{person.name.charAt(0)}</span>
                    <span data-part="name">
                      <span data-part="wave" aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      {person.name}
                    </span>
                  </div>
                ))}
              </div>
              {caption ? (
                <p data-part="caption">
                  <b>{people[caption.who]?.name}:</b> <span key={line}>{caption.text}</span>
                </p>
              ) : null}
            </div>
            <div data-part="results">
              <div data-part="card" style={{ ["--vibeui-hero-033-i" as string]: 0 } as CSSProperties}>
                <span data-part="app" data-app="task">
                  J
                </span>
                <div data-part="body">
                  <span data-part="card-head">
                    <code>{taskKey}</code>
                    <span data-part="status">{taskStatus}</span>
                  </span>
                  <p data-part="card-title">{taskTitle}</p>
                  <p data-part="card-text">{taskMeta}</p>
                </div>
              </div>
              <div data-part="card" style={{ ["--vibeui-hero-033-i" as string]: 1 } as CSSProperties}>
                <span data-part="app" data-app="chat">
                  T
                </span>
                <div data-part="body">
                  <span data-part="card-head">{chatTitle}</span>
                  <p data-part="bubble">{chatText}</p>
                </div>
              </div>
              <div data-part="card" style={{ ["--vibeui-hero-033-i" as string]: 2 } as CSSProperties}>
                <span data-part="app" data-app="doc">
                  N
                </span>
                <div data-part="body">
                  <p data-part="card-title">{docTitle}</p>
                  <ul data-part="checks">
                    {docItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
