import type { ComponentProps, CSSProperties } from "react"

export type Status002Tone = "ok" | "degraded" | "down"

export type Status002Day = {
  tone: Status002Tone
  /** Подпись дня для доступности, например "12 сентября". */
  label?: string
}

export type Status002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Подписи состояний дня. */
  stateText?: Record<Status002Tone, string>
  /** Подпись дня без своей метки. {index} подставляется номером. */
  dayTemplate?: string
  title?: string
  /** Подпись под процентом, например период наблюдения. */
  period?: string
  /** Итоговый аптайм в процентах, с одним знаком после запятой. */
  uptime?: number
  days?: Status002Day[]
  accent?: string
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
}

const STATUS_LABEL: Record<Status002Tone, string> = {
  ok: "Норма",
  degraded: "Деградация",
  down: "Простой",
}

// Идея: ряд тонких столбиков — по одному на день, цвет несёт статус. При
// монтировании столбики вырастают снизу вверх слева направо (задержка от
// позиции в ряду), а крупный процент аптайма считается вверх от нуля —
// чистым CSS через типизированное @property и counter(), без единой строки
// JS. Если браузер не знает @property, процент просто сразу стоит на месте:
// деградации в конечном результате нет, теряется только сам подсчёт.
const STYLES = `
:where([data-vibeui-block="status-002"]){
--vibeui-status-002-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-status-002-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-status-002-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-status-002-muted:color-mix(in oklab,var(--vibeui-status-002-fg) 62%,transparent);
--vibeui-status-002-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-status-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-status-002-ok:light-dark(oklch(0.66 0.17 150),oklch(0.76 0.15 150));
--vibeui-status-002-warn:light-dark(oklch(0.75 0.16 75),oklch(0.8 0.14 75));
--vibeui-status-002-down:light-dark(oklch(0.62 0.21 25),oklch(0.7 0.19 25));
--vibeui-status-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="status-002"]{color-scheme:dark}
[data-vibeui-block="status-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-status-002-fg);font-family:var(--vibeui-status-002-font);
}
[data-vibeui-block="status-002"] *{box-sizing:border-box}
[data-vibeui-block="status-002"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="status-002"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-status-002-border);
background:color-mix(in oklab,var(--vibeui-status-002-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="status-002"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:linear-gradient(to right,var(--vibeui-status-002-down),var(--vibeui-status-002-warn),var(--vibeui-status-002-ok),var(--vibeui-status-002-accent));
filter:blur(7px);opacity:0.55;transform-origin:center bottom;
animation:vibeui-status-002-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="status-002"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="status-002"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-status-002-border);
background:var(--vibeui-status-002-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
padding:0.875rem 1rem 1rem;
}
[data-vibeui-block="status-002"] [data-part="head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;margin-bottom:0.875rem;
}
[data-vibeui-block="status-002"] [data-part="titles"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
[data-vibeui-block="status-002"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="status-002"] [data-part="period"]{
font-size:0.625rem;color:var(--vibeui-status-002-muted);
}
[data-vibeui-block="status-002"] [data-part="pct-wrap"]{
flex:none;text-align:right;
}
@property --vibeui-status-002-whole{
syntax:'<integer>';
inherits:true;
initial-value:0;
}
@property --vibeui-status-002-tenth{
syntax:'<integer>';
inherits:true;
initial-value:0;
}
[data-vibeui-block="status-002"] [data-part="pct"]{
--vibeui-status-002-whole:var(--vibeui-status-002-target-whole,0);
--vibeui-status-002-tenth:var(--vibeui-status-002-target-tenth,0);
counter-reset:vibeui-status-002-whole var(--vibeui-status-002-whole) vibeui-status-002-tenth var(--vibeui-status-002-tenth);
font-size:1.375rem;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
color:var(--vibeui-status-002-ok);
animation:vibeui-status-002-count 1.8s .3s cubic-bezier(.16,1,.3,1) both;
}
[data-vibeui-block="status-002"] [data-part="pct"]::after{
content:counter(vibeui-status-002-whole) "." counter(vibeui-status-002-tenth) "%";
}
[data-vibeui-block="status-002"] [data-part="bars"]{
display:flex;align-items:flex-end;gap:0.15625rem;height:2.25rem;
}
[data-vibeui-block="status-002"] [data-part="bar"]{
flex:1;min-width:0.125rem;height:100%;border-radius:1px;
transform-origin:bottom;
animation:vibeui-status-002-rise .5s cubic-bezier(.16,1,.3,1) both;
animation-delay:var(--vibeui-status-002-delay,0s);
}
[data-vibeui-block="status-002"] [data-tone="ok"][data-part="bar"]{background:var(--vibeui-status-002-ok)}
[data-vibeui-block="status-002"] [data-tone="degraded"][data-part="bar"]{background:var(--vibeui-status-002-warn)}
[data-vibeui-block="status-002"] [data-tone="down"][data-part="bar"]{background:var(--vibeui-status-002-down)}
[data-vibeui-block="status-002"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
@keyframes vibeui-status-002-breathe{0%,100%{transform:scaleX(0.8)}50%{transform:scaleX(1)}}
@keyframes vibeui-status-002-count{
from{--vibeui-status-002-whole:0;--vibeui-status-002-tenth:0}
to{--vibeui-status-002-whole:var(--vibeui-status-002-target-whole,0);--vibeui-status-002-tenth:var(--vibeui-status-002-target-tenth,0)}
}
@keyframes vibeui-status-002-rise{from{opacity:0;transform:scaleY(0.05)}to{opacity:1;transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="status-002"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="status-002"] [data-part="pct"]{animation:none}
[data-vibeui-block="status-002"] [data-part="bar"]{animation:none}
}
`

