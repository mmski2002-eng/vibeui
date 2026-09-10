import type { CSSProperties, ReactNode } from "react"

type Layout015Screen = {
  index: string
  title: string
  text: string
  surface?: "paper" | "graphite" | "orange"
}

export type Layout015Props = {
  /** Свои экраны вместо демонстрационных. */
  children?: ReactNode
  screens?: Layout015Screen[]
  /** Видимая подсказка перехода к следующему экрану. */
  nextHint?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Экранная презентация с мягкими остановками: несколько выразительных
// экранов с scroll-snap-align, притяжение proximity — колесо не
// перехватывается, длинная секция дочитывается свободно. Сам
// scroll-snap-type вешает принимающий проект одной строкой CSS на
// владельца прокрутки (html{scroll-snap-type:y proximity}) — блок
// не захватывает чужой scroll-root. Высота экранов в rem, не в vh.
const STYLES = `
:where([data-vibeui-block="layout-015"]){
--vibeui-layout-015-accent:#ff5900;
--vibeui-layout-015-screen:36rem;
--vibeui-layout-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="layout-015"]{
display:block;min-width:min(100%,16rem);
font-family:var(--vibeui-layout-015-font);
}
[data-vibeui-block="layout-015"] *{box-sizing:border-box}
[data-vibeui-block="layout-015"] [data-part="screen"]{
--vibeui-layout-015-bg:#ffffff;
--vibeui-layout-015-ink:#000000;
--vibeui-layout-015-muted:color-mix(in oklab,#000000 56%,#ffffff);
scroll-snap-align:start;scroll-snap-stop:normal;
min-height:var(--vibeui-layout-015-screen);
background:var(--vibeui-layout-015-bg);color:var(--vibeui-layout-015-ink);
display:flex;
}
[data-vibeui-block="layout-015"] [data-part="screen"][data-surface="graphite"]{
--vibeui-layout-015-bg:#1a1a1a;
--vibeui-layout-015-ink:#ffffff;
--vibeui-layout-015-muted:color-mix(in oklab,#ffffff 64%,#1a1a1a);
}
[data-vibeui-block="layout-015"] [data-part="screen"][data-surface="orange"]{
--vibeui-layout-015-bg:var(--vibeui-layout-015-accent);
--vibeui-layout-015-ink:#000000;
--vibeui-layout-015-muted:color-mix(in oklab,#000000 60%,var(--vibeui-layout-015-accent));
}
[data-vibeui-block="layout-015"] [data-part="inner"]{
max-width:72rem;margin:auto;width:100%;
padding:4rem 1.5rem;display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-015"] [data-part="index"]{
font-size:0.8125rem;font-weight:660;letter-spacing:0.1em;text-transform:uppercase;
color:var(--vibeui-layout-015-muted);
}
[data-vibeui-block="layout-015"] [data-part="screen"] h2{
margin:0;max-width:18ch;
font-size:clamp(2rem,6cqi,4rem);line-height:1.02;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="layout-015"] [data-part="screen"] p{
margin:0;max-width:44ch;font-size:1.125rem;line-height:1.6;
color:var(--vibeui-layout-015-muted);
}
[data-vibeui-block="layout-015"] [data-part="hint"]{
margin-top:auto;padding-top:2rem;
display:inline-flex;align-items:center;gap:0.5rem;
font-size:0.875rem;font-weight:560;color:var(--vibeui-layout-015-muted);
}
[data-vibeui-block="layout-015"] [data-part="hint"]::after{content:"↓"}
[data-vibeui-block="layout-015"] a:focus-visible{
outline:2px solid var(--vibeui-layout-015-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-015"] *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`

const DEFAULT_SCREENS: Layout015Screen[] = [
  {
    index: "Экран 01",
    title: "Каждый экран — одна мысль",
    text: "Секция занимает минимум высоту экрана, но длинный контент свободно растёт: притяжение proximity не мешает дочитать.",
    surface: "paper",
  },
  {
    index: "Экран 02",
    title: "Притяжение, не захват",
    text: "Snap-type включает проект на владельце прокрутки одной строкой CSS. Колесо и клавиатура работают как обычно.",
    surface: "graphite",
  },
  {
    index: "Экран 03",
    title: "Финал на фирменном",
    text: "Последний экран закрывает презентацию — дальше страница продолжается обычными секциями.",
    surface: "orange",
  },
]

/** Экраны с мягким scroll snap: align на секциях, snap-type включает проект. */
export function Layout015({
  children,
  screens = DEFAULT_SCREENS,
  nextHint = "Листайте",
  accent,
  className,
  style,
}: Layout015Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-015" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="layout-015" className={className} style={palette}>
        {children ??
          screens.map((screen, index) => (
            <section
              data-part="screen"
              data-surface={screen.surface === "paper" ? undefined : screen.surface}
              key={screen.index}
            >
              <div data-part="inner">
                <span data-part="index">{screen.index}</span>
                <h2>{screen.title}</h2>
                <p>{screen.text}</p>
                {index < screens.length - 1 ? (
                  <span data-part="hint">{nextHint}</span>
                ) : null}
              </div>
            </section>
          ))}
      </div>
    </>
  )
}
