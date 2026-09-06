import type { CSSProperties } from "react"

export type Solutions041Stage = "sent" | "answered" | "partial" | "refused"

export type Solutions041Claim = {
  counterparty: string
  amount: string
  basis: string
  deadlineDays: number
  daysElapsed: number
  stage: Solutions041Stage
}

export type Solutions041Props = {
  title?: string
  hint?: string
  claims?: Solutions041Claim[]
  /** Названия стадий: sent, answered, partial, refused. */
  stageText?: Record<string, string>
  /** Подписи плиток сводки: claims, total, overdue. */
  summaryText?: Record<string, string>
  /** Остаток срока ответа. {days} — число дней. */
  deadlineLeftText?: string
  /** Просроченный срок ответа. {days} — число дней. */
  deadlineOverdueText?: string
  /** Сноска под доской. */
  footNote?: string
  currency?: string
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
// Идея блока: доска претензий колонками по стадии — это не таблица дел, а
// разбор «где что зависло». Просрочка ответа на претензию не хранится
// меткой: считается разницей между сроком по закону (deadlineDays) и тем,
// сколько дней уже прошло (daysElapsed), и показывается только для
// направленных претензий — по остальным срок ответа уже не идёт.
const STYLES = `
:where([data-vibeui-block="solutions-041"]){
--vibeui-solutions-041-bg:transparent;
--vibeui-solutions-041-card:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-solutions-041-panel:light-dark(oklch(0.976 0 250),oklch(0.27 0 265));
--vibeui-solutions-041-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-solutions-041-muted:light-dark(oklch(0.54 0 265),oklch(0.69 0 265));
--vibeui-solutions-041-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-solutions-041-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.72 0.14 39.8));
--vibeui-solutions-041-ok:light-dark(oklch(0.55 0.14 152),oklch(0.71 0.14 152));
--vibeui-solutions-041-warn:light-dark(oklch(0.68 0.16 75),oklch(0.79 0.15 75));
--vibeui-solutions-041-late:light-dark(oklch(0.57 0.19 25),oklch(0.71 0.17 25));
--vibeui-solutions-041-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-041-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="solutions-041"]{color-scheme:dark}
[data-vibeui-block="solutions-041"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-041-bg);
border:1px solid var(--vibeui-solutions-041-border);border-radius:1rem;
font-family:var(--vibeui-solutions-041-sans);color:var(--vibeui-solutions-041-fg);
}
[data-vibeui-block="solutions-041"] *{box-sizing:border-box}
[data-vibeui-block="solutions-041"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-041"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-041"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-041-muted)}
[data-vibeui-block="solutions-041"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-041"] [data-part="tile"]{
padding:0.625rem 0.75rem;border-radius:0.75rem;
background:var(--vibeui-solutions-041-panel);border:1px solid var(--vibeui-solutions-041-border);
}
[data-vibeui-block="solutions-041"] [data-part="tile"] b{
display:block;font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-041"] [data-tile="late"] b{color:var(--vibeui-solutions-041-late)}
[data-vibeui-block="solutions-041"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.6875rem;color:var(--vibeui-solutions-041-muted);
}
[data-vibeui-block="solutions-041"] [data-part="scroll"]{overflow-x:auto;scrollbar-width:thin;padding:0 1rem 1rem}
[data-vibeui-block="solutions-041"] [data-part="board"]{
display:grid;grid-auto-flow:column;grid-auto-columns:15rem;gap:0.75rem;min-width:60rem;
}
[data-vibeui-block="solutions-041"] [data-part="column"]{
display:flex;flex-direction:column;gap:0.5rem;
background:var(--vibeui-solutions-041-panel);border:1px solid var(--vibeui-solutions-041-border);
border-radius:0.75rem;padding:0.625rem;
}
[data-vibeui-block="solutions-041"] [data-part="colhead"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0 0.125rem 0.375rem;border-bottom:1px solid var(--vibeui-solutions-041-border);
}
[data-vibeui-block="solutions-041"] [data-part="colname"]{
font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="solutions-041"] [data-part="colsum"]{
font-size:0.6875rem;color:var(--vibeui-solutions-041-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="solutions-041"] [data-part="cards"]{
list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="solutions-041"] [data-part="card"]{
background:var(--vibeui-solutions-041-card);border:1px solid var(--vibeui-solutions-041-border);
border-radius:0.625rem;padding:0.5625rem 0.625rem;
}
[data-vibeui-block="solutions-041"] [data-part="counterparty"]{
display:block;font-size:0.8125rem;font-weight:650;line-height:1.25;
}
[data-vibeui-block="solutions-041"] [data-part="amount"]{
display:block;margin-top:0.1875rem;font-size:0.8125rem;font-weight:700;
font-variant-numeric:tabular-nums;color:var(--vibeui-solutions-041-accent);
}
[data-vibeui-block="solutions-041"] [data-part="basis"]{
display:block;margin-top:0.25rem;font-size:0.6875rem;color:var(--vibeui-solutions-041-muted);
line-height:1.35;
}
/* Просрочка ответа считается из срока по закону и прошедших дней, не хранится меткой. */
[data-vibeui-block="solutions-041"] [data-part="deadline"]{
display:inline-flex;align-items:center;gap:0.3125rem;margin-top:0.4375rem;
padding:0.125rem 0.5rem 0.125rem 0.25rem;border-radius:9999px;
border:1px solid var(--vibeui-solutions-041-border);
font-size:0.625rem;font-weight:650;color:var(--vibeui-solutions-041-muted);
}
[data-vibeui-block="solutions-041"] [data-part="dot"]{
width:0.875rem;height:0.875rem;border-radius:9999px;display:grid;place-items:center;flex:none;
background:var(--vibeui-solutions-041-panel);font-size:0.5rem;font-weight:700;line-height:1;
}
[data-vibeui-block="solutions-041"] [data-urgency="ok"] [data-part="deadline"]{
color:var(--vibeui-solutions-041-ok);border-color:color-mix(in oklab,var(--vibeui-solutions-041-ok) 50%,transparent);
}
[data-vibeui-block="solutions-041"] [data-urgency="ok"] [data-part="dot"]{background:var(--vibeui-solutions-041-ok);color:oklch(1 0 0)}
[data-vibeui-block="solutions-041"] [data-urgency="warn"] [data-part="deadline"]{
color:var(--vibeui-solutions-041-warn);border-color:color-mix(in oklab,var(--vibeui-solutions-041-warn) 50%,transparent);
}
[data-vibeui-block="solutions-041"] [data-urgency="warn"] [data-part="dot"]{background:var(--vibeui-solutions-041-warn);color:oklch(1 0 0)}
[data-vibeui-block="solutions-041"] [data-urgency="late"] [data-part="deadline"]{
color:var(--vibeui-solutions-041-late);border-color:color-mix(in oklab,var(--vibeui-solutions-041-late) 50%,transparent);
}
[data-vibeui-block="solutions-041"] [data-urgency="late"] [data-part="dot"]{background:var(--vibeui-solutions-041-late);color:oklch(1 0 0)}
[data-vibeui-block="solutions-041"] [data-part="foot"]{
margin:0;padding:0.75rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-041-muted);
border-top:1px solid var(--vibeui-solutions-041-border);
}
/* Сводка от собственной ширины: в узкой карточке три колонки нечитаемы. */
@container (max-width: 30rem){
[data-vibeui-block="solutions-041"] [data-part="summary"]{grid-template-columns:minmax(0,1fr);gap:0.375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-041"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CLAIMS: Solutions041Claim[] = [
  {
    counterparty: "ООО «Стройдвор»",
    amount: "540 000 ₽",
    basis: "Просрочка поставки по договору №118 на 21 день",
    deadlineDays: 30,
    daysElapsed: 26,
    stage: "sent",
  },
  {
    counterparty: "ИП Ковалёв Р.С.",
    amount: "96 000 ₽",
    basis: "Брак партии, акт от 14 февраля",
    deadlineDays: 10,
    daysElapsed: 14,
    stage: "sent",
  },
  {
    counterparty: "ООО «Логистика Верста»",
    amount: "1 240 000 ₽",
    basis: "Утрата груза при перевозке, накладная №4471",
    deadlineDays: 30,
    daysElapsed: 12,
    stage: "answered",
  },
  {
    counterparty: "АО «Кровля Плюс»",
    amount: "312 000 ₽",
    basis: "Некачественный монтаж, дефектная ведомость",
    deadlineDays: 30,
    daysElapsed: 19,
    stage: "partial",
  },
  {
    counterparty: "ООО «Мера»",
    amount: "58 000 ₽",
    basis: "Задержка оплаты аренды за январь",
    deadlineDays: 10,
    daysElapsed: 22,
    stage: "refused",
  },
]

const STAGE_ORDER: Solutions041Stage[] = [
  "sent",
  "answered",
  "partial",
  "refused",
]

const STAGE_LABEL: Record<string, string> = {
  sent: "Направлена",
  answered: "Получен ответ",
  partial: "Частично признана",
  refused: "Отказ",
}

const SUMMARY_LABEL: Record<string, string> = {
  claims: "претензий в работе",
  total: "сумма требований",
  overdue: "просрочен срок ответа",
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

function deadlineUrgency(daysLeft: number) {
  if (daysLeft < 0) return "late" as const
  if (daysLeft <= 3) return "warn" as const
  return "ok" as const
}

/**
 * Доска претензий по стадиям: срок ответа и его просрочка считаются из
 * законного срока и прошедших дней, а не приходят готовой меткой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions041({
  title = "Претензии и разбирательства",
  hint = "Досудебная работа, активные дела",
  claims = DEFAULT_CLAIMS,
  stageText = STAGE_LABEL,
  summaryText = SUMMARY_LABEL,
  deadlineLeftText = "осталось {days} дн. на ответ",
  deadlineOverdueText = "просрочен ответ на {days} дн.",
  footNote = "Срок ответа считается от даты направления претензии; просрочка не хранится отдельной меткой.",
  currency = "₽",
  locale = "ru-RU",
  accent,
  background = "",
  className,
  style,
}: Solutions041Props) {
  const summary = (key: string) => summaryText[key] ?? SUMMARY_LABEL[key]
  const parseAmount = (amount: string) =>
    Number(amount.replace(/[^\d]/g, "")) || 0
  const totalSum = claims.reduce(
    (sum, claim) => sum + parseAmount(claim.amount),
    0,
  )
  const overdueCount = claims.filter(
    (claim) =>
      claim.stage === "sent" && claim.deadlineDays - claim.daysElapsed < 0,
  ).length

  const palette = {
    ...(accent ? { "--vibeui-solutions-041-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-041-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-041" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-041"
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
            <b>{claims.length}</b>
            <span>{summary("claims")}</span>
          </p>
          <p data-part="tile">
            <b>
              {totalSum.toLocaleString(locale)} {currency}
            </b>
            <span>{summary("total")}</span>
          </p>
          <p data-part="tile" data-tile={overdueCount > 0 ? "late" : undefined}>
            <b>{overdueCount}</b>
            <span>{summary("overdue")}</span>
          </p>
        </div>

        <div data-part="scroll">
          <div data-part="board">
            {STAGE_ORDER.map((stage) => {
              const stageClaims = claims.filter(
                (claim) => claim.stage === stage,
              )
              const stageSum = stageClaims.reduce(
                (sum, claim) => sum + parseAmount(claim.amount),
                0,
              )
              return (
                <div data-part="column" key={stage}>
                  <div data-part="colhead">
                    <span data-part="colname">
                      {stageText[stage] ?? STAGE_LABEL[stage]} ·{" "}
                      {stageClaims.length}
                    </span>
                    <span data-part="colsum">
                      {stageSum.toLocaleString(locale)} {currency}
                    </span>
                  </div>
                  <ol data-part="cards">
                    {stageClaims.map((claim) => {
                      const daysLeft = claim.deadlineDays - claim.daysElapsed
                      const urgency = deadlineUrgency(daysLeft)
                      return (
                        <li data-part="card" key={claim.counterparty}>
                          <span data-part="counterparty">
                            {claim.counterparty}
                          </span>
                          <span data-part="amount">{claim.amount}</span>
                          <span data-part="basis">{claim.basis}</span>
                          {stage === "sent" ? (
                            <span data-part="deadline" data-urgency={urgency}>
                              <span data-part="dot" aria-hidden="true">
                                {urgency === "late"
                                  ? "!"
                                  : urgency === "warn"
                                    ? "~"
                                    : "✓"}
                              </span>
                              {daysLeft >= 0
                                ? deadlineLeftText.replace(
                                    "{days}",
                                    String(daysLeft),
                                  )
                                : deadlineOverdueText.replace(
                                    "{days}",
                                    String(Math.abs(daysLeft)),
                                  )}
                            </span>
                          ) : null}
                        </li>
                      )
                    })}
                  </ol>
                </div>
              )
            })}
          </div>
        </div>

        <p data-part="foot">{footNote}</p>
      </section>
    </>
  )
}
