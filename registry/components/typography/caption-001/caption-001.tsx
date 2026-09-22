import type { ComponentProps, CSSProperties } from "react"

export type Caption001Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  eyebrow?: string
  title?: string
  note?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Часть блока surface-025, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="caption-001"]){
--vibeui-caption-001-muted:light-dark(color-mix(in oklab,#1c1917 55%,#faf7f2),color-mix(in oklab,#f2efe9 60%,#1c1a18));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="caption-001"]{color-scheme:dark}
[data-vibeui-block="caption-001"]{box-sizing:border-box}
[data-vibeui-block="caption-001"] *{box-sizing:border-box}
[data-vibeui-block="caption-001"]{box-sizing:border-box;position:relative;max-width:72rem;margin:0 auto;padding:4rem 1.5rem;min-height:18rem;display:grid;align-content:center;gap:.75rem}
[data-vibeui-block="caption-001"] > [data-part="eyebrow"]{margin:0;font-size:.75rem;font-weight:650;letter-spacing:.14em;text-transform:uppercase;color:var(--vibeui-caption-001-muted)}
[data-vibeui-block="caption-001"] > [data-part="title"]{margin:0;max-width:20ch;font-size:clamp(1.75rem,5cqi,3rem);line-height:1.05;letter-spacing:-.02em;font-weight:700;text-wrap:balance}
[data-vibeui-block="caption-001"] > [data-part="note"]{margin:0;max-width:44ch;font-size:1rem;line-height:1.55;color:var(--vibeui-caption-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="caption-001"] *{animation:none!important;transition:none!important}}
`

/** Демонстрационная подпись подложки: надзаголовок, заголовок и заметка на полях. */
export function Caption001({
  eyebrow = "Тетрадный лист",
  title = "Клетка, линейка или точки",
  note = "Разлиновка из CSS-градиентов: ничего не грузит и не считает. Шаг, приглушение и крупная клетка — пропсами; содержимое кладётся поверх.",
  accent,
  className,
  style,
  ...props
}: Caption001Props) {
  const palette = {
    ...(accent ? { "--vibeui-caption-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-caption-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="typography"
        data-vibeui-block="caption-001"
        className={className}
        style={palette}
      >
        {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
        {title ? <h2 data-part="title">{title}</h2> : null}
        {note ? <p data-part="note">{note}</p> : null}
      </div>
    </>
  )
}
