import type { CSSProperties } from "react"

export type Dialog009Step = {
  title: string
  description: string
  fieldLabel: string
  placeholder?: string
}

export type Dialog009Props = {
  id?: string
  /**
   * Показать окно раскрытым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  steps?: [Dialog009Step, Dialog009Step]
  nextLabel?: string
  backLabel?: string
  submitLabel?: string
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: мастер из двух шагов без состояния. Текущий шаг хранят
// скрытые radio, а видимость экранов переключает :has(#…:checked) — поэтому
// «Далее» и «Назад» это обычные подписи к radio, а не обработчики. Точки
// прогресса сверху показывают, где человек находится: мастер без индикатора
// ощущается бесконечным. Обёртка — <form>, а не <div>: у radio одинаковое
// имя, и без формы два блока на одной странице слились бы в одну группу —
// шаг соседнего мастера сбрасывал бы этот.
const STYLES = `
:where([data-vibeui-block="dialog-009"]){
--vibeui-dialog-009-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-009-muted:color-mix(in oklab,var(--vibeui-dialog-009-fg) 68%,transparent);
--vibeui-dialog-009-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dialog-009-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265));
--vibeui-dialog-009-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-dialog-009-radius:1rem;
--vibeui-dialog-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-009"]{color-scheme:dark}
[data-vibeui-block="dialog-009"]{display:inline-flex;font-family:var(--vibeui-dialog-009-font)}
[data-vibeui-block="dialog-009"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-009-border);border-radius:0.5rem;
background:var(--vibeui-dialog-009-bg);color:var(--vibeui-dialog-009-fg);
}
[data-vibeui-block="dialog-009"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-009-border) 30%,transparent)}
[data-vibeui-block="dialog-009"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-009-accent);outline-offset:2px}
[data-vibeui-dialog-009-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(26rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;
border:1px solid var(--vibeui-dialog-009-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:var(--vibeui-dialog-009-radius,1rem);
background:var(--vibeui-dialog-009-bg,light-dark(oklch(1 0 0),oklch(0.24 0.012 265)));
color:var(--vibeui-dialog-009-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-009-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-009-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-009-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-009-window]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
/* Radio состояния шагов: их не видно, но именно они держат мастер. */
[data-vibeui-dialog-009-window] [data-part="state"]{position:absolute;opacity:0;pointer-events:none}
[data-vibeui-dialog-009-window] [data-part="dots"]{display:flex;gap:0.375rem;margin-bottom:0.875rem}
[data-vibeui-dialog-009-window] [data-part="dot"]{
width:1.5rem;height:0.25rem;border-radius:9999px;
background:var(--vibeui-dialog-009-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
transition:background-color .18s ease;
}
[data-vibeui-dialog-009-window] [data-part="title"]{margin:0 0 0.25rem;font-size:1.0625rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-009-window] [data-part="description"]{margin:0 0 0.875rem;font-size:0.8125rem;line-height:1.5;color:var(--vibeui-dialog-009-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
[data-vibeui-dialog-009-window] label[data-part="field"]{display:flex;flex-direction:column;gap:0.375rem;font-size:0.8125rem;font-weight:500}
[data-vibeui-dialog-009-window] input[type="text"]{
width:100%;box-sizing:border-box;margin:0;height:2.375rem;padding:0 0.75rem;
border:1px solid var(--vibeui-dialog-009-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:0.5rem;background:light-dark(oklch(1 0 0),oklch(0.2 0.01 265));color:inherit;font:inherit;font-size:0.9375rem;
}
[data-vibeui-dialog-009-window] input[type="text"]:focus{
outline:none;border-color:var(--vibeui-dialog-009-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-dialog-009-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262))) 20%,transparent);
}
[data-vibeui-dialog-009-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.25rem}
[data-vibeui-dialog-009-window] [data-part="nav"],
[data-vibeui-dialog-009-window] [data-part="submit"]{
cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;min-height:2.25rem;padding:0.3125rem 1rem;
border-radius:0.5rem;border:1px solid transparent;
}
[data-vibeui-dialog-009-window] [data-part="nav"][data-kind="next"],
[data-vibeui-dialog-009-window] [data-part="submit"]{background:var(--vibeui-dialog-009-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));color:light-dark(oklch(1 0 0),oklch(0.17 0.02 265))}
[data-vibeui-dialog-009-window] [data-part="nav"][data-kind="back"]{
background:transparent;color:inherit;border-color:var(--vibeui-dialog-009-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
}
/* Экран второго шага и его кнопки скрыты, пока выбран первый шаг. */
[data-vibeui-dialog-009-window]:has([data-part="state"][value="1"]:checked) [data-screen="2"],
[data-vibeui-dialog-009-window]:has([data-part="state"][value="2"]:checked) [data-screen="1"]{display:none}
[data-vibeui-dialog-009-window]:has([data-part="state"][value="1"]:checked) [data-part="dot"]:first-child,
[data-vibeui-dialog-009-window]:has([data-part="state"][value="2"]:checked) [data-part="dot"]{
background:var(--vibeui-dialog-009-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));
}
[data-vibeui-dialog-009-window] :focus-visible{outline:2px solid var(--vibeui-dialog-009-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));outline-offset:2px}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-009-window]:popover-open){overflow:hidden}
/* Развёрнутый режим: окно стоит в потоке вместо кнопки, а не в верхнем слое.
   Без него на карточке каталога от компонента видна одна кнопка. */
