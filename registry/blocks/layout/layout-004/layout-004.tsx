import type { CSSProperties, ReactNode } from "react"

type Layout004Leaf = {
  label: string
  href: string
  current?: boolean
}

type Layout004Branch = {
  title: string
  links: Layout004Leaf[]
}

export type Layout004Props = {
  /** Своя статья вместо демонстрационной. */
  children?: ReactNode
  /** Дерево разделов слева. */
  tree?: Layout004Branch[]
  treeLabel?: string
  /** Оглавление текущей статьи справа. */
  toc?: Layout004Leaf[]
  tocLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Документация: дерево разделов слева, текст в центре, оглавление статьи
// справа. Основной материал прокручивается документом — один явно
// определённый scroll-root; боковые колонки закреплены sticky в пределах
// своей высоты. В узкой колонке дерево и оглавление становятся
// раскрытиями над статьёй, чтение остаётся обычным потоком. Без JS;
// активная глава передаётся данными (current), связь с прокруткой может
// добавить scrollspy принимающего проекта.
const STYLES = `
:where([data-vibeui-block="layout-004"]){
--vibeui-layout-004-bg:#ffffff;
--vibeui-layout-004-ink:#000000;
--vibeui-layout-004-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-layout-004-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-layout-004-panel:#f2f2f2;
--vibeui-layout-004-accent:#ff5900;
--vibeui-layout-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-layout-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="layout-004"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-layout-004-bg);color:var(--vibeui-layout-004-ink);
font-family:var(--vibeui-layout-004-font);
}
[data-vibeui-block="layout-004"] *{box-sizing:border-box}
[data-vibeui-block="layout-004"] [data-part="shell"]{
max-width:90rem;margin:0 auto;padding:1.5rem 1rem 3rem;
display:flex;flex-direction:column;gap:1rem;
}
[data-vibeui-block="layout-004"] [data-part="tree"],
[data-vibeui-block="layout-004"] [data-part="toc"]{
border:1px solid var(--vibeui-layout-004-line);
}
[data-vibeui-block="layout-004"] [data-part="tree"] summary,
[data-vibeui-block="layout-004"] [data-part="toc"] summary{
list-style:none;cursor:pointer;user-select:none;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.75rem 1rem;font-size:0.9375rem;font-weight:620;
}
[data-vibeui-block="layout-004"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="layout-004"] [data-part="tree"] summary::after,
[data-vibeui-block="layout-004"] [data-part="toc"] summary::after{
content:"";width:0.4375rem;height:0.4375rem;flex:none;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="layout-004"] [data-part="tree"][open] summary::after,
[data-vibeui-block="layout-004"] [data-part="toc"][open] summary::after{transform:rotate(225deg)}
[data-vibeui-block="layout-004"] [data-part="branch"]{padding:0 1rem 0.75rem}
[data-vibeui-block="layout-004"] [data-part="branch"] h3{
margin:0.75rem 0 0.25rem;font-size:0.75rem;font-weight:640;
letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-layout-004-muted);
}
[data-vibeui-block="layout-004"] [data-part="branch"] a{
display:block;padding:0.375rem 0.5rem;margin-left:-0.5rem;
color:var(--vibeui-layout-004-muted);text-decoration:none;
font-size:0.9375rem;line-height:1.4;
border-left:2px solid transparent;
transition:color .16s ease;
}
[data-vibeui-block="layout-004"] [data-part="branch"] a:hover{color:var(--vibeui-layout-004-ink)}
[data-vibeui-block="layout-004"] [data-part="branch"] a[aria-current="page"]{
color:var(--vibeui-layout-004-ink);font-weight:580;
border-left-color:var(--vibeui-layout-004-accent);
}
[data-vibeui-block="layout-004"] [data-part="toc-list"]{padding:0 1rem 0.75rem}
[data-vibeui-block="layout-004"] [data-part="toc-list"] a{
display:block;padding:0.3125rem 0.5rem;margin-left:-0.5rem;
color:var(--vibeui-layout-004-muted);text-decoration:none;
font-size:0.875rem;line-height:1.4;
border-left:2px solid transparent;
transition:color .16s ease;
}
[data-vibeui-block="layout-004"] [data-part="toc-list"] a:hover{color:var(--vibeui-layout-004-ink)}
[data-vibeui-block="layout-004"] [data-part="toc-list"] a[aria-current="true"]{
color:var(--vibeui-layout-004-ink);font-weight:560;
border-left-color:var(--vibeui-layout-004-accent);
}
[data-vibeui-block="layout-004"] [data-part="article"]{
min-width:0;max-width:46rem;
}
[data-vibeui-block="layout-004"] [data-part="article"] h1{
margin:0 0 1rem;font-size:clamp(1.75rem,4cqi,2.5rem);line-height:1.1;
letter-spacing:-0.02em;font-weight:680;
}
[data-vibeui-block="layout-004"] [data-part="article"] h2{
margin:2rem 0 0.75rem;font-size:1.375rem;letter-spacing:-0.015em;font-weight:650;
}
[data-vibeui-block="layout-004"] [data-part="article"] p{
margin:0 0 1rem;font-size:1rem;line-height:1.7;color:color-mix(in oklab,#000000 82%,#ffffff);
}
[data-vibeui-block="layout-004"] [data-part="callout"]{
margin:0 0 1rem;padding:0.875rem 1rem;
background:var(--vibeui-layout-004-panel);
border-left:3px solid var(--vibeui-layout-004-accent);
font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="layout-004"] [data-part="code"]{
margin:0 0 1rem;padding:1rem 1.125rem;overflow-x:auto;
background:#1a1a1a;color:#f2f2f2;
font-family:var(--vibeui-layout-004-mono);font-size:0.8125rem;line-height:1.6;
}
[data-vibeui-block="layout-004"] [data-part="code"] i{color:#ff5900;font-style:normal}
[data-vibeui-block="layout-004"] a:focus-visible,
[data-vibeui-block="layout-004"] summary:focus-visible{
outline:2px solid var(--vibeui-layout-004-accent);outline-offset:2px;
}
@container (min-width: 64rem){
[data-vibeui-block="layout-004"] [data-part="shell"]{
display:grid;grid-template-columns:15rem minmax(0,1fr) 13rem;
gap:2.5rem;padding:2rem 2rem 4rem;align-items:start;
}
[data-vibeui-block="layout-004"] [data-part="tree"],
[data-vibeui-block="layout-004"] [data-part="toc"]{
border:0;position:sticky;top:1rem;
}
[data-vibeui-block="layout-004"] [data-part="tree"] summary,
[data-vibeui-block="layout-004"] [data-part="toc"] summary{
pointer-events:none;padding:0 0 0.25rem;
font-size:0.75rem;font-weight:640;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-layout-004-muted);
}
[data-vibeui-block="layout-004"] [data-part="tree"] summary::after,
[data-vibeui-block="layout-004"] [data-part="toc"] summary::after{content:none}
[data-vibeui-block="layout-004"] [data-part="branch"],
[data-vibeui-block="layout-004"] [data-part="toc-list"]{padding:0}
[data-vibeui-block="layout-004"] [data-part="article"]{margin:0 auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="layout-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TREE: Layout004Branch[] = [
  {
    title: "Начало",
    links: [
      { label: "Установка", href: "#install" },
      { label: "Быстрый старт", href: "#quickstart", current: true },
      { label: "Конфигурация", href: "#config" },
    ],
  },
  {
    title: "Основы",
    links: [
      { label: "Маршруты", href: "#routes" },
      { label: "Данные", href: "#data" },
      { label: "Развёртывание", href: "#deploy" },
    ],
  },
]

const DEFAULT_TOC: Layout004Leaf[] = [
  { label: "Требования", href: "#requirements", current: true },
  { label: "Первый проект", href: "#first-project" },
  { label: "Структура файлов", href: "#structure" },
  { label: "Что дальше", href: "#next" },
]

function DemoArticle() {
  return (
    <>
      <h1>Быстрый старт</h1>
      <p>
        Эта страница показывает типографику документации: спокойная колонка
        текста шириной около 46rem, заметки, код и подзаголовки со своими
        якорями. Дерево слева и оглавление справа закреплены и не мешают
        чтению.
      </p>
      <div data-part="callout">
        Понадобится Node.js 20 и любой пакетный менеджер. Команды ниже
        показаны для npm.
      </div>
      <h2 id="requirements">Требования</h2>
      <p>
        Установите зависимости и создайте проект одной командой. Установка
        занимает меньше минуты и не требует конфигурации.
      </p>
      <pre data-part="code">
        <code>
          npm create pribor@latest my-app{"\n"}cd my-app{"\n"}npm run <i>dev</i>
        </code>
      </pre>
      <h2 id="first-project">Первый проект</h2>
      <p>
        После запуска сервер разработки доступен на локальном адресе. Правьте
        файлы — страница обновится сама. Длинный абзац здесь проверяет
        комфорт чтения кириллицы: строка не шире 75 знаков, интерлиньяж 1,7.
      </p>
    </>
  )
}

/** Каркас документации: дерево, статья и оглавление с закреплёнными колонками. */
export function Layout004({
  children,
  tree = DEFAULT_TREE,
  treeLabel = "Разделы",
  toc = DEFAULT_TOC,
  tocLabel = "На этой странице",
  accent,
  className,
  style,
}: Layout004Props) {
  const palette = {
    ...(accent ? { "--vibeui-layout-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-layout-004" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="layout-004" className={className} style={palette}>
        <div data-part="shell">
          <details data-part="tree" open>
            <summary>{treeLabel}</summary>
            <nav aria-label={treeLabel}>
              {tree.map((branch) => (
                <div data-part="branch" key={branch.title}>
                  <h3>{branch.title}</h3>
                  {branch.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      aria-current={link.current ? "page" : undefined}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </nav>
          </details>
          <article data-part="article">{children ?? <DemoArticle />}</article>
          <details data-part="toc" open>
            <summary>{tocLabel}</summary>
            <nav data-part="toc-list" aria-label={tocLabel}>
              {toc.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={link.current ? "true" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </>
  )
}
