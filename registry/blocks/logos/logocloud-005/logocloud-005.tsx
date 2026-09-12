import type { CSSProperties } from "react"

type Logocloud005Logo = {
  name: string
  /** Типографический характер wordmark: sans | serif | mono | wide | slab. */
  style?: "sans" | "serif" | "mono" | "wide" | "slab"
}

type Logocloud005Group = {
  label: string
  logos: Logocloud005Logo[]
}

export type Logocloud005Props = {
  eyebrow?: string
  title?: string
  /** До четырёх вкладок: CSS переключения написан на фиксированные позиции. */
  groups?: Logocloud005Group[]
  /** Имя radio-группы. Задать своё, если блок стоит на странице дважды. */
  tabsName?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Отрасли табами без JavaScript: скрытые radio и :has(:checked) в CSS.
// Radio выбраны неслучайно — стрелки клавиатуры переключают вкладки
// нативно, состояние живёт в форме, а не в стейте, и блок остаётся
// Server Component. Логотипы разбиты по отраслям, потому что «нам доверяют
// все» не убеждает никого: посетитель ищет в списке компании, похожие на его.
const STYLES = `
:where([data-vibeui-block="logocloud-005"]){
--vibeui-logocloud-005-bg:transparent;
--vibeui-logocloud-005-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-logocloud-005-muted:light-dark(oklch(0.52 0 0),oklch(0.68 0 0));
--vibeui-logocloud-005-logo:light-dark(oklch(0.45 0 0),oklch(0.64 0 0));
--vibeui-logocloud-005-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-logocloud-005-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-logocloud-005-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-logocloud-005-on-fill:oklch(0.15 0 0);
--vibeui-logocloud-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="logocloud-005"]{color-scheme:dark}
[data-vibeui-block="logocloud-005"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-logocloud-005-bg);color:var(--vibeui-logocloud-005-ink);
font-family:var(--vibeui-logocloud-005-font);
}
[data-vibeui-block="logocloud-005"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;gap:1.75rem;justify-items:center;text-align:center;
}
[data-vibeui-block="logocloud-005"] [data-part="head"]{display:grid;gap:0.625rem;justify-items:center}
[data-vibeui-block="logocloud-005"] [data-part="eyebrow"]{
margin:0;color:var(--vibeui-logocloud-005-accent);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-005"] [data-part="title"]{
margin:0;max-width:26ch;
font-size:clamp(1.375rem,4cqi,2rem);line-height:1.15;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="logocloud-005"] [data-part="switch"]{
display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;width:100%;
}
[data-vibeui-block="logocloud-005"] [data-part="radio"]{
position:absolute;width:1px;height:1px;margin:-1px;opacity:0.001;pointer-events:none;
}
[data-vibeui-block="logocloud-005"] [data-part="tab"]{
display:inline-flex;align-items:center;
padding:0.5rem 1.125rem;border:1px solid var(--vibeui-logocloud-005-border);border-radius:999px;
color:var(--vibeui-logocloud-005-muted);
font-size:0.875rem;font-weight:600;line-height:1;cursor:pointer;user-select:none;
transition:color .18s ease,border-color .18s ease,background-color .18s ease;
}
[data-vibeui-block="logocloud-005"] [data-part="tab"]:hover{
color:var(--vibeui-logocloud-005-ink);
border-color:color-mix(in oklab,var(--vibeui-logocloud-005-accent) 45%,var(--vibeui-logocloud-005-border));
}
[data-vibeui-block="logocloud-005"] [data-part="tab"]:has([data-part="radio"]:checked){
background:var(--vibeui-logocloud-005-fill);border-color:var(--vibeui-logocloud-005-fill);
color:var(--vibeui-logocloud-005-on-fill);
}
[data-vibeui-block="logocloud-005"] [data-part="tab"]:has([data-part="radio"]:focus-visible){
outline:2px solid var(--vibeui-logocloud-005-accent);outline-offset:2px;
}
[data-vibeui-block="logocloud-005"] [data-part="panel"]{
list-style:none;margin:0;padding:0.5rem 0 0;width:100%;
display:none;
}
[data-vibeui-block="logocloud-005"] [data-part="switch"]:has([data-part="tab"]:nth-of-type(1) [data-part="radio"]:checked) ~ [data-part="panels"] [data-part="panel"]:nth-child(1),
[data-vibeui-block="logocloud-005"] [data-part="switch"]:has([data-part="tab"]:nth-of-type(2) [data-part="radio"]:checked) ~ [data-part="panels"] [data-part="panel"]:nth-child(2),
[data-vibeui-block="logocloud-005"] [data-part="switch"]:has([data-part="tab"]:nth-of-type(3) [data-part="radio"]:checked) ~ [data-part="panels"] [data-part="panel"]:nth-child(3),
[data-vibeui-block="logocloud-005"] [data-part="switch"]:has([data-part="tab"]:nth-of-type(4) [data-part="radio"]:checked) ~ [data-part="panels"] [data-part="panel"]:nth-child(4){
display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1.25rem 2.75rem;
}
[data-vibeui-block="logocloud-005"] [data-part="panels"]{width:100%;min-height:4rem}
[data-vibeui-block="logocloud-005"] [data-part="logo"]{
color:var(--vibeui-logocloud-005-logo);
font-size:1.25rem;line-height:1;white-space:nowrap;
transition:color .18s ease;
font-weight:750;letter-spacing:-0.035em;
}
[data-vibeui-block="logocloud-005"] [data-part="logo"][data-style="serif"]{
font-family:ui-serif,Georgia,"Times New Roman",serif;font-weight:650;letter-spacing:0;
}
[data-vibeui-block="logocloud-005"] [data-part="logo"][data-style="mono"]{
font-family:ui-monospace,"Cascadia Code",Consolas,monospace;font-weight:600;letter-spacing:-0.02em;
}
[data-vibeui-block="logocloud-005"] [data-part="logo"][data-style="wide"]{
font-size:1rem;font-weight:650;letter-spacing:0.28em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-005"] [data-part="logo"][data-style="slab"]{
font-weight:850;letter-spacing:-0.01em;text-transform:uppercase;
}
[data-vibeui-block="logocloud-005"] [data-part="panel"] li:hover [data-part="logo"]{
color:var(--vibeui-logocloud-005-accent);
}
@container (min-width: 48rem){
[data-vibeui-block="logocloud-005"] [data-part="shell"]{padding:4rem 2rem;gap:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="logocloud-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Logocloud005Group[] = [
  {
    label: "Финтех",
    logos: [
      { name: "Sturm", style: "slab" },
      { name: "Vexel", style: "serif" },
      { name: "Oktava", style: "sans" },
      { name: "Kopim", style: "mono" },
      { name: "Sejf", style: "wide" },
    ],
  },
  {
    label: "Ритейл",
    logos: [
      { name: "Plot", style: "serif" },
      { name: "Korzina", style: "sans" },
      { name: "Marlow", style: "wide" },
      { name: "Vitrina", style: "slab" },
      { name: "Kupol", style: "sans" },
    ],
  },
  {
    label: "Медиа",
    logos: [
      { name: "Umbra", style: "wide" },
      { name: "Fjord", style: "mono" },
      { name: "Ekran", style: "slab" },
      { name: "Talvi", style: "serif" },
      { name: "Granum", style: "sans" },
    ],
  },
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

/** Логотипы клиентов по отраслям: CSS-radio табы без клиентского JS. */
export function Logocloud005({
  eyebrow = "Клиенты",
  title = "Свои команды найдутся в каждой отрасли",
  groups = DEFAULT_GROUPS,
  tabsName = "vibeui-logocloud-005",
  background = "",
  accent,
  className,
  style,
}: Logocloud005Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-logocloud-005-accent": accent,
          "--vibeui-logocloud-005-fill": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-logocloud-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-logocloud-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="logocloud-005"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="head">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
          </div>
          <div data-part="switch">
            {groups.map((group, index) => (
              <label key={group.label} data-part="tab">
                <input
                  type="radio"
                  name={tabsName}
                  value={group.label}
                  defaultChecked={index === 0}
                  data-part="radio"
                />
                {group.label}
              </label>
            ))}
          </div>
          <div data-part="panels">
            {groups.map((group) => (
              <ul key={group.label} data-part="panel">
                {group.logos.map((logo) => (
                  <li key={logo.name}>
                    <span data-part="logo" data-style={logo.style ?? "sans"}>
                      {logo.name}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
