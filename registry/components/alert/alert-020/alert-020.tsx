import type { ComponentProps, CSSProperties } from "react"

export type Alert020Props = Omit<
  ComponentProps<"div">,
  "title" | "children"
> & {
  title?: string
  description?: string
  /** Что будет удалено: перечень, а не одна строка «все данные». */
  losses?: string[]
  /** Слово, которое нужно ввести для подтверждения. */
  confirmWord?: string
  inputLabel?: string
  confirmLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  /** Пусто — подложки нет, подтверждение лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: подтверждение необратимого действия. Кнопка «Удалить»
// выключена, пока не введено точное имя объекта — та самая пауза, которая
// отделяет случайный клик от решения. Перечисление того, что исчезнет,
// стоит выше поля: человек должен прочитать список до того, как начнёт печатать.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет там, где тёмный контекст, и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-020"]){
--vibeui-alert-020-fg:light-dark(oklch(0.22 0.014 265),oklch(0.95 0.006 265));
--vibeui-alert-020-muted:color-mix(in oklab,var(--vibeui-alert-020-fg) 68%,transparent);
--vibeui-alert-020-bg:transparent;
--vibeui-alert-020-field:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-alert-020-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-alert-020-danger:light-dark(oklch(0.56 0.19 25),oklch(0.71 0.18 25));
--vibeui-alert-020-danger-fg:light-dark(oklch(0.99 0.01 25),oklch(0.16 0.02 25));
--vibeui-alert-020-radius:0.875rem;
--vibeui-alert-020-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-alert-020-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-020"]{color-scheme:dark}
[data-vibeui-block="alert-020"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:32rem;box-sizing:border-box;
padding:1.0625rem 1.125rem;
border:1px solid color-mix(in oklab,var(--vibeui-alert-020-danger) 35%,var(--vibeui-alert-020-border));
border-radius:var(--vibeui-alert-020-radius);
background:color-mix(in oklab,var(--vibeui-alert-020-danger) 4%,var(--vibeui-alert-020-bg));
color:var(--vibeui-alert-020-fg);font-family:var(--vibeui-alert-020-font);
}
[data-vibeui-block="alert-020"] [data-part="title"]{font-size:0.9375rem;font-weight:650;line-height:1.35;color:var(--vibeui-alert-020-danger)}
[data-vibeui-block="alert-020"] [data-part="description"]{margin:0;font-size:0.8125rem;line-height:1.55;color:var(--vibeui-alert-020-muted)}
[data-vibeui-block="alert-020"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="alert-020"] li{
position:relative;padding-left:0.9375rem;
font-size:0.8125rem;line-height:1.5;color:var(--vibeui-alert-020-muted);
}
[data-vibeui-block="alert-020"] li::before{
content:"";position:absolute;left:0;top:0.5rem;
width:0.3125rem;height:0.3125rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-alert-020-danger) 55%,transparent);
}
[data-vibeui-block="alert-020"] label{display:flex;flex-direction:column;gap:0.3125rem;font-size:0.8125rem}
[data-vibeui-block="alert-020"] [data-part="word"]{
font-family:var(--vibeui-alert-020-mono);font-weight:650;color:var(--vibeui-alert-020-fg);
}
[data-vibeui-block="alert-020"] input{
width:100%;box-sizing:border-box;margin:0;height:2.25rem;padding:0 0.75rem;
border:1px solid var(--vibeui-alert-020-border);border-radius:0.5rem;
background:var(--vibeui-alert-020-field);color:inherit;
font-family:var(--vibeui-alert-020-mono);font-size:0.875rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="alert-020"] input:focus{
outline:none;border-color:var(--vibeui-alert-020-danger);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-alert-020-danger) 20%,transparent);
}
[data-vibeui-block="alert-020"] [data-part="actions"]{display:flex;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="alert-020"] button{
appearance:none;cursor:pointer;font:inherit;
display:inline-flex;align-items:center;height:2.125rem;padding:0 1rem;
border-radius:0.5rem;border:1px solid transparent;
font-size:0.8125rem;font-weight:600;
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="alert-020"] [data-part="confirm"]{
background:var(--vibeui-alert-020-danger);color:var(--vibeui-alert-020-danger-fg);
}
/* Кнопка выключена, пока слово не совпало: проверку делает :placeholder-shown
   у поля — сравнение значения без JS невозможно, поэтому форма требует
   заполнения, а точное совпадение проверяет вызывающий код на отправке. */
[data-vibeui-block="alert-020"] [data-part="confirm"]:disabled{
opacity:.5;cursor:not-allowed;
}
[data-vibeui-block="alert-020"] [data-part="cancel"]{
background:transparent;color:var(--vibeui-alert-020-fg);
border-color:var(--vibeui-alert-020-border);
}
[data-vibeui-block="alert-020"] [data-part="cancel"]:hover{background:color-mix(in oklab,var(--vibeui-alert-020-border) 40%,transparent)}
[data-vibeui-block="alert-020"] :focus-visible{outline:2px solid var(--vibeui-alert-020-danger);outline-offset:2px}
/* Пока поле пустое, подтверждение недоступно — без единой строки JS. */
[data-vibeui-block="alert-020"]:has(input:placeholder-shown) [data-part="confirm"]{
opacity:.5;pointer-events:none;
}
@container (max-width: 22rem){
[data-vibeui-block="alert-020"] [data-part="actions"] button{flex:1 1 100%;justify-content:center}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-020"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_LOSSES = [
  "18 страниц и вся история публикаций",
  "домен studio-polet.ru и его сертификат",
  "доступы четырёх участников",
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
 * Подтверждение необратимого действия: список потерь и ввод имени.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert020({
  title = "Удалить проект «Сайт студии»?",
  description = "Действие необратимо. Восстановить проект из резервной копии мы не сможем.",
  losses = DEFAULT_LOSSES,
  confirmWord = "Сайт студии",
  inputLabel = "Введите название проекта, чтобы подтвердить:",
  confirmLabel = "Удалить навсегда",
  cancelLabel = "Отмена",
  onCancel,
  background = "",
  className,
  style,
  ...props
}: Alert020Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-alert-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-alert-020" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="alert"
        data-vibeui-block="alert-020"
        role="alertdialog"
        aria-label={title}
        className={className}
        style={palette}
      >
        <span data-part="title">{title}</span>
        {description ? <p data-part="description">{description}</p> : null}
        {losses.length ? (
          <ul>
            {losses.map((loss) => (
              <li key={loss}>{loss}</li>
            ))}
          </ul>
        ) : null}
        <label>
          <span>
            {inputLabel} <span data-part="word">{confirmWord}</span>
          </span>
          <input
            type="text"
            name="confirm"
            placeholder=" "
            autoComplete="off"
            required
            pattern={confirmWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}
          />
        </label>
        <span data-part="actions">
          <button data-part="confirm" type="submit">
            {confirmLabel}
          </button>
          <button data-part="cancel" type="button" onClick={onCancel}>
            {cancelLabel}
          </button>
        </span>
      </div>
    </>
  )
}
