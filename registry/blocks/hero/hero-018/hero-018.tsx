import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Hero018Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  eyebrow?: string
  title?: string
  /** Хвост заголовка, подчёркнутый мягкой заливкой. Пусто — заголовок цельный. */
  titleAccent?: string
  lede?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  note?: string
  accent?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: светлый флагманский первый экран. В категории почти всё тёмное,
// и жанр «крупный заголовок плюс пара кнопок» существовал только в графитовом
// исполнении со свечением. Здесь тот же жанр на кремовой бумаге: вместо
// тёмного glow — миллиметровая сетка, погашенная радиальной маской, и одно
// тёплое пятно под заголовком.
//
// Палитра задана явными значениями, без переключения веток темы: светлота — это и есть
// смысл блока, на тёмной странице он остаётся кремовым листом, как разворот
// журнала. Палитра переключается light-dark(): в тёмной теме экран темнеет
// отрисовал бы фокусные кольца и выделение текста по тёмной ветке поверх
// светлого фона.
const STYLES = `
:where([data-vibeui-block="hero-018"]){
--vibeui-hero-018-bg:light-dark(oklch(0.983 0.011 85),oklch(0.17 0.008 85));
--vibeui-hero-018-fg:light-dark(oklch(0.24 0.021 62),oklch(0.96 0.008 85));
--vibeui-hero-018-muted:light-dark(oklch(0.51 0.019 62),oklch(0.73 0.012 85));
--vibeui-hero-018-line:light-dark(oklch(0.9 0.013 80),oklch(1 0 0 / 12%));
--vibeui-hero-018-surface:light-dark(oklch(1 0 0),oklch(0.22 0.006 85));
--vibeui-hero-018-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-018-accent-fg:oklch(from var(--vibeui-hero-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-018-dur-2:180ms;
--vibeui-hero-018-dur-3:240ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-018"]{color-scheme:dark}
:where([data-vibeui-block="hero-018"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-018"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-hero-018-bg);color:var(--vibeui-hero-018-fg);
font-family:var(--vibeui-hero-018-font);
}
[data-vibeui-block="hero-018"] *{box-sizing:border-box}
[data-vibeui-block="hero-018"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0 0 1.5rem;
padding:0.4375rem 0.875rem;border:1px solid var(--vibeui-hero-018-line);border-radius:999px;
background:var(--vibeui-hero-018-surface);color:var(--vibeui-hero-018-fg);
font-size:0.8125rem;font-weight:600;letter-spacing:0.01em;
}
[data-vibeui-block="hero-018"] [data-part="frame"]{
position:relative;overflow:hidden;padding:3.5rem 1.25rem;
}
[data-vibeui-block="hero-018"] [data-part="frame"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
transition:transform .7s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="hero-018"] [data-part="frame"]:hover img{transform:scale(1.03)}
/* Вуаль между фотографией и текстом. Снимок приносит свои тона — от почти
   белой бумаги до чёрного рукава, — и заголовок на нём то читался, то тонул.
   Слой берёт цвет фона секции, поэтому в светлой теме он высветляет кадр, а
   в тёмной затемняет: контраст держится в обеих. */
[data-vibeui-block="hero-018"] [data-part="frame"]::before{
content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
background:linear-gradient(to bottom,
color-mix(in oklab,var(--vibeui-hero-018-bg) 72%,transparent),
color-mix(in oklab,var(--vibeui-hero-018-bg) 55%,transparent) 55%,
color-mix(in oklab,var(--vibeui-hero-018-bg) 70%,transparent));
}
[data-vibeui-block="hero-018"] [data-part="canvas"]{
position:absolute;inset:0;z-index:2;pointer-events:none;
background-image:
linear-gradient(to right,var(--vibeui-hero-018-line) 1px,transparent 1px),
linear-gradient(to bottom,var(--vibeui-hero-018-line) 1px,transparent 1px);
background-size:4rem 4rem;background-position:center top;
-webkit-mask-image:radial-gradient(ellipse 68% 62% at 50% 34%,#000 20%,transparent 76%);
mask-image:radial-gradient(ellipse 68% 62% at 50% 34%,#000 20%,transparent 76%);
}
[data-vibeui-block="hero-018"] [data-part="canvas"]::after{
content:"";position:absolute;left:50%;top:-18%;width:min(46rem,120%);aspect-ratio:2/1;transform:translateX(-50%);
background:radial-gradient(closest-side,color-mix(in oklab,var(--vibeui-hero-018-accent) 26%,transparent),transparent 100%);
}
[data-vibeui-block="hero-018"] [data-part="inner"]{
position:relative;z-index:3;max-width:52rem;margin:0 auto;text-align:center;
}
[data-vibeui-block="hero-018"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:999px;background:var(--vibeui-hero-018-accent);flex:0 0 auto;color:oklch(from var(--vibeui-hero-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="hero-018"] [data-part="actions"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.75rem;margin:2rem 0 0;
}
[data-vibeui-block="hero-018"] [data-part="note"]{
margin:1.25rem 0 0;font-size:0.875rem;color:var(--vibeui-hero-018-muted);
}
@container (min-width: 40rem){
[data-vibeui-block="hero-018"] [data-part="frame"]{padding:5rem 2rem}
}
@container (min-width: 64rem){
[data-vibeui-block="hero-018"] [data-part="frame"]{padding:7rem 3rem}
[data-vibeui-block="hero-018"] [data-part="canvas"]{background-size:5.5rem 5.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-018"] *{animation:none!important;transition:none!important}}
`

/** Светлый первый экран: кремовая сетка, крупный заголовок и пара кнопок. */
export function Hero018({
  eyebrow = "Обновление 2.0 — новый первый экран",
  image = "",
  title = "Соберите лендинг, который",
  titleAccent = "выглядит дорого",
  lede = "Готовые секции ставятся одной командой, остаются в вашем репозитории и не тянут ни одной зависимости.",
  primaryLabel = "Начать бесплатно",
  primaryHref = "#",
  secondaryLabel = "Смотреть каталог",
  secondaryHref = "#",
  note = "Без карты. Четырнадцать дней полного доступа.",
  accent,
  tone = "auto",
  className,
  style,
}: Hero018Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-018" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-018"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="frame" data-empty={image ? undefined : "true"}>
          {image ? (
            <img src={image} alt="" loading="lazy" decoding="async" />
          ) : null}
          <div data-part="canvas" aria-hidden="true" />

          <div data-part="inner">
            {eyebrow ? (
              <p data-part="badge">
                <span data-part="dot" aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}

            <Heading001
              data-part="heading"
              title={title}
              titleAccent={titleAccent}
              lede={lede}
              level="h1"
              size="xl"
              align="center"
              accent={accent}
            />

            <div data-part="actions">
              <Button016
                data-part="primary"
                size="lg"
                label={primaryLabel}
                href={primaryHref}
                external={false}
                tone="accent"
                accent={accent}
              />
              <Button016
                data-part="secondary"
                size="lg"
                label={secondaryLabel}
                href={secondaryHref}
                external={false}
                tone="neutral"
                accent={accent}
              />
            </div>

            {note ? <p data-part="note">{note}</p> : null}
          </div>
        </div>
      </section>
    </>
  )
}
