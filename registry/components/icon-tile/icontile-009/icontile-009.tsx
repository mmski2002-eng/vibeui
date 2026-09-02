import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Icontile009Props = Omit<
  ComponentPropsWithoutRef<"span">,
  "children" | "color"
> & {
  icon?: "spark" | "bolt" | "shield"
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
  label?: string
}

// Идея компонента: угол скруглён по формуле сквиркла — 0.44 от размера,
// круче обычной плитки — и подложен мягкой двухслойной тенью, окрашенной в
// тот же оттенок, что и сама плитка. Тень цветная, а не серая: серая тень
// под цветной плиткой читается как грязь, а окрашенная — как собственное
// свечение. Формула сквиркла и оттенок тени завязаны на одни переменные,
// поэтому смена tone красит и плитку, и тень согласованно.
const STYLES = `
:where([data-vibeui-block="icontile-009"]){
--vibeui-icontile-009-size:3rem;
--vibeui-icontile-009-hue:262;
--vibeui-icontile-009-chroma:0.05;
--vibeui-icontile-009-shadow-alpha:0.32;
--vibeui-icontile-009-fill:light-dark(oklch(0.94 var(--vibeui-icontile-009-chroma) var(--vibeui-icontile-009-hue)),oklch(0.33 calc(var(--vibeui-icontile-009-chroma) * 1.6) var(--vibeui-icontile-009-hue)));
--vibeui-icontile-009-mark:light-dark(oklch(0.44 calc(var(--vibeui-icontile-009-chroma) * 4) var(--vibeui-icontile-009-hue)),oklch(0.88 calc(var(--vibeui-icontile-009-chroma) * 2.2) var(--vibeui-icontile-009-hue)));
}
[data-vibeui-block="icontile-009"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
box-sizing:border-box;
width:var(--vibeui-icontile-009-size);height:var(--vibeui-icontile-009-size);
border-radius:calc(var(--vibeui-icontile-009-size) * 0.44);
background:var(--vibeui-icontile-009-fill);
color:var(--vibeui-icontile-009-mark);
box-shadow:
0 calc(var(--vibeui-icontile-009-size) * 0.3) calc(var(--vibeui-icontile-009-size) * 0.55) calc(var(--vibeui-icontile-009-size) * -0.28) light-dark(oklch(0.5 calc(var(--vibeui-icontile-009-chroma) * 4) var(--vibeui-icontile-009-hue) / var(--vibeui-icontile-009-shadow-alpha)),oklch(0.18 calc(var(--vibeui-icontile-009-chroma) * 5) var(--vibeui-icontile-009-hue) / calc(var(--vibeui-icontile-009-shadow-alpha) * 1.9))),
0 calc(var(--vibeui-icontile-009-size) * 0.06) calc(var(--vibeui-icontile-009-size) * 0.12) calc(var(--vibeui-icontile-009-size) * -0.05) light-dark(oklch(0.5 calc(var(--vibeui-icontile-009-chroma) * 4) var(--vibeui-icontile-009-hue) / 0.22),oklch(0.15 calc(var(--vibeui-icontile-009-chroma) * 5) var(--vibeui-icontile-009-hue) / 0.5));
}
[data-vibeui-block="icontile-009"] svg{width:46%;height:46%}
[data-vibeui-block="icontile-009"][data-size="sm"]{--vibeui-icontile-009-size:2.25rem}
[data-vibeui-block="icontile-009"][data-size="lg"]{--vibeui-icontile-009-size:3.75rem}
[data-vibeui-block="icontile-009"][data-tone="neutral"]{--vibeui-icontile-009-chroma:0.015;--vibeui-icontile-009-shadow-alpha:0.16}
[data-vibeui-block="icontile-009"][data-tone="success"]{--vibeui-icontile-009-hue:152;--vibeui-icontile-009-chroma:0.045}
[data-vibeui-block="icontile-009"][data-tone="warning"]{--vibeui-icontile-009-hue:75;--vibeui-icontile-009-chroma:0.05}
[data-vibeui-block="icontile-009"][data-tone="danger"]{--vibeui-icontile-009-hue:25;--vibeui-icontile-009-chroma:0.05}
`

function Icontile009Icon({
  icon,
}: {
  icon: NonNullable<Icontile009Props["icon"]>
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

  if (icon === "bolt") {
    return (
      <svg {...shared}>
        <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
      </svg>
    )
  }

  if (icon === "shield") {
    return (
      <svg {...shared}>
        <path d="M12 3 19 6v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  )
}

/**
 * Плитка-сквиркл с мягкой окрашенной тенью вместо серой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Icontile009({
  icon = "spark",
  tone = "accent",
  size = "md",
  label,
  className,
  style,
  ...props
}: Icontile009Props) {
  return (
    <>
      <style href="vibeui-icontile-009" precedence="medium">
        {STYLES}
      </style>
      <span
        {...props}
        data-vibeui-block="icontile-009"
        data-tone={tone}
        data-size={size}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className={className}
        style={style as CSSProperties}
      >
        <Icontile009Icon icon={icon} />
      </span>
    </>
  )
}
