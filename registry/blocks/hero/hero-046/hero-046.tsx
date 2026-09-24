"use client"

import { memo, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

import { Button016 } from "@/registry/components/button/button-016/button-016"

/** Фигура зоны в координатах кадра 1920×1080: многоугольник или круг. */
export type Hero046Shape = { points: string } | { cx: number; cy: number; r: number }

export type Hero046Zone = {
  id: string
  label: string
  service: string
  price: string
  note?: string
  shapes: readonly Hero046Shape[]
  /** Точка в координатах кадра 1920×1080, у которой встаёт ценник, если зону выбрали кнопкой. */
  pin: { x: number; y: number }
}

export type Hero046Props = {
  /** Ролик въезда (mp4/H.264): скачивается целиком, играет один раз и замирает на последнем кадре. */
  videoSrc?: string
  /** Тот же ролик в webm (VP9) — для браузеров без H.264. */
  videoWebmSrc?: string
  /** Последний кадр ролика: для reduced-motion и если видео не загрузилось. */
  stillSrc?: string
  /** Машина из последнего кадра без фона, того же размера, что кадр: ложится поверх надписи. */
  carSrc?: string
  /** Огромная надпись за машиной. */
  wordmark?: string
  eyebrow?: string
  /** Строки заголовка: каждая въезжает отдельно. */
  title?: readonly string[]
  lede?: string
  primaryLabel?: string
  /** Мелкая строка под главной кнопкой. */
  primaryHint?: string
  /** Надпись на круглой кнопке запуска. */
  startLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Части машины на стоп-кадре. Первая зона забирает всё на машине, что не попало в остальные. */
  zones?: readonly Hero046Zone[]
  zonesTitle?: string
  zonesLabel?: string
  loadingLabel?: string
  skipLabel?: string
  replayLabel?: string
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро-интро: экран открывается пустым, по центру тахометр: стрелка идёт за загрузкой —
// ролик скачивается целиком (fetch с прогрессом → blob), чтобы не
// подтормаживать посреди дрифта. Потом ролик играет один раз и замирает на
// последнем кадре; только тогда проявляются надпись, текст и карточки.
// Стоп-кадр вписан в «рамку» с пропорцией ролика, которая повторяет
// object-fit:cover — поэтому надпись и вырезанная машина в процентах рамки
// ложатся точно на кадр при любой ширине. На стоп-кадре части машины живые: над ними курсор становится кольцом,
// рядом едет ценник. Фазу блок пишет и на <html>
// (data-vibeui-hero-046), чтобы страница могла прятать шапку на время интро.
const FONTS = "https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-046"]){
--vibeui-hero-046-bg:#0b0c0e;
--vibeui-hero-046-fg:#f2f3f5;
--vibeui-hero-046-accent:#f2f3f5;
--vibeui-hero-046-muted:color-mix(in oklab,var(--vibeui-hero-046-fg) 68%,var(--vibeui-hero-046-bg));
--vibeui-hero-046-line:color-mix(in oklab,var(--vibeui-hero-046-fg) 16%,transparent);
--vibeui-hero-046-glass:color-mix(in oklab,var(--vibeui-hero-046-bg) 55%,transparent);
--vibeui-hero-046-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-046-font:"Inter Tight",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-046-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
--vibeui-hero-046-ease:cubic-bezier(.2,.8,.2,1);
container:vibeui-hero-046/inline-size;
color-scheme:dark;
}
[data-vibeui-block="hero-046"]{box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate;background:var(--vibeui-hero-046-bg);color:var(--vibeui-hero-046-fg);font-family:var(--vibeui-hero-046-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-046"] *{box-sizing:border-box}
[data-vibeui-block="hero-046"] [data-part="scene"]{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:space-between}
[data-vibeui-block="hero-046"] [data-part="stage"]{position:relative;aspect-ratio:5/4;overflow:hidden;container-type:size;background:var(--vibeui-hero-046-bg)}
[data-vibeui-block="hero-046"] [data-part="frame"]{position:absolute;right:0;top:50%;width:max(100cqw,177.778cqh);height:max(100cqh,56.25cqw);translate:0 -50%;container-type:size}
[data-vibeui-block="hero-046"] [data-part="frame"] :is(video,img){position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="hero-046"] [data-part="video"]{opacity:0;transition:opacity .8s ease-out}
[data-vibeui-block="hero-046"]:not([data-phase="loading"]) [data-part="video"]{opacity:1}
[data-vibeui-block="hero-046"] [data-part="still"]{display:none}
[data-vibeui-block="hero-046"][data-failed="true"] [data-part="video"]{display:none}
[data-vibeui-block="hero-046"][data-failed="true"] [data-part="still"]{display:block}
[data-vibeui-block="hero-046"] [data-part="car"]{z-index:2;opacity:0;pointer-events:none;transition:opacity .6s ease-out}
[data-vibeui-block="hero-046"][data-phase="parked"] [data-part="car"]{opacity:1}
[data-vibeui-block="hero-046"] [data-part="wordmark"]{position:absolute;z-index:1;left:0;right:9%;top:22%;margin:0;text-align:right;white-space:nowrap;font-family:var(--vibeui-hero-046-display);font-weight:900;font-size:8.5cqw;line-height:1;letter-spacing:-.04em;text-transform:uppercase;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-hero-046-fg) 92%,transparent) 30%,color-mix(in oklab,var(--vibeui-hero-046-fg) 20%,transparent) 95%);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:0;translate:0 18%;filter:blur(8px);transition:opacity 1.2s ease-out .15s,translate 1.5s var(--vibeui-hero-046-ease) .15s,filter 1.2s ease-out .15s;pointer-events:none;user-select:none}
[data-vibeui-block="hero-046"][data-phase="parked"] [data-part="wordmark"]{opacity:.9;translate:0 0;filter:none}
[data-vibeui-block="hero-046"] [data-part="shade"]{position:absolute;inset:0;z-index:3;pointer-events:none;opacity:0;transition:opacity 1.2s ease-out;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-hero-046-bg) 55%,transparent),transparent 18%),linear-gradient(0deg,var(--vibeui-hero-046-bg) 6%,transparent 42%)}
[data-vibeui-block="hero-046"][data-phase="parked"] [data-part="shade"]{opacity:1}
[data-vibeui-block="hero-046"] [data-part="loader"]{position:absolute;inset:0;z-index:6;display:grid;place-content:center;justify-items:center;gap:.9rem;pointer-events:none;transition:opacity .6s ease-out,visibility 0s linear .6s}
[data-vibeui-block="hero-046"]:not([data-phase="loading"]) [data-part="loader"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-046"] [data-part="tacho"]{width:clamp(14rem,34cqi,22rem);height:auto;overflow:visible;color:var(--vibeui-hero-046-fg)}
[data-vibeui-block="hero-046"] [data-part="tacho"] [data-part="dial"]{fill:none;stroke:var(--vibeui-hero-046-line);stroke-width:1.5}
[data-vibeui-block="hero-046"] [data-part="tacho"] [data-part="trail"]{fill:none;stroke:color-mix(in oklab,var(--vibeui-hero-046-fg) 55%,transparent);stroke-width:3;stroke-linecap:round;stroke-dasharray:1;transition:stroke-dashoffset .35s cubic-bezier(.3,.7,.3,1)}
[data-vibeui-block="hero-046"] [data-part="tacho"] [data-part="redline"]{fill:none;stroke:var(--vibeui-hero-046-accent);stroke-width:5;opacity:.85}
[data-vibeui-block="hero-046"] [data-part="tacho"] [data-part="tick"]{stroke:color-mix(in oklab,var(--vibeui-hero-046-fg) 45%,transparent);stroke-width:1.2;stroke-linecap:round}
[data-vibeui-block="hero-046"] [data-part="tacho"] [data-part="tick"][data-major="true"]{stroke:var(--vibeui-hero-046-fg);stroke-width:2}
[data-vibeui-block="hero-046"] [data-part="tacho"] [data-part="tick"][data-red="true"]{stroke:var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"] [data-part="tacho"] text{font-family:var(--vibeui-hero-046-mono);font-size:10px;fill:var(--vibeui-hero-046-muted);text-anchor:middle;dominant-baseline:middle}
[data-vibeui-block="hero-046"] [data-part="tacho"] [data-part="digits"]{font-family:var(--vibeui-hero-046-display);font-weight:700;font-size:19px;letter-spacing:-.02em;fill:var(--vibeui-hero-046-fg);font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-046"] [data-part="tacho"] [data-part="unit"]{font-size:7px;letter-spacing:.3em;fill:var(--vibeui-hero-046-muted)}
[data-vibeui-block="hero-046"] [data-part="needle"]{transform-box:view-box;transform-origin:100px 100px;rotate:var(--vibeui-hero-046-needle,-120deg);transition:rotate .35s cubic-bezier(.3,.7,.3,1)}
[data-vibeui-block="hero-046"] [data-part="needle"] line{stroke:var(--vibeui-hero-046-accent);stroke-width:2.5;stroke-linecap:round;filter:drop-shadow(0 0 4px var(--vibeui-hero-046-accent))}
[data-vibeui-block="hero-046"] [data-part="needle"] circle{fill:var(--vibeui-hero-046-bg);stroke:var(--vibeui-hero-046-accent);stroke-width:2}
[data-vibeui-block="hero-046"] [data-part="tacho"][data-idle="true"] [data-part="needle"]{animation:vibeui-hero-046-idle 1.6s ease-in-out infinite}
[data-vibeui-block="hero-046"] [data-part="tacho"][data-limiter="true"] [data-part="needle"]{transition:none;animation:vibeui-hero-046-limiter .09s linear infinite alternate}
[data-vibeui-block="hero-046"] [data-part="tacho"][data-limiter="true"] [data-part="redline"]{animation:vibeui-hero-046-flash .18s steps(2) infinite}
[data-vibeui-block="hero-046"] [data-part="tacho"][data-limiter="true"] [data-part="digits"]{fill:var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"] [data-part="caption"]{margin:0;font-family:var(--vibeui-hero-046-mono);font-size:.66rem;letter-spacing:.28em;text-transform:uppercase;color:var(--vibeui-hero-046-muted)}
@keyframes vibeui-hero-046-idle{0%,100%{rotate:-96deg}50%{rotate:-84deg}}
@keyframes vibeui-hero-046-limiter{from{rotate:calc(var(--vibeui-hero-046-needle) - 6deg)}to{rotate:calc(var(--vibeui-hero-046-needle) + 1.5deg)}}
@keyframes vibeui-hero-046-flash{50%{opacity:.25}}
[data-vibeui-block="hero-046"] [data-part="shell"]{position:relative;z-index:4;width:100%;max-width:84rem;margin:0 auto;padding:1.5rem 1.25rem 3rem;display:grid;gap:2rem;align-items:end}
[data-vibeui-block="hero-046"] [data-part="copy"],[data-vibeui-block="hero-046"] [data-part="side"]{opacity:0;translate:0 1.25rem;visibility:hidden;transition:opacity 1s ease-out .35s,translate 1.1s var(--vibeui-hero-046-ease) .35s,visibility 0s}
[data-vibeui-block="hero-046"] [data-part="side"]{transition-delay:.6s}
[data-vibeui-block="hero-046"][data-phase="parked"] :is([data-part="copy"],[data-part="side"]){opacity:1;translate:0 0;visibility:visible}
[data-vibeui-block="hero-046"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.6rem;margin:0 0 1.1rem;font-family:var(--vibeui-hero-046-mono);font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"] [data-part="eyebrow"]::before{content:"";width:2rem;height:1px;background:var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-046-display);font-weight:900;font-size:clamp(2rem,3.4cqi,3.1rem);line-height:1;letter-spacing:-.035em;text-transform:uppercase}
[data-vibeui-block="hero-046"] [data-part="line"]{display:block;overflow:hidden;padding-bottom:.06em;margin-bottom:-.06em}
[data-vibeui-block="hero-046"] [data-part="line"] span{display:block;translate:0 110%;transition:translate .9s var(--vibeui-hero-046-ease);transition-delay:calc(var(--vibeui-hero-046-i) * .12s + .45s)}
[data-vibeui-block="hero-046"][data-phase="parked"] [data-part="line"] span{translate:0 0}
[data-vibeui-block="hero-046"] [data-part="line"]:last-child span{color:var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"] [data-part="lede"]{margin:1.1rem 0 0;max-width:30rem;font-size:1rem;color:var(--vibeui-hero-046-muted)}
[data-vibeui-block="hero-046"] [data-part="actions"]{display:flex;flex-wrap:wrap;align-items:center;gap:1rem 1.4rem;margin:1.6rem 0 0}
[data-vibeui-block="hero-046"] [data-part="start"]{display:inline-flex;align-items:center;gap:1rem;padding:.55rem 1.6rem .55rem .55rem;border-radius:999px;border:1px solid color-mix(in oklab,var(--vibeui-hero-046-fg) 22%,transparent);background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-hero-046-fg) 9%,transparent),color-mix(in oklab,var(--vibeui-hero-046-fg) 2%,transparent)),color-mix(in oklab,var(--vibeui-hero-046-bg) 70%,transparent);box-shadow:inset 0 1px 0 color-mix(in oklab,var(--vibeui-hero-046-fg) 18%,transparent),0 14px 34px -16px #000;color:var(--vibeui-hero-046-fg);text-decoration:none;transition:border-color .3s,box-shadow .3s;-webkit-tap-highlight-color:transparent}
[data-vibeui-block="hero-046"] [data-part="start"]:is(:hover,:focus-visible){border-color:color-mix(in oklab,var(--vibeui-hero-046-fg) 48%,transparent);box-shadow:inset 0 1px 0 color-mix(in oklab,var(--vibeui-hero-046-fg) 26%,transparent),0 0 0 4px color-mix(in oklab,var(--vibeui-hero-046-fg) 6%,transparent),0 14px 34px -16px #000}
[data-vibeui-block="hero-046"] [data-part="knob"]{position:relative;display:grid;place-items:center;flex:none;width:4.1rem;height:4.1rem;border-radius:50%;background:radial-gradient(circle at 35% 30%,#3a3d42,#15171a 62%,#0b0c0e);box-shadow:inset 0 1px 0 rgb(255 255 255 / .14),inset 0 -2px 6px rgb(0 0 0 / .6),0 6px 16px -6px #000;transition:box-shadow .35s,scale .12s}
[data-vibeui-block="hero-046"] [data-part="knob"] [data-part="ring"]{position:absolute;inset:-5px;width:calc(100% + 10px);height:calc(100% + 10px);rotate:-90deg;overflow:visible}
[data-vibeui-block="hero-046"] [data-part="ring"] circle{fill:none;stroke-width:2}
[data-vibeui-block="hero-046"] [data-part="ring"] circle:first-child{stroke:var(--vibeui-hero-046-line)}
[data-vibeui-block="hero-046"] [data-part="ring"] circle:last-child{stroke:var(--vibeui-hero-046-accent);stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)}
[data-vibeui-block="hero-046"] [data-part="knob"] b{display:grid;justify-items:center;gap:.1rem;font-family:var(--vibeui-hero-046-mono);font-weight:500;font-size:.44rem;line-height:1.1;letter-spacing:.12em;text-transform:uppercase;color:var(--vibeui-hero-046-muted);text-align:center;transition:color .3s}
[data-vibeui-block="hero-046"] [data-part="power"]{width:1.05rem;height:1.05rem;stroke:var(--vibeui-hero-046-accent);fill:none;stroke-width:2.2;stroke-linecap:round;transition:filter .3s}
[data-vibeui-block="hero-046"] [data-part="start-text"]{display:grid;gap:.2rem}
[data-vibeui-block="hero-046"] [data-part="start-text"] strong{display:block;font-family:var(--vibeui-hero-046-display);font-weight:700;font-size:.92rem;letter-spacing:.02em;text-transform:uppercase}
[data-vibeui-block="hero-046"] [data-part="start-text"] small{font-family:var(--vibeui-hero-046-mono);font-size:.68rem;letter-spacing:.06em;color:var(--vibeui-hero-046-muted)}
[data-vibeui-block="hero-046"] [data-part="start"]:is(:hover,:focus-visible) [data-part="ring"] circle:last-child{stroke-dashoffset:0}
[data-vibeui-block="hero-046"] [data-part="start"]:is(:hover,:focus-visible) [data-part="knob"]{box-shadow:inset 0 1px 0 rgb(255 255 255 / .14),inset 0 -2px 6px rgb(0 0 0 / .6),0 0 22px -4px var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"] [data-part="start"]:is(:hover,:focus-visible) [data-part="knob"] b{color:var(--vibeui-hero-046-fg)}
[data-vibeui-block="hero-046"] [data-part="start"]:is(:hover,:focus-visible) [data-part="power"]{filter:drop-shadow(0 0 5px var(--vibeui-hero-046-accent))}
[data-vibeui-block="hero-046"] [data-part="start"]:active [data-part="knob"]{scale:.94;animation:vibeui-hero-046-crank .07s linear 3}
[data-vibeui-block="hero-046"] [data-part="start"]:focus-visible{outline:none}
[data-vibeui-block="hero-046"] [data-part="start"]:focus-visible [data-part="knob"]{outline:2px solid var(--vibeui-hero-046-accent);outline-offset:6px}
@keyframes vibeui-hero-046-crank{25%{translate:-1px 0}75%{translate:1px 0}}
[data-vibeui-block="hero-046"] [data-part="side"]{display:grid;gap:1rem;justify-items:start}
[data-vibeui-block="hero-046"] [data-part="shell"]{pointer-events:none}
[data-vibeui-block="hero-046"] :is([data-part="actions"] > *,[data-part="chips"] li){pointer-events:auto}
[data-vibeui-block="hero-046"] [data-part="hits"]{position:absolute;inset:0;z-index:5;width:100%;height:100%;display:none}
[data-vibeui-block="hero-046"][data-phase="parked"] [data-part="hits"]{display:block}
[data-vibeui-block="hero-046"][data-cursor="true"] [data-part="hits"]{cursor:none}
[data-vibeui-block="hero-046"] [data-part="cursor"]{position:absolute;z-index:8;left:0;top:0;width:2.4rem;height:2.4rem;margin:-1.2rem 0 0 -1.2rem;pointer-events:none;will-change:transform}
[data-vibeui-block="hero-046"] [data-part="cursor"] i{position:absolute;inset:0;border-radius:50%;border:1.5px solid color-mix(in oklab,var(--vibeui-hero-046-fg) 85%,transparent);opacity:0;scale:.5;transition:opacity .18s,scale .25s var(--vibeui-hero-046-ease)}
[data-vibeui-block="hero-046"] [data-part="cursor"] i::after{content:"";position:absolute;left:50%;top:50%;width:4px;height:4px;margin:-2px;border-radius:50%;background:var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"][data-cursor="true"] [data-part="cursor"] i{opacity:1;scale:1}
[data-vibeui-block="hero-046"] [data-part="tag"]{position:absolute;z-index:8;left:0;top:0;width:min(12.5rem,60cqw);margin:0;pointer-events:none;will-change:transform}
[data-vibeui-block="hero-046"] [data-part="tag"] > div{padding:.6rem .75rem .65rem;border-radius:.8rem;border:1px solid var(--vibeui-hero-046-line);background:color-mix(in oklab,var(--vibeui-hero-046-bg) 94%,transparent);box-shadow:0 18px 40px -18px #000;opacity:0;scale:.94;transform-origin:0 100%;transition:opacity .3s ease-out,scale .35s var(--vibeui-hero-046-ease)}
[data-vibeui-block="hero-046"] [data-part="tag"][data-open="true"] > div{opacity:1;scale:1}
[data-vibeui-block="hero-046"] [data-part="tag"] small{display:block;font-family:var(--vibeui-hero-046-mono);font-size:.62rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-hero-046-muted)}
[data-vibeui-block="hero-046"] [data-part="tag"] b{display:block;margin:.25rem 0 0;font-family:var(--vibeui-hero-046-display);font-weight:700;font-size:.9rem;line-height:1.2;letter-spacing:-.01em}
[data-vibeui-block="hero-046"] [data-part="tag"] strong{display:block;margin:.35rem 0 0;font-family:var(--vibeui-hero-046-display);font-weight:900;font-size:1.2rem;line-height:1;letter-spacing:-.03em;color:var(--vibeui-hero-046-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-046"] [data-part="slot"]{display:grid}
[data-vibeui-block="hero-046"] [data-part="slot"][data-kind="head"]{min-height:3.35rem}
[data-vibeui-block="hero-046"] [data-part="face"]{grid-area:1/1;display:block;animation:vibeui-hero-046-in .35s ease-out both}
[data-vibeui-block="hero-046"] [data-part="face"][data-old="true"]{animation-name:vibeui-hero-046-out}
@keyframes vibeui-hero-046-in{from{opacity:0}}
@keyframes vibeui-hero-046-out{to{opacity:0}}
[data-vibeui-block="hero-046"] [data-part="slot"][data-kind="note"]{display:none;min-height:3.2rem;margin:.4rem 0 0;font-size:.78rem;line-height:1.35;color:var(--vibeui-hero-046-muted)}
[data-vibeui-block="hero-046"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:.45rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="hero-046"] [data-part="chip"]{padding:.4rem .8rem;border-radius:999px;border:1px solid var(--vibeui-hero-046-line);background:var(--vibeui-hero-046-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:var(--vibeui-hero-046-muted);font:inherit;font-size:.8rem;font-weight:500;cursor:pointer;transition:color .2s,border-color .2s,background .2s}
[data-vibeui-block="hero-046"] [data-part="chip"]:is(:hover,[aria-pressed="true"],[data-active="true"]){color:var(--vibeui-hero-046-fg);border-color:var(--vibeui-hero-046-accent);background:color-mix(in oklab,var(--vibeui-hero-046-accent) 16%,transparent)}
[data-vibeui-block="hero-046"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-hero-046-accent);outline-offset:2px}
[data-vibeui-block="hero-046"] [data-part="zones-title"]{margin:0;font-family:var(--vibeui-hero-046-mono);font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"] [data-part="live"]{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
[data-vibeui-block="hero-046"] [data-part="replay"]{position:absolute;z-index:5;right:1rem;bottom:1rem;padding:.4rem .85rem;border-radius:999px;border:1px solid var(--vibeui-hero-046-line);background:var(--vibeui-hero-046-glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:var(--vibeui-hero-046-fg);font:inherit;font-size:.78rem;font-weight:500;cursor:pointer;transition:border-color .2s,background .2s,opacity .6s}
[data-vibeui-block="hero-046"]:is([data-phase="loading"],[data-failed="true"]) [data-part="replay"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-046"] [data-part="replay"]:hover{border-color:var(--vibeui-hero-046-accent)}
[data-vibeui-block="hero-046"] [data-part="replay"]:focus-visible{outline:2px solid var(--vibeui-hero-046-accent);outline-offset:3px}
@container vibeui-hero-046 (min-width: 56rem){
[data-vibeui-block="hero-046"] [data-part="scene"]{justify-content:flex-end}
[data-vibeui-block="hero-046"] [data-part="stage"]{position:absolute;inset:0;aspect-ratio:auto}
[data-vibeui-block="hero-046"] [data-part="frame"]{right:auto;left:50%;translate:-50% -50%}
[data-vibeui-block="hero-046"] [data-part="wordmark"]{font-size:10cqw}
[data-vibeui-block="hero-046"] [data-part="shade"]{background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-hero-046-bg) 55%,transparent),transparent 18%),linear-gradient(0deg,color-mix(in oklab,var(--vibeui-hero-046-bg) 85%,transparent),transparent 34%),linear-gradient(90deg,color-mix(in oklab,var(--vibeui-hero-046-bg) 60%,transparent),transparent 45%)}
[data-vibeui-block="hero-046"] [data-part="shell"]{padding:0 2rem 3rem;grid-template-columns:minmax(0,1fr) auto}
[data-vibeui-block="hero-046"] [data-part="side"]{justify-items:end}
[data-vibeui-block="hero-046"] [data-part="chips"]{justify-content:flex-end}
[data-vibeui-block="hero-046"] [data-part="slot"][data-kind="note"]{display:grid}
[data-vibeui-block="hero-046"] [data-part="tag"]{width:15rem}
[data-vibeui-block="hero-046"] [data-part="replay"]{right:1.5rem;bottom:1.25rem}
[data-vibeui-block="hero-046"] [data-part="side"]{margin-bottom:2.5rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="hero-046"] *{transition:none!important;animation:none!important}
[data-vibeui-block="hero-046"] :is([data-part="video"],[data-part="loader"],[data-part="replay"]){display:none}
[data-vibeui-block="hero-046"] [data-part="still"]{display:block}
[data-vibeui-block="hero-046"] :is([data-part="car"],[data-part="shade"]){opacity:1}
[data-vibeui-block="hero-046"] [data-part="wordmark"]{opacity:.9;translate:0 0;filter:none}
[data-vibeui-block="hero-046"] :is([data-part="copy"],[data-part="side"]){opacity:1;translate:0 0;visibility:visible}
[data-vibeui-block="hero-046"] [data-part="line"] span{translate:0 0}
}`

// Фигуры размечены по последнему кадру демо-ролика (1920×1080); для своего
// ролика их размечают заново. Подсветка обрезается по альфе carSrc, поэтому
// многоугольники могут быть грубыми — лишнее за контуром машины не видно.
// Последние секунды ролика замедляются до SLOW_RATE — машина «оседает»,
// и стоп-кадр наступает без рывка.
const SWITCH_GAP = 1000
// Время смены зоны: обработчики событий, не рендер, — но линтер чистоты
// React ругается на performance.now() в теле компонента.
const now = () => performance.now()
const SLOW_RAMP = 1.4
const SLOW_RATE = 0.3

// Тахометр: 0–8 тысяч оборотов на дуге 240°. Загрузка ведёт стрелку до 7 тыс.,
// на 100% стрелка секунду бьётся в отсечку — и только потом стартует ролик.
const RPM_MAX = 8
const RPM_RED = 6.5
const RPM_LOADED = 7
const RPM_LIMITER = 7.6
const LIMITER_MS = 1000
// Если за столько ролик не готов играть, интро пропускаем: сразу стоп-кадр и сайт.
const READY_TIMEOUT = 5000
const angleOf = (rpm: number) => -120 + (rpm / RPM_MAX) * 240
const polar = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180
  return [100 + radius * Math.sin(rad), 100 - radius * Math.cos(rad)] as const
}
const arcPath = (from: number, to: number, radius: number) => {
  const [x1, y1] = polar(from, radius)
  const [x2, y2] = polar(to, radius)
  return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${radius} ${radius} 0 ${to - from > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}
const TICKS = Array.from({ length: RPM_MAX * 2 + 1 }, (_, index) => index / 2)

const DEFAULT_ZONES: Hero046Zone[] = [
  { id: "body", label: "Кузов", service: "Керамика 9H, три слоя", price: "от 32 000 ₽", note: "Срок работ — два дня. Гидрофобный эффект сохраняется 2–3 года.", shapes: [{ points: "1050,562 1105,490 1210,490 1350,482 1480,480 1630,470 1635,422 1745,412 1750,430 1730,480 1755,495 1768,630 1740,672 1640,672 1635,630 1620,578 1590,548 1555,538 1520,548 1490,578 1475,630 1475,676 1100,678 1035,668 1022,632 1018,594 1003,570" }], pin: { x: 1330, y: 590 } },
  { id: "glass", label: "Салон", service: "Химчистка салона и кожи", price: "от 9 000 ₽", note: "Сиденья, потолок, ковровое покрытие, пластик. Очистка и кондиционирование кожи.", shapes: [{ points: "1095,482 1250,410 1420,405 1500,440 1490,485 1210,492" }], pin: { x: 1290, y: 452 } },
  { id: "hood", label: "Капот", service: "Антигравийная плёнка на фронт", price: "от 45 000 ₽", note: "Капот, бампер, зеркала, стойки. Плёнка XPEL, гарантия 10 лет.", shapes: [{ points: "815,522 950,492 1090,478 1110,490 1105,560 1000,556 870,560" }], pin: { x: 965, y: 518 } },
  { id: "lights", label: "Фары", service: "Полировка и бронирование фар", price: "от 7 000 ₽", note: "Удаляем помутнение и микротрещины, наносим защитную плёнку 200 мкм.", shapes: [{ points: "700,540 815,522 870,560 862,615 700,625" }], pin: { x: 778, y: 560 } },
  { id: "wheels", label: "Диски", service: "Чистка и керамика на диски", price: "от 5 000 ₽", note: "Демонтаж, очистка внутренней стороны, керамическое покрытие. Тормозная пыль смывается водой.", shapes: [{ cx: 940, cy: 620, r: 76 }, { cx: 1555, cy: 620, r: 76 }], pin: { x: 1555, y: 620 } },
]

const parsed = new WeakMap<object, number[][]>()
function insideShape(shape: Hero046Shape, x: number, y: number) {
  if (!("points" in shape)) return (x - shape.cx) ** 2 + (y - shape.cy) ** 2 <= shape.r ** 2
  let points = parsed.get(shape)
  if (!points) {
    points = shape.points.trim().split(/\s+/).map((pair) => pair.split(",").map(Number))
    parsed.set(shape, points)
  }
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i]
    const [xj, yj] = points[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

// Альфа-карта машины (кадр ужат в 4 раза): по ней решаем, стоит ли курсор
// на машине вообще. Так зоны покрывают силуэт целиком, без пустых щелей.
const ALPHA_SCALE = 4

// Цена «набегает» от прошлого значения к новому; текст вокруг числа
// («от», «₽») остаётся как есть. Пишем прямо в узел — без перерисовки.
function Price({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null)
  const last = useRef(0)
  useEffect(() => {
    const node = ref.current
    const match = value.match(/\d(?:[\d\s\u00a0\u202f]*\d)?/)
    if (!node || !match || match.index === undefined) return
    const head = value.slice(0, match.index)
    const tail = value.slice(match.index + match[0].length)
    const from = last.current
    const to = Number(match[0].replace(/\D/g, ""))
    const start = performance.now()
    let frame = 0
    const step = (now: number) => {
      const progress = Math.min((now - start) / 650, 1)
      const current = progress < 1 ? Math.round((from + (to - from) * (1 - (1 - progress) ** 3)) / 10) * 10 : to
      node.textContent = head + current.toLocaleString("ru-RU") + tail
      last.current = current
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return <strong ref={ref}>{value}</strong>
}

// Тахометр загрузки — отдельный memo-компонент: смена зон на стоп-кадре
// перерисовывает блок, а риски и подписи шкалы при этом не трогаются.
const Loader = memo(function Loader({ progress, limiter, label }: { progress: number | null; limiter: boolean; label: string }) {
  const rpm = limiter ? RPM_LIMITER : (progress ?? 0) * RPM_LOADED
  return (
    <div data-part="loader" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress === null ? undefined : Math.round(progress * 100)}>
      <svg data-part="tacho" viewBox="0 0 200 150" data-idle={progress === null && !limiter ? "true" : undefined} data-limiter={limiter ? "true" : undefined} style={{ ["--vibeui-hero-046-needle" as string]: `${angleOf(rpm)}deg` }}>
        <path data-part="dial" d={arcPath(-120, 120, 86)} />
        <path data-part="trail" d={arcPath(-120, 120, 80)} pathLength={1} style={{ strokeDashoffset: 1 - rpm / RPM_MAX }} />
        <path data-part="redline" d={arcPath(angleOf(RPM_RED), 120, 86)} />
        {TICKS.map((value) => {
          const major = Number.isInteger(value)
          const [x1, y1] = polar(angleOf(value), 74)
          const [x2, y2] = polar(angleOf(value), major ? 64 : 69)
          return <line key={value} data-part="tick" data-major={String(major)} data-red={String(value >= RPM_RED)} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
        {TICKS.filter(Number.isInteger).map((value) => {
          const [x, y] = polar(angleOf(value), 53)
          return (
            <text key={value} x={x} y={y}>
              {value}
            </text>
          )
        })}
        <g data-part="needle">
          <line x1={100} y1={108} x2={100} y2={24} />
          <circle cx={100} cy={100} r={5} />
        </g>
        <text data-part="digits" x={100} y={128}>
          {progress === null && !limiter ? "—" : Math.round(rpm * 10) * 100}
        </text>
        <text data-part="unit" x={100} y={143}>
          RPM
        </text>
      </svg>
      <p data-part="caption">{label}</p>
    </div>
  )
})

type Phase = "loading" | "playing" | "parked"

/** Хиро-интро: пустой экран с загрузкой, ролик въезда, стоп-кадр — и только потом весь текст. */
export function Hero046({
  videoSrc = "/demo/auto/drift.mp4",
  videoWebmSrc = "/demo/auto/drift.webm",
  stillSrc = "/demo/auto/drift-end.webp",
  carSrc = "/demo/auto/drift-car.webp",
  wordmark = "Гараж 42",
  eyebrow = "Детейлинг-студия · Санкт-Петербург",
  title = ["Керамика.", "Плёнка.", "Полировка"],
  lede = "Керамика, антигравийная плёнка и полировка в закрытом боксе. Смета фиксируется после осмотра, каждый этап работ — с фотоотчётом.",
  primaryLabel = "Рассчитать стоимость",
  primaryHint = "расчёт за минуту",
  startLabel = "Engine start",
  primaryHref = "#services",
  secondaryLabel = "",
  secondaryHref = "#results",
  zones = DEFAULT_ZONES,
  zonesTitle = "Услуги по зонам",
  zonesLabel = "Зоны машины",
  loadingLabel = "Загрузка",
  skipLabel = "Пропустить",
  replayLabel = "Повторить заезд",
  accent,
  ink,
  background,
  className,
  style,
}: Hero046Props) {
  const [phase, setPhase] = useState<Phase>("loading")
  const [progress, setProgress] = useState<number | null>(0)
  const [failed, setFailed] = useState(false)
  const [limiter, setLimiter] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [follow, setFollow] = useState(false)
  const [lastId, setLastId] = useState<string | null>(null)
  const [prevId, setPrevId] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const glidePos = useRef({ x: 0, y: 0 })
  const flip = useRef({ target: 0, value: 0 })
  const glideFrame = useRef(0)
  const leaveTimer = useRef(0)
  const hoverId = useRef<string | null>(null)
  const visibleId = useRef<string | null>(null)
  const switchedAt = useRef(0)
  const switchTimer = useRef(0)
  // Размеры кэшируются наблюдателем: читать их на каждом движении мыши —
  // значит заставлять браузер пересчитывать раскладку посреди анимаций.
  const sizes = useRef({ frameWidth: 1, frameHeight: 1, tagWidth: 0, tagHeight: 0 })
  const alpha = useRef<Uint8ClampedArray | null>(null)
  const currentId = active ?? pinned
  const current = zones.find((zone) => zone.id === currentId) ?? null
  // Пока ценник гаснет, в нём остаётся последняя зона, а не пустая рамка.
  const shown = current ?? zones.find((zone) => zone.id === lastId) ?? null
  const previous = zones.find((zone) => zone.id === prevId && zone.id !== shown?.id) ?? null

  const palette = {
    ...(accent ? { "--vibeui-hero-046-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-046-fg": ink } : null),
    ...(background ? { "--vibeui-hero-046-bg": background } : null),
    ["--vibeui-hero-046-progress" as string]: progress ?? 0,
    ...style,
  } as CSSProperties

  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // Ролик грузится обычной буферизацией: тахометр показывает, сколько уже
    // в буфере, а старт — когда браузер уверен, что доиграет без остановок
    // (canplaythrough). Ждать файл целиком не нужно; если за READY_TIMEOUT
    // готовности нет — показываем сайт со стоп-кадром и бросаем загрузку.
    let started = false
    let limiterTimer = 0
    const start = () => {
      if (started) return
      started = true
      window.clearTimeout(readyTimer)
      setProgress(1)
      setLimiter(true)
      limiterTimer = window.setTimeout(() => {
        video.play().then(() => setPhase("playing")).catch(fail)
      }, LIMITER_MS)
    }
    // Нет сети, нет кодека или браузер запретил автоплей — сразу стоп-кадр.
    const fail = () => {
      window.clearTimeout(readyTimer)
      setFailed(true)
      setPhase("parked")
    }
    const buffered = () => {
      if (!video.duration || started) return
      const end = video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0
      setProgress(Math.min(end / video.duration, 0.99))
    }
    const readyTimer = window.setTimeout(() => {
      if (started) return
      video.removeAttribute("src")
      video.load()
      fail()
    }, READY_TIMEOUT)
    video.addEventListener("progress", buffered)
    video.addEventListener("loadedmetadata", buffered)
    video.addEventListener("canplaythrough", start)
    video.addEventListener("error", fail)
    video.muted = true
    video.preload = "auto"
    video.src = video.canPlayType('video/mp4; codecs="avc1.640028"') || !videoWebmSrc ? videoSrc : videoWebmSrc
    video.load()
    return () => {
      window.clearTimeout(readyTimer)
      window.clearTimeout(limiterTimer)
      video.removeEventListener("progress", buffered)
      video.removeEventListener("loadedmetadata", buffered)
      video.removeEventListener("canplaythrough", start)
      video.removeEventListener("error", fail)
    }
  }, [videoSrc, videoWebmSrc])

  useEffect(() => {
    const video = videoRef.current
    if (!video || phase !== "playing") return
    let frame = 0
    const tick = () => {
      const left = video.duration - video.currentTime
      video.playbackRate = left < SLOW_RAMP ? SLOW_RATE + (1 - SLOW_RATE) * (left / SLOW_RAMP) : 1
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      video.playbackRate = 1
    }
  }, [phase])

  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    root.setAttribute("data-vibeui-hero-046", reduced ? "parked" : phase)
    return () => root.removeAttribute("data-vibeui-hero-046")
  }, [phase])

  // Кольцо стоит точно под курсором, ценник догоняет его с инерцией. Двигаем
  // только transform самих элементов — это работа композитора, без пересчёта
  // стилей и раскладки. Сторона ценника меняется с запасом (70% → влево,
  // 56% → вправо) и тоже плавно, чтобы у края он не метался.
  const glide = () => {
    const tag = tagRef.current
    if (!tag) return
    const pos = glidePos.current
    const side = flip.current
    pos.x += (target.current.x - pos.x) * 0.18
    pos.y += (target.current.y - pos.y) * 0.18
    side.value += (side.target - side.value) * 0.14
    const shift = 24 - side.value * (sizes.current.tagWidth + 48)
    tag.style.transform = `translate3d(${pos.x + shift}px, ${pos.y - sizes.current.tagHeight - 8}px, 0)`
    const moving = Math.abs(target.current.x - pos.x) + Math.abs(target.current.y - pos.y) + Math.abs(side.target - side.value) > 0.3
    glideFrame.current = moving ? requestAnimationFrame(glide) : 0
  }
  const place = (x: number, y: number) => {
    const frame = frameRef.current
    if (!frame) return
    const px = (x / 100) * sizes.current.frameWidth
    const py = (y / 100) * sizes.current.frameHeight
    target.current = { x: px, y: py }
    if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`
    if (x > 70) flip.current.target = 1
    else if (x < 56) flip.current.target = 0
    if (!glideFrame.current) glideFrame.current = requestAnimationFrame(glide)
  }
  // Между соседними частями ценник не гаснет: уход ждёт короткую паузу.
  const enterZone = (id: string) => {
    window.clearTimeout(leaveTimer.current)
    window.clearTimeout(switchTimer.current)
    hoverId.current = id
    visibleId.current = id
    switchedAt.current = now()
    setFollow(true)
    setActive(id)
    if (id !== lastId) setPrevId(lastId)
    setLastId(id)
  }
  // Ценник меняет зону не чаще раза в SWITCH_GAP: быстрый проход курсора
  // по машине не мелькает, а в конце паузы встаёт зона, где курсор остался.
  const requestZone = (id: string) => {
    hoverId.current = id
    window.clearTimeout(leaveTimer.current)
    window.clearTimeout(switchTimer.current)
    if (id === visibleId.current) return
    const wait = SWITCH_GAP - (now() - switchedAt.current)
    if (!visibleId.current || wait <= 0) enterZone(id)
    else switchTimer.current = window.setTimeout(() => hoverId.current && enterZone(hoverId.current), wait)
  }
  const leaveZone = () => {
    window.clearTimeout(leaveTimer.current)
    window.clearTimeout(switchTimer.current)
    hoverId.current = null
    leaveTimer.current = window.setTimeout(() => {
      visibleId.current = null
      setActive(null)
    }, 140)
  }
  const zoneAt = (x: number, y: number) => {
    const map = alpha.current
    const width = 1920 / ALPHA_SCALE
    if (map && map[Math.floor(y / ALPHA_SCALE) * width + Math.floor(x / ALPHA_SCALE)] < 40) return null
    for (let index = zones.length - 1; index > 0; index--) {
      if (zones[index].shapes.some((shape) => insideShape(shape, x, y))) return zones[index].id
    }
    if (map) return zones[0]?.id ?? null
    return zones[0]?.shapes.some((shape) => insideShape(shape, x, y)) ? zones[0].id : null
  }
  const pointAt = (event: PointerEvent<HTMLElement>) => {
    const x = (event.nativeEvent.offsetX / sizes.current.frameWidth) * 100
    const y = (event.nativeEvent.offsetY / sizes.current.frameHeight) * 100
    place(x, y)
    return zoneAt(x * 19.2, y * 10.8)
  }
  const hover = (event: PointerEvent<HTMLElement>) => {
    const id = pointAt(event)
    if (id === hoverId.current) return
    if (id) requestZone(id)
    else leaveZone()
  }
  const tap = (event: PointerEvent<HTMLElement>) => {
    const id = pointAt(event)
    if (!id) return
    enterZone(id)
    setPinned((value) => (value === id ? null : id))
  }
  const pickZone = (id: string) => {
    const zone = zones.find((item) => item.id === id)
    if (zone) place(zone.pin.x / 19.2, zone.pin.y / 10.8)
    window.clearTimeout(leaveTimer.current)
    window.clearTimeout(switchTimer.current)
    visibleId.current = id
    switchedAt.current = now()
    setFollow(false)
    setActive(id)
    if (id !== lastId) setPrevId(lastId)
    setLastId(id)
  }

  useEffect(
    () => () => {
      cancelAnimationFrame(glideFrame.current)
      window.clearTimeout(leaveTimer.current)
      window.clearTimeout(switchTimer.current)
    },
    [],
  )

  useEffect(() => {
    const frame = frameRef.current
    const tag = tagRef.current
    if (!frame || !tag) return
    const observer = new ResizeObserver(() => {
      sizes.current = { frameWidth: frame.offsetWidth || 1, frameHeight: frame.offsetHeight || 1, tagWidth: tag.offsetWidth, tagHeight: tag.offsetHeight }
    })
    observer.observe(frame)
    observer.observe(tag)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 1920 / ALPHA_SCALE
      canvas.height = 1080 / ALPHA_SCALE
      const context = canvas.getContext("2d", { willReadFrequently: true })
      if (!context) return
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      const map = new Uint8ClampedArray(canvas.width * canvas.height)
      for (let index = 0; index < map.length; index++) map[index] = pixels[index * 4 + 3]
      alpha.current = map
    }
    image.src = carSrc
  }, [carSrc])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (phase === "parked") {
      video.currentTime = 0
      setPhase("playing")
      video.play().catch(() => setPhase("parked"))
      return
    }
    video.pause()
    if (video.duration) video.currentTime = video.duration
    setPhase("parked")
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-046" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-046" data-phase={phase} data-failed={failed ? "true" : undefined} data-cursor={follow && active ? "true" : undefined} className={className} style={palette}>
        <div data-part="scene">
          <div data-part="stage" aria-hidden="true">
            <div data-part="frame" ref={frameRef}>
              <video ref={videoRef} data-part="video" muted playsInline preload="none" onEnded={() => setPhase("parked")} />
              <img data-part="still" src={stillSrc} alt="" />
              {wordmark ? <p data-part="wordmark">{wordmark}</p> : null}
              <img data-part="car" src={carSrc} alt="" />
              <span data-part="hits" onPointerMove={hover} onPointerLeave={leaveZone} onPointerUp={tap} />
              <span data-part="cursor" ref={cursorRef}>
                <i />
              </span>
              <div data-part="tag" ref={tagRef} data-open={String(Boolean(current))}>
                {shown ? (
                  <div>
                    <span data-part="slot" data-kind="head">
                      {previous ? (
                        <span key={`old-${previous.id}`} data-part="face" data-old="true">
                          <small>{previous.label}</small>
                          <b>{previous.service}</b>
                        </span>
                      ) : null}
                      <span key={`new-${shown.id}`} data-part="face">
                        <small>{shown.label}</small>
                        <b>{shown.service}</b>
                      </span>
                    </span>
                    <Price value={shown.price} />
                    <span data-part="slot" data-kind="note">
                      {previous?.note ? (
                        <span key={`old-${previous.id}`} data-part="face" data-old="true">
                          {previous.note}
                        </span>
                      ) : null}
                      {shown.note ? (
                        <span key={`new-${shown.id}`} data-part="face">
                          {shown.note}
                        </span>
                      ) : null}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
            <i data-part="shade" />
          </div>
          <Loader progress={progress} limiter={limiter} label={loadingLabel} />
          <div data-part="shell">
            <div data-part="copy">
              {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
              <h1 data-part="title">
                {title.map((line, index) => (
                  <span key={line} data-part="line" style={{ ["--vibeui-hero-046-i" as string]: index }}>
                    <span>{line}</span>
                  </span>
                ))}
              </h1>
              {lede ? <p data-part="lede">{lede}</p> : null}
              <div data-part="actions">
                {primaryLabel ? (
                  <a data-part="start" href={primaryHref}>
                    <span data-part="knob" aria-hidden="true">
                      <svg data-part="ring" viewBox="0 0 60 60">
                        <circle cx={30} cy={30} r={29} />
                        <circle cx={30} cy={30} r={29} pathLength={1} />
                      </svg>
                      <b>
                        <svg data-part="power" viewBox="0 0 24 24">
                          <path d="M12 3v8M7 6.3a7.5 7.5 0 1 0 10 0" />
                        </svg>
                        {startLabel}
                      </b>
                    </span>
                    <span data-part="start-text">
                      <strong>
                        {primaryLabel}
                      </strong>
                      {primaryHint ? <small>{primaryHint}</small> : null}
                    </span>
                  </a>
                ) : null}
                {secondaryLabel ? <Button016 label={secondaryLabel} href={secondaryHref} external={false} size="lg" tone="neutral" accent={accent} /> : null}
              </div>
            </div>
            {zones.length ? (
              <div data-part="side">
                <p data-part="zones-title">{zonesTitle}</p>
                <p data-part="live" aria-live="polite">{current ? `${current.label}: ${current.service}, ${current.price}` : ""}</p>
                <ul data-part="chips" aria-label={zonesLabel}>
                  {zones.map((zone) => (
                    <li key={zone.id}>
                      <button data-part="chip" type="button" data-active={String(active === zone.id)} aria-pressed={pinned === zone.id} onPointerEnter={() => pickZone(zone.id)} onPointerLeave={leaveZone} onFocus={() => pickZone(zone.id)} onBlur={leaveZone} onClick={() => setPinned((value) => (value === zone.id ? null : zone.id))}>
                        {zone.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <button data-part="replay" type="button" onClick={toggle}>
            {phase === "parked" ? replayLabel : skipLabel}
          </button>
        </div>
      </section>
    </>
  )
}
