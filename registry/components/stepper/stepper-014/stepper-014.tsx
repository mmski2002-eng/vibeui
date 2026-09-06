import type { ComponentProps, CSSProperties } from "react"

export type Stepper014Step = {
  title: string
  description?: string
  optional?: boolean
  skipHref?: string
}

export type Stepper014Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: Stepper014Step[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  skipLabel?: string
  /** Метка необязательного шага: компонент несёт русскую. */
  optionalLabel?: string
  /** Подписи состояний: done, current, todo. */
  stateText?: Record<string, string>
  label?: string
  /** Пусто — подложки нет, список лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: необязательный шаг помечен не только словом, но и
// действием — ссылкой «Пропустить этот шаг» прямо внутри него. Ссылка
// показывается только у текущего необязательного шага: пропускать то, до
// чего ещё не дошли, или то, что уже пройдено, — нечего.
//
// Тема берётся из color-scheme окружения через light-dark().
const STYLES = `
:where([data-vibeui-block="stepper-014"]){
--vibeui-stepper-014-bg:transparent;
--vibeui-stepper-014-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-stepper-014-muted:color-mix(in oklab,var(--vibeui-stepper-014-fg) 68%,transparent);
--vibeui-stepper-014-border:light-dark(oklch(0.92 0 265),oklch(0.35 0 265));
--vibeui-stepper-014-line:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-stepper-014-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-stepper-014-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-stepper-014-dot:1.5rem;
--vibeui-stepper-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-014"]{color-scheme:dark}
[data-vibeui-block="stepper-014"]{
width:100%;max-width:32rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-014-font);color:var(--vibeui-stepper-014-fg);
}
[data-vibeui-block="stepper-014"] [data-part="shell"]{
background:var(--vibeui-stepper-014-bg);
border:1px solid var(--vibeui-stepper-014-border);
border-radius:1rem;padding:1rem 1.125rem;
}
[data-vibeui-block="stepper-014"] ol{margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-014"] li{
position:relative;display:grid;
grid-template-columns:var(--vibeui-stepper-014-dot) 1fr;
gap:0 0.75rem;padding-bottom:1.125rem;
}
[data-vibeui-block="stepper-014"] li:last-child{padding-bottom:0}
[data-vibeui-block="stepper-014"] li:not(:last-child)::before{
content:"";position:absolute;left:calc(var(--vibeui-stepper-014-dot) / 2 - 1px);
top:var(--vibeui-stepper-014-dot);bottom:0.25rem;width:2px;
background:var(--vibeui-stepper-014-line);
}
[data-vibeui-block="stepper-014"] li[data-state="done"]::before{background:var(--vibeui-stepper-014-accent)}
/* grid-row:1 / span 3, а не 1 / -1: у пункта нет явных строк, и -1 указывает
   на первую же линию — кружок занимал одну строку, а описание и ссылка
   сваливались в колонку кружка и переносились по слову. */
[data-vibeui-block="stepper-014"] [data-part="mark"]{
grid-column:1;grid-row:1 / span 3;align-self:start;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-014-dot);height:var(--vibeui-stepper-014-dot);
border-radius:9999px;border:2px solid var(--vibeui-stepper-014-line);
background:var(--vibeui-stepper-014-bg);color:var(--vibeui-stepper-014-muted);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-014"] li[data-optional="true"] [data-part="mark"]{border-style:dashed}
[data-vibeui-block="stepper-014"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-014-accent);border-color:var(--vibeui-stepper-014-accent);
color:var(--vibeui-stepper-014-accent-fg);
}
[data-vibeui-block="stepper-014"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-014-accent);color:var(--vibeui-stepper-014-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-014-accent) 18%,transparent);
}
[data-vibeui-block="stepper-014"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.5rem;
min-height:var(--vibeui-stepper-014-dot);
}
[data-vibeui-block="stepper-014"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.3}
[data-vibeui-block="stepper-014"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-014-muted);
}
[data-vibeui-block="stepper-014"] [data-part="state"]{
padding:0.0625rem 0.375rem;border-radius:9999px;
border:1px solid var(--vibeui-stepper-014-border);
font-size:0.625rem;font-weight:650;letter-spacing:0.02em;text-transform:uppercase;
color:var(--vibeui-stepper-014-muted);
}
[data-vibeui-block="stepper-014"] li[data-state="done"] [data-part="state"]{
color:var(--vibeui-stepper-014-accent);
border-color:color-mix(in oklab,var(--vibeui-stepper-014-accent) 40%,transparent);
}
[data-vibeui-block="stepper-014"] li[data-state="current"] [data-part="state"]{
background:var(--vibeui-stepper-014-accent);border-color:transparent;
color:var(--vibeui-stepper-014-accent-fg);
}
[data-vibeui-block="stepper-014"] [data-part="tag"]{
padding:0.0625rem 0.4375rem;border-radius:9999px;border:1px dashed var(--vibeui-stepper-014-border);
color:var(--vibeui-stepper-014-muted);font-size:0.625rem;font-weight:650;letter-spacing:0.01em;
}
[data-vibeui-block="stepper-014"] [data-part="description"]{
margin:0.25rem 0 0;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-stepper-014-muted);
}
[data-vibeui-block="stepper-014"] [data-part="skip"]{
display:inline-flex;margin-top:0.5rem;
color:var(--vibeui-stepper-014-accent);font-size:0.8125rem;font-weight:650;
text-decoration:underline;text-underline-offset:0.15em;
}
[data-vibeui-block="stepper-014"] [data-part="skip"]:focus-visible{
outline:2px solid var(--vibeui-stepper-014-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-014"] *{animation:none!important;transition:none!important}}
`

const STATE_TEXT: Record<string, string> = {
  done: "Готово",
  current: "Сейчас",
  todo: "Впереди",
}

const DEFAULT_STEPS: Stepper014Step[] = [
  { title: "Профиль", description: "Имя, фото и часовой пояс." },
  {
    title: "Импорт контактов",
    description: "Загрузите адресную книгу, чтобы не вводить контакты вручную.",
    optional: true,
    skipHref: "#tariff",
  },
  { title: "Тариф", description: "Выберите план — его можно сменить позже." },
  { title: "Готово" },
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
 * Шаги с необязательным этапом: метка «можно пропустить» и ссылка пропуска.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper014({
  steps = DEFAULT_STEPS,
  current = 1,
  skipLabel = "Пропустить этот шаг",
  optionalLabel = "Необязательно",
  stateText = STATE_TEXT,
  label = "Настройка аккаунта",
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper014Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-014" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-014"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <ol>
            {steps.map((step, index) => {
              const state =
                index < current
                  ? "done"
                  : index === current
                    ? "current"
                    : "todo"

              return (
                <li
                  key={step.title}
                  data-state={state}
                  data-optional={step.optional ? "true" : undefined}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="mark" aria-hidden="true">
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <span data-part="head">
                    <span data-part="title">{step.title}</span>
                    <span data-part="state">
                      {stateText[state] ?? STATE_TEXT[state]}
                    </span>
                    {step.optional ? (
                      <span data-part="tag">{optionalLabel}</span>
                    ) : null}
                  </span>
                  {step.description ? (
                    <p data-part="description">{step.description}</p>
                  ) : null}
                  {step.optional && state === "current" && step.skipHref ? (
                    <a data-part="skip" href={step.skipHref}>
                      {skipLabel}
                    </a>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </div>
      </nav>
    </>
  )
}
