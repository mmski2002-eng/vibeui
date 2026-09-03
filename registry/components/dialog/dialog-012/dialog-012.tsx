import type { CSSProperties } from "react"

export type Dialog012Props = {
  id?: string
  trigger?: string
  title?: string
  description?: string
  /** Сам ключ. Показывается один раз — повторно его не покажут. */
  value?: string
  warning?: string
  copyLabel?: string
  doneLabel?: string
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  /** Акцент: кнопка копирования и кольцо фокуса. */
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно с секретом, который показывают один раз. Ключ набран
// моноширинным и переносится по символам, а не по словам: обрезанный
// многоточием ключ бесполезен. Предупреждение стоит под ключом, а не над ним —
// его читают после того, как увидели, что именно нужно сохранить.
const STYLES = `
:where([data-vibeui-block="dialog-012"]){
--vibeui-dialog-012-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-012-muted:color-mix(in oklab,var(--vibeui-dialog-012-fg) 68%,transparent);
--vibeui-dialog-012-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dialog-012-code-bg:light-dark(oklch(0.22 0.014 265),oklch(0.17 0.012 265));
--vibeui-dialog-012-code-fg:light-dark(oklch(0.95 0.006 265),oklch(0.93 0.006 265));
--vibeui-dialog-012-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265));
--vibeui-dialog-012-warn:light-dark(oklch(0.68 0.15 70),oklch(0.78 0.14 70));
--vibeui-dialog-012-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-dialog-012-radius:1rem;
--vibeui-dialog-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-dialog-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-012"]{color-scheme:dark}
[data-vibeui-block="dialog-012"]{display:inline-flex;font-family:var(--vibeui-dialog-012-font)}
[data-vibeui-block="dialog-012"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-012-border);border-radius:0.5rem;
background:var(--vibeui-dialog-012-bg);color:var(--vibeui-dialog-012-fg);
}
[data-vibeui-block="dialog-012"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-012-border) 30%,transparent)}
[data-vibeui-block="dialog-012"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-012-accent);outline-offset:2px}
[data-vibeui-dialog-012-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(28rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.375rem;
border:1px solid var(--vibeui-dialog-012-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:var(--vibeui-dialog-012-radius,1rem);
background:var(--vibeui-dialog-012-bg,light-dark(oklch(1 0 0),oklch(0.24 0.012 265)));
color:var(--vibeui-dialog-012-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-012-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-012-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-012-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-012-window]::backdrop{background:oklch(0.18 0.02 265 / 50%)}
[data-vibeui-dialog-012-window] [data-part="title"]{margin:0 0 0.375rem;font-size:1.0625rem;font-weight:620;line-height:1.35}
[data-vibeui-dialog-012-window] [data-part="description"]{margin:0 0 0.875rem;font-size:0.875rem;line-height:1.55;color:var(--vibeui-dialog-012-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
/* Ключ переносится по символам: обрезанный многоточием секрет бесполезен. */
[data-vibeui-dialog-012-window] [data-part="value"]{
display:block;padding:0.75rem 0.875rem;border-radius:0.625rem;
background:var(--vibeui-dialog-012-code-bg,light-dark(oklch(0.22 0.014 265),oklch(0.17 0.012 265)));
color:var(--vibeui-dialog-012-code-fg,light-dark(oklch(0.95 0.006 265),oklch(0.93 0.006 265)));
font-family:var(--vibeui-dialog-012-mono,ui-monospace,monospace);
font-size:0.8125rem;line-height:1.6;word-break:break-all;
}
[data-vibeui-dialog-012-window] [data-part="warning"]{
display:flex;align-items:flex-start;gap:0.5rem;margin:0.875rem 0 0;
padding:0.625rem 0.75rem;border-radius:0.625rem;
background:color-mix(in oklab,var(--vibeui-dialog-012-warn,light-dark(oklch(0.68 0.15 70),oklch(0.78 0.14 70))) 12%,transparent);
font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-dialog-012-window] [data-part="warning"]::before{
content:"!";flex:none;
display:flex;align-items:center;justify-content:center;
width:1.125rem;height:1.125rem;margin-top:0.0625rem;border-radius:9999px;
background:var(--vibeui-dialog-012-warn,light-dark(oklch(0.68 0.15 70),oklch(0.78 0.14 70)));
/* Знак тёмный в обеих темах: янтарная заливка светлая в обеих ветках. */
color:oklch(0.2 0.02 70);font-size:0.6875rem;font-weight:800;
}
[data-vibeui-dialog-012-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.25rem}
[data-vibeui-dialog-012-window] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;height:2.25rem;padding:0 1rem;
border-radius:0.5rem;border:1px solid transparent;
}
[data-vibeui-dialog-012-window] [data-part="done"]{background:transparent;color:inherit;border-color:var(--vibeui-dialog-012-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)))}
[data-vibeui-dialog-012-window] [data-part="copy"]{background:var(--vibeui-dialog-012-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));color:light-dark(oklch(1 0 0),oklch(0.17 0.02 265))}
[data-vibeui-dialog-012-window] [data-part="copy"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-012-window] :focus-visible{outline:2px solid var(--vibeui-dialog-012-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));outline-offset:2px}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-012-window]:popover-open){overflow:hidden}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-012"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-012-window]{transition:none!important;opacity:1;transform:none}
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
 * Окно с секретом, который показывают один раз: ключ и предупреждение.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog012({
  id = "vibeui-dialog-012",
  trigger = "Создать ключ",
  title = "Ключ доступа к API",
  description = "Ключ даёт полный доступ к проектам вашей команды.",
  value = "vibeui_sk_8f2c41ab9d70e5b3c6a1f4820d7e93bb5c02af61",
  warning = "Мы показываем ключ один раз. Сохраните его сейчас — восстановить будет нельзя, только выпустить новый.",
  copyLabel = "Копировать ключ",
  doneLabel = "Я сохранил",
  background = "",
  accent,
  className,
  style,
}: Dialog012Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-012" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-012"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-012-window=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-description` : undefined}
          style={palette}
        >
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          {description ? (
            <p data-part="description" id={`${id}-description`}>
              {description}
            </p>
          ) : null}
          <code data-part="value">{value}</code>
          {warning ? <p data-part="warning">{warning}</p> : null}
          <div data-part="actions">
            <button data-part="done" type="button" popoverTarget={id} autoFocus>
              {doneLabel}
            </button>
            <button data-part="copy" type="button">
              {copyLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
