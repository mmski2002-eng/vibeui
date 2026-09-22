import type { CSSProperties } from "react"
import { Button124 } from "@/registry/components/button/button-124/button-124"

export type Footer016Props = {
  /** Предыдущая глава. Пустой label убирает ссылку. */
  prevLabel?: string
  prevHref?: string
  /** Следующая глава. */
  nextLabel?: string
  nextHref?: string
  prevCaption?: string
  nextCaption?: string
  /** Дата последнего обновления текстом. */
  updated?: string
  feedbackLabel?: string
  yesLabel?: string
  noLabel?: string
  editLabel?: string
  editHref?: string
  /** Тихая служебная строка. Пустая строка убирает её. */
  legal?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Завершение документа или урока: предыдущая и следующая глава крупными
// карточками, дата обновления, вопрос о пользе страницы и ссылка на
// исправление. Контекстные действия живут в границах колонки чтения,
// служебная строка отдельно и заметно тише. Кнопки отзыва — демонстрация:
// обработчик и состояния подключает принимающий проект. Без JS.
const STYLES = `
:where([data-vibeui-block="footer-016"]){
--vibeui-footer-016-bg:#ffffff;
--vibeui-footer-016-ink:#000000;
--vibeui-footer-016-muted:color-mix(in oklab,#000000 56%,#ffffff);
--vibeui-footer-016-line:color-mix(in oklab,#000000 11%,transparent);
--vibeui-footer-016-panel:#f2f2f2;
--vibeui-footer-016-accent:#1a1a1a;
--vibeui-footer-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-footer-016-dur-2:180ms;
container-type:inline-size;
}
[data-vibeui-block="footer-016"]{
display:block;min-width:min(100%,16rem);
background:var(--vibeui-footer-016-bg);color:var(--vibeui-footer-016-ink);
font-family:var(--vibeui-footer-016-font);
}
[data-vibeui-block="footer-016"] *{box-sizing:border-box}
[data-vibeui-block="footer-016"] [data-part="page-link"]{min-width:0}
[data-vibeui-block="footer-016"] [data-part="shell"]{
max-width:46rem;margin:0 auto;padding:2rem 1rem 1.5rem;
display:flex;flex-direction:column;gap:1.25rem;
}
[data-vibeui-block="footer-016"] [data-part="pager"]{
display:grid;gap:0.75rem;
}
[data-vibeui-block="footer-016"] [data-part="meta"]{
display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem 1.5rem;
padding-top:1rem;border-top:1px solid var(--vibeui-footer-016-line);
font-size:0.875rem;color:var(--vibeui-footer-016-muted);
}
[data-vibeui-block="footer-016"] [data-part="feedback"]{
display:inline-flex;align-items:center;gap:0.5rem;
}
[data-vibeui-block="footer-016"] [data-part="feedback"] button{
appearance:none;cursor:pointer;font:inherit;
min-height:2rem;padding:0.125rem 0.75rem;
background:var(--vibeui-footer-016-bg);color:var(--vibeui-footer-016-ink);
border:1px solid var(--vibeui-footer-016-line);
font-size:0.8125rem;font-weight:560;
transition:border-color var(--vibeui-footer-016-dur-2) ease,color var(--vibeui-footer-016-dur-2) ease;
}
[data-vibeui-block="footer-016"] [data-part="feedback"] button:hover{
border-color:var(--vibeui-footer-016-accent);color:var(--vibeui-footer-016-accent);
}
[data-vibeui-block="footer-016"] [data-part="edit"]{
margin-left:auto;color:var(--vibeui-footer-016-muted);text-decoration:none;
border-bottom:1px solid var(--vibeui-footer-016-line);
transition:color var(--vibeui-footer-016-dur-2) ease,border-color var(--vibeui-footer-016-dur-2) ease;
}
[data-vibeui-block="footer-016"] [data-part="edit"]:hover{
color:var(--vibeui-footer-016-accent);border-color:var(--vibeui-footer-016-accent);
}
[data-vibeui-block="footer-016"] [data-part="legal"]{
background:var(--vibeui-footer-016-panel);
}
[data-vibeui-block="footer-016"] [data-part="legal"] p{
max-width:46rem;margin:0 auto;padding:0.75rem 1rem;
font-size:0.8125rem;color:var(--vibeui-footer-016-muted);
}
[data-vibeui-block="footer-016"] a:focus-visible,
[data-vibeui-block="footer-016"] button:focus-visible{
outline:2px solid var(--vibeui-footer-016-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="footer-016"] [data-part="pager"]{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="footer-016"] *{animation:none!important;transition:none!important}}
`

/** Футер документа: соседние главы, дата обновления, отзыв и правка страницы. */
export function Footer016({
  prevLabel = "Установка",
  prevHref = "#install",
  nextLabel = "Конфигурация",
  nextHref = "#config",
  prevCaption = "Назад",
  nextCaption = "Дальше",
  updated = "Обновлено 4 сентября 2026",
  feedbackLabel = "Страница помогла?",
  yesLabel = "Да",
  noLabel = "Нет",
  editLabel = "Исправить на GitHub",
  editHref = "#edit",
  legal = "© 2026 Прибор · Документация распространяется по лицензии CC BY 4.0",
  accent,
  className,
  style,
}: Footer016Props) {
  const palette = {
    ...(accent ? { "--vibeui-footer-016-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-footer-016" precedence="medium">
        {STYLES}
      </style>
      <footer data-vibeui-block="footer-016" className={className} style={palette}>
        <div data-part="shell">
          <nav data-part="pager" aria-label="Соседние главы">
            {prevLabel ? (
              <Button124 data-part="page-link" prevHref={prevHref} prevCaption={prevCaption} prevLabel={prevLabel} accent={accent} />
            ) : (
              <span aria-hidden="true" />
            )}
            {nextLabel ? (
              <Button124 data-part="page-link" prevHref={nextHref} prevCaption={nextCaption} prevLabel={nextLabel} accent={accent} />
            ) : null}
          </nav>
          <div data-part="meta">
            <span>{updated}</span>
            <span data-part="feedback">
              {feedbackLabel}
              <button type="button">{yesLabel}</button>
              <button type="button">{noLabel}</button>
            </span>
            <a data-part="edit" href={editHref}>
              {editLabel}
            </a>
          </div>
        </div>
        {legal ? (
          <div data-part="legal">
            <p>{legal}</p>
          </div>
        ) : null}
      </footer>
    </>
  )
}
