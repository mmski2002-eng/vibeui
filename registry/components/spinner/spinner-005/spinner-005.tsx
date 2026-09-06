import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Spinner005Props = Omit<ComponentProps<"div">, "children"> & {
  busy?: boolean
  label?: string
  /** Заголовок демо-содержимого: показывается, пока слот пуст. */
  sampleTitle?: string
  /** Подписи полей демо-содержимого: показываются, пока слот пуст. */
  sampleFields?: string[]
  /** Пусто — подложки нет, компонент лежит на фоне страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: наложение поверх блока, которое действительно блокирует.
// Полупрозрачная плёнка сама по себе ничего не запрещает: под ней остаются
// кликабельные кнопки и достижимые табом поля. Здесь содержимое помечено
// inert — оно уходит и из фокуса, и из дерева доступности, — а на область
// поставлен aria-busy, чтобы скринридер сообщил о работе, а не молчал.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="spinner-005"]){
--vibeui-spinner-005-surface:transparent;
--vibeui-spinner-005-veil:light-dark(oklch(1 0 0 / 78%),oklch(0.19 0 265 / 78%));
--vibeui-spinner-005-border:light-dark(oklch(0.9 0 265),oklch(0.32 0 265));
--vibeui-spinner-005-fg:light-dark(oklch(0.24 0 265),oklch(0.95 0 265));
--vibeui-spinner-005-muted:color-mix(in oklab,var(--vibeui-spinner-005-fg) 68%,transparent);
--vibeui-spinner-005-soft:light-dark(oklch(0.96 0 265),oklch(0.28 0 265));
--vibeui-spinner-005-track:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-spinner-005-accent:light-dark(oklch(0.55 0.17 262),oklch(0.72 0.16 262));
--vibeui-spinner-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="spinner-005"]{color-scheme:dark}
/* Подложки нет по умолчанию: плашка появляется только пропом background. */
[data-vibeui-block="spinner-005"]{
position:relative;overflow:hidden;
display:block;width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-spinner-005-surface);
border:1px solid var(--vibeui-spinner-005-border);border-radius:1rem;
font-family:var(--vibeui-spinner-005-font);color:var(--vibeui-spinner-005-fg);
}
[data-vibeui-block="spinner-005"] [data-part="content"]{
display:flex;flex-direction:column;gap:0.625rem;padding:0.9375rem 1.0625rem;
}
[data-vibeui-block="spinner-005"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="spinner-005"] [data-part="field"]{
display:flex;flex-direction:column;gap:0.3125rem;
font-size:0.875rem;color:var(--vibeui-spinner-005-muted);
}
[data-vibeui-block="spinner-005"] [data-part="box"]{
height:2.25rem;border-radius:0.5rem;
border:1px solid var(--vibeui-spinner-005-border);
background:var(--vibeui-spinner-005-soft);
}
/* Плёнка не блокирует сама по себе: работу делает inert на содержимом. */
[data-vibeui-block="spinner-005"] [data-part="veil"]{
position:absolute;inset:0;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;
background:var(--vibeui-spinner-005-veil);
backdrop-filter:blur(2px);
}
[data-vibeui-block="spinner-005"] [data-part="ring"]{
width:1.5rem;height:1.5rem;box-sizing:border-box;
border:2px solid var(--vibeui-spinner-005-track);
border-top-color:var(--vibeui-spinner-005-accent);
border-radius:9999px;
animation:vibeui-spinner-005-spin .7s linear infinite;
}
@keyframes vibeui-spinner-005-spin{to{transform:rotate(360deg)}}
@keyframes vibeui-spinner-005-pulse{0%,100%{opacity:.35}50%{opacity:1}}
[data-vibeui-block="spinner-005"] [data-part="veil-label"]{
font-size:0.9375rem;font-weight:650;
}
/* Без движения кольцо не крутится, а дышит: состояние сохраняется. */
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="spinner-005"] [data-part="ring"]{
animation:vibeui-spinner-005-pulse 1.6s ease-in-out infinite;
border-color:var(--vibeui-spinner-005-accent);
}
}
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

const DEFAULT_FIELDS = ["Название", "Домен"]

/**
 * Наложение поверх блока с настоящей блокировкой содержимого через inert.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Spinner005({
  busy = true,
  label = "Сохраняем изменения",
  sampleTitle = "Профиль команды",
  sampleFields = DEFAULT_FIELDS,
  background = "",
  children,
  className,
  style,
  ...props
}: Spinner005Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-spinner-005-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-spinner-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="spinner"
        data-vibeui-block="spinner-005"
        aria-busy={busy}
        className={className}
        style={palette}
      >
        <div data-part="content" inert={busy}>
          {children ?? (
            <>
              <p data-part="title">{sampleTitle}</p>
              {sampleFields.map((field) => (
                <span key={field} data-part="field">
                  {field}
                  <span data-part="box" />
                </span>
              ))}
            </>
          )}
        </div>
        {busy ? (
          <div data-part="veil">
            <span data-part="ring" aria-hidden="true" />
            <span data-part="veil-label" role="status">
              {label}
            </span>
          </div>
        ) : null}
      </div>
    </>
  )
}
