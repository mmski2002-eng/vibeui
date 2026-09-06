import type { CSSProperties } from "react"

type Navbar010Category = {
  label: string
  href: string
}

export type Navbar010Props = {
  brand?: string
  categories?: Navbar010Category[]
  searchPlaceholder?: string
  cartCount?: number
  cartTotal?: string
  accountLabel?: string
  accountHref?: string
  deliveryNote?: string
  /** Подпись кнопки поиска: компонент несёт русскую. */
  findLabel?: string
  /** Подпись поля поиска для скринридера: компонент несёт русскую. */
  searchLabel?: string
  /** Подпись корзины; {count} и {total} подставляют число товаров и сумму. */
  cartLabel?: string
  /** Подпись списка категорий для скринридера: компонент несёт русскую. */
  navLabel?: string
  /** Пусто — подложки нет, блок лежит прямо на фоне страницы. */
  background?: string
  accent?: string
  className?: string
  style?: CSSProperties
}

// Шапка магазина. Три вещи, за которыми сюда приходят, стоят в одном ряду:
// поиск, аккаунт и корзина с числом товаров и суммой. Сумма выводится рядом
// со счётчиком намеренно — она отвечает на вопрос «сколько я уже набрал»
// без перехода в корзину. Категории живут во втором ряду с прокруткой.
//
// Тема берётся из color-scheme окружения через light-dark(): шапка темнеет
// вместе с контекстом и не носит собственного фона.
const STYLES = `
:where([data-vibeui-block="navbar-010"]){
--vibeui-navbar-010-bg:transparent;
--vibeui-navbar-010-ink:light-dark(oklch(0.22 0.012 60),oklch(0.94 0.006 60));
--vibeui-navbar-010-muted:light-dark(oklch(0.53 0.012 60),oklch(0.71 0.012 60));
--vibeui-navbar-010-border:light-dark(oklch(0.9 0.008 60),oklch(0.35 0.012 60));
--vibeui-navbar-010-accent:light-dark(oklch(0.62 0.19 39.8),oklch(0.72 0.17 39.8));
--vibeui-navbar-010-accent-fg:oklch(0.15 0.02 39.8);
--vibeui-navbar-010-soft:light-dark(oklch(0.97 0.008 60),oklch(0.27 0.012 60));
--vibeui-navbar-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="navbar-010"]{color-scheme:dark}
[data-vibeui-block="navbar-010"]{
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);
display:block;background:var(--vibeui-navbar-010-bg);color:var(--vibeui-navbar-010-ink);
border-bottom:1px solid var(--vibeui-navbar-010-border);
font-family:var(--vibeui-navbar-010-font);
}
[data-vibeui-block="navbar-010"] [data-part="shell"]{
display:grid;grid-template-columns:auto 1fr;align-items:center;gap:0.625rem 0.75rem;
max-width:84rem;margin:0 auto;padding:0.75rem 1rem;
}
[data-vibeui-block="navbar-010"] [data-part="brand"]{
display:inline-flex;align-items:center;gap:0.5rem;
color:inherit;text-decoration:none;font-size:1.0625rem;font-weight:750;letter-spacing:-0.025em;
}
[data-vibeui-block="navbar-010"] [data-part="mark"]{
width:1.75rem;height:1.75rem;border-radius:0.5rem;flex:none;
background:var(--vibeui-navbar-010-accent);
clip-path:polygon(0 22%,50% 0,100% 22%,100% 100%,0 100%);
}
[data-vibeui-block="navbar-010"] [data-part="search"]{grid-column:1 / -1;display:flex;gap:0.375rem}
[data-vibeui-block="navbar-010"] [data-part="input"]{
flex:1 1 auto;min-width:0;height:2.5rem;padding:0 0.875rem;
border:1px solid var(--vibeui-navbar-010-border);border-radius:0.625rem;
background:var(--vibeui-navbar-010-soft);color:inherit;font:inherit;font-size:0.9375rem;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-010"] [data-part="input"]:focus{
outline:none;background:var(--vibeui-navbar-010-bg);border-color:var(--vibeui-navbar-010-accent);
}
[data-vibeui-block="navbar-010"] [data-part="find"]{
appearance:none;cursor:pointer;flex:none;height:2.5rem;padding:0 1rem;border:0;border-radius:0.625rem;
background:var(--vibeui-navbar-010-accent);color:var(--vibeui-navbar-010-accent-fg);
font:inherit;font-size:0.875rem;font-weight:620;
}
[data-vibeui-block="navbar-010"] [data-part="side"]{
justify-self:end;display:flex;align-items:center;gap:0.5rem;
}
[data-vibeui-block="navbar-010"] [data-part="account"]{
display:none;align-items:center;gap:0.4375rem;height:2.5rem;padding:0 0.75rem;border-radius:0.625rem;
color:var(--vibeui-navbar-010-muted);text-decoration:none;font-size:0.875rem;font-weight:540;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-010"] [data-part="account"]:hover{color:var(--vibeui-navbar-010-ink);background:var(--vibeui-navbar-010-soft)}
[data-vibeui-block="navbar-010"] [data-part="cart"]{
position:relative;display:inline-flex;align-items:center;gap:0.5rem;height:2.5rem;padding:0 0.875rem;
border:1px solid var(--vibeui-navbar-010-border);border-radius:0.625rem;
color:inherit;text-decoration:none;
transition:border-color .16s ease;
}
[data-vibeui-block="navbar-010"] [data-part="cart"]:hover{border-color:var(--vibeui-navbar-010-accent)}
[data-vibeui-block="navbar-010"] [data-part="basket"]{
position:relative;width:1.125rem;height:1rem;flex:none;
border:1.5px solid currentColor;border-radius:0 0 0.3125rem 0.3125rem;
}
[data-vibeui-block="navbar-010"] [data-part="basket"]::before{
content:"";position:absolute;left:50%;top:-0.5rem;translate:-50% 0;
width:0.625rem;height:0.5rem;border:1.5px solid currentColor;border-bottom:0;border-radius:0.375rem 0.375rem 0 0;
}
[data-vibeui-block="navbar-010"] [data-part="count"]{
position:absolute;top:-0.4375rem;left:1.5rem;
min-width:1.125rem;height:1.125rem;padding:0 0.25rem;border-radius:999px;
display:grid;place-items:center;
background:var(--vibeui-navbar-010-accent);color:var(--vibeui-navbar-010-accent-fg);
font-size:0.6875rem;font-weight:750;line-height:1;
}
[data-vibeui-block="navbar-010"] [data-part="total"]{display:none;font-size:0.875rem;font-weight:640;white-space:nowrap}
[data-vibeui-block="navbar-010"] [data-part="rail"]{
grid-column:1 / -1;display:flex;align-items:center;gap:0.375rem;
padding-top:0.5rem;border-top:1px solid var(--vibeui-navbar-010-border);
overflow-x:auto;scrollbar-width:none;
}
[data-vibeui-block="navbar-010"] [data-part="rail"]::-webkit-scrollbar{display:none}
[data-vibeui-block="navbar-010"] [data-part="rail"] a{
flex:none;padding:0.3125rem 0.625rem;border-radius:0.5rem;
color:var(--vibeui-navbar-010-muted);text-decoration:none;white-space:nowrap;
font-size:0.875rem;font-weight:520;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="navbar-010"] [data-part="rail"] a:hover{color:var(--vibeui-navbar-010-ink);background:var(--vibeui-navbar-010-soft)}
[data-vibeui-block="navbar-010"] [data-part="delivery"]{
grid-column:1 / -1;margin:0;color:var(--vibeui-navbar-010-muted);font-size:0.75rem;
}
[data-vibeui-block="navbar-010"] a:focus-visible,
[data-vibeui-block="navbar-010"] button:focus-visible,
[data-vibeui-block="navbar-010"] input:focus-visible{outline:2px solid var(--vibeui-navbar-010-accent);outline-offset:2px}
@container (min-width: 56rem){
[data-vibeui-block="navbar-010"] [data-part="shell"]{grid-template-columns:auto minmax(10rem,1fr) auto;padding:0.875rem 2rem;gap:0.75rem 1.5rem}
[data-vibeui-block="navbar-010"] [data-part="search"]{grid-column:auto}
[data-vibeui-block="navbar-010"] [data-part="account"]{display:inline-flex}
[data-vibeui-block="navbar-010"] [data-part="total"]{display:inline}
[data-vibeui-block="navbar-010"] [data-part="delivery"]{grid-column:3;justify-self:end;text-align:right}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="navbar-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CATEGORIES: Navbar010Category[] = [
  { label: "Новинки", href: "#new" },
  { label: "Посуда", href: "#tableware" },
  { label: "Текстиль", href: "#textile" },
  { label: "Свет", href: "#light" },
  { label: "Хранение", href: "#storage" },
  { label: "Распродажа", href: "#sale" },
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

/** Шапка магазина: поиск, аккаунт и корзина со счётчиком и суммой заказа. */
export function Navbar010({
  brand = "Дом и лад",
  categories = DEFAULT_CATEGORIES,
  searchPlaceholder = "Что ищем? Например, «чугунная сковорода»",
  cartCount = 3,
  cartTotal = "7 480 ₽",
  accountLabel = "Кабинет",
  accountHref = "#account",
  deliveryNote = "Доставим по Москве завтра, если оформить до 20:00",
  findLabel = "Найти",
  searchLabel = "Поиск по товарам",
  cartLabel = "Корзина: {count} товара на {total}",
  navLabel = "Категории товаров",
  background = "",
  accent,
  className,
  style,
}: Navbar010Props) {
  const palette = {
    ...(accent ? { "--vibeui-navbar-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-navbar-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-navbar-010" precedence="medium">
        {STYLES}
      </style>
      <header
        data-vibeui-block="navbar-010"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <a data-part="brand" href="#top">
            <span data-part="mark" aria-hidden="true" />
            {brand}
          </a>
          <form data-part="search" role="search" action="#search">
            <input
              data-part="input"
              type="search"
              name="q"
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
            />
            <button data-part="find" type="submit">
              {findLabel}
            </button>
          </form>
          <div data-part="side">
            <a data-part="account" href={accountHref}>
              {accountLabel}
            </a>
            <a
              data-part="cart"
              href="#cart"
              aria-label={cartLabel
                .replace("{count}", String(cartCount))
                .replace("{total}", cartTotal)}
            >
              <span data-part="basket" aria-hidden="true" />
              <span data-part="count" aria-hidden="true">
                {cartCount}
              </span>
              <span data-part="total" aria-hidden="true">
                {cartTotal}
              </span>
            </a>
          </div>
          <nav data-part="rail" aria-label={navLabel}>
            {categories.map((category) => (
              <a key={category.href} href={category.href}>
                {category.label}
              </a>
            ))}
          </nav>
          <p data-part="delivery">{deliveryNote}</p>
        </div>
      </header>
    </>
  )
}
