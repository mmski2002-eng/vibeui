import type { ComponentProps, CSSProperties } from "react"

export type Button081Props = Omit<ComponentProps<"button">, "title" | "children"> & {
  day?: string
  start?: number
  todayLabel?: string
  tomorrowLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function clock(minutes: number) {
  return `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`
}

function pad(value: number) {
  return String(value).padStart(2, "0")
}

// Часть блока flowers-003, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-081"]){
--vibeui-button-081-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-081-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-button-081-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-button-081-muted:color-mix(in oklab,var(--vibeui-button-081-fg) 62%,var(--vibeui-button-081-bg));
--vibeui-button-081-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-081"]{color-scheme:dark}
[data-vibeui-block="button-081"]{box-sizing:border-box}
[data-vibeui-block="button-081"] *{box-sizing:border-box}
[data-vibeui-block="button-081"]{flex:0 0 6.5rem;display:grid;justify-items:center;gap:.3rem;padding:0;border:0;background:transparent;color:var(--vibeui-button-081-muted);font:inherit;cursor:pointer;transition:color .3s}
[data-vibeui-block="button-081"] i{display:block;width:1px;height:1.2rem;background:currentColor;opacity:.5}
[data-vibeui-block="button-081"] b{font-family:var(--vibeui-button-081-display);font-weight:600;font-size:1.3rem;line-height:1;font-variant-numeric:tabular-nums}
[data-vibeui-block="button-081"] small{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase}
[data-vibeui-block="button-081"][data-on="true"]{color:var(--vibeui-button-081-fg)}
[data-vibeui-block="button-081"][data-on="true"] i{height:2rem;opacity:1;background:var(--vibeui-button-081-accent)}
[data-vibeui-block="button-081"]:focus-visible{outline:2px solid var(--vibeui-button-081-accent);outline-offset:-2px;border-radius:.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-081"] *{animation:none!important;transition:none!important}}
`

/** Кнопка-радио слота доставки: индикатор, время и «сегодня/завтра». */
export function Button081({
  day = "today",
  start = 0,
  todayLabel = "сегодня",
  tomorrowLabel = "завтра",
  accent,
  className,
  style,
  ...props
}: Button081Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-081-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-081" precedence="medium">
        {STYLES}
      </style>
      <button
        {...props}
        data-slot="button"
        data-vibeui-block="button-081" type="button" role="radio"
        className={className}
        style={palette}
      >
        <i aria-hidden="true" />
        <b>{clock(start)}</b>
        <small>{day === "today" ? todayLabel : tomorrowLabel}</small>
      </button>
    </>
  )
}
