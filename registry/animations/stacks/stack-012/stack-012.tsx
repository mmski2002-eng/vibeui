"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Stack012Snapshot = {
  /** Фото снимка. Пусто — брендовая плашка с номером. */
  src?: string
  title: string
  /** Подпись даты у деления шкалы. */
  date: string
}

export type Stack012Props = Omit<ComponentProps<"div">, "children"> & {
  snapshots?: Stack012Snapshot[]
  /** Индекс стартового снимка. */
  initial?: number
  accent?: string
  label?: string
}

// Идея: стопка «машины времени» — снимки уходят вглубь перспективой, как
// версии файла, а шкала справа листает их: наведение на деление показывает
// дату и выдвигает активный снимок; пройденные вылетают на зрителя и гаснут.
//
// Состояние — активный и подсвеченный индексы в useState; геометрия снимков
// на CSS-переменных от расстояния до активного. Панель тёмная в любой теме —
// это «плёнка», а не карточка интерфейса.
const STYLES = `
:where([data-vibeui-block="stack-012"]){
--vibeui-stack-012-bg:oklch(0.13 0 0 / 88%);
--vibeui-stack-012-card:oklch(0.2178 0 0);
--vibeui-stack-012-fg:oklch(0.95 0 0);
--vibeui-stack-012-accent:oklch(0.92 0 0);
--vibeui-stack-012-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-stack-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="stack-012"]{
position:relative;display:flex;align-items:center;justify-content:center;gap:1.5rem;
box-sizing:border-box;width:26rem;max-width:100%;padding:1rem;overflow:hidden;
border-radius:1rem;border:1px solid oklch(1 0 0 / 6%);background:var(--vibeui-stack-012-bg);
color:var(--vibeui-stack-012-fg);font-family:var(--vibeui-stack-012-font);color-scheme:dark;
}
[data-vibeui-block="stack-012"] *{box-sizing:border-box}
[data-vibeui-block="stack-012"]::before{
content:"";position:absolute;inset:0;pointer-events:none;
background:radial-gradient(ellipse at center,oklch(1 0 0 / 3%),transparent 70%);
}
[data-vibeui-block="stack-012"] [data-part="stage"]{
position:relative;flex:1 1 0;min-width:0;max-width:18rem;aspect-ratio:4/3;
display:flex;align-items:center;justify-content:center;perspective:800px;
}
[data-vibeui-block="stack-012"] [data-part="shot"]{
position:absolute;width:min(13.75rem,100%);aspect-ratio:220/135;overflow:hidden;border-radius:1rem;
background:var(--vibeui-stack-012-card);pointer-events:none;transform-origin:center;
transform:translateY(var(--vibeui-stack-012-y)) translateZ(var(--vibeui-stack-012-z))
rotateX(var(--vibeui-stack-012-rx)) scale(var(--vibeui-stack-012-s));
opacity:var(--vibeui-stack-012-o);
transition:transform .6s cubic-bezier(.22,1.1,.36,1),opacity .45s;
transition:transform .6s var(--vibeui-stack-012-ease),opacity .45s;
will-change:transform,opacity;
}
[data-vibeui-block="stack-012"] [data-part="shot"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="stack-012"] [data-part="shot"]::after{
content:"";position:absolute;inset:0;background:oklch(0 0 0 / 10%);
}
[data-vibeui-block="stack-012"] [data-part="shot"][data-empty="true"]{
background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-stack-012-accent) 26%,var(--vibeui-stack-012-card)),var(--vibeui-stack-012-card) 70%);
}
[data-vibeui-block="stack-012"] [data-part="num"]{
position:absolute;left:0.75rem;top:0.5rem;font-size:0.75rem;font-weight:700;
letter-spacing:0.04em;color:var(--vibeui-stack-012-accent);
}
[data-vibeui-block="stack-012"] [data-part="scale"]{
position:relative;z-index:2;display:flex;flex-direction:column;align-items:flex-end;
margin:0;padding:0.5rem 0.25rem;list-style:none;
}
[data-vibeui-block="stack-012"] [data-part="tick"]{
appearance:none;border:0;margin:0;background:transparent;font:inherit;color:inherit;
position:relative;display:flex;justify-content:flex-end;align-items:center;
width:5rem;padding:1px 0;cursor:pointer;
}
[data-vibeui-block="stack-012"] [data-part="tick"]:focus-visible{outline:none}
[data-vibeui-block="stack-012"] [data-part="tick"]:focus-visible [data-part="bar"]{outline:2px solid var(--vibeui-stack-012-accent);outline-offset:2px}
[data-vibeui-block="stack-012"] [data-part="bar"]{
display:block;width:1.5rem;height:3px;border-radius:9999px;transform-origin:right center;
background:oklch(1 0 0 / 50%);transform:scaleX(var(--vibeui-stack-012-sx,1));
transition:transform .35s cubic-bezier(.22,1.3,.36,1),background .2s,opacity .2s;
}
[data-vibeui-block="stack-012"] [data-part="tick"]:hover [data-part="bar"]{background:oklch(1 0 0 / 80%)}
[data-vibeui-block="stack-012"] [data-part="tick"][aria-current="true"] [data-part="bar"]{background:var(--vibeui-stack-012-accent);color:oklch(from var(--vibeui-stack-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="stack-012"] [data-part="tick"][data-minor="true"] [data-part="bar"]{
background:oklch(1 0 0 / 20%);opacity:var(--vibeui-stack-012-op,0.3);
}
[data-vibeui-block="stack-012"] [data-part="date"]{
position:absolute;top:0;right:2.5rem;font-size:0.625rem;font-weight:650;white-space:nowrap;
color:color-mix(in oklab,var(--vibeui-stack-012-fg) 90%,transparent);
animation:vibeui-stack-012-pop .15s ease-out both;
}
[data-vibeui-block="stack-012"] [data-part="tick"][aria-current="true"] [data-part="date"]{color:var(--vibeui-stack-012-accent)}
@keyframes vibeui-stack-012-pop{from{opacity:0;filter:blur(2px);transform:scale(0.8)}to{opacity:1;filter:none;transform:none}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="stack-012"] :is([data-part="shot"],[data-part="bar"]){transition:none}
[data-vibeui-block="stack-012"] [data-part="date"]{animation:none}
}
`

