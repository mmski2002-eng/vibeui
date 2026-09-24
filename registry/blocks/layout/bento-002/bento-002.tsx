"use client"

import { useState, type CSSProperties } from "react"

export type Bento002Item = {
  name: string
  /** Короткая марка в плитке: «Z», «N», «TG». Пусто — первая буква. */
  mark?: string
}

export type Bento002Props = {
  eyebrow?: string
  title?: string
  lede?: string
  /** Ядро в центре: имя продукта. */
  core?: string
  /** Подпись под ядром: «слушает и раскладывает». */
  coreCaption?: string
  /** Входы слева (откуда берутся встречи) и выходы справа (куда уходят результаты). */
  inner?: readonly Bento002Item[]
  outer?: readonly Bento002Item[]
  /** Секунд на один проход пакета по линии. */
  speed?: number
  /** Что делает интеграция: «Созвоны: бот заходит участником» — до двоеточия заголовок. */
  facts?: readonly string[]
  /** aria схемы. */
  spaceLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Интеграции маршрутизатором: слева входы — сервисы созвонов, в центре
// ядро продукта с эквалайзером, справа выходы — трекеры, мессенджеры, базы
// знаний. Всё соединено плавными кривыми, по которым бегут светящиеся
// пакеты: от входов к ядру и от ядра к каждому выходу, выход вспыхивает
// в момент прихода пакета. Наведение на сервис подсвечивает его маршрут.
// Схема — один SVG viewBox 1000×560, плитки лежат в тех же долях поверх,
// поэтому линии и плитки совпадают при любой ширине. Ниже — факты в колонки.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@600;700;800&family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const W = 1000
const H = 560
const CORE = { x: 500, y: 280 }

const STYLES = `
:where([data-vibeui-block="bento-002"]){
--vibeui-bento-002-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bento-002-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-002-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bento-002-on-accent:oklch(from var(--vibeui-bento-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bento-002-muted:color-mix(in oklab,var(--vibeui-bento-002-fg) 60%,var(--vibeui-bento-002-bg));
--vibeui-bento-002-line:color-mix(in oklab,var(--vibeui-bento-002-fg) 10%,transparent);
--vibeui-bento-002-panel:color-mix(in oklab,var(--vibeui-bento-002-fg) 4%,var(--vibeui-bento-002-bg));
--vibeui-bento-002-a2:#8b7cf6;
--vibeui-bento-002-ease:cubic-bezier(.22,1,.36,1);
--vibeui-bento-002-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-002-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bento-002-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-002"]{color-scheme:dark}
:where([data-vibeui-block="bento-002"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bento-002"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bento-002"]{box-sizing:border-box;position:relative;overflow:hidden;padding:6rem 0;background:var(--vibeui-bento-002-bg);color:var(--vibeui-bento-002-fg);font-family:var(--vibeui-bento-002-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="bento-002"] *{box-sizing:border-box}
[data-vibeui-block="bento-002"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bento-002"] [data-part="head"]{display:grid;gap:1rem 3rem;align-items:end}
[data-vibeui-block="bento-002"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-bento-002-mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-bento-002-accent)}
[data-vibeui-block="bento-002"] [data-part="title"]{margin:0;font-family:var(--vibeui-bento-002-display);font-weight:700;font-size:clamp(2rem,4.2cqi,3.3rem);line-height:1.05;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="bento-002"] [data-part="lede"]{margin:0;max-width:30rem;color:var(--vibeui-bento-002-muted)}
[data-vibeui-block="bento-002"] [data-part="board"]{position:relative;margin:2.6rem 0 0;border-radius:1.6rem;background:radial-gradient(50% 60% at 50% 50%,color-mix(in oklab,var(--vibeui-bento-002-accent) 10%,transparent),transparent 70%),var(--vibeui-bento-002-panel);box-shadow:inset 0 0 0 1px var(--vibeui-bento-002-line);overflow:hidden}
[data-vibeui-block="bento-002"] [data-part="board"]::before{content:"";position:absolute;inset:0;background-image:radial-gradient(color-mix(in oklab,var(--vibeui-bento-002-fg) 14%,transparent) 1px,transparent 1px);background-size:22px 22px;mask-image:radial-gradient(70% 70% at 50% 50%,#000,transparent);opacity:.6;pointer-events:none}
[data-vibeui-block="bento-002"] [data-part="map"]{position:relative;aspect-ratio:${W}/${H}}
[data-vibeui-block="bento-002"] [data-part="wires"]{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
[data-vibeui-block="bento-002"] [data-part="wire"]{fill:none;stroke:var(--vibeui-bento-002-line);stroke-width:1.5;transition:stroke .3s,stroke-width .3s}
[data-vibeui-block="bento-002"] [data-part="wire"][data-hot="true"]{stroke:var(--vibeui-bento-002-accent);stroke-width:2.2}
[data-vibeui-block="bento-002"] [data-part="packet"]{fill:var(--vibeui-bento-002-accent);filter:drop-shadow(0 0 6px var(--vibeui-bento-002-accent))}
[data-vibeui-block="bento-002"] [data-part="node"]{position:absolute;display:flex;align-items:center;gap:.55rem;width:15%;min-width:0;padding:.45rem .7rem .45rem .45rem;border-radius:.9rem;background:var(--vibeui-bento-002-bg);box-shadow:inset 0 0 0 1px var(--vibeui-bento-002-line),0 10px 24px -16px rgb(0 0 0 / .8);translate:-50% -50%;font-size:.84rem;font-weight:500;white-space:nowrap;cursor:default;transition:box-shadow .3s}
[data-vibeui-block="bento-002"] [data-part="node"][data-hot="true"]{box-shadow:inset 0 0 0 1.5px var(--vibeui-bento-002-accent),0 0 24px -8px var(--vibeui-bento-002-accent)}
[data-vibeui-block="bento-002"] [data-part="node"][data-side="out"]{animation:vibeui-bento-002-hit var(--vibeui-bento-002-t) linear infinite;animation-delay:var(--vibeui-bento-002-d)}
[data-vibeui-block="bento-002"] [data-part="mark"]{display:grid;place-items:center;flex:none;width:1.8rem;height:1.8rem;border-radius:.55rem;background:color-mix(in oklab,var(--vibeui-bento-002-fg) 8%,transparent);font-family:var(--vibeui-bento-002-mono);font-size:.72rem;font-weight:500}
[data-vibeui-block="bento-002"] [data-part="node-name"]{overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="bento-002"] [data-part="core"]{position:absolute;left:50%;top:50%;display:grid;justify-items:center;gap:.5rem;width:20%;padding:1.1rem .8rem;border-radius:1.3rem;background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-bento-002-accent) 18%,var(--vibeui-bento-002-bg)),var(--vibeui-bento-002-bg));box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-bento-002-accent) 45%,transparent),0 0 60px -18px var(--vibeui-bento-002-accent);translate:-50% -50%;text-align:center}
[data-vibeui-block="bento-002"] [data-part="eq"]{display:flex;align-items:center;gap:3px;height:1.6rem}
[data-vibeui-block="bento-002"] [data-part="eq"] i{width:3px;height:100%;border-radius:3px;background:linear-gradient(var(--vibeui-bento-002-accent),var(--vibeui-bento-002-a2));transform:scaleY(.3);animation:vibeui-bento-002-eq 1s ease-in-out infinite;animation-delay:calc(var(--vibeui-bento-002-i) * -.13s)}
[data-vibeui-block="bento-002"] [data-part="core-name"]{font-family:var(--vibeui-bento-002-display);font-weight:700;font-size:1.05rem;letter-spacing:-.02em}
[data-vibeui-block="bento-002"] [data-part="core-caption"]{font-size:.72rem;color:var(--vibeui-bento-002-muted);line-height:1.3}
[data-vibeui-block="bento-002"] [data-part="facts"]{display:grid;gap:1.4rem 2rem;margin:2.4rem 0 0;padding:0;list-style:none}
[data-vibeui-block="bento-002"] [data-part="fact"]{padding-top:1rem;border-top:1px solid var(--vibeui-bento-002-line)}
[data-vibeui-block="bento-002"] [data-part="fact-title"]{display:block;margin-bottom:.3rem;font-weight:600}
[data-vibeui-block="bento-002"] [data-part="fact-text"]{font-size:.9rem;color:var(--vibeui-bento-002-muted)}
@keyframes vibeui-bento-002-eq{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
@keyframes vibeui-bento-002-hit{0%,78%,100%{box-shadow:inset 0 0 0 1px var(--vibeui-bento-002-line),0 10px 24px -16px rgb(0 0 0 / .8)}86%{box-shadow:inset 0 0 0 1.5px var(--vibeui-bento-002-accent),0 0 26px -6px var(--vibeui-bento-002-accent)}}
@container (min-width: 56rem){[data-vibeui-block="bento-002"] [data-part="head"]{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)}[data-vibeui-block="bento-002"] [data-part="facts"]{grid-template-columns:repeat(4,minmax(0,1fr))}}
@container (max-width: 44rem){[data-vibeui-block="bento-002"] [data-part="node"]{width:auto;padding:.3rem}[data-vibeui-block="bento-002"] [data-part="node-name"]{display:none}[data-vibeui-block="bento-002"] [data-part="mark"]{width:1.6rem;height:1.6rem;font-size:.62rem}[data-vibeui-block="bento-002"] [data-part="core"]{width:26%;padding:.6rem .4rem}[data-vibeui-block="bento-002"] [data-part="core-caption"]{display:none}[data-vibeui-block="bento-002"] [data-part="map"]{aspect-ratio:1000/700}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bento-002"] *{animation:none!important;transition:none!important}[data-vibeui-block="bento-002"] [data-part="packet"]{display:none}}`

function spread(count: number, from: number, to: number) {
  if (count <= 1) return [(from + to) / 2]
  return Array.from({ length: count }, (_, index) => from + ((to - from) * index) / (count - 1))
}

/** Интеграции маршрутизатором: входы → ядро → выходы, по линиям бегут пакеты. */
export function Bento002({
  eyebrow = "Интеграции",
  title = "Живёт там, где уже живёт команда",
  lede = "Подключается к тому, что у вас есть: созвоны, трекер, база знаний, мессенджер. Никаких «перейдите в наше приложение».",
  core = "Сводка",
  coreCaption = "слушает и раскладывает",
  inner = [{ name: "Zoom", mark: "Z" }, { name: "Google Meet", mark: "M" }, { name: "Телемост", mark: "Т" }, { name: "Teams", mark: "T" }],
  outer = [{ name: "Jira", mark: "J" }, { name: "Notion", mark: "N" }, { name: "Telegram", mark: "TG" }, { name: "Slack", mark: "S" }, { name: "Linear", mark: "L" }, { name: "Confluence", mark: "C" }],
  speed = 2.4,
  facts = ["Созвоны: бот заходит участником или берёт запись", "Трекеры: задачи создаются с исполнителем и сроком", "Мессенджеры: сводка приходит через минуту после встречи", "Базы знаний: решения копятся в одном месте"],
  spaceLabel = "{core}: интеграции",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bento002Props) {
  const [hot, setHot] = useState<string | null>(null)

  const inputs = spread(inner.length, 110, H - 110).map((y, index) => ({ item: inner[index], y, id: `in-${index}`, d: `M 205 ${y} C 320 ${y}, 330 ${CORE.y}, 400 ${CORE.y}` }))
  const outputs = spread(outer.length, 60, H - 60).map((y, index) => ({ item: outer[index], y, id: `out-${index}`, d: `M 600 ${CORE.y} C 690 ${CORE.y}, 700 ${y}, 795 ${y}` }))
  const period = speed * 1.6

  const palette = {
    ...(accent ? { "--vibeui-bento-002-accent": accent } : null),
    ...(ink ? { "--vibeui-bento-002-fg": ink } : null),
    ...(background ? { "--vibeui-bento-002-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bento-002" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="bento-002" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette}>
        <div data-part="shell">
          <div data-part="head">
            <div>
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h2 data-part="title">{title}</h2>
            </div>
            {lede ? <p data-part="lede">{lede}</p> : null}
          </div>
          <div data-part="board">
            <div data-part="map" role="img" aria-label={spaceLabel.replace("{core}", core)}>
              <svg data-part="wires" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                {inputs.map((wire, index) => (
                  <g key={wire.id}>
                    <path id={`vibeui-bento-002-${wire.id}`} data-part="wire" data-hot={hot === wire.id} d={wire.d} vectorEffect="non-scaling-stroke" />
                    <circle data-part="packet" r="4">
                      <animateMotion dur={`${speed}s`} begin={`${(index * period) / inputs.length}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .25 1">
                        <mpath href={`#vibeui-bento-002-${wire.id}`} />
                      </animateMotion>
                    </circle>
                  </g>
                ))}
                {outputs.map((wire, index) => (
                  <g key={wire.id}>
                    <path id={`vibeui-bento-002-${wire.id}`} data-part="wire" data-hot={hot === wire.id} d={wire.d} vectorEffect="non-scaling-stroke" />
                    <circle data-part="packet" r="4">
                      <animateMotion dur={`${speed}s`} begin={`${(index * period) / outputs.length}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .25 1">
                        <mpath href={`#vibeui-bento-002-${wire.id}`} />
                      </animateMotion>
                    </circle>
                  </g>
                ))}
              </svg>
              {inputs.map((wire) => (
                <span
                  key={wire.id}
                  data-part="node"
                  data-side="in"
                  data-hot={hot === wire.id}
                  style={{ left: `${(130 / W) * 100}%`, top: `${(wire.y / H) * 100}%` }}
                  onPointerEnter={() => setHot(wire.id)}
                  onPointerLeave={() => setHot(null)}
                >
                  <span data-part="mark">{wire.item.mark ?? wire.item.name.charAt(0)}</span>
                  <span data-part="node-name">{wire.item.name}</span>
                </span>
              ))}
              <div data-part="core">
                <span data-part="eq" aria-hidden="true">
                  {Array.from({ length: 7 }, (_, index) => (
                    <i key={index} style={{ ["--vibeui-bento-002-i" as string]: index } as CSSProperties} />
                  ))}
                </span>
                <span data-part="core-name">{core}</span>
                {coreCaption ? <span data-part="core-caption">{coreCaption}</span> : null}
              </div>
              {outputs.map((wire, index) => (
                <span
                  key={wire.id}
                  data-part="node"
                  data-side="out"
                  data-hot={hot === wire.id}
                  style={{ left: `${(870 / W) * 100}%`, top: `${(wire.y / H) * 100}%`, ["--vibeui-bento-002-t" as string]: `${speed}s`, ["--vibeui-bento-002-d" as string]: `${(index * period) / outputs.length}s` } as CSSProperties}
                  onPointerEnter={() => setHot(wire.id)}
                  onPointerLeave={() => setHot(null)}
                >
                  <span data-part="mark">{wire.item.mark ?? wire.item.name.charAt(0)}</span>
                  <span data-part="node-name">{wire.item.name}</span>
                </span>
              ))}
            </div>
          </div>
          {facts.length > 0 ? (
            <ul data-part="facts">
              {facts.map((fact) => {
                const [head, ...rest] = fact.split(": ")
                return (
                  <li key={fact} data-part="fact">
                    {rest.length ? (
                      <>
                        <b data-part="fact-title">{head}</b>
                        <span data-part="fact-text">{rest.join(": ")}</span>
                      </>
                    ) : (
                      <span data-part="fact-text">{fact}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </section>
    </>
  )
}
