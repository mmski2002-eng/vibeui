import type { CSSProperties } from "react"

type Faq003Entry = {
  question: string
  answer: string
}

type Faq003Group = {
  label: string
  items: Faq003Entry[]
}

export type Faq003Props = {
  title?: string
  description?: string
  groups?: Faq003Group[]
  id?: string
  /** Подпись радио-переключателя. {label} — название раздела. */
  tabLabelText?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Вопросы, разложенные по категориям-вкладкам. Вкладки собраны на радио-
// кнопках: переключение живёт в DOM, состояния в React нет, компонент
// остаётся серверным. Радио спрятаны visually-hidden, но остаются в потоке
// фокуса, поэтому стрелками вкладки листаются так же, как настоящие tabs.
// Поддерживается до пяти категорий — по числу правил :nth-of-type ниже.
//
// Тема приходит из color-scheme окружения через light-dark(): подложки у
// секции по умолчанию нет, она темнеет вместе со страницей.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="faq-003"]){
--vibeui-faq-003-bg:transparent;
--vibeui-faq-003-card:light-dark(oklch(1 0 0),oklch(0.26 0 285));
--vibeui-faq-003-ink:light-dark(oklch(0.22 0 285),oklch(0.95 0 285));
--vibeui-faq-003-muted:light-dark(oklch(0.5 0 285),oklch(0.72 0 285));
--vibeui-faq-003-border:light-dark(oklch(0.9 0 285),oklch(0.35 0 285));
--vibeui-faq-003-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.72 0.16 39.8));
--vibeui-faq-003-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-faq-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-003"]{color-scheme:dark}
[data-vibeui-block="faq-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-faq-003-bg);color:var(--vibeui-faq-003-ink);
font-family:var(--vibeui-faq-003-font);
}
[data-vibeui-block="faq-003"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="faq-003"] [data-part="title"]{
margin:0;max-width:20ch;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="faq-003"] [data-part="text"]{
margin:0.75rem 0 0;max-width:58ch;color:var(--vibeui-faq-003-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="faq-003"] [data-part="deck"]{margin-top:2rem}
[data-vibeui-block="faq-003"] [data-part="radio"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="faq-003"] [data-part="tablist"]{
display:flex;gap:0.375rem;overflow-x:auto;scrollbar-width:none;
padding-bottom:0.75rem;border-bottom:1px solid var(--vibeui-faq-003-border);
}
[data-vibeui-block="faq-003"] [data-part="tablist"]::-webkit-scrollbar{display:none}
[data-vibeui-block="faq-003"] [data-part="tab"]{
cursor:pointer;flex:none;white-space:nowrap;
padding:0.4375rem 0.875rem;border-radius:999px;
border:1px solid var(--vibeui-faq-003-border);background:var(--vibeui-faq-003-card);
color:var(--vibeui-faq-003-muted);font-size:0.875rem;font-weight:560;
transition:color .16s ease,background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="faq-003"] [data-part="tab"]:hover{color:var(--vibeui-faq-003-ink)}
[data-vibeui-block="faq-003"] [data-part="panel"]{display:none;padding-top:1.25rem}
[data-vibeui-block="faq-003"] [data-part="row"]{
border-bottom:1px solid var(--vibeui-faq-003-border);
}
[data-vibeui-block="faq-003"] [data-part="row"] summary{
cursor:pointer;list-style:none;position:relative;
padding:0.9375rem 2rem 0.9375rem 0;
font-size:1rem;font-weight:600;line-height:1.4;
}
[data-vibeui-block="faq-003"] [data-part="row"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="faq-003"] [data-part="row"] summary::after{
content:"";position:absolute;right:0.25rem;top:1.25rem;width:0.75rem;height:2px;border-radius:2px;
background:var(--vibeui-faq-003-accent);
box-shadow:0 0 0 0 transparent;
}
[data-vibeui-block="faq-003"] [data-part="row"] summary::before{
content:"";position:absolute;right:0.5625rem;top:0.875rem;width:2px;height:0.75rem;border-radius:2px;
background:var(--vibeui-faq-003-accent);
transition:transform .18s ease,opacity .18s ease;
}
[data-vibeui-block="faq-003"] [data-part="row"][open] summary::before{transform:scaleY(0);opacity:0}
[data-vibeui-block="faq-003"] [data-part="row"] summary:focus-visible{outline:2px solid var(--vibeui-faq-003-accent);outline-offset:2px}
[data-vibeui-block="faq-003"] [data-part="answer"]{
margin:0;padding:0 0 1.125rem;max-width:64ch;
color:var(--vibeui-faq-003-muted);font-size:0.9375rem;line-height:1.6;
}
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(1):checked ~ [data-part="panels"] > [data-part="panel"]:nth-child(1),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(2):checked ~ [data-part="panels"] > [data-part="panel"]:nth-child(2),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(3):checked ~ [data-part="panels"] > [data-part="panel"]:nth-child(3),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(4):checked ~ [data-part="panels"] > [data-part="panel"]:nth-child(4),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(5):checked ~ [data-part="panels"] > [data-part="panel"]:nth-child(5){display:block}
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(1):checked ~ [data-part="tablist"] > [data-part="tab"]:nth-child(1),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(2):checked ~ [data-part="tablist"] > [data-part="tab"]:nth-child(2),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(3):checked ~ [data-part="tablist"] > [data-part="tab"]:nth-child(3),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(4):checked ~ [data-part="tablist"] > [data-part="tab"]:nth-child(4),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(5):checked ~ [data-part="tablist"] > [data-part="tab"]:nth-child(5){
background:var(--vibeui-faq-003-accent);border-color:var(--vibeui-faq-003-accent);color:var(--vibeui-faq-003-accent-fg);
}
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(1):focus-visible ~ [data-part="tablist"] > [data-part="tab"]:nth-child(1),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(2):focus-visible ~ [data-part="tablist"] > [data-part="tab"]:nth-child(2),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(3):focus-visible ~ [data-part="tablist"] > [data-part="tab"]:nth-child(3),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(4):focus-visible ~ [data-part="tablist"] > [data-part="tab"]:nth-child(4),
[data-vibeui-block="faq-003"] [data-part="radio"]:nth-of-type(5):focus-visible ~ [data-part="tablist"] > [data-part="tab"]:nth-child(5){
outline:2px solid var(--vibeui-faq-003-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="faq-003"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="faq-003"] [data-part="row"] summary{font-size:1.0625rem;padding-block:1.125rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="faq-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Faq003Group[] = [
  {
    label: "Доставка",
    items: [
      {
        question: "Когда привезут заказ по городу?",
        answer:
          "На следующий день, если оформить до 20:00. Курьер звонит за час и называет точный интервал.",
      },
      {
        question: "Можно ли забрать самому?",
        answer:
          "Да, пункт выдачи на Ленинской работает без выходных с 10:00 до 21:00, заказ хранится семь дней.",
      },
      {
        question: "Доставляете в другие регионы?",
        answer:
          "Отправляем транспортной компанией. Срок — от двух до шести дней, стоимость считается при оформлении.",
      },
    ],
  },
  {
    label: "Оплата",
    items: [
      {
        question: "Какие способы оплаты есть?",
        answer:
          "Карта, СБП и счёт для юридических лиц. Наличные принимает курьер, но только при доставке по городу.",
      },
      {
        question: "Есть ли рассрочка?",
        answer:
          "Да, на заказы от десяти тысяч рублей — на три, шесть или десять месяцев без переплаты.",
      },
    ],
  },
  {
    label: "Возврат",
    items: [
      {
        question: "Сколько дней на возврат?",
        answer:
          "Четырнадцать дней с момента получения, если вещь не была в использовании и сохранён товарный вид.",
      },
      {
        question: "Кто платит за обратную доставку?",
        answer:
          "Если товар оказался бракованным — мы. Если просто не подошёл — обратная доставка за счёт покупателя.",
      },
      {
        question: "Когда вернутся деньги?",
        answer:
          "В течение десяти рабочих дней после того, как товар приедет на склад и пройдёт проверку.",
      },
    ],
  },
  {
    label: "Гарантия",
    items: [
      {
        question: "Что покрывает гарантия?",
        answer:
          "Заводские дефекты в течение года. Механические повреждения и следы влаги в гарантию не входят.",
      },
      {
        question: "Нужен ли чек?",
        answer:
          "Нет, все покупки видны в личном кабинете по номеру телефона, чек ищем сами.",
      },
    ],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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

/** Вопросы по категориям-вкладкам: переключение на радио, без JS. */
export function Faq003({
  title = "Вопросы по разделам",
  description = "Выберите тему — покажем вопросы только по ней. Разделы переключаются без перезагрузки и работают с клавиатуры стрелками.",
  groups = DEFAULT_GROUPS,
  id = "vibeui-faq-003",
  tabLabelText = "Раздел вопросов: {label}",
  background = "",
  accent,
  className,
  style,
}: Faq003Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-faq-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-003"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <p data-part="text">{description}</p>
          <form data-part="deck">
            {groups.map((group, index) => (
              <input
                key={group.label}
                data-part="radio"
                type="radio"
                name={id}
                id={`${id}-${index}`}
                defaultChecked={index === 0}
                aria-label={tabLabelText.replace("{label}", group.label)}
              />
            ))}
            <div data-part="tablist">
              {groups.map((group, index) => (
                <label
                  key={group.label}
                  data-part="tab"
                  htmlFor={`${id}-${index}`}
                >
                  {group.label}
                </label>
              ))}
            </div>
            <div data-part="panels">
              {groups.map((group) => (
                <div key={group.label} data-part="panel">
                  {group.items.map((entry) => (
                    <details key={entry.question} data-part="row">
                      <summary>{entry.question}</summary>
                      <p data-part="answer">{entry.answer}</p>
                    </details>
                  ))}
                </div>
              ))}
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
