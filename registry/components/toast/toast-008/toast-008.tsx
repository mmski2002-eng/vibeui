import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Toast008Corner =
  "top-left" | "top-right" | "bottom-left" | "bottom-right"

export type Toast008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Угол экрана, в котором копятся уведомления. */
  corner?: Toast008Corner
  /** Отступ стопки от краёв области. */
  offset?: string
  messages?: string[]
}

// Идея компонента: не одно уведомление, а место для них. Угол задаётся одним
// пропом, а все четыре варианта собираются из двух переменных отступа и двух
// переключателей выравнивания — новые правила под каждый угол не нужны.
const STYLES = `
:where([data-vibeui-block="toast-008"]){
--vibeui-toast-008-bg:oklch(0.97 0.004 265);
--vibeui-toast-008-fg:oklch(0.24 0.014 265);
--vibeui-toast-008-muted:oklch(0.55 0.014 265);
--vibeui-toast-008-border:oklch(0.9 0.006 265);
--vibeui-toast-008-card:oklch(1 0 0);
--vibeui-toast-008-tone:oklch(0.58 0.16 265);
--vibeui-toast-008-offset:1rem;
--vibeui-toast-008-radius:0.875rem;
--vibeui-toast-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="toast-008"]{
width:100%;max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-toast-008-font);color:var(--vibeui-toast-008-fg);
}
/* Сцена изображает окно приложения: без неё «угол экрана» показать нечем. */
[data-vibeui-block="toast-008"] [data-part="stage"]{
position:relative;overflow:hidden;box-sizing:border-box;
min-height:14rem;
border:1px solid var(--vibeui-toast-008-border);
border-radius:1rem;
background:
linear-gradient(0deg,oklch(0.88 0.008 265 / 45%) 1px,transparent 1px) 0 0 / 100% 1.5rem,
linear-gradient(90deg,oklch(0.88 0.008 265 / 45%) 1px,transparent 1px) 0 0 / 1.5rem 100%,
var(--vibeui-toast-008-bg);
}
[data-vibeui-block="toast-008"] [data-part="hint"]{
position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
margin:0;font-size:0.75rem;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-toast-008-muted);
}
/* Стопка. Угол — это пара переменных и пара переключателей выравнивания. */
[data-vibeui-block="toast-008"] [data-part="region"]{
position:absolute;z-index:2;
display:flex;flex-direction:column;gap:0.5rem;
width:min(17rem,calc(100% - var(--vibeui-toast-008-offset) * 2));
}
[data-vibeui-block="toast-008"][data-corner^="top"] [data-part="region"]{top:var(--vibeui-toast-008-offset)}
[data-vibeui-block="toast-008"][data-corner^="bottom"] [data-part="region"]{bottom:var(--vibeui-toast-008-offset);flex-direction:column-reverse}
[data-vibeui-block="toast-008"][data-corner$="left"] [data-part="region"]{left:var(--vibeui-toast-008-offset)}
[data-vibeui-block="toast-008"][data-corner$="right"] [data-part="region"]{right:var(--vibeui-toast-008-offset)}
[data-vibeui-block="toast-008"] [data-part="card"]{
display:flex;align-items:center;gap:0.5rem;box-sizing:border-box;
padding:0.625rem 0.75rem;
border:1px solid var(--vibeui-toast-008-border);
border-radius:var(--vibeui-toast-008-radius);
background:var(--vibeui-toast-008-card);
font-size:0.8125rem;line-height:1.35;
box-shadow:0 14px 30px -22px oklch(0.2 0.02 265 / 55%);
animation:vibeui-toast-008-in .28s ease both;
}
[data-vibeui-block="toast-008"] [data-part="card"]:nth-child(2){animation-delay:.08s}
[data-vibeui-block="toast-008"] [data-part="card"]:nth-child(3){animation-delay:.16s}
[data-vibeui-block="toast-008"] [data-part="dot"]{
flex:none;width:0.5rem;height:0.5rem;border-radius:9999px;background:var(--vibeui-toast-008-tone);
}
[data-vibeui-block="toast-008"] [data-part="legend"]{
display:flex;align-items:center;gap:0.375rem;margin:0.625rem 0 0;
font-size:0.75rem;color:var(--vibeui-toast-008-muted);
}
[data-vibeui-block="toast-008"] [data-part="legend"] b{color:var(--vibeui-toast-008-fg);font-weight:650}
@keyframes vibeui-toast-008-in{from{opacity:0;translate:0 0.5rem}to{opacity:1;translate:0 0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_MESSAGES = [
  "Черновик сохранён",
  "Файл выгружен в облако",
  "Приглашение отправлено",
]

/**
 * Область уведомлений: угол задаётся одним пропом через переменные отступа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast008({
  corner = "bottom-right",
  offset = "1rem",
  messages = DEFAULT_MESSAGES,
  className,
  style,
  ...props
}: Toast008Props) {
  const palette = {
    "--vibeui-toast-008-offset": offset,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="toast-008"
        data-corner={corner}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <p data-part="hint">область приложения</p>
          <div data-part="region" role="log" aria-live="polite">
            {messages.map((message) => (
              <div data-part="card" key={message}>
                <span data-part="dot" aria-hidden="true" />
                <span>{message}</span>
              </div>
            ))}
          </div>
        </div>
        <p data-part="legend">
          угол стопки: <b>{corner}</b>, отступ <b>{offset}</b>
        </p>
      </div>
    </>
  )
}
