import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Button122Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  primaryHref?: string
  platform?: string
  primaryLabel?: string
  buildNote?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function platformIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  const known = Object.keys(PLATFORM_ICONS).find((system) =>
    key.includes(system),
  )

  return known ? PLATFORM_ICONS[known] : null
}

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

// Часть блока download-006, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-122"]){
--vibeui-button-122-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-button-122-dur-2:180ms;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-122"]{color-scheme:dark}
[data-vibeui-block="button-122"]{box-sizing:border-box}
[data-vibeui-block="button-122"] *{box-sizing:border-box}
[data-vibeui-block="button-122"]{display:inline-grid;grid-template-columns:auto auto;align-items:center;
justify-content:center;column-gap:0.75rem;row-gap:0.125rem;
padding:0.9375rem 2rem;border-radius:1rem;
background:var(--vibeui-button-122-accent);color:oklch(from var(--vibeui-button-122-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
text-decoration:none;transition:opacity var(--vibeui-button-122-dur-2) ease,transform var(--vibeui-button-122-dur-2) ease;}
[data-vibeui-block="button-122"]:hover{opacity:.92;transform:translateY(-1px)}
[data-vibeui-block="button-122"]:focus-visible{outline:2px solid var(--vibeui-button-122-accent);outline-offset:3px}
[data-vibeui-block="button-122"] svg{grid-row:span 2;width:1.5rem;height:1.5rem;flex:none}
[data-vibeui-block="button-122"] [data-part="primary-label"]{font-size:1.0625rem;font-weight:700;text-align:left}
[data-vibeui-block="button-122"] [data-part="primary-note"]{font-size:0.8125rem;opacity:.85;text-align:left}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-122"] *{animation:none!important;transition:none!important}}
`

/** Основная кнопка загрузки: иконка платформы, подпись с названием платформы и заметка о сборке. */
export function Button122({
  primaryHref = "#",
  platform = "macOS (Apple Silicon)",
  primaryLabel = "Скачать для",
  buildNote = "версия 2.4.0 · 74 МБ",
  accent,
  className,
  style,
  ...props
}: Button122Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-122-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-122" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-122" href={primaryHref}
        className={className}
        style={palette}
      >
        {platformIcon(platform)}
        <span data-part="primary-label">
          {primaryLabel} {platform}
        </span>
        {buildNote ? (
          <span data-part="primary-note">{buildNote}</span>
        ) : null}
      </a>
    </>
  )
}
