import type { CSSProperties } from "react"

export type Ai020Props = {
  state?: "idle" | "listening" | "transcribing"
  title?: string
  hint?: string
  micLabel?: string
  listeningText?: string
  transcript?: string
  placeholder?: string
  keyboardText?: string
  cancelText?: string
  sendText?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: голосовой ввод как альтернатива клавиатуре, а не единственный
// путь — переключение на текст стоит рядом с микрофоном постоянно, а не
// прячется в меню: голос не всем удобен и не везде слышен. Три состояния —
// ожидание, запись и распознавание — живут в одном блоке и переключаются
// пропом state, а не отдельными экранами. Текст распознавания растёт вживую
// и объявляется aria-live, чтобы промежуточный результат был слышен и тому,
// кто не смотрит на экран.
//
// Тема берётся из color-scheme окружения через light-dark(): блок темнеет
// вместе с контекстом и не носит собственной подложки.
//
// Демонстрация интерфейса: запись звука и распознавание речи обязан
// реализовать вызывающий код.
const STYLES = `
:where([data-vibeui-block="ai-020"]){
--vibeui-ai-020-bg:transparent;
--vibeui-ai-020-card:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-ai-020-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-ai-020-muted:light-dark(oklch(0.55 0 265),oklch(0.69 0 265));
--vibeui-ai-020-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-ai-020-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.18 39.8));
--vibeui-ai-020-on-accent:oklch(0.15 0.02 39.8);
--vibeui-ai-020-listen:light-dark(oklch(0.58 0.19 39.8),oklch(0.72 0.17 39.8));
--vibeui-ai-020-listen-soft:light-dark(oklch(0.58 0.19 39.8 / 12%),oklch(0.72 0.17 39.8 / 18%));
--vibeui-ai-020-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-020"]{color-scheme:dark}
[data-vibeui-block="ai-020"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-ai-020-bg);
border:1px solid var(--vibeui-ai-020-border);border-radius:1rem;
font-family:var(--vibeui-ai-020-sans);color:var(--vibeui-ai-020-fg);
}
[data-vibeui-block="ai-020"] *{box-sizing:border-box}
[data-vibeui-block="ai-020"] h2{margin:0 0 0.125rem;font-size:0.9375rem;font-weight:700}
[data-vibeui-block="ai-020"] [data-part="lead"]{margin:0 0 0.875rem;font-size:0.75rem;color:var(--vibeui-ai-020-muted)}
[data-vibeui-block="ai-020"] [data-part="stage"]{
display:flex;flex-direction:column;align-items:center;gap:0.75rem;
padding:1.25rem 1rem;border-radius:0.875rem;background:var(--vibeui-ai-020-card);
text-align:center;
}
[data-vibeui-block="ai-020"] [data-part="mic"]{
appearance:none;cursor:pointer;border:0;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:3.5rem;height:3.5rem;border-radius:9999px;
background:var(--vibeui-ai-020-accent);color:var(--vibeui-ai-020-on-accent);
font-size:1.375rem;line-height:1;
}
[data-vibeui-block="ai-020"] [data-part="mic"][data-state="listening"]{background:var(--vibeui-ai-020-listen)}
[data-vibeui-block="ai-020"] [data-part="mic"]:focus-visible{outline:2px solid var(--vibeui-ai-020-accent);outline-offset:2px}
[data-vibeui-block="ai-020"] [data-part="ring"]{
position:relative;display:inline-flex;align-items:center;justify-content:center;
}
[data-vibeui-block="ai-020"] [data-part="ring"]::before{
content:"";position:absolute;inset:-0.5rem;border-radius:9999px;
border:2px solid var(--vibeui-ai-020-listen-soft);
}
[data-vibeui-block="ai-020"] [data-part="ring"][data-state="listening"]::before{
animation:vibeui-ai-020-pulse 1.6s ease-out infinite;
}
[data-vibeui-block="ai-020"] [data-part="status"]{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="ai-020"] [data-part="wave"]{display:flex;align-items:center;gap:0.1875rem;height:1.5rem}
[data-vibeui-block="ai-020"] [data-part="bar"]{
width:0.1875rem;border-radius:9999px;background:var(--vibeui-ai-020-listen);
height:0.375rem;
}
[data-vibeui-block="ai-020"] [data-part="wave"][data-state="listening"] [data-part="bar"]{
animation:vibeui-ai-020-wave 1s ease-in-out infinite;
}
[data-vibeui-block="ai-020"] [data-part="bar"]:nth-child(1){animation-delay:0ms;height:0.5rem}
[data-vibeui-block="ai-020"] [data-part="bar"]:nth-child(2){animation-delay:120ms;height:1rem}
[data-vibeui-block="ai-020"] [data-part="bar"]:nth-child(3){animation-delay:240ms;height:1.375rem}
[data-vibeui-block="ai-020"] [data-part="bar"]:nth-child(4){animation-delay:360ms;height:0.875rem}
[data-vibeui-block="ai-020"] [data-part="bar"]:nth-child(5){animation-delay:480ms;height:0.5rem}
[data-vibeui-block="ai-020"] [data-part="transcript"]{
margin:0;padding:0.75rem 0.875rem;width:100%;min-height:2.75rem;
border-radius:0.625rem;background:var(--vibeui-ai-020-card);
font-size:0.875rem;line-height:1.5;text-align:left;
}
[data-vibeui-block="ai-020"] [data-part="caret"]{
display:inline-block;width:0.125rem;height:1em;margin-left:0.125rem;
background:var(--vibeui-ai-020-accent);vertical-align:-0.15em;
animation:vibeui-ai-020-caret 1s step-end infinite;
}
[data-vibeui-block="ai-020"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.75rem;
}
[data-vibeui-block="ai-020"] [data-part="keyboard"]{
appearance:none;cursor:pointer;border:0;background:none;padding:0;
color:var(--vibeui-ai-020-muted);font:inherit;font-size:0.75rem;text-decoration:underline;
}
[data-vibeui-block="ai-020"] [data-part="keyboard"]:focus-visible{outline:2px solid var(--vibeui-ai-020-accent);outline-offset:2px}
[data-vibeui-block="ai-020"] [data-part="actions"]{display:flex;gap:0.5rem}
[data-vibeui-block="ai-020"] [data-part="cancel"]{
appearance:none;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-ai-020-border);background:none;color:inherit;
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="ai-020"] [data-part="send"]{
appearance:none;cursor:pointer;height:2rem;padding:0 0.875rem;border:0;border-radius:0.5rem;
background:var(--vibeui-ai-020-accent);color:var(--vibeui-ai-020-on-accent);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="ai-020"] [data-part="cancel"]:focus-visible,
[data-vibeui-block="ai-020"] [data-part="send"]:focus-visible{outline:2px solid var(--vibeui-ai-020-accent);outline-offset:2px}
@keyframes vibeui-ai-020-wave{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}
@keyframes vibeui-ai-020-pulse{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(1.35)}}
@keyframes vibeui-ai-020-caret{0%,50%{opacity:1}51%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-020"] *{animation:none!important;transition:none!important}}
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
 * Голосовой ввод запроса: микрофон с постоянным переключением на текст,
 * запись волной и распознавание строкой, растущей вживую. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Ai020({
  state = "idle",
  title = "Голосовой ввод",
  hint = "Нажмите и скажите запрос — можно вернуться к клавиатуре в любой момент.",
  micLabel = "Начать запись",
  listeningText = "Слушаю…",
  transcript = "Собери лендинг студии дизайна с формой заявки",
  placeholder = "Распознанный текст появится здесь",
  keyboardText = "Ввести текстом",
  cancelText = "Отмена",
  sendText = "Отправить",
  background = "",
  accent,
  className,
  style,
}: Ai020Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-020-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-020-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-020" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-020"
        className={className}
        style={palette}
        aria-label={title}
      >
        <h2>{title}</h2>
        <p data-part="lead">{hint}</p>

        <div data-part="stage">
          {state === "transcribing" ? (
            <p data-part="transcript" aria-live="polite">
              {transcript || placeholder}
              <span data-part="caret" aria-hidden="true" />
            </p>
          ) : (
            <>
              <span data-part="ring" data-state={state}>
                <button
                  type="button"
                  data-part="mic"
                  data-state={state}
                  aria-pressed={state === "listening"}
                  aria-label={micLabel}
                >
                  <span aria-hidden="true">{state === "listening" ? "■" : "●"}</span>
                </button>
              </span>
              <span data-part="status" aria-live="polite">
                {state === "listening" ? listeningText : micLabel}
              </span>
              {state === "listening" ? (
                <span data-part="wave" data-state={state} aria-hidden="true">
                  <span data-part="bar" />
                  <span data-part="bar" />
                  <span data-part="bar" />
                  <span data-part="bar" />
                  <span data-part="bar" />
                </span>
              ) : null}
            </>
          )}
        </div>

        <div data-part="foot">
          <button type="button" data-part="keyboard">
            {keyboardText}
          </button>
          {state === "transcribing" ? (
            <div data-part="actions">
              <button type="button" data-part="cancel">
                {cancelText}
              </button>
              <button type="button" data-part="send">
                {sendText}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
