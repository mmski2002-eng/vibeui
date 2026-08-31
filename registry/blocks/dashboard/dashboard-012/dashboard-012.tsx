import type { CSSProperties } from "react"

export type Dashboard012Error = {
  field: string
  text: string
}

export type Dashboard012Props = {
  title?: string
  hint?: string
  errors?: Dashboard012Error[]
  errorsTitle?: string
  submitLabel?: string
  cancelLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: форма с разбором ошибок сверху. Список ошибок — ссылки на поля,
// а не просто красный текст: в длинной форме до сломанного поля ещё надо
// доскроллить. Список объявлен role="alert", поэтому он читается сразу после
// неудачной отправки. Ошибка повторена у самого поля, потому что к моменту
// исправления шапка уже уехала вверх. Обязательность подписана словом, а не
// одной звёздочкой, и поля помечены aria-invalid, а не только красной рамкой.
const STYLES = `
:where([data-vibeui-block="dashboard-012"]){
--vibeui-dashboard-012-bg:oklch(1 0 0);
--vibeui-dashboard-012-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-012-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-012-border:oklch(0.91 0.006 265);
--vibeui-dashboard-012-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-012-danger:oklch(0.55 0.19 25);
--vibeui-dashboard-012-danger-bg:oklch(0.55 0.19 25 / 8%);
--vibeui-dashboard-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-012"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-dashboard-012-bg);
border:1px solid var(--vibeui-dashboard-012-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-012-sans);color:var(--vibeui-dashboard-012-fg);
}
[data-vibeui-block="dashboard-012"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-012"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-012"] [data-part="hint"]{margin:0 0 0.875rem;font-size:0.75rem;color:var(--vibeui-dashboard-012-muted)}
/* Ошибки списком ссылок: в длинной форме до поля ещё надо доскроллить. */
[data-vibeui-block="dashboard-012"] [data-part="errors"]{
margin:0 0 0.875rem;padding:0.75rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-dashboard-012-danger-bg);
border:1px solid var(--vibeui-dashboard-012-danger);
}
[data-vibeui-block="dashboard-012"] [data-part="etitle"]{
display:flex;align-items:center;gap:0.375rem;margin:0 0 0.375rem;
font-size:0.8125rem;font-weight:650;color:var(--vibeui-dashboard-012-danger);
}
[data-vibeui-block="dashboard-012"] [data-part="emark"]{
display:inline-flex;align-items:center;justify-content:center;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-dashboard-012-danger);color:oklch(1 0 0);
font-size:0.625rem;font-weight:700;line-height:1;
}
[data-vibeui-block="dashboard-012"] [data-part="errors"] ul{margin:0;padding-left:1.375rem;font-size:0.75rem;line-height:1.6}
[data-vibeui-block="dashboard-012"] [data-part="errors"] a{color:var(--vibeui-dashboard-012-danger)}
[data-vibeui-block="dashboard-012"] fieldset{margin:0 0 0.875rem;padding:0;border:0}
[data-vibeui-block="dashboard-012"] legend{padding:0;margin-bottom:0.5rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="dashboard-012"] [data-part="fields"]{display:grid;grid-template-columns:1fr;gap:0.625rem}
@container (min-width: 34rem){[data-vibeui-block="dashboard-012"] [data-part="fields"]{grid-template-columns:1fr 1fr}}
[data-vibeui-block="dashboard-012"] [data-part="field"]{display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-block="dashboard-012"] label{display:flex;gap:0.25rem;font-size:0.75rem;font-weight:600}
/* Обязательность словом, а не одной звёздочкой. */
[data-vibeui-block="dashboard-012"] [data-part="req"]{font-weight:400;color:var(--vibeui-dashboard-012-muted)}
[data-vibeui-block="dashboard-012"] input,
[data-vibeui-block="dashboard-012"] textarea{
width:100%;padding:0.5rem 0.625rem;
border:1px solid var(--vibeui-dashboard-012-border);border-radius:0.5rem;
background:var(--vibeui-dashboard-012-bg);color:inherit;
font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-012"] textarea{min-height:4.5rem;resize:vertical}
[data-vibeui-block="dashboard-012"] input:focus-visible,
[data-vibeui-block="dashboard-012"] textarea:focus-visible{outline:2px solid var(--vibeui-dashboard-012-accent);outline-offset:1px}
[data-vibeui-block="dashboard-012"] [aria-invalid="true"]{border-color:var(--vibeui-dashboard-012-danger)}
[data-vibeui-block="dashboard-012"] [aria-invalid="true"]:focus-visible{outline-color:var(--vibeui-dashboard-012-danger)}
[data-vibeui-block="dashboard-012"] [data-part="note"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-012-muted)}
/* Ошибка повторена у поля: к моменту исправления шапка уже уехала вверх. */
[data-vibeui-block="dashboard-012"] [data-part="fielderror"]{
display:flex;align-items:flex-start;gap:0.3125rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-dashboard-012-danger);
}
[data-vibeui-block="dashboard-012"] [data-wide="true"]{grid-column:1 / -1}
[data-vibeui-block="dashboard-012"] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem}
[data-vibeui-block="dashboard-012"] button{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-012"] [data-part="save"]{border:0;background:var(--vibeui-dashboard-012-accent);color:oklch(1 0 0)}
[data-vibeui-block="dashboard-012"] [data-part="cancel"]{
border:1px solid var(--vibeui-dashboard-012-border);background:none;color:inherit;
}
[data-vibeui-block="dashboard-012"] button:focus-visible{outline:2px solid var(--vibeui-dashboard-012-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ERRORS: Dashboard012Error[] = [
  { field: "email", text: "Почта без «@» — проверьте написание" },
  { field: "domain", text: "Адрес занят другим проектом" },
]

/**
 * Форма с разбором ошибок: список ссылок на поля и повтор ошибки у поля.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard012({
  title = "Данные организации",
  hint = "Эти данные попадают в счета и письма клиентам.",
  errors = DEFAULT_ERRORS,
  errorsTitle = "Не удалось сохранить",
  submitLabel = "Сохранить",
  cancelLabel = "Отменить",
  accent,
  className,
  style,
}: Dashboard012Props) {
  const errorOf = (field: string) =>
    errors.find((error) => error.field === field)?.text

  const palette = {
    ...(accent ? { "--vibeui-dashboard-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-012"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="hint">{hint}</p>

        {errors.length > 0 ? (
          <div data-part="errors" role="alert">
            <p data-part="etitle">
              <span data-part="emark" aria-hidden="true">
                !
              </span>
              {errorsTitle}: {errors.length}
            </p>
            <ul>
              {errors.map((error) => (
                <li key={error.field}>
                  <a href={`#vibeui-dashboard-012-${error.field}`}>
                    {error.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <form>
          <fieldset>
            <legend>Реквизиты</legend>
            <div data-part="fields">
              <div data-part="field">
                <label htmlFor="vibeui-dashboard-012-name">
                  Название
                  <span data-part="req">· обязательно</span>
                </label>
                <input
                  id="vibeui-dashboard-012-name"
                  type="text"
                  defaultValue="ООО «Полёт»"
                  required
                />
              </div>

              <div data-part="field">
                <label htmlFor="vibeui-dashboard-012-email">
                  Почта для счетов
                  <span data-part="req">· обязательно</span>
                </label>
                <input
                  id="vibeui-dashboard-012-email"
                  type="text"
                  defaultValue="buh@polet"
                  required
                  aria-invalid={errorOf("email") ? true : undefined}
                  aria-describedby={
                    errorOf("email")
                      ? "vibeui-dashboard-012-email-error"
                      : undefined
                  }
                />
                {errorOf("email") ? (
                  <p
                    id="vibeui-dashboard-012-email-error"
                    data-part="fielderror"
                  >
                    {errorOf("email")}
                  </p>
                ) : null}
              </div>

              <div data-part="field">
                <label htmlFor="vibeui-dashboard-012-domain">
                  Адрес проекта
                </label>
                <input
                  id="vibeui-dashboard-012-domain"
                  type="text"
                  defaultValue="polet"
                  aria-invalid={errorOf("domain") ? true : undefined}
                  aria-describedby={
                    errorOf("domain")
                      ? "vibeui-dashboard-012-domain-error"
                      : undefined
                  }
                />
                {errorOf("domain") ? (
                  <p
                    id="vibeui-dashboard-012-domain-error"
                    data-part="fielderror"
                  >
                    {errorOf("domain")}
                  </p>
                ) : null}
              </div>

              <div data-part="field">
                <label htmlFor="vibeui-dashboard-012-phone">Телефон</label>
                <input
                  id="vibeui-dashboard-012-phone"
                  type="text"
                  defaultValue="+7 999 123-45-67"
                />
                <p data-part="note">Виден только участникам проекта.</p>
              </div>

              <div data-part="field" data-wide="true">
                <label htmlFor="vibeui-dashboard-012-about">Описание</label>
                <textarea
                  id="vibeui-dashboard-012-about"
                  defaultValue="Студия предметного дизайна: свет, мебель и малые серии."
                />
              </div>
            </div>
          </fieldset>

          <div data-part="actions">
            <button type="reset" data-part="cancel">
              {cancelLabel}
            </button>
            <button type="submit" data-part="save">
              {submitLabel}
            </button>
          </div>
        </form>
      </section>
    </>
  )
}
