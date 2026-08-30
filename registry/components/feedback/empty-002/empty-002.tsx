import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Empty002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  query?: string
  suggestions?: string[]
  resetLabel?: string
  accent?: string
}

// Идея компонента: пустая выдача поиска. Она отличается от пустого раздела
// тем, что данные есть — их просто не нашлось по запросу. Поэтому здесь не
// «создайте первый проект», а сам запрос, причины и готовые ходы: убрать
// фильтры или попробовать соседний запрос.
const STYLES = `
:where([data-vibeui-block="empty-002"]){
--vibeui-empty-002-bg:oklch(1 0 0);
--vibeui-empty-002-fg:oklch(0.22 0.014 265);
--vibeui-empty-002-muted:oklch(0.56 0.014 265);
--vibeui-empty-002-border:oklch(0.9 0.006 265);
--vibeui-empty-002-accent:oklch(0.55 0.17 265);
--vibeui-empty-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="empty-002"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:1.25rem 1rem;
text-align:center;
background:var(--vibeui-empty-002-bg);
border:1px solid var(--vibeui-empty-002-border);border-radius:0.875rem;
font-family:var(--vibeui-empty-002-font);color:var(--vibeui-empty-002-fg);
}
/* Лупа с чертой: знак «искали, но не нашли», а не просто пустая коробка. */
[data-vibeui-block="empty-002"] [data-part="mark"]{
position:relative;width:2.25rem;height:2.25rem;margin-bottom:0.125rem;
}
[data-vibeui-block="empty-002"] [data-part="mark"]::before{
content:"";position:absolute;left:0.125rem;top:0.125rem;width:1.5rem;height:1.5rem;
border:2px solid var(--vibeui-empty-002-border);border-radius:9999px;
}
[data-vibeui-block="empty-002"] [data-part="mark"]::after{
content:"";position:absolute;right:0.1875rem;bottom:0.25rem;
width:0.75rem;height:2px;background:var(--vibeui-empty-002-border);
transform:rotate(45deg);border-radius:9999px;
}
[data-vibeui-block="empty-002"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="empty-002"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-empty-002-muted)}
[data-vibeui-block="empty-002"] [data-part="query"]{color:var(--vibeui-empty-002-fg);font-weight:650}
/* Готовые ходы вместо совета «попробуйте другой запрос». */
[data-vibeui-block="empty-002"] [data-part="chips"]{display:flex;flex-wrap:wrap;justify-content:center;gap:0.375rem;margin-top:0.125rem}
[data-vibeui-block="empty-002"] [data-part="chip"]{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.6875rem;
border:1px solid var(--vibeui-empty-002-border);border-radius:9999px;
background:transparent;color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="empty-002"] [data-part="chip"]:hover{background:oklch(0.97 0.003 265)}
[data-vibeui-block="empty-002"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-empty-002-accent);outline-offset:2px}
[data-vibeui-block="empty-002"] [data-part="reset"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;margin-top:0.25rem;
color:var(--vibeui-empty-002-accent);font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="empty-002"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-empty-002-accent);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SUGGESTIONS = ["кнопка", "карточка", "календарь"]

/**
 * Пустая выдача поиска: сам запрос, причина и готовые ходы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty002({
  title = "Ничего не нашлось",
  text = "ничего не нашлось. Возможно, мешают фильтры или в запросе опечатка.",
  query = "карточкa товара",
  suggestions = DEFAULT_SUGGESTIONS,
  resetLabel = "Сбросить фильтры",
  accent,
  className,
  style,
  ...props
}: Empty002Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="empty-002"
        role="status"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true" />
        <h3 data-part="title">{title}</h3>
        <p data-part="text">
          {query ? (
            <>
              По запросу <span data-part="query">«{query}»</span>{" "}
            </>
          ) : null}
          {text}
        </p>
        {suggestions.length ? (
          <div data-part="chips">
            {suggestions.map((item) => (
              <button key={item} type="button" data-part="chip">
                {item}
              </button>
            ))}
          </div>
        ) : null}
        <button type="button" data-part="reset">
          {resetLabel}
        </button>
      </div>
    </>
  )
}
