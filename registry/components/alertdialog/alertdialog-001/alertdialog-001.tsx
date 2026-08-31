"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  confirm?: string
  cancel?: string
  accent?: string
}

// Идея компонента: базовое подтверждение на нативном <dialog>. Модалка даёт
// ловушку фокуса, закрытие по Escape и фон — три вещи, которые в своей
// реализации чинятся дольше всего. Кнопка отмены стоит первой в разметке и
// получает фокус при открытии: если человек нажмёт Enter не глядя, ничего не
// случится. Заголовок формулирует вопрос, а кнопка называет действие —
// «Вы уверены?» с кнопками «Да» и «Нет» заставляет перечитывать текст.
const STYLES = `
:where([data-vibeui-block="alertdialog-001"]){
--vibeui-alertdialog-001-bg:oklch(1 0 0);
--vibeui-alertdialog-001-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-001-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-001-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-001-accent:oklch(0.55 0.2 262);
--vibeui-alertdialog-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-001"]{
font-family:var(--vibeui-alertdialog-001-font);color:var(--vibeui-alertdialog-001-fg);
}
[data-vibeui-block="alertdialog-001"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-001"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-001-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-001-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-001"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-001-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-001"] dialog{
margin:auto;width:min(22rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-001-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-001-bg);color:var(--vibeui-alertdialog-001-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-001-font);
}
[data-vibeui-block="alertdialog-001"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-001"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-001"] [data-part="text"]{
margin:0 0 1rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-001-muted);
}
/* Отмена первой в разметке и в фокусе: Enter вслепую ничего не ломает. */
[data-vibeui-block="alertdialog-001"] [data-part="actions"]{
display:flex;flex-direction:row-reverse;gap:0.5rem;
}
[data-vibeui-block="alertdialog-001"] button[data-part="confirm"],
[data-vibeui-block="alertdialog-001"] button[data-part="cancel"]{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-001"] [data-part="confirm"]{
border:0;background:var(--vibeui-alertdialog-001-accent);color:oklch(1 0 0);
}
[data-vibeui-block="alertdialog-001"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-001-border);
background:var(--vibeui-alertdialog-001-bg);color:inherit;
}
[data-vibeui-block="alertdialog-001"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-001-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Подтверждение на нативном dialog: фокус на отмене, действие названо кнопкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog001({
  triggerLabel = "Опубликовать",
  title = "Опубликовать каталог?",
  text = "Страницы станут доступны всем по ссылке. Изменения можно откатить в истории версий.",
  confirm = "Опубликовать",
  cancel = "Не сейчас",
  accent,
  className,
  style,
  ...props
}: Alertdialog001Props) {
  const box = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-001"
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

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-001-title">
          <h2 id="vibeui-alertdialog-001-title">{title}</h2>
          <p data-part="text">{text}</p>
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
