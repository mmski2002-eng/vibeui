import type { ComponentProps, CSSProperties } from "react"

export type HeroAnim001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  badge?: string
  title?: string
  description?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  accent?: string
}

// Идея: полноширинная секция первого экрана лендинга. Бейдж, заголовок,
// подтекст и кнопки въезжают по очереди сверху вниз (общий keyframe, у
// каждого элемента свой animation-delay — при бесконечном повторе фаза
// сдвига держится вечно, так стаггер не ломается между циклами). Фон —
// точечная сетка под мягким радиальным ореолом, который дышит по яркости
// и масштабу, а сетка едва заметно мерцает прозрачностью.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит секцию в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
//
// container-type делает секцию собственным query-контейнером: раскладка и
// размер шрифта считаются от её ширины, а не от ширины окна — секция
// выглядит одинаково и на странице, и в узкой миниатюре каталога.
const STYLES = `
:where([data-vibeui-block="hero-anim-001"]){
--vibeui-hero-anim-001-bg:transparent;
--vibeui-hero-anim-001-fg:light-dark(oklch(0.2 0.016 266),oklch(0.97 0.004 266));
--vibeui-hero-anim-001-muted:light-dark(oklch(0.48 0.02 266),oklch(0.74 0.018 266));
--vibeui-hero-anim-001-border:light-dark(oklch(0.16 0.014 266 / 14%),oklch(1 0 0 / 16%));
--vibeui-hero-anim-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-hero-anim-001-accent-fg:light-dark(oklch(0.99 0.004 266),oklch(0.17 0.02 266));
--vibeui-hero-anim-001-glow:color-mix(in oklab,var(--vibeui-hero-anim-001-accent) 40%,transparent);
--vibeui-hero-anim-001-dot:light-dark(oklch(0.16 0.014 266 / 16%),oklch(1 0 0 / 14%));
--vibeui-hero-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-anim-001"]{color-scheme:dark}
[data-vibeui-block="hero-anim-001"]{
display:block;position:relative;isolation:isolate;overflow:hidden;
width:100%;min-width:min(100%,16rem);box-sizing:border-box;
background:var(--vibeui-hero-anim-001-bg);color:var(--vibeui-hero-anim-001-fg);
font-family:var(--vibeui-hero-anim-001-font);
container-type:inline-size;
}
[data-vibeui-block="hero-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="hero-anim-001"] [data-part="glow"]{
position:absolute;inset-inline:0;top:-35%;height:85%;z-index:0;pointer-events:none;
background:radial-gradient(50% 50% at 50% 55%,var(--vibeui-hero-anim-001-glow),transparent 72%);
animation:vibeui-hero-anim-001-breathe 9s ease-in-out infinite;
}
[data-vibeui-block="hero-anim-001"] [data-part="grid"]{
position:absolute;inset:0;z-index:0;pointer-events:none;
background-image:radial-gradient(var(--vibeui-hero-anim-001-dot) 1px,transparent 1px);
background-size:1.375rem 1.375rem;
-webkit-mask-image:radial-gradient(60% 55% at 50% 45%,#000,transparent 100%);
mask-image:radial-gradient(60% 55% at 50% 45%,#000,transparent 100%);
animation:vibeui-hero-anim-001-shimmer 6s ease-in-out infinite;
}
[data-vibeui-block="hero-anim-001"] [data-part="frame"]{
position:relative;z-index:1;
display:flex;flex-direction:column;align-items:center;text-align:center;
padding:clamp(2.75rem,14cqi,7rem) clamp(1.25rem,6cqi,2.5rem);
}
[data-vibeui-block="hero-anim-001"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.5rem;
padding:0.375rem 0.875rem;border-radius:9999px;
border:1px solid var(--vibeui-hero-anim-001-border);
font-size:0.8125rem;font-weight:550;color:var(--vibeui-hero-anim-001-muted);
opacity:0;transform:translateY(14px);
animation:vibeui-hero-anim-001-rise 5s cubic-bezier(0.16,1,0.3,1) infinite;
}
[data-vibeui-block="hero-anim-001"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-hero-anim-001-accent);
}
[data-vibeui-block="hero-anim-001"] [data-part="title"]{
margin:0.9375rem 0 0;max-width:44rem;
font-size:clamp(2.125rem,7cqi,4rem);line-height:1.06;font-weight:650;
letter-spacing:-0.02em;text-wrap:balance;
opacity:0;transform:translateY(14px);
animation:vibeui-hero-anim-001-rise 5s cubic-bezier(0.16,1,0.3,1) infinite;
animation-delay:0.35s;
}
[data-vibeui-block="hero-anim-001"] [data-part="desc"]{
margin:1rem 0 0;max-width:34rem;
font-size:clamp(1rem,2.2cqi,1.1875rem);line-height:1.6;color:var(--vibeui-hero-anim-001-muted);
text-wrap:pretty;
opacity:0;transform:translateY(14px);
animation:vibeui-hero-anim-001-rise 5s cubic-bezier(0.16,1,0.3,1) infinite;
animation-delay:0.65s;
}
[data-vibeui-block="hero-anim-001"] [data-part="actions"]{
display:flex;flex-direction:column;width:100%;max-width:20rem;gap:0.75rem;margin-top:1.875rem;
opacity:0;transform:translateY(14px);
animation:vibeui-hero-anim-001-rise 5s cubic-bezier(0.16,1,0.3,1) infinite;
animation-delay:0.9s;
}
@container (min-width:34rem){
[data-vibeui-block="hero-anim-001"] [data-part="actions"]{width:auto;max-width:none;flex-direction:row}
}
[data-vibeui-block="hero-anim-001"] [data-part="primary"],
[data-vibeui-block="hero-anim-001"] [data-part="secondary"]{
display:inline-flex;align-items:center;justify-content:center;
height:2.875rem;padding:0 1.625rem;border-radius:9999px;
font-size:0.9375rem;font-weight:600;text-decoration:none;
}
[data-vibeui-block="hero-anim-001"] [data-part="primary"]{
background:var(--vibeui-hero-anim-001-accent);color:var(--vibeui-hero-anim-001-accent-fg);
box-shadow:0 0.875rem 2.5rem -0.875rem color-mix(in oklab,var(--vibeui-hero-anim-001-accent) 70%,transparent);
}
[data-vibeui-block="hero-anim-001"] [data-part="secondary"]{
border:1px solid var(--vibeui-hero-anim-001-border);color:var(--vibeui-hero-anim-001-fg);
}
@keyframes vibeui-hero-anim-001-rise{
0%{opacity:0;transform:translateY(14px)}
8%,80%{opacity:1;transform:translateY(0)}
100%{opacity:0;transform:translateY(-6px)}
}
@keyframes vibeui-hero-anim-001-breathe{0%,100%{opacity:0.72;transform:scale(0.96)}50%{opacity:1;transform:scale(1.04)}}
@keyframes vibeui-hero-anim-001-shimmer{0%,100%{opacity:0.55}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="hero-anim-001"] [data-part="glow"],
[data-vibeui-block="hero-anim-001"] [data-part="grid"]{animation:none}
[data-vibeui-block="hero-anim-001"] [data-part="badge"],
[data-vibeui-block="hero-anim-001"] [data-part="title"],
[data-vibeui-block="hero-anim-001"] [data-part="desc"],
[data-vibeui-block="hero-anim-001"] [data-part="actions"]{animation:none;opacity:1;transform:none}
}
`

