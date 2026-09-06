import type { ComponentProps, CSSProperties } from "react"

export type Item011Props = Omit<ComponentProps<"li">, "children" | "title"> & {
  title?: string
  due?: string
  assignee?: string
  assigneeName?: string
  name?: string
  defaultChecked?: boolean
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка задачи, где чекбокс держит нативный input, а не
// React-состояние — компонент остаётся серверным и работает в обычной форме,
// как в item-007. Но галочка тут переключает не подсветку строки, а
// зачёркивание названия: выполненная задача читается сразу, без взгляда на
// сам чекбокс. Инициалы исполнителя не единственный носитель имени — полное
// имя лежит в aria-label плитки, а не только в её визуальных двух буквах.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку.
const STYLES = `
:where([data-vibeui-block="item-011"]){
--vibeui-item-011-bg:transparent;
--vibeui-item-011-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-item-011-muted:color-mix(in oklab,var(--vibeui-item-011-fg) 68%,transparent);
--vibeui-item-011-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-item-011-accent:light-dark(oklch(0.55 0.19 262),oklch(0.75 0.16 262));
--vibeui-item-011-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-item-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="item-011"]{color-scheme:dark}
[data-vibeui-block="item-011"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.625rem 0.75rem;
list-style:none;
background:var(--vibeui-item-011-bg);
border:1px solid var(--vibeui-item-011-border);border-radius:0.75rem;
font-family:var(--vibeui-item-011-font);color:var(--vibeui-item-011-fg);
}
[data-vibeui-block="item-011"] *{box-sizing:border-box}
[data-vibeui-block="item-011"] [data-part="control"]{
position:relative;display:flex;align-items:center;gap:0.625rem;cursor:pointer;
flex:1 1 auto;min-width:0;
}
/* Input прозрачен и растянут по своей метке, но остаётся в потоке фокуса. */
[data-vibeui-block="item-011"] input{position:absolute;inset:0;margin:0;opacity:0;cursor:pointer}
[data-vibeui-block="item-011"]:has(input:focus-visible){outline:2px solid var(--vibeui-item-011-accent);outline-offset:2px}
[data-vibeui-block="item-011"] [data-part="box"]{
flex:none;display:grid;place-items:center;
width:1.125rem;height:1.125rem;border-radius:0.375rem;
border:1.5px solid var(--vibeui-item-011-border);
color:transparent;font-size:0.6875rem;font-weight:800;line-height:1;
transition:background-color .15s ease,border-color .15s ease,color .15s ease;
}
[data-vibeui-block="item-011"]:has(input:checked) [data-part="box"]{
background:var(--vibeui-item-011-accent);border-color:var(--vibeui-item-011-accent);color:var(--vibeui-item-011-on-accent);
}
[data-vibeui-block="item-011"] [data-part="title"]{
font-size:0.875rem;font-weight:650;line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
transition:color .15s ease;
}
/* Зачёркивание — главный сигнал выполнения, а не только цвет чекбокса. */
[data-vibeui-block="item-011"]:has(input:checked) [data-part="title"]{
text-decoration:line-through;color:var(--vibeui-item-011-muted);
}
[data-vibeui-block="item-011"] [data-part="due"]{
flex:none;font-size:0.75rem;color:var(--vibeui-item-011-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="item-011"] [data-part="assignee"]{
flex:none;display:grid;place-items:center;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-item-011-accent) 16%,transparent);
color:var(--vibeui-item-011-accent);font-size:0.625rem;font-weight:700;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-011"] *{animation:none!important;transition:none!important}}
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
 * Строка задачи: чекбокс на нативном input, срок и исполнитель.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item011({
  title = "Согласовать смету на второй этап",
  due = "12 мар",
  assignee = "МК",
  assigneeName = "Мария Ковалёва",
  name = "task",
  defaultChecked = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Item011Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-item-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-011" precedence="medium">
        {STYLES}
      </style>
      <li
        {...props}
        data-slot="item"
        data-vibeui-block="item-011"
        className={className}
        style={palette}
      >
        <label data-part="control">
          <input type="checkbox" name={name} defaultChecked={defaultChecked} />
          <span data-part="box" aria-hidden="true">
            ✓
          </span>
          <span data-part="title">{title}</span>
        </label>
        <span data-part="due">{due}</span>
        <span
          data-part="assignee"
          aria-label={assigneeName}
          title={assigneeName}
        >
          {assignee}
        </span>
      </li>
    </>
  )
}
