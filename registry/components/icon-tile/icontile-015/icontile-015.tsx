"use client"

import {
  useId,
  useState,
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type ReactElement,
} from "react"

export type PaymentMethodValue = "card" | "wallet" | "invoice"

export type Icontile015Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  defaultMethod?: PaymentMethodValue
  method?: PaymentMethodValue
  onMethodChange?: (method: PaymentMethodValue) => void
  /** Названия способов: компонент несёт русские, проект подставляет свои. */
  methodTitle?: Record<string, string>
  /** Пояснения под названиями способов. */
  methodHint?: Record<string, string>
  /** Пусто — подложки нет, группа лежит прямо на фоне страницы. */
  background?: string
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

const ORDER: PaymentMethodValue[] = ["card", "wallet", "invoice"]

const METHOD_TITLE: Record<string, string> = {
  card: "Карта",
  wallet: "Кошелёк",
  invoice: "Счёт",
}

const METHOD_HINT: Record<string, string> = {
  card: "Visa, Mastercard, Мир",
  wallet: "Баланс аккаунта",
  invoice: "Для юрлиц",
}

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
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница плитки светлее её фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="icontile-015"]){
--vibeui-icontile-015-hue:262;
--vibeui-icontile-015-fg:light-dark(oklch(0.26 0.014 265),oklch(0.94 0.006 265));
--vibeui-icontile-015-muted:color-mix(in oklab,var(--vibeui-icontile-015-fg) 68%,transparent);
--vibeui-icontile-015-border:light-dark(oklch(0.88 0.006 265),oklch(0.35 0.011 265));
--vibeui-icontile-015-surface:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-icontile-015-chip:light-dark(oklch(0.94 0.01 265),oklch(0.32 0.012 265));
--vibeui-icontile-015-accent:light-dark(oklch(0.55 0.18 var(--vibeui-icontile-015-hue)),oklch(0.74 0.15 var(--vibeui-icontile-015-hue)));
--vibeui-icontile-015-selected:light-dark(oklch(0.97 0.014 var(--vibeui-icontile-015-hue)),oklch(0.31 0.05 var(--vibeui-icontile-015-hue)));
--vibeui-icontile-015-selected-chip:light-dark(oklch(0.9 0.03 var(--vibeui-icontile-015-hue)),oklch(0.42 0.07 var(--vibeui-icontile-015-hue)));
--vibeui-icontile-015-selected-ink:light-dark(oklch(0.4 0.1 var(--vibeui-icontile-015-hue)),oklch(0.92 0.06 var(--vibeui-icontile-015-hue)));
--vibeui-icontile-015-on-accent:light-dark(oklch(0.99 0 0),oklch(0.2 0.02 var(--vibeui-icontile-015-hue)));
--vibeui-icontile-015-bg:transparent;
--vibeui-icontile-015-pad:0;
--vibeui-icontile-015-radius:0;
--vibeui-icontile-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-015"]{color-scheme:dark}
[data-vibeui-block="icontile-015"]{
display:flex;flex-direction:column;gap:0.625rem;min-width:0;
box-sizing:border-box;font-family:var(--vibeui-icontile-015-font);
padding:var(--vibeui-icontile-015-pad);
background:var(--vibeui-icontile-015-bg);
border-radius:var(--vibeui-icontile-015-radius);
}
[data-vibeui-block="icontile-015"] [data-part="legend"]{
display:block;margin:0;font-size:0.8125rem;font-weight:650;
color:var(--vibeui-icontile-015-muted);
}
/* Три колонки 1fr, без container-type на корне: контейнер отвязал бы ширину
   группы от содержимого, и в кадре, который меряет компонент по содержимому,
   она схлопнулась бы в ноль. Названия и пояснения сжимаются многоточием, так
   что узкая подложка ничего не ломает. */
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
outline:2px solid var(--vibeui-icontile-015-accent);outline-offset:2px;
}
[data-vibeui-block="icontile-015"] [data-part="icon"]{
display:grid;place-items:center;flex:none;width:1.75rem;height:1.75rem;
border-radius:0.5rem;background:var(--vibeui-icontile-015-chip);
color:var(--vibeui-icontile-015-muted);
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
background:var(--vibeui-icontile-015-accent);
color:var(--vibeui-icontile-015-on-accent);
}
[data-vibeui-block="icontile-015"] [data-part="check"] > svg{width:65%;height:65%}
[data-vibeui-block="icontile-015"] [data-part="option"][aria-checked="true"]{
border-color:var(--vibeui-icontile-015-accent);
background:var(--vibeui-icontile-015-selected);
}
[data-vibeui-block="icontile-015"] [data-part="option"][aria-checked="true"] [data-part="icon"]{
background:var(--vibeui-icontile-015-selected-chip);
color:var(--vibeui-icontile-015-selected-ink);
}
[data-vibeui-block="icontile-015"] [data-part="option"][aria-checked="true"] [data-part="check"]{
display:grid;
}
@media (prefers-reduced-motion: reduce){
[data-vibeui-block="icontile-015"] [data-part="option"]{transition:none}
}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

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
  methodTitle = METHOD_TITLE,
  methodHint = METHOD_HINT,
  background = "",
  className,
  style,
  ...props
}: Icontile015Props) {
  const legendId = useId()
  const [internal, setInternal] = useState<PaymentMethodValue>(defaultMethod)
  const current = method ?? internal
  // Поля появляются вместе с подложкой: без неё группа лежит прямо на
  // странице, и лишние отступы по краям ей только мешают.
  const palette = {
    ...(background
      ? {
          "--vibeui-icontile-015-bg": background,
          "--vibeui-icontile-015-pad": "0.875rem 1rem 1rem",
          "--vibeui-icontile-015-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

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
        data-slot="icon-tile"
        data-vibeui-block="icontile-015"
        className={className}
        style={palette}
      >
        <span data-part="legend" id={legendId}>
          {label}
        </span>
        <div data-part="group" role="radiogroup" aria-labelledby={legendId}>
          {ORDER.map((value) => {
            const Icon = ICONS[value]
            const checked = value === current

            return (
              <button
                key={value}
                type="button"
                data-part="option"
                role="radio"
                aria-checked={checked}
                tabIndex={checked ? 0 : -1}
                onClick={() => select(value)}
                onKeyDown={handleKeyDown}
              >
                <span data-part="icon">
                  <Icon />
                </span>
                <span data-part="title">
                  {methodTitle[value] ?? METHOD_TITLE[value]}
                </span>
                <span data-part="hint">
                  {methodHint[value] ?? METHOD_HINT[value]}
                </span>
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
