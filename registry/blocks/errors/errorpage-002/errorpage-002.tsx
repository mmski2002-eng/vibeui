import type { CSSProperties } from "react"

export type Errorpage002Props = {
  code?: string
  title?: string
  description?: string
  incidentLabel?: string
  incident?: string
  retryLabel?: string
  statusLabel?: string
  statusHref?: string
  /** Пусто — подложки нет, страница лежит прямо на фоне сайта. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Страница 500 в духе «мы уже чиним»: сигнальные полосы как на ремонтной
// ленте, честное объяснение и код инцидента в рамке. Код — главное на этой
// странице: с ним обращение в поддержку решается за минуты, без него —
// перепиской «а что вы делали». Кнопка «обновить» — ссылка на текущий адрес,
// потому что при 500 повторный запрос чаще всего уже проходит.
const STYLES = `
:where([data-vibeui-block="errorpage-002"]){
--vibeui-errorpage-002-bg:transparent;
--vibeui-errorpage-002-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-errorpage-002-muted:light-dark(oklch(0.48 0 0),oklch(0.7 0 0));
--vibeui-errorpage-002-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-errorpage-002-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-errorpage-002-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-errorpage-002-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-errorpage-002-accent-ink:oklch(from var(--vibeui-errorpage-002-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-errorpage-002-mono:ui-monospace,"Cascadia Code","SF Mono",Menlo,Consolas,monospace;
--vibeui-errorpage-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="errorpage-002"]{color-scheme:dark}
[data-vibeui-block="errorpage-002"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-errorpage-002-bg);color:var(--vibeui-errorpage-002-ink);
font-family:var(--vibeui-errorpage-002-font);
}
[data-vibeui-block="errorpage-002"] [data-part="frame"]{
max-width:40rem;margin:0 auto;padding:4rem 1.25rem;
display:flex;flex-direction:column;align-items:flex-start;
}
/* Ремонтная лента: диагональные полосы чистым CSS, никаких картинок. */
[data-vibeui-block="errorpage-002"] [data-part="tape"]{
width:100%;height:0.625rem;border-radius:999px;
background:repeating-linear-gradient(
135deg,
var(--vibeui-errorpage-002-accent-fill) 0 0.75rem,
color-mix(in oklab,var(--vibeui-errorpage-002-accent) 12%,var(--vibeui-errorpage-002-card)) 0.75rem 1.5rem
);
}
[data-vibeui-block="errorpage-002"] [data-part="code"]{
margin:2rem 0 0;
color:var(--vibeui-errorpage-002-accent);
font-family:var(--vibeui-errorpage-002-mono);
font-size:0.875rem;font-weight:700;letter-spacing:0.14em;
}
[data-vibeui-block="errorpage-002"] [data-part="title"]{
margin:0.5rem 0 0;
font-size:clamp(1.625rem,6cqi,2.5rem);line-height:1.1;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="errorpage-002"] [data-part="description"]{
margin:0.875rem 0 0;max-width:46ch;
color:var(--vibeui-errorpage-002-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="errorpage-002"] [data-part="incident"]{
margin:1.75rem 0 0;width:100%;
display:grid;gap:0.375rem;
padding:1rem 1.25rem;
border:1px dashed color-mix(in oklab,var(--vibeui-errorpage-002-accent) 45%,var(--vibeui-errorpage-002-border));
border-radius:0.875rem;
background:color-mix(in oklab,var(--vibeui-errorpage-002-accent) 8%,var(--vibeui-errorpage-002-card));
}
[data-vibeui-block="errorpage-002"] [data-part="incident-label"]{
margin:0;color:var(--vibeui-errorpage-002-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
}
[data-vibeui-block="errorpage-002"] [data-part="incident-code"]{
margin:0;user-select:all;
font-family:var(--vibeui-errorpage-002-mono);
font-size:clamp(1.125rem,4cqi,1.5rem);font-weight:650;letter-spacing:0.06em;
}
[data-vibeui-block="errorpage-002"] [data-part="actions"]{
margin-top:1.75rem;display:flex;flex-wrap:wrap;gap:0.625rem;
}
[data-vibeui-block="errorpage-002"] [data-part="retry"]{
display:inline-block;text-decoration:none;
padding:0.625rem 1.375rem;border-radius:0.75rem;
background:var(--vibeui-errorpage-002-accent-fill);color:var(--vibeui-errorpage-002-accent-ink);
font-size:0.9375rem;font-weight:650;
transition:filter .15s ease;
}
[data-vibeui-block="errorpage-002"] [data-part="retry"]:hover{filter:brightness(1.06)}
[data-vibeui-block="errorpage-002"] [data-part="status"]{
display:inline-block;text-decoration:none;
padding:0.625rem 1.375rem;border-radius:0.75rem;
border:1px solid var(--vibeui-errorpage-002-border);
color:inherit;font-size:0.9375rem;font-weight:550;
background:var(--vibeui-errorpage-002-card);
transition:border-color .15s ease,color .15s ease;
}
[data-vibeui-block="errorpage-002"] [data-part="status"]:hover{
border-color:color-mix(in oklab,var(--vibeui-errorpage-002-accent) 50%,var(--vibeui-errorpage-002-border));
color:var(--vibeui-errorpage-002-accent);
}
[data-vibeui-block="errorpage-002"] a:focus-visible{
outline:2px solid var(--vibeui-errorpage-002-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="errorpage-002"] [data-part="frame"]{padding:6rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="errorpage-002"] *{animation:none!important;transition:none!important}}
`

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

/** Страница 500: ремонтная лента, код инцидента и ссылка на статус. */
export function Errorpage002({
  code = "Ошибка 500",
  title = "Сломалось на нашей стороне",
  description = "Сервер не смог собрать страницу. Мы уже видим ошибку в мониторинге и чиним. Обновите страницу через минуту — обычно этого достаточно.",
  incidentLabel = "Код инцидента для поддержки",
  incident = "INC-0906-2417",
  retryLabel = "Обновить страницу",
  statusLabel = "Статус сервисов",
  statusHref = "/status",
  background = "",
  accent,
  className,
  style,
}: Errorpage002Props) {
  const palette = {
    ...(accent ? { "--vibeui-errorpage-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-errorpage-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-errorpage-002" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="errorpage-002"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="tape" aria-hidden="true" />
          <p data-part="code">{code}</p>
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <dl data-part="incident">
            <dt data-part="incident-label">{incidentLabel}</dt>
            <dd data-part="incident-code">
              <code>{incident}</code>
            </dd>
          </dl>
          <div data-part="actions">
            {/* Пустой href ведёт на текущий адрес — перезагрузка без JS. */}
            <a data-part="retry" href="">
              {retryLabel}
            </a>
            <a data-part="status" href={statusHref}>
              {statusLabel}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
