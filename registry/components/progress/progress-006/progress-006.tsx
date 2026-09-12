import type { ComponentProps, CSSProperties } from "react"

export type Progress006Props = Omit<ComponentProps<"div">, "children"> & {
  /** Текущий расход в единицах плана, а не в процентах. */
  value?: number
  /** Порог, после которого включается предупреждение. */
  threshold?: number
  limit?: number
  label?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у полосы есть порог, и он нарисован прямо на дорожке
// засечкой. Пока расход ниже — полоса спокойная; выше — она меняет цвет,
// получает штриховку и роняет строку предупреждения в role="status".
// Штриховка нужна, потому что «стало красным» не читается без цвета.
const STYLES = `
:where([data-vibeui-block="progress-006"]){
--vibeui-progress-006-bg:transparent;
--vibeui-progress-006-fg:light-dark(oklch(0.25 0 265),oklch(0.94 0 265));
--vibeui-progress-006-muted:color-mix(in oklab,var(--vibeui-progress-006-fg) 68%,transparent);
--vibeui-progress-006-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-progress-006-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-progress-006-accent:light-dark(oklch(0.295 0 0),oklch(0.903 0 0));
--vibeui-progress-006-alarm:light-dark(oklch(0.58 0.19 28),oklch(0.7 0.17 28));
--vibeui-progress-006-alert-bg:light-dark(oklch(0.96 0.03 28),oklch(0.31 0 0));
--vibeui-progress-006-alert-fg:light-dark(oklch(0.26 0 0),oklch(0.9 0 0));
--vibeui-progress-006-on-alarm:light-dark(oklch(1 0 0),oklch(0.18 0.03 28));
--vibeui-progress-006-value:0;
--vibeui-progress-006-mark:0;
--vibeui-progress-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="progress-006"]{color-scheme:dark}
[data-vibeui-block="progress-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-progress-006-bg);
border:1px solid var(--vibeui-progress-006-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-006-font);color:var(--vibeui-progress-006-fg);
}
[data-vibeui-block="progress-006"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
font-size:0.9375rem;font-weight:650;
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
transition:width .3s cubic-bezier(.32,.72,0,1),background-color .2s ease;color:oklch(from var(--vibeui-progress-006-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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
font-size:0.75rem;color:var(--vibeui-progress-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="progress-006"] [data-part="alert"]{
display:flex;align-items:flex-start;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-progress-006-alert-bg);color:var(--vibeui-progress-006-alert-fg);
font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="progress-006"] [data-part="alert"] strong{font-weight:700}
[data-vibeui-block="progress-006"] [data-part="sign"]{
flex:none;display:grid;place-items:center;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-progress-006-alarm);color:var(--vibeui-progress-006-on-alarm);
font-size:0.75rem;font-weight:800;line-height:1;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-006"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_TEXT: Record<string, string> = {
  amount: "{value} / {threshold} тыс. запросов",
  mark: "порог {threshold}",
  value: "{value} тысяч запросов при пороге {threshold} тысяч",
  alert:
    "Порог превышен на {excess} тыс. запросов. Дальнейшие вызовы тарифицируются сверх плана.",
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
 * Полоса с порогом на дорожке и предупреждением на превышении.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress006({
  value = 118,
  threshold = 100,
  limit = 140,
  label = "Расход API-квоты",
  text = DEFAULT_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Progress006Props) {
  const scale = Math.max(1, limit)
  const used = Math.max(0, value)
  const percent = Math.min(100, (used / scale) * 100)
  const mark = Math.min(100, Math.max(0, (threshold / scale) * 100))
  const over = used > threshold
  const say = (key: string) =>
    (text[key] ?? DEFAULT_TEXT[key])
      .replace("{value}", String(used))
      .replace("{threshold}", String(threshold))
  // Число превышения остаётся отдельным узлом: оно набрано жирным внутри фразы.
  const [alertBefore, alertAfter] = say("alert").split("{excess}")
  const palette = {
    "--vibeui-progress-006-value": percent,
    "--vibeui-progress-006-mark": mark,
    ...(accent ? { "--vibeui-progress-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-progress-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="progress"
        data-vibeui-block="progress-006"
        data-over={over || undefined}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span>{label}</span>
          <span data-part="amount">{say("amount")}</span>
        </div>
        <div
          data-part="track"
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={scale}
          aria-valuenow={used}
          aria-valuetext={say("value")}
        >
          <div data-part="bar" />
          <span data-part="mark" aria-hidden="true" />
        </div>
        <div data-part="scale">
          <span>0</span>
          <span>{say("mark")}</span>
          <span>{scale}</span>
        </div>
        <p data-part="alert" role="status" hidden={!over}>
          <span data-part="sign" aria-hidden="true">
            !
          </span>
          <span>
            {alertBefore}
            <strong>{Math.max(0, used - threshold)}</strong>
            {alertAfter}
          </span>
        </p>
      </div>
    </>
  )
}
