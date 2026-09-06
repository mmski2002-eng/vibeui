import type { ComponentProps, CSSProperties } from "react"

export type Payments001Item = {
  label: string
  price: string
}

export type Payments001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /** Подпись строки итога. */
  totalLabel?: string
  title?: string
  badge?: string
  items?: Payments001Item[]
  total?: string
  payLabel?: string
  accent?: string
  /** Радужное свечение под карточкой (дышит). false — плоская карточка. */
  gradient?: boolean
  /** Изометрический наклон карточки. */
  isometric?: boolean
  /** Пульсирующее свечение вокруг кнопки «Оплатить». */
  pulse?: boolean
}

// Идея: сводка заказа перед оплатой — строки позиций въезжают по очереди
// снизу вверх (stagger при появлении), итог держится жирной строкой у низа
// карточки, а кнопка «Оплатить» держит ровный пульс свечения — она и есть
// точка действия, к которой ведёт вся сводка.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит компонент в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
const STYLES = `
:where([data-vibeui-block="payments-001"]){
--vibeui-payments-001-frame:light-dark(oklch(0.968 0 0),oklch(0.225 0 0));
--vibeui-payments-001-card:light-dark(oklch(1 0 0),oklch(0.205 0 0));
--vibeui-payments-001-fg:light-dark(oklch(0.205 0 0),oklch(0.95 0 0));
--vibeui-payments-001-muted:color-mix(in oklab,var(--vibeui-payments-001-fg) 60%,transparent);
--vibeui-payments-001-border:light-dark(oklch(0.92 0 0),oklch(0.275 0 0));
--vibeui-payments-001-accent:light-dark(oklch(0.6 0.16 155),oklch(0.75 0.15 155));
--vibeui-payments-001-accent-fg:oklch(from var(--vibeui-payments-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-payments-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-payments-001-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Liberation Mono",monospace;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="payments-001"]{color-scheme:dark}
[data-vibeui-block="payments-001"]{
display:block;box-sizing:border-box;width:100%;max-width:20rem;margin:0;
color:var(--vibeui-payments-001-fg);font-family:var(--vibeui-payments-001-font);
}
[data-vibeui-block="payments-001"] *{box-sizing:border-box}
[data-vibeui-block="payments-001"] [data-part="stage"]{perspective:1400px}
[data-vibeui-block="payments-001"] [data-part="frame"]{
position:relative;isolation:isolate;padding:0.375rem;
border-radius:1.5rem;border:1px solid var(--vibeui-payments-001-border);
background:color-mix(in oklab,var(--vibeui-payments-001-frame) 75%,transparent);
transition:transform .3s ease;transform-origin:center;
}
[data-vibeui-block="payments-001"] [data-part="glow"]{
position:absolute;left:0.3125rem;right:0.3125rem;bottom:0;height:4.5rem;z-index:0;
border-radius:9999px 9999px 0.75rem 0.75rem;
background:var(--vibeui-payments-001-accent);
filter:blur(9px);opacity:0.5;transform-origin:center bottom;
animation:vibeui-payments-001-breathe 4.5s ease-in-out infinite;
}
[data-vibeui-block="payments-001"][data-flat="true"] [data-part="glow"]{display:none}
[data-vibeui-block="payments-001"] [data-part="card"]{
position:relative;z-index:1;
border-radius:1rem;border:1px solid var(--vibeui-payments-001-border);
background:var(--vibeui-payments-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.05);
}
[data-vibeui-block="payments-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.6875rem 0.75rem;border-bottom:1px solid var(--vibeui-payments-001-border);
}
[data-vibeui-block="payments-001"] [data-part="gtitle"]{
margin:0;font-size:0.75rem;font-weight:650;letter-spacing:-0.01em;
}
[data-vibeui-block="payments-001"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
height:1.125rem;padding:0 0.4375rem;border-radius:9999px;
font-size:0.625rem;font-weight:650;
color:var(--vibeui-payments-001-muted);background:var(--vibeui-payments-001-frame);
}
[data-vibeui-block="payments-001"] [data-part="items"]{
display:flex;flex-direction:column;margin:0;padding:0.75rem 0.875rem 0.625rem;list-style:none;
}
/* Строки въезжают по очереди снизу вверх при появлении карточки. */
[data-vibeui-block="payments-001"] [data-part="row"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
padding:0.3125rem 0;
animation:vibeui-payments-001-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
}
[data-vibeui-block="payments-001"] [data-part="row"]:nth-child(1){animation-delay:0.05s}
[data-vibeui-block="payments-001"] [data-part="row"]:nth-child(2){animation-delay:0.16s}
[data-vibeui-block="payments-001"] [data-part="row"]:nth-child(3){animation-delay:0.27s}
[data-vibeui-block="payments-001"] [data-part="row"]:nth-child(4){animation-delay:0.38s}
[data-vibeui-block="payments-001"] [data-part="row"]:nth-child(5){animation-delay:0.49s}
[data-vibeui-block="payments-001"] [data-part="row"]:nth-child(6){animation-delay:0.6s}
[data-vibeui-block="payments-001"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;color:var(--vibeui-payments-001-muted);
}
[data-vibeui-block="payments-001"] [data-part="price"]{
flex:none;font-family:var(--vibeui-payments-001-mono);font-size:0.75rem;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="payments-001"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin:0.125rem 0.875rem 0;padding:0.75rem 0;
border-top:1px dashed var(--vibeui-payments-001-border);
animation:vibeui-payments-001-rise 0.5s cubic-bezier(0.22,1,0.36,1) both;
animation-delay:0.72s;
}
[data-vibeui-block="payments-001"] [data-part="total-label"]{
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="payments-001"] [data-part="total-price"]{
font-family:var(--vibeui-payments-001-mono);font-size:0.9375rem;font-weight:700;
font-variant-numeric:tabular-nums;letter-spacing:-0.01em;
}
[data-vibeui-block="payments-001"] [data-part="footer"]{padding:0 0.875rem 0.875rem}
[data-vibeui-block="payments-001"] [data-part="pay"]{
appearance:none;border:0;cursor:pointer;width:100%;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
min-height:2.375rem;border-radius:0.75rem;
background:var(--vibeui-payments-001-accent);color:var(--vibeui-payments-001-accent-fg);
font:inherit;font-size:0.8125rem;font-weight:650;
animation:vibeui-payments-001-pulse 2.6s ease-in-out infinite;
animation-delay:0.9s;
}
[data-vibeui-block="payments-001"] [data-part="pay"] svg{width:0.9375rem;height:0.9375rem}
[data-vibeui-block="payments-001"] [data-part="pay"]:focus-visible{
outline:2px solid var(--vibeui-payments-001-accent);outline-offset:2px;
}
[data-vibeui-block="payments-001"][data-pulse="false"] [data-part="pay"]{animation:none}
@keyframes vibeui-payments-001-breathe{0%,100%{transform:scaleX(0.82);opacity:0.4}50%{transform:scaleX(1);opacity:0.58}}
@keyframes vibeui-payments-001-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes vibeui-payments-001-pulse{
0%,100%{box-shadow:0 0 0 0 color-mix(in oklab,var(--vibeui-payments-001-accent) 45%,transparent)}
50%{box-shadow:0 0 0 7px color-mix(in oklab,var(--vibeui-payments-001-accent) 0%,transparent)}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="payments-001"] [data-part="glow"]{animation:none;transform:scaleX(0.92)}
[data-vibeui-block="payments-001"] [data-part="row"]{animation:none}
[data-vibeui-block="payments-001"] [data-part="total"]{animation:none}
[data-vibeui-block="payments-001"] [data-part="pay"]{animation:none}
}
`

