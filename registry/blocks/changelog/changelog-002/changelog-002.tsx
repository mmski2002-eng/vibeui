import type { CSSProperties } from "react"

type Changelog002Change = {
  tag: string
  text: string
}

export type Changelog002Props = {
  version?: string
  date?: string
  title?: string
  summary?: string
  changes?: Changelog002Change[]
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Хайлайт одного релиза: крупная шапка с номером версии и датой, короткое
// резюме и разбивка изменений по типам (Добавлено / Исправлено / Изменено).
// Формат для «свежий релиз наверху страницы» — не лента истории, а анонс
// одной версии, где тип каждого пункта подписан тегом слева.
const STYLES = `
:where([data-vibeui-block="changelog-002"]){
--vibeui-changelog-002-bg:transparent;
--vibeui-changelog-002-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-changelog-002-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-changelog-002-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-changelog-002-panel:light-dark(oklch(0.98 0 0),oklch(0.19 0 0));
--vibeui-changelog-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-changelog-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-changelog-002-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="changelog-002"]{color-scheme:dark}
[data-vibeui-block="changelog-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-changelog-002-bg);color:var(--vibeui-changelog-002-ink);
font-family:var(--vibeui-changelog-002-font);
}
[data-vibeui-block="changelog-002"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="changelog-002"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.75rem;margin-bottom:1rem;
}
[data-vibeui-block="changelog-002"] [data-part="version"]{
font-family:var(--vibeui-changelog-002-mono);font-size:clamp(1.5rem,4cqi,2.25rem);font-weight:700;letter-spacing:-0.01em;
color:var(--vibeui-changelog-002-accent);
}
[data-vibeui-block="changelog-002"] [data-part="date"]{color:var(--vibeui-changelog-002-muted);font-size:0.875rem}
[data-vibeui-block="changelog-002"] [data-part="title"]{margin:0 0 0.5rem;font-size:1.375rem;line-height:1.2;letter-spacing:-0.02em;font-weight:700}
[data-vibeui-block="changelog-002"] [data-part="summary"]{margin:0 0 1.75rem;color:var(--vibeui-changelog-002-muted);font-size:1rem;line-height:1.6}
[data-vibeui-block="changelog-002"] [data-part="list"]{
list-style:none;margin:0;padding:0;display:grid;gap:0.75rem;
border-top:1px solid var(--vibeui-changelog-002-border);padding-top:1.5rem;
}
[data-vibeui-block="changelog-002"] [data-part="change"]{display:grid;grid-template-columns:auto 1fr;gap:0.75rem;align-items:baseline}
[data-vibeui-block="changelog-002"] [data-part="tag"]{
justify-self:start;min-width:6.5rem;text-align:center;
padding:0.1875rem 0.5rem;border-radius:0.375rem;font-size:0.6875rem;font-weight:700;
letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-changelog-002-accent);
background:color-mix(in oklab,var(--vibeui-changelog-002-accent) 12%,transparent);
}
[data-vibeui-block="changelog-002"] [data-part="text"]{font-size:0.9375rem;line-height:1.55}
@container (min-width: 40rem){
[data-vibeui-block="changelog-002"] [data-part="shell"]{padding:4rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="changelog-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHANGES: Changelog002Change[] = [
  {
    tag: "Добавлено",
    text: "Шесть новых категорий блоков: ошибки, команда, кейсы, логотипы.",
  },
  {
    tag: "Добавлено",
    text: "Встроенное меню у кнопки с раздельным действием.",
  },
  {
    tag: "Изменено",
    text: "Акцент интерфейса переведён на фирменный оранжевый.",
  },
  {
    tag: "Исправлено",
    text: "Выпадающее меню больше не обрезается краем карточки.",
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

/** Хайлайт одного релиза: версия крупно, резюме и изменения по типам. */
export function Changelog002({
  version = "v2.4.0",
  date = "6 сентября 2026",
  title = "Каталог блоков и фирменная палитра",
  summary = "Крупнейшее обновление за квартал: новые разделы блоков и единый оранжевый акцент во всём интерфейсе.",
  changes = DEFAULT_CHANGES,
  background = "",
  accent,
  className,
  style,
}: Changelog002Props) {
  const palette = {
    ...(accent ? { "--vibeui-changelog-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-changelog-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-changelog-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="changelog-002"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <span data-part="version">{version}</span>
            <span data-part="date">{date}</span>
          </div>
          <h2 data-part="title">{title}</h2>
          <p data-part="summary">{summary}</p>
          <ul data-part="list">
            {changes.map((change) => (
              <li key={change.text} data-part="change">
                <span data-part="tag">{change.tag}</span>
                <span data-part="text">{change.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
