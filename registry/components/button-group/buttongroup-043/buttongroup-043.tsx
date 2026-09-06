import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup043Props = Omit<ComponentProps<"nav">, "children"> & {
  index?: number
  total?: number
  entity?: string
  label?: string
  /** Счётчик: {entity}, {index} и {total} подставляются на месте. */
  counterText?: string
  /** Имена кнопок: компонент несёт русские, проект подставляет свои. */
  stepText?: Record<string, string>
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: навигация по записям карточной формы — первая, предыдущая,
// следующая, последняя. Переход к краю и переход на шаг различаются не
// подписью, а формой значка: стрелка с планкой упирается в стену. Под
// сцепкой лежит тонкая полоса положения: она показывает, где вы в наборе,
// когда «12 из 340» уже ничего не говорит. Полоса построена на процентной
// ширине от индекса и помечена aria-hidden — то же самое сказано текстом.
// Крайние кнопки гасятся disabled парами: на первой записи бессмысленны обе
// левые, и гасить только одну — значит обмануть.
const STYLES = `
:where([data-vibeui-block="buttongroup-043"]){
--vibeui-buttongroup-043-surface:transparent;
--vibeui-buttongroup-043-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-043-muted:color-mix(in oklab,var(--vibeui-buttongroup-043-fg) 68%,transparent);
--vibeui-buttongroup-043-border:light-dark(oklch(0.88 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-043-hover:light-dark(oklch(0.965 0 265),oklch(0.33 0 265));
--vibeui-buttongroup-043-rail:light-dark(oklch(0.93 0 265),oklch(0.36 0 265));
--vibeui-buttongroup-043-accent:light-dark(oklch(0.5 0.16 265),oklch(0.77 0.13 265));
--vibeui-buttongroup-043-radius:0.625rem;
--vibeui-buttongroup-043-progress:0%;
--vibeui-buttongroup-043-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-043"]{color-scheme:dark}
[data-vibeui-block="buttongroup-043"]{
box-sizing:border-box;display:inline-flex;flex-direction:column;gap:0.4375rem;
font-family:var(--vibeui-buttongroup-043-font);
}
[data-vibeui-block="buttongroup-043"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-043"] [data-part="track"]{
display:flex;isolation:isolate;
border:1px solid var(--vibeui-buttongroup-043-border);
border-radius:var(--vibeui-buttongroup-043-radius);
background:var(--vibeui-buttongroup-043-surface);
overflow:hidden;
}
[data-vibeui-block="buttongroup-043"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-043-muted);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-043"] [data-part="track"] > * + *{
border-inline-start:1px solid var(--vibeui-buttongroup-043-border);
}
[data-vibeui-block="buttongroup-043"] svg{
width:1rem;height:1rem;
stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-043"] button:hover:not(:disabled){
background:var(--vibeui-buttongroup-043-hover);color:var(--vibeui-buttongroup-043-fg);
}
[data-vibeui-block="buttongroup-043"] button:disabled{opacity:.32;cursor:not-allowed}
[data-vibeui-block="buttongroup-043"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-043-accent);outline-offset:-2px;
}
[data-vibeui-block="buttongroup-043"] [data-part="counter"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:5.5rem;height:2.25rem;padding:0 0.625rem;
color:var(--vibeui-buttongroup-043-fg);
font-size:0.8125rem;font-weight:650;line-height:1;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
/* Полоса положения: «12 из 340» цифрами читается, но не ощущается. */
[data-vibeui-block="buttongroup-043"] [data-part="bar"]{
position:relative;height:3px;border-radius:2px;
background:var(--vibeui-buttongroup-043-rail);overflow:hidden;
}
[data-vibeui-block="buttongroup-043"] [data-part="bar"] i{
position:absolute;inset-block:0;inset-inline-start:0;
width:var(--vibeui-buttongroup-043-progress);
border-radius:2px;background:var(--vibeui-buttongroup-043-accent);
transition:width .2s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-043"] *{animation:none!important;transition:none!important}}
`

const ICONS = {
  first: "M18 5 11 12l7 7M7 5v14",
  prev: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
  last: "M6 5l7 7-7 7M17 5v14",
}

const STEP_LABEL: Record<string, string> = {
  first: "К первой записи",
  prev: "К предыдущей записи",
  next: "К следующей записи",
  last: "К последней записи",
}

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Навигация по записям: край и шаг различаются формой значка, снизу — полоса.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup043({
  index = 12,
  total = 340,
  entity = "Запись",
  label = "Навигация по записям",
  counterText = "{entity} {index} из {total}",
  stepText = STEP_LABEL,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup043Props) {
  const current = Math.min(Math.max(1, index), total)
  const atStart = current === 1
  const atEnd = current === total
  const counter = counterText
    .replace("{entity}", entity)
    .replace("{index}", String(current))
    .replace("{total}", String(total))
  const stepLabel = (step: string) => stepText[step] ?? STEP_LABEL[step]

  const palette = {
    "--vibeui-buttongroup-043-progress": `${total > 1 ? ((current - 1) / (total - 1)) * 100 : 100}%`,
    ...(accent ? { "--vibeui-buttongroup-043-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-043-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-043" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-043"
        className={className}
        style={palette}
        aria-label={label}
      >
        <div data-part="track">
          <button
            type="button"
            disabled={atStart}
            aria-label={stepLabel("first")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS.first} />
            </svg>
          </button>
          <button
            type="button"
            disabled={atStart}
            aria-label={stepLabel("prev")}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS.prev} />
            </svg>
          </button>
          <span data-part="counter">{counter}</span>
          <button type="button" disabled={atEnd} aria-label={stepLabel("next")}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS.next} />
            </svg>
          </button>
          <button type="button" disabled={atEnd} aria-label={stepLabel("last")}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={ICONS.last} />
            </svg>
          </button>
        </div>
        <div data-part="bar" aria-hidden="true">
          <i />
        </div>
      </nav>
    </>
  )
}
