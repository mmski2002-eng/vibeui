import type { ComponentProps, CSSProperties } from "react"

export type Carousel007Shot = {
  label: string
  hue?: number
}

export type Carousel007Props = Omit<ComponentProps<"section">, "children"> & {
  shots?: Carousel007Shot[]
  label?: string
  hint?: string
  /** Пусто — подложка своя; цвет заменяет её целиком. */
  background?: string
}

// Идея компонента: галерея-плёнка с подписями под кадрами. Прокрутка
// горизонтальная, но кадры не занимают всю ширину: видно сразу три, и это
// превращает ленту в обзор, а не в пролистывание по одному. Подписи стоят
// под кадром, а не поверх — на светлом снимке текст поверх не читается.
//
// Тема берётся из color-scheme окружения через light-dark(): карточка и текст
// темнеют вместе со страницей, своей тёмной темы компонент не носит.
const STYLES = `
:where([data-vibeui-block="carousel-007"]){
--vibeui-carousel-007-bg:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-carousel-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-carousel-007-muted:color-mix(in oklab,var(--vibeui-carousel-007-fg) 68%,transparent);
--vibeui-carousel-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-carousel-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-007"]{color-scheme:dark}
[data-vibeui-block="carousel-007"]{
display:block;width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-carousel-007-font);color:var(--vibeui-carousel-007-fg);
}
[data-vibeui-block="carousel-007"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.5rem;
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-carousel-007-bg);
border:1px solid var(--vibeui-carousel-007-border);border-radius:0.875rem;
}
[data-vibeui-block="carousel-007"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="carousel-007"] [data-part="film"]{
display:flex;gap:0.5rem;
margin:0;padding:0 0 0.375rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x proximity;scrollbar-width:thin;
}
/* Треть ширины на кадр: видно сразу несколько, лента читается как обзор. */
[data-vibeui-block="carousel-007"] [data-part="shot"]{
flex:0 0 34%;scroll-snap-align:start;
display:flex;flex-direction:column;gap:0.3125rem;min-width:0;
}
[data-vibeui-block="carousel-007"] [data-part="frame"]{
aspect-ratio:4 / 3;border-radius:0.625rem;
background:
radial-gradient(90% 80% at 25% 20%,oklch(0.92 0.06 var(--vibeui-carousel-007-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.8 0.08 var(--vibeui-carousel-007-hue,250)),oklch(0.55 0.1 var(--vibeui-carousel-007-hue,250)));
}
/* Подпись под кадром, а не поверх: на светлом снимке текст поверх пропадает. */
[data-vibeui-block="carousel-007"] [data-part="caption"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-carousel-007-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="carousel-007"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-carousel-007-muted)}
@container (max-width: 24rem){
[data-vibeui-block="carousel-007"] [data-part="shot"]{flex-basis:52%}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="carousel-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SHOTS: Carousel007Shot[] = [
  { label: "Главная страница", hue: 250 },
  { label: "Каталог с фильтрами", hue: 150 },
  { label: "Страница компонента", hue: 30 },
  { label: "Инструкция для агента", hue: 300 },
  { label: "Тёмная тема", hue: 200 },
]

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
 * Галерея-плёнка: несколько кадров в кадре и подписи под ними.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel007({
  shots = DEFAULT_SHOTS,
  label = "Скриншоты",
  hint = "Прокрутите вбок — всего кадров: 5",
  background = "",
  className,
  style,
  ...props
}: Carousel007Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-carousel-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-007"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="card">
          <h3 data-part="title">{label}</h3>
          <ul data-part="film" tabIndex={0}>
            {shots.map((shot) => (
              <li
                key={shot.label}
                data-part="shot"
                style={
                  {
                    "--vibeui-carousel-007-hue": shot.hue ?? 250,
                  } as CSSProperties
                }
              >
                <span data-part="frame" aria-hidden="true" />
                <span data-part="caption">{shot.label}</span>
              </li>
            ))}
          </ul>
          <p data-part="hint">{hint}</p>
        </div>
      </section>
    </>
  )
}
