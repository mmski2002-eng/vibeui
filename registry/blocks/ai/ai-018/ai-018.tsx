import type { CSSProperties } from "react"

export type Ai018Props = {
  title?: string
  source?: string
  location?: string
  updated?: string
  before?: string
  quote?: string
  after?: string
  claim?: string
  claimTitle?: string
  confidence?: string
  openLabel?: string
  copyLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: показать не ссылку на документ, а сам фрагмент — с тем, что
// стоит до и после. Вырванная цитата легко меняет смысл на противоположный,
// поэтому соседние предложения приглушены, но оставлены на месте: видно,
// что фрагмент не обрезан по удобному слову.
//
// Подсветка сделана тегом <mark>, а не покрашенным span: это семантика
// «выделено как важное», и её понимает поиск по странице. Цитата лежит в
// <blockquote> с <cite> в подписи, поэтому источник связан с текстом на
// уровне разметки, а не только визуально.
const STYLES = `
:where([data-vibeui-block="ai-018"]){
--vibeui-ai-018-bg:transparent;
--vibeui-ai-018-paper:light-dark(oklch(0.98 0.006 95),oklch(0.27 0.014 95));
--vibeui-ai-018-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-ai-018-muted:light-dark(oklch(0.55 0 265),oklch(0.7 0 265));
--vibeui-ai-018-faint:light-dark(oklch(0.68 0 265),oklch(0.58 0 265));
--vibeui-ai-018-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-ai-018-accent:light-dark(oklch(0.52 0.16 39.8),oklch(0.74 0.13 39.8));
--vibeui-ai-018-on-accent:oklch(0.15 0.02 39.8);
--vibeui-ai-018-mark:light-dark(oklch(0.92 0.11 39.8),oklch(0.47 0.09 39.8));
--vibeui-ai-018-serif:ui-serif,Georgia,"Times New Roman",serif;
--vibeui-ai-018-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-018"]{color-scheme:dark}
[data-vibeui-block="ai-018"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-ai-018-bg);color:var(--vibeui-ai-018-fg);
font-family:var(--vibeui-ai-018-sans);
border:1px solid var(--vibeui-ai-018-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-018"] *{box-sizing:border-box}
[data-vibeui-block="ai-018"] [data-part="shell"]{padding:1.25rem;display:grid;gap:1rem}
[data-vibeui-block="ai-018"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem}
[data-vibeui-block="ai-018"] h2{margin:0;width:100%;font-size:0.6875rem;font-weight:650;letter-spacing:0.08em;text-transform:uppercase;color:var(--vibeui-ai-018-muted)}
[data-vibeui-block="ai-018"] [data-part="doc"]{font-size:0.875rem;font-weight:660}
[data-vibeui-block="ai-018"] [data-part="tag"]{
padding:0.0625rem 0.4375rem;border-radius:0.375rem;
border:1px solid var(--vibeui-ai-018-border);
font-size:0.6875rem;color:var(--vibeui-ai-018-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-018"] [data-part="updated"]{margin-left:auto;font-size:0.6875rem;color:var(--vibeui-ai-018-muted)}
[data-vibeui-block="ai-018"] figure{margin:0}
[data-vibeui-block="ai-018"] blockquote{
margin:0;padding:1rem 1.125rem;border-radius:0.9375rem;
background:var(--vibeui-ai-018-paper);
border:1px solid var(--vibeui-ai-018-border);
border-left:3px solid var(--vibeui-ai-018-accent);
font-family:var(--vibeui-ai-018-serif);font-size:0.9375rem;line-height:1.75;
}
/* Соседние предложения приглушены, но на месте: видно, что не обрезано. */
[data-vibeui-block="ai-018"] [data-part="around"]{color:var(--vibeui-ai-018-faint)}
[data-vibeui-block="ai-018"] mark{
background:var(--vibeui-ai-018-mark);color:inherit;
padding:0.0625rem 0.125rem;border-radius:0.1875rem;
box-decoration-break:clone;-webkit-box-decoration-break:clone;
}
[data-vibeui-block="ai-018"] figcaption{
margin-top:0.5rem;font-size:0.6875rem;color:var(--vibeui-ai-018-muted);
font-family:var(--vibeui-ai-018-sans);
}
[data-vibeui-block="ai-018"] cite{font-style:normal;font-weight:620;color:var(--vibeui-ai-018-fg)}
[data-vibeui-block="ai-018"] h3{
margin:0 0 0.4375rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-ai-018-muted);
}
[data-vibeui-block="ai-018"] [data-part="claim"]{
margin:0;padding:0.8125rem 0.9375rem;border-radius:0.875rem;
border:1px solid var(--vibeui-ai-018-border);
font-size:0.8125rem;line-height:1.65;max-width:62ch;
}
[data-vibeui-block="ai-018"] [data-part="confidence"]{
display:inline-flex;align-items:center;gap:0.375rem;margin-top:0.5rem;
font-size:0.6875rem;color:var(--vibeui-ai-018-muted);
}
[data-vibeui-block="ai-018"] [data-part="dot"]{
width:0.4375rem;height:0.4375rem;border-radius:9999px;background:var(--vibeui-ai-018-accent);
}
[data-vibeui-block="ai-018"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="ai-018"] button{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;border-radius:0.6875rem;
font:inherit;font-size:0.8125rem;font-weight:640;
}
[data-vibeui-block="ai-018"] [data-part="open"]{border:0;background:var(--vibeui-ai-018-accent);color:var(--vibeui-ai-018-on-accent)}
[data-vibeui-block="ai-018"] [data-part="copy"]{border:1px solid var(--vibeui-ai-018-border);background:none;color:inherit}
[data-vibeui-block="ai-018"] :focus-visible{outline:2px solid var(--vibeui-ai-018-accent);outline-offset:2px}
@container (min-width: 46rem){
[data-vibeui-block="ai-018"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-018"] [data-part="panes"]{display:grid;grid-template-columns:1.3fr 1fr;gap:1.25rem;align-items:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-018"] *{animation:none!important;transition:none!important}}
`

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
 * Цитата из документа с окружающим контекстом и выводом, который на ней стоит.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai018({
  title = "Основание ответа",
  source = "Договор на разработку, редакция 4",
  location = "с. 7, п. 5.2",
  updated = "Обновлён 12 марта",
  before = "Стороны согласовывают состав работ приложением к договору.",
  quote = "Исполнитель передаёт исходный код в течение десяти рабочих дней с даты подписания акта приёмки, и с этого момента исключительное право переходит к заказчику в полном объёме.",
  after = "Передача оформляется отдельным актом с перечнем репозиториев.",
  claim = "Ответ утверждает, что права на код переходят после подписания акта, а не после оплаты, и опирается ровно на этот пункт. Срок передачи — десять рабочих дней.",
  claimTitle = "Как это использовано в ответе",
  confidence = "Прямая цитата, без пересказа",
  openLabel = "Открыть документ на с. 7",
  copyLabel = "Скопировать цитату",
  accent,
  background = "",
  className,
  style,
}: Ai018Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-018-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-018-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-018" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-018"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <span data-part="doc">{source}</span>
            <span data-part="tag">{location}</span>
            <span data-part="updated">{updated}</span>
          </header>

          <div data-part="panes">
            <figure>
              <blockquote>
                <span data-part="around">{before} </span>
                <mark>{quote}</mark>
                <span data-part="around"> {after}</span>
              </blockquote>
              <figcaption>
                <cite>{source}</cite> · {location}
              </figcaption>
            </figure>

            <div>
              <h3>{claimTitle}</h3>
              <p data-part="claim">{claim}</p>
              <span data-part="confidence">
                <span data-part="dot" aria-hidden="true" />
                {confidence}
              </span>
            </div>
          </div>

          <div data-part="actions">
            <button type="button" data-part="open">
              {openLabel}
            </button>
            <button type="button" data-part="copy">
              {copyLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