const DEFAULT_DAYS: Status002Day[] = Array.from({ length: 30 }, (_, index) => {
  const tone: Status002Tone =
    index === 5
      ? "degraded"
      : index === 18
        ? "down"
        : index === 23
          ? "degraded"
          : "ok"
  return { tone }
})

const BAR_STAGGER_MS = 480

/**
 * Полоса аптайма: столбик на каждый день, статус несёт цвет, столбики
 * вырастают слева направо при монтировании, крупный процент считается
 * вверх от нуля чистым CSS (@property + counter). Один файл, ноль
 * зависимостей, собственная палитра, клиентского JS нет.
 */
export function Status002({
  stateText = STATUS_LABEL,
  dayTemplate = "День {index}",
  title = "Аптайм сервиса",
  period = "Последние 30 дней",
  uptime = 99.8,
  days = DEFAULT_DAYS,
  accent,
  isometric = false,
  gradient = true,
  className,
  style,
  ...props
}: Status002Props) {
  const palette = {
    ...(accent ? { "--vibeui-status-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  const whole = Math.trunc(uptime)
  const tenth = Math.round((uptime - whole) * 10)
  const pctStyle = {
    "--vibeui-status-002-target-whole": whole,
    "--vibeui-status-002-target-tenth": tenth,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-status-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="status-002"
        data-slot="uptime-bar"
        data-flat={gradient ? undefined : "true"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <div data-part="titles">
                  <p data-part="gtitle">{title}</p>
                  {period ? <span data-part="period">{period}</span> : null}
                </div>
                <div data-part="pct-wrap">
                  <span data-part="pct" style={pctStyle} aria-hidden="true" />
                </div>
              </div>
              <div data-part="bars" aria-hidden="true">
                {days.map((day, index) => {
                  const delayMs = (index / days.length) * BAR_STAGGER_MS
                  return (
                    <span
                      data-part="bar"
                      data-tone={day.tone}
                      key={day.label ?? index}
                      style={
                        {
                          "--vibeui-status-002-delay": `${delayMs}ms`,
                        } as CSSProperties
                      }
                    />
                  )
                })}
              </div>
              <p data-part="sr">
                {title}: {uptime.toFixed(1)}% {period}.{" "}
                {days
                  .map(
                    (day, index) =>
                      `${day.label ?? dayTemplate.replace("{index}", String(index + 1))}: ${stateText[day.tone]}`,
                  )
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
