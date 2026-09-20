import type { CSSProperties } from "react"

import { Navbar042 } from "@/registry/blocks/navbar/navbar-042/navbar-042"
import { Hero042 } from "@/registry/blocks/hero/hero-042/hero-042"
import { Api001 } from "@/registry/blocks/industry/api-001/api-001"
import { Bento011 } from "@/registry/blocks/layout/bento-011/bento-011"
import { Pricing034 } from "@/registry/blocks/pricing/pricing-034/pricing-034"
import { Api002 } from "@/registry/blocks/industry/api-002/api-002"
import { Comparison015 } from "@/registry/blocks/pricing/comparison-015/comparison-015"
import { Changelog013 } from "@/registry/blocks/blog/changelog-013/changelog-013"
import { Logocloud007 } from "@/registry/blocks/logos/logocloud-007/logocloud-007"
import { Testimonials034 } from "@/registry/blocks/testimonials/testimonials-034/testimonials-034"
import { Cta035 } from "@/registry/blocks/cta/cta-035/cta-035"
import { Footer041 } from "@/registry/blocks/footer/footer-041/footer-041"

/**
 * English version of the "API / dev tool" demo: same blocks and theme as
 * `app/scenarios/api/demo/page.tsx`, text in English via props.
 *
 * "Geokod" — geocoding, routes and address suggestions over an API. The
 * site is "a terminal, but pretty": the request types itself, the JSON
 * arrives after a "42 ms" delay, the sandbox moves a dot on a CSS map, the
 * price is calculated with a logarithmic slider, the status panel lives
 * off the current time. A dark background, one phosphor accent, a mono font
 * for code and metrics, not a single photo.
 */
export const metadata = {
  title: "Geokod — geocoding API: address → coordinates in 42 ms",
  description:
    "VibeUI «API / dev tool» scenario demo: a hero with a live request, a sandbox with a map, a bento of endpoints, a per-request price calculator, a region status panel, a comparison with competitors, a changelog, developer reviews and a key in 30 seconds.",
}

const page: CSSProperties = {
  colorScheme: "dark",
  background: "#0b0d10",
  color: "#e6edf3",
  fontFamily: '"Inter Tight",ui-sans-serif,system-ui,sans-serif',
}

// Page theme: catalogue blocks are neutral by default, the scenario sets the colours.
const terminal = { tone: "dark", accent: "#7cf3a0", ink: "#e6edf3", background: "#0b0d10" } as const

const QUERY = "Moscow, Tverskaya, 7"

