import type { CSSProperties } from "react"

type FaqAnim001Item = {
  question: string
  answer: string
}

export type FaqAnim001Props = {
  eyebrow?: string
  title?: string
  description?: string
  items?: FaqAnim001Item[]
  contactLabel?: string
  contactHref?: string
  accent?: string
  /** false — первый вопрос стоит раскрытым, цикл выключен. */
  autoplay?: boolean
  className?: string
  style?: CSSProperties
}

// Полноценная секция вопросов и ответов, как у faq-001, но список — не
// интерактивный аккордеон, а зацикленная демонстрация: вопросы раскрываются
// по одному и закрываются перед следующим, без единой строки JS. Высота
// панели анимируется трюком grid-template-rows 0fr→1fr (overflow:hidden на
// внутреннем слое), тем же keyframe вращается шеврон — оба элемента слушают
// одну именованную анимацию, но реагируют на разные свойства кадра.
//
// Раскладка и container-запрос — как у обычных секций: заголовок и список
// считают свою ширину от контейнера блока, а не от окна.
const STYLES = `
:where([data-vibeui-block="faq-anim-001"]){
--vibeui-faq-anim-001-bg:transparent;
--vibeui-faq-anim-001-card:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-faq-anim-001-ink:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-faq-anim-001-muted:light-dark(oklch(0.5 0.014 265),oklch(0.72 0.012 265));
--vibeui-faq-anim-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-faq-anim-001-accent:light-dark(oklch(0.52 0.19 265),oklch(0.74 0.15 265));
--vibeui-faq-anim-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="faq-anim-001"]{color-scheme:dark}
[data-vibeui-block="faq-anim-001"]{
min-width:min(100%,18rem);
background:var(--vibeui-faq-anim-001-bg);color:var(--vibeui-faq-anim-001-ink);
font-family:var(--vibeui-faq-anim-001-sans);
}
[data-vibeui-block="faq-anim-001"] [data-part="frame"]{
max-width:76rem;margin:0 auto;
padding:clamp(3rem,10cqi,5rem) clamp(1.25rem,5cqi,3rem);
display:grid;gap:2rem;
}
[data-vibeui-block="faq-anim-001"] [data-part="intro"]{display:flex;flex-direction:column;gap:0.625rem}
[data-vibeui-block="faq-anim-001"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-faq-anim-001-accent);
}
[data-vibeui-block="faq-anim-001"] [data-part="title"]{
margin:0;max-width:18ch;
font-size:clamp(1.75rem,4.4cqi,2.75rem);line-height:1.1;letter-spacing:-0.02em;font-weight:670;
}
[data-vibeui-block="faq-anim-001"] [data-part="description"]{
margin:0;max-width:44ch;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-faq-anim-001-muted);
}
[data-vibeui-block="faq-anim-001"] [data-part="contact"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:0.375rem;
color:var(--vibeui-faq-anim-001-accent);text-decoration:none;font-size:0.9375rem;font-weight:560;
}
[data-vibeui-block="faq-anim-001"] [data-part="contact"]:hover{text-decoration:underline}
[data-vibeui-block="faq-anim-001"] [data-part="contact"]:focus-visible{outline:2px solid var(--vibeui-faq-anim-001-accent);outline-offset:3px}
[data-vibeui-block="faq-anim-001"] [data-part="list"]{display:flex;flex-direction:column;gap:0.625rem;margin:0;padding:0;list-style:none}
[data-vibeui-block="faq-anim-001"] [data-part="row"]{
border:1px solid var(--vibeui-faq-anim-001-border);border-radius:0.875rem;
background:var(--vibeui-faq-anim-001-card);
}
[data-vibeui-block="faq-anim-001"] [data-part="q"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;
padding:1rem 1.125rem;
font-size:1rem;font-weight:560;line-height:1.4;
}
[data-vibeui-block="faq-anim-001"] [data-part="chevron"]{
flex:none;margin-top:0.125rem;color:var(--vibeui-faq-anim-001-muted);
animation-duration:15s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;
}
[data-vibeui-block="faq-anim-001"] [data-part="chevron"] svg{display:block;width:1rem;height:1rem}
[data-vibeui-block="faq-anim-001"] [data-part="collapse"]{
display:grid;overflow:hidden;
grid-template-rows:0fr;
animation-duration:15s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;
}
[data-vibeui-block="faq-anim-001"] [data-part="inner"]{min-height:0;overflow:hidden}
[data-vibeui-block="faq-anim-001"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.125rem;
font-size:0.9375rem;line-height:1.65;color:var(--vibeui-faq-anim-001-muted);max-width:62ch;
}
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(1) [data-part="collapse"],
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(1) [data-part="chevron"]{animation-name:vibeui-faq-anim-001-slot-0}
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(2) [data-part="collapse"],
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(2) [data-part="chevron"]{animation-name:vibeui-faq-anim-001-slot-1}
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(3) [data-part="collapse"],
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(3) [data-part="chevron"]{animation-name:vibeui-faq-anim-001-slot-2}
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(4) [data-part="collapse"],
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(4) [data-part="chevron"]{animation-name:vibeui-faq-anim-001-slot-3}
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(5) [data-part="collapse"],
[data-vibeui-block="faq-anim-001"] [data-part="row"]:nth-child(5) [data-part="chevron"]{animation-name:vibeui-faq-anim-001-slot-4}
/* Каждый слот держит свою пятую долю цикла: закрыт, короткий разворот,
   пауза открытым, короткое закрытие, снова закрыт до конца круга. */
@keyframes vibeui-faq-anim-001-slot-0{
0%{grid-template-rows:0fr;transform:rotate(0deg)}
3%,17%{grid-template-rows:1fr;transform:rotate(180deg)}
20%,100%{grid-template-rows:0fr;transform:rotate(0deg)}
}
@keyframes vibeui-faq-anim-001-slot-1{
0%,20%{grid-template-rows:0fr;transform:rotate(0deg)}
23%,37%{grid-template-rows:1fr;transform:rotate(180deg)}
40%,100%{grid-template-rows:0fr;transform:rotate(0deg)}
}
@keyframes vibeui-faq-anim-001-slot-2{
0%,40%{grid-template-rows:0fr;transform:rotate(0deg)}
43%,57%{grid-template-rows:1fr;transform:rotate(180deg)}
60%,100%{grid-template-rows:0fr;transform:rotate(0deg)}
}
@keyframes vibeui-faq-anim-001-slot-3{
0%,60%{grid-template-rows:0fr;transform:rotate(0deg)}
63%,77%{grid-template-rows:1fr;transform:rotate(180deg)}
80%,100%{grid-template-rows:0fr;transform:rotate(0deg)}
}
@keyframes vibeui-faq-anim-001-slot-4{
0%,80%{grid-template-rows:0fr;transform:rotate(0deg)}
83%,97%{grid-template-rows:1fr;transform:rotate(180deg)}
100%{grid-template-rows:0fr;transform:rotate(0deg)}
}
[data-vibeui-block="faq-anim-001"][data-autoplay="false"] [data-part="collapse"],
[data-vibeui-block="faq-anim-001"][data-autoplay="false"] [data-part="chevron"]{animation:none}
[data-vibeui-block="faq-anim-001"][data-autoplay="false"] [data-part="row"]:first-child [data-part="collapse"]{grid-template-rows:1fr}
[data-vibeui-block="faq-anim-001"][data-autoplay="false"] [data-part="row"]:first-child [data-part="chevron"]{transform:rotate(180deg)}
/* От 56rem — вопросы справа, заголовок слева и остаётся на месте. */
@container (min-width: 56rem){
[data-vibeui-block="faq-anim-001"] [data-part="frame"]{
grid-template-columns:22rem 1fr;gap:3rem;
}
[data-vibeui-block="faq-anim-001"] [data-part="intro"]{position:sticky;top:2rem;align-self:start}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="faq-anim-001"] [data-part="collapse"],
[data-vibeui-block="faq-anim-001"] [data-part="chevron"]{animation:none}
[data-vibeui-block="faq-anim-001"] [data-part="row"]:first-child [data-part="collapse"]{grid-template-rows:1fr}
[data-vibeui-block="faq-anim-001"] [data-part="row"]:first-child [data-part="chevron"]{transform:rotate(180deg)}
}
`

