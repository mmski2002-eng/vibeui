import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile008CategoryIcon =
  "code" | "design" | "chart" | "rocket" | "shield" | "spark"

export type Icontile008Category = {
  label: string
  icon: Icontile008CategoryIcon
  count?: number
}

export type Icontile008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Icontile008Category[]
}

const ICON_HUE: Record<Icontile008CategoryIcon, number> = {
  code: 262,
  design: 300,
  chart: 152,
  rocket: 25,
  shield: 200,
  spark: 75,
}

const DEFAULT_ITEMS: Icontile008Category[] = [
  { label: "Разработка", icon: "code", count: 24 },
  { label: "Дизайн", icon: "design", count: 12 },
  { label: "Аналитика", icon: "chart", count: 8 },
  { label: "Продукт", icon: "rocket", count: 5 },
  { label: "Безопасность", icon: "shield", count: 3 },
  { label: "Идеи", icon: "spark", count: 17 },
]

// Идея компонента: сетка плиток-категорий, где число колонок считается от
// ширины самого контейнера, а не окна браузера — в узкой боковой панели и на
// всю ширину страницы получаем разное число колонок из одной разметки. Ховер
// поднимает плитку и красит рамку сразу двумя признаками — тенью и сдвигом,
// а не одним цветом, поэтому наведение видно и в чёрно-белом режиме. Каждая
// категория держит свой оттенок плитки-иконки — так ряд не превращается в
// одноцветный список.
const STYLES = `
:where([data-vibeui-block="icontile-008"]){
container-type:inline-size;
--vibeui-icontile-008-fg:oklch(0.26 0.014 265);
--vibeui-icontile-008-muted:oklch(0.52 0.014 265);
--vibeui-icontile-008-border:oklch(0.9 0.006 265);
--vibeui-icontile-008-surface:oklch(1 0 0);
--vibeui-icontile-008-hover-surface:oklch(0.97 0.008 262);
--vibeui-icontile-008-hover-border:oklch(0.78 0.03 262);
--vibeui-icontile-008-ring:oklch(0.55 0.15 262);
--vibeui-icontile-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-008"]{
display:block;font-family:var(--vibeui-icontile-008-font);
}
[data-vibeui-block="icontile-008"] [data-part="grid"]{
display:grid;gap:0.75rem;grid-template-columns:repeat(2,minmax(0,1fr));
}
[data-vibeui-block="icontile-008"] [data-part="item"]{
appearance:none;cursor:pointer;text-align:left;
display:flex;flex-direction:column;align-items:flex-start;gap:0.625rem;
box-sizing:border-box;width:100%;padding:1rem;
background:var(--vibeui-icontile-008-surface);
border:1px solid var(--vibeui-icontile-008-border);border-radius:1rem;
font:inherit;color:inherit;
transition:transform 0.16s ease,box-shadow 0.16s ease,background-color 0.16s ease,border-color 0.16s ease;
}
[data-vibeui-block="icontile-008"] [data-part="item"]:hover{
transform:translateY(-2px);
background:var(--vibeui-icontile-008-hover-surface);
border-color:var(--vibeui-icontile-008-hover-border);
box-shadow:0 10px 24px -16px oklch(0.3 0.05 262 / 55%);
}
[data-vibeui-block="icontile-008"] [data-part="item"]:focus-visible{
outline:2px solid var(--vibeui-icontile-008-ring);outline-offset:2px;
}
[data-vibeui-block="icontile-008"] [data-part="icon"]{
display:grid;place-items:center;flex:none;
width:2.5rem;height:2.5rem;border-radius:0.75rem;
background:oklch(0.93 0.045 var(--vibeui-icontile-008-item-hue));
color:oklch(0.44 0.18 var(--vibeui-icontile-008-item-hue));
}
[data-vibeui-block="icontile-008"] [data-part="icon"] svg{width:55%;height:55%}
[data-vibeui-block="icontile-008"] [data-part="label"]{
font-size:0.875rem;font-weight:650;color:var(--vibeui-icontile-008-fg);
}
[data-vibeui-block="icontile-008"] [data-part="count"]{
margin:0;font-size:0.75rem;color:var(--vibeui-icontile-008-muted);
font-variant-numeric:tabular-nums;
}
@container (min-width: 460px){
[data-vibeui-block="icontile-008"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 680px){
[data-vibeui-block="icontile-008"] [data-part="grid"]{grid-template-columns:repeat(4,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="icontile-008"] [data-part="item"]{transition:none!important}
[data-vibeui-block="icontile-008"] [data-part="item"]:hover{transform:none}
}
`

function Icontile008Icon({ icon }: { icon: Icontile008CategoryIcon }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }

  switch (icon) {
    case "design":
      return (
        <svg {...shared}>
          <path d="M4 20 6 14 16 4a2.5 2.5 0 0 1 3.5 3.5L9.5 17.5 4 20Z" />
          <path d="M13.5 6.5 17.5 10.5" />
        </svg>
      )
    case "chart":
      return (
        <svg {...shared}>
          <path d="M5 20V10M12 20V4M19 20v-7" />
        </svg>
      )
    case "rocket":
      return (
        <svg {...shared}>
          <path d="M12 2c3 2 5 6 5 10 0 2-1 4-2 5l-3 3-3-3c-1-1-2-3-2-5 0-4 2-8 5-10Z" />
          <path d="M9 15 6 18M15 15l3 3" />
        </svg>
      )
    case "shield":
      return (
        <svg {...shared}>
          <path d="M12 3 19 6v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" />
        </svg>
      )
    case "spark":
      return (
        <svg {...shared}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
        </svg>
      )
    default:
      return (
        <svg {...shared}>
          <path d="M8 5 2 12l6 7M16 5l6 7-6 7" />
        </svg>
      )
  }
}

/**
 * Сетка плиток-категорий: число колонок от ширины контейнера, ховер поднимает
 * плитку тенью и сдвигом, у каждой категории свой оттенок иконки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile008({
  items = DEFAULT_ITEMS,
  className,
  style,
  ...props
}: Icontile008Props) {
  return (
    <>
      <style href="vibeui-icontile-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-008"
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="grid">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              data-part="item"
              style={
                {
                  "--vibeui-icontile-008-item-hue": ICON_HUE[item.icon],
                } as CSSProperties
              }
            >
              <span data-part="icon">
                <Icontile008Icon icon={item.icon} />
              </span>
              <span data-part="label">{item.label}</span>
              {item.count !== undefined ? (
                <span data-part="count">{item.count} компонентов</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
