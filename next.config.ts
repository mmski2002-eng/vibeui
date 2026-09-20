import type { NextConfig } from "next"

/**
 * Категории, слитые в более крупные: items переехали в папку родителя, их
 * адреса не изменились, а страница старой категории ведёт на новую.
 * Ключ — сегмент маршрута типа, значение — child → parent.
 */
const MERGED_CATEGORIES: Record<string, Record<string, string>> = {
  blocks: {
    bakery: "industry",
    charity: "industry",
    delivery: "industry",
    flowers: "industry",
    auto: "industry",
    course: "industry",
    realty: "industry",
    renovation: "industry",
    vet: "industry",
    writer: "industry",
    fintech: "industry",
    gadget: "industry",
    language: "industry",
    market: "industry",
    restaurant: "industry",
    api: "industry",
    app: "industry",
    opensource: "industry",
    podcast: "industry",
    comparison: "pricing",
    downloads: "cta",
    changelog: "blog",
    bento: "layout",
    cases: "portfolio",
    press: "logos",
    waitlist: "newsletter",
    stats: "about",
    video: "about",
    consent: "errors",
  },
}

const nextConfig: NextConfig = {
  // Самодостаточный сервер для деплоя на собственный VPS:
  // .next/standalone содержит node_modules, нужные в рантайме.
  output: "standalone",
  async redirects() {
    return Object.entries(MERGED_CATEGORIES).flatMap(([base, map]) =>
      Object.entries(map).flatMap(([child, parent]) =>
        ["", "/en"].map((prefix) => ({
          source: `${prefix}/${base}/${child}`,
          destination: `${prefix}/${base}/${parent}`,
          permanent: true,
        })),
      ),
    )
  },
}

export default nextConfig