const LOCK = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)

const DEFAULT_ITEMS: Payments001Item[] = [
  { label: "Годовая подписка Pro", price: "4 990 ₽" },
  { label: "Дополнительное место", price: "990 ₽" },
  { label: "Приоритетная поддержка", price: "1 490 ₽" },
]

/**
 * Сводка заказа перед оплатой: позиции въезжают по очереди, итог держится
 * жирной строкой, кнопка «Оплатить» пульсирует свечением. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Payments001({
  totalLabel = "Итого",
  title = "Ваш заказ",
  badge = "3 позиции",
  items = DEFAULT_ITEMS,
  total = "7 470 ₽",
  payLabel = "Оплатить",
  accent,
  gradient = true,
  isometric = false,
  pulse = true,
  className,
  style,
  ...props
}: Payments001Props) {
  const palette = {
    ...(accent ? { "--vibeui-payments-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const frameStyle = isometric
    ? { transform: "rotateX(52deg) rotateZ(-42deg) scale(0.92)" }
    : undefined

  return (
    <>
      <style href="vibeui-payments-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="payments-001"
        data-slot="checkout-summary"
        data-flat={gradient ? undefined : "true"}
        data-pulse={pulse ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <div data-part="frame" style={frameStyle}>
            <div data-part="glow" aria-hidden="true" />
            <div data-part="card">
              <div data-part="head">
                <p data-part="gtitle">{title}</p>
                {badge ? <span data-part="badge">{badge}</span> : null}
              </div>
              <ul data-part="items">
                {items.map((item) => (
                  <li data-part="row" key={item.label}>
                    <span data-part="label">{item.label}</span>
                    <span data-part="price">{item.price}</span>
                  </li>
                ))}
              </ul>
              <div data-part="total">
                <span data-part="total-label">{totalLabel}</span>
                <span data-part="total-price">{total}</span>
              </div>
              <div data-part="footer">
                <button type="button" data-part="pay">
                  {LOCK}
                  {payLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
