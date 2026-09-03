"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Inputgroup037Template = {
  id: string
  title: string
  text: string
}

export type Inputgroup037Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  placeholder?: string
  defaultValue?: string
  templates?: Inputgroup037Template[]
  onChange?: (value: string) => void
  hint?: string
  /** Подпись кнопки, открывающей список заготовок. */
  triggerText?: string
  /** Название списка для скринридера. */
  menuLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

const TEMPLATES: Inputgroup037Template[] = [
  {
    id: "greeting",
    title: "Приветствие",
    text: "Здравствуйте! Спасибо, что написали нам.",
  },
  {
    id: "wait",
    title: "Просьба подождать",
    text: "Уточняю детали, вернусь с ответом через пару минут.",
  },
  {
    id: "closed",
    title: "Вопрос решён",
    text: "Рад(а), что удалось помочь. Обращайтесь ещё!",
  },
]

// Идея компонента: список шаблонов — не select, а собственный поповер с
// role="listbox", потому что пункт нужно не выбрать значением поля, а
// вставить в поле готовым текстом, оставив возможность дописать своими
// словами. Поповер закрывается по Escape, клику снаружи и выбору пункта,
// фокус после выбора возвращается в текстовое поле.
const STYLES = `
:where([data-vibeui-block="inputgroup-037"]){
--vibeui-inputgroup-037-surface:transparent;
--vibeui-inputgroup-037-menu:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-inputgroup-037-shell:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-inputgroup-037-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-inputgroup-037-muted:color-mix(in oklab,var(--vibeui-inputgroup-037-fg) 68%,transparent);
--vibeui-inputgroup-037-field:light-dark(oklch(0.99 0.002 265),oklch(0.26 0.012 265));
--vibeui-inputgroup-037-fixed:light-dark(oklch(0.965 0.003 265),oklch(0.31 0.012 265));
--vibeui-inputgroup-037-border:light-dark(oklch(0.86 0.008 265),oklch(0.42 0.014 265));
--vibeui-inputgroup-037-accent:light-dark(oklch(0.55 0.14 190),oklch(0.78 0.12 190));
--vibeui-inputgroup-037-radius:0.75rem;
--vibeui-inputgroup-037-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="inputgroup-037"]{color-scheme:dark}
[data-vibeui-block="inputgroup-037"]{
position:relative;display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-037-surface);
border:1px solid var(--vibeui-inputgroup-037-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-037-font);color:var(--vibeui-inputgroup-037-fg);
}
[data-vibeui-block="inputgroup-037"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-037"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-037"] [data-part="group"]{display:flex;align-items:stretch;position:relative}
[data-vibeui-block="inputgroup-037"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-037-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-037"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-037-radius) 0 0 var(--vibeui-inputgroup-037-radius);
}
[data-vibeui-block="inputgroup-037"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-037-radius) var(--vibeui-inputgroup-037-radius) 0;
}
[data-vibeui-block="inputgroup-037"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-037"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-037-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-037-accent);
}
[data-vibeui-block="inputgroup-037"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-037-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-037"] [data-part="trigger"]{
appearance:none;flex:none;cursor:pointer;display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;background:var(--vibeui-inputgroup-037-fixed);
font-size:0.8125rem;font-weight:650;color:inherit;
transition:background-color .16s ease;
}
[data-vibeui-block="inputgroup-037"] [data-part="trigger"]:hover{
background:color-mix(in oklab,var(--vibeui-inputgroup-037-accent) 14%,var(--vibeui-inputgroup-037-fixed));
}
[data-vibeui-block="inputgroup-037"] [data-part="trigger"] svg{width:0.8125rem;height:0.8125rem;flex:none;display:block;transition:transform .16s ease}
[data-vibeui-block="inputgroup-037"] [data-part="trigger"][aria-expanded="true"] svg{transform:rotate(180deg)}
[data-vibeui-block="inputgroup-037"] [data-part="menu"]{
position:absolute;top:calc(100% + 0.375rem);right:0;left:0;z-index:2;
margin:0;padding:0.375rem;list-style:none;
background:var(--vibeui-inputgroup-037-menu);
border:1px solid var(--vibeui-inputgroup-037-border);border-radius:0.75rem;
box-shadow:0 0.75rem 1.75rem -0.75rem light-dark(oklch(0.2 0.02 265 / 0.35),oklch(0.05 0.01 265 / 0.65));
}
[data-vibeui-block="inputgroup-037"] [data-part="option"]{
display:block;width:100%;text-align:left;appearance:none;cursor:pointer;
border:0;border-radius:0.5rem;padding:0.5rem 0.625rem;background:transparent;color:inherit;font:inherit;
}
[data-vibeui-block="inputgroup-037"] [data-part="option"]:hover,
[data-vibeui-block="inputgroup-037"] [data-part="option"]:focus-visible{
background:color-mix(in oklab,var(--vibeui-inputgroup-037-accent) 12%,var(--vibeui-inputgroup-037-fixed));
outline:none;
}
[data-vibeui-block="inputgroup-037"] [data-part="option"] strong{display:block;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="inputgroup-037"] [data-part="option"] span{
display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-inputgroup-037-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="inputgroup-037"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-037-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-037"] *{transition:none!important}}
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
 * Сцепка «поле ответа + шаблоны»: кнопка справа открывает поповер со
 * списком заготовок, выбор вставляет текст в поле и возвращает фокус в него.
 * Закрытие по Escape и клику снаружи. Один файл, ноль зависимостей.
 */
export function Inputgroup037({
  name = "reply",
  label = "Быстрый ответ",
  placeholder = "Введите ответ или выберите шаблон",
  defaultValue = "",
  templates = TEMPLATES,
  onChange,
  hint = "Шаблон подставляет текст целиком — после вставки его можно дописать.",
  triggerText = "Шаблоны",
  menuLabel = "Шаблоны ответа",
  background = "",
  accent,
  className,
  style,
  ...props
}: Inputgroup037Props) {
  const id = useId()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const field = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        field.current?.focus()
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-037-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-inputgroup-037-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const pick = (template: Inputgroup037Template) => {
    setValue(template.text)
    onChange?.(template.text)
    setOpen(false)
    field.current?.focus()
  }

  return (
    <>
      <style href="vibeui-inputgroup-037" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="input-group"
        data-vibeui-block="inputgroup-037"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            ref={field}
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              setValue(event.target.value)
              onChange?.(event.target.value)
            }}
          />
          <button
            type="button"
            data-part="trigger"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${id}-menu`}
            onClick={() => setOpen((prev) => !prev)}
          >
            {triggerText}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path
                d="M4 6l4 4 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {open && (
            <ul
              data-part="menu"
              id={`${id}-menu`}
              role="listbox"
              aria-label={menuLabel}
            >
              {templates.map((template) => (
                <li key={template.id} role="presentation">
                  <button
                    type="button"
                    data-part="option"
                    role="option"
                    aria-selected={value === template.text}
                    onClick={() => pick(template)}
                  >
                    <strong>{template.title}</strong>
                    <span>{template.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
