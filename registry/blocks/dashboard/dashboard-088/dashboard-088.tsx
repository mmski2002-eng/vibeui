import type { CSSProperties } from "react"

export type Dashboard088DangerAction = {
  title: string
  note: string
  action: string
}

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
  /** Варианты режима присоединения в выпадающем списке. */
  joinModes?: string[]
  retention?: string
  /** Варианты срока хранения истории. */
  retentions?: string[]
  saveLabel?: string
  dangerTitle?: string
  /** Строки опасной зоны: заголовок, последствие и подпись кнопки. */
  dangerActions?: Dashboard088DangerAction[]
  /** Приставка перед адресом пространства. */
  slugPrefix?: string
  /** Подписи формы: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
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
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-088"]){
--vibeui-dashboard-088-bg:transparent;
/* Группа полей и само поле ввода: подложка блока остаётся прозрачной. */
--vibeui-dashboard-088-card:light-dark(oklch(1 0 0),oklch(0.26 0 245));
--vibeui-dashboard-088-inset:light-dark(oklch(0.985 0 245),oklch(0.22 0 245));
--vibeui-dashboard-088-fg:light-dark(oklch(0.21 0 245),oklch(0.94 0 245));
--vibeui-dashboard-088-muted:light-dark(oklch(0.54 0 245),oklch(0.72 0 245));
--vibeui-dashboard-088-border:light-dark(oklch(0.91 0 245),oklch(0.36 0 245));
--vibeui-dashboard-088-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.74 0.14 39.8));
--vibeui-dashboard-088-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-088-soft:light-dark(oklch(0.965 0 245),oklch(0.3 0 245));
--vibeui-dashboard-088-danger:light-dark(oklch(0.55 0.19 25),oklch(0.72 0.16 25));
--vibeui-dashboard-088-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-088-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-088"]{color-scheme:dark}
[data-vibeui-block="dashboard-088"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
/* Без clear следующий элемент садится рядом со 100%-шириным float легенды и
   схлопывается до нулевой ширины — его содержимое переполняет страницу. */
[data-vibeui-block="dashboard-088"] fieldset > *{clear:both}
[data-vibeui-block="dashboard-088"] [data-part="fields"]{display:grid;grid-template-columns:1fr;gap:0.625rem}
[data-vibeui-block="dashboard-088"] [data-part="field"]{display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="dashboard-088"] [data-part="field"] > span{font-size:0.75rem;font-weight:700}
[data-vibeui-block="dashboard-088"] :is(input[type="text"],select){
font:inherit;font-size:0.8125rem;padding:0.4375rem 0.5625rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-088-inset);color:inherit;
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
background:var(--vibeui-dashboard-088-accent);color:var(--vibeui-dashboard-088-on-accent);
}
/* Опасная зона отделена рамкой и отступом, а не только цветом. */
[data-vibeui-block="dashboard-088"] [data-part="danger"]{
margin-top:0.375rem;padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-088-card);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-088-danger) 45%,light-dark(white,black));
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
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-088-danger) 40%,light-dark(white,black));
white-space:nowrap;
}
[data-vibeui-block="dashboard-088"] :is(a,button,input,select):focus-visible{
outline:2px solid var(--vibeui-dashboard-088-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="dashboard-088"] [data-part="fields"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

const LABELS: Record<string, string> = {
  basics: "Основное",
  name: "Название пространства",
  nameHint: "Видно всем участникам и подставляется в письма клиентам.",
  address: "Адрес пространства",
  addressHint:
    "Старые ссылки перестанут работать сразу после сохранения — переадресации не будет.",
  domain: "Домен для писем",
  domainHint: "Домен подтверждён 3 марта. Смена потребует новой записи DNS.",
  locale: "Язык интерфейса по умолчанию",
  localeHint: "Новые участники получат этот язык; личный выбор сильнее.",
  access: "Данные и доступ",
  region: "Регион хранения данных",
  locked: "нельзя изменить",
  regionHint:
    "Регион задаётся при создании пространства. Для переезда нужно создать новое и перенести данные выгрузкой. Доступные регионы: {regions}.",
  join: "Кто может присоединиться",
  joinHint:
    "Правило действует на новых участников, уже вошедшие сохранят доступ.",
  retention: "Хранить историю изменений",
  retentionHint:
    "Сокращение срока удаляет старые версии записей сразу и необратимо.",
}

const JOIN_MODES = [
  "Только по приглашению",
  "Любой с почтой на домене",
  "По ссылке-приглашению",
]

const RETENTIONS = ["6 месяцев", "12 месяцев", "24 месяца", "Бессрочно"]

const DANGER_ACTIONS: Dashboard088DangerAction[] = [
  {
    title: "Передать владение пространством",
    note: "Вы останетесь участником с ролью администратора, но вернуть владение сможет только новый владелец.",
    action: "Передать владение",
  },
  {
    title: "Отключить всех участников",
    note: "Сессии завершатся немедленно, данные останутся. Пригодится при подозрении на утечку доступа.",
    action: "Завершить все сессии",
  },
  {
    title: "Удалить пространство и все данные",
    note: "Заявки, клиенты, файлы и история будут стёрты через 7 дней. Всё это время удаление можно отменить, потом — нет.",
    action: "Удалить пространство",
  },
]

/**
 * Ветка темы для заданного фона: светлая подложка не должна доставаться
 * тексту тёмной ветки light-dark().
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
  joinModes = JOIN_MODES,
  retention = "24 месяца",
  retentions = RETENTIONS,
  saveLabel = "Сохранить настройки",
  dangerTitle = "Опасная зона",
  dangerActions = DANGER_ACTIONS,
  slugPrefix = "vibeui.app/",
  labels,
  accent,
  background = "",
  className,
  style,
}: Dashboard088Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-088-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-088-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const text = { ...LABELS, ...labels }

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
            <legend>{text.basics}</legend>
            <div data-part="fields">
              <label data-part="field">
                <span>{text.name}</span>
                <input type="text" defaultValue={workspaceName} />
                <p data-part="hint">{text.nameHint}</p>
              </label>

              <div data-part="field">
                <span>{text.address}</span>
                <span data-part="slug">
                  <span data-part="prefix">{slugPrefix}</span>
                  <input
                    type="text"
                    defaultValue={slug}
                    aria-label={text.address}
                  />
                </span>
                <p data-part="hint">{text.addressHint}</p>
              </div>

              <label data-part="field">
                <span>{text.domain}</span>
                <input type="text" defaultValue={domain} />
                <p data-part="hint">{text.domainHint}</p>
              </label>

              <label data-part="field">
                <span>{text.locale}</span>
                <select defaultValue={locale}>
                  {locales.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
                <p data-part="hint">{text.localeHint}</p>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>{text.access}</legend>
            <div data-part="fields">
              <label data-part="field">
                <span>
                  {text.region}
                  <span data-part="locked">{text.locked}</span>
                </span>
                <input type="text" defaultValue={region} disabled />
                <p data-part="hint">
                  {text.regionHint.replace("{regions}", regions.join(", "))}
                </p>
              </label>

              <label data-part="field">
                <span>{text.join}</span>
                <select defaultValue={joinMode}>
                  {joinModes.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
                <p data-part="hint">{text.joinHint}</p>
              </label>

              <label data-part="field">
                <span>{text.retention}</span>
                <select defaultValue={retention}>
                  {retentions.map((entry) => (
                    <option key={entry}>{entry}</option>
                  ))}
                </select>
                <p data-part="hint">{text.retentionHint}</p>
              </label>
            </div>
          </fieldset>

          <button type="button" data-part="save">
            {saveLabel}
          </button>

          <fieldset data-part="danger">
            <legend>{dangerTitle}</legend>

            {dangerActions.map((entry) => (
              <div key={entry.title} data-part="drow">
                <div data-part="dtext">
                  <b>{entry.title}</b>
                  <span>{entry.note}</span>
                </div>
                <button type="button" data-part="dbtn">
                  {entry.action}
                </button>
              </div>
            ))}
          </fieldset>
        </div>
      </section>
    </>
  )
}
