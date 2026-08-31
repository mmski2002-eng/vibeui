import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Buttongroup032Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  actions?: string[]
  busy?: string
  busyLabel?: string
  label?: string
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
--vibeui-buttongroup-032-surface:oklch(1 0 0);
--vibeui-buttongroup-032-fg:oklch(0.25 0.016 265);
--vibeui-buttongroup-032-muted:oklch(0.55 0.014 265);
--vibeui-buttongroup-032-border:oklch(0.88 0.008 265);
--vibeui-buttongroup-032-accent:oklch(0.52 0.16 265);
--vibeui-buttongroup-032-radius:0.625rem;
--vibeui-buttongroup-032-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
height:2.375rem;padding:0 0.875rem;
border:0;background:transparent;
color:var(--vibeui-buttongroup-032-fg);
font-size:0.8125rem;font-weight:600;line-height:1;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="buttongroup-032"] button + button{
border-inline-start:1px solid var(--vibeui-buttongroup-032-border);
}
[data-vibeui-block="buttongroup-032"] button:hover:not(:disabled){background:oklch(0.965 0.005 265)}
[data-vibeui-block="buttongroup-032"] button:focus-visible{
z-index:1;outline:2px solid var(--vibeui-buttongroup-032-accent);outline-offset:-2px;
}
/* Подпись и кольцо лежат в одной ячейке grid: ширина не прыгает. */
[data-vibeui-block="buttongroup-032"] [data-part="text"],
[data-vibeui-block="buttongroup-032"] [data-part="spinner"]{grid-area:1 / 1}
[data-vibeui-block="buttongroup-032"] [data-part="spinner"]{
width:1rem;height:1rem;border-radius:9999px;opacity:0;
border:2px solid oklch(0.85 0.01 265);
border-top-color:var(--vibeui-buttongroup-032-accent);
animation:vibeui-buttongroup-032-spin .7s linear infinite;
}
[data-vibeui-block="buttongroup-032"] [data-busy="true"]{
cursor:progress;color:var(--vibeui-buttongroup-032-muted);
background:oklch(0.975 0.004 265);
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
 * Сцепка действий, где одна кнопка занята работой, а её ширина не меняется.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Buttongroup032({
  actions = DEFAULT_ACTIONS,
  busy = "Проверить",
  busyLabel = "Идёт проверка, это займёт несколько секунд",
  label = "Действия над документом",
  accent,
  className,
  style,
  ...props
}: Buttongroup032Props) {
  const palette = {
    ...(accent ? { "--vibeui-buttongroup-032-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-buttongroup-032" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
