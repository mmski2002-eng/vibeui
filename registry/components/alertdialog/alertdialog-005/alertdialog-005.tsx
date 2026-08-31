"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  items?: string[]
  more?: number
  confirm?: string
  cancel?: string
}

// Идея компонента: подтверждение массового действия. Список того, что попадёт
// под действие, обязателен: «Удалить 24 записи?» звучит одинаково и для нужных
// двадцати четырёх, и для случайно выделенной страницы. Показаны первые
// несколько с честной строкой «и ещё N» — полный список превращает окно в
// таблицу. Число в заголовке и длина списка берутся из одного массива, поэтому
// они не разойдутся после снятия галочки.
const STYLES = `
:where([data-vibeui-block="alertdialog-005"]){
--vibeui-alertdialog-005-bg:oklch(1 0 0);
--vibeui-alertdialog-005-panel:oklch(0.97 0.003 265);
--vibeui-alertdialog-005-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-005-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-005-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-005-danger:oklch(0.55 0.19 25);
--vibeui-alertdialog-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-005"]{
font-family:var(--vibeui-alertdialog-005-font);color:var(--vibeui-alertdialog-005-fg);
}
[data-vibeui-block="alertdialog-005"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-005"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-005-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-005-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-005"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-005-danger);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-005"] dialog{
margin:auto;width:min(23rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-005-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-005-bg);color:var(--vibeui-alertdialog-005-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-005-font);
}
[data-vibeui-block="alertdialog-005"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-005"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-005"] [data-part="text"]{margin:0 0 0.75rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-005-muted)}
/* Список того, что попадёт под действие: число в заголовке звучит одинаково. */
[data-vibeui-block="alertdialog-005"] ul{
list-style:none;margin:0 0 0.875rem;padding:0.5rem 0.75rem;
max-height:9rem;overflow-y:auto;overscroll-behavior:contain;
border-radius:0.625rem;background:var(--vibeui-alertdialog-005-panel);
display:flex;flex-direction:column;gap:0.25rem;
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="alertdialog-005"] [data-part="more"]{color:var(--vibeui-alertdialog-005-muted);font-style:italic}
[data-vibeui-block="alertdialog-005"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-005"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-005"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-005-danger);color:oklch(1 0 0)}
[data-vibeui-block="alertdialog-005"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-005-border);background:var(--vibeui-alertdialog-005-bg);color:inherit;
}
[data-vibeui-block="alertdialog-005"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-005-danger);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  "Счёт № 300 · ООО «Полёт»",
  "Счёт № 301 · ИП Гаврилов",
  "Счёт № 302 · ООО «Ветка»",
  "Счёт № 303 · Студия «Мера»",
]

/**
 * Подтверждение массового действия: список того, что попадёт под удаление.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog005({
  triggerLabel = "Удалить выбранные",
  title = "Удалить выбранные счета?",
  text = "Действие нельзя отменить. Под удаление попадут:",
  items = DEFAULT_ITEMS,
  more = 20,
  confirm = "Удалить",
  cancel = "Отменить",
  className,
  style,
  ...props
}: Alertdialog005Props) {
  const box = useRef<HTMLDialogElement>(null)
  const total = items.length + more

  return (
    <>
      <style href="vibeui-alertdialog-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-005"
        className={className}
        style={style as CSSProperties}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => box.current?.showModal()}
        >
          {triggerLabel} · {total}
        </button>

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-005-title">
          <h2 id="vibeui-alertdialog-005-title">
            {title.replace("выбранные", `${total}`)}
          </h2>
          <p data-part="text">{text}</p>
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {more > 0 ? <li data-part="more">и ещё {more} записей</li> : null}
          </ul>
          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              onClick={() => box.current?.close()}
            >
              {confirm} {total}
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
