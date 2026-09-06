import type { ComponentProps, CSSProperties } from "react"

export type Banner003Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  title?: string
  text?: string
  acceptLabel?: string
  /** Отказ равен согласию по весу: тёмный «Принять» против серой ссылки — тёмный паттерн. */
  rejectLabel?: string
  settingsLabel?: string
  accent?: string
  /** Подложка карточки. Пусто — остаётся собственная. */
  background?: string
}

// Идея компонента: согласие на cookie, где отказ — такая же кнопка, как и
// согласие. Обе одного размера и одного веса, разница только в заливке;
// «Настроить» стоит третьим и не притворяется отказом.
//
// Тема берётся из color-scheme окружения через light-dark(): тёмная ветка не
// инверсия светлой, граница в ней светлее подложки, а не темнее.
const STYLES = `
:where([data-vibeui-block="banner-003"]){
--vibeui-banner-003-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-banner-003-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-banner-003-muted:color-mix(in oklab,var(--vibeui-banner-003-fg) 68%,transparent);
--vibeui-banner-003-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-banner-003-accent:light-dark(oklch(0.28 0 265),oklch(0.9 0 265));
--vibeui-banner-003-on-accent:oklch(from var(--vibeui-banner-003-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-banner-003-outline:color-mix(in oklab,var(--vibeui-banner-003-accent) 65%,var(--vibeui-banner-003-fg) 35%);
--vibeui-banner-003-hover:light-dark(oklch(0.95 0 265),oklch(0.31 0 265));
--vibeui-banner-003-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0 0 0 / 62%));
--vibeui-banner-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-003"]{color-scheme:dark}
[data-vibeui-block="banner-003"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-banner-003-font);color:var(--vibeui-banner-003-fg);
}
[data-vibeui-block="banner-003"] [data-part="shell"]{
display:flex;flex-direction:column;gap:0.875rem;
box-sizing:border-box;padding:0.9375rem 1.25rem;
border:1px solid var(--vibeui-banner-003-border);border-radius:1rem;
background:var(--vibeui-banner-003-bg);
box-shadow:0 22px 48px -30px var(--vibeui-banner-003-shadow);
}
[data-vibeui-block="banner-003"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="banner-003"] [data-part="text"]{margin:0;font-size:0.875rem;line-height:1.5;color:var(--vibeui-banner-003-muted);max-width:38rem}
[data-vibeui-block="banner-003"] [data-part="actions"]{display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center}
/* Согласие и отказ равны по размеру: разный вес кнопок — тёмный паттерн. */
[data-vibeui-block="banner-003"] [data-part="accept"],
[data-vibeui-block="banner-003"] [data-part="reject"]{
appearance:none;cursor:pointer;
min-height:2.125rem;padding:0.25rem 1rem;display:inline-flex;align-items:center;justify-content:center;border-radius:0.625rem;
font:inherit;font-size:0.875rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="banner-003"] [data-part="accept"]{
border:1px solid var(--vibeui-banner-003-outline);
background:var(--vibeui-banner-003-accent);color:var(--vibeui-banner-003-on-accent);
}
[data-vibeui-block="banner-003"] [data-part="reject"]{
border:1px solid var(--vibeui-banner-003-outline);
background:transparent;color:var(--vibeui-banner-003-fg);
}
[data-vibeui-block="banner-003"] [data-part="reject"]:hover{background:var(--vibeui-banner-003-hover)}
[data-vibeui-block="banner-003"] [data-part="settings"]{
appearance:none;cursor:pointer;border:0;background:transparent;
margin-left:auto;padding:0.25rem 0.375rem;border-radius:0.375rem;
font:inherit;font-size:0.875rem;color:var(--vibeui-banner-003-muted);
text-decoration:underline;text-underline-offset:0.2em;
}
[data-vibeui-block="banner-003"] [data-part="settings"]:hover{color:var(--vibeui-banner-003-fg)}
[data-vibeui-block="banner-003"] [data-part="accept"]:focus-visible,
[data-vibeui-block="banner-003"] [data-part="reject"]:focus-visible,
[data-vibeui-block="banner-003"] [data-part="settings"]:focus-visible{outline:2px solid var(--vibeui-banner-003-accent);outline-offset:2px}
@container (max-width: 26rem){
[data-vibeui-block="banner-003"] [data-part="accept"]{flex:1 1 100%}
[data-vibeui-block="banner-003"] [data-part="reject"]{flex:1 1 100%}
[data-vibeui-block="banner-003"] [data-part="settings"]{margin-left:0}
}
@container (min-width: 32rem){
[data-vibeui-block="banner-003"] [data-part="shell"]{padding:1.0625rem 1.25rem}
[data-vibeui-block="banner-003"] [data-part="title"]{font-size:1rem}
[data-vibeui-block="banner-003"] [data-part="text"]{font-size:0.9375rem}
[data-vibeui-block="banner-003"] [data-part="accept"],
[data-vibeui-block="banner-003"] [data-part="reject"],
[data-vibeui-block="banner-003"] [data-part="settings"]{font-size:0.9375rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-003"] *{animation:none!important;transition:none!important}}
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
 * Согласие на cookie, где отказ равен согласию по весу кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner003({
  title = "Cookie и статистика",
  text = "Нужные для работы файлы уже стоят. Остальные — только для статистики посещений; без них сайт работает так же.",
  acceptLabel = "Принять все",
  rejectLabel = "Только необходимые",
  settingsLabel = "Настроить",
  accent,
  background = "",
  className,
  style,
  ...props
}: Banner003Props) {
  const palette = {
    ...(accent ? { "--vibeui-banner-003-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-banner-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-banner-003" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-003"
        aria-label={title}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <p data-part="text">{text}</p>
          <div data-part="actions">
            <button data-part="accept" type="button">
              {acceptLabel}
            </button>
            <button data-part="reject" type="button">
              {rejectLabel}
            </button>
            {settingsLabel ? (
              <button data-part="settings" type="button">
                {settingsLabel}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}
