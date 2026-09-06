import type { CSSProperties } from "react"

export type Dashboard091Version = {
  label: string
  date: string
  note: string
}

export type Dashboard091Document = {
  name: string
  kind: string
  version: string
  effective: string
  accepted: number
  required: boolean
  state: "active" | "draft" | "retired"
  history: Dashboard091Version[]
  open?: boolean
}

export type Dashboard091Props = {
  title?: string
  subtitle?: string
  documents?: Dashboard091Document[]
  /** Подписи карточки документа: компонент несёт русские. */
  labels?: Record<string, string>
  /** Ссылки под документом. */
  links?: string[]
  /** Локаль для разрядов числа непринявших. */
  numberLocale?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: юридический документ живёт версиями, и на этом экране важнее
// всего две вещи — какая версия действует сейчас и сколько людей её приняли.
// Поэтому доля принятия показана полосой и дробью, а не одним процентом: 96 %
// звучит хорошо ровно до момента, когда выясняется, что оставшиеся 4 % — это
// 2 700 человек. История версий свёрнута в details прямо под документом: она
// нужна редко, но искать её в другом разделе невозможно. Документ, принятие
// которого обязательно, помечен отдельно — от этого зависит, блокировать ли
// вход. Черновик стоит в том же списке, но без даты вступления.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-091"]){
--vibeui-dashboard-091-bg:transparent;
/* Карточка документа, жёлоб полосы и список версий: блок прозрачен. */
--vibeui-dashboard-091-card:light-dark(oklch(1 0 0),oklch(0.26 0 250));
--vibeui-dashboard-091-inset:light-dark(oklch(0.985 0 250),oklch(0.22 0 250));
--vibeui-dashboard-091-fg:light-dark(oklch(0.21 0 250),oklch(0.94 0 250));
--vibeui-dashboard-091-muted:light-dark(oklch(0.54 0 250),oklch(0.72 0 250));
--vibeui-dashboard-091-border:light-dark(oklch(0.91 0 250),oklch(0.36 0 250));
--vibeui-dashboard-091-accent:light-dark(oklch(0.46 0.13 250),oklch(0.74 0.13 250));
--vibeui-dashboard-091-soft:light-dark(oklch(0.965 0 250),oklch(0.3 0 250));
--vibeui-dashboard-091-gap:light-dark(oklch(0.62 0.16 45),oklch(0.76 0.14 45));
--vibeui-dashboard-091-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-091-serif:ui-serif,Georgia,"Times New Roman",serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-091"]{color-scheme:dark}
[data-vibeui-block="dashboard-091"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-091-bg);
color:var(--vibeui-dashboard-091-fg);
font-family:var(--vibeui-dashboard-091-sans);
border:1px solid var(--vibeui-dashboard-091-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-091"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-091"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-091"] h2{margin:0;font-family:var(--vibeui-dashboard-091-serif);font-size:1.1875rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="dashboard-091"] [data-part="sub"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-091-muted);max-width:64ch}
[data-vibeui-block="dashboard-091"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-091"] [data-part="doc"]{
display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.875rem;align-items:start;
padding:0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-091-card);border:1px solid var(--vibeui-dashboard-091-border);
}
[data-vibeui-block="dashboard-091"] [data-state="retired"]{opacity:0.62}
[data-vibeui-block="dashboard-091"] [data-part="name"]{display:flex;flex-direction:column;gap:0.125rem;min-width:0}
[data-vibeui-block="dashboard-091"] [data-part="name"] b{font-family:var(--vibeui-dashboard-091-serif);font-size:0.9375rem;font-weight:700}
[data-vibeui-block="dashboard-091"] [data-part="tags"]{display:flex;flex-wrap:wrap;gap:0.25rem;align-items:center}
[data-vibeui-block="dashboard-091"] [data-part="tag"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.375rem;border-radius:0.25rem;
background:var(--vibeui-dashboard-091-soft);color:var(--vibeui-dashboard-091-accent);
}
[data-vibeui-block="dashboard-091"] [data-part="tag"][data-req="true"]{
background:color-mix(in oklab,var(--vibeui-dashboard-091-gap) 16%,light-dark(white,black));
color:color-mix(in oklab,var(--vibeui-dashboard-091-gap) 80%,light-dark(black,white));
}
[data-vibeui-block="dashboard-091"] [data-part="ver"]{
text-align:right;white-space:nowrap;display:flex;flex-direction:column;gap:0.0625rem;
}
[data-vibeui-block="dashboard-091"] [data-part="ver"] b{font-size:0.8125rem;font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-091"] [data-part="ver"] span{font-size:0.625rem;color:var(--vibeui-dashboard-091-muted)}
[data-vibeui-block="dashboard-091"] [data-part="accept"]{
grid-column:1 / -1;display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem;
}
[data-vibeui-block="dashboard-091"] [data-part="track"]{
flex:1 1 8rem;min-width:6rem;height:0.4375rem;border-radius:9999px;position:relative;overflow:hidden;
background:var(--vibeui-dashboard-091-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-091-border);
}
[data-vibeui-block="dashboard-091"] [data-part="track"] span{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-091-accent);
}
[data-vibeui-block="dashboard-091"] [data-part="ratio"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-091-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-091"] [data-part="ratio"] b{color:var(--vibeui-dashboard-091-fg);font-weight:750}
[data-vibeui-block="dashboard-091"] [data-part="left"]{color:color-mix(in oklab,var(--vibeui-dashboard-091-gap) 80%,light-dark(black,white));font-weight:700}
[data-vibeui-block="dashboard-091"] details{grid-column:1 / -1}
[data-vibeui-block="dashboard-091"] summary{
list-style:none;cursor:pointer;font-size:0.6875rem;font-weight:700;
color:var(--vibeui-dashboard-091-accent);padding:0.125rem 0;
}
[data-vibeui-block="dashboard-091"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-091"] [data-part="history"]{
list-style:none;margin:0.375rem 0 0;padding:0.5rem 0.625rem;display:flex;flex-direction:column;gap:0.3125rem;
border-radius:0.625rem;background:var(--vibeui-dashboard-091-inset);
border:1px solid var(--vibeui-dashboard-091-border);
}
[data-vibeui-block="dashboard-091"] [data-part="history"] li{
display:flex;flex-wrap:wrap;gap:0.1875rem 0.5rem;align-items:baseline;font-size:0.6875rem;
}
[data-vibeui-block="dashboard-091"] [data-part="history"] b{font-weight:750;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-091"] [data-part="history"] span{color:var(--vibeui-dashboard-091-muted)}
[data-vibeui-block="dashboard-091"] [data-part="links"]{
grid-column:1 / -1;margin:0;display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;font-size:0.6875rem;
}
[data-vibeui-block="dashboard-091"] [data-part="links"] a{color:var(--vibeui-dashboard-091-accent);font-weight:700}
[data-vibeui-block="dashboard-091"] :is(a,button,summary):focus-visible{
outline:2px solid var(--vibeui-dashboard-091-accent);outline-offset:2px;
}
`

const DEFAULT_DOCUMENTS: Dashboard091Document[] = [
  {
    name: "Публичная оферта",
    kind: "договор с клиентом",
    version: "4.2",
    effective: "действует с 1 июня 2025",
    accepted: 96,
    required: true,
    state: "active",
    open: true,
    history: [
      {
        label: "4.2",
        date: "1 июня 2025",
        note: "Добавлен раздел о хранении данных в регионе клиента.",
      },
      {
        label: "4.1",
        date: "12 января 2025",
        note: "Уточнён порядок возврата при досрочном расторжении.",
      },
      {
        label: "4.0",
        date: "3 сентября 2024",
        note: "Переход на тарифы с посадочными местами.",
      },
    ],
  },
  {
    name: "Политика обработки персональных данных",
    kind: "обязательный документ",
    version: "2.8",
    effective: "действует с 14 марта 2025",
    accepted: 100,
    required: true,
    state: "active",
    history: [
      {
        label: "2.8",
        date: "14 марта 2025",
        note: "Добавлен перечень подрядчиков, получающих данные.",
      },
      {
        label: "2.7",
        date: "6 ноября 2024",
        note: "Уточнены сроки хранения журналов действий.",
      },
    ],
  },
  {
    name: "Соглашение об обработке данных (DPA)",
    kind: "для корпоративных клиентов",
    version: "1.4",
    effective: "действует с 20 мая 2025",
    accepted: 61,
    required: false,
    state: "active",
    history: [
      {
        label: "1.4",
        date: "20 мая 2025",
        note: "Добавлено уведомление об инцидентах в течение 24 часов.",
      },
      {
        label: "1.3",
        date: "2 февраля 2025",
        note: "Приведено к новой оферте.",
      },
    ],
  },
  {
    name: "Правила использования API",
    kind: "черновик",
    version: "0.9",
    effective: "не вступили в силу",
    accepted: 0,
    required: false,
    state: "draft",
    history: [
      {
        label: "0.9",
        date: "черновик от 10 июня 2025",
        note: "На проверке у юриста, ожидается 1 июля.",
      },
    ],
  },
]

const LABELS: Record<string, string> = {
  requiredTag: "принятие обязательно",
  versionText: "версия {version}",
  draftNote: "Черновик не показывается пользователям и не требует принятия.",
  acceptLabel: "{name}: приняли {percent} процентов пользователей",
  acceptedBefore: "приняли",
  acceptedAfter: "активных пользователей",
  leftText: " · осталось {people} человек",
  historyText: "История версий ({count})",
}

const LINKS = ["Открыть текст", "Скачать PDF", "Кто ещё не принял"]

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
 * Страница юридических документов: доля принятия полосой и дробью, история
 * версий свёрнута в details под каждым документом, обязательные и черновики
 * помечены. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard091({
  title = "Юридические документы",
  subtitle = "Принятие фиксируется по учётной записи и хранится вместе с датой, версией и IP-адресом. Новая версия обязательного документа требует повторного принятия при следующем входе.",
  documents = DEFAULT_DOCUMENTS,
  labels,
  links = LINKS,
  numberLocale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Dashboard091Props) {
  const text = { ...LABELS, ...labels }
  const fill = (template: string, values: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)

  const palette = {
    ...(accent ? { "--vibeui-dashboard-091-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-091-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-091" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-091"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
          </div>

          <ul data-part="list">
            {documents.map((document) => (
              <li
                key={document.name}
                data-part="doc"
                data-state={document.state}
              >
                <div data-part="name">
                  <b>{document.name}</b>
                  <span data-part="tags">
                    <span data-part="tag">{document.kind}</span>
                    {document.required ? (
                      <span data-part="tag" data-req="true">
                        {text.requiredTag}
                      </span>
                    ) : null}
                  </span>
                </div>

                <div data-part="ver">
                  <b>{fill(text.versionText, { version: document.version })}</b>
                  <span>{document.effective}</span>
                </div>

                {document.state === "draft" ? (
                  <p data-part="ratio">{text.draftNote}</p>
                ) : (
                  <div data-part="accept">
                    <span
                      data-part="track"
                      role="progressbar"
                      aria-valuenow={document.accepted}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={fill(text.acceptLabel, {
                        name: document.name,
                        percent: String(document.accepted),
                      })}
                    >
                      <span style={{ width: `${document.accepted}%` }} />
                    </span>
                    <span data-part="ratio">
                      {text.acceptedBefore} <b>{document.accepted} %</b>{" "}
                      {text.acceptedAfter}
                      {document.accepted < 100 ? (
                        <span data-part="left">
                          {fill(text.leftText, {
                            people: Math.round(
                              (68200 * (100 - document.accepted)) / 100,
                            ).toLocaleString(numberLocale),
                          })}
                        </span>
                      ) : null}
                    </span>
                  </div>
                )}

                <details open={document.open}>
                  <summary>
                    {fill(text.historyText, {
                      count: String(document.history.length),
                    })}
                  </summary>
                  <ul data-part="history">
                    {document.history.map((version) => (
                      <li key={version.label}>
                        <b>{version.label}</b>
                        <span>{version.date}</span>
                        <span>{version.note}</span>
                      </li>
                    ))}
                  </ul>
                </details>

                <p data-part="links">
                  {links.map((link) => (
                    <a key={link} href="#dashboard-091">
                      {link}
                    </a>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
