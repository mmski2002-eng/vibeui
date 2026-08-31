import type { CSSProperties } from "react"

export type Dashboard003Toggle = {
  label: string
  hint: string
  on?: boolean
}

export type Dashboard003Props = {
  title?: string
  hint?: string
  sections?: string[]
  activeSection?: string
  projectName?: string
  projectSlug?: string
  toggles?: Dashboard003Toggle[]
  dangerTitle?: string
  dangerText?: string
  dangerAction?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: страница настроек с оглавлением слева и формой справа. Каждая
// группа настроек — fieldset с legend, поэтому скринридер объявляет раздел
// перед полями; легенда прижата float, иначе она садится на рамку и режется.
// Опасная зона отделена не только цветом: у неё своя рамка, свой заголовок и
// действие вторичной кнопкой — красная кнопка рядом с «Сохранить» слишком
// легко нажимается по инерции.
const STYLES = `
:where([data-vibeui-block="dashboard-003"]){
--vibeui-dashboard-003-bg:oklch(0.985 0.002 265);
--vibeui-dashboard-003-card:oklch(1 0 0);
--vibeui-dashboard-003-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-003-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-003-border:oklch(0.91 0.006 265);
--vibeui-dashboard-003-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-dashboard-003-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-003-danger:oklch(0.56 0.19 25);
--vibeui-dashboard-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-003"]{
box-sizing:border-box;padding:1.25rem;
background:var(--vibeui-dashboard-003-bg);
font-family:var(--vibeui-dashboard-003-sans);color:var(--vibeui-dashboard-003-fg);
}
[data-vibeui-block="dashboard-003"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-003"] h2{margin:0 0 0.25rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-003"] [data-part="lead"]{margin:0 0 1rem;font-size:0.8125rem;color:var(--vibeui-dashboard-003-muted)}
[data-vibeui-block="dashboard-003"] [data-part="layout"]{display:grid;grid-template-columns:1fr;gap:1rem}
/* min-width:0 у колонок: иначе длинная подпись растягивает грид за края. */
[data-vibeui-block="dashboard-003"] [data-part="layout"] > *{min-width:0}
[data-vibeui-block="dashboard-003"] fieldset{min-width:0}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-003"] [data-part="layout"]{grid-template-columns:11rem 1fr}
[data-vibeui-block="dashboard-003"] [data-part="toc"]{position:sticky;top:0;align-self:start}
}
[data-vibeui-block="dashboard-003"] [data-part="toc"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="dashboard-003"] [data-part="tab"]{
min-height:2rem;padding:0 0.625rem;border-radius:0.5rem;
display:flex;align-items:center;
color:var(--vibeui-dashboard-003-muted);text-decoration:none;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-003"] [data-part="tab"]:hover{background:var(--vibeui-dashboard-003-hover)}
[data-vibeui-block="dashboard-003"] [data-part="tab"]:focus-visible{outline:2px solid var(--vibeui-dashboard-003-accent);outline-offset:-2px}
[data-vibeui-block="dashboard-003"] [data-part="tab"][aria-current="page"]{
background:var(--vibeui-dashboard-003-card);color:var(--vibeui-dashboard-003-fg);font-weight:650;
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-003-border);
}
[data-vibeui-block="dashboard-003"] [data-part="form"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-003"] fieldset{
margin:0;padding:0.875rem 1rem 1rem;
background:var(--vibeui-dashboard-003-card);
border:1px solid var(--vibeui-dashboard-003-border);border-radius:0.875rem;
}
/* float у легенды: без него она садится на рамку fieldset и обрезается. */
[data-vibeui-block="dashboard-003"] legend{
float:left;width:100%;padding:0;margin-bottom:0.75rem;
font-size:0.875rem;font-weight:650;
}
/* clear у полей: flex-контейнер иначе обтекает легенду и схлопывается в нить. */
[data-vibeui-block="dashboard-003"] fieldset > *{clear:both}
[data-vibeui-block="dashboard-003"] [data-part="field"]{display:flex;flex-direction:column;gap:0.3125rem;margin-bottom:0.75rem}
[data-vibeui-block="dashboard-003"] [data-part="field"]:last-of-type{margin-bottom:0}
[data-vibeui-block="dashboard-003"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="dashboard-003"] input[type="text"]{
width:100%;height:2.375rem;padding:0 0.75rem;
background:var(--vibeui-dashboard-003-card);color:inherit;
border:1px solid var(--vibeui-dashboard-003-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="dashboard-003"] input[type="text"]:focus-visible{outline:2px solid var(--vibeui-dashboard-003-accent);outline-offset:1px}
[data-vibeui-block="dashboard-003"] [data-part="note"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-003-muted)}
[data-vibeui-block="dashboard-003"] [data-part="switch"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;
padding:0.625rem 0;border-top:1px solid var(--vibeui-dashboard-003-border);
}
[data-vibeui-block="dashboard-003"] [data-part="switch"] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="dashboard-003"] [data-part="switch"] [data-part="hint"]{font-size:0.75rem;font-weight:400;color:var(--vibeui-dashboard-003-muted)}
/* Переключатель на чекбоксе: состояние и клавиатура достаются от браузера. */
[data-vibeui-block="dashboard-003"] input[type="checkbox"]{
appearance:none;flex:none;position:relative;cursor:pointer;
width:2.25rem;height:1.25rem;border-radius:9999px;
background:var(--vibeui-dashboard-003-border);
transition:background-color .16s ease;
}
[data-vibeui-block="dashboard-003"] input[type="checkbox"]::after{
content:"";position:absolute;top:0.1875rem;left:0.1875rem;
width:0.875rem;height:0.875rem;border-radius:9999px;background:var(--vibeui-dashboard-003-card);
transition:transform .16s ease;
}
[data-vibeui-block="dashboard-003"] input[type="checkbox"]:checked{background:var(--vibeui-dashboard-003-accent)}
[data-vibeui-block="dashboard-003"] input[type="checkbox"]:checked::after{transform:translateX(1rem)}
[data-vibeui-block="dashboard-003"] input[type="checkbox"]:focus-visible{outline:2px solid var(--vibeui-dashboard-003-accent);outline-offset:2px}
[data-vibeui-block="dashboard-003"] [data-part="actions"]{display:flex;gap:0.5rem;justify-content:flex-end}
[data-vibeui-block="dashboard-003"] button{
appearance:none;cursor:pointer;height:2.25rem;padding:0 0.875rem;
border-radius:0.625rem;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-003"] [data-part="save"]{
border:0;background:var(--vibeui-dashboard-003-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-003"] [data-part="reset"]{
border:1px solid var(--vibeui-dashboard-003-border);
background:var(--vibeui-dashboard-003-card);color:inherit;
}
[data-vibeui-block="dashboard-003"] button:focus-visible{outline:2px solid var(--vibeui-dashboard-003-accent);outline-offset:2px}
/* Опасная зона отделена рамкой и заголовком, а не одним красным цветом. */
[data-vibeui-block="dashboard-003"] [data-part="danger"]{
padding:0.875rem 1rem;
border:1px solid var(--vibeui-dashboard-003-danger);border-radius:0.875rem;
background:var(--vibeui-dashboard-003-card);
}
[data-vibeui-block="dashboard-003"] [data-part="danger"] h3{margin:0 0 0.25rem;font-size:0.875rem;font-weight:650;color:var(--vibeui-dashboard-003-danger)}
[data-vibeui-block="dashboard-003"] [data-part="danger"] p{margin:0 0 0.75rem;font-size:0.75rem;line-height:1.5;color:var(--vibeui-dashboard-003-muted)}
[data-vibeui-block="dashboard-003"] [data-part="danger"] button{
border:1px solid var(--vibeui-dashboard-003-danger);
background:none;color:var(--vibeui-dashboard-003-danger);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS = ["Общие", "Доступ", "Уведомления", "Оплата"]

const DEFAULT_TOGGLES: Dashboard003Toggle[] = [
  {
    label: "Письма об ошибках установки",
    hint: "Приходят раз в сутки, только если ошибки были.",
    on: true,
  },
  {
    label: "Еженедельная сводка",
    hint: "Установки, новые участники и расход ключей за неделю.",
    on: true,
  },
  {
    label: "Новости продукта",
    hint: "Редкие письма о крупных обновлениях каталога.",
    on: false,
  },
]

/**
 * Страница настроек: оглавление, группы полей и отделённая опасная зона.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard003({
  title = "Настройки проекта",
  hint = "Изменения применяются сразу после сохранения.",
  sections = DEFAULT_SECTIONS,
  activeSection = "Общие",
  projectName = "Каталог VibeUI",
  projectSlug = "vibeui-catalog",
  toggles = DEFAULT_TOGGLES,
  dangerTitle = "Удаление проекта",
  dangerText = "Каталог, ключи доступа и история установок будут удалены безвозвратно. Действие нельзя отменить.",
  dangerAction = "Удалить проект",
  accent,
  className,
  style,
}: Dashboard003Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-003"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="lead">{hint}</p>

        <div data-part="layout">
          <nav data-part="toc" aria-label="Разделы настроек">
            {sections.map((section) => (
              <a
                key={section}
                data-part="tab"
                href="#"
                aria-current={section === activeSection ? "page" : undefined}
              >
                {section}
              </a>
            ))}
          </nav>

          <form data-part="form">
            <fieldset>
              <legend>Проект</legend>
              <div data-part="field">
                <label htmlFor="vibeui-dashboard-003-name">Название</label>
                <input
                  id="vibeui-dashboard-003-name"
                  type="text"
                  defaultValue={projectName}
                />
              </div>
              <div data-part="field">
                <label htmlFor="vibeui-dashboard-003-slug">Адрес</label>
                <input
                  id="vibeui-dashboard-003-slug"
                  type="text"
                  defaultValue={projectSlug}
                  aria-describedby="vibeui-dashboard-003-slug-note"
                />
                <p id="vibeui-dashboard-003-slug-note" data-part="note">
                  Адрес входит в ссылки установки: старые ссылки перестанут
                  работать.
                </p>
              </div>
            </fieldset>

            <fieldset>
              <legend>Уведомления</legend>
              {toggles.map((toggle) => (
                <label key={toggle.label} data-part="switch">
                  <span data-part="text">
                    <span>{toggle.label}</span>
                    <span data-part="hint">{toggle.hint}</span>
                  </span>
                  <input type="checkbox" defaultChecked={toggle.on} />
                </label>
              ))}
            </fieldset>

            <div data-part="actions">
              <button type="reset" data-part="reset">
                Отменить
              </button>
              <button type="submit" data-part="save">
                Сохранить
              </button>
            </div>

            <div data-part="danger">
              <h3>{dangerTitle}</h3>
              <p>{dangerText}</p>
              <button type="button">{dangerAction}</button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
