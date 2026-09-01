"use client"

import {
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
} from "react"

export type PaymentMethodValue = "card" | "wallet" | "invoice"

export type Icontile015Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultMethod?: PaymentMethodValue
  method?: PaymentMethodValue
  onMethodChange?: (method: PaymentMethodValue) => void
}

function CardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M15 12h3" />
    </svg>
  )
}

function InvoiceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3h9l3 3v15H6Z" />
      <path d="M9 10h6M9 14h6M9 18h3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l5 5L19 7" />
    </svg>
  )
}

const METHODS: { value: PaymentMethodValue; title: string; hint: string }[] = [
  { value: "card", title: "Карта", hint: "Visa, Mastercard, Мир" },
  { value: "wallet", title: "Кошелёк", hint: "Баланс аккаунта" },
  { value: "invoice", title: "Счёт", hint: "Для юрлиц" },
]

const ORDER: PaymentMethodValue[] = METHODS.map((item) => item.value)

const ICONS: Record<PaymentMethodValue, () => ReactElement> = {
  card: CardIcon,
  wallet: WalletIcon,
  invoice: InvoiceIcon,
}

// Идея компонента: способ оплаты — это выбор одного варианта из
// взаимоисключающего набора, а не три независимые кнопки. Поэтому группа
// собрана как настоящий role="radiogroup" с roving tabindex и стрелками —
// таб входит в группу один раз, дальше по вариантам водят стрелки, как в
// нативном <input type="radio">. Выбранный вариант помечен не только
// заливкой, но и галочкой в углу: одного цвета недостаточно при нарушении
// цветовосприятия.
const STYLES = `
:where([data-vibeui-block="icontile-015"]){
container-type:inline-size;
--vibeui-icontile-015-hue:262;
--vibeui-icontile-015-fg:oklch(0.26 0.014 265);
--vibeui-icontile-015-muted:oklch(0.52 0.014 265);
--vibeui-icontile-015-border:oklch(0.88 0.006 265);
--vibeui-icontile-015-surface:oklch(1 0 0);
--vibeui-icontile-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="icontile-015"]{
display:flex;flex-direction:column;gap:0.625rem;min-width:0;
box-sizing:border-box;font-family:var(--vibeui-icontile-015-font);
}
[data-vibeui-block="icontile-015"] [data-part="legend"]{
display:block;margin:0;font-size:0.8125rem;font-weight:650;
color:var(--vibeui-icontile-015-muted);
}
[data-vibeui-block="icontile-015"] [data-part="group"]{
display:grid;grid-template-columns:repeat(3, minmax(0, 1fr));gap:0.625rem;min-width:0;
}
[data-vibeui-block="icontile-015"] [data-part="option"]{
position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:0.5rem;
box-sizing:border-box;min-width:0;padding:0.75rem;text-align:left;
background:var(--vibeui-icontile-015-surface);
border:1px solid var(--vibeui-icontile-015-border);border-radius:0.75rem;
font:inherit;color:inherit;cursor:pointer;
transition:border-color 0.15s ease, background 0.15s ease;
}
[data-vibeui-block="icontile-015"] [data-part="option"]:focus-visible{
outline:2px solid oklch(0.55 0.18 var(--vibeui-icontile-015-hue));outline-offset:2px;
}
[data-vibeui-block="icontile-015"] [data-part="icon"]{
display:grid;place-items:center;flex:none;width:1.75rem;height:1.75rem;
border-radius:0.5rem;background:oklch(0.94 0.01 265);color:var(--vibeui-icontile-015-muted);
}
[data-vibeui-block="icontile-015"] [data-part="icon"] > svg{width:60%;height:60%}
[data-vibeui-block="icontile-015"] [data-part="title"]{
display:block;margin:0;font-size:0.875rem;font-weight:650;max-width:100%;
color:var(--vibeui-icontile-015-fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-015"] [data-part="hint"]{
display:block;margin:0;font-size:0.75rem;max-width:100%;
color:var(--vibeui-icontile-015-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-015"] [data-part="check"]{
position:absolute;top:0.5rem;right:0.5rem;display:none;place-items:center;
width:1.125rem;height:1.125rem;border-radius:50%;
background:oklch(0.55 0.18 var(--vibeui-icontile-015-hue));color:oklch(0.99 0 0);
}
[data-vibeui-block="icontile-015"] [data-part="check"] > svg{width:65%;height:65%}
[data-vibeui-block="icontile-015"] [data-part="option"][aria-checked="true"]{
border-color:oklch(0.55 0.18 var(--vibeui-icontile-015-hue));
background:oklch(0.97 0.014 var(--vibeui-icontile-015-hue));
}
[data-vibeui-block="icontile-015"] [data-part="option"][aria-checked="true"] [data-part="icon"]{
background:oklch(0.9 0.03 var(--vibeui-icontile-015-hue));
color:oklch(0.4 0.1 var(--vibeui-icontile-015-hue));
}
[data-vibeui-block="icontile-015"] [data-part="option"][aria-checked="true"] [data-part="check"]{
display:grid;
}
@container (max-width: 300px){
[data-vibeui-block="icontile-015"] [data-part="group"]{grid-template-columns:1fr}
[data-vibeui-block="icontile-015"] [data-part="option"]{flex-direction:row;align-items:center}
}
@media (prefers-reduced-motion: reduce){
[data-vibeui-block="icontile-015"] [data-part="option"]{transition:none}
}
`

/**
 * Плитка выбора способа оплаты: карта, кошелёк и счёт в роли настоящего
 * radiogroup со стрелочной навигацией. Выбор отмечен рамкой и галочкой.
 * Один файл, ноль внешних зависимостей, состояние в useState.
 */
export function Icontile015({
  label = "Способ оплаты",
  defaultMethod = "card",
  method,
  onMethodChange,
  className,
  style,
  ...props
}: Icontile015Props) {
  const legendId = useId()
  const [internal, setInternal] = useState<PaymentMethodValue>(defaultMethod)
  const current = method ?? internal

  function select(value: PaymentMethodValue) {
    if (method === undefined) setInternal(value)
    onMethodChange?.(value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = ORDER.indexOf(current)
    let nextIndex = index

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % ORDER.length
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + ORDER.length) % ORDER.length
    } else {
      return
    }

    event.preventDefault()
    select(ORDER[nextIndex])
  }

  return (
    <>
      <style href="vibeui-icontile-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="icontile-015"
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="legend" id={legendId}>
          {label}
        </span>
        <div
          data-part="group"
          role="radiogroup"
          aria-labelledby={legendId}
        >
          {METHODS.map((item) => {
            const Icon = ICONS[item.value]
            const checked = item.value === current

            return (
              <button
                key={item.value}
                type="button"
                data-part="option"
                role="radio"
                aria-checked={checked}
                tabIndex={checked ? 0 : -1}
                onClick={() => select(item.value)}
                onKeyDown={handleKeyDown}
              >
                <span data-part="icon">
                  <Icon />
                </span>
                <span data-part="title">{item.title}</span>
                <span data-part="hint">{item.hint}</span>
                <span data-part="check" aria-hidden="true">
                  <CheckIcon />
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
