import type { ComponentProps, CSSProperties } from "react"

export type Logos001Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  logos?: string[]
  accent?: string
  /** Лента едет в обратную сторону. */
  reverse?: boolean
}

// Идея: полноширинная секция с облаком лого партнёров — бесконечная лента,
// которая едет вбок по кругу (translateX от 0 до -50%). Ряд удваивается:
// вторая копия аккуратно продолжает первую, и переход между ними незаметен.
// Настоящих логотипов нет — вместо них монохромные плейсхолдеры (плитка с
// инициалом плюс имя), приглушённые по умолчанию и чёткие под курсором.
// Наведение на ленту ставит анимацию на паузу — так имя удобно прочитать.
//
// Тема берётся из окружения: light-dark() смотрит на color-scheme, поэтому
// класс .dark чужого проекта переводит секцию в тёмную ветку отдельной
// строкой ниже, а не собственной тёмной темой.
//
// container-type делает секцию собственным query-контейнером: раскладка
// считается от её ширины, а не от ширины окна.
const STYLES = `
:where([data-vibeui-block="logos-001"]){
--vibeui-logos-001-bg:transparent;
--vibeui-logos-001-fg:light-dark(oklch(0.22 0 266),oklch(0.96 0 266));
--vibeui-logos-001-muted:light-dark(oklch(0.5 0 266),oklch(0.72 0 266));
--vibeui-logos-001-border:light-dark(oklch(0.16 0 266 / 12%),oklch(1 0 0 / 14%));
--vibeui-logos-001-accent:light-dark(oklch(0.55 0.19 264),oklch(0.72 0.163 264));
--vibeui-logos-001-accent-fg:light-dark(oklch(0.99 0 266),oklch(0.17 0 266));
--vibeui-logos-001-mark-bg:color-mix(in oklab,var(--vibeui-logos-001-fg) 9%,transparent);
--vibeui-logos-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logos-001"]{color-scheme:dark}
[data-vibeui-block="logos-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
background:var(--vibeui-logos-001-bg);color:var(--vibeui-logos-001-fg);
font-family:var(--vibeui-logos-001-font);
container-type:inline-size;
}
[data-vibeui-block="logos-001"] *{box-sizing:border-box}
[data-vibeui-block="logos-001"] [data-part="frame"]{
padding:clamp(2.25rem,10cqi,4.5rem) clamp(1.25rem,6cqi,2.5rem);
}
[data-vibeui-block="logos-001"] [data-part="eyebrow"]{
margin:0 0 clamp(1.5rem,5cqi,2.5rem);text-align:center;
font-size:0.8125rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-logos-001-muted);
}
[data-vibeui-block="logos-001"] [data-part="track"]{
position:relative;overflow:hidden;
-webkit-mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent);
mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent);
}
[data-vibeui-block="logos-001"] [data-part="rail"]{
display:flex;align-items:center;gap:clamp(2rem,7cqi,3.5rem);width:max-content;
list-style:none;margin:0;padding:0;
animation:vibeui-logos-001-marquee 26s linear infinite;
}
[data-vibeui-block="logos-001"][data-reverse="true"] [data-part="rail"]{animation-direction:reverse}
[data-vibeui-block="logos-001"] [data-part="track"]:hover [data-part="rail"]{animation-play-state:paused}
[data-vibeui-block="logos-001"] [data-part="logo"]{
display:flex;align-items:center;gap:0.625rem;flex:none;
opacity:0.55;filter:grayscale(1);transition:opacity 0.2s ease,filter 0.2s ease;
}
[data-vibeui-block="logos-001"] [data-part="logo"]:hover{opacity:1;filter:grayscale(0)}
[data-vibeui-block="logos-001"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.875rem;height:1.875rem;border-radius:0.5rem;
background:var(--vibeui-logos-001-mark-bg);color:var(--vibeui-logos-001-fg);
font-size:0.8125rem;font-weight:700;
}
[data-vibeui-block="logos-001"] [data-part="word"]{
font-size:1.125rem;font-weight:650;letter-spacing:-0.01em;white-space:nowrap;
}
[data-vibeui-block="logos-001"] [data-part="sr-only"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@keyframes vibeui-logos-001-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="logos-001"] [data-part="rail"]{animation:none}
}
`

const DEFAULT_LOGOS = [
  "Acme",
  "Globex",
  "Umbrella",
  "Initech",
  "Hooli",
  "Stark",
  "Wayne",
  "Vertex",
]

/**
 * Облако лого партнёров с бесконечной лентой: ряд монохромных плейсхолдеров
 * едет вбок по кругу, тускнеет вне наведения. Один файл, ноль зависимостей,
 * собственная палитра.
 */
export function Logos001({
  title = "Нам доверяют команды по всему миру",
  logos = DEFAULT_LOGOS,
  accent,
  reverse = false,
  className,
  style,
  ...props
}: Logos001Props) {
  const palette = {
    ...(accent ? { "--vibeui-logos-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  const items = [...logos, ...logos]

  return (
    <>
      <style href="vibeui-logos-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="logos-001"
        data-slot="logo-cloud"
        data-reverse={reverse ? "true" : undefined}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          {title ? <p data-part="eyebrow">{title}</p> : null}
          {logos.length > 0 ? (
            <p data-part="sr-only">{logos.join(", ")}</p>
          ) : null}
          <div data-part="track">
            <ul data-part="rail" aria-hidden="true">
              {items.map((logo, index) => (
                <li data-part="logo" key={`${logo}-${index}`}>
                  <span data-part="mark" aria-hidden="true">
                    {logo.charAt(0)}
                  </span>
                  <span data-part="word">{logo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
