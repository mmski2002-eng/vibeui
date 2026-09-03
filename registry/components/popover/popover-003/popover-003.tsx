import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover003Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  label?: string
  title?: string
  /** Что именно произойдёт: «удалим 12 файлов», а не «вы уверены?». */
  text?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  /** Тон опасности: заливка подтверждения и обводка фокуса. */
  danger?: string
  /** Подложка панели и кнопки. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: подтверждение у самой кнопки, а не модальным окном на весь
// экран. Вопрос называет последствие, а не спрашивает «уверены ли вы»;
// отмена стоит первой, потому что случайный Enter не должен удалять данные.
const STYLES = `
:where([data-vibeui-block="popover-003"]){
--vibeui-popover-003-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-popover-003-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-popover-003-muted:color-mix(in oklab,var(--vibeui-popover-003-fg) 68%,transparent);
--vibeui-popover-003-border:light-dark(oklch(0.89 0.006 265),oklch(0.36 0.012 265));
--vibeui-popover-003-hover:light-dark(oklch(0.96 0.004 265),oklch(0.27 0.014 265));
--vibeui-popover-003-danger:light-dark(oklch(0.55 0.2 25),oklch(0.72 0.17 25));
--vibeui-popover-003-on-danger:light-dark(oklch(0.99 0.01 25),oklch(0.18 0.03 25));
--vibeui-popover-003-shadow:light-dark(oklch(0.2 0.02 265 / 60%),oklch(0.02 0.01 265 / 72%));
--vibeui-popover-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-003"]{color-scheme:dark}
[data-vibeui-block="popover-003"]{
position:relative;display:inline-block;
font-family:var(--vibeui-popover-003-font);color:var(--vibeui-popover-003-fg);
}
[data-vibeui-block="popover-003"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid color-mix(in oklab,var(--vibeui-popover-003-danger) 35%,var(--vibeui-popover-003-border));
background:var(--vibeui-popover-003-bg);color:var(--vibeui-popover-003-danger);
font:inherit;font-size:0.8125rem;font-weight:650;
anchor-name:--vibeui-popover-003-anchor;
}
[data-vibeui-block="popover-003"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-popover-003-danger) 10%,var(--vibeui-popover-003-bg))}
[data-vibeui-block="popover-003"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-003-danger);outline-offset:2px}
/* Раскладка панели только в :popover-open: display в обычном правиле
   перебил бы браузерный display:none и панель висела бы открытой. */
[data-vibeui-block="popover-003"] [data-part="panel"]{
position:fixed;margin:0;padding:0.875rem;
width:min(17.5rem,100vw - 2rem);box-sizing:border-box;
border:1px solid var(--vibeui-popover-003-border);border-radius:0.875rem;
background:var(--vibeui-popover-003-bg);color:inherit;
box-shadow:0 24px 50px -30px var(--vibeui-popover-003-shadow);
position-anchor:--vibeui-popover-003-anchor;
top:anchor(bottom);left:anchor(center);translate:-50% 0;margin-top:0.5rem;
}
[data-vibeui-block="popover-003"] [data-part="panel"]:popover-open{display:block}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-003"] [data-part="panel"]{position:absolute;inset:auto;top:calc(100% + 0.5rem);left:0;translate:0 0}
}
[data-vibeui-block="popover-003"] [data-part="title"]{margin:0 0 0.25rem;font-size:0.875rem;font-weight:660;line-height:1.3}
[data-vibeui-block="popover-003"] [data-part="text"]{margin:0 0 0.75rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-popover-003-muted)}
[data-vibeui-block="popover-003"] [data-part="row"]{display:flex;gap:0.5rem;justify-content:flex-end}
[data-vibeui-block="popover-003"] [data-part="cancel"],
[data-vibeui-block="popover-003"] [data-part="confirm"]{
appearance:none;cursor:pointer;
height:2rem;padding:0 0.8125rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="popover-003"] [data-part="cancel"]{
border:1px solid var(--vibeui-popover-003-border);background:transparent;color:var(--vibeui-popover-003-fg);
}
[data-vibeui-block="popover-003"] [data-part="cancel"]:hover{background:var(--vibeui-popover-003-hover)}
[data-vibeui-block="popover-003"] [data-part="confirm"]{
border:0;background:var(--vibeui-popover-003-danger);color:var(--vibeui-popover-003-on-danger);
}
[data-vibeui-block="popover-003"] [data-part="cancel"]:focus-visible,
[data-vibeui-block="popover-003"] [data-part="confirm"]:focus-visible{outline:2px solid var(--vibeui-popover-003-danger);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Поповер подтверждения у кнопки: последствие названо, отмена стоит первой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover003({
  label = "Удалить папку",
  title = "Удалить «Архив 2024»?",
  text = "Вместе с папкой удалятся 128 файлов. Восстановить их можно 30 дней в корзине.",
  confirmLabel = "Удалить",
  cancelLabel = "Отмена",
  onConfirm,
  danger,
  background = "",
  className,
  style,
  ...props
}: Popover003Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(danger ? { "--vibeui-popover-003-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-popover-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-003"
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" popoverTarget={`${id}-panel`}>
          {label}
        </button>
        <div
          data-part="panel"
          id={`${id}-panel`}
          popover="auto"
          aria-label={title}
        >
          <p data-part="title">{title}</p>
          <p data-part="text">{text}</p>
          <div data-part="row">
            <button
              type="button"
              data-part="cancel"
              popoverTarget={`${id}-panel`}
              popoverTargetAction="hide"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              data-part="confirm"
              onClick={onConfirm}
              popoverTarget={`${id}-panel`}
              popoverTargetAction="hide"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
