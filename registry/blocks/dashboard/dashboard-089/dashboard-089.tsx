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
  /** Подписи панели и предпросмотра: компонент несёт русские. */
  labels?: Record<string, string>
  accent?: string
  /** Пусто — подложки нет, блок ложится на фон страницы. */
  background?: string
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
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе со страницей и не носит собственной тёмной темы. Бренд-цвет — тот,
// что выбран в панели, поэтому подпись на нём остаётся белой в обеих темах.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="dashboard-089"]){
--vibeui-dashboard-089-bg:transparent;
/* Панель, поле и карточка предпросмотра: сам блок остаётся прозрачным. */
--vibeui-dashboard-089-card:light-dark(oklch(1 0 0),oklch(0.26 0 275));
--vibeui-dashboard-089-inset:light-dark(oklch(0.985 0 275),oklch(0.22 0 275));
--vibeui-dashboard-089-fg:light-dark(oklch(0.21 0 275),oklch(0.94 0 275));
--vibeui-dashboard-089-muted:light-dark(oklch(0.54 0 275),oklch(0.72 0 275));
--vibeui-dashboard-089-border:light-dark(oklch(0.91 0 275),oklch(0.36 0 275));
--vibeui-dashboard-089-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.74 0.14 39.8));
--vibeui-dashboard-089-on-accent:oklch(0.15 0.02 39.8);
--vibeui-dashboard-089-soft:light-dark(oklch(0.965 0 275),oklch(0.3 0 275));
--vibeui-dashboard-089-ring:light-dark(oklch(0 0 0 / 0.12),oklch(1 0 0 / 0.18));
--vibeui-dashboard-089-brand:oklch(0.52 0.16 39.8);
--vibeui-dashboard-089-on-brand:oklch(1 0 0);
--vibeui-dashboard-089-radius:0.75rem;
--vibeui-dashboard-089-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-089"]{color-scheme:dark}
[data-vibeui-block="dashboard-089"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
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
background:var(--vibeui-dashboard-089-inset);
}
[data-vibeui-block="dashboard-089"] [data-part="swatch"]:has(input:checked){
border-color:var(--vibeui-dashboard-089-fg);box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-089-fg);
}
[data-vibeui-block="dashboard-089"] [data-part="swatch"] input{position:absolute;opacity:0;width:0;height:0}
[data-vibeui-block="dashboard-089"] [data-part="dot"]{
width:1.125rem;height:1.125rem;border-radius:0.3125rem;display:inline-block;
box-shadow:inset 0 0 0 1px var(--vibeui-dashboard-089-ring);
}
[data-vibeui-block="dashboard-089"] [data-part="row"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="dashboard-089"] [data-part="row"] label{display:flex;flex-direction:column;gap:0.1875rem;font-size:0.6875rem;font-weight:700;flex:1 1 8rem}
[data-vibeui-block="dashboard-089"] select{
font:inherit;font-size:0.8125rem;padding:0.375rem 0.5rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-089-inset);color:inherit;
border:1px solid var(--vibeui-dashboard-089-border);width:100%;
}
[data-vibeui-block="dashboard-089"] [data-part="warn"]{
margin:0.4375rem 0 0;font-size:0.6875rem;color:var(--vibeui-dashboard-089-muted);line-height:1.4;
}
[data-vibeui-block="dashboard-089"] [data-part="save"]{
appearance:none;border:0;cursor:pointer;font:inherit;font-size:0.8125rem;font-weight:700;
padding:0.5rem 1rem;border-radius:0.625rem;align-self:flex-start;
background:var(--vibeui-dashboard-089-accent);color:var(--vibeui-dashboard-089-on-accent);
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
background:var(--vibeui-dashboard-089-brand);color:var(--vibeui-dashboard-089-on-brand);
}
[data-vibeui-block="dashboard-089"] [data-part="logo"]{
width:1.5rem;height:1.5rem;border-radius:calc(var(--vibeui-dashboard-089-radius) * 0.5);
display:grid;place-items:center;font-weight:800;font-size:0.8125rem;
background:var(--vibeui-dashboard-089-on-brand);color:var(--vibeui-dashboard-089-brand);
}
[data-vibeui-block="dashboard-089"] [data-part="bar"] b{font-size:0.8125rem;font-weight:750}
[data-vibeui-block="dashboard-089"] [data-part="bar"] span{margin-left:auto;font-size:0.6875rem;opacity:0.85}
[data-vibeui-block="dashboard-089"] [data-part="pcard"]{
padding:0.6875rem;border-radius:var(--vibeui-dashboard-089-radius);
background:var(--vibeui-dashboard-089-inset);border:1px solid var(--vibeui-dashboard-089-border);
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
background:var(--vibeui-dashboard-089-brand);color:var(--vibeui-dashboard-089-on-brand);
}
[data-vibeui-block="dashboard-089"] [data-part="pbtn"][data-ghost="true"]{
background:transparent;color:var(--vibeui-dashboard-089-brand);
border:1px solid color-mix(in oklab,var(--vibeui-dashboard-089-brand) 40%,light-dark(white,black));
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
  { name: "Графит", value: "oklch(0.34 0 260)" },
  { name: "Охра", value: "oklch(0.62 0.13 75)" },
]

