import type { CSSProperties } from "react"

export type Ai014Segment = {
  tone: "system" | "context" | "chat" | "free"
  label: string
  tokens: number
  hint?: string
}

export type Ai014Props = {
  title?: string
  model?: string
  limit?: number
  segments?: Ai014Segment[]
  /** Строка под числом: {limit} — размер окна, {percent} — занятая доля. */
  totalTemplate?: string
  /** Подпись полосы для скринридера: {percent} — занятая доля. */
  barLabelTemplate?: string
  /** Слово перед текстом предупреждения. */
  warningTitle?: string
  warning?: string
  trimLabel?: string
  newChatLabel?: string
  accent?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Весь CSS блока живёт здесь, а не в globals.css проекта.
//
// Идея блока: объяснить, куда уходит окно контекста. Одна полоска «занято
// 82%» не помогает — непонятно, что резать. Здесь полоса собрана из долей:
// системная инструкция, файлы, переписка и остаток; у каждой доли своя
// подпись с числом токенов и человеческим объяснением.
//
// Доли рисуются grid-template-columns из процентов, а не отдельными
// абсолютно спозиционированными кусками: так они не разъезжаются при
// округлении и переносятся вместе с блоком. Числа набраны tabular-nums,
// иначе колонка значений прыгает при обновлении.
const STYLES = `
:where([data-vibeui-block="ai-014"]){
--vibeui-ai-014-bg:transparent;
--vibeui-ai-014-soft:light-dark(oklch(0.975 0 265),oklch(0.26 0 265));
--vibeui-ai-014-fg:light-dark(oklch(0.21 0 265),oklch(0.94 0 265));
--vibeui-ai-014-muted:light-dark(oklch(0.53 0 265),oklch(0.7 0 265));
--vibeui-ai-014-border:light-dark(oklch(0.91 0 265),oklch(0.37 0 265));
--vibeui-ai-014-accent:light-dark(oklch(0.52 0.17 39.8),oklch(0.74 0.14 39.8));
--vibeui-ai-014-on-accent:oklch(0.15 0.02 39.8);
--vibeui-ai-014-system:light-dark(oklch(0.62 0.13 39.8),oklch(0.7 0.13 39.8));
--vibeui-ai-014-context:light-dark(oklch(0.6 0.14 39.8),oklch(0.71 0.12 39.8));
--vibeui-ai-014-chat:light-dark(oklch(0.65 0.15 39.8),oklch(0.76 0.13 39.8));
--vibeui-ai-014-free:light-dark(oklch(0.92 0 265),oklch(0.34 0 265));
--vibeui-ai-014-warn:light-dark(oklch(0.55 0.16 55),oklch(0.78 0.13 65));
--vibeui-ai-014-sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="ai-014"]{color-scheme:dark}
[data-vibeui-block="ai-014"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
background:var(--vibeui-ai-014-bg);color:var(--vibeui-ai-014-fg);
font-family:var(--vibeui-ai-014-sans);
border:1px solid var(--vibeui-ai-014-border);border-radius:1.125rem;
}
[data-vibeui-block="ai-014"] *{box-sizing:border-box}
[data-vibeui-block="ai-014"] [data-part="shell"]{padding:1.25rem;display:grid;gap:1rem}
[data-vibeui-block="ai-014"] [data-part="head"]{display:flex;flex-wrap:wrap;align-items:baseline;gap:0.5rem}
[data-vibeui-block="ai-014"] h2{margin:0;font-size:1rem;font-weight:680;letter-spacing:-0.01em}
[data-vibeui-block="ai-014"] [data-part="model"]{
margin-left:auto;font-size:0.6875rem;color:var(--vibeui-ai-014-muted);
padding:0.125rem 0.5rem;border-radius:9999px;border:1px solid var(--vibeui-ai-014-border);
}
[data-vibeui-block="ai-014"] [data-part="total"]{
margin:0;font-size:1.75rem;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="ai-014"] [data-part="of"]{font-size:0.875rem;font-weight:500;color:var(--vibeui-ai-014-muted)}
/* Доли — колонки грида: абсолютные куски разъезжаются на округлении. */
[data-vibeui-block="ai-014"] [data-part="bar"]{
display:grid;gap:0.125rem;height:0.75rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-ai-014-free);
}
[data-vibeui-block="ai-014"] [data-part="slice"]{height:100%}
[data-vibeui-block="ai-014"] [data-tone="system"]{background:var(--vibeui-ai-014-system)}
[data-vibeui-block="ai-014"] [data-tone="context"]{background:var(--vibeui-ai-014-context)}
[data-vibeui-block="ai-014"] [data-tone="chat"]{background:var(--vibeui-ai-014-chat)}
[data-vibeui-block="ai-014"] [data-tone="free"]{background:var(--vibeui-ai-014-free)}
[data-vibeui-block="ai-014"] ul{list-style:none;margin:0;padding:0;display:grid;gap:0.4375rem}
[data-vibeui-block="ai-014"] li{
display:grid;grid-template-columns:0.625rem 1fr auto;gap:0.5rem;align-items:baseline;
padding:0.4375rem 0.5rem;border-radius:0.5rem;background:var(--vibeui-ai-014-soft);
}
[data-vibeui-block="ai-014"] [data-part="chip"]{
width:0.625rem;height:0.625rem;border-radius:0.25rem;align-self:center;
}
[data-vibeui-block="ai-014"] [data-part="name"]{font-size:0.75rem;font-weight:620}
[data-vibeui-block="ai-014"] [data-part="hint"]{
display:block;font-size:0.6875rem;font-weight:400;line-height:1.45;color:var(--vibeui-ai-014-muted);
}
[data-vibeui-block="ai-014"] [data-part="value"]{
font-size:0.75rem;font-variant-numeric:tabular-nums;color:var(--vibeui-ai-014-muted);white-space:nowrap;
}
[data-vibeui-block="ai-014"] [data-part="warn"]{
display:flex;gap:0.5rem;margin:0;padding:0.625rem 0.75rem;border-radius:0.75rem;
border:1px solid color-mix(in oklab,var(--vibeui-ai-014-warn) 45%,var(--vibeui-ai-014-border));
background:color-mix(in oklab,var(--vibeui-ai-014-warn) 8%,var(--vibeui-ai-014-bg));
font-size:0.75rem;line-height:1.55;
}
[data-vibeui-block="ai-014"] [data-part="warn"] strong{color:var(--vibeui-ai-014-warn)}
[data-vibeui-block="ai-014"] [data-part="foot"]{display:flex;flex-wrap:wrap;gap:0.5rem}
[data-vibeui-block="ai-014"] button{
appearance:none;cursor:pointer;height:2.125rem;padding:0 0.875rem;border-radius:0.6875rem;
font:inherit;font-size:0.8125rem;font-weight:640;
}
[data-vibeui-block="ai-014"] [data-part="trim"]{border:0;background:var(--vibeui-ai-014-accent);color:var(--vibeui-ai-014-on-accent)}
[data-vibeui-block="ai-014"] [data-part="fresh"]{border:1px solid var(--vibeui-ai-014-border);background:none;color:inherit}
[data-vibeui-block="ai-014"] :focus-visible{outline:2px solid var(--vibeui-ai-014-accent);outline-offset:2px}
@container (min-width: 42rem){
[data-vibeui-block="ai-014"] [data-part="shell"]{padding:1.5rem 1.75rem}
[data-vibeui-block="ai-014"] ul{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="ai-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SEGMENTS: Ai014Segment[] = [
  {
    tone: "system",
    label: "Системная инструкция",
    tokens: 1800,
    hint: "Правила проекта и формат ответа. Не режется.",
  },
  {
    tone: "context",
    label: "Файлы контекста",
    tokens: 34200,
    hint: "Бриф, гайд и выгрузка. Можно отключить лишние файлы.",
  },
  {
    tone: "chat",
    label: "Переписка",
    tokens: 68400,
    hint: "Сорок реплик. Старые сообщения свернутся первыми.",
  },
  {
    tone: "free",
    label: "Свободно",
    tokens: 23600,
    hint: "Хватит примерно на восемь длинных ответов.",
  },
]

function format(value: number) {
  return value.toLocaleString("ru-RU")
}

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)
}

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
 * Расход окна контекста долями: инструкция, файлы, переписка и остаток.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Ai014({
  title = "Окно контекста",
  model = "128 000 токенов",
  limit = 128000,
  segments = DEFAULT_SEGMENTS,
  totalTemplate = "из {limit} · {percent}%",
  barLabelTemplate = "Занято {percent} процентов окна контекста",
  warningTitle = "Внимание.",
  warning = "Свободно меньше пятой части окна. Когда место кончится, самые старые сообщения выпадут из диалога молча.",
  trimLabel = "Свернуть старые сообщения",
  newChatLabel = "Начать новый диалог",
  accent,
  background = "",
  className,
  style,
}: Ai014Props) {
  const palette = {
    ...(accent ? { "--vibeui-ai-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-ai-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const used = segments
    .filter((segment) => segment.tone !== "free")
    .reduce((sum, segment) => sum + segment.tokens, 0)
  const percent = Math.round((used / limit) * 100)
  const columns = segments
    .map((segment) => `${((segment.tokens / limit) * 100).toFixed(2)}%`)
    .join(" ")

  return (
    <>
      <style href="vibeui-ai-014" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="ai-014"
        className={className}
        style={palette}
        aria-label={title}
      >
        <div data-part="shell">
          <header data-part="head">
            <h2>{title}</h2>
            <span data-part="model">{model}</span>
          </header>

          <p data-part="total">
            {format(used)}{" "}
            <span data-part="of">
              {fill(totalTemplate, {
                limit: format(limit),
                percent: String(percent),
              })}
            </span>
          </p>

          <div
            data-part="bar"
            style={{ gridTemplateColumns: columns }}
            role="img"
            aria-label={fill(barLabelTemplate, { percent: String(percent) })}
          >
            {segments.map((segment) => (
              <span
                key={segment.label}
                data-part="slice"
                data-tone={segment.tone}
              />
            ))}
          </div>

          <ul>
            {segments.map((segment) => (
              <li key={segment.label}>
                <span
                  data-part="chip"
                  data-tone={segment.tone}
                  aria-hidden="true"
                />
                <span data-part="name">
                  {segment.label}
                  {segment.hint ? (
                    <span data-part="hint">{segment.hint}</span>
                  ) : null}
                </span>
                <span data-part="value">{format(segment.tokens)}</span>
              </li>
            ))}
          </ul>

          <p data-part="warn">
            <strong>{warningTitle}</strong>
            <span>{warning}</span>
          </p>

          <div data-part="foot">
            <button type="button" data-part="trim">
              {trimLabel}
            </button>
            <button type="button" data-part="fresh">
              {newChatLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
