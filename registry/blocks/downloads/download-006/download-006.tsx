import type { CSSProperties, ReactNode } from "react"

type Download006Alternative = {
  name: string
  note?: string
  href?: string
}

export type Download006Props = {
  eyebrow?: string
  title?: string
  lead?: string
  /** Платформа, предложенная по умолчанию: она в главной кнопке. */
  platform?: string
  buildNote?: string
  primaryLabel?: string
  primaryHref?: string
  /** Остальные сборки: их показывают строкой ниже. */
  alternatives?: Download006Alternative[]
  checksumLabel?: string
  checksum?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Одна крупная кнопка под нужную платформу и мелкие ссылки на остальные.
// От сеток со сборками отличается тем, что не заставляет выбирать: девять
// из десяти человек скачивают сборку для своей системы, и она уже в кнопке.
//
// Платформа приходит пропом, а не определяется по navigator: блок остаётся
// серверным и не мигает подменой подписи после гидратации. Проект, которому
// нужен автовыбор, подставит значение сам — на сервере или в своём обвязчике.
const STYLES = `
:where([data-vibeui-block="download-006"]){
--vibeui-download-006-bg:transparent;
--vibeui-download-006-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-download-006-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-download-006-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-download-006-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-download-006-accent:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-download-006-accent-ink:oklch(1 0 0);
--vibeui-download-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-download-006-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="download-006"]{color-scheme:dark}
[data-vibeui-block="download-006"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-download-006-bg);color:var(--vibeui-download-006-ink);
font-family:var(--vibeui-download-006-font);
}
[data-vibeui-block="download-006"] [data-part="shell"]{max-width:44rem;margin:0 auto;padding:3rem 1.25rem;text-align:center}
[data-vibeui-block="download-006"] [data-part="eyebrow"]{margin:0 0 0.5rem;color:var(--vibeui-download-006-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="download-006"] [data-part="title"]{margin:0 0 0.75rem;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700}
[data-vibeui-block="download-006"] [data-part="lead"]{margin:0 auto 2rem;max-width:44ch;color:var(--vibeui-download-006-muted);font-size:1rem;line-height:1.6}
[data-vibeui-block="download-006"] [data-part="primary"]{
display:inline-grid;grid-template-columns:auto auto;align-items:center;
justify-content:center;column-gap:0.75rem;row-gap:0.125rem;
padding:0.9375rem 2rem;border-radius:1rem;
background:var(--vibeui-download-006-accent);color:var(--vibeui-download-006-accent-ink);
text-decoration:none;transition:opacity .18s ease,transform .18s ease;
}
[data-vibeui-block="download-006"] [data-part="primary"]:hover{opacity:.92;transform:translateY(-1px)}
[data-vibeui-block="download-006"] [data-part="primary"]:focus-visible{outline:2px solid var(--vibeui-download-006-accent);outline-offset:3px}
/* Значок занимает обе строки кнопки слева, подпись и приписка идут
   столбиком справа — иначе приписка уезжает под знак. */
[data-vibeui-block="download-006"] [data-part="primary"] svg{grid-row:span 2;width:1.5rem;height:1.5rem;flex:none}
[data-vibeui-block="download-006"] [data-part="primary-label"]{font-size:1.0625rem;font-weight:700;text-align:left}
[data-vibeui-block="download-006"] [data-part="primary-note"]{font-size:0.8125rem;opacity:.85;text-align:left}
[data-vibeui-block="download-006"] [data-part="alternative"] svg{width:1rem;height:1rem;flex:none;opacity:.75}
[data-vibeui-block="download-006"] [data-part="alternatives"]{
list-style:none;margin:1.25rem 0 0;padding:0;
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem 1.25rem;
}
[data-vibeui-block="download-006"] [data-part="alternative"]{
display:inline-flex;align-items:center;gap:0.375rem;
color:var(--vibeui-download-006-muted);font-size:0.875rem;text-decoration:none;
border-bottom:1px solid transparent;
}
[data-vibeui-block="download-006"] [data-part="alternative"]:hover{color:var(--vibeui-download-006-ink);border-color:var(--vibeui-download-006-accent)}
[data-vibeui-block="download-006"] [data-part="alt-note"]{opacity:.75}
[data-vibeui-block="download-006"] [data-part="checksum"]{
margin:2rem auto 0;max-width:100%;padding:0.75rem 1rem;
border:1px solid var(--vibeui-download-006-border);border-radius:0.875rem;
background:var(--vibeui-download-006-card);
display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:0.5rem;
}
[data-vibeui-block="download-006"] [data-part="checksum-label"]{color:var(--vibeui-download-006-muted);font-size:0.75rem;letter-spacing:0.06em;text-transform:uppercase}
[data-vibeui-block="download-006"] [data-part="checksum-value"]{
min-inline-size:0;overflow-wrap:anywhere;
font-family:var(--vibeui-download-006-mono);font-size:0.8125rem;
}
@container (min-width: 42rem){
[data-vibeui-block="download-006"] [data-part="shell"]{padding:4rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-006"] *{animation:none!important;transition:none!important}}
`

// Значок платформы подбирается по её названию: платформа приходит строкой,
// а кнопка загрузки без знака системы читается как обычная ссылка.
const PLATFORM_ICONS: Record<string, ReactNode> = {
  mac: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  ios: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  windows: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 5.6 10.4 4.5v7.1H3zM11.5 4.3 21 3v8.6h-9.5zM3 12.7h7.4v7.1L3 18.7zM11.5 12.7H21V21l-9.5-1.3z"
      />
    </svg>
  ),
  linux: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2c-2.2 0-3.9 1.8-3.9 4v2.1c0 .8-.3 1.5-.8 2.1-1.4 1.7-2.2 3.4-2.5 5.2-.2 1.1.3 2 1.2 2.4.5.2 1 .1 1.4-.2l.4-.4c.3.9.8 1.7 1.5 2.2.7.5 1.7.6 2.7.6s2-.1 2.7-.6c.7-.5 1.2-1.3 1.5-2.2l.4.4c.4.3.9.4 1.4.2.9-.4 1.4-1.3 1.2-2.4-.3-1.8-1.1-3.5-2.5-5.2-.5-.6-.8-1.3-.8-2.1V6c0-2.2-1.7-4-3.9-4zm-1.6 4.1c.5 0 .9.5.9 1.1s-.4 1.1-.9 1.1-.9-.5-.9-1.1.4-1.1.9-1.1zm3.2 0c.5 0 .9.5.9 1.1s-.4 1.1-.9 1.1-.9-.5-.9-1.1.4-1.1.9-1.1zM12 9.1c.8 0 1.6.4 2 1-.6.5-1.3.8-2 .8s-1.4-.3-2-.8c.4-.6 1.2-1 2-1z"
      />
    </svg>
  ),
}

function platformIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  const known = Object.keys(PLATFORM_ICONS).find((system) =>
    key.includes(system),
  )

  return known ? PLATFORM_ICONS[known] : null
}

const DEFAULT_ALTERNATIVES: Download006Alternative[] = [
  { name: "Windows", note: ".exe" },
  { name: "Linux", note: ".AppImage" },
  { name: "macOS (Intel)", note: ".dmg" },
]

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

/** Крупная кнопка под нужную платформу и мелкие ссылки на остальные сборки. */
export function Download006({
  eyebrow = "Загрузка",
  title = "Поставьте приложение на компьютер",
  lead = "Устанавливается за минуту, обновляется само. Исходники сборок и контрольные суммы открыты.",
  platform = "macOS (Apple Silicon)",
  buildNote = "версия 2.4.0 · 74 МБ",
  primaryLabel = "Скачать для",
  primaryHref = "#",
  alternatives = DEFAULT_ALTERNATIVES,
  checksumLabel = "SHA-256",
  checksum = "9f2c 41ab 77de 0c53 8ba1 6e94 2f70 c1d8",
  background = "",
  accent,
  className,
  style,
}: Download006Props) {
  const palette = {
    ...(accent ? { "--vibeui-download-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-download-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-download-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="download-006"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="eyebrow">{eyebrow}</p>
          <h2 data-part="title">{title}</h2>
          {lead ? <p data-part="lead">{lead}</p> : null}

          <a data-part="primary" href={primaryHref}>
            {platformIcon(platform)}
            <span data-part="primary-label">
              {primaryLabel} {platform}
            </span>
            {buildNote ? (
              <span data-part="primary-note">{buildNote}</span>
            ) : null}
          </a>

          {alternatives.length > 0 ? (
            <ul data-part="alternatives">
              {alternatives.map((alternative) => (
                <li key={alternative.name}>
                  <a data-part="alternative" href={alternative.href ?? "#"}>
                    {platformIcon(alternative.name)}
                    {alternative.name}
                    {alternative.note ? (
                      <span data-part="alt-note"> · {alternative.note}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          {checksum ? (
            <p data-part="checksum">
              <span data-part="checksum-label">{checksumLabel}</span>
              <span data-part="checksum-value">{checksum}</span>
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}
