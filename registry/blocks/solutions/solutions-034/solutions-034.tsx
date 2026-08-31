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
  accent?: string
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
--vibeui-solutions-034-bg:oklch(1 0 0);
--vibeui-solutions-034-panel:oklch(0.974 0.004 190);
--vibeui-solutions-034-fg:oklch(0.21 0.014 210);
--vibeui-solutions-034-muted:oklch(0.54 0.014 210);
--vibeui-solutions-034-border:oklch(0.9 0.006 210);
--vibeui-solutions-034-accent:oklch(0.53 0.12 190);
--vibeui-solutions-034-warn:oklch(0.65 0.15 80);
--vibeui-solutions-034-late:oklch(0.57 0.19 25);
--vibeui-solutions-034-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-034"]{
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
 * Реестр договоров аренды: срок — полоса прошедшего времени, окно продления
 * считается из остатка месяцев. Один файл, ноль зависимостей, своя палитра.
 */
export function Solutions034({
  title = "Договоры аренды",
  hint = "Объекты в управлении, актуально на сегодня",
  renewalWindowMonths = 3,
  leases = DEFAULT_LEASES,
  accent,
  className,
  style,
}: Solutions034Props) {
  const soon = leases.filter((lease) => {
    const left = lease.totalMonths - lease.elapsedMonths
    return left <= renewalWindowMonths && left > 0
  })

  const palette = {
    ...(accent ? { "--vibeui-solutions-034-accent": accent } : null),
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
            <span>объектов в аренде</span>
          </p>
          <p data-part="tile">
            <b>
              {leases
                .reduce((sum, lease) => sum + lease.area, 0)
                .toLocaleString("ru-RU")}
            </b>
            <span>м² сдано суммарно</span>
          </p>
          <p data-part="tile" data-tile="warn">
            <b>{soon.length}</b>
            <span>истекают в ближайшие {renewalWindowMonths} мес.</span>
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
            const statusLabel =
              left <= 0
                ? "срок истёк"
                : left <= renewalWindowMonths
                  ? `окно продления, осталось ${left} мес.`
                  : `действует, осталось ${left} мес.`

            return (
              <article data-part="card" key={lease.object}>
                <div data-part="row">
                  <div>
                    <p data-part="object">{lease.object}</p>
                    <p data-part="tenant">
                      {lease.tenant} · {lease.area} м²
                    </p>
                  </div>
                  <div data-part="rate">
                    {lease.ratePerSqmLabel}
                    <span data-part="index">
                      индексация +{lease.indexation}%/год · {lease.monthlyLabel}
                    </span>
                  </div>
                </div>

                <div
                  data-part="term"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Срок договора: ${lease.object}`}
                  data-window={windowState}
                >
                  <span
                    data-part="term-fill"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div data-part="term-labels" data-window={windowState}>
                  <span>
                    {lease.elapsedMonths} из {lease.totalMonths} мес.
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
