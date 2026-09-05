import { Fragment, type ComponentProps, type CSSProperties } from "react"

export type Stats001Stat = {
  /** Целевое значение — считается от нуля при появлении. */
  value: number
  /** Хвост после числа: "%", "K+", "мс" и т. п. */
  suffix?: string
  label: string
}

export type Stats001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  kicker?: string
  title?: string
  description?: string
  stats?: Stats001Stat[]
  accent?: string
  /** Заголовок и подпись слева вместо центра. */
  align?: "center" | "left"
  /** Вертикальные разделители между числами. */
  dividers?: boolean
}

// Идея: ряд крупных чисел, которые считаются от нуля до цели через
// анимируемое @property (CSS Houdini) — интерполяция целого числа кадр за
// кадром без единой строчки JS. Счётчик читает значение через counter().
// Между колонками — вертикальные разделители, они проявляются отдельным
// fade-in с нарастающей задержкой, будто сборка ряда идёт слева направо.
// container-type делает секцию собственным query-контейнером: в узкой
// колонке числа складываются в две колонки, в полную ширину — в один ряд.
const STYLES = `
:where([data-vibeui-block="stats-001"]){
--vibeui-stats-001-bg:transparent;
--vibeui-stats-001-fg:light-dark(oklch(0.19 0.016 266),oklch(0.98 0.003 266));
--vibeui-stats-001-muted:light-dark(oklch(0.5 0.021 266),oklch(0.75 0.019 266));
--vibeui-stats-001-border:light-dark(oklch(0.16 0.014 266 / 14%),oklch(1 0 0 / 14%));
--vibeui-stats-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-stats-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stats-001"]{color-scheme:dark}
@property --vibeui-stats-001-n{
syntax:'<integer>';inherits:false;initial-value:0;
}
[data-vibeui-block="stats-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
container-type:inline-size;
background:var(--vibeui-stats-001-bg);color:var(--vibeui-stats-001-fg);
font-family:var(--vibeui-stats-001-font);
}
[data-vibeui-block="stats-001"] *{box-sizing:border-box}
[data-vibeui-block="stats-001"] [data-part="frame"]{
padding:clamp(2.5rem,10cqi,5rem) clamp(1.25rem,6cqi,2.5rem);
}
[data-vibeui-block="stats-001"] [data-part="head"]{
max-width:40rem;margin:0 auto;text-align:center;
}
[data-vibeui-block="stats-001"][data-align="left"] [data-part="head"]{
margin:0;text-align:left;
}
[data-vibeui-block="stats-001"][data-align="left"] [data-part="row"]{
justify-content:flex-start;
}
[data-vibeui-block="stats-001"] [data-part="kicker"]{
display:inline-flex;align-items:center;gap:0.5rem;margin:0 0 0.75rem;
font-size:0.75rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-stats-001-accent);
}
[data-vibeui-block="stats-001"] [data-part="title"]{
margin:0;font-size:clamp(1.5rem,4.5cqi,2.5rem);font-weight:650;
letter-spacing:-0.02em;line-height:1.15;text-wrap:balance;
}
[data-vibeui-block="stats-001"] [data-part="desc"]{
margin:0.875rem 0 0;font-size:clamp(0.9375rem,1.6cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-stats-001-muted);text-wrap:pretty;
}
[data-vibeui-block="stats-001"] [data-part="row"]{
display:flex;flex-wrap:wrap;justify-content:center;
margin-top:clamp(2rem,6cqi,3.5rem);
}
[data-vibeui-block="stats-001"] [data-part="cell"]{
display:flex;flex-direction:column;align-items:center;gap:0.375rem;
flex:1 1 9rem;min-width:9rem;padding:0.5rem 1rem;text-align:center;
}
[data-vibeui-block="stats-001"] [data-part="value"]{
font-size:clamp(2.25rem,7cqi,3.5rem);font-weight:750;letter-spacing:-0.03em;
line-height:1;font-variant-numeric:tabular-nums;color:var(--vibeui-stats-001-fg);
}
[data-vibeui-block="stats-001"] [data-part="count"]{
--vibeui-stats-001-n:0;counter-reset:vibeui-stats-001-c var(--vibeui-stats-001-n);
animation:vibeui-stats-001-count 1.3s cubic-bezier(.16,1,.3,1) both;
animation-delay:var(--vibeui-stats-001-delay,0s);
}
[data-vibeui-block="stats-001"] [data-part="count"]::after{content:counter(vibeui-stats-001-c)}
[data-vibeui-block="stats-001"] [data-part="suffix"]{color:var(--vibeui-stats-001-accent)}
[data-vibeui-block="stats-001"] [data-part="label"]{
font-size:0.875rem;font-weight:550;color:var(--vibeui-stats-001-muted);
}
[data-vibeui-block="stats-001"] [data-part="divider"]{
align-self:center;width:1px;height:2.5rem;margin:0 0.5rem;flex:none;
background:var(--vibeui-stats-001-border);opacity:0;
animation:vibeui-stats-001-fade .6s ease both;
animation-delay:var(--vibeui-stats-001-delay,0s);
}
[data-vibeui-block="stats-001"][data-dividers="false"] [data-part="divider"]{display:none}
@container (max-width:26rem){
[data-vibeui-block="stats-001"] [data-part="cell"]{flex-basis:40%}
[data-vibeui-block="stats-001"] [data-part="divider"]{display:none}
}
@keyframes vibeui-stats-001-count{from{--vibeui-stats-001-n:0}to{--vibeui-stats-001-n:var(--vibeui-stats-001-target)}}
@keyframes vibeui-stats-001-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="stats-001"] [data-part="count"]{animation:none;--vibeui-stats-001-n:var(--vibeui-stats-001-target)}
[data-vibeui-block="stats-001"] [data-part="divider"]{animation:none;opacity:1}
}
`

