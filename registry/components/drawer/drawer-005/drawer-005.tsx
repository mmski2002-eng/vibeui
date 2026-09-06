"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Drawer005Line = {
  title: string
  note: string
  price: number
  quantity: number
}

export type Drawer005Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  lines?: Drawer005Line[]
  delivery?: number
  /** Подписи итогов: компонент несёт русские, проект подставляет свои. */
  totalsText?: Record<string, string>
  /** Подпись оформления, {total} — сумма к оплате. */
  checkoutTemplate?: string
  /** Имя счётчика для скринридера, {count} — сколько товаров. */
  countTemplate?: string
  /** Подписи кнопок количества, {title} — название товара. */
  decreaseTemplate?: string
  increaseTemplate?: string
  closeLabel?: string
  /** Как печатать суммы: разрядность берётся из локали, символ — из currency. */
  locale?: string
  currency?: string
  /** Пусто — подложки нет, триггер лежит прямо на фоне страницы. */
  background?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
}

// Идея компонента: ящик корзины, где итог всегда на экране. Количество
// меняется прямо в строке, сумма пересчитывается тут же, а подвал с итогом
// и кнопкой оформления прижат к низу и не уезжает при прокрутке списка —
// иначе после третьего товара человек перестаёт понимать, сколько платит.
const STYLES = `
:where([data-vibeui-block="drawer-005"]){
--vibeui-drawer-005-bg:transparent;
--vibeui-drawer-005-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-drawer-005-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-drawer-005-muted:color-mix(in oklab,var(--vibeui-drawer-005-fg) 68%,transparent);
--vibeui-drawer-005-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-drawer-005-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.73 0.15 39.8));
--vibeui-drawer-005-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0 265));
--vibeui-drawer-005-hover:light-dark(oklch(0.97 0 265),oklch(0.28 0 265));
--vibeui-drawer-005-tint:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-drawer-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-005"]{color-scheme:dark}
[data-vibeui-block="drawer-005"]{
display:inline-block;font-family:var(--vibeui-drawer-005-font);color:var(--vibeui-drawer-005-fg);
}
[data-vibeui-block="drawer-005"] [data-part="trigger"]{
appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-drawer-005-border);border-radius:0.625rem;
background:var(--vibeui-drawer-005-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-005-accent);outline-offset:2px}
[data-vibeui-block="drawer-005"] [data-part="badge"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;height:1.25rem;padding:0 0.375rem;border-radius:9999px;
background:var(--vibeui-drawer-005-accent);color:var(--vibeui-drawer-005-on-accent);
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="drawer-005"] dialog{
position:fixed;inset:0 0 0 auto;margin:0;
width:min(24rem,100vw);max-width:100vw;height:100dvh;max-height:100dvh;
padding:0;border:0;background:var(--vibeui-drawer-005-surface);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-005"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-005"] dialog[open]{translate:100% 0}
}
/* Затемнение позади ящика одно на обе темы: подложка гасит страницу, а не красится вместе с ней. */
[data-vibeui-block="drawer-005"] dialog::backdrop{background:oklch(0.19 0 265 / 45%)}
[data-vibeui-block="drawer-005"] [data-part="panel"]{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
[data-vibeui-block="drawer-005"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:1rem 1rem 0.75rem;border-bottom:1px solid var(--vibeui-drawer-005-border);
}
[data-vibeui-block="drawer-005"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680}
[data-vibeui-block="drawer-005"] [data-part="close"]{
appearance:none;border:0;cursor:pointer;background:transparent;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.5rem;color:var(--vibeui-drawer-005-muted);
}
[data-vibeui-block="drawer-005"] [data-part="close"]:hover{background:var(--vibeui-drawer-005-hover);color:var(--vibeui-drawer-005-fg)}
[data-vibeui-block="drawer-005"] [data-part="close"]:focus-visible{outline:2px solid var(--vibeui-drawer-005-accent);outline-offset:2px}
[data-vibeui-block="drawer-005"] [data-part="cross"]{position:relative;width:0.625rem;height:0.625rem}
[data-vibeui-block="drawer-005"] [data-part="cross"]::before,
[data-vibeui-block="drawer-005"] [data-part="cross"]::after{
content:"";position:absolute;left:0;top:50%;width:100%;height:1.5px;
margin-top:-0.75px;background:currentColor;border-radius:9999px;
}
[data-vibeui-block="drawer-005"] [data-part="cross"]::before{transform:rotate(45deg)}
[data-vibeui-block="drawer-005"] [data-part="cross"]::after{transform:rotate(-45deg)}
[data-vibeui-block="drawer-005"] [data-part="body"]{flex:1;min-height:0;overflow-y:auto;padding:0.25rem 1rem}
[data-vibeui-block="drawer-005"] [data-part="lines"]{list-style:none;margin:0;padding:0}
[data-vibeui-block="drawer-005"] [data-part="line"]{
display:grid;grid-template-columns:2.75rem 1fr auto;gap:0.75rem;align-items:center;
padding:0.75rem 0;border-bottom:1px solid var(--vibeui-drawer-005-border);
}
[data-vibeui-block="drawer-005"] [data-part="line"]:last-child{border-bottom:0}
/* Миниатюра нарисована градиентом: картинок в переносимом компоненте нет. */
[data-vibeui-block="drawer-005"] [data-part="thumb"]{
width:2.75rem;height:2.75rem;border-radius:0.625rem;
background:linear-gradient(145deg,color-mix(in oklab,var(--vibeui-drawer-005-accent) 26%,var(--vibeui-drawer-005-tint)),var(--vibeui-drawer-005-tint));
border:1px solid var(--vibeui-drawer-005-border);
}
[data-vibeui-block="drawer-005"] [data-part="info"]{min-width:0;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="drawer-005"] [data-part="name"]{font-size:0.875rem;font-weight:650;line-height:1.25}
[data-vibeui-block="drawer-005"] [data-part="note"]{font-size:0.75rem;color:var(--vibeui-drawer-005-muted)}
[data-vibeui-block="drawer-005"] [data-part="side"]{display:flex;flex-direction:column;align-items:flex-end;gap:0.375rem}
[data-vibeui-block="drawer-005"] [data-part="sum"]{font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="drawer-005"] [data-part="stepper"]{
display:inline-flex;align-items:center;
border:1px solid var(--vibeui-drawer-005-border);border-radius:9999px;overflow:hidden;
}
[data-vibeui-block="drawer-005"] [data-part="stepper"] button{
appearance:none;border:0;cursor:pointer;width:1.75rem;height:1.75rem;
background:transparent;color:inherit;font:inherit;font-size:0.9375rem;line-height:1;
}
[data-vibeui-block="drawer-005"] [data-part="stepper"] button:hover{background:var(--vibeui-drawer-005-hover)}
[data-vibeui-block="drawer-005"] [data-part="stepper"] button:disabled{cursor:not-allowed;opacity:.4}
[data-vibeui-block="drawer-005"] [data-part="stepper"] button:focus-visible{outline:2px solid var(--vibeui-drawer-005-accent);outline-offset:-2px}
[data-vibeui-block="drawer-005"] [data-part="qty"]{min-width:1.25rem;text-align:center;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums}
/* Итог всегда на экране: список прокручивается, подвал стоит. */
[data-vibeui-block="drawer-005"] [data-part="foot"]{
padding:0.875rem 1rem calc(0.875rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-drawer-005-border);
background:var(--vibeui-drawer-005-surface);
}
[data-vibeui-block="drawer-005"] [data-part="totals"]{
display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.75rem;margin:0 0 0.75rem;font-size:0.8125rem;
}
[data-vibeui-block="drawer-005"] [data-part="totals"] dt{color:var(--vibeui-drawer-005-muted)}
[data-vibeui-block="drawer-005"] [data-part="totals"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="drawer-005"] [data-part="grand"]{display:contents}
[data-vibeui-block="drawer-005"] [data-part="grand"] dt,
[data-vibeui-block="drawer-005"] [data-part="grand"] dd{
padding-top:0.375rem;border-top:1px solid var(--vibeui-drawer-005-border);
color:var(--vibeui-drawer-005-fg);font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="drawer-005"] [data-part="checkout"]{
appearance:none;border:0;cursor:pointer;width:100%;height:2.75rem;border-radius:0.75rem;
background:var(--vibeui-drawer-005-accent);color:var(--vibeui-drawer-005-on-accent);
font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="drawer-005"] [data-part="checkout"]:focus-visible{outline:2px solid var(--vibeui-drawer-005-accent);outline-offset:2px}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="drawer-005"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="drawer-005"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-005"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-005"] *{animation:none!important;transition:none!important}
[data-vibeui-block="drawer-005"] dialog{translate:0 0}
}
`

