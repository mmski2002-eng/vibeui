"use client"

import { useRef, useId, type CSSProperties, type PointerEvent, type ReactNode } from "react"
import type { ComponentProps } from "react"

export type Layout008Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout008Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 навигация сайдбара, 02 топбар, 03 показатель, 04 показатель, 05 график, 06 таблица. Без них — призрак. */
  items?: readonly Layout008Item[]
  /** Сторона сайдбара. */
  side?: "left" | "right"
  /** Сайдбар свёрнут при загрузке. */
  collapsed?: boolean
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Оболочка приложения: сайдбар, топбар, рабочая область. Сайдбар
// сворачивается чекбоксом и :has() — без JS и без состояния: кнопка в
// топбаре — это label. Владелец прокрутки — рабочая область (data-part
// main), оболочка фиксированной высоты; в Copy for AI это сказано явно.
const SLOTS = ["nav", "top", "kpi1", "kpi2", "kpi3", "table"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  nav: "list",
  top: "empty",
  kpi1: "stat",
  kpi2: "stat",
  kpi3: "chart",
  table: "table",
}

const STYLES = `
:where([data-vibeui-block="layout-008"]){
--vibeui-layout-008-dur-4:340ms;
--vibeui-layout-008-dur-5:460ms;
--vibeui-layout-008-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-008-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-008-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-008-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-008-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-008-ink:light-dark(#000000,#ffffff);
--vibeui-layout-008-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-008-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-008-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-008-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-008-on-accent:oklch(from var(--vibeui-layout-008-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-008-glow:color-mix(in oklab,var(--vibeui-layout-008-accent) 42%,transparent);
--vibeui-layout-008-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-008-radius:1.25rem;--vibeui-layout-008-dur-4:340ms;--vibeui-layout-008-dur-5:460ms;
--vibeui-layout-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-008-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-008"]{color-scheme:dark}
:where([data-vibeui-block="layout-008"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-008"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-008"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-008-bg);color:var(--vibeui-layout-008-ink);font-family:var(--vibeui-layout-008-font)}
[data-vibeui-block="layout-008"] *{box-sizing:border-box}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"]{flex:1}
[data-vibeui-block="layout-008"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-008"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-008"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-008"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-008-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-008"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-008"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-008"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-008-ghost);margin-top:0.25rem}
[data-vibeui-block="layout-008"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-008"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-008"][data-numbers] [data-part="image"],[data-vibeui-block="layout-008"][data-numbers] [data-part="window"]{margin-top:2rem}
/* Призраки. */
[data-vibeui-block="layout-008"] [data-part="tile-bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong);width:70%}
[data-vibeui-block="layout-008"] [data-part="tile-bar"][data-soft]{background:var(--vibeui-layout-008-ghost);height:0.625rem;width:50%}
[data-vibeui-block="layout-008"] [data-part="tile-bar"][data-wide]{width:88%}
[data-vibeui-block="layout-008"] [data-part="tile-bar"][data-big]{height:1.5rem}
[data-vibeui-block="layout-008"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-008-accent);margin-top:0.5rem;transition:transform var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-008-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-008"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-008-tile);background:var(--vibeui-layout-008-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-008-accent)}
[data-vibeui-block="layout-008"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-layout-008-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-layout-008-glow-soft) 0%,transparent 65%),var(--vibeui-layout-008-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-008-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-008-tile-2),var(--vibeui-layout-008-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-008-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-008-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-008"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong)}
[data-vibeui-block="layout-008"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-008-accent)}
[data-vibeui-block="layout-008"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-008"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-008-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-008-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
@supports (animation-timeline: view()){
}

[data-vibeui-block="layout-008"] [data-part="frame"]{padding:0;max-width:none}
[data-vibeui-block="layout-008"] [data-part="body"]{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);height:min(44rem,100dvh);border:1px solid var(--vibeui-layout-008-edge);border-radius:var(--vibeui-layout-008-radius);overflow:hidden;background:var(--vibeui-layout-008-tile)}
[data-vibeui-block="layout-008"] [data-part="toggle"]{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="layout-008"] [data-part="side"]{display:none;flex-direction:column;gap:1rem;padding:1rem;border-right:1px solid var(--vibeui-layout-008-edge);background:var(--vibeui-layout-008-tile-2);grid-row:1 / -1;overflow:auto;width:16rem;transition:width var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"]{background:none;border:0;padding:0;min-height:0;flex:1;justify-content:flex-start}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"]::before,[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"]::after{display:none}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"] [data-part="num"]{position:static;align-self:flex-start}
[data-vibeui-block="layout-008"] [data-part="brand"]{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-008"] [data-part="brand"] i{width:2rem;height:2rem;border-radius:0.5rem;background:var(--vibeui-layout-008-accent);flex:none}
[data-vibeui-block="layout-008"] [data-part="brand"] b{display:block;height:0.75rem;width:5rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong)}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"] [data-part="rows"]{justify-content:flex-start;gap:0.5rem}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"] [data-part="rows"] span{padding:0.5rem 0.625rem;border-radius:0.5rem}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"] [data-part="rows"] span:first-child{background:color-mix(in oklab,var(--vibeui-card-068-accent) 12%,transparent)}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"] [data-part="rows"] i{border-radius:0.25rem;width:1rem;height:1rem;background:var(--vibeui-card-068-ghost-strong)}
[data-vibeui-block="layout-008"] [data-part="side"] [data-part="tile"] [data-part="rows"] span:first-child i{background:var(--vibeui-card-068-accent)}
[data-vibeui-block="layout-008"] [data-part="top"]{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;border-bottom:1px solid var(--vibeui-layout-008-edge)}
[data-vibeui-block="layout-008"] [data-part="top"] label{width:2.25rem;height:2.25rem;border-radius:0.5rem;border:1px solid var(--vibeui-layout-008-edge);display:grid;place-items:center;cursor:pointer;color:var(--vibeui-layout-008-muted)}
[data-vibeui-block="layout-008"] [data-part="top"] label:hover{border-color:var(--vibeui-layout-008-edge-hover);color:var(--vibeui-layout-008-ink)}
[data-vibeui-block="layout-008"] [data-part="top"] [data-part="tile-bar"]{height:0.625rem;width:8rem;margin:0}
[data-vibeui-block="layout-008"] [data-part="top"] [data-part="faces"]{margin:0 0 0 auto}
[data-vibeui-block="layout-008"] [data-part="top"] [data-part="faces"] i{width:2rem;height:2rem}
[data-vibeui-block="layout-008"] [data-part="main"]{overflow:auto;padding:1rem;display:grid;gap:1rem;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start}
[data-vibeui-block="layout-008"] [data-part="main"] [data-part="tile"]{min-height:8rem;padding:1.25rem}
[data-vibeui-block="layout-008"] [data-area="kpi3"]{grid-column:span 2}
[data-vibeui-block="layout-008"] [data-area="table"]{grid-column:span 2;justify-content:flex-start}
[data-vibeui-block="layout-008"] [data-area="top"]{display:none}
@container (min-width: 48rem){
[data-vibeui-block="layout-008"] [data-part="body"]{grid-template-columns:auto minmax(0,1fr)}
[data-vibeui-block="layout-008"] [data-part="side"]{display:flex}
[data-vibeui-block="layout-008"][data-side="right"] [data-part="side"]{order:3;border-right:0;border-left:1px solid var(--vibeui-layout-008-edge)}
[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"]{width:4.5rem}
[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] [data-part="brand"] b,[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] [data-part="tile"] [data-part="rows"] b,[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] [data-part="tile-bar"],[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] h3,[data-vibeui-block="layout-008"] [data-part="toggle"]:checked ~ [data-part="side"] p{display:none}
[data-vibeui-block="layout-008"] [data-part="main"]{grid-template-columns:repeat(3,minmax(0,1fr));padding:1.5rem}
[data-vibeui-block="layout-008"] [data-area="kpi3"]{grid-column:span 1}
[data-vibeui-block="layout-008"] [data-area="table"]{grid-column:span 3}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-008"] *{animation:none!important;transition:none!important}
}
@keyframes vibeui-layout-008-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-008-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}
[data-vibeui-block="layout-008"] [data-part="tile"]{position:relative;overflow:hidden;min-height:10rem;padding:1.5rem;border-radius:var(--vibeui-layout-008-radius);
background:var(--vibeui-layout-008-tile);border:1px solid var(--vibeui-layout-008-edge);
display:flex;flex-direction:column;justify-content:flex-end;gap:0.75rem;
--vibeui-layout-008-mx:50%;--vibeui-layout-008-my:50%;--vibeui-layout-008-on:0;
transition:transform var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1),border-color var(--vibeui-layout-008-dur-5);}
[data-vibeui-block="layout-008"] [data-part="tile"]::before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(22rem circle at var(--vibeui-layout-008-mx) var(--vibeui-layout-008-my),color-mix(in oklab,var(--vibeui-layout-008-accent) 14%,transparent),transparent 60%);opacity:var(--vibeui-layout-008-on);transition:opacity var(--vibeui-layout-008-dur-5)}
[data-vibeui-block="layout-008"] [data-part="tile"]::after{content:"";position:absolute;inset:-1px;pointer-events:none;border-radius:inherit;padding:1px;background:radial-gradient(18rem circle at var(--vibeui-layout-008-mx) var(--vibeui-layout-008-my),color-mix(in oklab,var(--vibeui-layout-008-accent) 70%,transparent),transparent 55%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:var(--vibeui-layout-008-on);transition:opacity var(--vibeui-layout-008-dur-5)}
[data-vibeui-block="layout-008"] [data-part="tile"]:hover{border-color:var(--vibeui-layout-008-edge-hover)}
[data-vibeui-block="layout-008"] [data-part="tile"] h3{margin:0;font-size:1.125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="layout-008"] [data-part="tile"] p{margin:0;color:var(--vibeui-layout-008-muted);font-size:0.9375rem;line-height:1.45}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="value"]{font-size:clamp(2.5rem,6cqi,3.5rem);font-weight:650;letter-spacing:-0.03em;line-height:1}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="media"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="media"] > *{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="layout-008"] [data-part="tile"] > :not([data-part="media"]):not([data-part="num"]){position:relative}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="num"]{position:absolute;top:1.125rem;left:1.125rem;z-index:1;font:500 0.6875rem/1 var(--vibeui-layout-008-mono);letter-spacing:0.08em;padding:0.375rem 0.5rem;border-radius:999px;color:var(--vibeui-layout-008-muted);border:1px solid var(--vibeui-layout-008-edge);background:color-mix(in oklab,var(--vibeui-layout-008-tile) 70%,transparent);transition:color var(--vibeui-layout-008-dur-4),border-color var(--vibeui-layout-008-dur-4),background-color var(--vibeui-layout-008-dur-4)}
[data-vibeui-block="layout-008"] [data-part="tile"]:hover [data-part="num"]{color:var(--vibeui-layout-008-on-accent);background:var(--vibeui-layout-008-accent);border-color:var(--vibeui-layout-008-accent)}
[data-vibeui-block="layout-008"] [data-part="tile"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-008"] [data-part="tile"][data-numbers] [data-part="rows"]{margin-top:2rem}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-layout-008-ghost-strong);width:70%}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="bar"][data-soft]{background:var(--vibeui-layout-008-ghost);height:0.625rem;width:50%}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="bar"][data-wide]{width:88%}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="bar"][data-big]{height:1.5rem}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-008-ghost-strong)}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-008-accent);flex:none;transition:transform var(--vibeui-layout-008-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-008-ghost);flex:1}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-008-edge)}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-008"] [data-part="tile"]:hover [data-part="rows"] i{transform:scale(1.35)}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-008-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-008"] [data-part="tile"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-008-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-008"] [data-part="tile"]:hover [data-part="spark"] path:not([data-fill]){animation:vibeui-layout-008-draw 1.1s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-008"] [data-part="tile"]{animation:vibeui-layout-008-rise 0.8s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--vibeui-layout-008-i) * 80ms)}
@supports (animation-timeline: view()){
[data-vibeui-block="layout-008"] [data-part="tile"]{animation:vibeui-layout-008-rise linear both;animation-timeline:view();animation-range:entry 0% entry 35%;animation-delay:0s}
}
[data-vibeui-block="layout-008"] [data-part="tile"][data-area="table"] [data-part="rows"]{margin-top:0}
[data-vibeui-block="layout-008"] [data-part="tile"][data-numbers][data-area="table"] [data-part="rows"]{margin-top:2rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-008"] [data-part="tile"]:hover{transform:none}
[data-vibeui-block="layout-008"] [data-part="tile"]::before,[data-vibeui-block="layout-008"] [data-part="tile"]::after{display:none}
}
`

