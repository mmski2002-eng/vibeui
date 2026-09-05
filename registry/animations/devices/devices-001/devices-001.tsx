import type { ComponentProps, CSSProperties } from "react"

export type Devices001Props = Omit<ComponentProps<"section">, "children"> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  /** Блик света, скользящий по экрану. false — экран без блика. */
  sheen?: boolean
  /** Изометрический наклон рамки. */
  isometric?: boolean
}

// Идея: рамка ноутбука — экран на шарнире над клавиатурной декой с
// трекпадом — с демо-интерфейсом внутри экрана. По стеклу экрана раз в
// несколько секунд скользит мягкий диагональный блик света, будто на него
// падает отражение; это и есть анимация категории. Сам ноутбук можно
// наклонить в изометрию через проп isometric.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="devices-001"]){
--vibeui-devices-001-bg:light-dark(oklch(0.97 0.004 260),oklch(0.16 0.012 260));
--vibeui-devices-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-devices-001-muted:color-mix(in oklab,var(--vibeui-devices-001-fg) 58%,transparent);
--vibeui-devices-001-border:light-dark(oklch(0.88 0.006 260),oklch(0.32 0.012 260));
--vibeui-devices-001-shell:light-dark(oklch(0.86 0.006 260),oklch(0.4 0.012 260));
--vibeui-devices-001-screen:light-dark(oklch(0.99 0.002 260),oklch(0.99 0.002 260));
--vibeui-devices-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-devices-001-accent-fg:oklch(from var(--vibeui-devices-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-devices-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="devices-001"]{color-scheme:dark}
[data-vibeui-block="devices-001"]{
display:block;box-sizing:border-box;width:100%;max-width:21rem;margin:0;
color:var(--vibeui-devices-001-fg);font-family:var(--vibeui-devices-001-font);
}
[data-vibeui-block="devices-001"] *{box-sizing:border-box}
[data-vibeui-block="devices-001"] [data-part="stage"]{padding:1rem 0.5rem;perspective:1600px}
[data-vibeui-block="devices-001"] [data-part="frame"]{
transition:transform .3s ease;transform-origin:center;
}
/* Крышка ноутбука: тёмная рамка-бордер вокруг светлого экрана. */
[data-vibeui-block="devices-001"] [data-part="screen"]{
position:relative;isolation:isolate;overflow:hidden;
border-radius:0.875rem 0.875rem 0.3125rem 0.3125rem;
padding:0.5625rem 0.5rem 0.375rem;
background:var(--vibeui-devices-001-shell);
box-shadow:0 1.5rem 2.5rem -1.5rem oklch(0 0 0 / 0.35);
}
[data-vibeui-block="devices-001"] [data-part="cam"]{
position:absolute;top:0.25rem;left:50%;width:0.1875rem;height:0.1875rem;
border-radius:9999px;background:color-mix(in oklab,var(--vibeui-devices-001-fg) 35%,transparent);
transform:translateX(-50%);
}
[data-vibeui-block="devices-001"] [data-part="display"]{
position:relative;border-radius:0.5rem;overflow:hidden;
aspect-ratio:16/10.4;background:var(--vibeui-devices-001-screen);
display:flex;flex-direction:column;
}
[data-vibeui-block="devices-001"] [data-part="bar"]{
display:flex;align-items:center;gap:0.25rem;
padding:0.5rem 0.625rem;border-bottom:1px solid var(--vibeui-devices-001-border);
}
[data-vibeui-block="devices-001"] [data-part="bardot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-devices-001-fg) 20%,transparent);
}
[data-vibeui-block="devices-001"] [data-part="body"]{
display:flex;align-items:center;gap:0.5rem;padding:0.625rem;
}
[data-vibeui-block="devices-001"] [data-part="tile"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.875rem;height:1.875rem;border-radius:0.5rem;
background:var(--vibeui-devices-001-accent);color:var(--vibeui-devices-001-accent-fg);
}
[data-vibeui-block="devices-001"] [data-part="tile"] svg{width:1rem;height:1rem}
[data-vibeui-block="devices-001"] [data-part="lines"]{
display:flex;flex-direction:column;gap:0.25rem;flex:1;min-width:0;
}
[data-vibeui-block="devices-001"] [data-part="line"]{
height:0.3125rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-devices-001-fg) 14%,transparent);
}
[data-vibeui-block="devices-001"] [data-part="line"]:nth-child(2){width:62%}
[data-vibeui-block="devices-001"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.25rem;flex:1;
padding:0 0.625rem 0.625rem;
}
[data-vibeui-block="devices-001"] [data-part="bar-value"]{
flex:1;border-radius:0.1875rem 0.1875rem 0 0;
background:color-mix(in oklab,var(--vibeui-devices-001-accent) 45%,transparent);
}
[data-vibeui-block="devices-001"] [data-part="bar-value"]:nth-child(3){background:var(--vibeui-devices-001-accent)}
/* Блик: скошенная светлая полоса, съезжающая по экрану по кругу. */
[data-vibeui-block="devices-001"] [data-part="sheen"]{
position:absolute;inset:-20% -60%;z-index:1;pointer-events:none;
background:linear-gradient(75deg,transparent 42%,color-mix(in oklab,white 70%,transparent) 50%,transparent 58%);
transform:translateX(-70%);
animation:vibeui-devices-001-sheen 5.5s ease-in-out infinite;
}
[data-vibeui-block="devices-001"][data-sheen="false"] [data-part="sheen"]{display:none}
/* Шарнир: тонкая грань между экраном и декой. */
[data-vibeui-block="devices-001"] [data-part="hinge"]{
height:0.375rem;margin:0 0.375rem;border-radius:0 0 0.125rem 0.125rem;
background:linear-gradient(to bottom,var(--vibeui-devices-001-shell),var(--vibeui-devices-001-border));
}
/* Дека: шире экрана, с трекпадом по центру и скошенным нижним краем. */
[data-vibeui-block="devices-001"] [data-part="base"]{
position:relative;height:0.875rem;margin:0 -0.5rem;
background:linear-gradient(to bottom,var(--vibeui-devices-001-border),var(--vibeui-devices-001-shell));
border-radius:0 0 0.625rem 0.625rem;
clip-path:polygon(0 0,100% 0,94% 100%,6% 100%);
display:flex;align-items:flex-start;justify-content:center;
}
[data-vibeui-block="devices-001"] [data-part="trackpad"]{
margin-top:0.1875rem;width:3rem;height:0.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-devices-001-fg) 12%,transparent);
}
@keyframes vibeui-devices-001-sheen{
0%,18%{transform:translateX(-70%);opacity:0}
30%{opacity:0.9}
55%,100%{transform:translateX(70%);opacity:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="devices-001"] [data-part="sheen"]{animation:none;display:none}
}
`

const SPARK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
)

/**
 * Рамка ноутбука с демо-интерфейсом на экране и бликом света, скользящим по
 * стеклу. Один файл, ноль зависимостей, собственная палитра.
 */
export function Devices001({
  label = "Ноутбук с демо-интерфейсом на экране",
  accent,
  sheen = true,
  isometric = false,
  className,
  style,
  ...props
}: Devices001Props) {
  const palette = {
    ...(accent ? { "--vibeui-devices-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(38deg) rotateZ(-28deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-devices-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="devices-001"
        data-slot="device-laptop"
        data-sheen={sheen ? "true" : "false"}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="screen">
              <span data-part="cam" aria-hidden="true" />
              <div data-part="display">
                <div data-part="bar">
                  <span data-part="bardot" />
                  <span data-part="bardot" />
                  <span data-part="bardot" />
                </div>
                <div data-part="body">
                  <div data-part="tile">{SPARK}</div>
                  <div data-part="lines">
                    <span data-part="line" />
                    <span data-part="line" />
                  </div>
                </div>
                <div data-part="chart">
                  <span data-part="bar-value" style={{ height: "45%" }} />
                  <span data-part="bar-value" style={{ height: "70%" }} />
                  <span data-part="bar-value" style={{ height: "100%" }} />
                  <span data-part="bar-value" style={{ height: "58%" }} />
                  <span data-part="bar-value" style={{ height: "82%" }} />
                </div>
                <span data-part="sheen" aria-hidden="true" />
              </div>
            </div>
            <div data-part="hinge" aria-hidden="true" />
            <div data-part="base" aria-hidden="true">
              <span data-part="trackpad" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
