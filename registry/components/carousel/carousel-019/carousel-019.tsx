"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Carousel019Props = Omit<ComponentProps<"section">, "children"> & {
  /** Ровно четыре грани куба, по часовой стрелке. */
  faces?: string[]
  /** Название карусели. */
  label?: string
  /** Подпись под кубом. */
  hint?: string
  /** Ребро куба в rem: от него же считается глубина граней. */
  size?: number
  /** Роль секции для скринридера. */
  roleText?: string
  /** Подпись кнопки «назад». */
  prevLabel?: string
  /** Подпись кнопки «дальше». */
  nextLabel?: string
  /** Шаблон строки состояния: {index}, {total}, {label}. */
  statusText?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: слайды не едут вбок, а лежат на гранях одного объёма.
// Четыре грани расставлены поворотом и выносом на половину ребра, сам куб
// отодвинут назад на ту же половину — поэтому центр вращения остаётся в
// середине кадра. Счётчик поворотов не сбрасывается на четвёртой грани:
// куб продолжает крутиться в одну сторону, а не отматывает назад.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="carousel-019"]){
--vibeui-carousel-019-bg:transparent;
--vibeui-carousel-019-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-carousel-019-muted:color-mix(in oklab,var(--vibeui-carousel-019-fg) 62%,transparent);
--vibeui-carousel-019-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-carousel-019-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-carousel-019-accent:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-carousel-019-accent-text:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-carousel-019-on-accent:oklch(0.15 0 0);
--vibeui-carousel-019-size:11rem;
--vibeui-carousel-019-turn:0deg;
--vibeui-carousel-019-radius:0.625rem;
--vibeui-carousel-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-019"]{color-scheme:dark}
[data-vibeui-block="carousel-019"]{
display:flex;flex-direction:column;align-items:center;gap:0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-carousel-019-bg);color:var(--vibeui-carousel-019-fg);
font-family:var(--vibeui-carousel-019-font);
}
[data-vibeui-block="carousel-019"] *{box-sizing:border-box}
/* Сцена задаёт перспективу и площадь куба: сам куб её только заполняет. */
[data-vibeui-block="carousel-019"] [data-part="scene"]{
appearance:none;border:0;padding:0;margin:0;background:none;cursor:pointer;
display:block;font:inherit;color:inherit;
width:var(--vibeui-carousel-019-size);height:var(--vibeui-carousel-019-size);
perspective:39rem;
}
[data-vibeui-block="carousel-019"] [data-part="scene"]:focus-visible{
outline:2px solid var(--vibeui-carousel-019-accent);outline-offset:6px;
border-radius:var(--vibeui-carousel-019-radius);
}
[data-vibeui-block="carousel-019"] [data-part="cube"]{
position:relative;display:block;width:100%;height:100%;
transform-style:preserve-3d;
transform:translateZ(calc(var(--vibeui-carousel-019-size) / -2)) rotateY(var(--vibeui-carousel-019-turn));
transition:transform .7s cubic-bezier(.22,1.2,.36,1);
transition:transform .7s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
[data-vibeui-block="carousel-019"] [data-part="face"]{
position:absolute;inset:0;
display:flex;align-items:center;justify-content:center;
padding:0.75rem;
border:1px solid var(--vibeui-carousel-019-border);
border-radius:var(--vibeui-carousel-019-radius);
background:var(--vibeui-carousel-019-card);
font-size:0.9375rem;font-weight:750;letter-spacing:0.06em;text-transform:uppercase;
text-align:center;
backface-visibility:hidden;
}
/* Грани расставлены поворотом и выносом на половину ребра: nth-child
   держит порядок, поэтому массив faces читается как обход по часовой. */
[data-vibeui-block="carousel-019"] [data-part="face"]:nth-child(1){
transform:rotateY(0deg) translateZ(calc(var(--vibeui-carousel-019-size) / 2));
color:var(--vibeui-carousel-019-accent-text);
}
[data-vibeui-block="carousel-019"] [data-part="face"]:nth-child(2){
transform:rotateY(90deg) translateZ(calc(var(--vibeui-carousel-019-size) / 2));
}
[data-vibeui-block="carousel-019"] [data-part="face"]:nth-child(3){
transform:rotateY(180deg) translateZ(calc(var(--vibeui-carousel-019-size) / 2));
}
[data-vibeui-block="carousel-019"] [data-part="face"]:nth-child(4){
transform:rotateY(-90deg) translateZ(calc(var(--vibeui-carousel-019-size) / 2));
}
[data-vibeui-block="carousel-019"] [data-part="bar"]{
display:flex;align-items:center;justify-content:center;gap:0.625rem;
width:100%;
}
[data-vibeui-block="carousel-019"] [data-part="nav"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:9999px;
border:1px solid var(--vibeui-carousel-019-border);
background:var(--vibeui-carousel-019-card);color:inherit;
font:inherit;font-size:1rem;line-height:1;
transition:border-color .18s ease,transform .18s ease;
}
[data-vibeui-block="carousel-019"] [data-part="nav"]:hover{
border-color:var(--vibeui-carousel-019-accent);transform:scale(1.06);
}
[data-vibeui-block="carousel-019"] [data-part="nav"]:focus-visible{
outline:2px solid var(--vibeui-carousel-019-accent);outline-offset:2px;
}
[data-vibeui-block="carousel-019"] [data-part="status"]{
margin:0;flex:1 1 auto;min-width:0;text-align:center;
font-size:0.8125rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="carousel-019"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-carousel-019-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-019"] *{animation:none!important;transition:none!important}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-019"] [data-part="nav"]:hover{transform:none}}
`

const DEFAULT_FACES = ["Каталог", "Превью", "Промпт", "Установка"]

/** Подстановка чисел в подпись: перевод остаётся одной строкой. */
function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Карусель на гранях куба: каждый шаг доворачивает объём на четверть.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel019({
  faces = DEFAULT_FACES,
  label = "Как это работает",
  hint = "Нажмите на куб или на стрелки",
  size = 11,
  roleText = "карусель",
  prevLabel = "Предыдущая грань",
  nextLabel = "Следующая грань",
  statusText = "{index} из {total}: {label}",
  accent,
  background = "",
  className,
  style,
  ...props
}: Carousel019Props) {
  const sides = faces.slice(0, 4)
  const [turn, setTurn] = useState(0)
  // Счётчик не сбрасывается по кругу: иначе на переходе с четвёртой грани
  // на первую куб отматывал бы три четверти назад вместо доворота вперёд.
  const active = ((turn % sides.length) + sides.length) % sides.length

  const palette = {
    "--vibeui-carousel-019-size": `${size}rem`,
    "--vibeui-carousel-019-turn": `${-90 * turn}deg`,
    ...(accent ? { "--vibeui-carousel-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-019" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-019"
        aria-roledescription={roleText}
        aria-label={label}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="scene"
          aria-label={nextLabel}
          onClick={() => setTurn((previous) => previous + 1)}
        >
          <span data-part="cube">
            {sides.map((face, index) => (
              <span key={face} data-part="face" aria-hidden={index !== active}>
                {face}
              </span>
            ))}
          </span>
        </button>
        <div data-part="bar">
          <button
            type="button"
            data-part="nav"
            aria-label={prevLabel}
            onClick={() => setTurn((previous) => previous - 1)}
          >
            ←
          </button>
          <p data-part="status" aria-live="polite">
            {fill(statusText, {
              index: active + 1,
              total: sides.length,
              label: sides[active],
            })}
          </p>
          <button
            type="button"
            data-part="nav"
            aria-label={nextLabel}
            onClick={() => setTurn((previous) => previous + 1)}
          >
            →
          </button>
        </div>
        {hint ? <p data-part="hint">{hint}</p> : null}
      </section>
    </>
  )
}
