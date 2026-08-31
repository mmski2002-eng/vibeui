import type { CSSProperties } from "react"

export type Menubar006Section = {
  label: string
  href?: string
  pages?: { label: string; href?: string; count?: number }[]
}

export type Menubar006Props = {
  sections?: Menubar006Section[]
  activeLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: строка меню приложения, в которой активный раздел не просто
// подсвечен, а раскрыт: вторая строка показывает страницы именно этого раздела.
// Так человек всегда видит, где он и что рядом, без единого выпадающего списка —
// значит, и без состояния, и без клиентского JS.
const STYLES = `
:where([data-vibeui-block="menubar-006"]){
--vibeui-menubar-006-bg:oklch(1 0 0);
--vibeui-menubar-006-sub:oklch(0.975 0.003 265);
--vibeui-menubar-006-fg:oklch(0.24 0.014 265);
--vibeui-menubar-006-muted:oklch(0.55 0.014 265);
--vibeui-menubar-006-border:oklch(0.9 0.006 265);
--vibeui-menubar-006-hover:oklch(0.55 0.02 265 / 9%);
--vibeui-menubar-006-accent:oklch(0.55 0.2 262);
--vibeui-menubar-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="menubar-006"]{
box-sizing:border-box;width:100%;max-width:40rem;overflow:hidden;
background:var(--vibeui-menubar-006-bg);color:var(--vibeui-menubar-006-fg);
border:1px solid var(--vibeui-menubar-006-border);border-radius:0.75rem;
font-family:var(--vibeui-menubar-006-font);
}
[data-vibeui-block="menubar-006"] [data-part="row"]{
display:flex;align-items:stretch;gap:0.125rem;padding:0 0.375rem;
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="menubar-006"] [data-part="row"]::-webkit-scrollbar{display:none}
[data-vibeui-block="menubar-006"] [data-part="tab"]{
position:relative;display:flex;align-items:center;white-space:nowrap;
padding:0.6875rem 0.625rem;text-decoration:none;
font-size:0.8125rem;color:var(--vibeui-menubar-006-muted);
}
[data-vibeui-block="menubar-006"] [data-part="tab"]:hover{color:var(--vibeui-menubar-006-fg)}
[data-vibeui-block="menubar-006"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-menubar-006-accent);outline-offset:-3px;border-radius:0.375rem}
/* Активный раздел помечен и цветом, и полосой: цвет один не читается в печати. */
[data-vibeui-block="menubar-006"] [data-part="tab"][aria-current="page"]{color:var(--vibeui-menubar-006-fg);font-weight:600}
[data-vibeui-block="menubar-006"] [data-part="tab"][aria-current="page"]::after{
content:"";position:absolute;left:0.5rem;right:0.5rem;bottom:0;height:2px;
border-radius:2px 2px 0 0;background:var(--vibeui-menubar-006-accent);
}
[data-vibeui-block="menubar-006"] [data-part="sub"]{
display:flex;align-items:center;gap:0.25rem;flex-wrap:wrap;
padding:0.5rem 0.75rem;
background:var(--vibeui-menubar-006-sub);
border-top:1px solid var(--vibeui-menubar-006-border);
}
[data-vibeui-block="menubar-006"] [data-part="page"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.25rem 0.5rem;border-radius:0.375rem;text-decoration:none;
font-size:0.75rem;color:var(--vibeui-menubar-006-muted);
}
[data-vibeui-block="menubar-006"] [data-part="page"]:hover{background:var(--vibeui-menubar-006-hover);color:var(--vibeui-menubar-006-fg)}
[data-vibeui-block="menubar-006"] [data-part="page"]:focus-visible{outline:2px solid var(--vibeui-menubar-006-accent);outline-offset:1px}
[data-vibeui-block="menubar-006"] [data-part="count"]{
font-variant-numeric:tabular-nums;font-size:0.6875rem;
padding:0.0625rem 0.3125rem;border-radius:999px;
background:var(--vibeui-menubar-006-hover);color:var(--vibeui-menubar-006-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menubar-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Menubar006Section[] = [
  {
    label: "Обзор",
    pages: [{ label: "Сводка" }, { label: "Активность" }],
  },
  {
    label: "Контент",
    pages: [
      { label: "Страницы", count: 24 },
      { label: "Записи", count: 138 },
      { label: "Медиа" },
      { label: "Черновики", count: 3 },
    ],
  },
  {
    label: "Оформление",
    pages: [{ label: "Темы" }, { label: "Шрифты" }, { label: "Цвета" }],
  },
  {
    label: "Настройки",
    pages: [{ label: "Общие" }, { label: "Домены" }, { label: "Доступ" }],
  },
]

/**
 * Строка меню приложения с активным разделом и его страницами во второй строке.
 * Один файл, ноль зависимостей, собственная палитра, клиентского JS нет.
 */
export function Menubar006({
  sections = DEFAULT_SECTIONS,
  activeLabel = "Контент",
  accent,
  className,
  style,
}: Menubar006Props) {
  const palette = {
    ...(accent ? { "--vibeui-menubar-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const active =
    sections.find((section) => section.label === activeLabel) ?? sections[0]

  return (
    <>
      <style href="vibeui-menubar-006" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="menubar-006"
        className={className}
        style={palette}
      >
        <nav data-part="row" aria-label="Разделы">
          {sections.map((section) => (
            <a
              key={section.label}
              data-part="tab"
              href={section.href ?? "#"}
              aria-current={section === active ? "page" : undefined}
            >
              {section.label}
            </a>
          ))}
        </nav>
        {active?.pages?.length ? (
          <nav data-part="sub" aria-label={`Раздел «${active.label}»`}>
            {active.pages.map((page) => (
              <a key={page.label} data-part="page" href={page.href ?? "#"}>
                {page.label}
                {page.count === undefined ? null : (
                  <span data-part="count">{page.count}</span>
                )}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </>
  )
}
