import type { ComponentProps, CSSProperties } from "react"

export type Card015Item = {
  text: string
  done?: boolean
}

export type Card015Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  title?: string
  /** Пункты чек-листа. Порядок сохраняется: это план, а не множество. */
  items?: Card015Item[]
  /** false прячет выполненные пункты и оставляет только то, что впереди. */
  showDone?: boolean
  /** Подпись под чек-листом: срок, исполнитель, ветка. */
  meta?: string
  /** Счётчик в шапке: {done} — выполнено, {total} — всего. */
  countTemplate?: string
  /** Подпись прогресса для скринридера: {done} и {total}. */
  progressTemplate?: string
  /** Что скринридер добавляет к пункту: ключи done и todo. */
  statusText?: Record<string, string>
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карточка задачи, где виден сам чек-лист, а не только
// полоса прогресса. Прогресс собран из сегментов — по одному на пункт,
// поэтому «7 из 12» читается и глазами. Галочка нарисована двумя линиями
// SVG: иконочный шрифт ради одного знака ставить незачем.
const STYLES = `
:where([data-vibeui-block="card-015"]){
--vibeui-card-015-bg:transparent;
--vibeui-card-015-surface:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-card-015-tick:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-card-015-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-015-muted:color-mix(in oklab,var(--vibeui-card-015-fg) 68%,transparent);
--vibeui-card-015-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-015-track:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-card-015-accent:light-dark(oklch(0.56 0.15 39.8),oklch(0.74 0.14 39.8));
--vibeui-card-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-015"]{color-scheme:dark}
[data-vibeui-block="card-015"]{
display:flex;flex-direction:column;gap:0.6875rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.9375rem 1rem 1rem;
background:var(--vibeui-card-015-bg);color:var(--vibeui-card-015-fg);
border:1px solid var(--vibeui-card-015-border);border-radius:0.875rem;
font-family:var(--vibeui-card-015-font);
}
[data-vibeui-block="card-015"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.625rem;
}
[data-vibeui-block="card-015"] [data-part="title"]{
margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="card-015"] [data-part="count"]{
flex:none;font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
color:var(--vibeui-card-015-muted);
}
/* Прогресс сегментами, а не сплошной полосой: сегмент = пункт, поэтому
   «сколько осталось» видно без чтения подписи. */
[data-vibeui-block="card-015"] [data-part="meter"]{
display:flex;gap:0.1875rem;
}
[data-vibeui-block="card-015"] [data-part="seg"]{
flex:1;height:0.3125rem;border-radius:9999px;background:var(--vibeui-card-015-track);
}
[data-vibeui-block="card-015"] [data-part="seg"][data-filled="true"]{background:var(--vibeui-card-015-accent)}
[data-vibeui-block="card-015"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="card-015"] [data-part="row"]{
position:relative;display:flex;align-items:flex-start;gap:0.5rem;
font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="card-015"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="card-015"] [data-part="box"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1rem;height:1rem;margin-top:0.0625rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-card-015-border);background:var(--vibeui-card-015-surface);
color:var(--vibeui-card-015-tick);
}
[data-vibeui-block="card-015"] [data-part="row"][data-done="true"] [data-part="box"]{
border-color:var(--vibeui-card-015-accent);background:var(--vibeui-card-015-accent);
}
[data-vibeui-block="card-015"] [data-part="tick"]{width:0.625rem;height:0.625rem}
[data-vibeui-block="card-015"] [data-part="row"][data-done="false"] [data-part="tick"]{visibility:hidden}
/* Выполненное приглушено, но не вычеркнуто в ноль: список остаётся историей. */
[data-vibeui-block="card-015"] [data-part="row"][data-done="true"] [data-part="text"]{
color:var(--vibeui-card-015-muted);text-decoration:line-through;
text-decoration-color:color-mix(in oklab,var(--vibeui-card-015-muted) 45%,transparent);
}
[data-vibeui-block="card-015"] [data-part="meta"]{
margin:0;padding-top:0.5rem;border-top:1px solid var(--vibeui-card-015-border);
font-size:0.75rem;color:var(--vibeui-card-015-muted);
}
`

const DEFAULT_ITEMS: Card015Item[] = [
  { text: "Собрать список компонентов", done: true },
  { text: "Написать metadata и перевод", done: true },
  { text: "Проверить превью на мобильной ширине", done: true },
  { text: "Прогнать meta:validate и lint" },
  { text: "Выложить на витрину" },
]

const STATUS_TEXT: Record<string, string> = {
  done: " — выполнено",
  todo: " — не выполнено",
}

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
 * Карточка задачи с видимым чек-листом и сегментным прогрессом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card015({
  title = "Волна карточек в каталог",
  items = DEFAULT_ITEMS,
  showDone = true,
  meta = "Срок: до пятницы · Марк Ильин",
  countTemplate = "{done} из {total}",
  progressTemplate = "Выполнено {done} из {total} пунктов",
  statusText = STATUS_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Card015Props) {
  const done = items.filter((item) => item.done).length
  const visible = showDone ? items : items.filter((item) => !item.done)
  const fill = (template: string) =>
    template
      .replace("{done}", String(done))
      .replace("{total}", String(items.length))

  const palette = {
    ...(accent ? { "--vibeui-card-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-015-bg": background,
          "--vibeui-card-015-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-015" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-015"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <span data-part="count">{fill(countTemplate)}</span>
        </div>
        <div
          data-part="meter"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-label={fill(progressTemplate)}
        >
          {items.map((item, index) => (
            <span
              key={item.text}
              data-part="seg"
              data-filled={index < done}
              aria-hidden="true"
            />
          ))}
        </div>
        <ul data-part="list">
          {visible.map((item) => (
            <li key={item.text} data-part="row" data-done={Boolean(item.done)}>
              <span data-part="box" aria-hidden="true">
                <svg data-part="tick" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.3 4.8 8.6 9.5 3.6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span data-part="text">
                {item.text}
                <span data-part="sr">
                  {item.done
                    ? (statusText.done ?? STATUS_TEXT.done)
                    : (statusText.todo ?? STATUS_TEXT.todo)}
                </span>
              </span>
            </li>
          ))}
        </ul>
        {meta ? <p data-part="meta">{meta}</p> : null}
      </article>
    </>
  )
}
