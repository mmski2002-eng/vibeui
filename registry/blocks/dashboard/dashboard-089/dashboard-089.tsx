import type { CSSProperties } from "react"

export type Dashboard089Swatch = {
  name: string
  value: string
}

export type Dashboard089Props = {
  title?: string
  brandName?: string
  swatches?: Dashboard089Swatch[]
  activeColor?: string
  radius?: string
  radii?: string[]
  font?: string
  fonts?: string[]
  logoLetter?: string
  saveLabel?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: настройки темы бессмысленны без предпросмотра, а предпросмотр из
// одного квадрата ничего не проверяет. Поэтому справа собран кусок настоящего
// интерфейса: шапка с логотипом, кнопка, карточка, ссылка и полоса прогресса —
// именно на них видно, что выбранный цвет не читается на белом. Выбор цвета
// сделан радиокнопками, а не палитрой: бренд-цвета конечны, и свободный выбор
// тут вредит. Радиус и шрифт применяются к предпросмотру той же переменной,
// что уйдёт в тему, — иначе предпросмотр врёт. Предупреждение о контрасте
// стоит рядом с выбором, а не всплывает после сохранения.
const STYLES = `
:where([data-vibeui-block="dashboard-089"]){
--vibeui-dashboard-089-bg:oklch(0.985 0.003 275);
--vibeui-dashboard-089-card:oklch(1 0 0);
--vibeui-dashboard-089-fg:oklch(0.21 0.014 275);
--vibeui-dashboard-089-muted:oklch(0.54 0.014 275);
--vibeui-dashboard-089-border:oklch(0.91 0.006 275);
--vibeui-dashboard-089-accent:oklch(0.52 0.16 275);
--vibeui-dashboard-089-soft:oklch(0.965 0.02 275);
--vibeui-dashboard-089-brand:oklch(0.52 0.16 275);
--vibeui-dashboard-089-radius:0.75rem;
--vibeui-dashboard-089-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="dashboard-089"]{
box-sizing:border-box;width:100%;
background:var(--vibeui-dashboard-089-bg);
color:var(--vibeui-dashboard-089-fg);
font-family:var(--vibeui-dashboard-089-sans);
border:1px solid var(--vibeui-dashboard-089-border);border-radius:1rem;padding:1rem;
}
[data-vibeui-block="dashboard-089"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-089"] [data-part="shell"]{display:grid;grid-template-columns:1fr;gap:0.875rem;align-items:start}
[data-vibeui-block="dashboard-089"] h2{margin:0;font-size:1.0625rem;font-weight:750;letter-spacing:-0.015em}
[data-vibeui-block="dashboard-089"] h3{margin:0 0 0.4375rem;font-size:0.6875rem;font-weight:750;text-transform:uppercase;letter-spacing:0.06em;color:var(--vibeui-dashboard-089-muted)}
[data-vibeui-block="dashboard-089"] [data-part="panel"]{display:flex;flex-direction:column;gap:0.75rem}
[data-vibeui-block="dashboard-089"] [data-part="group"]{
padding:0.75rem 0.8125rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-089-card);border:1px solid var(--vibeui-dashboard-089-border);
}
[data-vibeui-block="dashboard-089"] [data-part="swatches"]{display:flex;flex-wrap:wrap;gap:0.4375rem;margin:0;padding:0;border:0}
[data-vibeui-block="dashboard-089"] [data-part="swatch"]{
display:inline-flex;align-items:center;gap:0.375rem;cursor:pointer;
font-size:0.6875rem;font-weight:700;padding:0.25rem 0.5rem 0.25rem 0.3125rem;
border-radius:0.5rem;border:1px solid var(--vibeui-dashboard-089-border);
background:var(--vibeui-dashboard-089-bg);
}
[data-vibeui-block="dashboard-089"] [data-part="swatch"]:has(input:checked){
border-color:var(--vibeui-dashboard-089-fg);box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-089-fg);
}
[data-vibeui-block="dashboard-089"] [data-part="swatch"] input{position:absolute;opacity:0;width:0;height:0}
[data-vibeui-block="dashboard-089"] [data-part="dot"]{
width:1.125rem;height:1.125rem;border-radius:0.3125rem;display:inline-block;
box-shadow:inset 0 0 0 1px oklch(0 0 0 / 0.12);
}
[data-vibeui-block="dashboard-089"] [data-part="row"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="dashboard-089"] [data-part="row"] label{display:flex;flex-direction:column;gap:0.1875rem;font-size:0.6875rem;font-weight:700;flex:1 1 8rem}
[data-vibeui-block="dashboard-089"] select{
font:inherit;font-size:0.8125rem;padding:0.375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-089-bg);color:inherit;
border:1px solid var(--vibeui-dashboard-089-border);width:100%;
}
[data-vibeui-block="dashboard-089"] [data-part="warn"]{
margin:0.4375rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-089-muted);line-height:1.4;
}
[data-vibeui-block="dashboard-089"] [data-part="save"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;align-self:flex-start;
background:var(--vibeui-dashboard-089-accent);color:oklch(1 0 0);
}
/* Предпросмотр: кусок настоящего интерфейса, а не квадрат с цветом. */
[data-vibeui-block="dashboard-089"] [data-part="preview"]{
padding:0.75rem;border-radius:0.875rem;
background:var(--vibeui-dashboard-089-card);border:1px solid var(--vibeui-dashboard-089-border);
display:flex;flex-direction:column;gap:0.625rem;
}
[data-vibeui-block="dashboard-089"] [data-part="bar"]{
display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0.625rem;
border-radius:var(--vibeui-dashboard-089-radius);
background:var(--vibeui-dashboard-089-brand);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-089"] [data-part="logo"]{
width:1.5rem;height:1.5rem;border-radius:calc(var(--vibeui-dashboard-089-radius) * 0.5);
display:grid;place-items:center;font-weight:800;font-size:0.8125rem;
background:oklch(1 0 0);color:var(--vibeui-dashboard-089-brand);
}
[data-vibeui-block="dashboard-089"] [data-part="bar"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-089"] [data-part="bar"] span{margin-left:auto;font-size:0.6875rem;opacity:0.85}
[data-vibeui-block="dashboard-089"] [data-part="pcard"]{
padding:0.6875rem;border-radius:var(--vibeui-dashboard-089-radius);
background:var(--vibeui-dashboard-089-bg);border:1px solid var(--vibeui-dashboard-089-border);
display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="dashboard-089"] [data-part="pcard"] strong{font-size:0.875rem;font-weight:750}
[data-vibeui-block="dashboard-089"] [data-part="pcard"] p{margin:0;font-size:0.75rem;color:var(--vibeui-dashboard-089-muted);line-height:1.45}
[data-vibeui-block="dashboard-089"] [data-part="pcard"] a{color:var(--vibeui-dashboard-089-brand);font-size:0.75rem;font-weight:700}
[data-vibeui-block="dashboard-089"] [data-part="ptrack"]{
height:0.4375rem;border-radius:9999px;position:relative;overflow:hidden;
background:var(--vibeui-dashboard-089-card);
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-089-border);
}
[data-vibeui-block="dashboard-089"] [data-part="ptrack"] span{
position:absolute;inset:0 auto 0 0;width:64%;border-radius:9999px;
background:var(--vibeui-dashboard-089-brand);
}
[data-vibeui-block="dashboard-089"] [data-part="pbtns"]{display:flex;flex-wrap:wrap;gap:0.4375rem}
[data-vibeui-block="dashboard-089"] [data-part="pbtn"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:700;
padding:0.375rem 0.8125rem;border-radius:var(--vibeui-dashboard-089-radius);
background:var(--vibeui-dashboard-089-brand);color:oklch(1 0 0);
}
[data-vibeui-block="dashboard-089"] [data-part="pbtn"][data-ghost="true"]{
background:transparent;color:var(--vibeui-dashboard-089-brand);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-089-brand) 40%,white);
}
[data-vibeui-block="dashboard-089"] :is(a,button,input,select,label):focus-visible{
outline:2px solid var(--vibeui-dashboard-089-accent);outline-offset:2px;
}
@container (min-width: 46rem){
[data-vibeui-block="dashboard-089"] [data-part="shell"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
[data-vibeui-block="dashboard-089"] [data-part="head"]{grid-column:1 / -1}
}
`

const DEFAULT_SWATCHES: Dashboard089Swatch[] = [
  { name: "Хвойный", value: "oklch(0.48 0.11 165)" },
  { name: "Сапфир", value: "oklch(0.52 0.16 262)" },
  { name: "Слива", value: "oklch(0.5 0.17 305)" },
  { name: "Кирпич", value: "oklch(0.55 0.17 32)" },
  { name: "Графит", value: "oklch(0.34 0.01 260)" },
  { name: "Охра", value: "oklch(0.62 0.13 75)" },
]

/**
 * Страница брендинга и темы: выбор бренд-цвета радиокнопками, радиус и шрифт
 * селектами, а справа — живой кусок интерфейса, который перерисовывается теми
 * же переменными. Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Dashboard089({
  title = "Брендинг и тема",
  brandName = "Северный лес",
  swatches = DEFAULT_SWATCHES,
  activeColor = "Сапфир",
  radius = "Средний",
  radii = ["Прямой", "Малый", "Средний", "Круглый"],
  font = "Системный",
  fonts = ["Системный", "Гротеск", "Антиква"],
  logoLetter = "С",
  saveLabel = "Применить тему",
  accent,
  className,
  style,
}: Dashboard089Props) {
  const chosen =
    swatches.find((swatch) => swatch.name === activeColor) ?? swatches[0]

  const palette = {
    ...(accent ? { "--vibeui-dashboard-089-accent": accent } : null),
    "--vibeui-dashboard-089-brand": chosen.value,
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-089" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-089"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <div data-part="head">
            <h2>{title}</h2>
          </div>

          <div data-part="panel">
            <div data-part="group">
              <h3>Основной цвет</h3>
              <fieldset data-part="swatches">
                {swatches.map((swatch) => (
                  <label key={swatch.name} data-part="swatch">
                    <input
                      type="radio"
                      name="dashboard-089-color"
                      defaultChecked={swatch.name === chosen.name}
                    />
                    <span
                      data-part="dot"
                      style={{ background: swatch.value }}
                    />
                    {swatch.name}
                  </label>
                ))}
              </fieldset>
              <p data-part="warn">
                Цвет используется для кнопок, ссылок и полос. «Охра» и «Графит»
                не проходят контраст с белым текстом на кнопке — у них подписи
                станут тёмными автоматически.
              </p>
            </div>

            <div data-part="group">
              <h3>Форма и текст</h3>
              <div data-part="row">
                <label>
                  Скругление углов
                  <select defaultValue={radius}>
                    {radii.map((entry) => (
                      <option key={entry}>{entry}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Шрифт интерфейса
                  <select defaultValue={font}>
                    {fonts.map((entry) => (
                      <option key={entry}>{entry}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p data-part="warn">
                Скругление применяется ко всем поверхностям сразу: смешивать
                прямые и круглые углы в одном интерфейсе нельзя.
              </p>
            </div>

            <button type="button" data-part="save">
              {saveLabel}
            </button>
          </div>

          <div data-part="preview" aria-label="Предпросмотр темы">
            <h3>Так это увидит клиент</h3>

            <div data-part="bar">
              <span data-part="logo">{logoLetter}</span>
              <b>{brandName}</b>
              <span>заявки · клиенты · отчёты</span>
            </div>

            <div data-part="pcard">
              <strong>Заявка ЗК-4821 принята</strong>
              <p>
                Мы получили вашу заявку на поставку стеллажей. Менеджер свяжется
                в течение рабочего дня.
              </p>
              <div data-part="ptrack">
                <span />
              </div>
              <a href="#dashboard-089">Посмотреть статус заявки</a>
              <div data-part="pbtns">
                <button type="button" data-part="pbtn">
                  Подтвердить
                </button>
                <button type="button" data-part="pbtn" data-ghost="true">
                  Отложить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
