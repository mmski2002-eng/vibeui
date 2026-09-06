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
  cancelLabel?: string
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
--vibeui-popover-002-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-popover-002-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-popover-002-muted:color-mix(in oklab,var(--vibeui-popover-002-fg) 68%,transparent);
--vibeui-popover-002-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-popover-002-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-popover-002-accent:light-dark(oklch(0.53 0.16 155),oklch(0.75 0.15 155));
--vibeui-popover-002-on-accent:light-dark(oklch(0.99 0.01 155),oklch(0.18 0.03 155));
--vibeui-popover-002-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.02 0 265 / 72%));
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
height:2.375rem;padding:0 1rem;border:0;border-radius:0.625rem;
background:var(--vibeui-popover-002-accent);color:var(--vibeui-popover-002-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
box-shadow:0 1px 2px color-mix(in oklab,var(--vibeui-popover-002-shadow) 40%,transparent);
anchor-name:--vibeui-popover-002-anchor;
}
[data-vibeui-block="popover-002"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-002-accent);outline-offset:2px}
/* Панель под popover: раскладка задаётся ТОЛЬКО в :popover-open, иначе
   display в обычном правиле перебьёт браузерный display:none. */
[data-vibeui-block="popover-002"] [data-part="panel"]{
position:fixed;margin:0;padding:1rem;
width:min(19rem,100vw - 2rem);box-sizing:border-box;
border:1px solid var(--vibeui-popover-002-border);border-radius:1rem;
background:var(--vibeui-popover-002-bg);color:inherit;
box-shadow:0 24px 50px -28px var(--vibeui-popover-002-shadow);
position-anchor:--vibeui-popover-002-anchor;inset:auto;
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
[data-vibeui-block="popover-002"] [data-part="panel"]{position:fixed;inset:0;margin:auto}
}
[data-vibeui-block="popover-002"] [data-part="title"]{
margin:0 0 0.125rem;font-size:0.9375rem;font-weight:660;letter-spacing:-0.01em;
}
[data-vibeui-block="popover-002"] [data-part="row"]{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="popover-002"] [data-part="row"] label{
font-size:0.6875rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-popover-002-muted);
}
[data-vibeui-block="popover-002"] input,
[data-vibeui-block="popover-002"] select{
width:100%;box-sizing:border-box;height:2.375rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-popover-002-border);border-radius:0.625rem;
background:var(--vibeui-popover-002-field);color:inherit;
font:inherit;font-size:0.8125rem;
transition:border-color .14s ease,box-shadow .14s ease;
}
[data-vibeui-block="popover-002"] input::placeholder{color:color-mix(in oklab,var(--vibeui-popover-002-fg) 42%,transparent)}
[data-vibeui-block="popover-002"] input:hover,
[data-vibeui-block="popover-002"] select:hover{border-color:color-mix(in oklab,var(--vibeui-popover-002-fg) 26%,var(--vibeui-popover-002-border))}
[data-vibeui-block="popover-002"] input:focus-visible,
[data-vibeui-block="popover-002"] select:focus-visible{
outline:none;border-color:var(--vibeui-popover-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-popover-002-accent) 22%,transparent);
}
/* Подвал отделён чертой и отступом: кнопка, стоящая впритык к полю,
   читается как его часть, а не как отправка формы. */
[data-vibeui-block="popover-002"] [data-part="footer"]{
display:flex;align-items:center;justify-content:flex-end;gap:0.5rem;
margin-top:0.25rem;padding-top:0.75rem;
border-top:1px solid var(--vibeui-popover-002-border);
}
[data-vibeui-block="popover-002"] [data-part="cancel"],
[data-vibeui-block="popover-002"] [data-part="submit"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.25rem;padding:0.25rem 0.9375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
transition:filter .14s ease,background-color .14s ease;
}
[data-vibeui-block="popover-002"] [data-part="cancel"]{
border:1px solid var(--vibeui-popover-002-border);
background:transparent;color:var(--vibeui-popover-002-muted);
}
[data-vibeui-block="popover-002"] [data-part="cancel"]:hover{color:var(--vibeui-popover-002-fg);background:var(--vibeui-popover-002-field)}
[data-vibeui-block="popover-002"] [data-part="submit"]{
border:0;background:var(--vibeui-popover-002-accent);color:var(--vibeui-popover-002-on-accent);
box-shadow:0 1px 2px color-mix(in oklab,var(--vibeui-popover-002-shadow) 45%,transparent);
}
[data-vibeui-block="popover-002"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="popover-002"] [data-part="cancel"]:focus-visible,
[data-vibeui-block="popover-002"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-popover-002-accent);outline-offset:2px}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя.
   Только пока popover закрыт: у открытого положение задаёт верхний слой,
   и static отправил бы панель в левый верхний угол экрана. */
[data-vibeui-block="popover-002"][data-open] [popover]:not(:popover-open){
display:flex;flex-direction:column;gap:0.625rem;position:static;inset:auto;margin:0.5rem 0 0;
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
  cancelLabel = "Отмена",
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
          <div data-part="footer">
            <button
              type="button"
              data-part="cancel"
              popoverTarget={`${id}-panel`}
              popoverTargetAction="hide"
            >
              {cancelLabel}
            </button>
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
      </div>
    </>
  )
}
