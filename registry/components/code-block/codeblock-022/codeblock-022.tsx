import type { CSSProperties } from "react"

export type Codeblock022Variable = {
  key: string
  value: string
}

export type Codeblock022Props = {
  file?: string
  revealAll?: boolean
  variables?: Codeblock022Variable[]
  /** Подпись блока для скринридера, {file} — имя файла. */
  blockLabel?: string
  /** Подпись общего переключателя в шапке. */
  revealLabel?: string
  /** Подпись переключателя строки, {key} — имя переменной. */
  revealRowLabel?: string
  /** Подписи области видимости: ключи public и server. */
  scopeText?: Record<string, string>
  /** Подпись в подвале, {example} — место для имени файла-примера. */
  footText?: string
  /** Файл-пример, который подставляется в подпись подвала. */
  exampleFile?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: показать состав .env, не показывая сами значения. Каждая
// строка закрыта точками и открывается своим чекбоксом, а общий переключатель
// в шапке открывает все сразу — всё на :has(), без клиентского состояния.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у блока
// нет, значки области видимости подобраны отдельно для светлой и тёмной ветки.
const STYLES = `
:where([data-vibeui-block="codeblock-022"]){
--vibeui-codeblock-022-bg:transparent;
--vibeui-codeblock-022-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-codeblock-022-chip:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 8%));
--vibeui-codeblock-022-chip-on:light-dark(oklch(0.72 0.12 250 / 26%),oklch(0.6 0.12 250 / 22%));
--vibeui-codeblock-022-public-bg:light-dark(oklch(0.8 0.12 75 / 30%),oklch(0.6 0.12 75 / 20%));
--vibeui-codeblock-022-fg:light-dark(oklch(0.26 0.016 275),oklch(0.93 0.008 275));
--vibeui-codeblock-022-muted:color-mix(in oklab,var(--vibeui-codeblock-022-fg) 68%,transparent);
--vibeui-codeblock-022-border:light-dark(oklch(0 0 0 / 12%),oklch(1 0 0 / 12%));
--vibeui-codeblock-022-key:light-dark(oklch(0.48 0.13 250),oklch(0.82 0.12 250));
--vibeui-codeblock-022-value:light-dark(oklch(0.45 0.13 145),oklch(0.85 0.12 145));
--vibeui-codeblock-022-mask:light-dark(oklch(0.62 0.02 275),oklch(0.6 0.02 275));
--vibeui-codeblock-022-public:light-dark(oklch(0.52 0.13 75),oklch(0.84 0.13 75));
--vibeui-codeblock-022-accent:light-dark(oklch(0.48 0.13 250),oklch(0.8 0.12 250));
--vibeui-codeblock-022-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-022"]{color-scheme:dark}
[data-vibeui-block="codeblock-022"]{
display:flex;flex-direction:column;
width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-022-border);border-radius:0.75rem;
background:var(--vibeui-codeblock-022-bg);color:var(--vibeui-codeblock-022-fg);
font-family:var(--vibeui-codeblock-022-font);
}
[data-vibeui-block="codeblock-022"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.75rem;
background:var(--vibeui-codeblock-022-head);
border-bottom:1px solid var(--vibeui-codeblock-022-border);
font-family:var(--vibeui-codeblock-022-mono);font-size:0.75rem;
color:var(--vibeui-codeblock-022-muted);
}
[data-vibeui-block="codeblock-022"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
border:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="codeblock-022"] [data-part="sr"]{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
border:0;clip-path:inset(50%);overflow:hidden;white-space:nowrap;
}
[data-vibeui-block="codeblock-022"] label{
cursor:pointer;display:inline-flex;align-items:center;gap:0.375rem;
padding:0.1875rem 0.5rem;border-radius:999px;
font-family:var(--vibeui-codeblock-022-font);font-size:0.6875rem;font-weight:650;
color:var(--vibeui-codeblock-022-muted);background:var(--vibeui-codeblock-022-chip);
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="codeblock-022"] label:hover{color:var(--vibeui-codeblock-022-fg)}
[data-vibeui-block="codeblock-022"] label:has(input:checked){
color:var(--vibeui-codeblock-022-accent);background:var(--vibeui-codeblock-022-chip-on);
}
[data-vibeui-block="codeblock-022"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-codeblock-022-accent);outline-offset:2px;
}
[data-vibeui-block="codeblock-022"] ul{
margin:0;padding:0.375rem 0;list-style:none;
}
[data-vibeui-block="codeblock-022"] li{
display:flex;align-items:center;gap:0.5rem;
padding:0.25rem 0.75rem;min-height:1.875rem;
font-family:var(--vibeui-codeblock-022-mono);font-size:0.8125rem;
}
[data-vibeui-block="codeblock-022"] [data-part="key"]{color:var(--vibeui-codeblock-022-key)}
[data-vibeui-block="codeblock-022"] [data-part="pair"]{
display:flex;align-items:center;gap:0;flex:1 1 auto;min-width:0;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="codeblock-022"] [data-part="mask"]{
color:var(--vibeui-codeblock-022-mask);letter-spacing:0.1em;
user-select:none;-webkit-user-select:none;
}
[data-vibeui-block="codeblock-022"] [data-part="real"]{
display:none;color:var(--vibeui-codeblock-022-value);
}
/* Значение открывает либо свой чекбокс строки, либо общий в шапке: два
   независимых источника одного состояния, оба — чистый CSS. */
[data-vibeui-block="codeblock-022"] li:has([data-part="eye"]:checked) [data-part="mask"],
[data-vibeui-block="codeblock-022"]:has([data-part="master"]:checked) [data-part="mask"]{display:none}
[data-vibeui-block="codeblock-022"] li:has([data-part="eye"]:checked) [data-part="real"],
[data-vibeui-block="codeblock-022"]:has([data-part="master"]:checked) [data-part="real"]{display:inline}
[data-vibeui-block="codeblock-022"] [data-part="scope"]{
margin-inline-start:auto;flex:none;
padding:0.0625rem 0.4375rem;border-radius:999px;
font-family:var(--vibeui-codeblock-022-font);font-size:0.6875rem;font-weight:650;
background:var(--vibeui-codeblock-022-chip);color:var(--vibeui-codeblock-022-muted);
}
[data-vibeui-block="codeblock-022"] [data-part="scope"][data-public="true"]{
color:var(--vibeui-codeblock-022-public);background:var(--vibeui-codeblock-022-public-bg);
}
[data-vibeui-block="codeblock-022"] [data-part="foot"]{
margin:0;padding:0.5rem 0.75rem;
border-top:1px solid var(--vibeui-codeblock-022-border);
font-size:0.6875rem;line-height:1.4;color:var(--vibeui-codeblock-022-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-022"] *{animation:none!important;transition:none!important}}
`

const VARIABLES: Codeblock022Variable[] = [
  { key: "DATABASE_URL", value: "postgres://vibeui:s3cret@db:5432/app" },
  { key: "RESEND_API_KEY", value: "re_9fJk2Lm0_QpZx4Nb" },
  { key: "NEXT_PUBLIC_SITE_URL", value: "https://vibeui.dev" },
  { key: "NEXT_PUBLIC_ANALYTICS_ID", value: "vb-2026-08" },
]

const SCOPE_TEXT: Record<string, string> = {
  public: "в браузер",
  server: "только сервер",
}

const FOOT_TEXT =
  "Маскировка визуальная: значения лежат в разметке страницы. Настоящие секреты сюда не кладут — только примеры из {example}."

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

/** Список переменных окружения со скрытыми значениями. */
export function Codeblock022({
  file = ".env.local",
  revealAll = false,
  variables = VARIABLES,
  blockLabel = "Переменные окружения {file}",
  revealLabel = "Показать значения",
  revealRowLabel = "Показать значение {key}",
  scopeText = SCOPE_TEXT,
  footText = FOOT_TEXT,
  exampleFile = ".env.example",
  background = "",
  className,
  style,
  ...props
}: Codeblock022Props) {
  const [footStart, footEnd] = footText.split("{example}")
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-022" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-022"
        className={className}
        style={palette}
        aria-label={blockLabel.replace("{file}", file)}
      >
        <header data-part="head">
          <span>{file}</span>
          <label>
            <input
              type="checkbox"
              data-part="master"
              defaultChecked={revealAll}
            />
            {revealLabel}
          </label>
        </header>
        <ul>
          {variables.map((variable) => {
            const isPublic = variable.key.startsWith("NEXT_PUBLIC_")

            return (
              <li key={variable.key}>
                <span data-part="pair">
                  <span data-part="key">{variable.key}</span>=
                  <span data-part="mask" aria-hidden="true">
                    ••••••••••••
                  </span>
                  <span data-part="real">{variable.value}</span>
                </span>
                <span data-part="scope" data-public={isPublic || undefined}>
                  {scopeText[isPublic ? "public" : "server"] ??
                    SCOPE_TEXT[isPublic ? "public" : "server"]}
                </span>
                <label>
                  <input type="checkbox" data-part="eye" />
                  <span data-part="sr">
                    {revealRowLabel.replace("{key}", variable.key)}
                  </span>
                  <span aria-hidden="true">◉</span>
                </label>
              </li>
            )
          })}
        </ul>
        <p data-part="foot">
          {footStart}
          {footEnd === undefined ? null : <code>{exampleFile}</code>}
          {footEnd}
        </p>
      </section>
    </>
  )
}
