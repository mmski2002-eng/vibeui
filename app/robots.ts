import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/seo"

/**
 * Закрыто всё, что не является страницей каталога: `/preview` — голый iframe
 * без текста, `/c` и `/f` — артефакты для агента, `/r` — JSON реестра,
 * `/search` — выдача по произвольному запросу, `/lab` — внутренняя песочница.
 *
 * Отдельно закрыты сценарии с query: выбор блоков живёт в параметрах адреса,
 * комбинации перемножаются, и краулер читает их как разные страницы. За сутки
 * 08.09.2026 один GPTBot прошёл так 114 550 уникальных адресов — по два
 * серверных рендера в секунду на единственном ядре VPS. Сам сценарий без
 * параметров остаётся открытым (docs/HOSTING-AUDIT.md).
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
          "/scenarios/*?*",
          "/en/scenarios/*?*",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
