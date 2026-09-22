"use client"

import type { ComponentProps, CSSProperties } from "react"
import { useState } from "react"

export type Card085Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  dish?: string
  name?: string
  meta?: string
  text?: string
  reactions?: Readonly<Record<string, number>>
  reactionsLabel?: string
  emojis?: readonly string[]
  reactionLabel?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

const TILTS = [-2.5, 1.8, -1.2, 2.4, -1.8, 1.4]

// Часть блока delivery-005, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-085"]){
--vibeui-card-085-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-085-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-085-display:"Unbounded",ui-sans-serif,system-ui,sans-serif;
--vibeui-card-085-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-085-hand:"Caveat",cursive;
--vibeui-card-085-lemon:color-mix(in oklab,var(--vibeui-card-085-fg) 70%,#ffd400);
--vibeui-card-085-mint:color-mix(in oklab,var(--vibeui-card-085-fg) 72%,#38d39f);
--vibeui-card-085-on-accent:oklch(from var(--vibeui-card-085-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-085-on-fg:oklch(from var(--vibeui-card-085-fg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-085-paper:var(--vibeui-card-085-fg);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-085"]{color-scheme:dark}
[data-vibeui-block="card-085"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-085"] *{box-sizing:border-box}
@keyframes vibeui-card-085-pop{40%{transform:translateY(-.5rem) scale(1.5) rotate(-12deg)}}
[data-vibeui-block="card-085"]{position:relative;display:grid;gap:.8rem;padding:1.6rem 1.3rem 1.2rem;border-radius:.4rem;background:var(--vibeui-card-085-paper);color:var(--vibeui-card-085-on-fg);box-shadow:0 20px 40px -22px rgb(0 0 0 / .6);transform:rotate(var(--vibeui-delivery-005-r));transition:transform .35s cubic-bezier(.2,.8,.2,1)}
[data-vibeui-block="card-085"]:hover{transform:rotate(0) translateY(-4px) scale(1.02);z-index:2}
[data-vibeui-block="card-085"][data-color="lemon"]{background:var(--vibeui-card-085-lemon)}
[data-vibeui-block="card-085"][data-color="mint"]{background:var(--vibeui-card-085-mint)}
[data-vibeui-block="card-085"][data-color="accent"]{background:var(--vibeui-card-085-accent);color:var(--vibeui-card-085-on-accent)}
[data-vibeui-block="card-085"]::before{content:"";position:absolute;left:50%;top:-.6rem;width:5rem;height:1.3rem;transform:translateX(-50%) rotate(var(--vibeui-delivery-005-t));background:rgb(255 255 255 / .45);backdrop-filter:blur(2px);box-shadow:0 1px 3px rgb(0 0 0 / .15)}
[data-vibeui-block="card-085"] [data-part="who"]{display:flex;align-items:baseline;justify-content:space-between;gap:.6rem}
[data-vibeui-block="card-085"] [data-part="who"] b{font-family:var(--vibeui-card-085-display);font-weight:700;font-size:.95rem}
[data-vibeui-block="card-085"] [data-part="who"] span{font-size:.78rem;opacity:.7;text-align:right}
[data-vibeui-block="card-085"] [data-part="text"]{margin:0;font-family:var(--vibeui-card-085-hand);font-size:1.45rem;line-height:1.25}
[data-vibeui-block="card-085"] [data-part="dish"]{position:absolute;right:-.5rem;top:1rem;padding:.3rem .6rem;border-radius:.4rem;background:var(--vibeui-card-085-bg);color:var(--vibeui-card-085-fg);font-size:.68rem;font-weight:800;letter-spacing:.05em;text-transform:uppercase;transform:rotate(6deg);box-shadow:0 6px 14px -6px rgb(0 0 0 / .5)}
[data-vibeui-block="card-085"] [data-part="reactions"]{display:flex;flex-wrap:wrap;gap:.4rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="card-085"] [data-part="reactions"] button{display:inline-flex;align-items:center;gap:.3rem;height:1.9rem;padding:0 .6rem 0 .45rem;border-radius:999px;border:1px solid rgb(0 0 0 / .12);background:rgb(255 255 255 / .55);color:#1a1a1a;font:inherit;font-size:.8rem;font-weight:700;cursor:pointer;transition:transform .18s cubic-bezier(.34,1.56,.64,1),background .2s}
[data-vibeui-block="card-085"] [data-part="reactions"] button:hover{transform:scale(1.08);background:rgb(255 255 255 / .8)}
[data-vibeui-block="card-085"] [data-part="reactions"] button[data-on="true"]{background:#1a1a1a;color:#fff;border-color:transparent}
[data-vibeui-block="card-085"] [data-part="reactions"] button:focus-visible{outline:2px solid #1a1a1a;outline-offset:2px}
[data-vibeui-block="card-085"] [data-part="reactions"] i{font-style:normal;font-size:1rem;line-height:1;display:inline-block}
[data-vibeui-block="card-085"] [data-part="reactions"] button[data-pop="true"] i{animation:vibeui-card-085-pop .45s cubic-bezier(.34,1.56,.64,1)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-085"] *{animation:none!important;transition:none!important}}
`

/** Стикер-отзыв: имя, текст и реакции эмодзи со счётчиками. */
export function Card085({
  dish = "смэш",
  name = "Катя",
  meta = "Бауманская · 14-й заказ",
  text = "Смэш приехал за 19 минут и был реально хрустящим. Соус «Горячо» — отдельная любовь, берите двойной.",
  reactions,
  reactionsLabel = "Реакции",
  emojis = ["🔥", "😋", "❤️"],
  reactionLabel = "Реакция {emoji}: {n}",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card085Props) {
  const [counts, setCounts] = useState<Record<string, number>>(() => ({ ...reactions }))
  const [mine, setMine] = useState<string | null>(null)
  const [pop, setPop] = useState<string | null>(null)

  const react = (emoji: string) => {
    setCounts((map) => {
      const copy = { ...map }
      if (mine === emoji) {
        copy[emoji] = Math.max(0, (copy[emoji] ?? 0) - 1)
      } else {
        if (mine) copy[mine] = Math.max(0, (copy[mine] ?? 0) - 1)
        copy[emoji] = (copy[emoji] ?? 0) + 1
      }
      return copy
    })
    setMine((current) => (current === emoji ? null : emoji))
    setPop(emoji)
    window.setTimeout(() => setPop(null), 500)
  }

  const stickerStyle = { ["--vibeui-card-085-r" as string]: `${TILTS[index % TILTS.length]}deg`, ["--vibeui-card-085-t" as string]: `${(index % 2 ? 4 : -3)}deg` } as CSSProperties
  const palette = {
    ...stickerStyle,
    ...(accent ? { "--vibeui-card-085-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-085" precedence="medium">
        {STYLES}
      </style>
      <li
          {...props}
          data-slot="card"
          data-vibeui-block="card-085"
          className={className}
          style={palette}
        >
        {dish ? <span data-part="dish">{dish}</span> : null}
        <p data-part="who">
          <b>{name}</b>
          {meta ? <span>{meta}</span> : null}
        </p>
        <blockquote data-part="text">{text}</blockquote>
        <ul data-part="reactions" aria-label={reactionsLabel}>
          {emojis.map((emoji) => (
            <li key={emoji}>
              <button type="button" data-on={mine === emoji} data-pop={pop === emoji} aria-pressed={mine === emoji} aria-label={reactionLabel.replace("{emoji}", emoji).replace("{n}", String(counts[emoji] ?? 0))} onClick={() => react(emoji)}>
                <i aria-hidden="true">{emoji}</i>
                {counts[emoji] ?? 0}
              </button>
            </li>
          ))}
        </ul>
      </li>
    </>
  )
}