export default function ApiDemoEn() {
  return (
    <div style={page} className="min-h-dvh">
      <style href="vibeui-demo-scroll" precedence="medium">
        {`html{scroll-behavior:smooth;scroll-padding-top:4rem}@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}
      </style>
      <Navbar042
        {...terminal}
        links={[
          { label: "Sandbox", href: "#sandbox" },
          { label: "Endpoints", href: "#endpoints" },
          { label: "Pricing", href: "#pricing" },
          { label: "Status", href: "#status" },
        ]}
        actionLabel="Get a key"
        navLabel="Sections"
        menuLabel="Menu"
        menuOpenLabel="Open menu"
        menuCloseLabel="Close menu"
      />
      <div id="top">
        <Hero042
          {...terminal}
          title="Address → coordinates *in 42 ms*"
          lede="Geocoding, reverse geocoding, routes and address suggestions across Russia and the CIS. One key, one request, the answer is JSON. Free up to 10 000 requests a month."
          primaryLabel="Get a key"
          secondaryLabel="Open the docs"
          stats={[
            { value: "99.99%", label: "uptime over a year" },
            { value: "42 ms", label: "median response" },
            { value: "0 ₽", label: "up to 10 000 requests" },
          ]}
          samples={[
            { label: "curl", code: ["curl https://api.geokod.ru/v2/geocode \\", '  -H "Authorization: Bearer gk_live_7f3a…" \\', `  -G --data-urlencode "q=${QUERY}"`] },
            { label: "JS", code: ["const res = await fetch(", `  "https://api.geokod.ru/v2/geocode?q=${QUERY}",`, '  { headers: { Authorization: "Bearer gk_live_7f3a…" } }', ")", "const { results } = await res.json()"] },
            { label: "Python", code: ["import requests", "", "r = requests.get(", '  "https://api.geokod.ru/v2/geocode",', `  params={"q": "${QUERY}"},`, '  headers={"Authorization": "Bearer gk_live_7f3a…"},', ")", 'print(r.json()["results"][0])'] },
            { label: "Go", code: ['req, _ := http.NewRequest("GET",', `  "https://api.geokod.ru/v2/geocode?q=${QUERY}", nil)`, 'req.Header.Set("Authorization", "Bearer gk_live_7f3a…")', "res, err := http.DefaultClient.Do(req)"] },
          ]}
          response={[
            "{",
            `  "query": "${QUERY}",`,
            '  "results": [{',
            '    "lat": 55.759853,',
            '    "lon": 37.610127,',
            '    "precision": "house",',
            '    "address": {',
            '      "city": "Moscow",',
            '      "street": "Tverskaya Street",',
            '      "house": "7",',
            '      "postal_code": "125009"',
            "    }",
            "  }],",
            '  "cached": false,',
            '  "took_ms": 42',
            "}",
          ]}
          tabsLabel="Sample language"
          copyLabel="copy"
          copiedLabel="copied"
          codeLabel="Sample request, {lang}"
          waitLabel="Waiting for the response"
        />
      </div>
      <div id="sandbox">
        <Api001
          {...terminal}
          eyebrow="Sandbox"
          title="Try it without a key"
          lede="Type an address — the answer comes as if from the real API: coordinates, precision, a normalised address. The dot on the map goes there too."
          placeholder="City, street, building"
          actionLabel="Send"
          suggestions={["Moscow, Tverskaya, 7", "Saint Petersburg, Nevsky, 28", "Kazan, Baumana, 3", "Sochi, Kurortny Avenue"]}
          places={[
            { keys: ["tverskaya"], address: "Russia, Moscow, Tverskaya Street, 7", city: "Moscow", lat: 55.759853, lon: 37.610127, x: 50, y: 48, precision: "house", latency: 38 },
            { keys: ["nevsky"], address: "Russia, Saint Petersburg, Nevsky Avenue, 28", city: "Saint Petersburg", lat: 59.935612, lon: 30.325744, x: 24, y: 30, precision: "house", latency: 44 },
            { keys: ["arbat"], address: "Russia, Moscow, Arbat Street, 12", city: "Moscow", lat: 55.750438, lon: 37.594412, x: 41, y: 58, precision: "house", latency: 36 },
            { keys: ["kazan", "baumana"], address: "Russia, Kazan, Baumana Street, 3", city: "Kazan", lat: 55.79392, lon: 49.10986, x: 74, y: 40, precision: "house", latency: 51 },
            { keys: ["sochi", "kurortny"], address: "Russia, Sochi, Kurortny Avenue, 50", city: "Sochi", lat: 43.585525, lon: 39.723062, x: 62, y: 76, precision: "street", latency: 63 },
          ]}
          note="The sandbox answers with pre-recorded data: no key needed, the quota isn't spent."
          inputLabel="Address"
          chipsLabel="Sample addresses"
          emptyLine="the response appears here — press «{action}» or pick an address"
          mapLabel="Map with the result dot"
          costLabel="cost"
          freeLabel="free requests left"
        />
      </div>
      <div id="endpoints">
        <Bento011
          {...terminal}
          eyebrow="Endpoints"
          title="Six methods, one key"
          lede="Everything delivery, maps and logistics need. One response format, one authorisation, the same documentation."
          items={[
            { method: "GET", path: "/v2/geocode", title: "Forward geocoding", text: "An address string in any form — with typos, abbreviations, no postcode — turns into building coordinates and a normalised address.", meta: "p50 · 42 ms", kind: "geocode", wide: true },
            { method: "GET", path: "/v2/reverse", title: "Reverse geocoding", text: "Coordinates → the nearest address, district, postcode and object type.", meta: "p50 · 39 ms", kind: "reverse" },
            { method: "POST", path: "/v2/route", title: "Routes", text: "Car, walking, bike: geometry, distance, time with traffic.", meta: "p50 · 110 ms", kind: "route" },
            { method: "GET", path: "/v2/suggest", title: "Address suggestions", text: "Autocomplete from the first letters for delivery and sign-up forms.", meta: "p50 · 24 ms", kind: "suggest" },
            { method: "POST", path: "/v2/matrix", title: "Distance matrix", text: "Up to 100 × 100 points in one request — for logistics and picking the nearest warehouse.", meta: "p50 · 180 ms", kind: "matrix" },
            { method: "POST", path: "/v2/batch", title: "Batch processing", text: "Upload a file with a million addresses — we return a geocoded CSV.", meta: "≈ 12 min per 1 000 000", kind: "batch" },
          ]}
          demoAddress="«Tverskaya 7, msk»"
          demoDistance="7.4 km · 18 min"
          demoQuery="Tversk"
          demoSuggestions={["Tverskaya Street, Moscow", "1st Tverskaya-Yamskaya Street", "Tverskoy Boulevard"]}
        />
      </div>
      <div id="pricing">
        <Pricing034
          {...terminal}
          eyebrow="Pricing"
          title="Pay per request, not per seat"
          lede="The first ten thousand requests a month are free — forever. After that the price per thousand drops with volume. Move the slider to your load."
          tiers={[
            { upTo: 10000, perThousand: 0, label: "first 10 000" },
            { upTo: 1000000, perThousand: 0.4, label: "up to 1M" },
            { upTo: 10000000, perThousand: 0.25, label: "up to 10M" },
            { upTo: Infinity, perThousand: 0.12, label: "over 10M" },
          ]}
          primaryLabel="Start for free"
          secondaryLabel="Need a contract"
          fine={["No card up to 10 000", "Invoice at the end of the month", "Limits and alerts in the dashboard"]}
          millionUnit="M"
          thousandUnit="k"
          decimalSeparator="."
          requestsLabel="Requests per month"
          requestsUnit="requests / mo"
          requestsValue="{n} requests"
          totalLabel="Total per month"
          monthUnit="mo"
          effectiveLine="effectively {effective} per 1 000 · {rate} at the current tier"
          freeLabel="free"
          chartLabel="Rate ladder: price per thousand requests by volume"
          yLabel="{currency} per 1 000 requests"
          xLabel="requests per month →"
        />
      </div>
      <div id="status">
        <Api002
          {...terminal}
          eyebrow="Status"
          title="Lives in four regions"
          lede="A request goes to the nearest region. The panel updates every second, the history covers 90 days, no retouching."
          summary="All systems operational"
          regions={[
            { name: "Moscow", code: "msk-1", uptime: "99.99%", latency: 38 },
            { name: "Saint Petersburg", code: "spb-1", uptime: "99.98%", latency: 44 },
            { name: "Frankfurt", code: "fra-1", uptime: "100%", latency: 61 },
            { name: "Almaty", code: "ala-1", uptime: "99.97%", latency: 72 },
          ]}
          historyLabel="90 days · 2 degradations · 0 outages"
          statusLabels={["operational", "degraded", "down"]}
          uptimeLabel="uptime 30 d"
          p50Label="p50 now"
          sparkLabel="Latency {name} over 24 hours"
          axisLabels={["−24 h", "−12 h", "now"]}
          updatedLine="updated {time}"
          historyTitle="history"
        />
      </div>
      <div id="compare">
        <Comparison015
          {...terminal}
          eyebrow="Comparison"
          title="Honestly against three others"
          lede="Numbers from public price lists and our measurements as of September 2026. Click a row — we'll show how it looks in the API response."
          columns={["Geokod", "AddrPro", "MapOne", "GeoCloud"]}
          rows={[
            { label: "Building-level accuracy in Russia", values: ["98.4%", "96.1%", "97.2%", "88.0%"], detail: "Measured on a control sample of 50 000 delivery addresses in 85 regions: the share of answers with «house» precision and an error under 30 metres.", sample: ['"precision": "house",', '"confidence": 0.98,', '"distance_m": 4'] },
            { label: "Median response", values: ["42 ms", "120 ms", "85 ms", "210 ms"], detail: "Measured from Moscow over the last 30 days, p50 on the /geocode endpoint. The request goes to the nearest region automatically.", sample: ['"took_ms": 42,', '"region": "msk-1",', '"cached": false'] },
            { label: "Price per 1 000 requests", values: ["0.40 ₽", "1.20 ₽", "0.90 ₽", "4.50 ₽"], detail: "The rate of the first paid tier. Cheaper with volume: from a million — 0.25 ₽, from ten — 0.12 ₽. We round in your favour.", sample: ['"billing": {', '  "tier": "1m",', '  "per_1000": 0.40', "}"] },
            { label: "Free per month", values: ["10 000", "1 000", "25 000*", "0"], detail: "Ten thousand requests a month with no card and no branding. The asterisk at a competitor — the free quota only comes with showing their map.", sample: ['"quota": {', '  "free": 10000,', '  "used": 2, ', '  "resets_at": "2026-10-01"', "}"] },
            { label: "Batch processing", values: ["up to 1M", "no", "up to 100k", "no"], detail: "Upload a CSV — collect a CSV. A million addresses are processed in twelve minutes; the status can be polled or delivered by webhook.", sample: ['"job": "btch_91ka",', '"rows": 1000000,', '"eta_s": 720'] },
            { label: "Data stored in Russia", values: ["yes", "yes", "yes", "no"], detail: "All processing regions and log storage are in data centres in Russia. No cross-border transfer, it's written into the contract.", sample: ['"storage": "ru",', '"log_retention_days": 30'] },
            { label: "SLA in the contract", values: ["99.9%", "—", "99.5%", "99.9%"], detail: "On all paid volumes. For every 0.1% below — we refund 10% of the monthly invoice, no tickets and no correspondence.", sample: ['"sla": 0.999,', '"credit_policy": "auto"'] },
          ]}
          note="* — the competitor's free quota only applies when showing their map and logo."
          criterionLabel="criterion"
          othersLabel="Others"
        />
      </div>
      <div id="changelog">
        <Changelog013
          {...terminal}
          title="What changed"
          lede="Every version with a date, tags and a list. Breaking changes are announced six months ahead and the old version is kept all that time."
          entries={[
            { version: "v2.4.0", date: "12 Sep 2026", title: "Address suggestions ranked by geolocation", tags: ["new", "perf"], items: ["/suggest accepts lat/lon and ranks nearby addresses higher", "The /suggest median dropped from 31 to 24 ms thanks to a new index", "The postal_code field is now in every /geocode response"] },
            { version: "v2.3.2", date: "28 Aug 2026", title: "Reverse geocoding fixes", tags: ["fix"], items: ["/reverse on region borders returned the neighbouring district — fixed", "Empty house in Kazan and Ufa responses"] },
            { version: "v2.3.0", date: "4 Aug 2026", title: "Distance matrix up to 100 × 100", tags: ["new"], items: ["/matrix computes up to 10 000 pairs in one request", "Profiles car, walk, bike; traffic — for car by default", "Webhooks for /batch: the status arrives on its own"] },
            { version: "v2.0.0", date: "1 Jun 2026", title: "The second version of the API", tags: ["breaking"], items: ["The /geocode response: results is an array, not an object; precision instead of kind", "Keys like gk_live_… and gk_test_…; the old ones work until 1 December", "A single error format with a code field"] },
          ]}
          allLabel="All versions"
          installTitle="Install the SDK"
          tabsLabel="Package manager"
          copyLabel="copy"
          doneLabel="done"
          rpsLabel="requests / sec"
          todayLabel="today"
        />
      </div>
      <Logocloud007 {...terminal} label="used by" names={["Samokat", "Dostavista", "Citymobil", "Lamoda", "CDEK", "Wildberries", "Ozon", "Yandex Eats", "Boxberry", "Delivery Club", "Cian", "Avito"]} />
      <div id="reviews">
        <Testimonials034
          {...terminal}
          eyebrow="Reviews"
          title="What those who've already integrated say"
          lede="Unretouched: developers from delivery, logistics, taxi and e-commerce. The metrics are theirs, not ours."
          reviews={[
            { handle: "@lena_builds", name: "Lena Guseva", role: "Tech lead, food delivery", text: "Migrated from a homemade geocoder in one sprint. Building-level accuracy went up, and couriers stopped calling «where is this». The TypeScript SDK is typed down to the last field.", stack: ["Next.js", "TypeScript"], metric: "−70% courier calls" },
            { handle: "@mzhukov", name: "Maxim Zhukov", role: "Backend, logistics", text: "The 100 × 100 matrix answers faster than our database can write the result. Started a million-address batch in the evening — the CSV was there in the morning.", stack: ["Go", "PostgreSQL"], metric: "1 000 000 addresses in 12 min" },
            { handle: "@a.petrova", name: "Anya Petrova", role: "Frontend, e-commerce", text: "Address suggestions in the order form — twenty lines of code. Customers finish typing the address three times less often, because it fills itself in.", stack: ["React", "Vite"], metric: "+11% completed orders" },
            { handle: "@d_orlov", name: "Dima Orlov", role: "CTO, regional taxi", text: "The Almaty region appeared when we were expanding there — asked support, a month later it was up. Not a single outage in a year, the status panel is honest.", stack: ["Python", "FastAPI"], metric: "99.99% over 12 months" },
            { handle: "@katya.ops", name: "Katya Melnik", role: "DevOps", text: "Limits, alerts and invoices in one dashboard. When traffic grew sixfold during a sale, nothing fell over and nobody called — the invoice just got bigger.", stack: ["Kubernetes", "Grafana"], metric: "×6 traffic with no degradation" },
            { handle: "@sergey_v", name: "Sergey Volkov", role: "Independent developer", text: "Ten thousand free requests are plenty for a pet project. Got the key in half a minute, no card asked. The docs have examples in four languages.", stack: ["Node.js"], metric: "0 ₽ for eight months now" },
          ]}
          stackLabel="Stack"
        />
      </div>
      <div id="key">
        <Cta035
          {...terminal}
          title="A key in 30 seconds"
          lede="Your email — and the key is already in the response. No card, no call from a manager, no «we'll get back to you». Ten thousand requests a month free."
          actionLabel="Get a key"
          fine={["No card", "10 000 requests free", "Revoke in one click"]}
          doneTitle="The key is ready"
          doneText="Sent a copy to your email. You can make the first request right now — the quota resets on the first of the month."
          docsLabel="First request in the docs"
          emailLabel="Email"
          copyLabel="copy"
          doneLabel="done"
          elapsedLine="done in {s} s — we promised 30"
          decimalSeparator="."
        />
      </div>
      <Footer041
        {...terminal}
        caption="A geocoding, routing and address suggestion API. Pay per request, the first 10 000 a month are free."
        status="all systems operational"
        columns={[
          { title: "Product", links: [{ label: "Endpoints", href: "#endpoints" }, { label: "Pricing", href: "#pricing" }, { label: "Status", href: "#status" }, { label: "Changelog", href: "#changelog" }] },
          { title: "For developers", links: [{ label: "Documentation", href: "#docs" }, { label: "SDK and samples", href: "#sdk" }, { label: "Sandbox", href: "#sandbox" }, { label: "Limits and errors", href: "#limits" }] },
          { title: "Company", links: [{ label: "About", href: "#about" }, { label: "Support", href: "#support" }, { label: "Contract and SLA", href: "#sla" }, { label: "Telegram channel", href: "#tg" }] },
        ]}
        legal={[{ label: "Privacy", href: "#privacy" }, { label: "Terms", href: "#terms" }, { label: "Data processing", href: "#dpa" }]}
        copyright="© 2026 Geokod"
        navLabel="Site sections"
        buildLabel="Build"
      />
    </div>
  )
}
