import { CatalogShell } from "@/components/catalog/catalog-shell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "en",
  path: "/legal/privacy",
  title: "Privacy policy",
  description:
    "What data VibeUI collects, why it is needed and how long it is kept.",
})

export default function EnPrivacyPage() {
  return (
    <CatalogShell locale="en">
      <main className="text-shell-muted mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-12 text-sm leading-relaxed lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
          Privacy policy
        </h1>
        <p>
          The operator is the self-employed owner of VibeUI. For data-protection
          questions:{" "}
          <a className="text-shell-fg underline" href="mailto:mmski2002@gmail.com">mmski2002@gmail.com</a>.
        </p>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">What we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>your email address and name (assigned automatically if you leave it blank);</li>
            <li>the date and version of the terms and this policy you accepted;</li>
            <li>the interface language your account was created in;</li>
            <li>subscription and payment records (fact, amount, status) and your monthly copy-limit usage;</li>
            <li>when you contact support — the message text and your email;</li>
            <li>technical data to prevent abuse (an anonymised IP fingerprint).</li>
          </ul>
          <p>
            We never receive your card or crypto-wallet details — payments are
            handled by the payment providers on their side.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Purposes</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>creating and running your account;</li>
            <li>access to the component library and copy-limit accounting;</li>
            <li>starting and renewing a subscription;</li>
            <li>answering support requests.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Storage</h2>
          <p>
            Data is stored on a server located in the Russian Federation for as
            long as your account exists and the data is needed for the purposes
            above. Payment records are kept for the period required by law.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Sharing</h2>
          <p>
            With payment providers only, and only to process a payment. We do
            not share your data with anyone else except where the law requires
            it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">Your rights</h2>
          <p>
            You can request access to your data, its correction or deletion, and
            withdraw consent — by email to{" "}
            <a className="text-shell-fg underline" href="mailto:mmski2002@gmail.com">mmski2002@gmail.com</a>.
          </p>
        </section>
      </main>
    </CatalogShell>
  )
}
