"use client"

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from "react"
import type { ComponentProps } from "react"

export type Bakery003Product = {
  id: string
  name: string
  /** Цена числом — для суммы. */
  price: number
  image?: string
}

export type Bakery003Props = {
  eyebrow?: string
  title?: string
  lede?: string
  products?: readonly Bakery003Product[]
  /** Сколько ячеек в коробке. */
  size?: number
  pickLabel?: string
  emptyHints?: readonly string[]
  emptyLine?: string
  stampTitle?: string
  stampNote?: string
  resetLabel?: string
  nameLabel?: string
  phoneLabel?: string
  slotLabel?: string
  /** Варианты времени выдачи. */
  slots?: readonly string[]
  submitLabel?: string
  moreLabel?: string
  howTitle?: string
  howText?: string
  howImage?: string
  doneTitle?: string
  doneText?: string
  currency?: string
  /** «Убрать {name}» — aria кнопки на позиции; «{n} из {size}» — счётчик. */
  removeLabel?: string
  ofLabel?: string
  tone?: "auto" | "light" | "dark"
  accent?: string
  ink?: string
  background?: string
  className?: string
  style?: CSSProperties
}

// Конструктор коробки к завтраку: четыре ячейки заполняются фото выпечки
// (чипы под коробкой или событие `vibeui-box:add` от полки bakery-001),
// сумма считается, крышка закрывается 3D-поворотом со штампом «собрано», и
// только тогда оживает кнопка заказа. Коробка наклоняется за курсором
// (3D-tilt по --rx/--ry), карточка заказа ловит блик под указателем, чипы и
// ячейки появляются каскадом, когда секция попадает в кадр, заголовок
// поднимается из-под маски. Форма — имя, телефон, время выдачи; после
// отправки карточка показывает «спасибо». Состояние блок рассылает событием
// `vibeui-box:state` — полка по нему подписывает кнопки.
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Golos+Text:wght@400;500;600&family=Caveat:wght@600&display=swap"

