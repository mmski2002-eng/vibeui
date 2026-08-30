import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Alert003Tone = "info" | "success" | "warning" | "danger"

export type Alert003Props = Omit<ComponentPropsWithoutRef<"p">, "children"> & {
  tone?: Alert003Tone
  message?: string
}

// Идея компонента: однострочное сообщение под полем формы или в шапке
// таблицы. У него нет заголовка и описания — только фраза и точка тона,
// потому что второй уровень текста в таком месте никто не читает. Высота
// строки совпадает с подписью поля, поэтому появление сообщения не сдвигает
// раскладку формы.
const STYLES = `
:where([data-vibeui-block="alert-003"]){
--vibeui-alert-003-fg:oklch(0.38 0.014 265);
--vibeui-alert-003-tone:oklch(0.58 0.18 262);
--vibeui-alert-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="alert-003"]{
display:flex;align-items:flex-start;gap:0.4375rem;
margin:0;font-family:var(--vibeui-alert-003-font);
font-size:0.8125rem;line-height:1.4;color:var(--vibeui-alert-003-fg);
}
[data-vibeui-block="alert-003"][data-tone="success"]{--vibeui-alert-003-tone:oklch(0.58 0.15 152)}
[data-vibeui-block="alert-003"][data-tone="warning"]{--vibeui-alert-003-tone:oklch(0.68 0.15 70)}
[data-vibeui-block="alert-003"][data-tone="danger"]{--vibeui-alert-003-tone:oklch(0.56 0.19 25);color:var(--vibeui-alert-003-tone)}
/* Точка выровнена по первой строке текста, а не по центру блока: при
   переносе на две строки она осталась бы висеть посередине. */
[data-vibeui-block="alert-003"] [data-part="dot"]{
flex:none;width:0.375rem;height:0.375rem;margin-top:0.4375rem;
border-radius:9999px;background:var(--vibeui-alert-003-tone);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-003"] *{animation:none!important;transition:none!important}}
`

/**
 * Однострочное сообщение под полем формы: точка тона и фраза.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert003({
  tone = "danger",
  message = "Адрес занят другим проектом — попробуйте другой.",
  className,
  style,
  ...props
}: Alert003Props) {
  return (
    <>
      <style href="vibeui-alert-003" precedence="medium">
        {STYLES}
      </style>
      <p
        {...props}
        data-vibeui-block="alert-003"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="dot" aria-hidden="true" />
        {message}
      </p>
    </>
  )
}
