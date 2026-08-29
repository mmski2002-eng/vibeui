import Link from "next/link"

// Временная навигация: полноценное меню появится вместе с каталогом.
export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-base font-semibold tracking-tight">
          VibeUI
        </Link>
        <nav className="text-muted-foreground flex items-center gap-4 text-sm">
          <Link href="/components" className="hover:text-foreground">
            Components
          </Link>
        </nav>
      </div>
    </header>
  )
}
