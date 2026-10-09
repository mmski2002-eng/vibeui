import type { ComponentProps, CSSProperties, ReactNode } from "react"

type Network = "telegram" | "github" | "youtube" | "x" | "instagram" | "vk"

export type ButtonGroup001Item = {
  network: Network
  label: string
  href: string
}

export type ButtonGroup001Props = Omit<ComponentProps<"nav">, "children"> & {
  items?: ButtonGroup001Item[]
  /** Подпись группы для экранного диктора. */
  label?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея: ссылки на соцсети как объёмные плитки, лежащие в изометрии. Боковая
// грань и торец нарисованы псевдоэлементами со skew, поэтому плитка остаётся
// одной ссылкой без лишней разметки. При наведении плитка «всплывает» к
// зрителю, тень вытягивается, а грани перекрашиваются в акцент — оттенки
// граней считаются от него же, чтобы объём сохранялся при любом цвете.
// В узком контейнере плитки встают столбиком: ряд из четырёх изометрических
// плиток требует ~58rem и на телефоне вылезал бы за край.
const STYLES = `
:where([data-vibeui-block="button-group-001"]){
--vibeui-button-group-001-bg:transparent;
--vibeui-button-group-001-face:light-dark(oklch(0.99 0 0),oklch(0.27 0.004 60));
--vibeui-button-group-001-side:light-dark(oklch(0.78 0.004 60),oklch(0.19 0.004 60));
--vibeui-button-group-001-top:light-dark(oklch(0.86 0.004 60),oklch(0.33 0.004 60));
--vibeui-button-group-001-fg:light-dark(oklch(0.24 0.01 60),oklch(0.93 0.004 60));
--vibeui-button-group-001-accent:oklch(0.6803 0.2144 39.8);
--vibeui-button-group-001-on-accent:oklch(0.145 0 0);
--vibeui-button-group-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="button-group-001"]{color-scheme:dark}
[data-vibeui-block="button-group-001"]{
width:100%;min-width:min(100%,16rem);box-sizing:border-box;padding:5.5rem 1rem 2.5rem;
background:var(--vibeui-button-group-001-bg);color:var(--vibeui-button-group-001-fg);
font-family:var(--vibeui-button-group-001-font);
}
[data-vibeui-block="button-group-001"] *{box-sizing:border-box}
[data-vibeui-block="button-group-001"] ul{
display:flex;flex-direction:column;align-items:center;gap:4.25rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="button-group-001"] a{
--vibeui-button-group-001-tile:var(--vibeui-button-group-001-face);
--vibeui-button-group-001-tile-side:var(--vibeui-button-group-001-side);
--vibeui-button-group-001-tile-top:var(--vibeui-button-group-001-top);
position:relative;display:flex;align-items:center;gap:.9rem;
width:13rem;height:4.5rem;padding-left:1.25rem;
background:var(--vibeui-button-group-001-tile);color:inherit;text-decoration:none;
transform:rotate(-30deg) skew(25deg);
box-shadow:-20px 20px 10px oklch(0 0 0 / 0.35);
transition:transform .5s ease,box-shadow .5s ease,background-color .5s ease,color .5s ease;
}
[data-vibeui-block="button-group-001"] a::before{
content:"";position:absolute;top:10px;left:-20px;width:20px;height:100%;
background:var(--vibeui-button-group-001-tile-side);transform:skewY(-45deg);transition:background-color .5s ease;
}
[data-vibeui-block="button-group-001"] a::after{
content:"";position:absolute;bottom:-20px;left:-10px;width:100%;height:20px;
background:var(--vibeui-button-group-001-tile-top);transform:skewX(-45deg);transition:background-color .5s ease;
}
[data-vibeui-block="button-group-001"] svg{width:2rem;height:2rem;flex:none}
[data-vibeui-block="button-group-001"] [data-part="label"]{font-size:.9375rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase}
[data-vibeui-block="button-group-001"] a:is(:hover,:focus-visible){
--vibeui-button-group-001-tile:var(--vibeui-button-group-001-accent);
--vibeui-button-group-001-tile-side:oklch(from var(--vibeui-button-group-001-accent) calc(l - 0.12) c h);
--vibeui-button-group-001-tile-top:oklch(from var(--vibeui-button-group-001-accent) calc(l + 0.08) calc(c * 0.85) h);
color:var(--vibeui-button-group-001-on-accent);
transform:rotate(-30deg) skew(25deg) translate(20px,-15px);
box-shadow:-50px 50px 50px oklch(0 0 0 / 0.45);outline:none;
}
@container (min-width:58rem){
[data-vibeui-block="button-group-001"] ul{flex-direction:row;justify-content:center;gap:.75rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="button-group-001"] *,[data-vibeui-block="button-group-001"] *::before,[data-vibeui-block="button-group-001"] *::after{transition:none!important}}
`

const ICONS: Record<Network, ReactNode> = {
  telegram: (
    <path
      fill="currentColor"
      d="M21.94 4.3 18.7 19.6c-.24 1.08-.88 1.34-1.78.84l-4.93-3.63-2.38 2.29c-.26.26-.48.48-.99.48l.35-5.02 9.14-8.26c.4-.35-.09-.55-.62-.2L6.2 13.2 1.33 11.68c-1.06-.33-1.08-1.06.22-1.57L20.6 2.77c.88-.32 1.65.2 1.34 1.53z"
    />
  ),
  github: (
    <path
      fill="currentColor"
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
    />
  ),
  youtube: (
    <path
      fill="currentColor"
      d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"
    />
  ),
  x: (
    <path
      fill="currentColor"
      d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z"
    />
  ),
  instagram: (
    <path
      fill="currentColor"
      d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"
    />
  ),
  vk: (
    <path
      fill="currentColor"
      d="M13.16 19c-7.24 0-11.37-4.96-11.54-13.22h3.63c.12 6.06 2.79 8.63 4.91 9.15V5.78h3.42v5.23c2.09-.23 4.29-2.61 5.03-5.23H22c-.57 3.23-2.96 5.61-4.66 6.6 1.7.8 4.43 2.88 5.47 6.62h-3.76c-.81-2.51-2.82-4.45-5.47-4.71V19h-.42z"
    />
  ),
}

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

const DEFAULT_ITEMS: ButtonGroup001Item[] = [
  { network: "telegram", label: "Telegram", href: "#" },
  { network: "github", label: "GitHub", href: "#" },
  { network: "youtube", label: "YouTube", href: "#" },
  { network: "vk", label: "VK", href: "#" },
]

/**
 * Ссылки на соцсети объёмными изометрическими плитками: при наведении плитка
 * всплывает и окрашивается в акцент. Один файл, ноль зависимостей.
 */
export function ButtonGroup001({
  items = DEFAULT_ITEMS,
  label = "Мы в соцсетях",
  accent,
  background = "",
  className,
  style,
  ...props
}: ButtonGroup001Props) {
  const palette = {
    ...(accent ? { "--vibeui-button-group-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-button-group-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-button-group-001" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-vibeui-block="button-group-001"
        data-slot="button-group"
        aria-label={label}
        className={className}
        style={palette}
      >
        <ul>
          {items.map((item) => (
            <li key={`${item.network}-${item.label}`}>
              <a href={item.href}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {ICONS[item.network]}
                </svg>
                <span data-part="label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
