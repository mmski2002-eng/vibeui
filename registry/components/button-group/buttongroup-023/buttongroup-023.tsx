import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup023Props = Omit<
  ComponentProps<"fieldset">,
  "children"
> & {
  defaultValue?: string
  label?: string
  /** Подписи вариантов: компонент несёт русские, проект подставляет свои. */
  alignmentText?: Record<string, string>
  name?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор выравнивания помечается не заливкой, а подчёркивающей
// полосой под значком — так группа не спорит с текстом, над которым стоит.
// Полоса растёт из центра через scaleX, поэтому переключение читается как
// движение, а не как вспышка. Значки нарисованы «строками текста»: короткая
// и длинная линии прижаты к нужному краю, и по силуэту видно результат.
// Имена вариантов лежат настоящим текстом под clip-path — их находит поиск
// по странице, в отличие от aria-label.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="buttongroup-023"]){
--vibeui-buttongroup-023-surface:transparent;
--vibeui-buttongroup-023-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-023-muted:color-mix(in oklab,var(--vibeui-buttongroup-023-fg) 68%,transparent);
--vibeui-buttongroup-023-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-buttongroup-023-hover:light-dark(oklch(0.97 0 265),oklch(0.31 0 265));
--vibeui-buttongroup-023-accent:light-dark(oklch(0.5 0.17 300),oklch(0.78 0.14 300));
--vibeui-buttongroup-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-023"]{color-scheme:dark}
[data-vibeui-block="buttongroup-023"]{
box-sizing:border-box;display:inline-block;
margin:0;padding:0.25rem 0.375rem 0;border:0;
border-bottom:1px solid var(--vibeui-buttongroup-023-border);
background:var(--vibeui-buttongroup-023-surface);
font-family:var(--vibeui-buttongroup-023-font);
}
[data-vibeui-block="buttongroup-023"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-023"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="buttongroup-023"] [data-part="track"]{display:flex;gap:0.125rem}
[data-vibeui-block="buttongroup-023"] [data-part="segment"]{
position:relative;
display:inline-flex;align-items:center;justify-content:center;
width:2.25rem;height:2.25rem;border-radius:0.375rem 0.375rem 0 0;
color:var(--vibeui-buttongroup-023-muted);cursor:pointer;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="buttongroup-023"] input{
position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="buttongroup-023"] svg{
width:1.125rem;height:1.125rem;
stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;
}
[data-vibeui-block="buttongroup-023"] [data-part="name"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
/* Полоса живёт на псевдоэлементе и растёт из центра. */
[data-vibeui-block="buttongroup-023"] [data-part="segment"]::after{
content:"";position:absolute;left:0.25rem;right:0.25rem;bottom:-1px;height:2px;
border-radius:2px 2px 0 0;
background:var(--vibeui-buttongroup-023-accent);
transform:scaleX(0);transform-origin:center;
transition:transform .18s cubic-bezier(.2,.7,.3,1);
}
[data-vibeui-block="buttongroup-023"] [data-part="segment"]:hover{
color:var(--vibeui-buttongroup-023-fg);background:var(--vibeui-buttongroup-023-hover);
}
[data-vibeui-block="buttongroup-023"] [data-part="segment"]:has(input:checked){
color:var(--vibeui-buttongroup-023-accent);
}
[data-vibeui-block="buttongroup-023"] [data-part="segment"]:has(input:checked)::after{transform:scaleX(1)}
[data-vibeui-block="buttongroup-023"] [data-part="segment"]:has(input:focus-visible){
outline:2px solid var(--vibeui-buttongroup-023-accent);outline-offset:-2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-023"] *{animation:none!important;transition:none!important}}
`

const ALIGNMENTS = [
  { id: "start", path: "M4 6h16M4 12h10M4 18h13" },
  { id: "center", path: "M4 6h16M7 12h10M6 18h12" },
  { id: "end", path: "M4 6h16M10 12h10M7 18h13" },
  { id: "justify", path: "M4 6h16M4 12h16M4 18h16" },
]

const ALIGNMENT_LABEL: Record<string, string> = {
  start: "По левому краю",
  center: "По центру",
  end: "По правому краю",
  justify: "По ширине",
}

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
 * Выравнивание текста с подчёркивающей полосой вместо заливки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup023({
  defaultValue = "start",
  label = "Выравнивание абзаца",
  alignmentText = ALIGNMENT_LABEL,
  name = "buttongroup-023",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup023Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-023-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-023-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-023" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-023"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <form data-part="track">
          {ALIGNMENTS.map((alignment) => (
            <label key={alignment.id} data-part="segment">
              <input
                type="radio"
                name={name}
                value={alignment.id}
                defaultChecked={alignment.id === defaultValue}
              />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={alignment.path} />
              </svg>
              <span data-part="name">
                {alignmentText[alignment.id] ?? ALIGNMENT_LABEL[alignment.id]}
              </span>
            </label>
          ))}
        </form>
      </fieldset>
    </>
  )
}
