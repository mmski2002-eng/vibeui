"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Drawer006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  warning?: string
  saveLabel?: string
  accent?: string
}

// Идея компонента: ящик с формой, который не даёт закрыть себя молча.
// Escape у нативного dialog отменяется событием cancel, поэтому первое
// нажатие при заполненной форме не закрывает панель, а поднимает полосу
// предупреждения с явным выбором: уйти без сохранения или остаться.
const STYLES = `
:where([data-vibeui-block="drawer-006"]){
--vibeui-drawer-006-bg:oklch(1 0 0);
--vibeui-drawer-006-fg:oklch(0.21 0.014 265);
--vibeui-drawer-006-muted:oklch(0.55 0.014 265);
--vibeui-drawer-006-border:oklch(0.91 0.006 265);
--vibeui-drawer-006-accent:oklch(0.55 0.17 265);
--vibeui-drawer-006-warn:oklch(0.62 0.15 65);
--vibeui-drawer-006-warn-bg:oklch(0.96 0.04 85);
--vibeui-drawer-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="drawer-006"]{
display:inline-block;font-family:var(--vibeui-drawer-006-font);color:var(--vibeui-drawer-006-fg);
}
[data-vibeui-block="drawer-006"] [data-part="trigger"]{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-drawer-006-border);border-radius:0.625rem;
background:var(--vibeui-drawer-006-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-006"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-006-accent);outline-offset:2px}
[data-vibeui-block="drawer-006"] dialog{
position:fixed;inset:0 0 0 auto;margin:0;
width:min(25rem,100vw);max-width:100vw;height:100dvh;max-height:100dvh;
padding:0;border:0;background:var(--vibeui-drawer-006-bg);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0.02 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-006"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-006"] dialog[open]{translate:100% 0}
}
[data-vibeui-block="drawer-006"] dialog::backdrop{background:oklch(0.19 0.02 265 / 45%)}
[data-vibeui-block="drawer-006"] form{display:flex;flex-direction:column;height:100%;box-sizing:border-box}
[data-vibeui-block="drawer-006"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:1rem 1rem 0.75rem;border-bottom:1px solid var(--vibeui-drawer-006-border);
}
[data-vibeui-block="drawer-006"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680}
[data-vibeui-block="drawer-006"] [data-part="mark"]{
font-size:0.6875rem;font-weight:700;color:var(--vibeui-drawer-006-warn);
}
[data-vibeui-block="drawer-006"] [data-part="body"]{
flex:1;min-height:0;overflow-y:auto;padding:1rem;
display:flex;flex-direction:column;gap:0.875rem;
}
[data-vibeui-block="drawer-006"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="drawer-006"] [data-part="label"]{font-size:0.75rem;font-weight:650;color:var(--vibeui-drawer-006-muted)}
[data-vibeui-block="drawer-006"] input,
[data-vibeui-block="drawer-006"] textarea{
box-sizing:border-box;width:100%;
border:1px solid var(--vibeui-drawer-006-border);border-radius:0.625rem;
background:var(--vibeui-drawer-006-bg);color:inherit;
font:inherit;font-size:0.875rem;padding:0.5rem 0.6875rem;
}
[data-vibeui-block="drawer-006"] input{height:2.375rem}
[data-vibeui-block="drawer-006"] textarea{min-height:5rem;resize:vertical}
[data-vibeui-block="drawer-006"] input:focus-visible,
[data-vibeui-block="drawer-006"] textarea:focus-visible{outline:2px solid var(--vibeui-drawer-006-accent);outline-offset:1px;border-color:transparent}
/* Полоса предупреждения живёт над кнопками: выбор рядом с причиной. */
[data-vibeui-block="drawer-006"] [data-part="warning"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
margin:0 1rem;padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-drawer-006-warn-bg);
border:1px solid color-mix(in oklab,var(--vibeui-drawer-006-warn) 40%,transparent);
font-size:0.8125rem;
}
[data-vibeui-block="drawer-006"] [data-part="warning"] p{margin:0;flex:1 1 12rem}
[data-vibeui-block="drawer-006"] [data-part="warning"] button{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
font:inherit;font-size:0.8125rem;font-weight:700;color:var(--vibeui-drawer-006-fg);
}
[data-vibeui-block="drawer-006"] [data-part="warning"] button[data-role="leave"]{color:var(--vibeui-drawer-006-warn)}
[data-vibeui-block="drawer-006"] [data-part="warning"] button:focus-visible{outline:2px solid var(--vibeui-drawer-006-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="drawer-006"] [data-part="foot"]{
display:flex;gap:0.5rem;margin-top:0.75rem;
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border-top:1px solid var(--vibeui-drawer-006-border);
}
[data-vibeui-block="drawer-006"] [data-part="foot"] button{
appearance:none;cursor:pointer;flex:1;height:2.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-drawer-006-border);background:transparent;color:inherit;
font:inherit;font-size:0.875rem;font-weight:600;
}
[data-vibeui-block="drawer-006"] [data-part="foot"] button[data-primary="true"]{
border-color:transparent;background:var(--vibeui-drawer-006-accent);color:oklch(0.99 0.01 265);
}
[data-vibeui-block="drawer-006"] [data-part="foot"] button:focus-visible{outline:2px solid var(--vibeui-drawer-006-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-006"] *{animation:none!important;transition:none!important}
[data-vibeui-block="drawer-006"] dialog{translate:0 0}
}
`

