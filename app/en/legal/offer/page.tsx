import { CatalogShell } from "@/components/catalog/catalog-shell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "en",
  path: "/legal/offer",
  title: "Public offer",
  description: "The public agreement for access to the VibeUI component library.",
})

export default function EnOfferPage() {
  return (
    <CatalogShell locale="en">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
          Public offer
        </h1>
        <p className="text-shell-muted mt-4 text-sm leading-relaxed">
          The contract text is being prepared. Until it is published, payments
          are not accepted: access cannot be sold without published terms.
        </p>
      </main>
    </CatalogShell>
  )
}
