import type { CSSProperties } from "react"

export type Tabs010Tab = {
  label: string
  title: string
  text: string
}

export type Tabs010Props = {
  tabs?: Tabs010Tab[]
  name?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись группы вкладок для скринридера. */
  groupLabel?: string
  /** Пояснение под панелью. Пусто — строки нет. */
  hint?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: вкладки без JS, но с переезжающим индикатором. Выбор держат
// радиокнопки, а положение полосы задаёт правило :has() — отмеченная кнопка
// выставляет индекс переменной, и полоса едет по арифметике в CSS. Панели
// показываются тем же :has(): ни состояния, ни гидратации, ни измерений.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте рамка светлее фона, а не темнее.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченной вкладки.
const STYLES = `
:where([data-vibeui-block="tabs-010"]){
--vibeui-tabs-010-bg:transparent;
--vibeui-tabs-010-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-tabs-010-muted:color-mix(in oklab,var(--vibeui-tabs-010-fg) 68%,transparent);
--vibeui-tabs-010-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-tabs-010-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-tabs-010-index:0;
--vibeui-tabs-010-count:4;
--vibeui-tabs-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-010"]{color-scheme:dark}
[data-vibeui-block="tabs-010"]{
box-sizing:border-box;width:100%;max-width:30rem;padding:0.375rem 0.875rem 1rem;
background:var(--vibeui-tabs-010-bg);color:var(--vibeui-tabs-010-fg);
border:1px solid var(--vibeui-tabs-010-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-010-font);
}
[data-vibeui-block="tabs-010"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="tabs-010"] [data-part="strip"]{
position:relative;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;
border-bottom:1px solid var(--vibeui-tabs-010-border);
}
[data-vibeui-block="tabs-010"] [data-part="tab"]{
display:flex;align-items:center;justify-content:center;cursor:pointer;
padding:0.6875rem 0.375rem;border-radius:0.5rem 0.5rem 0 0;
font-size:0.8125rem;font-weight:500;color:var(--vibeui-tabs-010-muted);
text-align:center;
}
[data-vibeui-block="tabs-010"] input:checked + [data-part="tab"]{color:var(--vibeui-tabs-010-fg);font-weight:650}
[data-vibeui-block="tabs-010"] input:focus-visible + [data-part="tab"]{outline:2px solid var(--vibeui-tabs-010-accent);outline-offset:-3px}
/* Индекс выставляет отмеченная кнопка, полоса едет от него арифметикой. */
[data-vibeui-block="tabs-010"]:has(input[data-index="0"]:checked){--vibeui-tabs-010-index:0}
[data-vibeui-block="tabs-010"]:has(input[data-index="1"]:checked){--vibeui-tabs-010-index:1}
[data-vibeui-block="tabs-010"]:has(input[data-index="2"]:checked){--vibeui-tabs-010-index:2}
[data-vibeui-block="tabs-010"]:has(input[data-index="3"]:checked){--vibeui-tabs-010-index:3}
[data-vibeui-block="tabs-010"]:has(input[data-index="4"]:checked){--vibeui-tabs-010-index:4}
[data-vibeui-block="tabs-010"]:has(input[data-index="5"]:checked){--vibeui-tabs-010-index:5}
[data-vibeui-block="tabs-010"] [data-part="ink"]{
position:absolute;left:0;bottom:-1px;height:2px;border-radius:2px 2px 0 0;
width:calc(100% / var(--vibeui-tabs-010-count));
transform:translateX(calc(var(--vibeui-tabs-010-index) * 100%)) scaleX(0.7);
background:var(--vibeui-tabs-010-accent);
transition:transform .24s cubic-bezier(.32,.72,0,1);color:oklch(from var(--vibeui-tabs-010-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="tabs-010"] [data-part="panel"]{
display:none;padding-top:0.875rem;font-size:0.875rem;line-height:1.6;
color:var(--vibeui-tabs-010-muted);
}
[data-vibeui-block="tabs-010"] [data-part="panel"] h3{margin:0 0 0.25rem;font-size:0.9375rem;color:var(--vibeui-tabs-010-fg)}
[data-vibeui-block="tabs-010"] [data-part="hint"]{
margin:0.75rem 0 0;padding-top:0.625rem;
border-top:1px dashed var(--vibeui-tabs-010-border);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-tabs-010-muted);
}
[data-vibeui-block="tabs-010"]:has(input[data-index="0"]:checked) [data-part="panel"][data-index="0"]{display:block}
[data-vibeui-block="tabs-010"]:has(input[data-index="1"]:checked) [data-part="panel"][data-index="1"]{display:block}
[data-vibeui-block="tabs-010"]:has(input[data-index="2"]:checked) [data-part="panel"][data-index="2"]{display:block}
[data-vibeui-block="tabs-010"]:has(input[data-index="3"]:checked) [data-part="panel"][data-index="3"]{display:block}
[data-vibeui-block="tabs-010"]:has(input[data-index="4"]:checked) [data-part="panel"][data-index="4"]{display:block}
[data-vibeui-block="tabs-010"]:has(input[data-index="5"]:checked) [data-part="panel"][data-index="5"]{display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TABS: Tabs010Tab[] = [
  {
    label: "Доставка",
    title: "Сроки и стоимость",
    text: "По городу — в день заказа, если оформить до 16:00. По стране — от двух дней транспортной компанией.",
  },
  {
    label: "Оплата",
    title: "Способы оплаты",
    text: "Картой на сайте, при получении и по счёту для юридических лиц. Рассрочка на три месяца без процентов.",
  },
  {
    label: "Возврат",
    title: "Как вернуть",
    text: "Четырнадцать дней на возврат без объяснения причин. Деньги приходят в течение пяти рабочих дней.",
  },
  {
    label: "Гарантия",
    title: "Гарантийный срок",
    text: "Год на технику и два года на аксессуары. Ремонт и замена делаются в сервисном центре производителя.",
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
 * Вкладки на радиокнопках с переезжающим индикатором и без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs010({
  tabs = DEFAULT_TABS,
  name = "vibeui-tabs-010",
  background = "",
  accent,
  groupLabel = "Условия",
  hint = "",
  className,
  style,
  ...props
}: Tabs010Props) {
  const palette = {
    "--vibeui-tabs-010-count": `${tabs.length}`,
    ...(accent ? { "--vibeui-tabs-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tabs-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-010"
        className={className}
        style={palette}
      >
        <form data-part="strip" role="radiogroup" aria-label={groupLabel}>
          {tabs.map((tab, index) => (
            <label key={tab.label}>
              <input
                type="radio"
                name={name}
                value={tab.label}
                data-index={index}
                defaultChecked={index === 0}
              />
              <span data-part="tab">{tab.label}</span>
            </label>
          ))}
          <span data-part="ink" aria-hidden="true" />
        </form>
        {tabs.map((tab, index) => (
          <div key={tab.label} data-part="panel" data-index={index}>
            <h3>{tab.title}</h3>
            {tab.text}
          </div>
        ))}
        {hint ? <p data-part="hint">{hint}</p> : null}
      </div>
    </>
  )
}
