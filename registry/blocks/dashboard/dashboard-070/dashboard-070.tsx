import type { CSSProperties } from "react"

export type Dashboard070Change = {
  kind: "added" | "fixed" | "changed" | "removed"
  text: string
}

export type Dashboard070Release = {
  version: string
  date: string
  channel: "stable" | "beta" | "rollback"
  rollout: number
  author: string
  changes: Dashboard070Change[]
  open?: boolean
}

export type Dashboard070Props = {
  title?: string
  subtitle?: string
  releases?: Dashboard070Release[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: список релизов читают ради двух вопросов — «что уехало» и «до
// кого доехало». Поэтому у каждой версии рядом с номером стоит доля выката
// полосой: релиз, доехавший до 12 % пользователей, и релиз на 100 % — это
// разные события, а в обычном списке они выглядят одинаково. Изменения
// сгруппированы по виду и помечены словом («добавлено», «исправлено»), а не
// цветной точкой: цвет теряется при копировании в письмо. Откаченная версия не
// удаляется из списка — исчезнувший релиз ломает нумерацию в голове читателя.
const STYLES = `
:where([data-vibeui-block="dashboard-070"]){
--vibeui-dashboard-070-bg:oklch(0.985 0.003 155);
--vibeui-dashboard-070-card:oklch(1 0 0);
--vibeui-dashboard-070-fg:oklch(0.21 0.014 155);
--vibeui-dashboard-070-muted:oklch(0.54 0.014 155);
--vibeui-dashboard-070-border:oklch(0.91 0.006 155);
--vibeui-dashboard-070-accent:oklch(0.5 0.13 155);
--vibeui-dashboard-070-soft:oklch(0.965 0.02 155);
--vibeui-dashboard-070-beta:oklch(0.6 0.15 265);
--vibeui-dashboard-070-back:oklch(0.57 0.19 25);
--vibeui-dashboard-070-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-070-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="dashboard-070"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-070-bg);
color:var(--vibeui-dashboard-070-fg);
font-family:var(--vibeui-dashboard-070-sans);
border:1px solid var(--vibeui-dashboard-070-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-070"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-070"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-070"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-070"] [data-part="sub"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-dashboard-070-muted);max-width:64ch}
[data-vibeui-block="dashboard-070"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-070"] details{
background:var(--vibeui-dashboard-070-card);border:1px solid var(--vibeui-dashboard-070-border);
border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-070"] details[data-channel="rollback"]{border-color:color-mix(in oklab,var(--vibeui-dashboard-070-back) 40%,white)}
[data-vibeui-block="dashboard-070"] summary{
list-style:none;cursor:pointer;padding:0.75rem 0.875rem;
display:grid;grid-template-columns:auto 1fr;gap:0.3125rem 0.625rem;align-items:center;
}
[data-vibeui-block="dashboard-070"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-070"] [data-part="ver"]{
font-family:var(--vibeui-dashboard-070-mono);font-size:0.9375rem;font-weight:750;
}
[data-vibeui-block="dashboard-070"] [data-part="tags"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem}
[data-vibeui-block="dashboard-070"] [data-part="chan"]{
font-size:0.625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.125rem 0.4375rem;border-radius:0.3125rem;
background:var(--vibeui-dashboard-070-soft);color:color-mix(in oklab,var(--vibeui-dashboard-070-accent) 85%,black);
}
[data-vibeui-block="dashboard-070"] [data-channel="beta"] [data-part="chan"]{
background:color-mix(in oklab,var(--vibeui-dashboard-070-beta) 14%,white);color:var(--vibeui-dashboard-070-beta);
}
[data-vibeui-block="dashboard-070"] [data-channel="rollback"] [data-part="chan"]{
background:color-mix(in oklab,var(--vibeui-dashboard-070-back) 12%,white);color:var(--vibeui-dashboard-070-back);
}
[data-vibeui-block="dashboard-070"] [data-part="when"]{font-size:0.6875rem;color:var(--vibeui-dashboard-070-muted)}
[data-vibeui-block="dashboard-070"] [data-part="roll"]{
grid-column:2;display:flex;align-items:center;gap:0.5rem;font-size:0.6875rem;
color:var(--vibeui-dashboard-070-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-070"] [data-part="bar"]{
flex:1 1 6rem;max-width:14rem;height:0.375rem;border-radius:9999px;position:relative;overflow:hidden;
background:var(--vibeui-dashboard-070-bg);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-070-border);
}
[data-vibeui-block="dashboard-070"] [data-part="bar"] span{
position:absolute;inset:0 auto 0 0;background:var(--vibeui-dashboard-070-accent);border-radius:9999px;
}
[data-vibeui-block="dashboard-070"] [data-channel="beta"] [data-part="bar"] span{background:var(--vibeui-dashboard-070-beta)}
[data-vibeui-block="dashboard-070"] [data-channel="rollback"] [data-part="bar"] span{background:var(--vibeui-dashboard-070-back)}
[data-vibeui-block="dashboard-070"] [data-part="body"]{padding:0 0.875rem 0.875rem;display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-070"] [data-part="group"]{margin:0;display:grid;grid-template-columns:1fr;gap:0.1875rem}
[data-vibeui-block="dashboard-070"] [data-part="gtitle"]{
font-size:0.625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;
color:var(--vibeui-dashboard-070-muted);
}
[data-vibeui-block="dashboard-070"] [data-part="items"]{margin:0;padding-left:1rem;display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="dashboard-070"] [data-part="items"] li{font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="dashboard-070"] [data-part="author"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-070-muted)}
[data-vibeui-block="dashboard-070"] summary::after{
content:"подробнее";grid-column:2;justify-self:end;grid-row:1;
font-size:0.6875rem;font-weight:700;color:var(--vibeui-dashboard-070-accent);
}
[data-vibeui-block="dashboard-070"] details[open] summary::after{content:"свернуть"}
[data-vibeui-block="dashboard-070"] :is(a,button,summary):focus-visible{
outline:2px solid var(--vibeui-dashboard-070-accent);outline-offset:2px;
}
`

const DEFAULT_RELEASES: Dashboard070Release[] = [
  {
    version: "4.12.0",
    date: "14 июня, 09:20",
    channel: "beta",
    rollout: 12,
    author: "выкатил Егор Савельев",
    open: true,
    changes: [
      { kind: "added", text: "Сохранённые представления в сетке заявок." },
      { kind: "added", text: "Массовое тегирование выбранных записей." },
      {
        kind: "changed",
        text: "Импорт CSV теперь показывает пример значения рядом с каждой колонкой.",
      },
      { kind: "fixed", text: "Падение импорта на файлах с BOM." },
    ],
  },
  {
    version: "4.11.2",
    date: "9 июня, 18:40",
    channel: "stable",
    rollout: 100,
    author: "выкатил Павел Дорохов",
    changes: [
      {
        kind: "fixed",
        text: "Тайм-аут отчёта на выборках больше 200 тысяч строк.",
      },
      {
        kind: "fixed",
        text: "Дублирование писем при повторной отправке рассылки.",
      },
    ],
  },
  {
    version: "4.11.1",
    date: "6 июня, 12:05",
    channel: "rollback",
    rollout: 0,
    author: "откатил дежурный после 14 минут",
    changes: [
      {
        kind: "changed",
        text: "Новый почтовый шлюз — вызвал очередь на 40 тысяч писем.",
      },
      { kind: "removed", text: "Старый механизм повторной отправки." },
    ],
  },
  {
    version: "4.11.0",
    date: "2 июня, 10:00",
    channel: "stable",
    rollout: 100,
    author: "выкатил Егор Савельев",
    changes: [
      { kind: "added", text: "Матрица ролей и прав с частичными правами." },
      {
        kind: "added",
        text: "Журнал действий с раскрытием изменения в строке.",
      },
      {
        kind: "changed",
        text: "Квоты показывают порог предупреждения засечкой.",
      },
    ],
  },
]

const KIND_LABELS: Record<Dashboard070Change["kind"], string> = {
  added: "Добавлено",
  fixed: "Исправлено",
  changed: "Изменено",
  removed: "Удалено",
}

const CHANNEL_LABELS: Record<Dashboard070Release["channel"], string> = {
  stable: "стабильный",
  beta: "бета",
  rollback: "откачен",
}

const ORDER: Dashboard070Change["kind"][] = [
  "added",
  "changed",
  "fixed",
  "removed",
]

/**
 * Экран релизов и версий: список версий с долей выката полосой, изменения
 * сгруппированы по виду и подписаны словами, откаченный релиз остаётся в
 * списке. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard070({
  title = "Релизы",
  subtitle = "Выкат идёт долями: бета доезжает до части пользователей и растёт, пока не поймана ошибка. Доля показана на момент последнего обновления страницы.",
  releases = DEFAULT_RELEASES,
  accent,
  className,
  style,
}: Dashboard070Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-070-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-070" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-070"
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
            {releases.map((release) => (
              <li key={release.version}>
                <details data-channel={release.channel} open={release.open}>
                  <summary>
                    <span data-part="ver">{release.version}</span>
                    <span data-part="tags">
                      <span data-part="chan">
                        {CHANNEL_LABELS[release.channel]}
                      </span>
                      <span data-part="when">{release.date}</span>
                    </span>
                    <span data-part="roll">
                      <span
                        data-part="bar"
                        role="progressbar"
                        aria-valuenow={release.rollout}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Версия ${release.version}: выкачена на ${release.rollout} процентов`}
                      >
                        <span style={{ width: `${release.rollout}%` }} />
                      </span>
                      доехал до {release.rollout} % пользователей
                    </span>
                  </summary>

                  <div data-part="body">
                    {ORDER.filter((kind) =>
                      release.changes.some((change) => change.kind === kind),
                    ).map((kind) => (
                      <div key={kind} data-part="group">
                        <span data-part="gtitle">{KIND_LABELS[kind]}</span>
                        <ul data-part="items">
                          {release.changes
                            .filter((change) => change.kind === kind)
                            .map((change) => (
                              <li key={change.text}>{change.text}</li>
                            ))}
                        </ul>
                      </div>
                    ))}
                    <p data-part="author">{release.author}</p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