function Ghost({ kind }: { kind: string }) {
  switch (kind) {
    case "list":
      return <><div data-part="rows"><span><i /><b /></span><span><i /><b /></span><span><i /><b /></span><span><i /><b /></span></div><span data-part="bar" data-soft="" /></>
    case "empty":
      return <></>
    case "stat":
      return <><span data-part="big" /><span data-part="bar" data-soft="" /></>
    case "chart":
      return <><svg data-part="spark" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true"><path data-fill="" d="M0 32 L14 26 L28 29 L42 18 L56 21 L70 10 L84 13 L100 4 L100 40 L0 40 Z" /><path d="M0 32 L14 26 L28 29 L42 18 L56 21 L70 10 L84 13 L100 4" /></svg><span data-part="bar" /><span data-part="bar" data-soft="" /></>
    case "table":
      return <><div data-part="rows" data-table=""><span><b /><b /><b /></span><span><b /><b /><b /></span><span><b /><b /><b /></span><span><b /><b /><b /></span><span><b /><b /><b /></span></div></>
    default:
      return null
  }
}

type TileProps = Omit<ComponentProps<"article">, "title" | "children"> & {
  media?: ReactNode
  value?: string
  title?: string
  text?: string
  numbers?: boolean
  index?: number
  ghost?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Tile({
  media,
  value,
  title,
  text,
  numbers = true,
  index = 0,
  ghost = "",
  accent,
  className,
  style,
  ...props
}: TileProps) {
  const palette = {
    "--vibeui-layout-008-i": index,
    ...(accent ? { "--vibeui-layout-008-accent": accent } : null),
    ...style,
  } as CSSProperties
  const filled = Boolean((title || text || value || media))

  return (
      <article
          {...props}
          data-numbers={numbers ? "" : undefined}
          aria-hidden={filled ? undefined : true}
          className={className}
          style={palette}
        >
        {media ? <div data-part="media">{media}</div> : null}
        {numbers ? (
          <span data-part="num" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
        {filled ? (
          <>
            {value ? <span data-part="value">{value}</span> : null}
            {title ? <h3>{title}</h3> : null}
            {text ? <p>{text}</p> : null}
          </>
        ) : (
          <Ghost kind={ghost} />
        )}
      </article>
  )
}

/** Оболочка приложения: сайдбар, топбар и рабочая область. */
export function Layout008({
  heading,
  lead,
  items,
  side = "left",
  collapsed = false,
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout008Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-008-accent": accent } : null),
    ...style,
  } as CSSProperties
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Tile key={key ?? area} data-part="tile" {...items?.[SLOTS.indexOf(area)]} numbers={numbers} index={SLOTS.indexOf(area)} ghost={GHOST[area]} data-area={area} className={className} accent={accent} />
  )
  const frame = useRef(0)

  // Один слушатель на раскладку: событие всплывает от плитки, координаты
  // пишутся только ей. Только мышь — на touch свет не нужен.
  function handleMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return

    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    if (!target) return

    const bounds = target.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      target.style.setProperty("--vibeui-card-068-mx", `${x}%`)
      target.style.setProperty("--vibeui-card-068-my", `${y}%`)
      target.style.setProperty("--vibeui-card-068-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-card-068-on", "0")
  }
  const toggleId = `shell-${useId().replace(/:/g, "")}`

  return (
    <>
      <style href="vibeui-layout-008" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-008"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-side={side === "left" ? undefined : side}
        data-collapsed={collapsed ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">

          <div data-part="body" onPointerMove={handleMove} onPointerOut={handleLeave}>
            <input data-part="toggle" type="checkbox" id={toggleId} defaultChecked={collapsed} />
            <aside data-part="side">
              <div data-part="brand" aria-hidden="true"><i /><b /></div>
              {tile("nav")}
            </aside>
            <header data-part="top">
              <label htmlFor={toggleId} title="Свернуть меню" aria-label="Свернуть меню">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 4h12M2 8h12M2 12h12" /></svg>
              </label>
              {items?.[1]?.title ? <h3>{items[1].title}</h3> : <span data-part="tile-bar" aria-hidden="true" />}
              <div data-part="faces" aria-hidden="true"><i /><i /></div>
            </header>
            <main data-part="main">
              {tile("kpi1")}
              {tile("kpi2")}
              {tile("kpi3")}
              {tile("table")}
            </main>
          </div>
        </div>
      </section>
    </>
  )
}
