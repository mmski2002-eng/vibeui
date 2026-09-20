import type { ComponentProps, CSSProperties } from "react"

export type Progress002Props = Omit<ComponentProps<"div">, "children"> & {
  steps?: string[]
  /** Индекс текущего этапа: всё до него считается пройденным. */
  current?: number
  label?: string
  /** Озвучка этапа: {step} — имя, {current} — номер, {total} — сколько всего. */
  stageText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: прогресс конвейера показан не долей, а этапами. Дорожка
// разрезана на отдельные сегменты с зазорами, поэтому видно не «примерно
// шестьдесят процентов», а «три этапа из пяти закрыты, идёт четвёртый».
const STYLES = `
:where([data-vibeui-block="progress-002"]){
--vibeui-progress-002-bg:transparent;
--vibeui-progress-002-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-progress-002-muted:color-mix(in oklab,var(--vibeui-progress-002-fg) 68%,transparent);
--vibeui-progress-002-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-progress-002-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-progress-002-accent:light-dark(oklch(0.287 0 0),oklch(0.895 0 0));
--vibeui-progress-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="progress-002"]{color-scheme:dark}
[data-vibeui-block="progress-002"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.9375rem 1.0625rem;
background:var(--vibeui-progress-002-bg);
border:1px solid var(--vibeui-progress-002-border);border-radius:0.875rem;
font-family:var(--vibeui-progress-002-font);color:var(--vibeui-progress-002-fg);
}
[data-vibeui-block="progress-002"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
font-size:0.9375rem;font-weight:650;
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
background:var(--vibeui-progress-002-accent);color:oklch(from var(--vibeui-progress-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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
font-size:0.75rem;color:var(--vibeui-progress-002-muted);
}
[data-vibeui-block="progress-002"] li{
flex:1 1 0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="progress-002"] li[data-state="current"]{
color:var(--vibeui-progress-002-fg);font-weight:650;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="progress-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="progress-002"] [data-part="segment"][data-state="current"]{background:var(--vibeui-progress-002-accent);opacity:.55;color:oklch(from var(--vibeui-progress-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
}
`

const DEFAULT_STEPS = ["Очередь", "Сборка", "Тесты", "Ревью", "Выкладка"]

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
 * Прогресс конвейера по этапам: дорожка разрезана на сегменты.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Progress002({
  steps = DEFAULT_STEPS,
  current = 2,
  label = "Пайплайн релиза",
  stageText = "{step}: этап {current} из {total}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Progress002Props) {
  const total = steps.length
  const index = Math.min(Math.max(0, current), total - 1)
  const palette = {
    ...(accent ? { "--vibeui-progress-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-progress-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const stage = stageText
    .replace("{step}", steps[index] ?? "")
    .replace("{current}", String(index + 1))
    .replace("{total}", String(total))

  return (
    <>
      <style href="vibeui-progress-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="progress"
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
          aria-valuetext={stage}
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
