import type { ComponentProps, CSSProperties } from "react"

export type Accordion013Item = {
  question: string
  answer: string
}

export type Accordion013Props = Omit<ComponentProps<"div">, "children"> & {
  items?: Accordion013Item[]
  /** Номер раздела, открытого сразу. -1 — все закрыты. */
  defaultOpen?: number
  /** Открытым остаётся только один раздел: группировка через атрибут name. */
  exclusive?: boolean
  /**
   * Имя группы взаимного исключения. Двум аккордеонам на одной странице
   * нужны разные имена, иначе они делят одну радиогруппу.
   */
  group?: string
  /** Глубина нажатия в пикселях, 0–4. Ноль превращает клавиши в плитки. */
  travel?: number
  /** Цвет беда — подложки, из которой торчат клавиши. */
  ground?: string
  /** Цвет индикатора нажатой клавиши. */
  accent?: string
}

// Идея компонента: раздел — клавиша, и нажатой остаётся ровно одна. Атрибут
// name делает разделы радиогруппой, а дизайн показывает это физически:
// открытая клавиша уходит вниз, теряет нижнюю грань и садится в бед.
// Внешней рамки нет — рамкой работает сам бед между клавишами.
//
// Дисциплина здесь и есть дизайн: ноль градиентов, ноль блика, ход ровно
// в travel пикселей. Стоит добавить блеск — и вместо тактильности получится
// Web 2.0.
//
// Тёмная ветка переворачивает физику грани: на светлом нижняя грань — тень
// под клавишей, на тёмном тень не видна, поэтому грань становится провалом
// темнее беда, а индикатор набирает свечение.
const STYLES = `
:where([data-vibeui-block="accordion-013"]){
--vibeui-accordion-013-ground:light-dark(oklch(0.94 0.005 85),oklch(0.195 0 265));
--vibeui-accordion-013-key:light-dark(oklch(0.995 0.002 85),oklch(0.255 0 265));
--vibeui-accordion-013-key-down:light-dark(oklch(0.965 0.004 85),oklch(0.215 0 265));
--vibeui-accordion-013-edge:light-dark(oklch(0.86 0.008 85),oklch(0.14 0 265));
--vibeui-accordion-013-fg:light-dark(oklch(0.22 0 265),oklch(0.93 0 265));
--vibeui-accordion-013-muted:color-mix(in oklab,var(--vibeui-accordion-013-fg) 68%,transparent);
--vibeui-accordion-013-accent:light-dark(oklch(0.52 0.18 258),oklch(0.72 0.16 258));
--vibeui-accordion-013-press:light-dark(oklch(0.6 0.01 85 / 22%),oklch(0 0 0 / 50%));
/* Свечение индикатора только в тёмной ветке: на светлом фоне оно не читается
   и превращается в грязь вокруг квадрата. */
--vibeui-accordion-013-led-glow:light-dark(0 0 0 transparent,0 0 6px oklch(0.72 0.16 258 / 55%));
--vibeui-accordion-013-travel:2px;
--vibeui-accordion-013-radius:0.5rem;
--vibeui-accordion-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="accordion-013"]{
display:flex;flex-direction:column;gap:2px;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:44rem;box-sizing:border-box;
padding:2px;border-radius:var(--vibeui-accordion-013-radius);
background:var(--vibeui-accordion-013-ground);
color:var(--vibeui-accordion-013-fg);
font-family:var(--vibeui-accordion-013-font);
}
/* Нижняя грань клавиши — тень в один ход, а не border: border прибавил бы
   строке высоту, и ход стал бы прыжком. */
[data-vibeui-block="accordion-013"] details{
background:var(--vibeui-accordion-013-key);
border-radius:calc(var(--vibeui-accordion-013-radius) - 2px);
box-shadow:0 var(--vibeui-accordion-013-travel) 0 var(--vibeui-accordion-013-edge);
transition:transform .14s ease,box-shadow .14s ease,background .14s ease;
}
[data-vibeui-block="accordion-013"] details[open]{
background:var(--vibeui-accordion-013-key-down);
transform:translateY(var(--vibeui-accordion-013-travel));
box-shadow:inset 0 var(--vibeui-accordion-013-travel) 3px var(--vibeui-accordion-013-press);
}
[data-vibeui-block="accordion-013"] details:not([open]):hover{
transform:translateY(-1px);
box-shadow:0 calc(var(--vibeui-accordion-013-travel) + 1px) 0 var(--vibeui-accordion-013-edge);
}
/* Кольцо фокуса по всей клавише, а не вокруг текста: попадание видно
   с любого расстояния. */
[data-vibeui-block="accordion-013"] details:has(summary:focus-visible){
box-shadow:inset 0 0 0 2px var(--vibeui-accordion-013-accent);
}
[data-vibeui-block="accordion-013"] summary{
display:flex;align-items:center;gap:0.75rem;
padding:0.9375rem 1.0625rem;cursor:pointer;list-style:none;
font-size:0.9375rem;font-weight:500;letter-spacing:-0.01em;line-height:1.35;
}
[data-vibeui-block="accordion-013"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="accordion-013"] summary:focus-visible{outline:none}
/* Индикатор: контур у отпущенной клавиши, залитый квадрат у нажатой. */
[data-vibeui-block="accordion-013"] [data-part="led"]{
width:0.5625rem;height:0.5625rem;flex:none;border-radius:2px;
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-013-muted);
transition:box-shadow .14s ease,background .14s ease;
}
[data-vibeui-block="accordion-013"] details:not([open]):hover [data-part="led"]{
box-shadow:inset 0 0 0 2px var(--vibeui-accordion-013-fg);
}
[data-vibeui-block="accordion-013"] details[open] [data-part="led"]{
background:var(--vibeui-accordion-013-accent);
box-shadow:inset 0 0 0 1.5px var(--vibeui-accordion-013-accent),var(--vibeui-accordion-013-led-glow);
}
[data-vibeui-block="accordion-013"] [data-part="answer"]{
margin:0;padding:0 1.0625rem 0.9375rem 2.375rem;
font-size:0.875rem;line-height:1.65;color:var(--vibeui-accordion-013-muted);
}
@container (min-width: 32rem){
[data-vibeui-block="accordion-013"] summary{padding:1.0625rem 1.375rem;font-size:1rem}
[data-vibeui-block="accordion-013"] [data-part="answer"]{
padding:0 1.375rem 1.0625rem 2.6875rem;font-size:0.9375rem;
}
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="accordion-013"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="accordion-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Accordion013Item[] = [
  {
    question: "Почему открыт только один раздел?",
    answer:
      "Так устроен атрибут name у details: разделы становятся радиогруппой. Клавиша показывает это физически — нажатой остаётся одна.",
  },
  {
    question: "Можно ли открыть сразу несколько?",
    answer:
      "Да, проп exclusive выключает группировку. Клавиши тогда нажимаются независимо, а ход остаётся прежним.",
  },
  {
    question: "Нужен ли для этого JavaScript?",
    answer:
      "Нет. Раскрытие держат нативные details и summary, поэтому клавиатура и поиск по странице работают до гидратации.",
  },
]

/**
 * Ветка темы для заданного беда. Без неё светлая подложка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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
 * Аккордеон-клавиатура: раздел — клавиша, и нажатой остаётся одна.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Accordion013({
  items = DEFAULT_ITEMS,
  defaultOpen = -1,
  exclusive = true,
  group = "vibeui-accordion-013",
  travel = 2,
  ground = "",
  accent,
  className,
  style,
  ...props
}: Accordion013Props) {
  // Клавиша и её грань выводятся из беда: задавать три цвета вручную ради
  // одной подложки никто не станет, а разошедшиеся оттенки сразу читаются
  // как поломка. Клавиша светлее беда в обеих ветках темы, грань темнее —
  // это физика, а не оттенок: подмешивать сюда цвет текста нельзя, на
  // светлой теме клавиша ушла бы темнее подложки и утонула.
  const palette = {
    "--vibeui-accordion-013-travel": `${Math.min(Math.max(travel, 0), 4)}px`,
    ...(accent ? { "--vibeui-accordion-013-accent": accent } : null),
    ...(ground
      ? {
          "--vibeui-accordion-013-ground": ground,
          "--vibeui-accordion-013-key": `color-mix(in oklab,${ground} 88%,white)`,
          "--vibeui-accordion-013-key-down": `color-mix(in oklab,${ground} 95%,white)`,
          "--vibeui-accordion-013-edge": `color-mix(in oklab,${ground} 78%,black)`,
          colorScheme: schemeForBackground(ground),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-accordion-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="accordion"
        data-vibeui-block="accordion-013"
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
              <span data-part="led" aria-hidden="true" />
              {item.question}
            </summary>
            <p data-part="answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </>
  )
}
