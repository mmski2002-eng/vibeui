import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Button116Props = Omit<ComponentProps<"a">, "title" | "children"> & {
  store?: string
  href?: string
  caption?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

function platformIcon(store: string): ReactNode {
  const key = store.toLowerCase()
  const known = Object.keys(PLATFORM_ICONS).find((name) => key.includes(name))
  return known ? PLATFORM_ICONS[known] : null
}

const PLATFORM_ICONS: Record<string, ReactNode> = {
  ios: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.37 12.77c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.39.81 1.4-.03 2.28-1.27 3.14-2.52.99-1.45 1.4-2.85 1.42-2.92-.03-.01-2.72-1.04-2.74-4.14zM13.8 5.13c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.29.69-3.03 1.56-.67.77-1.25 2-1.09 3.18 1.15.09 2.33-.59 3.05-1.45z"
      />
    </svg>
  ),
  android: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="m17.6 9.48 1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 0 0 1 18h22a10.81 10.81 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"
      />
    </svg>
  ),
}

// Часть блока cta-015, вынесенная как есть: разметка и стили карточки
// живут здесь, блок владеет раскладкой и данными.
const STYLES = `
:where([data-vibeui-block="button-116"]){
--vibeui-button-116-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-button-116-badge-bg:oklch(0.2 0 0);
--vibeui-button-116-badge-ink:oklch(0.97 0 0);
--vibeui-button-116-dur-2:180ms;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-116"]{color-scheme:dark}
[data-vibeui-block="button-116"]{box-sizing:border-box}
[data-vibeui-block="button-116"] *{box-sizing:border-box}
[data-vibeui-block="button-116"]{display:inline-flex;align-items:center;gap:0.625rem;
padding:0.5625rem 1.125rem 0.5625rem 0.875rem;border-radius:0.75rem;
background:var(--vibeui-button-116-badge-bg);color:var(--vibeui-button-116-badge-ink);
text-decoration:none;
transition:transform var(--vibeui-button-116-dur-2) ease;}
[data-vibeui-block="button-116"]:hover{transform:translateY(-1px)}
[data-vibeui-block="button-116"]:focus-visible{outline:2px solid var(--vibeui-button-116-accent);outline-offset:2px;}
[data-vibeui-block="button-116"] svg{width:1.5rem;height:1.5rem;flex:none}
[data-vibeui-block="button-116"] [data-part="badge-text"]{display:grid;gap:0.0625rem;justify-items:start}
[data-vibeui-block="button-116"] [data-part="badge-caption"]{font-size:0.625rem;letter-spacing:0.06em;text-transform:uppercase;opacity:0.75;}
[data-vibeui-block="button-116"] [data-part="badge-store"]{font-size:1.0625rem;font-weight:700;letter-spacing:-0.01em;}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-116"] *{animation:none!important;transition:none!important}}
`

/** Ссылка-бейдж магазина: иконка платформы, подпись и название магазина. */
export function Button116({
  store = "iOS",
  href = "#ios",
  caption = "Скачать для",
  accent,
  className,
  style,
  ...props
}: Button116Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-116-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-116" precedence="medium">
        {STYLES}
      </style>
      <a
        {...props}
        data-slot="button"
        data-vibeui-block="button-116" href={href}
        className={className}
        style={palette}
      >
        {platformIcon(store)}
        <span data-part="badge-text">
          <span data-part="badge-caption">{caption}</span>
          <span data-part="badge-store">{store}</span>
        </span>
      </a>
    </>
  )
}
