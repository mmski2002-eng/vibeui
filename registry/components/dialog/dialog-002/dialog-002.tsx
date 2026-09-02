import type { CSSProperties } from "react"

export type Dialog002Props = {
  id?: string
  trigger?: string
  title?: string
  description?: string
  /** Что именно исчезнет: перечень, а не одна строка «все данные». */
  losses?: string[]
  confirmLabel?: string
  cancelLabel?: string
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  /** Цвет опасного действия: кнопка, значок и маркеры списка. */
  danger?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно необратимого действия. В отличие от обычного
// подтверждения здесь перечислено, что именно исчезнет: конкретика — то
// единственное, что заставляет остановиться. Отмена стоит первой и остаётся
// простым выходом, подтверждение красное и стоит справа.
//
// Открытие держит HTML popover: Esc, клик мимо, подложка и верхний слой
// достаются от браузера. Окно живёт в верхнем слое, поэтому стилизуется по
// атрибуту и получает палитру собственным style.
const STYLES = `
:where([data-vibeui-block="dialog-002"]){
--vibeui-dialog-002-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-002-muted:light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265));
--vibeui-dialog-002-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dialog-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-dialog-002-danger:light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25));
--vibeui-dialog-002-radius:1rem;
--vibeui-dialog-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dialog-002"]{display:inline-flex;font-family:var(--vibeui-dialog-002-font)}
[data-vibeui-block="dialog-002"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid color-mix(in oklab,var(--vibeui-dialog-002-danger) 35%,transparent);
border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-dialog-002-danger) 8%,transparent);
color:var(--vibeui-dialog-002-danger);
transition:background-color .16s ease;
}
[data-vibeui-block="dialog-002"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-002-danger) 14%,transparent)}
[data-vibeui-block="dialog-002"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-002-danger);outline-offset:2px}
[data-vibeui-dialog-002-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(28rem,calc(100vw - 2rem));box-sizing:border-box;
padding:1.5rem;
border:1px solid var(--vibeui-dialog-002-border,light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265)));
border-radius:var(--vibeui-dialog-002-radius,1rem);
background:var(--vibeui-dialog-002-bg,light-dark(oklch(1 0 0),oklch(0.24 0.012 265)));
color:var(--vibeui-dialog-002-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-002-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-002-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-002-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-002-window]::backdrop{background:oklch(0.18 0.02 265 / 50%);backdrop-filter:blur(2px)}
/* Значок в круге: окно про удаление узнают до чтения заголовка. */
[data-vibeui-dialog-002-window] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;margin-bottom:0.875rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-dialog-002-danger,light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25))) 14%,transparent);
color:var(--vibeui-dialog-002-danger,light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25)));
font-size:1.125rem;font-weight:800;line-height:1;
}
[data-vibeui-dialog-002-window] [data-part="title"]{margin:0 0 0.375rem;font-size:1.0625rem;font-weight:650;line-height:1.35}
[data-vibeui-dialog-002-window] [data-part="description"]{margin:0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-dialog-002-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
[data-vibeui-dialog-002-window] ul{margin:0.875rem 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.25rem}
[data-vibeui-dialog-002-window] li{
position:relative;padding-left:1rem;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-dialog-002-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)));
}
[data-vibeui-dialog-002-window] li::before{
content:"";position:absolute;left:0;top:0.5rem;width:0.3125rem;height:0.3125rem;
border-radius:9999px;background:color-mix(in oklab,var(--vibeui-dialog-002-danger,light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25))) 55%,transparent);
}
[data-vibeui-dialog-002-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.375rem}
[data-vibeui-dialog-002-window] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;border:1px solid transparent;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-dialog-002-window] [data-part="cancel"]{
background:transparent;color:inherit;
border-color:var(--vibeui-dialog-002-border,light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265)));
}
[data-vibeui-dialog-002-window] [data-part="cancel"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-002-border,light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265))) 40%,transparent)}
[data-vibeui-dialog-002-window] [data-part="confirm"]{
background:var(--vibeui-dialog-002-danger,light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25)));color:light-dark(oklch(0.99 0.01 25),oklch(0.18 0.02 25));
}
[data-vibeui-dialog-002-window] [data-part="confirm"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-002-window] button:focus-visible{outline:2px solid var(--vibeui-dialog-002-danger,light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25)));outline-offset:2px}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-002"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-002-window]{transition:none!important;opacity:1;transform:none}
}
`

const DEFAULT_LOSSES = [
  "18 страниц и вся история публикаций",
  "домен studio-polet.ru и его сертификат",
  "доступы четырёх участников",
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
 * Окно необратимого удаления: перечень потерь и красное подтверждение.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog002({
  id = "vibeui-dialog-002",
  trigger = "Удалить проект",
  title = "Удалить проект «Сайт студии»?",
  description = "Действие необратимо: восстановить проект из резервной копии мы не сможем.",
  losses = DEFAULT_LOSSES,
  confirmLabel = "Удалить навсегда",
  cancelLabel = "Отмена",
  background = "",
  danger,
  className,
  style,
}: Dialog002Props) {
  const palette = {
    ...(danger ? { "--vibeui-dialog-002-danger": danger } : null),
    ...(background
      ? {
          "--vibeui-dialog-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-002" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-block="dialog-002" className={className} style={palette}>
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-002-window=""
          role="alertdialog"
          aria-labelledby={`${id}-title`}
          style={palette}
        >
          <span data-part="mark" aria-hidden="true">
            !
          </span>
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          <p data-part="description">{description}</p>
          {losses.length ? (
            <ul>
              {losses.map((loss) => (
                <li key={loss}>{loss}</li>
              ))}
            </ul>
          ) : null}
          <div data-part="actions">
            <button data-part="cancel" type="button" popoverTarget={id}>
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
