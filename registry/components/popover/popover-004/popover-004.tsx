import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover004Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Заголовок группы сортировки. */
  sortsLabel?: string
  /** Заголовок группы колонок. */
  columnsLabel?: string
  /** Варианты сортировки: радиокнопки, выбран ровно один. */
  sorts?: string[]
  /** Колонки таблицы: чекбоксы, можно выключить любую. */
  columns?: string[]
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка панели и кнопки. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: настройки списка там, где сам список. Внутри две группы —
// сортировка радиокнопками и видимость колонок чекбоксами, — обе размечены
// fieldset с legend, поэтому скринридер объявляет назначение группы.
const STYLES = `
:where([data-vibeui-block="popover-004"]){
--vibeui-popover-004-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-004-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-004-muted:color-mix(in oklab,var(--vibeui-popover-004-fg) 68%,transparent);
--vibeui-popover-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-004-hover:light-dark(oklch(0.965 0.004 265),oklch(0.27 0.014 265));
--vibeui-popover-004-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-popover-004-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 72%));
--vibeui-popover-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-004"]{color-scheme:dark}
[data-vibeui-block="popover-004"]{
position:relative;display:inline-block;
font-family:var(--vibeui-popover-004-font);color:var(--vibeui-popover-004-fg);
}
[data-vibeui-block="popover-004"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-popover-004-border);
background:var(--vibeui-popover-004-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;
anchor-name:--vibeui-popover-004-anchor;
}
[data-vibeui-block="popover-004"] [data-part="trigger"]:hover{background:var(--vibeui-popover-004-hover)}
[data-vibeui-block="popover-004"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-004-accent);outline-offset:2px}
/* Раскладка панели живёт только в :popover-open — иначе браузерный
   display:none будет перебит и панель останется видимой всегда. */
[data-vibeui-block="popover-004"] [data-part="panel"]{
position:fixed;margin:0;padding:0.75rem;
width:min(16rem,100vw - 2rem);box-sizing:border-box;
border:1px solid var(--vibeui-popover-004-border);border-radius:0.875rem;
background:var(--vibeui-popover-004-bg);color:inherit;
box-shadow:0 24px 50px -30px var(--vibeui-popover-004-shadow);
position-anchor:--vibeui-popover-004-anchor;
top:anchor(bottom);right:anchor(right);margin-top:0.5rem;
}
[data-vibeui-block="popover-004"] [data-part="panel"]:popover-open{display:flex;flex-direction:column;gap:0.75rem}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-004"] [data-part="panel"]{position:absolute;inset:auto;top:calc(100% + 0.5rem);right:0}
}
[data-vibeui-block="popover-004"] fieldset{margin:0;padding:0;border:0;min-width:0}
[data-vibeui-block="popover-004"] legend{
padding:0;margin-bottom:0.375rem;float:left;width:100%;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-popover-004-muted);
}
/* legend с float:left заставляет следующих детей обтекать — сбрасываем. */
[data-vibeui-block="popover-004"] [data-part="group"]{clear:both;display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="popover-004"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.3125rem 0.375rem;margin:0 -0.375rem;border-radius:0.4375rem;
font-size:0.8125rem;line-height:1.35;
transition:background-color .14s ease;
}
[data-vibeui-block="popover-004"] [data-part="option"]:hover{background:var(--vibeui-popover-004-hover)}
[data-vibeui-block="popover-004"] [data-part="option"] input{accent-color:var(--vibeui-popover-004-accent);margin:0;flex:none}
[data-vibeui-block="popover-004"] [data-part="option"]:focus-within{outline:2px solid var(--vibeui-popover-004-accent);outline-offset:1px}
[data-vibeui-block="popover-004"] [data-part="divider"]{height:1px;background:var(--vibeui-popover-004-border);margin:0 -0.75rem}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя. */
[data-vibeui-block="popover-004"][data-open] [popover]{
display:block;position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SORTS = ["По дате изменения", "По названию", "По размеру"]
const DEFAULT_COLUMNS = ["Автор", "Размер", "Теги", "Статус"]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Поповер настроек списка: сортировка радиокнопками и видимость колонок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover004({
  label = "Вид списка",
  sortsLabel = "Сортировка",
  columnsLabel = "Колонки",
  sorts = DEFAULT_SORTS,
  columns = DEFAULT_COLUMNS,
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover004Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-popover-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-004"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" popoverTarget={`${id}-panel`}>
          <span aria-hidden="true">⋮</span>
          {label}
        </button>
        <div
          data-part="panel"
          id={`${id}-panel`}
          popover="auto"
          aria-label={label}
        >
          <fieldset>
            <legend>{sortsLabel}</legend>
            <div data-part="group">
              {sorts.map((sort, index) => (
                <label data-part="option" key={sort}>
                  <input
                    type="radio"
                    name={`${id}-sort`}
                    defaultChecked={index === 0}
                  />
                  {sort}
                </label>
              ))}
            </div>
          </fieldset>
          <div data-part="divider" />
          <fieldset>
            <legend>{columnsLabel}</legend>
            <div data-part="group">
              {columns.map((column, index) => (
                <label data-part="option" key={column}>
                  <input type="checkbox" defaultChecked={index < 2} />
                  {column}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  )
}
