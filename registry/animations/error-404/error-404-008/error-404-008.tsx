"use client"

import { useEffect, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Error404008Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  message?: string
  leftLabel?: string
  rightLabel?: string
  restartLabel?: string
  movesLabel?: string
  winLabel?: string
  actionLabel?: string
  actionHref?: string
  /** Цвет шарика и выхода. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Головоломка вместо тупика: доску-лабиринт поворачивают на 90°, и шарик
// под «гравитацией» катится до ближайшей стены. Поворот и качение — две
// CSS-транзиции, логика — сдвиг по сетке в направлении, которое после
// поворота смотрит вниз. Стрелки клавиатуры работают так же, как кнопки.
const STYLES = `
:where([data-vibeui-block="error-404-008"]){
--vibeui-error-404-008-bg:transparent;
--vibeui-error-404-008-fg:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-error-404-008-muted:light-dark(oklch(0.5 0 0),oklch(0.7 0 0));
--vibeui-error-404-008-wall:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-error-404-008-floor:light-dark(oklch(0.96 0 0),oklch(0.22 0 0));
--vibeui-error-404-008-accent:light-dark(oklch(0.6 0.2 30),oklch(0.72 0.17 35));
--vibeui-error-404-008-font:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-404-008"]{color-scheme:dark}
[data-vibeui-block="error-404-008"]{
display:flex;flex-direction:column;align-items:center;gap:1.25rem;box-sizing:border-box;padding:2.5rem 1.25rem;text-align:center;
background:var(--vibeui-error-404-008-bg);color:var(--vibeui-error-404-008-fg);font-family:var(--vibeui-error-404-008-font);
}
[data-vibeui-block="error-404-008"] [data-part="message"]{margin:0;max-width:24rem;font-size:0.8125rem;line-height:1.6;color:var(--vibeui-error-404-008-muted)}
[data-vibeui-block="error-404-008"] [data-part="stage"]{display:grid;place-items:center;width:min(100%,18rem);aspect-ratio:1}
[data-vibeui-block="error-404-008"] [data-part="board"]{
position:relative;display:grid;grid-template-columns:repeat(7,1fr);width:78%;aspect-ratio:1;background:var(--vibeui-error-404-008-floor);
transform:rotate(calc(var(--vibeui-error-404-008-turn) * 90deg));transition:transform .45s cubic-bezier(.5,0,.2,1);
}
[data-vibeui-block="error-404-008"] [data-part="cell"][data-wall]{background:var(--vibeui-error-404-008-wall)}
[data-vibeui-block="error-404-008"] [data-part="cell"][data-exit]{background:color-mix(in oklab,var(--vibeui-error-404-008-accent) 30%,transparent);box-shadow:inset 0 0 0 2px var(--vibeui-error-404-008-accent)}
[data-vibeui-block="error-404-008"] [data-part="ball"]{
position:absolute;left:0;top:0;width:calc(100% / 7);aspect-ratio:1;padding:3%;box-sizing:border-box;
transform:translate(calc(var(--vibeui-error-404-008-x) * 100%),calc(var(--vibeui-error-404-008-y) * 100%));
transition:transform .32s cubic-bezier(.5,0,.75,0);
}
[data-vibeui-block="error-404-008"] [data-part="ball"]::after{content:"";display:block;width:100%;height:100%;border-radius:50%;background:var(--vibeui-error-404-008-accent)}
[data-vibeui-block="error-404-008"] [data-part="code"]{margin:0;font-size:2rem;font-weight:700;letter-spacing:0.1em}
[data-vibeui-block="error-404-008"] [data-part="controls"]{display:flex;gap:0.5rem}
[data-vibeui-block="error-404-008"] [data-part="control"]{
appearance:none;border:1px solid var(--vibeui-error-404-008-wall);background:transparent;color:inherit;font:inherit;font-size:0.75rem;
padding:0.5rem 0.75rem;cursor:pointer;transition:background .15s ease,color .15s ease;
}
[data-vibeui-block="error-404-008"] [data-part="control"]:hover{background:var(--vibeui-error-404-008-wall);color:var(--vibeui-error-404-008-floor)}
[data-vibeui-block="error-404-008"] :is([data-part="control"],[data-part="action"]):focus-visible{outline:2px solid var(--vibeui-error-404-008-accent);outline-offset:3px}
[data-vibeui-block="error-404-008"] [data-part="moves"]{margin:0;font-size:0.75rem;color:var(--vibeui-error-404-008-muted)}
[data-vibeui-block="error-404-008"] [data-part="action"]{color:var(--vibeui-error-404-008-accent);font-size:0.875rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="error-404-008"] *{transition:none!important}}
[data-vibeui-block="error-404-008"]{width:100%}
`

const MAZE = ["#######", "#S..#.#", "#.##..#", "#....##", "##.#..#", "#..#.E#", "#######"]
const START = { x: 1, y: 1 }
// Направление «вниз по экрану» в координатах доски для каждой четверти поворота.
const GRAVITY = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

function wall(x: number, y: number) {
  return MAZE[y]?.[x] !== "." && MAZE[y]?.[x] !== "S" && MAZE[y]?.[x] !== "E"
}

function roll(position: { x: number; y: number }, turn: number) {
  const [dx, dy] = GRAVITY[((turn % 4) + 4) % 4]
  let { x, y } = position
  while (!wall(x + dx, y + dy) && MAZE[y][x] !== "E") {
    x += dx
    y += dy
  }
  return { x, y }
}

export function Error404008({
  code = "404",
  message = "Вы вышли за пределы задуманной архитектуры. Поверните доску, дайте шарику упасть, найдите выход.",
  leftLabel = "← Влево",
  rightLabel = "Вправо →",
  restartLabel = "Заново",
  movesLabel = "Ходов",
  winLabel = "Выход найден!",
  actionLabel = "Вернуться на главную",
  actionHref = "/",
  accent,
  background,
  className,
  style,
  ...props
}: Error404008Props) {
  const [turn, setTurn] = useState(0)
  const [ball, setBall] = useState(START)
  const [moves, setMoves] = useState(0)
  const won = MAZE[ball.y][ball.x] === "E"

  useEffect(() => {
    const timer = window.setTimeout(() => setBall((current) => roll(current, turn)), 450)
    return () => window.clearTimeout(timer)
  }, [turn])

  const rotate = (step: number) => {
    if (won) return
    setTurn((current) => current + step)
    setMoves((current) => current + 1)
  }

  const restart = () => {
    setTurn(0)
    setBall(roll(START, 0))
    setMoves(0)
  }

  const palette = {
    ...(accent ? { "--vibeui-error-404-008-accent": accent } : null),
    ...(background ? { "--vibeui-error-404-008-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-404-008" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-404-008"
        data-slot="not-found"
        className={className}
        style={palette}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") rotate(-1)
          if (event.key === "ArrowRight") rotate(1)
        }}
      >
        <p data-part="message">{message}</p>
        <div data-part="stage" aria-hidden="true">
          <div
            data-part="board"
            style={{ "--vibeui-error-404-008-turn": turn } as CSSProperties}
          >
            {MAZE.join("")
              .split("")
              .map((cell, index) => (
                <span
                  key={index}
                  data-part="cell"
                  data-wall={cell === "#" || undefined}
                  data-exit={cell === "E" || undefined}
                />
              ))}
            <span
              data-part="ball"
              style={
                {
                  "--vibeui-error-404-008-x": ball.x,
                  "--vibeui-error-404-008-y": ball.y,
                } as CSSProperties
              }
            />
          </div>
        </div>
        <h1 data-part="code">{code}</h1>
        <div data-part="controls">
          <button type="button" data-part="control" onClick={() => rotate(-1)}>
            {leftLabel}
          </button>
          <button type="button" data-part="control" onClick={restart}>
            {restartLabel}
          </button>
          <button type="button" data-part="control" onClick={() => rotate(1)}>
            {rightLabel}
          </button>
        </div>
        <p data-part="moves" aria-live="polite">
          {won ? winLabel : `${movesLabel}: ${moves}`}
        </p>
        <a data-part="action" href={actionHref}>
          {actionLabel}
        </a>
      </section>
    </>
  )
}
