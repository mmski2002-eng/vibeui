import type { CSSProperties } from "react"

export type Errorpage005Props = {
  title?: string
  description?: string
  checklistLabel?: string
  checklist?: string[]
  retryLabel?: string
  /** Пусто — подложки нет, страница лежит прямо на фоне сайта. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Оффлайн-страница с пунктирной волной: сигнал, который «рвётся», нарисован
// чистым CSS — арки радиальным градиентом, пунктир маской. Никаких картинок:
// когда сети нет, внешние ресурсы всё равно не загрузятся, и иллюстрация
// обязана жить в самом CSS. Чек-лист вместо извинений: оффлайн чинится на
// стороне пользователя, и полезнее подсказать, что проверить.
const STYLES = `
:where([data-vibeui-block="errorpage-005"]){
--vibeui-errorpage-005-bg:transparent;
--vibeui-errorpage-005-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-errorpage-005-muted:light-dark(oklch(0.48 0 0),oklch(0.7 0 0));
--vibeui-errorpage-005-border:light-dark(oklch(0.9 0 0),oklch(0.32 0 0));
--vibeui-errorpage-005-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-errorpage-005-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-errorpage-005-accent-fill:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-errorpage-005-accent-ink:oklch(from var(--vibeui-errorpage-005-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-errorpage-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="errorpage-005"]{color-scheme:dark}
[data-vibeui-block="errorpage-005"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-errorpage-005-bg);color:var(--vibeui-errorpage-005-ink);
font-family:var(--vibeui-errorpage-005-font);
}
[data-vibeui-block="errorpage-005"] [data-part="frame"]{
max-width:38rem;margin:0 auto;padding:4rem 1.25rem;
display:flex;flex-direction:column;align-items:center;text-align:center;
}
/* Пунктирная волна: арки — повторяющийся радиальный градиент, пунктир —
   маска из вертикальных штрихов поверх. Чистый CSS, ноль картинок. */
[data-vibeui-block="errorpage-005"] [data-part="wave"]{
width:min(100%,18rem);height:0.875rem;
--vibeui-errorpage-005-step:1.5rem;
background:radial-gradient(
farthest-side at 50% 125%,
transparent calc(100% - 3px),
var(--vibeui-errorpage-005-accent) calc(100% - 3px) 100%,
transparent 100%
) 0 0/var(--vibeui-errorpage-005-step) 100% repeat-x;
-webkit-mask:repeating-linear-gradient(90deg,#000 0 0.375rem,transparent 0.375rem 0.625rem);
mask:repeating-linear-gradient(90deg,#000 0 0.375rem,transparent 0.375rem 0.625rem);
animation:vibeui-errorpage-005-drift 2.4s linear infinite;
}
@keyframes vibeui-errorpage-005-drift{to{background-position:var(--vibeui-errorpage-005-step) 0}}
[data-vibeui-block="errorpage-005"] [data-part="title"]{
margin:1.75rem 0 0;
font-size:clamp(1.625rem,6cqi,2.5rem);line-height:1.1;letter-spacing:-0.02em;font-weight:700;
}
[data-vibeui-block="errorpage-005"] [data-part="description"]{
margin:0.875rem 0 0;max-width:42ch;
color:var(--vibeui-errorpage-005-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="errorpage-005"] [data-part="check"]{
margin:1.75rem 0 0;width:100%;max-width:24rem;text-align:left;
padding:1.25rem 1.5rem;
border:1px solid var(--vibeui-errorpage-005-border);border-radius:1rem;
background:var(--vibeui-errorpage-005-card);
}
[data-vibeui-block="errorpage-005"] [data-part="check-label"]{
margin:0 0 0.75rem;
color:var(--vibeui-errorpage-005-muted);
font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
}
[data-vibeui-block="errorpage-005"] [data-part="check-list"]{
margin:0;padding:0;list-style:none;
display:grid;gap:0.625rem;
}
[data-vibeui-block="errorpage-005"] [data-part="check-item"]{
display:flex;gap:0.625rem;align-items:baseline;
font-size:0.9375rem;line-height:1.5;
}
[data-vibeui-block="errorpage-005"] [data-part="check-item"]::before{
content:"";flex:none;align-self:center;
width:0.875rem;height:0.875rem;border-radius:0.25rem;
border:1.5px solid color-mix(in oklab,var(--vibeui-errorpage-005-accent) 65%,var(--vibeui-errorpage-005-border));
background:color-mix(in oklab,var(--vibeui-errorpage-005-accent) 12%,var(--vibeui-errorpage-005-card));
}
[data-vibeui-block="errorpage-005"] [data-part="retry"]{
margin-top:1.75rem;
display:inline-block;text-decoration:none;
padding:0.625rem 1.5rem;border-radius:0.75rem;
background:var(--vibeui-errorpage-005-accent-fill);color:var(--vibeui-errorpage-005-accent-ink);
font-size:0.9375rem;font-weight:650;
transition:filter .15s ease;
}
[data-vibeui-block="errorpage-005"] [data-part="retry"]:hover{filter:brightness(1.06)}
[data-vibeui-block="errorpage-005"] a:focus-visible{
outline:2px solid var(--vibeui-errorpage-005-accent);outline-offset:2px;
}
@container (min-width: 48rem){
[data-vibeui-block="errorpage-005"] [data-part="frame"]{padding:6rem 2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="errorpage-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CHECKLIST = [
  "Wi-Fi включён, а роутер не перезагружается",
  "Авиарежим выключен",
  "VPN или прокси не рвут соединение",
  "Другие сайты тоже не открываются — тогда дело в сети",
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

/** Оффлайн-страница: пунктирная волна сигнала, чек-лист и кнопка повтора. */
export function Errorpage005({
  title = "Нет соединения",
  description = "Похоже, интернет пропал. Страница подождёт: как только сеть вернётся, продолжите с того же места.",
  checklistLabel = "Проверьте",
  checklist = DEFAULT_CHECKLIST,
  retryLabel = "Попробовать ещё раз",
  background = "",
  accent,
  className,
  style,
}: Errorpage005Props) {
  const palette = {
    ...(accent ? { "--vibeui-errorpage-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-errorpage-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-errorpage-005" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="errorpage-005"
        className={className}
        style={palette}
      >
        <div data-part="frame">
          <div data-part="wave" aria-hidden="true" />
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <div data-part="check">
            <p data-part="check-label">{checklistLabel}</p>
            <ul data-part="check-list">
              {checklist.map((item) => (
                <li key={item} data-part="check-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Пустой href ведёт на текущий адрес — повтор без JS. */}
          <a data-part="retry" href="">
            {retryLabel}
          </a>
        </div>
      </section>
    </>
  )
}
