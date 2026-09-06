import type { ComponentProps, CSSProperties } from "react"

export type Tooltip017Props = Omit<ComponentProps<"div">, "children"> & {
  /** Полные имена файлов: то, что не поместилось, покажет подсказка. */
  items?: string[]
  note?: string
  /** Показать подсказку второй строки принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: подсказка усечённого текста. Имя файла обрезано
// многоточием по ширине строки — это не решение, а компромисс вёрстки, и
// компромисс обязан оставаться читаемым: строка получает tabIndex, чтобы до
// неё доходил Tab, а не только курсор, и aria-describedby связывает её с
// полным текстом независимо от того, видна подсказка или нет.
const STYLES = `
:where([data-vibeui-block="tooltip-017"]){
--vibeui-tooltip-017-bg:transparent;
--vibeui-tooltip-017-fg:light-dark(oklch(0.25 0 265),oklch(0.93 0 265));
--vibeui-tooltip-017-muted:color-mix(in oklab,var(--vibeui-tooltip-017-fg) 68%,transparent);
--vibeui-tooltip-017-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-tooltip-017-face:light-dark(oklch(0.98 0 265),oklch(0.28 0 265));
--vibeui-tooltip-017-tip:light-dark(oklch(0.24 0 265),oklch(0.36 0 265));
--vibeui-tooltip-017-accent:light-dark(oklch(0.57 0.17 265),oklch(0.72 0.16 265));
--vibeui-tooltip-017-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
--vibeui-tooltip-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-017"]{color-scheme:dark}
[data-vibeui-block="tooltip-017"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:18rem;box-sizing:border-box;
font-family:var(--vibeui-tooltip-017-font);color:var(--vibeui-tooltip-017-fg);
}
[data-vibeui-block="tooltip-017"] [data-part="list"]{
margin:0;padding:0;list-style:none;
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="tooltip-017"] [data-part="item"]{position:relative;width:100%}
/* Само усечение: ширина строки фиксирована, а не резиновая — иначе
   демонстрировать обрезку нечем. */
[data-vibeui-block="tooltip-017"] [data-part="cell"]{
display:block;width:100%;box-sizing:border-box;
overflow:hidden;white-space:nowrap;text-overflow:ellipsis;
padding:0.5rem 0.6875rem;border-radius:0.5rem;
border:1px solid var(--vibeui-tooltip-017-border);
background:var(--vibeui-tooltip-017-face);
font-family:var(--vibeui-tooltip-017-mono);font-size:0.8125rem;
cursor:default;
}
[data-vibeui-block="tooltip-017"] [data-part="cell"]:focus-visible{outline:2px solid var(--vibeui-tooltip-017-accent);outline-offset:2px}
/* Подсказка занимает ту же ширину, что и строка, а не max-content: строка
   и так тянется на всю ширину компонента, и подсказка на всю ширину
   viewport только раздвинула бы страницу на 320px — width:100% относительно
   родительской строки держит подсказку внутри уже проверенной ширины. */
[data-vibeui-block="tooltip-017"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.4375rem);left:0;z-index:20;
width:100%;box-sizing:border-box;
padding:0.375rem 0.5625rem;border-radius:0.5rem;
/* Обе ветки --tip тёмные — плашка подсказки тёмная всегда, поэтому подпись светлая без light-dark(). */
background:var(--vibeui-tooltip-017-tip);color:oklch(0.98 0 265);
font-family:var(--vibeui-tooltip-017-mono);font-size:0.75rem;line-height:1.4;
overflow-wrap:break-word;
pointer-events:none;opacity:0;
transform:translateY(0.25rem);
transition:opacity .13s ease,transform .13s ease;
}
[data-vibeui-block="tooltip-017"] [data-part="tip"]::after{
content:"";position:absolute;left:0.875rem;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-017"] [data-part="item"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-017"] [data-part="item"]:focus-within [data-part="tip"]{
opacity:1;transform:translateY(0);
}
/* Витринный режим: раскрыта ровно одна подсказка — три сразу легли бы одна
   на другую. Вторая строка выбрана потому, что её плашка встаёт над первой
   и остаётся внутри уже проверенной ширины компонента. */
[data-vibeui-block="tooltip-017"][data-open="true"] [data-part="item"]:nth-of-type(2) [data-part="tip"]{
opacity:1;transform:translateY(0);
}
[data-vibeui-block="tooltip-017"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-tooltip-017-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "квартальный_отчёт_по_продажам_за_третий_квартал.xlsx",
  "макет_главного_экрана_финальная_версия.fig",
  "презентация.pdf",
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Список строк с усечённым текстом: многоточие обрезает имя по ширине
 * ячейки, а подсказка по наведению и по фокусу показывает его целиком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip017({
  items = DEFAULT_ITEMS,
  open = false,
  note = "Имя обрезано по ширине ячейки. Наведите курсор или перейдите табом, чтобы увидеть его целиком.",
  background = "",
  className,
  style,
  ...props
}: Tooltip017Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-017"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        <ul data-part="list">
          {items.map((item, index) => {
            const id = `vibeui-tooltip-017-${index}`

            return (
              <li data-part="item" key={item}>
                <span data-part="cell" tabIndex={0} aria-describedby={id}>
                  {item}
                </span>
                <span data-part="tip" role="tooltip" id={id}>
                  {item}
                </span>
              </li>
            )
          })}
        </ul>
        <p data-part="note">{note}</p>
      </div>
    </>
  )
}
