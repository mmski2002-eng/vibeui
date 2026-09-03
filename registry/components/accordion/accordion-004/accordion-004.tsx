import type { ComponentProps, CSSProperties } from "react"

export type Accordion004Item = {
  title: string
  /** Правая подпись в строке: срок, объём, цена. */
  meta?: string
  body: string
}

/** Значок раздела. Все фигуры рисует компонент, картинка одна во всех движках. */
export type Accordion004Marker =
  "chevron" | "triangle" | "square" | "plus" | "none"

export type Accordion004Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion004Item[]
  defaultOpen?: number
  marker?: Accordion004Marker
  /** Подкрашивать чётные строки: длинный список так легче вести глазом. */
  zebra?: boolean
  /** Пусто — заливки нет, список держится рамкой поверх фона страницы. */
  background?: string
  accent?: string
}

// Идея компонента: плотный список, где у каждой строки есть правая колонка —
// срок, объём, цена. Такой аккордеон читают глазами по правому краю, не
// раскрывая: значения выровнены моноширинными цифрами и стоят в столбик.
// Стрелка поворачивается, но строка не меняет высоту при открытии.
//
// Заливки у списка нет: он держится рамкой и лежит на фоне страницы. Тема
// берётся из color-scheme окружения через light-dark(), а подсветка строк
// сделана полупрозрачной — так она работает на любом фоне, не зная его.
const STYLES = `
:where([data-vibeui-block="accordion-004"]){
--vibeui-accordion-004-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-accordion-004-muted:color-mix(in oklab,var(--vibeui-accordion-004-fg) 68%,transparent);
--vibeui-accordion-004-bg:transparent;
--vibeui-accordion-004-alt:light-dark(oklch(0 0 0 / 3.5%),oklch(1 0 0 / 5%));
--vibeui-accordion-004-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-accordion-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-accordion-004-radius:0.75rem;
--vibeui-accordion-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-004"]{
display:flex;flex-direction:column;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:40rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-accordion-004-border);
border-radius:var(--vibeui-accordion-004-radius);
background:var(--vibeui-accordion-004-bg);
color:var(--vibeui-accordion-004-fg);font-family:var(--vibeui-accordion-004-font);
}
[data-vibeui-block="accordion-004"] details + details{border-top:1px solid var(--vibeui-accordion-004-border)}
[data-vibeui-block="accordion-004"] details[open]{background:var(--vibeui-accordion-004-alt)}
/* Зебра для длинного списка. Открытая строка всё равно светлее соседей:
   её заливка ложится поверх зебры. */
[data-vibeui-block="accordion-004"][data-zebra="on"] details:nth-child(even){background:var(--vibeui-accordion-004-alt)}
[data-vibeui-block="accordion-004"][data-zebra="on"] details:nth-child(even)[open]{background:color-mix(in oklab,var(--vibeui-accordion-004-accent) 8%,transparent)}
[data-vibeui-block="accordion-004"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.75rem 0.9375rem;cursor:pointer;list-style:none;
font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="accordion-004"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-004"] summary:hover{background:color-mix(in oklab,var(--vibeui-accordion-004-border) 30%,transparent)}
[data-vibeui-block="accordion-004"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-004-accent);outline-offset:-2px}
/* Значок слева: он отмечает состояние строки, а не завершает её. Бокс
   постоянного размера, поэтому заголовки стоят в одну линию при любой фигуре. */
[data-vibeui-block="accordion-004"] [data-part="marker"]{
position:relative;flex:none;width:0.625rem;height:0.625rem;
}
[data-vibeui-block="accordion-004"] [data-part="marker"]::before{
content:"";position:absolute;left:50%;top:50%;
transition:transform .18s cubic-bezier(.32,.72,0,1),border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-004"][data-marker="chevron"] [data-part="marker"]::before{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-004-muted);
border-bottom:1.5px solid var(--vibeui-accordion-004-muted);
transform:translate(-70%,-50%) rotate(-45deg);
}
[data-vibeui-block="accordion-004"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
border-right-color:var(--vibeui-accordion-004-accent);
border-bottom-color:var(--vibeui-accordion-004-accent);
}
[data-vibeui-block="accordion-004"][data-marker="triangle"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;transform:translate(-50%,-50%);
background:var(--vibeui-accordion-004-muted);
clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-004"][data-marker="triangle"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(90deg);background:var(--vibeui-accordion-004-accent);
}
[data-vibeui-block="accordion-004"][data-marker="square"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;border-radius:1px;transform:translate(-50%,-50%);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-004-muted);
}
[data-vibeui-block="accordion-004"][data-marker="square"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(45deg);
background:var(--vibeui-accordion-004-accent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-004-accent);
}
[data-vibeui-block="accordion-004"][data-marker="plus"] [data-part="marker"]::before,
[data-vibeui-block="accordion-004"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;left:0;top:50%;
width:100%;height:1.5px;margin-top:-0.75px;border-radius:1px;transform:none;
background:var(--vibeui-accordion-004-muted);
transition:transform .18s cubic-bezier(.32,.72,0,1),background-color .16s ease;
}
[data-vibeui-block="accordion-004"][data-marker="plus"] [data-part="marker"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-004"][data-marker="plus"] details[open] [data-part="marker"]::after{transform:rotate(0deg)}
[data-vibeui-block="accordion-004"][data-marker="plus"] details[open] [data-part="marker"]::before,
[data-vibeui-block="accordion-004"][data-marker="plus"] details[open] [data-part="marker"]::after{background:var(--vibeui-accordion-004-accent)}
[data-vibeui-block="accordion-004"] [data-part="title"]{flex:1 1 auto;min-width:0;font-weight:520}
/* Правый столбец: значения выровнены между строками, а не пляшут по ширине. */
[data-vibeui-block="accordion-004"] [data-part="meta"]{
flex:none;font-size:0.8125rem;color:var(--vibeui-accordion-004-muted);
font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="accordion-004"] [data-part="body"]{
margin:0;padding:0 0.9375rem 0.875rem 2.125rem;
font-size:0.8125rem;line-height:1.6;color:var(--vibeui-accordion-004-muted);max-width:60ch;
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-004"] summary{padding:0.875rem 1.125rem;font-size:0.9375rem}
[data-vibeui-block="accordion-004"] [data-part="body"]{padding:0 1.125rem 1rem 2.375rem;font-size:0.875rem}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-004"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion004Item[] = [
  {
    title: "Разработка макета",
    meta: "5 дней",
    body: "Две итерации правок, готовые экраны для десктопа и мобильного, передача в вёрстку с описанием состояний.",
  },
  {
    title: "Вёрстка и сборка",
    meta: "7 дней",
    body: "Сборка страниц из блоков, адаптив от 360 пикселей, проверка в актуальных браузерах и на реальных устройствах.",
  },
  {
    title: "Наполнение контентом",
    meta: "3 дня",
    body: "Перенос текстов и изображений, оптимизация картинок, настройка мета-тегов и карточек для соцсетей.",
  },
  {
    title: "Публикация и домен",
    meta: "1 день",
    body: "Подключение домена, сертификат, редиректы со старых адресов, подключение аналитики.",
  },
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
 * Плотный аккордеон со значением справа: список читается не раскрывая.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion004({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  marker = "chevron",
  zebra = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion004Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-004"
        data-marker={marker}
        data-zebra={zebra ? "on" : "off"}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details key={item.title} open={index === defaultOpen}>
            <summary>
              {marker === "none" ? null : (
                <span data-part="marker" aria-hidden="true" />
              )}
              <span data-part="title">{item.title}</span>
              {item.meta ? <span data-part="meta">{item.meta}</span> : null}
            </summary>
            <p data-part="body">{item.body}</p>
          </details>
        ))}
      </div>
    </>
  )
}