const LABELS: Record<string, string> = {
  colorTitle: "Основной цвет",
  colorWarn:
    "Цвет используется для кнопок, ссылок и полос. «Охра» и «Графит» не проходят контраст с белым текстом на кнопке — у них подписи станут тёмными автоматически.",
  shapeTitle: "Форма и текст",
  radiusLabel: "Скругление углов",
  fontLabel: "Шрифт интерфейса",
  shapeWarn:
    "Скругление применяется ко всем поверхностям сразу: смешивать прямые и круглые углы в одном интерфейсе нельзя.",
  previewLabel: "Предпросмотр темы",
  previewTitle: "Так это увидит клиент",
  barNav: "заявки · клиенты · отчёты",
  cardTitle: "Заявка ЗК-4821 принята",
  cardBody:
    "Мы получили вашу заявку на поставку стеллажей. Менеджер свяжется в течение рабочего дня.",
  cardLink: "Посмотреть статус заявки",
  confirmLabel: "Подтвердить",
  postponeLabel: "Отложить",
}

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
  labels,
  accent,
  background = "",
  className,
  style,
}: Dashboard089Props) {
  const chosen =
    swatches.find((swatch) => swatch.name === activeColor) ?? swatches[0]
  const text = { ...LABELS, ...labels }

  const palette = {
    ...(accent ? { "--vibeui-dashboard-089-accent": accent } : null),
    "--vibeui-dashboard-089-brand": chosen.value,
    ...(background
      ? {
          "--vibeui-dashboard-089-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
              <h3>{text.colorTitle}</h3>
              <form data-part="swatches">
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
              </form>
              <p data-part="warn">{text.colorWarn}</p>
            </div>

            <div data-part="group">
              <h3>{text.shapeTitle}</h3>
              <div data-part="row">
                <label>
                  {text.radiusLabel}
                  <select defaultValue={radius}>
                    {radii.map((entry) => (
                      <option key={entry}>{entry}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {text.fontLabel}
                  <select defaultValue={font}>
                    {fonts.map((entry) => (
                      <option key={entry}>{entry}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p data-part="warn">{text.shapeWarn}</p>
            </div>

            <button type="button" data-part="save">
              {saveLabel}
            </button>
          </div>

          <div data-part="preview" aria-label={text.previewLabel}>
            <h3>{text.previewTitle}</h3>

            <div data-part="bar">
              <span data-part="logo">{logoLetter}</span>
              <b>{brandName}</b>
              <span>{text.barNav}</span>
            </div>

            <div data-part="pcard">
              <strong>{text.cardTitle}</strong>
              <p>{text.cardBody}</p>
              <div data-part="ptrack">
                <span />
              </div>
              <a href="#dashboard-089">{text.cardLink}</a>
              <div data-part="pbtns">
                <button type="button" data-part="pbtn">
                  {text.confirmLabel}
                </button>
                <button type="button" data-part="pbtn" data-ghost="true">
                  {text.postponeLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
