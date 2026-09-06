import type { ComponentProps, CSSProperties } from "react"

export type Payments002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Текст для aria-label: секция декоративна, содержимого для чтения нет. */
  label?: string
  brand?: string
  number?: string
  holder?: string
  expiry?: string
  accent?: string
  /** Лёгкий 3D-наклон карточки в цикле. false — карточка лежит плоско. */
  tilt?: boolean
  /** Блик, скользящий по чипу. */
  shimmer?: boolean
}

// Идея: банковская карта в перспективе покачивается вокруг вертикальной оси
// (perspective + rotateY, бесконечный цикл) — лёгкий наклон, а не полный
// переворот, обратной стороны у карты нет. По чипу слева сверху раз в
// несколько секунд пробегает диагональный блик, как отражение на металле.
// Номер набран моноширинным шрифтом с разрядкой, имя держателя и срок —
// снизу по краям.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="payments-002"]){
--vibeui-payments-002-from:light-dark(oklch(0.5 0.16 275),oklch(0.4 0.15 275));
--vibeui-payments-002-to:light-dark(oklch(0.28 0.09 300),oklch(0.16 0.07 300));
--vibeui-payments-002-fg:oklch(0.98 0 275);
--vibeui-payments-002-muted:oklch(0.98 0 275 / 62%);
--vibeui-payments-002-chip:linear-gradient(155deg,oklch(0.86 0.09 95),oklch(0.68 0.1 75));
--vibeui-payments-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-payments-002-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="payments-002"]{color-scheme:dark}
[data-vibeui-block="payments-002"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
font-family:var(--vibeui-payments-002-font);
}
[data-vibeui-block="payments-002"] *{box-sizing:border-box}
[data-vibeui-block="payments-002"] [data-part="stage"]{padding:1.25rem 0.75rem;perspective:1400px}
[data-vibeui-block="payments-002"] [data-part="card"]{
position:relative;isolation:isolate;overflow:hidden;
aspect-ratio:1.586;border-radius:1rem;padding:1.125rem 1.25rem;
display:flex;flex-direction:column;justify-content:space-between;
background:linear-gradient(135deg,var(--vibeui-payments-002-from),var(--vibeui-payments-002-to));
color:var(--vibeui-payments-002-fg);
box-shadow:0 1.5rem 2.5rem -1.25rem oklch(0 0 0 / 0.45),inset 0 1px 0 color-mix(in oklab,white 16%,transparent);
transform-origin:center;transform-style:preserve-3d;
animation:vibeui-payments-002-tilt 6s ease-in-out infinite;
}
[data-vibeui-block="payments-002"][data-tilt="false"] [data-part="card"]{animation:none}
[data-vibeui-block="payments-002"] [data-part="top"]{
position:relative;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="payments-002"] [data-part="chip"]{
position:relative;isolation:isolate;overflow:hidden;
width:2.25rem;height:1.6875rem;border-radius:0.375rem;
background:var(--vibeui-payments-002-chip);
box-shadow:inset 0 0 0 1px color-mix(in oklab,black 25%,transparent);
}
[data-vibeui-block="payments-002"] [data-part="chip"] svg{
position:absolute;inset:0.1875rem;width:calc(100% - 0.375rem);height:calc(100% - 0.375rem);
color:color-mix(in oklab,black 35%,transparent);
}
[data-vibeui-block="payments-002"] [data-part="shimmer"]{
position:absolute;inset:-40% -120%;z-index:1;pointer-events:none;
background:linear-gradient(75deg,transparent 42%,color-mix(in oklab,white 85%,transparent) 50%,transparent 58%);
transform:translateX(-70%);
animation:vibeui-payments-002-shimmer 4.5s ease-in-out infinite;
}
[data-vibeui-block="payments-002"][data-shimmer="false"] [data-part="shimmer"]{display:none}
[data-vibeui-block="payments-002"] [data-part="brand"]{
font-size:0.8125rem;font-weight:750;letter-spacing:0.02em;
color:var(--vibeui-payments-002-fg);text-transform:uppercase;
}
[data-vibeui-block="payments-002"] [data-part="number"]{
position:relative;z-index:1;margin:0;
font-family:var(--vibeui-payments-002-mono);font-size:1.0625rem;font-weight:600;
letter-spacing:0.14em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="payments-002"] [data-part="bottom"]{
position:relative;z-index:1;display:flex;align-items:flex-end;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="payments-002"] [data-part="field"]{display:flex;flex-direction:column;gap:0.1875rem;min-width:0}
[data-vibeui-block="payments-002"] [data-part="field-label"]{
font-size:0.5rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-payments-002-muted);
}
[data-vibeui-block="payments-002"] [data-part="field-value"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-family:var(--vibeui-payments-002-mono);font-size:0.75rem;font-weight:600;letter-spacing:0.03em;
}
@keyframes vibeui-payments-002-tilt{
0%,100%{transform:rotateY(-9deg) rotateX(2deg)}
50%{transform:rotateY(9deg) rotateX(-2deg)}
}
@keyframes vibeui-payments-002-shimmer{
0%,18%{transform:translateX(-70%);opacity:0}
32%{opacity:0.85}
55%,100%{transform:translateX(70%);opacity:0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="payments-002"] [data-part="card"]{animation:none}
[data-vibeui-block="payments-002"] [data-part="shimmer"]{animation:none;display:none}
}
`

const CHIP_LINES = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" fill="none" aria-hidden="true">
    <rect x="0.5" y="0.5" width="23" height="17" rx="2.5" stroke="currentColor" />
    <path d="M8 0.5V17.5M16 0.5V17.5M0.5 6H8M16 6H23.5M0.5 12H8M16 12H23.5" stroke="currentColor" strokeWidth="0.75" />
  </svg>
)

/**
 * Банковская карта в перспективе: покачивается вокруг вертикальной оси,
 * по чипу пробегает блик. Один файл, ноль зависимостей, собственная
 * палитра, клиентского JS нет.
 */
export function Payments002({
  label = "Банковская карта",
  brand = "Nova Pay",
  number = "4242 4242 4242 4242",
  holder = "A. Ivanov",
  expiry = "09/29",
  accent,
  tilt = true,
  shimmer = true,
  className,
  style,
  ...props
}: Payments002Props) {
  const palette = {
    ...(accent ? { "--vibeui-payments-002-from": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-payments-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="payments-002"
        data-slot="credit-card"
        data-tilt={tilt ? undefined : "false"}
        data-shimmer={shimmer ? undefined : "false"}
        className={className}
        style={palette}
        role="img"
        aria-label={`${label}: ${brand}, ${number}, ${holder}, ${expiry}`}
      >
        <div data-part="stage">
          <div data-part="card">
            <div data-part="top">
              <span data-part="chip" aria-hidden="true">
                {CHIP_LINES}
                <span data-part="shimmer" />
              </span>
              <span data-part="brand">{brand}</span>
            </div>
            <p data-part="number">{number}</p>
            <div data-part="bottom">
              <span data-part="field">
                <span data-part="field-label">Card holder</span>
                <span data-part="field-value">{holder}</span>
              </span>
              <span data-part="field">
                <span data-part="field-label">Expires</span>
                <span data-part="field-value">{expiry}</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
