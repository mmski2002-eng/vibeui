import type { CSSProperties } from "react"

export type Solutions009Subscription = {
  customer: string
  plan: string
  amount: string
  period: string
  renewsIn: number
  seats?: number
  autoRenew?: boolean
}

export type Solutions009Props = {
  title?: string
  hint?: string
  mrr?: string
  mrrDelta?: string
  window?: number
  items?: Solutions009Subscription[]
  soonLabel?: string
  /** Число мест в подписке, {seats} — количество. */
  seatsText?: string
  /** Обратный отсчёт, {count} и {unit} — число и склонённое слово. */
  renewText?: string
  /** Слово «день» по формам: ключи one, few, many. */
  dayText?: Record<string, string>
  /** Подпись полосы для скринридера, {customer} — имя клиента. */
  renewLabelText?: string
  /** Итоговая строка, {count} и {manual} — числа подписок. */
  footText?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подписки и их продления. Срок написан обратным отсчётом
// («через 3 дня»), а не датой: дата требует держать в голове сегодняшнее число.
// Полоса рисует остаток от окна внимания, поэтому ближайшие продления сами
// собираются в верх списка глазами. Отключённое автопродление — это не
// «настройка», а предупреждение: строка помечается рамкой и словом, потому что
// такие подписки молча заканчиваются.
const STYLES = `
:where([data-vibeui-block="solutions-009"]){
--vibeui-solutions-009-bg:transparent;
--vibeui-solutions-009-panel:light-dark(oklch(0.98 0.004 240),oklch(0.27 0.011 250));
--vibeui-solutions-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.005 265));
--vibeui-solutions-009-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-solutions-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-solutions-009-accent:light-dark(oklch(0.55 0.16 165),oklch(0.75 0.14 165));
--vibeui-solutions-009-warn:light-dark(oklch(0.65 0.17 45),oklch(0.79 0.14 48));
--vibeui-solutions-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-009"]{color-scheme:dark}
[data-vibeui-block="solutions-009"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-009-bg);
border:1px solid var(--vibeui-solutions-009-border);border-radius:1rem;
font-family:var(--vibeui-solutions-009-sans);color:var(--vibeui-solutions-009-fg);
}
[data-vibeui-block="solutions-009"] *{box-sizing:border-box}
[data-vibeui-block="solutions-009"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="solutions-009"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-009"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-009-muted)}
[data-vibeui-block="solutions-009"] [data-part="mrr"]{
margin:0;text-align:right;font-size:1.5rem;font-weight:700;letter-spacing:-0.02em;
font-variant-numeric:tabular-nums;line-height:1.1;
}
[data-vibeui-block="solutions-009"] [data-part="delta"]{
display:block;font-size:0.6875rem;font-weight:600;color:var(--vibeui-solutions-009-accent);
}
[data-vibeui-block="solutions-009"] ul{list-style:none;margin:0.875rem 0 0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="solutions-009"] li{
display:grid;gap:0.5rem;padding:0.6875rem 0.75rem;border-radius:0.875rem;
background:var(--vibeui-solutions-009-panel);
border:1px solid var(--vibeui-solutions-009-border);
}
@container (min-width: 40rem){
[data-vibeui-block="solutions-009"] li{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) 10rem;align-items:center}
}
/* Отключённое автопродление — предупреждение, а не настройка: рамка и слово. */
[data-vibeui-block="solutions-009"] [data-manual="true"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-009-warn) 55%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-009-warn) 9%,transparent);
}
[data-vibeui-block="solutions-009"] [data-part="customer"]{display:block;font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="solutions-009"] [data-part="plan"]{
display:block;margin-top:0.125rem;font-size:0.75rem;color:var(--vibeui-solutions-009-muted);
}
[data-vibeui-block="solutions-009"] [data-part="price"]{
font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-009"] [data-part="period"]{
display:block;font-size:0.75rem;font-weight:400;color:var(--vibeui-solutions-009-muted);
}
/* Обратный отсчёт вместо даты: «через 3 дня» не требует считать в уме. */
[data-vibeui-block="solutions-009"] [data-part="renew"]{
display:block;font-size:0.75rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-009"] [data-soon="true"] [data-part="renew"]{color:var(--vibeui-solutions-009-warn)}
[data-vibeui-block="solutions-009"] [data-part="track"]{
margin-top:0.3125rem;height:0.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-009-fg) 10%,transparent);
}
[data-vibeui-block="solutions-009"] [data-part="fill"]{
display:block;height:100%;border-radius:inherit;background:var(--vibeui-solutions-009-accent);
}
[data-vibeui-block="solutions-009"] [data-soon="true"] [data-part="fill"]{background:var(--vibeui-solutions-009-warn)}
[data-vibeui-block="solutions-009"] [data-part="manual"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;font-weight:650;color:var(--vibeui-solutions-009-warn);
}
[data-vibeui-block="solutions-009"] [data-part="foot"]{
margin:0.875rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-009-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Solutions009Subscription[] = [
  {
    customer: "Кофейня «Мера»",
    plan: "Команда · 12 мест",
    amount: "14 400 ₽",
    period: "в месяц",
    renewsIn: 2,
    seats: 12,
    autoRenew: false,
  },
  {
    customer: "Логистика «Верста»",
    plan: "Бизнес · 40 мест",
    amount: "62 000 ₽",
    period: "в месяц",
    renewsIn: 6,
    seats: 40,
    autoRenew: true,
  },
  {
    customer: "Ателье «Нить»",
    plan: "Старт · 3 места",
    amount: "2 900 ₽",
    period: "в месяц",
    renewsIn: 14,
    seats: 3,
    autoRenew: true,
  },
  {
    customer: "Клиника «Исток»",
    plan: "Бизнес · год",
    amount: "540 000 ₽",
    period: "в год",
    renewsIn: 24,
    seats: 90,
    autoRenew: true,
  },
]

const DAY_TEXT: Record<string, string> = {
  one: "день",
  few: "дня",
  many: "дней",
}

function days(count: number, text: Record<string, string>) {
  const last = count % 10
  const teen = count % 100

  if (teen >= 11 && teen <= 14) return text.many ?? DAY_TEXT.many
  if (last === 1) return text.one ?? DAY_TEXT.one
  if (last >= 2 && last <= 4) return text.few ?? DAY_TEXT.few
  return text.many ?? DAY_TEXT.many
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

/**
 * Подписки и продления: срок — обратный отсчёт, полоса рисует остаток окна.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions009({
  title = "Подписки",
  hint = "Продления ближайшего месяца",
  mrr = "619 300 ₽",
  mrrDelta = "+8,2% к февралю",
  window = 30,
  items = DEFAULT_ITEMS,
  soonLabel = "автопродление выключено — подписка закончится сама",
  seatsText = " · {seats} мест",
  renewText = "через {count} {unit}",
  dayText = DAY_TEXT,
  renewLabelText = "До продления {customer}",
  footText = "Всего {count} подписок, без автопродления — {manual}.",
  accent,
  background = "",
  className,
  style,
}: Solutions009Props) {
  const manual = items.filter((item) => item.autoRenew === false).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-009"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <p data-part="mrr">
            {mrr}
            <span data-part="delta">{mrrDelta}</span>
          </p>
        </header>

        <ul>
          {items.map((item) => {
            const left = Math.max(0, Math.min(window, item.renewsIn))
            const share = Math.round(((window - left) / window) * 100)
            const soon = left <= 7

            return (
              <li
                key={item.customer}
                data-soon={soon ? "true" : "false"}
                data-manual={item.autoRenew === false ? "true" : "false"}
              >
                <div>
                  <span data-part="customer">{item.customer}</span>
                  <span data-part="plan">
                    {item.plan}
                    {item.seats
                      ? seatsText.replace("{seats}", String(item.seats))
                      : ""}
                  </span>
                </div>

                <p data-part="price">
                  {item.amount}
                  <span data-part="period">{item.period}</span>
                </p>

                <div>
                  <span data-part="renew">
                    {renewText
                      .replace("{count}", String(item.renewsIn))
                      .replace("{unit}", days(item.renewsIn, dayText))}
                  </span>
                  <div
                    data-part="track"
                    role="progressbar"
                    aria-valuenow={share}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={renewLabelText.replace(
                      "{customer}",
                      item.customer,
                    )}
                  >
                    <span data-part="fill" style={{ width: `${share}%` }} />
                  </div>
                  {item.autoRenew === false ? (
                    <span data-part="manual">{soonLabel}</span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>

        <p data-part="foot">
          {footText
            .replace("{count}", String(items.length))
            .replace("{manual}", String(manual))}
        </p>
      </section>
    </>
  )
}
