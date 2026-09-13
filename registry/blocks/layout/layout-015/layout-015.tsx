"use client"

import { useRef, useState, useEffect, type CSSProperties, type PointerEvent, type ReactNode } from "react"

export type Layout015Item = {
  /** Заголовок слота. */
  title?: string
  /** Подпись или короткий текст. */
  text?: string
  /** Крупное значение для слота-показателя. */
  value?: string
  /** Медиа или любой свой контент внутри слота. */
  media?: ReactNode
}

export type Layout015Props = {
  /** Заголовок над раскладкой. */
  heading?: string
  /** Подзаголовок над раскладкой. */
  lead?: string
  /** Слоты по порядку: 01 описание слева (title — имя), 02 колонка, 03 колонка, 04 колонка, 05 колонка, 06 колонка. Без них — призрак. */
  items?: readonly Layout015Item[]
  /** Ширина колонки. */
  width?: "narrow" | "wide"
  /** Привязка прокрутки к колонкам. */
  snap?: boolean
  /** Номера слотов: подсказка, какой items[i] куда ложится. */
  numbers?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Колонки-ленты: слева закреплённая колонка с описанием и навигацией,
// справа ряд колонок одинаковой ширины с горизонтальной прокруткой и
// snap; у каждой колонки своя вертикальная прокрутка. Клик по ссылке
// слева плавно довозит ряд до колонки, активная ссылка следует за
// прокруткой, ползунок-пилюля едет к ней. На телефоне колонки во всю
// ширину, навигация — строкой сверху.
const NAMES = ["Проекты", "Лаборатория", "Фото", "Тексты", "Резюме"]
const LEADS = [
  "Работы, которые вышли или дошли достаточно далеко, чтобы о них рассказать.",
  "Эксперименты, тупики и прототипы. Ничего не закончено, кое-что и не будет.",
  "Места, поездки, свет.",
  "Заметки о ремесле и о том, что рядом.",
  "Опыт, навыки, контакты.",
]
const SLOTS = ["about", "c1", "c2", "c3", "c4", "c5"] as const
const GHOST: Record<(typeof SLOTS)[number], string> = {
  about: "text",
  c1: "image",
  c2: "note",
  c3: "image",
  c4: "text",
  c5: "table",
}

const STYLES = `
:where([data-vibeui-block="layout-015"]){
--vibeui-layout-015-bg:light-dark(#f2f2f2,#000000);
--vibeui-layout-015-tile:light-dark(#ffffff,#1a1a1a);
--vibeui-layout-015-tile-2:light-dark(#f7f7f7,#222222);
--vibeui-layout-015-edge:light-dark(color-mix(in oklab,#000000 8%,transparent),color-mix(in oklab,#ffffff 10%,transparent));
--vibeui-layout-015-edge-hover:light-dark(color-mix(in oklab,#000000 22%,transparent),color-mix(in oklab,#ffffff 26%,transparent));
--vibeui-layout-015-ink:light-dark(#000000,#ffffff);
--vibeui-layout-015-muted:light-dark(color-mix(in oklab,#000000 56%,#ffffff),color-mix(in oklab,#ffffff 60%,#1a1a1a));
--vibeui-layout-015-ghost:light-dark(color-mix(in oklab,#000000 12%,transparent),color-mix(in oklab,#ffffff 14%,transparent));
--vibeui-layout-015-ghost-strong:light-dark(color-mix(in oklab,#000000 70%,transparent),color-mix(in oklab,#ffffff 78%,transparent));
--vibeui-layout-015-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-layout-015-on-accent:oklch(from var(--vibeui-layout-015-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-layout-015-glow:color-mix(in oklab,var(--vibeui-layout-015-accent) 42%,transparent);
--vibeui-layout-015-glow-soft:light-dark(color-mix(in oklab,#000000 14%,transparent),color-mix(in oklab,#ffffff 22%,transparent));
--vibeui-layout-015-radius:1.25rem;--vibeui-layout-015-dur-4:340ms;--vibeui-layout-015-dur-5:460ms;
--vibeui-layout-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-015-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тема идёт за страницей: color-scheme наследуется от неё, а классовую
   тёмную тему (.dark у next-themes и shadcn) блок объявляет сам. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="layout-015"]{color-scheme:dark}
:where([data-vibeui-block="layout-015"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="layout-015"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="layout-015"]{display:block;min-width:min(100%,16rem);background:var(--vibeui-layout-015-bg);color:var(--vibeui-layout-015-ink);font-family:var(--vibeui-layout-015-font)}
[data-vibeui-block="layout-015"] *{box-sizing:border-box}
[data-vibeui-block="layout-015"] [data-part="frame"]{max-width:80rem;margin:0 auto;padding:3rem clamp(1.25rem,5cqi,3rem);display:flex;flex-direction:column;gap:2rem}
[data-vibeui-block="layout-015"] [data-part="head"]{display:flex;flex-direction:column;gap:0.75rem;max-width:40rem}
[data-vibeui-block="layout-015"] [data-part="head"] h2{margin:0;font-size:clamp(1.75rem,4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:650}
[data-vibeui-block="layout-015"] [data-part="head"] p{margin:0;color:var(--vibeui-layout-015-muted);font-size:1.0625rem;line-height:1.5}
[data-vibeui-block="layout-015"] [data-part="head"] > span{display:block;height:1.5rem;border-radius:999px;background:var(--vibeui-layout-015-ghost-strong);width:min(30rem,85%)}
[data-vibeui-block="layout-015"] [data-part="head"] > span:nth-child(2){width:min(22rem,60%)}
[data-vibeui-block="layout-015"] [data-part="head"] > span:nth-child(3){height:0.75rem;width:min(26rem,70%);background:var(--vibeui-layout-015-ghost);margin-top:0.25rem}
/* Плитка: слот с контентом или призраком, номером и светом за курсором. */
[data-vibeui-block="layout-015"] [data-part="tile"]{
position:relative;overflow:hidden;min-height:10rem;padding:1.5rem;border-radius:var(--vibeui-layout-015-radius);
background:var(--vibeui-layout-015-tile);border:1px solid var(--vibeui-layout-015-edge);
display:flex;flex-direction:column;justify-content:flex-end;gap:0.75rem;
--vibeui-layout-015-mx:50%;--vibeui-layout-015-my:50%;--vibeui-layout-015-on:0;
transition:transform var(--vibeui-layout-015-dur-5) cubic-bezier(.2,.8,.2,1),border-color var(--vibeui-layout-015-dur-5);
}
[data-vibeui-block="layout-015"] [data-part="tile"]::before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:radial-gradient(22rem circle at var(--vibeui-layout-015-mx) var(--vibeui-layout-015-my),color-mix(in oklab,var(--vibeui-layout-015-accent) 14%,transparent),transparent 60%);opacity:var(--vibeui-layout-015-on);transition:opacity var(--vibeui-layout-015-dur-5)}
[data-vibeui-block="layout-015"] [data-part="tile"]::after{content:"";position:absolute;inset:-1px;pointer-events:none;border-radius:inherit;padding:1px;background:radial-gradient(18rem circle at var(--vibeui-layout-015-mx) var(--vibeui-layout-015-my),color-mix(in oklab,var(--vibeui-layout-015-accent) 70%,transparent),transparent 55%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:var(--vibeui-layout-015-on);transition:opacity var(--vibeui-layout-015-dur-5)}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover{border-color:var(--vibeui-layout-015-edge-hover)}
[data-vibeui-block="layout-015"] [data-part="tile"] h3{margin:0;font-size:1.125rem;font-weight:600;line-height:1.3}
[data-vibeui-block="layout-015"] [data-part="tile"] p{margin:0;color:var(--vibeui-layout-015-muted);font-size:0.9375rem;line-height:1.45}
[data-vibeui-block="layout-015"] [data-part="value"]{font-size:clamp(2.5rem,6cqi,3.5rem);font-weight:650;letter-spacing:-0.03em;line-height:1}
[data-vibeui-block="layout-015"] [data-part="media"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="layout-015"] [data-part="media"] > *{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="layout-015"] [data-part="tile"] > :not([data-part="media"]):not([data-part="num"]){position:relative}
[data-vibeui-block="layout-015"] [data-part="num"]{position:absolute;top:1.125rem;left:1.125rem;z-index:1;font:500 0.6875rem/1 var(--vibeui-layout-015-mono);letter-spacing:0.08em;padding:0.375rem 0.5rem;border-radius:999px;color:var(--vibeui-layout-015-muted);border:1px solid var(--vibeui-layout-015-edge);background:color-mix(in oklab,var(--vibeui-layout-015-tile) 70%,transparent);transition:color var(--vibeui-layout-015-dur-4),border-color var(--vibeui-layout-015-dur-4),background-color var(--vibeui-layout-015-dur-4)}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="num"]{color:var(--vibeui-layout-015-on-accent);background:var(--vibeui-layout-015-accent);border-color:var(--vibeui-layout-015-accent)}
[data-vibeui-block="layout-015"][data-numbers] [data-part="icon"],[data-vibeui-block="layout-015"][data-numbers] [data-part="faces"],[data-vibeui-block="layout-015"][data-numbers] [data-part="spark"],[data-vibeui-block="layout-015"][data-numbers] [data-part="rows"],[data-vibeui-block="layout-015"][data-numbers] [data-part="image"],[data-vibeui-block="layout-015"][data-numbers] [data-part="window"]{margin-top:2rem}
/* Призраки. */
[data-vibeui-block="layout-015"] [data-part="bar"]{display:block;height:0.875rem;border-radius:999px;background:var(--vibeui-layout-015-ghost-strong);width:70%}
[data-vibeui-block="layout-015"] [data-part="bar"][data-soft]{background:var(--vibeui-layout-015-ghost);height:0.625rem;width:50%}
[data-vibeui-block="layout-015"] [data-part="bar"][data-wide]{width:88%}
[data-vibeui-block="layout-015"] [data-part="bar"][data-big]{height:1.5rem}
[data-vibeui-block="layout-015"] [data-part="button"]{display:inline-block;width:6.5rem;height:2.5rem;border-radius:0.75rem;background:var(--vibeui-layout-015-accent);margin-top:0.5rem;transition:transform var(--vibeui-layout-015-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="button"]{transform:translateX(4px)}
[data-vibeui-block="layout-015"] [data-part="big"]{display:block;height:3rem;width:55%;border-radius:0.75rem;background:var(--vibeui-layout-015-ghost-strong)}
[data-vibeui-block="layout-015"] [data-part="rows"]{display:flex;flex-direction:column;gap:1rem;flex:1;justify-content:space-evenly;padding-block:0.5rem}
[data-vibeui-block="layout-015"] [data-part="rows"] span{display:flex;align-items:center;gap:0.75rem}
[data-vibeui-block="layout-015"] [data-part="rows"] i{width:0.75rem;height:0.75rem;border-radius:999px;background:var(--vibeui-layout-015-accent);flex:none;transition:transform var(--vibeui-layout-015-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-015"] [data-part="rows"] b{display:block;height:0.625rem;border-radius:999px;background:var(--vibeui-layout-015-ghost);flex:1}
[data-vibeui-block="layout-015"] [data-part="rows"] span:nth-child(odd) b{max-width:80%}
[data-vibeui-block="layout-015"] [data-part="rows"][data-table] span{gap:1.25rem;padding:0.5rem 0;border-bottom:1px solid var(--vibeui-layout-015-edge)}
[data-vibeui-block="layout-015"] [data-part="rows"][data-table] b:first-child{max-width:30%}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="rows"] i{transform:scale(1.35)}
[data-vibeui-block="layout-015"] [data-part="icon"]{width:2.75rem;height:2.75rem;border-radius:0.875rem;background:var(--vibeui-layout-015-accent);margin-bottom:auto;transition:transform var(--vibeui-layout-015-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="icon"]{transform:rotate(-6deg) scale(1.08)}
[data-vibeui-block="layout-015"] [data-part="faces"]{display:flex;margin-bottom:auto}
[data-vibeui-block="layout-015"] [data-part="faces"] i{width:2.5rem;height:2.5rem;border-radius:999px;border:2px solid var(--vibeui-layout-015-tile);background:var(--vibeui-layout-015-ghost-strong);margin-inline-start:-0.625rem;transition:transform var(--vibeui-layout-015-dur-5) cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-015"] [data-part="faces"] i:first-child{margin-inline-start:0;background:var(--vibeui-layout-015-accent)}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(2){transform:translateX(3px)}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(3){transform:translateX(6px)}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="faces"] i:nth-child(4){transform:translateX(9px)}
[data-vibeui-block="layout-015"] [data-part="spark"]{width:100%;height:4rem;margin-bottom:auto;overflow:visible}
[data-vibeui-block="layout-015"] [data-part="spark"] path{fill:none;stroke:var(--vibeui-layout-015-accent);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:240;stroke-dashoffset:0}
[data-vibeui-block="layout-015"] [data-part="spark"] path[data-fill]{fill:var(--vibeui-layout-015-glow);fill-opacity:0.25;stroke:none}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="spark"] path:not([data-fill]){animation:vibeui-layout-015-draw 1.1s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-015"] [data-part="image"]{display:block;flex:1;min-height:6rem;border-radius:0.75rem;background:radial-gradient(70% 80% at 80% 15%,var(--vibeui-layout-015-glow) 0%,transparent 65%),radial-gradient(60% 70% at 15% 85%,var(--vibeui-layout-015-glow-soft) 0%,transparent 65%),var(--vibeui-layout-015-tile-2);margin-bottom:auto;transition:transform 0.6s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover [data-part="image"]{transform:scale(1.02)}
[data-vibeui-block="layout-015"] [data-part="window"]{display:block;flex:1;min-height:8rem;border-radius:0.75rem 0.75rem 0 0;border:1px solid var(--vibeui-layout-015-edge);border-bottom:0;background:linear-gradient(var(--vibeui-layout-015-tile-2),var(--vibeui-layout-015-tile-2)) 0 0 / 100% 2rem no-repeat,repeating-linear-gradient(to bottom,transparent 0 2.75rem,var(--vibeui-layout-015-ghost) 2.75rem 3.25rem) 1.25rem 0 / calc(100% - 2.5rem) 100% no-repeat,var(--vibeui-layout-015-tile);position:relative;margin-bottom:0}
[data-vibeui-block="layout-015"] [data-part="window"] i{position:absolute;top:0.7rem;width:0.6rem;height:0.6rem;border-radius:999px;background:var(--vibeui-layout-015-ghost-strong)}
[data-vibeui-block="layout-015"] [data-part="window"] i:nth-child(1){left:0.75rem;background:var(--vibeui-layout-015-accent)}
[data-vibeui-block="layout-015"] [data-part="window"] i:nth-child(2){left:1.6rem}
[data-vibeui-block="layout-015"] [data-part="window"] i:nth-child(3){left:2.45rem}
@keyframes vibeui-layout-015-rise{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:none}}
@keyframes vibeui-layout-015-draw{from{stroke-dashoffset:240}to{stroke-dashoffset:0}}

[data-vibeui-block="layout-015"] [data-part="frame"]{padding:0;max-width:none}
[data-vibeui-block="layout-015"] [data-part="body"]{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);height:min(46rem,100dvh);border:1px solid var(--vibeui-layout-015-edge);border-radius:var(--vibeui-layout-015-radius);overflow:hidden;background:var(--vibeui-layout-015-tile);--vibeui-layout-015-col:26rem}
[data-vibeui-block="layout-015"][data-width="wide"] [data-part="body"]{--vibeui-layout-015-col:32rem}
/* Левая колонка: имя, описание, навигация с пилюлей. */
[data-vibeui-block="layout-015"] [data-part="side"]{display:flex;flex-direction:column;gap:1rem;padding:1.25rem 1.25rem 1rem;border-bottom:1px solid var(--vibeui-layout-015-edge);background:var(--vibeui-layout-015-tile-2)}
[data-vibeui-block="layout-015"] [data-part="side"] [data-part="tile"]{background:none;border:0;padding:0;min-height:0;justify-content:flex-start;overflow:visible}
[data-vibeui-block="layout-015"] [data-part="side"] [data-part="tile"]::before,[data-vibeui-block="layout-015"] [data-part="side"] [data-part="tile"]::after{display:none}
[data-vibeui-block="layout-015"] [data-part="side"] [data-part="tile"]:hover{transform:none}
[data-vibeui-block="layout-015"] [data-part="side"] [data-part="num"]{position:static;align-self:flex-start}
[data-vibeui-block="layout-015"] [data-part="side"] h3{font-size:1.375rem;font-weight:650;letter-spacing:-0.02em}
[data-vibeui-block="layout-015"] [data-part="side"] p{font-size:1rem;line-height:1.5}
[data-vibeui-block="layout-015"] [data-part="nav"]{position:relative;display:flex;gap:0.25rem;overflow-x:auto;scrollbar-width:none;margin-inline:-0.5rem;padding-inline:0.5rem}
[data-vibeui-block="layout-015"] [data-part="nav"]::-webkit-scrollbar{display:none}
[data-vibeui-block="layout-015"] [data-part="nav"] button{position:relative;z-index:1;padding:0.4rem 0.75rem;border:0;border-radius:0.625rem;background:none;font:inherit;font-size:1rem;color:var(--vibeui-layout-015-muted);cursor:pointer;white-space:nowrap;text-align:left;transition:color var(--vibeui-layout-015-dur-4)}
[data-vibeui-block="layout-015"] [data-part="nav"] button[aria-current="true"]{color:var(--vibeui-layout-015-ink);font-weight:550}
[data-vibeui-block="layout-015"] [data-part="nav"] button:hover{color:var(--vibeui-layout-015-ink)}
[data-vibeui-block="layout-015"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-layout-015-accent);outline-offset:2px}
[data-vibeui-block="layout-015"] [data-part="pill"]{position:absolute;left:0.5rem;right:0.5rem;border-radius:0.625rem;background:color-mix(in oklab,var(--vibeui-layout-015-accent) 12%,transparent);transition:top var(--vibeui-layout-015-dur-5) cubic-bezier(.2,.8,.2,1),height var(--vibeui-layout-015-dur-5);pointer-events:none;display:none}
[data-vibeui-block="layout-015"] [data-part="clock"]{margin-top:auto;font-size:0.8rem;color:var(--vibeui-layout-015-muted);display:none}
/* Ряд колонок: горизонтальная прокрутка со snap, каждая колонка — своя
   вертикальная прокрутка. */
[data-vibeui-block="layout-015"] [data-part="deck"]{position:relative;display:flex;overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:var(--vibeui-layout-015-edge-hover) transparent}
[data-vibeui-block="layout-015"][data-snap] [data-part="deck"]{scroll-snap-type:x mandatory}
[data-vibeui-block="layout-015"] [data-part="column"]{flex:0 0 100%;width:100%;height:100%;display:flex;flex-direction:column;scroll-snap-align:start;box-shadow:inset -1px 0 0 var(--vibeui-layout-015-edge)}
[data-vibeui-block="layout-015"] [data-part="column"] header{display:flex;flex-direction:column;gap:0.5rem;padding:1.5rem 1.5rem 1rem;flex:none}
[data-vibeui-block="layout-015"] [data-part="column"] header h3{margin:0;font-size:1.5rem;font-weight:650;letter-spacing:-0.02em;display:flex;align-items:center;gap:0.35rem}
[data-vibeui-block="layout-015"] [data-part="column"] header h3::after{content:"›";color:var(--vibeui-layout-015-muted);font-weight:400}
[data-vibeui-block="layout-015"] [data-part="column"] header p{margin:0;color:var(--vibeui-layout-015-muted);line-height:1.45;padding-bottom:1rem;border-bottom:1px solid var(--vibeui-layout-015-edge)}
[data-vibeui-block="layout-015"] [data-part="scroll"]{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:0 1.5rem 1.5rem;display:flex;flex-direction:column;gap:1rem;scrollbar-width:thin;scrollbar-color:var(--vibeui-layout-015-edge-hover) transparent}
[data-vibeui-block="layout-015"] [data-part="scroll"] > [data-part="tile"]{flex:none;min-height:16rem}
[data-vibeui-block="layout-015"] [data-part="scroll"] > [data-part="tile"] [data-part="image"]{min-height:12rem}
[data-vibeui-block="layout-015"] [data-part="scroll"] > [data-part="tile"]:nth-child(2){min-height:12rem}
[data-vibeui-block="layout-015"] [data-part="content"]{display:contents}
@container (min-width: 48rem){
[data-vibeui-block="layout-015"] [data-part="body"]{grid-template-columns:18rem minmax(0,1fr);grid-template-rows:minmax(0,1fr)}
[data-vibeui-block="layout-015"] [data-part="side"]{border-bottom:0;border-right:1px solid var(--vibeui-layout-015-edge);padding:1.75rem 1.5rem 1.25rem;overflow:auto}
[data-vibeui-block="layout-015"] [data-part="nav"]{flex-direction:column;gap:0;overflow:visible;margin:0;padding:0}
[data-vibeui-block="layout-015"] [data-part="nav"] button{padding:0.4rem 0.75rem;margin-inline:-0.75rem;width:calc(100% + 1.5rem)}
[data-vibeui-block="layout-015"] [data-part="pill"]{display:block;left:-0.75rem;right:-0.75rem}
[data-vibeui-block="layout-015"] [data-part="clock"]{display:block}
[data-vibeui-block="layout-015"] [data-part="column"]{flex:0 0 var(--vibeui-layout-015-col);width:var(--vibeui-layout-015-col)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="layout-015"] *{animation:none!important;transition:none!important}
[data-vibeui-block="layout-015"] [data-part="tile"]:hover{transform:none}
[data-vibeui-block="layout-015"] [data-part="tile"]::before,[data-vibeui-block="layout-015"] [data-part="tile"]::after{display:none}
}
`

function Ghost({ kind }: { kind: string }) {
  switch (kind) {
    case "text":
      return <><span data-part="bar" data-wide="" /><span data-part="bar" data-soft="" data-wide="" /><span data-part="bar" data-soft="" /><span data-part="bar" data-soft="" data-wide="" /></>
    case "image":
      return <><span data-part="image" /><span data-part="bar" /><span data-part="bar" data-soft="" /></>
    case "note":
      return <><span data-part="bar" /><span data-part="bar" data-soft="" data-wide="" /><span data-part="bar" data-soft="" /></>
    case "table":
      return <><div data-part="rows" data-table=""><span><b /><b /><b /></span><span><b /><b /><b /></span><span><b /><b /><b /></span><span><b /><b /><b /></span><span><b /><b /><b /></span></div></>
    default:
      return null
  }
}

type TileProps = {
  area: (typeof SLOTS)[number]
  item?: Layout015Item
  numbers: boolean
  index: number
  className?: string
}

function Tile({ area, item, numbers, index, className }: TileProps) {
  const filled = Boolean(item && (item.title || item.text || item.value || item.media))

  return (
    <article
      data-part="tile"
      data-area={area}
      className={className}
      aria-hidden={filled ? undefined : true}
      style={{ "--vibeui-layout-015-i": index } as CSSProperties}
    >
      {item?.media ? <div data-part="media">{item.media}</div> : null}
      {numbers ? (
        <span data-part="num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}
      {filled ? (
        <>
          {item?.value ? <span data-part="value">{item.value}</span> : null}
          {item?.title ? <h3>{item.title}</h3> : null}
          {item?.text ? <p>{item.text}</p> : null}
        </>
      ) : (
        <Ghost kind={GHOST[area]} />
      )}
    </article>
  )
}

/** Колонки-ленты: ссылки слева листают колонки справа. */
export function Layout015({
  heading,
  lead,
  items,
  width = "narrow",
  snap = true,
  numbers = true,
  tone = "auto",
  accent,
  className,
  style,
}: Layout015Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-015-accent": accent } : null),
    ...style,
  } as CSSProperties
  const hasHead = Boolean(heading || lead)
  const tile = (area: (typeof SLOTS)[number], className?: string, key?: string) => (
    <Tile
      key={key ?? area}
      area={area}
      item={items?.[SLOTS.indexOf(area)]}
      numbers={numbers}
      index={SLOTS.indexOf(area)}
      className={className}
    />
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
      target.style.setProperty("--vibeui-layout-015-mx", `${x}%`)
      target.style.setProperty("--vibeui-layout-015-my", `${y}%`)
      target.style.setProperty("--vibeui-layout-015-on", "1")
    })
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-part="tile"]')

    target?.style.setProperty("--vibeui-layout-015-on", "0")
  }

  // Ряд колонок и активная колонка: клик слева везёт ряд, прокрутка справа
  // двигает подсветку. Позиция пилюли — offsetTop активной кнопки.
  const deck = useRef<HTMLDivElement>(null)
  const nav = useRef<(HTMLButtonElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [pill, setPill] = useState({ top: 0, height: 0 })
  const columns = (["c1", "c2", "c3", "c4", "c5"] as const).map((area, index) => ({
    area,
    title: items?.[index + 1]?.title ?? NAMES[index],
    text: items?.[index + 1]?.text,
    media: items?.[index + 1]?.media,
  }))

  function go(index: number) {
    const row = deck.current
    const column = row?.children[index] as HTMLElement | undefined

    if (!row || !column) return

    row.scrollTo({ left: column.offsetLeft, behavior: "smooth" })
    setActive(index)
  }

  function onScroll() {
    const row = deck.current

    if (!row) return

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const columns = [...row.children] as HTMLElement[]
      let nearest = 0
      let distance = Number.POSITIVE_INFINITY

      columns.forEach((column, index) => {
        const delta = Math.abs(column.offsetLeft - row.scrollLeft)

        if (delta < distance) {
          distance = delta
          nearest = index
        }
      })

      setActive(nearest)
    })
  }

  useEffect(() => {
    const button = nav.current[active]

    if (button) setPill({ top: button.offsetTop, height: button.offsetHeight })
  }, [active])

  // Часы внизу левой колонки, как у оригинала: местное время, раз в полминуты.
  const [clock, setClock] = useState("")

  useEffect(() => {
    const tick = () => setClock(new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date()))

    tick()
    const timer = window.setInterval(tick, 30000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      <style href="vibeui-layout-015" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="layout-015"
        data-tone={tone === "auto" ? undefined : tone}
        data-numbers={numbers ? "" : undefined}
        data-width={width === "narrow" ? undefined : width}
        data-snap={snap ? "" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">

          <div data-part="body" onPointerMove={handleMove} onPointerOut={handleLeave}>
            <aside data-part="side">
              {items?.[0]?.title || items?.[0]?.text ? (
                <div data-part="tile" data-area="about">
                  {numbers ? <span data-part="num" aria-hidden="true">01</span> : null}
                  {items[0].title ? <h3>{items[0].title}</h3> : null}
                  {items[0].text ? <p>{items[0].text}</p> : null}
                </div>
              ) : (
                tile("about")
              )}
              <nav data-part="nav" aria-label="Разделы">
                <span data-part="pill" aria-hidden="true" style={{ top: pill.top, height: pill.height }} />
                {columns.map((column, index) => (
                  <button
                    key={column.area}
                    type="button"
                    aria-current={active === index ? "true" : undefined}
                    ref={(node) => {
                      nav.current[index] = node
                    }}
                    onClick={() => go(index)}
                  >
                    {column.title}
                  </button>
                ))}
              </nav>
              <span data-part="clock" aria-hidden="true">{clock ? "Сейчас " + clock : null}</span>
            </aside>
            <div data-part="deck" ref={deck} onScroll={onScroll}>
              {columns.map((column, index) => (
                <section data-part="column" key={column.area} aria-label={column.title}>
                  <header>
                    <h3>{column.title}</h3>
                    {column.text ? <p>{column.text}</p> : <p>{LEADS[index]}</p>}
                  </header>
                  <div data-part="scroll">
                    {column.media ? <div data-part="content">{column.media}</div> : (
                      <>
                        {tile(column.area, undefined, column.area + "-a")}
                        {tile(column.area, undefined, column.area + "-b")}
                        {tile(column.area, undefined, column.area + "-c")}
                      </>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
