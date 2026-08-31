import type { CSSProperties } from "react"

export type Pricing007Props = {
  eyebrow?: string
  title?: string
  lede?: string
  points?: { title: string; description: string }[]
  formTitle?: string
  submitLabel?: string
  sizes?: string[]
  privacy?: string
  contact?: { label: string; value: string; href: string }
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея блока: корпоративный тариф без цены, зато с формой. Слева — что
// именно даёт договор, справа — короткая форма: имя, рабочая почта, размер
// компании и задача. Полей ровно столько, сколько нужно менеджеру для
// первого ответа; каждое лишнее поле стоит процентов конверсии. Размер
// компании — <select>, а не свободный текст: это единственное поле, по
// которому заявку сортируют. Все поля с <label>, форма серверная.
const STYLES = `
:where([data-vibeui-block="pricing-007"]){
--vibeui-pricing-007-bg:oklch(0.97 0.004 240);
--vibeui-pricing-007-fg:oklch(0.2 0.012 240);
--vibeui-pricing-007-muted:oklch(0.51 0.012 240);
--vibeui-pricing-007-card:oklch(1 0 0);
--vibeui-pricing-007-line:oklch(0.89 0.006 240);
--vibeui-pricing-007-accent:oklch(0.42 0.13 245);
--vibeui-pricing-007-accent-fg:oklch(0.99 0 0);
--vibeui-pricing-007-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="pricing-007"]{
box-sizing:border-box;background:var(--vibeui-pricing-007-bg);color:var(--vibeui-pricing-007-fg);
font-family:var(--vibeui-pricing-007-sans);
}
[data-vibeui-block="pricing-007"] *{box-sizing:border-box}
[data-vibeui-block="pricing-007"] [data-part="shell"]{
max-width:66rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;
display:grid;grid-template-columns:1fr;gap:2rem;align-items:start;
}
[data-vibeui-block="pricing-007"] [data-part="eyebrow"]{
margin:0 0 0.75rem;font-size:0.75rem;font-weight:650;letter-spacing:0.14em;text-transform:uppercase;
color:var(--vibeui-pricing-007-accent);
}
[data-vibeui-block="pricing-007"] h2{
margin:0;max-width:20ch;font-size:clamp(1.5rem,4.2cqi,2.25rem);line-height:1.14;letter-spacing:-0.025em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="pricing-007"] [data-part="lede"]{
margin:0.875rem 0 0;max-width:32rem;font-size:0.9375rem;line-height:1.6;color:var(--vibeui-pricing-007-muted);text-wrap:pretty;
}
[data-vibeui-block="pricing-007"] [data-part="points"]{list-style:none;margin:1.75rem 0 0;padding:0;display:grid;gap:1.125rem}
[data-vibeui-block="pricing-007"] h3{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="pricing-007"] [data-part="points"] p{margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-pricing-007-muted)}
[data-vibeui-block="pricing-007"] [data-part="points"] li{display:flex;gap:0.75rem}
[data-vibeui-block="pricing-007"] [data-part="bullet"]{
flex:0 0 auto;margin-top:0.375rem;width:0.5rem;height:0.5rem;border-radius:0.1875rem;
background:var(--vibeui-pricing-007-accent);
}
[data-vibeui-block="pricing-007"] [data-part="contact"]{
margin:1.75rem 0 0;padding-top:1.25rem;border-top:1px solid var(--vibeui-pricing-007-line);font-size:0.8125rem;color:var(--vibeui-pricing-007-muted);
}
[data-vibeui-block="pricing-007"] [data-part="contact"] a{color:var(--vibeui-pricing-007-accent);font-weight:650;text-decoration:none}
[data-vibeui-block="pricing-007"] [data-part="contact"] a:hover{text-decoration:underline}
[data-vibeui-block="pricing-007"] form{
padding:1.5rem;border-radius:1.125rem;border:1px solid var(--vibeui-pricing-007-line);background:var(--vibeui-pricing-007-card);
}
[data-vibeui-block="pricing-007"] [data-part="formtitle"]{margin:0 0 1.25rem;font-size:1rem;font-weight:700}
[data-vibeui-block="pricing-007"] [data-part="field"]{display:grid;gap:0.375rem;margin-bottom:0.875rem}
[data-vibeui-block="pricing-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="pricing-007"] input,
[data-vibeui-block="pricing-007"] select,
[data-vibeui-block="pricing-007"] textarea{
width:100%;padding:0.625rem 0.75rem;border-radius:0.625rem;
border:1px solid var(--vibeui-pricing-007-line);background:var(--vibeui-pricing-007-card);
font:inherit;font-size:0.875rem;color:inherit;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="pricing-007"] textarea{min-height:5.5rem;resize:vertical}
[data-vibeui-block="pricing-007"] input:focus-visible,
[data-vibeui-block="pricing-007"] select:focus-visible,
[data-vibeui-block="pricing-007"] textarea:focus-visible{
outline:none;border-color:var(--vibeui-pricing-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-pricing-007-accent) 20%,transparent);
}
[data-vibeui-block="pricing-007"] button{
appearance:none;cursor:pointer;width:100%;height:2.75rem;border:0;border-radius:0.625rem;margin-top:0.375rem;
background:var(--vibeui-pricing-007-accent);color:var(--vibeui-pricing-007-accent-fg);
font:inherit;font-size:0.9375rem;font-weight:650;transition:background-color .16s ease;
}
[data-vibeui-block="pricing-007"] button:hover{background:color-mix(in oklab,var(--vibeui-pricing-007-accent) 86%,black)}
[data-vibeui-block="pricing-007"] button:focus-visible{outline:2px solid var(--vibeui-pricing-007-accent);outline-offset:3px}
[data-vibeui-block="pricing-007"] [data-part="privacy"]{margin:0.875rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-pricing-007-muted)}
@container (min-width: 34rem){
[data-vibeui-block="pricing-007"] [data-part="shell"]{padding:5rem 2rem}
[data-vibeui-block="pricing-007"] form{padding:1.875rem}
[data-vibeui-block="pricing-007"] [data-part="pair"]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.875rem}
}
@container (min-width: 56rem){
[data-vibeui-block="pricing-007"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,26rem);gap:3.5rem;padding:6rem 2.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pricing-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_POINTS = [
  {
    title: "Договор и закрывающие документы",
    description:
      "Работаем по договору с актами и счетами, включая закупочные процедуры.",
  },
  {
    title: "Развёртывание в вашем контуре",
    description:
      "Реестр можно поднять на своих серверах: секции ставятся без выхода наружу.",
  },
  {
    title: "Секции под ваш дизайн-код",
    description:
      "Собираем варианты под гайдлайн бренда и передаём их вместе с исходниками.",
  },
  {
    title: "Обучение команды",
    description:
      "Два воркшопа: для разработчиков и для маркетинга, с записью и материалами.",
  },
]

const DEFAULT_SIZES = [
  "до 10 человек",
  "10–50 человек",
  "50–200 человек",
  "больше 200 человек",
]

/** Корпоративный блок «свяжитесь с нами»: аргументы слева, короткая форма справа. */
export function Pricing007({
  eyebrow = "Корпоративный тариф",
  title = "Цену считаем под задачу, а не по прайсу",
  lede = "Для команд, которым нужен договор, свой контур и секции под собственный дизайн-код. Ответим в течение рабочего дня.",
  points = DEFAULT_POINTS,
  formTitle = "Оставьте заявку",
  submitLabel = "Отправить заявку",
  sizes = DEFAULT_SIZES,
  privacy = "Отправляя форму, вы соглашаетесь на обработку персональных данных. Письма — только по вашей заявке.",
  contact = {
    label: "Или напишите напрямую",
    value: "sales@vibeui.dev",
    href: "mailto:sales@vibeui.dev",
  },
  accent,
  className,
  style,
}: Pricing007Props) {
  const palette = {
    ...(accent ? { "--vibeui-pricing-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-pricing-007" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="pricing-007"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div>
            {eyebrow ? <p data-part="eyebrow">{eyebrow}</p> : null}
            <h2>{title}</h2>
            {lede ? <p data-part="lede">{lede}</p> : null}

            <ul data-part="points">
              {points.slice(0, 4).map((point) => (
                <li key={point.title}>
                  <span data-part="bullet" aria-hidden="true" />
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {contact ? (
              <p data-part="contact">
                {contact.label}: <a href={contact.href}>{contact.value}</a>
              </p>
            ) : null}
          </div>

          <form aria-label={formTitle}>
            <p data-part="formtitle">{formTitle}</p>

            <div data-part="pair">
              <div data-part="field">
                <label htmlFor="vibeui-pricing-007-name">Имя</label>
                <input
                  id="vibeui-pricing-007-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                />
              </div>
              <div data-part="field">
                <label htmlFor="vibeui-pricing-007-email">Рабочая почта</label>
                <input
                  id="vibeui-pricing-007-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div data-part="field">
              <label htmlFor="vibeui-pricing-007-size">Размер команды</label>
              <select id="vibeui-pricing-007-size" name="size" defaultValue="">
                <option value="" disabled>
                  Выберите вариант
                </option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div data-part="field">
              <label htmlFor="vibeui-pricing-007-task">Задача</label>
              <textarea
                id="vibeui-pricing-007-task"
                name="task"
                placeholder="Что нужно собрать и к какому сроку"
              />
            </div>

            <button type="submit">{submitLabel}</button>
            {privacy ? <p data-part="privacy">{privacy}</p> : null}
          </form>
        </div>
      </section>
    </>
  )
}
