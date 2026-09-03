import type { CSSProperties } from "react"

export type Contact006Slot = {
  time: string
  taken?: boolean
}

export type Contact006Day = {
  label: string
  note?: string
}

export type Contact006Props = {
  eyebrow?: string
  title?: string
  description?: string
  days?: Contact006Day[]
  slots?: Contact006Slot[]
  zones?: string[]
  phoneLabel?: string
  phoneHint?: string
  submitLabel?: string
  consentLabel?: string
  footNote?: string
  /** Подписи блока: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: обратный звонок с окном времени, а не «перезвоним в течение
// дня». Неизвестное время звонка — главная причина, по которой трубку не
// берут: человек на встрече, за рулём или просто не ждёт незнакомый номер.
//
// Слоты — радиогруппа: занятое время не исчезает из сетки, а остаётся
// видимым и disabled. Пустое место читалось бы как «сюда можно», а
// исчезнувший слот заставляет гадать, был ли он вообще. Занятость
// продублирована подписью, потому что серым цветом её не передать.
//
// Телефон — input type="tel" с inputMode: на телефоне сразу открывается
// цифровая клавиатура. Маску блок не навязывает: она ломает вставку номера
// из буфера и международный формат. Отправку реализует вызывающий код.
const STYLES = `
:where([data-vibeui-block="contact-006"]){
--vibeui-contact-006-bg:transparent;
--vibeui-contact-006-card:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-contact-006-soft:light-dark(oklch(0.975 0.004 265),oklch(0.27 0.01 265));
--vibeui-contact-006-fg:light-dark(oklch(0.2 0.014 265),oklch(0.94 0.005 265));
--vibeui-contact-006-muted:light-dark(oklch(0.52 0.014 265),oklch(0.72 0.012 265));
--vibeui-contact-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.012 265));
--vibeui-contact-006-accent:light-dark(oklch(0.51 0.18 30),oklch(0.74 0.16 40));
--vibeui-contact-006-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 40));
--vibeui-contact-006-alarm:light-dark(oklch(0.55 0.19 25),oklch(0.73 0.16 25));
--vibeui-contact-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-006"]{color-scheme:dark}
[data-vibeui-block="contact-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-contact-006-bg);color:var(--vibeui-contact-006-fg);
font-family:var(--vibeui-contact-006-sans);
}
[data-vibeui-block="contact-006"] *{box-sizing:border-box}
[data-vibeui-block="contact-006"] [data-part="frame"]{
max-width:60rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:1.5rem;align-items:start;
}
[data-vibeui-block="contact-006"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-contact-006-accent);
}
[data-vibeui-block="contact-006"] h2{
margin:0.5rem 0 0;max-width:16ch;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.5rem,3.6cqi,2.25rem);line-height:1.14;
}
[data-vibeui-block="contact-006"] [data-part="lede"]{
margin:0.5rem 0 0;max-width:44ch;font-size:0.9375rem;line-height:1.65;color:var(--vibeui-contact-006-muted);
}
[data-vibeui-block="contact-006"] form{
display:grid;gap:1rem;padding:1.25rem;border-radius:1.25rem;
background:var(--vibeui-contact-006-soft);border:1px solid var(--vibeui-contact-006-border);
}
[data-vibeui-block="contact-006"] fieldset{margin:0;padding:0;border:0;display:grid;gap:0.5rem}
[data-vibeui-block="contact-006"] legend{padding:0;font-size:0.8125rem;font-weight:640}
[data-vibeui-block="contact-006"] [data-part="days"]{display:flex;flex-wrap:wrap;gap:0.4375rem;clear:both}
[data-vibeui-block="contact-006"] [data-part="day"]{
display:grid;cursor:pointer;gap:0.0625rem;
padding:0.4375rem 0.75rem;border-radius:0.6875rem;
border:1px solid var(--vibeui-contact-006-border);background:var(--vibeui-contact-006-card);
font-size:0.8125rem;font-weight:620;color:var(--vibeui-contact-006-muted);
}
[data-vibeui-block="contact-006"] [data-part="day"]:has(input:checked){
color:var(--vibeui-contact-006-accent);border-color:var(--vibeui-contact-006-accent);
background:color-mix(in oklab,var(--vibeui-contact-006-accent) 8%,var(--vibeui-contact-006-card));
}
[data-vibeui-block="contact-006"] [data-part="day-note"]{font-size:0.6875rem;font-weight:400}
[data-vibeui-block="contact-006"] input[type="radio"]{
position:absolute;width:1px;height:1px;opacity:0;
}
[data-vibeui-block="contact-006"] [data-part="day"]:has(input:focus-visible),
[data-vibeui-block="contact-006"] [data-part="slot"]:has(input:focus-visible){
outline:2px solid var(--vibeui-contact-006-accent);outline-offset:2px;
}
[data-vibeui-block="contact-006"] [data-part="slots"]{
display:grid;grid-template-columns:repeat(auto-fill,minmax(5rem,1fr));gap:0.4375rem;clear:both;
}
/* Занятый слот остаётся в сетке: пустое место читалось бы как «свободно». */
[data-vibeui-block="contact-006"] [data-part="slot"]{
display:grid;justify-items:center;gap:0.0625rem;cursor:pointer;
padding:0.4375rem 0.375rem;border-radius:0.625rem;
border:1px solid var(--vibeui-contact-006-border);background:var(--vibeui-contact-006-card);
font-size:0.875rem;font-weight:640;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="contact-006"] [data-part="slot"]:has(input:checked){
color:var(--vibeui-contact-006-on-accent);background:var(--vibeui-contact-006-accent);border-color:var(--vibeui-contact-006-accent);
}
[data-vibeui-block="contact-006"] [data-part="slot"]:has(input:disabled){
cursor:not-allowed;color:var(--vibeui-contact-006-muted);
background:var(--vibeui-contact-006-soft);border-style:dashed;
}
[data-vibeui-block="contact-006"] [data-part="taken"]{
font-size:0.5625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-contact-006-muted);
}
[data-vibeui-block="contact-006"] [data-part="field"]{display:grid;gap:0.3125rem}
[data-vibeui-block="contact-006"] label[for]{font-size:0.8125rem;font-weight:640}
[data-vibeui-block="contact-006"] input[type="tel"],
[data-vibeui-block="contact-006"] select{
width:100%;height:2.625rem;padding:0 0.75rem;border-radius:0.6875rem;
border:1px solid var(--vibeui-contact-006-border);
background:var(--vibeui-contact-006-card);color:inherit;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="contact-006"] select{appearance:none;cursor:pointer;padding-right:2rem}
[data-vibeui-block="contact-006"] [data-part="select"]{position:relative;display:block}
[data-vibeui-block="contact-006"] [data-part="select"]::after{
content:"";position:absolute;right:0.875rem;top:50%;margin-top:-0.25rem;
width:0.375rem;height:0.375rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-contact-006-muted);
border-bottom:1.5px solid var(--vibeui-contact-006-muted);
transform:rotate(45deg);
}
[data-vibeui-block="contact-006"] input[type="tel"]:user-invalid{border-color:var(--vibeui-contact-006-alarm)}
[data-vibeui-block="contact-006"] [data-part="error"]{
font-size:0.75rem;line-height:1.4;color:var(--vibeui-contact-006-alarm);
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="contact-006"] input[type="tel"]:user-invalid ~ [data-part="error"]{
position:static;width:auto;height:auto;clip-path:none;
}
[data-vibeui-block="contact-006"] [data-part="hint"]{font-size:0.75rem;line-height:1.45;color:var(--vibeui-contact-006-muted)}
[data-vibeui-block="contact-006"] [data-part="consent"]{
display:flex;gap:0.5rem;align-items:flex-start;cursor:pointer;
font-size:0.75rem;line-height:1.5;color:var(--vibeui-contact-006-muted);
}
[data-vibeui-block="contact-006"] input[type="checkbox"]{
flex:none;width:0.9375rem;height:0.9375rem;margin:0.125rem 0 0;accent-color:var(--vibeui-contact-006-accent);
}
[data-vibeui-block="contact-006"] button{
appearance:none;cursor:pointer;border:0;
height:2.75rem;padding:0 1.25rem;border-radius:0.75rem;
background:var(--vibeui-contact-006-accent);color:var(--vibeui-contact-006-on-accent);
font:inherit;font-size:0.9375rem;font-weight:660;
}
[data-vibeui-block="contact-006"] [data-part="foot"]{
margin:0;font-size:0.75rem;line-height:1.55;color:var(--vibeui-contact-006-muted);
}
[data-vibeui-block="contact-006"] button:focus-visible,
[data-vibeui-block="contact-006"] input:focus-visible,
[data-vibeui-block="contact-006"] select:focus-visible{outline:2px solid var(--vibeui-contact-006-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="contact-006"] [data-part="frame"]{padding:4rem 2rem;grid-template-columns:1fr 1.2fr;column-gap:3rem}
[data-vibeui-block="contact-006"] form{padding:1.625rem}
[data-vibeui-block="contact-006"] [data-part="pair"]{display:grid;grid-template-columns:1fr 1fr;gap:0.875rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS: Contact006Day[] = [
  { label: "Сегодня", note: "14 мая" },
  { label: "Завтра", note: "15 мая" },
  { label: "Пятница", note: "16 мая" },
]

const DEFAULT_SLOTS: Contact006Slot[] = [
  { time: "10:00" },
  { time: "11:00", taken: true },
  { time: "12:00" },
  { time: "14:00" },
  { time: "15:00", taken: true },
  { time: "16:00" },
  { time: "17:00" },
  { time: "18:00" },
]

const DEFAULT_ZONES = [
  "Москва (UTC+3)",
  "Екатеринбург (UTC+5)",
  "Новосибирск (UTC+7)",
  "Владивосток (UTC+10)",
]

const LABELS: Record<string, string> = {
  dayLegend: "День",
  slotLegend: "Время звонка",
  taken: "занято",
  zone: "Часовой пояс",
  phonePlaceholder: "+7 999 123-45-67",
  phoneError: "Похоже, в номере не хватает цифр. Проверьте код города.",
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
 * Заявка на обратный звонок с выбором дня, слота времени и часового пояса.
 * Один файл, ноль зависимостей, отправку реализует вызывающий код.
 */
export function Contact006({
  eyebrow = "Обратный звонок",
  title = "Позвоним, когда вам удобно",
  description = "Выберите окно в полчаса — позвоним внутри него. Если не дозвонимся, пришлём сообщение и предложим другое время.",
  days = DEFAULT_DAYS,
  slots = DEFAULT_SLOTS,
  zones = DEFAULT_ZONES,
  phoneLabel = "Телефон",
  phoneHint = "Можно с кодом страны. Маску не ставим: она ломает вставку из буфера.",
  submitLabel = "Жду звонка",
  consentLabel = "Согласен на обработку номера для организации звонка.",
  footNote = "Звоним с номера +7 495 120-45-90. Занятые окна показаны в сетке и выбрать их нельзя.",
  labels,
  background = "",
  accent,
  className,
  style,
}: Contact006Props) {
  const text = { ...LABELS, ...labels }
  const palette = {
    ...(accent ? { "--vibeui-contact-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contact-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const firstFree = slots.find((slot) => !slot.taken)?.time

  return (
    <>
      <style href="vibeui-contact-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-006"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <div>
            <span data-part="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p data-part="lede">{description}</p>
          </div>

          <form>
            <fieldset>
              <legend>{text.dayLegend}</legend>
              <div data-part="days">
                {days.map((day, index) => (
                  <label key={day.label} data-part="day">
                    <input
                      type="radio"
                      name="contact-006-day"
                      value={day.label}
                      defaultChecked={index === 0}
                    />
                    <span>{day.label}</span>
                    {day.note ? (
                      <span data-part="day-note">{day.note}</span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>{text.slotLegend}</legend>
              <div data-part="slots">
                {slots.map((slot) => (
                  <label key={slot.time} data-part="slot">
                    <input
                      type="radio"
                      name="contact-006-slot"
                      value={slot.time}
                      disabled={slot.taken}
                      defaultChecked={slot.time === firstFree}
                    />
                    <span>{slot.time}</span>
                    {slot.taken ? (
                      <span data-part="taken">{text.taken}</span>
                    ) : null}
                  </label>
                ))}
              </div>
            </fieldset>

            <div data-part="pair">
              <div data-part="field">
                <label htmlFor="contact-006-phone">{phoneLabel}</label>
                <input
                  id="contact-006-phone"
                  type="tel"
                  name="phone"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="[+0-9()\\s-]{10,20}"
                  placeholder={text.phonePlaceholder}
                  aria-describedby="contact-006-phone-error contact-006-phone-hint"
                />
                <span id="contact-006-phone-error" data-part="error">
                  {text.phoneError}
                </span>
                <span id="contact-006-phone-hint" data-part="hint">
                  {phoneHint}
                </span>
              </div>

              <div data-part="field">
                <label htmlFor="contact-006-zone">{text.zone}</label>
                <span data-part="select">
                  <select id="contact-006-zone" name="zone">
                    {zones.map((zone) => (
                      <option key={zone}>{zone}</option>
                    ))}
                  </select>
                </span>
              </div>
            </div>

            <label data-part="consent">
              <input type="checkbox" name="consent" required />
              {consentLabel}
            </label>

            <button type="submit">{submitLabel}</button>
            <p data-part="foot">{footNote}</p>
          </form>
        </div>
      </section>
    </>
  )
}
