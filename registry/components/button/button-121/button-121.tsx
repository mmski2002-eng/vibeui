import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Button121Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  href?: string
  name?: string
  caption?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function storeIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  const known = Object.keys(STORE_ICONS).find((store) => key.includes(store))

  return known ? STORE_ICONS[known] : null
}

const STORE_ICONS: Record<string, ReactNode> = {
  "app store": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  "google play": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M3.6 1.8 12.7 12l-9.1 10.2c-.4-.4-.6-1-.6-1.7V3.5c0-.7.2-1.3.6-1.7z"
      />
      <path fill="#34A853" d="M3.6 1.8c.5-.4 1.2-.5 1.9-.1l10.6 6.9L12.7 12z" />
      <path
        fill="#FBBC04"
        d="m16.1 8.6 3.9 2.3c1.1.6 1.1 1.6 0 2.3l-3.9 2.2L12.7 12z"
      />
      <path
        fill="#EA4335"
        d="M3.6 22.2 12.7 12l3.4 3.4-10.6 6.9c-.7.4-1.4.3-1.9-.1z"
      />
    </svg>
  ),
  rustore: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        width="20"
        height="20"
        x="2"
        y="2"
        rx="5"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        fill="currentColor"
        d="M12 6.6c.3 0 .6.3.6.6v6l1.8-1.8a.6.6 0 1 1 .9.9l-2.9 2.9c-.2.2-.6.2-.8 0l-2.9-2.9a.6.6 0 1 1 .9-.9l1.8 1.8v-6c0-.3.3-.6.6-.6zM7.8 16.8h8.4a.6.6 0 1 1 0 1.2H7.8a.6.6 0 1 1 0-1.2z"
      />
    </svg>
  ),
}

// Часть блока download-004, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-121"]){
--vibeui-button-121-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-button-121-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-button-121-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-button-121-dur-2:180ms;
--vibeui-button-121-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-button-121-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-121"]{color-scheme:dark}
[data-vibeui-block="button-121"]{box-sizing:border-box}
[data-vibeui-block="button-121"] *{box-sizing:border-box}
[data-vibeui-block="button-121"]{display:flex;align-items:center;gap:0.625rem;
padding:0.625rem 1.125rem;border-radius:0.875rem;text-decoration:none;
border:1px solid var(--vibeui-button-121-border);background:var(--vibeui-button-121-card);
color:var(--vibeui-button-121-ink);transition:border-color var(--vibeui-button-121-dur-2) ease,transform var(--vibeui-button-121-dur-2) ease;}
[data-vibeui-block="button-121"]:hover{border-color:var(--vibeui-button-121-accent);transform:translateY(-1px)}
[data-vibeui-block="button-121"]:focus-visible{outline:2px solid var(--vibeui-button-121-accent);outline-offset:2px}
[data-vibeui-block="button-121"] svg{width:1.5rem;height:1.5rem;flex:none}
[data-vibeui-block="button-121"] [data-part="store-text"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="button-121"] [data-part="store-caption"]{color:var(--vibeui-button-121-muted);font-size:0.6875rem;letter-spacing:0.04em;text-transform:uppercase}
[data-vibeui-block="button-121"] [data-part="store-name"]{font-size:0.9375rem;font-weight:700}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-121"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-кнопка магазина: иконка платформы, подпись и название. */
export function Button121({
  href = "#",
  name = "App Store",
  caption = "Загрузить в",
  accent,
  className,
  style,
  ...props
}: Button121Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-121-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-121" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-121" href={href ?? "#"}
        className={className}
        style={palette}
      >
        {storeIcon(name)}
        <span data-part="store-text">
          <span data-part="store-caption">{caption}</span>
          <span data-part="store-name">{name}</span>
        </span>
      </a>
    </>
  )
}
