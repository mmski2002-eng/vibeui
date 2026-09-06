import type { ComponentProps, CSSProperties } from "react"

export type Item012Props = Omit<ComponentProps<"li">, "children" | "title"> & {
  title?: string
  meta?: string
  time?: string
  unread?: boolean
  /** Скрытая подпись непрочитанного: компонент несёт русскую. */
  unreadText?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка уведомления, где непрочитанное состояние держится
// на трёх независимых сигналах — точка слева, полужирное название и лёгкая
// заливка строки, — а не на одном цвете. Точка помечена aria-hidden, потому
// что дублирует смысл: настоящий сигнал для скринридера — скрытый текст
// «Непрочитано» перед названием, который существует только в непрочитанном
// состоянии, а не превращается в пустой узел в прочитанном.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку.
const STYLES = `
:where([data-vibeui-block="item-012"]){
--vibeui-item-012-bg:transparent;
--vibeui-item-012-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-item-012-muted:color-mix(in oklab,var(--vibeui-item-012-fg) 68%,transparent);
--vibeui-item-012-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-item-012-accent:light-dark(oklch(0.58 0.18 258),oklch(0.75 0.16 258));
--vibeui-item-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="item-012"]{color-scheme:dark}
[data-vibeui-block="item-012"]{
display:flex;align-items:flex-start;gap:0.625rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.625rem 0.75rem;
list-style:none;
background:var(--vibeui-item-012-bg);
border:1px solid var(--vibeui-item-012-border);border-radius:0.75rem;
font-family:var(--vibeui-item-012-font);color:var(--vibeui-item-012-fg);
}
[data-vibeui-block="item-012"] *{box-sizing:border-box}
[data-vibeui-block="item-012"][data-unread]{
background:color-mix(in oklab,var(--vibeui-item-012-accent) 5%,var(--vibeui-item-012-bg));
}
[data-vibeui-block="item-012"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;margin-top:0.375rem;border-radius:9999px;
background:var(--vibeui-item-012-accent);visibility:hidden;
}
[data-vibeui-block="item-012"][data-unread] [data-part="dot"]{visibility:visible}
[data-vibeui-block="item-012"] [data-part="text"]{flex:1 1 auto;min-width:0;display:grid;gap:0.1875rem}
[data-vibeui-block="item-012"] [data-part="title"]{
font-size:0.875rem;font-weight:500;line-height:1.35;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="item-012"][data-unread] [data-part="title"]{font-weight:700}
[data-vibeui-block="item-012"] [data-part="meta"]{
font-size:0.75rem;line-height:1.4;color:var(--vibeui-item-012-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="item-012"] [data-part="time"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-item-012-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="item-012"] [data-part="sr"]{
position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
clip:rect(0,0,0,0);white-space:nowrap;border:0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-012"] *{animation:none!important;transition:none!important}}
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
 * Строка уведомления с непрочитанной меткой и временем: точка, вес шрифта
 * и заливка строки — три сигнала, а не один. Один файл, ноль зависимостей.
 */
export function Item012({
  title = "Игорь оставил комментарий к смете",
  meta = "«Проверьте цифры по разделу три»",
  time = "14:32",
  unread = true,
  unreadText = "Непрочитано.",
  background = "",
  accent,
  className,
  style,
  ...props
}: Item012Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-item-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-012" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="item"
        data-vibeui-block="item-012"
        data-unread={unread || undefined}
        className={className}
        style={palette}
      >
        <span data-part="dot" aria-hidden="true" />
        <span data-part="text">
          {unread ? <span data-part="sr">{`${unreadText} `}</span> : null}
          <span data-part="title">{title}</span>
          <span data-part="meta">{meta}</span>
        </span>
        <span data-part="time">{time}</span>
      </li>
    </>
  )
}
