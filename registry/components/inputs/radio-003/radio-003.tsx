import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Radio003Plan = {
  value: string
  name: string
  price: string
  period: string
  features: string[]
  badge?: string
}

export type Radio003Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  plans?: Radio003Plan[]
  name?: string
  defaultValue?: string
  accent?: string
}

// Идея компонента: выбор тарифа плитками, где решение принимают по цене и
// списку возможностей, а не по подписи в строке. Кружок радио убран совсем:
// его роль играет галочка в углу выбранной карточки, а сам input остаётся
// в разметке — он держит клавиатуру, группировку и отправку формы.
const STYLES = `
:where([data-vibeui-block="radio-003"]){
--vibeui-radio-003-bg:oklch(1 0 0);
--vibeui-radio-003-card:oklch(0.99 0.002 265);
--vibeui-radio-003-fg:oklch(0.22 0.014 265);
--vibeui-radio-003-muted:oklch(0.55 0.014 265);
--vibeui-radio-003-border:oklch(0.9 0.006 265);
--vibeui-radio-003-accent:oklch(0.5 0.19 285);
--vibeui-radio-003-tint:oklch(0.5 0.19 285 / 7%);
--vibeui-radio-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="radio-003"]{
display:flex;flex-direction:column;
width:100%;max-width:26rem;box-sizing:border-box;
margin:0;padding:0.5rem 0.875rem 0.875rem;
background:var(--vibeui-radio-003-bg);
border:1px solid var(--vibeui-radio-003-border);border-radius:1rem;
font-family:var(--vibeui-radio-003-font);color:var(--vibeui-radio-003-fg);
}
[data-vibeui-block="radio-003"] legend{
float:left;width:100%;padding:0;margin:0.375rem 0 0.625rem;
font-size:0.8125rem;font-weight:650;
}
/* Плитки в auto-fit: на узкой карточке каталога они встают колонкой,
   на широкой странице — в ряд, и обе раскладки считаются от своей ширины. */
[data-vibeui-block="radio-003"] [data-part="grid"]{
clear:both;display:grid;gap:0.625rem;
grid-template-columns:repeat(auto-fit,minmax(7.5rem,1fr));
}
[data-vibeui-block="radio-003"] [data-part="plan"]{
position:relative;display:flex;flex-direction:column;gap:0.375rem;
padding:0.75rem;border-radius:0.75rem;cursor:pointer;
border:1.5px solid var(--vibeui-radio-003-border);
background:var(--vibeui-radio-003-card);
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="radio-003"] [data-part="plan"]:has(input:checked){
border-color:var(--vibeui-radio-003-accent);background:var(--vibeui-radio-003-tint);
}
[data-vibeui-block="radio-003"] [data-part="plan"]:has(input:focus-visible){
outline:2px solid var(--vibeui-radio-003-accent);outline-offset:2px;
}
/* Радио спрятано визуально, но остаётся в потоке фокуса: роль отметки
   играет галочка в углу. */
[data-vibeui-block="radio-003"] input{
position:absolute;width:1px;height:1px;margin:0;padding:0;
clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="radio-003"] [data-part="tick"]{
position:absolute;right:0.625rem;top:0.625rem;
width:1rem;height:1rem;border-radius:9999px;
border:1.5px solid var(--vibeui-radio-003-border);
background:var(--vibeui-radio-003-bg);
}
[data-vibeui-block="radio-003"] [data-part="plan"]:has(input:checked) [data-part="tick"]{
border-color:var(--vibeui-radio-003-accent);background:var(--vibeui-radio-003-accent);
}
[data-vibeui-block="radio-003"] [data-part="plan"]:has(input:checked) [data-part="tick"]::after{
content:"";position:absolute;left:0.3125rem;top:0.125rem;
width:0.25rem;height:0.5rem;
border-right:2px solid var(--vibeui-radio-003-bg);
border-bottom:2px solid var(--vibeui-radio-003-bg);
transform:rotate(45deg);
}
[data-vibeui-block="radio-003"] [data-part="badge"]{
align-self:flex-start;padding:0.0625rem 0.375rem;border-radius:9999px;
background:var(--vibeui-radio-003-accent);color:oklch(1 0 0);
font-size:0.625rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
}
[data-vibeui-block="radio-003"] [data-part="name"]{font-size:0.8125rem;font-weight:650;padding-right:1.25rem}
[data-vibeui-block="radio-003"] [data-part="price"]{
font-size:1.125rem;font-weight:750;line-height:1.1;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="radio-003"] [data-part="period"]{font-size:0.6875rem;font-weight:500;color:var(--vibeui-radio-003-muted)}
/* Список внутри label — не ul, а span'ы: содержимое label ограничено
   фразовым контентом, и ul туда по спецификации не помещается. */
[data-vibeui-block="radio-003"] [data-part="features"]{
display:flex;flex-direction:column;gap:0.1875rem;margin-top:0.125rem;
font-size:0.6875rem;line-height:1.35;color:var(--vibeui-radio-003-muted);
}
[data-vibeui-block="radio-003"] [data-part="feature"]{padding-left:0.75rem;position:relative}
[data-vibeui-block="radio-003"] [data-part="feature"]::before{
content:"";position:absolute;left:0;top:0.4375rem;
width:0.25rem;height:0.25rem;border-radius:9999px;background:var(--vibeui-radio-003-accent);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Radio003Plan[] = [
  {
    value: "solo",
    name: "Соло",
    price: "0 ₽",
    period: "навсегда",
    features: ["3 проекта", "История 7 дней"],
  },
  {
    value: "pro",
    name: "Про",
    price: "890 ₽",
    period: "в месяц",
    features: ["Проекты без лимита", "Экспорт в Figma", "Приоритет в очереди"],
    badge: "Выбор команд",
  },
  {
    value: "studio",
    name: "Студия",
    price: "3 400 ₽",
    period: "в месяц",
    features: ["До 20 участников", "Общий биллинг"],
  },
]

/**
 * Выбор тарифа плитками: цена, список возможностей и галочка вместо кружка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio003({
  legend = "Тарифный план",
  plans = DEFAULT_PLANS,
  name = "vibeui-radio-003",
  defaultValue = "pro",
  accent,
  className,
  style,
  ...props
}: Radio003Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-003" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="radio-003"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="grid">
          {plans.map((plan) => (
            <label key={plan.value} data-part="plan">
              <input
                type="radio"
                name={name}
                value={plan.value}
                defaultChecked={plan.value === defaultValue}
              />
              <span data-part="tick" aria-hidden="true" />
              {plan.badge ? <span data-part="badge">{plan.badge}</span> : null}
              <span data-part="name">{plan.name}</span>
              <span data-part="price">
                {plan.price} <span data-part="period">{plan.period}</span>
              </span>
              <span data-part="features">
                {plan.features.map((feature) => (
                  <span key={feature} data-part="feature">
                    {feature}
                  </span>
                ))}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  )
}
