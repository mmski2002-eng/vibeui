"use client"

import { useEffect, useId, useState, type CSSProperties } from "react"

export type Hero025Props = {
  /** Имена через « & »: «Василиса & Артём». Амперсанд подкрашивается. */
  names?: string
  eyebrow?: string
  /** Дата и время начала в ISO: «2027-09-05T15:00:00+03:00». Считает обратный отсчёт и попадает в .ics. */
  date?: string
  /** Дата словами для людей: «5 сентября 2027, суббота». */
  dateLabel?: string
  place?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  /** Подпись кнопки «Добавить в календарь». Пусто — кнопки нет. */
  calendarLabel?: string
  /** Заголовок события и адрес для .ics. */
  calendarTitle?: string
  calendarLocation?: string
  image?: string
  imageAlt?: string
  /** Надпись на арке фото: «save the date». */
  stamp?: string
  /** Подписи плиток отсчёта: дни, часы, минуты, секунды. */
  countdownLabels?: readonly [string, string, string, string]
  /** Конверт-заставка с печатью: клик открывает письмо. */
  envelope?: boolean
  /** Подсказка на печати: «нажмите». */
  sealHint?: string
  /** Надпись на конверте над именами: «дорогим гостям». */
  envelopeLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран приглашения: кремовый лист, имена курсивным serif'ом, дата
// и место, обратный отсчёт в четырёх плитках, кнопки «Подтвердить» и
// «В календарь» (.ics собирается на клиенте). Справа фото пары в арке с
// печатью «save the date». Поверх всего экрана — конверт на тёмно-сливовом
// фоне с огоньками и пульсирующей печатью: клик ломает печать, клапан
// откидывается подкладкой наружу и уходит за конверт, письмо поднимается
// из кармана (низ остаётся за передними складками), конверт оседает, фон
// растворяется. Слои: задник 0, открытый клапан 0, письмо 1, передние
// складки 2, закрытый клапан 3, печать 4. Reduced motion показывает письмо
// сразу.
const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap"

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="hero-025"]){
--vibeui-hero-025-bg:light-dark(#f6f1e8,#17131a);
--vibeui-hero-025-fg:light-dark(#2b1a24,#f3ebe4);
--vibeui-hero-025-muted:light-dark(#7a6a70,#b3a5aa);
--vibeui-hero-025-line:light-dark(#e2d8ca,#372b31);
--vibeui-hero-025-card:light-dark(#fffaf3,#211a25);
--vibeui-hero-025-accent:#b8552f;
--vibeui-hero-025-plum:light-dark(#4a1f36,#e9c7d6);
--vibeui-hero-025-sand:light-dark(#d9c5a5,#5a4a3a);
--vibeui-hero-025-sage:#8a9a7b;
--vibeui-hero-025-night:#2b1a24;
--vibeui-hero-025-envelope:light-dark(#efe6d8,#241c28);
--vibeui-hero-025-on-accent:#fff7ef;
--vibeui-hero-025-display:"Cormorant Garamond",Georgia,"Times New Roman",serif;
--vibeui-hero-025-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-025"]{color-scheme:dark}
:where([data-vibeui-block="hero-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-025"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-hero-025-bg);color:var(--vibeui-hero-025-fg);font-family:var(--vibeui-hero-025-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-025"] *{box-sizing:border-box}
[data-vibeui-block="hero-025"]::before{content:"";position:absolute;inset:0;background:radial-gradient(42% 38% at 12% 18%,color-mix(in oklab,var(--vibeui-hero-025-accent) 22%,transparent),transparent 70%),radial-gradient(38% 42% at 88% 84%,color-mix(in oklab,var(--vibeui-hero-025-sage) 30%,transparent),transparent 70%);pointer-events:none}
[data-vibeui-block="hero-025"]::after{content:"";position:absolute;inset:0;background-image:${GRAIN};opacity:.3;mix-blend-mode:multiply;pointer-events:none}
[data-vibeui-block="hero-025"] [data-part="frame"]{position:relative;z-index:1;display:grid;gap:2.5rem;max-width:80rem;margin:0 auto;padding:6rem 1.25rem 3rem}
[data-vibeui-block="hero-025"] [data-part="eyebrow"]{margin:0 0 1.2rem;font-size:.72rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="names"]{margin:0;font-family:var(--vibeui-hero-025-display);font-weight:400;font-style:italic;font-size:clamp(2.8rem,9cqi,6.5rem);line-height:.98;letter-spacing:-.01em;text-wrap:balance}
[data-vibeui-block="hero-025"] [data-part="names"] em{display:inline-block;margin:0 .08em;font-style:italic;color:var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="date"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin:1.6rem 0 0;font-family:var(--vibeui-hero-025-display);font-size:clamp(1.15rem,2.4cqi,1.5rem);font-weight:500;color:var(--vibeui-hero-025-plum)}
[data-vibeui-block="hero-025"] [data-part="date"] i{width:2.5rem;height:1px;background:var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="lede"]{max-width:34rem;margin:1rem 0 0;color:var(--vibeui-hero-025-muted);font-size:1.02rem}
[data-vibeui-block="hero-025"] [data-part="countdown"]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.6rem;max-width:26rem;margin:2rem 0 0;padding:0;list-style:none}
[data-vibeui-block="hero-025"] [data-part="countdown"] li{display:grid;justify-items:center;gap:.15rem;padding:.85rem .25rem;border:1px solid color-mix(in oklab,var(--vibeui-hero-025-card) 70%,transparent);border-radius:1rem 1rem 3rem 3rem / 1rem 1rem 1.6rem 1.6rem;background:color-mix(in oklab,var(--vibeui-hero-025-card) 55%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 14px 30px -22px rgb(43 26 36 / .5),inset 0 1px 0 rgb(255 255 255 / .55);transition:transform .3s cubic-bezier(.2,.9,.3,1.3)}
[data-vibeui-block="hero-025"] [data-part="countdown"] li:hover{transform:translateY(-.25rem)}
[data-vibeui-block="hero-025"] [data-part="countdown"] b{font-family:var(--vibeui-hero-025-display);font-size:clamp(1.6rem,3.4cqi,2.3rem);font-weight:500;line-height:1;font-variant-numeric:tabular-nums;color:var(--vibeui-hero-025-plum)}
[data-vibeui-block="hero-025"] [data-part="countdown"] span{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-025-muted)}
[data-vibeui-block="hero-025"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:2rem}
[data-vibeui-block="hero-025"] [data-part="primary"],[data-vibeui-block="hero-025"] [data-part="calendar"]{display:inline-flex;align-items:center;gap:.5rem;height:3rem;padding:0 1.4rem;border-radius:999px;font:inherit;font-weight:600;font-size:.92rem;text-decoration:none;cursor:pointer;transition:transform .2s,background .25s,border-color .25s}
[data-vibeui-block="hero-025"] [data-part="primary"]{background:var(--vibeui-hero-025-accent);color:var(--vibeui-hero-025-on-accent);border:1px solid var(--vibeui-hero-025-accent);box-shadow:0 12px 30px -14px color-mix(in oklab,var(--vibeui-hero-025-accent) 80%,transparent)}
[data-vibeui-block="hero-025"] [data-part="primary"]:hover{transform:translateY(-2px);background:color-mix(in oklab,var(--vibeui-hero-025-accent) 88%,#000)}
[data-vibeui-block="hero-025"] [data-part="calendar"]{background:color-mix(in oklab,var(--vibeui-hero-025-card) 45%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:var(--vibeui-hero-025-fg);border:1px solid color-mix(in oklab,var(--vibeui-hero-025-card) 80%,transparent)}
[data-vibeui-block="hero-025"] [data-part="calendar"]:hover{border-color:var(--vibeui-hero-025-fg);transform:translateY(-2px)}
[data-vibeui-block="hero-025"] [data-part="calendar"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="hero-025"] [data-part="primary"]:focus-visible,[data-vibeui-block="hero-025"] [data-part="calendar"]:focus-visible,[data-vibeui-block="hero-025"] [data-part="seal"]:focus-visible{outline:2px solid var(--vibeui-hero-025-accent);outline-offset:3px}
[data-vibeui-block="hero-025"] [data-part="photo"]{position:relative;justify-self:center;width:min(100%,24rem);margin:0}
[data-vibeui-block="hero-025"] [data-part="arch"]{display:block;aspect-ratio:4/5;border-radius:50% 50% 1.2rem 1.2rem / 38% 38% 1.2rem 1.2rem;overflow:hidden;background:var(--vibeui-hero-025-sand);box-shadow:0 30px 60px -30px rgb(43 26 36 / .45),0 0 0 .6rem color-mix(in oklab,var(--vibeui-hero-025-card) 60%,transparent),0 0 0 .65rem color-mix(in oklab,var(--vibeui-hero-025-accent) 25%,transparent)}
[data-vibeui-block="hero-025"] [data-part="arch"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(.98)}
[data-vibeui-block="hero-025"] [data-part="stamp"]{position:absolute;right:-1.4rem;bottom:1.4rem;width:8.2rem;height:8.2rem;margin:0;filter:drop-shadow(0 14px 24px rgb(43 26 36 / .35));transform:rotate(-12deg);animation:vibeui-hero-025-float 6s ease-in-out infinite}
[data-vibeui-block="hero-025"] [data-part="stamp"] svg{display:block;width:100%;height:100%;overflow:visible}
[data-vibeui-block="hero-025"] [data-part="stamp"] [data-ring]{fill:var(--vibeui-hero-025-card)}
[data-vibeui-block="hero-025"] [data-part="stamp"] [data-teeth]{fill:none;stroke:var(--vibeui-hero-025-card);stroke-width:7;stroke-dasharray:3 4.2;stroke-linecap:round}
[data-vibeui-block="hero-025"] [data-part="stamp"] [data-line]{fill:none;stroke:var(--vibeui-hero-025-accent);stroke-width:.8}
[data-vibeui-block="hero-025"] [data-part="stamp"] [data-round]{font-family:var(--vibeui-hero-025-font);font-size:7.2px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;fill:var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="stamp"] [data-day]{font-family:var(--vibeui-hero-025-display);font-size:34px;font-weight:500;fill:var(--vibeui-hero-025-plum);text-anchor:middle}
[data-vibeui-block="hero-025"] [data-part="stamp"] [data-year]{font-family:var(--vibeui-hero-025-display);font-style:italic;font-size:11px;letter-spacing:1px;fill:var(--vibeui-hero-025-plum);text-anchor:middle}
[data-vibeui-block="hero-025"] [data-part="stamp"] [data-heart]{fill:var(--vibeui-hero-025-accent)}
@keyframes vibeui-hero-025-float{0%,100%{transform:rotate(-12deg) translateY(0)}50%{transform:rotate(-9deg) translateY(-.4rem)}}
[data-vibeui-block="hero-025"] [data-part="letter"],[data-vibeui-block="hero-025"] [data-part="photo"]{animation:vibeui-hero-025-rise 1.2s cubic-bezier(.2,.9,.3,1) both}
[data-vibeui-block="hero-025"] [data-part="photo"]{animation-delay:.15s}
[data-vibeui-block="hero-025"][data-intro="true"] [data-part="letter"]{animation-delay:3.2s}
[data-vibeui-block="hero-025"][data-intro="true"] [data-part="photo"]{animation-delay:3.5s}
[data-vibeui-block="hero-025"][data-sealed="true"] [data-part="letter"],[data-vibeui-block="hero-025"][data-sealed="true"] [data-part="photo"]{animation:none;opacity:0}
@keyframes vibeui-hero-025-rise{from{opacity:0;transform:translateY(1.5rem)}}
[data-vibeui-block="hero-025"] [data-part="envelope"]{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:1.25rem;overflow:hidden;background:radial-gradient(70% 60% at 50% 42%,color-mix(in oklab,var(--vibeui-hero-025-night) 72%,var(--vibeui-hero-025-accent)) 0,var(--vibeui-hero-025-night) 58%,#140b11 100%);perspective:1600px;transition:opacity 1.8s ease 3.1s,visibility 0s 4.9s}
[data-vibeui-block="hero-025"] [data-part="envelope"]::before{content:"";position:absolute;inset:0;background-image:${GRAIN};opacity:.45;mix-blend-mode:screen;pointer-events:none}
[data-vibeui-block="hero-025"] [data-part="envelope"]::after{content:"";position:absolute;left:50%;top:50%;width:40rem;height:40rem;margin:-20rem 0 0 -20rem;border-radius:50%;background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-hero-025-accent) 34%,transparent),transparent 62%);filter:blur(24px);pointer-events:none;animation:vibeui-hero-025-glow 5s ease-in-out infinite}
@keyframes vibeui-hero-025-glow{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-025"] [data-part="bokeh"]{position:absolute;inset:0;pointer-events:none}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i{position:absolute;bottom:-4rem;width:.5rem;height:.5rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-hero-025-sand) 80%,#fff);filter:blur(1px);opacity:0;animation:vibeui-hero-025-rise-dot 11s linear infinite}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i:nth-child(1){left:8%;animation-delay:-1s;width:.35rem;height:.35rem}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i:nth-child(2){left:18%;animation-delay:-5s;animation-duration:14s}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i:nth-child(3){left:29%;animation-delay:-8s;width:.7rem;height:.7rem;filter:blur(2px)}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i:nth-child(4){left:41%;animation-delay:-3s;animation-duration:16s}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i:nth-child(5){left:57%;animation-delay:-9s;width:.3rem;height:.3rem}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i:nth-child(6){left:66%;animation-delay:-6s;animation-duration:13s;width:.8rem;height:.8rem;filter:blur(3px)}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i:nth-child(7){left:78%;animation-delay:-2s}
[data-vibeui-block="hero-025"] [data-part="bokeh"] i:nth-child(8){left:90%;animation-delay:-11s;animation-duration:17s;width:.4rem;height:.4rem}
@keyframes vibeui-hero-025-rise-dot{0%{transform:translateY(0);opacity:0}12%{opacity:.7}70%{opacity:.5}100%{transform:translateY(-60rem);opacity:0}}
[data-vibeui-block="hero-025"] [data-part="paper"]{position:relative;z-index:1;width:min(100%,34rem);aspect-ratio:3/2;animation:vibeui-hero-025-bob 6s ease-in-out infinite;transition:transform 1.4s cubic-bezier(.4,0,.2,1) 2.8s,opacity 1.2s 3s}
@keyframes vibeui-hero-025-bob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-.6rem) rotate(.6deg)}}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="paper"]{animation:none;transform:translateY(6rem) scale(.96);opacity:0}
[data-vibeui-block="hero-025"] [data-part="back"]{position:absolute;inset:0;z-index:0;border-radius:.7rem;background:linear-gradient(160deg,#efe6d6,#e3d6c0);box-shadow:0 50px 90px -30px rgb(0 0 0 / .75),0 0 0 1px rgb(255 255 255 / .05)}
[data-vibeui-block="hero-025"] [data-part="card"]{position:absolute;left:6%;right:6%;bottom:6%;height:86%;display:grid;align-content:center;justify-items:center;gap:.4rem;padding:1.5rem;border-radius:.5rem;background:linear-gradient(180deg,#fffaf3,#f7efe3);box-shadow:0 -14px 40px -24px rgb(43 26 36 / .6);text-align:center;z-index:1;transition:transform 1.6s cubic-bezier(.2,.9,.3,1) 1.3s,opacity 1.2s 3.1s}
[data-vibeui-block="hero-025"] [data-part="card"]::before{content:"";position:absolute;inset:.6rem;border:1px solid color-mix(in oklab,var(--vibeui-hero-025-accent) 35%,transparent);border-radius:.3rem;pointer-events:none}
[data-vibeui-block="hero-025"] [data-part="card"]::after{content:"";position:absolute;inset:.85rem;border:1px solid color-mix(in oklab,var(--vibeui-hero-025-accent) 18%,transparent);border-radius:.2rem;pointer-events:none}
[data-vibeui-block="hero-025"] [data-part="card"] small{font-family:var(--vibeui-hero-025-font);font-size:.62rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-hero-025-accent)}
[data-vibeui-block="hero-025"] [data-part="card"] span{font-family:var(--vibeui-hero-025-display);font-style:italic;font-size:clamp(1.5rem,4.2cqi,2.6rem);line-height:1.05;color:#4a1f36}
[data-vibeui-block="hero-025"] [data-part="card"] em{font-family:var(--vibeui-hero-025-display);font-style:normal;font-size:clamp(.95rem,2cqi,1.15rem);letter-spacing:.06em;color:#7a6a70}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="card"]{transform:translateY(-80%);opacity:0}
[data-vibeui-block="hero-025"] [data-part="fold"]{position:absolute;inset:0;z-index:2;border-radius:.7rem;pointer-events:none}
[data-vibeui-block="hero-025"] [data-part="fold"][data-side="left"]{background:linear-gradient(100deg,#f3ebdd,#e8dcc8);clip-path:polygon(0 0,50% 50%,0 100%)}
[data-vibeui-block="hero-025"] [data-part="fold"][data-side="right"]{background:linear-gradient(260deg,#f3ebdd,#e8dcc8);clip-path:polygon(100% 0,50% 50%,100% 100%)}
[data-vibeui-block="hero-025"] [data-part="fold"][data-side="bottom"]{background:linear-gradient(180deg,#f6efe2 0%,#ebe0cd 100%);clip-path:polygon(0 100%,50% 48%,100% 100%);box-shadow:inset 0 1px 0 rgb(255 255 255 / .7)}
[data-vibeui-block="hero-025"] [data-part="flap"]{position:absolute;left:0;right:0;top:0;height:54%;border-radius:.7rem .7rem 0 0;background:linear-gradient(180deg,#f1e8d9,#dfd2bb);clip-path:polygon(0 0,100% 0,50% 100%);z-index:3;transform-origin:top;transition:transform 1.3s cubic-bezier(.45,0,.2,1) .35s,z-index 0s 1s;backface-visibility:visible}
[data-vibeui-block="hero-025"] [data-part="flap"]::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(135deg,#4a1f36 0 .4rem,#3b172a .4rem .8rem);opacity:0;transition:opacity .3s .9s}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="flap"]{z-index:0;transform:rotateX(-178deg)}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="flap"]::after{opacity:1}
[data-vibeui-block="hero-025"] [data-part="seal"]{position:absolute;left:50%;top:52%;display:grid;place-items:center;width:5.8rem;height:5.8rem;margin:-2.9rem 0 0 -2.9rem;border:0;border-radius:47% 53% 50% 50% / 53% 47% 53% 47%;background:radial-gradient(circle at 34% 28%,color-mix(in oklab,var(--vibeui-hero-025-accent) 60%,#fff) 0,var(--vibeui-hero-025-accent) 36%,color-mix(in oklab,var(--vibeui-hero-025-accent) 66%,#000) 100%);color:var(--vibeui-hero-025-on-accent);font-family:var(--vibeui-hero-025-display);font-style:italic;font-size:1.7rem;letter-spacing:.02em;text-shadow:0 1px 0 rgb(0 0 0 / .35),0 -1px 0 rgb(255 255 255 / .18);cursor:pointer;z-index:4;transform:rotate(-6deg);box-shadow:0 14px 30px -10px rgb(0 0 0 / .75),0 0 46px -4px color-mix(in oklab,var(--vibeui-hero-025-accent) 80%,transparent),inset 0 0 0 .4rem rgb(255 255 255 / .1),inset 0 -.25rem .5rem rgb(0 0 0 / .18);animation:vibeui-hero-025-pulse 2.8s ease-in-out infinite;transition:transform .55s cubic-bezier(.2,.9,.3,1.4),opacity .5s}
[data-vibeui-block="hero-025"] [data-part="seal"]::before{content:"";position:absolute;inset:.55rem;border-radius:inherit;border:1px solid rgb(255 255 255 / .22);pointer-events:none}
@keyframes vibeui-hero-025-pulse{0%,100%{box-shadow:0 14px 30px -10px rgb(0 0 0 / .75),0 0 46px -4px color-mix(in oklab,var(--vibeui-hero-025-accent) 80%,transparent),inset 0 0 0 .4rem rgb(255 255 255 / .1),inset 0 -.25rem .5rem rgb(0 0 0 / .18)}50%{box-shadow:0 14px 30px -10px rgb(0 0 0 / .75),0 0 80px 8px color-mix(in oklab,var(--vibeui-hero-025-accent) 65%,transparent),inset 0 0 0 .4rem rgb(255 255 255 / .1),inset 0 -.25rem .5rem rgb(0 0 0 / .18)}}
[data-vibeui-block="hero-025"] [data-part="seal"]:hover{transform:rotate(2deg) scale(1.06)}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="seal"]{opacity:0;transform:scale(.4) rotate(20deg);pointer-events:none;animation:none}
[data-vibeui-block="hero-025"] [data-part="hint"]{position:absolute;left:0;right:0;bottom:-2.8rem;text-align:center;font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:#d9c5a5;animation:vibeui-hero-025-blink 2.4s ease-in-out infinite;transition:opacity .3s}
[data-vibeui-block="hero-025"] [data-part="envelope"][data-open="true"] [data-part="hint"]{opacity:0;animation:none}
@keyframes vibeui-hero-025-blink{0%,100%{opacity:.4}50%{opacity:1}}
@container (min-width:56rem){
[data-vibeui-block="hero-025"] [data-part="frame"]{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);align-items:center;padding:8.5rem 2.5rem 4rem;min-height:40rem}
[data-vibeui-block="hero-025"] [data-part="photo"]{justify-self:end;width:min(100%,28rem)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-025"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-025"] [data-part="envelope"]{display:none}[data-vibeui-block="hero-025"][data-sealed="true"] [data-part="letter"],[data-vibeui-block="hero-025"][data-sealed="true"] [data-part="photo"]{opacity:1}}`

const ZERO = ["00", "00", "00", "00"] as const

function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0")
}

function split(target: number, now: number): readonly [string, string, string, string] {
  const total = Math.max(0, Math.floor((target - now) / 1000))
  return [
    String(Math.floor(total / 86400)).padStart(2, "0"),
    pad(Math.floor((total % 86400) / 3600)),
    pad(Math.floor((total % 3600) / 60)),
    pad(total % 60),
  ]
}

function icsDate(value: Date): string {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

/** Первый экран свадебного приглашения: конверт с печатью, имена, дата, обратный отсчёт, «в календарь» и фото в арке. */
export function Hero025({
  names = "Василиса & Артём",
  eyebrow = "Приглашаем на свадьбу",
  date = "2027-09-05T15:00:00+03:00",
  dateLabel = "5 сентября 2027, суббота",
  place = "усадьба Марфино",
  lede = "Мы женимся и хотим отметить это с вами — камерно, под открытым небом, с длинным ужином и танцами до огней.",
  primaryLabel = "Подтвердить участие",
  primaryHref = "#rsvp",
  calendarLabel = "В календарь",
  calendarTitle = "Свадьба Василисы и Артёма",
  calendarLocation = "Усадьба Марфино, Московская область",
  image,
  imageAlt = "",
  stamp = "save the date",
  countdownLabels = ["дней", "часов", "минут", "секунд"],
  envelope = true,
  sealHint = "Нажмите на печать",
  envelopeLabel = "Дорогим гостям",
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Hero025Props) {
  const [open, setOpen] = useState(!envelope)
  const [ticks, setTicks] = useState<readonly [string, string, string, string]>(ZERO)
  const palette = {
    ...(accent ? { "--vibeui-hero-025-accent": accent } : null),
    ...(background ? { "--vibeui-hero-025-bg": background } : null),
    ...style,
  } as CSSProperties
  const [first, second] = names.split(/\s*&\s*/)
  const target = Date.parse(date)
  const stampId = useId().replace(/:/g, "")
  // Печать на фото: число и месяц крупно, год под ними — прямо из строки
  // ISO, без Date: так число одинаково на сервере и клиенте.
  const stampDay = Number.isNaN(target) ? "" : `${date.slice(8, 10)}.${date.slice(5, 7)}`
  const stampYear = Number.isNaN(target) ? "" : date.slice(0, 4)

  // Отсчёт тикает только на клиенте: на сервере время неизвестно, и
  // первый кадр показывает нули, чтобы разметка совпала.
  useEffect(() => {
    if (Number.isNaN(target)) return
    const tick = () => setTicks(split(target, Date.now()))
    const timer = window.setInterval(tick, 1000)
    const frame = window.requestAnimationFrame(tick)
    return () => {
      window.clearInterval(timer)
      window.cancelAnimationFrame(frame)
    }
  }, [target])

  function downloadCalendar() {
    if (Number.isNaN(target)) return
    const start = new Date(target)
    const end = new Date(target + 9 * 3600 * 1000)
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//VibeUI//Wedding//RU",
      "BEGIN:VEVENT",
      `UID:${target}@vibeui`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:${calendarTitle}`,
      `LOCATION:${calendarLocation}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n")
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "wedding.ics"
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-025" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-025" data-tone={tone === "auto" ? undefined : tone} data-sealed={open ? undefined : "true"} data-intro={envelope ? "true" : undefined} className={className} style={palette}>
        <div data-part="frame">
          <div data-part="letter">
            <p data-part="eyebrow">{eyebrow}</p>
            <h1 data-part="names">
              {first}
              <em>&amp;</em>
              {second}
            </h1>
            <p data-part="date">
              <span>{dateLabel}</span>
              <i aria-hidden="true" />
              <span>{place}</span>
            </p>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {Number.isNaN(target) ? null : (
              <ol data-part="countdown" aria-label={`${countdownLabels.join(", ")}`}>
                {ticks.map((value, index) => (
                  <li key={countdownLabels[index]}>
                    <b>{value}</b>
                    <span>{countdownLabels[index]}</span>
                  </li>
                ))}
              </ol>
            )}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {calendarLabel && !Number.isNaN(target) ? (
                <button type="button" data-part="calendar" onClick={downloadCalendar}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM4 10h16M8 3v4M16 3v4M12 13v5M9.5 15.5h5" />
                  </svg>
                  {calendarLabel}
                </button>
              ) : null}
            </div>
          </div>
          <figure data-part="photo">
            <span data-part="arch">{image ? <img src={image} alt={imageAlt} loading="eager" /> : null}</span>
            {stamp ? (
              <figcaption data-part="stamp">
                <svg viewBox="0 0 120 120" role="img" aria-label={`${stamp} — ${dateLabel}`}>
                  <defs>
                    <path id={`${stampId}-ring`} d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
                  </defs>
                  <circle data-teeth="" cx="60" cy="60" r="56" />
                  <circle data-ring="" cx="60" cy="60" r="54" />
                  <circle data-line="" cx="60" cy="60" r="51" />
                  <circle data-line="" cx="60" cy="60" r="37" />
                  <text data-round="">
                    <textPath href={`#${stampId}-ring`} startOffset="0">
                      {`${stamp} · ${stamp} · `}
                    </textPath>
                  </text>
                  <text data-day="" x="60" y="66">
                    {stampDay}
                  </text>
                  <text data-year="" x="60" y="82">
                    {stampYear}
                  </text>
                  <path data-heart="" transform="translate(56.5 38) scale(.34)" d="M12 21s-7.5-4.6-9.5-9A5.5 5.5 0 0 1 12 6.3 5.5 5.5 0 0 1 21.5 12c-2 4.4-9.5 9-9.5 9z" />
                </svg>
              </figcaption>
            ) : null}
          </figure>
        </div>
        {envelope ? (
          <div data-part="envelope" data-open={open ? "true" : undefined} aria-hidden={open}>
            <span data-part="bokeh" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
            <div data-part="paper">
              <div data-part="back" />
              <div data-part="card" aria-hidden="true">
                <small>{envelopeLabel}</small>
                <span>{names}</span>
                <em>{dateLabel}</em>
              </div>
              <div data-part="fold" data-side="left" />
              <div data-part="fold" data-side="right" />
              <div data-part="fold" data-side="bottom" />
              <div data-part="flap" />
              <button type="button" data-part="seal" aria-label={sealHint} onClick={() => setOpen(true)}>
                {first.charAt(0)}
                {second?.charAt(0)}
              </button>
              <span data-part="hint" aria-hidden="true">
                {sealHint}
              </span>
            </div>
          </div>
        ) : null}
      </section>
    </>
  )
}
