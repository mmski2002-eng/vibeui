import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  steps?: string[]
  /** Индекс текущего этапа: всё до него считается пройденным. */
  current?: number
  label?: string
  accent?: string
}

// Идея компонента: прогресс конвейера показан не долей, а этапами. Дорожка
// разрезана на отдельные сегменты с зазорами, поэтому видно не «примерно
// шестьдесят процентов», а «три этапа из пяти закрыты, идёт четвёртый».
const STYLES = `
:where([data-vibeui-block="progress-002"]){
--vibeui-progress-002-bg:oklch(1 0 0);
--vibeui-progress-002-fg:oklch(0.26 0.016 265);
--vibeui-progress-002-muted:oklch(0.56 0.014 265);
--vibeui-progress-002-border:oklch(0.9 0.006 265);
--vibeui-progress-002-track:oklch(0.93 0.005 265);
--vibeui-progress-002-accent:oklch(0.55 0.19 262);
--vibeui-progress-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-002"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-progress-002-bg);
border:1px solid var(--vibeui-progress-002-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-002-font);color:var(--vibeui-progress-002-fg);
}
[data-vibeui-block="progress-002"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="progress-002"] [data-part="count"]{
font-weight:500;color:var(--vibeui-progress-002-muted);font-variant-numeric:tabular-nums;
}
/* Сегменты вместо сплошной полосы: зазор делает границу этапа видимой. */
[data-vibeui-block="progress-002"] [data-part="track"]{
display:flex;gap:0.25rem;
}
[data-vibeui-block="progress-002"] [data-part="segment"]{
flex:1 1 0;height:0.375rem;border-radius:9999px;
background:var(--vibeui-progress-002-track);
}
[data-vibeui-block="progress-002"] [data-part="segment"][data-state="done"]{
background:var(--vibeui-progress-002-accent);
}
[data-vibeui-block="progress-002"] [data-part="segment"][data-state="current"]{
background:linear-gradient(90deg,var(--vibeui-progress-002-accent) 50%,var(--vibeui-progress-002-track) 50%) 0 0 / 200% 100%;
animation:vibeui-progress-002-fill 1.6s ease-in-out infinite;
}
@keyframes vibeui-progress-002-fill{
0%{background-position:100% 0}
100%{background-position:0 0}
}
[data-vibeui-block="progress-002"] ol{
display:flex;gap:0.25rem;margin:0;padding:0;list-style:none;
font-size:0.6875rem;color:var(--vibeui-progress-002-muted);
}
[data-vibeui-block="progress-002"] li{
flex:1 1 0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="progress-002"] li[data-state="current"]{
color:var(--vibeui-progress-002-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="progress-002"] [data-part="segment"][data-state="current"]{background:var(--vibeui-progress-002-accent);opacity:.55}
}
`

const DEFAULT_STEPS = ["Очередь", "Сборка", "Тесты", "Ревью", "Выкладка"]

/**
 * Прогресс конвейера по этапам: дорожка разрезана на сегменты.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress002({
  steps = DEFAULT_STEPS,
  current = 2,
  label = "Пайплайн релиза",
  accent,
  className,
  style,
  ...props
}: Progress002Props) {
  const total = steps.length
  const index = Math.min(Math.max(0, current), total - 1)
  const palette = {
    ...(accent ? { "--vibeui-progress-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-002"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{label}</span>
          <span data-part="count">
            {index} / {total}
          </span>
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index}
          aria-valuetext={`${steps[index]}: этап ${index + 1} из ${total}`}
        >
          {steps.map((step, position) => (
            <span
              key={step}
              data-part="segment"
              data-state={
                position < index
                  ? "done"
                  : position === index
                    ? "current"
                    : "todo"
              }
            />
          ))}
        </div>
        <ol>
          {steps.map((step, position) => (
            <li key={step} data-state={position === index ? "current" : "todo"}>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
