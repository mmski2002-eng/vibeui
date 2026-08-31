import type { CSSProperties } from "react"

export type Commerce066Step = {
  id: string
  title: string
  text: string
}

export type Commerce066Props = {
  status?: string
  reason?: string
  explain?: string
  amount?: string
  method?: string
  attemptedAt?: string
  attemptedAtIso?: string
  code?: string
  stepsTitle?: string
  steps?: Commerce066Step[]
  retry?: string
  otherCard?: string
  holdNote?: string
  support?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: экран отказа в оплате, который объясняет причину и даёт
// следующий шаг. «Платёж не прошёл» без причины отправляет человека в
// поддержку, поэтому причина набрана крупнее статуса, а код банка лежит
// отдельной строкой — его спрашивают в банке. Про удержание средств
// сказано прямо: именно из-за него пишут в чат через минуту после отказа.
const STYLES = `
:where([data-vibeui-block="commerce-066"]){
--vibeui-commerce-066-bg:oklch(0.985 0.008 30);
--vibeui-commerce-066-card:oklch(1 0 0);
--vibeui-commerce-066-fg:oklch(0.2 0.014 30);
--vibeui-commerce-066-muted:oklch(0.52 0.016 30);
--vibeui-commerce-066-border:oklch(0.9 0.01 30);
--vibeui-commerce-066-accent:oklch(0.53 0.19 25);
--vibeui-commerce-066-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-commerce-066-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
[data-vibeui-block="commerce-066"]{
box-sizing:border-box;background:var(--vibeui-commerce-066-bg);
color:var(--vibeui-commerce-066-fg);font-family:var(--vibeui-commerce-066-sans);
}
[data-vibeui-block="commerce-066"] *{box-sizing:border-box}
[data-vibeui-block="commerce-066"] [data-part="shell"]{max-width:40rem;margin:0 auto;padding:1.75rem 1rem 2.25rem}
[data-vibeui-block="commerce-066"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.5rem;height:1.875rem;padding:0 0.875rem;border-radius:9999px;
background:var(--vibeui-commerce-066-accent);color:oklch(0.99 0 0);
font-size:0.75rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
}
[data-vibeui-block="commerce-066"] h2{margin:0.875rem 0 0.5rem;font-size:clamp(1.25rem,4.5cqi,1.875rem);line-height:1.15;letter-spacing:-0.025em}
[data-vibeui-block="commerce-066"] [data-part="explain"]{margin:0 0 1.25rem;max-width:52ch;font-size:0.9375rem;line-height:1.55;color:var(--vibeui-commerce-066-muted)}
[data-vibeui-block="commerce-066"] [data-part="card"]{
border:1px solid var(--vibeui-commerce-066-border);border-radius:1rem;padding:0.875rem 1rem;
background:var(--vibeui-commerce-066-card);margin-bottom:1.25rem;
}
[data-vibeui-block="commerce-066"] dl{margin:0;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:0.4375rem 0.75rem;font-size:0.8125rem}
[data-vibeui-block="commerce-066"] [data-part="pair"]{display:contents}
[data-vibeui-block="commerce-066"] dt{color:var(--vibeui-commerce-066-muted);min-width:0}
[data-vibeui-block="commerce-066"] dd{margin:0;text-align:right;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-066"] [data-part="code"]{font-family:var(--vibeui-commerce-066-mono);user-select:all}
[data-vibeui-block="commerce-066"] h3{margin:0 0 0.625rem;font-size:0.75rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--vibeui-commerce-066-muted)}
[data-vibeui-block="commerce-066"] ol{list-style:none;margin:0 0 1.25rem;padding:0;display:grid;gap:0.625rem;counter-reset:vibeui-commerce-066-step}
[data-vibeui-block="commerce-066"] [data-part="step"]{display:flex;gap:0.75rem;align-items:flex-start;counter-increment:vibeui-commerce-066-step}
[data-vibeui-block="commerce-066"] [data-part="step"]::before{
content:counter(vibeui-commerce-066-step);flex:none;width:1.5rem;height:1.5rem;border-radius:0.5rem;
display:flex;align-items:center;justify-content:center;background:var(--vibeui-commerce-066-card);
border:1px solid var(--vibeui-commerce-066-border);font-size:0.6875rem;font-weight:750;
}
[data-vibeui-block="commerce-066"] [data-part="stitle"]{display:block;font-size:0.875rem;font-weight:650}
[data-vibeui-block="commerce-066"] [data-part="stext"]{display:block;margin-top:0.125rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-066-muted)}
[data-vibeui-block="commerce-066"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="commerce-066"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.875rem;padding:0 1.625rem;border-radius:0.875rem;
background:var(--vibeui-commerce-066-accent);color:oklch(0.99 0 0);font:inherit;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="commerce-066"] [data-part="alt"]{
appearance:none;cursor:pointer;height:2.875rem;padding:0 1.25rem;border-radius:0.875rem;
border:1px solid var(--vibeui-commerce-066-border);background:var(--vibeui-commerce-066-card);
color:inherit;font:inherit;font-size:0.9375rem;font-weight:650;
}
[data-vibeui-block="commerce-066"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-066"] [data-part="alt"]:focus-visible,
[data-vibeui-block="commerce-066"] [data-part="support"] a:focus-visible{outline:2px solid var(--vibeui-commerce-066-accent);outline-offset:2px}
[data-vibeui-block="commerce-066"] [data-part="hold"]{
margin:1rem 0 0;padding:0.6875rem 0.875rem;border-radius:0.75rem;border:1px dashed var(--vibeui-commerce-066-border);
background:var(--vibeui-commerce-066-card);font-size:0.8125rem;line-height:1.5;color:var(--vibeui-commerce-066-muted);
}
[data-vibeui-block="commerce-066"] [data-part="support"]{margin:0.75rem 0 0;font-size:0.75rem;line-height:1.5;color:var(--vibeui-commerce-066-muted)}
[data-vibeui-block="commerce-066"] [data-part="support"] a{color:var(--vibeui-commerce-066-accent);font-weight:650}
@container (min-width: 38rem){
[data-vibeui-block="commerce-066"] [data-part="shell"]{padding:2.5rem 2rem 3rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-066"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Commerce066Step[] = [
  {
    id: "1",
    title: "Проверьте лимит на интернет-покупки",
    text: "Чаще всего банк отклоняет платёж из-за суточного лимита. Он меняется в приложении банка за минуту.",
  },
  {
    id: "2",
    title: "Убедитесь, что на карте хватает средств",
    text: "Учитывайте комиссию банка и уже замороженные суммы по другим покупкам.",
  },
  {
    id: "3",
    title: "Попробуйте другую карту",
    text: "Заказ сохранён на 30 минут: товары в нём зарезервированы и не уйдут другим покупателям.",
  },
]

/**
 * Экран отказа в оплате: причина крупнее статуса, код банка отдельной
 * строкой, шаги и срок брони. Один файл, ноль зависимостей.
 */
export function Commerce066({
  status = "Платёж отклонён",
  reason = "Банк не пропустил операцию: превышен лимит на интернет-покупки",
  explain = "Деньги с карты не списаны. Заказ мы сохранили — попробуйте оплатить ещё раз после того, как поднимете лимит, или выберите другую карту.",
  amount = "62 580 ₽",
  method = "Мир •• 4821",
  attemptedAt = "11 марта, 14:07",
  attemptedAtIso = "2024-03-11T14:07:00+03:00",
  code = "51 · insufficient_limit",
  stepsTitle = "Что можно сделать",
  steps = DEFAULT_STEPS,
  retry = "Повторить оплату",
  otherCard = "Оплатить другой картой",
  holdNote = "Иногда банк ненадолго удерживает сумму по отклонённой операции. Это не списание: деньги возвращаются на карту в течение 3–5 рабочих дней автоматически.",
  support = "Если ошибка повторяется, назовите код операции в поддержке — по нему видно ответ банка.",
  accent,
  className,
  style,
}: Commerce066Props) {
  const palette = {
    ...(accent ? { "--vibeui-commerce-066-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-066" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-066"
        className={className}
        style={palette}
        aria-label={status}
      >
        <div data-part="shell">
          <p>
            <span data-part="badge">{status}</span>
          </p>
          <h2>{reason}</h2>
          <p data-part="explain">{explain}</p>

          <div data-part="card">
            <dl>
              <div data-part="pair">
                <dt>Сумма</dt>
                <dd>{amount}</dd>
              </div>
              <div data-part="pair">
                <dt>Карта</dt>
                <dd>{method}</dd>
              </div>
              <div data-part="pair">
                <dt>Время попытки</dt>
                <dd>
                  <time dateTime={attemptedAtIso}>{attemptedAt}</time>
                </dd>
              </div>
              <div data-part="pair">
                <dt>Код ответа банка</dt>
                <dd data-part="code">{code}</dd>
              </div>
            </dl>
          </div>

          <h3>{stepsTitle}</h3>
          <ol>
            {steps.map((step) => (
              <li key={step.id} data-part="step">
                <span>
                  <span data-part="stitle">{step.title}</span>
                  <span data-part="stext">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <div data-part="actions">
            <button type="button" data-part="go">
              {retry}
            </button>
            <button type="button" data-part="alt">
              {otherCard}
            </button>
          </div>

          <p data-part="hold">{holdNote}</p>
          <p data-part="support">
            {support} <a href="#support">Написать в поддержку</a>
          </p>
        </div>
      </section>
    </>
  )
}
