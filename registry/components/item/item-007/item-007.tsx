import type { ComponentProps, CSSProperties } from "react"

export type Item007Props = Omit<
  ComponentProps<"label">,
  "children" | "title"
> & {
  title?: string
  meta?: string
  name?: string
  defaultChecked?: boolean
  /** Пусто — подложки нет, строка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка выбора, где состояние держит нативный чекбокс, а не
// React-состояние. Поэтому компонент серверный, работает в обычной форме и
// отдаёт значение при отправке. Галочка нарисована CSS через :has(:checked),
// сам input не спрятан display:none — он прозрачен и растянут на строку, иначе
// пропадёт из последовательности фокуса. Выбранная строка меняет не только
// цвет, но и заливку с рамкой: одного оттенка мало при дальтонизме.
//
// Тема берётся из color-scheme окружения через light-dark(): строка темнеет
// там, где тёмный контекст, и не выкладывает под себя белую плашку.
const STYLES = `
:where([data-vibeui-block="item-007"]){
--vibeui-item-007-bg:transparent;
--vibeui-item-007-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-item-007-muted:color-mix(in oklab,var(--vibeui-item-007-fg) 68%,transparent);
--vibeui-item-007-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-item-007-accent:light-dark(oklch(0.55 0.19 262),oklch(0.75 0.16 262));
--vibeui-item-007-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-item-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="item-007"]{color-scheme:dark}
[data-vibeui-block="item-007"]{
position:relative;display:flex;align-items:center;gap:0.6875rem;cursor:pointer;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.625rem 0.75rem;
background:var(--vibeui-item-007-bg);
border:1px solid var(--vibeui-item-007-border);border-radius:0.75rem;
font-family:var(--vibeui-item-007-font);color:var(--vibeui-item-007-fg);
transition:background-color .15s ease,border-color .15s ease;
}
[data-vibeui-block="item-007"] *{box-sizing:border-box}
/* Input прозрачен и растянут, но остаётся в потоке фокуса: display:none убил бы клавиатуру. */
[data-vibeui-block="item-007"] input{
position:absolute;inset:0;margin:0;opacity:0;cursor:pointer;
}
[data-vibeui-block="item-007"]:has(input:focus-visible){outline:2px solid var(--vibeui-item-007-accent);outline-offset:2px}
[data-vibeui-block="item-007"]:has(input:checked){
background:color-mix(in oklab,var(--vibeui-item-007-accent) 7%,var(--vibeui-item-007-bg));
border-color:color-mix(in oklab,var(--vibeui-item-007-accent) 45%,var(--vibeui-item-007-border));
}
[data-vibeui-block="item-007"] [data-part="box"]{
flex:none;display:grid;place-items:center;
width:1.125rem;height:1.125rem;border-radius:0.375rem;
border:1.5px solid var(--vibeui-item-007-border);
color:transparent;font-size:0.6875rem;font-weight:800;line-height:1;
transition:background-color .15s ease,border-color .15s ease,color .15s ease;
}
[data-vibeui-block="item-007"]:has(input:checked) [data-part="box"]{
background:var(--vibeui-item-007-accent);border-color:var(--vibeui-item-007-accent);
color:var(--vibeui-item-007-on-accent);
}
[data-vibeui-block="item-007"] [data-part="text"]{display:grid;gap:0.125rem;min-width:0}
[data-vibeui-block="item-007"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="item-007"] [data-part="meta"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-item-007-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="item-007"] *{animation:none!important;transition:none!important}}
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
 * Строка выбора с галочкой на нативном чекбоксе, без клиентского состояния.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Item007({
  title = "Отдельный домен",
  meta = "Подключается за пять минут · 490 ₽ в месяц",
  name = "option",
  defaultChecked = true,
  background = "",
  accent,
  className,
  style,
  ...props
}: Item007Props) {
  const palette = {
    ...(accent ? { "--vibeui-item-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-item-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-item-007" precedence="medium">
        {STYLES}
      </style>
      <label
        {...props}
        data-slot="item"
        data-vibeui-block="item-007"
        className={className}
        style={palette}
      >
        <input type="checkbox" name={name} defaultChecked={defaultChecked} />
        <span data-part="box" aria-hidden="true">
          ✓
        </span>
        <span data-part="text">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </span>
      </label>
    </>
  )
}
