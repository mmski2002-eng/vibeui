import type { CSSProperties } from "react"

export type Dialog005Tone = "success" | "danger"

export type Dialog005Props = {
  id?: string
  trigger?: string
  tone?: Dialog005Tone
  title?: string
  description?: string
  /** Строка-итог под текстом: адрес, номер, время выполнения. */
  detail?: string
  primaryLabel?: string
  primaryHref?: string
  closeLabel?: string
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно результата операции. У него один смысловой центр —
// крупный знак сверху, потому что первое, что нужно понять, это «получилось
// или нет». Кнопка ведёт к результату (открыть сайт, посмотреть журнал), а
// закрытие остаётся тихим: окно результата не требует решения.
const STYLES = `
:where([data-vibeui-block="dialog-005"]){
--vibeui-dialog-005-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-005-muted:color-mix(in oklab,var(--vibeui-dialog-005-fg) 68%,transparent);
--vibeui-dialog-005-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dialog-005-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265));
--vibeui-dialog-005-tone:light-dark(oklch(0.58 0.15 152),oklch(0.72 0.14 152));
--vibeui-dialog-005-radius:1rem;
--vibeui-dialog-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-005"]{color-scheme:dark}
[data-vibeui-block="dialog-005"]{display:inline-flex;font-family:var(--vibeui-dialog-005-font)}
[data-vibeui-block="dialog-005"][data-tone="danger"]{--vibeui-dialog-005-tone:light-dark(oklch(0.56 0.19 25),oklch(0.7 0.17 25))}
[data-vibeui-block="dialog-005"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-005-border);border-radius:0.5rem;
background:var(--vibeui-dialog-005-bg);color:var(--vibeui-dialog-005-fg);
}
[data-vibeui-block="dialog-005"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-005-border) 30%,transparent)}
[data-vibeui-block="dialog-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-005-tone);outline-offset:2px}
[data-vibeui-dialog-005-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(24rem,calc(100vw - 2rem));box-sizing:border-box;padding:1.5rem;
text-align:center;
border:1px solid var(--vibeui-dialog-005-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:var(--vibeui-dialog-005-radius,1rem);
background:var(--vibeui-dialog-005-bg,light-dark(oklch(1 0 0),oklch(0.24 0.012 265)));
color:var(--vibeui-dialog-005-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-005-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.96);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-005-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-005-window]:popover-open{opacity:0;transform:scale(0.96)}}
[data-vibeui-dialog-005-window]::backdrop{background:oklch(0.18 0.02 265 / 45%)}
/* Знак результата: круг с галочкой или восклицательным знаком на CSS. */
[data-vibeui-dialog-005-window] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:3rem;height:3rem;margin:0 auto 0.875rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-dialog-005-tone,light-dark(oklch(0.58 0.15 152),oklch(0.72 0.14 152))) 14%,transparent);
color:var(--vibeui-dialog-005-tone,light-dark(oklch(0.58 0.15 152),oklch(0.72 0.14 152)));
font-size:1.375rem;font-weight:800;line-height:1;
}
[data-vibeui-dialog-005-window] [data-part="title"]{margin:0 0 0.375rem;font-size:1.0625rem;font-weight:650;line-height:1.35}
[data-vibeui-dialog-005-window] [data-part="description"]{margin:0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-dialog-005-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
[data-vibeui-dialog-005-window] [data-part="detail"]{
display:inline-block;margin-top:0.875rem;padding:0.375rem 0.625rem;
border-radius:0.5rem;background:color-mix(in oklab,var(--vibeui-dialog-005-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265))) 35%,transparent);
font-size:0.8125rem;
}
[data-vibeui-dialog-005-window] [data-part="actions"]{display:flex;flex-direction:column;gap:0.5rem;margin-top:1.25rem}
[data-vibeui-dialog-005-window] [data-part="primary"]{
display:inline-flex;align-items:center;justify-content:center;height:2.375rem;
border-radius:0.5rem;text-decoration:none;
background:var(--vibeui-dialog-005-tone,light-dark(oklch(0.58 0.15 152),oklch(0.72 0.14 152)));color:light-dark(oklch(1 0 0),oklch(0.17 0.02 265));
font-size:0.875rem;font-weight:600;
}
[data-vibeui-dialog-005-window] [data-part="primary"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-005-window] [data-part="close"]{
appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-dialog-005-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)));font:inherit;font-size:0.875rem;
}
[data-vibeui-dialog-005-window] [data-part="close"]:hover{color:var(--vibeui-dialog-005-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)))}
[data-vibeui-dialog-005-window] a:focus-visible,
[data-vibeui-dialog-005-window] button:focus-visible{outline:2px solid var(--vibeui-dialog-005-tone,light-dark(oklch(0.58 0.15 152),oklch(0.72 0.14 152)));outline-offset:2px;border-radius:0.375rem}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-005-window]:popover-open){overflow:hidden}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-005"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-005-window]{transition:none!important;opacity:1;transform:none}
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
 * Окно результата операции: крупный знак, итог и путь дальше.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog005({
  id = "vibeui-dialog-005",
  trigger = "Показать результат",
  tone = "success",
  title = "Проект опубликован",
  description = "Сборка заняла 42 секунды. Изменения уже видны посетителям.",
  detail = "studio-polet.ru",
  primaryLabel = "Открыть сайт",
  primaryHref = "#",
  closeLabel = "Закрыть",
  background = "",
  className,
  style,
}: Dialog005Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-dialog-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-005" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-005"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-005-window=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-description` : undefined}
          style={palette}
        >
          <span data-part="mark" aria-hidden="true">
            {tone === "success" ? "✓" : "!"}
          </span>
          <h2 data-part="title" id={`${id}-title`}>
            {title}
          </h2>
          {description ? (
            <p data-part="description" id={`${id}-description`}>
              {description}
            </p>
          ) : null}
          {detail ? <span data-part="detail">{detail}</span> : null}
          <div data-part="actions">
            {primaryLabel ? (
              <a data-part="primary" href={primaryHref}>
                {primaryLabel}
              </a>
            ) : null}
            <button
              data-part="close"
              type="button"
              popoverTarget={id}
              autoFocus
            >
              {closeLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
