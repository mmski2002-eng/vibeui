import type { ComponentProps, CSSProperties } from "react"

export type Tooltip010Props = Omit<ComponentProps<"div">, "children"> & {
  /** Пункты меню: значок, подпись и сочетание клавиш одной строкой. */
  items?: { glyph: string; label: string; shortcut: string }[]
  /** Подпись перед чипом сочетания. */
  shortcutLabel?: string
  /** Показать подсказку второго пункта принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Пусто — подложки нет, панель лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: компактное меню значков, где полная подпись действия и
// его горячая клавиша живут внутри одной подсказки — единым чипом в конце
// строки, а не отдельными раскиданными <kbd>, как в подсказке-справочнике.
const STYLES = `
:where([data-vibeui-block="tooltip-010"]){
--vibeui-tooltip-010-bg:transparent;
--vibeui-tooltip-010-fg:light-dark(oklch(0.25 0 265),oklch(0.93 0 265));
--vibeui-tooltip-010-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-tooltip-010-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-tooltip-010-tip:light-dark(oklch(0.22 0 265),oklch(0.34 0 265));
--vibeui-tooltip-010-chip:oklch(1 0 0 / 16%);
--vibeui-tooltip-010-accent:light-dark(oklch(0.6 0.16 39.8),oklch(0.74 0.15 39.8));
--vibeui-tooltip-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-010"]{color-scheme:dark}
[data-vibeui-block="tooltip-010"]{
position:relative;
display:inline-flex;flex-direction:column;gap:0.125rem;
width:100%;max-width:15rem;box-sizing:border-box;
padding:0.375rem;border:1px solid var(--vibeui-tooltip-010-border);border-radius:0.875rem;
background:var(--vibeui-tooltip-010-bg);color:var(--vibeui-tooltip-010-fg);
font-family:var(--vibeui-tooltip-010-font);
}
[data-vibeui-block="tooltip-010"] [data-part="row"]{position:relative;display:flex}
[data-vibeui-block="tooltip-010"] [data-part="button"]{
appearance:none;cursor:pointer;width:100%;
display:flex;align-items:center;gap:0.625rem;
height:2.25rem;padding:0 0.625rem;border-radius:0.625rem;border:none;
background:transparent;color:inherit;font:inherit;font-size:0.8125rem;text-align:left;
}
[data-vibeui-block="tooltip-010"] [data-part="button"]:hover{background:var(--vibeui-tooltip-010-hover)}
[data-vibeui-block="tooltip-010"] [data-part="button"]:focus-visible{outline:2px solid var(--vibeui-tooltip-010-accent);outline-offset:-2px}
[data-vibeui-block="tooltip-010"] [data-part="glyph"]{flex:none;width:1.125rem;text-align:center;opacity:0.75}
/* Подсказка выезжает вправо от пункта, чип с клавишей — внутри неё же. */
[data-vibeui-block="tooltip-010"] [data-part="tip"]{
position:absolute;left:calc(100% + 0.5rem);top:50%;z-index:20;
display:flex;align-items:center;gap:0.5rem;
width:max-content;
padding:0.375rem 0.4375rem 0.375rem 0.625rem;border-radius:0.5rem;
/* Обе ветки --tip тёмные — плашка подсказки тёмная всегда, поэтому подпись светлая без light-dark(). */
background:var(--vibeui-tooltip-010-tip);color:oklch(0.98 0 265);
font-size:0.75rem;line-height:1.4;
pointer-events:none;opacity:0;
transform:translate(-0.25rem,-50%);
transition:opacity .13s ease,transform .13s ease;
}
[data-vibeui-block="tooltip-010"] [data-part="tip"]::before{
content:"";position:absolute;left:-0.1875rem;top:50%;
width:0.5rem;height:0.5rem;margin-top:-0.25rem;
background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-010"] [data-part="row"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-010"] [data-part="row"]:focus-within [data-part="tip"]{
opacity:1;transform:translate(0,-50%);
}
/* Витринный режим: раскрыта ровно одна подсказка второго пункта. Справа от
   меню места нет — в узком кадре витрины плашка ушла бы за край, поэтому она
   встаёт под своим пунктом, как на узком экране. */
[data-vibeui-block="tooltip-010"][data-open="true"] [data-part="row"]:nth-of-type(2) [data-part="tip"]{
opacity:1;left:0;top:calc(100% + 0.375rem);transform:none;
max-width:100%;flex-wrap:wrap;gap:0.25rem 0.5rem;overflow-wrap:anywhere;
}
[data-vibeui-block="tooltip-010"][data-open="true"] [data-part="row"]:nth-of-type(2) [data-part="tip"]::before{
left:0.75rem;top:-0.1875rem;margin-top:0;
}
/* Чип сочетания — одна строка целиком, а не клавиша за клавишей. */
[data-vibeui-block="tooltip-010"] [data-part="chip"]{
flex:none;padding:0.09375rem 0.375rem;border-radius:0.3125rem;
background:var(--vibeui-tooltip-010-chip);
font-family:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
font-size:0.6875rem;font-weight:600;letter-spacing:0.02em;
}
/* Между пунктом и краем экрана на 320px всего ~2rem — подсказке справа
   не хватает места ни при какой ширине. На узком экране она переезжает
   под пункт, где место есть. На широком экране это правило не действует. */
@media (max-width:32rem){
[data-vibeui-block="tooltip-010"] [data-part="tip"]{
left:0;top:calc(100% + 0.375rem);
flex-wrap:wrap;max-width:100%;overflow-wrap:anywhere;gap:0.25rem 0.5rem;
transform:translateY(-0.25rem);
}
[data-vibeui-block="tooltip-010"] [data-part="tip"]::before{
left:0.75rem;top:-0.1875rem;margin-top:0;
}
[data-vibeui-block="tooltip-010"] [data-part="row"]:hover [data-part="tip"],
[data-vibeui-block="tooltip-010"] [data-part="row"]:focus-within [data-part="tip"]{
transform:translateY(0);
}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = [
  { glyph: "↩", label: "Отменить", shortcut: "Ctrl+Z" },
  { glyph: "⧉", label: "Дублировать строку", shortcut: "Ctrl+D" },
  { glyph: "⌦", label: "Удалить выделенное", shortcut: "Backspace" },
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
 * Меню значков, где подсказка на пункте несёт и подпись, и чип горячей
 * клавиши в одной строке. Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip010({
  items = DEFAULT_ITEMS,
  shortcutLabel = "Сочетание клавиш",
  open = false,
  background = "",
  className,
  style,
  ...props
}: Tooltip010Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-010"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        {items.map((item, index) => {
          const id = `vibeui-tooltip-010-${index}`

          return (
            <span data-part="row" key={item.label}>
              <button data-part="button" type="button" aria-describedby={id}>
                <span data-part="glyph" aria-hidden="true">
                  {item.glyph}
                </span>
                {item.label}
              </button>
              <span data-part="tip" role="tooltip" id={id}>
                <span>{shortcutLabel}</span>
                <span data-part="chip">{item.shortcut}</span>
              </span>
            </span>
          )
        })}
      </div>
    </>
  )
}
