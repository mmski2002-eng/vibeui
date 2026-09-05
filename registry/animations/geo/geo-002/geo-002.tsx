import type { ComponentProps, CSSProperties } from "react"

export type Geo002Props = Omit<ComponentProps<"section">, "children"> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  accent?: string
  /** Вращающийся луч радара поверх поля. */
  sweep?: boolean
  /** Концентрические кольца радара под пинами. */
  rings?: boolean
  paused?: boolean
}

// Идея: три пина падают на абстрактное радар-поле по очереди и бесконечно
// повторяют цикл. У каждого пина общий keyframe с отрицательной задержкой
// по индексу (тот же приём, что и у пакетов в connections-001) — так падения
// идут внахлёст один за другим. В точке приземления в тот же момент времени
// стартует расходящееся кольцо ряби: у него свой keyframe с той же
// задержкой, синхронизированной с моментом касания пина. Поле радара —
// статичные концентрические окружности и перекрестие, поверх которых
// медленно вращается луч-сектор (conic-подобный клин), это фоновая
// анимация категории независимо от падений.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="geo-002"]){
--vibeui-geo-002-bg-top:light-dark(oklch(0.94 0.006 260),oklch(0.19 0.012 260));
--vibeui-geo-002-bg-bottom:light-dark(oklch(0.88 0.01 260),oklch(0.09 0.01 260));
--vibeui-geo-002-fg:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-geo-002-border:light-dark(oklch(0.82 0.02 240),oklch(0.34 0.02 240));
--vibeui-geo-002-field:light-dark(oklch(0.9 0.02 150),oklch(0.22 0.03 150));
--vibeui-geo-002-ring:color-mix(in oklab,var(--vibeui-geo-002-fg) 26%,transparent);
--vibeui-geo-002-accent:light-dark(oklch(0.6 0.19 25),oklch(0.72 0.17 25));
--vibeui-geo-002-pin-fg:oklch(0.98 0 0);
--vibeui-geo-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="geo-002"]{color-scheme:dark}
[data-vibeui-block="geo-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-geo-002-fg);font-family:var(--vibeui-geo-002-font);
}
[data-vibeui-block="geo-002"] *{box-sizing:border-box}
[data-vibeui-block="geo-002"] [data-part="stage"]{
position:relative;isolation:isolate;display:flex;align-items:center;justify-content:center;
padding:1.5rem;border-radius:1.5rem;min-height:14rem;
border:1px solid var(--vibeui-geo-002-border);
background:linear-gradient(to bottom,var(--vibeui-geo-002-bg-top),var(--vibeui-geo-002-bg-bottom));
}
[data-vibeui-block="geo-002"] svg{display:block;width:11rem;height:11rem;overflow:visible}
[data-vibeui-block="geo-002"] [data-part="field"]{
fill:var(--vibeui-geo-002-field);stroke:var(--vibeui-geo-002-border);stroke-width:1;
}
[data-vibeui-block="geo-002"] [data-part="ring"]{
fill:none;stroke:var(--vibeui-geo-002-ring);stroke-width:0.7;stroke-dasharray:1.5 3;
}
[data-vibeui-block="geo-002"] [data-part="cross"]{
stroke:var(--vibeui-geo-002-ring);stroke-width:0.6;stroke-dasharray:1.5 3;
}
[data-vibeui-block="geo-002"][data-rings="false"] [data-part="ring"],
[data-vibeui-block="geo-002"][data-rings="false"] [data-part="cross"]{display:none}
[data-vibeui-block="geo-002"] [data-part="sweep"]{
transform-origin:100px 100px;transform-box:view-box;
animation:vibeui-geo-002-sweep 6s linear infinite;
}
[data-vibeui-block="geo-002"][data-sweep="false"] [data-part="sweep"]{display:none}
[data-vibeui-block="geo-002"] [data-part="drop"]{
animation:vibeui-geo-002-drop 3.6s ease infinite;
animation-delay:calc(var(--i) * -1.2s);
}
[data-vibeui-block="geo-002"] [data-part="pin"]{fill:var(--vibeui-geo-002-accent)}
[data-vibeui-block="geo-002"] [data-part="pin-hole"]{fill:var(--vibeui-geo-002-pin-fg)}
[data-vibeui-block="geo-002"] [data-part="ripple"]{
fill:none;stroke:var(--vibeui-geo-002-accent);stroke-width:2;
transform-box:fill-box;transform-origin:center;
animation:vibeui-geo-002-ripple 3.6s ease-out infinite;
animation-delay:calc(var(--i) * -1.2s);
}
[data-vibeui-block="geo-002"][data-paused="true"] *{animation-play-state:paused!important}
@keyframes vibeui-geo-002-sweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes vibeui-geo-002-drop{
0%{transform:translateY(-70px);opacity:0}
4%{opacity:1}
40%{transform:translateY(0);opacity:1}
48%{transform:translateY(-9px)}
56%{transform:translateY(0)}
62%{transform:translateY(-3px)}
68%{transform:translateY(0)}
88%{opacity:1;transform:translateY(0)}
96%{opacity:0;transform:translateY(0)}
100%{opacity:0;transform:translateY(-70px)}
}
@keyframes vibeui-geo-002-ripple{
0%,40%{transform:scale(0);opacity:0}
44%{transform:scale(0.3);opacity:0.55}
70%{transform:scale(1);opacity:0}
100%{opacity:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="geo-002"] [data-part="sweep"]{animation:none;opacity:0.4}
[data-vibeui-block="geo-002"] [data-part="drop"]{animation:none;transform:translateY(0);opacity:1}
[data-vibeui-block="geo-002"] [data-part="ripple"]{animation:none;opacity:0}
}
`

const PIN_PATH =
  "M0 0 C -9 -13 -9 -27 0 -33 C 9 -27 9 -13 0 0 Z"

const LANDINGS: { x: number; y: number }[] = [
  { x: 72, y: 80 },
  { x: 128, y: 64 },
  { x: 100, y: 140 },
]

/**
 * Пины локаций падают с отскоком на абстрактное радар-поле и расходятся
 * рябью в точке приземления, по очереди. Один файл, ноль зависимостей,
 * собственная палитра, вся анимация на CSS.
 */
export function Geo002({
  label = "Пины локаций падают на радар-поле с расходящейся рябью",
  accent,
  sweep = true,
  rings = true,
  paused = false,
  className,
  style,
  ...props
}: Geo002Props) {
  const palette = {
    ...(accent ? { "--vibeui-geo-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-geo-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="geo-002"
        data-slot="geo-pin-drop"
        data-sweep={sweep ? undefined : "false"}
        data-rings={rings ? undefined : "false"}
        data-paused={paused ? "true" : undefined}
        className={className}
        style={palette}
        role="img"
        aria-label={label}
      >
        <div data-part="stage">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <clipPath id="vibeui-geo-002-clip">
                <circle cx="100" cy="100" r="90" />
              </clipPath>
              <linearGradient
                id="vibeui-geo-002-sweep-fill"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  stopColor="var(--vibeui-geo-002-accent)"
                  stopOpacity="0.5"
                />
                <stop
                  offset="100%"
                  stopColor="var(--vibeui-geo-002-accent)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <circle data-part="field" cx="100" cy="100" r="90" />
            <g clipPath="url(#vibeui-geo-002-clip)">
              <path
                data-part="sweep"
                d="M100 100 L100 12 A88 88 0 0 1 162 38 Z"
                fill="url(#vibeui-geo-002-sweep-fill)"
              />
              <circle data-part="ring" cx="100" cy="100" r="30" />
              <circle data-part="ring" cx="100" cy="100" r="55" />
              <circle data-part="ring" cx="100" cy="100" r="78" />
              <line
                data-part="cross"
                x1="100"
                y1="10"
                x2="100"
                y2="190"
              />
              <line
                data-part="cross"
                x1="10"
                y1="100"
                x2="190"
                y2="100"
              />
              {LANDINGS.map((landing, index) => (
                <g
                  key={`geo-002-pin-${index}`}
                  transform={`translate(${landing.x} ${landing.y})`}
                >
                  <circle
                    data-part="ripple"
                    r="26"
                    style={{ "--i": index } as CSSProperties}
                  />
                  <g
                    data-part="drop"
                    style={{ "--i": index } as CSSProperties}
                  >
                    <path data-part="pin" d={PIN_PATH} />
                    <circle data-part="pin-hole" cx="0" cy="-20" r="3.2" />
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </section>
    </>
  )
}
