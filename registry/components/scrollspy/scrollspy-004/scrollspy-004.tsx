"use client"

import { useEffect, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, UIEvent } from "react"

export type Scrollspy004Section = {
  id: string
  title: string
  text?: string
}

export type Scrollspy004Props = Omit<ComponentProps<"div">, "children"> & {
  sections?: Scrollspy004Section[]
  title?: string
  /** Подпись полосы прочитанного для скринридера. */
  progressLabel?: string
  /** Подпись области чтения для скринридера. */
  bodyLabel?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: боковое оглавление документации, которое отвечает на два
// разных вопроса. «Где я» — подсветка активного пункта наблюдателем
// пересечений. «Сколько осталось» — вертикальная полоса прогресса вдоль
// списка, считается от прокрутки, а не от номера раздела: разделы разной
// длины, и «третий из шести» не равен половине текста.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="scrollspy-004"]){
--vibeui-scrollspy-004-bg:transparent;
--vibeui-scrollspy-004-fg:light-dark(oklch(0.23 0 265),oklch(0.93 0 265));
--vibeui-scrollspy-004-muted:color-mix(in oklab,var(--vibeui-scrollspy-004-fg) 68%,transparent);
--vibeui-scrollspy-004-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-scrollspy-004-accent:light-dark(oklch(0.55 0.19 300),oklch(0.76 0.15 300));
--vibeui-scrollspy-004-progress:0%;
--vibeui-scrollspy-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollspy-004"]{color-scheme:dark}
[data-vibeui-block="scrollspy-004"]{
display:grid;grid-template-columns:10.5rem 1fr;gap:1rem;
width:100%;max-width:32rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-scrollspy-004-bg);
border:1px solid var(--vibeui-scrollspy-004-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollspy-004-font);color:var(--vibeui-scrollspy-004-fg);
}
[data-vibeui-block="scrollspy-004"] [data-part="side"]{
position:sticky;top:0;align-self:start;
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="scrollspy-004"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;margin:0;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-scrollspy-004-muted);
}
[data-vibeui-block="scrollspy-004"] [data-part="percent"]{
font-size:0.6875rem;font-weight:700;letter-spacing:0;text-transform:none;
color:var(--vibeui-scrollspy-004-accent);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="scrollspy-004"] [data-part="rail"]{display:grid;grid-template-columns:2px 1fr;gap:0.5rem}
/* Полоса прочитанного — фон трека, залитый на процент прокрутки. */
[data-vibeui-block="scrollspy-004"] [data-part="track"]{
position:relative;border-radius:2px;background:var(--vibeui-scrollspy-004-border);
}
[data-vibeui-block="scrollspy-004"] [data-part="fill"]{
position:absolute;inset:0 0 auto 0;height:var(--vibeui-scrollspy-004-progress);
border-radius:2px;background:var(--vibeui-scrollspy-004-accent);
transition:height .12s linear;
}
[data-vibeui-block="scrollspy-004"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="scrollspy-004"] [data-part="link"]{
display:block;padding:0.25rem 0.375rem;border-radius:0.375rem;
color:var(--vibeui-scrollspy-004-muted);text-decoration:none;font-size:0.8125rem;line-height:1.3;
}
[data-vibeui-block="scrollspy-004"] [data-part="link"]:hover{color:var(--vibeui-scrollspy-004-fg)}
[data-vibeui-block="scrollspy-004"] [data-part="link"][aria-current="true"]{
color:var(--vibeui-scrollspy-004-fg);font-weight:650;
background:color-mix(in oklab,var(--vibeui-scrollspy-004-accent) 10%,transparent);
}
[data-vibeui-block="scrollspy-004"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-004-accent);outline-offset:-2px}
[data-vibeui-block="scrollspy-004"] [data-part="body"]{
height:13rem;overflow-y:auto;overscroll-behavior:contain;scroll-behavior:smooth;padding-right:0.375rem;
}
[data-vibeui-block="scrollspy-004"] [data-part="body"]:focus-visible{outline:2px solid var(--vibeui-scrollspy-004-accent);outline-offset:2px;border-radius:0.375rem}
[data-vibeui-block="scrollspy-004"] [data-part="section"]{scroll-margin-top:0.5rem}
[data-vibeui-block="scrollspy-004"] [data-part="section"] h4{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="scrollspy-004"] [data-part="section"] p{margin:0 0 1rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-scrollspy-004-muted)}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollspy-004"] [data-part="body"]{scroll-behavior:auto}
[data-vibeui-block="scrollspy-004"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_SECTIONS: Scrollspy004Section[] = [
  {
    id: "overview",
    title: "Обзор",
    text: "Документация начинается с короткого объяснения: что делает библиотека и чего она принципиально не делает.",
  },
  {
    id: "install",
    title: "Установка",
    text: "Компонент копируется в проект одной командой. Ни рантайма, ни конфигурации: файл лежит в вашем репозитории и правится как ваш собственный код.",
  },
  {
    id: "theming",
    title: "Тема",
    text: "Все цвета объявлены локальными переменными компонента. Чтобы перекрасить блок, достаточно передать одну переменную акцента — трогать глобальные стили не нужно.",
  },
  {
    id: "layout",
    title: "Раскладка",
    text: "Ширина считается от контейнера, а не от окна: компонент одинаково ведёт себя в узкой колонке и на полном экране.",
  },
  {
    id: "faq",
    title: "Частые вопросы",
    text: "Здесь собраны ответы на то, что спрашивают до установки: про размер, про совместимость и про поддержку старых браузеров.",
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
 * Боковое оглавление документации с полосой прочитанного и подсветкой раздела.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollspy004({
  sections = DEFAULT_SECTIONS,
  title = "Документация",
  progressLabel = "Прочитано",
  bodyLabel = "Текст документации",
  background = "",
  accent,
  className,
  style,
  ...props
}: Scrollspy004Props) {
  const body = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(sections[0]?.id)
  const [progress, setProgress] = useState(0)

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
  }, [sections])

  function onScroll(event: UIEvent<HTMLDivElement>) {
    const node = event.currentTarget
    const scrollable = node.scrollHeight - node.clientHeight
    setProgress(
      scrollable <= 0 ? 100 : Math.round((node.scrollTop / scrollable) * 100),
    )
  }

  const palette = {
    "--vibeui-scrollspy-004-progress": `${progress}%`,
    ...(accent ? { "--vibeui-scrollspy-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-scrollspy-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollspy-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scrollspy"
        data-vibeui-block="scrollspy-004"
        className={className}
        style={palette}
      >
        <nav data-part="side" aria-label={title}>
          <p data-part="head">
            {title}
            <span data-part="percent">{progress}%</span>
          </p>
          <div data-part="rail">
            <div
              data-part="track"
              role="progressbar"
              aria-label={progressLabel}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span data-part="fill" />
            </div>
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
          </div>
        </nav>
        <div
          data-part="body"
          ref={body}
          onScroll={onScroll}
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
