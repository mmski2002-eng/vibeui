import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Aspect004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "title" | "children"
> & {
  title?: string
  subtitle?: string
  /** Надпись в верхнем углу: рубрика, дата, номер выпуска. */
  eyebrow?: string
  href?: string
  /** Тон градиента под подписью: им кадр тонируется, а не чернится. */
  ink?: string
  accent?: string
}

// Идея компонента: портретный кадр 3:4 с подписью поверх нижней части.
// Текст читается на любой фотографии, потому что под ним лежит градиент из
// собственного тёмного тона, а не полупрозрачный чёрный: чёрная плёнка на
// тёплом снимке даёт грязный серый, а тонированный градиент — нет.
//
// Кадр намеренно остаётся тёмным в обеих темах: это обложка со снимком, а не
// панель интерфейса. Светлая ветка сделала бы подпись поверх фотографии
// нечитаемой, поэтому light-dark() здесь не применяется.
const STYLES = `
:where([data-vibeui-block="aspect-004"]){
--vibeui-aspect-004-ink:oklch(0.18 0.02 265);
--vibeui-aspect-004-fg:oklch(0.99 0.003 265);
--vibeui-aspect-004-muted:oklch(0.86 0.01 265);
--vibeui-aspect-004-accent:oklch(0.75 0.14 75);
--vibeui-aspect-004-radius:1rem;
--vibeui-aspect-004-serif:ui-serif,Georgia,"Times New Roman",Times,serif;
--vibeui-aspect-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="aspect-004"]{
position:relative;display:block;width:100%;max-width:20rem;box-sizing:border-box;overflow:hidden;
aspect-ratio:3 / 4;border-radius:var(--vibeui-aspect-004-radius);
background:
radial-gradient(90% 70% at 70% 15%,oklch(0.62 0.09 60),transparent 65%),
linear-gradient(165deg,oklch(0.5 0.07 40),oklch(0.28 0.04 285));
color:var(--vibeui-aspect-004-fg);font-family:var(--vibeui-aspect-004-font);
text-decoration:none;
}
[data-vibeui-block="aspect-004"] img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
/* Тонированный градиент вместо чёрной плёнки: она пачкает тёплый снимок. */
[data-vibeui-block="aspect-004"] [data-part="veil"]{
position:absolute;inset:auto 0 0;height:62%;pointer-events:none;
background:linear-gradient(to top,var(--vibeui-aspect-004-ink) 8%,color-mix(in oklab,var(--vibeui-aspect-004-ink) 55%,transparent) 45%,transparent);
}
[data-vibeui-block="aspect-004"] [data-part="eyebrow"]{
position:absolute;left:1rem;top:1rem;
padding:0.1875rem 0.5rem;border-radius:9999px;
background:oklch(1 0 0 / 16%);backdrop-filter:blur(4px);
font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="aspect-004"] [data-part="text"]{
position:absolute;left:0;right:0;bottom:0;padding:1.125rem;
display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="aspect-004"] [data-part="title"]{
margin:0;font-family:var(--vibeui-aspect-004-serif);
font-size:clamp(1.125rem,7cqi,1.75rem);line-height:1.15;letter-spacing:-0.01em;
}
[data-vibeui-block="aspect-004"] [data-part="subtitle"]{font-size:0.8125rem;line-height:1.4;color:var(--vibeui-aspect-004-muted)}
[data-vibeui-block="aspect-004"]:focus-visible{outline:2px solid var(--vibeui-aspect-004-accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="aspect-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Портретный кадр 3:4 с подписью поверх тонированного градиента.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Aspect004({
  title = "Вечерний свет над мастерской",
  subtitle = "Съёмка студии «Полёт», март",
  eyebrow = "Портфолио",
  href = "#",
  ink,
  accent,
  className,
  style,
  ...props
}: Aspect004Props) {
  const palette = {
    ...(ink ? { "--vibeui-aspect-004-ink": ink } : null),
    ...(accent ? { "--vibeui-aspect-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  const content = (
    <>
      <span data-part="veil" aria-hidden="true" />
      {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
      <span data-part="text">
        <span data-part="title">{title}</span>
        {subtitle ? <span data-part="subtitle">{subtitle}</span> : null}
      </span>
    </>
  )

  return (
    <>
      <style href="vibeui-aspect-004" precedence="medium">
        {STYLES}
      </style>
      {href ? (
        <a
          data-vibeui-block="aspect-004"
          href={href}
          className={className}
          style={palette}
        >
          {content}
        </a>
      ) : (
        <div
          {...props}
          data-vibeui-block="aspect-004"
          className={className}
          style={palette}
        >
          {content}
        </div>
      )}
    </>
  )
}
