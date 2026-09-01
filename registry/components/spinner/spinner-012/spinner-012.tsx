import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Spinner012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  stages?: [string, string, string]
  speed?: number
}

// Идея компонента: индикатор с текстом стадии — «Готовим данные…» сменяется
// «Почти готово» без единой строчки JS. Три стадии наложены друг на друга
// абсолютным позиционированием и перетекают по кругу через animation-delay,
// как в волне из точек, только на тексте. Смена стадий — декоративная: без
// состояния скринридеру нечего внятно объявить на каждый кадр, поэтому
// доступное имя — отдельная статичная подпись через aria-label.
const STYLES = `
:where([data-vibeui-block="spinner-012"]){
--vibeui-spinner-012-speed:4.5s;
--vibeui-spinner-012-surface:oklch(1 0 0);
--vibeui-spinner-012-border:oklch(0.9 0.006 265);
--vibeui-spinner-012-fg:oklch(0.26 0.014 265);
--vibeui-spinner-012-track:oklch(0.9 0.006 265);
--vibeui-spinner-012-accent:oklch(0.55 0.17 262);
--vibeui-spinner-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="spinner-012"]{
display:inline-flex;align-items:center;gap:0.75rem;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-spinner-012-surface);
border:1px solid var(--vibeui-spinner-012-border);border-radius:0.875rem;
font-family:var(--vibeui-spinner-012-font);color:var(--vibeui-spinner-012-fg);
}
[data-vibeui-block="spinner-012"] [data-part="ring"]{
flex:none;width:1.125rem;height:1.125rem;box-sizing:border-box;
border:2px solid var(--vibeui-spinner-012-track);
border-top-color:var(--vibeui-spinner-012-accent);
border-radius:9999px;
animation:vibeui-spinner-012-spin .8s linear infinite;
}
@keyframes vibeui-spinner-012-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-spinner-012-breathe{0%,100%{opacity:.35}50%{opacity:1}}
/* Три стадии стоят друг на друге и перетекают по кругу через animation-delay. */
[data-vibeui-block="spinner-012"] [data-part="stages"]{
position:relative;display:inline-block;
min-width:12rem;height:1.2em;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="spinner-012"] [data-part="stage"]{
position:absolute;inset:0;
display:flex;align-items:center;
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
opacity:0;
animation:vibeui-spinner-012-cycle var(--vibeui-spinner-012-speed) ease-in-out infinite;
}
[data-vibeui-block="spinner-012"] [data-part="stage"]:nth-child(2){
animation-delay:calc(var(--vibeui-spinner-012-speed) / 3);
}
[data-vibeui-block="spinner-012"] [data-part="stage"]:nth-child(3){
animation-delay:calc(var(--vibeui-spinner-012-speed) / 3 * 2);
}
@keyframes vibeui-spinner-012-cycle{
0%,4%,100%{opacity:0}
10%,24%{opacity:1}
30%{opacity:0}
}
/* Без движения видна только первая стадия: текст статичен, кольцо дышит. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-012"] [data-part="ring"]{
animation:vibeui-spinner-012-breathe 1.6s ease-in-out infinite;
border-color:var(--vibeui-spinner-012-accent);
}
[data-vibeui-block="spinner-012"] [data-part="stage"]{animation:none!important;opacity:0}
[data-vibeui-block="spinner-012"] [data-part="stage"]:first-child{opacity:1}
}
`

const DEFAULT_STAGES: [string, string, string] = [
  "Готовим данные…",
  "Собираем результат…",
  "Почти готово",
]

/**
 * Индикатор с текстом стадии: три сообщения перетекают друг в друга по кругу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner012({
  label = "Идёт многоэтапная загрузка",
  stages = DEFAULT_STAGES,
  speed = 4.5,
  className,
  style,
  ...props
}: Spinner012Props) {
  const palette = {
    "--vibeui-spinner-012-speed": `${speed}s`,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="spinner-012"
        role="status"
        aria-live="polite"
        aria-label={label}
        className={className}
        style={palette}
      >
        <span data-part="ring" aria-hidden="true" />
        <span data-part="stages" aria-hidden="true">
          {stages.map((stage, index) => (
            <span key={index} data-part="stage">
              {stage}
            </span>
          ))}
        </span>
      </div>
    </>
  )
}
