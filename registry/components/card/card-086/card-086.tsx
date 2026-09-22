"use client"

import type { ComponentProps, CSSProperties } from "react"

export type Card086Props = Omit<ComponentProps<"li">, "title" | "children"> & {
  name?: string
  color?: string
  price?: number
  days?: number
  stemLine?: string
  currency?: string
  dayUnits?: readonly [string, string, string]
  removeLabel?: string
  maxStems?: number
  addLabel?: string
  count?: number
  total?: number
  change?: (name: string, delta: number) => void
  accent?: string
  className?: string
  style?: CSSProperties
}

function daysWord(days: number, units: readonly [string, string, string]) {
  const rest = days % 10
  if (days % 100 >= 11 && days % 100 <= 14) return units[2]
  if (rest === 1) return units[0]
  if (rest >= 2 && rest <= 4) return units[1]
  return units[2]
}

// Часть блока flowers-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="card-086"]){
--vibeui-card-086-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-086-display:"Cormorant",Georgia,"Times New Roman",serif;
--vibeui-card-086-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-086-line:color-mix(in oklab,var(--vibeui-card-086-fg) 16%,transparent);
--vibeui-card-086-muted:color-mix(in oklab,var(--vibeui-card-086-fg) 62%,var(--vibeui-card-086-bg));
--vibeui-card-086-on-accent:oklch(from var(--vibeui-card-086-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-card-086-paper:color-mix(in oklab,var(--vibeui-card-086-fg) 5%,var(--vibeui-card-086-bg));
--vibeui-card-086-bg:light-dark(#ffffff,#1a1a1a);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-086"]{color-scheme:dark}
[data-vibeui-block="card-086"]{box-sizing:border-box;list-style:none}
[data-vibeui-block="card-086"] *{box-sizing:border-box}
[data-vibeui-block="card-086"]{display:grid;grid-template-columns:1.4rem minmax(0,1fr) auto;align-items:center;gap:.9rem;padding:.75rem .9rem;border-radius:.9rem;border:1px solid var(--vibeui-card-086-line);transition:border-color .25s,background .25s}
[data-vibeui-block="card-086"][data-on="true"]{border-color:var(--vibeui-card-086-fg);background:var(--vibeui-card-086-paper)}
[data-vibeui-block="card-086"] [data-part="swatch"]{width:1.4rem;height:1.4rem;border-radius:50%;background:var(--vibeui-card-086-c);box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-card-086-fg) 25%,transparent)}
[data-vibeui-block="card-086"] h3{margin:0;font-family:var(--vibeui-card-086-display);font-size:1.35rem;font-weight:600;line-height:1.1}
[data-vibeui-block="card-086"] p{margin:.1rem 0 0;font-size:.8rem;color:var(--vibeui-card-086-muted)}
[data-vibeui-block="card-086"] [data-part="count"]{display:inline-flex;align-items:center;gap:.2rem}
[data-vibeui-block="card-086"] [data-part="count"] button{width:2.1rem;height:2.1rem;border-radius:50%;border:1px solid var(--vibeui-card-086-fg);background:transparent;color:var(--vibeui-card-086-fg);font:inherit;font-size:1.1rem;line-height:1;cursor:pointer;transition:background .2s,color .2s,transform .15s}
[data-vibeui-block="card-086"] [data-part="count"] button:hover{background:var(--vibeui-card-086-accent);border-color:var(--vibeui-card-086-accent);color:var(--vibeui-card-086-on-accent)}
[data-vibeui-block="card-086"] [data-part="count"] button:active{transform:scale(.92)}
[data-vibeui-block="card-086"] [data-part="count"] button:disabled{opacity:.3;cursor:default;background:transparent;color:var(--vibeui-card-086-fg);border-color:var(--vibeui-card-086-fg)}
[data-vibeui-block="card-086"] [data-part="count"] output{min-width:1.6rem;text-align:center;font-variant-numeric:tabular-nums;font-weight:500}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-086"] *{animation:none!important;transition:none!important}}
`

/** Строка выбора цветка: свотч цвета, название, цена за стебель и срок, кнопки −/+ со счётчиком. */
export function Card086({
  name = "Пион",
  color,
  price = 390,
  days = 6,
  stemLine = "{price}/шт · стоит {n} {days}",
  currency = "₽",
  dayUnits = ["день", "дня", "дней"],
  removeLabel = "Убрать: {name}",
  maxStems = 24,
  addLabel = "Добавить: {name}",
  count = 0,
  total = 0,
  change,
  accent,
  className,
  style,
  ...props
}: Card086Props) {
  const palette = {
    ["--vibeui-card-086-c" as string]: color ?? "var(--vibeui-card-086-accent)",
    ...(accent ? { "--vibeui-card-086-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-086" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="card"
        data-vibeui-block="card-086" data-on={count > 0}
        className={className}
        style={palette}
      >
        <i data-part="swatch" aria-hidden="true" />
        <div>
          <h3>{name}</h3>
          <p>
            {stemLine.replace("{price}", `${price} ${currency}`).replace("{n}", String(days)).replace("{days}", daysWord(days, dayUnits))}
          </p>
        </div>
        <div data-part="count">
          <button type="button" onClick={() => change?.(name, -1)} disabled={count === 0} aria-label={removeLabel.replace("{name}", name)}>
            −
          </button>
          <output aria-label={`${name}: ${count}`}>{count}</output>
          <button type="button" onClick={() => change?.(name, 1)} disabled={total >= maxStems} aria-label={addLabel.replace("{name}", name)}>
            +
          </button>
        </div>
      </li>
    </>
  )
}
