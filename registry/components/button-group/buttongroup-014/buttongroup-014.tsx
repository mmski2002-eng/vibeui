import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup014Option = {
  id: string
  label: string
}

export type Buttongroup014Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  options?: Buttongroup014Option[]
  defaultValue?: string
  label?: string
  name?: string
  /** Пусто — подложки нет, трек лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор одного варианта голыми значками, где подпись всё
// равно есть — она лежит настоящим текстом под clip-path (его читает
// скринридер и находит поиск по странице) и всплывает подсказкой снизу.
// Подсказка уходит вниз, а не вверх: группа такого вида обычно стоит в
// шапке, и вверху для неё места нет. Показ и по :hover, и по :focus-visible —
// с клавиатуры значки иначе неразличимы.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-014"]){
--vibeui-buttongroup-014-surface:transparent;
--vibeui-buttongroup-014-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-014-muted:color-mix(in oklab,var(--vibeui-buttongroup-014-fg) 68%,transparent);
--vibeui-buttongroup-014-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-014-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-buttongroup-014-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.63 0.17 39.8));
--vibeui-buttongroup-014-on-accent:oklch(0.99 0 265);
--vibeui-buttongroup-014-tip:light-dark(oklch(0.26 0 265),oklch(0.9 0 265));
--vibeui-buttongroup-014-on-tip:light-dark(oklch(0.99 0 0),oklch(0.21 0 265));
--vibeui-buttongroup-014-radius:0.625rem;
--vibeui-buttongroup-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-014"]{color-scheme:dark}
[data-vibeui-block="buttongroup-014"]{
box-sizing:border-box;display:inline-block;
margin:0;padding:0;border:0;
font-family:var(--vibeui-buttongroup-014-font);
}
[data-vibeui-block="buttongroup-014"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-014"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-014"] [data-part="track"]{
display:flex;isolation:isolate;
padding:0.1875rem;gap:0.1875rem;
border:1px solid var(--vibeui-buttongroup-014-border);
border-radius:calc(var(--vibeui-buttongroup-014-radius) + 0.1875rem);
background:var(--vibeui-buttongroup-014-surface);
}
[data-vibeui-block="buttongroup-014"] [data-part="segment"]{
position:relative;z-index:0;
display:inline-flex;align-items:center;justify-content:center;
width:2.375rem;height:2.375rem;
border-radius:var(--vibeui-buttongroup-014-radius);
color:var(--vibeui-buttongroup-014-muted);cursor:pointer;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-014"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-014"] svg{
width:1.125rem;height:1.125rem;
stroke:currentColor;fill:none;stroke-width:1.7;
stroke-linecap:round;stroke-linejoin:round;
}
/* Имя сегмента — настоящий текст, спрятанный из потока. */
[data-vibeui-block="buttongroup-014"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="buttongroup-014"] [data-part="segment"]:hover{
background:var(--vibeui-buttongroup-014-hover);color:var(--vibeui-buttongroup-014-fg);
}
[data-vibeui-block="buttongroup-014"] [data-part="segment"]:has(input:checked){
z-index:1;
background:var(--vibeui-buttongroup-014-accent);
color:var(--vibeui-buttongroup-014-on-accent);
}
[data-vibeui-block="buttongroup-014"] [data-part="segment"]:has(input:focus-visible){
z-index:2;
outline:2px solid var(--vibeui-buttongroup-014-accent);outline-offset:2px;
}
/* Видимая подсказка помечена aria-hidden: имя уже прочитано текстом выше. */
[data-vibeui-block="buttongroup-014"] [data-part="tip"]{
position:absolute;top:calc(100% + 0.5rem);left:50%;z-index:3;
padding:0.25rem 0.5rem;border-radius:0.375rem;
background:var(--vibeui-buttongroup-014-tip);
color:var(--vibeui-buttongroup-014-on-tip);
font-size:0.6875rem;font-weight:600;line-height:1.3;white-space:nowrap;
opacity:0;translate:-50% 0.25rem;pointer-events:none;
transition:opacity .14s ease,translate .14s ease;
}
[data-vibeui-block="buttongroup-014"] [data-part="segment"]:hover [data-part="tip"],
[data-vibeui-block="buttongroup-014"] [data-part="segment"]:has(input:focus-visible) [data-part="tip"]{
opacity:1;translate:-50% 0;
}
/* Без мыши наведения не бывает: на телефоне подписи видны сразу, иначе
   значение значков там просто не существует. */
@media (hover:none){
[data-vibeui-block="buttongroup-014"] [data-part="tip"]{opacity:1;translate:-50% 0}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-014"] *{animation:none!important;transition:none!important}}
`

const ICONS: Record<string, string> = {
  day: "M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l-1.5-1.5M19.5 19.5 18 18M18 6l1.5-1.5M4.5 19.5 6 18M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  week: "M4 5h16v15H4zM4 9h16M9 3v4M15 3v4",
  month: "M4 5h16v15H4zM4 10h16M8 14h3M8 17h8",
}

const DEFAULT_OPTIONS: Buttongroup014Option[] = [
  { id: "day", label: "Сутки" },
  { id: "week", label: "Неделя" },
  { id: "month", label: "Месяц" },
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
 * Выбор одного варианта голыми значками: имя лежит текстом, подсказка снизу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup014({
  options = DEFAULT_OPTIONS,
  defaultValue = "week",
  label = "Масштаб шкалы",
  name = "buttongroup-014",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup014Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-014-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-014" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-014"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          {options.map((option) => (
            <label key={option.id} data-part="segment">
              <input
                type="radio"
                name={name}
                value={option.id}
                defaultChecked={option.id === defaultValue}
              />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={ICONS[option.id] ?? ICONS.day} />
              </svg>
              <span data-part="name">{option.label}</span>
              <span data-part="tip" aria-hidden="true">
                {option.label}
              </span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}
