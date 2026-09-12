import type { ComponentProps, CSSProperties } from "react"

export type Alert013Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  policyLabel?: string
  policyHref?: string
  acceptLabel?: string
  rejectLabel?: string
  settingsLabel?: string
  onAccept?: () => void
  onReject?: () => void
  onSettings?: () => void
  accent?: string
  /** Пусто — подложки нет, запрос лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: запрос согласия на cookie. Отказ равен согласию по весу —
// это не вежливость, а требование закона: кнопка «Отклонить» не может быть
// серее и мельче «Принять». Настройка вынесена третьей ссылкой, чтобы выбор
// из двух вариантов оставался очевидным.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-013"]){
--vibeui-alert-013-fg:light-dark(oklch(0.22 0 265),oklch(0.95 0 265));
--vibeui-alert-013-muted:color-mix(in oklab,var(--vibeui-alert-013-fg) 68%,transparent);
--vibeui-alert-013-bg:transparent;
--vibeui-alert-013-border:light-dark(oklch(0.89 0 265),oklch(0.34 0 265));
--vibeui-alert-013-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-alert-013-accent-fg:light-dark(oklch(1 0 0),oklch(0.18 0 265));
--vibeui-alert-013-shadow:light-dark(oklch(0.2 0 265 / 45%),oklch(0.05 0 265 / 70%));
--vibeui-alert-013-radius:1rem;
--vibeui-alert-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-013"]{color-scheme:dark}
[data-vibeui-block="alert-013"]{
/* flex-wrap живёт здесь, а не в @container: контейнерный запрос применяется
   к потомкам контейнера, но не к нему самому. На широкой раскладке перенос
   ни на что не влияет — всё умещается в строку. */
display:flex;flex-wrap:wrap;align-items:center;gap:0.875rem 1.25rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:44rem;box-sizing:border-box;
padding:1rem 1.125rem;
border:1px solid var(--vibeui-alert-013-border);
border-radius:var(--vibeui-alert-013-radius);
background:var(--vibeui-alert-013-bg);color:var(--vibeui-alert-013-fg);
font-family:var(--vibeui-alert-013-font);
box-shadow:0 18px 40px -28px var(--vibeui-alert-013-shadow);
}
[data-vibeui-block="alert-013"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-013"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="alert-013"] [data-part="description"]{font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-013-muted);max-width:60ch}
[data-vibeui-block="alert-013"] [data-part="policy"]{color:var(--vibeui-alert-013-accent);text-decoration:underline}
[data-vibeui-block="alert-013"] [data-part="actions"]{display:flex;align-items:center;gap:0.5rem;flex:none}
/* Отказ и согласие одного веса: разный размер кнопок здесь — тёмный приём. */
[data-vibeui-block="alert-013"] [data-part="accept"],
[data-vibeui-block="alert-013"] [data-part="reject"]{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;height:2.125rem;padding:0 1rem;
border-radius:0.5rem;border:1px solid transparent;
font-size:0.8125rem;font-weight:600;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="alert-013"] [data-part="accept"]{
background:var(--vibeui-alert-013-accent);color:oklch(from var(--vibeui-alert-013-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
}
[data-vibeui-block="alert-013"] [data-part="accept"]:hover{filter:brightness(0.94)}
[data-vibeui-block="alert-013"] [data-part="reject"]{
background:transparent;color:var(--vibeui-alert-013-fg);
border-color:var(--vibeui-alert-013-border);
}
[data-vibeui-block="alert-013"] [data-part="reject"]:hover{background:color-mix(in oklab,var(--vibeui-alert-013-border) 40%,transparent)}
[data-vibeui-block="alert-013"] [data-part="settings"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-alert-013-muted);font:inherit;font-size:0.8125rem;text-decoration:underline;
}
[data-vibeui-block="alert-013"] [data-part="settings"]:hover{color:var(--vibeui-alert-013-fg)}
[data-vibeui-block="alert-013"] a:focus-visible,
[data-vibeui-block="alert-013"] button:focus-visible{outline:2px solid var(--vibeui-alert-013-accent);outline-offset:2px;border-radius:0.375rem}
@container (max-width: 34rem){
[data-vibeui-block="alert-013"] [data-part="text"]{flex:1 1 100%}
[data-vibeui-block="alert-013"] [data-part="actions"]{flex:1 1 100%;flex-wrap:wrap}
[data-vibeui-block="alert-013"] [data-part="accept"],
[data-vibeui-block="alert-013"] [data-part="reject"]{flex:1 1 0;justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-013"] *{animation:none!important;transition:none!important}}
`

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
 * Запрос согласия на cookie: отказ равен согласию по весу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert013({
  title = "Cookie и аналитика",
  description = "Обязательные cookie нужны для входа и работы сайта. Аналитические помогают понять, какими разделами пользуются, — их можно отключить.",
  policyLabel = "Политика конфиденциальности",
  policyHref = "#privacy",
  acceptLabel = "Принять всё",
  rejectLabel = "Только обязательные",
  settingsLabel = "Настроить",
  onAccept,
  onReject,
  onSettings,
  accent,
  background = "",
  className,
  style,
  ...props
}: Alert013Props) {
  const palette = {
    ...(accent ? { "--vibeui-alert-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-alert-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-013"
        role="region"
        aria-label={title}
        className={className}
        style={palette}
      >
        <span data-part="text">
          <span data-part="title">{title}</span>
          <span data-part="description">
            {description}{" "}
            {policyLabel ? (
              <a data-part="policy" href={policyHref}>
                {policyLabel}
              </a>
            ) : null}
          </span>
        </span>
        <span data-part="actions">
          <button data-part="reject" type="button" onClick={onReject}>
            {rejectLabel}
          </button>
          <button data-part="accept" type="button" onClick={onAccept}>
            {acceptLabel}
          </button>
          {settingsLabel ? (
            <button data-part="settings" type="button" onClick={onSettings}>
              {settingsLabel}
            </button>
          ) : null}
        </span>
      </div>
    </>
  )
}
