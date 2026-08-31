"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox017Row = {
  id: string
  name: string
  email: string
  role: string
}

export type Checkbox017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  caption?: string
  rows?: Checkbox017Row[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: таблица, в которой выбор ставится диапазоном. Клик с
// зажатым Shift отмечает всё от прошлой отметки до текущей — двадцать строк
// выбираются двумя движениями, а не двадцатью. Чекбокс шапки показывает
// промежуточное состояние, подсказка про Shift написана явно: скрытый жест
// не существует.
const STYLES = `
:where([data-vibeui-block="checkbox-017"]){
--vibeui-checkbox-017-bg:oklch(1 0 0);
--vibeui-checkbox-017-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-017-muted:oklch(0.56 0.014 265);
--vibeui-checkbox-017-border:oklch(0.91 0.006 265);
--vibeui-checkbox-017-head:oklch(0.975 0.003 265);
--vibeui-checkbox-017-accent:oklch(0.52 0.16 275);
--vibeui-checkbox-017-picked:oklch(0.96 0.025 275);
--vibeui-checkbox-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
width:1.0625rem;height:1.0625rem;margin:0;box-sizing:border-box;
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
border-right:2px solid oklch(0.99 0.01 275);border-bottom:2px solid oklch(0.99 0.01 275);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-017"] input:indeterminate::after{
content:"";position:absolute;left:50%;top:50%;
width:0.5rem;height:2px;margin:-1px 0 0 -0.25rem;border-radius:1px;
background:oklch(0.99 0.01 275);
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

/**
 * Выбор строк таблицы диапазоном: Shift отмечает всё от прошлой отметки
 * до текущей. Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox017({
  caption = "Участники проекта",
  rows = DEFAULT_ROWS,
  defaultValue = [],
  onChange,
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
                    aria-label="Выбрать все строки на странице"
                    onChange={() =>
                      update(all ? [] : rows.map((row) => row.id))
                    }
                  />
                </th>
                <th scope="col">Имя</th>
                <th scope="col">Почта</th>
                <th scope="col">Роль</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td data-part="pick">
                    <input
                      type="checkbox"
                      checked={value.includes(row.id)}
                      aria-label={`Выбрать ${row.name}`}
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
            Выбрано {value.length} из {rows.length}
          </span>
          <span>
            <kbd>Shift</kbd> + клик — диапазон
          </span>
        </p>
      </div>
    </>
  )
}
