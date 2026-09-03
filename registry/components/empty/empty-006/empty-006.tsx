import type { ComponentProps, CSSProperties } from "react"

export type Empty006Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  filters?: string[]
  total?: number
  title?: string
  /** Объяснение под заголовком. `{total}` — число записей без фильтров. */
  text?: string
  /** Локаль для разрядки числа записей. */
  locale?: string
  resetLabel?: string
  onReset?: () => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список опустел не сам по себе, а из-за фильтров. Поэтому
// на экране перечислено, что сейчас включено, и сказано, сколько записей
// вернётся после сброса. Действие ровно одно — снять фильтры: предлагать
// заодно «создать запись» здесь вредно, данные ведь есть.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-006"]){
--vibeui-empty-006-bg:transparent;
--vibeui-empty-006-fg:light-dark(oklch(0.21 0.014 265),oklch(0.95 0.005 265));
--vibeui-empty-006-muted:color-mix(in oklab,var(--vibeui-empty-006-fg) 68%,transparent);
--vibeui-empty-006-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-empty-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-empty-006-accent-fg:light-dark(oklch(0.99 0.01 265),oklch(0.18 0.03 265));
--vibeui-empty-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-006"]{color-scheme:dark}
[data-vibeui-block="empty-006"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.5rem 1.25rem;
text-align:center;
background:var(--vibeui-empty-006-bg);
border:1px solid var(--vibeui-empty-006-border);border-radius:1rem;
font-family:var(--vibeui-empty-006-font);color:var(--vibeui-empty-006-fg);
}
/* Воронка: два прямоугольника сходятся в носик — знак «отфильтровано». */
[data-vibeui-block="empty-006"] [data-part="mark"]{
position:relative;width:2.25rem;height:2.25rem;color:var(--vibeui-empty-006-accent);
}
[data-vibeui-block="empty-006"] [data-part="mark"]::before{
content:"";position:absolute;left:0.125rem;top:0.375rem;width:2rem;height:0.875rem;
border:2px solid currentColor;border-bottom:0;
clip-path:polygon(0 0,100% 0,64% 100%,36% 100%);opacity:.55;
}
[data-vibeui-block="empty-006"] [data-part="mark"]::after{
content:"";position:absolute;left:50%;top:1.25rem;width:0.375rem;height:0.75rem;
margin-left:-0.1875rem;border-radius:0 0 0.125rem 0.125rem;background:currentColor;
}
[data-vibeui-block="empty-006"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-006"] [data-part="text"]{
margin:0;max-width:32ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-006-muted);
}
/* Условия перечислены поимённо: иначе непонятно, что именно сбрасывать. */
[data-vibeui-block="empty-006"] [data-part="chips"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.375rem;margin:0.125rem 0 0;padding:0;list-style:none;
}
[data-vibeui-block="empty-006"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-empty-006-accent) 10%,transparent);
color:var(--vibeui-empty-006-fg);font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="empty-006"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-empty-006-accent);
}
[data-vibeui-block="empty-006"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.375rem 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-006-accent);color:var(--vibeui-empty-006-accent-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-006"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-006-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILTERS = ["Статус: черновик", "Автор: я", "За последние 7 дней"]

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
 * Пустой список после фильтров: видно условия и сколько вернётся после сброса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty006({
  filters = DEFAULT_FILTERS,
  total = 248,
  title = "Под фильтры ничего не подошло",
  text = "Записи есть — их скрывают условия ниже. Без них в списке {total} записей.",
  locale = "ru-RU",
  resetLabel = "Сбросить фильтры",
  onReset,
  background = "",
  accent,
  className,
  style,
  ...props
}: Empty006Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="empty"
        data-vibeui-block="empty-006"
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="text">
          {text.replace("{total}", total.toLocaleString(locale))}
        </p>
        <ul data-part="chips">
          {filters.map((filter) => (
            <li key={filter} data-part="chip">
              <span data-part="dot" aria-hidden="true" />
              {filter}
            </li>
          ))}
        </ul>
        <button type="button" data-part="action" onClick={onReset}>
          {resetLabel}
          {filters.length ? ` · ${filters.length}` : ""}
        </button>
      </div>
    </>
  )
}
