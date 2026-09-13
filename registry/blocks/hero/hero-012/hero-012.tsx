import type { CSSProperties } from "react"

export type Hero012Props = {
  badge?: string
  announcement?: string
  announcementHref?: string
  title?: string
  lede?: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
  release?: { date: string; version: string; items: string[] }
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  /** Тема: следовать странице или зафиксировать светлую либо тёмную. */
  tone?: "auto" | "light" | "dark"
  className?: string
  style?: CSSProperties
}

// Идея блока: hero вокруг анонса. Строка «новое» — не декоративный pill, а
// настоящая ссылка целиком: кликабельна вся полоса, а не хвостовая стрелка,
// и внутри неё бейдж отделён вертикальной линией. Снизу — карточка релиза с
// датой и тремя строками изменений: анонс подтверждается фактами, иначе
// «новое» повисает обещанием. Стрелка сдвигается на hover, но только у ссылки.
const STYLES = `
:where([data-vibeui-block="hero-012"]){
--vibeui-hero-012-bg:transparent;
--vibeui-hero-012-fg:light-dark(oklch(0.2 0 265),oklch(0.96 0 265));
--vibeui-hero-012-muted:light-dark(oklch(0.51 0 265),oklch(0.72 0 265));
--vibeui-hero-012-card:light-dark(oklch(1 0 0),oklch(0.235 0 265));
--vibeui-hero-012-line:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-hero-012-accent:light-dark(oklch(0.2 0 0),oklch(0.92 0 0));
--vibeui-hero-012-accent-fg:oklch(from var(--vibeui-hero-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-hero-012-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-hero-012-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-hero-012-dur-2:180ms;
--vibeui-hero-012-dur-3:240ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="hero-012"]{color-scheme:dark}
:where([data-vibeui-block="hero-012"][data-tone="light"]){color-scheme:light}
:where([data-vibeui-block="hero-012"][data-tone="dark"]){color-scheme:dark}
[data-vibeui-block="hero-012"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;background:var(--vibeui-hero-012-bg);color:var(--vibeui-hero-012-fg);
font-family:var(--vibeui-hero-012-sans);
}
[data-vibeui-block="hero-012"] *{box-sizing:border-box}
[data-vibeui-block="hero-012"] [data-part="shell"]{max-width:52rem;width:100%;margin:0 auto;padding:3.5rem 1.25rem;text-align:center}
[data-vibeui-block="hero-012"] [data-part="announce"]{
display:inline-flex;align-items:center;gap:0.625rem;max-width:100%;margin:0 0 1.75rem;
padding:0.3125rem 0.75rem 0.3125rem 0.375rem;border-radius:9999px;
border:1px solid var(--vibeui-hero-012-line);background:var(--vibeui-hero-012-card);
font-size:0.8125rem;color:var(--vibeui-hero-012-muted);text-decoration:none;
transition:border-color var(--vibeui-hero-012-dur-2) ease,box-shadow var(--vibeui-hero-012-dur-2) ease;
}
[data-vibeui-block="hero-012"] [data-part="announce"]:hover{border-color:var(--vibeui-hero-012-accent);box-shadow:0 1px 10px color-mix(in oklab,var(--vibeui-hero-012-accent) 18%,transparent)}
[data-vibeui-block="hero-012"] [data-part="announce"]:focus-visible{outline:2px solid var(--vibeui-hero-012-accent);outline-offset:3px}
[data-vibeui-block="hero-012"] [data-part="badge"]{
padding:0.1875rem 0.5rem;border-radius:9999px;background:var(--vibeui-hero-012-accent);
color:oklch(from var(--vibeui-hero-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;
}
[data-vibeui-block="hero-012"] [data-part="announcetext"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="hero-012"] [data-part="arrow"]{flex:0 0 auto;transition:transform var(--vibeui-hero-012-dur-2) ease}
[data-vibeui-block="hero-012"] [data-part="announce"]:hover [data-part="arrow"]{transform:translateX(2px)}
[data-vibeui-block="hero-012"] h1{
margin:0;font-size:clamp(1.875rem,6.2cqi,3.5rem);line-height:1.06;letter-spacing:-0.03em;font-weight:700;text-wrap:balance;
}
[data-vibeui-block="hero-012"] [data-part="lede"]{
margin:1.125rem auto 0;max-width:34rem;font-size:clamp(0.9375rem,1.5cqi,1.0625rem);line-height:1.6;
color:var(--vibeui-hero-012-muted);text-wrap:pretty;
}
[data-vibeui-block="hero-012"] [data-part="actions"]{display:flex;flex-direction:column;gap:0.625rem;margin:1.875rem auto 0;max-width:20rem}
[data-vibeui-block="hero-012"] [data-part="actions"] a{
display:inline-flex;align-items:center;justify-content:center;height:2.75rem;padding:0 1.375rem;border-radius:0.625rem;
font-size:0.9375rem;font-weight:600;text-decoration:none;transition:background-color var(--vibeui-hero-012-dur-2) ease,border-color var(--vibeui-hero-012-dur-2) ease;
}
[data-vibeui-block="hero-012"] [data-part="primary"]{background:var(--vibeui-hero-012-accent);color:oklch(from var(--vibeui-hero-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);border:1px solid transparent;box-shadow:0 0.375rem 1.25rem color-mix(in oklab,var(--vibeui-hero-012-accent) 40%,transparent),inset 0 1px 0 color-mix(in oklab,#ffffff 42%,transparent);transition:transform var(--vibeui-hero-012-dur-2) cubic-bezier(.32,.72,0,1),box-shadow var(--vibeui-hero-012-dur-3) ease,background-color var(--vibeui-hero-012-dur-2) ease}
[data-vibeui-block="hero-012"] [data-part="primary"]:hover{transform:translateY(-1px);box-shadow:0 0.625rem 1.75rem color-mix(in oklab,var(--vibeui-hero-012-accent) 50%,transparent),inset 0 1px 0 color-mix(in oklab,#ffffff 52%,transparent)}
[data-vibeui-block="hero-012"] [data-part="secondary"]{border:1px solid var(--vibeui-hero-012-line);color:var(--vibeui-hero-012-fg);background:var(--vibeui-hero-012-card)}
[data-vibeui-block="hero-012"] [data-part="secondary"]:hover{border-color:var(--vibeui-hero-012-fg)}
[data-vibeui-block="hero-012"] [data-part="actions"] a:focus-visible{outline:2px solid var(--vibeui-hero-012-accent);outline-offset:3px}
[data-vibeui-block="hero-012"] [data-part="release"]{
margin:2.75rem auto 0;max-width:34rem;width:100%;text-align:left;
border:1px solid var(--vibeui-hero-012-line);border-radius:0.875rem;background:var(--vibeui-hero-012-card);
}
[data-vibeui-block="hero-012"] [data-part="releasehead"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.75rem 1rem;border-bottom:1px solid var(--vibeui-hero-012-line);
font-family:var(--vibeui-hero-012-mono);font-size:0.75rem;color:var(--vibeui-hero-012-muted);
}
[data-vibeui-block="hero-012"] [data-part="version"]{color:var(--vibeui-hero-012-accent);font-weight:700}
[data-vibeui-block="hero-012"] [data-part="release"] ul{list-style:none;margin:0;padding:0.75rem 1rem}
[data-vibeui-block="hero-012"] [data-part="release"] li{
display:flex;align-items:flex-start;gap:0.625rem;padding:0.3125rem 0;font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="hero-012"] [data-part="plus"]{
flex:0 0 auto;margin-top:0.0625rem;font-family:var(--vibeui-hero-012-mono);font-weight:700;
color:var(--vibeui-hero-012-accent);
}
@container (min-width: 34rem){
[data-vibeui-block="hero-012"] [data-part="actions"]{flex-direction:row;justify-content:center;max-width:none}
[data-vibeui-block="hero-012"] [data-part="shell"]{padding:5.5rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="hero-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_RELEASE = {
  date: "14 марта",
  version: "v2.4.0",
  items: [
    "45 новых секций: hero, features и тарифы",
    "Copy for AI теперь отдаёт версию и хеш файла",
    "Превью считает раскладку от ширины блока, а не окна",
  ],
}

/**
 * Ветка темы для заданной подложки. Без неё светлый фон достался бы тексту
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

/** Hero с бейджем «новое»: анонс-ссылка сверху и карточка релиза снизу. */
export function Hero012({
  badge = "Новое",
  announcement = "Вышла версия 2.4 — 45 секций и новый Copy for AI",
  announcementHref = "#",
  title = "Каталог, который обновляется чаще вашего лендинга",
  lede = "Каждый релиз добавляет секции и не ломает установленные: старые файлы остаются байт в байт такими же.",
  primary = { label: "Открыть каталог", href: "#" },
  secondary = { label: "Список изменений", href: "#" },
  release = DEFAULT_RELEASE,
  accent,
  background = "",
  tone = "auto",
  className,
  style,
}: Hero012Props) {
  const palette = {
    ...(accent ? { "--vibeui-hero-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-hero-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-hero-012" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="hero-012"
        data-tone={tone === "auto" ? undefined : tone}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="announce" href={announcementHref}>
            <span data-part="badge">{badge}</span>
            <span data-part="announcetext">{announcement}</span>
            <svg
              data-part="arrow"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <path
                d="M3.5 8h8m0 0L8.5 5M11.5 8l-3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <h1>{title}</h1>
          {lede ? <p data-part="lede">{lede}</p> : null}

          <div data-part="actions">
            <a data-part="primary" href={primary.href}>
              {primary.label}
            </a>
            <a data-part="secondary" href={secondary.href}>
              {secondary.label}
            </a>
          </div>

          <div data-part="release">
            <div data-part="releasehead">
              <span data-part="version">{release.version}</span>
              <span>{release.date}</span>
            </div>
            <ul>
              {release.items.slice(0, 4).map((item) => (
                <li key={item}>
                  <span data-part="plus" aria-hidden="true">
                    +
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
