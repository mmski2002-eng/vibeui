import type { ComponentProps, CSSProperties } from "react"

export type Stepper015ReviewItem = {
  label: string
  value: string
  href?: string
}

export type Stepper015Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: string[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  review?: Stepper015ReviewItem[]
  /** Заголовок карточки сверки. */
  panelTitle?: string
  /** Текст до последнего шага: {step} — название последнего шага. */
  pendingText?: string
  editLabel?: string
  backLabel?: string
  backHref?: string
  confirmLabel?: string
  confirmHref?: string
  label?: string
  /** Состояния словами: галочка и цвет скринридеру ничего не говорят. */
  stateText?: Record<string, string>
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: последний шаг — не кнопка «Готово», а полноценная сверка
// введённого со ссылками на редактирование каждого пункта и явным путём
// назад. Панель проверки рисуется только на последнем шаге; до него — просто
// лента с состояниями, без лишнего текста.
//
// Тема берётся из color-scheme окружения через light-dark(). Кружки шагов и
// кнопка «Назад» держат непрозрачный surface: под кружками проходит линия
// ленты, и прозрачный фон дал бы ей просвечивать насквозь.
const STYLES = `
:where([data-vibeui-block="stepper-015"]){
--vibeui-stepper-015-bg:transparent;
--vibeui-stepper-015-surface:light-dark(oklch(1 0 0),oklch(0.22 0.012 265));
--vibeui-stepper-015-fg:light-dark(oklch(0.24 0.016 265),oklch(0.94 0.005 265));
--vibeui-stepper-015-muted:color-mix(in oklab,var(--vibeui-stepper-015-fg) 68%,transparent);
--vibeui-stepper-015-border:light-dark(oklch(0.92 0.006 265),oklch(0.35 0.012 265));
--vibeui-stepper-015-line:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-stepper-015-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-stepper-015-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-stepper-015-panel:light-dark(oklch(0.97 0.006 265),oklch(0.26 0.012 265));
--vibeui-stepper-015-size:1.75rem;
--vibeui-stepper-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-015"]{color-scheme:dark}
[data-vibeui-block="stepper-015"]{
width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-015-font);color:var(--vibeui-stepper-015-fg);
}
[data-vibeui-block="stepper-015"] [data-part="shell"]{
background:var(--vibeui-stepper-015-bg);
border:1px solid var(--vibeui-stepper-015-border);
border-radius:1rem;padding:1.125rem 1rem 1rem;
}
[data-vibeui-block="stepper-015"] [data-part="ribbon"]{
display:flex;margin:0 0 1rem;padding:0;list-style:none;gap:0;
}
[data-vibeui-block="stepper-015"] [data-part="ribbon"] li{
position:relative;flex:1 1 0;min-width:0;
display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.3125rem;
}
[data-vibeui-block="stepper-015"] [data-part="ribbon"] li:not(:first-child)::before{
content:"";position:absolute;top:calc(var(--vibeui-stepper-015-size) / 2 - 1px);
right:50%;left:-50%;height:2px;background:var(--vibeui-stepper-015-line);
}
[data-vibeui-block="stepper-015"] [data-part="ribbon"] li[data-state="done"]::before{background:var(--vibeui-stepper-015-accent)}
[data-vibeui-block="stepper-015"] [data-part="mark"]{
position:relative;z-index:1;
display:flex;align-items:center;justify-content:center;
width:var(--vibeui-stepper-015-size);height:var(--vibeui-stepper-015-size);
border-radius:9999px;border:2px solid var(--vibeui-stepper-015-line);
background:var(--vibeui-stepper-015-surface);color:var(--vibeui-stepper-015-muted);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-015"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-015-accent);border-color:var(--vibeui-stepper-015-accent);
color:var(--vibeui-stepper-015-accent-fg);
}
[data-vibeui-block="stepper-015"] li[data-state="current"] [data-part="mark"]{
border-color:var(--vibeui-stepper-015-accent);color:var(--vibeui-stepper-015-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-stepper-015-accent) 18%,transparent);
}
[data-vibeui-block="stepper-015"] [data-part="label"]{font-size:0.6875rem;font-weight:600;line-height:1.2}
[data-vibeui-block="stepper-015"] li[data-state="todo"] [data-part="label"]{
font-weight:500;color:var(--vibeui-stepper-015-muted);
}
[data-vibeui-block="stepper-015"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="stepper-015"] [data-part="panel"]{
border:1px solid var(--vibeui-stepper-015-border);
background:var(--vibeui-stepper-015-panel);
border-radius:0.875rem;padding:0.875rem 1rem;
}
[data-vibeui-block="stepper-015"] [data-part="panel-title"]{
margin:0 0 0.625rem;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="stepper-015"] [data-part="review"]{margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-015"] [data-part="review"] li{
position:static;display:grid;grid-template-columns:1fr auto;align-items:baseline;
gap:0.25rem 0.75rem;text-align:left;padding:0.375rem 0;
border-bottom:1px solid var(--vibeui-stepper-015-border);
}
[data-vibeui-block="stepper-015"] [data-part="review"] li::before{content:none}
[data-vibeui-block="stepper-015"] [data-part="review"] li:last-child{border-bottom:none}
[data-vibeui-block="stepper-015"] [data-part="review-label"]{font-size:0.75rem;color:var(--vibeui-stepper-015-muted)}
[data-vibeui-block="stepper-015"] [data-part="review-value"]{font-size:0.8125rem;font-weight:600;text-align:right}
[data-vibeui-block="stepper-015"] [data-part="review-edit"]{
grid-column:1 / -1;justify-self:start;
color:var(--vibeui-stepper-015-accent);font-size:0.75rem;font-weight:650;
text-decoration:underline;text-underline-offset:0.15em;
}
[data-vibeui-block="stepper-015"] [data-part="review-edit"]:focus-visible{
outline:2px solid var(--vibeui-stepper-015-accent);outline-offset:2px;
}
[data-vibeui-block="stepper-015"] [data-part="actions"]{
display:flex;justify-content:space-between;gap:0.75rem;margin:0.875rem 0 0;
}
[data-vibeui-block="stepper-015"] [data-part="back"]{
display:inline-flex;align-items:center;
padding:0.5rem 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-stepper-015-border);
background:var(--vibeui-stepper-015-surface);
color:var(--vibeui-stepper-015-fg);font-size:0.8125rem;font-weight:600;
text-decoration:none;
}
[data-vibeui-block="stepper-015"] [data-part="back"]:focus-visible,
[data-vibeui-block="stepper-015"] [data-part="confirm"]:focus-visible{
outline:2px solid var(--vibeui-stepper-015-accent);outline-offset:2px;
}
[data-vibeui-block="stepper-015"] [data-part="confirm"]{
display:inline-flex;align-items:center;
padding:0.5rem 0.9375rem;border-radius:0.625rem;
background:var(--vibeui-stepper-015-accent);color:var(--vibeui-stepper-015-accent-fg);
font-size:0.8125rem;font-weight:650;text-decoration:none;
}
[data-vibeui-block="stepper-015"] [data-part="pending"]{
margin:0;font-size:0.8125rem;color:var(--vibeui-stepper-015-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = ["Данные", "Адрес", "Оплата", "Проверка"]

const DEFAULT_REVIEW: Stepper015ReviewItem[] = [
  { label: "Получатель", value: "Игорь Петров", href: "#step-0" },
  { label: "Адрес", value: "Москва, ул. Ленина, 12", href: "#step-1" },
  { label: "Способ оплаты", value: "Карта •• 4412", href: "#step-2" },
]

const PENDING_TEXT = "Проверка появится на последнем шаге — «{step}»."

const STATE_TEXT: Record<string, string> = {
  done: " — шаг пройден",
  current: " — текущий шаг",
  todo: " — впереди",
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
 * Шаги с подтверждением на последнем этапе и возвратом назад.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper015({
  steps = DEFAULT_STEPS,
  current = 3,
  review = DEFAULT_REVIEW,
  panelTitle = "Проверьте перед подтверждением",
  pendingText = PENDING_TEXT,
  editLabel = "Изменить",
  backLabel = "Назад",
  backHref = "#step-2",
  confirmLabel = "Подтвердить",
  confirmHref = "#confirm",
  label = "Оформление заказа",
  stateText = STATE_TEXT,
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper015Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const index = Math.min(Math.max(current, 0), steps.length - 1)
  const isFinal = index === steps.length - 1

  return (
    <>
      <style href="vibeui-stepper-015" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-015"
        aria-label={label}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <ol data-part="ribbon">
            {steps.map((title, position) => {
              const state =
                position < index
                  ? "done"
                  : position === index
                    ? "current"
                    : "todo"

              return (
                <li
                  key={title}
                  data-state={state}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="mark" aria-hidden="true">
                    {state === "done" ? "✓" : position + 1}
                  </span>
                  <span data-part="label">{title}</span>
                  <span data-part="sr">
                    {stateText[state] ?? STATE_TEXT[state]}
                  </span>
                </li>
              )
            })}
          </ol>
          {isFinal ? (
            <div data-part="panel">
              <p data-part="panel-title">{panelTitle}</p>
              <ol data-part="review">
                {review.map((item) => (
                  <li key={item.label}>
                    <span data-part="review-label">{item.label}</span>
                    <span data-part="review-value">{item.value}</span>
                    {item.href ? (
                      <a
                        data-part="review-edit"
                        href={item.href}
                        aria-label={`${editLabel}: ${item.label.toLowerCase()}`}
                      >
                        {editLabel}
                      </a>
                    ) : null}
                  </li>
                ))}
              </ol>
              <p data-part="actions">
                <a data-part="back" href={backHref}>
                  {backLabel}
                </a>
                <a data-part="confirm" href={confirmHref}>
                  {confirmLabel}
                </a>
              </p>
            </div>
          ) : (
            <p data-part="pending">
              {pendingText.replace("{step}", steps[steps.length - 1])}
            </p>
          )}
        </div>
      </nav>
    </>
  )
}
