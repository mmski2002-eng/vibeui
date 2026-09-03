import type { CSSProperties } from "react"

export type Solutions053Courier = {
  name: string
  vehicle: string
  orders: number
  nextAddress: string
  windowFrom: string
  windowTo: string
  etaOffset: number
}

export type Solutions053QueueItem = {
  address: string
  waitingMinutes: number
  items: number
}

export type Solutions053Props = {
  title?: string
  hint?: string
  couriers?: Solutions053Courier[]
  queue?: Solutions053QueueItem[]
  queueTitle?: string
  /** Вместимость сумки курьера: от неё считается полоса загрузки. */
  capacity?: number
  /** С какого ожидания заказ в очереди подсвечивается как долгий, мин. */
  longWaitMinutes?: number
  /** Подписи плиток: couriers, orders, late. */
  statsText?: Record<string, string>
  /** Загрузка курьера. {orders} и {capacity} подставляются на месте. */
  loadText?: string
  /** Скрытая подпись полосы загрузки. {name} — имя курьера. */
  loadLabel?: string
  /** Приставка следующего адреса. */
  nextText?: string
  /** Окно доставки. {from} и {to} — границы окна. */
  windowText?: string
  /** Опоздание. {minutes} — число минут. */
  lateText?: string
  /** Запас по времени. {minutes} — число минут. */
  spareText?: string
  /** Число позиций в заказе очереди. {count} — их число. */
  itemsText?: string
  /** Ожидание заказа в очереди. {minutes} — число минут. */
  waitText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: диспетчерская курьеров. Опоздание не приходит меткой —
// компонент сам сравнивает расчётное время прибытия с концом окна доставки
// и решает, «опаздывает» курьер или везёт «с запасом», сколько минут в ту
// или иную сторону. Очередь нераспределённых заказов — отдельная колонка
// без исполнителя: время ожидания растёт, и это заметно раньше, чем заказ
// вообще попадёт к курьеру. Число заказов в руках нарисовано полосой
// заполненности относительно вместимости сумки, а не голой цифрой.
const STYLES = `
:where([data-vibeui-block="solutions-053"]){
--vibeui-solutions-053-bg:transparent;
--vibeui-solutions-053-panel:light-dark(oklch(0.977 0.005 55),oklch(0.27 0.014 55));
--vibeui-solutions-053-fg:light-dark(oklch(0.22 0.016 55),oklch(0.94 0.006 55));
--vibeui-solutions-053-muted:light-dark(oklch(0.54 0.014 55),oklch(0.69 0.013 55));
--vibeui-solutions-053-border:light-dark(oklch(0.9 0.007 55),oklch(0.36 0.014 55));
--vibeui-solutions-053-accent:light-dark(oklch(0.62 0.17 55),oklch(0.77 0.15 55));
--vibeui-solutions-053-good:light-dark(oklch(0.58 0.14 152),oklch(0.73 0.13 152));
--vibeui-solutions-053-late:light-dark(oklch(0.57 0.19 25),oklch(0.73 0.16 25));
--vibeui-solutions-053-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-053-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-053"]{color-scheme:dark}
[data-vibeui-block="solutions-053"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-053-bg);
border:1px solid var(--vibeui-solutions-053-border);border-radius:1rem;
font-family:var(--vibeui-solutions-053-sans);color:var(--vibeui-solutions-053-fg);
}
[data-vibeui-block="solutions-053"] *{box-sizing:border-box}
[data-vibeui-block="solutions-053"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-053"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-053"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-053-muted)}
[data-vibeui-block="solutions-053"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-053"] [data-part="tile"]{
padding:0.5rem 0.625rem;border-radius:0.75rem;background:var(--vibeui-solutions-053-panel);
border:1px solid var(--vibeui-solutions-053-border);
}
[data-vibeui-block="solutions-053"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-053"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.625rem;color:var(--vibeui-solutions-053-muted);
}
[data-vibeui-block="solutions-053"] [data-part="body"]{
display:grid;grid-template-columns:1fr;gap:0.875rem;padding:0 1rem 1rem;
}
@container (min-width: 46rem){
[data-vibeui-block="solutions-053"] [data-part="body"]{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}
}
[data-vibeui-block="solutions-053"] [data-part="couriers"]{
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="solutions-053"] [data-part="courier"]{
border:1px solid var(--vibeui-solutions-053-border);border-radius:0.875rem;
padding:0.625rem 0.75rem;display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;align-items:center;
}
[data-vibeui-block="solutions-053"] [data-part="who"]{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="solutions-053"] [data-part="vehicle"]{
display:block;margin-top:0.0625rem;font-size:0.6875rem;color:var(--vibeui-solutions-053-muted);
}
[data-vibeui-block="solutions-053"] [data-part="load"]{
display:flex;align-items:center;gap:0.375rem;justify-self:end;
}
[data-vibeui-block="solutions-053"] [data-part="load"] span{
font-size:0.6875rem;font-variant-numeric:tabular-nums;color:var(--vibeui-solutions-053-muted);white-space:nowrap;
}
[data-vibeui-block="solutions-053"] [role="progressbar"][data-part="load-bar"]{
position:relative;width:3.5rem;height:0.375rem;border-radius:9999px;background:var(--vibeui-solutions-053-border);overflow:hidden;
}
[data-vibeui-block="solutions-053"] [role="progressbar"][data-part="load-bar"] i{
position:absolute;inset:0 auto 0 0;border-radius:9999px;
background:var(--vibeui-solutions-053-accent);width:var(--vibeui-solutions-053-fill,0%);
}
[data-vibeui-block="solutions-053"] [data-part="next"]{
grid-column:1 / -1;margin:0;padding-top:0.5rem;border-top:1px dashed var(--vibeui-solutions-053-border);
font-size:0.75rem;color:var(--vibeui-solutions-053-muted);
}
[data-vibeui-block="solutions-053"] [data-part="address"]{color:var(--vibeui-solutions-053-fg);font-weight:600}
[data-vibeui-block="solutions-053"] [data-part="eta"]{
display:inline-flex;align-items:center;gap:0.3125rem;margin-left:0.5rem;font-weight:650;
}
[data-vibeui-block="solutions-053"] [data-late="true"] [data-part="eta"]{color:var(--vibeui-solutions-053-late)}
[data-vibeui-block="solutions-053"] [data-late="false"] [data-part="eta"]{color:var(--vibeui-solutions-053-good)}
[data-vibeui-block="solutions-053"] [data-part="eta-mark"]{
width:1rem;height:1rem;border-radius:9999px;display:inline-grid;place-items:center;flex-shrink:0;
font-size:0.5625rem;font-weight:700;color:light-dark(oklch(1 0 0),oklch(0.18 0.02 55));
}
[data-vibeui-block="solutions-053"] [data-late="true"] [data-part="eta-mark"]{background:var(--vibeui-solutions-053-late)}
[data-vibeui-block="solutions-053"] [data-late="false"] [data-part="eta-mark"]{background:var(--vibeui-solutions-053-good)}
[data-vibeui-block="solutions-053"] [data-part="queue"]{
border:1px solid var(--vibeui-solutions-053-border);border-radius:0.875rem;
background:var(--vibeui-solutions-053-panel);padding:0.75rem;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="solutions-053"] [data-part="queue-title"]{margin:0;font-size:0.75rem;font-weight:700}
[data-vibeui-block="solutions-053"] [data-part="queue-list"]{
list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="solutions-053"] [data-part="queue-item"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding-bottom:0.5rem;border-bottom:1px solid var(--vibeui-solutions-053-border);font-size:0.75rem;
}
[data-vibeui-block="solutions-053"] [data-part="queue-list"] li:last-child [data-part="queue-item"]{border-bottom:0;padding-bottom:0}
[data-vibeui-block="solutions-053"] [data-part="queue-addr"]{font-weight:600}
[data-vibeui-block="solutions-053"] [data-part="queue-items"]{
display:block;margin-top:0.0625rem;font-size:0.625rem;color:var(--vibeui-solutions-053-muted);
}
[data-vibeui-block="solutions-053"] [data-part="wait"]{
flex-shrink:0;font-variant-numeric:tabular-nums;font-weight:650;color:var(--vibeui-solutions-053-muted);
}
[data-vibeui-block="solutions-053"] [data-wait-long="true"] [data-part="wait"]{color:var(--vibeui-solutions-053-late)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-053"] *{animation:none!important;transition:none!important}}
`

const STATS_LABEL: Record<string, string> = {
  couriers: "курьеров на смене",
  orders: "заказов в руках",
  late: "рискуют опоздать",
}

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

const DEFAULT_COURIERS: Solutions053Courier[] = [
  {
    name: "Роман Гуляев",
    vehicle: "велокурьер",
    orders: 4,
    nextAddress: "ул. Тверская, 12, кв. 45",
    windowFrom: "13:30",
    windowTo: "14:00",
    etaOffset: -6,
  },
  {
    name: "Диана Ким",
    vehicle: "самокат",
    orders: 2,
    nextAddress: "Ленинский пр-т, 88, офис 310",
    windowFrom: "13:15",
    windowTo: "13:45",
    etaOffset: 9,
  },
  {
    name: "Артур Саидов",
    vehicle: "авто",
    orders: 6,
    nextAddress: "ул. Малая Бронная, 3",
    windowFrom: "14:00",
    windowTo: "14:30",
    etaOffset: 14,
  },
  {
    name: "Марина Белых",
    vehicle: "велокурьер",
    orders: 3,
    nextAddress: "Кутузовский пр-т, 25, кв. 9",
    windowFrom: "13:45",
    windowTo: "14:15",
    etaOffset: -2,
  },
  {
    name: "Тимур Насыров",
    vehicle: "самокат",
    orders: 1,
    nextAddress: "ул. Плющиха, 55",
    windowFrom: "14:10",
    windowTo: "14:40",
    etaOffset: -11,
  },
]

const DEFAULT_QUEUE: Solutions053QueueItem[] = [
  { address: "ул. Профсоюзная, 130", waitingMinutes: 4, items: 1 },
  { address: "Проспект Мира, 61", waitingMinutes: 11, items: 2 },
  { address: "ул. Новослободская, 14", waitingMinutes: 19, items: 1 },
  { address: "Ходынский бульвар, 4", waitingMinutes: 27, items: 3 },
]

/**
 * Диспетчерская курьеров: опоздание к следующему адресу считается из окна
 * доставки и ETA, очередь нераспределённых заказов — отдельным списком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions053({
  title = "Диспетчерская курьеров",
  hint = "Смена 12:00–20:00 · район «Центр»",
  couriers = DEFAULT_COURIERS,
  queue = DEFAULT_QUEUE,
  queueTitle = "Очередь без курьера",
  capacity = 6,
  longWaitMinutes = 20,
  statsText = STATS_LABEL,
  loadText = "{orders} из {capacity}",
  loadLabel = "Заказов в руках у {name}",
  nextText = "Далее:",
  windowText = "· окно {from}–{to}",
  lateText = "опоздание {minutes} мин",
  spareText = "в запасе {minutes} мин",
  itemsText = "{count} позиция(й)",
  waitText = "{minutes} мин",
  accent,
  background = "",
  className,
  style,
}: Solutions053Props) {
  const stat = (key: string) => statsText[key] ?? STATS_LABEL[key]
  const ordersInHand = couriers.reduce(
    (sum, courier) => sum + courier.orders,
    0,
  )
  const lateCount = couriers.filter((courier) => courier.etaOffset > 0).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-053-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-053-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-053" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-053"
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
            <b>{couriers.length}</b>
            <span>{stat("couriers")}</span>
          </p>
          <p data-part="tile">
            <b>{ordersInHand}</b>
            <span>{stat("orders")}</span>
          </p>
          <p data-part="tile">
            <b>{lateCount}</b>
            <span>{stat("late")}</span>
          </p>
        </div>

        <div data-part="body">
          <div data-part="couriers">
            {couriers.map((courier) => {
              const late = courier.etaOffset > 0
              const abs = Math.abs(courier.etaOffset)
              const fill =
                capacity > 0
                  ? Math.min((courier.orders / capacity) * 100, 100)
                  : 0

              return (
                <article
                  data-part="courier"
                  data-late={late}
                  key={courier.name}
                >
                  <div>
                    <p data-part="who">{courier.name}</p>
                    <span data-part="vehicle">{courier.vehicle}</span>
                  </div>
                  <div data-part="load">
                    <span>
                      {loadText
                        .replace("{orders}", String(courier.orders))
                        .replace("{capacity}", String(capacity))}
                    </span>
                    <div
                      data-part="load-bar"
                      role="progressbar"
                      aria-valuenow={courier.orders}
                      aria-valuemin={0}
                      aria-valuemax={capacity}
                      aria-label={loadLabel.replace("{name}", courier.name)}
                      style={
                        {
                          "--vibeui-solutions-053-fill": `${fill}%`,
                        } as CSSProperties
                      }
                    >
                      <i />
                    </div>
                  </div>
                  <p data-part="next">
                    {nextText}{" "}
                    <span data-part="address">{courier.nextAddress}</span>{" "}
                    {windowText
                      .replace("{from}", courier.windowFrom)
                      .replace("{to}", courier.windowTo)}
                    <span data-part="eta">
                      <span data-part="eta-mark" aria-hidden="true">
                        {late ? "!" : "✓"}
                      </span>
                      {(late ? lateText : spareText).replace(
                        "{minutes}",
                        String(abs),
                      )}
                    </span>
                  </p>
                </article>
              )
            })}
          </div>

          <aside data-part="queue">
            <p data-part="queue-title">
              {queueTitle} · {queue.length}
            </p>
            <ol data-part="queue-list">
              {queue.map((item) => {
                const waitLong = item.waitingMinutes >= longWaitMinutes

                return (
                  <li key={item.address} data-wait-long={waitLong}>
                    <div data-part="queue-item">
                      <span>
                        <span data-part="queue-addr">{item.address}</span>
                        <span data-part="queue-items">
                          {itemsText.replace("{count}", String(item.items))}
                        </span>
                      </span>
                      <span data-part="wait">
                        {waitText.replace(
                          "{minutes}",
                          String(item.waitingMinutes),
                        )}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </aside>
        </div>
      </section>
    </>
  )
}
