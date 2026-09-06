import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup056Option = {
  label: string
  hint: string
}

export type Buttongroup056Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  options?: Buttongroup056Option[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: подсказка у каждого сегмента, поставленная якорем CSS.
// Обычно такую подсказку позиционируют абсолютно внутри сегмента — и она
// обрезается первым же родителем с overflow. Здесь имя якоря выдаётся не
// всем сегментам сразу, а только тому, на который навели или который в
// фокусе: anchor-name живёт в правиле :hover / :has(:focus-visible), поэтому
// в каждый момент якорь ровно один, и общий узел подсказки может встать
// куда нужно. Всё завёрнуто в @supports: без поддержки якорей подсказка
// остаётся под группой обычным блоком, а не уезжает в угол экрана.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-056"]){
--vibeui-buttongroup-056-surface:transparent;
--vibeui-buttongroup-056-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-056-muted:color-mix(in oklab,var(--vibeui-buttongroup-056-fg) 68%,transparent);
--vibeui-buttongroup-056-border:light-dark(oklch(0.89 0 265),oklch(0.41 0 265));
--vibeui-buttongroup-056-on:light-dark(oklch(0.96 0 265),oklch(0.32 0.045 265));
--vibeui-buttongroup-056-accent:light-dark(oklch(0.5 0.16 265),oklch(0.76 0.14 265));
/* Подсказка контрастна к сцепке, а не к теме: в светлой она тёмная,
   в тёмной — светлая, иначе плашка сливается с панелью. */
--vibeui-buttongroup-056-tip:light-dark(oklch(0.26 0 265),oklch(0.92 0 265));
--vibeui-buttongroup-056-tip-fg:light-dark(oklch(0.985 0 265),oklch(0.22 0 265));
--vibeui-buttongroup-056-radius:0.625rem;
--vibeui-buttongroup-056-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-056"]{color-scheme:dark}
[data-vibeui-block="buttongroup-056"]{
box-sizing:border-box;display:inline-block;position:relative;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-056-font);
}
[data-vibeui-block="buttongroup-056"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-056"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-056"] [data-part="track"]{display:flex;isolation:isolate}
[data-vibeui-block="buttongroup-056"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;
height:2.25rem;padding:0 0.875rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-056-border);
background:var(--vibeui-buttongroup-056-surface);
color:var(--vibeui-buttongroup-056-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;cursor:pointer;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-056-radius);
border-end-start-radius:var(--vibeui-buttongroup-056-radius);
}
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:last-child{
border-start-end-radius:var(--vibeui-buttongroup-056-radius);
border-end-end-radius:var(--vibeui-buttongroup-056-radius);
}
[data-vibeui-block="buttongroup-056"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:hover{color:var(--vibeui-buttongroup-056-fg)}
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-056-on);
border-color:var(--vibeui-buttongroup-056-accent);
color:var(--vibeui-buttongroup-056-accent);
}
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:has(input:focus-visible){
z-index:2;outline:2px solid var(--vibeui-buttongroup-056-accent);outline-offset:1px;
}
/* Подсказка живёт у сегмента и объясняет, что именно он отфильтрует. */
[data-vibeui-block="buttongroup-056"] [data-part="tip"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:3;
max-width:15rem;padding:0.375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-buttongroup-056-tip);
color:var(--vibeui-buttongroup-056-tip-fg);
font-size:0.6875rem;font-weight:600;line-height:1.35;
opacity:0;translate:0 0.25rem;pointer-events:none;
transition:opacity .14s ease,translate .14s ease;
}
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:hover [data-part="tip"],
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:focus-within [data-part="tip"]{
opacity:1;translate:0 0;
}
/* Якорь выдаётся только активному сегменту: в каждый момент он ровно один. */
@supports (anchor-name: --vibeui-buttongroup-056-anchor){
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:hover,
[data-vibeui-block="buttongroup-056"] [data-part="segment"]:has(input:focus-visible){
anchor-name:--vibeui-buttongroup-056-anchor;
}
[data-vibeui-block="buttongroup-056"] [data-part="tip"]{
position:fixed;
position-anchor:--vibeui-buttongroup-056-anchor;
position-area:block-end span-inline-end;
margin-block-start:0.5rem;left:auto;top:auto;
position-try-fallbacks:flip-block;
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-056"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Buttongroup056Option[] = [
  { label: "Все", hint: "Ничего не отфильтровано: 128 записей" },
  { label: "Мои", hint: "Записи, где вы автор или ответственный" },
  { label: "Команда", hint: "Записи вашего отдела, включая чужие черновики" },
  { label: "Архив", hint: "Закрытые больше 90 дней назад, только чтение" },
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
 * Сегменты с подсказкой у каждого: якорь выдаётся активному сегменту.
 * Один файл, ноль зависимостей, серверный компонент.
 */
export function Buttongroup056({
  options = DEFAULT_OPTIONS,
  defaultValue = "Мои",
  label = "Область просмотра",
  name = "buttongroup-056",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup056Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-056-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-056-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-056" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-056"
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
              />
              <span>{option.label}</span>
              <span data-part="tip" aria-hidden="true">
                {option.hint}
              </span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}
