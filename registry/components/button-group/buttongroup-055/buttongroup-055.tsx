import { Fragment } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup055Cluster = {
  title: string
  tools: { id: string; label: string }[]
}

export type Buttongroup055Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  clusters?: Buttongroup055Cluster[]
  label?: string
  /** Пусто — заливки нет, панель ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: одна сцепка, разделённая на смысловые блоки. Внутри блока
// кнопки стоят вплотную, между блоками — линия и удвоенный зазор: близость
// сама сообщает, что «отменить/повторить» и «вырезать/копировать» — разные
// семьи. Каждый блок объявлен своим role="group" с именем, поэтому деление
// существует не только для глаз: скринридер объявит «История, группа» перед
// первой кнопкой. Разделитель — span с aria-hidden, а не border у кнопки:
// линия принадлежит промежутку, а не соседу.
const STYLES = `
:where([data-vibeui-block="buttongroup-055"]){
--vibeui-buttongroup-055-surface:transparent;
--vibeui-buttongroup-055-fg:light-dark(oklch(0.25 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-055-muted:light-dark(oklch(0.58 0.014 265),oklch(0.72 0.012 265));
--vibeui-buttongroup-055-border:light-dark(oklch(0.89 0.008 265),oklch(0.41 0.012 265));
--vibeui-buttongroup-055-hover:light-dark(oklch(0.96 0.005 265),oklch(0.34 0.01 265));
--vibeui-buttongroup-055-accent:light-dark(oklch(0.5 0.16 265),oklch(0.76 0.14 265));
--vibeui-buttongroup-055-radius:0.5rem;
--vibeui-buttongroup-055-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-055"]{
box-sizing:border-box;display:inline-flex;align-items:center;gap:0.5rem;
padding:0.25rem;
border:1px solid var(--vibeui-buttongroup-055-border);
border-radius:calc(var(--vibeui-buttongroup-055-radius) + 0.25rem);
background:var(--vibeui-buttongroup-055-surface);
font-family:var(--vibeui-buttongroup-055-font);
}
[data-vibeui-block="buttongroup-055"] *{box-sizing:border-box}
/* Внутри блока — вплотную, между блоками — линия и зазор. */
[data-vibeui-block="buttongroup-055"] [data-part="cluster"]{display:flex;gap:0}
[data-vibeui-block="buttongroup-055"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;
border:0;border-radius:var(--vibeui-buttongroup-055-radius);
background:transparent;
color:var(--vibeui-buttongroup-055-muted);
transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="buttongroup-055"] svg{
width:0.9375rem;height:0.9375rem;
stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-055"] button:hover{
background:var(--vibeui-buttongroup-055-hover);color:var(--vibeui-buttongroup-055-fg);
}
[data-vibeui-block="buttongroup-055"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-055-accent);outline-offset:1px;
color:var(--vibeui-buttongroup-055-accent);
}
[data-vibeui-block="buttongroup-055"] [data-part="rule"]{
width:1px;height:1.25rem;flex:none;
background:var(--vibeui-buttongroup-055-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-055"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<string, string> = {
  undo: "M9 7 5 11l4 4M5 11h9a5 5 0 0 1 0 10h-3",
  redo: "m15 7 4 4-4 4M19 11h-9a5 5 0 0 0 0 10h3",
  cut: "M6 4l12 14M18 4 6 18M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  paste: "M9 4h6v3H9zM7 5H5v15h14V5h-2",
  zoomIn: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4M8 11h6M11 8v6",
  zoomOut: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4M8 11h6",
}

const DEFAULT_CLUSTERS: Buttongroup055Cluster[] = [
  {
    title: "История",
    tools: [
      { id: "undo", label: "Отменить" },
      { id: "redo", label: "Повторить" },
    ],
  },
  {
    title: "Буфер обмена",
    tools: [
      { id: "cut", label: "Вырезать" },
      { id: "copy", label: "Копировать" },
      { id: "paste", label: "Вставить" },
    ],
  },
  {
    title: "Масштаб",
    tools: [
      { id: "zoomIn", label: "Приблизить" },
      { id: "zoomOut", label: "Отдалить" },
    ],
  },
]

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
 * Панель, разделённая на смысловые блоки: линия и зазор вместо сплошного ряда.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup055({
  clusters = DEFAULT_CLUSTERS,
  label = "Панель редактора",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup055Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-055-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-055-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-055" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-055"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        {clusters.map((cluster, index) => (
          <Fragment key={cluster.title}>
            {index > 0 ? <span data-part="rule" aria-hidden="true" /> : null}
            <div data-part="cluster" role="group" aria-label={cluster.title}>
              {cluster.tools.map((tool) => (
                <button key={tool.id} type="button" aria-label={tool.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={ICONS[tool.id] ?? ICONS.copy} />
                  </svg>
                </button>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </>
  )
}
