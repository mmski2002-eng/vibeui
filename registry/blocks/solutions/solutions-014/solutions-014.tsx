import type { CSSProperties } from "react"

export type Solutions014Supplier = {
  name: string
  city: string
  score: number
  onTime: number
  defects: number
  orders: number
  status?: "active" | "paused" | "new"
  comment?: string
}

export type Solutions014Props = {
  title?: string
  hint?: string
  suppliers?: Solutions014Supplier[]
  scoreLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: список поставщиков с рейтингом. Рейтинг нарисован пятью
// сегментами и продублирован числом: звёзды без цифры не отличают 4,2 от 4,8,
// а цифра без шкалы не читается взглядом по списку. Под именем стоят три
// метрики, из которых рейтинг и складывается — иначе оценка выглядит
// произвольной и ей не верят. Статус «на паузе» меняет фон строки: с таким
// поставщиком нельзя оформить заказ, и это должно быть видно до клика.
const STYLES = `
:where([data-vibeui-block="solutions-014"]){
--vibeui-solutions-014-bg:oklch(1 0 0);
--vibeui-solutions-014-panel:oklch(0.975 0.004 120);
--vibeui-solutions-014-fg:oklch(0.22 0.014 150);
--vibeui-solutions-014-muted:oklch(0.53 0.012 150);
--vibeui-solutions-014-border:oklch(0.9 0.006 150);
--vibeui-solutions-014-accent:oklch(0.55 0.14 150);
--vibeui-solutions-014-weak:oklch(0.66 0.16 55);
--vibeui-solutions-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-014"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-014-bg);
border:1px solid var(--vibeui-solutions-014-border);border-radius:1rem;
font-family:var(--vibeui-solutions-014-sans);color:var(--vibeui-solutions-014-fg);
}
[data-vibeui-block="solutions-014"] *{box-sizing:border-box}
[data-vibeui-block="solutions-014"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;margin-bottom:0.875rem;
}
[data-vibeui-block="solutions-014"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-014"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-014-muted)}
[data-vibeui-block="solutions-014"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.625rem}
@container (min-width: 50rem){
[data-vibeui-block="solutions-014"] ul{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="solutions-014"] li{
padding:0.75rem 0.875rem;border-radius:0.875rem;
background:var(--vibeui-solutions-014-bg);
border:1px solid var(--vibeui-solutions-014-border);
}
/* Пауза видна до клика: с таким поставщиком нельзя оформить заказ. */
[data-vibeui-block="solutions-014"] [data-status="paused"]{
background:var(--vibeui-solutions-014-panel);
border-style:dashed;
}
[data-vibeui-block="solutions-014"] [data-part="top"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="solutions-014"] [data-part="name"]{display:block;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="solutions-014"] [data-part="city"]{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-014-muted);
}
[data-vibeui-block="solutions-014"] [data-part="tag"]{
display:inline-block;margin-top:0.3125rem;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
font-size:0.625rem;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;
border:1px solid var(--vibeui-solutions-014-border);color:var(--vibeui-solutions-014-muted);
}
[data-vibeui-block="solutions-014"] [data-status="new"] [data-part="tag"]{
color:var(--vibeui-solutions-014-accent);
border-color:color-mix(in oklab,var(--vibeui-solutions-014-accent) 50%,transparent);
}
[data-vibeui-block="solutions-014"] [data-part="rating"]{text-align:right;flex:none}
[data-vibeui-block="solutions-014"] [data-part="score"]{
display:block;font-size:1.25rem;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;
letter-spacing:-0.02em;
}
[data-vibeui-block="solutions-014"] [data-part="of"]{
font-size:0.75rem;font-weight:500;color:var(--vibeui-solutions-014-muted);
}
/* Пять сегментов вместе с цифрой: шкала для взгляда, цифра для точности. */
[data-vibeui-block="solutions-014"] [data-part="bars"]{
display:flex;gap:0.1875rem;justify-content:flex-end;margin-top:0.3125rem;
}
[data-vibeui-block="solutions-014"] [data-part="bars"] span{
width:0.75rem;height:0.3125rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-014-fg) 12%,transparent);
}
[data-vibeui-block="solutions-014"] [data-part="bars"] [data-on="full"]{background:var(--vibeui-solutions-014-accent)}
[data-vibeui-block="solutions-014"] [data-part="bars"] [data-on="half"]{
background:linear-gradient(90deg,var(--vibeui-solutions-014-accent) 50%,color-mix(in oklab,var(--vibeui-solutions-014-fg) 12%,transparent) 50%);
}
/* Метрики под именем: без них оценка выглядит произвольной. */
[data-vibeui-block="solutions-014"] dl{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.375rem;
margin:0.625rem 0 0;padding-top:0.625rem;border-top:1px solid var(--vibeui-solutions-014-border);
}
[data-vibeui-block="solutions-014"] dt{font-size:0.625rem;color:var(--vibeui-solutions-014-muted)}
[data-vibeui-block="solutions-014"] dd{
margin:0.0625rem 0 0;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-014"] [data-weak="true"] dd{color:var(--vibeui-solutions-014-weak)}
[data-vibeui-block="solutions-014"] [data-part="comment"]{
margin:0.5rem 0 0;font-size:0.6875rem;line-height:1.45;color:var(--vibeui-solutions-014-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SUPPLIERS: Solutions014Supplier[] = [
  {
    name: "Мебельная фабрика «Дуб»",
    city: "Воронеж",
    score: 4.8,
    onTime: 97,
    defects: 0.4,
    orders: 128,
    status: "active",
    comment: "Возит с 2019 года, ни одного срыва в этом квартале.",
  },
  {
    name: "Свет-Импорт",
    city: "Санкт-Петербург",
    score: 4.1,
    onTime: 88,
    defects: 2.1,
    orders: 64,
    status: "active",
    comment: "Задерживает морские поставки, наземные приходят вовремя.",
  },
  {
    name: "Текстиль-Юг",
    city: "Краснодар",
    score: 3.2,
    onTime: 71,
    defects: 5.4,
    orders: 41,
    status: "paused",
    comment: "На паузе до разбора партии от 2 марта.",
  },
  {
    name: "Пласт-Мастер",
    city: "Казань",
    score: 4.5,
    onTime: 94,
    defects: 1.2,
    orders: 7,
    status: "new",
    comment: "Первые заказы, оценка ещё набирает статистику.",
  },
]

const STATUS_LABEL = {
  active: "работаем",
  paused: "на паузе",
  new: "новый",
} as const

/**
 * Поставщики с рейтингом: пять сегментов плюс цифра и три метрики под ней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions014({
  title = "Поставщики",
  hint = "Оценка складывается из срока, брака и объёма заказов",
  suppliers = DEFAULT_SUPPLIERS,
  scoreLabel = "из 5",
  accent,
  className,
  style,
}: Solutions014Props) {
  const palette = {
    ...(accent ? { "--vibeui-solutions-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-014"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <p data-part="hint">{suppliers.length} в реестре</p>
        </header>

        <ul>
          {suppliers.map((supplier) => (
            <li key={supplier.name} data-status={supplier.status ?? "active"}>
              <div data-part="top">
                <div>
                  <span data-part="name">{supplier.name}</span>
                  <span data-part="city">{supplier.city}</span>
                  <span data-part="tag">
                    {STATUS_LABEL[supplier.status ?? "active"]}
                  </span>
                </div>

                <div data-part="rating">
                  <span data-part="score">
                    {supplier.score.toLocaleString("ru-RU", {
                      minimumFractionDigits: 1,
                    })}
                    <span data-part="of"> {scoreLabel}</span>
                  </span>
                  <span
                    data-part="bars"
                    role="img"
                    aria-label={`Рейтинг ${supplier.score} ${scoreLabel}`}
                  >
                    {[0, 1, 2, 3, 4].map((index) => (
                      <span
                        key={index}
                        data-on={
                          supplier.score >= index + 1
                            ? "full"
                            : supplier.score > index
                              ? "half"
                              : "off"
                        }
                      />
                    ))}
                  </span>
                </div>
              </div>

              <dl>
                <div data-weak={supplier.onTime < 85 ? "true" : "false"}>
                  <dt>В срок</dt>
                  <dd>{supplier.onTime}%</dd>
                </div>
                <div data-weak={supplier.defects > 3 ? "true" : "false"}>
                  <dt>Брак</dt>
                  <dd>
                    {supplier.defects.toLocaleString("ru-RU", {
                      minimumFractionDigits: 1,
                    })}
                    %
                  </dd>
                </div>
                <div data-weak="false">
                  <dt>Заказов</dt>
                  <dd>{supplier.orders}</dd>
                </div>
              </dl>

              {supplier.comment ? (
                <p data-part="comment">{supplier.comment}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
