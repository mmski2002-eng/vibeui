import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup012Props = Omit<ComponentProps<"div">, "children"> & {
  primary?: string
  secondary?: string
  note?: string
  label?: string
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: нижняя панель формы на телефоне. Кнопки делят ширину
// поровну через flex:1 1 0 — именно ноль в основе, иначе длинная подпись
// раздувает свою долю и панель перестаёт быть симметричной. min-width:0
// разрешает подписи ужиматься: без него flex-элемент не сжимается меньше
// своего содержимого и панель выезжает за экран. Снизу добавлен отступ на
// домашнюю полоску, чтобы главная кнопка не оказалась под жестом системы.
const STYLES = `
:where([data-vibeui-block="buttongroup-012"]){
--vibeui-buttongroup-012-surface:transparent;
--vibeui-buttongroup-012-fg:light-dark(oklch(0.26 0 265),oklch(0.94 0 265));
--vibeui-buttongroup-012-muted:color-mix(in oklab,var(--vibeui-buttongroup-012-fg) 68%,transparent);
--vibeui-buttongroup-012-border:light-dark(oklch(0.89 0 265),oklch(0.37 0 265));
--vibeui-buttongroup-012-hover:light-dark(oklch(0.96 0 265),oklch(0.3 0 265));
--vibeui-buttongroup-012-accent:light-dark(oklch(0.28 0 0),oklch(0.881 0 0));
--vibeui-buttongroup-012-accent-dark:light-dark(oklch(0.263 0 0),oklch(0.868 0 0));
--vibeui-buttongroup-012-on-accent:oklch(from var(--vibeui-buttongroup-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-buttongroup-012-radius:0.75rem;
--vibeui-buttongroup-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-012"]{color-scheme:dark}
[data-vibeui-block="buttongroup-012"]{
box-sizing:border-box;width:100%;max-width:26rem;
padding:0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom,0px));
border:1px solid var(--vibeui-buttongroup-012-border);
border-radius:1rem;
background:var(--vibeui-buttongroup-012-surface);
font-family:var(--vibeui-buttongroup-012-font);
box-shadow:0 -6px 20px -18px oklch(0.2 0 265 / 70%);
}
[data-vibeui-block="buttongroup-012"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-012"] [data-part="row"]{display:flex;gap:0.5rem}
[data-vibeui-block="buttongroup-012"] button{
appearance:none;cursor:pointer;font:inherit;
flex:1 1 0;min-width:0;
display:inline-flex;align-items:center;justify-content:center;
height:2.75rem;padding:0 0.75rem;
border:1px solid var(--vibeui-buttongroup-012-border);
border-radius:var(--vibeui-buttongroup-012-radius);
background:transparent;
color:var(--vibeui-buttongroup-012-fg);
font-size:0.9375rem;font-weight:650;line-height:1;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="buttongroup-012"] button:hover{background:var(--vibeui-buttongroup-012-hover)}
[data-vibeui-block="buttongroup-012"] button:focus-visible{
outline:2px solid var(--vibeui-buttongroup-012-accent);outline-offset:2px;
}
/* Главная кнопка не шире второстепенной: приоритет несут цвет и порядок,
   а не размер — иначе панель перестаёт быть равнодолевой. */
[data-vibeui-block="buttongroup-012"] [data-part="primary"]{
background:var(--vibeui-buttongroup-012-accent);
border-color:var(--vibeui-buttongroup-012-accent);
color:oklch(from var(--vibeui-buttongroup-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="buttongroup-012"] [data-part="primary"]:hover{
background:var(--vibeui-buttongroup-012-accent-dark);
border-color:var(--vibeui-buttongroup-012-accent-dark);
}
[data-vibeui-block="buttongroup-012"] [data-part="note"]{
margin:0 0 0.5rem;text-align:center;
color:var(--vibeui-buttongroup-012-muted);
font-size:0.75rem;line-height:1.4;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-012"] *{animation:none!important;transition:none!important}}
`

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
 * Нижняя панель формы: две кнопки во всю ширину равными долями.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup012({
  primary = "Сохранить",
  secondary = "Отмена",
  note = "Черновик сохраняется автоматически",
  label = "Завершение формы",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup012Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-012-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-012"
        className={className}
        style={palette}
      >
        {note ? <p data-part="note">{note}</p> : null}
        <div data-part="row" role="group" aria-label={label}>
          <button type="button">{secondary}</button>
          <button type="button" data-part="primary">
            {primary}
          </button>
        </div>
      </div>
    </>
  )
}
