import { useId } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Carousel001Slide = {
  label: string
  hue?: number
}

export type Carousel001Props = Omit<ComponentProps<"section">, "children"> & {
  slides?: Carousel001Slide[]
  label?: string
  /** Подпись под лентой: компонент несёт русскую, проект подставляет свою. */
  hint?: string
  /** Роль секции для скринридера. */
  roleText?: string
  /** Роль слайда для скринридера. */
  slideRoleText?: string
  /** Шаблон подписи слайда: {index}, {total}, {label}. */
  slideText?: string
  /** Шаблон подписи точки: {index}, {total}, {label}. */
  dotText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: карусель без единой строки JS. Прокрутку держит
// scroll-snap, а точки внизу — обычные якорные ссылки на слайды: браузер сам
// доедет до нужного и подсветит его через :target. Пролистать можно пальцем,
// колесом, стрелками и Tab — всё это уже умеет обычная прокрутка.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="carousel-001"]){
--vibeui-carousel-001-bg:transparent;
--vibeui-carousel-001-fg:light-dark(oklch(0.22 0 265),oklch(0.93 0 265));
--vibeui-carousel-001-muted:color-mix(in oklab,var(--vibeui-carousel-001-fg) 68%,transparent);
--vibeui-carousel-001-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-carousel-001-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-carousel-001-radius:0.875rem;
--vibeui-carousel-001-pad:0;
--vibeui-carousel-001-shell:0;
--vibeui-carousel-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="carousel-001"]{color-scheme:dark}
[data-vibeui-block="carousel-001"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:26rem;box-sizing:border-box;
padding:var(--vibeui-carousel-001-pad);
background:var(--vibeui-carousel-001-bg);
border-radius:var(--vibeui-carousel-001-shell);
font-family:var(--vibeui-carousel-001-font);color:var(--vibeui-carousel-001-fg);
}
/* Вся прокрутка — нативная: палец, колесо, стрелки и Tab работают сами. */
[data-vibeui-block="carousel-001"] [data-part="track"]{
display:flex;gap:0.625rem;
margin:0;padding:0;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x mandatory;scroll-behavior:smooth;
scrollbar-width:none;
}
[data-vibeui-block="carousel-001"] [data-part="track"]::-webkit-scrollbar{display:none}
/* Кадр стоит вместо фотографии: градиент и светлый текст на нём одинаковы
   в любой теме страницы, поэтому второй ветки у них нет. */
[data-vibeui-block="carousel-001"] [data-part="slide"]{
flex:0 0 100%;scroll-snap-align:center;
display:flex;align-items:flex-end;
aspect-ratio:16 / 9;padding:0.875rem;box-sizing:border-box;
border-radius:var(--vibeui-carousel-001-radius);
background:
radial-gradient(90% 80% at 25% 20%,oklch(0.9 0.06 var(--vibeui-carousel-001-hue,250)),transparent 70%),
linear-gradient(150deg,oklch(0.78 0.09 var(--vibeui-carousel-001-hue,250)),oklch(0.5 0.11 var(--vibeui-carousel-001-hue,250)));
color:oklch(0.99 0 265);font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="carousel-001"] [data-part="dots"]{
display:flex;justify-content:center;gap:0.4375rem;
margin:0;padding:0;list-style:none;
}
/* Точка — якорная ссылка: браузер доезжает до слайда сам, без обработчиков. */
[data-vibeui-block="carousel-001"] [data-part="dot"]{
display:block;width:0.5rem;height:0.5rem;border-radius:9999px;
background:var(--vibeui-carousel-001-border);
}
[data-vibeui-block="carousel-001"] [data-part="dot"]:hover{background:var(--vibeui-carousel-001-muted)}
[data-vibeui-block="carousel-001"] [data-part="dot"]:focus-visible{outline:2px solid var(--vibeui-carousel-001-accent);outline-offset:3px}
[data-vibeui-block="carousel-001"] [data-part="slide"]:target{scroll-snap-align:center}
[data-vibeui-block="carousel-001"] [data-part="hint"]{
text-align:center;font-size:0.75rem;color:var(--vibeui-carousel-001-muted);
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="carousel-001"] *{animation:none!important;transition:none!important}
[data-vibeui-block="carousel-001"] [data-part="track"]{scroll-behavior:auto}
}
`

const DEFAULT_SLIDES: Carousel001Slide[] = [
  { label: "Каталог компонентов", hue: 250 },
  { label: "Живое превью", hue: 150 },
  { label: "Инструкция для агента", hue: 30 },
  { label: "Установка одной командой", hue: 300 },
]

/** Подстановка чисел в подпись: перевод остаётся одной строкой. */
function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

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
 * Карусель на scroll-snap и якорных ссылках: без клиентского кода.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Carousel001({
  slides = DEFAULT_SLIDES,
  label = "Возможности",
  hint = "Листайте пальцем или переходите по точкам",
  roleText = "карусель",
  slideRoleText = "слайд",
  slideText = "{index} из {total}: {label}",
  dotText = "Перейти к слайду {index}: {label}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Carousel001Props) {
  const id = useId().replace(/:/g, "")
  // Подложка появляется вместе с внутренними отступами: без неё компонент
  // лежит прямо на странице, и поля по бокам ему только мешают.
  const palette = {
    ...(accent ? { "--vibeui-carousel-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-carousel-001-bg": background,
          "--vibeui-carousel-001-pad": "0.875rem",
          "--vibeui-carousel-001-shell": "1.125rem",
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-carousel-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="carousel"
        data-vibeui-block="carousel-001"
        aria-roledescription={roleText}
        aria-label={label}
        className={className}
        style={palette}
      >
        <ul data-part="track" tabIndex={0}>
          {slides.map((slide, index) => (
            <li
              key={slide.label}
              id={`${id}-slide-${index}`}
              data-part="slide"
              aria-roledescription={slideRoleText}
              aria-label={fill(slideText, {
                index: index + 1,
                total: slides.length,
                label: slide.label,
              })}
              style={
                {
                  "--vibeui-carousel-001-hue": slide.hue ?? 250,
                } as CSSProperties
              }
            >
              {slide.label}
            </li>
          ))}
        </ul>
        <ul data-part="dots">
          {slides.map((slide, index) => (
            <li key={slide.label}>
              <a
                data-part="dot"
                href={`#${id}-slide-${index}`}
                aria-label={fill(dotText, {
                  index: index + 1,
                  total: slides.length,
                  label: slide.label,
                })}
              />
            </li>
          ))}
        </ul>
        <p data-part="hint">{hint}</p>
      </section>
    </>
  )
}
