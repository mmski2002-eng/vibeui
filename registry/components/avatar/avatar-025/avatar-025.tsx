import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Avatar025Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  level?: number
  progress?: number
  rank?: "bronze" | "silver" | "gold"
}

// Идея компонента: аватар с уровнем и рангом. Кольцо здесь не сплошная дуга, а
// десять делений: по сегментам глаз считает «шесть из десяти» без чтения
// процентов, чего гладкая дуга не даёт. Деления нарисованы
// repeating-conic-gradient, заполнение отрезано conic-маской — ни SVG, ни
// расчёта длины дуги. Номер уровня лежит в шестиугольнике под портретом, чтобы
// не занимать угол, где обычно висит присутствие.
const STYLES = `
:where([data-vibeui-block="avatar-025"]){
--vibeui-avatar-025-size:3.5rem;
--vibeui-avatar-025-ring:0.25rem;
--vibeui-avatar-025-gap:0.25rem;
--vibeui-avatar-025-accent:oklch(0.7 0.13 75);
--vibeui-avatar-025-track:oklch(0.9 0.008 265);
--vibeui-avatar-025-bg:oklch(1 0 0);
--vibeui-avatar-025-fg:oklch(0.24 0.014 265);
--vibeui-avatar-025-muted:oklch(0.55 0.014 265);
--vibeui-avatar-025-border:oklch(0.91 0.006 265);
--vibeui-avatar-025-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: тёмный текст обязан читаться на любом фоне. */
[data-vibeui-block="avatar-025"]{
display:flex;align-items:center;gap:0.875rem;
box-sizing:border-box;width:100%;max-width:19rem;padding:0.75rem 0.875rem;
background:var(--vibeui-avatar-025-bg);
border:1px solid var(--vibeui-avatar-025-border);border-radius:0.875rem;
font-family:var(--vibeui-avatar-025-font);color:var(--vibeui-avatar-025-fg);
}
[data-vibeui-block="avatar-025"] *{box-sizing:border-box}
[data-vibeui-block="avatar-025"][data-rank="bronze"]{--vibeui-avatar-025-accent:oklch(0.62 0.11 55)}
[data-vibeui-block="avatar-025"][data-rank="silver"]{--vibeui-avatar-025-accent:oklch(0.72 0.02 265)}
[data-vibeui-block="avatar-025"][data-rank="gold"]{--vibeui-avatar-025-accent:oklch(0.78 0.14 85)}
[data-vibeui-block="avatar-025"] [data-part="slot"]{
position:relative;display:grid;place-items:center;flex:none;
width:calc(var(--vibeui-avatar-025-size) + (var(--vibeui-avatar-025-ring) + var(--vibeui-avatar-025-gap)) * 2);
height:calc(var(--vibeui-avatar-025-size) + (var(--vibeui-avatar-025-ring) + var(--vibeui-avatar-025-gap)) * 2);
}
/* Маска на обёртке кольца режет обе дорожки разом. */
[data-vibeui-block="avatar-025"] [data-part="ring"]{
position:absolute;inset:0;border-radius:9999px;
mask-image:radial-gradient(circle closest-side,transparent calc(100% - var(--vibeui-avatar-025-ring)),#000 calc(100% - var(--vibeui-avatar-025-ring)));
}
[data-vibeui-block="avatar-025"] [data-part="track"],
[data-vibeui-block="avatar-025"] [data-part="fill"]{
position:absolute;inset:0;border-radius:9999px;
background:repeating-conic-gradient(from -90deg,var(--vibeui-avatar-025-track) 0 32.4deg,transparent 32.4deg 36deg);
}
[data-vibeui-block="avatar-025"] [data-part="fill"]{
background:repeating-conic-gradient(from -90deg,var(--vibeui-avatar-025-accent) 0 32.4deg,transparent 32.4deg 36deg);
mask-image:conic-gradient(from -90deg,#000 var(--vibeui-avatar-025-fill,0deg),transparent 0);
}
[data-vibeui-block="avatar-025"] [data-part="face"]{
display:grid;place-items:center;
width:var(--vibeui-avatar-025-size);height:var(--vibeui-avatar-025-size);
border-radius:9999px;
background:oklch(0.9 0.06 var(--vibeui-avatar-025-hue,265));
color:oklch(0.36 0.12 var(--vibeui-avatar-025-hue,265));
font-size:calc(var(--vibeui-avatar-025-size) * 0.32);font-weight:700;line-height:1;
}
/* Шестиугольник снизу по центру: угол оставлен присутствию. */
[data-vibeui-block="avatar-025"] [data-part="level"]{
position:absolute;bottom:-0.1875rem;left:50%;transform:translateX(-50%);
display:grid;place-items:center;width:1.5rem;height:1.6875rem;
clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);
background:var(--vibeui-avatar-025-accent);color:oklch(0.22 0.03 75);
font-size:0.6875rem;font-weight:750;line-height:1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="avatar-025"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="avatar-025"] [data-part="name"]{
font-size:0.9375rem;font-weight:650;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="avatar-025"] [data-part="rank"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="avatar-025"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-avatar-025-muted);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="avatar-025"] *{animation:none!important;transition:none!important}}
`

const RANK_LABEL = {
  bronze: "Бронза",
  silver: "Серебро",
  gold: "Золото",
} as const

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
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

/**
 * Аватар с уровнем: кольцо из десяти делений, ранг словом и номер в шестиугольнике.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Avatar025({
  name = "Пётр Гай",
  level = 7,
  progress = 60,
  rank = "silver",
  className,
  style,
  ...props
}: Avatar025Props) {
  const safeProgress = Math.min(100, Math.max(0, progress))

  const palette = {
    "--vibeui-avatar-025-hue": hue(name),
    "--vibeui-avatar-025-fill": `${safeProgress * 3.6}deg`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-avatar-025" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="avatar-025"
        data-rank={rank}
        className={className}
        style={palette}
      >
        <span data-part="slot">
          <span data-part="ring" aria-hidden="true">
            <span data-part="track" />
            <span data-part="fill" />
          </span>
          <span data-part="face" aria-hidden="true">
            {initials(name)}
          </span>
          <span data-part="level" aria-hidden="true">
            {level}
          </span>
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="rank">
            {RANK_LABEL[rank]}, уровень {level}
          </span>
          {/* Проценты словами: сегменты кольца скринридер не читает. */}
          <span data-part="hint">до следующего уровня {safeProgress} %</span>
        </span>
      </div>
    </>
  )
}
