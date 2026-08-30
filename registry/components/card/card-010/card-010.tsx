import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card010Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  label?: string
  lines?: number
  media?: boolean
}

// Идея компонента: заглушка карточки под настоящую. Пропорции повторяют
// card-004: обложка квадратом, две строки заголовка, короткая строка цены.
// Совпадение метрик и есть смысл заглушки — иначе при загрузке содержимое
// прыгает, и это раздражает сильнее, чем пустое место.
const STYLES = `
:where([data-vibeui-block="card-010"]){
--vibeui-card-010-bg:oklch(1 0 0);
--vibeui-card-010-border:oklch(0.91 0.006 265);
--vibeui-card-010-base:oklch(0.93 0.005 265);
--vibeui-card-010-shine:oklch(0.97 0.003 265);
}
[data-vibeui-block="card-010"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:15rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-card-010-bg);
border:1px solid var(--vibeui-card-010-border);border-radius:0.875rem;
}
[data-vibeui-block="card-010"] [data-part="media"],
[data-vibeui-block="card-010"] [data-part="line"]{
background:
linear-gradient(90deg,var(--vibeui-card-010-base) 0%,var(--vibeui-card-010-shine) 50%,var(--vibeui-card-010-base) 100%)
0 0 / 200% 100%;
animation:vibeui-card-010-sweep 1.4s ease-in-out infinite;
}
/* Обложка квадратом: те же метрики, что у настоящей карточки товара. */
[data-vibeui-block="card-010"] [data-part="media"]{aspect-ratio:1 / 1;border-radius:0.625rem}
[data-vibeui-block="card-010"] [data-part="line"]{height:0.6875rem;border-radius:9999px}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(1){width:92%}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(2){width:64%}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(3){width:40%;height:0.875rem;margin-top:0.125rem}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(2){animation-delay:.12s}
[data-vibeui-block="card-010"] [data-part="line"]:nth-of-type(3){animation-delay:.24s}
@keyframes vibeui-card-010-sweep{
0%{background-position:120% 0}
100%{background-position:-20% 0}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="card-010"] *{animation:none!important;transition:none!important}
[data-vibeui-block="card-010"] [data-part="media"],
[data-vibeui-block="card-010"] [data-part="line"]{background:var(--vibeui-card-010-base)}
}
`

/**
 * Заглушка карточки: обложка и строки повторяют метрики настоящей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card010({
  label = "Загружается карточка товара",
  lines = 3,
  media = true,
  className,
  style,
  ...props
}: Card010Props) {
  return (
    <>
      <style href="vibeui-card-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="card-010"
        className={className}
        style={style as CSSProperties}
        role="status"
        aria-busy="true"
        aria-label={label}
      >
        {media ? <span data-part="media" /> : null}
        {Array.from({ length: Math.max(1, lines) }, (_, index) => (
          <span key={index} data-part="line" />
        ))}
      </div>
    </>
  )
}
