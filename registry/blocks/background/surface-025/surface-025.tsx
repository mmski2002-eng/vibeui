import type { CSSProperties, ReactNode } from "react"
import { Caption001 } from "@/registry/components/typography/caption-001/caption-001"

export type Surface025Props = {
  /** Разлиновка: клетка, линейка или точки в узлах. */
  pattern?: "grid" | "lines" | "dots"
  /** Шаг клетки в пикселях. */
  cell?: number
  /** Каждая N-я линия темнее, как крупная клетка. 0 — без неё. */
  major?: number
  /** Приглушение линий: едва заметные, мягкие или отчётливые. */
  strength?: "faint" | "soft" | "clear"
  /** Красная линия полей слева, как в тетради. */
  margin?: boolean
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  /** Цвет бумаги. */
  paper?: string
  /** Цвет линий. */
  ink?: string
  /** Демонстрационное содержимое: надпись, заголовок, подпись. */
  eyebrow?: string
  title?: string
  note?: string
  /** Своё содержимое поверх листа. */
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

// Тетрадный лист: бумага с разлиновкой из CSS-градиентов, ничего не
// считает и не грузит. Крупная клетка — второй слой градиентов шагом
// major×cell. Содержимое кладётся поверх и может занимать любую высоту:
// лист — обёртка, а не картинка фиксированного размера.
const STRENGTH = {
  faint: { line: 0.055, bold: 0.095 },
  soft: { line: 0.085, bold: 0.14 },
  clear: { line: 0.13, bold: 0.2 },
} as const

const STYLES = `
:where([data-vibeui-block="surface-025"]){
--vibeui-surface-025-paper:light-dark(#faf7f2,#1c1a18);
--vibeui-surface-025-ink:light-dark(rgb(70 95 140),rgb(150 170 210));
--vibeui-surface-025-fg:light-dark(#1c1917,#f2efe9);
--vibeui-surface-025-muted:light-dark(color-mix(in oklab,#1c1917 55%,#faf7f2),color-mix(in oklab,#f2efe9 60%,#1c1a18));
--vibeui-surface-025-margin:light-dark(rgb(214 84 84 / 0.5),rgb(240 120 120 / 0.45));
--vibeui-surface-025-cell:24px;
--vibeui-surface-025-major:5;
--vibeui-surface-025-line:0.085;
--vibeui-surface-025-bold:0.14;
--vibeui-surface-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="surface-025"]{color-scheme:dark}
:where([data-vibeui-block="surface-025"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="surface-025"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="surface-025"]{
position:relative;isolation:isolate;box-sizing:border-box;display:block;
color:var(--vibeui-surface-025-fg);font-family:var(--vibeui-surface-025-font);
background-color:var(--vibeui-surface-025-paper);
--vibeui-surface-025-l:color-mix(in srgb,var(--vibeui-surface-025-ink) calc(var(--vibeui-surface-025-line) * 100%),transparent);
--vibeui-surface-025-b:color-mix(in srgb,var(--vibeui-surface-025-ink) calc(var(--vibeui-surface-025-bold) * 100%),transparent);
--vibeui-surface-025-big:calc(var(--vibeui-surface-025-cell) * var(--vibeui-surface-025-major));
}
/* Обёртка: свои части — только прямые дети, иначе стили утекают во
   вложенные блоки с такими же именами частей (margin, title…). */
/* Клетка: две сетки — тонкая шагом cell и крупная шагом major×cell. */
[data-vibeui-block="surface-025"][data-pattern="grid"]{
background-image:
linear-gradient(to right,var(--vibeui-surface-025-b) 1px,transparent 1px),
linear-gradient(to bottom,var(--vibeui-surface-025-b) 1px,transparent 1px),
linear-gradient(to right,var(--vibeui-surface-025-l) 1px,transparent 1px),
linear-gradient(to bottom,var(--vibeui-surface-025-l) 1px,transparent 1px);
background-size:var(--vibeui-surface-025-big) var(--vibeui-surface-025-big),var(--vibeui-surface-025-big) var(--vibeui-surface-025-big),var(--vibeui-surface-025-cell) var(--vibeui-surface-025-cell),var(--vibeui-surface-025-cell) var(--vibeui-surface-025-cell);
}
[data-vibeui-block="surface-025"][data-pattern="lines"]{
background-image:
linear-gradient(to bottom,var(--vibeui-surface-025-b) 1px,transparent 1px),
linear-gradient(to bottom,var(--vibeui-surface-025-l) 1px,transparent 1px);
background-size:100% var(--vibeui-surface-025-big),100% var(--vibeui-surface-025-cell);
}
[data-vibeui-block="surface-025"][data-pattern="dots"]{
background-image:
radial-gradient(circle,var(--vibeui-surface-025-b) 1.2px,transparent 1.6px),
radial-gradient(circle,var(--vibeui-surface-025-l) 1px,transparent 1.4px);
background-size:var(--vibeui-surface-025-big) var(--vibeui-surface-025-big),var(--vibeui-surface-025-cell) var(--vibeui-surface-025-cell);
background-position:0.5px 0.5px;
}
[data-vibeui-block="surface-025"][data-major="0"]{--vibeui-surface-025-b:transparent}
/* Поля: красная вертикаль на четвёртой клетке от края. */
[data-vibeui-block="surface-025"] > [data-part="margin"]{position:absolute;top:0;bottom:0;left:calc(var(--vibeui-surface-025-cell) * 4 + 0.5px);width:1px;background:var(--vibeui-surface-025-margin);pointer-events:none}
`

/** Тетрадный лист: бумага в клетку, линейку или точки — обёртка для любого содержимого. */
export function Surface025({
  pattern = "grid",
  cell = 24,
  major = 5,
  strength = "soft",
  margin = false,
  tone = "auto",
  paper,
  ink,
  eyebrow = "Тетрадный лист",
  title = "Клетка, линейка или точки",
  note = "Разлиновка из CSS-градиентов: ничего не грузит и не считает. Шаг, приглушение и крупная клетка — пропсами; содержимое кладётся поверх.",
  children,
  className,
  style,
}: Surface025Props) {
  const level = STRENGTH[strength] ?? STRENGTH.soft
  const palette = {
    "--vibeui-surface-025-cell": `${Math.max(8, cell)}px`,
    "--vibeui-surface-025-major": String(Math.max(0, major) || 1),
    "--vibeui-surface-025-line": String(level.line),
    "--vibeui-surface-025-bold": String(level.bold),
    ...(paper ? { "--vibeui-surface-025-paper": paper } : null),
    ...(ink ? { "--vibeui-surface-025-ink": ink } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-surface-025" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="surface-025"
        data-pattern={pattern}
        data-major={major > 0 ? undefined : "0"}
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        {margin ? <span data-part="margin" aria-hidden="true" /> : null}
        {children ?? (
          <Caption001 data-part="demo" eyebrow={eyebrow} title={title} note={note} />
        )}
      </div>
    </>
  )
}
