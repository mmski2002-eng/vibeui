import type { CSSProperties, ReactNode } from "react"

type Download004Store = {
  name: string
  caption: string
  href?: string
}

type Download004Fact = {
  value: string
  label: string
}

export type Download004Props = {
  eyebrow?: string
  title?: string
  lead?: string
  stores?: Download004Store[]
  facts?: Download004Fact[]
  /** Скриншот приложения внутри рамки телефона. Пусто — заглушка на CSS. */
  screenshot?: string
  screenAlt?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Экран приложения и кнопки магазинов: слева рамка телефона со скриншотом,
// справа текст, факты и бейджи. От остальных секций загрузки отличается тем,
// что показывает сам продукт — на странице приложения это главный аргумент.
//
// Рамка телефона нарисована рамкой и радиусами, без картинки: устройство —
// декорация, и тащить ради неё изображение в блок незачем. Скриншота может
// не быть — тогда внутри рамки живёт градиентная заглушка с полосой статуса.
const STYLES = `
:where([data-vibeui-block="download-004"]){
--vibeui-download-004-bg:transparent;
--vibeui-download-004-ink:light-dark(oklch(0.22 0 0),oklch(0.95 0 0));
--vibeui-download-004-muted:light-dark(oklch(0.5 0 0),oklch(0.72 0 0));
--vibeui-download-004-border:light-dark(oklch(0.9 0 0),oklch(0.3 0 0));
--vibeui-download-004-card:light-dark(oklch(0.98 0 0),oklch(0.2 0 0));
--vibeui-download-004-device:light-dark(oklch(0.16 0 0),oklch(0.1 0 0));
--vibeui-download-004-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-download-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-download-004-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="download-004"]{color-scheme:dark}
[data-vibeui-block="download-004"]{
min-width:min(100%,16rem);display:block;
background:var(--vibeui-download-004-bg);color:var(--vibeui-download-004-ink);
font-family:var(--vibeui-download-004-font);
}
[data-vibeui-block="download-004"] [data-part="shell"]{
max-width:64rem;margin:0 auto;padding:3rem 1.25rem;
display:grid;gap:2rem;align-items:center;grid-template-columns:minmax(0,1fr);
}
[data-vibeui-block="download-004"] [data-part="body"]{min-inline-size:0;display:flex;flex-direction:column;gap:1rem}
[data-vibeui-block="download-004"] [data-part="eyebrow"]{margin:0;color:var(--vibeui-download-004-accent);font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase}
[data-vibeui-block="download-004"] [data-part="title"]{margin:0;font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;max-width:18ch}
[data-vibeui-block="download-004"] [data-part="lead"]{margin:0;max-width:46ch;color:var(--vibeui-download-004-muted);font-size:1rem;line-height:1.6}
[data-vibeui-block="download-004"] [data-part="facts"]{list-style:none;margin:0.25rem 0 0;padding:0;display:flex;flex-wrap:wrap;gap:1.75rem}
[data-vibeui-block="download-004"] [data-part="value"]{display:block;font-size:1.25rem;line-height:1.1;font-weight:700}
[data-vibeui-block="download-004"] [data-part="label"]{display:block;margin-top:0.25rem;color:var(--vibeui-download-004-muted);font-size:0.8125rem}
[data-vibeui-block="download-004"] [data-part="stores"]{list-style:none;margin:0.75rem 0 0;padding:0;display:flex;flex-wrap:wrap;gap:0.75rem}
[data-vibeui-block="download-004"] [data-part="store"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.625rem 1.125rem;border-radius:0.875rem;text-decoration:none;
border:1px solid var(--vibeui-download-004-border);background:var(--vibeui-download-004-card);
color:var(--vibeui-download-004-ink);transition:border-color var(--vibeui-download-004-dur-2) ease,transform var(--vibeui-download-004-dur-2) ease;
}
[data-vibeui-block="download-004"] [data-part="store"]:hover{border-color:var(--vibeui-download-004-accent);transform:translateY(-1px)}
[data-vibeui-block="download-004"] [data-part="store"]:focus-visible{outline:2px solid var(--vibeui-download-004-accent);outline-offset:2px}
[data-vibeui-block="download-004"] [data-part="store"] svg{width:1.5rem;height:1.5rem;flex:none}
[data-vibeui-block="download-004"] [data-part="store-text"]{display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="download-004"] [data-part="store-caption"]{color:var(--vibeui-download-004-muted);font-size:0.6875rem;letter-spacing:0.04em;text-transform:uppercase}
[data-vibeui-block="download-004"] [data-part="store-name"]{font-size:0.9375rem;font-weight:700}
[data-vibeui-block="download-004"] [data-part="device"]{
justify-self:center;position:relative;width:min(16rem,100%);aspect-ratio:9/19;
padding:0.5rem;border-radius:2.25rem;background:var(--vibeui-download-004-device);
box-shadow:0 24px 60px -30px oklch(0 0 0 / 55%);
}
[data-vibeui-block="download-004"] [data-part="screen"]{
position:relative;height:100%;overflow:hidden;border-radius:1.875rem;
background:var(--vibeui-download-004-card);
}
[data-vibeui-block="download-004"] [data-part="screen"] img{display:block;width:100%;height:100%;object-fit:cover}
/* Заглушка экрана: приложение без скриншота всё равно должно выглядеть
   приложением, иначе рамка читается как пустая коробка. */
[data-vibeui-block="download-004"] [data-part="screen"][data-empty="true"]::before{
content:"";position:absolute;inset:0;
background:
  radial-gradient(90% 55% at 50% 0%, color-mix(in oklab, var(--vibeui-download-004-accent) 40%, transparent), transparent 70%),
  linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--vibeui-download-004-accent) 12%, transparent));
}
[data-vibeui-block="download-004"] [data-part="notch"]{
position:absolute;left:50%;top:0.5rem;translate:-50% 0;z-index:1;
width:34%;height:0.375rem;border-radius:999px;
background:light-dark(oklch(0.85 0 0),oklch(0.4 0 0));
}
@container (min-width: 46rem){
[data-vibeui-block="download-004"] [data-part="shell"]{grid-template-columns:minmax(0,1.1fr) minmax(0,0.9fr);padding:4rem 2rem;gap:3rem}
[data-vibeui-block="download-004"] [data-part="device"]{width:min(18rem,100%)}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="download-004"] *{animation:none!important;transition:none!important}}
`

// Значки магазинов подбираются по названию: список магазинов приходит
// строками, а бейдж без фирменного знака читается как обычная кнопка.
// Apple и Google Play рисуются своими знаками, у остальных магазинов
// точный логотип — товарный знак, поэтому у них буквенная плашка.
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

function storeIcon(name: string): ReactNode {
  const key = name.toLowerCase()
  const known = Object.keys(STORE_ICONS).find((store) => key.includes(store))

  return known ? STORE_ICONS[known] : null
}

const DEFAULT_STORES: Download004Store[] = [
  { caption: "Загрузить в", name: "App Store" },
  { caption: "Доступно в", name: "Google Play" },
  { caption: "Открыть в", name: "RuStore" },
]

const DEFAULT_FACTS: Download004Fact[] = [
  { value: "4,8", label: "средняя оценка" },
  { value: "120 тыс.", label: "установок" },
  { value: "38 МБ", label: "размер" },
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

/** Экран приложения в рамке телефона, факты и бейджи магазинов рядом. */
export function Download004({
  eyebrow = "Приложение",
  title = "Всё под рукой — прямо в телефоне",
  lead = "Заказы, уведомления и оплата в одном приложении. Работает офлайн и синхронизируется, как только появится сеть.",
  stores = DEFAULT_STORES,
  facts = DEFAULT_FACTS,
  screenshot = "",
  screenAlt = "Экран приложения",
  background = "",
  accent,
  className,
  style,
}: Download004Props) {
  const palette = {
    ...(accent ? { "--vibeui-download-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-download-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-download-004" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="download-004"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="body">
            <p data-part="eyebrow">{eyebrow}</p>
            <h2 data-part="title">{title}</h2>
            {lead ? <p data-part="lead">{lead}</p> : null}

            {facts.length > 0 ? (
              <ul data-part="facts">
                {facts.map((fact) => (
                  <li key={fact.label}>
                    <span data-part="value">{fact.value}</span>
                    <span data-part="label">{fact.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <ul data-part="stores">
              {stores.map((store) => (
                <li key={store.name}>
                  <a data-part="store" href={store.href ?? "#"}>
                    {storeIcon(store.name)}
                    <span data-part="store-text">
                      <span data-part="store-caption">{store.caption}</span>
                      <span data-part="store-name">{store.name}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-part="device" aria-hidden={screenshot ? undefined : "true"}>
            <span data-part="notch" />
            <div
              data-part="screen"
              data-empty={screenshot ? undefined : "true"}
            >
              {screenshot ? (
                <img src={screenshot} alt={screenAlt} loading="lazy" />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
