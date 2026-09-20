import type { ComponentProps, CSSProperties } from "react"

export type Item001Props = Omit<ComponentProps<"li">, "children" | "title"> & {
  title?: string
  meta?: string
  value?: string
  status?: string
  href?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка списка с ссылкой на всю площадь. Ссылка растянута
// псевдоэлементом, но текст остаётся выделяемым, а обводка фокуса ставится на
// строку целиком: подсвеченное только название выглядит поломкой. Значение
// стоит справа табличными цифрами — по нему сравнивают строки.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку.
const STYLES = `
:where([data-vibeui-block="item-001"]){
--vibeui-item-001-bg:transparent;
--vibeui-item-001-fg:light-dark(oklch(0.22 0 265),oklch(0.93 0 265));
--vibeui-item-001-muted:color-mix(in oklab,var(--vibeui-item-001-fg) 68%,transparent);
--vibeui-item-001-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-item-001-hover:color-mix(in oklab,var(--vibeui-item-001-fg) 6%,var(--vibeui-item-001-bg));
--vibeui-item-001-accent:light-dark(oklch(0.287 0 0),oklch(0.901 0 0));
--vibeui-item-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="item-001"]{color-scheme:dark}
[data-vibeui-block="item-001"]{
position:relative;display:grid;grid-template-columns:1fr auto;
align-items:center;gap:0.125rem 0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.625rem 0.75rem;
list-style:none;
background:var(--vibeui-item-001-bg);
border:1px solid var(--vibeui-item-001-border);border-radius:0.75rem;
font-family:var(--vibeui-item-001-font);color:var(--vibeui-item-001-fg);
}
[data-vibeui-block="item-001"]:hover{background:var(--vibeui-item-001-hover)}
[data-vibeui-block="item-001"] a{color:inherit;text-decoration:none}
/* Ссылка на всю строку, но обводка фокуса — на строке, а не на названии. */
[data-vibeui-block="item-001"] a::after{content:"";position:absolute;inset:0;border-radius:inherit}
[data-vibeui-block="item-001"] a:focus-visible{outline:none}
[data-vibeui-block="item-001"]:has(a:focus-visible){outline:2px solid var(--vibeui-item-001-accent);outline-offset:2px}
[data-vibeui-block="item-001"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="item-001"] [data-part="meta"]{grid-column:1;font-size:0.75rem;color:var(--vibeui-item-001-muted)}
[data-vibeui-block="item-001"] [data-part="value"]{
grid-column:2;grid-row:1;justify-self:end;
font-size:0.875rem;font-weight:680;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="item-001"] [data-part="status"]{
grid-column:2;grid-row:2;justify-self:end;
font-size:0.6875rem;color:var(--vibeui-item-001-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-001"] *{animation:none!important;transition:none!important}}
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
 * Строка списка: ссылка на всю площадь, значение справа табличными цифрами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item001({
  title = "Счёт № 300 · ООО «Полёт»",
  meta = "Выставлен 12 марта, оплата до 20 марта",
  value = "24 000 ₽",
  status = "Ожидает оплаты",
  href = "#",
  background = "",
  accent,
  className,
  style,
  ...props
}: Item001Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-item-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-001" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="item"
        data-vibeui-block="item-001"
        className={className}
        style={palette}
      >
        <span data-part="title">
          {href ? <a href={href}>{title}</a> : title}
        </span>
        {value ? <span data-part="value">{value}</span> : null}
        {meta ? <span data-part="meta">{meta}</span> : null}
        {status ? <span data-part="status">{status}</span> : null}
      </li>
    </>
  )
}
