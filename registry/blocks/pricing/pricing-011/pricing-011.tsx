import type { CSSProperties } from "react"
import { Heading001 } from "@/registry/components/typography/heading-001/heading-001"

import { Button016 } from "@/registry/components/button/button-016/button-016"

export type Pricing011Props = {
  eyebrow?: string
  title?: string
  lede?: string
  questions?: { question: string; answer: string; open?: boolean }[]
  contact?: { text: string; label: string; href: string }
  accent?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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

// Идея блока: вопросы именно о деньгах, а не общий FAQ. Раскрытие построено
// на <details>/<summary> — работает без JavaScript, ищется браузерным поиском
// по странице и печатается развёрнутым. Маркер по умолчанию убран и заменён
// плюсом, который поворачивается в минус через [open]: своя иконка нужна,
// потому что нативный треугольник в разных браузерах выглядит по-разному.
// Первый вопрос открыт: пустая гармошка выглядит как список ссылок.
const STYLES = `
:where([data-vibeui-block="pricing-011"]){
--vibeui-pricing-011-bg:transparent;
--vibeui-pricing-011-fg:light-dark(oklch(0.2 0 265),oklch(0.95 0 265));
--vibeui-pricing-011-muted:light-dark(oklch(0.51 0 265),oklch(0.72 0 265));
--vibeui-pricing-011-card:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-pricing-011-line:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-pricing-011-accent:light-dark(oklch(0.287 0 0),oklch(0.906 0 0));
--vibeui-pricing-011-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-pricing-011-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pricing-011"]{color-scheme:dark}
[data-vibeui-block="pricing-011"] [data-part="cta-button"]{margin-top:0.5rem;}
[data-vibeui-block="pricing-011"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-pricing-011-bg);color:var(--vibeui-pricing-011-fg);
font-family:var(--vibeui-pricing-011-sans);
}
[data-vibeui-block="pricing-011"] *{box-sizing:border-box}
[data-vibeui-block="pricing-011"] [data-part="shell"]{
max-width:60rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:1fr;gap:2rem;align-items:start;
}
[data-vibeui-block="pricing-011"] [data-part="contact"]{
margin:1.5rem 0 0;padding:1rem;border-radius:0.875rem;border:1px solid var(--vibeui-pricing-011-line);
background:var(--vibeui-pricing-011-card);font-size:0.8125rem;line-height:1.55;color:var(--vibeui-pricing-011-muted);
}
[data-vibeui-block="pricing-011"] [data-part="list"]{
border:1px solid var(--vibeui-pricing-011-line);border-radius:1rem;background:var(--vibeui-pricing-011-card);overflow:hidden;
}
[data-vibeui-block="pricing-011"] details + details{border-top:1px solid var(--vibeui-pricing-011-line)}
[data-vibeui-block="pricing-011"] summary{
display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;cursor:pointer;list-style:none;
padding:1rem 1.125rem;font-size:0.9375rem;font-weight:650;line-height:1.45;
}
[data-vibeui-block="pricing-011"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="pricing-011"] summary:hover{color:var(--vibeui-pricing-011-accent)}
[data-vibeui-block="pricing-011"] summary:focus-visible{outline:2px solid var(--vibeui-pricing-011-accent);outline-offset:-2px}
[data-vibeui-block="pricing-011"] [data-part="sign"]{
position:relative;flex:0 0 auto;margin-top:0.1875rem;width:1.125rem;height:1.125rem;
color:var(--vibeui-pricing-011-accent);
}
[data-vibeui-block="pricing-011"] [data-part="sign"]::before,
[data-vibeui-block="pricing-011"] [data-part="sign"]::after{
content:"";position:absolute;left:50%;top:50%;background:currentColor;border-radius:1px;
transform:translate(-50%,-50%);transition:opacity var(--vibeui-pricing-011-dur-2) ease,transform var(--vibeui-pricing-011-dur-2) ease;
}
[data-vibeui-block="pricing-011"] [data-part="sign"]::before{width:0.875rem;height:2px}
[data-vibeui-block="pricing-011"] [data-part="sign"]::after{width:2px;height:0.875rem}
[data-vibeui-block="pricing-011"] details[open] [data-part="sign"]::after{opacity:0;transform:translate(-50%,-50%) rotate(90deg)}
[data-vibeui-block="pricing-011"] [data-part="answer"]{
margin:0;padding:0 1.125rem 1.125rem;max-width:52ch;
font-size:0.875rem;line-height:1.6;color:var(--vibeui-pricing-011-muted);text-wrap:pretty;
}
@container (min-width: 34rem){
[data-vibeui-block="pricing-011"] [data-part="shell"]{padding:5rem 2rem}
}
@container (min-width: 54rem){
[data-vibeui-block="pricing-011"] [data-part="shell"]{grid-template-columns:minmax(0,22rem) minmax(0,1fr);gap:3rem;padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_QUESTIONS = [
  {
    question: "Что будет с секциями, если я отменю подписку?",
    answer:
      "Всё, что уже установлено в проект, остаётся у вас: это обычные файлы в вашем репозитории. Закрывается только доступ к каталогу и к новым секциям.",
    open: true,
  },
  {
    question: "Есть ли скидка при годовой оплате?",
    answer:
      "Да, годовая оплата стоит как десять месяцев. Разницу возвращаем при отмене пропорционально неиспользованным месяцам.",
  },
  {
    question: "Считается ли доработанная секция отдельной покупкой?",
    answer:
      "Нет. Вы можете менять тексты, цвета и раскладку сколько угодно — это ваш файл. Отдельно оплачивается только доступ к каталогу.",
  },
  {
    question: "Можно ли использовать секции в клиентских проектах?",
    answer:
      "На тарифах «Команда» и «Агентство» — да, включая передачу исходников клиенту. На личном тарифе секции можно использовать только в своих проектах.",
  },
  {
    question: "Как оплатить с юридического лица?",
    answer:
      "Выставляем счёт и присылаем закрывающие документы. Оплата по счёту доступна на тарифах «Команда» и выше.",
  },
]

/** Блок частых вопросов о цене: гармошка на <details>, работает без JavaScript. */
export function Pricing011({
  eyebrow = "Вопросы о деньгах",
  title = "Что обычно спрашивают перед оплатой",
  lede = "Только вопросы про цену, возврат и документы. Общий FAQ по продукту лежит отдельно.",
  questions = DEFAULT_QUESTIONS,
  contact = {
    text: "Не нашли свой вопрос? Ответим письмом за один рабочий день.",
    label: "billing@vibeui.dev",
    href: "mailto:billing@vibeui.dev",
  },
  accent,
  background = "",
  className,
  style,
}: Pricing011Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pricing-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            <Heading001
              data-part="heading"
              eyebrow={eyebrow}
              title={title}
              lede={lede}
              accent={accent}
            />
            {contact ? (
              <div data-part="contact">
                {contact.text}
                <br />
                <Button016 data-part="cta-button" label={contact.label} href={contact.href} external={false} size="lg" tone="accent" accent={accent} />
              </div>
            ) : null}
          </div>

          <div data-part="list">
            {questions.slice(0, 8).map((item) => (
              <details key={item.question} open={item.open}>
                <summary>
                  {item.question}
                  <span data-part="sign" aria-hidden="true" />
                </summary>
                <p data-part="answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
