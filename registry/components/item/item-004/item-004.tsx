import type { ComponentProps, CSSProperties } from "react"

export type Item004Props = Omit<ComponentProps<"a">, "children" | "title"> & {
  title?: string
  meta?: string
  hint?: string
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка, которая сама является ссылкой. В item-001 ссылка
// растянута псевдоэлементом внутри строки — здесь корень блока и есть тег a,
// поэтому цель не нужно эмулировать: её знает браузер, и она попадает в список
// ссылок страницы с полным текстом. Стрелка сдвигается на наведении и фокусе
// одинаково — состояние клавиатуры не должно выглядеть беднее мышиного.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку.
const STYLES = `
:where([data-vibeui-block="item-004"]){
--vibeui-item-004-bg:transparent;
--vibeui-item-004-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-item-004-muted:color-mix(in oklab,var(--vibeui-item-004-fg) 68%,transparent);
--vibeui-item-004-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-item-004-hover:color-mix(in oklab,var(--vibeui-item-004-fg) 6%,var(--vibeui-item-004-bg));
--vibeui-item-004-accent:light-dark(oklch(0.55 0.19 262),oklch(0.75 0.16 262));
--vibeui-item-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="item-004"]{color-scheme:dark}
[data-vibeui-block="item-004"]{
display:flex;align-items:center;gap:0.75rem;text-decoration:none;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.6875rem 0.875rem;
background:var(--vibeui-item-004-bg);
border:1px solid var(--vibeui-item-004-border);border-radius:0.75rem;
font-family:var(--vibeui-item-004-font);color:var(--vibeui-item-004-fg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="item-004"] *{box-sizing:border-box}
[data-vibeui-block="item-004"]:hover,
[data-vibeui-block="item-004"]:focus-visible{
background:var(--vibeui-item-004-hover);
border-color:color-mix(in oklab,var(--vibeui-item-004-accent) 35%,var(--vibeui-item-004-border));
}
[data-vibeui-block="item-004"]:focus-visible{outline:2px solid var(--vibeui-item-004-accent);outline-offset:2px}
[data-vibeui-block="item-004"] [data-part="text"]{flex:1 1 auto;min-width:0;display:grid;gap:0.125rem}
[data-vibeui-block="item-004"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="item-004"] [data-part="meta"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-004-muted)}
[data-vibeui-block="item-004"] [data-part="hint"]{
flex:none;font-size:0.6875rem;color:var(--vibeui-item-004-muted);font-variant-numeric:tabular-nums;
}
/* Стрелка едет одинаково на наведении и на фокусе: клавиатура не второй сорт. */
[data-vibeui-block="item-004"] [data-part="chevron"]{
flex:none;color:var(--vibeui-item-004-accent);font-size:0.875rem;line-height:1;
transition:transform .15s ease;
}
[data-vibeui-block="item-004"]:hover [data-part="chevron"],
[data-vibeui-block="item-004"]:focus-visible [data-part="chevron"]{transform:translateX(2px)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-004"] *{animation:none!important;transition:none!important}}
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
 * Строка-ссылка: корень блока сам является тегом a.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item004({
  title = "Настройки уведомлений",
  meta = "Почта, телеграм и еженедельная сводка",
  hint = "12",
  href = "#",
  background = "",
  accent,
  className,
  style,
  ...props
}: Item004Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-item-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-004" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        href={href}
        data-slot="item"
        data-vibeui-block="item-004"
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
        {hint ? <span data-part="hint">{hint}</span> : null}
        <span data-part="chevron" aria-hidden="true">
          →
        </span>
      </a>
    </>
  )
}
