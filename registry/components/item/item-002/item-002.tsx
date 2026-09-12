import type { ComponentProps, CSSProperties } from "react"

export type Item002Props = Omit<ComponentProps<"li">, "children" | "title"> & {
  title?: string
  meta?: string
  glyph?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  tint?: string
}

// Идея компонента: строка списка с ведущим знаком. Знак не украшение, а якорь
// для глаза: он всегда одного размера и всегда на одном месте, поэтому колонка
// названий начинается по одной вертикали независимо от длины текста. Оттенок
// плитки считается от одного числа, а фон и цвет знака выводятся из него через
// color-mix — рассогласовать пару невозможно.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку.
const STYLES = `
:where([data-vibeui-block="item-002"]){
--vibeui-item-002-bg:transparent;
--vibeui-item-002-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-item-002-muted:color-mix(in oklab,var(--vibeui-item-002-fg) 68%,transparent);
--vibeui-item-002-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-item-002-tint:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-item-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="item-002"]{color-scheme:dark}
[data-vibeui-block="item-002"]{
display:flex;align-items:center;gap:0.6875rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.625rem 0.75rem;
list-style:none;
background:var(--vibeui-item-002-bg);
border:1px solid var(--vibeui-item-002-border);border-radius:0.75rem;
font-family:var(--vibeui-item-002-font);color:var(--vibeui-item-002-fg);
}
[data-vibeui-block="item-002"] *{box-sizing:border-box}
/* Плитка знака: фиксированный квадрат, поэтому колонка названий не пляшет. */
[data-vibeui-block="item-002"] [data-part="glyph"]{
flex:none;display:grid;place-items:center;
width:2.25rem;height:2.25rem;border-radius:0.625rem;
background:color-mix(in oklab,var(--vibeui-item-002-tint) 14%,transparent);
color:var(--vibeui-item-002-tint);
font-size:0.9375rem;font-weight:700;line-height:1;
}
[data-vibeui-block="item-002"] [data-part="text"]{display:grid;gap:0.125rem;min-width:0}
[data-vibeui-block="item-002"] [data-part="title"]{
font-size:0.875rem;font-weight:650;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
/* Вторичная строка обрезается вторая: главное имя важнее подробностей. */
[data-vibeui-block="item-002"] [data-part="meta"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-002-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-002"] *{animation:none!important;transition:none!important}}
`

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
 * Строка списка с ведущим знаком и вторичным текстом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item002({
  title = "Проектная документация",
  meta = "14 файлов · обновлено вчера",
  glyph = "ПД",
  background = "",
  tint,
  className,
  style,
  ...props
}: Item002Props) {
  const palette = {
    ...(tint ? { "--vibeui-item-002-tint": tint } : null),
    ...(background
      ? {
          "--vibeui-item-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-002" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="item"
        data-vibeui-block="item-002"
        className={className}
        style={palette}
      >
        <span data-part="glyph" aria-hidden="true">
          {glyph}
        </span>
        <span data-part="text">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
      </li>
    </>
  )
}
