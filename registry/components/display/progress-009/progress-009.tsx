import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  value?: number
  label?: string
  caption?: string
}

// Идея компонента: число стоит не в углу, а над концом заливки — глазу не
// нужно связывать далеко разнесённые подпись и полосу. Пузырёк едет по
// дорожке на left и прижимается clamp'ом к краям, поэтому у нуля и у ста
// процентов он не вылезает за границу карточки.
const STYLES = `
:where([data-vibeui-block="progress-009"]){
--vibeui-progress-009-bg:oklch(1 0 0);
--vibeui-progress-009-fg:oklch(0.24 0.016 265);
--vibeui-progress-009-muted:oklch(0.56 0.014 265);
--vibeui-progress-009-border:oklch(0.9 0.006 265);
--vibeui-progress-009-track:oklch(0.93 0.005 265);
--vibeui-progress-009-accent:oklch(0.52 0.2 292);
--vibeui-progress-009-value:0;
--vibeui-progress-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-009"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1rem 1.125rem 1.125rem;
background:var(--vibeui-progress-009-bg);
border:1px solid var(--vibeui-progress-009-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-009-font);color:var(--vibeui-progress-009-fg);
}
[data-vibeui-block="progress-009"] [data-part="label"]{
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="progress-009"] [data-part="rail"]{
position:relative;padding-top:1.75rem;
}
/* Пузырёк едет вместе с заливкой, clamp держит его внутри дорожки. */
[data-vibeui-block="progress-009"] [data-part="bubble"]{
position:absolute;top:0;
left:clamp(1.5rem,calc(var(--vibeui-progress-009-value) * 1%),calc(100% - 1.5rem));
transform:translateX(-50%);
padding:0.1875rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-progress-009-accent);color:oklch(1 0 0);
font-size:0.75rem;font-weight:700;line-height:1.2;
font-variant-numeric:tabular-nums;white-space:nowrap;
transition:left .3s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="progress-009"] [data-part="bubble"]::after{
content:"";position:absolute;left:50%;top:100%;
width:0;height:0;margin-left:-0.25rem;
border:0.25rem solid transparent;
border-top-color:var(--vibeui-progress-009-accent);
}
[data-vibeui-block="progress-009"] [data-part="track"]{
height:0.5rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-progress-009-track);
}
[data-vibeui-block="progress-009"] [data-part="bar"]{
height:100%;border-radius:inherit;
width:calc(var(--vibeui-progress-009-value) * 1%);
background:linear-gradient(90deg,color-mix(in oklch,var(--vibeui-progress-009-accent) 60%,oklch(1 0 0)),var(--vibeui-progress-009-accent));
transition:width .3s cubic-bezier(.32,.72,0,1);
}
[data-vibeui-block="progress-009"] [data-part="caption"]{
margin:0;font-size:0.75rem;color:var(--vibeui-progress-009-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-009"] *{animation:none!important;transition:none!important}
}
`

/**
 * Полоса, у которой число едет над концом заливки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress009({
  value = 68,
  label = "Профиль заполнен",
  caption = "Осталось добавить телефон и фотографию",
  className,
  style,
  ...props
}: Progress009Props) {
  const percent = Math.min(100, Math.max(0, value))
  const palette = {
    "--vibeui-progress-009-value": percent,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-009"
        className={className}
        style={palette}
      >
        <span data-part="label">{label}</span>
        <div data-part="rail">
          <span data-part="bubble" aria-hidden="true">
            {Math.round(percent)}%
          </span>
          <div
            data-part="track"
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
          >
            <div data-part="bar" />
          </div>
        </div>
        <p data-part="caption">{caption}</p>
      </div>
    </>
  )
}
