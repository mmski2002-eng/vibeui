"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

export type Hero033Person = {
  name: string
  /** Кадр с «вебки»: портрет в интерьере. Пусто — цветной аватар с буквой. */
  photo?: string
  /** Ролик, где человек говорит; играет, пока его реплика, иначе стоит на последнем кадре (рот закрыт). */
  video?: string
  /** Цвет аватара и имени в субтитрах. */
  color: string
}

export type Hero033Line = {
  /** Индекс говорящего в people. */
  who: number
  text: string
}

export type Hero033Notice = {
  /** Иконка приложения: мессенджер, трекер или база знаний. */
  app: "chat" | "task" | "doc"
  appName: string
  title: string
  text: string
}

export type Hero033Props = {
  eyebrow?: string
  /** Слово в *звёздочках* — акцентным градиентом. */
  title?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  /** Строка доверия: «4 200 команд уже перестали писать протоколы». */
  trust?: string
  /** Приложение созвона на мониторе. */
  callTitle?: string
  recLabel?: string
  botName?: string
  captionsTitle?: string
  leaveLabel?: string
  people?: readonly Hero033Person[]
  captions?: readonly Hero033Line[]
  /** Время первой реплики в субтитрах, минуты от полуночи. */
  startMinute?: number
  /** Рабочий стол после созвона: плашка и уведомления. */
  endedLabel?: string
  readyLabel?: string
  nowLabel?: string
  notices?: readonly Hero033Notice[]
  /** aria сцены. */
  demoLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Первый экран AI-продукта для созвонов, который иллюстрирует свой же
// заголовок. Справа монитор с рамкой, бликом и подставкой, на экране —
// приложение созвона: сетка видео (три человека и плитка бота с
// эквалайзером), у говорящего оживает волна-эквалайзер на подписи имени,
// справа живые субтитры с временем реплик, снизу панель управления.
// Плитки не подсвечиваются и не масштабируются — только субтитры и волна
// показывают, кто говорит. Если у человека есть ролик —
// он играет, пока звучит его реплика, а в остальное время стоит на
// последнем кадре, будто человек слушает. Реплики кончаются — курсор
// едет к красной кнопке «Завершить» и нажимает её; приложение гаснет,
// открывается рабочий стол с плашкой «Созвон завершён · сводка готова»,
// а в углу одно за другим падают системные уведомления: сводка в
// мессенджере, задача в трекере, решения в базе знаний. Пауза — и заново.
// Всё внутри экрана задано в долях его ширины (cqw), поэтому монитор
// масштабируется целиком.
const FONTS = "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@500;600;700&family=Golos+Text:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

const STYLES = `
:where([data-vibeui-block="hero-033"]){
--vibeui-hero-033-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-hero-033-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-033-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-hero-033-on-accent:oklch(from var(--vibeui-hero-033-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-033-muted:color-mix(in oklab,var(--vibeui-hero-033-fg) 60%,var(--vibeui-hero-033-bg));
--vibeui-hero-033-line:color-mix(in oklab,var(--vibeui-hero-033-fg) 10%,transparent);
--vibeui-hero-033-a2:#8b7cf6;
--vibeui-hero-033-rec:#ff4d6a;
--vibeui-hero-033-app:#141518;
--vibeui-hero-033-app-2:#1d1f24;
--vibeui-hero-033-app-fg:#eceef3;
--vibeui-hero-033-app-muted:#8b909c;
--vibeui-hero-033-ease:cubic-bezier(.22,1,.36,1);
--vibeui-hero-033-display:"Wix Madefor Display",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-033-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-hero-033-mono:"JetBrains Mono",ui-monospace,Menlo,monospace;
container:vibeui-hero-033/inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-033"]{color-scheme:dark}
:where([data-vibeui-block="hero-033"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-033"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-033"]{box-sizing:border-box;position:relative;overflow:hidden;isolation:isolate;background:var(--vibeui-hero-033-bg);color:var(--vibeui-hero-033-fg);font-family:var(--vibeui-hero-033-font);font-size:1rem;line-height:1.5}
[data-vibeui-block="hero-033"] *{box-sizing:border-box}
[data-vibeui-block="hero-033"] [data-part="glow"]{position:absolute;inset:0;z-index:-1;pointer-events:none;background:radial-gradient(55% 55% at 76% 40%,color-mix(in oklab,var(--vibeui-hero-033-a2) 20%,transparent),transparent 70%),radial-gradient(45% 50% at 12% 10%,color-mix(in oklab,var(--vibeui-hero-033-accent) 12%,transparent),transparent 70%),linear-gradient(to bottom,transparent 70%,var(--vibeui-hero-033-bg))}
[data-vibeui-block="hero-033"] [data-part="grid"]{position:absolute;inset:0;z-index:-1;pointer-events:none;background-image:linear-gradient(var(--vibeui-hero-033-line) 1px,transparent 1px),linear-gradient(90deg,var(--vibeui-hero-033-line) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(70% 60% at 50% 30%,#000,transparent);opacity:.45}
[data-vibeui-block="hero-033"] [data-part="shell"]{max-width:80rem;margin:0 auto;padding:7rem 1.25rem 4rem;display:grid;gap:3rem;align-items:center}
[data-vibeui-block="hero-033"] [data-part="eyebrow"]{margin:0 0 1.4rem;display:inline-flex;align-items:center;gap:.55rem;padding:.3rem .75rem .3rem .35rem;border-radius:999px;background:color-mix(in oklab,var(--vibeui-hero-033-fg) 6%,transparent);box-shadow:inset 0 0 0 1px var(--vibeui-hero-033-line);font-size:.8rem;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .7s var(--vibeui-hero-033-ease) both}
[data-vibeui-block="hero-033"] [data-part="eyebrow-dot"]{position:relative;width:1.3rem;height:1.3rem;border-radius:50%;background:color-mix(in oklab,var(--vibeui-hero-033-accent) 16%,transparent)}
[data-vibeui-block="hero-033"] [data-part="eyebrow-dot"]::after{content:"";position:absolute;inset:.4rem;border-radius:50%;background:var(--vibeui-hero-033-accent);box-shadow:0 0 10px var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="title"]{margin:0;font-family:var(--vibeui-hero-033-display);font-weight:700;font-size:clamp(2.4rem,3.6cqi,3.6rem);line-height:1.05;letter-spacing:-.035em;text-wrap:balance}
[data-vibeui-block="hero-033"] [data-part="w"]{display:inline-block;overflow:hidden;vertical-align:bottom;padding:.06em .04em 0;margin:0 -.04em}
[data-vibeui-block="hero-033"] [data-part="w"] > span{display:inline-block;translate:0 112%;animation:vibeui-hero-033-mask .9s var(--vibeui-hero-033-ease) forwards;animation-delay:calc(.1s + var(--vibeui-hero-033-i) * .06s)}
[data-vibeui-block="hero-033"] [data-part="w"] > span[data-em]{background:linear-gradient(100deg,var(--vibeui-hero-033-accent),var(--vibeui-hero-033-a2));-webkit-background-clip:text;background-clip:text;color:transparent}
[data-vibeui-block="hero-033"] [data-part="lede"]{margin:1.4rem 0 0;max-width:30rem;font-size:1.08rem;line-height:1.6;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .5s both}
[data-vibeui-block="hero-033"] [data-part="actions"]{display:flex;align-items:center;gap:.7rem 1.4rem;flex-wrap:wrap;margin-top:2rem;animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .65s both}
[data-vibeui-block="hero-033"] [data-part="primary"]{display:inline-flex;align-items:center;height:3.2rem;padding:0 1.5rem;border-radius:999px;background:var(--vibeui-hero-033-accent);color:var(--vibeui-hero-033-on-accent);font-weight:600;text-decoration:none;box-shadow:0 14px 34px -14px var(--vibeui-hero-033-accent),inset 0 1px 0 rgb(255 255 255 / .35);transition:translate .3s var(--vibeui-hero-033-ease),box-shadow .3s}
[data-vibeui-block="hero-033"] [data-part="primary"]:hover{translate:0 -2px;box-shadow:0 20px 40px -14px var(--vibeui-hero-033-accent),inset 0 1px 0 rgb(255 255 255 / .35)}
[data-vibeui-block="hero-033"] [data-part="secondary"]{display:inline-flex;align-items:center;color:var(--vibeui-hero-033-fg);font-weight:500;text-decoration:none;padding:.3rem 0;border-bottom:1px solid var(--vibeui-hero-033-line);transition:border-color .3s}
[data-vibeui-block="hero-033"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] :is([data-part="primary"],[data-part="secondary"]):focus-visible{outline:2px solid var(--vibeui-hero-033-accent);outline-offset:4px}
[data-vibeui-block="hero-033"] [data-part="trust"]{display:flex;align-items:center;gap:.7rem;margin:2rem 0 0;font-size:.85rem;color:var(--vibeui-hero-033-muted);animation:vibeui-hero-033-up .8s var(--vibeui-hero-033-ease) .8s both}
[data-vibeui-block="hero-033"] [data-part="faces"]{display:flex}
[data-vibeui-block="hero-033"] [data-part="face"]{width:1.7rem;height:1.7rem;margin-left:-.45rem;border-radius:50%;border:2px solid var(--vibeui-hero-033-bg);background:var(--vibeui-hero-033-c);object-fit:cover}
[data-vibeui-block="hero-033"] [data-part="face"]:first-child{margin-left:0}
[data-vibeui-block="hero-033"] [data-part="device"]{position:relative;animation:vibeui-hero-033-rise 1.1s var(--vibeui-hero-033-ease) .25s both}
[data-vibeui-block="hero-033"] [data-part="monitor"]{position:relative;padding:1.1%;border-radius:1.2rem;background:linear-gradient(160deg,#2b2d33,#0d0e10 45%,#1a1b1f);box-shadow:inset 0 0 0 1px rgb(255 255 255 / .1),0 50px 100px -40px rgb(0 0 0 / .9),0 30px 80px -60px var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="screen"]{position:relative;aspect-ratio:16/10;overflow:hidden;border-radius:.55rem;background:#050608;container-type:inline-size;color:var(--vibeui-hero-033-app-fg);line-height:1.35}
[data-vibeui-block="hero-033"] :is([data-part="app"],[data-part="desktop"]){font-size:max(8px,1.75cqw)}
[data-vibeui-block="hero-033"] [data-part="screen"]::after{content:"";position:absolute;inset:0;z-index:9;pointer-events:none;background:linear-gradient(125deg,rgb(255 255 255 / .07),transparent 32%,transparent 70%,rgb(255 255 255 / .03))}
[data-vibeui-block="hero-033"] [data-part="neck"]{width:16%;height:2.6rem;margin:0 auto;background:linear-gradient(90deg,#16171a,#2e3036 50%,#16171a);clip-path:polygon(12% 0,88% 0,100% 100%,0 100%)}
[data-vibeui-block="hero-033"] [data-part="foot"]{width:34%;height:.55rem;margin:0 auto;border-radius:0 0 .5rem .5rem;background:linear-gradient(90deg,#1b1c20,#3a3c43 50%,#1b1c20);box-shadow:0 18px 30px -12px rgb(0 0 0 / .9)}
[data-vibeui-block="hero-033"] [data-part="app"]{position:absolute;inset:0;display:grid;grid-template-rows:auto 1fr auto;background:var(--vibeui-hero-033-app);transition:opacity .7s,filter .7s,scale .7s var(--vibeui-hero-033-ease)}
[data-vibeui-block="hero-033"][data-phase="done"] [data-part="app"]{opacity:0;filter:blur(6px);scale:.96}
[data-vibeui-block="hero-033"] [data-part="topbar"]{display:flex;align-items:center;gap:1.2cqw;padding:1.3cqw 1.8cqw;border-bottom:1px solid rgb(255 255 255 / .06)}
[data-vibeui-block="hero-033"] [data-part="call-title"]{font-weight:600}
[data-vibeui-block="hero-033"] [data-part="clock"]{font-family:var(--vibeui-hero-033-mono);color:var(--vibeui-hero-033-app-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="hero-033"] [data-part="rec"]{display:inline-flex;align-items:center;gap:.8cqw;margin-left:auto;padding:.4cqw 1.2cqw;border-radius:999px;background:color-mix(in oklab,var(--vibeui-hero-033-rec) 16%,transparent);color:#ffb3bf;font-size:.9em;white-space:nowrap}
[data-vibeui-block="hero-033"] [data-part="rec-dot"]{width:1cqw;height:1cqw;border-radius:50%;background:var(--vibeui-hero-033-rec);animation:vibeui-hero-033-blink 1.2s steps(1) infinite}
[data-vibeui-block="hero-033"] [data-part="body"]{display:grid;grid-template-columns:minmax(0,1fr) 34%;min-height:0}
[data-vibeui-block="hero-033"] [data-part="tiles"]{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:1cqw;padding:1.2cqw;min-height:0}
[data-vibeui-block="hero-033"] [data-part="tile"]{position:relative;overflow:hidden;border-radius:1.2cqw;background:var(--vibeui-hero-033-app-2);box-shadow:inset 0 0 0 1px rgb(255 255 255 / .05)}
[data-vibeui-block="hero-033"] [data-part="cam"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 22%}
[data-vibeui-block="hero-033"] [data-part="initial"]{position:absolute;inset:0;display:grid;place-items:center}
[data-vibeui-block="hero-033"] [data-part="initial-mark"]{display:grid;place-items:center;width:9cqw;height:9cqw;border-radius:50%;background:var(--vibeui-hero-033-c);color:#fff;font-family:var(--vibeui-hero-033-display);font-weight:700;font-size:3.4cqw}
[data-vibeui-block="hero-033"] [data-part="tag"]{position:absolute;left:.8cqw;bottom:.8cqw;display:inline-flex;align-items:center;gap:.6cqw;padding:.35cqw .8cqw;border-radius:.7cqw;background:rgb(0 0 0 / .55);backdrop-filter:blur(6px);font-size:.85em;font-weight:500}
[data-vibeui-block="hero-033"] [data-part="wave"]{display:inline-flex;align-items:center;gap:.25cqw;height:1.2cqw}
[data-vibeui-block="hero-033"] [data-part="wave"] i{width:.3cqw;height:100%;border-radius:1px;background:currentColor;opacity:.6;transform:scaleY(.3)}
[data-vibeui-block="hero-033"] [data-part="tile"][data-talking="true"] [data-part="wave"]{color:var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="tile"][data-talking="true"] [data-part="wave"] i{opacity:1;animation:vibeui-hero-033-eq .7s ease-in-out infinite}
[data-vibeui-block="hero-033"] [data-part="wave"] i:nth-child(2){animation-delay:-.25s}
[data-vibeui-block="hero-033"] [data-part="wave"] i:nth-child(3){animation-delay:-.5s}
[data-vibeui-block="hero-033"] [data-part="bot"]{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:1cqw;background:radial-gradient(60% 60% at 50% 45%,color-mix(in oklab,var(--vibeui-hero-033-accent) 18%,transparent),transparent 70%)}
[data-vibeui-block="hero-033"] [data-part="bot-eq"]{display:flex;align-items:center;gap:.5cqw;height:6cqw}
[data-vibeui-block="hero-033"] [data-part="bot-eq"] i{width:.8cqw;height:100%;border-radius:1cqw;background:linear-gradient(var(--vibeui-hero-033-accent),var(--vibeui-hero-033-a2));transform:scaleY(.25);animation:vibeui-hero-033-eq 1s ease-in-out infinite;animation-delay:calc(var(--vibeui-hero-033-i) * -.14s)}
[data-vibeui-block="hero-033"] [data-part="bot-note"]{font-size:.85em;color:var(--vibeui-hero-033-app-muted)}
[data-vibeui-block="hero-033"] [data-part="side"]{display:grid;grid-template-rows:auto 1fr;min-height:0;border-left:1px solid rgb(255 255 255 / .06);background:rgb(255 255 255 / .02)}
[data-vibeui-block="hero-033"] [data-part="side-title"]{margin:0;padding:1.3cqw 1.5cqw;font-size:.8em;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--vibeui-hero-033-app-muted)}
[data-vibeui-block="hero-033"] [data-part="lines"]{display:flex;flex-direction:column;justify-content:flex-end;gap:1.2cqw;margin:0;padding:0 1.5cqw 1.5cqw;list-style:none;overflow:hidden}
[data-vibeui-block="hero-033"] [data-part="line"]{animation:vibeui-hero-033-line .5s var(--vibeui-hero-033-ease) both}
[data-vibeui-block="hero-033"] [data-part="line-head"]{display:flex;gap:.8cqw;align-items:baseline;font-size:.85em}
[data-vibeui-block="hero-033"] [data-part="line-who"]{color:var(--vibeui-hero-033-c);font-weight:600}
[data-vibeui-block="hero-033"] [data-part="line-time"]{font-family:var(--vibeui-hero-033-mono);color:var(--vibeui-hero-033-app-muted);font-size:.9em}
[data-vibeui-block="hero-033"] [data-part="line-text"]{margin:.3cqw 0 0;color:#cfd3dc}
[data-vibeui-block="hero-033"] [data-part="line"][data-last="true"] [data-part="line-text"]{animation:vibeui-hero-033-type 1.2s steps(40,end) both}
[data-vibeui-block="hero-033"] [data-part="controls"]{display:flex;align-items:center;justify-content:center;gap:1cqw;padding:1.2cqw;border-top:1px solid rgb(255 255 255 / .06)}
[data-vibeui-block="hero-033"] [data-part="ctl"]{display:grid;place-items:center;width:4.4cqw;height:4.4cqw;border-radius:50%;background:rgb(255 255 255 / .08);color:#d7dbe3}
[data-vibeui-block="hero-033"] [data-part="ctl"] [data-part="glyph"]{width:2.2cqw;height:2.2cqw}
[data-vibeui-block="hero-033"] [data-part="leave"]{position:relative;display:inline-flex;align-items:center;gap:.6cqw;height:4.4cqw;margin-left:1.4cqw;padding:0 2cqw;border-radius:999px;background:#e5484d;color:#fff;font-weight:600;font-size:.95em}
[data-vibeui-block="hero-033"] [data-part="leave"] [data-part="glyph"]{width:2.2cqw;height:2.2cqw}
[data-vibeui-block="hero-033"][data-phase="ending"] [data-part="leave"]{animation:vibeui-hero-033-press .5s ease 1s both}
[data-vibeui-block="hero-033"] [data-part="cursor"]{position:absolute;z-index:8;left:88%;top:70%;width:3.2cqw;height:auto;filter:drop-shadow(0 .3cqw .5cqw rgb(0 0 0 / .6));opacity:0;transition:left 1s var(--vibeui-hero-033-ease),top 1s var(--vibeui-hero-033-ease),opacity .3s}
[data-vibeui-block="hero-033"][data-phase="ending"] [data-part="cursor"]{left:var(--vibeui-hero-033-cx);top:var(--vibeui-hero-033-cy);opacity:1}
[data-vibeui-block="hero-033"] [data-part="desktop"]{position:absolute;inset:0;background:radial-gradient(90% 90% at 20% 110%,color-mix(in oklab,var(--vibeui-hero-033-a2) 55%,#0b0c1a),transparent 60%),radial-gradient(80% 80% at 100% 0%,color-mix(in oklab,var(--vibeui-hero-033-accent) 35%,#0b0c1a),transparent 55%),#0b0c1a;opacity:0;transition:opacity .8s .2s}
[data-vibeui-block="hero-033"][data-phase="done"] [data-part="desktop"]{opacity:1}
[data-vibeui-block="hero-033"] [data-part="menubar"]{display:flex;align-items:center;gap:1.6cqw;height:3.4cqw;padding:0 1.8cqw;background:rgb(0 0 0 / .25);backdrop-filter:blur(10px);font-size:.8em;font-weight:500}
[data-vibeui-block="hero-033"] [data-part="menubar"] [data-part="clock"]{margin-left:auto;color:#e5e7ee}
[data-vibeui-block="hero-033"] [data-part="done"]{position:absolute;left:5%;bottom:8%;display:grid;gap:.6cqw;padding:2cqw 2.4cqw;border-radius:2cqw;background:rgb(15 16 22 / .6);backdrop-filter:blur(14px);box-shadow:inset 0 0 0 1px rgb(255 255 255 / .1);opacity:0;translate:0 3cqw;transition:opacity .6s .5s,translate .8s var(--vibeui-hero-033-ease) .5s}
[data-vibeui-block="hero-033"][data-phase="done"] [data-part="done"]{opacity:1;translate:0 0}
[data-vibeui-block="hero-033"] [data-part="done-title"]{font-family:var(--vibeui-hero-033-display);font-weight:700;font-size:1.3em}
[data-vibeui-block="hero-033"] [data-part="done-meta"]{display:inline-flex;align-items:center;gap:.8cqw;color:var(--vibeui-hero-033-accent);font-size:.9em}
[data-vibeui-block="hero-033"] [data-part="done-dot"]{width:1cqw;height:1cqw;border-radius:50%;background:var(--vibeui-hero-033-accent);box-shadow:0 0 1.5cqw var(--vibeui-hero-033-accent)}
[data-vibeui-block="hero-033"] [data-part="notices"]{position:absolute;right:2cqw;top:5cqw;display:grid;gap:1cqw;width:46%;margin:0;padding:0;list-style:none}
[data-vibeui-block="hero-033"] [data-part="notice"]{display:grid;grid-template-columns:auto minmax(0,1fr);gap:.4cqw 1.2cqw;padding:1.3cqw 1.5cqw;border-radius:2cqw;background:rgb(34 36 44 / .72);backdrop-filter:blur(18px) saturate(1.6);box-shadow:inset 0 0 0 1px rgb(255 255 255 / .1),0 2cqw 4cqw -1.5cqw rgb(0 0 0 / .7);opacity:0;translate:120% 0;transition:opacity .4s,translate .8s cubic-bezier(.3,1.3,.5,1)}
[data-vibeui-block="hero-033"][data-phase="done"] [data-part="notice"]{opacity:1;translate:0 0;transition-delay:calc(1.1s + var(--vibeui-hero-033-i) * .9s)}
[data-vibeui-block="hero-033"] [data-part="icon"]{grid-row:span 2;display:grid;place-items:center;width:4.4cqw;height:4.4cqw;border-radius:1.1cqw}
[data-vibeui-block="hero-033"] [data-part="icon"] [data-part="glyph"]{width:2.6cqw;height:2.6cqw}
[data-vibeui-block="hero-033"] [data-part="icon"][data-app="chat"]{background:linear-gradient(160deg,#3cc3ff,#1e8fd8);color:#fff}
[data-vibeui-block="hero-033"] [data-part="icon"][data-app="task"]{background:linear-gradient(160deg,#3b82f6,#1d4ed8);color:#fff}
[data-vibeui-block="hero-033"] [data-part="icon"][data-app="doc"]{background:#fff;color:#111;font-family:Georgia,serif;font-weight:700;font-size:1.3em}
[data-vibeui-block="hero-033"] [data-part="notice-head"]{display:flex;align-items:baseline;gap:.8cqw;font-size:.8em;color:#aeb3be}
[data-vibeui-block="hero-033"] [data-part="notice-time"]{margin-left:auto}
[data-vibeui-block="hero-033"] [data-part="notice-body"]{margin:0;font-size:.92em;line-height:1.35}
[data-vibeui-block="hero-033"] [data-part="notice-title"]{display:block;font-weight:600}
[data-vibeui-block="hero-033"] [data-part="notice-text"]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:#cfd3dc}
@keyframes vibeui-hero-033-mask{to{translate:0 0}}
@keyframes vibeui-hero-033-up{from{opacity:0;translate:0 14px}}
@keyframes vibeui-hero-033-rise{from{opacity:0;translate:0 40px;scale:.97}}
@keyframes vibeui-hero-033-blink{50%{opacity:.2}}
@keyframes vibeui-hero-033-eq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
@keyframes vibeui-hero-033-line{from{opacity:0;translate:0 1.5cqw}}
@keyframes vibeui-hero-033-type{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes vibeui-hero-033-press{0%,100%{scale:1}40%{scale:.9;background:#b92f35}}
@container vibeui-hero-033 (min-width: 60rem){[data-vibeui-block="hero-033"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,42rem);gap:3.5rem;min-height:min(100svh,54rem);padding:7.5rem 1.25rem 4rem}}
@container vibeui-hero-033 (max-width: 40rem){[data-vibeui-block="hero-033"] [data-part="body"]{grid-template-columns:1fr}[data-vibeui-block="hero-033"] [data-part="side"]{display:none}[data-vibeui-block="hero-033"] [data-part="neck"]{height:1.6rem}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-033"] *{animation:none!important;transition:none!important}[data-vibeui-block="hero-033"] [data-part="w"] > span{translate:0 0}}`

const DEFAULT_PEOPLE: Hero033Person[] = [
  { name: "Лена", photo: "/demo/people/call-lena.webp", video: "/demo/people/call-lena.mp4", color: "#b8a6ff" },
  { name: "Марк", photo: "/demo/people/call-mark.webp", video: "/demo/people/call-mark.mp4", color: "#5fe0c4" },
  { name: "Оля", photo: "/demo/people/call-olya.webp", video: "/demo/people/call-olya.mp4", color: "#ffb37a" },
]

const DEFAULT_CAPTIONS: Hero033Line[] = [
  { who: 0, text: "Давайте релиз перенесём на четверг, тесты не успевают." },
  { who: 1, text: "Ок, тогда я беру миграцию базы до среды." },
  { who: 2, text: "Мне нужны финальные иконки к вторнику." },
  { who: 0, text: "И риск: у провайдера окно обслуживания в среду ночью." },
]

const DEFAULT_NOTICES: Hero033Notice[] = [
  { app: "chat", appName: "Telegram", title: "Tally · #релиз", text: "Релиз переносим на четверг. Задачи: миграция базы — Марк, иконки — дизайн." },
  { app: "task", appName: "Jira", title: "REL-248 назначена на Марка", text: "Миграция базы · срок — среда" },
  { app: "doc", appName: "Notion", title: "Решения · планёрка релиза", text: "2 решения и 1 риск добавлены в базу" },
]

const LINE_MS = 2600
const ENDING_MS = 1700
const HOLD_MS = 7000

type Phase = "call" | "ending" | "done"

function hhmm(total: number) {
  const hours = Math.floor(total / 60) % 24
  return `${hours}:${String(total % 60).padStart(2, "0")}`
}

function Glyph({ d }: { d: string }) {
  return (
    <svg data-part="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

/** Первый экран AI-продукта: созвон на мониторе заканчивается, а результаты приходят уведомлениями. */
export function Hero033({
  eyebrow = "AI для встреч · без протоколов",
  title = "Созвон закончился — *решения уже в трекере*",
  lede = "Tally слушает встречу, выделяет решения, задачи и риски и раскладывает их по Jira, Notion и Telegram. Пока вы наливаете кофе.",
  primaryLabel = "Начать бесплатно",
  primaryHref = "#start",
  secondaryLabel = "Попробовать в песочнице",
  secondaryHref = "#sandbox",
  trust = "4 200 команд уже перестали писать протоколы",
  callTitle = "Планёрка релиза",
  recLabel = "Tally записывает",
  botName = "Tally",
  captionsTitle = "Субтитры",
  leaveLabel = "Завершить",
  people = DEFAULT_PEOPLE,
  captions = DEFAULT_CAPTIONS,
  startMinute = 12 * 60 + 38,
  endedLabel = "Созвон завершён · 42:10",
  readyLabel = "сводка готова за 38 с",
  nowLabel = "сейчас",
  notices = DEFAULT_NOTICES,
  demoLabel = "Демо: созвон на мониторе и уведомления с его результатами",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Hero033Props) {
  const [phase, setPhase] = useState<Phase>("call")
  const [line, setLine] = useState(0)
  const videos = useRef<(HTMLVideoElement | null)[]>([])

  // Сцена по кругу: реплики по очереди → курсор жмёт «Завершить» → рабочий стол с уведомлениями → заново.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let timer = 0
    let index = 0
    const run = (next: () => void, ms: number) => {
      timer = window.setTimeout(next, ms)
    }
    const talk = () => {
      if (index < captions.length - 1) {
        index += 1
        setLine(index)
        run(talk, LINE_MS)
        return
      }
      setPhase("ending")
      run(() => {
        setPhase("done")
        run(() => {
          index = 0
          setLine(0)
          setPhase("call")
          run(talk, LINE_MS)
        }, HOLD_MS)
      }, ENDING_MS)
    }
    run(talk, LINE_MS)
    return () => window.clearTimeout(timer)
  }, [captions.length])

  const speaker = phase === "call" ? (captions[line]?.who ?? -1) : -1

  // Говорящий играет с начала, остальные стоят на кадре, где остановились.
  // Раньше при остановке видео ещё и перематывалось к duration-0.08 —
  // seek у конца ролика заставляет декодер досчитывать кадры от ближайшего
  // keyframe и даёт заметный дребезг на долю секунды. Просто ставим паузу.
  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (!video) return
      if (index === speaker && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        video.currentTime = 0
        video.play().catch(() => {})
        return
      }
      if (!video.paused) video.pause()
    })
  }, [speaker, line])

  const words = title.split(/(\*[^*]+\*)/).flatMap((part) => {
    const em = part.startsWith("*")
    return (em ? part.slice(1, -1) : part)
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, em }))
  })
  const talking = speaker
  const shown = captions.slice(0, line + 1)
  const endMinute = startMinute + captions.length + 1

  const palette = {
    ...(accent ? { "--vibeui-hero-033-accent": accent } : null),
    ...(ink ? { "--vibeui-hero-033-fg": ink } : null),
    ...(background ? { "--vibeui-hero-033-bg": background } : null),
    // Курсор едет к кнопке «Завершить» в конце нижней панели.
    "--vibeui-hero-033-cx": "60%",
    "--vibeui-hero-033-cy": "92%",
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-hero-033" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="hero-033" data-tone={tone === "auto" ? undefined : tone} data-phase={phase} className={className} style={palette}>
        <i data-part="glow" aria-hidden="true" />
        <i data-part="grid" aria-hidden="true" />
        <div data-part="shell">
          <div>
            {eyebrow ? (
              <p data-part="eyebrow">
                <span data-part="eyebrow-dot" aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}
            <h1 data-part="title">
              {words
                .map((item, index) => (
                  <span key={index} data-part="w">
                    <span data-em={item.em ? "" : undefined} style={{ ["--vibeui-hero-033-i" as string]: index }}>
                      {item.word}
                    </span>
                  </span>
                ))
                .flatMap((node, index) => (index ? [" ", node] : [node]))}
            </h1>
            {lede ? <p data-part="lede">{lede}</p> : null}
            <div data-part="actions">
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
              {secondaryLabel ? (
                <a data-part="secondary" href={secondaryHref}>
                  {secondaryLabel}
                </a>
              ) : null}
            </div>
            {trust ? (
              <p data-part="trust">
                <span data-part="faces" aria-hidden="true">
                  {people.map((person) =>
                    person.photo ? (
                      <img key={person.name} data-part="face" src={person.photo} alt="" />
                    ) : (
                      <i key={person.name} data-part="face" style={{ ["--vibeui-hero-033-c" as string]: person.color } as CSSProperties} />
                    ),
                  )}
                </span>
                {trust}
              </p>
            ) : null}
          </div>
          <div data-part="device" role="img" aria-label={demoLabel}>
            <div data-part="monitor">
              <div data-part="screen">
                <div data-part="app">
                  <div data-part="topbar">
                    <span data-part="call-title">{callTitle}</span>
                    <span data-part="clock">{hhmm(startMinute + line)}</span>
                    <span data-part="rec">
                      <i data-part="rec-dot" aria-hidden="true" />
                      {recLabel}
                    </span>
                  </div>
                  <div data-part="body">
                    <div data-part="tiles">
                      {people.slice(0, 3).map((person, index) => (
                        <div key={person.name} data-part="tile" data-talking={talking === index} style={{ ["--vibeui-hero-033-c" as string]: person.color } as CSSProperties}>
                          {person.video ? (
                            <video
                              ref={(node) => {
                                videos.current[index] = node
                              }}
                              data-part="cam"
                              src={person.video}
                              poster={person.photo}
                              muted
                              playsInline
                              loop
                              preload="auto"
                              onLoadedMetadata={(event) => {
                                if (index !== speaker) event.currentTarget.currentTime = Math.max(0, event.currentTarget.duration - 0.08)
                              }}
                            />
                          ) : person.photo ? (
                            <img data-part="cam" src={person.photo} alt="" />
                          ) : (
                            <span data-part="initial">
                              <span data-part="initial-mark">{person.name.charAt(0)}</span>
                            </span>
                          )}
                          <span data-part="tag">
                            <span data-part="wave" aria-hidden="true">
                              <i />
                              <i />
                              <i />
                            </span>
                            {person.name}
                          </span>
                        </div>
                      ))}
                      <div data-part="tile">
                        <span data-part="bot">
                          <span data-part="bot-eq" aria-hidden="true">
                            {Array.from({ length: 7 }, (_, index) => (
                              <i key={index} style={{ ["--vibeui-hero-033-i" as string]: index } as CSSProperties} />
                            ))}
                          </span>
                          <span data-part="bot-note">{recLabel}</span>
                        </span>
                        <span data-part="tag">{botName}</span>
                      </div>
                    </div>
                    <div data-part="side">
                      <p data-part="side-title">{captionsTitle}</p>
                      <ul data-part="lines">
                        {shown.map((caption, index) => {
                          const person = people[caption.who]
                          return (
                            <li key={`${index}-${caption.text}`} data-part="line" data-last={index === shown.length - 1} style={{ ["--vibeui-hero-033-c" as string]: person?.color } as CSSProperties}>
                              <span data-part="line-head">
                                <b data-part="line-who">{person?.name}</b>
                                <time data-part="line-time">{hhmm(startMinute + index)}</time>
                              </span>
                              <p data-part="line-text">{caption.text}</p>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                  <div data-part="controls">
                    <span data-part="ctl">
                      <Glyph d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 11a7 7 0 0 0 14 0M12 18v3" />
                    </span>
                    <span data-part="ctl">
                      <Glyph d="M3 7h12v10H3zM15 10l6-3v10l-6-3" />
                    </span>
                    <span data-part="ctl">
                      <Glyph d="M3 5h18v11H3zM8 20h8M12 16v4" />
                    </span>
                    <span data-part="ctl">
                      <Glyph d="M4 6h16v10H8l-4 4zM8 10h8M8 13h5" />
                    </span>
                    <span data-part="leave">
                      <Glyph d="M4 14c4-4 12-4 16 0l-2 3-3-1v-2.5a9 9 0 0 0-6 0V16l-3 1z" />
                      {leaveLabel}
                    </span>
                  </div>
                </div>
                <div data-part="desktop">
                  <div data-part="menubar">
                    <span>{botName}</span>
                    <span data-part="clock">{hhmm(endMinute)}</span>
                  </div>
                  <div data-part="done">
                    <span data-part="done-title">{endedLabel}</span>
                    <span data-part="done-meta">
                      <i data-part="done-dot" aria-hidden="true" />
                      {readyLabel}
                    </span>
                  </div>
                  <ul data-part="notices">
                    {notices.map((notice, index) => (
                      <li key={notice.title} data-part="notice" style={{ ["--vibeui-hero-033-i" as string]: index } as CSSProperties}>
                        <span data-part="icon" data-app={notice.app}>
                          {notice.app === "chat" ? <Glyph d="M21 4 3 11l6 2 2 6 3-4 5 3z" /> : notice.app === "task" ? <Glyph d="M12 3 21 12l-9 9-9-9zM12 8l4 4-4 4-4-4z" /> : "N"}
                        </span>
                        <span data-part="notice-head">
                          {notice.appName}
                          <span data-part="notice-time">{nowLabel}</span>
                        </span>
                        <p data-part="notice-body">
                          <b data-part="notice-title">{notice.title}</b>
                          <span data-part="notice-text">{notice.text}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <svg data-part="cursor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.4-6.8L4 20z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div data-part="neck" aria-hidden="true" />
            <div data-part="foot" aria-hidden="true" />
          </div>
        </div>
      </section>
    </>
  )
}
