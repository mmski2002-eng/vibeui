import type { CSSProperties } from "react"

export type Cta013Props = {
  message?: string
  detail?: string
  actionLabel?: string
  actionHref?: string
  /** Пусто — тёплый тинт от акцента поверх фона страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Липкая полоса: тонкий бар с сообщением и кнопкой. Позиционирование
// намеренно статическое — где полосе липнуть (верх, низ, над подвалом),
// решает страница, а не компонент. Прибей его сам: position:sticky и
// top:0 через className, z-index — по вкусу проекта.
const STYLES = `
:where([data-vibeui-block="cta-013"]){
--vibeui-cta-013-bg:transparent;
--vibeui-cta-013-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-013-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-013-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-cta-013-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-cta-013-button:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-cta-013-button-ink:oklch(0.15 0 0);
--vibeui-cta-013-tint:color-mix(in oklab,var(--vibeui-cta-013-accent) 8%,transparent);
--vibeui-cta-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-013"]{color-scheme:dark}
[data-vibeui-block="cta-013"]{
min-width:min(100%,16rem);
display:block;color:var(--vibeui-cta-013-ink);
background:var(--vibeui-cta-013-bg);
font-family:var(--vibeui-cta-013-font);
}
[data-vibeui-block="cta-013"] [data-part="bar"]{
background:var(--vibeui-cta-013-tint);
border-block:1px solid var(--vibeui-cta-013-border);
}
[data-vibeui-block="cta-013"] [data-part="shell"]{
max-width:76rem;margin:0 auto;padding:0.75rem 1.25rem;
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 1rem;
}
[data-vibeui-block="cta-013"] [data-part="copy"]{
flex:1 1 16rem;min-width:0;
display:flex;flex-wrap:wrap;align-items:baseline;gap:0.25rem 0.5rem;
font-size:0.875rem;line-height:1.45;
}
[data-vibeui-block="cta-013"] [data-part="message"]{font-weight:650}
[data-vibeui-block="cta-013"] [data-part="detail"]{color:var(--vibeui-cta-013-muted)}
[data-vibeui-block="cta-013"] [data-part="action"]{
flex:none;display:inline-block;
padding:0.4375rem 1rem;border-radius:999px;
background:var(--vibeui-cta-013-button);color:var(--vibeui-cta-013-button-ink);
font-size:0.8125rem;font-weight:650;text-decoration:none;white-space:nowrap;
transition:filter .15s ease;
}
[data-vibeui-block="cta-013"] [data-part="action"]:hover{filter:brightness(1.05)}
[data-vibeui-block="cta-013"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-cta-013-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-013"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет.
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

/** Тонкая полоса-анонс с одним сообщением и одной кнопкой. */
export function Cta013({
  message = "В каталоге девять новых секций призыва.",
  detail = "Посмотрите, пока они наверху списка.",
  actionLabel = "Смотреть",
  actionHref = "#catalog",
  background = "",
  accent,
  className,
  style,
}: Cta013Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-cta-013-accent": accent,
          "--vibeui-cta-013-button": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-cta-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-013" precedence="medium">
        {STYLES}
      </style>
      <aside data-vibeui-block="cta-013" className={className} style={palette}>
        <div data-part="bar">
          <div data-part="shell">
            <p data-part="copy">
              <strong data-part="message">{message}</strong>
              <span data-part="detail">{detail}</span>
            </p>
            <a data-part="action" href={actionHref}>
              {actionLabel}
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