const DEFAULT_STATS: Stats001Stat[] = [
  { value: 128, suffix: "K+", label: "Активных пользователей" },
  { value: 42, suffix: "", label: "Стран с командами" },
  { value: 99, suffix: "%", label: "Время безотказной работы" },
  { value: 24, suffix: "/7", label: "Поддержка в чате" },
]

/**
 * Секция статистики: ряд крупных чисел, которые считаются от нуля до цели
 * через анимируемое @property, разделители проявляются по очереди. Один
 * файл, ноль зависимостей, клиентского JS нет.
 */
export function Stats001({
  kicker = "В цифрах",
  title = "Рост, который видно без презентации",
  description = "Метрики обновляются в реальном времени и синхронизированы с продовым дашбордом — здесь ровно то, что видит команда.",
  stats = DEFAULT_STATS,
  accent,
  align = "center",
  dividers = true,
  className,
  style,
  ...props
}: Stats001Props) {
  const palette = {
    ...(accent ? { "--vibeui-stats-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stats-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="stats-001"
        data-slot="stats-section"
        data-align={align === "left" ? "left" : undefined}
        data-dividers={dividers ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {kicker || title || description ? (
            <div data-part="head">
              {kicker ? <p data-part="kicker">{kicker}</p> : null}
              {title ? <h2 data-part="title">{title}</h2> : null}
              {description ? <p data-part="desc">{description}</p> : null}
            </div>
          ) : null}
          <div data-part="row">
            {stats.map((stat, index) => (
              <Fragment key={stat.label}>
                {index > 0 ? (
                  <span
                    data-part="divider"
                    aria-hidden="true"
                    style={
                      {
                        "--vibeui-stats-001-delay": `${index * 0.15}s`,
                      } as CSSProperties
                    }
                  />
                ) : null}
                <div data-part="cell">
                  <span data-part="value">
                    <span
                      data-part="count"
                      style={
                        {
                          "--vibeui-stats-001-target": stat.value,
                          "--vibeui-stats-001-delay": `${index * 0.15}s`,
                        } as CSSProperties
                      }
                    />
                    {stat.suffix ? (
                      <span data-part="suffix">{stat.suffix}</span>
                    ) : null}
                  </span>
                  <span data-part="label">{stat.label}</span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
