export const CATEGORIES = [
  { slug: "hero", label: "Hero" },
  { slug: "navbar", label: "Navbar" },
  { slug: "features", label: "Features" },
  { slug: "pricing", label: "Pricing" },
  { slug: "testimonials", label: "Testimonials" },
  { slug: "faq", label: "FAQ" },
  { slug: "cta", label: "CTA" },
  { slug: "footer", label: "Footer" },
  { slug: "ai", label: "AI" },
  { slug: "dashboard", label: "Dashboard" },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]["slug"]
