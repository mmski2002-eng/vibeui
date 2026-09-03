import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Dialog001Props = Omit<
  ComponentProps<"div">,
  "title" | "children" | "id"
> & {
  /** Уникальный идентификатор: связывает кнопку и окно. */
  id?: string
  trigger?: string
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Собственное содержимое вместо описания. */
  children?: ReactNode
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  accent?: string
}

// Идея компонента: модальное окно без единой строки JS. Открытие и закрытие
// держит HTML popover: кнопка объявляет цель через popovertarget, браузер сам
// даёт закрытие по Esc и клику мимо, подложку через ::backdrop и верхний слой,
// в котором окно не зависит от overflow и z-index родителей.
const STYLES = `
:where([data-vibeui-block="dialog-001"]){
--vibeui-dialog-001-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-001-muted:color-mix(in oklab,var(--vibeui-dialog-001-fg) 68%,transparent);
--vibeui-dialog-001-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dialog-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-dialog-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-dialog-001-accent-fg:light-dark(oklch(1 0 0),oklch(0.17 0.02 265));
--vibeui-dialog-001-radius:1rem;
--vibeui-dialog-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-001"]{color-scheme:dark}
[data-vibeui-block="dialog-001"]{
display:inline-flex;font-family:var(--vibeui-dialog-001-font);
}
[data-vibeui-block="dialog-001"] [data-part="trigger"],
[data-vibeui-block="dialog-001"] [data-part="confirm"],
[data-vibeui-block="dialog-001"] [data-part="cancel"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;justify-content:center;
height:2.25rem;padding:0 0.9375rem;border-radius:0.5rem;border:1px solid transparent;
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="dialog-001"] [data-part="trigger"],
[data-vibeui-block="dialog-001"] [data-part="confirm"]{
background:var(--vibeui-dialog-001-accent);color:var(--vibeui-dialog-001-accent-fg);
}
[data-vibeui-block="dialog-001"] [data-part="trigger"]:hover,
[data-vibeui-block="dialog-001"] [data-part="confirm"]:hover{
background:color-mix(in oklab,var(--vibeui-dialog-001-accent) 88%,black);
}
[data-vibeui-block="dialog-001"] [data-part="cancel"]{
background:transparent;color:var(--vibeui-dialog-001-fg);
border-color:var(--vibeui-dialog-001-border);
}
[data-vibeui-block="dialog-001"] [data-part="cancel"]:hover{
background:color-mix(in oklab,var(--vibeui-dialog-001-border) 40%,transparent);
}
[data-vibeui-block="dialog-001"] [data-part="trigger"]:focus-visible,
[data-vibeui-block="dialog-001"] [data-part="confirm"]:focus-visible,
[data-vibeui-block="dialog-001"] [data-part="cancel"]:focus-visible{
outline:2px solid var(--vibeui-dialog-001-accent);outline-offset:2px;
}
[data-vibeui-dialog-001-window]{
/* inset:0 вместе с margin:auto центрирует окно в верхнем слое. */
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(26rem,calc(100vw - 2rem));box-sizing:border-box;
padding:1.375rem;border:1px solid var(--vibeui-dialog-001-border,light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265)));
border-radius:var(--vibeui-dialog-001-radius,1rem);
background:var(--vibeui-dialog-001-bg,light-dark(oklch(1 0 0),oklch(0.24 0.012 265)));
color:var(--vibeui-dialog-001-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-001-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:translateY(0.5rem) scale(0.98);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-001-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-001-window]:popover-open{opacity:0;transform:translateY(0.5rem) scale(0.98)}}
[data-vibeui-dialog-001-window]::backdrop{
background:oklch(0.18 0.02 265 / 45%);backdrop-filter:blur(2px);
}
[data-vibeui-dialog-001-window] [data-part="title"]{margin:0 0 0.375rem;font-size:1.0625rem;font-weight:600;line-height:1.35}
[data-vibeui-dialog-001-window] [data-part="body"]{margin:0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-dialog-001-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
[data-vibeui-dialog-001-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.125rem}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-001-window]:popover-open){overflow:hidden}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-001"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-001-window]{transition:none!important;opacity:1;transform:none}
}
`

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
 * Модальное окно на HTML popover: открытие, Esc и клик мимо — без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog001({
  id = "vibeui-dialog-001",
  trigger = "Удалить проект",
  title = "Удалить проект?",
  description = "Вместе с проектом удалятся страницы, домены и история публикаций. Отменить это будет нельзя.",
  confirmLabel = "Удалить",
  cancelLabel = "Отмена",
  children,
  background = "",
  accent,
  className,
  style,
  ...props
}: Dialog001Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dialog"
        data-vibeui-block="dialog-001"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-001-window=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={children ? undefined : `${id}-description`}
          style={palette}
        >
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          {children ?? (
            <p data-part="body" id={`${id}-description`}>
              {description}
            </p>
          )}
          <div data-part="actions">
            <button
              data-part="cancel"
              type="button"
              popoverTarget={id}
              autoFocus
            >
              {cancelLabel}
            </button>
            <button data-part="confirm" type="button" popoverTarget={id}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
