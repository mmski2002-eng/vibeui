import type { CSSProperties, ReactNode } from "react"

type Bento001Icon = "bolt" | "shield" | "layers" | "chart" | "sparkles"

export type Bento001Tile = {
  title: string
  description: string
  icon?: Bento001Icon
  size?: "lg" | "md" | "sm"
}

export type Bento001Props = {
  eyebrow?: string
  title?: string
  description?: string
  tiles?: Bento001Tile[]
  accent?: string
  /** Пусто — подложки нет, секция ложится на фон страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Секция везде выглядит одинаково, поэтому палитра, шрифт и keyframes живут
// здесь, а не в globals.css проекта. Селектор в :where() — нулевая
// специфичность, любой класс пользователя переопределяет значение.
//
// container-type делает секцию собственным query-контейнером: раскладка бенто
// считается от ширины секции, а не окна, поэтому она одинакова и на странице,
// и в масштабированной миниатюре каталога. Правила раскладки живут здесь, а не
// в Tailwind-вариантах, чтобы блок не зависел от Tailwind в чужом проекте.
const STYLES = `
:where([data-vibeui-block="bento-001"]){
--vibeui-bento-001-bg:transparent;
--vibeui-bento-001-fg:light-dark(oklch(0.2 0.014 265),oklch(0.97 0.004 265));
--vibeui-bento-001-muted:light-dark(oklch(0.5 0.02 265),oklch(0.74 0.018 265));
--vibeui-bento-001-border:light-dark(oklch(0.18 0.012 265 / 12%),oklch(1 0 0 / 12%));
--vibeui-bento-001-card:light-dark(oklch(0.99 0.002 265),oklch(0.235 0.012 265));
--vibeui-bento-001-accent:light-dark(oklch(0.55 0.2 275),oklch(0.72 0.16 275));
--vibeui-bento-001-accent-fg:light-dark(oklch(0.99 0.004 265),oklch(0.17 0.02 265));
--vibeui-bento-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="bento-001"]{color-scheme:dark}
[data-vibeui-block="bento-001"]{
display:block;box-sizing:border-box;width:100%;min-width:min(100%,16rem);
container-type:inline-size;
background:var(--vibeui-bento-001-bg);
color:var(--vibeui-bento-001-fg);
font-family:var(--vibeui-bento-001-font);
-webkit-font-smoothing:antialiased;
}
[data-vibeui-block="bento-001"] *{box-sizing:border-box}
[data-vibeui-block="bento-001"] [data-part="frame"]{padding:clamp(1.5rem,4cqi,4rem)}
[data-vibeui-block="bento-001"] [data-part="header"]{
display:flex;flex-direction:column;align-items:center;text-align:center;gap:0.875rem;
max-width:42rem;margin:0 auto clamp(1.75rem,4cqi,2.75rem);
}
[data-vibeui-block="bento-001"] [data-part="eyebrow"]{
display:inline-flex;align-items:center;gap:0.5rem;
padding:0.35rem 0.8rem;border-radius:9999px;
border:1px solid var(--vibeui-bento-001-border);
font-size:0.75rem;font-weight:600;letter-spacing:0.02em;
color:var(--vibeui-bento-001-muted);
}
[data-vibeui-block="bento-001"] [data-part="dot"]{
width:0.4rem;height:0.4rem;border-radius:9999px;
background:var(--vibeui-bento-001-accent);
}
[data-vibeui-block="bento-001"] [data-part="title"]{
margin:0;font-size:clamp(1.75rem,4.6cqi,2.9rem);line-height:1.08;
font-weight:680;letter-spacing:-0.02em;text-wrap:balance;
}
[data-vibeui-block="bento-001"] [data-part="lede"]{
margin:0;font-size:clamp(1rem,1.6cqi,1.15rem);line-height:1.6;
color:var(--vibeui-bento-001-muted);text-wrap:pretty;
}
[data-vibeui-block="bento-001"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(4,minmax(0,1fr));
grid-auto-rows:minmax(10.5rem,auto);gap:0.875rem;
}
[data-vibeui-block="bento-001"] [data-part="tile"]{
position:relative;overflow:hidden;display:flex;flex-direction:column;gap:0.7rem;
grid-column:span 1;grid-row:span 1;
padding:clamp(1.1rem,2.4cqi,1.6rem);
border-radius:1.25rem;border:1px solid var(--vibeui-bento-001-border);
background:var(--vibeui-bento-001-card);
box-shadow:0 1px 2px oklch(0 0 0 / 0.04);
opacity:0;transform:scale(0.92);
animation:vibeui-bento-001-in .5s cubic-bezier(0.16,1,0.3,1) both;
}
[data-vibeui-block="bento-001"] [data-part="tile"][data-size="lg"]{
grid-column:span 2;grid-row:span 2;
background:
radial-gradient(120% 120% at 100% 0%,color-mix(in oklab,var(--vibeui-bento-001-accent) 20%,transparent),transparent 58%),
var(--vibeui-bento-001-card);
}
[data-vibeui-block="bento-001"] [data-part="tile"][data-size="md"]{grid-column:span 2;grid-row:span 1}
[data-vibeui-block="bento-001"] [data-part="tile"]:nth-child(1){animation-delay:0ms}
[data-vibeui-block="bento-001"] [data-part="tile"]:nth-child(2){animation-delay:70ms}
[data-vibeui-block="bento-001"] [data-part="tile"]:nth-child(3){animation-delay:140ms}
[data-vibeui-block="bento-001"] [data-part="tile"]:nth-child(4){animation-delay:210ms}
[data-vibeui-block="bento-001"] [data-part="tile"]:nth-child(5){animation-delay:280ms}
[data-vibeui-block="bento-001"] [data-part="tile"]:nth-child(6){animation-delay:350ms}
[data-vibeui-block="bento-001"] [data-part="tile"]:nth-child(n+7){animation-delay:420ms}
[data-vibeui-block="bento-001"] [data-part="icon"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:2.25rem;height:2.25rem;border-radius:0.75rem;
color:var(--vibeui-bento-001-accent);
background:color-mix(in oklab,var(--vibeui-bento-001-accent) 12%,transparent);
box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--vibeui-bento-001-accent) 22%,transparent);
}
[data-vibeui-block="bento-001"] [data-part="icon"] svg{width:1.15rem;height:1.15rem}
[data-vibeui-block="bento-001"] [data-part="tname"]{
margin:0;font-size:1.0625rem;font-weight:640;letter-spacing:-0.01em;line-height:1.25;
}
[data-vibeui-block="bento-001"] [data-part="tile"][data-size="lg"] [data-part="tname"]{font-size:1.375rem}
[data-vibeui-block="bento-001"] [data-part="tdesc"]{
margin:0;font-size:0.875rem;line-height:1.5;color:var(--vibeui-bento-001-muted);
}
[data-vibeui-block="bento-001"] [data-part="tile"][data-size="lg"] [data-part="tdesc"]{
font-size:0.95rem;max-width:30rem;
}
[data-vibeui-block="bento-001"] [data-part="spark"]{
margin-top:auto;display:flex;align-items:flex-end;gap:0.4rem;height:3.5rem;
}
[data-vibeui-block="bento-001"] [data-part="spark"] span{
flex:1;border-radius:0.28rem 0.28rem 0 0;transform-origin:bottom;
background:linear-gradient(to top,var(--vibeui-bento-001-accent),color-mix(in oklab,var(--vibeui-bento-001-accent) 28%,transparent));
animation:vibeui-bento-001-grow .7s cubic-bezier(0.16,1,0.3,1) both;
}
[data-vibeui-block="bento-001"] [data-part="spark"] span:nth-child(1){height:38%;animation-delay:.25s}
[data-vibeui-block="bento-001"] [data-part="spark"] span:nth-child(2){height:54%;animation-delay:.31s}
[data-vibeui-block="bento-001"] [data-part="spark"] span:nth-child(3){height:44%;animation-delay:.37s}
[data-vibeui-block="bento-001"] [data-part="spark"] span:nth-child(4){height:70%;animation-delay:.43s}
[data-vibeui-block="bento-001"] [data-part="spark"] span:nth-child(5){height:58%;animation-delay:.49s}
[data-vibeui-block="bento-001"] [data-part="spark"] span:nth-child(6){height:86%;animation-delay:.55s}
[data-vibeui-block="bento-001"] [data-part="spark"] span:nth-child(7){height:66%;animation-delay:.61s}
@container (max-width:40rem){
[data-vibeui-block="bento-001"] [data-part="grid"]{grid-template-columns:minmax(0,1fr);grid-auto-rows:auto}
[data-vibeui-block="bento-001"] [data-part="tile"]{grid-column:span 1;grid-row:span 1}
}
@keyframes vibeui-bento-001-in{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:none}}
@keyframes vibeui-bento-001-grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="bento-001"] [data-part="tile"],
[data-vibeui-block="bento-001"] [data-part="spark"] span{animation:none!important;opacity:1!important;transform:none!important}
}
`

const ICONS: Record<Bento001Icon, ReactNode> = {
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  layers: (
    <>
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="M2 12l10 5 10-5" />
      <path d="M2 17l10 5 10-5" />
    </>
  ),
  chart: <path d="M4 20h16 M7 20v-5 M12 20v-9 M17 20v-3" />,
  sparkles: (
    <>
      <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" />
      <path d="M19 14l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z" />
    </>
  ),
}

const DEFAULT_TILES: Bento001Tile[] = [
  {
    title: "Быстрая интеграция",
    description:
      "Подключите свой стек за минуты: SDK, вебхуки и готовые коннекторы работают из коробки.",
    icon: "bolt",
    size: "lg",
  },
  {
    title: "Безопасность по умолчанию",
    description: "SOC 2, SSO и сквозное шифрование включены с первого дня.",
    icon: "shield",
    size: "sm",
  },
  {
    title: "99.98% аптайм",
    description: "Стабильная работа под нагрузкой за последний квартал.",
    icon: "chart",
    size: "sm",
  },
  {
    title: "Гибкие права доступа",
    description: "Роли, команды и гранулярные политики без единой строки кода.",
    icon: "layers",
    size: "md",
  },
  {
    title: "Умные подсказки",
    description: "Модель подсказывает следующий шаг прямо в потоке работы.",
    icon: "sparkles",
    size: "md",
  },
  {
    title: "Аналитика в реальном времени",
    description:
      "Метрики продукта обновляются на лету, без отдельной витрины данных.",
    icon: "chart",
    size: "md",
  },
]

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

/**
 * Маркетинговая бенто-секция: заголовок и сетка плиток разного размера с
 * крупной ведущей плиткой. Один файл, ноль зависимостей, собственная палитра,
 * анимации на чистом CSS.
 */
export function Bento001({
  eyebrow = "Платформа",
  title = "Всё, что нужно продукту, в одной сетке",
  description = "Соберите интерфейс из готовых блоков: производительность, безопасность и аналитика уже внутри.",
  tiles = DEFAULT_TILES,
  accent,
  background = "",
  className,
  style,
}: Bento001Props) {
  const palette = {
    ...(accent ? { "--vibeui-bento-001-accent": accent } : {}),
    ...(background
      ? {
          "--vibeui-bento-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : {}),
    ...style,
  } as CSSProperties

  return (
    <section
      data-vibeui-block="bento-001"
      className={className}
      style={palette}
    >
      <style href="vibeui-bento-001" precedence="medium">
        {STYLES}
      </style>

      <div data-part="frame">
        <header data-part="header">
          {eyebrow ? (
            <span data-part="eyebrow">
              <span data-part="dot" aria-hidden="true" />
              {eyebrow}
            </span>
          ) : null}
          {title ? (
            <h2 data-part="title">{title}</h2>
          ) : null}
          {description ? <p data-part="lede">{description}</p> : null}
        </header>

        <div data-part="grid">
          {tiles.map((tile, index) => {
            const size = tile.size ?? "sm"
            const icon = tile.icon ?? "bolt"

            return (
              <article
                data-part="tile"
                data-size={size}
                key={`${tile.title}-${index}`}
              >
                <span data-part="icon" aria-hidden="true">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONS[icon]}
                  </svg>
                </span>
                <h3 data-part="tname">{tile.title}</h3>
                <p data-part="tdesc">{tile.description}</p>
                {size === "lg" ? (
                  <div data-part="spark" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
