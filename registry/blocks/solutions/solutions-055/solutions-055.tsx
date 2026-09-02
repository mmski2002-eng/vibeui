import type { CSSProperties } from "react"

export type Solutions055Level = "L1" | "L2" | "L3"

export type Solutions055Ticket = {
  id: string
  subject: string
  level: Solutions055Level
  reason: string
  slaMinutesRemaining: number
  ownerL1: string
  ownerL2: string
  ownerL3?: string
}

export type Solutions055Props = {
  title?: string
  hint?: string
  tickets?: Solutions055Ticket[]
  foot?: string
  /** С какого остатка минут SLA показывается предупреждением. */
  warnAt?: number
  /** Подписи плиток: open, overdue, l3. */
  statsText?: Record<string, string>
  /** Просроченный SLA. {span} — уже посчитанный интервал. */
  overdueSlaText?: string
  /** Остаток SLA. {span} — уже посчитанный интервал. */
  remainingSlaText?: string
  /** Интервал с часами. {hours} и {minutes} — числа. */
  hoursMinutesText?: string
  /** Интервал меньше часа. {minutes} — число минут. */
  minutesText?: string
  /** Подпись причины подъёма в карточке. */
  reasonLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

const LEVELS: Solutions055Level[] = ["L1", "L2", "L3"]

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: стол эскалаций. Уровень нарисован дорожкой из трёх точек —
// пройденные и текущая закрашены, будущие пустые, владелец подписан под
// каждым достигнутым уровнем: видно не только «где сейчас», но и кто уже
// держал обращение. SLA не приходит текстом «истекает» — компонент сам
// решает по остатку минут, идёт ли отсчёт или дедлайн уже сорван, и меняет
// подпись и цвет. Причина подъёма — отдельная строка внизу карточки: без
// неё непонятно, почему обращение вообще на этом уровне.
const STYLES = `
:where([data-vibeui-block="solutions-055"]){
--vibeui-solutions-055-bg:transparent;
--vibeui-solutions-055-panel:light-dark(oklch(0.977 0.005 25),oklch(0.27 0.014 25));
--vibeui-solutions-055-fg:light-dark(oklch(0.22 0.016 25),oklch(0.94 0.006 25));
--vibeui-solutions-055-muted:light-dark(oklch(0.54 0.014 25),oklch(0.69 0.013 25));
--vibeui-solutions-055-border:light-dark(oklch(0.9 0.007 25),oklch(0.36 0.014 25));
--vibeui-solutions-055-accent:light-dark(oklch(0.55 0.19 25),oklch(0.72 0.17 25));
--vibeui-solutions-055-ok:light-dark(oklch(0.58 0.14 152),oklch(0.73 0.13 152));
--vibeui-solutions-055-warn:light-dark(oklch(0.68 0.15 75),oklch(0.8 0.14 75));
--vibeui-solutions-055-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-solutions-055-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="solutions-055"]{
box-sizing:border-box;overflow:hidden;
background:var(--vibeui-solutions-055-bg);
border:1px solid var(--vibeui-solutions-055-border);border-radius:1rem;
font-family:var(--vibeui-solutions-055-sans);color:var(--vibeui-solutions-055-fg);
}
[data-vibeui-block="solutions-055"] *{box-sizing:border-box}
[data-vibeui-block="solutions-055"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:0.5rem;
padding:0.875rem 1rem 0.75rem;
}
[data-vibeui-block="solutions-055"] h2{margin:0 0 0.125rem;font-size:1rem;font-weight:700;letter-spacing:-0.01em}
[data-vibeui-block="solutions-055"] [data-part="hint"]{margin:0;font-size:0.75rem;color:var(--vibeui-solutions-055-muted)}
[data-vibeui-block="solutions-055"] [data-part="summary"]{
display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.5rem;padding:0 1rem 0.875rem;
}
[data-vibeui-block="solutions-055"] [data-part="tile"]{
padding:0.5rem 0.625rem;border-radius:0.75rem;background:var(--vibeui-solutions-055-panel);
border:1px solid var(--vibeui-solutions-055-border);
}
[data-vibeui-block="solutions-055"] [data-part="tile"] b{
display:block;font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-0.015em;
}
[data-vibeui-block="solutions-055"] [data-part="tile"] span{
display:block;margin-top:0.125rem;font-size:0.625rem;color:var(--vibeui-solutions-055-muted);
}
[data-tile="overdue"] b{color:var(--vibeui-solutions-055-accent)}
[data-vibeui-block="solutions-055"] [data-part="list"]{
display:grid;grid-template-columns:1fr;gap:0.625rem;padding:0 1rem 1rem;list-style:none;margin:0;
}
@container (min-width: 40rem){
[data-vibeui-block="solutions-055"] [data-part="list"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
[data-vibeui-block="solutions-055"] [data-part="ticket"]{
border:1px solid var(--vibeui-solutions-055-border);border-radius:0.875rem;padding:0.75rem 0.875rem;
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="solutions-055"] [data-part="ticket-head"]{
display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="solutions-055"] [data-part="ticket-id"]{
display:block;font-family:var(--vibeui-solutions-055-mono);font-size:0.6875rem;color:var(--vibeui-solutions-055-muted);
}
[data-vibeui-block="solutions-055"] [data-part="subject"]{margin:0.0625rem 0 0;font-size:0.8125rem;font-weight:650;line-height:1.3}
/* SLA не приходит текстом «истекает» — компонент сам решает по числу минут. */
[data-vibeui-block="solutions-055"] [data-part="sla"]{
flex-shrink:0;text-align:right;padding:0.25rem 0.5rem;border-radius:0.5rem;
font-size:0.6875rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;
border:1px solid var(--vibeui-solutions-055-border);color:var(--vibeui-solutions-055-ok);
}
[data-vibeui-block="solutions-055"] [data-sla="warn"]{
color:var(--vibeui-solutions-055-warn);border-color:color-mix(in oklab,var(--vibeui-solutions-055-warn) 45%,transparent);
}
[data-vibeui-block="solutions-055"] [data-sla="overdue"]{
color:var(--vibeui-solutions-055-accent);border-color:color-mix(in oklab,var(--vibeui-solutions-055-accent) 45%,transparent);
background:color-mix(in oklab,var(--vibeui-solutions-055-accent) 8%,var(--vibeui-solutions-055-bg));
}
[data-vibeui-block="solutions-055"] [data-sla="ok"]{
border-color:color-mix(in oklab,var(--vibeui-solutions-055-ok) 45%,transparent);
}
/* Дорожка эскалации: пройденные и текущий уровень закрашены, владелец подписан под каждым. */
[data-vibeui-block="solutions-055"] [data-part="track"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;
}
[data-vibeui-block="solutions-055"] [data-part="step"]{
display:flex;flex-direction:column;align-items:center;gap:0.25rem;text-align:center;
}
[data-vibeui-block="solutions-055"] [data-part="dot-row"]{display:flex;align-items:center;width:100%}
[data-vibeui-block="solutions-055"] [data-part="dot"]{
width:1.125rem;height:1.125rem;border-radius:9999px;flex-shrink:0;margin:0 auto;
border:2px solid var(--vibeui-solutions-055-border);background:var(--vibeui-solutions-055-bg);
display:grid;place-items:center;font-size:0.5625rem;font-weight:700;color:var(--vibeui-solutions-055-muted);
}
[data-vibeui-block="solutions-055"] [data-reached="true"] [data-part="dot"]{
border-color:var(--vibeui-solutions-055-accent);background:var(--vibeui-solutions-055-accent);color:light-dark(oklch(1 0 0),oklch(0.18 0.02 25));
}
[data-vibeui-block="solutions-055"] [data-part="line"]{flex:1;height:2px;background:var(--vibeui-solutions-055-border)}
[data-vibeui-block="solutions-055"] [data-reached="true"] + [data-part="step"] [data-part="line"]:first-child{background:var(--vibeui-solutions-055-accent)}
[data-vibeui-block="solutions-055"] [data-part="step-label"]{font-size:0.625rem;font-weight:700;color:var(--vibeui-solutions-055-muted)}
[data-vibeui-block="solutions-055"] [data-reached="true"] [data-part="step-label"]{color:var(--vibeui-solutions-055-fg)}
[data-vibeui-block="solutions-055"] [data-part="owner"]{font-size:0.625rem;color:var(--vibeui-solutions-055-muted);min-height:1em}
[data-vibeui-block="solutions-055"] [data-part="reason"]{
margin:0;padding-top:0.5rem;border-top:1px dashed var(--vibeui-solutions-055-border);
font-size:0.75rem;color:var(--vibeui-solutions-055-muted);
}
[data-vibeui-block="solutions-055"] [data-part="reason"] b{font-weight:650;color:var(--vibeui-solutions-055-fg)}
[data-vibeui-block="solutions-055"] [data-part="foot"]{
margin:0;padding:0 1rem 1rem;font-size:0.75rem;color:var(--vibeui-solutions-055-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="solutions-055"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TICKETS: Solutions055Ticket[] = [
  {
    id: "ESC-4821",
    subject: "Массовый сбой оплаты картой в приложении",
    level: "L3",
    reason: "Повторный сбой за 24 часа, затронуто более 300 платежей",
    slaMinutesRemaining: -34,
    ownerL1: "Полина Реут",
    ownerL2: "Игорь Байков",
    ownerL3: "Марат Симонян, техдиректор",
  },
  {
    id: "ESC-4835",
    subject: "Клиент требует компенсацию за сорванную бронь",
    level: "L2",
    reason: "Сумма претензии выше лимита поддержки первой линии",
    slaMinutesRemaining: 18,
    ownerL1: "Дана Урманова",
    ownerL2: "Игорь Байков",
  },
  {
    id: "ESC-4840",
    subject: "Не приходят SMS-коды подтверждения",
    level: "L1",
    reason: "Новое обращение, разбирается первой линией",
    slaMinutesRemaining: 52,
    ownerL1: "Полина Реут",
    ownerL2: "—",
  },
  {
    id: "ESC-4802",
    subject: "Утечка данных о заказе в публичный чат",
    level: "L3",
    reason: "Инцидент безопасности, эскалирован сразу на уровень техдиректора",
    slaMinutesRemaining: 6,
    ownerL1: "Дана Урманова",
    ownerL2: "Игорь Байков",
    ownerL3: "Марат Симонян, техдиректор",
  },
  {
    id: "ESC-4847",
    subject: "Двойное списание за подписку",
    level: "L2",
    reason: "Первая линия не смогла провести возврат вручную",
    slaMinutesRemaining: -9,
    ownerL1: "Полина Реут",
    ownerL2: "Игорь Байков",
  },
]

const STATS_LABEL: Record<string, string> = {
  open: "обращений в работе",
  overdue: "SLA просрочен",
  l3: "на уровне L3",
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
 * Стол эскалаций: дорожка L1→L2→L3 с владельцем на каждом достигнутом
 * уровне, SLA-статус выводится компонентом из остатка минут.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Solutions055({
  title = "Эскалации в работе",
  hint = "Поддержка · горячая линия",
  tickets = DEFAULT_TICKETS,
  foot = "Статус SLA считается по остатку минут: до 20 минут — предупреждение, отрицательный остаток — просрочка.",
  warnAt = 20,
  statsText = STATS_LABEL,
  overdueSlaText = "просрочено на {span}",
  remainingSlaText = "осталось {span}",
  hoursMinutesText = "{hours}ч {minutes}м",
  minutesText = "{minutes}м",
  reasonLabel = "Причина подъёма:",
  accent,
  background = "",
  className,
  style,
}: Solutions055Props) {
  const stat = (key: string) => statsText[key] ?? STATS_LABEL[key]
  const formatSla = (minutes: number) => {
    const abs = Math.abs(minutes)
    const hours = Math.floor(abs / 60)
    const mins = abs % 60
    const span =
      hours > 0
        ? hoursMinutesText
            .replace("{hours}", String(hours))
            .replace("{minutes}", String(mins))
        : minutesText.replace("{minutes}", String(mins))

    return (minutes < 0 ? overdueSlaText : remainingSlaText).replace(
      "{span}",
      span,
    )
  }
  const slaState = (minutes: number): "ok" | "warn" | "overdue" =>
    minutes < 0 ? "overdue" : minutes <= warnAt ? "warn" : "ok"
  const overdueCount = tickets.filter(
    (ticket) => ticket.slaMinutesRemaining < 0,
  ).length
  const l3Count = tickets.filter((ticket) => ticket.level === "L3").length

  const palette = {
    ...(accent ? { "--vibeui-solutions-055-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-solutions-055-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-solutions-055" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="solutions-055"
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
            <b>{tickets.length}</b>
            <span>{stat("open")}</span>
          </p>
          <p data-part="tile" data-tile="overdue">
            <b>{overdueCount}</b>
            <span>{stat("overdue")}</span>
          </p>
          <p data-part="tile">
            <b>{l3Count}</b>
            <span>{stat("l3")}</span>
          </p>
        </div>

        <ol data-part="list">
          {tickets.map((ticket) => {
            const owners = {
              L1: ticket.ownerL1,
              L2: ticket.ownerL2,
              L3: ticket.ownerL3 ?? "—",
            }
            const currentIndex = LEVELS.indexOf(ticket.level)
            const state = slaState(ticket.slaMinutesRemaining)

            return (
              <li data-part="ticket" key={ticket.id}>
                <div data-part="ticket-head">
                  <div>
                    <span data-part="ticket-id">{ticket.id}</span>
                    <p data-part="subject">{ticket.subject}</p>
                  </div>
                  <span data-part="sla" data-sla={state}>
                    {formatSla(ticket.slaMinutesRemaining)}
                  </span>
                </div>

                <div data-part="track">
                  {LEVELS.map((level, index) => {
                    const reached = index <= currentIndex

                    return (
                      <div data-part="step" data-reached={reached} key={level}>
                        <div data-part="dot-row">
                          <span
                            data-part="line"
                            style={{
                              visibility: index === 0 ? "hidden" : "visible",
                            }}
                          />
                          <span data-part="dot" aria-hidden="true">
                            {reached ? "✓" : ""}
                          </span>
                          <span
                            data-part="line"
                            style={{
                              visibility: index === 2 ? "hidden" : "visible",
                            }}
                          />
                        </div>
                        <span data-part="step-label">{level}</span>
                        <span data-part="owner">
                          {reached ? owners[level] : "—"}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <p data-part="reason">
                  <b>{reasonLabel}</b> {ticket.reason}
                </p>
              </li>
            )
          })}
        </ol>

        <p data-part="foot">{foot}</p>
      </section>
    </>
  )
}
