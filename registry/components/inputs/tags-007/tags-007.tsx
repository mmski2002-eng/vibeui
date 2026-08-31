import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Tags007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  tags?: string[]
  visible?: number
  accent?: string
}

// Идея компонента: список тегов только для чтения, где лишние честно сосчитаны.
// В карточке товара или задачи места на все метки нет, а обрезать список молча
// нельзя: пользователь решит, что тегов ровно столько. Поэтому видимые чипы
// показаны, а остальные свёрнуты в «+3», и скрытые перечислены в title и
// aria-label — их можно узнать наведением и услышать скринридером. Компонент
// серверный: раскрывать список некуда, это витрина, а не форма.
const STYLES = `
:where([data-vibeui-block="tags-007"]){
--vibeui-tags-007-surface:oklch(1 0 0);
--vibeui-tags-007-shell:oklch(0.9 0.006 265);
--vibeui-tags-007-fg:oklch(0.23 0.014 265);
--vibeui-tags-007-muted:oklch(0.55 0.014 265);
--vibeui-tags-007-border:oklch(0.88 0.008 265);
--vibeui-tags-007-chip:oklch(0.96 0.004 265);
--vibeui-tags-007-accent:oklch(0.5 0.15 265);
--vibeui-tags-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: список показывают поверх любого фона. */
[data-vibeui-block="tags-007"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-tags-007-surface);
border:1px solid var(--vibeui-tags-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-tags-007-font);color:var(--vibeui-tags-007-fg);
}
[data-vibeui-block="tags-007"] [data-part="label"]{
margin:0;font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-tags-007-muted);
}
/* Список семантический: это перечисление, а не набор кнопок. */
[data-vibeui-block="tags-007"] ul{
display:flex;flex-wrap:wrap;gap:0.375rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="tags-007"] li{
display:inline-flex;align-items:center;
height:1.75rem;padding:0 0.625rem;border-radius:0.4375rem;
background:var(--vibeui-tags-007-chip);
font-size:0.8125rem;
}
/* Счётчик скрытых: молча обрезанный список читается как полный. */
[data-vibeui-block="tags-007"] li[data-part="more"]{
background:none;border:1px dashed var(--vibeui-tags-007-border);
color:var(--vibeui-tags-007-accent);font-weight:700;cursor:help;
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tags-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TAGS = [
  "макбук",
  "16 дюймов",
  "2024",
  "гарантия",
  "с коробкой",
  "торг",
  "самовывоз",
]

/**
 * Список тегов только для чтения со счётчиком скрытых и их перечислением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags007({
  label = "Метки объявления",
  tags = DEFAULT_TAGS,
  visible = 4,
  accent,
  className,
  style,
  ...props
}: Tags007Props) {
  const shown = tags.slice(0, visible)
  const hidden = tags.slice(visible)

  const palette = {
    ...(accent ? { "--vibeui-tags-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="tags-007"
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <ul>
          {shown.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
          {hidden.length > 0 ? (
            <li
              data-part="more"
              title={hidden.join(", ")}
              aria-label={`Ещё ${hidden.length}: ${hidden.join(", ")}`}
            >
              +{hidden.length}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
