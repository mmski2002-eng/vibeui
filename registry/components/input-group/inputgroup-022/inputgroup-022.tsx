"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup022Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  explanation?: string
  /** Подписи кнопки-подсказки: show и hide. */
  toggleText?: Record<string, string>
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const TOGGLE_TEXT: Record<string, string> = {
  show: "Показать пояснение",
  hide: "Скрыть пояснение",
}

// Идея компонента: пояснение не висит под полем постоянно и не выскакивает
// поповером поверх соседних элементов — оно раскрывается внутри потока по
// нажатию кнопки-подсказки и сдвигает то, что ниже, а не перекрывает его.
// Раскрытие анимировано через grid-template-rows (0fr → 1fr): высота auto
// нельзя анимировать напрямую, а этот приём анимирует её без измерения
// пикселей в JS.
const STYLES = `
:where([data-vibeui-block="inputgroup-022"]){
--vibeui-inputgroup-022-surface:transparent;
--vibeui-inputgroup-022-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-inputgroup-022-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-inputgroup-022-muted:color-mix(in oklab,var(--vibeui-inputgroup-022-fg) 68%,transparent);
--vibeui-inputgroup-022-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-inputgroup-022-fixed:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-inputgroup-022-panel:light-dark(oklch(0.97 0 275),oklch(0.3 0 275));
--vibeui-inputgroup-022-border:light-dark(oklch(0.86 0 265),oklch(0.4 0 265));
--vibeui-inputgroup-022-accent:light-dark(oklch(0.5 0.14 39.8),oklch(0.72 0.13 39.8));
--vibeui-inputgroup-022-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 275));
--vibeui-inputgroup-022-radius:0.75rem;
--vibeui-inputgroup-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-022"]{color-scheme:dark}
[data-vibeui-block="inputgroup-022"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-022-surface);
border:1px solid var(--vibeui-inputgroup-022-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-022-font);color:var(--vibeui-inputgroup-022-fg);
}
[data-vibeui-block="inputgroup-022"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-022"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-022"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-022"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-022-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-022"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-022-radius) 0 0 var(--vibeui-inputgroup-022-radius);
}
[data-vibeui-block="inputgroup-022"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-022-radius) var(--vibeui-inputgroup-022-radius) 0;
}
[data-vibeui-block="inputgroup-022"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-022"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-022-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-022-accent);
}
[data-vibeui-block="inputgroup-022"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-022-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-022"] [data-part="toggle"]{
appearance:none;flex:none;cursor:pointer;width:2.75rem;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-022-fixed);color:var(--vibeui-inputgroup-022-muted);
font-size:0.8125rem;font-weight:700;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-022"] [data-part="toggle"][aria-expanded="true"]{
background:var(--vibeui-inputgroup-022-accent);color:var(--vibeui-inputgroup-022-on-accent);
}
[data-vibeui-block="inputgroup-022"] [data-part="toggle"]:hover:not([aria-expanded="true"]){
background:color-mix(in oklab,var(--vibeui-inputgroup-022-accent) 14%,var(--vibeui-inputgroup-022-fixed));
color:var(--vibeui-inputgroup-022-fg);
}
[data-vibeui-block="inputgroup-022"] [data-part="explain"]{
display:grid;grid-template-rows:0fr;
transition:grid-template-rows .2s ease;
}
[data-vibeui-block="inputgroup-022"] [data-part="explain"][data-open="true"]{grid-template-rows:1fr}
[data-vibeui-block="inputgroup-022"] [data-part="explain-inner"]{
min-height:0;overflow:hidden;
}
[data-vibeui-block="inputgroup-022"] [data-part="explain"] p{
margin:0;padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-inputgroup-022-panel);
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-inputgroup-022-fg);
}
[data-vibeui-block="inputgroup-022"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-022-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-022"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Сцепка «поле + кнопка-подсказка», раскрывающая пояснение в потоке под
 * рамкой без перекрытия соседних элементов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup022({
  name = "vat",
  label = "Номер плательщика НДС",
  placeholder = "Например, RU123456789",
  defaultValue = "",
  explanation = "Номер указывают в формате страны регистрации: код страны и от 9 до 12 цифр без пробелов. Он нужен для корректного оформления счёта на юридическое лицо.",
  toggleText = TOGGLE_TEXT,
  hint = "Кнопка справа раскрывает пояснение, не закрывая поле и не выезжая поверх соседних элементов.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup022Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const explainId = `${id}-explain`

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-022-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="input-group"
        data-vibeui-block="inputgroup-022"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            value={value}
            aria-describedby={`${explainId} ${id}-hint`}
            onChange={(event) => setValue(event.target.value)}
          />
          <button
            type="button"
            data-part="toggle"
            aria-expanded={open}
            aria-controls={explainId}
            aria-label={
              open
                ? (toggleText.hide ?? TOGGLE_TEXT.hide)
                : (toggleText.show ?? TOGGLE_TEXT.show)
            }
            onClick={() => setOpen((current) => !current)}
          >
            ?
          </button>
        </div>
        <div data-part="explain" data-open={open} id={explainId}>
          <div data-part="explain-inner">
            <p aria-hidden={!open}>{explanation}</p>
          </div>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
