import type { ComponentProps, CSSProperties } from "react"

export type Empty004Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  title?: string
  text?: string
  actionLabel?: string
  formats?: string
  onAction?: () => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пустая папка, которая сама и есть область загрузки.
// Пунктирная рамка и стрелка в лоток говорят «сюда можно бросить файл»
// раньше любого текста, а кнопка остаётся для тех, кто перетаскивать не
// станет: у одного действия должно быть два входа, но одна цель.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="empty-004"]){
--vibeui-empty-004-bg:transparent;
--vibeui-empty-004-fg:light-dark(oklch(0.21 0.014 265),oklch(0.95 0.005 265));
--vibeui-empty-004-muted:color-mix(in oklab,var(--vibeui-empty-004-fg) 68%,transparent);
--vibeui-empty-004-border:light-dark(oklch(0.88 0.008 265),oklch(0.39 0.014 265));
--vibeui-empty-004-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-empty-004-accent-fg:light-dark(oklch(0.99 0.01 265),oklch(0.18 0.03 265));
--vibeui-empty-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="empty-004"]{color-scheme:dark}
/* Пунктирная рамка — обещание перетаскивания, а не украшение карточки. */
[data-vibeui-block="empty-004"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:1.75rem 1.25rem;
text-align:center;
background:
radial-gradient(90% 70% at 50% 0%,color-mix(in oklab,var(--vibeui-empty-004-accent) 7%,transparent),transparent 70%),
var(--vibeui-empty-004-bg);
border:1.5px dashed var(--vibeui-empty-004-border);border-radius:1rem;
font-family:var(--vibeui-empty-004-font);color:var(--vibeui-empty-004-fg);
}
/* Стрелка в лоток: линия, наконечник и дно нарисованы бордюрами. */
[data-vibeui-block="empty-004"] [data-part="mark"]{
position:relative;width:2.75rem;height:2.5rem;margin-bottom:0.25rem;
color:var(--vibeui-empty-004-accent);
}
[data-vibeui-block="empty-004"] [data-part="mark"]::before{
content:"";position:absolute;left:50%;top:0.125rem;width:2px;height:1.25rem;
margin-left:-1px;border-radius:9999px;background:currentColor;
}
[data-vibeui-block="empty-004"] [data-part="mark"] i{
position:absolute;left:50%;top:0.25rem;width:0.6875rem;height:0.6875rem;
margin-left:-0.34375rem;
border:solid currentColor;border-width:2px 0 0 2px;transform:rotate(45deg);border-radius:1px 0 0 0;
}
[data-vibeui-block="empty-004"] [data-part="mark"]::after{
content:"";position:absolute;left:0;bottom:0.125rem;width:100%;height:0.9375rem;
border:2px solid currentColor;border-top:0;border-radius:0 0 0.5rem 0.5rem;opacity:.45;
}
[data-vibeui-block="empty-004"] [data-part="title"]{margin:0;font-size:1rem;font-weight:680;line-height:1.3}
[data-vibeui-block="empty-004"] [data-part="text"]{
margin:0;max-width:32ch;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-empty-004-muted);
}
[data-vibeui-block="empty-004"] [data-part="action"]{
appearance:none;border:0;cursor:pointer;margin-top:0.5rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.375rem 1.125rem;border-radius:0.75rem;
background:var(--vibeui-empty-004-accent);color:var(--vibeui-empty-004-accent-fg);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="empty-004"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-empty-004-accent);outline-offset:2px}
[data-vibeui-block="empty-004"] [data-part="formats"]{
margin:0.375rem 0 0;font-size:0.6875rem;color:var(--vibeui-empty-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="empty-004"] *{animation:none!important;transition:none!important}}
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
 * Пустая папка как область загрузки: рамка, стрелка и одно действие.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Empty004({
  title = "В папке пока пусто",
  text = "Перетащите файлы прямо сюда или выберите их на диске — они появятся в этой папке.",
  actionLabel = "Выбрать файлы",
  formats = "PDF, PNG, JPG, ZIP — до 50 МБ",
  onAction,
  background = "",
  accent,
  className,
  style,
  ...props
}: Empty004Props) {
  const palette = {
    ...(accent ? { "--vibeui-empty-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-empty-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-empty-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="empty"
        data-vibeui-block="empty-004"
        className={className}
        style={palette}
      >
        <span data-part="mark" aria-hidden="true">
          <i />
        </span>
        <h3 data-part="title">{title}</h3>
        <p data-part="text">{text}</p>
        <button type="button" data-part="action" onClick={onAction}>
          {actionLabel}
        </button>
        <p data-part="formats">{formats}</p>
      </div>
    </>
  )
}
