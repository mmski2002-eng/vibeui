import Link from "next/link"

import { LocaleSwitch } from "@/components/catalog/locale-switch"
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
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={localePath(locale, "/")}
            className="text-shell-fg focus-visible:ring-shell-ring rounded-sm text-base font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
          >
            VibeUI
          </Link>
          <span className="border-shell-border text-shell-muted hidden rounded-full border px-2 py-0.5 text-xs sm:inline">
            {itemCount} {t.topbar.items}
          </span>
        </div>

        <nav className="text-shell-muted flex items-center gap-4 text-sm">
          <Link
            href={localePath(locale, "/components")}
            className="hover:text-shell-fg focus-visible:ring-shell-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t.topbar.components}
          </Link>
          <Link
            href={localePath(locale, "/blocks")}
            className="hover:text-shell-fg focus-visible:ring-shell-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            {t.topbar.blocks}
          </Link>
          <LocaleSwitch locale={locale} />
        </nav>
      </div>
    </header>
  )
}
