"use client"

import { useState, type CSSProperties } from "react"

export type Consent001Props = {
  title?: string
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  settingsLabel?: string
  policyLabel?: string
  policyHref?: string
  /** Пусто — подложки нет, полоса лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Полоса согласия на cookie: текст, ссылка на политику и три действия —
// принять, отклонить, настроить. По любому нажатию полоса скрывается (демо
// без записи выбора). Формат нижнего бара согласия; в превью показан в
// потоке, а не fixed, чтобы не перекрывать страницу каталога.
const STYLES = `
:where([data-vibeui-block="consent-001"]){
--vibeui-consent-001-bg:transparent;
--vibeui-consent-001-panel:light-dark(oklch(1 0 0),oklch(0.2 0 0));
--vibeui-consent-001-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-consent-001-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-consent-001-border:light-dark(oklch(0.88 0 0),oklch(0.32 0 0));
--vibeui-consent-001-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-consent-001-on-accent:oklch(from var(--vibeui-consent-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-consent-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="consent-001"]{color-scheme:dark}
[data-vibeui-block="consent-001"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-consent-001-bg);color:var(--vibeui-consent-001-ink);
font-family:var(--vibeui-consent-001-font);
padding:1.25rem;
}
[data-vibeui-block="consent-001"] [data-part="bar"]{
max-width:64rem;margin:0 auto;
display:grid;gap:1rem;align-items:center;
padding:1.25rem;border:1px solid var(--vibeui-consent-001-border);border-radius:1rem;
background:var(--vibeui-consent-001-panel);
box-shadow:0 12px 32px -20px oklch(0 0 0 / 40%);
}
[data-vibeui-block="consent-001"] [data-part="copy"]{min-width:0}
[data-vibeui-block="consent-001"] [data-part="title"]{margin:0 0 0.25rem;font-size:1rem;font-weight:700}
[data-vibeui-block="consent-001"] [data-part="text"]{margin:0;font-size:0.875rem;line-height:1.5;color:var(--vibeui-consent-001-muted)}
[data-vibeui-block="consent-001"] [data-part="link"]{color:var(--vibeui-consent-001-accent);text-decoration:underline;text-underline-offset:2px}
[data-vibeui-block="consent-001"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="consent-001"] [data-part="btn"]{
height:2.625rem;padding:0 1.125rem;border-radius:0.75rem;cursor:pointer;font:inherit;font-size:0.875rem;font-weight:640;
border:1px solid var(--vibeui-consent-001-border);background:transparent;color:inherit;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="consent-001"] [data-part="btn"]:hover{border-color:var(--vibeui-consent-001-accent)}
[data-vibeui-block="consent-001"] [data-part="btn"]:focus-visible{outline:2px solid var(--vibeui-consent-001-accent);outline-offset:2px}
[data-vibeui-block="consent-001"] [data-part="btn"][data-variant="accept"]{border-color:transparent;background:var(--vibeui-consent-001-accent);color:oklch(from var(--vibeui-consent-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);}
@container (min-width: 48rem){
[data-vibeui-block="consent-001"] [data-part="bar"]{grid-template-columns:1fr auto}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="consent-001"] *{animation:none!important;transition:none!important}}
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

/** Полоса согласия на cookie: текст, ссылка и три действия; нажатие скрывает бар. */
export function Consent001({
  title = "Мы используем cookie",
  message = "Cookie помогают запомнить настройки и понять, как вы пользуетесь каталогом. Вы можете принять всё или настроить категории.",
  acceptLabel = "Принять все",
  rejectLabel = "Только нужные",
  settingsLabel = "Настроить",
  policyLabel = "Политика конфиденциальности",
  policyHref = "#",
  background = "",
  accent,
  className,
  style,
}: Consent001Props) {
  const [dismissed, setDismissed] = useState(false)
  const palette = {
    ...(accent ? { "--vibeui-consent-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-consent-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  if (dismissed) {
    return null
  }

  return (
    <>
      <style href="vibeui-consent-001" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="consent-001"
        className={className}
        style={palette}
        role="region"
        aria-label="Согласие на использование cookie"
      >
        <div data-part="bar">
          <div data-part="copy">
            <p data-part="title">{title}</p>
            <p data-part="text">
              {message}{" "}
              <a href={policyHref} data-part="link">
                {policyLabel}
              </a>
            </p>
          </div>
          <div data-part="actions">
            <button
              data-part="btn"
              type="button"
              onClick={() => setDismissed(true)}
            >
              {settingsLabel}
            </button>
            <button
              data-part="btn"
              type="button"
              onClick={() => setDismissed(true)}
            >
              {rejectLabel}
            </button>
            <button
              data-part="btn"
              data-variant="accept"
              type="button"
              onClick={() => setDismissed(true)}
            >
              {acceptLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
