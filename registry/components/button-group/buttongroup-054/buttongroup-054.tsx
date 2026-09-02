import { Fragment } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup054Tool = {
  id: string
  label: string
}

export type Buttongroup054Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  tools?: Buttongroup054Tool[]
  label?: string
  /** Пусто — заливки нет, панель ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: очень плотная сцепка для строки таблицы — визуально
// 1.75rem, но с настоящей целью для пальца. Цель растянута псевдоэлементом:
// ::before лежит поверх кнопки и выходит за неё до 2.75rem, поэтому нажатие
// ловится за пределами рисунка, а раскладка не раздувается. Так решается
// конфликт «плотная панель против 44 пикселей на касание»: уменьшать надо
// рисунок, а не область нажатия. Кнопки перекрываются целями, поэтому
// расстояние между ними — не меньше 0.125rem, иначе цели съедят друг друга.
const STYLES = `
:where([data-vibeui-block="buttongroup-054"]){
--vibeui-buttongroup-054-surface:transparent;
--vibeui-buttongroup-054-fg:light-dark(oklch(0.25 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-054-muted:light-dark(oklch(0.6 0.014 265),oklch(0.71 0.012 265));
--vibeui-buttongroup-054-border:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.012 265));
--vibeui-buttongroup-054-hover:light-dark(oklch(0.955 0.005 265),oklch(0.34 0.01 265));
--vibeui-buttongroup-054-accent:light-dark(oklch(0.5 0.16 265),oklch(0.76 0.14 265));
--vibeui-buttongroup-054-radius:0.375rem;
--vibeui-buttongroup-054-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="buttongroup-054"]{
box-sizing:border-box;display:inline-flex;align-items:center;gap:0.125rem;
padding:0.1875rem;
border:1px solid var(--vibeui-buttongroup-054-border);
border-radius:calc(var(--vibeui-buttongroup-054-radius) + 0.1875rem);
background:var(--vibeui-buttongroup-054-surface);
font-family:var(--vibeui-buttongroup-054-font);
}
[data-vibeui-block="buttongroup-054"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-054"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;
border:0;border-radius:var(--vibeui-buttongroup-054-radius);
background:transparent;
color:var(--vibeui-buttongroup-054-muted);
transition:background-color .14s ease,color .14s ease;
}
/* Цель для пальца больше рисунка: растягиваем её псевдоэлементом. */
[data-vibeui-block="buttongroup-054"] button::before{
content:"";position:absolute;left:50%;top:50%;
width:2.75rem;height:2.75rem;translate:-50% -50%;
}
[data-vibeui-block="buttongroup-054"] svg{
width:0.875rem;height:0.875rem;
stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-054"] button:hover{
background:var(--vibeui-buttongroup-054-hover);color:var(--vibeui-buttongroup-054-fg);
}
[data-vibeui-block="buttongroup-054"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-054-accent);outline-offset:1px;
color:var(--vibeui-buttongroup-054-accent);
}
[data-vibeui-block="buttongroup-054"] [data-part="rule"]{
width:1px;height:1rem;flex:none;margin:0 0.125rem;
background:var(--vibeui-buttongroup-054-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-054"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<string, string> = {
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  pin: "M12 3v8M8 11h8l-1 4h-6zM12 15v6",
  more: "M12 6h.01M12 12h.01M12 18h.01",
}

const DEFAULT_TOOLS: Buttongroup054Tool[] = [
  { id: "edit", label: "Править" },
  { id: "copy", label: "Дублировать" },
  { id: "pin", label: "Закрепить" },
  { id: "more", label: "Ещё действия" },
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
 * Плотная панель значков, у которой цель для пальца больше самого рисунка.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup054({
  tools = DEFAULT_TOOLS,
  label = "Действия над строкой",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup054Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-054-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-054-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-054" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-054"
        className={className}
        style={palette}
        role="group"
        aria-label={label}
      >
        {tools.map((tool, index) => (
          <Fragment key={tool.id}>
            {index === tools.length - 1 ? (
              <span data-part="rule" aria-hidden="true" />
            ) : null}
            <button type="button" aria-label={tool.label}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={ICONS[tool.id] ?? ICONS.more} />
              </svg>
            </button>
          </Fragment>
        ))}
      </div>
    </>
  )
}
