import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Button097Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  platform?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function platformIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  const known = Object.keys(PLATFORM_ICONS).find((platform) =>
    key.includes(platform),
  )

  return known ? PLATFORM_ICONS[known] : null
}

const PLATFORM_ICONS: Record<string, ReactNode> = {
  apple: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 14.5a.8.8 0 0 1-1.1.3c-3-1.8-6.7-2.2-11.1-1.2a.8.8 0 1 1-.3-1.5c4.8-1.1 8.9-.6 12.2 1.4.4.2.5.7.3 1zm1.2-2.8a1 1 0 0 1-1.3.3c-3.4-2.1-8.6-2.7-12.6-1.5a1 1 0 1 1-.6-1.9c4.6-1.4 10.3-.7 14.2 1.7.4.3.6.9.3 1.4zm.1-2.9C13.5 8.4 7 8.2 3.1 9.4a1.2 1.2 0 0 1-.7-2.3C6.9 5.7 14.1 6 18.7 8.7a1.2 1.2 0 0 1-1.2 2.1z"
      />
    </svg>
  ),
  яндекс: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        Я
      </text>
    </svg>
  ),
  звук: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        З
      </text>
    </svg>
  ),
  вк: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fontFamily="inherit"
        fill="currentColor"
      >
        VK
      </text>
    </svg>
  ),
}

// Часть блока podcast-002, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-097"]){
--vibeui-button-097-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-button-097-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-button-097-dur-2:180ms;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-097"]{color-scheme:dark}
[data-vibeui-block="button-097"]{box-sizing:border-box}
[data-vibeui-block="button-097"] *{box-sizing:border-box}
[data-vibeui-block="button-097"] svg{width:1rem;height:1rem;flex:none}
[data-vibeui-block="button-097"]{display:inline-flex;align-items:center;gap:0.375rem;
padding:0.375rem 0.875rem;border-radius:999px;font-size:0.8125rem;font-weight:600;text-decoration:none;
border:1px solid var(--vibeui-button-097-border);color:inherit;transition:border-color var(--vibeui-button-097-dur-2) ease}
[data-vibeui-block="button-097"]:hover{border-color:var(--vibeui-button-097-accent)}
[data-vibeui-block="button-097"]:focus-visible{outline:2px solid var(--vibeui-button-097-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-097"] *{animation:none!important;transition:none!important}}
`

/** Ссылка на платформу подкаста с иконкой сервиса и названием. */
export function Button097({
  platform = "Apple Podcasts",
  accent,
  className,
  style,
  ...props
}: Button097Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-097-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-097" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-097" href="#"
        className={className}
        style={palette}
      >
        {platformIcon(platform)}
        {platform}
      </a>
    </>
  )
}
