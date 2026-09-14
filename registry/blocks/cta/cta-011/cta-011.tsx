import type { CSSProperties } from "react"

export type Cta011Props = {
  title?: string
  description?: string
  devTitle?: string
  devText?: string
  command?: string
  devLinkLabel?: string
  devLinkHref?: string
  teamTitle?: string
  teamText?: string
  teamActionLabel?: string
  teamActionHref?: string
  /** Пусто — подложки нет, секция лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Два пути: панель для разработчиков с командой npx и панель для команд
// с кнопкой демо. Аудитории входят по-разному, и смешивать их входы в одну
// кнопку — терять обе: разработчику нужна команда, руководителю — человек.
// Код-плашка тёмная в обеих темах: терминал не бывает светло-серым.
const STYLES = `
:where([data-vibeui-block="cta-011"]){
--vibeui-cta-011-bg:transparent;
--vibeui-cta-011-ink:light-dark(oklch(0.2 0 0),oklch(0.95 0 0));
--vibeui-cta-011-muted:light-dark(oklch(0.45 0 0),oklch(0.7 0 0));
--vibeui-cta-011-border:light-dark(oklch(0.88 0 0),oklch(0.34 0 0));
--vibeui-cta-011-card:light-dark(oklch(1 0 0),oklch(0.22 0 0));
--vibeui-cta-011-accent:light-dark(oklch(0.287 0 0),oklch(0.892 0 0));
--vibeui-cta-011-button:light-dark(oklch(0.31 0 0),oklch(0.892 0 0));
--vibeui-cta-011-button-ink:oklch(from var(--vibeui-cta-011-button) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-cta-011-code-bg:oklch(0.2 0 0);
--vibeui-cta-011-code-ink:oklch(0.93 0 0);
--vibeui-cta-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-cta-011-mono:ui-monospace,"Cascadia Code","Source Code Pro",Menlo,Consolas,monospace;
--vibeui-cta-011-dur-2:180ms;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="cta-011"]{color-scheme:dark}
[data-vibeui-block="cta-011"]{
min-width:min(100%,16rem);
display:block;background:var(--vibeui-cta-011-bg);color:var(--vibeui-cta-011-ink);
font-family:var(--vibeui-cta-011-font);
}
[data-vibeui-block="cta-011"] [data-part="shell"]{
max-width:70rem;margin:0 auto;padding:3rem 1.25rem;
}
[data-vibeui-block="cta-011"] [data-part="title"]{
margin:0 auto 0.75rem;max-width:24ch;text-align:center;
font-size:clamp(1.625rem,5cqi,2.5rem);line-height:1.1;letter-spacing:-0.025em;font-weight:700;
}
[data-vibeui-block="cta-011"] [data-part="description"]{
margin:0 auto 2.25rem;max-width:52ch;text-align:center;
color:var(--vibeui-cta-011-muted);font-size:1rem;line-height:1.6;
}
[data-vibeui-block="cta-011"] [data-part="grid"]{display:grid;gap:1rem}
[data-vibeui-block="cta-011"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.75rem;min-inline-size:0;
padding:1.75rem;border:1px solid var(--vibeui-cta-011-border);border-radius:1.125rem;
background:var(--vibeui-cta-011-card);
}
[data-vibeui-block="cta-011"] [data-part="panel"][data-variant="team"]{
background:color-mix(in oklab,var(--vibeui-cta-011-accent) 10%,var(--vibeui-cta-011-card));
border-color:color-mix(in oklab,var(--vibeui-cta-011-accent) 35%,var(--vibeui-cta-011-border));
}
[data-vibeui-block="cta-011"] [data-part="panel-title"]{
margin:0;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="cta-011"] [data-part="panel-text"]{
margin:0;flex:1 1 auto;color:var(--vibeui-cta-011-muted);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="cta-011"] [data-part="command"]{
margin:0;padding:0.875rem 1rem;border-radius:0.625rem;
background:var(--vibeui-cta-011-code-bg);color:var(--vibeui-cta-011-code-ink);
font-family:var(--vibeui-cta-011-mono);font-size:0.8125rem;line-height:1.5;
overflow-x:auto;white-space:nowrap;
}
[data-vibeui-block="cta-011"] [data-part="prompt"]{
color:var(--vibeui-cta-011-accent);user-select:none;margin-right:0.5ch;
}
[data-vibeui-block="cta-011"] [data-part="link"]{
align-self:flex-start;color:var(--vibeui-cta-011-accent);
font-size:0.875rem;font-weight:600;text-decoration:none;
border-bottom:1px solid color-mix(in oklab,var(--vibeui-cta-011-accent) 40%,transparent);
}
[data-vibeui-block="cta-011"] [data-part="link"]:hover{border-bottom-color:var(--vibeui-cta-011-accent)}
[data-vibeui-block="cta-011"] [data-part="link"]:focus-visible,
[data-vibeui-block="cta-011"] [data-part="action"]:focus-visible{
outline:2px solid var(--vibeui-cta-011-accent);outline-offset:2px;
}
[data-vibeui-block="cta-011"] [data-part="action"]{
align-self:flex-start;display:inline-block;
padding:0.75rem 1.5rem;border-radius:999px;
background:var(--vibeui-cta-011-button);color:var(--vibeui-cta-011-button-ink);
font-size:0.9375rem;font-weight:650;text-decoration:none;
transition:filter var(--vibeui-cta-011-dur-2) ease,transform var(--vibeui-cta-011-dur-2) ease;
}
[data-vibeui-block="cta-011"] [data-part="action"]:hover{filter:brightness(1.05);transform:translateY(-1px)}
@container (min-width: 44rem){
[data-vibeui-block="cta-011"] [data-part="shell"]{padding:4.5rem 2rem}
[data-vibeui-block="cta-011"] [data-part="grid"]{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem}
[data-vibeui-block="cta-011"] [data-part="panel"]{padding:2rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="cta-011"] *{animation:none!important;transition:none!important}}
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

/** Два пути к продукту: команда npx для разработчиков и демо для команд. */
export function Cta011({
  title = "Начните так, как удобно вам",
  description = "Разработчик ставит секцию одной командой. Руководителю проще посмотреть живое демо и задать вопросы — оба входа настоящие.",
  devTitle = "Для разработчиков",
  devText = "Секция приезжает обычным файлом в ваш проект. Никакого SDK, никакой подписки на пакет — команда и всё.",
  command = "npx shadcn@latest add @vibeui/cta-011",
  devLinkLabel = "Читать документацию",
  devLinkHref = "#docs",
  teamTitle = "Для команд",
  teamText = "Покажем, как каталог встраивается в ваш процесс: от выбора секции до готовой страницы у клиента.",
  teamActionLabel = "Запросить демо",
  teamActionHref = "#demo",
  background = "",
  accent,
  className,
  style,
}: Cta011Props) {
  const palette = {
    ...(accent
      ? {
          "--vibeui-cta-011-accent": accent,
          "--vibeui-cta-011-button": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-cta-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-cta-011" precedence="medium">
        {STYLES}
      </style>
      <section
        data-vibeui-block="cta-011"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <h2 data-part="title">{title}</h2>
          <p data-part="description">{description}</p>
          <div data-part="grid">
            <article data-part="panel" data-variant="dev">
              <h3 data-part="panel-title">{devTitle}</h3>
              <p data-part="panel-text">{devText}</p>
              <pre data-part="command">
                <code>
                  <span data-part="prompt" aria-hidden="true">
                    $
                  </span>
                  {command}
                </code>
              </pre>
              <a data-part="link" href={devLinkHref}>
                {devLinkLabel}
              </a>
            </article>
            <article data-part="panel" data-variant="team">
              <h3 data-part="panel-title">{teamTitle}</h3>
              <p data-part="panel-text">{teamText}</p>
              <a data-part="action" href={teamActionHref}>
                {teamActionLabel}
              </a>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