/**
 * Ящик с формой и защитой от случайного закрытия: Escape сначала спрашивает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer006({
  triggerLabel = "Редактировать профиль",
  title = "Профиль",
  warning = "Изменения не сохранены. Закрыть панель и потерять их?",
  saveLabel = "Сохранить",
  accent,
  className,
  style,
  ...props
}: Drawer006Props) {
  const drawer = useRef<HTMLDialogElement>(null)
  const [dirty, setDirty] = useState(false)
  const [asking, setAsking] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-drawer-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  function open() {
    setDirty(false)
    setAsking(false)
    drawer.current?.showModal()
  }

  function leave() {
    setDirty(false)
    setAsking(false)
    drawer.current?.close()
  }

  function request() {
    if (dirty) {
      setAsking(true)
      return
    }

    leave()
  }

  return (
    <>
      <style href="vibeui-drawer-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="drawer-006"
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" onClick={open}>
          {triggerLabel}
        </button>
        <dialog
          ref={drawer}
          aria-label={title}
          onCancel={(event) => {
            if (dirty) {
              event.preventDefault()
              setAsking(true)
            }
          }}
        >
          <form
            method="dialog"
            onInput={() => setDirty(true)}
            onSubmit={() => leave()}
          >
            <div data-part="head">
              <h2 data-part="title">{title}</h2>
              {dirty ? <span data-part="mark">Не сохранено</span> : null}
            </div>
            <div data-part="body">
              <label data-part="field">
                <span data-part="label">Отображаемое имя</span>
                <input name="name" defaultValue="Анна Ковалёва" />
              </label>
              <label data-part="field">
                <span data-part="label">Почта для уведомлений</span>
                <input
                  name="email"
                  type="email"
                  defaultValue="anna@studio.ru"
                />
              </label>
              <label data-part="field">
                <span data-part="label">О себе</span>
                <textarea
                  name="about"
                  defaultValue="Собираю интерфейсы и веду каталог компонентов."
                />
              </label>
            </div>
            {asking ? (
              <div data-part="warning" role="alert">
                <p>{warning}</p>
                <button type="button" data-role="leave" onClick={leave}>
                  Уйти без сохранения
                </button>
                <button type="button" onClick={() => setAsking(false)}>
                  Остаться
                </button>
              </div>
            ) : null}
            <div data-part="foot">
              <button type="button" onClick={request}>
                Отмена
              </button>
              <button type="submit" data-primary="true">
                {saveLabel}
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </>
  )
}
