import type { ComponentProps, CSSProperties } from "react"

export type Accordion005Item = {
  title: string
  body: string
  /** Раздел недоступен: не раскрывается и объясняет причину. */
  disabled?: boolean
  /** Раздел требует внимания: подсвечен и отмечен слева. */
  highlighted?: boolean
  /** Короткая подпись состояния справа: «Готово», «Нужен ответ». */
  status?: string
}

/** Значок раздела. Все фигуры рисует компонент, картинка одна во всех движках. */
export type Accordion005Marker =
  "chevron" | "triangle" | "square" | "plus" | "none"

/** Чем отмечен раздел, требующий внимания. */
export type Accordion005Stripe = "bar" | "ring" | "none"

export type Accordion005Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion005Item[]
  defaultOpen?: number
  marker?: Accordion005Marker
  stripe?: Accordion005Stripe
  /** Цвет раздела, требующего внимания: полоса, рамка и подпись. */
  warn?: string
  /** Пусто — заливки нет, карточки держатся рамкой поверх фона страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у разделов есть состояния. Недоступный не раскрывается и
// сам объясняет причину — вместо того чтобы открыться в пустоту; требующий
// внимания отмечен полосой у края и подписью, а не только цветом текста.
// Недоступный раздел остаётся видимым: спрятать его — значит скрыть, что
// шаг вообще существует.
//
// Заливки у карточек нет: они держатся рамкой и лежат на фоне страницы, а
// подсветка состояний сделана полупрозрачной, поэтому работает на любом фоне.
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="accordion-005"]){
--vibeui-accordion-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-accordion-005-muted:color-mix(in oklab,var(--vibeui-accordion-005-fg) 68%,transparent);
--vibeui-accordion-005-bg:transparent;
--vibeui-accordion-005-border:light-dark(oklch(0.91 0 265),oklch(0.31 0 265));
--vibeui-accordion-005-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-accordion-005-warn:light-dark(oklch(0.68 0.15 70),oklch(0.78 0.15 75));
/* Цвет подписи выводится из самого цвета внимания: заданный через проп warn
   оттенок не должен требовать второй настройки. */
--vibeui-accordion-005-warn-ink:light-dark(
color-mix(in oklab,var(--vibeui-accordion-005-warn) 62%,black),
color-mix(in oklab,var(--vibeui-accordion-005-warn) 80%,white));
--vibeui-accordion-005-radius:0.75rem;
--vibeui-accordion-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:42rem;box-sizing:border-box;
color:var(--vibeui-accordion-005-fg);font-family:var(--vibeui-accordion-005-font);
}
[data-vibeui-block="accordion-005"] details,
[data-vibeui-block="accordion-005"] [data-part="locked"]{
position:relative;overflow:hidden;
border:1px solid var(--vibeui-accordion-005-border);
border-radius:var(--vibeui-accordion-005-radius);
background:var(--vibeui-accordion-005-bg);
}
[data-vibeui-block="accordion-005"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.9375rem 1.0625rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.4;
}
[data-vibeui-block="accordion-005"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-005"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-005-accent);outline-offset:-2px}
[data-vibeui-block="accordion-005"] [data-part="title"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="accordion-005"] [data-part="status"]{
flex:none;padding:0.1875rem 0.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-accordion-005-border) 55%,transparent);
color:var(--vibeui-accordion-005-muted);
font-size:0.6875rem;font-weight:600;white-space:nowrap;
}
/* Бокс значка постоянного размера: подпись состояния не съезжает при смене
   фигуры, а строки остаются выровненными между собой. */
