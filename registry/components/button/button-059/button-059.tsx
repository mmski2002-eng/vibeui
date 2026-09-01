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
}

// Идея компонента: кнопка отправки, которая сама знает, готова ли форма.
// Правило form:has(:invalid) гасит её без единой строки JS — валидность
// считает браузер по required и type, а не наш обработчик. Подсказка под
// кнопкой держит место всегда, поэтому раскладка не прыгает при смене статуса.
const STYLES = `
:where([data-vibeui-block="button-059"]){
--vibeui-button-059-surface:oklch(1 0 0);
--vibeui-button-059-border:oklch(0.88 0.006 265);
--vibeui-button-059-fg:oklch(0.24 0.02 265);
--vibeui-button-059-muted:oklch(0.57 0.014 265);
--vibeui-button-059-accent:oklch(0.5 0.16 150);
--vibeui-button-059-accent-fg:oklch(0.99 0.01 150);
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
 * Кнопка отправки, заблокированная до валидности формы — средствами :has().
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button059({
  label = "Рабочая почта",
  placeholder = "name@company.com",
  hint = "Введите адрес, чтобы отправить",
  submitLabel = "Отправить заявку",
  accent,
  className,
  style,
  ...props
}: Button059Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-059-accent": accent } : null),
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
