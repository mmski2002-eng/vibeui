import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  primary?: string
  actions?: string[]
  moreLabel?: string
  /** Имя кнопки переполнения вслух: {more} подставляется подписью moreLabel. */
  moreDescription?: string
  label?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: группа сама решает, сколько кнопок показать. Порог берётся
// от собственной ширины через container query, а не от ширины окна: в узкой
// колонке широкого экрана группа обязана схлопнуться так же, как на телефоне.
// Раскладка лежит на внутреннем shell — правило внутри @container действует
// на потомков контейнера, но не на сам контейнер. Спрятанные действия
// уезжают в details/summary, поэтому раскрытие работает без клиентского JS.
const STYLES = `
:where([data-vibeui-block="buttongroup-009"]){
--vibeui-buttongroup-009-surface:transparent;
--vibeui-buttongroup-009-sheet:light-dark(oklch(1 0 0),oklch(0.24 0.014 265));
--vibeui-buttongroup-009-fg:light-dark(oklch(0.26 0.016 265),oklch(0.94 0.006 265));
--vibeui-buttongroup-009-muted:light-dark(oklch(0.53 0.014 265),oklch(0.7 0.012 265));
--vibeui-buttongroup-009-border:light-dark(oklch(0.88 0.008 265),oklch(0.37 0.012 265));
--vibeui-buttongroup-009-hover:light-dark(oklch(0.96 0.004 265),oklch(0.3 0.012 265));
--vibeui-buttongroup-009-accent:light-dark(oklch(0.52 0.17 265),oklch(0.62 0.17 265));
--vibeui-buttongroup-009-accent-dark:light-dark(oklch(0.45 0.16 265),oklch(0.55 0.17 265));
--vibeui-buttongroup-009-on-accent:oklch(0.99 0.005 265);
--vibeui-buttongroup-009-radius:0.625rem;
--vibeui-buttongroup-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="buttongroup-009"]{
box-sizing:border-box;width:100%;max-width:44rem;
font-family:var(--vibeui-buttongroup-009-font);
}
[data-vibeui-block="buttongroup-009"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-009"] [data-part="shell"]{
display:flex;align-items:center;gap:0.375rem;flex-wrap:nowrap;
padding:0.375rem;
border:1px solid var(--vibeui-buttongroup-009-border);
border-radius:calc(var(--vibeui-buttongroup-009-radius) + 0.25rem);
background:var(--vibeui-buttongroup-009-surface);
}
[data-vibeui-block="buttongroup-009"] button,
[data-vibeui-block="buttongroup-009"] summary{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;justify-content:center;gap:0.375rem;
height:2.125rem;padding:0 0.75rem;
border:1px solid transparent;border-radius:var(--vibeui-buttongroup-009-radius);
background:transparent;color:var(--vibeui-buttongroup-009-muted);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
list-style:none;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="buttongroup-009"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="buttongroup-009"] button:hover,
[data-vibeui-block="buttongroup-009"] summary:hover{
background:var(--vibeui-buttongroup-009-hover);color:var(--vibeui-buttongroup-009-fg);
}
[data-vibeui-block="buttongroup-009"] button:focus-visible,
[data-vibeui-block="buttongroup-009"] summary:focus-visible{
outline:2px solid var(--vibeui-buttongroup-009-accent);outline-offset:2px;
}
[data-vibeui-block="buttongroup-009"] [data-part="primary"]{
margin-inline-end:auto;
background:var(--vibeui-buttongroup-009-accent);
border-color:var(--vibeui-buttongroup-009-accent);
color:var(--vibeui-buttongroup-009-on-accent);
}
[data-vibeui-block="buttongroup-009"] [data-part="primary"]:hover{
background:var(--vibeui-buttongroup-009-accent-dark);color:var(--vibeui-buttongroup-009-on-accent);
}
/* Узкая ширина — состояние по умолчанию: лишние действия спрятаны,
   а «Ещё» на месте. Широкая раскладка добавляется запросом ниже. */
[data-vibeui-block="buttongroup-009"] [data-part="extra"]{display:none}
[data-vibeui-block="buttongroup-009"] [data-part="more"]{position:relative}
[data-vibeui-block="buttongroup-009"] [data-part="more"] summary{
border-color:var(--vibeui-buttongroup-009-border);
}
[data-vibeui-block="buttongroup-009"] [data-part="sheet"]{
position:absolute;inset-inline-end:0;top:calc(100% + 0.375rem);z-index:2;
display:flex;flex-direction:column;gap:0.125rem;min-width:11rem;padding:0.25rem;
border:1px solid var(--vibeui-buttongroup-009-border);
border-radius:var(--vibeui-buttongroup-009-radius);
background:var(--vibeui-buttongroup-009-sheet);
box-shadow:0 18px 40px -22px oklch(0.2 0.02 265 / 60%);
}
[data-vibeui-block="buttongroup-009"] [data-part="sheet"] button{
justify-content:flex-start;width:100%;
}
[data-vibeui-block="buttongroup-009"] [data-part="dots"]{
display:inline-flex;gap:0.125rem;
}
[data-vibeui-block="buttongroup-009"] [data-part="dots"] i{
width:0.1875rem;height:0.1875rem;border-radius:9999px;background:currentColor;
}
@container (min-width: 32rem){
[data-vibeui-block="buttongroup-009"] [data-part="extra"]{display:inline-flex}
[data-vibeui-block="buttongroup-009"] [data-part="more"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS = ["Предпросмотр", "Запланировать", "В архив"]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Группа действий, которая на узкой ширине прячет лишнее под «Ещё».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup009({
  primary = "Опубликовать",
  actions = DEFAULT_ACTIONS,
  moreLabel = "Ещё",
  moreDescription = "{more}: скрытые действия",
  label = "Действия над черновиком",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup009Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-009-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="buttongroup-009"
        className={className}
        style={palette}
      >
        <div data-part="shell" role="group" aria-label={label}>
          <button type="button" data-part="primary">
            {primary}
          </button>
          {actions.map((action) => (
            <button key={action} type="button" data-part="extra">
              {action}
            </button>
          ))}
          <details data-part="more">
            <summary aria-label={moreDescription.replace("{more}", moreLabel)}>
              {moreLabel}
              <span data-part="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </summary>
            <div data-part="sheet">
              {actions.map((action) => (
                <button key={action} type="button">
                  {action}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>
    </>
  )
}
