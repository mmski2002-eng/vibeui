import Link from "next/link"

export function CatalogTopbar({ itemCount }: { itemCount: number }) {
  return (
    <header className="border-shell-border bg-shell sticky top-0 z-30 border-b">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="text-shell-fg focus-visible:ring-shell-ring rounded-sm text-base font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
          >
            VibeUI
          </Link>
          <span className="border-shell-border text-shell-muted hidden rounded-full border px-2 py-0.5 text-xs sm:inline">
            {itemCount} items
          </span>
        </div>

        <nav className="text-shell-muted flex items-center gap-4 text-sm">
          <Link
            href="/components"
            className="hover:text-shell-fg focus-visible:ring-shell-ring rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Каталог
          </Link>
        </nav>
      </div>
    </header>
  )
}
