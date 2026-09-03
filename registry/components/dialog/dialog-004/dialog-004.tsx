import type { CSSProperties } from "react"

export type Dialog004Option = {
  value: string
  label: string
  description?: string
}

export type Dialog004Props = {
  id?: string
  /**
   * Показать окно раскрытым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  title?: string
  options?: Dialog004Option[]
  defaultValue?: string
  submitLabel?: string
  cancelLabel?: string
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно выбора одного варианта из нескольких. Варианты —
// нативные radio в подписях-карточках: выбранная карточка подсвечивается
// правилом :has(input:checked), поэтому подсветка не требует состояния.
// Клавиатура работает как в родном списке: стрелки переключают вариант.
const STYLES = `
:where([data-vibeui-block="dialog-004"]){
--vibeui-dialog-004-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-004-muted:color-mix(in oklab,var(--vibeui-dialog-004-fg) 68%,transparent);
--vibeui-dialog-004-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dialog-004-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265));
--vibeui-dialog-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-dialog-004-radius:1rem;
--vibeui-dialog-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-004"]{color-scheme:dark}
[data-vibeui-block="dialog-004"]{display:inline-flex;font-family:var(--vibeui-dialog-004-font)}
[data-vibeui-block="dialog-004"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-004-border);border-radius:0.5rem;
background:var(--vibeui-dialog-004-bg);color:var(--vibeui-dialog-004-fg);
}
[data-vibeui-block="dialog-004"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-004-border) 30%,transparent)}
[data-vibeui-block="dialog-004"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-004-accent);outline-offset:2px}
[data-vibeui-dialog-004-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(27rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;
border:1px solid var(--vibeui-dialog-004-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:var(--vibeui-dialog-004-radius,1rem);
background:var(--vibeui-dialog-004-bg,light-dark(oklch(1 0 0),oklch(0.24 0.012 265)));
color:var(--vibeui-dialog-004-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-004-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-004-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-004-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-004-window]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
[data-vibeui-dialog-004-window] [data-part="title"]{margin:0 0 0.875rem;font-size:1.0625rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-004-window] [data-part="list"]{display:flex;flex-direction:column;gap:0.5rem}
[data-vibeui-dialog-004-window] [data-part="option"]{
display:flex;align-items:flex-start;gap:0.625rem;
padding:0.75rem 0.875rem;cursor:pointer;
border:1px solid var(--vibeui-dialog-004-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:0.75rem;
transition:border-color .16s ease,background-color .16s ease;
}
/* Подсветка выбранного — правилом :has, а не состоянием в React. */
[data-vibeui-dialog-004-window] [data-part="option"]:has(input:checked){
border-color:var(--vibeui-dialog-004-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));
background:color-mix(in oklab,var(--vibeui-dialog-004-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262))) 6%,transparent);
}
[data-vibeui-dialog-004-window] [data-part="option"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-004-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265))) 25%,transparent)}
[data-vibeui-dialog-004-window] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0.125rem 0 0;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
border:1.5px solid var(--vibeui-dialog-004-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
background:light-dark(oklch(1 0 0),oklch(0.2 0.01 265));cursor:inherit;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-dialog-004-window] input:checked{
border-color:var(--vibeui-dialog-004-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));
box-shadow:inset 0 0 0 3.5px var(--vibeui-dialog-004-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));
}
[data-vibeui-dialog-004-window] input:focus-visible{outline:2px solid var(--vibeui-dialog-004-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));outline-offset:2px}
[data-vibeui-dialog-004-window] [data-part="text"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-dialog-004-window] [data-part="label"]{font-size:0.875rem;font-weight:550;line-height:1.35}
[data-vibeui-dialog-004-window] [data-part="description"]{font-size:0.8125rem;line-height:1.45;color:var(--vibeui-dialog-004-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
[data-vibeui-dialog-004-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.25rem}
[data-vibeui-dialog-004-window] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;border:1px solid transparent;
}
[data-vibeui-dialog-004-window] [data-part="cancel"]{background:transparent;color:inherit;border-color:var(--vibeui-dialog-004-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)))}
[data-vibeui-dialog-004-window] [data-part="submit"]{background:var(--vibeui-dialog-004-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));color:light-dark(oklch(1 0 0),oklch(0.17 0.02 265))}
[data-vibeui-dialog-004-window] button:focus-visible{outline:2px solid var(--vibeui-dialog-004-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));outline-offset:2px}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-004-window]:popover-open){overflow:hidden}
/* Развёрнутый режим: окно стоит в потоке вместо кнопки, а не в верхнем слое.
   Без него на карточке каталога от компонента видна одна кнопка. */
[data-vibeui-block="dialog-004"]:has([data-open="true"]){display:block;width:100%}
[data-vibeui-block="dialog-004"]:has([data-open="true"]) [data-part="trigger"]{display:none}
[data-vibeui-dialog-004-window][data-open="true"]{
position:static;inset:auto;margin:0;width:100%;max-width:27rem;
opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-004"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-004-window]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_OPTIONS: Dialog004Option[] = [
  {
    value: "draft",
    label: "Сохранить как черновик",
    description: "Изменения останутся в редакторе и не попадут на сайт.",
  },
  {
    value: "publish",
    label: "Опубликовать сразу",
    description: "Страницы обновятся на сайте в течение минуты.",
  },
  {
    value: "schedule",
    label: "Запланировать публикацию",
    description: "Выберете дату и время на следующем шаге.",
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
 * Окно выбора одного варианта: карточки с нативными radio.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog004({
  id = "vibeui-dialog-004",
  open = false,
  trigger = "Опубликовать",
  title = "Что сделать с изменениями?",
  options = DEFAULT_OPTIONS,
  defaultValue = "publish",
  submitLabel = "Продолжить",
  cancelLabel = "Отмена",
  background = "",
  accent,
  className,
  style,
}: Dialog004Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-004" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-004"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-dialog-004-window=""
          data-open={open || undefined}
          role="dialog"
          aria-labelledby={`${id}-title`}
          style={palette}
        >
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          <form method="dialog">
            <div data-part="list">
              {options.map((option) => (
                <label key={option.value} data-part="option">
                  <input
                    type="radio"
                    name={`${id}-choice`}
                    value={option.value}
                    defaultChecked={option.value === defaultValue}
                  />
                  <span data-part="text">
                    <span data-part="label">{option.label}</span>
                    {option.description ? (
                      <span data-part="description">{option.description}</span>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
            <div data-part="actions">
              <button
                data-part="cancel"
                type="button"
                popoverTarget={id}
                autoFocus
              >
                {cancelLabel}
              </button>
              <button data-part="submit" type="submit" popoverTarget={id}>
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
