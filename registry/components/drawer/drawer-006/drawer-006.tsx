"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Drawer006Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  warning?: string
  saveLabel?: string
  /** Подписи полей по ключам name, email, about: русские по умолчанию. */
  fieldLabels?: Record<string, string>
  /** Стартовое содержимое тех же полей. */
  fieldValues?: Record<string, string>
  dirtyLabel?: string
  leaveLabel?: string
  stayLabel?: string
  cancelLabel?: string
  /** Пусто — подложки нет, триггер лежит прямо на фоне страницы. */
  background?: string
  /** Открыть шторку сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  accent?: string
}

// Идея компонента: ящик с формой, который не даёт закрыть себя молча.
// Escape у нативного dialog отменяется событием cancel, поэтому первое
// нажатие при заполненной форме не закрывает панель, а поднимает полосу
// предупреждения с явным выбором: уйти без сохранения или остаться.
const STYLES = `
:where([data-vibeui-block="drawer-006"]){
--vibeui-drawer-006-bg:transparent;
--vibeui-drawer-006-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-drawer-006-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-drawer-006-muted:color-mix(in oklab,var(--vibeui-drawer-006-fg) 68%,transparent);
--vibeui-drawer-006-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-drawer-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-drawer-006-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0 265));
--vibeui-drawer-006-warn:light-dark(oklch(0.62 0.15 65),oklch(0.81 0.13 75));
--vibeui-drawer-006-warn-bg:light-dark(oklch(0.96 0.04 85),oklch(0.32 0.05 75));
--vibeui-drawer-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="drawer-006"]{color-scheme:dark}
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
padding:0;border:0;background:var(--vibeui-drawer-006-surface);color:inherit;
box-shadow:-24px 0 60px -30px oklch(0.2 0 265 / 55%);
translate:100% 0;transition:translate .22s ease,overlay .22s allow-discrete,display .22s allow-discrete;
}
[data-vibeui-block="drawer-006"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-006"] dialog[open]{translate:100% 0}
}
/* Затемнение позади ящика одно на обе темы: подложка гасит страницу, а не красится вместе с ней. */
[data-vibeui-block="drawer-006"] dialog::backdrop{background:oklch(0.19 0 265 / 45%)}
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
background:var(--vibeui-drawer-006-surface);color:inherit;
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
border-color:transparent;background:var(--vibeui-drawer-006-accent);color:var(--vibeui-drawer-006-on-accent);
}
[data-vibeui-block="drawer-006"] [data-part="foot"] button:focus-visible{outline:2px solid var(--vibeui-drawer-006-accent);outline-offset:2px}
/* Немодальный показ: шторка остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации.
   overflow:hidden держит въезжающий translate внутри блока: без него на
   малой ширине шторка на миг проезжает за правый край страницы и дёргает
   горизонтальный скролл, пока не встанет на место. */
[data-vibeui-block="drawer-006"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:24rem;overflow:hidden;
}
[data-vibeui-block="drawer-006"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="drawer-006"]:has(dialog:not(:modal)[open]) [data-part="trigger"]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-006"] *{animation:none!important;transition:none!important}
[data-vibeui-block="drawer-006"] dialog{translate:0 0}
}
`

const FIELD_LABELS: Record<string, string> = {
  name: "Отображаемое имя",
  email: "Почта для уведомлений",
  about: "О себе",
}

const FIELD_VALUES: Record<string, string> = {
  name: "Анна Ковалёва",
  email: "anna@studio.ru",
  about: "Собираю интерфейсы и веду каталог компонентов.",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Ящик с формой и защитой от случайного закрытия: Escape сначала спрашивает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer006({
  triggerLabel = "Редактировать профиль",
  title = "Профиль",
  warning = "Изменения не сохранены. Закрыть панель и потерять их?",
  saveLabel = "Сохранить",
  fieldLabels = FIELD_LABELS,
  fieldValues = FIELD_VALUES,
  dirtyLabel = "Не сохранено",
  leaveLabel = "Уйти без сохранения",
  stayLabel = "Остаться",
  cancelLabel = "Отмена",
  background = "",
  defaultOpen = false,
  accent,
  className,
  style,
  ...props
}: Drawer006Props) {
  const drawer = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная шторка живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    drawer.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к шторке просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])
  const [dirty, setDirty] = useState(false)
  const [asking, setAsking] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-drawer-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-006-bg": background,
          "--vibeui-drawer-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="drawer"
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
              {dirty ? <span data-part="mark">{dirtyLabel}</span> : null}
            </div>
            <div data-part="body">
              <label data-part="field">
                <span data-part="label">
                  {fieldLabels.name ?? FIELD_LABELS.name}
                </span>
                <input
                  name="name"
                  defaultValue={fieldValues.name ?? FIELD_VALUES.name}
                />
              </label>
              <label data-part="field">
                <span data-part="label">
                  {fieldLabels.email ?? FIELD_LABELS.email}
                </span>
                <input
                  name="email"
                  type="email"
                  defaultValue={fieldValues.email ?? FIELD_VALUES.email}
                />
              </label>
              <label data-part="field">
                <span data-part="label">
                  {fieldLabels.about ?? FIELD_LABELS.about}
                </span>
                <textarea
                  name="about"
                  defaultValue={fieldValues.about ?? FIELD_VALUES.about}
                />
              </label>
            </div>
            {asking ? (
              <div data-part="warning" role="alert">
                <p>{warning}</p>
                <button type="button" data-role="leave" onClick={leave}>
                  {leaveLabel}
                </button>
                <button type="button" onClick={() => setAsking(false)}>
                  {stayLabel}
                </button>
              </div>
            ) : null}
            <div data-part="foot">
              <button type="button" onClick={request}>
                {cancelLabel}
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
