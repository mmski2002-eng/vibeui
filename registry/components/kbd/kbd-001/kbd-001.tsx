import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Kbd001Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  rows?: { action: string; keys: string[] }[]
  title?: string
}

// Идея компонента: список горячих клавиш. Клавиши набраны тегом kbd — это его
// прямое назначение, и скринридер объявит их как ввод, а не как текст.
// Плюс между клавишами нарисован в разметке, а не в CSS: «⌘ + K» надо
// прочитать вслух, иначе сочетание превращается в две отдельные клавиши.
const STYLES = `
:where([data-vibeui-block="kbd-001"]){
--vibeui-kbd-001-bg:oklch(1 0 0);
--vibeui-kbd-001-fg:oklch(0.24 0.014 265);
--vibeui-kbd-001-muted:oklch(0.56 0.014 265);
--vibeui-kbd-001-border:oklch(0.88 0.008 265);
--vibeui-kbd-001-key:oklch(0.985 0.002 265);
--vibeui-kbd-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="kbd-001"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-kbd-001-bg);
border:1px solid var(--vibeui-kbd-001-border);border-radius:0.875rem;
font-family:var(--vibeui-kbd-001-font);color:var(--vibeui-kbd-001-fg);
}
[data-vibeui-block="kbd-001"] [data-part="title"]{margin:0 0 0.125rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="kbd-001"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
min-height:1.875rem;font-size:0.8125rem;
}
[data-vibeui-block="kbd-001"] [data-part="keys"]{display:inline-flex;align-items:center;gap:0.25rem;flex:none}
/* Клавиша — тег kbd: скринридер объявит её как ввод, а не как текст. */
[data-vibeui-block="kbd-001"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.5rem;height:1.5rem;padding:0 0.375rem;box-sizing:border-box;
border:1px solid var(--vibeui-kbd-001-border);border-bottom-width:2px;border-radius:0.375rem;
background:var(--vibeui-kbd-001-key);
font-family:inherit;font-size:0.75rem;font-weight:650;line-height:1;
}
[data-vibeui-block="kbd-001"] [data-part="plus"]{color:var(--vibeui-kbd-001-muted);font-size:0.6875rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS = [
  { action: "Открыть поиск", keys: ["⌘", "K"] },
  { action: "Скопировать для ИИ", keys: ["⌘", "⇧", "C"] },
  { action: "Следующий компонент", keys: ["J"] },
  { action: "Закрыть окно", keys: ["Esc"] },
]

/**
 * Список горячих клавиш: клавиши тегом kbd, плюс между ними в разметке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd001({
  rows = DEFAULT_ROWS,
  title = "Горячие клавиши",
  className,
  style,
  ...props
}: Kbd001Props) {
  return (
    <>
      <style href="vibeui-kbd-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="kbd-001"
        className={className}
        style={style as CSSProperties}
      >
        {title ? <h3 data-part="title">{title}</h3> : null}
        {rows.map((row) => (
          <p key={row.action} data-part="row">
            <span>{row.action}</span>
            <span data-part="keys">
              {row.keys.map((key, index) => (
                <span key={key} data-part="key">
                  {index > 0 ? <span data-part="plus"> + </span> : null}
                  <kbd>{key}</kbd>
                </span>
              ))}
            </span>
          </p>
        ))}
      </div>
    </>
  )
}
