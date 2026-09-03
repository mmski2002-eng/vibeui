import type { ComponentProps, CSSProperties } from "react"

export type Alert019Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  /** Что нужно сделать: короткие шаги, а не абзац. */
  steps?: string[]
  actionLabel?: string
  actionHref?: string
  /** Подпись сбоку: срок, ответственный, номер заявки. */
  meta?: string
  accent?: string
  /** Пусто — подложки нет, инструкция лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: алерт с инструкцией. Обычное сообщение говорит, что не так;
// это — что сделать, поэтому шаги пронумерованы и стоят отдельным столбиком.
// Нумерация не декоративная: по ней спрашивают «я застрял на втором», и
// поддержке не приходится выяснять, о каком месте речь.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-019"]){
--vibeui-alert-019-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.006 265));
--vibeui-alert-019-muted:color-mix(in oklab,var(--vibeui-alert-019-fg) 68%,transparent);
--vibeui-alert-019-bg:transparent;
--vibeui-alert-019-panel:light-dark(oklch(0.975 0.004 265),oklch(0.28 0.01 265));
--vibeui-alert-019-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-alert-019-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-alert-019-accent-fg:light-dark(oklch(1 0 0),oklch(0.18 0.01 265));
--vibeui-alert-019-radius:0.875rem;
--vibeui-alert-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-019"]{color-scheme:dark}
[data-vibeui-block="alert-019"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
padding:1rem 1.0625rem;
border:1px solid var(--vibeui-alert-019-border);
border-radius:var(--vibeui-alert-019-radius);
background:var(--vibeui-alert-019-bg);color:var(--vibeui-alert-019-fg);
font-family:var(--vibeui-alert-019-font);
}
[data-vibeui-block="alert-019"] [data-part="head"]{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}
[data-vibeui-block="alert-019"] [data-part="title"]{font-size:0.9375rem;font-weight:600;line-height:1.35}
[data-vibeui-block="alert-019"] [data-part="meta"]{
flex:none;font-size:0.75rem;color:var(--vibeui-alert-019-muted);white-space:nowrap;
}
[data-vibeui-block="alert-019"] [data-part="description"]{
margin:0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-019-muted);max-width:62ch;
}
[data-vibeui-block="alert-019"] ol{
margin:0;padding:0;list-style:none;
display:flex;flex-direction:column;gap:0.4375rem;
counter-reset:vibeui-alert-019;
}
[data-vibeui-block="alert-019"] li{
counter-increment:vibeui-alert-019;
display:flex;align-items:flex-start;gap:0.625rem;
font-size:0.8125rem;line-height:1.5;
}
/* Номер шага — счётчик CSS: список нельзя рассинхронизировать с разметкой. */
[data-vibeui-block="alert-019"] li::before{
content:counter(vibeui-alert-019);
display:flex;align-items:center;justify-content:center;flex:none;
width:1.25rem;height:1.25rem;margin-top:0.0625rem;
border-radius:0.375rem;
background:var(--vibeui-alert-019-panel);
border:1px solid var(--vibeui-alert-019-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-alert-019-accent);
}
[data-vibeui-block="alert-019"] [data-part="action"]{
align-self:flex-start;
display:inline-flex;align-items:center;justify-content:center;
min-height:2rem;padding:0.25rem 0.9375rem;
border-radius:0.5rem;text-decoration:none;
background:var(--vibeui-alert-019-accent);color:var(--vibeui-alert-019-accent-fg);
font-size:0.8125rem;font-weight:600;
transition:filter .16s ease;
}
[data-vibeui-block="alert-019"] [data-part="action"]:hover{filter:brightness(0.94)}
[data-vibeui-block="alert-019"] [data-part="action"]:focus-visible{outline:2px solid var(--vibeui-alert-019-accent);outline-offset:2px}
@container (max-width: 24rem){
[data-vibeui-block="alert-019"] [data-part="meta"]{display:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = [
  "Откройте настройки домена у регистратора",
  "Добавьте A-запись на 216.173.70.241",
  "Вернитесь сюда и нажмите «Проверить запись»",
]

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Алерт с инструкцией: пронумерованные шаги вместо абзаца.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert019({
  title = "Домен подключён не до конца",
  description = "DNS-запись ещё не указывает на наш сервер, поэтому сайт открывается по временному адресу.",
  steps = DEFAULT_STEPS,
  actionLabel = "Проверить запись",
  actionHref = "#",
  meta = "обычно 10–30 минут",
  accent,
  background = "",
  className,
  style,
  ...props
}: Alert019Props) {
  const palette = {
    ...(accent ? { "--vibeui-alert-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alert-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-019" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-019"
        role="status"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="title">{title}</span>
          {meta ? <span data-part="meta">{meta}</span> : null}
        </div>
        {description ? <p data-part="description">{description}</p> : null}
        {steps.length ? (
          <ol>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        ) : null}
        {actionLabel ? (
          <a data-part="action" href={actionHref}>
            {actionLabel}
          </a>
        ) : null}
      </div>
    </>
  )
}
