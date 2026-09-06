import type { CSSProperties } from "react"

type Blog010Section = {
  id: string
  heading: string
  paragraphs: string[]
}

export type Blog010Props = {
  eyebrow?: string
  title?: string
  tocTitle?: string
  /** id секции, которая подсвечена в оглавлении как текущая. */
  activeId?: string
  sections?: Blog010Section[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Макет статьи с липким оглавлением: колонка навигации едет вместе с
// прокруткой, активный пункт отмечен оранжевой полосой и цветом. Активная
// секция задаётся данными (aria-current), а не наблюдателем пересечений —
// блок остаётся серверным, подсветку скролла вешает вызывающий код.
const STYLES = `
:where([data-vibeui-block="blog-010"]){
--vibeui-blog-010-bg:transparent;
--vibeui-blog-010-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-blog-010-muted:light-dark(oklch(0.46 0 0),oklch(0.71 0 0));
--vibeui-blog-010-border:light-dark(oklch(0.9 0 0),oklch(0.33 0 0));
--vibeui-blog-010-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-blog-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="blog-010"]{color-scheme:dark}
[data-vibeui-block="blog-010"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-blog-010-bg);color:var(--vibeui-blog-010-ink);
font-family:var(--vibeui-blog-010-font);
}
[data-vibeui-block="blog-010"] [data-part="shell"]{
max-width:70rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="blog-010"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-blog-010-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-010"] [data-part="title"]{
margin:0 0 2rem;max-width:26ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="blog-010"] [data-part="layout"]{display:grid;gap:2rem}
[data-vibeui-block="blog-010"] [data-part="toc"]{min-width:0}
[data-vibeui-block="blog-010"] [data-part="toc-title"]{
margin:0 0 0.625rem;color:var(--vibeui-blog-010-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="blog-010"] [data-part="toc-list"]{
display:flex;flex-direction:column;margin:0;padding:0;list-style:none;
border-left:2px solid var(--vibeui-blog-010-border);
}
[data-vibeui-block="blog-010"] [data-part="toc-link"]{
display:block;padding:0.4375rem 0 0.4375rem 0.875rem;margin-left:-2px;
border-left:2px solid transparent;
color:var(--vibeui-blog-010-muted);text-decoration:none;
font-size:0.875rem;line-height:1.4;
transition:color .15s ease,border-color .15s ease;
}
[data-vibeui-block="blog-010"] [data-part="toc-link"]:hover{color:var(--vibeui-blog-010-ink)}
[data-vibeui-block="blog-010"] [data-part="toc-link"][aria-current="true"]{
border-left-color:var(--vibeui-blog-010-accent);
color:var(--vibeui-blog-010-accent);font-weight:650;
}
[data-vibeui-block="blog-010"] [data-part="toc-link"]:focus-visible{
outline:2px solid var(--vibeui-blog-010-accent);outline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="blog-010"] [data-part="article"]{min-width:0;max-width:62ch}
[data-vibeui-block="blog-010"] [data-part="heading"]{
margin:0 0 0.875rem;scroll-margin-top:5rem;
font-size:clamp(1.25rem,3cqi,1.5rem);line-height:1.2;letter-spacing:-0.015em;font-weight:700;
}
[data-vibeui-block="blog-010"] [data-part="section"]{margin:0 0 2.25rem}
[data-vibeui-block="blog-010"] [data-part="section"]:last-child{margin-bottom:0}
[data-vibeui-block="blog-010"] [data-part="paragraph"]{
margin:0 0 1rem;color:var(--vibeui-blog-010-muted);
font-size:1rem;line-height:1.7;
}
[data-vibeui-block="blog-010"] [data-part="paragraph"]:last-child{margin-bottom:0}
@container (min-width: 40rem){
[data-vibeui-block="blog-010"] [data-part="shell"]{padding:4.5rem 2rem}
}
@container (min-width: 56rem){
[data-vibeui-block="blog-010"] [data-part="layout"]{grid-template-columns:15rem minmax(0,1fr);gap:3.5rem;align-items:start}
/* Липкость только на широком блоке: на телефоне липкая колонка съедает экран. */
[data-vibeui-block="blog-010"] [data-part="toc"]{position:sticky;top:1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="blog-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Blog010Section[] = [
  {
    id: "blog-010-pick",
    heading: "Выбор блока в каталоге",
    paragraphs: [
      "Каталог показывает живой рендер, а не скриншот: миниатюра собрана из того же файла, который приедет в проект. Поэтому то, что вы видите в превью, и есть будущая секция сайта.",
      "Фильтры по категориям сужают полторы тысячи блоков до пары десятков. Дальше решает вкус: у каждого блока своя идея, а не десять вариаций одной сетки.",
    ],
  },
  {
    id: "blog-010-copy",
    heading: "Что копирует «Copy for AI»",
    paragraphs: [
      "Кнопка отдаёт не код, а инструкцию для агента: идентификатор блока, команду установки, список зависимостей и правила — что сохранить, что можно адаптировать.",
      "Инструкция собирается из metadata блока автоматически. Ручных описаний нет, поэтому она не расходится с кодом.",
    ],
  },
  {
    id: "blog-010-install",
    heading: "Установка агентом",
    paragraphs: [
      "Агент выполняет команду shadcn CLI, и файл блока появляется в проекте как обычный компонент. Никакого рантайма библиотеки — дальше это ваш код.",
      "Палитра блока лежит в его локальных переменных, поэтому чужая тема ему не мешает: секция выглядит так же, как в каталоге.",
    ],
  },
  {
    id: "blog-010-adapt",
    heading: "Адаптация под бренд",
    paragraphs: [
      "Контент меняется через пропсы, акцентный цвет — через проп accent. Раскладку и анимации инструкция велит не трогать: они и есть дизайн, за которым блок выбирали.",
    ],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Макет статьи с липким оглавлением: активный пункт отмечен оранжевой полосой. */
export function Blog010({
  eyebrow = "Руководство",
  title = "Путь блока: от каталога до вашего сайта",
  tocTitle = "Содержание",
  activeId = "blog-010-copy",
  sections = DEFAULT_SECTIONS,
  background = "",
  accent,
  className,
  style,
}: Blog010Props) {
  const palette = {
    ...(accent ? { "--vibeui-blog-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-blog-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-blog-010" precedence="medium">
        {STYLES}
      </style>
      <section data-vibeui-block="blog-010" className={className} style={palette}>
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <div data-part="layout">
            <nav data-part="toc" aria-label={tocTitle}>
              <p data-part="toc-title">{tocTitle}</p>
              <ul data-part="toc-list">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      data-part="toc-link"
                      href={`#${section.id}`}
                      aria-current={section.id === activeId ? "true" : undefined}
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <article data-part="article">
              {sections.map((section) => (
                <section key={section.id} data-part="section">
                  <h3 data-part="heading" id={section.id}>
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} data-part="paragraph">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
