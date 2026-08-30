import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Breadcrumb011Props = Omit<
  ComponentPropsWithoutRef<"nav">,
  "children" | "defaultValue"
> & {
  rootLabel?: string
  rootHref?: string
  siblings?: string[]
  defaultValue?: string
  label?: string
  accent?: string
}

// Идея компонента: последний уровень — не текст, а нативный select с
// соседями. Переключиться между «Договоры» и «Счета» можно на месте, не
// возвращаясь в родительский раздел. Select нативный: он сам умеет
// клавиатуру, поиск по первой букве и мобильный барабан выбора.
const STYLES = `
:where([data-vibeui-block="breadcrumb-011"]){
--vibeui-breadcrumb-011-surface:oklch(1 0 0);
--vibeui-breadcrumb-011-surface-border:oklch(0.91 0.006 265);
--vibeui-breadcrumb-011-fg:oklch(0.26 0.016 265);
--vibeui-breadcrumb-011-muted:oklch(0.56 0.014 265);
--vibeui-breadcrumb-011-border:oklch(0.9 0.006 265);
--vibeui-breadcrumb-011-bg:oklch(0.98 0.002 265);
--vibeui-breadcrumb-011-accent:oklch(0.55 0.17 265);
--vibeui-breadcrumb-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка: крошки — это текст, и на тёмной странице
   он обязан читаться без правки палитры проекта. */
[data-vibeui-block="breadcrumb-011"]{
box-sizing:border-box;padding:0.5rem 0.75rem;
background:var(--vibeui-breadcrumb-011-surface);
border:1px solid var(--vibeui-breadcrumb-011-surface-border);border-radius:0.625rem;
font-family:var(--vibeui-breadcrumb-011-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-011-muted);
}
[data-vibeui-block="breadcrumb-011"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-011"] li{display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="breadcrumb-011"] li + li::before{content:"/";color:oklch(0.78 0.01 265)}
[data-vibeui-block="breadcrumb-011"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-011"] a:hover{color:var(--vibeui-breadcrumb-011-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-011"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-011-accent);outline-offset:2px}
/* Нативный select: клавиатура, поиск по букве и мобильный барабан — даром. */
[data-vibeui-block="breadcrumb-011"] select{
appearance:none;cursor:pointer;
height:1.75rem;padding:0 1.5rem 0 0.5rem;
border:1px solid var(--vibeui-breadcrumb-011-border);border-radius:0.4375rem;
background:var(--vibeui-breadcrumb-011-bg);color:var(--vibeui-breadcrumb-011-fg);
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="breadcrumb-011"] select:focus-visible{outline:2px solid var(--vibeui-breadcrumb-011-accent);outline-offset:2px}
[data-vibeui-block="breadcrumb-011"] [data-part="picker"]{position:relative;display:inline-flex;align-items:center}
[data-vibeui-block="breadcrumb-011"] [data-part="caret"]{
position:absolute;right:0.5rem;width:0.375rem;height:0.375rem;pointer-events:none;
margin-top:-0.1875rem;
border-right:1.5px solid var(--vibeui-breadcrumb-011-muted);
border-bottom:1.5px solid var(--vibeui-breadcrumb-011-muted);
transform:rotate(45deg);
}
[data-vibeui-block="breadcrumb-011"] [data-part="hint"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="breadcrumb-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SIBLINGS = ["Договоры", "Счета", "Акты", "Доверенности"]

/**
 * Последний уровень — нативный select с соседними разделами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb011({
  rootLabel = "Документы",
  rootHref = "#",
  siblings = DEFAULT_SIBLINGS,
  defaultValue = "Счета",
  label = "Раздел",
  accent,
  className,
  style,
  ...props
}: Breadcrumb011Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-breadcrumb-011" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="breadcrumb-011"
        aria-label="Хлебные крошки"
        className={className}
        style={palette}
      >
        <ol>
          <li>
            <a href={rootHref}>{rootLabel}</a>
          </li>
          <li>
            <span data-part="picker">
              <label htmlFor={id} data-part="hint">
                {label}
              </label>
              <select id={id} defaultValue={defaultValue}>
                {siblings.map((sibling) => (
                  <option key={sibling} value={sibling}>
                    {sibling}
                  </option>
                ))}
              </select>
              <span data-part="caret" aria-hidden="true" />
            </span>
          </li>
        </ol>
      </nav>
    </>
  )
}
