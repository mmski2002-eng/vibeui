import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Button059Props = Omit<
  ComponentPropsWithoutRef<"form">,
  "children"
> & {
  label?: string
  placeholder?: string
  /** Подсказка под кнопкой, пока форма не готова к отправке. */
  hint?: string
  submitLabel?: string
  accent?: string
  /** Поверхность карточки. Пусто — своя, из палитры. */
  background?: string
}

// Идея компонента: кнопка отправки, которая сама знает, готова ли форма.
// Правило form:has(:invalid) гасит её без единой строки JS — валидность
// считает браузер по required и type, а не наш обработчик. Подсказка под
// кнопкой держит место всегда, поэтому раскладка не прыгает при смене статуса.
const STYLES = `
:where([data-vibeui-block="button-059"]){
--vibeui-button-059-surface:light-dark(oklch(1 0 0),oklch(0.24 0.014 265));
--vibeui-button-059-border:light-dark(oklch(0.88 0.006 265),oklch(0.42 0.014 265));
--vibeui-button-059-fg:light-dark(oklch(0.24 0.02 265),oklch(0.94 0.008 265));
--vibeui-button-059-muted:light-dark(oklch(0.57 0.014 265),oklch(0.68 0.012 265));
--vibeui-button-059-accent:light-dark(oklch(0.5 0.16 150),oklch(0.62 0.15 150));
--vibeui-button-059-accent-fg:light-dark(oklch(0.99 0.01 150),oklch(0.17 0.03 150));
--vibeui-button-059-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="button-059"]{
display:flex;flex-direction:column;gap:0.5rem;box-sizing:border-box;
width:100%;max-width:21rem;padding:0.875rem;
border:1px solid var(--vibeui-button-059-border);border-radius:0.875rem;
background:var(--vibeui-button-059-surface);color:var(--vibeui-button-059-fg);
font-family:var(--vibeui-button-059-font);
}
[data-vibeui-block="button-059"] label{font-size:0.75rem;font-weight:600;color:var(--vibeui-button-059-muted)}
[data-vibeui-block="button-059"] input{
appearance:none;box-sizing:border-box;width:100%;
height:2.5rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-button-059-border);
background:var(--vibeui-button-059-surface);color:inherit;
font:inherit;font-size:0.875rem;
transition:border-color .16s ease;
}
[data-vibeui-block="button-059"] input:focus-visible{
outline:2px solid var(--vibeui-button-059-accent);outline-offset:1px;
border-color:var(--vibeui-button-059-accent);
}
[data-vibeui-block="button-059"] [data-part="submit"]{
appearance:none;border:0;cursor:pointer;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
width:100%;height:2.625rem;border-radius:0.625rem;
background:var(--vibeui-button-059-accent);color:var(--vibeui-button-059-accent-fg);
font:inherit;font-size:0.875rem;font-weight:650;line-height:1;
transition:background-color .16s ease,opacity .16s ease;
}
/* Кнопка гаснет, пока в форме есть невалидное поле. Без JS. */
[data-vibeui-block="button-059"]:has(:invalid) [data-part="submit"]{
cursor:not-allowed;opacity:.45;
background:var(--vibeui-button-059-muted);
}
[data-vibeui-block="button-059"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-button-059-accent);outline-offset:2px}
[data-vibeui-block="button-059"] [data-part="hint"]{
min-height:1rem;font-size:0.75rem;color:var(--vibeui-button-059-muted);text-align:center;
visibility:hidden;
}
[data-vibeui-block="button-059"]:has(:invalid) [data-part="hint"]{visibility:visible}
[data-vibeui-block="button-059"] [data-part="lock"]{
flex:none;width:0.75rem;height:0.75rem;border-radius:2px;
background:currentColor;opacity:.8;
clip-path:polygon(0 40%,100% 40%,100% 100%,0 100%);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-059"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной поверхности. Без неё светлая заливка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Кнопка отправки, заблокированная до валидности формы — средствами :has().
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button059({
  label = "Рабочая почта",
  placeholder = "name@company.com",
  hint = "Введите адрес, чтобы отправить",
  submitLabel = "Отправить заявку",
  accent,
  background = "",
  className,
  style,
  ...props
}: Button059Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-059-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-059-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-059" precedence="medium">
        {STYLES}
      </style>
      <form
        {...props}
        data-vibeui-block="button-059"
        className={className}
        style={palette}
      >
        <label htmlFor="vibeui-button-059-email">{label}</label>
        <input
          id="vibeui-button-059-email"
          name="email"
          type="email"
          required
          placeholder={placeholder}
        />
        <button type="submit" data-part="submit">
          <span data-part="lock" aria-hidden="true" />
          {submitLabel}
        </button>
        <p data-part="hint">{hint}</p>
      </form>
    </>
  )
}
