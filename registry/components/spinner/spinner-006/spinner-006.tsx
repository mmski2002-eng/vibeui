import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  lines?: number
  media?: boolean
  label?: string
}

// Идея компонента: заглушка карточки на пульсации, а не на бегущем блике.
// Блик — это анимация большого градиента, и на списке из двадцати заглушек
// он заметно греет процессор; пульсация прозрачности отдаётся композитору и
// стоит почти ничего. Заглушка повторяет метрику будущей карточки, поэтому
// при подстановке данных ничего не прыгает. Для скринридера это одно
// сообщение role="status", а не двадцать серых прямоугольников.
const STYLES = `
:where([data-vibeui-block="spinner-006"]){
--vibeui-spinner-006-surface:oklch(1 0 0);
--vibeui-spinner-006-border:oklch(0.91 0.006 265);
--vibeui-spinner-006-base:oklch(0.92 0.005 265);
--vibeui-spinner-006-radius:0.5rem;
--vibeui-spinner-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: серые плашки на тёмном фоне теряются. */
[data-vibeui-block="spinner-006"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-spinner-006-surface);
border:1px solid var(--vibeui-spinner-006-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-006-font);
}
[data-vibeui-block="spinner-006"] [data-part="media"]{
aspect-ratio:16 / 9;border-radius:0.625rem;
background:var(--vibeui-spinner-006-base);
animation:vibeui-spinner-006-pulse 1.6s ease-in-out infinite;
}
[data-vibeui-block="spinner-006"] [data-part="head"]{
display:flex;align-items:center;gap:0.625rem;
}
[data-vibeui-block="spinner-006"] [data-part="dot"]{
width:2rem;height:2rem;flex:none;border-radius:9999px;
background:var(--vibeui-spinner-006-base);
animation:vibeui-spinner-006-pulse 1.6s ease-in-out infinite;
}
[data-vibeui-block="spinner-006"] [data-part="lines"]{
display:flex;flex-direction:column;gap:0.5rem;flex:1 1 auto;
}
/* Метрика будущего текста: высота строки и промежуток те же, что у абзаца. */
[data-vibeui-block="spinner-006"] [data-part="bar"]{
height:0.75rem;border-radius:var(--vibeui-spinner-006-radius);
background:var(--vibeui-spinner-006-base);
animation:vibeui-spinner-006-pulse 1.6s ease-in-out infinite;
}
[data-vibeui-block="spinner-006"] [data-part="bar"]:nth-child(2){animation-delay:.12s}
[data-vibeui-block="spinner-006"] [data-part="bar"]:nth-child(3){animation-delay:.24s}
[data-vibeui-block="spinner-006"] [data-part="bar"]:last-child{width:64%}
@keyframes vibeui-spinner-006-pulse{0%,100%{opacity:1}50%{opacity:.45}}
/* Без движения пульс выключен, а плашки остаются приглушёнными. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-006"] *{animation:none!important;transition:none!important}
[data-vibeui-block="spinner-006"] [data-part="bar"],
[data-vibeui-block="spinner-006"] [data-part="dot"],
[data-vibeui-block="spinner-006"] [data-part="media"]{opacity:.7}
}
`

/**
 * Скелетон карточки на пульсации прозрачности вместо бегущего блика.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner006({
  lines = 3,
  media = true,
  label = "Загружаем карточку компонента",
  className,
  style,
  ...props
}: Spinner006Props) {
  const count = Math.min(6, Math.max(1, Math.round(lines)))

  return (
    <>
      <style href="vibeui-spinner-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-006"
        role="status"
        aria-live="polite"
        aria-label={label}
        className={className}
        style={style as CSSProperties}
      >
        {media ? <span data-part="media" /> : null}
        <div data-part="head">
          <span data-part="dot" />
          <div data-part="lines">
            {Array.from({ length: count }, (_, index) => (
              <span key={index} data-part="bar" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
