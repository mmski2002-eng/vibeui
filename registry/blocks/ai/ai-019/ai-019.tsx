import type { CSSProperties } from "react"

export type Ai019Example = {
  kind: string
  text: string
}

export type Ai019Props = {
  greeting?: string
  lede?: string
  examples?: Ai019Example[]
  placeholder?: string
  sendLabel?: string
  limits?: string[]
  limitsTitle?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: первый экран чата, на котором нечего читать и не с чего
// начать. Вместо списка возможностей («умею писать тексты») здесь готовые
// запросы целиком: их можно нажать и сразу увидеть ответ, а не сочинять
// формулировку с нуля.
//
// Примеры — кнопки внутри формы: с клавиатуры они проходятся до поля
// ввода, а не после него, потому что порядок обхода совпадает с порядком
// в разметке. Рядом честный список того, чего ассистент не умеет: узнать
// об ограничении из неудачного ответа дороже, чем прочитать строку здесь.
const STYLES = `
:where([data-vibeui-block="ai-019"]){
--vibeui-ai-019-bg:oklch(0.99 0.003 265);
--vibeui-ai-019-card:oklch(1 0 0);
--vibeui-ai-019-fg:oklch(0.2 0.014 265);
--vibeui-ai-019-muted:oklch(0.53 0.014 265);
--vibeui-ai-019-border:oklch(0.91 0.006 265);
--vibeui-ai-019-accent:oklch(0.53 0.18 272);
--vibeui-ai-019-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-019"]{
background:var(--vibeui-ai-019-bg);color:var(--vibeui-ai-019-fg);
font-family:var(--vibeui-ai-019-sans);
border:1px solid var(--vibeui-ai-019-border);border-radius:1.25rem;
}
[data-vibeui-block="ai-019"] *{box-sizing:border-box}
[data-vibeui-block="ai-019"] [data-part="shell"]{
padding:2rem 1.25rem;display:grid;gap:1.25rem;max-width:56rem;margin:0 auto;
}
[data-vibeui-block="ai-019"] [data-part="intro"]{display:grid;gap:0.5rem;justify-items:center;text-align:center}
[data-vibeui-block="ai-019"] [data-part="mark"]{
display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;border-radius:0.875rem;
background:var(--vibeui-ai-019-accent);color:oklch(1 0 0);
font-size:0.875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="ai-019"] h2{
margin:0;font-size:clamp(1.25rem,3.4cqi,1.875rem);line-height:1.2;
letter-spacing:-0.02em;font-weight:690;
}
[data-vibeui-block="ai-019"] [data-part="lede"]{
margin:0;max-width:46ch;font-size:0.875rem;line-height:1.6;color:var(--vibeui-ai-019-muted);
}
[data-vibeui-block="ai-019"] [data-part="examples"]{display:grid;gap:0.5rem}
/* Пример — кнопка: нажал и увидел ответ, а не сочиняй формулировку с нуля. */
[data-vibeui-block="ai-019"] [data-part="example"]{
appearance:none;cursor:pointer;text-align:left;display:grid;gap:0.25rem;
padding:0.75rem 0.875rem;border-radius:0.875rem;
border:1px solid var(--vibeui-ai-019-border);background:var(--vibeui-ai-019-card);
color:inherit;font:inherit;
transition:border-color .14s ease,transform .14s ease;
}
[data-vibeui-block="ai-019"] [data-part="example"]:hover{
border-color:color-mix(in oklab,var(--vibeui-ai-019-accent) 45%,var(--vibeui-ai-019-border));
transform:translateY(-1px);
}
[data-vibeui-block="ai-019"] [data-part="kind"]{
font-size:0.625rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-ai-019-accent);
}
[data-vibeui-block="ai-019"] [data-part="text"]{font-size:0.8125rem;line-height:1.5}
[data-vibeui-block="ai-019"] form{
display:flex;align-items:center;gap:0.5rem;
padding:0.4375rem 0.4375rem 0.4375rem 0.875rem;border-radius:0.9375rem;
background:var(--vibeui-ai-019-card);border:1px solid var(--vibeui-ai-019-border);
}
[data-vibeui-block="ai-019"] form:focus-within{
border-color:var(--vibeui-ai-019-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-ai-019-accent) 18%,transparent);
}
[data-vibeui-block="ai-019"] input[type="text"]{
flex:1 1 auto;min-width:0;border:0;background:none;color:inherit;
font:inherit;font-size:0.875rem;padding:0.5rem 0;
}
[data-vibeui-block="ai-019"] input[type="text"]:focus{outline:none}
[data-vibeui-block="ai-019"] button[type="submit"]{
appearance:none;cursor:pointer;flex:none;border:0;
height:2.25rem;padding:0 1rem;border-radius:0.6875rem;
background:var(--vibeui-ai-019-accent);color:oklch(1 0 0);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-019"] [data-part="limits"]{
display:grid;gap:0.3125rem;padding-top:0.875rem;
border-top:1px solid var(--vibeui-ai-019-border);
}
[data-vibeui-block="ai-019"] h3{
margin:0;font-size:0.6875rem;font-weight:650;
letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-ai-019-muted);
}
[data-vibeui-block="ai-019"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.25rem}
[data-vibeui-block="ai-019"] li{
display:flex;gap:0.5rem;font-size:0.75rem;line-height:1.5;color:var(--vibeui-ai-019-muted);
}
[data-vibeui-block="ai-019"] li::before{
content:"";flex:none;width:0.625rem;height:1px;margin-top:0.5625rem;
background:var(--vibeui-ai-019-muted);
}
[data-vibeui-block="ai-019"] :focus-visible{outline:2px solid var(--vibeui-ai-019-accent);outline-offset:2px}
@container (min-width: 42rem){
[data-vibeui-block="ai-019"] [data-part="shell"]{padding:2.75rem 2rem}
[data-vibeui-block="ai-019"] [data-part="examples"]{grid-template-columns:1fr 1fr}
[data-vibeui-block="ai-019"] ul{grid-template-columns:1fr 1fr;gap:0.25rem 1.25rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-019"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EXAMPLES: Ai019Example[] = [
  {
    kind: "Собрать",
    text: "Собери лендинг студии: обещание, три преимущества, тарифы и форма заявки.",
  },
  {
    kind: "Переписать",
    text: "Перепиши заголовок так, чтобы в нём было одно обещание и ни одного «инновационный».",
  },
  {
    kind: "Объяснить",
    text: "Объясни, чем отличаются блоки pricing-001 и pricing-003 и когда брать второй.",
  },
  {
    kind: "Проверить",
    text: "Проверь страницу на доступность: фокус, контраст и порядок заголовков.",
  },
]

const DEFAULT_LIMITS = [
  "Не знает событий после обучения — свежие данные приложите файлом",
  "Не открывает ссылки сам, содержимое нужно вставить в запрос",
  "Не хранит переписку между сессиями, важное сохраняйте себе",
]

/**
 * Пустой экран чата: приветствие, готовые примеры запросов и поле ввода.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai019({
  greeting = "С чего начнём?",
  lede = "Нажмите готовый запрос или напишите свой. Ассистент отвечает по каталогу блоков и по файлам, которые вы добавите.",
  examples = DEFAULT_EXAMPLES,
  placeholder = "Опишите задачу своими словами",
  sendLabel = "Спросить",
  limits = DEFAULT_LIMITS,
  limitsTitle = "Чего ассистент не умеет",
  accent,
  className,
  style,
}: Ai019Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-019-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-019" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-019"
        className={className}
        style={palette}
        aria-label={greeting}
      >
        <div data-part="shell">
          <div data-part="intro">
            <span data-part="mark" aria-hidden="true">
              AI
            </span>
            <h2>{greeting}</h2>
            <p data-part="lede">{lede}</p>
          </div>

          <div data-part="examples">
            {examples.map((example) => (
              <button key={example.text} type="button" data-part="example">
                <span data-part="kind">{example.kind}</span>
                <span data-part="text">{example.text}</span>
              </button>
            ))}
          </div>

          <form>
            <input
              type="text"
              name="ai-019-prompt"
              placeholder={placeholder}
              aria-label={placeholder}
            />
            <button type="submit">{sendLabel}</button>
          </form>

          <div data-part="limits">
            <h3>{limitsTitle}</h3>
            <ul>
              {limits.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
