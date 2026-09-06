import type { ComponentProps, CSSProperties } from "react"

export type Radio019Option = {
  value: string
  label: string
  hint?: string
}

export type Radio019Props = Omit<
  ComponentProps<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  options?: Radio019Option[]
  name?: string
  value?: string
  /** Почему группу нельзя переключить: без этой строки блокировка — грубость. */
  reason?: string
  actionText?: string
  actionHref?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: радиогруппа, заблокированная целиком, а не строка за
// строкой. disabled на fieldset выключает все вложенные радиокнопки одним
// атрибутом; ссылка на снятие ограничения не подчиняется этому disabled и
// остаётся живой — иначе выход из тупика тоже стал бы недоступен. Состояния
// нет вовсе: выбранный вариант зашит пропом value, компонент серверный.
const STYLES = `
:where([data-vibeui-block="radio-019"]){
--vibeui-radio-019-bg:transparent;
--vibeui-radio-019-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-radio-019-muted:color-mix(in oklab,var(--vibeui-radio-019-fg) 68%,transparent);
--vibeui-radio-019-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-radio-019-accent:light-dark(oklch(0.55 0.19 262),oklch(0.75 0.16 262));
--vibeui-radio-019-lock:light-dark(oklch(0.66 0.13 75),oklch(0.79 0.13 75));
--vibeui-radio-019-lock-tint:light-dark(oklch(0.66 0.13 75 / 12%),oklch(0.79 0.13 75 / 16%));
--vibeui-radio-019-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="radio-019"]{color-scheme:dark}
[data-vibeui-block="radio-019"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;
margin:0;padding:0.875rem;
background:var(--vibeui-radio-019-bg);
border:1px solid var(--vibeui-radio-019-border);border-radius:0.875rem;
font-family:var(--vibeui-radio-019-font);color:var(--vibeui-radio-019-fg);
}
/* float у легенды: иначе она садится на рамку fieldset и обрезается. */
[data-vibeui-block="radio-019"] legend{
float:left;display:flex;align-items:center;gap:0.375rem;
width:100%;padding:0;margin-bottom:0.625rem;
font-size:0.875rem;font-weight:650;color:var(--vibeui-radio-019-muted);
}
/* Замок нарисован дужкой на псевдоэлементе поверх корпуса: значок
   блокировки без иконочного пакета. */
[data-vibeui-block="radio-019"] [data-part="lock"]{
position:relative;flex:none;width:0.75rem;height:0.625rem;margin-top:0.0625rem;
border-radius:0.125rem;background:var(--vibeui-radio-019-lock);
}
[data-vibeui-block="radio-019"] [data-part="lock"]::before{
content:"";position:absolute;left:50%;bottom:0.5rem;
width:0.5rem;height:0.4375rem;margin-left:-0.25rem;
border:1.5px solid var(--vibeui-radio-019-lock);border-bottom:0;
border-radius:0.25rem 0.25rem 0 0;
}
[data-vibeui-block="radio-019"] [data-part="options"]{clear:both;display:flex;flex-direction:column;gap:0.375rem;cursor:not-allowed}
[data-vibeui-block="radio-019"] label{
display:flex;align-items:flex-start;gap:0.625rem;min-height:2rem;font-size:0.875rem;
}
[data-vibeui-block="radio-019"] input{
appearance:none;-webkit-appearance:none;flex:none;margin:0.125rem 0 0;
width:1.125rem;height:1.125rem;border-radius:9999px;cursor:not-allowed;
border:1.5px solid var(--vibeui-radio-019-border);background:transparent;opacity:.7;
}
[data-vibeui-block="radio-019"] input:checked{
border-color:var(--vibeui-radio-019-accent);
background:radial-gradient(circle at 50% 50%,var(--vibeui-radio-019-accent) 0 0.25rem,transparent 0.25rem);
}
[data-vibeui-block="radio-019"] [data-part="text"]{display:flex;flex-direction:column;gap:0.0625rem;color:var(--vibeui-radio-019-muted)}
[data-vibeui-block="radio-019"] [data-part="hint"]{font-size:0.75rem;line-height:1.4}
[data-vibeui-block="radio-019"] [data-part="reason"]{
display:flex;gap:0.5rem;margin:0;padding:0.5rem 0.625rem;
border-radius:0.5rem;background:var(--vibeui-radio-019-lock-tint);
font-size:0.75rem;line-height:1.45;color:var(--vibeui-radio-019-muted);
}
/* Ссылка остаётся живой и получает свой фокус: она — единственный выход
   из заблокированного состояния, disabled на fieldset её не касается. */
[data-vibeui-block="radio-019"] a{
color:var(--vibeui-radio-019-accent);font-weight:600;
text-decoration:underline;text-underline-offset:2px;border-radius:0.25rem;
}
[data-vibeui-block="radio-019"] a:focus-visible{outline:2px solid var(--vibeui-radio-019-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="radio-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Radio019Option[] = [
  {
    value: "viewer",
    label: "Читатель",
    hint: "Смотрит проект без права правок",
  },
  { value: "editor", label: "Редактор", hint: "Правит содержимое и задачи" },
  {
    value: "admin",
    label: "Администратор",
    hint: "Управляет участниками и настройками",
  },
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
 * Заблокированная радиогруппа: disabled на fieldset выключает все варианты
 * сразу, причина и живая ссылка на выход стоят рядом. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Radio019({
  legend = "Роль в проекте",
  options = DEFAULT_OPTIONS,
  name = "vibeui-radio-019",
  value = "editor",
  reason = "Роль назначает владелец рабочего пространства — самостоятельно её не сменить.",
  actionText = "Написать владельцу",
  actionHref = "#owner",
  background = "",
  accent,
  className,
  style,
  ...props
}: Radio019Props) {
  const palette = {
    ...(accent ? { "--vibeui-radio-019-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-radio-019-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-radio-019" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        disabled
        data-slot="radio-group"
        data-vibeui-block="radio-019"
        className={className}
        style={palette}
      >
        <legend>
          <span data-part="lock" aria-hidden="true" />
          {legend}
        </legend>
        <form data-part="options">
          {options.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name={name}
                value={option.value}
                defaultChecked={option.value === value}
                disabled
              />
              <span data-part="text">
                <span>{option.label}</span>
                {option.hint ? (
                  <span data-part="hint">{option.hint}</span>
                ) : null}
              </span>
            </label>
          ))}
        </form>
        <p data-part="reason">
          <span>
            {reason} <a href={actionHref}>{actionText}</a>
          </span>
        </p>
      </fieldset>
    </>
  )
}