[data-vibeui-block="dialog-009"]:has([data-open="true"]){display:block;width:100%}
[data-vibeui-block="dialog-009"]:has([data-open="true"]) [data-part="trigger"]{display:none}
[data-vibeui-dialog-009-window][data-open="true"]{
position:static;inset:auto;margin:0;width:100%;max-width:26rem;
opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-009"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-009-window]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_STEPS: [Dialog009Step, Dialog009Step] = [
  {
    title: "Название проекта",
    description: "Его увидят участники команды. Поменять можно в любой момент.",
    fieldLabel: "Название",
    placeholder: "Сайт студии",
  },
  {
    title: "Адрес проекта",
    description: "По нему сайт откроется до подключения своего домена.",
    fieldLabel: "Адрес",
    placeholder: "studio-polet",
  },
]

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 * Считается один раз при рендере, клиентского кода не добавляет.
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
 * Мастер из двух шагов без состояния: шаг держат скрытые radio.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog009({
  id = "vibeui-dialog-009",
  open = false,
  trigger = "Создать проект",
  steps = DEFAULT_STEPS,
  nextLabel = "Далее",
  backLabel = "Назад",
  submitLabel = "Создать",
  background = "",
  accent,
  className,
  style,
}: Dialog009Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-009" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-009"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <form
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-dialog-009-window=""
          data-open={open || undefined}
          role="dialog"
          aria-labelledby={`${id}-title-1`}
          style={palette}
        >
          <input
            data-part="state"
            type="radio"
            name={`${id}-step`}
            id={`${id}-step-1`}
            value="1"
            defaultChecked
            aria-hidden="true"
            tabIndex={-1}
          />
          <input
            data-part="state"
            type="radio"
            name={`${id}-step`}
            id={`${id}-step-2`}
            value="2"
            aria-hidden="true"
            tabIndex={-1}
          />

          <div data-part="dots" aria-hidden="true">
            <span data-part="dot" />
            <span data-part="dot" />
          </div>

          {steps.map((step, index) => (
            <div key={step.title} data-screen={index + 1}>
              <h2 data-part="title" id={`${id}-title-${index + 1}`}>
                {step.title}
              </h2>
              <p data-part="description">{step.description}</p>
              <label data-part="field">
                {step.fieldLabel}
                <input
                  type="text"
                  placeholder={step.placeholder}
                  autoFocus={index === 0}
                />
              </label>
              <div data-part="actions">
                {index === 0 ? (
                  <label
                    data-part="nav"
                    data-kind="next"
                    htmlFor={`${id}-step-2`}
                  >
                    {nextLabel}
                  </label>
                ) : (
                  <>
                    <label
                      data-part="nav"
                      data-kind="back"
                      htmlFor={`${id}-step-1`}
                    >
                      {backLabel}
                    </label>
                    <button data-part="submit" type="button" popoverTarget={id}>
                      {submitLabel}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </form>
      </div>
    </>
  )
}
