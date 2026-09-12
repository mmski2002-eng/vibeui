"use client"

import { useEffect, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Cursor003Node = {
  label: string
  /** Доли кадра: левый край, верх, ширина, высота. */
  box: [number, number, number, number]
}

export type Cursor003Props = Omit<ComponentProps<"div">, "children"> & {
  /** Элементы макета, к краям которых липнут направляющие. */
  nodes?: Cursor003Node[]
  /** Шаг сетки в пикселях: к нему прицел липнет, когда рядом нет края. */
  grid?: number
  /** Радиус прилипания к краю элемента в пикселях. */
  snap?: number
  /** Цвет направляющих и замеров. */
  accent?: string
  /** Реакция на курсор. */
  interactive?: boolean
}

const DEFAULT_NODES: Cursor003Node[] = [
  { label: "Шапка", box: [0.06, 0.12, 0.88, 0.14] },
  { label: "Карточка", box: [0.06, 0.34, 0.4, 0.42] },
  { label: "Список", box: [0.52, 0.34, 0.42, 0.24] },
  { label: "Кнопка", box: [0.52, 0.64, 0.18, 0.12] },
]

// Идея компонента: курсор как инструмент, а не украшение. Перекрестье идёт
// во всю ширину и высоту кадра, рядом висят координаты, а направляющие
// липнут к краям и центрам элементов — ровно так ведут себя направляющие в
// редакторах макетов.
//
// Прилипание считается по расстоянию до каждой грани: ближайшая забирает
// направляющую себе, и тогда же появляется замер до неё. Когда рядом нет ни
// одной грани, прицел садится на сетку: свободная координата в дизайне почти
// всегда ошибка.
//
// Тема берётся из color-scheme окружения через light-dark(): макет темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="cursor-003"]){
--vibeui-cursor-003-paper:light-dark(oklch(0.99 0 0),oklch(0.15 0 0));
--vibeui-cursor-003-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cursor-003-muted:color-mix(in oklab,var(--vibeui-cursor-003-ink) 50%,transparent);
--vibeui-cursor-003-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 16%));
--vibeui-cursor-003-surface:light-dark(oklch(0.97 0 0),oklch(0.19 0 0));
--vibeui-cursor-003-accent:light-dark(oklch(0.58 0.22 25),oklch(0.72 0.19 25));
--vibeui-cursor-003-guide:color-mix(in oklab,var(--vibeui-cursor-003-ink) 28%,transparent);
--vibeui-cursor-003-x:50%;
--vibeui-cursor-003-y:50%;
--vibeui-cursor-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cursor-003-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cursor-003"]{color-scheme:dark}
[data-vibeui-block="cursor-003"]{
position:relative;box-sizing:border-box;width:100%;aspect-ratio:16/9;min-height:12rem;
overflow:hidden;border:1px solid var(--vibeui-cursor-003-border);border-radius:0.75rem;
background:var(--vibeui-cursor-003-paper);color:var(--vibeui-cursor-003-ink);
font-family:var(--vibeui-cursor-003-font);
/* Родной курсор мешает: у прицела своё перекрестье и своя точка. */
cursor:none;touch-action:pan-y;
}
[data-vibeui-block="cursor-003"] *{box-sizing:border-box}
/* Сетка макета: к её шагу прицел липнет, когда рядом нет граней. */
[data-vibeui-block="cursor-003"] [data-part="grid"]{
position:absolute;inset:0;pointer-events:none;
background-image:
linear-gradient(90deg,var(--vibeui-cursor-003-border) 1px,transparent 1px),
linear-gradient(180deg,var(--vibeui-cursor-003-border) 1px,transparent 1px);
background-size:var(--vibeui-cursor-003-grid,2rem) var(--vibeui-cursor-003-grid,2rem);
opacity:0.55;
}
/* Элементы макета: это не декорация, а то, к чему липнут направляющие. */
[data-vibeui-block="cursor-003"] [data-part="node"]{
position:absolute;border-radius:0.5rem;
background:var(--vibeui-cursor-003-surface);
border:1px solid var(--vibeui-cursor-003-border);
display:flex;align-items:flex-start;padding:0.5rem 0.625rem;
font-size:0.6875rem;color:var(--vibeui-cursor-003-muted);
transition:border-color 0.15s ease,color 0.15s ease;
}
[data-vibeui-block="cursor-003"] [data-part="node"][data-hot="true"]{
border-color:color-mix(in oklab,var(--vibeui-cursor-003-accent) 65%,transparent);
color:var(--vibeui-cursor-003-accent);
}
/* Направляющие: пунктир, пока прицел свободен, сплошной акцент — когда он
   прилип к грани. Разница должна читаться боковым зрением. */
