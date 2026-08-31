import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters003Option = {
  value: string
  count: number
  checked?: boolean
  disabled?: boolean
}

export type Filters003Group = {
  title: string
  options: Filters003Option[]
}

export type Filters003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  title?: string
  groups?: Filters003Group[]
  accent?: string
}

// Идея компонента: панель фильтров, где рядом с каждым значением стоит
// количество. Счётчик отвечает на вопрос до нажатия — «а есть ли там
// вообще что-нибудь», — и избавляет от пустых выдач. Значения с нулём не
// прячутся, а гаснут: исчезающие строки заставляют искать пропавший пункт.
// Группы — настоящие fieldset с legend, раскрытие держит <details> без JS.
const STYLES = `
:where([data-vibeui-block="filters-003"]){
--vibeui-filters-003-surface:oklch(1 0 0);
--vibeui-filters-003-fg:oklch(0.23 0.014 265);
--vibeui-filters-003-muted:oklch(0.56 0.014 265);
--vibeui-filters-003-border:oklch(0.9 0.006 265);
--vibeui-filters-003-shell:oklch(0.91 0.006 265);
--vibeui-filters-003-accent:oklch(0.53 0.18 250);
--vibeui-filters-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: панель показывают поверх любого фона. */
[data-vibeui-block="filters-003"]{
display:flex;flex-direction:column;
width:100%;max-width:16rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-003-surface);
border:1px solid var(--vibeui-filters-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-003-font);color:var(--vibeui-filters-003-fg);
}
[data-vibeui-block="filters-003"] *{box-sizing:border-box}
[data-vibeui-block="filters-003"] h3{margin:0 0 0.5rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-003"] details{border-top:1px solid var(--vibeui-filters-003-border)}
[data-vibeui-block="filters-003"] details > summary{
cursor:pointer;list-style:none;
display:flex;align-items:center;gap:0.375rem;
padding:0.5rem 0;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="filters-003"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="filters-003"] summary::after{
content:"";margin-inline-start:auto;width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-filters-003-muted);
border-bottom:1.5px solid var(--vibeui-filters-003-muted);
transform:rotate(-45deg);transition:transform .16s ease;
}
[data-vibeui-block="filters-003"] details[open] summary::after{transform:rotate(45deg)}
[data-vibeui-block="filters-003"] summary:focus-visible{outline:2px solid var(--vibeui-filters-003-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="filters-003"] fieldset{margin:0;padding:0 0 0.625rem;border:0;min-inline-size:0}
[data-vibeui-block="filters-003"] legend{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="filters-003"] label{
display:flex;align-items:center;gap:0.5rem;
padding:0.25rem 0;cursor:pointer;font-size:0.8125rem;
}
[data-vibeui-block="filters-003"] input{
appearance:none;flex:none;margin:0;cursor:pointer;
width:1rem;height:1rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-filters-003-border);
background:oklch(1 0 0);position:relative;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="filters-003"] input:checked{
background:var(--vibeui-filters-003-accent);
border-color:var(--vibeui-filters-003-accent);
}
[data-vibeui-block="filters-003"] input:checked::after{
content:"";position:absolute;left:0.3125rem;top:0.0625rem;
width:0.25rem;height:0.5rem;transform:rotate(42deg);
border-right:2px solid oklch(1 0 0);border-bottom:2px solid oklch(1 0 0);
}
[data-vibeui-block="filters-003"] input:focus-visible{outline:2px solid var(--vibeui-filters-003-accent);outline-offset:2px}
[data-vibeui-block="filters-003"] [data-part="value"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Счётчик отвечает до нажатия: есть ли там вообще что-нибудь. */
[data-vibeui-block="filters-003"] [data-part="count"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-filters-003-muted);
font-variant-numeric:tabular-nums;
}
/* Пустые значения гаснут, но остаются: исчезающие строки ищут глазами. */
[data-vibeui-block="filters-003"] label:has(input:disabled){cursor:not-allowed;opacity:.45}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Filters003Group[] = [
  {
    title: "Категория",
    options: [
      { value: "Формы", count: 128, checked: true },
      { value: "Навигация", count: 64 },
      { value: "Таблицы", count: 41 },
      { value: "Графики", count: 0, disabled: true },
    ],
  },
  {
    title: "Лицензия",
    options: [
      { value: "MIT", count: 190, checked: true },
      { value: "Apache 2.0", count: 34 },
      { value: "Коммерческая", count: 9 },
    ],
  },
]

/**
 * Боковая панель фильтров со счётчиками у каждого значения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters003({
  title = "Фильтры",
  groups = DEFAULT_GROUPS,
  accent,
  className,
  style,
  ...props
}: Filters003Props) {
  const palette = {
    ...(accent ? { "--vibeui-filters-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-filters-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-003"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>
        {groups.map((group) => (
          <details key={group.title} open>
            <summary>{group.title}</summary>
            <fieldset>
              <legend>{group.title}</legend>
              {group.options.map((option) => (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    name={group.title}
                    value={option.value}
                    defaultChecked={option.checked}
                    disabled={option.disabled}
                  />
                  <span data-part="value">{option.value}</span>
                  <span data-part="count">{option.count}</span>
                </label>
              ))}
            </fieldset>
          </details>
        ))}
      </div>
    </>
  )
}
