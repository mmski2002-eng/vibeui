import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/seo"

/**
 * Закрыто всё, что не является страницей каталога: `/preview` — голый iframe
 * без текста, `/c` и `/f` — артефакты для агента, `/r` — JSON реестра,
 * `/search` — выдача по произвольному запросу: индексировать её незачем.
 *
 * `/s` — бриф сценария для агента, как `/c`.
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
          "/search",
          "/en/search",
          "/s/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
