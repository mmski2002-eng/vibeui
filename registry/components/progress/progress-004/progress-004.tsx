import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Progress004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  fileName?: string
  /** Передано и всего — в байтах: проценты и остаток считаются из них. */
  loaded?: number
  total?: number
  /** Байт в секунду: из неё берутся и скорость, и оставшееся время. */
  speed?: number
}

// Идея компонента: строка загрузки файла отвечает не «сколько процентов», а
// «сколько ещё ждать». Проценты, объём, скорость и остаток считаются из трёх
// чисел, поэтому подписи не могут разойтись между собой. Цифры моноширинные:
// при обычных они дёргаются на каждом обновлении.
const STYLES = `
:where([data-vibeui-block="progress-004"]){
--vibeui-progress-004-bg:oklch(1 0 0);
--vibeui-progress-004-fg:oklch(0.25 0.016 265);
--vibeui-progress-004-muted:oklch(0.56 0.014 265);
--vibeui-progress-004-border:oklch(0.9 0.006 265);
--vibeui-progress-004-track:oklch(0.93 0.005 265);
--vibeui-progress-004-accent:oklch(0.55 0.19 262);
--vibeui-progress-004-value:0;
--vibeui-progress-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="progress-004"]{
display:flex;gap:0.875rem;align-items:flex-start;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-progress-004-bg);
border:1px solid var(--vibeui-progress-004-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-004-font);color:var(--vibeui-progress-004-fg);
}
[data-vibeui-block="progress-004"] [data-part="icon"]{
flex:none;display:grid;place-items:center;
width:2.25rem;height:2.75rem;border-radius:0.375rem;
background:oklch(0.96 0.012 262);color:var(--vibeui-progress-004-accent);
font-size:0.5625rem;font-weight:800;letter-spacing:0.06em;
clip-path:polygon(0 0,72% 0,100% 26%,100% 100%,0 100%);
}
[data-vibeui-block="progress-004"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.375rem;flex:1 1 auto;min-width:0;
}
[data-vibeui-block="progress-004"] [data-part="name"]{
font-size:0.8125rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="progress-004"] [data-part="track"]{
height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-progress-004-track);
}
[data-vibeui-block="progress-004"] [data-part="bar"]{
height:100%;border-radius:inherit;
width:calc(var(--vibeui-progress-004-value) * 1%);
background:var(--vibeui-progress-004-accent);
transition:width .3s cubic-bezier(.32,.72,0,1);
}
/* Три показателя в одну строку: объём слева, скорость и остаток справа. */
[data-vibeui-block="progress-004"] [data-part="stats"]{
display:flex;justify-content:space-between;gap:0.75rem;
font-size:0.6875rem;color:var(--vibeui-progress-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-004"] [data-part="stats"] span{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-004"] *{animation:none!important;transition:none!important}
}
`

function formatBytes(bytes: number) {
  const units = ["Б", "КБ", "МБ", "ГБ"]
  let size = Math.max(0, bytes)
  let unit = 0

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }

  return `${size >= 100 || unit === 0 ? Math.round(size) : size.toFixed(1)} ${units[unit]}`
}

function formatLeft(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "почти готово"
  }

  if (seconds < 60) {
    return `осталось ${Math.ceil(seconds)} с`
  }

  return `осталось ${Math.ceil(seconds / 60)} мин`
}

/**
 * Загрузка файла со скоростью и оставшимся временем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress004({
  fileName = "quarterly-report-2026.pdf",
  loaded = 7_340_032,
  total = 12_582_912,
  speed = 1_048_576,
  className,
  style,
  ...props
}: Progress004Props) {
  const size = Math.max(1, total)
  const done = Math.min(size, Math.max(0, loaded))
  const percent = Math.round((done / size) * 100)
  const left = speed > 0 ? (size - done) / speed : Number.POSITIVE_INFINITY
  const extension =
    fileName.split(".").pop()?.slice(0, 4).toUpperCase() ?? "FILE"
  const palette = {
    "--vibeui-progress-004-value": percent,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="progress-004"
        className={className}
        style={palette}
      >
        <span data-part="icon" aria-hidden="true">
          {extension}
        </span>
        <div data-part="body">
          <span data-part="name" title={fileName}>
            {fileName}
          </span>
          <div
            data-part="track"
            role="progressbar"
            aria-label={`Загрузка ${fileName}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-valuetext={`${percent} процентов, ${formatLeft(left)}`}
          >
            <div data-part="bar" />
          </div>
          <div data-part="stats">
            <span>
              {formatBytes(done)} из {formatBytes(size)}
            </span>
            <span>
              {formatBytes(speed)}/с · {formatLeft(left)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
