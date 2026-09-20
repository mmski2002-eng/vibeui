import type { ComponentProps, CSSProperties } from "react"

export type Spinner013Props = Omit<ComponentProps<"div">, "children"> & {
  /** false — компонент ничего не рендерит: переход завершён или ещё не начат. */
  active?: boolean
  /**
   * Витринный режим: полоса лежит внутри своего блока, а не поверх страницы.
   * Нужен карточке каталога и скриншотам; в приложении полоса остаётся fixed.
   */
  inline?: boolean
  label?: string
  height?: number
  accent?: string
  /** Пусто — дорожка прозрачна, виден только цветной отрезок. */
  background?: string
}

// Идея компонента: полоса перехода между страницами, приклеенная к самому
// верху вьюпорта, а не к карточке. Отрезок разгоняется рывками и притормаживает
// перед концом — так браузер обычно и намекает «почти готово», не называя
// процента, который для перехода между страницами никто не считает. pointer-
// events:none — полоса лежит поверх контента, но не крадёт с него клики.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="spinner-013"]){
--vibeui-spinner-013-height:3px;
--vibeui-spinner-013-track:transparent;
--vibeui-spinner-013-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="spinner-013"]{color-scheme:dark}
/* Прибита к верху вьюпорта поверх всего и не мешает кликам под собой. */
[data-vibeui-block="spinner-013"]{
position:fixed;top:0;left:0;right:0;z-index:2147483647;
height:var(--vibeui-spinner-013-height);
background:var(--vibeui-spinner-013-track);
pointer-events:none;
}
/* Витринный режим: полоса встаёт в поток своего контейнера. Нужен там, где
   компонент показывают внутри кадра, а не поверх окна. */
[data-vibeui-block="spinner-013"][data-inline="true"]{
position:relative;inset:auto;z-index:auto;width:100%;
}
[data-vibeui-block="spinner-013"] [data-part="bar"]{
display:block;height:100%;width:0%;
border-radius:0 9999px 9999px 0;
background:linear-gradient(90deg,transparent,var(--vibeui-spinner-013-accent) 20%,var(--vibeui-spinner-013-accent));
box-shadow:0 0 8px 1px color-mix(in oklab,var(--vibeui-spinner-013-accent) 70%,transparent);
animation:vibeui-spinner-013-run 2.4s cubic-bezier(.3,0,0,1) infinite;
}
/* Рывки с замедлением к концу: быстрый старт, притормаживание у ста процентов. */
@keyframes vibeui-spinner-013-run{
0%{width:0%;opacity:1}
8%{width:16%}
28%{width:44%}
52%{width:64%}
72%{width:80%}
85%{width:92%}
92%{width:100%;opacity:1}
100%{width:100%;opacity:0}
}
@keyframes vibeui-spinner-013-breathe{0%,100%{opacity:.45}50%{opacity:1}}
/* Невидимая, но доступная подпись: у самой полосы текста нет и быть не должно. */
[data-vibeui-block="spinner-013"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;
clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-013"] [data-part="bar"]{
width:70%!important;opacity:1;
animation:vibeui-spinner-013-breathe 1.8s ease-in-out infinite;
}
}
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
 * Полоса перехода между страницами, приклеенная к верху вьюпорта.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner013({
  active = true,
  inline = false,
  label = "Переход на новую страницу",
  height = 3,
  accent,
  background = "",
  className,
  style,
  ...props
}: Spinner013Props) {
  const palette = {
    "--vibeui-spinner-013-height": `${height}px`,
    ...(accent ? { "--vibeui-spinner-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-spinner-013-track": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  if (!active) {
    return null
  }

  return (
    <>
      <style href="vibeui-spinner-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="spinner"
        data-vibeui-block="spinner-013"
        data-inline={inline || undefined}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        <span data-part="bar" aria-hidden="true" />
        <span data-part="sr">{label}</span>
      </div>
    </>
  )
}
