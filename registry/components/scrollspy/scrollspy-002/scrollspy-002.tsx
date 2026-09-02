"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Scrollspy002Section = {
  id: string
  title: string
  text?: string
}

export type Scrollspy002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  sections?: Scrollspy002Section[]
  title?: string
  /** Подпись области чтения для скринридера. */
  bodyLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: оглавление статьи лежит не сбоку, а сверху — так оно
// работает и на телефоне, где боковой колонки просто нет. Пункты
// пронумерованы, у активного номер заливается: в горизонтальном ряду
// подсветка цветом текста теряется, а залитый кружок виден издалека.
// Слежение — IntersectionObserver: обработчик scroll на каждый пиксель
// заставил бы браузер считать раскладку в самый неподходящий момент.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="scrollspy-002"]){
--vibeui-scrollspy-002-bg:transparent;
--vibeui-scrollspy-002-fg:light-dark(oklch(0.23 0.014 265),oklch(0.93 0.006 265));
--vibeui-scrollspy-002-muted:light-dark(oklch(0.56 0.014 265),oklch(0.69 0.012 265));
--vibeui-scrollspy-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-scrollspy-002-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-scrollspy-002-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.02 265));
--vibeui-scrollspy-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="scrollspy-002"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:28rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-scrollspy-002-bg);
border:1px solid var(--vibeui-scrollspy-002-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollspy-002-font);color:var(--vibeui-scrollspy-002-fg);
}
[data-vibeui-block="scrollspy-002"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem}
[data-vibeui-block="scrollspy-002"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="scrollspy-002"] [data-part="counter"]{font-size:0.75rem;color:var(--vibeui-scrollspy-002-muted);font-variant-numeric:tabular-nums}
/* Оглавление в строку: на телефоне боковой колонки нет, а список нужен. */
[data-vibeui-block="scrollspy-002"] [data-part="toc"]{
display:flex;gap:0.375rem;margin:0;padding:0 0 0.25rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin;
}
[data-vibeui-block="scrollspy-002"] [data-part="link"]{
display:inline-flex;align-items:center;gap:0.375rem;flex:none;
padding:0.3125rem 0.5rem 0.3125rem 0.3125rem;border-radius:9999px;
border:1px solid var(--vibeui-scrollspy-002-border);
color:var(--vibeui-scrollspy-002-muted);text-decoration:none;
font-size:0.75rem;line-height:1;white-space:nowrap;
transition:color .16s ease,border-color .16s ease;
}
[data-vibeui-block="scrollspy-002"] [data-part="num"]{
display:flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-scrollspy-002-muted) 14%,transparent);
font-size:0.625rem;font-weight:700;font-variant-numeric:tabular-nums;
}
/* Активный пункт — залитый номер: в ряду одинаковых чипов цвета текста мало. */
[data-vibeui-block="scrollspy-002"] [data-part="link"][aria-current="true"]{
color:var(--vibeui-scrollspy-002-fg);border-color:var(--vibeui-scrollspy-002-accent);
font-weight:600;
}
[data-vibeui-block="scrollspy-002"] [data-part="link"][aria-current="true"] [data-part="num"]{
background:var(--vibeui-scrollspy-002-accent);color:var(--vibeui-scrollspy-002-on-accent);
}
[data-vibeui-block="scrollspy-002"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-002-accent);outline-offset:2px}
[data-vibeui-block="scrollspy-002"] [data-part="body"]{
height:12rem;overflow-y:auto;overscroll-behavior:contain;scroll-behavior:smooth;
padding-right:0.375rem;border-top:1px solid var(--vibeui-scrollspy-002-border);
}
[data-vibeui-block="scrollspy-002"] [data-part="body"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-002-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="scrollspy-002"] [data-part="section"]{scroll-margin-top:0.75rem;padding-top:0.75rem}
[data-vibeui-block="scrollspy-002"] [data-part="section"] h4{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="scrollspy-002"] [data-part="section"] p{margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-scrollspy-002-muted)}
/* Запас снизу: без него последний раздел не долистывается до верха и не подсвечивается. */
[data-vibeui-block="scrollspy-002"] [data-part="section"]:last-child{padding-bottom:8rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollspy-002"] [data-part="body"]{scroll-behavior:auto}
[data-vibeui-block="scrollspy-002"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_SECTIONS: Scrollspy002Section[] = [
  {
    id: "why",
    title: "Зачем",
    text: "Статья объясняет, почему оглавление на длинной странице перестаёт быть украшением: читатель приходит из поиска и попадает в середину текста.",
  },
  {
    id: "how",
    title: "Как устроено",
    text: "Разделы помечены идентификаторами, ссылки — обычные якоря, а подсветку добавляет наблюдатель пересечений поверх уже работающей навигации.",
  },
  {
    id: "mobile",
    title: "На телефоне",
    text: "Оглавление в строку прокручивается пальцем и не отнимает ширину у текста, поэтому его не приходится прятать за кнопкой.",
  },
  {
    id: "limits",
    title: "Границы",
    text: "Для оглавления из пятнадцати пунктов строка перестаёт работать: там нужен вложенный список или боковая колонка.",
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Оглавление статьи в строку: активный пункт помечен залитым номером.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollspy002({
  sections = DEFAULT_SECTIONS,
  title = "Содержание",
  bodyLabel = "Текст статьи",
  background = "",
  accent,
  className,
  style,
  ...props
}: Scrollspy002Props) {
  const body = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const root = body.current
    if (!root) return

    const watcher = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0]
        if (visible) setActive(visible.target.id)
      },
      { root, rootMargin: "0px 0px -65% 0px", threshold: 0 },
    )

    root
      .querySelectorAll("[data-part='section']")
      .forEach((section) => watcher.observe(section))
    return () => watcher.disconnect()
  }, [sections])

  const position = sections.findIndex((section) => section.id === active) + 1

  const palette = {
    ...(accent ? { "--vibeui-scrollspy-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-scrollspy-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollspy-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="scrollspy-002"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <span data-part="counter">
            {position} / {sections.length}
          </span>
        </div>
        <nav aria-label={title}>
          <ul data-part="toc">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  data-part="link"
                  href={`#${section.id}`}
                  aria-current={section.id === active}
                >
                  <span data-part="num">{index + 1}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div
          data-part="body"
          ref={body}
          tabIndex={0}
          role="group"
          aria-label={bodyLabel}
        >
          {sections.map((section) => (
            <section key={section.id} id={section.id} data-part="section">
              <h4>{section.title}</h4>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
