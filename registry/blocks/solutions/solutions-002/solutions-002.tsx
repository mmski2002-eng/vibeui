import type { CSSProperties } from "react"

export type Solutions002Line = {
  label: string
  detail: string
  amount: string
}

export type Solutions002Props = {
  title?: string
  plan?: string
  planHint?: string
  amount?: string
  dueDate?: string
  usageLabel?: string
  used?: number
  limit?: number
  lines?: Solutions002Line[]
  card?: string
  primary?: string
  secondary?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: биллинг. Расход показан полосой и цифрами сразу: полоса даёт
// ощущение запаса, цифра — точность перед оплатой. Переполнение лимита красит
// полосу и добавляет строку с превышением, а не молча упирается в край — иначе
// человек узнаёт о доплате только из счёта. Сумма к списанию и дата стоят
// рядом с составом счёта, потому что решение «менять тариф или нет» принимают
// по ним, а способ оплаты вынесен вниз: его меняют раз в год.
const STYLES = `
:where([data-vibeui-block="solutions-002"]){
--vibeui-solutions-002-bg:oklch(1 0 0);
--vibeui-solutions-002-panel:oklch(0.985 0.002 265);
--vibeui-solutions-002-fg:oklch(0.22 0.014 265);
--vibeui-solutions-002-muted:oklch(0.55 0.014 265);
--vibeui-solutions-002-border:oklch(0.91 0.006 265);
--vibeui-solutions-002-track:oklch(0.93 0.005 265);
--vibeui-solutions-002-accent:oklch(0.55 0.2 262);
--vibeui-solutions-002-over:oklch(0.62 0.17 40);
--vibeui-solutions-002-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-002"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-002-bg);
border:1px solid var(--vibeui-solutions-002-border);border-radius:1rem;
font-family:var(--vibeui-solutions-002-sans);color:var(--vibeui-solutions-002-fg);
}
[data-vibeui-block="solutions-002"] *{box-sizing:border-box}
[data-vibeui-block="solutions-002"] h2{margin:0 0 0.75rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-002"] [data-part="layout"]{display:grid;grid-template-columns:1fr;gap:0.875rem;align-items:start}
@container (min-width: 40rem){
[data-vibeui-block="solutions-002"] [data-part="layout"]{grid-template-columns:1fr 15rem}
}
[data-vibeui-block="solutions-002"] [data-part="plan"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.75rem 0.875rem;margin-bottom:0.75rem;
border-radius:0.875rem;background:var(--vibeui-solutions-002-panel);
border:1px solid var(--vibeui-solutions-002-border);
}
[data-vibeui-block="solutions-002"] [data-part="planname"]{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="solutions-002"] [data-part="planhint"]{margin:0.125rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-002-muted)}
[data-vibeui-block="solutions-002"] [data-part="amount"]{font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.02em}
/* Полоса и цифры вместе: полоса даёт запас, цифра — точность перед оплатой. */
[data-vibeui-block="solutions-002"] [data-part="usage"]{margin-bottom:0.75rem}
[data-vibeui-block="solutions-002"] [data-part="usageline"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0 0 0.375rem;
font-size:0.8125rem;
}
[data-vibeui-block="solutions-002"] [data-part="usagevalue"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-002"] [data-part="track"]{
height:0.4375rem;border-radius:9999px;overflow:hidden;background:var(--vibeui-solutions-002-track);
}
[data-vibeui-block="solutions-002"] [data-part="fill"]{
display:block;height:100%;border-radius:9999px;
width:var(--vibeui-solutions-002-used,0%);
background:var(--vibeui-solutions-002-accent);
}
/* Превышение красит полосу и добавляет строку: иначе о доплате узнают из счёта. */
[data-vibeui-block="solutions-002"] [data-over="true"] [data-part="fill"]{background:var(--vibeui-solutions-002-over)}
[data-vibeui-block="solutions-002"] [data-part="overnote"]{
margin:0.375rem 0 0;font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-002-over);
}
[data-vibeui-block="solutions-002"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-002"] td{
padding:0.4375rem 0;text-align:left;
border-top:1px solid var(--vibeui-solutions-002-border);
}
[data-vibeui-block="solutions-002"] [data-part="detail"]{display:block;font-size:0.6875rem;color:var(--vibeui-solutions-002-muted)}
[data-vibeui-block="solutions-002"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-002"] tfoot td{font-weight:700}
[data-vibeui-block="solutions-002"] [data-part="side"]{
padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-solutions-002-panel);
border:1px solid var(--vibeui-solutions-002-border);
}
[data-vibeui-block="solutions-002"] [data-part="due"]{margin:0 0 0.125rem;font-size:0.75rem;color:var(--vibeui-solutions-002-muted)}
[data-vibeui-block="solutions-002"] [data-part="duevalue"]{margin:0 0 0.75rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="solutions-002"] [data-part="card"]{
display:flex;align-items:center;gap:0.5rem;margin:0 0 0.75rem;
font-size:0.75rem;color:var(--vibeui-solutions-002-muted);
}
[data-vibeui-block="solutions-002"] [data-part="chip"]{
width:1.75rem;height:1.125rem;border-radius:0.25rem;
background:var(--vibeui-solutions-002-track);
}
[data-vibeui-block="solutions-002"] button{
width:100%;appearance:none;cursor:pointer;height:2.25rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="solutions-002"] [data-part="primary"]{border:0;background:var(--vibeui-solutions-002-accent);color:oklch(1 0 0);margin-bottom:0.5rem}
[data-vibeui-block="solutions-002"] [data-part="secondary"]{
border:1px solid var(--vibeui-solutions-002-border);background:none;color:inherit;
}
[data-vibeui-block="solutions-002"] button:focus-visible{outline:2px solid var(--vibeui-solutions-002-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LINES: Solutions002Line[] = [
  {
    label: "Тариф «Команда»",
    detail: "10 мест, оплата помесячно",
    amount: "12 400 ₽",
  },
  { label: "Сверх лимита", detail: "1 240 установок × 2 ₽", amount: "2 480 ₽" },
  {
    label: "Скидка за год",
    detail: "Действует до 1 сентября",
    amount: "−1 500 ₽",
  },
]

/**
 * Биллинг: расход полосой и цифрами, превышение лимита названо явно.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions002({
  title = "Оплата и расход",
  plan = "Команда",
  planHint = "10 мест, следующее списание 1 апреля",
  amount = "12 400 ₽ / мес",
  dueDate = "1 апреля",
  usageLabel = "Установок в этом месяце",
  used = 11240,
  limit = 10000,
  lines = DEFAULT_LINES,
  card = "Visa · 6411",
  primary = "Оплатить сейчас",
  secondary = "Сменить тариф",
  accent,
  className,
  style,
}: Solutions002Props) {
  const over = used > limit
  const fill = `${Math.min(100, (used / Math.max(limit, 1)) * 100)}%`

  const palette = {
    "--vibeui-solutions-002-used": fill,
    ...(accent ? { "--vibeui-solutions-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-002"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>

        <div data-part="layout">
          <div>
            <div data-part="plan">
              <div>
                <p data-part="planname">Тариф «{plan}»</p>
                <p data-part="planhint">{planHint}</p>
              </div>
              <span data-part="amount">{amount}</span>
            </div>

            <div data-part="usage" data-over={over ? "true" : "false"}>
              <p data-part="usageline">
                {usageLabel}
                <span data-part="usagevalue">
                  {used.toLocaleString("ru-RU")} из{" "}
                  {limit.toLocaleString("ru-RU")}
                </span>
              </p>
              <div
                data-part="track"
                role="progressbar"
                aria-valuenow={Math.min(used, limit)}
                aria-valuemin={0}
                aria-valuemax={limit}
                aria-label={usageLabel}
              >
                <span data-part="fill" />
              </div>
              {over ? (
                <p data-part="overnote">
                  Лимит превышен на {(used - limit).toLocaleString("ru-RU")} —
                  перерасход попадёт в следующий счёт
                </p>
              ) : null}
            </div>

            <table>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.label}>
                    <td>
                      {line.label}
                      <span data-part="detail">{line.detail}</span>
                    </td>
                    <td data-align="end">{line.amount}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>К списанию {dueDate}</td>
                  <td data-align="end">13 380 ₽</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <aside data-part="side" aria-label="Способ оплаты">
            <p data-part="due">Следующее списание</p>
            <p data-part="duevalue">{dueDate}</p>
            <p data-part="card">
              <span data-part="chip" aria-hidden="true" />
              {card}
            </p>
            <button type="button" data-part="primary">
              {primary}
            </button>
            <button type="button" data-part="secondary">
              {secondary}
            </button>
          </aside>
        </div>
      </section>
    </>
  )
}
