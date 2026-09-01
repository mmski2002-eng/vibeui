import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Collapsible010Section = {
  label: string
  items: string[]
  open?: boolean
}

export type Collapsible010Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  sections?: Collapsible010Section[]
  accent?: string
}

// Идея компонента: свёртки внутри карточки с ограниченной высотой. Как только
// у карточки появляется своя прокрутка, заголовок раскрытого раздела уезжает
// наверх и непонятно, что читаешь. Поэтому summary липнет к верху скролл-
// контейнера через position:sticky — прокрутка идёт у карточки, а не у окна,
// и заголовок остаётся на месте, пока не придёт следующий.
const STYLES = `
:where([data-vibeui-block="collapsible-010"]){
--vibeui-collapsible-010-bg:oklch(1 0 0);
--vibeui-collapsible-010-fg:oklch(0.24 0.014 265);
--vibeui-collapsible-010-muted:oklch(0.56 0.014 265);
--vibeui-collapsible-010-border:oklch(0.9 0.006 265);
--vibeui-collapsible-010-accent:oklch(0.55 0.2 300);
--vibeui-collapsible-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="collapsible-010"]{
display:flex;flex-direction:column;overflow:hidden;
box-sizing:border-box;width:100%;max-width:23rem;
background:var(--vibeui-collapsible-010-bg);color:var(--vibeui-collapsible-010-fg);
border:1px solid var(--vibeui-collapsible-010-border);border-radius:1rem;
font-family:var(--vibeui-collapsible-010-font);
}
[data-vibeui-block="collapsible-010"] [data-part="head"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.8125rem 0.875rem;border-bottom:1px solid var(--vibeui-collapsible-010-border);
font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="collapsible-010"] [data-part="total"]{
margin-left:auto;font-size:0.6875rem;font-weight:600;color:var(--vibeui-collapsible-010-muted);
}
/* Прокрутка живёт у карточки: только тогда sticky в ней имеет смысл. */
[data-vibeui-block="collapsible-010"] [data-part="scroll"]{
max-height:15rem;overflow-y:auto;overscroll-behavior:contain;
}
[data-vibeui-block="collapsible-010"] summary{
position:sticky;top:0;z-index:1;
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.875rem;cursor:pointer;list-style:none;
background:var(--vibeui-collapsible-010-bg);
border-bottom:1px solid var(--vibeui-collapsible-010-border);
font-size:0.75rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-collapsible-010-muted);
}
[data-vibeui-block="collapsible-010"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="collapsible-010"] summary:focus-visible{outline:2px solid var(--vibeui-collapsible-010-accent);outline-offset:-2px}
[data-vibeui-block="collapsible-010"] details[open] summary{color:var(--vibeui-collapsible-010-accent)}
[data-vibeui-block="collapsible-010"] [data-part="mark"]{
flex:none;margin-left:auto;width:0.375rem;height:0.375rem;
border-right:2px solid currentColor;border-bottom:2px solid currentColor;
transform:rotate(-45deg);transform-origin:60% 60%;transition:transform .18s ease;
}
[data-vibeui-block="collapsible-010"] details[open] [data-part="mark"]{transform:rotate(45deg)}
[data-vibeui-block="collapsible-010"] ul{list-style:none;margin:0;padding:0.375rem 0.5rem}
[data-vibeui-block="collapsible-010"] li{
padding:0.375rem 0.5rem;border-radius:0.5rem;
font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="collapsible-010"] li:hover{background:color-mix(in oklab,var(--vibeui-collapsible-010-accent) 8%,transparent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="collapsible-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Collapsible010Section[] = [
  {
    label: "Ввод",
    items: ["Поле ввода", "Автодополнение", "Комбобокс", "Переключатель"],
    open: true,
  },
  {
    label: "Отображение",
    items: ["Скелетон", "Таймлайн", "Дерево файлов", "Блок кода"],
    open: true,
  },
  {
    label: "Навигация",
    items: ["Вкладки", "Хлебные крошки", "Командная палитра", "Пагинация"],
  },
]

/**
 * Свёртки внутри карточки с прокруткой: заголовок раздела липнет к верху
 * скролл-контейнера. Один файл, ноль зависимостей, клиентского кода нет.
 */
export function Collapsible010({
  title = "Библиотека",
  sections = DEFAULT_SECTIONS,
  accent,
  className,
  style,
  ...props
}: Collapsible010Props) {
  const total = sections.reduce((sum, section) => sum + section.items.length, 0)

  const palette = {
    ...(accent ? { "--vibeui-collapsible-010-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-collapsible-010" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="collapsible-010"
        className={className}
        style={palette}
      >
        <header data-part="head">
          {title}
          <span data-part="total">{total} компонентов</span>
        </header>
        <div data-part="scroll">
          {sections.map((section) => (
            <details key={section.label} open={section.open}>
              <summary>
                {section.label}
                <span data-part="mark" aria-hidden="true" />
              </summary>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
