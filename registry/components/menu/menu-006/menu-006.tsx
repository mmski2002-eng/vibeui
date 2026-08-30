import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Menu006Section = {
  title: string
  items: { label: string; hint: string }[]
}

export type Menu006Props = Omit<ComponentPropsWithoutRef<"nav">, "children"> & {
  label?: string
  sections?: Menu006Section[]
  accent?: string
}

// Идея компонента: широкое меню навигации на details. Оно раскрывается в
// колонки с пояснениями: список из двадцати ссылок без подписей — это карта
// сайта, а не навигация. Раскрытие держит нативный details, поэтому меню
// работает с клавиатуры и без клиентского кода.
const STYLES = `
:where([data-vibeui-block="menu-006"]){
--vibeui-menu-006-bg:oklch(1 0 0);
--vibeui-menu-006-fg:oklch(0.24 0.014 265);
--vibeui-menu-006-muted:oklch(0.56 0.014 265);
--vibeui-menu-006-border:oklch(0.9 0.006 265);
--vibeui-menu-006-hover:oklch(0.97 0.003 265);
--vibeui-menu-006-accent:oklch(0.55 0.17 265);
--vibeui-menu-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="menu-006"]{
display:block;width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-menu-006-font);color:var(--vibeui-menu-006-fg);
}
[data-vibeui-block="menu-006"] details{position:relative}
[data-vibeui-block="menu-006"] summary{
list-style:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-menu-006-border);border-radius:0.625rem;
background:var(--vibeui-menu-006-bg);
font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="menu-006"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="menu-006"] summary:focus-visible{outline:2px solid var(--vibeui-menu-006-accent);outline-offset:2px}
[data-vibeui-block="menu-006"] [data-part="caret"]{
width:0.375rem;height:0.375rem;margin-top:-0.125rem;
border-right:1.5px solid var(--vibeui-menu-006-muted);
border-bottom:1.5px solid var(--vibeui-menu-006-muted);
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="menu-006"] details[open] [data-part="caret"]{transform:rotate(-135deg)}
/* Колонки с пояснениями: список из двадцати ссылок — это карта сайта. */
[data-vibeui-block="menu-006"] [data-part="panel"]{
position:absolute;top:calc(100% + 0.375rem);left:0;z-index:20;
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.875rem;
width:100%;box-sizing:border-box;padding:0.875rem;
border:1px solid var(--vibeui-menu-006-border);border-radius:0.875rem;
background:var(--vibeui-menu-006-bg);
box-shadow:0 20px 44px -24px oklch(0.2 0.02 265 / 55%);
}
[data-vibeui-block="menu-006"] [data-part="title"]{
margin:0 0 0.375rem;font-size:0.6875rem;font-weight:700;
letter-spacing:0.05em;text-transform:uppercase;color:var(--vibeui-menu-006-muted);
}
[data-vibeui-block="menu-006"] ul{display:flex;flex-direction:column;gap:0.125rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="menu-006"] a{
display:flex;flex-direction:column;gap:0.0625rem;
padding:0.375rem 0.5rem;border-radius:0.5rem;
color:inherit;text-decoration:none;
}
[data-vibeui-block="menu-006"] a:hover{background:var(--vibeui-menu-006-hover)}
[data-vibeui-block="menu-006"] a:focus-visible{outline:2px solid var(--vibeui-menu-006-accent);outline-offset:-2px}
[data-vibeui-block="menu-006"] [data-part="name"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="menu-006"] [data-part="hint"]{font-size:0.75rem;line-height:1.35;color:var(--vibeui-menu-006-muted)}
@container (max-width: 26rem){
[data-vibeui-block="menu-006"] [data-part="panel"]{grid-template-columns:minmax(0,1fr)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menu-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Menu006Section[] = [
  {
    title: "Продукт",
    items: [
      { label: "Каталог", hint: "Живое превью каждого компонента" },
      { label: "Блоки", hint: "Готовые секции лендинга" },
      { label: "Registry", hint: "Установка одной командой" },
    ],
  },
  {
    title: "Ресурсы",
    items: [
      { label: "Документация", hint: "Как устроен компонент внутри" },
      { label: "Инструкции для ИИ", hint: "Что копировать агенту" },
      { label: "Обновления", hint: "Что появилось за неделю" },
    ],
  },
]

/**
 * Широкое меню навигации на details: колонки с пояснениями к ссылкам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu006({
  label = "Продукт",
  sections = DEFAULT_SECTIONS,
  accent,
  className,
  style,
  ...props
}: Menu006Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-menu-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-menu-006" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="menu-006"
        aria-label={label}
        className={className}
        style={palette}
      >
        <details name={`${id}-menu`}>
          <summary>
            {label}
            <span data-part="caret" aria-hidden="true" />
          </summary>
          <div data-part="panel">
            {sections.map((section) => (
              <section key={section.title}>
                <h3 data-part="title">{section.title}</h3>
                <ul>
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a href="#">
                        <span data-part="name">{item.label}</span>
                        <span data-part="hint">{item.hint}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>
      </nav>
    </>
  )
}
