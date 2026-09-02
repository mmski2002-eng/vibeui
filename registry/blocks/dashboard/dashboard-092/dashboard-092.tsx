import type { CSSProperties } from "react"

export type Dashboard092Step = {
  when: string
  what: string
  reversible: boolean
}

export type Dashboard092Fate = {
  label: string
  detail: string
  kept: boolean
}

export type Dashboard092Props = {
  title?: string
  lead?: string
  steps?: Dashboard092Step[]
  fates?: Dashboard092Fate[]
  reasons?: string[]
  exportLabel?: string
  confirmLabel?: string
  stayLabel?: string
  /** Подписи разделов и пояснений: компонент несёт русские. */
  labels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран отключения аккаунта должен быть честным, а не удерживающим.
// Поэтому вместо уговоров тут расписано, что произойдёт и когда: шаги с датами
// и пометкой, до какого момента решение обратимо. Судьба данных разложена на
// два списка — что останется и что исчезнет: обобщённое «данные будут удалены»
// не отвечает на вопрос про закрывающие документы. Выгрузка предложена до
// кнопки подтверждения, а не после: после будет поздно. Причина ухода спрошена
// радиокнопками и не обязательна — форма, которая не пускает без ответа,
// получает случайный ответ. Кнопка «остаться» стоит рядом и не выглядит
// главной: выбор должен быть настоящим.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="dashboard-092"]){
--vibeui-dashboard-092-bg:transparent;
/* Карточка списка, точка шага и чип причины: сам блок остаётся прозрачным. */
--vibeui-dashboard-092-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 255));
--vibeui-dashboard-092-inset:light-dark(oklch(0.985 0.003 255),oklch(0.22 0.012 255));
--vibeui-dashboard-092-fg:light-dark(oklch(0.21 0.014 255),oklch(0.94 0.005 255));
--vibeui-dashboard-092-muted:light-dark(oklch(0.54 0.014 255),oklch(0.72 0.012 255));
--vibeui-dashboard-092-border:light-dark(oklch(0.91 0.006 255),oklch(0.36 0.012 255));
--vibeui-dashboard-092-accent:light-dark(oklch(0.5 0.14 255),oklch(0.74 0.13 255));
--vibeui-dashboard-092-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.03 255));
--vibeui-dashboard-092-soft:light-dark(oklch(0.965 0.02 255),oklch(0.3 0.03 255));
--vibeui-dashboard-092-keep:light-dark(oklch(0.56 0.12 155),oklch(0.74 0.12 155));
--vibeui-dashboard-092-lose:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.16 25));
--vibeui-dashboard-092-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-092"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-092-bg);
color:var(--vibeui-dashboard-092-fg);
font-family:var(--vibeui-dashboard-092-sans);
border:1px solid var(--vibeui-dashboard-092-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-092"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-092"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.875rem;max-width:52rem}
[data-vibeui-block="dashboard-092"] h2{margin:0;font-size:1.25rem;font-weight:750;letter-spacing:-0.02em}
[data-vibeui-block="dashboard-092"] h3{margin:0 0 0.4375rem;font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-092-muted)}
[data-vibeui-block="dashboard-092"] [data-part="lead"]{margin:0.25rem 0 0;font-size:0.875rem;line-height:1.5;color:color-mix(in oklab,var(--vibeui-dashboard-092-fg) 85%,light-dark(white,black));max-width:58ch}
[data-vibeui-block="dashboard-092"] [data-part="steps"]{
list-style:none;margin:0;padding:0 0 0 1.0625rem;position:relative;
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="dashboard-092"] [data-part="steps"]::before{
content:"";position:absolute;left:0.25rem;top:0.5rem;bottom:0.5rem;width:1px;
background:var(--vibeui-dashboard-092-border);
}
[data-vibeui-block="dashboard-092"] [data-part="step"]{position:relative;display:flex;flex-direction:column;gap:0.0625rem}
[data-vibeui-block="dashboard-092"] [data-part="step"]::before{
content:"";position:absolute;left:-1.0625rem;top:0.3125rem;width:0.5625rem;height:0.5625rem;
border-radius:50%;background:var(--vibeui-dashboard-092-inset);
box-shadow:0 0 0 2px var(--vibeui-dashboard-092-border);
}
[data-vibeui-block="dashboard-092"] [data-part="step"][data-rev="false"]::before{
background:var(--vibeui-dashboard-092-lose);box-shadow:0 0 0 2px color-mix(in oklab,var(--vibeui-dashboard-092-lose) 30%,light-dark(white,black));
}
[data-vibeui-block="dashboard-092"] [data-part="when"]{font-size:0.6875rem;font-weight:750;color:var(--vibeui-dashboard-092-muted)}
[data-vibeui-block="dashboard-092"] [data-part="what"]{font-size:0.8125rem;line-height:1.45}
[data-vibeui-block="dashboard-092"] [data-part="norev"]{
font-size:0.625rem;font-weight:750;color:var(--vibeui-dashboard-092-lose);
}
[data-vibeui-block="dashboard-092"] [data-part="cols"]{display:grid;grid-template-columns:1fr;gap:0.5rem}
[data-vibeui-block="dashboard-092"] [data-part="fates"]{
list-style:none;margin:0;padding:0.75rem 0.8125rem;display:flex;flex-direction:column;gap:0.4375rem;
border-radius:0.875rem;background:var(--vibeui-dashboard-092-card);
border:1px solid var(--vibeui-dashboard-092-border);
}
[data-vibeui-block="dashboard-092"] [data-part="fates"] li{display:flex;gap:0.5rem;align-items:flex-start}
[data-vibeui-block="dashboard-092"] [data-part="fates"] li::before{
content:"";flex:0 0 auto;width:0.5rem;height:0.5rem;margin-top:0.3125rem;border-radius:50%;
background:var(--vibeui-dashboard-092-keep);
}
[data-vibeui-block="dashboard-092"] [data-part="fates"][data-kept="false"] li::before{
background:var(--vibeui-dashboard-092-lose);border-radius:0;transform:rotate(45deg);
}
[data-vibeui-block="dashboard-092"] [data-part="fates"] b{display:block;font-size:0.8125rem;font-weight:700}
[data-vibeui-block="dashboard-092"] [data-part="fates"] span{display:block;font-size:0.6875rem;color:var(--vibeui-dashboard-092-muted);line-height:1.4}
[data-vibeui-block="dashboard-092"] [data-part="export"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.875rem;
padding:0.75rem 0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-092-soft);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-092-accent) 25%,light-dark(white,black));
}
[data-vibeui-block="dashboard-092"] [data-part="export"] p{margin:0;font-size:0.75rem;line-height:1.45;flex:1 1 16rem}
[data-vibeui-block="dashboard-092"] [data-part="ebtn"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.4375rem 0.9375rem;border-radius:0.5625rem;
background:var(--vibeui-dashboard-092-accent);color:var(--vibeui-dashboard-092-on-accent);
}
[data-vibeui-block="dashboard-092"] fieldset{
margin:0;border:1px solid var(--vibeui-dashboard-092-border);border-radius:0.875rem;
padding:0.75rem 0.8125rem;background:var(--vibeui-dashboard-092-card);
}
[data-vibeui-block="dashboard-092"] legend{
float:left;width:100%;clear:both;padding:0;margin-bottom:0.4375rem;
font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;
color:var(--vibeui-dashboard-092-muted);
}
[data-vibeui-block="dashboard-092"] [data-part="reasons"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="dashboard-092"] [data-part="reason"]{
display:inline-flex;align-items:center;gap:0.375rem;cursor:pointer;
font-size:0.75rem;padding:0.3125rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-092-inset);border:1px solid var(--vibeui-dashboard-092-border);
}
[data-vibeui-block="dashboard-092"] [data-part="reason"]:has(input:checked){
border-color:var(--vibeui-dashboard-092-accent);font-weight:700;
}
[data-vibeui-block="dashboard-092"] input[type="radio"]{margin:0;width:0.875rem;height:0.875rem;accent-color:var(--vibeui-dashboard-092-accent)}
[data-vibeui-block="dashboard-092"] [data-part="optional"]{margin:0.4375rem 0 0;font-size:0.625rem;color:var(--vibeui-dashboard-092-muted)}
[data-vibeui-block="dashboard-092"] [data-part="final"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="dashboard-092"] [data-part="confirm"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;background:transparent;
color:var(--vibeui-dashboard-092-lose);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-092-lose) 45%,light-dark(white,black));
}
[data-vibeui-block="dashboard-092"] [data-part="stay"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;background:transparent;color:inherit;
border:1px solid var(--vibeui-dashboard-092-border);
}
[data-vibeui-block="dashboard-092"] [data-part="bye"]{
margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-092-muted);line-height:1.5;max-width:62ch;
}
[data-vibeui-block="dashboard-092"] :is(a,button,input,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-092-accent);outline-offset:2px;
}
@container (min-width: 42rem){
[data-vibeui-block="dashboard-092"] [data-part="cols"]{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`

const DEFAULT_STEPS: Dashboard092Step[] = [
  {
    when: "сразу после подтверждения",
    what: "Пространство закрывается для всех участников, вход прекращается. Списания больше не производятся.",
    reversible: true,
  },
  {
    when: "в течение суток",
    what: "Отменяются запланированные рассылки, выгрузки и сценарии автоматизации. Вебхуки перестают отправляться.",
    reversible: true,
  },
  {
    when: "через 30 дней, 14 июля",
    what: "Данные удаляются без возможности восстановления: заявки, клиенты, файлы, история изменений и журналы.",
    reversible: false,
  },
  {
    when: "через 5 лет",
    what: "Из бухгалтерии удаляются закрывающие документы — до этого срока мы обязаны их хранить по закону.",
    reversible: false,
  },
]

const DEFAULT_FATES: Dashboard092Fate[] = [
  {
    label: "Закрывающие документы",
    detail: "Останутся доступны по прямой ссылке из письма ещё 5 лет.",
    kept: true,
  },
  {
    label: "Ваша учётная запись",
    detail:
      "Останется: вы сможете войти в другое пространство по той же почте.",
    kept: true,
  },
  {
    label: "Выгрузки, которые вы скачали",
    detail: "Файлы у вас на компьютере мы, разумеется, не трогаем.",
    kept: true,
  },
  {
    label: "Заявки, клиенты и вложения",
    detail: "Будут удалены через 30 дней вместе со всей историей изменений.",
    kept: false,
  },
  {
    label: "Ключи доступа и вебхуки",
    detail:
      "Отзываются сразу: интеграции перестанут работать в момент отключения.",
    kept: false,
  },
  {
    label: "Адрес пространства",
    detail: "Освободится через 30 дней и может достаться другой команде.",
    kept: false,
  },
]

const DEFAULT_REASONS = [
  "Проект закончился",
  "Дорого",
  "Не хватает возможностей",
  "Перешли на другой сервис",
  "Слишком сложно",
  "Другое",
]

const LABELS: Record<string, string> = {
  stepsTitle: "Что произойдёт и когда",
  noRev: "это уже не отменить",
  keptTitle: "Что останется",
  lostTitle: "Что исчезнет",
  exportNote:
    "Заберите данные сейчас: архив со всеми заявками, клиентами и файлами придёт письмом в течение часа. После 14 июля выгрузить будет нечего.",
  reasonLegend: "Почему уходите?",
  optionalNote:
    "Отвечать необязательно — кнопка отключения работает и без этого.",
  byeNote:
    "Спасибо за два года работы вместе: за это время в пространстве прошло 18 402 заявки. Если вернётесь в течение 30 дней, всё будет на месте — включая настройки и сохранённые представления.",
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
 * Экран прощания при отключении аккаунта: шаги с датами и пометкой обратимости,
 * два списка «останется» и «исчезнет», выгрузка данных до кнопки подтверждения,
 * необязательная причина ухода. Один файл, ноль зависимостей, без JS.
 */
export function Dashboard092({
  title = "Отключение пространства «Северный лес»",
  lead = "Мы не будем уговаривать остаться. Ниже честно расписано, что произойдёт и когда — прочитайте, прежде чем подтверждать.",
  steps = DEFAULT_STEPS,
  fates = DEFAULT_FATES,
  reasons = DEFAULT_REASONS,
  exportLabel = "Выгрузить все данные",
  confirmLabel = "Отключить пространство",
  stayLabel = "Я передумал, остаюсь",
  labels,
  accent,
  background = "",
  className,
  style,
}: Dashboard092Props) {
  const text = { ...LABELS, ...labels }

  const palette = {
    ...(accent ? { "--vibeui-dashboard-092-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-092-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const kept = fates.filter((fate) => fate.kept)
  const lost = fates.filter((fate) => !fate.kept)

  return (
    <>
      <style href="vibeui-dashboard-092" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-092"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
          </div>

          <div>
            <h3>{text.stepsTitle}</h3>
            <ol data-part="steps">
              {steps.map((step) => (
                <li key={step.when} data-part="step" data-rev={step.reversible}>
                  <span data-part="when">{step.when}</span>
                  <span data-part="what">{step.what}</span>
                  {step.reversible ? null : (
                    <span data-part="norev">{text.noRev}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div data-part="cols">
            <div>
              <h3>{text.keptTitle}</h3>
              <ul data-part="fates" data-kept="true">
                {kept.map((fate) => (
                  <li key={fate.label}>
                    <span>
                      <b>{fate.label}</b>
                      <span>{fate.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>{text.lostTitle}</h3>
              <ul data-part="fates" data-kept="false">
                {lost.map((fate) => (
                  <li key={fate.label}>
                    <span>
                      <b>{fate.label}</b>
                      <span>{fate.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-part="export">
            <p>{text.exportNote}</p>
            <button type="button" data-part="ebtn">
              {exportLabel}
            </button>
          </div>

          <fieldset>
            <legend>{text.reasonLegend}</legend>
            <div data-part="reasons">
              {reasons.map((reason) => (
                <label key={reason} data-part="reason">
                  <input type="radio" name="dashboard-092-reason" />
                  {reason}
                </label>
              ))}
            </div>
            <p data-part="optional">{text.optionalNote}</p>
          </fieldset>

          <div data-part="final">
            <button type="button" data-part="confirm">
              {confirmLabel}
            </button>
            <button type="button" data-part="stay">
              {stayLabel}
            </button>
          </div>

          <p data-part="bye">{text.byeNote}</p>
        </div>
      </section>
    </>
  )
}