const CHEVRON = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const DEFAULT_ITEMS: FaqAnim001Item[] = [
  {
    question: "Что я получаю после установки блока?",
    answer:
      "Один файл в вашем проекте — тот же самый, который вы видели в превью. Ни сборки, ни обёрток, ни привязки к нашей теме: блок несёт собственную палитру и работает в любом React-проекте.",
  },
  {
    question: "Агент действительно ставит именно этот компонент?",
    answer:
      "Да. Copy for AI даёт ссылку с инструкцией: идентификатор компонента, команда установки и список того, что нельзя менять. Агент скачивает файл из реестра, а не пересоздаёт похожий по описанию.",
  },
  {
    question: "А если у меня своя дизайн-система?",
    answer:
      "Переопределите локальные переменные блока — он встанет в вашу тему, не трогая остальной проект. Менять сам файл не нужно: цвета, радиусы и акценты вынесены в переменные.",
  },
  {
    question: "Нужны ли дополнительные библиотеки?",
    answer:
      "Зависимости объявлены в метаданных каждого блока, и у большинства их ноль: только React. Иконочные библиотеки не требуются — значки нарисованы на CSS.",
  },
  {
    question: "Можно ли использовать блоки в коммерческих проектах?",
    answer:
      "Да. После установки файл принадлежит вашему проекту: правьте, переименовывайте и публикуйте вместе с сайтом.",
  },
]

/**
 * Секция вопросов и ответов с зацикленной демонстрацией раскрытия: пункты
 * открываются по одному и закрываются перед следующим на чистом CSS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function FaqAnim001({
  eyebrow = "Вопросы",
  title = "Коротко о том, как это работает",
  description = "Если ответа здесь нет — напишите, мы отвечаем в течение рабочего дня.",
  items = DEFAULT_ITEMS,
  contactLabel = "Задать свой вопрос",
  contactHref = "#contact",
  accent,
  autoplay = true,
  className,
  style,
}: FaqAnim001Props) {
  const palette = {
    ...(accent ? { "--vibeui-faq-anim-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-faq-anim-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="faq-anim-001"
        data-autoplay={autoplay ? undefined : "false"}
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="intro">
            {eyebrow ? <span data-part="eyebrow">{eyebrow}</span> : null}
            <h2 data-part="title">{title}</h2>
            {description ? <p data-part="description">{description}</p> : null}
            {contactLabel ? (
              <a data-part="contact" href={contactHref}>
                {contactLabel}
              </a>
            ) : null}
          </div>
          <ul data-part="list">
            {items.map((item) => (
              <li data-part="row" key={item.question}>
                <div data-part="q">
                  <span>{item.question}</span>
                  <span data-part="chevron">{CHEVRON}</span>
                </div>
                <div data-part="collapse">
                  <div data-part="inner">
                    <p data-part="answer">{item.answer}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
