"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  fromPlan?: string
  toPlan?: string
  losses?: string[]
  keeps?: string[]
  when?: string
  confirm?: string
  cancel?: string
}

// Идея компонента: понижение тарифа. Здесь важнее не «вы уверены», а что
// именно исчезнет и что останется — поэтому два списка рядом, потери слева.
// Список того, что сохранится, не вежливость: без него понижение выглядит как
// потеря всего, и человек остаётся на дорогом тарифе из страха. Дата перехода
// названа явно: списание уже произошло, и понижение вступает в силу в конце
// оплаченного периода, а не сейчас.
const STYLES = `
:where([data-vibeui-block="alertdialog-010"]){
--vibeui-alertdialog-010-bg:oklch(1 0 0);
--vibeui-alertdialog-010-panel:oklch(0.97 0.003 265);
--vibeui-alertdialog-010-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-010-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-010-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-010-accent:oklch(0.55 0.2 262);
--vibeui-alertdialog-010-loss:oklch(0.57 0.19 25);
--vibeui-alertdialog-010-keep:oklch(0.58 0.14 152);
--vibeui-alertdialog-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="alertdialog-010"]{
font-family:var(--vibeui-alertdialog-010-font);color:var(--vibeui-alertdialog-010-fg);
}
[data-vibeui-block="alertdialog-010"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-010"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-010-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-010-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-010"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-010-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-010"] dialog{
margin:auto;width:min(26rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-010-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-010-bg);color:var(--vibeui-alertdialog-010-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-010-font);
}
[data-vibeui-block="alertdialog-010"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-010"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-010"] [data-part="move"]{
display:flex;align-items:center;gap:0.5rem;margin:0 0 0.875rem;
font-size:0.8125rem;color:var(--vibeui-alertdialog-010-muted);
}
[data-vibeui-block="alertdialog-010"] [data-part="plan"]{
padding:0.125rem 0.4375rem;border-radius:0.4375rem;
background:var(--vibeui-alertdialog-010-panel);color:var(--vibeui-alertdialog-010-fg);font-weight:650;
}
/* Два списка рядом: без «что останется» понижение читается как потеря всего. */
[data-vibeui-block="alertdialog-010"] [data-part="lists"]{display:grid;grid-template-columns:1fr;gap:0.5rem;margin-bottom:0.875rem}
@container (min-width: 24rem){
[data-vibeui-block="alertdialog-010"] [data-part="lists"]{grid-template-columns:1fr 1fr}
}
[data-vibeui-block="alertdialog-010"] [data-part="col"]{
padding:0.625rem 0.75rem;border-radius:0.625rem;background:var(--vibeui-alertdialog-010-panel);
}
[data-vibeui-block="alertdialog-010"] [data-part="ctitle"]{
margin:0 0 0.375rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
}
[data-vibeui-block="alertdialog-010"] [data-kind="loss"] [data-part="ctitle"]{color:var(--vibeui-alertdialog-010-loss)}
[data-vibeui-block="alertdialog-010"] [data-kind="keep"] [data-part="ctitle"]{color:var(--vibeui-alertdialog-010-keep)}
[data-vibeui-block="alertdialog-010"] ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.25rem;font-size:0.75rem;line-height:1.4}
[data-vibeui-block="alertdialog-010"] li{display:flex;gap:0.375rem}
[data-vibeui-block="alertdialog-010"] [data-kind="loss"] [data-part="sign"]{color:var(--vibeui-alertdialog-010-loss);font-weight:700}
[data-vibeui-block="alertdialog-010"] [data-kind="keep"] [data-part="sign"]{color:var(--vibeui-alertdialog-010-keep);font-weight:700}
/* Дата перехода: понижение вступает в силу в конце оплаченного периода. */
[data-vibeui-block="alertdialog-010"] [data-part="when"]{
margin:0 0 0.875rem;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:oklch(0.55 0.2 262 / 8%);
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="alertdialog-010"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-010"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-010"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-010-accent);color:oklch(1 0 0)}
[data-vibeui-block="alertdialog-010"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-010-border);background:var(--vibeui-alertdialog-010-bg);color:inherit;
}
[data-vibeui-block="alertdialog-010"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-010-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LOSSES = [
  "7 мест из 10 — останется 3",
  "история установок старше 30 дней",
  "приоритетная поддержка",
]

const DEFAULT_KEEPS = [
  "все проекты и их блоки",
  "ключи доступа и адреса установки",
  "участники сверх лимита в режиме чтения",
]

/**
 * Понижение тарифа: что исчезнет и что останется, двумя списками рядом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog010({
  triggerLabel = "Перейти на «Старт»",
  title = "Понизить тариф?",
  fromPlan = "Команда",
  toPlan = "Старт",
  losses = DEFAULT_LOSSES,
  keeps = DEFAULT_KEEPS,
  when = "Тариф сменится 1 апреля, когда закончится оплаченный период. До этой даты всё работает как раньше, а деньги за остаток не сгорают.",
  confirm = "Понизить тариф",
  cancel = "Оставить как есть",
  className,
  style,
  ...props
}: Alertdialog010Props) {
  const box = useRef<HTMLDialogElement>(null)

  return (
    <>
      <style href="vibeui-alertdialog-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-010"
        className={className}
        style={style as CSSProperties}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => box.current?.showModal()}
        >
          {triggerLabel}
        </button>

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-010-title">
          <h2 id="vibeui-alertdialog-010-title">{title}</h2>
          <p data-part="move">
            <span data-part="plan">{fromPlan}</span>
            <span aria-hidden="true">→</span>
            <span data-part="plan">{toPlan}</span>
          </p>

          <div data-part="lists">
            <div data-part="col" data-kind="loss">
              <p data-part="ctitle">Пропадёт</p>
              <ul>
                {losses.map((loss) => (
                  <li key={loss}>
                    <span data-part="sign" aria-hidden="true">
                      −
                    </span>
                    {loss}
                  </li>
                ))}
              </ul>
            </div>
            <div data-part="col" data-kind="keep">
              <p data-part="ctitle">Останется</p>
              <ul>
                {keeps.map((keep) => (
                  <li key={keep}>
                    <span data-part="sign" aria-hidden="true">
                      ✓
                    </span>
                    {keep}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p data-part="when">{when}</p>

          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              onClick={() => box.current?.close()}
            >
              {confirm}
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
