import type { ComponentProps, CSSProperties } from "react"

export type Stepper007Step = {
  title: string
  /** Что уже выбрано на шаге: показывается только у пройденных. */
  value?: string
  href?: string
}

export type Stepper007Props = Omit<ComponentProps<"nav">, "children"> & {
  steps?: Stepper007Step[]
  /** Номер текущего шага, считая с нуля. */
  current?: number
  /** Подпись ссылки возврата к пройденному шагу. */
  editLabel?: string
  /** Подписи состояний: компонент несёт русские, проект подставляет свои. */
  stateText?: Record<string, string>
  label?: string
  /** Пусто — подложки нет, список лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: шаги оформления заказа, к которым можно вернуться.
// Пройденный шаг показывает выбранное значение и ссылку возврата — у неё
// доступное имя вида «Изменить: доставка», иначе в списке из четырёх ссылок
// все называются одинаково. Будущие шаги ссылками не притворяются: это
// обычный текст, а не отключённая кнопка, которую нельзя нажать.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="stepper-007"]){
--vibeui-stepper-007-bg:transparent;
--vibeui-stepper-007-surface:light-dark(oklch(1 0 0),oklch(0.2 0 265));
--vibeui-stepper-007-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-stepper-007-muted:color-mix(in oklab,var(--vibeui-stepper-007-fg) 68%,transparent);
--vibeui-stepper-007-border:light-dark(oklch(0.92 0 265),oklch(0.32 0 265));
--vibeui-stepper-007-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-stepper-007-accent-fg:light-dark(oklch(1 0 0),oklch(0.19 0 262));
--vibeui-stepper-007-done:light-dark(oklch(0.55 0.14 155),oklch(0.74 0.14 155));
--vibeui-stepper-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="stepper-007"]{color-scheme:dark}
[data-vibeui-block="stepper-007"]{
width:100%;max-width:30rem;box-sizing:border-box;
font-family:var(--vibeui-stepper-007-font);color:var(--vibeui-stepper-007-fg);
}
[data-vibeui-block="stepper-007"] [data-part="shell"]{
background:var(--vibeui-stepper-007-bg);
border:1px solid var(--vibeui-stepper-007-border);border-radius:1rem;overflow:hidden;
}
[data-vibeui-block="stepper-007"] ol{margin:0;padding:0;list-style:none}
[data-vibeui-block="stepper-007"] li{
display:grid;grid-template-columns:1.5rem 1fr auto;align-items:center;
gap:0.125rem 0.75rem;padding:0.75rem 1rem;
}
[data-vibeui-block="stepper-007"] li + li{border-top:1px solid var(--vibeui-stepper-007-border)}
[data-vibeui-block="stepper-007"] li[data-state="current"]{
background:color-mix(in oklab,var(--vibeui-stepper-007-accent) 6%,transparent);
}
[data-vibeui-block="stepper-007"] [data-part="mark"]{
grid-column:1;grid-row:1 / span 2;align-self:start;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:9999px;
border:2px solid var(--vibeui-stepper-007-border);
background:var(--vibeui-stepper-007-surface);color:var(--vibeui-stepper-007-muted);
font-size:0.6875rem;font-weight:700;line-height:1;
}
[data-vibeui-block="stepper-007"] li[data-state="done"] [data-part="mark"]{
background:var(--vibeui-stepper-007-done);border-color:var(--vibeui-stepper-007-done);
color:var(--vibeui-stepper-007-accent-fg);
}
[data-vibeui-block="stepper-007"] li[data-state="current"] [data-part="mark"]{
background:var(--vibeui-stepper-007-accent);border-color:var(--vibeui-stepper-007-accent);
color:oklch(from var(--vibeui-stepper-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="stepper-007"] [data-part="title"]{
grid-column:2;font-size:0.875rem;font-weight:600;line-height:1.3;
}
[data-vibeui-block="stepper-007"] li[data-state="todo"] [data-part="title"]{
font-weight:500;color:var(--vibeui-stepper-007-muted);
}
[data-vibeui-block="stepper-007"] [data-part="value"]{
grid-column:2;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-stepper-007-muted);
}
[data-vibeui-block="stepper-007"] [data-part="state"]{
grid-column:3;grid-row:1 / span 2;
font-size:0.75rem;color:var(--vibeui-stepper-007-muted);white-space:nowrap;
}
[data-vibeui-block="stepper-007"] [data-part="edit"]{
grid-column:3;grid-row:1 / span 2;
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.25rem 0.5rem;border-radius:0.5rem;
color:var(--vibeui-stepper-007-accent);font-size:0.8125rem;font-weight:600;
text-decoration:none;white-space:nowrap;
}
[data-vibeui-block="stepper-007"] [data-part="edit"]:hover{
background:color-mix(in oklab,var(--vibeui-stepper-007-accent) 10%,transparent);
text-decoration:underline;
}
[data-vibeui-block="stepper-007"] [data-part="edit"]:focus-visible{
outline:2px solid var(--vibeui-stepper-007-accent);outline-offset:2px;
}
[data-vibeui-block="stepper-007"] [data-part="now"]{
grid-column:3;grid-row:1 / span 2;
padding:0.125rem 0.5rem;border-radius:9999px;
background:var(--vibeui-stepper-007-accent);color:oklch(from var(--vibeui-stepper-007-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
font-size:0.6875rem;font-weight:650;white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="stepper-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS: Stepper007Step[] = [
  {
    title: "Контакты",
    value: "Мария Ким, +7 917 000-11-22",
    href: "#contacts",
  },
  {
    title: "Доставка",
    value: "Курьером завтра, 12:00–15:00",
    href: "#delivery",
  },
  { title: "Оплата", href: "#payment" },
  { title: "Подтверждение", href: "#confirm" },
]

const STATE_TEXT: Record<string, string> = {
  current: "Сейчас",
  todo: "Впереди",
}

/**
 * Ветка темы для заданного фона. Без неё светлая подложка досталась бы тексту
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
 * Шаги оформления заказа: к пройденным можно вернуться по ссылке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Stepper007({
  steps = DEFAULT_STEPS,
  current = 2,
  editLabel = "Изменить",
  stateText = STATE_TEXT,
  label = "Оформление заказа",
  background = "",
  accent,
  className,
  style,
  ...props
}: Stepper007Props) {
  const palette = {
    ...(accent ? { "--vibeui-stepper-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-stepper-007-bg": background,
          "--vibeui-stepper-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-stepper-007" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="stepper"
        data-vibeui-block="stepper-007"
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
                  aria-current={state === "current" ? "step" : undefined}
                >
                  <span data-part="mark" aria-hidden="true">
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <span data-part="title">{step.title}</span>
                  {state === "done" && step.value ? (
                    <span data-part="value">{step.value}</span>
                  ) : null}
                  {state === "done" && step.href ? (
                    <a
                      data-part="edit"
                      href={step.href}
                      aria-label={`${editLabel}: ${step.title.toLowerCase()}`}
                    >
                      {editLabel}
                    </a>
                  ) : null}
                  {state === "current" ? (
                    <span data-part="now">
                      {stateText.current ?? STATE_TEXT.current}
                    </span>
                  ) : null}
                  {state === "todo" ? (
                    <span data-part="state">
                      {stateText.todo ?? STATE_TEXT.todo}
                    </span>
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
