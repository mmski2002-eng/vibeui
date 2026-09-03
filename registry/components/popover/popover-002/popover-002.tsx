import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover002Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  label?: string
  title?: string
  fieldLabel?: string
  placeholder?: string
  submitLabel?: string
  /** Подпись выпадающего списка. */
  listLabel?: string
  /** Варианты списка, куда попадёт запись. */
  lists?: string[]
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка панели и полей. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: быстрое действие без ухода со страницы. В поповере живёт
// настоящая форма из двух полей — поле и список, — а кнопка отправки закрывает
// панель штатным popovertargetaction, поэтому обработчик закрытия не нужен.
const STYLES = `
:where([data-vibeui-block="popover-002"]){
--vibeui-popover-002-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-002-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-002-muted:color-mix(in oklab,var(--vibeui-popover-002-fg) 68%,transparent);
--vibeui-popover-002-border:light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-002-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.012 265));
--vibeui-popover-002-accent:light-dark(oklch(0.53 0.16 155),oklch(0.75 0.15 155));
--vibeui-popover-002-on-accent:light-dark(oklch(0.99 0.01 155),oklch(0.18 0.03 155));
--vibeui-popover-002-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 72%));
--vibeui-popover-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-002"]{color-scheme:dark}
[data-vibeui-block="popover-002"]{
position:relative;display:inline-block;
font-family:var(--vibeui-popover-002-font);color:var(--vibeui-popover-002-fg);
}
[data-vibeui-block="popover-002"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.9375rem;border:0;border-radius:0.625rem;
background:var(--vibeui-popover-002-accent);color:var(--vibeui-popover-002-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
anchor-name:--vibeui-popover-002-anchor;
}
[data-vibeui-block="popover-002"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-002-accent);outline-offset:2px}
/* Панель под popover: раскладка задаётся ТОЛЬКО в :popover-open, иначе
   display в обычном правиле перебьёт браузерный display:none. */
[data-vibeui-block="popover-002"] [data-part="panel"]{
position:fixed;margin:0;padding:0.875rem;
width:min(19rem,100vw - 2rem);box-sizing:border-box;
border:1px solid var(--vibeui-popover-002-border);border-radius:1rem;
background:var(--vibeui-popover-002-bg);color:inherit;
box-shadow:0 24px 50px -28px var(--vibeui-popover-002-shadow);
position-anchor:--vibeui-popover-002-anchor;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
transition:opacity .16s ease,translate .16s ease;
}
[data-vibeui-block="popover-002"] [data-part="panel"]:popover-open{
display:flex;flex-direction:column;gap:0.625rem;opacity:1;translate:0 0;
}
@starting-style{
[data-vibeui-block="popover-002"] [data-part="panel"]:popover-open{opacity:0;translate:0 -0.375rem}
}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-002"] [data-part="panel"]{position:absolute;inset:auto;top:calc(100% + 0.5rem);left:0}
}
[data-vibeui-block="popover-002"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="popover-002"] [data-part="row"]{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="popover-002"] [data-part="row"] label{font-size:0.75rem;font-weight:600;color:var(--vibeui-popover-002-muted)}
[data-vibeui-block="popover-002"] input,
[data-vibeui-block="popover-002"] select{
width:100%;box-sizing:border-box;height:2.125rem;padding:0 0.5625rem;
border:1px solid var(--vibeui-popover-002-border);border-radius:0.5rem;
background:var(--vibeui-popover-002-field);color:inherit;
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="popover-002"] input:focus-visible,
[data-vibeui-block="popover-002"] select:focus-visible{outline:2px solid var(--vibeui-popover-002-accent);outline-offset:1px}
[data-vibeui-block="popover-002"] [data-part="submit"]{
appearance:none;cursor:pointer;border:0;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.125rem;padding:0.25rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-popover-002-accent);color:var(--vibeui-popover-002-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="popover-002"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-popover-002-accent);outline-offset:2px}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя. */
[data-vibeui-block="popover-002"][data-open] [popover]{
display:block;position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LISTS = ["Входящие", "На неделю", "Когда-нибудь"]

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
 * Поповер с формой быстрого действия: поле, список и отправка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover002({
  label = "Новая задача",
  title = "Быстрая задача",
  fieldLabel = "Что сделать",
  placeholder = "Собрать отчёт за август",
  submitLabel = "Добавить",
  listLabel = "Список",
  lists = DEFAULT_LISTS,
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover002Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-popover-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-002"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" popoverTarget={`${id}-panel`}>
          <span aria-hidden="true">+</span>
          {label}
        </button>
        <div
          data-part="panel"
          id={`${id}-panel`}
          popover="auto"
          aria-label={title}
        >
          <p data-part="title">{title}</p>
          <div data-part="row">
            <label htmlFor={`${id}-what`}>{fieldLabel}</label>
            <input id={`${id}-what`} type="text" placeholder={placeholder} />
          </div>
          <div data-part="row">
            <label htmlFor={`${id}-list`}>{listLabel}</label>
            <select id={`${id}-list`} defaultValue={lists[0]}>
              {lists.map((list) => (
                <option key={list} value={list}>
                  {list}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            data-part="submit"
            popoverTarget={`${id}-panel`}
            popoverTargetAction="hide"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </>
  )
}
