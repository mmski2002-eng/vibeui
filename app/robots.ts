import type { MetadataRoute } from "next"

import { getScenarios } from "@/lib/scenario"
import { SITE_URL } from "@/lib/seo"

/**
 * Параметры выбора на странице сценария: по одному на шаг. Список берётся из
 * самих сценариев, чтобы новый шаг не выпал из robots.txt молча.
 */
const SCENARIO_PARAMS = [
  ...new Set(
    getScenarios().flatMap((scenario) =>
      scenario.steps.map((step) => step.category),
    ),
  ),
].sort()

/**
 * Закрыто всё, что не является страницей каталога: `/preview` — голый iframe
 * без текста, `/c` и `/f` — артефакты для агента, `/r` — JSON реестра,
 * `/search` — выдача по произвольному запросу, `/lab` — внутренняя песочница.
 *
 * Отдельно закрыты сценарии с query. Выбор блоков живёт в параметрах адреса,
 * на каждой такой странице ещё 25 ссылок с накопленным набором — комбинации
 * перемножаются. За сутки 08.09.2026 один GPTBot прошёл так 114 550 адресов,
 * по два серверных рендера в секунду на единственном ядре VPS
 * (`docs/HOSTING-AUDIT.md`). Сам сценарий без параметров остаётся открытым.
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
          "/scenarios/*?",
          "/en/scenarios/*?",
        ],
        // Директива Яндекса: перечисленные параметры не меняют содержимое, и
        // адреса с ними склеиваются с чистым. Disallow выше уже запрещает
        // обход, Clean-param снимает их и из очереди. Остальные краулеры
        // неизвестную директиву игнорируют.
        other: {
          "Clean-param": [
            `${SCENARIO_PARAMS.join("&")} /scenarios/`,
            `${SCENARIO_PARAMS.join("&")} /en/scenarios/`,
          ],
        },
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
