"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Scrollspy006Section = {
  id: string
  title: string
  text?: string
}

export type Scrollspy006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  sections?: Scrollspy006Section[]
  title?: string
  topLabel?: string
  accent?: string
}

// Идея компонента: оглавление плюс возврат к началу. Кнопка «наверх» — это
// обычная якорная ссылка на первый раздел: без JS она просто работает.
// Наблюдатель пересечений следит за меткой в самом верху текста и прячет
// ссылку, пока начало и так на экране, — иначе кнопка предлагает то, что
// уже сделано. Активный раздел подсвечивается тем же наблюдателем.
const STYLES = `
:where([data-vibeui-block="scrollspy-006"]){
--vibeui-scrollspy-006-bg:oklch(1 0 0);
--vibeui-scrollspy-006-fg:oklch(0.23 0.014 265);
--vibeui-scrollspy-006-muted:oklch(0.56 0.014 265);
--vibeui-scrollspy-006-border:oklch(0.91 0.006 265);
--vibeui-scrollspy-006-accent:oklch(0.52 0.15 200);
--vibeui-scrollspy-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="scrollspy-006"]{
display:grid;grid-template-columns:9rem 1fr;gap:0.875rem;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-scrollspy-006-bg);
border:1px solid var(--vibeui-scrollspy-006-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollspy-006-font);color:var(--vibeui-scrollspy-006-fg);
}
[data-vibeui-block="scrollspy-006"] [data-part="toc"]{position:sticky;top:0;align-self:start}
[data-vibeui-block="scrollspy-006"] [data-part="head"]{
margin:0 0 0.375rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;
text-transform:uppercase;color:var(--vibeui-scrollspy-006-muted);
}
[data-vibeui-block="scrollspy-006"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="scrollspy-006"] [data-part="link"]{
display:block;padding:0.25rem 0.375rem;border-left:2px solid transparent;
color:var(--vibeui-scrollspy-006-muted);text-decoration:none;font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="scrollspy-006"] [data-part="link"]:hover{color:var(--vibeui-scrollspy-006-fg)}
[data-vibeui-block="scrollspy-006"] [data-part="link"][aria-current="true"]{
color:var(--vibeui-scrollspy-006-fg);font-weight:650;
border-left-color:var(--vibeui-scrollspy-006-accent);
}
[data-vibeui-block="scrollspy-006"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-006-accent);outline-offset:-2px}
[data-vibeui-block="scrollspy-006"] [data-part="stage"]{position:relative;min-width:0}
[data-vibeui-block="scrollspy-006"] [data-part="sentinel"]{display:block;height:1px}
[data-vibeui-block="scrollspy-006"] [data-part="body"]{
height:13rem;overflow-y:auto;overscroll-behavior:contain;scroll-behavior:smooth;padding-right:0.375rem;
}
[data-vibeui-block="scrollspy-006"] [data-part="body"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-006-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="scrollspy-006"] [data-part="section"]{scroll-margin-top:0.5rem}
[data-vibeui-block="scrollspy-006"] [data-part="section"] h4{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="scrollspy-006"] [data-part="section"] p{margin:0 0 1.25rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-scrollspy-006-muted)}
[data-vibeui-block="scrollspy-006"] [data-part="section"]:last-child p{margin-bottom:9rem}
/* Кнопка возврата лежит над областью чтения, а не в потоке: текст под ней
   не смещается, когда она появляется. */
[data-vibeui-block="scrollspy-006"] [data-part="top"]{
position:absolute;right:0.625rem;bottom:0.625rem;
display:inline-flex;align-items:center;gap:0.3125rem;
padding:0.3125rem 0.625rem;border-radius:9999px;
border:1px solid var(--vibeui-scrollspy-006-border);
background:var(--vibeui-scrollspy-006-bg);color:var(--vibeui-scrollspy-006-fg);
box-shadow:0 2px 8px oklch(0.2 0.02 265 / 12%);
font-size:0.75rem;font-weight:600;text-decoration:none;
transition:opacity .16s ease,transform .16s ease;
}
[data-vibeui-block="scrollspy-006"] [data-part="top"] svg{width:0.75rem;height:0.75rem;display:block}
[data-vibeui-block="scrollspy-006"] [data-part="top"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-006-accent);outline-offset:2px}
/* Спрятана атрибутом hidden, а не прозрачностью: невидимая ссылка не должна
   ловить фокус табом. */
[data-vibeui-block="scrollspy-006"] [data-part="top"][hidden]{display:none}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollspy-006"] [data-part="body"]{scroll-behavior:auto}
[data-vibeui-block="scrollspy-006"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_SECTIONS: Scrollspy006Section[] = [
  {
    id: "intro",
    title: "Введение",
    text: "Длинный текст без возврата к началу заставляет крутить колесо назад — это самая частая жалоба на страницы справки.",
  },
  {
    id: "setup",
    title: "Подготовка",
    text: "Разделы помечаются идентификаторами, а оглавление собирается из того же массива, что и текст: рассинхронизировать их невозможно.",
  },
  {
    id: "usage",
    title: "Использование",
    text: "Ссылки остаются ссылками: их можно открыть в новой вкладке, скопировать и отправить коллеге — адрес указывает на раздел.",
  },
  {
    id: "tips",
    title: "Советы",
    text: "Не прячьте кнопку возврата анимацией появления: на длинной странице она нужна мгновенно, а не через полсекунды.",
  },
  {
    id: "end",
    title: "Итог",
    text: "Оглавление отвечает на вопрос «что дальше», кнопка возврата — на вопрос «как обратно». Это разные задачи.",
  },
]

/**
 * Оглавление с кнопкой возврата к началу: обычный якорь, скрытый пока начало видно.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollspy006({
  sections = DEFAULT_SECTIONS,
  title = "Содержание",
  topLabel = "Наверх",
  accent,
  className,
  style,
  ...props
}: Scrollspy006Props) {
  const body = useRef<HTMLDivElement>(null)
  const sentinel = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(sections[0]?.id)
  const [atTop, setAtTop] = useState(false)

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

    const guard = new IntersectionObserver(
      ([entry]) => setAtTop(entry.isIntersecting),
      { root, threshold: 0 },
    )
    if (sentinel.current) guard.observe(sentinel.current)

    return () => {
      watcher.disconnect()
      guard.disconnect()
    }
  }, [sections])

  const palette = {
    ...(accent ? { "--vibeui-scrollspy-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const first = sections[0]?.id

  return (
    <>
      <style href="vibeui-scrollspy-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="scrollspy-006"
        className={className}
        style={palette}
      >
        <nav data-part="toc" aria-label={title}>
          <p data-part="head">{title}</p>
          <ul>
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
        <div data-part="stage">
          <div
            data-part="body"
            ref={body}
            tabIndex={0}
            role="group"
            aria-label="Текст статьи"
          >
            <span data-part="sentinel" ref={sentinel} aria-hidden="true" />
            {sections.map((section) => (
              <section key={section.id} id={section.id} data-part="section">
                <h4>{section.title}</h4>
                <p>{section.text}</p>
              </section>
            ))}
          </div>
          <a data-part="top" href={`#${first}`} hidden={atTop}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path
                d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {topLabel}
          </a>
        </div>
      </div>
    </>
  )
}
