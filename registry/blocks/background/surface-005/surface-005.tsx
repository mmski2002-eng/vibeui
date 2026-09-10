import type { CSSProperties, ReactNode } from "react"

export type Surface005Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Композиция: сплошной оранжевый или оранжевое поле с белым низом. */
  split?: boolean
  /** Тонкая чёрная рамка по краю поля. */
  border?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Оранжевый постер: крупная плоскость #FF5900 и чёрная типографика.
// Впечатление создают масштаб и резкий ритм, а не эффекты: геометрия
// статична, движения нет. Сплошной оранжевый — для выразительного
// экрана; длинное чтение переносится на спокойную соседнюю поверхность
// (режим split). Мелкий белый текст на оранжевом не используется.
const STYLES = `
:where([data-vibeui-block="surface-005"]){
--vibeui-surface-005-accent:#ff5900;
--vibeui-surface-005-ink:#000000;
--vibeui-surface-005-paper:#ffffff;
--vibeui-surface-005-muted:color-mix(in oklab,#000000 64%,var(--vibeui-surface-005-accent));
--vibeui-surface-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="surface-005"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-surface-005-accent);color:var(--vibeui-surface-005-ink);
font-family:var(--vibeui-surface-005-font);
}
[data-vibeui-block="surface-005"] *{box-sizing:border-box}
[data-vibeui-block="surface-005"][data-border="on"]{
box-shadow:inset 0 0 0 0.375rem var(--vibeui-surface-005-ink);
}
[data-vibeui-block="surface-005"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:26rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-005"] [data-part="mark"]{
margin:0;display:inline-flex;align-items:center;gap:0.625rem;
font-size:0.875rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="surface-005"] [data-part="mark"]::before{
content:"";width:0.75rem;height:0.75rem;background:var(--vibeui-surface-005-ink);
}
[data-vibeui-block="surface-005"] [data-part="title"]{
margin:0;max-width:16ch;
font-size:clamp(2.5rem,8cqi,5.5rem);line-height:0.98;letter-spacing:-0.03em;font-weight:760;
text-transform:uppercase;
}
[data-vibeui-block="surface-005"] [data-part="row"]{
display:flex;flex-wrap:wrap;gap:1rem 2.5rem;align-items:baseline;
font-size:1.0625rem;font-weight:600;
}
[data-vibeui-block="surface-005"] [data-part="action"]{
align-self:flex-start;display:inline-flex;align-items:center;
min-height:2.875rem;padding:0.375rem 1.5rem;margin-top:0.5rem;
background:var(--vibeui-surface-005-ink);color:var(--vibeui-surface-005-accent);
text-decoration:none;font-size:1rem;font-weight:680;letter-spacing:0.01em;
transition:transform .16s ease;
}
[data-vibeui-block="surface-005"] [data-part="action"]:hover{transform:translateY(-0.125rem)}
[data-vibeui-block="surface-005"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-surface-005-ink);outline-offset:3px;
}
[data-vibeui-block="surface-005"] [data-part="paper"]{
display:none;background:var(--vibeui-surface-005-paper);
}
[data-vibeui-block="surface-005"][data-split="on"] [data-part="paper"]{
display:block;
}
[data-vibeui-block="surface-005"] [data-part="paper-frame"]{
max-width:80rem;margin:0 auto;padding:2.5rem 1.5rem;
display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:1.5rem;
}
[data-vibeui-block="surface-005"] [data-part="note"]{
display:flex;flex-direction:column;gap:0.375rem;
border-top:3px solid var(--vibeui-surface-005-ink);padding-top:0.75rem;
}
[data-vibeui-block="surface-005"] [data-part="note"] strong{
font-size:1rem;font-weight:660;letter-spacing:-0.01em;
}
[data-vibeui-block="surface-005"] [data-part="note"] span{
font-size:0.9375rem;line-height:1.55;color:color-mix(in oklab,#000000 62%,#ffffff);
}
@container (min-width: 48rem){
[data-vibeui-block="surface-005"] [data-part="frame"]{padding:5.5rem 3rem;min-height:30rem}
[data-vibeui-block="surface-005"] [data-part="paper-frame"]{padding:3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-005"] *{animation:none!important;transition:none!important}}
`

/** Плакатный оранжевый фон: масштабная плоскость #FF5900 и чёрная типографика. */
export function Surface005({
  children,
  split = true,
  border = false,
  accent,
  className,
  style,
}: Surface005Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-005"
        data-split={split ? "on" : undefined}
        data-border={border ? "on" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="mark">Фестиваль дизайна</p>
              <h2 data-part="title">Плоскость держит взгляд</h2>
              <div data-part="row">
                <span>12–14 октября</span>
                <span>Екатеринбург</span>
              </div>
              <a data-part="action" href="#tickets">
                Взять билет
              </a>
            </>
          )}
        </div>
        <div data-part="paper">
          <div data-part="paper-frame">
            <div data-part="note">
              <strong>Спокойный низ</strong>
              <span>Длинное чтение живёт на белой поверхности рядом.</span>
            </div>
            <div data-part="note">
              <strong>Резкий ритм</strong>
              <span>Контраст плоскостей и есть постер — без эффектов.</span>
            </div>
            <div data-part="note">
              <strong>Чёрная типографика</strong>
              <span>На чистом оранжевом текст всегда тёмный.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
