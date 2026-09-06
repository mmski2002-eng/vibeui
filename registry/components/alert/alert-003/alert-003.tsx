import type { ComponentProps, CSSProperties } from "react"

export type Alert003Tone = "info" | "success" | "warning" | "danger"

export type Alert003Props = Omit<ComponentProps<"p">, "children"> & {
  tone?: Alert003Tone
  message?: string
  /** Название тона словом: точка называет тон только цветом. */
  toneText?: Record<string, string>
}

// Идея компонента: однострочное сообщение под полем формы или в шапке
// таблицы. У него нет заголовка и описания — только фраза и точка тона,
// потому что второй уровень текста в таком месте никто не читает. Высота
// строки совпадает с подписью поля, поэтому появление сообщения не сдвигает
// раскладку формы.
//
// Тема берётся из color-scheme окружения через light-dark(): сообщение
// темнеет вместе с формой и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="alert-003"]){
--vibeui-alert-003-fg:light-dark(oklch(0.38 0 265),oklch(0.78 0 265));
--vibeui-alert-003-tone:light-dark(oklch(0.58 0.18 262),oklch(0.74 0.16 262));
--vibeui-alert-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="alert-003"]{color-scheme:dark}
[data-vibeui-block="alert-003"]{
position:relative;display:flex;align-items:flex-start;gap:0.4375rem;
margin:0;font-family:var(--vibeui-alert-003-font);
font-size:0.8125rem;line-height:1.4;color:var(--vibeui-alert-003-fg);
}
[data-vibeui-block="alert-003"][data-tone="success"]{--vibeui-alert-003-tone:light-dark(oklch(0.58 0.15 152),oklch(0.75 0.14 152))}
[data-vibeui-block="alert-003"][data-tone="warning"]{--vibeui-alert-003-tone:light-dark(oklch(0.68 0.15 70),oklch(0.81 0.14 75))}
[data-vibeui-block="alert-003"][data-tone="danger"]{--vibeui-alert-003-tone:light-dark(oklch(0.56 0.19 25),oklch(0.74 0.16 25));color:var(--vibeui-alert-003-tone)}
/* Точка выровнена по первой строке текста, а не по центру блока: при
   переносе на две строки она осталась бы висеть посередине. */
[data-vibeui-block="alert-003"] [data-part="dot"]{
flex:none;width:0.375rem;height:0.375rem;margin-top:0.4375rem;
border-radius:9999px;background:var(--vibeui-alert-003-tone);
}
/* Тон назван словом: точка отличает предупреждение от ошибки только цветом,
   а цвет читают не все. Слово видно только скринридеру. */
[data-vibeui-block="alert-003"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="alert-003"] *{animation:none!important;transition:none!important}}
`

const TONE_TEXT: Record<string, string> = {
  info: "Информация",
  success: "Готово",
  warning: "Предупреждение",
  danger: "Ошибка",
}

/**
 * Однострочное сообщение под полем формы: точка тона и фраза.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Alert003({
  tone = "danger",
  message = "Адрес занят другим проектом — попробуйте другой.",
  toneText = TONE_TEXT,
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
        data-slot="alert"
        data-vibeui-block="alert-003"
        data-tone={tone}
        role={tone === "danger" ? "alert" : "status"}
        className={className}
        style={style as CSSProperties}
      >
        <span data-part="dot" aria-hidden="true" />
        <span data-part="sr">{toneText[tone] ?? TONE_TEXT[tone]}</span>
        {message}
      </p>
    </>
  )
}
