import type { ComponentProps, CSSProperties } from "react"

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

export type Filters003Props = Omit<ComponentProps<"div">, "children"> & {
  title?: string
  groups?: Filters003Group[]
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: панель фильтров, где рядом с каждым значением стоит
// количество. Счётчик отвечает на вопрос до нажатия — «а есть ли там
// вообще что-нибудь», — и избавляет от пустых выдач. Значения с нулём не
// прячутся, а гаснут: исчезающие строки заставляют искать пропавший пункт.
// Группы — настоящие fieldset с legend, раскрытие держит <details> без JS.
const STYLES = `
:where([data-vibeui-block="filters-003"]){
--vibeui-filters-003-surface:transparent;
--vibeui-filters-003-box:light-dark(oklch(1 0 0),oklch(0.28 0.012 265));
--vibeui-filters-003-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-filters-003-muted:color-mix(in oklab,var(--vibeui-filters-003-fg) 68%,transparent);
--vibeui-filters-003-border:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.014 265));
--vibeui-filters-003-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-filters-003-accent:light-dark(oklch(0.53 0.18 250),oklch(0.74 0.15 250));
--vibeui-filters-003-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 250));
--vibeui-filters-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-003"]{color-scheme:dark}
/* Подложки по умолчанию нет: панель ложится на фон страницы. */
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
background:var(--vibeui-filters-003-box);position:relative;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="filters-003"] input:checked{
background:var(--vibeui-filters-003-accent);
border-color:var(--vibeui-filters-003-accent);
}
[data-vibeui-block="filters-003"] input:checked::after{
content:"";position:absolute;left:0.3125rem;top:0.0625rem;
width:0.25rem;height:0.5rem;transform:rotate(42deg);
border-right:2px solid var(--vibeui-filters-003-on-accent);
border-bottom:2px solid var(--vibeui-filters-003-on-accent);
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
 * Боковая панель фильтров со счётчиками у каждого значения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters003({
  title = "Фильтры",
  groups = DEFAULT_GROUPS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Filters003Props) {
  const palette = {
    ...(accent ? { "--vibeui-filters-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-filters-003-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-filters-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="filters"
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
