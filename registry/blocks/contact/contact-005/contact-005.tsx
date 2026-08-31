import type { CSSProperties } from "react"

export type Contact005Department = {
  name: string
  purpose: string
  email: string
  phone?: string
  hours?: string
  reply?: string
}

export type Contact005Props = {
  eyebrow?: string
  title?: string
  description?: string
  departments?: Contact005Department[]
  fallbackTitle?: string
  fallbackText?: string
  fallbackEmail?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: список отделов, из которого понятно, куда писать. У каждой
// строки есть не только адрес, но и назначение — «для чего сюда пишут» —
// и обещанное время ответа. Без этих двух строк список превращается в
// набор одинаковых почтовых ящиков, и письмо уходит в первый попавшийся.
//
// Внизу стоит запасной адрес на случай «не знаю, куда»: без него человек
// пишет во все ящики сразу, и обращение обрабатывают трижды.
//
// Адреса и телефоны — настоящие ссылки mailto: и tel:, а не текст: на
// телефоне это разница между одним касанием и ручным перенабором. Время
// ответа набрано tabular-nums, поэтому колонка не прыгает.
const STYLES = `
:where([data-vibeui-block="contact-005"]){
--vibeui-contact-005-bg:oklch(0.99 0.002 265);
--vibeui-contact-005-card:oklch(1 0 0);
--vibeui-contact-005-fg:oklch(0.2 0.014 265);
--vibeui-contact-005-muted:oklch(0.52 0.014 265);
--vibeui-contact-005-border:oklch(0.9 0.006 265);
--vibeui-contact-005-accent:oklch(0.5 0.16 165);
--vibeui-contact-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="contact-005"]{
background:var(--vibeui-contact-005-bg);color:var(--vibeui-contact-005-fg);
font-family:var(--vibeui-contact-005-sans);
}
[data-vibeui-block="contact-005"] *{box-sizing:border-box}
[data-vibeui-block="contact-005"] [data-part="frame"]{
max-width:70rem;margin:0 auto;padding:3rem 1.25rem;display:grid;gap:1.5rem;
}
[data-vibeui-block="contact-005"] [data-part="eyebrow"]{
font-size:0.75rem;font-weight:650;letter-spacing:0.09em;text-transform:uppercase;
color:var(--vibeui-contact-005-accent);
}
[data-vibeui-block="contact-005"] h2{
margin:0.5rem 0 0;max-width:20ch;font-weight:680;letter-spacing:-0.02em;
font-size:clamp(1.5rem,3.6cqi,2.25rem);line-height:1.14;
}
[data-vibeui-block="contact-005"] [data-part="lede"]{
margin:0.5rem 0 0;max-width:52ch;font-size:0.9375rem;line-height:1.65;color:var(--vibeui-contact-005-muted);
}
[data-vibeui-block="contact-005"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.75rem}
[data-vibeui-block="contact-005"] li{
display:grid;gap:0.4375rem;padding:1rem 1.125rem;border-radius:1rem;
background:var(--vibeui-contact-005-card);border:1px solid var(--vibeui-contact-005-border);
}
[data-vibeui-block="contact-005"] h3{margin:0;font-size:0.9375rem;font-weight:660;line-height:1.3}
/* Назначение отдела: без него список — набор одинаковых ящиков. */
[data-vibeui-block="contact-005"] [data-part="purpose"]{
margin:0;max-width:52ch;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-contact-005-muted);
}
[data-vibeui-block="contact-005"] [data-part="lines"]{
display:flex;flex-wrap:wrap;gap:0.375rem 1.125rem;margin-top:0.125rem;
}
[data-vibeui-block="contact-005"] [data-part="lines"] a{
color:var(--vibeui-contact-005-fg);font-size:0.875rem;font-weight:620;text-decoration:none;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-contact-005-accent) 50%,transparent);
}
[data-vibeui-block="contact-005"] [data-part="lines"] a:hover{color:var(--vibeui-contact-005-accent)}
[data-vibeui-block="contact-005"] [data-part="meta"]{
display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;
font-size:0.75rem;color:var(--vibeui-contact-005-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="contact-005"] [data-part="reply"]{
display:inline-flex;align-items:center;gap:0.375rem;
}
[data-vibeui-block="contact-005"] [data-part="dot"]{
width:0.375rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-contact-005-accent);
}
/* Запасной адрес: без него пишут во все ящики сразу. */
[data-vibeui-block="contact-005"] [data-part="fallback"]{
display:grid;gap:0.3125rem;padding:1rem 1.125rem;border-radius:1rem;
border:1px dashed var(--vibeui-contact-005-border);
background:color-mix(in oklab,var(--vibeui-contact-005-accent) 5%,var(--vibeui-contact-005-bg));
}
[data-vibeui-block="contact-005"] [data-part="fallback"] h3{font-size:0.875rem}
[data-vibeui-block="contact-005"] [data-part="fallback"] p{
margin:0;max-width:56ch;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-contact-005-muted);
}
[data-vibeui-block="contact-005"] [data-part="fallback"] a{
justify-self:start;margin-top:0.1875rem;
color:var(--vibeui-contact-005-accent);font-size:0.9375rem;font-weight:660;text-decoration:none;
}
[data-vibeui-block="contact-005"] [data-part="fallback"] a:hover{text-decoration:underline}
[data-vibeui-block="contact-005"] a:focus-visible{outline:2px solid var(--vibeui-contact-005-accent);outline-offset:2px;border-radius:0.25rem}
@container (min-width: 46rem){
[data-vibeui-block="contact-005"] [data-part="frame"]{padding:4rem 2rem}
[data-vibeui-block="contact-005"] ul{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contact-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_DEPARTMENTS: Contact005Department[] = [
  {
    name: "Продажи",
    purpose:
      "Цены, коммерческое предложение, условия для нескольких юрлиц и пилотный запуск.",
    email: "sales@studio.ru",
    phone: "+7 495 120-45-91",
    hours: "Пн–Пт, 10:00–19:00",
    reply: "Ответ в течение дня",
  },
  {
    name: "Поддержка",
    purpose:
      "Ошибки в работе сервиса, доступы, восстановление данных и вопросы по настройке.",
    email: "help@studio.ru",
    phone: "+7 495 120-45-92",
    hours: "Ежедневно, 8:00–22:00",
    reply: "Ответ за 2 часа",
  },
  {
    name: "Бухгалтерия",
    purpose:
      "Счета, акты, закрывающие документы и сверка взаиморасчётов по договору.",
    email: "buh@studio.ru",
    hours: "Пн–Пт, 10:00–17:00",
    reply: "Ответ за 3 рабочих дня",
  },
  {
    name: "Пресса и партнёрства",
    purpose:
      "Комментарии для СМИ, совместные материалы, участие в конференциях и интеграции.",
    email: "press@studio.ru",
    hours: "Пн–Пт, 11:00–18:00",
    reply: "Ответ за 2 рабочих дня",
  },
]

/**
 * Контакты отделов списком: назначение, адрес, телефон и время ответа.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Contact005({
  eyebrow = "Контакты",
  title = "Напишите тому, кто ответит",
  description = "У каждого отдела свой ящик и своё обещанное время ответа. Письмо в правильный ящик обрабатывается быстрее всего.",
  departments = DEFAULT_DEPARTMENTS,
  fallbackTitle = "Не уверены, кому писать?",
  fallbackText = "Отправьте на общий адрес: обращение прочитают и передадут в нужный отдел в тот же день. Дублировать письмо в остальные ящики не нужно.",
  fallbackEmail = "hello@studio.ru",
  accent,
  className,
  style,
}: Contact005Props) {
  const palette = {
    ...(accent ? { "--vibeui-contact-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contact-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="contact-005"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="frame">
          <header>
            <span data-part="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
            <p data-part="lede">{description}</p>
          </header>

          <ul>
            {departments.map((department) => (
              <li key={department.email}>
                <h3>{department.name}</h3>
                <p data-part="purpose">{department.purpose}</p>
                <p data-part="lines">
                  <a href={`mailto:${department.email}`}>{department.email}</a>
                  {department.phone ? (
                    <a href={`tel:${department.phone.replace(/[^+\d]/g, "")}`}>
                      {department.phone}
                    </a>
                  ) : null}
                </p>
                <p data-part="meta">
                  {department.hours ? <span>{department.hours}</span> : null}
                  {department.reply ? (
                    <span data-part="reply">
                      <span data-part="dot" aria-hidden="true" />
                      {department.reply}
                    </span>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>

          <div data-part="fallback">
            <h3>{fallbackTitle}</h3>
            <p>{fallbackText}</p>
            <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>
          </div>
        </div>
      </section>
    </>
  )
}
