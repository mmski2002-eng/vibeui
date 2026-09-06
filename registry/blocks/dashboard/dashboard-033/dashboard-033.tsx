import type { CSSProperties } from "react"

export type Dashboard033Step = {
  title: string
  text: string
  minutes?: number
  done?: boolean
  action?: string
  open?: boolean
}

export type Dashboard033Props = {
  title?: string
  lead?: string
  steps?: Dashboard033Step[]
  skipLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
  /** Подпись кольца готовности для скринридера. */
  progressLabel?: string
  /** Отметка выполненного шага вместо оценки времени. */
  doneText?: string
  /** Шаблон оценки времени: {minutes}. */
  minutesText?: string
  /** Шаблон итоговой строки: {minutes} и {steps}. */
  footText?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: чек-лист запуска, который не занимает экран целиком. Каждый шаг
// свёрнут в details и раскрывается по требованию, поэтому список из семи
// пунктов читается как список, а не как страница инструкции. У шага стоит
// оценка времени: «пять минут» решает вопрос «начинать сейчас или потом»
// лучше любого призыва. Кольцо прогресса считается из массива, а сделанный
// шаг помечен галочкой и зачёркнутым заголовком — цвета одного мало.
const STYLES = `
:where([data-vibeui-block="dashboard-033"]){
--vibeui-dashboard-033-bg:transparent;
--vibeui-dashboard-033-panel:light-dark(oklch(0.985 0 265),oklch(0.27 0 265));
/* Кнопка сделанного шага: подложка блока прозрачна, и рисовать её нечем. */
--vibeui-dashboard-033-card:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-dashboard-033-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dashboard-033-muted:light-dark(oklch(0.55 0 265),oklch(0.71 0 265));
--vibeui-dashboard-033-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-dashboard-033-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-dashboard-033-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-dashboard-033-done:light-dark(oklch(0.55 0.14 152),oklch(0.76 0.14 152));
--vibeui-dashboard-033-on-done:light-dark(oklch(1 0 0),oklch(0.19 0.03 152));
--vibeui-dashboard-033-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-033"]{color-scheme:dark}
[data-vibeui-block="dashboard-033"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;
background:var(--vibeui-dashboard-033-bg);
color:var(--vibeui-dashboard-033-fg);
font-family:var(--vibeui-dashboard-033-sans);
border:1px solid var(--vibeui-dashboard-033-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-033"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-033"] [data-part="shell"]{padding:1.125rem}
[data-vibeui-block="dashboard-033"] [data-part="head"]{
display:grid;grid-template-columns:auto 1fr;gap:0.25rem 0.875rem;align-items:center;
margin-bottom:1rem;
}
[data-vibeui-block="dashboard-033"] [data-part="ring"]{
grid-row:span 2;position:relative;width:3.75rem;height:3.75rem;border-radius:9999px;
background:conic-gradient(var(--vibeui-dashboard-033-done) var(--vibeui-dashboard-033-p),var(--vibeui-dashboard-033-border) 0);
-webkit-mask:radial-gradient(circle,transparent 60%,black 61%);
mask:radial-gradient(circle,transparent 60%,black 61%);
}
[data-vibeui-block="dashboard-033"] [data-part="ringtext"]{
position:absolute;inset:0;display:grid;place-content:center;
font-size:0.75rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-033"] h2{margin:0;font-size:1.0625rem;font-weight:700;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-033"] [data-part="lead"]{
margin:0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-dashboard-033-muted);
}
[data-vibeui-block="dashboard-033"] ol{list-style:none;margin:0;padding:0;display:grid;gap:0.5rem}
[data-vibeui-block="dashboard-033"] [data-part="step"]{
background:var(--vibeui-dashboard-033-panel);
border:1px solid var(--vibeui-dashboard-033-border);border-radius:0.875rem;
overflow:hidden;
}
[data-vibeui-block="dashboard-033"] summary{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.625rem;
padding:0.625rem 0.75rem;cursor:pointer;list-style:none;
}
[data-vibeui-block="dashboard-033"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-033"] summary:focus-visible{
outline:2px solid var(--vibeui-dashboard-033-accent);outline-offset:-2px;
}
/* Галочка и зачёркивание: цвет один не отличает сделанное от текущего. */
[data-vibeui-block="dashboard-033"] [data-part="tick"]{
width:1.125rem;height:1.125rem;flex:none;border-radius:9999px;
display:grid;place-items:center;font-size:0.625rem;font-weight:700;
color:var(--vibeui-dashboard-033-on-done);background:var(--vibeui-dashboard-033-done);
}
[data-vibeui-block="dashboard-033"] [data-done="false"] [data-part="tick"]{
background:none;color:var(--vibeui-dashboard-033-muted);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-033-border);
}
[data-vibeui-block="dashboard-033"] [data-part="steptitle"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="dashboard-033"] [data-done="true"] [data-part="steptitle"]{
text-decoration:line-through;color:var(--vibeui-dashboard-033-muted);
}
[data-vibeui-block="dashboard-033"] [data-part="minutes"]{
margin-left:auto;font-size:0.6875rem;font-weight:650;white-space:nowrap;
color:var(--vibeui-dashboard-033-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="dashboard-033"] [data-part="body"]{
padding:0 0.75rem 0.75rem 2.5rem;
}
[data-vibeui-block="dashboard-033"] [data-part="text"]{
margin:0 0 0.5rem;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-dashboard-033-muted);
}
[data-vibeui-block="dashboard-033"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:650;
padding:0.4375rem 0.75rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-033-accent);color:var(--vibeui-dashboard-033-on-accent);
}
[data-vibeui-block="dashboard-033"] [data-done="true"] [data-part="go"]{
background:var(--vibeui-dashboard-033-card);color:var(--vibeui-dashboard-033-muted);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-033-border);
}
[data-vibeui-block="dashboard-033"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;margin-top:0.875rem;
font-size:0.75rem;color:var(--vibeui-dashboard-033-muted);
}
[data-vibeui-block="dashboard-033"] [data-part="skip"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0.25rem;
font:inherit;font-size:0.75rem;font-weight:650;color:var(--vibeui-dashboard-033-accent);
border-radius:0.375rem;
}
[data-vibeui-block="dashboard-033"] button:focus-visible{
outline:2px solid var(--vibeui-dashboard-033-accent);outline-offset:2px;
}
@container (min-width: 44rem){
[data-vibeui-block="dashboard-033"] [data-part="shell"]{padding:1.375rem}
[data-vibeui-block="dashboard-033"] [data-part="body"]{padding-right:6rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-033"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Dashboard033Step[] = [
  {
    title: "Подтвердить рабочую почту",
    text: "Письмо ушло на anna@vibeui.ru. Без подтверждения не приходят уведомления о сборках и счетах.",
    minutes: 1,
    done: true,
    action: "Отправить письмо снова",
  },
  {
    title: "Создать первый проект",
    text: "Проект — это набор блоков и участников. Один проект на один сайт: так права и история не перемешиваются.",
    minutes: 2,
    done: true,
    action: "Открыть проект",
  },
  {
    title: "Установить первый блок",
    text: "Выберите блок в каталоге, нажмите «Copy for AI» и отдайте промпт агенту. Компонент придёт в проект тем же файлом, который вы видели в превью.",
    minutes: 5,
    open: true,
    action: "Открыть каталог",
  },
  {
    title: "Пригласить команду",
    text: "Роль «редактор» правит блоки, «читатель» только смотрит. Владелец остаётся один и отвечает за оплату.",
    minutes: 3,
    action: "Пригласить участников",
  },
  {
    title: "Подключить репозиторий",
    text: "Сборка каталога будет запускаться сама на каждый push в основную ветку.",
    minutes: 4,
    action: "Подключить GitHub",
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
 * Чек-лист онбординга: шаги свёрнуты в details, у каждого оценка времени,
 * прогресс считается из массива. Один файл, ноль зависимостей.
 */
export function Dashboard033({
  title = "Первые шаги",
  lead = "Пять коротких дел, после которых VibeUI начнёт приносить пользу. Можно вернуться позже — прогресс сохраняется.",
  steps = DEFAULT_STEPS,
  skipLabel = "Скрыть чек-лист",
  accent,
  background = "",
  progressLabel = "Готовность чек-листа",
  doneText = "сделано",
  minutesText = "≈ {minutes} мин",
  footText = "Осталось примерно {minutes} мин на {steps} шага",
  className,
  style,
}: Dashboard033Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-033-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-033-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const done = steps.filter((step) => step.done).length
  const percent = Math.round((done / Math.max(1, steps.length)) * 100)
  const left = steps
    .filter((step) => !step.done)
    .reduce((sum, step) => sum + (step.minutes ?? 0), 0)

  return (
    <>
      <style href="vibeui-dashboard-033" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-033"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <div
              data-part="ring"
              style={
                { "--vibeui-dashboard-033-p": `${percent}%` } as CSSProperties
              }
              role="progressbar"
              aria-valuenow={done}
              aria-valuemin={0}
              aria-valuemax={steps.length}
              aria-label={progressLabel}
            >
              <span data-part="ringtext">
                {done}/{steps.length}
              </span>
            </div>
            <h2>{title}</h2>
            <p data-part="lead">{lead}</p>
          </header>

          <ol>
            {steps.map((step) => (
              <li key={step.title}>
                <details
                  data-part="step"
                  data-done={step.done ? "true" : "false"}
                  open={step.open}
                >
                  <summary>
                    <span data-part="tick" aria-hidden="true">
                      {step.done ? "✓" : ""}
                    </span>
                    <span data-part="steptitle">{step.title}</span>
                    {step.minutes ? (
                      <span data-part="minutes">
                        {step.done
                          ? doneText
                          : minutesText.replace(
                              "{minutes}",
                              String(step.minutes),
                            )}
                      </span>
                    ) : null}
                  </summary>
                  <div data-part="body">
                    <p data-part="text">{step.text}</p>
                    {step.action ? (
                      <button type="button" data-part="go">
                        {step.action}
                      </button>
                    ) : null}
                  </div>
                </details>
              </li>
            ))}
          </ol>

          <p data-part="foot">
            <span>
              {footText
                .replace("{minutes}", String(left))
                .replace("{steps}", String(steps.length - done))}
            </span>
            <button type="button" data-part="skip">
              {skipLabel}
            </button>
          </p>
        </div>
      </section>
    </>
  )
}
