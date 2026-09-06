import type { ComponentProps, CSSProperties } from "react"

export type Button016Props = Omit<ComponentProps<"a">, "children"> & {
  label?: string
  href?: string
  /** Открывать в новой вкладке: тогда об этом говорится вслух и значком. */
  external?: boolean
  tone?: "neutral" | "accent"
  /** Пояснение для скринридера о переходе в новую вкладку. */
  externalHint?: string
  /** Пусто — подложки нет, кнопка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ссылка, которая выглядит кнопкой, но остаётся ссылкой.
// Её можно открыть в новой вкладке, скопировать адрес и увидеть в статусной
// строке — с <button onClick={router.push}> всё это теряется. У внешней
// ссылки есть значок и сказано словами, что она уходит на другой сайт.
const STYLES = `
:where([data-vibeui-block="button-016"]){
--vibeui-button-016-fg:light-dark(oklch(0.3 0 265),oklch(0.94 0 265));
--vibeui-button-016-bg:transparent;
--vibeui-button-016-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-button-016-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-button-016-accent:light-dark(oklch(0.55 0.17 265),oklch(0.63 0.18 265));
--vibeui-button-016-on-accent:oklch(0.99 0 265);
--vibeui-button-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-016"]{color-scheme:dark}
[data-vibeui-block="button-016"]{
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.25rem;padding:0 0.875rem;box-sizing:border-box;
border:1px solid var(--vibeui-button-016-border);border-radius:0.625rem;
background:var(--vibeui-button-016-bg);color:var(--vibeui-button-016-fg);
font-family:var(--vibeui-button-016-font);font-size:0.8125rem;font-weight:600;line-height:1;
text-decoration:none;
transition:background-color .16s ease;
}
[data-vibeui-block="button-016"][data-tone="accent"]{
border-color:transparent;background:var(--vibeui-button-016-accent);color:var(--vibeui-button-016-on-accent);
}
[data-vibeui-block="button-016"]:hover{background:var(--vibeui-button-016-hover)}
[data-vibeui-block="button-016"][data-tone="accent"]:hover{background:var(--vibeui-button-016-accent);filter:brightness(0.95)}
[data-vibeui-block="button-016"]:focus-visible{outline:2px solid var(--vibeui-button-016-accent);outline-offset:2px}
/* Значок внешней ссылки: рамка и стрелка из бордюров. */
[data-vibeui-block="button-016"] [data-part="out"]{position:relative;flex:none;width:0.75rem;height:0.75rem;opacity:.75}
[data-vibeui-block="button-016"] [data-part="out"]::before{
content:"";position:absolute;left:0;bottom:0;width:0.5625rem;height:0.5625rem;
border:1.5px solid currentColor;border-top-color:transparent;border-right-color:transparent;
border-radius:0.125rem;
}
[data-vibeui-block="button-016"] [data-part="out"]::after{
content:"";position:absolute;right:0;top:0;width:0.4375rem;height:0.4375rem;
border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;
}
/* Пояснение про новую вкладку — только для скринридера: значок его не
   заменяет, а текст рядом с кнопкой был бы шумом. */
[data-vibeui-block="button-016"] [data-part="sr"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-016"] *{animation:none!important;transition:none!important}}
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
 * Ссылка в виде кнопки: адрес копируется, вкладка открывается.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Button016({
  label = "Открыть документацию",
  href = "#",
  external = true,
  tone = "neutral",
  externalHint = "(откроется в новой вкладке)",
  background = "",
  accent,
  className,
  style,
  ...props
}: Button016Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-016" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-016"
        data-tone={tone}
        href={href}
        className={className}
        style={palette}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : null)}
      >
        {label}
        {external ? (
          <>
            <span data-part="out" aria-hidden="true" />
            <span data-part="sr">{externalHint}</span>
          </>
        ) : null}
      </a>
    </>
  )
}
