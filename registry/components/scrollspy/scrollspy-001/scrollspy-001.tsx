"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Scrollspy001Section = {
  id: string
  title: string
  text?: string
}

export type Scrollspy001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  sections?: Scrollspy001Section[]
  title?: string
  /** Подпись области чтения для скринридера. */
  bodyLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: оглавление, которое подсвечивает раздел, видимый сейчас.
// Слежение — IntersectionObserver, а не обработчик scroll: браузер сам решает,
// когда пересчитывать, и страница не дёргается при быстрой прокрутке. Полоса
// сверху обрезана rootMargin, иначе активным становится раздел, ушедший вверх.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="scrollspy-001"]){
--vibeui-scrollspy-001-bg:transparent;
--vibeui-scrollspy-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-scrollspy-001-muted:light-dark(oklch(0.56 0.014 265),oklch(0.69 0.012 265));
--vibeui-scrollspy-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-scrollspy-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-scrollspy-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="scrollspy-001"]{
display:grid;grid-template-columns:9rem 1fr;gap:1rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-scrollspy-001-bg);
border:1px solid var(--vibeui-scrollspy-001-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollspy-001-font);color:var(--vibeui-scrollspy-001-fg);
}
[data-vibeui-block="scrollspy-001"] [data-part="toc"]{
position:sticky;top:0;align-self:start;
display:flex;flex-direction:column;gap:0.125rem;
border-left:2px solid var(--vibeui-scrollspy-001-border);
}
[data-vibeui-block="scrollspy-001"] [data-part="head"]{
margin:0 0 0.375rem 0.625rem;font-size:0.6875rem;letter-spacing:0.04em;
text-transform:uppercase;color:var(--vibeui-scrollspy-001-muted);
}
/* Активный пункт помечен полосой у края, а не только цветом текста. */
[data-vibeui-block="scrollspy-001"] [data-part="link"]{
position:relative;padding:0.25rem 0.5rem 0.25rem 0.625rem;
color:var(--vibeui-scrollspy-001-muted);text-decoration:none;
font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="scrollspy-001"] [data-part="link"][aria-current="true"]{color:var(--vibeui-scrollspy-001-fg);font-weight:650}
[data-vibeui-block="scrollspy-001"] [data-part="link"][aria-current="true"]::before{
content:"";position:absolute;left:-2px;top:0.25rem;bottom:0.25rem;
width:2px;background:var(--vibeui-scrollspy-001-accent);
}
[data-vibeui-block="scrollspy-001"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-001-accent);outline-offset:-2px;border-radius:0.25rem}
[data-vibeui-block="scrollspy-001"] [data-part="body"]{
height:13rem;overflow-y:auto;overscroll-behavior:contain;
scroll-behavior:smooth;padding-right:0.375rem;
}
[data-vibeui-block="scrollspy-001"] [data-part="section"]{scroll-margin-top:0.5rem}
[data-vibeui-block="scrollspy-001"] [data-part="section"] h3{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="scrollspy-001"] [data-part="section"] p{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-scrollspy-001-muted)}
/* Запас снизу: без него последний раздел не долистывается и не подсвечивается. */
[data-vibeui-block="scrollspy-001"] [data-part="section"]:last-child p{margin-bottom:9rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollspy-001"] [data-part="body"]{scroll-behavior:auto}
[data-vibeui-block="scrollspy-001"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_SECTIONS: Scrollspy001Section[] = [
  {
    id: "install",
    title: "Установка",
    text: "Компонент ставится одной командой: файл копируется в проект, зависимостей нет.",
  },
  {
    id: "props",
    title: "Пропсы",
    text: "Каждый проп имеет разумное значение по умолчанию, поэтому компонент рендерится и без единого атрибута.",
  },
  {
    id: "theme",
    title: "Тема",
    text: "Цвета живут в локальных переменных с префиксом компонента и не конфликтуют с темой проекта-хозяина.",
  },
  {
    id: "a11y",
    title: "Доступность",
    text: "Разметка семантическая, фокус виден, состояние передаётся не только цветом.",
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
 * Оглавление с подсветкой видимого раздела: IntersectionObserver вместо scroll.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollspy001({
  sections = DEFAULT_SECTIONS,
  title = "На странице",
  bodyLabel = "Текст",
  background = "",
  accent,
  className,
  style,
  ...props
}: Scrollspy001Props) {
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
      { root, rootMargin: "0px 0px -60% 0px", threshold: 0 },
    )

    root
      .querySelectorAll("[data-part='section']")
      .forEach((section) => watcher.observe(section))
    return () => watcher.disconnect()
  }, [sections])

  const palette = {
    ...(accent ? { "--vibeui-scrollspy-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-scrollspy-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollspy-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="scrollspy-001"
        className={className}
        style={palette}
      >
        <nav data-part="toc" aria-label={title}>
          <p data-part="head">{title}</p>
          {sections.map((section) => (
            <a
              key={section.id}
              data-part="link"
              href={`#${section.id}`}
              aria-current={section.id === active}
              onClick={(event) => {
                event.preventDefault()
                body.current
                  ?.querySelector(`#${section.id}`)
                  ?.scrollIntoView({ block: "start" })
              }}
            >
              {section.title}
            </a>
          ))}
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
              <h3>{section.title}</h3>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
