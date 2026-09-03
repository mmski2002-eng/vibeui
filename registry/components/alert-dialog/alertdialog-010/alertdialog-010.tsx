"use client"

import { useId, useRef } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog010Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  fromPlan?: string
  toPlan?: string
  losses?: string[]
  keeps?: string[]
  /** Заголовок колонки потерь. */
  lossesTitle?: string
  /** Заголовок колонки сохранённого. */
  keepsTitle?: string
  when?: string
  confirm?: string
  cancel?: string
  accent?: string
  /** Подложка окна и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: понижение тарифа. Здесь важнее не «вы уверены», а что
// именно исчезнет и что останется — поэтому два списка рядом, потери слева.
// Список того, что сохранится, не вежливость: без него понижение выглядит как
// потеря всего, и человек остаётся на дорогом тарифе из страха. Дата перехода
// названа явно: списание уже произошло, и понижение вступает в силу в конце
// оплаченного периода, а не сейчас.
const STYLES = `
:where([data-vibeui-block="alertdialog-010"]){
--vibeui-alertdialog-010-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-alertdialog-010-panel:light-dark(oklch(0.97 0.003 265),oklch(0.27 0.01 265));
--vibeui-alertdialog-010-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-alertdialog-010-muted:color-mix(in oklab,var(--vibeui-alertdialog-010-fg) 68%,transparent);
--vibeui-alertdialog-010-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-alertdialog-010-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-alertdialog-010-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0.03 262));
--vibeui-alertdialog-010-loss:light-dark(oklch(0.57 0.19 25),oklch(0.74 0.17 25));
--vibeui-alertdialog-010-keep:light-dark(oklch(0.52 0.14 152),oklch(0.76 0.14 152));
--vibeui-alertdialog-010-when-bg:light-dark(oklch(0.55 0.2 262 / 8%),oklch(0.72 0.18 262 / 14%));
--vibeui-alertdialog-010-shadow:light-dark(oklch(0.2 0.03 265 / 55%),oklch(0.02 0.01 265 / 70%));
--vibeui-alertdialog-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-010"]{color-scheme:dark}
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
/* margin:auto — без него модалка липнет к левому верхнему углу.
   Контейнер объявлен здесь, а не на корне: корень широк ровно настолько,
   насколько велика кнопка открытия, и раскладку списков надо мерить по самому
   окну. На корне container-type ещё и отвязал бы кнопку от её содержимого. */
[data-vibeui-block="alertdialog-010"] dialog{
container-type:inline-size;
margin:auto;width:min(26rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-010-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-010-bg);color:var(--vibeui-alertdialog-010-fg);
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-010-shadow);
font-family:var(--vibeui-alertdialog-010-font);
}
[data-vibeui-block="alertdialog-010"] dialog::backdrop{background:light-dark(oklch(0.2 0.02 265 / 45%),oklch(0.08 0.014 265 / 62%))}
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
/* 22rem, а не 26rem: запрос меряет содержимое окна, из ширины уже вычтены
   поля и рамка. На узком экране окно сжимается по 100vw и колонки снова
   встают друг под друга. */
@container (min-width: 22rem){
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
background:var(--vibeui-alertdialog-010-when-bg);
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="alertdialog-010"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-010"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-010"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-010-accent);color:var(--vibeui-alertdialog-010-on-accent)}
[data-vibeui-block="alertdialog-010"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-010-border);background:var(--vibeui-alertdialog-010-bg);color:inherit;
}
[data-vibeui-block="alertdialog-010"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-010-accent);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-010"] dialog[open]){overflow:hidden}
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
  lossesTitle = "Пропадёт",
  keepsTitle = "Останется",
  when = "Тариф сменится 1 апреля, когда закончится оплаченный период. До этой даты всё работает как раньше, а деньги за остаток не сгорают.",
  confirm = "Понизить тариф",
  cancel = "Оставить как есть",
  accent,
  background = "",
  className,
  style,
  ...props
}: Alertdialog010Props) {
  const box = useRef<HTMLDialogElement>(null)
  const uid = useId()

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
        data-vibeui-block="alertdialog-010"
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
          <p data-part="move">
            <span data-part="plan">{fromPlan}</span>
            <span aria-hidden="true">→</span>
            <span data-part="plan">{toPlan}</span>
          </p>

          <div data-part="lists">
            <div data-part="col" data-kind="loss">
              <p data-part="ctitle">{lossesTitle}</p>
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
              <p data-part="ctitle">{keepsTitle}</p>
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
