import type { ComponentProps, CSSProperties } from "react"

type NotFound005Page = { label: string; href: string }
type NotFound005Branch = { label: string; href: string; pages: NotFound005Page[] }

export type NotFound005Props = Omit<ComponentProps<"section">, "children"> & {
  code?: string
  title?: string
  description?: string
  rootLabel?: string
  rootHref?: string
  missingLabel?: string
  branches?: NotFound005Branch[]
  /** Цвет пропавшей страницы и линии к ней. */
  accent?: string
  /** Пусто — подложки нет, страница ложится на фон сайта. */
  background?: string
}

// Карта сайта, на которой видно, где дыра: корень, разделы и страницы
// соединены линиями, а на месте пропавшей — пунктирная карточка 404 с
// мигающей рамкой. Все остальные узлы — настоящие ссылки, так что схема
// одновременно объясняет ошибку и ведёт дальше.
const STYLES = `
:where([data-vibeui-block="not-found-005"]){
--vibeui-not-found-005-bg:transparent;
--vibeui-not-found-005-fg:light-dark(oklch(0.2 0.01 250),oklch(0.95 0.005 250));
--vibeui-not-found-005-muted:light-dark(oklch(0.52 0.01 250),oklch(0.72 0.01 250));
--vibeui-not-found-005-line:light-dark(oklch(0 0 0 / 14%),oklch(1 0 0 / 16%));
--vibeui-not-found-005-node:light-dark(oklch(1 0 0),oklch(0.22 0.01 250));
--vibeui-not-found-005-accent:light-dark(oklch(0.58 0.22 25),oklch(0.7 0.19 25));
--vibeui-not-found-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="not-found-005"]{color-scheme:dark}
[data-vibeui-block="not-found-005"]{display:block;background:var(--vibeui-not-found-005-bg);color:var(--vibeui-not-found-005-fg);font-family:var(--vibeui-not-found-005-font)}
[data-vibeui-block="not-found-005"] [data-part="layout"]{box-sizing:border-box;max-width:64rem;margin:0 auto;padding:3.5rem 1.25rem}
[data-vibeui-block="not-found-005"] [data-part="head"]{text-align:center}
[data-vibeui-block="not-found-005"] [data-part="code"]{margin:0;color:var(--vibeui-not-found-005-accent);font-family:ui-monospace,monospace;font-size:0.8125rem;font-weight:600}
[data-vibeui-block="not-found-005"] [data-part="title"]{margin:0.625rem 0 0;font-size:clamp(1.75rem,5cqi,2.5rem);font-weight:750;letter-spacing:-0.03em}
[data-vibeui-block="not-found-005"] [data-part="text"]{margin:0.75rem auto 0;max-width:32rem;color:var(--vibeui-not-found-005-muted);font-size:0.9375rem;line-height:1.55}
[data-vibeui-block="not-found-005"] [data-part="tree"]{display:flex;flex-direction:column;align-items:center;margin-top:2.5rem}
[data-vibeui-block="not-found-005"] [data-part="node"]{
display:inline-flex;align-items:center;gap:0.5rem;padding:0.5rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-not-found-005-node);box-shadow:0 0 0 1px var(--vibeui-not-found-005-line),0 0.375rem 1rem -0.75rem oklch(0 0 0 / 30%);
color:inherit;font-size:0.8125rem;font-weight:600;text-decoration:none;white-space:nowrap;transition:transform .2s ease,box-shadow .2s ease;
}
[data-vibeui-block="not-found-005"] [data-part="node"][href]:hover{transform:translateY(-2px);box-shadow:0 0 0 1px color-mix(in oklab,var(--vibeui-not-found-005-fg) 30%,transparent),0 0.75rem 1.5rem -0.75rem oklch(0 0 0 / 35%)}
[data-vibeui-block="not-found-005"] [data-part="node"][href]:focus-visible{outline:2px solid var(--vibeui-not-found-005-accent);outline-offset:2px}
[data-vibeui-block="not-found-005"] [data-part="node"][data-root]{background:var(--vibeui-not-found-005-fg);color:var(--vibeui-not-found-005-node)}
[data-vibeui-block="not-found-005"] [data-part="node"][data-missing]{
background:color-mix(in oklab,var(--vibeui-not-found-005-accent) 8%,var(--vibeui-not-found-005-node));color:var(--vibeui-not-found-005-accent);
box-shadow:none;outline:2px dashed var(--vibeui-not-found-005-accent);outline-offset:-2px;animation:vibeui-not-found-005-blink 1.6s steps(2) infinite;
}
@keyframes vibeui-not-found-005-blink{50%{outline-color:transparent}}
[data-vibeui-block="not-found-005"] [data-part="stem"]{width:1px;height:1.5rem;background:var(--vibeui-not-found-005-line)}
[data-vibeui-block="not-found-005"] [data-part="branches"]{
position:relative;display:grid;grid-template-columns:repeat(var(--vibeui-not-found-005-n),minmax(0,1fr));gap:0.75rem;width:100%;margin:0;padding:1.5rem 0 0;list-style:none;
}
[data-vibeui-block="not-found-005"] [data-part="branches"]::before{
content:"";position:absolute;top:0;left:calc(50% / var(--vibeui-not-found-005-n));right:calc(50% / var(--vibeui-not-found-005-n));height:1px;background:var(--vibeui-not-found-005-line);
}
[data-vibeui-block="not-found-005"] [data-part="branch"]{position:relative;display:flex;flex-direction:column;align-items:center;gap:0.5rem}
[data-vibeui-block="not-found-005"] [data-part="branch"]::before{content:"";position:absolute;top:-1.5rem;left:50%;width:1px;height:1.5rem;background:var(--vibeui-not-found-005-line)}
[data-vibeui-block="not-found-005"] [data-part="pages"]{display:flex;flex-direction:column;align-items:center;gap:0.375rem;margin:0.25rem 0 0;padding:0;list-style:none}
[data-vibeui-block="not-found-005"] [data-part="pages"] [data-part="node"]{font-weight:500;color:var(--vibeui-not-found-005-muted)}
[data-vibeui-block="not-found-005"] [data-part="pages"] [data-part="node"][data-missing]{color:var(--vibeui-not-found-005-accent);font-weight:700}
@container (max-width:36rem){
[data-vibeui-block="not-found-005"] [data-part="branches"]{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:1.5rem}
[data-vibeui-block="not-found-005"] [data-part="branches"]::before{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="not-found-005"] *{animation:none!important;transition:none!important}}
`

