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
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Пусто — подложки нет, крошки лежат прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: последний уровень — не текст, а нативный select с
// соседями. Переключиться между «Договоры» и «Счета» можно на месте, не
// возвращаясь в родительский раздел. Select нативный: он сам умеет
// клавиатуру, поиск по первой букве и мобильный барабан выбора.
//
// Тема берётся из color-scheme окружения через light-dark(): крошки темнеют
// вместе со страницей, собственная заливка остаётся только у поля выбора.
const STYLES = `
:where([data-vibeui-block="breadcrumb-011"]){
--vibeui-breadcrumb-011-fg:light-dark(oklch(0.26 0.016 265),oklch(0.94 0.008 265));
--vibeui-breadcrumb-011-muted:light-dark(oklch(0.56 0.014 265),oklch(0.7 0.012 265));
--vibeui-breadcrumb-011-sep:light-dark(oklch(0.78 0.01 265),oklch(0.5 0.012 265));
--vibeui-breadcrumb-011-border:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.012 265));
--vibeui-breadcrumb-011-field:light-dark(oklch(0.98 0.002 265),oklch(0.29 0.012 265));
--vibeui-breadcrumb-011-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-breadcrumb-011-bg:transparent;
--vibeui-breadcrumb-011-pad:0;
--vibeui-breadcrumb-011-radius:0;
--vibeui-breadcrumb-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="breadcrumb-011"]{
box-sizing:border-box;padding:var(--vibeui-breadcrumb-011-pad);
background:var(--vibeui-breadcrumb-011-bg);
border-radius:var(--vibeui-breadcrumb-011-radius);
font-family:var(--vibeui-breadcrumb-011-font);font-size:0.8125rem;line-height:1.4;
color:var(--vibeui-breadcrumb-011-muted);
}
[data-vibeui-block="breadcrumb-011"] ol{
display:flex;flex-wrap:wrap;align-items:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="breadcrumb-011"] li{display:inline-flex;align-items:center;gap:0.4375rem}
[data-vibeui-block="breadcrumb-011"] li + li::before{content:"/";color:var(--vibeui-breadcrumb-011-sep)}
[data-vibeui-block="breadcrumb-011"] a{color:inherit;text-decoration:none;border-radius:0.25rem}
[data-vibeui-block="breadcrumb-011"] a:hover{color:var(--vibeui-breadcrumb-011-fg);text-decoration:underline;text-underline-offset:3px}
[data-vibeui-block="breadcrumb-011"] a:focus-visible{outline:2px solid var(--vibeui-breadcrumb-011-accent);outline-offset:2px}
/* Нативный select: клавиатура, поиск по букве и мобильный барабан — даром. */
[data-vibeui-block="breadcrumb-011"] select{
appearance:none;cursor:pointer;
height:1.75rem;padding:0 1.5rem 0 0.5rem;
border:1px solid var(--vibeui-breadcrumb-011-border);border-radius:0.4375rem;
background:var(--vibeui-breadcrumb-011-field);color:var(--vibeui-breadcrumb-011-fg);
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
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Последний уровень — нативный select с соседними разделами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Breadcrumb011({
  rootLabel = "Документы",
  rootHref = "#",
  siblings = DEFAULT_SIBLINGS,
  defaultValue = "Счета",
  label = "Раздел",
  navLabel = "Хлебные крошки",
  background = "",
  accent,
  className,
  style,
  ...props
}: Breadcrumb011Props) {
  const id = useId()
  const palette = {
    ...(accent ? { "--vibeui-breadcrumb-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-breadcrumb-011-bg": background,
          "--vibeui-breadcrumb-011-pad": "0.5rem 0.75rem",
          "--vibeui-breadcrumb-011-radius": "0.625rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        aria-label={navLabel}
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
