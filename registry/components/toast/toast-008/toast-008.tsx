import type { ComponentProps, CSSProperties } from "react"

export type Toast008Corner =
  "top-left" | "top-right" | "bottom-left" | "bottom-right"

export type Toast008Props = Omit<ComponentProps<"div">, "children"> & {
  /** Угол экрана, в котором копятся уведомления. */
  corner?: Toast008Corner
  /** Отступ стопки от краёв области. */
  offset?: string
  messages?: string[]
  /** Подпись сцены, изображающей окно приложения. */
  hintText?: string
  /** Подпись под сценой; {corner} и {offset} заменяются значениями. */
  legendText?: string
  /** Цвет точки у карточки. */
  tone?: string
  /** Пусто — подложка сцены берётся из темы окружения. */
  background?: string
}

// Идея компонента: не одно уведомление, а место для них. Угол задаётся одним
// пропом, а все четыре варианта собираются из двух переменных отступа и двух
// переключателей выравнивания — новые правила под каждый угол не нужны.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// границы сцены и карточек светлее их подложек, а не темнее.
const STYLES = `
:where([data-vibeui-block="toast-008"]){
--vibeui-toast-008-bg:light-dark(oklch(0.97 0 265),oklch(0.2 0 265));
--vibeui-toast-008-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-toast-008-muted:color-mix(in oklab,var(--vibeui-toast-008-fg) 68%,transparent);
--vibeui-toast-008-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-toast-008-card:light-dark(oklch(1 0 0),oklch(0.28 0 265));
--vibeui-toast-008-grid:light-dark(oklch(0.88 0 265 / 45%),oklch(0.5 0 265 / 35%));
--vibeui-toast-008-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.08 0 265 / 75%));
--vibeui-toast-008-tone:light-dark(oklch(0.58 0.16 39.8),oklch(0.74 0.14 39.8));
--vibeui-toast-008-offset:1rem;
--vibeui-toast-008-radius:0.875rem;
--vibeui-toast-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-008"]{color-scheme:dark}
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
linear-gradient(0deg,var(--vibeui-toast-008-grid) 1px,transparent 1px) 0 0 / 100% 1.5rem,
linear-gradient(90deg,var(--vibeui-toast-008-grid) 1px,transparent 1px) 0 0 / 1.5rem 100%,
var(--vibeui-toast-008-bg);
}
[data-vibeui-block="toast-008"] [data-part="hint"]{
position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
margin:0;font-size:0.75rem;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-toast-008-muted);
}
/* Подпись сцены уходит от стопки: при трёх сообщениях та занимает половину
   высоты, и по центру надпись оказывалась прямо под карточками. */
[data-vibeui-block="toast-008"][data-corner^="top"] [data-part="hint"]{top:72%}
[data-vibeui-block="toast-008"][data-corner^="bottom"] [data-part="hint"]{top:28%}
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
box-shadow:0 14px 30px -22px var(--vibeui-toast-008-shadow);
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
 * Область уведомлений: угол задаётся одним пропом через переменные отступа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast008({
  corner = "bottom-right",
  offset = "1rem",
  messages = DEFAULT_MESSAGES,
  hintText = "область приложения",
  legendText = "угол стопки: {corner}, отступ {offset}",
  tone,
  background = "",
  className,
  style,
  ...props
}: Toast008Props) {
  const palette = {
    "--vibeui-toast-008-offset": offset,
    ...(tone ? { "--vibeui-toast-008-tone": tone } : null),
    ...(background
      ? {
          "--vibeui-toast-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  // Подпись собирается из шаблона: значения остаются выделенными, а порядок
  // слов принадлежит переводу, а не разметке.
  const legendParts = legendText.split(/(\{corner\}|\{offset\})/)

  return (
    <>
      <style href="vibeui-toast-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-008"
        data-corner={corner}
        className={className}
        style={palette}
      >
        <div data-part="stage">
          <p data-part="hint">{hintText}</p>
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
          {legendParts.map((part, index) =>
            part === "{corner}" ? (
              <b key={index}>{corner}</b>
            ) : part === "{offset}" ? (
              <b key={index}>{offset}</b>
            ) : (
              part
            ),
          )}
        </p>
      </div>
    </>
  )
}