/**
 * Секция первого экрана лендинга: бейдж, заголовок, подтекст и две кнопки
 * появляются по очереди на фоне дышащего радиального свечения и точечной
 * сетки. Один файл, ноль зависимостей, собственная палитра.
 */
export function HeroAnim001({
  badge = "Уже в открытой бете",
  title = "Запускайте продукт вдвое быстрее",
  description = "Всё, что нужно команде, чтобы проектировать, собирать и выпускать, — в одном пространстве, которое не мешает работать.",
  primaryLabel = "Начать сборку",
  primaryHref = "#",
  secondaryLabel = "Записаться на демо",
  secondaryHref = "#",
  accent,
  className,
  style,
  ...props
}: HeroAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="hero-anim-001"
        data-slot="hero"
        className={className}
        style={palette}
      >
        <div data-part="glow" aria-hidden="true" />
        <div data-part="grid" aria-hidden="true" />
        <div data-part="frame">
          {badge ? (
            <span data-part="badge">
              <span data-part="dot" aria-hidden="true" />
              {badge}
            </span>
          ) : null}
          <h1 data-part="title">{title}</h1>
          {description ? <p data-part="desc">{description}</p> : null}
          <div data-part="actions">
            <a data-part="primary" href={primaryHref}>
              {primaryLabel}
            </a>
            <a data-part="secondary" href={secondaryHref}>
              {secondaryLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
