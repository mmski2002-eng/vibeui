import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar023Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  names?: string[]
  label?: string
  size?: "sm" | "md" | "lg"
}

// Идея компонента: аватар группового чата — четыре лица внутри одного круга.
// Стопка с перекрытием занимает ширину, которой в строке диалога нет, поэтому
// участники сложены в мозаику: круг остаётся круглым, а раскладка мозаики
// меняется от числа лиц (одно, два, три, четыре) — иначе при трёх участниках
// в углу висела бы пустая клетка. Пятый и дальше сворачиваются в счётчик.
const STYLES = `
:where([data-vibeui-block="avatar-023"]){
--vibeui-avatar-023-size:3rem;
--vibeui-avatar-023-bg:oklch(1 0 0);
--vibeui-avatar-023-fg:oklch(0.24 0.014 265);
--vibeui-avatar-023-muted:oklch(0.55 0.014 265);
--vibeui-avatar-023-border:oklch(0.91 0.006 265);
--vibeui-avatar-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-023"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;max-width:18rem;padding:0.5rem 0.75rem;
background:var(--vibeui-avatar-023-bg);
border:1px solid var(--vibeui-avatar-023-border);border-radius:0.75rem;
font-family:var(--vibeui-avatar-023-font);color:var(--vibeui-avatar-023-fg);
}
[data-vibeui-block="avatar-023"] *{box-sizing:border-box}
/* Мозаика в круге: клетки режутся overflow, зазор — цвет карточки. */
[data-vibeui-block="avatar-023"] [data-part="mosaic"]{
display:grid;flex:none;overflow:hidden;
grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;
gap:0.0625rem;background:var(--vibeui-avatar-023-bg);
width:var(--vibeui-avatar-023-size);height:var(--vibeui-avatar-023-size);
border-radius:9999px;
}
[data-vibeui-block="avatar-023"][data-count="1"] [data-part="mosaic"]{grid-template-columns:1fr;grid-template-rows:1fr}
[data-vibeui-block="avatar-023"][data-count="2"] [data-part="mosaic"]{grid-template-rows:1fr}
/* Три лица: первое занимает целую колонку, пустой клетки не остаётся. */
[data-vibeui-block="avatar-023"][data-count="3"] [data-part="tile"]:first-child{grid-row:span 2}
[data-vibeui-block="avatar-023"] [data-part="tile"]{
display:grid;place-items:center;min-width:0;
background:oklch(0.9 0.06 var(--vibeui-avatar-023-tile,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-023-tile,265));
font-size:calc(var(--vibeui-avatar-023-size) * 0.2);font-weight:700;line-height:1;
}
[data-vibeui-block="avatar-023"][data-count="1"] [data-part="tile"]{font-size:calc(var(--vibeui-avatar-023-size) * 0.34)}
[data-vibeui-block="avatar-023"] [data-rest="true"]{
background:oklch(0.93 0.008 265);color:oklch(0.42 0.014 265);
font-size:calc(var(--vibeui-avatar-023-size) * 0.18);
}
[data-vibeui-block="avatar-023"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="avatar-023"] [data-part="label"]{
font-size:0.875rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-023"] [data-part="count"]{
font-size:0.75rem;color:var(--vibeui-avatar-023-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-023"][data-size="sm"]{--vibeui-avatar-023-size:2.25rem}
[data-vibeui-block="avatar-023"][data-size="lg"]{--vibeui-avatar-023-size:4rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-023"] *{animation:none!important;transition:none!important}}
`

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
 * Аватар группового чата: до четырёх лиц мозаикой в одном круге.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar023({
  names = ["Анна Реброва", "Илья Мохов", "Ким Сон", "Пётр Гай", "Мария Лоза"],
  label = "Команда каталога",
  size = "md",
  className,
  style,
  ...props
}: Avatar023Props) {
  const rest = names.length - 4
  const shown = rest > 0 ? names.slice(0, 3) : names.slice(0, 4)

  return (
    <>
      <style href="vibeui-avatar-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-023"
        data-count={rest > 0 ? 4 : shown.length}
        data-size={size}
        className={className}
        style={style}
      >
        <span data-part="mosaic" aria-hidden="true">
          {shown.map((person) => (
            <span
              key={person}
              data-part="tile"
              style={
                {
                  "--vibeui-avatar-023-tile": hue(person),
                } as CSSProperties
              }
            >
              {initials(person)}
            </span>
          ))}
          {rest > 0 ? (
            <span data-part="tile" data-rest="true">
              +{rest + 1}
            </span>
          ) : null}
        </span>
        <span data-part="text">
          <span data-part="label">{label}</span>
          {/* Имена целиком — здесь, а не в мозаике: клетки нечитаемы. */}
          <span data-part="count">
            Участников {names.length}: {names.join(", ")}
          </span>
        </span>
      </div>
    </>
  )
}
