import type { CSSProperties } from "react"

export type Ai003Step = {
  title: string
  detail?: string
  state?: "done" | "running" | "waiting" | "failed"
  meta?: string
  log?: string[]
}

export type Ai003Props = {
  title?: string
  goal?: string
  steps?: Ai003Step[]
  approveLabel?: string
  stopLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: лента шагов агента — что он уже сделал, что делает сейчас и чего
// ждёт. Состояние передаётся формой значка, а не одним цветом: выполненное —
// галочка, текущее — кольцо, ожидание — пустой кружок, ошибка — квадрат.
// Подробности каждого шага лежат в details: раскрытие держит браузер, и лента
// не превращается в стену текста. Кнопка остановки стоит рядом с подтверждением
// и оформлена нейтрально: она нужна в момент сомнения, а не для украшения.
const STYLES = `
:where([data-vibeui-block="ai-003"]){
--vibeui-ai-003-bg:oklch(1 0 0);
--vibeui-ai-003-fg:oklch(0.22 0.014 265);
--vibeui-ai-003-muted:oklch(0.55 0.014 265);
--vibeui-ai-003-border:oklch(0.91 0.006 265);
--vibeui-ai-003-line:oklch(0.9 0.006 265);
--vibeui-ai-003-code:oklch(0.97 0.003 265);
--vibeui-ai-003-accent:oklch(0.55 0.2 262);
--vibeui-ai-003-done:oklch(0.58 0.14 152);
--vibeui-ai-003-fail:oklch(0.57 0.19 25);
--vibeui-ai-003-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-ai-003-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-003"]{
box-sizing:border-box;padding:1rem;
background:var(--vibeui-ai-003-bg);
border:1px solid var(--vibeui-ai-003-border);border-radius:1rem;
font-family:var(--vibeui-ai-003-sans);color:var(--vibeui-ai-003-fg);
}
[data-vibeui-block="ai-003"] *{box-sizing:border-box}
[data-vibeui-block="ai-003"] h2{margin:0 0 0.125rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="ai-003"] [data-part="goal"]{margin:0 0 0.875rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-ai-003-muted)}
[data-vibeui-block="ai-003"] ol{list-style:none;margin:0 0 0.875rem;padding:0}
/* Линия — левый бордюр шага: отдельный столбик торчит за последней точкой. */
[data-vibeui-block="ai-003"] li{
position:relative;padding:0 0 0.875rem 1.5rem;
border-left:2px solid var(--vibeui-ai-003-line);
}
[data-vibeui-block="ai-003"] li:last-child{border-left-color:transparent;padding-bottom:0}
/* Форма значка несёт состояние: цвет один читается не всеми и не на печати. */
[data-vibeui-block="ai-003"] [data-part="dot"]{
position:absolute;left:-0.4375rem;top:0.125rem;
display:inline-flex;align-items:center;justify-content:center;
width:0.75rem;height:0.75rem;border-radius:9999px;
background:var(--vibeui-ai-003-bg);
box-shadow:inset 0 0 0 2px var(--vibeui-ai-003-line);
font-size:0.5rem;line-height:1;color:oklch(1 0 0);
}
[data-vibeui-block="ai-003"] [data-state="done"] [data-part="dot"]{background:var(--vibeui-ai-003-done);box-shadow:none}
[data-vibeui-block="ai-003"] [data-state="running"] [data-part="dot"]{box-shadow:inset 0 0 0 3px var(--vibeui-ai-003-accent)}
[data-vibeui-block="ai-003"] [data-state="failed"] [data-part="dot"]{
background:var(--vibeui-ai-003-fail);border-radius:0.1875rem;box-shadow:none;
}
[data-vibeui-block="ai-003"] [data-part="title"]{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="ai-003"] [data-state="waiting"] [data-part="title"]{color:var(--vibeui-ai-003-muted);font-weight:600}
[data-vibeui-block="ai-003"] [data-part="detail"]{margin:0.125rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-ai-003-muted)}
[data-vibeui-block="ai-003"] [data-part="meta"]{
display:inline-block;margin-top:0.25rem;
font-size:0.6875rem;color:var(--vibeui-ai-003-muted);font-variant-numeric:tabular-nums;
}
/* Подробности в details: лента не превращается в стену текста. */
[data-vibeui-block="ai-003"] summary{
list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.25rem;
margin-top:0.375rem;font-size:0.6875rem;color:var(--vibeui-ai-003-accent);
}
[data-vibeui-block="ai-003"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="ai-003"] summary:focus-visible{outline:2px solid var(--vibeui-ai-003-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="ai-003"] details[open] summary [data-part="caret"]{transform:rotate(45deg) translate(-0.0625rem,-0.0625rem)}
[data-vibeui-block="ai-003"] [data-part="caret"]{
width:0.3125rem;height:0.3125rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(-45deg);
}
[data-vibeui-block="ai-003"] pre{
margin:0.375rem 0 0;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-ai-003-code);
font-family:var(--vibeui-ai-003-mono);font-size:0.6875rem;line-height:1.6;
white-space:pre-wrap;overflow-wrap:anywhere;
}
[data-vibeui-block="ai-003"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="ai-003"] button{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;
border-radius:0.625rem;font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-003"] [data-part="approve"]{border:0;background:var(--vibeui-ai-003-accent);color:oklch(1 0 0)}
/* Остановка нейтральна: она нужна в момент сомнения, а не для украшения. */
[data-vibeui-block="ai-003"] [data-part="stop"]{
border:1px solid var(--vibeui-ai-003-border);background:none;color:inherit;
}
[data-vibeui-block="ai-003"] button:focus-visible{outline:2px solid var(--vibeui-ai-003-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Ai003Step[] = [
  {
    title: "Разобрал задачу",
    detail: "Лендинг студии: hero, преимущества, тарифы, форма заявки.",
    state: "done",
    meta: "2 с",
  },
  {
    title: "Подобрал блоки каталога",
    detail:
      "hero-002, features-001, pricing-001 и cta-001 — все без зависимостей.",
    state: "done",
    meta: "4 с",
    log: [
      "GET /r/hero-002.json  200",
      "GET /r/features-001.json  200",
      "GET /r/pricing-001.json  200",
    ],
  },
  {
    title: "Ставит блоки в проект",
    detail: "Копирует файлы в components/vibeui и проверяет сборку.",
    state: "running",
    meta: "идёт",
  },
  {
    title: "Свяжет тексты и акцент",
    detail: "Подставит контент из брифа и один акцентный цвет на все блоки.",
    state: "waiting",
  },
]

/**
 * Лента шагов агента: состояние формой значка, подробности в details.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Ai003({
  title = "Ход работы агента",
  goal = "Собрать лендинг студии из блоков каталога и подставить тексты из брифа.",
  steps = DEFAULT_STEPS,
  approveLabel = "Продолжить",
  stopLabel = "Остановить",
  accent,
  className,
  style,
}: Ai003Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-003" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-003"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="goal">{goal}</p>

        <ol>
          {steps.map((step) => (
            <li key={step.title} data-state={step.state ?? "waiting"}>
              <span data-part="dot" aria-hidden="true">
                {step.state === "done" ? "✓" : null}
              </span>
              <p data-part="title">{step.title}</p>
              {step.detail ? <p data-part="detail">{step.detail}</p> : null}
              {step.meta ? <span data-part="meta">{step.meta}</span> : null}
              {step.log?.length ? (
                <details>
                  <summary>
                    <span data-part="caret" aria-hidden="true" />
                    Подробности
                  </summary>
                  <pre>{step.log.join("\n")}</pre>
                </details>
              ) : null}
            </li>
          ))}
        </ol>

        <div data-part="actions">
          <button type="button" data-part="approve">
            {approveLabel}
          </button>
          <button type="button" data-part="stop">
            {stopLabel}
          </button>
        </div>
      </section>
    </>
  )
}
