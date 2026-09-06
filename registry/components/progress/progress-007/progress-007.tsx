import type { ComponentProps, CSSProperties } from "react"

export type Progress007Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Сколько единиц работы уже сделано: честное число вместо выдуманной доли. */
  processed?: number
  unit?: string
  elapsed?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Локаль форматирования счётчика. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: длительность неизвестна, поэтому доли нет вовсе. Дорожка
// залита штриховкой во всю ширину, движение задано background-position, а
// вместо процентов показан счётчик уже сделанной работы — единственное
// число, которое здесь честно. aria-valuenow сознательно не выставлен.
const STYLES = `
:where([data-vibeui-block="progress-007"]){
--vibeui-progress-007-bg:transparent;
--vibeui-progress-007-fg:light-dark(oklch(0.25 0 265),oklch(0.94 0 265));
--vibeui-progress-007-muted:color-mix(in oklab,var(--vibeui-progress-007-fg) 68%,transparent);
--vibeui-progress-007-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-progress-007-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-progress-007-accent:light-dark(oklch(0.6 0.15 39.8),oklch(0.72 0.14 39.8));
--vibeui-progress-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="progress-007"]{color-scheme:dark}
[data-vibeui-block="progress-007"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-progress-007-bg);
border:1px solid var(--vibeui-progress-007-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-007-font);color:var(--vibeui-progress-007-fg);
}
[data-vibeui-block="progress-007"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;font-size:0.9375rem;font-weight:650;
}
/* Точка-маячок: подпись остаётся живой, даже когда полосу не видно. */
[data-vibeui-block="progress-007"] [data-part="pip"]{
flex:none;width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-progress-007-accent);
animation:vibeui-progress-007-pulse 1.6s ease-in-out infinite;
}
/* Штриховка едет по всей дорожке: конца у неё нет, и это честно. */
[data-vibeui-block="progress-007"] [data-part="track"]{
height:0.5rem;border-radius:9999px;overflow:hidden;
background-color:var(--vibeui-progress-007-track);
background-image:repeating-linear-gradient(
115deg,
var(--vibeui-progress-007-accent) 0 0.5rem,
color-mix(in oklch,var(--vibeui-progress-007-accent) 45%,var(--vibeui-progress-007-track)) 0.5rem 1rem);
background-size:2rem 100%;
animation:vibeui-progress-007-drift 0.9s linear infinite;
}
@keyframes vibeui-progress-007-drift{
0%{background-position:0 0}
100%{background-position:-2rem 0}
}
@keyframes vibeui-progress-007-pulse{
0%,100%{opacity:1}
50%{opacity:.3}
}
[data-vibeui-block="progress-007"] [data-part="foot"]{
display:flex;justify-content:space-between;gap:0.75rem;
font-size:0.875rem;color:var(--vibeui-progress-007-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-007"] [data-part="foot"] strong{
color:var(--vibeui-progress-007-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-007"] *{animation:none!important;transition:none!important}
[data-vibeui-block="progress-007"] [data-part="track"]{background-image:none;background-color:color-mix(in oklch,var(--vibeui-progress-007-accent) 35%,var(--vibeui-progress-007-track))}
}
`

const DEFAULT_TEXT: Record<string, string> = {
  processed: "обработано {count} {unit}",
  unknown: "Длительность неизвестна",
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
 * Неопределённый прогресс: штриховка вместо доли, счётчик вместо процента.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress007({
  label = "Индексируем архив",
  processed = 12_480,
  unit = "документов",
  elapsed = "идёт 3 мин",
  text = DEFAULT_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Progress007Props) {
  const say = (key: string) => text[key] ?? DEFAULT_TEXT[key]
  // Счётчик остаётся отдельным узлом: внутри фразы он набран жирным.
  const [countBefore, countAfter] = say("processed")
    .replace("{unit}", unit)
    .split("{count}")
  const palette = {
    ...(accent ? { "--vibeui-progress-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-progress-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="progress"
        data-vibeui-block="progress-007"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="pip" aria-hidden="true" />
          <span>{label}</span>
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-valuetext={say("unknown")}
        />
        <div data-part="foot">
          <span>
            {countBefore}
            <strong>{processed.toLocaleString(locale)}</strong>
            {countAfter}
          </span>
          <span>{elapsed}</span>
        </div>
      </div>
    </>
  )
}
