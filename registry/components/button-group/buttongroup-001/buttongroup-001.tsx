import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup001Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  options?: string[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — подложки нет, сегменты лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: сегментированный переключатель без единой строки JS.
// Состояние держат настоящие radio внутри fieldset: стрелки, Home/End и
// объявление «выбрано 2 из 3» приходят от браузера, а не от обработчиков.
// Границы сегментов схлопнуты отрицательным margin, поэтому между ними
// ровно один пиксель, а не два; выбранный и сфокусированный сегменты
// поднимаются z-index, иначе сосед срезает им рамку и обводку фокуса.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-001"]){
--vibeui-buttongroup-001-surface:transparent;
--vibeui-buttongroup-001-fg:light-dark(oklch(0.26 0.016 265),oklch(0.94 0.006 265));
--vibeui-buttongroup-001-muted:color-mix(in oklab,var(--vibeui-buttongroup-001-fg) 68%,transparent);
--vibeui-buttongroup-001-border:light-dark(oklch(0.88 0.008 265),oklch(0.37 0.012 265));
--vibeui-buttongroup-001-on:light-dark(oklch(0.96 0.035 265),oklch(0.32 0.06 265));
--vibeui-buttongroup-001-on-fg:light-dark(oklch(0.44 0.16 265),oklch(0.86 0.09 265));
--vibeui-buttongroup-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-buttongroup-001-radius:0.625rem;
--vibeui-buttongroup-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-001"]{color-scheme:dark}
[data-vibeui-block="buttongroup-001"]{
display:inline-block;box-sizing:border-box;min-inline-size:0;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-001-font);
}
[data-vibeui-block="buttongroup-001"] *{box-sizing:border-box}
/* Подпись группы нужна скринридеру, но не витрине: убираем её из потока
   через clip-path, а не display:none — иначе fieldset теряет имя. */
[data-vibeui-block="buttongroup-001"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-001"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-001"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-001-border);
background:var(--vibeui-buttongroup-001-surface);
color:var(--vibeui-buttongroup-001-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-001"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-001-radius);
border-end-start-radius:var(--vibeui-buttongroup-001-radius);
}
[data-vibeui-block="buttongroup-001"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-001-radius);
border-end-end-radius:var(--vibeui-buttongroup-001-radius);
}
[data-vibeui-block="buttongroup-001"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-001-fg)}
[data-vibeui-block="buttongroup-001"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;
opacity:0;cursor:pointer;
}
/* Выбранный сегмент поднят над соседями: иначе его акцентная рамка
   наполовину скрыта под рамкой следующего сегмента. */
[data-vibeui-block="buttongroup-001"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-001-on);
border-color:var(--vibeui-buttongroup-001-accent);
color:var(--vibeui-buttongroup-001-on-fg);
}
/* Обводка фокуса выходит за границу сегмента, поэтому z-index здесь ещё
   выше: сосед не должен её срезать. */
[data-vibeui-block="buttongroup-001"] [data-part="segment"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-001-accent);outline-offset:1px;
}
/* Состояние помечено не только цветом: у выбранного появляется точка. */
[data-vibeui-block="buttongroup-001"] [data-part="mark"]{
width:0.375rem;height:0.375rem;border-radius:9999px;
background:currentColor;opacity:0;
transition:opacity .16s ease;
}
[data-vibeui-block="buttongroup-001"] [data-part="segment"]:has(input:checked) [data-part="mark"]{opacity:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Все", "Активные", "Архив"]

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
 * Сегментированный переключатель на настоящих radio, без клиентского JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup001({
  options = DEFAULT_OPTIONS,
  defaultValue = "Активные",
  label = "Показывать",
  name = "buttongroup-001",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup001Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-001" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-001"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          {options.map((option) => (
            <label key={option} data-part="segment">
              <input
                type="radio"
                name={name}
                value={option}
                defaultChecked={option === defaultValue}
              />
              <span data-part="mark" aria-hidden="true" />
              {option}
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}
