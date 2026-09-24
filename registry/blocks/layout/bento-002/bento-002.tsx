"use client"

import { useState, type CSSProperties } from "react"

export type Bento002Brand = "zoom" | "googlemeet" | "vk" | "webex" | "jira" | "notion" | "telegram" | "linear" | "confluence" | "trello"

export type Bento002Item = {
  name: string
  /** Официальный знак из набора: «jira», «notion»… Приоритетнее mark. */
  brand?: Bento002Brand
  /** Свой знак: path для viewBox 24×24 и фирменный цвет плитки. */
  icon?: string
  color?: string
  /** Короткая марка в плитке, если знака нет: «Z», «N», «TG». Пусто — первая буква. */
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
[data-vibeui-block="bento-002"] [data-part="mark"][data-logo]{background:var(--vibeui-bento-002-brand,#333);box-shadow:inset 0 0 0 1px rgb(255 255 255 / .12)}
[data-vibeui-block="bento-002"] [data-part="logo"]{width:58%;height:58%;fill:#fff}
[data-vibeui-block="bento-002"] [data-part="mark"][data-light] [data-part="logo"]{fill:#111}
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

// Знаки сервисов — пути из Simple Icons (CC0), viewBox 24×24, цвета брендов.
const BRANDS: Record<Bento002Brand, { color: string; path: string }> = {
  zoom: { color: "#0B5CFF", path: "M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" },
  googlemeet: { color: "#00897B", path: "M5.53 2.13 0 7.75h5.53zm.398 0v5.62h7.608v3.65l5.47-4.45c-.014-1.22.031-2.25-.025-3.46-.148-1.09-1.287-1.47-2.236-1.36zM23.1 4.32c-.802.295-1.358.995-2.047 1.49-2.506 2.05-4.982 4.12-7.468 6.19 3.025 2.59 6.04 5.18 9.065 7.76 1.218.671 1.428-.814 1.328-1.64v-13a.828.828 0 0 0-.877-.825zM.038 8.15v7.7h5.53v-7.7zm13.577 8.1H6.008v5.62c3.864-.006 7.737.011 11.58-.009 1.02-.07 1.618-1.12 1.468-2.07v-2.51l-5.47-4.68v3.65zm-13.577 0c.02 1.44-.041 2.88.033 4.31.162.948 1.158 1.43 2.047 1.31h3.464v-5.62z" },
  vk: { color: "#0077FF", path: "m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z" },
  webex: { color: "#000000", path: "M21.78 7.376c.512 1.181.032 2.644-1.11 3.106-2.157.888-3-1.295-3-1.295-.236-.55-.727-1.496-1.335-1.496-.204 0-.503 0-.94.844-.229.443-.434 1.185-.616 1.84l-.09.32c-.373-1.587-.821-3.454-1.536-4.816-.195-.38-.42-.74-.673-1.08a5.135 5.135 0 0 1 1.743-1.337 4.891 4.891 0 0 1 2.112-.463c1.045 0 2.765.338 4.227 2.227.167.206.317.424.448.654.278.441.52.904.726 1.383l.043.113zM.02 8.4C-.15 7.105.8 5.845 1.953 5.755c1.794-.157 2.36 1.385 2.455 1.89l.022.137c.07.44.29 1.838.48 2.744.078.4.244 1.013.353 1.416l.006.022.026.092c.11.4.232.799.362 1.193.185.548.399 1.085.641 1.61.47.955.93 1.45 1.367 1.45.203 0 .512 0 .96-.878.283-.59.512-1.208.684-1.845.373 1.598.811 3.128 1.495 4.456.205.406.444.794.715 1.16a5.124 5.124 0 0 1-1.742 1.338 4.88 4.88 0 0 1-2.112.461c-1.548 0-3.727-.698-5.339-4.005a22.407 22.407 0 0 1-1.078-2.824 26.848 26.848 0 0 1-.693-2.656 48.56 48.56 0 0 1-.215-1.114C.191 9.603.074 8.872.02 8.4zm22.047-2.645-.202-.022h-.052c.222.392.421.797.597 1.215l.053.113c.322.76.346 1.614.068 2.391a3.079 3.079 0 0 1-1.552 1.749 2.93 2.93 0 0 1-1.228.28 3.115 3.115 0 0 1-.854-.135c-.299 1.182-.768 2.634-1.195 3.511-.427.877-.93 1.451-1.378 1.451-.192 0-.501 0-.95-.877a10.746 10.746 0 0 1-.683-1.845 38.722 38.722 0 0 1-.396-1.575 12.67 12.67 0 0 1-.136-.598l-.002-.01c-.406-1.778-.865-3.645-1.655-5.142A8.263 8.263 0 0 0 11.52 4.8a5.136 5.136 0 0 0-1.748-1.34A4.892 4.892 0 0 0 7.654 3c-1.036 0-2.754.338-4.217 2.228.466.223.867.562 1.164.984.305.433.499.933.565 1.458.076.563.256 1.654.47 2.688l.001.007c.021.11.042.221.073.342.126-.34.25-.642.38-.955l.112-.271.128-.293c.235-.55.726-1.496 1.324-1.496.213 0 .513 0 .95.844.296.606.532 1.239.706 1.89.138.507.276 1.047.394 1.587.04.148.07.296.101.444l.006.028c.427 1.879.875 3.69 1.644 5.187.159.317.34.622.545.911.15.215.31.422.48.62 1.27 1.45 2.733 1.8 3.843 1.8 1.548 0 3.738-.698 5.35-4.006.822-1.7 1.515-4.208 1.772-5.48.256-1.27.449-2.419.534-3.115.04-.307.023-.618-.051-.918-.075-.299-.205-.579-.382-.825a2.247 2.247 0 0 0-.653-.607 2.143 2.143 0 0 0-.826-.296z" },
  jira: { color: "#0052CC", path: "M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z" },
  notion: { color: "#FFFFFF", path: "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" },
  telegram: { color: "#26A5E4", path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" },
  linear: { color: "#5E6AD2", path: "M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z" },
  confluence: { color: "#172B4D", path: "M.87 18.257c-.248.382-.53.875-.763 1.245a.764.764 0 0 0 .255 1.04l4.965 3.054a.764.764 0 0 0 1.058-.26c.199-.332.454-.763.733-1.221 1.967-3.247 3.945-2.853 7.508-1.146l4.957 2.337a.764.764 0 0 0 1.028-.382l2.364-5.346a.764.764 0 0 0-.382-1 599.851 599.851 0 0 1-4.965-2.361C10.911 10.97 5.224 11.185.87 18.257zM23.131 5.743c.249-.405.531-.875.764-1.25a.764.764 0 0 0-.256-1.034L18.675.404a.764.764 0 0 0-1.058.26c-.195.335-.451.763-.734 1.225-1.966 3.246-3.945 2.85-7.508 1.146L4.437.694a.764.764 0 0 0-1.027.382L1.046 6.422a.764.764 0 0 0 .382 1c1.039.49 3.105 1.467 4.965 2.361 6.698 3.246 12.392 3.029 16.738-4.04z" },
  trello: { color: "#0052CC", path: "M21.147 0H2.853A2.86 2.86 0 000 2.853v18.294A2.86 2.86 0 002.853 24h18.294A2.86 2.86 0 0024 21.147V2.853A2.86 2.86 0 0021.147 0zM10.34 17.287a.953.953 0 01-.953.953h-4a.954.954 0 01-.954-.953V5.38a.953.953 0 01.954-.953h4a.954.954 0 01.953.953zm9.233-5.467a.944.944 0 01-.953.947h-4a.947.947 0 01-.953-.947V5.38a.953.953 0 01.953-.953h4a.954.954 0 01.953.953z" },
}

function spread(count: number, from: number, to: number) {
  if (count <= 1) return [(from + to) / 2]
  return Array.from({ length: count }, (_, index) => from + ((to - from) * index) / (count - 1))
}

function Mark({ item }: { item: Bento002Item }) {
  const brand = item.brand ? BRANDS[item.brand] : null
  const path = item.icon ?? brand?.path
  const color = item.color ?? brand?.color
  if (!path) return <span data-part="mark">{item.mark ?? item.name.charAt(0)}</span>
  return (
    <span data-part="mark" data-logo="" data-light={color?.toUpperCase() === "#FFFFFF" ? "" : undefined} style={{ ["--vibeui-bento-002-brand" as string]: color } as CSSProperties}>
      <svg data-part="logo" viewBox="0 0 24 24" aria-hidden="true">
        <path d={path} />
      </svg>
    </span>
  )
}

/** Интеграции маршрутизатором: входы → ядро → выходы, по линиям бегут пакеты. */
export function Bento002({
  eyebrow = "Интеграции",
  title = "Живёт там, где уже живёт команда",
  lede = "Подключается к тому, что у вас есть: созвоны, трекер, база знаний, мессенджер. Никаких «перейдите в наше приложение».",
  core = "Tally",
  coreCaption = "слушает и раскладывает",
  inner = [{ name: "Zoom", brand: "zoom" }, { name: "Google Meet", brand: "googlemeet" }, { name: "VK Звонки", brand: "vk" }, { name: "Webex", brand: "webex" }],
  outer = [{ name: "Jira", brand: "jira" }, { name: "Notion", brand: "notion" }, { name: "Telegram", brand: "telegram" }, { name: "Linear", brand: "linear" }, { name: "Confluence", brand: "confluence" }, { name: "Trello", brand: "trello" }],
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
                  <Mark item={wire.item} />
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
                  <Mark item={wire.item} />
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
