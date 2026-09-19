"use client"

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react"

export type Hero035PetKey = "cat" | "dog" | "rabbit"

export type Hero035Pet = {
  key: Hero035PetKey
  label: string
  eyebrow: string
  /** Слово в *звёздочках* красится в акцент. */
  title: string
  lede: string
  /** Реплика в пузыре у морды. */
  bubble: string
}

export type Hero035Stat = {
  value: number
  suffix?: string
  label: string
}

export type Hero035Props = {
  pets?: readonly Hero035Pet[]
  defaultPet?: Hero035PetKey
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  stats?: readonly Hero035Stat[]
  /** Имя события, которое летит в window при смене питомца: другие блоки могут подхватить. */
  eventName?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Хиро ветклиники: справа морда питомца, собранная из CSS-фигур — голова,
// уши, глаза, нос, усы. Зрачки следят за курсором по всему первому экрану
// (unitless --ex/--ey от −1 до 1 через ref, без ререндеров), ухо дёргается
// по наведению, глаза моргают. Переключатель «кот / собака / кролик» меняет
// форму ушей, окрас, зрачки, реплику в пузыре и тексты слева; наружу летит
// CustomEvent, чтобы прайс переключился вслед. Внизу счётчики докручиваются,
// когда попадают в viewport.
const FONTS = "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Golos+Text:wght@400;500;600&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-035"]){
--vibeui-hero-035-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-035-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-035-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-035-on-accent:oklch(from var(--vibeui-hero-035-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-035-muted:color-mix(in oklab,var(--vibeui-hero-035-fg) 62%,var(--vibeui-hero-035-bg));
--vibeui-hero-035-line:color-mix(in oklab,var(--vibeui-hero-035-fg) 12%,transparent);
--vibeui-hero-035-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-hero-035-bg) 88%,#fff));
--vibeui-hero-035-leaf:#4f8f45;
--vibeui-hero-035-pink:#f2a49b;
--vibeui-hero-035-cat:#c9bfb2;
--vibeui-hero-035-cat-ear:#b3a698;
--vibeui-hero-035-dog:#d9a15f;
--vibeui-hero-035-dog-ear:#a86f36;
--vibeui-hero-035-rabbit:#efe6da;
--vibeui-hero-035-rabbit-ear:#e4d6c6;
--vibeui-hero-035-eye:#2b241f;
--vibeui-hero-035-display:"Nunito",ui-rounded,ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-035-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-035"]{color-scheme:dark}
:where([data-vibeui-block="hero-035"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-035"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-035"]{box-sizing:border-box;position:relative;overflow:hidden;padding:3rem 0 4rem;background:var(--vibeui-hero-035-bg);color:var(--vibeui-hero-035-fg);font-family:var(--vibeui-hero-035-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-035"] *{box-sizing:border-box}
[data-vibeui-block="hero-035"] [data-part="blob"]{position:absolute;z-index:0;border-radius:50%;filter:blur(60px);opacity:.35;pointer-events:none;animation:vibeui-hero-035-float 16s ease-in-out infinite alternate}
[data-vibeui-block="hero-035"] [data-part="blob"]:nth-of-type(1){width:34rem;height:34rem;right:-10rem;top:-12rem;background:var(--vibeui-hero-035-accent)}
[data-vibeui-block="hero-035"] [data-part="blob"]:nth-of-type(2){width:26rem;height:26rem;left:-8rem;bottom:-10rem;background:var(--vibeui-hero-035-leaf);animation-delay:-7s}
[data-vibeui-block="hero-035"] [data-part="mark"]{position:absolute;z-index:0;width:3.2rem;height:3.2rem;color:var(--vibeui-hero-035-fg);opacity:.07;pointer-events:none}
[data-vibeui-block="hero-035"] [data-part="shell"]{position:relative;z-index:1;max-width:80rem;margin:0 auto;padding:0 1.25rem;display:grid;gap:2.5rem;align-items:center}
[data-vibeui-block="hero-035"] [data-part="switch"]{display:inline-grid;grid-auto-flow:column;grid-auto-columns:1fr;position:relative;padding:.3rem;border-radius:999px;background:var(--vibeui-hero-035-card);border:1px solid var(--vibeui-hero-035-line);box-shadow:0 10px 30px -18px rgb(0 0 0 / .35);isolation:isolate}
[data-vibeui-block="hero-035"] [data-part="switch"]::before{content:"";position:absolute;z-index:-1;top:.3rem;bottom:.3rem;left:.3rem;width:calc((100% - .6rem) / var(--vibeui-hero-035-n));border-radius:999px;background:var(--vibeui-hero-035-accent);transform:translateX(calc(var(--vibeui-hero-035-i) * 100%));transition:transform .35s cubic-bezier(.34,1.4,.64,1)}
[data-vibeui-block="hero-035"] [data-part="switch"] button{padding:.55rem 1.1rem;border:0;border-radius:999px;background:transparent;color:var(--vibeui-hero-035-muted);font-family:var(--vibeui-hero-035-display);font-weight:800;font-size:.92rem;cursor:pointer;white-space:nowrap;transition:color .25s}
[data-vibeui-block="hero-035"] [data-part="switch"] button[aria-pressed="true"]{color:var(--vibeui-hero-035-on-accent)}
[data-vibeui-block="hero-035"] [data-part="switch"] button:focus-visible{outline:2px solid var(--vibeui-hero-035-accent);outline-offset:2px}
[data-vibeui-block="hero-035"] [data-part="eyebrow"]{margin:1.6rem 0 .8rem;font-weight:600;font-size:.85rem;letter-spacing:.02em;color:var(--vibeui-hero-035-leaf)}
[data-vibeui-block="hero-035"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-035-display);font-weight:900;font-size:clamp(2.5rem,6.4cqi,5.2rem);line-height:.98;letter-spacing:-.03em;animation:vibeui-hero-035-rise .5s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-035"] [data-part="title"] em{font-style:normal;color:var(--vibeui-hero-035-accent);position:relative;white-space:nowrap}
[data-vibeui-block="hero-035"] [data-part="title"] em::after{content:"";position:absolute;left:0;right:0;bottom:-.05em;height:.18em;border-radius:1em;background:color-mix(in oklab,var(--vibeui-hero-035-accent) 25%,transparent);z-index:-1}
[data-vibeui-block="hero-035"] [data-part="lede"]{margin:1.2rem 0 0;max-width:32rem;font-size:1.08rem;color:var(--vibeui-hero-035-muted);animation:vibeui-hero-035-rise .5s .08s cubic-bezier(.2,.8,.2,1) both}
[data-vibeui-block="hero-035"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:.7rem;margin:1.8rem 0 0}
[data-vibeui-block="hero-035"] [data-part="primary"],[data-vibeui-block="hero-035"] [data-part="secondary"]{display:inline-flex;align-items:center;gap:.5rem;padding:.9rem 1.4rem;border-radius:999px;font-family:var(--vibeui-hero-035-display);font-weight:800;font-size:1rem;text-decoration:none;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,background .2s}
[data-vibeui-block="hero-035"] [data-part="primary"]{background:var(--vibeui-hero-035-accent);color:var(--vibeui-hero-035-on-accent)}
[data-vibeui-block="hero-035"] [data-part="primary"]:hover{transform:translateY(-2px) rotate(-1deg);box-shadow:0 14px 30px -12px var(--vibeui-hero-035-accent)}
[data-vibeui-block="hero-035"] [data-part="secondary"]{color:var(--vibeui-hero-035-fg);border:1px solid var(--vibeui-hero-035-line);background:var(--vibeui-hero-035-card)}
[data-vibeui-block="hero-035"] [data-part="secondary"]:hover{transform:translateY(-2px) rotate(1deg)}
[data-vibeui-block="hero-035"] [data-part="secondary"] svg{width:1rem;height:1rem;color:var(--vibeui-hero-035-accent)}
[data-vibeui-block="hero-035"] a:focus-visible{outline:2px solid var(--vibeui-hero-035-accent);outline-offset:2px}
[data-vibeui-block="hero-035"] [data-part="stats"]{display:flex;flex-wrap:wrap;gap:1.2rem 2.2rem;margin:2.4rem 0 0;padding:0;list-style:none}
[data-vibeui-block="hero-035"] [data-part="stats"] b{display:block;font-family:var(--vibeui-hero-035-display);font-weight:900;font-size:1.9rem;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-035"] [data-part="stats"] span{display:block;margin-top:.25rem;font-size:.82rem;color:var(--vibeui-hero-035-muted)}
[data-vibeui-block="hero-035"] [data-part="stage"]{position:relative;width:min(100%,26rem);margin:0 auto}
[data-vibeui-block="hero-035"] [data-part="bubble"]{position:absolute;z-index:3;top:-.4rem;right:-.2rem;max-width:12rem;padding:.7rem 1rem;border-radius:1.2rem 1.2rem 1.2rem .3rem;background:var(--vibeui-hero-035-card);border:1px solid var(--vibeui-hero-035-line);box-shadow:0 14px 30px -18px rgb(0 0 0 / .35);font-family:var(--vibeui-hero-035-display);font-weight:800;font-size:.92rem;line-height:1.3;transform-origin:bottom left;animation:vibeui-hero-035-pop .45s cubic-bezier(.34,1.56,.64,1) both}
[data-vibeui-block="hero-035"] [data-part="face"]{position:relative;width:100%;aspect-ratio:1;container-type:inline-size;--vibeui-hero-035-ex:0;--vibeui-hero-035-ey:0;--vibeui-hero-035-fur:var(--vibeui-hero-035-cat)}
[data-vibeui-block="hero-035"] [data-part="face"] > *{position:absolute;transition:all .55s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="hero-035"] [data-part="ear"]{top:2cqi;width:26cqi;height:32cqi;z-index:1;transform-origin:50% 100%;transform:rotate(var(--vibeui-hero-035-rot));cursor:pointer}
[data-vibeui-block="hero-035"] [data-part="ear"][data-side="l"]{left:8cqi;--vibeui-hero-035-rot:-14deg}
[data-vibeui-block="hero-035"] [data-part="ear"][data-side="r"]{right:8cqi;--vibeui-hero-035-rot:14deg}
[data-vibeui-block="hero-035"] [data-part="ear"]::after{content:"";position:absolute;inset:38% 28% 6%;background:var(--vibeui-hero-035-pink);clip-path:inherit;border-radius:inherit;opacity:.85;transition:inherit}
[data-vibeui-block="hero-035"] [data-part="ear"]:hover{animation:vibeui-hero-035-twitch .6s ease-in-out}
[data-vibeui-block="hero-035"] [data-part="head"]{inset:14cqi 6cqi 4cqi;z-index:2;background:var(--vibeui-hero-035-fur);border-radius:48% 48% 46% 46% / 50% 50% 46% 46%;box-shadow:inset -14cqi -10cqi 26cqi -20cqi rgb(0 0 0 / .18),0 30px 60px -30px rgb(0 0 0 / .35)}
[data-vibeui-block="hero-035"] [data-part="muzzle"]{z-index:3;left:50%;top:56cqi;width:34cqi;height:26cqi;margin-left:-17cqi;border-radius:50%;background:color-mix(in oklab,#fff 45%,transparent);opacity:0;transform:scale(.6)}
[data-vibeui-block="hero-035"] [data-part="cheek"]{z-index:3;top:57cqi;width:10cqi;height:7cqi;border-radius:50%;background:var(--vibeui-hero-035-pink);opacity:.55;filter:blur(2px)}
[data-vibeui-block="hero-035"] [data-part="cheek"][data-side="l"]{left:14cqi}
[data-vibeui-block="hero-035"] [data-part="cheek"][data-side="r"]{right:14cqi}
[data-vibeui-block="hero-035"] [data-part="eye"]{z-index:4;top:38cqi;width:14cqi;height:16cqi;border-radius:50%;background:#fff;overflow:hidden;box-shadow:inset 0 3px 6px rgb(0 0 0 / .12)}
[data-vibeui-block="hero-035"] [data-part="eye"][data-side="l"]{left:26cqi}
[data-vibeui-block="hero-035"] [data-part="eye"][data-side="r"]{right:26cqi}
[data-vibeui-block="hero-035"] [data-part="pupil"]{position:absolute;left:24%;top:24%;width:52%;height:52%;border-radius:50%;background:var(--vibeui-hero-035-eye);transform:translate(calc(var(--vibeui-hero-035-ex) * 36%),calc(var(--vibeui-hero-035-ey) * 34%));transition:transform .15s ease-out,width .5s,height .5s,left .5s,top .5s}
[data-vibeui-block="hero-035"] [data-part="pupil"]::after{content:"";position:absolute;left:18%;top:14%;width:30%;height:30%;border-radius:50%;background:#fff;opacity:.9}
[data-vibeui-block="hero-035"] [data-part="lid"]{position:absolute;inset:-2px;background:var(--vibeui-hero-035-fur);transform:scaleY(0);transform-origin:50% 0;animation:vibeui-hero-035-blink 5.5s ease-in-out infinite}
[data-vibeui-block="hero-035"] [data-part="eye"][data-side="r"] [data-part="lid"]{animation-delay:.05s}
[data-vibeui-block="hero-035"] [data-part="nose"]{z-index:5;left:50%;top:60cqi;width:8cqi;height:6cqi;margin-left:-4cqi;background:var(--vibeui-hero-035-pink);clip-path:polygon(0 0,100% 0,50% 100%);border-radius:0}
[data-vibeui-block="hero-035"] [data-part="mouth"]{z-index:5;left:50%;top:65cqi;width:16cqi;height:8cqi;margin-left:-8cqi}
[data-vibeui-block="hero-035"] [data-part="mouth"]::before,[data-vibeui-block="hero-035"] [data-part="mouth"]::after{content:"";position:absolute;top:0;width:50%;height:100%;border:2.5px solid var(--vibeui-hero-035-eye);border-top:0;border-radius:0 0 50% 50% / 0 0 100% 100%;transition:all .55s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="hero-035"] [data-part="mouth"]::before{left:0;border-right:0}
[data-vibeui-block="hero-035"] [data-part="mouth"]::after{right:0;border-left:0}
[data-vibeui-block="hero-035"] [data-part="tongue"]{z-index:4;left:50%;top:70cqi;width:9cqi;height:10cqi;margin-left:-4.5cqi;border-radius:40% 40% 50% 50% / 30% 30% 50% 50%;background:var(--vibeui-hero-035-pink);transform:scaleY(0);transform-origin:50% 0}
[data-vibeui-block="hero-035"] [data-part="teeth"]{z-index:6;left:50%;top:69cqi;width:8cqi;height:6cqi;margin-left:-4cqi;display:flex;gap:.6cqi;opacity:0;transform:translateY(-40%)}
[data-vibeui-block="hero-035"] [data-part="teeth"] i{flex:1;background:#fff;border-radius:0 0 1cqi 1cqi;box-shadow:inset 0 -1px 0 rgb(0 0 0 / .15)}
[data-vibeui-block="hero-035"] [data-part="whiskers"]{z-index:5;inset:0;pointer-events:none}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i{position:absolute;top:63cqi;width:22cqi;height:2px;border-radius:2px;background:var(--vibeui-hero-035-eye);opacity:.55;transition:transform .55s cubic-bezier(.2,.8,.2,1),opacity .4s}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i:nth-child(-n+3){left:4cqi;transform-origin:100% 50%}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i:nth-child(n+4){right:4cqi;transform-origin:0 50%}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i:nth-child(1){transform:rotate(12deg)}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i:nth-child(2){transform:rotate(0deg)}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i:nth-child(3){transform:rotate(-12deg)}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i:nth-child(4){transform:rotate(-12deg)}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i:nth-child(5){transform:rotate(0deg)}
[data-vibeui-block="hero-035"] [data-part="whiskers"] i:nth-child(6){transform:rotate(12deg)}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="cat"]{--vibeui-hero-035-fur:var(--vibeui-hero-035-cat)}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="cat"] [data-part="ear"]{background:var(--vibeui-hero-035-cat-ear);clip-path:polygon(50% 0,100% 100%,0 100%)}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="cat"] [data-part="pupil"]{left:35%;top:12%;width:30%;height:76%}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"]{--vibeui-hero-035-fur:var(--vibeui-hero-035-dog)}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="head"]{border-radius:46% 46% 48% 48% / 48% 48% 50% 50%}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="ear"]{top:16cqi;width:19cqi;height:40cqi;z-index:3;background:var(--vibeui-hero-035-dog-ear);border-radius:45% 45% 50% 50% / 25% 25% 50% 50%;clip-path:none;transform-origin:50% 8%}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="ear"][data-side="l"]{left:2cqi;--vibeui-hero-035-rot:10deg}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="ear"][data-side="r"]{right:2cqi;--vibeui-hero-035-rot:-10deg}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="ear"]::after{opacity:0}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="muzzle"]{opacity:1;transform:scale(1)}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="nose"]{width:12cqi;height:9cqi;margin-left:-6cqi;top:58cqi;background:var(--vibeui-hero-035-eye);clip-path:none;border-radius:50% 50% 55% 55% / 45% 45% 60% 60%}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="mouth"]{width:22cqi;margin-left:-11cqi;top:66cqi;height:7cqi}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="tongue"]{transform:scaleY(1);animation:vibeui-hero-035-pant 1.1s ease-in-out infinite}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="whiskers"] i{opacity:0;transform:scaleX(0)}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="dog"] [data-part="cheek"]{opacity:0}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"]{--vibeui-hero-035-fur:var(--vibeui-hero-035-rabbit)}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="head"]{inset:20cqi 8cqi 4cqi;border-radius:50% 50% 46% 46% / 52% 52% 46% 46%}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="ear"]{top:-12cqi;width:17cqi;height:46cqi;background:var(--vibeui-hero-035-rabbit-ear);border-radius:50%;clip-path:none}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="ear"][data-side="l"]{left:22cqi;--vibeui-hero-035-rot:-9deg}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="ear"][data-side="r"]{right:22cqi;--vibeui-hero-035-rot:9deg}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="ear"]::after{inset:14% 30% 22%;border-radius:50%}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="eye"]{top:42cqi;width:11cqi;height:13cqi}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="eye"][data-side="l"]{left:29cqi}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="eye"][data-side="r"]{right:29cqi}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="nose"]{width:6cqi;height:4.5cqi;margin-left:-3cqi;top:62cqi;clip-path:polygon(0 0,100% 0,50% 100%);border-radius:0}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="mouth"]{width:12cqi;margin-left:-6cqi;top:66cqi;height:5cqi}
[data-vibeui-block="hero-035"] [data-part="face"][data-pet="rabbit"] [data-part="teeth"]{opacity:1;transform:translateY(0)}
@keyframes vibeui-hero-035-float{from{transform:translate(0,0)}to{transform:translate(6%,10%) scale(1.1)}}
@keyframes vibeui-hero-035-rise{from{opacity:0;transform:translateY(14px)}}
@keyframes vibeui-hero-035-pop{from{opacity:0;transform:scale(.6) rotate(-6deg)}}
@keyframes vibeui-hero-035-blink{0%,93%,100%{transform:scaleY(0)}96.5%{transform:scaleY(1)}}
@keyframes vibeui-hero-035-twitch{0%,100%{transform:rotate(var(--vibeui-hero-035-rot))}30%{transform:rotate(calc(var(--vibeui-hero-035-rot) - 14deg))}60%{transform:rotate(calc(var(--vibeui-hero-035-rot) + 7deg))}}
@keyframes vibeui-hero-035-pant{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.82)}}
@container (min-width: 60rem){[data-vibeui-block="hero-035"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:3rem}[data-vibeui-block="hero-035"] [data-part="stage"]{width:min(100%,30rem)}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-035"] *{animation:none!important;transition:none!important}}`

const DEFAULT_PETS: Hero035Pet[] = [
  { key: "cat", label: "Кот", eyebrow: "Ветклиника и груминг на Соколе · 24/7", title: "Лечим так, что *кот не заметит*", lede: "Тихие кабинеты без собачьего лая, приём по записи без очереди и врачи, которые сначала гладят, потом смотрят. Прививки, зубы, стерилизация — всё в одном месте.", bubble: "Мя. Меня даже не держали." },
  { key: "dog", label: "Собака", eyebrow: "Ветклиника и груминг на Соколе · 24/7", title: "Лечим так, что *хвост не перестаёт*", lede: "Отдельный вход для собак, весы прямо в холле и лакомство после укола. Ортопед, стоматолог, груминг — и никто не будет гладить против шерсти.", bubble: "Гав. Тут дают вкусняшки." },
  { key: "rabbit", label: "Кролик", eyebrow: "Ветклиника и груминг на Соколе · 24/7", title: "Лечим так, что *уши не вянут*", lede: "Врач по грызунам и кроликам каждый день, а не «по четвергам». Зубы, ЖКТ, стрижка когтей — быстро, тихо и без стресса для длинноухих.", bubble: "Морковку взяла с собой." },
]

const DEFAULT_STATS: Hero035Stat[] = [
  { value: 12480, label: "хвостов вылечили с 2017-го" },
  { value: 4.9, suffix: " / 5", label: "средняя оценка на картах" },
  { value: 18, label: "минут — среднее ожидание приёма" },
]

const MARKS = [
  { left: "6%", top: "12%", rotate: -20 },
  { left: "40%", top: "6%", rotate: 15 },
  { left: "22%", top: "70%", rotate: 30 },
  { left: "88%", top: "62%", rotate: -35 },
  { left: "60%", top: "84%", rotate: 10 },
]

function PawMark({ left, top, rotate }: { left: string; top: string; rotate: number }) {
  return (
    <svg data-part="mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ left, top, transform: `rotate(${rotate}deg)` }}>
      <ellipse cx="7" cy="8.2" rx="2.2" ry="2.9" />
      <ellipse cx="17" cy="8.2" rx="2.2" ry="2.9" />
      <ellipse cx="3.4" cy="13.2" rx="1.9" ry="2.4" />
      <ellipse cx="20.6" cy="13.2" rx="1.9" ry="2.4" />
      <path d="M12 11.3c3.4 0 6.2 2.7 6.2 5.8 0 2-1.6 3.4-3.6 3.4-1 0-1.7-.5-2.6-.5s-1.6.5-2.6.5c-2 0-3.6-1.4-3.6-3.4 0-3.1 2.8-5.8 6.2-5.8Z" />
    </svg>
  )
}

function renderTitle(title: string) {
  return title.split("*").map((chunk, index) => (index % 2 === 1 ? <em key={index}>{chunk}</em> : chunk))
}

function formatStat(value: number, progress: number) {
  const current = value * progress
  if (Number.isInteger(value)) return String(Math.round(current)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return current.toFixed(1).replace(".", ",")
}

function useCountUp(active: boolean) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!active) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1600)
      setProgress(1 - Math.pow(1 - t, 3))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active])
  return progress
}

