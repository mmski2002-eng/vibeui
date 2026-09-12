import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Popover008Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  title?: string
  /** Подпись пункта, который открывает второй, вложенный поповер. */
  nestedLabel?: string
  /** Уровни доступа во вложенном поповере. */
  levels?: string[]
  /** Подпись первого пункта первой панели. */
  copyLabel?: string
  /** Подпись второго пункта первой панели. */
  inviteLabel?: string
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Подложка панелей и кнопки. Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: поповер внутри поповера. Кнопка второго уровня лежит внутри
// первой панели, поэтому браузер считает панели вложенными и не закрывает
// родителя при открытии ребёнка; Escape закрывает их по одному, изнутри наружу.
const STYLES = `
:where([data-vibeui-block="popover-008"]){
--vibeui-popover-008-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-popover-008-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-popover-008-muted:color-mix(in oklab,var(--vibeui-popover-008-fg) 68%,transparent);
--vibeui-popover-008-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-popover-008-hover:light-dark(oklch(0.965 0 265),oklch(0.27 0 265));
--vibeui-popover-008-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-popover-008-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.02 0 265 / 72%));
--vibeui-popover-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-008"]{color-scheme:dark}
[data-vibeui-block="popover-008"]{
position:relative;display:inline-block;
font-family:var(--vibeui-popover-008-font);color:var(--vibeui-popover-008-fg);
}
[data-vibeui-block="popover-008"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.9375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-popover-008-border);
background:var(--vibeui-popover-008-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:640;
anchor-name:--vibeui-popover-008-anchor;
}
[data-vibeui-block="popover-008"] [data-part="trigger"]:hover{background:var(--vibeui-popover-008-hover)}
[data-vibeui-block="popover-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-008-accent);outline-offset:2px}
/* Обе панели получают раскладку только в :popover-open. display в обычном
   правиле перебивает браузерный display:none — панель зависает открытой. */
[data-vibeui-block="popover-008"] [data-part="panel"],
[data-vibeui-block="popover-008"] [data-part="nested"]{
position:fixed;margin:0;padding:0.5rem;
box-sizing:border-box;
border:1px solid var(--vibeui-popover-008-border);border-radius:0.875rem;
background:var(--vibeui-popover-008-bg);color:inherit;
box-shadow:0 24px 52px -30px var(--vibeui-popover-008-shadow);
}
[data-vibeui-block="popover-008"] [data-part="panel"]{
width:min(16rem,100vw - 2rem);
position-anchor:--vibeui-popover-008-anchor;inset:auto;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
}
[data-vibeui-block="popover-008"] [data-part="nested"]{
width:min(14rem,100vw - 2rem);
position-anchor:--vibeui-popover-008-sub;inset:auto;
top:anchor(top);left:anchor(right);margin-left:0.5rem;
}
[data-vibeui-block="popover-008"] [data-part="panel"]:popover-open,
[data-vibeui-block="popover-008"] [data-part="nested"]:popover-open{display:flex;flex-direction:column;gap:0.125rem}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-008"] [data-part="panel"]{position:absolute;inset:auto;top:calc(100% + 0.5rem);left:0}
[data-vibeui-block="popover-008"] [data-part="nested"]{position:absolute;inset:auto;top:calc(100% + 0.5rem);left:0;margin-left:0}
}
[data-vibeui-block="popover-008"] [data-part="caption"]{
margin:0.125rem 0.375rem 0.375rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-popover-008-muted);
}
[data-vibeui-block="popover-008"] [data-part="row"]{
appearance:none;cursor:pointer;border:0;background:transparent;
display:flex;align-items:center;gap:0.5rem;width:100%;box-sizing:border-box;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
color:inherit;font:inherit;font-size:0.8125rem;text-align:left;
text-decoration:none;
transition:background-color .14s ease;
}
[data-vibeui-block="popover-008"] [data-part="row"]:hover{background:var(--vibeui-popover-008-hover)}
[data-vibeui-block="popover-008"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-popover-008-accent);outline-offset:-2px}
[data-vibeui-block="popover-008"] [data-part="row"][data-sub]{anchor-name:--vibeui-popover-008-sub}
[data-vibeui-block="popover-008"] [data-part="row"][data-sub]::after{content:"›";margin-left:auto;color:var(--vibeui-popover-008-muted);font-size:1rem;line-height:1}
[data-vibeui-block="popover-008"] [data-part="mark"]{
flex:none;width:1.125rem;text-align:center;color:var(--vibeui-popover-008-muted);
}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя.
   Только пока popover закрыт: у открытого положение задаёт верхний слой,
   и static отправил бы панель в левый верхний угол экрана. */
[data-vibeui-block="popover-008"][data-open] [popover]:not(:popover-open){
display:flex;flex-direction:column;gap:0.125rem;position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LEVELS = ["Только чтение", "Комментирование", "Редактирование"]

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
 * Поповер с вложенным вторым поповером: родитель не закрывается при открытии ребёнка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover008({
  label = "Поделиться",
  title = "Доступ к документу",
  nestedLabel = "Уровень доступа",
  levels = DEFAULT_LEVELS,
  copyLabel = "Скопировать ссылку",
  inviteLabel = "Пригласить по почте",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover008Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-popover-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-008"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button type="button" data-part="trigger" popoverTarget={`${id}-panel`}>
          <span aria-hidden="true">↗</span>
          {label}
        </button>
        <div
          data-part="panel"
          id={`${id}-panel`}
          popover="auto"
          aria-label={title}
        >
          <p data-part="caption">{title}</p>
          <button type="button" data-part="row">
            <span data-part="mark" aria-hidden="true">
              ⧉
            </span>
            {copyLabel}
          </button>
          <button type="button" data-part="row">
            <span data-part="mark" aria-hidden="true">
              ✉
            </span>
            {inviteLabel}
          </button>
          <button
            type="button"
            data-part="row"
            data-sub=""
            popoverTarget={`${id}-nested`}
          >
            <span data-part="mark" aria-hidden="true">
              ⚙
            </span>
            {nestedLabel}
          </button>
          <div
            data-part="nested"
            id={`${id}-nested`}
            popover="auto"
            aria-label={nestedLabel}
          >
            <p data-part="caption">{nestedLabel}</p>
            {levels.map((level, index) => (
              <button type="button" data-part="row" key={level}>
                <span data-part="mark" aria-hidden="true">
                  {index === 0 ? "✓" : ""}
                </span>
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