const DEFAULT_LINES: Drawer005Line[] = [
  {
    title: "Комплект иконок",
    note: "240 контуров, SVG",
    price: 2400,
    quantity: 1,
  },
  {
    title: "Шрифт Grotesk",
    note: "Лицензия на 3 сайта",
    price: 4900,
    quantity: 1,
  },
  { title: "Пресеты палитр", note: "12 наборов", price: 1200, quantity: 2 },
]

const TOTALS_TEXT: Record<string, string> = {
  goods: "Товары",
  delivery: "Доставка",
  total: "Итого",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Ящик корзины: строки с количеством и липкий итог у нижнего края.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer005({
  triggerLabel = "Корзина",
  title = "Корзина",
  lines = DEFAULT_LINES,
  delivery = 390,
  totalsText = TOTALS_TEXT,
  checkoutTemplate = "Оформить · {total}",
  countTemplate = "товаров: {count}",
  decreaseTemplate = "Убрать одну штуку: {title}",
  increaseTemplate = "Добавить одну штуку: {title}",
  closeLabel = "Закрыть корзину",
  locale = "ru-RU",
  currency = "₽",
  background = "",
  defaultOpen = false,
  accent,
  className,
  style,
  ...props
}: Drawer005Props) {
  const drawer = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная шторка живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    drawer.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к шторке просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])
  const [items, setItems] = useState(lines)

  const palette = {
    ...(accent ? { "--vibeui-drawer-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-005-bg": background,
          "--vibeui-drawer-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function money(value: number) {
    return `${value.toLocaleString(locale)} ${currency}`
  }

  const goods = items.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const count = items.reduce((sum, line) => sum + line.quantity, 0)

  function change(name: string, step: number) {
    setItems((current) =>
      current.map((line) =>
        line.title === name
          ? {
              ...line,
              quantity: Math.min(9, Math.max(1, line.quantity + step)),
            }
          : line,
      ),
    )
  }

  return (
    <>
      <style href="vibeui-drawer-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="drawer"
        data-vibeui-block="drawer-005"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => drawer.current?.showModal()}
        >
          {triggerLabel}
          <span
            data-part="badge"
            aria-label={countTemplate.replace("{count}", String(count))}
          >
            {count}
          </span>
        </button>
        <dialog
          ref={drawer}
          aria-label={title}
          onClick={(event) => {
            if (event.target === drawer.current) {
              drawer.current.close()
            }
          }}
        >
          <div data-part="panel">
            <div data-part="head">
              <h2 data-part="title">{title}</h2>
              <button
                type="button"
                data-part="close"
                aria-label={closeLabel}
                onClick={() => drawer.current?.close()}
              >
                <span data-part="cross" aria-hidden="true" />
              </button>
            </div>
            <div data-part="body">
              <ul data-part="lines">
                {items.map((line) => (
                  <li key={line.title} data-part="line">
                    <span data-part="thumb" aria-hidden="true" />
                    <span data-part="info">
                      <span data-part="name">{line.title}</span>
                      <span data-part="note">{line.note}</span>
                    </span>
                    <span data-part="side">
                      <span data-part="sum">
                        {money(line.price * line.quantity)}
                      </span>
                      <span data-part="stepper">
                        <button
                          type="button"
                          aria-label={decreaseTemplate.replace(
                            "{title}",
                            line.title,
                          )}
                          disabled={line.quantity <= 1}
                          onClick={() => change(line.title, -1)}
                        >
                          −
                        </button>
                        <span data-part="qty">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label={increaseTemplate.replace(
                            "{title}",
                            line.title,
                          )}
                          disabled={line.quantity >= 9}
                          onClick={() => change(line.title, 1)}
                        >
                          +
                        </button>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="foot">
              <dl data-part="totals">
                <dt>{totalsText.goods ?? TOTALS_TEXT.goods}</dt>
                <dd>{money(goods)}</dd>
                <dt>{totalsText.delivery ?? TOTALS_TEXT.delivery}</dt>
                <dd>{money(delivery)}</dd>
                <div data-part="grand">
                  <dt>{totalsText.total ?? TOTALS_TEXT.total}</dt>
                  <dd>{money(goods + delivery)}</dd>
                </div>
              </dl>
              <button
                type="button"
                data-part="checkout"
                onClick={() => drawer.current?.close()}
              >
                {checkoutTemplate.replace("{total}", money(goods + delivery))}
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  )
}
