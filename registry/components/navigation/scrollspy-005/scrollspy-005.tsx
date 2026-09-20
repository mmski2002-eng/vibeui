"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Scrollspy005Section = {
  id: string
  title: string
  text?: string
}

export type Scrollspy005Props = Omit<ComponentProps<"div">, "children"> & {
  sections?: Scrollspy005Section[]
  label?: string
  /** Подпись области чтения для скринридера. */
  bodyLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: горизонтальная панель разделов, прилипшая к верху длинной
// страницы. Когда разделов больше, чем влезает в строку, подсветки мало:
// активный пункт может оказаться за краем. Поэтому он доезжает до центра
// панели сам — scrollIntoView с inline:"center" и block:"nearest", чтобы
// прокрутить именно панель и не дёрнуть при этом всю страницу.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы. Подложки у
// него нет, но липкой панели непрозрачность обязательна — она берёт системный
// Canvas, то есть тот же цвет, по которому идёт страница.
const STYLES = `
:where([data-vibeui-block="scrollspy-005"]){
--vibeui-scrollspy-005-bg:transparent;
--vibeui-scrollspy-005-sticky:Canvas;
--vibeui-scrollspy-005-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-scrollspy-005-muted:color-mix(in oklab,var(--vibeui-scrollspy-005-fg) 68%,transparent);
--vibeui-scrollspy-005-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-scrollspy-005-accent:light-dark(oklch(0.295 0 0),oklch(0.899 0 0));
--vibeui-scrollspy-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollspy-005"]{color-scheme:dark}
[data-vibeui-block="scrollspy-005"]{
display:flex;flex-direction:column;
width:100%;max-width:30rem;box-sizing:border-box;
background:var(--vibeui-scrollspy-005-bg);
border:1px solid var(--vibeui-scrollspy-005-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollspy-005-font);color:var(--vibeui-scrollspy-005-fg);
overflow:hidden;
}
[data-vibeui-block="scrollspy-005"] [data-part="body"]{
position:relative;height:15rem;overflow-y:auto;overscroll-behavior:contain;scroll-behavior:smooth;
}
[data-vibeui-block="scrollspy-005"] [data-part="body"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-005-accent);outline-offset:-2px}
/* Панель липнет к верху области чтения и остаётся непрозрачной: текст под ней
   не должен просвечивать сквозь подписи разделов. */
[data-vibeui-block="scrollspy-005"] [data-part="barwrap"]{
position:sticky;top:0;z-index:1;
background:var(--vibeui-scrollspy-005-sticky);
border-bottom:1px solid var(--vibeui-scrollspy-005-border);
}
[data-vibeui-block="scrollspy-005"] [data-part="bar"]{
display:flex;gap:0.125rem;margin:0;padding:0 0.5rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none;
}
[data-vibeui-block="scrollspy-005"] [data-part="bar"]::-webkit-scrollbar{display:none}
[data-vibeui-block="scrollspy-005"] [data-part="link"]{
position:relative;display:block;flex:none;
padding:0.5rem 0.5rem 0.4375rem;
color:var(--vibeui-scrollspy-005-muted);text-decoration:none;
font-size:0.8125rem;line-height:1.2;white-space:nowrap;
}
[data-vibeui-block="scrollspy-005"] [data-part="link"]:hover{color:var(--vibeui-scrollspy-005-fg)}
[data-vibeui-block="scrollspy-005"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-005-accent);outline-offset:-2px;border-radius:0.25rem}
[data-vibeui-block="scrollspy-005"] [data-part="link"][aria-current="true"]{color:var(--vibeui-scrollspy-005-fg);font-weight:650}
/* Подчёркивание вместо заливки: панель остаётся тонкой, а метка — заметной. */
[data-vibeui-block="scrollspy-005"] [data-part="link"][aria-current="true"]::after{
content:"";position:absolute;left:0.5rem;right:0.5rem;bottom:-1px;height:2px;
border-radius:2px 2px 0 0;background:var(--vibeui-scrollspy-005-accent);color:oklch(from var(--vibeui-scrollspy-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="scrollspy-005"] [data-part="content"]{padding:0.75rem 0.9375rem 0}
[data-vibeui-block="scrollspy-005"] [data-part="section"]{scroll-margin-top:2.5rem}
[data-vibeui-block="scrollspy-005"] [data-part="section"] h4{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="scrollspy-005"] [data-part="section"] p{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-scrollspy-005-muted)}
[data-vibeui-block="scrollspy-005"] [data-part="section"]:last-child p{margin-bottom:10rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollspy-005"] [data-part="body"]{scroll-behavior:auto}
[data-vibeui-block="scrollspy-005"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_SECTIONS: Scrollspy005Section[] = [
  {
    id: "about",
    title: "О месте",
    text: "Небольшая мастерская в центре города: шесть столов, общая печь и полка с инструментом.",
  },
  {
    id: "menu",
    title: "Меню",
    text: "Кофе, чай и выпечка, которую пекут здесь же утром. Список меняется каждую неделю.",
  },
  {
    id: "prices",
    title: "Цены",
    text: "Час работы за общим столом стоит меньше чашки кофе в соседнем кафе, абонемент на месяц выгоднее вчетверо.",
  },
  {
    id: "schedule",
    title: "Расписание",
    text: "Будни с восьми утра до десяти вечера, суббота до шести, воскресенье — только для резидентов.",
  },
  {
    id: "rules",
    title: "Правила",
    text: "Громкие звонки — в телефонной будке, инструмент возвращается на полку, посуда моется сразу.",
  },
  {
    id: "contacts",
    title: "Контакты",
    text: "Второй этаж, вход со двора. Пишите заранее, если нужен стол на компанию больше четырёх человек.",
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
 * Липкая панель разделов: активный пункт сам доезжает до центра панели.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollspy005({
  sections = DEFAULT_SECTIONS,
  label = "Разделы страницы",
  bodyLabel = "Текст страницы",
  background = "",
  accent,
  className,
  style,
  ...props
}: Scrollspy005Props) {
  const body = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLUListElement>(null)
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
      // rootMargin понимает только px и %: rem бросает SyntaxError и обрывает
      // эффект, поэтому высота панели (2.5rem) переведена в пиксели вручную.
      { root, rootMargin: "-40px 0px -65% 0px", threshold: 0 },
    )

    root
      .querySelectorAll("[data-part='section']")
      .forEach((section) => watcher.observe(section))
    return () => watcher.disconnect()
  }, [sections])

  useEffect(() => {
    // block:"nearest" обязателен: иначе браузер подтянет к центру всю страницу.
    bar.current
      ?.querySelector(`[data-part="link"][aria-current="true"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [active])

  const palette = {
    ...(accent ? { "--vibeui-scrollspy-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-scrollspy-005-bg": background,
          "--vibeui-scrollspy-005-sticky": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollspy-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scrollspy"
        data-vibeui-block="scrollspy-005"
        className={className}
        style={palette}
      >
        <div
          data-part="body"
          ref={body}
          tabIndex={0}
          role="group"
          aria-label={bodyLabel}
        >
          <nav data-part="barwrap" aria-label={label}>
            <ul data-part="bar" ref={bar}>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    data-part="link"
                    href={`#${section.id}`}
                    aria-current={section.id === active}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div data-part="content">
            {sections.map((section) => (
              <section key={section.id} id={section.id} data-part="section">
                <h4>{section.title}</h4>
                <p>{section.text}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
