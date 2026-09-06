import { Fragment } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Scrollarea004Group = {
  title: string
  items: string[]
}

export type Scrollarea004Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  groups?: Scrollarea004Group[]
  height?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: заголовок раздела липнет к верху области, а не страницы.
// Sticky считает верх от ближайшего предка с прокруткой, поэтому область
// обязана быть этим предком, а сам заголовок — не иметь предка с overflow.
// Отсюда плоская разметка: секция не оборачивает список в лишний контейнер.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у самой
// области нет, но у липкого заголовка она обязана быть непрозрачной.
const STYLES = `
:where([data-vibeui-block="scrollarea-004"]){
--vibeui-scrollarea-004-bg:transparent;
--vibeui-scrollarea-004-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-scrollarea-004-muted:color-mix(in oklab,var(--vibeui-scrollarea-004-fg) 68%,transparent);
--vibeui-scrollarea-004-border:light-dark(oklch(0.9 0 265),oklch(0.33 0 265));
--vibeui-scrollarea-004-sticky:light-dark(oklch(0.965 0 265),oklch(0.25 0 265));
--vibeui-scrollarea-004-rule:light-dark(oklch(0.95 0 265),oklch(0.29 0 265));
--vibeui-scrollarea-004-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-scrollarea-004-height:14rem;
--vibeui-scrollarea-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollarea-004"]{color-scheme:dark}
[data-vibeui-block="scrollarea-004"]{
display:flex;flex-direction:column;
width:100%;max-width:20rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-scrollarea-004-bg);
border:1px solid var(--vibeui-scrollarea-004-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollarea-004-font);color:var(--vibeui-scrollarea-004-fg);
}
[data-vibeui-block="scrollarea-004"] [data-part="bar"]{
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-scrollarea-004-border);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="scrollarea-004"] [data-part="area"]{
height:var(--vibeui-scrollarea-004-height);
overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;
}
[data-vibeui-block="scrollarea-004"] [data-part="area"]:focus-visible{
outline:2px solid var(--vibeui-scrollarea-004-accent);outline-offset:-2px;
}
[data-vibeui-block="scrollarea-004"] dl{margin:0}
/* Липкий заголовок раздела: верх считается от области, а не от страницы. */
[data-vibeui-block="scrollarea-004"] dt{
position:sticky;top:0;z-index:1;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.375rem 0.875rem;
background:var(--vibeui-scrollarea-004-sticky);
border-bottom:1px solid var(--vibeui-scrollarea-004-border);
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-scrollarea-004-muted);
}
[data-vibeui-block="scrollarea-004"] dd{
margin:0;display:flex;align-items:center;
min-height:2.125rem;padding:0 0.875rem;font-size:0.8125rem;
}
[data-vibeui-block="scrollarea-004"] dd + dd{border-top:1px solid var(--vibeui-scrollarea-004-rule)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollarea-004"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_GROUPS: Scrollarea004Group[] = [
  { title: "Сегодня", items: ["Анна Реброва", "Игорь Ким", "Мария Пак"] },
  {
    title: "Вчера",
    items: ["Дмитрий Гнатюк", "Лиза Орлова", "Пётр Савин", "Тимур Хан"],
  },
  {
    title: "На прошлой неделе",
    items: ["Ольга Дюжева", "Сергей Мун", "Юлия Ким", "Артём Волошин"],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Область прокрутки, где заголовок раздела липнет к её верху.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea004({
  title = "Контакты",
  groups = DEFAULT_GROUPS,
  height = "14rem",
  background = "",
  className,
  style,
  ...props
}: Scrollarea004Props) {
  const palette = {
    "--vibeui-scrollarea-004-height": height,
    ...(background
      ? {
          "--vibeui-scrollarea-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scroll-area"
        data-vibeui-block="scrollarea-004"
        className={className}
        style={palette}
      >
        <div data-part="bar">{title}</div>
        <div data-part="area" tabIndex={0} role="region" aria-label={title}>
          <dl>
            {groups.map((group) => (
              <Fragment key={group.title}>
                <dt>
                  <span>{group.title}</span>
                  <span>{group.items.length}</span>
                </dt>
                {group.items.map((item) => (
                  <dd key={item}>{item}</dd>
                ))}
              </Fragment>
            ))}
          </dl>
        </div>
      </div>
    </>
  )
}
