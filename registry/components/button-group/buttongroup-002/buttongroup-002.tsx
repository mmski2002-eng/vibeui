import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup002Props = Omit<ComponentProps<"div">, "children"> & {
  actions?: string[]
  label?: string
  size?: "compact" | "regular"
  /** Пусто — подложки нет, группа лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: группа связанных действий выглядит одной деталью, а не
// тремя кнопками рядом. Рамка ровно одна — на контейнере; разделители внутри
// рисуются border-inline-start у всех детей, кроме первого. Так между
// соседями не бывает двойной линии, а скругления берутся с контейнера через
// overflow:hidden — детям radius задавать не нужно вовсе.
const STYLES = `
:where([data-vibeui-block="buttongroup-002"]){
--vibeui-buttongroup-002-surface:transparent;
--vibeui-buttongroup-002-fg:light-dark(oklch(0.27 0.016 265),oklch(0.94 0.006 265));
--vibeui-buttongroup-002-muted:color-mix(in oklab,var(--vibeui-buttongroup-002-fg) 68%,transparent);
--vibeui-buttongroup-002-border:light-dark(oklch(0.88 0.008 265),oklch(0.37 0.012 265));
--vibeui-buttongroup-002-hover:light-dark(oklch(0.965 0.004 265),oklch(0.3 0.012 265));
--vibeui-buttongroup-002-press:light-dark(oklch(0.93 0.006 265),oklch(0.35 0.014 265));
--vibeui-buttongroup-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-buttongroup-002-radius:0.625rem;
--vibeui-buttongroup-002-height:2.25rem;
--vibeui-buttongroup-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-002"]{color-scheme:dark}
[data-vibeui-block="buttongroup-002"]{
box-sizing:border-box;display:inline-flex;isolation:isolate;
max-inline-size:100%;overflow-x:auto;
border:1px solid var(--vibeui-buttongroup-002-border);
border-radius:var(--vibeui-buttongroup-002-radius);
background:var(--vibeui-buttongroup-002-surface);
font-family:var(--vibeui-buttongroup-002-font);
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 6%);
}
[data-vibeui-block="buttongroup-002"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-002"][data-size="compact"]{--vibeui-buttongroup-002-height:1.875rem}
[data-vibeui-block="buttongroup-002"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
height:var(--vibeui-buttongroup-002-height);padding:0 0.875rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-002-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease,color .16s ease;
}
/* Разделитель — левая граница соседа, а не рамка у каждой кнопки:
   две соседние рамки дают линию в два пикселя. */
[data-vibeui-block="buttongroup-002"] button + button{
border-inline-start:1px solid var(--vibeui-buttongroup-002-border);
}
[data-vibeui-block="buttongroup-002"] button:first-child{
border-start-start-radius:calc(var(--vibeui-buttongroup-002-radius) - 1px);
border-end-start-radius:calc(var(--vibeui-buttongroup-002-radius) - 1px);
}
[data-vibeui-block="buttongroup-002"] button:last-child{
border-start-end-radius:calc(var(--vibeui-buttongroup-002-radius) - 1px);
border-end-end-radius:calc(var(--vibeui-buttongroup-002-radius) - 1px);
}
[data-vibeui-block="buttongroup-002"] button:hover{
background:var(--vibeui-buttongroup-002-hover);
color:var(--vibeui-buttongroup-002-fg);
}
[data-vibeui-block="buttongroup-002"] button:active{background:var(--vibeui-buttongroup-002-press)}
/* Кнопка с фокусом поднимается над соседями: рамка группы и разделители
   иначе срезают обводку по краям. */
[data-vibeui-block="buttongroup-002"] button:focus-visible{
z-index:1;
outline:2px solid var(--vibeui-buttongroup-002-accent);outline-offset:-2px;
color:var(--vibeui-buttongroup-002-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS = ["Скопировать", "Продублировать", "Экспорт"]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Группа действий с одной общей рамкой и разделителями внутри.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup002({
  actions = DEFAULT_ACTIONS,
  label = "Действия над документом",
  size = "regular",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup002Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-002"
        data-size={size}
        role="group"
        aria-label={label}
        className={className}
        style={palette}
      >
        {actions.map((action) => (
          <button key={action} type="button">
            {action}
          </button>
        ))}
      </div>
    </>
  )
}
