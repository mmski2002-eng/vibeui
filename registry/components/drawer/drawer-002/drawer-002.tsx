"use client"

import { useRef } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Drawer002Action = {
  label: string
  hint?: string
  tone?: "neutral" | "danger"
}

export type Drawer002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  triggerLabel?: string
  title?: string
  actions?: Drawer002Action[]
  cancelLabel?: string
  /** Пусто — подложки нет, триггер лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список действий, выезжающий снизу под большой палец.
// На телефоне контекстное меню у края экрана недостижимо, поэтому действия
// переезжают вниз крупными строками. Ручка сверху обещает жест, а нижняя
// кнопка «Отмена» отделена промежутком: промах по ней ничего не стоит.
const STYLES = `
:where([data-vibeui-block="drawer-002"]){
--vibeui-drawer-002-bg:transparent;
--vibeui-drawer-002-surface:light-dark(oklch(1 0 0),oklch(0.22 0.013 265));
--vibeui-drawer-002-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-drawer-002-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-drawer-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-drawer-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-drawer-002-danger:light-dark(oklch(0.55 0.2 25),oklch(0.73 0.17 25));
--vibeui-drawer-002-hover:light-dark(oklch(0.97 0.003 265),oklch(0.28 0.013 265));
--vibeui-drawer-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="drawer-002"]{
display:inline-block;font-family:var(--vibeui-drawer-002-font);color:var(--vibeui-drawer-002-fg);
}
[data-vibeui-block="drawer-002"] [data-part="trigger"]{
appearance:none;cursor:pointer;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-drawer-002-border);border-radius:0.625rem;
background:var(--vibeui-drawer-002-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="drawer-002"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-drawer-002-accent);outline-offset:2px}
/* Ящик прижат к низу и не занимает экран целиком: сверху видно страницу. */
[data-vibeui-block="drawer-002"] dialog{
position:fixed;inset:auto 0 0 0;margin:0;
width:100%;max-width:100vw;max-height:85dvh;
padding:0;border:0;background:transparent;color:inherit;overflow:visible;
translate:0 100%;transition:translate .24s ease,overlay .24s allow-discrete,display .24s allow-discrete;
}
[data-vibeui-block="drawer-002"] dialog[open]{translate:0 0}
@starting-style{
[data-vibeui-block="drawer-002"] dialog[open]{translate:0 100%}
}
[data-vibeui-block="drawer-002"] dialog::backdrop{background:oklch(0.19 0.02 265 / 48%)}
[data-vibeui-block="drawer-002"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.5rem;box-sizing:border-box;
padding:0.375rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom,0px));
}
[data-vibeui-block="drawer-002"] [data-part="card"]{
display:flex;flex-direction:column;
background:var(--vibeui-drawer-002-surface);border-radius:1rem;
box-shadow:0 -18px 50px -28px oklch(0.2 0.02 265 / 60%);
overflow:hidden;
}
/* Ручка — обещание жеста: без неё лист выглядит окном, приклеенным к низу. */
[data-vibeui-block="drawer-002"] [data-part="grabber"]{
align-self:center;width:2.5rem;height:0.25rem;margin:0.625rem 0 0.25rem;
border-radius:9999px;background:var(--vibeui-drawer-002-border);flex:none;
}
[data-vibeui-block="drawer-002"] [data-part="title"]{
margin:0;padding:0.375rem 1rem 0.625rem;text-align:center;
font-size:0.8125rem;font-weight:600;color:var(--vibeui-drawer-002-muted);
}
[data-vibeui-block="drawer-002"] [data-part="list"]{
list-style:none;margin:0;padding:0;overflow-y:auto;
}
[data-vibeui-block="drawer-002"] [data-part="item"]+[data-part="item"]{
border-top:1px solid var(--vibeui-drawer-002-border);
}
/* Строка во всю ширину и высотой под палец: промахнуться почти невозможно. */
[data-vibeui-block="drawer-002"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;width:100%;
display:flex;flex-direction:column;gap:0.125rem;
min-height:3.25rem;padding:0.6875rem 1rem;
background:transparent;color:inherit;font:inherit;text-align:left;
}
[data-vibeui-block="drawer-002"] [data-part="action"]:hover{background:var(--vibeui-drawer-002-hover)}
[data-vibeui-block="drawer-002"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-drawer-002-accent);outline-offset:-2px}
[data-vibeui-block="drawer-002"] [data-part="label"]{font-size:0.9375rem;font-weight:600}
[data-vibeui-block="drawer-002"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-drawer-002-muted)}
[data-vibeui-block="drawer-002"] [data-part="action"][data-tone="danger"] [data-part="label"]{color:var(--vibeui-drawer-002-danger)}
/* Отмена отдельной картой: между ней и списком есть промах-зазор. */
[data-vibeui-block="drawer-002"] [data-part="cancel"]{
appearance:none;border:0;cursor:pointer;
height:3.25rem;border-radius:1rem;
background:var(--vibeui-drawer-002-surface);color:var(--vibeui-drawer-002-accent);
font:inherit;font-size:0.9375rem;font-weight:700;
box-shadow:0 -18px 50px -28px oklch(0.2 0.02 265 / 60%);
}
[data-vibeui-block="drawer-002"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-drawer-002-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="drawer-002"] *{animation:none!important;transition:none!important}
[data-vibeui-block="drawer-002"] dialog{translate:0 0}
}
`

const DEFAULT_ACTIONS: Drawer002Action[] = [
  { label: "Поделиться ссылкой", hint: "Скопируется в буфер обмена" },
  { label: "Дублировать проект" },
  { label: "Переименовать" },
  {
    label: "Удалить проект",
    hint: "Останется в корзине 30 дней",
    tone: "danger",
  },
]

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
 * Нижний ящик действий на телефоне: ручка, крупные строки, отдельная отмена.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Drawer002({
  triggerLabel = "Действия",
  title = "Проект «Витрина»",
  actions = DEFAULT_ACTIONS,
  cancelLabel = "Отмена",
  background = "",
  accent,
  className,
  style,
  ...props
}: Drawer002Props) {
  const drawer = useRef<HTMLDialogElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-drawer-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-drawer-002-bg": background,
          "--vibeui-drawer-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-drawer-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="drawer-002"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          onClick={() => drawer.current?.showModal()}
        >
          {triggerLabel}
        </button>
        <dialog
          ref={drawer}
          aria-label={title}
          onClick={(event) => {
            if (event.target === drawer.current) {
              drawer.current.close()
            }
          }}
        >
          <div data-part="panel">
            <div data-part="card">
              <span data-part="grabber" aria-hidden="true" />
              <p data-part="title">{title}</p>
              <ul data-part="list">
                {actions.map((action) => (
                  <li key={action.label} data-part="item">
                    <button
                      type="button"
                      data-part="action"
                      data-tone={action.tone ?? "neutral"}
                      onClick={() => drawer.current?.close()}
                    >
                      <span data-part="label">{action.label}</span>
                      {action.hint ? (
                        <span data-part="hint">{action.hint}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              data-part="cancel"
              onClick={() => drawer.current?.close()}
            >
              {cancelLabel}
            </button>
          </div>
        </dialog>
      </div>
    </>
  )
}
