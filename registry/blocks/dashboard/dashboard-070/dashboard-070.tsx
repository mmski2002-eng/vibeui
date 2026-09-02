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
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Заголовки групп изменений по ключам added, changed, fixed, removed. */
  kindText?: Record<Dashboard070Change["kind"], string>
  /** Подписи каналов по ключам stable, beta, rollback. */
  channelText?: Record<Dashboard070Release["channel"], string>
  /** Строка доли выката: {rollout}. */
  rolloutText?: string
  /** Расшифровка полосы выката: {version} и {rollout}. */
  rolloutAriaText?: string
  /** Подпись раскрытия версии. */
  moreLabel?: string
  /** Подпись свёртывания версии. */
  lessLabel?: string
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
--vibeui-dashboard-070-bg:transparent;
/* Карточки версий и жёлоб полосы выката: подложка блока прозрачна. */
--vibeui-dashboard-070-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 155));
--vibeui-dashboard-070-inset:light-dark(oklch(0.985 0.003 155),oklch(0.22 0.012 155));
--vibeui-dashboard-070-fg:light-dark(oklch(0.21 0.014 155),oklch(0.94 0.005 155));
--vibeui-dashboard-070-muted:light-dark(oklch(0.54 0.014 155),oklch(0.72 0.012 155));
--vibeui-dashboard-070-border:light-dark(oklch(0.91 0.006 155),oklch(0.36 0.012 155));
--vibeui-dashboard-070-accent:light-dark(oklch(0.5 0.13 155),oklch(0.74 0.13 155));
--vibeui-dashboard-070-accent-ink:light-dark(oklch(0.4 0.11 155),oklch(0.82 0.12 155));
--vibeui-dashboard-070-soft:light-dark(oklch(0.965 0.02 155),oklch(0.3 0.035 155));
--vibeui-dashboard-070-beta:light-dark(oklch(0.6 0.15 265),oklch(0.76 0.13 265));
--vibeui-dashboard-070-beta-soft:light-dark(oklch(0.955 0.025 265),oklch(0.3 0.05 265));
--vibeui-dashboard-070-back:light-dark(oklch(0.57 0.19 25),oklch(0.75 0.17 25));
--vibeui-dashboard-070-back-soft:light-dark(oklch(0.96 0.025 25),oklch(0.3 0.06 25));
--vibeui-dashboard-070-back-line:light-dark(oklch(0.83 0.09 25),oklch(0.49 0.11 25));
--vibeui-dashboard-070-more-label:"подробнее";
--vibeui-dashboard-070-less-label:"свернуть";
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
[data-vibeui-block="dashboard-070"] details[data-channel="rollback"]{border-color:var(--vibeui-dashboard-070-back-line)}
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
background:var(--vibeui-dashboard-070-soft);color:var(--vibeui-dashboard-070-accent-ink);
}
[data-vibeui-block="dashboard-070"] [data-channel="beta"] [data-part="chan"]{
background:var(--vibeui-dashboard-070-beta-soft);color:var(--vibeui-dashboard-070-beta);
}
[data-vibeui-block="dashboard-070"] [data-channel="rollback"] [data-part="chan"]{
background:var(--vibeui-dashboard-070-back-soft);color:var(--vibeui-dashboard-070-back);
}
[data-vibeui-block="dashboard-070"] [data-part="when"]{font-size:0.6875rem;color:var(--vibeui-dashboard-070-muted)}
[data-vibeui-block="dashboard-070"] [data-part="roll"]{
grid-column:2;display:flex;align-items:center;gap:0.5rem;font-size:0.6875rem;
color:var(--vibeui-dashboard-070-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-070"] [data-part="bar"]{
flex:1 1 6rem;max-width:14rem;height:0.375rem;border-radius:9999px;position:relative;overflow:hidden;
background:var(--vibeui-dashboard-070-inset);
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
content:var(--vibeui-dashboard-070-more-label);grid-column:2;justify-self:end;grid-row:1;
font-size:0.6875rem;font-weight:700;color:var(--vibeui-dashboard-070-accent);
}
[data-vibeui-block="dashboard-070"] details[open] summary::after{content:var(--vibeui-dashboard-070-less-label)}
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
 * Экран релизов и версий: список версий с долей выката полосой, изменения
 * сгруппированы по виду и подписаны словами, откаченный релиз остаётся в
 * списке. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard070({
  title = "Релизы",
  subtitle = "Выкат идёт долями: бета доезжает до части пользователей и растёт, пока не поймана ошибка. Доля показана на момент последнего обновления страницы.",
  releases = DEFAULT_RELEASES,
  accent,
  background = "",
  kindText = KIND_LABELS,
  channelText = CHANNEL_LABELS,
  rolloutText = "доехал до {rollout} % пользователей",
  rolloutAriaText = "Версия {version}: выкачена на {rollout} процентов",
  moreLabel = "подробнее",
  lessLabel = "свернуть",
  className,
  style,
}: Dashboard070Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-070-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-070-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    "--vibeui-dashboard-070-more-label": `"${moreLabel}"`,
    "--vibeui-dashboard-070-less-label": `"${lessLabel}"`,
    ...style,
  } as CSSProperties

  const kinds = { ...KIND_LABELS, ...kindText }
  const channels = { ...CHANNEL_LABELS, ...channelText }

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
                      <span data-part="chan">{channels[release.channel]}</span>
                      <span data-part="when">{release.date}</span>
                    </span>
                    <span data-part="roll">
                      <span
                        data-part="bar"
                        role="progressbar"
                        aria-valuenow={release.rollout}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={rolloutAriaText
                          .replace("{version}", release.version)
                          .replace("{rollout}", String(release.rollout))}
                      >
                        <span style={{ width: `${release.rollout}%` }} />
                      </span>
                      {rolloutText.replace(
                        "{rollout}",
                        String(release.rollout),
                      )}
                    </span>
                  </summary>

                  <div data-part="body">
                    {ORDER.filter((kind) =>
                      release.changes.some((change) => change.kind === kind),
                    ).map((kind) => (
                      <div key={kind} data-part="group">
                        <span data-part="gtitle">{kinds[kind]}</span>
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
