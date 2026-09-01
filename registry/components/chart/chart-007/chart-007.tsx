import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Chart007Props = Omit<
  ComponentPropsWithoutRef<"figure">,
  "children" | "title"
> & {
  title?: string
  value?: number
  max?: number
  unit?: string
  target?: number
  accent?: string
}

// Идея компонента: полукруглая шкала для одного показателя. Полукруг честнее
// кольца там, где значение имеет предел: пустая часть дуги показывает, сколько
// осталось. Цель отмечена риской — без неё «74%» не отвечает, хорошо это или
// плохо, а сравнивать надо именно с планом.
const STYLES = `
:where([data-vibeui-block="chart-007"]){
--vibeui-chart-007-bg:oklch(1 0 0);
--vibeui-chart-007-fg:oklch(0.22 0.014 265);
--vibeui-chart-007-muted:oklch(0.56 0.014 265);
--vibeui-chart-007-border:oklch(0.91 0.006 265);
--vibeui-chart-007-track:oklch(0.93 0.005 265);
--vibeui-chart-007-accent:oklch(0.55 0.17 265);
--vibeui-chart-007-mark:oklch(0.45 0.02 265);
--vibeui-chart-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="chart-007"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:16rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-chart-007-bg);
border:1px solid var(--vibeui-chart-007-border);border-radius:0.875rem;
color:var(--vibeui-chart-007-fg);font-family:var(--vibeui-chart-007-font);
}
[data-vibeui-block="chart-007"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;align-self:flex-start}
[data-vibeui-block="chart-007"] svg{display:block;width:100%;height:auto}
[data-vibeui-block="chart-007"] [data-part="track"]{
fill:none;stroke:var(--vibeui-chart-007-track);stroke-width:14;stroke-linecap:round;
}
[data-vibeui-block="chart-007"] [data-part="value"]{
fill:none;stroke:var(--vibeui-chart-007-accent);stroke-width:14;stroke-linecap:round;
}
/* Риска цели: без неё процент не отвечает, хорошо это или плохо. */
[data-vibeui-block="chart-007"] [data-part="target"]{stroke:var(--vibeui-chart-007-mark);stroke-width:2}
[data-vibeui-block="chart-007"] [data-part="number"]{
margin-top:-2.25rem;font-size:1.5rem;font-weight:700;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="chart-007"] [data-part="unit"]{font-size:0.75rem;color:var(--vibeui-chart-007-muted)}
[data-vibeui-block="chart-007"] [data-part="legend"]{
display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-chart-007-muted);
}
[data-vibeui-block="chart-007"] [data-part="tick"]{width:0.125rem;height:0.625rem;background:var(--vibeui-chart-007-mark)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="chart-007"] *{animation:none!important;transition:none!important}}
`

// Полукруг радиусом 70 в системе 160×90: длина дуги нужна для штриховки.
const RADIUS = 70
const ARC = Math.PI * RADIUS

function pointAt(share: number) {
  const angle = Math.PI * (1 - share)
  return {
    x: 80 + Math.cos(angle) * RADIUS,
    y: 80 - Math.sin(angle) * RADIUS,
  }
}

/**
 * Полукруглая шкала показателя с риской цели.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Chart007({
  title = "План продаж",
  value = 74,
  max = 100,
  unit = "процентов от плана",
  target = 85,
  accent,
  className,
  style,
  ...props
}: Chart007Props) {
  const share = Math.max(0, Math.min(1, value / (max || 1)))
  const targetShare = Math.max(0, Math.min(1, target / (max || 1)))
  const inner = pointAt(targetShare)
  const outer = {
    x: 80 + Math.cos(Math.PI * (1 - targetShare)) * (RADIUS + 9),
    y: 80 - Math.sin(Math.PI * (1 - targetShare)) * (RADIUS + 9),
  }

  const palette = {
    ...(accent ? { "--vibeui-chart-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-chart-007" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="chart-007"
        className={className}
        style={palette}
      >
        <figcaption data-part="title">{title}</figcaption>
        <svg
          viewBox="0 0 160 92"
          role="img"
          aria-label={`${title}: ${value} из ${max}, цель ${target}`}
        >
          <path data-part="track" d="M10 80 A70 70 0 0 1 150 80" />
          <path
            data-part="value"
            d="M10 80 A70 70 0 0 1 150 80"
            strokeDasharray={`${ARC * share} ${ARC}`}
          />
          <line
            data-part="target"
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
          />
        </svg>
        <span data-part="number">{value}%</span>
        <span data-part="unit">{unit}</span>
        <span data-part="legend">
          <span data-part="tick" aria-hidden="true" />
          Цель: {target}%
        </span>
      </figure>
    </>
  )
}
