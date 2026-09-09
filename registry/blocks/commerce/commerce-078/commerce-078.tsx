import type { CSSProperties } from "react"

export type Commerce078Level = {
  id: string
  name: string
  from: string
  cashback: string
  perks: string[]
  current?: boolean
}

export type Commerce078Props = {
  kicker?: string
  member?: string
  levelName?: string
  points?: string
  spent?: string
  toNext?: string
  progress?: number
  keepUntil?: string
  pointsLabel?: string
  spentLabel?: string
  toNextLabel?: string
  progressFrom?: string
  /** Строка прогресса: {percent} — доля до следующего уровня. */
  progressTemplate?: string
  progressAria?: string
  levelsTitle?: string
  levels?: Commerce078Level[]
  currentLabel?: string
  cta?: string
  rulesTitle?: string
  rules?: string[]
  accent?: string
  /** Оттенок тёмной плиты. Светлой её сделать нельзя: текст рассчитан на тёмный фон. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: программа лояльности, где уровень — это не значок, а срок.
// Дата, до которой уровень сохраняется, стоит рядом с полосой прогресса:
// без неё «золотой статус» читается как навсегда, и его потеря выглядит
// обманом. Уровни сравниваются колонками с одинаковым набором строк,
// текущий помечен словом и рамкой, а не только фоном.
//
// Палитра намеренно одноцветная: тёмная плита с золотым акцентом — это и есть
// вид клубной карты, и блок остаётся тёмным на светлой странице тоже. Поэтому
// light-dark() здесь не применяется, а background меняет оттенок плиты, но не
// делает её светлой.
const STYLES = `
:where([data-vibeui-block="commerce-078"]){
--vibeui-commerce-078-bg:light-dark(oklch(0.985 0 285),oklch(0.21 0 285));
--vibeui-commerce-078-panel:light-dark(oklch(1 0 0),oklch(0.27 0 285));
--vibeui-commerce-078-fg:light-dark(oklch(0.22 0 285),oklch(0.97 0 285));
--vibeui-commerce-078-muted:light-dark(oklch(0.5 0 285),oklch(0.73 0 285));
--vibeui-commerce-078-border:light-dark(oklch(0.9 0 285),oklch(0.37 0 285));
--vibeui-commerce-078-accent:light-dark(oklch(0.55 0.16 39.8),oklch(0.82 0.14 39.8));
--vibeui-commerce-078-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="commerce-078"]{color-scheme:dark}
[data-vibeui-block="commerce-078"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-commerce-078-bg);
color:var(--vibeui-commerce-078-fg);font-family:var(--vibeui-commerce-078-sans);
}
[data-vibeui-block="commerce-078"] *{box-sizing:border-box}
[data-vibeui-block="commerce-078"] [data-part="shell"]{max-width:62rem;margin:0 auto;padding:1.75rem 1rem 2.25rem}
[data-vibeui-block="commerce-078"] [data-part="kicker"]{margin:0;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-commerce-078-accent)}
[data-vibeui-block="commerce-078"] [data-part="member"]{margin:0.375rem 0 0;font-size:0.8125rem;color:var(--vibeui-commerce-078-muted)}
[data-vibeui-block="commerce-078"] h2{margin:0.125rem 0 1rem;font-size:clamp(1.5rem,5.5cqi,2.5rem);line-height:1.05;letter-spacing:-0.03em}
[data-vibeui-block="commerce-078"] [data-part="stats"]{display:grid;gap:0.625rem;grid-template-columns:repeat(2,minmax(0,1fr));margin-bottom:1rem}
[data-vibeui-block="commerce-078"] [data-part="stat"]{border:1px solid var(--vibeui-commerce-078-border);border-radius:0.875rem;padding:0.75rem 0.875rem;background:var(--vibeui-commerce-078-panel)}
[data-vibeui-block="commerce-078"] [data-part="slabel"]{display:block;font-size:0.6875rem;letter-spacing:0.05em;text-transform:uppercase;color:var(--vibeui-commerce-078-muted)}
[data-vibeui-block="commerce-078"] [data-part="svalue"]{display:block;margin-top:0.1875rem;font-size:1.5rem;font-weight:750;font-variant-numeric:tabular-nums;line-height:1}
[data-vibeui-block="commerce-078"] [data-part="progress"]{border:1px solid var(--vibeui-commerce-078-border);border-radius:1rem;padding:1rem 1.125rem;background:var(--vibeui-commerce-078-panel);margin-bottom:1.5rem}
[data-vibeui-block="commerce-078"] [data-part="ptop"]{display:flex;flex-wrap:wrap;gap:0.375rem 0.75rem;justify-content:space-between;font-size:0.8125rem;margin-bottom:0.5rem}
[data-vibeui-block="commerce-078"] [data-part="ptop"] strong{font-weight:750}
[data-vibeui-block="commerce-078"] [data-part="track"]{height:0.625rem;border-radius:9999px;background:var(--vibeui-commerce-078-border);overflow:hidden}
[data-vibeui-block="commerce-078"] [data-part="fill"]{display:block;height:100%;border-radius:9999px;background:var(--vibeui-commerce-078-accent);width:var(--vibeui-commerce-078-done,0%)}
[data-vibeui-block="commerce-078"] [data-part="keep"]{margin:0.625rem 0 0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-commerce-078-muted)}
[data-vibeui-block="commerce-078"] h3{margin:0 0 0.75rem;font-size:0.6875rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-commerce-078-muted)}
[data-vibeui-block="commerce-078"] [data-part="levels"]{list-style:none;margin:0 0 1.5rem;padding:0;display:grid;gap:0.75rem;grid-template-columns:1fr}
[data-vibeui-block="commerce-078"] [data-part="level"]{
border:1px solid var(--vibeui-commerce-078-border);border-radius:1rem;padding:0.875rem 1rem;background:var(--vibeui-commerce-078-panel);
}
[data-vibeui-block="commerce-078"] [data-part="level"][data-current]{border-color:var(--vibeui-commerce-078-accent);box-shadow:inset 0 0 0 1px var(--vibeui-commerce-078-accent)}
[data-vibeui-block="commerce-078"] [data-part="lrow"]{display:flex;flex-wrap:wrap;gap:0.375rem;align-items:baseline}
[data-vibeui-block="commerce-078"] [data-part="lname"]{margin:0;font-size:1rem;font-weight:700}
[data-vibeui-block="commerce-078"] [data-part="now"]{
padding:0.0625rem 0.4375rem;border-radius:0.3125rem;background:var(--vibeui-commerce-078-accent);
color:oklch(0.21 0 285);font-size:0.625rem;font-weight:750;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="commerce-078"] [data-part="lfrom"]{margin:0.1875rem 0 0;font-size:0.75rem;color:var(--vibeui-commerce-078-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-078"] [data-part="lcash"]{margin:0.5rem 0 0.5rem;font-size:1.375rem;font-weight:750;color:var(--vibeui-commerce-078-accent);font-variant-numeric:tabular-nums}
[data-vibeui-block="commerce-078"] [data-part="perks"]{list-style:none;margin:0;padding:0;display:grid;gap:0.3125rem}
[data-vibeui-block="commerce-078"] [data-part="perks"] li{display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-commerce-078-muted)}
[data-vibeui-block="commerce-078"] [data-part="perks"] li::before{content:"·";flex:none;color:var(--vibeui-commerce-078-accent);font-weight:800}
[data-vibeui-block="commerce-078"] [data-part="go"]{
appearance:none;border:0;cursor:pointer;height:2.875rem;padding:0 1.75rem;border-radius:0.875rem;
background:var(--vibeui-commerce-078-accent);color:oklch(0.21 0 285);font:inherit;font-size:0.9375rem;font-weight:750;
}
[data-vibeui-block="commerce-078"] [data-part="go"]:focus-visible,
[data-vibeui-block="commerce-078"] summary:focus-visible{outline:2px solid var(--vibeui-commerce-078-accent);outline-offset:2px}
[data-vibeui-block="commerce-078"] details{margin-top:1rem;font-size:0.75rem;color:var(--vibeui-commerce-078-muted)}
[data-vibeui-block="commerce-078"] summary{cursor:pointer;font-weight:650;border-radius:0.25rem}
[data-vibeui-block="commerce-078"] [data-part="rules"]{list-style:none;margin:0.625rem 0 0;padding:0;display:grid;gap:0.375rem;max-width:60ch}
[data-vibeui-block="commerce-078"] [data-part="rules"] li{display:flex;gap:0.5rem;line-height:1.5}
[data-vibeui-block="commerce-078"] [data-part="rules"] li::before{content:"—";flex:none;color:var(--vibeui-commerce-078-accent)}
@container (min-width: 34rem){
[data-vibeui-block="commerce-078"] [data-part="stats"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@container (min-width: 50rem){
[data-vibeui-block="commerce-078"] [data-part="shell"]{padding:3rem 2rem}
[data-vibeui-block="commerce-078"] [data-part="levels"]{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="commerce-078"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LEVELS: Commerce078Level[] = [
  {
    id: "1",
    name: "Бронза",
    from: "с первой покупки",
    cashback: "1% баллами",
    perks: [
      "Бесплатная доставка от 5 000 ₽",
      "Возврат 14 дней",
      "Доступ к распродажам в общий день",
    ],
  },
  {
    id: "2",
    name: "Серебро",
    from: "от 60 000 ₽ за год",
    cashback: "3% баллами",
    perks: [
      "Бесплатная доставка от 2 000 ₽",
      "Возврат 30 дней",
      "Ранний доступ к распродажам за сутки",
      "Продление брони в пункте выдачи",
    ],
    current: true,
  },
  {
    id: "3",
    name: "Золото",
    from: "от 200 000 ₽ за год",
    cashback: "6% баллами",
    perks: [
      "Бесплатная доставка всегда",
      "Возврат 60 дней",
      "Ранний доступ к распродажам за трое суток",
      "Персональный менеджер и подбор по фото",
    ],
  },
]

const DEFAULT_RULES = [
  "Уровень считается по сумме заказов за последние 12 месяцев, а не за календарный год.",
  "Баллы начисляются через 14 дней после получения — после того, как истечёт срок возврата.",
  "Балл равен рублю и списывается не более чем на 30% суммы заказа.",
  "Баллы сгорают через год после начисления, дата видна в истории начислений.",
]

/**
 * Страница программы лояльности: уровень с датой удержания, прогресс до
 * следующего и сравнение уровней. Один файл, ноль зависимостей.
 */
export function Commerce078({
  kicker = "Клуб покупателей",
  member = "Анна Ремизова · в клубе с марта 2021",
  levelName = "Серебряный уровень",
  points = "2 480",
  spent = "148 300 ₽",
  toNext = "51 700 ₽",
  progress = 74,
  keepUntil = "Уровень сохраняется до 30 апреля 2025 года. Чтобы удержать его, за 12 месяцев нужно набрать 60 000 ₽ — сейчас у вас 148 300 ₽.",
  pointsLabel = "Баллов на счету",
  spentLabel = "Покупок за год",
  toNextLabel = "До золота",
  progressFrom = "Серебро",
  progressTemplate = "{percent}% до золота",
  progressAria = "Прогресс до следующего уровня",
  levelsTitle = "Что дают уровни",
  levels = DEFAULT_LEVELS,
  currentLabel = "Ваш уровень",
  cta = "Потратить баллы",
  rulesTitle = "Правила начисления",
  rules = DEFAULT_RULES,
  accent,
  background = "",
  className,
  style,
}: Commerce078Props) {
  const clamped = Math.max(0, Math.min(100, progress))
  const [percentBefore, percentAfter = ""] = progressTemplate.split("{percent}")
  const palette = {
    "--vibeui-commerce-078-done": `${clamped}%`,
    ...(accent ? { "--vibeui-commerce-078-accent": accent } : null),
    ...(background ? { "--vibeui-commerce-078-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-commerce-078" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="commerce-078"
        className={className}
        style={palette}
        aria-label={levelName}
      >
        <div data-part="shell">
          <p data-part="kicker">{kicker}</p>
          <h2>{levelName}</h2>
          <p data-part="member">{member}</p>

          <div data-part="stats">
            <div data-part="stat">
              <span data-part="slabel">{pointsLabel}</span>
              <span data-part="svalue">{points}</span>
            </div>
            <div data-part="stat">
              <span data-part="slabel">{spentLabel}</span>
              <span data-part="svalue">{spent}</span>
            </div>
            <div data-part="stat">
              <span data-part="slabel">{toNextLabel}</span>
              <span data-part="svalue">{toNext}</span>
            </div>
          </div>

          <div data-part="progress">
            <p data-part="ptop">
              <span>{progressFrom}</span>
              <span>
                {percentBefore}
                <strong>{clamped}</strong>
                {percentAfter}
              </span>
            </p>
            <div
              data-part="track"
              role="progressbar"
              aria-valuenow={clamped}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={progressAria}
            >
              <span data-part="fill" />
            </div>
            <p data-part="keep">{keepUntil}</p>
          </div>

          <h3>{levelsTitle}</h3>
          <ul data-part="levels">
            {levels.map((level) => (
              <li
                key={level.id}
                data-part="level"
                data-current={level.current ? "true" : undefined}
              >
                <div data-part="lrow">
                  <p data-part="lname">{level.name}</p>
                  {level.current ? (
                    <span data-part="now">{currentLabel}</span>
                  ) : null}
                </div>
                <p data-part="lfrom">{level.from}</p>
                <p data-part="lcash">{level.cashback}</p>
                <ul data-part="perks">
                  {level.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <button type="button" data-part="go">
            {cta}
          </button>

          <details>
            <summary>{rulesTitle}</summary>
            <ul data-part="rules">
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </>
  )
}
