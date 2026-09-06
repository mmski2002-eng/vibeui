import type { ComponentProps, CSSProperties } from "react"

export type Tooltip007Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  /** Требование к вводу: показывается, пока поле в фокусе. */
  hint?: string
  placeholder?: string
  name?: string
  /** Строка под полем: чем открывается подсказка. */
  note?: string
  /** Показать подсказку принудительно: онбординг, отладка, витрина. */
  open?: boolean
  /** Пусто — подложки нет, карточка лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: подсказка у поля ввода, привязанная к фокусу, а не к
// наведению. Требования к паролю или формату нужны ровно в момент набора,
// поэтому :focus-within открывает их, а курсор мыши ничего не показывает.
const STYLES = `
:where([data-vibeui-block="tooltip-007"]){
--vibeui-tooltip-007-bg:transparent;
--vibeui-tooltip-007-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-tooltip-007-muted:color-mix(in oklab,var(--vibeui-tooltip-007-fg) 68%,transparent);
--vibeui-tooltip-007-border:light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
--vibeui-tooltip-007-field:light-dark(oklch(0.99 0 265),oklch(0.26 0 265));
--vibeui-tooltip-007-placeholder:light-dark(oklch(0.68 0 265),oklch(0.6 0 265));
--vibeui-tooltip-007-tip:light-dark(oklch(0.97 0 250),oklch(0.31 0.05 39.8));
--vibeui-tooltip-007-tipfg:light-dark(oklch(0.35 0.07 39.8),oklch(0.88 0.045 39.8));
--vibeui-tooltip-007-accent:light-dark(oklch(0.56 0.17 39.8),oklch(0.71 0.16 39.8));
--vibeui-tooltip-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tooltip-007"]{color-scheme:dark}
[data-vibeui-block="tooltip-007"]{
position:relative;
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;
padding:1rem;
border:1px solid var(--vibeui-tooltip-007-border);border-radius:0.875rem;
background:var(--vibeui-tooltip-007-bg);color:var(--vibeui-tooltip-007-fg);
font-family:var(--vibeui-tooltip-007-font);
}
[data-vibeui-block="tooltip-007"] [data-part="label"]{font-size:0.8125rem;font-weight:620}
[data-vibeui-block="tooltip-007"] [data-part="field"]{position:relative;display:flex}
[data-vibeui-block="tooltip-007"] [data-part="input"]{
width:100%;box-sizing:border-box;
height:2.375rem;padding:0 0.6875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-tooltip-007-border);
background:var(--vibeui-tooltip-007-field);color:inherit;
font:inherit;font-size:0.875rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="tooltip-007"] [data-part="input"]::placeholder{color:var(--vibeui-tooltip-007-placeholder)}
[data-vibeui-block="tooltip-007"] [data-part="input"]:focus{
outline:none;border-color:var(--vibeui-tooltip-007-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-tooltip-007-accent) 22%,transparent);
}
/* Подсказка открывается фокусом, а не курсором: она нужна во время набора. */
[data-vibeui-block="tooltip-007"] [data-part="hint"]{
position:absolute;left:0;right:0;top:calc(100% + 0.4375rem);z-index:20;
box-sizing:border-box;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-tooltip-007-tip);color:var(--vibeui-tooltip-007-tipfg);
font-size:0.75rem;line-height:1.45;
opacity:0;visibility:hidden;translate:0 -0.25rem;
transition:opacity .14s ease,translate .14s ease,visibility .14s;
}
[data-vibeui-block="tooltip-007"] [data-part="hint"]::before{
content:"";position:absolute;left:0.9375rem;top:-0.1875rem;
width:0.5rem;height:0.5rem;background:inherit;transform:rotate(45deg);
}
[data-vibeui-block="tooltip-007"] [data-part="field"]:focus-within [data-part="hint"]{
opacity:1;visibility:visible;translate:0 0;
}
/* Витринный режим: подсказка раскрыта без фокуса — миниатюра каталога и
   скриншот показывают, о чём компонент. Плашка абсолютная, поле не съезжает. */
[data-vibeui-block="tooltip-007"][data-open="true"] [data-part="hint"]{
opacity:1;visibility:visible;translate:0 0;
}
[data-vibeui-block="tooltip-007"] [data-part="foot"]{
margin:0;font-size:0.75rem;line-height:1.45;color:var(--vibeui-tooltip-007-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tooltip-007"] *{animation:none!important;transition:none!important}}
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
 * Подсказка у поля ввода, которая открывается фокусом, а не наведением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tooltip007({
  label = "Новый пароль",
  hint = "От 12 знаков, хотя бы одна цифра и один спецсимвол. Пробелы считаются.",
  placeholder = "••••••••••••",
  name = "password",
  note = "Подсказка появляется, когда поле получает фокус.",
  open = false,
  background = "",
  className,
  style,
  ...props
}: Tooltip007Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-tooltip-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-tooltip-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="tooltip"
        data-vibeui-block="tooltip-007"
        data-open={open || undefined}
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor="vibeui-tooltip-007-input">
          {label}
        </label>
        <span data-part="field">
          <input
            data-part="input"
            id="vibeui-tooltip-007-input"
            name={name}
            type="password"
            /* Новый пароль, а не сохранённый: без этого браузер подставлял в
               соседние поля страницы сохранённую пару логин-пароль. */
            autoComplete="new-password"
            placeholder={placeholder}
            aria-describedby="vibeui-tooltip-007-hint"
          />
          <span data-part="hint" id="vibeui-tooltip-007-hint" role="note">
            {hint}
          </span>
        </span>
        <p data-part="foot">{note}</p>
      </div>
    </>
  )
}
