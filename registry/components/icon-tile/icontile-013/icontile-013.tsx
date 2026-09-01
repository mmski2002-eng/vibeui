import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  icon?: "trophy" | "star" | "medal"
  label?: string
  tier?: "bronze" | "silver" | "gold"
}

// Идея компонента: лента под кругом — не одна фигура, а два одинаковых
// хвоста, вырезанных clip-path из общего прямоугольника и отражённых друг
// относительно друга через scaleX(-1). Так оба хвоста гарантированно
// симметричны при любом tier и любой ширине, а не подгоняются раздельно.
// Круг и лента окрашены от одной переменной оттенка --vibeui-icontile-013-hue,
// которую переключает tier, — металл достижения нигде не подбирается вручную.
const STYLES = `
:where([data-vibeui-block="icontile-013"]){
container-type:inline-size;
--vibeui-icontile-013-hue:75;
--vibeui-icontile-013-size:3.5rem;
--vibeui-icontile-013-fg:oklch(0.26 0.014 265);
--vibeui-icontile-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-013"]{
display:inline-flex;flex-direction:column;align-items:center;min-width:0;
font-family:var(--vibeui-icontile-013-font);
}
[data-vibeui-block="icontile-013"] [data-part="badge"]{
position:relative;display:flex;flex-direction:column;align-items:center;
}
[data-vibeui-block="icontile-013"] [data-part="ribbon"]{
display:flex;justify-content:center;gap:0.375rem;margin-top:-0.5rem;
}
[data-vibeui-block="icontile-013"] [data-part="tail"]{
width:0.75rem;height:1.375rem;
background:oklch(0.55 0.16 var(--vibeui-icontile-013-hue));
clip-path:polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%);
}
[data-vibeui-block="icontile-013"] [data-part="tail"][data-side="right"]{
transform:scaleX(-1);
}
[data-vibeui-block="icontile-013"] [data-part="circle"]{
position:relative;z-index:1;display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-013-size);height:var(--vibeui-icontile-013-size);
border-radius:50%;
background:oklch(0.9 0.06 var(--vibeui-icontile-013-hue));
color:oklch(0.4 0.18 var(--vibeui-icontile-013-hue));
box-shadow:inset 0 0 0 2px oklch(1 0 0 / 0.6);
}
[data-vibeui-block="icontile-013"] [data-part="circle"] svg{width:52%;height:52%}
[data-vibeui-block="icontile-013"] [data-part="label"]{
display:block;margin:0.5rem 0 0;font-size:0.8125rem;font-weight:600;
color:var(--vibeui-icontile-013-fg);text-align:center;max-width:12ch;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-013"][data-tier="bronze"]{--vibeui-icontile-013-hue:35}
[data-vibeui-block="icontile-013"][data-tier="silver"]{--vibeui-icontile-013-hue:265}
[data-vibeui-block="icontile-013"][data-tier="gold"]{--vibeui-icontile-013-hue:75}
@container (max-width: 100px){
[data-vibeui-block="icontile-013"] [data-part="label"]{display:none}
}
`

function Icontile013Icon({
  icon,
}: {
  icon: NonNullable<Icontile013Props["icon"]>
}) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }

  if (icon === "star") {
    return (
      <svg {...shared}>
        <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7L12 3Z" />
      </svg>
    )
  }

  if (icon === "medal") {
    return (
      <svg {...shared}>
        <circle cx="12" cy="15" r="6" />
        <path d="M9 9.5 6 3h3l3 5M15 9.5 18 3h-3l-3 5" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v1a4 4 0 0 0 4 4M17 5h3v1a4 4 0 0 1-4 4" />
      <path d="M12 13v3M9 20h6M10 17h4v3h-4z" />
    </svg>
  )
}

/**
 * Плитка достижения: иконка в круге, симметричная лента из двух хвостов
 * под ним и подпись. Металл и цвет ленты выводятся из tier.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile013({
  icon = "trophy",
  label = "Первая интеграция",
  tier = "gold",
  className,
  style,
  ...props
}: Icontile013Props) {
  return (
    <>
      <style href="vibeui-icontile-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-013"
        data-tier={tier}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="badge">
          <span data-part="circle">
            <Icontile013Icon icon={icon} />
          </span>
          <span data-part="ribbon" aria-hidden="true">
            <span data-part="tail" data-side="left" />
            <span data-part="tail" data-side="right" />
          </span>
        </span>
        <span data-part="label">{label}</span>
      </div>
    </>
  )
}
