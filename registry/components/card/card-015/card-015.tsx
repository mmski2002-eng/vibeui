import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card015Item = {
  text: string
  done?: boolean
}

export type Card015Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  title?: string
  /** Пункты чек-листа. Порядок сохраняется: это план, а не множество. */
  items?: Card015Item[]
  /** false прячет выполненные пункты и оставляет только то, что впереди. */
  showDone?: boolean
  /** Подпись под чек-листом: срок, исполнитель, ветка. */
  meta?: string
  accent?: string
}

// Идея компонента: карточка задачи, где виден сам чек-лист, а не только
// полоса прогресса. Прогресс собран из сегментов — по одному на пункт,
// поэтому «7 из 12» читается и глазами. Галочка нарисована двумя линиями
// SVG: иконочный шрифт ради одного знака ставить незачем.
const STYLES = `
:where([data-vibeui-block="card-015"]){
--vibeui-card-015-bg:oklch(1 0 0);
--vibeui-card-015-fg:oklch(0.22 0.015 265);
--vibeui-card-015-muted:oklch(0.56 0.013 265);
--vibeui-card-015-border:oklch(0.91 0.006 265);
--vibeui-card-015-track:oklch(0.93 0.005 265);
--vibeui-card-015-accent:oklch(0.56 0.15 152);
--vibeui-card-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
border:1.5px solid var(--vibeui-card-015-border);background:oklch(1 0 0);
color:oklch(1 0 0);
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

/**
 * Карточка задачи с видимым чек-листом и сегментным прогрессом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card015({
  title = "Волна карточек в каталог",
  items = DEFAULT_ITEMS,
  showDone = true,
  meta = "Срок: до пятницы · Марк Ильин",
  accent,
  className,
  style,
  ...props
}: Card015Props) {
  const done = items.filter((item) => item.done).length
  const visible = showDone ? items : items.filter((item) => !item.done)

  const palette = {
    ...(accent ? { "--vibeui-card-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-015" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-015"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <span data-part="count">
            {done} из {items.length}
          </span>
        </div>
        <div
          data-part="meter"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={items.length}
          aria-label={`Выполнено ${done} из ${items.length} пунктов`}
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
                  {item.done ? " — выполнено" : " — не выполнено"}
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
