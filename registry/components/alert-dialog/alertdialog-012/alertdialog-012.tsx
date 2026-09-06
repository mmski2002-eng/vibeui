"use client"

import { useEffect, useId, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog012Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  amount?: string
  card?: string
  lines?: { label: string; value: string }[]
  note?: string
  /** Строка о способе оплаты: {card} подставляет название карты. */
  cardText?: string
  confirm?: string
  cancel?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка окна. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: подтверждение списания. Сумма вынесена крупно и повторена в
// кнопке: «Оплатить» без числа заставляет прокручивать назад, а на этом шаге
// возврата уже нет. Способ оплаты назван прямо здесь — списание с неожиданной
// карты выясняется только в выписке. Разбор суммы показан строками, потому что
// итог без НДС и комиссии выглядит подозрительно ровным. Возврат описан до
// кнопки, а не в письме после.
const STYLES = `
:where([data-vibeui-block="alertdialog-012"]){
--vibeui-alertdialog-012-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-alertdialog-012-panel:light-dark(oklch(0.97 0 265),oklch(0.27 0 265));
--vibeui-alertdialog-012-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-alertdialog-012-muted:color-mix(in oklab,var(--vibeui-alertdialog-012-fg) 68%,transparent);
--vibeui-alertdialog-012-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-alertdialog-012-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-alertdialog-012-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0 262));
--vibeui-alertdialog-012-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.02 0 265 / 70%));
--vibeui-alertdialog-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-012"]{color-scheme:dark}
[data-vibeui-block="alertdialog-012"]{
font-family:var(--vibeui-alertdialog-012-font);color:var(--vibeui-alertdialog-012-fg);
}
[data-vibeui-block="alertdialog-012"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-012"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-alertdialog-012-accent);color:var(--vibeui-alertdialog-012-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-012"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-012-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-012"] dialog{
margin:auto;width:min(23rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-012-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-012-bg);color:var(--vibeui-alertdialog-012-fg);
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-012-shadow);
font-family:var(--vibeui-alertdialog-012-font);
}
[data-vibeui-block="alertdialog-012"] dialog::backdrop{background:light-dark(oklch(0.2 0 265 / 45%),oklch(0.08 0 265 / 62%))}
[data-vibeui-block="alertdialog-012"] h2{margin:0 0 0.625rem;font-size:1rem;font-weight:700;line-height:1.3}
/* Сумма крупно: на шаге списания её сверяют, а не читают описание. */
[data-vibeui-block="alertdialog-012"] [data-part="amount"]{
margin:0 0 0.75rem;font-size:1.875rem;font-weight:700;line-height:1;
letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="alertdialog-012"] dl{
display:grid;grid-template-columns:1fr auto;gap:0.3125rem 0.75rem;
margin:0 0 0.75rem;padding:0.625rem 0.75rem;
border-radius:0.625rem;background:var(--vibeui-alertdialog-012-panel);
font-size:0.75rem;
}
[data-vibeui-block="alertdialog-012"] [data-part="row"]{display:contents}
[data-vibeui-block="alertdialog-012"] dt{color:var(--vibeui-alertdialog-012-muted)}
[data-vibeui-block="alertdialog-012"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
/* Способ оплаты назван здесь: иначе списание выясняется из выписки. */
[data-vibeui-block="alertdialog-012"] [data-part="card"]{
display:flex;align-items:center;gap:0.5rem;margin:0 0 0.75rem;
font-size:0.8125rem;
}
[data-vibeui-block="alertdialog-012"] [data-part="chip"]{
width:1.875rem;height:1.25rem;border-radius:0.25rem;
background:var(--vibeui-alertdialog-012-panel);
box-shadow:inset 0 0 0 1px var(--vibeui-alertdialog-012-border);
}
[data-vibeui-block="alertdialog-012"] [data-part="note"]{
margin:0 0 0.875rem;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-alertdialog-012-muted);
}
[data-vibeui-block="alertdialog-012"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-012"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.5rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="alertdialog-012"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-012-accent);color:var(--vibeui-alertdialog-012-on-accent)}
[data-vibeui-block="alertdialog-012"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-012-border);background:var(--vibeui-alertdialog-012-bg);color:inherit;
}
[data-vibeui-block="alertdialog-012"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-012-accent);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-012"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-012"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="alertdialog-012"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-012"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES = [
  { label: "Тариф «Команда», год", value: "124 000 ₽" },
  { label: "Скидка за годовую оплату", value: "−24 800 ₽" },
  { label: "НДС 20 %", value: "включён" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Подтверждение списания: сумма крупно и в кнопке, способ оплаты назван здесь.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog012({
  triggerLabel = "Оплатить год",
  title = "Подтвердите списание",
  amount = "99 200 ₽",
  card = "Visa · 6411",
  lines = DEFAULT_LINES,
  note = "Вернуть деньги можно в течение 14 дней: напишите в поддержку, возврат придёт на ту же карту.",
  cardText = "Спишем с карты {card}",
  confirm = "Списать",
  cancel = "Отменить",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alertdialog012Props) {
  const box = useRef<HTMLDialogElement>(null)
  const uid = useId()

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная панель живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    box.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к панели просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
        data-vibeui-block="alertdialog-012"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => box.current?.showModal()}
        >
          {triggerLabel}
        </button>

        <dialog
          ref={box}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
        >
          <h2 id={`${uid}-title`}>{title}</h2>
          <p data-part="amount">{amount}</p>

          <dl>
            {lines.map((line) => (
              <div key={line.label} data-part="row">
                <dt>{line.label}</dt>
                <dd>{line.value}</dd>
              </div>
            ))}
          </dl>

          <p data-part="card">
            <span data-part="chip" aria-hidden="true" />
            {cardText.replace("{card}", card)}
          </p>
          <p data-part="note">{note}</p>

          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              onClick={() => box.current?.close()}
            >
              {confirm} {amount}
            </button>
            <button
              type="button"
              data-part="cancel"
              autoFocus
              onClick={() => box.current?.close()}
            >
              {cancel}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
