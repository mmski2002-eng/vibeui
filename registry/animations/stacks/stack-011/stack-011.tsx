"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Stack011Slide = {
  /** Фото слайда. Пусто — брендовая плашка с номером. */
  src?: string
  title: string
}

export type Stack011Props = Omit<ComponentProps<"div">, "children"> & {
  slides?: Stack011Slide[]
  /** Индекс стартового слайда. */
  initial?: number
  accent?: string
  prevLabel?: string
  nextLabel?: string
}

// Идея: CoverFlow — активная обложка стоит фронтально и ближе к зрителю,
// соседние развёрнуты к ней под углом и уходят вглубь, гаснут с расстоянием.
//
// Состояние — один индекс в useState; вся геометрия на CSS-переменных, которые
// компонент считает от расстояния до активного слайда. Сцена с perspective
// и preserve-3d, поворот — rotateY.
const STYLES = `
:where([data-vibeui-block="stack-011"]){
--vibeui-stack-011-bg:light-dark(oklch(0.955 0 0),oklch(0.13 0 0 / 60%));
--vibeui-stack-011-card:light-dark(oklch(1 0 0),oklch(0.2178 0 0));
--vibeui-stack-011-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-stack-011-border:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 14%));
--vibeui-stack-011-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-stack-011-pill:oklch(0.145 0 0 / 88%);
--vibeui-stack-011-pill-fg:oklch(0.75 0 0);
--vibeui-stack-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stack-011"]{color-scheme:dark}
[data-vibeui-block="stack-011"]{
position:relative;display:flex;flex-direction:column;align-items:center;
box-sizing:border-box;width:100%;max-width:20rem;padding:1.25rem 0 1rem;
border-radius:1rem;background:var(--vibeui-stack-011-bg);overflow:hidden;
user-select:none;color:var(--vibeui-stack-011-fg);font-family:var(--vibeui-stack-011-font);
perspective:1000px;
}
[data-vibeui-block="stack-011"] *{box-sizing:border-box}
[data-vibeui-block="stack-011"] [data-part="stage"]{
position:relative;display:flex;align-items:center;justify-content:center;
width:100%;height:8.75rem;transform-style:preserve-3d;
}
[data-vibeui-block="stack-011"] [data-part="slide"]{
position:absolute;width:5rem;aspect-ratio:3/4;
transform:translateX(calc(var(--vibeui-stack-011-off) * 32px)) translateZ(var(--vibeui-stack-011-z))
rotateY(var(--vibeui-stack-011-ry)) scale(var(--vibeui-stack-011-scale));
opacity:var(--vibeui-stack-011-o);
transition:transform .7s cubic-bezier(.22,1.1,.36,1),opacity .5s;
will-change:transform;
}
[data-vibeui-block="stack-011"] [data-part="picture"]{
appearance:none;padding:0;margin:0;cursor:pointer;display:block;
position:relative;width:100%;height:100%;overflow:hidden;border-radius:0.75rem;
border:1px solid var(--vibeui-stack-011-border);background:var(--vibeui-stack-011-card);
box-shadow:0 25px 50px -12px oklch(0 0 0 / 0.35);color:var(--vibeui-stack-011-accent);font:inherit;
}
[data-vibeui-block="stack-011"] [data-part="picture"]:focus-visible{outline:2px solid var(--vibeui-stack-011-accent);outline-offset:3px}
[data-vibeui-block="stack-011"] [data-part="picture"] img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}
[data-vibeui-block="stack-011"] [data-part="picture"][data-empty="true"]{
background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-stack-011-accent) 24%,var(--vibeui-stack-011-card)),var(--vibeui-stack-011-card) 70%);
}
[data-vibeui-block="stack-011"] [data-part="num"]{
position:absolute;left:0.5rem;top:0.375rem;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;
}
[data-vibeui-block="stack-011"] [data-part="caption"]{
position:absolute;left:-1.25rem;right:-1.25rem;bottom:-1.5rem;text-align:center;
font-size:0.625rem;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
color:color-mix(in oklab,var(--vibeui-stack-011-fg) 80%,transparent);
opacity:0;transform:translateY(-5px);transition:opacity .3s,transform .3s;
}
[data-vibeui-block="stack-011"] [data-part="slide"][data-active="true"] [data-part="caption"]{opacity:1;transform:none}
[data-vibeui-block="stack-011"] [data-part="controls"]{
display:flex;align-items:center;gap:0.5rem;margin-top:1.5rem;padding:0.125rem 0.375rem;
border-radius:9999px;background:var(--vibeui-stack-011-pill);
border:1px solid oklch(1 0 0 / 8%);box-shadow:0 1px 2px oklch(0 0 0 / 0.2);
backdrop-filter:blur(8px);color:var(--vibeui-stack-011-pill-fg);
}
[data-vibeui-block="stack-011"] [data-part="arrow"]{
appearance:none;border:0;margin:0;padding:0.25rem;border-radius:9999px;background:transparent;
display:inline-flex;color:inherit;cursor:pointer;transition:color .2s,background .2s;
}
[data-vibeui-block="stack-011"] [data-part="arrow"]:hover{color:#fff;background:oklch(1 0 0 / 10%)}
[data-vibeui-block="stack-011"] [data-part="arrow"]:disabled{opacity:0.35;cursor:default;background:transparent;color:inherit}
[data-vibeui-block="stack-011"] [data-part="arrow"]:focus-visible{outline:2px solid var(--vibeui-stack-011-accent);outline-offset:1px}
[data-vibeui-block="stack-011"] [data-part="arrow"] svg{width:0.875rem;height:0.875rem}
[data-vibeui-block="stack-011"] [data-part="dots"]{display:flex;align-items:center;gap:0.25rem}
[data-vibeui-block="stack-011"] [data-part="dot"]{
appearance:none;border:0;margin:0;padding:0;cursor:pointer;
width:0.25rem;height:0.25rem;border-radius:9999px;background:oklch(1 0 0 / 30%);
transition:width .3s,background .3s;
}
[data-vibeui-block="stack-011"] [data-part="dot"]:hover{background:oklch(1 0 0 / 50%)}
[data-vibeui-block="stack-011"] [data-part="dot"][aria-current="true"]{width:1rem;background:var(--vibeui-stack-011-accent)}
[data-vibeui-block="stack-011"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-stack-011-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="stack-011"] :is([data-part="slide"],[data-part="caption"],[data-part="dot"]){transition:none}
}
`

