import type { CSSProperties } from "react"

import { Navbar040 } from "@/registry/blocks/navbar/navbar-040/navbar-040"
import { Hero040 } from "@/registry/blocks/hero/hero-040/hero-040"
import { Fintech001 } from "@/registry/blocks/industry/fintech-001/fintech-001"
import { Bento009 } from "@/registry/blocks/layout/bento-009/bento-009"
import { Fintech002 } from "@/registry/blocks/industry/fintech-002/fintech-002"
import { Fintech003 } from "@/registry/blocks/industry/fintech-003/fintech-003"
import { Pricing032 } from "@/registry/blocks/pricing/pricing-032/pricing-032"
import { Logocloud014 } from "@/registry/blocks/logos/logocloud-014/logocloud-014"
import { Testimonials032 } from "@/registry/blocks/testimonials/testimonials-032/testimonials-032"
import { Download013 } from "@/registry/blocks/cta/download-013/download-013"
import { Faq023 } from "@/registry/blocks/faq/faq-023/faq-023"
import { Footer032 } from "@/registry/blocks/footer/footer-032/footer-032"

/**
 * English version of the "Fintech / small-business bank" demo: same blocks
 * and theme as `app/scenarios/fintech/demo/page.tsx`, text in English via
 * props.
 *
 * The site behaves like an app: the card on the first screen turns after
 * the cursor and transactions run across it, the dashboard draws its chart
 * on appearance, the calculator counts savings, the security section
 * carries the card through four layers of protection on scroll. Indigo
 * and aurora, glass, not a single photo.
 */
