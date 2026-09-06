import type { ComponentProps, CSSProperties } from "react"

export type Button029Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  secondaryLabel?: string
  /** Мелкая строка под кнопками: согласие, условия, срок ответа. */
  note?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: концовка формы целиком, а не одна кнопка. На узкой
// колонке основное действие растянуто во всю ширину, отмена стоит под ним
// и тоже во всю ширину — большой палец попадает в любую точку строки.
// От 26rem собственной ширины пара перестраивается в ряд, отмена уходит
// влево и ужимается по содержимому. Считается ширина самого блока через
// container query, поэтому в узкой колонке десктопа раскладка тоже мобильная.
const STYLES = `
:where([data-vibeui-block="button-029"]){
--vibeui-button-029-bg:transparent;
--vibeui-button-029-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-button-029-muted:color-mix(in oklab,var(--vibeui-button-029-fg) 68%,transparent);
--vibeui-button-029-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-button-029-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-button-029-hover-filter:light-dark(brightness(1.45),brightness(0.9));
--vibeui-button-029-accent-fg:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-button-029-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-029"]{color-scheme:dark}
[data-vibeui-block="button-029"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:32rem;box-sizing:border-box;
padding:1rem;border:1px solid var(--vibeui-button-029-border);border-radius:0.875rem;
background:var(--vibeui-button-029-bg);color:var(--vibeui-button-029-fg);
font-family:var(--vibeui-button-029-font);
}
[data-vibeui-block="button-029"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="button-029"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:100%;height:2.5rem;padding:0 1.25rem;box-sizing:border-box;
border:1px solid transparent;border-radius:0.625rem;
font:inherit;font-size:0.875rem;font-weight:650;line-height:1;
transition:filter .16s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="button-029"] [data-part="primary"]{
background:var(--vibeui-button-029-accent);color:var(--vibeui-button-029-accent-fg);
}
[data-vibeui-block="button-029"] [data-part="primary"]:hover{filter:var(--vibeui-button-029-hover-filter)}
[data-vibeui-block="button-029"] [data-part="secondary"]{
background:transparent;color:var(--vibeui-button-029-muted);border-color:var(--vibeui-button-029-border);
}
[data-vibeui-block="button-029"] [data-part="secondary"]:hover{color:var(--vibeui-button-029-fg);border-color:var(--vibeui-button-029-muted)}
[data-vibeui-block="button-029"] button:focus-visible{outline:2px solid var(--vibeui-button-029-accent);outline-offset:2px}
[data-vibeui-block="button-029"] [data-part="note"]{
margin:0.75rem 0 0;text-align:center;
color:var(--vibeui-button-029-muted);font-size:0.75rem;line-height:1.4;
}
/* Правила висят на внутренней раскладке: контейнерный запрос не действует
   на сам контейнер, поэтому корню его давать бессмысленно. */
@container (min-width: 26rem){
[data-vibeui-block="button-029"] [data-part="shell"]{flex-direction:row;justify-content:flex-end}
[data-vibeui-block="button-029"] button{width:auto}
[data-vibeui-block="button-029"] [data-part="primary"]{order:2;min-width:11rem}
[data-vibeui-block="button-029"] [data-part="secondary"]{order:1}
[data-vibeui-block="button-029"] [data-part="note"]{text-align:right}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-029"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Концовка формы: основная кнопка во всю ширину и отмена под ней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button029({
  label = "Отправить заявку",
  secondaryLabel = "Сохранить черновик",
  note = "Отвечаем в течение одного рабочего дня",
  background = "",
  accent,
  className,
  style,
  ...props
}: Button029Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-029-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-029-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-029" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button"
        data-vibeui-block="button-029"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <button type="submit" data-part="primary">
            {label}
          </button>
          {secondaryLabel ? (
            <button type="button" data-part="secondary">
              {secondaryLabel}
            </button>
          ) : null}
        </div>
        {note ? <p data-part="note">{note}</p> : null}
      </div>
    </>
  )
}
