"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  amount?: string
  card?: string
  lines?: { label: string; value: string }[]
  note?: string
  confirm?: string
  cancel?: string
  accent?: string
}

// Идея компонента: подтверждение списания. Сумма вынесена крупно и повторена в
// кнопке: «Оплатить» без числа заставляет прокручивать назад, а на этом шаге
// возврата уже нет. Способ оплаты назван прямо здесь — списание с неожиданной
// карты выясняется только в выписке. Разбор суммы показан строками, потому что
// итог без НДС и комиссии выглядит подозрительно ровным. Возврат описан до
// кнопки, а не в письме после.
const STYLES = `
:where([data-vibeui-block="alertdialog-012"]){
--vibeui-alertdialog-012-bg:oklch(1 0 0);
--vibeui-alertdialog-012-panel:oklch(0.97 0.003 265);
--vibeui-alertdialog-012-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-012-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-012-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-012-accent:oklch(0.55 0.2 262);
--vibeui-alertdialog-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-012"]{
font-family:var(--vibeui-alertdialog-012-font);color:var(--vibeui-alertdialog-012-fg);
}
[data-vibeui-block="alertdialog-012"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-012"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-alertdialog-012-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-012"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-012-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-012"] dialog{
margin:auto;width:min(23rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-012-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-012-bg);color:var(--vibeui-alertdialog-012-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-012-font);
}
[data-vibeui-block="alertdialog-012"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
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
[data-vibeui-block="alertdialog-012"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-012-accent);color:oklch(1 0 0)}
[data-vibeui-block="alertdialog-012"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-012-border);background:var(--vibeui-alertdialog-012-bg);color:inherit;
}
[data-vibeui-block="alertdialog-012"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-012-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES = [
  { label: "Тариф «Команда», год", value: "124 000 ₽" },
  { label: "Скидка за годовую оплату", value: "−24 800 ₽" },
  { label: "НДС 20 %", value: "включён" },
]

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
  confirm = "Списать",
  cancel = "Отменить",
  accent,
  className,
  style,
  ...props
}: Alertdialog012Props) {
  const box = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-012-title">
          <h2 id="vibeui-alertdialog-012-title">{title}</h2>
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
            Спишем с карты {card}
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
