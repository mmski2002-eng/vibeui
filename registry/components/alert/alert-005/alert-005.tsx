import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Alert005Tone = "info" | "success" | "warning" | "danger"

export type Alert005Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  tone?: Alert005Tone
  title?: string
  description?: string
  /** Строка под текстом: ссылка «Больше не показывать», подпись автора. */
  footnote?: ReactNode
  /** Без обработчика крестик не рисуется: кнопка, которая ничего не делает, обманывает. */
  onDismiss?: () => void
  /** Подпись крестика для скринридера: компонент несёт русскую. */
  closeLabel?: string
  /** Название тона словом: полоса называет тон только цветом. */
  toneText?: Record<string, string>
  /** Пусто — подложки нет, сообщение лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: закрываемое сообщение. Крестик появляется только вместе с
// обработчиком, а под текстом остаётся место для строки вроде «больше не
// показывать» — потому что закрыть один раз и закрыть навсегда это разные
// решения, и второе нельзя прятать в тот же крестик.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-005"]){
--vibeui-alert-005-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-alert-005-muted:color-mix(in oklab,var(--vibeui-alert-005-fg) 68%,transparent);
--vibeui-alert-005-bg:transparent;
--vibeui-alert-005-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-alert-005-tone:light-dark(oklch(0.58 0.18 39.8),oklch(0.74 0.16 39.8));
--vibeui-alert-005-radius:0.75rem;
--vibeui-alert-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-005"]{color-scheme:dark}
[data-vibeui-block="alert-005"]{
position:relative;display:flex;align-items:flex-start;gap:0.75rem;
width:100%;box-sizing:border-box;
padding:0.875rem 2.5rem 0.875rem 1rem;
border:1px solid var(--vibeui-alert-005-border);
border-radius:var(--vibeui-alert-005-radius);
background:var(--vibeui-alert-005-bg);color:var(--vibeui-alert-005-fg);
font-family:var(--vibeui-alert-005-font);
}
[data-vibeui-block="alert-005"][data-tone="success"]{--vibeui-alert-005-tone:light-dark(oklch(0.58 0.15 152),oklch(0.75 0.14 152))}
[data-vibeui-block="alert-005"][data-tone="warning"]{--vibeui-alert-005-tone:light-dark(oklch(0.68 0.15 70),oklch(0.81 0.14 75))}
[data-vibeui-block="alert-005"][data-tone="danger"]{--vibeui-alert-005-tone:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.17 25))}
[data-vibeui-block="alert-005"] [data-part="rail"]{
flex:none;width:0.25rem;align-self:stretch;border-radius:9999px;
background:var(--vibeui-alert-005-tone);
}
/* Тон назван словом: полоса отличает предупреждение от ошибки только цветом,
   а цвет читают не все. Слово видно только скринридеру. */
[data-vibeui-block="alert-005"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
[data-vibeui-block="alert-005"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem;flex:1 1 auto;min-width:0}
[data-vibeui-block="alert-005"] [data-part="title"]{font-size:0.875rem;font-weight:600;line-height:1.4}
[data-vibeui-block="alert-005"] [data-part="description"]{font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-005-muted);max-width:62ch}
[data-vibeui-block="alert-005"] [data-part="footnote"]{
margin-top:0.375rem;font-size:0.75rem;color:var(--vibeui-alert-005-muted);
}
[data-vibeui-block="alert-005"] [data-part="footnote"] a,
[data-vibeui-block="alert-005"] [data-part="footnote"] button{
color:var(--vibeui-alert-005-tone);font:inherit;
background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;
}
/* Крестик прижат к правому верхнему углу, а не стоит в потоке: иначе он
   тянет на себя первую строку текста. */
[data-vibeui-block="alert-005"] [data-part="close"]{
position:absolute;top:0.625rem;right:0.625rem;
appearance:none;border:0;background:transparent;cursor:pointer;
display:flex;align-items:center;justify-content:center;
width:1.5rem;height:1.5rem;border-radius:0.375rem;
color:var(--vibeui-alert-005-muted);font:inherit;font-size:1rem;line-height:1;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="alert-005"] [data-part="close"]:hover{
background:color-mix(in oklab,var(--vibeui-alert-005-border) 45%,transparent);
color:var(--vibeui-alert-005-fg);
}
[data-vibeui-block="alert-005"] [data-part="close"]:focus-visible,
[data-vibeui-block="alert-005"] [data-part="footnote"] a:focus-visible,
[data-vibeui-block="alert-005"] [data-part="footnote"] button:focus-visible{
outline:2px solid var(--vibeui-alert-005-tone);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-005"] *{animation:none!important;transition:none!important}}
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

const TONE_TEXT: Record<string, string> = {
  info: "Информация",
  success: "Готово",
  warning: "Предупреждение",
  danger: "Ошибка",
}

/**
 * Закрываемое сообщение: крестик и строка «больше не показывать».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert005({
  tone = "info",
  title = "Черновик сохраняется автоматически",
  description = "Изменения записываются каждые несколько секунд. Опубликовать их нужно отдельно — кнопкой в шапке проекта.",
  footnote = "Больше не показывать",
  onDismiss,
  closeLabel = "Закрыть сообщение",
  toneText = TONE_TEXT,
  background = "",
  className,
  style,
  ...props
}: Alert005Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-alert-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-005"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={palette}
      >
        <span data-part="rail" aria-hidden="true" />
        <span data-part="text">
          <span data-part="sr">{toneText[tone] ?? TONE_TEXT[tone]}</span>
          {title ? <span data-part="title">{title}</span> : null}
          {description ? (
            <span data-part="description">{description}</span>
          ) : null}
          {footnote ? <span data-part="footnote">{footnote}</span> : null}
        </span>
        {onDismiss ? (
          <button
            data-part="close"
            type="button"
            onClick={onDismiss}
            aria-label={closeLabel}
          >
            ×
          </button>
        ) : null}
      </div>
    </>
  )
}
