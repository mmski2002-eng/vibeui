import type { ComponentProps, CSSProperties } from "react"

export type Button052Props = Omit<ComponentProps<"a">, "href"> & {
  /** Номер в человекочитаемом виде: он же попадает в tel: после чистки. */
  phone?: string
  /** Строка доступности под номером: часы работы или статус линии. */
  hint?: string
  accent?: string
}

// Идея компонента: кнопка связи — это ссылка tel:, а не обработчик клика.
// Тогда на телефоне вызов уходит в звонилку, на десктопе — в приложение
// пользователя, а номер можно скопировать из контекстного меню. Из видимой
// записи номера пробелы и скобки вычищаются только в href.
const STYLES = `
:where([data-vibeui-block="button-052"]){
--vibeui-button-052-accent:light-dark(oklch(0.55 0.15 150),oklch(0.64 0.14 150));
--vibeui-button-052-fg:light-dark(oklch(0.99 0.01 150),oklch(0.98 0.012 150));
--vibeui-button-052-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-button-052-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-052"]{color-scheme:dark}
[data-vibeui-block="button-052"]{
display:inline-flex;align-items:center;gap:0.75rem;box-sizing:border-box;
padding:0.625rem 1.125rem 0.625rem 0.875rem;border-radius:9999px;
background:var(--vibeui-button-052-accent);color:var(--vibeui-button-052-fg);
font-family:var(--vibeui-button-052-font);text-decoration:none;
transition:filter .16s ease;
}
[data-vibeui-block="button-052"]:hover{filter:brightness(1.07)}
[data-vibeui-block="button-052"]:focus-visible{outline:2px solid var(--vibeui-button-052-accent);outline-offset:3px}
/* Трубка: скруглённый прямоугольник, повёрнутый и обрезанный по углам. */
[data-vibeui-block="button-052"] [data-part="dial"]{
position:relative;flex:none;
display:flex;align-items:center;justify-content:center;
width:2rem;height:2rem;border-radius:50%;background:oklch(1 0 0 / 20%);
}
[data-vibeui-block="button-052"] [data-part="dial"]::before{
content:"";width:0.875rem;height:0.875rem;
border:2px solid currentColor;border-radius:0.4375rem 0.25rem 0.4375rem 0.25rem;
border-top-color:transparent;border-right-color:transparent;
transform:rotate(8deg);
}
/* Кольцо доступности пульсирует: линия открыта прямо сейчас. */
[data-vibeui-block="button-052"] [data-part="dial"]::after{
content:"";position:absolute;inset:-2px;border-radius:50%;
border:2px solid oklch(1 0 0 / 55%);
animation:vibeui-button-052-ring 2.4s ease-out infinite;
}
@keyframes vibeui-button-052-ring{
0%{opacity:.7;transform:scale(1)}
70%{opacity:0;transform:scale(1.35)}
100%{opacity:0;transform:scale(1.35)}
}
[data-vibeui-block="button-052"] [data-part="text"]{display:flex;flex-direction:column;gap:0.1875rem}
[data-vibeui-block="button-052"] [data-part="label"]{font-size:0.75rem;font-weight:600;opacity:.85;letter-spacing:0.02em}
[data-vibeui-block="button-052"] [data-part="phone"]{
font-family:var(--vibeui-button-052-mono);font-size:0.9375rem;font-weight:600;
font-variant-numeric:tabular-nums;letter-spacing:0.01em;
}
[data-vibeui-block="button-052"] [data-part="hint"]{font-size:0.6875rem;opacity:.75}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-052"] *{animation:none!important;transition:none!important}}
`

/**
 * Кнопка звонка на настоящей ссылке tel: с номером и статусом линии.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button052({
  phone = "+7 495 120-45-90",
  hint = "Отвечаем с 9:00 до 21:00",
  accent,
  className,
  style,
  children = "Позвонить в поддержку",
  ...props
}: Button052Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-052-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-052" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
        data-slot="button"
        data-vibeui-block="button-052"
        className={className}
        style={palette}
      >
        <span data-part="dial" aria-hidden="true" />
        <span data-part="text">
          <span data-part="label">{children}</span>
          <span data-part="phone">{phone}</span>
          {hint ? <span data-part="hint">{hint}</span> : null}
        </span>
      </a>
    </>
  )
}
