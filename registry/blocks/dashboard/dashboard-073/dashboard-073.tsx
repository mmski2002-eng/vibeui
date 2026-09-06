import { Fragment } from "react"
import type { CSSProperties } from "react"

export type Dashboard073Segment = {
  name: string
  size: number
  share: number
  trend: string
  up: boolean
  rules: string[]
  live: boolean
  usedIn: string
}

export type Dashboard073Props = {
  title?: string
  baseSize?: number
  segments?: Dashboard073Segment[]
  newLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Строка базы: {base}. */
  baseText?: string
  /** Отметки списка по ключам live и frozen. */
  liveText?: Record<string, string>
  /** Доля от базы: {share}. */
  shareText?: string
  /** Расшифровка полосы доли: {share}. */
  shareAriaText?: string
  /** Связка между чипами условий. */
  andLabel?: string
  /** Локаль форматирования чисел. */
  numberLocale?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: сегмент — это условие, а не число. Поэтому условия развёрнуты
// чипами прямо в карточке и соединены словом «и»: свёрнутое в «5 правил»
// условие никто не проверяет, и сегменты годами живут сломанными. Размер
// показан числом и долей от базы одновременно — «12 400 человек» без базы
// ничего не значит. Живой сегмент отличается от зафиксированного отметкой:
// первый меняется сам, второй — снимок, и путать их дорого при рассылках.
// Строка «используется в» отвечает на главный вопрос перед удалением.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-073"]){
--vibeui-dashboard-073-bg:transparent;
/* Карточка сегмента и жёлоб полосы: подложка самого блока прозрачна. */
--vibeui-dashboard-073-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 20));
--vibeui-dashboard-073-inset:light-dark(oklch(0.985 0.003 20),oklch(0.22 0.012 20));
--vibeui-dashboard-073-fg:light-dark(oklch(0.21 0.014 20),oklch(0.94 0.005 20));
--vibeui-dashboard-073-muted:light-dark(oklch(0.55 0.014 20),oklch(0.72 0.012 20));
--vibeui-dashboard-073-border:light-dark(oklch(0.91 0.006 20),oklch(0.36 0.012 20));
--vibeui-dashboard-073-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.74 0.15 39.8));
--vibeui-dashboard-073-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-073-soft:light-dark(oklch(0.965 0.02 20),oklch(0.3 0.035 39.8));
--vibeui-dashboard-073-up:light-dark(oklch(0.55 0.13 155),oklch(0.74 0.13 155));
--vibeui-dashboard-073-down:light-dark(oklch(0.57 0.19 25),oklch(0.73 0.16 25));
--vibeui-dashboard-073-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-073"]{color-scheme:dark}
[data-vibeui-block="dashboard-073"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-073-bg);
color:var(--vibeui-dashboard-073-fg);
font-family:var(--vibeui-dashboard-073-sans);
border:1px solid var(--vibeui-dashboard-073-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-073"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-073"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-073"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-073"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-073"] [data-part="base"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-073-muted)}
[data-vibeui-block="dashboard-073"] [data-part="new"]{
margin-left:auto;appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.4375rem 0.875rem;border-radius:0.5625rem;
background:var(--vibeui-dashboard-073-accent);color:var(--vibeui-dashboard-073-on-accent);
}
[data-vibeui-block="dashboard-073"] [data-part="list"]{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:0.5rem}
[data-vibeui-block="dashboard-073"] [data-part="card"]{
display:flex;flex-direction:column;gap:0.4375rem;padding:0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-073-card);border:1px solid var(--vibeui-dashboard-073-border);
}
[data-vibeui-block="dashboard-073"] [data-part="top"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem}
[data-vibeui-block="dashboard-073"] [data-part="top"] h3{margin:0;font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-073"] [data-part="live"]{
font-size:0.5625rem;font-weight:750;text-transform:uppercase;letter-spacing:0.05em;
padding:0.0625rem 0.375rem;border-radius:0.25rem;background:var(--vibeui-dashboard-073-soft);
color:color-mix(in oklab,var(--vibeui-dashboard-073-accent) 85%,light-dark(black,white));
}
[data-vibeui-block="dashboard-073"] [data-part="size"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;margin:0;
}
[data-vibeui-block="dashboard-073"] [data-part="size"] b{font-size:1.25rem;font-weight:750;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
[data-vibeui-block="dashboard-073"] [data-part="size"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-073-muted)}
[data-vibeui-block="dashboard-073"] [data-part="trend"]{
display:inline-flex;align-items:center;gap:0.3125rem;font-size:0.6875rem;font-weight:750;
}
[data-vibeui-block="dashboard-073"] [data-part="trend"]::before{
content:"";width:0;height:0;border-left:0.25rem solid transparent;border-right:0.25rem solid transparent;
}
[data-vibeui-block="dashboard-073"] [data-part="trend"][data-up="true"]{color:var(--vibeui-dashboard-073-up)}
[data-vibeui-block="dashboard-073"] [data-part="trend"][data-up="true"]::before{border-bottom:0.375rem solid currentColor}
[data-vibeui-block="dashboard-073"] [data-part="trend"][data-up="false"]{color:var(--vibeui-dashboard-073-down)}
[data-vibeui-block="dashboard-073"] [data-part="trend"][data-up="false"]::before{border-top:0.375rem solid currentColor}
[data-vibeui-block="dashboard-073"] [data-part="track"]{
position:relative;height:0.3125rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-073-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-073-border);
}
[data-vibeui-block="dashboard-073"] [data-part="track"] span{
position:absolute;inset:0 auto 0 0;border-radius:9999px;background:var(--vibeui-dashboard-073-accent);
}
[data-vibeui-block="dashboard-073"] [data-part="rules"]{
margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;align-items:center;gap:0.3125rem;
}
[data-vibeui-block="dashboard-073"] [data-part="rules"] li{
font-size:0.6875rem;font-weight:650;padding:0.1875rem 0.4375rem;border-radius:0.4375rem;
background:var(--vibeui-dashboard-073-inset);border:1px solid var(--vibeui-dashboard-073-border);
}
[data-vibeui-block="dashboard-073"] [data-part="and"]{
font-size:0.625rem;font-weight:750;color:var(--vibeui-dashboard-073-muted);text-transform:uppercase;
}
[data-vibeui-block="dashboard-073"] [data-part="used"]{margin:0;font-size:0.6875rem;color:var(--vibeui-dashboard-073-muted)}
[data-vibeui-block="dashboard-073"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-073-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-073"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

const DEFAULT_SEGMENTS: Dashboard073Segment[] = [
  {
    name: "Активные на тарифе «Команда»",
    size: 12400,
    share: 18,
    trend: "+4,2 % за месяц",
    up: true,
    live: true,
    rules: [
      "тариф = «Команда»",
      "заходил за последние 14 дней",
      "создал ≥ 5 заявок",
    ],
    usedIn: "используется в 3 рассылках и 1 сценарии автоматизации",
  },
  {
    name: "Риск оттока",
    size: 2180,
    share: 3,
    trend: "−1,1 % за месяц",
    up: false,
    live: true,
    rules: [
      "не заходил 30 дней",
      "оплата продлевается через 21 день",
      "в команде ≥ 3 человек",
    ],
    usedIn: "используется в сценарии «Возврат» и отчёте по удержанию",
  },
  {
    name: "Пробный период, день 3–7",
    size: 860,
    share: 1,
    trend: "+11,8 % за месяц",
    up: true,
    live: true,
    rules: ["статус = пробный", "с регистрации прошло 3–7 дней"],
    usedIn: "используется в письме «Три подсказки» и в онбординге",
  },
  {
    name: "Участники вебинара 22 мая",
    size: 1345,
    share: 2,
    trend: "не меняется",
    up: true,
    live: false,
    rules: ["импортирован список 23 мая"],
    usedIn: "зафиксированный список: новые участники в него не попадут",
  },
]

const LIVE_TEXT: Record<string, string> = {
  live: "живой",
  frozen: "зафиксирован",
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
 * Страница сегментов пользователей: условия развёрнуты чипами, размер показан
 * числом и долей от базы, живой сегмент отличается от зафиксированного
 * отметкой. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard073({
  title = "Сегменты пользователей",
  baseSize = 68200,
  segments = DEFAULT_SEGMENTS,
  newLabel = "Новый сегмент",
  accent,
  background = "",
  baseText = "база: {base} человек, пересчитано час назад",
  liveText = LIVE_TEXT,
  shareText = "{share} % базы",
  shareAriaText = "Доля от базы: {share} процентов",
  andLabel = "и",
  numberLocale = "ru-RU",
  className,
  style,
}: Dashboard073Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-073-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-073-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const live = { ...LIVE_TEXT, ...liveText }

  return (
    <>
      <style href="vibeui-dashboard-073" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-073"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="base">
              {baseText.replace(
                "{base}",
                baseSize.toLocaleString(numberLocale),
              )}
            </p>
            <button type="button" data-part="new">
              {newLabel}
            </button>
          </div>

          <ul data-part="list">
            {segments.map((segment) => (
              <li key={segment.name} data-part="card">
                <div data-part="top">
                  <h3>{segment.name}</h3>
                  <span data-part="live">
                    {segment.live ? live.live : live.frozen}
                  </span>
                </div>

                <p data-part="size">
                  <b>{segment.size.toLocaleString(numberLocale)}</b>
                  <span>
                    {shareText.replace("{share}", String(segment.share))}
                  </span>
                  <span data-part="trend" data-up={segment.up}>
                    {segment.trend}
                  </span>
                </p>

                <div
                  data-part="track"
                  role="img"
                  aria-label={shareAriaText.replace(
                    "{share}",
                    String(segment.share),
                  )}
                >
                  <span style={{ width: `${Math.max(2, segment.share)}%` }} />
                </div>

                <ul data-part="rules">
                  {segment.rules.map((rule, index) => (
                    <Fragment key={rule}>
                      {index > 0 ? (
                        <span data-part="and" aria-hidden="true">
                          {andLabel}
                        </span>
                      ) : null}
                      <li>{rule}</li>
                    </Fragment>
                  ))}
                </ul>

                <p data-part="used">{segment.usedIn}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
