import type { ComponentProps, CSSProperties } from "react"

export type Separator006Space = "xs" | "sm" | "md" | "lg" | "xl"

export type Separator006Row = { title: string; hint: string }

export type Separator006Props = Omit<ComponentProps<"div">, "children"> & {
  space?: Separator006Space
  inset?: boolean
  /** Строки списка: компонент несёт русские, проект подставляет свои. */
  rows?: Separator006Row[]
  /** Пусто — подложки нет, список лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: разделитель, у которого отступы взяты со шкалы, а не
// подобраны по месту. Шаг один — 0.25rem, ступени кратны ему, поэтому две
// границы в разных частях страницы дышат одинаково и вертикальный ритм не
// рассыпается. Отступ задан переменной на самом разделителе: соседние блоки
// про него ничего не знают и не схлопывают margin друг друга.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки по
// умолчанию нет, а линии в тёмном контексте светлее фона.
const STYLES = `
:where([data-vibeui-block="separator-006"]){
--vibeui-separator-006-step:0.25rem;
--vibeui-separator-006-space:calc(var(--vibeui-separator-006-step) * 4);
--vibeui-separator-006-inset:0rem;
--vibeui-separator-006-line:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-separator-006-surface:transparent;
--vibeui-separator-006-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-separator-006-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-separator-006-muted:color-mix(in oklab,var(--vibeui-separator-006-fg) 68%,transparent);
--vibeui-separator-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="separator-006"]{color-scheme:dark}
[data-vibeui-block="separator-006"]{
display:block;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-separator-006-surface);
border:1px solid var(--vibeui-separator-006-border);border-radius:0.875rem;
font-family:var(--vibeui-separator-006-font);color:var(--vibeui-separator-006-fg);
font-size:0.8125rem;
}
[data-vibeui-block="separator-006"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:0;
}
[data-vibeui-block="separator-006"] [data-part="hint"]{color:var(--vibeui-separator-006-muted)}
/* Отступ живёт на разделителе: соседи не схлопывают его margin. */
[data-vibeui-block="separator-006"] [data-part="rule"]{
height:1px;border:0;
margin:var(--vibeui-separator-006-space) var(--vibeui-separator-006-inset);
background:var(--vibeui-separator-006-line);
}
[data-vibeui-block="separator-006"][data-space="xs"]{--vibeui-separator-006-space:calc(var(--vibeui-separator-006-step) * 1)}
[data-vibeui-block="separator-006"][data-space="sm"]{--vibeui-separator-006-space:calc(var(--vibeui-separator-006-step) * 2)}
[data-vibeui-block="separator-006"][data-space="md"]{--vibeui-separator-006-space:calc(var(--vibeui-separator-006-step) * 4)}
[data-vibeui-block="separator-006"][data-space="lg"]{--vibeui-separator-006-space:calc(var(--vibeui-separator-006-step) * 6)}
[data-vibeui-block="separator-006"][data-space="xl"]{--vibeui-separator-006-space:calc(var(--vibeui-separator-006-step) * 9)}
[data-vibeui-block="separator-006"][data-inset="true"]{--vibeui-separator-006-inset:1rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="separator-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Separator006Row[] = [
  { title: "Профиль", hint: "изменён вчера" },
  { title: "Уведомления", hint: "включены" },
  { title: "Экспорт данных", hint: "готов" },
]

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
 * Разделитель с отступами по шкале: пять ступеней от одного шага.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Separator006({
  space = "md",
  inset = false,
  rows = DEFAULT_ROWS,
  background = "",
  className,
  style,
  ...props
}: Separator006Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-separator-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-separator-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="separator"
        data-vibeui-block="separator-006"
        data-space={space}
        data-inset={inset}
        className={className}
        style={palette}
      >
        {rows.map((row, index) => (
          <div key={row.title}>
            {index > 0 ? <hr data-part="rule" /> : null}
            <p data-part="row">
              <span>{row.title}</span>
              <span data-part="hint">{row.hint}</span>
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
