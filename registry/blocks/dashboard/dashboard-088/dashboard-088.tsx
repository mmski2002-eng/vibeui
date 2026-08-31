import type { CSSProperties } from "react"

export type Dashboard088Props = {
  title?: string
  workspaceName?: string
  slug?: string
  domain?: string
  region?: string
  regions?: string[]
  locale?: string
  locales?: string[]
  joinMode?: string
  retention?: string
  saveLabel?: string
  dangerTitle?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: настройки пространства — это форма, где половина полей меняется
// раз в жизни, а цена ошибки высокая. Поэтому у каждого поля есть подпись
// последствия: адрес пространства ломает старые ссылки, регион хранения нельзя
// изменить после создания — и это сказано словом, а не спрятано в справке.
// Поля собраны в fieldset с legend, а не в div с заголовком: группировка формы
// должна быть слышна и в скринридере. Опасная зона отделена рамкой и отступом,
// а не только красным цветом, и её действия названы точно — «удалить
// пространство и все данные», потому что «удалить» звучит обратимо.
const STYLES = `
:where([data-vibeui-block="dashboard-088"]){
--vibeui-dashboard-088-bg:oklch(0.985 0.003 245);
--vibeui-dashboard-088-card:oklch(1 0 0);
--vibeui-dashboard-088-fg:oklch(0.21 0.014 245);
--vibeui-dashboard-088-muted:oklch(0.54 0.014 245);
--vibeui-dashboard-088-border:oklch(0.91 0.006 245);
--vibeui-dashboard-088-accent:oklch(0.5 0.15 245);
--vibeui-dashboard-088-soft:oklch(0.965 0.02 245);
--vibeui-dashboard-088-danger:oklch(0.55 0.19 25);
--vibeui-dashboard-088-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-088-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-088"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-088-bg);
color:var(--vibeui-dashboard-088-fg);
font-family:var(--vibeui-dashboard-088-sans);
border:1px solid var(--vibeui-dashboard-088-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-088"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-088"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-088"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-088"] fieldset{
margin:0;border:1px solid var(--vibeui-dashboard-088-border);border-radius:0.875rem;
padding:0.875rem;background:var(--vibeui-dashboard-088-card);
}
[data-vibeui-block="dashboard-088"] legend{
float:left;width:100%;clear:both;padding:0;margin-bottom:0.5rem;
font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;
color:var(--vibeui-dashboard-088-muted);
}
[data-vibeui-block="dashboard-088"] [data-part="fields"]{display:grid;grid-template-columns:1fr;gap:0.625rem}
[data-vibeui-block="dashboard-088"] [data-part="field"]{display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="dashboard-088"] [data-part="field"] > span{font-size:0.75rem;font-weight:700}
[data-vibeui-block="dashboard-088"] :is(input[type="text"],select){
font:inherit;font-size:0.8125rem;padding:0.4375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-088-bg);color:inherit;
border:1px solid var(--vibeui-dashboard-088-border);width:100%;
}
[data-vibeui-block="dashboard-088"] input:disabled{color:var(--vibeui-dashboard-088-muted);cursor:not-allowed}
[data-vibeui-block="dashboard-088"] [data-part="slug"]{display:flex;align-items:center;gap:0}
[data-vibeui-block="dashboard-088"] [data-part="prefix"]{
font-family:var(--vibeui-dashboard-088-mono);font-size:0.75rem;color:var(--vibeui-dashboard-088-muted);
padding:0.4375rem 0.4375rem 0.4375rem 0.5625rem;border-radius:0.5rem 0 0 0.5rem;
background:var(--vibeui-dashboard-088-soft);
border:1px solid var(--vibeui-dashboard-088-border);border-right:0;white-space:nowrap;
}
[data-vibeui-block="dashboard-088"] [data-part="slug"] input{border-radius:0 0.5rem 0.5rem 0;font-family:var(--vibeui-dashboard-088-mono)}
[data-vibeui-block="dashboard-088"] [data-part="hint"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-088-muted);line-height:1.4}
[data-vibeui-block="dashboard-088"] [data-part="locked"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;margin-left:0.375rem;
background:var(--vibeui-dashboard-088-soft);color:var(--vibeui-dashboard-088-muted);
}
[data-vibeui-block="dashboard-088"] [data-part="save"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;align-self:flex-start;
background:var(--vibeui-dashboard-088-accent);color:oklch(1 0 0);
}
/* Опасная зона отделена рамкой и отступом, а не только цветом. */
[data-vibeui-block="dashboard-088"] [data-part="danger"]{
margin-top:0.375rem;padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-088-card);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-088-danger) 45%,white);
border-left-width:0.25rem;
}
[data-vibeui-block="dashboard-088"] [data-part="danger"] legend{color:var(--vibeui-dashboard-088-danger)}
[data-vibeui-block="dashboard-088"] [data-part="drow"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem;
padding:0.5rem 0;border-top:1px solid var(--vibeui-dashboard-088-border);
}
[data-vibeui-block="dashboard-088"] [data-part="drow"]:first-of-type{border-top:0;padding-top:0}
[data-vibeui-block="dashboard-088"] [data-part="dtext"]{min-width:12rem;flex:1 1 14rem}
[data-vibeui-block="dashboard-088"] [data-part="dtext"] b{display:block;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-088"] [data-part="dtext"] span{display:block;font-size:0.6875rem;color:var(--vibeui-dashboard-088-muted);line-height:1.4}
[data-vibeui-block="dashboard-088"] [data-part="dbtn"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.375rem 0.8125rem;border-radius:0.5rem;background:transparent;
color:var(--vibeui-dashboard-088-danger);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-088-danger) 40%,white);
white-space:nowrap;
}
[data-vibeui-block="dashboard-088"] :is(a,button,input,select):focus-visible{
outline:2px solid var(--vibeui-dashboard-088-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="dashboard-088"] [data-part="fields"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

/**
 * Экран настроек рабочего пространства: поля в fieldset с подписью последствия
 * у каждого, неизменяемые параметры помечены и заблокированы, опасная зона
 * отделена рамкой. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard088({
  title = "Настройки пространства",
  workspaceName = "Северный лес",
  slug = "severles",
  domain = "severles.ru",
  region = "Россия, Москва",
  regions = ["Россия, Москва", "Казахстан, Алматы", "Германия, Франкфурт"],
  locale = "Русский",
  locales = ["Русский", "English", "Қазақша"],
  joinMode = "Только по приглашению",
  retention = "24 месяца",
  saveLabel = "Сохранить настройки",
  dangerTitle = "Опасная зона",
  accent,
  className,
  style,
}: Dashboard088Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-088-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-088" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-088"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <h2>{title}</h2>

          <fieldset>
            <legend>Основное</legend>
            <div data-part="fields">
              <label data-part="field">
                <span>Название пространства</span>
                <input type="text" defaultValue={workspaceName} />
                <p data-part="hint">
                  Видно всем участникам и подставляется в письма клиентам.
                </p>
              </label>

              <div data-part="field">
                <span>Адрес пространства</span>
                <span data-part="slug">
                  <span data-part="prefix">vibeui.app/</span>
                  <input
                    type="text"
                    defaultValue={slug}
                    aria-label="Адрес пространства"
                  />
                </span>
                <p data-part="hint">
                  Старые ссылки перестанут работать сразу после сохранения —
                  переадресации не будет.
                </p>
              </div>

              <label data-part="field">
                <span>Домен для писем</span>
                <input type="text" defaultValue={domain} />
                <p data-part="hint">
                  Домен подтверждён 3 марта. Смена потребует новой записи DNS.
                </p>
              </label>

              <label data-part="field">
                <span>Язык интерфейса по умолчанию</span>
                <select defaultValue={locale}>
                  {locales.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
                <p data-part="hint">
                  Новые участники получат этот язык; личный выбор сильнее.
                </p>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Данные и доступ</legend>
            <div data-part="fields">
              <label data-part="field">
                <span>
                  Регион хранения данных
                  <span data-part="locked">нельзя изменить</span>
                </span>
                <input type="text" defaultValue={region} disabled />
                <p data-part="hint">
                  Регион задаётся при создании пространства. Для переезда нужно
                  создать новое и перенести данные выгрузкой. Доступные регионы:{" "}
                  {regions.join(", ")}.
                </p>
              </label>

              <label data-part="field">
                <span>Кто может присоединиться</span>
                <select defaultValue={joinMode}>
                  <option>Только по приглашению</option>
                  <option>Любой с почтой на домене</option>
                  <option>По ссылке-приглашению</option>
                </select>
                <p data-part="hint">
                  Правило действует на новых участников, уже вошедшие сохранят
                  доступ.
                </p>
              </label>

              <label data-part="field">
                <span>Хранить историю изменений</span>
                <select defaultValue={retention}>
                  <option>6 месяцев</option>
                  <option>12 месяцев</option>
                  <option>24 месяца</option>
                  <option>Бессрочно</option>
                </select>
                <p data-part="hint">
                  Сокращение срока удаляет старые версии записей сразу и
                  необратимо.
                </p>
              </label>
            </div>
          </fieldset>

          <button type="button" data-part="save">
            {saveLabel}
          </button>

          <fieldset data-part="danger">
            <legend>{dangerTitle}</legend>

            <div data-part="drow">
              <div data-part="dtext">
                <b>Передать владение пространством</b>
                <span>
                  Вы останетесь участником с ролью администратора, но вернуть
                  владение сможет только новый владелец.
                </span>
              </div>
              <button type="button" data-part="dbtn">
                Передать владение
              </button>
            </div>

            <div data-part="drow">
              <div data-part="dtext">
                <b>Отключить всех участников</b>
                <span>
                  Сессии завершатся немедленно, данные останутся. Пригодится при
                  подозрении на утечку доступа.
                </span>
              </div>
              <button type="button" data-part="dbtn">
                Завершить все сессии
              </button>
            </div>

            <div data-part="drow">
              <div data-part="dtext">
                <b>Удалить пространство и все данные</b>
                <span>
                  Заявки, клиенты, файлы и история будут стёрты через 7 дней.
                  Всё это время удаление можно отменить, потом — нет.
                </span>
              </div>
              <button type="button" data-part="dbtn">
                Удалить пространство
              </button>
            </div>
          </fieldset>
        </div>
      </section>
    </>
  )
}
