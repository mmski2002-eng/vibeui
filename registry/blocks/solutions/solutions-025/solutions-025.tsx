import type { CSSProperties } from "react"

export type Solutions025Item = {
  author: string
  authorNote: string
  posted: string
  waiting: string
  reason: string
  reports: number
  quote: string
  severity: "high" | "normal"
}

export type Solutions025Props = {
  title?: string
  queueNote?: string
  items?: Solutions025Item[]
  approveLabel?: string
  hideLabel?: string
  banLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: очередь модерации. Спорный текст показан цитатой целиком, а не
// обрезкой в одну строку: решение принимают по содержанию, и «Показать
// полностью» здесь стоит лишнего клика на каждой карточке. Время ожидания
// написано у каждой карточки — очередь, где неясно, что висит третий день,
// разъезжается сама. Причина жалобы и их количество стоят рядом: одна жалоба
// от одного человека и двенадцать от разных — разные ситуации. Решения — три
// кнопки в ряд с разным весом, безвозвратное действие визуально последнее.
const STYLES = `
:where([data-vibeui-block="solutions-025"]){
--vibeui-solutions-025-bg:oklch(1 0 0);
--vibeui-solutions-025-panel:oklch(0.975 0.004 265);
--vibeui-solutions-025-fg:oklch(0.21 0.014 265);
--vibeui-solutions-025-muted:oklch(0.54 0.014 265);
--vibeui-solutions-025-border:oklch(0.9 0.006 265);
--vibeui-solutions-025-accent:oklch(0.53 0.15 250);
--vibeui-solutions-025-ok:oklch(0.55 0.14 150);
--vibeui-solutions-025-danger:oklch(0.57 0.19 25);
--vibeui-solutions-025-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-025"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-025-bg);
border:1px solid var(--vibeui-solutions-025-border);border-radius:1rem;
font-family:var(--vibeui-solutions-025-sans);color:var(--vibeui-solutions-025-fg);
}
[data-vibeui-block="solutions-025"] *{box-sizing:border-box}
[data-vibeui-block="solutions-025"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="solutions-025"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-025"] [data-part="note"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-025-muted)}
[data-vibeui-block="solutions-025"] [data-part="list"]{display:grid;gap:0.75rem}
@container (min-width: 52rem){
[data-vibeui-block="solutions-025"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="solutions-025"] article{
display:flex;flex-direction:column;gap:0.5rem;
padding:0.75rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-solutions-025-bg);
border:1px solid var(--vibeui-solutions-025-border);
}
[data-vibeui-block="solutions-025"] [data-severity="high"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-025-danger) 45%,transparent);
}
[data-vibeui-block="solutions-025"] [data-part="top"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.375rem;
}
[data-vibeui-block="solutions-025"] [data-part="author"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="solutions-025"] [data-part="authornote"]{
display:block;font-size:0.6875rem;font-weight:400;color:var(--vibeui-solutions-025-muted);
}
/* Срок ожидания у каждой карточки: иначе очередь тихо разъезжается. */
[data-vibeui-block="solutions-025"] [data-part="waiting"]{
font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-025-muted);white-space:nowrap;
}
[data-vibeui-block="solutions-025"] [data-severity="high"] [data-part="waiting"]{color:var(--vibeui-solutions-025-danger)}
/* Цитата целиком: решение принимают по содержанию, а не по обрезку строки. */
[data-vibeui-block="solutions-025"] blockquote{
margin:0;padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-solutions-025-panel);
border-left:3px solid var(--vibeui-solutions-025-border);
font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="solutions-025"] [data-severity="high"] blockquote{
border-left-color:var(--vibeui-solutions-025-danger);
}
/* Причина и число жалоб рядом: одна жалоба и двенадцать — разные ситуации. */
[data-vibeui-block="solutions-025"] [data-part="why"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.5rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-solutions-025-muted);
}
[data-vibeui-block="solutions-025"] [data-part="reason"]{
padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-solutions-025-panel);font-weight:650;color:var(--vibeui-solutions-025-fg);
}
[data-vibeui-block="solutions-025"] [data-part="reports"]{font-variant-numeric:tabular-nums;font-weight:650}
[data-vibeui-block="solutions-025"] [data-part="actions"]{
display:flex;flex-wrap:wrap;gap:0.375rem;margin-top:auto;padding-top:0.25rem;
}
[data-vibeui-block="solutions-025"] button{
appearance:none;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:0.5rem;
font:inherit;font-size:0.75rem;font-weight:650;
border:1px solid var(--vibeui-solutions-025-border);
background:var(--vibeui-solutions-025-bg);color:var(--vibeui-solutions-025-fg);
}
[data-vibeui-block="solutions-025"] [data-action="approve"]{
background:var(--vibeui-solutions-025-ok);border-color:var(--vibeui-solutions-025-ok);color:oklch(1 0 0);
}
/* Безвозвратное действие визуально последнее и без заливки. */
[data-vibeui-block="solutions-025"] [data-action="ban"]{
margin-left:auto;color:var(--vibeui-solutions-025-danger);
border-color:color-mix(in oklab,var(--vibeui-solutions-025-danger) 45%,transparent);
}
[data-vibeui-block="solutions-025"] button:focus-visible{
outline:2px solid var(--vibeui-solutions-025-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-025"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Solutions025Item[] = [
  {
    author: "user_84120",
    authorNote: "зарегистрирован 2 дня назад · 3 публикации",
    posted: "Комментарий к статье «Складской учёт»",
    waiting: "ждёт 3 дня",
    reason: "спам",
    reports: 12,
    severity: "high",
    quote:
      "Ребята, зачем вам всё это, есть готовое решение дешевле — пишите в личку, дам ссылку и промокод, работает без всяких настроек.",
  },
  {
    author: "Марина Ковалёва",
    authorNote: "с нами 4 года · 218 публикаций",
    posted: "Отзыв о поставщике «Текстиль-Юг»",
    waiting: "ждёт 6 часов",
    reason: "оскорбление",
    reports: 1,
    severity: "normal",
    quote:
      "Третья партия подряд с браком, менеджер на звонки не отвечает. Работать с ними после такого невозможно, предупреждаю остальных.",
  },
  {
    author: "anon_5521",
    authorNote: "без подтверждённой почты · 1 публикация",
    posted: "Вопрос в разделе «Логистика»",
    waiting: "ждёт 1 день",
    reason: "персональные данные",
    reports: 4,
    severity: "high",
    quote:
      "Вот телефон их водителя, звоните напрямую, он всё возит мимо кассы: +7 900 000-00-00, зовут Сергей, работает по вторникам.",
  },
  {
    author: "Дина Соколова",
    authorNote: "с нами 1 год · 47 публикаций",
    posted: "Комментарий к обзору поставщиков",
    waiting: "ждёт 2 часа",
    reason: "реклама",
    reports: 2,
    severity: "normal",
    quote:
      "У нас в соседнем городе есть похожий сервис, могу рассказать в комментариях, если модераторы не против ссылки.",
  },
]

/**
 * Очередь модерации: цитата целиком, срок ожидания и три решения в ряд.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions025({
  title = "Очередь модерации",
  queueNote = "Сначала то, что ждёт дольше всех",
  items = DEFAULT_ITEMS,
  approveLabel = "Опубликовать",
  hideLabel = "Скрыть",
  banLabel = "Заблокировать автора",
  accent,
  className,
  style,
}: Solutions025Props) {
  const urgent = items.filter((item) => item.severity === "high").length

  const palette = {
    ...(accent ? { "--vibeui-solutions-025-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-025" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-025"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="note">{queueNote}</p>
          </div>
          <p data-part="note">
            В очереди {items.length} · срочных {urgent}
          </p>
        </header>

        <div data-part="list">
          {items.map((item) => (
            <article key={item.author} data-severity={item.severity}>
              <div data-part="top">
                <span data-part="author">
                  {item.author}
                  <span data-part="authornote">{item.authorNote}</span>
                </span>
                <span data-part="waiting">{item.waiting}</span>
              </div>

              <blockquote cite={item.posted}>{item.quote}</blockquote>

              <p data-part="why">
                <span data-part="reason">{item.reason}</span>
                <span data-part="reports">{item.reports} жалоб</span>
                <span>· {item.posted}</span>
              </p>

              <p data-part="actions">
                <button type="button" data-action="approve">
                  {approveLabel}
                </button>
                <button type="button" data-action="hide">
                  {hideLabel}
                </button>
                <button type="button" data-action="ban">
                  {banLabel}
                </button>
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
