import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Hovercard002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  /** Текст ссылки в строке. */
  anchorText?: string
  title?: string
  domain?: string
  excerpt?: string
  href?: string
}

// Идея компонента: превью страницы у ссылки. Вместо картинки — обложка из
// градиента и первой буквы домена: реальный скриншот пришлось бы качать, а
// компонент обязан работать без сети и без единой зависимости.
const STYLES = `
:where([data-vibeui-block="hovercard-002"]){
--vibeui-hovercard-002-bg:oklch(1 0 0);
--vibeui-hovercard-002-fg:oklch(0.22 0.014 265);
--vibeui-hovercard-002-muted:oklch(0.55 0.014 265);
--vibeui-hovercard-002-border:oklch(0.9 0.006 265);
--vibeui-hovercard-002-hue:250;
--vibeui-hovercard-002-accent:oklch(0.53 0.16 255);
--vibeui-hovercard-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="hovercard-002"]{
width:100%;max-width:28rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-hovercard-002-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-002-bg);
font-family:var(--vibeui-hovercard-002-font);color:var(--vibeui-hovercard-002-fg);
}
[data-vibeui-block="hovercard-002"] [data-part="line"]{margin:0;font-size:0.875rem;line-height:1.7}
/* Ссылка живёт в строке текста: карточка цепляется к ней, а не к абзацу. */
[data-vibeui-block="hovercard-002"] [data-part="host"]{position:relative;display:inline-block}
[data-vibeui-block="hovercard-002"] [data-part="link"]{
color:var(--vibeui-hovercard-002-accent);font-weight:600;
text-decoration:underline;text-underline-offset:0.2em;border-radius:0.25rem;
}
[data-vibeui-block="hovercard-002"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-hovercard-002-accent);outline-offset:2px}
[data-vibeui-block="hovercard-002"] [data-part="card"]{
position:absolute;left:0;top:calc(100% + 0.5rem);z-index:20;
display:flex;flex-direction:column;
width:17rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-hovercard-002-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-002-bg);
box-shadow:0 22px 46px -28px oklch(0.2 0.02 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .15s ease,translate .15s ease,visibility .15s;
}
[data-vibeui-block="hovercard-002"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-002"] [data-part="host"]:focus-within [data-part="card"]{opacity:1;visibility:visible;translate:0 0}
/* Обложка вместо скриншота: градиент по оттенку домена и его первая буква. */
[data-vibeui-block="hovercard-002"] [data-part="cover"]{
display:flex;align-items:center;justify-content:center;
height:4.5rem;
background:linear-gradient(135deg,
oklch(0.72 0.13 var(--vibeui-hovercard-002-hue)),
oklch(0.55 0.16 calc(var(--vibeui-hovercard-002-hue) + 40)));
color:oklch(0.99 0.01 var(--vibeui-hovercard-002-hue));
font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;
text-transform:uppercase;
}
[data-vibeui-block="hovercard-002"] [data-part="body"]{display:flex;flex-direction:column;gap:0.25rem;padding:0.6875rem 0.8125rem 0.8125rem}
[data-vibeui-block="hovercard-002"] [data-part="domain"]{
display:flex;align-items:center;gap:0.3125rem;
font-size:0.6875rem;letter-spacing:0.02em;color:var(--vibeui-hovercard-002-muted);
}
[data-vibeui-block="hovercard-002"] [data-part="favicon"]{
width:0.75rem;height:0.75rem;border-radius:0.1875rem;flex:none;
background:oklch(0.62 0.15 var(--vibeui-hovercard-002-hue));
}
[data-vibeui-block="hovercard-002"] [data-part="title"]{
font-size:0.875rem;font-weight:650;line-height:1.3;
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;
}
[data-vibeui-block="hovercard-002"] [data-part="excerpt"]{
font-size:0.75rem;line-height:1.45;color:var(--vibeui-hovercard-002-muted);
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hovercard-002"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

/**
 * Карточка превью страницы у ссылки: обложка, домен, заголовок и отрывок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Hovercard002({
  anchorText = "разбор популярных ошибок вёрстки",
  title = "Двенадцать ошибок вёрстки, которые видно с телефона",
  domain = "web.dev.example",
  excerpt = "Что ломается на узких экранах чаще всего: фиксированные ширины, шрифт меньше 16 пикселей, скрытый фокус и горизонтальная прокрутка у таблиц.",
  href = "#article",
  className,
  style,
  ...props
}: Hovercard002Props) {
  const palette = {
    "--vibeui-hovercard-002-hue": hue(domain),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="hovercard-002"
        className={className}
        style={palette}
      >
        <p data-part="line">
          Подробнее об этом —{" "}
          <span data-part="host">
            <a
              data-part="link"
              href={href}
              aria-describedby="vibeui-hovercard-002-card"
            >
              {anchorText}
            </a>
            <span
              data-part="card"
              id="vibeui-hovercard-002-card"
              role="tooltip"
            >
              <span data-part="cover" aria-hidden="true">
                {domain[0]}
              </span>
              <span data-part="body">
                <span data-part="domain">
                  <span data-part="favicon" aria-hidden="true" />
                  {domain}
                </span>
                <span data-part="title">{title}</span>
                <span data-part="excerpt">{excerpt}</span>
              </span>
            </span>
          </span>{" "}
          — наведите, чтобы увидеть, куда она ведёт.
        </p>
      </div>
    </>
  )
}
