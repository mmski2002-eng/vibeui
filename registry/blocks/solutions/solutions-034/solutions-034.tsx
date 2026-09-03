import type { CSSProperties } from "react"

export type Solutions034Lease = {
  object: string
  area: number
  tenant: string
  ratePerSqmLabel: string
  monthlyLabel: string
  totalMonths: number
  elapsedMonths: number
  indexation: number
}

export type Solutions034Props = {
  title?: string
  hint?: string
  renewalWindowMonths?: number
  leases?: Solutions034Lease[]
  /** Подписи плиток сводки: objects, area. */
  summaryText?: Record<string, string>
  /** Плитка истекающих договоров. {months} — окно продления. */
  expiringText?: string
  /** Площадь. {area} — число квадратных метров. */
  areaText?: string
  /** Индексация. {percent} — процент, {monthly} — платёж. */
  indexationText?: string
  /** Скрытая подпись полосы срока. {object} — объект. */
  termLabel?: string
  /** Пройденный срок. {elapsed} и {total} — месяцы. */
  termProgressText?: string
  /** Статусы договора: expired, window, active; {months} — остаток. */
  statusText?: Record<string, string>
  /** Локаль форматирования чисел. */
  locale?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: реестр договоров аренды. Срок действия — полоса прошедшего
// времени, а не две даты: длину и остаток договора видно геометрией, не
// вычитанием в уме. Окно уведомления о продлении не хранится флагом —
// считается из остатка месяцев и порога renewalWindowMonths, поэтому список
// «скоро продлевать» никогда не разойдётся с полосой. Индексация подписана
// у ставки: без неё ставка за м² выглядит фиксированной там, где она растёт
// раз в год.
const STYLES = `
:where([data-vibeui-block="solutions-034"]){
--vibeui-solutions-034-bg:transparent;
--vibeui-solutions-034-panel:light-dark(oklch(0.974 0.004 190),oklch(0.27 0.011 210));
--vibeui-solutions-034-fg:light-dark(oklch(0.21 0.014 210),oklch(0.94 0.005 210));
--vibeui-solutions-034-muted:light-dark(oklch(0.54 0.014 210),oklch(0.69 0.012 210));
--vibeui-solutions-034-border:light-dark(oklch(0.9 0.006 210),oklch(0.36 0.012 210));
--vibeui-solutions-034-accent:light-dark(oklch(0.53 0.12 190),oklch(0.74 0.11 190));
--vibeui-solutions-034-warn:light-dark(oklch(0.65 0.15 80),oklch(0.8 0.14 80));
--vibeui-solutions-034-late:light-dark(oklch(0.57 0.19 25),oklch(0.71 0.17 25));
--vibeui-solutions-034-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-034"]{color-scheme:dark}
[data-vibeui-block="solutions-034"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-034-bg);
border:1px solid var(--vibeui-solutions-034-border);border-radius:1rem;
font-family:var(--vibeui-solutions-034-sans);color:var(--vibeui-solutions-034-fg);
}
[data-vibeui-block="solutions-034"] *{box-sizing:border-box}
[data-vibeui-block="solutions-034"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-034"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-034"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-034-muted)}
[data-vibeui-block="solutions-034"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-034"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;background:var(--vibeui-solutions-034-panel);
border:1px solid var(--vibeui-solutions-034-border);
}
[data-vibeui-block="solutions-034"] [data-tile="warn"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-034-warn) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-034-warn) 10%,var(--vibeui-solutions-034-bg));
}
[data-vibeui-block="solutions-034"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-034"] [data-tile="warn"] b{color:color-mix(in oklab,var(--vibeui-solutions-034-warn) 65%,var(--vibeui-solutions-034-fg))}
[data-vibeui-block="solutions-034"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-034-muted);
}
[data-vibeui-block="solutions-034"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0 1rem 1rem;
}
[data-vibeui-block="solutions-034"] [data-part="card"]{
border:1px solid var(--vibeui-solutions-034-border);border-radius:0.75rem;padding:0.75rem 0.875rem;
display:grid;gap:0.5rem;
}
[data-vibeui-block="solutions-034"] [data-part="row"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.375rem 1rem;
}
[data-vibeui-block="solutions-034"] [data-part="object"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="solutions-034"] [data-part="tenant"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-034-muted)}
[data-vibeui-block="solutions-034"] [data-part="rate"]{text-align:right;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-034"] [data-part="index"]{display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-034-muted)}
/* Полоса прошедшего срока: длину и остаток договора видно геометрией. */
[data-vibeui-block="solutions-034"] [data-part="term"]{
height:0.5rem;border-radius:9999px;background:var(--vibeui-solutions-034-panel);
border:1px solid var(--vibeui-solutions-034-border);overflow:hidden;
}
[data-vibeui-block="solutions-034"] [data-part="term-fill"]{
height:100%;border-radius:9999px;background:var(--vibeui-solutions-034-accent);
}
[data-vibeui-block="solutions-034"] [data-window="true"] [data-part="term-fill"]{background:var(--vibeui-solutions-034-warn)}
[data-vibeui-block="solutions-034"] [data-window="expired"] [data-part="term-fill"]{background:var(--vibeui-solutions-034-late)}
[data-vibeui-block="solutions-034"] [data-part="term-labels"]{
display:flex;justify-content:space-between;font-size:0.6875rem;color:var(--vibeui-solutions-034-muted);
}
[data-vibeui-block="solutions-034"] [data-part="status"]{font-weight:650}
[data-vibeui-block="solutions-034"] [data-window="true"] [data-part="status"]{color:color-mix(in oklab,var(--vibeui-solutions-034-warn) 60%,var(--vibeui-solutions-034-fg))}
[data-vibeui-block="solutions-034"] [data-window="expired"] [data-part="status"]{color:var(--vibeui-solutions-034-late)}
@container (min-width: 30rem){
[data-vibeui-block="solutions-034"] [data-part="row"]{flex-wrap:nowrap}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-034"] *{animation:none!important;transition:none!important}}
`

const SUMMARY_LABEL: Record<string, string> = {
  objects: "объектов в аренде",
  area: "м² сдано суммарно",
}

const STATUS_LABEL: Record<string, string> = {
  expired: "срок истёк",
  window: "окно продления, осталось {months} мес.",
  active: "действует, осталось {months} мес.",
}

const DEFAULT_LEASES: Solutions034Lease[] = [
  {
    object: "Склад Б, корпус 2",
    area: 640,
    tenant: "Логистика «Верста»",
    ratePerSqmLabel: "890 ₽/м²",
    monthlyLabel: "569 600 ₽/мес",
    totalMonths: 36,
    elapsedMonths: 33,
    indexation: 6,
  },
  {
    object: "Офис 4 этаж, крыло А",
    area: 210,
    tenant: "Студия «Пиксель»",
    ratePerSqmLabel: "1 450 ₽/м²",
    monthlyLabel: "304 500 ₽/мес",
    totalMonths: 24,
    elapsedMonths: 8,
    indexation: 5,
  },
  {
    object: "Торговая площадь, ТЦ «Меридиан»",
    area: 96,
    tenant: "Кофейня «Мера»",
    ratePerSqmLabel: "2 100 ₽/м²",
    monthlyLabel: "201 600 ₽/мес",
    totalMonths: 12,
    elapsedMonths: 12,
    indexation: 0,
  },
  {
    object: "Производственный цех №1",
    area: 1180,
    tenant: "Ателье «Нить»",
    ratePerSqmLabel: "560 ₽/м²",
    monthlyLabel: "660 800 ₽/мес",
    totalMonths: 60,
    elapsedMonths: 19,
    indexation: 4,
  },
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Реестр договоров аренды: срок — полоса прошедшего времени, окно продления
 * считается из остатка месяцев. Один файл, ноль зависимостей, своя палитра.
 */
export function Solutions034({
  title = "Договоры аренды",
  hint = "Объекты в управлении, актуально на сегодня",
  renewalWindowMonths = 3,
  leases = DEFAULT_LEASES,
  summaryText = SUMMARY_LABEL,
  expiringText = "истекают в ближайшие {months} мес.",
  areaText = "{area} м²",
  indexationText = "индексация +{percent}%/год · {monthly}",
  termLabel = "Срок договора: {object}",
  termProgressText = "{elapsed} из {total} мес.",
  statusText = STATUS_LABEL,
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions034Props) {
  const soon = leases.filter((lease) => {
    const left = lease.totalMonths - lease.elapsedMonths
    return left <= renewalWindowMonths && left > 0
  })
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]
  const status = (key: string) => statusText[key] ?? STATUS_LABEL[key]

  const palette = {
    ...(accent ? { "--vibeui-solutions-034-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-034-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-034" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-034"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
        </header>

        <div data-part="summary">
          <p data-part="tile">
            <b>{leases.length}</b>
            <span>{summary("objects")}</span>
          </p>
          <p data-part="tile">
            <b>
              {leases
                .reduce((sum, lease) => sum + lease.area, 0)
                .toLocaleString(locale)}
            </b>
            <span>{summary("area")}</span>
          </p>
          <p data-part="tile" data-tile="warn">
            <b>{soon.length}</b>
            <span>
              {expiringText.replace("{months}", String(renewalWindowMonths))}
            </span>
          </p>
        </div>

        <div data-part="list">
          {leases.map((lease) => {
            const left = lease.totalMonths - lease.elapsedMonths
            const percent = Math.min(
              100,
              Math.round((lease.elapsedMonths / lease.totalMonths) * 100),
            )
            const windowState =
              left <= 0
                ? "expired"
                : left <= renewalWindowMonths
                  ? "true"
                  : "false"
            const statusKey =
              left <= 0
                ? "expired"
                : left <= renewalWindowMonths
                  ? "window"
                  : "active"
            const statusLabel = status(statusKey).replace(
              "{months}",
              String(left),
            )

            return (
              <article data-part="card" key={lease.object}>
                <div data-part="row">
                  <div>
                    <p data-part="object">{lease.object}</p>
                    <p data-part="tenant">
                      {lease.tenant} ·{" "}
                      {areaText.replace("{area}", String(lease.area))}
                    </p>
                  </div>
                  <div data-part="rate">
                    {lease.ratePerSqmLabel}
                    <span data-part="index">
                      {indexationText
                        .replace("{percent}", String(lease.indexation))
                        .replace("{monthly}", lease.monthlyLabel)}
                    </span>
                  </div>
                </div>

                <div
                  data-part="term"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={termLabel.replace("{object}", lease.object)}
                  data-window={windowState}
                >
                  <span
                    data-part="term-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div data-part="term-labels" data-window={windowState}>
                  <span>
                    {termProgressText
                      .replace("{elapsed}", String(lease.elapsedMonths))
                      .replace("{total}", String(lease.totalMonths))}
                  </span>
                  <span data-part="status">{statusLabel}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}
