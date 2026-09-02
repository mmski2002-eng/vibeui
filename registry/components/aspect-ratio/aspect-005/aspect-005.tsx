import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Aspect005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  accent?: string
}

// Идея компонента: широкая полоса 21:9 — киношная пропорция для баннера во
// всю ширину страницы. Такая полоса не должна становиться высокой на телефоне,
// поэтому на узкой ширине соотношение переключается на 4:3 через container:
// 21:9 в 360 пикселях превратилось бы в щель высотой 154 пикселя.
//
// Полоса намеренно тёмная в обеих темах: это подложка под фотографию и
// светлый текст, а не панель интерфейса. Светлая ветка light-dark() отняла бы
// у баннера контраст, поэтому палитра здесь одна на обе темы.
const STYLES = `
:where([data-vibeui-block="aspect-005"]){
--vibeui-aspect-005-ink:oklch(0.2 0.02 265);
--vibeui-aspect-005-fg:oklch(0.99 0.003 265);
--vibeui-aspect-005-muted:oklch(0.84 0.012 265);
--vibeui-aspect-005-accent:oklch(0.72 0.16 195);
--vibeui-aspect-005-radius:1rem;
--vibeui-aspect-005-ratio:21 / 9;
--vibeui-aspect-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="aspect-005"]{display:block;width:100%;box-sizing:border-box}
/* Раскладка живёт на внутренней рамке, а не на корне: контейнерный запрос
   применяется к потомкам контейнера, но не к нему самому. */
[data-vibeui-block="aspect-005"] [data-part="frame"]{
position:relative;display:flex;align-items:center;
width:100%;box-sizing:border-box;overflow:hidden;
aspect-ratio:var(--vibeui-aspect-005-ratio);
border-radius:var(--vibeui-aspect-005-radius);
background:
radial-gradient(80% 140% at 12% 50%,color-mix(in oklab,var(--vibeui-aspect-005-accent) 40%,transparent),transparent 60%),
linear-gradient(120deg,var(--vibeui-aspect-005-ink),oklch(0.3 0.05 285));
color:var(--vibeui-aspect-005-fg);font-family:var(--vibeui-aspect-005-font);
}
[data-vibeui-block="aspect-005"] [data-part="frame"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
[data-vibeui-block="aspect-005"] [data-part="text"]{
position:relative;display:flex;flex-direction:column;gap:0.375rem;
max-width:32rem;padding:0 clamp(1rem,4cqi,3rem);
}
[data-vibeui-block="aspect-005"] [data-part="title"]{
margin:0;font-size:clamp(1.125rem,3.4cqi,2rem);line-height:1.15;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="aspect-005"] [data-part="description"]{
margin:0;font-size:clamp(0.8125rem,1.5cqi,1rem);line-height:1.5;color:var(--vibeui-aspect-005-muted);
}
[data-vibeui-block="aspect-005"] [data-part="action"]{
align-self:flex-start;margin-top:0.5rem;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;text-decoration:none;
background:var(--vibeui-aspect-005-accent);color:oklch(0.18 0.02 195);
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="aspect-005"] [data-part="action"]:hover{filter:brightness(0.95)}
[data-vibeui-block="aspect-005"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-aspect-005-accent);outline-offset:3px}
/* Узкая полоса: 21:9 на телефоне превращается в щель, поэтому 4:3. */
@container (max-width: 30rem){
[data-vibeui-block="aspect-005"] [data-part="frame"]{--vibeui-aspect-005-ratio:4 / 3}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="aspect-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Широкая полоса 21:9, которая на телефоне становится 4:3.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect005({
  title = "Соберите страницу за вечер",
  description = "Готовые блоки, установка одной командой и инструкция для ИИ-агента.",
  actionLabel = "Открыть каталог",
  actionHref = "#",
  accent,
  className,
  style,
  ...props
}: Aspect005Props) {
  const palette = {
    ...(accent ? { "--vibeui-aspect-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-aspect-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="aspect-005"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <span data-part="text">
            <span data-part="title">{title}</span>
            {description ? (
              <span data-part="description">{description}</span>
            ) : null}
            {actionLabel ? (
              <a data-part="action" href={actionHref}>
                {actionLabel}
              </a>
            ) : null}
          </span>
        </div>
      </div>
    </>
  )
}
