import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  filters?: string[]
  total?: number
  title?: string
  resetLabel?: string
  onReset?: () => void
  accent?: string
}

// Идея компонента: список опустел не сам по себе, а из-за фильтров. Поэтому
// на экране перечислено, что сейчас включено, и сказано, сколько записей
// вернётся после сброса. Действие ровно одно — снять фильтры: предлагать
// заодно «создать запись» здесь вредно, данные ведь есть.
const STYLES = `
:where([data-vibeui-block="empty-006"]){
--vibeui-empty-006-bg:oklch(1 0 0);
--vibeui-empty-006-fg:oklch(0.21 0.014 265);
--vibeui-empty-006-muted:oklch(0.55 0.014 265);
--vibeui-empty-006-border:oklch(0.91 0.006 265);
--vibeui-empty-006-accent:oklch(0.55 0.17 265);
--vibeui-empty-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
height:2.5rem;padding:0 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-006-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-006"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-006-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILTERS = ["Статус: черновик", "Автор: я", "За последние 7 дней"]

/**
 * Пустой список после фильтров: видно условия и сколько вернётся после сброса.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty006({
  filters = DEFAULT_FILTERS,
  total = 248,
  title = "Под фильтры ничего не подошло",
  resetLabel = "Сбросить фильтры",
  onReset,
  accent,
  className,
  style,
  ...props
}: Empty006Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-006"
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="text">
          Записи есть — их скрывают условия ниже. Без них в списке{" "}
          {total.toLocaleString("ru-RU")} записей.
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
