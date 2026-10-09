"use client"

import { useState, type ComponentProps, type CSSProperties } from "react"

export type Carousel020Slide = {
  /** Без картинки слайд заливается градиентом из акцента. */
  src?: string
  alt?: string
  eyebrow?: string
  title: string
}

export type Carousel020Props = Omit<ComponentProps<"section">, "children"> & {
  slides?: Carousel020Slide[]
  label?: string
  previousLabel?: string
  nextLabel?: string
  accent?: string
}

// Идея: полноформатный слайдер с подписью поверх затемнения снизу, счётчиком
// «01 — 05» и точками, где активная вытягивается в полоску. Слайды лежат
// стопкой в одной ячейке грида и сменяются прозрачностью с лёгким зумом —
// без сдвига ленты, поэтому высота задаётся соотношением сторон, а не
// картинкой. Стрелки — стеклянные круги, управление дублируется клавишами
// ← и → на самом слайдере.
const STYLES = `
:where([data-vibeui-block="carousel-020"]){
--vibeui-carousel-020-accent:oklch(0.6803 0.2144 39.8);
--vibeui-carousel-020-ink:oklch(0.14 0.004 60);
--vibeui-carousel-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="carousel-020"]{
position:relative;display:grid;width:100%;min-width:min(100%,16rem);box-sizing:border-box;
aspect-ratio:17/10;min-height:24rem;overflow:hidden;border-radius:1.1rem;isolation:isolate;
background:var(--vibeui-carousel-020-ink);color:oklch(1 0 0);font-family:var(--vibeui-carousel-020-font);
box-shadow:0 25px 60px oklch(0 0 0 / 0.45),0 0 0 1px oklch(1 0 0 / 0.08);
}
[data-vibeui-block="carousel-020"] *{box-sizing:border-box}
[data-vibeui-block="carousel-020"]:focus-visible{outline:2px solid var(--vibeui-carousel-020-accent);outline-offset:3px}
[data-vibeui-block="carousel-020"] [data-part="slide"]{
grid-area:1/1;position:relative;margin:0;opacity:0;scale:1.06;
transition:opacity .6s ease,scale 1.2s ease;
}
[data-vibeui-block="carousel-020"] [data-part="slide"][data-active]{opacity:1;scale:1}
[data-vibeui-block="carousel-020"] img,
[data-vibeui-block="carousel-020"] [data-part="fill"]{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="carousel-020"] [data-part="fill"]{
background:radial-gradient(80% 90% at 75% 20%,var(--vibeui-carousel-020-accent),transparent 70%),
linear-gradient(160deg,oklch(from var(--vibeui-carousel-020-accent) calc(l - 0.25) c calc(h - 20)),var(--vibeui-carousel-020-ink));
}
[data-vibeui-block="carousel-020"] [data-part="slide"]:nth-child(2n) [data-part="fill"]{filter:hue-rotate(-25deg)}
[data-vibeui-block="carousel-020"] [data-part="slide"]:nth-child(3n) [data-part="fill"]{filter:hue-rotate(20deg) brightness(.85)}
[data-vibeui-block="carousel-020"] [data-part="shade"]{
grid-area:1/1;z-index:1;pointer-events:none;
background:linear-gradient(to top,oklch(0 0 0 / 0.8),oklch(0 0 0 / 0.15) 55%,oklch(0 0 0 / 0.2));
}
[data-vibeui-block="carousel-020"] [data-part="arrow"]{
position:absolute;top:50%;z-index:3;width:3.25rem;height:3.25rem;display:grid;place-items:center;
appearance:none;cursor:pointer;translate:0 -50%;border:1px solid oklch(1 0 0 / 0.25);border-radius:50%;
background:oklch(0.15 0 0 / 0.45);color:inherit;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
transition:background-color .3s ease,border-color .3s ease,transform .3s ease;
}
[data-vibeui-block="carousel-020"] [data-part="arrow"] svg{width:1.4rem;height:1.4rem}
[data-vibeui-block="carousel-020"] [data-part="arrow"][data-dir="prev"]{left:1.25rem}
[data-vibeui-block="carousel-020"] [data-part="arrow"][data-dir="next"]{right:1.25rem}
[data-vibeui-block="carousel-020"] [data-part="arrow"]:hover{background:var(--vibeui-carousel-020-accent);border-color:var(--vibeui-carousel-020-accent);color:var(--vibeui-carousel-020-ink)}
[data-vibeui-block="carousel-020"] [data-part="arrow"][data-dir="prev"]:hover{transform:translateX(-3px)}
[data-vibeui-block="carousel-020"] [data-part="arrow"][data-dir="next"]:hover{transform:translateX(3px)}
[data-vibeui-block="carousel-020"] [data-part="arrow"]:active{transform:scale(.92)}
[data-vibeui-block="carousel-020"] [data-part="arrow"]:focus-visible{outline:2px solid var(--vibeui-carousel-020-accent);outline-offset:2px}
[data-vibeui-block="carousel-020"] [data-part="info"]{
position:absolute;left:2.2rem;right:2.2rem;bottom:3.4rem;z-index:2;
display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;
}
[data-vibeui-block="carousel-020"] [data-part="eyebrow"]{margin:0 0 .45rem;font-size:.6875rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--vibeui-carousel-020-accent)}
[data-vibeui-block="carousel-020"] [data-part="title"]{margin:0;font-size:clamp(1.15rem,3.6cqi,1.7rem);font-weight:600;line-height:1.2;text-wrap:balance}
[data-vibeui-block="carousel-020"] [data-part="counter"]{display:flex;align-items:center;gap:.6rem;font-size:.8125rem;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
[data-vibeui-block="carousel-020"] [data-part="counter"] b{font-size:1.2rem}
[data-vibeui-block="carousel-020"] [data-part="counter"] i{width:2.2rem;height:1px;background:oklch(1 0 0 / 0.6)}
[data-vibeui-block="carousel-020"] [data-part="counter"] span{opacity:.55}
[data-vibeui-block="carousel-020"] [data-part="dots"]{position:absolute;left:2.2rem;bottom:1.4rem;z-index:3;display:flex;gap:.45rem}
[data-vibeui-block="carousel-020"] [data-part="dot"]{
width:.45rem;height:.45rem;padding:0;appearance:none;border:0;border-radius:999px;cursor:pointer;
background:oklch(1 0 0 / 0.35);transition:width .3s ease,background-color .3s ease;
}
[data-vibeui-block="carousel-020"] [data-part="dot"][aria-current="true"]{width:1.75rem;background:var(--vibeui-carousel-020-accent)}
[data-vibeui-block="carousel-020"] [data-part="dot"]:focus-visible{outline:2px solid oklch(1 0 0);outline-offset:2px}
@container (max-width:36rem){
[data-vibeui-block="carousel-020"] [data-part="arrow"]{width:2.75rem;height:2.75rem;top:auto;bottom:1rem;translate:none}
[data-vibeui-block="carousel-020"] [data-part="arrow"][data-dir="prev"]{left:auto;right:4.25rem}
[data-vibeui-block="carousel-020"] [data-part="arrow"][data-dir="next"]{right:1rem}
[data-vibeui-block="carousel-020"] [data-part="info"]{left:1.25rem;right:1.25rem;bottom:4.75rem;flex-direction:column;align-items:flex-start}
[data-vibeui-block="carousel-020"] [data-part="dots"]{left:1.25rem;bottom:2.1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-020"] *{transition:none!important}}
`

