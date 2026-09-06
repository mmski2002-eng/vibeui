import type { CSSProperties } from "react"

export type Dashboard081Section = {
  name: string
  summary: string
  articles: number
  updated: string
}

export type Dashboard081Article = {
  title: string
  section: string
  views: string
  helpful: string
  stale?: boolean
}

export type Dashboard081Props = {
  title?: string
  searchLabel?: string
  sections?: Dashboard081Section[]
  popular?: Dashboard081Article[]
  popularTitle?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Хлебные крошки по ключам root и current. */
  crumbsText?: Record<string, string>
  /** Кнопка поиска. */
  searchButtonLabel?: string
  /** Заголовок колонки разделов. */
  sectionsTitle?: string
  /** Счётчик статей раздела: {articles}. */
  articlesText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: базу знаний открывают либо с конкретным вопросом, либо чтобы
// понять, что вообще есть. Поэтому сверху поиск, а под ним разделы карточками
// с одной строкой о содержимом: голое имя раздела вроде «Общее» ничего не
// сообщает. Дата обновления стоит у каждого раздела — устаревшая инструкция
// хуже отсутствующей, и это единственный сигнал, по которому её можно
// заподозрить. В колонке популярного рядом со статьёй стоит доля «помогло»:
// статья с тысячей просмотров и оценкой 31 % — это не популярная статья,
// а нерешённая проблема, и её помечают отдельно.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-081"]){
--vibeui-dashboard-081-bg:transparent;
/* Карточка раздела и строка статьи: подложка самого блока прозрачна. */
--vibeui-dashboard-081-card:light-dark(oklch(1 0 0),oklch(0.26 0 235));
--vibeui-dashboard-081-fg:light-dark(oklch(0.21 0 235),oklch(0.94 0 235));
--vibeui-dashboard-081-muted:light-dark(oklch(0.54 0 235),oklch(0.72 0 235));
--vibeui-dashboard-081-border:light-dark(oklch(0.91 0 235),oklch(0.36 0 235));
--vibeui-dashboard-081-accent:light-dark(oklch(0.5 0.14 235),oklch(0.74 0.13 235));
--vibeui-dashboard-081-accent-line:light-dark(oklch(0.78 0.07 235),oklch(0.54 0.1 235));
--vibeui-dashboard-081-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 235));
--vibeui-dashboard-081-soft:light-dark(oklch(0.965 0 235),oklch(0.3 0.035 235));
--vibeui-dashboard-081-warn:light-dark(oklch(0.52 0.12 60),oklch(0.82 0.13 60));
--vibeui-dashboard-081-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-081"]{color-scheme:dark}
[data-vibeui-block="dashboard-081"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-081-bg);
color:var(--vibeui-dashboard-081-fg);
font-family:var(--vibeui-dashboard-081-sans);
border:1px solid var(--vibeui-dashboard-081-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-081"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-081"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-081"] h2{margin:0;font-size:1.1875rem;font-weight:750;letter-spacing:-0.02em}
[data-vibeui-block="dashboard-081"] h3{margin:0 0 0.5rem;font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-081-muted)}
[data-vibeui-block="dashboard-081"] [data-part="search"]{
display:flex;gap:0.4375rem;align-items:center;
padding:0.5rem 0.625rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-081-card);border:1px solid var(--vibeui-dashboard-081-border);
}
[data-vibeui-block="dashboard-081"] [data-part="search"]:focus-within{border-color:var(--vibeui-dashboard-081-accent-line)}
[data-vibeui-block="dashboard-081"] input[type="search"]{
flex:1 1 auto;min-width:0;font:inherit;font-size:0.875rem;border:0;outline:none;
background:transparent;color:inherit;padding:0.1875rem;
}
[data-vibeui-block="dashboard-081"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.375rem 0.8125rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-081-accent);color:var(--vibeui-dashboard-081-on-accent);
}
[data-vibeui-block="dashboard-081"] [data-part="cols"]{display:grid;grid-template-columns:1fr;gap:0.875rem;align-items:start}
[data-vibeui-block="dashboard-081"] [data-part="sections"]{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0.5rem}
[data-vibeui-block="dashboard-081"] [data-part="sections"] a{
display:flex;flex-direction:column;gap:0.1875rem;text-decoration:none;color:inherit;
padding:0.75rem;border-radius:0.875rem;height:100%;
background:var(--vibeui-dashboard-081-card);border:1px solid var(--vibeui-dashboard-081-border);
}
[data-vibeui-block="dashboard-081"] [data-part="sections"] a:hover{border-color:var(--vibeui-dashboard-081-accent-line)}
[data-vibeui-block="dashboard-081"] [data-part="sections"] b{font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-081"] [data-part="sections"] p{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-081-muted);line-height:1.4}
[data-vibeui-block="dashboard-081"] [data-part="smeta"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;margin-top:0.1875rem;
font-size:0.625rem;color:var(--vibeui-dashboard-081-muted);
}
[data-vibeui-block="dashboard-081"] [data-part="count"]{
font-weight:750;padding:0.0625rem 0.3125rem;border-radius:0.25rem;
background:var(--vibeui-dashboard-081-soft);color:color-mix(in oklab,var(--vibeui-dashboard-081-accent) 85%,light-dark(black,white));
}
[data-vibeui-block="dashboard-081"] [data-part="popular"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.3125rem}
[data-vibeui-block="dashboard-081"] [data-part="popular"] a{
display:block;text-decoration:none;color:inherit;
padding:0.5rem 0.625rem;border-radius:0.6875rem;
background:var(--vibeui-dashboard-081-card);border:1px solid var(--vibeui-dashboard-081-border);
}
[data-vibeui-block="dashboard-081"] [data-part="popular"] a:hover{background:var(--vibeui-dashboard-081-soft)}
[data-vibeui-block="dashboard-081"] [data-part="popular"] b{display:block;font-size:0.8125rem;font-weight:700;line-height:1.35}
[data-vibeui-block="dashboard-081"] [data-part="ameta"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;margin-top:0.1875rem;
font-size:0.625rem;color:var(--vibeui-dashboard-081-muted);
}
[data-vibeui-block="dashboard-081"] [data-part="bad"]{color:var(--vibeui-dashboard-081-warn);font-weight:700}
[data-vibeui-block="dashboard-081"] [data-part="crumbs"]{
margin:0;display:flex;flex-wrap:wrap;gap:0.25rem;font-size:0.6875rem;color:var(--vibeui-dashboard-081-muted);
}
[data-vibeui-block="dashboard-081"] [data-part="crumbs"] a{color:inherit}
[data-vibeui-block="dashboard-081"] :is(a,button,input):focus-visible{
outline:2px solid var(--vibeui-dashboard-081-accent);outline-offset:2px;
}
@container (min-width: 36rem){
[data-vibeui-block="dashboard-081"] [data-part="sections"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 54rem){
[data-vibeui-block="dashboard-081"] [data-part="cols"]{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr)}
}
`

const DEFAULT_SECTIONS: Dashboard081Section[] = [
  {
    name: "Первые шаги",
    summary:
      "Как завести рабочее пространство, пригласить команду и завести первую заявку.",
    articles: 12,
    updated: "обновлён 3 дня назад",
  },
  {
    name: "Импорт и данные",
    summary:
      "Сопоставление колонок, правила валидации, дубликаты и восстановление удалённого.",
    articles: 24,
    updated: "обновлён вчера",
  },
  {
    name: "Отчёты",
    summary:
      "Готовые отчёты, расписание выгрузок, форматы файлов и ограничения на объём.",
    articles: 18,
    updated: "обновлён 2 недели назад",
  },
  {
    name: "Доступ и роли",
    summary:
      "Роли, права на разделы, двухфакторная проверка и журнал действий.",
    articles: 15,
    updated: "обновлён месяц назад",
  },
  {
    name: "Интеграции и API",
    summary:
      "Ключи доступа, вебхуки, подписки на события и ограничения частоты.",
    articles: 31,
    updated: "обновлён 5 дней назад",
  },
  {
    name: "Оплата",
    summary: "Тарифы, счета, закрывающие документы и смена реквизитов.",
    articles: 9,
    updated: "обновлён 4 месяца назад",
  },
]

const DEFAULT_POPULAR: Dashboard081Article[] = [
  {
    title: "Почему импорт CSV обрывается на середине",
    section: "Импорт и данные",
    views: "4 210 просмотров",
    helpful: "помогло 78 %",
  },
  {
    title: "Как выдать доступ подрядчику только к одному проекту",
    section: "Доступ и роли",
    views: "3 880 просмотров",
    helpful: "помогло 84 %",
  },
  {
    title: "Отчёт собирается дольше пяти минут",
    section: "Отчёты",
    views: "2 940 просмотров",
    helpful: "помогло 31 %",
    stale: true,
  },
  {
    title: "Восстановить удалённую заявку вместе с вложениями",
    section: "Импорт и данные",
    views: "2 106 просмотров",
    helpful: "помогло 91 %",
  },
  {
    title: "Куда приходят закрывающие документы",
    section: "Оплата",
    views: "1 740 просмотров",
    helpful: "помогло 66 %",
  },
]

const CRUMBS_TEXT: Record<string, string> = {
  root: "Поддержка",
  current: "База знаний",
}

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
 * Страница базы знаний с разделами: поиск, карточки разделов с описанием
 * содержимого и датой обновления, колонка популярных статей с долей «помогло».
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard081({
  title = "База знаний",
  searchLabel = "Найти статью: импорт, роли, отчёты…",
  sections = DEFAULT_SECTIONS,
  popular = DEFAULT_POPULAR,
  popularTitle = "Чаще всего читают",
  accent,
  background = "",
  crumbsText = CRUMBS_TEXT,
  searchButtonLabel = "Найти",
  sectionsTitle = "Разделы",
  articlesText = "{articles} статей",
  className,
  style,
}: Dashboard081Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-081-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-081-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const crumbs = { ...CRUMBS_TEXT, ...crumbsText }

  return (
    <>
      <style href="vibeui-dashboard-081" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-081"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <p data-part="crumbs">
              <a href="#dashboard-081">{crumbs.root}</a>
              <span aria-hidden="true">/</span>
              <span>{crumbs.current}</span>
            </p>
            <h2>{title}</h2>
          </div>

          <form data-part="search" role="search" action="#dashboard-081">
            <input
              type="search"
              placeholder={searchLabel}
              aria-label={searchLabel}
            />
            <button type="submit" data-part="go">
              {searchButtonLabel}
            </button>
          </form>

          <div data-part="cols">
            <div>
              <h3>{sectionsTitle}</h3>
              <ul data-part="sections">
                {sections.map((section) => (
                  <li key={section.name}>
                    <a href="#dashboard-081">
                      <b>{section.name}</b>
                      <p>{section.summary}</p>
                      <span data-part="smeta">
                        <span data-part="count">
                          {articlesText.replace(
                            "{articles}",
                            String(section.articles),
                          )}
                        </span>
                        <span>{section.updated}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>{popularTitle}</h3>
              <ul data-part="popular">
                {popular.map((article) => (
                  <li key={article.title}>
                    <a href="#dashboard-081">
                      <b>{article.title}</b>
                      <span data-part="ameta">
                        <span>{article.section}</span>
                        <span>{article.views}</span>
                        <span data-part={article.stale ? "bad" : undefined}>
                          {article.helpful}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
