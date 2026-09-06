import type { ComponentProps, CSSProperties } from "react"

export type Alert011Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  /** Техническая подробность: код ошибки, ответ сервера, stack trace. */
  details?: string
  /** Идентификатор обращения в поддержку. */
  reference?: string
  copyLabel?: string
  /** Подпись свёрнутого блока: компонент несёт русскую. */
  detailsLabel?: string
  onCopy?: () => void
  /** Пусто — подложки нет, ошибка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: ошибка, с которой пойдут в поддержку. Человеческое
// объяснение сверху, техническая подробность — под ним в свёрнутом блоке:
// разработчику она нужна целиком, пользователю не нужна вовсе. Свёрнуто на
// нативном details, поэтому раскрытие не требует состояния и работает
// до гидратации.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-011"]){
--vibeui-alert-011-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-alert-011-muted:color-mix(in oklab,var(--vibeui-alert-011-fg) 68%,transparent);
--vibeui-alert-011-bg:transparent;
--vibeui-alert-011-code-bg:light-dark(oklch(0.22 0 265),oklch(0.16 0 265));
--vibeui-alert-011-code-fg:light-dark(oklch(0.93 0 265),oklch(0.87 0 265));
--vibeui-alert-011-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-alert-011-danger:light-dark(oklch(0.56 0.19 25),oklch(0.74 0.16 25));
--vibeui-alert-011-radius:0.75rem;
--vibeui-alert-011-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-alert-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-011"]{color-scheme:dark}
[data-vibeui-block="alert-011"]{
display:flex;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;
padding:0.9375rem 1.0625rem;
border:1px solid var(--vibeui-alert-011-border);
border-radius:var(--vibeui-alert-011-radius);
background:var(--vibeui-alert-011-bg);color:var(--vibeui-alert-011-fg);
font-family:var(--vibeui-alert-011-font);
}
[data-vibeui-block="alert-011"] [data-part="icon"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.375rem;height:1.375rem;margin-top:0.0625rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-alert-011-danger) 14%,transparent);
color:var(--vibeui-alert-011-danger);
font-size:0.75rem;font-weight:800;line-height:1;
}
[data-vibeui-block="alert-011"] [data-part="text"]{display:flex;flex-direction:column;gap:0.25rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-011"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="alert-011"] [data-part="description"]{font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-011-muted);max-width:60ch}
[data-vibeui-block="alert-011"] [data-part="reference"]{
font-size:0.75rem;color:var(--vibeui-alert-011-muted);
font-family:var(--vibeui-alert-011-mono);
}
[data-vibeui-block="alert-011"] summary{
display:inline-flex;align-items:center;gap:0.375rem;
margin-top:0.25rem;cursor:pointer;list-style:none;width:fit-content;
font-size:0.8125rem;font-weight:600;color:var(--vibeui-alert-011-danger);
}
[data-vibeui-block="alert-011"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="alert-011"] summary:focus-visible{outline:2px solid var(--vibeui-alert-011-danger);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="alert-011"] [data-part="chevron"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
transition:transform .18s ease;
}
[data-vibeui-block="alert-011"] details[open] [data-part="chevron"]{transform:rotate(225deg) translate(-0.0625rem,-0.0625rem)}
/* Подробность — тёмный моноширинный блок: её копируют целиком, а не читают. */
[data-vibeui-block="alert-011"] pre{
margin:0.5rem 0 0;padding:0.6875rem 0.8125rem;
border-radius:0.5rem;overflow-x:auto;
background:var(--vibeui-alert-011-code-bg);color:var(--vibeui-alert-011-code-fg);
font-family:var(--vibeui-alert-011-mono);font-size:0.75rem;line-height:1.5;
}
[data-vibeui-block="alert-011"] [data-part="copy"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
margin-top:0.4375rem;color:var(--vibeui-alert-011-muted);
font:inherit;font-size:0.75rem;text-decoration:underline;
}
[data-vibeui-block="alert-011"] [data-part="copy"]:hover{color:var(--vibeui-alert-011-fg)}
[data-vibeui-block="alert-011"] [data-part="copy"]:focus-visible{outline:2px solid var(--vibeui-alert-011-danger);outline-offset:2px;border-radius:0.25rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-011"] *{animation:none!important;transition:none!important}}
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
 * Ошибка с технической подробностью в свёрнутом блоке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert011({
  title = "Не удалось опубликовать проект",
  description = "Сборка остановилась на странице «Услуги». Прошлая версия сайта продолжает работать — посетители ничего не заметили.",
  details = "Error: build failed at page /services\n  at renderPage (build.js:184:11)\n  at async publish (deploy.js:52:5)\ncode: E_BUILD_FAILED\nrequest: 8f2c-41ab-9d70",
  reference = "Обращение 8f2c-41ab",
  copyLabel = "Скопировать подробности",
  detailsLabel = "Подробности",
  onCopy,
  background = "",
  className,
  style,
  ...props
}: Alert011Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-alert-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-011"
        role="alert"
        className={className}
        style={palette}
      >
        <span data-part="icon" aria-hidden="true">
          !
        </span>
        <div data-part="text">
          <span data-part="title">{title}</span>
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
          {reference ? <span data-part="reference">{reference}</span> : null}
          {details ? (
            <details>
              <summary>
                {detailsLabel}
                <span data-part="chevron" aria-hidden="true" />
              </summary>
              <pre>{details}</pre>
              {onCopy ? (
                <button data-part="copy" type="button" onClick={onCopy}>
                  {copyLabel}
                </button>
              ) : null}
            </details>
          ) : null}
        </div>
      </div>
    </>
  )
}
