import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Kbd003Props = Omit<ComponentPropsWithoutRef<"p">, "children"> & {
  before?: string
  keys?: string[]
  after?: string
}

// Идея компонента: клавиша внутри строки текста, которая не рвёт интерлиньяж.
// Обычная kbd с паддингом делает строку выше соседних, и абзац «разъезжается».
// Здесь высота клавиши задана в em и вписана в строку: вертикальные отступы
// нулевые, объём даёт padding по горизонтали и рамка, а вертикальное
// выравнивание — сдвиг на 0.05em, а не изменение line-height абзаца.
const STYLES = `
:where([data-vibeui-block="kbd-003"]){
--vibeui-kbd-003-surface:oklch(1 0 0);
--vibeui-kbd-003-fg:oklch(0.24 0.014 265);
--vibeui-kbd-003-border:oklch(0.87 0.008 265);
--vibeui-kbd-003-key:oklch(0.97 0.003 265);
--vibeui-kbd-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: абзац и клавиши тёмные. */
[data-vibeui-block="kbd-003"]{
display:block;box-sizing:border-box;margin:0;
width:100%;max-width:24rem;padding:0.875rem 1rem;
background:var(--vibeui-kbd-003-surface);
border:1px solid var(--vibeui-kbd-003-border);border-radius:0.875rem;
font-family:var(--vibeui-kbd-003-font);color:var(--vibeui-kbd-003-fg);
font-size:0.875rem;line-height:1.7;
}
/* Клавиша вписана в строку: нулевые вертикальные отступы, высота в em. */
[data-vibeui-block="kbd-003"] kbd{
display:inline-block;
height:1.5em;padding:0 0.4em;box-sizing:border-box;
background:var(--vibeui-kbd-003-key);
border:1px solid var(--vibeui-kbd-003-border);border-bottom-width:2px;
border-radius:0.35em;
font-family:inherit;font-size:0.85em;font-weight:650;line-height:1.4;
vertical-align:baseline;transform:translateY(0.05em);
white-space:nowrap;
}
[data-vibeui-block="kbd-003"] [data-part="combo"]{white-space:nowrap}
[data-vibeui-block="kbd-003"] [data-part="plus"]{opacity:.55;padding:0 0.15em}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="kbd-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Клавиша внутри строки текста без ломки интерлиньяжа абзаца.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Kbd003({
  before = "Нажмите",
  keys = ["⌘", "K"],
  after = "чтобы открыть поиск по каталогу — строка ввода появится поверх страницы.",
  className,
  style,
  ...props
}: Kbd003Props) {
  return (
    <>
      <style href="vibeui-kbd-003" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-vibeui-block="kbd-003"
        className={className}
        style={style as CSSProperties}
      >
        {before}{" "}
        <span data-part="combo">
          {keys.map((key, index) => (
            <span key={key}>
              {index > 0 ? <span data-part="plus">+</span> : null}
              <kbd>{key}</kbd>
            </span>
          ))}
        </span>{" "}
        {after}
      </p>
    </>
  )
}
