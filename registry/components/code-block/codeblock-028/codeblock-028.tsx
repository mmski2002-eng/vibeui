import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Codeblock028Props = Omit<
  ComponentProps<"figure">,
  "children" | "title"
> & {
  title?: string
  /** Что показывать на вкладке результата: живой пример, а не картинка. */
  children?: ReactNode
  code?: string
  resultLabel?: string
  codeLabel?: string
  /** Имя радиогруппы: своё на каждый блок, если их несколько на странице. */
  group?: string
  /** Открывать сразу вкладку кода. */
  codeFirst?: boolean
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: пример и его исходник в одном месте. В документации это
// самая частая пара, и обычно она сделана на клиентском состоянии — здесь
// переключение держат радиокнопки, а панель выбирает :has() по отмеченной,
// поэтому вкладки работают до гидратации и переживают отключённый JS.
// Результат — настоящий узел из children, а не скриншот: он живёт по тем же
// правилам темы, что и остальная страница.
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченной вкладки.
const STYLES = `
:where([data-vibeui-block="codeblock-028"]){
--vibeui-codeblock-028-bg:transparent;
--vibeui-codeblock-028-fg:light-dark(oklch(0.27 0 265),oklch(0.94 0 265));
--vibeui-codeblock-028-muted:color-mix(in oklab,var(--vibeui-codeblock-028-fg) 66%,transparent);
--vibeui-codeblock-028-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 13%));
--vibeui-codeblock-028-head:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 6%));
--vibeui-codeblock-028-chip:light-dark(oklch(1 0 0),oklch(1 0 0 / 14%));
--vibeui-codeblock-028-accent:light-dark(oklch(0.5 0.16 265),oklch(0.8 0.12 265));
--vibeui-codeblock-028-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-codeblock-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="codeblock-028"]{color-scheme:dark}
[data-vibeui-block="codeblock-028"]{
display:block;width:100%;box-sizing:border-box;margin:0;overflow:hidden;
border:1px solid var(--vibeui-codeblock-028-border);border-radius:0.875rem;
background:var(--vibeui-codeblock-028-bg);color:var(--vibeui-codeblock-028-fg);
font-family:var(--vibeui-codeblock-028-font);
}
[data-vibeui-block="codeblock-028"] *{box-sizing:border-box}
[data-vibeui-block="codeblock-028"] [data-part="head"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem 0.75rem;
padding:0.4375rem 0.5rem 0.4375rem 0.875rem;
background:var(--vibeui-codeblock-028-head);
border-bottom:1px solid var(--vibeui-codeblock-028-border);
font-size:0.75rem;color:var(--vibeui-codeblock-028-muted);
}
[data-vibeui-block="codeblock-028"] [data-part="name"]{
flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-family:var(--vibeui-codeblock-028-mono);
}
/* Переключатель на радиокнопках: состояние держит форма, а не JS. */
[data-vibeui-block="codeblock-028"] [data-part="tabs"]{
display:flex;flex:none;gap:0.125rem;padding:0.125rem;border-radius:0.5rem;
background:light-dark(oklch(0 0 0 / 6%),oklch(1 0 0 / 8%));
}
[data-vibeui-block="codeblock-028"] [data-part="tabs"] label{
cursor:pointer;padding:0.1875rem 0.625rem;border-radius:0.375rem;
font-size:0.75rem;font-weight:600;color:var(--vibeui-codeblock-028-muted);
}
[data-vibeui-block="codeblock-028"] [data-part="tabs"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
[data-vibeui-block="codeblock-028"] [data-part="tabs"] label:has(input:checked){
background:var(--vibeui-codeblock-028-chip);color:var(--vibeui-codeblock-028-fg);
box-shadow:0 1px 2px light-dark(oklch(0 0 0 / 12%),oklch(0 0 0 / 40%));
}
[data-vibeui-block="codeblock-028"] [data-part="tabs"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-codeblock-028-accent);outline-offset:2px;
}
/* Обе панели лежат в разметке всегда: так поиск по странице находит код,
   даже когда открыт результат. */
[data-vibeui-block="codeblock-028"] [data-part="result"],
[data-vibeui-block="codeblock-028"] [data-part="source"]{display:none}
[data-vibeui-block="codeblock-028"]:has([data-tab="result"]:checked) [data-part="result"]{
display:flex;align-items:center;justify-content:center;
min-height:6.5rem;padding:1.25rem;
}
[data-vibeui-block="codeblock-028"]:has([data-tab="code"]:checked) [data-part="source"]{display:block}
[data-vibeui-block="codeblock-028"] pre{margin:0;padding:0.875rem;overflow-x:auto}
[data-vibeui-block="codeblock-028"] code{
display:block;min-width:max-content;
font-family:var(--vibeui-codeblock-028-mono);
font-size:0.8125rem;line-height:1.7;white-space:pre;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="codeblock-028"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CODE = `<Button variant="primary" size="lg">
  Продолжить
</Button>`

/** Пример по умолчанию: кнопка, у которой видно, что она живая. */
const DEMO_BUTTON_STYLE: CSSProperties = {
  appearance: "none",
  border: 0,
  cursor: "pointer",
  minHeight: "2.375rem",
  padding: "0.5rem 1.25rem",
  borderRadius: "0.625rem",
  background: "var(--vibeui-codeblock-028-accent)",
  color: "light-dark(oklch(1 0 0),oklch(0.2 0 265))",
  font: "inherit",
  fontSize: "0.9375rem",
  fontWeight: 650,
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
 * Пример и его исходник в одном блоке: переключение вкладок без JS.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Codeblock028({
  title = "components/ui/button.tsx",
  children,
  code = DEFAULT_CODE,
  resultLabel = "Результат",
  codeLabel = "Код",
  group = "vibeui-codeblock-028",
  codeFirst = false,
  background = "",
  className,
  style,
  ...props
}: Codeblock028Props) {
  const palette = {
    ...(background
      ? {
          "--vibeui-codeblock-028-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-codeblock-028" precedence="medium">
        {STYLES}
      </style>
      <figure
        {...props}
        data-slot="code-block"
        data-vibeui-block="codeblock-028"
        className={className}
        style={palette}
      >
        <figcaption data-part="head">
          <span data-part="name">{title}</span>
          <form data-part="tabs" role="group" aria-label={title}>
            <label>
              <input
                type="radio"
                name={group}
                data-tab="result"
                defaultChecked={!codeFirst}
              />
              {resultLabel}
            </label>
            <label>
              <input
                type="radio"
                name={group}
                data-tab="code"
                defaultChecked={codeFirst}
              />
              {codeLabel}
            </label>
          </form>
        </figcaption>

        <div data-part="result">
          {children ?? (
            <button type="button" style={DEMO_BUTTON_STYLE}>
              Продолжить
            </button>
          )}
        </div>

        <div data-part="source">
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </figure>
    </>
  )
}
