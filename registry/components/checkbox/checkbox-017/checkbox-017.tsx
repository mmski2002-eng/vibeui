"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Checkbox017Row = {
  id: string
  name: string
  email: string
  role: string
}

export type Checkbox017Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  caption?: string
  rows?: Checkbox017Row[]
  defaultValue?: string[]
  /** Заголовки колонок по ключам name, email, role. */
  columnText?: Record<string, string>
  /** Доступное имя чекбокса в шапке. */
  selectAllLabel?: string
  /** Доступное имя чекбокса строки. {name} — имя из строки. */
  rowLabel?: string
  /** Счётчик внизу. {count} — выбрано, {total} — всего. */
  countText?: string
  /** Подпись клавиши в подсказке. */
  shiftKeyLabel?: string
  /** Текст подсказки после клавиши. */
  rangeHint?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: таблица, в которой выбор ставится диапазоном. Клик с
// зажатым Shift отмечает всё от прошлой отметки до текущей — двадцать строк
// выбираются двумя движениями, а не двадцатью. Чекбокс шапки показывает
// промежуточное состояние, подсказка про Shift написана явно: скрытый жест
// не существует.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="checkbox-017"]){
--vibeui-checkbox-017-bg:transparent;
--vibeui-checkbox-017-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-checkbox-017-muted:color-mix(in oklab,var(--vibeui-checkbox-017-fg) 68%,transparent);
--vibeui-checkbox-017-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-checkbox-017-head:light-dark(oklch(0.975 0.003 265),oklch(0.27 0.009 265));
--vibeui-checkbox-017-accent:light-dark(oklch(0.52 0.16 275),oklch(0.66 0.16 275));
--vibeui-checkbox-017-picked:light-dark(oklch(0.96 0.025 275),oklch(0.31 0.045 275));
--vibeui-checkbox-017-on-accent:oklch(0.99 0.01 275);
--vibeui-checkbox-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="checkbox-017"]{color-scheme:dark}
[data-vibeui-block="checkbox-017"]{
display:block;width:100%;max-width:34rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-checkbox-017-border);border-radius:0.875rem;
background:var(--vibeui-checkbox-017-bg);
font-family:var(--vibeui-checkbox-017-font);color:var(--vibeui-checkbox-017-fg);
}
[data-vibeui-block="checkbox-017"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="checkbox-017"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="checkbox-017"] caption{
padding:0.625rem 0.75rem;text-align:left;
font-size:0.8125rem;font-weight:650;
border-bottom:1px solid var(--vibeui-checkbox-017-border);
}
[data-vibeui-block="checkbox-017"] th,
[data-vibeui-block="checkbox-017"] td{
padding:0.5rem 0.625rem;text-align:left;white-space:nowrap;
border-bottom:1px solid var(--vibeui-checkbox-017-border);
}
[data-vibeui-block="checkbox-017"] thead th{
background:var(--vibeui-checkbox-017-head);
font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-checkbox-017-muted);
}
[data-vibeui-block="checkbox-017"] [data-part="pick"]{width:1px}
[data-vibeui-block="checkbox-017"] tbody tr:has(input:checked){background:var(--vibeui-checkbox-017-picked)}
[data-vibeui-block="checkbox-017"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="checkbox-017"] [data-part="mail"]{color:var(--vibeui-checkbox-017-muted)}
[data-vibeui-block="checkbox-017"] input{
appearance:none;position:relative;display:block;cursor:pointer;
width:1.125rem;height:1.125rem;margin:0;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-017-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-017-bg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="checkbox-017"] input:checked,
[data-vibeui-block="checkbox-017"] input:indeterminate{
border-color:transparent;background:var(--vibeui-checkbox-017-accent);
}
[data-vibeui-block="checkbox-017"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.25rem;height:0.4375rem;margin:-0.3125rem 0 0 -0.125rem;
border-right:2px solid var(--vibeui-checkbox-017-on-accent);border-bottom:2px solid var(--vibeui-checkbox-017-on-accent);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-017"] input:indeterminate::after{
content:"";position:absolute;left:50%;top:50%;
width:0.5rem;height:2px;margin:-1px 0 0 -0.25rem;border-radius:1px;
background:var(--vibeui-checkbox-017-on-accent);
}
[data-vibeui-block="checkbox-017"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-017-accent);outline-offset:2px}
[data-vibeui-block="checkbox-017"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap;
padding:0.5rem 0.75rem;
background:var(--vibeui-checkbox-017-head);
font-size:0.75rem;color:var(--vibeui-checkbox-017-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="checkbox-017"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-checkbox-017-border);
background:var(--vibeui-checkbox-017-bg);
font-family:inherit;font-size:0.6875rem;font-weight:650;color:var(--vibeui-checkbox-017-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Checkbox017Row[] = [
  { id: "1", name: "Анна Кравцова", email: "anna@studio.io", role: "Владелец" },
  { id: "2", name: "Пётр Дёмин", email: "petr@studio.io", role: "Редактор" },
  { id: "3", name: "Мария Луц", email: "maria@studio.io", role: "Редактор" },
  { id: "4", name: "Игорь Соин", email: "igor@studio.io", role: "Читатель" },
  { id: "5", name: "Лена Аскарова", email: "lena@studio.io", role: "Читатель" },
]

const DEFAULT_COLUMNS: Record<string, string> = {
  name: "Имя",
  email: "Почта",
  role: "Роль",
}

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
 * Выбор строк таблицы диапазоном: Shift отмечает всё от прошлой отметки
 * до текущей. Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox017({
  caption = "Участники проекта",
  rows = DEFAULT_ROWS,
  defaultValue = [],
  columnText = DEFAULT_COLUMNS,
  selectAllLabel = "Выбрать все строки на странице",
  rowLabel = "Выбрать {name}",
  countText = "Выбрано {count} из {total}",
  shiftKeyLabel = "Shift",
  rangeHint = "+ клик — диапазон",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Checkbox017Props) {
  const [value, setValue] = useState<string[]>(defaultValue)
  const [anchor, setAnchor] = useState<number | null>(null)
  const headRef = useRef<HTMLInputElement>(null)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-checkbox-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const all = rows.length > 0 && value.length === rows.length
  const some = value.length > 0 && !all

  useEffect(() => {
    if (headRef.current) {
      headRef.current.indeterminate = some
    }
  }, [some])

  const update = (next: string[]) => {
    setValue(next)
    onChange?.(next)
  }

  const pick = (index: number, shift: boolean) => {
    const row = rows[index]

    // Shift расширяет выбор от предыдущей отметки: диапазон добавляется
    // целиком, а не переключается построчно.
    if (shift && anchor !== null) {
      const from = Math.min(anchor, index)
      const to = Math.max(anchor, index)
      const range = rows.slice(from, to + 1).map((entry) => entry.id)

      update([...new Set([...value, ...range])])
      return
    }

    setAnchor(index)
    update(
      value.includes(row.id)
        ? value.filter((item) => item !== row.id)
        : [...value, row.id],
    )
  }

  return (
    <>
      <style href="vibeui-checkbox-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="checkbox"
        data-vibeui-block="checkbox-017"
        className={className}
        style={palette}
      >
        <div data-part="scroll">
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th data-part="pick" scope="col">
                  <input
                    ref={headRef}
                    type="checkbox"
                    checked={all}
                    aria-label={selectAllLabel}
                    onChange={() =>
                      update(all ? [] : rows.map((row) => row.id))
                    }
                  />
                </th>
                <th scope="col">{columnText.name ?? DEFAULT_COLUMNS.name}</th>
                <th scope="col">{columnText.email ?? DEFAULT_COLUMNS.email}</th>
                <th scope="col">{columnText.role ?? DEFAULT_COLUMNS.role}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td data-part="pick">
                    <input
                      type="checkbox"
                      checked={value.includes(row.id)}
                      aria-label={rowLabel.replace("{name}", row.name)}
                      onChange={() => undefined}
                      onClick={(event) => pick(index, event.shiftKey)}
                    />
                  </td>
                  <td>{row.name}</td>
                  <td data-part="mail">{row.email}</td>
                  <td>{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p data-part="foot">
          <span role="status">
            {countText
              .replace("{count}", String(value.length))
              .replace("{total}", String(rows.length))}
          </span>
          <span>
            <kbd>{shiftKeyLabel}</kbd> {rangeHint}
          </span>
        </p>
      </div>
    </>
  )
}
