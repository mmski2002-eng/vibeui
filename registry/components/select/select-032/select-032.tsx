"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Select032Option = {
  value: string
  label: string
}

export type Select032Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  name?: string
  options?: Select032Option[]
  defaultValue?: string
  warningText?: string
  /** Вопрос панели, {from} — текущий вариант, {to} — предложенный. */
  confirmQuestionText?: string
  /** Название панели для скринридера. */
  confirmDialogText?: string
  /** Надпись на кнопке отказа. */
  cancelText?: string
  /** Надпись на кнопке согласия. */
  applyText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: смена значения не применяется мгновенно, а сперва
// показывает панель-подтверждение с именами старого и нового варианта.
// Пока пользователь не нажал «Подтвердить», применённое значение не
// меняется — select лишь показывает предложенный вариант, готовый
// откатиться назад по «Отмена» или Escape.
const STYLES = `
:where([data-vibeui-block="select-032"]){
--vibeui-select-032-surface:transparent;
--vibeui-select-032-surface-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-select-032-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-select-032-muted:color-mix(in oklab,var(--vibeui-select-032-fg) 68%,transparent);
--vibeui-select-032-field:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-select-032-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.012 265));
--vibeui-select-032-accent:light-dark(oklch(0.55 0.19 262),oklch(0.73 0.17 262));
--vibeui-select-032-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.012 265));
--vibeui-select-032-warn:light-dark(oklch(0.6 0.19 45),oklch(0.79 0.15 58));
--vibeui-select-032-warn-tint:color-mix(in oklab,var(--vibeui-select-032-warn) 10%,transparent);
--vibeui-select-032-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-032"]{color-scheme:dark}
[data-vibeui-block="select-032"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-032-surface);
border:1px solid var(--vibeui-select-032-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-032-font);color:var(--vibeui-select-032-fg);
container-type:inline-size;
}
[data-vibeui-block="select-032"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-032"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-032"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-032-border);border-radius:0.625rem;
background:var(--vibeui-select-032-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-032"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-032-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-032-accent) 22%,transparent);
}
[data-vibeui-block="select-032"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-032-muted);
border-bottom:1.5px solid var(--vibeui-select-032-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-032"] [data-part="confirm"]{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.75rem;border-radius:0.625rem;
border:1px solid color-mix(in oklab,var(--vibeui-select-032-warn) 45%,var(--vibeui-select-032-border));
background:var(--vibeui-select-032-warn-tint);
}
[data-vibeui-block="select-032"] [data-part="confirm-text"]{margin:0;font-size:0.8125rem;line-height:1.4}
[data-vibeui-block="select-032"] [data-part="confirm-actions"]{display:flex;gap:0.5rem}
[data-vibeui-block="select-032"] [data-part="confirm-actions"] button{
flex:1 1 auto;box-sizing:border-box;height:2.25rem;padding:0 0.75rem;
border-radius:0.5rem;font:inherit;font-size:0.8125rem;font-weight:600;cursor:pointer;
border:1px solid var(--vibeui-select-032-border);background:var(--vibeui-select-032-field);color:var(--vibeui-select-032-fg);
transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease;
}
[data-vibeui-block="select-032"] [data-part="confirm-actions"] button:focus-visible{
outline:none;border-color:var(--vibeui-select-032-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-032-accent) 22%,transparent);
}
[data-vibeui-block="select-032"] [data-part="confirm-actions"] [data-action="apply"]{
background:var(--vibeui-select-032-accent);border-color:var(--vibeui-select-032-accent);
color:var(--vibeui-select-032-on-accent);
}
/* Узкая колонка: две кнопки подтверждения в строку сжимаются до нечитаемых
   огрызков, поэтому ниже 15rem они встают друг под друга. */
@container (max-width: 15rem){
[data-vibeui-block="select-032"] [data-part="confirm-actions"]{flex-direction:column}
[data-vibeui-block="select-032"] select{padding:0 2rem 0 0.625rem}
[data-vibeui-block="select-032"] [data-part="arrow"]{right:0.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-032"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select032Option[] = [
  { value: "draft", label: "Черновик" },
  { value: "review", label: "На проверке" },
  { value: "published", label: "Опубликовано" },
  { value: "archived", label: "В архиве" },
]

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
 * Select со ступенчатым подтверждением: смена значения открывает панель
 * с вопросом и кнопками «Подтвердить» / «Отмена», применяется только после
 * согласия. Один файл, ноль зависимостей, клиентский компонент.
 */
export function Select032({
  label = "Статус публикации",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = options[0]?.value,
  warningText = "Несохранённые правки для текущего статуса будут потеряны.",
  confirmQuestionText = "Сменить «{from}» на «{to}»?",
  confirmDialogText = "Подтверждение смены значения",
  cancelText = "Отмена",
  applyText = "Подтвердить",
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select032Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const confirmId = `${fieldId}-confirm`
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "")
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    if (pending) {
      confirmButtonRef.current?.focus()
    }
  }, [pending])

  const currentOption = options.find((option) => option.value === value)
  const pendingOption = pending
    ? options.find((option) => option.value === pending)
    : undefined

  function handleSelectChange(nextValue: string) {
    if (nextValue === value) {
      setPending(null)
      return
    }
    setPending(nextValue)
  }

  function confirm() {
    if (pending) setValue(pending)
    setPending(null)
    selectRef.current?.focus()
  }

  function cancel() {
    setPending(null)
    selectRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      cancel()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-select-032-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-032-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-032" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="select"
        data-vibeui-block="select-032"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            ref={selectRef}
            id={fieldId}
            name={name}
            value={pending ?? value}
            aria-describedby={pending ? confirmId : undefined}
            onChange={(event) => handleSelectChange(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        {pending && pendingOption ? (
          <div
            data-part="confirm"
            id={confirmId}
            role="alertdialog"
            aria-label={confirmDialogText}
            onKeyDown={handleKeyDown}
          >
            <p data-part="confirm-text">
              {confirmQuestionText
                .replace("{from}", currentOption?.label ?? "")
                .replace("{to}", pendingOption.label)}{" "}
              {warningText}
            </p>
            <div data-part="confirm-actions">
              <button type="button" onClick={cancel}>
                {cancelText}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                data-action="apply"
                onClick={confirm}
              >
                {applyText}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
