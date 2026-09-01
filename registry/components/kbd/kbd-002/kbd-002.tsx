import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Kbd002Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  keys?: string[]
  separator?: "plus" | "then" | "arrow"
  caption?: string
}

// Идея компонента: сочетание клавиш с явным разделителем. «⌘ + K» и «⌘ затем
// K» — разные действия: первое нажимают вместе, второе по очереди, и без
// слова между клавишами пользователь угадывает. Разделитель лежит в разметке
// отдельным элементом, поэтому его слышно при чтении вслух, а не только видно.
const STYLES = `
:where([data-vibeui-block="kbd-002"]){
--vibeui-kbd-002-surface:oklch(1 0 0);
--vibeui-kbd-002-fg:oklch(0.24 0.014 265);
--vibeui-kbd-002-muted:oklch(0.55 0.014 265);
--vibeui-kbd-002-border:oklch(0.88 0.008 265);
--vibeui-kbd-002-key:oklch(0.985 0.002 265);
--vibeui-kbd-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: клавиши и подпись тёмные. */
[data-vibeui-block="kbd-002"]{
display:inline-flex;flex-direction:column;gap:0.5rem;
box-sizing:border-box;padding:0.875rem 1rem;
background:var(--vibeui-kbd-002-surface);
border:1px solid var(--vibeui-kbd-002-border);border-radius:0.875rem;
font-family:var(--vibeui-kbd-002-font);color:var(--vibeui-kbd-002-fg);
}
[data-vibeui-block="kbd-002"] [data-part="caption"]{
margin:0;font-size:0.75rem;color:var(--vibeui-kbd-002-muted);
}
[data-vibeui-block="kbd-002"] [data-part="chord"]{
display:inline-flex;align-items:center;gap:0.375rem;flex-wrap:wrap;
}
[data-vibeui-block="kbd-002"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.75rem;height:1.75rem;padding:0 0.5rem;box-sizing:border-box;
background:var(--vibeui-kbd-002-key);
border:1px solid var(--vibeui-kbd-002-border);border-bottom-width:2px;
border-radius:0.4375rem;
font-family:inherit;font-size:0.8125rem;font-weight:650;line-height:1;
}
/* Разделитель — отдельный узел: его слышно при чтении вслух, а не только видно. */
[data-vibeui-block="kbd-002"] [data-part="sep"]{
font-size:0.75rem;color:var(--vibeui-kbd-002-muted);
}
[data-vibeui-block="kbd-002"][data-separator="then"] [data-part="sep"]{
font-size:0.6875rem;text-transform:lowercase;letter-spacing:0.02em;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-002"] *{animation:none!important;transition:none!important}}
`

const SEPARATORS: Record<NonNullable<Kbd002Props["separator"]>, string> = {
  plus: "+",
  then: "затем",
  arrow: "→",
}

/**
 * Сочетание клавиш с разделителем, который читается вслух.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd002({
  keys = ["⌘", "⇧", "P"],
  separator = "plus",
  caption = "Палитра команд",
  className,
  style,
  ...props
}: Kbd002Props) {
  const glue = SEPARATORS[separator]

  return (
    <>
      <style href="vibeui-kbd-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kbd-002"
        data-separator={separator}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="chord">
          {keys.map((key, index) => (
            <span key={key} data-part="unit">
              {index > 0 ? <span data-part="sep"> {glue} </span> : null}
              <kbd>{key}</kbd>
            </span>
          ))}
        </span>
        <p data-part="caption">{caption}</p>
      </div>
    </>
  )
}