const DEFAULT_SNAPSHOTS: Stack012Snapshot[] = [
  { title: "Клавиатура", date: "Сегодня" },
  { title: "Гарнитура", date: "Вчера" },
  { title: "Джерси", date: "Неделю назад" },
  { title: "Трофей", date: "Месяц назад" },
  { title: "Мышь", date: "Год назад" },
]

type Tick = { index: number; minor: boolean }

// Между соседними снимками — два промежуточных деления: они делают шкалу
// «плотной», а наведение на них листает к ближайшему снимку.
function ticksFor(count: number): Tick[] {
  const ticks: Tick[] = []

  for (let index = 0; index < count; index += 1) {
    ticks.push({ index, minor: false })

    if (index < count - 1) {
      ticks.push({ index: index + 0.33, minor: true })
      ticks.push({ index: index + 0.66, minor: true })
    }
  }

  return ticks
}

/**
 * Стопка «машины времени»: снимки уходят вглубь перспективой, шкала справа
 * листает их по наведению и клику. Один файл, ноль зависимостей.
 */
export function Stack012({
  snapshots = DEFAULT_SNAPSHOTS,
  initial = 0,
  accent,
  label = "История снимков",
  className,
  style,
  ...props
}: Stack012Props) {
  const last = Math.max(0, snapshots.length - 1)
  const [active, setActive] = useState(Math.min(Math.max(0, initial), last))
  const [hovered, setHovered] = useState<number | null>(null)
  const palette = {
    ...(accent ? { "--vibeui-stack-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  const scrub = (index: number) => {
    setHovered(index)
    setActive(Math.round(index))
  }

  return (
    <>
      <style href="vibeui-stack-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="stack-012"
        data-slot="time-machine"
        role="region"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="stage" aria-hidden="true">
          {snapshots.map((snapshot, index) => {
            const offset = index - active
            const past = offset < 0
            const shotStyle = {
              zIndex: snapshots.length - index,
              "--vibeui-stack-012-z": past ? "200px" : `${-offset * 60}px`,
              "--vibeui-stack-012-y": past ? "300px" : `${-offset * 12}px`,
              "--vibeui-stack-012-rx": past ? "-20deg" : `${offset * 2}deg`,
              "--vibeui-stack-012-o": past ? 0 : 1 - offset * 0.2,
              "--vibeui-stack-012-s": past ? 1.3 : 1,
            } as CSSProperties

            return (
              <div
                key={snapshot.title + index}
                data-part="shot"
                data-empty={snapshot.src ? undefined : "true"}
                style={shotStyle}
              >
                {snapshot.src ? (
                  <img src={snapshot.src} alt="" loading="lazy" />
                ) : (
                  <span data-part="num">{index + 1}</span>
                )}
              </div>
            )
          })}
        </div>

        <ul data-part="scale" onMouseLeave={() => setHovered(null)}>
          {ticksFor(snapshots.length).map((tick) => {
            const near =
              hovered !== null && Math.abs(tick.index - hovered) <= 0.5

            if (tick.minor) {
              return (
                <li key={tick.index}>
                  <button
                    type="button"
                    data-part="tick"
                    data-minor="true"
                    tabIndex={-1}
                    aria-hidden="true"
                    onMouseEnter={() => scrub(tick.index)}
                    onClick={() => setActive(Math.round(tick.index))}
                    style={
                      {
                        "--vibeui-stack-012-sx": near ? 1.15 : 1,
                        "--vibeui-stack-012-op": near ? 0.5 : 0.3,
                      } as CSSProperties
                    }
                  >
                    <span data-part="bar" />
                  </button>
                </li>
              )
            }

            const snapshot = snapshots[tick.index]
            const current = active === tick.index
            const stretch =
              hovered === null ? 1 : current ? 1.4 : near ? 1.25 : 1

            return (
              <li key={tick.index}>
                <button
                  type="button"
                  data-part="tick"
                  aria-label={`${snapshot.title}, ${snapshot.date}`}
                  aria-current={current ? "true" : undefined}
                  onMouseEnter={() => scrub(tick.index)}
                  onFocus={() => scrub(tick.index)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setActive(tick.index)}
                  style={{ "--vibeui-stack-012-sx": stretch } as CSSProperties}
                >
                  {hovered === tick.index ? (
                    <span data-part="date">{snapshot.date}</span>
                  ) : null}
                  <span data-part="bar" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
