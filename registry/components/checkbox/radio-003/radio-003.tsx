import type { ComponentProps, CSSProperties } from "react"

export type Radio003Plan = {
  value: string
  name: string
  price: string
  period: string
  features: string[]
  badge?: string
}

export type Radio003Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  plans?: Radio003Plan[]
  name?: string
  defaultValue?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: выбор тарифа плитками, где решение принимают по цене и
// списку возможностей, а не по подписи в строке. Кружок радио убран совсем:
// его роль играет галочка в углу выбранной карточки, а сам input остаётся
// в разметке — он держит клавиатуру, группировку и отправку формы.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="radio-003"]){
--vibeui-radio-003-bg:transparent;
--vibeui-radio-003-card:light-dark(oklch(0.99 0 265),oklch(0.27 0 265));
--vibeui-radio-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-003-muted:color-mix(in oklab,var(--vibeui-radio-003-fg) 68%,transparent);
--vibeui-radio-003-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-radio-003-accent:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
--vibeui-radio-003-tint:light-dark(oklch(0.24 0.015 265 / 6%),oklch(0.93 0.006 265 / 12%));
--vibeui-radio-003-on-accent:light-dark(oklch(0.99 0 265),oklch(0.17 0.01 265));
--vibeui-radio-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-003"]{color-scheme:dark}
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
position:relative;display:flex;flex-direction:column;gap:0.375rem;min-width:0;
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
border-color:var(--vibeui-radio-003-accent);background:var(--vibeui-radio-003-accent);color:oklch(from var(--vibeui-radio-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
[data-vibeui-block="radio-003"] [data-part="plan"]:has(input:checked) [data-part="tick"]::after{
content:"";position:absolute;left:0.3125rem;top:0.125rem;
width:0.25rem;height:0.5rem;
border-right:2px solid var(--vibeui-radio-003-on-accent);
border-bottom:2px solid var(--vibeui-radio-003-on-accent);
transform:rotate(45deg);
}
/* Плашка не шире плитки и не лезет под галочку: длинная подпись раньше
   растягивала колонку и уезжала за край карточки. */
[data-vibeui-block="radio-003"] [data-part="badge"]{
align-self:flex-start;box-sizing:border-box;max-width:calc(100% - 1.5rem);
padding:0.125rem 0.4375rem;border-radius:9999px;
background:var(--vibeui-radio-003-accent);color:oklch(from var(--vibeui-radio-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.625rem;font-weight:700;letter-spacing:0.03em;line-height:1.3;
text-transform:uppercase;
}
[data-vibeui-block="radio-003"] [data-part="name"]{font-size:0.8125rem;font-weight:650;padding-right:1.25rem}
[data-vibeui-block="radio-003"] [data-part="price"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem;
font-size:1.125rem;font-weight:750;line-height:1.15;font-variant-numeric:tabular-nums;
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
width:0.25rem;height:0.25rem;border-radius:9999px;background:var(--vibeui-radio-003-accent);color:oklch(from var(--vibeui-radio-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
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
 * Выбор тарифа плитками: цена, список возможностей и галочка вместо кружка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Radio003({
  legend = "Тарифный план",
  plans = DEFAULT_PLANS,
  name = "vibeui-radio-003",
  defaultValue = "pro",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio003Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-003" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-slot="radio-group"
        data-vibeui-block="radio-003"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <form data-part="grid">
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
        </form>
      </fieldset>
    </>
  )
}
