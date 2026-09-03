import type { CSSProperties } from "react"

export type Dialog011Props = {
  id?: string
  trigger?: string
  title?: string
  description?: string
  /** Подпись под обложкой: размер, разрешение, дата. */
  meta?: string
  primaryLabel?: string
  primaryHref?: string
  closeLabel?: string
  /** Подложка окна. Пусто — цвет из палитры компонента. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: окно с обложкой сверху. Картинка занимает всю ширину и
// упирается в края — поэтому у окна нет внутреннего отступа сверху, а
// содержимое получает свой. Обложка нарисована градиентами: у компонента не
// может быть внешних файлов, а заглушка-серый прямоугольник выглядит поломкой.
const STYLES = `
:where([data-vibeui-block="dialog-011"]){
--vibeui-dialog-011-fg:light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265));
--vibeui-dialog-011-muted:color-mix(in oklab,var(--vibeui-dialog-011-fg) 68%,transparent);
--vibeui-dialog-011-bg:light-dark(oklch(1 0 0),oklch(0.24 0.012 265));
--vibeui-dialog-011-border:light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265));
--vibeui-dialog-011-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262));
--vibeui-dialog-011-radius:1rem;
--vibeui-dialog-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dialog-011"]{color-scheme:dark}
[data-vibeui-block="dialog-011"]{display:inline-flex;font-family:var(--vibeui-dialog-011-font)}
[data-vibeui-block="dialog-011"] [data-part="trigger"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:500;
display:inline-flex;align-items:center;height:2.25rem;padding:0 0.9375rem;
border:1px solid var(--vibeui-dialog-011-border);border-radius:0.5rem;
background:var(--vibeui-dialog-011-bg);color:var(--vibeui-dialog-011-fg);
}
[data-vibeui-block="dialog-011"] [data-part="trigger"]:hover{background:color-mix(in oklab,var(--vibeui-dialog-011-border) 30%,transparent)}
[data-vibeui-block="dialog-011"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dialog-011-accent);outline-offset:2px}
[data-vibeui-dialog-011-window]{
position:fixed;inset:0;margin:auto;height:fit-content;
width:min(26rem,calc(100vw - 2rem));box-sizing:border-box;padding:0;overflow:hidden;
border:1px solid var(--vibeui-dialog-011-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)));
border-radius:var(--vibeui-dialog-011-radius,1rem);
background:var(--vibeui-dialog-011-bg,light-dark(oklch(1 0 0),oklch(0.24 0.012 265)));
color:var(--vibeui-dialog-011-fg,light-dark(oklch(0.22 0.016 265),oklch(0.94 0.005 265)));
font-family:var(--vibeui-dialog-011-font,ui-sans-serif,system-ui,sans-serif);
box-shadow:0 24px 60px -24px oklch(0.2 0.03 265 / 45%);
opacity:0;transform:scale(0.97);
transition:opacity .18s ease,transform .18s ease,display .18s allow-discrete,overlay .18s allow-discrete;
}
[data-vibeui-dialog-011-window]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-dialog-011-window]:popover-open{opacity:0;transform:scale(0.97)}}
[data-vibeui-dialog-011-window]::backdrop{background:oklch(0.18 0.02 265 / 50%);backdrop-filter:blur(2px)}
/* Обложка градиентами: внешних файлов у компонента быть не может. */
[data-vibeui-dialog-011-window] [data-part="cover"]{
position:relative;aspect-ratio:16 / 9;
background:
radial-gradient(110% 90% at 18% 10%,color-mix(in oklab,var(--vibeui-dialog-011-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262))) 55%,transparent),transparent 62%),
linear-gradient(155deg,light-dark(oklch(0.93 0.03 265),oklch(0.38 0.04 265)),light-dark(oklch(0.84 0.05 250),oklch(0.3 0.05 250)));
}
/* Затемнение низа обложки: полупрозрачное, поэтому работает поверх обеих
   веток обложки и своей ветки не требует. */
