import type { ComponentProps, CSSProperties } from "react"

export type Filters005Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue"
> & {
  title?: string
  presets?: string[]
  customLabel?: string
  name?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: период выбирают словами, а календарём — в последнюю
// очередь. «За 7 дней» и «этот месяц» закрывают почти все отчёты, поэтому
// они стоят первыми, а пара дат появляется только под пунктом «свой период».
// Раскрытие держит селектор :has по отмеченной радиокнопке — состояния нет,
// компонент серверный, и пустые поля дат не уезжают в форму без надобности.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного варианта.
const STYLES = `
:where([data-vibeui-block="filters-005"]){
--vibeui-filters-005-surface:transparent;
--vibeui-filters-005-field:light-dark(oklch(1 0 0),oklch(0.27 0 265));
--vibeui-filters-005-fill:light-dark(oklch(0.975 0 265),oklch(0.3 0 265));
--vibeui-filters-005-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-filters-005-muted:color-mix(in oklab,var(--vibeui-filters-005-fg) 68%,transparent);
--vibeui-filters-005-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-filters-005-shell:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-filters-005-accent:light-dark(oklch(0.52 0.19 39.8),oklch(0.75 0.15 39.8));
--vibeui-filters-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-005"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы. */
[data-vibeui-block="filters-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-005-surface);
border:1px solid var(--vibeui-filters-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-005-font);color:var(--vibeui-filters-005-fg);
}
[data-vibeui-block="filters-005"] *{box-sizing:border-box}
[data-vibeui-block="filters-005"] fieldset{margin:0;padding:0;border:0;min-inline-size:0}
[data-vibeui-block="filters-005"] legend{
padding:0;margin-bottom:0.5rem;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="filters-005"] [data-part="list"]{
display:flex;flex-direction:column;gap:0.125rem;
}
[data-vibeui-block="filters-005"] label{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.3125rem 0.5rem;border-radius:0.5rem;
font-size:0.8125rem;
transition:background-color .16s ease;
}
[data-vibeui-block="filters-005"] label:hover{background:var(--vibeui-filters-005-fill)}
[data-vibeui-block="filters-005"] label:has(input:checked){
background:color-mix(in oklab,var(--vibeui-filters-005-accent) 9%,var(--vibeui-filters-005-fill));
font-weight:650;
}
[data-vibeui-block="filters-005"] label:has(input:focus-visible){outline:2px solid var(--vibeui-filters-005-accent);outline-offset:1px}
[data-vibeui-block="filters-005"] input[type="radio"]{
appearance:none;flex:none;margin:0;cursor:pointer;position:relative;
width:0.9375rem;height:0.9375rem;border-radius:9999px;
border:1.5px solid var(--vibeui-filters-005-border);background:var(--vibeui-filters-005-field);
transition:border-color .16s ease;
}
[data-vibeui-block="filters-005"] input[type="radio"]:checked{border-color:var(--vibeui-filters-005-accent);border-width:5px}
/* Пара дат появляется только под «своим периодом»: :has, а не состояние. */
[data-vibeui-block="filters-005"] [data-part="custom"]{display:none;gap:0.375rem;margin-top:0.375rem}
[data-vibeui-block="filters-005"]:has([data-choice="custom"]:checked) [data-part="custom"]{display:flex}
[data-vibeui-block="filters-005"] [data-part="cell"]{
flex:1;min-width:0;display:flex;flex-direction:column;gap:0.125rem;
}
[data-vibeui-block="filters-005"] [data-part="cell"] span{
font-size:0.625rem;font-weight:650;color:var(--vibeui-filters-005-muted);
}
[data-vibeui-block="filters-005"] input[type="date"]{
width:100%;min-width:0;height:2.125rem;padding:0 0.5rem;
background:var(--vibeui-filters-005-field);color:inherit;
border:1px solid var(--vibeui-filters-005-border);border-radius:0.5rem;
font:inherit;font-size:0.75rem;
}
[data-vibeui-block="filters-005"] input[type="date"]:focus-visible{
outline:2px solid var(--vibeui-filters-005-accent);outline-offset:1px;
border-color:var(--vibeui-filters-005-accent);
}
[data-vibeui-block="filters-005"] [data-part="note"]{
margin:0;padding-top:0.125rem;
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-filters-005-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS = ["Сегодня", "За 7 дней", "За 30 дней", "Этот квартал"]

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  from: "Начало",
  to: "Конец",
  fromField: "Начало периода",
  toField: "Конец периода",
  note: "Период считается по вашему часовому поясу, границы включаются целиком.",
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
 * Фильтр по датам: пресеты периодов и пара дат под «своим периодом» на :has.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters005({
  title = "Период",
  presets = DEFAULT_PRESETS,
  customLabel = "Свой период",
  name = "period",
  labels = DEFAULT_LABELS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Filters005Props) {
  const palette = {
    ...(accent ? { "--vibeui-filters-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-filters-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-filters-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="filters"
        data-vibeui-block="filters-005"
        className={className}
        style={palette}
      >
        <fieldset>
          <legend>{title}</legend>
          <form data-part="list">
            {presets.map((preset, index) => (
              <label key={preset}>
                <input
                  type="radio"
                  name={name}
                  value={preset}
                  defaultChecked={index === 1}
                />
                {preset}
              </label>
            ))}
            <label>
              <input
                type="radio"
                name={name}
                value="custom"
                data-choice="custom"
              />
              {customLabel}
            </label>
          </form>

          <div data-part="custom">
            <span data-part="cell">
              <span>{labels.from ?? DEFAULT_LABELS.from}</span>
              <input
                type="date"
                name={`${name}-from`}
                aria-label={labels.fromField ?? DEFAULT_LABELS.fromField}
              />
            </span>
            <span data-part="cell">
              <span>{labels.to ?? DEFAULT_LABELS.to}</span>
              <input
                type="date"
                name={`${name}-to`}
                aria-label={labels.toField ?? DEFAULT_LABELS.toField}
              />
            </span>
          </div>
        </fieldset>

        <p data-part="note">{labels.note ?? DEFAULT_LABELS.note}</p>
      </div>
    </>
  )
}
