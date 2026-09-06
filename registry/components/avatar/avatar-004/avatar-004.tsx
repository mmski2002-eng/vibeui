import type { ComponentProps, CSSProperties } from "react"

export type Avatar004Props = Omit<ComponentProps<"span">, "children"> & {
  name?: string
  src?: string
  /** Заполнение кольца в процентах: прогресс профиля, курса, задачи. */
  value?: number
  size?: "sm" | "md" | "lg"
  accent?: string
}

// Идея компонента: кольцо вокруг аватара показывает прогресс. Оно нарисовано
// conic-gradient и вырезано маской, а не собрано из SVG: одна переменная —
// и кольцо любой толщины, без второго элемента и без вычислений длины дуги.
// Значение продублировано текстом для скринридера: цвет не читается вслух.
const STYLES = `
:where([data-vibeui-block="avatar-004"]){
--vibeui-avatar-004-size:2.5rem;
--vibeui-avatar-004-thickness:0.1875rem;
--vibeui-avatar-004-gap:0.125rem;
--vibeui-avatar-004-value:0deg;
--vibeui-avatar-004-hue:250;
--vibeui-avatar-004-bg:light-dark(oklch(0.92 0.05 var(--vibeui-avatar-004-hue)),oklch(0.34 0.065 var(--vibeui-avatar-004-hue)));
--vibeui-avatar-004-fg:light-dark(oklch(0.38 0.09 var(--vibeui-avatar-004-hue)),oklch(0.88 0.063 var(--vibeui-avatar-004-hue)));
--vibeui-avatar-004-track:light-dark(oklch(0.9 0 265),oklch(0.3 0 265));
--vibeui-avatar-004-accent:light-dark(oklch(0.62 0.17 39.8),oklch(0.76 0.17 39.8));
--vibeui-avatar-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Размер задаёт портрет, кольцо растёт наружу: в строке со «обычными»
   аватарами лица тогда одинаковые, а не мельче на толщину кольца. */
[data-vibeui-block="avatar-004"]{
position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none;
box-sizing:border-box;
width:calc(var(--vibeui-avatar-004-size) + (var(--vibeui-avatar-004-thickness) + var(--vibeui-avatar-004-gap)) * 2);
height:calc(var(--vibeui-avatar-004-size) + (var(--vibeui-avatar-004-thickness) + var(--vibeui-avatar-004-gap)) * 2);
vertical-align:middle;font-family:var(--vibeui-avatar-004-font);
}
[data-vibeui-block="avatar-004"][data-size="sm"]{--vibeui-avatar-004-size:2rem;--vibeui-avatar-004-thickness:0.15rem}
[data-vibeui-block="avatar-004"][data-size="lg"]{--vibeui-avatar-004-size:3.5rem;--vibeui-avatar-004-thickness:0.25rem}
/* Кольцо: conic-gradient, вырезанный маской, без SVG и без расчёта дуги. */
[data-vibeui-block="avatar-004"] [data-part="ring"]{
position:absolute;inset:0;border-radius:9999px;
background:conic-gradient(var(--vibeui-avatar-004-accent) var(--vibeui-avatar-004-value),var(--vibeui-avatar-004-track) 0);
mask:radial-gradient(farthest-side,transparent calc(100% - var(--vibeui-avatar-004-thickness)),oklch(0 0 0) calc(100% - var(--vibeui-avatar-004-thickness)));
}
[data-vibeui-block="avatar-004"] [data-part="shape"]{
position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden;
width:var(--vibeui-avatar-004-size);height:var(--vibeui-avatar-004-size);
border-radius:9999px;background:var(--vibeui-avatar-004-bg);color:var(--vibeui-avatar-004-fg);
font-size:calc(var(--vibeui-avatar-004-size) * 0.28);font-weight:650;line-height:1;user-select:none;
}
[data-vibeui-block="avatar-004"] img{width:100%;height:100%;object-fit:cover;display:block}
[data-vibeui-block="avatar-004"] [data-part="text"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="avatar-004"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-004"] *{animation:none!important;transition:none!important}}
`

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
 * Аватар в кольце прогресса: одна переменная задаёт заполнение.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar004({
  name = "Анна Реброва",
  src = "",
  value = 72,
  size = "md",
  accent,
  className,
  style,
  ...props
}: Avatar004Props) {
  const safe = Math.max(0, Math.min(100, value))
  const palette = {
    "--vibeui-avatar-004-hue": hue(name),
    "--vibeui-avatar-004-value": `${safe * 3.6}deg`,
    ...(accent ? { "--vibeui-avatar-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-004" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-slot="avatar"
        data-vibeui-block="avatar-004"
        data-size={size}
        className={className}
        style={palette}
        role="img"
        aria-label={`${name}, профиль заполнен на ${safe}%`}
      >
        <span data-part="ring" aria-hidden="true" />
        <span data-part="shape" aria-hidden="true">
          {src ? (
            <img src={src} alt="" loading="lazy" decoding="async" />
          ) : (
            initials(name)
          )}
        </span>
        <span data-part="text">{safe}%</span>
      </span>
    </>
  )
}
