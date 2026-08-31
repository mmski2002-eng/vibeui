import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Separator006Space = "xs" | "sm" | "md" | "lg" | "xl"

export type Separator006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  space?: Separator006Space
  inset?: boolean
}

// Идея компонента: разделитель, у которого отступы взяты со шкалы, а не
// подобраны по месту. Шаг один — 0.25rem, ступени кратны ему, поэтому две
// границы в разных частях страницы дышат одинаково и вертикальный ритм не
// рассыпается. Отступ задан переменной на самом разделителе: соседние блоки
// про него ничего не знают и не схлопывают margin друг друга.
const STYLES = `
:where([data-vibeui-block="separator-006"]){
--vibeui-separator-006-step:0.25rem;
--vibeui-separator-006-space:calc(var(--vibeui-separator-006-step) * 4);
--vibeui-separator-006-inset:0rem;
--vibeui-separator-006-line:oklch(0.89 0.006 265);
--vibeui-separator-006-surface:oklch(1 0 0);
--vibeui-separator-006-border:oklch(0.91 0.006 265);
--vibeui-separator-006-fg:oklch(0.26 0.014 265);
--vibeui-separator-006-muted:oklch(0.55 0.014 265);
--vibeui-separator-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: строки списка набраны тёмным. */
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

const ROWS = [
  { title: "Профиль", hint: "изменён вчера" },
  { title: "Уведомления", hint: "включены" },
  { title: "Экспорт данных", hint: "готов" },
]

/**
 * Разделитель с отступами по шкале: пять ступеней от одного шага.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Separator006({
  space = "md",
  inset = false,
  className,
  style,
  ...props
}: Separator006Props) {
  return (
    <>
      <style href="vibeui-separator-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="separator-006"
        data-space={space}
        data-inset={inset}
        className={className}
        style={style as CSSProperties}
      >
        {ROWS.map((row, index) => (
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
