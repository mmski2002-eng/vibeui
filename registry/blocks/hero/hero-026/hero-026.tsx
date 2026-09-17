"use client"

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react"

export type Hero026Props = {
  /** Имена через « & »: «Соня & Тимур». */
  names?: string
  /** Рукописная строка под именами: «летят жениться». */
  script?: string
  eyebrow?: string
  /** Вылет в ISO: считает отсчёт и попадает в .ics и на талон. */
  date?: string
  dateLabel?: string
  place?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  calendarLabel?: string
  calendarTitle?: string
  calendarLocation?: string
  /** Фон на весь экран: пляж. */
  image?: string
  imageAlt?: string
  /** Фото пары — полароид на скотче. */
  photo?: string
  photoAlt?: string
  photoCaption?: string
  /** Надпись на штампе паспорта. */
  stamp?: string
  countdownCaption?: string
  countdownLabels?: readonly [string, string, string, string]
  /** Заставка — посадочный талон с отрывным корешком. */
  boardingPass?: boolean
  from?: string
  to?: string
  fromCity?: string
  toCity?: string
  /** Подписи талона: рейс, выход, место, класс. */
  passLabels?: { flight: string; gate: string; seat: string; cabin: string; tear: string }
  passValues?: { flight: string; gate: string; seat: string; cabin: string }
  tone?: "auto" | "light" | "dark"
  accent?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран свадьбы-путешествия: пляж на весь экран под тёплым
// градиентом, поверх — плакатный заголовок узким капсом и рукописная
// строка «летят жениться», даты и место, обратный отсчёт «до вылета» в
// стеклянных плитках, «Check-in» и «В календарь». Справа — полароид пары
// на скотче и круглый штамп паспорта. Поверх всего экрана — посадочный
// талон: перфорация, коды аэропортов, штрих-код; клик по корешку — он
// отрывается и улетает, талон уходит вверх, фон растворяется в пляж.
const FONTS = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Lobster&family=Manrope:wght@400;500;600;700&display=swap"

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .3 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const STYLES = `
:where([data-vibeui-block="hero-026"]){
--vibeui-hero-026-bg:light-dark(#fffaf0,#14202a);
--vibeui-hero-026-sand:light-dark(#f3e9d2,#1c2a34);
--vibeui-hero-026-fg:light-dark(#123a4b,#eef4f2);
--vibeui-hero-026-muted:light-dark(#5b6f78,#9fb2b8);
--vibeui-hero-026-line:light-dark(#e3d7bf,#2c3f4a);
--vibeui-hero-026-accent:#ff6b57;
--vibeui-hero-026-sea:#2aa7a0;
--vibeui-hero-026-sun:#f2c14e;
--vibeui-hero-026-ink:#123a4b;
--vibeui-hero-026-paper:#fffaf0;
--vibeui-hero-026-on-accent:#fffaf0;
--vibeui-hero-026-display:"Oswald","Arial Narrow",Impact,sans-serif;
--vibeui-hero-026-script:"Lobster","Brush Script MT",cursive;
--vibeui-hero-026-font:"Manrope",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-026"]{color-scheme:dark}
:where([data-vibeui-block="hero-026"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-026"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-026"]{box-sizing:border-box;position:relative;display:block;overflow:hidden;background:var(--vibeui-hero-026-sand);color:#fffaf0;font-family:var(--vibeui-hero-026-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-026"] *{box-sizing:border-box}
[data-vibeui-block="hero-026"] [data-part="bg"]{position:absolute;inset:0;background:var(--vibeui-hero-026-sand)}
[data-vibeui-block="hero-026"] [data-part="bg"] img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(1.05)}
[data-vibeui-block="hero-026"] [data-part="bg"]::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgb(18 58 75 / .55) 0%,rgb(18 58 75 / .25) 40%,rgb(18 58 75 / .7) 100%)}
[data-vibeui-block="hero-026"]::after{content:"";position:absolute;inset:0;background-image:${GRAIN};opacity:.25;mix-blend-mode:overlay;pointer-events:none}
[data-vibeui-block="hero-026"] [data-part="frame"]{position:relative;z-index:1;display:grid;gap:2.5rem;max-width:80rem;margin:0 auto;padding:7rem 1.25rem 3.5rem;min-height:38rem}
[data-vibeui-block="hero-026"] [data-part="eyebrow"]{margin:0 0 .8rem;font-family:var(--vibeui-hero-026-display);font-size:.85rem;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:var(--vibeui-hero-026-sun)}
[data-vibeui-block="hero-026"] [data-part="names"]{margin:0;font-family:var(--vibeui-hero-026-display);font-weight:700;font-size:clamp(3rem,10cqi,7.5rem);line-height:.92;letter-spacing:-.01em;text-transform:uppercase;text-shadow:0 10px 40px rgb(18 58 75 / .5)}
[data-vibeui-block="hero-026"] [data-part="names"] em{font-style:normal;color:var(--vibeui-hero-026-accent);margin:0 .06em}
[data-vibeui-block="hero-026"] [data-part="script"]{display:block;margin:.2rem 0 0 .1em;font-family:var(--vibeui-hero-026-script);font-size:clamp(1.8rem,5cqi,3.4rem);line-height:1;color:var(--vibeui-hero-026-sun);transform:rotate(-3deg);transform-origin:left}
[data-vibeui-block="hero-026"] [data-part="date"]{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin:1.6rem 0 0;font-family:var(--vibeui-hero-026-display);font-size:clamp(1.05rem,2.2cqi,1.35rem);font-weight:500;letter-spacing:.12em;text-transform:uppercase}
[data-vibeui-block="hero-026"] [data-part="date"] i{width:2rem;height:2px;background:var(--vibeui-hero-026-accent)}
[data-vibeui-block="hero-026"] [data-part="lede"]{max-width:32rem;margin:1rem 0 0;color:rgb(255 250 240 / .85)}
[data-vibeui-block="hero-026"] [data-part="countcap"]{margin:1.8rem 0 .5rem;font-size:.68rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgb(255 250 240 / .7)}
[data-vibeui-block="hero-026"] [data-part="countdown"]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.6rem;max-width:26rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="hero-026"] [data-part="countdown"] li{display:grid;justify-items:center;gap:.1rem;padding:.8rem .25rem;border:1px solid rgb(255 250 240 / .35);border-radius:.6rem;background:rgb(255 250 240 / .14);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 1px 0 rgb(255 255 255 / .35)}
[data-vibeui-block="hero-026"] [data-part="countdown"] b{font-family:var(--vibeui-hero-026-display);font-size:clamp(1.6rem,3.4cqi,2.4rem);font-weight:600;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-026"] [data-part="countdown"] span{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:rgb(255 250 240 / .7)}
[data-vibeui-block="hero-026"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.8rem}
[data-vibeui-block="hero-026"] [data-part="primary"],[data-vibeui-block="hero-026"] [data-part="calendar"]{display:inline-flex;align-items:center;gap:.5rem;height:3rem;padding:0 1.4rem;border-radius:.6rem;font-family:var(--vibeui-hero-026-display);font-size:.95rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;cursor:pointer;transition:transform .2s,background .25s,border-color .25s}
[data-vibeui-block="hero-026"] [data-part="primary"]{background:var(--vibeui-hero-026-accent);color:var(--vibeui-hero-026-on-accent);border:1px solid var(--vibeui-hero-026-accent);box-shadow:0 14px 30px -14px var(--vibeui-hero-026-accent)}
[data-vibeui-block="hero-026"] [data-part="primary"]:hover{transform:translateY(-2px);background:color-mix(in oklab,var(--vibeui-hero-026-accent) 88%,#000)}
[data-vibeui-block="hero-026"] [data-part="calendar"]{background:rgb(255 250 240 / .14);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fffaf0;border:1px solid rgb(255 250 240 / .4)}
[data-vibeui-block="hero-026"] [data-part="calendar"]:hover{border-color:#fffaf0;transform:translateY(-2px)}
[data-vibeui-block="hero-026"] [data-part="calendar"] svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
[data-vibeui-block="hero-026"] [data-part="primary"]:focus-visible,[data-vibeui-block="hero-026"] [data-part="calendar"]:focus-visible,[data-vibeui-block="hero-026"] [data-part="tear"]:focus-visible{outline:2px solid var(--vibeui-hero-026-sun);outline-offset:3px}
[data-vibeui-block="hero-026"] [data-part="side"]{position:relative;justify-self:center;width:min(100%,20rem)}
[data-vibeui-block="hero-026"] [data-part="polaroid"]{position:relative;margin:0;padding:.8rem .8rem 2.6rem;background:var(--vibeui-hero-026-paper);box-shadow:0 30px 60px -30px rgb(0 0 0 / .6);transform:rotate(3deg);transition:transform .4s cubic-bezier(.2,.9,.3,1.2)}
[data-vibeui-block="hero-026"] [data-part="polaroid"]:hover{transform:rotate(0) scale(1.02)}
[data-vibeui-block="hero-026"] [data-part="polaroid"]::before,[data-vibeui-block="hero-026"] [data-part="polaroid"]::after{content:"";position:absolute;top:-.6rem;width:5rem;height:1.4rem;background:rgb(255 255 255 / .55);box-shadow:0 1px 2px rgb(0 0 0 / .1);-webkit-backdrop-filter:blur(1px);backdrop-filter:blur(1px)}
[data-vibeui-block="hero-026"] [data-part="polaroid"]::before{left:-1.2rem;transform:rotate(-8deg)}
[data-vibeui-block="hero-026"] [data-part="polaroid"]::after{right:-1.2rem;transform:rotate(6deg)}
[data-vibeui-block="hero-026"] [data-part="polaroid"] span{display:block;aspect-ratio:4/5;overflow:hidden;background:var(--vibeui-hero-026-sand)}
[data-vibeui-block="hero-026"] [data-part="polaroid"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="hero-026"] [data-part="polaroid"] figcaption{position:absolute;left:0;right:0;bottom:.6rem;text-align:center;font-family:var(--vibeui-hero-026-script);font-size:1.25rem;color:var(--vibeui-hero-026-ink)}
[data-vibeui-block="hero-026"] [data-part="stamp"]{position:absolute;right:-1.6rem;bottom:-1.4rem;width:8rem;height:8rem;transform:rotate(-14deg);filter:drop-shadow(0 10px 18px rgb(0 0 0 / .35));animation:vibeui-hero-026-float 6s ease-in-out infinite}
@keyframes vibeui-hero-026-float{0%,100%{transform:rotate(-14deg) translateY(0)}50%{transform:rotate(-11deg) translateY(-.4rem)}}
[data-vibeui-block="hero-026"] [data-part="stamp"] svg{display:block;width:100%;height:100%;overflow:visible}
[data-vibeui-block="hero-026"] [data-part="stamp"] [data-ring]{fill:none;stroke:var(--vibeui-hero-026-accent);stroke-width:2.4}
[data-vibeui-block="hero-026"] [data-part="stamp"] [data-thin]{fill:none;stroke:var(--vibeui-hero-026-accent);stroke-width:.8}
[data-vibeui-block="hero-026"] [data-part="stamp"] [data-round]{font-family:var(--vibeui-hero-026-display);font-size:9px;font-weight:600;letter-spacing:2.2px;text-transform:uppercase;fill:var(--vibeui-hero-026-accent)}
[data-vibeui-block="hero-026"] [data-part="stamp"] [data-mid]{font-family:var(--vibeui-hero-026-display);font-size:19px;font-weight:700;letter-spacing:1px;fill:var(--vibeui-hero-026-accent);text-anchor:middle}
[data-vibeui-block="hero-026"] [data-part="stamp"] [data-small]{font-family:var(--vibeui-hero-026-font);font-size:8px;font-weight:600;letter-spacing:1.5px;fill:var(--vibeui-hero-026-accent);text-anchor:middle}
[data-vibeui-block="hero-026"] [data-part="stamp"] [data-plane]{fill:var(--vibeui-hero-026-accent)}
[data-vibeui-block="hero-026"] [data-part="letter"],[data-vibeui-block="hero-026"] [data-part="side"]{animation:vibeui-hero-026-rise 1.2s cubic-bezier(.2,.9,.3,1) both}
[data-vibeui-block="hero-026"] [data-part="side"]{animation-delay:.15s}
[data-vibeui-block="hero-026"][data-intro="true"] [data-part="letter"]{animation-delay:2.6s}
[data-vibeui-block="hero-026"][data-intro="true"] [data-part="side"]{animation-delay:2.9s}
[data-vibeui-block="hero-026"][data-sealed="true"] [data-part="letter"],[data-vibeui-block="hero-026"][data-sealed="true"] [data-part="side"]{animation:none;opacity:0}
@keyframes vibeui-hero-026-rise{from{opacity:0;transform:translateY(1.5rem)}}
[data-vibeui-block="hero-026"] [data-part="gate"]{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:1.25rem;overflow:hidden;background:radial-gradient(70% 60% at 50% 30%,#fff3d6 0,#f3e9d2 55%,#e6d6b3 100%);transition:opacity 1.2s ease 2.2s,visibility 0s 3.5s}
[data-vibeui-block="hero-026"] [data-part="gate"]::before{content:"";position:absolute;inset:0;background-image:${GRAIN};opacity:.5;mix-blend-mode:multiply;pointer-events:none}
[data-vibeui-block="hero-026"] [data-part="gate"]::after{content:"";position:absolute;left:50%;top:18%;width:34rem;height:34rem;margin-left:-17rem;border-radius:50%;background:radial-gradient(circle,rgb(242 193 78 / .55),transparent 62%);filter:blur(26px);pointer-events:none;animation:vibeui-hero-026-sun 6s ease-in-out infinite}
@keyframes vibeui-hero-026-sun{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
[data-vibeui-block="hero-026"] [data-part="gate"][data-open="true"]{opacity:0;visibility:hidden}
[data-vibeui-block="hero-026"] [data-part="float"]{position:relative;z-index:1;width:min(100%,40rem);animation:vibeui-hero-026-bob 6s ease-in-out infinite}
[data-vibeui-block="hero-026"] [data-part="pass"]{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) 9.5rem;color:var(--vibeui-hero-026-ink);filter:drop-shadow(0 40px 60px rgb(18 58 75 / .35));transition:transform 1.1s cubic-bezier(.4,0,.2,1) 1.1s,opacity .8s 1.6s}
@keyframes vibeui-hero-026-bob{0%,100%{transform:translateY(0) rotate(-.6deg)}50%{transform:translateY(-.5rem) rotate(.4deg)}}
[data-vibeui-block="hero-026"] [data-part="gate"][data-open="true"] [data-part="pass"]{transform:translateY(-6rem) rotate(-2deg);opacity:0}
[data-vibeui-block="hero-026"] [data-part="main"]{position:relative;padding:1.4rem 1.6rem 1.5rem;border-radius:.9rem 0 0 .9rem;background:var(--vibeui-hero-026-paper);background-image:linear-gradient(90deg,var(--vibeui-hero-026-sea) 0,var(--vibeui-hero-026-sea) .5rem,transparent .5rem)}
[data-vibeui-block="hero-026"] [data-part="main"]::after{content:"";position:absolute;top:0;bottom:0;right:-1px;width:2px;background:radial-gradient(circle,#e6d6b3 0 2px,transparent 2.5px) 0 0/2px 10px repeat-y}
[data-vibeui-block="hero-026"] [data-part="head"]{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0 0 .8rem .8rem;border-bottom:1px solid var(--vibeui-hero-026-line)}
[data-vibeui-block="hero-026"] [data-part="head"] b{font-family:var(--vibeui-hero-026-display);font-size:.8rem;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:var(--vibeui-hero-026-sea)}
[data-vibeui-block="hero-026"] [data-part="head"] span{font-family:var(--vibeui-hero-026-script);font-size:1.4rem;color:var(--vibeui-hero-026-accent)}
[data-vibeui-block="hero-026"] [data-part="route"]{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem;padding:1.1rem 0 .9rem .8rem}
[data-vibeui-block="hero-026"] [data-part="route"] div{display:grid;gap:.1rem}
[data-vibeui-block="hero-026"] [data-part="route"] div:last-child{text-align:right}
[data-vibeui-block="hero-026"] [data-part="route"] b{font-family:var(--vibeui-hero-026-display);font-size:clamp(2.2rem,7cqi,3.4rem);font-weight:700;line-height:1;letter-spacing:.02em}
[data-vibeui-block="hero-026"] [data-part="route"] small{font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-hero-026-muted)}
[data-vibeui-block="hero-026"] [data-part="route"] svg{width:2.2rem;height:2.2rem;fill:var(--vibeui-hero-026-accent);animation:vibeui-hero-026-plane 3s ease-in-out infinite}
@keyframes vibeui-hero-026-plane{0%,100%{transform:translateX(-.25rem)}50%{transform:translateX(.25rem)}}
[data-vibeui-block="hero-026"] [data-part="meta"]{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.6rem;margin:0;padding:.9rem 0 0 .8rem;border-top:1px solid var(--vibeui-hero-026-line)}
[data-vibeui-block="hero-026"] [data-part="meta"] div{display:grid;gap:.1rem}
[data-vibeui-block="hero-026"] [data-part="meta"] dt{font-size:.58rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-hero-026-muted)}
[data-vibeui-block="hero-026"] [data-part="meta"] dd{margin:0;font-family:var(--vibeui-hero-026-display);font-size:1.05rem;font-weight:600;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
[data-vibeui-block="hero-026"] [data-part="barcode"]{height:1.9rem;margin:1rem 0 0 .8rem;background:repeating-linear-gradient(90deg,var(--vibeui-hero-026-ink) 0 2px,transparent 2px 4px,var(--vibeui-hero-026-ink) 4px 5px,transparent 5px 8px,var(--vibeui-hero-026-ink) 8px 11px,transparent 11px 13px);opacity:.85}
[data-vibeui-block="hero-026"] [data-part="stub"]{position:relative;display:grid;grid-template-rows:auto 1fr auto;gap:.6rem;padding:1.4rem 1.1rem 1.2rem;border-radius:0 .9rem .9rem 0;background:var(--vibeui-hero-026-sun);color:var(--vibeui-hero-026-ink);transform-origin:left center;transition:transform 1s cubic-bezier(.4,0,.2,1) .05s,opacity .6s .5s}
[data-vibeui-block="hero-026"] [data-part="gate"][data-open="true"] [data-part="stub"]{transform:rotate(18deg) translate(3rem,6rem);opacity:0}
[data-vibeui-block="hero-026"] [data-part="stub"] b{font-family:var(--vibeui-hero-026-display);font-size:.72rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;opacity:.75}
[data-vibeui-block="hero-026"] [data-part="stub"] [data-part="codes"]{font-family:var(--vibeui-hero-026-display);font-size:1.4rem;font-weight:700;letter-spacing:.06em;line-height:1.1}
[data-vibeui-block="hero-026"] [data-part="stub"] [data-part="codes"] small{display:block;font-family:var(--vibeui-hero-026-font);font-size:.62rem;font-weight:600;letter-spacing:.14em;opacity:.7}
[data-vibeui-block="hero-026"] [data-part="tear"]{display:inline-flex;align-items:center;justify-content:center;gap:.4rem;height:2.6rem;padding:0 .9rem;border:2px dashed var(--vibeui-hero-026-ink);border-radius:.5rem;background:transparent;color:var(--vibeui-hero-026-ink);font-family:var(--vibeui-hero-026-display);font-size:.78rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;animation:vibeui-hero-026-blink 2.2s ease-in-out infinite;transition:background .25s,transform .2s}
[data-vibeui-block="hero-026"] [data-part="tear"]:hover{background:rgb(255 250 240 / .5);transform:translateY(-1px)}
@keyframes vibeui-hero-026-blink{0%,100%{box-shadow:0 0 0 0 rgb(18 58 75 / 0)}50%{box-shadow:0 0 0 .4rem rgb(18 58 75 / .12)}}
[data-vibeui-block="hero-026"] [data-part="tear"] svg{width:.9rem;height:.9rem;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
[data-vibeui-block="hero-026"] [data-part="hint"]{position:absolute;left:0;right:0;bottom:-2.6rem;text-align:center;font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-hero-026-muted);transition:opacity .3s}
[data-vibeui-block="hero-026"] [data-part="gate"][data-open="true"] [data-part="hint"]{opacity:0}
@container (max-width:36rem){
[data-vibeui-block="hero-026"] [data-part="pass"]{grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="hero-026"] [data-part="main"]{padding:1.2rem 1.1rem 1.2rem 1.3rem;border-radius:.9rem .9rem 0 0}
[data-vibeui-block="hero-026"] [data-part="main"]::after{top:auto;right:0;left:0;bottom:-1px;width:auto;height:2px;background:radial-gradient(circle,#e6d6b3 0 2px,transparent 2.5px) 0 0/10px 2px repeat-x}
[data-vibeui-block="hero-026"] [data-part="head"] span{font-size:1.15rem}
[data-vibeui-block="hero-026"] [data-part="route"] b{font-size:2.4rem}
[data-vibeui-block="hero-026"] [data-part="meta"]{grid-template-columns:repeat(2,minmax(0,1fr))}
[data-vibeui-block="hero-026"] [data-part="stub"]{grid-template-rows:none;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"date tear" "codes tear";align-items:center;gap:.2rem 1rem;padding:1rem 1.1rem;border-radius:0 0 .9rem .9rem;transform-origin:center top}
[data-vibeui-block="hero-026"] [data-part="stub"] > b{grid-area:date}
[data-vibeui-block="hero-026"] [data-part="stub"] [data-part="codes"]{grid-area:codes;white-space:nowrap}
[data-vibeui-block="hero-026"] [data-part="tear"]{grid-area:tear}
[data-vibeui-block="hero-026"] [data-part="gate"][data-open="true"] [data-part="stub"]{transform:rotate(-8deg) translate(-2rem,5rem)}
}
@container (min-width:56rem){
[data-vibeui-block="hero-026"] [data-part="frame"]{grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);align-items:center;padding:9rem 2.5rem 4.5rem;min-height:42rem}
[data-vibeui-block="hero-026"] [data-part="side"]{justify-self:end;width:min(100%,22rem)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-026"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-026"] [data-part="gate"]{display:none}[data-vibeui-block="hero-026"][data-sealed="true"] [data-part="letter"],[data-vibeui-block="hero-026"][data-sealed="true"] [data-part="side"]{opacity:1}}`

const ZERO = ["00", "00", "00", "00"] as const

function subscribeNoop() {
  return () => {}
}

// Во вложенном кадре (витрина, превью) талон не показываем: кликнуть по
// нему там нельзя, а страницу за ним — не увидеть.
function readEmbedded(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0")
}

function split(target: number, now: number): readonly [string, string, string, string] {
  const total = Math.max(0, Math.floor((target - now) / 1000))
  return [String(Math.floor(total / 86400)).padStart(2, "0"), pad(Math.floor((total % 86400) / 3600)), pad(Math.floor((total % 3600) / 60)), pad(total % 60)]
}

function icsDate(value: Date): string {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
}

/** Первый экран свадьбы-путешествия: посадочный талон с отрывным корешком, пляж на весь экран, плакатные имена, отсчёт «до вылета», полароид и штамп паспорта. */
export function Hero026({
  names = "Соня & Тимур",
  script = "летят жениться",
  eyebrow = "Три дня на Кубе",
  date = "2027-02-12T09:40:00+03:00",
  dateLabel = "12–14 февраля 2027",
  place = "Кайо-Ларго · Гавана",
  lede = "Вместо загса — рейс. Церемония на пляже, ужин под пальмами, сон-кубано до утра. Летите с нами.",
  primaryLabel = "Check-in",
  primaryHref = "#checkin",
  calendarLabel = "В календарь",
  calendarTitle = "Свадьба Сони и Тимура на Кубе",
  calendarLocation = "Playa Paraíso, Cayo Largo, Cuba",
  image,
  imageAlt = "",
  photo,
  photoAlt = "",
  photoCaption = "Havana, 2025",
  stamp = "Havana",
  countdownCaption = "До вылета",
  countdownLabels = ["дней", "часов", "минут", "секунд"],
  boardingPass = true,
  from = "SVO",
  to = "HAV",
  fromCity = "Москва",
  toCity = "Гавана",
  passLabels = { flight: "Рейс", gate: "Выход", seat: "Место", cabin: "Класс", tear: "Оторвать корешок" },
  passValues = { flight: "ST 1402", gate: "Пляж", seat: "Первый ряд", cabin: "Любовь" },
  tone = "auto",
  accent,
  background,
  className,
  style,
}: Hero026Props) {
  const embedded = useSyncExternalStore(subscribeNoop, readEmbedded, () => false)
  const intro = boardingPass && !embedded
  const [open, setOpen] = useState(!boardingPass)
  const opened = open || !intro
  const [ticks, setTicks] = useState<readonly [string, string, string, string]>(ZERO)
  const palette = {
    ...(accent ? { "--vibeui-hero-026-accent": accent } : null),
    ...(background ? { "--vibeui-hero-026-sand": background } : null),
    ...style,
  } as CSSProperties
  const [first, second] = names.split(/\s*&\s*/)
  const target = Date.parse(date)
  const stampDate = Number.isNaN(target) ? "" : `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`
  const passDate = Number.isNaN(target) ? "" : `${date.slice(8, 10)}.${date.slice(5, 7)}`

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
    const end = new Date(target + 3 * 86400 * 1000)
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//VibeUI//Wedding//RU", "BEGIN:VEVENT", `UID:${target}@vibeui`, `DTSTAMP:${icsDate(new Date())}`, `DTSTART:${icsDate(start)}`, `DTEND:${icsDate(end)}`, `SUMMARY:${calendarTitle}`, `LOCATION:${calendarLocation}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n")
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
      <style href="vibeui-hero-026" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-026" data-tone={tone === "auto" ? undefined : tone} data-sealed={opened ? undefined : "true"} data-intro={intro ? "true" : undefined} className={className} style={palette}>
        <div data-part="bg" aria-hidden="true">
          {image ? <img src={image} alt={imageAlt} loading="eager" /> : null}
        </div>
        <div data-part="frame">
          <div data-part="letter">
            <p data-part="eyebrow">{eyebrow}</p>
            <h1 data-part="names">
              {first}
              <em>&amp;</em>
              {second}
              {script ? <span data-part="script">{script}</span> : null}
            </h1>
            <p data-part="date">
              <span>{dateLabel}</span>
              <i aria-hidden="true" />
              <span>{place}</span>
            </p>
            {lede ? <p data-part="lede">{lede}</p> : null}
            {Number.isNaN(target) ? null : (
              <>
                <p data-part="countcap">{countdownCaption}</p>
                <ol data-part="countdown" aria-label={countdownLabels.join(", ")}>
                  {ticks.map((value, index) => (
                    <li key={countdownLabels[index]}>
                      <b>{value}</b>
                      <span>{countdownLabels[index]}</span>
                    </li>
                  ))}
                </ol>
              </>
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
          <div data-part="side">
            <figure data-part="polaroid">
              <span>{photo ? <img src={photo} alt={photoAlt} loading="eager" /> : null}</span>
              {photoCaption ? <figcaption>{photoCaption}</figcaption> : null}
            </figure>
            {stamp ? (
              <div data-part="stamp" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <defs>
                    <path id="vibeui-hero-026-arc" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
                  </defs>
                  <circle data-ring="" cx="60" cy="60" r="56" />
                  <circle data-thin="" cx="60" cy="60" r="52" />
                  <circle data-thin="" cx="60" cy="60" r="34" />
                  <text data-round="">
                    <textPath href="#vibeui-hero-026-arc" startOffset="2">
                      {`${stamp} · ${to} · ${stamp} · ${to} ·`}
                    </textPath>
                  </text>
                  <path data-plane="" transform="translate(52 34) scale(.7)" d="M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z" />
                  <text data-mid="" x="60" y="70">
                    {passDate}
                  </text>
                  <text data-small="" x="60" y="84">
                    {stampDate.slice(-4)}
                  </text>
                </svg>
              </div>
            ) : null}
          </div>
        </div>
        {intro ? (
          <div data-part="gate" data-open={open ? "true" : undefined} aria-hidden={open}>
            <div data-part="float">
              <div data-part="pass">
              <div data-part="main">
                <div data-part="head">
                  <b>Boarding pass</b>
                  <span>{names}</span>
                </div>
                <div data-part="route">
                  <div>
                    <b>{from}</b>
                    <small>{fromCity}</small>
                  </div>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 12.5c0 .6-.5 1-1.1 1L13 12.9 9.5 20H7.6l1.7-7.4-4.6-.6-1.7 2H1.6l1.2-3.5L1.6 7.1H3l1.7 2 4.6-.6L7.6 1h1.9L13 8.1l6.9-.6c.6 0 1.1.4 1.1 1v4z" />
                  </svg>
                  <div>
                    <b>{to}</b>
                    <small>{toCity}</small>
                  </div>
                </div>
                <dl data-part="meta">
                  <div>
                    <dt>{passLabels.flight}</dt>
                    <dd>{passValues.flight}</dd>
                  </div>
                  <div>
                    <dt>{passLabels.gate}</dt>
                    <dd>{passValues.gate}</dd>
                  </div>
                  <div>
                    <dt>{passLabels.seat}</dt>
                    <dd>{passValues.seat}</dd>
                  </div>
                  <div>
                    <dt>{passLabels.cabin}</dt>
                    <dd>{passValues.cabin}</dd>
                  </div>
                </dl>
                <div data-part="barcode" aria-hidden="true" />
              </div>
              <div data-part="stub">
                <b>{passDate}</b>
                <span data-part="codes">
                  {from} → {to}
                  <small>{passValues.flight}</small>
                </span>
                <button type="button" data-part="tear" onClick={() => setOpen(true)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM20 4L8.1 15.9M14.5 9.5L20 20M8.1 8.1L12 12" />
                  </svg>
                  {passLabels.tear}
                </button>
              </div>
              </div>
              <span data-part="hint" aria-hidden="true">
                {passLabels.tear}
              </span>
            </div>
          </div>
        ) : null}
      </section>
    </>
  )
}
