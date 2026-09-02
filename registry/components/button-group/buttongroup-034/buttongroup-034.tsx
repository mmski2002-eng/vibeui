import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup034Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  title?: string
  subtitle?: string
  actions?: string[]
  primary?: string
  label?: string
  /** Текст тела карточки: компонент несёт русский. */
  body?: string
  /** Пусто — подложка карточки остаётся своей, по теме окружения. */
  background?: string
  accent?: string
}

// Идея компонента: группа кнопок в шапке карточки, которая знает своё место.
// Порог перестроения берётся из ширины самой карточки (container-type на
// корне), а не из ширины окна: карточка часто стоит в узкой колонке широкого
// экрана, и media query там врёт. Раскладка лежит на внутреннем shell —
// правило внутри @container действует на потомков контейнера, но не на сам
// контейнер, это ловушка, а не деталь. По умолчанию раскладка узкая:
// без поддержки контейнеров шапка останется рабочей, просто в две строки.
const STYLES = `
:where([data-vibeui-block="buttongroup-034"]){
--vibeui-buttongroup-034-surface:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-buttongroup-034-fg:light-dark(oklch(0.24 0.016 265),oklch(0.95 0.005 265));
--vibeui-buttongroup-034-muted:light-dark(oklch(0.55 0.014 265),oklch(0.72 0.012 265));
--vibeui-buttongroup-034-border:light-dark(oklch(0.9 0.006 265),oklch(0.4 0.012 265));
--vibeui-buttongroup-034-hover:light-dark(oklch(0.97 0.004 265),oklch(0.33 0.014 265));
--vibeui-buttongroup-034-accent:light-dark(oklch(0.5 0.16 265),oklch(0.62 0.17 265));
--vibeui-buttongroup-034-accent-strong:light-dark(oklch(0.45 0.16 265),oklch(0.7 0.16 265));
--vibeui-buttongroup-034-on-accent:light-dark(oklch(0.99 0.004 265),oklch(0.16 0.02 265));
--vibeui-buttongroup-034-radius:0.5rem;
--vibeui-buttongroup-034-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="buttongroup-034"]{
box-sizing:border-box;display:block;width:100%;max-width:34rem;
border:1px solid var(--vibeui-buttongroup-034-border);border-radius:0.875rem;
background:var(--vibeui-buttongroup-034-surface);
font-family:var(--vibeui-buttongroup-034-font);
}
[data-vibeui-block="buttongroup-034"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-034"] [data-part="shell"]{
display:flex;flex-direction:column;align-items:stretch;gap:0.75rem;
padding:0.875rem 1rem;
border-bottom:1px solid var(--vibeui-buttongroup-034-border);
}
[data-vibeui-block="buttongroup-034"] [data-part="heading"]{margin:0;min-width:0}
[data-vibeui-block="buttongroup-034"] [data-part="title"]{
display:block;color:var(--vibeui-buttongroup-034-fg);
font-size:0.9375rem;font-weight:700;line-height:1.3;
}
[data-vibeui-block="buttongroup-034"] [data-part="subtitle"]{
display:block;margin-top:0.125rem;
color:var(--vibeui-buttongroup-034-muted);
font-size:0.75rem;line-height:1.4;
}
[data-vibeui-block="buttongroup-034"] [data-part="group"]{
display:flex;isolation:isolate;
}
[data-vibeui-block="buttongroup-034"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;flex:1 1 auto;
display:inline-flex;align-items:center;justify-content:center;
height:2.125rem;padding:0 0.75rem;margin-inline-start:-1px;
border:1px solid var(--vibeui-buttongroup-034-border);
background:var(--vibeui-buttongroup-034-surface);
color:var(--vibeui-buttongroup-034-fg);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-034"] button:first-child{
margin-inline-start:0;
border-start-start-radius:var(--vibeui-buttongroup-034-radius);
border-end-start-radius:var(--vibeui-buttongroup-034-radius);
}
[data-vibeui-block="buttongroup-034"] button:last-child{
border-start-end-radius:var(--vibeui-buttongroup-034-radius);
border-end-end-radius:var(--vibeui-buttongroup-034-radius);
}
[data-vibeui-block="buttongroup-034"] button:hover{background:var(--vibeui-buttongroup-034-hover)}
[data-vibeui-block="buttongroup-034"] [data-part="primary"]{
background:var(--vibeui-buttongroup-034-accent);
border-color:var(--vibeui-buttongroup-034-accent);
color:var(--vibeui-buttongroup-034-on-accent);
}
[data-vibeui-block="buttongroup-034"] [data-part="primary"]:hover{
background:var(--vibeui-buttongroup-034-accent-strong);
}
[data-vibeui-block="buttongroup-034"] button:focus-visible{
z-index:2;outline:2px solid var(--vibeui-buttongroup-034-accent);outline-offset:1px;
}
[data-vibeui-block="buttongroup-034"] [data-part="body"]{
padding:0.875rem 1rem 1rem;
color:var(--vibeui-buttongroup-034-muted);
font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="buttongroup-034"] [data-part="body"] p{margin:0}
/* Порог от ширины карточки: в узкой колонке шапка складывается сама. */
@container (min-width: 30rem){
[data-vibeui-block="buttongroup-034"] [data-part="shell"]{flex-direction:row;align-items:center;justify-content:space-between}
[data-vibeui-block="buttongroup-034"] [data-part="group"]{flex:none}
[data-vibeui-block="buttongroup-034"] button{flex:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-034"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS = ["Экспорт", "Настроить"]

const DEFAULT_BODY =
  "За неделю 128 заказов на 1 240 000 ₽. Средний чек вырос на 4 % по сравнению с прошлой неделей."

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Шапка карточки с группой действий, складывающейся по ширине самой карточки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup034({
  title = "Отчёт по продажам",
  subtitle = "Обновлён 12 минут назад",
  actions = DEFAULT_ACTIONS,
  primary = "Обновить",
  label = "Действия над отчётом",
  body = DEFAULT_BODY,
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup034Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-034-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-034-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-034" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="buttongroup-034"
        className={className}
        style={palette}
      >
        <header data-part="shell">
          <h3 data-part="heading">
            <span data-part="title">{title}</span>
            <span data-part="subtitle">{subtitle}</span>
          </h3>
          <div data-part="group" role="group" aria-label={label}>
            {actions.map((action) => (
              <button key={action} type="button">
                {action}
              </button>
            ))}
            <button type="button" data-part="primary">
              {primary}
            </button>
          </div>
        </header>
        <div data-part="body">
          <p>{body}</p>
        </div>
      </section>
    </>
  )
}
