"use client"

import type { ComponentProps, CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"

export type Card110Props = Omit<ComponentProps<"article">, "title" | "children"> & {
  name?: string
  no?: string
  time?: string
  lines?: readonly string[]
  sum?: string
  reviewLabel?: string
  brand?: string
  place?: string
  totalLabel?: string
  guestLabel?: string
  thanks?: string
  index?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

function useShown<T extends HTMLElement>(rootMargin: string) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return { ref, shown }
}

// Часть блока testimonials-023, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-110"]){
--vibeui-card-110-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-110-hand:"Caveat",cursive;
--vibeui-card-110-ink:#2b2622;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-110"]{color-scheme:dark}
[data-vibeui-block="card-110"]{box-sizing:border-box}
[data-vibeui-block="card-110"] *{box-sizing:border-box}
[data-vibeui-block="card-110"]::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 3px,rgb(0 0 0 / .025) 3px 4px);pointer-events:none}
[data-vibeui-block="card-110"] > *{opacity:0;transform:translateY(-.2rem)}
[data-vibeui-block="card-110"] [data-part="head"]{display:flex;justify-content:space-between;font-weight:700;letter-spacing:.06em}
[data-vibeui-block="card-110"] [data-part="dash"]{border:0;border-top:1px dashed rgb(0 0 0 / .35);margin:.55rem 0}
[data-vibeui-block="card-110"] [data-part="line"]{display:block}
[data-vibeui-block="card-110"] [data-part="foot"]{display:flex;justify-content:space-between;font-weight:700}
[data-vibeui-block="card-110"] [data-part="guest"]{text-transform:uppercase;letter-spacing:.08em;font-size:.72rem;color:#6b625b}
[data-vibeui-block="card-110"] [data-part="thanks"]{font-family:var(--vibeui-card-110-hand);font-size:1.2rem;color:var(--vibeui-card-110-accent);text-align:center;margin-top:.4rem}
[data-vibeui-block="card-110"] [data-part="bar"]{height:.55rem;margin-top:.5rem;background:repeating-linear-gradient(90deg,var(--vibeui-card-110-ink) 0 2px,transparent 2px 3px,var(--vibeui-card-110-ink) 3px 6px,transparent 6px 7px,var(--vibeui-card-110-ink) 7px 8px,transparent 8px 11px)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-110"] > *{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-110"] *{animation:none!important;transition:none!important}}
`

/** Отзыв в виде кассового чека: шапка с брендом и местом, строки, итог и благодарность; печатается при появлении. */
export function Card110({
  name = "Марина",
  no = "0412",
  time,
  lines = ["Тартин ещё тёплый,", "корка хрустит на весь", "трамвай. Соседи смотрели."],
  sum,
  reviewLabel = "Отзыв: {name}",
  brand = "Корка",
  place = "Хамовники",
  totalLabel = "ИТОГО",
  guestLabel = "гость",
  thanks = "спасибо, приходите к горячему",
  index = 0,
  accent,
  className,
  style,
  ...props
}: Card110Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-110-accent": accent } : null),
    ...style,
  } as CSSProperties
  const { ref, shown } = useShown<HTMLDivElement>("-15% 0px")

  const rotate = [-2.5, 1.5, -1, 2.2][index % 4]
  // Сколько элементов печатается — чтобы бумага выползала в такт строкам.
  const count = 4 + lines.length + (sum ? 1 : 0) + (thanks ? 1 : 0) + 1
  let i = 0
  const next = () => ({ ["--vibeui-card-110-i" as string]: i++ }) as CSSProperties

  return (
    <>
      <style href="vibeui-card-110" precedence="medium">
        {STYLES}
      </style>
      <article
      {...props}
      data-slot="card"
      data-vibeui-block="card-110" aria-label={reviewLabel.replace("{name}", name)}
      className={className}
      style={palette}
      >
        <div data-part="head" style={next()}>
          <span>{brand.toUpperCase()}</span>
          <span>№ {no}</span>
        </div>
        <div style={next()}>
          {time ? `${time} · ` : ""}
          {place}
        </div>
        <hr data-part="dash" style={next()} />
        {lines.map((line) => (
          <span key={line} data-part="line" style={next()}>
            {line}
          </span>
        ))}
        <hr data-part="dash" style={next()} />
        {sum ? (
          <div data-part="foot" style={next()}>
            <span>{totalLabel}</span>
            <span>{sum}</span>
          </div>
        ) : null}
        <div data-part="guest" style={next()}>
          {guestLabel}: {name}
        </div>
        {thanks ? (
          <div data-part="thanks" style={next()}>
            {thanks}
          </div>
        ) : null}
        <div data-part="bar" style={next()} aria-hidden="true" />
      </article>
    </>
  )
}
