import type { CSSProperties } from "react"

export type Dashboard076Campaign = {
  name: string
  audience: string
  total: number
  sent: number
  failed: number
  state: "sending" | "paused" | "scheduled" | "done"
  when: string
  rate?: string
}

export type Dashboard076Props = {
  title?: string
  throughput?: string
  campaigns?: Dashboard076Campaign[]
  pauseAllLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Состояния по ключам sending, paused, scheduled и done. */
  stateText?: Record<string, string>
  /** Кнопка строки по ключам paused, done и other. */
  actionText?: Record<string, string>
  /** Счётчик отправки: {sent} и {total}. */
  sentText?: string
  /** Счётчик недоставленных: {failed}. */
  failedText?: string
  /** Расшифровка полосы: {name}, {sent}, {total}. */
  trackAriaText?: string
  /** Локаль форматирования чисел. */
  numberLocale?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: очередь рассылок — это про «сколько уже ушло и когда закончится»,
// а не про список названий. Поэтому каждая рассылка несёт полосу отправки с
// подписью «12 480 из 31 200» и оценкой окончания: процент без абсолютных
// чисел не даёт понять масштаб аварии, если что-то пойдёт не так. Ошибки
// доставки вынесены в отдельный сегмент полосы у правого края отправленного:
// они часть уже обработанного, а не отдельная строка отчёта. Пауза стоит
// прямо в строке — рассылку останавливают в панике, и искать кнопку внутри
// карточки в этот момент невозможно. Общая пропускная способность подписана
// сверху: она объясняет, почему очередь движется именно так.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-076"]){
--vibeui-dashboard-076-bg:transparent;
/* Строка рассылки и жёлоб полосы: подложка самого блока прозрачна. */
--vibeui-dashboard-076-card:light-dark(oklch(1 0 0),oklch(0.26 0 250));
--vibeui-dashboard-076-inset:light-dark(oklch(0.985 0 250),oklch(0.22 0 250));
--vibeui-dashboard-076-fg:light-dark(oklch(0.21 0 250),oklch(0.94 0 250));
--vibeui-dashboard-076-muted:light-dark(oklch(0.54 0 250),oklch(0.72 0 250));
--vibeui-dashboard-076-border:light-dark(oklch(0.91 0 250),oklch(0.36 0 250));
--vibeui-dashboard-076-accent:light-dark(oklch(0.52 0.15 250),oklch(0.74 0.13 250));
--vibeui-dashboard-076-accent-line:light-dark(oklch(0.83 0.06 250),oklch(0.5 0.09 250));
--vibeui-dashboard-076-soft:light-dark(oklch(0.965 0 250),oklch(0.3 0.035 250));
--vibeui-dashboard-076-fail:light-dark(oklch(0.57 0.19 25),oklch(0.74 0.16 25));
--vibeui-dashboard-076-fail-line:light-dark(oklch(0.84 0.07 25),oklch(0.5 0.11 25));
--vibeui-dashboard-076-pause:light-dark(oklch(0.55 0.12 72),oklch(0.84 0.13 72));
--vibeui-dashboard-076-done:light-dark(oklch(0.55 0.11 155),oklch(0.78 0.12 155));
--vibeui-dashboard-076-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-076"]{color-scheme:dark}
[data-vibeui-block="dashboard-076"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-dashboard-076-bg);
color:var(--vibeui-dashboard-076-fg);
font-family:var(--vibeui-dashboard-076-sans);
border:1px solid var(--vibeui-dashboard-076-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-076"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-076"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.8125rem}
[data-vibeui-block="dashboard-076"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.75rem}
[data-vibeui-block="dashboard-076"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-076"] [data-part="thr"]{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-076-muted)}
[data-vibeui-block="dashboard-076"] [data-part="pauseall"]{
margin-left:auto;appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.4375rem 0.875rem;border-radius:0.5625rem;background:transparent;
color:var(--vibeui-dashboard-076-fail);
border:1px solid var(--vibeui-dashboard-076-fail-line);
}
[data-vibeui-block="dashboard-076"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="dashboard-076"] [data-part="row"]{
display:grid;grid-template-columns:1fr auto;gap:0.375rem 0.75rem;align-items:center;
padding:0.6875rem 0.8125rem;border-radius:0.8125rem;
background:var(--vibeui-dashboard-076-card);border:1px solid var(--vibeui-dashboard-076-border);
}
[data-vibeui-block="dashboard-076"] [data-state="sending"]{border-color:var(--vibeui-dashboard-076-accent-line)}
[data-vibeui-block="dashboard-076"] [data-state="done"]{opacity:0.75}
[data-vibeui-block="dashboard-076"] [data-part="who"]{min-width:0;display:flex;flex-wrap:wrap;align-items:baseline;gap:0.1875rem 0.5rem}
[data-vibeui-block="dashboard-076"] [data-part="who"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-076"] [data-part="who"] span{font-size:0.6875rem;color:var(--vibeui-dashboard-076-muted)}
[data-vibeui-block="dashboard-076"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;white-space:nowrap;
font-size:0.6875rem;font-weight:750;
}
[data-vibeui-block="dashboard-076"] [data-part="state"]::before{content:"";width:0.4375rem;height:0.4375rem;border-radius:50%;background:currentColor}
[data-vibeui-block="dashboard-076"] [data-state="sending"] [data-part="state"]{color:var(--vibeui-dashboard-076-accent)}
[data-vibeui-block="dashboard-076"] [data-state="paused"] [data-part="state"]{color:var(--vibeui-dashboard-076-pause)}
[data-vibeui-block="dashboard-076"] [data-state="paused"] [data-part="state"]::before{border-radius:0.0625rem;width:0.375rem;height:0.5rem}
[data-vibeui-block="dashboard-076"] [data-state="scheduled"] [data-part="state"]{color:var(--vibeui-dashboard-076-muted)}
[data-vibeui-block="dashboard-076"] [data-state="scheduled"] [data-part="state"]::before{background:transparent;box-shadow:inset 0 0 0 1px currentColor}
[data-vibeui-block="dashboard-076"] [data-state="done"] [data-part="state"]{color:var(--vibeui-dashboard-076-done)}
[data-vibeui-block="dashboard-076"] [data-part="track"]{
grid-column:1 / -1;display:flex;height:0.5rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dashboard-076-inset);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-076-border);
}
[data-vibeui-block="dashboard-076"] [data-part="ok"]{background:var(--vibeui-dashboard-076-accent);height:100%}
[data-vibeui-block="dashboard-076"] [data-state="done"] [data-part="ok"]{background:var(--vibeui-dashboard-076-done)}
[data-vibeui-block="dashboard-076"] [data-state="paused"] [data-part="ok"]{background:var(--vibeui-dashboard-076-pause)}
[data-vibeui-block="dashboard-076"] [data-part="bad"]{background:var(--vibeui-dashboard-076-fail);height:100%}
[data-vibeui-block="dashboard-076"] [data-part="nums"]{
grid-column:1 / -1;margin:0;display:flex;flex-wrap:wrap;gap:0.25rem 0.75rem;
font-size:0.6875rem;color:var(--vibeui-dashboard-076-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-076"] [data-part="nums"] b{color:var(--vibeui-dashboard-076-fg);font-weight:750}
[data-vibeui-block="dashboard-076"] [data-part="nums"] [data-bad="true"]{color:var(--vibeui-dashboard-076-fail);font-weight:700}
[data-vibeui-block="dashboard-076"] [data-part="act"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.6875rem;font-weight:700;
padding:0.3125rem 0.625rem;border-radius:0.4375rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-076-border);white-space:nowrap;
}
[data-vibeui-block="dashboard-076"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-076-accent);outline-offset:2px;
}
`

const DEFAULT_CAMPAIGNS: Dashboard076Campaign[] = [
  {
    name: "Июньский дайджест",
    audience: "сегмент «Активные на тарифе Команда»",
    total: 31200,
    sent: 12480,
    failed: 96,
    state: "sending",
    when: "закончится примерно через 24 минуты",
    rate: "530 писем в минуту",
  },
  {
    name: "Возврат уходящих, письмо 1",
    audience: "сегмент «Риск оттока»",
    total: 2180,
    sent: 640,
    failed: 12,
    state: "paused",
    when: "поставлена на паузу дежурным 18 минут назад",
  },
  {
    name: "Приглашение на вебинар 28 июня",
    audience: "все подтверждённые адреса",
    total: 54900,
    sent: 0,
    failed: 0,
    state: "scheduled",
    when: "старт 26 июня в 10:00",
  },
  {
    name: "Напоминание об оплате",
    audience: "продление в ближайшие 7 дней",
    total: 4110,
    sent: 4110,
    failed: 38,
    state: "done",
    when: "завершена сегодня в 06:12",
  },
]

const STATE_TEXT: Record<string, string> = {
  sending: "отправляется",
  paused: "на паузе",
  scheduled: "запланирована",
  done: "завершена",
}

const ACTION_TEXT: Record<string, string> = {
  paused: "Продолжить",
  done: "Отчёт",
  other: "Пауза",
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
 * Экран очереди рассылок: полоса отправки с сегментом ошибок, абсолютные числа
 * рядом с процентом, оценка окончания и пауза прямо в строке. Один файл,
 * ноль зависимостей, клиентского JS нет.
 */
export function Dashboard076({
  title = "Очередь рассылок",
  throughput = "общий предел — 900 писем в минуту на всё рабочее пространство; очередь делит его между активными рассылками",
  campaigns = DEFAULT_CAMPAIGNS,
  pauseAllLabel = "Остановить всё",
  accent,
  background = "",
  stateText = STATE_TEXT,
  actionText = ACTION_TEXT,
  sentText = "{sent} из {total}",
  failedText = "не доставлено: {failed}",
  trackAriaText = "{name}: отправлено {sent} из {total}",
  numberLocale = "ru-RU",
  className,
  style,
}: Dashboard076Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-076-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-076-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const states = { ...STATE_TEXT, ...stateText }
  const actions = { ...ACTION_TEXT, ...actionText }
  // Отправленное выделено жирным, поэтому шаблон разрезается по метке.
  const [sentBefore, sentAfter = ""] = sentText.split("{sent}")

  return (
    <>
      <style href="vibeui-dashboard-076" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-076"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="thr">{throughput}</p>
            <button type="button" data-part="pauseall">
              {pauseAllLabel}
            </button>
          </div>

          <ul data-part="list">
            {campaigns.map((campaign) => {
              const okShare =
                ((campaign.sent - campaign.failed) / campaign.total) * 100
              const badShare = (campaign.failed / campaign.total) * 100

              return (
                <li
                  key={campaign.name}
                  data-part="row"
                  data-state={campaign.state}
                >
                  <div data-part="who">
                    <b>{campaign.name}</b>
                    <span>{campaign.audience}</span>
                  </div>

                  <span data-part="state">{states[campaign.state]}</span>

                  <div
                    data-part="track"
                    role="progressbar"
                    aria-valuenow={campaign.sent}
                    aria-valuemin={0}
                    aria-valuemax={campaign.total}
                    aria-label={trackAriaText
                      .replace("{name}", campaign.name)
                      .replace("{sent}", String(campaign.sent))
                      .replace("{total}", String(campaign.total))}
                  >
                    <span data-part="ok" style={{ width: `${okShare}%` }} />
                    <span data-part="bad" style={{ width: `${badShare}%` }} />
                  </div>

                  <p data-part="nums">
                    <span>
                      {sentBefore}
                      <b>{campaign.sent.toLocaleString(numberLocale)}</b>
                      {sentAfter.replace(
                        "{total}",
                        campaign.total.toLocaleString(numberLocale),
                      )}
                    </span>
                    <span data-bad={campaign.failed > 0}>
                      {failedText.replace("{failed}", String(campaign.failed))}
                    </span>
                    <span>{campaign.when}</span>
                    {campaign.rate ? <span>{campaign.rate}</span> : null}
                    <button type="button" data-part="act">
                      {actions[campaign.state] ?? actions.other}
                    </button>
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </>
  )
}
