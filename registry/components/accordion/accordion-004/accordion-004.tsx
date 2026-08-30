import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Accordion004Item = {
  title: string
  /** Правая подпись в строке: срок, объём, цена. */
  meta?: string
  body: string
}

export type Accordion004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Accordion004Item[]
  defaultOpen?: number
  accent?: string
}

// Идея компонента: плотный список, где у каждой строки есть правая колонка —
// срок, объём, цена. Такой аккордеон читают глазами по правому краю, не
// раскрывая: значения выровнены моноширинными цифрами и стоят в столбик.
// Стрелка поворачивается, но строка не меняет высоту при открытии.
const STYLES = `
:where([data-vibeui-block="accordion-004"]){
--vibeui-accordion-004-fg:oklch(0.22 0.014 265);
--vibeui-accordion-004-muted:oklch(0.52 0.014 265);
--vibeui-accordion-004-bg:oklch(1 0 0);
--vibeui-accordion-004-alt:oklch(0.98 0.003 265);
--vibeui-accordion-004-border:oklch(0.91 0.006 265);
--vibeui-accordion-004-accent:oklch(0.55 0.2 262);
--vibeui-accordion-004-radius:0.75rem;
--vibeui-accordion-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-004"]{
display:flex;flex-direction:column;
width:100%;max-width:40rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-accordion-004-border);
border-radius:var(--vibeui-accordion-004-radius);
background:var(--vibeui-accordion-004-bg);
color:var(--vibeui-accordion-004-fg);font-family:var(--vibeui-accordion-004-font);
}
[data-vibeui-block="accordion-004"] details + details{border-top:1px solid var(--vibeui-accordion-004-border)}
[data-vibeui-block="accordion-004"] details[open]{background:var(--vibeui-accordion-004-alt)}
[data-vibeui-block="accordion-004"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.75rem 0.9375rem;cursor:pointer;list-style:none;
font-size:0.875rem;line-height:1.35;
}
[data-vibeui-block="accordion-004"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-004"] summary:hover{background:color-mix(in oklab,var(--vibeui-accordion-004-border) 30%,transparent)}
[data-vibeui-block="accordion-004"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-004-accent);outline-offset:-2px}
/* Стрелка слева: она отмечает состояние строки, а не завершает её. */
[data-vibeui-block="accordion-004"] [data-part="arrow"]{
flex:none;width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-004-muted);
border-bottom:1.5px solid var(--vibeui-accordion-004-muted);
transform:rotate(-45deg);
transition:transform .18s cubic-bezier(.32,.72,0,1),border-color .16s ease;
}
[data-vibeui-block="accordion-004"] details[open] [data-part="arrow"]{
transform:rotate(45deg);
border-right-color:var(--vibeui-accordion-004-accent);
border-bottom-color:var(--vibeui-accordion-004-accent);
}
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
@container (min-width: 30rem){
[data-vibeui-block="accordion-004"] summary{padding:0.875rem 1.125rem;font-size:0.9375rem}
[data-vibeui-block="accordion-004"] [data-part="body"]{padding:0 1.125rem 1rem 2.375rem;font-size:0.875rem}
}
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
 * Плотный аккордеон со значением справа: список читается не раскрывая.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion004({
  items = DEFAULT_ITEMS,
  defaultOpen = 1,
  accent,
  className,
  style,
  ...props
}: Accordion004Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="accordion-004"
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details key={item.title} open={index === defaultOpen}>
            <summary>
              <span data-part="arrow" aria-hidden="true" />
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