export const metadata = {
  title: "Axis — a bank for small business: an account in 10 minutes, transfers with no fee",
  description:
    "VibeUI «Fintech / small-business bank» scenario demo: a 3D card following the cursor, a live balance with a chart, a bento of features, a savings calculator, security on scroll, plans with an employee slider, integrations as a ticker, reviews, an app QR, questions and a footer.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#07091a",
  color: "#e8ecf8",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const aurora = { tone: "dark", accent: "#4ade80", ink: "#e8ecf8", background: "#07091a" } as const

const FAQ = [
  { question: "How fast will you open an account?", answer: "The application takes 5 minutes in the app, we issue the details right away, a full account — after checks, usually within 10 minutes during working hours. A courier brings the card and documents the next day." },
  { question: "What do I need to open one?", answer: "Sole proprietors — a passport and tax ID. Companies — the director's passport, tax ID and registration number. No certificates, no stamps: the rest we take from public registers." },
  { question: "Are instant transfers really free?", answer: "Yes, on every plan and with no limit on the amount. Payment orders by bank details are free within the plan's operation limit, then 25 ₽ per payment." },
  { question: "How are taxes calculated?", answer: "We see your income and your regime (simplified «Income», «Income minus expenses», patent), so the advance and contributions accrue on their own. We remind you a week before the deadline, and you can pay in one tap." },
  { question: "Is the money insured?", answer: "Funds of sole proprietors and small businesses are insured by the deposit insurance agency up to 1.4M ₽. Axis operates under Bank of Russia licence No. 3538." },
  { question: "Can I add an accountant?", answer: "Yes, free on every plan: the accountant gets access to statements and documents without the right to move money." },
]

export default function FintechDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4.2rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar040
        {...aurora}
        brand="Axis"
        links={[
          { label: "Features", href: "#features" },
          { label: "Savings", href: "#calc" },
          { label: "Security", href: "#security" },
          { label: "Plans", href: "#pricing" },
          { label: "App", href: "#app" },
        ]}
        loginLabel="Log in"
        actionLabel="Open an account"
        navLabel="Sections"
        menuLabel="Menu"
        menuOpenLabel="Open menu"
        menuCloseLabel="Close menu"
      />
      <div id="top">
        <Hero040
          {...aurora}
          eyebrow="A bank for small business · Bank of Russia licence"
          title="An account that *works* faster than an accountant"
          lede="We open an account in 10 minutes with no visit to a branch. Instant transfers with no fee, we calculate taxes ourselves, employee cards — within a day."
          primaryLabel="Open an account"
          secondaryLabel="See the plans"
          facts={[
            { value: "10 min", label: "to open an account" },
            { value: "0 ₽", label: "for instant transfers" },
            { value: "24/7", label: "human support" },
          ]}
          cardBrand="Axis"
          cardHolder="North Wind LLC"
          transactions={[
            { title: "Ozon · payout", note: "marketplace", amount: "+184 300 ₽" },
            { title: "Rent, 8 Pravdy St.", note: "on schedule", amount: "−62 000 ₽" },
            { title: "Prim-Logistic LLC", note: "instant, 0 ₽ fee", amount: "+48 900 ₽" },
            { title: "Payroll · 6 people", note: "batch: Friday", amount: "−318 500 ₽" },
            { title: "Wildberries · payout", note: "marketplace", amount: "+96 120 ₽" },
            { title: "Simplified tax 6% · advance", note: "calculated automatically", amount: "−41 760 ₽" },
          ]}
          cardLabel="{brand} {kind} card"
          showLabel="Show the number"
          hideLabel="Hide the number"
          feedLabel="Latest transactions"
        />
      </div>
      <div id="dashboard">
        <Fintech001
          {...aurora}
          eyebrow="Dashboard"
          title="Money is visible right away, not in a statement on Mondays"
          lede="Balance, income and taxes on one screen. The chart rebuilds by day, week and month; every transaction is labelled so you don't have to dig into the books."
          facts={["Marketplace payouts are visible the moment they're paid", "Simplified tax is calculated on every receipt", "Export to 1C and Excel in one click"]}
          account="Main account · 40702…4821"
          periods={[
            {
              label: "Day",
              balance: 1284650,
              delta: "+48 900 ₽ since morning",
              points: [62, 60, 61, 58, 64, 66, 65, 70, 69, 74, 73, 78],
              operations: [
                { title: "Prim-Logistic LLC", note: "instant · 09:12", amount: 48900 },
                { title: "Yandex Go · corporate", note: "employee card · 10:40", amount: -1240 },
                { title: "Rent, 8 Pravdy St.", note: "on schedule · 11:00", amount: -62000 },
                { title: "Ozon · payout", note: "marketplace · 12:30", amount: 184300 },
                { title: "Skrepka stationery", note: "invoice No. 418 · 13:05", amount: -8420 },
              ],
            },
            {
              label: "Week",
              balance: 1284650,
              delta: "+12.4% vs last week",
              points: [40, 44, 42, 50, 47, 55, 53, 61, 58, 66, 71, 78],
              operations: [
                { title: "Wildberries · payout", note: "marketplace · Tue", amount: 96120 },
                { title: "Payroll · 6 people", note: "payroll batch · Fri", amount: -318500 },
                { title: "Ozon · payout", note: "marketplace · Thu", amount: 184300 },
                { title: "Kravtsova, sole prop. · design", note: "instant, 0 ₽ fee · Wed", amount: -35000 },
                { title: "Simplified tax 6% · advance", note: "calculated automatically · Mon", amount: -41760 },
              ],
            },
            {
              label: "Month",
              balance: 1284650,
              delta: "+31.8% vs August",
              points: [22, 30, 28, 36, 41, 39, 48, 52, 50, 63, 70, 78],
              operations: [
                { title: "Marketplace payouts", note: "14 credits", amount: 1126400 },
                { title: "Payroll and contributions", note: "2 payroll batches", amount: -637000 },
                { title: "Rent and utilities", note: "3 payments", amount: -74600 },
                { title: "Suppliers", note: "27 instant payments", amount: -412300 },
                { title: "Acquiring · till", note: "revenue for the month", amount: 268900 },
              ],
            },
          ]}
          tabsLabel="Period"
        />
      </div>
      <div id="features">
        <Bento009
          {...aurora}
          eyebrow="Features"
          title="Everything the accountant does on Tuesdays — in seconds"
          lede="Transfers, taxes, currency, statements and employee cards in one app, with no branch visits and no «manager who'll call you back»."
          items={[
            { kind: "transfer", title: "Instant transfers in seconds", text: "To a counterparty, an employee or yourself — by phone number or bank details. No fee, the money arrives before you close the app.", meta: "0 ₽ fee", large: true, labels: ["Your account", "Prim LLC", "48 900 ₽"] },
            { kind: "tax", title: "We calculate taxes ourselves", text: "Simplified tax and contributions accrue on every receipt. We remind you a week ahead and pay in one tap.", meta: "6% tax" },
            { kind: "fx", title: "Accounts in four currencies", text: "Roubles, yuan, dollars, euros. Conversion at the exchange rate plus 0.3%.", meta: "+ 0.3%" },
            { kind: "export", title: "Statements to 1C and Excel", text: "Sync every 15 minutes, documents attach themselves to payments.", meta: "1C" },
            { kind: "cards", title: "Employee cards", text: "Virtual in a minute, plastic in a day. Limits and categories — in the app.", meta: "up to 50 cards" },
            { kind: "support", title: "Support answered by humans", text: "Average reply — 40 seconds, at night too. No «your call is very important to us».", meta: "24/7", labels: ["A payment to China isn't going through"] },
          ]}
        />
      </div>
      <div id="calc">
        <Fintech002
          {...aurora}
          eyebrow="Calculator"
          title="How much you overpay for transfers"
          lede="Move the slider to your turnover — we'll calculate a year of fees with us and with two hypothetical banks on typical small-business plans."
          banks={[
            { name: "Axis · Growth", fixed: 490, percent: 0.1, ours: true },
            { name: "Hypothetical bank A", fixed: 1990, percent: 0.5 },
            { name: "Hypothetical bank B", fixed: 2490, percent: 0.35 },
          ]}
          turnoverLabel="Monthly turnover"
          savingLabel="You'll save on fees"
          savingNote="a year against the cheapest of the compared banks"
          perMonthLabel="per month"
          perYearLabel="/ year"
          units={["k", "M"]}
          note="The calculation is illustrative: account fees and business transfer fees, without acquiring and currency control. Exact rates are in the section below."
          presetsLabel="Typical turnovers"
        />
      </div>
      <div id="security">
        <Fintech003
          {...aurora}
          eyebrow="Security"
          title="Every payment passes four layers of protection"
          lede="Scroll — the card will pass through them before your eyes. All of it works in fractions of a second and never asks you for a single SMS code."
          layers={[
            { title: "Login by face and key", text: "Biometrics on the phone, a hardware key or confirmation in the app. No SMS codes that get intercepted.", icon: "biometrics" },
            { title: "Tokens instead of numbers", text: "Card details aren't stored by the merchant: a one-time token goes out at payment, not the number.", icon: "lock" },
            { title: "Anti-fraud in 200 ms", text: "The model looks at the amount, the recipient, the time and the device. A suspicious payment is stopped before the debit.", icon: "radar" },
            { title: "Insurance and limits", text: "Funds up to 1.4M ₽ are insured by the deposit agency. Limits on employee cards — by category and day.", icon: "shield" },
          ]}
          cardLabel="Axis"
          counterLabel="layer"
        />
      </div>
      <div id="pricing">
        <Pricing032
          {...aurora}
          eyebrow="Plans"
          title="Pay for the size of your business, not for the bank"
          lede="Pick a plan and move the slider to your number of employees — the price recalculates. The first operations of every month are free."
          plans={[
            { name: "Start", tagline: "For sole proprietors and companies that have just opened: an account, a card and taxes — free.", base: 0, included: 1, perEmployee: 0, freeOperations: 20, features: ["An account and a business card in 10 minutes", "Free up to 20 operations a month", "Instant transfers with no fee", "Simplified tax calculated automatically"], actionLabel: "Open for free" },
            { name: "Growth", tagline: "For a team of up to 20: employee cards, 1C, marketplaces and human support.", base: 490, included: 3, perEmployee: 150, freeOperations: 200, features: ["Everything in «Start»", "Free up to 200 operations a month", "Employee cards with limits", "Statements to 1C every 15 minutes", "Marketplace payouts the same day"], actionLabel: "Choose «Growth»" },
            { name: "Scale", tagline: "For a turnover from 10M ₽: unlimited operations, currency accounts and a personal manager.", base: 1990, included: 10, perEmployee: 90, freeOperations: 0, features: ["Everything in «Growth»", "Unlimited operations", "Accounts in yuan, dollars and euros", "Payroll with no fee", "A personal manager on Telegram"], actionLabel: "Discuss terms" },
          ]}
          seatsLabel="Employees with cards"
          perMonthLabel="per month"
          includedLabel="included"
          freeLabel="free up to {n} operations / mo"
          unlimitedLabel="unlimited operations"
          switchLabel="Plan"
          peopleUnits={["person", "people", "people"]}
        />
      </div>
      <div id="integrations">
        <Logocloud014
          {...aurora}
          eyebrow="Integrations"
          title="Connects to what you already use"
          rows={[
            [{ name: "1C:Accounting", mark: "1C" }, { name: "Ozon Seller", mark: "OZ" }, { name: "Wildberries", mark: "WB" }, { name: "Yandex Market", mark: "YM" }, { name: "MoySklad", mark: "MS" }, { name: "Evotor", mark: "EV" }, { name: "ATOL", mark: "AT" }, { name: "Kontur.Elba", mark: "KE" }],
            [{ name: "Bitrix24", mark: "B24" }, { name: "amoCRM", mark: "amo" }, { name: "Instant payments", mark: "SBP" }, { name: "Tinkoff Kassa", mark: "TK" }, { name: "Modulbank API", mark: "API" }, { name: "Telegram bot", mark: "TG" }, { name: "Google Sheets", mark: "GS" }, { name: "Honest Sign", mark: "HS" }],
          ]}
          counters={[
            { label: "companies bank with Axis", base: 48210, perSecond: 0.0021 },
            { label: "transfers today", base: 0, perSecond: 3.4 },
          ]}
          rowsLabel="Integrations"
        />
      </div>
      <div id="reviews">
        <Testimonials032
          {...aurora}
          eyebrow="Reviews"
          title="Entrepreneurs count better than marketers"
          lede="We don't ask for reviews — people write when the savings become visible in numbers. Here are a few, with the authors' permission."
          rating="4.9"
          ratingNote="from 2 340 ratings on RuStore and the App Store"
          reviews={[
            { quote: "On Fridays I used to spend two hours shuffling payment orders between the bank and 1C. Now the statement pulls itself in, and the simplified tax is already calculated by the time I remember it.", name: "Olga Meshcheryakova", role: "Korka coffee shop, Moscow", metric: "−2 h", metricLabel: "every Friday", initials: "OM", featured: true },
            { quote: "Instant transfers to suppliers with no fee — at our turnover that's real money. We counted over a year: 140 thousand stayed in the business.", name: "Timur Gareev", role: "Prim wholesale, Kazan", metric: "140 000 ₽", metricLabel: "saved in a year", initials: "TG" },
            { quote: "Payouts from Ozon and Wildberries land on the account the same day, not «within three working days». For us that's turnover, not convenience.", name: "Marina Likhachyova", role: "Sever clothing brand, Yekaterinburg", metric: "same day", metricLabel: "marketplace payouts", initials: "ML" },
            { quote: "Opened an account in a taxi on the way to a meeting. A courier brought the card the next day. That's it.", name: "Ilya Sorokin", role: "Sole proprietor, appliance repair, Tula", metric: "10 min", metricLabel: "to open an account", initials: "IS" },
            { quote: "Employee cards with category limits closed the eternal «what were the eight thousand spent on». Now it's visible in the app, no receipts in the chat.", name: "Daria Nemtsova", role: "List design studio, Saint Petersburg", metric: "12", metricLabel: "employee cards", initials: "DN" },
          ]}
        />
      </div>
      <div id="app">
        <Download013
          {...aurora}
          eyebrow="App"
          title="A bank that fits in a pocket, not a branch"
          lede="Account, payments, employee cards and taxes in one app. Point your camera at the code or open the store."
          qrCaption="point your camera — your store opens"
          badges={[
            { top: "Download on the", store: "App Store", href: "#appstore" },
            { top: "Get it on", store: "Google Play", href: "#googleplay" },
            { top: "Download from", store: "RuStore", href: "#rustore" },
          ]}
          rating="4.9"
          ratingNote="average rating across three stores"
          phoneBrand="Axis"
          phoneCaption="Main account"
          qrLabel="QR code to download the app"
          phoneRows={[["Ozon · payout", "+184 300 ₽"], ["Rent", "−62 000 ₽"], ["Simplified tax 6% · advance", "−41 760 ₽"]]}
        />
      </div>
      <div id="faq">
        <Faq023 {...aurora} eyebrow="Questions" title="What people ask before opening an account" lede="Short answers to what's usually checked with a manager. More in the plans and documents." items={FAQ} contactLabel="Ask in the chat" contactHref="#contact" />
      </div>
      <Footer032
        {...aurora}
        brand="Axis"
        caption="A bank for small business. Bank of Russia licence No. 3538 of 12.03.2024. A member of the deposit insurance system."
        status="All systems operational · 99.98% over 90 days"
        statusHref="#status"
        columns={[
          { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Savings", href: "#calc" }, { label: "Security", href: "#security" }, { label: "Plans", href: "#pricing" }] },
          { title: "For business", links: [{ label: "Sole proprietors and freelancers", href: "#open" }, { label: "Companies", href: "#open" }, { label: "Marketplace sellers", href: "#integrations" }, { label: "Accountants", href: "#faq" }] },
          { title: "Company", links: [{ label: "About the bank", href: "#about" }, { label: "Disclosures", href: "#disclosure" }, { label: "Careers", href: "#jobs" }, { label: "Press", href: "#press" }] },
        ]}
        socials={[{ label: "Telegram", href: "#" }, { label: "VK", href: "#" }, { label: "Dzen", href: "#" }]}
        legal={[{ label: "Plans and documents", href: "#docs" }, { label: "Privacy policy", href: "#privacy" }, { label: "Terms of service", href: "#terms" }]}
        copyright="© 2026 Axis Bank JSC"
        navLabel="Site sections"
      />
    </div>
  )
}
