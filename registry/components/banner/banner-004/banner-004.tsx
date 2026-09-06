import type { ComponentProps, CSSProperties } from "react"

export type Banner004Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  note?: string
  /** Окружение: попадает в текст и в подпись для скринридера. */
  environment?: string
  /** Шаблон доступного имени: «{label}: {environment}». */
  labelTemplate?: string
  /** Цвет косых полос ленты. */
  stripe?: string
  /** Подложка полосы. Пусто — остаётся собственная. */
  background?: string
}

// Идея компонента: полоса тестового режима. Косая штриховка и моноширинный
// шрифт делают её непохожей на продуктовый интерфейс — именно этого мы и
// добиваемся: она должна кричать «это не боевые данные» с любого скриншота.
//
// Тема берётся из color-scheme окружения через light-dark(): тёмная ветка не
// инверсия светлой, жёлтый в ней приглушён, а граница светлее подложки.
const STYLES = `
:where([data-vibeui-block="banner-004"]){
--vibeui-banner-004-bg:light-dark(oklch(0.97 0.05 39.8),oklch(0.29 0.045 39.8));
--vibeui-banner-004-fg:light-dark(oklch(0.32 0.07 39.8),oklch(0.93 0.04 39.8));
--vibeui-banner-004-muted:color-mix(in oklab,var(--vibeui-banner-004-fg) 68%,transparent);
--vibeui-banner-004-stripe:light-dark(oklch(0.86 0.11 39.8),oklch(0.63 0.1 39.8));
--vibeui-banner-004-border:light-dark(oklch(0.82 0.11 39.8),oklch(0.46 0.08 39.8));
--vibeui-banner-004-chip:light-dark(oklch(1 0 0 / 55%),oklch(1 0 0 / 8%));
--vibeui-banner-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-banner-004-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="banner-004"]{color-scheme:dark}
[data-vibeui-block="banner-004"]{
width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);box-sizing:border-box;
font-family:var(--vibeui-banner-004-font);color:var(--vibeui-banner-004-fg);
}
[data-vibeui-block="banner-004"] [data-part="shell"]{
display:flex;align-items:center;gap:0.75rem;
box-sizing:border-box;
padding:0.9375rem 0.9375rem;
border:1px solid var(--vibeui-banner-004-border);
border-radius:0.75rem;
background:var(--vibeui-banner-004-bg);
}
/* Косая штриховка сверху: полосу невозможно спутать с боевым интерфейсом. */
[data-vibeui-block="banner-004"] [data-part="tape"]{
flex:none;width:2.75rem;height:1.125rem;border-radius:0.25rem;
background:repeating-linear-gradient(
-45deg,
var(--vibeui-banner-004-stripe) 0 0.375rem,
transparent 0.375rem 0.75rem
);
}
[data-vibeui-block="banner-004"] [data-part="label"]{
font-family:var(--vibeui-banner-004-mono);
font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
white-space:nowrap;
}
[data-vibeui-block="banner-004"] [data-part="note"]{
margin:0;min-width:0;font-size:0.9375rem;line-height:1.45;color:var(--vibeui-banner-004-muted);
}
[data-vibeui-block="banner-004"] [data-part="env"]{
margin-left:auto;flex:none;
padding:0.125rem 0.5rem;border-radius:0.375rem;
border:1px dashed var(--vibeui-banner-004-border);
background:var(--vibeui-banner-004-chip);
font-family:var(--vibeui-banner-004-mono);font-size:0.6875rem;font-weight:650;
}
@container (max-width: 30rem){
[data-vibeui-block="banner-004"] [data-part="tape"]{display:none}
[data-vibeui-block="banner-004"] [data-part="env"]{display:none}
}
@container (min-width: 32rem){
[data-vibeui-block="banner-004"] [data-part="shell"]{padding:1.0625rem 0.9375rem}
[data-vibeui-block="banner-004"] [data-part="note"]{font-size:1rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="banner-004"] *{animation:none!important;transition:none!important}}
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
 * Полоса тестового режима: штриховка, моноширинная метка и имя окружения.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Banner004({
  label = "Тестовый режим",
  note = "Платежи не проходят, письма никому не уходят. Данные обнуляются каждую ночь.",
  environment = "staging",
  labelTemplate = "{label}: {environment}",
  stripe,
  background = "",
  className,
  style,
  ...props
}: Banner004Props) {
  const palette = {
    ...(stripe ? { "--vibeui-banner-004-stripe": stripe } : null),
    ...(background
      ? {
          "--vibeui-banner-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const accessibleName = labelTemplate
    .replace("{label}", label)
    .replace("{environment}", environment)

  return (
    <>
      <style href="vibeui-banner-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="banner"
        data-vibeui-block="banner-004"
        role="region"
        aria-label={accessibleName}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <span data-part="tape" aria-hidden="true" />
          <span data-part="label">{label}</span>
          <p data-part="note">{note}</p>
          {environment ? <span data-part="env">{environment}</span> : null}
        </div>
      </div>
    </>
  )
}
