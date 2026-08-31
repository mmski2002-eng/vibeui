import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  steps?: string[]
  current?: number
  title?: string
}

// Идея компонента: главный ответ здесь — словами, а не долей. Крупная строка
// называет текущий шаг и следующий за ним, а вехи на непрерывной дорожке
// служат только картой пути. Дорожка одна, заливка идёт до текущей вехи:
// расстояние между вехами показывает, сколько ещё впереди.
const STYLES = `
:where([data-vibeui-block="progress-008"]){
--vibeui-progress-008-bg:oklch(1 0 0);
--vibeui-progress-008-fg:oklch(0.24 0.016 265);
--vibeui-progress-008-muted:oklch(0.56 0.014 265);
--vibeui-progress-008-border:oklch(0.9 0.006 265);
--vibeui-progress-008-track:oklch(0.92 0.006 265);
--vibeui-progress-008-accent:oklch(0.55 0.19 262);
--vibeui-progress-008-value:0;
--vibeui-progress-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-008"]{
display:flex;flex-direction:column;gap:0.875rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:1.125rem 1.25rem;
background:var(--vibeui-progress-008-bg);
border:1px solid var(--vibeui-progress-008-border);border-radius:1rem;
font-family:var(--vibeui-progress-008-font);color:var(--vibeui-progress-008-fg);
}
[data-vibeui-block="progress-008"] [data-part="eyebrow"]{
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-progress-008-muted);font-variant-numeric:tabular-nums;
}
/* Текущий шаг словами: это главный ответ, поэтому он крупнее всего блока. */
[data-vibeui-block="progress-008"] [data-part="now"]{
margin:0;font-size:1.0625rem;font-weight:700;line-height:1.2;letter-spacing:-0.01em;
}
[data-vibeui-block="progress-008"] [data-part="next"]{
margin:0;font-size:0.75rem;color:var(--vibeui-progress-008-muted);
}
/* Одна дорожка с вехами: расстояние между точками показывает остаток пути. */
[data-vibeui-block="progress-008"] [data-part="track"]{
position:relative;display:flex;align-items:center;justify-content:space-between;
height:0.875rem;
}
[data-vibeui-block="progress-008"] [data-part="track"]::before,
[data-vibeui-block="progress-008"] [data-part="track"]::after{
content:"";position:absolute;left:0;top:50%;
height:0.25rem;margin-top:-0.125rem;border-radius:9999px;
}
[data-vibeui-block="progress-008"] [data-part="track"]::before{
right:0;background:var(--vibeui-progress-008-track);
}
[data-vibeui-block="progress-008"] [data-part="track"]::after{
width:calc(var(--vibeui-progress-008-value) * 1%);
background:var(--vibeui-progress-008-accent);
transition:width .35s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="progress-008"] [data-part="pin"]{
position:relative;z-index:1;
width:0.875rem;height:0.875rem;border-radius:9999px;
box-sizing:border-box;border:0.1875rem solid var(--vibeui-progress-008-bg);
background:var(--vibeui-progress-008-track);
}
[data-vibeui-block="progress-008"] [data-part="pin"][data-state="done"]{background:var(--vibeui-progress-008-accent)}
[data-vibeui-block="progress-008"] [data-part="pin"][data-state="current"]{
background:var(--vibeui-progress-008-accent);
outline:2px solid color-mix(in oklch,var(--vibeui-progress-008-accent) 40%,transparent);
outline-offset:1px;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-008"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_STEPS = [
  "Загрузка файла",
  "Разбор колонок",
  "Проверка данных",
  "Сопоставление полей",
  "Импорт",
]

/**
 * Прогресс, где текущий шаг назван словами, а вехи — карта пути.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress008({
  steps = DEFAULT_STEPS,
  current = 2,
  title = "Импорт справочника",
  className,
  style,
  ...props
}: Progress008Props) {
  const total = steps.length
  const index = Math.min(Math.max(0, current), total - 1)
  const percent = total > 1 ? (index / (total - 1)) * 100 : 100
  const next = steps[index + 1]
  const palette = {
    "--vibeui-progress-008-value": percent,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-008"
        className={className}
        style={palette}
      >
        <span data-part="eyebrow">
          {title} · шаг {index + 1} из {total}
        </span>
        <p data-part="now">{steps[index]}</p>
        <div
          data-part="track"
          role="progressbar"
          aria-label={title}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-valuetext={`Шаг ${index + 1} из ${total}: ${steps[index]}`}
        >
          {steps.map((step, position) => (
            <span
              key={step}
              data-part="pin"
              data-state={
                position < index
                  ? "done"
                  : position === index
                    ? "current"
                    : "todo"
              }
              title={step}
            />
          ))}
        </div>
        <p data-part="next">{next ? `Дальше: ${next}` : "Это последний шаг"}</p>
      </div>
    </>
  )
}
