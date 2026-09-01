"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  seconds?: number
  confirm?: string
  cancel?: string
}

// Идея компонента: подтверждение с задержкой. Кнопка включается через
// несколько секунд, и это не украшение: пауза стоит там, где человек уже
// нажал «удалить» и продолжает жать по инерции. Обратный отсчёт написан
// цифрой в кнопке, а не крутится колесом: неизвестное ожидание раздражает
// сильнее известного. Таймер живёт в эффекте и снимается при закрытии, иначе
// после отмены кнопка «включится» в невидимом окне.
const STYLES = `
:where([data-vibeui-block="alertdialog-004"]){
--vibeui-alertdialog-004-bg:oklch(1 0 0);
--vibeui-alertdialog-004-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-004-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-004-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-004-danger:oklch(0.55 0.19 25);
--vibeui-alertdialog-004-track:oklch(0.93 0.005 265);
--vibeui-alertdialog-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-004"]{
font-family:var(--vibeui-alertdialog-004-font);color:var(--vibeui-alertdialog-004-fg);
}
[data-vibeui-block="alertdialog-004"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-004"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-004-danger);border-radius:0.625rem;
background:none;color:var(--vibeui-alertdialog-004-danger);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-004"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-004-danger);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-004"] dialog{
margin:auto;width:min(22rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-004-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-004-bg);color:var(--vibeui-alertdialog-004-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-004-font);
}
[data-vibeui-block="alertdialog-004"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-004"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-004"] [data-part="text"]{margin:0 0 0.875rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-004-muted)}
/* Полоса и цифра: известное ожидание раздражает меньше неизвестного. */
[data-vibeui-block="alertdialog-004"] [data-part="track"]{
height:0.25rem;margin-bottom:0.875rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-alertdialog-004-track);
}
[data-vibeui-block="alertdialog-004"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-alertdialog-004-progress,0%);
background:var(--vibeui-alertdialog-004-danger);
transition:width .3s linear;
}
[data-vibeui-block="alertdialog-004"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-004"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="alertdialog-004"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-004-danger);color:oklch(1 0 0)}
[data-vibeui-block="alertdialog-004"] [data-part="confirm"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="alertdialog-004"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-004-border);background:var(--vibeui-alertdialog-004-bg);color:inherit;
}
[data-vibeui-block="alertdialog-004"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-004-danger);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="alertdialog-004"] [data-part="fill"]{transition:none}
[data-vibeui-block="alertdialog-004"] *{animation:none!important}
}
`

/**
 * Подтверждение с задержкой: кнопка включается через несколько секунд.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog004({
  triggerLabel = "Стереть все данные",
  title = "Стереть данные проекта?",
  text = "Установки, ключи и история будут удалены с серверов в течение часа. Резервных копий не останется.",
  seconds = 5,
  confirm = "Стереть",
  cancel = "Отменить",
  className,
  style,
  ...props
}: Alertdialog004Props) {
  const box = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [left, setLeft] = useState(seconds)

  // Таймер снимается при закрытии: иначе кнопка «включится» в невидимом окне.
  useEffect(() => {
    if (!open || left === 0) return
    const timer = setTimeout(() => setLeft((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [open, left])

  const start = () => {
    setLeft(seconds)
    setOpen(true)
    box.current?.showModal()
  }

  const finish = () => {
    setOpen(false)
    box.current?.close()
  }

  const palette = {
    "--vibeui-alertdialog-004-progress": `${((seconds - left) / seconds) * 100}%`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-004"
        className={className}
        style={palette}
      >
        <button type="button" data-part="open" onClick={start}>
          {triggerLabel}
        </button>

        <dialog
          ref={box}
          aria-labelledby="vibeui-alertdialog-004-title"
          onClose={() => setOpen(false)}
        >
          <h2 id="vibeui-alertdialog-004-title">{title}</h2>
          <p data-part="text">{text}</p>
          <div data-part="track" aria-hidden="true">
            <span data-part="fill" />
          </div>
          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              disabled={left > 0}
              onClick={finish}
            >
              {left > 0 ? `${confirm} через ${left}` : confirm}
            </button>
            <button type="button" data-part="cancel" autoFocus onClick={finish}>
              {cancel}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
