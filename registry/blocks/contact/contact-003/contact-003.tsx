import type { CSSProperties } from "react"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Select001 } from "@/registry/components/select/select-001/select-001"

export type Contact003Props = {
  badge?: string
  title?: string
  description?: string
  steps?: string[]
  goals?: string[]
  teamSizes?: string[]
  submitLabel?: string
  privacyNote?: string
  name?: string
  /** Подписи полей: компонент несёт русские, проект подставляет свои. */
  fieldText?: Record<string, string>
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: заявка на демо, после которой понятно, что будет дальше.
// Три шага стоят над формой, а не под ней: человек решает, оставлять ли
// заявку, до того как начнёт заполнять поля, и «созвон на 30 минут» — часть
// этого решения.
//
// Цель встречи выбирается чипами-радиокнопками, а не свободным полем:
// свободное поле здесь заполняют одним словом «интересно», и менеджер всё
// равно перезванивает с тем же вопросом. Радиокнопка не спрятана
// display:none, иначе группа выпадает из обхода клавиатурой; она уменьшена,
// а состояние чипа читается через :has(input:checked).
//
// Форма несёт только разметку и нативную проверку: отправку, антиспам и
// ответ пользователю реализует вызывающий код.
const STYLES = `
:where([data-vibeui-block="contact-003"]){
--vibeui-contact-003-bg:transparent;
--vibeui-contact-003-card:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-contact-003-field:light-dark(oklch(0.985 0 265),oklch(0.2 0 265));
--vibeui-contact-003-fg:light-dark(oklch(0.2 0 265),oklch(0.94 0 265));
--vibeui-contact-003-muted:light-dark(oklch(0.52 0 265),oklch(0.72 0 265));
--vibeui-contact-003-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-contact-003-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-contact-003-on-accent:oklch(from var(--vibeui-contact-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-003-alarm:light-dark(oklch(0.55 0.19 25),oklch(0.73 0.16 25));
--vibeui-contact-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-003"]{color-scheme:dark}
[data-vibeui-block="contact-003"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-contact-003-bg);color:var(--vibeui-contact-003-fg);
font-family:var(--vibeui-contact-003-sans);
}
[data-vibeui-block="contact-003"] *{box-sizing:border-box}
[data-vibeui-block="contact-003"] [data-part="frame"]{max-width:52rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-003"] [data-part="card"]{
display:grid;gap:1.25rem;padding:1.5rem 1.25rem;border-radius:1.375rem;
background:var(--vibeui-contact-003-card);border:1px solid var(--vibeui-contact-003-border);
}
[data-vibeui-block="contact-003"] [data-part="badge"]{
justify-self:start;padding:0.1875rem 0.625rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-contact-003-accent) 12%,transparent);
color:var(--vibeui-contact-003-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
}
[data-vibeui-block="contact-003"] h2{
margin:0.5rem 0 0;max-width:20ch;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.375rem,3.4cqi,2rem);line-height:1.15;
}
[data-vibeui-block="contact-003"] [data-part="lede"]{
margin:0.5rem 0 0;max-width:52ch;font-size:0.9375rem;line-height:1.65;color:var(--vibeui-contact-003-muted);
}
/* Шаги стоят над формой: решение принимают до заполнения полей. */
[data-vibeui-block="contact-003"] ol{
list-style:none;margin:0;padding:0;display:grid;gap:0.625rem;counter-reset:vibeui-step;
}
[data-vibeui-block="contact-003"] ol li{
display:grid;grid-template-columns:1.5rem 1fr;gap:0.625rem;align-items:start;
font-size:0.8125rem;line-height:1.55;color:var(--vibeui-contact-003-muted);
}
[data-vibeui-block="contact-003"] ol li::before{
counter-increment:vibeui-step;content:counter(vibeui-step);
display:inline-flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-contact-003-accent) 12%,transparent);
color:var(--vibeui-contact-003-accent);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="contact-003"] form{
display:grid;gap:0.875rem;padding-top:1.25rem;border-top:1px solid var(--vibeui-contact-003-border);
}
[data-vibeui-block="contact-003"] fieldset{margin:0;padding:0;border:0;display:grid;gap:0.4375rem}
[data-vibeui-block="contact-003"] legend{padding:0;font-size:0.8125rem;font-weight:640}
[data-vibeui-block="contact-003"] [data-part="goals"]{display:flex;flex-wrap:wrap;gap:0.4375rem;clear:both}
/* Чип — подпись радиокнопки: display:none выбил бы группу из клавиатуры. */
[data-vibeui-block="contact-003"] [data-part="goal"]{
display:inline-flex;align-items:center;gap:0.4375rem;cursor:pointer;
height:2.125rem;padding:0 0.8125rem;border-radius:9999px;
border:1px solid var(--vibeui-contact-003-border);background:var(--vibeui-contact-003-field);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-contact-003-muted);
}
[data-vibeui-block="contact-003"] [data-part="goal"]:has(input:checked){
color:var(--vibeui-contact-003-accent);border-color:var(--vibeui-contact-003-accent);
background:color-mix(in oklab,var(--vibeui-contact-003-accent) 8%,var(--vibeui-contact-003-card));
}
[data-vibeui-block="contact-003"] [data-part="goal"]:has(input:focus-visible){outline:2px solid var(--vibeui-contact-003-accent);outline-offset:2px}
[data-vibeui-block="contact-003"] [data-part="privacy"]{
margin:0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-contact-003-muted);max-width:56ch;
}
[data-vibeui-block="contact-003"] :focus-visible{outline:2px solid var(--vibeui-contact-003-accent);outline-offset:2px}
@container (min-width: 42rem){
[data-vibeui-block="contact-003"] [data-part="frame"]{padding:4rem 2rem}
[data-vibeui-block="contact-003"] [data-part="card"]{padding:2rem}
[data-vibeui-block="contact-003"] ol{grid-template-columns:repeat(3,1fr);gap:1rem}
[data-vibeui-block="contact-003"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = [
  "Смотрим заявку в течение рабочего дня и пишем на почту.",
  "Созваниваемся на тридцать минут: показываем продукт на ваших задачах.",
  "Присылаем запись, ответы на вопросы и доступ к пробной среде.",
]

const DEFAULT_GOALS = [
  "Посмотреть возможности",
  "Сравнить с текущим решением",
  "Обсудить внедрение",
  "Уточнить цену",
]

const DEFAULT_TEAM_SIZES = [
  "1–10 человек",
  "11–50 человек",
  "51–200 человек",
  "Больше 200 человек",
]

const FIELD_TEXT: Record<string, string> = {
  name: "Имя и фамилия",
  namePlaceholder: "Мария Орлова",
  nameError: "Укажите имя — так мы обратимся к вам в письме.",
  email: "Рабочая почта",
  emailPlaceholder: "maria@company.ru",
  emailError: "Нужен адрес с @ и доменом компании.",
  company: "Компания",
  companyPlaceholder: "Название",
  companyError: "Напишите название компании.",
  teamSize: "Размер команды",
  goalsLegend: "Что хотите увидеть",
}

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
 * Заявка на демо: три шага над формой, цель встречи чипами и рабочая почта.
 * Один файл, ноль зависимостей, отправку реализует вызывающий код.
 */
export function Contact003({
  badge = "30 минут",
  title = "Покажем продукт на ваших задачах",
  description = "Не презентация на сорок слайдов, а разбор вашего сценария. Заявку читает человек из команды внедрения.",
  steps = DEFAULT_STEPS,
  goals = DEFAULT_GOALS,
  teamSizes = DEFAULT_TEAM_SIZES,
  submitLabel = "Записаться на демо",
  privacyNote = "Оставляя заявку, вы соглашаетесь на обработку контактов для организации встречи. В рассылку адрес не попадает.",
  name = "contact-003-goal",
  fieldText,
  background = "",
  accent,
  className,
  style,
}: Contact003Props) {
  const labels = { ...FIELD_TEXT, ...fieldText }
  const palette = {
    ...(accent ? { "--vibeui-contact-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contact-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-003"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <div data-part="card">
            <header>
              <span data-part="badge">{badge}</span>
              <h2>{title}</h2>
              <p data-part="lede">{description}</p>
            </header>

            <ol>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <form>
              <div data-part="pair">
                <Input001
                  name="name"
                  autoComplete="name"
                  required
                  label={labels.name}
                  accent={accent}
                />

                <Input001
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  label={labels.email}
                  accent={accent}
                />
              </div>

              <div data-part="pair">
                <Input001
                  name="company"
                  autoComplete="organization"
                  required
                  label={labels.company}
                  accent={accent}
                />

                <Select001
                  label={labels.teamSize}
                  placeholder=""
                  options={teamSizes.map((size) => ({ value: size, label: size }))}
                  name="teamSize"
                  accent={accent}
                />
              </div>

              <fieldset>
                <legend>{labels.goalsLegend}</legend>
                <div data-part="goals">
                  {goals.map((goal, index) => (
                    <label key={goal} data-part="goal">
                      <input
                        type="radio"
                        name={name}
                        value={goal}
                        defaultChecked={index === 0}
                      />
                      {goal}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Button001 type="submit" size="lg" accent={accent}>
                {submitLabel}
              </Button001>
              <p data-part="privacy">{privacyNote}</p>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
