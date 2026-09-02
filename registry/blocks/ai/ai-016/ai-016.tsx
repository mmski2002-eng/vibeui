import type { CSSProperties } from "react"

export type Ai016Line = {
  kind: "add" | "remove" | "keep"
  text: string
}

export type Ai016Props = {
  title?: string
  intent?: string
  target?: string
  effects?: string[]
  /** Заголовок над списком последствий. */
  effectsTitle?: string
  diff?: Ai016Line[]
  /** Заголовок над дифом. */
  diffTitle?: string
  confirmLabel?: string
  editLabel?: string
  rejectLabel?: string
  rememberLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: подтверждение действия, у которого есть последствия. Человек
// соглашается не на «продолжить», а на конкретную правку, поэтому здесь
// сначала показано, что именно изменится, и только потом кнопки.
//
// Строки дифа помечены не только цветом, но и знаком «+» / «−» в отдельной
// колонке: цвет не переживает печать и не читается вслух. Отклонение стоит
// рядом с подтверждением и не спрятано: кнопка отказа, которую надо искать,
// превращает подтверждение в формальность. Чекбокс «не спрашивать снова»
// намеренно последний — он опасен, и до него нужно дочитать.
const STYLES = `
:where([data-vibeui-block="ai-016"]){
--vibeui-ai-016-bg:transparent;
--vibeui-ai-016-soft:light-dark(oklch(0.975 0.004 265),oklch(0.26 0.012 265));
--vibeui-ai-016-fg:light-dark(oklch(0.21 0.014 265),oklch(0.94 0.005 265));
--vibeui-ai-016-muted:light-dark(oklch(0.53 0.014 265),oklch(0.7 0.012 265));
--vibeui-ai-016-border:light-dark(oklch(0.91 0.006 265),oklch(0.37 0.012 265));
--vibeui-ai-016-accent:light-dark(oklch(0.52 0.17 268),oklch(0.74 0.14 268));
--vibeui-ai-016-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 268));
--vibeui-ai-016-add:light-dark(oklch(0.56 0.13 152),oklch(0.74 0.13 152));
--vibeui-ai-016-remove:light-dark(oklch(0.57 0.18 25),oklch(0.72 0.15 25));
--vibeui-ai-016-shadow:light-dark(oklch(0.21 0.014 265 / 6%),oklch(0 0 0 / 32%));
--vibeui-ai-016-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-ai-016-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="ai-016"]{
background:var(--vibeui-ai-016-bg);color:var(--vibeui-ai-016-fg);
font-family:var(--vibeui-ai-016-sans);
border:1px solid var(--vibeui-ai-016-border);border-radius:1.125rem;
box-shadow:0 1px 2px var(--vibeui-ai-016-shadow);
}
[data-vibeui-block="ai-016"] *{box-sizing:border-box}
[data-vibeui-block="ai-016"] [data-part="shell"]{padding:1.25rem;display:grid;gap:0.9375rem}
[data-vibeui-block="ai-016"] [data-part="head"]{display:flex;align-items:flex-start;gap:0.625rem}
[data-vibeui-block="ai-016"] [data-part="mark"]{
flex:none;display:inline-flex;align-items:center;justify-content:center;
width:1.875rem;height:1.875rem;border-radius:0.6875rem;
background:color-mix(in oklab,var(--vibeui-ai-016-accent) 14%,transparent);
color:var(--vibeui-ai-016-accent);font-size:0.9375rem;font-weight:700;
}
[data-vibeui-block="ai-016"] h2{margin:0;font-size:0.9375rem;font-weight:680;line-height:1.35}
[data-vibeui-block="ai-016"] [data-part="target"]{
display:inline-block;margin-top:0.25rem;padding:0.0625rem 0.4375rem;border-radius:0.375rem;
background:var(--vibeui-ai-016-soft);border:1px solid var(--vibeui-ai-016-border);
font-family:var(--vibeui-ai-016-mono);font-size:0.6875rem;color:var(--vibeui-ai-016-muted);
}
[data-vibeui-block="ai-016"] [data-part="intent"]{
margin:0;max-width:64ch;font-size:0.8125rem;line-height:1.6;color:var(--vibeui-ai-016-muted);
}
[data-vibeui-block="ai-016"] h3{
margin:0 0 0.4375rem;font-size:0.6875rem;font-weight:650;
letter-spacing:0.07em;text-transform:uppercase;color:var(--vibeui-ai-016-muted);
}
[data-vibeui-block="ai-016"] [data-part="effects"]{list-style:none;margin:0;padding:0;display:grid;gap:0.3125rem}
[data-vibeui-block="ai-016"] [data-part="effects"] li{
display:flex;gap:0.5rem;font-size:0.8125rem;line-height:1.5;
}
[data-vibeui-block="ai-016"] [data-part="effects"] li::before{
content:"";flex:none;width:0.375rem;height:0.375rem;margin-top:0.5rem;
border-radius:9999px;background:var(--vibeui-ai-016-accent);
}
/* Знак в отдельной колонке: цвет не переживает печать и не читается вслух. */
[data-vibeui-block="ai-016"] [data-part="diff"]{
margin:0;border-radius:0.75rem;overflow:hidden;
border:1px solid var(--vibeui-ai-016-border);background:var(--vibeui-ai-016-soft);
font-family:var(--vibeui-ai-016-mono);font-size:0.75rem;line-height:1.7;
}
[data-vibeui-block="ai-016"] [data-part="line"]{
display:grid;grid-template-columns:1.25rem 1fr;gap:0.375rem;
padding:0 0.625rem;overflow-wrap:anywhere;
}
[data-vibeui-block="ai-016"] [data-part="sign"]{text-align:center;color:var(--vibeui-ai-016-muted)}
[data-vibeui-block="ai-016"] [data-kind="add"]{background:color-mix(in oklab,var(--vibeui-ai-016-add) 12%,transparent)}
[data-vibeui-block="ai-016"] [data-kind="add"] [data-part="sign"]{color:var(--vibeui-ai-016-add)}
[data-vibeui-block="ai-016"] [data-kind="remove"]{background:color-mix(in oklab,var(--vibeui-ai-016-remove) 11%,transparent)}
[data-vibeui-block="ai-016"] [data-kind="remove"] [data-part="sign"]{color:var(--vibeui-ai-016-remove)}
[data-vibeui-block="ai-016"] [data-part="actions"]{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center}
[data-vibeui-block="ai-016"] button{
appearance:none;cursor:pointer;height:2.25rem;padding:0 1rem;border-radius:0.75rem;
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="ai-016"] [data-part="confirm"]{border:0;background:var(--vibeui-ai-016-accent);color:var(--vibeui-ai-016-on-accent)}
[data-vibeui-block="ai-016"] [data-part="edit"]{border:1px solid var(--vibeui-ai-016-border);background:none;color:inherit}
/* Отказ рядом и виден: спрятанный отказ делает подтверждение формальностью. */
[data-vibeui-block="ai-016"] [data-part="reject"]{
border:1px solid color-mix(in oklab,var(--vibeui-ai-016-remove) 40%,var(--vibeui-ai-016-border));
background:none;color:var(--vibeui-ai-016-remove);
}
[data-vibeui-block="ai-016"] [data-part="remember"]{
display:flex;align-items:center;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-ai-016-muted);cursor:pointer;
}
[data-vibeui-block="ai-016"] input[type="checkbox"]{width:0.875rem;height:0.875rem;margin:0;accent-color:var(--vibeui-ai-016-accent)}
[data-vibeui-block="ai-016"] :focus-visible{outline:2px solid var(--vibeui-ai-016-accent);outline-offset:2px}
@container (min-width: 42rem){
[data-vibeui-block="ai-016"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-016"] [data-part="panes"]{display:grid;grid-template-columns:1fr 1.15fr;gap:1.125rem;align-items:start}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_EFFECTS = [
  "Перепишет заголовок и подзаголовок в hero-002",
  "Тронет один файл, остальные экраны не изменятся",
  "Правка обратима: старый текст останется в истории ветки",
]

const DEFAULT_DIFF: Ai016Line[] = [
  { kind: "keep", text: '<h1 data-part="title">' },
  { kind: "remove", text: "  Инновационные решения для вашего бизнеса" },
  { kind: "add", text: "  Проект дома за четыре недели" },
  { kind: "keep", text: "</h1>" },
  { kind: "remove", text: "  Комплексный подход и индивидуальный сервис" },
  { kind: "add", text: "  Планировка, смета и надзор — от одной команды" },
]

const SIGNS = { add: "+", remove: "−", keep: " " }

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
 * Подтверждение действия ассистента: последствия, диф правки и три кнопки.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai016({
  title = "Ассистент предлагает переписать заголовок",
  intent = "Текущий заголовок не называет услугу и не отвечает на вопрос «что вы делаете». Предлагаю заменить его и подзаголовок на конкретную формулировку из брифа.",
  target = "app/page.tsx · hero-002",
  effects = DEFAULT_EFFECTS,
  effectsTitle = "Что произойдёт",
  diff = DEFAULT_DIFF,
  diffTitle = "Правка",
  confirmLabel = "Применить правку",
  editLabel = "Изменить текст",
  rejectLabel = "Отклонить",
  rememberLabel = "Больше не спрашивать про правку текстов",
  accent,
  background = "",
  className,
  style,
}: Ai016Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-ai-016" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-016"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <span data-part="mark" aria-hidden="true">
              ?
            </span>
            <div>
              <h2>{title}</h2>
              <span data-part="target">{target}</span>
            </div>
          </header>

          <p data-part="intent">{intent}</p>

          <div data-part="panes">
            <div>
              <h3>{effectsTitle}</h3>
              <ul data-part="effects">
                {effects.map((effect) => (
                  <li key={effect}>{effect}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>{diffTitle}</h3>
              <div data-part="diff">
                {diff.map((line, index) => (
                  <div
                    key={`${index}-${line.text}`}
                    data-part="line"
                    data-kind={line.kind}
                  >
                    <span data-part="sign" aria-hidden="true">
                      {SIGNS[line.kind]}
                    </span>
                    <span>{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div data-part="actions">
            <button type="button" data-part="confirm">
              {confirmLabel}
            </button>
            <button type="button" data-part="edit">
              {editLabel}
            </button>
            <button type="button" data-part="reject">
              {rejectLabel}
            </button>
          </div>

          <label data-part="remember">
            <input type="checkbox" name="ai-016-remember" />
            {rememberLabel}
          </label>
        </div>
      </section>
    </>
  )
}
