import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/seo"

/**
 * Закрыто всё, что не является страницей каталога: `/preview` — голый iframe
 * без текста, `/c` и `/f` — артефакты для агента, `/r` — JSON реестра,
 * `/search` — выдача по произвольному запросу, `/lab` — внутренняя песочница.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/preview/",
          "/c/",
          "/f/",
          "/r/",
          "/lab",
          "/search",
          "/en/search",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