/** Хиро ветклиники: CSS-морда следит за курсором, переключатель питомца. */
export function Hero035({
  pets = DEFAULT_PETS,
  defaultPet = "cat",
  primaryLabel = "Записаться на приём",
  primaryHref = "#contacts",
  secondaryLabel = "Что болит?",
  secondaryHref = "#symptoms",
  stats = DEFAULT_STATS,
  eventName = "vibeui-vet:pet",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero035Props) {
  const [petKey, setPetKey] = useState<Hero035PetKey>(defaultPet)
  const [seen, setSeen] = useState(false)
  const faceRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLUListElement>(null)
  const progress = useCountUp(seen)
  const index = Math.max(0, pets.findIndex((pet) => pet.key === petKey))
  const pet = pets[index] ?? pets[0]

  useEffect(() => {
    const node = statsRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const lookAt = (event: ReactPointerEvent<HTMLElement>) => {
    const face = faceRef.current
    if (!face) return
    const rect = face.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width
    const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height
    face.style.setProperty("--vibeui-hero-035-ex", String(Math.max(-1, Math.min(1, dx * 2.2))))
    face.style.setProperty("--vibeui-hero-035-ey", String(Math.max(-1, Math.min(1, dy * 2.2))))
  }

  const lookForward = () => {
    const face = faceRef.current
    if (!face) return
    face.style.setProperty("--vibeui-hero-035-ex", "0")
    face.style.setProperty("--vibeui-hero-035-ey", "0")
  }

  const choose = (key: Hero035PetKey) => {
    setPetKey(key)
    window.dispatchEvent(new CustomEvent(eventName, { detail: { pet: key } }))
  }

  const palette = {
    ...(accent ? { "--vibeui-hero-035-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-035-fg": ink } : null),
    ...(background ? { "--vibeui-hero-035-bg": background } : null),
    ...style,
  } as CSSProperties

  const switchStyle = { ["--vibeui-hero-035-n" as string]: pets.length, ["--vibeui-hero-035-i" as string]: index } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-035" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-035" data-tone={tone === "auto" ? undefined : tone} className={className} style={palette} onPointerMove={lookAt} onPointerLeave={lookForward}>
        <i data-part="blob" aria-hidden="true" />
        <i data-part="blob" aria-hidden="true" />
        {MARKS.map((mark) => (
          <PawMark key={mark.left + mark.top} {...mark} />
        ))}
        <div data-part="shell">
          <div data-part="copy">
            <div data-part="switch" role="group" aria-label="Кто у вас" style={switchStyle}>
              {pets.map((item) => (
                <button key={item.key} type="button" aria-pressed={item.key === pet.key} onClick={() => choose(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>
            {pet.eyebrow ? <p data-part="eyebrow">{pet.eyebrow}</p> : null}
            <h1 data-part="title" key={`title-${pet.key}`}>
              {renderTitle(pet.title)}
            </h1>
            <p data-part="lede" key={`lede-${pet.key}`}>
              {pet.lede}
            </p>
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h3l2-6 4 12 2-6h5" />
                  </svg>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
            {stats.length > 0 ? (
              <ul data-part="stats" ref={statsRef}>
                {stats.map((stat) => (
                  <li key={stat.label}>
                    <b>
                      {formatStat(stat.value, progress)}
                      {stat.suffix}
                    </b>
                    <span>{stat.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div data-part="stage">
            <p data-part="bubble" key={`bubble-${pet.key}`} aria-live="polite">
              {pet.bubble}
            </p>
            <div data-part="face" data-pet={pet.key} ref={faceRef} role="img" aria-label={`Морда: ${pet.label.toLowerCase()}`}>
              <i data-part="ear" data-side="l" />
              <i data-part="ear" data-side="r" />
              <i data-part="head" />
              <i data-part="muzzle" />
              <i data-part="cheek" data-side="l" />
              <i data-part="cheek" data-side="r" />
              <i data-part="eye" data-side="l">
                <i data-part="pupil" />
                <i data-part="lid" />
              </i>
              <i data-part="eye" data-side="r">
                <i data-part="pupil" />
                <i data-part="lid" />
              </i>
              <i data-part="tongue" />
              <i data-part="nose" />
              <i data-part="mouth" />
              <i data-part="teeth">
                <i />
                <i />
              </i>
              <i data-part="whiskers">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </i>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
