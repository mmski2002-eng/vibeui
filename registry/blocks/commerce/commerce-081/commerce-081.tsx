import type { CSSProperties } from "react"

export type Commerce081Photo = {
  id: string
  label: string
  hue: number
}

export type Commerce081Variant = {
  id: string
  label: string
}

export type Commerce081Props = {
  id?: string
  /**
   * Показать окно раскрытым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  product?: string
  tagline?: string
  photos?: Commerce081Photo[]
  price?: string
  oldPrice?: string
  discount?: string
  rating?: number
  reviewsCount?: number
  reviewsText?: string
  variantsLabel?: string
  variants?: Commerce081Variant[]
  quantityLabel?: string
  stock?: string
  cart?: string
  more?: string
  close?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: быстрый просмотр товара прямо из сетки, без перехода на
// страницу. Окно держит нативный popover — открытие, Esc и клик мимо от
// браузера, без единой строки JS. Миниатюры переключают крупный кадр через
// :has() у отмеченной радиокнопки: подпись цвета стоит рядом с образцом, а
// не только в его оттенке. Наличие названо словом и значком, а не одним
// цветом — «осталось 2 шт» решает, откладывать покупку или нет.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у окна
// по умолчанию нет своей тёмной темы, оно темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="commerce-081"]){
--vibeui-commerce-081-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-commerce-081-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-commerce-081-bg:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-commerce-081-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.011 265));
--vibeui-commerce-081-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-commerce-081-accent:light-dark(oklch(0.55 0.2 262),oklch(0.73 0.16 262));
--vibeui-commerce-081-accent-fg:light-dark(oklch(1 0 0),oklch(0.17 0.02 265));
--vibeui-commerce-081-ok:light-dark(oklch(0.55 0.14 152),oklch(0.75 0.14 152));
--vibeui-commerce-081-bad:light-dark(oklch(0.58 0.19 25),oklch(0.74 0.16 25));
--vibeui-commerce-081-star:light-dark(oklch(0.54 0.16 78),oklch(0.84 0.15 80));
--vibeui-commerce-081-star-empty:light-dark(oklch(0.42 0.008 265),oklch(0.58 0.014 265));
--vibeui-commerce-081-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-081"]{color-scheme:dark}
[data-vibeui-block="commerce-081"]{
display:inline-flex;font-family:var(--vibeui-commerce-081-sans);color:var(--vibeui-commerce-081-fg);
}
[data-vibeui-block="commerce-081"] *{box-sizing:border-box}
[data-vibeui-block="commerce-081"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
display:inline-flex;align-items:center;gap:0.375rem;
min-height:2.25rem;padding:0.25rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-081-border);background:var(--vibeui-commerce-081-bg);color:var(--vibeui-commerce-081-fg);
}
[data-vibeui-block="commerce-081"] [data-part="trigger"]:focus-visible{
outline:2px solid var(--vibeui-commerce-081-accent);outline-offset:2px;
}
[data-vibeui-commerce-081-window]{
container-type:inline-size;
position:fixed;inset:0;margin:auto;height:fit-content;max-height:calc(100vh - 2rem);overflow:auto;
width:min(38rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.25rem;
border:1px solid var(--vibeui-commerce-081-border);border-radius:1rem;
background:var(--vibeui-commerce-081-bg);color:var(--vibeui-commerce-081-fg);
font-family:var(--vibeui-commerce-081-sans);box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:translateY(0.5rem) scale(0.98);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-commerce-081-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-commerce-081-window]:popover-open{opacity:0;transform:translateY(0.5rem) scale(0.98)}}
[data-vibeui-commerce-081-window]::backdrop{background:oklch(0.18 0.02 265 / 45%);backdrop-filter:blur(2px)}
html:has([data-vibeui-commerce-081-window]:popover-open){overflow:hidden}
[data-vibeui-commerce-081-window] [data-part="head"]{display:flex;justify-content:flex-end}
[data-vibeui-commerce-081-window] [data-part="dismiss"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0.25rem;line-height:1;
font-size:1.125rem;color:var(--vibeui-commerce-081-muted);
}
[data-vibeui-commerce-081-window] [data-part="dismiss"]:focus-visible{
outline:2px solid var(--vibeui-commerce-081-accent);outline-offset:2px;border-radius:0.375rem;
}
[data-vibeui-commerce-081-window] [data-part="layout"]{
display:grid;gap:1.125rem;margin-top:-0.5rem;min-width:min(100%,20rem);
}
@container (min-width: 30rem){
[data-vibeui-commerce-081-window] [data-part="layout"]{grid-template-columns:11rem 1fr}
}
[data-vibeui-commerce-081-window] [data-part="frame"]{
position:relative;aspect-ratio:1;border-radius:0.875rem;overflow:hidden;
background:var(--vibeui-commerce-081-soft);border:1px solid var(--vibeui-commerce-081-border);
}
[data-vibeui-commerce-081-window] [data-part="pane"]{
position:absolute;inset:0;opacity:0;background:var(--vibeui-081-hue);
transition:opacity .16s ease;
}
[data-vibeui-commerce-081-window] input[name$="-photo"]{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-commerce-081-window] [data-part="gallery"]:has(input[name$="-photo"][value="0"]:checked) [data-part="pane"][data-value="0"],
[data-vibeui-commerce-081-window] [data-part="gallery"]:has(input[name$="-photo"][value="1"]:checked) [data-part="pane"][data-value="1"],
[data-vibeui-commerce-081-window] [data-part="gallery"]:has(input[name$="-photo"][value="2"]:checked) [data-part="pane"][data-value="2"],
[data-vibeui-commerce-081-window] [data-part="gallery"]:has(input[name$="-photo"][value="3"]:checked) [data-part="pane"][data-value="3"],
[data-vibeui-commerce-081-window] [data-part="gallery"]:has(input[name$="-photo"][value="4"]:checked) [data-part="pane"][data-value="4"]{opacity:1}
[data-vibeui-commerce-081-window] [data-part="thumbs"]{display:flex;gap:0.5rem;margin-top:0.5rem;list-style:none;padding:0}
[data-vibeui-commerce-081-window] [data-part="thumb"]{
display:block;width:2.25rem;height:2.25rem;border-radius:0.5rem;cursor:pointer;
border:2px solid transparent;background:var(--vibeui-081-hue,var(--vibeui-commerce-081-soft));
}
[data-vibeui-commerce-081-window] input[name$="-photo"]:checked + [data-part="thumb"]{border-color:var(--vibeui-commerce-081-accent)}
[data-vibeui-commerce-081-window] input[name$="-photo"]:focus-visible + [data-part="thumb"]{
outline:2px solid var(--vibeui-commerce-081-accent);outline-offset:2px;
}
[data-vibeui-commerce-081-window] [data-part="tagline"]{margin:0 0 0.25rem;font-size:0.75rem;color:var(--vibeui-commerce-081-muted)}
[data-vibeui-commerce-081-window] h2{margin:0 0 0.375rem;font-size:1.0625rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-commerce-081-window] [data-part="rating"]{display:flex;align-items:center;gap:0.5rem;margin:0 0 0.625rem;font-size:0.8125rem;color:var(--vibeui-commerce-081-muted)}
[data-vibeui-commerce-081-window] [data-part="stars"]{position:relative;display:inline-block;font-size:0.9375rem;letter-spacing:0.05rem}
[data-vibeui-commerce-081-window] [data-part="stars"] [data-part="track"]{color:var(--vibeui-commerce-081-star-empty)}
[data-vibeui-commerce-081-window] [data-part="stars"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;overflow:hidden;white-space:nowrap;width:var(--vibeui-081-fill,0%);color:var(--vibeui-commerce-081-star);
}
[data-vibeui-commerce-081-window] [data-part="price"]{display:flex;align-items:baseline;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem}
[data-vibeui-commerce-081-window] [data-part="now"]{font-size:1.375rem;font-weight:750;letter-spacing:-0.01em}
[data-vibeui-commerce-081-window] [data-part="was"]{font-size:0.875rem;color:var(--vibeui-commerce-081-muted);text-decoration:line-through}
[data-vibeui-commerce-081-window] [data-part="off"]{
font-size:0.75rem;font-weight:700;color:var(--vibeui-commerce-081-bad);
border:1px solid var(--vibeui-commerce-081-bad);border-radius:9999px;padding:0.0625rem 0.5rem;
}
[data-vibeui-commerce-081-window] [data-part="stock"]{
display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-commerce-081-ok);margin-bottom:0.75rem;
}
[data-vibeui-commerce-081-window] fieldset{border:0;margin:0 0 0.875rem;padding:0}
[data-vibeui-commerce-081-window] legend{padding:0;margin:0 0 0.375rem;font-size:0.75rem;color:var(--vibeui-commerce-081-muted)}
[data-vibeui-commerce-081-window] [data-part="variants"]{display:flex;flex-wrap:wrap;gap:0.4375rem;list-style:none;padding:0;margin:0}
[data-vibeui-commerce-081-window] input[name$="-variant"]{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-commerce-081-window] [data-part="chip"]{
display:inline-flex;align-items:center;padding:0.375rem 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-commerce-081-border);font-size:0.8125rem;cursor:pointer;
}
[data-vibeui-commerce-081-window] input[name$="-variant"]:checked + [data-part="chip"]{
border-color:var(--vibeui-commerce-081-accent);background:var(--vibeui-commerce-081-accent);color:var(--vibeui-commerce-081-accent-fg);font-weight:650;
}
[data-vibeui-commerce-081-window] input[name$="-variant"]:focus-visible + [data-part="chip"]{
outline:2px solid var(--vibeui-commerce-081-accent);outline-offset:2px;
}
[data-vibeui-commerce-081-window] [data-part="actions"]{display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap}
[data-vibeui-commerce-081-window] [data-part="qty"]{
width:3.5rem;height:2.5rem;padding:0 0.5rem;border-radius:0.625rem;
border:1px solid var(--vibeui-commerce-081-border);background:var(--vibeui-commerce-081-bg);color:inherit;font:inherit;
}
[data-vibeui-commerce-081-window] [data-part="qty"]:focus-visible{outline:2px solid var(--vibeui-commerce-081-accent);outline-offset:1px}
[data-vibeui-commerce-081-window] [data-part="cart"]{
appearance:none;border:0;cursor:pointer;flex:1 1 10rem;border-radius:0.625rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.5rem;padding:0.25rem 1.125rem;
background:var(--vibeui-commerce-081-accent);color:var(--vibeui-commerce-081-accent-fg);font:inherit;font-size:0.875rem;font-weight:700;
}
[data-vibeui-commerce-081-window] [data-part="cart"]:focus-visible{outline:2px solid var(--vibeui-commerce-081-accent);outline-offset:2px}
[data-vibeui-commerce-081-window] [data-part="more"]{
font-size:0.8125rem;color:var(--vibeui-commerce-081-muted);text-decoration:underline;text-underline-offset:0.2em;
}
/* Развёрнутый режим: окно стоит в потоке вместо кнопки, а не в верхнем слое.
   Без него на карточке каталога от компонента видна одна кнопка. */
[data-vibeui-block="commerce-081"]:has([data-open="true"]){display:block;width:100%}
[data-vibeui-block="commerce-081"]:has([data-open="true"]) [data-part="trigger"]{display:none}
[data-vibeui-commerce-081-window][data-open="true"]{
position:static;inset:auto;margin:0;width:100%;max-width:38rem;max-height:none;
opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="commerce-081"] *{animation:none!important;transition:none!important}
[data-vibeui-commerce-081-window]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_PHOTOS: Commerce081Photo[] = [
  { id: "front", label: "Спереди", hue: 262 },
  { id: "side", label: "Сбоку", hue: 200 },
  { id: "case", label: "В футляре", hue: 30 },
]

const DEFAULT_VARIANTS: Commerce081Variant[] = [
  { id: "black", label: "Чёрный" },
  { id: "white", label: "Белый" },
  { id: "sand", label: "Песочный" },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Быстрый просмотр товара в окне на HTML popover: без перехода со страницы
 * каталога. Один файл, ноль зависимостей, собственная палитра.
 */
export function Commerce081({
  id = "commerce-081",
  open = false,
  trigger = "👁 Быстрый просмотр",
  product = "Наушники Aria Pro",
  tagline = "Активное шумоподавление, до 30 часов",
  photos = DEFAULT_PHOTOS,
  price = "12 990 ₽",
  oldPrice = "15 990 ₽",
  discount = "−19%",
  rating = 4.6,
  reviewsCount = 128,
  reviewsText = "{rating} · {count} отзывов",
  variantsLabel = "Цвет",
  variants = DEFAULT_VARIANTS,
  quantityLabel = "Количество",
  stock = "В наличии — осталось 6 шт",
  cart = "В корзину",
  more = "Все подробности",
  close = "Закрыть быстрый просмотр",
  accent,
  background = "",
  className,
  style,
}: Commerce081Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-081-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-commerce-081-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const photoName = `${id}-photo`
  const variantName = `${id}-variant`

  return (
    <>
      <style href="vibeui-commerce-081" precedence="medium">
        {STYLES}
      </style>
      <div
        data-vibeui-block="commerce-081"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-commerce-081-window=""
          data-open={open || undefined}
          role="dialog"
          aria-labelledby={`${id}-title`}
          style={palette}
        >
          <div data-part="head">
            <button
              type="button"
              data-part="dismiss"
              popoverTarget={id}
              aria-label={close}
              autoFocus
            >
              ✕
            </button>
          </div>

          <div data-part="layout">
            <div data-part="gallery">
              <div data-part="frame">
                {photos.map((photo, index) => (
                  <span
                    key={photo.id}
                    data-part="pane"
                    data-value={index}
                    aria-hidden="true"
                    style={
                      {
                        "--vibeui-081-hue": `oklch(0.7 0.09 ${photo.hue})`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              <form data-part="thumbs-form">
                <ul data-part="thumbs">
                  {photos.map((photo, index) => (
                    <li key={photo.id}>
                      <input
                        type="radio"
                        id={`${id}-photo-${photo.id}`}
                        name={photoName}
                        value={index}
                        defaultChecked={index === 0}
                      />
                      <label
                        data-part="thumb"
                        htmlFor={`${id}-photo-${photo.id}`}
                        aria-label={photo.label}
                        style={
                          {
                            "--vibeui-081-hue": `oklch(0.7 0.09 ${photo.hue})`,
                          } as CSSProperties
                        }
                      />
                    </li>
                  ))}
                </ul>
              </form>
            </div>

            <div data-part="details">
              <p data-part="tagline">{tagline}</p>
              <h2 id={`${id}-title`}>{product}</h2>

              <p data-part="rating">
                <span data-part="stars" aria-hidden="true">
                  <span data-part="track">★★★★★</span>
                  <span
                    data-part="fill"
                    style={
                      {
                        "--vibeui-081-fill": `${(rating / 5) * 100}%`,
                      } as CSSProperties
                    }
                  >
                    ★★★★★
                  </span>
                </span>
                {reviewsText
                  .replace("{rating}", rating.toFixed(1))
                  .replace("{count}", String(reviewsCount))}
              </p>

              <p data-part="price">
                <span data-part="now">{price}</span>
                {oldPrice ? <span data-part="was">{oldPrice}</span> : null}
                {discount ? <span data-part="off">{discount}</span> : null}
              </p>

              <p data-part="stock">✓ {stock}</p>

              <fieldset>
                <legend>{variantsLabel}</legend>
                <form data-part="variants-form">
                  <ul data-part="variants">
                    {variants.map((variant, index) => (
                      <li key={variant.id}>
                        <input
                          type="radio"
                          id={`${id}-variant-${variant.id}`}
                          name={variantName}
                          defaultChecked={index === 0}
                        />
                        <label
                          data-part="chip"
                          htmlFor={`${id}-variant-${variant.id}`}
                        >
                          {variant.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </form>
              </fieldset>

              <div data-part="actions">
                <input
                  id={`${id}-qty`}
                  data-part="qty"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  defaultValue={1}
                  aria-label={quantityLabel}
                />
                <button type="button" data-part="cart">
                  {cart}
                </button>
              </div>

              <p>
                <a data-part="more" href="#">
                  {more}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
