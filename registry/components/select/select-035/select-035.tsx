"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Select035Option = {
  value: string
  label: string
  /** Правая колонка строки: количество, размер, что угодно короткое. */
  hint?: string
}

export type Select035Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  name?: string
  options?: Select035Option[]
  defaultValue?: string[]
  placeholder?: string
  applyLabel?: string
  resetLabel?: string
  /** Строка счётчика; {count} — число отмеченных пунктов. */
  counterLabel?: string
  /**
   * Показать список развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме список не всплывает над содержимым и не закрывается кликом мимо.
   */
  open?: boolean
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: мультивыбор с черновиком. Галочки в списке меняют не
// значение поля, а черновой набор; в поле он попадает только по «Применить»,
// поэтому фильтр не пересчитывается на каждый щелчок, а «Сбросить» возвращает
// список к состоянию до открытия. Выбранное лежит чипами прямо в поле, счётчик
// под списком всё время называет число отмеченных.
// Отличие от select-013: там каждый щелчок применяется сразу, а чипы живут
// отдельной строкой над кнопкой.
const STYLES = `
:where([data-vibeui-block="select-035"]){
--vibeui-select-035-bg:transparent;
--vibeui-select-035-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-select-035-muted:color-mix(in oklab,var(--vibeui-select-035-fg) 68%,transparent);
--vibeui-select-035-border:light-dark(oklch(0.87 0 265),oklch(0.4 0 265));
--vibeui-select-035-accent:light-dark(oklch(0.28 0 0),oklch(0.906 0 0));
--vibeui-select-035-on-accent:oklch(from var(--vibeui-select-035-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-select-035-tint:color-mix(in oklab,var(--vibeui-select-035-accent) 14%,transparent);
--vibeui-select-035-panel:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-select-035-radius:0.625rem;
--vibeui-select-035-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-035"]{color-scheme:dark}
[data-vibeui-block="select-035"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:23rem;
/* container-type отрывает ширину от содержимого: без нижней границы блок
   схлопнется внутри flex-кадра. */
min-width:min(100%,15rem);container-type:inline-size;
background:var(--vibeui-select-035-bg);color:var(--vibeui-select-035-fg);
font-family:var(--vibeui-select-035-font);
}
[data-vibeui-block="select-035"] *{box-sizing:border-box}
[data-vibeui-block="select-035"] [data-part="label"]{
font-size:0.8125rem;font-weight:600;color:var(--vibeui-select-035-fg);
}
[data-vibeui-block="select-035"] [data-part="field"]{position:relative;display:block}
/* Поле растёт от чипов: фиксированная высота обрезала бы вторую строку. */
[data-vibeui-block="select-035"] [data-part="trigger"]{
appearance:none;cursor:pointer;display:flex;align-items:center;gap:0.5rem;
width:100%;min-height:2.625rem;padding:0.375rem 0.75rem;
border:1px solid var(--vibeui-select-035-border);
border-radius:var(--vibeui-select-035-radius);
background:transparent;color:var(--vibeui-select-035-fg);
font:inherit;font-size:0.9375rem;text-align:left;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-035"] [data-part="trigger"]:hover{border-color:var(--vibeui-select-035-accent)}
[data-vibeui-block="select-035"] [data-part="trigger"]:focus-visible{
outline:none;border-color:var(--vibeui-select-035-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-035-accent) 24%,transparent);
}
[data-vibeui-block="select-035"] [data-part="chips"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.25rem;flex:1;min-inline-size:0;
}
[data-vibeui-block="select-035"] [data-part="chip"]{
display:inline-flex;align-items:center;max-width:100%;
padding:0.125rem 0.5rem;border-radius:9999px;
background:var(--vibeui-select-035-tint);color:var(--vibeui-select-035-accent);
font-size:0.8125rem;font-weight:600;line-height:1.35;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-035"] [data-part="placeholder"]{
font-size:0.875rem;color:var(--vibeui-select-035-muted);
}
[data-vibeui-block="select-035"] [data-part="chevron"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-select-035-muted);
border-bottom:1.5px solid var(--vibeui-select-035-muted);
transform:translateY(-0.125rem) rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="select-035"] [data-part="trigger"][aria-expanded="true"] [data-part="chevron"]{
transform:translateY(0.0625rem) rotate(-135deg);
}
[data-vibeui-block="select-035"] [data-part="panel"]{
position:absolute;left:0;right:0;top:calc(100% + 0.375rem);z-index:20;
padding:0.3125rem;
background:var(--vibeui-select-035-panel);
border:1px solid var(--vibeui-select-035-border);border-radius:0.875rem;
box-shadow:0 0.75rem 1.75rem light-dark(oklch(0 0 0 / 16%),oklch(0 0 0 / 48%));
}
/* Витринный режим: список стоит в потоке под полем, а не всплывает слоем. */
[data-vibeui-block="select-035"] [data-part="panel"][data-open="true"]{
position:static;margin-block-start:0.375rem;box-shadow:none;
}
[data-vibeui-block="select-035"] [data-part="list"]{max-height:14rem;overflow-y:auto}
[data-vibeui-block="select-035"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.5rem;border-radius:0.5rem;cursor:pointer;
font-size:0.875rem;line-height:1.3;color:var(--vibeui-select-035-fg);
}
[data-vibeui-block="select-035"] [data-part="option"]:hover{background:var(--vibeui-select-035-tint)}
[data-vibeui-block="select-035"] [data-part="option"]:has(input:focus-visible){
outline:2px solid var(--vibeui-select-035-accent);outline-offset:-2px;
}
/* Настоящий input type="checkbox": клавиатура, пробел и озвучивание
   состояния достаются от браузера, роль руками не собирается. */
[data-vibeui-block="select-035"] [data-part="box"]{
flex:none;width:1rem;height:1rem;margin:0;accent-color:var(--vibeui-select-035-accent);
}
[data-vibeui-block="select-035"] [data-part="option-label"]{
flex:1;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-035"] [data-part="option"]:has(input:checked) [data-part="option-label"]{font-weight:650}
[data-vibeui-block="select-035"] [data-part="option-hint"]{
flex:none;font-size:0.75rem;font-variant-numeric:tabular-nums;color:var(--vibeui-select-035-muted);
}
[data-vibeui-block="select-035"] [data-part="footer"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin-block-start:0.25rem;padding:0.4375rem 0.375rem 0.1875rem;
border-block-start:1px solid color-mix(in oklab,var(--vibeui-select-035-border) 70%,transparent);
}
[data-vibeui-block="select-035"] [data-part="counter"]{
flex:1 1 6rem;min-inline-size:0;
font-size:0.75rem;font-weight:600;color:var(--vibeui-select-035-muted);
}
[data-vibeui-block="select-035"] [data-part="reset"],
[data-vibeui-block="select-035"] [data-part="apply"]{
appearance:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0.25rem 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="select-035"] [data-part="reset"]{
border:1px solid var(--vibeui-select-035-border);background:transparent;
color:var(--vibeui-select-035-fg);
}
[data-vibeui-block="select-035"] [data-part="reset"]:hover{border-color:var(--vibeui-select-035-accent)}
[data-vibeui-block="select-035"] [data-part="apply"]{
border:1px solid transparent;
background:var(--vibeui-select-035-accent);color:oklch(from var(--vibeui-select-035-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="select-035"] [data-part="reset"]:focus-visible,
[data-vibeui-block="select-035"] [data-part="apply"]:focus-visible{
outline:2px solid var(--vibeui-select-035-accent);outline-offset:2px;
}
@container (max-width: 17rem){
[data-vibeui-block="select-035"] [data-part="option-hint"]{display:none}
[data-vibeui-block="select-035"] [data-part="counter"]{flex:1 1 100%}
[data-vibeui-block="select-035"] [data-part="reset"],
[data-vibeui-block="select-035"] [data-part="apply"]{flex:1 1 100%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-035"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select035Option[] = [
  { value: "new", label: "Новые", hint: "24" },
  { value: "work", label: "В работе", hint: "11" },
  { value: "review", label: "На проверке", hint: "6" },
  { value: "hold", label: "Отложены", hint: "3" },
  { value: "done", label: "Завершены", hint: "148" },
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
 * Мультивыбор с чекбоксами и черновиком: отмеченное попадает в поле чипами
 * только по «Применить». Один файл, ноль зависимостей, своя палитра.
 */
export function Select035({
  label = "Статусы заявок",
  name,
  options = DEFAULT_OPTIONS,
  defaultValue = ["new", "work"],
  placeholder = "Все статусы",
  applyLabel = "Применить",
  resetLabel = "Сбросить",
  counterLabel = "Выбрано {count}",
  open = false,
  background = "",
  accent,
  id,
  className,
  style,
  ...props
}: Select035Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const panelId = `${fieldId}-panel`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [applied, setApplied] = useState<string[]>(defaultValue)
  const [draft, setDraft] = useState<string[]>(defaultValue)
  const [expanded, setExpanded] = useState(false)

  const visible = open || expanded
  const chips = options.filter((option) => applied.includes(option.value))

  useEffect(() => {
    if (!expanded) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setExpanded(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [expanded])

  function toggleDraft(value: string) {
    setDraft((current) =>
      current.includes(value)
        ? current.filter((entry) => entry !== value)
        : [...current, value],
    )
  }

  function openPanel() {
    setDraft(applied)
    setExpanded(true)
  }

  function apply() {
    setApplied(draft)
    setExpanded(false)
    triggerRef.current?.focus()
  }

  function handlePanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault()
      setDraft(applied)
      setExpanded(false)
      triggerRef.current?.focus()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-select-035-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-035-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-035" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={rootRef}
        data-slot="select"
        data-vibeui-block="select-035"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${fieldId}-label`}>
          {label}
        </span>
        {name
          ? applied.map((value) => (
              <input key={value} type="hidden" name={name} value={value} />
            ))
          : null}
        <span data-part="field">
          <button
            ref={triggerRef}
            id={fieldId}
            type="button"
            data-part="trigger"
            aria-expanded={visible}
            aria-controls={panelId}
            aria-labelledby={`${fieldId}-label ${fieldId}`}
            onClick={() => (expanded ? setExpanded(false) : openPanel())}
          >
            <span data-part="chips">
              {chips.length === 0 ? (
                <span data-part="placeholder">{placeholder}</span>
              ) : (
                chips.map((chip) => (
                  <span key={chip.value} data-part="chip">
                    {chip.label}
                  </span>
                ))
              )}
            </span>
            <span data-part="chevron" aria-hidden="true" />
          </button>
          {visible ? (
            <div
              data-part="panel"
              data-open={open || undefined}
              id={panelId}
              role="group"
              aria-labelledby={`${fieldId}-label`}
              onKeyDown={handlePanelKeyDown}
            >
              <div data-part="list">
                {options.map((option) => (
                  <label key={option.value} data-part="option">
                    <input
                      type="checkbox"
                      data-part="box"
                      checked={draft.includes(option.value)}
                      onChange={() => toggleDraft(option.value)}
                    />
                    <span data-part="option-label">{option.label}</span>
                    {option.hint ? (
                      <span data-part="option-hint">{option.hint}</span>
                    ) : null}
                  </label>
                ))}
              </div>
              <div data-part="footer">
                <span data-part="counter" aria-live="polite">
                  {counterLabel.replace("{count}", String(draft.length))}
                </span>
                <button
                  type="button"
                  data-part="reset"
                  onClick={() => setDraft([])}
                >
                  {resetLabel}
                </button>
                <button type="button" data-part="apply" onClick={apply}>
                  {applyLabel}
                </button>
              </div>
            </div>
          ) : null}
        </span>
      </div>
    </>
  )
}
