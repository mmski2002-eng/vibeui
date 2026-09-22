"use client"

import { useSyncExternalStore, type CSSProperties } from "react"
import { Card103 } from "@/registry/components/card/card-103/card-103"

export type Api002Region = {
  name: string
  /** Код региона моноширинным: «msk-1». */
  code: string
  /** Аптайм за 30 дней, строкой: «99,99 %». */
  uptime: string
  /** Базовая латентность p50, мс; вокруг неё считаются живые значения. */
  latency: number
  status?: "ok" | "degraded" | "down"
}

export type Api002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Заголовок сводного статуса: «Все системы работают». */
  summary?: string
  regions?: readonly Api002Region[]
  /** Сколько дней истории в полосе внизу. */
  historyDays?: number
  /** Индексы дней с деградацией (0 — самый старый). */
  historyIncidents?: readonly number[]
  historyLabel?: string
  /** aria лампы, подписи карточки региона, панели и оси. */
  statusLabels?: readonly [string, string, string]
  uptimeLabel?: string
  p50Label?: string
  sparkLabel?: string
  axisLabels?: readonly [string, string, string]
  updatedLine?: string
  historyTitle?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Статус-панель API: сводная лампочка с пульсом и время «обновлено»,
// которое тикает каждую секунду (useSyncExternalStore, на сервере — прочерк),
// четыре региона карточками: лампочка, аптайм, живая p50 и спарклайн
// латентности за 24 часа, который прорисовывается штрихом при появлении
// в viewport. Значения выводятся из текущего времени детерминированным
// шумом — панель живёт без бэкенда. Внизу полоса истории за 90 дней.
const FONTS = "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="api-002"]){
--vibeui-api-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-api-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-api-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-api-002-muted:color-mix(in oklab,var(--vibeui-api-002-fg) 60%,var(--vibeui-api-002-bg));
--vibeui-api-002-line:color-mix(in oklab,var(--vibeui-api-002-fg) 12%,transparent);
--vibeui-api-002-panel:color-mix(in oklab,var(--vibeui-api-002-fg) 4%,var(--vibeui-api-002-bg));
--vibeui-api-002-ok:var(--vibeui-api-002-accent);
--vibeui-api-002-warn:#ffb454;
--vibeui-api-002-down:#ff6b6b;
--vibeui-api-002-display:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-api-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="api-002"]{color-scheme:dark}
:where([data-vibeui-block="api-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="api-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="api-002"]{box-sizing:border-box;padding:5rem 0;background:var(--vibeui-api-002-bg);color:var(--vibeui-api-002-fg);font-family:var(--vibeui-api-002-display);font-size:1rem;line-height:1.5}
[data-vibeui-block="api-002"] *{box-sizing:border-box}
[data-vibeui-block="api-002"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="api-002"] [data-part="head"]{max-width:42rem;margin:0 0 2.2rem}
[data-vibeui-block="api-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-api-002-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-api-002-accent)}
[data-vibeui-block="api-002"] [data-part="eyebrow"]::before{content:"// "}
[data-vibeui-block="api-002"] [data-part="title"]{margin:0;font-weight:800;font-size:clamp(2rem,4.8cqi,3.4rem);line-height:1.02;letter-spacing:-.04em}
[data-vibeui-block="api-002"] [data-part="lede"]{margin:1rem 0 0;color:var(--vibeui-api-002-muted)}
[data-vibeui-block="api-002"] [data-part="board"]{border:1px solid var(--vibeui-api-002-line);border-radius:1.2rem;background:var(--vibeui-api-002-panel);overflow:hidden}
[data-vibeui-block="api-002"] [data-part="summary"]{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1rem;padding:1rem 1.25rem;border-bottom:1px solid var(--vibeui-api-002-line)}
[data-vibeui-block="api-002"] [data-part="summary"] h3{margin:0;font-size:1.05rem;font-weight:700;letter-spacing:-.01em}
[data-vibeui-block="api-002"] [data-part="clock"]{margin-left:auto;font-family:var(--vibeui-api-002-mono);font-size:.72rem;color:var(--vibeui-api-002-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="api-002"] [data-part="region-lamp"]{position:relative;flex-shrink:0;width:.7rem;height:.7rem;border-radius:50%;background:var(--vibeui-api-002-ok);box-shadow:0 0 10px var(--vibeui-api-002-ok)}
[data-vibeui-block="api-002"] [data-part="region-lamp"]::after{content:"";position:absolute;inset:-.3rem;border-radius:50%;border:1px solid var(--vibeui-api-002-ok);animation:vibeui-api-002-ping 2.4s ease-out infinite}
[data-vibeui-block="api-002"] [data-part="region-lamp"][data-status="degraded"]{background:var(--vibeui-api-002-warn);box-shadow:0 0 10px var(--vibeui-api-002-warn)}
[data-vibeui-block="api-002"] [data-part="region-lamp"][data-status="degraded"]::after{border-color:var(--vibeui-api-002-warn)}
[data-vibeui-block="api-002"] [data-part="region-lamp"][data-status="down"]{background:var(--vibeui-api-002-down);box-shadow:0 0 10px var(--vibeui-api-002-down)}
[data-vibeui-block="api-002"] [data-part="region-lamp"][data-status="down"]::after{border-color:var(--vibeui-api-002-down)}
[data-vibeui-block="api-002"] [data-part="regions"]{display:grid;margin:0;padding:0;list-style:none}
[data-vibeui-block="api-002"] [data-part="history"]{padding:1rem 1.25rem;border-top:1px solid var(--vibeui-api-002-line)}
[data-vibeui-block="api-002"] [data-part="history"] p{display:flex;justify-content:space-between;gap:1rem;margin:0 0 .5rem;font-family:var(--vibeui-api-002-mono);font-size:.7rem;color:var(--vibeui-api-002-muted)}
[data-vibeui-block="api-002"] [data-part="days"]{display:flex;gap:2px;height:1.6rem}
[data-vibeui-block="api-002"] [data-part="days"] i{flex:1;border-radius:2px;background:var(--vibeui-api-002-ok);opacity:.7;transition:opacity .2s}
[data-vibeui-block="api-002"] [data-part="days"] i:hover{opacity:1}
[data-vibeui-block="api-002"] [data-part="days"] i[data-warn="true"]{background:var(--vibeui-api-002-warn)}
@keyframes vibeui-api-002-ping{0%{transform:scale(.7);opacity:.9}100%{transform:scale(2.4);opacity:0}}
@keyframes vibeui-api-002-draw{to{stroke-dashoffset:0}}
@container (min-width: 44rem){[data-vibeui-block="api-002"] [data-part="regions"]{grid-template-columns:repeat(2,minmax(0,1fr))}}
@container (min-width: 64rem){[data-vibeui-block="api-002"] [data-part="regions"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="api-002"] *{animation:none!important;transition:none!important}}`

const DEFAULT_REGIONS: Api002Region[] = [
  { name: "Москва", code: "msk-1", uptime: "99,99 %", latency: 38 },
  { name: "Санкт-Петербург", code: "spb-1", uptime: "99,98 %", latency: 44 },
  { name: "Франкфурт", code: "fra-1", uptime: "100 %", latency: 61 },
  { name: "Алматы", code: "ala-1", uptime: "99,97 %", latency: 72 },
]

// Снимок кэшируется: React сверяет getSnapshot дважды за рендер, и секунда
// не должна «переключиться» между вызовами.
let current = 0

function subscribe(callback: () => void) {
  const timer = setInterval(() => {
    current = Math.floor(Date.now() / 1000)
    callback()
  }, 1000)
  return () => clearInterval(timer)
}

function getSnapshot() {
  if (current === 0) current = Math.floor(Date.now() / 1000)
  return current
}

function getServerSnapshot(): number | null {
  return null
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

/** Статус-панель API: регионы, лампочки, живые спарклайны. */
export function Api002({
  eyebrow = "Статус",
  title = "Живёт в четырёх регионах",
  lede = "Запрос уходит в ближайший регион. Панель обновляется каждую секунду, история — за 90 дней, без ретуши.",
  summary = "Все системы работают",
  regions = DEFAULT_REGIONS,
  historyDays = 90,
  historyIncidents = [23, 61],
  historyLabel = "90 дней · 2 деградации · 0 простоев",
  statusLabels = ["работает", "деградация", "недоступен"],
  uptimeLabel = "аптайм 30 дн.",
  p50Label = "p50 сейчас",
  sparkLabel = "Латентность {name} за 24 часа",
  axisLabels = ["−24 ч", "−12 ч", "сейчас"],
  updatedLine = "обновлено {time}",
  historyTitle = "история",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Api002Props) {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const date = now === null ? null : new Date(now * 1000)
  const clock = date ? `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` : "—:—:—"
  const worst = regions.some((region) => region.status === "down") ? "down" : regions.some((region) => region.status === "degraded") ? "degraded" : "ok"

  const palette = {
    ...(accent ? { "--vibeui-api-002-accent": accent } : null),
    ...(ink ? { "--vibeui-api-002-fg": ink } : null),
    ...(background ? { "--vibeui-api-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-api-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="api-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2 data-part="title">{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="board">
            <div data-part="summary">
              <i data-part="region-lamp" data-status={worst} aria-hidden="true" />
              <h3>{summary}</h3>
              <span data-part="clock" aria-live="off">
                {updatedLine.replace("{time}", clock)}
              </span>
            </div>
            <ul data-part="regions">
              {regions.map((region, index) => (
                <Card103 key={region.code} data-part="region" {...region} statusLabels={statusLabels} uptimeLabel={uptimeLabel} p50Label={p50Label} sparkLabel={sparkLabel} axisLabels={axisLabels} now={now} index={index} accent={accent} />
              ))}
            </ul>
            <div data-part="history">
              <p>
                <span>{historyTitle}</span>
                <span>{historyLabel}</span>
              </p>
              <div data-part="days" aria-label={historyLabel}>
                {Array.from({ length: historyDays }, (_, index) => (
                  <i key={index} data-warn={historyIncidents.includes(index) ? "true" : undefined} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
