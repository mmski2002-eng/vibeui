"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Stack010Slide = {
  /** Фото слайда. Пусто — брендовая плашка с номером. */
  src?: string
  title: string
}

export type Stack010Props = Omit<ComponentProps<"div">, "children"> & {
  slides?: Stack010Slide[]
  /** Индекс стартового слайда. */
  initial?: number
  /** Держать дугу раскрытой без наведения: витрина, тач-экран. */
  open?: boolean
  accent?: string
  prevLabel?: string
  nextLabel?: string
}

// Идея: карусель, в которой соседние слайды не просто уезжают, а
// раскладываются дугой на наведении — поворачиваются и опускаются тем
// сильнее, чем дальше от активного; подпись видна только у активного.
//
// Состояние — один индекс в useState; вся геометрия на CSS: расстояние до
// активного и коэффициент наведения лежат в переменных, transform считает
// calc(). Пружина оригинала заменена кривой linear() с лёгким перелётом.
const STYLES = `
:where([data-vibeui-block="stack-010"]){
--vibeui-stack-010-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-stack-010-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-stack-010-border:light-dark(oklch(0 0 0 / 10%),oklch(1 0 0 / 16%));
--vibeui-stack-010-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-stack-010-pill:oklch(0.145 0 0 / 88%);
--vibeui-stack-010-pill-fg:oklch(0.75 0 0);
--vibeui-stack-010-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-stack-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-stack-010-h:0;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stack-010"]{color-scheme:dark}
[data-vibeui-block="stack-010"]{
position:relative;display:flex;flex-direction:column;align-items:center;
box-sizing:border-box;width:100%;max-width:28rem;padding:0.5rem 0;
user-select:none;color:var(--vibeui-stack-010-fg);font-family:var(--vibeui-stack-010-font);
}
[data-vibeui-block="stack-010"] *{box-sizing:border-box}
[data-vibeui-block="stack-010"]:is(:hover,[data-open="true"]){--vibeui-stack-010-h:1}
[data-vibeui-block="stack-010"] [data-part="viewport"]{
position:relative;display:flex;align-items:center;width:10rem;height:11.25rem;
}
[data-vibeui-block="stack-010"] [data-part="track"]{
display:flex;align-items:center;width:max-content;
transform:translateX(calc(var(--vibeui-stack-010-active) * -10rem));
transition:transform .8s cubic-bezier(.22,1.1,.36,1);
transition:transform .8s var(--vibeui-stack-010-ease);
}
[data-vibeui-block="stack-010"] [data-part="slide"]{
flex:none;display:flex;flex-direction:column;align-items:center;gap:0.375rem;width:10rem;
transform:translateY(calc(var(--vibeui-stack-010-diff) * var(--vibeui-stack-010-h) * 24px))
rotate(calc(var(--vibeui-stack-010-diff) * (5deg + 15deg * var(--vibeui-stack-010-h))))
scale(var(--vibeui-stack-010-scale));
transition:transform .8s cubic-bezier(.22,1.1,.36,1);
transition:transform .8s var(--vibeui-stack-010-ease);
will-change:transform;
}
[data-vibeui-block="stack-010"] [data-part="title"]{
font-size:0.7rem;font-weight:650;white-space:nowrap;opacity:0;transform:scale(0.75);
transition:opacity .3s,transform .3s;
}
[data-vibeui-block="stack-010"] [data-part="slide"][data-active="true"] [data-part="title"]{opacity:1;transform:none}
[data-vibeui-block="stack-010"] [data-part="picture"]{
appearance:none;padding:0;margin:0;cursor:pointer;
position:relative;width:6.875rem;height:6.875rem;overflow:hidden;border-radius:0.75rem;
border:1px solid var(--vibeui-stack-010-border);background:var(--vibeui-stack-010-card);
box-shadow:0 10px 15px -3px oklch(0 0 0 / 0.2),0 4px 6px -4px oklch(0 0 0 / 0.2);
color:var(--vibeui-stack-010-accent);font:inherit;
}
[data-vibeui-block="stack-010"] [data-part="picture"]:focus-visible{outline:2px solid var(--vibeui-stack-010-accent);outline-offset:3px}
[data-vibeui-block="stack-010"] [data-part="picture"] img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}
[data-vibeui-block="stack-010"] [data-part="picture"][data-empty="true"]{
background:linear-gradient(160deg,color-mix(in oklab,var(--vibeui-stack-010-accent) 24%,var(--vibeui-stack-010-card)),var(--vibeui-stack-010-card) 70%);
}
[data-vibeui-block="stack-010"] [data-part="num"]{
position:absolute;left:0.5rem;top:0.375rem;font-size:0.75rem;font-weight:700;letter-spacing:0.04em;
}
[data-vibeui-block="stack-010"] [data-part="controls"]{
display:flex;align-items:center;gap:0.5rem;margin-top:1rem;padding:0.125rem 0.375rem;
border-radius:9999px;background:var(--vibeui-stack-010-pill);
border:1px solid oklch(1 0 0 / 6%);box-shadow:0 4px 6px -1px oklch(0 0 0 / 0.2);
backdrop-filter:blur(8px);color:var(--vibeui-stack-010-pill-fg);
}
[data-vibeui-block="stack-010"] [data-part="arrow"]{
appearance:none;border:0;margin:0;padding:0.25rem;border-radius:9999px;background:transparent;
display:inline-flex;color:inherit;cursor:pointer;transition:color .2s,background .2s;
}
[data-vibeui-block="stack-010"] [data-part="arrow"]:hover{color:#fff;background:oklch(1 0 0 / 6%)}
[data-vibeui-block="stack-010"] [data-part="arrow"]:disabled{opacity:0.35;cursor:default;background:transparent;color:inherit}
[data-vibeui-block="stack-010"] [data-part="arrow"]:focus-visible{outline:2px solid var(--vibeui-stack-010-accent);outline-offset:1px}
[data-vibeui-block="stack-010"] [data-part="arrow"] svg{width:0.875rem;height:0.875rem}
[data-vibeui-block="stack-010"] [data-part="dots"]{display:flex;align-items:center;gap:0.25rem}
[data-vibeui-block="stack-010"] [data-part="dot"]{
appearance:none;border:0;margin:0;padding:0;cursor:pointer;
width:0.25rem;height:0.25rem;border-radius:9999px;background:oklch(1 0 0 / 30%);
transition:width .3s,background .3s;
}
[data-vibeui-block="stack-010"] [data-part="dot"]:hover{background:oklch(1 0 0 / 50%)}
[data-vibeui-block="stack-010"] [data-part="dot"][aria-current="true"]{width:1rem;background:var(--vibeui-stack-010-accent)}
[data-vibeui-block="stack-010"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-stack-010-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="stack-010"] :is([data-part="track"],[data-part="slide"],[data-part="title"],[data-part="dot"]){transition:none}
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

const DEFAULT_SLIDES: Stack010Slide[] = [
  { title: "Клавиатура" },
  { title: "Гарнитура" },
  { title: "Джерси" },
  { title: "Трофей" },
  { title: "Мышь" },
]

/**
 * Карусель с дугой: соседние слайды раскладываются веером на наведении,
 * подпись видна у активного. Один файл, ноль зависимостей, состояние —
 * один индекс.
 */
export function Stack010({
  slides = DEFAULT_SLIDES,
  initial = 2,
  open = false,
  accent,
  prevLabel = "Предыдущий",
  nextLabel = "Следующий",
  className,
  style,
  ...props
}: Stack010Props) {
  const last = Math.max(0, slides.length - 1)
  const [active, setActive] = useState(Math.min(Math.max(0, initial), last))
  const palette = {
    ...(accent ? { "--vibeui-stack-010-accent": accent } : null),
    "--vibeui-stack-010-active": active,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stack-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="stack-010"
        data-slot="card-carousel"
        data-open={open ? "true" : undefined}
        role="region"
        aria-roledescription="carousel"
        className={className}
        style={palette}
      >
        <div data-part="viewport">
          <div data-part="track">
            {slides.map((slide, index) => {
              const isActive = index === active
              const slideStyle = {
                "--vibeui-stack-010-diff": index - active,
                "--vibeui-stack-010-scale": isActive
                  ? 1.05
                  : "calc(0.8 - 0.15 * var(--vibeui-stack-010-h))",
              } as CSSProperties

              return (
                <div
                  key={slide.title + index}
                  data-part="slide"
                  data-active={isActive ? "true" : undefined}
                  style={slideStyle}
                >
                  <span data-part="title">{slide.title}</span>
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
                </div>
              )
            })}
          </div>
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
