import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile003Status =
  "success" | "warning" | "danger" | "info" | "pending"

export type Icontile003Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children"
> & {
  status?: Icontile003Status
  label?: string
}

// Идея компонента: статус кодируется формой, а не только цветом. Круг,
// треугольник, восьмиугольник и квадрат различимы при любом дальтонизме и в
// чёрно-белой печати, поэтому смысл доходит без цвета. Формы вырезаны
// clip-path из одной квадратной плитки — размер и место в строке остаются
// общими, и список статусов не пляшет по высоте.
const STYLES = `
:where([data-vibeui-block="icontile-003"]){
--vibeui-icontile-003-size:1.75rem;
--vibeui-icontile-003-hue:152;
--vibeui-icontile-003-surface:oklch(1 0 0);
--vibeui-icontile-003-border:oklch(0.9 0.006 265);
--vibeui-icontile-003-fg:oklch(0.26 0.014 265);
--vibeui-icontile-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: подпись тёмная, а статус показывают поверх всего. */
[data-vibeui-block="icontile-003"]{
display:inline-flex;align-items:center;gap:0.5rem;
box-sizing:border-box;padding:0.375rem 0.75rem 0.375rem 0.375rem;
background:var(--vibeui-icontile-003-surface);
border:1px solid var(--vibeui-icontile-003-border);border-radius:9999px;
font-family:var(--vibeui-icontile-003-font);color:var(--vibeui-icontile-003-fg);
font-size:0.8125rem;
}
[data-vibeui-block="icontile-003"] [data-part="tile"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-003-size);height:var(--vibeui-icontile-003-size);
background:oklch(0.62 0.15 var(--vibeui-icontile-003-hue));
color:oklch(1 0 0);
font-size:calc(var(--vibeui-icontile-003-size) * 0.5);font-weight:700;line-height:1;
border-radius:0.5rem;
}
/* Форма несёт смысл: она читается и в чёрно-белой печати, и при дальтонизме. */
[data-vibeui-block="icontile-003"][data-status="success"]{--vibeui-icontile-003-hue:152}
[data-vibeui-block="icontile-003"][data-status="success"] [data-part="tile"]{border-radius:9999px}
[data-vibeui-block="icontile-003"][data-status="warning"]{--vibeui-icontile-003-hue:78}
[data-vibeui-block="icontile-003"][data-status="warning"] [data-part="tile"]{
border-radius:0;clip-path:polygon(50% 2%,100% 100%,0 100%);
align-content:end;padding-bottom:0.0625rem;font-size:calc(var(--vibeui-icontile-003-size) * 0.38);
}
[data-vibeui-block="icontile-003"][data-status="danger"]{--vibeui-icontile-003-hue:25}
[data-vibeui-block="icontile-003"][data-status="danger"] [data-part="tile"]{
border-radius:0;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%);
}
[data-vibeui-block="icontile-003"][data-status="info"]{--vibeui-icontile-003-hue:255}
[data-vibeui-block="icontile-003"][data-status="pending"]{--vibeui-icontile-003-hue:265}
[data-vibeui-block="icontile-003"][data-status="pending"] [data-part="tile"]{
background:oklch(0.9 0.01 var(--vibeui-icontile-003-hue));
color:oklch(0.42 0.02 var(--vibeui-icontile-003-hue));
clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);border-radius:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="icontile-003"] *{animation:none!important;transition:none!important}}
`

const GLYPHS: Record<Icontile003Status, string> = {
  success: "✓",
  warning: "!",
  danger: "✕",
  info: "i",
  pending: "…",
}

/**
 * Статусная плитка: смысл несёт форма, цвет только усиливает её.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile003({
  status = "success",
  label = "Проверка пройдена",
  className,
  style,
  ...props
}: Icontile003Props) {
  return (
    <>
      <style href="vibeui-icontile-003" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="icontile-003"
        data-status={status}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="tile" aria-hidden="true">
          {GLYPHS[status]}
        </span>
        <span data-part="label">{label}</span>
      </span>
    </>
  )
}
