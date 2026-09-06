import type { CSSProperties } from "react"

export type Ai017Props = {
  title?: string
  explanation?: string
  code?: string
  attempt?: string
  steps?: string[]
  /** Заголовок над списком шагов. */
  stepsTitle?: string
  retryLabel?: string
  switchLabel?: string
  detailsLabel?: string
  details?: string
  draftLabel?: string
  draft?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран ошибки, после которого человек знает, что делать.
// «Что-то пошло не так» — это тупик, поэтому здесь три части: что случилось
// человеческими словами, что можно сделать прямо сейчас и технические
// подробности для того, кто пойдёт в поддержку.
//
// Главное — сохранённый черновик запроса: потерять набранный абзац из-за
// чужого сбоя обиднее самой ошибки, поэтому текст показан рядом с кнопкой
// повтора. Блок объявлен role="alert": ошибка должна быть услышана сразу,
// а не найдена прокруткой. Код ошибки выделен и пригоден для копирования —
// именно его спросят в поддержке.
const STYLES = `
:where([data-vibeui-block="ai-017"]){
--vibeui-ai-017-bg:transparent;
--vibeui-ai-017-soft:light-dark(oklch(0.975 0 265),oklch(0.26 0 265));
--vibeui-ai-017-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-ai-017-muted:light-dark(oklch(0.53 0 265),oklch(0.7 0 265));
--vibeui-ai-017-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-ai-017-accent:light-dark(oklch(0.52 0.17 39.8),oklch(0.74 0.14 39.8));
--vibeui-ai-017-on-accent:oklch(0.15 0.02 39.8);
--vibeui-ai-017-alarm:light-dark(oklch(0.57 0.19 25),oklch(0.73 0.16 25));
--vibeui-ai-017-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-ai-017-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-017"]{color-scheme:dark}
[data-vibeui-block="ai-017"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-ai-017-bg);color:var(--vibeui-ai-017-fg);
font-family:var(--vibeui-ai-017-sans);
border:1px solid color-mix(in oklab,var(--vibeui-ai-017-alarm) 32%,var(--vibeui-ai-017-border));
border-radius:1.125rem;
}
[data-vibeui-block="ai-017"] *{box-sizing:border-box}
[data-vibeui-block="ai-017"] [data-part="shell"]{padding:1.25rem;display:grid;gap:0.9375rem;max-width:46rem}
[data-vibeui-block="ai-017"] [data-part="head"]{display:flex;align-items:flex-start;gap:0.6875rem}
[data-vibeui-block="ai-017"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:0.6875rem;
background:color-mix(in oklab,var(--vibeui-ai-017-alarm) 14%,transparent);
color:var(--vibeui-ai-017-alarm);font-size:1.0625rem;font-weight:700;
}
[data-vibeui-block="ai-017"] h2{margin:0;font-size:1rem;font-weight:680;line-height:1.35}
[data-vibeui-block="ai-017"] [data-part="meta"]{
display:flex;flex-wrap:wrap;gap:0.375rem;margin-top:0.375rem;
}
/* Код ошибки выделен и копируется: именно его спросят в поддержке. */
[data-vibeui-block="ai-017"] [data-part="code"]{
padding:0.0625rem 0.4375rem;border-radius:0.375rem;user-select:all;
background:var(--vibeui-ai-017-soft);border:1px solid var(--vibeui-ai-017-border);
font-family:var(--vibeui-ai-017-mono);font-size:0.6875rem;color:var(--vibeui-ai-017-muted);
}
[data-vibeui-block="ai-017"] [data-part="explanation"]{
margin:0;max-width:62ch;font-size:0.875rem;line-height:1.65;
}
[data-vibeui-block="ai-017"] h3{
margin:0 0 0.4375rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-ai-017-muted);
}
[data-vibeui-block="ai-017"] ol{margin:0;padding-left:1.125rem;display:grid;gap:0.3125rem}
[data-vibeui-block="ai-017"] li{font-size:0.8125rem;line-height:1.55}
/* Черновик рядом с повтором: потерять набранный абзац обиднее самой ошибки. */
[data-vibeui-block="ai-017"] [data-part="draft"]{
margin:0;padding:0.6875rem 0.8125rem;border-radius:0.75rem;
background:var(--vibeui-ai-017-soft);border:1px dashed var(--vibeui-ai-017-border);
font-size:0.8125rem;line-height:1.6;color:var(--vibeui-ai-017-muted);
}
[data-vibeui-block="ai-017"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="ai-017"] button{
appearance:none;cursor:pointer;height:2.25rem;padding:0 1rem;border-radius:0.75rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-017"] [data-part="retry"]{border:0;background:var(--vibeui-ai-017-accent);color:var(--vibeui-ai-017-on-accent)}
[data-vibeui-block="ai-017"] [data-part="switch"]{border:1px solid var(--vibeui-ai-017-border);background:none;color:inherit}
[data-vibeui-block="ai-017"] summary{
list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:620;color:var(--vibeui-ai-017-muted);
}
[data-vibeui-block="ai-017"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="ai-017"] [data-part="caret"]{
width:0.3125rem;height:0.3125rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(-45deg);transition:transform .16s ease;
}
[data-vibeui-block="ai-017"] details[open] [data-part="caret"]{transform:rotate(45deg)}
[data-vibeui-block="ai-017"] pre{
margin:0.4375rem 0 0;padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-ai-017-soft);border:1px solid var(--vibeui-ai-017-border);
font-family:var(--vibeui-ai-017-mono);font-size:0.6875rem;line-height:1.6;
white-space:pre-wrap;overflow-wrap:anywhere;
}
[data-vibeui-block="ai-017"] :focus-visible{outline:2px solid var(--vibeui-ai-017-accent);outline-offset:2px;border-radius:0.375rem}
@container (min-width: 40rem){
[data-vibeui-block="ai-017"] [data-part="shell"]{padding:1.5rem 1.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = [
  "Повторите запрос: сбой чаще всего разовый и проходит с первой попытки.",
  "Если повторяется — переключитесь на быструю модель, она сейчас отвечает.",
  "Не помогло — назовите в поддержке код ошибки и время из этого экрана.",
]

const DEFAULT_DETAILS = `model: precise-2
request_id: req_8c41d9
http_status: 503
message: upstream temporarily unavailable
retry_after: 12s`

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
 * Экран ошибки модели: объяснение, шаги, сохранённый черновик и повтор.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai017({
  title = "Модель не ответила",
  explanation = "Запрос ушёл, но сервис модели вернул отказ и не начал отвечать. Расход токенов за эту попытку не списан, черновик запроса сохранён целиком.",
  code = "503 · req_8c41d9",
  attempt = "Попытка 2 из 3 · 14:07",
  steps = DEFAULT_STEPS,
  stepsTitle = "Что можно сделать",
  retryLabel = "Повторить запрос",
  switchLabel = "Сменить модель",
  detailsLabel = "Технические подробности",
  details = DEFAULT_DETAILS,
  draftLabel = "Ваш запрос сохранён",
  draft = "Собери страницу тарифов: три плана, годовая скидка переключателем и блок вопросов снизу.",
  accent,
  background = "",
  className,
  style,
}: Ai017Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-017" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-017"
        className={className}
        style={palette}
        role="alert"
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <span data-part="mark" aria-hidden="true">
              !
            </span>
            <div>
              <h2>{title}</h2>
              <div data-part="meta">
                <span data-part="code">{code}</span>
                <span data-part="code">{attempt}</span>
              </div>
            </div>
          </header>

          <p data-part="explanation">{explanation}</p>

          <div>
            <h3>{stepsTitle}</h3>
            <ol>
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h3>{draftLabel}</h3>
            <p data-part="draft">{draft}</p>
          </div>

          <div data-part="actions">
            <button type="button" data-part="retry">
              {retryLabel}
            </button>
            <button type="button" data-part="switch">
              {switchLabel}
            </button>
          </div>

          <details>
            <summary>
              <span data-part="caret" aria-hidden="true" />
              {detailsLabel}
            </summary>
            <pre>{details}</pre>
          </details>
        </div>
      </section>
    </>
  )
}
