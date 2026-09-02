import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  value?: number
  /** Отметка цели на шкале: до неё план, после — перевыполнение. */
  target?: number
  label?: string
  unit?: string
  /** Подпись цели под кольцом: {target} — процент плана. */
  goalText?: string
  /** Озвучка кольца: {value} — факт, {target} — план. */
  valueText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: кольцевая шкала с делениями и меткой цели. Дуга и риски
// нарисованы двумя conic-gradient в одном элементе, метка цели — засечка,
// повёрнутая на нужный угол. Поэтому кольцо остаётся одним div без svg, а
// «сколько сделано» и «сколько было обещано» видно одновременно.
const STYLES = `
:where([data-vibeui-block="progress-003"]){
--vibeui-progress-003-size:8rem;
--vibeui-progress-003-thickness:0.75rem;
--vibeui-progress-003-value:0;
--vibeui-progress-003-target:0;
--vibeui-progress-003-bg:transparent;
--vibeui-progress-003-surface:light-dark(oklch(0.99 0.002 265),oklch(0.2 0.012 265));
--vibeui-progress-003-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-progress-003-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-progress-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-progress-003-track:light-dark(oklch(0.93 0.006 265),oklch(0.31 0.012 265));
--vibeui-progress-003-accent:light-dark(oklch(0.58 0.16 155),oklch(0.74 0.15 155));
--vibeui-progress-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-003"]{
display:inline-flex;flex-direction:column;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:1.125rem 1.25rem;
background:var(--vibeui-progress-003-bg);
border:1px solid var(--vibeui-progress-003-border);border-radius:1.125rem;
font-family:var(--vibeui-progress-003-font);color:var(--vibeui-progress-003-fg);
text-align:center;
}
[data-vibeui-block="progress-003"] [data-part="dial"]{
position:relative;display:grid;place-items:center;
width:var(--vibeui-progress-003-size);height:var(--vibeui-progress-003-size);
}
/* Дуга: conic-gradient, вырезанный радиальной маской — кольцо без svg. */
[data-vibeui-block="progress-003"] [data-part="arc"]{
position:absolute;inset:0;border-radius:9999px;
background:conic-gradient(
var(--vibeui-progress-003-accent) calc(var(--vibeui-progress-003-value) * 1%),
var(--vibeui-progress-003-track) 0);
mask:radial-gradient(farthest-side,transparent calc(100% - var(--vibeui-progress-003-thickness)),#000 calc(100% - var(--vibeui-progress-003-thickness)));
transition:background .35s ease;
}
/* Риски: второй conic-gradient поверх дуги, повторяющийся каждые 30 градусов.
   Цвет рисок — цвет подложки, поэтому они читаются как прорези в кольце. */
[data-vibeui-block="progress-003"] [data-part="ticks"]{
position:absolute;inset:0;border-radius:9999px;pointer-events:none;
background:repeating-conic-gradient(var(--vibeui-progress-003-surface) 0deg 1.4deg,transparent 1.4deg 30deg);
mask:radial-gradient(farthest-side,transparent calc(100% - var(--vibeui-progress-003-thickness)),#000 calc(100% - var(--vibeui-progress-003-thickness)));
}
/* Метка цели: засечка, повёрнутая на долю круга — видно план поверх факта. */
[data-vibeui-block="progress-003"] [data-part="goal"]{
position:absolute;inset:0;pointer-events:none;
transform:rotate(calc(var(--vibeui-progress-003-target) * 3.6deg));
}
[data-vibeui-block="progress-003"] [data-part="goal"]::before{
content:"";position:absolute;left:50%;top:-2px;
width:2px;height:calc(var(--vibeui-progress-003-thickness) + 4px);
margin-left:-1px;border-radius:1px;
background:var(--vibeui-progress-003-fg);
}
[data-vibeui-block="progress-003"] [data-part="value"]{
position:relative;font-size:calc(var(--vibeui-progress-003-size) * 0.22);
font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-003"] [data-part="unit"]{
font-size:0.6875rem;font-weight:600;color:var(--vibeui-progress-003-muted);
letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="progress-003"] [data-part="label"]{
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="progress-003"] [data-part="goalnote"]{
font-size:0.6875rem;color:var(--vibeui-progress-003-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-003"] *{animation:none!important;transition:none!important}
}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Кольцевая шкала с делениями и меткой цели.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress003({
  value = 72,
  target = 85,
  label = "План квартала",
  unit = "выполнено",
  goalText = "Цель {target}%",
  valueText = "{value} процентов при цели {target}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Progress003Props) {
  const done = Math.min(100, Math.max(0, value))
  const goal = Math.min(100, Math.max(0, target))
  // Риски прорезаны цветом подложки, поэтому заданный фон достаётся и им.
  const palette = {
    "--vibeui-progress-003-value": done,
    "--vibeui-progress-003-target": goal,
    ...(accent ? { "--vibeui-progress-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-progress-003-bg": background,
          "--vibeui-progress-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const fill = (template: string) =>
    template
      .replace("{value}", String(Math.round(done)))
      .replace("{target}", String(Math.round(goal)))

  return (
    <>
      <style href="vibeui-progress-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-003"
        className={className}
        style={palette}
      >
        <div
          data-part="dial"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(done)}
          aria-valuetext={fill(valueText)}
        >
          <span data-part="arc" />
          <span data-part="ticks" aria-hidden="true" />
          <span data-part="goal" aria-hidden="true" />
          <span data-part="value">{Math.round(done)}%</span>
        </div>
        <span data-part="unit">{unit}</span>
        <span data-part="label">{label}</span>
        <span data-part="goalnote">{fill(goalText)}</span>
      </div>
    </>
  )
}
