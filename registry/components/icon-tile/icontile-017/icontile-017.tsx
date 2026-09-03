import type { ComponentProps, CSSProperties } from "react"

export type Icontile017Props = Omit<ComponentProps<"div">, "children"> & {
  name?: string
  itemCount?: number
  modifiedLabel?: string
  tone?: "neutral" | "accent" | "success" | "warning" | "danger"
  /**
   * Шаблоны счётчика вложений по формам числа. {count} подставляется числом.
   * Русские правила используют все три ключа, английские — one и many.
   */
  countText?: Record<string, string>
  /** Пусто — подложки нет, плитка лежит прямо на фоне страницы. */
  background?: string
}

const COUNT_TEXT: Record<string, string> = {
  one: "{count} файл",
  few: "{count} файла",
  many: "{count} файлов",
}

/** Форма числительного по русским правилам: 1 файл, 3 файла, 12 файлов. */
function pluralForm(count: number): "one" | "few" | "many" {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod100 >= 11 && mod100 <= 14) return "many"
  if (mod10 === 1) return "one"
  if (mod10 >= 2 && mod10 <= 4) return "few"
  return "many"
}

function FolderIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  )
}

// Идея компонента: число вложений склоняется по русским правилам
// (1 файл / 3 файла / 12 файлов) в рантайме функцией pluralForm, а не
// зашито строкой — иначе плитка с любым count, кроме единицы, звучала бы
// неграмотно. Дата изменения — отдельная часть строки, а не общий текст:
// на узком контейнере она уходит первой через @container, счётчик вложений
// остаётся всегда, потому что он важнее конкретной даты.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее фона, а не темнее.
const STYLES = `
:where([data-vibeui-block="icontile-017"]){
container-type:inline-size;
--vibeui-icontile-017-hue:262;
--vibeui-icontile-017-chroma:0.05;
--vibeui-icontile-017-size:2.75rem;
--vibeui-icontile-017-fg:light-dark(oklch(0.26 0.014 265),oklch(0.94 0.006 265));
--vibeui-icontile-017-muted:color-mix(in oklab,var(--vibeui-icontile-017-fg) 68%,transparent);
--vibeui-icontile-017-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.011 265));
--vibeui-icontile-017-surface:transparent;
--vibeui-icontile-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="icontile-017"]{color-scheme:dark}
[data-vibeui-block="icontile-017"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:flex;align-items:center;gap:0.875rem;min-width:0;
box-sizing:border-box;padding:0.75rem 1rem;
background:var(--vibeui-icontile-017-surface);
border:1px solid var(--vibeui-icontile-017-border);border-radius:0.875rem;
font-family:var(--vibeui-icontile-017-font);
}
[data-vibeui-block="icontile-017"] [data-part="tile"]{
display:grid;place-items:center;flex:none;
width:var(--vibeui-icontile-017-size);height:var(--vibeui-icontile-017-size);
border-radius:0.75rem;
background:light-dark(oklch(0.93 var(--vibeui-icontile-017-chroma) var(--vibeui-icontile-017-hue)),oklch(0.34 var(--vibeui-icontile-017-chroma) var(--vibeui-icontile-017-hue)));
color:light-dark(oklch(0.44 calc(var(--vibeui-icontile-017-chroma) * 4) var(--vibeui-icontile-017-hue)),oklch(0.87 calc(var(--vibeui-icontile-017-chroma) * 2) var(--vibeui-icontile-017-hue)));
}
[data-vibeui-block="icontile-017"] [data-part="tile"] > svg{width:54%;height:54%}
[data-vibeui-block="icontile-017"] [data-part="text"]{
display:flex;flex-direction:column;gap:0.1875rem;min-width:0;flex:1 1 auto;
}
[data-vibeui-block="icontile-017"] [data-part="name"]{
display:block;margin:0;font-size:0.9375rem;font-weight:650;
color:var(--vibeui-icontile-017-fg);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-017"] [data-part="meta"]{
display:flex;align-items:center;gap:0.375rem;min-width:0;
font-size:0.8125rem;color:var(--vibeui-icontile-017-muted);
white-space:nowrap;overflow:hidden;
}
[data-vibeui-block="icontile-017"] [data-part="count"]{flex:none}
[data-vibeui-block="icontile-017"] [data-part="dot"]{flex:none}
[data-vibeui-block="icontile-017"] [data-part="modified"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;
}
[data-vibeui-block="icontile-017"][data-tone="neutral"]{--vibeui-icontile-017-chroma:0.015}
[data-vibeui-block="icontile-017"][data-tone="success"]{--vibeui-icontile-017-hue:152}
[data-vibeui-block="icontile-017"][data-tone="warning"]{--vibeui-icontile-017-hue:75}
[data-vibeui-block="icontile-017"][data-tone="danger"]{--vibeui-icontile-017-hue:25}
@container (max-width: 220px){
[data-vibeui-block="icontile-017"] [data-part="dot"],
[data-vibeui-block="icontile-017"] [data-part="modified"]{display:none}
}
`

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
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
 * Плитка папки: иконка, название, число вложений со склонением и дата
 * изменения. Дата уходит первой на узком контейнере, счётчик остаётся.
 * Один файл, ноль зависимостей, клиентского JS нет.
 */
export function Icontile017({
  name = "Дизайн-макеты",
  itemCount = 12,
  modifiedLabel = "Изменено 3 дня назад",
  tone = "accent",
  countText = COUNT_TEXT,
  background = "",
  className,
  style,
  ...props
}: Icontile017Props) {
  const clamped = Math.max(0, itemCount)
  const form = pluralForm(clamped)
  const template = countText[form] ?? countText.many ?? COUNT_TEXT[form]
  const palette = {
    ...(background
      ? {
          "--vibeui-icontile-017-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-icontile-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="icon-tile"
        data-vibeui-block="icontile-017"
        data-tone={tone}
        className={className}
        style={palette}
      >
        <span data-part="tile">
          <FolderIcon />
        </span>
        <span data-part="text">
          <span data-part="name">{name}</span>
          <span data-part="meta">
            <span data-part="count">
              {template.replace("{count}", String(clamped))}
            </span>
            <span data-part="dot" aria-hidden="true">
              ·
            </span>
            <span data-part="modified">{modifiedLabel}</span>
          </span>
        </span>
      </div>
    </>
  )
}
