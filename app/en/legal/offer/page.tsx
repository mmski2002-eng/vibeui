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
      <main className="text-shell-muted mx-auto w-full max-w-3xl flex-1 space-y-6 px-4 py-12 text-sm leading-relaxed lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight">
          Public offer
        </h1>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">1. General</h2>
          <p>
            This document is a public offer by the self-employed provider Evgenii
            Sadkov (the “Provider”) to grant access to the paid features of
            VibeUI (vibeui.club). Paying for a plan constitutes full and
            unconditional acceptance of this offer; the agreement is concluded at
            that moment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">2. Subject</h2>
          <p>
            The Provider grants access to PRO features: removal of the monthly
            copy limit, closed blocks, animations and scenarios, and a personal
            key for installing from the registry. The catalog, live previews and
            search are free and available without an account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">3. Price and payment</h2>
          <p>
            Current prices are listed on the{" "}
            <a className="text-shell-fg underline" href="/en/pricing">pricing page</a>{" "}
            in US dollars. Payment is accepted in cryptocurrency (USDC, USDT or
            ETH on the Ethereum or Base networks) via NOWPayments. Payment is a
            one-off charge for the chosen period (month or year).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">4. Term and activation</h2>
          <p>
            Access is activated after the payment is confirmed and lasts until
            the end of the paid period. There is no auto-renewal: when the period
            ends the plan becomes free, and you can pay again at any time from
            your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">5. Refunds</h2>
          <p>
            Refunds are issued on request by email to{" "}
            <a className="text-shell-fg underline" href="mailto:mmski2002@gmail.com">mmski2002@gmail.com</a>{" "}
            and are returned by the same method used for the payment — that is,
            in cryptocurrency to the wallet the payment was made from. The
            refundable amount for the unused period is agreed between the parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">6. Personal data</h2>
          <p>
            Processed in accordance with the{" "}
            <a className="text-shell-fg underline" href="/en/legal/privacy">Privacy policy</a>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">7. Liability</h2>
          <p>
            The service is provided “as is”. The Provider’s liability is limited
            to the amount paid for the current period; the Provider is not liable
            for lost profits.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-shell-fg text-lg font-semibold">8. Provider details</h2>
          <p>
            Self-employed Evgenii Sadkov · TIN 732894935375 ·{" "}
            <a className="text-shell-fg underline" href="mailto:mmski2002@gmail.com">mmski2002@gmail.com</a>.
          </p>
        </section>

        <p className="text-shell-muted/70 text-xs">Last updated: 20 September 2026.</p>
      </main>
    </CatalogShell>
  )
}
