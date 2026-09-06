import type { CSSProperties } from "react"

export type Dashboard090Locale = {
  code: string
  name: string
  native: string
  translated: number
  total: number
  outdated: number
  owner: string
  base?: boolean
  hidden?: boolean
}

export type Dashboard090Props = {
  title?: string
  subtitle?: string
  locales?: Dashboard090Locale[]
  exportLabel?: string
  importLabel?: string
  /** Подписи списка и легенды: компонент несёт русские. */
  labels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: «переведено 92 %» скрывает главное — сколько строк устарели
// после правки оригинала. Поэтому полоса состоит из двух сегментов: переведено
// и переведено-но-устарело, и второй виден отдельно. Оставшиеся строки названы
// числом, а не процентом: работа считается в строках. Базовый язык помечен и
// не имеет полосы — переводить его не с чего. Скрытый язык остаётся в списке
// с пометкой: язык, который не показывают пользователям, всё равно требуют
// поддерживать, и молча пропасть он не должен. Ответственный назван у каждого
// языка: без имени перевод не двигается.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-090"]){
--vibeui-dashboard-090-bg:transparent;
/* Строка языка, чип кода и жёлоб полосы: сам блок остаётся прозрачным. */
--vibeui-dashboard-090-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 190));
--vibeui-dashboard-090-inset:light-dark(oklch(0.985 0.003 190),oklch(0.22 0.012 190));
--vibeui-dashboard-090-fg:light-dark(oklch(0.21 0.014 190),oklch(0.94 0.005 190));
--vibeui-dashboard-090-muted:light-dark(oklch(0.54 0.014 190),oklch(0.72 0.012 190));
--vibeui-dashboard-090-border:light-dark(oklch(0.91 0.006 190),oklch(0.36 0.012 190));
--vibeui-dashboard-090-accent:light-dark(oklch(0.55 0.12 39.8),oklch(0.74 0.12 39.8));
--vibeui-dashboard-090-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-090-soft:light-dark(oklch(0.965 0.02 195),oklch(0.3 0.03 195));
--vibeui-dashboard-090-stale:light-dark(oklch(0.72 0.14 39.8),oklch(0.78 0.13 39.8));
--vibeui-dashboard-090-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--vibeui-dashboard-090-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-090"]{color-scheme:dark}
[data-vibeui-block="dashboard-090"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-090-bg);
color:var(--vibeui-dashboard-090-fg);
font-family:var(--vibeui-dashboard-090-sans);
border:1px solid var(--vibeui-dashboard-090-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-090"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-090"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-090"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-090"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-090"] [data-part="sub"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-090-muted);max-width:52ch}
[data-vibeui-block="dashboard-090"] [data-part="acts"]{margin-left:auto;display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="dashboard-090"] [data-part="acts"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.4375rem 0.8125rem;border-radius:0.5625rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-090-border);
}
[data-vibeui-block="dashboard-090"] [data-part="acts"] button[data-primary="true"]{
background:var(--vibeui-dashboard-090-accent);color:var(--vibeui-dashboard-090-on-accent);border-color:transparent;
}
[data-vibeui-block="dashboard-090"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="dashboard-090"] [data-part="locale"]{
display:grid;grid-template-columns:1fr auto;gap:0.3125rem 0.75rem;align-items:center;
padding:0.6875rem 0.8125rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-090-card);border:1px solid var(--vibeui-dashboard-090-border);
}
[data-vibeui-block="dashboard-090"] [data-part="locale"][data-hidden="true"]{opacity:0.65}
[data-vibeui-block="dashboard-090"] [data-part="locale"][data-base="true"]{
border-color:color-mix(in oklab,var(--vibeui-dashboard-090-accent) 38%,light-dark(white,black));
background:var(--vibeui-dashboard-090-soft);
}
[data-vibeui-block="dashboard-090"] [data-part="name"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;min-width:0}
[data-vibeui-block="dashboard-090"] [data-part="name"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-090"] [data-part="name"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-090-muted)}
[data-vibeui-block="dashboard-090"] [data-part="code"]{
font-family:var(--vibeui-dashboard-090-mono);font-size:0.625rem;font-weight:700;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
background:var(--vibeui-dashboard-090-inset);border:1px solid var(--vibeui-dashboard-090-border);
color:var(--vibeui-dashboard-090-muted);
}
[data-vibeui-block="dashboard-090"] [data-part="tag"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.3125rem;border-radius:0.25rem;background:var(--vibeui-dashboard-090-inset);
border:1px solid var(--vibeui-dashboard-090-border);color:var(--vibeui-dashboard-090-muted);
}
[data-vibeui-block="dashboard-090"] [data-part="pct"]{
font-size:0.8125rem;font-weight:750;font-variant-numeric:tabular-nums;white-space:nowrap;
}
/* Полоса из двух сегментов: переведено и переведено-но-устарело. */
[data-vibeui-block="dashboard-090"] [data-part="track"]{
grid-column:1 / -1;display:flex;height:0.4375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-090-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-090-border);
}
[data-vibeui-block="dashboard-090"] [data-part="ok"]{background:var(--vibeui-dashboard-090-accent);height:100%}
[data-vibeui-block="dashboard-090"] [data-part="stale"]{
height:100%;
background:repeating-linear-gradient(135deg,var(--vibeui-dashboard-090-stale) 0 0.1875rem,color-mix(in oklab,var(--vibeui-dashboard-090-stale) 65%,light-dark(white,black)) 0.1875rem 0.375rem);
}
[data-vibeui-block="dashboard-090"] [data-part="nums"]{
grid-column:1 / -1;margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-090-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-090"] [data-part="nums"] b{color:var(--vibeui-dashboard-090-fg);font-weight:750}
[data-vibeui-block="dashboard-090"] [data-part="warnnum"]{color:color-mix(in oklab,var(--vibeui-dashboard-090-stale) 75%,light-dark(black,white));font-weight:700}
[data-vibeui-block="dashboard-090"] [data-part="legend"]{
list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:0.375rem 0.875rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-090-muted);
}
[data-vibeui-block="dashboard-090"] [data-part="legend"] li{display:inline-flex;align-items:center;gap:0.375rem}
[data-vibeui-block="dashboard-090"] [data-part="legend"] i{width:0.875rem;height:0.5rem;border-radius:0.1875rem;display:inline-block}
[data-vibeui-block="dashboard-090"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-090-accent);outline-offset:2px;
}
`

const DEFAULT_LOCALES: Dashboard090Locale[] = [
  {
    code: "ru-RU",
    name: "Русский",
    native: "русский",
    translated: 2840,
    total: 2840,
    outdated: 0,
    owner: "исходный текст пишет продукт",
    base: true,
  },
  {
    code: "en-US",
    name: "Английский",
    native: "English",
    translated: 2712,
    total: 2840,
    outdated: 96,
    owner: "Егор Савельев",
  },
  {
    code: "kk-KZ",
    name: "Казахский",
    native: "қазақша",
    translated: 1980,
    total: 2840,
    outdated: 210,
    owner: "подрядчик «Лингво»",
  },
  {
    code: "de-DE",
    name: "Немецкий",
    native: "Deutsch",
    translated: 640,
    total: 2840,
    outdated: 18,
    owner: "не назначен",
    hidden: true,
  },
  {
    code: "uz-UZ",
    name: "Узбекский",
    native: "oʻzbekcha",
    translated: 2401,
    total: 2840,
    outdated: 402,
    owner: "подрядчик «Лингво»",
  },
]

const LABELS: Record<string, string> = {
  baseTag: "исходный",
  hiddenTag: "скрыт от пользователей",
  trackText: "{name}: переведено {translated} из {total}, устарело {outdated}",
  baseNums: "эталон, {total} строк",
  leftBefore: "осталось перевести",
  leftAfter: "строк",
  staleText: "устарело после правок: {outdated}",
  legendFresh: "переведено и актуально",
  legendStale: "переведено, но оригинал изменился",
  legendEmpty: "пустая часть полосы — строки без перевода",
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
 * Экран локализации интерфейса: полоса из двух сегментов — переведено и
 * устарело после правки оригинала, остаток в строках, базовый и скрытый языки
 * помечены. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard090({
  title = "Локализация интерфейса",
  subtitle = "Строка становится устаревшей, когда меняется оригинал: перевод остаётся на экране, но уже не описывает то, что видит человек.",
  locales = DEFAULT_LOCALES,
  exportLabel = "Выгрузить строки",
  importLabel = "Загрузить перевод",
  labels,
  accent,
  background = "",
  className,
  style,
}: Dashboard090Props) {
  const text = { ...LABELS, ...labels }
  const fill = (template: string, values: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)

  const palette = {
    ...(accent ? { "--vibeui-dashboard-090-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-090-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-090" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-090"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="sub">{subtitle}</p>
            <div data-part="acts">
              <button type="button" data-primary="true">
                {importLabel}
              </button>
              <button type="button">{exportLabel}</button>
            </div>
          </div>

          <ul data-part="list">
            {locales.map((locale) => {
              const fresh = locale.translated - locale.outdated
              const left = locale.total - locale.translated
              const share = Math.round((locale.translated / locale.total) * 100)

              return (
                <li
                  key={locale.code}
                  data-part="locale"
                  data-base={locale.base}
                  data-hidden={locale.hidden}
                >
                  <p data-part="name">
                    <b>{locale.name}</b>
                    <span>{locale.native}</span>
                    <span data-part="code">{locale.code}</span>
                    {locale.base ? (
                      <span data-part="tag">{text.baseTag}</span>
                    ) : null}
                    {locale.hidden ? (
                      <span data-part="tag">{text.hiddenTag}</span>
                    ) : null}
                  </p>

                  <span data-part="pct">{share} %</span>

                  {locale.base ? null : (
                    <div
                      data-part="track"
                      role="img"
                      aria-label={fill(text.trackText, {
                        name: locale.name,
                        translated: String(locale.translated),
                        total: String(locale.total),
                        outdated: String(locale.outdated),
                      })}
                    >
                      <span
                        data-part="ok"
                        style={{
                          width: `${(fresh / locale.total) * 100}%`,
                        }}
                      />
                      <span
                        data-part="stale"
                        style={{
                          width: `${(locale.outdated / locale.total) * 100}%`,
                        }}
                      />
                    </div>
                  )}

                  <p data-part="nums">
                    {locale.base ? (
                      <span>
                        {fill(text.baseNums, { total: String(locale.total) })}
                      </span>
                    ) : (
                      <>
                        <span>
                          {text.leftBefore} <b>{left}</b> {text.leftAfter}
                        </span>
                        <span data-part="warnnum">
                          {fill(text.staleText, {
                            outdated: String(locale.outdated),
                          })}
                        </span>
                      </>
                    )}
                    <span>{locale.owner}</span>
                  </p>
                </li>
              )
            })}
          </ul>

          <ul data-part="legend">
            <li>
              <i style={{ background: "var(--vibeui-dashboard-090-accent)" }} />
              {text.legendFresh}
            </li>
            <li>
              <i
                style={{
                  background:
                    "repeating-linear-gradient(135deg,var(--vibeui-dashboard-090-stale) 0 0.1875rem,color-mix(in oklab,var(--vibeui-dashboard-090-stale) 65%,light-dark(white,black)) 0.1875rem 0.375rem)",
                }}
              />
              {text.legendStale}
            </li>
            <li>{text.legendEmpty}</li>
          </ul>
        </div>
      </section>
    </>
  )
}
