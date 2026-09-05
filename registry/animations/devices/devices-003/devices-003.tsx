import type { ComponentProps, CSSProperties } from "react"

export type Devices003Props = Omit<ComponentProps<"section">, "children"> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  /** Размытые пятна за планшетом дрейфуют с разной скоростью. */
  parallax?: boolean
  /** Изометрический наклон рамки. */
  isometric?: boolean
}

// Идея: рамка планшета в альбомной ориентации с приложением внутри — узкая
// боковая панель иконок и главная область с карточками. За рамкой на разной
// скорости дрейфуют два размытых пятна (параллакс), а карточки внутри чуть
// покачиваются со сдвигом по фазе — вместе это читается как лёгкое,
// многослойное движение сцены; это и есть анимация категории. Рамку можно
// наклонить в изометрию через проп isometric.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="devices-003"]){
--vibeui-devices-003-bg:light-dark(oklch(0.99 0.002 310),oklch(0.99 0.002 310));
--vibeui-devices-003-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-devices-003-muted:color-mix(in oklab,var(--vibeui-devices-003-fg) 58%,transparent);
--vibeui-devices-003-border:light-dark(oklch(0.9 0.006 310),oklch(0.3 0.012 310));
--vibeui-devices-003-shell:light-dark(oklch(0.85 0.006 310),oklch(0.4 0.012 310));
--vibeui-devices-003-panel:light-dark(oklch(0.965 0.006 310),oklch(0.2 0.012 310));
--vibeui-devices-003-accent:light-dark(oklch(0.58 0.18 320),oklch(0.75 0.15 320));
--vibeui-devices-003-accent-fg:oklch(from var(--vibeui-devices-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-devices-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="devices-003"]{color-scheme:dark}
[data-vibeui-block="devices-003"]{
display:block;box-sizing:border-box;width:100%;max-width:22rem;margin:0;
color:var(--vibeui-devices-003-fg);font-family:var(--vibeui-devices-003-font);
}
[data-vibeui-block="devices-003"] *{box-sizing:border-box}
[data-vibeui-block="devices-003"] [data-part="stage"]{
position:relative;isolation:isolate;padding:1.25rem 1rem;perspective:1600px;
}
[data-vibeui-block="devices-003"] [data-part="blob"]{
position:absolute;z-index:0;border-radius:9999px;filter:blur(15px);opacity:0.5;
background:radial-gradient(circle,var(--vibeui-devices-003-accent),transparent 70%);
animation:vibeui-devices-003-drift 9s ease-in-out infinite;
}
[data-vibeui-block="devices-003"] [data-part="blob"][data-layer="back"]{
top:-1rem;left:-1rem;width:8rem;height:8rem;animation-duration:12s;
}
[data-vibeui-block="devices-003"] [data-part="blob"][data-layer="front"]{
bottom:-1.5rem;right:-0.5rem;width:6rem;height:6rem;opacity:0.4;
animation-duration:7s;animation-direction:reverse;
background:radial-gradient(circle,color-mix(in oklab,var(--vibeui-devices-003-accent) 70%,white 10%),transparent 70%);
}
[data-vibeui-block="devices-003"][data-parallax="false"] [data-part="blob"]{animation:none}
[data-vibeui-block="devices-003"] [data-part="frame"]{
position:relative;z-index:1;transition:transform .3s ease;transform-origin:center;
}
/* Корпус планшета: тёмная рамка вокруг светлого экрана, альбомная ориентация. */
[data-vibeui-block="devices-003"] [data-part="tablet"]{
position:relative;overflow:hidden;border-radius:1.125rem;padding:0.5625rem;
background:var(--vibeui-devices-003-shell);
box-shadow:0 1.5rem 2.5rem -1.5rem oklch(0 0 0 / 0.35);
}
[data-vibeui-block="devices-003"] [data-part="cam"]{
position:absolute;top:50%;left:0.25rem;width:0.1875rem;height:0.1875rem;
border-radius:9999px;background:color-mix(in oklab,var(--vibeui-devices-003-fg) 35%,transparent);
transform:translateY(-50%);
}
[data-vibeui-block="devices-003"] [data-part="screen"]{
display:flex;overflow:hidden;border-radius:0.625rem;
aspect-ratio:4/3;background:var(--vibeui-devices-003-bg);
}
[data-vibeui-block="devices-003"] [data-part="sidebar"]{
display:flex;flex-direction:column;align-items:center;gap:0.4375rem;flex:none;
width:2rem;padding:0.5625rem 0;border-right:1px solid var(--vibeui-devices-003-border);
}
[data-vibeui-block="devices-003"] [data-part="side-item"]{
width:1.125rem;height:1.125rem;border-radius:0.375rem;
background:color-mix(in oklab,var(--vibeui-devices-003-fg) 10%,transparent);
}
[data-vibeui-block="devices-003"] [data-part="side-item"][data-active="true"]{
background:var(--vibeui-devices-003-accent);
}
[data-vibeui-block="devices-003"] [data-part="main"]{
flex:1;min-width:0;padding:0.625rem;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="devices-003"] [data-part="top"]{
display:flex;align-items:center;justify-content:space-between;
}
[data-vibeui-block="devices-003"] [data-part="heading"]{
margin:0;font-size:0.625rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="devices-003"] [data-part="badge"]{
font-size:0.4375rem;font-weight:650;padding:0.125rem 0.375rem;border-radius:9999px;
color:var(--vibeui-devices-003-accent);
background:color-mix(in oklab,var(--vibeui-devices-003-accent) 14%,transparent);
}
[data-vibeui-block="devices-003"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;flex:1;
}
/* Карточки покачиваются со сдвигом по фазе — вместе со сдвигом пятен это и
   читается как параллакс переднего/заднего плана. */
[data-vibeui-block="devices-003"] [data-part="card"]{
border-radius:0.5rem;padding:0.375rem;
background:var(--vibeui-devices-003-panel);
border:1px solid var(--vibeui-devices-003-border);
display:flex;flex-direction:column;gap:0.3125rem;
animation:vibeui-devices-003-float 4.5s ease-in-out infinite;
}
[data-vibeui-block="devices-003"] [data-part="card"]:nth-child(2){animation-delay:-1.1s}
[data-vibeui-block="devices-003"] [data-part="card"]:nth-child(3){animation-delay:-2.3s}
[data-vibeui-block="devices-003"][data-parallax="false"] [data-part="card"]{animation:none}
[data-vibeui-block="devices-003"] [data-part="icon"]{
width:0.9375rem;height:0.9375rem;border-radius:0.3125rem;
background:var(--vibeui-devices-003-accent);color:var(--vibeui-devices-003-accent-fg);
display:flex;align-items:center;justify-content:center;
}
[data-vibeui-block="devices-003"] [data-part="icon"] svg{width:0.5625rem;height:0.5625rem}
[data-vibeui-block="devices-003"] [data-part="card-line"]{
height:0.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-devices-003-fg) 14%,transparent);
}
[data-vibeui-block="devices-003"] [data-part="card-line"]:last-child{width:65%}
@keyframes vibeui-devices-003-drift{
0%,100%{transform:translate(0,0) scale(1)}
50%{transform:translate(0.5rem,-0.375rem) scale(1.08)}
}
@keyframes vibeui-devices-003-float{
0%,100%{transform:translateY(0)}
50%{transform:translateY(-0.1875rem)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="devices-003"] [data-part="blob"]{animation:none}
[data-vibeui-block="devices-003"] [data-part="card"]{animation:none}
}
`

const ICON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12h16M12 4v16" />
  </svg>
)

/**
 * Рамка планшета с приложением внутри и лёгким параллаксом фоновых пятен и
 * карточек. Один файл, ноль зависимостей, собственная палитра.
 */
export function Devices003({
  label = "Планшет с приложением на экране",
  accent,
  parallax = true,
  isometric = false,
  className,
  style,
  ...props
}: Devices003Props) {
  const palette = {
    ...(accent ? { "--vibeui-devices-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(40deg) rotateZ(-26deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-devices-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="devices-003"
        data-slot="device-tablet"
        data-parallax={parallax ? "true" : "false"}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <span data-part="blob" data-layer="back" aria-hidden="true" />
          <span data-part="blob" data-layer="front" aria-hidden="true" />
          <div data-part="frame" style={frameStyle}>
            <div data-part="tablet">
              <span data-part="cam" aria-hidden="true" />
              <div data-part="screen">
                <div data-part="sidebar" aria-hidden="true">
                  <span data-part="side-item" data-active="true" />
                  <span data-part="side-item" />
                  <span data-part="side-item" />
                  <span data-part="side-item" />
                </div>
                <div data-part="main">
                  <div data-part="top">
                    <p data-part="heading">Обзор</p>
                    <span data-part="badge">Live</span>
                  </div>
                  <div data-part="grid">
                    <div data-part="card">
                      <span data-part="icon">{ICON}</span>
                      <span data-part="card-line" />
                      <span data-part="card-line" />
                    </div>
                    <div data-part="card">
                      <span data-part="icon">{ICON}</span>
                      <span data-part="card-line" />
                      <span data-part="card-line" />
                    </div>
                    <div data-part="card">
                      <span data-part="icon">{ICON}</span>
                      <span data-part="card-line" />
                      <span data-part="card-line" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
