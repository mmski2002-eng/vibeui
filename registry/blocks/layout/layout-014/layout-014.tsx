import type { CSSProperties, ReactNode } from "react"

type Layout014Panel = {
  index: string
  title: string
  text: string
  /** Поверхность панели. */
  surface?: "paper" | "graphite" | "orange"
}

export type Layout014Props = {
  /** Свои панели вместо демонстрационных. */
  children?: ReactNode
  heading?: string
  panels?: Layout014Panel[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Накладывающиеся панели: крупные карточки этапов последовательно
// прилипают к верху сцены, предыдущая остаётся видимой краем. Чистый
// CSS: каждая панель position:sticky со ступенчатым top; никакого
// захвата прокрутки. Высота панели растёт от контента — русский текст
// не обрезается. Порядок совпадает с чтением; фокус по ссылкам идёт
// по DOM. В узкой колонке — обычная стопка без перекрытия.
const STYLES = `
:where([data-vibeui-block="layout-014"]){
--vibeui-layout-014-bg:#ffffff;
--vibeui-layout-014-ink:#000000;
--vibeui-layout-014-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-014-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-014-accent:#ff5900;
--vibeui-layout-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-014"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-014-bg);color:var(--vibeui-layout-014-ink);
font-family:var(--vibeui-layout-014-font);
}
[data-vibeui-block="layout-014"] *{box-sizing:border-box}
[data-vibeui-block="layout-014"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:2.5rem 1rem 4rem;
display:flex;flex-direction:column;gap:1.5rem;
}
[data-vibeui-block="layout-014"] [data-part="heading"]{
margin:0;max-width:24ch;
font-size:clamp(1.75rem,4.4cqi,2.75rem);line-height:1.08;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-014"] [data-part="stack"]{
display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-014"] [data-part="panel"]{
--vibeui-layout-014-panel-bg:#f2f2f2;
--vibeui-layout-014-panel-ink:#000000;
--vibeui-layout-014-panel-muted:color-mix(in oklab,#000000 58%,#f2f2f2);
background:var(--vibeui-layout-014-panel-bg);color:var(--vibeui-layout-014-panel-ink);
border:1px solid var(--vibeui-layout-014-line);
padding:1.75rem 1.5rem;display:flex;flex-direction:column;gap:0.625rem;
}
[data-vibeui-block="layout-014"] [data-part="panel"][data-surface="graphite"]{
--vibeui-layout-014-panel-bg:#1a1a1a;
--vibeui-layout-014-panel-ink:#ffffff;
--vibeui-layout-014-panel-muted:color-mix(in oklab,#ffffff 66%,#1a1a1a);
border-color:transparent;
}
[data-vibeui-block="layout-014"] [data-part="panel"][data-surface="orange"]{
--vibeui-layout-014-panel-bg:var(--vibeui-layout-014-accent);
--vibeui-layout-014-panel-ink:#000000;
--vibeui-layout-014-panel-muted:color-mix(in oklab,#000000 60%,var(--vibeui-layout-014-accent));
border-color:transparent;
}
[data-vibeui-block="layout-014"] [data-part="panel"] span{
font-size:0.8125rem;font-weight:660;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-layout-014-panel-muted);
}
[data-vibeui-block="layout-014"] [data-part="panel"] h3{
margin:0;font-size:clamp(1.375rem,3.2cqi,2rem);letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="layout-014"] [data-part="panel"] p{
margin:0;max-width:52ch;font-size:1rem;line-height:1.6;
color:var(--vibeui-layout-014-panel-muted);
}
@container (min-width: 48rem){
[data-vibeui-block="layout-014"] [data-part="stack"]{gap:1.25rem}
[data-vibeui-block="layout-014"] [data-part="panel"]{
position:sticky;padding:2.25rem 2rem;min-height:16rem;
}
[data-vibeui-block="layout-014"] [data-part="panel"]:nth-child(1){top:1rem}
[data-vibeui-block="layout-014"] [data-part="panel"]:nth-child(2){top:2.25rem}
[data-vibeui-block="layout-014"] [data-part="panel"]:nth-child(3){top:3.5rem}
[data-vibeui-block="layout-014"] [data-part="panel"]:nth-child(4){top:4.75rem}
[data-vibeui-block="layout-014"] [data-part="panel"]:nth-child(5){top:6rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PANELS: Layout014Panel[] = [
  {
    index: "Этап 01",
    title: "Исследование",
    text: "Первая панель прилипает к верху и остаётся видимой краем, когда приходит следующая. Высота растёт от текста — ничего не обрезается.",
    surface: "paper",
  },
  {
    index: "Этап 02",
    title: "Проектирование",
    text: "Каждая следующая панель садится чуть ниже предыдущей: ступенька из заголовков читается как оглавление процесса.",
    surface: "graphite",
  },
  {
    index: "Этап 03",
    title: "Запуск",
    text: "Финальная панель — кульминация на фирменной плоскости. Ниже страница продолжается обычным потоком.",
    surface: "orange",
  },
]

/** Накладывающиеся sticky-панели этапов: перекрытие краями без захвата прокрутки. */
export function Layout014({
  children,
  heading = "Как мы работаем",
  panels = DEFAULT_PANELS,
  accent,
  className,
  style,
}: Layout014Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-014" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="layout-014" className={className} style={palette}>
        <div data-part="shell">
          <h2 data-part="heading">{heading}</h2>
          <div data-part="stack">
            {children ??
              panels.map((panel) => (
                <article
                  data-part="panel"
                  data-surface={panel.surface === "paper" ? undefined : panel.surface}
                  key={panel.index}
                >
                  <span>{panel.index}</span>
                  <h3>{panel.title}</h3>
                  <p>{panel.text}</p>
                </article>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
