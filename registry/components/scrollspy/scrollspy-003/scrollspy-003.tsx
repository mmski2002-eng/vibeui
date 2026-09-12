"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Scrollspy003Child = {
  id: string
  title: string
  text?: string
}

export type Scrollspy003Chapter = Scrollspy003Child & {
  children?: Scrollspy003Child[]
}

export type Scrollspy003Props = Omit<ComponentProps<"div">, "children"> & {
  chapters?: Scrollspy003Chapter[]
  title?: string
  /** Подпись области чтения для скринридера. */
  bodyLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: двухуровневое оглавление, которое не вываливает сразу все
// подпункты. Раскрыта только та глава, внутри которой читатель сейчас, —
// остальные свёрнуты, и список остаётся коротким на любой длине текста.
// Подсветка идёт по обоим уровням: глава помечается как раздел-родитель,
// подпункт — как текущая цель, поэтому видно и «где я», и «в чём».
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="scrollspy-003"]){
--vibeui-scrollspy-003-bg:transparent;
--vibeui-scrollspy-003-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-scrollspy-003-muted:color-mix(in oklab,var(--vibeui-scrollspy-003-fg) 68%,transparent);
--vibeui-scrollspy-003-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-scrollspy-003-accent:light-dark(oklch(0.282 0 0),oklch(0.905 0 0));
--vibeui-scrollspy-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollspy-003"]{color-scheme:dark}
[data-vibeui-block="scrollspy-003"]{
display:grid;grid-template-columns:10rem 1fr;gap:0.875rem;
width:100%;max-width:32rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-scrollspy-003-bg);
border:1px solid var(--vibeui-scrollspy-003-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollspy-003-font);color:var(--vibeui-scrollspy-003-fg);
}
[data-vibeui-block="scrollspy-003"] [data-part="toc"]{position:sticky;top:0;align-self:start}
[data-vibeui-block="scrollspy-003"] [data-part="head"]{
margin:0 0 0.5rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;
text-transform:uppercase;color:var(--vibeui-scrollspy-003-muted);
}
[data-vibeui-block="scrollspy-003"] ul{margin:0;padding:0;list-style:none}
[data-vibeui-block="scrollspy-003"] [data-part="link"]{
display:block;padding:0.25rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-scrollspy-003-muted);text-decoration:none;
font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="scrollspy-003"] [data-part="link"]:hover{color:var(--vibeui-scrollspy-003-fg)}
[data-vibeui-block="scrollspy-003"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-003-accent);outline-offset:-2px}
[data-vibeui-block="scrollspy-003"] li[data-open="true"] > [data-part="link"]{color:var(--vibeui-scrollspy-003-fg);font-weight:650}
[data-vibeui-block="scrollspy-003"] [data-part="link"][aria-current="true"]{
color:var(--vibeui-scrollspy-003-fg);font-weight:650;
background:color-mix(in oklab,var(--vibeui-scrollspy-003-accent) 12%,transparent);
}
/* Второй уровень живёт только у раскрытой главы: иначе список длиннее текста. */
[data-vibeui-block="scrollspy-003"] [data-part="sub"]{
display:none;margin:0.125rem 0 0.25rem 0.5rem;
border-left:1px solid var(--vibeui-scrollspy-003-border);padding-left:0.375rem;
}
[data-vibeui-block="scrollspy-003"] li[data-open="true"] > [data-part="sub"]{display:block}
[data-vibeui-block="scrollspy-003"] [data-part="sub"] [data-part="link"]{font-size:0.75rem;padding:0.1875rem 0.375rem}
[data-vibeui-block="scrollspy-003"] [data-part="body"]{
height:13rem;overflow-y:auto;overscroll-behavior:contain;scroll-behavior:smooth;
padding-right:0.375rem;
}
[data-vibeui-block="scrollspy-003"] [data-part="body"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-003-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="scrollspy-003"] [data-part="section"]{scroll-margin-top:0.5rem}
[data-vibeui-block="scrollspy-003"] [data-part="section"] h4{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="scrollspy-003"] [data-part="section"] h5{margin:0.75rem 0 0.25rem;font-size:0.8125rem;font-weight:600;color:var(--vibeui-scrollspy-003-accent)}
[data-vibeui-block="scrollspy-003"] [data-part="section"] p{margin:0 0 0.5rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-scrollspy-003-muted)}
[data-vibeui-block="scrollspy-003"] [data-part="body"] > :last-child{padding-bottom:9rem}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollspy-003"] [data-part="body"]{scroll-behavior:auto}
[data-vibeui-block="scrollspy-003"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_CHAPTERS: Scrollspy003Chapter[] = [
  {
    id: "start",
    title: "Начало",
    text: "Короткая глава о том, что понадобится до установки.",
    children: [
      {
        id: "start-req",
        title: "Требования",
        text: "Нужен только пакетный менеджер и проект, куда будет скопирован файл компонента.",
      },
      {
        id: "start-install",
        title: "Установка",
        text: "Одна команда копирует исходник в проект: сборка при этом ничего не скачивает из сети.",
      },
    ],
  },
  {
    id: "api",
    title: "Интерфейс",
    text: "Все пропсы имеют значения по умолчанию.",
    children: [
      {
        id: "api-props",
        title: "Пропсы",
        text: "Данные передаются массивом, подписи — строками, а внешний вид меняется одной переменной акцента.",
      },
      {
        id: "api-events",
        title: "События",
        text: "Компонент не навязывает обработчиков: он остаётся навигацией, а не хранилищем состояния приложения.",
      },
    ],
  },
  {
    id: "a11y",
    title: "Доступность",
    text: "Ссылки остаются ссылками, состояние передаётся не только цветом.",
    children: [
      {
        id: "a11y-keys",
        title: "Клавиатура",
        text: "Оглавление обходится табом, у каждой ссылки видимая обводка фокуса.",
      },
    ],
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
 * Двухуровневое оглавление: раскрыта только текущая глава, подсветка на обоих уровнях.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollspy003({
  chapters = DEFAULT_CHAPTERS,
  title = "Разделы",
  bodyLabel = "Текст документации",
  background = "",
  accent,
  className,
  style,
  ...props
}: Scrollspy003Props) {
  const body = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(chapters[0]?.id)

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
      { root, rootMargin: "0px 0px -70% 0px", threshold: 0 },
    )

    root
      .querySelectorAll("[data-part='section']")
      .forEach((section) => watcher.observe(section))
    return () => watcher.disconnect()
  }, [chapters])

  const palette = {
    ...(accent ? { "--vibeui-scrollspy-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-scrollspy-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollspy-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scrollspy"
        data-vibeui-block="scrollspy-003"
        className={className}
        style={palette}
      >
        <nav data-part="toc" aria-label={title}>
          <p data-part="head">{title}</p>
          <ul>
            {chapters.map((chapter) => {
              const open =
                chapter.id === active ||
                (chapter.children ?? []).some((child) => child.id === active)
              return (
                <li key={chapter.id} data-open={open}>
                  <a
                    data-part="link"
                    href={`#${chapter.id}`}
                    aria-current={chapter.id === active}
                  >
                    {chapter.title}
                  </a>
                  {chapter.children?.length ? (
                    <ul data-part="sub">
                      {chapter.children.map((child) => (
                        <li key={child.id}>
                          <a
                            data-part="link"
                            href={`#${child.id}`}
                            aria-current={child.id === active}
                          >
                            {child.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>
        <div
          data-part="body"
          ref={body}
          tabIndex={0}
          role="group"
          aria-label={bodyLabel}
        >
          {chapters.map((chapter) => (
            <section key={chapter.id} id={chapter.id} data-part="section">
              <h4>{chapter.title}</h4>
              <p>{chapter.text}</p>
              {chapter.children?.map((child) => (
                <section key={child.id} id={child.id} data-part="section">
                  <h5>{child.title}</h5>
                  <p>{child.text}</p>
                </section>
              ))}
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
