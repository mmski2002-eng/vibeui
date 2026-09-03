import type { ComponentProps, CSSProperties } from "react"

export type Accordion012Item = {
  question: string
  answer: string
}

/** Ответ лежит в утопленном колодце или на плоской плашке. */
export type Accordion012Well = "sunken" | "flat"

export type Accordion012Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion012Item[]
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  /** Открытым остаётся только один раздел: группировка через атрибут name. */
  exclusive?: boolean
  /**
   * Имя группы взаимного исключения. Двум аккордеонам на одной странице
   * нужны разные имена, иначе они делят одну радиогруппу.
   */
  group?: string
  well?: Accordion012Well
  /** Цвет материала: плашка, из которой вырезано окно ответа. */
  slab?: string
}

// Идея компонента: он сделан из одного куска материала. Раскрытие пробивает
// в нём окно — ответ лежит в утопленном светлом колодце. Маркер слева не
// иконка рядом с идеей, а её модель в масштабе 1:8: щель, которая
// раскрывается в рамку окна.
//
// Акцентного цвета здесь нет намеренно: состояния держатся на контрасте
// материала и света. Добавить акцент — значит разрушить приём.
//
// Тёмная ветка не инверсия светлой, а та же физика с другим знаком: на
// светлом вырез впускает свет и колодец светлее плашки, на тёмном впускать
// нечего — колодец уходит в темноту, а кромку ловит блик сверху.
const STYLES = `
:where([data-vibeui-block="accordion-012"]){
--vibeui-accordion-012-slab:light-dark(oklch(0.885 0.009 85),oklch(0.265 0.008 85));
--vibeui-accordion-012-slab-hi:light-dark(oklch(0.912 0.009 85),oklch(0.305 0.009 85));
--vibeui-accordion-012-well:light-dark(oklch(0.99 0.002 85),oklch(0.175 0.006 85));
--vibeui-accordion-012-fg:light-dark(oklch(0.2 0.012 85),oklch(0.95 0.004 85));
--vibeui-accordion-012-muted:color-mix(in oklab,var(--vibeui-accordion-012-fg) 68%,transparent);
--vibeui-accordion-012-edge:light-dark(oklch(0.82 0.012 85),oklch(0.325 0.01 85));
/* Кромка колодца: на светлом это мягкая тень внутрь, на тёмном — блик
   сверху плюс глубокая тень. Один рецепт с обратным знаком не сработал бы. */
--vibeui-accordion-012-well-shadow:light-dark(
inset 0 1px 2px oklch(0.5 0.01 85 / 18%),
inset 0 1px 0 oklch(1 0 0 / 9%));
--vibeui-accordion-012-radius:0.25rem;
--vibeui-accordion-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-012"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:44rem;box-sizing:border-box;overflow:hidden;
border-radius:var(--vibeui-accordion-012-radius);
background:var(--vibeui-accordion-012-slab);
color:var(--vibeui-accordion-012-fg);
font-family:var(--vibeui-accordion-012-font);
}
[data-vibeui-block="accordion-012"] details + details{
border-top:1px solid var(--vibeui-accordion-012-edge);
}
[data-vibeui-block="accordion-012"] summary{
display:flex;align-items:center;gap:0.875rem;
padding:0.9375rem 1.0625rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:600;letter-spacing:-0.015em;line-height:1.35;
transition:background .14s ease;
}
[data-vibeui-block="accordion-012"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-012"] summary:hover{background:var(--vibeui-accordion-012-slab-hi)}
/* Обводка фокуса внутрь и цветом текста: акцента у компонента нет, а
   разрывать плашку внешним кольцом нельзя — она одна и цельная. */
[data-vibeui-block="accordion-012"] summary:focus-visible{
outline:2px solid var(--vibeui-accordion-012-fg);outline-offset:-3px;
}
/* Маркер — уменьшенная модель выреза: щель раскрывается в окно. */
[data-vibeui-block="accordion-012"] [data-part="slit"]{
width:0.875rem;height:2px;flex:none;border-radius:1px;
background:var(--vibeui-accordion-012-fg);opacity:.55;
transition:width .18s ease,height .18s ease,opacity .18s ease,background .18s ease,box-shadow .18s ease;
}
[data-vibeui-block="accordion-012"] summary:hover [data-part="slit"]{width:1.125rem;opacity:.8}
[data-vibeui-block="accordion-012"] details[open] [data-part="slit"]{
height:0.5625rem;border-radius:1.5px;opacity:1;
background:var(--vibeui-accordion-012-well);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-012-fg);
}
[data-vibeui-block="accordion-012"] [data-part="answer"]{
margin:0 0.625rem 0.625rem;padding:0.8125rem 0.9375rem;
border-radius:calc(var(--vibeui-accordion-012-radius) * 0.75);
background:var(--vibeui-accordion-012-well);
box-shadow:var(--vibeui-accordion-012-well-shadow);
font-size:0.875rem;line-height:1.65;color:var(--vibeui-accordion-012-muted);
}
/* Плоский вариант: колодца нет, ответ лежит на самой плашке. Он показывает,
   зачем нужен вырез, — и годится там, где материал уже светлый. */
[data-vibeui-block="accordion-012"][data-well="flat"] [data-part="answer"]{
margin:0;padding:0 1.0625rem 0.9375rem 2.9375rem;
border-radius:0;background:transparent;box-shadow:none;
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-012"] summary{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-012"] [data-part="answer"]{
margin:0 0.8125rem 0.8125rem;padding:0.9375rem 1.125rem;font-size:0.9375rem;
}
[data-vibeui-block="accordion-012"][data-well="flat"] [data-part="answer"]{
margin:0;padding:0 1.375rem 1.0625rem 3.25rem;
}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-012"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion012Item[] = [
  {
    question: "Что именно я получаю после установки?",
    answer:
      "Один файл компонента в вашем проекте. Тот же самый, который вы видели в превью: ни сборки, ни обёрток, ни привязки к нашей теме.",
  },
  {
    question: "А если у меня своя дизайн-система?",
    answer:
      "Компонент несёт собственную палитру в локальных переменных. Переопределите их — и он встанет в вашу тему, не трогая остальной проект.",
  },
  {
    question: "Нужно ли ставить дополнительные библиотеки?",
    answer:
      "Нет. Зависимости объявлены в метаданных каждого компонента, и у большинства их ноль: только React.",
  },
]

/**
 * Ветка темы для заданного материала. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Аккордеон-диафрагма: ответ — вырез в плотной плашке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion012({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  exclusive = true,
  group = "vibeui-accordion-012",
  well = "sunken",
  slab = "",
  className,
  style,
  ...props
}: Accordion012Props) {
  // Заданный материал тянет за собой подсветку строки и линию между
  // разделами. Подсветка светлеет в обеих ветках — это свет, падающий на
  // материал; линия, наоборот, набирает контраст к тексту, поэтому у неё
  // другая формула.
  const palette = {
    ...(slab
      ? {
          "--vibeui-accordion-012-slab": slab,
          "--vibeui-accordion-012-slab-hi": `color-mix(in oklab,${slab} 92%,white)`,
          "--vibeui-accordion-012-edge": `color-mix(in oklab,${slab} 82%,var(--vibeui-accordion-012-fg))`,
          colorScheme: schemeForBackground(slab),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-012"
        data-well={well}
        className={className}
        style={palette}
      >
        {items.map((item, index) => (
          <details
            key={item.question}
            name={exclusive ? group : undefined}
            open={index === defaultOpen}
          >
            <summary>
              <span data-part="slit" aria-hidden="true" />
              {item.question}
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}
