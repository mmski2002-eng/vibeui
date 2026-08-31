"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  mineLabel?: string
  mineHint?: string
  theirsLabel?: string
  theirsHint?: string
  confirm?: string
  cancel?: string
  accent?: string
}

// Идея компонента: конфликт версий. Здесь нельзя спрашивать «сохранить?»: обе
// версии настоящие, и выбор между ними — не подтверждение, а решение. Поэтому
// варианты выведены радиокнопками с автором и временем правки, а кнопка
// подписана выбранным вариантом. Ни один вариант не выбран заранее: заранее
// выбранный превращает чужую работу в потерю по невнимательности. Отмена
// оставляет обе версии и уводит на страницу сравнения.
const STYLES = `
:where([data-vibeui-block="alertdialog-011"]){
--vibeui-alertdialog-011-bg:oklch(1 0 0);
--vibeui-alertdialog-011-panel:oklch(0.97 0.003 265);
--vibeui-alertdialog-011-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-011-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-011-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-011-accent:oklch(0.55 0.2 262);
--vibeui-alertdialog-011-warn:oklch(0.72 0.15 75);
--vibeui-alertdialog-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-011"]{
font-family:var(--vibeui-alertdialog-011-font);color:var(--vibeui-alertdialog-011-fg);
}
[data-vibeui-block="alertdialog-011"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-011"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-011-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-011-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-011"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-011-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-011"] dialog{
margin:auto;width:min(24rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-011-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-011-bg);color:var(--vibeui-alertdialog-011-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-011-font);
}
[data-vibeui-block="alertdialog-011"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-011"] [data-part="head"]{display:flex;gap:0.625rem;margin-bottom:0.75rem}
[data-vibeui-block="alertdialog-011"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:9999px;
background:oklch(0.72 0.15 75 / 18%);color:var(--vibeui-alertdialog-011-warn);
font-size:0.9375rem;font-weight:700;line-height:1;
}
[data-vibeui-block="alertdialog-011"] h2{margin:0 0 0.25rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-011"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-011-muted)}
/* Варианты радиокнопками: выбор между двумя настоящими версиями. */
[data-vibeui-block="alertdialog-011"] [data-part="choice"]{
display:flex;align-items:flex-start;gap:0.625rem;cursor:pointer;
padding:0.625rem 0.75rem;margin-bottom:0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-alertdialog-011-border);
}
[data-vibeui-block="alertdialog-011"] [data-part="choice"]:has(input:checked){
border-color:var(--vibeui-alertdialog-011-accent);background:oklch(0.55 0.2 262 / 6%);
}
[data-vibeui-block="alertdialog-011"] input{
appearance:none;flex:none;margin:0.125rem 0 0;cursor:pointer;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-alertdialog-011-muted);background:var(--vibeui-alertdialog-011-bg);
}
[data-vibeui-block="alertdialog-011"] input:checked{border-color:var(--vibeui-alertdialog-011-accent);border-width:5px}
[data-vibeui-block="alertdialog-011"] input:focus-visible{outline:2px solid var(--vibeui-alertdialog-011-accent);outline-offset:2px}
[data-vibeui-block="alertdialog-011"] [data-part="clabel"]{display:flex;flex-direction:column;gap:0.125rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="alertdialog-011"] [data-part="chint"]{font-size:0.75rem;font-weight:400;color:var(--vibeui-alertdialog-011-muted)}
[data-vibeui-block="alertdialog-011"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem;margin-top:0.875rem}
[data-vibeui-block="alertdialog-011"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-011"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-011-accent);color:oklch(1 0 0)}
/* Кнопка ждёт выбора: заранее отмеченный вариант стирает чужую работу. */
[data-vibeui-block="alertdialog-011"] [data-part="confirm"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="alertdialog-011"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-011-border);background:var(--vibeui-alertdialog-011-bg);color:inherit;
}
[data-vibeui-block="alertdialog-011"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-011-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-011"] *{animation:none!important;transition:none!important}}
`

/**
 * Конфликт версий: выбор между двумя настоящими правками, ничего не выбрано заранее.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog011({
  triggerLabel = "Сохранить блок",
  title = "Блок изменён другим участником",
  text = "Пока вы правили «Тарифы», Илья Мохов сохранил свою версию. Обе правки настоящие — выберите, какая останется.",
  mineLabel = "Оставить мою версию",
  mineHint = "Ваши правки от 10:42, версия Ильи уйдёт в историю",
  theirsLabel = "Взять версию Ильи",
  theirsHint = "Правки от 10:47, ваши изменения уйдут в историю",
  confirm = "Сохранить",
  cancel = "Сравнить версии",
  accent,
  className,
  style,
  ...props
}: Alertdialog011Props) {
  const box = useRef<HTMLDialogElement>(null)
  const [choice, setChoice] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-alertdialog-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-011"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => {
            setChoice("")
            box.current?.showModal()
          }}
        >
          {triggerLabel}
        </button>

        <dialog ref={box} aria-labelledby="vibeui-alertdialog-011-title">
          <div data-part="head">
            <span data-part="mark" aria-hidden="true">
              !
            </span>
            <div>
              <h2 id="vibeui-alertdialog-011-title">{title}</h2>
              <p data-part="text">{text}</p>
            </div>
          </div>

          <label data-part="choice">
            <input
              type="radio"
              name="vibeui-alertdialog-011-choice"
              value="mine"
              checked={choice === "mine"}
              onChange={() => setChoice("mine")}
            />
            <span data-part="clabel">
              {mineLabel}
              <span data-part="chint">{mineHint}</span>
            </span>
          </label>

          <label data-part="choice">
            <input
              type="radio"
              name="vibeui-alertdialog-011-choice"
              value="theirs"
              checked={choice === "theirs"}
              onChange={() => setChoice("theirs")}
            />
            <span data-part="clabel">
              {theirsLabel}
              <span data-part="chint">{theirsHint}</span>
            </span>
          </label>

          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              disabled={choice === ""}
              onClick={() => box.current?.close()}
            >
              {choice === "theirs" ? "Взять версию Ильи" : confirm}
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
