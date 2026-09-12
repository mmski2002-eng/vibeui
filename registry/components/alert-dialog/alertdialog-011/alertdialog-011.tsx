"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Alertdialog011Props = Omit<
  ComponentProps<"div">,
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
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка окна и кнопки открытия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: конфликт версий. Здесь нельзя спрашивать «сохранить?»: обе
// версии настоящие, и выбор между ними — не подтверждение, а решение. Поэтому
// варианты выведены радиокнопками с автором и временем правки, а кнопка
// подписана выбранным вариантом. Ни один вариант не выбран заранее: заранее
// выбранный превращает чужую работу в потерю по невнимательности. Отмена
// оставляет обе версии и уводит на страницу сравнения.
const STYLES = `
:where([data-vibeui-block="alertdialog-011"]){
--vibeui-alertdialog-011-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-alertdialog-011-panel:light-dark(oklch(0.97 0 265),oklch(0.27 0 265));
--vibeui-alertdialog-011-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-alertdialog-011-muted:color-mix(in oklab,var(--vibeui-alertdialog-011-fg) 68%,transparent);
--vibeui-alertdialog-011-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-alertdialog-011-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-alertdialog-011-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0 262));
--vibeui-alertdialog-011-pick-bg:light-dark(oklch(0.287 0 0 / 6%),oklch(0.899 0 0 / 12%));
--vibeui-alertdialog-011-warn:light-dark(oklch(0.66 0.15 70),oklch(0.82 0.14 78));
--vibeui-alertdialog-011-warn-bg:light-dark(oklch(0.72 0.15 75 / 18%),oklch(0.82 0.14 78 / 20%));
--vibeui-alertdialog-011-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.02 0 265 / 70%));
--vibeui-alertdialog-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alertdialog-011"]{color-scheme:dark}
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
box-shadow:0 24px 60px -24px var(--vibeui-alertdialog-011-shadow);
font-family:var(--vibeui-alertdialog-011-font);
}
[data-vibeui-block="alertdialog-011"] dialog::backdrop{background:light-dark(oklch(0.2 0 265 / 45%),oklch(0.08 0 265 / 62%))}
[data-vibeui-block="alertdialog-011"] [data-part="head"]{display:flex;gap:0.625rem;margin-bottom:0.75rem}
[data-vibeui-block="alertdialog-011"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:9999px;
background:var(--vibeui-alertdialog-011-warn-bg);color:var(--vibeui-alertdialog-011-warn);
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
border-color:var(--vibeui-alertdialog-011-accent);background:var(--vibeui-alertdialog-011-pick-bg);
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
[data-vibeui-block="alertdialog-011"] [data-part="confirm"]{border:0;background:var(--vibeui-alertdialog-011-accent);color:oklch(from var(--vibeui-alertdialog-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
/* Кнопка ждёт выбора: заранее отмеченный вариант стирает чужую работу. */
[data-vibeui-block="alertdialog-011"] [data-part="confirm"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="alertdialog-011"] [data-part="cancel"]{
border:1px solid var(--vibeui-alertdialog-011-border);background:var(--vibeui-alertdialog-011-bg);color:inherit;
}
[data-vibeui-block="alertdialog-011"] dialog button:focus-visible{outline:2px solid var(--vibeui-alertdialog-011-accent);outline-offset:2px}
/* showModal() делает фон inert, но не запрещает прокрутку страницы. */
html:has([data-vibeui-block="alertdialog-011"] dialog[open]:modal){overflow:hidden}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="alertdialog-011"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;
}
[data-vibeui-block="alertdialog-011"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="alertdialog-011"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alertdialog-011"] *{animation:none!important;transition:none!important}}
`

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
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alertdialog011Props) {
  const box = useRef<HTMLDialogElement>(null)
  const uid = useId()
  const [choice, setChoice] = useState("")

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
    ...(accent ? { "--vibeui-alertdialog-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alertdialog-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alertdialog-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert-dialog"
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

        <dialog
          ref={box}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
          aria-describedby={`${uid}-text`}
        >
          <div data-part="head">
            <span data-part="mark" aria-hidden="true">
              !
            </span>
            <div>
              <h2 id={`${uid}-title`}>{title}</h2>
              <p id={`${uid}-text`} data-part="text">
                {text}
              </p>
            </div>
          </div>

          <label data-part="choice">
            <input
              type="radio"
              name={`${uid}-choice`}
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
              name={`${uid}-choice`}
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
              {choice === "theirs" ? theirsLabel : confirm}
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
