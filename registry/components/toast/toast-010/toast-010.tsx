import type { ComponentProps, CSSProperties } from "react"

export type Toast010Tone = "neutral" | "success" | "warning"

export type Toast010Props = Omit<ComponentProps<"div">, "children"> & {
  message?: string
  tone?: Toast010Tone
  /** Значок слева. Пустая строка убирает его. */
  glyph?: string
  /** Пусто — подложка берётся из темы окружения. */
  background?: string
}

// Идея компонента: подтверждение размером в строку. Ни заголовка, ни кнопок,
// ни крестика — пилюля появляется, читается за долю секунды и уходит сама.
// Форма и вес отличают её от карточек: это реплика, а не сообщение.
//
// Пилюля тёмная в обеих темах — так её показывают снекбары везде, от
// Material до мобильных ОС; в тёмной теме она лишь чуть светлее страницы.
// Текст и цвет значка не берутся из темы, а выводятся из самой подложки
// относительным цветом: подставленный проектом светлый фон сам получает
// тёмный текст, и подбирать пару вручную не нужно.
const STYLES = `
:where([data-vibeui-block="toast-010"]){
--vibeui-toast-010-bg:light-dark(oklch(0.21 0 265),oklch(0.27 0 265));
/* clamp(0,(0.62 - l) * 100,1) — переключатель «подложка тёмная»: единица на
   тёмной, ноль на светлой. Им же поднимается светлота значка. */
--vibeui-toast-010-fg:oklch(from var(--vibeui-toast-010-bg) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-toast-010-shadow:light-dark(oklch(0.15 0 265 / 70%),oklch(0.05 0 265 / 60%));
--vibeui-toast-010-tone-chroma:0.14;
--vibeui-toast-010-tone-hue:152;
--vibeui-toast-010-tone:oklch(from var(--vibeui-toast-010-bg) calc(0.5 + 0.28 * clamp(0,(0.62 - l) * 100,1)) var(--vibeui-toast-010-tone-chroma) var(--vibeui-toast-010-tone-hue));
--vibeui-toast-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="toast-010"]{color-scheme:dark}
[data-vibeui-block="toast-010"]{
display:inline-flex;align-items:center;gap:0.5rem;
max-width:22rem;box-sizing:border-box;
padding:0.5rem 0.9375rem 0.5rem 0.75rem;
border-radius:9999px;
background:var(--vibeui-toast-010-bg);color:var(--vibeui-toast-010-fg);
font-family:var(--vibeui-toast-010-font);font-size:0.8125rem;line-height:1.4;
box-shadow:0 16px 34px -20px var(--vibeui-toast-010-shadow);
animation:vibeui-toast-010-rise .26s cubic-bezier(.2,.8,.3,1) both;
}
[data-vibeui-block="toast-010"][data-tone="warning"]{--vibeui-toast-010-tone-chroma:0.15;--vibeui-toast-010-tone-hue:85}
[data-vibeui-block="toast-010"][data-tone="neutral"]{--vibeui-toast-010-tone-chroma:0;--vibeui-toast-010-tone-hue:265}
[data-vibeui-block="toast-010"] [data-part="glyph"]{
flex:none;display:flex;align-items:center;justify-content:center;
width:1.25rem;height:1.25rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-toast-010-tone) 24%,transparent);
color:var(--vibeui-toast-010-tone);
font-size:0.6875rem;font-weight:800;line-height:1;
}
[data-vibeui-block="toast-010"] [data-part="message"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:520;
}
@keyframes vibeui-toast-010-rise{
from{opacity:0;transform:translateY(0.625rem) scale(.96)}
to{opacity:1;transform:translateY(0) scale(1)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-010"] *{animation:none!important;transition:none!important}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="toast-010"]{animation:none!important}}
`

/**
 * Компактная пилюля-подтверждение: одна строка, без кнопок и заголовка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Toast010({
  message = "Ссылка скопирована",
  tone = "success",
  glyph = "✓",
  background = "",
  className,
  style,
  ...props
}: Toast010Props) {
  const palette = {
    ...(background ? { "--vibeui-toast-010-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-toast-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="toast"
        data-vibeui-block="toast-010"
        data-tone={tone}
        role="status"
        aria-live="polite"
        className={className}
        style={palette}
      >
        {glyph ? (
          <span data-part="glyph" aria-hidden="true">
            {glyph}
          </span>
        ) : null}
        <span data-part="message">{message}</span>
      </div>
    </>
  )
}
