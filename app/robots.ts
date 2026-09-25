import type { MetadataRoute } from "next"
import { headers } from "next/headers"

import { CLUB_ORIGIN, isClubHost, RU_ORIGIN } from "@/lib/seo"

/**
 * Закрыто всё, что не является страницей каталога: `/preview` — голый iframe
 * без текста, `/c` и `/f` — артефакты для агента, `/r` — JSON реестра,
 * `/search` — выдача по произвольному запросу: индексировать её незачем.
 *
 * `/s` — бриф сценария для агента, как `/c`.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = isClubHost((await headers()).get("host"))
    ? CLUB_ORIGIN
    : RU_ORIGIN

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
          "/s/",
        ],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