[data-vibeui-dialog-011-window] [data-part="cover"]::after{
content:"";position:absolute;inset:auto 0 0;height:35%;
background:linear-gradient(to top,oklch(0.2 0.02 265 / 22%),transparent);
}
[data-vibeui-dialog-011-window] [data-part="body"]{padding:1.125rem 1.25rem 1.25rem}
[data-vibeui-dialog-011-window] [data-part="title"]{margin:0 0 0.25rem;font-size:1.0625rem;font-weight:640;line-height:1.3}
[data-vibeui-dialog-011-window] [data-part="description"]{margin:0;font-size:0.875rem;line-height:1.55;color:var(--vibeui-dialog-011-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)))}
[data-vibeui-dialog-011-window] [data-part="meta"]{
display:block;margin-top:0.625rem;font-size:0.75rem;
color:var(--vibeui-dialog-011-muted,light-dark(oklch(0.5 0.014 265),oklch(0.7 0.012 265)));font-variant-numeric:tabular-nums;
}
[data-vibeui-dialog-011-window] [data-part="actions"]{display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1.125rem}
[data-vibeui-dialog-011-window] [data-part="close"],
[data-vibeui-dialog-011-window] [data-part="primary"]{
cursor:pointer;font:inherit;font-size:0.875rem;font-weight:600;
display:inline-flex;align-items:center;min-height:2.25rem;padding:0.3125rem 1rem;
border-radius:0.5rem;border:1px solid transparent;text-decoration:none;
}
[data-vibeui-dialog-011-window] [data-part="close"]{background:transparent;color:inherit;border-color:var(--vibeui-dialog-011-border,light-dark(oklch(0.89 0.006 265),oklch(0.38 0.012 265)))}
[data-vibeui-dialog-011-window] [data-part="primary"]{background:var(--vibeui-dialog-011-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));color:light-dark(oklch(1 0 0),oklch(0.17 0.02 265))}
[data-vibeui-dialog-011-window] [data-part="primary"]:hover{filter:brightness(0.94)}
[data-vibeui-dialog-011-window] :focus-visible{outline:2px solid var(--vibeui-dialog-011-accent,light-dark(oklch(0.55 0.2 262),oklch(0.72 0.18 262)));outline-offset:2px}
/* Popover страницу не блокирует: фон под окном иначе продолжает прокручиваться. */
html:has([data-vibeui-dialog-011-window]:popover-open){overflow:hidden}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="dialog-011"] *{animation:none!important;transition:none!important}
[data-vibeui-dialog-011-window]{transition:none!important;opacity:1;transform:none}
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
 * Окно с обложкой во всю ширину: превью материала и действие.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dialog011({
  id = "vibeui-dialog-011",
  trigger = "Открыть превью",
  title = "Главная страница",
  description = "Черновик с изменениями от 12 марта. Опубликованная версия отличается блоком тарифов.",
  meta = "1440 × 900 · 320 КБ · 12 марта, 14:08",
  primaryLabel = "Опубликовать",
  primaryHref = "#",
  closeLabel = "Закрыть",
  background = "",
  accent,
  className,
  style,
}: Dialog011Props) {
  const palette = {
    ...(accent ? { "--vibeui-dialog-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dialog-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dialog-011" precedence="medium">
        {STYLES}
      </style>
      <div
        data-slot="dialog"
        data-vibeui-block="dialog-011"
        className={className}
        style={palette}
      >
        <button data-part="trigger" type="button" popoverTarget={id}>
          {trigger}
        </button>
        <div
          id={id}
          popover="auto"
          data-vibeui-dialog-011-window=""
          role="dialog"
          aria-labelledby={`${id}-title`}
          aria-describedby={description ? `${id}-description` : undefined}
          style={palette}
        >
          <div data-part="cover" aria-hidden="true" />
          <div data-part="body">
            <h2 data-part="title" id={`${id}-title`}>
              {title}
            </h2>
            {description ? (
              <p data-part="description" id={`${id}-description`}>
                {description}
              </p>
            ) : null}
            {meta ? <span data-part="meta">{meta}</span> : null}
            <div data-part="actions">
              <button
                data-part="close"
                type="button"
                popoverTarget={id}
                autoFocus
              >
                {closeLabel}
              </button>
              {primaryLabel ? (
                <a data-part="primary" href={primaryHref}>
                  {primaryLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
