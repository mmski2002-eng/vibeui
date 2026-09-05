import type { CSSProperties } from "react"

export type Hero018Props = {
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
// журнала. Поэтому же на корне объявлен color-scheme:light — иначе браузер
// отрисовал бы фокусные кольца и выделение текста по тёмной ветке поверх
// светлого фона.
const STYLES = `
:where([data-vibeui-block="hero-018"]){
--vibeui-hero-018-bg:oklch(0.983 0.011 85);
--vibeui-hero-018-fg:oklch(0.24 0.021 62);
--vibeui-hero-018-muted:oklch(0.51 0.019 62);
--vibeui-hero-018-line:oklch(0.9 0.013 80);
--vibeui-hero-018-surface:oklch(1 0 0);
--vibeui-hero-018-accent:oklch(0.62 0.16 42);
--vibeui-hero-018-accent-fg:oklch(from var(--vibeui-hero-018-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="hero-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;color-scheme:light;
background:var(--vibeui-hero-018-bg);color:var(--vibeui-hero-018-fg);
font-family:var(--vibeui-hero-018-font);
}
[data-vibeui-block="hero-018"] *{box-sizing:border-box}
[data-vibeui-block="hero-018"] [data-part="frame"]{
position:relative;overflow:hidden;padding:3.5rem 1.25rem;
}
[data-vibeui-block="hero-018"] [data-part="canvas"]{
position:absolute;inset:0;pointer-events:none;
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
position:relative;max-width:52rem;margin:0 auto;text-align:center;
}
[data-vibeui-block="hero-018"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0 0 1.5rem;
padding:0.4375rem 0.875rem;border:1px solid var(--vibeui-hero-018-line);border-radius:999px;
background:var(--vibeui-hero-018-surface);color:var(--vibeui-hero-018-fg);
font-size:0.8125rem;font-weight:600;letter-spacing:0.01em;
}
[data-vibeui-block="hero-018"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:999px;background:var(--vibeui-hero-018-accent);flex:0 0 auto;
}
[data-vibeui-block="hero-018"] h1{
margin:0;font-size:clamp(2rem,7cqi,4.25rem);line-height:1.02;letter-spacing:-0.035em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-018"] [data-part="mark"]{
background:linear-gradient(transparent 62%,color-mix(in oklab,var(--vibeui-hero-018-accent) 30%,transparent) 0);
padding:0 0.1em;
}
[data-vibeui-block="hero-018"] [data-part="lede"]{
margin:1.25rem auto 0;max-width:36rem;font-size:clamp(1rem,1.7cqi,1.25rem);line-height:1.55;
color:var(--vibeui-hero-018-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-018"] [data-part="actions"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.75rem;margin:2rem 0 0;
}
[data-vibeui-block="hero-018"] [data-part="primary"],
[data-vibeui-block="hero-018"] [data-part="secondary"]{
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
min-height:3rem;padding:0.75rem 1.5rem;border-radius:0.75rem;
font-size:1rem;font-weight:650;text-decoration:none;
transition:transform .16s ease,box-shadow .16s ease,background-color .16s ease;
}
[data-vibeui-block="hero-018"] [data-part="primary"]{
background:var(--vibeui-hero-018-accent);color:var(--vibeui-hero-018-accent-fg);
border:1px solid transparent;
box-shadow:0 8px 20px color-mix(in oklab,var(--vibeui-hero-018-accent) 24%,transparent);
}
[data-vibeui-block="hero-018"] [data-part="secondary"]{
background:var(--vibeui-hero-018-surface);color:var(--vibeui-hero-018-fg);
border:1px solid var(--vibeui-hero-018-line);
}
[data-vibeui-block="hero-018"] [data-part="primary"]:hover,
[data-vibeui-block="hero-018"] [data-part="secondary"]:hover{transform:translateY(-1px)}
[data-vibeui-block="hero-018"] a:focus-visible{
outline:3px solid color-mix(in oklab,var(--vibeui-hero-018-accent) 55%,transparent);outline-offset:2px;
}
[data-vibeui-block="hero-018"] [data-part="note"]{
margin:1.25rem 0 0;font-size:0.875rem;color:var(--vibeui-hero-018-muted);
}
@container (min-width: 40rem){
[data-vibeui-block="hero-018"] [data-part="frame"]{padding:5rem 2rem}
[data-vibeui-block="hero-018"] [data-part="primary"],
[data-vibeui-block="hero-018"] [data-part="secondary"]{padding:0.875rem 1.75rem;font-size:1.0625rem}
}
@container (min-width: 64rem){
[data-vibeui-block="hero-018"] [data-part="frame"]{padding:7rem 3rem}
[data-vibeui-block="hero-018"] [data-part="canvas"]{background-size:5.5rem 5.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-018"] *{animation:none!important;transition:none!important}}
`

/** Светлый первый экран: кремовая сетка, крупный заголовок и пара кнопок. */
export function Hero018({
  eyebrow = "Обновление 2.0 — светлая тема",
  title = "Соберите лендинг, который",
  titleAccent = "выглядит дорого",
  lede = "Готовые секции ставятся одной командой, остаются в вашем репозитории и не тянут ни одной зависимости.",
  primaryLabel = "Начать бесплатно",
  primaryHref = "#",
  secondaryLabel = "Смотреть каталог",
  secondaryHref = "#",
  note = "Без карты. Четырнадцать дней полного доступа.",
  accent,
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
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="canvas" aria-hidden="true" />

          <div data-part="inner">
            {eyebrow ? (
              <p data-part="eyebrow">
                <span data-part="dot" aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}

            <h1>
              {title}
              {titleAccent ? (
                <>
                  {" "}
                  <span data-part="mark">{titleAccent}</span>
                </>
              ) : null}
            </h1>

            {lede ? <p data-part="lede">{lede}</p> : null}

            <div data-part="actions">
              <a data-part="primary" href={primaryHref}>
                {primaryLabel}
              </a>
              <a data-part="secondary" href={secondaryHref}>
                {secondaryLabel}
              </a>
            </div>

            {note ? <p data-part="note">{note}</p> : null}
          </div>
        </div>
      </section>
    </>
  )
}