const STYLES = `
:where([data-vibeui-block="bakery-003"]){
--vibeui-bakery-003-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-bakery-003-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-003-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-bakery-003-on-accent:oklch(from var(--vibeui-bakery-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-bakery-003-muted:color-mix(in oklab,var(--vibeui-bakery-003-fg) 60%,var(--vibeui-bakery-003-bg));
--vibeui-bakery-003-panel:color-mix(in oklab,var(--vibeui-bakery-003-fg) 5%,var(--vibeui-bakery-003-bg));
--vibeui-bakery-003-line:color-mix(in oklab,var(--vibeui-bakery-003-fg) 12%,transparent);
--vibeui-bakery-003-card:light-dark(#fff,color-mix(in oklab,var(--vibeui-bakery-003-bg) 88%,var(--vibeui-bakery-003-fg)));
--vibeui-bakery-003-display:"Playfair Display",ui-serif,Georgia,serif;
--vibeui-bakery-003-font:"Golos Text",ui-sans-serif,system-ui,sans-serif;
--vibeui-bakery-003-hand:"Caveat",cursive;
--vibeui-bakery-003-ease:cubic-bezier(.2,.8,.2,1);
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bakery-003"]{color-scheme:dark}
:where([data-vibeui-block="bakery-003"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="bakery-003"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="bakery-003"]{box-sizing:border-box;position:relative;overflow:clip;padding:5.5rem 0;background:var(--vibeui-bakery-003-panel);color:var(--vibeui-bakery-003-fg);font-family:var(--vibeui-bakery-003-font);font-size:1rem;line-height:1.55}
[data-vibeui-block="bakery-003"] *{box-sizing:border-box}
[data-vibeui-block="bakery-003"] [data-part="word"]{margin:-.04em 0 -.14em}
[data-vibeui-block="bakery-003"] [data-part="glow"]{position:absolute;left:-6rem;top:10rem;width:50rem;height:34rem;border-radius:50%;background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-bakery-003-accent) 13%,transparent),transparent 70%);filter:blur(40px);pointer-events:none}
[data-vibeui-block="bakery-003"] [data-part="shell"]{position:relative;max-width:80rem;margin:0 auto;padding:0 1.25rem}
[data-vibeui-block="bakery-003"] [data-part="eyebrow"]{display:inline-flex;align-items:center;gap:.5rem;font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-bakery-003-accent);font-weight:600;margin:0 0 1.1rem}
[data-vibeui-block="bakery-003"] [data-part="eyebrow"]::before{content:"";width:1.4rem;height:2px;background:var(--vibeui-bakery-003-accent);border-radius:2px}
[data-vibeui-block="bakery-003"] [data-part="title"]{margin:0;font-family:var(--vibeui-bakery-003-display);font-weight:600;letter-spacing:-.025em;line-height:1.02;font-size:clamp(2.2rem,5cqi,4rem)}
[data-vibeui-block="bakery-003"][data-shown="true"] [data-part="word"] i{animation:vibeui-bakery-003-rise .9s var(--vibeui-bakery-003-ease) both;animation-delay:calc(var(--vibeui-bakery-003-n) * .09s)}
[data-vibeui-block="bakery-003"] [data-part="lede"]{font-size:1.06rem;color:var(--vibeui-bakery-003-muted);max-width:34rem;margin:1rem 0 0}
[data-vibeui-block="bakery-003"] [data-part="lede"],[data-vibeui-block="bakery-003"] [data-part="scene"],[data-vibeui-block="bakery-003"] [data-part="order"],[data-vibeui-block="bakery-003"][data-shown="false"] [data-part="picker"] button{opacity:0;translate:0 1.5rem}
[data-vibeui-block="bakery-003"][data-shown="true"] [data-part="lede"]{animation:vibeui-bakery-003-in .8s var(--vibeui-bakery-003-ease) .3s both}
[data-vibeui-block="bakery-003"][data-shown="true"] [data-part="scene"]{animation:vibeui-bakery-003-in 1s var(--vibeui-bakery-003-ease) .35s both}
[data-vibeui-block="bakery-003"][data-shown="true"] [data-part="order"]{animation:vibeui-bakery-003-in 1s var(--vibeui-bakery-003-ease) .5s both}
[data-vibeui-block="bakery-003"][data-shown="true"] [data-part="picker"] button{animation:vibeui-bakery-003-in .7s var(--vibeui-bakery-003-ease) backwards;animation-delay:calc(.7s + var(--vibeui-bakery-003-i) * .06s)}
[data-vibeui-block="bakery-003"] [data-part="grid"]{display:grid;gap:3rem;align-items:start;margin-top:2.5rem}
[data-vibeui-block="bakery-003"] [data-part="scene"]{position:relative;perspective:1400px;max-width:30rem;margin:0 auto}
[data-vibeui-block="bakery-003"] [data-part="carton"]{position:relative;padding:1rem;transform:rotateX(var(--vibeui-bakery-003-rx,0deg)) rotateY(var(--vibeui-bakery-003-ry,0deg));transition:transform .5s var(--vibeui-bakery-003-ease);border-radius:1.6rem;background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-bakery-003-card) 80%,#fbf8f2),color-mix(in oklab,var(--vibeui-bakery-003-card) 85%,#d9c9a8));box-shadow:0 1px 0 rgb(255 255 255 / .6) inset,0 40px 70px -40px rgb(0 0 0 / .55),0 0 0 1px var(--vibeui-bakery-003-line);transform-style:preserve-3d}
[data-vibeui-block="bakery-003"] [data-part="cells"]{display:grid;grid-template-columns:repeat(2,1fr);gap:.8rem}
[data-vibeui-block="bakery-003"] [data-part="cell"]{position:relative;aspect-ratio:1;border-radius:1rem;border:2px dashed color-mix(in oklab,var(--vibeui-bakery-003-fg) 18%,transparent);background:color-mix(in oklab,var(--vibeui-bakery-003-card) 50%,transparent);display:grid;place-items:center;overflow:hidden;transition:border-color .3s,background .3s}
[data-vibeui-block="bakery-003"] [data-part="cell"][data-filled="true"]{border-style:solid;border-color:transparent;background:var(--vibeui-bakery-003-card);box-shadow:0 8px 16px -10px rgb(0 0 0 / .4) inset}
[data-vibeui-block="bakery-003"] [data-part="cell"] img{width:100%;height:100%;object-fit:cover;display:block;animation:vibeui-bakery-003-drop .7s cubic-bezier(.2,1.4,.4,1) both}
[data-vibeui-block="bakery-003"] [data-part="cell"][data-filled="true"]{animation:vibeui-bakery-003-land .5s cubic-bezier(.2,1.6,.4,1)}
[data-vibeui-block="bakery-003"] [data-part="empty"]{font-family:var(--vibeui-bakery-003-hand);font-size:1.25rem;color:var(--vibeui-bakery-003-muted);transform:rotate(-5deg);text-align:center;padding:1rem}
[data-vibeui-block="bakery-003"] [data-part="out"]{position:absolute;right:.4rem;top:.4rem;width:1.8rem;height:1.8rem;border-radius:50%;border:0;background:rgb(0 0 0 / .7);color:#fff;font-size:1rem;line-height:1;cursor:pointer;opacity:0;transition:opacity .2s}
[data-vibeui-block="bakery-003"] [data-part="cell"]:hover [data-part="out"],[data-vibeui-block="bakery-003"] [data-part="cell"]:focus-within [data-part="out"]{opacity:1}
[data-vibeui-block="bakery-003"] [data-part="lid"]{position:absolute;inset:0;border-radius:1.6rem;background:linear-gradient(180deg,var(--vibeui-bakery-003-card),color-mix(in oklab,var(--vibeui-bakery-003-card) 90%,#d9c9a8));box-shadow:0 1px 0 rgb(255 255 255 / .6) inset,0 30px 50px -30px rgb(0 0 0 / .6),0 0 0 1px var(--vibeui-bakery-003-line);transform-origin:top;transform:rotateX(-100deg);opacity:0;transition:transform .9s cubic-bezier(.3,.7,.2,1),opacity .3s;display:grid;place-items:center;pointer-events:none;backface-visibility:hidden}
[data-vibeui-block="bakery-003"] [data-part="carton"][data-full="true"] [data-part="lid"]{transform:rotateX(0);opacity:1;transition:transform .9s cubic-bezier(.3,.7,.2,1) .2s,opacity .2s .2s}
[data-vibeui-block="bakery-003"] [data-part="stamp"]{display:grid;justify-items:center;gap:.2rem;padding:1rem 1.6rem;border:3px solid var(--vibeui-bakery-003-accent);border-radius:1rem;color:var(--vibeui-bakery-003-accent);font-family:var(--vibeui-bakery-003-display);font-weight:700;letter-spacing:.06em;text-transform:uppercase;transform:rotate(-8deg) scale(0);opacity:.9;transition:transform .35s cubic-bezier(.2,1.6,.4,1) 1s}
[data-vibeui-block="bakery-003"] [data-part="carton"][data-full="true"] [data-part="stamp"]{transform:rotate(-8deg) scale(1)}
[data-vibeui-block="bakery-003"] [data-part="stamp"] small{font-family:var(--vibeui-bakery-003-font);font-weight:600;letter-spacing:.2em;font-size:.7rem}
[data-vibeui-block="bakery-003"] [data-part="carton"][data-full="true"] [data-part="cells"]{filter:blur(1px);opacity:.6}
[data-vibeui-block="bakery-003"] [data-part="reset"]{position:absolute;left:50%;bottom:-2.4rem;transform:translateX(-50%);color:var(--vibeui-bakery-003-muted);font-size:.85rem;white-space:nowrap;margin:0}
[data-vibeui-block="bakery-003"] [data-part="reset"] button{font:inherit;color:var(--vibeui-bakery-003-accent);background:none;border:0;cursor:pointer;padding:0;text-decoration:underline}
[data-vibeui-block="bakery-003"] [data-part="picker"]{display:flex;gap:.5rem;flex-wrap:wrap;margin:3.4rem auto 0;max-width:30rem}
[data-vibeui-block="bakery-003"] [data-part="picker"] span{width:100%;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:var(--vibeui-bakery-003-muted);font-weight:600;margin-bottom:.2rem}
[data-vibeui-block="bakery-003"] [data-part="picker"] button{display:inline-flex;align-items:center;gap:.5rem;border:0;border-radius:999px;padding:.4rem .8rem .4rem .4rem;background:var(--vibeui-bakery-003-card);color:inherit;box-shadow:0 0 0 1px var(--vibeui-bakery-003-line);font:inherit;font-size:.85rem;cursor:pointer;transition:transform .15s,box-shadow .15s}
[data-vibeui-block="bakery-003"] [data-part="picker"] button:hover{transform:translateY(-1px);box-shadow:0 0 0 1px var(--vibeui-bakery-003-line),0 8px 16px -10px rgb(0 0 0 / .4)}
[data-vibeui-block="bakery-003"] [data-part="picker"] button:disabled{opacity:.45;cursor:not-allowed;transform:none}
[data-vibeui-block="bakery-003"] [data-part="picker"] img{width:1.8rem;height:1.8rem;border-radius:50%;object-fit:cover;display:block}
[data-vibeui-block="bakery-003"] [data-part="order"]{padding:1.75rem;display:flex;flex-direction:column;border-radius:1.4rem;background:radial-gradient(18rem circle at var(--vibeui-bakery-003-x,50%) var(--vibeui-bakery-003-y,0%),color-mix(in oklab,var(--vibeui-bakery-003-accent) 10%,transparent),transparent 65%),var(--vibeui-bakery-003-card);box-shadow:0 1px 0 rgb(255 255 255 / .5) inset,0 24px 48px -32px rgb(0 0 0 / .35),0 1px 2px rgb(0 0 0 / .06)}
[data-vibeui-block="bakery-003"] [data-part="order"] form{display:flex;flex-direction:column;flex:1}
[data-vibeui-block="bakery-003"] [data-part="sum"]{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--vibeui-bakery-003-line);padding-bottom:1rem;margin-bottom:1.2rem}
[data-vibeui-block="bakery-003"] [data-part="sum"] b{font-family:var(--vibeui-bakery-003-display);font-size:1.8rem;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums;display:inline-block;animation:vibeui-bakery-003-tick .45s cubic-bezier(.2,1.4,.4,1)}
[data-vibeui-block="bakery-003"] [data-part="sum"] span{color:var(--vibeui-bakery-003-muted);font-size:.9rem}
[data-vibeui-block="bakery-003"] [data-part="lines"]{list-style:none;margin:0 0 1.2rem;padding:0;display:grid;gap:.35rem;font-size:.92rem}
[data-vibeui-block="bakery-003"] [data-part="lines"] li{display:flex;justify-content:space-between;gap:1rem;color:var(--vibeui-bakery-003-muted)}
[data-vibeui-block="bakery-003"] [data-part="lines"] li[data-empty="true"]{font-family:var(--vibeui-bakery-003-hand);font-size:1.15rem}
[data-vibeui-block="bakery-003"] label{display:grid;gap:.35rem;font-size:.82rem;font-weight:600;color:var(--vibeui-bakery-003-muted)}
[data-vibeui-block="bakery-003"] input,[data-vibeui-block="bakery-003"] select{font:inherit;font-size:.95rem;color:var(--vibeui-bakery-003-fg);padding:.75rem .9rem;border-radius:.8rem;border:1px solid var(--vibeui-bakery-003-line);background:var(--vibeui-bakery-003-panel);box-shadow:0 2px 4px rgb(0 0 0 / .06) inset;width:100%}
[data-vibeui-block="bakery-003"] input:focus-visible,[data-vibeui-block="bakery-003"] select:focus-visible,[data-vibeui-block="bakery-003"] button:focus-visible{outline:2px solid var(--vibeui-bakery-003-accent);outline-offset:2px}
[data-vibeui-block="bakery-003"] [data-part="fields"]{display:grid;gap:.8rem;grid-template-columns:1fr 1fr}
[data-vibeui-block="bakery-003"] [data-part="fields"] label:first-child{grid-column:1 / -1}
[data-vibeui-block="bakery-003"] [data-part="submit"]{width:100%;margin-top:1rem;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:999px;padding:.95rem 1.5rem;font:inherit;font-weight:600;font-size:.95rem;cursor:pointer;color:var(--vibeui-bakery-003-on-accent);background:var(--vibeui-bakery-003-accent);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 10px 24px -12px color-mix(in oklab,var(--vibeui-bakery-003-accent) 70%,transparent);transition:transform .18s,filter .18s}
[data-vibeui-block="bakery-003"] [data-part="submit"]:hover{transform:translateY(-2px);filter:brightness(1.05);box-shadow:0 1px 0 rgb(255 255 255 / .35) inset,0 16px 30px -12px color-mix(in oklab,var(--vibeui-bakery-003-accent) 85%,transparent)}
[data-vibeui-block="bakery-003"] [data-part="submit"]:active{transform:translateY(1px) scale(.97)}
[data-vibeui-block="bakery-003"] [data-part="submit"]:disabled{opacity:.5;cursor:not-allowed;transform:none}
[data-vibeui-block="bakery-003"] [data-part="how"]{margin-top:auto;padding-top:1.4rem;display:grid;grid-template-columns:4.5rem 1fr;gap:1rem;align-items:center;border-top:1px dashed var(--vibeui-bakery-003-line);color:var(--vibeui-bakery-003-muted);font-size:.86rem}
[data-vibeui-block="bakery-003"] [data-part="how"] img{width:4.5rem;height:4.5rem;object-fit:cover;border-radius:.8rem;display:block}
[data-vibeui-block="bakery-003"] [data-part="how"] p{margin:0}
[data-vibeui-block="bakery-003"] [data-part="how"] b{display:block;color:var(--vibeui-bakery-003-fg);font-weight:600;margin-bottom:.15rem}
[data-vibeui-block="bakery-003"] [data-part="done"]{padding:2rem;text-align:center;display:grid;gap:.5rem;justify-items:center}
[data-vibeui-block="bakery-003"] [data-part="done"] img{width:10rem;border-radius:1rem;display:block}
[data-vibeui-block="bakery-003"] [data-part="done"] h3{margin:0;font-family:var(--vibeui-bakery-003-hand);font-size:1.8rem;font-weight:600;color:var(--vibeui-bakery-003-accent)}
[data-vibeui-block="bakery-003"] [data-part="done"] p{margin:0;color:var(--vibeui-bakery-003-muted)}
@keyframes vibeui-bakery-003-drop{from{transform:translateY(-40%) scale(1.15);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-bakery-003-land{0%{scale:1}40%{scale:1.04 .96}100%{scale:1}}
@keyframes vibeui-bakery-003-tick{from{transform:translateY(.35em);opacity:0}to{transform:none;opacity:1}}
@keyframes vibeui-bakery-003-rise{0%{transform:translateY(112%) scaleY(.8)}70%{transform:translateY(-2%)}100%{transform:none}}
@keyframes vibeui-bakery-003-in{from{opacity:0;translate:0 1.5rem}to{opacity:1;translate:0 0}}
@container (min-width: 60rem){[data-vibeui-block="bakery-003"] [data-part="grid"]{grid-template-columns:30rem minmax(0,1fr);gap:4rem;align-items:stretch}[data-vibeui-block="bakery-003"] [data-part="scene"],[data-vibeui-block="bakery-003"] [data-part="picker"]{margin-left:0;margin-right:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="bakery-003"] *{animation:none!important;transition:none!important}[data-vibeui-block="bakery-003"] [data-part="lede"],[data-vibeui-block="bakery-003"] [data-part="scene"],[data-vibeui-block="bakery-003"] [data-part="order"],[data-vibeui-block="bakery-003"] [data-part="picker"] button{opacity:1;translate:none}[data-vibeui-block="bakery-003"] [data-part="carton"]{transform:none}}
[data-vibeui-block="bakery-003"] [data-part="word"]{display:inline-block;overflow:clip;vertical-align:top;padding:.04em .06em .14em 0;margin:-.04em 0 -.14em}
[data-vibeui-block="bakery-003"] [data-part="word"] i{display:inline-block;font-style:normal;transform:translateY(112%)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="bakery-003"] [data-part="word"] i{transform:none}
}
`

