"use client"

import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Hovercard002Props = Omit<ComponentProps<"div">, "children"> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  /**
   * Показать превью раскрытым прямо в потоке: витрина, скриншот, отладка.
   * Ссылка остаётся на месте, карточка встаёт под ней и никуда не всплывает.
   */
  open?: boolean
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
--vibeui-hovercard-002-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-hovercard-002-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-hovercard-002-muted:color-mix(in oklab,var(--vibeui-hovercard-002-fg) 68%,transparent);
--vibeui-hovercard-002-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-hovercard-002-hue:250;
--vibeui-hovercard-002-accent:light-dark(oklch(0.53 0.16 39.8),oklch(0.75 0.14 39.8));
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
[data-vibeui-block="hovercard-002"] [data-part="host"]{position:relative;display:inline-block;anchor-name:--vibeui-hovercard-002-anchor}
[data-vibeui-block="hovercard-002"] [data-part="link"]{
color:var(--vibeui-hovercard-002-accent);font-weight:600;
text-decoration:underline;text-underline-offset:0.2em;border-radius:0.25rem;
}
[data-vibeui-block="hovercard-002"] [data-part="link"]:focus-visible{outline:2px solid var(--vibeui-hovercard-002-accent);outline-offset:2px}
[data-vibeui-block="hovercard-002"] [data-part="card"]{
/* fixed с привязкой к якорю: absolute режет рамка карточки каталога,
   а фиксированный слой её не замечает. */
position:fixed;inset:auto;position-anchor:--vibeui-hovercard-002-anchor;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;z-index:20;
display:flex;flex-direction:column;
width:17rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-hovercard-002-border);border-radius:0.875rem;
background:var(--vibeui-hovercard-002-card);
box-shadow:0 22px 46px -28px oklch(0.2 0 265 / 55%);
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .15s ease,translate .15s ease,visibility .15s;
}
@supports not (anchor-name: --a){
[data-vibeui-block="hovercard-002"] [data-part="card"]{position:absolute;inset:auto;left:0;top:calc(100% + 0.5rem);margin-top:0}
}
[data-vibeui-block="hovercard-002"] [data-part="host"]:hover [data-part="card"],
[data-vibeui-block="hovercard-002"] [data-part="host"]:focus-within [data-part="card"]{opacity:1;visibility:visible;translate:0 0}
/* На узком экране якорь — не узкая ссылка в строке, а весь блок: иначе
   карточка шириной 17rem вылезает за правый край страницы. */
@media (max-width:32rem){
[data-vibeui-block="hovercard-002"]{position:relative}
[data-vibeui-block="hovercard-002"] [data-part="host"]{position:static}
[data-vibeui-block="hovercard-002"] [data-part="card"]{left:0;right:0;width:auto}
}
/* Обложка вместо скриншота: градиент по оттенку домена и его первая буква. */
[data-vibeui-block="hovercard-002"] [data-part="cover"]{
position:relative;display:flex;align-items:center;justify-content:center;
height:4.5rem;
color:oklch(0.99 0.01 var(--vibeui-hovercard-002-hue));
font-size:1.75rem;font-weight:800;letter-spacing:-0.02em;
text-transform:uppercase;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="hovercard-002"] [data-part="cover"][data-empty="true"]{background:linear-gradient(135deg,
oklch(0.72 0.13 var(--vibeui-hovercard-002-hue)),
oklch(0.55 0.16 calc(var(--vibeui-hovercard-002-hue) + 40)));}
[data-vibeui-block="hovercard-002"] [data-part="cover"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
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
/* Витринный режим: карточка стоит в потоке под ссылкой, а не поверх текста —
   иначе на миниатюре каталога от компонента видна одна строка. Обёртка
   становится блоком, чтобы карточка не разрывала строку по вертикали. */
[data-vibeui-block="hovercard-002"][data-open="true"] [data-part="host"]{display:block}
[data-vibeui-block="hovercard-002"][data-open="true"] [data-part="card"]{
position:static;opacity:1;visibility:visible;translate:0;
margin-top:0.5rem;max-width:100%;
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
  open = false,
  anchorText = "разбор популярных ошибок вёрстки",
  image = "",
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
        data-open={open || undefined}
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
              <span
                data-part="cover"
                data-empty={image ? undefined : "true"}
                aria-hidden="true"
              >
                {image ? (
                  <img src={image} alt="" loading="lazy" decoding="async" />
                ) : null}
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
