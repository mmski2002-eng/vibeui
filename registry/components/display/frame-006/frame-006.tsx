import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react"

export type Frame006Props = ComponentPropsWithoutRef<"figure"> & {
  caption?: string
  index?: number
  source?: string
  align?: "start" | "center"
  children?: ReactNode
}

// Идея компонента: рамка с подписью под содержимым. Подпись — это figcaption
// внутри figure, а не абзац рядом: только так связь картинки и текста видна
// скринридеру. Номер рисунка набран отдельным элементом и не переносится
// вместе с текстом; источник вынесен в третью строку, потому что слитая
// подпись «Рис. 2. Каталог. Скриншот» читается как одно предложение.
const STYLES = `
:where([data-vibeui-block="frame-006"]){
--vibeui-frame-006-bg:oklch(1 0 0);
--vibeui-frame-006-media:oklch(0.96 0.004 265);
--vibeui-frame-006-fg:oklch(0.23 0.014 265);
--vibeui-frame-006-muted:oklch(0.55 0.014 265);
--vibeui-frame-006-border:oklch(0.9 0.006 265);
--vibeui-frame-006-accent:oklch(0.52 0.16 262);
--vibeui-frame-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="frame-006"]{
display:flex;flex-direction:column;gap:0.625rem;margin:0;
width:100%;max-width:30rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-frame-006-bg);
border:1px solid var(--vibeui-frame-006-border);border-radius:1rem;
font-family:var(--vibeui-frame-006-font);color:var(--vibeui-frame-006-fg);
}
[data-vibeui-block="frame-006"] *{box-sizing:border-box}
[data-vibeui-block="frame-006"] [data-part="media"]{
overflow:hidden;aspect-ratio:16 / 10;
background:var(--vibeui-frame-006-media);
border:1px solid var(--vibeui-frame-006-border);border-radius:0.75rem;
}
[data-vibeui-block="frame-006"] [data-part="media"] > *{display:block;width:100%}
[data-vibeui-block="frame-006"] img{display:block;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="frame-006"] [data-part="stub"]{
display:grid;place-items:center;height:100%;padding:1rem;
font-size:0.8125rem;color:var(--vibeui-frame-006-muted);
}
[data-vibeui-block="frame-006"] figcaption{
display:flex;flex-direction:column;gap:0.1875rem;
font-size:0.8125rem;line-height:1.45;
}
[data-vibeui-block="frame-006"][data-align="center"] figcaption{align-items:center;text-align:center}
/* Номер отдельным элементом: он не должен переноситься вместе с подписью. */
[data-vibeui-block="frame-006"] [data-part="index"]{
color:var(--vibeui-frame-006-accent);font-weight:700;
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="frame-006"] [data-part="text"]{margin:0}
[data-vibeui-block="frame-006"] [data-part="source"]{
font-size:0.6875rem;color:var(--vibeui-frame-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Рамка с нумерованной подписью и строкой источника под содержимым.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame006({
  caption = "Каталог компонентов: карточка раскрывает превью по наведению",
  index = 2,
  source = "Источник: скриншот VibeUI, август 2026",
  align = "start",
  children,
  className,
  style,
  ...props
}: Frame006Props) {
  return (
    <>
      <style href="vibeui-frame-006" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-vibeui-block="frame-006"
        data-align={align}
        className={className}
        style={style as CSSProperties}
      >
        <div data-part="media">
          {children ?? <div data-part="stub">Место под скриншот</div>}
        </div>
        <figcaption>
          <span data-part="index">Рис. {index}</span>
          <p data-part="text">{caption}</p>
          {source ? <span data-part="source">{source}</span> : null}
        </figcaption>
      </figure>
    </>
  )
}
