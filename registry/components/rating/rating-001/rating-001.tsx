import type { ComponentProps, CSSProperties } from "react"

export type Rating001Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  name?: string
  max?: number
  defaultValue?: number
  hints?: string[]
  /** Подпись звезды для скринридера. {value} — номер, {max} — размер шкалы. */
  starLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: оценка звёздами без JS. Каждая звезда — радиокнопка, поэтому
// выбор, клавиатура и отправка формы работают сами. Звёзды идут в разметке в
// обратном порядке и разворачиваются flex-direction: только так соседний
// селектор ~ закрашивает все звёзды левее наведённой без единой строки кода.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="rating-001"]){
--vibeui-rating-001-bg:transparent;
--vibeui-rating-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-rating-001-muted:color-mix(in oklab,var(--vibeui-rating-001-fg) 68%,transparent);
--vibeui-rating-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-rating-001-empty:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-rating-001-accent:light-dark(oklch(0.72 0.16 75),oklch(0.82 0.15 78));
--vibeui-rating-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="rating-001"]{color-scheme:dark}
[data-vibeui-block="rating-001"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:18rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-rating-001-bg);
border:1px solid var(--vibeui-rating-001-border);border-radius:0.875rem;
font-family:var(--vibeui-rating-001-font);color:var(--vibeui-rating-001-fg);
}
[data-vibeui-block="rating-001"] legend{float:left;width:100%;padding:0;margin-bottom:0.375rem;font-size:0.875rem;font-weight:650}
/* Обратный порядок в разметке: тогда ~ закрашивает звёзды левее наведённой. */
[data-vibeui-block="rating-001"] [data-part="stars"]{
display:flex;flex-direction:row-reverse;justify-content:flex-end;gap:0.125rem;
}
[data-vibeui-block="rating-001"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="rating-001"] [data-part="star"]{
cursor:pointer;font-size:1.5rem;line-height:1;color:var(--vibeui-rating-001-empty);
padding:0 0.0625rem;border-radius:0.25rem;
}
/* Отмеченная звезда и все левее неё: соседи по ~ идут в обратном порядке. */
[data-vibeui-block="rating-001"] label:has(input:checked) [data-part="star"],
[data-vibeui-block="rating-001"] label:has(input:checked) ~ label [data-part="star"]{color:var(--vibeui-rating-001-accent)}
/* Пока курсор в группе, показываем не выбор, а то, что будет выбрано. */
[data-vibeui-block="rating-001"] [data-part="stars"]:hover [data-part="star"]{color:var(--vibeui-rating-001-empty)}
[data-vibeui-block="rating-001"] [data-part="stars"]:hover label:hover [data-part="star"],
[data-vibeui-block="rating-001"] [data-part="stars"]:hover label:hover ~ label [data-part="star"]{color:var(--vibeui-rating-001-accent)}
[data-vibeui-block="rating-001"] input:focus-visible + [data-part="star"]{outline:2px solid var(--vibeui-rating-001-accent);outline-offset:1px}
/* Подпись оценки тоже без JS: видна та строка, чей value отмечен. */
[data-vibeui-block="rating-001"] [data-part="hint"]{display:none;margin:0;font-size:0.75rem;color:var(--vibeui-rating-001-muted)}
[data-vibeui-block="rating-001"] [data-part="hints"]{min-height:1rem}
[data-vibeui-block="rating-001"]:has(input[value="1"]:checked) [data-part="hint"][data-value="1"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="2"]:checked) [data-part="hint"][data-value="2"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="3"]:checked) [data-part="hint"][data-value="3"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="4"]:checked) [data-part="hint"][data-value="4"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="5"]:checked) [data-part="hint"][data-value="5"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="6"]:checked) [data-part="hint"][data-value="6"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="7"]:checked) [data-part="hint"][data-value="7"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="8"]:checked) [data-part="hint"][data-value="8"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="9"]:checked) [data-part="hint"][data-value="9"]{display:block}
[data-vibeui-block="rating-001"]:has(input[value="10"]:checked) [data-part="hint"][data-value="10"]{display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="rating-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_HINTS = ["Плохо", "Так себе", "Нормально", "Хорошо", "Отлично"]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Оценка звёздами на радиокнопках: выбор и клавиатура без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Rating001({
  legend = "Оцените компонент",
  name = "vibeui-rating-001",
  max = 5,
  defaultValue = 4,
  hints = DEFAULT_HINTS,
  starLabel = "{value} из {max}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Rating001Props) {
  const stars = Array.from({ length: max }, (_, index) => max - index)

  const palette = {
    ...(accent ? { "--vibeui-rating-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-rating-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-rating-001" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="rating"
        data-vibeui-block="rating-001"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="stars">
          {stars.map((value) => (
            <label
              key={value}
              aria-label={starLabel
                .replace("{value}", String(value))
                .replace("{max}", String(max))}
            >
              <input
                type="radio"
                name={name}
                value={value}
                defaultChecked={value === defaultValue}
              />
              <span data-part="star" aria-hidden="true">
                ★
              </span>
            </label>
          ))}
        </div>
        <div data-part="hints" aria-live="polite">
          {hints.map((hint, index) => (
            <p key={hint} data-part="hint" data-value={index + 1}>
              {hint}
            </p>
          ))}
        </div>
      </fieldset>
    </>
  )
}
