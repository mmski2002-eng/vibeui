import type { CSSProperties } from "react"

export type Dashboard005Group = {
  title: string
  kind?: "checkbox" | "radio"
  open?: boolean
  options: { label: string; count?: number; on?: boolean }[]
}

export type Dashboard005Props = {
  title?: string
  found?: string
  groups?: Dashboard005Group[]
  chips?: string[]
  resetLabel?: string
  /** Подпись крестика у чипа: {chip} — название фильтра. */
  chipRemoveText?: string
  /** Пусто — подложки нет, панель ложится на фон страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: панель фильтров каталога. Группы свёрнуты в details — состояние
// держит браузер, и раскрытые группы переживают перерисовку без своего стейта.
// Выбранные значения продублированы чипами сверху: в свёрнутой группе фильтр
// невидим, и пустая выдача кажется поломкой, а не следствием выбора. Счётчик
// найденного стоит рядом со сбросом — там его ищут, когда результат неожиданный.
//
// Тема берётся из color-scheme окружения через light-dark(): собственной
// подложки у панели нет, остаётся только рамка.
const STYLES = `
:where([data-vibeui-block="dashboard-005"]){
--vibeui-dashboard-005-bg:transparent;
--vibeui-dashboard-005-field:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-dashboard-005-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.005 265));
--vibeui-dashboard-005-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-dashboard-005-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-dashboard-005-chip:light-dark(oklch(0.55 0.2 262 / 10%),oklch(0.74 0.16 262 / 20%));
--vibeui-dashboard-005-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-dashboard-005-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.03 262));
--vibeui-dashboard-005-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dashboard-005"]{color-scheme:dark}
[data-vibeui-block="dashboard-005"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,15rem);max-width:19rem;padding:0.875rem;
background:var(--vibeui-dashboard-005-bg);
border:1px solid var(--vibeui-dashboard-005-border);border-radius:1rem;
font-family:var(--vibeui-dashboard-005-sans);color:var(--vibeui-dashboard-005-fg);
}
[data-vibeui-block="dashboard-005"] *{box-sizing:border-box}
[data-vibeui-block="dashboard-005"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin-bottom:0.625rem;
}
[data-vibeui-block="dashboard-005"] h2{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="dashboard-005"] [data-part="reset"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-dashboard-005-accent);font:inherit;font-size:0.75rem;
}
[data-vibeui-block="dashboard-005"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-dashboard-005-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="dashboard-005"] [data-part="found"]{
margin:0 0 0.625rem;font-size:0.75rem;color:var(--vibeui-dashboard-005-muted);
font-variant-numeric:tabular-nums;
}
/* Чипы дублируют выбор: в свёрнутой группе фильтр невидим. */
[data-vibeui-block="dashboard-005"] [data-part="chips"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin-bottom:0.75rem}
[data-vibeui-block="dashboard-005"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
height:1.625rem;padding:0 0.25rem 0 0.5rem;border-radius:0.5rem;
background:var(--vibeui-dashboard-005-chip);color:var(--vibeui-dashboard-005-accent);
font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="dashboard-005"] [data-part="chip"] button{
appearance:none;border:0;background:none;cursor:pointer;
width:1.125rem;height:1.125rem;border-radius:0.3125rem;
color:inherit;font:inherit;font-size:0.8125rem;line-height:1;
}
[data-vibeui-block="dashboard-005"] [data-part="chip"] button:focus-visible{outline:2px solid var(--vibeui-dashboard-005-accent);outline-offset:1px}
/* Группы на details: раскрытие переживает перерисовку без своего состояния. */
[data-vibeui-block="dashboard-005"] details{border-top:1px solid var(--vibeui-dashboard-005-border)}
[data-vibeui-block="dashboard-005"] summary{
list-style:none;cursor:pointer;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
min-height:2.25rem;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="dashboard-005"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="dashboard-005"] summary:focus-visible{outline:2px solid var(--vibeui-dashboard-005-accent);outline-offset:-2px;border-radius:0.375rem}
[data-vibeui-block="dashboard-005"] [data-part="caret"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-dashboard-005-muted);
border-bottom:1.5px solid var(--vibeui-dashboard-005-muted);
transform:rotate(-45deg);transition:transform .14s ease;
}
[data-vibeui-block="dashboard-005"] details[open] [data-part="caret"]{transform:rotate(45deg)}
[data-vibeui-block="dashboard-005"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
min-height:1.875rem;font-size:0.8125rem;
}
[data-vibeui-block="dashboard-005"] [data-part="option"]:last-child{margin-bottom:0.5rem}
[data-vibeui-block="dashboard-005"] input{
appearance:none;position:relative;flex:none;cursor:pointer;
width:1rem;height:1rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-dashboard-005-muted);background:var(--vibeui-dashboard-005-field);
}
[data-vibeui-block="dashboard-005"] input[type="radio"]{border-radius:9999px}
[data-vibeui-block="dashboard-005"] input:checked{
background:var(--vibeui-dashboard-005-accent);border-color:var(--vibeui-dashboard-005-accent);
}
[data-vibeui-block="dashboard-005"] input[type="checkbox"]:checked::after{
content:"";position:absolute;left:0.28rem;top:0.08rem;
width:0.2rem;height:0.45rem;
border:solid var(--vibeui-dashboard-005-on-accent);border-width:0 2px 2px 0;transform:rotate(45deg);
}
[data-vibeui-block="dashboard-005"] input[type="radio"]:checked{border-width:5px;background:var(--vibeui-dashboard-005-field)}
[data-vibeui-block="dashboard-005"] input:focus-visible{outline:2px solid var(--vibeui-dashboard-005-accent);outline-offset:2px}
[data-vibeui-block="dashboard-005"] [data-part="count"]{
margin-left:auto;font-size:0.75rem;color:var(--vibeui-dashboard-005-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dashboard-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Dashboard005Group[] = [
  {
    title: "Тип",
    open: true,
    options: [
      { label: "Компоненты", count: 238, on: true },
      { label: "Блоки", count: 17 },
      { label: "Шаблоны", count: 0 },
    ],
  },
  {
    title: "Категория",
    open: true,
    options: [
      { label: "Кнопки", count: 20 },
      { label: "Формы", count: 20, on: true },
      { label: "Таблицы", count: 10 },
      { label: "Графики", count: 10 },
    ],
  },
  {
    title: "Клиентский JS",
    kind: "radio",
    options: [
      { label: "Неважно", on: true },
      { label: "Только без JS" },
      { label: "Только с JS" },
    ],
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Панель фильтров: группы на details и выбранные значения чипами сверху.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dashboard005({
  title = "Фильтры",
  found = "Найдено 42 из 255",
  groups = DEFAULT_GROUPS,
  chips = ["Компоненты", "Формы"],
  resetLabel = "Сбросить",
  chipRemoveText = "Убрать фильтр {chip}",
  background = "",
  accent,
  className,
  style,
}: Dashboard005Props) {
  const palette = {
    ...(accent ? { "--vibeui-dashboard-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dashboard-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dashboard-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="dashboard-005"
        className={className}
        style={palette}
        aria-label={title}
      >
        <header data-part="head">
          <h2>{title}</h2>
          <button type="button" data-part="reset">
            {resetLabel}
          </button>
        </header>
        <p data-part="found" aria-live="polite">
          {found}
        </p>

        {chips.length > 0 ? (
          <div data-part="chips">
            {chips.map((chip) => (
              <span key={chip} data-part="chip">
                {chip}
                <button
                  type="button"
                  aria-label={chipRemoveText.replace("{chip}", chip)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}

        {groups.map((group) => (
          <details key={group.title} open={group.open}>
            <summary>
              {group.title}
              <span data-part="caret" aria-hidden="true" />
            </summary>
            {group.options.map((option) => (
              <label key={option.label} data-part="option">
                <input
                  type={group.kind === "radio" ? "radio" : "checkbox"}
                  name={`vibeui-dashboard-005-${group.title}`}
                  defaultChecked={option.on}
                />
                {option.label}
                {option.count !== undefined ? (
                  <span data-part="count">{option.count}</span>
                ) : null}
              </label>
            ))}
          </details>
        ))}
      </section>
    </>
  )
}
