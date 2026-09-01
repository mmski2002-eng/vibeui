"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alertdialog006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  errorTitle?: string
  errorText?: string
  retry?: string
  cancel?: string
  close?: string
}

// Идея компонента: подтверждение, которое умеет провалиться. Обычное окно
// исчезает по нажатию и оставляет человека гадать, случилось ли действие;
// здесь окно остаётся и показывает ход: ожидание, потом успех или ошибка с
// кнопкой повтора. Во время ожидания кнопки выключены, а закрытие по Escape
// перехвачено — прерывать запрос на середине опаснее, чем подождать. Текст
// ошибки называет причину и следующий шаг, а не «что-то пошло не так».
const STYLES = `
:where([data-vibeui-block="alertdialog-006"]){
--vibeui-alertdialog-006-bg:oklch(1 0 0);
--vibeui-alertdialog-006-fg:oklch(0.22 0.014 265);
--vibeui-alertdialog-006-muted:oklch(0.55 0.014 265);
--vibeui-alertdialog-006-border:oklch(0.9 0.006 265);
--vibeui-alertdialog-006-accent:oklch(0.55 0.2 262);
--vibeui-alertdialog-006-danger:oklch(0.55 0.19 25);
--vibeui-alertdialog-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alertdialog-006"]{
font-family:var(--vibeui-alertdialog-006-font);color:var(--vibeui-alertdialog-006-fg);
}
[data-vibeui-block="alertdialog-006"] *{box-sizing:border-box}
[data-vibeui-block="alertdialog-006"] [data-part="open"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-alertdialog-006-border);border-radius:0.625rem;
background:var(--vibeui-alertdialog-006-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-006"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-alertdialog-006-accent);outline-offset:2px}
/* margin:auto — без него модалка липнет к левому верхнему углу. */
[data-vibeui-block="alertdialog-006"] dialog{
margin:auto;width:min(22rem,calc(100vw - 2rem));padding:1.125rem;
border:1px solid var(--vibeui-alertdialog-006-border);border-radius:0.875rem;
background:var(--vibeui-alertdialog-006-bg);color:var(--vibeui-alertdialog-006-fg);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 55%);
font-family:var(--vibeui-alertdialog-006-font);
}
[data-vibeui-block="alertdialog-006"] dialog::backdrop{background:oklch(0.2 0.02 265 / 45%)}
[data-vibeui-block="alertdialog-006"] h2{margin:0 0 0.375rem;font-size:1rem;font-weight:700;line-height:1.3}
[data-vibeui-block="alertdialog-006"] [data-part="text"]{margin:0 0 0.875rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alertdialog-006-muted)}
/* Ошибка называет причину и следующий шаг, а не «что-то пошло не так». */
[data-vibeui-block="alertdialog-006"] [data-state="error"] h2{color:var(--vibeui-alertdialog-006-danger)}
[data-vibeui-block="alertdialog-006"] [data-part="wait"]{
display:flex;align-items:center;gap:0.5rem;margin:0 0 0.875rem;
font-size:0.8125rem;color:var(--vibeui-alertdialog-006-muted);
}
[data-vibeui-block="alertdialog-006"] [data-part="ring"]{
width:1rem;height:1rem;border-radius:9999px;box-sizing:border-box;
border:2px solid var(--vibeui-alertdialog-006-border);
border-top-color:var(--vibeui-alertdialog-006-accent);
animation:vibeui-alertdialog-006-spin .7s linear infinite;
}
@keyframes vibeui-alertdialog-006-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="alertdialog-006"] [data-part="actions"]{display:flex;flex-direction:row-reverse;gap:0.5rem}
[data-vibeui-block="alertdialog-006"] [data-part="actions"] button{
flex:1 1 0;appearance:none;cursor:pointer;height:2.375rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="alertdialog-006"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-006-accent);color:oklch(1 0 0)}
[data-vibeui-block="alertdialog-006"] [data-part="confirm"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="alertdialog-006"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-006-border);background:var(--vibeui-alertdialog-006-bg);color:inherit;
}
[data-vibeui-block="alertdialog-006"] [data-part="cancel"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="alertdialog-006"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-006-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="alertdialog-006"] [data-part="ring"]{animation:none;border-top-color:var(--vibeui-alertdialog-006-border);opacity:.6}
[data-vibeui-block="alertdialog-006"] *{transition:none!important}
}
`

type State = "ask" | "busy" | "error"

/**
 * Подтверждение с ходом выполнения: ожидание и ошибка живут в том же окне.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog006({
  triggerLabel = "Отозвать ключ доступа",
  title = "Отозвать ключ доступа?",
  text = "Проекты, которые используют этот ключ, перестанут получать компоненты сразу после отзыва.",
  errorTitle = "Ключ не отозван",
  errorText = "Сервис ключей не ответил за десять секунд. Проверьте связь и повторите — отзыв не выполнен.",
  retry = "Повторить",
  cancel = "Отменить",
  close = "Закрыть",
  className,
  style,
  ...props
}: Alertdialog006Props) {
  const box = useRef<HTMLDialogElement>(null)
  const [state, setState] = useState<State>("ask")

  const send = () => {
    setState("busy")
    // Демонстрация исхода: настоящий запрос делает вызывающий код.
    setTimeout(() => setState("error"), 1200)
  }

  return (
    <>
      <style href="vibeui-alertdialog-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="alertdialog-006"
        className={className}
        style={style as CSSProperties}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => {
            setState("ask")
            box.current?.showModal()
          }}
        >
          {triggerLabel}
        </button>

        <dialog
          ref={box}
          data-state={state}
          aria-labelledby="vibeui-alertdialog-006-title"
          // Прерывать запрос на середине опаснее, чем подождать.
          onCancel={(event) => {
            if (state === "busy") event.preventDefault()
          }}
        >
          <h2 id="vibeui-alertdialog-006-title">
            {state === "error" ? errorTitle : title}
          </h2>
          <p data-part="text">{state === "error" ? errorText : text}</p>

          {state === "busy" ? (
            <p data-part="wait" aria-live="polite">
              <span data-part="ring" aria-hidden="true" />
              Отзываем ключ…
            </p>
          ) : null}

          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              disabled={state === "busy"}
              onClick={send}
            >
              {state === "error" ? retry : "Отозвать"}
            </button>
            <button
              type="button"
              data-part="cancel"
              disabled={state === "busy"}
              autoFocus
              onClick={() => box.current?.close()}
            >
              {state === "error" ? close : cancel}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
