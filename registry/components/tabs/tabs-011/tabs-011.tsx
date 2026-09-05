import type { ComponentProps, CSSProperties } from "react"

export type Tabs011Panel = {
  /** Кусок адреса: он попадёт в ссылку после решётки. */
  id: string
  label: string
  text: string
}

export type Tabs011Props = Omit<ComponentProps<"div">, "children" | "title"> & {
  panels?: Tabs011Panel[]
  /** Подпись полосы вкладок для скринридера. */
  groupLabel?: string
  /** Пояснение под панелью: почему адрес меняется. */
  hint?: string
  /** Показывать кусок адреса текущей вкладки: то, что уедет в ссылку. */
  showAddress?: boolean
  accent?: string
  /** Пусто — штатная палитра. */
  background?: string
}

// Идея компонента: вкладка, которую можно прислать ссылкой. Обычные вкладки
// держат состояние в памяти страницы: человек открыл «Доставку», скопировал
// адрес, отправил — и адресат попал на «Описание». Здесь переключение сделано
// якорями, а активная панель выбирается через :target, поэтому вкладка живёт
// в адресе: ссылка ведёт туда же, кнопка «назад» возвращает на прежнюю
// вкладку, а обновление страницы ничего не теряет. Первая панель показана,
// пока в адресе нет ничего: страница без решётки не должна выглядеть пустой.
const STYLES = `
:where([data-vibeui-block="tabs-011"]){
--vibeui-tabs-011-bg:transparent;
--vibeui-tabs-011-fg:light-dark(oklch(0.25 0.014 265),oklch(0.95 0.005 265));
--vibeui-tabs-011-muted:color-mix(in oklab,var(--vibeui-tabs-011-fg) 62%,transparent);
--vibeui-tabs-011-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-tabs-011-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-tabs-011-accent:light-dark(oklch(0.5 0.16 265),oklch(0.78 0.12 265));
--vibeui-tabs-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="tabs-011"]{color-scheme:dark}
[data-vibeui-block="tabs-011"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;box-sizing:border-box;
font-family:var(--vibeui-tabs-011-font);color:var(--vibeui-tabs-011-fg);
}
[data-vibeui-block="tabs-011"] *{box-sizing:border-box}
[data-vibeui-block="tabs-011"] [data-part="strip"]{
display:flex;flex-wrap:wrap;gap:0.25rem;
border-bottom:1px solid var(--vibeui-tabs-011-border);
}
[data-vibeui-block="tabs-011"] [data-part="tab"]{
position:relative;
padding:0.4375rem 0.75rem;margin-bottom:-1px;
border-bottom:2px solid transparent;
color:var(--vibeui-tabs-011-muted);
font-size:0.875rem;font-weight:600;text-decoration:none;
}
[data-vibeui-block="tabs-011"] [data-part="tab"]:hover{
background:var(--vibeui-tabs-011-hover);color:var(--vibeui-tabs-011-fg);
}
[data-vibeui-block="tabs-011"] [data-part="tab"]:focus-visible{
outline:2px solid var(--vibeui-tabs-011-accent);outline-offset:-2px;border-radius:0.375rem;
}
[data-vibeui-block="tabs-011"] [data-part="panel"]{
margin:0;font-size:0.875rem;line-height:1.5;
}
/* Панели скрыты все, кроме той, что названа в адресе. Первая показывается
   отдельным правилом, пока решётки в адресе нет вовсе. */
[data-vibeui-block="tabs-011"] [data-part="panel"]{display:none}
[data-vibeui-block="tabs-011"] [data-part="panel"]:target{display:block}
[data-vibeui-block="tabs-011"]:not(:has([data-part="panel"]:target)) [data-part="panels"] [data-part="panel"]:first-child{display:block}
[data-vibeui-block="tabs-011"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-tabs-011-muted);
}
/* Кусок адреса текущей вкладки. Показан ровно один — тем же :target, что и
   панель: иначе бейдж врал бы про ссылку, которую человек скопирует. */
[data-vibeui-block="tabs-011"] [data-part="address"]{display:flex;flex-wrap:wrap;gap:0.25rem;margin-top:-0.25rem}
[data-vibeui-block="tabs-011"] [data-part="url"]{
display:none;padding:0.0625rem 0.375rem;border-radius:0.375rem;
border:1px solid var(--vibeui-tabs-011-border);background:var(--vibeui-tabs-011-hover);
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
font-size:0.6875rem;color:var(--vibeui-tabs-011-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="tabs-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PANELS: Tabs011Panel[] = [
  {
    id: "vibeui-tabs-011-about",
    label: "Описание",
    text: "Настольная лампа с тёплым светом и поворотным основанием. Питание от сети, длина шнура 1,8 метра.",
  },
  {
    id: "vibeui-tabs-011-delivery",
    label: "Доставка",
    text: "Курьером по городу за день, в пункты выдачи — за два. Самовывоз со склада работает до девяти вечера.",
  },
  {
    id: "vibeui-tabs-011-returns",
    label: "Возврат",
    text: "Четырнадцать дней без объяснений, если сохранена упаковка. Обратную доставку оплачиваем мы.",
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
 * Вкладки в адресе: переключение якорями, ссылку можно отправить.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Tabs011({
  panels = DEFAULT_PANELS,
  groupLabel = "Разделы товара",
  hint = "Вкладка попадает в адрес: ссылку можно отправить, «назад» вернёт прежнюю.",
  showAddress = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Tabs011Props) {
  const palette = {
    ...(accent ? { "--vibeui-tabs-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-tabs-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Подсветка активной ссылки строится по тем же идентификаторам: они
  // приходят пропсом, поэтому правила собираются здесь.
  const rules = panels
    .flatMap((panel) => [
      `[data-vibeui-block="tabs-011"]:has(#${panel.id}:target) [data-part="tab"][href="#${panel.id}"]{color:var(--vibeui-tabs-011-fg);border-bottom-color:var(--vibeui-tabs-011-accent)}`,
      `[data-vibeui-block="tabs-011"]:has(#${panel.id}:target) [data-part="url"][data-for="${panel.id}"]{display:inline-block}`,
    ])
    .concat(
      `[data-vibeui-block="tabs-011"]:not(:has([data-part="panel"]:target)) [data-part="tab"]:first-of-type{color:var(--vibeui-tabs-011-fg);border-bottom-color:var(--vibeui-tabs-011-accent)}`,
      `[data-vibeui-block="tabs-011"]:not(:has([data-part="panel"]:target)) [data-part="url"]:first-of-type{display:inline-block}`,
    )
    .join("\n")

  const ids = panels.map((panel) => panel.id).join("-")

  return (
    <>
      <style href="vibeui-tabs-011" precedence="medium">
        {STYLES}
      </style>
      <style href={`vibeui-tabs-011-${ids}`} precedence="medium">
        {rules}
      </style>
      <div
        {...props}
        data-slot="tabs"
        data-vibeui-block="tabs-011"
        className={className}
        style={palette}
      >
        <nav data-part="strip" aria-label={groupLabel}>
          {panels.map((panel) => (
            <a key={panel.id} data-part="tab" href={`#${panel.id}`}>
              {panel.label}
            </a>
          ))}
        </nav>

        {showAddress ? (
          <div data-part="address" aria-hidden="true">
            {panels.map((panel) => (
              <code key={panel.id} data-part="url" data-for={panel.id}>
                #{panel.id}
              </code>
            ))}
          </div>
        ) : null}

        <div data-part="panels">
          {panels.map((panel) => (
            <p key={panel.id} id={panel.id} data-part="panel">
              {panel.text}
            </p>
          ))}
        </div>

        <p data-part="hint">{hint}</p>
      </div>
    </>
  )
}
