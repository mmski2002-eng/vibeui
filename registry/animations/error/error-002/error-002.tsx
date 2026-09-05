import type { ComponentProps, CSSProperties } from "react"

export type Error002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  clientLabel?: string
  serviceLabel?: string
  okLabel?: string
  downLabel?: string
  accent?: string
  /** Секунд на полный цикл: запрос → удар → откат. */
  duration?: number
  paused?: boolean
}

// Идея: импульс запроса бежит по проводу (offset-path, как в api-002) от
// клиента к карточке сервиса. В момент удара карточка вздрагивает и её рамка
// краснеет, поверх неё проступает значок предупреждения, а три индикатора
// зависимостей под карточкой каскадно — с небольшим сдвигом друг за другом —
// перекрашиваются в красный. Пилюля статуса в шапке синхронно меняет
// подпись и цвет точки. Вся сцена держится на одной переменной длительности,
// поэтому фазы совпадают без единой строки JS, и бесконечно повторяется.
const STYLES = `
:where([data-vibeui-block="error-002"]){
--vibeui-error-002-duration:4.2s;
--vibeui-error-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-error-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-error-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-error-002-muted:color-mix(in oklab,var(--vibeui-error-002-fg) 60%,transparent);
--vibeui-error-002-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-error-002-accent:light-dark(oklch(0.58 0.17 255),oklch(0.72 0.15 255));
--vibeui-error-002-ok:light-dark(oklch(0.66 0.17 150),oklch(0.76 0.15 150));
--vibeui-error-002-down:light-dark(oklch(0.62 0.21 25),oklch(0.72 0.19 25));
--vibeui-error-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="error-002"]{color-scheme:dark}
[data-vibeui-block="error-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-error-002-fg);font-family:var(--vibeui-error-002-font);
}
[data-vibeui-block="error-002"] *{box-sizing:border-box}
[data-vibeui-block="error-002"] [data-part="card"]{
border-radius:1rem;border:1px solid var(--vibeui-error-002-border);
background:var(--vibeui-error-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="error-002"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.875rem;border-bottom:1px solid var(--vibeui-error-002-border);
}
[data-vibeui-block="error-002"] [data-part="title"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="error-002"] [data-part="badge"]{
position:relative;display:inline-flex;align-items:center;gap:0.3125rem;
font-size:0.625rem;font-weight:650;color:var(--vibeui-error-002-muted);
}
[data-vibeui-block="error-002"] [data-part="badgedot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;
animation:
  vibeui-error-002-dot var(--vibeui-error-002-duration) linear infinite,
  vibeui-error-002-blink 1.6s ease-in-out infinite;
}
[data-vibeui-block="error-002"] [data-part="badgelabels"]{display:grid}
[data-vibeui-block="error-002"] [data-part="badgelabel"]{
grid-area:1/1;white-space:nowrap;
}
[data-vibeui-block="error-002"] [data-part="badgelabel"][data-tone="ok"]{
animation:vibeui-error-002-ok-label var(--vibeui-error-002-duration) linear infinite;
}
[data-vibeui-block="error-002"] [data-part="badgelabel"][data-tone="down"]{
color:var(--vibeui-error-002-down);
animation:vibeui-error-002-down-label var(--vibeui-error-002-duration) linear infinite;
}
[data-vibeui-block="error-002"] [data-part="stage"]{padding:0.875rem 0.875rem 0.375rem}
[data-vibeui-block="error-002"] [data-part="track"]{
position:relative;display:flex;align-items:center;gap:0.5rem;height:2.5rem;
}
[data-vibeui-block="error-002"] [data-part="node-dot"]{
flex:none;width:0.5625rem;height:0.5625rem;border-radius:9999px;
background:var(--vibeui-error-002-fg);
box-shadow:0 0 0 4px color-mix(in oklab,var(--vibeui-error-002-fg) 10%,transparent);
}
[data-vibeui-block="error-002"] [data-part="wire"]{position:relative;flex:1;height:100%}
[data-vibeui-block="error-002"] [data-part="wire"] svg{
position:absolute;inset:0;width:100%;height:100%;overflow:visible;
}
[data-vibeui-block="error-002"] [data-part="wire"] path{
fill:none;stroke:var(--vibeui-error-002-border);stroke-width:1.5;stroke-dasharray:3 4;
}
[data-vibeui-block="error-002"] [data-part="pulse"]{
position:absolute;top:0;left:0;width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-error-002-accent);box-shadow:0 0 8px 1px var(--vibeui-error-002-accent);
offset-path:path("M4 10 L196 10");offset-rotate:0deg;opacity:0;
animation:vibeui-error-002-pulse var(--vibeui-error-002-duration) linear infinite;
}
[data-vibeui-block="error-002"] [data-part="target"]{
position:relative;flex:none;display:flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
border:1.5px solid var(--vibeui-error-002-border);
background:var(--vibeui-error-002-frame);
transform-origin:center;
animation:vibeui-error-002-impact var(--vibeui-error-002-duration) linear infinite;
}
[data-vibeui-block="error-002"] [data-part="targeticon"]{
width:1.125rem;height:1.125rem;color:var(--vibeui-error-002-down);
animation:vibeui-error-002-icon var(--vibeui-error-002-duration) linear infinite;
}
[data-vibeui-block="error-002"] [data-part="labels"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.125rem;padding:0 0.0625rem;
}
[data-vibeui-block="error-002"] [data-part="label"]{
font-size:0.625rem;font-weight:600;color:var(--vibeui-error-002-muted);
}
[data-vibeui-block="error-002"] [data-part="cascade"]{
display:flex;align-items:center;justify-content:center;gap:0.375rem;
padding:0.75rem 0;
}
[data-vibeui-block="error-002"] [data-part="pip"]{
width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-error-002-ok);
animation:vibeui-error-002-pip var(--vibeui-error-002-duration) linear infinite;
}
[data-vibeui-block="error-002"] [data-part="pip"]:nth-child(2){animation-delay:70ms}
[data-vibeui-block="error-002"] [data-part="pip"]:nth-child(3){animation-delay:140ms}
[data-vibeui-block="error-002"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-error-002-pulse{
0%,4%{offset-distance:0%;opacity:0}
8%{opacity:1}
44%{offset-distance:100%;opacity:1}
48%,100%{offset-distance:100%;opacity:0}
}
@keyframes vibeui-error-002-impact{
0%,42%{transform:translate(0,0) rotate(0deg);border-color:var(--vibeui-error-002-border)}
44%{transform:translate(-3px,1px) rotate(-3deg)}
46%{transform:translate(3px,-1px) rotate(3deg);border-color:var(--vibeui-error-002-down)}
48%{transform:translate(-2px,1px) rotate(-2deg)}
50%{transform:translate(2px,0) rotate(1deg)}
52%,90%{transform:translate(0,0) rotate(0deg);border-color:var(--vibeui-error-002-down)}
96%,100%{border-color:var(--vibeui-error-002-border)}
}
@keyframes vibeui-error-002-icon{
0%,44%{opacity:0;transform:scale(0.6)}
48%{opacity:1;transform:scale(1.15)}
52%,88%{opacity:1;transform:scale(1)}
94%,100%{opacity:0;transform:scale(0.8)}
}
@keyframes vibeui-error-002-pip{
0%,42%{background:var(--vibeui-error-002-ok);box-shadow:none}
46%{background:var(--vibeui-error-002-down);box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-error-002-down) 30%,transparent)}
90%{background:var(--vibeui-error-002-down);box-shadow:none}
96%,100%{background:var(--vibeui-error-002-ok)}
}
@keyframes vibeui-error-002-dot{
0%,42%{background:var(--vibeui-error-002-ok)}
46%,90%{background:var(--vibeui-error-002-down)}
96%,100%{background:var(--vibeui-error-002-ok)}
}
@keyframes vibeui-error-002-ok-label{0%,42%{opacity:1}46%,90%{opacity:0}96%,100%{opacity:1}}
@keyframes vibeui-error-002-down-label{0%,42%{opacity:0}46%,90%{opacity:1}96%,100%{opacity:0}}
@keyframes vibeui-error-002-blink{0%,100%{opacity:.55}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="error-002"] [data-part="pulse"]{animation:none;opacity:0}
[data-vibeui-block="error-002"] [data-part="target"]{animation:none}
[data-vibeui-block="error-002"] [data-part="targeticon"]{animation:none;opacity:0}
[data-vibeui-block="error-002"] [data-part="pip"]{animation:none}
[data-vibeui-block="error-002"] [data-part="badgedot"]{animation:none}
[data-vibeui-block="error-002"] [data-part="badgelabel"][data-tone="ok"]{animation:none;opacity:1}
[data-vibeui-block="error-002"] [data-part="badgelabel"][data-tone="down"]{animation:none;opacity:0}
}
`

