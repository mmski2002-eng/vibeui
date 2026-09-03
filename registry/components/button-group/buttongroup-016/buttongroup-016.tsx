import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup016Option = {
  label: string
  locked?: boolean
}

export type Buttongroup016Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  options?: Buttongroup016Option[]
  defaultValue?: string
  reason?: string
  reasonId?: string
  label?: string
  name?: string
  /** Пусто — подложки нет, сегменты лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: недоступный вариант, который объясняет себя. Обычно
// такой сегмент просто гасят прозрачностью — и пользователь остаётся с
// вопросом «почему». Здесь запертый сегмент несёт значок замка, а причина
// лежит строкой под группой и связана с input через aria-describedby,
// поэтому звучит вслух сразу после имени варианта. Заперт сегмент честным
// атрибутом disabled: визуальная «серость» без него оставляет вариант
// кликабельным для клавиатуры.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-016"]){
--vibeui-buttongroup-016-surface:transparent;
--vibeui-buttongroup-016-fg:light-dark(oklch(0.26 0.016 265),oklch(0.94 0.006 265));
--vibeui-buttongroup-016-muted:color-mix(in oklab,var(--vibeui-buttongroup-016-fg) 68%,transparent);
--vibeui-buttongroup-016-locked:light-dark(oklch(0.72 0.01 265),oklch(0.55 0.012 265));
--vibeui-buttongroup-016-border:light-dark(oklch(0.89 0.008 265),oklch(0.37 0.012 265));
--vibeui-buttongroup-016-stripe-a:light-dark(oklch(0.98 0.002 265),oklch(0.28 0.007 265));
--vibeui-buttongroup-016-stripe-b:light-dark(oklch(0.955 0.003 265),oklch(0.245 0.007 265));
--vibeui-buttongroup-016-on:light-dark(oklch(0.96 0.035 285),oklch(0.3 0.05 285));
--vibeui-buttongroup-016-accent:light-dark(oklch(0.52 0.16 285),oklch(0.75 0.14 285));
--vibeui-buttongroup-016-radius:0.625rem;
--vibeui-buttongroup-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-016"]{color-scheme:dark}
[data-vibeui-block="buttongroup-016"]{
box-sizing:border-box;display:inline-block;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-016-font);
}
[data-vibeui-block="buttongroup-016"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-016"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-016"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-016-border);
background:var(--vibeui-buttongroup-016-surface);
color:var(--vibeui-buttongroup-016-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-016-radius);
border-end-start-radius:var(--vibeui-buttongroup-016-radius);
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-016-radius);
border-end-end-radius:var(--vibeui-buttongroup-016-radius);
}
[data-vibeui-block="buttongroup-016"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:inherit;
}
[data-vibeui-block="buttongroup-016"] svg{
width:0.875rem;height:0.875rem;flex:none;
stroke:currentColor;fill:none;stroke-width:1.8;
stroke-linecap:round;stroke-linejoin:round;
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:hover:not(:has(input:disabled)){
color:var(--vibeui-buttongroup-016-fg);
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-016-on);
border-color:var(--vibeui-buttongroup-016-accent);
color:var(--vibeui-buttongroup-016-accent);
}
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-016-accent);outline-offset:1px;
}
/* Полосатая заливка добавляет к бледности второй, не цветовой признак. */
[data-vibeui-block="buttongroup-016"] [data-part="segment"]:has(input:disabled){
cursor:not-allowed;
color:var(--vibeui-buttongroup-016-locked);
background:repeating-linear-gradient(-45deg,var(--vibeui-buttongroup-016-stripe-a) 0 6px,var(--vibeui-buttongroup-016-stripe-b) 6px 12px);
}
[data-vibeui-block="buttongroup-016"] [data-part="reason"]{
display:flex;align-items:flex-start;gap:0.375rem;
margin:0.5rem 0 0;max-width:22rem;
color:var(--vibeui-buttongroup-016-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-016"] [data-part="reason"] svg{margin-top:0.125rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-016"] *{animation:none!important;transition:none!important}}
`

const LOCK = "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5zM12 14v2"

const DEFAULT_OPTIONS: Buttongroup016Option[] = [
  { label: "Черновик" },
  { label: "На проверке" },
  { label: "Опубликовано", locked: true },
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
 * Группа с запертым вариантом, который объясняет причину недоступности.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup016({
  options = DEFAULT_OPTIONS,
  defaultValue = "На проверке",
  reason = "Публикацию открывает редактор: у вашей роли нет этого права.",
  reasonId = "buttongroup-016-reason",
  label = "Состояние материала",
  name = "buttongroup-016",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup016Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-016-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-016" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-016"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          {options.map((option) => (
            <label key={option.label} data-part="segment">
              <input
                type="radio"
                name={name}
                value={option.label}
                defaultChecked={option.label === defaultValue}
                disabled={option.locked}
                aria-describedby={option.locked ? reasonId : undefined}
              />
              {option.locked ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={LOCK} />
                </svg>
              ) : null}
              <span>{option.label}</span>
            </label>
          ))}
        </form>
        <p data-part="reason" id={reasonId}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={LOCK} />
          </svg>
          <span>{reason}</span>
        </p>
      </fieldset>
    </>
  )
}
