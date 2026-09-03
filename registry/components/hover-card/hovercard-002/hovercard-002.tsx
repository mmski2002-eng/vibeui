"use client"

import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Hovercard002Props = Omit<ComponentProps<"div">, "children"> & {
  /** Текст ссылки в строке. */
  anchorText?: string
  title?: string
  domain?: string
  excerpt?: string
  href?: string
  /** Текст строки до ссылки. */
  leadText?: string
  /** Текст строки после ссылки. */
  tailText?: string
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: превью страницы у ссылки. Вместо картинки — обложка из
// градиента и первой буквы домена: реальный скриншот пришлось бы качать, а
// компонент обязан работать без сети и без единой зависимости.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// тёмной темы у компонента нет, он следует за страницей.
const STYLES = `
:where([data-vibeui-block="hovercard-002"]){
--vibeui-hovercard-002-bg:transparent;
--vibeui-hovercard-002-card:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-hovercard-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-hovercard-002-muted:color-mix(in oklab,var(--vibeui-hovercard-002-fg) 68%,transparent);
--vibeui-hovercard-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-hovercard-002-hue:250;
--vibeui-hovercard-002-accent:light-dark(oklch(0.53 0.16 255),oklch(0.75 0.14 255));
--vibeui-hovercard-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hovercard-002"]{color-scheme:dark}
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
background:var(--vibeui-hovercard-002-card);
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
background:light-dark(oklch(0.62 0.15 var(--vibeui-hovercard-002-hue)),oklch(0.74 0.14 var(--vibeui-hovercard-002-hue)));
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

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

/**
 * Escape убирает фокус с триггера. Карточка держится на :focus-within,
 * поэтому снятого фокуса достаточно, чтобы закрыть её с клавиатуры.
 */
function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
  if (event.key === "Escape") {
    ;(event.target as HTMLElement).blur()
  }
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
  leadText = "Подробнее об этом — ",
  tailText = " — наведите, чтобы увидеть, куда она ведёт.",
  accent,
  background = "",
  className,
  style,
  ...props
}: Hovercard002Props) {
  const palette = {
    "--vibeui-hovercard-002-hue": hue(domain),
    ...(accent ? { "--vibeui-hovercard-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hovercard-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hovercard-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="hover-card"
        onKeyDown={closeOnEscape}
        data-vibeui-block="hovercard-002"
        className={className}
        style={palette}
      >
        <p data-part="line">
          {leadText}
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
          </span>
          {tailText}
        </p>
      </div>
    </>
  )
}
