import type { ComponentProps, CSSProperties } from "react"

export type Avatar003Props = Omit<ComponentProps<"ul">, "children"> & {
  names?: string[]
  photos?: string[]
  visible?: number
  size?: "sm" | "md" | "lg"
  label?: string
  /**
   * Кружки называют себя по наведению и по фокусу. Стоит включать там, где
   * стопка отвечает на вопрос «кто это», а не просто показывает, что людей
   * несколько.
   */
  tooltip?: boolean
  /** Клик по участнику: открыть профиль, отфильтровать список, что угодно. */
  onSelect?: (name: string) => void
}

// Идея компонента: стопка участников. Перекрытие идёт отрицательным margin, а
// не позиционированием, поэтому ширина стопки честная и её можно поставить в
// строку текста. Порядок наложения обратный — первый аватар лежит поверх
// остальных, иначе стопка читается справа налево. С включённым tooltip кружки
// становятся кнопками и называют себя: подпись появляется и по наведению, и по
// фокусу — на клавиатуре и на тач-экране наведения не существует.
const STYLES = `
:where([data-vibeui-block="avatar-003"]){
--vibeui-avatar-003-size:2.5rem;
--vibeui-avatar-003-overlap:0.625rem;
--vibeui-avatar-003-ring:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-avatar-003-more-bg:light-dark(oklch(0.94 0 265),oklch(0.31 0 265));
--vibeui-avatar-003-more-fg:light-dark(oklch(0.38 0 265),oklch(0.88 0 265));
--vibeui-avatar-003-tip-bg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-avatar-003-tip-fg:light-dark(oklch(0.98 0 265),oklch(0.22 0 265));
--vibeui-avatar-003-focus:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.16 39.8));
--vibeui-avatar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="avatar-003"]{
position:relative;list-style:none;margin:0;padding:0;
display:inline-flex;align-items:center;vertical-align:middle;
font-family:var(--vibeui-avatar-003-font);
}
[data-vibeui-block="avatar-003"] li{display:flex}
[data-vibeui-block="avatar-003"][data-size="sm"]{--vibeui-avatar-003-size:2rem;--vibeui-avatar-003-overlap:0.5rem}
[data-vibeui-block="avatar-003"][data-size="lg"]{--vibeui-avatar-003-size:3.5rem;--vibeui-avatar-003-overlap:0.875rem}
[data-vibeui-block="avatar-003"] [data-part="item"],
[data-vibeui-block="avatar-003"] [data-part="more"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:var(--vibeui-avatar-003-size);height:var(--vibeui-avatar-003-size);
border-radius:9999px;box-shadow:0 0 0 2px var(--vibeui-avatar-003-ring);
font-size:calc(var(--vibeui-avatar-003-size) * 0.34);font-weight:650;line-height:1;
}
[data-vibeui-block="avatar-003"] [data-part="item"]{
position:relative;appearance:none;border:0;padding:0;overflow:hidden;
background:light-dark(oklch(0.92 0.05 var(--vibeui-avatar-003-hue,250)),oklch(0.34 0.065 var(--vibeui-avatar-003-hue,250)));
color:light-dark(oklch(0.38 0.09 var(--vibeui-avatar-003-hue,250)),oklch(0.88 0.063 var(--vibeui-avatar-003-hue,250)));
font-family:inherit;user-select:none;
z-index:var(--vibeui-avatar-003-z,0);
}
[data-vibeui-block="avatar-003"] [data-part="item"] img{
width:100%;height:100%;border-radius:inherit;object-fit:cover;display:block;
}
/* Перекрытие отрицательным margin: ширина стопки остаётся настоящей. */
[data-vibeui-block="avatar-003"] li + li{margin-left:calc(var(--vibeui-avatar-003-overlap) * -1)}
[data-vibeui-block="avatar-003"] [data-part="more"]{
background:var(--vibeui-avatar-003-more-bg);color:var(--vibeui-avatar-003-more-fg);
font-size:calc(var(--vibeui-avatar-003-size) * 0.3);
font-variant-numeric:tabular-nums;
}
/* Кружок с подписью — кнопка: div с подсказкой не попадает в Tab-порядок. */
[data-vibeui-block="avatar-003"][data-tooltip="true"] [data-part="item"]{
cursor:pointer;transition:transform .16s ease;
}
[data-vibeui-block="avatar-003"][data-tooltip="true"] [data-part="item"]:hover,
[data-vibeui-block="avatar-003"][data-tooltip="true"] [data-part="item"]:focus-visible{
z-index:20;transform:translateY(-2px);overflow:visible;
}
[data-vibeui-block="avatar-003"] [data-part="item"]:focus-visible{
outline:2px solid var(--vibeui-avatar-003-focus);outline-offset:2px;
}
[data-vibeui-block="avatar-003"] [data-part="tip"]{
position:absolute;bottom:calc(100% + 0.5rem);left:50%;translate:-50% 0;
padding:0.25rem 0.5rem;border-radius:0.375rem;
background:var(--vibeui-avatar-003-tip-bg);color:var(--vibeui-avatar-003-tip-fg);
font-size:0.75rem;font-weight:500;line-height:1.2;white-space:nowrap;
opacity:0;visibility:hidden;pointer-events:none;
transition:opacity .12s ease,visibility .12s;
}
[data-vibeui-block="avatar-003"] [data-part="item"]:hover [data-part="tip"],
[data-vibeui-block="avatar-003"] [data-part="item"]:focus-visible [data-part="tip"]{
opacity:1;visibility:visible;
}
[data-vibeui-block="avatar-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-003"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_NAMES = [
  "Анна Реброва",
  "Марк Ильин",
  "Мария Гурова",
  "Олег Дроздов",
  "Ирина Ким",
  "Пётр Гай",
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
  photos = [],
  visible = 4,
  size = "md",
  label = "Участники",
  tooltip = false,
  onSelect,
  className,
  style,
  ...props
}: Avatar003Props) {
  const shown = names.slice(0, Math.max(1, Math.min(8, visible)))
  const rest = names.length - shown.length

  return (
    <>
      <style href="vibeui-avatar-003" precedence="medium">
        {STYLES}
      </style>
      <ul
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-003"
        data-size={size}
        data-tooltip={tooltip ? "true" : "false"}
        className={className}
        style={style as CSSProperties}
        aria-label={tooltip ? label : `${label}: ${names.join(", ")}`}
      >
        {shown.map((name, index) => {
          const face = photos[index] ? (
            <img src={photos[index]} alt="" />
          ) : (
            <span aria-hidden="true">{initials(name)}</span>
          )
          const itemStyle = {
            "--vibeui-avatar-003-hue": hue(name),
            "--vibeui-avatar-003-z": shown.length - index,
          } as CSSProperties

          return (
            <li key={name}>
              {tooltip ? (
                <button
                  type="button"
                  data-part="item"
                  onClick={onSelect ? () => onSelect(name) : undefined}
                  style={itemStyle}
                >
                  {face}
                  {/* Подпись — обычный текст кнопки: скринридер прочитает имя
                      целиком, а глазами оно всплывает над стопкой. */}
                  <span data-part="tip">{name}</span>
                </button>
              ) : (
                <span data-part="item" aria-hidden="true" style={itemStyle}>
                  {face}
                </span>
              )}
            </li>
          )
        })}
        {rest > 0 ? (
          <li>
            <span data-part="more" aria-hidden="true">
              +{rest}
            </span>
            {/* «+3» ничего не говорит: имена остальных остаются в разметке. */}
            <span data-part="sr">{names.slice(shown.length).join(", ")}</span>
          </li>
        ) : null}
      </ul>
    </>
  )
}
