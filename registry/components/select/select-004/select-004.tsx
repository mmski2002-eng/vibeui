import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Select004Option = {
  value: string
  label: string
}

export type Select004Props = Omit<
  ComponentProps<"select">,
  "size" | "children" | "multiple"
> & {
  label?: string
  hint?: string
  options?: Select004Option[]
  /** Сколько строк списка видно без прокрутки. */
  rows?: number
  /** Пусто — подложки нет, список лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный выбор без выпадающего меню. Нативный
// select[multiple] показывает весь список сразу, поэтому не приходится
// открывать его заново после каждого клика, а состояние выбранных строк
// рисует :checked — самодельный список чекбоксов здесь только мешал бы форме.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="select-004"]){
--vibeui-select-004-surface:transparent;
--vibeui-select-004-surface-border:transparent;
--vibeui-select-004-surface-pad:0;
--vibeui-select-004-surface-radius:0;
--vibeui-select-004-fg:light-dark(oklch(0.23 0.016 265),oklch(0.94 0.005 265));
--vibeui-select-004-muted:color-mix(in oklab,var(--vibeui-select-004-fg) 68%,transparent);
--vibeui-select-004-field:light-dark(oklch(0.985 0.002 265),oklch(0.25 0.012 265));
--vibeui-select-004-border:light-dark(oklch(0.87 0.008 265),oklch(0.42 0.014 265));
--vibeui-select-004-accent:light-dark(oklch(0.55 0.19 285),oklch(0.78 0.14 285));
--vibeui-select-004-tint:light-dark(oklch(0.55 0.19 285 / 14%),oklch(0.78 0.14 285 / 22%));
--vibeui-select-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="select-004"]{color-scheme:dark}
/* Подложка появляется только вместе с пропом background: по умолчанию список
   лежит прямо на фоне страницы. */
[data-vibeui-block="select-004"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
padding:var(--vibeui-select-004-surface-pad);
background:var(--vibeui-select-004-surface);
border:1px solid var(--vibeui-select-004-surface-border);
border-radius:var(--vibeui-select-004-surface-radius);
font-family:var(--vibeui-select-004-font);color:var(--vibeui-select-004-fg);
}
[data-vibeui-block="select-004"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-004"] select{
box-sizing:border-box;width:100%;margin:0;padding:0.25rem;
border:1px solid var(--vibeui-select-004-border);border-radius:0.625rem;
background:var(--vibeui-select-004-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="select-004"] select:focus-visible{
outline:2px solid var(--vibeui-select-004-accent);outline-offset:1px;border-color:transparent;
}
/* Выбранная строка красится сама: у select[multiple] :checked работает
   на option, а не только на подсветке системным цветом. */
[data-vibeui-block="select-004"] option{
padding:0.375rem 0.5rem;border-radius:0.375rem;color:inherit;
}
[data-vibeui-block="select-004"] option:checked{
background:var(--vibeui-select-004-tint);
color:var(--vibeui-select-004-accent);font-weight:600;
}
[data-vibeui-block="select-004"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-select-004-muted);
}
[data-vibeui-block="select-004"] kbd{
font:inherit;font-size:0.6875rem;padding:0.0625rem 0.3125rem;
border:1px solid var(--vibeui-select-004-border);border-radius:0.25rem;
background:var(--vibeui-select-004-field);
}
`

const DEFAULT_OPTIONS: Select004Option[] = [
  { value: "design", label: "Дизайн" },
  { value: "frontend", label: "Фронтенд" },
  { value: "backend", label: "Бэкенд" },
  { value: "analytics", label: "Аналитика" },
  { value: "content", label: "Контент" },
  { value: "qa", label: "Тестирование" },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Множественный выбор на нативном select[multiple]: весь список виден сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select004({
  label = "Направления работы",
  hint = "Несколько — с зажатой клавишей",
  options = DEFAULT_OPTIONS,
  rows = 5,
  background = "",
  accent,
  id,
  className,
  style,
  defaultValue = ["frontend", "analytics"],
  ...props
}: Select004Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = `${fieldId}-hint`
  // Подложка приходит вместе с полями и скруглением: без неё список лежит
  // прямо на странице, и лишние поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-select-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-select-004-surface": background,
          "--vibeui-select-004-surface-border":
            "light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265))",
          "--vibeui-select-004-surface-pad": "0.875rem",
          "--vibeui-select-004-surface-radius": "0.875rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-004" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="select"
        data-vibeui-block="select-004"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <select
          {...props}
          id={fieldId}
          aria-describedby={hint ? hintId : undefined}
          multiple
          size={rows}
          defaultValue={defaultValue}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hint ? (
          <p data-part="hint" id={hintId}>
            {hint} <kbd>Ctrl</kbd> / <kbd>⌘</kbd>
          </p>
        ) : null}
      </div>
    </>
  )
}
