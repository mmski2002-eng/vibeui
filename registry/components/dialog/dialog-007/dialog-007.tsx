import type { CSSProperties, ReactNode } from "react"

export type Dialog007Action = {
  label: string
  href?: string
  danger?: boolean
}

export type Dialog007Props = {
  id?: string
  /**
   * Показать окно раскрытым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  title?: string
  description?: string
  actions?: Dialog007Action[]
  cancelLabel?: string
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  /** Акцент: кольцо фокуса на листе и на кнопке. */
  accent?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

// Идея компонента: лист действий, выезжающий снизу, — привычная форма выбора
// на телефоне, где до верха экрана большой палец не достаёт. На широком экране
// он превращается в обычное окно по центру: одна разметка, две раскладки,
// переключение обычным медиазапросом по ширине окна, а не блока — лист
// позиционируется относительно экрана, а не родителя.
const STYLES = `
:where([data-vibeui-block="dialog-007"]){
--vibeui-dialog-007-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dialog-007-muted:color-mix(in oklab,var(--vibeui-dialog-007-fg) 68%,transparent);
--vibeui-dialog-007-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-dialog-007-border:light-dark(oklch(0.9 0 265),oklch(0.38 0 265));
--vibeui-dialog-007-danger:light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25));
--vibeui-dialog-007-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.18 39.8));
--vibeui-dialog-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-007"]{color-scheme:dark}
[data-vibeui-block="dialog-007"]{display:inline-flex;font-family:var(--vibeui-dialog-007-font)}
[data-vibeui-block="dialog-007"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-007-border);border-radius:0.5rem;
background:var(--vibeui-dialog-007-bg);color:var(--vibeui-dialog-007-fg);
}
[data-vibeui-block="dialog-007"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-007-border) 30%,transparent)}
[data-vibeui-block="dialog-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-007-accent);outline-offset:2px}
/* Мобильная раскладка по умолчанию: лист прижат к нижнему краю экрана. */
[data-vibeui-dialog-007-sheet]{
position:fixed;inset:auto 0 0;margin:0;
width:100%;box-sizing:border-box;padding:0.75rem 0.75rem 1rem;
border:0;border-radius:1.25rem 1.25rem 0 0;
background:var(--vibeui-dialog-007-bg,light-dark(oklch(1 0 0),oklch(0.24 0 265)));
color:var(--vibeui-dialog-007-fg,light-dark(oklch(0.22 0 265),oklch(0.94 0 265)));
font-family:var(--vibeui-dialog-007-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 -12px 40px -20px oklch(0.2 0 265 / 45%);
translate:0 100%;
transition:translate .24s cubic-bezier(.32,.72,0,1),display .24s allow-discrete,overlay .24s allow-discrete;
}
[data-vibeui-dialog-007-sheet]:popover-open{translate:0 0}
@starting-style{[data-vibeui-dialog-007-sheet]:popover-open{translate:0 100%}}
[data-vibeui-dialog-007-sheet]::backdrop{background:oklch(0.18 0 265 / 45%)}
/* Полоска-ручка: сообщает, что лист пришёл снизу и туда же уйдёт. */
[data-vibeui-dialog-007-sheet] [data-part="grip"]{
display:block;width:2.25rem;height:0.25rem;margin:0 auto 0.75rem;
border-radius:9999px;background:var(--vibeui-dialog-007-border,light-dark(oklch(0.9 0 265),oklch(0.38 0 265)));
}
[data-vibeui-dialog-007-sheet] [data-part="head"]{padding:0 0.5rem 0.625rem}
[data-vibeui-dialog-007-sheet] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-007-sheet] [data-part="description"]{margin:0.125rem 0 0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-dialog-007-muted,light-dark(oklch(0.5 0 265),oklch(0.7 0 265)))}
[data-vibeui-dialog-007-sheet] [data-part="list"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-dialog-007-sheet] [data-part="action"]{
display:flex;align-items:center;width:100%;box-sizing:border-box;
padding:0.8125rem 0.75rem;border:0;border-radius:0.75rem;
background:transparent;color:inherit;text-decoration:none;
font:inherit;font-size:0.9375rem;cursor:pointer;text-align:left;
transition:background-color .16s ease;
}
[data-vibeui-dialog-007-sheet] [data-part="action"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-007-border,light-dark(oklch(0.9 0 265),oklch(0.38 0 265))) 35%,transparent)}
[data-vibeui-dialog-007-sheet] [data-part="action"][data-danger="true"]{color:var(--vibeui-dialog-007-danger,light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25)))}
[data-vibeui-dialog-007-sheet] [data-cancel="true"]{
margin-top:0.5rem;justify-content:center;font-weight:600;
background:color-mix(in oklab,var(--vibeui-dialog-007-border,light-dark(oklch(0.9 0 265),oklch(0.38 0 265))) 35%,transparent);
}
[data-vibeui-dialog-007-sheet] :focus-visible{outline:2px solid var(--vibeui-dialog-007-accent,light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.18 39.8)));outline-offset:-2px}
/* От 40rem ширины окна лист становится обычным окном по центру. */
@media (min-width: 40rem){
[data-vibeui-dialog-007-sheet]{
inset:0;margin:auto;height:fit-content;
width:min(22rem,calc(100vw - 2rem));
border:1px solid var(--vibeui-dialog-007-border,light-dark(oklch(0.9 0 265),oklch(0.38 0 265)));
border-radius:1rem;padding:1rem;
translate:0 0;opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-007-sheet]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-007-sheet]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-007-sheet] [data-part="grip"]{display:none}
}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-007-sheet]:popover-open){overflow:hidden}
/* Развёрнутый режим: окно стоит в потоке вместо кнопки, а не в верхнем слое.
   Без него на карточке каталога от компонента видна одна кнопка. */
[data-vibeui-block="dialog-007"]:has([data-open="true"]){display:block;width:100%}
[data-vibeui-block="dialog-007"]:has([data-open="true"]) [data-part="trigger"]{display:none}
[data-vibeui-dialog-007-sheet][data-open="true"]{
position:static;inset:auto;margin:0;width:100%;max-width:22rem;
translate:0 0;opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-007"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-007-sheet]{transition:none!important;translate:0 0;opacity:1;transform:none}
}
`

const DEFAULT_ACTIONS: Dialog007Action[] = [
  { label: "Дублировать проект", href: "#" },
  { label: "Экспортировать в архив", href: "#" },
  { label: "Перенести в другую папку", href: "#" },
  { label: "Удалить проект", href: "#", danger: true },
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
 * Лист действий снизу на телефоне и обычное окно на широком экране.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog007({
  id = "vibeui-dialog-007",
  open = false,
  trigger = "Действия",
  title = "Сайт студии",
  description = "Опубликован 12 марта",
  actions = DEFAULT_ACTIONS,
  cancelLabel = "Отмена",
  background = "",
  accent,
  children,
  className,
  style,
}: Dialog007Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-007" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-007"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-dialog-007-sheet=""
          data-open={open || undefined}
          role="dialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-description` : undefined}
          style={palette}
        >
          <span data-part="grip" aria-hidden="true" />
          <div data-part="head">
            <p data-part="title" id={`${id}-title`}>
              {title}
            </p>
            {description ? (
              <p data-part="description" id={`${id}-description`}>
                {description}
              </p>
            ) : null}
          </div>
          <div data-part="list">
            {children ??
              actions.map((action) => (
                <a
                  key={action.label}
                  data-part="action"
                  data-danger={action.danger || undefined}
                  href={action.href}
                >
                  {action.label}
                </a>
              ))}
            <button
              data-part="action"
              data-cancel="true"
              type="button"
              popoverTarget={id}
              autoFocus
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
