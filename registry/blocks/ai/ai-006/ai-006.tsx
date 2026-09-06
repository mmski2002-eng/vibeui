import type { CSSProperties } from "react"

export type Ai006Props = {
  title?: string
  status?: string
  text?: string
  speed?: number
  stopLabel?: string
  hint?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: ответ, который «печатается». Текст разбит на слова, каждое
// слово получает свою animation-delay — так поток идёт словами, а не буквами,
// и строка не дёргается на каждом символе. Клиентского JS нет: анимацию
// целиком ведёт CSS, поэтому блок остаётся серверным компонентом.
//
// При prefers-reduced-motion текст обязан остаться видимым: одного
// animation:none мало, потому что стартовое состояние слова — opacity:0.
// Поэтому в том же медиазапросе слова принудительно показываются, а курсор
// перестаёт мигать. Каретка нарисована псевдоэлементом и помечена
// aria-hidden: скринридер читает готовый текст, а не «палочку».
const STYLES = `
:where([data-vibeui-block="ai-006"]){
--vibeui-ai-006-bg:transparent;
--vibeui-ai-006-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-ai-006-muted:light-dark(oklch(0.54 0 265),oklch(0.69 0 265));
--vibeui-ai-006-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-ai-006-soft:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-ai-006-accent:light-dark(oklch(0.55 0.17 155),oklch(0.74 0.15 155));
--vibeui-ai-006-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-006"]{color-scheme:dark}
[data-vibeui-block="ai-006"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-ai-006-bg);color:var(--vibeui-ai-006-fg);
font-family:var(--vibeui-ai-006-sans);
border:1px solid var(--vibeui-ai-006-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-006"] *{box-sizing:border-box}
[data-vibeui-block="ai-006"] [data-part="shell"]{padding:1.25rem;display:grid;gap:0.875rem}
[data-vibeui-block="ai-006"] [data-part="head"]{display:flex;align-items:center;gap:0.625rem}
[data-vibeui-block="ai-006"] h2{margin:0;font-size:0.875rem;font-weight:680}
[data-vibeui-block="ai-006"] [data-part="status"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-left:auto;
font-size:0.6875rem;color:var(--vibeui-ai-006-muted);
}
[data-vibeui-block="ai-006"] [data-part="beacon"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;
background:var(--vibeui-ai-006-accent);
animation:vibeui-ai-006-pulse 1.4s ease-in-out infinite;
}
[data-vibeui-block="ai-006"] [data-part="body"]{
margin:0;padding:0.9375rem 1.0625rem;border-radius:0.9375rem;
background:var(--vibeui-ai-006-soft);
font-size:0.9375rem;line-height:1.7;max-width:68ch;
}
/* Поток идёт словами: на каждом символе строка бы дёргалась. */
[data-vibeui-block="ai-006"] [data-part="word"]{
display:inline-block;opacity:0;
animation:vibeui-ai-006-reveal .28s ease-out forwards;
}
/* Каретка — псевдоэлемент, чтобы скринридер читал текст, а не «палочку». */
[data-vibeui-block="ai-006"] [data-part="caret"]{
display:inline-block;width:0.5rem;height:1.05em;margin-left:0.125rem;
vertical-align:-0.18em;border-radius:0.0625rem;
background:var(--vibeui-ai-006-accent);
animation:vibeui-ai-006-blink 1s steps(2,start) infinite;
}
[data-vibeui-block="ai-006"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.625rem;
}
[data-vibeui-block="ai-006"] button{
appearance:none;cursor:pointer;
height:2.125rem;padding:0 0.875rem;border-radius:0.625rem;
border:1px solid var(--vibeui-ai-006-border);background:none;color:inherit;
font:inherit;font-size:0.8125rem;font-weight:620;
}
[data-vibeui-block="ai-006"] button:hover{background:var(--vibeui-ai-006-soft)}
[data-vibeui-block="ai-006"] [data-part="hint"]{
margin:0;font-size:0.6875rem;line-height:1.5;color:var(--vibeui-ai-006-muted);
}
[data-vibeui-block="ai-006"] :focus-visible{outline:2px solid var(--vibeui-ai-006-accent);outline-offset:2px}
@keyframes vibeui-ai-006-reveal{from{opacity:0;transform:translateY(0.2em)}to{opacity:1;transform:none}}
@keyframes vibeui-ai-006-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes vibeui-ai-006-pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:.45}}
@container (min-width: 40rem){
[data-vibeui-block="ai-006"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-006"] [data-part="body"]{font-size:1rem;padding:1.125rem 1.25rem}
}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="ai-006"] *{animation:none!important;transition:none!important}
[data-vibeui-block="ai-006"] [data-part="word"]{opacity:1;transform:none}
[data-vibeui-block="ai-006"] [data-part="caret"]{display:none}
}
`

const DEFAULT_TEXT =
  "Собрал структуру: hero с одним обещанием, три блока преимуществ, тарифы с годовой скидкой и форма заявки внизу. Все блоки без зависимостей, поэтому проект соберётся без установки пакетов."

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
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
 * Ответ с потоковой печатью: слова проявляются каскадом, каретка мигает.
 * Один файл, ноль зависимостей, анимация целиком на CSS.
 */
export function Ai006({
  title = "Ассистент печатает",
  status = "Поток открыт",
  text = DEFAULT_TEXT,
  speed = 55,
  stopLabel = "Остановить поток",
  hint = "Каретка и каскад слов отключаются при prefers-reduced-motion: текст показывается целиком.",
  accent,
  background = "",
  className,
  style,
}: Ai006Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const words = text.split(" ")

  return (
    <>
      <style href="vibeui-ai-006" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-006"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <span data-part="status">
              <span data-part="beacon" aria-hidden="true" />
              {status}
            </span>
          </header>

          <p data-part="body" aria-live="polite">
            {words.map((word, position) => (
              <span
                key={`${position}-${word}`}
                data-part="word"
                style={{ animationDelay: `${position * speed}ms` }}
              >
                {word}
                {position === words.length - 1 ? "" : " "}
              </span>
            ))}
            <span data-part="caret" aria-hidden="true" />
          </p>

          <div data-part="foot">
            <button type="button">{stopLabel}</button>
            <p data-part="hint">{hint}</p>
          </div>
        </div>
      </section>
    </>
  )
}
