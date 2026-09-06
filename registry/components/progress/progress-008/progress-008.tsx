import type { ComponentProps, CSSProperties } from "react"

export type Progress008Props = Omit<ComponentProps<"div">, "children"> & {
  steps?: string[]
  current?: number
  title?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  text?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: главный ответ здесь — словами, а не долей. Крупная строка
// называет текущий шаг и следующий за ним, а вехи на непрерывной дорожке
// служат только картой пути. Дорожка одна, заливка идёт до текущей вехи:
// расстояние между вехами показывает, сколько ещё впереди.
const STYLES = `
:where([data-vibeui-block="progress-008"]){
--vibeui-progress-008-bg:transparent;
--vibeui-progress-008-surface:light-dark(oklch(0.99 0 265),oklch(0.2 0 265));
--vibeui-progress-008-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-progress-008-muted:color-mix(in oklab,var(--vibeui-progress-008-fg) 68%,transparent);
--vibeui-progress-008-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-progress-008-track:light-dark(oklch(0.92 0 265),oklch(0.3 0 265));
--vibeui-progress-008-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.71 0.16 39.8));
--vibeui-progress-008-value:0;
--vibeui-progress-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="progress-008"]{color-scheme:dark}
[data-vibeui-block="progress-008"]{
display:flex;flex-direction:column;gap:0.875rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-progress-008-bg);
border:1px solid var(--vibeui-progress-008-border);border-radius:1rem;
font-family:var(--vibeui-progress-008-font);color:var(--vibeui-progress-008-fg);
}
[data-vibeui-block="progress-008"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-progress-008-muted);font-variant-numeric:tabular-nums;
}
/* Текущий шаг словами: это главный ответ, поэтому он крупнее всего блока. */
[data-vibeui-block="progress-008"] [data-part="now"]{
margin:0;font-size:1.0625rem;font-weight:700;line-height:1.2;letter-spacing:-0.01em;
}
[data-vibeui-block="progress-008"] [data-part="next"]{
margin:0;font-size:0.875rem;color:var(--vibeui-progress-008-muted);
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
box-sizing:border-box;border:0.1875rem solid var(--vibeui-progress-008-surface);
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

const DEFAULT_TEXT: Record<string, string> = {
  eyebrow: "{title} · шаг {current} из {total}",
  value: "Шаг {current} из {total}: {name}",
  next: "Дальше: {name}",
  last: "Это последний шаг",
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
 * Прогресс, где текущий шаг назван словами, а вехи — карта пути.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress008({
  steps = DEFAULT_STEPS,
  current = 2,
  title = "Импорт справочника",
  text = DEFAULT_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Progress008Props) {
  const total = steps.length
  const index = Math.min(Math.max(0, current), total - 1)
  const percent = total > 1 ? (index / (total - 1)) * 100 : 100
  const next = steps[index + 1]
  const say = (key: string, name = "") =>
    (text[key] ?? DEFAULT_TEXT[key])
      .replace("{title}", title)
      .replace("{current}", String(index + 1))
      .replace("{total}", String(total))
      .replace("{name}", name)
  // Кольцо вехи прорезано цветом подложки, поэтому заданный фон достаётся и ему.
  const palette = {
    "--vibeui-progress-008-value": percent,
    ...(accent ? { "--vibeui-progress-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-progress-008-bg": background,
          "--vibeui-progress-008-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-progress-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="progress"
        data-vibeui-block="progress-008"
        className={className}
        style={palette}
      >
        <span data-part="eyebrow">{say("eyebrow")}</span>
        <p data-part="now">{steps[index]}</p>
        <div
          data-part="track"
          role="progressbar"
          aria-label={title}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-valuetext={say("value", steps[index] ?? "")}
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
        <p data-part="next">{next ? say("next", next) : say("last")}</p>
      </div>
    </>
  )
}
