"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover009Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  fieldLabel?: string
  value?: string
  saveLabel?: string
  cancelLabel?: string
  onSave?: (value: string) => void
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка панели, кнопки и поля. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: правка одного значения на месте, без перехода на форму.
// Панель управляется состоянием, а не HTML popover, потому что ей нужно
// возвращать фокус на кнопку и закрываться и по Escape, и по клику вне —
// оба пути откатывают черновик, сохраняет только явная кнопка «Сохранить».
// Панель лежит внутри контейнера с position:relative, поэтому не вылезает
// за карточку каталога.
const STYLES = `
:where([data-vibeui-block="popover-009"]){
--vibeui-popover-009-surface:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-009-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-009-muted:color-mix(in oklab,var(--vibeui-popover-009-fg) 68%,transparent);
--vibeui-popover-009-border:light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-009-hover:light-dark(oklch(0.96 0.004 265),oklch(0.27 0.014 265));
--vibeui-popover-009-accent:light-dark(oklch(0.53 0.18 268),oklch(0.73 0.16 268));
--vibeui-popover-009-on-accent:light-dark(oklch(1 0 0),oklch(0.17 0.03 268));
--vibeui-popover-009-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 72%));
--vibeui-popover-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-009"]{color-scheme:dark}
[data-vibeui-block="popover-009"]{
position:relative;display:inline-block;
font-family:var(--vibeui-popover-009-font);color:var(--vibeui-popover-009-fg);
}
[data-vibeui-block="popover-009"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-popover-009-border);
background:var(--vibeui-popover-009-surface);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="popover-009"] [data-part="trigger"]:hover{border-color:var(--vibeui-popover-009-accent)}
[data-vibeui-block="popover-009"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-009-accent);outline-offset:2px}
[data-vibeui-block="popover-009"] [data-part="panel"]{
position:absolute;top:calc(100% + 0.5rem);left:0;z-index:20;
width:min(18rem,100vw - 2rem);box-sizing:border-box;padding:0.875rem;
border:1px solid var(--vibeui-popover-009-border);border-radius:0.875rem;
background:var(--vibeui-popover-009-surface);color:inherit;
box-shadow:0 24px 50px -30px var(--vibeui-popover-009-shadow);
animation:vibeui-popover-009-in .14s ease both;
}
@keyframes vibeui-popover-009-in{from{opacity:0;translate:0 -0.25rem}to{opacity:1;translate:0 0}}
[data-vibeui-block="popover-009"] [data-part="field"]{
display:flex;flex-direction:column;gap:0.25rem;margin:0 0 0.75rem;
}
[data-vibeui-block="popover-009"] [data-part="field"] span{font-size:0.75rem;color:var(--vibeui-popover-009-muted)}
[data-vibeui-block="popover-009"] input{
height:2.25rem;padding:0 0.625rem;box-sizing:border-box;
border:1px solid var(--vibeui-popover-009-border);border-radius:0.5rem;
background:var(--vibeui-popover-009-surface);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="popover-009"] input:focus-visible{
outline:none;border-color:var(--vibeui-popover-009-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-popover-009-accent) 16%,transparent);
}
[data-vibeui-block="popover-009"] [data-part="row"]{display:flex;gap:0.5rem;justify-content:flex-end}
[data-vibeui-block="popover-009"] [data-part="cancel"],
[data-vibeui-block="popover-009"] [data-part="save"]{
appearance:none;cursor:pointer;
height:2rem;padding:0 0.8125rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="popover-009"] [data-part="cancel"]{
border:1px solid var(--vibeui-popover-009-border);background:transparent;color:var(--vibeui-popover-009-fg);
}
[data-vibeui-block="popover-009"] [data-part="cancel"]:hover{background:var(--vibeui-popover-009-hover)}
[data-vibeui-block="popover-009"] [data-part="save"]{
border:0;background:var(--vibeui-popover-009-accent);color:var(--vibeui-popover-009-on-accent);
}
[data-vibeui-block="popover-009"] [data-part="cancel"]:focus-visible,
[data-vibeui-block="popover-009"] [data-part="save"]:focus-visible{outline:2px solid var(--vibeui-popover-009-accent);outline-offset:2px}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя. */
[data-vibeui-block="popover-009"][data-open] [popover]{
display:block;position:static;inset:auto;margin:0.5rem 0 0;
}
/* Раскрытая панель на месте: в потоке, а не поверх карточки. Так её
   показывают на витрине и в документации. */
[data-vibeui-block="popover-009"][data-open] [data-part="panel"]{
position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="popover-009"] *{animation:none!important;transition:none!important}
}
`

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
 * Поповер быстрой правки одного поля: черновик, кнопки «Сохранить» и
 * «Отмена», закрытие по Escape и клику вне, возврат фокуса на кнопку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover009({
  label = "Изменить",
  fieldLabel = "Название",
  value = "Список задач",
  saveLabel = "Сохранить",
  cancelLabel = "Отмена",
  onSave,
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover009Props) {
  const id = useId().replace(/:/g, "")
  const [open, setOpen] = useState(defaultOpen)
  const [draft, setDraft] = useState(value)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-popover-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-009-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return

    inputRef.current?.focus()
    inputRef.current?.select()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDraft(value)
        close()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setDraft(value)
        close()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const save = () => {
    onSave?.(draft)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const cancel = () => {
    setDraft(value)
    close()
  }

  return (
    <>
      <style href="vibeui-popover-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="popover"
        data-vibeui-block="popover-009"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button
          ref={triggerRef}
          type="button"
          data-part="trigger"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => {
            setDraft(value)
            setOpen((current) => !current)
          }}
        >
          {label}
        </button>

        {open ? (
          <div
            id={`${id}-panel`}
            data-part="panel"
            role="dialog"
            aria-label={fieldLabel}
          >
            <label data-part="field" htmlFor={`${id}-input`}>
              <span>{fieldLabel}</span>
              <input
                ref={inputRef}
                id={`${id}-input`}
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") save()
                }}
              />
            </label>
            <div data-part="row">
              <button type="button" data-part="cancel" onClick={cancel}>
                {cancelLabel}
              </button>
              <button type="button" data-part="save" onClick={save}>
                {saveLabel}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
