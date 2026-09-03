import type { ComponentProps, CSSProperties } from "react"

export type Sidebar011Section = {
  id: string
  /** Короткая подпись под значком в полосе. */
  label: string
  /** Две буквы вместо иконочного пакета. */
  short: string
  items: string[]
}

export type Sidebar011Props = Omit<ComponentProps<"nav">, "children"> & {
  sections?: Sidebar011Section[]
  /** Какой раздел открыт при первом показе. */
  currentId?: string
  activeLabel?: string
  railLabel?: string
  /** Имя радиогруппы: своё на каждый блок, если их несколько на странице. */
  group?: string
  accent?: string
  /** Пусто — подложки нет, меню лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: два уровня навигации рядом, а не один поверх другого.
// Слева узкая полоса разделов, справа — пункты выбранного: так устроены
// почта, мессенджеры и панели с большим числом экранов. Переключение держат
// радиокнопки, панель выбирает :has() по отмеченной, поэтому оба уровня
// работают до гидратации и без JS. Все панели остаются в разметке: поиск по
// странице должен находить пункт, даже если его раздел сейчас не открыт.
//
// Радиогруппа лежит в собственной <form>: одинаковое имя в двух блоках на
// одной странице иначе объединило бы их в одну группу, и первый блок
// остался бы без отмеченного раздела.
const STYLES = `
:where([data-vibeui-block="sidebar-011"]){
--vibeui-sidebar-011-bg:transparent;
--vibeui-sidebar-011-fg:light-dark(oklch(0.27 0.014 265),oklch(0.94 0.006 265));
--vibeui-sidebar-011-muted:color-mix(in oklab,var(--vibeui-sidebar-011-fg) 62%,transparent);
--vibeui-sidebar-011-border:light-dark(oklch(0 0 0 / 11%),oklch(1 0 0 / 12%));
--vibeui-sidebar-011-rail:light-dark(oklch(0 0 0 / 4%),oklch(1 0 0 / 5%));
--vibeui-sidebar-011-hover:light-dark(oklch(0 0 0 / 5%),oklch(1 0 0 / 7%));
--vibeui-sidebar-011-accent:light-dark(oklch(0.5 0.16 265),oklch(0.8 0.12 265));
--vibeui-sidebar-011-on-accent:oklch(from var(--vibeui-sidebar-011-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-sidebar-011-active:color-mix(in oklab,var(--vibeui-sidebar-011-accent) 14%,transparent);
--vibeui-sidebar-011-radius:0.5rem;
--vibeui-sidebar-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="sidebar-011"]{color-scheme:dark}
[data-vibeui-block="sidebar-011"]{
display:flex;align-items:stretch;
width:100%;max-width:19rem;box-sizing:border-box;
border:1px solid var(--vibeui-sidebar-011-border);border-radius:0.75rem;overflow:hidden;
background:var(--vibeui-sidebar-011-bg);color:var(--vibeui-sidebar-011-fg);
font-family:var(--vibeui-sidebar-011-font);
}
[data-vibeui-block="sidebar-011"] *{box-sizing:border-box}
[data-vibeui-block="sidebar-011"] [data-part="rail"]{
display:flex;flex-direction:column;gap:0.25rem;flex:none;
padding:0.5rem 0.375rem;
background:var(--vibeui-sidebar-011-rail);
border-inline-end:1px solid var(--vibeui-sidebar-011-border);
}
[data-vibeui-block="sidebar-011"] [data-part="rail"] label{
display:flex;flex-direction:column;align-items:center;gap:0.1875rem;
cursor:pointer;width:3.25rem;padding:0.375rem 0.125rem;
border-radius:var(--vibeui-sidebar-011-radius);
font-size:0.625rem;color:var(--vibeui-sidebar-011-muted);text-align:center;
}
[data-vibeui-block="sidebar-011"] [data-part="rail"] label:hover{background:var(--vibeui-sidebar-011-hover)}
[data-vibeui-block="sidebar-011"] [data-part="rail"] input{
position:absolute;width:1px;height:1px;margin:-1px;padding:0;
overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0;
}
/* Значок раздела — две буквы: иконочный пакет ради семи квадратов не нужен. */
[data-vibeui-block="sidebar-011"] [data-part="mark"]{
display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.5rem;
background:light-dark(oklch(1 0 0 / 70%),oklch(1 0 0 / 10%));
border:1px solid var(--vibeui-sidebar-011-border);
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="sidebar-011"] [data-part="rail"] label:has(input:checked){
color:var(--vibeui-sidebar-011-fg);
}
[data-vibeui-block="sidebar-011"] [data-part="rail"] label:has(input:checked) [data-part="mark"]{
background:var(--vibeui-sidebar-011-accent);
border-color:transparent;
color:var(--vibeui-sidebar-011-on-accent);
}
[data-vibeui-block="sidebar-011"] [data-part="rail"] label:has(input:focus-visible){
outline:2px solid var(--vibeui-sidebar-011-accent);outline-offset:2px;
}
[data-vibeui-block="sidebar-011"] [data-part="panel"]{
flex:1;min-width:0;padding:0.625rem;
}
[data-vibeui-block="sidebar-011"] [data-part="pane"]{display:none}
[data-vibeui-block="sidebar-011"] [data-part="title"]{
display:block;padding:0 0.5rem 0.375rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-sidebar-011-muted);
}
[data-vibeui-block="sidebar-011"] ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:0.125rem}
[data-vibeui-block="sidebar-011"] [data-part="link"]{
display:block;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
padding:0.4375rem 0.5rem;border-radius:var(--vibeui-sidebar-011-radius);
color:inherit;font-size:0.875rem;text-decoration:none;
}
[data-vibeui-block="sidebar-011"] [data-part="link"]:hover{background:var(--vibeui-sidebar-011-hover)}
[data-vibeui-block="sidebar-011"] [data-part="link"][aria-current="page"]{
background:var(--vibeui-sidebar-011-active);font-weight:650;
}
[data-vibeui-block="sidebar-011"] [data-part="link"]:focus-visible{
outline:2px solid var(--vibeui-sidebar-011-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="sidebar-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Sidebar011Section[] = [
  {
    id: "work",
    label: "Работа",
    short: "РБ",
    items: ["Входящие", "Задачи", "Согласования", "Архив"],
  },
  {
    id: "shop",
    label: "Магазин",
    short: "МГ",
    items: ["Заказы", "Каталог", "Промокоды", "Возвраты"],
  },
  {
    id: "team",
    label: "Люди",
    short: "ЛД",
    items: ["Участники", "Роли", "Приглашения"],
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
 * Двухуровневое меню: полоса разделов слева, пункты выбранного справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Sidebar011({
  sections = DEFAULT_SECTIONS,
  currentId = "shop",
  activeLabel = "Заказы",
  railLabel = "Разделы",
  group = "vibeui-sidebar-011",
  accent,
  background = "",
  className,
  style,
  ...props
}: Sidebar011Props) {
  const palette = {
    ...(accent ? { "--vibeui-sidebar-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-sidebar-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Правила показа панелей строятся по тем же идентификаторам, что и
  // радиокнопки: разделы приходят пропсом, поэтому селекторы собираются здесь.
  // Ключ стиля — набор разделов: одинаковые наборы делят одну вставку.
  const ids = sections.map((section) => section.id).join("-")
  const rules = sections
    .map(
      (section) =>
        `[data-vibeui-block="sidebar-011"]:has([data-section="${section.id}"]:checked) [data-pane="${section.id}"]{display:block}`,
    )
    .join("\n")

  return (
    <>
      <style href="vibeui-sidebar-011" precedence="medium">
        {STYLES}
      </style>
      <style href={`vibeui-sidebar-011-${ids}`} precedence="medium">
        {rules}
      </style>
      <nav
        {...props}
        data-slot="sidebar"
        data-vibeui-block="sidebar-011"
        aria-label={railLabel}
        className={className}
        style={palette}
      >
        <form data-part="rail" role="group" aria-label={railLabel}>
          {sections.map((section) => (
            <label key={section.id}>
              <input
                type="radio"
                name={group}
                data-section={section.id}
                defaultChecked={section.id === currentId}
              />
              <span data-part="mark" aria-hidden="true">
                {section.short}
              </span>
              {section.label}
            </label>
          ))}
        </form>

        <div data-part="panel">
          {sections.map((section) => (
            // Панели остаются в разметке всегда: поиск по странице должен
            // находить пункт и тогда, когда его раздел не открыт.
            <div key={section.id} data-part="pane" data-pane={section.id}>
              <span data-part="title">{section.label}</span>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      data-part="link"
                      href="#"
                      aria-current={item === activeLabel ? "page" : undefined}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </>
  )
}
