import { useId } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Popover001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "title"
> & {
  label?: string
  title?: string
  text?: string
  actionLabel?: string
  accent?: string
}

// Идея компонента: всплывающая карточка с текстом и действием на HTML
// popover. Она отличается от подсказки тем, что в неё можно попасть мышью и
// с клавиатуры: внутри живут ссылки и кнопки. Поэтому она не закрывается по
// уходу курсора — только по Escape, клику вне или действию.
const STYLES = `
:where([data-vibeui-block="popover-001"]){
--vibeui-popover-001-bg:oklch(1 0 0);
--vibeui-popover-001-fg:oklch(0.24 0.014 265);
--vibeui-popover-001-muted:oklch(0.56 0.014 265);
--vibeui-popover-001-border:oklch(0.9 0.006 265);
--vibeui-popover-001-hover:oklch(0.96 0.004 265);
--vibeui-popover-001-accent:oklch(0.55 0.17 265);
--vibeui-popover-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
box-shadow:0 20px 44px -24px oklch(0.2 0.02 265 / 55%);
position-anchor:--vibeui-popover-001-anchor;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-001"]{position:relative}
[data-vibeui-block="popover-001"] [popover]{position:absolute;top:calc(100% + 0.5rem);left:0;inset:auto}
}
[data-vibeui-block="popover-001"] [data-part="title"]{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650}
[data-vibeui-block="popover-001"] [data-part="text"]{margin:0 0 0.625rem;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-popover-001-muted)}
[data-vibeui-block="popover-001"] [data-part="action"]{
appearance:none;cursor:pointer;
height:2rem;padding:0 0.75rem;border:0;border-radius:0.5rem;
background:var(--vibeui-popover-001-accent);color:oklch(0.99 0.01 265);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="popover-001"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-popover-001-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Всплывающая карточка на HTML popover: внутрь можно попасть мышью и Tab.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover001({
  label = "Что это значит",
  title = "Как считается охват",
  text = "Берём уникальных посетителей за семь дней и вычитаем ботов по списку известных агентов.",
  actionLabel = "Открыть методику",
  accent,
  className,
  style,
  ...props
}: Popover001Props) {
  const id = useId().replace(/:/g, "")
  const palette = {
    ...(accent ? { "--vibeui-popover-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="popover-001"
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
