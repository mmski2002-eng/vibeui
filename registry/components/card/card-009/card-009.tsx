import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card009Row = {
  label: string
  value: string
}

export type Card009Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  title?: string
  summary?: string
  rows?: Card009Row[]
  moreLabel?: string
  defaultOpen?: boolean
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карточка с подробностями, которые раскрываются на месте.
// Внутри нативный details: раскрытие без клиентского кода, с клавиатуры и с
// правильной ролью. Главное — сумма и статус — остаётся видимым всегда, а
// под кат уходит только то, что нужно не каждому.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="card-009"]){
--vibeui-card-009-bg:transparent;
--vibeui-card-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-card-009-muted:light-dark(oklch(0.56 0.014 265),oklch(0.72 0.012 265));
--vibeui-card-009-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-card-009-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-card-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-009"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-card-009-bg);
border:1px solid var(--vibeui-card-009-border);border-radius:0.875rem;
color:var(--vibeui-card-009-fg);font-family:var(--vibeui-card-009-font);
}
[data-vibeui-block="card-009"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="card-009"] [data-part="summary"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-card-009-muted)}
/* Раскрытие на нативном details: клавиатура и роль достаются даром. */
[data-vibeui-block="card-009"] summary{
list-style:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.8125rem;font-weight:600;color:var(--vibeui-card-009-accent);
}
[data-vibeui-block="card-009"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="card-009"] summary:focus-visible{outline:2px solid var(--vibeui-card-009-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="card-009"] [data-part="chevron"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
transition:transform .16s ease;
}
[data-vibeui-block="card-009"] details[open] [data-part="chevron"]{transform:rotate(-135deg) translate(-0.0625rem,-0.0625rem)}
[data-vibeui-block="card-009"] dl{
display:grid;grid-template-columns:auto 1fr;gap:0.375rem 0.75rem;
margin:0.625rem 0 0;font-size:0.8125rem;
}
/* display:contents у обёртки строки: пара «подпись — значение» остаётся
   парой в разметке, но раскладывается сеткой словаря. */
[data-vibeui-block="card-009"] [data-part="row"]{display:contents}
[data-vibeui-block="card-009"] dt{color:var(--vibeui-card-009-muted)}
[data-vibeui-block="card-009"] dd{margin:0;text-align:right;font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Card009Row[] = [
  { label: "Номер заказа", value: "№ 42-118" },
  { label: "Оплата", value: "Карта •••• 6411" },
  { label: "Доставка", value: "18 марта, курьер" },
  { label: "Сумма", value: "12 480 ₽" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Карточка с подробностями на нативном details: главное видно всегда.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card009({
  title = "Заказ отправлен",
  summary = "Курьер приедет 18 марта с 10:00 до 14:00, оплата уже прошла.",
  rows = DEFAULT_ROWS,
  moreLabel = "Подробности заказа",
  defaultOpen = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card009Props) {
  const id = useId()

  const palette = {
    ...(accent ? { "--vibeui-card-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-009" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-009"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <p data-part="summary">{summary}</p>
        <details name={`${id}-card`} open={defaultOpen}>
          <summary>
            {moreLabel}
            <span data-part="chevron" aria-hidden="true" />
          </summary>
          <dl>
            {rows.map((row) => (
              <div key={row.label} data-part="row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      </article>
    </>
  )
}
