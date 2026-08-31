import type { CSSProperties } from "react"

export type Dashboard034Template = {
  name: string
  text: string
  blocks: string
  recommended?: boolean
}

export type Dashboard034Props = {
  title?: string
  lead?: string
  templates?: Dashboard034Template[]
  picked?: string
  cta?: string
  importLabel?: string
  helpLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: пустое рабочее пространство, которое не спрашивает «что вы
// хотите сделать», а предлагает три готовых старта. Выбор собран на нативных
// радиокнопках: выбранная карточка подсвечивается через :has(), состояние
// держит браузер, клавиатура и форма работают без единой строки JS. Один
// вариант помечен как рекомендуемый и выбран заранее — пустой экран с тремя
// равными вариантами останавливает так же, как экран без вариантов вообще.
// Импорт и справка стоят отдельно и намеренно тише главной кнопки.
const STYLES = `
:where([data-vibeui-block="dashboard-034"]){
--vibeui-dashboard-034-bg:oklch(0.985 0.003 265);
--vibeui-dashboard-034-card:oklch(1 0 0);
--vibeui-dashboard-034-fg:oklch(0.22 0.014 265);
--vibeui-dashboard-034-muted:oklch(0.55 0.014 265);
--vibeui-dashboard-034-border:oklch(0.91 0.006 265);
--vibeui-dashboard-034-accent:oklch(0.55 0.2 262);
--vibeui-dashboard-034-pick:oklch(0.97 0.02 262);
--vibeui-dashboard-034-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-034"]{
box-sizing:border-box;
background:var(--vibeui-dashboard-034-bg);
color:var(--vibeui-dashboard-034-fg);
font-family:var(--vibeui-dashboard-034-sans);
border:1px solid var(--vibeui-dashboard-034-border);border-radius:1rem;
}
[data-vibeui-block="dashboard-034"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-034"] [data-part="shell"]{
max-width:52rem;margin:0 auto;padding:2rem 1.125rem;text-align:center;
}
[data-vibeui-block="dashboard-034"] [data-part="art"]{
width:4.5rem;height:3.25rem;margin:0 auto 1rem;position:relative;
border:2px dashed var(--vibeui-dashboard-034-border);border-radius:0.625rem;
}
[data-vibeui-block="dashboard-034"] [data-part="art"]::before,
[data-vibeui-block="dashboard-034"] [data-part="art"]::after{
content:"";position:absolute;left:0.625rem;height:0.375rem;border-radius:9999px;
background:var(--vibeui-dashboard-034-border);
}
[data-vibeui-block="dashboard-034"] [data-part="art"]::before{top:0.75rem;width:2.25rem}
[data-vibeui-block="dashboard-034"] [data-part="art"]::after{top:1.5rem;width:1.375rem}
[data-vibeui-block="dashboard-034"] h2{margin:0 0 0.375rem;font-size:1.375rem;font-weight:700;letter-spacing:-0.02em}
[data-vibeui-block="dashboard-034"] [data-part="lead"]{
margin:0 auto 1.25rem;max-width:34rem;font-size:0.875rem;line-height:1.6;
color:var(--vibeui-dashboard-034-muted);
}
[data-vibeui-block="dashboard-034"] fieldset{border:0;margin:0;padding:0}
[data-vibeui-block="dashboard-034"] legend{
padding:0;margin:0 0 0.625rem;width:100%;
font-size:0.625rem;font-weight:650;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-dashboard-034-muted);
}
[data-vibeui-block="dashboard-034"] [data-part="cards"]{
display:grid;grid-template-columns:1fr;gap:0.625rem;text-align:left;
}
[data-vibeui-block="dashboard-034"] [data-part="card"]{
display:block;position:relative;cursor:pointer;
background:var(--vibeui-dashboard-034-card);
border:1px solid var(--vibeui-dashboard-034-border);border-radius:0.875rem;
padding:0.875rem;
}
/* Подсветка выбранной карточки через :has(): состояние держит радиокнопка. */
[data-vibeui-block="dashboard-034"] [data-part="card"]:has(input:checked){
border-color:var(--vibeui-dashboard-034-accent);
background:var(--vibeui-dashboard-034-pick);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-034-accent);
}
[data-vibeui-block="dashboard-034"] [data-part="card"]:has(input:focus-visible){
outline:2px solid var(--vibeui-dashboard-034-accent);outline-offset:2px;
}
[data-vibeui-block="dashboard-034"] input[type="radio"]{
position:absolute;top:0.875rem;right:0.875rem;margin:0;
width:1rem;height:1rem;accent-color:var(--vibeui-dashboard-034-accent);
}
[data-vibeui-block="dashboard-034"] [data-part="name"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0 1.5rem 0.25rem 0;font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="dashboard-034"] [data-part="best"]{
font-size:0.5625rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
padding:0.0625rem 0.375rem;border-radius:9999px;
color:oklch(1 0 0);background:var(--vibeui-dashboard-034-accent);
}
[data-vibeui-block="dashboard-034"] [data-part="text"]{
display:block;margin:0;font-size:0.75rem;line-height:1.5;
color:var(--vibeui-dashboard-034-muted);
}
[data-vibeui-block="dashboard-034"] [data-part="blocks"]{
display:block;margin-top:0.4375rem;font-size:0.6875rem;font-weight:650;
color:var(--vibeui-dashboard-034-muted);
}
[data-vibeui-block="dashboard-034"] [data-part="actions"]{
display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:0.625rem;
margin-top:1.25rem;
}
[data-vibeui-block="dashboard-034"] [data-part="cta"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:650;
padding:0.625rem 1.125rem;border-radius:0.625rem;
background:var(--vibeui-dashboard-034-accent);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-034"] [data-part="second"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:650;
padding:0.5625rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-dashboard-034-border);
background:var(--vibeui-dashboard-034-card);color:inherit;
}
[data-vibeui-block="dashboard-034"] [data-part="help"]{
display:block;margin-top:0.875rem;font-size:0.75rem;
color:var(--vibeui-dashboard-034-muted);
}
[data-vibeui-block="dashboard-034"] [data-part="help"] a{
color:var(--vibeui-dashboard-034-accent);font-weight:650;
}
[data-vibeui-block="dashboard-034"] :is(a,button):focus-visible{
outline:2px solid var(--vibeui-dashboard-034-accent);outline-offset:2px;
}
@container (min-width: 42rem){
[data-vibeui-block="dashboard-034"] [data-part="cards"]{grid-template-columns:repeat(3,1fr)}
[data-vibeui-block="dashboard-034"] [data-part="shell"]{padding:2.75rem 1.5rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-034"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TEMPLATES: Dashboard034Template[] = [
  {
    name: "Витрина товаров",
    text: "Каталог, карточка товара, фильтры и корзина. Подходит магазину и маркетплейсу.",
    blocks: "12 блоков",
    recommended: true,
  },
  {
    name: "Панель управления",
    text: "Каркас приложения, показатели, таблицы и настройки. Подходит SaaS-продукту.",
    blocks: "9 блоков",
  },
  {
    name: "Сайт-визитка",
    text: "Первый экран, преимущества, тарифы и форма связи. Подходит студии и услуге.",
    blocks: "6 блоков",
  },
]

/**
 * Пустое рабочее пространство: три готовых старта на радиокнопках, выбор
 * подсвечен через :has(), одна главная кнопка. Один файл, ноль зависимостей.
 */
export function Dashboard034({
  title = "Здесь пока пусто",
  lead = "Рабочее пространство создано, но в нём нет ни одного проекта. Начните с готового набора блоков — его всегда можно разобрать и собрать по-своему.",
  templates = DEFAULT_TEMPLATES,
  picked = "Витрина товаров",
  cta = "Создать проект",
  importLabel = "Импортировать существующий",
  helpLabel = "Как это работает",
  accent,
  className,
  style,
}: Dashboard034Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-034-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-034" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-034"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="art" aria-hidden="true" />
          <h2>{title}</h2>
          <p data-part="lead">{lead}</p>

          <fieldset>
            <legend>С чего начнём</legend>
            <div data-part="cards">
              {templates.map((template) => (
                <label key={template.name} data-part="card">
                  <input
                    type="radio"
                    name="dashboard-034-template"
                    defaultChecked={template.name === picked}
                  />
                  <span data-part="name">
                    {template.name}
                    {template.recommended ? (
                      <span data-part="best">советуем</span>
                    ) : null}
                  </span>
                  <span data-part="text">{template.text}</span>
                  <span data-part="blocks">{template.blocks}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div data-part="actions">
            <button type="button" data-part="cta">
              {cta}
            </button>
            <button type="button" data-part="second">
              {importLabel}
            </button>
          </div>

          <span data-part="help">
            Не уверены, что выбрать? <a href="#dashboard-034">{helpLabel}</a> —
            две минуты чтения.
          </span>
        </div>
      </section>
    </>
  )
}