// Наклон коробки за курсором: не больше 7° по каждой оси; уход курсора — обратно.
function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  event.currentTarget.style.setProperty("--vibeui-bakery-003-ry", `${(x * 14).toFixed(2)}deg`)
  event.currentTarget.style.setProperty("--vibeui-bakery-003-rx", `${(-y * 14).toFixed(2)}deg`)
}

function untilt(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty("--vibeui-bakery-003-rx")
  event.currentTarget.style.removeProperty("--vibeui-bakery-003-ry")
}

function spotlight(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty("--vibeui-bakery-003-x", `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty("--vibeui-bakery-003-y", `${event.clientY - rect.top}px`)
}

const DEFAULT_PRODUCTS: Bakery003Product[] = [
  { id: "tartine", name: "Тартин", price: 420, image: "/demo/bakery/item-01.webp" },
  { id: "croissant", name: "Круассан", price: 190, image: "/demo/bakery/item-02.webp" },
  { id: "cinnamon", name: "Булочка с корицей", price: 240, image: "/demo/bakery/item-03.webp" },
  { id: "focaccia", name: "Фокачча", price: 210, image: "/demo/bakery/item-04.webp" },
  { id: "rye", name: "Ржаной", price: 380, image: "/demo/bakery/item-05.webp" },
  { id: "cardamom", name: "Кардамоновый узел", price: 230, image: "/demo/bakery/item-06.webp" },
  { id: "baguette", name: "Багет", price: 160, image: "/demo/bakery/item-07.webp" },
  { id: "chocolat", name: "Пан-о-шоколя", price: 210, image: "/demo/bakery/item-08.webp" },
]

type WordProps = Omit<ComponentProps<"span">, "title" | "children"> & {
  word?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function Word({
  word,
  accent,
  className,
  style,
  ...props
}: WordProps) {
  const palette = {
    ...(accent ? { "--vibeui-bakery-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
      <span
        {...props}
        className={className}
        style={palette}
      >
        <i>{word}</i>
      </span>
  )
}

/** Конструктор коробки: четыре ячейки, крышка со штампом и заказ к утру. */
export function Bakery003({
  eyebrow = "Коробка к завтраку",
  title = "Соберите коробку к утру",
  lede = "Выпечка ложится в коробку тёплой, перед самой выдачей. Заказ до 22:00 — коробка ждёт вас утром на стойке.",
  products = DEFAULT_PRODUCTS,
  size = 4,
  pickLabel = "Положить в коробку",
  emptyHints = ["сюда что-нибудь", "…", "…", "и ещё"],
  emptyLine = "коробка пока пустая",
  stampTitle = "Корка",
  stampNote = "к 8:00 · собрано",
  resetLabel = "Собрать заново",
  nameLabel = "Имя",
  phoneLabel = "Телефон",
  slotLabel = "Забрать в",
  slots = ["7:30", "8:00", "8:30", "9:00", "10:00"],
  submitLabel = "Заказать к утру",
  moreLabel = "Ещё {n} в коробку",
  howTitle = "Собираем с 7:30",
  howText = "Выпечка ложится тёплой, крышку закрываем перед выдачей. Оплата на стойке или по ссылке из сообщения.",
  howImage = "",
  doneTitle = "спасибо, что рано встали",
  doneText = "Коробка будет на стойке к выбранному времени. Пришлём напоминание за полчаса.",
  currency = "₽",
  removeLabel = "Убрать {name}",
  ofLabel = "из",
  tone = "auto",
  accent,
  ink,
  background,
  className,
  style,
}: Bakery003Props) {
  const root = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)
  const [items, setItems] = useState<Bakery003Product[]>([])
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "-10% 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const full = items.length >= size
  const total = items.reduce((sum, item) => sum + item.price, 0)

  useEffect(() => {
    const onAdd = (event: Event) => {
      const detail = (event as CustomEvent<Bakery003Product & { price: number | string }>).detail
      if (!detail?.id) return
      const known = products.find((product) => product.id === detail.id)
      const price = known?.price ?? (typeof detail.price === "number" ? detail.price : Number.parseInt(String(detail.price), 10) || 0)
      setItems((current) => (current.length >= size ? current : [...current, { ...detail, price, image: detail.image ?? known?.image }]))
    }
    window.addEventListener("vibeui-box:add", onAdd)
    return () => window.removeEventListener("vibeui-box:add", onAdd)
  }, [products, size])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("vibeui-box:state", { detail: { ids: items.map((item) => item.id), full } }))
  }, [items, full])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSent(true)
  }

  const palette = {
    ...(accent ? { "--vibeui-bakery-003-accent": accent } : null),
    ...(ink ? { "--vibeui-bakery-003-fg": ink } : null),
    ...(background ? { "--vibeui-bakery-003-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <link rel="stylesheet" href={FONTS} precedence="medium" />
      <style href="vibeui-bakery-003" precedence="medium">
        {STYLES}
      </style>
      <section ref={root} data-vibeui-block="bakery-003" data-tone={tone === "auto" ? undefined : tone} data-shown={shown} className={className} style={palette}>
        <div data-part="glow" aria-hidden="true" />
        <div data-part="shell">
          {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
          <h2 data-part="title">
            {title.split(" ").map((word, index, all) => (
              <span key={`${word}-${index}`}>
                <Word data-part="word" word={word} style={{ ["--vibeui-bakery-003-n" as string]: index }} accent={accent} />
                {index < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          {lede ? <p data-part="lede">{lede}</p> : null}
          <div data-part="grid">
            <div>
              <div data-part="scene" onPointerMove={tilt} onPointerLeave={untilt}>
                <div data-part="carton" data-full={full}>
                  <div data-part="cells">
                    {Array.from({ length: size }, (_, i) => {
                      const item = items[i]
                      return (
                        <div key={i} data-part="cell" data-filled={Boolean(item)}>
                          {item ? (
                            <>
                              {item.image ? <img src={item.image} alt={item.name} /> : <span data-part="empty">{item.name}</span>}
                              <button type="button" data-part="out" aria-label={removeLabel.replace("{name}", item.name)} onClick={() => setItems((current) => current.filter((_, index) => index !== i))}>
                                ×
                              </button>
                            </>
                          ) : (
                            <span data-part="empty" aria-hidden="true">
                              {emptyHints[i] ?? "…"}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div data-part="lid" aria-hidden="true">
                    <div data-part="stamp">
                      {stampTitle}
                      <small>{stampNote}</small>
                    </div>
                  </div>
                </div>
                {full ? (
                  <p data-part="reset">
                    <button type="button" onClick={() => setItems([])}>
                      {resetLabel}
                    </button>
                  </p>
                ) : null}
              </div>
              <div data-part="picker" aria-label={pickLabel}>
                <span>{pickLabel}</span>
                {products.map((product, index) => (
                  <button key={product.id} type="button" disabled={full} style={{ ["--vibeui-bakery-003-i" as string]: index }} onClick={() => setItems((current) => (current.length >= size ? current : [...current, product]))}>
                    {product.image ? <img src={product.image} alt="" /> : null}
                    {product.name}
                  </button>
                ))}
              </div>
            </div>
            <div data-part="order" onPointerMove={spotlight}>
              {sent ? (
                <div data-part="done">
                  {howImage ? <img src={howImage} alt="" /> : null}
                  <h3>{doneTitle}</h3>
                  <p>{doneText}</p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div data-part="sum">
                    <span>
                      {items.length} {ofLabel} {size}
                    </span>
                    <b key={total}>
                      {total} {currency}
                    </b>
                  </div>
                  <ul data-part="lines">
                    {items.length === 0 ? (
                      <li data-empty="true">{emptyLine}</li>
                    ) : (
                      items.map((item, i) => (
                        <li key={`${item.id}-${i}`}>
                          <span>{item.name}</span>
                          <span>
                            {item.price} {currency}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                  <div data-part="fields">
                    <label>
                      {nameLabel}
                      <input type="text" name="name" required />
                    </label>
                    <label>
                      {phoneLabel}
                      <input type="tel" name="phone" required />
                    </label>
                    <label>
                      {slotLabel}
                      <select name="slot" defaultValue={slots[1] ?? slots[0]}>
                        {slots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <button type="submit" data-part="submit" disabled={!full}>
                    {full ? submitLabel : moreLabel.replace("{n}", String(size - items.length))}
                  </button>
                  {howTitle ? (
                    <div data-part="how">
                      {howImage ? <img src={howImage} alt="" /> : <span />}
                      <p>
                        <b>{howTitle}</b>
                        {howText}
                      </p>
                    </div>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
