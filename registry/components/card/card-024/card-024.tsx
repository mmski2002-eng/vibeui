import type { ComponentProps, CSSProperties, ReactNode } from "react"

export type Card024Tint = "neutral" | "accent"

export type Card024Props = Omit<ComponentProps<"aside">, "title"> & {
  title?: string
  text?: string
  /** Подкраска плашки: нейтральная карточка или лёгкая заливка акцентом. */
  tint?: Card024Tint
  /** Действия под текстом: кнопка, ссылки, форма. */
  children?: ReactNode
  /** Строка под действиями: «отвечаем за день». */
  note?: string
  accent?: string
  /** Цвет текста. Пусто — чернильный по color-scheme окружения. */
  ink?: string
  /** Цвет подложки страницы, от которого считаются плашка и приглушённые тона. */
  background?: string
}

// Идея компонента: плашка «не нашли ответ — напишите», которая стоит рядом
// с основным содержимым и держит следующий шаг в поле зрения. Заголовок,
// одна фраза, слот для действий и строка-обещание под ними. Плашка нарочно
// тихая: нейтральная карточка или лёгкая подкраска акцентом, не сплошная
// заливка — иначе она спорит с кнопкой внутри.
const STYLES = `
:where([data-vibeui-block="card-024"]){
--vibeui-card-024-bg:light-dark(#ffffff,#1a1a1a);
--vibeui-card-024-fg:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-024-accent:light-dark(#1a1a1a,#f2f2f2);
--vibeui-card-024-muted:color-mix(in oklab,var(--vibeui-card-024-fg) 60%,var(--vibeui-card-024-bg));
--vibeui-card-024-line:color-mix(in oklab,var(--vibeui-card-024-fg) 12%,transparent);
--vibeui-card-024-card:light-dark(color-mix(in oklab,var(--vibeui-card-024-fg) 3%,var(--vibeui-card-024-bg)),color-mix(in oklab,var(--vibeui-card-024-fg) 7%,var(--vibeui-card-024-bg)));
--vibeui-card-024-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="card-024"]{color-scheme:dark}
[data-vibeui-block="card-024"]{
width:100%;min-width:min(100%,14rem);box-sizing:border-box;
padding:1.5rem;border-radius:1.125rem;
border:1px solid var(--vibeui-card-024-line);
background:var(--vibeui-card-024-card);color:var(--vibeui-card-024-fg);
font-family:var(--vibeui-card-024-font);font-size:0.9375rem;line-height:1.55;
}
[data-vibeui-block="card-024"][data-tint="accent"]{
border-color:color-mix(in oklab,var(--vibeui-card-024-accent) 25%,var(--vibeui-card-024-line));
background:color-mix(in oklab,var(--vibeui-card-024-accent) 10%,var(--vibeui-card-024-card));
}
[data-vibeui-block="card-024"] *{box-sizing:border-box}
[data-vibeui-block="card-024"] [data-part="title"]{margin:0 0 0.5rem;font-size:1.125rem;font-weight:700;letter-spacing:-0.01em;line-height:1.25}
[data-vibeui-block="card-024"] [data-part="text"]{margin:0;color:var(--vibeui-card-024-muted)}
[data-vibeui-block="card-024"] [data-part="actions"]{display:grid;gap:0.5rem;justify-items:start;margin-top:1.25rem}
[data-vibeui-block="card-024"] [data-part="note"]{margin:0.75rem 0 0;color:var(--vibeui-card-024-muted);font-size:0.8125rem;line-height:1.5}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-024"] *{animation:none!important;transition:none!important}}
`

/**
 * Плашка «не нашли ответ»: заголовок, фраза, слот действий и строка-обещание.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card024({
  title = "Не нашли свой вопрос?",
  text = "Напишите нам — разберём ваш случай и добавим ответ в список, чтобы следующему было проще.",
  tint = "neutral",
  children,
  note = "Отвечаем в течение рабочего дня.",
  accent,
  ink = "Плашка «не нашли ответ»",
  background = "Плашка «не нашли ответ»",
  className,
  style,
  ...props
}: Card024Props) {
  const palette = {
    ...(accent ? { "--vibeui-card-024-accent": accent } : null),
    ...(ink ? { "--vibeui-card-024-fg": ink } : null),
    ...(background ? { "--vibeui-card-024-bg": background } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-024" precedence="medium">
        {STYLES}
      </style>
      <aside
        aria-label={title}
        {...props}
        data-slot="card"
        data-vibeui-block="card-024"
        data-tint={tint}
        className={className}
        style={palette}
      >
        <h3 data-part="title">{title}</h3>
        {text ? <p data-part="text">{text}</p> : null}
        {children ? <div data-part="actions">{children}</div> : null}
        {note ? <p data-part="note">{note}</p> : null}
      </aside>
    </>
  )
}
