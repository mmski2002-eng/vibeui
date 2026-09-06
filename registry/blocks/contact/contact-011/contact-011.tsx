import type { CSSProperties } from "react"

type Contact011Slot = {
  time: string
  taken?: boolean
}

type Contact011Day = {
  label: string
  note: string
  slots: Contact011Slot[]
}

type Contact011Labels = {
  legend: string
  taken: string
  hint: string
  email: string
  emailPlaceholder: string
  emailError: string
}

export type Contact011Props = {
  eyebrow?: string
  title?: string
  description?: string
  days?: Contact011Day[]
  confirmText?: string
  submitLabel?: string
  labels?: Contact011Labels
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Неделя колонками: под каждым днём — его слоты, вся сетка — одна
// радиогруппа. Подтверждение выбора появляется на чистом CSS: пока слот не
// выбран, поле почты скрыто через :has, и форма не давит пустыми полями.
// Занятые слоты остаются на месте и подписаны — дыра в сетке читается как
// «сюда можно».
const STYLES = `
:where([data-vibeui-block="contact-011"]){
--vibeui-contact-011-bg:transparent;
--vibeui-contact-011-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-contact-011-field:light-dark(oklch(0.985 0 0),oklch(0.26 0 0));
--vibeui-contact-011-ink:light-dark(oklch(0.17 0 0),oklch(0.95 0 0));
--vibeui-contact-011-muted:light-dark(oklch(0.5 0 0),oklch(0.71 0 0));
--vibeui-contact-011-border:light-dark(oklch(0.91 0 0),oklch(0.32 0 0));
--vibeui-contact-011-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-011-accent-fill:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-contact-011-on-accent:oklch(0.15 0.02 39.8);
--vibeui-contact-011-error:light-dark(oklch(0.55 0.19 27),oklch(0.7 0.17 27));
--vibeui-contact-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contact-011"]{color-scheme:dark}
[data-vibeui-block="contact-011"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-contact-011-bg);color:var(--vibeui-contact-011-ink);
font-family:var(--vibeui-contact-011-font);
}
[data-vibeui-block="contact-011"] [data-part="shell"]{max-width:56rem;margin:0 auto;padding:3rem 1.25rem}
[data-vibeui-block="contact-011"] [data-part="eyebrow"]{
margin:0 0 0.625rem;color:var(--vibeui-contact-011-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="contact-011"] [data-part="title"]{
margin:0;max-width:24ch;
font-size:clamp(1.625rem,5cqi,2.375rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="contact-011"] [data-part="description"]{
margin:0.875rem 0 0;max-width:52ch;color:var(--vibeui-contact-011-muted);
font-size:1rem;line-height:1.6;
}
[data-vibeui-block="contact-011"] [data-part="picker"]{
margin:2rem 0 0;padding:0;border:0;min-inline-size:0;
}
[data-vibeui-block="contact-011"] [data-part="legend"]{
padding:0;margin:0 0 1rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="contact-011"] [data-part="week"]{display:grid;gap:1rem}
[data-vibeui-block="contact-011"] [data-part="day"]{
min-inline-size:0;padding:1rem;border:1px solid var(--vibeui-contact-011-border);
border-radius:1rem;background:var(--vibeui-contact-011-card);
}
[data-vibeui-block="contact-011"] [data-part="dayhead"]{
display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.75rem;
}
[data-vibeui-block="contact-011"] [data-part="daylabel"]{font-size:1rem;font-weight:700}
[data-vibeui-block="contact-011"] [data-part="daynote"]{color:var(--vibeui-contact-011-muted);font-size:0.8125rem}
[data-vibeui-block="contact-011"] [data-part="slots"]{
margin:0;padding:0;list-style:none;display:grid;gap:0.5rem;
grid-template-columns:repeat(2,minmax(0,1fr));
}
[data-vibeui-block="contact-011"] [data-part="slot"]{
position:relative;display:flex;align-items:center;justify-content:center;gap:0.375rem;
padding:0.5625rem 0.5rem;border:1px solid var(--vibeui-contact-011-border);border-radius:0.625rem;
background:var(--vibeui-contact-011-field);cursor:pointer;
font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums;
transition:border-color 0.18s ease,background 0.18s ease,color 0.18s ease;
}
/* Радиокнопка убрана визуально, но остаётся в потоке фокуса:
   display:none выбил бы всю группу из клавиатуры. */
[data-vibeui-block="contact-011"] [data-part="slot"] input{
position:absolute;width:1px;height:1px;margin:0;overflow:hidden;clip-path:inset(50%);
}
[data-vibeui-block="contact-011"] [data-part="slot"]:hover{
border-color:color-mix(in oklab,var(--vibeui-contact-011-accent) 45%,var(--vibeui-contact-011-border));
}
[data-vibeui-block="contact-011"] [data-part="slot"]:has(input:checked){
background:var(--vibeui-contact-011-accent-fill);
border-color:var(--vibeui-contact-011-accent-fill);
color:var(--vibeui-contact-011-on-accent);
}
[data-vibeui-block="contact-011"] [data-part="slot"]:has(input:checked)::before{content:"✓";font-size:0.75rem}
[data-vibeui-block="contact-011"] [data-part="slot"]:has(input:focus-visible){
outline:2px solid var(--vibeui-contact-011-accent);outline-offset:2px;
}
[data-vibeui-block="contact-011"] [data-part="slot"][data-taken]{
cursor:not-allowed;background:transparent;color:var(--vibeui-contact-011-muted);
border-style:dashed;
}
[data-vibeui-block="contact-011"] [data-part="slot"][data-taken] [data-part="time"]{text-decoration:line-through}
[data-vibeui-block="contact-011"] [data-part="takenlabel"]{
font-size:0.6875rem;font-weight:600;letter-spacing:0.02em;
}
[data-vibeui-block="contact-011"] [data-part="hint"]{
margin:1rem 0 0;color:var(--vibeui-contact-011-muted);font-size:0.875rem;line-height:1.5;
}
[data-vibeui-block="contact-011"] [data-part="confirm"]{
display:none;margin-top:1.25rem;gap:0.875rem;
padding:1.25rem;border-radius:1rem;
border:1px solid color-mix(in oklab,var(--vibeui-contact-011-accent) 35%,var(--vibeui-contact-011-border));
background:color-mix(in oklab,var(--vibeui-contact-011-accent) 8%,var(--vibeui-contact-011-card));
}
/* Подтверждение появляется только после выбора слота — чистый CSS через :has. */
[data-vibeui-block="contact-011"] [data-part="form"]:has([data-part="picker"] input:checked) [data-part="confirm"]{display:grid}
[data-vibeui-block="contact-011"] [data-part="form"]:has([data-part="picker"] input:checked) [data-part="hint"]{display:none}
[data-vibeui-block="contact-011"] [data-part="confirmtext"]{margin:0;font-size:0.9375rem;line-height:1.55;font-weight:600}
[data-vibeui-block="contact-011"] [data-part="confirmrow"]{display:grid;gap:0.75rem}
[data-vibeui-block="contact-011"] [data-part="field"]{display:grid;gap:0.4375rem;min-inline-size:0}
[data-vibeui-block="contact-011"] [data-part="label"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="contact-011"] [data-part="input"]{
width:100%;padding:0.625rem 0.875rem;margin:0;
border:1px solid var(--vibeui-contact-011-border);border-radius:0.625rem;
background:var(--vibeui-contact-011-card);color:inherit;
font:inherit;font-size:0.9375rem;line-height:1.45;
}
[data-vibeui-block="contact-011"] [data-part="input"]::placeholder{color:var(--vibeui-contact-011-muted)}
[data-vibeui-block="contact-011"] [data-part="input"]:focus-visible{
outline:2px solid var(--vibeui-contact-011-accent);outline-offset:2px;
}
[data-vibeui-block="contact-011"] [data-part="error"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);
color:var(--vibeui-contact-011-error);font-style:normal;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="contact-011"] [data-part="field"]:has(:user-invalid) [data-part="error"]{
position:static;width:auto;height:auto;clip-path:none;
}
[data-vibeui-block="contact-011"] [data-part="field"] :user-invalid{
border-color:var(--vibeui-contact-011-error);
}
[data-vibeui-block="contact-011"] [data-part="submit"]{
padding:0.75rem 1.375rem;border:0;border-radius:0.75rem;cursor:pointer;
background:var(--vibeui-contact-011-accent-fill);color:var(--vibeui-contact-011-on-accent);
font:inherit;font-size:0.9375rem;font-weight:700;letter-spacing:0.01em;
transition:filter 0.18s ease,transform 0.18s ease;
}
[data-vibeui-block="contact-011"] [data-part="submit"]:hover{filter:brightness(1.06)}
[data-vibeui-block="contact-011"] [data-part="submit"]:active{transform:translateY(1px)}
[data-vibeui-block="contact-011"] [data-part="submit"]:focus-visible{
outline:2px solid var(--vibeui-contact-011-accent);outline-offset:3px;
}
@container (min-width: 40rem){
[data-vibeui-block="contact-011"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="contact-011"] [data-part="week"]{grid-template-columns:repeat(3,minmax(0,1fr))}
[data-vibeui-block="contact-011"] [data-part="slots"]{grid-template-columns:1fr}
[data-vibeui-block="contact-011"] [data-part="confirmrow"]{grid-template-columns:minmax(0,1fr) auto;align-items:end}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DAYS: Contact011Day[] = [
  {
    label: "Вторник",
    note: "13 мая",
    slots: [
      { time: "11:00" },
      { time: "13:00", taken: true },
      { time: "15:00" },
      { time: "17:00" },
    ],
  },
  {
    label: "Среда",
    note: "14 мая",
    slots: [
      { time: "11:00", taken: true },
      { time: "13:00" },
      { time: "15:00" },
      { time: "17:00", taken: true },
    ],
  },
  {
    label: "Четверг",
    note: "15 мая",
    slots: [
      { time: "11:00" },
      { time: "13:00" },
      { time: "15:00", taken: true },
      { time: "17:00" },
    ],
  },
]

const DEFAULT_LABELS: Contact011Labels = {
  legend: "Свободные окна на этой неделе, время московское",
  taken: "занято",
  hint: "Выберите окно — дальше спросим только почту для приглашения.",
  email: "Почта для приглашения",
  emailPlaceholder: "you@company.com",
  emailError: "Проверьте адрес: нужна @ и домен.",
}

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Сетка демо-слотов по дням недели с CSS-подтверждением выбора. */
export function Contact011({
  eyebrow = "Демо",
  title = "Выберите время — покажем VibeUI вживую",
  description = "Полчаса без слайдов: собираем страницу из блоков каталога на ваших материалах. Сетка — реальное расписание команды.",
  days = DEFAULT_DAYS,
  confirmText = "Окно выбрано. Оставьте почту — пришлём приглашение и ссылку на встречу.",
  submitLabel = "Забронировать",
  labels = DEFAULT_LABELS,
  background = "",
  accent,
  className,
  style,
}: Contact011Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-contact-011-accent": accent,
          "--vibeui-contact-011-accent-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-contact-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <form data-part="form">
            <fieldset data-part="picker">
              <legend data-part="legend">{labels.legend}</legend>
              <div data-part="week">
                {days.map((day) => (
                  <div key={day.label} data-part="day">
                    <p data-part="dayhead">
                      <span data-part="daylabel">{day.label}</span>
                      <span data-part="daynote">{day.note}</span>
                    </p>
                    <ul data-part="slots">
                      {day.slots.map((slot) => (
                        <li key={`${day.label}-${slot.time}`}>
                          <label
                            data-part="slot"
                            data-taken={slot.taken ? "" : undefined}
                          >
                            <input
                              type="radio"
                              name="vibeui-contact-011-slot"
                              value={`${day.label}, ${slot.time}`}
                              disabled={slot.taken}
                            />
                            <span data-part="time">{slot.time}</span>
                            {slot.taken ? (
                              <span data-part="takenlabel">{labels.taken}</span>
                            ) : null}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </fieldset>
            <p data-part="hint">{labels.hint}</p>
            <div data-part="confirm">
              <p data-part="confirmtext">{confirmText}</p>
              <div data-part="confirmrow">
                <div data-part="field">
                  <label data-part="label" htmlFor="vibeui-contact-011-email">
                    {labels.email}
                  </label>
                  <input
                    data-part="input"
                    id="vibeui-contact-011-email"
                    name="email"
                    type="email"
                    required
                    placeholder={labels.emailPlaceholder}
                    aria-describedby="vibeui-contact-011-email-error"
                  />
                  <em data-part="error" id="vibeui-contact-011-email-error">
                    {labels.emailError}
                  </em>
                </div>
                <button data-part="submit" type="submit">
                  {submitLabel}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
