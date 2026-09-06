import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Frame014Props = Omit<ComponentProps<"figure">, "title"> & {
  sender?: string
  senderEmail?: string
  date?: string
  subject?: string
  /** Строки тела письма по умолчанию: компонент несёт русские. */
  bodyLines?: string[]
  accent?: string
  /** Пусто — подложки нет, кадр ложится на фон страницы. */
  background?: string
  children?: ReactNode
}

// Идея компонента: кадр письма — строка отправителя с аватаром-инициалом,
// тема отдельной строкой крупнее тела и само тело письма. Аватар рисуется
// первой буквой имени через CSS, без внешней картинки: письмо остаётся
// читаемым, даже если реальное изображение отправителя не подгрузилось.
const STYLES = `
:where([data-vibeui-block="frame-014"]){
--vibeui-frame-014-bg:transparent;
--vibeui-frame-014-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-frame-014-muted:color-mix(in oklab,var(--vibeui-frame-014-fg) 68%,transparent);
--vibeui-frame-014-border:light-dark(oklch(0.89 0 265),oklch(0.4 0 265));
--vibeui-frame-014-avatar:light-dark(oklch(0.55 0.14 39.8),oklch(0.7 0.14 39.8));
--vibeui-frame-014-avatar-fg:light-dark(oklch(0.99 0 260),oklch(0.2 0 260));
--vibeui-frame-014-radius:0.875rem;
--vibeui-frame-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="frame-014"]{color-scheme:dark}
[data-vibeui-block="frame-014"]{
display:block;margin:0;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:34rem;box-sizing:border-box;
font-family:var(--vibeui-frame-014-font);color:var(--vibeui-frame-014-fg);
}
[data-vibeui-block="frame-014"] *{box-sizing:border-box}
[data-vibeui-block="frame-014"] [data-part="shell"]{
overflow:hidden;
background:var(--vibeui-frame-014-bg);
border:1px solid var(--vibeui-frame-014-border);
border-radius:var(--vibeui-frame-014-radius);
}
[data-vibeui-block="frame-014"] [data-part="meta"]{
display:flex;align-items:flex-start;gap:0.75rem;
padding:1rem 1.125rem 0.875rem;
border-bottom:1px solid var(--vibeui-frame-014-border);
}
[data-vibeui-block="frame-014"] [data-part="avatar"]{
display:grid;place-items:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:9999px;
background:var(--vibeui-frame-014-avatar);
color:var(--vibeui-frame-014-avatar-fg);
font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="frame-014"] [data-part="who"]{min-width:0;flex:1 1 auto}
[data-vibeui-block="frame-014"] [data-part="name"]{
margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="frame-014"] [data-part="address"]{
margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.75rem;color:var(--vibeui-frame-014-muted);
}
[data-vibeui-block="frame-014"] [data-part="date"]{
flex:none;padding-top:0.125rem;
font-size:0.6875rem;color:var(--vibeui-frame-014-muted);
white-space:nowrap;
}
[data-vibeui-block="frame-014"] [data-part="subject"]{
margin:0;padding:0.875rem 1.125rem 0;
font-size:1rem;font-weight:700;line-height:1.35;
}
[data-vibeui-block="frame-014"] [data-part="body"]{
padding:0.75rem 1.125rem 1.125rem;
font-size:0.8125rem;line-height:1.65;color:var(--vibeui-frame-014-fg);
}
[data-vibeui-block="frame-014"] [data-part="body"] > *{display:block;width:100%}
[data-vibeui-block="frame-014"] [data-part="body"] p{margin:0 0 0.75rem}
[data-vibeui-block="frame-014"] [data-part="body"] p:last-child{margin-bottom:0}
@container (max-width: 22rem){
[data-vibeui-block="frame-014"] [data-part="meta"]{flex-wrap:wrap}
[data-vibeui-block="frame-014"] [data-part="date"]{padding-left:2.9rem}
[data-vibeui-block="frame-014"] [data-part="subject"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="frame-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_BODY_LINES = [
  "Добрый день!",
  "Отправляю макет письма для рассылки — проверьте тему и текст перед отправкой.",
  "Спасибо, команда VibeUI",
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
 * Кадр письма: строка отправителя с аватаром-инициалом, тема и тело.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Frame014({
  sender = "Команда VibeUI",
  senderEmail = "hello@vibeui.ru",
  date = "9:41",
  subject = "Новый макет письма готов к проверке",
  bodyLines = DEFAULT_BODY_LINES,
  accent,
  background = "",
  children,
  className,
  style,
  ...props
}: Frame014Props) {
  const initial = sender.trim().charAt(0).toUpperCase() || "?"
  const palette = {
    ...(accent ? { "--vibeui-frame-014-avatar": accent } : null),
    ...(background
      ? {
          "--vibeui-frame-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-frame-014" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="frame"
        data-vibeui-block="frame-014"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="meta">
            <span data-part="avatar" aria-hidden="true">
              {initial}
            </span>
            <div data-part="who">
              <p data-part="name">{sender}</p>
              <p data-part="address">{senderEmail}</p>
            </div>
            <span data-part="date">{date}</span>
          </div>
          <h2 data-part="subject">{subject}</h2>
          <div data-part="body">
            {children ??
              bodyLines.map((line, index) => <p key={index}>{line}</p>)}
          </div>
        </div>
      </figure>
    </>
  )
}