const WARNING = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </svg>
)

/**
 * Импульс запроса летит по проводу в карточку сервиса, при ударе карточка
 * вздрагивает, краснеет и над ней проступает предупреждение, а индикаторы
 * зависимостей каскадно уходят в красный. Один файл, ноль зависимостей,
 * собственная палитра, вся анимация на CSS.
 */
export function Error002({
  title = "Платёжный сервис",
  clientLabel = "Клиент",
  serviceLabel = "Сервис",
  okLabel = "Работает",
  downLabel = "Сбой",
  accent,
  duration = 4.2,
  paused = false,
  className,
  style,
  ...props
}: Error002Props) {
  const palette = {
    ...(accent ? { "--vibeui-error-002-accent": accent } : null),
    "--vibeui-error-002-duration": `${duration}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-error-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="error-002"
        data-slot="service-break"
        data-paused={paused ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <div data-part="head">
            <p data-part="title">{title}</p>
            <span data-part="badge">
              <span data-part="badgedot" aria-hidden="true" />
              <span data-part="badgelabels">
                <span data-part="badgelabel" data-tone="ok">
                  {okLabel}
                </span>
                <span data-part="badgelabel" data-tone="down">
                  {downLabel}
                </span>
              </span>
            </span>
          </div>
          <div data-part="stage" role="img" aria-label={title}>
            <div data-part="track" aria-hidden="true">
              <span data-part="node-dot" />
              <span data-part="wire">
                <svg viewBox="0 0 200 20" preserveAspectRatio="none">
                  <path d="M4 10 L196 10" />
                </svg>
                <span data-part="pulse" />
              </span>
              <span data-part="target">
                <span data-part="targeticon">{WARNING}</span>
              </span>
            </div>
            <div data-part="labels" aria-hidden="true">
              <span data-part="label">{clientLabel}</span>
              <span data-part="label">{serviceLabel}</span>
            </div>
            <div data-part="cascade" aria-hidden="true">
              <span data-part="pip" />
              <span data-part="pip" />
              <span data-part="pip" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
