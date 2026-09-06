"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog006Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  text?: string
  errorTitle?: string
  errorText?: string
  confirm?: string
  retry?: string
  cancel?: string
  close?: string
  /** Строка рядом с кольцом ожидания. */
  waitText?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка окна и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: подтверждение, которое умеет провалиться. Обычное окно
// исчезает по нажатию и оставляет человека гадать, случилось ли действие;
// здесь окно остаётся и показывает ход: ожидание, потом успех или ошибка с
// кнопкой повтора. Во время ожидания кнопки выключены, а закрытие по Escape
// перехвачено — прерывать запрос на середине опаснее, чем подождать. Текст
// ошибки называет причину и следующий шаг, а не «что-то пошло не так».
const STYLES = `
:where([data-vibeui-block="alertdialog-006"]){
--vibeui-alertdialog-006-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-alertdialog-006-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-alertdialog-006-muted:color-mix(in oklab,var(--vibeui-alertdialog-006-fg) 68%,transparent);
--vibeui-alertdialog-006-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-alertdialog-006-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-alertdialog-006-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0 262));
--vibeui-alertdialog-006-danger:light-dark(oklch(0.55 0.19 25),oklch(0.74 0.17 25));
--vibeui-alertdialog-006-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.02 0 265 / 70%));
--vibeui-alertdialog-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-006"]{color-scheme:dark}
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
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-006-shadow);
font-family:var(--vibeui-alertdialog-006-font);
}
[data-vibeui-block="alertdialog-006"] dialog::backdrop{background:light-dark(oklch(0.2 0 265 / 45%),oklch(0.08 0 265 / 62%))}
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
[data-vibeui-block="alertdialog-006"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-006-accent);color:var(--vibeui-alertdialog-006-on-accent)}
[data-vibeui-block="alertdialog-006"] [data-part="confirm"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="alertdialog-006"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-006-border);background:var(--vibeui-alertdialog-006-bg);color:inherit;
}
[data-vibeui-block="alertdialog-006"] [data-part="cancel"]:disabled{opacity:.5;cursor:default}
[data-vibeui-block="alertdialog-006"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-006-accent);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-006"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-006"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:22rem;
}
[data-vibeui-block="alertdialog-006"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-006"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="alertdialog-006"] [data-part="ring"]{animation:none;border-top-color:var(--vibeui-alertdialog-006-border);opacity:.6}
[data-vibeui-block="alertdialog-006"] *{transition:none!important}
}
`

type State = "ask" | "busy" | "error"

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
 * Подтверждение с ходом выполнения: ожидание и ошибка живут в том же окне.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alertdialog006({
  triggerLabel = "Отозвать ключ доступа",
  title = "Отозвать ключ доступа?",
  text = "Проекты, которые используют этот ключ, перестанут получать компоненты сразу после отзыва.",
  errorTitle = "Ключ не отозван",
  errorText = "Сервис ключей не ответил за десять секунд. Проверьте связь и повторите — отзыв не выполнен.",
  confirm = "Отозвать",
  retry = "Повторить",
  cancel = "Отменить",
  close = "Закрыть",
  waitText = "Отзываем ключ…",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alertdialog006Props) {
  const box = useRef<HTMLDialogElement>(null)
  const uid = useId()
  const [state, setState] = useState<State>("ask")

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
    ...(accent ? { "--vibeui-alertdialog-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

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
        data-slot="alert-dialog"
        data-vibeui-block="alertdialog-006"
        className={className}
        style={palette}
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
          role="alertdialog"
          aria-modal="true"
          data-state={state}
          aria-labelledby={`${uid}-title`}
          aria-describedby={`${uid}-text`}
          // Прерывать запрос на середине опаснее, чем подождать.
          onCancel={(event) => {
            if (state === "busy") event.preventDefault()
          }}
        >
          <h2 id={`${uid}-title`}>{state === "error" ? errorTitle : title}</h2>
          <p id={`${uid}-text`} data-part="text">
            {state === "error" ? errorText : text}
          </p>

          {state === "busy" ? (
            <p data-part="wait" aria-live="polite">
              <span data-part="ring" aria-hidden="true" />
              {waitText}
            </p>
          ) : null}

          <div data-part="actions">
            <button
              type="button"
              data-part="confirm"
              disabled={state === "busy"}
              onClick={send}
            >
              {state === "error" ? retry : confirm}
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
