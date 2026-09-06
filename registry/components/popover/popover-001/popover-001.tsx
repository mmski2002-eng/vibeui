import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover001Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  label?: string
  title?: string
  text?: string
  actionLabel?: string
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка карточки и кнопки. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: всплывающая карточка с текстом и действием на HTML
// popover. Она отличается от подсказки тем, что в неё можно попасть мышью и
// с клавиатуры: внутри живут ссылки и кнопки. Поэтому она не закрывается по
// уходу курсора — только по Escape, клику вне или действию.
const STYLES = `
:where([data-vibeui-block="popover-001"]){
--vibeui-popover-001-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-popover-001-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-popover-001-muted:color-mix(in oklab,var(--vibeui-popover-001-fg) 68%,transparent);
--vibeui-popover-001-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-popover-001-hover:light-dark(oklch(0.96 0 265),oklch(0.27 0 265));
--vibeui-popover-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.73 0.15 265));
--vibeui-popover-001-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0 265));
--vibeui-popover-001-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.02 0 265 / 70%));
--vibeui-popover-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-001"]{color-scheme:dark}
[data-vibeui-block="popover-001"]{
display:inline-block;font-family:var(--vibeui-popover-001-font);color:var(--vibeui-popover-001-fg);
}
[data-vibeui-block="popover-001"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
height:2.25rem;padding:0 0.875rem;
border:1px solid var(--vibeui-popover-001-border);border-radius:0.625rem;
background:var(--vibeui-popover-001-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-popover-001-anchor;
}
[data-vibeui-block="popover-001"] [data-part="trigger"]:hover{background:var(--vibeui-popover-001-hover)}
[data-vibeui-block="popover-001"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-001-accent);outline-offset:2px}
/* Карточка на popover: слой, Escape и клик вне достаются от браузера. */
[data-vibeui-block="popover-001"] [popover]{
position:fixed;margin:0;padding:0.875rem;
width:min(18rem,100vw - 2rem);box-sizing:border-box;
border:1px solid var(--vibeui-popover-001-border);border-radius:0.875rem;
background:var(--vibeui-popover-001-bg);color:inherit;
box-shadow:0 20px 44px -24px var(--vibeui-popover-001-shadow);
position-anchor:--vibeui-popover-001-anchor;inset:auto;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-001"] [popover]{position:fixed;inset:0;margin:auto}
}
[data-vibeui-block="popover-001"] [data-part="title"]{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="popover-001"] [data-part="text"]{margin:0 0 0.625rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-popover-001-muted)}
[data-vibeui-block="popover-001"] [data-part="action"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2rem;padding:0.25rem 0.75rem;border:0;border-radius:0.5rem;
background:var(--vibeui-popover-001-accent);color:var(--vibeui-popover-001-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="popover-001"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-popover-001-accent);outline-offset:2px}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя.
   Только пока popover закрыт: у открытого положение задаёт верхний слой,
   и static отправил бы панель в левый верхний угол экрана. */
[data-vibeui-block="popover-001"][data-open] [popover]:not(:popover-open){
display:block;position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-001"] *{animation:none!important;transition:none!important}}
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
 * Всплывающая карточка на HTML popover: внутрь можно попасть мышью и Tab.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover001({
  label = "Что это значит",
  title = "Как считается охват",
  text = "Берём уникальных посетителей за семь дней и вычитаем ботов по списку известных агентов.",
  actionLabel = "Открыть методику",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover001Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-popover-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-001"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" popoverTarget={`${id}-card`}>
          {label}
        </button>
        <div id={`${id}-card`} popover="auto" aria-label={title}>
          <h3 data-part="title">{title}</h3>
          <p data-part="text">{text}</p>
          <button type="button" data-part="action">
            {actionLabel}
          </button>
        </div>
      </div>
    </>
  )
}
