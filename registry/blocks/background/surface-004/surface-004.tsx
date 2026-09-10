import type { CSSProperties, ReactNode } from "react"

export type Surface004Props = {
  /** Контент поверх фона. Без него блок показывает демонстрационный пример. */
  children?: ReactNode
  /** Поверхность: белая или светло-серая бумага. */
  tone?: "white" | "grey"
  /** Заметность зерна. */
  grain?: "subtle" | "visible"
  accent?: string
  className?: string
  style?: CSSProperties
}

// Бумага и тонкое зерно: белая или светло-серая поверхность с почти
// незаметной текстурой из двух смещённых точечных растров. Текстура
// поддерживает крупную типографику и фотографии, не имитируя грязную
// бумагу. Оранжевый живёт в ссылках и маркерах. Зерно неподвижно,
// рисуется CSS-градиентами — без ресурсов, фильтров и JS.
const STYLES = `
:where([data-vibeui-block="surface-004"]){
--vibeui-surface-004-bg:#ffffff;
--vibeui-surface-004-ink:#000000;
--vibeui-surface-004-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-surface-004-line:color-mix(in oklab,#000000 12%,transparent);
--vibeui-surface-004-grain:color-mix(in oklab,#000000 5%,transparent);
--vibeui-surface-004-accent:#ff5900;
--vibeui-surface-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where([data-vibeui-block="surface-004"][data-tone="grey"]){
--vibeui-surface-004-bg:#f2f2f2;
--vibeui-surface-004-grain:color-mix(in oklab,#000000 6%,transparent);
}
:where([data-vibeui-block="surface-004"][data-grain="visible"]){
--vibeui-surface-004-grain:color-mix(in oklab,#000000 9%,transparent);
}
[data-vibeui-block="surface-004"]{
position:relative;display:block;min-width:min(100%,16rem);
background:var(--vibeui-surface-004-bg);color:var(--vibeui-surface-004-ink);
font-family:var(--vibeui-surface-004-font);
}
[data-vibeui-block="surface-004"] *{box-sizing:border-box}
[data-vibeui-block="surface-004"] [data-part="canvas"]{
position:absolute;inset:0;overflow:hidden;pointer-events:none;
background-image:radial-gradient(var(--vibeui-surface-004-grain) 1px,transparent 1px),radial-gradient(var(--vibeui-surface-004-grain) 1px,transparent 1px);
background-size:0.375rem 0.375rem,0.5625rem 0.5625rem;
background-position:0 0,0.1875rem 0.3125rem;
}
[data-vibeui-block="surface-004"] [data-part="frame"]{
position:relative;max-width:80rem;margin:0 auto;min-height:28rem;
padding:4rem 1.5rem;display:flex;flex-direction:column;justify-content:center;gap:1.25rem;
}
[data-vibeui-block="surface-004"] [data-part="kicker"]{
margin:0;display:flex;align-items:center;gap:0.75rem;
font-size:0.8125rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-surface-004-muted);
}
[data-vibeui-block="surface-004"] [data-part="kicker"]::after{
content:"";flex:0 1 6rem;height:1px;background:var(--vibeui-surface-004-line);
}
[data-vibeui-block="surface-004"] [data-part="title"]{
margin:0;max-width:22ch;
font-size:clamp(2rem,5.5cqi,3.75rem);line-height:1.05;letter-spacing:-0.02em;font-weight:640;
}
[data-vibeui-block="surface-004"] [data-part="lede"]{
margin:0;max-width:46ch;font-size:1.0625rem;line-height:1.65;
color:var(--vibeui-surface-004-muted);
}
[data-vibeui-block="surface-004"] [data-part="link"]{
align-self:flex-start;color:var(--vibeui-surface-004-ink);text-decoration:none;
font-size:1rem;font-weight:580;
border-bottom:2px solid var(--vibeui-surface-004-accent);padding-bottom:0.125rem;
transition:color .16s ease;
}
[data-vibeui-block="surface-004"] [data-part="link"]:hover{color:var(--vibeui-surface-004-accent)}
[data-vibeui-block="surface-004"] [data-part="link"]:focus-visible{
outline:2px solid var(--vibeui-surface-004-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="surface-004"] [data-part="frame"]{padding:6rem 3rem;min-height:34rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="surface-004"] *{animation:none!important;transition:none!important}}
`

/** Бумажный фон с тонким зерном для редакционных страниц и портфолио. */
export function Surface004({
  children,
  tone = "white",
  grain = "subtle",
  accent,
  className,
  style,
}: Surface004Props) {
  const palette = {
    ...(accent ? { "--vibeui-surface-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="surface-004"
        data-tone={tone === "grey" ? "grey" : undefined}
        data-grain={grain === "visible" ? "visible" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="canvas" aria-hidden="true" />
        <div data-part="frame">
          {children ?? (
            <>
              <p data-part="kicker">Редакция · сентябрь</p>
              <h2 data-part="title">Бумага, на которой хочется писать</h2>
              <p data-part="lede">
                Почти незаметное зерно даёт поверхности материальность:
                крупный набор и фотографии перестают висеть в пустоте, а
                мелкий текст остаётся чистым.
              </p>
              <a data-part="link" href="#read">
                Читать выпуск
              </a>
            </>
          )}
        </div>
      </section>
    </>
  )
}
