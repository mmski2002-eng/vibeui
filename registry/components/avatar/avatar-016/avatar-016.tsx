import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar016Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  names?: string[]
  title?: string
  columns?: number
}

// Идея компонента: сетка лиц вместо стопки. Стопка экономит место, но прячет
// людей друг за другом; сетка нужна там, где важен состав, а не факт «их
// несколько». Ячейка задана auto-fill с minmax, поэтому число колонок считает
// браузер, а не пропс: при смене ширины ряды перестраиваются сами. Имена
// подписаны под лицами и обрезаются многоточием — обрезанное имя честнее
// подсказки, которая не появляется на телефоне.
const STYLES = `
:where([data-vibeui-block="avatar-016"]){
--vibeui-avatar-016-size:3rem;
--vibeui-avatar-016-bg:oklch(1 0 0);
--vibeui-avatar-016-fg:oklch(0.24 0.014 265);
--vibeui-avatar-016-muted:oklch(0.55 0.014 265);
--vibeui-avatar-016-border:oklch(0.91 0.006 265);
--vibeui-avatar-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="avatar-016"]{
box-sizing:border-box;width:100%;max-width:26rem;padding:0.875rem;
background:var(--vibeui-avatar-016-bg);
border:1px solid var(--vibeui-avatar-016-border);border-radius:0.875rem;
font-family:var(--vibeui-avatar-016-font);color:var(--vibeui-avatar-016-fg);
}
[data-vibeui-block="avatar-016"] *{box-sizing:border-box}
[data-vibeui-block="avatar-016"] h3{
margin:0 0 0.75rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="avatar-016"] [data-part="count"]{color:var(--vibeui-avatar-016-muted);font-weight:500}
/* auto-fill: число колонок считает браузер, ряды перестраиваются сами. */
[data-vibeui-block="avatar-016"] ul{
list-style:none;margin:0;padding:0;
display:grid;grid-template-columns:repeat(auto-fill,minmax(4.5rem,1fr));gap:0.75rem 0.5rem;
}
[data-vibeui-block="avatar-016"] li{
display:flex;flex-direction:column;align-items:center;gap:0.375rem;min-width:0;
}
[data-vibeui-block="avatar-016"] [data-part="face"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-avatar-016-size);height:var(--vibeui-avatar-016-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-016-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-016-hue,265));
font-size:calc(var(--vibeui-avatar-016-size) * 0.34);font-weight:700;
}
/* Имя обрезается многоточием: подсказка не появляется на телефоне. */
[data-vibeui-block="avatar-016"] [data-part="name"]{
max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.6875rem;color:var(--vibeui-avatar-016-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Реброва",
  "Илья Мохов",
  "Ким Сон",
  "Пётр Гай",
  "Мария Лоза",
  "Олег Дин",
  "Вера Найт",
  "Тимур Аль",
]

function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Сетка лиц: состав команды виден целиком, колонки считает браузер.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar016({
  names = DEFAULT_NAMES,
  title = "В проекте",
  className,
  style,
  ...props
}: Avatar016Props) {
  return (
    <>
      <style href="vibeui-avatar-016" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-016"
        className={className}
        style={style as CSSProperties}
      >
        <h3>
          {title} <span data-part="count">· {names.length}</span>
        </h3>
        <ul>
          {names.map((name) => (
            <li key={name}>
              <span
                data-part="face"
                aria-hidden="true"
                style={
                  { "--vibeui-avatar-016-hue": hue(name) } as CSSProperties
                }
              >
                {initials(name)}
              </span>
              <span data-part="name">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
