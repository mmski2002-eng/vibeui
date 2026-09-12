import type { ComponentProps, CSSProperties } from "react"

export type Card013Props = Omit<
  ComponentProps<"article">,
  "children" | "title"
> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  image?: string
  title?: string
  description?: string
  /** Надпись над заголовком: раздел, автор, тип. */
  eyebrow?: string
  /** Подпись под текстом: срок, цена, статус. */
  meta?: string
  actionLabel?: string
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: одна карточка на две раскладки. В узкой колонке кадр
// стоит сверху, в широкой — уезжает влево, и карточка становится строкой
// списка. Переключает это @container, а не медиазапрос: карточка живёт
// то в сайдбаре, то в основной колонке, и ширина окна о ней ничего не знает.
const STYLES = `
:where([data-vibeui-block="card-013"]){
--vibeui-card-013-bg:transparent;
--vibeui-card-013-surface:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-card-013-ink:light-dark(oklch(0.2 0 265),oklch(0.97 0 265));
--vibeui-card-013-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-card-013-muted:color-mix(in oklab,var(--vibeui-card-013-fg) 68%,transparent);
--vibeui-card-013-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-card-013-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-card-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-013"]{color-scheme:dark}
[data-vibeui-block="card-013"]{
display:block;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:40rem;box-sizing:border-box;
background:var(--vibeui-card-013-bg);color:var(--vibeui-card-013-fg);
border:1px solid var(--vibeui-card-013-border);border-radius:0.9375rem;
font-family:var(--vibeui-card-013-font);overflow:hidden;
}
/* Раскладка живёт на shell, а не на корне: контейнерный запрос не действует
   на сам контейнер, и правило на корне молча ничего бы не изменило. */
[data-vibeui-block="card-013"] [data-part="shell"]{
display:flex;flex-direction:column;
}
[data-vibeui-block="card-013"] [data-part="media"]{
position:relative;flex:none;aspect-ratio:16 / 9;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="card-013"] [data-part="media"][data-empty="true"]{background:
radial-gradient(100% 90% at 25% 10%,color-mix(in oklab,var(--vibeui-card-013-accent) 45%,transparent),transparent 65%),
linear-gradient(150deg,
light-dark(oklch(0.94 0.03 200),oklch(0.36 0.04 200)),
light-dark(oklch(0.87 0.05 220),oklch(0.44 0.06 220)));}
[data-vibeui-block="card-013"] [data-part="media"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
}
[data-vibeui-block="card-013"] [data-part="body"]{
display:flex;flex-direction:column;gap:0.375rem;padding:0.9375rem 1.0625rem 1.0625rem;
}
[data-vibeui-block="card-013"] [data-part="eyebrow"]{
font-size:0.6875rem;font-weight:650;letter-spacing:0.07em;text-transform:uppercase;
color:var(--vibeui-card-013-accent);
}
[data-vibeui-block="card-013"] [data-part="title"]{
margin:0;font-size:1.0625rem;font-weight:640;line-height:1.3;letter-spacing:-0.01em;
}
[data-vibeui-block="card-013"] [data-part="description"]{
margin:0;font-size:0.875rem;line-height:1.5;color:var(--vibeui-card-013-muted);
display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;
}
[data-vibeui-block="card-013"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
margin-top:auto;padding-top:0.625rem;
}
[data-vibeui-block="card-013"] [data-part="meta"]{
margin:0;font-size:0.75rem;color:var(--vibeui-card-013-muted);
}
[data-vibeui-block="card-013"] [data-part="action"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
min-height:2rem;padding:0.3125rem 0.875rem;border-radius:0.5rem;
border:1px solid color-mix(in oklab,var(--vibeui-card-013-accent) 35%,var(--vibeui-card-013-border));
background:color-mix(in oklab,var(--vibeui-card-013-accent) 10%,var(--vibeui-card-013-surface));
color:color-mix(in oklab,var(--vibeui-card-013-accent) 75%,var(--vibeui-card-013-ink));
font:inherit;font-size:0.8125rem;font-weight:640;
transition:background-color .16s ease;
}
[data-vibeui-block="card-013"] [data-part="action"]:hover{
background:color-mix(in oklab,var(--vibeui-card-013-accent) 18%,var(--vibeui-card-013-surface));
}
[data-vibeui-block="card-013"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-card-013-accent);outline-offset:2px;
}
/* Своя ширина, а не ширина окна: карточка одинаково ведёт себя в сайдбаре
   и в основной колонке. */
@container (min-width: 30rem){
[data-vibeui-block="card-013"] [data-part="shell"]{flex-direction:row;align-items:stretch}
[data-vibeui-block="card-013"] [data-part="media"]{width:38%;max-width:13rem;aspect-ratio:auto}
[data-vibeui-block="card-013"] [data-part="body"]{flex:1;min-width:0;padding:1.0625rem 1.125rem}
[data-vibeui-block="card-013"] [data-part="title"]{font-size:1.125rem}
}
@container (min-width: 44rem){
[data-vibeui-block="card-013"] [data-part="media"]{width:32%;max-width:15rem}
[data-vibeui-block="card-013"] [data-part="description"]{-webkit-line-clamp:2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-013"] *{animation:none!important;transition:none!important}}
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

/**
 * Карточка, которая переключается между горизонтальной и вертикальной
 * раскладкой по собственной ширине. Один файл, ноль зависимостей.
 */
export function Card013({
  title = "Курс: раскладка без медиазапросов",
  image = "",
  description = "Шесть занятий про container queries, :has() и подстройку компонента под место, в котором он оказался.",
  eyebrow = "Курс",
  meta = "6 занятий · 3 часа",
  actionLabel = "Начать",
  background = "",
  accent,
  className,
  style,
  ...props
}: Card013Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-card-013-bg": background,
          "--vibeui-card-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-013" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-slot="card"
        data-vibeui-block="card-013"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div
            data-part="media"
            data-empty={image ? undefined : "true"}
            aria-hidden="true"
          >
            {image ? (
              <img src={image} alt="" loading="lazy" decoding="async" />
            ) : null}
          </div>
          <div data-part="body">
            {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
            <h3 data-part="title">{title}</h3>
            {description ? <p data-part="description">{description}</p> : null}
            <div data-part="foot">
              {meta ? <p data-part="meta">{meta}</p> : null}
              <button data-part="action" type="button">
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
