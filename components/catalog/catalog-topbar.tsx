import Link from "next/link"

import { LocaleSwitch } from "@/components/catalog/locale-switch"
import { ThemeSwitch } from "@/components/catalog/theme-switch"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"

export function CatalogTopbar({
  itemCount,
  locale,
}: {
  itemCount: number
  locale: Locale
}) {
  const t = getDictionary(locale)

  return (
    <header className="border-shell-border bg-shell sticky top-0 z-30 border-b">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 sm:h-14 sm:flex-nowrap sm:py-0 lg:px-6">
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <Link
            href={localePath(locale, "/")}
            className="text-shell-fg focus-visible:ring-shell-ring rounded-sm text-base font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
          >
            VibeUI
          </Link>
          <span className="border-shell-border text-shell-muted hidden rounded-full border px-2 py-0.5 text-xs sm:inline">
            {t.topbar.items(itemCount)}
          </span>
        </div>

        {/* На телефоне ссылки переезжают на вторую строку: в один ряд с
            логотипом и переключателями им остаётся сотня пикселей, и там от
            них видны одни обрубки. Полосу прокрутки прячем — ряд короткий. */}
        <nav className="text-shell-muted order-last flex w-full min-w-0 [scrollbar-width:none] items-center justify-start gap-3 overflow-x-auto pb-0.5 text-sm sm:order-none sm:w-auto sm:pb-0 [&::-webkit-scrollbar]:hidden">
          <Link
            href={localePath(locale, "/components")}
            className="hover:text-shell-fg focus-visible:ring-shell-ring shrink-0 rounded-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t.topbar.components}
          </Link>
          <Link
            href={localePath(locale, "/blocks")}
            className="hover:text-shell-fg focus-visible:ring-shell-ring shrink-0 rounded-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t.topbar.blocks}
          </Link>
          {/* Внутренняя страница согласования дизайна: одна на весь сайт,
              без языковой пары, поэтому ссылка без префикса локали. */}
          <Link
            href="/lab"
            className="hover:text-shell-fg focus-visible:ring-shell-ring hidden shrink-0 rounded-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none sm:inline"
          >
            {t.topbar.lab}
          </Link>
          <Link
            href="/animations"
            className="hover:text-shell-fg focus-visible:ring-shell-ring shrink-0 rounded-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t.topbar.animations}
          </Link>
        </nav>

        {/* Переключатели темы и языка прижаты к правому краю: sm:ml-auto
            забирает себе весь свободный остаток строки, а не долю наравне
            с зазором до ссылок. На телефоне они остаются в первой строке
            рядом с логотипом — ссылки уезжают на вторую. */}
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          <ThemeSwitch />
          <LocaleSwitch locale={locale} />
        </div>
      </div>
    </header>
  )
}
