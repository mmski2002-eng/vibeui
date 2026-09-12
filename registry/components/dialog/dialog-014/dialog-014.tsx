import type { CSSProperties } from "react"

export type Dialog014Props = {
  id?: string
  /**
   * Показать окно раскрытым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  title?: string
  description?: string
  /** Сколько секунд осталось. Полоса убывает ровно столько же. */
  seconds?: number
  stayLabel?: string
  leaveLabel?: string
  accent?: string
  /** Подложка окна и кнопки. Пусто — собственная подложка по теме. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно истекающей сессии. Полоса времени убывает CSS-анимацией
// за то же число секунд, что стоит в тексте, — таймер не тикает в React и не
// перерисовывает страницу каждую секунду. Кнопка «остаться» стоит справа и
// выделена: выход по бездействию должен требовать бездействия, а не клика.
const STYLES = `
:where([data-vibeui-block="dialog-014"]){
--vibeui-dialog-014-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-dialog-014-muted:color-mix(in oklab,var(--vibeui-dialog-014-fg) 68%,transparent);
--vibeui-dialog-014-bg:light-dark(oklch(1 0 0),oklch(0.23 0 265));
--vibeui-dialog-014-mark:light-dark(oklch(0.263 0 0),oklch(0.925 0 0));
--vibeui-dialog-014-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0 262));
--vibeui-dialog-014-track:light-dark(oklch(0.93 0 265),oklch(0.3 0 265));
--vibeui-dialog-014-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-dialog-014-warn:light-dark(oklch(0.68 0.15 70),oklch(0.78 0.15 70));
--vibeui-dialog-014-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-dialog-014-radius:1rem;
--vibeui-dialog-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-014"]{color-scheme:dark}
[data-vibeui-block="dialog-014"]{display:inline-flex;font-family:var(--vibeui-dialog-014-font)}
[data-vibeui-block="dialog-014"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-014-border);border-radius:0.5rem;
background:var(--vibeui-dialog-014-bg);color:var(--vibeui-dialog-014-fg);
}
[data-vibeui-block="dialog-014"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-014-border) 30%,transparent)}
[data-vibeui-block="dialog-014"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-014-accent);outline-offset:2px}
[data-vibeui-dialog-014-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(25rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;overflow:hidden;
border:1px solid var(--vibeui-dialog-014-border,light-dark(oklch(0.89 0 265),oklch(0.36 0 265)));
border-radius:var(--vibeui-dialog-014-radius,1rem);
background:var(--vibeui-dialog-014-bg,light-dark(oklch(1 0 0),oklch(0.23 0 265)));
color:var(--vibeui-dialog-014-fg,light-dark(oklch(0.22 0 265),oklch(0.94 0 265)));
font-family:var(--vibeui-dialog-014-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-014-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-014-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-014-window]::backdrop{background:oklch(0.18 0 265 / 50%)}
[data-vibeui-dialog-014-window] [data-part="head"]{display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem}
[data-vibeui-dialog-014-window] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:2rem;height:2rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-dialog-014-warn,light-dark(oklch(0.68 0.15 70),oklch(0.78 0.15 70))) 16%,transparent);
color:var(--vibeui-dialog-014-mark,light-dark(oklch(0.45 0.11 70),oklch(0.86 0.12 70)));
font-size:0.875rem;font-weight:800;line-height:1;
}
[data-vibeui-dialog-014-window] [data-part="title"]{margin:0;font-size:1.0625rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-014-window] [data-part="description"]{margin:0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-dialog-014-muted,light-dark(oklch(0.5 0 265),oklch(0.7 0 265)))}
[data-vibeui-dialog-014-window] [data-part="track"]{
margin-top:1rem;height:0.25rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-dialog-014-track,light-dark(oklch(0.93 0 265),oklch(0.3 0 265)));
}
/* Полоса убывает ровно столько секунд, сколько названо в тексте. */
[data-vibeui-dialog-014-window] [data-part="bar"]{
display:block;height:100%;border-radius:inherit;transform-origin:left center;
background:var(--vibeui-dialog-014-warn,light-dark(oklch(0.68 0.15 70),oklch(0.78 0.15 70)));
animation:vibeui-dialog-014-drain linear forwards;
animation-duration:calc(var(--vibeui-dialog-014-seconds,60) * 1s);
}
@keyframes vibeui-dialog-014-drain{from{transform:scaleX(1)}to{transform:scaleX(0)}}
[data-vibeui-dialog-014-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.25rem}
[data-vibeui-dialog-014-window] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;border:1px solid transparent;
}
[data-vibeui-dialog-014-window] [data-part="leave"]{background:transparent;color:inherit;border-color:var(--vibeui-dialog-014-border,light-dark(oklch(0.89 0 265),oklch(0.36 0 265)))}
[data-vibeui-dialog-014-window] [data-part="stay"]{background:var(--vibeui-dialog-014-accent,light-dark(oklch(0.287 0 0),oklch(0.899 0 0)));color:var(--vibeui-dialog-014-on-accent,light-dark(oklch(1 0 0),oklch(0.18 0 262)))}
[data-vibeui-dialog-014-window] [data-part="stay"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-014-window] :focus-visible{outline:2px solid var(--vibeui-dialog-014-accent,light-dark(oklch(0.287 0 0),oklch(0.899 0 0)));outline-offset:2px}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-014-window]:popover-open){overflow:hidden}
/* Развёрнутый режим: окно стоит в потоке вместо кнопки, а не в верхнем слое.
   Без него на карточке каталога от компонента видна одна кнопка. */
[data-vibeui-block="dialog-014"]:has([data-open="true"]){display:block;width:100%}
[data-vibeui-block="dialog-014"]:has([data-open="true"]) [data-part="trigger"]{display:none}
[data-vibeui-dialog-014-window][data-open="true"]{
position:static;inset:auto;margin:0;width:100%;max-width:25rem;
opacity:1;transform:none;
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-014"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-014-window]{transition:none!important;opacity:1;transform:none}
[data-vibeui-dialog-014-window] [data-part="bar"]{transform:scaleX(1)}
}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая подложка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Окно истекающей сессии: полоса убывает столько же, сколько названо в тексте.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog014({
  id = "vibeui-dialog-014",
  open = false,
  trigger = "Показать окно сессии",
  title = "Сессия скоро закончится",
  description = "Мы выйдем из аккаунта через минуту бездействия. Несохранённые изменения останутся в черновике.",
  seconds = 60,
  stayLabel = "Остаться",
  leaveLabel = "Выйти",
  accent,
  background = "",
  className,
  style,
}: Dialog014Props) {
  const palette = {
    "--vibeui-dialog-014-seconds": seconds,
    ...(accent ? { "--vibeui-dialog-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-014" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-014"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover={open ? undefined : "auto"}
          data-vibeui-dialog-014-window=""
          data-open={open || undefined}
          role="alertdialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-description`}
          style={palette}
        >
          <div data-part="head">
            <span data-part="mark" aria-hidden="true">
              !
            </span>
            <h2 data-part="title" id={`${id}-title`}>
              {title}
            </h2>
          </div>
          <p data-part="description" id={`${id}-description`}>
            {description}
          </p>
          <div data-part="track" aria-hidden="true">
            <span data-part="bar" />
          </div>
          <div data-part="actions">
            <button data-part="leave" type="button" popoverTarget={id}>
              {leaveLabel}
            </button>
            {/* Фокус на «Остаться»: Enter вслепую не выкидывает из аккаунта. */}
            <button data-part="stay" type="button" popoverTarget={id} autoFocus>
              {stayLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
