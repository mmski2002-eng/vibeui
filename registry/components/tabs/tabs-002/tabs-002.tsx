import type { ComponentProps, CSSProperties } from "react"

export type Tabs002Tab = {
  label: string
  text: string
}

export type Tabs002Props = Omit<ComponentProps<"div">, "children"> & {
  tabs?: Tabs002Tab[]
  name?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  /** Подпись группы вкладок для скринридера. */
  groupLabel?: string
}

// Идея компонента: вкладки без единой строки JS. Переключение держат
// радиокнопки: браузер сам следит, что выбрана одна, и даёт стрелки по группе.
// Панель показывается селектором :has() по отмеченной кнопке, поэтому правила
// заданы на шесть вкладок — больше требует ещё одной строки CSS.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте дорожка темнее фона, а рамка светлее его.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченной вкладки.
const STYLES = `
:where([data-vibeui-block="tabs-002"]){
--vibeui-tabs-002-bg:transparent;
--vibeui-tabs-002-pill:light-dark(oklch(1 0 0),oklch(0.32 0.012 265));
--vibeui-tabs-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-tabs-002-muted:color-mix(in oklab,var(--vibeui-tabs-002-fg) 68%,transparent);
--vibeui-tabs-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-tabs-002-track:light-dark(oklch(0.96 0.003 265),oklch(0.25 0.01 265));
--vibeui-tabs-002-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-tabs-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-002"]{color-scheme:dark}
[data-vibeui-block="tabs-002"]{
width:100%;max-width:24rem;box-sizing:border-box;padding:0.375rem;
background:var(--vibeui-tabs-002-bg);
border:1px solid var(--vibeui-tabs-002-border);border-radius:0.875rem;
font-family:var(--vibeui-tabs-002-font);color:var(--vibeui-tabs-002-fg);
}
[data-vibeui-block="tabs-002"] [data-part="strip"]{
display:flex;gap:0.125rem;padding:0.1875rem;
background:var(--vibeui-tabs-002-track);border-radius:0.625rem;
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="tabs-002"] [data-part="strip"]::-webkit-scrollbar{display:none}
[data-vibeui-block="tabs-002"] [data-part="strip"] label{flex:1 0 auto}
[data-vibeui-block="tabs-002"] input{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-block="tabs-002"] [data-part="tab"]{
cursor:pointer;
display:flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0 0.75rem;border-radius:0.4375rem;
font-size:0.8125rem;color:var(--vibeui-tabs-002-muted);white-space:nowrap;
}
/* Отмеченная радиокнопка задаёт и вид вкладки, и видимость панели. */
[data-vibeui-block="tabs-002"] input:checked + [data-part="tab"]{
background:var(--vibeui-tabs-002-pill);color:var(--vibeui-tabs-002-fg);font-weight:650;
box-shadow:0 1px 2px oklch(0.2 0.02 265 / 12%);
}
[data-vibeui-block="tabs-002"] input:focus-visible + [data-part="tab"]{outline:2px solid var(--vibeui-tabs-002-accent);outline-offset:-2px}
/* Панель открывает :has() по отмеченной кнопке: правила заданы на шесть вкладок. */
[data-vibeui-block="tabs-002"] [data-part="panel"]{
display:none;padding:0.75rem 0.5rem 0.5rem;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-tabs-002-muted);
}
[data-vibeui-block="tabs-002"]:has(input[data-index="0"]:checked) [data-part="panel"][data-index="0"]{display:block}
[data-vibeui-block="tabs-002"]:has(input[data-index="1"]:checked) [data-part="panel"][data-index="1"]{display:block}
[data-vibeui-block="tabs-002"]:has(input[data-index="2"]:checked) [data-part="panel"][data-index="2"]{display:block}
[data-vibeui-block="tabs-002"]:has(input[data-index="3"]:checked) [data-part="panel"][data-index="3"]{display:block}
[data-vibeui-block="tabs-002"]:has(input[data-index="4"]:checked) [data-part="panel"][data-index="4"]{display:block}
[data-vibeui-block="tabs-002"]:has(input[data-index="5"]:checked) [data-part="panel"][data-index="5"]{display:block}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_TABS: Tabs002Tab[] = [
  {
    label: "Обзор",
    text: "Компонент рендерится без единого пропа: значения по умолчанию заданы прямо в файле.",
  },
  {
    label: "Установка",
    text: "Файл копируется в проект одной командой. Внешних зависимостей нет — только react.",
  },
  {
    label: "Тема",
    text: "Цвета живут в переменных с префиксом компонента, поэтому тема хозяина не перебивает их.",
  },
]

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
 * Вкладки на радиокнопках: переключение и стрелки без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs002({
  tabs = DEFAULT_TABS,
  name = "vibeui-tabs-002",
  background = "",
  accent,
  groupLabel = "Разделы",
  className,
  style,
  ...props
}: Tabs002Props) {
  const palette = {
    ...(accent ? { "--vibeui-tabs-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tabs-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-002"
        className={className}
        style={palette}
      >
        <form data-part="strip" role="radiogroup" aria-label={groupLabel}>
          {tabs.map((tab, index) => (
            <label key={tab.label}>
              <input
                type="radio"
                name={name}
                value={tab.label}
                data-index={index}
                defaultChecked={index === 0}
              />
              <span data-part="tab">{tab.label}</span>
            </label>
          ))}
        </form>
        {tabs.map((tab, index) => (
          <p key={tab.label} data-part="panel" data-index={index}>
            {tab.text}
          </p>
        ))}
      </div>
    </>
  )
}
