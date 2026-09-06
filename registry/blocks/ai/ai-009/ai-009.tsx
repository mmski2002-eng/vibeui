import type { CSSProperties } from "react"

export type Ai009Argument = {
  name: string
  value: string
  note?: string
}

export type Ai009Props = {
  title?: string
  tool?: string
  intent?: string
  state?: "ok" | "running" | "failed"
  duration?: string
  args?: Ai009Argument[]
  result?: string
  resultTitle?: string
  rawTitle?: string
  raw?: string
  /** Заголовок словаря аргументов. */
  argsTitle?: string
  /** Подписи состояний вызова: ok, running, failed. */
  stateText?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: показать вызов инструмента так, чтобы человек мог его
// проверить, а не поверить на слово. Аргументы разложены в <dl> парами
// «имя — значение»: это не таблица, а именно словарь, и скринридер читает
// пару целиком. Результат лежит рядом с аргументами, а не в отдельной
// вкладке: сравнивать «что просили» и «что вернулось» приходится глазами.
//
// Состояние вызова несут и цвет, и подпись, и форма значка — на печати и
// при дальтонизме одного цвета мало. Сырой ответ спрятан в <details>:
// он нужен раз в двадцать вызовов, но когда нужен — нужен целиком.
const STYLES = `
:where([data-vibeui-block="ai-009"]){
--vibeui-ai-009-bg:transparent;
--vibeui-ai-009-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-ai-009-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-ai-009-muted:light-dark(oklch(0.53 0 265),oklch(0.69 0 265));
--vibeui-ai-009-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-ai-009-accent:light-dark(oklch(0.55 0.14 39.8),oklch(0.74 0.12 39.8));
--vibeui-ai-009-ok:light-dark(oklch(0.56 0.14 152),oklch(0.72 0.14 152));
--vibeui-ai-009-fail:light-dark(oklch(0.57 0.19 25),oklch(0.7 0.17 25));
--vibeui-ai-009-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-ai-009-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-009"]{color-scheme:dark}
[data-vibeui-block="ai-009"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-ai-009-bg);color:var(--vibeui-ai-009-fg);
font-family:var(--vibeui-ai-009-sans);
border:1px solid var(--vibeui-ai-009-border);border-radius:1rem;
}
[data-vibeui-block="ai-009"] *{box-sizing:border-box}
[data-vibeui-block="ai-009"] [data-part="shell"]{padding:1.125rem;display:grid;gap:0.875rem}
[data-vibeui-block="ai-009"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem}
[data-vibeui-block="ai-009"] h2{margin:0;font-size:0.75rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-ai-009-muted);width:100%}
[data-vibeui-block="ai-009"] [data-part="tool"]{
font-family:var(--vibeui-ai-009-mono);font-size:0.875rem;font-weight:600;
padding:0.1875rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-ai-009-soft);border:1px solid var(--vibeui-ai-009-border);
}
/* Состояние несут цвет, подпись и форма значка сразу — цвета одного мало. */
[data-vibeui-block="ai-009"] [data-part="state"]{
display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:620;
}
[data-vibeui-block="ai-009"] [data-part="glyph"]{
display:inline-flex;align-items:center;justify-content:center;
width:0.875rem;height:0.875rem;border-radius:9999px;
font-size:0.5rem;color:oklch(1 0 0);
}
[data-vibeui-block="ai-009"] [data-state="ok"] [data-part="glyph"]{background:var(--vibeui-ai-009-ok)}
[data-vibeui-block="ai-009"] [data-state="ok"]{color:var(--vibeui-ai-009-ok)}
[data-vibeui-block="ai-009"] [data-state="failed"] [data-part="glyph"]{background:var(--vibeui-ai-009-fail);border-radius:0.1875rem}
[data-vibeui-block="ai-009"] [data-state="failed"]{color:var(--vibeui-ai-009-fail)}
[data-vibeui-block="ai-009"] [data-state="running"] [data-part="glyph"]{
background:transparent;box-shadow:inset 0 0 0 2px var(--vibeui-ai-009-accent);
}
[data-vibeui-block="ai-009"] [data-state="running"]{color:var(--vibeui-ai-009-accent)}
[data-vibeui-block="ai-009"] [data-part="duration"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-ai-009-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-009"] [data-part="intent"]{
margin:0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-ai-009-muted);max-width:64ch;
}
[data-vibeui-block="ai-009"] h3{
margin:0 0 0.4375rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-ai-009-muted);
}
/* Аргументы — словарь, а не таблица: пара читается вслух целиком. */
[data-vibeui-block="ai-009"] dl{margin:0;display:grid;gap:0.3125rem}
[data-vibeui-block="ai-009"] [data-part="pair"]{
display:grid;grid-template-columns:minmax(6rem,10rem) 1fr;gap:0.625rem;
padding:0.4375rem 0.625rem;border-radius:0.5rem;background:var(--vibeui-ai-009-soft);
}
[data-vibeui-block="ai-009"] dt{
font-family:var(--vibeui-ai-009-mono);font-size:0.75rem;color:var(--vibeui-ai-009-muted);
overflow-wrap:anywhere;
}
[data-vibeui-block="ai-009"] dd{
margin:0;font-family:var(--vibeui-ai-009-mono);font-size:0.75rem;line-height:1.5;
overflow-wrap:anywhere;
}
[data-vibeui-block="ai-009"] [data-part="arg-note"]{
display:block;font-family:var(--vibeui-ai-009-sans);font-size:0.6875rem;color:var(--vibeui-ai-009-muted);
}
[data-vibeui-block="ai-009"] pre{
margin:0;padding:0.6875rem 0.8125rem;border-radius:0.625rem;
background:var(--vibeui-ai-009-soft);border:1px solid var(--vibeui-ai-009-border);
font-family:var(--vibeui-ai-009-mono);font-size:0.75rem;line-height:1.6;
white-space:pre-wrap;overflow-wrap:anywhere;
}
[data-vibeui-block="ai-009"] summary{
list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.375rem;
font-size:0.6875rem;font-weight:620;color:var(--vibeui-ai-009-accent);
}
[data-vibeui-block="ai-009"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="ai-009"] [data-part="caret"]{
width:0.3125rem;height:0.3125rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(-45deg);transition:transform .16s ease;
}
[data-vibeui-block="ai-009"] details[open] [data-part="caret"]{transform:rotate(45deg)}
[data-vibeui-block="ai-009"] details pre{margin-top:0.4375rem}
[data-vibeui-block="ai-009"] :focus-visible{outline:2px solid var(--vibeui-ai-009-accent);outline-offset:2px;border-radius:0.375rem}
@container (min-width: 42rem){
[data-vibeui-block="ai-009"] [data-part="shell"]{padding:1.375rem 1.5rem}
[data-vibeui-block="ai-009"] [data-part="panes"]{display:grid;grid-template-columns:1fr 1fr;gap:1rem;align-items:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ARGS: Ai009Argument[] = [
  { name: "category", value: '"pricing"', note: "Раздел каталога" },
  { name: "limit", value: "3", note: "Сколько блоков вернуть" },
  { name: "withDependencies", value: "false", note: "Только автономные блоки" },
]

const DEFAULT_RESULT = `[
  { "name": "pricing-001", "plans": 3, "deps": [] },
  { "name": "pricing-003", "plans": 5, "deps": [] },
  { "name": "pricing-004", "plans": 2, "deps": [] }
]`

const DEFAULT_RAW = `{
  "tool_call_id": "call_9f21",
  "status": 200,
  "elapsed_ms": 418,
  "cached": false
}`

const GLYPHS = { ok: "✓", running: "", failed: "!" }

const DEFAULT_STATE_TEXT: Record<string, string> = {
  ok: "Выполнен",
  running: "Выполняется",
  failed: "Ошибка вызова",
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
 * Карточка вызова инструмента: аргументы словарём, результат рядом,
 * сырой ответ в details. Один файл, ноль зависимостей.
 */
export function Ai009({
  title = "Вызов инструмента",
  tool = "catalog.search",
  intent = "Ассистент искал блоки тарифов без внешних зависимостей, чтобы предложить их в ответе.",
  state = "ok",
  duration = "418 мс",
  args = DEFAULT_ARGS,
  result = DEFAULT_RESULT,
  resultTitle = "Результат",
  rawTitle = "Сырой ответ",
  raw = DEFAULT_RAW,
  argsTitle = "Аргументы",
  stateText = DEFAULT_STATE_TEXT,
  accent,
  background = "",
  className,
  style,
}: Ai009Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-009" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-009"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <code data-part="tool">{tool}</code>
            <span data-part="state" data-state={state}>
              <span data-part="glyph" aria-hidden="true">
                {GLYPHS[state]}
              </span>
              {stateText[state] ?? DEFAULT_STATE_TEXT[state]}
            </span>
            <span data-part="duration">{duration}</span>
          </header>

          <p data-part="intent">{intent}</p>

          <div data-part="panes">
            <div>
              <h3>{argsTitle}</h3>
              <dl>
                {args.map((argument) => (
                  <div key={argument.name} data-part="pair">
                    <dt>{argument.name}</dt>
                    <dd>
                      {argument.value}
                      {argument.note ? (
                        <span data-part="arg-note">{argument.note}</span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3>{resultTitle}</h3>
              <pre>{result}</pre>
            </div>
          </div>

          <details>
            <summary>
              <span data-part="caret" aria-hidden="true" />
              {rawTitle}
            </summary>
            <pre>{raw}</pre>
          </details>
        </div>
      </section>
    </>
  )
}
