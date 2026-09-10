import type { CSSProperties, ReactNode } from "react"

export type Surface013Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Ширина светового проёма. */
  width?: "narrow" | "wide"
  /** Мягкость света. */
  softness?: "crisp" | "soft"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Верхний архитектурный свет: тёплый световой проём падает сверху на
// графитовую студийную сцену — почти предметная композиция для рабочего
// инструмента, премиального сервиса и продуктового анонса. Реализация —
// CSS-градиенты конуса и пола, никакого рендеринга: статический вариант
// и есть основной. Текст стоит в освещённой зоне. Без JS.
const STYLES = `
:where([data-vibeui-block="surface-013"]){
--vibeui-surface-013-bg:#000000;
--vibeui-surface-013-ink:#ffffff;
--vibeui-surface-013-muted:color-mix(in oklab,#ffffff 62%,#000000);
--vibeui-surface-013-accent:#ff5900;
--vibeui-surface-013-beam:34%;
--vibeui-surface-013-blur:18%;
--vibeui-surface-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-013"][data-width="wide"]){--vibeui-surface-013-beam:52%}
:where([data-vibeui-block="surface-013"][data-softness="soft"]){--vibeui-surface-013-blur:30%}
[data-vibeui-block="surface-013"]{
position:relative;display:block;min-width:min(100%,16rem);overflow:hidden;
background:var(--vibeui-surface-013-bg);color:var(--vibeui-surface-013-ink);
font-family:var(--vibeui-surface-013-font);
}
[data-vibeui-block="surface-013"] *{box-sizing:border-box}
[data-vibeui-block="surface-013"] [data-part="beam"]{
position:absolute;inset:0;pointer-events:none;
background:linear-gradient(180deg,color-mix(in oklab,var(--vibeui-surface-013-accent) 30%,#ffffff 12%) 0%,color-mix(in oklab,var(--vibeui-surface-013-accent) 16%,transparent) 40%,transparent 78%);
-webkit-mask-image:linear-gradient(90deg,transparent calc(50% - var(--vibeui-surface-013-beam)/2 - var(--vibeui-surface-013-blur)),#000000 calc(50% - var(--vibeui-surface-013-beam)/2),#000000 calc(50% + var(--vibeui-surface-013-beam)/2),transparent calc(50% + var(--vibeui-surface-013-beam)/2 + var(--vibeui-surface-013-blur)));
mask-image:linear-gradient(90deg,transparent calc(50% - var(--vibeui-surface-013-beam)/2 - var(--vibeui-surface-013-blur)),#000000 calc(50% - var(--vibeui-surface-013-beam)/2),#000000 calc(50% + var(--vibeui-surface-013-beam)/2),transparent calc(50% + var(--vibeui-surface-013-beam)/2 + var(--vibeui-surface-013-blur)));
}
[data-vibeui-block="surface-013"] [data-part="floor"]{
position:absolute;left:0;right:0;bottom:0;height:34%;pointer-events:none;
background:radial-gradient(60% 100% at 50% 100%,color-mix(in oklab,var(--vibeui-surface-013-accent) 14%,transparent),transparent 72%);
}
[data-vibeui-block="surface-013"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:30rem;
padding:5rem 1.5rem 4rem;display:flex;flex-direction:column;align-items:center;text-align:center;
justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-013"] [data-part="kicker"]{
margin:0;display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.8125rem;font-weight:620;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-surface-013-muted);
}
[data-vibeui-block="surface-013"] [data-part="kicker"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-013-accent);
}
[data-vibeui-block="surface-013"] [data-part="title"]{
margin:0;max-width:20ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:660;
}
[data-vibeui-block="surface-013"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-013-muted);
}
[data-vibeui-block="surface-013"] [data-part="action"]{
display:inline-flex;align-items:center;
min-height:2.75rem;padding:0.375rem 1.375rem;margin-top:0.5rem;
background:var(--vibeui-surface-013-accent);color:#000000;
text-decoration:none;font-size:1rem;font-weight:640;
transition:filter .16s ease;
}
[data-vibeui-block="surface-013"] [data-part="action"]:hover{filter:brightness(1.06)}
[data-vibeui-block="surface-013"] a:focus-visible{
outline:2px solid var(--vibeui-surface-013-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-013"] [data-part="frame"]{min-height:36rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-013"] *{animation:none!important;transition:none!important}}
`

/** Студийная сцена с тёплым световым проёмом сверху — CSS без рендеринга. */
export function Surface013({
  children,
  width = "narrow",
  softness = "crisp",
  accent,
  className,
  style,
}: Surface013Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-013" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-013"
        data-width={width === "wide" ? "wide" : undefined}
        data-softness={softness === "soft" ? "soft" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="beam" aria-hidden="true" />
        <div data-part="floor" aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="kicker">Анонс инструмента</p>
              <h2 data-part="title">Свет ставит предмет на сцену</h2>
              <p data-part="lede">
                Тёплый проём падает сверху и собирает внимание в центре —
                как в предметной студии. Форма, заголовок или карточка
                встают в луч без единого шейдера.
              </p>
              <a data-part="action" href="#waitlist">
                Записаться в лист ожидания
              </a>
            </>
          )}
        </div>
      </section>
    </>
  )
}
