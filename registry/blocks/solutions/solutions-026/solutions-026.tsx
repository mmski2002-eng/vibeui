import type { CSSProperties } from "react"

export type Solutions026Partner = {
  name: string
  channel: string
  clicks: number
  signups: number
  paid: number
  earned: number
  rate: number
}

export type Solutions026Payout = {
  date: string
  amount: number
  method: string
  state: "paid" | "processing" | "held"
  note?: string
}

export type Solutions026Props = {
  title?: string
  hint?: string
  balance?: number
  pending?: number
  threshold?: number
  currency?: string
  partners?: Solutions026Partner[]
  payouts?: Solutions026Payout[]
  thresholdLabel?: string
  /** Счётчик партнёров в шапке. {count} — их число. */
  partnersText?: string
  balanceLabel?: string
  pendingLabel?: string
  /** Строка над порогом, когда он уже пройден. */
  readyText?: string
  /** Начало строки «до выплаты не хватает». */
  shortfallText?: string
  partnersHeading?: string
  payoutsHeading?: string
  /** Заголовки колонок обеих таблиц. */
  columnText?: Record<string, string>
  /** Подписи ступеней воронки: clicks, signups, paid. */
  funnelText?: Record<string, string>
  /** Подписи статусов выплаты: paid, processing, held. */
  stateText?: Record<string, string>
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
// Идея блока: партнёрская программа с выплатами. Порог выплаты нарисован
// полосой с оставшейся суммой: партнёр, у которого «баланс 4 200 ₽», не
// понимает, почему деньги не приходят, — а «до выплаты не хватает 800 ₽»
// понимает сразу. Воронка партнёра разложена на переходы, регистрации и
// оплаты в одной строке: комиссия без них выглядит случайным числом. Ставка
// комиссии стоит у каждого партнёра, потому что она разная и это главный
// повод для спора. Удержанная выплата остаётся в списке с причиной.
const STYLES = `
:where([data-vibeui-block="solutions-026"]){
--vibeui-solutions-026-bg:transparent;
--vibeui-solutions-026-panel:light-dark(oklch(0.975 0.004 55),oklch(0.27 0.01 60));
--vibeui-solutions-026-fg:light-dark(oklch(0.22 0.014 60),oklch(0.94 0.005 60));
--vibeui-solutions-026-muted:light-dark(oklch(0.54 0.013 60),oklch(0.69 0.011 60));
--vibeui-solutions-026-border:light-dark(oklch(0.9 0.006 60),oklch(0.36 0.011 60));
--vibeui-solutions-026-accent:light-dark(oklch(0.6 0.15 55),oklch(0.76 0.14 55));
--vibeui-solutions-026-paid:light-dark(oklch(0.55 0.14 150),oklch(0.72 0.14 150));
--vibeui-solutions-026-held:light-dark(oklch(0.58 0.19 25),oklch(0.72 0.16 25));
--vibeui-solutions-026-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-026"]{color-scheme:dark}
[data-vibeui-block="solutions-026"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:1rem;
background:var(--vibeui-solutions-026-bg);
border:1px solid var(--vibeui-solutions-026-border);border-radius:1rem;
font-family:var(--vibeui-solutions-026-sans);color:var(--vibeui-solutions-026-fg);
}
[data-vibeui-block="solutions-026"] *{box-sizing:border-box}
[data-vibeui-block="solutions-026"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-026"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-026"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-026-muted)}
[data-vibeui-block="solutions-026"] [data-part="wallet"]{
margin:0.75rem 0 0;padding:0.875rem;border-radius:0.875rem;
background:var(--vibeui-solutions-026-panel);
border:1px solid var(--vibeui-solutions-026-border);
}
[data-vibeui-block="solutions-026"] [data-part="figures"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem 1rem;margin:0;
}
[data-vibeui-block="solutions-026"] [data-part="big"]{
font-size:1.625rem;font-weight:700;letter-spacing:-0.025em;font-variant-numeric:tabular-nums;line-height:1;
}
[data-vibeui-block="solutions-026"] [data-part="cap"]{
display:block;margin-top:0.1875rem;font-size:0.6875rem;font-weight:500;color:var(--vibeui-solutions-026-muted);
}
[data-vibeui-block="solutions-026"] [data-part="small"]{
font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums;text-align:right;
}
[data-vibeui-block="solutions-026"] [data-part="track"]{
height:0.5rem;margin-top:0.625rem;border-radius:9999px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-solutions-026-fg) 10%,transparent);
}
[data-vibeui-block="solutions-026"] [data-part="fill"]{display:block;height:100%;background:var(--vibeui-solutions-026-accent)}
[data-vibeui-block="solutions-026"] [data-ready="true"] [data-part="fill"]{background:var(--vibeui-solutions-026-paid)}
/* Не «баланс», а «сколько не хватает до выплаты»: иначе деньги «зависли». */
[data-vibeui-block="solutions-026"] [data-part="gap"]{
margin:0.4375rem 0 0;font-size:0.75rem;color:var(--vibeui-solutions-026-muted);
}
[data-vibeui-block="solutions-026"] [data-part="gap"] b{color:var(--vibeui-solutions-026-fg)}
[data-vibeui-block="solutions-026"] h3{
margin:1rem 0 0.5rem;font-size:0.625rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-026-muted);
}
[data-vibeui-block="solutions-026"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin}
[data-vibeui-block="solutions-026"] table{width:100%;min-width:34rem;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="solutions-026"] th,
[data-vibeui-block="solutions-026"] td{
padding:0.4375rem 0.375rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-solutions-026-border);
}
[data-vibeui-block="solutions-026"] th{
font-size:0.625rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-solutions-026-muted);border-top:0;
}
[data-vibeui-block="solutions-026"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="solutions-026"] [data-part="pname"]{display:block;font-weight:650}
[data-vibeui-block="solutions-026"] [data-part="channel"]{
display:block;font-size:0.6875rem;color:var(--vibeui-solutions-026-muted);
}
/* Воронка в строке: комиссия без переходов и оплат — случайное число. */
[data-vibeui-block="solutions-026"] [data-part="funnel"]{
font-size:0.6875rem;color:var(--vibeui-solutions-026-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-026"] [data-part="funnel"] b{color:var(--vibeui-solutions-026-fg);font-weight:650}
[data-vibeui-block="solutions-026"] [data-part="rate"]{
display:inline-block;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-solutions-026-panel);font-size:0.6875rem;font-weight:650;
}
[data-vibeui-block="solutions-026"] [data-part="earned"]{font-weight:700}
[data-vibeui-block="solutions-026"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.6875rem;font-weight:650;
color:var(--vibeui-solutions-026-muted);
}
[data-vibeui-block="solutions-026"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-solutions-026-fg) 30%,transparent);
}
[data-vibeui-block="solutions-026"] [data-state="paid"] [data-part="dot"]{background:var(--vibeui-solutions-026-paid)}
[data-vibeui-block="solutions-026"] [data-state="paid"] [data-part="state"]{color:var(--vibeui-solutions-026-paid)}
/* Удержанная выплата остаётся в списке с причиной, а не исчезает. */
[data-vibeui-block="solutions-026"] [data-state="held"] [data-part="dot"]{
background:none;border-radius:0.125rem;box-shadow:inset 0 0 0 2px var(--vibeui-solutions-026-held);
}
[data-vibeui-block="solutions-026"] [data-state="held"] [data-part="state"]{color:var(--vibeui-solutions-026-held)}
[data-vibeui-block="solutions-026"] [data-part="why"]{
display:block;font-size:0.625rem;font-weight:500;color:var(--vibeui-solutions-026-muted);white-space:normal;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-026"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PARTNERS: Solutions026Partner[] = [
  {
    name: "Блог «Складской ум»",
    channel: "статьи и обзоры",
    clicks: 4820,
    signups: 341,
    paid: 46,
    earned: 138000,
    rate: 20,
  },
  {
    name: "Канал «Логистика на пальцах»",
    channel: "Telegram, 24 тыс. подписчиков",
    clicks: 2610,
    signups: 198,
    paid: 31,
    earned: 74400,
    rate: 15,
  },
  {
    name: "Агентство «Контур роста»",
    channel: "внедрение под ключ",
    clicks: 940,
    signups: 88,
    paid: 27,
    earned: 162000,
    rate: 30,
  },
  {
    name: "Подкаст «Малый бизнес»",
    channel: "интеграции в выпусках",
    clicks: 1730,
    signups: 74,
    paid: 9,
    earned: 21600,
    rate: 15,
  },
]

const DEFAULT_PAYOUTS: Solutions026Payout[] = [
  {
    date: "1 марта",
    amount: 138000,
    method: "Расчётный счёт · Блог «Складской ум»",
    state: "paid",
  },
  {
    date: "1 марта",
    amount: 74400,
    method: "Карта · Канал «Логистика на пальцах»",
    state: "paid",
  },
  {
    date: "14 марта",
    amount: 162000,
    method: "Расчётный счёт · «Контур роста»",
    state: "processing",
  },
  {
    date: "14 марта",
    amount: 21600,
    method: "Карта · Подкаст «Малый бизнес»",
    state: "held",
    note: "не подтверждены реквизиты, выплата ждёт документов",
  },
]

const STATE_LABEL: Record<string, string> = {
  paid: "выплачено",
  processing: "в обработке",
  held: "удержано",
}

const COLUMN_LABEL: Record<string, string> = {
  partner: "Партнёр",
  funnel: "Воронка",
  rate: "Ставка",
  earned: "Начислено",
  date: "Дата",
  method: "Куда",
  amount: "Сумма",
  status: "Статус",
}

const FUNNEL_LABEL: Record<string, string> = {
  clicks: "переходов",
  signups: "регистраций",
  paid: "оплат",
}

function money(value: number, currency: string, locale: string) {
  return `${value.toLocaleString(locale)} ${currency}`
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
 * Партнёрская программа: порог выплаты полосой, воронка партнёра в строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions026({
  title = "Партнёрская программа",
  hint = "Комиссия начисляется после оплаты счёта приведённым клиентом",
  balance = 4200,
  pending = 162000,
  threshold = 5000,
  currency = "₽",
  partners = DEFAULT_PARTNERS,
  payouts = DEFAULT_PAYOUTS,
  thresholdLabel = "Минимальная сумма выплаты",
  partnersText = "{count} активных партнёров",
  balanceLabel = "доступно к выводу",
  pendingLabel = "в обработке",
  readyText = "Порог пройден — выплата уйдёт в ближайшую дату.",
  shortfallText = "До выплаты не хватает",
  partnersHeading = "Партнёры",
  payoutsHeading = "Выплаты",
  columnText = COLUMN_LABEL,
  funnelText = FUNNEL_LABEL,
  stateText = STATE_LABEL,
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions026Props) {
  const ready = balance >= threshold
  const left = Math.max(0, threshold - balance)
  const column = (key: string) => columnText[key] ?? COLUMN_LABEL[key]

  const palette = {
    ...(accent ? { "--vibeui-solutions-026-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-026-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-026" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-026"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <div>
            <h2>{title}</h2>
            <p data-part="hint">{hint}</p>
          </div>
          <p data-part="hint">
            {partnersText.replace("{count}", String(partners.length))}
          </p>
        </header>

        <div data-part="wallet" data-ready={ready ? "true" : "false"}>
          <p data-part="figures">
            <span>
              <span data-part="big">{money(balance, currency, locale)}</span>
              <span data-part="cap">{balanceLabel}</span>
            </span>
            <span>
              <span data-part="small">{money(pending, currency, locale)}</span>
              <span data-part="cap">{pendingLabel}</span>
            </span>
          </p>

          <div
            data-part="track"
            role="progressbar"
            aria-valuenow={balance}
            aria-valuemin={0}
            aria-valuemax={threshold}
            aria-label={thresholdLabel}
          >
            <span
              data-part="fill"
              style={{
                width: `${Math.min(100, Math.round((balance / threshold) * 100))}%`,
              }}
            />
          </div>

          <p data-part="gap">
            {ready ? (
              <>
                {readyText} <b>{thresholdLabel.toLowerCase()}</b>:{" "}
                {money(threshold, currency, locale)}
              </>
            ) : (
              <>
                {shortfallText} <b>{money(left, currency, locale)}</b> ·{" "}
                {thresholdLabel.toLowerCase()}{" "}
                {money(threshold, currency, locale)}
              </>
            )}
          </p>
        </div>

        <h3>{partnersHeading}</h3>
        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">{column("partner")}</th>
                <th scope="col">{column("funnel")}</th>
                <th scope="col">{column("rate")}</th>
                <th scope="col" data-align="end">
                  {column("earned")}
                </th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner.name}>
                  <td>
                    <span data-part="pname">{partner.name}</span>
                    <span data-part="channel">{partner.channel}</span>
                  </td>
                  <td data-part="funnel">
                    <b>{partner.clicks.toLocaleString(locale)}</b>{" "}
                    {funnelText.clicks ?? FUNNEL_LABEL.clicks} →{" "}
                    <b>{partner.signups}</b>{" "}
                    {funnelText.signups ?? FUNNEL_LABEL.signups} →{" "}
                    <b>{partner.paid}</b> {funnelText.paid ?? FUNNEL_LABEL.paid}
                  </td>
                  <td>
                    <span data-part="rate">{partner.rate}%</span>
                  </td>
                  <td data-align="end">
                    <span data-part="earned">
                      {money(partner.earned, currency, locale)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>{payoutsHeading}</h3>
        <div data-part="scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">{column("date")}</th>
                <th scope="col">{column("method")}</th>
                <th scope="col" data-align="end">
                  {column("amount")}
                </th>
                <th scope="col">{column("status")}</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr
                  key={`${payout.date}-${payout.amount}`}
                  data-state={payout.state}
                >
                  <td>{payout.date}</td>
                  <td>{payout.method}</td>
                  <td data-align="end">
                    {money(payout.amount, currency, locale)}
                  </td>
                  <td>
                    <span data-part="state">
                      <span data-part="dot" aria-hidden="true" />
                      {stateText[payout.state] ?? STATE_LABEL[payout.state]}
                    </span>
                    {payout.note ? (
                      <span data-part="why">{payout.note}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
