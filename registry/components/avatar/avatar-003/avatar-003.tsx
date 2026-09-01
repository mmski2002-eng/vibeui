import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar003Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  names?: string[]
  visible?: number
  size?: "sm" | "md" | "lg"
  label?: string
}

// Идея компонента: стопка участников. Перекрытие идёт отрицательным margin, а
// не позиционированием, поэтому ширина стопки честная и её можно поставить в
// строку текста. Порядок наложения обратный — первый аватар лежит поверх
// остальных, иначе стопка читается справа налево.
const STYLES = `
:where([data-vibeui-block="avatar-003"]){
--vibeui-avatar-003-size:2.25rem;
--vibeui-avatar-003-overlap:0.75rem;
--vibeui-avatar-003-ring:light-dark(oklch(1 0 0),oklch(0.19 0.01 265));
--vibeui-avatar-003-more-bg:oklch(0.94 0.006 265);
--vibeui-avatar-003-more-fg:oklch(0.38 0.014 265);
--vibeui-avatar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-003"]{
display:inline-flex;align-items:center;vertical-align:middle;
font-family:var(--vibeui-avatar-003-font);
}
[data-vibeui-block="avatar-003"][data-size="sm"]{--vibeui-avatar-003-size:1.75rem;--vibeui-avatar-003-overlap:0.625rem}
[data-vibeui-block="avatar-003"][data-size="lg"]{--vibeui-avatar-003-size:3rem;--vibeui-avatar-003-overlap:1rem}
[data-vibeui-block="avatar-003"] [data-part="item"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-003-size);height:var(--vibeui-avatar-003-size);
border-radius:9999px;box-shadow:0 0 0 2px var(--vibeui-avatar-003-ring);
background:oklch(0.92 0.05 var(--vibeui-avatar-003-hue,250));
color:oklch(0.38 0.09 var(--vibeui-avatar-003-hue,250));
font-size:calc(var(--vibeui-avatar-003-size) * 0.34);font-weight:650;line-height:1;
user-select:none;
}
/* Перекрытие отрицательным margin: ширина стопки остаётся настоящей. */
[data-vibeui-block="avatar-003"] [data-part="item"] + [data-part="item"],
[data-vibeui-block="avatar-003"] [data-part="more"]{margin-left:calc(var(--vibeui-avatar-003-overlap) * -1)}
/* Первый аватар поверх второго, второй поверх третьего — стопка читается
   слева направо, как текст. */
[data-vibeui-block="avatar-003"] [data-part="item"]:nth-child(1){z-index:5}
[data-vibeui-block="avatar-003"] [data-part="item"]:nth-child(2){z-index:4}
[data-vibeui-block="avatar-003"] [data-part="item"]:nth-child(3){z-index:3}
[data-vibeui-block="avatar-003"] [data-part="item"]:nth-child(4){z-index:2}
[data-vibeui-block="avatar-003"] [data-part="item"]:nth-child(5){z-index:1}
[data-vibeui-block="avatar-003"] [data-part="more"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-003-size);height:var(--vibeui-avatar-003-size);
border-radius:9999px;box-shadow:0 0 0 2px var(--vibeui-avatar-003-ring);
background:var(--vibeui-avatar-003-more-bg);color:var(--vibeui-avatar-003-more-fg);
font-size:calc(var(--vibeui-avatar-003-size) * 0.3);font-weight:650;line-height:1;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-003"] [data-part="label"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Петрова",
  "Марк Ильин",
  "Мария Гурова",
  "Олег Дроздов",
  "Ирина Ким",
  "Пётр Волков",
]

// Оттенок из имени: FNV-1a, разложенный по двенадцати ступеням круга.
// Сумма кодов символов не годится — кириллические имена ложатся в один
// розовый сектор; ступени в 30° дают заведомо различимые цвета.
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
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

/**
 * Стопка участников с честной шириной и счётчиком остальных.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar003({
  names = DEFAULT_NAMES,
  visible = 4,
  size = "md",
  label = "Участники",
  className,
  style,
  ...props
}: Avatar003Props) {
  const shown = names.slice(0, Math.max(1, Math.min(5, visible)))
  const rest = names.length - shown.length

  return (
    <>
      <style href="vibeui-avatar-003" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="avatar-003"
        data-size={size}
        className={className}
        style={style as CSSProperties}
        role="group"
        aria-label={`${label}: ${names.join(", ")}`}
      >
        {shown.map((name) => (
          <span
            key={name}
            data-part="item"
            aria-hidden="true"
            style={{ "--vibeui-avatar-003-hue": hue(name) } as CSSProperties}
          >
            {initials(name)}
          </span>
        ))}
        {rest > 0 ? (
          <span data-part="more" aria-hidden="true">
            +{rest}
          </span>
        ) : null}
      </span>
    </>
  )
}
