import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Badge010Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  /** 1 — самый высокий приоритет. */
  level?: 1 | 2 | 3 | 4
  label?: string
  total?: number
}

// Идея компонента: приоритет штрихами, а не цветом. Три залитых полоски из
// четырёх читаются в чёрно-белой печати, при дальтонизме и краем глаза в
// длинном списке, где красный от оранжевого не отличить. Подпись остаётся
// словом: полоски уточняют степень, а не заменяют название.
const STYLES = `
:where([data-vibeui-block="badge-010"]){
--vibeui-badge-010-bg:oklch(0.96 0.004 265);
--vibeui-badge-010-fg:oklch(0.32 0.014 265);
--vibeui-badge-010-border:oklch(0.89 0.006 265);
--vibeui-badge-010-track:oklch(0.87 0.008 265);
--vibeui-badge-010-mark:oklch(0.45 0.014 265);
--vibeui-badge-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="badge-010"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:1.5rem;padding:0 0.625rem 0 0.5rem;
border:1px solid var(--vibeui-badge-010-border);border-radius:0.4375rem;
background:var(--vibeui-badge-010-bg);color:var(--vibeui-badge-010-fg);
font-family:var(--vibeui-badge-010-font);font-size:0.75rem;font-weight:600;
line-height:1;white-space:nowrap;vertical-align:middle;
}
[data-vibeui-block="badge-010"][data-level="1"]{--vibeui-badge-010-mark:oklch(0.55 0.19 25)}
[data-vibeui-block="badge-010"][data-level="2"]{--vibeui-badge-010-mark:oklch(0.62 0.16 55)}
[data-vibeui-block="badge-010"][data-level="3"]{--vibeui-badge-010-mark:oklch(0.6 0.1 230)}
/* Полоски: степень видно формой, цвет только усиливает. */
[data-vibeui-block="badge-010"] [data-part="bars"]{display:inline-flex;align-items:flex-end;gap:0.125rem;flex:none}
[data-vibeui-block="badge-010"] [data-part="bar"]{
width:0.1875rem;border-radius:9999px;background:var(--vibeui-badge-010-track);
}
[data-vibeui-block="badge-010"] [data-part="bar"][data-on="true"]{background:var(--vibeui-badge-010-mark)}
[data-vibeui-block="badge-010"] [data-part="bar"]:nth-child(1){height:0.375rem}
[data-vibeui-block="badge-010"] [data-part="bar"]:nth-child(2){height:0.5625rem}
[data-vibeui-block="badge-010"] [data-part="bar"]:nth-child(3){height:0.75rem}
[data-vibeui-block="badge-010"] [data-part="bar"]:nth-child(4){height:0.9375rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="badge-010"] *{animation:none!important;transition:none!important}}
`

const LEVEL_TEXT: Record<number, string> = {
  1: "Критический",
  2: "Высокий",
  3: "Обычный",
  4: "Низкий",
}

/**
 * Приоритет штрихами: степень читается формой, а не цветом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Badge010({
  level = 1,
  label,
  total = 4,
  className,
  style,
  ...props
}: Badge010Props) {
  // Первый уровень — самый высокий, поэтому полосок у него больше всех.
  const filled = total - level + 1
  const text = label ?? LEVEL_TEXT[level] ?? `Уровень ${level}`

  return (
    <>
      <style href="vibeui-badge-010" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="badge-010"
        data-level={level}
        className={className}
        style={style as CSSProperties}
        aria-label={`Приоритет: ${text}, ${filled} из ${total}`}
      >
        <span data-part="bars" aria-hidden="true">
          {Array.from({ length: total }, (_, index) => (
            <span key={index} data-part="bar" data-on={index < filled} />
          ))}
        </span>
        <span aria-hidden="true">{text}</span>
      </span>
    </>
  )
}
