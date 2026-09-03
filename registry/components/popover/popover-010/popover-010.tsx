"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover010Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  role?: string
  email?: string
  initials?: string
  actionLabel?: string
  onAction?: () => void
  accent?: string
  /** Доступная подпись карточки. {name} подставляется. */
  cardHint?: string
  /** Подложка карточки и кнопки действия. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: карточка о человеке появляется прямо у его имени —
// наведением для мыши, фокусом и нажатием для клавиатуры и тача. Закрытие
// откладывается на короткую паузу, чтобы курсор успел перейти с имени на
// карточку, а вход в саму карточку паузу отменяет. Escape и клик вне
// закрывают карточку сразу и возвращают фокус на имя.
const STYLES = `
:where([data-vibeui-block="popover-010"]){
--vibeui-popover-010-surface:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-010-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-010-muted:color-mix(in oklab,var(--vibeui-popover-010-fg) 68%,transparent);
--vibeui-popover-010-border:light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-010-accent:light-dark(oklch(0.55 0.16 260),oklch(0.74 0.14 260));
--vibeui-popover-010-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0.03 260));
--vibeui-popover-010-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 72%));
--vibeui-popover-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-010"]{color-scheme:dark}
[data-vibeui-block="popover-010"]{
position:relative;display:inline-block;
font-family:var(--vibeui-popover-010-font);color:var(--vibeui-popover-010-fg);
}
[data-vibeui-block="popover-010"] [data-part="trigger"]{
appearance:none;cursor:pointer;background:none;border:0;padding:0;
font:inherit;font-size:0.875rem;font-weight:650;color:var(--vibeui-popover-010-accent);
text-decoration:underline;text-decoration-color:transparent;
transition:text-decoration-color .16s ease;
}
[data-vibeui-block="popover-010"] [data-part="trigger"]:hover{text-decoration-color:currentColor}
[data-vibeui-block="popover-010"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-010-accent);outline-offset:2px}
[data-vibeui-block="popover-010"] [data-part="card"]{
position:absolute;top:calc(100% + 0.5rem);left:0;z-index:20;
width:min(17rem,100vw - 2rem);box-sizing:border-box;padding:0.875rem;
border:1px solid var(--vibeui-popover-010-border);border-radius:0.875rem;
background:var(--vibeui-popover-010-surface);color:inherit;
box-shadow:0 24px 50px -30px var(--vibeui-popover-010-shadow);
animation:vibeui-popover-010-in .14s ease both;
}
@keyframes vibeui-popover-010-in{from{opacity:0;translate:0 -0.25rem}to{opacity:1;translate:0 0}}
[data-vibeui-block="popover-010"] [data-part="head"]{
display:flex;align-items:center;gap:0.625rem;margin:0 0 0.625rem;
}
[data-vibeui-block="popover-010"] [data-part="avatar"]{
flex:none;display:grid;place-items:center;
width:2.5rem;height:2.5rem;border-radius:9999px;
background:var(--vibeui-popover-010-accent);color:var(--vibeui-popover-010-on-accent);
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="popover-010"] [data-part="who"]{display:flex;flex-direction:column;gap:0.0625rem;min-width:0}
[data-vibeui-block="popover-010"] [data-part="who"] b{font-size:0.875rem;font-weight:650}
[data-vibeui-block="popover-010"] [data-part="who"] span{font-size:0.75rem;color:var(--vibeui-popover-010-muted)}
[data-vibeui-block="popover-010"] [data-part="email"]{
margin:0 0 0.75rem;font-size:0.8125rem;color:var(--vibeui-popover-010-muted);
overflow-wrap:anywhere;
}
[data-vibeui-block="popover-010"] [data-part="action"]{
appearance:none;cursor:pointer;width:100%;
height:2rem;border-radius:0.5rem;border:1px solid var(--vibeui-popover-010-border);
background:var(--vibeui-popover-010-surface);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="popover-010"] [data-part="action"]:hover{border-color:var(--vibeui-popover-010-accent)}
[data-vibeui-block="popover-010"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-popover-010-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="popover-010"] *{animation:none!important;transition:none!important}
}
`

const CLOSE_DELAY = 160

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Карточка пользователя по наведению или фокусу на имя: аватар, роль,
 * почта и действие. Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover010({
  name = "Аня Соколова",
  role = "Дизайнер продукта",
  email = "anya@example.com",
  initials,
  actionLabel = "Написать",
  onAction,
  accent,
  cardHint = "Карточка пользователя {name}",
  background = "",
  className,
  style,
  ...props
}: Popover010Props) {
  const id = useId().replace(/:/g, "")
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const palette = {
    ...(accent ? { "--vibeui-popover-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-010-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY)
  }

  const closeNow = (returnFocus: boolean) => {
    cancelClose()
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow(true)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeNow(false)
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => cancelClose, [])

  const shownInitials =
    initials ??
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()

  return (
    <>
      <style href="vibeui-popover-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="popover"
        data-vibeui-block="popover-010"
        className={className}
        style={palette}
        onMouseEnter={() => {
          cancelClose()
          setOpen(true)
        }}
        onMouseLeave={scheduleClose}
      >
        <button
          ref={triggerRef}
          type="button"
          data-part="trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${id}-card`}
          onFocus={() => {
            cancelClose()
            setOpen(true)
          }}
          onBlur={scheduleClose}
          onClick={() => setOpen((current) => !current)}
        >
          {name}
        </button>

        {open ? (
          <div
            id={`${id}-card`}
            data-part="card"
            role="dialog"
            aria-label={cardHint.replace("{name}", name)}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div data-part="head">
              <span data-part="avatar" aria-hidden="true">
                {shownInitials}
              </span>
              <div data-part="who">
                <b>{name}</b>
                <span>{role}</span>
              </div>
            </div>
            <p data-part="email">{email}</p>
            <button
              type="button"
              data-part="action"
              onClick={() => {
                onAction?.()
                closeNow(true)
              }}
            >
              {actionLabel}
            </button>
          </div>
        ) : null}
      </div>
    </>
  )
}