const CHEVRON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const DEFAULT_SLIDES: Stack011Slide[] = [
  { title: "Клавиатура" },
  { title: "Гарнитура" },
  { title: "Джерси" },
  { title: "Трофей" },
  { title: "Мышь" },
]

/**
 * CoverFlow-карусель: активная обложка фронтально и ближе, соседние
 * развёрнуты к ней и уходят вглубь. Один файл, ноль зависимостей,
 * состояние — один индекс.
 */
export function Stack011({
  slides = DEFAULT_SLIDES,
  initial = 2,
  accent,
  prevLabel = "Предыдущий",
  nextLabel = "Следующий",
  className,
  style,
  ...props
}: Stack011Props) {
  const last = Math.max(0, slides.length - 1)
  const [active, setActive] = useState(Math.min(Math.max(0, initial), last))
  const palette = {
    ...(accent ? { "--vibeui-stack-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stack-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="stack-011"
        data-slot="cover-flow"
        role="region"
        aria-roledescription="carousel"
        className={className}
        style={palette}
      >
        <div data-part="stage">
          {slides.map((slide, index) => {
            const offset = index - active
            const away = Math.abs(offset)
            const isActive = offset === 0
            const slideStyle = {
              zIndex: 100 - away,
              "--vibeui-stack-011-off": offset,
              "--vibeui-stack-011-z": isActive ? "50px" : `${-away * 50}px`,
              "--vibeui-stack-011-ry": isActive
                ? "0deg"
                : offset < 0
                  ? "38deg"
                  : "-38deg",
              "--vibeui-stack-011-scale": isActive ? 1.1 : 1 - away * 0.08,
              "--vibeui-stack-011-o": away > 2 ? 0 : 1 - away * 0.25,
            } as CSSProperties

            return (
              <div
                key={slide.title + index}
                data-part="slide"
                data-active={isActive ? "true" : undefined}
                style={slideStyle}
              >
                <button
                  type="button"
                  data-part="picture"
                  data-empty={slide.src ? undefined : "true"}
                  aria-label={slide.title}
                  aria-current={isActive ? "true" : undefined}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(index)}
                >
                  {slide.src ? (
                    <img
                      src={slide.src}
                      alt=""
                      loading="lazy"
                      draggable={false}
                    />
                  ) : (
                    <span data-part="num">{index + 1}</span>
                  )}
                </button>
                <span data-part="caption">{slide.title}</span>
              </div>
            )
          })}
        </div>

        <div data-part="controls">
          <button
            type="button"
            data-part="arrow"
            aria-label={prevLabel}
            disabled={active === 0}
            onClick={() => setActive((value) => Math.max(0, value - 1))}
          >
            {CHEVRON}
          </button>
          <div data-part="dots">
            {slides.map((slide, index) => (
              <button
                key={slide.title + index}
                type="button"
                data-part="dot"
                aria-label={slide.title}
                aria-current={index === active ? "true" : undefined}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
          <button
            type="button"
            data-part="arrow"
            aria-label={nextLabel}
            disabled={active === last}
            onClick={() => setActive((value) => Math.min(last, value + 1))}
            style={{ transform: "scaleX(-1)" }}
          >
            {CHEVRON}
          </button>
        </div>
      </div>
    </>
  )
}
