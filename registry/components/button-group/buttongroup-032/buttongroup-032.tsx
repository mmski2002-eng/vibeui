import type { ComponentProps, CSSProperties } from "react"

export type Buttongroup032Props = Omit<ComponentProps<"div">, "children"> & {
  actions?: string[]
  busy?: string
  busyLabel?: string
  label?: string
  /** Пусто — заливки нет, сцепка ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: одна кнопка сцепки занята работой, остальные живы.
// Ширина занятой кнопки не меняется: подпись остаётся на месте и получает
// opacity:0, а колечко ложится поверх неё в grid-area того же трека — при
// подмене текста на «Сохраняю…» группа дёргалась бы на каждый запрос.
// Кнопка помечена aria-busy и disabled: disabled убирает повторное нажатие,
// aria-busy объясняет, что кнопка не сломана, а занята. Живая область
// role="status" сообщает о начале работы словами — крутящееся кольцо
// незрячему не видно.
const STYLES = `
:where([data-vibeui-block="buttongroup-032"]){
--vibeui-buttongroup-032-surface:transparent;
--vibeui-buttongroup-032-fg:light-dark(oklch(0.25 0 265),oklch(0.95 0 265));
--vibeui-buttongroup-032-muted:color-mix(in oklab,var(--vibeui-buttongroup-032-fg) 68%,transparent);
--vibeui-buttongroup-032-border:light-dark(oklch(0.88 0 265),oklch(0.39 0 265));
--vibeui-buttongroup-032-hover:light-dark(oklch(0.965 0 265),oklch(0.33 0 265));
--vibeui-buttongroup-032-busy:light-dark(oklch(0.975 0 265),oklch(0.29 0 265));
--vibeui-buttongroup-032-ring:light-dark(oklch(0.85 0 265),oklch(0.44 0 265));
--vibeui-buttongroup-032-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.78 0.13 39.8));
--vibeui-buttongroup-032-radius:0.625rem;
--vibeui-buttongroup-032-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="buttongroup-032"]{color-scheme:dark}
[data-vibeui-block="buttongroup-032"]{
box-sizing:border-box;display:inline-flex;flex-direction:column;gap:0.5rem;
font-family:var(--vibeui-buttongroup-032-font);
}
[data-vibeui-block="buttongroup-032"] *{box-sizing:border-box}
[data-vibeui-block="buttongroup-032"] [data-part="track"]{
display:flex;isolation:isolate;
border:1px solid var(--vibeui-buttongroup-032-border);
border-radius:var(--vibeui-buttongroup-032-radius);
background:var(--vibeui-buttongroup-032-surface);
overflow:hidden;
}
[data-vibeui-block="buttongroup-032"] button{
appearance:none;cursor:pointer;font:inherit;
position:relative;z-index:0;display:grid;place-items:center;
height:2.25rem;padding:0 0.875rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-032-fg);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-032"] button + button{
border-inline-start:1px solid var(--vibeui-buttongroup-032-border);
}
[data-vibeui-block="buttongroup-032"] button:hover:not(:disabled){background:var(--vibeui-buttongroup-032-hover)}
[data-vibeui-block="buttongroup-032"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-032-accent);outline-offset:-2px;
}
/* Подпись и кольцо лежат в одной ячейке grid: ширина не прыгает. */
[data-vibeui-block="buttongroup-032"] [data-part="text"],
[data-vibeui-block="buttongroup-032"] [data-part="spinner"]{grid-area:1 / 1}
[data-vibeui-block="buttongroup-032"] [data-part="spinner"]{
width:1rem;height:1rem;border-radius:9999px;opacity:0;
border:2px solid var(--vibeui-buttongroup-032-ring);
border-top-color:var(--vibeui-buttongroup-032-accent);
animation:vibeui-buttongroup-032-spin .7s linear infinite;
}
[data-vibeui-block="buttongroup-032"] [data-busy="true"]{
cursor:progress;color:var(--vibeui-buttongroup-032-muted);
background:var(--vibeui-buttongroup-032-busy);
}
[data-vibeui-block="buttongroup-032"] [data-busy="true"] [data-part="text"]{opacity:0}
[data-vibeui-block="buttongroup-032"] [data-busy="true"] [data-part="spinner"]{opacity:1}
@keyframes vibeui-buttongroup-032-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="buttongroup-032"] [data-part="status"]{
margin:0;min-height:1.0625rem;
color:var(--vibeui-buttongroup-032-muted);
font-size:0.75rem;line-height:1.4;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="buttongroup-032"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ACTIONS = ["Сохранить", "Проверить", "Опубликовать"]

/**
 * Ветка темы для заданного фона. Без неё светлая заливка досталась бы тексту
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
 * Сцепка действий, где одна кнопка занята работой, а её ширина не меняется.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup032({
  actions = DEFAULT_ACTIONS,
  busy = "Проверить",
  busyLabel = "Идёт проверка, это займёт несколько секунд",
  label = "Действия над документом",
  background = "",
  accent,
  className,
  style,
  ...props
}: Buttongroup032Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-032-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-buttongroup-032-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-032" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="button-group"
        data-vibeui-block="buttongroup-032"
        className={className}
        style={palette}
      >
        <div data-part="track" role="group" aria-label={label}>
          {actions.map((action) => {
            const working = action === busy

            return (
              <button
                key={action}
                type="button"
                data-busy={working}
                aria-busy={working}
                disabled={working}
              >
                <span data-part="text">{action}</span>
                <span data-part="spinner" aria-hidden="true" />
              </button>
            )
          })}
        </div>
        <p data-part="status" role="status">
          {busy ? busyLabel : ""}
        </p>
      </div>
    </>
  )
}
