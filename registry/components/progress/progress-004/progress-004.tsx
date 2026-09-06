import type { ComponentProps, CSSProperties } from "react"

export type Progress004Props = Omit<ComponentProps<"div">, "children"> & {
  fileName?: string
  /** Передано и всего — в байтах: проценты и остаток считаются из них. */
  loaded?: number
  total?: number
  /** Байт в секунду: из неё берутся и скорость, и оставшееся время. */
  speed?: number
  /** Приставки объёма от байт к гигабайтам. */
  units?: string[]
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка загрузки файла отвечает не «сколько процентов», а
// «сколько ещё ждать». Проценты, объём, скорость и остаток считаются из трёх
// чисел, поэтому подписи не могут разойтись между собой. Цифры моноширинные:
// при обычных они дёргаются на каждом обновлении.
const STYLES = `
:where([data-vibeui-block="progress-004"]){
--vibeui-progress-004-bg:transparent;
--vibeui-progress-004-fg:light-dark(oklch(0.25 0 265),oklch(0.94 0 265));
--vibeui-progress-004-muted:color-mix(in oklab,var(--vibeui-progress-004-fg) 68%,transparent);
--vibeui-progress-004-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-progress-004-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
/* Светлая ветка притемнена до 0.535: этим же цветом набрано «PDF» на бледной
   плитке, и на 0.55 подпись давала 4.3:1. */
--vibeui-progress-004-accent:light-dark(oklch(0.535 0.19 39.8),oklch(0.72 0.16 39.8));
--vibeui-progress-004-tile:light-dark(oklch(0.95 0 262),oklch(0.32 0.045 39.8));
--vibeui-progress-004-value:0;
--vibeui-progress-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="progress-004"]{color-scheme:dark}
[data-vibeui-block="progress-004"]{
display:flex;gap:0.875rem;align-items:flex-start;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-progress-004-bg);
border:1px solid var(--vibeui-progress-004-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-004-font);color:var(--vibeui-progress-004-fg);
}
[data-vibeui-block="progress-004"] [data-part="icon"]{
flex:none;display:grid;place-items:center;
width:2.25rem;height:2.75rem;border-radius:0.375rem;
background:var(--vibeui-progress-004-tile);color:var(--vibeui-progress-004-accent);
font-size:0.5625rem;font-weight:800;letter-spacing:0.06em;
clip-path:polygon(0 0,72% 0,100% 26%,100% 100%,0 100%);
}
[data-vibeui-block="progress-004"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.375rem;flex:1 1 auto;min-width:0;
}
[data-vibeui-block="progress-004"] [data-part="name"]{
font-size:0.9375rem;font-weight:650;
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
font-size:0.875rem;color:var(--vibeui-progress-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-004"] [data-part="stats"] span{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-004"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_UNITS = ["Б", "КБ", "МБ", "ГБ"]

const DEFAULT_TEXT: Record<string, string> = {
  almostDone: "почти готово",
  secondsLeft: "осталось {seconds} с",
  minutesLeft: "осталось {minutes} мин",
  size: "{loaded} из {total}",
  speed: "{speed}/с",
  loading: "Загрузка {name}",
  value: "{percent} процентов, {left}",
}

function formatBytes(bytes: number, units: string[]) {
  let size = Math.max(0, bytes)
  let unit = 0

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }

  return `${size >= 100 || unit === 0 ? Math.round(size) : size.toFixed(1)} ${units[unit]}`
}

function formatLeft(seconds: number, say: (key: string) => string) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return say("almostDone")
  }

  if (seconds < 60) {
    return say("secondsLeft").replace("{seconds}", String(Math.ceil(seconds)))
  }

  return say("minutesLeft").replace(
    "{minutes}",
    String(Math.ceil(seconds / 60)),
  )
}

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
 * Загрузка файла со скоростью и оставшимся временем.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress004({
  fileName = "quarterly-report-2026.pdf",
  loaded = 7_340_032,
  total = 12_582_912,
  speed = 1_048_576,
  units = DEFAULT_UNITS,
  text = DEFAULT_TEXT,
  background = "",
  accent,
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
  const say = (key: string) => text[key] ?? DEFAULT_TEXT[key]
  const leftText = formatLeft(left, say)
  const palette = {
    "--vibeui-progress-004-value": percent,
    ...(accent ? { "--vibeui-progress-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-progress-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="progress"
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
            aria-label={say("loading").replace("{name}", fileName)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-valuetext={say("value")
              .replace("{percent}", String(percent))
              .replace("{left}", leftText)}
          >
            <div data-part="bar" />
          </div>
          <div data-part="stats">
            <span>
              {say("size")
                .replace("{loaded}", formatBytes(done, units))
                .replace("{total}", formatBytes(size, units))}
            </span>
            <span>
              {say("speed").replace("{speed}", formatBytes(speed, units))} ·{" "}
              {leftText}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
