import type { ComponentProps, CSSProperties } from "react"

export type KbdAnim001Props = Omit<ComponentProps<"section">, "children"> & {
  /** Подпись под клавиатурой: какую команду показывает демо. */
  caption?: string
  accent?: string
  /** Скрывает подпись под клавиатурой. */
  showCaption?: boolean
}

type Key = {
  label: string
  /** Относительная ширина клавиши в ряду, по умолчанию 1. */
  width?: number
  /** Порядок нажатия в комбинации: клавиши без него в демо не участвуют. */
  combo?: 1 | 2
}

// Идея: верхний правый угол клавиатуры — четыре ряда с числовым, двумя
// буквенными и нижним рядом. Комбинация Ctrl+P подсвечена: обе клавиши по
// очереди «вдавливаются» — акцентный фон и лёгкий translateY, — как будто
// кто-то демонстрирует шорткат. Остальные клавиши в демо не участвуют и
// остаются в состоянии покоя.
const ROWS: Key[][] = [
  [{ label: "8" }, { label: "9" }, { label: "0" }, { label: "–" }, { label: "=" }],
  [
    { label: "I" },
    { label: "O" },
    { label: "P", combo: 2 },
    { label: "[" },
    { label: "]" },
  ],
  [
    { label: "K" },
    { label: "L" },
    { label: ";" },
    { label: "'" },
    { label: "Enter", width: 1.7 },
  ],
  [
    { label: "Alt" },
    { label: "Ctrl", combo: 1 },
    { label: "Space", width: 2.6 },
  ],
]

const STYLES = `
:where([data-vibeui-block="kbd-anim-001"]){
--vibeui-kbd-anim-001-deck:light-dark(oklch(0.93 0.004 265),oklch(0.2 0.006 265));
--vibeui-kbd-anim-001-key:light-dark(oklch(0.99 0 0),oklch(0.27 0.006 265));
--vibeui-kbd-anim-001-fg:light-dark(oklch(0.24 0 0),oklch(0.94 0 0));
--vibeui-kbd-anim-001-muted:color-mix(in oklab,var(--vibeui-kbd-anim-001-fg) 58%,transparent);
--vibeui-kbd-anim-001-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-kbd-anim-001-edge:light-dark(oklch(0.78 0 0),oklch(0.4 0 0));
--vibeui-kbd-anim-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-kbd-anim-001-accent-fg:oklch(from var(--vibeui-kbd-anim-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-kbd-anim-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="kbd-anim-001"]{color-scheme:dark}
[data-vibeui-block="kbd-anim-001"]{
display:block;box-sizing:border-box;width:100%;max-width:18rem;margin:0;
color:var(--vibeui-kbd-anim-001-fg);font-family:var(--vibeui-kbd-anim-001-font);
}
[data-vibeui-block="kbd-anim-001"] *{box-sizing:border-box}
[data-vibeui-block="kbd-anim-001"] [data-part="deck"]{
display:flex;flex-direction:column;gap:0.375rem;padding:0.75rem;
border-radius:1rem;border:1px solid var(--vibeui-kbd-anim-001-border);
background:var(--vibeui-kbd-anim-001-deck);
}
[data-vibeui-block="kbd-anim-001"] [data-part="row"]{display:flex;gap:0.375rem}
[data-vibeui-block="kbd-anim-001"] [data-part="key"]{
display:flex;align-items:center;justify-content:center;flex:1 1 0;min-width:0;
height:1.875rem;border-radius:0.5rem;border:1px solid var(--vibeui-kbd-anim-001-border);
background:var(--vibeui-kbd-anim-001-key);color:var(--vibeui-kbd-anim-001-fg);
font-size:0.625rem;font-weight:600;letter-spacing:0.01em;user-select:none;
box-shadow:0 1px 0 var(--vibeui-kbd-anim-001-border);
}
[data-vibeui-block="kbd-anim-001"] [data-part="key"][data-combo]{
box-shadow:0 2px 0 var(--vibeui-kbd-anim-001-edge);
animation:vibeui-kbd-anim-001-press 3.6s ease-in-out infinite;
}
[data-vibeui-block="kbd-anim-001"] [data-part="key"][data-combo="1"]{animation-delay:0s}
[data-vibeui-block="kbd-anim-001"] [data-part="key"][data-combo="2"]{animation-delay:0.45s}
[data-vibeui-block="kbd-anim-001"] [data-part="caption"]{
display:flex;align-items:center;justify-content:center;gap:0.375rem;
margin:0.625rem 0 0;font-size:0.6875rem;color:var(--vibeui-kbd-anim-001-muted);
}
[data-vibeui-block="kbd-anim-001"] [data-part="caption"] b{
color:var(--vibeui-kbd-anim-001-fg);font-weight:650;
}
@keyframes vibeui-kbd-anim-001-press{
0%,100%{transform:translateY(0);background:var(--vibeui-kbd-anim-001-key);color:var(--vibeui-kbd-anim-001-fg);box-shadow:0 2px 0 var(--vibeui-kbd-anim-001-edge)}
8%,28%{transform:translateY(2px);background:var(--vibeui-kbd-anim-001-accent);color:var(--vibeui-kbd-anim-001-accent-fg);box-shadow:0 0 0 transparent}
38%{transform:translateY(0);background:var(--vibeui-kbd-anim-001-key);color:var(--vibeui-kbd-anim-001-fg);box-shadow:0 2px 0 var(--vibeui-kbd-anim-001-edge)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="kbd-anim-001"] [data-part="key"][data-combo]{animation:none}
}
`

/**
 * Угол клавиатуры с подсвеченной комбинацией Ctrl+P: клавиши комбинации
 * нажимаются по очереди в цикле. Один файл, ноль зависимостей, собственная
 * палитра.
 */
export function KbdAnim001({
  caption = "Быстрая команда",
  accent,
  showCaption = true,
  className,
  style,
  ...props
}: KbdAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-kbd-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-kbd-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="kbd-anim-001"
        data-slot="keyboard-half"
        className={className}
        style={palette}
      >
        <div data-part="deck" aria-hidden="true">
          {ROWS.map((row, rowIndex) => (
            <div data-part="row" key={rowIndex}>
              {row.map((key) => (
                <span
                  data-part="key"
                  data-combo={key.combo}
                  key={key.label}
                  style={{ flexGrow: key.width ?? 1 }}
                >
                  {key.label}
                </span>
              ))}
            </div>
          ))}
        </div>
        {showCaption ? (
          <p data-part="caption">
            {caption}
            <b>Ctrl + P</b>
          </p>
        ) : null}
      </section>
    </>
  )
}
