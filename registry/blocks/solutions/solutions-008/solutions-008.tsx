import type { CSSProperties } from "react"

export type Solutions008Event = {
  date: string
  title: string
  detail?: string
  kind?: "call" | "mail" | "meeting" | "system"
}

export type Solutions008Field = {
  label: string
  value: string
}

export type Solutions008Props = {
  company?: string
  stage?: string
  amount?: string
  nextStep?: string
  nextDate?: string
  nextOwner?: string
  overdue?: boolean
  fields?: Solutions008Field[]
  events?: Solutions008Event[]
  historyTitle?: string
  /** Подпись рядом с этапом сделки. */
  stageCaption?: string
  /** Заголовок блока следующего шага: ключи normal и overdue. */
  nextLabelText?: Record<string, string>
  /** Буквы типов события: ключи call, mail, meeting, system. */
  kindText?: Record<string, string>
  /** Подпись карточки для скринридера, {company} — название клиента. */
  dealLabelText?: string
  className?: string
  style?: CSSProperties
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: карточка сделки. Следующий шаг стоит НАД историей и в рамке —
// история отвечает на вопрос «что было», а работу двигает только «что дальше»,
// и снизу его никто не находит. Просрочка шага меняет рамку, значок и подпись
// сразу: одного цвета мало. История — упорядоченный список с вертикальной
// линией, тип события подписан буквой на кружке, поэтому читается и без цвета.
const STYLES = `
:where([data-vibeui-block="solutions-008"]){
--vibeui-solutions-008-bg:transparent;
--vibeui-solutions-008-panel:light-dark(oklch(0.98 0 250),oklch(0.27 0 255));
--vibeui-solutions-008-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-solutions-008-muted:light-dark(oklch(0.54 0 265),oklch(0.7 0 265));
--vibeui-solutions-008-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-solutions-008-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.74 0.13 39.8));
--vibeui-solutions-008-onaccent:oklch(0.15 0.02 39.8);
--vibeui-solutions-008-alarm:light-dark(oklch(0.58 0.19 25),oklch(0.74 0.16 25));
--vibeui-solutions-008-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-008"]{color-scheme:dark}
[data-vibeui-block="solutions-008"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-008-bg);
border:1px solid var(--vibeui-solutions-008-border);border-radius:1rem;
font-family:var(--vibeui-solutions-008-sans);color:var(--vibeui-solutions-008-fg);
}
[data-vibeui-block="solutions-008"] *{box-sizing:border-box}
[data-vibeui-block="solutions-008"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding-bottom:0.75rem;border-bottom:1px solid var(--vibeui-solutions-008-border);
}
[data-vibeui-block="solutions-008"] h2{margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="solutions-008"] [data-part="stage"]{
display:inline-flex;align-items:center;gap:0.375rem;margin:0.25rem 0 0;
font-size:0.75rem;color:var(--vibeui-solutions-008-muted);
}
[data-vibeui-block="solutions-008"] [data-part="badge"]{
padding:0.125rem 0.5rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-008-accent) 14%,transparent);
color:var(--vibeui-solutions-008-accent);font-weight:650;
}
[data-vibeui-block="solutions-008"] [data-part="amount"]{
margin:0;font-size:1.375rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.02em;
}
[data-vibeui-block="solutions-008"] [data-part="shell"]{display:grid;gap:0.875rem;margin-top:0.875rem}
@container (min-width: 46rem){
[data-vibeui-block="solutions-008"] [data-part="shell"]{grid-template-columns:1fr 1.15fr;align-items:start}
}
/* Следующий шаг стоит над историей: работу двигает «что дальше», а не «что было». */
[data-vibeui-block="solutions-008"] [data-part="next"]{
padding:0.75rem 0.875rem;border-radius:0.875rem;
border:1px solid color-mix(in oklab,var(--vibeui-solutions-008-accent) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-008-accent) 10%,transparent);
}
[data-vibeui-block="solutions-008"] [data-overdue="true"][data-part="next"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-008-alarm) 55%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-008-alarm) 10%,transparent);
}
[data-vibeui-block="solutions-008"] [data-part="next-label"]{
margin:0 0 0.25rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-008-accent);
}
[data-vibeui-block="solutions-008"] [data-overdue="true"] [data-part="next-label"]{color:var(--vibeui-solutions-008-alarm)}
[data-vibeui-block="solutions-008"] [data-part="next-title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.35}
[data-vibeui-block="solutions-008"] [data-part="next-meta"]{
margin:0.375rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-008-muted);
}
[data-vibeui-block="solutions-008"] dl{
margin:0.875rem 0 0;display:grid;grid-template-columns:auto 1fr;gap:0.375rem 0.75rem;font-size:0.8125rem;
}
[data-vibeui-block="solutions-008"] dt{color:var(--vibeui-solutions-008-muted)}
[data-vibeui-block="solutions-008"] dd{margin:0;text-align:right;font-weight:600}
[data-vibeui-block="solutions-008"] h3{
margin:0 0 0.625rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-008-muted);
}
[data-vibeui-block="solutions-008"] ol{
list-style:none;margin:0;padding:0 0 0 1.375rem;position:relative;display:grid;gap:0.75rem;
}
[data-vibeui-block="solutions-008"] ol::before{
content:"";position:absolute;left:0.4375rem;top:0.375rem;bottom:0.375rem;width:1px;
background:var(--vibeui-solutions-008-border);
}
[data-vibeui-block="solutions-008"] ol li{position:relative}
/* Тип события — буква на кружке: читается и без цвета, и на печати. */
[data-vibeui-block="solutions-008"] [data-part="kind"]{
position:absolute;left:-1.375rem;top:0.0625rem;
width:0.9375rem;height:0.9375rem;border-radius:9999px;
display:grid;place-items:center;
font-size:0.5rem;font-weight:700;line-height:1;
background:var(--vibeui-solutions-008-panel);
border:1px solid var(--vibeui-solutions-008-border);
color:var(--vibeui-solutions-008-muted);
}
[data-vibeui-block="solutions-008"] [data-kind="call"] [data-part="kind"],
[data-vibeui-block="solutions-008"] [data-kind="meeting"] [data-part="kind"]{
background:var(--vibeui-solutions-008-accent);border-color:var(--vibeui-solutions-008-accent);color:var(--vibeui-solutions-008-onaccent);
}
[data-vibeui-block="solutions-008"] [data-part="date"]{
display:block;font-size:0.6875rem;color:var(--vibeui-solutions-008-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-008"] [data-part="event"]{display:block;font-size:0.8125rem;font-weight:600;line-height:1.35}
[data-vibeui-block="solutions-008"] [data-part="detail"]{
display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-solutions-008-muted);line-height:1.45;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FIELDS: Solutions008Field[] = [
  { label: "Контакт", value: "Анна Гаврилова" },
  { label: "Источник", value: "Заявка с сайта" },
  { label: "Ответственный", value: "Марина Ковалёва" },
  { label: "Создана", value: "18 февраля" },
  { label: "Вероятность", value: "70%" },
]

const DEFAULT_EVENTS: Solutions008Event[] = [
  {
    date: "12 марта",
    title: "Отправили договор",
    detail: "Версия с правками по срокам поставки, ждём подпись.",
    kind: "mail",
  },
  {
    date: "6 марта",
    title: "Встреча с финансовым директором",
    detail: "Согласовали рассрочку на два платежа.",
    kind: "meeting",
  },
  {
    date: "28 февраля",
    title: "Звонок: уточнили объём",
    detail: "Вместо 40 точек берут 65 — сумма пересчитана.",
    kind: "call",
  },
  {
    date: "18 февраля",
    title: "Сделка создана из заявки",
    kind: "system",
  },
]

const KIND_LETTER: Record<string, string> = {
  call: "З",
  mail: "П",
  meeting: "В",
  system: "С",
}

const DEFAULT_NEXT_LABEL_TEXT: Record<string, string> = {
  normal: "Следующий шаг",
  overdue: "Следующий шаг · просрочен",
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
 * Карточка сделки: следующий шаг над историей, история — лентой событий.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions008({
  company = "Логистика «Верста»",
  stage = "Договор",
  amount = "780 000 ₽",
  nextStep = "Забрать подписанный договор и передать в бухгалтерию",
  nextDate = "Срок: 14 марта",
  nextOwner = "Марина Ковалёва",
  overdue = true,
  fields = DEFAULT_FIELDS,
  events = DEFAULT_EVENTS,
  historyTitle = "История",
  stageCaption = "этап сделки",
  nextLabelText = DEFAULT_NEXT_LABEL_TEXT,
  kindText = KIND_LETTER,
  dealLabelText = "Сделка {company}",
  accent,
  background = "",
  className,
  style,
}: Solutions008Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-008" precedence="medium">
        {STYLES}
      </style>
      <article
        data-vibeui-block="solutions-008"
        className={className}
        style={palette}
        aria-label={dealLabelText.replace("{company}", company)}
      >
        <header data-part="head">
          <div>
            <h2>{company}</h2>
            <p data-part="stage">
              <span data-part="badge">{stage}</span>
              {stageCaption}
            </p>
          </div>
          <p data-part="amount">{amount}</p>
        </header>

        <div data-part="shell">
          <div>
            <section data-part="next" data-overdue={overdue ? "true" : "false"}>
              <p data-part="next-label">
                {overdue
                  ? (nextLabelText.overdue ?? DEFAULT_NEXT_LABEL_TEXT.overdue)
                  : (nextLabelText.normal ?? DEFAULT_NEXT_LABEL_TEXT.normal)}
              </p>
              <p data-part="next-title">{nextStep}</p>
              <p data-part="next-meta">
                {nextDate} · {nextOwner}
              </p>
            </section>

            <dl>
              {fields.map((field) => [
                <dt key={`${field.label}-t`}>{field.label}</dt>,
                <dd key={`${field.label}-d`}>{field.value}</dd>,
              ])}
            </dl>
          </div>

          <section>
            <h3>{historyTitle}</h3>
            <ol>
              {events.map((event) => (
                <li key={event.date + event.title} data-kind={event.kind}>
                  <span data-part="kind" aria-hidden="true">
                    {kindText[event.kind ?? "system"] ??
                      KIND_LETTER[event.kind ?? "system"]}
                  </span>
                  <span data-part="date">{event.date}</span>
                  <span data-part="event">{event.title}</span>
                  {event.detail ? (
                    <span data-part="detail">{event.detail}</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </article>
    </>
  )
}
