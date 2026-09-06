import type { CSSProperties } from "react"

export type Dashboard062Item = {
  id: string
  name: string
  kind: string
  deletedBy: string
  deletedAt: string
  daysLeft: number
  keepDays: number
  linked?: string
}

export type Dashboard062Props = {
  title?: string
  keepPolicy?: string
  items?: Dashboard062Item[]
  kinds?: string[]
  activeKind?: string
  restoreLabel?: string
  purgeLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Строка об авторе удаления: {who} и {at}. */
  deletedByText?: string
  /** Подпись полосы срока для скринридера: {days}. */
  trackAriaText?: string
  /** Слово перед остатком срока. */
  leftLabel?: string
  /** Остаток срока: {days}. */
  daysText?: string
  /** Полный срок хранения: {total}. */
  ofText?: string
  /** Подпись записи, которой осталось меньше трёх дней. */
  soonLabel?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: корзину открывают в панике и с одним вопросом — «успею ли».
// Поэтому у каждой записи главное не дата удаления, а остаток срока: он
// нарисован полосой убывания и продублирован словами «останется N дней».
// Записи, которым осталось меньше трёх дней, поднимают своё состояние в
// отдельный тон и получают подпись «скоро исчезнет». Связанные объекты
// названы прямо в строке: восстановление заявки без её вложений — это
// вторая авария поверх первой. Удаление навсегда стоит рядом, но без заливки:
// опасное действие не должно быть самым заметным.
const STYLES = `
:where([data-vibeui-block="dashboard-062"]){
--vibeui-dashboard-062-bg:transparent;
/* Карточки и жёлоб полосы: подложка блока прозрачна. */
--vibeui-dashboard-062-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 40));
--vibeui-dashboard-062-inset:light-dark(oklch(0.97 0.004 40),oklch(0.22 0.012 40));
--vibeui-dashboard-062-fg:light-dark(oklch(0.21 0.014 40),oklch(0.94 0.005 40));
--vibeui-dashboard-062-muted:light-dark(oklch(0.55 0.014 40),oklch(0.72 0.012 40));
--vibeui-dashboard-062-border:light-dark(oklch(0.91 0.006 40),oklch(0.36 0.012 40));
--vibeui-dashboard-062-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.77 0.13 39.8));
--vibeui-dashboard-062-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-062-soft:light-dark(oklch(0.965 0.02 40),oklch(0.31 0.04 39.8));
--vibeui-dashboard-062-soon:light-dark(oklch(0.57 0.19 39.8),oklch(0.74 0.17 39.8));
--vibeui-dashboard-062-soon-line:light-dark(oklch(0.83 0.09 39.8),oklch(0.47 0.11 39.8));
--vibeui-dashboard-062-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-062"]{color-scheme:dark}
[data-vibeui-block="dashboard-062"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-062-bg);
color:var(--vibeui-dashboard-062-fg);
font-family:var(--vibeui-dashboard-062-sans);
border:1px solid var(--vibeui-dashboard-062-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-062"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-062"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem}
[data-vibeui-block="dashboard-062"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-062"] [data-part="policy"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-062-muted);max-width:58ch}
[data-vibeui-block="dashboard-062"] [data-part="tabs"]{display:flex;flex-wrap:wrap;gap:0.3125rem}
[data-vibeui-block="dashboard-062"] [data-part="tab"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.3125rem 0.6875rem;border-radius:9999px;background:var(--vibeui-dashboard-062-card);
color:inherit;border:1px solid var(--vibeui-dashboard-062-border);
}
[data-vibeui-block="dashboard-062"] [data-part="tab"][aria-pressed="true"]{
background:var(--vibeui-dashboard-062-accent);color:var(--vibeui-dashboard-062-on-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-062"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0.4375rem}
[data-vibeui-block="dashboard-062"] [data-part="item"]{
display:grid;gap:0.4375rem;padding:0.6875rem 0.8125rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-062-card);border:1px solid var(--vibeui-dashboard-062-border);
}
[data-vibeui-block="dashboard-062"] [data-part="item"][data-soon="true"]{
border-color:var(--vibeui-dashboard-062-soon-line);
}
[data-vibeui-block="dashboard-062"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem}
[data-vibeui-block="dashboard-062"] [data-part="name"]{font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-062"] [data-part="kind"]{
font-size:0.625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.125rem 0.375rem;border-radius:0.3125rem;background:var(--vibeui-dashboard-062-soft);
}
[data-vibeui-block="dashboard-062"] [data-part="who"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-062-muted)}
[data-vibeui-block="dashboard-062"] [data-part="track"]{
position:relative;height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-062-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-062-border);
}
[data-vibeui-block="dashboard-062"] [data-part="fill"]{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-062-accent);
}
[data-vibeui-block="dashboard-062"] [data-soon="true"] [data-part="fill"]{background:var(--vibeui-dashboard-062-soon)}
[data-vibeui-block="dashboard-062"] [data-part="left"]{
display:flex;flex-wrap:wrap;gap:0.25rem 0.625rem;margin:0;font-size:0.6875rem;
color:var(--vibeui-dashboard-062-muted);
}
[data-vibeui-block="dashboard-062"] [data-part="left"] b{color:var(--vibeui-dashboard-062-fg);font-weight:750}
[data-vibeui-block="dashboard-062"] [data-soon="true"] [data-part="left"] b{color:var(--vibeui-dashboard-062-soon)}
[data-vibeui-block="dashboard-062"] [data-part="acts"]{display:flex;flex-wrap:wrap;gap:0.4375rem;align-items:center}
[data-vibeui-block="dashboard-062"] [data-part="restore"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.375rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-062-accent);color:var(--vibeui-dashboard-062-on-accent);
}
[data-vibeui-block="dashboard-062"] [data-part="purge"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.375rem 0.75rem;border-radius:0.5rem;background:transparent;
color:var(--vibeui-dashboard-062-soon);
border:1px solid var(--vibeui-dashboard-062-soon-line);
}
[data-vibeui-block="dashboard-062"] [data-part="linked"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-062-muted);
}
[data-vibeui-block="dashboard-062"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-062-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-062"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

const DEFAULT_ITEMS: Dashboard062Item[] = [
  {
    id: "zk-4711",
    name: "Заявка ЗК-4711 · Комбинат «Заря»",
    kind: "Заявка",
    deletedBy: "Павел Дорохов",
    deletedAt: "28 мая, 16:02",
    daysLeft: 2,
    keepDays: 30,
    linked: "4 вложения и 11 писем восстановятся вместе с заявкой",
  },
  {
    id: "cl-3318",
    name: "Клиент «Северный лес, ООО»",
    kind: "Клиент",
    deletedBy: "объединение дубликатов",
    deletedAt: "1 июня, 10:20",
    daysLeft: 6,
    keepDays: 30,
    linked: "заявки уже переехали в мастер-запись и назад не вернутся",
  },
  {
    id: "rp-0912",
    name: "Отчёт «Выручка по филиалам, май»",
    kind: "Отчёт",
    deletedBy: "Ирина Кузнецова",
    deletedAt: "9 июня, 09:47",
    daysLeft: 14,
    keepDays: 30,
  },
  {
    id: "vw-0044",
    name: "Представление «Крупные сделки»",
    kind: "Представление",
    deletedBy: "Ирина Кузнецова",
    deletedAt: "12 июня, 13:15",
    daysLeft: 27,
    keepDays: 30,
    linked: "им пользовались ещё трое — они увидят восстановление сразу",
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
 * Экран восстановления удалённых записей: остаток срока полосой и словами,
 * связанные объекты названы прямо в строке, «удалить навсегда» намеренно
 * скромнее восстановления. Один файл, ноль зависимостей, без JS.
 */
export function Dashboard062({
  title = "Корзина",
  keepPolicy = "Удалённое хранится 30 дней, потом стирается без возможности вернуть. Срок считается от момента удаления и не продлевается.",
  items = DEFAULT_ITEMS,
  kinds = ["Всё", "Заявки", "Клиенты", "Отчёты", "Представления"],
  activeKind = "Всё",
  restoreLabel = "Восстановить",
  purgeLabel = "Удалить навсегда",
  accent,
  background = "",
  deletedByText = "удалил {who} · {at}",
  trackAriaText = "До окончательного удаления осталось дней: {days}",
  leftLabel = "останется",
  daysText = "{days} дн.",
  ofText = "из {total}",
  soonLabel = "скоро исчезнет безвозвратно",
  className,
  style,
}: Dashboard062Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-062-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-062-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-062" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-062"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="policy">{keepPolicy}</p>
          </div>

          <div data-part="tabs">
            {kinds.map((kind) => (
              <button
                key={kind}
                type="button"
                data-part="tab"
                aria-pressed={kind === activeKind}
              >
                {kind}
              </button>
            ))}
          </div>

          <ul data-part="list">
            {items.map((item) => {
              const soon = item.daysLeft <= 3
              const share = Math.max(
                4,
                Math.round((item.daysLeft / item.keepDays) * 100),
              )

              return (
                <li key={item.id} data-part="item" data-soon={soon}>
                  <div data-part="top">
                    <span data-part="name">{item.name}</span>
                    <span data-part="kind">{item.kind}</span>
                  </div>

                  <p data-part="who">
                    {deletedByText
                      .replace("{who}", item.deletedBy)
                      .replace("{at}", item.deletedAt)}
                  </p>

                  <div
                    data-part="track"
                    role="progressbar"
                    aria-valuenow={item.daysLeft}
                    aria-valuemin={0}
                    aria-valuemax={item.keepDays}
                    aria-label={trackAriaText.replace(
                      "{days}",
                      String(item.daysLeft),
                    )}
                  >
                    <span data-part="fill" style={{ width: `${share}%` }} />
                  </div>

                  <p data-part="left">
                    <span>
                      {leftLabel}{" "}
                      <b>{daysText.replace("{days}", String(item.daysLeft))}</b>{" "}
                      {ofText.replace("{total}", String(item.keepDays))}
                    </span>
                    {soon ? <span>{soonLabel}</span> : null}
                  </p>

                  {item.linked ? <p data-part="linked">{item.linked}</p> : null}

                  <div data-part="acts">
                    <button type="button" data-part="restore">
                      {restoreLabel}
                    </button>
                    <button type="button" data-part="purge">
                      {purgeLabel}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
