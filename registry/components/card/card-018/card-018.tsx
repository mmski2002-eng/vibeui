import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card018Props = Omit<
  ComponentPropsWithoutRef<"article">,
  "children" | "title"
> & {
  name?: string
  price?: string
  /** Период после цены: «в месяц», «за место». */
  period?: string
  tagline?: string
  /** Что входит. Три-пять пунктов: длинный список никто не сравнивает. */
  features?: string[]
  /** Выделенный вариант получает ленту, акцентную рамку и подложку. */
  featured?: boolean
  /** Надпись на ленте выделенного варианта. */
  ribbon?: string
  actionLabel?: string
  /** Мелкая строка под кнопкой: условия, отмена, пробный период. */
  note?: string
  accent?: string
}

// Идея компонента: карточка тарифа, у которой есть рекомендованное
// состояние. Выделение сделано не отдельным компонентом, а флагом featured:
// одна разметка, разные акценты — иначе два тарифа неизбежно разъедутся
// по вёрстке. Подложка выделенного варианта остаётся светлой: тёмная
// карточка в ряду светлых читается как отключённая, а не как главная.
const STYLES = `
:where([data-vibeui-block="card-018"]){
--vibeui-card-018-bg:oklch(1 0 0);
--vibeui-card-018-fg:oklch(0.22 0.015 265);
--vibeui-card-018-muted:oklch(0.55 0.013 265);
--vibeui-card-018-border:oklch(0.91 0.006 265);
--vibeui-card-018-accent:oklch(0.55 0.19 275);
--vibeui-card-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="card-018"]{
position:relative;display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:1.25rem 1.25rem 1.375rem;
background:var(--vibeui-card-018-bg);color:var(--vibeui-card-018-fg);
border:1px solid var(--vibeui-card-018-border);border-radius:1rem;
font-family:var(--vibeui-card-018-font);
}
/* Выделение: акцентная рамка, лёгкая подложка и лента. Три признака вместо
   одного — рамку в ряду карточек легко не заметить. */
[data-vibeui-block="card-018"][data-featured="true"]{
border-color:color-mix(in oklab,var(--vibeui-card-018-accent) 55%,var(--vibeui-card-018-border));
background:linear-gradient(180deg,
color-mix(in oklab,var(--vibeui-card-018-accent) 7%,oklch(1 0 0)),
oklch(1 0 0) 55%);
box-shadow:0 14px 32px -22px color-mix(in oklab,var(--vibeui-card-018-accent) 70%,transparent);
}
[data-vibeui-block="card-018"] [data-part="ribbon"]{
position:absolute;inset-block-start:-0.6875rem;inset-inline-start:1.25rem;
display:inline-flex;align-items:center;height:1.375rem;padding:0 0.5625rem;
border-radius:9999px;background:var(--vibeui-card-018-accent);color:oklch(0.99 0 0);
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="card-018"] [data-part="name"]{
margin:0;font-size:0.8125rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-card-018-muted);
}
[data-vibeui-block="card-018"][data-featured="true"] [data-part="name"]{
color:color-mix(in oklab,var(--vibeui-card-018-accent) 75%,oklch(0.2 0.02 265));
}
[data-vibeui-block="card-018"] [data-part="price"]{
display:flex;align-items:baseline;gap:0.3125rem;margin:0;
}
[data-vibeui-block="card-018"] [data-part="amount"]{
font-size:2rem;font-weight:700;line-height:1;letter-spacing:-0.03em;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-018"] [data-part="period"]{font-size:0.8125rem;color:var(--vibeui-card-018-muted)}
[data-vibeui-block="card-018"] [data-part="tagline"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-card-018-muted);
}
[data-vibeui-block="card-018"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.4375rem;
margin:0.125rem 0 0;padding:0.875rem 0 0;list-style:none;
border-top:1px solid var(--vibeui-card-018-border);
}
[data-vibeui-block="card-018"] [data-part="feature"]{
display:flex;align-items:flex-start;gap:0.4375rem;font-size:0.8125rem;line-height:1.4;
}
[data-vibeui-block="card-018"] [data-part="feature"] svg{
flex:none;width:0.875rem;height:0.875rem;margin-top:0.1875rem;
color:var(--vibeui-card-018-accent);
}
[data-vibeui-block="card-018"] [data-part="action"]{
appearance:none;cursor:pointer;margin-top:auto;
height:2.375rem;border-radius:0.625rem;border:1px solid var(--vibeui-card-018-border);
background:oklch(1 0 0);color:var(--vibeui-card-018-fg);
font:inherit;font-size:0.875rem;font-weight:650;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="card-018"][data-featured="true"] [data-part="action"]{
border-color:transparent;background:var(--vibeui-card-018-accent);color:oklch(0.99 0 0);
}
[data-vibeui-block="card-018"] [data-part="action"]:hover{
border-color:color-mix(in oklab,var(--vibeui-card-018-accent) 45%,var(--vibeui-card-018-border));
}
[data-vibeui-block="card-018"][data-featured="true"] [data-part="action"]:hover{
background:color-mix(in oklab,var(--vibeui-card-018-accent) 85%,oklch(0.2 0.02 265));
}
[data-vibeui-block="card-018"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-card-018-accent);outline-offset:2px;
}
[data-vibeui-block="card-018"] [data-part="note"]{
margin:0;text-align:center;font-size:0.6875rem;line-height:1.4;
color:var(--vibeui-card-018-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-018"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FEATURES = [
  "Весь каталог компонентов",
  "Copy for AI без ограничений",
  "Обновления блоков целый год",
  "Коммерческая лицензия",
]

/**
 * Карточка тарифа с выделенным рекомендованным состоянием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card018({
  name = "Команда",
  price = "1 900 ₽",
  period = "в месяц",
  tagline = "Для тех, кто собирает интерфейсы каждую неделю.",
  features = DEFAULT_FEATURES,
  featured = true,
  ribbon = "Чаще всего берут",
  actionLabel = "Выбрать тариф",
  note = "Отмена в один клик, деньги за неиспользованный месяц возвращаются.",
  accent,
  className,
  style,
  ...props
}: Card018Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-018" precedence="medium">
        {STYLES}
      </style>
      <article
        {...props}
        data-vibeui-block="card-018"
        data-featured={featured}
        className={className}
        style={palette}
      >
        {featured && ribbon ? <span data-part="ribbon">{ribbon}</span> : null}
        <h3 data-part="name">{name}</h3>
        <p data-part="price">
          <span data-part="amount">{price}</span>
          {period ? <span data-part="period">{period}</span> : null}
        </p>
        {tagline ? <p data-part="tagline">{tagline}</p> : null}
        <ul data-part="list">
          {features.map((feature) => (
            <li key={feature} data-part="feature">
              <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2.5 7.4 5.4 10.3 11.5 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button data-part="action" type="button">
          {actionLabel}
        </button>
        {note ? <p data-part="note">{note}</p> : null}
      </article>
    </>
  )
}