[data-vibeui-block="cursor-003"] [data-part="guide"]{
position:absolute;pointer-events:none;z-index:3;
background:repeating-linear-gradient(var(--vibeui-cursor-003-angle,90deg),
var(--vibeui-cursor-003-guide) 0 4px,transparent 4px 8px);
opacity:0;transition:opacity 0.15s ease;
}
[data-vibeui-block="cursor-003"] [data-part="guide"][data-axis="x"]{
left:var(--vibeui-cursor-003-x);top:0;bottom:0;width:1px;
--vibeui-cursor-003-angle:180deg;
}
[data-vibeui-block="cursor-003"] [data-part="guide"][data-axis="y"]{
top:var(--vibeui-cursor-003-y);left:0;right:0;height:1px;
--vibeui-cursor-003-angle:90deg;
}
[data-vibeui-block="cursor-003"] [data-part="guide"][data-snapped="true"]{
background:var(--vibeui-cursor-003-accent);color:oklch(from var(--vibeui-cursor-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="cursor-003"][data-pointer="true"] [data-part="guide"]{opacity:1}
/* Замер: расстояние до грани, к которой прилип прицел. */
[data-vibeui-block="cursor-003"] [data-part="measure"]{
position:absolute;pointer-events:none;z-index:4;
background:color-mix(in oklab,var(--vibeui-cursor-003-accent) 18%,transparent);
border-block:1px solid var(--vibeui-cursor-003-accent);
opacity:0;
}
[data-vibeui-block="cursor-003"] [data-part="measure"][data-on="true"]{opacity:1}
[data-vibeui-block="cursor-003"] [data-part="tag"]{
/* left/top обязательны: без них absolute берёт автоматическое положение, и
   transform уводит плашку не от угла кадра, а от места в потоке. Отступ от
   курсора живёт в margin — transform занят скриптом. */
position:absolute;left:0;top:0;margin:0.75rem 0 0 0.75rem;
z-index:5;pointer-events:none;
padding:0.125rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-cursor-003-accent);color:oklch(from var(--vibeui-cursor-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-family:var(--vibeui-cursor-003-mono);font-size:0.625rem;font-weight:620;
white-space:nowrap;opacity:0;transition:opacity 0.15s ease;
}
[data-vibeui-block="cursor-003"][data-pointer="true"] [data-part="tag"]{opacity:1}
/* Точка прицела: маленький крест, а не стрелка — курсор здесь инструмент. */
[data-vibeui-block="cursor-003"] [data-part="cross"]{
position:absolute;left:0;top:0;z-index:6;pointer-events:none;
width:0.875rem;height:0.875rem;margin:-0.4375rem 0 0 -0.4375rem;
opacity:0;transition:opacity 0.15s ease;
/* Крест виден и в маленькой карточке каталога: тонкая линия там пропадала. */
background:
linear-gradient(var(--vibeui-cursor-003-accent),var(--vibeui-cursor-003-accent)) center/1.5px 100% no-repeat,
linear-gradient(var(--vibeui-cursor-003-accent),var(--vibeui-cursor-003-accent)) center/100% 1.5px no-repeat;
}
[data-vibeui-block="cursor-003"][data-pointer="true"] [data-part="cross"]{opacity:1}
[data-vibeui-block="cursor-003"] [data-part="hint"]{
position:absolute;left:50%;bottom:0.75rem;transform:translateX(-50%);z-index:2;
pointer-events:none;font-size:0.75rem;color:var(--vibeui-cursor-003-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="cursor-003"] *{animation:none!important;transition:none!important}
}
`

/**
 * Прицел дизайнера: перекрестье во весь кадр, координаты у курсора и
 * направляющие, липнущие к краям элементов и к сетке. Один файл, ноль
 * зависимостей.
 */
export function Cursor003({
  nodes = DEFAULT_NODES,
  grid = 32,
  snap = 10,
  accent,
  interactive = true,
  className,
  style,
  ...props
}: Cursor003Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const settings = useRef({ grid, snap, interactive })

  useEffect(() => {
    settings.current = { grid, snap, interactive }
  })

  useEffect(() => {
    const host = hostRef.current

    if (!host) return

    const guideX = host.querySelector<HTMLElement>('[data-axis="x"]')
    const guideY = host.querySelector<HTMLElement>('[data-axis="y"]')
    const tag = host.querySelector<HTMLElement>('[data-part="tag"]')
    const cross = host.querySelector<HTMLElement>('[data-part="cross"]')
    const measure = host.querySelector<HTMLElement>('[data-part="measure"]')

    if (!guideX || !guideY || !tag || !cross || !measure) return

    /**
     * Ближайшая грань по оси. Кроме краёв берётся ещё и центр: в макетах по
     * центру выравнивают не реже, чем по краю.
     */
    const stick = (
      value: number,
      edges: number[],
      limit: number,
    ): { at: number; edge: number | null } => {
      let best: number | null = null
      let distance = limit

      for (const edge of edges) {
        const gap = Math.abs(value - edge)

        if (gap <= distance) {
          distance = gap
          best = edge
        }
      }

      return { at: best ?? value, edge: best }
    }

    const move = (event: PointerEvent) => {
      const current = settings.current

      if (!current.interactive) return

      const box = host.getBoundingClientRect()

      if (box.width === 0 || box.height === 0) return

      const rawX = event.clientX - box.left
      const rawY = event.clientY - box.top
      const boxes = [...host.querySelectorAll<HTMLElement>('[data-part="node"]')]
      const vertical: number[] = []
      const horizontal: number[] = []

      for (const node of boxes) {
        const rect = node.getBoundingClientRect()
        const left = rect.left - box.left
        const top = rect.top - box.top

        vertical.push(left, left + rect.width, left + rect.width / 2)
        horizontal.push(top, top + rect.height, top + rect.height / 2)
      }

      const snapX = stick(rawX, vertical, current.snap)
      const snapY = stick(rawY, horizontal, current.snap)
      // Сетка — запасная опора: свободная координата в макете почти всегда
      // случайность, а не решение.
      const x =
        snapX.edge === null
          ? Math.round(rawX / current.grid) * current.grid
          : snapX.at
      const y =
        snapY.edge === null
          ? Math.round(rawY / current.grid) * current.grid
          : snapY.at

      host.style.setProperty("--vibeui-cursor-003-x", `${x}px`)
      host.style.setProperty("--vibeui-cursor-003-y", `${y}px`)
      host.dataset.pointer = "true"

      guideX.dataset.snapped = snapX.edge === null ? "false" : "true"
      guideY.dataset.snapped = snapY.edge === null ? "false" : "true"

      // Крест и плашка идут ровно за рукой: прилипают направляющие, а не сам
      // курсор. Курсор, отстающий от руки, читается как подвисший интерфейс.
      cross.style.transform = `translate3d(${rawX}px, ${rawY}px, 0)`
      tag.style.transform = `translate3d(${rawX}px, ${rawY}px, 0)`
      tag.textContent = `${Math.round(x)} × ${Math.round(y)}`

      // Замер: полоса от прицела до грани, к которой он прилип. Без числа
      // это просто линия, поэтому расстояние подписывается на месте.
      const gap = Math.abs(rawX - x)

      if (snapX.edge !== null && gap > 0.5) {
        measure.dataset.on = "true"
        measure.style.left = `${Math.min(rawX, x)}px`
        measure.style.width = `${gap}px`
        measure.style.top = `${y - 3}px`
        measure.style.height = "6px"
      } else {
        measure.dataset.on = "false"
      }

      // Подсветка элемента: он «горит», если направляющая села на одну из
      // его собственных граней или на его центр.
      for (const node of boxes) {
        const rect = node.getBoundingClientRect()
        const left = rect.left - box.left
        const top = rect.top - box.top
        const onX =
          snapX.edge !== null &&
          [left, left + rect.width, left + rect.width / 2].some(
            (edge) => Math.abs(edge - (snapX.edge as number)) < 0.5,
          )
        const onY =
          snapY.edge !== null &&
          [top, top + rect.height, top + rect.height / 2].some(
            (edge) => Math.abs(edge - (snapY.edge as number)) < 0.5,
          )

        if (onX || onY) node.dataset.hot = "true"
        else delete node.dataset.hot
      }
    }

    const leave = () => {
      host.dataset.pointer = "false"
      measure.dataset.on = "false"

      for (const node of host.querySelectorAll<HTMLElement>(
        '[data-part="node"]',
      )) {
        delete node.dataset.hot
      }
    }

    host.addEventListener("pointermove", move)
    host.addEventListener("pointerleave", leave)

    return () => {
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
    }
  }, [])

  const palette = {
    "--vibeui-cursor-003-grid": `${grid}px`,
    ...(accent ? { "--vibeui-cursor-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cursor-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={hostRef}
        data-slot="cursor"
        data-vibeui-block="cursor-003"
        className={className}
        style={palette}
      >
        <div data-part="grid" />

        {nodes.map((node) => (
          <div
            key={node.label}
            data-part="node"
            style={{
              left: `${node.box[0] * 100}%`,
              top: `${node.box[1] * 100}%`,
              width: `${node.box[2] * 100}%`,
              height: `${node.box[3] * 100}%`,
            }}
          >
            {node.label}
          </div>
        ))}

        <div data-part="guide" data-axis="x" aria-hidden="true" />
        <div data-part="guide" data-axis="y" aria-hidden="true" />
        <div data-part="measure" aria-hidden="true" />
        <div data-part="cross" aria-hidden="true" />
        <span data-part="tag" aria-hidden="true">
          0 × 0
        </span>

        <span data-part="hint">
          Направляющие липнут к краям и центрам, иначе — к сетке
        </span>
      </div>
    </>
  )
}
