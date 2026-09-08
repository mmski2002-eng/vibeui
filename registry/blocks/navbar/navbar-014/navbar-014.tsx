import type { CSSProperties } from "react"

type Navbar014Item = {
  label: string
  href: string
  hint: string
}

type Navbar014Column = {
  label: string
  items: Navbar014Item[]
}

type Navbar014Link = {
  label: string
  href: string
}

export type Navbar014Props = {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  brand?: string
  /** Раздел, под которым раскрывается мега-панель. */
  triggerLabel?: string
  columns?: Navbar014Column[]
  links?: Navbar014Link[]
  featureTitle?: string
  featureText?: string
  featureLinkLabel?: string
  featureHref?: string
  actionLabel?: string
  actionHref?: string
  /** Подпись навигации для скринридера: компонент несёт русскую. */
  navLabel?: string
  /** Витринный режим: панель раскрыта прямо в потоке, а не в слое поверх. */
  open?: boolean
  /** Идентификатор панели: две такие шапки на странице требуют разных. */
  id?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Мега-меню: под одним разделом раскрывается панель во всю ширину шапки —
// колонки ссылок с пояснениями плюс карточка-превью с картинкой-заглушкой.
// Раскрытие держится на :hover и :focus-within, поэтому клавиатура работает
// без обработчиков и компонент остаётся серверным.
//
// Витринный режим (open) кладёт панель в поток: на статичной миниатюре
// каталога видно именно раскрытое состояние, а не одну строку шапки.
const STYLES = `
:where([data-vibeui-block="navbar-014"]){
--vibeui-navbar-014-bg:light-dark(oklch(0.995 0 265),oklch(0.19 0 265));
--vibeui-navbar-014-ink:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-navbar-014-muted:light-dark(oklch(0.52 0 265),oklch(0.72 0 265));
--vibeui-navbar-014-border:light-dark(oklch(0.91 0 265),oklch(0.32 0 265));
--vibeui-navbar-014-panel:light-dark(oklch(0.985 0 265),oklch(0.23 0 265));
--vibeui-navbar-014-tile:light-dark(oklch(0.96 0 265),oklch(0.28 0 265));
--vibeui-navbar-014-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.76 0.14 39.8));
--vibeui-navbar-014-accent-fg:oklch(from var(--vibeui-navbar-014-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-navbar-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-014"]{color-scheme:dark}
[data-vibeui-block="navbar-014"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,18rem);
display:block;position:relative;
background:var(--vibeui-navbar-014-bg);color:var(--vibeui-navbar-014-ink);
border-bottom:1px solid var(--vibeui-navbar-014-border);
font-family:var(--vibeui-navbar-014-font);
}
[data-vibeui-block="navbar-014"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;
max-width:82rem;margin:0 auto;padding:0.8125rem 1rem;
}
[data-vibeui-block="navbar-014"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;flex:none;
color:var(--vibeui-navbar-014-ink);text-decoration:none;
font-size:1rem;font-weight:680;letter-spacing:-0.02em;
}
[data-vibeui-block="navbar-014"] [data-part="mark"]{
width:1.625rem;height:1.625rem;border-radius:0.5rem;
background:linear-gradient(140deg,var(--vibeui-navbar-014-accent),color-mix(in oklab,var(--vibeui-navbar-014-accent) 35%,white));
}
[data-vibeui-block="navbar-014"] [data-part="menu"]{
display:none;align-items:center;gap:0.125rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="navbar-014"] [data-part="trigger"]{
appearance:none;border:0;background:transparent;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
min-height:2.125rem;padding:0.3125rem 0.6875rem;border-radius:0.5rem;
font:inherit;font-size:0.875rem;font-weight:540;color:var(--vibeui-navbar-014-muted);
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-014"] [data-part="trigger"]::after{
content:"";width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:translateY(-1px) rotate(45deg);
transition:transform .18s ease;
}
[data-vibeui-block="navbar-014"]:has([data-part="trigger"]:hover) [data-part="trigger"],
[data-vibeui-block="navbar-014"]:has([data-part="trigger"]:focus-visible) [data-part="trigger"],
[data-vibeui-block="navbar-014"]:has([data-part="mega"]:hover) [data-part="trigger"],
[data-vibeui-block="navbar-014"]:has([data-part="mega"]:focus-within) [data-part="trigger"]{
color:var(--vibeui-navbar-014-ink);background:color-mix(in oklab,var(--vibeui-navbar-014-border) 50%,transparent);
}
[data-vibeui-block="navbar-014"]:has([data-part="trigger"]:hover) [data-part="trigger"]::after,
[data-vibeui-block="navbar-014"]:has([data-part="trigger"]:focus-visible) [data-part="trigger"]::after,
[data-vibeui-block="navbar-014"]:has([data-part="mega"]:hover) [data-part="trigger"]::after,
[data-vibeui-block="navbar-014"]:has([data-part="mega"]:focus-within) [data-part="trigger"]::after{transform:translateY(1px) rotate(225deg)}
[data-vibeui-block="navbar-014"] [data-part="plain"]{
display:inline-flex;align-items:center;min-height:2.125rem;padding:0.3125rem 0.6875rem;border-radius:0.5rem;
color:var(--vibeui-navbar-014-muted);text-decoration:none;font-size:0.875rem;font-weight:540;
transition:color .16s ease;
}
[data-vibeui-block="navbar-014"] [data-part="plain"]:hover{color:var(--vibeui-navbar-014-ink)}
[data-vibeui-block="navbar-014"] [data-part="action"]{
display:inline-flex;align-items:center;min-height:2.25rem;padding:0.3125rem 1rem;margin-left:auto;flex:none;
border-radius:0.625rem;background:var(--vibeui-navbar-014-accent);color:var(--vibeui-navbar-014-accent-fg);
text-decoration:none;font-size:0.875rem;font-weight:620;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-014"] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-014-accent) 86%,black)}
/* Панель тянется во всю ширину шапки, поэтому лежит рядом со строкой, а не
   внутри <li>: из <li> она не смогла бы выйти за пределы своего раздела,
   не поломав раскладку строки. Раскрытие связывает их :has() у корня. */
[data-vibeui-block="navbar-014"] [data-part="mega"]{
display:none;position:absolute;top:100%;left:0;right:0;z-index:30;
border-bottom:1px solid var(--vibeui-navbar-014-border);
background:var(--vibeui-navbar-014-panel);
box-shadow:0 32px 64px -40px light-dark(oklch(0.2 0 265 / 55%),oklch(0 0 0 / 70%));
opacity:0;visibility:hidden;transform:translateY(-0.5rem);
transition:opacity .2s ease,transform .2s ease,visibility .2s;
}
[data-vibeui-block="navbar-014"]:has([data-part="trigger"]:hover) [data-part="mega"],
[data-vibeui-block="navbar-014"]:has([data-part="trigger"]:focus-visible) [data-part="mega"],
[data-vibeui-block="navbar-014"]:has([data-part="mega"]:hover) [data-part="mega"],
[data-vibeui-block="navbar-014"]:has([data-part="mega"]:focus-within) [data-part="mega"]{
opacity:1;visibility:visible;transform:none;
}
/* Витринный режим: панель встаёт в поток под строкой шапки и раздвигает блок
   вниз, поэтому миниатюра каталога показывает раскрытое меню, а не полоску. */
[data-vibeui-block="navbar-014"] [data-part="mega"][data-open="true"]{
display:block;position:static;opacity:1;visibility:visible;transform:none;
border-bottom:0;border-top:1px solid var(--vibeui-navbar-014-border);box-shadow:none;
}
[data-vibeui-block="navbar-014"] [data-part="mega-inner"]{
display:grid;gap:1.25rem;
max-width:82rem;margin:0 auto;padding:1.25rem 1rem 1.5rem;
}
[data-vibeui-block="navbar-014"] [data-part="columns"]{
display:grid;gap:1.25rem 1.5rem;min-inline-size:0;
}
[data-vibeui-block="navbar-014"] [data-part="column"]{min-inline-size:0}
[data-vibeui-block="navbar-014"] [data-part="column-title"]{
margin:0 0 0.5rem;padding:0 0.5rem;
font-size:0.6875rem;font-weight:680;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-navbar-014-muted);
}
[data-vibeui-block="navbar-014"] [data-part="column-list"]{margin:0;padding:0;list-style:none;display:grid;gap:0.125rem}
[data-vibeui-block="navbar-014"] [data-part="link"]{
display:block;padding:0.4375rem 0.5rem;border-radius:0.625rem;
color:var(--vibeui-navbar-014-ink);text-decoration:none;
font-size:0.875rem;font-weight:600;line-height:1.3;
transition:background-color .16s ease;
}
[data-vibeui-block="navbar-014"] [data-part="link"]:hover{background:color-mix(in oklab,var(--vibeui-navbar-014-accent) 10%,transparent)}
[data-vibeui-block="navbar-014"] [data-part="hint"]{
display:block;margin-top:0.125rem;color:var(--vibeui-navbar-014-muted);
font-size:0.8125rem;font-weight:420;line-height:1.35;
}
[data-vibeui-block="navbar-014"] [data-part="feature"]{
display:block;min-inline-size:0;padding:0.75rem;border-radius:1rem;
border:1px solid var(--vibeui-navbar-014-border);background:var(--vibeui-navbar-014-tile);
color:var(--vibeui-navbar-014-ink);text-decoration:none;
transition:border-color .16s ease;
}
[data-vibeui-block="navbar-014"] [data-part="feature"]:hover{border-color:color-mix(in oklab,var(--vibeui-navbar-014-accent) 55%,var(--vibeui-navbar-014-border))}
/* Заглушка вместо фотографии: градиент из акцента, чтобы блок оставался
   одним файлом и не тянул за собой картинку. */
[data-vibeui-block="navbar-014"] [data-part="thumb"]{
position:relative;display:block;aspect-ratio:16 / 9;border-radius:0.75rem;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="navbar-014"] [data-part="thumb"][data-empty="true"]{background:
radial-gradient(120% 120% at 15% 15%,color-mix(in oklab,var(--vibeui-navbar-014-accent) 70%,white) 0%,transparent 55%),
linear-gradient(145deg,var(--vibeui-navbar-014-accent),color-mix(in oklab,var(--vibeui-navbar-014-accent) 45%,black));}
[data-vibeui-block="navbar-014"] [data-part="thumb"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="navbar-014"] [data-part="feature-title"]{
display:block;margin:0.625rem 0 0;font-size:0.9375rem;font-weight:660;letter-spacing:-0.01em;
}
[data-vibeui-block="navbar-014"] [data-part="feature-text"]{
display:block;margin:0.25rem 0 0;color:var(--vibeui-navbar-014-muted);
font-size:0.8125rem;font-weight:420;line-height:1.4;
}
[data-vibeui-block="navbar-014"] [data-part="feature-more"]{
display:inline-block;margin-top:0.5rem;
color:var(--vibeui-navbar-014-accent);font-size:0.8125rem;font-weight:620;
}
[data-vibeui-block="navbar-014"] a:focus-visible,
[data-vibeui-block="navbar-014"] button:focus-visible{outline:2px solid var(--vibeui-navbar-014-accent);outline-offset:2px}
@container (min-width: 34rem){
[data-vibeui-block="navbar-014"] [data-part="columns"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 52rem){
[data-vibeui-block="navbar-014"] [data-part="shell"]{padding:0.8125rem 2rem;gap:1.25rem}
[data-vibeui-block="navbar-014"] [data-part="menu"]{display:flex}
[data-vibeui-block="navbar-014"] [data-part="mega"]{display:block}
[data-vibeui-block="navbar-014"] [data-part="mega-inner"]{grid-template-columns:minmax(0,1fr) 19rem;gap:2rem;padding:1.5rem 2rem 1.75rem}
[data-vibeui-block="navbar-014"] [data-part="columns"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS: Navbar014Column[] = [
  {
    label: "Платформа",
    items: [
      {
        label: "Конструктор",
        href: "#builder",
        hint: "Собирайте страницы из готовых секций",
      },
      {
        label: "Дизайн-токены",
        href: "#tokens",
        hint: "Цвет, типографика и отступы в одном месте",
      },
      {
        label: "Аналитика",
        href: "#analytics",
        hint: "Воронки и события без отдельного скрипта",
      },
    ],
  },
  {
    label: "Решения",
    items: [
      {
        label: "Маркетингу",
        href: "#marketing",
        hint: "Посадочные под кампании за вечер",
      },
      {
        label: "Продуктовым командам",
        href: "#product",
        hint: "Одна библиотека на все интерфейсы",
      },
      {
        label: "Агентствам",
        href: "#agency",
        hint: "Несколько брендов в одном аккаунте",
      },
    ],
  },
  {
    label: "Ресурсы",
    items: [
      {
        label: "Документация",
        href: "#docs",
        hint: "Установка, темы и рецепты вёрстки",
      },
      {
        label: "Примеры",
        href: "#examples",
        hint: "Готовые страницы, которые можно скопировать",
      },
      {
        label: "Сообщество",
        href: "#community",
        hint: "Обсуждения, шаблоны и плагины",
      },
    ],
  },
]

const DEFAULT_LINKS: Navbar014Link[] = [
  { label: "Тарифы", href: "#pricing" },
  { label: "Блог", href: "#blog" },
]

/** Шапка с мега-меню: панель во всю ширину, колонки разделов и карточка-превью. */
export function Navbar014({
  brand = "Панорама",
  image = "",
  triggerLabel = "Продукт",
  columns = DEFAULT_COLUMNS,
  links = DEFAULT_LINKS,
  featureTitle = "Обновление: тёмная тема",
  featureText = "Как перевести библиотеку на две ветки темы за один вечер.",
  featureLinkLabel = "Читать разбор",
  featureHref = "#release",
  actionLabel = "Начать",
  actionHref = "#start",
  navLabel = "Основная навигация",
  open = false,
  id = "navbar-014",
  accent,
  className,
  style,
}: Navbar014Props) {
  const panelId = `${id}-mega`
  const palette = {
    ...(accent ? { "--vibeui-navbar-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-014" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <nav aria-label={navLabel}>
            <ul data-part="menu">
              <li data-part="section">
                <button
                  data-part="trigger"
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                >
                  {triggerLabel}
                </button>
              </li>
              {links.map((link) => (
                <li key={link.href}>
                  <a data-part="plain" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        </div>
        <nav
          data-part="mega"
          id={panelId}
          data-open={open || undefined}
          aria-label={triggerLabel}
        >
          <div data-part="mega-inner">
            <div data-part="columns">
              {columns.map((column) => (
                <section key={column.label} data-part="column">
                  <h2 data-part="column-title">{column.label}</h2>
                  <ul data-part="column-list">
                    {column.items.map((item) => (
                      <li key={item.href}>
                        <a data-part="link" href={item.href}>
                          {item.label}
                          <span data-part="hint">{item.hint}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
            <a data-part="feature" href={featureHref}>
              <span
                data-part="thumb"
                data-empty={image ? undefined : "true"}
                aria-hidden="true"
              >
                {image ? (
                  <img src={image} alt="" loading="lazy" decoding="async" />
                ) : null}
              </span>
              <span data-part="feature-title">{featureTitle}</span>
              <span data-part="feature-text">{featureText}</span>
              <span data-part="feature-more">{featureLinkLabel}</span>
            </a>
          </div>
        </nav>
      </header>
    </>
  )
}
