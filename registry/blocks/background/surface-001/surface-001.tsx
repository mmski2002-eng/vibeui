import type { CSSProperties, ReactNode } from "react"

export type Surface001Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Серые архитектурные зоны на белом поле. */
  zones?: boolean
  /** Тонкие вертикальные линейки разметки. */
  lines?: boolean
  accent?: string
  className?: string
  style?: CSSProperties
}

// Светлая архитектурная поверхность: белое поле, крупные спокойные зоны
// #F2F2F2, две тонкие линейки разметки и один оранжевый узел. Фон-слой
// для всей страницы или секции: контент кладётся поверх, декоративный слой
// не перехватывает мышь и не попадает в фокус. Никакого JS и движения.
const STYLES = `
:where([data-vibeui-block="surface-001"]){
--vibeui-surface-001-bg:#ffffff;
--vibeui-surface-001-panel:#f2f2f2;
--vibeui-surface-001-ink:#000000;
--vibeui-surface-001-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-surface-001-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-surface-001-accent:#ff5900;
--vibeui-surface-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="surface-001"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-surface-001-bg);color:var(--vibeui-surface-001-ink);
font-family:var(--vibeui-surface-001-font);
}
[data-vibeui-block="surface-001"] *{box-sizing:border-box}
[data-vibeui-block="surface-001"] [data-part="canvas"]{
position:absolute;inset:0;overflow:hidden;pointer-events:none;
}
[data-vibeui-block="surface-001"] [data-part="zone-a"]{
position:absolute;top:0;right:0;width:36%;height:72%;
background:var(--vibeui-surface-001-panel);
}
[data-vibeui-block="surface-001"] [data-part="zone-b"]{
position:absolute;bottom:0;left:0;width:52%;height:18%;
background:var(--vibeui-surface-001-panel);
}
[data-vibeui-block="surface-001"] [data-part="line-a"],
[data-vibeui-block="surface-001"] [data-part="line-b"]{
position:absolute;top:0;bottom:0;width:1px;background:var(--vibeui-surface-001-line);
}
[data-vibeui-block="surface-001"] [data-part="line-a"]{left:clamp(1rem,7cqi,6rem)}
[data-vibeui-block="surface-001"] [data-part="line-b"]{right:clamp(1rem,7cqi,6rem)}
[data-vibeui-block="surface-001"] [data-part="node"]{
position:absolute;top:72%;right:calc(clamp(1rem,7cqi,6rem) - 0.28125rem);
width:0.5625rem;height:0.5625rem;margin-top:-0.28125rem;
background:var(--vibeui-surface-001-accent);
}
[data-vibeui-block="surface-001"][data-zones="off"] [data-part="zone-a"],
[data-vibeui-block="surface-001"][data-zones="off"] [data-part="zone-b"]{display:none}
[data-vibeui-block="surface-001"][data-lines="off"] [data-part="line-a"],
[data-vibeui-block="surface-001"][data-lines="off"] [data-part="line-b"],
[data-vibeui-block="surface-001"][data-lines="off"] [data-part="node"]{display:none}
[data-vibeui-block="surface-001"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-001"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0;
font-size:0.8125rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-surface-001-muted);
}
[data-vibeui-block="surface-001"] [data-part="eyebrow"]::before{
content:"";width:0.5rem;height:0.5rem;background:var(--vibeui-surface-001-accent);
}
[data-vibeui-block="surface-001"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.875rem,5cqi,3.5rem);line-height:1.06;letter-spacing:-0.02em;font-weight:650;
}
[data-vibeui-block="surface-001"] [data-part="lede"]{
margin:0;max-width:44ch;font-size:1.0625rem;line-height:1.6;
color:var(--vibeui-surface-001-muted);
}
[data-vibeui-block="surface-001"] [data-part="panels"]{
display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:1rem;margin-top:1.5rem;
}
[data-vibeui-block="surface-001"] [data-part="panel"]{
background:var(--vibeui-surface-001-bg);border:1px solid var(--vibeui-surface-001-line);
padding:1.25rem;display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="surface-001"] [data-part="panel"] strong{
font-size:0.9375rem;font-weight:640;letter-spacing:-0.01em;
}
[data-vibeui-block="surface-001"] [data-part="panel"] span{
font-size:0.875rem;line-height:1.5;color:var(--vibeui-surface-001-muted);
}
@container (min-width: 48rem){
[data-vibeui-block="surface-001"] [data-part="frame"]{padding:6rem 3rem;min-height:34rem}
}
`

const DEMO_PANELS = [
  ["Пространство", "Крупные поля и спокойные зоны держат внимание на сути."],
  ["Иерархия", "Чёрный текст, серые панели и один оранжевый акцент."],
  ["Порядок", "Тонкие линейки собирают страницу в архитектурную сетку."],
] as const

/** Светлый архитектурный фон страницы: белое поле, серые зоны, точечный акцент. */
export function Surface001({
  children,
  zones = true,
  lines = true,
  accent,
  className,
  style,
}: Surface001Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-001"
        data-zones={zones ? undefined : "off"}
        data-lines={lines ? undefined : "off"}
        className={className}
        style={palette}
      >
        <div data-part="canvas" aria-hidden="true">
          <div data-part="zone-a" />
          <div data-part="zone-b" />
          <div data-part="line-a" />
          <div data-part="line-b" />
          <div data-part="node" />
        </div>
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="eyebrow">Архитектура страницы</p>
              <h2 data-part="title">Спокойная поверхность для содержимого</h2>
              <p data-part="lede">
                Белое поле и серые зоны различают уровни без декоративного
                шума: текст, панели и карточки читаются на своих местах.
              </p>
              <div data-part="panels">
                {DEMO_PANELS.map(([title, text]) => (
                  <div data-part="panel" key={title}>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
