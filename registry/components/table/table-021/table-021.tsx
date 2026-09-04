import type { ComponentProps, CSSProperties } from "react"

export type Table021Item = {
  title: string
  quantity: number
  price: number
}

export type Table021Group = {
  category: string
  items: Table021Item[]
}

export type Table021Props = Omit<ComponentProps<"div">, "children"> & {
  groups?: Table021Group[]
  caption?: string
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  columnText?: Record<string, string>
  /** Знак валюты в ценах. */
  currency?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: категория, общая для нескольких позиций, склеена в одну
// ячейку через rowspan вместо повтора названия в каждой строке. Ячейка несёт
// scope="rowgroup" — это ровно тот случай для этого значения scope, а не
// scope="row": заголовок относится не к одной строке, а сразу к нескольким.
// Граница между категориями держится на data-edge, а не на nth-child: высота
// групп у категорий разная.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-021"]){
--vibeui-table-021-bg:transparent;
--vibeui-table-021-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-table-021-muted:color-mix(in oklab,var(--vibeui-table-021-fg) 68%,transparent);
--vibeui-table-021-border:light-dark(oklch(0.92 0.006 265),oklch(0.36 0.011 265));
--vibeui-table-021-head:light-dark(oklch(0.5 0.02 265 / 5%),oklch(0.85 0.02 265 / 7%));
--vibeui-table-021-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-table-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-021"]{color-scheme:dark}
[data-vibeui-block="table-021"]{
width:100%;box-sizing:border-box;
font-family:var(--vibeui-table-021-font);color:var(--vibeui-table-021-fg);
}
[data-vibeui-block="table-021"] [data-part="shell"]{
background:var(--vibeui-table-021-bg);
border:1px solid var(--vibeui-table-021-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="table-021"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="table-021"] [data-part="scroll"]:focus-visible{
outline:2px solid var(--vibeui-table-021-accent);outline-offset:-2px;
}
[data-vibeui-block="table-021"] table{width:100%;border-collapse:collapse;font-size:0.8125rem;min-width:26rem}
[data-vibeui-block="table-021"] caption{
padding:0.875rem 1rem 0.625rem;text-align:left;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="table-021"] th,
[data-vibeui-block="table-021"] td{
padding:0.5rem 0.875rem;text-align:left;
border-top:1px solid var(--vibeui-table-021-border);
}
[data-vibeui-block="table-021"] thead th{background:var(--vibeui-table-021-head);font-weight:600}
[data-vibeui-block="table-021"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Категория: вертикально по центру своей группы, отдельный фон отличает её
   от обычных ячеек с товаром. */
[data-vibeui-block="table-021"] [data-part="category"]{
vertical-align:middle;font-weight:600;
background:var(--vibeui-table-021-head);
border-right:1px solid var(--vibeui-table-021-border);
}
/* Первая строка новой группы получает верхнюю границу потолще: иначе на
   глаз не отличить конец одной категории от начала следующей. */
[data-vibeui-block="table-021"] [data-edge="group"] th,
[data-vibeui-block="table-021"] [data-edge="group"] td{
border-top:2px solid var(--vibeui-table-021-border);
}
[data-vibeui-block="table-021"] tbody th{font-weight:500}
[data-vibeui-block="table-021"] tfoot td{
border-top:2px solid var(--vibeui-table-021-border);
font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-021"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Table021Group[] = [
  {
    category: "Электроника",
    items: [
      { title: "Наушники Air", quantity: 12, price: 4200 },
      { title: "Колонка Wave", quantity: 6, price: 3100 },
      { title: "Кабель USB-C", quantity: 40, price: 350 },
    ],
  },
  {
    category: "Мебель",
    items: [
      { title: "Стул Loft", quantity: 8, price: 6800 },
      { title: "Стол Nord", quantity: 3, price: 15400 },
    ],
  },
  {
    category: "Канцелярия",
    items: [{ title: "Блокнот А5", quantity: 25, price: 220 }],
  },
]

const COLUMN_TEXT: Record<string, string> = {
  category: "Категория",
  title: "Позиция",
  quantity: "Кол-во",
  price: "Цена",
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
 * Таблица позиций, сгруппированных по категории: название категории склеено
 * rowspan на всю группу вместо повтора в каждой строке. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Table021({
  groups = DEFAULT_GROUPS,
  caption = "Склад по категориям",
  columnText = COLUMN_TEXT,
  currency = "₽",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table021Props) {
  const palette = {
    ...(accent ? { "--vibeui-table-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const label = (key: string) => columnText[key] ?? COLUMN_TEXT[key]
  const money = (value: number) => `${value.toLocaleString("ru-RU")} ${currency}`
  const total = groups.reduce(
    (sum, group) =>
      sum + group.items.reduce((groupSum, item) => groupSum + item.price * item.quantity, 0),
    0,
  )

  return (
    <>
      <style href="vibeui-table-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-021"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div
            data-part="scroll"
            role="region"
            aria-label={caption}
            tabIndex={0}
          >
            <table>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  <th scope="col">{label("category")}</th>
                  <th scope="col">{label("title")}</th>
                  <th scope="col" data-align="end">
                    {label("quantity")}
                  </th>
                  <th scope="col" data-align="end">
                    {label("price")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) =>
                  group.items.map((item, itemIndex) => (
                    <tr
                      key={`${group.category}-${item.title}`}
                      data-edge={itemIndex === 0 ? "group" : undefined}
                    >
                      {itemIndex === 0 ? (
                        <th
                          scope="rowgroup"
                          rowSpan={group.items.length}
                          data-part="category"
                        >
                          {group.category}
                        </th>
                      ) : null}
                      <th scope="row">{item.title}</th>
                      <td data-align="end">{item.quantity}</td>
                      <td data-align="end">{money(item.price)}</td>
                    </tr>
                  )),
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>Итого</td>
                  <td data-align="end">{money(total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
