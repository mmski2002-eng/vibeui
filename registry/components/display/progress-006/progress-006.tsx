import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Текущий расход в единицах плана, а не в процентах. */
  value?: number
  /** Порог, после которого включается предупреждение. */
  threshold?: number
  limit?: number
  label?: string
}

// Идея компонента: у полосы есть порог, и он нарисован прямо на дорожке
// засечкой. Пока расход ниже — полоса спокойная; выше — она меняет цвет,
// получает штриховку и роняет строку предупреждения в role="status".
// Штриховка нужна, потому что «стало красным» не читается без цвета.
const STYLES = `
:where([data-vibeui-block="progress-006"]){
--vibeui-progress-006-bg:oklch(1 0 0);
--vibeui-progress-006-fg:oklch(0.25 0.016 265);
--vibeui-progress-006-muted:oklch(0.56 0.014 265);
--vibeui-progress-006-border:oklch(0.9 0.006 265);
--vibeui-progress-006-track:oklch(0.93 0.005 265);
--vibeui-progress-006-accent:oklch(0.58 0.16 155);
--vibeui-progress-006-alarm:oklch(0.58 0.19 28);
--vibeui-progress-006-value:0;
--vibeui-progress-006-mark:0;
--vibeui-progress-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:1rem 1.125rem;
background:var(--vibeui-progress-006-bg);
border:1px solid var(--vibeui-progress-006-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-006-font);color:var(--vibeui-progress-006-fg);
}
[data-vibeui-block="progress-006"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="progress-006"] [data-part="amount"]{
font-weight:500;color:var(--vibeui-progress-006-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-006"] [data-part="track"]{
position:relative;height:0.625rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-progress-006-track);
}
[data-vibeui-block="progress-006"] [data-part="bar"]{
height:100%;border-radius:inherit;
width:calc(var(--vibeui-progress-006-value) * 1%);
background:var(--vibeui-progress-006-accent);
transition:width .3s cubic-bezier(.32,.72,0,1),background-color .2s ease;
}
/* Превышение читается и без цвета: заливка получает штриховку. */
[data-vibeui-block="progress-006"][data-over="true"] [data-part="bar"]{
background-color:var(--vibeui-progress-006-alarm);
background-image:repeating-linear-gradient(135deg,oklch(1 0 0 / 28%) 0 4px,transparent 4px 8px);
}
/* Порог — засечка на самой дорожке: подпись сбоку не показывает, где он. */
[data-vibeui-block="progress-006"] [data-part="mark"]{
position:absolute;top:0;bottom:0;
left:calc(var(--vibeui-progress-006-mark) * 1%);
width:2px;margin-left:-1px;background:var(--vibeui-progress-006-fg);
}
[data-vibeui-block="progress-006"] [data-part="scale"]{
display:flex;justify-content:space-between;gap:0.75rem;
font-size:0.6875rem;color:var(--vibeui-progress-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-006"] [data-part="alert"]{
display:flex;align-items:flex-start;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;
background:oklch(0.96 0.03 28);color:oklch(0.44 0.16 28);
font-size:0.75rem;line-height:1.35;
}
[data-vibeui-block="progress-006"] [data-part="alert"] strong{font-weight:700}
[data-vibeui-block="progress-006"] [data-part="sign"]{
flex:none;display:grid;place-items:center;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-progress-006-alarm);color:oklch(1 0 0);
font-size:0.6875rem;font-weight:800;line-height:1;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-006"] *{animation:none!important;transition:none!important}
}
`

/**
 * Полоса с порогом на дорожке и предупреждением на превышении.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress006({
  value = 118,
  threshold = 100,
  limit = 140,
  label = "Расход API-квоты",
  className,
  style,
  ...props
}: Progress006Props) {
  const scale = Math.max(1, limit)
  const used = Math.max(0, value)
  const percent = Math.min(100, (used / scale) * 100)
  const mark = Math.min(100, Math.max(0, (threshold / scale) * 100))
  const over = used > threshold
  const palette = {
    "--vibeui-progress-006-value": percent,
    "--vibeui-progress-006-mark": mark,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-006"
        data-over={over || undefined}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{label}</span>
          <span data-part="amount">
            {used} / {threshold} тыс. запросов
          </span>
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={scale}
          aria-valuenow={used}
          aria-valuetext={`${used} тысяч запросов при пороге ${threshold} тысяч`}
        >
          <div data-part="bar" />
          <span data-part="mark" aria-hidden="true" />
        </div>
        <div data-part="scale">
          <span>0</span>
          <span>порог {threshold}</span>
          <span>{scale}</span>
        </div>
        <p data-part="alert" role="status" hidden={!over}>
          <span data-part="sign" aria-hidden="true">
            !
          </span>
          <span>
            Порог превышен на{" "}
            <strong>{Math.max(0, used - threshold)} тыс.</strong> запросов.
            Дальнейшие вызовы тарифицируются сверх плана.
          </span>
        </p>
      </div>
    </>
  )
}
