import type { ComponentProps, CSSProperties } from "react"

export type Tags007Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  label?: string
  tags?: string[]
  visible?: number
  /** Подпись счётчика: {count} — число скрытых, {tags} — их перечисление. */
  moreText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: список тегов только для чтения, где лишние честно сосчитаны.
// В карточке товара или задачи места на все метки нет, а обрезать список молча
// нельзя: пользователь решит, что тегов ровно столько. Поэтому видимые чипы
// показаны, а остальные свёрнуты в «+3», и скрытые перечислены в title и
// aria-label — их можно узнать наведением и услышать скринридером. Компонент
// серверный: раскрывать список некуда, это витрина, а не форма.
//
// Тема берётся из color-scheme окружения через light-dark(): список темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="tags-007"]){
--vibeui-tags-007-surface:transparent;
--vibeui-tags-007-shell:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-tags-007-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-tags-007-muted:color-mix(in oklab,var(--vibeui-tags-007-fg) 68%,transparent);
--vibeui-tags-007-border:light-dark(oklch(0.88 0 265),oklch(0.38 0 265));
--vibeui-tags-007-chip:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-tags-007-accent:light-dark(oklch(0.275 0 0),oklch(0.91 0 0));
--vibeui-tags-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tags-007"]{color-scheme:dark}
/* Подложка по умолчанию прозрачная: список ложится на фон страницы. */
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
 * Список тегов только для чтения со счётчиком скрытых и их перечислением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tags007({
  label = "Метки объявления",
  tags = DEFAULT_TAGS,
  visible = 4,
  moreText = "Ещё {count}: {tags}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Tags007Props) {
  const shown = tags.slice(0, visible)
  const hidden = tags.slice(visible)

  const palette = {
    ...(accent ? { "--vibeui-tags-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tags-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tags-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tags-input"
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
              aria-label={moreText
                .replace("{count}", String(hidden.length))
                .replace("{tags}", hidden.join(", "))}
            >
              +{hidden.length}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
