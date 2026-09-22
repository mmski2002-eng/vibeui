import type { CSSProperties } from "react"

import { Button001 } from "@/registry/components/button/button-001/button-001"
import { Checkbox001 } from "@/registry/components/checkbox/checkbox-001/checkbox-001"
import { Input001 } from "@/registry/components/input/input-001/input-001"
import { Input034 } from "@/registry/components/input/input-034/input-034"
import { Select001 } from "@/registry/components/select/select-001/select-001"

export type Contact001Channel = {
  label: string
  value: string
  note?: string
}

export type Contact001Props = {
  eyebrow?: string
  title?: string
  description?: string
  topics?: string[]
  channels?: Contact001Channel[]
  submitLabel?: string
  consentLabel?: string
  responseNote?: string
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
// Идея блока: форма, которая сразу спрашивает тему обращения. Одно поле
// «сообщение» на все случаи означает, что письмо попадёт не в тот отдел и
// пролежит два дня; выбор темы первым полем решает это без единой строки
// на бэкенде.
//
// Валидация нативная: required, type="email", inputMode для телефона.
// Ошибка показывается через :user-invalid — :invalid покрасил бы пустое
// поле красным до первого ввода. Текст ошибки всегда есть в разметке и
// связан с полем через aria-describedby, поэтому скринридер находит его в
// момент появления, а не ищет по странице.
//
// Рядом с формой стоят прямые контакты: часть людей форму не заполняет
// никогда, и отнимать у них почту — терять обращение. Отправку реализует
// вызывающий код: блок несёт только разметку и проверку в браузере.
const STYLES = `
:where([data-vibeui-block="contact-001"]){
--vibeui-contact-001-bg:transparent;
--vibeui-contact-001-card:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-contact-001-fg:light-dark(oklch(0.2 0 265),oklch(0.94 0 265));
--vibeui-contact-001-muted:light-dark(oklch(0.52 0 265),oklch(0.72 0 265));
--vibeui-contact-001-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-contact-001-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-contact-001-on-accent:oklch(from var(--vibeui-contact-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-contact-001-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-001"]{color-scheme:dark}
[data-vibeui-block="contact-001"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-contact-001-bg);color:var(--vibeui-contact-001-fg);
font-family:var(--vibeui-contact-001-sans);
}
[data-vibeui-block="contact-001"] *{box-sizing:border-box}
[data-vibeui-block="contact-001"] [data-part="frame"]{
max-width:72rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:1.75rem;align-items:start;
}
[data-vibeui-block="contact-001"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-contact-001-accent);
}
[data-vibeui-block="contact-001"] h2{
margin:0.5rem 0 0;max-width:16ch;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.5rem,3.8cqi,2.375rem);line-height:1.12;
}
[data-vibeui-block="contact-001"] [data-part="lede"]{
margin:0.625rem 0 0;max-width:44ch;font-size:0.9375rem;line-height:1.65;color:var(--vibeui-contact-001-muted);
}
/* Прямые контакты рядом: кто не заполняет формы, тот просто уйдёт. */
[data-vibeui-block="contact-001"] dl{margin:1.5rem 0 0;display:grid;gap:0.875rem}
[data-vibeui-block="contact-001"] dt{
font-size:0.6875rem;font-weight:660;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-contact-001-muted);
}
[data-vibeui-block="contact-001"] dd{margin:0.1875rem 0 0;font-size:0.9375rem;font-weight:620}
[data-vibeui-block="contact-001"] [data-part="aside-note"]{
display:block;margin-top:0.125rem;font-size:0.75rem;font-weight:400;color:var(--vibeui-contact-001-muted);
}
[data-vibeui-block="contact-001"] form{
display:grid;gap:0.875rem;padding:1.375rem;border-radius:1.25rem;
background:var(--vibeui-contact-001-card);border:1px solid var(--vibeui-contact-001-border);
}
[data-vibeui-block="contact-001"] [data-part="response"]{
margin:0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-contact-001-muted);
}
[data-vibeui-block="contact-001"] :focus-visible{outline:2px solid var(--vibeui-contact-001-accent);outline-offset:2px}
@container (min-width: 48rem){
[data-vibeui-block="contact-001"] [data-part="frame"]{padding:4rem 2rem;grid-template-columns:1fr 26rem;column-gap:3.5rem}
[data-vibeui-block="contact-001"] form{padding:1.75rem}
[data-vibeui-block="contact-001"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TOPICS = [
  "Новый проект",
  "Доработка существующего сайта",
  "Вопрос по счёту",
  "Партнёрство",
  "Другое",
]

const DEFAULT_CHANNELS: Contact001Channel[] = [
  {
    label: "Почта",
    value: "hello@studio.ru",
    note: "Отвечаем в рабочие дни до 18:00",
  },
  {
    label: "Телефон",
    value: "+7 495 120-45-90",
    note: "Пн–Пт, 10:00–19:00 по Москве",
  },
  {
    label: "Офис",
    value: "Москва, Большая Дмитровка, 14",
    note: "Вход со двора, второй этаж",
  },
]

const FIELD_TEXT: Record<string, string> = {
  topic: "Тема обращения",
  name: "Как к вам обращаться",
  namePlaceholder: "Имя",
  nameError: "Напишите имя — так ответ будет адресным.",
  email: "Электронная почта",
  emailPlaceholder: "you@company.ru",
  emailError: "Проверьте адрес: нужен символ @ и домен.",
  message: "Задача",
  messageHint: " — что нужно сделать и к какому сроку",
  messagePlaceholder:
    "Нужен сайт для студии: главная, услуги и форма заявки. Ориентир по срокам — конец мая.",
  messageError: "Пары предложений хватит: сейчас текст слишком короткий.",
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
 * Форма связи с темой обращения первым полем и прямыми контактами рядом.
 * Один файл, ноль зависимостей, отправку реализует вызывающий код.
 */
export function Contact001({
  eyebrow = "Связаться",
  title = "Расскажите, что нужно сделать",
  description = "Опишите задачу в двух абзацах: этого хватает, чтобы ответить по делу, а не «давайте созвонимся».",
  topics = DEFAULT_TOPICS,
  channels = DEFAULT_CHANNELS,
  submitLabel = "Отправить обращение",
  consentLabel = "Согласен на обработку персональных данных для ответа на обращение.",
  responseNote = "Отвечаем на обращения в течение одного рабочего дня. Тема письма определяет, кто ответит.",
  fieldText,
  background = "",
  accent,
  className,
  style,
}: Contact001Props) {
  const labels = { ...FIELD_TEXT, ...fieldText }
  const palette = {
    ...(accent ? { "--vibeui-contact-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contact-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-001"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <div>
            <span data-part="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p data-part="lede">{description}</p>
            <dl>
              {channels.map((channel) => (
                <div key={channel.label}>
                  <dt>{channel.label}</dt>
                  <dd>
                    {channel.value}
                    {channel.note ? (
                      <span data-part="aside-note">{channel.note}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <form>
            <Select001
              name="topic"
              required
              label={labels.topic}
              placeholder=""
              options={topics.map((topic) => ({ value: topic, label: topic }))}
              accent={accent}
            />

            <div data-part="pair">
              <Input001
                name="name"
                required
                autoComplete="name"
                label={labels.name}
                accent={accent}
              />
              <Input001
                type="email"
                name="email"
                required
                autoComplete="email"
                label={labels.email}
                accent={accent}
              />
            </div>

            <Input034
              name="message"
              required
              minLength={20}
              label={labels.message}
              hint={labels.messageHint}
              rows={5}
              accent={accent}
            />

            <Checkbox001 name="consent" required label={consentLabel} description="" accent={accent} />

            <Button001 type="submit" size="lg" accent={accent}>
              {submitLabel}
            </Button001>
            <p data-part="response">{responseNote}</p>
          </form>
        </div>
      </section>
    </>
  )
}