[data-vibeui-block="accordion-005"] [data-part="marker"]{
position:relative;flex:none;width:0.625rem;height:0.625rem;
}
[data-vibeui-block="accordion-005"] [data-part="marker"]::before{
content:"";position:absolute;left:50%;top:50%;
transition:transform .18s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-005"][data-marker="chevron"] [data-part="marker"]::before{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-005-muted);
border-bottom:1.5px solid var(--vibeui-accordion-005-muted);
transform:translate(-70%,-50%) rotate(-45deg);
}
[data-vibeui-block="accordion-005"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
border-right-color:var(--vibeui-accordion-005-accent);
border-bottom-color:var(--vibeui-accordion-005-accent);
}
[data-vibeui-block="accordion-005"][data-marker="triangle"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;transform:translate(-50%,-50%);
background:var(--vibeui-accordion-005-muted);
clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-005"][data-marker="triangle"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(90deg);background:var(--vibeui-accordion-005-accent);color:oklch(from var(--vibeui-accordion-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="accordion-005"][data-marker="square"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;border-radius:1px;transform:translate(-50%,-50%);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-005-muted);
}
[data-vibeui-block="accordion-005"][data-marker="square"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(45deg);
background:var(--vibeui-accordion-005-accent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-005-accent);color:oklch(from var(--vibeui-accordion-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="accordion-005"][data-marker="plus"] [data-part="marker"]::before,
[data-vibeui-block="accordion-005"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;left:0;top:50%;
width:100%;height:1.5px;margin-top:-0.75px;border-radius:1px;transform:none;
background:var(--vibeui-accordion-005-muted);
transition:transform .18s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-005"][data-marker="plus"] [data-part="marker"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-005"][data-marker="plus"] details[open] [data-part="marker"]::after{transform:rotate(0deg)}
[data-vibeui-block="accordion-005"][data-marker="plus"] details[open] [data-part="marker"]::before,
[data-vibeui-block="accordion-005"][data-marker="plus"] details[open] [data-part="marker"]::after{background:var(--vibeui-accordion-005-accent);color:oklch(from var(--vibeui-accordion-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="accordion-005"] [data-part="body"]{
margin:0;padding:0 1.0625rem 1.0625rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-005-muted);max-width:62ch;
}
/* Требует внимания: полоса у края плюс тёплая подпись состояния. */
[data-vibeui-block="accordion-005"] details[data-highlighted="true"]{
border-color:color-mix(in oklab,var(--vibeui-accordion-005-warn) 45%,var(--vibeui-accordion-005-border));
background:color-mix(in oklab,var(--vibeui-accordion-005-warn) 6%,var(--vibeui-accordion-005-bg));
}
[data-vibeui-block="accordion-005"][data-stripe="bar"] details[data-highlighted="true"]::before{
content:"";position:absolute;left:0;top:0;bottom:0;width:3px;
background:var(--vibeui-accordion-005-warn);
}
[data-vibeui-block="accordion-005"][data-stripe="ring"] details[data-highlighted="true"]{
box-shadow:0 0 0 2px color-mix(in oklab,var(--vibeui-accordion-005-warn) 30%,transparent);
}
[data-vibeui-block="accordion-005"] details[data-highlighted="true"] [data-part="status"]{
background:color-mix(in oklab,var(--vibeui-accordion-005-warn) 18%,transparent);
color:var(--vibeui-accordion-005-warn-ink);
}
/* Недоступный раздел: не <details>, а статичный блок — раскрывать нечего. */
[data-vibeui-block="accordion-005"] [data-part="locked"]{
opacity:.65;background:color-mix(in oklab,var(--vibeui-accordion-005-border) 22%,var(--vibeui-accordion-005-bg));
}
[data-vibeui-block="accordion-005"] [data-part="locked"] [data-part="head"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.9375rem 1.0625rem;cursor:not-allowed;
font-size:0.9375rem;font-weight:550;line-height:1.4;
}
[data-vibeui-block="accordion-005"] [data-part="reason"]{
margin:0;padding:0 1.0625rem 0.875rem;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-accordion-005-muted);
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-005"] summary,
[data-vibeui-block="accordion-005"] [data-part="locked"] [data-part="head"]{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-005"] [data-part="body"]{padding:0 1.375rem 1.25rem;font-size:0.9375rem}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-005"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion005Item[] = [
  {
    title: "Реквизиты компании",
    status: "Готово",
    body: "ИНН, юридический адрес и банковский счёт заполнены. Изменения вступают в силу со следующего расчётного периода.",
  },
  {
    title: "Подтверждение почты",
    status: "Нужен ответ",
    highlighted: true,
    body: "Письмо отправлено на адрес администратора. Пока адрес не подтверждён, счета уходят только внутрь личного кабинета.",
  },
  {
    title: "Договор с приложениями",
    status: "Готово",
    body: "Подписан электронной подписью 4 марта. Копия доступна в разделе документов.",
  },
  {
    title: "Экспорт бухгалтерии",
    status: "Недоступно",
    disabled: true,
    body: "Раздел откроется после подтверждения почты: выгрузка отправляется на подтверждённый адрес.",
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
 * Аккордеон с состояниями разделов: подсвеченный и недоступный.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion005({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  marker = "chevron",
  stripe = "bar",
  warn,
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion005Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-005-accent": accent } : null),
    ...(warn ? { "--vibeui-accordion-005-warn": warn } : null),
    ...(background
      ? {
          "--vibeui-accordion-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-005"
        data-marker={marker}
        data-stripe={stripe}
        className={className}
        style={palette}
      >
        {items.map((item, index) =>
          item.disabled ? (
            <div key={item.title} data-part="locked" aria-disabled="true">
              <div data-part="head">
                <span data-part="title">{item.title}</span>
                {item.status ? (
                  <span data-part="status">{item.status}</span>
                ) : null}
              </div>
              <p data-part="reason">{item.body}</p>
            </div>
          ) : (
            <details
              key={item.title}
              open={index === defaultOpen}
              data-highlighted={item.highlighted || undefined}
            >
              <summary>
                <span data-part="title">{item.title}</span>
                {item.status ? (
                  <span data-part="status">{item.status}</span>
                ) : null}
                {marker === "none" ? null : (
                  <span data-part="marker" aria-hidden="true" />
                )}
              </summary>
              <p data-part="body">{item.body}</p>
            </details>
          ),
        )}
      </div>
    </>
  )
}
