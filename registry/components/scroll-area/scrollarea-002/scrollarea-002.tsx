import type { ComponentProps, CSSProperties } from "react"

export type Scrollarea002Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  items?: string[]
  height?: string
  /** Подложка: приём с тенями требует непрозрачного цвета, пусто — свой. */
  background?: string
}

// Идея компонента: тени у краёв появляются только с той стороны, где ещё есть
// содержимое, и делает это чистый CSS. Четыре слоя фона: две «крышки» цвета
// подложки прокручиваются вместе с содержимым (background-attachment:local),
// две тени приколоты к рамке (scroll). У верхнего края крышка накрывает тень,
// пока лента не сдвинута, — и уезжает, открывая её. Никакого onScroll.
//
// Тема берётся из color-scheme окружения через light-dark(). Подложка здесь,
// в отличие от прочих областей, обязана быть непрозрачной: крышки красятся
// её цветом, и на прозрачном фоне тени были бы видны всегда.
const STYLES = `
:where([data-vibeui-block="scrollarea-002"]){
--vibeui-scrollarea-002-bg:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-scrollarea-002-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-scrollarea-002-muted:color-mix(in oklab,var(--vibeui-scrollarea-002-fg) 68%,transparent);
--vibeui-scrollarea-002-border:light-dark(oklch(0.9 0 265),oklch(0.33 0 265));
--vibeui-scrollarea-002-shadow:light-dark(oklch(0.24 0 265 / 16%),oklch(0 0 0 / 55%));
--vibeui-scrollarea-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-scrollarea-002-height:13rem;
--vibeui-scrollarea-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="scrollarea-002"]{color-scheme:dark}
[data-vibeui-block="scrollarea-002"]{
display:flex;flex-direction:column;
width:100%;max-width:20rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-scrollarea-002-bg);
border:1px solid var(--vibeui-scrollarea-002-border);border-radius:0.875rem;
font-family:var(--vibeui-scrollarea-002-font);color:var(--vibeui-scrollarea-002-fg);
}
[data-vibeui-block="scrollarea-002"] [data-part="head"]{
padding:0.625rem 0.875rem;border-bottom:1px solid var(--vibeui-scrollarea-002-border);
font-size:0.8125rem;font-weight:650;
}
/* Четыре слоя: крышки едут с содержимым, тени приколоты к рамке. */
[data-vibeui-block="scrollarea-002"] [data-part="area"]{
height:var(--vibeui-scrollarea-002-height);
overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;
background:
linear-gradient(var(--vibeui-scrollarea-002-bg) 30%,transparent) center top,
linear-gradient(transparent,var(--vibeui-scrollarea-002-bg) 70%) center bottom,
radial-gradient(farthest-side at 50% 0,var(--vibeui-scrollarea-002-shadow),transparent) center top,
radial-gradient(farthest-side at 50% 100%,var(--vibeui-scrollarea-002-shadow),transparent) center bottom;
background-repeat:no-repeat;
background-size:100% 2.25rem,100% 2.25rem,100% 0.6875rem,100% 0.6875rem;
background-attachment:local,local,scroll,scroll;
}
[data-vibeui-block="scrollarea-002"] [data-part="area"]:focus-visible{
outline:2px solid var(--vibeui-scrollarea-002-accent);outline-offset:-2px;
}
[data-vibeui-block="scrollarea-002"] ul{margin:0;padding:0.25rem 0;list-style:none}
[data-vibeui-block="scrollarea-002"] li{
display:flex;align-items:center;gap:0.5rem;
min-height:2.125rem;padding:0 0.875rem;font-size:0.8125rem;
}
[data-vibeui-block="scrollarea-002"] li span{
flex:none;width:0.375rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-scrollarea-002-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="scrollarea-002"] *{animation:none!important;transition:none!important}
}
`

const DEFAULT_ITEMS = [
  "Пересобрать реестр",
  "Проверить типы",
  "Обновить снимки превью",
  "Написать описание блока",
  "Перевести metadata",
  "Прогнать линтер",
  "Свести конфликты",
  "Выложить на стенд",
  "Позвать на ревью",
  "Закрыть задачу",
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Область прокрутки, где тени у краёв нарисованы фоном без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Scrollarea002({
  title = "Очередь работ",
  items = DEFAULT_ITEMS,
  height = "13rem",
  background = "",
  className,
  style,
  ...props
}: Scrollarea002Props) {
  const palette = {
    "--vibeui-scrollarea-002-height": height,
    ...(background
      ? {
          "--vibeui-scrollarea-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-scrollarea-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="scroll-area"
        data-vibeui-block="scrollarea-002"
        className={className}
        style={palette}
      >
        <div data-part="head">{title}</div>
        <div data-part="area" tabIndex={0} role="region" aria-label={title}>
          <ul>
            {items.map((item) => (
              <li key={item}>
                <span aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
