"use client"

import { useEffect, useState, type CSSProperties } from "react"

import { Button077 } from "@/registry/components/button/button-077/button-077"

export type Changelog013Tag = "new" | "fix" | "breaking" | "perf"

export type Changelog013Entry = {
  version: string
  date: string
  title: string
  tags?: readonly Changelog013Tag[]
  items: readonly string[]
}

export type Changelog013Install = {
  label: string
  command: string
}

export type Changelog013Props = {
  eyebrow?: string
  title?: string
  lede?: string
  entries?: readonly Changelog013Entry[]
  allLabel?: string
  allHref?: string
  installTitle?: string
  installs?: readonly Changelog013Install[]
  /** Базовое число запросов в секунду; вокруг него тикает счётчик. */
  perSecond?: number
  /** С какого значения стартует счётчик «за сегодня». */
  todayStart?: number
  /** aria вкладок, кнопка копирования, подписи счётчиков. */
  tabsLabel?: string
  copyLabel?: string
  doneLabel?: string
  rpsLabel?: string
  todayLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Лента версий API: слева записи с тегами версий моноширинным, чипами
// new / fix / breaking / perf и списком изменений на вертикальной линии;
// справа липкая панель: команда установки с вкладками npm / pip / go и
// кнопкой «скопировать», ниже два живых счётчика — запросов в секунду
// (дрожит вокруг базового) и за сегодня (растёт на столько же каждую
// секунду). Счётчики стартуют с детерминированных значений, тикают в
// эффекте.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="changelog-013"]){
--vibeui-changelog-013-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-changelog-013-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-changelog-013-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-changelog-013-on-accent:oklch(from var(--vibeui-changelog-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-changelog-013-muted:color-mix(in oklab,var(--vibeui-changelog-013-fg) 60%,var(--vibeui-changelog-013-bg));
--vibeui-changelog-013-line:color-mix(in oklab,var(--vibeui-changelog-013-fg) 12%,transparent);
--vibeui-changelog-013-panel:color-mix(in oklab,var(--vibeui-changelog-013-fg) 4%,var(--vibeui-changelog-013-bg));
--vibeui-changelog-013-warn:#ffb454;
--vibeui-changelog-013-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-changelog-013-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="changelog-013"]{color-scheme:dark}
:where([data-vibeui-block="changelog-013"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="changelog-013"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="changelog-013"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-changelog-013-bg);color:var(--vibeui-changelog-013-fg);font-family:var(--vibeui-changelog-013-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="changelog-013"] *{box-sizing:border-box}
[data-vibeui-block="changelog-013"] [data-part="all"]{margin:1.6rem 0 0 1.4rem}
[data-vibeui-block="changelog-013"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="changelog-013"] [data-part="head"]{max-width:42rem;margin:0 0 2.2rem}
[data-vibeui-block="changelog-013"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-changelog-013-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-changelog-013-accent)}
[data-vibeui-block="changelog-013"] [data-part="eyebrow"]::before{content:"// "}
[data-vibeui-block="changelog-013"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em}
[data-vibeui-block="changelog-013"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-changelog-013-muted)}
[data-vibeui-block="changelog-013"] [data-part="grid"]{display:grid;gap:2rem;align-items:start}
[data-vibeui-block="changelog-013"] [data-part="feed"]{position:relative;margin:0;padding:0 0 0 1.4rem;list-style:none;display:grid;gap:1.6rem}
[data-vibeui-block="changelog-013"] [data-part="feed"]::before{content:"";position:absolute;left:.3rem;top:.4rem;bottom:.4rem;width:1px;background:var(--vibeui-changelog-013-line)}
[data-vibeui-block="changelog-013"] [data-part="entry"]{position:relative;display:grid;gap:.6rem}
[data-vibeui-block="changelog-013"] [data-part="entry"]::before{content:"";position:absolute;left:-1.4rem;top:.45rem;width:.65rem;height:.65rem;border-radius:50%;background:var(--vibeui-changelog-013-bg);border:2px solid var(--vibeui-changelog-013-line);box-sizing:border-box}
[data-vibeui-block="changelog-013"] [data-part="entry"]:first-child::before{border-color:var(--vibeui-changelog-013-accent);background:var(--vibeui-changelog-013-accent);box-shadow:0 0 10px var(--vibeui-changelog-013-accent)}
[data-vibeui-block="changelog-013"] [data-part="meta"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;font-family:var(--vibeui-changelog-013-mono);font-size:.72rem;color:var(--vibeui-changelog-013-muted)}
[data-vibeui-block="changelog-013"] [data-part="version"]{padding:.15rem .5rem;border:1px solid var(--vibeui-changelog-013-line);border-radius:.35rem;color:var(--vibeui-changelog-013-fg);font-weight:600}
[data-vibeui-block="changelog-013"] [data-part="tag"]{padding:.12rem .45rem;border-radius:.3rem;font-size:.64rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;background:color-mix(in oklab,var(--vibeui-changelog-013-fg) 10%,transparent)}
[data-vibeui-block="changelog-013"] [data-part="tag"][data-kind="new"]{background:color-mix(in oklab,var(--vibeui-changelog-013-accent) 18%,transparent);color:var(--vibeui-changelog-013-accent)}
[data-vibeui-block="changelog-013"] [data-part="tag"][data-kind="breaking"]{background:color-mix(in oklab,var(--vibeui-changelog-013-warn) 22%,transparent);color:color-mix(in oklab,var(--vibeui-changelog-013-warn) 80%,var(--vibeui-changelog-013-fg))}
[data-vibeui-block="changelog-013"] [data-part="entry"] h3{margin:0;font-size:1.15rem;font-weight:700;letter-spacing:-.02em}
[data-vibeui-block="changelog-013"] [data-part="items"]{margin:0;padding:0;list-style:none;display:grid;gap:.3rem;font-size:.9rem;color:var(--vibeui-changelog-013-muted)}
[data-vibeui-block="changelog-013"] [data-part="items"] li{display:flex;gap:.5rem}
[data-vibeui-block="changelog-013"] [data-part="items"] li::before{content:"+";font-family:var(--vibeui-changelog-013-mono);color:var(--vibeui-changelog-013-accent);flex-shrink:0}
[data-vibeui-block="changelog-013"] [data-part="side"]{display:grid;gap:1rem}
[data-vibeui-block="changelog-013"] [data-part="install"]{border:1px solid var(--vibeui-changelog-013-line);border-radius:1rem;background:var(--vibeui-changelog-013-panel);padding:1rem}
[data-vibeui-block="changelog-013"] [data-part="install"] h4{margin:0 0 .7rem;font-size:.95rem;font-weight:700}
[data-vibeui-block="changelog-013"] [data-part="tabs"]{display:flex;gap:.2rem;margin:0 0 .6rem}
[data-vibeui-block="changelog-013"] [data-part="tabs"] button{padding:.25rem .6rem;border:0;border-radius:.4rem;background:transparent;color:var(--vibeui-changelog-013-muted);font-family:var(--vibeui-changelog-013-mono);font-size:.72rem;cursor:pointer;transition:background .2s,color .2s}
[data-vibeui-block="changelog-013"] [data-part="tabs"] button[aria-selected="true"]{background:color-mix(in oklab,var(--vibeui-changelog-013-accent) 16%,transparent);color:var(--vibeui-changelog-013-accent)}
[data-vibeui-block="changelog-013"] [data-part="cmd"]{display:flex;align-items:center;gap:.6rem;padding:.6rem .5rem .6rem .9rem;border:1px solid var(--vibeui-changelog-013-line);border-radius:.6rem;background:var(--vibeui-changelog-013-bg);font-family:var(--vibeui-changelog-013-mono);font-size:.8rem}
[data-vibeui-block="changelog-013"] [data-part="cmd"] code{flex:1;min-width:0;overflow-x:auto;white-space:nowrap;scrollbar-width:none}
[data-vibeui-block="changelog-013"] [data-part="cmd"] code::before{content:"$ ";color:var(--vibeui-changelog-013-accent)}
[data-vibeui-block="changelog-013"] [data-part="copy"]{display:inline-flex;align-items:center;gap:.3rem;flex-shrink:0;height:1.9rem;padding:0 .6rem;border:1px solid var(--vibeui-changelog-013-line);border-radius:.4rem;background:transparent;color:var(--vibeui-changelog-013-muted);font-family:var(--vibeui-changelog-013-mono);font-size:.68rem;cursor:pointer;transition:color .2s,border-color .2s}
[data-vibeui-block="changelog-013"] [data-part="copy"]:hover{color:var(--vibeui-changelog-013-fg);border-color:var(--vibeui-changelog-013-fg)}
[data-vibeui-block="changelog-013"] [data-part="copy"][data-done="true"]{color:var(--vibeui-changelog-013-accent);border-color:var(--vibeui-changelog-013-accent)}
[data-vibeui-block="changelog-013"] [data-part="copy"] svg{width:.8rem;height:.8rem}
[data-vibeui-block="changelog-013"] button:focus-visible{outline:2px solid var(--vibeui-changelog-013-accent);outline-offset:2px}
[data-vibeui-block="changelog-013"] [data-part="counters"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem}
[data-vibeui-block="changelog-013"] [data-part="counter"]{display:grid;gap:.15rem;padding:.9rem 1rem;border:1px solid var(--vibeui-changelog-013-line);border-radius:.8rem;background:var(--vibeui-changelog-013-panel)}
[data-vibeui-block="changelog-013"] [data-part="counter"] span{display:flex;align-items:center;gap:.4rem;font-size:.7rem;color:var(--vibeui-changelog-013-muted)}
[data-vibeui-block="changelog-013"] [data-part="counter"] span::before{content:"";width:.4rem;height:.4rem;border-radius:50%;background:var(--vibeui-changelog-013-accent);animation:vibeui-changelog-013-blink 1s ease-in-out infinite}
[data-vibeui-block="changelog-013"] [data-part="counter"] b{font-family:var(--vibeui-changelog-013-mono);font-weight:600;font-size:clamp(1.15rem,3cqi,1.7rem);letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1.1}
@keyframes vibeui-changelog-013-blink{0%,100%{opacity:.3}50%{opacity:1}}
@container (min-width: 60rem){[data-vibeui-block="changelog-013"] [data-part="grid"]{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:3rem}[data-vibeui-block="changelog-013"] [data-part="side"]{position:sticky;top:5rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="changelog-013"] *{animation:none!important;transition:none!important}}`

const DEFAULT_ENTRIES: Changelog013Entry[] = [
  { version: "v2.4.0", date: "12 сен 2026", title: "Подсказки адресов с приоритетом по геопозиции", tags: ["new", "perf"], items: ["/suggest принимает lat/lon и ранжирует ближние адреса выше", "Медиана /suggest упала с 31 до 24 ms за счёт нового индекса", "Поле postal_code теперь есть во всех ответах /geocode"] },
  { version: "v2.3.2", date: "28 авг 2026", title: "Исправления в обратном геокодинге", tags: ["fix"], items: ["/reverse на границе регионов возвращал соседний район — починили", "Пустые house в ответах Казани и Уфы"] },
  { version: "v2.3.0", date: "4 авг 2026", title: "Матрица расстояний до 100 × 100", tags: ["new"], items: ["/matrix считает до 10 000 пар за один запрос", "Профили car, walk, bike; пробки — для car по умолчанию", "Вебхуки для /batch: статус приходит сам"] },
  { version: "v2.0.0", date: "1 июн 2026", title: "Вторая версия API", tags: ["breaking"], items: ["Ответ /geocode: results — массив, а не объект; precision вместо kind", "Ключи вида gk_live_… и gk_test_…; старые работают до 1 декабря", "Единый формат ошибок с полем code"] },
]

const DEFAULT_INSTALLS: Changelog013Install[] = [
  { label: "npm", command: "npm i @geokod/sdk" },
  { label: "pip", command: "pip install geokod" },
  { label: "go", command: "go get geokod.ru/sdk/v2" },
]

function formatNumber(value: number) {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/** Лента версий API с командой установки и живыми счётчиками. */
export function Changelog013({
  eyebrow = "Changelog",
  title = "Что изменилось",
  lede = "Каждая версия — с датой, тегами и списком. Ломающие изменения объявляем за полгода и держим старую версию всё это время.",
  entries = DEFAULT_ENTRIES,
  allLabel = "Все версии",
  allHref = "#changelog-all",
  installTitle = "Установить SDK",
  installs = DEFAULT_INSTALLS,
  perSecond = 1240,
  todayStart = 48213907,
  tabsLabel = "Менеджер пакетов",
  copyLabel = "копировать",
  doneLabel = "готово",
  rpsLabel = "запросов / сек",
  todayLabel = "за сегодня",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Changelog013Props) {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const [rate, setRate] = useState(perSecond)
  const [today, setToday] = useState(todayStart)

  useEffect(() => {
    const timer = setInterval(() => {
      const next = Math.round(perSecond * (0.94 + Math.random() * 0.12))
      setRate(next)
      setToday((value) => value + next)
    }, 1000)
    return () => clearInterval(timer)
  }, [perSecond])

  const install = installs[Math.min(active, installs.length - 1)]

  const copy = () => {
    if (install && typeof navigator !== "undefined" && navigator.clipboard) void navigator.clipboard.writeText(install.command).catch(() => undefined)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const palette = {
    ...(accent ? { "--vibeui-changelog-013-accent": accent } : null),
    ...(ink ? { "--vibeui-changelog-013-fg": ink } : null),
    ...(background ? { "--vibeui-changelog-013-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-changelog-013" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="changelog-013" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="grid">
            <div>
              <ol data-part="feed">
                {entries.map((entry) => (
                  <li key={entry.version} data-part="entry">
                    <div data-part="meta">
                      <span data-part="version">{entry.version}</span>
                      <time>{entry.date}</time>
                      {entry.tags?.map((tag) => (
                        <span key={tag} data-part="tag" data-kind={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3>{entry.title}</h3>
                    <ul data-part="items">
                      {entry.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              {allLabel ? (
                <Button077
                  data-part="all"
                  label={allLabel}
                  href={allHref}
                  accent={accent}
                />
              ) : null}
            </div>
            <aside data-part="side">
              {install ? (
                <div data-part="install">
                  <h4>{installTitle}</h4>
                  <div data-part="tabs" role="tablist" aria-label={tabsLabel}>
                    {installs.map((item, index) => (
                      <button key={item.label} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div data-part="cmd">
                    <code>{install.command}</code>
                    <button data-part="copy" type="button" data-done={copied} onClick={copy}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        {copied ? <path d="M5 13l4 4L19 7" /> : <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>}
                      </svg>
                      {copied ? doneLabel : copyLabel}
                    </button>
                  </div>
                </div>
              ) : null}
              <div data-part="counters" aria-live="off">
                <div data-part="counter">
                  <span>{rpsLabel}</span>
                  <b>{formatNumber(rate)}</b>
                </div>
                <div data-part="counter">
                  <span>{todayLabel}</span>
                  <b>{formatNumber(today)}</b>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
