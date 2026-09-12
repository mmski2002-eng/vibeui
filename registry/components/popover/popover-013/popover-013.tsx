import type { ComponentProps, CSSProperties } from "react"

export type Popover013Shortcut = {
  /** Сочетание: части перечисляются через пробел и рисуются клавишами. */
  keys: string
  text: string
}

export type Popover013Group = {
  title: string
  items: Popover013Shortcut[]
}

export type Popover013Props = Omit<
  ComponentProps<"div">,
  "children" | "title"
> & {
  label?: string
  title?: string
  groups?: Popover013Group[]
  /** Сноска внизу: где ещё искать сочетания. */
  footnote?: string
  /** Показать панель раскрытой и в потоке: витрине и документации нужна открытая. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: список горячих клавиш там, где он нужен, — рядом с
// работой, а не на отдельной странице справки. Сочетания набраны элементом
// kbd, а не картинками: они переживают увеличение шрифта, копируются текстом
// и читаются скринридером как клавиши. Группы названы по задачам, а не по
// модификаторам: человек ищет «как отправить», а не «что делает Cmd».
// Панель серверная — клавиши не меняются, состояния здесь нет вовсе.
const STYLES = `
:where([data-vibeui-block="popover-013"]){
--vibeui-popover-013-surface:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-popover-013-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-popover-013-muted:color-mix(in oklab,var(--vibeui-popover-013-fg) 64%,transparent);
--vibeui-popover-013-border:light-dark(oklch(0.89 0 265),oklch(0.36 0 265));
--vibeui-popover-013-key:light-dark(oklch(0.97 0 265),oklch(1 0 0 / 8%));
--vibeui-popover-013-accent:light-dark(oklch(0.275 0 0),oklch(0.91 0 0));
--vibeui-popover-013-shadow:light-dark(oklch(0.2 0 265 / 24%),oklch(0 0 0 / 60%));
--vibeui-popover-013-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-popover-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
anchor-name:--vibeui-popover-013-anchor;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="popover-013"]{color-scheme:dark}
[data-vibeui-block="popover-013"]{
display:inline-block;font-family:var(--vibeui-popover-013-font);color:var(--vibeui-popover-013-fg);
}
[data-vibeui-block="popover-013"] *{box-sizing:border-box}
[data-vibeui-block="popover-013"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
min-height:2.25rem;padding:0.375rem 0.75rem;
border:1px solid var(--vibeui-popover-013-border);border-radius:0.625rem;
background:var(--vibeui-popover-013-surface);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
}
[data-vibeui-block="popover-013"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-popover-013-accent);outline-offset:2px}
[data-vibeui-block="popover-013"] [popover]{
position:fixed;margin:0;padding:0.75rem;
width:19rem;max-width:calc(100vw - 1.5rem);
border:1px solid var(--vibeui-popover-013-border);border-radius:0.75rem;
background:var(--vibeui-popover-013-surface);color:var(--vibeui-popover-013-fg);
box-shadow:0 18px 44px -26px var(--vibeui-popover-013-shadow);
position-anchor:--vibeui-popover-013-anchor;inset:auto;
top:anchor(bottom);left:anchor(left);margin-top:0.5rem;
}
@supports not (anchor-name: --a){
[data-vibeui-block="popover-013"] [popover]{position:fixed;inset:0;margin:auto}
}
[data-vibeui-block="popover-013"] [data-part="head"]{
margin:0 0 0.5rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="popover-013"] [data-part="group"]{margin:0 0 0.625rem}
[data-vibeui-block="popover-013"] [data-part="group"]:last-of-type{margin-bottom:0}
[data-vibeui-block="popover-013"] [data-part="caption"]{
margin:0 0 0.25rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-popover-013-muted);
}
[data-vibeui-block="popover-013"] dl{
display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.75rem;margin:0;
align-items:center;
}
[data-vibeui-block="popover-013"] dt{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
font-size:0.8125rem;
}
[data-vibeui-block="popover-013"] dd{margin:0;display:flex;gap:0.1875rem;justify-content:flex-end}
/* Клавиши набраны kbd, а не картинками: переживают увеличение шрифта,
   копируются текстом и читаются как клавиши. */
[data-vibeui-block="popover-013"] kbd{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.375rem;padding:0.0625rem 0.3125rem;
border:1px solid var(--vibeui-popover-013-border);
border-bottom-width:2px;border-radius:0.3125rem;
background:var(--vibeui-popover-013-key);
font-family:var(--vibeui-popover-013-mono);font-size:0.6875rem;line-height:1.4;
}
[data-vibeui-block="popover-013"] [data-part="foot"]{
margin:0.625rem 0 0;padding-top:0.5rem;
border-top:1px solid var(--vibeui-popover-013-border);
font-size:0.75rem;line-height:1.4;color:var(--vibeui-popover-013-muted);
}
/* Раскрытая панель на месте: атрибут popover прячет её правилом браузера,
   а это правило той же специфичности его переопределяет и возвращает панель
   в поток. Так её показывают на витрине и в документации, без верхнего слоя.
   Только пока popover закрыт: у открытого положение задаёт верхний слой,
   и static отправил бы панель в левый верхний угол экрана. */
[data-vibeui-block="popover-013"][data-open] [popover]:not(:popover-open){
display:block;position:static;inset:auto;margin:0.5rem 0 0;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="popover-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_GROUPS: Popover013Group[] = [
  {
    title: "Письмо",
    items: [
      { keys: "Ctrl Enter", text: "Отправить" },
      { keys: "Ctrl S", text: "Сохранить черновик" },
      { keys: "Esc", text: "Свернуть окно" },
    ],
  },
  {
    title: "Список",
    items: [
      { keys: "J", text: "Следующее письмо" },
      { keys: "K", text: "Предыдущее письмо" },
      { keys: "E", text: "Убрать в архив" },
    ],
  },
]

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
 * Горячие клавиши во всплывающей панели: сочетания клавишами, группы по задачам.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Popover013({
  label = "Горячие клавиши",
  title = "Что можно нажать",
  groups = DEFAULT_GROUPS,
  footnote = "Полный список — в справке, раздел «Клавиатура».",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Popover013Props) {
  const palette = {
    ...(accent ? { "--vibeui-popover-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-popover-013-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-popover-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="popover"
        data-vibeui-block="popover-013"
        data-open={defaultOpen || undefined}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="trigger"
          popoverTarget="vibeui-popover-013-panel"
        >
          {label}
        </button>

        <div id="vibeui-popover-013-panel" popover="auto" aria-label={title}>
          <p data-part="head">{title}</p>

          {groups.map((group) => (
            <section key={group.title} data-part="group">
              <p data-part="caption">{group.title}</p>
              {/* Описание и сочетание — пара, поэтому dl: связь приходит от
                  разметки, а не от расположения в двух колонках. */}
              <dl>
                {group.items.map((item) => (
                  <div key={item.keys} style={{ display: "contents" }}>
                    <dt>{item.text}</dt>
                    <dd>
                      {item.keys.split(" ").map((key) => (
                        <kbd key={key}>{key}</kbd>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          <p data-part="foot">{footnote}</p>
        </div>
      </div>
    </>
  )
}
