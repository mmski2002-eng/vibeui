import type { ComponentProps, CSSProperties } from "react"

export type Timeline002Entry = {
  /** Имя автора: из него берутся инициалы и оттенок кружка. */
  author: string
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  action: string
  target?: string
  time: string
  /** Машиночитаемый момент для <time datetime>: «2 мин» роботу ничего не говорит. */
  dateTime: string
}

export type Timeline002Props = Omit<ComponentProps<"section">, "children"> & {
  entries?: Timeline002Entry[]
  title?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: лента активности, где отправитель узнаётся раньше текста.
// Кружок с инициалами стоит на линии и красится оттенком, посчитанным из
// имени, поэтому одного человека видно в ленте как повторяющееся пятно цвета.
// Время вынесено в отдельный столбец с табличными цифрами: в ленте из
// двадцати строк «2 мин» и «12 мин» обязаны стоять по одной вертикали.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// становится тёмным там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="timeline-002"]){
--vibeui-timeline-002-bg:transparent;
--vibeui-timeline-002-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-timeline-002-muted:color-mix(in oklab,var(--vibeui-timeline-002-fg) 68%,transparent);
--vibeui-timeline-002-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-timeline-002-line:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-timeline-002-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-timeline-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="timeline-002"]{color-scheme:dark}
[data-vibeui-block="timeline-002"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-timeline-002-bg);
border:1px solid var(--vibeui-timeline-002-border);border-radius:0.875rem;
font-family:var(--vibeui-timeline-002-font);color:var(--vibeui-timeline-002-fg);
}
[data-vibeui-block="timeline-002"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="timeline-002"] [data-part="feed"]{margin:0;padding:0;list-style:none;display:flex;flex-direction:column}
[data-vibeui-block="timeline-002"] [data-part="row"]{
position:relative;display:grid;grid-template-columns:1.75rem 1fr auto;
align-items:start;gap:0.625rem;padding-bottom:0.875rem;
}
/* Линия — псевдоэлемент строки, а не отдельный столбик: она обрывается
   ровно на последнем аватаре и не свисает под лентой. */
[data-vibeui-block="timeline-002"] [data-part="row"]::before{
content:"";position:absolute;left:0.8125rem;top:2rem;bottom:0;
width:1px;background:var(--vibeui-timeline-002-line);
}
[data-vibeui-block="timeline-002"] [data-part="row"]:last-child{padding-bottom:0}
[data-vibeui-block="timeline-002"] [data-part="row"]:last-child::before{display:none}
[data-vibeui-block="timeline-002"] [data-part="avatar"]{
position:relative;display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:9999px;
color:light-dark(oklch(0.35 0.09 var(--vibeui-timeline-002-hue,250)),oklch(0.9 0.07 var(--vibeui-timeline-002-hue,250)));
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="timeline-002"] [data-part="avatar"][data-empty="true"]{background:light-dark(oklch(0.92 0.05 var(--vibeui-timeline-002-hue,250)),oklch(0.36 0.06 var(--vibeui-timeline-002-hue,250)));}
[data-vibeui-block="timeline-002"] [data-part="avatar"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="timeline-002"] [data-part="text"]{margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-timeline-002-muted)}
[data-vibeui-block="timeline-002"] [data-part="author"]{color:var(--vibeui-timeline-002-fg);font-weight:600}
/* Цель правки помечена цветом акцента: в потоке одинаковых фраз глаз
   цепляется за объект, а не за глагол. */
[data-vibeui-block="timeline-002"] [data-part="target"]{color:var(--vibeui-timeline-002-accent);font-weight:600}
[data-vibeui-block="timeline-002"] [data-part="time"]{
font-size:0.6875rem;color:var(--vibeui-timeline-002-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;padding-top:0.125rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="timeline-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Timeline002Entry[] = [
  {
    author: "Аня Петрова",
    action: "оставила комментарий в",
    target: "Главная страница",
    time: "2 мин",
    dateTime: "2026-03-14T14:20",
  },
  {
    author: "Марк Иванов",
    action: "закрыл задачу",
    target: "Экспорт в CSV",
    time: "18 мин",
    dateTime: "2026-03-14T14:04",
  },
  {
    author: "Аня Петрова",
    action: "загрузила 6 файлов",
    time: "1 ч",
    dateTime: "2026-03-14T13:22",
  },
  {
    author: "Лиза Ким",
    action: "пригласила в проект",
    target: "Олег С.",
    time: "3 ч",
    dateTime: "2026-03-14T11:15",
  },
]

/** Оттенок из имени: один человек всегда получает один и тот же кружок. */
function hue(name: string) {
  let hash = 2166136261
  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
}

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
 * Лента активности: аватар с инициалами, действие и время в отдельном столбце.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Timeline002({
  entries = DEFAULT_ENTRIES,
  title = "Активность",
  accent,
  background = "",
  className,
  style,
  ...props
}: Timeline002Props) {
  const palette = {
    ...(accent ? { "--vibeui-timeline-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-timeline-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-timeline-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="timeline"
        data-vibeui-block="timeline-002"
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        <ol data-part="feed">
          {entries.map((entry, index) => (
            <li data-part="row" key={`${entry.author}-${index}`}>
              <span
                data-part="avatar"
                data-empty={entry.image ? undefined : "true"}
                aria-hidden="true"
                style={
                  {
                    "--vibeui-timeline-002-hue": hue(entry.author),
                  } as CSSProperties
                }
              >
                {entry.image ? (
                  <img
                    src={entry.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                {initials(entry.author)}
              </span>
              <p data-part="text">
                <span data-part="author">{entry.author}</span> {entry.action}
                {entry.target ? (
                  <>
                    {" "}
                    <span data-part="target">{entry.target}</span>
                  </>
                ) : null}
              </p>
              <time data-part="time" dateTime={entry.dateTime}>
                {entry.time}
              </time>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