const BRANCHES: NotFound005Branch[] = [
  { label: "Каталог", href: "/components", pages: [{ label: "Блоки", href: "/blocks" }, { label: "Анимации", href: "/animations" }] },
  { label: "Тарифы", href: "/pricing", pages: [{ label: "Сравнение", href: "/pricing#compare" }] },
  { label: "Блог", href: "/blog", pages: [] },
  { label: "Контакты", href: "/contact", pages: [{ label: "Поддержка", href: "/contact#support" }] },
]

export function NotFound005({
  code = "GET /old-page → 404",
  title = "Этой страницы нет на карте",
  description = "Мы проверили всю структуру сайта — вот что у нас есть. Выберите ближайший раздел.",
  rootLabel = "Главная",
  rootHref = "/",
  missingLabel = "404",
  branches = BRANCHES,
  accent,
  background,
  className,
  style,
  ...props
}: NotFound005Props) {
  // Пропавшая страница встаёт в раздел без собственных страниц, иначе в первый.
  const brokenIndex = Math.max(0, branches.findIndex((branch) => branch.pages.length === 0))
  const palette = {
    ...(accent ? { "--vibeui-not-found-005-accent": accent } : null),
    ...(background ? { "--vibeui-not-found-005-bg": background } : null),
    "--vibeui-not-found-005-n": branches.length,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-not-found-005" precedence="medium">
        {STYLES}
      </style>
      <section {...props} data-vibeui-block="not-found-005" className={className} style={palette}>
        <div data-part="layout">
          <div data-part="head">
            <p data-part="code">{code}</p>
            <h1 data-part="title">{title}</h1>
            <p data-part="text">{description}</p>
          </div>
          <nav data-part="tree" aria-label={title}>
            <a data-part="node" data-root="" href={rootHref}>
              {rootLabel}
            </a>
            <span data-part="stem" aria-hidden="true" />
            <ul data-part="branches">
              {branches.map((branch, index) => (
                <li key={branch.href} data-part="branch">
                  <a data-part="node" href={branch.href}>
                    {branch.label}
                  </a>
                  <ul data-part="pages">
                    {branch.pages.map((page) => (
                      <li key={page.href}>
                        <a data-part="node" href={page.href}>
                          {page.label}
                        </a>
                      </li>
                    ))}
                    {index === brokenIndex ? (
                      <li>
                        <span data-part="node" data-missing="">
                          {missingLabel}
                        </span>
                      </li>
                    ) : null}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </>
  )
}
