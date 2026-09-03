import type { ComponentProps, CSSProperties } from "react"

export type Accordion007Item = {
  title: string
  body: string
  /** Две-три буквы в плитке слева: раздел узнают по ней, а не по тексту. */
  glyph?: string
  /** Плашка справа: «12», «Beta», «Новое». */
  badge?: string
}

/** Значок раздела. Все фигуры рисует компонент, картинка одна во всех движках. */
export type Accordion007Marker =
  "chevron" | "triangle" | "square" | "plus" | "none"

export type Accordion007Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion007Item[]
  defaultOpen?: number
  marker?: Accordion007Marker
  /** Показывать счётчик справа от заголовка. */
  badge?: boolean
  /** Пусто — заливки нет, список держится рамкой поверх фона страницы. */
  background?: string
  accent?: string
}

// Идея компонента: у каждого раздела своя плитка-метка и счётчик справа.
// В списке из десяти пунктов взгляд цепляется за плитку, а не перечитывает
// заголовки. Плитка — текст в квадрате, а не иконка из библиотеки: набор
// разделов у всех разный, а зависимость осталась бы навсегда.
const STYLES = `
:where([data-vibeui-block="accordion-007"]){
--vibeui-accordion-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-accordion-007-muted:color-mix(in oklab,var(--vibeui-accordion-007-fg) 68%,transparent);
--vibeui-accordion-007-bg:transparent;
--vibeui-accordion-007-border:light-dark(oklch(0.91 0.006 265),oklch(0.31 0.01 265));
--vibeui-accordion-007-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-accordion-007-radius:0.875rem;
--vibeui-accordion-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-007"]{
display:flex;flex-direction:column;
width:100%;max-width:42rem;box-sizing:border-box;overflow:hidden;
border:1px solid var(--vibeui-accordion-007-border);
border-radius:var(--vibeui-accordion-007-radius);
background:var(--vibeui-accordion-007-bg);
color:var(--vibeui-accordion-007-fg);font-family:var(--vibeui-accordion-007-font);
}
[data-vibeui-block="accordion-007"] details + details{border-top:1px solid var(--vibeui-accordion-007-border)}
[data-vibeui-block="accordion-007"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.9375rem 1.0625rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:550;line-height:1.35;
}
[data-vibeui-block="accordion-007"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-007"] summary:hover [data-part="glyph"]{
border-color:color-mix(in oklab,var(--vibeui-accordion-007-accent) 40%,var(--vibeui-accordion-007-border));
color:var(--vibeui-accordion-007-accent);
}
[data-vibeui-block="accordion-007"] summary:focus-visible{outline:2px solid var(--vibeui-accordion-007-accent);outline-offset:-2px}
/* Плитка-метка: буквы в квадрате вместо иконки из библиотеки. */
[data-vibeui-block="accordion-007"] [data-part="glyph"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;border-radius:0.625rem;
border:1px solid var(--vibeui-accordion-007-border);
background:color-mix(in oklab,var(--vibeui-accordion-007-border) 22%,transparent);
color:var(--vibeui-accordion-007-muted);
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
transition:color .16s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-007"] details[open] [data-part="glyph"]{
background:color-mix(in oklab,var(--vibeui-accordion-007-accent) 12%,transparent);
border-color:color-mix(in oklab,var(--vibeui-accordion-007-accent) 45%,transparent);
color:var(--vibeui-accordion-007-accent);
}
[data-vibeui-block="accordion-007"] [data-part="title"]{flex:1 1 auto;min-width:0}
[data-vibeui-block="accordion-007"] [data-part="badge"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:9999px;
border:1px solid var(--vibeui-accordion-007-border);
font-size:0.6875rem;font-weight:600;color:var(--vibeui-accordion-007-muted);
font-variant-numeric:tabular-nums;
}
/* Бокс значка постоянного размера: строки остаются выровненными при любой
   фигуре, а отступ ответа считается от него. */
[data-vibeui-block="accordion-007"] [data-part="marker"]{
position:relative;flex:none;width:0.625rem;height:0.625rem;
}
[data-vibeui-block="accordion-007"] [data-part="marker"]::before{
content:"";position:absolute;left:50%;top:50%;
transition:transform .18s ease,border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-007"][data-marker="chevron"] [data-part="marker"]::before{
width:0.4375rem;height:0.4375rem;
border-right:1.5px solid var(--vibeui-accordion-007-muted);
border-bottom:1.5px solid var(--vibeui-accordion-007-muted);
transform:translate(-70%,-50%) rotate(-45deg);
}
[data-vibeui-block="accordion-007"][data-marker="chevron"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-70%) rotate(45deg);
border-right-color:var(--vibeui-accordion-007-accent);border-bottom-color:var(--vibeui-accordion-007-accent);
}
[data-vibeui-block="accordion-007"][data-marker="triangle"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;transform:translate(-50%,-50%);
background:var(--vibeui-accordion-007-muted);clip-path:polygon(15% 0,100% 50%,15% 100%);
}
[data-vibeui-block="accordion-007"][data-marker="triangle"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(90deg);background:var(--vibeui-accordion-007-accent);
}
[data-vibeui-block="accordion-007"][data-marker="square"] [data-part="marker"]::before{
width:0.5rem;height:0.5rem;border-radius:1px;transform:translate(-50%,-50%);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-007-muted);
}
[data-vibeui-block="accordion-007"][data-marker="square"] details[open] [data-part="marker"]::before{
transform:translate(-50%,-50%) rotate(45deg);
background:var(--vibeui-accordion-007-accent);box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-007-accent);
}
[data-vibeui-block="accordion-007"][data-marker="plus"] [data-part="marker"]::before,
[data-vibeui-block="accordion-007"][data-marker="plus"] [data-part="marker"]::after{
content:"";position:absolute;left:0;top:50%;
width:100%;height:1.5px;margin-top:-0.75px;border-radius:1px;transform:none;
background:var(--vibeui-accordion-007-muted);
transition:transform .18s ease,background-color .16s ease;
}
[data-vibeui-block="accordion-007"][data-marker="plus"] [data-part="marker"]::after{transform:rotate(90deg)}
[data-vibeui-block="accordion-007"][data-marker="plus"] details[open] [data-part="marker"]::after{transform:rotate(0deg)}
[data-vibeui-block="accordion-007"][data-marker="plus"] details[open] [data-part="marker"]::before,
[data-vibeui-block="accordion-007"][data-marker="plus"] details[open] [data-part="marker"]::after{background:var(--vibeui-accordion-007-accent)}
[data-vibeui-block="accordion-007"][data-badge="off"] [data-part="badge"]{display:none}
[data-vibeui-block="accordion-007"] [data-part="body"]{
margin:0;padding:0 1.0625rem 1.0625rem 3.8125rem;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-accordion-007-muted);max-width:60ch;
}
/* Общая шкала категории: на широкой раскладке строка и текст подрастают
   на один шаг, тот же, что у соседних аккордеонов. */
@container (min-width: 32rem){
[data-vibeui-block="accordion-007"] summary{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-007"] [data-part="body"]{padding:0 1.375rem 1.125rem 4.125rem;font-size:0.9375rem}
}
@container (max-width: 24rem){
[data-vibeui-block="accordion-007"] [data-part="badge"]{display:none}
[data-vibeui-block="accordion-007"] [data-part="body"]{padding-left:1.0625rem}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-007"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion007Item[] = [
  {
    glyph: "Дс",
    title: "Доступ и роли",
    badge: "12",
    body: "Владелец, редактор и читатель. Роль меняется в настройках участника и вступает в силу сразу, без повторного входа.",
  },
  {
    glyph: "Оп",
    title: "Оплата и счета",
    badge: "5",
    body: "Счета формируются первого числа, закрывающие документы приходят на почту администратора и лежат в разделе документов.",
  },
  {
    glyph: "Ин",
    title: "Интеграции",
    badge: "Beta",
    body: "Почта, платежи и аналитика подключаются в один клик. Остальное — через веб-хуки: ключ выдаётся в настройках проекта.",
  },
  {
    glyph: "Бз",
    title: "Безопасность",
    body: "Двухфакторный вход, журнал действий за 90 дней и выгрузка всех данных проекта по запросу владельца.",
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
 * Аккордеон с плитками-метками и счётчиками: список опознают по плитке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion007({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  marker = "chevron",
  badge = true,
  background = "",
  accent,
  className,
  style,
  ...props
}: Accordion007Props) {
  const palette = {
    ...(accent ? { "--vibeui-accordion-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-accordion-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-007"
        data-marker={marker}
        data-badge={badge ? "on" : "off"}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details key={item.title} open={index === defaultOpen}>
            <summary>
              {item.glyph ? (
                <span data-part="glyph" aria-hidden="true">
                  {item.glyph}
                </span>
              ) : null}
              <span data-part="title">{item.title}</span>
              {item.badge ? <span data-part="badge">{item.badge}</span> : null}
              {marker === "none" ? null : (
                <span data-part="marker" aria-hidden="true" />
              )}
            </summary>
            <p data-part="body">{item.body}</p>
          </details>
        ))}
      </div>
    </>
  )
}
