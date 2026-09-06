import type { CSSProperties } from "react"

export type Dashboard044Incident = {
  code: string
  level: "P1" | "P2" | "P3"
  title: string
  service: string
  started: string
  duration: string
  owner: string
  update: string
  updated: string
}

export type Dashboard044Props = {
  title?: string
  onDuty?: string
  dutyUntil?: string
  incidents?: Dashboard044Incident[]
  takeLabel?: string
  escalateLabel?: string
  handoverLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись перед ответственным. */
  ownerLabel?: string
  /** Шаблон подсказки приоритета: {level} и {duration}. */
  levelTitleText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: список инцидентов, где приоритет — не цветная точка, а колонка
// слева с кодом P1/P2/P3 и заливкой всей плашки: код читается вслух, переживает
// печать и не спорит с дальтонизмом. Дежурный вынесен в шапку вместе со
// временем окончания смены, потому что вопрос «кому звонить сейчас» задают
// раньше, чем «что сломалось». Последнее обновление показано текстом с
// временем: без него список инцидентов выглядит замершим.
const STYLES = `
:where([data-vibeui-block="dashboard-044"]){
--vibeui-dashboard-044-bg:transparent;
/* Карточки и плашка обновления: подложка блока прозрачна, и рисовать их ею нечем. */
--vibeui-dashboard-044-card:light-dark(oklch(1 0 0),oklch(0.26 0.012 20));
--vibeui-dashboard-044-soft:light-dark(oklch(0.97 0.005 20),oklch(0.22 0.012 20));
--vibeui-dashboard-044-fg:light-dark(oklch(0.22 0.014 20),oklch(0.94 0.005 20));
--vibeui-dashboard-044-muted:light-dark(oklch(0.55 0.014 20),oklch(0.72 0.012 20));
--vibeui-dashboard-044-border:light-dark(oklch(0.91 0.007 20),oklch(0.36 0.012 20));
--vibeui-dashboard-044-p1:light-dark(oklch(0.55 0.2 39.8),oklch(0.7 0.18 39.8));
--vibeui-dashboard-044-p2:light-dark(oklch(0.64 0.16 39.8),oklch(0.78 0.14 39.8));
--vibeui-dashboard-044-p3:light-dark(oklch(0.55 0.06 39.8),oklch(0.7 0.06 39.8));
--vibeui-dashboard-044-accent:light-dark(oklch(0.55 0.15 39.8),oklch(0.72 0.15 39.8));
/* Текст на цветной заливке: в тёмной ветке заливки светлее фона. */
--vibeui-dashboard-044-on-fill:light-dark(oklch(1 0 0),oklch(0.2 0.03 25));
--vibeui-dashboard-044-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-044"]{color-scheme:dark}
[data-vibeui-block="dashboard-044"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-044-bg);
color:var(--vibeui-dashboard-044-fg);
font-family:var(--vibeui-dashboard-044-sans);
border:1px solid var(--vibeui-dashboard-044-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-044"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-044"] [data-part="shell"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-044"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem 0.875rem;
}
[data-vibeui-block="dashboard-044"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-044"] [data-part="duty"]{
display:flex;align-items:center;gap:0.5rem;margin-left:auto;
padding:0.375rem 0.625rem 0.375rem 0.375rem;border-radius:9999px;
background:var(--vibeui-dashboard-044-card);
border:1px solid var(--vibeui-dashboard-044-border);
}
[data-vibeui-block="dashboard-044"] [data-part="face"]{
width:1.75rem;height:1.75rem;border-radius:50%;flex:none;display:grid;place-items:center;
font-size:0.6875rem;font-weight:800;
background:color-mix(in oklab,var(--vibeui-dashboard-044-accent) 18%,var(--vibeui-dashboard-044-card));
color:var(--vibeui-dashboard-044-accent);
}
[data-vibeui-block="dashboard-044"] [data-part="dutyText"]{display:grid;line-height:1.25}
[data-vibeui-block="dashboard-044"] [data-part="dutyText"] b{font-size:0.75rem;font-weight:750}
[data-vibeui-block="dashboard-044"] [data-part="dutyText"] span{font-size:0.625rem;color:var(--vibeui-dashboard-044-muted)}
[data-vibeui-block="dashboard-044"] [data-part="hand"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:650;padding:0.4375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-044-border);background:var(--vibeui-dashboard-044-card);color:inherit;
}
[data-vibeui-block="dashboard-044"] [data-part="list"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-block="dashboard-044"] article{
display:grid;grid-template-columns:2.75rem 1fr;gap:0 0.75rem;
background:var(--vibeui-dashboard-044-card);
border:1px solid var(--vibeui-dashboard-044-border);border-radius:0.875rem;overflow:hidden;
}
[data-vibeui-block="dashboard-044"] [data-part="level"]{
grid-row:1/-1;display:grid;place-items:center;align-content:center;gap:0.125rem;
padding:0.75rem 0;color:var(--vibeui-dashboard-044-on-fill);font-size:0.8125rem;font-weight:800;letter-spacing:0.02em;
}
[data-vibeui-block="dashboard-044"] article[data-level="P1"] [data-part="level"]{background:var(--vibeui-dashboard-044-p1)}
[data-vibeui-block="dashboard-044"] article[data-level="P2"] [data-part="level"]{background:var(--vibeui-dashboard-044-p2)}
[data-vibeui-block="dashboard-044"] article[data-level="P3"] [data-part="level"]{background:var(--vibeui-dashboard-044-p3)}
[data-vibeui-block="dashboard-044"] [data-part="clock"]{
font-size:0.5625rem;font-weight:700;opacity:0.9;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-044"] [data-part="top"]{
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.625rem;padding:0.75rem 0.875rem 0 0;
}
[data-vibeui-block="dashboard-044"] h3{margin:0;font-size:0.875rem;font-weight:750;flex:1 1 12rem}
[data-vibeui-block="dashboard-044"] [data-part="code"]{
font-size:0.6875rem;color:var(--vibeui-dashboard-044-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-044"] [data-part="meta"]{
margin:0.25rem 0.875rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-044-muted);
}
[data-vibeui-block="dashboard-044"] [data-part="owner"]{font-weight:750;color:var(--vibeui-dashboard-044-fg)}
[data-vibeui-block="dashboard-044"] [data-part="update"]{
margin:0.5rem 0.875rem 0 0;padding:0.4375rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-044-soft);
font-size:0.75rem;line-height:1.45;
}
[data-vibeui-block="dashboard-044"] [data-part="stamp"]{
display:block;margin-top:0.1875rem;font-size:0.625rem;color:var(--vibeui-dashboard-044-muted);
}
[data-vibeui-block="dashboard-044"] [data-part="acts"]{
grid-column:2;display:flex;flex-wrap:wrap;gap:0.5rem;padding:0.625rem 0.875rem 0.75rem 0;
}
[data-vibeui-block="dashboard-044"] [data-part="take"]{
appearance:none;border:0;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:700;padding:0.4375rem 0.8125rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-044-accent);color:var(--vibeui-dashboard-044-on-fill);
}
[data-vibeui-block="dashboard-044"] [data-part="up"]{
appearance:none;cursor:pointer;font:inherit;
font-size:0.75rem;font-weight:650;padding:0.4375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-dashboard-044-border);background:var(--vibeui-dashboard-044-card);color:inherit;
}
[data-vibeui-block="dashboard-044"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-044-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-044"] article{grid-template-columns:3.25rem 1fr auto}
[data-vibeui-block="dashboard-044"] [data-part="acts"]{
grid-column:3;grid-row:1/-1;align-content:center;flex-direction:column;padding:0.75rem 0.875rem;
}
}
`

const DEFAULT_INCIDENTS: Dashboard044Incident[] = [
  {
    code: "ИНЦ-2041",
    level: "P1",
    title: "Платежи не проходят у части клиентов",
    service: "Платёжный шлюз",
    started: "начало 12:04",
    duration: "1 ч 18 мин",
    owner: "Мария Соловьёва",
    update:
      "Нашли причину: провайдер отклоняет платежи с картами одного банка. Переключаем трафик на резервного провайдера.",
    updated: "обновлено 6 минут назад",
  },
  {
    code: "ИНЦ-2042",
    level: "P2",
    title: "Отчёты формируются дольше десяти минут",
    service: "Отчёты и выгрузки",
    started: "начало 10:37",
    duration: "2 ч 45 мин",
    owner: "Игорь Панов",
    update:
      "Очередь построения отчётов забита ночным перерасчётом. Ждём завершения, новые отчёты встают в очередь.",
    updated: "обновлено 24 минуты назад",
  },
  {
    code: "ИНЦ-2039",
    level: "P3",
    title: "Не приходят письма о смене пароля",
    service: "Почтовая рассылка",
    started: "начало вчера, 17:12",
    duration: "19 ч",
    owner: "не назначен",
    update:
      "Часть писем осела в спаме у одного почтового провайдера. Готовим настройку подписи домена.",
    updated: "обновлено 3 часа назад",
  },
]

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
 * Страница инцидентов: дежурный в шапке и список инцидентов с приоритетом,
 * длительностью, ответственным и последним обновлением. Один файл, ноль
 * зависимостей, клиентского JS нет.
 */
export function Dashboard044({
  title = "Инциденты",
  onDuty = "Мария Соловьёва",
  dutyUntil = "дежурит до 20:00",
  incidents = DEFAULT_INCIDENTS,
  takeLabel = "Взять себе",
  escalateLabel = "Эскалировать",
  handoverLabel = "Передать смену",
  accent,
  background = "",
  ownerLabel = "ответственный",
  levelTitleText = "Приоритет {level}, идёт {duration}",
  className,
  style,
}: Dashboard044Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-044-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-044-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const initials = onDuty
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")

  return (
    <>
      <style href="vibeui-dashboard-044" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-044"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
            <p data-part="duty">
              <span data-part="face" aria-hidden="true">
                {initials}
              </span>
              <span data-part="dutyText">
                <b>{onDuty}</b>
                <span>{dutyUntil}</span>
              </span>
            </p>
            <button type="button" data-part="hand">
              {handoverLabel}
            </button>
          </div>

          <div data-part="list">
            {incidents.map((incident) => (
              <article key={incident.code} data-level={incident.level}>
                <span
                  data-part="level"
                  title={levelTitleText
                    .replace("{level}", incident.level)
                    .replace("{duration}", incident.duration)}
                >
                  {incident.level}
                  <span data-part="clock">{incident.duration}</span>
                </span>

                <div data-part="top">
                  <h3>{incident.title}</h3>
                  <span data-part="code">{incident.code}</span>
                </div>

                <p data-part="meta">
                  {incident.service} · {incident.started} · {ownerLabel}{" "}
                  <span data-part="owner">{incident.owner}</span>
                </p>

                <p data-part="update">
                  {incident.update}
                  <span data-part="stamp">{incident.updated}</span>
                </p>

                <div data-part="acts">
                  <button type="button" data-part="take">
                    {takeLabel}
                  </button>
                  <button type="button" data-part="up">
                    {escalateLabel}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