const DEFAULT_SLIDES: Carousel020Slide[] = [
  { eyebrow: "Маршрут", title: "Откройте что-то новое" },
  { eyebrow: "Сезон", title: "Горы, где тихо даже в августе" },
  { eyebrow: "Выходные", title: "Два дня без телефона" },
  { eyebrow: "Подборка", title: "Места, куда хочется вернуться" },
  { eyebrow: "Совет", title: "Лучший свет — за час до заката" },
]

const pad = (value: number) => String(value).padStart(2, "0")

/**
 * Полноформатный слайдер изображений: подпись поверх затемнения, счётчик,
 * точки-индикаторы и стеклянные стрелки. Смена слайдов — прозрачностью.
 */
export function Carousel020({
  slides = DEFAULT_SLIDES,
  label = "Галерея",
  previousLabel = "Предыдущий слайд",
  nextLabel = "Следующий слайд",
  accent,
  className,
  style,
  ...props
}: Carousel020Props) {
  const [index, setIndex] = useState(0)
  const total = slides.length
  const go = (step: number) =>
    setIndex((value) => (value + step + total) % total)
  const current = slides[index]

  const palette = {
    ...(accent ? { "--vibeui-carousel-020-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-020" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="carousel-020"
        data-slot="carousel"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") go(-1)
          if (event.key === "ArrowRight") go(1)
        }}
        className={className}
        style={palette}
      >
        {slides.map((slide, slideIndex) => (
          <figure
            key={slide.title}
            data-part="slide"
            data-active={slideIndex === index || undefined}
            aria-hidden={slideIndex !== index}
            aria-roledescription="slide"
          >
            {slide.src ? (
              <img
                src={slide.src}
                alt={slide.alt ?? ""}
                loading={slideIndex === 0 ? "eager" : "lazy"}
              />
            ) : (
              <span data-part="fill" />
            )}
          </figure>
        ))}
        <span data-part="shade" />

        <button
          type="button"
          data-part="arrow"
          data-dir="prev"
          aria-label={previousLabel}
          onClick={() => go(-1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          data-part="arrow"
          data-dir="next"
          aria-label={nextLabel}
          onClick={() => go(1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div data-part="info" aria-live="polite">
          <div>
            {current?.eyebrow ? (
              <p data-part="eyebrow">{current.eyebrow}</p>
            ) : null}
            <h2 data-part="title">{current?.title}</h2>
          </div>
          <p data-part="counter" aria-hidden="true">
            <b>{pad(index + 1)}</b>
            <i />
            <span>{pad(total)}</span>
          </p>
        </div>

        <div data-part="dots">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.title}
              type="button"
              data-part="dot"
              aria-label={`${slideIndex + 1} / ${total}`}
              aria-current={slideIndex === index}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
      </section>
    </>
  )
}
