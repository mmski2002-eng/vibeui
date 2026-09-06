import type { ComponentProps, CSSProperties, ReactElement } from "react"

export type Button064Provider = "apple" | "google" | "card"

export type Button064Props = Omit<ComponentProps<"button">, "children"> & {
  /** Какой платёжный путь показывает кнопка. */
  provider?: Button064Provider
  /** Подпись до знака: «Оплатить», «Купить», «Подписаться». */
  label?: string
  /** Сумма справа. Пусто — кнопка без суммы. */
  amount?: string
  /** Строка под кнопкой: чем платит человек и что будет дальше. */
  note?: string
  accent?: string
  /** Поверхность страницы. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: последняя кнопка воронки. Она чёрная и во всю ширину не
// ради красоты — на этом шаге не должно быть ни одного конкурента за взгляд.
// Сумма стоит в самой кнопке: решение принимают по числу, а не по глаголу,
// и человек не листает обратно к корзине, чтобы вспомнить, сколько платит.
//
// Знак платёжной системы нарисован путями: логотип из картинки пришлось бы
// тащить файлом, а он обязан быть чётким на любой плотности экрана.
const STYLES = `
:where([data-vibeui-block="button-064"]){
--vibeui-button-064-bg:transparent;
--vibeui-button-064-ink:light-dark(oklch(0.18 0.01 265),oklch(0.94 0.006 265));
--vibeui-button-064-on-ink:light-dark(oklch(0.99 0 265),oklch(0.16 0.01 265));
--vibeui-button-064-fg:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-064-muted:color-mix(in oklab,var(--vibeui-button-064-fg) 60%,transparent);
--vibeui-button-064-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.14 39.8));
--vibeui-button-064-radius:0.75rem;
--vibeui-button-064-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-064"]{color-scheme:dark}
[data-vibeui-block="button-064"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-button-064-bg);
font-family:var(--vibeui-button-064-font);color:var(--vibeui-button-064-fg);
}
[data-vibeui-block="button-064"] *{box-sizing:border-box}
[data-vibeui-block="button-064"] [data-part="pay"]{
appearance:none;border:0;cursor:pointer;
display:flex;align-items:center;justify-content:center;gap:0.5rem;
width:100%;min-height:3rem;padding:0 1rem;
border-radius:var(--vibeui-button-064-radius);
background:var(--vibeui-button-064-ink);color:var(--vibeui-button-064-on-ink);
font:inherit;font-size:0.9375rem;font-weight:650;letter-spacing:-0.01em;line-height:1;
transition:filter .16s ease,transform .16s ease;
}
[data-vibeui-block="button-064"] [data-part="pay"]:hover{
filter:light-dark(brightness(1.5),brightness(0.9));
}
[data-vibeui-block="button-064"] [data-part="pay"]:active{transform:translateY(1px)}
[data-vibeui-block="button-064"] [data-part="pay"]:focus-visible{
outline:2px solid var(--vibeui-button-064-accent);outline-offset:2px;
}
[data-vibeui-block="button-064"] [data-part="mark"]{
width:1.25rem;height:1.25rem;flex:none;fill:currentColor;
}
/* Сумма прижата к правому краю, подпись остаётся по центру своей половины:
   так число читается первым взглядом, а не теряется в строке. */
[data-vibeui-block="button-064"] [data-part="amount"]{
margin-left:auto;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="button-064"] [data-part="note"]{
margin:0;text-align:center;font-size:0.75rem;line-height:1.35;
color:var(--vibeui-button-064-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-064"] *{animation:none!important;transition:none!important}}
`

const MARKS: Record<Button064Provider, ReactElement> = {
  apple: (
    <svg data-part="mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.4 12.7c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.5 2 1-.1 1.4-.6 2.6-.6s1.5.6 2.6.6 1.7-1 2.4-2c.7-1.1 1-2.2 1-2.3 0 0-1.9-.7-2-3.1ZM14.6 6c.5-.7.9-1.6.8-2.5-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.8 2.5.9.1 1.8-.4 2.4-1.2Z" />
    </svg>
  ),
  google: (
    <svg data-part="mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9v2.4h3.1c1.8-1.7 2.7-4.1 2.7-7ZM12 21c2.4 0 4.5-.8 6-2.2l-3.1-2.4c-.8.6-1.9.9-2.9.9-2.3 0-4.2-1.5-4.9-3.6H3.9v2.5C5.5 19 8.5 21 12 21ZM7.1 13.7c-.2-.6-.3-1.1-.3-1.7s.1-1.2.3-1.7V7.8H3.9C3.3 9.1 3 10.5 3 12s.3 2.9.9 4.2l3.2-2.5ZM12 6.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6C16.4 3.8 14.4 3 12 3 8.5 3 5.5 5 3.9 7.8l3.2 2.5C7.8 8.1 9.7 6.6 12 6.6Z" />
    </svg>
  ),
  card: (
    <svg data-part="mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5V9H3V7.5ZM3 11h18v5.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5V11Zm3 4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2H6Z" />
    </svg>
  ),
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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
 * Платёжная кнопка: знак платёжной системы, действие и сумма в одной строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button064({
  provider = "card",
  label = "Оплатить",
  amount = "4 900 ₽",
  note = "Спишем один раз, чек придёт на почту",
  accent,
  background = "",
  className,
  style,
  type = "button",
  ...props
}: Button064Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-064-ink": accent } : null),
    ...(background
      ? {
          "--vibeui-button-064-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-064" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="button"
        data-vibeui-block="button-064"
        className={className}
        style={palette}
      >
        <button
          {...props}
          type={type}
          data-part="pay"
          data-provider={provider}
          aria-label={amount ? `${label} ${amount}` : label}
        >
          {MARKS[provider]}
          <span>{label}</span>
          {amount ? <span data-part="amount">{amount}</span> : null}
        </button>

        {note ? <p data-part="note">{note}</p> : null}
      </div>
    </>
  )
}
