import type { CSSProperties } from "react"

export type Solutions005Item = {
  sku: string
  name: string
  place: string
  stock: number
  min: number
  incoming?: number
}

export type Solutions005Props = {
  title?: string
  hint?: string
  items?: Solutions005Item[]
  order?: string
  /** Шапка таблицы: ключи item, place, stock, state. */
  columnText?: Record<string, string>
  /** Состояния: ключи ok, low, out. */
  stateText?: Record<string, string>
  /** Остаток, {stock} — число на складе. */
  stockText?: string
  /** Порог, {min} — минимальный остаток. */
  minText?: string
  /** Ожидаемая поставка, {count} — сколько едет. */
  incomingText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: остатки склада. Состояние выводится из остатка и порога, а не
// приходит готовой меткой: иначе после списания цифра и метка расходятся.
// Порог показан рядом с остатком — «12 шт.» ничего не значит без «мин. 20».
// Строка ниже порога помечена формой значка и жирным остатком, а не только
// цветом. Ожидаемая поставка стоит в той же строке: без неё заказывают то,
// что уже едет.
const STYLES = `
:where([data-vibeui-block="solutions-005"]){
--vibeui-solutions-005-bg:transparent;
--vibeui-solutions-005-panel:light-dark(oklch(0.985 0.002 265),oklch(0.27 0.012 265));
--vibeui-solutions-005-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-005-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-solutions-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.35 0.012 265));
--vibeui-solutions-005-ok:light-dark(oklch(0.58 0.14 152),oklch(0.76 0.14 152));
--vibeui-solutions-005-low:light-dark(oklch(0.7 0.15 75),oklch(0.82 0.14 80));
--vibeui-solutions-005-out:light-dark(oklch(0.57 0.19 25),oklch(0.73 0.16 25));
--vibeui-solutions-005-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-solutions-005-onaccent:light-dark(oklch(1 0 0),oklch(0.17 0.012 265));
--vibeui-solutions-005-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-005"]{color-scheme:dark}
[data-vibeui-block="solutions-005"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-005-bg);
border:1px solid var(--vibeui-solutions-005-border);border-radius:1rem;
font-family:var(--vibeui-solutions-005-sans);color:var(--vibeui-solutions-005-fg);
}
[data-vibeui-block="solutions-005"] *{box-sizing:border-box}
[data-vibeui-block="solutions-005"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.625rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-005"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-005"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-005-muted)}
[data-vibeui-block="solutions-005"] [data-part="order"]{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-solutions-005-accent);color:var(--vibeui-solutions-005-onaccent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="solutions-005"] [data-part="order"]:focus-visible{outline:2px solid var(--vibeui-solutions-005-accent);outline-offset:2px}
[data-vibeui-block="solutions-005"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-005"] th,
[data-vibeui-block="solutions-005"] td{
padding:0.5rem 1rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-005-border);
}
[data-vibeui-block="solutions-005"] th{
font-size:0.6875rem;font-weight:600;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-solutions-005-muted);background:var(--vibeui-solutions-005-panel);
}
[data-vibeui-block="solutions-005"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-005"] [data-part="sku"]{
display:block;font-family:var(--vibeui-solutions-005-mono);
font-size:0.6875rem;color:var(--vibeui-solutions-005-muted);
}
/* Порог рядом с остатком: «12 шт.» ничего не значит без «мин. 20». */
[data-vibeui-block="solutions-005"] [data-part="min"]{
display:block;font-size:0.6875rem;color:var(--vibeui-solutions-005-muted);
}
[data-vibeui-block="solutions-005"] [data-part="stock"]{font-weight:650}
[data-vibeui-block="solutions-005"] [data-state="low"] [data-part="stock"],
[data-vibeui-block="solutions-005"] [data-state="out"] [data-part="stock"]{font-weight:700}
/* Состояние выводится из чисел, а не приходит меткой: цифра и метка не разойдутся. */
[data-vibeui-block="solutions-005"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:600;color:var(--vibeui-solutions-005-muted);
}
[data-vibeui-block="solutions-005"] [data-part="dot"]{
width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-solutions-005-ok);
}
[data-vibeui-block="solutions-005"] [data-state="low"] [data-part="dot"]{
background:none;box-shadow:inset 0 0 0 2px var(--vibeui-solutions-005-low);
}
[data-vibeui-block="solutions-005"] [data-state="out"] [data-part="dot"]{
border-radius:0.125rem;background:var(--vibeui-solutions-005-out);
}
[data-vibeui-block="solutions-005"] [data-state="low"] [data-part="state"]{color:var(--vibeui-solutions-005-low)}
[data-vibeui-block="solutions-005"] [data-state="out"] [data-part="state"]{color:var(--vibeui-solutions-005-out)}
[data-vibeui-block="solutions-005"] [data-part="incoming"]{font-size:0.6875rem;color:var(--vibeui-solutions-005-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Solutions005Item[] = [
  {
    sku: "VU-1042",
    name: "Свитшот «Тихий вечер», M",
    place: "Склад А · стеллаж 4",
    stock: 128,
    min: 40,
  },
  {
    sku: "VU-2210",
    name: "Лампа «Луч», тёплый свет",
    place: "Склад А · стеллаж 1",
    stock: 12,
    min: 20,
    incoming: 60,
  },
  {
    sku: "VU-3005",
    name: "Полка «Ступени», дуб",
    place: "Склад Б · зона выдачи",
    stock: 0,
    min: 10,
    incoming: 24,
  },
  {
    sku: "VU-1180",
    name: "Кресло «Пикник», серое",
    place: "Склад Б · стеллаж 7",
    stock: 34,
    min: 15,
  },
]

function stateOf(item: Solutions005Item) {
  if (item.stock === 0) return "out"
  if (item.stock < item.min) return "low"
  return "ok"
}

const STATE_LABEL: Record<string, string> = {
  ok: "в норме",
  low: "ниже порога",
  out: "закончился",
}

const DEFAULT_COLUMN_TEXT: Record<string, string> = {
  item: "Позиция",
  place: "Место",
  stock: "Остаток",
  state: "Состояние",
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
 * Остатки склада: состояние выводится из остатка и порога, а не из метки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions005({
  title = "Остатки на складе",
  hint = "Порог пополнения задан для каждой позиции",
  items = DEFAULT_ITEMS,
  order = "Заказать пополнение",
  columnText = DEFAULT_COLUMN_TEXT,
  stateText = STATE_LABEL,
  stockText = "{stock} шт.",
  minText = "мин. {min}",
  incomingText = " · едет {count}",
  accent,
  background = "",
  className,
  style,
}: Solutions005Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-005"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <button type="button" data-part="order">
            {order}
          </button>
        </header>

        <table>
          <thead>
            <tr>
              <th scope="col">{columnText.item ?? DEFAULT_COLUMN_TEXT.item}</th>
              <th scope="col">
                {columnText.place ?? DEFAULT_COLUMN_TEXT.place}
              </th>
              <th scope="col" data-align="end">
                {columnText.stock ?? DEFAULT_COLUMN_TEXT.stock}
              </th>
              <th scope="col">
                {columnText.state ?? DEFAULT_COLUMN_TEXT.state}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const state = stateOf(item)
              return (
                <tr key={item.sku} data-state={state}>
                  <td>
                    {item.name}
                    <span data-part="sku">{item.sku}</span>
                  </td>
                  <td>{item.place}</td>
                  <td data-align="end">
                    <span data-part="stock">
                      {stockText.replace("{stock}", String(item.stock))}
                    </span>
                    <span data-part="min">
                      {minText.replace("{min}", String(item.min))}
                    </span>
                  </td>
                  <td>
                    <span data-part="state">
                      <span data-part="dot" aria-hidden="true" />
                      {stateText[state] ?? STATE_LABEL[state]}
                    </span>
                    {item.incoming ? (
                      <span data-part="incoming">
                        {incomingText.replace("{count}", String(item.incoming))}
                      </span>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </>
  )
}
