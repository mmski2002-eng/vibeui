import type { MetadataRoute } from "next"

import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  localePath,
} from "@/lib/i18n"
import { getScenarios } from "@/lib/scenario"
import { SITE_URL } from "@/lib/seo"
import { KINDS } from "@/registry/categories"
import {
  catalogBasePath,
  getCategoryCards,
  getItemKind,
  getItemsByKind,
  itemBasePath,
} from "@/registry/index"

type Entry = MetadataRoute.Sitemap[number]

/**
 * Один URL на каждый язык плюс перекрёстные hreflang: Яндекс и Google берут
 * языковые пары именно отсюда, дублировать их в разметке страницы не нужно.
 */
function url(locale: Locale, path: string): string {
  // Корень canonical'ом отдаётся без слэша — sitemap должен совпасть с ним
  // байт в байт, иначе Яндекс покажет расхождение адресов.
  return `${SITE_URL}${localePath(locale, path)}`.replace(/\/$/, "")
}

function localized(path: string, rest: Omit<Entry, "url">): Entry[] {
  const languages = {
    ...Object.fromEntries(
      LOCALES.map((locale) => [locale, url(locale, path)]),
    ),
    "x-default": url(DEFAULT_LOCALE, path),
  }

  return LOCALES.map((locale: Locale) => ({
    url: url(locale, path),
    ...rest,
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const kinds = KINDS.map((kind) => kind.slug).filter(
    (kind) => kind !== "template",
  )

  const catalogs = kinds.flatMap((kind) =>
    localized(catalogBasePath(kind), {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    }),
  )

  const categories = kinds.flatMap((kind) =>
    getCategoryCards(kind).flatMap((category) =>
      localized(`${catalogBasePath(kind)}/${category.slug}`, {
        lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      }),
    ),
  )

  const items = kinds.flatMap((kind) =>
    getItemsByKind(kind).flatMap((item) => {
      // Тип item'а решает раздел: kind из выборки и kind из индекса совпадают,
      // но путь строим по индексу — он источник истины для маршрута.
      const base = itemBasePath(getItemKind(item.name) ?? kind)

      return localized(`${base}/${item.name}`, {
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    }),
  )

  const scenarios = [
    ...localized("/scenarios", {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...getScenarios().flatMap((scenario) =>
      localized(`/scenarios/${scenario.slug}`, {
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    ),
  ]

  return [
    ...localized("/", {
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    }),
    ...catalogs,
    ...scenarios,
    ...categories,
    ...items,
  ]
}
