"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Auth025Plan = {
  name: string
  price: number
  note: string
  perks: string[]
  best?: boolean
}

export type Auth025Props = {
  title?: string
  plans?: Auth025Plan[]
  submit?: string
  yearlyOff?: number
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: тариф выбирается прямо в регистрации, а не после неё. Такой
// экран честен только при двух условиях, и оба здесь выполнены: бесплатный
// вариант стоит первым и выбран по умолчанию, а цена пересчитывается на
// глазах при переключении периода — «−20% при годовой оплате» мелким шрифтом
// внизу читают единицы, а изменившееся число видят все.
// Тарифы — radiogroup: стрелки клавиатуры переключают карточки без JS,
// подсветка выбранной держится на :has(). Под кнопкой написано, что карта
// не нужна на бесплатном тарифе: это снимает главный страх этого шага.
//
// Демонстрация интерфейса: оплата и подписка — за вызывающим кодом.
const STYLES = `
:where([data-vibeui-block="auth-025"]){
--vibeui-auth-025-bg:oklch(0.96 0.008 95);
--vibeui-auth-025-card:oklch(1 0 0);
--vibeui-auth-025-fg:oklch(0.23 0.016 90);
--vibeui-auth-025-muted:oklch(0.53 0.014 90);
--vibeui-auth-025-border:oklch(0.89 0.01 90);
--vibeui-auth-025-accent:oklch(0.52 0.14 130);
--vibeui-auth-025-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="auth-025"]{
box-sizing:border-box;padding:1.75rem 1rem;
background:var(--vibeui-auth-025-bg);color:var(--vibeui-auth-025-fg);
font-family:var(--vibeui-auth-025-sans);
}
[data-vibeui-block="auth-025"] *{box-sizing:border-box}
[data-vibeui-block="auth-025"] [data-part="shell"]{width:100%;max-width:24rem;margin:0 auto}
[data-vibeui-block="auth-025"] [data-part="plans"]{display:grid;grid-template-columns:1fr;gap:0.625rem;margin:0 0 1.25rem;padding:0;list-style:none}
@container (min-width: 48rem){
[data-vibeui-block="auth-025"] [data-part="shell"]{max-width:46rem}
[data-vibeui-block="auth-025"] [data-part="plans"]{grid-template-columns:repeat(3,1fr)}
[data-vibeui-block="auth-025"] [data-part="plan"]{flex-direction:column}
[data-vibeui-block="auth-025"] [data-part="form"]{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;align-items:end}
[data-vibeui-block="auth-025"] [data-part="submit"]{grid-column:1 / -1}
}
[data-vibeui-block="auth-025"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.75rem;margin-bottom:1.125rem}
[data-vibeui-block="auth-025"] h2{margin:0;font-size:1.375rem;font-weight:700;line-height:1.2;letter-spacing:-0.02em}
[data-vibeui-block="auth-025"] [data-part="period"]{
display:flex;gap:0.125rem;margin-left:auto;padding:0.1875rem;
border-radius:9999px;background:oklch(0.55 0.02 90 / 10%);
}
[data-vibeui-block="auth-025"] [data-part="tab"]{
appearance:none;border:0;cursor:pointer;
padding:0.375rem 0.75rem;border-radius:9999px;
background:none;color:var(--vibeui-auth-025-muted);
font:inherit;font-size:0.75rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="auth-025"] [data-part="tab"][aria-pressed="true"]{background:var(--vibeui-auth-025-card);color:var(--vibeui-auth-025-fg)}
[data-vibeui-block="auth-025"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-auth-025-accent);outline-offset:2px}
[data-vibeui-block="auth-025"] [data-part="plan"]{
position:relative;display:flex;gap:0.75rem;height:100%;padding:0.875rem;cursor:pointer;
background:var(--vibeui-auth-025-card);
border:1px solid var(--vibeui-auth-025-border);border-radius:0.875rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="auth-025"] [data-part="plan"]:hover{border-color:var(--vibeui-auth-025-accent)}
[data-vibeui-block="auth-025"] [data-part="plan"]:has(input:checked){
border-color:var(--vibeui-auth-025-accent);box-shadow:inset 0 0 0 1px var(--vibeui-auth-025-accent);
}
[data-vibeui-block="auth-025"] [data-part="plan"]:has(input:focus-visible){outline:2px solid var(--vibeui-auth-025-accent);outline-offset:2px}
[data-vibeui-block="auth-025"] [data-part="plan"] input{flex:none;width:1.0625rem;height:1.0625rem;margin-top:0.125rem;accent-color:var(--vibeui-auth-025-accent)}
[data-vibeui-block="auth-025"] [data-part="pname"]{display:flex;align-items:center;gap:0.375rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="auth-025"] [data-part="best"]{
padding:0.0625rem 0.375rem;border-radius:9999px;
background:oklch(0.52 0.14 130 / 14%);color:var(--vibeui-auth-025-accent);
font-size:0.625rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;
}
[data-vibeui-block="auth-025"] [data-part="price"]{display:block;margin:0.25rem 0;font-size:1.25rem;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="auth-025"] [data-part="per"]{font-size:0.75rem;font-weight:500;color:var(--vibeui-auth-025-muted)}
[data-vibeui-block="auth-025"] [data-part="note"]{display:block;font-size:0.75rem;line-height:1.4;color:var(--vibeui-auth-025-muted)}
[data-vibeui-block="auth-025"] [data-part="perks"]{list-style:none;margin:0.5rem 0 0;padding:0;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="auth-025"] [data-part="perk"]{display:flex;gap:0.375rem;font-size:0.75rem;line-height:1.4}
[data-vibeui-block="auth-025"] [data-part="check"]{flex:none;color:var(--vibeui-auth-025-accent);font-weight:700}
[data-vibeui-block="auth-025"] [data-part="form"]{
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-auth-025-card);border:1px solid var(--vibeui-auth-025-border);
}
[data-vibeui-block="auth-025"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.75rem}
[data-vibeui-block="auth-025"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="auth-025"] input[type="email"],
[data-vibeui-block="auth-025"] input[type="password"]{
width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-auth-025-border);border-radius:0.625rem;
background:var(--vibeui-auth-025-card);color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="auth-025"] input:focus-visible{outline:2px solid var(--vibeui-auth-025-accent);outline-offset:1px;border-color:var(--vibeui-auth-025-accent)}
[data-vibeui-block="auth-025"] [data-part="submit"]{
width:100%;appearance:none;cursor:pointer;height:2.75rem;
border:0;border-radius:0.75rem;
background:var(--vibeui-auth-025-accent);color:oklch(1 0 0);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="auth-025"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-auth-025-accent);outline-offset:2px}
[data-vibeui-block="auth-025"] [data-part="foot"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-auth-025-muted);text-align:center}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="auth-025"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PLANS: Auth025Plan[] = [
  {
    name: "Свободный",
    price: 0,
    note: "Навсегда бесплатно, карта не нужна.",
    perks: ["Весь каталог блоков", "Copy for AI", "Один проект"],
  },
  {
    name: "Команда",
    price: 990,
    note: "Для студий до десяти человек.",
    perks: ["Общая история установок", "Комментарии", "Пять проектов"],
    best: true,
  },
  {
    name: "Бизнес",
    price: 2900,
    note: "Свой реестр и вход через SSO.",
    perks: ["Приватные блоки", "SSO и журнал доступа", "Проектов без счёта"],
  },
]

/**
 * Выбор тарифа прямо в регистрации: цена пересчитывается при смене
 * периода, бесплатный выбран по умолчанию. Один файл, ноль зависимостей.
 */
export function Auth025({
  title = "Выберите тариф",
  plans = DEFAULT_PLANS,
  submit = "Создать аккаунт",
  yearlyOff = 20,
  accent,
  className,
  style,
}: Auth025Props) {
  const [yearly, setYearly] = useState(false)
  const [chosen, setChosen] = useState(plans[0]?.name ?? "")

  const palette = {
    ...(accent ? { "--vibeui-auth-025-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-auth-025" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="auth-025"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="top">
            <h2>{title}</h2>
            <div data-part="period" role="group" aria-label="Период оплаты">
              <button
                type="button"
                data-part="tab"
                aria-pressed={!yearly}
                onClick={() => setYearly(false)}
              >
                Помесячно
              </button>
              <button
                type="button"
                data-part="tab"
                aria-pressed={yearly}
                onClick={() => setYearly(true)}
              >
                За год — дешевле на {yearlyOff}%
              </button>
            </div>
          </div>

          <ul data-part="plans">
            {plans.map((plan) => {
              const price = yearly
                ? Math.round((plan.price * (100 - yearlyOff)) / 100)
                : plan.price

              return (
                <li key={plan.name}>
                  <label data-part="plan">
                    <input
                      type="radio"
                      name="plan"
                      value={plan.name}
                      checked={chosen === plan.name}
                      onChange={() => setChosen(plan.name)}
                    />
                    <span>
                      <span data-part="pname">
                        {plan.name}
                        {plan.best ? (
                          <span data-part="best">чаще всего</span>
                        ) : null}
                      </span>
                      <span data-part="price">
                        {price} ₽{" "}
                        <span data-part="per">
                          в месяц{yearly ? ", при оплате за год" : ""}
                        </span>
                      </span>
                      <span data-part="note">{plan.note}</span>
                      <ul data-part="perks">
                        {plan.perks.map((perk) => (
                          <li key={perk} data-part="perk">
                            <span data-part="check" aria-hidden="true">
                              ✓
                            </span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>

          <form
            data-part="form"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <div data-part="field">
              <label htmlFor="vibeui-auth-025-email">Рабочая почта</label>
              <input
                id="vibeui-auth-025-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="name@company.ru"
                required
              />
            </div>
            <div data-part="field">
              <label htmlFor="vibeui-auth-025-password">Пароль</label>
              <input
                id="vibeui-auth-025-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={10}
                required
              />
            </div>
            <button type="submit" data-part="submit">
              {submit} — тариф «{chosen}»
            </button>
          </form>

          <p data-part="foot">
            На свободном тарифе карта не нужна. Платный можно включить позже —
            прогресс и проекты сохранятся.
          </p>
        </div>
      </section>
    </>
  )
}
