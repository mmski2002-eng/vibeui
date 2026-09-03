import type { CSSProperties } from "react"

export type Dashboard075Template = {
  name: string
  subject: string
  preview: string
  locale: string
  status: "live" | "draft" | "archived"
  usedIn: string
  vars: string[]
  opens?: string
}

export type Dashboard075Props = {
  title?: string
  subtitle?: string
  templates?: Dashboard075Template[]
  newLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Статусы по ключам live, draft и archived. */
  statusText?: Record<string, string>
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: шаблон письма узнают по теме и первой строке, а не по служебному
// имени. Поэтому карточка показывает конверт: тему крупно, превью-строку под
// ней — ровно то, что увидит человек в почтовом клиенте. Переменные вынесены
// чипами: незакрытая переменная в теме — самая частая авария рассылки, и её
// надо видеть до отправки. Статус написан словом, а язык — отдельной меткой:
// у одного письма бывает три языковые версии, и путать их нельзя. Строка «где
// используется» показывает, что шаблон нельзя просто удалить.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-075"]){
--vibeui-dashboard-075-bg:transparent;
/* Карточка шаблона и плашка конверта: подложка самого блока прозрачна. */
--vibeui-dashboard-075-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 60));
--vibeui-dashboard-075-inset:light-dark(oklch(0.985 0.003 60),oklch(0.22 0.012 60));
--vibeui-dashboard-075-fg:light-dark(oklch(0.21 0.014 60),oklch(0.94 0.005 60));
--vibeui-dashboard-075-muted:light-dark(oklch(0.54 0.014 60),oklch(0.72 0.012 60));
--vibeui-dashboard-075-border:light-dark(oklch(0.91 0.006 60),oklch(0.36 0.012 60));
--vibeui-dashboard-075-accent:light-dark(oklch(0.54 0.14 45),oklch(0.76 0.13 45));
--vibeui-dashboard-075-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 45));
--vibeui-dashboard-075-soft:light-dark(oklch(0.965 0.02 45),oklch(0.3 0.035 45));
--vibeui-dashboard-075-live:light-dark(oklch(0.5 0.13 155),oklch(0.79 0.13 155));
--vibeui-dashboard-075-live-bg:light-dark(oklch(0.95 0.03 155),oklch(0.31 0.05 155));
--vibeui-dashboard-075-draft:light-dark(oklch(0.52 0.11 72),oklch(0.83 0.13 72));
--vibeui-dashboard-075-draft-bg:light-dark(oklch(0.95 0.04 72),oklch(0.31 0.05 72));
--vibeui-dashboard-075-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-075-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-075"]{color-scheme:dark}
[data-vibeui-block="dashboard-075"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-075-bg);
color:var(--vibeui-dashboard-075-fg);
font-family:var(--vibeui-dashboard-075-sans);
border:1px solid var(--vibeui-dashboard-075-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-075"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-075"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-075"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-075"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-075"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-075-muted);max-width:50ch}
[data-vibeui-block="dashboard-075"] [data-part="new"]{
margin-left:auto;appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.4375rem 0.875rem;border-radius:0.5625rem;
background:var(--vibeui-dashboard-075-accent);color:var(--vibeui-dashboard-075-on-accent);
}
[data-vibeui-block="dashboard-075"] [data-part="grid"]{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0.5rem}
[data-vibeui-block="dashboard-075"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.4375rem;padding:0.75rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-075-card);border:1px solid var(--vibeui-dashboard-075-border);
}
[data-vibeui-block="dashboard-075"] [data-part="card"][data-status="archived"]{opacity:0.62}
/* Конверт: то, что человек увидит во «Входящих». */
[data-vibeui-block="dashboard-075"] [data-part="envelope"]{
padding:0.5625rem 0.6875rem;border-radius:0.6875rem;
background:var(--vibeui-dashboard-075-inset);
border:1px solid var(--vibeui-dashboard-075-border);
border-left:0.1875rem solid var(--vibeui-dashboard-075-accent);
}
[data-vibeui-block="dashboard-075"] [data-part="subject"]{
margin:0;font-size:0.8125rem;font-weight:750;line-height:1.35;
}
[data-vibeui-block="dashboard-075"] [data-part="preview"]{
margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-075-muted);line-height:1.4;
display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
[data-vibeui-block="dashboard-075"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.3125rem 0.5rem}
[data-vibeui-block="dashboard-075"] h3{margin:0;font-size:0.75rem;font-weight:750;color:var(--vibeui-dashboard-075-muted)}
[data-vibeui-block="dashboard-075"] [data-part="status"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.375rem;border-radius:0.25rem;background:var(--vibeui-dashboard-075-soft);
}
[data-vibeui-block="dashboard-075"] [data-status="live"] [data-part="status"]{
color:var(--vibeui-dashboard-075-live);
background:var(--vibeui-dashboard-075-live-bg);
}
[data-vibeui-block="dashboard-075"] [data-status="draft"] [data-part="status"]{
color:var(--vibeui-dashboard-075-draft);
background:var(--vibeui-dashboard-075-draft-bg);
}
[data-vibeui-block="dashboard-075"] [data-part="locale"]{
margin-left:auto;font-family:var(--vibeui-dashboard-075-mono);font-size:0.625rem;font-weight:700;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-dashboard-075-border);color:var(--vibeui-dashboard-075-muted);
}
[data-vibeui-block="dashboard-075"] [data-part="vars"]{
margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:0.25rem;
}
[data-vibeui-block="dashboard-075"] [data-part="vars"] li{
font-family:var(--vibeui-dashboard-075-mono);font-size:0.625rem;
padding:0.0625rem 0.3125rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-075-soft);color:color-mix(in oklab,var(--vibeui-dashboard-075-accent) 85%,light-dark(black,white));
}
[data-vibeui-block="dashboard-075"] [data-part="foot"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-075-muted);
display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;
}
[data-vibeui-block="dashboard-075"] [data-part="foot"] b{color:var(--vibeui-dashboard-075-fg);font-weight:700}
[data-vibeui-block="dashboard-075"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-075-accent);outline-offset:2px;
}
@container (min-width: 40rem){
[data-vibeui-block="dashboard-075"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container (min-width: 62rem){
[data-vibeui-block="dashboard-075"] [data-part="grid"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
`

const DEFAULT_TEMPLATES: Dashboard075Template[] = [
  {
    name: "Приветствие после регистрации",
    subject: "Ирина, ваше рабочее пространство готово",
    preview:
      "Мы создали пространство «Северный лес». Первым делом пригласите коллег — вдвоём в системе разбираться вдвое быстрее.",
    locale: "ru-RU",
    status: "live",
    usedIn: "сценарий «Приветствие новому клиенту»",
    vars: ["{{имя}}", "{{пространство}}", "{{ссылка_входа}}"],
    opens: "открываемость 62 %",
  },
  {
    name: "Напоминание об оплате",
    subject: "Подписка «Команда» продлится 28 июня",
    preview:
      "Спишем 14 900 ₽ с карты •••• 4417. Если реквизиты изменились, обновите их заранее — за три дня до списания.",
    locale: "ru-RU",
    status: "live",
    usedIn: "биллинг, за 7 дней до списания",
    vars: ["{{сумма}}", "{{дата}}", "{{карта}}"],
    opens: "открываемость 71 %",
  },
  {
    name: "Возврат уходящих, письмо 1",
    subject: "Вас не было три недели — всё в порядке?",
    preview:
      "За это время мы добавили сохранённые представления и массовое тегирование. Загляните: настройка займёт пару минут.",
    locale: "ru-RU",
    status: "draft",
    usedIn: "черновик: сценарий «Возврат» пока выключен",
    vars: ["{{имя}}", "{{последний_вход}}"],
  },
  {
    name: "Welcome after signup",
    subject: "Irina, your workspace is ready",
    preview:
      "We created the “Severny Les” workspace. Invite your teammates first — everything is faster with two pairs of hands.",
    locale: "en-US",
    status: "live",
    usedIn: "сценарий «Приветствие», англоязычные пространства",
    vars: ["{{name}}", "{{workspace}}", "{{login_url}}"],
    opens: "открываемость 58 %",
  },
  {
    name: "Приглашение на вебинар 22 мая",
    subject: "Вебинар «Импорт без боли» — завтра в 11:00",
    preview:
      "Покажем сопоставление колонок, правила валидации и разбор типичных ошибок импорта. Запись пришлём всем зарегистрированным.",
    locale: "ru-RU",
    status: "archived",
    usedIn: "разовая рассылка, завершена",
    vars: ["{{имя}}", "{{ссылка}}"],
  },
  {
    name: "Сброс пароля",
    subject: "Ссылка для смены пароля действует 30 минут",
    preview:
      "Если вы не запрашивали смену пароля, просто удалите это письмо — с аккаунтом ничего не произойдёт.",
    locale: "ru-RU",
    status: "live",
    usedIn: "системное письмо, отключить нельзя",
    vars: ["{{ссылка}}", "{{срок}}"],
    opens: "открываемость 88 %",
  },
]

const STATUS_TEXT: Record<string, string> = {
  live: "работает",
  draft: "черновик",
  archived: "в архиве",
}

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
 * Страница шаблонов писем: карточка показывает конверт — тему и превью-строку
 * так, как их увидит получатель, — плюс переменные чипами, язык и место
 * использования. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard075({
  title = "Шаблоны писем",
  subtitle = "Превью показывает первые строки письма так, как их покажет почтовый клиент.",
  templates = DEFAULT_TEMPLATES,
  newLabel = "Новый шаблон",
  accent,
  background = "",
  statusText = STATUS_TEXT,
  className,
  style,
}: Dashboard075Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-075-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-075-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const statuses = { ...STATUS_TEXT, ...statusText }

  return (
    <>
      <style href="vibeui-dashboard-075" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-075"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
            <button type="button" data-part="new">
              {newLabel}
            </button>
          </div>

          <ul data-part="grid">
            {templates.map((template) => (
              <li
                key={`${template.name}-${template.locale}`}
                data-part="card"
                data-status={template.status}
              >
                <div data-part="top">
                  <h3>{template.name}</h3>
                  <span data-part="status">{statuses[template.status]}</span>
                  <span data-part="locale">{template.locale}</span>
                </div>

                <div data-part="envelope">
                  <p data-part="subject">{template.subject}</p>
                  <p data-part="preview">{template.preview}</p>
                </div>

                <ul data-part="vars">
                  {template.vars.map((variable) => (
                    <li key={variable}>{variable}</li>
                  ))}
                </ul>

                <p data-part="foot">
                  <span>{template.usedIn}</span>
                  {template.opens ? <b>{template.opens}</b> : null}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
