import type { CSSProperties } from "react"
import { Button121 } from "@/registry/components/button/button-121/button-121"

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
                  <Button121 data-part="store" href={store.href} name={store.name} caption={store.caption} accent={accent} />
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
